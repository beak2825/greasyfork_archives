// ==UserScript==
// @name         Melvor Mine Highest
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Automatically mine the highest available ore at all times
// @author       KieranW
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428066/Melvor%20Mine%20Highest.user.js
// @updateURL https://update.greasyfork.org/scripts/428066/Melvor%20Mine%20Highest.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Note that this script is made for MelvorIdle version 0.20

function script() {
    // Loading script
    console.log('Melvor Mine Highest Loaded');

    let highestRock = findHighestRock();
    const mineRockOrginal = window.mineRock;

    function findHighestRock() {
        for (let i = window.rockData.length; i >= 0; i--) {
            // Ignore 10 as it's rune essence.
            // If it has d-none then you do not have the necessary skill to mine the rock
            if (i !== 10 && $(`#mining-ore-${i}:not(.d-none)`).length) {
                return i;
            }
        }
    }

    function findBestAvailable() {
        for (let i = highestRock; i > 0; i--) {
            // Ignore 10 as it's rune essence.
            if (i !== 10 && !window.rockData[i].depleted) {
                return i;
            }
        }
        return 10;
    }

    function mineRockWrapper(ore, clicked = false, ignoreDepletion = false) {
        if (!clicked) {
            // This was called via the interval
            const highest = findBestAvailable();
            if (highest !== ore) return mineRockOrginal(highest, true);
        }
        mineRockOrginal(ore, clicked, ignoreDepletion);
    }

    window.mineHighest = () => {
        const $button = $('#mineHighest button');
        if (window.mineRock === mineRockOrginal) {
            $button.text("Stop Mining Highest");
            window.mineRock = mineRockWrapper;
        } else {
            $button.text("Mine Highest");
            window.mineRock = mineRockOrginal;
        }
    }

    const TempContainerMakeX = '<small class="mr-2" id="mineHighest"><button type="button" class="btn btn-warning m-3" onclick="mineHighest();">Mine Highest</button></small>';
    $("#mining-container").children().first().children().first().children().first().append(TempContainerMakeX);

    // Every 5 seconds check to see if you have unlocked any new rocks
    window.setInterval(() => {
        highestRock = findHighestRock()
    }, 5000)

}

(function () {
    function injectScript(main) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();