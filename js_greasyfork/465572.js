// ==UserScript==
// @name         评教小助手
// @namespace    http://jxglstu.hfut.edu.cn/
// @version      1.0
// @description  HFUT评教小助手
// @match        http://jxglstu.hfut.edu.cn/eams5-student/for-std/lesson-survey/start-survey/*
// @grant        none
// @author       himonoinu
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/465572/%E8%AF%84%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465572/%E8%AF%84%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    const radios = document.querySelectorAll('.group');
    radios.forEach((radio) => {
        radio.firstChild.firstChild.firstChild.checked = true;
    });
    document.getElementById("save-button").click();
})();
