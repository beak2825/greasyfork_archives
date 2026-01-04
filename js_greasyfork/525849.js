// ==UserScript==
// @name         eks括号包裹工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为所有 eks 元素的内容添加括号
// @author       Your Name
// @match        https://arhiiv.eki.ee/dict/eks/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/525849/eks%E6%8B%AC%E5%8F%B7%E5%8C%85%E8%A3%B9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525849/eks%E6%8B%AC%E5%8F%B7%E5%8C%85%E8%A3%B9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wrapContent() {
        // 选择所有目标元素
        const spans = document.querySelectorAll('span.s[lang="et"]');

        spans.forEach(span => {

            if(!span.textContent.startsWith("[")){
               span.textContent = `(${span.textContent})`;
            }

        });
        const divs = document.querySelectorAll('div.valjendid');

        divs.forEach(div => {

               div.remove();

        });

        const spans2 = document.querySelectorAll('span.etp');

        spans2.forEach(div => {

        div.remove();

        });

        const div3 = document.querySelector('div.mmumm');
        div3.remove();

const brElements = document.querySelectorAll('br');

// 遍历<br>标签
brElements.forEach((br) => {
    // 获取<br>标签的下一个兄弟节点
    const nextSibling = br.nextSibling;

    // 检查下一个兄弟节点是否是文本节点且内容为"2"
    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE && nextSibling.nodeValue.trim() === '◊') {
        // 删除文本节点
        nextSibling.remove();
        // 删除<br>标签
        br.remove();
    }
});

    }


    setTimeout(wrapContent, 1000);



})();