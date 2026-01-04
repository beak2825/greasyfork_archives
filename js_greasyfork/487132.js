// ==UserScript==
// @name         Quizlet Question Bypasser
// @namespace    https://greasyfork.org/en/scripts/487132-quizlet-question-bypasser/code
// @version      2024-02-11 Night
// @description  Bypasses paywall for non-textbook questions on quizlet. The text will be mostly scrambled, but the equations and latex are left alone.
// @author       Amaglam
// @match        https://quizlet.com/explanations/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487132/Quizlet%20Question%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/487132/Quizlet%20Question%20Bypasser.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';
    var paywall = document.querySelector('[data-testid="PayWallOverlay"]');
    if(paywall.children.length != 0) {
        paywall.remove();
        var paywall2 = document.getElementsByClassName('ExplanationsSolutionCard');
        if(paywall2.length != 0) {
            for (let i = 0; i < paywall2.length; i++) {
                paywall2[i].children[1].children[0].children[0].style.filter = 'none';
                paywall2[i].children[1].children[0].children[0].style.userSelect = 'auto';
                paywall2[i].children[1].children[0].children[0].style.webkitUserSelect = 'auto';
            }
        }
    }
})();