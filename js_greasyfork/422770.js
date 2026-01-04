// ==UserScript==
// @name         megaupSkipADBCheck
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Skip ADB Check,auto download.
// @author       HaoaW
// @match        *://download.megaup.net/*
// @match        *://megaup.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422770/megaupSkipADBCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/422770/megaupSkipADBCheck.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if ("megaup.net" == location.hostname) {
        seconds = 0;
        display();
        let dlHref = document.querySelector('.download-timer a.btn.btn-default').href;
        if (dlHref) {
            //debugger;
            location.href = dlHref;
        }
    }
    else if ("download.megaup.net" == location.hostname) {
        let dlHref = document.querySelector('#afterdownload div a').href
        if (dlHref) {
            //debugger;
            location.href = dlHref;
            document.querySelector('#afterdownload').className = '';
        }
    }
})();

