// ==UserScript==
// @name         Torn Pickpocketing Colors
// @version      0.4
// @namespace    https://github.com/Korbrm
// @description  Color codes crimes based on difficulty
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       Korbrm [2931507]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477536/Torn%20Pickpocketing%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/477536/Torn%20Pickpocketing%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const categoryColorMap = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#74b816",
        "Unsafe": "#f59f00",
        "Risky": "#f76707",
        "Dangerous": "#f03e3e",
        "Very Dangerous": "#7048e8",
    };

    var sideColorMap = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#74b816",
        "Unsafe": "#f59f00",
        "Risky": "#f76707",
        "Dangerous": "#f03e3e",
        "Very Dangerous": "#7048e8",
    }

    const tier1 = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#f76707",
        "Unsafe": "#f03e3e",
        "Risky": "#f03e3e",
        "Dangerous": "#f03e3e",
        "Very Dangerous": "#7048e8",
    }
    const tier2 = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#37b24d",
        "Unsafe": "#f76707",
        "Risky": "#f03e3e",
        "Dangerous": "#f03e3e",
        "Very Dangerous": "#7048e8",
    }
    const tier3 = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#37b24d",
        "Unsafe": "#37b24d",
        "Risky": "#f76707",
        "Dangerous": "#f03e3e",
        "Very Dangerous": "#7048e8",
    }
    const tier4 = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#37b24d",
        "Unsafe": "#37b24d",
        "Risky": "#37b24d",
        "Dangerous": "#f76707",
        "Very Dangerous": "#7048e8",
    }
    const tier5 = {
        "Safe": "#37b24d",
        "Moderately Unsafe": "#37b24d",
        "Unsafe": "#37b24d",
        "Risky": "#37b24d",
        "Dangerous": "#37b24d",
        "Very Dangerous": "#7048e8",
    }

    const markGroups = {
        "Safe": ["Drunk man", "Drunk woman", "Homeless person", "Junkie", "Elderly man", "Elderly woman"],
        "Moderately Unsafe": ["Classy lady", "Laborer", "Postal worker", "Young man", "Young woman", "Student"],
        "Unsafe": ["Rich kid", "Sex worker", "Thug"],
        "Risky": ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
        "Dangerous": ["Cyclist"],
        "Very Dangerous": ["Police officer"],
    };

    function updateDivColors() {
        var spanElement = document.querySelector('.value___FdkAT.copyTrigger___fsdzI');

        const url = window.location.href;
        if (!url.includes("#/pickpocketing")){
            return;
        }

        if (spanElement) {
            var pickpocketSkill = spanElement.textContent;
        }
        if (pickpocketSkill < 10) { sideColorMap = tier1; } else
            if (pickpocketSkill < 35) { sideColorMap = tier2; } else
                if (pickpocketSkill < 65) { sideColorMap = tier3; } else
                    if (pickpocketSkill < 80) { sideColorMap = tier4; } else
                    { sideColorMap = tier5; }


        const divElements = document.querySelectorAll('.titleAndProps___DdeVu:not(.processed)');
        divElements.forEach(divElement => {
            const divContent = divElement.querySelector('div').textContent.trim();
            const additionalData = divElement.querySelector('button.physicalPropsButton___xWW45');

            if (additionalData) {
                const additionalText = additionalData.textContent.trim();
                const text = divContent + ' ' + additionalText;

                for (const category in markGroups) {
                    if (markGroups[category].some(group => text.includes(group))) {
                        divElement.querySelector('div').style.color = categoryColorMap[category];
                        if (window.innerWidth > 386) {
                            divElement.querySelector('div').textContent = `${divContent} (${category})`;
                        }

                        divElement.classList.add('processed');
                        let parentElement = divElement;
                        for (let i = 0; i < 3; i++) {
                            parentElement = parentElement.parentElement;
                        }
                        if (!parentElement.classList.contains('processed')) {
                            parentElement.style.borderLeft = `3px solid ${sideColorMap[category]}`;
                            parentElement.classList.add('processed');
                        }
                    }
                }
            }
        });
    }

    updateDivColors();
    setInterval(updateDivColors, 1000);
})();
