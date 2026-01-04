// ==UserScript==
// @name         Torn - Bad Shadow
// @namespace    bad.shadow
// @version      0.1.4
// @description  Changes the cash text color to red when over 1m is on hand
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544905/Torn%20-%20Bad%20Shadow.user.js
// @updateURL https://update.greasyfork.org/scripts/544905/Torn%20-%20Bad%20Shadow.meta.js
// ==/UserScript==


(function() {
    'use strict';

     function observeCash() {
        const element = document.querySelector('#user-money');
        const cash = parseInt(element.getAttribute('data-money'));

        if (cash > 1000000) element.style.color = 'red';

        const observer = new MutationObserver(() => {
            const cash = parseInt(element.getAttribute('data-money'));

            if (cash > 1000000) element.style.color = 'red';
            else if (cash < 1000001) element.style.color = '';
        });
        observer.observe(element, { attributes: true, attributeFilter: ['data-money'] });
    }

    if (document.readyState === 'complete') observeCash();
    else window.addEventListener('load', observeCash);
})();