// ==UserScript==
// @name         Bunpro Anki Mode
// @namespace    ezhmd
// @version      1.10
// @description  Anki mode for Bunpro
// @author       Ezzat Chamudi
// @match        https://bunpro.jp/study*
// @match        http://bunpro.jp/study*
// @match        https://www.bunpro.jp/study*
// @match        http://www.bunpro.jp/study*
// @grant        none
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/381684/Bunpro%20Anki%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/381684/Bunpro%20Anki%20Mode.meta.js
// ==/UserScript==

document.getElementById("study-answer-input").disabled = true;

(function() {
    'use strict';

var css = `
    .anki-show {
        background-color: #000099;
    }
    .anki-yes {
        background-color: #009900;
    }
    .anki-no {
        background-color: #990000;
    }
    .anki-button {
        display: inline-block;
        font-size: 0.8125em;
        color: #FFFFFF;
        cursor: pointer;
        padding: 10px;
        width: 30%;
        max-width: 130px;
    }
    .review-padding-bottom {
        text-align: center;
        display: inline-flex;
        width: 100%;
        justify-content: center;
    }
`;

$(`<style>${css}</style>
<span class="anki-button anki-no" onclick='answerShow();'>Don't Know</span>
<span class="anki-button anki-show" onclick='answerShow();'>Show Answer</span>
<span class="anki-button anki-yes" onclick='answerCorrect();'>Know</span>`)
.appendTo(".review-padding-bottom");

$(".anki-show").click(function() {
    $("#show-answer").click();
    $("#study-answer-input").val($(".study-area-input").first().text());
});

$(".anki-yes").click(function() {
    $("#submit-study-answer").click();
});

$(".anki-no").click(function() {
    $("#study-answer-input").val("あああああああ");
    $("#submit-study-answer").click();
});

})();