// ==UserScript==
// @name         ELN评价
// @namespace    http://tampermonkey.net/
// @version      2024-11-06
// @description  ELN自动评价
// @author       Damao
// @match        https://v4.21tb.com/els/html/studyCourse/studyCourse.enterCourse.do*
// @icon         http://10.2.71.24/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516004/ELN%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/516004/ELN%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".cs-eval-score input[value='5']").dispatchEvent(new MouseEvent("mouseover"));
    document.querySelector(".cs-eval-score input[value='5']").dispatchEvent(new MouseEvent("click"));
    document.querySelectorAll(".cs-item-single .cs-test-option:nth-of-type(1)").forEach(item => item.dispatchEvent(new MouseEvent("click")));
    document.querySelector(".cs-test-list .cs-question-item:nth-of-type(2) textarea").value = "无";
    document.querySelector(".cs-test-list .cs-question-item:nth-of-type(3) textarea").value = "无";
    document.querySelector(".cs-test-list .cs-question-item:nth-of-type(4) textarea").value = "希望继续参加";
    setTimeout(() => {
        document.querySelector(".cs-question-item").scrollIntoView({behavior: "smooth"});
    }, 2000);
})();