// ==UserScript==
// @name         jisho.org Remove Furigana From Copy Paste
// @namespace    kaziocore
// @version      1.2.0
// @description  Removes furigana from copy and paste text.
// @author       https://github.com/philipnery
// @license      MIT; http://opensource.org/licenses/MIT
// @match        https://jisho.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381973/jishoorg%20Remove%20Furigana%20From%20Copy%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/381973/jishoorg%20Remove%20Furigana%20From%20Copy%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function (e) {
        e.preventDefault();

        const furiganas = document.querySelectorAll('.furigana, .japanese_word__furigana_wrapper');
        for (let i = 0; i < furiganas.length; i++) {
          furiganas[i].style.display = 'none';
        }

        e.clipboardData.setData('text', window.getSelection().toString());
        for (let i = 0; i < furiganas.length; i++) {
          furiganas[i].style.removeProperty('display');
        }
    });
})();
