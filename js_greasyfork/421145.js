// ==UserScript==
// @name        Melvor Ding
// @namespace   http://tampermonkey.net/
// @version     0.1.0
// @description Sound is made when crops are ready, when a pet is dropped, and when your idle.
// @description Special Thanks to TinyCoyote#1769, Visua#9999 for help with the code.
// @author      MrSapient
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/421145/Melvor%20Ding.user.js
// @updateURL https://update.greasyfork.org/scripts/421145/Melvor%20Ding.meta.js
// ==/UserScript==

// settings
window.DingSettings = {
    // changes ding volume level for farming
    FARMING_DING: 0.1,
    // changes ding volume level for pet
    PET_DING: 0.1,
    // change ding volume level for idle
    IDLE_DING: 0.1,
    // changes the amount of time between dings while idle
    IDLE_TIME: 7500,

    // save settings to local storage
    save: () => {
        window.localStorage['DingSettings'] = window.JSON.stringify(window.DingSettings);
    }
};

// main script
function script() {

    ////////////////////
    /// Farming Ding ///
    ///////////////////
    let growCropsRef = window.growCrops;
    window.growCrops = (areaID, patchID) => {
        if (patchID === 0 && !newFarmingAreas[areaID].patches[patchID].hasGrown) {
            let ding = new Audio("https://www.myinstants.com/media/sounds/ding_5crN9DD.mp3");
            ding.volume = DingSettings.FARMING_DING;
            ding.play();
        }
        growCropsRef(areaID, patchID);
    }

    /////////////////
    /// Pet Ding ///
    ////////////////
    let petDropRef = window.unlockPet;
    window.unlockPet = (petID, offline=false) => {
        if (!petUnlocked[petID] === true) {
            let ding = new Audio("https://www.myinstants.com/media/sounds/censor-beep-1.mp3");
            ding.volume = DingSettings.PET_DING;
            ding.play();
        }
        petDropRef(petID, offline);
    }

    /////////////////
    /// Idle Ding ///
    /////////////////
    const idleRef = () => {
        if (offline.skill === null && !isInCombat) {
            let ding = new Audio("https://www.myinstants.com/media/sounds/taco-bell-bong-sfx.mp3");
            ding.volume = DingSettings.IDLE_DING;
            ding.play();
        }
    }

    setInterval(idleRef, DingSettings.IDLE_TIME)
}


// https://www.myinstants.com/media/sounds/wwe-ring-bell-no-crowd.mp3
// https://www.myinstants.com/media/sounds/ding_2.mp3



// inject the script
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
            // load settings from local storage
            if (window.localStorage['DingSettings'] !== undefined) {
                const stored = window.JSON.parse(window.localStorage['DingSettings']);
                Object.getOwnPropertyNames(stored).forEach(x => {
                    window.DingSettings[x] = stored[x];
                });
                window.DingSettings.save();
            }
            // regularly save settings to local storage
            setInterval(window.DingSettings.save, 1000)
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
})();