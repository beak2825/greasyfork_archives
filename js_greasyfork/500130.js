// ==UserScript==
// @name         Cancer skiper.
// @namespace    http://tampermonkey.net/
// @version      2024-05-04
// @description  Auto skip if the video's likes number is less than 1000.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500130/Cancer%20skiper.user.js
// @updateURL https://update.greasyfork.org/scripts/500130/Cancer%20skiper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let check_and_skip = (__videoID__, __apiKEY__) => {
        const videoId = __videoID__;
        const apiKey = __apiKEY__;

        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
            const likes = data.items[0].statistics.likeCount;
            if (likes <= 1000) {
                //then skip video
                [...document.querySelectorAll(".yt-spec-touch-feedback-shape")].slice(-1)[0].click()
            };
        })
            .catch(error => console.error('Une erreur s\'est produite : ', error));
    };

    let currentURL = null;

    setInterval(() => {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            check_and_skip(currentURL.split("/").slice(-1)[0], 'AIzaSyDSNCRK7Qu8yOlJd7GXB_voTKDXk8H1ydY');
        };
    }, 100);
})();