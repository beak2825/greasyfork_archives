// ==UserScript==
// @name         Hotpot.ai Unlimiter
// @namespace    https://leaked.wiki
// @version      0.1
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once!/função newamounf
// @author       Wolftdb
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471912/Hotpotai%20Unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/471912/Hotpotai%20Unlimiter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        const amountBox = document.querySelector('.amountBox.available');
        const amount = parseInt(amountBox.querySelector('.amount').textContent);
        const newAmount = amount + 10;
        amountBox.querySelector('.amount').textContent = newAmount;
    });

    var css = ".disabled { pointer-events: all; opacity: 1; }";
    var js = "localStorage.setItem('ai.hotpot.helpers.requestCounter.8', '{\"lastRequestTime\":\"2023-03-12T03:24:37.586Z\",\"numRequests\":-69420}');";

    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.text = js;
    document.body.appendChild(script);
})();