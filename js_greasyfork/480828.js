// ==UserScript==
// @name Google Icons Remover
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Removes icons (favicons) from top of each search result. Saves vertical space.
// @author Doron Gold
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https://www\.google\.[^/]*/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/480828/Google%20Icons%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/480828/Google%20Icons%20Remover.meta.js
// ==/UserScript==

(function() {
let css = `
    .g div.yuRUbf a > h3 + div > .H9lube,
    .g div.yuRUbf a > h3 + div > div > span,
    .g div.yuRUbf a + div > div > span,
    .g div.yuRUbf a + div > div > div > span {
        display: none;
    }
    .g div.yuRUbf a > h3,
    .g div.yuRUbf a + div > div {
        margin-top: 0;
    }

    .g div.csDOgf {
        display: none
    }


    .g .DKV0Md {
        padding-top: 0px;
    }

    .g .MjjYud {
        display: none;
        visibility: hidden;
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
