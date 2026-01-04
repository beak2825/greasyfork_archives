// ==UserScript==
// @name         AJL Score
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  AtCoderの成績表にAJLのScoreを追加します。
// @author       You
// @match        https://atcoder.jp/users/*/history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480928/AJL%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/480928/AJL%20Score.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.debug("Loading AJL Scores");
    const table = Array.from(document.querySelector("#history").rows);
    const tableTitleElem = document.createElement("th");
    tableTitleElem.style["text-align"] = "center";
    tableTitleElem.textContent = "AJL";
    tableTitleElem.classList.add("sorting");
    tableTitleElem.classList.add("ajl");
    let tableTitleState = 0;
    tableTitleElem.addEventListener("click", () => {
        document.querySelector("th:nth-child(4)").click();
    });
    table[0].insertBefore(tableTitleElem, table[0].childNodes[5]);
    const scores = [];
    table.slice(1).forEach((element) => {
        const perf = Number(element.childNodes[7].textContent);
        const ajlScore = Math.round(Math.pow(2, perf / 400) * 1000);
        const ajlScoreElem = document.createElement("td");
        ajlScoreElem.textContent = ajlScore;
        if(!isNaN(ajlScore)) {
            scores.push(ajlScore);
        }
        const ratingElem = element.childNodes[11];
        element.insertBefore(ajlScoreElem, ratingElem);
    });
    const labelEle = document.createElement("label");
    labelEle.textContent = "AJL Calculator (Please enter the latest number of doses you would like.) ->";
    labelEle.for = "ajl-cal";
    const numEle = document.createElement("input");
    numEle.type = "number";
    numEle.id = "ajl-cal";
    numEle.value = table.slice(1).length;
    const titleEle = document.querySelector("div.col-sm-12:has(h2) #user-nav-tabs");
    titleEle.parentNode.insertBefore(numEle, titleEle);
    numEle.parentNode.insertBefore(labelEle, numEle);

    const ansEle = document.createElement("p");
    titleEle.parentNode.insertBefore(ansEle, titleEle);

    function getScore(count) {
        const src = scores.slice(0, count).sort((a, b) => b - a);
        let sum = 0, cnt = 0;
        for(let i = 0; i < src.length; i++) {
            if(cnt == 10) break;
            if(src[i] == NaN) continue;
            sum += src[i];
            cnt++;
        }
        ansEle.textContent = "AJL Score: " + sum;
    }

    getScore(numEle.value);

    numEle.addEventListener("change", () => getScore(numEle.value));

})();