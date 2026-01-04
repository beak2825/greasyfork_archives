// ==UserScript==
// @name        JanitorAI reroll counter
// @match       https://janitorai.com/chats/*
// @version     0.1
// @description JanitorAI regenerate response UI
// @grant       none
// @license     MIT
// @namespace   https://greasyfork.org/users/1256538
// @downloadURL https://update.greasyfork.org/scripts/532300/JanitorAI%20reroll%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/532300/JanitorAI%20reroll%20counter.meta.js
// ==/UserScript==

const dialogueSelector = 'div:has(> div[data-index])';
const lastResponseSelector = 'div[data-index]:has(button[aria-label="Right"])';
const responseListSelector = 'div[data-index]:has(button[aria-label="Right"]) div:has(> li)';

let Logger = {
    log: function(message) {
        console.log("JanitorAI User Script:", message);
    }
}

async function waitForEl(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        new MutationObserver((records, observer) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        })
        .observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function onRemove(element, callback) {
    new MutationObserver((records, observer) => {
        for (const record of records) {
            for (const removedEl of record.removedNodes) {
                if (removedEl === element) {
                    observer.disconnect();
                    callback();
                }
            }
        }
    })
    .observe(element.parentNode, { childList: true });
}

function createResponseCountsEl(responseListEl) {
    responseListEl.childNodes.forEach((responseEl, index, responseEls) => {
        let responseCountEl = document.createElement('div');
        responseCountEl.innerText = `(${index + 1}/${responseEls.length})`;
        responseCountEl.className = "response-count";
        responseCountEl.style.position  = "absolute";
        responseCountEl.style.bottom    = "0";
        responseCountEl.style.left      = "50%";
        responseCountEl.style.transform = "translate(-50%, 0)";
        responseCountEl.style.color     = "rgba(255, 255, 255, 0.565)";
        responseEl.appendChild(responseCountEl);
    });
}

function onLastResponseExist() {
    // Wait for last response to exist
    waitForEl(responseListSelector).then((responseListEl) => {
        // Initialize response counts
        createResponseCountsEl(responseListEl);

        // Regenerate response counts when new response is created
        let responseListObserver = new MutationObserver((records, observer) => {
            responseListEl
                .querySelectorAll(".response-count")
                .forEach(el => el.remove());
            createResponseCountsEl(responseListEl);
        })
        .observe(responseListEl, { childList: true });

        // Re-apply onLastResponseExist() when:
        // - Dialogue is pushed forward
        // - Scrolled far top removing latest response
        new MutationObserver((records, observer) => {
            responseListEl.querySelectorAll(".response-count")
                .forEach(el => el.remove());
            observer.disconnect();
            responseListObserver?.disconnect();
            onLastResponseExist();
        })
        .observe(document.querySelector(dialogueSelector), { childList: true });
    })
}

onLastResponseExist();