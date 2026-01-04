// ==UserScript==
// @name         IMDb fullscreen imageviewer
// @namespace    https://github.com/Procyon-b
// @version      0.3
// @description  Fix the new layout to make it look more like the old design. Display old & new layout fullscreen.
// @author       Achernar
// @match        https://www.imdb.com/*/mediaviewer/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406544/IMDb%20fullscreen%20imageviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/406544/IMDb%20fullscreen%20imageviewer.meta.js
// ==/UserScript==

(function() {
"use strict";

addSt('.mediaviewer__head-banner:not(.media-viewer__action-bar) {height: 0;} .mediaviewer__head-banner + div > div {height: calc(100% + 65px) !important;} nav, footer, button[aria-label="Open"] {display: none !important;} div[data-testid="media-viewer"] {height: 100vh !important;} .media-viewer__action-bar {position: absolute; left: 0; z-index: 10; background:rgba(20, 20, 20, 0.85); border-bottom: 1px solid rgba(255,255,255,0.2);}');

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

function init(){
  window.dispatchEvent(new MouseEvent('resize'));
  var ms=document.querySelector('[data-testid="media-sheet"]'),
    ab=document.querySelector('[data-testid="action-bar"]');
  if (!ms || !ab) return;
  var obs=new MutationObserver(function(muts){
    for (let mut of muts) {
      if (mut.attributeName!='aria-hidden') continue;
      let t=mut.target;
      if (!t || !(t.tagName=='DIV' && ( t.className.includes('MediaPanel') || (t.dataset.testid=='media-sheet'))) ) continue;
      ab.style.display= t.style.visibility=='hidden' ? 'none' : '';
      }
    });

  obs.observe(ms.closest('[data-testid="media-viewer"]'),
    {attributes: true, childList: false, subtree: true});
  }
if (document.readyState != 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

})();