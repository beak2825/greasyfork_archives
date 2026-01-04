// ==UserScript==
// @name         Torn - Big Chain Timer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes chain timer bigger and sets hit count red when close to milestone
// @author       ChuckFlorist [3135868]
// @match        https://www.torn.com/factions.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527556/Torn%20-%20Big%20Chain%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/527556/Torn%20-%20Big%20Chain%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const chainUrls = [
        "https://www.torn.com/factions.php?step=your&type=1#/",
        "https://www.torn.com/factions.php?step=your&type=1#/war/chain"
    ];
    const SPAN_TOP = "span.chain-box-top-stat";
    const SPAN_COUNT = "span.chain-box-center-stat";
    const SPAN_TIME = "span.chain-box-timeleft";
    const HITS_WARNING = 20; // hits before milestone

    const ranges = [
        { start: "04:00", end: "05:00", color: "#00FF00" }, // Lime
        { start: "03:00", end: "04:00", color: "#FFFF00" }, // Yellow
        { start: "02:00", end: "03:00", color: "#FF9900" }, // Orange
        { start: "00:00", end: "02:00", color: "#FF0000" } // Red
    ];

    const bonusHits = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

    function toSeconds(time) {
        const [mins, secs] = time.split(":").map(Number);
        return mins * 60 + secs;
    }

    function timeBasedColour(time) {
        const totalSecs = toSeconds(time);

        for (let range of ranges) {
            const min = toSeconds(range.start);
            const max = toSeconds(range.end);
            if (totalSecs >= min && totalSecs < max) {
                return range.color;
            }
        }
        return "#FF0000"; // default to red
    }

    function updateHitCount(cntSpan) {
        if (cntSpan){
            let nHits = Number(cntSpan.textContent.replace(/,/g, ''));
            let isClose = bonusHits.some(bh => (nHits >= bh - HITS_WARNING && nHits < bh));
            let colr = isClose ? 'red' : '#798C3D'; // red or normal torn green color
            cntSpan.style.setProperty('color', colr, 'important');
            cntSpan.style.setProperty('font-size', '20px', 'important');
        }
    }

    function updateTimer(tmrSpan) {
        if (tmrSpan) {
            let color = timeBasedColour(tmrSpan.textContent);
            tmrSpan.style.setProperty('font-size', '40px', 'important');
            tmrSpan.style.setProperty('color', color, 'important');
        }
    }

    function removeControl(target) {
        if (target) {
            target.remove();
        }
    }

    function runScript() {
        try {
            if (chainUrls.includes(window.location.href)) {
				var tmrSpan = document.querySelectorAll(SPAN_TIME)[0];
				if (toSeconds(tmrSpan.textContent) < 300)
				{
					removeControl(document.querySelectorAll(SPAN_TOP)[0]);
					updateTimer(document.querySelectorAll(SPAN_TIME)[0]);
					updateHitCount(document.querySelectorAll(SPAN_COUNT)[0]);
				}
            }
        } catch (ex) {
            alert(ex.message);
        }
    }

    setInterval(runScript, 500);
})();
