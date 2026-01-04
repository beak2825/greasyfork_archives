// ==UserScript==
// @name           Substack - dark-on-light
// @namespace      Violentmonkey Scripts
// @match          *://*.substack.com/*
// @exclude        *://substack.com/*
// @version        1.5
// @author         jez9999
// @description    Substack - change journal themes to dark-on-light
// @require        https://code.jquery.com/jquery-3.6.0.min.js
// @run-at         document-body
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/450040/Substack%20-%20dark-on-light.user.js
// @updateURL https://update.greasyfork.org/scripts/450040/Substack%20-%20dark-on-light.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ********************
    // Reminder: set the following in Violentmonkey advanced settings for Editor:
    // "tabSize": 4,
    // "indentUnit": 4,
    // "autoCloseBrackets": false,
    //
    // Also, bear in mind there appears to be a bug in Violentmonkey where after a while, MutationObserver's
    // stop being debuggable and the whole browser needs restarting before it'll work again.
    // ********************

    // Allow strings for HTML/CSS/etc. trusted injections
	if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: string => string,
            createScriptURL: string => string,
            createScript: string => string
        });
    }

    var utils = {};
    utils.jq = jQuery.noConflict( true );
    utils.isUnspecified = function(input) {
        return ((typeof input === "undefined") || (input === null));
    }
    utils.isSpecified = function(input) {
        return ((typeof input !== "undefined") && (input !== null));
    }

    // Add styling to DOM
    var sheet = document.createElement('style');
    sheet.innerHTML = `
        :root {
            --web_bg_color: #f3f3f3 !important;
            --print_on_web_bg_color: #000000 !important;
            --cover_bg_color: #ffffff !important;
            --print_secondary_on_web_bg_color: #666666 !important;
            --background_contrast_1: #ffffff !important;
            --background_contrast_2: #f5f4f4 !important;
            --background_contrast_3: #e9e9e9 !important;
            --background_contrast_4: #dbdbdb !important;
            --background_contrast_5: #cacaca !important;
            --print_on_pop: #ffffff !important;
            --cover_print_primary: #000000 !important;
            --cover_print_secondary: #cacaca !important;
            --cover_border_color: #000000 !important;
            --input_background: #e9e9e9 !important;
            --cover_input_background: #e9e9e9 !important;
            --tooltip_background: #dbdbdb !important;
            --selected_comment_background_color: #f5f4f4 !important;
        }
    `;
    document.head.appendChild(sheet);
})();
