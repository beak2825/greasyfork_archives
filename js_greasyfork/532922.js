// ==UserScript==
// @name        Youtube Max Video Height
// @namespace   Youtube Max Video Height
// @match       https://*.youtube.com/*
// @grant       GM_addStyle
// @version     1.0.0
// @author      popiazaza (original), dpi0 (modified)
// @description A simplified userscript to maximize height of youtube media player with no interaction
// @license     MIT
// @homepageURL https://github.com/dpi0/scripts/blob/main/greasyfork/youtube-max-video-height.js
// @originalhomepageURL https://github.com/popiazaza/Youtube-Max-Video-Height
// @supportURL  https://github.com/dpi0/scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/532922/Youtube%20Max%20Video%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/532922/Youtube%20Max%20Video%20Height.meta.js
// ==/UserScript==

GM_addStyle(`
ytd-watch-flexy[theater] #player-wide-container.ytd-watch-flexy, 
ytd-watch-flexy[fullscreen] #player-wide-container.ytd-watch-flexy, 
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy, 
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
  max-height: calc(100vh);
}
#masthead-container.ytd-app {
  opacity: 0;
  pointer-events: none;
}
#page-manager.ytd-app {
  margin-top: 0;
}
`);

(function() {
  // Set different styles for non-watch pages
  const observer = new MutationObserver(() => {
    const masthead = document.getElementById("masthead-container");
    if (!masthead) return;
    
    if (window.location.pathname.startsWith("/watch")) {
      // On watch pages, hide header and disable interactions
      masthead.style.opacity = "0";
      masthead.style.pointerEvents = "none";
      document.getElementById("page-manager").style.marginTop = "0";
    } else {
      // On non-watch pages, show header and enable interactions
      masthead.style.opacity = "1";
      masthead.style.pointerEvents = "auto";
      document.getElementById("page-manager").style.marginTop = 
        "var(--ytd-masthead-height,var(--ytd-toolbar-height))";
    }
  });
  
  // Run initially and observe for changes
  observer.observe(document, { subtree: true, childList: true });
  
  // Initial setup
  if (document.getElementById("masthead-container")) {
    if (window.location.pathname.startsWith("/watch")) {
      document.getElementById("masthead-container").style.opacity = "0";
      document.getElementById("masthead-container").style.pointerEvents = "none";
      document.getElementById("page-manager").style.marginTop = "0";
    } else {
      document.getElementById("masthead-container").style.opacity = "1";
      document.getElementById("masthead-container").style.pointerEvents = "auto";
      document.getElementById("page-manager").style.marginTop = 
        "var(--ytd-masthead-height,var(--ytd-toolbar-height))";
    }
  }
})();
