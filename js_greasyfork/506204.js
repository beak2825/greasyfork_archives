// ==UserScript==
// @name         修改小网站视频框架高度
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将网页中特定 div 修改为合适的高度
// @author       coccvo
// @match        *://*.buzz/*
// @match        *://*.xyz/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfklEQVQ4jd3SvQ3CMBiE4UeQniEisUSKSOmYhGlosggDMAgbuMkKkZLGoMhyfiAVvJIr353v02f+hgsChpkToubFEe00IKBaeKCKGjjhEYPfDHmfVFPiidu3AQHXnGdLQIc69Rw2GKf0S/XWyI5QfNigwR3n9GL3Gnd/pB9mBNGtLEpKFN2LAAAAAElFTkSuQmCC
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506204/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E6%A1%86%E6%9E%B6%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/506204/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E6%A1%86%E6%9E%B6%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyHeight() {
        // 获取所有具有MacPlayer类名的div元素
        const macPlayerElements = document.querySelectorAll('div.MacPlayer');
        macPlayerElements.forEach(element => {
            element.style.height = '750px';
        });
         // 获取所有具有text-list-html类名的div元素
        const textlistElements = document.querySelectorAll('div.text-list-html');
        textlistElements.forEach(textlist => {
            textlist.style.height = '750px';
        });

        // 查找id为'video'的元素
        const videoElement = document.getElementById('video');
        if (videoElement) {
            videoElement.style.height = '750px';
        }

        // 查找具有padding:10px;样式的div元素
        const paddingElements = document.querySelectorAll('div[style*="padding:10px;"]');
        paddingElements.forEach(element => {
            element.style.height = '320px';
        });
    }

    // 延迟执行
    setTimeout(modifyHeight, 1000);
})();