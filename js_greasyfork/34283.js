// ==UserScript==
// @name         Spiegel Anti-AntiAdBlock
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  If you disable AdBlock on spiegel.de, the website may still display a nag-message. This scripts will prevent said popup and content blur.
// @author       Beat Luginbühl
// @match        http://www.spiegel.de/*
// @grant        GM_log
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/34283/Spiegel%20Anti-AntiAdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/34283/Spiegel%20Anti-AntiAdBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let debug = false;

    if (debug) GM_log('Spiegel Anti-AntiAdBlock: started');

    setCookie('abbActivated', false, 365);

    setInterval(function () {
        if (debug) GM_log('Spiegel Anti-AntiAdBlock: looking for popup');
        let popup = getPopUp();
        if (popup !== null && popup !== undefined) {
            if (debug) GM_log(popup);
            if (debug) GM_log('Spiegel Anti-AntiAdBlock: popup found');
            popup.style.display = 'none';
            if (debug) GM_log('Spiegel Anti-AntiAdBlock: popup killed');
        }
    }, 1000);

    function getPopUp() {
        var popup = document.getElementsByClassName('ua-detected ua-webkit');
        if (debug) GM_log(popup);
        if (popup.length > 0 && popup[0] !== undefined) {
            if (debug) GM_log(popup[0]);
            return popup[0];
        }

        return null;
    }

    /**
     * https://www.w3schools.com/js/js_cookies.asp
     */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
})();