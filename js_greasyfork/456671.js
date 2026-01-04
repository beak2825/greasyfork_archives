// ==UserScript==
// @name         Microsoft Teams - Use Web App Instead
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click on the "Use Web App Instead" button, use the web client I just opened up, stop nagging me, please!
// @author       You
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456671/Microsoft%20Teams%20-%20Use%20Web%20App%20Instead.user.js
// @updateURL https://update.greasyfork.org/scripts/456671/Microsoft%20Teams%20-%20Use%20Web%20App%20Instead.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn_id = 'openTeamsClientInBrowser'
    var btn = document.querySelector('#' + btn_id)
    if (btn) {
        btn.click()
    }
})();