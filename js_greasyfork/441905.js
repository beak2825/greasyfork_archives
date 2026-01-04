// ==UserScript==
// @name         允许学习通后台播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除监听器
// @author       LikeJson<
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/441905/%E5%85%81%E8%AE%B8%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441905/%E5%85%81%E8%AE%B8%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        let eventList = ["mouseout", "mousemove", "mousedown", "mouseover", "mouseup", "dragover", "touchmove"];

        for (let type of eventList) {
            window.addEventListener(type, function(event) {
                event.stopPropagation();
            }, true);
        }
    }
})();