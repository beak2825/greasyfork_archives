// ==UserScript==
// @name bilibili-highlight-cate-tags
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Hightlight bilibili tags which is a category.
// @author CKylinMC
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/431798/bilibili-highlight-cate-tags.user.js
// @updateURL https://update.greasyfork.org/scripts/431798/bilibili-highlight-cate-tags.meta.js
// ==/UserScript==

(function() {
let css = `
    ul.tag-area>li.tag>a.tag-link[href^="//www.bilibili.com/v/"]{
        font-weight: bold;
        color: #00a1d6!important;
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
