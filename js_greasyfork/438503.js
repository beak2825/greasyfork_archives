// ==UserScript==
// @name        Notion Full-Width Pages in Narrow Viewport Edited
// @namespace   Notion Custom Scripts
// @match       *://www.notion.so/*
// @grant       GM_addStyle
// @version     1.4
// @author      Jacob Zimmerman (jczimm) <jczimm@jczimm.com> modified by symant233
// @description Allows pages to fill the viewport width when the viewport is narrow.
// @downloadURL https://update.greasyfork.org/scripts/438503/Notion%20Full-Width%20Pages%20in%20Narrow%20Viewport%20Edited.user.js
// @updateURL https://update.greasyfork.org/scripts/438503/Notion%20Full-Width%20Pages%20in%20Narrow%20Viewport%20Edited.meta.js
// ==/UserScript==

GM_addStyle(`
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
    .notion-frame > .notion-scroller > div:not(.notion-page-content) 
    > div:not([contenteditable="false"]), .notion-page-content {
        padding-left: 1.2em !important;
        padding-right: 0.6em !important;
    }
    .notion-frame > .notion-scroller > div:not(.notion-page-content)[style*="padding"] {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    div[data-block-id] {
        max-width: unset !important;
    }
    #notion-app > div > div.notion-cursor-listener > div.notion-sidebar-container > div > div > div > div:last-child {
        display: none !important;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0,0,0,0) !important;
    }
}`);
