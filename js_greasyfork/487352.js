// ==UserScript==
// @name         Omni.se Automatic Login
// @namespace    http://tampermonkey.net/
// @version      2024-02-15
// @description  Automatic login script for omni.se
// @author       Rokker
// @match        https://omni.se/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omni.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487352/Omnise%20Automatic%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/487352/Omnise%20Automatic%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Logga in
    const autoLoginClick = function(){
        let profileButton = document.querySelector('.user-profile--btn');
        if(profileButton){ return };

        let loginButton = document.querySelector('button.btn--medium');
        if(!loginButton){ return setTimeout(autoLoginClick,50) }
        loginButton.click();
    }
    setTimeout(autoLoginClick, 4000);

    document.querySelector('.header-banner--regular, .header-banner--minimal').style.top = 0;
    document.querySelector('.header-banner--regular, .header-banner--minimal').style.setProperty('--banner-offset', 0);
})();