// ==UserScript==
// @name         合工大自动评教（点开相应老师的评教页面自动评教，提交即可）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click the first label under the class "group"
// @author       HFUT-BBYY
// @match        http://jxglstu.hfut.edu.cn/eams5-student/for-std/lesson-survey/start-survey/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470181/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E7%82%B9%E5%BC%80%E7%9B%B8%E5%BA%94%E8%80%81%E5%B8%88%E7%9A%84%E8%AF%84%E6%95%99%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%8C%E6%8F%90%E4%BA%A4%E5%8D%B3%E5%8F%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470181/%E5%90%88%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E7%82%B9%E5%BC%80%E7%9B%B8%E5%BA%94%E8%80%81%E5%B8%88%E7%9A%84%E8%AF%84%E6%95%99%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%8C%E6%8F%90%E4%BA%A4%E5%8D%B3%E5%8F%AF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    function clickFirstInput() {
        const groups = document.querySelectorAll('div.group');
        for (const group of groups) {
            const firstInput = group.querySelector('input[type="radio"]');
            if (firstInput) {
                firstInput.click(); // 模拟点击第一个input标签
            }
        }
    }

    // 使用定时器每隔1秒执行一次点击操作，可以根据需要调整时间间隔
    setInterval(clickFirstInput, 1000);
})();
