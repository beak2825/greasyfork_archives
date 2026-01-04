// ==UserScript==
// @name         Genify AutoLogin
// @version      0.1.3
// @description  Auto login Genify
// @author       Gleb Liutsko
// @match        https://genify.joshlmao.com/*
// @grant        none
// @namespace    GenifyAutoLogin
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412087/Genify%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/412087/Genify%20AutoLogin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var buttons = document.getElementsByClassName('btn spotify-background');
    if (buttons.length != 0) {
        buttons[0].click();
        console.info('Genify AutoLogin: Auto Login');
    }
})();