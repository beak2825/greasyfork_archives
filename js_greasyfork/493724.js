// ==UserScript==
// @name         仅打印题目
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  仅供问卷星客户使用，在成绩单页面，仅打印错误题目到PDF；
// @author       任亚军
// @match        https://www.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @match        https://chengzidili.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @match        http://chengzidili.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493724/%E4%BB%85%E6%89%93%E5%8D%B0%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/493724/%E4%BB%85%E6%89%93%E5%8D%B0%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有 div.jixi_content_box 元素
    const contentBoxes = document.querySelectorAll('div.jixi_content_box');

    // 创建一个媒体查询监听器
    const printMediaQuery = window.matchMedia('print');

    // 监听媒体查询状态变化
    printMediaQuery.addListener(handlePrintMediaChange);

    // 处理打印事件
    function handlePrintMediaChange(event) {
        // 在打印时隐藏元素
        if (event.matches) {
            contentBoxes.forEach(function(box) {
                box.style.display = 'none';
            });
        }
        // 在非打印时显示元素
        else {
            contentBoxes.forEach(function(box) {
                box.style.display = 'block';
            });
        }
    }
})();
