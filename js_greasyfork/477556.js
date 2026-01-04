// ==UserScript==
// @name         AniWorld.to/S.to - Remember preferred language
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Wählt automatisch die zuletzt gewählte Sprache
// @description  Automatically selects the last chosen language
// @author       LordJumes
// @match        https://aniworld.to/*
// @match        https://s.to/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/477556/AniWorldtoSto%20-%20Remember%20preferred%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/477556/AniWorldtoSto%20-%20Remember%20preferred%20language.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var languageImages = document.querySelectorAll('img[data-lang-key]');
    var selectedLanguage = GM_getValue('selectedLanguage', '1');
    for (var i = 0; i < languageImages.length; i++) {
        if (languageImages[i].getAttribute('data-lang-key') === selectedLanguage) {
            languageImages[i].click();
        }
    }
    for (var i = 0; i < languageImages.length; i++) {
        languageImages[i].addEventListener('click', function() {
            var langKey = this.getAttribute('data-lang-key');
            GM_setValue('selectedLanguage', langKey);
        });
    }
})();
