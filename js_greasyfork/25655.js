// ==UserScript==
// @name         wk-vocab-as-reading
// @namespace    WKVRT
// @description  Makes WaniKani vocab readings correct answers for meaning
// @version      2.1
// @author       wilddamon
// @match        https://www.wanikani.com/review/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25655/wk-vocab-as-reading.user.js
// @updateURL https://update.greasyfork.org/scripts/25655/wk-vocab-as-reading.meta.js
// ==/UserScript==

if (answerChecker){
    console.log("Found answerChecker");

    var oldAnswerEvaluator = answerChecker.evaluate;
    answerChecker.evaluate = function(type, userAnswer) {
        console.log("Evaluating answer...");
        var item = $.jStorage.get("currentItem");
        if (item.voc && type == "meaning") {
            console.log("Is vocab and meaning");
            var kana = item.kana || [];
            if (kana.includes(userAnswer)) {
                console.log("userAnswer matched reading");
                return { accurate: true, passed: true };
            }
        }
        return oldAnswerEvaluator(type, userAnswer);
    }

    var oldIsNonAsciiPresent = answerChecker.isNonAsciiPresent;
    answerChecker.isNonAsciiPresent = function(e) {
        console.log("checking for non-ascii characters...")
        var item = $.jStorage.get("currentItem");
        if (item.voc) {
            console.log('Disabling non-ascii check for vocab item');
            // Just disable checking for non-ascii in this case.
            return false;
        }
        return oldIsNonAsciiPresent(e);
    }

} else {
    console.log("answerChecker not found");
}