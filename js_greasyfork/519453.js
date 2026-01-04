// ==UserScript==
// @name         绩点/学业基本分(新)
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description  try to take over the world!
// @author       You
// @match        http://class.seig.edu.cn:7001/sise/index.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seig.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519453/%E7%BB%A9%E7%82%B9%E5%AD%A6%E4%B8%9A%E5%9F%BA%E6%9C%AC%E5%88%86%28%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519453/%E7%BB%A9%E7%82%B9%E5%AD%A6%E4%B8%9A%E5%9F%BA%E6%9C%AC%E5%88%86%28%E6%96%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let iframe = document.querySelector("iframe");
    iframe.addEventListener("load", function () {
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let info = iframeDocument.querySelector("body > table > tbody > tr:nth-child(1) > td:nth-child(1)");
        info.addEventListener("click", showButton);
    });
    let button;
    let up_div = null;
    let one_year = -1;
    let closeButton;
    function showButton() {
        //按钮父容器
        let container = document.createElement('div');
        container.style.position = "fixed";
        container.style.right = "20px";
        container.style.bottom = "1px";
        container.style.fontSize = "12px";
        container.style.textAlign = "right";
        document.body.appendChild(container);

        // 计算按钮
        button = document.createElement('div');
        button.innerText = "Calculate";
        button.style.display = "inline-block";
        button.style.padding = "6px 12px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        container.appendChild(button);
        button.onclick = calculate;

        // 关闭按钮
        closeButton = document.createElement('div');
        closeButton.innerText = "×";
        closeButton.style.position = "absolute";
        closeButton.style.right = "0";
        closeButton.style.top = "0";
        closeButton.style.fontSize = "10px";
        closeButton.style.cursor = "pointer";
        container.appendChild(closeButton);
        closeButton.onclick = removeAllWindows;
    }

    let totalScoreCredit = 0;
    let totalCredit = 0;

    function calculate() {
        totalCredit = 0;
        totalScoreCredit = 0;
        outPut();
    }

    function getGroup() {
        try {
            let semester = [];
            let one = document.querySelectorAll('iframe')[0].contentDocument.querySelectorAll("#form1 > table:nth-child(6) > tbody > tr > td:nth-child(6)");
            let two = document.querySelectorAll('iframe')[0].contentDocument.querySelectorAll("#form1 > table:nth-child(11) > tbody > tr > td:nth-child(6)");
            let three = document.querySelectorAll('iframe')[0].contentDocument.querySelectorAll("#form1 > table:nth-child(15) > tbody > tr > td:nth-child(5)");
            semester.push(...one);
            semester.push(...two);
            semester.push(...three);
            let group = {};
            for (let i = 0; i < semester.length; i++) {
                let key;
                if (one_year == 1) {
                    key = semester[i].innerText.trim().substring(0, 9);
                } else {
                    key = semester[i].innerText.trim();
                }
                if (key == "") continue;
                const value = semester[i];
                if (!group.hasOwnProperty(key)) {
                    group[key] = [];
                }
                group[key].push(value);
            }
            return group;
        } catch (error) {
            console.log('group:' + error.message);
        }
    }

    function calculate1() {
        try {
            let convert = {"优": 95, "良": 85, "中": 75, "及格": 65, "不及格": 0}
            let everyYearResult = {}
            let group = getGroup();
            for (let year in group) {
                let yearScoreCredit = 0;
                let yearCredit = 0;
                for (let i = 0; i < group[year].length; i++) {
                    let score = group[year][i].nextElementSibling.innerText;
                    let credit = group[year][i].nextElementSibling.nextElementSibling.innerText;
                    if (credit == "") continue;
                    if (convert.hasOwnProperty(score)) {
                        score = convert[score];
                    }
                    yearScoreCredit += parseFloat(score) * parseFloat(credit);
                    yearCredit += parseFloat(credit);
                }
                totalCredit += yearCredit;
                totalScoreCredit += yearScoreCredit;
                if (yearCredit > 0) {
                    everyYearResult[year] = {
                        "学业基本分": yearScoreCredit / yearCredit,
                        "绩点": yearScoreCredit / yearCredit / 10 - 5
                    };
                }
            }
            return everyYearResult;
        } catch (error) {
            console.log('calculate1:' + error.message);
        }
    }

    function outPut() {
        one_year *= -1;
        if (up_div != null) {
            document.body.removeChild(up_div);
        }
        try {
            let div = document.createElement("div");
            document.body.appendChild(div);
            up_div = div;
            div.style.position = "fixed";
            div.style.right = "25px";
            div.style.top = "300px";
            div.style.backgroundColor = "rgba(255,255,255,0.8)";
            div.style.padding = "10px";
            div.style.border = "1px solid #ccc";
            div.style.borderRadius = "5px";

            let everyYearResult = calculate1();
            for (let year in everyYearResult) {
                div.innerHTML += "<div>学年:" + year + "</div>";
                div.innerHTML += "<div>学业基本分:" + everyYearResult[year]["学业基本分"].toFixed(4) + "</div>";
                div.innerHTML += "<div>绩点:" + everyYearResult[year]["绩点"].toFixed(4) + "</div><hr>";
            }
            if(one_year === 1){
                const cur = JSON.stringify(everyYearResult);
                if(localStorage.pre && localStorage.pre != cur){
                    div.innerHTML += "<div style='color:green'>new</div>";
                }
                localStorage.pre = cur;
            }
            button.innerText =
                "\u00a0".repeat(11) + "学分" + totalCredit.toFixed(2) + "\n"
                + "学业基本分" + (totalScoreCredit / totalCredit).toFixed(2) + "\n"
                + "\u00a0".repeat(11) + "绩点" + (((totalScoreCredit / totalCredit) - 50) / 10).toFixed(2);
        } catch (error) {
            console.log('output:' + error.message);
        }
    }

    function removeAllWindows() {
        // 移除生成的所有窗口
        if (up_div) {
            up_div.remove()
            up_div = null;
        }
        if (button) {
            button.remove()
            button = null;
        }
        if (closeButton) {
            closeButton.remove()
        }
    }
})();
