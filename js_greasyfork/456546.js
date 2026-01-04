// ==UserScript==
// @name kvraudio off-white forum
// @namespace KvR
// @version 0.666
// @description Changes most white background on the KvRaudio forum to light grey.
// @author farlukar
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.kvraudio.com/*
// @match https://www.kvraudio.com/plugins/*
// @match https://www.kvraudio.com/developer/*
// @match https://www.kvraudio.com/marketplace/*
// @match https://www.kvraudio.com/marketplace/deals*
// @match https://www.kvraudio.com/video*
// @match https://www.kvraudio.com/focus*
// @downloadURL https://update.greasyfork.org/scripts/456546/kvraudio%20off-white%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/456546/kvraudio%20off-white%20forum.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.kvraudio.com/")) {
  css += `
  :root {
    --bg1: #d8d8d8;
    --bg2: #e0e0e0;
    --bg3: #e8e8e8;
  }

  #scxbox, #column1, #column2, #kvrforumheader, #wrap, .row.bg1, .post.bg1 {
      background: var(--bg1) !important
  }
  li.row:hover { background: var(--bg3) !important }

  li.row, .post, form div, textarea, .panel {
      background: var(--bg2) !important
  }
  blockquote {
      border-color: #c0c0c0 !important;
      background-color: #dbdbdb !important
  }
  blockquote blockquote {
      background-color: #d8d8d8 !important
  }
  blockquote blockquote blockquote {
      background-color: #d4d4d4!important
  }
  blockquote blockquote blockquote blockquote {
      background-color: #d0d0d0 !important
  }
  blockquote blockquote blockquote blockquote blockquote {
      background-color: #cbcbcb !important
  }
  blockquote blockquote blockquote blockquote blockquote blockquote {
      background-color: #c8c8c8 !important
  }

  div[class^="pollbar"] {
      background-color: #BE1E4A !important
  }


  #pollotdholder {
      display: none !important
  }
  `;
}
if (location.href.startsWith("https://www.kvraudio.com/plugins/") || location.href.startsWith("https://www.kvraudio.com/developer/") || location.href.startsWith("https://www.kvraudio.com/marketplace/") || location.href.startsWith("https://www.kvraudio.com/marketplace/deals") || location.href.startsWith("https://www.kvraudio.com/video") || location.href.startsWith("https://www.kvraudio.com/focus")) {
  css += `
  #column2, #kvrpluginsearchform, .newsitem *, .pmaincontent {
      background-color: var(--bg1) !important
  }
  .kvrpbox > div, #devsatkvr, .pmaincontent.clickfiltersresults,
  .inkvrshop, #kvrblock > div, #kvrvideocontent {
      background-color: var(--bg2) !important
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
