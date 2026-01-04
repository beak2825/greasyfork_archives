// ==UserScript==
// @name         百度废弃词条
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  遍历CSS选择器为“p > a”的元素并将不含lemma-id属性元素在当前页面高亮显示其innerText文本
// @author       Leo
// @match        https://baike.baidu.com/editor*
// @match        https://baike.baidu.com/wikitask*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472772/%E7%99%BE%E5%BA%A6%E5%BA%9F%E5%BC%83%E8%AF%8D%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/472772/%E7%99%BE%E5%BA%A6%E5%BA%9F%E5%BC%83%E8%AF%8D%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightElements() {
        // 获取所有匹配选择器的元素
        var elements = document.querySelectorAll('p > a');

        // 遍历元素并检查是否缺少lemma-id属性
        elements.forEach(element => {
            if (!element.hasAttribute('data-lemmaid')) {
                // 高亮显示元素的innerText文本
                element.style.backgroundColor = 'yellow';
            }
        });

        elements = document.querySelectorAll('a[data-lemma-id="0"]');

        // 遍历元素并检查是否缺少lemma-id属性

        elements.forEach(element => {
            if(element.attributes["data-lemma-id"].value == '0') {
                element.style.backgroundColor = 'yellow';
            }
        });
     }


    setInterval(highlightElements, 3000);


})();