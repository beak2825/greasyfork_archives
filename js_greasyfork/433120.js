// ==UserScript==
// @name         Crossword Puzzle Shortcut keys
// @namespace    https://github.com/greghaygood
// @version      1.0
// @description  Add keyboard shortcuts for UI controls on the WaPo crossword puzzle app
// @author       Greg Haygood <haygoodg@gmail.com>
// @match        https://www.washingtonpost.com/crossword-puzzles/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433120/Crossword%20Puzzle%20Shortcut%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/433120/Crossword%20Puzzle%20Shortcut%20keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simClick(elem) {
        elem.dispatchEvent(new MouseEvent('click' , { view: window }))
    }

    var checkMenu = document.querySelector('#check.dropdown > a')
    var checkAllBtn = document.getElementById('check-all-button')
    var checkWordBtn = document.getElementById('check-word-button')
    var checkLetterBtn = document.getElementById('check-letter-button')
    function doCheck(evt) {
        if (evt.ctrlKey && evt.key == 'a') {
            simClick(checkMenu)
            simClick(checkAllBtn)
        } else if (evt.ctrlKey && evt.key == 'w') {
            simClick(checkMenu)
            simClick(checkAllBtn)
        } else if (evt.ctrlKey && evt.key == 'l') {
            simClick(checkMenu)
            simClick(checkAllBtn)
        }
    }

    if (checkMenu) {
        document.addEventListener('keyup', doCheck);
    }

})();