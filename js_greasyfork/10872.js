// ==UserScript==
// @name        neobux.com · AdList Page Mod
// @namespace   ns_neobux_AdList_Page_Mod
// @description Mod for AdList from neobux.com
// @include     /^http(s)?\:\/\/(.+\.)neobux\.com\/m\/v\/.*$/
// @include     /^http(s)?\:\/\/(.+\.)?neobux\.com\/v\/(?!(\?.*&xc\=)|(\?.*\/\?xc\=)|(\?xc\=))/
// @version     1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/10872/neobuxcom%20%C2%B7%20AdList%20Page%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/10872/neobuxcom%20%C2%B7%20AdList%20Page%20Mod.meta.js
// ==/UserScript==

//scrollTO: self.scrollTo(scrollX,ap_ctr.getBoundingClientRect().bottom + self.scrollY- self.innerHeight + tl.querySelector("script + div:not(.mbx)").getBoundingClientRect().height)

function cookieSet(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    var expires = 'expires='+d.toGMTString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}

function cookieGet(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return '';
}

var uJS_enabled=(cookieGet("__atuvc").length > 0);
uJS_enabled=(cookieGet("___utmvc").length == 0);
//uJS_enabled=(typeof(ubar_f) != "undefined");

var mainButton=true;

var isAdView=(location.pathname == "/v/");

var lHash=""; try {lHash=location.hash.substr(1)} catch(undefined) {}
if (lHash.length) history.replaceState("", "", location.origin + location.pathname + location.search); // This line removes the hash

var baseRef=(function() {
 var dsDOC=document.documentElement.dataset;
 if (typeof(dsDOC.random)=="undefined") dsDOC.random="refs:";
 do {
  var _random=1;
  while (_random===1) { _random=(Math.random()*1e15); }
  _random=(("0").repeat(15) + Math.floor(_random)).slice(-15);
 } while((new RegExp("\0020" + _random + "\0020")).test(dsDOC.random + "\u0020"));
 dsDOC.random+=("\u0020" + _random);
 return function() { return _random; };
})(); void(baseRef());

function _addStyle(css) {
 if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
 } else if (typeof PRO_addStyle != "undefined") {
  PRO_addStyle(css);
 } else if (typeof addStyle != "undefined") {
  addStyle(css);
 } else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
   heads[0].appendChild(node); 
  } else {
   // no head yet, stick it whereever
   document.documentElement.appendChild(node);
  }
 }
}

