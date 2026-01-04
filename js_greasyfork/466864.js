// ==UserScript==
// @name         Autopause
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Pause videos playing in background tabs when a video starts playing in the foreground tab
// @author       Kirill Skliarov
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466864/Autopause.user.js
// @updateURL https://update.greasyfork.org/scripts/466864/Autopause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    start();

    function start() {
        const channel = new BroadcastChannel('AutoPauseInBackgroundTabWhenVideoPlayed');
        const onMessage = () => {
            pauseAllVideos();
        };
        channel.addEventListener('message', onMessage);

        const onPlay = (event) => {
            const video = event.target;
            let postMsg = () => {
                const isHasSound = hasSound(video);
                if (isHasSound) {
                    channel.postMessage(null);
                }
            };
            if (video.readyState === 4 || video.readyState === 2) {
                postMsg();
            } else {
                video.addEventListener('loadeddata', postMsg);
            }
        };

        const onMutate = () => reAttachEventListeners();
        const observer = new MutationObserver(onMutate);
        const config = { attributes: false, childList: true, subtree: true };
        observer.observe(document.body, config);

        function reAttachEventListeners() {
            getAllVideos().forEach(video => {
                video.addEventListener('play', onPlay);
            });
        }

        function getAllVideos() {
            return document.querySelectorAll('video');
        }

        function pauseAllVideos() {
            getAllVideos().forEach(video => video.pause());
        }

        function hasAudio(video) {
            return (video.mozHasAudio ||
                !!video.webkitAudioDecodedByteCount ||
                (video.audioTracks ? (video.audioTracks.length > 0) : false));
        }

        function hasSound(video) {
            return hasAudio(video) && video.volume > 0 && !video.muted;
        }
    }
})();
