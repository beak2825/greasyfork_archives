// ==UserScript==
// @name         Bypass Okta trial has expired
// @description  Bypass Okta trial has expired in admin page
// @icon         https://ok12static.oktacdn.com/assets/img/icons/favicons/favicon-16x16.c55b69ae49b08edc7c000d12b8e5483f.png
// @version      0.1.0
// @author       foomango
// @match        https://*.okta.com/admin/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418772/Bypass%20Okta%20trial%20has%20expired.user.js
// @updateURL https://update.greasyfork.org/scripts/418772/Bypass%20Okta%20trial%20has%20expired.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sheet = document.styleSheets[10]
    sheet.insertRule('#simplemodal-overlay,#free-trial-expired-modal {display: none !important; z-index: -1 !important;}')
    sheet.insertRule('body {overflow: auto !important;}')
})();