// ==UserScript==
// @name         QuitaMierda
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Evita que ciertos blogs "tecnológicos" te spoileen tus series favoritas y hablen de temas chorra
// @author       DonNadie
// @require 	 http://code.jquery.com/jquery-latest.js
// @match        http://*.xataka.com
// @match        http://xataka.com
// @match        http://genbeta.com
// @match        http://*.genbeta.com
// @match        http://gizmodo.com
// @match        http://*.gizmodo.com
// @match        http://kotaku.com
// @match        http://*.kotaku.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21478/QuitaMierda.user.js
// @updateURL https://update.greasyfork.org/scripts/21478/QuitaMierda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var forbiddenWords = [
        "juego de tronos",
        "game of thrones",
        "Pokémon Go"
    ];

    var isForbbiden = function (title)
    {
        var k;

        for (k in forbiddenWords)
        {
            if (title.indexOf(forbiddenWords[k].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    };

    $(document).ready(function() {
        switch (location.host) {
            case "es.gizmodo.com":
            case "kotaku.com":
                $('h1.headline').each(function () {
                    var title = $(this).text().toLowerCase();

                    if (isForbbiden(title)) {
                        $(this).parent().parent().parent().remove();
                    }
                });
                break;
            case "www.genbeta.com":
            case "www.xataka.com":
                $('h2.article-home-header').each(function () {
                    var title = $(this).text().toLowerCase();

                    if (isForbbiden(title)) {
                        $(this).parent().remove();
                    }
                });
                break;
        }
    });
})();