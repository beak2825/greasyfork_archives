// ==UserScript==
// @name        Notion Full-Width Pages in Narrow Viewport
// @namespace   Notion Custom Scripts
// @match       *://www.notion.so/*
// @grant       none
// @version     0.1
// @author      Jacob Zimmerman (jczimm) <jczimm@jczimm.com>
// @description Allows pages to fill the viewport width when the viewport is narrow.
// @downloadURL https://update.greasyfork.org/scripts/404704/Notion%20Full-Width%20Pages%20in%20Narrow%20Viewport.user.js
// @updateURL https://update.greasyfork.org/scripts/404704/Notion%20Full-Width%20Pages%20in%20Narrow%20Viewport.meta.js
// ==/UserScript==

function addStyle(cssCode) {
    const head = document.querySelector('head')
    if (head) {
      const style = document.createElement('style')
      style.type = 'text/css'
      style.innerHTML = cssCode
      head.appendChild(style)
    }
}

addStyle(`
@media (max-width: 850px) {
  .notion-overlay-container > div > div > div[style*="relative"] { /* don't select the gray background overlay, which has position: absolute */
      max-height: unset !important;
      max-width: unset !important;
      width: 100% !important;
      height: 100% !important;
      top: 0 !important;
  }
  .notion-overlay-container .notion-quick-find-menu,
  .notion-overlay-container .notion-quick-find-menu > div {
      max-height: unset !important;
      max-width: unset !important;
  }

  .notion-frame > .notion-scroller > div:not(.notion-page-content) > div,
  .notion-page-content {
      padding-left: 1em !important;
      padding-right: 1em !important;
  }

  .notion-frame > .notion-scroller > div:not(.notion-page-content)[style*="padding"] {
      padding-left: 0 !important;
      padding-right: 0 !important;
  }

  div[data-block-id] {
      max-width: unset !important;
  }
}
`)