(function() {
 if (!uJS_enabled) return;
 Number.prototype.pad = function(l) { var t=Math.floor(this); if (Math.abs(t)<1) { return "0".repeat(l); }; var positive=(this>0); t=Math.abs(t); var e=t.toString().split("e"); e[0]+="0".repeat(parseInt(e[1])); return (positive?"":"-") + (("0").repeat(l) + e[0]).slice(-l); }
 Number.prototype.toBoolean=function() { var t=!this.valueOf(); return(!t); }
 String.prototype.xItem=Array.prototype.xItem=HTMLCollection.prototype.xItem=function(num) { if ((num >= this.length) || (num < -this.length)) { return undefined; }; var p=(this.length+num)%this.length; return this[p]; }
 Element.prototype.copyNode=function(deep) { var c=document.createElement("DIV"); c.appendChild(this.cloneNode(deep)); [].forEach.call(c.querySelectorAll("[id]"), function(elem) { elem.removeAttribute("id"); }); return c.firstChild; }
 Element.prototype.setTagName=function(strTN) { var oHTML=this.outerHTML, tempTag=document.createElement(strTN); var tName={original: this.tagName.toUpperCase(), change: strTN.toUpperCase()}; if (tName.original == tName.change) { return; }; oHTML=oHTML.replace(RegExp("(^\<" + tName.original + ")|(" + tName.original + "\>$)","gi"), function(x){return (x.toUpperCase().replace(tName.original, tName.change));}); tempTag.innerHTML=oHTML; this.parentElement.replaceChild(tempTag.firstChild,this); }
 
 if (isAdView) return;
 
 var css = [
  //var css = "#ap_h { pointer-events: none !important; }";
  //css+=     "#ap_ctr[disabled] {cursor: default !important;}";
  //css+=     "#ap_ctr {cursor: pointer !important;}";
  "@charset 'UTF-8';",
  
  //"a#ap_h { display:none !important; }",
  
  //".uJS_" + baseRef() + "_buttonbarScrollers table { direction: rtl !important;}",
  ".uJS_" + baseRef() + "_buttonbarScrollers table td:empty { display: none !important;}",
  
  "body > div:first-child { z-index: 1 !important }",
  
  "table[id^='l0l'] div[id^='tg_']:not(.ad0) > a:before, table[id^='l0l'] div.ad0[id^='tg_'] > a:before { content: '\u00a0\u2003 ' !important; font-weight: 900 !important; }",
  "table[id^='l0l']:not(.unverified) div.ad0[id^='tg_'] > a:before { content: '\u00a0\u2705\ ' !important; font-weight: 900 !important; color: green !important }",
  //"a[name='ad_ex'] + div table[id^='l0l'] a:before { content: '' !important; }",
  "table[id^='l0l'] table:not([id]) .f_r:before { content: '\u00a0'; }",
  
  //"table[id^='l0l'] table:not([id]) .f_r:before { content: '[\u00a0\u2003\u00a0] '; }",
  //"table[id^='l0l']:not(.unverified) table:not([id]) .f_r:before { content: '[\u00a0\u2705\u00a0] '; }",
  
  "#tiptip_arrow { display:none !important; }",
  "#tiptip_content { z-index: 2147483647 !important; padding: 6px 8px; box-shadow: 0px 0px 5px #000 !important; cursor: default !important; }",
  "#tiptip_holder { opacity: 1 !important }",
  
  "#tiptip_holder.tip_left { padding-top: 20px !important; }",
  
  //"body:not(.uJS_" + baseRef() + "_show) { display: none !important; }",
  "body:not(.uJS_" + baseRef() + "_show) { background: inherit !important; visibility: hidden !important; overflow: hidden !important; }",
  "body:not(.uJS_" + baseRef() + "_show) iframe { display: none !important; }",

  "#uJS_" + baseRef() + "_extraHTML {display: none}",
  //"#ap_ctr > .mbx:not(.ad0) {cursor: pointer !important}",
  "#t_1c {visibility: hidden !important;}",
  ".mbxm [class*=' ad'], .mbxm [class^='ad'], .mbxm {border-radius: 0px !important;}",
  "#ap_ctr > * {border-radius: 5px !important;}",
  "#ap_ctr > :last-child:not(.ad0) span.sb { color: #FFF !important }",
  
  "#ap_ctr > :first-child:not(:only-child) > div { position:inherit; right: 11px; bottom: 11px; width:16px; height: 16px; color: #DDD; background-color: #888; text-align: center; border: 1px solid #AAA; font-weight: bold; cursor: default; }",
  "#ap_ctr > :first-child:not(:only-child) > div:after {content: '?' }",
  "#ap_ctr > :first-child:not(:only-child) > div:hover { background-color: transparent !important; border-color: #fff !important; color: #fff !important; }",
  
  ".adbs {box-shadow: none !important;}",
  ".f_r:not(.sb) {display: inherit !important;}",
  ".f_r + div {display: none !important;}",
  "div[id^='rgcad_'] {display: inherit !important}",
  ".mbx {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;}",
  ".mbx > div[align='center'] {cursor: default;}"
 ].join("\n");
 _addStyle(css);
})();

//var linkAdPrize, baseAdPrizeTime, apCTR, finalLink;
var targetWindow=null, mo, uJS_target="uJS_NeobuxAd", loaded=false;
var copyAdPrizeLink;
var extraHTML=document.createElement("DIV"); extraHTML.setAttribute("id","uJS_" + baseRef() + "_extraHTML");
var headerHeight=0;

function hashScroll(h) {
 switch(h) {
  case "": break;
  case "adprize": self.scrollTo(scrollX, self.scrollY - self.innerHeight + document.querySelector("a[name='ad_ex']").parentElement.previousElementSibling.getBoundingClientRect().bottom); break;
  default: self.scrollTo(self.scrollX, self.scrollY - self.innerHeight + document.querySelector("a[name='" + h + "']").parentElement.nextElementSibling.getBoundingClientRect().bottom);
 }
}

