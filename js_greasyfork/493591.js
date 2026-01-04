// ==UserScript==
// @name         Push Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Push Button floating
// @author       Ahmed
// @match        https://cherdak.console3.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493591/Push%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493591/Push%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var button = document.createElement('button');
    button.textContent = 'Open Notifications';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.color = '#fff';
    button.style.background = '#007BFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';


    document.body.appendChild(button);


    button.onclick = function() {
        window.open('https://cherdak.console3.com/global/support-notification/notifications/create', '_blank');
    };
})();