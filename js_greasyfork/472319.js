// ==UserScript==
// @name         免费资源488g,百度云，知乎严选，飞卢破解
// @namespace    ht
// @description  提供免费资源，包括电影、音乐、图书等等，享受最好的免费资源！
// @version      1.0
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472319/%E5%85%8D%E8%B4%B9%E8%B5%84%E6%BA%90488g%2C%E7%99%BE%E5%BA%A6%E4%BA%91%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%B8%A5%E9%80%89%EF%BC%8C%E9%A3%9E%E5%8D%A2%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/472319/%E5%85%8D%E8%B4%B9%E8%B5%84%E6%BA%90488g%2C%E7%99%BE%E5%BA%A6%E4%BA%91%EF%BC%8C%E7%9F%A5%E4%B9%8E%E4%B8%A5%E9%80%89%EF%BC%8C%E9%A3%9E%E5%8D%A2%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮
    var button = document.createElement('button');
    button.innerHTML = '免费资源';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.bottom = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff0000';
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 当按钮被点击时，打开免费资源网站
    button.addEventListener('click', function() {
        window.open('http://rwcc.svvs.top/');
    });
})();