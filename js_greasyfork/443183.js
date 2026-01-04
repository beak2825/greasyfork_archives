// ==UserScript==
// @name        Odysee QoL
// @namespace   Violentmonkey Scripts
// @grant GM_addStyle
// @run-at document-start
// @include http://odysee.com/*
// @include https://odysee.com/*
// @include http://*.odysee.com/*
// @include https://*.odysee.com/*
// @version     1.1
// @author      Arun Sunner
// @description 11/04/2022, 11:07:20
// @downloadURL https://update.greasyfork.org/scripts/443183/Odysee%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/443183/Odysee%20QoL.meta.js
// ==/UserScript==



(function() {  
  let css = "";
  
  if ((location.hostname === "odysee.com" || location.hostname.endsWith(".odysee.com"))) {
      css += `
          @import url('https://rsms.me/inter/inter.css');

          html:not(.video-js > .vjs-icon-placeholder) {
              font-family: 'Inter' !important;
          }

          html {
              scrollbar-color: #787879 #272728;
          }

          .main-wrapper .background-image {
              background-image: none !important;
              background: #121212 !important; 
          }
          
          nav[aria-label="Sidebar"] {
              scrollbar-width: none;
          }
      `;
  }
  
  /* if ((location.hostname === "odysee.com" || location.hostname.endsWith(".odysee.com") && (visualViewport.width = 3008) == true)) {
     css += `
          .content__viewer:not(.content__viewer--floating) {
            width: 56.45% !important;
            top: 33px !important;
          }

          .content__viewer:not(.content__wrapper--floating) .file-render--video {
            min-height: calc(var(--desktop-portrait-player-max-height) - 4.25em) !important;
            min-width: 66.5vw !important;
          }

          .file-page__recommended {
            padding-top: 60.75em !important;
          }

          .file-page__secondary-content {
            padding-top: 15em !important;
          }
     `;
  } */
  
    
  if (location.href.startsWith("https://odysee.com/$/embed")) {
      css += `
          .button__content {
            display: inline !important;
          }
          
          a.button:nth-child(2) > span:nth-child(1) {
            margin-top: 7px;
          }

          .file-viewer__embedded-title .button__label {
            margin-left: -22px !important;
          }
          
          .file-viewer__embedded-info {
            padding-top: 3px !important;
            margin-right: -22px !important;
          }

          .file-viewer__embedded-header {
            height: 20vh !important;
          }
      `;
  }
  
  if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css);
  } else {
      let styleNode = document.createElement("style");
      styleNode.appendChild(document.createTextNode(css));
      (document.querySelector("head") || document.documentElement).appendChild(styleNode);
  }
  
  document.querySelector('.main-wrapper .background-image').style.removeProperty('background-image');
})();