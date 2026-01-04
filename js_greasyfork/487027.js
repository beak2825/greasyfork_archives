// ==UserScript==
// @name         Torn Crimes Cracking Difficulty
// @namespace    https://github.com/SOLiNARY
// @version      0.1.4
// @description  Shows difficulty of cracking targets in cycles & nerve to be spent.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/487027/Torn%20Crimes%20Cracking%20Difficulty.user.js
// @updateURL https://update.greasyfork.org/scripts/487027/Torn%20Crimes%20Cracking%20Difficulty.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const crackingHash = '#/cracking';
    const difficultyInfoTemplate = '{cycles} cycles, {attempts} attempts, {nerve} nerve needed';
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const isMobileView = window.innerWidth <= 784;
    const difficultyColorMap = {
        "OneAttempt": "#37b24d",
        "ThreeOrLess": "#74b816",
        "FiveOrLess": "#f59f00",
        "SevenOrLess": "#f76707",
        "TenOrLess": "#f03e3e",
        "MoreThanTen": "#7048e8",
    };
    let isOnCrackingPage = false;
    let bruteForceStrength = 0;

    const styles = `
@media only screen and (max-width: 784px) {
    span.silmaril-crimes-cracking-difficulty {
        font-size: xx-small;
    }

    div.crime-root.cracking-root div[class^=crimeOptionWrapper___] div[class^=sections___] {
        height: 54px !important;
    }
}
`;

    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null){
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    checkURLChange();

    setInterval(checkURLChange, 750);

    const targetNode = document.querySelector("div.crimes-app");
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (!isOnCrackingPage) {
                break;
            }

            let mutationTarget = mutation.target;
            if (mutation.type === 'childList' && mutationTarget.className.indexOf('outcomeWrapper___') >= 0) {
                let outcomeDiv = mutationTarget.querySelector('div[class*=outcome___]');
                if (outcomeDiv == null || outcomeDiv.hasAttribute('data-cracking-difficulty-value-set')) {
                    continue;
                }
                outcomeDiv.setAttribute('data-cracking-difficulty-value-set', '');

                const crimeOption = mutationTarget.parentNode.querySelector('div.crime-option');
                if (crimeOption.classList.contains('crime-option')){
                    setTimeout(function() {calculateDifficulty(crimeOption)}, 500);
                }
                break;
            }
        }
    });
    observer.observe(targetNode, observerConfig);

    async function addDifficulty() {
        while (document.querySelector('div.crime-root.cracking-root div[class^=currentCrime___]') == null) {
            if (!isOnCrackingPage) {
                break;
            }
            await sleep(50);
        }
        if (!isOnCrackingPage) {
            return;
        }

        const targets = document.querySelectorAll('div[class^=currentCrime___] div[class^=virtualList___] div[class^=crimeOptionWrapper___] div.crime-option');
        while (document.querySelector('div[class^=rig___]') == null){
            await sleep(50);
        }
        bruteForceStrength = parseFloat(document.querySelector('div[class^=rig___] div[class^=statistics___] div[class*=strength___] span[class^=value___]').innerText);

        targets.forEach(target => calculateDifficulty(target));
    }

    function calculateDifficulty(target) {
        const targetDescription = target.querySelector('div[class*=targetSection___]');

        let cyclesNeeded = 0;
        const characters = target.querySelectorAll('div[class^=sections___] div[class^=charSlot___]');
        characters.forEach(character => {
            cyclesNeeded += parseDifficulty(character) + 1;
        });
        const attemptsNeeded = Math.ceil(cyclesNeeded / bruteForceStrength);
        const nerveNeeded = Math.round(attemptsNeeded * 7 + 5);
        updateDifficultyInfo(targetDescription, cyclesNeeded, attemptsNeeded, nerveNeeded);
    }

    function updateDifficultyInfo(targetDescription, cyclesNeeded, attemptsNeeded, nerveNeeded) {
        const difficultyInfoSpan = targetDescription.querySelector('span.silmaril-crimes-cracking-difficulty') ?? document.createElement('span');
        difficultyInfoSpan.className = 'silmaril-crimes-cracking-difficulty';
        switch (attemptsNeeded) {
            case 0:
            case 1:
                difficultyInfoSpan.style.color = difficultyColorMap.OneAttempt;
                break;
            case 2:
            case 3:
                difficultyInfoSpan.style.color = difficultyColorMap.ThreeOrLess;
                break;
            case 4:
            case 5:
                difficultyInfoSpan.style.color = difficultyColorMap.FiveOrLess;
                break;
            case 6:
            case 7:
                difficultyInfoSpan.style.color = difficultyColorMap.SevenOrLess;
                break;
            case 8:
            case 9:
            case 10:
                difficultyInfoSpan.style.color = difficultyColorMap.TenOrLess;
                break;
            default:
                difficultyInfoSpan.style.color = difficultyColorMap.MoreThanTen;
                break;
        }
        difficultyInfoSpan.innerText = difficultyInfoTemplate.replace('{cycles}', cyclesNeeded).replace('{attempts}', attemptsNeeded).replace('{nerve}', nerveNeeded);
        if (isMobileView) {
            targetDescription.querySelector('div[class^=typeAndServiceWrapper___]').append(difficultyInfoSpan);
        } else {
            targetDescription.querySelector('div[class^=typeAndService___]').append(difficultyInfoSpan);
        }

    }

    function checkURLChange() {
        const currentURL = window.location.href;
        if (currentURL !== checkURLChange.previousURL) {
            if (window.location.href.includes(crackingHash)) {
                isOnCrackingPage = true;
                addDifficulty();
            } else {
                isOnCrackingPage = false;
            }
        }
        checkURLChange.previousURL = currentURL;
    }

    function parseDifficulty(element) {
        const label = element.getAttribute('aria-label');
        if (label == null) {
            return 0;
        }
        if (element.querySelector('span[class^=discoveredChar___]') != null) {
            return -1;
        }
        const matchEncrypted = label.match(/, (\d+) encryption/);
        if (matchEncrypted && matchEncrypted[1]) {
            return parseInt(matchEncrypted[1]);
        }
        return null;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();