function uJS_ap_click(e) {
 //var event = e || window.event;
 /*var e_target=event.target;
 uJS_ap_container=document.querySelector("#ap_ctr > .mbx"); uJS_ap_content=uJS_ap_container.querySelector("#ap_h");
 //while ((e_target != uJS_ap_content) && (e_target != uJS_ap_container)) e_target=e_target.parentElement;
 if (e_target != uJS_ap_content) { try { uJS_ap_content.click(); } catch(undefined) {} }
 extraHTML_placeAdPrize();*/
 //event.stopPropagation(); if (event.cancelBubble != null) event.cancelBubble = true;
 //try { document.querySelector("#clone_ap_h").click(); } catch(undefined) {}
 //event.preventDefault; return false;
 extraHTML_placeAdPrize();
 resetTargetWindow();
 extraHTML.children[0].click();
}

function zeroClicks() { var rtn=self.zx; do { rtn=rtn.sort(); rtn.pop(); rtn.unshift(0); } while(rtn.slice(-1)[0]); return rtn; }

//function zeroClicks() {var rtn=self.zx.sort(function(a,b) {return b-a;}); rtn[0]=0; return rtn; }
// NOTA: Crear un Objeto {} global al que agregarle las propiedades y demas.

/*
function zeroClicks() {
 var me=(function(){return this;})();
 console.log(me);
 var rtn=(function() { return rtn; })();
 if (typeof(rtn) != "undefined") return rtn;
 alert(typeof(rtn)); alert(rtn);
 var rtn=self.zx.sort(function(a,b) {return b-a;}); rtn[0]=0;
 return (function() { return rtn; })();
}
*/

function resetClicks() {
 self.gg=[];
 self.clr('1');
 //self.clr(extraHTML.dataset.ad);
 //self.ul=0; // vuelve a esconder los indicadores de cambio
 
 self.zx=zeroClicks();
}

function tipMouse(over, _ev) { var ev=document.createEvent("Event"), btnTip=(typeof(t_0c) == "undefined")?t_1c:t_0c, evStr=(over)?"mouseover":"mouseout"; ev.initEvent(evStr, false, true); btnTip.dispatchEvent(ev); }

function maskAdPrize() {
 var disabledMask=true;
 extraHTML_placeAdPrize();
 if (ap_ctr.children.length-1) return;
 try { disabledMask=!parseInt(document.querySelector("#ap_hct").textContent); } catch(undefined) {}
 
 divMask=document.createElement("div"); divMask.style.position="absolute";
 divMask.style.height=ap_ctr.offsetHeight+"px"; divMask.style.width=ap_ctr.offsetWidth+"px";
 //divMask.style.background="none";
 
 var tipSpot=document.createElement("div"); tipSpot.onclick=(function(e) { e.preventDefault(); e.stopPropagation(); e.preventImmediatePropagation(); }); tipSpot.onmouseout=(function() { tipMouse(false); }); tipSpot.onmouseover=(function() { tipMouse(true); }); divMask.appendChild(tipSpot);
 
 //try { if (parseInt(ap_h.innerHTML)) divMask.style.cursor="pointer"; } catch(undefined) {}
 
 if (disabledMask) {
  divMask.style.cursor="default";
  divMask.onclick=function(e) { e.preventDefault(); }
 } else {
  divMask.style.cursor="pointer";
  divMask.onclick=function() { try {resetTargetWindow(); ap_h.target=uJS_target; ap_h.click();} catch(undefined) {} }
 }
 ap_ctr.insertBefore(divMask,ap_ctr.firstElementChild);
 //ap_ctr.appendChild(divMask);
}

function extraHTML_init() {
 extraHTML.innerHTML="<A></A><A></A>";
 document.body.firstElementChild.appendChild(extraHTML);
 maskAdPrize();
}

function extraHTML_placeAdPrize() {
 var _content, _container;
 
 try {
  if ((_container=document.querySelector("#ap_ctr > .mbx")) == null) return;
  if ((_content=_container.querySelector("#ap_h")) == null) throw 0;
  //if (_content.innerHTML == arguments.callee.content.innerHTML) throw null;
  
  //arguments.callee.content=_content;
  
  if ((parseInt(_content.textContent) || NaN) == NaN) throw 0;
  copyAdPrizeLink=_content.copyNode(true); copyAdPrizeLink.target=uJS_target; //copyAdPrizeLink.setAttribute("target", uJS_target);
  //_container.onclick=uJS_ap_click; _content.onclick=function(e) { e.preventDefault(); return false; }
  extraHTML.replaceChild(copyAdPrizeLink, extraHTML.children[0]);
  var tipSpot=_container.querySelector("#t_1c"); if (tipSpot != null) tipSpot.onclick=function(e) { e.stopPropagation(); e.preventDefault(); return false; }
 } catch(thrw) {
  if (thrw == 0) { extraHTML.replaceChild(document.createElement("a"), extraHTML.firstChild); }
 }
 //[].forEach.call(document.querySelectorAll("#ap_ctr > .mbx *"), function(elem,item,arr) { elem.ondrag=function(e){ e.prevetDefault(); return false; } });
}

