// ==UserScript==
// @name         南+添加上传图片功能
// @namespace    http://zhugeqing.net/
// @version      0.1
// @description  给南+添加上传图片功能
// @author       zhugeqing
// @match        https://summer-plus.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=66img.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472849/%E5%8D%97%2B%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472849/%E5%8D%97%2B%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找指定的元素
    var textareaElement = document.querySelector('textarea[onkeydown="quickpost(event)"][name="atc_content"]');


    if (textareaElement) {
        // 创建要添加的代码行
        var scriptElement = document.createElement('script');
        scriptElement.async = true;
        scriptElement.src = '//66img.cc/sdk/pup.js';
        scriptElement.setAttribute('data-url', 'https://66img.cc/upload');
        scriptElement.setAttribute('data-auto-insert', 'bbcode-embed');

        // 在元素上方添加代码行
        textareaElement.parentNode.insertBefore(scriptElement, textareaElement);
    }
/**/
     var targetElement = document.querySelector('span.editor-button');

    // 创建新的 <script> 标签
    var newScript = document.createElement('script');
    newScript.async = true;
    newScript.src = '//66img.cc/sdk/pup.js';
    newScript.setAttribute('data-url', 'https://66img.cc/upload');
    newScript.setAttribute('data-auto-insert', 'bbcode-embed');

    // 在指定元素后插入新的 <script> 标签
    targetElement.parentNode.insertBefore(newScript, targetElement.nextSibling);


})();