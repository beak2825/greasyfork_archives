// ==UserScript==
// @name         고려대학교 수상소감 편하게 하기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  자동으로 일단 5점으로 찍어줄게요
// @author       백승주요청
// @match        https://infodepot.korea.ac.kr/course/grade/EvaluateLectureInsertFormUNew.jsp?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @license      mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540489/%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%20%EC%88%98%EC%83%81%EC%86%8C%EA%B0%90%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540489/%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%20%EC%88%98%EC%83%81%EC%86%8C%EA%B0%90%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(1000);

    const allRadioButtons = document.querySelectorAll(`input[type=radio]`);
    const allNames = Array.from(allRadioButtons).map(radio => radio.name);
    const uniqueNames = [...new Set(allNames)];

    uniqueNames.forEach(name => {
        const radioButtons = Array.from(document.querySelectorAll(`input[type=radio][name="${name}"]`));
        const lastRadioButton = radioButtons.at(-1);
        lastRadioButton.checked = true;
    });

    document.querySelectorAll("textarea")
        .forEach(textarea=>textarea.value="없음.");
})();