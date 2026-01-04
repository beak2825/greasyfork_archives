// ==UserScript==
// @name         Torn Holdem Helper Loader
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Loader for the Torn Holdem Helper script
// @author       ErrorNullTag
// @match        https://www.torn.com/loader.php?sid=holdem*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/474679/Torn%20Holdem%20Helper%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/474679/Torn%20Holdem%20Helper%20Loader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    try {
        if (!window.location.href.includes("sid=holdem")) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/FallenPhantomRisen/TornScripts/main/Script.js",
            onload: function(response) {
                if (response.status === 200) {
                    eval(response.responseText);
                } else {
                    console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
            },
            onerror: function(error) {
                console.error("There was a problem with the script:", error);
            }
        });

    } catch (error) {
        console.error('There was a problem with the script:', error);
    }
})();