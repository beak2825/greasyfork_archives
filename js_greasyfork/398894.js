// ==UserScript==
// @name         All but speed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable all buttons but speed
// @author       Vaaaz
// @match        https://www.torn.com/gym.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398894/All%20but%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/398894/All%20but%20speed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).load(function() {
        document.getElementsByClassName('button___3AlDV')[0].style.display = "none";
        document.getElementsByClassName('button___3AlDV')[1].style.display = "none";
        document.getElementsByClassName('button___3AlDV')[2].style.display = "inline-block";
        document.getElementsByClassName('button___3AlDV')[3].style.display = "none";
    });
})();
