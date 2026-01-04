// ==UserScript==
// @name         Wanikani: Order Vocab's Kanji Breakdown
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Puts vocabulary words' kanji breakdown into the order of appearance within the word.
// @author       Kumirei
// @match        https://www.wanikani.com/*/session
// @include      *preview.wanikani.com*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367668/Wanikani%3A%20Order%20Vocab%27s%20Kanji%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/367668/Wanikani%3A%20Order%20Vocab%27s%20Kanji%20Breakdown.meta.js
// ==/UserScript==

(function($, wfs) {
    var word;
    // fix order in lessons
    wfs.wait('#supplement-voc-breakdown .kanji', function(e) {
        if (word != $('#character')[0].innerText) {
            word = $('#character')[0].innerText;
            var elems = hashElems('#supplement-voc-breakdown .kanji');
            reorganiseWords(word, elems, '#supplement-voc-breakdown ul.pure-g-r');
        }
    });

    // fix order in reviews
    wfs.wait('#related-items', function(e) {
        if ($('#character.vocabulary').length) {
            word = $('#character.vocabulary')[0].innerText;
            var elems = hashElems('#related-items span.kanji');
            reorganiseWords(word, elems, '#related-items ul.kanji');
        }
    });

    // puts the element containing the kanji in a hashmap with the kanji as the key
    function hashElems(target) {
        var elems = {};
        $(target).each(function(i, e) {
            elems[e.innerText] = $(e).closest('li');
        });
        return elems;
    }

    // goes through the word's kanji in order and for each puts its respective element last in the breakdown
    function reorganiseWords(word, elems, target) {
        for (let i = 0; i < word.length; i++) {
            var char = word.charAt(i);
            if (char in elems) {
                $(target).append(elems[char]);
            }
        }
    }
})(window.jQuery, window.wfs);
