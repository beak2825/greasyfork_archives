// ==UserScript==
// @name            Redgifs tweaks for phone
// @match           https://www.redgifs.com/ifr/*
// @match           https://www.redgifs.com/watch/*
// @match           https://old.reddit.com/*
// @match           https://www.reddit.com/*
// @version         0.0.3
// @author          peace
// @description     tweaks redgifs for smartphone
// @license         MIT
// @namespace https://greasyfork.org/users/1430832
// @downloadURL https://update.greasyfork.org/scripts/525741/Redgifs%20tweaks%20for%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/525741/Redgifs%20tweaks%20for%20phone.meta.js
// ==/UserScript==
'use strict';

const touch = new TouchEvent('touchend', { bubbles: true, cancelable: true });
const click = new MouseEvent('click', { bubbles: true, cancelable: true });

function buttonClick(button) {
   button?.dispatchEvent(click);
}

const handleVideo = (e) => {
    e.preventDefault();

    const video = e.target
    if (video) video.paused ? video.play() : video.pause();
}

function preventOpenLink(element) {
    element.addEventListener('touchend', handleVideo);
}

const observer = new MutationObserver(mutations => {
    const video = document.querySelector("video[src]:not([processed])");
    if (!video) return;
    video.setAttribute('processed', '');

    preventOpenLink(video);

    const qualityButton = document.querySelector('.button:has([d^="M1 12C1"])');
    buttonClick(qualityButton);

    ['#shareButton', '.logo'].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});