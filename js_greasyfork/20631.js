// ==UserScript==
// @name         FAQ Search Language Filter
// @namespace    pxgamer
// @version      0.2
// @description  Filters out any unwanted languages when searching the FAQ.
// @author       pxgamer
// @include      *kat.cr/faq/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20631/FAQ%20Search%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/20631/FAQ%20Search%20Language%20Filter.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    // Set languages you want to keep
    var langs = [
        "", // MUST KEEP THIS ONE...
        "en"/*,
        "br",
        "de",
        "es",
        "ar",
        "ka",
        "lt"
        */
    ];
    $('ul.textcontent.questionList li').hide();
    $('ul.textcontent.questionList li a').each(function(){
        var url_lang = $(this).attr('href').split('/')[4];
        for (var i = 0; i < langs.length; i++) {
            if (url_lang == langs[i]) {
                $(this).parent().show();
            }
        }
    });
})();
