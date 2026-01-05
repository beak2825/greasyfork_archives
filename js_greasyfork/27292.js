// ==UserScript==
// @name        WaniKani Hide Mnemonics
// @namespace   rfindley
// @description Hide mnemonics on items page.
// @version     1.0.0
// @include     https://www.wanikani.com/radicals/*
// @include     https://www.wanikani.com/level/*/radicals/*
// @include     https://www.wanikani.com/kanji/*
// @include     https://www.wanikani.com/level/*/kanji/*
// @include     https://www.wanikani.com/vocabulary/*
// @include     https://www.wanikani.com/level/*/vocabulary/*
// @copyright   2017+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27292/WaniKani%20Hide%20Mnemonics.user.js
// @updateURL https://update.greasyfork.org/scripts/27292/WaniKani%20Hide%20Mnemonics.meta.js
// ==/UserScript==

wkhmn = {};

(function(gobj) {

    function startup() {
        var item, parent;

        if (location.pathname.match('radicals') !== null) {
            $('h2:contains("Name Mnemonic")').closest('section').addClass('hidden');
        } else {
            item = $('#note-meaning');
            parent = item.parent();
            item.insertAfter(parent);
            parent.addClass('hidden');

            item = $('#note-reading');
            parent = item.parent();
            item.insertAfter(parent);
            parent.addClass('hidden');
        }
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

}(wkhmn));
