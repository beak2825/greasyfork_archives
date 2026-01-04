// ==UserScript==
// @name         Plex Time to finish
// @namespace    https://kyleschwartz.ca
// @version      1.0.1
// @description  Adds an "Ends at X:XX" to Plex.
// @author       Kyle Schwartz
// @match        https://notato.xyz/plex/*
// @match        https://app.plex.tv/*
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require      https://unpkg.com/dayjs@1.10.5/plugin/utc.js
// @downloadURL https://update.greasyfork.org/scripts/428840/Plex%20Time%20to%20finish.user.js
// @updateURL https://update.greasyfork.org/scripts/428840/Plex%20Time%20to%20finish.meta.js
// ==/UserScript==

/* globals dayjs */
/* jshint esversion: 6 */

(function() {
    'use strict';

    dayjs.extend(window.dayjs_plugin_utc);

    setInterval(()=> {
        try {
            const duration = document.querySelector("[data-qa-id='mediaDuration']");
            if (!document.querySelector("#ttf")) {
                const ttf = document.createElement("span");
                ttf.id = "ttf";
                ttf.style.color = "rgba(232, 230, 227, 0.45)";
                duration.parentNode.insertBefore(ttf, duration.nextSibling);
            }
            updateTime(duration);
        } catch (e) {}
    }, 1000);

    const updateTime = (duration) => {
        const times = [...duration.innerHTML.matchAll(/\-?\d+(?:\:\d+)+/g)];
        const newTimes = times.map(e => e[0].padStart(8,'0')).map(e => `${e.slice(0,2)}:${e.slice(3,5)}:${e.slice(6,8)}`);
        const diff = times[0][0].charAt(0) !== "-" ? dayjs('2018-04-04T' + newTimes[1]) - dayjs('2018-04-04T' + newTimes[0]) : dayjs('2018-04-04T' + newTimes[0]) - dayjs('2018-04-04T00:00:00');
        const endTime = dayjs().add(diff, "ms").local().format('h:mm a');
        document.querySelector("#ttf").innerHTML = `Ends at ${endTime}`;
    };
})();