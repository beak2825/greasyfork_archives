// ==UserScript==
// @name         计算当前学期平均绩点
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  计算当前学期平均绩点，适用于湖北工业大学
// @author       摘叶飞镖
// @match        http://run.hbut.edu.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hbut.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447711/%E8%AE%A1%E7%AE%97%E5%BD%93%E5%89%8D%E5%AD%A6%E6%9C%9F%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/447711/%E8%AE%A1%E7%AE%97%E5%BD%93%E5%89%8D%E5%AD%A6%E6%9C%9F%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const innerFrame = document.getElementsByTagName("iframe")._mainFrame;

    function calAveGPA() {
        let innerDocument = innerFrame.contentWindow.document;
        let mainContent = innerDocument.getElementById("mainContent");
        let tableList = innerDocument.getElementsByClassName("table-list")[0];
        let target = innerDocument.getElementById("res");
        if (target == null) {
            target = document.createElement("p");
            mainContent.insertBefore(target, tableList);
            target.id = "res";
        }

        let sumGPAMultipleCredit = 0;
        let sumCredit = 0;
        let i = 0;
        let tbody = innerDocument.getElementsByTagName("tbody")[0];

        tbody.childNodes.forEach(child => {
            if (child.tagName == "TR") {
                if (i == 0) {
                    i++;
                } else {
                    let gpa = child.childNodes[7].innerHTML.trim();
                    let credit = child.childNodes[9].innerHTML.trim();
                    if (gpa != "") {
                        sumCredit += parseFloat(credit);
                        sumGPAMultipleCredit += parseFloat(credit) * parseFloat(gpa);
                    }
                }
            }
        });
        let averageGPA = sumGPAMultipleCredit / sumCredit;
        target.innerHTML = "当前学期平均绩点：" + averageGPA.toFixed(4);
    }

    window.setInterval(function() {
        if (innerFrame.contentWindow.location.href == "http://run.hbut.edu.cn/StuGrade/Index" && innerFrame.contentWindow.document.readyState == "complete") {
            calAveGPA();
        }
    }, 1000);

})();