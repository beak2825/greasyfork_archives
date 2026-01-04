// ==UserScript==
// @name         B站视频自动点赞
// @description  B站视频自动点赞，描述不能与名称相同
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       me
// @match        https://www.bilibili.com/video/BV*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456822/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/456822/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        document.querySelector(".like") && !document.querySelector(".like").className.includes("on") && document.querySelector(".like").click();
    }, 8000)
    // Your code here...
})();