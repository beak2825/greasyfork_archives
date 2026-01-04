// ==UserScript==
// @name         自动评价
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可指定范围随机总分，自动评价教师各项指标
// @author       oljisfcy
// @match        https://jw.shiep.edu.cn/eams/quality/stdEvaluate!answer.action?*
// @license      AGPL
// @icon         https://shiep.edu.cn/_upload/tpl/00/a7/167/template167/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456983/%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/456983/%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(() => {
    'use strict';
    let scoreRangeText = window.localStorage.getItem("scoreRange");
    var scoreRange;
    if (!scoreRangeText) {
        scoreRange = [90, 95];
    } else {
        scoreRange = scoreRangeText.split(',').map((item)=>parseInt(item));
    }

    const body = document.getElementsByTagName("body")[0];

    const style = document.createElement("style");
    style.innerHTML = ".scoreRange { width: 25px; block: inline; }";
    body.appendChild(style);

    const div = document.createElement("div");
    div.setAttribute("style","background-color: #67a9e4;position: fixed;right: 0;top: 100px;padding: 5px 10px;");
    const button = document.createElement("button");
    button.innerText = "一键评价";
    const min = document.createElement("input");
    const max = document.createElement("input");
    min.setAttribute("value", scoreRange[0]);
    max.setAttribute("value", scoreRange[1]);
    min.setAttribute("id", "min");
    max.setAttribute("id", "max");
    min.setAttribute("maxlength", 3);
    max.setAttribute("maxlength", 3);
    min.classList.add("scoreRange");
    max.classList.add("scoreRange");
    div.innerHTML = `
    <span style="color: white;"> — </span>
    `;
    div.insertBefore(min, div.children[0]);
    div.appendChild(max);
    div.appendChild(document.createElement("br"));
    div.appendChild(button);
    body.appendChild(div);

    min.addEventListener("input", () => {
        let m = document.getElementById("min");
        console.log("min: " + m.value);
        let value = m.value;
        if(!m.value || m.value === ""){
            value = 0;
        };
        scoreRange[0] = parseInt(value);
        console.log("scoreRange: " + scoreRange);
        window.localStorage.setItem("scoreRange", scoreRange);
    })

    max.addEventListener("input", () => {
        let m = document.getElementById("max");
        console.log("max: " + m.value);
        let value = m.value;
        scoreRange[1] = parseInt(value);
        console.log("scoreRange: " + scoreRange);
        window.localStorage.setItem("scoreRange", scoreRange);
    })

    button.addEventListener('click', () => {
        const all = document.getElementsByClassName('star_score');
        const [min, max] = scoreRange;
        const score = randomNum(min, max);
        let avgScore = score / all.length;
        let option = avgScore * (20 / (100/all.length)) - 1;
        let factor = 2;
        for (let item of all) {
            let index = randomNum(option + factor, option - factor);
            index = index > 19 ? 19 : index;
            item.children[index].click();
        }
        console.log("评价完成");
    })

    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
                default:
                    return 0;
                    break;
        }
    }
})();