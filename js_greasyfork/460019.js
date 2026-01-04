// ==UserScript==
// @name        Reading speed statistics- experimental - ttsu.app
// @namespace   Violentmonkey Scripts
// @match       https://reader.ttsu.app/*
// @grant       GM_addElement
// @version     0.5
// @author      GrumpyThomas
// @license MIT
// @description Simple userscript to gain insights into your reading speed on ttsu
// @downloadURL https://update.greasyfork.org/scripts/460019/Reading%20speed%20statistics-%20experimental%20-%20ttsuapp.user.js
// @updateURL https://update.greasyfork.org/scripts/460019/Reading%20speed%20statistics-%20experimental%20-%20ttsuapp.meta.js
// ==/UserScript==

let inDebugMode = window.location.search.indexOf('debug') > -1;
let isPersistent = window.location.search.indexOf('persistent') > -1;
let timeoutDuration = 60 * 1000;
let timeoutDurationId = null;

logInformation(`isDebug: ${inDebugMode}`);
logInformation(`isPersistent: ${isPersistent}`);

(function (addElement, observe) {
    observe(observePage);
})(addElement, observe);

function observe(callback) {
    let state = {
        id: null,
        startCharacterCount: null,
        startTime: null,
        totalCharsRead: null,
        readingDurationInMs: null
    };

    let domElements = {
        readSpeedElement: null,
        node: null
    }

    const sessionStorageKey = 'readSpeedStatistics';
    let persistentState = null;
    if (isPersistent) {
        persistentState = JSON.parse(window.sessionStorage.getItem(sessionStorageKey)) || {
            version: 1,
            createdAt: Date.now(),
            state: null
        };
    }

    const bodyElement = document.querySelector('body');
    let totalPauseDuration = 0;
    let pause = null;
    const helpers = {
        getNode: () => domElements.node,
        getReadSpeedElement: () => domElements.readSpeedElement,
        getCurrentId: () => window.location.href,
        now: () => Date.now(),
        pause: () => {
          pause = helpers.now(),
          domElements.readSpeedElement.style.color = 'red';
        },
        pauseTime: () => totalPauseDuration,
        continue: () => {
          if (!pause) {
            return;
          }

          totalPauseDuration += helpers.now() - pause;
          pause = null;
          domElements.readSpeedElement.style.color = 'inherit';
        },
        isPause: () => false,
        getCurrentCharCount: () => parseInt(domElements.node.innerText.split('/').shift().trim())
    };
    const bodyObserver = new MutationObserver((mutations) => {
        logDebug('Mutations observed', mutations);
        if (!mutations || !mutations.find) {
            logDebug('Ignore observation. Mutations are not of type array');
            return;
        }

        const didTextUpdate = mutations.find((mutation) => mutation.type === 'characterData');
        if (!didTextUpdate) {
            logDebug('Ignore observation. No text update occured');
            return;
        }

        domElements.node = getProgressStatisticElement();
        if (!domElements.node) {
            logDebug('Ignore observation. Progress element not found');
            return;
        }

        if (!domElements.readSpeedElement || !domElements.node.contains(domElements.readSpeedElement)) {
            logDebug('Creating readSpeedElement');
            domElements.readSpeedElement = addElement(domElements.node, 'div');
        }

        if (isPersistent && persistentState && persistentState.state) {
            const currentCharsRead = persistentState.state.startCharacterCount + persistentState.state.totalCharsRead;
            if (persistentState.state.id === helpers.getCurrentId() && currentCharsRead === helpers.getCurrentCharCount()) {
                logInformation('Hydrate state', persistentState);
                state = persistentState.state;
            }
        }

        logDebug('Start of callback', state);
        state = callback(state, helpers);
        logDebug('End of callback', state);

        logDebug('Display results');
        view(state, helpers);
        logDebug('Done displaying results');

        if (isPersistent) {
            window.sessionStorage.setItem(sessionStorageKey, JSON.stringify({
                ...persistentState,
                state: state
            }));
        }

    });

    window.addEventListener('keydown', async function(e) {
      if (e.code === 'KeyC' && e.ctrlKey) {
        let text = helpers.getNode().innerText;
        await navigator.clipboard.writeText(text);
      }

      if (e.code === 'KeyP' && e.ctrlKey) {
        helpers.pause();
      }
    });

    /*
     * start observing on the body and it's child elements
     * characterData makes sure the observer detects text changes
     * which is required to detect progress changes
     */
    bodyObserver.observe(bodyElement, { subtree: true, childList: true, characterData: true });

    return () => bodyObserver.disconnect()
}

function addElement(node, tag) {
    // make the script available with and without userscript extension
    if (window && window.GM_addElement) {
        logInformation('Using GM_addElement');
        return GM_addElement(node, tag);
    }

    logInformation('Using document.createElement');
    let createdElement = document.createElement(tag);
    node.appendChild(createdElement);

    return createdElement;
}

function observePage(state, helpers) {
    const newState = { ...state };
    const newTimestamp = helpers.now();
    const id = helpers.getCurrentId();
    const currentCharsRead = helpers.getCurrentCharCount();
    if (newState.startCharacterCount === null || newState.startTime === null || newState.id !== id) {
        logInformation('Initialize state');
        newState.id = id;
        newState.startCharacterCount = currentCharsRead;
        newState.startTime = helpers.now();
        newState.totalCharsRead = 0;
    }
    window.clearTimeout(timeoutDurationId);
    timeoutDurationId = window.setTimeout(() => {
      helpers.pause();
    }, timeoutDuration);
    helpers.continue();
  console.log('continue');

    newState.readingDurationInMs = helpers.now() - helpers.pauseTime() - newState.startTime;
    newState.totalCharsRead = currentCharsRead - newState.startCharacterCount;

    return newState;
}

function view(state, helpers) {
    const readSpeedElement = helpers.getReadSpeedElement();
    const oneMinuteInMs = 60 * 1000;
    const readDuration = state.readingDurationInMs / oneMinuteInMs / 60;
    const readCharacters = state.totalCharsRead;
    const charsPerHour = Math.max(Math.floor(readCharacters / readDuration), 0);
    const text = `${msToTime(state.readingDurationInMs)} (${charsPerHour}/hr) ${readCharacters}`;
    if (readSpeedElement.innerText === text) {
        logInformation('Skip updating view as text did not change');
        return;
    }

    readSpeedElement.innerText = text;
}

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return `${padNumber(hours, 2)}:${padNumber(minutes, 2)}:${padNumber(seconds, 2)}`;
}

function padNumber(number, length) {
    return number.toString().padStart(length, '0');
}

function getProgressStatisticElement() {
    // try find the progress statistic element based on a custom data attribute
    let node = document.querySelector('div[data-target="progress"]');
    if (node) {
        return node;
    }

    // fall back on xpath
    let divs = document.evaluate("//div[contains(., '%')]", document, null, XPathResult.ANY_TYPE, null);
    if (!divs) {
        return;
    }

    while (node = divs.iterateNext()) {
        if (Array.from(node.children).length === 0 && node.textContent?.length > 0) {
            node.dataset.target = "progress";
            return node;
        }
    }
}

function logDebug(...messages) {
    if (inDebugMode && console && console.log) {
        console.group();
        messages.forEach((message) => {
            console.log(message)
        })
        console.groupEnd();
    }
}

function logInformation(message) {
    if (console && console.log) {
        console.log(message);
    }
}
