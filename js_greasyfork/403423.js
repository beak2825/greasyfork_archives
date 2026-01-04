// ==UserScript==
// @name         Mangadex navbar toggle button
// @version      1.1
// @description  Makes the nav-bar toggleable so that you can enjoy your reading in full screen but still navigate! Button at top right of screen.
// @author       DinoMC
// @match        https://mangadex.org/*
// @grant        none
// @namespace https://greasyfork.org/users/563463
// @downloadURL https://update.greasyfork.org/scripts/403423/Mangadex%20navbar%20toggle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/403423/Mangadex%20navbar%20toggle%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('<style> body.tall { padding-top: 0!important; } .reader-main.tall { height: 100vh!important; max-height: 100vh!important; } </style>').prependTo("body");
    var xbutton = $('<svg focusable="false" id="togglenavbar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="position: fixed;height: 50px;width: 50px;top: 5px;right: 5px; z-index:99999"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="black"></path></svg>').prependTo("body");
    xbutton.click(function() {
        $("nav.navbar").toggle();
        $("body,.reader-main").toggleClass("tall");
    });

})();