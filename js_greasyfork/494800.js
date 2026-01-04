// ==UserScript==
// @name         Torn OC Member Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  See comments left for OC members
// @author       Ballig [2965527]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494800/Torn%20OC%20Member%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/494800/Torn%20OC%20Member%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    .toce_highlight::after {
        content: attr(data-toce);
    }
`);

    let members = [];

    GM_registerMenuCommand('Add spreadsheet ID', () => {
        let id = GM_getValue("TOCE_ID", "");
        id = prompt("Enter the Google spreadsheet ID", id);
        if (id) {
            GM_setValue("TOCE_ID", id);
            runTOCE();
        }
    });

    GM_registerMenuCommand('Add API key', () => {
        let key = GM_getValue("TOCE_Key", "");
        key = prompt("Enter the API key", key);
        if (key) {
            GM_setValue("TOCE_Key", key);
            runTOCE();
        }
    });

    function runTOCE() {
        members.length = 0;

        let TOCE_Key = GM_getValue("TOCE_Key", "");
        let TOCE_ID = GM_getValue("TOCE_ID", "");

        if (TOCE_Key && TOCE_Key.length > 0 && TOCE_ID && TOCE_ID.length > 0)
        {
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://sheets.googleapis.com/v4/spreadsheets/${TOCE_ID}/values/OC?alt=json&key=${TOCE_Key}`,
                onload: function(response) {
                    try {
                        let json_response = JSON.parse(response.responseText);

                        if (json_response.values)
                        {
                            for (let i = 1; i < json_response.values.length; i++)
                            {
                                if (json_response.values[i][0] !== null && json_response.values[i][0] !== undefined)
                                {
                                    members.push([json_response.values[i][0], json_response.values[i][2]]);
                                }
                            }
                        }
                        highlightFromSelector('ul.plans-list li ul.item li.member a');
                        highlightFromSelector('ul.crimes-list li.item-wrap div.details-wrap ul.details-list li ul.item li.member a');
                    }
                    catch (e) {
                    }
                }
            });
        }
    }

    function highlightFromSelector(selector) {
        const id_regex = /\[([0-9]+)\]$/;
        let names = document.querySelectorAll(selector);

        names.forEach((userItem) => {
            const user_match = userItem.innerText.match(id_regex);

            if (user_match && user_match.length > 1)
            {
                for (let i = 0; i < members.length; i++)
                {
                    if (members[i][0] === user_match[1])
                    {
                        userItem.setAttribute('data-toce', ` ### ${members[i][1]}`);
                        userItem.classList.add('toce_highlight');
                    }
                }
            }
        });
    }

    runTOCE();
})();