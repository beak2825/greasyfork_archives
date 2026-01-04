// ==UserScript==
// @name         高校邦“编程”滚动临时修复
// @namespace    Asdfqw
// @version      0.1
// @description  允许播放页面的预览页面的滚动
// @author       Lao-Fang
// @match        https://programming.gaoxiaobang.com/player.html*
// @grant        none
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/451769/%E9%AB%98%E6%A0%A1%E9%82%A6%E2%80%9C%E7%BC%96%E7%A8%8B%E2%80%9D%E6%BB%9A%E5%8A%A8%E4%B8%B4%E6%97%B6%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/451769/%E9%AB%98%E6%A0%A1%E9%82%A6%E2%80%9C%E7%BC%96%E7%A8%8B%E2%80%9D%E6%BB%9A%E5%8A%A8%E4%B8%B4%E6%97%B6%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    debugger
    if(window.parent != window.self)
    {
        injectCSS(`
            #resultiframe
            {
                height: 200px!important;
            }
        `);
    }
})();

function injectCSS(text)
{
    var styleEle = document.createElement("style");
    styleEle.innerHTML = text;
    document.documentElement.appendChild(styleEle);
}