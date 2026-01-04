// ==UserScript==
// @name         WK Percent unifier
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Make the percentage appearing during and after reviews the same
// @author       Gorbit99
// @include      https://*wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437914/WK%20Percent%20unifier.user.js
// @updateURL https://update.greasyfork.org/scripts/437914/WK%20Percent%20unifier.meta.js
// ==/UserScript==

'use strict';

(function() {
    let correct = 0;
    let incorrect = 0;
    const correctPercent = document.querySelector("#correct-rate");
    $.jStorage.listenKeyChange("reviewQueue", () => {
        const current = $.jStorage.get("currentItem");
        if (!current) {
            return;
        }
        const type = current.type === "Radical" ? "r" : (current.type === "Kanji" ? "k" : "v");
        const stats = $.jStorage.get(`${type}${current.id}`);

        if (!stats) {
            return;
        }

        if (stats.mi > 0 || stats.ri > 0) {
            incorrect++;
        } else {
            correct++;
        }
    });

    const percentObserver = new MutationObserver(() => {
        let percent = Math.ceil(correct / (correct + incorrect) * 100);
        if (correct + incorrect == 0) {
            percent = 100;
        }
        correctPercent.textContent = percent;
    });

    percentObserver.observe(correctPercent, {
        characterData: true,
        childList: true,
    });
})();