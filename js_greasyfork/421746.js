// ==UserScript==
// @name VRV Video Size Maximizer
// @description Maximizes the vrv.co video display to the viewport
// @namespace matthock
// @version 4
// @match https://vrv.co/*
// @downloadURL https://update.greasyfork.org/scripts/421746/VRV%20Video%20Size%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/421746/VRV%20Video%20Size%20Maximizer.meta.js
// ==/UserScript==
  
function initCSS() {
  const ele= document.createElement('style');
  ele.type = 'text/css';
  ele.innerHTML = `
    .erc-header {
      order: 2;
    }
    .app-body-wrapper {
      order: 1;
    }
    .app-footer-wrapper {
      order: 3;
    }
    .erc-header .header-content {
      position: relative;
    }
    .watch-page-container .video-player-wrapper {
      max-width: 99vw;
      max-height: 99vh;
    }
    .erc-shelf-feed-item:not(#recommendations):not(#continue_watching):not(#browse_popular):not(#browse_newly){
      display: none;
    }
    .erc-view-all-feed-section {
      display: none;
    }
  `;
  document.head.appendChild(ele);
}

if (document.readyState!='loading') initCSS();
else document.addEventListener('DOMContentLoaded', initCSS());