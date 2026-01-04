// ==UserScript==
// @name         Leniwy Mirek
// @namespace    leniwymirek
// @version      0.1
// @description  Wyświetlanie liczby słów ukrytej treści na mikroblogu.
// @author       zranoI
// @include      /^https?:\/\/.*wykop\.pl\/mikroblog.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36853/Leniwy%20Mirek.user.js
// @updateURL https://update.greasyfork.org/scripts/36853/Leniwy%20Mirek.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('.entry.iC > .dC > div > .text').each(function() {
        var hidden = $(this).find('.text-expanded.dnone');
        if (hidden.length === 0) {
            return true;
        }
        $(this).find('.show-more').append(' (' + hidden.text().split(' ').length + ' słów)');
    });
});