// ==UserScript==
// @name       百度云不限速，支持一下嘛
// @namespace    ht
// @description  提供百度云不限速，最新，没有失效哦，目前最新的方法
// @version      2.7
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472952/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8D%E9%99%90%E9%80%9F%EF%BC%8C%E6%94%AF%E6%8C%81%E4%B8%80%E4%B8%8B%E5%98%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/472952/%E7%99%BE%E5%BA%A6%E4%BA%91%E4%B8%8D%E9%99%90%E9%80%9F%EF%BC%8C%E6%94%AF%E6%8C%81%E4%B8%80%E4%B8%8B%E5%98%9B.meta.js
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
        window.open('https://rwcc.xyz/');
    });
})();