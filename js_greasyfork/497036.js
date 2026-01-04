// ==UserScript==
// @name         ANSI MOOC Accelerator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Accelerate ANSI MOOC's videos to x16
// @author       SH4DOW4RE
// @match        *://secnumacademie.gouv.fr/moodle/mod/scorm/player.php*
// @icon         https://secnumacademie.gouv.fr/resources/assets/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497036/ANSI%20MOOC%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/497036/ANSI%20MOOC%20Accelerator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const iframe0 = document.querySelectorAll("iframe");
        for (let a = 0; a < iframe0.length; a++) {
            const frame0 = iframe0[a];
            try {
                const iframe1 = frame0.contentWindow.document.querySelectorAll("iframe");
                for (let b = 0; b < iframe0.length; b++) {
                    const frame1 = iframe1[b];
                    try {
                        const iframe2 = iframe1.contentWindow.document.querySelectorAll("iframe");
                        for (let c = 0; c < iframe0.length; c++) {
                            const frame2 = iframe2[c];
                            const videos2 = frame2.contentWindow.document.querySelectorAll("video");

                            for (let i = 0; i < videos2.length; i++) {
                                const video2 = videos2[i];
                                video2.playbackRate = 16;
                            }
                        }
                    } catch (e) {}
                    const videos1 = frame1.contentWindow.document.querySelectorAll("video");

                    for (let i = 0; i < videos1.length; i++) {
                        const video1 = videos1[i];
                        video1.playbackRate = 16;
                    }
                }
            } catch (e) {}
            const videos = frame0.contentWindow.document.querySelectorAll("video");

            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                video.playbackRate = 16;
            }
        }
        const videos = document.querySelectorAll("video");

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            video.playbackRate = 16;
        }
    }, 500);

})();