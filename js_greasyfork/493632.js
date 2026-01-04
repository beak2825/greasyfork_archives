// ==UserScript==
// @name         OnOff Unlimited Devices
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the 3 device limit on OnOff Web
// @author       Marc PEREZ
// @match        https://phone.onoff.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onoff.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493632/OnOff%20Unlimited%20Devices.user.js
// @updateURL https://update.greasyfork.org/scripts/493632/OnOff%20Unlimited%20Devices.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and hide the element
    function checkAndHideElement() {
        let element = document.querySelector('body > div.ModalCore_root__N1ZYY');
        if (element) {
            element.style.display = 'none';
            clearInterval(intervalId); // Stop checking once the element is found and hidden
        }
    }

    // Set an interval to check for the element
    var intervalId = setInterval(checkAndHideElement, 100); // checks every 100 milliseconds
})();