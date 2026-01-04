// ==UserScript==
// @name         YouTube Stereo Audio Fix (Fix one-ear audio)
// @namespace    Balance_Audio
// @version      1.3
// @description  Force YouTube audio to play equally in both ears
// @author       ZORO_KSA
// @match        *://www.youtube.com/*
// @grant        none
// @license      CC BY-NC 4.0; http://creativecommons.org/licenses/by-nc/4.0/
// @downloadURL https://update.greasyfork.org/scripts/500123/YouTube%20Stereo%20Audio%20Fix%20%28Fix%20one-ear%20audio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500123/YouTube%20Stereo%20Audio%20Fix%20%28Fix%20one-ear%20audio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function balanceAudio() {
        const video = document.querySelector('video');
        if (!video) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const gainNode = audioContext.createGain();
        const splitter = audioContext.createChannelSplitter(2);
        const merger = audioContext.createChannelMerger(2);

        source.connect(splitter);
        splitter.connect(gainNode, 0);
        splitter.connect(gainNode, 1);
        gainNode.connect(merger, 0, 0);
        gainNode.connect(merger, 0, 1);
        merger.connect(audioContext.destination);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                balanceAudio();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    balanceAudio();
})();