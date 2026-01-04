// ==UserScript==
// @name         GMail Refresh Icon Always Visible
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes Refresh button in GMail always visible in split screen mode
// @author       denisab85
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445592/GMail%20Refresh%20Icon%20Always%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/445592/GMail%20Refresh%20Icon%20Always%20Visible.meta.js
// ==/UserScript==


const BTN_SELECTOR = "[title='Refresh'],[data-tooltip='Refresh']";
const buttonAddedObserver = new MutationObserver(onMutation);
var btnRefresh;

(function() {
    'use strict';
    starter();
})();

function starter() {
    // in case the content script was injected after the page is partially loaded
    onMutation([{addedNodes: [document.documentElement]}]);
    observe();
}

function onMutation(mutations) {
    let stopped;
    for (const {addedNodes} of mutations) {
        for (const node of addedNodes) {
            if (node.tagName) {
                if (node.matches(BTN_SELECTOR) || node.firstElementChild && node.querySelector(BTN_SELECTOR)) {
                    stopped = true;
                    buttonAddedObserver.disconnect();
                    btnRefresh = document.querySelector(BTN_SELECTOR).parentElement;
                    console.log('Refresh button added. Adding btnRefreshObserver');
                    let btnRefreshObserver = new MutationObserver(btnRefreshCallback);
                    btnRefreshObserver.observe(btnRefresh, { attributes: true });
                }
            }
        }
    }
    if (stopped) observe();
}

function observe() {
    buttonAddedObserver.observe(document, {
        subtree: true,
        childList: true,
    });
}

function btnRefreshCallback(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'attributes' && btnRefresh.style.display !== '') {
            console.log('Mutation Detected');
            btnRefresh.style='';
        }
    }
}