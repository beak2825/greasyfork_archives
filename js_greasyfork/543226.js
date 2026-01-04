// ==UserScript==
// @name        Internet Roadtrip Stay Awake
// @namespace   jdranczewski.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.1.2
// @author      jdranczewski
// @description Keeps your computer awake if you right click the coffee cup.
// @license     MIT
// @grant       GM.addStyle
// @icon        https://jdranczewski.dev/irt/images/stay_awake2.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/543226/Internet%20Roadtrip%20Stay%20Awake.user.js
// @updateURL https://update.greasyfork.org/scripts/543226/Internet%20Roadtrip%20Stay%20Awake.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/**
 * Internet Roadtrip Framework
 * @typedef {typeof import('internet-roadtrip-framework')} IRF
 */

(async function() {
    const radioContainerEl = await IRF.dom.radio;
    const coffeeCupImageEl = radioContainerEl.querySelector('img.coffee');

    // Adapted from https://github.com/mdn/dom-examples/blob/main/screen-wake-lock-api/script.js
    let isSupported = false;

    if ('wakeLock' in navigator) {
        isSupported = true;
    } else {
        console.log("Wake lock not supported!")
    }

    GM.addStyle(`
    .nosleep-on {
        filter: drop-shadow(0px 0px 6px rgba(255, 255, 0, 0.9));
    }
    `)

    if (isSupported) {
        // create a reference for the wake lock
        let wakeLock = null;
        
        // create an async function to request a wake lock
        const requestWakeLock = async () => {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                
                // listen for the release event
                wakeLock.addEventListener('release', () => {
                    // if wake lock is released alter the button accordingly
                    console.log("Wakelock released!");
                    coffeeCupImageEl.classList.toggle("nosleep-on", false);
                });

                console.log("Wakelock acquired!")
                coffeeCupImageEl.classList.toggle("nosleep-on", true);
                
            } catch (err) {
                // if wake lock request fails - usually system related, such as battery
                console.log("Couldn't acquire wake lock.");
                
            }
        } // requestWakeLock()
        
        // if we click our button
        coffeeCupImageEl.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
            e.preventDefault();

            // if wakelock is off request it
            if (wakeLock !== null) {
                wakeLock.release()
                .then(() => {
                    wakeLock = null;
                })
            } else { // if it's on release it
                requestWakeLock()
            }
        })
        
        document.addEventListener('visibilitychange', (e) => {
            if (wakeLock !== null && !document.hidden) {
                requestWakeLock();
            }
        });
    }
})();