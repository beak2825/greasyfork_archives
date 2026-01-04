// ==UserScript==
// @name         Avito : cacher les professionnels
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cache les résultats de professionels sur avito.ma
// @author       Amre
// @match        https://www.avito.ma/*
// @icon         https://www.avito.ma/phoenix-assets/icons/favicon-96x96.png
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438498/Avito%20%3A%20cacher%20les%20professionnels.user.js
// @updateURL https://update.greasyfork.org/scripts/438498/Avito%20%3A%20cacher%20les%20professionnels.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Colorier en rouge
    //$(".ebncKu").parents('.oan6tk-0').css("background", "red");
    //$(".bgzmoY").css("background", "red");

    // Cacher
    $(".ebncKu").parents('.oan6tk-0').css("display", "none");
    //$(".bgzmoY").css("display", "none");

})();