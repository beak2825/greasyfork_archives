// ==UserScript==
// @name         WaniKani Vocab Single Character Grid
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make the vocab grid look similar to radicals/kanji
// @author       Jigen
// @match        https://www.wanikani.com/vocabulary?difficulty=*
// @match        https://www.wanikani.com/level/*
// @grant        none
// @require      https://greasyfork.org/scripts/369353-jigen-s-other-stuff/code/Jigen's%20other%20stuff.js?version=604095
// @downloadURL https://update.greasyfork.org/scripts/374831/WaniKani%20Vocab%20Single%20Character%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/374831/WaniKani%20Vocab%20Single%20Character%20Grid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.multi-character-grid').removeClass('multi-character-grid').addClass('single-character-grid').addClass('vocab');
    jigen.addStyle('.vocab .character-item { ' +
            ' width: auto !important;' +
            '}' +
                  '.vocab .character-item a span:first-child {' +
                   '     padding: 0 25px 0 25px;' +
                  '}');
    // Your code here...
})();