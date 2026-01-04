
// ==UserScript==

// @name         Video Autoplay

// @namespace    https://www.oba.gov.tr/

// @version      1.0

// @description  Autoplay educational videos with specific durations

// @author       nazmanya

// @match        https://www.oba.gov.tr/*

// @grant        none

// @run-at       document-end

// @require      http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/522025/Video%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/522025/Video%20Autoplay.meta.js
// ==/UserScript==

 

(function() {

    'use strict';

 

    // Define all videos with their durations and IDs

    const videos = [

        { id: 19525, duration: 12 * 60 + 15 },

        { id: 19526, duration: 12 * 60 + 59 },

        { id: 19527, duration: 12 * 60 + 4 },

        { id: 19528, duration: 10 * 60 + 47 },

        { id: 19529, duration: 13 * 60 + 17 },

        { id: 19530, duration: 16 * 60 + 31 },

        { id: 19531, duration: 9 * 60 + 46 },

        { id: 19532, duration: 15 * 60 + 6 },

        { id: 19533, duration: 14 * 60 + 57 },

        { id: 19534, duration: 11 * 60 + 2 },

        { id: 19535, duration: 17 * 60 + 21 },

        { id: 19536, duration: 8 * 60 + 57 },

        { id: 19537, duration: 11 * 60 + 3 },

        { id: 19538, duration: 9 * 60 + 23 },

        { id: 19539, duration: 10 * 60 + 44 },

        { id: 19540, duration: 13 * 60 + 42 },

        { id: 19541, duration: 14 * 60 + 47 },

        { id: 19542, duration: 16 * 60 + 28 },

        { id: 19543, duration: 11 * 60 + 48 },

        { id: 19544, duration: 8 * 60 + 34 },

        { id: 19545, duration: 15 * 60 + 3 },

        { id: 19546, duration: 13 * 60 + 11 },

        { id: 19547, duration: 12 * 60 + 29 },

        { id: 19548, duration: 12 * 60 + 57 },

        { id: 19549, duration: 12 * 60 + 34 },

        { id: 19550, duration: 12 * 60 + 5 },

        { id: 19551, duration: 11 * 60 + 53 },

        { id: 19552, duration: 12 * 60 + 11 },

        { id: 19553, duration: 10 * 60 + 42 },

        { id: 19554, duration: 3 * 60 + 44 },

        { id: 19555, duration: 13 * 60 + 52 },

        { id: 19556, duration: 14 * 60 + 17 },

        { id: 19557, duration: 11 * 60 + 22 },

        { id: 19558, duration: 12 * 60 + 5 },

        { id: 19559, duration: 13 * 60 + 33 },

        { id: 19560, duration: 10 * 60 + 38 },

        { id: 19561, duration: 8 * 60 + 48 },

        { id: 19562, duration: 13 * 60 + 30 },

        { id: 19563, duration: 18 * 60 + 10 },

        { id: 19564, duration: 16 * 60 + 55 },

        { id: 19565, duration: 10 * 60 + 36 },

        { id: 19566, duration: 11 * 60 + 18 },

        { id: 19567, duration: 13 * 60 + 10 },

        { id: 19568, duration: 17 * 60 + 46 },

        { id: 19569, duration: 16 * 60 + 10 },

        { id: 19570, duration: 15 * 60 + 47 },

        { id: 19571, duration: 14 * 60 + 38 },

        { id: 19572, duration: 22 * 60 + 22 },

        { id: 19573, duration: 20 * 60 + 42 },

        { id: 19574, duration: 15 * 60 + 42 },

        { id: 19575, duration: 15 * 60 + 40 },

        { id: 19576, duration: 18 * 60 + 13 },

        { id: 19577, duration: 15 * 60 + 49 },

        { id: 19578, duration: 18 * 60 + 20 },

        { id: 19579, duration: 15 * 60 + 41 },

        { id: 19580, duration: 18 * 60 + 38 },

        { id: 19581, duration: 17 * 60 + 57 },

        { id: 19582, duration: 14 * 60 + 12 },

        { id: 19583, duration: 9 * 60 + 26 },

        { id: 19584, duration: 14 * 60 + 44 },

        { id: 19585, duration: 10 * 60 + 6 },

        { id: 19586, duration: 12 * 60 + 31 },

        { id: 19587, duration: 18 * 60 + 2 },

        { id: 19588, duration: 17 * 60 + 19 },

        { id: 19589, duration: 15 * 60 + 24 },

        { id: 19590, duration: 15 * 60 + 43 },

        { id: 19591, duration: 10 * 60 + 40 },

        { id: 19592, duration: 14 * 60 + 46 },

        { id: 19593, duration: 9 * 60 + 20 },

        { id: 19594, duration: 16 * 60 + 21 },

        { id: 19595, duration: 9 * 60 + 33 },

        { id: 19596, duration: 15 * 60 + 21 },

        { id: 19597, duration: 11 * 60 + 20 },

        { id: 19598, duration: 12 * 60 + 38 },

        { id: 19599, duration: 17 * 60 + 42 },

        { id: 19600, duration: 11 * 60 + 31 },

        { id: 19601, duration: 14 * 60 + 58 },

        { id: 19602, duration: 15 * 60 + 29 },

        { id: 19603, duration: 15 * 60 + 10 },

        { id: 19604, duration: 16 * 60 + 20 }

    ];

 

    // Extract current video ID from the URL

    const currentUrl = window.location.href;

    const currentVideoId = parseInt(currentUrl.match(/\/(\d+)$/)?.[1]);

 

    // Find the index of the current video

    const currentIndex = videos.findIndex(video => video.id === currentVideoId);

 

    if (currentIndex >= 0) {

        $(document).ready(function() {

            setTimeout(() => {

                $('.vjs-big-play-button').click();

                window.onblur = () => {};

            }, 1000);

 

            setTimeout(() => {

                const nextVideo = videos[currentIndex + 1];

                if (nextVideo) {

                    document.location.href = `https://www.oba.gov.tr/egitim/oynatma/basogretmenlik-uzaktan-egitim-semineri-meb-personeli-2024-1146/${nextVideo.id}`;

                }

            }, videos[currentIndex].duration * 1000);

        });

    }

})();

