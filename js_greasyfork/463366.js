// ==UserScript==
// @name         Facebook - remove tracking url
// @namespace    https://github.com/Procyon-b
// @version      0.1
// @description  Remove the tracking parameter in links
// @author       Achernar
// @match        https://*.facebook.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463366/Facebook%20-%20remove%20tracking%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/463366/Facebook%20-%20remove%20tracking%20url.meta.js
// ==/UserScript==

(function() {
"use strict";
var t;

function fix(u) {
  return u.replace('?', '?&').replace(/&(__cft__\[0\]|__tn__)=[^&#]*/g, '').replace('?&', '?').replace(/\?$/, '');
}

if (t=location.search) {
  let s=fix(t);
  if (s!=t) history.replaceState(null, null, (s || location.pathname)+location.hash);
  }

function fixL(L) {
  let i=0, a, j=0;
  for (;a=L[j];j++) {
    if (a.LnkFixed || !a.href) continue;
    if (a.protocol && a.protocol.startsWith('http') && a.host.includes('facebook.com') && a.search) {
      let s=fix(a.search);
      if (a.search != s) a.search=s;
      }
    a.LnkFixed=1;
    }
  }

function init() {
  new MutationObserver(function(mutL){
    for (let m of mutL) {
      if (m.addedNodes) {
        let e=m.target.querySelectorAll(':scope a');
        if (e.length) fixL(e);
        }
      }
    }).observe(document, {childList:true, subtree:true});

  fixL(document.links);
  }

window.addEventListener('load', function(){fixL(document.links)});
if (document.readyState != 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

})();