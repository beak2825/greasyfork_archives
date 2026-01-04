// ==UserScript==
// @name         Luogu Max Team ID Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Find the largest accessible team ID on Luogu and display it
// @author       JacoAwA
// @match        *://www.luogu.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license JacoAwA
// @downloadURL https://update.greasyfork.org/scripts/496021/Luogu%20Max%20Team%20ID%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/496021/Luogu%20Max%20Team%20ID%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let maxTeamID = 0;
    let currentID = 80250;//
    const checkInterval = 500; //ms
    const targetURL = 'https://www.luogu.com.cn/team/'; // Luogu team URL pattern

    // Create a container for displaying the max team ID
    const displayContainer = document.createElement('div');
    displayContainer.id = 'max-team-id-display';
    displayContainer.textContent = 'Max Team ID: 0';
    document.body.appendChild(displayContainer);

    GM_addStyle(`
        #max-team-id-display {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
        }
    `);

    function checkTeamID(teamID) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${targetURL}${teamID}`,
            onload: function(response) {
                if (response.status === 200 && !response.finalUrl.includes('error')) {
                    maxTeamID = teamID;
                    displayContainer.textContent = `Max Team ID: ${maxTeamID}`;
                }
                currentID++;
            },
            onerror: function() {
                currentID++;
            }
        });
    }

    function startChecking() {
        setInterval(() => {
            checkTeamID(currentID);
        }, checkInterval);
    }

    startChecking();
})();
