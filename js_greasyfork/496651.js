// ==UserScript==
// @name         jab
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  页面优化
// @author       You
// @match        https://jable.tv/*
// @match        https://missav.com/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/496651/jab.user.js
// @updateURL https://update.greasyfork.org/scripts/496651/jab.meta.js
// ==/UserScript==

const cur_url = window.location.href;
(function() {
    'use strict';

    if (cur_url.includes('jable.tv')){
        // 调用函数，设置初始延迟为1000毫秒（1秒），总共执行3次
        executeFunctionWithDelay(func_jable, 1000, 10);

        // 同一个页面的要先获取元素
        let dom1=document.querySelector("#site-content > div > div > div:nth-child(1) > section.pb-3.pb-e-lg-40 > div.row.gutter-20 > div:nth-child(1)") // 列表页广告
        let dom2=document.querySelector("#site-content > div > div > div:nth-child(1) > section.pb-3.pb-e-lg-40 > div.row.gutter-20 > div:nth-child(2)")
        let dom3=document.querySelector("#site-content > div > div > div:nth-child(1) > section.pb-3.pb-e-lg-40 > div.row.gutter-20 > div:nth-child(4)")
        removeElementWithRetry(dom1)
        removeElementWithRetry(dom2)
        removeElementWithRetry(dom3)

        removeElementWithRetry(document.querySelector("#site-content > div > div > div:nth-child(1) > section.video-info.pb-3 > div.text-center > div:nth-child(6)")) // 标签下面的广告

        return;
    }

    if (cur_url.includes('missav.com')){
        executeFunctionWithDelay(func_missav, 1000, 10);
        return;
    }

    function func_jable() {
        let col = `div.col-6{ max-width:100% !important; flex: 1 1 auto !important;}`;
        GM_addStyle(col);
    }

    function func_missav() {
        let grid = `div.grid-cols-2{grid-template-columns: repeat(1,minmax(0,1fr))!important;}`;
        GM_addStyle(grid);
    }

    function removeElement(element) {
        // 检查元素是否存在
        if (element) {
            element.remove(); // 元素存在，调用remove()方法移除它
        } else {
            console.log(`${element} not exist.`);
        }
    }
    function removeElementWithRetry(element) {
        let attempt = 0;

        function attemptRemoval() {
            if (element) {
                // 元素存在，移除它并停止尝试
                element.remove();
                console.log("Element with ID '" + element + "' has been removed.");
            } else if (attempt < 3) {
                // 元素还不存在，增加尝试计数并延迟再次尝试
                attempt++;
                console.log("Element with ID '" + element + "' not found yet, attempt " + attempt);
                setTimeout(attemptRemoval, 1000); // 1秒后再次尝试
            } else {
                // 已经尝试3次，仍然没有找到元素
                console.log("Element with ID '" + element + "' not found after 3 attempts.");
            }
        }
        // 开始第一次尝试
        attemptRemoval();
    }

    // 使用递归的方式设置延迟执行
    function executeFunctionWithDelay(func, delay=1000, count=3) {
        if (count > 0) {
            setTimeout(function() {
                func();
                //debugger;
                executeFunctionWithDelay(func, delay, count - 1); // 递减计数器并调用自身安排下一次执行
                //console.log(`func is executed ${count}`);
            }, delay);
        }
    }

})();