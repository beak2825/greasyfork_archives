// ==UserScript==
// @name        torn-attack-hospital-timer
// @namespace   typhon.torn.attack-hospital
// @version     1.5.2
// @description Display hospital timer on the attack page
// @author      rantMore [3265877]
// @license     GNU GPLv3
// @run-at      document-end
// @license     MIT
// @grant       GM_log
// @grant       GM_addStyle
// @match       https://www.torn.com/loader.php?sid=attack*
// @downloadURL https://update.greasyfork.org/scripts/524356/torn-attack-hospital-timer.user.js
// @updateURL https://update.greasyfork.org/scripts/524356/torn-attack-hospital-timer.meta.js
// ==/UserScript==

const TAHT_VERSION = '1.5.2';
const apiKey = "YOUR_API_HERE";
const divContainer = '.dialog___Q0GdI';

let singleton = document.getElementById("taht-scouter-run-once");
if (!singleton) {
  console.log(`[Torn Attack Hospital Timer] Version ${TAHT_VERSION} starting`);
  GM_addStyle(`
     .timer-indicator {
        padding: 10px 10px;
        background-color: #000000;
        font-weight: 700;
        font-size: 1.2rem;
        text-align: center;
        color: var(--attack-dialog-red-title)
     }`)
}

function generateInformation(outTime, hospital_timestamp) {
    // Show green under 1 minute
    const seconds = Math.floor((outTime - Date.now()) / 1000);
    return `
    <div>&nbsp;</div>
    <div>Coming out at ${outTime.toLocaleTimeString('en-US')} in</div>
    <div class="timer-indicator"><span style="${seconds < 120 ? 'color: #98FB98' : ''}">${getTimeLeft(hospital_timestamp)}</span></div>
    `;
}

function getTimeLeft(hospital_timestamp) {
    let outTime = new Date(0);
    outTime.setUTCSeconds(hospital_timestamp);
    const seconds = Math.floor((outTime - Date.now()) / 1000);
    if (seconds >= 60) {
        const secondsFormated = Math.floor(seconds % 60).toString().padStart(2, '0');
        return seconds < 3600 ? `${Math.floor(seconds/60)}:${secondsFormated}` : `${Math.floor(seconds / 3600)}h${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}`;
    } else {
        return `${seconds}s`;
    }
}

(function hospital_time() {
    'use strict';

    const initialTitle = document.title;
    const userid = location.href.replace(/.*?user2ID=(\d+)/i, "$1");
    fetch(`https://api.torn.com/user/${userid}?selections=profile&key=${apiKey}&comment=attack_stats`).then( async response => {
        let user = (await response.json())||{};
        if (user.status.state.toLowerCase() === 'hospital') {
            let alertWrapper = document.createElement("div")
            alertWrapper.setAttribute("class", "userName___loAWK bold");

            let outTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
            outTime.setUTCSeconds(user.states.hospital_timestamp);

            // Don't do anything if we are right on the ending of the hospital timer
            let msToWait = outTime - Date.now();

            // Prepare div content
            alertWrapper.innerHTML = generateInformation(outTime, user.states.hospital_timestamp);
            document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;

            // Sometimes the element is not yet present, let's wait for it
            let outerBox = document.querySelector(divContainer);
            let timerPtr;
            let tempBox;
            let tempDiv;
            new Promise( (resolve, reject) => {
                if (!outerBox) {
                    // Lets grab the top div to add the time info insde. If it fails, then too bad for the tentative
                    tempBox = document.querySelector('.colored___sN72G');
                    if (tempBox) {
                        tempDiv = tempBox.appendChild(alertWrapper);
                    }
                    let waitPtr = setInterval( () => {
                        document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;
                        outerBox = document.querySelector(divContainer);
                        if (outerBox) {
                            resolve(true)
                            clearInterval(waitPtr);
                        }
                    }, 250)
                    } else {
                        resolve(true)
                    }
            }).then( () => {
                // Good to go!
                if (tempDiv) {
                    // lets get rid of this extra div
                    tempDiv.remove()
                }
                outerBox.appendChild(alertWrapper);

                // Redraw content every second
                timerPtr = setInterval( () => {
                    alertWrapper.innerHTML = generateInformation(outTime, user.states.hospital_timestamp);
                    document.title = `${getTimeLeft(user.states.hospital_timestamp)} | ${user.name}`;
                }, 1000)
            })

            // Set a new timer to trigger when we are done waiting
            // Set a new timer to trigger when we are done waiting
            setTimeout( () => {
                // Stop everything, we are done.
                document.title = initialTitle;
                clearInterval(timerPtr);
            }, msToWait);
        }
    });
})();