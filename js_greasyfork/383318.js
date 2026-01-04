// ==UserScript==
// @name         隐藏百度搜索结果中 CSDN&百度经验&百度知道 的垃圾内容
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  try to take over the world!
// @author       pozhu
// @include      http*://www.baidu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/383318/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%20CSDN%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20%E7%9A%84%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/383318/%E9%9A%90%E8%97%8F%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%20CSDN%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%20%E7%9A%84%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    function cleanTheResult() {
        var list = Array.from(document.getElementsByClassName("source_1Vdff")).map((item) => item.firstChild);
        var rex = /CSDN|csdn|百度知道|百度经验|mamicode|bubuko|codercto|javascriptcn|程序员软件开发技术分享社区|编程字典|编程圈|thinbug|voidcc|慕课网|码客|编程之家/;
        var num = 0;

        function findParent(item) {
            // console.log(item);
            if (item.classList.contains("c-container")) {
                item.style.display = "none";
                num++;
            } else {
                findParent(item.parentElement);
            }
        }
        list.map((item) => {
            if (rex.test(item.innerText)) {
                findParent(item);
            }
        });
        console.log("已屏蔽" + num + "条搜索结果");
    }

    document.addEventListener("click", () => {
        cleanTheResult();
    });

    window.addEventListener("DOMContentLoaded", function () {
        cleanTheResult();
    });
})();
