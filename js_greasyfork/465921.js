// ==UserScript==
// @name         Watchable Shorts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a link to every short video to watch it in the traditional video player
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465921/Watchable%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/465921/Watchable%20Shorts.meta.js
// ==/UserScript==
console.log("Watch initialized");

const shortListId = '#shorts-inner-container';
const action = document.createElement('div');

action.innerHTML = `
  <a href=""
    class="watch-link"
    style="
      color: white;
      text-decoration: none;
      margin-top: 10px;
      display: block;
      padding: 5px;
      border-radius: 3px;
      border: 1px solid white;
    "
  >watch</a>
`;

main();
observeUrlChange();

function observeUrlChange() {
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                main();
            }
        });
    });
    observer.observe(body, { childList: true, subtree: true });
};

async function main() {
    if (!window.location.href.includes('shorts')) {
        return;
    }

    const shortList = await waitForElm(shortListId);

    if (!shortList) {
        return;
    }

    [...shortList.children].forEach(child => addActionToChild(child));
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(child => addActionToChild(child));
        });
    });
    observer.observe(shortList, { childList: true });
}

function addActionToChild(child) {
    const actions = child.querySelector?.('#actions');
    if (!actions) {
        return;
    }

    addAction(actions, child);
}

function addAction(actions, child) {
    observeActions(actions, child);

    if (actions.querySelector('.watch-link')) {
        return;
    }

    const clone = action.cloneNode(true);
    const link = clone.querySelector('a');

    const likeButton = child.querySelector('ytd-like-button-renderer');
    const data = JSON.parse(likeButton.getAttribute('like-button'));
    const videoId = data?.defaultServiceEndpoint?.likeEndpoint?.target?.videoId;

    if (!videoId) {
        return;
    }

    const url = 'https://www.youtube.com/watch?v=' + videoId;
    link.href = url;

    actions.appendChild(clone);
}

function observeActions(actions, child) {
    const observer = new MutationObserver(mutations => {
        addAction(actions, child);
    });
    observer.observe(actions, { childList: true, subtree: true });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}