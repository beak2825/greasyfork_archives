// ==UserScript==
// @name         WK Auto Commit
// @namespace    WKAUTOCOMMIT
// @version      0.4.8
// @description  Auto commit for Wanikani
// @author       Johannes Mikulasch
// @match        http://www.wanikani.com/subjects/*
// @match        https://www.wanikani.com/subjects/*
// @match        http://www.wanikani.com/subject-lessons/*
// @match        https://www.wanikani.com/subject-lessons/*
// @grant        none
// @run-at       document-end
// @license
// @downloadURL https://update.greasyfork.org/scripts/16466/WK%20Auto%20Commit.user.js
// @updateURL https://update.greasyfork.org/scripts/16466/WK%20Auto%20Commit.meta.js
// ==/UserScript==

/*
 * WK Auto Commit
 * If you typed in the correct answer then it is automatically commited.
 * Therefore, you have to use the 'enter' key way less than before.
 *
 * Version 0.4.8
 *  Fix: Run this script on "wanikani.com/subject-lessons", as Wanikani have just renamed their lessons URL
 * Version 0.4.7
 *  Fix: show button to activate/deactivate in footer again.
 * Version 0.4.6
 *  Revert input detection to onkeyup, as "input" event missed kana input
 * Version 0.4.5
 *  Consider user-defined synonyms for the meaning of a vocab/kanji/radical as well
 *  Further prevent double commits by using the "input" element's "input" event instead of the "onkeyup" function
 * Version 0.4.4
 *  Bugfix: correctly detect double-check from lightning mode
 * Version 0.4.3
 *  Bugfix: prevent a double commit when typing fast, which led to a shaking input window or in the worst case to
 *   wrong input.
 * Version 0.4.2
 *  Quickfix: adapt to Wanikani update, which was deployed on March 27th, 2023
 *   (see https://community.wanikani.com/t/updates-to-lessons-reviews-and-extra-study/60912)
 *   - removed jStorage and jQuery references
 *   - changed the @match for the new lesson and review urls
 *   - Note: did not check with compatibilites of other user scripts (like Lightning mode or Katakana for On'yomi) yet.
 * Version 0.4.1
 *  Bugfix: call commit() at most one time for each item
 *   (see https://community.wanikani.com/t/userscript-auto-commit-the-end-of-the-enter-key/11825/64)
 * Version 0.4
 *  Compatibility with Lightning mode from the Double-Check userscript
 *  Compatibility with Katakana For On'yomi userscript
 * Version 0.3
 *  Script works now on the Lessons page too
 * Version 0.2
 *  Makes script work with Greasemonkey and Firefox
 * Version 0.1
 *  Initial version
 *
 */

/* jshint -W097 */
'use strict';

var activated = true;
var click_threshold = 600;

let expected_answers = [];
let synonyms = {};

var is_userscript_lightningmode_active = function () {
    /* Returns true if "Lightning Mode" from Userscript Double-Check is active */
    return Boolean(document.querySelector('.doublecheck-active'));
};

var toggle = function () {
    var button = document.querySelector("#WKAUTOCOMMIT_button");
    if (activated) {
        // Deactivates WK Auto Commit mode
        button.title = "Switch auto commit on";
        button.style.opacity = 0.5;
        button.textContent = "Auto Commit is off";
        activated = false;
    } else {
        // Activates WK Auto Commit mode
        button.title = "Switch auto commit off";
        button.style.opacity = 1.0;
        button.textContent = "Auto Commit is on";
        activated = true;
    }
};

var sanitize = function (str1) {
    var str2 = str1.replace(/\s/g, ''); // Removes Whitespaces
    str2 = str2.toLowerCase();
    return str2;
};

var commit = function () {
    if(!commit.usable) return;
    // Temporarily deactivate the commit function to prevent double commits
    commit.usable = false;
    const inputbutton = document.querySelector(".quiz-input__submit-button");
    inputbutton.click();
    if (!is_userscript_lightningmode_active()) {
        setTimeout(function(){ inputbutton.click();}, click_threshold);
    }

};

var check_input = function () {
        const currentresponse = document.querySelector("#user-response").value;
        //console.log("Checking Input", currentresponse, expected_answers);
        for (var i in expected_answers) {
            if (sanitize(currentresponse) === sanitize(expected_answers[i])) {
                commit();
                break;
            }
        }
};

var register_check_input = function () {
    var userinput = document.querySelector("#user-response");
    //userinput.addEventListener("input", function (event) {
    userinput.onkeyup = function (event) {
        if (activated) {
            check_input();
        }
    };
};

var addButton = function () {
    /* Define button */
    var button = document.querySelector("#WKAUTOCOMMIT_button");
    if (!button) {
        button = document.createElement("div");
        button.id = "WKAUTOCOMMIT_button";
        button.title = "Toggle Auto Commit Mode";
        button.textContent = "Auto Commit is on";
        button.style.backgroundColor = "#C55";
        button.style.opacity = 1;
        button.style.display = "inline-block";
        button.style.fontSize = "0.8125em";
        button.style.color = "#FFF";
        button.style.cursor = "pointer"
        button.style.padding = "10px";
        button.style.marginLeft = "10px";
        button.style.verticalAlign = "bottom";
        button.onclick = toggle;

        /* Prepend button to footer */
        var footer = document.querySelector(".quiz-footer");
        footer.appendChild(button);
    }
};

/* Load user synonyms. Load them only once. */
var loadSynonyms = function () {
    if (loadSynonyms.loaded) return;
    const dataUserSynonyms = document.querySelector('script[data-quiz-user-synonyms-target]');
    if (!dataUserSynonyms) return;
    synonyms = JSON.parse(dataUserSynonyms.innerHTML);
    loadSynonyms.loaded = true;
};

/* Save synonyms added by the user during the quiz session */
window.addEventListener("didUpdateUserSynonyms", function(event) {
    //console.log("Received didUpdateUserSynonyms event from WaniKani", event);
    synonyms[event.detail.subjectId] = event.detail.synonyms;
});

/* React on a willShowNextQuestion event, which is triggered by WaniKani when a new question is shown */
window.addEventListener("willShowNextQuestion", function(event) {
    //console.log("Received willShowNextQuestion event from WaniKani", event);
    register_check_input();
    addButton();
    loadSynonyms();

    /* Get expected answers from current item depending on the task (reading or meaning) */
    expected_answers = []
    const item = event.detail;
    const subject = item.subject;
    if (item.questionType === "meaning") {
        expected_answers = expected_answers.concat(subject.meanings);
        const subjectSynonyms = (subject.id in synonyms) ? synonyms[subject.id] : [];
        expected_answers = expected_answers.concat(subjectSynonyms);
    } else if (item.questionType === "reading") {
        if (subject.type === 'Vocabulary') {
            expected_answers = expected_answers.concat(subject.readings.map((e) => e.reading));
        } else if (subject.type === 'Kanji') {
            if (subject.primary_reading_type === 'kunyomi') {
                expected_answers = expected_answers.concat(subject.kunyomi);
            } else if (subject.primary_reading_type === 'onyomi') {
                expected_answers = expected_answers.concat(subject.onyomi);
            }
        }
    }

    // Make the commit function usable again
    commit.usable = true;
});

(function () {
    console.log('WK Auto Commit (a plugin for Wanikani): Initialized');
})();

