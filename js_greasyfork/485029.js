// ==UserScript==
// @name         萌娘百科歌词开关
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来分别开关百科歌词的原文和译文
// @author       miaotouy-GPT
// @match        https://zh.moegirl.org.cn/*
// @grant        none
// @icon         https://zh.moegirl.org.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485029/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%AD%8C%E8%AF%8D%E5%BC%80%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/485029/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%AD%8C%E8%AF%8D%E5%BC%80%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数用于切换元素的可见性
    function toggleVisibility(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
            if (element.style.display === 'none') {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // 在页面加载完毕后添加开关按钮
    window.addEventListener('load', function() {
        var controlPanel = document.querySelector('#photrans-button');
        if (controlPanel) {
            var originalLyricsToggleButton = document.createElement('span');
            var translatedLyricsToggleButton = document.createElement('span');

            originalLyricsToggleButton.innerHTML = '[<a href="javascript: void(0);" id="toggle-original-lyrics">开关原文歌词</a>] ';
            translatedLyricsToggleButton.innerHTML = '[<a href="javascript: void(0);" id="toggle-translated-lyrics">开关译文歌词</a>] ';

            // 在注音开关旁边添加原文歌词和译文歌词的开关按钮
            controlPanel.parentNode.insertBefore(translatedLyricsToggleButton, controlPanel.nextSibling);
            controlPanel.parentNode.insertBefore(originalLyricsToggleButton, translatedLyricsToggleButton);

            // 为原文歌词开关添加点击事件
            document.querySelector('#toggle-original-lyrics').addEventListener('click', function() {
                toggleVisibility('.Lyrics-original');
            });

            // 为译文歌词开关添加点击事件
            document.querySelector('#toggle-translated-lyrics').addEventListener('click', function() {
                toggleVisibility('.Lyrics-translated');
            });
        }
    });
})();
