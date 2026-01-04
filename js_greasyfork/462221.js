// ==UserScript==
// @name         USO - Display additional infos & fixes
// @namespace    https://github.com/Procyon-b 
// @version      0.3.4
// @description  Display additional information. Total installs, update date, initial release date. Fix site's navigability.
// @author       Achernar
// @match        https://userstyles.org/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462221/USO%20-%20Display%20additional%20infos%20%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/462221/USO%20-%20Display%20additional%20infos%20%20fixes.meta.js
// ==/UserScript==

(function() {
"use strict";

var initial=true, firstPage=true;

// catch site errors
if (location.pathname.startsWith('/styles/[styleId]/')) {
  let u=location.pathname.substr(17);
  history.replaceState({}, null, u);
  location.pathname=u;
  return;
  }


// XHR -- XML
self.XMLHttpRequest = class extends self.XMLHttpRequest {
  open(...args) {
    let t=this;
    // intercept and source code
    if ( arguments[1].startsWith('https://gateway.userstyles.org/styles/getStyleCss/') ) {
      styleLoaded=styleID || -1;
      loadCSS=1;
      this.addEventListener('load', function(){
        var id=t.responseURL.split('/').pop();
        if (styles[id] && !styles[id].sourceCode) styles[id].sourceCode=JP(t.response).result;
        });
      }
    return super.open(...args);
    }
  }

// JSON.parse
var JP=JSON.parse;
JSON.parse=function(){
  var r=JP(...arguments);
  getStyles(r);
  return r;
}

// stop svg js animation
window.requestAnimationFrame=function(){}

// handle data
var stylesA=[], styles={};
var total=0, styleLoaded;
var closeBut;

function getStyles(o) {
  stylesA=parseObj(o, [], ['styles', 'stylesList', 'style']);
  stylesA.forEach((e) => {
    if (e.id && !styles[e.id]) {
      styles[e.id]=Object.assign({}, e);
      total++;
      }
    });
  }

function parseObj(o, A, n=[]) {
  var k, v;
  if ( (typeof o != 'object') || !Array.isArray(A)) return;
  for (k in o) {
    v=o[k];
    if ((typeof v == 'object') && n.includes(k)) A=A.concat(v);
    if (typeof v == 'object') A=parseObj(v, A, n);
    }
  return A;
  }

var done, newL, Tit, title, title0='Website Themes & Skins by Stylish | Userstyles.org',
    userID, cancelNextRS=0, dontCancel='', site='',
    bgPage='/', blockTitle;

if (document.readyState != 'loading') init('"already done"', 1);
else {
  document.addEventListener('DOMContentLoaded', (ev) => { init('DOM');} );
  window.addEventListener('load', (ev) => { init('wLoad', 1);} );
  }


function chkState(a) {
  var u=a[2];
  if (u == '/styles/browse') {
    if (bgPage.startsWith(u)) u=bgPage;
    } 
  else if (u.startsWith('/styles/[styleId]/')) {
    title='';
    document.title=title0;
    u=bgPage;
    }
  else if (u.startsWith('/user-profile/[...userId]')) {
    if (userID || __NEXT_DATA__) {
      u='/user-profile/'+(userID || __NEXT_DATA__.query.userId);
      }
    }
  a[2]=u;
  }

// hide logo when scrolled. (saves cpu on old hardware)
var Logo, LHidden=false;
function hideLogo() {
  function toggle(set) {
    if ( Logo=(Logo && Logo.parentNode && Logo) || document.querySelector('[class^="welcome-banner_top_"] svg') )
      LHidden=Logo.classList.toggle('hideMe',set);
    else LHidden=set;
    }
  window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
      if (LHidden) return;
      toggle(true);
      }
    else if (LHidden) toggle(false);
    });
  }

var reactID;

