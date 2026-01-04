// ==UserScript==
// @name        Blooket KGui Loader
// @description A loader for the Blooket Council's KGui
// @namespace   https://github.com/c0des1ayr
// @match       *://*.blooket.com/play*
// @exclude     *://play.blooket.com/play*
// @icon        https://play.blooket.com/favicon.ico
// @grant       GM.xmlHttpRequest
// @run-at      document-start
// @license     MIT
// @version     1.0.4
// @author      c0des1ayer
// @connect     cdn.jsdelivr.net
// @antifeature This script loads the latest version of an external script using a CDN, which may potentially become malicious in the future.
// @downloadURL https://update.greasyfork.org/scripts/530756/Blooket%20KGui%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/530756/Blooket%20KGui%20Loader.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(async function() {
    'use strict';

    function fetchAndExecuteScript(url, callback) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                    const scriptText = response.responseText;
                    const script = document.createElement('script');
                    script.textContent = scriptText;
                    document.head.appendChild(script);
                    console.debug(`Successfully executed script from: ${url}`);
                    callback && callback();
                } else {
                    console.error(`Failed to load script: ${url}. Status: ${response.status}`);
                }
            },
            onerror: (err) => {
                console.error(`Error fetching script: ${url}`, err);
            }
        });
    }

    fetchAndExecuteScript('https://cdn.jsdelivr.net/gh/Blooket-Council/Blooket-Cheats@latest/cheats/KGui.min.js');
})();