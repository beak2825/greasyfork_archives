// ==UserScript==
// @name         Torn: Spy Save
// @namespace    none
// @version      1.1.1
// @match        https://www.torn.com/jobs.php
// @match        https://www.torn.com/companies.php
// @description  Saves your spies by sending them to TornStats
// @author       VroomVroom [2613750]
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/423693/Torn%3A%20Spy%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/423693/Torn%3A%20Spy%20Save.meta.js
// ==/UserScript==

var nodeToWatch = '.specials-confirm-cont';

/////
var apiKey  = GM_getValue ("apiKey",  "");

if (!apiKey) {
    apiKey  = prompt (
        'Api key not set for sending spies to TornStats. Please enter your Torn api key:',
        ''
    );
    GM_setValue ("apiKey", apiKey);
}
/////

const tornstatsUrl = `https://beta.tornstats.com/api/v1/${apiKey}/store/spy`;

const observer = new MutationObserver((mutations) => {
    const postData = {};
    if ($(nodeToWatch).find('div:nth-child(1) .bold').text().includes("Spy results for")) {
        postData.player_name = $(nodeToWatch).find('div:nth-child(3) a').text().split(" ")[0].replace(/[\[\]']+/g,'');
        postData.player_id = $(nodeToWatch).find('div:nth-child(3) a').text().split(" ")[1].replace(/[\[\]']+/g,'');
        postData.player_level = $(nodeToWatch).find('div:nth-child(3) div:nth-child(2) .desc').text();

        const speed = $(nodeToWatch).find('div:nth-child(5) ul li:nth-child(3) .desc').text();
        const strength = $(nodeToWatch).find('div:nth-child(5) ul li:nth-child(1) .desc').text();
        const defense = $(nodeToWatch).find('div:nth-child(5) ul li:nth-child(2) .desc').text();
        const dexterity = $(nodeToWatch).find('div:nth-child(5) ul li:nth-child(4) .desc').text();
        const total = $(nodeToWatch).find('div:nth-child(5) ul li:nth-child(5) .desc').text();

        if (speed !== "N/A")
            postData.speed = speed.replaceAll(',','');
        if (strength !== "N/A")
            postData.strength = strength.replaceAll(',','');
        if (defense !== "N/A")
            postData.defense = defense.replaceAll(',','');
        if (dexterity !== "N/A")
            postData.dexterity = dexterity.replaceAll(',','');
        if (total !== "N/A")
            postData.total = total.replaceAll(',','');

    } else if ($(nodeToWatch).find('div:nth-child(1) div .bold').text().includes("You managed to get the following results:")) {
        postData.player_name = $(nodeToWatch).find('div:nth-child(2) a').text().split(" ")[0].replace(/[\[\]']+/g,'');
        postData.player_id = $(nodeToWatch).find('div:nth-child(2) a').text().split(" ")[1].replace(/[\[\]']+/g,'');
        postData.player_level = $(nodeToWatch).find('div:nth-child(2) div:nth-child(2) .desc').text();

        const strength = $(nodeToWatch).find('.job-info li:nth-child(2)').text().replaceAll(',','').split(": ");
        const speed = $(nodeToWatch).find('.job-info li:nth-child(3)').text().replaceAll(',','').split(": ");
        const dexterity = $(nodeToWatch).find('.job-info li:nth-child(4)').text().replaceAll(',','').split(": ");
        const defense = $(nodeToWatch).find('.job-info li:nth-child(5)').text().replaceAll(',','').split(": ");
        const total = $(nodeToWatch).find('.job-info li:nth-child(6)').text().replaceAll(',','').split(": ");

        if (speed[1] !== "N/A")
            postData.speed = speed[1].replaceAll(',','');
        if (strength[1] !== "N/A")
            postData.strength = strength[1].replaceAll(',','');
        if (defense[1] !== "N/A")
            postData.defense = defense[1].replaceAll(',','');
        if (dexterity[1] !== "N/A")
            postData.dexterity = dexterity[1].replaceAll(',','');
        if (total[1] !== "N/A")
            postData.total = total[1].replaceAll(',','');
    }

    if (postData.player_name) {
        GM_xmlhttpRequest({
            method: "POST",
            headers:    {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(postData),
            url: tornstatsUrl,
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                observer.disconnect();
                $(nodeToWatch).find('>div:nth-child(2)').append(`<div style="display: inline; left: 1rem; position: relative; text-decoration: dashed underline overline; font-size: 1rem; text-decoration-color: forestgreen; color: red;">${result.message}</div>`)
                observer.observe($(nodeToWatch).get(0), { subtree: true, childList: true });
            }
        });
    }
});

(function() {
    'use strict';

    observer.observe($(nodeToWatch).get(0), { subtree: true, childList: true });
})();