// ==UserScript==
// @name         BOT-Wayfarer Load Login to Gmail List
// @author       Saiful Islam
// @version      0.3
// @description  This script will Go From Login Page to Gmail List
// @namespace    https://github.com/AN0NIM07
// @match        https://wayfarer.nianticlabs.com/*
// @downloadURL https://update.greasyfork.org/scripts/458939/BOT-Wayfarer%20Load%20Login%20to%20Gmail%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/458939/BOT-Wayfarer%20Load%20Login%20to%20Gmail%20List.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */

(function() {

    //window.open("https://wayfarer.nianticlabs.com/new/review");
    localStorage.setItem("fetchAttemptLogin", 1);

    let address = "body > app-root > app-login > div > div > div.flex.flex-col.items-center.py-4 > a.login-link.login-link--google > span";
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
            sleep(5000)
            .then(() => {
                    document.querySelector("body > app-root > app-login > div > div > div.flex.flex-col.items-center.py-4 > a.login-link.login-link--google > span").click();
                    });
            return;
        }
        catch(e)
        {
            if(parseInt(localStorage.getItem("fetchAttemptLogin"))>100)
            {
                alert("Loading is taking Long TIme");
            }
            else
            {
                var i = parseInt(localStorage.getItem("fetchAttemptLogin"));
                i = i+1;
                localStorage.setItem("fetchAttemptLogin", i);
                sleep(2000)
                    .then(() => tryagain(address));
                
            }
        }

    }
})();