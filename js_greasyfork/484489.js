// ==UserScript==
// @name               YouTube - Display current volume
// @namespace          https://greasyfork.org/users/1142347
// @version            1.0
// @description        Displays the volume when it's changing.
// @description:fr     Affiche le volume lorsqu'il change.
// @description:de     Geeft het volume weer als het verandert.
// @description:it     Visualizza il volume quando sta cambiando.
// @description:zh-CN  显示变化时的音量。
// @author             Caassiiee
// @match              https://www.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant              none
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/484489/YouTube%20-%20Display%20current%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/484489/YouTube%20-%20Display%20current%20volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previousVolume = -1;

    function displaySquareVolume() {
        const player = document.getElementById('movie_player');
        const currentVolume = player.getVolume();

        if (currentVolume !== previousVolume) {
            previousVolume = currentVolume;
            const squareVolume = document.querySelectorAll('div[data-layer="4"]');
            squareVolume.forEach((div) => {
                if(div.className === 'ytp-bezel-text-hide') {
                    div.classList.remove('ytp-bezel-text-hide');
                }
                if (div.classList.length === 0) {
                    const ytpBezelTextWrapper = div.querySelector('.ytp-bezel-text-wrapper');
                    const ytpBezelText = ytpBezelTextWrapper.querySelector('.ytp-bezel-text');
                    const ytpBezel = div.querySelector('.ytp-bezel');
                    div.style.display = 'block';

                    if (ytpBezelText && ytpBezel) {
                        ytpBezelText.innerText = currentVolume + "%";
                        ytpBezel.style.display = 'none';
                    }

                    setTimeout(()=> {
                        div.style.display = 'none';
                    }, 500);
                }
            });
        }
    }

    function checkVideoExists() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('volumechange', displaySquareVolume);
            previousVolume = videoElement.volume * 100;
        }
    }

    const observer = new MutationObserver(checkVideoExists);
    const body = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(body, config);
})();