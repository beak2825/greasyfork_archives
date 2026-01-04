// ==UserScript==
// @name         Shadowverse Portal Auto Language Changer
// @namespace    https://shadowverse-portal.com/
// @version      0.1.2
// @description  Automatically change language on Shadowverse Portal
// @author       Toka-MK
// @match        https://shadowverse-portal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402543/Shadowverse%20Portal%20Auto%20Language%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/402543/Shadowverse%20Portal%20Auto%20Language%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //change this variable to set your language
    var lan = 'en';

    var href = window.location.href.split('lang=');
    if (href[1] != lan) {
        window.location.href = href[0] + 'lang=' + lan;
    }
})();