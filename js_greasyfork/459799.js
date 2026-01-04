// ==UserScript==
// @name         Style shadowDOM
// @namespace    https://github.com/Procyon-b
// @version      0.2.2
// @description  Allow stylus to target elements in shadow-root
// @author       Achernar
// @match        http://NOTHING/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459799/Style%20shadowDOM.user.js
// @updateURL https://update.greasyfork.org/scripts/459799/Style%20shadowDOM.meta.js
// ==/UserScript==

(function() {
"use strict";
var id=Date.now()

// patch attachShadow()
var AS=HTMLElement.prototype.attachShadow;
// bail out if no function
if (!AS) return;

HTMLElement.prototype.attachShadow=function(m){/*[native */
  var e=this;
  e.sr=AS.apply(e,arguments)
  shadows.push(e.sr);
  inject(e.sr);
  shadowMod(e.sr);
  return e.sr;
  }
// END patch

var sheets={}, order=[],
    shadows=[], sCSS={}, injCSS='', oldInjCSS='';

// catch stylus injections
const obs=new MutationObserver(function(muts){
  for (let mut of muts) {
    for (let n of mut.addedNodes) {
      if ( (n.tagName == 'STYLE') && (
        ( (n.className == 'stylus') && n.id.startsWith('stylus-') ) ||
        ( n.className.startsWith('stylish') && n.id.startsWith('stylish-') ) ||
        ( (n.className == 'xstyle') && n.id.startsWith('xstyle-') )
        )) {
        addCSS(n);
        }
      }

    for (let n of mut.removedNodes) {
      if ( (n.tagName == 'STYLE') && (
        ( (n.className == 'stylus') && n.id.startsWith('stylus-') ) ||
        ( n.className.startsWith('stylish') && n.id.startsWith('stylish-') ) ||
        ( (n.className == 'xstyle') && n.id.startsWith('xstyle-') )
        )) {
        remCSS(n);
        }
      }
    }
  });
// END catch

function init() {

  // find open shadows if userscript is ran after page load.
  function findShadows(r) {
    let a=r.querySelectorAll('*');
    for (let s, i=0; i < a.length; i++) {
      if (s=a[i].shadowRoot) {
        shadows.push(s);
        shadowMod(s)
        findShadows(s);
        }
      }
    }
  if (document.readyState == 'complete') findShadows(document);
  // END findShadows

  if (!document.documentElement) {
    setTimeout(init, 0);
    return;
    }

  obs.observe(document.documentElement, {attributes: false, subtree: false, childList: true });
  // check for stylesheets
  document.documentElement.querySelectorAll('style[id^="stylus-"].stylus, style[id^="stylish-"][class^="stylish"], style[id^="xstyle-"].xstyle, head style[data-source^="User Java"]').forEach( (e) => addCSS(e,2) );
  window.addEventListener('load', function(){
    document.documentElement.querySelectorAll('head style[data-source^="User Java"]').forEach( (e) => addCSS(e,3) );
    });
  }

init();

// get only shadow-specific css
function parseSheet(s) {
  var R=s.sheet.cssRules, sels, sel, shCSS='';
  for (let i=0; i < R.length; i++) {
    sel=R[i].selectorText;
    if (!sel || !sel.includes(':host')) continue;
    sels=sel.split(',').filter(function(v){ return v.includes(':host') }).join(',');
    shCSS+=sels.trim()+ R[i].cssText.substr(sel.length)+'\n';
    }

  if (shCSS) shCSS='/*'+s.id+'*/\n'+shCSS;
  return shCSS;
  }

// inject in this shadow
function inject(e) {
  if (injCSS == '') {
    if (e._inj_) {
      e._inj_.remove();
      delete e._inj_;
      }
    return;
    }
  if (!e._inj_ || !e._inj_.parentNode ) {
    let s=e._inj_=document.createElement('style');
    s.className='sh-stylus';
    e.appendChild(s);
    }
  e._inj_.textContent=injCSS;
  }

// inject style
function injectAll() {
  for (let i=0; i < shadows.length; i++) inject(shadows[i]);
  }

// create & inject style in shadows
function injUpd() {
  oldInjCSS=injCSS;
  injCSS='';
  for (let i=0; i < order.length; i++) injCSS+=sCSS[order[i]];
  if (injCSS !== oldInjCSS) injectAll();
  }

// get stylus stylesheet order
function getStylusOrder() {
  order=[];
  for (let i=0; i < document.styleSheets.length; i++) {
    let s=document.styleSheets[i].ownerNode;
    if (s.nodeName != 'STYLE') continue;
    if ( (s.className == 'stylus') || (s.className.startsWith('stylish')) || (s.className == 'xstyle') ||
         (s.dataset.source && s.dataset.source.startsWith('User Java'))
       )
      order.push(s.id);
    }
  }

// handle new stylesheet
function addCSS(n, k=1) {
  if (!n.id) n.id=Math.random();
  if (n.id in sheets) return;
  sheets[n.id]=n;
  if (n.__k__) ;
  else {
    n.__k__=k;

    // monitor modification STYLE element
    const obs=new MutationObserver(function(muts){
      if (muts[0].addedNodes.length) {
        sCSS[muts[0].target.id]=parseSheet(muts[0].target);
        injUpd();
        }
      });
    obs.observe(n, {attributes: false, subtree: false, childList: true });
    // monitor modification text node
    const obs2=new MutationObserver(function(muts){
      if (muts[0].type == 'characterData') {
        // === reparse stylesheet and reinject it
        let e=muts[0].target.parentNode;
        sCSS[e.id]=parseSheet(e);
        injUpd();
        }
      });
    obs2.observe(n, {characterData: true, attributes: false, childList: false, subtree: true});
    }

  sCSS[n.id]=parseSheet(n);
  getStylusOrder();
  injUpd();
  }

// handle stylesheet removal
function remCSS(n) {
  // is it only moved?
  if (n.parentNode == null) delete sheets[n.id];
  getStylusOrder();
  injUpd();
  }

// monitor shadow modification
function shadowMod(e) {
  const obs=new MutationObserver(function(muts){
    if (e._inj_ && (!e._inj_.parentNode || e._inj_.nextElementSibling) ) e.appendChild(e._inj_);
    });
  obs.observe(e, {attributes: false, subtree: false, childList: true });
  }

})();