// ==UserScript==
// @name         Wanikani: Lattices
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Adds lattices back to the radical, kanji, and vocab menus
// @author       Kumirei
// @include      *wanikani.com*
// @exclude      *community.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383449/Wanikani%3A%20Lattices.user.js
// @updateURL https://update.greasyfork.org/scripts/383449/Wanikani%3A%20Lattices.meta.js
// ==/UserScript==

(function() {
    if ($('.global-header').length) {
        // CSS
        add('head', '<style id="LatticesScript">'+
            '.sitemap__page.sitemap__page--subject.nav-header {'+
            '    margin-top: 20px;'+
            '    padding-bottom: 10px;'+
            '    color: #fff;'+
            '    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);'+
            '    padding-left: 0;'+
            '}');

        // RADICAL LATTICES
        add('.sitemap__pages--radical', '<li class="sitemap__page sitemap__page--subject nav-header">LATTICE</li>');
        add('.sitemap__pages--radical', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/radicals/meaning">Name</a></li>');
        add('.sitemap__pages--radical', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/radicals/progress">Progress</a></li>');

        // KANJI LATTICES
        add('.sitemap__pages--kanji', '<li class="sitemap__page sitemap__page--subject nav-header">LATTICE</li>');
        add('.sitemap__pages--kanji', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/kanji/combined">Combined</a></li>');
        add('.sitemap__pages--kanji', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/kanji/meaning">Meaning</a></li>');
        add('.sitemap__pages--kanji', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/kanji/reading">Reading</a></li>');
        add('.sitemap__pages--kanji', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/kanji/status">Progress</a></li>');

        // VOCABULARY LATTICES
        add('.sitemap__pages--vocabulary', '<li class="sitemap__page sitemap__page--subject nav-header">LATTICE</li>');
        add('.sitemap__pages--vocabulary', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/vocabulary/combined">Combined</a></li>');
        add('.sitemap__pages--vocabulary', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/vocabulary/meaning">Meaning</a></li>');
        add('.sitemap__pages--vocabulary', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/vocabulary/reading">Reading</a></li>');
        add('.sitemap__pages--vocabulary', '<li class="sitemap__page sitemap__page--subject"><a href="/lattice/vocabulary/status">Progress</a></li>');
    }

    function add(selector, html) {
        var t = document.createElement("div");
        t.innerHTML = html;
        document.querySelector(selector).appendChild(t.firstChild);
    }
})();
