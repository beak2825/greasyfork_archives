// ==UserScript==
// @name         YIFY site changer
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      0.3
// @description  Reorder sections on YIFY movie pages
// @author       Bunta
// @match        https://yts.mx/movies/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/399398/YIFY%20site%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/399398/YIFY%20site%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var techSpecsDiv = $("div#movie-tech-specs");
    var screenshotsDiv = $("div#screenshots");

    screenshotsDiv.before(techSpecsDiv);

    jQuery.noConflict( true );
})();