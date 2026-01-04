// ==UserScript==
// @name         Unlimited Answers & Pro Subscription for ThetaWise
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unlock unlimited answers and pro subscription on ThetaWise
// @author       Esclipse
// @license      MIT
// @icon         Thetawise
// @match        https://thetawise.ai/answers
// @match        https://thetawise.ai/chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489323/Unlimited%20Answers%20%20Pro%20Subscription%20for%20ThetaWise.user.js
// @updateURL https://update.greasyfork.org/scripts/489323/Unlimited%20Answers%20%20Pro%20Subscription%20for%20ThetaWise.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Unlock unlimited answers
    window.unlockAnswers = function() {
        // Remove restrictions on number of answers
        window.MAX_ANSWERS = Infinity;
    };
    // Unlock pro subscription
    window.unlockProSubscription = function() {
        // Set user as pro subscriber
        window.isProUser = true;
    };
    // Call functions to unlock features
    window.unlockAnswers();
    window.unlockProSubscription();
})();