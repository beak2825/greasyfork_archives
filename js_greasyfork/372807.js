// ==UserScript==
// @name         Mangadex navbar fix
// @namespace    https://github.com/ishav/Mangadex-navbar-fix
// @version      0.1
// @description  Makes the nav-bar static instead of fixed at the top of the page.
// @author       ishav
// @match        https://mangadex.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372807/Mangadex%20navbar%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/372807/Mangadex%20navbar%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('nav.navbar').removeClass('fixed-top');

    $('nav.navbar').css('margin-bottom', '15px');
    $('body').css('padding-top', '0px');

})();