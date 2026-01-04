// ==UserScript==
// @name         中铁e通刷课,同时考试破解复制粘贴功能
// @namespace    http://121.40.75.68:1190/
// @version      1.7
// @description  自动强制5倍速度，避免后台审查，同时当网页显示"已完成"时，自动点击"下一节"按钮，考试破解复制粘贴功能。
// @author       MasterWu
// @match        https://crec4.21tb.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477980/%E4%B8%AD%E9%93%81e%E9%80%9A%E5%88%B7%E8%AF%BE%2C%E5%90%8C%E6%97%B6%E8%80%83%E8%AF%95%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/477980/%E4%B8%AD%E9%93%81e%E9%80%9A%E5%88%B7%E8%AF%BE%2C%E5%90%8C%E6%97%B6%E8%80%83%E8%AF%95%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClick() {
        const pageText = document.body.textContent;
        if (pageText.includes("下一节")) {
            const nextButton = document.querySelector("button.next-button");
            if (nextButton) {
                nextButton.click();
            }
        }
    }
    const checkInterval = 2000;
    setInterval(checkAndClick, checkInterval);
})();

(function() {
    'use strict';

    // 检查URL是否匹配
    if (window.location.href.startsWith("https://crec4.21tb.com/els/html/courseStudyItem/")) {

        var confirmCode = confirm("是否需要开启视频加速，如果有时间限制请选取消，若选择错误，重新刷新页面即可？");

        if (confirmCode) {

            window.onload = function() {
                document.getElementsByClassName('title')[0].innerText = "BOT FOR YOU";
            }

            function sudu() {
                document.querySelector('iframe').contentWindow.document.querySelectorAll('video')[0].playbackRate = 7;
            }
            setInterval(sudu, 100);

            function enterCourse() {
                var sections = document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item');
                var finishedSections = document.querySelector('iframe').contentWindow.document.querySelectorAll('li.section-item.finish');
                var nextSectionIndex = finishedSections.length;

                if (nextSectionIndex < sections.length) {
                    sections[nextSectionIndex].click();
                }
            }

            var myTimer = setInterval(enterCourse, 50000);
        }
    }
})();

(function() {
    // 检查URL是否匹配
    if (window.location.href.startsWith("https://crec4.21tb.com/ems/html/exercise/*")) {
    'use strict';

    // Wait for the document to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Get the body element
        var body = document.body;

        // Remove oncopy and onPaste attributes
        body.removeAttribute('oncopy');
        body.removeAttribute('onPaste');
    });
    }
})();

