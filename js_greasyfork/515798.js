// ==UserScript==
// @name        防止网页在失去焦点时自动暂停视频
// @namespace   Violentmonkey Scripts
// @match       https://missav.com/*/*
// @grant       none
// @license MIT
// @version     1.0
// @author      -
// @description 2024/11/3 20:32:54
// @downloadURL https://update.greasyfork.org/scripts/515798/%E9%98%B2%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%9C%A8%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E6%97%B6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/515798/%E9%98%B2%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%9C%A8%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E6%97%B6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 重写 HTMLMediaElement 的 pause 方法，防止视频自动暂停
    HTMLMediaElement.prototype.pause = function() {
        console.log("Attempted to pause video by:", this);
        // 如果希望在某些情况下允许暂停，可以在这里添加逻辑
        // 例如，可以通过检测 this.src 或其他属性来决定是否允许暂停
    };
})();
