// ==UserScript==
// @name         淘宝天猫PC网站默认字体替换
// @namespace    sprialmint
// @version      0.1
// @description  淘宝天猫PC网站的默认字体对高分屏显示不友好，替换为微软雅黑
// @author       sprialmint
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456532/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%ABPC%E7%BD%91%E7%AB%99%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/456532/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%ABPC%E7%BD%91%E7%AB%99%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fontStyle = 'body, button, input, select, textarea, a { font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif !important;letter-spacing: 0.5px !important;-webkit-tap-highlight-color: rgba(18,18,18,0) !important;  }';
    var domHead = document.getElementsByTagName('head')[0];
    var domStyle = document.createElement('style');
    domStyle.type = 'text/css';
    domStyle.rel = 'stylesheet';
    domStyle.appendChild(document.createTextNode(fontStyle));
    domHead.appendChild(domStyle);
})();