// ==UserScript==
// @name         прозрачность
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  прозрачно
// @author       You
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504559/%D0%BF%D1%80%D0%BE%D0%B7%D1%80%D0%B0%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/504559/%D0%BF%D1%80%D0%BE%D0%B7%D1%80%D0%B0%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const alertsMenu = document.getElementById('AlertsMenu');
    alertsMenu.style.backgroundColor = 'rgba(39, 39, 39, 0.7)';

    const conversationsMenu = document.getElementById('ConversationsMenu');
    conversationsMenu.style.backgroundColor = 'rgba(39, 39, 39, 0.7)';

    const accountMenu = document.getElementById('AccountMenu');
    accountMenu.style.opacity = '0.80';

    const socialNetworks = document.getElementById('XenForoUniq1');
    socialNetworks.style.opacity = '0.80';

    const other = document.getElementById('XenForoUniq0');
    other.style.opacity = '0.80';
})();