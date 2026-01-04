// ==UserScript==
// @name         Adds date/time stamps and a new scheduling page to canvas
// @namespace    https://google.com
// @version      2024-10-07
// @description  just check the name
// @author       Max Blennemann (github.com/23maxb)
// @license MIT
// @match        *camino.instructure.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFJEH7ViWu8voM-K5a5aspXQkvpmt7I3Okg&s
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511548/Adds%20datetime%20stamps%20and%20a%20new%20scheduling%20page%20to%20canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/511548/Adds%20datetime%20stamps%20and%20a%20new%20scheduling%20page%20to%20canvas.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const findMe = /\S* ?- ?(M|T|W|Th|F)* ?\d{2}:\d{2} ?([AP])M/g;

    function addTime(timeStr, addHours, addMinutes) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        hours += addHours;
        minutes += addMinutes;
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
        }
        if (hours >= 24) {
            hours = hours % 24;
        }
        const newModifier = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) {
            hours = 12;
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${newModifier}`;
    }

    function addEndTime(str) {
        const len = str.length;
        let endTime;
        if (str.includes('MWF')) {
            endTime = addTime(str.substring(len - 8), 1, 5);
        } else if (str.includes('TTH')) {
            endTime = addTime(str.substring(len - 8), 1, 40);
        } else {
            endTime = addTime(str.substring(len - 8), 2, 45);
        }

        const currentTime = new Date();
        const [startHours, startMinutes, startModifier] = str.substring(len - 8).split(/[: ]/);
        let startHours24 = parseInt(startHours, 10);
        if (startModifier === 'PM' && startHours24 !== 12) {
            startHours24 += 12;
        } else if (startModifier === 'AM' && startHours24 === 12) {
            startHours24 = 0;
        }

        const startDateTime = new Date();
        startDateTime.setHours(startHours24, parseInt(startMinutes, 10), 0, 0);

        const [endHours, endMinutes, endModifier] = endTime.split(/[: ]/);
        let endHours24 = parseInt(endHours, 10);
        if (endModifier === 'PM' && endHours24 !== 12) {
            endHours24 += 12;
        } else if (endModifier === 'AM' && endHours24 === 12) {
            endHours24 = 0;
        }

        const endDateTime = new Date();
        endDateTime.setHours(endHours24, parseInt(endMinutes, 10), 0, 0);

        const daysOfWeek = {
            0: 'U',
            1: 'M',
            2: 'T',
            3: 'W',
            4: 'Th',
            5: 'F',
            6: 'S'
        };
        const today = new Date();
        const todayDay = daysOfWeek[today.getDay()];
        if (!str.includes(todayDay)) {
            return str + ' - ' + endTime;
        }

        let timeMessage = '';
        if (currentTime < startDateTime) {
            const timeDiff = startDateTime - currentTime;
            const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            timeMessage = ` (time until class: ${hoursUntil > 0 ? `${hoursUntil}h ` : ''}${minutesUntil}m)`;
        } else if (currentTime < endDateTime) {
            const timeDiff = endDateTime - currentTime;
            const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            timeMessage = ` (time remaining: ${hoursRemaining > 0 ? `${hoursRemaining}h ` : ''}${minutesRemaining}m)`;
        }

        return str + ' - ' + endTime + timeMessage;
    }

    function replaceTextInElement(element) {
        if (element.hasChildNodes()) {
            element.childNodes.forEach(child => {
                if (child.nodeType === 3) { // Text node
                    const text = child.nodeValue;
                    const newText = text.replace(findMe, match => addEndTime(match));
                    if (newText !== text) {
                        child.nodeValue = newText;
                    }
                }
            });
        }
    }

    const elements = document.body.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        replaceTextInElement(elements[i]);
    }
})();
