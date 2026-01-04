// ==UserScript==
// @name         Moodle AutoBRS
// @namespace    https://t.me/johannmosin
// @version      0.1
// @description  Автоматически отмечает посещаемость в БРС.
// @author       Johann Mosin
// @match        https://www.cs.vsu.ru/brs/att_marks_report_student/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528112/Moodle%20AutoBRS.user.js
// @updateURL https://update.greasyfork.org/scripts/528112/Moodle%20AutoBRS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClickButton() {
        const button = document.getElementById('modalCurrentLessonForMarkButtonOK');
        if (button) {
            button.click();
            clearInterval(intervalId);
        }
    }

    const intervalId = setInterval(checkAndClickButton, 1000);

    setTimeout(() => {
        if (!document.getElementById('modalCurrentLessonForMarkButtonOK')) {
            location.reload();
        }
    }, 10000);
})();