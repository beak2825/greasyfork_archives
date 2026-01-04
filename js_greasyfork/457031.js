// ==UserScript==
// @name 【聊天室CSS优化】
// @namespace http://tampermonkey.net/
// @version 0.1.2
// @description 为聊天室客户端加入一些CSS优化。当前包括：输入框高度限制。
// @author firetree
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.hack.chat/*
// @match *://*.crosst.chat/*
// @match *://*.xq.kzw.ink/*
// @match *://*.tanchat.fun/*
// @downloadURL https://update.greasyfork.org/scripts/457031/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4CSS%E4%BC%98%E5%8C%96%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457031/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4CSS%E4%BC%98%E5%8C%96%E3%80%91.meta.js
// ==/UserScript==

(function() {
let css = `
    textarea {
        max-height: 400px;
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
