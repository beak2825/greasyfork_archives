// ==UserScript==
// @name         HPID Password Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Enable HPID password autofill
// @author       Allen
// @match        https://login.external.hp.com/*
// @match        https://login-itg.external.hp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483817/HPID%20Password%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/483817/HPID%20Password%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const passwordDom = document.getElementById("password");
    passwordDom.parentNode.replaceChild(passwordDom.cloneNode(true), passwordDom);
})();