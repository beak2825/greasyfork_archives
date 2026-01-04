// ==UserScript==
// @name         RYM Release Page Colorizer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Change specific CSS variables and elements based on album cover colors on RateYourMusic
// @author       https://greasyfork.org/users/1320826-polachek
// @match        *://*rateyourmusic.com/release/*
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510218/RYM%20Release%20Page%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/510218/RYM%20Release%20Page%20Colorizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    function adjustColor(rgb, percent) {
        return rgb.map(c => Math.min(255, Math.max(0, Math.floor(c * (1 + percent)))));
    }

    function getLuminance(rgb) {
        const a = rgb.map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrastRatio(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1);
        const lum2 = getLuminance(rgb2);
        return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    }

    function getContrastYIQ(rgb) {
        const yiq = ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
        return yiq >= 128 ? 'black' : 'white';
    }

    function adjustForContrast(bgColor, fontColor) {
        let ratio = getContrastRatio(bgColor, fontColor);
        const bgLum = getLuminance(bgColor);
        const fontLum = getLuminance(fontColor);
        const adjustment = 0.1;
        let iterations = 0;

        while (ratio < 4.5 && iterations < 20) {
            fontColor = adjustColor(fontColor, (bgLum > fontLum) ? -adjustment : adjustment);
            ratio = getContrastRatio(bgColor, fontColor);
            iterations++;
        }

        if (ratio < 4.5) {
            return getContrastYIQ(bgColor) === 'black' ? [0, 0, 0] : [255, 255, 255];
        }

        return fontColor;
    }

    // addGlobalStyle(`*, *::before, *::after { border: none !important; }`);

    addGlobalStyle(`a { transition:.4s; }`);


   addGlobalStyle(`
    * {
        transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
    }
`);


    window.addEventListener('load', function () {
    const albumCover = document.querySelector('div[class^="coverart_"] img');
    if (!albumCover) return;

    addGlobalStyle(`
      html, body, .release_left_column, .page_release_art_frame {
        transition: background-color 0.5s ease, color 0.8s ease, border-color 0.5s ease;
      }
    `);

        albumCover.crossOrigin = "Anonymous";

        albumCover.onload = function () {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(albumCover, 5);
            const dominantColor = palette[0];
            const fontColor = palette[1];
            const darkerColor = adjustColor(dominantColor, -0.05);
            const adjustedFontColor = adjustForContrast(dominantColor, fontColor);

            const dominantColorRGB = `rgb(${dominantColor.join(',')})`;
            const darkerColorRGB = `rgb(${darkerColor.join(',')})`;
            const adjustedFontColorRGB = `rgb(${adjustedFontColor.join(',')})`;

            addGlobalStyle(`
                body, body * { color: ${adjustedFontColorRGB}; }
                a.sametitle:hover { color: ${darkerColorRGB} !important; }
                #ui_search_input_main_search::placeholder { color: ${adjustedFontColorRGB} !important; }
                *, *::before, *::after { border-color: ${darkerColorRGB} !important; }
            `);

            const html = document.documentElement;
            const cssVars = {
                '--mono-0': adjustedFontColorRGB,
                '--mono-1': adjustedFontColorRGB,
                '--mono-3': adjustedFontColorRGB,
                '--mono-4': adjustedFontColorRGB,
                '--mono-5': adjustedFontColorRGB,
                '--mono-6': adjustedFontColorRGB,
                '--mono-7': adjustedFontColorRGB,
                '--mono-8': adjustedFontColorRGB,
                '--monof': dominantColorRGB,
                '--mono-a': adjustedFontColorRGB,
                '--mono-f': dominantColorRGB,
                '--mono-fb': dominantColorRGB,
                '--mono-f0': darkerColorRGB,
                '--mono-f2': darkerColorRGB,
                '--mono-f3': darkerColorRGB,
                '--mono-f4': dominantColorRGB,
                '--mono-f8': darkerColorRGB,
                '--mono-db': darkerColorRGB,
                '--mono-d8': darkerColorRGB,
                '--mono-e': darkerColorRGB,
                '--mono-d': dominantColorRGB,
                '--mono-ef': dominantColorRGB,
                '--mono-abs-3': dominantColorRGB,
                '--mono-abs-8': darkerColorRGB,
                '--mono-abs-a': adjustedFontColorRGB,
                '--mono-abs-d': adjustedFontColorRGB,
                '--mono-abs-f': adjustedFontColorRGB,
                '--surface-primary-light': darkerColorRGB,
                '--surface-secondary-light': darkerColorRGB,
                '--surface-tertiary': dominantColorRGB,
                '--background': dominantColorRGB,
                '--gen-bg-lightgreen': darkerColorRGB,
                '--btn-primary-background-default': darkerColorRGB,
                '--btn-primary-background-hover': dominantColorRGB,
                '--btn-primary-background-active': adjustedFontColorRGB,
                '--btn-expand-background-default': darkerColorRGB,
                '--btn-secondary-background-hover-light': dominantColorRGB,
                '--btn-secondary-background-default-light': darkerColorRGB,
                '--header-item-link': adjustedFontColorRGB,
                '--btn-primary-text': adjustedFontColorRGB,
                '--btn-secondary-text': adjustedFontColorRGB,
                '--btn-expand-background-hover': dominantColorRGB,
                '--btn-expand-background-disabled': darkerColorRGB,
                '--link-text-default-light': dominantColorRGB,
                '--link-text-hover': darkerColorRGB,
                '--gen-blue-dark': adjustedFontColorRGB,
                '--gen-blue-darker': adjustedFontColorRGB,
                '--gen-blue-darkest': adjustedFontColorRGB,
                '--link-text-default': adjustedFontColorRGB,
                '--text-primary': adjustedFontColorRGB,
                '--text-secondary': adjustedFontColorRGB,
            };

            for (const [key, value] of Object.entries(cssVars)) {
                html.style.setProperty(key, value);
            }

            const themeLight = document.querySelector('html.theme_light');
            if (themeLight) {
                [
                    '--mono-f', '--mono-fb', '--mono-f2', '--mono-f3', '--mono-f8',
                    '--mono-db', '--mono-d8', '--mono-4', '--mono-e', '--mono-ef',
                    '--mono-abs-3', '--surface-primary-light', '--surface-secondary-light',
                    '--surface-tertiary', '--background', '--gen-bg-lightgreen'
                ].forEach(varName => {
                    themeLight.style.setProperty(varName, cssVars[varName]);
                });
            }

            const releaseLeft = document.querySelector('.release_left_column');

            [releaseLeft].forEach(el => {
                if (el) {
                    el.style.backgroundColor = dominantColorRGB;
                    el.style.color = adjustedFontColorRGB;
                }
            });

            const pageArt = document.querySelector('.page_release_art_frame');

            [pageArt].forEach(el => {
                if (el) {
                    el.style.backgroundColor = darkerColorRGB;
                    el.style.color = adjustedFontColorRGB;
                }
            });

            document.body.classList.add('loaded');


        };
    });
})();
