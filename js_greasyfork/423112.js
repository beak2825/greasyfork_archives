// ==UserScript==
// @name JuypterLab 限制行高
// @namespace nathan60107
// @version 0.1
// @description try to take over the world!
// @author Nathan
// @grant GM_addStyle
// @run-at document-start
// @include http://140.118.155.53:8039/lab*
// @downloadURL https://update.greasyfork.org/scripts/423112/JuypterLab%20%E9%99%90%E5%88%B6%E8%A1%8C%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423112/JuypterLab%20%E9%99%90%E5%88%B6%E8%A1%8C%E9%AB%98.meta.js
// ==/UserScript==

(function() {
let css = `
.jp-OutputArea-child {
    max-height: 15em;
}

.jp-OutputArea-child .jp-OutputArea-output {
    overflow: auto;
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
