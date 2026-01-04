// ==UserScript==
// @name         Letterboxd Poster Ambience
// @version      1.4
// @description  Ambient background color for film posters.
// @author       seaque
// @license       MIT
// @match        *://*.letterboxd.com/film/*
// @match        *://*.letterboxd.com/*/*/film/*
// @icon         https://a.ltrbxd.com/logos/letterboxd-decal-dots-neg-rgb.svg
// @namespace    https://github.com/seaque/tampermonkey-scripts
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/466920/Letterboxd%20Poster%20Ambience.user.js
// @updateURL https://update.greasyfork.org/scripts/466920/Letterboxd%20Poster%20Ambience.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    GM_addStyle(`
        .ambientDiv {
          position: absolute;
          -webkit-filter: blur(100px);
          filter: blur(100px);
        }
        .ambientDiv img {
          width: 100%;
          height: auto;
          max-width: 280px;
          max-height: 420px;

          opacity: 0;
          animation: show 500ms 50ms cubic-bezier(.45,.05,.55,.95) forwards;
        }
        @keyframes show {
          25% {
            opacity: 0.2;
            transform: none;
          }
          100% {
            opacity: 0.85;
            transform: none;
          }
        }
    `);
    
    let imageElement;
    const logPrefix = '%cLETTERBOXD POSTER AMBIENCE';
    const logStyle = [
        'color: white',
        'background: linear-gradient(90deg,rgba(255, 128, 0, 1) 0%, rgba(0, 224, 84, 1) 50%, rgba(64, 188, 244, 1) 100%);',
        'border-radius: 4px',
        'padding: 0 4px',
    ].join(';');

    const getPosterImage = () => {
        try {
            const posterImage = new Image();

            imageElement = $('.film-poster > div > img');
            if (!imageElement || imageElement.length === 0) {
                throw new Error('Poster image element not found.');
            }

            const url = imageElement[0].getAttribute('srcset');
            if (!url) {
                throw new Error('Poster image URL not found.');
            }

            console.info(logPrefix, logStyle, `Fetched poster: "${url}"`);
            posterImage.crossOrigin = "Anonymous";
            posterImage.src = url;

            return posterImage;
        } catch (error) {
            console.error(logPrefix, logStyle, `Error fetching poster: ${error.message}`);
            return null;
        }
    };

    const createAmbientDom = (img, w, h) => {
        const ambient_div = document.createElement('div');
        ambient_div.setAttribute('class', 'ambientDiv');
        ambient_div.append(img);
        return ambient_div;
    };

    const addAmbientDiv = () => {
        const img = getPosterImage();
        if (!img) return;

        img.addEventListener("load", () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            const parent = $('.-single')
            if (parent) {
                console.info(logPrefix, logStyle, `Parent element:`, parent);
                parent.prepend(createAmbientDom(img, width, height));
            } else {
                console.error("Parent element not found.");
            }
        });
    };

    let funcInterval = setInterval(() => {
        addAmbientDiv();
    }, 3000);

    setTimeout(() => {
        if (funcInterval) {
            if ( $('.ambientDiv img').length ) { console.info(logPrefix, logStyle, 'Poster Ambience Applied.'); }
            else { console.info(logPrefix, logStyle, 'Time Out! Exiting.'); }
            clearInterval(funcInterval);
            funcInterval = null;
        }
    }, 6000);
})();