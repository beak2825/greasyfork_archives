// ==UserScript==
// @name         MattScript
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Test Script
// @author       Mattmode
// @match        https://idle-pixel.com/login/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455259/MattScript.user.js
// @updateURL https://update.greasyfork.org/scripts/455259/MattScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MattScriptPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("varviewer", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            const username = $("item-display[data-key=username]").text();

            function getNextUTCTimeDifference(targetTimes) {
                // Get the current date and time in UTC
                const now = new Date();
                const utcNow = new Date(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate(),
                    now.getUTCHours(),
                    now.getUTCMinutes(),
                    now.getUTCSeconds()
                );

                // Create an array of target times in HH:mm format
                const targetTimeStrings = targetTimes.split(', ');

                // Initialize an array to store the next occurrences of target times
                const nextTimes = [];

                // Calculate the next occurrence of each target time
                targetTimeStrings.forEach((targetTimeString) => {
                    // Parse the target time string into hours and minutes
                    let [targetHours, targetMinutes] = targetTimeString.split(':').map(Number);

                    if (username == "smurfmode") {
                        targetMinutes += 30;
                    } else if (username == "cringemode") {
                        targetMinutes += 45;
                    }

                    // Create a new Date object with the same date as now but set the target time in UTC
                    const nextTime = new Date(utcNow);
                    nextTime.setHours(targetHours);
                    nextTime.setMinutes(targetMinutes);
                    nextTime.setSeconds(0);

                    // If the target time is in the past, add one day to it
                    if (nextTime < utcNow) {
                        nextTime.setDate(nextTime.getDate() + 1);
                    }

                    nextTimes.push(nextTime);
                });

                // Find the closest next time
                const closestNextTime = new Date(Math.min(...nextTimes));

                // Calculate the difference in minutes
                const timeDifferenceMinutes = Math.round((closestNextTime - utcNow) / 60000);

                return { closestNextTime, timeDifferenceMinutes };
            }

            // Specify the target times in HH:mm format
            const targetTimes = '00:00, 07:00, 14:00, 21:00';

            const onlineCount = $("item-display.font-small.color-grey")[0];
            let ptag = document.createElement("p");
            ptag.className = 'color-grey font-small'
            ptag.id = 'time-until-relog'
            ptag.style = 'display: inline'

            onlineCount.after(ptag);

            getNextUTCTimeDifference
            setInterval(function() {
                const { closestNextTime, timeDifferenceMinutes } = getNextUTCTimeDifference(targetTimes);
                let relogText = document.getElementById("time-until-relog")

                if (timeDifferenceMinutes <= 15) {
                    relogText.style.backgroundColor = "red";
                    relogText.style.color = "white";
                }
                if (timeDifferenceMinutes <= 1) {
                    location.reload();
                }

                relogText.innerHTML = `&nbsp;&nbsp;&nbsp;${timeDifferenceMinutes}m until relog&nbsp;`;

            }, 1000);
        }

    }

    const plugin = new MattScriptPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();