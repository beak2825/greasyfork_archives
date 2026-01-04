// ==UserScript==
// @name                (Instagram)Enable standard video controls
// @namespace           https://greasyfork.org/users/821661
// @match               https://www.instagram.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @run-at              document-start
// @version             1.3
// @author              hdyzen
// @description         enable standard video controls
// @license             GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/508188/%28Instagram%29Enable%20standard%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/508188/%28Instagram%29Enable%20standard%20video%20controls.meta.js
// ==/UserScript==
'use strict';

const getVolume = () => GM_getValue('volume', 0);

const cantAddControls = () => !(window.location.pathname.startsWith('/stories/') || window.location.pathname.startsWith('/reels/'));

const videosHandler = videosEl => {
    for (const video of videosEl) {
        const videoNextSibling = video.nextElementSibling;
        const poster = videoNextSibling.querySelector('img[src]');
        const mButton = videoNextSibling.querySelector('button:has([d^="M1.5 13."])');

        video.setAttribute('controls', '');
        mButton?.click();
        video.volume = getVolume();

        video.addEventListener('volumechange', e => {
            GM_setValue('volume', video.volume);
        });

        if (poster) video.setAttribute('poster', poster.src);
        videoNextSibling.style.display = 'none';
    }
};

const mutationsHandler = mutations => {
    const videosEl = document.querySelectorAll('video[src]:not([controls])');
    if (videosEl.length && cantAddControls()) {
        videosHandler(videosEl);
    }
};

const observer = new MutationObserver(mutationsHandler);

observer.observe(document.documentElement, { childList: true, subtree: true });
