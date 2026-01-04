// ==UserScript==
// @name 哔哩哔哩-隐藏高能弹幕的前缀图标
// @namespace ckylin-style-hidehighiconfromdanmaku
// @version 1.0.1
// @description 删除高能弹幕前的小图标
// @author CKylinMC
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/422100/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E9%9A%90%E8%97%8F%E9%AB%98%E8%83%BD%E5%BC%B9%E5%B9%95%E7%9A%84%E5%89%8D%E7%BC%80%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/422100/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E9%9A%90%E8%97%8F%E9%AB%98%E8%83%BD%E5%BC%B9%E5%B9%95%E7%9A%84%E5%89%8D%E7%BC%80%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
let css = `
    .bilibili-player-video-danmaku .b-danmaku-high-icon{
        display:none !important;
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
