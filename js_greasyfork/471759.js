// ==UserScript==
// @name         Remove Alerts on kiwiexploits.com [Extention]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all JavaScript alerts on kiwiexploits.com (This is an extention of Kiwi auto Key Gen)
// @author       Foch2803
// @match        https://kiwiexploits.com/*
// @icon                https://avatars.githubusercontent.com/u/139727811?s=400&u=a73138b011a6f48b9eaad88da89aa9fedd35d6cf&v=4
// @icon64              https://avatars.githubusercontent.com/u/139727811?s=400&u=a73138b011a6f48b9eaad88da89aa9fedd35d6cf&v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471759/Remove%20Alerts%20on%20kiwiexploitscom%20%5BExtention%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/471759/Remove%20Alerts%20on%20kiwiexploitscom%20%5BExtention%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert = function() {};
    window.prompt = function() {};
    window.confirm = function() { return true; };
    const installButton = document.getElementById('install-button');

    if (installButton) {
        const connectedText = document.createElement('p');
        connectedText.textContent = 'Connected to Alert Remover';
        connectedText.style.textAlign = 'center';
        installButton.insertAdjacentElement('afterend', connectedText);
        installButton.remove();
        setTimeout(() => {
            connectedText.style.opacity = '0';
            connectedText.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                connectedText.remove();
            }, 500);
        }, 3000);
    }
})();
