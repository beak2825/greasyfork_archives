// ==UserScript==
// @name         Show me the day
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the three-letter day (instead of the confusing one-letter day) on UW-Madison's course enroll page
// @author       NFSP
// @match        https://enroll.wisc.edu/*
// @icon         https://enroll.wisc.edu/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447185/Show%20me%20the%20day.user.js
// @updateURL https://update.greasyfork.org/scripts/447185/Show%20me%20the%20day.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.body;
    const config = {attributes: false, childList: true, subtree: true};
    const validLetter = new Set(['M', 'T', 'W', 'R', 'F', 'S', 'U']);

    const needModify = (t) => {
        if (t.toUpperCase() !== t) {
            return false;
        }
        if (t.length === 0) {
            return false;
        }
        for (let i=0; i<t.length; ++i) {
            if (!validLetter.has(t[i])) {
                return false;
            }
        }
        return true;
    }

    const expand = (d) => {
        if (d === "M") return "Mon";
        if (d === "T") return "Tue";
        if (d === "W") return "Wed";
        if (d === "R") return "Thu";
        if (d === "F") return "Fri";
        if (d === "S") return "Sat";
        if (d === "U") return "Sun";
        return d;
    }

    const process = (dayText) => {
        const newdays = Array.from(dayText).map(expand);
        return newdays.join("/");
    }

    const observer = new MutationObserver(function(mutations) {
        // "my courses" page
        const days = document.querySelectorAll(".days");
        days.forEach(day => {
            const text = day.innerText;
            if (needModify(text)) {
                day.innerText = process(text);
            }
        });

        // "course search" page
        const dayTimes = document.querySelectorAll(".days-times");
        dayTimes.forEach(dt => {
            const text = dt.innerText;
            const textlist = text.split(" ");
            if (needModify(textlist[0])) {
                const newdays = process(textlist[0]);
                textlist.splice(0,1);
                dt.innerText = newdays + " " + textlist.join(" ");
            }
        });
    });

    observer.observe(body, config);

})();