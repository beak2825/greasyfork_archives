// ==UserScript==
// @name         Vanguardbun loader remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple javascript/jquery code to remove the loader and changing the display of loader to none
// @author       Root Android and Ethical Hacker
// @match        https://vanguardbun.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422805/Vanguardbun%20loader%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/422805/Vanguardbun%20loader%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     document.getElementById('pageloader').style.display = "none";
     $('#pageloader').css('display','none');
})();