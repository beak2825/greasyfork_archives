// ==UserScript==
// @name         Qmee Survey Hourly Rate Calculator and Reorder
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Calculate hourly rate for surveys on Qmee, color them based on value, and reorder list items by highest rate
// @author       DevDad
// @match        https://www.qmee.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505627/Qmee%20Survey%20Hourly%20Rate%20Calculator%20and%20Reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/505627/Qmee%20Survey%20Hourly%20Rate%20Calculator%20and%20Reorder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Converts a string like '4 mins' to a number representing minutes
    function parseTime(text) {
        const minutesMatch = text.match(/(\d+)\s*mins?/);
        return minutesMatch ? parseInt(minutesMatch[1]) : 0;
    }

    // Converts a string like '73¢' or '$1.03' to a number representing dollars
    function parseReward(text) {
        if (text.includes('¢')) {
            return parseInt(text.replace('¢', '')) / 100;
        } else if (text.includes('$')) {
            return parseFloat(text.replace('$', ''));
        }
        return 0;
    }

    // Calculate hourly rate, color scale from red to green, and reorder list items
    function calculateAndReorderSurveys() {
        const surveyItems = Array.from(document.querySelectorAll('ul.ItemList_root__jjHJx > li'));
        
        surveyItems.forEach(item => {
            const survey = item.querySelector('aside.SurveyItem_moneyTimeContainer__jNjI7');
            if (!survey) return;

            // Check if the hourly rate has already been added
            if (survey.querySelector('.hourly-rate')) return;

            const rewardText = survey.querySelector('p.SurveyItem_reward__oC_8A span').textContent.trim();
            const timeText = survey.querySelector('p.SurveyItem_time__hZAS_').textContent.trim();

            const timeInMinutes = parseTime(timeText);
            const rewardInDollars = parseReward(rewardText);

            if (timeInMinutes > 0 && rewardInDollars > 0) {
                const hourlyRate = (rewardInDollars / timeInMinutes) * 60;

                // Determine color based on hourly rate
                const rateScale = Math.min(Math.max(hourlyRate / 15, 0), 1); // scale 0 to 1, with $15/hr being 1
                const red = Math.round(255 * (1 - rateScale));
                const green = Math.round(255 * rateScale);
                const color = `rgb(${red}, ${green}, 0)`;

                // Create and style the hourly rate element
                const rateElement = document.createElement('div');
                rateElement.textContent = `$${hourlyRate.toFixed(2)}/hr`;
                rateElement.style.color = color;
                rateElement.style.fontWeight = 'bold';
                rateElement.style.marginTop = '5px';
                rateElement.classList.add('hourly-rate');

                // Append the hourly rate element to the survey
                survey.appendChild(rateElement);

                // Store hourly rate in a custom attribute for sorting later
                item.setAttribute('data-hourly-rate', hourlyRate);
            }
        });

        // Reorder list items by hourly rate in descending order
        const surveyList = document.querySelector('ul.ItemList_root__jjHJx');
        const sortedItems = surveyItems.sort((a, b) => parseFloat(b.getAttribute('data-hourly-rate')) - parseFloat(a.getAttribute('data-hourly-rate')));
        sortedItems.forEach(item => surveyList.appendChild(item));
    }

    // Add button to the top right of the page
    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Calculate Rates';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginTop = '60px';

        button.addEventListener('click', calculateAndReorderSurveys);

        document.body.appendChild(button);
    }

    // Run the script after page load
    window.addEventListener('load', addButton);
})();
