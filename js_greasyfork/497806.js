// ==UserScript==
// @name         一键打开360夸克所有资产
// @namespace    http://tampermonkey.net/
// @version      2024-06-13 v0.2
// @description  一键打开360夸克所有资产，为mj老板定制！
// @author       Tajang
// @match        https://quake.360.net/quake/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=360.net
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/497806/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80360%E5%A4%B8%E5%85%8B%E6%89%80%E6%9C%89%E8%B5%84%E4%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/497806/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80360%E5%A4%B8%E5%85%8B%E6%89%80%E6%9C%89%E8%B5%84%E4%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        console.log("为mj老板定制！");
        const outputButton = document.querySelector('.picker-box button');
        const preposition = document.querySelector('.model-box');

        if (outputButton) {
            const openButton = outputButton.cloneNode(true);
            openButton.innerHTML = '打开全部资产';
            openButton.type = 'button';
            openButton.style.marginLeft = '1em';
            openButton.addEventListener('click', function() {

                //查找两种模式下含有跳转按钮的div
                var ClassElements = document.querySelectorAll('.item-top-line');
                var TableElements = document.querySelectorAll('.el-table__fixed-right');
                
                // 遍历每个 大类元素，查找所有<a>标签，打开所有<a>里的链接

                //经典模式
                if (ClassElements){
                    ClassElements.forEach(function(itemTopLine) {
                        var aElements = itemTopLine.querySelectorAll('a');
                        aElements.forEach(function(a) {
                            console.log(a);
                            window.open(a.href, '_blank');
                        });
                    });
                }

                //列表模式
                if (TableElements){
                    TableElements.forEach(function(rightLine) {
                        var bElements = rightLine.querySelectorAll('a');
                        bElements.forEach(function(a) {
                            console.log(a);
                            window.open(a.href, '_blank');
                        });
                    });
                }

            });
            preposition.appendChild(openButton);
        }
    });
})();