function init(v, old) {
  if (done) return;
  newL=document.querySelector('#__next');
  if (!newL) {
    if (old && ST) ST.remove(); 
    return;
    }
  addSt();
  hideLogo();
  let t;
  done=true;
  reactID= (t=Object.keys(newL).find( (v) => v.startsWith('__react') )) && t.split('$')[1];
  
  if (__NEXT_DATA__.page == '/styles/[styleId]/[[...styleParams]]') bgPage='/';
  else if ( (__NEXT_DATA__.page == '/styles/browse/[[...categoryParams]]') || (__NEXT_DATA__.page == '/user-profile/[...userId]') )
    bgPage='/'+__NEXT_DATA__.props.metaTagsData.og.url.split('/').slice(3).join('/');
  
  let pushState=history.pushState;
  history.pushState=function(){
    let u=arguments[2];
    // ignore if same state
    if (cancelNextRS && (dontCancel == u) ) {
      dontCancel='';
      }
    else if (cancelNextRS || (u == location.pathname) ) {
      //cancelNextRS=false;
      cancelNextRS && cancelNextRS--;
      dontCancel='';
      selfTitle=blockTitle=true;
      return;
      }
    initial=false;
    firstPage=false;
    chkState(arguments);
    
    if (u.startsWith('/user-profile/') && (u[13] != '[') ) userID=u.split('/')[2];
    if ( (u == '/') || u.startsWith('/user-profile/') || u.startsWith('/styles/browse/') ) bgPage=u;
    
    pushState.apply(history, arguments);
    if (location.pathname.startsWith('/styles/')) {
      addData('from pushState (path)');
      }
    }

  var hback=history.back,
      hforward=history.forward,
      hgo=history.go,
      hreplaceState=history.replaceState;
  
  history.replaceState=function() {
    if (cancelNextRS && (dontCancel == arguments[2]) ) {
      dontCancel='';
      }
    else if (cancelNextRS || (arguments[2] == location.pathname) ) {
      cancelNextRS && cancelNextRS--;
      dontCancel='';
      selfTitle=blockTitle=true;
      return;
      }
    initial=false;
    firstPage=false;
    return hreplaceState.apply(history, arguments);
    }


  window.addEventListener('popstate', (ev) => {
    if (location.pathname.startsWith('/user-profile/')) {
      if (newL.querySelector(':scope > [class^="style_mainWrapper_"]')) {
        let e=newL.querySelector(':scope > [class^="style_mainWrapper_"] a[data-stylish="close-style-page-button"]');
        if (e) {
          e.click();
          }
        }
      }
    else if (location.pathname.startsWith('/styles/')) {
      let i, r, e=document.querySelector('a[href^="'+location.pathname+'"]');

      if (!e) {
        r=newL.querySelectorAll('[class^="styles-list_styleRow_"]');
        let st, ost;
        
        let ID=location.pathname.split('/')[2]
        
        for (i=0; i < r.length; i++) {
          if (r[i]['__reactFiber$'+reactID] && (ID == r[i]['__reactFiber$'+reactID].key.split('-').pop()) ) {
            e=r[i];
            break;
            }
          }
        }

      if (!e) {
        let A=document.querySelector('a[href^="/styles/"][href*="1"]');
        if (A) {
          let react=Object.keys(A).find( (v) => v.startsWith('__reactFiber') );
          e=document.createElement('a');
          e.href=location.pathname;
          e.style='display: none !important;';
          let r=newL.querySelector(':scope > div > [class^="Home_homepageWrapper_"]')
          if (r) r.appendChild(e);
          }
        }
      if (e) e.click();
      }
    else if (location.pathname == '/') {
      let e=newL.querySelector(':scope > [class^="style_mainWrapper_"] a[data-stylish="close-style-page-button"]');
      if (e) {
        cancelNextRS=1;
        e.click();
        }
      }
    });

  
  // check Title
  var Tit = document.querySelector('title'), selfTitle=false;
  new MutationObserver(function(mutations) {
    if (selfTitle) { selfTitle=false; return; }
    if (title && !Tit.textContent.startsWith(title) ) {
      document.title=title;
      selfTitle=true;
      }
    }).observe(Tit, { attributes: false, subtree: false, childList: true });

  site=document.title.split('|')[1] || '';
  if (site) site=' |'+site;

  // detect (no) popup
  new MutationObserver(function(mutations) {
    if (!newL.querySelector(':scope > [class^="style_mainWrapper_"]')) {
      title='';
      document.title=title0;
      if (location.pathname.startsWith('/styles/')) {
        if (firstPage && !initial) {
          }
        }
      }
    else {
      addData('from is popup');
      }
    
    }).observe(newL, { attributes: false, subtree: false, childList: true });

  // mutation add-er
  
    // sub Mut
    function mutToast() {
      let r=newL.querySelector(':scope > .Toastify ~ div[class=""], :scope > .Toastify ~ div[class^="MainLayout_mainLayout__"]');
      if (r && r.attributes.obs) {
        return;
        }
      if (r) {
        new MutationObserver(function(muts) {
        for (let mut of muts) {
          if (mut.addedNodes.length && mut.previousSibling && (mut.previousSibling.localName == 'header') ) {
            addDataTiles();
            watchGrid();
            break;
            }
          }          
        }).observe(r, { attributes: true, subtree: false, childList: true });
        r.setAttribute('obs', 'tiles');
        }

      // added cards ?
      watchGrid();
      }

    function watchGrid() {
      var r=newL.querySelector('[class^="styles-grid_gridItems_"]') ||
        newL.querySelector('[class^="styles-gallery_scrollWrapper_"] > div:not([class])');
      if (r.attributes.obs) {
        return;
        }
      if (r) {new MutationObserver(function(muts) {
        for (let mut of muts) {
          if (mut.addedNodes.length) { 
            addDataTiles();
            break;
            }
          }          
        }).observe(r, { attributes: true, subtree: false, childList: true });
        r.setAttribute('obs', 'grid');
        }
      }

  new MutationObserver(function(muts) {
    let mut;
    for (mut of muts) {
      
      // new body
      if (mut.addedNodes.length && mut.previousSibling && (mut.previousSibling.className == 'Toastify') ) {
        addDataTiles();

        // new list
        mutToast();
        break;
        }
      
      } 
    }).observe(newL, { attributes: false, subtree: false, childList: true });
  newL.setAttribute('obs', null);
  mutToast();
  addDataTiles();

  if (location.pathname.startsWith('/styles/')) {
        setTimeout((e) => {addData('from ini '+v)}, 0);
        }
  }

