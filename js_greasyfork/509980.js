// ==UserScript==
// @name         Car Specification for Torn Races with Highlight (Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Replace specified texts on the Torn Racing page and highlight exact matching car names with class and specs
// @author       HangingLow
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/509980/Car%20Specification%20for%20Torn%20Races%20with%20Highlight%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509980/Car%20Specification%20for%20Torn%20Races%20with%20Highlight%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    ////////////////////////////////////////////////////////////////////////////////////
    // Change here to false, if you want to use old car names e.g. Ford, Lexus etc... //
    ////////////////////////////////////////////////////////////////////////////////////
    const useNewCarNames = true;

    // Add highlight style
    const style = document.createElement('style');
    style.textContent = `
        .highlight-car {
            background-color: yellow;
            color: black;
            font-weight: bold;
            border-radius: 3px;
            padding: 0 2px;
        }
    `;
    document.head.appendChild(style);

    function clearHighlights() {
        document.querySelectorAll('.highlight-car').forEach(el => el.classList.remove('highlight-car'));
    }

    // Extract car info from replacement text: returns {carName, carClass, specs}
    function extractCarInfo(text) {
        // Example format: "Docks - Volt GT (Class A) - T, LR, T3"
        const regex = /^.+? - (.+?) \(Class (.+?)\) - (.+)$/;
        const match = text.match(regex);
        if (!match) return null;
        return {
            carName: match[1].trim(),
            carClass: match[2].trim(),
            specs: match[3].trim()
        };
    }

    function highlightMatchedCars(replacedCarInfos) {
        clearHighlights();

        replacedCarInfos.forEach(({carName, carClass, specs}) => {
            // Find all spans with class "model"
            const modelSpans = document.querySelectorAll('span.model');

            modelSpans.forEach(modelSpan => {
                const boldSpan = modelSpan.querySelector('span.bold');
                if (!boldSpan) return;

                const pageCarName = boldSpan.textContent.trim();
                if (pageCarName !== carName) return;

                // Extract class text from modelSpan - find text node containing (Class X)
                let classText = '';
                for (let node of modelSpan.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const txt = node.textContent.trim();
                        if (txt.startsWith('(Class') && txt.includes(carClass)) {
                            classText = txt;
                            break;
                        }
                    }
                }
                if (!classText) return;

                // Find specs span - search within the parent element of modelSpan for span with class starting with "model-car-name-"
                let specsSpan = null;
                const parent = modelSpan.parentElement;
                if (parent) {
                    specsSpan = parent.querySelector('span[class^="model-car-name-"]');
                }
                if (!specsSpan) return;

                const pageSpecs = specsSpan.textContent.trim();
                if (pageSpecs !== specs) return;

                // All matched: highlight car name span
                boldSpan.classList.add('highlight-car');

                // Debug log
                console.log(`Highlighted car: ${carName} (Class ${carClass}) - Specs: ${specs}`);
            });
        });
    }

    function replaceMultipleOccurrences(targetTexts, replacementTexts) {
        if (targetTexts.length !== replacementTexts.length) {
            console.error("Target texts and replacement texts arrays must have the same length.");
            return;
        }

        const regex = new RegExp(targetTexts.join('|'), 'g');

        // Track replaced car infos to highlight later
        const replacedCarInfos = [];

        function recursiveReplace(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (regex.test(node.textContent)) {
                    const originalText = node.textContent;
                    node.textContent = node.textContent.replace(regex, (matched) => {
                        const index = targetTexts.indexOf(matched);
                        if (index !== -1) {
                            const carInfo = extractCarInfo(replacementTexts[index]);
                            if (carInfo) replacedCarInfos.push(carInfo);
                            return replacementTexts[index];
                        }
                        return matched;
                    });
                    console.log(`Replaced "${originalText}" with "${node.textContent}"`);
                }
            } else {
                node.childNodes.forEach(recursiveReplace);
            }
        }

        const targetDivs = document.querySelectorAll('.title-black.top-round.t-overflow, .enlisted-btn-wrap');
        targetDivs.forEach(div => {
            recursiveReplace(div);
        });

        if (replacedCarInfos.length > 0) {
            highlightMatchedCars(replacedCarInfos);
        } else {
            clearHighlights();
        }
    }

    const targetTexts = [
        'Withdrawal',
        'Uptown',
        'Underdog',
        'Parkland',
        'Docks',
        'Commerce',
        'Two Islands',
        'Industrial',
        'Vector',
        'Mudpit',
        'Hammerhead',
        'Sewage',
        'Meltdown',
        'Speedway',
        'Stone Park',
        'Convict'
    ];

    const originalCarNames = [
        "Withdrawl - Lexus LFA (Class A) - T, LR, T3",
        "Uptown - Lamborghini Gallardo (Class A) - T, LR, T3",
        "Underdog - Honda NSX (Class A) - T, SR, T2",
        "Parkland - Honda NSX (Class A) - D, SR, T3",
        "Docks - Ford GT (Class A) - T, LR, T3",
        "Commerce - Honda NSX (Class A) - T, SR, T2",
        "Two Islands - Honda NSX (Class A) - D, LR, T3",
        "Industrial - Honda NSX (Class A) - T, SR, T3",
        "Vector - Honda NSX (Class A) - T, SR, T3",
        "Mudpit - Sierra Cosworth (Class B) - D, LR, T3",
        "Hammerhead - Honda NSX (Class A) - D, SR, T2",
        "Sewage - Honda NSX (Class A) - T, SR, T2",
        "Meltdown - Honda NSX (Class A) - T, SR, T3",
        "Speedway - Lexus LFA (Class A) - T, LR, T3",
        "Stone Park - Audi R8 (Class A) - D, SR, T3",
        "Convict - Mercedes SLR (Class A) - T, LR, T3",
    ];

    const newCarNames = [
        "Withdrawl - Veloria LFA (Class A) - T, LR, T3",
        "Uptown - Lambrini Torobravo (Class A) - T, LR, T3",
        "Underdog - Edomondo NSX (Class A) - T, SR, T2",
        "Parkland - Edomondo NSX (Class A) - D, SR, T3",
        "Docks - Volt GT (Class A) - T, LR, T3",
        "Commerce - Edomondo NSX (Class A) - T, SR, T2",
        "Two Islands - Edomondo NSX (Class A) - D, LR, T3",
        "Industrial - Edomondo NSX (Class A) - T, SR, T3",
        "Vector - Edomondo NSX (Class A) - T, SR, T3",
        "Mudpit - Colina Tanprice (Class B) - D, LR, T3",
        "Hammerhead - Edomondo NSX (Class A) - D, SR, T2",
        "Sewage - Edomondo NSX (Class A) - T, SR, T2",
        "Meltdown - Edomondo NSX (Class A) - T, SR, T3",
        "Speedway - Veloria LFA (Class A) - T, LR, T3",
        "Stone Park - Echo R8 (Class A) - D, SR, T3",
        "Convict - Mercia SLR (Class A) - T, LR, T3",
    ];

    let replacementTexts = useNewCarNames ? newCarNames : originalCarNames;

    function init() {
        replaceMultipleOccurrences(targetTexts, replacementTexts);

        const observer = new MutationObserver(() => {
            const currentTexts = Array.from(document.body.childNodes).map(node => node.textContent);
            const hasAlreadyReplaced = currentTexts.some(text => replacementTexts.some(replacement => text.includes(replacement)));

            if (!hasAlreadyReplaced) {
                replaceMultipleOccurrences(targetTexts, replacementTexts);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
