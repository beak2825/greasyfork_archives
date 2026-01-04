// ==UserScript==
// @name bilibili 屏蔽b站系统通知
// @namespace giligili
// @version 1.0.1
// @description 叮！你获得了新的限时任务啦！呕——呕——
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/446717/bilibili%20%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/446717/bilibili%20%E5%B1%8F%E8%94%BDb%E7%AB%99%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
let css = `
    .red-num--message,.message-inner-list> a:nth-child(4)>.message-inner-list__item--num,.nav-item-message>.t>.num,a[href="//message.bilibili.com/#/system"]>span,.side-bar>.list>li:nth-child(4)>a>.notify-number{display: none!important;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
