// ==UserScript==
// @name         DDG - remove &ia=
// @namespace    https://github.com/Procyon-b
// @version      1.0
// @description  The &ia= parameter doesn't always appear. This removes it to streamline the history log.
// @author       Achernar
// @match        https://duckduckgo.com/*
// @match        https://*.duckduckgo.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539035/DDG%20-%20remove%20ia%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/539035/DDG%20-%20remove%20ia%3D.meta.js
// ==/UserScript==

(function() {
"use strict";

var hreplaceState=history.replaceState;
history.replaceState=function(a,b,u){
  if (u && u.includes('&ia=')) {
    u=u.replace(/&ia=[^&]+/, '');
    }
  return hreplaceState.apply(history, [a,b,u]);
  }

var hpushState=history.pushState;
history.pushState=function(a,b,u){
  if (u && u.includes('&ia=')) {
    u=u.replace(/&ia=[^&]+/, '');
    }
  return hpushState.apply(history, [a,b,u]);
  }


var inited=0;
function init(){
  if (inited++) return;
  new MutationObserver(function(mutL){
    for(let mut of mutL) {
      if (mut.target && (mut.target.id=='react-duckbar') ) {
        fix(mut.target);
        return;
        }
      }
    }).observe(document.body, { attributes: false, childList: true, subtree: true});
  fix();
  }

function fix(r=document) {
  var a=r.querySelectorAll('a[href*="ia="]');
  for (let i=0,e; e=a[i]; i++) {
    e.search=e.search.replace(/&ia=[^&]+/, '');
    }
  }

if (document.readyState != 'loading') init();
else {
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  }


})();