function extraHTML_placeAd(elem) {
 var el=elem.copyNode(true);
 el.querySelector("a[href]").setAttribute("target", uJS_target);
 extraHTML.dataset.ad=parseInt(elem.id.replace(/\D/g,"\u0020").trim().replace(/\s+/g,"\u00AD").split("\u00AD").slice(-1));
 extraHTML.replaceChild(el, extraHTML.children[1]);
}

function resetTargetWindow() {
 try { targetWindow.close(); } catch(undefined) {}
 targetWindow=window.open("", uJS_target);
}

function headerFixed(enable) {
 if (enable) {
  document.body.classList.add("uJS_" + baseRef() + "_fixHeader");
 } else {
  document.body.classList.remove("uJS_" + baseRef() + "_fixHeader");
 }
}

function formatScrollers() {
 var tdViewAds=menu.parentElement.parentElement.firstElementChild;
 if (tdViewAds.innerHTML == "") tdViewAds=tdViewAds.nextElementSibling.nextElementSibling;
 var extraCell=document.createElement("td"); extraCell.style.paddingRight="2px";
 var docAdPrize=document.querySelectorAll("a[href$='#adprize']");
 if (!docAdPrize.length) extraCell.innerHTML="<a href=\"#adprize\" class=\"button small2 gray\"><span>AdPrize</span></a>";
 else extraCell.appendChild(docAdPrize[0]);
 try { tdViewAds.previousElementSibling.classList.add("uJS_" + baseRef() + "_buttonbarScrollers"); } catch(undefined) {}
 tdViewAds.parentElement.insertBefore(extraCell, tdViewAds);
}

function moAdView(mr) {
 try {
  if (o1.style.display == "none") throw 0;
  var currentAdBlockNumber=opener.document.querySelector("a[href$='&vl=" + location.splitSearch.vl + "&']").id.substr(1);
  opener.document.querySelector("#l0l" +  currentAdBlockNumber).classList.remove("unverified");
 } catch(undefined) {}
}

function moAdList(mr) {
 mr.forEach(function(m,i,arr) {
  //extraHTML_placeAdPrize();
  //if (uJS_ap_container.contains(m.target) && (m.target.id != "dr_tp_ct")) { console.log(m); }
  if (m.target.id == "o1") { alert(uJS_extraHTML.dataset.ad); }
  else if (m.target.id.match(/^da\d+b$/) && (m.target.style.display != "none")) {
   extraHTML_placeAd(m.target);
   if (!document.querySelector("#tg_" + extraHTML.dataset.ad).classList.contains("ad0")) document.querySelector("#l0l" + extraHTML.dataset.ad).classList.add("unverified");
   var spot=extraHTML.children[1].querySelector("a > img[onclick]");
   /*spot.parentElement.onclick=function(e) {
    eval(spot.parentElement.getAttribute("onclick"));
    var wTarget=window.open(spot.parentElement.getAttribute("href"), uJS_target);
    //wTarget.onload=wTarget.document.onload=wTarget.onreadystatechange=function() {wTarget.alert(); try { mo.observe(wTarget.document.querySelector("#o1"), {childList: true, attributes: true, subtree: true, characterData: true}); alert(); } catch(undefined) {} }
    e.preventDefault();
   }*/
   
   if (mainButton) resetTargetWindow();
   if ((targetWindow != null) && (!targetWindow.closed)) spot.click();
   mainButton=true;
   resetClicks();
  } else if (m.target.id == "ap_ctr") maskAdPrize();
  //else if (m.target.id == "ap_h") extraHTML_placeAdPrize();
 }); 
}

var mo=new MutationObserver(isAdView?moAdView:moAdList);