var totalI, styleID, showCSS, loadCSS;

function getCSS(id, callback) {
  if (id && (typeof callback == 'function') ) {
    fetch('https://gateway.userstyles.org/styles/getStyleCss/'+id)
      .then((response) => response.json())
      .then((data) => callback(data));
    }
  }

function addData() {
  var id=styleID=location.pathname.split('/')[2],
      s=styles[id];

  if (initial) {
    // this is the only case when this has to be done.
    var t=newL.querySelector('[class^="style-header_close_"]')
    if (!closeBut || (closeBut !== t) ) {
      closeBut=t;
      if (closeBut) {
        closeBut.addEventListener('click', function() {
          cancelNextRS=1;
          dontCancel='/';
          title='';
          document.title=title0;
          history.pushState({}, null, '/');
          });
        }
      }
    }
  
  if (!s) return;
  var a=document.querySelector('#weekly-installs');
  if (!a) return;

  if (!totalI || !totalI._root.parentNode) {
    totalI=a.cloneNode(true);
    totalI.id='totalInstalls';
    totalI.dataset.tooltipContent='';
    totalI._v=totalI.querySelector(':scope div span');
    totalI._v.textContent='';
    var tt=a.nextElementSibling, ttTI;
    if ( tt.attributes.role && (tt.attributes.role.value == 'tooltip') ) ttTI=tt.cloneNode(true);
    if (!ttTI) {
      ttTI=document.createElement('div');
      ttTI.innerHTML='<div role="tooltip" _model class="react-tooltip styles-module_tooltip__mnnfp styles-module_dark__xNqje react-tooltip__place-top styles-module_show__2NboJ" style="visibility: hidden;">test<div class="react-tooltip-arrow styles-module_arrow__K0L3T" style="left: 40px; bottom: -4px;"></div></div>';
      ttTI=ttTI.firstElementChild;
      tt=totalI;
      }
    if (ttTI) {
      a.parentNode.insertBefore(ttTI, tt.nextSibling);
      if (ttTI.childNodes.length == 1) {
        let T=document.createTextNode('Total installs');
        ttTI.insertBefore(T, ttTI.firstChild);
        }
      else ttTI.childNodes[0].textContent='Total installs';
      totalI.onmouseenter=function(){
        ttTI.style.opacity='0.9';
        ttTI.style.visibility='visible';
        if (ttTI._init) return;
        ttTI._init=true;
        if (ttTI.attributes._model) {
          ttTI.style.top=(totalI.offsetTop - 47) +'px'; 
          ttTI.style.left=(totalI.offsetLeft -10) +'px';
          }
        else {
          ttTI.style.left=(totalI.offsetLeft - a.offsetLeft + tt.offsetLeft)+'px';
          ttTI.style.top=tt.style.top;
          ttTI.firstElementChild.setAttribute('style', tt.firstElementChild.attributes.style.value);
          }
        };
      totalI.onmouseleave=function(){ttTI.style.opacity='0'; ttTI.style.visibility='hidden';};
      }
    var i=totalI.querySelector(':scope > svg'), i2;
    if (i) {
      i2=i.cloneNode(true);
      totalI.insertBefore(i2, i.nextSibling);
      i2.style='margin-left: -17px';
      }
    a.parentNode.insertBefore(totalI, (tt || a).nextSibling);
    totalI._root=totalI.closest('[class^="style_mainWrapper_"]');

    showCSS=totalI._root.querySelector('[class*="style-info_showCss_"]');
    if (showCSS) {
      new MutationObserver(function(mutations) {
        let e;
        if (e=showCSS.parentNode.querySelector('[class^="Popup_modalWrapper_"] textarea')) {
          if (loadCSS) {loadCSS=0; return;}
          if (styles[styleID].sourceCode) e.value=styles[styleID].sourceCode;
          else {
            e.value='';
            getCSS(styleID, function(v){e.value=styles[styleID].sourceCode=v.result;} );
            }
          }
        }).observe(showCSS.parentNode, { attributes: false, subtree: false, childList: true });
      }
    }
  else {
    let e=totalI._root.querySelector('[class^="Popup_modalWrapper_"] textarea');
    if (e) {
      if (styles[styleID].sourceCode) e.value=styles[styleID].sourceCode;
      else {
        e.value='';
        getCSS(styleID, function(v){e.value=styles[styleID].sourceCode=v.result;} );
        }
      }
    }

  let v=parseInt(s.totalInstallsCount);
  let vd=a.querySelector('span'), vdv=vd.innerText;
  if (vdv.endsWith('k')) vdv=Math.floor(parseFloat(vdv) * 1000);
  else vdv=parseInt(vdv);
  if (vdv > v) {vd.style='text-decoration: line-through; text-decoration-color: red;';}
  else vd.style='';
  if (v > 1000) v=(v/1000).toFixed(1)+'k';
  totalI._v.textContent=v;
  document.title=title=s.name+site;

  setTimeout(function(){
    if (!totalI._root.parentNode) addData('after');
    },10);
  }

