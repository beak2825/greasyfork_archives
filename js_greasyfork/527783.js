// ==UserScript==
// @name         Black Ukraine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  из black russia в black ukraine
// @author       фред
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527783/Black%20Ukraine.user.js
// @updateURL https://update.greasyfork.org/scripts/527783/Black%20Ukraine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newLogoUrl = 'https://i.ibb.co/GQyb9Ypc/uix-logo-cust-2.png'; // Новый логотип

    function replaceLogo() {
        const logos = document.querySelectorAll('img');
        logos.forEach(logo => {
            if (logo.src.includes('/data/assets/logo/uix-logo-cust.png')) {
                logo.src = newLogoUrl;
            }
            if (logo.srcset && logo.srcset.includes('/data/assets/logo/uix-logo-cust.png')) {
                logo.srcset = newLogoUrl;
            }
        });
    }

    replaceLogo();
})();
