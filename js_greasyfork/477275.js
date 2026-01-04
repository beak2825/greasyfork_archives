// ==UserScript==
// @name         TornReviveChance
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show your own revive chance in hospital
// @author       Resh
// @match        https://www.torn.com/hospitalview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/477275/TornReviveChance.user.js
// @updateURL https://update.greasyfork.org/scripts/477275/TornReviveChance.meta.js
// ==/UserScript==

// Step 1:
// Generate API Key using this link:
// https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=Revive%20Chance&user=revivesfull,timestamp,basic

// Step 2:
// paste API Key below inside the ''
const API_KEY = '';

// Step 3 (optional):
// Set the minimum value for colors. By default, the number will be green when chance>70, orange on 40-70 and red when <40
// If you instead want only green and red, simply set both GREEN_MIN and ORANGE_MIN values to the same value.
const GREEN_MIN = 70;
const ORANGE_MIN = 40;

// Step 4 (optional):
// Change this value from false to true if you want to also see the minimum revive chance, from a skill 1 reviver
const SHOW_MINIMUM = false;

function displayError(error) {
    console.log(error);
    $('#reviveChanceDisplay').html("API ERROR").css('color', 'red');
}

function displayReviveChances(data) {
    let truePenalty = calculatePenalty(data);
    let revChanceMax = 100 - truePenalty/2;
    if (revChanceMax < 1) {
        revChanceMax = 1;
    }
    $('#revChanceMax').html(revChanceMax.toFixed(2)+'%');

    if (revChanceMax >= GREEN_MIN) {
        $('#revChanceMax').css('color', 'var(--revive-availability-btn-everyone-green)');
    } else if (revChanceMax >= ORANGE_MIN) {
        $('#revChanceMax').css('color', 'var(--revive-availability-btn-everyone-orange)');
    } else {
        $('#revChanceMax').css('color', 'var(--revive-availability-btn-everyone-red)');
    }

    if (SHOW_MINIMUM) {
        let revChanceMin = 90 - truePenalty;
        if (revChanceMin < 1) {
            revChanceMin = 1;
        }
        $('#revChanceMin').html(revChanceMin.toFixed()+"%");
    }
}

function calculatePenalty(data) {
    const UNIX_DAY = 86400;
    const REV_PENALTY = 8;
    let currentPenalty = 0;

    let currentTs = data["timestamp"];
    let playerId = data["player_id"];

    for (const [key, singleRevive] of Object.entries(data["revives"])) {
        // only count incoming revives, not outgoing!
        if (singleRevive["target_id"] == playerId && singleRevive["result"] == "success") {
            let timeDif = currentTs - singleRevive["timestamp"];
            if (timeDif < UNIX_DAY) {
                currentPenalty += (1 - (timeDif/UNIX_DAY))*REV_PENALTY;
            }
        }
    }

    return currentPenalty;
}


(function() {
    'use strict';

    // Your code here...
    if ($('div.content-title > h4').size() > 0 && $('#reviveChanceDisplay').size() < 1) {
        const revDisplay = `<span id="reviveChanceDisplay" style="font-size: 20px;">
            <span id="revChanceMax" style="font-weight: bold">-</span>
        </span>`;
        $('div.content-title > h4').append(revDisplay);

        if (SHOW_MINIMUM) {
            const revDisplayMin = `<span style="font-size: 15px; font-weight: 400;">
                (min: <span id="revChanceMin">-</span>)
            </span>`;
            $('#reviveChanceDisplay').append(revDisplayMin);
        }

        fetch("https://api.torn.com/user/?selections=revivesfull,timestamp,basic&key="+API_KEY+"&comment=RevChance")
        .then(response => {
            // indicates whether the response is successful (status code 200-299) or not
            if (!response.ok) {
                throw new Error(`Response Status: ${reponse.status}`);
            }
            return response.json();
        })
        .then(data => {
            if("error" in data) {
                displayError(data.error.error);
            } else {
                displayReviveChances(data);
            }
        })
        .catch(error => displayError(error))
    }
})();