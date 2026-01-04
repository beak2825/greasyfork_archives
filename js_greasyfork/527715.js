// ==UserScript==
// @name         ProWritingAid Premium Unlocker
// @namespace    prowritingaid.taozhiyu.gitee.io
// @version      2.0.0
// @description  Unlocks ProWritingAid Premium for testing purposes (theoretical).
// @author       YourName
// @match        https://prowritingaid.com/*
// @icon         https://prowritingaid.com/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/527715/ProWritingAid%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/527715/ProWritingAid%20Premium%20Unlocker.meta.js
// ==/UserScript==
/* global ajaxHooker, jQuery, $ */
(function() {
    'use strict';

    console.log('ProWritingAid Premium Unlocker initializing...');

    // Hook AJAX requests
    ajaxHooker.hook(request => {
        if (request.url.includes('api/user/status') || request.url.includes('api/subscription')) {
            request.response = res => {
                let json = JSON.parse(res.responseText || '{}');
                let data = "data" in json ? json.data : json;
                data.isPremium = true;
                data.subscriptionEnd = '2099-12-31T23:59:59Z';
                data.features = ['advanced-grammar', 'style-suggestions', 'reports', 'all'];
                data.userTier = 'premium-pro';
                res.responseText = JSON.stringify(data);
            };
        }
    });

    // Unlock UI elements with jQuery
    $(document).ready(function() {
        GM_addStyle('.premium-locked { display: block !important; visibility: visible !important; }');
        $('.premium-locked, .upgrade-btn').removeClass('premium-locked disabled').addClass('unlocked').text('Premium Unlocked');
    });

    // Simple popup for testing
    window.addEventListener('load', () => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.bottom = '20px';
        popup.style.right = '20px';
        popup.style.padding = '10px';
        popup.style.background = '#f9f9f9';
        popup.style.border = '1px solid #ccc';
        popup.textContent = 'Premium features unlocked (test mode)';
        document.body.appendChild(popup);
    });
})();