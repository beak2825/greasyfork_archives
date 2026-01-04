// ==UserScript==
// @name         Tapas Navbar Fix
// @version      0.1
// @description  Makes the nav-bar static instead of fixed at the top of the page.
// @author       Kie
// @match        *://tapas.io/*
// @grant        none
// @icon         https://upload.wikimedia.org/wikipedia/commons/6/62/Tapas-logo.png
// @namespace    https://greasyfork.org/users/101138

// @downloadURL https://update.greasyfork.org/scripts/395390/Tapas%20Navbar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/395390/Tapas%20Navbar%20Fix.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    $('.global-nav .global-nav-content').css('position', 'static');
})();