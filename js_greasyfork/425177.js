// ==UserScript==
// @name         MILESplus AutoFiller
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Save me the hussle of logging work hours by hand every week
// @author       Ilya Molchanov
// @match        https://websso.t-systems.com/milesplus/prod/plsql/*
// @icon         https://simpleicons.org/icons/t-mobile.svg
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425177/MILESplus%20AutoFiller.user.js
// @updateURL https://update.greasyfork.org/scripts/425177/MILESplus%20AutoFiller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const onAutoFillWorkingHours = function() {
        const AT_WORK = '08:00';
        const AT_HOME = '16:00';
        const WORK_HOURS = '08:00'

        const inputTime = function(el, value) {
            if (el.value !== value) {
                el.style.color = 'blue';
                el.value = value;
                el.dispatchEvent(new Event('change'));
            }
        };

        document.querySelectorAll('input[name="i_kommt"]:not([class="weekend"]):not([class="holyday"])')
            .forEach((el) => { inputTime(el, AT_WORK); });
        document.querySelectorAll('input[name="i_geht"]:not([class="weekend"]):not([class="holyday"])')
            .forEach((el) => { inputTime(el, AT_HOME); });

        let workHours = document.querySelectorAll("input[name='i_az']");
        let prevTabIndex = null;
        for(let i = 0; i < workHours.length; i++) {
            let el = workHours[i];
            if (el.className === 'weekend') {
                break;
            }
            else if (el.className === 'holyday') {
                continue;
            }
            if (prevTabIndex === null) {
                prevTabIndex = parseInt(el.getAttribute('tabIndex'));
            }
            else if (parseInt(el.getAttribute('tabIndex')) === prevTabIndex + 2) {
                break;
            }
            inputTime(el, WORK_HOURS);
        }
    };

    const fixSelectWidth = function() {
        document.querySelectorAll('select').forEach((el) => { el.style.width = '15em'; });
    }

    const insertAutoFillWorkingHoursButton = function() {
        let el = document.createElement('input');
        el.type = 'button';
        el.className = 'tc_submit';
        el.value = 'Auto-Fill Working Hours';
        el.style.width = '15em';
        el.style.color = 'white';
        el.style.backgroundColor = '#E20074';
        el.addEventListener('click', onAutoFillWorkingHours);
        document.querySelectorAll('h2')[0].insertAdjacentElement('afterend', el);
    };

    if (window.location.href.indexOf('pweektime_gc') != -1) {
        fixSelectWidth();
        insertAutoFillWorkingHoursButton();
    }
})();