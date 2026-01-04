// ==UserScript==
// @name         Senscritique Envies to radarr
// @description  Senscritique Envies to radarrz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://www.senscritique.com/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/512382/Senscritique%20Envies%20to%20radarr.user.js
// @updateURL https://update.greasyfork.org/scripts/512382/Senscritique%20Envies%20to%20radarr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sendPostRequest() {
        const url = 'https://toolbox.plkproduction.com/senscritique-envie';

        fetch(url, {
            method: 'POST',
            mode:  'no-cors'
        })
        .catch(error => console.error('Error:', error));
    }

    document.addEventListener('click', function(event) {
        const target = event.target.closest('[data-sc-action="wish-list"]');
        if (target) {
            console.log("clicked");
            sendPostRequest();
        }
    }, false);

})();