function addDataTiles() {
  var a=document.querySelectorAll('[data-stylish^="strip-cube-styles"]:not(._done), [data-stylish^="grid-cube-styles"]:not(._done)');
  
  a.forEach((e) => e.classList.add('_done'));
  var i=0;
  add2Tiles();
  
  function add2Tiles() {
    var max=Date.now() + 100;
    for (; i < a.length; i++) {
      if (Date.now() > max) {
        setTimeout(add2Tiles, 0);
        return;
        }
      
      let e=a[i].querySelector('[class*="style-cube_activeUsers_"]');
      if (!e) continue;
      let h=a[i].querySelector('a[href^="/styles/"]');
      if (!h) continue;
      let s=styles[h.pathname.split('/')[2]];
      if (!s) continue;
  
      let r=a[i].querySelector('[class^="style-cube_styleDetails_"]');

      let tot=e.cloneNode(true);
      e.title='Weekly installs';
      tot.classList.add('_totalInstalls');
      tot.title='Total installs';
      let _v=tot.querySelector(':scope div span');
      _v.textContent='';
      
      let I=tot.querySelector(':scope > svg'), i2;
      if (I) {
        i2=I.cloneNode(true);
        tot.insertBefore(i2, I.nextSibling);
        i2.style='margin-left: -9px';
        }
      
      // insert total
      e.parentNode.insertBefore(tot, e);
  
      let v=parseInt(s.totalInstallsCount);
      if (v > 1000) v=(v/1000).toFixed(1)+'k';
      _v.textContent=v;
      
      // add dates
      e=document.createElement('div');
      e.className='_dates_';
      let C=s.created.split('T')[0], U=s.updated.split('T')[0];
      e.innerHTML=(C == U ? '':'<span title="Last updated">'+U+'</span>')+'<span title="Date created">'+C+'</span>';
      r.appendChild(e);
      
      // add user name
      e=a[i].querySelector('[class^="style-cube_authorAvatar_"]');
      if (e) e.title=s.user.name;
      }
    }
  }


