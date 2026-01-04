// ==UserScript==
// @name         WME Expand Left Panel to UR-MP
// @description  Opens UR-MP when WME starts
// @author       TxAgBQ
// @version      20230314.001
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461820/WME%20Expand%20Left%20Panel%20to%20UR-MP.user.js
// @updateURL https://update.greasyfork.org/scripts/461820/WME%20Expand%20Left%20Panel%20to%20UR-MP.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    function clickScripts() {
        $(document.querySelector('#drawer > wz-navigation-item:nth-child(6)').shadowRoot).find('div > button').click();
    }

    // function clickURMP() {
    //    $(document.querySelector('#user-tabs')).find('li:nth-child(1) a span.fa-map-marker').click();
    // }

    // This clicks the UR-MP button after a 4-second delay 
    setTimeout(function(){$('#user-tabs').find('li:nth-child(1) a span.fa-map-marker').click()}, 4000);

    function wmeBootstrap() {
        if (W?.userscripts?.state.isReady) {
            clickScripts();
        } else {
            document.addEventListener("wme-ready", clickScripts, {
                once: true,
            });
        }
    }
/*
    function URMPBootstrap() {
        let intervalId = setInterval(() => {
            let consoleLog = console.log;
            console.log = function(message) {
                consoleLog.apply(console, arguments);
                if (message.includes('UR-MP Tracking') && message.includes('- Ready')) {
                    clearInterval(intervalId);
                    clickURMP();
                }
            }
        }, 1000); // check console every 1000 milliseconds (1 second)
    }

    URMPBootstrap(); */

    wmeBootstrap();
})();
