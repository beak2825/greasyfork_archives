// ==UserScript==
// @name         Enable keyboard shortcuts for Japanese characters
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  When making a mistake, while reviewing, also show the correct answer, when "あ" is pressed.
// @author       You
// @match        https://bunpro.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445082/Enable%20keyboard%20shortcuts%20for%20Japanese%20characters.user.js
// @updateURL https://update.greasyfork.org/scripts/445082/Enable%20keyboard%20shortcuts%20for%20Japanese%20characters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var input_field = document.getElementById("study-answer-input")
    var show_answer_label = document.getElementById("show-answer")
    var alternate_answer_label = document.getElementById("alternate-grammar")
    var show_grammar_button = document.getElementById("show-grammar")
    var play_button = document.getElementsByClassName("play-button")[0]

    function is_visible(el) {
        return el && el.style.display == "block";
    }

    function on_japanese_a(event) {
        var new_text = input_field.value

        if (new_text.endsWith("あ"))
        {
            if (is_visible(show_answer_label)) {
                show_answer_label.click();
            }
            else if (is_visible(alternate_answer_label)) {
                alternate_answer_label.click()
            }
            else {
                return
            }
        }
        else if (new_text.endsWith("ｆ")) {
            if (is_visible(show_grammar_button)) {
                show_grammar_button.click()
            }
            else {
                return
            }
        }
        else if (new_text.endsWith("ｐ")) {
            if (is_visible(play_button)) {
                play_button.click()
            }
            else {
                return
            }
        }
        else {
            return
        }

        // we only land here, if something was clicked, so remove the character
        input_field.value = new_text.substring(0, new_text.length -1);
    }

    input_field.addEventListener("input", on_japanese_a)
})();