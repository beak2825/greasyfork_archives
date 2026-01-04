// ==UserScript==
// @name         Moodle AutoAttendance
// @namespace    https://t.me/johannmosin
// @version      1.0.0
// @description  Автоматически отмечает посещяемость в одноимённом элементе Moodle.
// @author       Johann Mosin
// @match        https://edu.vsu.ru/mod/attendance/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460012/Moodle%20AutoAttendance.user.js
// @updateURL https://update.greasyfork.org/scripts/460012/Moodle%20AutoAttendance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intervalId = setInterval(function() {
        var submitButton = document.querySelector('input[type="submit"][value="Сохранить"].btn.btn-primary');

        if (submitButton) {
            var radioInput = document.querySelector('input[type="radio"].form-check-input[name="status"]');
            if (radioInput) {
                radioInput.click();
                submitButton.click();
                clearInterval(intervalId);
            }
        } else {
            var attendanceTd = Array.from(document.querySelectorAll('td')).find(td => td.textContent.includes("Отметить свое присутствие"));

            if (attendanceTd) {
                var attendanceLink = attendanceTd.querySelector('a');
                if (attendanceLink) {
                    window.location.href = attendanceLink.href;
                    clearInterval(intervalId);
                }
            } else {
                setTimeout(() => {
                    location.reload();
                }, 10000);
            }
        }
    }, 1000);
})();