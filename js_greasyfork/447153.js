// ==UserScript==
// @name         百度首页去底部白色条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度首页登录后自定义首页图片后，去除底部的白色条
// @author       huapeng222
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447153/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%BA%95%E9%83%A8%E7%99%BD%E8%89%B2%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/447153/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%BA%95%E9%83%A8%E7%99%BD%E8%89%B2%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("bottom_layer").parentNode.removeChild(document.getElementById("bottom_layer"));
    document.getElementById("s_lm_wrap").parentNode.removeChild(document.getElementById("s_lm_wrap"));
    document.getElementById("s_top_wrap").style.backgroundColor="#00000000";
})();