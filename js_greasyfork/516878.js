// ==UserScript==
// @name         Surfer AI Humanizer Premium Unlocker
// @namespace    surferseo.taozhiyu.gitee.io
// @version      0.2
// @description  Unlocks Surfer AI Humanizer Premium features.
// @author       longkidkoolstar
// @match        https://surferseo.com/*
// @icon         https://surferseo.com/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/516878/Surfer%20AI%20Humanizer%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/516878/Surfer%20AI%20Humanizer%20Premium%20Unlocker.meta.js
// ==/UserScript==
/* global ajaxHooker*/
(function() {
    'use strict';
    // How's it going filthy code looker
    ajaxHooker.hook(request => {
        if (request.url.endsWith('get-account-details') || request.url.endsWith('get-user-features')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                const a = "data" in json ? json.data : json;

                // Modify humanizer properties based on current Surfer's API structure
                a.humanizer = {
                    "max_words": 50000,
                    "enabled": true,
                    "is_legacy": false,
                    "is_unlimited": true // Add this line for potential "Unlimited" flag
                };

                res.responseText = JSON.stringify("data" in json ? (json.data = a, json) : a);
            };
        }
    });
})();