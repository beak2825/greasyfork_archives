// ==UserScript==
// @name         Duoc horario enfocar día
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Enfocar día en el horario de duoc
// @author       IgnaV
// @license      MIT
// @match        https://experienciavivo.duoc.cl/alumnos/horarios
// @icon         https://www.duoc.cl/wp-content/uploads/2020/03/favicon.ico
// @grant        none
// @require      https://greasyfork.org/scripts/467272-awaitfor/code/awaitFor.js?version=1201552
// @downloadURL https://update.greasyfork.org/scripts/468144/Duoc%20horario%20enfocar%20d%C3%ADa.user.js
// @updateURL https://update.greasyfork.org/scripts/468144/Duoc%20horario%20enfocar%20d%C3%ADa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const date = new Date();
    const dayNumber = date.getDay();
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayName = dayNames[dayNumber];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const todayMinutes = hours * 60 + minutes;

    awaitFor(
        () => [...document.querySelectorAll('.widget-definition .tit_widget, .widget-definition .accordion_default_cont div')].find(
            (dayClassSchedule) => dayClassSchedule.textContent.includes(dayName) && dayClassSchedule.offsetParent
        ),
        (dayClassSchedule) => {
            let currentClass = null;
            let nextClass = null;
            [...dayClassSchedule.parentElement.querySelectorAll('table > tbody > tr > td:first-child > p')].forEach(classSchedule => {
                const [start, end] = classSchedule.textContent.split(' - ').map(hour => hour.split(":").map(Number));
                const startMinutes = start[0] * 60 + start[1];
                const endMinutes = end[0] * 60 + end[1];
                if (!currentClass && startMinutes <= todayMinutes && endMinutes >= todayMinutes) {
                    currentClass = classSchedule;
                } else if (startMinutes > todayMinutes) {
                    if (!nextClass || startMinutes < nextClass.startMinutes) {
                        nextClass = {
                            element: classSchedule,
                            startMinutes: startMinutes
                        };
                    }
                }
            });
            if (currentClass) {
                currentClass.style.backgroundColor = '#B0DBC9';
            }
            if (nextClass) {
                nextClass.element.style.backgroundColor = '#A3A8C9';
            }

            dayClassSchedule.click();
            dayClassSchedule.focus();
            dayClassSchedule.scrollIntoView({ block: 'start' });
            window.scrollBy(0, -95);
        }
    );
})();