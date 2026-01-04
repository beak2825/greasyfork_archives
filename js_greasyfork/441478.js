// ==UserScript==
// @name         IMDb - fix rating
// @namespace    https://github.com/Procyon-b
// @version      0.5.4
// @description  Recompute a new film rating value based on your criterias
// @author       Achernar
// @include      /^https:\/\/www\.imdb\.com\/title\/[^\/]+\/(episodes|reference|ratings)?(\?.*)?$/
// @match        https://www.imdb.com/chart/*
// @match        https://www.imdb.com/search/title/*
// @match        https://www.imdb.com/list/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441478/IMDb%20-%20fix%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/441478/IMDb%20-%20fix%20rating.meta.js
// ==/UserScript==

(function() {
"use strict";

var E, Ep, Er, rt, tv, opts, dialog,
  Layouts={
    'title':{
      L:'[data-testid="hero-rating-bar__aggregate-rating"]',
      rt:'span[class^="AggregateRatingButton__RatingScore-sc-"], [data-testid="hero-rating-bar__aggregate-rating__score"] span',
      tv:'div[class^="AggregateRatingButton__TotalRatingAmount-sc-"], [data-testid="hero-rating-bar__aggregate-rating__score"] ~ :last-child',
      divide:true,
      type:'page'
      },
    'reference':{
      L:'.titlereference-header .ipl-rating-star',
      rt:'.titlereference-header .ipl-rating-star .ipl-rating-star__rating',
      tv:'.titlereference-header .ipl-rating-star .ipl-rating-star__total-votes',
      tvF:function(tv,r) {
        if (!tv || !r) return;
        let vtv=r.querySelector('.vtv');
        if (!vtv) {
          let RE=/^(.*?)([^()]+)(.*)$/s.exec(tv.innerText);
          tv.innerHTML=(RE[1]||'')+'<span class="vtv">'+RE[2]+'</span>'+(RE[3]||'');
          vtv=tv.querySelector('.vtv');
          }
        return vtv;
        },
      type:'page'
      },
    'ratings':{
      L:'.subpage_title_block__right-column .ipl-rating-widget',
      rt:'.subpage_title_block__right-column .ipl-rating-widget .ipl-rating-star__rating',
      type:'page'
      },
    'EpLst':{
      L:'.eplist .list_item',
      rt:'.ipl-rating-widget .ipl-rating-star .ipl-rating-star__rating',
      tv:'.ipl-rating-widget .ipl-rating-star .ipl-rating-star__total-votes',
      tvF:function(tv,r) {
        if (!tv || !r) return;
        let vtv=r.querySelector('.vtv');
        if (!vtv) {
          let RE=/^(.*?)([^()]+)(.*)$/s.exec(tv.innerText);
          tv.innerHTML=(RE[1]||'')+'<span class="vtv">'+RE[2]+'</span>'+(RE[3]||'');
          vtv=tv.querySelector('.vtv');
          }
        return vtv;
        },
      nm:'a[itemprop="url"]:only-child, a.add-image ~ div',
      url:'a[itemprop="name"]',
      tit:'page',
      type:'list'
      },
    'Chart':{
      k:'chart',
      L:'.lister-list > tr',
      rt:'.ratingColumn.imdbRating > strong',
      url:'.titleColumn a[href*="/title/"]',
      titF:function(tit, r){
        if (!tit || !r) return;
        let n=tit.nextElementSibling;
        return tit.innerText + (n?' '+n.innerText:'');
        },
      tit:'item',
      type:'list'
      },
    'List':{
      k:'list',
      L:'.article.listo .lister-list > div',
      rt:'.ipl-rating-widget .ipl-rating-star__rating',
      tv:'.lister-item-content > p.text-muted.text-small > span[name="nv"]',
      url:'.lister-item-content a[href*="/title/"]',
      titF:function(tit, r){
        if (!tit || !r) return;
        let n=tit.nextElementSibling;
        return tit.innerText + (n?' '+n.innerText:'');
        },
      tit:'item',
      type:'list'
      },
    'Search':{
      k:'search',
      L:'.lister-list > div',
      rt:'.inline-block.ratings-imdb-rating > strong',
      tv:'.sort-num_votes-visible [name="nv"]',
      url:'.lister-item-content a[href*="/title/"]',
      titF:function(tit, r){
        if (!tit || !r) return;
        let n=tit.nextElementSibling;
        return tit.innerText + (n?' '+n.innerText:'');
        },
      tit:'item',
      type:'list'
      },
    'SearchCompact':{
      k:'search',
      L:'.lister-list > div',
      rt:'.col-imdb-rating > strong',
      url:'.lister-item-header a[href*="/title/"]',
      titF:function(tit, r){
        if (!tit || !r) return;
        let n=tit.nextElementSibling;
        return tit.innerText + (n?' '+n.innerText:'');
        },
      tit:'item',
      type:'list'
      }
    };

var XHRqueue=[], XHRqueueV, purging;

function rstXHRq() {
  XHRqueue=[];
  XHRqueueV=Date.now();
  }

var defOpts={
    voters: '',
    k10: false,
    k10_max: false,
    k10_maxmax: false,
    k9_pc_10: 20,
    k9_max_do: false,
    k9_max: false,
    k9_max_10: false,
    k10_9_pcOn: false,
    k10_9_pc: 90,
    k1: false,
    purge: 16,
    search: false,
    chart: false,
    list: false
    };

var List, rtQS, tvQS, nmQS, urlQS, tvF, LO;
// look for rates
for (let k in Layouts) {
  LO=Layouts[k];
  if (LO.type=='page') {
    E=document.querySelector(LO.L);
    if (E) break;
    continue;
    }
  List=document.querySelectorAll(LO.L);
  if (List.length) {
    rtQS=LO.rt;
    // rating found?
    if (!rtQS || (!List[0].querySelector(rtQS) && (List[1] && !List[1].querySelector(rtQS)) && (List[2] && !List[2].querySelector(rtQS)) ) ) {
      List=[]; continue;}
    tvQS=LO.tv;
    nmQS=LO.nm;
    urlQS=LO.url;
    tvF=LO.tvF;
    break;
    }
  }


function getOpts() {
  opts=GM_getValue('opts', {});
  opts= Object.assign({}, defOpts, opts);
}
getOpts();

addSt(`
.oldVal::before {
  content: var(--oldSc);
  font-size: 0.8em;
  margin-right: 0.6em;
  text-decoration: line-through brown;
  line-height: 1em;
  color: gray;
}
.oldVal.noMod::before {
  content: "=" !important;
  text-decoration: none !important;
}
.waiting.oldVal::before {
  content: "?" !important;
  text-decoration: none !important;
}
div[class^="AggregateRatingButton__ContentWrap-sc-"]:hover .oldVal::before,
.rating-bar__base-button:hover .oldVal::before,
.ipl-rating-star.small:hover .oldVal::before, .oldVal:hover::before {
  text-decoration: none !important;
}

[data-testid="hero-rating-bar__aggregate-rating"] {
  position: relative;
}
#fix_rating_opt {
  position: absolute;
  color: black;
  background-color: white;
  top: 5em;
  z-index: 10000 !important;
  font-size: 13px;
  font-family: arial;
  line-height: 1.4em;
  padding: 3px 8px;
  border: 2px solid gray;
  margin: 0 50%;
}
#fix_rating_opt.list {
  position: fixed;
}
#fix_rating_opt {
  white-space: nowrap;
}
#fix_rating_opt #close {
  float: right;
  color: red;
  cursor: pointer;
  z-index: 2;
  position: relative;
}
#fix_rating_opt input[type="number"] {
  width: 3em;
}
#fix_rating_opt input[type="checkbox"] {
  vertical-align: middle;
}
#fix_rating_opt .mrg {
  margin-left: 1em;
}
#fix_rating_opt button, #fix_rating_opt input[type="button"] {
  font-weight: initial;
  padding: 1px 6px;
  cursor: initial;
}
#fix_rating_opt b {
  font-weight: bolder;
}
#fix_rating_opt.list #reset ~ *:not(.show) {
  display: none;
}
#fix_rating_opt span {
  font-size: inherit !important;
  line-height: inherit !important;
}
#fix_rating_opt input[type="checkbox"] {
  margin: 0 3px;
}
#fix_rating_opt input, #fix_rating_opt button {
  margin: 0 0 1px 0;
}
#fix_rating_opt input[type="number"] {
  padding: 0 !important;
  line-height: 1em !important;
}
#fix_rating_opt hr {
  border: none !important;
  height: 0 !important;
  margin-block-start: 0.3em !important;
  margin-block-end: 0.3em !important;
}
#fix_rating_opt #cached {
  display: inline-block;
  vertical-align: top;
}
#fix_rating_opt [name="k9_max_do"]:not(:checked) + .mrg {
  display: none;
}
#fix_rating_opt #hdr {
  cursor: grab;
  background: lightgray;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding: 3px 8px;
}
#fix_rating_opt.grabbed #hdr {
  cursor: grabbing;
}
`);

GM.registerMenuCommand('Settings', function(){
  showCfg();
  });

var trig=E || document.querySelector('h1.header');

if (trig) trig.addEventListener('click', function(ev){
  if (ev.ctrlKey && ev.altKey) {
    ev.preventDefault();
    ev.stopPropagation();
    showCfg();
    }
  }, {capture:true});

// init dialog
if (!E) if ( (!opts.search && (LO.k=='search'))
    || (!opts.chart && (LO.k=='chart'))
    || (!opts.list && (LO.k=='list'))
   ) {
  List=[];
  }


function getListRating() {
  if (!List || !List.length) return;
  rstXHRq();
  getOpts();
  let w=10;
  List.forEach(function(Ep){
    var url=urlQS && Ep.querySelector(urlQS),
      tit=(LO.titF && LO.titF(url,Ep)) || (url && url.innerText),
      nm=nmQS && Ep.querySelector(nmQS),
      num=nm? nm.innerText.replace(/^.*?(\d+).*?(\d+).*$/ms, '$1.$2') :'',
      rt=rtQS && Ep.querySelector(rtQS),
      tv=tvQS && Ep.querySelector(tvQS);

    if (!rt && !tv) return;
    if (tvF) tv=tvF(tv,Ep);
    if (rt && !decSep) {
      let RE=/^.*([\D]).*$/.exec(rt.innerText);
      if (RE) decSep=RE[1];
      }
    if (tv && !thSep) {
      let RE=/\d([\D])\d\d\d$/.exec(tv.innerText);
      if (RE) thSep=RE[1];
      }

    if (tit && (LO.tit=='page')) tit=document.title.replace(/ +- imdb *$/i,'')+(num?' - '+num:'')+' - '+tit;
    setTimeout(function(){display(url.pathname, rt, tv, tit);},w);
    w+=10;
    });
  }


var decSep, thSep;

if (E) {
  rt=document.querySelector(LO.rt);
  tv=document.querySelector(LO.tv);
  if (!rt) return;
  if (tv && LO.tvF) tv=LO.tvF(tv,E);
  if (rt && !decSep) {
    let RE=/^.*([\D]).*$/.exec(rt.innerText);
    if (RE) decSep=RE[1];
    }
  if (tv && !thSep) {
    let RE=/\d([\D])\d\d\d$/.exec(tv.innerText);
    if (RE) thSep=RE[1];
    }
  let RE=/^.*([\D]).*$/.exec(rt.innerText);
  if (RE) decSep=RE[1];
  // imdb script rewriting the values
  let obs=new MutationObserver(function(mutL){
    for (let mut of mutL) {
      if (mut.type=='characterData') {
        let n=mut.target.parentNode;
        if (n.curV && (n.curV != n.innerText)) {
          n.innerText=n.curV;
          }
        }
      }
    });
  obs.observe(E, {childList: false, subtree: true, characterData:true});

  display(location.pathname, rt, tv, '', {divide:LO.divide});
  }
else {
  getListRating();
  if (List.length) {
    var ec=document.querySelector('#episodes_content');
    if (ec) {
      new MutationObserver(function(mutL){
        if (mutL[0].addedNodes.length) {
          setTimeout(function(){
            List=document.querySelectorAll(LO.L);
            getListRating();
            },0);
          }
        }).observe(ec, {childList: true, subtree: false});
      }
    else if (ec=document.querySelector('.lister.list.detail.sub-list > .row.lister-working.hidden')) {
      new MutationObserver(function(mutL){
        if ( (mutL[0].attributeName == 'style') && (mutL[0].target.style.display == 'none') ) {
          setTimeout(function(){
            List=document.querySelectorAll(LO.L);
            getListRating();
            },0);
          }
        }).observe(ec, {childList: true, subtree: false, attributes: true});
      }
    }
  }

// init dialog
if (!dialog) display();


function addSt(s,t) {
  let st=document.createElement('style');
  try{
    (document.head || document.documentElement).appendChild(st);
    st.textContent=s;
  }catch(e){
    if (t) document.addEventListener('DOMContentLoaded',function(){addSt(s);});
    else setTimeout(function(){addSt(s,t);},0);
    }
  }

function showCfg() {
  let xy=E && E.getBoundingClientRect();
  if (E) dialog.style='top:'+(window.scrollY+parseInt(xy.y)+80)+'px;';
  else dialog.classList.add('list');
  document.body.appendChild(dialog);
  }


function display(href, rt, tv, tit='', o={}) {

function waiting(v) {
  rt && rt.classList.toggle('waiting', v);
  tv && tv.classList.toggle('waiting', v);
}

rt && rt.classList.add('oldVal');
tv && tv.classList.add('oldVal');

function sendXHR(a) {
  if (!a || !a.R) return;
  a.R.open('GET', '/title/'+a.id+'/ratings'+a.v);
  a.R.send();
  }

function getRatings(id, vt=opts.voters) {
//TMP new design 202305
vt='';

  waiting(true);
  var v, R=new XMLHttpRequest(), XHRqV=XHRqueueV;
  R.addEventListener('error',function(){
    if (XHRqV != XHRqueueV) return;
    setTimeout(function(){
      sendXHR(XHRqueue.shift());
      },0);
    });

  R.addEventListener('load',function(r){
    if (XHRqV != XHRqueueV) return;
    parse(this.responseText, vt);
    setTimeout(function(){
      sendXHR(XHRqueue.shift());
      },50);
    });

  switch(vt) {
    case '': v=''; break;
    case 'us': v='?demo=us_users'; break;
    case 'nus': v='?demo=non_us_users'; break;
    case 'top': v='?demo=top_1000_voters'; break;
    default: return;
    }

  if (!XHRqueue.length) {
    setTimeout(function(){ sendXHR(XHRqueue.shift()); },0);
    setTimeout(function(){ sendXHR(XHRqueue.shift()); },400);
    }
  XHRqueue.push({R,id,v});
  } // END getRatings()

var v, pc, tot, A={}, A0={}, A8={}, voters, votersL, h=[-1,-1], H=[], mod;

function fill_H(a) {
  H=[];
  for (let k in a) {
    H.push( ('000000000'+a[k].tot).substr(-10) +'_'+ ('0'+k).substr(-2) );
    }
  H.sort().reverse();
  for (let i in H) H[i]=[ parseInt(H[i].split('_')[1]), parseInt(H[i].split('_')[0])];
  }

function parse(s,voters='') {
  var parser=new DOMParser(), S=Date.now(),
    h=parser.parseFromString(s, 'text/html'),
    data=h.querySelectorAll('table td'),
    fData=h.querySelector('#__NEXT_DATA__'),
    R={};

  if (fData) {
    try {
      fData=JSON.parse(fData.textContent).props.pageProps.contentData.histogramData;
    }catch(e){fData=null;}
    }

  // extract rating value % tot
  var i, j, k;
  k=pc=tot=null; A={}; A0={}; h=[-1,-1]; /*H=[];/**/

  // formatted data (starting 2023-05)
  if (fData) {
    let A=fData.histogramValues;
    for (let i=0; A[i]; i++) {
      A0[A[i].rating]={k:A[i].rating, pc:'-', tot: A[i].voteCount};
      }
    }
  // error in parsing
  else if ( !data[0] || ((v=parseInt(data[0].innerText)) !==10) ) {
    R.status='data unavailable';
    R.maxAge=S+3600000; // +1h
    for (k=1; k<11 ; k++) {
      A0[k]={k,pc:0,tot:0};
      }
    }
  else for (i=0; v=data[i].innerText; i++) {
    if (k==null) k=parseInt(v);
    else if (pc==null) pc=parseFloat(v) || 0;
    else if (tot==null) {
      tot=parseInt(v.replace(/\D/g,'')) || 0;
      if (tot>h[1]) h=[k,tot];
      A0[k]={k,pc,tot};
      if (k==1) break;
      k=pc=tot=null;
      }
    }

  data=h=null;

  fill_H(A0);

  let d=new Date(), key=id+voters;
  let ep=document.querySelector('[class*="EpisodeNavigationForEpisode__SeasonEpisodeNumbers-"]') || '';
  if (ep) ep=ep.innerText.replace(/^.*?(\d+).*?(\d+).*$/s, '$1.$2');
  let t=d.getFullYear()+'/'+String(d.getMonth() + 1).padStart(2, '0')+'/'+ String(d.getDate()).padStart(2, '0') +' '+
    String(d.getHours()).padStart(2, '0')+':'+String(d.getMinutes()).padStart(2, '0');

  Object.assign(R,
   {t:S, key, cmt: t +' -- '+
    ( tit? tit : document.title.replace(/ +- +imdb *$/i,'').replace(/"(.+?)"/, ep?'$1 - '+ep+' -':'$1') )
    , data:JSON.stringify({A0,H}) });
  GM_setValue(key, R);
  fill_vars(R);
  upd_ratings();
  // upd cache date
  upd_dialog();
  } // END parse()

function upd_ratings() {
  if (!ratings || !ratings.key || (ratings.key != id+opts.voters) ) {
    loadRatings();
    return;
    }

  A=JSON.parse(JSON.stringify(A0));
  mod=false;

  if (opts.k10_maxmax && (H[0][0]==10) ) {
    if (A[9].tot < (A[10].tot * opts.k9_pc_10 /100) ) { delete A[10]; mod=true; }
    }

  if (opts.k10_max && (H[0][0]==10) ) {
    let noCv=true;
    if (noCv) {
      delete A[10]; mod=true;
      if (H[1][0]==9) {
        let _9=A[9].tot, _7=A[7].tot;
        if (opts.k9_7_pcOn && opts.k9_7_pc) if (A[7].tot / H[1][1] < (opts.k9_7_pc / 100) ) {delete A[9]; mod=true;}
        }
      }
    }
  if ( (H[0][0]==9) && opts.k9_max_do) {
    let _9=A[9].tot, _10=A[10].tot;
    if (opts.k9_max) { delete A[9]; mod=true; }
    if (opts.k9_max_10) { delete A[10]; mod=true; }
    else if (opts.k10_9_pcOn && opts.k10_9_pc) if (_10 >= (_9 * opts.k10_9_pc / 100) ) {delete A[10]; mod=true;}
    }
  if (opts.k10) delete A[10];
  if (opts.k1) delete A[1];
  var e, newR=0, newRAlt=0;
  tot=v=0;
  for (let i in A) {
    let k=A[i];
    tot += k.tot;
    v += k.k * k.tot;
    }

  // !!!!! temp
  mod=true;

  newR=(v/tot) || 0;

  for (let i in A) {
    let k=A[i];
    newRAlt += k.k * k.tot / tot;
    }

  waiting(false);

  if (e=rt) {
    if (!e.style.cssText) {
      e.style='--oldSc:"'+e.innerText+'"';
      e.oldV=e.innerText;
      if (decSep) e.oldV=e.oldV.replace( new RegExp('\\'+decSep), '.');
      }
    let t=newR && newR.toFixed(1);
    if (o.no0) t=t.replace(/\.0$/,'');
    e.curV=t;
    e.innerText= t || '!';
    e.classList.toggle('noMod',t == e.oldV);
    }
  if (e=tv) {
    if (!e.style.cssText) {
      e.style='--oldSc:"'+e.innerText+'"';
      e.oldV=e.innerText;
      if (thSep) e.oldV=e.oldV.replace( new RegExp('\\'+thSep,'g'), '');
      if (decSep) e.oldV=e.oldV.replace( new RegExp('\\'+decSep), '.');
      }
    let t = (o.divide && tot)? round(tot) : tot;
    e.curV=t;
    e.innerText=t || '!';
    e.classList.toggle('noMod', parseFloat(t) == parseFloat(e.oldV) );
    }
  // upd cache date
  upd_dialog();
  } // END upd_ratings()

function round(n) {
  var U='';
  for (let u of ['K','M']) {
    if (n>1000) {
      n=(n/1000).toFixed( n<10000? 1:0 );
      U=u;
      }
    }
  return n.toString().replace(/\.0$/,'')+U;
  }

function fill_vars(v) {
  ratings=v;
  ratings.data=JSON.parse(ratings.data);
  A0=ratings.data.A0;
  H=ratings.data.H;
  }

function purge_cache() {
  purging=false;
  var all=GM_listValues(), purge=1000*60*60* (opts.purge||8), now=Date.now();
  for (let i of all) {
    let d=GM_getValue(i);
    if (d && d.t &&
        ( (d.t + purge < now )
        || (d.maxAge && (d.maxAge < now))
        )
       ) {
      GM_deleteValue(i);
      }
    }
}

function getValues(k) {
  ratings=GM_getValue(k, false);
  let now=Date.now();
  if (ratings &&
     ( (ratings.t + (1000*60*60* (opts.purge||8)) < now)
      || (ratings.maxAge && (ratings.maxAge < now) )
     ) 
    ) {
    return 0;
    }
  return Boolean(ratings);
  }

function loadRatings() {
  var unk=[];
  if (!voters) {
    A8={}; ratings8={t:[], key:id+opts.voters, data:{}};
    if (opts.voters=='usnus') {
      voters=['us','nus'];
      }
    else voters=[opts.voters];
    votersL=voters.length;
    }

  for (let i=0,vt; i < voters.length; i++) {
    vt=voters[i];
    if (!getValues(id+vt)) {
      unk.push(vt);
      if (ratings) {
        ratings=null;
        }
      if (voters.length == votersL) { 
        getRatings(id, vt);
        if (!purging) setTimeout(purge_cache,3000);
        purging=true;
        }
      continue;
      }

    fill_vars(ratings);

    if (votersL > 1) {
      merge_A();
      ratings8.t.push(ratings.t);
      }
    else unk=null;
    }

  voters=unk;
  if (votersL > 1) {
    if (!voters.length) {
      voters=null;
      ratings=ratings8;
      A0=ratings.data.A0=A8;
      fill_H(A0);
      ratings.data.H=H;
      }
    }

  if (!voters) {
    upd_ratings();
    }
  }

function merge_A() {
  for (let k in A0) {
    let a=A8[k], b=A0[k];
    if (!a && !b) return;
    A8[k]={k, 'tot': (a?a.tot:0)+b.tot};
    }
  } 


var ratings, ratings8, id, re= /^\/title\/([^\/]+)\/(rating)?/.exec(href);

if (re && re[1]) {
  id=re[1];
  loadRatings();
  }

// exit if dialog already created.
if (dialog) return;

dialog=document.createElement('div');
dialog.id='fix_rating_opt';
dialog.innerHTML=`<div id="close">&#10062;</div>
<!--h3>(Userscript) Fix rating - Settings</h3><!-->
<b id="hdr">Fix rating - Settings</b><hr><br>
<hr>
Count votes from: <select name="voters"><option value="">all voters</option>
<option disabled title="Currently disabled with new design" value="us">US voters</option>
<option disabled title="Currently disabled with new design" value="nus">non-US voters</option>
<option disabled title="Currently disabled with new design" value="top">Top 1000 voters</option>
<option disabled title="Currently disabled with new design" value="usnus">US & non-US voters</option></select>
<hr>
<input name="k10" type="checkbox" data-group="10">Ignore "10"<br>
<input name="k10_max" type="checkbox" data-group="10">Ignore "10" if is highest count<br>
<input name="k10_maxmax" type="checkbox" data-group="10">... "10" highest and if "9" is &lt; <input name="k9_pc_10" type="number" min="1" max="99">% of "10"<br>
<input name="k1" type="checkbox">Ignore "1"<br>
<hr>
<b>If "9" is highest : </b><input name="k9_max_do" type="checkbox">
<div class="mrg"><input name="k9_max" type="checkbox">discard "9"<br>
<input name="k9_max_10" type="checkbox" data-group="9_10">discard "10"<br>
<input name="k10_9_pcOn" type="checkbox" data-group="9_10">discard "10" if &gt;= <input name="k10_9_pc" type="number" min="1" max="99">% of "9"</div>
<hr>
Expire cached values after <input name="purge" type="number" data-norld min="1" max="99"> hours
<hr>
<nobr><input type="button" id="rldSettings" value="Reload settings"> (if modified in another window)</nobr><br>
<input type="button" id="reset" value="Reset to default"><br>
<hr>
<span>Rating values cached on: <span id="cached"></span></span><br>
<input type="button" id="clrCache" value="Refresh cache"><br class="show"><hr class="show"><br>
<div class="show">
<input type="checkbox" name="search" data-norld>Enable on "search" (need page reload)<br>
<input type="checkbox" name="chart" data-norld>Enable on "chart" (need page reload)<br>
<input type="checkbox" name="list" data-norld>Enable on "list" (need page reload)</div>
`;
dialog.querySelector('#close').onclick=function(){dialog.remove();dialog.style='';};
dialog.querySelector('#rldSettings').onclick=function(){
  getOpts();
  upd_dialog();
  upd_ratings();
  getListRating();
  };
dialog.querySelector('#clrCache').onclick=function(){
  getRatings(id, opts.voters);
  };
dialog.querySelector('#reset').onclick=function(){
  if (!confirm("Reset? You'll lose your changes.")) return;
  GM_deleteValue('opts');
  getOpts();
  upd_dialog();
  upd_ratings();
  getListRating();
  };

var cached=dialog.querySelector('#cached');

function upd_opts(e) {
  let k=e.name;
  if (k in opts) {
    if (e.type=='checkbox') opts[k]=e.checked;
    else opts[k]=e.value;
    }
  }

dialog.addEventListener('change', function(ev){
  let t=ev.target, g;
  if (g=t.dataset.group) {
    let a=dialog.querySelectorAll('[data-group="'+g+'"]:checked');
    a.forEach(function(e){
      if (e!==t) {
        e.checked=false;
        upd_opts(e);
        }
      });
    }
  upd_opts(t)
  GM_setValue('opts', opts);
  if ('norld' in t.dataset) return;
  upd_ratings();
  getListRating();
  });

var x=0, y=0, move=dialog.querySelector('#hdr');

function moving(ev) {
  var st=dialog.style;
  var Y= (E?ev.pageY:ev.clientY) -y, X= (E?ev.pageX:ev.clientX) -x;
  if ( (Y<0) || (X<0) ) return;
  st.top=Y+'px';
  st.left=X+'px';
  st.margin='0';
  }

move.onmousedown=function(ev){
  // ignore if not left click
  if (ev.buttons != 1) return;
  ev.preventDefault();
  var cCss=window.getComputedStyle(dialog);
  x=ev.offsetX+parseInt(cCss.borderLeftWidth); y=ev.offsetY+parseInt(cCss.borderTopWidth);
  document.body.addEventListener('mousemove', moving);
  dialog.onmouseup=mouseup;
  dialog.classList.add('grabbed');
  }

function mouseup(ev){
  document.body.removeEventListener('mousemove', moving);
  dialog.onmouseup=null;
  dialog.classList.remove('grabbed');
  }

function fixed(s,n) {
  return ('000'+s).substr(- n);
}

function upd_dialog() {
  if (!dialog) return;
  for (let k in opts) {
    let e=dialog.querySelector('[name="'+k+'"]');
    if (e) {
      if (e.type=='checkbox') e.checked=opts[k];
      else e.value=opts[k];
      }
    }
  if (cached && ratings) {
    let s='', a=ratings.t || [];
    if (!Array.isArray(a)) a=[a];

    for (let t of a) {
      t=new Date(t);
      if (s) s+='<br>';
      s+=t.getFullYear()+'/'+ fixed(t.getMonth()+1,2) +'/'+ fixed(t.getDate(),2) +' '+fixed(t.getHours(),2)+':'+fixed(t.getMinutes(),2);
      }
    cached.innerHTML=s;
    }
  }
upd_dialog();


} // END display()

})();