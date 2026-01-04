// ==UserScript==
// @name         OnlyFans to Coomer
// @namespace    http://coomer.su
// @version      1.1
// @description  Redirects from OnlyFans to coomer.su.
// @author       Dirk Digler
// @match        *://onlyfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482282/OnlyFans%20to%20Coomer.user.js
// @updateURL https://update.greasyfork.org/scripts/482282/OnlyFans%20to%20Coomer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = window.location.pathname.split('/').filter(Boolean).pop();

    const coomerUrl = `https://coomer.su/onlyfans/user/${username}`;

    const redirectButton = document.createElement('a');
    redirectButton.href = coomerUrl;
    redirectButton.innerHTML = 'Coomer';
    redirectButton.target = '_blank';
    redirectButton.style = 'position: fixed; top: 10px; left: 10px; padding: 10px; background-color: #0091ea; color: #ffffff; text-decoration: none; border-radius: 5px; z-index: 9999;';
    document.body.appendChild(redirectButton);
})();
