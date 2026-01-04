// ==UserScript==
// @name         Organized Crime Staging Client
// @namespace    OCS
// @version      1.0.0
// @description  Submits API key to database, creates a record for faction:user:apikey allows 'Organized Crime Staging Manager' Script to query CPR data and issue OC instructions.
// @author       Allenone[2033011]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534827/Organized%20Crime%20Staging%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/534827/Organized%20Crime%20Staging%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const request = GM.xmlHttpRequest || GM.xmlhttpRequest;
    const minutes_between_status_checks = 10;

    // Prompt for API key if not stored
    let API_KEY = GM_getValue('api_key');
    if (!API_KEY) {
        API_KEY = prompt('Please enter your Torn API key (Minimal Access required):');
        if (!API_KEY) {
            alert('API key is required for functionality.');
            return;
        }
        GM_setValue('api_key', API_KEY);

        // submit API Key to server. 'RegisterUser' node.js endpoint
    }

    let LastOCCheck = GM_getValue('LastOCCheck');
    if (!LastOCCheck) {
        GM_setValue('LastOCCheck', Math.floor(Date.now() / 1000));
        IsInOC();
        console.log('First Set At: ' + Date.now());
    }else if (Math.floor(Date.now() / 1000) >= GM_getValue('LastOCCheck') + (minutes_between_status_checks * 60)) {
        console.log('Checked again at: ' + Math.floor(Date.now() / 1000));
        IsInOC();
        GM_setValue('LastOCCheck', Math.floor(Date.now() / 1000));
    }

    async function IsInOC() {
        let ready_at = GM_getValue('ready_at');
        if (!ready_at) GM_setValue('ready_at', Date.now() - 1);

        const response = await fetch(`https://api.torn.com/v2/user/organizedcrime?key=${API_KEY}`);
        const data = await response.json();

        if(data.organizedCrime.id) {
            GM_setValue('ready_at', data.organizedCrime.ready_at)
            console.log('In OC! data: ');
            console.log(data);
            return true; // if in OC all is good. do nothing
        }
        else {
            // do popup. not in OC. ask server for instruction.
            console.log('NOT IN OC!');
            return false; // if not in OC. send API key to server 'GetInstruction' node.js endpoint. if instructions available visual popup.
        }

    }

})();