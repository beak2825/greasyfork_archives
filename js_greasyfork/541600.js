// ==UserScript==
// @name         Prevent Auto Logout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent session timeout on Zyxel Marketplace by periodically sending keep-alive requests.
// @author       Rick.Chen
// @match        https://beta.circle.zyxel.com/*
// @match        https://beta.marketplace.zyxel.com/*
// @match        https://portal-ebeta.myzyxel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541600/Prevent%20Auto%20Logout.user.js
// @updateURL https://update.greasyfork.org/scripts/541600/Prevent%20Auto%20Logout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set debug mode. 1: enable, 0: disable
    var debug = 0;

    // Set time interval (milliseconds)
    var interval = 5 * 60 * 1000;

    // Periodically send requests to keep the session alive
    setInterval(function() {
        fetch(window.location.href, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(response => {
            if (!response.ok) {
                if (debug) console.error('Get response failed');
            }
        }).catch(error => {
            if (debug) console.error('Error occurred while sending keep-alive request', error);
        });
    }, interval);
})();
