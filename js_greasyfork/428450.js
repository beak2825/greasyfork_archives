// ==UserScript==
// @name         Pixiv remove dashboard confetti
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Remove the confetti effect on the dashboard status as it wastes GPU power.
// @author       cro
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428450/Pixiv%20remove%20dashboard%20confetti.user.js
// @updateURL https://update.greasyfork.org/scripts/428450/Pixiv%20remove%20dashboard%20confetti.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    let process = function()
    {
        if (window.location.pathname == "/dashboard")
        {
            document.querySelector('canvas')?.remove();
        }
    };
    setInterval(process, 1000);
})();