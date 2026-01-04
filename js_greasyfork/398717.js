// ==UserScript==
// @name         学堂在线防止视频暂停播放（仅华工测试过）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  防止在切换页面时暂停视频播放
// @author       xoomoon
// @match        https://*.xuetangx.com/lms*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398717/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE%EF%BC%88%E4%BB%85%E5%8D%8E%E5%B7%A5%E6%B5%8B%E8%AF%95%E8%BF%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/398717/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E9%98%B2%E6%AD%A2%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE%EF%BC%88%E4%BB%85%E5%8D%8E%E5%B7%A5%E6%B5%8B%E8%AF%95%E8%BF%87%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function t(event) {
        event.stopPropagation();
    }

    // 去除后台检测
    setInterval(function(){
        addEventListener("visibilitychange", t, true);
        onblur = function(){};
    }, 1000);
})();