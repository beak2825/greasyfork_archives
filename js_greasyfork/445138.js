// ==UserScript==
// @name         Scroll to Grammar Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When showing Grammar Info, scroll down to it, if hiding, scroll back up.
// @author       You
// @match        https://bunpro.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445138/Scroll%20to%20Grammar%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/445138/Scroll%20to%20Grammar%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var last_display_value = null

    function scroll_to_grammar_section() {
        var grammar_section = document.getElementById("check-grammar");
        var show_grammar_button = document.getElementById("show-grammar");

        if (!grammar_section) {
            return
        }

        if (last_display_value == grammar_section.style.display) {
            return
        }

        if (grammar_section.style.display == "block") {
            show_grammar_button.scrollIntoView({behavior: "smooth", block: "start"});
        }
        else {
            document.getElementsByTagName("body")[0].scrollIntoView({behavior: "smooth", block: "start"});
        }

        last_display_value = grammar_section.style.display
    }

    window.setInterval(scroll_to_grammar_section, 200);

})();