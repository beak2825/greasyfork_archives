// ==UserScript==
// @name         Torn Mini-profile Adds Xanax Consumption
// @namespace    TravisTheTechie
// @version      2025.3
// @description  Adds the number of Xanax a player has used when loading up the mini profile.
// @author       Travis Smith
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529139/Torn%20Mini-profile%20Adds%20Xanax%20Consumption.user.js
// @updateURL https://update.greasyfork.org/scripts/529139/Torn%20Mini-profile%20Adds%20Xanax%20Consumption.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(async function() {
    'use strict';

    let apiKey = "";
    let shownConfig = false;



    // Your code here...
    const observer = new MutationObserver(handleBodyUpdate);
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    let gmc = new GM_config({
        'id': 'Torn-Mini-Profile-Xanax-Usage',
        'title': 'Script Settings',
        'fields':{
            'ApiKey':{
                'label': 'API Key (can be public)',
                'type': 'text',
                'default': ''
            }
        },
        'events':{
            'init': function () {
                apiKey = this.get("ApiKey");
            },
            'save': function () {
                apiKey = this.get("ApiKey");
            }
        }
    });

    GM_registerMenuCommand("Open Settings", function () { gmc.open(); });

    async function handleBodyUpdate() {
        const profileDescriptionElement = document.querySelector("#profile-mini-root .description");
        if (!profileDescriptionElement) return;
        // tag already there, stop
        if (profileDescriptionElement.querySelector(".custom-xanax-taken")) return;

        // find the userId
        const userImgElement = document.querySelector("#profile-mini-root div[class*=profile-mini-_userImageWrapper] a");
        if (!userImgElement) return;
        const userId = parseInt(userImgElement?.href?.replace(/\D/g, "")) || 0;
        if (!userId) return;

        if (!apiKey) {
            if (!shownConfig) {
                gmc.open();
                shownConfig = true;
            }
            return;
        }

        const url = `https://api.torn.com/user/${userId}?selections=personalstats&key=${apiKey}`
        const response = await fetch(url);
        const results = await response.json();
        const xanTaken = results?.personalstats?.xantaken;
        const eCansUsed = results?.personalstats?.energydrinkused;
        const eRefills = results?.personalstats?.refills;
        // no reason to show it if there's no data
        if (!xanTaken && !eCansUsed && !eRefills) return;

        // tag already there, stop; gotta do it here since fetch is async
        if (profileDescriptionElement.querySelector(".custom-xanax-taken")) return;

        const span = `<span class="custom-xanax-taken">Xanax Taken: ${xanTaken}, eCans Used: ${eCansUsed}, eRefills: ${eRefills}</span>`;

        profileDescriptionElement.insertAdjacentHTML('beforeend', span);
    }
})();