// ==UserScript==
// @name         BOT-Wayfarer Load Home to Review
// @author       Saiful Islam
// @version      0.1
// @description  This script will Go to Review Page from Home Page
// @namespace    https://github.com/AN0NIM07
// @match        https://wayfarer.nianticlabs.com/*
// @downloadURL https://update.greasyfork.org/scripts/458940/BOT-Wayfarer%20Load%20Home%20to%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/458940/BOT-Wayfarer%20Load%20Home%20to%20Review.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */

(function() {

    //window.open("https://wayfarer.nianticlabs.com/new/review");
    localStorage.setItem("fetchAttempt", 1);

    let address = "body > app-root > app-wayfarer > div > mat-sidenav-container > mat-sidenav-content > div > app-showcase > div > wf-page-header > div > div:nth-child(1) > h2 > div";
    tryagain(address);
    return;

    function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

    function tryagain(address)
    {
        try
        {
            let fetchFeaturedWayspotTitle = document.querySelector(address).textContent;
            sleep(2000)
            .then(() => {
                    window.location.href = "https://wayfarer.nianticlabs.com/new/review";
                });
            return;
        }
        catch(e)
        {
            if(parseInt(localStorage.getItem("fetchAttempt"))>100)
            {
                alert("Loading is taking Long TIme");
            }
            else
            {
                var i = parseInt(localStorage.getItem("fetchAttempt"));
                i = i+1;
                localStorage.setItem("fetchAttempt", i);
                sleep(2000)
                    .then(() => tryagain(address));
            }
        }

    }
})();