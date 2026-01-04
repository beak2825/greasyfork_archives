// ==UserScript==
// @name         IMDb - fix links
// @namespace    https://github.com/Procyon-b
// @version      1.2.2
// @description  Removes all tracking info from imdb links. Keeps other parameters intact.
// @author       Achernar
// @match        https://www.imdb.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425447/IMDb%20-%20fix%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/425447/IMDb%20-%20fix%20links.meta.js
// ==/UserScript==

(function() {
"use strict";
var t;

function fix(u) {
  return u.replace('?', '?&').replace(/&(pf_rd_[a-z]|ref_)=[^&#]*/g, '').replace('?&', '?').replace(/\?$/, '');
}

function normalizeLnk(a) {
  if (/^\/(list|name|title)\/[^\/]+$/.test(a.pathname)) a.pathname+='/';
  if (/^(\/title\/.*\/fullcredits)\/cast\/?$/.test(a.pathname)) {
    a.pathname=RegExp.$1;
    a.hash='cast';
    }
  if (/^(\/title\/[^\/]+\/.*)\/$/.test(a.pathname)) {
    a.pathname=RegExp.$1;
    }
}

if (t=location.search) {
  let s=fix(t);
  if (s!=t) history.replaceState(null, null, (s || location.pathname)+location.hash);
  }

var num=1, stop=0;
function fixL(L, j=0, n=num++) {
  if (stop && (stop > n)) return;
  let i=0, a, S=Date.now()+200;
  for (;a=L[j];j++) {
    if (a.LnkFixed || !a.href) continue;
    if (Date.now() > S) {
      if ( !(stop && (stop > n)) ) setTimeout(function(){fixL(L,j,n)},0);
      return;
      }
    if (a.protocol && a.protocol.startsWith('http') && a.host.endsWith('imdb.com') && a.search) {
      let s=fix(a.search);
      if (a.search != s) a.search=s;
      normalizeLnk(a);
      }
    if (a.pathname!=='/') a.LnkFixed=1;
    }
  }

var SI=0;
function init() {
  new MutationObserver(function(mutL){
    for (let m of mutL) {
      if (m.addedNodes) {
        let e=m.target.querySelectorAll(':scope a');
        if (e.length) fixL(e);
        }
      }
    }).observe(document, {childList:true, subtree:true});

  clearInterval(SI);
  SI=-1;
  stop=num;
  fixL(document.links);
  }

window.addEventListener('load', function(){fixL(document.links)});
if (document.readyState != 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

if (SI<0) return;
setTimeout(function(){fixL(document.links);},0);
SI=setInterval(function(){
  stop=num;
  fixL(document.links);
  },250);
setTimeout(function(){stop=num;clearInterval(SI);},2000);

})();