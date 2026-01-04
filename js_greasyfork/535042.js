// ==UserScript==
// @name        Nyaa Filter English Translated Only
// @description Auto filter Nyaa searches to show only English translated results.
// @require     http://code.jquery.com/jquery-3.1.0.slim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js
// @include     http*://nyaa.si/*
// @license     MIT
// @grant       GM_xmlhttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-start
// @version     2.04
// @namespace   https://greasyfork.org/users/1466117
// @downloadURL https://update.greasyfork.org/scripts/535042/Nyaa%20Filter%20English%20Translated%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/535042/Nyaa%20Filter%20English%20Translated%20Only.meta.js
// ==/UserScript==

/* global $ */

(async function() {
    'use strict';

    // Get the current filter state (default to true if not set)
    const filterEnabled = await GM.getValue('filterEnabled', true);

    // Handle filtering based on state
    if (filterEnabled) {
        var url = $(location).attr('href');
        var c = getUrlParameter('c');

        if (c == '0_0') {
            // Replace c=0_0 with c=1_2
            url = url.replace('c=0_0', "c=1_2");
            window.location.replace(url);
            return;
        } else if (!c) {
            // Append c=1_2 if c parameter doesn't exist
            const separator = url.includes('?') ? '&' : '?';
            url = url + separator + 'c=1_2';
            window.location.replace(url);
            return;
        }
    } else {
        // When filter is OFF, set c=0_0
        var url = $(location).attr('href');
        var c = getUrlParameter('c');

        if (c == '1_2') {
            // Replace c=1_2 with c=0_0
            url = url.replace('c=1_2', "c=0_0");
            window.location.replace(url);
            return;
        } else if (!c) {
            // Append c=0_0 if c parameter doesn't exist
            const separator = url.includes('?') ? '&' : '?';
            url = url + separator + 'c=0_0';
            window.location.replace(url);
            return;
        }
    }

    // Add toggle button once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addToggleButton);
    } else {
        addToggleButton();
    }

    async function addToggleButton() {
        const button = document.createElement('button');
        button.id = 'nyaa-filter-toggle';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: ${filterEnabled ? '#008000' : '#36454F'};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        button.textContent = `English Filter: ${filterEnabled ? 'ON' : 'OFF'}`;

        button.addEventListener('click', async function() {
            const currentState = await GM.getValue('filterEnabled', true);
            const newState = !currentState;
            await GM.setValue('filterEnabled', newState);

            // Update button appearance
            button.style.backgroundColor = newState ? '#008000' : '#36454F';
            button.textContent = `English Filter: ${newState ? 'ON' : 'OFF'}`;

            // reload the page to apply changes
            location.reload();
        });

        document.body.appendChild(button);
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
})();