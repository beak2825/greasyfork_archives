// ==UserScript==
// @name         Xanax Timer
// @version      1.0
// @namespace    mrbob.torn.com
// @description  Shows when you should take your Xanax to get a full stack and no drug CD at the start of the RW, ready to pounce.
// @author       Mr_Bob [479620]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.torn.com/images/items/206/medium.png
// @downloadURL https://update.greasyfork.org/scripts/546542/Xanax%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/546542/Xanax%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let debugMode = false;
    let target, lead, duration;
    let showLocalTime = true;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function addTextToRankBox(rankBox) {
        const titleBlock = rankBox.querySelector('div[class*="titleBlock"]');
        const targetSpan = rankBox.querySelector('span[class*="target"]');
        const timerSpan = rankBox.querySelector('span[class*="timer"]');

        if (debugMode) console.log("addTextToRankBox called");

        if (targetSpan) {
            const scores = targetSpan.textContent.trim().match(/\d+(?:,\d+)*|\d+/g)
                .map(value => parseInt(value.replace(/,/g, '')));
            lead = scores[0];
            target = scores[1];
            if (debugMode) console.log(`Lead: ${lead}, Target: ${target}`);
        }

        if (timerSpan) {
            const spanText = timerSpan.textContent.replace(/[^\d:]/g, '');
            const [days, hours, minutes, seconds] = spanText.split(':').map(part => parseInt(part));
            duration = days * 24 + hours;
            const totalMilliseconds = ((days * 24 * 60 + hours * 60 + minutes) * 60 + seconds) * 1000;

            if (debugMode) console.log(`Duration: ${duration} hours`);

            if (lead === 0) {
                const now = new Date();
                const warStart = roundToHour(new Date(now.getTime() + totalMilliseconds));

                const inactiveLi = document.querySelector('li.inactive');
                if (inactiveLi) {
                    inactiveLi.innerHTML = `
                        <div style="padding: 10px;">
                            Xanax 1: ${formatDate(new Date(warStart.getTime() - 32 * 60 * 60 * 1000))}<br>
                            Xanax 2: ${formatDate(new Date(warStart.getTime() - 24 * 60 * 60 * 1000))}<br>
                            Xanax 3: ${formatDate(new Date(warStart.getTime() - 16 * 60 * 60 * 1000))}<br>
                            Xanax 4: ${formatDate(new Date(warStart.getTime() - 8 * 60 * 60 * 1000))}
                            <hr style="margin-top: 3px; margin-bottom: 3px;">
                            Start Time: ${formatDate(warStart)}
                        </div>`;

                    let toggleButton = inactiveLi.querySelector('.toggleButton');
                    if (!toggleButton) {
                        toggleButton = document.createElement('button');
                        toggleButton.classList.add('toggleButton');
                        toggleButton.style.display = 'block';
                        toggleButton.style.marginTop = '0px';
                        inactiveLi.appendChild(toggleButton);
                    }

                    toggleButton.textContent = showLocalTime ? 'Show TCT' : 'Show Local Time';
                    toggleButton.onclick = function () {
                        showLocalTime = !showLocalTime;
                        toggleButton.textContent = showLocalTime ? 'Show TCT' : 'Show Local Time';
                        addTextToRankBox(rankBox);
                    };

                }
            }
        }

        if (titleBlock) {
            const warListItem = rankBox.closest('.warListItem___eE_Ve');
            if (warListItem) warListItem.style.height = 'auto';
        }
    }

    function observeTargetSpans() {
        const rankBoxes = document.querySelectorAll('div[class*="rankBox"]');
        rankBoxes.forEach(rankBox => addTextToRankBox(rankBox));
    }

    function formatToLocalTime(date) {
        return `${daysOfWeek[date.getDay()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} local time`;
    }
    function formatToTCT(date) {
        return `${daysOfWeek[date.getUTCDay()]}, ${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')} TCT`;
    }
    function formatDate(date) {
        return showLocalTime ? formatToLocalTime(date) : formatToTCT(date);
    }
    function roundToHour(date) {
        date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
        date.setMinutes(0, 0, 0);
        return date;
    }

    setTimeout(observeTargetSpans, 500);
})();
