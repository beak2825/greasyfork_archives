// ==UserScript==
// @name Genius Sticky Header
// @namespace arunsunner.com
// @version 1.0.0
// @description Makes the header on Genius.com stickied to the top.
// @author Arun Sunner
// @grant GM_addStyle
// @run-at document-start
// @match *://*.genius.com/*
// @downloadURL https://update.greasyfork.org/scripts/420242/Genius%20Sticky%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/420242/Genius%20Sticky%20Header.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "genius.com" || location.hostname.endsWith(".genius.com"))) {
  css += `
      /* Homepage */
      
      [class*="PageHeaderdesktop__Container"] {
      	position: fixed;
      	width: 100%;
      	z-index: 1;
      	-webkit-box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      	-moz-box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      	box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      }
      
      [class*="PageHeaderdesktop__Subnavigation"] {
      	padding-top: 60px;
      	padding-bottom: 20px;
      }
      
      [class*="SquareManySelects__Wrapper"] {
      	z-index: 0;
      }
      
      /* Other Pages */
      
      .snarly {
      	position: relative;
      	padding-top: 40px;
      	z-index: 0;
      }
      
      .header {
      	position: fixed;
      	width: 100%;
      	z-index: 1;
      	-webkit-box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      	-moz-box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      	box-shadow: 0px 13px 5px 0px rgba(0, 0, 0, 0.35);
      }
      
      .column_layout-column_span--secondary {
      	z-index: 0;
      }
      
      .header_with_cover_art-inner,
      .song_body {
      	z-index: 0;
      }
  `;
}
if (location.href.startsWith("https://genius.com/new") || location.href.startsWith("https://genius.com/firehose")) {
  css += `
      /* Old Style Pages */
      
      #container {
      	padding-top: 100px;
      }
      
      .activity_stream_event_unit.unread:not(.details_loaded) {
      	z-index: 0;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
