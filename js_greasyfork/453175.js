// ==UserScript==
// @name         B站英雄联盟直播页滚动条
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给B站英雄联盟直播页添加滚动条
// @author       You
// @match        https://live.bilibili.com/6*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      Apache 2
// @downloadURL https://update.greasyfork.org/scripts/453175/B%E7%AB%99%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%E7%9B%B4%E6%92%AD%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/453175/B%E7%AB%99%E8%8B%B1%E9%9B%84%E8%81%94%E7%9B%9F%E7%9B%B4%E6%92%AD%E9%A1%B5%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.styleSheets[0].insertRule('body{overflow-x:hidden}', 0)
    document.styleSheets[0].insertRule('body::-webkit-scrollbar{display: initial !important;width:4px;/*background-color:#f5f5f5*/}', 0)
    document.styleSheets[0].insertRule('body::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);background-color:#62626d}', 0)
    //document.styleSheets[0].insertRule('body::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);background-color:#555}', 0)
    //document.styleSheets[0].insertRule('body::-webkit-scrollbar-track{border-radius:10px;-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);background-color:#f5f5f5}', 0)
    //document.styleSheets[0].insertRule('body::-webkit-scrollbar-button:single-button:vertical:decrement{border-radius:10px;-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);background-color:#f5f5f5}', 0)
    //document.styleSheets[0].insertRule('body::-webkit-scrollbar-button:single-button:vertical:increment{border-radius:10px;-webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);background-color:#f5f5f5}', 0)
})();