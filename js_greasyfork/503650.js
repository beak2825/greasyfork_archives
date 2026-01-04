// ==UserScript==
// @name         Allow Free DRPCIV Quiz Retake
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Allows DRPCIV quizzes to be taken multiple times on the drpciv-romania.ro website.
// @author       Derzsi Dániel
// @match        https://www.drpciv-romania.ro/*
// @match        https://drpciv-romania.ro/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/503650/Allow%20Free%20DRPCIV%20Quiz%20Retake.user.js
// @updateURL https://update.greasyfork.org/scripts/503650/Allow%20Free%20DRPCIV%20Quiz%20Retake.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkForAbonamente() {
        return document.body.innerHTML.includes("abonamente();");
    }

    window.onload = function() {
        if (checkForAbonamente()) {
            // Remove the "DRPCIV" cookie
            Cookies.remove('DRPCIV', { path: '/', domain: '.drpciv-romania.ro', secure: true });

            // Reload the page
            window.location.reload();
        }
    };
})();