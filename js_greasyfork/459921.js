// ==UserScript==
// @name        Reading speed statistics - ttsu.app
// @namespace   Violentmonkey Scripts
// @match       https://reader.ttsu.app/b
// @grant       GM_addElement
// @version     0.1
// @author      GrumpyThomas
// @license MIT
// @description Simple userscript to gain insights into your reading speed on ttsu
// @downloadURL https://update.greasyfork.org/scripts/459921/Reading%20speed%20statistics%20-%20ttsuapp.user.js
// @updateURL https://update.greasyfork.org/scripts/459921/Reading%20speed%20statistics%20-%20ttsuapp.meta.js
// ==/UserScript==

(function (addElement) {
    const oneMinuteInMs = 60 * 1000;
    let bodyElement = document.querySelector('body');
    let readSpeedElement = null;
    let readInfo = {
        id: null,
        startCharacterCount: null,
        startTime: null,
        mostRecentCharCount: null,
        totalCharsRead: null,
    };

    let bodyObserver = new MutationObserver(function () {
        let node = getProgressStatisticElement();
        if (!node) {
            return;
        }

        if (!readSpeedElement || !node.contains(readSpeedElement)) {
            readSpeedElement = addElement(node, 'div');
        }

        let currentCharCount = parseInt(node.innerText.split('/').shift().trim());
        if (currentCharCount === 0) {
            return;
        }

        // initialize
        const newTimestamp = Date.now();
        const id = window.location.href;
        if (readInfo.startCharacterCount === null || readInfo.startTime === null || readInfo.id !== id) {
            logInformation('Initialize readInfo');
            readInfo.id = id;
            readInfo.startCharacterCount = currentCharCount;
            readInfo.startTime = Date.now();
            readInfo.mostRecentCharCount = currentCharCount;
            readInfo.totalCharsRead = 0;
            displayReadSpeed(0, 0);
            return;
        }

        if (readInfo.mostRecentCharCount === currentCharCount) {
            return;
        }

        let readCharacters = currentCharCount - readInfo.startCharacterCount;
        let readDurationInMs = Date.now() - readInfo.startTime;
        displayReadSpeed(readDurationInMs, readCharacters);
        readInfo.mostRecentCharCount = currentCharCount;
    });

    /*
     * start observing on the body and it's child elements
     * characterData makes sure the observer detects text changes
     * which is required to detect progress changes
     */
    bodyObserver.observe(bodyElement, { subtree: true, childList: true, characterData: true });

    function displayReadSpeed(durationInMs, readCharacters) {
        let readDuration = durationInMs / oneMinuteInMs / 60;
        let charsPerHour = Math.floor(readCharacters / readDuration) || 0;
        readSpeedElement.innerText = `${msToTime(durationInMs)} (${charsPerHour}/hr) ${readCharacters}`;
    }
})(
    (node, tag) => {
      // make the script available with and without userscript extension
        if (window.GM_addElement) {
            logInformation('Using GM_addElement');
            return GM_addElement(node, tag);
        }

        logInformation('Using document.createElement');
        let createdElement = document.createElement(tag);
        node.appendChild(createdElement);

        return createdElement;
    }
);

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${padNumber(hours, 2)}:${padNumber(minutes, 2)}:${padNumber(seconds, 2)}`;
}

function padNumber(number, length) {
    return number.toString().padStart(length, '0');
}

function getProgressStatisticElement() {
    let node = null;
    // try find the progress statistic element based on a custom data attribute
    node = document.querySelector('div[data-target="progress"]');
    if (node) {
        return node;
    }

    // fall back on xpath
    let divs = document.evaluate("//div[contains(., '%')]", document, null, XPathResult.ANY_TYPE, null);
    while (node = divs.iterateNext()) {
        if (Array.from(node.children).length === 0 && node.textContent?.length > 0) {
            node.dataset.target = "progress";
            return node;
        }
    }
}

function logInformation(message) {
    if (console && console.log) {
        console.log(message);
    }
}
