// ==UserScript==
// @name         iNaturalist Spectrogram
// @namespace    https://greasyfork.org/users/170755
// @version      2024-01-26
// @description  Add a spectrogram to iNaturalist audio
// @author       w_biggs
// @match        https://www.inaturalist.org/observations/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/w-biggs/spectrogramJS@68733ac9f61f21dd21ec9b0f4c5727c9da8a5bb4/js/spectrogram.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js
// @require      https://cdn.jsdelivr.net/gh/stdlib-js/stats-base-dists-beta-cdf@48e844d06dc88c834ac95568af5207d56438297a/browser.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482904/iNaturalist%20Spectrogram.user.js
// @updateURL https://update.greasyfork.org/scripts/482904/iNaturalist%20Spectrogram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const spectrogramCSS = `
    .spectrogram canvas, .spectrogram svg {
        position: absolute;
        top: 0;
        left: 0;
    }

    .spectrogram {
        position: relative;
        color: black;
        pointer-events: auto;
    }

    .axis {
        font: 14px sans-serif;
    }

    .axis path, .axis line {
        fill: none;
    }

    .axis line {
        shape-rendering: crispEdges;
        stroke: #444;
        stroke-width: 1.0px;
        stroke-dasharray: 2, 4;
    }

    #progress-line {
        stroke: #a50f15;
        stroke-width: 4px;
    }

    #ObservationShow .top_row .photos_column .PhotoBrowser .image-gallery-slide .sound-container {
        transform: translateY(-50%);
    }`

    const style = document.createElement('style');
    style.textContent = spectrogramCSS;
    document.head.appendChild(style);

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('');

    const a = 1;
    const b = 1;

    const threshold = 1;
    const granularity = 100;

    const colorSchemeBase = [];
    for (let i = 0; i <= granularity; i++) {
        colorSchemeBase.push(1 - ((1 / granularity) * i));
    }
    // console.log(colorSchemeBase);

    const colorScheme = colorSchemeBase.map(num => Math.min(1, 1 - ((1 - num) / threshold)))
        .map(num => cdf(num, a, b))
        .map(y => {
            const black = Math.round(y * 255);
            return rgbToHex(black, black, black);
        });

    // console.log(`color scheme: ${colorScheme.join(', ')}`);

    const waitForEl = selector => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const specs = [];

    const createSpec = (soundContainer, index) => {
        if (soundContainer.querySelector('.sound').hidden) {
            soundContainer.querySelector('.sound').hidden = false;
            soundContainer.querySelector('.spectrogram').hidden = true;
        } else {
            const spectrogramEl = document.createElement('div');
            const specId = `spec-${index}`;
            spectrogramEl.id = specId;
            spectrogramEl.classList.add('spectrogram');
            const sourceEl = soundContainer.querySelector('source');
            const audioUrl = sourceEl.src;
            soundContainer.prepend(spectrogramEl);

            const spec = new Spectrogram(audioUrl, `#${specId}`, {
                width: 480,
                height: 200,
                maxFrequency: 10000,
                colorScheme: colorScheme,
                decRange: [-100, 0],
                sampleSize: 256
            });

            specs.push(spec);

            soundContainer.querySelector('.sound').hidden = true;
        }

        /* for (const spec of specs) {
            console.log(spec.colorScheme);
        } */
    };

    waitForEl('.sound-container source').then(() => {
        const soundContainers = document.getElementsByClassName('sound-container');

        for (let i = 0; i < soundContainers.length; i++) {
            const soundContainer = soundContainers[i];

            const captionsBox = soundContainer.querySelector('.captions-box');

            const button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-nostyle');
            button.textContent = 'Toggle spectrogram';
            button.addEventListener('click', () => createSpec(soundContainer, i));

            captionsBox.appendChild(button);
        }
    });
})();