// ==UserScript==
// @name YouTube normal-sized
// @namespace https://greasyfork.org/en/users/27283-mutationobserver
// @version 1.0.3
// @description Restores normal desktop sizing by shrinking text and spacing.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @match https://www.youtube.com/
// @match https://www.youtube.com/watch*
// @match https://www.youtube.com/?*
// @match https://www.youtube.com/embed*
// @downloadURL https://update.greasyfork.org/scripts/408964/YouTube%20normal-sized.user.js
// @updateURL https://update.greasyfork.org/scripts/408964/YouTube%20normal-sized.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.youtube.com/watch")) {
  css += `

  /* Header */
  #page-manager.ytd-app { margin-top: 0; }
  #masthead-container.ytd-app {
      opacity: 0;
      transition: 0.2s;
  }
  #masthead-container.ytd-app:hover {
     opacity: unset;
  }
  #columns > #primary { padding-top: 2px!important; }

  ytd-masthead #container { height: 10px!important; }
  #masthead-container.ytd-app:hover ytd-masthead #container { height: unset!important; }


  /* Desc */
  ytd-video-primary-info-renderer { padding: 0; }
  #info.ytd-video-primary-info-renderer { align-items: start; }
  #count span { color: var(--yt-spec-brand-button-background); }


  /* Comments + desc (#meta) */
  #comments *:not(#button):not(paper-button):not(ytd-button-renderer):not(#header):not(button):not(#tooltip):not(paper-item),
  #meta *:not(#upload-info):not(paper-button)
  {
      font-size: 13px!important;
      padding: 0;
      margin-top: 0!important;
      margin-bottom: 0!important;
  }
  paper-button.ytd-button-renderer { padding: 3px; }
  /* paper-item-body .item { padding: 10px; } */
  #comments .ytd-comments > #header { margin-bottom: 15px!important; }

  `;
}
if (location.href === "https://www.youtube.com/" || location.href.startsWith("https://www.youtube.com/?")) {
  css += `
  /* :root { --ytd-rich-grid-items-per-row: 5; } */


  ytd-rich-item-renderer {
      width: calc( 100% / 6 - var(--ytd-rich-grid-item-margin) - .01px )!important;
      margin-bottom: 0;
  }

  html:not([class]) div, html:not([class]) yt-formatted-string, html:not([class]) a {
      font-size: 14px!important;
      line-spacing: normal;
  }

  #avatar-link.ytd-rich-grid-video-renderer { display: none; }
  `;
}
if ((location.hostname === "youtube.com" || location.hostname.endsWith(".youtube.com"))) {
  css += `
  body { zoom: 90%; }
  `;
}
if (location.href.startsWith("https://www.youtube.com/watch") || location.href.startsWith("https://www.youtube.com/embed")) {
  css += `
  body { zoom: 100%; }
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
