// ==UserScript==
// @name         YouTube 3 Video Grid Fix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fixes Youtubes stupid update idea to allow only 3 videos to load in each grid.
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533648/YouTube%203%20Video%20Grid%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/533648/YouTube%203%20Video%20Grid%20Fix.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const ID = 'yt5col-home',
          CSS = `
            ytd-rich-grid-renderer{--ytd-rich-grid-items-per-row:5!important}
            ytd-rich-grid-renderer>#contents>ytd-rich-grid-row,
            ytd-item-section-renderer ytd-rich-grid-row{
              display:grid!important;
              grid-template-columns:repeat(5,minmax(0,1fr))!important;
              gap:var(--ytd-rich-grid-gutter-margin,16px)!important;
              width:100%!important
            }
            ytd-thumbnail{max-height:none!important;height:auto!important;width:100%!important}
            ytd-thumbnail img{width:100%!important;height:100%!important;object-fit:cover!important}
          `;
    function update(){
        if(location.pathname==='/' && !document.getElementById(ID)){
            let s=document.createElement('style');
            s.id=ID; s.textContent=CSS;
            document.head.appendChild(s);
        }
        else if(location.pathname!=='/' && document.getElementById(ID)){
            document.getElementById(ID).remove();
        }
    }
    history.pushState     = (f=>function(){ f.apply(this,arguments); update(); })(history.pushState);
    history.replaceState  = (f=>function(){ f.apply(this,arguments); update(); })(history.replaceState);
    window.addEventListener('popstate', update);
    window.addEventListener('yt-navigate-finish', update);
    update();
})();