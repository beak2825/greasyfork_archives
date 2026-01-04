// ==UserScript==
// @name         Hide Low Reward Swagbucks Surveys
// @namespace    http://tampermonkey.net/
// @version      2024-10-19
// @description  Hide surveys on Swagbucks that offer a reward below a set amount
// @author       LordBunzo
// @license      MIT
// @match        https://www.swagbucks.com/surveys*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swagbucks.com
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/513225/Hide%20Low%20Reward%20Swagbucks%20Surveys.user.js
// @updateURL https://update.greasyfork.org/scripts/513225/Hide%20Low%20Reward%20Swagbucks%20Surveys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MINIMUM_REWARD = 75; // Change this value to your preferred minimum reward
    const REFRESH_BUTTON_SELECTOR = '#surveysRefreshWarning';
    const SURVEY_SELECTOR = '#surveyList > tbody > tr';
    const REWARD_SELECTOR = '.surveySB > span > var'

    function hideLowRewardSurveys() {
        const surveys = document.querySelectorAll(SURVEY_SELECTOR);
        surveys.forEach(survey => {
            const rewardElement = survey.querySelector(REWARD_SELECTOR);
            if (rewardElement) {
                const rewardText = rewardElement.textContent;

                const rewardValue = parseInt(rewardText.replace(/\D/g,''), 10); // strip non-numeric characters

                if (rewardValue < MINIMUM_REWARD) {
                    survey.style.display = 'none'; // Hide the survey
                }
            }

        });
        console.log('%d Low reward survey(s) hidden.', surveys.length);
    }

    function clickRefreshButtonIfFound() {
        const refreshBtn = document.querySelector(REFRESH_BUTTON_SELECTOR);
        if (refreshBtn) {
            refreshBtn.click();
            // Wait for 5 seconds after clicking before processing surveys
            setTimeout(hideLowRewardSurveys, 5000);
        } else {
            // No refresh button, proceed with hiding low reward surveys
            hideLowRewardSurveys();
        }

    }

    // Update every 3 sec, adjust as necessary
    setInterval(clickRefreshButtonIfFound, 3000);
})();