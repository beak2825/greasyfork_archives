// ==UserScript==
// @name         webofscience_gindex_button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Display a floating window to show g-index，生成一个计算并显示G指数的浮窗
// @author       LuDreamst with copilot
// @match        https://webofscience.clarivate.cn/wos/woscc/citation-report/*
// @match        https://webofscience.clarivate.cn/wos/alldb/citation-report/*
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/495640/webofscience_gindex_button.user.js
// @updateURL https://update.greasyfork.org/scripts/495640/webofscience_gindex_button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    // 计算g指数的函数
    function calculateGIndex(citations) {
        let sumcitations = 0;
        let i;
        for (i = 1; i < citations.length; i++) {
            sumcitations += citations[i];
            if (sumcitations < (i+1)*(i+1)) {
                break;
            }
        }
        return i;
    }

    // 创建一个新的按钮
    var calculateButton = document.createElement('button');
    calculateButton.textContent = 'Calculate G-index';
    calculateButton.style.position = 'fixed';
    calculateButton.style.top = '120px';
    calculateButton.style.right = '10px';
    document.body.appendChild(calculateButton);

    // 为按钮添加点击事件监听器
    calculateButton.addEventListener('click', function() {
        try {
            // 获取所有引用
            var citationElements = document.querySelectorAll("#snPubs > table > tr > td:nth-child(8)")
            var citations = Array.from(citationElements).map(el => Number(el.textContent));
            console.log('Citations:', citations);
            var gIndex = calculateGIndex(citations);
            console.log('G-index:', gIndex);

            // 创建一个新的div作为浮动窗口
            var floatWindow = document.createElement('div');
            floatWindow.textContent = 'G-index: ' + gIndex;
            floatWindow.style.position = 'fixed';
            floatWindow.style.top = '145px';
            floatWindow.style.right = '10px';
            floatWindow.style.padding = '10px';
            floatWindow.style.backgroundColor = 'white';
            floatWindow.style.border = '1px solid black';
            // 将浮动窗口添加到body
            document.body.appendChild(floatWindow);
        } catch (error) {
            console.log('An error occurred:', error);
        }
    });
    
    console.log('Script ended');
})();
