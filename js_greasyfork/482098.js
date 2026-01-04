// ==UserScript==
// @name         爱文的英语
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷新页面并显示刷新次数和累计刷新次数
// @author       You
// @match        https://teach.sxjgxy.edu.cn/meol/jpk/course/layout/newpage/index.jsp?courseId=12112
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482098/%E7%88%B1%E6%96%87%E7%9A%84%E8%8B%B1%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/482098/%E7%88%B1%E6%96%87%E7%9A%84%E8%8B%B1%E8%AF%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置刷新次数
    var refreshCount = 300;

    // 显示刷新次数和累计刷新次数的元素
    var countDisplay = document.createElement('div');
    countDisplay.style.position = 'fixed';
    countDisplay.style.top = '10px';
    countDisplay.style.right = '10px';
    countDisplay.style.padding = '5px';
    countDisplay.style.background = '#fff';
    document.body.appendChild(countDisplay);

    // 定时刷新页面
    var count = 0;
    var totalCount = 0;
    var intervalId = setInterval(function() {
        count++;
        totalCount++;
        countDisplay.textContent = '已刷新次数：' + count + '，累计刷新次数：' + totalCount;
        if (count > refreshCount) {
            clearInterval(intervalId);
        } else {
            location.reload();
        }
    }, 3000); // 刷新间隔，这里设置为3秒
})();
