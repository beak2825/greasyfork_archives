// ==UserScript==
// @name         Aws cloudwatch autocroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoscroll logs on AWS cloudwatch
// @author       ankh666
// @match        https://eu-west-3.console.aws.amazon.com/cloudwatch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      https://www.gnu.org/licenses/gpl-3.0.en.html#license-text
// @downloadURL https://update.greasyfork.org/scripts/468644/Aws%20cloudwatch%20autocroll.user.js
// @updateURL https://update.greasyfork.org/scripts/468644/Aws%20cloudwatch%20autocroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let scroll = setInterval(() => {
        var iframe = document.getElementById('microConsole-Logs');
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!innerDoc) {
            return;
        }
        const logView = innerDoc.getElementsByClassName('logs__main');
        const logViewElement = logView && logView[0];
        if (!logViewElement) {
         return;
        }
        logViewElement.scrollTo(0, 999999999)


    }, 1000)
})();