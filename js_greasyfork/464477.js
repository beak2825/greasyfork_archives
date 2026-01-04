// ==UserScript==
// @name         自动完成 ThisOrThat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成 Microsoft Rewards ThisOrThat
// @author       You
// @license      MIT
// @run-at       document-end
// @match        https://www.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464477/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20ThisOrThat.user.js
// @updateURL https://update.greasyfork.org/scripts/464477/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20ThisOrThat.meta.js
// ==/UserScript==


// n 为 ThisOrThat option value
function getAnswerCodeByValue(n) {
    for (var r, t = 0, i = 0; i < n.length; i++) t += n.charCodeAt(i);
    return (
        (r = parseInt(window._G.IG.substr(window._G.IG.length - 2), 16)),
        (t += r),
        t.toString()
    );
}

(function() {
    'use strict';

    setTimeout(() => {
     if (document.querySelector('#rqStartQuiz')) document.querySelector('#rqStartQuiz').click();
    }, 1000);

    setTimeout(() => {
        if (document.querySelector('#QuizContainerWrapper')) {
            const correctAnswer = window.rewardsQuizRenderInfo.correctAnswer;
            const thisOptionNode = document.querySelector('#rqAnswerOption0');
            const thatOptionNode = document.querySelector('#rqAnswerOption1');
            const thisOptionValue = thisOptionNode.attributes["data-option"].value;
            const thatOptionValue = thatOptionNode.attributes["data-option"].value;
            const thisOptionCode = getAnswerCodeByValue(thisOptionValue);
            const thatOptionCode = getAnswerCodeByValue(thatOptionValue);

            if (correctAnswer === thisOptionCode) thisOptionNode.click();
            if (correctAnswer === thatOptionCode) thatOptionNode.click();
        }
    }, 3000);
})();