var iST=`
.hideMe {
  display: none;
}
div[class^="style_mainWrapper__"] {
  padding-top: 0;
}

[data-stylish^="strip-cube-styles"] [class^="style-cube_topWrapper_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_topWrapper_"] {
  margin-bottom: 0;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] {
  flex-direction: row wrap;
  background: var(--bg, gray);
  margin-top: 2px;
  transition: unset !important;
  transition-delay: unset !important;
  padding-top: 2px;
  color: white;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] > *,
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] > * {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"] {
  width: auto !important;
  margin-left: auto;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"] + [class^="style-cube_activeUsers_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"] + [class^="style-cube_activeUsers_"] {
  margin-left: 1em;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"] svg,
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_activeUsers_"] svg {
  fill: white;
  display: block;
}
  
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_name_"] *,
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] [class^="style-cube_name_"] * {
  text-overflow: ellipsis;
  overflow: hidden;
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] > [class^="style-cube_styleName_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] > [class^="style-cube_styleName_"] {
  oline-height: normal;
  flex-basis: calc(100% - 40px);
}
[data-stylish^="strip-cube-styles"] [class^="style-cube_styleDetails_"] > [class^="style-cube_details_"],
[data-stylish^="grid-cube-styles"] [class^="style-cube_styleDetails_"] > [class^="style-cube_details_"] {
  width: auto !important;
  margin-left: auto;
  ooutline: 2px solid red !important;
}

[data-stylish^="strip-cube-styles"] [class*="style-cube_withHover_"]:hover,
[data-stylish^="grid-cube-styles"] [class*="style-cube_withHover_"]:hover {
  transform: unset !important;
  transition: unset !important;
  transition-delay: unset !important;
  background-color: unset !important;
  --bg: DarkSlateGrey;
}

._dates_._dates_ {
  flex-basis: 100%;
  margin-top: 2px;
  text-align: right;
}
._dates_ span {
  color: lightgray;
  font-size: 11px;
}
._dates_ span + span {
  margin-left: 1em;
}

[class^="styles-strip_stripItemsWrapper_"] > button {
  display: none !important;
}
[class^="styles-strip_stripItemsWrapper_"] {
  overflow-x: scroll;
  padding-bottom: 4px;
}
[class^="styles-strip_stripItemsWrapper_"]::-webkit-scrollbar {
  height: 8px !important;
}
[class^="styles-strip_items_"] {
  transform: unset !important;
}

:not(g):not(button):not([class^="style_mainWrapper_"])) {
  transform: unset !important;
  transition: unset !important;
  transition-delay: unset !important;
}
svg[transform*="rotate(-180)"] {
  transform: rotate(-180deg) !important;
}

[class^="category-filter_borderRadios_"] {
  display: none;
}

[class^="styles-list_styleName_"] {
  word-break: break-word;
}

[role="tooltip"] .react-tooltip-arrow {
  bottom: -7px !important;
  border-color: var(--rt-color-dark) transparent;
  border-style: solid;
  border-width: 7px 7px 0 7px;
  display: block;
  background: transparent;
  transform: none;
}

#totalInstalls {
  order: -1;
}

/* fix prothemes sliding right-left - 20230613*/
[class^="styles-strip_sliderWrapper_"][class*="styles-strip_lastPage_"] {
  left: -40px !important;
  right: auto !important;
}
`;

addSt();

var ST;
function addSt() {
  if (!iST) {
    document.documentElement.appendChild(ST);
    return;
    }
  try {
    ST=document.createElement('style');
    document.documentElement.appendChild(ST);
    ST.textContent=iST;
    iST='';
  }catch(e){
    setTimeout(addSt,0); }
}


})();