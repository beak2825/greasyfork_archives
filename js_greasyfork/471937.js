// ==UserScript==
// @name         DUO Security auto push
// @namespace    DouglasKrahmer
// @version      0.7
// @description  Automatically click the "push" button when signing in via DUO Security frame page
// @author       Douglas Krahmer
// @match        https://*.duosecurity.com/frame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duo.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      GPL-3.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/471937/DUO%20Security%20auto%20push.user.js
// @updateURL https://update.greasyfork.org/scripts/471937/DUO%20Security%20auto%20push.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.$;

    const waitForButton = () => {
        const pushButton = $("div.push-label button.auth-button");
        if (!pushButton || pushButton.length != 1) {
            setTimeout(() => waitForButton(), 100);
            return;
        }

        setTimeout(() => pushButton.click(), 1000); // wait for the button iFrame to fully load, then click
    }

    waitForButton();
})();