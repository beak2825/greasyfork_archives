
// ==UserScript==
// @name         OnlyFans to Coomer
// @namespace    http://coomer.su
// @version      1.2
// @description  Redirects from OnlyFans to coomer.su.
// @author       Dirk Digler / nafigefy@imagepoet.net
// @match        *://onlyfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509295/OnlyFans%20to%20Coomer.user.js
// @updateURL https://update.greasyfork.org/scripts/509295/OnlyFans%20to%20Coomer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Regular expression to match the username from the URL pathname
    const usernameRegex = /^\/([^\/]+)/;
    const match = window.location.pathname.match(usernameRegex);

    // Check if a match is found and extract the username
    const username = match ? match[1] : null;

    if (username) {
        const coomerUrl = `https://coomer.su/onlyfans/user/${username}`;

        const redirectButton = document.createElement('a');
        redirectButton.href = coomerUrl;
        redirectButton.innerHTML = 'Coomer';
        redirectButton.target = '_blank';
        redirectButton.style = 'position: fixed; top: 10px; left: 10px; padding: 10px; background-color: #0091ea; color: #ffffff; text-decoration: none; border-radius: 5px; z-index: 9999;';
        document.body.appendChild(redirectButton);
    } else {
        console.error('Username not found in URL');
    }
})();
