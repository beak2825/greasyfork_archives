// ==UserScript==
// @name         Onlinetools Free Premium
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get free premium on onlinetools.com and removes the google login popup
// @author       Your Name
// @match        *://online*tools.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547668/Onlinetools%20Free%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/547668/Onlinetools%20Free%20Premium.meta.js
// ==/UserScript==


(function($) {

    document.getElementById("siteinfo").dataset.is_premium = "True"

    window.addEventListener('beforescriptexecute', function(e) {
        const target = e.target;
        if (target && target.src && target.src.includes('accounts.google.com/gsi/client')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    const containers = ['g_id_onload', 'g_id_intermediate_iframe', 'credential_picker_container'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('data-auto_prompt', 'false');
            el.remove();
        }
    });

    const iframes = document.querySelectorAll('iframe[src*="accounts.google.com/gsi/iframe"]');
    iframes.forEach(iframe => {
        iframe.style.display = 'none';
        iframe.remove();
    });

    


});