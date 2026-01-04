// ==UserScript==
// @name         Kbin Kibby Avatars
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Displays a Kibby icon as the default for people with no avatars set.
// @author       minnieo
// @match        https://kbin.social/*
// @icon         https://minnie.untone.uk/kibpfps/kib1.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470285/Kbin%20Kibby%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/470285/Kbin%20Kibby%20Avatars.meta.js
// ==/UserScript==

const pref = 'https://minnie.untone.uk/kibpfps/kib'
const max = 25;

const commentSection = document.querySelector('section.comments.entry-comments.comments-tree');
const noAvatarElements = Array.from(commentSection.querySelectorAll('div.no-avatar'));

const filledUsers = {}

noAvatarElements.forEach((defaultAvatar) => {
    let assignedAvatar;
    const username = defaultAvatar.parentElement.href.split('/')[4]
    if (filledUsers[username]) {
        assignedAvatar = filledUsers[username];
    } else {
        const randomIndex = Math.floor(Math.random() * max) + 1;
        assignedAvatar = randomIndex
        filledUsers[username] = assignedAvatar;

    }
    const kibbyAvatar = document.createElement('img');
    kibbyAvatar.alt = 'Default avatar';
    kibbyAvatar.src = pref + assignedAvatar + '.png';
    kibbyAvatar.style.cssText = `
        max-width: 40px;
        max-height: 40px;
    `;
    defaultAvatar.parentNode.replaceChild(kibbyAvatar, defaultAvatar);
});
