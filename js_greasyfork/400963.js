// ==UserScript==
// @name         Guardian Crossword Focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show only the current clue (for the activated cells in the grid) in Guardian crosswords
// @author       Akash
// @match        https://www.theguardian.com/crosswords/quick/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400963/Guardian%20Crossword%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/400963/Guardian%20Crossword%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval = setInterval(function () {
        if (isReady()) {
           clearInterval(interval);
           init()
           return
        }
    }, 100)

    function isReady() {
        const el = document.querySelector('.crossword__clue__text')
        return el != null && el.textContent != null && el.textContent.length != null && el.textContent.length > 0
    }

    function init() {
        document.addEventListener('keyup', () => {
            hideAllCluesExceptSelected()
        })

        document.addEventListener('click', () => {
            hideAllCluesExceptSelected()
        })

        document.querySelector('.crossword__clue').click()
    }


    function hideAllCluesExceptSelected() {
        document.querySelectorAll('.crossword__clue:not(.crossword__clue--selected)').forEach(el => {
            el.style = 'display:none'
        })

        document.querySelector('.crossword__clue--selected').style = 'display:block'
    }
})();