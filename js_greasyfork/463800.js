// ==UserScript==
// @name         Bunpro: Toggle Furigana of Review Sentence (Review 2.0)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Toggle review sentence furigana with ArrowUp Key while answer input field is focused. Fixed for use with 2.0 reviews on 12 Apr 2023.
// @author       Jackalopalen (originally alamin)
// @match        *bunpro.jp/*
// @grant        none
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/463800/Bunpro%3A%20Toggle%20Furigana%20of%20Review%20Sentence%20%28Review%2020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463800/Bunpro%3A%20Toggle%20Furigana%20of%20Review%20Sentence%20%28Review%2020%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    waitForKeyElements(".bp-quiz-console", function (e) {
        $("#manual-input").on("keyup", function (event) {
            if (event.key === "ArrowUp") {
                $("body").attr('data-furigana', $("body").attr('data-furigana')=="false");
            }
        });
    });
})();
