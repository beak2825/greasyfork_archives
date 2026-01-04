// ==UserScript==
// @name         Wayback Machine Autosave
// @namespace    https://thannymack.com
// @version      2025-06-25
// @description  Automatically saves pages as you browse, if no copy already exists
// @license      GNU GPLv3 
// @author       TM
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.archive.org
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @connect      web.archive.org
// @connect      wayback.archive.org
// @downloadURL https://update.greasyfork.org/scripts/540777/Wayback%20Machine%20Autosave.user.js
// @updateURL https://update.greasyfork.org/scripts/540777/Wayback%20Machine%20Autosave.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const gmFetch = ({ url, headers = {} }) => {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url,
                headers,
                onload: e => resolve(e.response),
                onerror: reject,
                ontimeout: reject,
                responseType: "text"
            });
        });
    };

    async function checkEligibilityForSaving(currentUrl){

        const response = await gmFetch({
            url: `https://web.archive.org/__wb/sparkline?output=json&url=${encodeURI(currentUrl)}`,
            headers: { referer: "https://web.archive.org" },
        });

        try {
            const jsonResponse = JSON.parse(response);
            console.log({waybackMachineEligibilityResponse: jsonResponse});
            if (jsonResponse?.last_ts === null && jsonResponse?.is_live === true){
                return true;
            }
        }
        catch{
            console.log(`Error checking eligibility for saving ${currentUrl} to wayback machine. The page has not been saved.`);
            return false;
        }

    }

    async function saveUrlInWaybackMachine(currentUrl){

        console.log(`Saving ${currentUrl} to wayback machine...`);
        const response = await gmFetch({
            url: `https://wayback.archive.org/save/${encodeURI(currentUrl)}`
        });
        // console.log(response);
        console.log(`Saved ${currentUrl} to wayback machine.`);
    }

    async function start() {
        const currentUrl = document.URL;
        const eligableForSaving = await checkEligibilityForSaving(currentUrl);
        if (eligableForSaving === true){
            saveUrlInWaybackMachine(currentUrl);
        }
        else{
            console.log(`${currentUrl} has already been saved in the wayback machine, or the wayback machine has found it to be offline.`);
        }
    }

    start();
})();
