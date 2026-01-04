// ==UserScript==
// @name        Nursebuddy - Remove tab title prefixes
// @description Remove tab title prefixes on NurseBuddy People and Visits pages
// @version     1.2
// @author      TomC
// @match       *://app.nursebuddy.fi/*
// @grant       none
// @license     MIT
// @namespace   https://greasyfork.org/users/441
// @downloadURL https://update.greasyfork.org/scripts/514188/Nursebuddy%20-%20Remove%20tab%20title%20prefixes.user.js
// @updateURL https://update.greasyfork.org/scripts/514188/Nursebuddy%20-%20Remove%20tab%20title%20prefixes.meta.js
// ==/UserScript==

(function() {
    const prefixesToRemove = ["People - Clients - ", "People - Carers - "];

    setInterval(updateTitle, 1000);

    function updateTitle() {
        const url = window.location.href;
        let currentTitle = document.title;
        let newTitle = currentTitle;

        if (url.match(/^https:\/\/app\.nursebuddy\.fi\/#people\//)) {
            for (let prefix of prefixesToRemove) {
                if (newTitle.startsWith(prefix)) {
                    newTitle = newTitle.substring(prefix.length);
                    break;
                }
            }
        }

        if (url.match(/^https:\/\/app\.nursebuddy\.fi\/#visits/)) {
            const dateFromUrl = extractDateFromUrl(url);
            if (dateFromUrl) {
                newTitle = "Visits - " + dateFromUrl;
            }
        }

        if (newTitle !== currentTitle) {
            document.title = newTitle;
        }
    }

    function extractDateFromUrl(url) {
        const dateMatch = url.match(/date=(\d{4}-\d{2}-\d{2})/);
        return dateMatch ? dateMatch[1] : null;
    }
})();
