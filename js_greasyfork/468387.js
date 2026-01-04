// ==UserScript==
// @name         Undo Button for delvinlanguage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds an Undo button and prevents empty inputs from being counted as mistakes.
// @author       mchlnix
// @match        http://delvinlanguage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=delvinlanguage.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468387/Undo%20Button%20for%20delvinlanguage.user.js
// @updateURL https://update.greasyfork.org/scripts/468387/Undo%20Button%20for%20delvinlanguage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var orig_step = globalThis.step;

    function is_input_ok(el) {
        if (window.STEP == 0) {
            return true;
        }

        if (!el) {
            return true;
        }

        if (el.value != "") {
            return true;
        }

        return false;
    }

    function copy_styles(from, to) {
        const styles = window.getComputedStyle(from);

        let cssText = styles.cssText;
        if (!cssText) {
            cssText = Array.from(styles).reduce((str, property) => {
                return `${str}${property}:${styles.getPropertyValue(property)};`;
            }, '');
        }
        to.style.cssText = cssText;
    }

    function undo_answer() {
        if (window.STEP !== -1) {
            console.log("Nothing to undo. Skipping.");
            return
        }

        var kana_input = document.querySelector("#quizbox-questions > li:nth-child(1) > input");
        var eng_input = document.querySelector("#quizbox-questions > li:nth-child(2) > input");

        var undo_button = document.getElementById("undo_button");

        if (eng_input) {
            window.STEP = 2

            eng_input.disabled = false;
            eng_input.focus();

            document.querySelector("#quizbox-questions > li:nth-child(2) > span").innerText = "?";
            document.querySelector("#quizbox-questions > li:nth-child(2) > span").style.color = "black";

            delete window.RESULT.q2;

            document.getElementById("quizbox-info").innerHTML = "";
            document.getElementById("quizbox-oops").style.display = "none";
            document.getElementById("quizbox-stop").style.display = "none";
        }
        else if (kana_input) {
            window.STEP = 1;

            kana_input.disabled = false;
            kana_input.focus();

            document.querySelector("#quizbox-questions > li:nth-child(1) > span").innerText = "?";
            document.querySelector("#quizbox-questions > li:nth-child(1) > span").style.color = "black";
            console.log(document.querySelector("#quizbox-questions > div"));
            document.querySelector("#quizbox-questions > div").remove();

            delete window.RESULT.q1;
        }
        document.getElementById("context-translation").style.visibility = "hidden";
        var el = document.querySelector(".unclozed")
        el.classList.replace('unclozed', 'clozed');

        window.RESULTS.pop();

        undo_button.remove();
    }

    window.addEventListener('keypress', function(e) {
        if(e.key === "Backspace" && ((e.target.tagName === 'INPUT' && e.target.value === '')||(e.target.tagName === 'BUTTON')))
        {
            undo_answer();
            e.preventDefault();
        }
    }, true);


    window.addEventListener('keydown', function(e) {
        if(e.target.tagName !== 'INPUT' && e.key === "Backspace")
        {
            undo_answer();
            e.preventDefault();
        }
    }, true);

    function maybe_insert_undo_button() {
        var result_kana = window.RESULT.q1
        var result_eng = window.RESULT.q2

        if (document.getElementById("undo_button") !== null)
            document.getElementById("undo_button").remove()

        if (result_kana === undefined) {
            // nothing happened yet, so no need for undo
            return;
        }

        var answer_button = document.getElementById("quizbox-continue");

        var undo_button = document.createElement("button");
        undo_button.innerText = 'Undo';
        undo_button.id = "undo_button";
        undo_button.onclick = undo_answer;

        copy_styles(answer_button, undo_button);

        console.log(result_kana === false, result_eng === false);
        if (result_kana === false || result_eng === false) {
            answer_button.after(undo_button);
        }
    }

    function step() {
        if (window.STEP != 0) {
            var kana_input = document.querySelector("#quizbox-questions > li:nth-child(1) > input");
            var eng_input = document.querySelector("#quizbox-questions > li:nth-child(2) > input");

            console.log(eng_input);

            if (!is_input_ok(kana_input)) {
                console.log("No data in Kana. Returning");
                return;
            }

            if (!is_input_ok(eng_input)) {
                console.log("No data in translation. Returning");
                return;
            }
        }

        orig_step();
        maybe_insert_undo_button();
    }

    globalThis.step = step;

    console.log(step);
})();