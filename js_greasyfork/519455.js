// ==UserScript==
// @name         Prevent Logout on LowEndTalk
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Stops accidental logout on LowEndTalk by preventing access to the logout URL or similar variations using regex.
// @author       Zyra
// @match        *://lowendtalk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519455/Prevent%20Logout%20on%20LowEndTalk.user.js
// @updateURL https://update.greasyfork.org/scripts/519455/Prevent%20Logout%20on%20LowEndTalk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logoutRegex = /^https:\/\/lowendtalk\.com\/.*entry\/signout/i;

    function blockLogoutPage() {
        if (logoutRegex.test(window.location.href)) {
            window.location.href = 'https://lowendtalk.com/';
        }
    }

    blockLogoutPage();

    let previousURL = window.location.href;

    setInterval(() => {
        if (previousURL !== window.location.href) {
            previousURL = window.location.href;
            blockLogoutPage();
        }
    }, 500);

    document.body.addEventListener('click', function(event) {
        const target = event.target.closest('a');
        if (target && logoutRegex.test(target.href)) {
            event.preventDefault();
            alert("Logout prevented.");
        }
    });

    window.addEventListener('popstate', blockLogoutPage);
    window.addEventListener('hashchange', blockLogoutPage);

})();
