// ==UserScript==
// @name         RW Decay Timer
// @version      1.2.3
// @namespace    mrbob.torn.com
// @description  Shows when the RW will time out due to decay
// @author       Mr_bob [479620]
// @match        https://www.torn.com/factions.php*
// @icon         https://imgur.com/ZEG0Rlz.png
// @downloadURL https://update.greasyfork.org/scripts/499935/RW%20Decay%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/499935/RW%20Decay%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set variables
    let deltaTime = 12; // Set hours before Tuesday noon when it should alert for a late timeout, default Tuesday 10AM
    let debugMode = false; // Set to true to enable debug mode
    let loserratio = 0.35; // Set percentage of the winner SCORE the loser needs to target

    var target;
    var score;
    var lead;
    var decay;
    var duration;
    var timeout;
    var startTarget;
    var timeToDecay;
    let customText = '';
    let showLocalTime = true;

    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Function to add text to the rank box
    function addTextToRankBox(rankBox) {
        var titleBlock = rankBox.querySelector('div[class*="titleBlock"]');
        var rankBoxText = rankBox.textContent;
        var newTextDiv = rankBox.querySelector('.customTextDiv');
        var toggleButton = rankBox.querySelector('.toggleButton');

        if (debugMode) console.log("addTextToRankBox called");

        // Initialize new div to put the text in
        if (!newTextDiv) {
            newTextDiv = document.createElement('div');
            newTextDiv.classList.add('customTextDiv');
            newTextDiv.style.color = 'green';
        }

        // Initialize toggle button
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.classList.add('toggleButton');
            toggleButton.textContent = 'Show TCT';
            toggleButton.style.display = 'block';
            toggleButton.style.marginTop = '10px';
            toggleButton.onclick = function () {
                showLocalTime = !showLocalTime;
                toggleButton.textContent = showLocalTime ? 'Show TCT' : 'Show Local Time';
                addTextToRankBox(rankBox); // Update the text with the new time format
            };
        }

        // Check if the war has been won by checking for WINNER and LOSER
        if (rankBoxText.includes('WINNER') && rankBoxText.includes('LOSER')) {
            customText = 'War is over';
            if (debugMode) console.log("War is over");
        } else {
            // Get score and target
            var targetSpan = rankBox.querySelector('span[class*="target"]');
            if (targetSpan) {
                let targetSpanText = targetSpan.textContent.trim();
                let scores = targetSpanText.match(/\d+(?:,\d+)*|\d+/g).map(value => parseInt(value.replace(/,/g, '')));
                lead = scores[0];
                target = scores[1];
                if (debugMode) console.log(`Lead: ${lead}, Target: ${target}`);
            }

            // Get duration/timetillstart of the war
            var timerSpan = rankBox.querySelector('span[class*="timer"]');
            if (timerSpan) {
                const spanText = timerSpan.textContent;
                const text_duration = spanText.replace(/[^\d:]/g, '');
                var [days, hours, minutes, seconds] = text_duration.split(':').map(part => parseInt(part));
                duration = days * 24 + hours;
                const totalMilliseconds = ((days * 24 * 60 + hours * 60 + minutes) * 60 + seconds) * 1000;
                if (debugMode) console.log(`Duration: ${duration} hours`);

                // Calculate Decay
                if (lead == 0) {
                    if (debugMode) console.log(`War is not started`);
                    decay = target / 100;
                } else {
                if (duration < 24) {
                    if (debugMode) console.log(`War has started, not yet decaying`);
                        decay = target * 0.01;
                        timeToDecay = 24 - duration;
                    } else {
                        if (debugMode) console.log(`War has started, and target decaying`);
                        decay = target / (100 - (duration + 1 - 24));
                        timeToDecay = 0;
                    }
                }
                if (debugMode) console.log(`Decay: ${decay}`);

                // Calculate next Tuesday's data
                const now = new Date();
                let nextTuesday = new Date(now);

                const daysUntilNextTuesday = (9 - now.getUTCDay()) % 7;
                nextTuesday.setUTCDate(now.getUTCDate() + (daysUntilNextTuesday === 0 ? 7 : daysUntilNextTuesday));


                //nextTuesday.setUTCDate(now.getUTCDate() + (2 + 7 - now.getUTCDay()) % 7);
                nextTuesday.setUTCHours(12, 0, 0, 0); // Tuesday 12:00 UTC
                nextTuesday.setUTCHours(nextTuesday.getUTCHours() - deltaTime);
                const nextTuesdayFormatted = `${daysOfWeek[nextTuesday.getUTCDay()]}, ${nextTuesday.getUTCHours()}:${nextTuesday.getUTCMinutes().toString().padStart(2, '0')}`;

                const formatToLocalTime = (date) => {
                        return `${daysOfWeek[date.getDay()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} local time`;
                    };

                const formatToTCT = (date) => {
                    return `${daysOfWeek[date.getUTCDay()]}, ${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')} TCT`;
                };

                const formatDate = (date) => {
                    return showLocalTime ? formatToLocalTime(date) : formatToTCT(date);
                };

                if (lead == 0) { // War is yet to start
                    let warStart = roundToHour(new Date(now.getTime() + totalMilliseconds));
                    let decayStart = new Date(warStart.getTime() + 24 * 60 * 60 * 1000);

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
                        toggleButton.style.marginTop = '0px';
                        inactiveLi.appendChild(toggleButton);
                    }

                    const startTime = `${daysOfWeek[decayStart.getUTCDay()]}, ${decayStart.getUTCHours()}:${decayStart.getUTCMinutes().toString().padStart(2, '0')}`;

                    const timeOut = Math.floor((nextTuesday - decayStart) / 1000 / 60 / 60) + 2;
                    const leadToWin = target - timeOut * decay;
                    const targetWinner = Math.max(0,Math.ceil(leadToWin / (1- loserratio))); //Math.max(5000,Math.ceil(leadToWin / (1- loserratio)));
                    const targetLoser = Math.ceil(targetWinner * loserratio);

                    customText = `To timeout ${nextTuesdayFormatted} TCT: <br> Winner Target: ${targetWinner}  - ${targetLoser}: Loser Target`;

                    if (debugMode) {
                        console.log(`War Start: ${warStart}`);
                        console.log(`Decay Start: ${decayStart}`);
                        console.log(`Next Tuesday: ${nextTuesday}`);
                        console.log(`---------`);
                        console.log(`Target: ${target}`);
                        console.log(`Decay: ${decay}`);
                        console.log(`Time Out: ${timeOut} hours`);
                        console.log(`Lead to win: ${leadToWin}`);
                        console.log(`---------`);
                        console.log(`Target Winner: ${targetWinner}, Target Loser: ${targetLoser}`);
                    }

                } else { // War has started
                    // TODO always show target scores
                    const timeout = Math.ceil((target - lead) / decay) + timeToDecay;
                    // const leadToWin = target - timeout * decay;
                    // const targetWinner = Math.max(5000,Math.ceil(leadToWin / (1- loserratio)));
                    // const targetLoser = Math.ceil(targetWinner * loserratio);

                    const now = new Date();
                    var timedOut = new Date(now.getTime() + timeout * 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000);

                    const formattedResult = `${daysOfWeek[timedOut.getUTCDay()]}, ${timedOut.getUTCHours()}:${timedOut.getUTCMinutes().toString().padStart(2, '0')} TCT`;
                    if (debugMode) {
                        console.log(`timedOut: ${timedOut}`);

                        console.log(`timeout: ${timeout}`);
                        console.log(`timedOut day: ${timedOut.getDay()}`);
                        console.log(`timedOut hours: ${timedOut.getUTCHours()}`);
                    }
                    // If timeout time is after Tuesday noon, text red, else text green.
                    if (timedOut.getDay() > 2 || (timedOut.getDay() === 2 && timedOut.getUTCHours() > (12-deltaTime))) {
                        var timeoutMismatch = timedOut.getUTCHours() - nextTuesday.getUTCHours()
                        var needScore = target - (timeout - timeoutMismatch) * decay - lead

                        // TODO calculate extra score needed to be made
                        if (newTextDiv) newTextDiv.style.color = 'red';

                        // Calculate target at Tueswday noon - deltaTime
                        // var needScore = timeoutMismatch * decay

                     if (debugMode) {
                        console.log(`needScore: ${needScore}`);
                        console.log(`timeoutMismatch: ${timeoutMismatch}`);
                    }
                        customText = `LATE TIMEOUT ${formattedResult} <br>Need ${needScore} more points.`;
                        // '<br> Timing out ${formattedResult}: <br> Winner Target: ${targetWinner}  - ${targetLoser}: Loser Target`
                    } else {
                        if (newTextDiv) newTextDiv.style.color = 'green';
                        customText = `Timing out ${formattedResult}`;
                        // '<br> Timing out ${formattedResult}: <br> Winner Target: ${targetWinner}  - ${targetLoser}: Loser Target`
                    }
                }
            }
        }
        // Set text
        newTextDiv.innerHTML = `<div style="padding-left: 10px; padding-top: 5px; padding-bottom: 5px;">
                                   ${customText}
                                </div>`;

        if (titleBlock) {
            if (!titleBlock.nextSibling?.isEqualNode(newTextDiv)) {
                // Insert the new div after the titleBlock
                titleBlock.insertAdjacentElement('afterend', newTextDiv);
                // Expand warListItem to avoid overflow
                var warListItem = rankBox.closest('.warListItem___eE_Ve');
                if (warListItem) {
                    warListItem.style.height = 'auto';
                }
            }
        }
    }

    // Every time score or target changes, update
    function observeTargetSpans() {
        var rankBoxes = document.querySelectorAll('div[class*="rankBox"]');
        rankBoxes.forEach(rankBox => {
            var targetSpan = rankBox.querySelector('span[class*="target"]');
            if (targetSpan) {
                addTextToRankBox(rankBox);
                var observer = new MutationObserver(() => {
                    addTextToRankBox(rankBox);
                });
                observer.observe(targetSpan, { childList: true, subtree: true, characterData: true });
            }
        });
    }

    // Initial delay to let page load in
    setTimeout(observeTargetSpans, 500);
})();

function roundToHour(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
    return date;
}
