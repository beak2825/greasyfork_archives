// ==UserScript==
// @name         Dog Trombone Disabler
// @namespace    http://guegan.de/
// @version      1.1.0
// @description  Disables some stuff from Wikipedia
// @author       Maurice
// @match        *://*.wikipedia.org/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/401340/Dog%20Trombone%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/401340/Dog%20Trombone%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // navigation/site stuff
    $("#footer").remove() // footer
    $(".mw-header").remove() // header

    // removing some banned features
    $(".navbox").remove() // blue boxes
    $("#mw-panel-toc").remove() // toc
    $("#catlinks").remove() // categories
    $("#References").parent().remove() // References
    $(".reflist").remove() // reflist

    // Remove bottom sections
    function removeSection(id) {
        var header = $("#" + id)[0]

        if(header) {
            $(header).parent().nextUntil("h2").remove()
            $(header).parent().remove()
        }
    }

    removeSection("See_also")
    removeSection("External_links")
    removeSection("Further_reading")
    removeSection("Notes")

    // a bit more zealous removals
    $(".reference").remove() // reference tags (the [1] things)
    $(".vector-page-toolbar").remove() // talk edit etc
    $("#p-lang-btn").remove() // language
    $(".mw-editsection").remove() // edit section

    // disable external links
    $(".external.text").each(function() {
        $(this).replaceWith("[" + $(this).text() + "]")
    })

    // disable US
    $("a[href$=\\/wiki\\/United_States]").replaceWith("[United States]")

    // disable Portal links
    $("a[href^=\\/wiki\\/Portal\\:]").each(function() {
        $(this).replaceWith("[" + $(this).text() + "]")
    })

    // adjust the style a bit
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle ( `
    .mw-body {
        margin-left: 0;
    }

    a {
       font-weight: bold;
    }

    .mw-page-container-inner {
       display: block;
    }

    #content {
       display: block;
    }
` );
})();