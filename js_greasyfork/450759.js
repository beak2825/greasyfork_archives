// ==UserScript==
// @name Goodreads: Bunken Extension/Userscript Styling
// @namespace github.com/holyspiritomb
// @version 0.0.5
// @description Modifications to make Bunken look better, to be used along with my main Goodreads styles.
// @author holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/blob/main/goodreads/bunken.user.css
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www\.goodreads\.com/book/(?!add_to_books_widget/).*)$/
// @downloadURL https://update.greasyfork.org/scripts/450759/Goodreads%3A%20Bunken%20ExtensionUserscript%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/450759/Goodreads%3A%20Bunken%20ExtensionUserscript%20Styling.meta.js
// ==/UserScript==

(function() {
let css = `
    div.bigBox[style] {
        margin-top: 10px;
        margin-bottom: 10px;
        border-bottom: 0 !important;
        border-top: 1px solid #555 !important;
        box-sizing: border-box;
        font-family: Lato, sans-serif !important;
    }
    html.desktop div.bigBox {
        margin-top: 10px;
        width: 100%;
    }
    html.mobile div.bigBox,
    html.mobile div.bigBox[style] {
        width: 80% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        font-family: Lato, sans-serif !important;
        font-size: 12pt;
        line-height: 16pt;
    }
    div.bigBox > h4 {
        display: none;
    }
    html:not(.mobile) div.bigBox > div:nth-child(2) {
        margin-left: unset !important;
        margin-right: unset !important;
        width: 100% !important;
    }
    div.bigBox > select {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
    div.bigBox > div.h2Container {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    div#ebookResults {
        max-height: 30vh !important;
        padding-top: 10px;
        padding-bottom: 10px;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
