// ==UserScript==
// @name         Just Vanish
// @namespace    https://www.ozbargain.com.au/
// @version      2024-03-21.2
// @description  Actually hides user's posts
// @author       ozbargainsam
// @match        https://www.ozbargain.com.au/node/*
// @match        https://www.ozbargain.com.au/live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozbargain.com.au
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490404/Just%20Vanish.user.js
// @updateURL https://update.greasyfork.org/scripts/490404/Just%20Vanish.meta.js
// ==/UserScript==

let prefs = {
    hideUsers: [
        'username you no longer want to see in forums or live',
        'add as many usernames as you wish',
        'you will not see them or replies to them',
    ],

    // hide all hidden users. Overrides the hideUserIds below
    hideAllBlockedUsers: true,

    // if you use the 'hide user' function, you'll also need to add the user's ID profile URL
    hideUserIds: [
        '00000'
    ]
};

(function() {
    'use strict';

    init();

    if (location.pathname.includes('live')) {
        addLiveSupport();
        return;
    }

    // get all the comment element's username tag
    [...document.querySelectorAll('.comment .submitted a')].forEach(processComment);

    // hide the hidden users' comments, too
    [...document.querySelectorAll('.comment.hidden.blocked')].forEach(processHiddenComment);
})();

function processComment(c) {
    const username = c.textContent.trim();

    if (prefs.hideUsers.includes(username)) {
        c.closest('.comment-wrap').parentNode.classList.add('sb-hide');
    }
}

function processHiddenComment(c) {
    const userId = c.getAttribute('data-uid');

    if (prefs.hideAllBlockedUsers || prefs.hideUserIds.includes(userId)) {
        c.closest('.comment-wrap').parentNode.classList.add('sb-hide');
    }
}

function addLiveSupport() {
    const targetNode = document.getElementById('livebody');
    const observer = new MutationObserver((mutationList, observer) => {
        mutationList.forEach(ml => {
            ml.addedNodes.forEach(processLiveEntry);
        });
    });

    observer.observe(targetNode, { childList: true });
}

function processLiveEntry(tr) {
    const entry = tr.querySelector('td:nth-child(2) a');
    const username = entry.textContent.trim();

    if (prefs.hideUsers.includes(username)) {
        tr.classList.add('sb-hide');
    }
}

/* not in use yet
function loadPreferences() {
    if (!window.localStorage) return;

    prefs = JSON.parse(localStorage.getItem('sbjv-prefs') || '{}');
}

function setPreference(key, value) {
    if (!window.localStorage) return;

    prefs[key] = value;

    localStorage.setItem('sbjv-prefs', JSON.stringify(prefs));
}
*/

function init() {
    addStyles();
    addElements();
}

function addStyles() {
    const styl = document.createElement('style');

    styl.textContent = `
        .sb-hide {
            background-color: red;
            display: none;
        }
    `;

    document.body.appendChild(styl);
}

function addElements() {

}