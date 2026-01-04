// ==UserScript==
// @name         Threads.net Quick Block
// @namespace    http://timberjustinlake.example.com/
// @version      2024-02-24
// @description  Adds a button to a threads profile page that automates the multi click process of blocking someone.
// @author       Timber Justinlake
// @match        https://www.threads.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487120/Threadsnet%20Quick%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/487120/Threadsnet%20Quick%20Block.meta.js
// ==/UserScript==
'use strict';
/**
 * Main body, adds quick block button to profile pages if user not already blocked
 */
async function initQuickBlock() {
    if (!/\/@[^\/]*$/.test(window.location.pathname)) {
        // console.debug(`[tbq] not on profile page`);
        return ;
    }

    // console.debug('[tbq] Initializing...');
    if (document.getElementById('tj-quick-block')) {
        // console.debug('[tbq] Already Initialized');
        return;
    }

    let controlButton;
    try {
        controlButton = await findProfileControls();
    } catch(err) {
        return // console.debug(`[tbq] Aborting. (${err})`);
    }

    // console.debug('[tbq] found for mention/follow button, adding quick block button');
    const quickBlockButton = controlButton.cloneNode(true);
    quickBlockButton.querySelector('div').innerText = 'QB';
    quickBlockButton.id = 'tj-quick-block';
    quickBlockButton.style.backgroundColor = 'red';
    quickBlockButton.addEventListener('click', blockUser);
    // console.debug('[tbq] appending quickblock');
    controlButton.parentNode.appendChild(quickBlockButton);
}

/**
 * Watches for React initiated page changes and if it detects you're on a user profile
 */
function watchForPageChange() {
    function debounce(func) {
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), 300);
        };
    }

    // debounce to wait for page to settle before checking
    const addQuickBlock = debounce((mutations, me) => { initQuickBlock(); });

    // set up the mutation observer
    const observer = new MutationObserver(addQuickBlock);

    // to keep things performant we're selecting a single element to watch mutations for that is known to mutate on page change
    const elToWatch = document.querySelector('header').previousElementSibling;

    // start observing
    observer.observe(elToWatch, {
        childList: true,
        attributes: true,
        subtree: false
    });
}

/**
 * Waits for element on selector to exist, checks if element contains text if provided
 * @returns {Promise<HTMLElement>} element matching selector
 */
function waitForElm(selector, text) {
    // console.debug(`[tbq] setting up mutationobserver for element: ${selector}, ${text}`);
    return new Promise((resolve, reject) => {
        let tid;
        function getEl() {
            // console.debug(`[tbq] checking for element: ${selector}, ${text}`);
            const els = [...document.querySelectorAll(selector)];

            if (!text) return el[0];

            return els.filter(el => el.innerText.toLowerCase() === text.toLowerCase())[0];
        }

        const el = getEl();
        if (el) {
            // console.debug(`[tbq] already found element; ${selector}, ${text}`);
            return resolve([null, el]);
        }

        const observer = new MutationObserver(mutations => {
            const el = getEl();

            if (el) {
                // console.debug(`[tbq] Found element, disconnecting mutationobserver for element: ${selector}, ${text}`);
                clearTimeout(tid);
                observer.disconnect();
                resolve([null, el]);
            }
        });

        // console.debug(`[tbq] setting up mutation observer for ${selector}, ${text}`);
        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        tid = setTimeout(() => {
            observer.disconnect();
            resolve([new Error('[tbq] Timed out looking for element')]);
        }, 500);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

/**
 * React requires you to focus -> click -> blur elements to emulate a click event
 */
function clickButton(el) {
    el.focus();
    el.click();
    el.blur();
}

/**
 * Relevant buttons for blocking are behind "dialogs" that popup so this will wait for the element to be present.
 * @param {string} the button label to find.
 */
async function clickDialogItem(waitForLabel, clickLabel) {
    const selector = '[role="dialog"] [role="button"]'

    const [elErr, el] = await waitForElm(selector, waitForLabel);
    if (elErr) throw elErr;

    const button = [...document.querySelectorAll(selector)].filter(el => el.innerText === (clickLabel || waitForLabel))[0]
    clickButton(button);
}

/**
 * Sequence to automate blocking user when QB button is clicked.
 */
async function blockUser() {
    try {
        // console.debug(`[tbq] blocking user...`);
        const svg = [...document.querySelectorAll('[aria-label="More"]')].filter(el => !el.closest('header'))[0];
        const moreButton = svg.closest('[role="button"]');
        clickButton(moreButton);

        await clickDialogItem('Block');
        // Cancel button is best way to distinguish between More menu and Block dialog
        await clickDialogItem('Cancel', 'Block');

        const quickBlockButton = document.getElementById('tj-quick-block');
        quickBlockButton.removeEventListener('click', blockUser);
        quickBlockButton.style.backgroundColor = '#3d0000';
        quickBlockButton.style.cursor = 'not-allowed';
        quickBlockButton.title = 'Already blocked';
    } catch(err) {
        // console.debug(`[tbq] was unable to block user: ${err}`);
    }
}

/**
 * Finds the appropriate location to place the quick block button
 */
async function findProfileControls() {
    // console.debug(`[tbq] checking if already blocked...`);
    const [_ub, unblockButton] = await waitForElm('[role="button"]', 'Unblock');
    if (unblockButton) throw new Error('Already blocked');

    // console.debug('[tbq] waiting for mention button...');
    const [_mb, mentionButton] = await waitForElm('[role="button"]', 'Mention');
    if (mentionButton) return mentionButton;

    // console.debug(`[tbq] User doesn't allow non-follers to metion so find the follow button`);

    const [followErr, followButton] = await waitForElm('[role="button"]', 'Follow');
    if (followErr) throw followErr;

    return followButton;
}

(async function() {
    'use strict';
    initQuickBlock();
    watchForPageChange();
})();