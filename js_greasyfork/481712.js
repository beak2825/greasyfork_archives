// ==UserScript==
// @name         Airtable Stylesheet
// @version      0.1
// @description  Airtable custom CSS
// @author       Black Anvil Creative
// @match        https://*.airtable.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1230556
// @downloadURL https://update.greasyfork.org/scripts/481712/Airtable%20Stylesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/481712/Airtable%20Stylesheet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define CSS styles
    const myCss = `
        div[data-columnid="fld0Nyl3llNVY0pNb"] > div > div[aria-checked="true"] > div,
        div.track-time > div > div > div > div[aria-checked="true"] > div {
            background-color: #C21807 !important;
            width: auto !important;
            display: flex !important;
            padding: 0 10px !important;
        }

        div.track-time > div > div > div > div {
            height: auto !important;
            width: auto !important;
        }

        div.track-time > div > div > div > div > div {
            border-radius: 3px;
            line-height: 2;
        }

        div[data-columnid="fld0Nyl3llNVY0pNb"] > div > div[aria-checked="true"] > div svg,
        div.track-time > div > div > div > div[aria-checked="true"] > div svg {
            display: none !important;
        }

        div[data-columnid="fld0Nyl3llNVY0pNb"] > div > div[aria-checked="true"] > div::after,
        div.track-time > div > div > div > div[aria-checked="true"] > div::after {
            content: "Stop";
            display: flex !important;
            color: #ffffff !important;
        }

        div[data-columnid="fld0Nyl3llNVY0pNb"] > div > div[aria-checked="false"] > div,
        div.track-time > div > div > div > div[aria-checked="false"] > div {
            background-color: #363636 !important;
            width: auto !important;
            display: flex !important;
            padding: 0 10px !important;
        }

        div[data-columnid="fld0Nyl3llNVY0pNb"] > div > div[aria-checked="false"] > div::after,
        div.track-time > div > div > div > div[aria-checked="false"] > div::after {
            content: "Start";
            display: flex !important;
            color: #ffffff !important;
        }
    `;

    // Load embedded CSS
    GM_addStyle(myCss);

})();