function loaderAdList() {
 delete loaderAdView; delete moAdView;
 //if (document.querySelector("html > head") == null) try {document.documentElement.appendChild("head") }
 
 // impedir hacer scroll temporalmente
 try { hashScroll(lHash); } catch(undefined) {}
 if (!document.querySelectorAll("#ubar_main").length) return;
 if (!(["interactive", "complete"].indexOf(document.readyState) + 1)) return;
 if (document.readyState == "complete") document.body.classList.add("uJS_" + baseRef() + "_show");
 if (!loaded) { //he de cambiar el true por una comprobacion de que esta la sesion iniciada (ej. presencia de la ubar)
  loaded=true; 
  
  // Fix Header - BEGIN
  headerHeight=document.querySelector("body > div:first-child").getBoundingClientRect().height;
  if (headerHeight > 0) {
   var css="body.uJS_" + baseRef() + "_fixHeader { margin-top: " + headerHeight + "px !important; }";
   css+="body.uJS_" + baseRef() + "_fixHeader > div:first-child { position: fixed !important; transform: translateY(-100%) !important}";
   _addStyle(css);
   document.querySelector("#ubars2").onclick=function() { ubar2(); headerFixed(cookieGet("ubarf") != "1"); }
  }
  headerFixed(cookieGet("ubarf") != "1");
  // Fix Header - END
  
  formatScrollers();
  
  // Replace AdPrize miniButton's action - BEGIN
  try {
   // Comprobar si se esta en "/m/v/" para salir del try en caso negativo: throw 0
   //NOTA: en caso de cargar la web con hash... hay que hacer el scroll oportuno.
   var btnTarget=document.querySelector("a[href$='#adprize']");
   btnTarget.style.cursor="pointer";
   btnTarget.removeAttribute("href");
   btnTarget.onclick=function() { hashScroll("adprize"); }
   
   //[].forEach.call(document.querySelectorAll("a[name^='ad_']:not([name='ad_ex'])"), function(elem,item,arr) {
    //var hashTarget=elem.getAttribute("name"); console.log(hashTarget);
    //btnTarget=document.querySelector("a[href$='#" + hashTarget + "']");
    //if (btnTarget == null) return;
    //btnTarget.style.cursor="pointer";
    //btnTarget.removeAttribute("href");
    //btnTarget.onclick=function() {
     //self.scrollTo(scrollX, elem.parentElement.nextElementSibling.getBoundingClientRect().bottom);
    //}
   //});
  } catch(undefined) {}
  // Replace AdPrize miniButton's action - END
  
  mo.observe(document.querySelector("#ap_ctr"), { attributeOldValue:false, childList:true, attributes:false, characterData:true, subtree:true});
  
  [].forEach.call(document.querySelectorAll("a[name^='ad_']:not([name='ad_ex'])"), function(elem,item,arr) {
   elem.nextElementSibling.innerHTML=elem.nextElementSibling.innerHTML.replace(/\shref=\"javascript:void\(0\);\"/gi," ");
   mo.observe(elem.nextElementSibling, { attributeOldValue:false, childList:true, attributes:true, characterData:false, subtree:true, attributeFilter:["style"] });
   
   elem.nextElementSibling.oncontextmenu=function(e) {
    var e_target=e.target;
    while (!e_target.parentElement.classList.contains("mbxm")) e_target=e_target.parentElement;
    mainButton=false; e_target.click();
    e.preventDefault();
   }
   
   // Replace miniButtons' action - BEGIN
   var hashTarget=elem.getAttribute("name");
   var btnTarget=document.querySelector("a[href$='#" + hashTarget + "']");
   if (btnTarget == null) return;
   btnTarget.style.cursor="pointer";
   btnTarget.removeAttribute("href");
   btnTarget.onclick=function() { hashScroll(hashTarget); }
   // Replace miniButtons' action - END
   
  });
  extraHTML_init();
  
  rgbad_ex.onclick=function() {
   try { targetWindow.close(); } catch(undefined) {}
   targetWindow=window.open("", uJS_target,"resizable=yes,status=no");
  }
  
  if (lHash == "") document.body.classList.add("uJS_" + baseRef() + "_show");
  
  try { hashScroll(lHash); } catch(undefined) {}
 }
 
 if (!document.referrer.length.toBoolean()) {} // este caso incluye que se halla accedido haciendo click en el icono del addon: retomar scroll
 // permitir hacer scroll
}

function loaderAdView() {
 delete loaderAdList; delete moAdList;
 try { mo.observe(o1, {childList: true, attributes: true, subtree: true, characterData: true}); } catch(undefined) {}
}

self.onbeforeunload=function() {
 // impedir hacer scroll
 // guardar en cookies el scroll
 if (!isAdView) targetWindow.close();
}

if (uJS_enabled) document.onreadystatechange=window.onload=document.onload=isAdView?loaderAdView:loaderAdList;

/*
function callback(allmutations){
 // Since allmutations is an array, we can use array functions
 allmutations.forEach(function(change, item) {
   //var t = document.getElementById('ap_h');
   //if (t==null) return;
   mo.disconnect();
   fmtAdPrizeLink();
   mo.observe(apCTR,{childList: true, attributes: true});
   //t.target='_self';
 })
}
*/

/*
var _ggz=function(n0,p,n1) {
 var el=document.createElement('a');
 el.href=document.getElementById('l'+p)+'&vl='+sVL;
 el.target='·script:neobux';
 //el.click();
 window.open(el.href, el.target,'', true);
 document.getElementById('tga_'+p).style.color='#888';
 document.getElementById('tg_'+p).className='ad0';
 //document.getElementById('img_'+p).style.visibility='hidden';
 //el=document.getElementById('tggi_'+p); el.src=_c(el.src);
 //document.getElementById('tggi_'+p).style.visibility='hidden';
 el=document.getElementById('img_'+p); el.src=_c(el.src); el.src=document.head.querySelector("link[rel='icon'][sizes='16x16']").href;
};
*/

/*
function _c(s) {
 var _s='';
 _s+=s;
 var p=_s.lastIndexOf('_c.');
 if (p<0) {
  p=_s.lastIndexOf('.');
  var ext=_s.substr(p); // .gif .jpg (incluye el punto)
  if (ext.indexOf('/')>0) return _s; // en caso de no tener el formato standard
  _s=_s.substr(0,p) + '_c' + ext;
 }
 return _s;
}
*/

/*
function fmtAdPrizeLink() {
 try {
  apCTR=document.querySelector('#ap_ctr');
  linkAdPrize= document.querySelector('#ap_h');
  baseAdPrizeTime = document.querySelector('#dr_tp_ct');
  apCTR.setAttribute('disabled','');
  //if (typeof(linkAdPrize) != 'undefined' && linkAdPrize != null) {}
  if (linkAdPrize.href.length>0) finalLink=linkAdPrize.href;
  //linkAdPrize.removeAttribute('onclick'); linkAdPrize.removeAttribute('href'); linkAdPrize.removeAttribute('target');
  //scAdPrize=linkAdPrize.getAttribute('onclick');
  //scAdPrize+='window.open(this.href,\'_self\',null,false);return false;';
  apCTR.onclick=function() { window.open(finalLink,'_self'); };
  apCTR.removeAttribute('disabled');
  //linkAdPrize.setAttribute('target','_self');
  //linkAdPrize.removeAttribute('onclick');
  //var remainingTime=((typeof(baseAdPrizeTime) != 'undefined' && baseAdPrizeTime != null) ? baseAdPrizeTime.firstChild.innerHTML.replace('&nbsp;',' ').substr(1,5):'0:00')
  //remainingTime=(remainingTime.length==0?'?:??':remainingTime);
  
  //var remainingTime = parseInt(tempo/60) + ':' + (tempo%60);
  //adjustTime(tempo);
  //setInterval(oneMoreSecond(),1000);
  //document.title='[' + remainingTime + '] ' + titl;
 } catch(undefined) {};
}
*/

/*
function fmtTime(tm) {
 var _h=parseInt(tm/3600);
 tm%=3600;
 var _m=("0" + parseInt(tm/60)).slice(-2);
 var _s=("0" + (tm%60)).slice(-2);
 return _h + ':' + _m + ':' + _s;
}
*/

/*
for (i=1; i>0; i++) {
 var elem=document.getElementById('l0l'+i);
 if (!(typeof(elem) != 'undefined' && elem != null)) break;
 onclickReplacement=elem.getAttribute('onclick');
 onclickReplacement+='i'+i+'.click();'
 elem.setAttribute('onclick',onclickReplacement);
}
*/

/*
var _interact= function() {
 try { runOnce; return; } catch(e) {}; runOnce=true;
 apCTR=document.getElementById('ap_ctr');
 //fmtAdPrizeLink();
 //try {mo.observe(apCTR,{childList: true, attributes: true});} catch(undefined) {};
 ggz=_ggz;
};
*/

// cambiar identificacion del target cambiado basandose en su estilo...
// haciendo uso de una funcion a la que se le pasa: una cadena estilo, y una cadena valor de estilo que se quiere obtener,
// para obtener el valor. para ello la funcion solo tiene que crear un elemento (el cual no hay necesidad de incluir en el DOM),
// pasarle el estilo, y pedir el valor