// ==UserScript==
// @name         TBD: TorrentBD Theme Engine
// @namespace    https://naeembolchhi.github.io/
// @version      1.0.4.6
// @description  Customize the theme/colors of the TorrentBD website. Supports both light mode and dark mode.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,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
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @exclude      https://*.torrentbd.*/guidelines/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440627/TBD%3A%20TorrentBD%20Theme%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/440627/TBD%3A%20TorrentBD%20Theme%20Engine.meta.js
// ==/UserScript==

// Main event initiator.
(function() {
    'use strict';

    // Set default theme to dark if theme choice is unavailable.
    if (!localStorage.getItem('theme')) {localStorage.setItem('theme',"dark");}

    // Only initiate theme engine if the URL doesn't match.
    if (window.location.pathname != "/theme") {
        // Pendulum
        const pendulum = setInterval(function () {
            try {
                if (!document.querySelector('head')) {
                    return;
                }
                engineMain('remove');
                faviconSVG();
            } catch(e) {console.error("early-load-failed");catchErrors(e);}
        }, 10);

        // Only execute if window is interactive or fully loaded at this point.
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            setTimeout((function() {
                clearInterval(pendulum);
                engineMain();
                eraseTemp('remove');
                checkCurrentTheme();
                faviconSVG();
                addThemeButton();
                customBBCode();
                adjustElements();
                try {faviconFIX();} catch {}
                loadTime();
            }), 100);
        }

        // Modifying head when available.
        let observer = new MutationObserver(function() {
            if (document.title) {
                clearInterval(pendulum);
                engineMain();
                eraseTemp('remove');
            }
            if (document.body) {
                faviconSVG();
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, {childList: true, subtree: true});

        // Execute DOM modifications when ready state changes.
        document.onreadystatechange = function () {
            // Modify body when document is interactive.
            if (document.readyState === 'interactive') {
                try {checkCurrentTheme();} catch(e) {console.error("check-current-theme");catchErrors(e);}
                addThemeButton();
                customBBCode();
                adjustElements();
            }
            // Modify body when document is complete.
            if (document.readyState === 'complete') {
                try {faviconFIX();} catch {}
                loadTime();
            }
        }
    }

})();

// SVG Logos and Version
const fullSVG = '<svg id="logo-img" class="logo-svg" alt="TorrentBD" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 626.05 125" xml:space="preserve"><g><path d="M7.36,0h512.61c12.61,4.03,18.92,12.09,18.92,24.18V47.3c0,5.72-4.2,9.93-12.61,12.61v1.05c9.75,2.4,14.63,6.6,14.63,12.61   v32.59c0,8.94-6.28,15.21-18.83,18.83h-48.35c-1.4,0-2.1-0.7-2.1-2.1V14.72H88.21c-4.2,0.47-6.31,1.52-6.31,3.15v99.77   c-1.75,3.5-4.53,5.26-8.32,5.26h-4.2c-5.37,0-8.53-1.4-9.46-4.2V31.53c-0.93-2.8-4.09-4.2-9.46-4.2H7.36   C2.45,27.33,0,24.18,0,17.87V9.46C0,5.43,2.45,2.28,7.36,0z M111.33,21.02h18.92c13.31,0,19.97,6.66,19.97,19.97v59.92   c0,11.86-9.46,17.78-28.38,17.78h-2.1c-18.92,0-28.38-5.58-28.38-16.73V37.84C91.36,26.63,98.02,21.02,111.33,21.02z M110.28,37.84   v63.07c0,0.99,1.05,2.04,3.15,3.15h14.72c0.99,0,2.04-1.05,3.15-3.15V37.84c0-0.99-1.05-2.04-3.15-3.15h-14.72   C112.44,34.69,111.39,35.74,110.28,37.84z M164.94,21.02h35.65c11.21,1.05,16.82,6.31,16.82,15.77v27.33   c0,5.96-3.15,10.86-9.46,14.72l11.56,38.81l-2.1,1.05h-13.67c-2.51,0-6.69-12.93-12.53-38.81h-9.46v36.7c0,1.4-0.7,2.1-2.1,2.1   h-14.72c-1.4,0-2.1-0.7-2.1-2.1V23.13C163.07,21.72,163.78,21.02,164.94,21.02z M181.76,34.69v32.59h10.51   c4.15,0,6.22-2.1,6.22-6.31V37.84c0-0.99-1.05-2.04-3.15-3.15H181.76z M232.13,21.02h32.59c13.31,0,19.97,8.06,19.97,24.18v8.41   c0,16.12-3.5,24.18-10.51,24.18c6.31,20.44,10.16,33.72,11.56,39.86l-2.1,1.05h-13.67c-1.81,0-6.02-12.93-12.61-38.81h-8.41v36.7   c0,1.4-0.7,2.1-2.1,2.1h-14.72c-1.4,0-2.1-0.7-2.1-2.1V23.13C230.26,21.72,230.96,21.02,232.13,21.02z M248.95,34.69v30.48   l-1.05,2.1h10.51c4.91,0,7.36-3.15,7.36-9.46V42.05c0-3.74-1.4-6.19-4.2-7.36H248.95z M298.35,21.02h39.86   c1.4,0.23,2.1,0.93,2.1,2.1v9.46c0,1.4-0.7,2.1-2.1,2.1h-23.13v27.33h19.97c1.4,0.23,2.1,0.93,2.1,2.1v9.46c0,1.4-0.7,2.1-2.1,2.1   h-19.97v28.38h23.13c1.4,0.18,2.1,0.88,2.1,2.1v10.42c0,1.4-0.7,2.1-2.1,2.1h-39.86c-1.4,0-2.1-0.7-2.1-2.1V23.13   C296.43,21.72,297.13,21.02,298.35,21.02z M352.93,21.02h14.72c1.87,0,7.47,13.67,16.82,41h1.05V23.13c0.23-1.4,0.93-2.1,2.1-2.1   h14.72c1.4,0.23,2.1,0.93,2.1,2.1v93.46c0,1.4-0.7,2.1-2.1,2.1h-14.72c-1.4,0-2.1-0.7-2.1-2.1v-14.63   c0-2.63-4.91-15.94-14.72-39.94h-1.05v54.57c0,1.4-0.7,2.1-2.1,2.1h-14.72c-1.4,0-2.1-0.7-2.1-2.1V23.13   C351.06,21.72,351.76,21.02,352.93,21.02z M413.89,21.02h47.21c1.4,0.23,2.1,0.93,2.1,2.1v9.46c0,1.4-0.7,2.1-2.1,2.1h-13.67v81.9   c0,1.4-0.7,2.1-2.1,2.1h-14.72c-1.4,0-2.1-0.7-2.1-2.1v-81.9h-14.63c-1.4,0-2.1-0.7-2.1-2.1v-9.46   C411.97,21.72,412.67,21.02,413.89,21.02z M494.74,16.82v34.69h9.46c7.71,0,11.56-2.8,11.56-8.41V27.33   c0-7.01-4.56-10.51-13.67-10.51H494.74z M494.74,68.32v38.89h15.77c3.74,0,6.19-1.4,7.36-4.2V76.73c0-5.61-3.85-8.41-11.56-8.41   H494.74z M530.48,0h76.65c12.61,5.31,18.92,11.27,18.92,17.87v92.5c0,5.9-6.31,10.77-18.92,14.63h-47.3c-1.4,0-2.1-0.7-2.1-2.1   V16.82h-11.56c-1.05,0-2.8-3.5-5.26-10.51c-2.22-1.87-6.39-3.27-12.53-4.2V1.05L530.48,0z M580.85,16.82v90.4h15.77   c3.74,0,6.19-1.4,7.36-4.2V27.33c0-7.01-4.2-10.51-12.61-10.51H580.85z"/></g></svg>',
      halfSVG = '<svg id="logo-img-sm" class="logo-svg" alt="TorrentBD" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 270.91 125" xml:space="preserve"><g><path d="M7.4,0H164.9c12.6,4.01,18.9,12.08,18.9,24.22V47.3c0,5.69-4.21,9.9-12.63,12.63v1.05c9.81,2.38,14.72,6.56,14.72,12.54   v32.58c0,8.94-6.3,15.24-18.9,18.9h-48.34c-1.39,0-2.09-0.7-2.09-2.09V14.72H88.24c-4.24,0.47-6.36,1.51-6.36,3.14v99.83   c-1.74,3.48-4.53,5.23-8.36,5.23h-4.18c-5.4,0-8.57-1.39-9.49-4.18v-87.2c-0.93-2.79-4.07-4.18-9.41-4.18H7.4   c-4.94,0-7.4-3.16-7.4-9.49V9.49C0,5.43,2.47,2.26,7.4,0z M139.63,16.81v34.67h9.49c7.72,0,11.59-2.79,11.59-8.36V27.35   c0-7.03-4.56-10.54-13.68-10.54H139.63z M139.63,68.29v38.85h15.77c3.77,0,6.24-1.39,7.4-4.18V76.65c0-5.57-3.86-8.36-11.59-8.36   H139.63z M175.35,0H252c12.6,5.28,18.9,11.24,18.9,17.86v92.42c0,5.98-6.3,10.89-18.9,14.72h-47.21c-1.39,0-2.09-0.7-2.09-2.09   V16.81h-11.59c-0.58,0-2.67-3.83-6.27-11.5c-7.72-1.92-11.59-3.34-11.59-4.27L175.35,0z M225.78,16.81v90.33h15.77   c3.77,0,6.21-1.39,7.32-4.18V27.35c0-7.03-4.18-10.54-12.54-10.54H225.78z"/></g></svg>',
      khojSVG = '<svg class="khoj-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 130" xml:space="preserve"><g><path d="M31.9,48.5c0.9-1.3,0.8-2.8,1.2-4.1C37.1,30.2,41,16,44.8,1.8c0.4-1.5,1-1.7,2.4-1.7c8.7,0.1,17.4,0.1,26,0   c1.4,0,1.8,0.1,1.4,1.6c-5.5,17.8-11,35.7-16.4,53.5c-0.6,1.8-1.6,3.3-2.9,4.9c1.2-0.4,1.6,0.1,2,1.1c2,5,3,10.3,4.4,15.4   c2.2,8.2,4.9,16.3,6.9,24.6c0.5,2,0.6,4.1,1.3,5.9c1.9,5.1,3.5,10.3,4.8,15.6c0.4,1.5,0.7,3,1,4.6c0.4,1.9-0.3,2.6-2.2,2.6   c-9.4,0-18.7,0-28.1,0c-1.1,0-1.6-0.2-1.9-1.5c-2.5-11.4-5.1-22.8-7.6-34.3c-0.5-2.3-0.9-4.7-0.9-7.1c0-3.7-2-6.7-2.7-10.2   c-0.2-1.1-0.2-2.4-1.2-3.6c0.2,4.1,0.4,7.9,0.6,11.8c0,0.5,0.2,0.9,0.2,1.4c0,13.9,0,27.9,0,41.8c0,1.3-0.4,1.7-1.6,1.7   c-9.6,0-19.1,0-28.7,0.1c-1.3,0-2.2-0.2-0.7-1.5c0.1-0.1,0.1-0.5,0.1-0.7c-1.2-5.3-0.4-10.7-0.6-16C0,101.6,0.2,91.5,0.6,81.4   C1.1,69.3,0.5,57.1,0.4,45c-0.1-9.4-0.5-18.9,0-28.3c0.3-5-0.9-9.8-0.2-14.7c0.2-1.3,0.4-1.9,1.7-1.8C3.4,0.3,5-0.2,6.5,0.7   c0.7,0.4,1.8-0.3,2.7-0.3C16.1-0.2,23,0.2,29.9,0c1.7,0,2.6,0.3,1.6,2.2c-0.7,1.3,0.1,2.5,0.2,3.8C32.1,19.4,32.1,32.7,32,46   C32,46.8,31.5,47.5,31.9,48.5z"/><path d="M170.9,78.6c0.7,0.5,1.1,0.7,1.7,1.1c-0.1-0.4-0.3-0.7-0.3-0.9c-0.6-3.4-0.8-6.8-0.9-10.2c-0.5-10.3-0.5-20.7-0.4-31   c0.1-4.9,0.3-9.8,1.6-14.5c1.4-4.8,3.4-9.3,7.5-12.5c2.9-2.3,4.9-5.6,8.5-7.4c3.2-1.5,6.6-2.7,10-2.8c4.7-0.1,9.3-0.7,14-0.5   c5.9,0.3,11.5,1.9,16.2,5.4c2,1.5,3.2,4,5.1,5.9c0.7,0.7,1.5,1.3,2.2,2c3.9,3.7,5.9,8.4,6.2,13.5c0.8,11.6,1,23.3,0.7,35   c-0.2,8.6,0,17.3,0,25.9c0.1,6.8-0.3,13.5-1.2,20.2c-0.8,6.4-4.8,11.2-9.2,15.7c-1.1,1.1-2.4,2.2-3.7,3.1c-2.6,1.9-5.2,3.3-8.7,2.9   c-2.9-0.3-5.9-0.1-8.9,0c-1.6,0.1-1.8-0.6-1.7-1.9c0.3-6.5,1.8-12.7,2.9-19c1.5-8,3.5-16,3.3-24.3c-0.1-2.7,0.8-5.5,0.9-8.2   c0.1-2.2,0.5-4,1.5-5.9c0.3-0.6,0.6-1.2,1.3-1.4c5.5-0.9,6.9-5.1,8.3-9.5c0.9-2.9,0.5-5.6,0-8.5c-0.8-4.3-1.5-8.5-3.5-12.4   c-1.7-3.1-3.8-5.5-7.4-6.5c-1.3-0.3-2.4-0.9-3.3-1.9c-1.2-1.3-1.1-2.5,0.5-3.3c1.1-0.6,1.3-1.6,1.4-2.5c0.2-3,1-6.1-1.5-8.8   c-1.5-1.6-3.1-2.3-5.3-1.8c-0.7,0.2-1.4,0.1-2,0.2c-1.5,0.2-2.7,0.8-3.3,2.3c-0.3,0.9-0.8,1.8-1.3,2.7c-0.7,1.2-0.9,2.1,0,3.6   c1.2,1.9,0.5,4.3,0.3,6.5c-0.1,0.7-1,0.8-1.7,1c-3.4,1.3-7,2.4-9.2,5.6c-0.5,0.7-0.9,1.5-1.1,2.3c-1.4,5.3-3.7,10.4-4.6,15.9   c-0.7,4.4,1,11.3,6.1,13.5c0.8,0.3,0.7,0.9,0.7,1.4c-0.2,6.4,1.2,12.5,2.4,18.7c0.6,3,1,5.9,3,8.3c0.2,0.3,0.4,0.7,0.4,1.1   c-0.2,2.5-0.1,5.1-0.7,7.5c-0.6,2.6-0.5,5.2-0.3,7.8c0.1,1.1,0.9,2.3-0.6,3.2c-0.5,0.3,0.6,0.4,0.3,1.1c-1.1,3-1.2,6.1-0.7,9.2   c0.1,0.8,0,1.6-0.2,2.4c-0.3,1.1-0.8,1.3-2,1.5c-4.5,0.6-7.9-1.7-10.9-4.2c-5.5-4.6-10-9.9-11.1-17.2c-0.3-1.8-0.6-3.6-0.6-5.4   c-0.3-7.6-1.4-15.1-0.9-22.7C171,79.9,170.9,79.4,170.9,78.6z"/><path d="M282.7,0.1c5.2,0,10.3,0.1,15.5,0c1.3,0,1.8,0.3,1.8,1.7c0,4.8-0.4,9.6-1.4,14.4c-0.1,0.7-0.6,1.3,0.6,1.7   c0.7,0.2,0.4,1.2,0.4,1.9c0.5,5.9-0.5,11.9-0.3,17.7c0.3,7.4,0,14.7,0.3,22.1c0.2,5.4-0.4,10.7-0.4,16.1   c0.1,10.7,0.4,21.5,0.3,32.2c0,3.5-0.4,7.2-2,10.5c-0.4,0.8-0.6,2.3-2.3,1.5c-0.3-0.2-0.6,0.3-0.7,0.6c-0.2,0.3,0,0.6,0.2,0.7   c1.5,0.4,0.6,1,0.1,1.4c-2.1,2.1-4.9,3.1-7.6,4.3c-4.4,2-9,3.4-13.9,2.9c-6.3-0.7-12.6,0.6-18.9,0.1c-0.9-0.1-1.7,0.1-1.7-1.3   c0.1-6.6-0.5-13.2-0.4-19.8c0-1.4,0.4-1.9,1.9-1.8c1.2,0.1,2.5,0.1,3.7,0c4.1-0.3,6.8-2.1,7-5.9c0-1,0.4-2,0.3-3   c-0.6-6.2,1.3-12.3,1.4-18.5c0-3-0.1-6-0.3-9c-1-13-0.9-26-0.4-39c0.2-7.1,0.8-14.3-0.2-21.4c-0.4-2.8-0.3-5.6-0.5-8.4   c-0.1-1.2,0.4-1.5,1.5-1.5C272.1,0.1,277.4,0.1,282.7,0.1C282.7,0.1,282.7,0.1,282.7,0.1z"/><path d="M130.8,75c-1.9,0.4-3.5,0.5-5.2,0.5c-1.2,0-1.6-0.3-1.6-1.6c0.1-3.5-0.2-7.1,0.1-10.6c0.4-5.1-0.3-10.3-0.1-15.4   c0-1.3,0.4-1.6,1.7-1.6c3.7,0,3.7-0.1,3.7-3.8c0-13.4,0-26.8,0-40.2c0-1.8,0.5-2.3,2.3-2.3c9.1,0.1,18.2,0.1,27.3,0   c1.6,0,2.1,0.4,2,2c-0.1,30.6-0.1,61.2-0.1,91.9c0,6.8,0,13.5,0,20.3c0,4.8-0.1,9.6,0,14.4c0,1.1-0.2,1.4-1.4,1.4   c-9.6,0-19.1,0-28.7,0c-1.2,0-1.5-0.4-1.5-1.5c0-15.2,0-30.3,0.1-45.5c0-2.1,0.6-4.1,0.5-6.2C129.8,76.2,130.3,75.7,130.8,75z"/><path d="M120.2,65.2c0,21,0,42.1,0,63.1c0,1.4-0.4,1.7-1.8,1.7c-9.1,0-18.2,0-27.3,0c-1.6,0-2-0.4-2.2-2   c-0.7-8.1-0.2-16.1-0.1-24.1c0.1-10.3,0.6-20.5,0.1-30.8c-0.7-16.4-0.4-32.8-0.2-49.1c0.1-7.4-0.8-14.8-0.1-22.2   C88.9,0.3,89.2,0,90.6,0c9.1,0.1,18.2,0.1,27.3,0c2,0,2.4,0.5,2.4,2.4C120.2,23.3,120.3,44.3,120.2,65.2   C120.3,65.2,120.3,65.2,120.2,65.2z"/></g></svg>',
      version = 20251025204127;

// Setting and receiving JSON data from local storage.
function setJSON(key, data) {
    if (typeof data != "string") {data = JSON.stringify(data);}
    localStorage.setItem(key, data);
}
function getJSON(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Increasing and decreasing brightness of colors. (https://stackoverflow.com/a/57401891/14312937)
function applyShade(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Convert 6 digit HEX to RGB color
function getRGB(color) {
  color = color.replace('#','');
  return `rgb(${parseInt(color.replace(/....$/,''), 16)}, ${parseInt(color.replace(/..$/,'').replace(/^../,''), 16)}, ${parseInt(color.replace(/^..../,''), 16)})`;
}

// Default colors and font.
const defaultDark = {"bodybg":"#212328","cardbg":"#2b2d33","bodycolor":"#b8c6cc","bodystark":"#ffffff","btncolor":"#2b2d33","btnhover":"#212328","accent1":"#4db6ac","accent2":"#039be5","accent3":"#4caf50","navbg":"#2c3e50","titlecolor":"#ffffff","logo":"#f5f5f5","catfilter":"initial"},
      defaultLight = {"bodybg":"#e9ecef","cardbg":"#f5f5f5","bodycolor":"#3a3a40","bodystark":"#000000","btncolor":"#e9ecef","btnhover":"#f5f5f5","accent1":"#409b92","accent2":"#039be5","accent3":"#4caf50","navbg":"#284766","titlecolor":"#f5f5f5","logo":"#f5f5f5","catfilter":"initial"},
      defaultFontLink = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      defaultFontName = 'IBM Plex Sans';

// Set defaults when no customization is available.
(function() {
    if (!localStorage.getItem("themeDark")) {setJSON("themeDark", defaultDark);}
    if (!localStorage.getItem("themeLight")) {setJSON("themeLight", defaultLight);}
    if (!localStorage.getItem("fontlink")) {localStorage.setItem("fontlink",defaultFontLink);}
    if (!localStorage.getItem("fontname")) {localStorage.setItem("fontname",defaultFontName);}
    if (!localStorage.getItem("favstate")) {localStorage.setItem("favstate","false");}
    if (!localStorage.getItem("torvisit")) {localStorage.setItem("torvisit","false");}
})();

// Global shortcuts.
const pathname = document.location.pathname;

// Dark Mode Theme
const darkCSS = `:root {
  /* Get User Defined */
--engine-body-bg: ${getJSON('themeDark').bodybg};
--engine-card-bg: ${getJSON('themeDark').cardbg};
--engine-nav-bg: ${getJSON('themeDark').navbg};
--engine-body-color: ${getJSON('themeDark').bodycolor};
--engine-body-color-stark: ${getJSON('themeDark').bodystark};
--engine-button-color: ${getJSON('themeDark').btncolor};
--engine-button-color-hover: ${getJSON('themeDark').btnhover};
--engine-accent-color-1: ${getJSON('themeDark').accent1};
--engine-accent-color-2: ${getJSON('themeDark').accent2};
--engine-accent-color-3: ${getJSON('themeDark').accent3};
--engine-content-title: ${getJSON('themeDark').titlecolor};
--engine-logo-color: ${getJSON('themeDark').logo};
--engine-cat-filter: ${getJSON('themeDark').catfilter};
  /* Refer User Defined */
--engine-body-color-light: ${getJSON('themeDark').bodycolor}cc;
--engine-table-odd-bg: ${applyShade(getJSON('themeDark').cardbg, -4)};
--engine-accent-color-1a: ${applyShade(getJSON('themeDark').accent1, 20)};
--engine-accent-color-1b: ${applyShade(getJSON('themeDark').accent1, -70)};
--engine-accent-color-1c: ${getJSON('themeDark').accent1}22;
--engine-accent-color-1d: ${applyShade(getJSON('themeDark').accent1, -30)};
--engine-accent-color-2a: ${applyShade(getJSON('themeDark').accent2, 20)};
--engine-accent-color-3a: ${applyShade(getJSON('themeDark').accent3, 20)};
--engine-media-hover-bg: ${applyShade(getJSON('themeDark').cardbg, 15)}cc;
--engine-account-buttons: ${getJSON('themeDark').bodycolor};
--engine-account-buttons-hover: ${getJSON('themeDark').bodystark};
--engine-account-buttons-background: ${getJSON('themeDark').bodystark}15;
--engine-notif-bg: ;
  /* Defined, No Change */
--engine-seeders: #4caf50;
--engine-leechers: #f44336;
--engine-completed: #ffa726;
--engine-shortlink-color: #ffffff;
  /* Referred */
--engine-search-color: var(--engine-content-title);
--engine-search-background: var(--engine-nav-bg);
--engine-menu-item: var(--engine-content-title);
--engine-menu-item-hover: var(--engine-accent-color-1);
--engine-like-button: var(--engine-content-title);
--engine-border-color: var(--engine-body-bg);
--engine-theme-toggle: var(--engine-account-buttons);
--engine-theme-toggle-hover: var(--engine-account-buttons-hover);
--engine-theme-toggle-background: var(--engine-account-buttons-background);
  /* Origin */
--engine-backdrop-bg: transparent;
--body-bg: var(--engine-body-bg);
--body-color: var(--engine-body-color);
--body-color-light: var(--engine-body-color-light);
--border-color: var(--engine-border-color);
--border-sp-color: rgba(99, 112, 131, 0.95);
--border-sp-light-color: rgba(99, 112, 131, 0.6);
--btn-1-color: var(--engine-accent-color-1);
--cm-bg: var(--engine-body-bg);
--cmodal-dark-bg: var(--engine-body-bg);
--light-color-3: #b5bbbc;
--link-cm1-color: var(--engine-accent-color-1a);
--link-color: var(--engine-accent-color-1);
--link-hover-color: var(--engine-accent-color-1a);
--link-sp1-color: var(--engine-body-color);
--link-sp1-hover-color: var(--engine-accent-color-1);
--link-sp2-color: var(--engine-accent-color-2);
--link-sp3-color: var(--engine-accent-color-3);
--main-bg: var(--engine-card-bg);
--modal-color: #c1cdd2;
--nav-alt-bg: #006064;
--nav-bg: var(--engine-nav-bg);
--placeholder-color: rgba(181, 199, 207, 0.7);
--readable-bg: rgba(69, 74, 89, 0.9);
  /* FONT-FAMILY */
--engine-font-family: '${localStorage.getItem("fontname")}', 'IBM Plex Sans', 'Noto Sans Bengali', 'Siyam Rupali', Verdana, sans-serif;
}
  /* NON-COLOR */
.engine-dawn {display: none !important;}
.engine-dusk {display: inherit !important;}
`;

// Light Mode Theme
const lightCSS = `:root {
  /* Get User Defined */
--engine-body-bg: ${getJSON('themeLight').bodybg};
--engine-card-bg: ${getJSON('themeLight').cardbg};
--engine-nav-bg: ${getJSON('themeLight').navbg};
--engine-body-color: ${getJSON('themeLight').bodycolor};
--engine-body-color-stark: ${getJSON('themeLight').bodystark};
--engine-button-color: ${getJSON('themeLight').btncolor};
--engine-button-color-hover: ${getJSON('themeLight').btnhover};
--engine-accent-color-1: ${getJSON('themeLight').accent1};
--engine-accent-color-2: ${getJSON('themeLight').accent2};
--engine-accent-color-3: ${getJSON('themeLight').accent3};
--engine-content-title: ${getJSON('themeLight').titlecolor};
--engine-logo-color: ${getJSON('themeLight').logo};
--engine-cat-filter: ${getJSON('themeLight').catfilter};
  /* Refer User Defined */
--engine-body-color-light: ${getJSON('themeLight').bodycolor}cc;
--engine-table-odd-bg: ${applyShade(getJSON('themeLight').cardbg, -4)};
--engine-accent-color-1a: ${applyShade(getJSON('themeLight').accent1, 20)};
--engine-accent-color-1b: ${applyShade(getJSON('themeLight').accent1, -70)};
--engine-accent-color-1c: ${getJSON('themeLight').accent1}22;
--engine-accent-color-1d: ${applyShade(getJSON('themeLight').accent1, -30)};
--engine-accent-color-2a: ${applyShade(getJSON('themeLight').accent2, 20)};
--engine-accent-color-3a: ${applyShade(getJSON('themeLight').accent3, 20)};
--engine-media-hover-bg: ${applyShade(getJSON('themeLight').cardbg, 15)}cc;
--engine-account-buttons: ${getJSON('themeLight').bodycolor};
--engine-account-buttons-hover: ${getJSON('themeLight').bodystark};
--engine-account-buttons-background: ${getJSON('themeLight').bodystark}15;
--engine-notif-bg: ;
  /* Defined, No Change */
--engine-seeders: #4caf50;
--engine-leechers: #f44336;
--engine-completed: #ffa726;
--engine-shortlink-color: #ffffff;
  /* Referred */
--engine-search-color: var(--engine-content-title);
--engine-search-background: var(--engine-nav-bg);
--engine-menu-item: var(--engine-content-title);
--engine-menu-item-hover: var(--engine-accent-color-1);
--engine-like-button: var(--engine-content-title);
--engine-border-color: var(--engine-body-bg);
--engine-theme-toggle: var(--engine-account-buttons);
--engine-theme-toggle-hover: var(--engine-account-buttons-hover);
--engine-theme-toggle-background: var(--engine-account-buttons-background);
  /* Origin */
--engine-backdrop-bg: transparent;
--body-bg: var(--engine-body-bg);
--body-color: var(--engine-body-color);
--body-color-light: var(--engine-body-color-light);
--body-inv-color: #d5e1e1;
--border-color: var(--engine-border-color);
--border-sp-color: rgba(143, 158, 157, .8);
--border-sp-light-color: rgba(143, 158, 157, .6);
--cm-bg: var(--engine-body-bg);
--cmodal-dark-bg: var(--engine-body-bg);
--kuddus-color: rgb(158, 158, 158);
--label-color: var(--engine-body-color);
--light-color-3: #b5bbbc;
--link-color: var(--engine-accent-color-1);
--link-hover-color: var(--engine-accent-color-1a);
--link-cm1-color: var(--engine-accent-color-1a);
--main-bg: var(--engine-card-bg);
--modal-color: #405964;
--nav-bg: var(--engine-nav-bg);
--placeholder-color: #6d8997;
--readable-bg: rgba(219, 219, 219, 0.5);
  /* FONT-FAMILY */
--engine-font-family: '${localStorage.getItem("fontname")}', 'IBM Plex Sans', 'Noto Sans Bengali', 'Siyam Rupali', Verdana, sans-serif;
}
  /* NON-COLOR */
.engine-dawn {display: inherit !important;}
.engine-dusk {display: none !important;}
`;

// General Theme
const engineCSS = `
@import url('${localStorage.getItem("fontlink")}');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');

@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 20%, 0);
    transform: translate3d(0, 20%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

* {
  scrollbar-width: thin !important;
  scrollbar-color: var(--engine-body-color-light) #00000000 !important;
  box-shadow: none !important;
}
*::-webkit-scrollbar {
  width: 7px !important;
  height: 7px !important;
}
*::-webkit-scrollbar-thumb {
  background: var(--engine-nav-bg) !important;
}
*::-webkit-scrollbar-track {
  background: #00000000 !important;
}

/* Scroll Margin Individually */
div[id]:not([id^='shout']) {
  scroll-margin-top: 80px;
}

/* Disabled due to gradient limitations.
::selection {
  color: var(--engine-body-bg) !important;
  background: var(--engine-accent-color-1) !important;
}*/
/*.cat-pic-img {
  filter: var(--engine-cat-filter);
}*/
body.light-scheme, body.dark-scheme, body {
  background: var(--engine-body-bg) !important;
}
body.light-scheme, body.dark-scheme, body {
  --notif-bg: var(--engine-notif-bg);
  --backdrop-bg: var(--engine-backdrop-bg);
}
body.light-scheme, body.dark-scheme, body, .pagination li {
  font-family: var(--engine-font-family);
}
a, .shouts a {
  color: var(--link-color);
}
a:hover, .shouts a:hover,
a:active, .shouts a:active {
  color: var(--link-hover-color);
}
a:focus-visible, button:focus-visible {
  outline: 0;
  border-bottom: 1px dotted var(--engine-accent-color-1);
}
.crumb-container, .crumb-container a {
  color: var(--engine-accent-color-1);
}
.crumb-container a:hover,
.crumb-container a:active {
  color: var(--engine-accent-color-1a);
}
#user-sb:hover,
#user-sb:active {
  color: var(--link-hover-color);
}
/* Solid color ranks disabled on request. topicid=37584&page=1&postid=336084
body .tbdrank.legend {
  color: #4080ff !important;
}
body .tbdrank.mvp {
  color: #ffbb33 !important;
  background-color: transparent;
  background-image: none !important;
  background-clip: unset !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: initial !important;
}
body .tbdrank.star-uploader {
  color: #33ff99 !important;
  background-color: transparent;
  background-image: none !important;
  background-clip: unset !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: initial !important;
}
body .tbdrank.wizard {
  color: #ff884d !important;
  background-color: transparent;
  background-image: none !important;
  background-clip: unset !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: initial !important;
}
*/
.tab-sortable {
  color: var(--engine-accent-color-1);
}
.tab-sortable:hover, .tab-sortable:active {
  color: var(--engine-accent-color-1a);
}
.torr-sort-icon {
  color: var(--engine-body-color-stark);
}
table.torrents-table thead tr th {
  padding: .5rem !important;
}
table.torrents-table tbody tr:nth-child(odd), div.top-uploaders-table tbody tr:nth-child(odd), #middle-block tbody tr:nth-child(odd) {
  background: var(--engine-table-odd-bg);
}
table.bordered > thead > tr, table.bordered > tbody > tr, table.bordered > thead, div.top-uploaders-table thead, #middle-block thead {
  border: 0;
}
@media only screen and (min-width: 992px) {
  main {
    padding-top: 80px;
  }
}
@media only screen and (max-width: 991px) {
  #left-block {
    padding-top: 20px;
  }
}
#description {
  padding: 15px 5px;
}
.hti-sf {
  border: 1px solid var(--engine-accent-color-1);
}
.hti-sf.active {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
span.faq-tag {
  background: var(--engine-accent-color-2);
  color: var(--engine-button-color);
}
span.faq-tag.updated {
  background: var(--engine-accent-color-2);
}
span.faq-tag.new {
  background: var(--engine-accent-color-3);
}
.material-icons.orange600 {
  color: var(--engine-accent-color-1);
}
#new_poll_notif {
  color: var(--engine-button-color) !important;
  background: var(--engine-accent-color-3);
}
.card-title > i {
  color: var(--engine-accent-color-1) !important;
}
.posted-on {
  padding: 12px;
}
.main-header--icon, .main-header--title {
  color: var(--engine-content-title) !important;
}
.card-title > i:hover,
.card-title > i:active {
  color: var(--engine-accent-color-1a) !important;
}
div#left-block-container button > img[style*='height: 30px;'] {
  visibility: hidden;
}
.main-header {
  background: var(--engine-nav-bg) !important;
}
i.spoiler-trigger {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1);
}
.cnav {
  position: fixed;
  z-index: 10000;
  width: 100%;
  height: 62px;
  box-shadow: none;
  background: var(--nav-bg) !important;
}
footer.page-footer .footer-copyright {
  color: var(--engine-body-color);
  background-color: var(--engine-nav-bg);
}
.grey-text.text-lighten-4 {
  color: var(--engine-content-title) !important;
}
.footer-copyright .container {
  color: var(--engine-content-title);
}
div#left-block-container ul[class*='collapsible'] li {
  border-bottom: 1px solid var(--engine-border-color);
}
div#left-block-container ul[class*='collapsible'] li:last-of-type {
  border-bottom: 0;
}
.card .card-image img {
  border-radius: 6px;
  margin: 20px auto auto auto !important;
}
.card .card-action {
  border-top: 1px solid var(--engine-border-color);
}
.content-title, .row .content-title {
  color: var(--engine-content-title) !important;
}
.collapsible-header, .collapsible-body {
  border-bottom: 1px solid var(--engine-card-bg);
}
.green-text, .green100, #kuddus-results-container .thc.seed, div#left-block-container a[href*='activities.php'] div:first-of-type {
  color: var(--engine-seeders) !important;
}
.red-text, .tmm-mu-header, .tx-red, #kuddus-results-container .thc.leech, div#left-block-container a[href*='activities.php'] div:last-of-type, div#torrents-main tbody > tr > td:nth-of-type(8), .movie-torrents-table tbody tr td:nth-of-type(7), #middle-block table.tv-table tr td:nth-of-type(6), .red100 {
  color: var(--engine-leechers) !important;
}
.orange-text, .darkorange-text, .orange100, #kuddus-results-container .thc.completed, div#torrents-main tbody > tr > td:nth-of-type(9), .movie-torrents-table tbody tr td:nth-of-type(8), #middle-block table.tv-table tr td:nth-of-type(7) {
  color: var(--engine-completed) !important;
}
img.avatar, img.poster-avatar, img.poster, .signature img, .carousel img, img.pposter, #description img, img.cover-image {
  border-radius: 6px;
}
#kuddus-trigger-handle {
  display: none;
}
.kuddus-title-bar {
  height: 62px;
  line-height: 62px;
  color: var(--engine-menu-item);
}
.kuddus-results-counter {
  color: var(--engine-menu-item);
  top: -54px;
  left: 15px;
}
#kuddus-close {
  padding: 0;
  color: var(--engine-button-color);
  background: var(--engine-leechers);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
#kuddus-close:hover, #kuddus-close:active {
  color: var(--engine-button-color-hover);
  filter: brightness(1.1);
}
#kuddus-close > i {
  padding: 0 28px;
}
#kuddus-wrapper .mqi {
  padding: 0 7px;
}
#kuddus-wrapper label, .tradiopill-select {
  color: var(--engine-body-color);
}
#kuddus-results-container a:hover {
  color: var(--engine-accent-color-1);
}
#kuddus-results-container .kuddus-user-action-btn {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1);
}
#kuddus-results-container .kuddus-user-action-btn:hover,
#kuddus-results-container .kuddus-user-action-btn:focus {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
.tradiopill [type="radio"] + label {
  border-color: var(--engine-accent-color-1);
}
.tradiopill [type="radio"]:checked + label {
  color: var(--engine-button-color) !important;
  background: var(--engine-accent-color-1);
}
.tclabel.selected, .ttcp .tclabel.selected, .tcheckbox.attr .tclabel.selected, input[type="range"] + .thumb {
  color: var(--engine-accent-color-1);
}
input[type="range"] + .thumb {
  background-color: var(--engine-accent-color-1);
}
input[type="range"] + .thumb .value {
  color: var(--engine-button-color) !important;
}
button.theme-toggle-btn > .engine-theme-toggle {
  color: var(--engine-theme-toggle);
  transition: 0.3s;
  height: 45px;
  width: 45px;
  line-height: 1.86;
  border-radius: 50%;
}
button.theme-toggle-btn:hover > .engine-theme-toggle,
button.theme-toggle-btn:active > .engine-theme-toggle {
  color: var(--engine-theme-toggle-hover);
  background: var(--engine-theme-toggle-background);
}
#ftta-container > i:hover,
#ftta-container > i:active {
  color: var(--engine-accent-color-1);
}
#left-block-container .account-action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.card .card-action a.accc-btn,
.card .card-action button.accc-btn {
  padding: 0 .6rem;
  margin: 0;
}
body.light-scheme a.accc-btn,
body.dark-scheme a.accc-btn,
body.light-scheme button.accc-btn,
body.dark-scheme button.accc-btn {
  transition: 0.3s !important;
  line-height: 1;
  border-radius: 6px;
  position: relative;
}
a.accc-btn .aabtn-counter {
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 0;
  left: 0;
}
body.light-scheme a.accc-btn:hover,
body.light-scheme a.accc-btn:focus,
body.dark-scheme a.accc-btn:hover,
body.dark-scheme a.accc-btn:focus,
body.light-scheme button.accc-btn:hover,
body.light-scheme button.accc-btn:focus,
body.dark-scheme button.accc-btn:hover,
body.dark-scheme button.accc-btn:focus {
  background: var(--engine-theme-toggle-background) !important;
  border-radius: 12px;
}
body.light-scheme a.accc-btn i.material-icons,
body.dark-scheme a.accc-btn i.material-icons,
body.light-scheme button.accc-btn i.material-icons,
body.dark-scheme button.accc-btn i.material-icons {
  color: var(--engine-account-buttons);
  transition: 0.3s !important;
  line-height: 1.64;
}
body.light-scheme a.accc-btn i.material-icons:hover,
body.light-scheme a.accc-btn i.material-icons:focus,
body.dark-scheme a.accc-btn i.material-icons:hover,
body.dark-scheme a.accc-btn i.material-icons:focus,
body.light-scheme button.accc-btn i.material-icons:hover,
body.light-scheme button.accc-btn i.material-icons:focus,
body.dark-scheme button.accc-btn i.material-icons:hover,
body.dark-scheme button.accc-btn i.material-icons:focus {
  color: var(--engine-account-buttons-hover);
}
.up-avatar {
  border-radius: 6px;
  margin: 10px 0 10px 20px !important;
}
.profile-tib-container > h5 {
  margin: 10px 0 0 0 !important;
}
.card-panel {
  margin-top: 0;
}
.z-depth-1, nav, .card-panel, .card, .toast, .btn, .btn-large, .btn-floating, .dropdown-content, .collapsible, .side-nav {
  box-shadow: 0 0 0 0;
  border: 1px solid var(--engine-border-color);
}
.staff-todo-container {
  padding: 0 !important;
  text-align: center !important;
}
.staff-todo-container h6 {
  margin: 0;
  padding: 20px 0;
  border-bottom: 1px solid var(--engine-border-color);
}
.staff-todo-container .personal-links a > img {
  display: none;
}
.staff-todo-container .personal-links a > span {
  font-size: 27px;
  background-color: var(--engine-accent-color-1);
  background: linear-gradient(135deg, var(--engine-accent-color-1), var(--engine-accent-color-1b));
  background-clip: border-box;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -moz-text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
.staff-todo-container .personal-links a > span:hover,
.staff-todo-container .personal-links a > span:focus {
  filter: brightness(1.3);
}
.tabs {
  background-color: var(--engine-card-bg);
}
.tabs .indicator {
  background-color: var(--engine-accent-color-2);
}
.tabs .tab a {
  color: var(--engine-accent-color-2);
}
.tabs .tab a:hover,
.tabs .tab a:active {
  color: var(--engine-accent-color-2a);
}
.polls-panel-items .row .col.s2 {
  margin-top: 4.4px;
}
.progress {
  height: 10px;
  background-color: transparent;
  border: 1px solid var(--engine-accent-color-1);
  margin: 7px 0 14px 0;
}
.progress .determinate {
  background-color: var(--engine-accent-color-1);
}
.tabs.fix-it.hide-on-large-only.fixed-pos {
  top: 60px;
  height: 50px;
  z-index: 997;
}
.tabs.fix-it.hide-on-large-only li, .tabs.fix-it.hide-on-large-only div {
  z-index: 1;
}
.tabs.fix-it.hide-on-large-only > span {
  display: none;
}
.tabs.fix-it.hide-on-large-only.fixed-pos > span {
  display: block !important;
  background: var(--engine-card-bg);
  width: 200vw;
  height: 58px;
  transform: translateX(-100vw);
  position: absolute;
  z-index: 0;
}
#middle-block .new-torrent-tag {
  background: var(--engine-accent-color-1);
  color: var(--main-bg);
  font-size: .8rem;
  padding: .1rem .4rem;
  border-radius: .2rem;
  margin-left: .5rem;
}
.torrents-table {
  margin: 2rem auto;
}
.torrents-table a, .popular-torrents a, .forums-panel-items a {
  color: var(--engine-body-color) !important;
}
.torrents-table a:hover, .popular-torrents a:hover, .forums-panel-items a:hover,
.torrents-table a:active, .popular-torrents a:active, .forums-panel-items a:active {
  color: var(--engine-accent-color-1) !important;
}
.card.center-align.tx-1-1 > div.mt-20 form.silent-submit > button {
  background-color: transparent !important;
  color: var(--engine-body-color);
  font-weight: normal;
  border-color: var(--engine-accent-color-1);
  transition: 0.3s;
  border-radius: 4px;
  height: 36px;
}
.card.center-align.tx-1-1 > div.mt-20 form.silent-submit > button:hover,
.card.center-align.tx-1-1 > div.mt-20 form.silent-submit > button:focus {
  background: var(--engine-accent-color-1) !important;
  color: var(--engine-button-color);
}
.card.center-align.tx-1-1 > h6 {
  padding-bottom: 5px !important;
}
#kuddus-trigger {
  border: 4px solid var(--engine-search-color) !important;
  background-color: var(--engine-search-background) !important;
  background: var(--engine-search-background) !important;
  transition: 0s;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  scale: .95;
}
#kuddus-trigger:hover {
  scale: 1;
}
#kuddus-trigger:active {
  transform: translateY(2px);
}
body.light-scheme #kuddus-trigger > i, #kuddus-trigger > i {
  color: var(--engine-search-color);
  text-shadow: none;
  margin-left: -2px;
}
.cnav-menu-item > a, .cnav-menu-item > span {
  color: var(--engine-menu-item) !important;
}
.cnav-menu-item > a:hover, .cnav-menu-item > span:hover,
.cnav-menu-item > a:active, .cnav-menu-item > span:active {
  background: var(--engine-menu-item-hover) !important;
}
.cnav > span > i {
  color: var(--engine-search-color);
}
.like-dislike > a, .likebtn {
  color: var(--engine-like-button) !important;
}
.like-dislike > a:hover, .likebtn:hover,
.like-dislike > a:active, .likebtn:active {
  color: var(--engine-accent-color-1) !important;
}
.posted-on > span.tooltipped {
  color: var(--engine-like-button);
}
.menu-extension {
  box-shadow: none;
  top: 62px;
}
.stats {
  color: var(--engine-accent-color-1);
}
.cnp-progress {
  background: var(--engine-seeders);
  color: var(--engine-content-title);
}
.cnp-info {
  left: 0;
  width: 100%;
  text-align: center;
}
.ft-lock-indicator {
  border-color: var(--engine-accent-color-1);
  color: var(--engine-accent-color-1);
}
body.light-scheme .forum-page-title, .forum-page-title {
  background: var(--engine-nav-bg);
  color: var(--engine-content-title);
}
body.light-scheme #left-block.lb-backtolife {
  background: var(--cmodal-dark-bg);
}
#left-block-container .staff-todo-container > hr {
  display: none;
}
.shoutbox-text {
  color: var(--engine-accent-color-1);
}
#shout-ibb-container span > i.material-icons {
  color: var(--engine-body-color);
}
#shout-ibb-container span > i.material-icons:hover,
#shout-ibb-container span > i.material-icons:active {
  color: var(--engine-accent-color-1);
}
.shout-time {
  color: var(--engine-body-color-light) !important;
}
.section-description, .updated-by-text, .comment-posted-on {
  color: var(--engine-accent-color-3);
}
body.dark-scheme .tx-sp, body.light-scheme .tx-sp, .tx-sp {
  color: var(--engine-accent-color-1);
}
body.dark-scheme .tx-sp:hover, body.light-scheme .tx-sp:hover, .tx-sp:hover,
body.dark-scheme .tx-sp:active, body.light-scheme .tx-sp:active, .tx-sp:active {
  color: var(--engine-accent-color-1a);
}
.mqi, .atqrm span {
  border-radius: 4px;
  padding: 3px 10px;
  border: 1px solid var(--engine-body-color);
  color: var(--engine-body-color);
}
.mqi.bluray {
  border-color: var(--engine-accent-color-1);
  color: var(--engine-accent-color-1);
}
.mqi.web {
  border-color: var(--engine-accent-color-2);
  color: var(--engine-accent-color-2);
}
.mqi.dvd {
  border-color: var(--engine-accent-color-3);
  color: var(--engine-accent-color-3);
}
.poster-container .chlts {
  background: var(--engine-media-hover-bg);
  color: var(--engine-body-color-stark);
}
[class^="mdi-"], [class*="mdi-"] {
  font-family: "Material Icons";
}
.mdi-navigation-arrow-drop-down::before {
  content: "\\e5c5";
}
.side-nav li:hover > a,
.side-nav li:active > a {
  color: var(--engine-button-color) !important;
}
.side-nav li.active > a.active {
  color: var(--engine-button-color) !important;
}
.side-nav li:hover, .side-nav li:active, .side-nav li.active {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color) !important;
}
.atwl-trigger-mini-block a {
  box-shadow: none;
}
.logo-svg {
  fill: var(--engine-logo-color);
}
.khoj-svg {
  fill: var(--engine-logo-color);
  height: calc(100% - 1em);
  margin: .5em 0 .5em 80px;
}
#logo-img {
  height: calc(100% - 1em);
  margin: .5em 0;
  padding: 0 0 0 10px;
}
img#logo-img, img#logo-img-sm {
  display: none;
}
.faqsr-container > #filter {
  color: var(--engine-body-color) !important;
}
#middle-block .customized a {
  color: var(--engine-accent-color-1);
}
#middle-block .teal-text {
  color: var(--engine-accent-color-1) !important;
}
#flash-message-container {
  background: var(--engine-accent-color-1);
  border-color: var(--engine-border-color);
  color: var(--engine-button-color);
}
#flash-message-container.error {
  background: var(--engine-leechers);
}
#middle-block li .collapsible-header.faqq {
  border-bottom: 1px solid var(--engine-border-color);
}
#middle-block li .collapsible-header.faqq:hover,
#middle-block li .collapsible-header.faqq:active {
  border-bottom: 1px solid var(--engine-accent-color-1);
  background: var(--engine-nav-bg);
}
#middle-block li .collapsible-header.faqq.active {
  font-weight: 700;
  background: var(--engine-nav-bg);
  border-bottom: 1px solid var(--engine-accent-color-1);
}
#middle-block .topsl-btn {
  color: var(--engine-body-color);
  background: none;
  border-color: var(--engine-accent-color-1) !important;
}
#middle-block .topsl-btn:hover,
#middle-block .topsl-btn:active,
#middle-block .topsl-btn:focus {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1);
}
form.pagireborn-form input.pagireborn-num:focus, input[type="text"]:focus:not([readonly]), input[type="password"]:focus:not([readonly]), input[type="email"]:focus:not([readonly]), input[type="url"]:focus:not([readonly]), input[type="time"]:focus:not([readonly]), input[type="date"]:focus:not([readonly]), input[type="datetime-local"]:focus:not([readonly]), input[type="tel"]:focus:not([readonly]), input[type="number"]:focus:not([readonly]), input[type="search"]:focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {
  border-color: var(--engine-accent-color-1);
}
input[type="text"]:focus:not([readonly]) + label, input[type="password"]:focus:not([readonly]) + label, input[type="email"]:focus:not([readonly]) + label, input[type="url"]:focus:not([readonly]) + label, input[type="time"]:focus:not([readonly]) + label, input[type="date"]:focus:not([readonly]) + label, input[type="datetime-local"]:focus:not([readonly]) + label, input[type="tel"]:focus:not([readonly]) + label, input[type="number"]:focus:not([readonly]) + label, input[type="search"]:focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {
  color: var(--engine-accent-color-1);
}
.cyan.darken-2 {
  background-color: var(--engine-accent-color-1) !important;
}
.modal-footer > .modal-footer-btn {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1) !important;
}
.modal-footer > .modal-footer-btn:hover,
.modal-footer > .modal-footer-btn:active {
  color: var(--engine-button-color-hover);
  background: var(--engine-accent-color-1a) !important;
}
.atwl-trigger-mini-block a {
  border-color: var(--engine-accent-color-1) !important;
  background: transparent !important;
  transition: .1s;
}
.atwl-trigger-mini-block a:hover,
.atwl-trigger-mini-block a:active,
.atwl-trigger-mini-block a:focus {
  border-color: var(--engine-accent-color-1) !important;
  color: var(--engine-body-color-stark) !important;
  background: var(--engine-accent-color-1) !important;
}
body.light-scheme .btn-outline {
  color: var(--engine-body-color);
}
body.light-scheme .atwl-trigger-mini-block a:hover,
body.light-scheme .atwl-trigger-mini-block a:active,
body.light-scheme .atwl-trigger-mini-block a:focus {
  border-color: var(--engine-accent-color-1) !important;
  color: var(--engine-body-color-stark) !important;
  background: var(--engine-accent-color-1) !important;
}
.movie-torrents-table .download-icon {
  color: inherit !important;
}
.btn, .btn-large {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1);
  transition: 0.3s;
}
.container a.btn-large[href='index.php'] {
  height: 54px;
  line-height: 50px;
}
.alert-box.success {
  background: var(--engine-seeders);
  border-color: var(--engine-seeders);
  color: var(--engine-button-color);
}
.btn:hover, .btn-large:hover,
.btn:active, .btn-large:active {
  color: var(--engine-button-color-hover);
  background: var(--engine-accent-color-1a);
}
.btn-floating, #torr-reset-btn {
  border: none;
}
.btn.btn-outline:hover,
.btn.btn-outline:focus,
.btn.btn-outline:focus {
  background: var(--engine-accent-color-1a);
  color: var(--engine-button-color-hover) !important;
}
#filter-form .fltrsb-btn {
  color: var(--engine-button-color) !important;
  background: var(--engine-accent-color-1) !important;
}
#filter-form .fltrsb-btn:hover,
#filter-form .fltrsb-btn:active {
  color: var(--engine-button-color) !important;
  background: var(--engine-accent-color-1a) !important;
}
#filter-form .goat-checker label, #gpm-hide {
  color: var(--engine-leechers);
}
[type="checkbox"].filled-in:checked + label::before {
  border-right: 2px solid var(--engine-button-color);
  border-bottom: 2px solid var(--engine-button-color);
}
[type="checkbox"].filled-in:checked + label::after {
  border-color: var(--engine-accent-color-1);
  background-color: var(--engine-accent-color-1);
}
.red.lighten-2 {
  background-color: var(--engine-leechers) !important;
}
.goat-checker label {
  font-size: 17px;
  line-height: 21px;
}
ul.pagination, ul.pagination-new {
  text-align: center;
}
ul.pagination li {
  list-style-type: none;
  display: inline-block;
  margin: 3px 2px;
  font-family: inherit;
  font-size: 14px;
  height: 28px;
  border: 1px solid var(--border-color);
  border-radius: 0;
}
ul.pagination li.active {
  background: var(--nav-bg);
  color: whitesmoke;
  cursor: initial;
  border-radius: 0;
}
ul.pagination li a {
  color: var(--body-color);
  line-height: 26px;
  padding: 0 10px;
  border-radius: 0;
}
ul.pagination li a:hover {
  color: var(--body-color);
}
ul.pagination li.active a {
  color: whitesmoke;
  cursor: initial;
}
form.pagireborn-form input.pagireborn-btn:hover,
form.pagireborn-form input.pagireborn-num:hover,
span.pagireborn-span:hover,
.paginator:not(.active):hover,
.pagination li:not(.active):hover,
.hisPagination .hisLi #hisSelect:hover {
  background: var(--engine-theme-toggle-background);
}
.paginator.active, ul.pagination li.active, ul.pagination li.active a {
  color: var(--engine-content-title) !important;
  background: var(--engine-nav-bg);
  border-radius: 0;
}
.paginator.active a { /* , .pagination li:not(.active) a */
  color: var(--engine-body-color-stark);
}
/*.paginator.nl, .paginator a, .pagination a {
  border-color: transparent; // Borders on pagination disabled to support pagination reborn.
}*/
select:focus {
  outline-color: var(--engine-accent-color-1);
}
option {
  background: var(--engine-card-bg) !important;
  color: var(--engine-body-color) !important;
}
#fltrrst-btn {
  border: none;
}
td.mt_more-trigger {
  font-size: 1.05em;
  color: var(--engine-accent-color-1);
}
td.mt_more-trigger:hover,
td.mt_more-trigger:active {
  color: var(--engine-accent-color-1a);
}
.loader-spinner {
  background-color: var(--engine-accent-color-1);
}
body.light-scheme .into-limelight > .post-container, .into-limelight > .post-container {
  border-width: 2px;
  border-image: linear-gradient(to bottom right, var(--engine-accent-color-1), var(--engine-accent-color-1), transparent, transparent) 10 1%;
}
.teal.lighten-1 {
  background-color: var(--engine-accent-color-1) !important;
}
.green.darken-1 {
  background-color: var(--engine-seeders) !important;
}
.btn.teal.darken-1 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn.teal.darken-1:hover,
.btn.teal.darken-1:active {
  background-color: var(--engine-accent-color-1a) !important;
}
.btn-floating.blue.darken-2 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn-floating.blue.darken-2:hover,
.btn-floating.blue.darken-2:active {
  background-color: var(--engine-accent-color-1a) !important;
}
.btn-floating.blue.darken-3 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn-floating.blue.darken-3:hover,
.btn-floating.blue.darken-3:active {
  background-color: var(--engine-accent-color-1a) !important;
}
.btn-floating.green.darken-1 {
  background-color: var(--engine-accent-color-2) !important;
}
.btn-floating.green.darken-1:hover,
.btn-floating.green.darken-1:active {
  background-color: var(--engine-accent-color-2a) !important;
}
.btn-floating.deep-orange.lighten-1 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn-floating.deep-orange.lighten-1:hover,
.btn-floating.deep-orange.lighten-1:active {
  background-color: var(--engine-accent-color-1a) !important;
}
.btn-floating i {
  color: var(--engine-button-color);
}
.btn-floating i:hover,
.btn-floating i:active {
  color: var(--engine-button-color-hover);
}
.gratitude legend {
  color: var(--engine-accent-color-1);
}
.scrollToTop:hover,
.scrollToTop:active {
  opacity: 1;
}
.bbc-btn, .bbc-option, .bbc-more {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1) !important;
}
.bbc-btn:hover, .bbc-btn:active,
.bbc-more:hover, .bbc-more:active {
  color: var(--engine-button-color-hover);
  background: var(--engine-accent-color-1);
}
.btn.teal.darken-3 {
  background-color: var(--engine-accent-color-2) !important;
}
.btn.teal.darken-3:hover,
.btn.teal.darken-3:active {
  background-color: var(--engine-accent-color-2a) !important;
}
.btn.blue.darken-3 {
  background-color: var(--engine-accent-color-3) !important;
}
.btn.blue.darken-3:hover,
.btn.blue.darken-3:active {
  background-color: var(--engine-accent-color-3a) !important;
}
.btn.light-blue.darken-3 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn.light-blue.darken-3:hover,
.btn.light-blue.darken-3:active {
  background-color: var(--engine-accent-color-1a) !important;
}
.btn.green.darken-2 {
  background-color: var(--engine-accent-color-1) !important;
}
.btn.green.darken-2:hover,
.btn.green.darken-2:active {
  background-color: var(--engine-accent-color-1a) !important;
}
#middle-block > h5.blue.lighten-2.center.white-text[style*='padding'] {
  font-size: 1.4rem;
  background: var(--engine-seeders) !important;
  color: var(--engine-button-color) !important;
  margin: 0;
  line-height: 1.55;
} /* Friend Request Accepted */
#middle-block > div.error.center[style*='padding'] {
  background: var(--engine-leechers);
  color: var(--engine-button-color);
  font-size: 1.4rem;
  line-height: 1.55;
} /* Friend Request Error */
.hti-sf-si {
  color: var(--engine-body-color);
}
.hti-sf-si:hover, .hti-sf-si:active {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1);
}
.switch label input[type="checkbox"]:checked + .lever {
  background-color: var(--engine-accent-color-1a);
}
.switch label input[type="checkbox"]:checked + .lever::after {
  background-color: var(--engine-accent-color-1);
}
label {
  color: var(--engine-body-color);
}
input[type="checkbox"]:checked:not(:disabled) ~ .lever:active::after, input[type="checkbox"]:not(:disabled) ~ .lever:active::after, .switch label .lever::after {
  box-shadow: none;
}
.switch label .lever {
  background-color: var(--engine-body-color-light);
}
.switch label .lever::after {
  background-color: var(--engine-body-color-stark);
}
#middle-block .sc-trigger {
  border-color: var(--engine-nav-bg);
  border-radius: 0;
  color: var(--engine-content-title);
  background: var(--nav-bg);
}
#middle-block .season-intro {
  margin: 0;
  border-radius: 0;
}
#middle-block .season-intro {
  color: var(--engine-accent-color-1);
}
#middle-block table.tv-table tbody tr td {
  border-color: var(--engine-border-color);
}
#middle-block tbody tr.epi-trigger td {
  color: var(--engine-body-color);
}
#middle-block tbody tr.epi-trigger {
  background: var(--engine-table-odd-bg);
}
#middle-block table.tv-table tbody tr a {
  color: var(--engine-body-color);
}
#middle-block table.tv-table tbody tr a:hover,
#middle-block table.tv-table tbody tr a:active {
  color: var(--engine-accent-color-1);
}
.imdb-data .imdb-data-label {
  color: var(--engine-accent-color-2);
  font-weight: bold;
}
.short-links {
  color: var(--engine-shortlink-color);
  background: var(--engine-accent-color-1b);
}
.short-links .short-link-counter {
  color: var(--engine-shortlink-color);
  background: var(--engine-accent-color-1d);
}
#general-info .btn-links {
  border-color: var(--engine-accent-color-2);
  border-width: 1px;
  border-radius: 4px;
  padding: 2px 8px;
}
#general-info .btn-links:hover,
#general-info .btn-links:active {
  background: var(--engine-accent-color-2);
  color: var(--engine-button-color);
}
#general-info .sub-h6, #security .sub-h6, #description .sh6 {
  background: var(--engine-nav-bg);
  border: none;
  border-left: 4px solid var(--engine-accent-color-1);
  color: var(--engine-content-title);
  padding: 3px 9px;
}
#middle-block .sub-header {
  background: var(--engine-nav-bg);
}
#middle-block .sub-header .sub-header--title {
  color: var(--engine-content-title);
}
#middle-block .icon-input-box input[type="text"]:focus {
  border-color: var(--engine-accent-color-1);
}
#middle-block .icon-input-box input {
  background: var(--engine-table-odd-bg);
  color: var(--engine-body-color);
  border: none;
  border-bottom: 1px solid transparent;
}
#middle-block .icon-input-box input:focus {
  color: var(--engine-body-color-stark);
  border-bottom: 1px solid var(--engine-accent-color-1);
}
#middle-block .icon-input-box i {
  color: var(--engine-body-color);
  background: var(--engine-nav-bg);
}
.picker__date-display {
  background-color: var(--engine-accent-color-1);
  color: var(--engine-body-color-stark);
}
.picker__weekday-display {
  background-color: var(--engine-accent-color-1b);
}
.picker__year-display {
  color: var(--engine-body-color);
}
.picker__box {
  border: none;
  background: var(--engine-card-bg);
}
.picker__nav--prev::before {
  border-right-color: var(--engine-body-color);
  margin-top: 4px;
}
.picker__nav--next::before {
  border-left-color: var(--engine-body-color);
  margin-top: 4px;
}
.picker__nav--prev:hover::before,
.picker__nav--prev:active::before {
  border-right-color: var(--engine-accent-color-1);
}
.picker__nav--next:hover::before,
.picker__nav--next:active::before {
  border-left-color: var(--engine-accent-color-1);
}
.picker__nav--prev:hover, .picker__nav--next:hover,
.picker__nav--prev:active, .picker__nav--next:active {
  background: transparent;
}
.picker__select--month.browser-default, .picker__select--year.browser-default {
  background: var(--engine-table-odd-bg);
}
.picker__day--infocus {
  color: var(--engine-body-color);
}
.picker__day--infocus:not(.picker__day--selected.picker__day--highlighted):hover,
.picker__day--infocus:not(.picker__day--selected.picker__day--highlighted):active {
  color: var(--engine-accent-color-1);
}
.picker__day--selected.picker__day--highlighted {
  border-radius: 6px;
  color: var(--engine-body-color-stark);
  background-color: var(--engine-accent-color-1);
}
.picker__day.picker__day--today {
  color: var(--engine-body-color-stark);
  font-weight: bold;
}
.picker__footer .btn-flat {
  color: var(--engine-accent-color-1);
  background: transparent !important;
  border: none;
  font-weight: bold;
}
.picker__footer .btn-flat.picker__clear {
  color: var(--engine-accent-color-2);
}
.picker__footer .btn-flat:hover,
.picker__footer .btn-flat:active {
  color: var(--engine-accent-color-1a);
}
.picker__footer .btn-flat.picker__clear:hover,
.picker__footer .btn-flat.picker__clear:active {
  color: var(--engine-accent-color-2a);
}
#friends .friend-card {
  border-color: transparent;
  background: var(--engine-table-odd-bg);
}
#friends .friend-card--delete::after {
  background: transparent;
}
#friends .friend-card--delete,
.btn-outline.danger {
  transition-duration: 0s;
  color: var(--engine-body-color);
  background: transparent;
  border: 0;
}
#friends .friend-card--delete:hover,
#friends .friend-card--delete:active,
.btn-outline.danger:hover,
.btn-outline.danger:active {
  color: var(--engine-accent-color-1);
  background: transparent;
}
.btn-outline.danger:hover i,
.btn-outline.danger:active i {
  color: var(--engine-accent-color-1) !important;
}
button.no-style:focus,
.btn-outline.danger:focus {
  background: transparent;
}
.show_password_icon {
  color: var(--engine-body-color);
}
.show_password_icon:hover,
.show_password_icon:active {
  color: var(--engine-accent-color-1);
}
.show_password_icon[data-tooltip*="Hide Password"] {
  color: var(--engine-accent-color-1) !important;
}
[type="radio"].with-gap:checked + label::before {
  border-radius: 4px;
  border-color: var(--engine-accent-color-1);
}
[type="radio"].with-gap:checked + label::after {
  border-color: var(--engine-accent-color-1);
  background-color: var(--engine-accent-color-1);
  border-radius: 2px;
}
[type="radio"]:not(:checked) + label::before, [type="radio"]:not(:checked) + label::after {
  border-color: var(--engine-body-color-light);
  border-radius: 4px;
}
[type="radio"]:checked + label::after {
  border-radius: 4px;
  border-color: var(--engine-accent-color-1);
  background-color: var(--engine-accent-color-1);
}
.btn-outline.critical {
  background: transparent;
  color: var(--engine-leechers);
  border-color: var(--engine-leechers);
}
.btn-outline.critical:hover,
.btn-outline.critical:active,
.btn-outline.critical:focus {
  color: var(--engine-body-color-stark);
  background: var(--engine-leechers);
}
[type="checkbox"]:checked + label::before {
  border-right-color: var(--engine-accent-color-1);
  border-bottom-color: var(--engine-accent-color-1);
}
.swal-button.swal-button--confirm,
.swal-button.swal-button--redo {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
.swal-button.swal-button--confirm:hover,
.swal-button.swal-button--confirm:active,
.swal-button.swal-button--redo:hover,
.swal-button.swal-button--redo:active {
  background: var(--engine-accent-color-1a);
  color: var(--engine-button-color-hover);
}
.swal-button.swal-button--cancel {
  background: var(--engine-accent-color-2);
  color: var(--engine-button-color);
}
.swal-button.swal-button--cancel:hover,
.swal-button.swal-button--cancel:active {
  background: var(--engine-accent-color-2a);
  color: var(--engine-button-color-hover);
}
#middle-block #profile .select-field-custom, #middle-block #profile .select-field-custom select {
  background: var(--engine-table-odd-bg);
  color: var(--engine-body-color);
}
#middle-block #profile .select-field-custom:hover, #middle-block #profile .select-field-custom select:hover,
#middle-block #profile .select-field-custom:active, #middle-block #profile .select-field-custom select:active {
  color: var(--engine-body-color-stark);
}
#middle-block #profile .select-field-custom::after {
  color: var(--engine-body-color);
  background: var(--engine-nav-bg);
}
#middle-block #profile .select-field-custom:hover::after,
#middle-block #profile .select-field-custom:active::after {
  color: var(--engine-accent-color-1);
}
#middle-block #profile .z-depth-1 {
  border: none;
}
#messages #top-options #msg-search {
  border-color: var(--engine-accent-color-1);
}
#messages .listitem-container .listitem {
  border-color: var(--engine-border-color) !important;
  background: var(--engine-card-bg) !important;
  color: var(--engine-body-color) !important;
}
#messages .listitem-container:hover .listitem,
#messages .listitem-container:active .listitem {
  border-color: var(--engine-accent-color-1) !important;
  background: var(--engine-nav-bg) !important;
  color: var(--engine-body-stark) !important;
}
#messages .backBtn {
  color: var(--engine-accent-color-1);
}
#messages .backBtn:hover,
#messages .backBtn:active {
  color: var(--engine-accent-color-1a);
}
#messages .replyBtn {
  color: var(--engine-button-color) !important;
  background: var(--engine-accent-color-1) !important;
}
#messages .replyBtn:hover,
#messages .replyBtn:active {
  background: var(--engine-accent-color-1a) !important;
}
#messages .message-subject {
  color: var(--engine-accent-color-1);
}
#messages .messageitem.youwrote .message-body {
  background: var(--engine-card-bg) !important;
}
#messages .messageitem.iwrote .message-body {
  background: var(--engine-table-odd-bg) !important;
}
#middle-block table.notif-table * {
  border: none;
}
#middle-block table.notif-table tbody tr {
  border-bottom: 1px solid transparent;
}
#middle-block table.notif-table tbody tr:hover,
#middle-block table.notif-table tbody tr:active {
  color: var(--engine-accent-color-1);
  border-bottom: 1px solid var(--engine-accent-color-1);
}
#login-form * {
  border: none;
}
#login-form *:not(a, button, label, .auth-form-header) {
  color: var(--engine-body-color);
}
#login-form .auth-form-header, #recovery-form .auth-form-header {
  background: var(--engine-nav-bg);
  margin: 0;
  color: var(--engine-content-title);
}
#login-form .auth-card-container, #recovery-form .auth-card-container {
  background: var(--engine-card-bg);
}
#login-form #username, #login-form #password {
  border-bottom: 1px solid var(--engine-body-color);
}
#login-form #username:focus, #login-form #password:focus {
  border-bottom: 1px solid var(--engine-accent-color-1);
}
#login-form .input-field:focus label, #login-form .input-field:active label, #login-form label.active {
  color: var(--engine-accent-color-1);
}
#login-form .prlg-option a {
  color: var(--engine-body-color);
}
#login-form .prlg-option:hover a,
#login-form .prlg-option:active a {
  color: var(--engine-accent-color-1);
}
#login-form #submit-btn:focus, #recovery-form #submit-btn:focus,
#login-form #submit-btn:active, #recovery-form #submit-btn:active {
  background: var(--engine-accent-color-1a);
}
#recovery-form .card-panel {
  background: transparent;
}
body:not(.dark-scheme, .light-scheme) .white-text {
  color: var(--engine-body-color) !important;
}
body:not(.dark-scheme, .light-scheme) .logo-svg {
  fill: var(--engine-body-color-stark);
}
.cnav .cnav-menu-item > a:hover, .cnav .cnav-menu-item > span:hover,
.cnav .cnav-menu-item > a:active, .cnav .cnav-menu-item > span:active {
  color: var(--engine-button-color) !important;
}
.cnav .cnav-menu-item > * {
  transition: 0.3s;
}
.forum-repu {
  background: var(--engine-accent-color-1b);
  padding: 1px 4px;
  border-radius: 6px;
}
#reply-modal #forum-reply-form .bbc-btn-container {
  margin-bottom: 12px;
}
#middle-block .ccomment-item > .comment-content {
  background: var(--engine-card-bg);
}
.gratitude .tgaction {
  color: var(--engine-body-color-stark);
}
#sbgift-modal {
  color: var(--engine-content-title);
}
div[onclick*="loadTopUploadersPanel()"] > img {
  visibility: hidden;
}
#middle-block .torrtopbtn-wrapper > a:not(#guard-btn), #middle-block .torrtopbtn-wrapper > form > button, #middle-block #thanks-button, #middle-block #add-rep-button, #middle-block #gift-sb-button {
  background: transparent;
  color: var(--engine-body-color);
  font-weight: normal;
  border-color: var(--engine-accent-color-1);
}
#middle-block .torrtopbtn-wrapper > a:not(#guard-btn):hover, #middle-block .torrtopbtn-wrapper > form > button:hover, #middle-block #thanks-button:hover, #middle-block #add-rep-button:hover, #middle-block #gift-sb-button:hover,
#middle-block .torrtopbtn-wrapper > a:not(#guard-btn):active, #middle-block .torrtopbtn-wrapper > form > button:active, #middle-block #thanks-button:active, #middle-block #add-rep-button:active, #middle-block #gift-sb-button:active {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
/* Support for Ratio Guard */
#middle-block .torrtopbtn-wrapper > a#guard-btn:hover, #middle-block .torrtopbtn-wrapper > a#guard-btn:active {
  color: var(--engine-button-color);
  font-weight: 400;
}
/* Support for Shoutbox Spotlight */
#middle-block #spotlight-emojis spotfilter key {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1);
}
#middle-block #spotlight-emojis spotfilter key:hover,
#middle-block #spotlight-emojis spotfilter key:focus,
#middle-block #spotlight-emojis spotfilter key.active {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
.grey.lighten-4 {
  background-color: transparent !important;
}
.card-panel .pr-action-container .btn-floating {
  background: var(--engine-accent-color-1);
}
.card-panel .pr-action-container .btn-floating:hover,
.card-panel .pr-action-container .btn-floating:active {
  background: var(--engine-accent-color-1a);
}
#news-outline .news-content > h5, #news-outline .news-content > span > a {
  color: var(--engine-accent-color-1) !important;
}
#news-outline .news-content > span > a:hover,
#news-outline .news-content > span > a:active {
  color: var(--engine-accent-color-1a) !important;
}
button:focus {
  background-color: var(--engine-accent-color-1a);
}
#middle-block .h-ind.i-red {
  border-color: var(--engine-leechers);
}
#middle-block .h-ind.i-green {
  border-color: var(--engine-seeders);
}
body.dark-scheme #middle-block .trgbtn, body.light-scheme #middle-block .trgbtn, #middle-block .trgbtn {
  border-color: var(--engine-accent-color-1);
  color: var(--engine-accent-color-1);
  border-radius: 5px;
  font-size: 1.4em;
}
body #middle-block .trgbtn:hover {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color);
}
body.dark-scheme #middle-block .instr-trg, body.light-scheme #middle-block .instr-trg, .instr-trg {
  border-color: var(--engine-border-color);
  margin-top: 20px;
}
#middle-block .pg-intro {
  color: var(--engine-accent-color-1);
}
.comm-report:hover,
.comm-report:active {
  color: var(--engine-accent-color-1a) !important;
}
#middle-block .btn-clear {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1);
}
#middle-block .btn-clear:hover,
#middle-block .btn-clear:focus,
#middle-block .btn-clear:active {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1);
}
form[action='take-donation.php'] h5 {
  color: var(--engine-accent-color-1) !important;
}
#facilities .donation-card {
  background: var(--engine-accent-color-1c) !important;
  color: var(--body-color);
  border-color: var(--engine-accent-color-1);
  border-radius: 6px;
}
#form .donation-form-panel {
  background: var(--engine-body-bg) !important;
}
#mobile-demo {
  padding: 80px 0 20px 0;
}
.collapsible-header i {
  margin-right: 0;
}
#sidenav-overlay {
  z-index: 998;
}
#gpm-wrapper {
  max-height: 100vh;
}
hr {
  /*border-color: var(--border-color) !important;*/
  border: 0 !important;
  background: var(--border-color);
  height: 2px;
}
#notif-wrapper {
  top: 15px;
}
#notif-container-header, body.light-scheme #notif-container-header {
  background: var(--engine-nav-bg);
  color: var(--engine-content-title);
}
#notif-close-btn {
  background: var(--engine-leechers);
  color: var(--engine-button-color);
}
#notif-close-btn:hover {
  filter: brightness(1.1);
  color: var(--engine-button-color-hover);
}
#v-a-notif-btn {
  border: 1px solid var(--engine-accent-color-1);
  color: var(--engine-accent-color-1);
}
#v-a-notif-btn:hover {
  background: var(--engine-accent-color-1);
  color: var(--engine-button-color-hover);
}
body.dark-scheme #notif-container, body.dark-scheme .notif-item a,
body.light-scheme #notif-container, body.light-scheme .notif-item a {
  color: var(--engine-body-color);
}
body.dark-scheme .notif-time,
body.light-scheme .notif-time {
  color: var(--engine-body-color-light);
}
body.dark-scheme #notif-container,
body.light-scheme #notif-container {
  background: var(--engine-card-bg);
  border: 1px solid var(--engine-border-color);
}
.cmodal {
  animation: fadeInUp .25s ease-in-out forwards;
}
.cmodal .cmodal-header {
  height: 62px;
  line-height: 62px;
  align-items: center;
  opacity: .95;
}
.cmodal .cmodal-title {
  padding: 0 0 0 80px;
}
.cmodal .cmodal-close {
  height: 100%;
  width: 80px;
  padding: 0;
  color: var(--engine-button-color);
  background: var(--engine-leechers);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cmodal .cmodal-close:hover,
.cmodal .cmodal-close:focus {
  filter: brightness(1.1);
}
.cmodal .cmodal-close i {
  padding: 0 28px;
}
.tclabel:hover {
  color: var(--engine-accent-color-1);
}
.ttcp .tclabel, .tcheckbox.attr .tclabel {
  color: var(--engine-accent-color-2);
}
.ttcp .tclabel:hover, .tcheckbox.attr .tclabel:hover {
  color: var(--engine-accent-color-1);
}
#kuddus-more-categories {
  color: var(--engine-accent-color-1);
  border-color: var(--engine-accent-color-1);
  font-weight: 600;
  transition: .28s ease;
}
#kuddus-more-categories:hover,
#kuddus-more-categories:focus {
  color: var(--engine-button-color);
  background: var(--engine-accent-color-1);
}
.tradiopill.ell [type="radio"] + label {
  border-color: var(--engine-accent-color-1);
}
body .border-teal, body .input-override,
body .input-override:focus {
  border-color: var(--engine-accent-color-1) !important;
}
.tradio select.browser-default, .tradio input.input-override {
  border-radius: 5px !important;
}
input[type=range]::-webkit-slider-thumb {
  background-color: var(--engine-accent-color-1);
}
input[type=range]::-moz-range-thumb {
  background: var(--engine-accent-color-1);
}
input[type=range]::-ms-thumb {
  background: var(--engine-accent-color-1)
}
.profile-picture-box--img.active {
  max-width: initial;
  transform: translateY(30px);
}
.btn i, .btn-large i, .btn-floating i, .btn-large i, .btn-flat i {
  font-size: 1.4rem;
}
.mimtb .mimtb-container {
  margin-bottom: 0;
  padding: 15px !important;
}
.mimtb-backdrop {
  background-image: var(--engine-card-bg) !important;
}
#kuddus-searchkey {
  font-size: unset;
  border: unset;
  border-radius: unset;
  padding: unset;
  background-color: unset;
  height: unset;
  width: unset;
  margin: unset;
  line-height: unset;
  flex: 1 0 auto;
  padding-left: 3.21428571429rem;
  position: relative;
  z-index: 2;
}
#kuddus-searchtype {
  position: relative;
  top: unset;
  left: unset;
  width: unset;
  height: unset;
  font-weight: unset;
  border: unset;
  padding: unset;
  font-size: unset;
  letter-spacing: unset;
  text-transform: unset;
  text-shadow: unset;
  border-radius: unset;
  background: unset;
  transition: color .1s linear;
  padding-left: 3.21428571429rem;
  z-index: 2;
  flex: 1 0 auto;
}
#engine-search-field {
  display: flex;
  gap: 1.5rem;
  padding: 0 .5rem;
  margin-bottom: 1.5rem;
}
#engine-search-field span {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .1s linear, transform .1s linear;
  position: absolute;
  margin: .75rem;
  z-index: 1;
}
#engine-search-field #engine-search-clear {
  position: relative;
  z-index: 2;
}
#engine-search-field > left,
#engine-search-field > right {
  display: flex;
  height: 3.21428571429rem;
  font-size: 1.2rem;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-sp-light-color);
  transition: border-color .2s linear, color .1s linear;
}
#engine-search-field > left,
#engine-search-clear {
  cursor: pointer;
}
#engine-search-field > left {
  position: relative;
  padding: 0;
}
#engine-search-field > right {
  flex: 1 0 auto;
}
#engine-search-field > left:hover,
#engine-search-field > left:hover > select {
  color: var(--engine-body-color-stark);
}
#engine-search-field > left:focus-within,
#engine-search-field > right:focus-within {
  border-color: var(--engine-accent-color-1);
}
#engine-search-clear:hover {
  transform: scale(1.35);
  color: var(--engine-accent-color-1);
}
#engine-search-clear:active {
  transform: scale(1);
}
#engine-search-clear:not(.showcase),
.kuddus-resetter-container {
  display: none;
}
body.error-body .message {
  color: var(--engine-leechers) !important;
}
@media only screen and (max-width: 480px) {
  #engine-search-field {
    flex-direction: column;
    gap: .25rem;
  }
}
/*
.mimtb .tposter {
  backdrop-filter: blur(12px) brightness(.8);
  padding: 10px 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
}
.mimtb .timdb {
  backdrop-filter: blur(12px) brightness(.8);
  padding: 10px 20px 11px 20px !important;
  margin: 0 !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
}
@media only screen and (min-width: 993px) {
  .mimtb .row .tposter.col.l3 {
    width: calc(25% - 15px);
    margin-right: 15px;
  }
  .mimtb .row .timdb.col.l9 {
    width: calc(75% - 15px);
    margin-left: 15px !important;
  }
}
*/
@media only screen and (max-width: 700px) {
  .up-avatar {max-width: 150px;margin: 10px 0 !important;}
  .avatar-container {text-align: center;}
  .top-dir {flex-direction: column;}
  .pr-action-container {flex-direction: row; margin-left: 0; margin-top: 10px;}
  .pr-action-container .btn-floating {margin-right: 7px;}
}
` + torvisitor();

// Conditional style declarations only inserted in certain pages.
const ifCSS = [`
  /* [0] Seedbonus Page */
  #middle-block div.row:first-of-type {
    background: var(--engine-card-bg);
  }`,`
  /* [1] Hit and Run Page */
  #middle-block .introcnt {
    background: var(--engine-card-bg);
    padding: 20px 5px;
    margin: 0 auto 30px auto;
  }`];

// Resident Script
const engineJS = `
function alterTheme(theme) {
  localStorage.setItem('theme',theme);
  if (theme === 'dark') {
    document.getElementById('lightStyle').type = "null";
    document.getElementById('darkStyle').type = "text/css";
  } else {
    document.getElementById('darkStyle').type = "null";
    document.getElementById('lightStyle').type = "text/css";
  }
}
function countOnlineUsers() {
  let x;
  for (x = 0; x < 5000; x++) {
    setTimeout(function() {if (document.getElementById('online-users-outline').getElementsByClassName('dl-sc-trg fx ').length > 0) {
      document.querySelector("div[onclick*='toggleOnlineUsers()']").children[0].innerHTML = "Online Users (" + document.getElementById('online-users-outline').getElementsByClassName('dl-sc-trg fx ').length + ")";
    }}, x);
    if (document.getElementById('online-users-outline').children[0].children[0].tagName.toLowerCase() === 'span') {break;}
  }
}
function deleteTableGap() {
  document.querySelector('.mt_more-trigger').parentNode.parentNode.removeChild(document.querySelector('.mt_more-trigger').parentNode.parentNode.querySelector('tr[style*="display: none;"]'));
}
`;

// Catch errors.
function catchErrors(e) {
    console.log(e instanceof TypeError)
    console.log(e.message)
    console.log(e.name)
    console.log(e.fileName)
    console.log(e.lineNumber)
    console.log(e.columnNumber)
    console.log(e.stack)
}

// Adding new CSS into TorrentBD website.
function addStyle(css, tag, type, temp) {
    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {window.location.reload();}
    style = document.createElement('style');
    style.setAttribute("type", type);
    if (!temp) {style.setAttribute("id", tag);}
    if (temp) {style.setAttribute("temp", temp);}
    style.innerHTML = css;
    head.insertBefore(style, null);
}

// Adding resident JS for onclick use.
function addScript(js, tag, type, temp) {
    let head, script;
    head = document.getElementsByTagName('head')[0];
    if (!head) {window.location.reload();}
    script = document.createElement('script');
    script.setAttribute("type", type);
    if (!temp) {script.setAttribute("id", tag);}
    if (temp) {script.setAttribute("temp", temp);}
    script.innerHTML = js;
    head.insertBefore(script, null);
}

// Launch the theme engine.
function engineMain(temp) {
    if (!temp) {
        // Launching at the end of head tag.
        try {
            if (localStorage.getItem('theme') === 'light') {
                addStyle(darkCSS, "darkStyle", "null");
                addStyle(lightCSS, "lightStyle", "text/css");
            } else {
                addStyle(darkCSS, "darkStyle", "text/css");
                addStyle(lightCSS, "lightStyle", "null");
            }
            addStyle(engineCSS, "globalStyle", "text/css");
            if (pathname.match(/\/seedbonus\.php/)) {addStyle(ifCSS[0], "ifStyle", "text/css");}
            if (pathname.match(/\/hnr\.php/)) {addStyle(ifCSS[1], "ifStyle", "text/css");}
            addScript(engineJS, "residentStyle", "text/javascript");
        } catch(e) {console.error("integrate-theme");catchErrors(e);}
    } else {
        // Launching temporarily, as early as possible.
        try {
            if (localStorage.getItem('theme') === 'light') {
                addStyle(darkCSS, "darkStyle", "null", temp);
                addStyle(lightCSS, "lightStyle", "text/css", temp);
            } else {
                addStyle(darkCSS, "darkStyle", "text/css", temp);
                addStyle(lightCSS, "lightStyle", "null", temp);
            }
            addStyle(engineCSS, "globalStyle", "text/css", temp);
            if (pathname.match(/\/seedbonus\.php/)) {addStyle(ifCSS[0], "ifStyle", "text/css", temp);}
            if (pathname.match(/\/hnr\.php/)) {addStyle(ifCSS[1], "ifStyle", "text/css", temp);}
            addScript(engineJS, "residentStyle", "text/javascript", temp);
        } catch(e) {console.error("integrate-theme-temp");catchErrors(e);}
    }
}

// Erase temporarily deployed remnants.
function eraseTemp(temp) {
    try {
        let tempObj = document.querySelectorAll('[temp="' + temp + '"]');
        for (let i = 0; i < tempObj.length; i++) {
            document.head.removeChild(tempObj[i]);
        }
    } catch(e) {console.error("erase-theme-temp");catchErrors(e);}
}

// Modify the theme toggle.
function setThemeToggle(theme) {
    let toggleBTN = document.querySelector("button.theme-toggle-btn");
    if (!toggleBTN) {return;}
    toggleBTN.setAttribute('onclick',"alterTheme(\'" + theme + "\');");
    toggleBTN.setAttribute('data-tippy-content',toggleBTN.getAttribute('data-tippy-content').replace(/Bright/gi,"Dawn").replace(/Dark/gi,"Dusk"));
    toggleBTN.innerHTML = "<i class='material-icons engine-theme-toggle engine-dusk'>brightness_7</i><i class='material-icons engine-theme-toggle engine-dawn'>brightness_4</i>";
}

// Check the currently active theme.
function checkCurrentTheme() {
    let body = document.getElementsByTagName('body')[0];
    if (!body) {return;}

    function setTheme(yes, no) {
        localStorage.setItem('theme', yes);
        document.getElementById(yes + 'Style').type = "text/css";
        document.getElementById(no + 'Style').type = "null";
        setThemeToggle(no);
    }

    if (body.className === "light-scheme") {
        setTheme('light','dark');
    } else if (body.className === "dark-scheme") {
        setTheme('dark','light');
    } else if (localStorage.getItem('theme') === 'light') {
        setTheme('light','dark');
    } else {
        setTheme('dark','light');
    }
}

// Add theme button in various places.
function addThemeButton() {
    let container, object;
    container = document.querySelector('#left-block-container .staff-todo-container .personal-links');
    if (!container) {return;}
    object = document.createElement('div');
    object.setAttribute('data-tippy-content', 'Customize Theme');
    object.innerHTML = '<a href="theme"><span class="material-icons">palette</span></a>';
    container.insertBefore(object, null);

    container = document.querySelector("#cnav-menu-container a[href*='notifications.php']").parentNode.parentNode;
    if (!container) {return;}
    object = document.createElement('div');
    object.className = "cnav-menu-item";
    object.innerHTML = '<a href="theme">Customize Theme</a>';
    container.insertBefore(object, container.children[4]);

    container = document.querySelector("#mobile-demo a[href*='notifications.php']").parentNode.parentNode;
    if (!container) {return;}
    object = document.createElement('li');
    object.innerHTML = '<a href="theme">Customize Theme</a>';
    container.insertBefore(object, container.children[4]);
}

// Custom BB Code.
function customBBCode() {
    if (!(window.location.pathname + window.location.search).match(/forums\.php.*viewtopic/)) {
        return;
    }
    try {
        const pbody = document.querySelectorAll('.container .post-body');
        for (let nm = 0; nm < pbody.length; nm++) {
            pbody[nm].innerHTML = pbody[nm].innerHTML.replace(/\[turl\](.*)\[\/turl\]/gi,"<a href='theme?$1' target='_blank'>$1</a>");
        }
    } catch(e) {console.error("custom-bb-code");catchErrors(e);}
}

// Calculate loading time.
function loadTime() {
    let loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    try {
        document.querySelector('footer .container a').innerHTML = 'Loaded in ' + (loadTime/1000).toFixed(2) + ' secs';
    } catch(e) {console.error("load-time-error");catchErrors(e);}
}

// Mark Torrents as Visited if allowed
function torvisitor() {
    let torvisitorCSS = `
a[href*='torrents-details.php?id=']:link,
a[href*='download.php?id=']:link {
  color: var(--engine-body-color) !important;
  transition: color 0s linear !important;
}
.shout-text a[href*='torrents-details.php?id=']:link {
  color: var(--link-color) !important;
}
a[href*='torrents-details.php?id=']:visited {
  color: var(--engine-accent-color-2) !important;
}
a[href*='torrents-details.php?id=']:hover,
a[href*='download.php?id=']:hover,
a[href*='torrents-details.php?id=']:focus,
a[href*='download.php?id=']:focus {
  color: var(--engine-accent-color-1) !important;
}
.shout-text a[href*='torrents-details.php?id=']:hover,
.shout-text a[href*='torrents-details.php?id=']:focus {
  color: var(--link-hover-color) !important;
}
`;

    if (localStorage.getItem("torvisit") === "true") {
        return torvisitorCSS;
    } else {
        return "";
    }
}

// Update favicon if allowed
function faviconSVG() {
    if (!localStorage.favstate || localStorage.favstate !== "true") {return;}
    if (document.querySelector("link[sizes='any']")) {return;}
    try {
        let curtheme = "theme" + localStorage.theme.replace("d","D").replace("l","L"),
            favsvg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300"><style>circle{fill:${getRGB(JSON.parse(localStorage.getItem(curtheme)).accent1)}}path{opacity:.8}</style><circle cx="150" cy="150" r="150"/><path d="M120.5 233.5c1.6-24.1 3.4-48.3 4.9-72.4.4-7.1.7-14.4-.2-21.4-1.5-11.4-8.5-16.8-20-15.1-8.2 1.2-16.1 3.9-24.1 6.2-6.5 1.9-12.8 4.6-19.3 6-10.5 2.3-17.8-1.3-21.6-10-5.1-11.4-3.6-21.8 4.9-27.9 4.5-3.2 9.7-5.8 14.9-7.4 32-9.9 64.7-15.5 98.2-16.8 38.4-1.5 76.1 3 113.2 12.8 3.5.9 4.5 2.2 3.8 5.8-2.5 12.7-9.2 17.9-22 16.5-3.7-.4-7.5-1.2-11.2-1.8-14.3-2.5-28.1-.5-41.3 4.9-15.4 6.3-22.9 18.8-24.8 34.7-.9 7.6-.4 15.3-.8 23-1.2 25.1-2.4 50.1-3.8 75.2-.5 8.7-1.1 17.4-2.6 26-3.8 22.1-17.2 29.9-38.5 22.7-9-3-9-3-9-12.5v-48.4c-.1-.1-.4-.1-.7-.1z"/></svg>`,
            favico = document.querySelectorAll("link[rel='icon']");
        favico[1].remove(); favico[0].setAttribute("sizes","any");
        favico[0].setAttribute("type","image/svg+xml");
        favico[0].href = "data:image/svg+xml;utf8," + favsvg;
    } catch(e) {console.error("favicon-update-svg");catchErrors(e);}
}

// Fix delayed favicon
function faviconFIX() {
    let fav = document.querySelector("link[sizes='any']"),
        favsvg = fav.getAttribute("href");

    fav.href = "";
    fav.href = favsvg;
}

// Update BBCodes
function updateBBCodes() {
    if (!bbcodes) {return;}

    bbcodes.strikethrough = { start: '[s]', end: '[/s]' };

    //<div class="bbc-btn" data-bbtarget="center" title="Center Align">Center</div>

    let bbCenter = document.querySelector('div.bbc-btn[data-bbtarget="center"]');

    let strikethrough = bbCenter.cloneNode(true);
    strikethrough.setAttribute('data-bbtarget','strikethrough');
    strikethrough.setAttribute('title','Strikethrough text');
    strikethrough.textContent = 'S';
    strikethrough.setAttribute('onclick','setBBCode($(this), null)');
    strikethrough.setAttribute('style','text-decoration: line-through');

    bbCenter.parentNode.insertBefore(strikethrough, bbCenter);
}

// Update the search box appearance
function searchNEW() {
    let mainDiv = document.querySelector('div.kuddus'),
    searchField = document.querySelector('#kuddus-searchkey'),
    selectList = document.querySelector('#kuddus-searchtype');

    var elem = document.createElement('div');
    elem.id = 'engine-search-field';
    elem.innerHTML = '<left></left><right></right>';
    mainDiv.insertBefore(elem, mainDiv.children[0]);

    let searchForm = document.querySelector('#engine-search-field');

    var elem = document.createElement('span');
    elem.innerHTML = '<i class="material-icons">tune</i>';
    elem.id = 'engine-search-tune';
    searchForm.children[0].appendChild(elem);

    searchForm.children[0].appendChild(selectList);

    var elem = document.createElement('span');
    elem.innerHTML = '<i class="material-icons">search</i>';
    elem.id = 'engine-search-icon';
    searchForm.children[1].appendChild(elem);

    searchForm.children[1].appendChild(searchField);

    var elem = document.createElement('span');
    elem.innerHTML = '<i class="material-icons">delete_outline</i>';
    elem.id = 'engine-search-clear';
    searchForm.children[1].appendChild(elem);

    let searchClear = document.querySelector('#engine-search-clear');

    function searchClearCheck() {
        if (searchField.value === "") {
            searchClear.classList.remove('showcase');
        } else {
            searchClear.classList.add('showcase');
        }
    }

    searchField.addEventListener('input', searchClearCheck);
    searchField.addEventListener('change', searchClearCheck);

    searchClear.addEventListener('click', function() {
        kuddusClearFilters();
        searchClearCheck();
    });
}

// Other internal modifications in the website.
function adjustElements() {
    try {searchNEW();} catch(e) {console.error("search-new");catchErrors(e);}
    try {document.querySelector('#logo-img').parentNode.innerHTML = fullSVG;} catch(e) {console.error("logo-full-svg");catchErrors(e);}
    try {document.querySelector('#logo-img-sm').parentNode.innerHTML = halfSVG;} catch(e) {console.error("logo-half-svg");catchErrors(e);}
    try {let kuddusKids = document.querySelector('#kuddus-wrapper .kuddus-title-bar').children;
         kuddusKids[0].removeAttribute("style"); kuddusKids[0].innerHTML = ""; kuddusKids[1].outerHTML = khojSVG;
         kuddusKids[2].innerHTML = '<i class="material-icons">close</i>';} catch(e) {console.error("khoj-svg");catchErrors(e);}
    try {document.querySelector("div[onclick*='loadTopUploadersPanel()']").innerHTML = "<i class='material-icons orange600'>stars</i>Top Uploaders";} catch(e) {console.error("adjust-elements-0");catchErrors(e);}
    try {document.querySelector("div[onclick*='toggleOnlineUsers()']").setAttribute('onclick',`toggleOnlineUsers(),countOnlineUsers();`);} catch(e) {console.error("adjust-elements-1");catchErrors(e);}
    try {let plinks = document.querySelectorAll('.staff-todo-container .personal-links img');
         plinks[0].outerHTML = '<span class="material-icons">bookmarks</span>';
         plinks[1].outerHTML = '<span class="material-icons">subscriptions</span>';
         plinks[2].outerHTML = '<span class="material-icons">description</span>';
         plinks[3].outerHTML = '<span class="material-icons">dns</span>';
         plinks[4].outerHTML = '<span class="material-icons">cloud_upload</span>';} catch(e) {console.error("adjust-elements-1");catchErrors(e);}
    if (window.location.pathname === "/account-details.php") {
        try {document.getElementById('general-info').querySelectorAll('h6[class*="margin-t-10 sub-h6"]')[0].classList.remove('margin-t-10');} catch(e) {console.error("adjust-elements-3");catchErrors(e);}
        try {document.getElementById('general-info').querySelectorAll('div[class*="col s12 m7 margin-b-20"]')[0].classList.remove('margin-b-20');} catch(e) {console.error("adjust-elements-4");catchErrors(e);}
    }
    try {let userClass = document.querySelectorAll('#left-block-container div.card-content p span.tbdrank')[0].parentNode;
         userClass.innerHTML = "<a href='user-classes.php' target='_blank'>" + userClass.innerHTML + "</a>";} catch(e) {console.error("adjust-elements-5");catchErrors(e);}
    if (window.location.pathname === "/torrents-details.php") {
        try {let container = document.querySelector('div.card-panel.row.torr-panel div.col.s12 .tabs.fix-it.hide-on-large-only');
             let object = document.createElement('span');
             container.appendChild(object);} catch(e) {console.error("adjust-elements-6");catchErrors(e);}
    }
    try {document.querySelector('#mobile-demo a[href*="faq.php?id=68"] > div.submenu-w-icon > div').innerText = "Increase Ratio";
         document.querySelector('#mobile-demo a[href*="faq.php?id=118"] > div.submenu-w-icon > div').innerText = "Allowed Torrent Clients";} catch(e) {console.error("adjust-elements-7");catchErrors(e);}
    try {document.querySelector('.mt_more-trigger').setAttribute('onclick',"setTimeout(deleteTableGap, 10);");} catch(e) {console.error("adjust-elements-8");catchErrors(e);}
    try {let scrollTop = '<i class="material-icons" style="transform: rotateZ(-90deg);">play_arrow</i>';
         document.querySelectorAll('.btn-floating.scrollToTop')[0].innerHTML = scrollTop;
         document.querySelectorAll('.btn-floating.scrollToTop')[1].innerHTML = scrollTop;} catch(e) {console.error("adjust-elements-9");catchErrors(e);}
    try {document.querySelector('span.toggle-trigger').innerHTML = '<i class="material-icons right oiv">alternate_email</i>';} catch(e) {console.error("adjust-elements-10");catchErrors(e);}
    try {function closeIcon(wait) {setTimeout(function() {
         try {let closeModal = document.querySelector(".cmodal .cmodal-close");
              closeModal.innerHTML = '<i class="material-icons">close</i>';
              closeModal.classList.add("waves-effect");} catch(e) {}}, wait);}
         closeIcon(50);closeIcon(100);closeIcon(200);closeIcon(400);} catch(e) {console.error("adjust-elements-11");catchErrors(e);}
    if (window.location.pathname.match(/\/forums\.php/)) {
        try {let faultyPosts = document.querySelectorAll('#middle-block div[id^="post"] .post-container div.row+div.col.s12');
             for (let x = 0; x < faultyPosts.length; x++) {
                 faultyPosts[x].parentNode.querySelector('div.row').appendChild(faultyPosts[x]);
             }} catch(e) {console.error("adjust-elements-12");catchErrors(e);}
        try {let fixPosts = document.querySelectorAll('#middle-block > div[id^="post"]');
             for (let x = 0; x < fixPosts.length; x++) {
                 fixPosts[x].parentNode.querySelectorAll('div.row')[1].appendChild(fixPosts[x]);
             }} catch(e) {}
        try {updateBBCodes();} catch(e) {}
    }
}

// Initiate engine station if the URL matches.
(function() {
    if (window.location.pathname === "/theme") {
        engineStation();
    }
})();

// Create engine station.
function engineStation() {
    // Ensure page is empty.
    let html = document.documentElement;
    if (!html) {window.location.reload();}
    html.parentNode.removeChild(html);

    // Update checker.
    async function updateAlert() {
        let child, parent;
        parent = document.querySelector('.g-bar');

        child = document.createElement('span');
        child.setAttribute('class','g-middle');
        child.innerHTML = '<a href="https://greasyfork.org/en/scripts/440627" target="_blank">Update available!</a>';

        let response = await fetch('https://raw.githubusercontent.com/NaeemBolchhi/torrentbd-theme-engine/main/_version');
        let remoteVer = await response.text();

        if (version < parseFloat(remoteVer)) {
            parent.insertBefore(child,parent.children[1]);
        }
    }

    // Texts displayed in dialogue boxes.
    const stationTXT = `
    const stringG = ["You have selected to apply this theme to TorrentBD. If you encounter any problems, you can always revert to the default theme from the gallery.",
                     "Which theme would you like to replace?",
                     "Light",
                     "Dark"],
          stringB = ["The string you are trying to apply is not valid JSON. Invalid strings may break the website or offer poor user experience.",
                     "Please confirm the validity of your string before continuing.",
                     "Return"],

          paletteG = ["You have selected to apply this theme to TorrentBD. If you encounter any problems, you can always revert to the default theme from the gallery.",
                      "Which theme would you like to replace?",
                      "Light",
                      "Dark"],
          paletteB = ["One or more values are invalid. Invalid values may break the website or offer poor user experience.",
                      "Please confirm the validity of your values before continuing.",
                      "Return"],

          galleryG = ["You have selected to apply this theme to TorrentBD. If you encounter any issues, you can reset everything to default from the config.",
                      "Which theme would you like to replace?",
                      "Light",
                      "Dark"],
          galleryB = ["There was a problem parsing the theme you selected. Posting a bug report to the support thread may help solving this issue.",
                      "Meanwhile, please try applying a different theme.",
                      "Return"],

          successG = ["Your selected theme has been applied. Get back to TorrentBD to see the new theme.",
                      "Alternatively, you can return to the Theme Engine.",
                      "Open TorrentBD",
                      "Return"],

          resetG = ["You are trying to reset everything to default. This will undo any user-made changes.",
                    "Alternatively, you can return to the Theme Engine.",
                    "Reset",
                    "Return"],

          advancedG = ["You have entered the Advanced Settings. These are experimental features that may not work as expected on every browser.",
                       "You can always reset these settings if something goes wrong.",
                       "Apply",
                       "Return"];
    `;

    // CSS and JS for the station.
    const qrcodeJS = `/*! * This was modified for use in TorrentBD Theme Engine. * Please visit https://github.com/davidshimjs/qrcodejs for the unmodified version. */var QRCode;!function(){function QR8bitByte(data){this.mode=QRMode.MODE_8BIT_BYTE,this.data=data,this.parsedData=[];for(var i=0,l=this.data.length;i<l;i++){var byteArray=[],code=this.data.charCodeAt(i);code>65536?(byteArray[0]=240|(1835008&code)>>>18,byteArray[1]=128|(258048&code)>>>12,byteArray[2]=128|(4032&code)>>>6,byteArray[3]=128|63&code):code>2048?(byteArray[0]=224|(61440&code)>>>12,byteArray[1]=128|(4032&code)>>>6,byteArray[2]=128|63&code):code>128?(byteArray[0]=192|(1984&code)>>>6,byteArray[1]=128|63&code):byteArray[0]=code,this.parsedData.push(byteArray)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function QRCodeModel(typeNumber,errorCorrectLevel){this.typeNumber=typeNumber,this.errorCorrectLevel=errorCorrectLevel,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}QR8bitByte.prototype={getLength:function(buffer){return this.parsedData.length},write:function(buffer){for(var i=0,l=this.parsedData.length;i<l;i++)buffer.put(this.parsedData[i],8)}},QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData),this.dataCache=null},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col)throw new Error(row+","+col);return this.modules[row][col]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(test,maskPattern){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++)this.modules[row][col]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(test,maskPattern),this.typeNumber>=7&&this.setupTypeNumber(test),null==this.dataCache&&(this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,maskPattern)},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++)if(!(row+r<=-1||this.moduleCount<=row+r))for(var c=-1;c<=7;c++)col+c<=-1||this.moduleCount<=col+c||(this.modules[row+r][col+c]=0<=r&&r<=6&&(0==c||6==c)||0<=c&&c<=6&&(0==r||6==r)||2<=r&&r<=4&&2<=c&&c<=4)},getBestMaskPattern:function(){for(var minLostPoint=0,pattern=0,i=0;i<8;i++){this.makeImpl(!0,i);var lostPoint=QRUtil.getLostPoint(this);(0==i||minLostPoint>lostPoint)&&(minLostPoint=lostPoint,pattern=i)}return pattern},createMovieClip:function(target_mc,instance_name,depth){var qr_mc=target_mc.createEmptyMovieClip(instance_name,depth),cs=1;this.make();for(var row=0;row<this.modules.length;row++)for(var y=1*row,col=0;col<this.modules[row].length;col++){var x=1*col,dark;this.modules[row][col]&&(qr_mc.beginFill(0,100),qr_mc.moveTo(x,y),qr_mc.lineTo(x+1,y),qr_mc.lineTo(x+1,y+1),qr_mc.lineTo(x,y+1),qr_mc.endFill())}return qr_mc},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++)null==this.modules[r][6]&&(this.modules[r][6]=r%2==0);for(var c=8;c<this.moduleCount-8;c++)null==this.modules[6][c]&&(this.modules[6][c]=c%2==0)},setupPositionAdjustPattern:function(){for(var pos=QRUtil.getPatternPosition(this.typeNumber),i=0;i<pos.length;i++)for(var j=0;j<pos.length;j++){var row=pos[i],col=pos[j];if(null==this.modules[row][col])for(var r=-2;r<=2;r++)for(var c=-2;c<=2;c++)this.modules[row+r][col+c]=-2==r||2==r||-2==c||2==c||0==r&&0==c}},setupTypeNumber:function(test){for(var bits=QRUtil.getBCHTypeNumber(this.typeNumber),i=0;i<18;i++){var mod=!test&&1==(bits>>i&1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod}for(var i=0;i<18;i++){var mod=!test&&1==(bits>>i&1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod}},setupTypeInfo:function(test,maskPattern){for(var data=this.errorCorrectLevel<<3|maskPattern,bits=QRUtil.getBCHTypeInfo(data),i=0;i<15;i++){var mod=!test&&1==(bits>>i&1);i<6?this.modules[i][8]=mod:i<8?this.modules[i+1][8]=mod:this.modules[this.moduleCount-15+i][8]=mod}for(var i=0;i<15;i++){var mod=!test&&1==(bits>>i&1);i<8?this.modules[8][this.moduleCount-i-1]=mod:i<9?this.modules[8][15-i-1+1]=mod:this.modules[8][15-i-1]=mod}this.modules[this.moduleCount-8][8]=!test},mapData:function(data,maskPattern){for(var inc=-1,row=this.moduleCount-1,bitIndex=7,byteIndex=0,col=this.moduleCount-1;col>0;col-=2)for(6==col&&col--;;){for(var c=0;c<2;c++)if(null==this.modules[row][col-c]){var dark=!1,mask;byteIndex<data.length&&(dark=1==(data[byteIndex]>>>bitIndex&1)),QRUtil.getMask(maskPattern,row,col-c)&&(dark=!dark),this.modules[row][col-c]=dark,-1==--bitIndex&&(byteIndex++,bitIndex=7)}if((row+=inc)<0||this.moduleCount<=row){row-=inc,inc=-inc;break}}}},QRCodeModel.PAD0=236,QRCodeModel.PAD1=17,QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){for(var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel),buffer=new QRBitBuffer,i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4),buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber)),data.write(buffer)}for(var totalDataCount=0,i=0;i<rsBlocks.length;i++)totalDataCount+=rsBlocks[i].dataCount;if(buffer.getLengthInBits()>8*totalDataCount)throw new Error("code length overflow. ("+buffer.getLengthInBits()+">"+8*totalDataCount+")");for(buffer.getLengthInBits()+4<=8*totalDataCount&&buffer.put(0,4);buffer.getLengthInBits()%8!=0;)buffer.putBit(!1);for(;!(buffer.getLengthInBits()>=8*totalDataCount||(buffer.put(QRCodeModel.PAD0,8),buffer.getLengthInBits()>=8*totalDataCount));)buffer.put(QRCodeModel.PAD1,8);return QRCodeModel.createBytes(buffer,rsBlocks)},QRCodeModel.createBytes=function(buffer,rsBlocks){for(var offset=0,maxDcCount=0,maxEcCount=0,dcdata=new Array(rsBlocks.length),ecdata=new Array(rsBlocks.length),r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount,ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount),maxEcCount=Math.max(maxEcCount,ecCount),dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++)dcdata[r][i]=255&buffer.buffer[i+offset];offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount),rawPoly,modPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1).mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=modIndex>=0?modPoly.get(modIndex):0}}for(var totalCodeCount=0,i=0;i<rsBlocks.length;i++)totalCodeCount+=rsBlocks[i].totalCount;for(var data=new Array(totalCodeCount),index=0,i=0;i<maxDcCount;i++)for(var r=0;r<rsBlocks.length;r++)i<dcdata[r].length&&(data[index++]=dcdata[r][i]);for(var i=0;i<maxEcCount;i++)for(var r=0;r<rsBlocks.length;r++)i<ecdata[r].length&&(data[index++]=ecdata[r][i]);return data};for(var QRMode={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},QRErrorCorrectLevel={L:1,M:0,Q:3,H:2},QRMaskPattern_PATTERN000=0,QRMaskPattern_PATTERN001=1,QRMaskPattern_PATTERN010=2,QRMaskPattern_PATTERN011=3,QRMaskPattern_PATTERN100=4,QRMaskPattern_PATTERN101=5,QRMaskPattern_PATTERN110=6,QRMaskPattern_PATTERN111=7,QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(data){for(var d=data<<10;QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0;)d^=QRUtil.G15<<QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15);return(data<<10|d)^QRUtil.G15_MASK},getBCHTypeNumber:function(data){for(var d=data<<12;QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0;)d^=QRUtil.G18<<QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18);return data<<12|d},getBCHDigit:function(data){for(var digit=0;0!=data;)digit++,data>>>=1;return digit},getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1]},getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern_PATTERN000:return(i+j)%2==0;case QRMaskPattern_PATTERN001:return i%2==0;case QRMaskPattern_PATTERN010:return j%3==0;case QRMaskPattern_PATTERN011:return(i+j)%3==0;case QRMaskPattern_PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern_PATTERN101:return i*j%2+i*j%3==0;case QRMaskPattern_PATTERN110:return(i*j%2+i*j%3)%2==0;case QRMaskPattern_PATTERN111:return(i*j%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern)}},getErrorCorrectPolynomial:function(errorCorrectLength){for(var a=new QRPolynomial([1],0),i=0;i<errorCorrectLength;i++)a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));return a},getLengthInBits:function(mode,type){if(1<=type&&type<10)switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode)}else if(type<27)switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode)}else{if(!(type<41))throw new Error("type:"+type);switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode)}}},getLostPoint:function(qrCode){for(var moduleCount=qrCode.getModuleCount(),lostPoint=0,row=0;row<moduleCount;row++)for(var col=0;col<moduleCount;col++){for(var sameCount=0,dark=qrCode.isDark(row,col),r=-1;r<=1;r++)if(!(row+r<0||moduleCount<=row+r))for(var c=-1;c<=1;c++)col+c<0||moduleCount<=col+c||0==r&&0==c||dark==qrCode.isDark(row+r,col+c)&&sameCount++;sameCount>5&&(lostPoint+=3+sameCount-5)}for(var row=0;row<moduleCount-1;row++)for(var col=0;col<moduleCount-1;col++){var count=0;qrCode.isDark(row,col)&&count++,qrCode.isDark(row+1,col)&&count++,qrCode.isDark(row,col+1)&&count++,qrCode.isDark(row+1,col+1)&&count++,0!=count&&4!=count||(lostPoint+=3)}for(var row=0;row<moduleCount;row++)for(var col=0;col<moduleCount-6;col++)qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)&&(lostPoint+=40);for(var col=0;col<moduleCount;col++)for(var row=0;row<moduleCount-6;row++)qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)&&(lostPoint+=40);for(var darkCount=0,col=0;col<moduleCount;col++)for(var row=0;row<moduleCount;row++)qrCode.isDark(row,col)&&darkCount++;var ratio;return lostPoint+=10*(Math.abs(100*darkCount/moduleCount/moduleCount-50)/5)}},QRMath={glog:function(n){if(n<1)throw new Error("glog("+n+")");return QRMath.LOG_TABLE[n]},gexp:function(n){for(;n<0;)n+=255;for(;n>=256;)n-=255;return QRMath.EXP_TABLE[n]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},i=0;i<8;i++)QRMath.EXP_TABLE[i]=1<<i;for(var i=8;i<256;i++)QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];for(var i=0;i<255;i++)QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;function QRPolynomial(num,shift){if(null==num.length)throw new Error(num.length+"/"+shift);for(var offset=0;offset<num.length&&0==num[offset];)offset++;this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++)this.num[i]=num[i+offset]}function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount,this.dataCount=dataCount}function QRBitBuffer(){this.buffer=[],this.length=0}QRPolynomial.prototype={get:function(index){return this.num[index]},getLength:function(){return this.num.length},multiply:function(e){for(var num=new Array(this.getLength()+e.getLength()-1),i=0;i<this.getLength();i++)for(var j=0;j<e.getLength();j++)num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));return new QRPolynomial(num,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;for(var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0)),num=new Array(this.getLength()),i=0;i<this.getLength();i++)num[i]=this.get(i);for(var i=0;i<e.getLength();i++)num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);return new QRPolynomial(num,0).mod(e)}},QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(null==rsBlock)throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);for(var length=rsBlock.length/3,list=[],i=0;i<length;i++)for(var count=rsBlock[3*i+0],totalCount=rsBlock[3*i+1],dataCount=rsBlock[3*i+2],j=0;j<count;j++)list.push(new QRRSBlock(totalCount,dataCount));return list},QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[4*(typeNumber-1)+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[4*(typeNumber-1)+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[4*(typeNumber-1)+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[4*(typeNumber-1)+3];default:return}},QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return 1==(this.buffer[bufIndex]>>>7-index%8&1)},put:function(num,length){for(var i=0;i<length;i++)this.putBit(1==(num>>>length-i-1&1))},getLengthInBits:function(){return this.length},putBit:function(bit){var bufIndex=Math.floor(this.length/8);this.buffer.length<=bufIndex&&this.buffer.push(0),bit&&(this.buffer[bufIndex]|=128>>>this.length%8),this.length++}};var QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];function _isSupportCanvas(){return"undefined"!=typeof CanvasRenderingContext2D}function _getAndroid(){var android=!1,sAgent=navigator.userAgent;if(/android/i.test(sAgent)){android=!0;var aMat=sAgent.toString().match(/android ([0-9]\.[0-9])/i);aMat&&aMat[1]&&(android=parseFloat(aMat[1]))}return android}var svgDrawer=function(){var Drawing=function(el,htOption){this._el=el,this._htOption=htOption};return Drawing.prototype.draw=function(oQRCode){var _htOption=this._htOption,_el=this._el,nCount=oQRCode.getModuleCount(),nWidth=Math.floor(_htOption.width/nCount),nHeight=Math.floor(_htOption.height/nCount);function makeSVG(tag,attrs){var el=document.createElementNS("http://www.w3.org/2000/svg",tag);for(var k in attrs)attrs.hasOwnProperty(k)&&el.setAttribute(k,attrs[k]);return el}this.clear();var svg=makeSVG("svg",{viewBox:"0 0 "+String(nCount)+" "+String(nCount),width:"100%",height:"100%",fill:_htOption.colorLight});svg.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),_el.appendChild(svg),svg.appendChild(makeSVG("rect",{fill:_htOption.colorLight,width:"100%",height:"100%"})),svg.appendChild(makeSVG("rect",{fill:_htOption.colorDark,width:"1",height:"1",id:"template"}));for(var row=0;row<nCount;row++)for(var col=0;col<nCount;col++)if(oQRCode.isDark(row,col)){var child=makeSVG("use",{x:String(col),y:String(row)});child.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),svg.appendChild(child)}},Drawing.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},Drawing}(),useSVG,Drawing="svg"===document.documentElement.tagName.toLowerCase()?svgDrawer:_isSupportCanvas()?function(){function _onMakeImage(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}if(this._android&&this._android<=2.1){var factor=1/window.devicePixelRatio,drawImage=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(image,sx,sy,sw,sh,dx,dy,dw,dh){if("nodeName"in image&&/img/i.test(image.nodeName))for(var i=arguments.length-1;i>=1;i--)arguments[i]=arguments[i]*factor;else void 0===dw&&(arguments[1]*=factor,arguments[2]*=factor,arguments[3]*=factor,arguments[4]*=factor);drawImage.apply(this,arguments)}}function _safeSetDataURI(fSuccess,fFail){var self=this;if(self._fFail=fFail,self._fSuccess=fSuccess,null===self._bSupportDataURI){var el=document.createElement("img"),fOnError=function(){self._bSupportDataURI=!1,self._fFail&&self._fFail.call(self)},fOnSuccess=function(){self._bSupportDataURI=!0,self._fSuccess&&self._fSuccess.call(self)};return el.onabort=fOnError,el.onerror=fOnError,el.onload=fOnSuccess,void(el.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")}!0===self._bSupportDataURI&&self._fSuccess?self._fSuccess.call(self):!1===self._bSupportDataURI&&self._fFail&&self._fFail.call(self)}var Drawing=function(el,htOption){this._bIsPainted=!1,this._android=_getAndroid(),this._htOption=htOption,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=htOption.width,this._elCanvas.height=htOption.height,el.appendChild(this._elCanvas),this._el=el,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.alt="Scan me!",this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return Drawing.prototype.draw=function(oQRCode){var _elImage=this._elImage,_oContext=this._oContext,_htOption=this._htOption,nCount=oQRCode.getModuleCount(),nWidth=_htOption.width/nCount,nHeight=_htOption.height/nCount,nRoundedWidth=Math.round(nWidth),nRoundedHeight=Math.round(nHeight);_elImage.style.display="none",this.clear();for(var row=0;row<nCount;row++)for(var col=0;col<nCount;col++){var bIsDark=oQRCode.isDark(row,col),nLeft=col*nWidth,nTop=row*nHeight;_oContext.strokeStyle=bIsDark?_htOption.colorDark:_htOption.colorLight,_oContext.lineWidth=1,_oContext.fillStyle=bIsDark?_htOption.colorDark:_htOption.colorLight,_oContext.fillRect(nLeft,nTop,nWidth,nHeight),_oContext.strokeRect(Math.floor(nLeft)+.5,Math.floor(nTop)+.5,nRoundedWidth,nRoundedHeight),_oContext.strokeRect(Math.ceil(nLeft)-.5,Math.ceil(nTop)-.5,nRoundedWidth,nRoundedHeight)}this._bIsPainted=!0},Drawing.prototype.makeImage=function(){this._bIsPainted&&_safeSetDataURI.call(this,_onMakeImage)},Drawing.prototype.isPainted=function(){return this._bIsPainted},Drawing.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},Drawing.prototype.round=function(nNumber){return nNumber?Math.floor(1e3*nNumber)/1e3:nNumber},Drawing}():function(){var Drawing=function(el,htOption){this._el=el,this._htOption=htOption};return Drawing.prototype.draw=function(oQRCode){for(var _htOption=this._htOption,_el=this._el,nCount=oQRCode.getModuleCount(),nWidth=Math.floor(_htOption.width/nCount),nHeight=Math.floor(_htOption.height/nCount),aHTML=['<table style="border:0;border-collapse:collapse;">'],row=0;row<nCount;row++){aHTML.push("<tr>");for(var col=0;col<nCount;col++)aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+nWidth+"px;height:"+nHeight+"px;background-color:"+(oQRCode.isDark(row,col)?_htOption.colorDark:_htOption.colorLight)+';"></td>');aHTML.push("</tr>")}aHTML.push("</table>"),_el.innerHTML=aHTML.join("");var elTable=_el.childNodes[0],nLeftMarginTable=(_htOption.width-elTable.offsetWidth)/2,nTopMarginTable=(_htOption.height-elTable.offsetHeight)/2;nLeftMarginTable>0&&nTopMarginTable>0&&(elTable.style.margin=nTopMarginTable+"px "+nLeftMarginTable+"px")},Drawing.prototype.clear=function(){this._el.innerHTML=""},Drawing}();function _getTypeNumber(sText,nCorrectLevel){for(var nType=1,length=_getUTF8Length(sText),i=0,len=QRCodeLimitLength.length;i<=len;i++){var nLimit=0;switch(nCorrectLevel){case QRErrorCorrectLevel.L:nLimit=QRCodeLimitLength[i][0];break;case QRErrorCorrectLevel.M:nLimit=QRCodeLimitLength[i][1];break;case QRErrorCorrectLevel.Q:nLimit=QRCodeLimitLength[i][2];break;case QRErrorCorrectLevel.H:nLimit=QRCodeLimitLength[i][3]}if(length<=nLimit)break;nType++}if(nType>QRCodeLimitLength.length)throw new Error("Too long data");return nType}function _getUTF8Length(sText){var replacedText=encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return replacedText.length+(replacedText.length!=sText?3:0)}(QRCode=function(el,vOption){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRErrorCorrectLevel.H},"string"==typeof vOption&&(vOption={text:vOption}),vOption)for(var i in vOption)this._htOption[i]=vOption[i];"string"==typeof el&&(el=document.getElementById(el)),this._htOption.useSVG&&(Drawing=svgDrawer),this._android=_getAndroid(),this._el=el,this._oQRCode=null,this._oDrawing=new Drawing(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)}).prototype.makeCode=function(sText){this._oQRCode=new QRCodeModel(_getTypeNumber(sText,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(sText),this._oQRCode.make(),this._el.title=sText,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=QRErrorCorrectLevel}();`,
          colorisCSS = `/*! * This was modified for use in TorrentBD Theme Engine. * Please visit https://github.com/mdbassit/Coloris for the unmodified version. */.clr-picker{display:none;flex-wrap:wrap;position:absolute;width:200px;z-index:1000;border-radius:10px;background-color:#fff;justify-content:space-between;box-shadow:0 0 5px rgba(0,0,0,.05),0 5px 20px rgba(0,0,0,.1);-moz-user-select:none;-webkit-user-select:none;user-select:none}.clr-picker.clr-open,.clr-picker[data-inline=true]{display:flex}.clr-picker[data-inline=true]{position:relative}.clr-gradient{position:relative;width:100%;height:100px;margin-bottom:15px;border-radius:3px 3px 0 0;background-image:linear-gradient(rgba(0,0,0,0),#000),linear-gradient(90deg,#fff,currentColor);cursor:pointer}.clr-marker{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border:1px solid #fff;border-radius:50%;background-color:currentColor;cursor:pointer}.clr-picker input[type=range]::-webkit-slider-runnable-track{width:100%;height:8px}.clr-picker input[type=range]::-webkit-slider-thumb{width:8px;height:8px;-webkit-appearance:none}.clr-picker input[type=range]::-moz-range-track{width:100%;height:8px;border:0}.clr-picker input[type=range]::-moz-range-thumb{width:8px;height:8px;border:0}.clr-hue{background-image:linear-gradient(to right,red 0,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red 100%)}.clr-alpha,.clr-hue{position:relative;width:calc(100% - 40px);height:8px;margin:5px 20px;border-radius:4px}.clr-alpha span{display:block;height:100%;width:100%;border-radius:inherit;background-image:linear-gradient(90deg,rgba(0,0,0,0),currentColor)}.clr-alpha input,.clr-hue input{position:absolute;width:calc(100% + 16px);height:16px;left:-8px;top:-4px;margin:0;background-color:transparent;opacity:0;cursor:pointer;appearance:none;-webkit-appearance:none}.clr-alpha div,.clr-hue div{position:absolute;width:16px;height:16px;left:0;top:50%;margin-left:-8px;transform:translateY(-50%);border:2px solid #fff;border-radius:50%;background-color:currentColor;box-shadow:0 0 1px #888;pointer-events:none}.clr-alpha div:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border-radius:50%;background-color:currentColor}.clr-format{display:none;order:1;width:calc(100% - 40px);margin:0 20px 20px}.clr-segmented{display:flex;position:relative;width:100%;margin:0;padding:0;border:1px solid #ddd;border-radius:15px;box-sizing:border-box;color:#999;font-size:12px}.clr-segmented input,.clr-segmented legend{position:absolute;width:100%;height:100%;margin:0;padding:0;border:0;left:0;top:0;opacity:0;pointer-events:none}.clr-segmented label{flex-grow:1;padding:4px 0;text-align:center;cursor:pointer}.clr-segmented label:first-of-type{border-radius:10px 0 0 10px}.clr-segmented label:last-of-type{border-radius:0 10px 10px 0}.clr-segmented input:checked+label{color:#fff;background-color:#666}.clr-swatches{order:2;width:calc(100% - 32px);margin:0 16px}.clr-swatches div{display:flex;flex-wrap:wrap;padding-bottom:12px;justify-content:center}.clr-swatches button{position:relative;width:20px;height:20px;margin:0 4px 6px 4px;border:0;border-radius:50%;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;cursor:pointer}.clr-swatches button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor;box-shadow:0 0 0 1px rgba(0,0,0,.1)}input.clr-color{order:1;width:calc(100% - 80px);height:32px;margin:15px 20px 20px 0;padding:0 10px;border:1px solid #ddd;border-radius:16px;color:#444;background-color:#fff;font-family:inherit;font-size:14px;text-align:center;box-shadow:none}input.clr-color:focus{outline:0;border:1px solid var(--engine-accent-color-1)}.clr-clear{display:none;order:2;height:24px;margin:0 20px 20px auto;padding:0 20px;border:0;border-radius:12px;color:#fff;background-color:#666;font-family:inherit;font-size:12px;font-weight:400;cursor:pointer}.clr-preview{position:relative;width:32px;height:32px;margin:15px 0 20px 20px;border:0;border-radius:50%;overflow:hidden;cursor:pointer}.clr-preview:after,.clr-preview:before{content:'';position:absolute;height:100%;width:100%;left:0;top:0;border:1px solid #fff;border-radius:50%}.clr-preview:after{border:0;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.clr-alpha div,.clr-color,.clr-hue div,.clr-marker{box-sizing:border-box}.clr-field{display:inline-block;position:relative;color:transparent}.clr-field button{position:absolute;width:1.75rem;height:1.75rem;margin-right:1rem;right:0;top:50%;transform:translateY(-50%);border:0;color:inherit;text-indent:-1000px;white-space:nowrap;overflow:hidden;pointer-events:none}.clr-field button:after{content:'';display:block;position:absolute;width:100%;height:100%;left:0;top:0;border-radius:inherit;background-color:currentColor}.clr-marker:focus{outline:0}.clr-keyboard-nav .clr-alpha input:focus+div,.clr-keyboard-nav .clr-hue input:focus+div,.clr-keyboard-nav .clr-marker:focus,.clr-keyboard-nav .clr-segmented input:focus+label{outline:0;box-shadow:0 0 0 2px #1e90ff,0 0 2px 2px #fff}.clr-picker[data-alpha=false] .clr-alpha{display:none}.clr-picker[data-minimal=true]{padding-top:16px}.clr-picker[data-minimal=true] .clr-alpha,.clr-picker[data-minimal=true] .clr-color,.clr-picker[data-minimal=true] .clr-gradient,.clr-picker[data-minimal=true] .clr-hue,.clr-picker[data-minimal=true] .clr-preview{display:none}.clr-dark{background-color:#444}.clr-dark .clr-segmented{border-color:#777}.clr-dark .clr-swatches button:after{box-shadow:0 0 0 1px rgba(255,255,255,.3)}.clr-dark input.clr-color{color:#fff;border-color:#777;background-color:#555}.clr-dark input.clr-color:focus{border:1px solid var(--engine-accent-color-1)}.clr-dark .clr-preview:after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}.clr-dark .clr-alpha,.clr-dark .clr-alpha div,.clr-dark .clr-preview:before,.clr-dark .clr-swatches button{background-image:repeating-linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#888 75%,#888),repeating-linear-gradient(45deg,#888 25%,#444 25%,#444 75%,#888 75%,#888)}.clr-picker.clr-polaroid{border-radius:6px;box-shadow:0 0 5px rgba(0,0,0,.1),0 5px 30px rgba(0,0,0,.2)}.clr-picker.clr-polaroid:before{content:'';display:block;position:absolute;width:16px;height:10px;left:20px;top:-10px;border:solid transparent;border-width:0 8px 10px 8px;border-bottom-color:currentColor;box-sizing:border-box;color:#fff;filter:drop-shadow(0 -4px 3px rgba(0,0,0,.1));pointer-events:none}.clr-picker.clr-polaroid.clr-dark:before{color:#444}.clr-picker.clr-polaroid.clr-left:before{left:auto;right:20px}.clr-picker.clr-polaroid.clr-top:before{top:auto;bottom:-10px;transform:rotateZ(180deg)}.clr-polaroid .clr-gradient{width:calc(100% - 20px);height:120px;margin:10px;border-radius:3px}.clr-polaroid .clr-alpha,.clr-polaroid .clr-hue{width:calc(100% - 30px);height:10px;margin:6px 15px;border-radius:5px}.clr-polaroid .clr-alpha div,.clr-polaroid .clr-hue div{box-shadow:0 0 5px rgba(0,0,0,.2)}.clr-polaroid .clr-format{width:calc(100% - 20px);margin:0 10px 15px}.clr-polaroid .clr-swatches{width:calc(100% - 12px);margin:0 6px}.clr-polaroid .clr-swatches div{padding-bottom:10px}.clr-polaroid .clr-swatches button{width:22px;height:22px}.clr-polaroid input.clr-color{width:calc(100% - 60px);margin:10px 10px 15px 0}.clr-polaroid .clr-clear{margin:0 10px 15px auto}.clr-polaroid .clr-preview{margin:10px 0 15px 10px}.clr-picker.clr-large{width:275px}.clr-large .clr-gradient{height:150px}.clr-large .clr-swatches button{width:22px;height:22px}`,
          colorisJS = `https://cdn.jsdelivr.net/gh/NaeemBolchhi/Coloris@main/src/coloris.min.js`,
          stationCSS = `*{scrollbar-width:thin!important;scrollbar-color:var(--engine-body-color) #00000000!important}::-webkit-scrollbar{width:7px!important;height:7px!important}::-webkit-scrollbar-thumb{background:var(--engine-body-color)!important}::-webkit-scrollbar-track{background:#00000000!important}::selection{color:var(--engine-body-bg);background:var(--engine-accent-color-1)}a,body,html{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}input[type=text],textarea{-o-user-select:text!important;-webkit-touch-callout:text!important;-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important}#qrcode,.g-bar,.g-thumb svg,.gallery-cell,btn,button,card,form input,form select,form textarea,qrbtn{-webkit-border-radius:6px;-moz-border-radius:6px;-ms-border-radius:6px;-o-border-radius:6px;border-radius:6px}body,content,html{height:100%}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit;outline:0}html{font-family:"Radio Canada",sans-serif;font-size:18px;line-height:1.3;color:var(--engine-body-color);background:var(--engine-body-bg)}body{background:var(--engine-body-bg);padding:0;margin:0}a{color:var(--engine-accent-color-1);background-color:transparent;text-decoration:none;outline:0}a:hover{color:var(--engine-accent-color-1a)}.no-margin-top{margin-top:0}main{display:none}.flex{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-center{align-items:center}.flex-self-end{align-self:flex-end}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-column{flex-direction:column}.flex-dynamic{flex-direction:row}.flex-content-center{justify-content:center}.flex-space-between{justify-content:space-between}.text-center{text-align:center}.text-left{text-align:left}.font-bold{font-weight:600}.font-regular{font-weight:400}.container{background:0 0;width:80rem;max-width:calc(100vw - 2rem);margin-left:auto;margin-right:auto;padding:1rem;line-height:1;color:var(--engine-body-color);word-wrap:break-word}.flex-grow{flex:1 0 auto}svg.logo{height:2.8rem;width:auto;padding:5px 0}span.logo{padding-left:1rem}span.logo,span.title{font-size:1.5rem}btn,button{text-decoration:none;text-align:center;border:none;padding:0;margin:0 .5rem;cursor:pointer;background:0 0;-webkit-transition:.3s;-moz-transition:.3s;-ms-transition:.3s;-o-transition:.3s;transition:.3s}btn:focus,btn:focus-visible,button:focus,button:focus-visible{outline:0}footer>button{height:3.5rem;width:3.5rem}button:active,button:focus,button:hover{background:var(--engine-card-bg)}button:active>svg,button:focus>svg{fill:var(--engine-accent-color-1)}button>svg{height:100%;width:auto;fill:var(--engine-body-color);padding:1rem}button.static{background:var(--engine-accent-color-1);cursor:default}button.static>svg{fill:var(--engine-button-color)}form{width:100%;height:100%}column,row{width:100%}section{width:100%;height:auto}form input,form select,form textarea{overflow:visible;text-decoration:none}form input[type=text],form select,form textarea{font-family:Inconsolata,monospace;font-weight:500;font-size:1rem;width:100%;padding:.9rem;background:var(--engine-card-bg);border:none;border-bottom:2px solid transparent;color:var(--engine-body-color-stark);-webkit-transition:0s;-moz-transition:0s;-ms-transition:0s;-o-transition:0s;transition:0s}form.advanced input[type=text],form.advanced select{background:var(--engine-body-bg)}form.advanced{margin-bottom:.5rem}.clr-field input[type=text]{padding:.9rem 3.55rem .9rem .9rem}.margin-bottom{margin-bottom:1.5rem}.margin-bottom-small{margin-bottom:1rem}form input[type=text]:focus,form select:focus,form textarea:focus{border-color:var(--engine-accent-color-1)}form textarea{resize:none;height:auto;margin-bottom:1.5rem}form section>label{margin-bottom:1.5rem;font-weight:700}.margin-dynamic{margin:0 2rem 0 0}backdrop,dialogue,qr,ticker{position:fixed;top:0;left:0;height:100%;width:100%}dialogue,qr,ticker{display:none;z-index:1}backdrop{background:#00000066;z-index:0}#qrcode,notice{z-index:1}card{width:35rem;max-width:calc(100vw - 2rem);background:var(--engine-card-bg);padding:2rem 1.5rem;z-index:1}inform{font-size:1rem;width:100%;margin-bottom:.5rem}notice{font-size:6rem;opacity:1;-webkit-transform:scale(.3);-moz-transform:scale(.3);-ms-transform:scale(.3);-o-transform:scale(.3);transform:scale(.3);-webkit-transition:transform .3s ease-in-out,opacity 250ms;-moz-transition:transform .3s ease-in-out,opacity 250ms;-ms-transition:transform .3s ease-in-out,opacity 250ms;-o-transition:transform .3s ease-in-out,opacity 250ms;transition:transform .3s ease-in-out,opacity 250ms}notice.end{-webkit-transform:scale(1);-moz-transform:scale(1);-ms-transform:scale(1);-o-transform:scale(1);transform:scale(1);opacity:0}btn,input[type=button],input[type=submit]{border:none;cursor:pointer;padding:.75rem 2rem;min-width:7rem;font-size:1rem;line-height:normal;color:var(--engine-button-color);-webkit-transition:0s;-moz-transition:0s;-ms-transition:0s;-o-transition:0s;transition:0s}btn{margin:0}.btn-margin-right{margin:0 1rem 0 0}btn:focus,btn:hover,input[type=button]:focus,input[type=button]:hover,input[type=submit]:focus,input[type=submit]:hover{color:var(--engine-button-color-hover)}btn:active,input[type=button]:active,input[type=submit]:active{-webkit-transform:translateY(2px);-moz-transform:translateY(2px);-ms-transform:translateY(2px);-o-transform:translateY(2px);transform:translateY(2px)}.accent-3{background:var(--engine-accent-color-3)}.accent-3:focus,.accent-3:hover{background:var(--engine-accent-color-3a)}.accent-2{background:var(--engine-accent-color-2)}.accent-2:focus,.accent-2:hover{background:var(--engine-accent-color-2a)}.accent-1{background:var(--engine-accent-color-1)}.accent-1:focus,.accent-1:hover{background:var(--engine-accent-color-1a)}.hide{display:none}.clr-field{width:100%}.clr-field>button{box-shadow:0 0 .2rem .1rem var(--engine-body-bg)}.gallery-cell,.table-cell{margin:0 1rem 1.25rem 1rem;float:left;width:calc(25% - 2rem)}.gallery-cell{margin:1rem 1rem;width:calc(16.667% - 2rem)}.table-cell.advanced,.table-cell.catfilter{width:calc(100% - 2rem)}.table-row{margin-bottom:.25rem}.gallery-row::after,.table-row::after{content:"";clear:both;display:table}.container.rowling{padding:1rem 0}main column:first-of-type{margin-right:2rem}label[for]{font-size:.75rem;position:relative;bottom:.3rem;left:1rem}.catsrc{color:#36b0aa!important}header>span:first-of-type{cursor:pointer}info,profile{margin-bottom:2.5rem}.avatar{height:8rem;width:auto;-webkit-border-radius:100%;-moz-border-radius:100%;-ms-border-radius:100%;-o-border-radius:100%;border-radius:100%}.name{font-size:1.5rem}info{font-size:.9rem;line-height:1.5}.gallery{height:calc(100vh - 16.3rem);overflow-x:hidden;overflow-y:scroll}.gallery-cell{background:var(--engine-card-bg);cursor:pointer;padding:.65rem;border-bottom:2px solid var(--engine-card-bg)}.gallery-cell:active,.gallery-cell:focus,.gallery-cell:hover{background:var(--engine-table-odd-bg);border-color:var(--engine-accent-color-1)}.gallery-cell:active{-webkit-transform:translateY(2px);-moz-transform:translateY(2px);-ms-transform:translateY(2px);-o-transform:translateY(2px);transform:translateY(2px);-webkit-transition:0s;-moz-transition:0s;-ms-transition:0s;-o-transition:0s;transition:0s}.gallery-bar{padding:0 1rem}.g-bar{background:var(--engine-card-bg);padding:.25rem .65rem;margin-bottom:1rem}.g-bar svg{width:2rem;height:auto;padding:.15rem;margin:0 .15rem;cursor:pointer;fill:var(--engine-body-color);-webkit-transition:.2s;-moz-transition:.2s;-ms-transition:.2s;-o-transition:.2s;transition:.2s}.g-bar svg:hover{fill:var(--engine-body-color-stark)}.g-bar svg.enabled,.g-bar svg:active{fill:var(--engine-accent-color-1)}.g-bar svg.enabled:active,.g-bar svg.enabled:hover{fill:var(--engine-accent-color-1a)}.g-thumb svg{width:100%;height:auto}scribe{padding-top:calc(.4rem + 2px)}.g-info{font-size:.7rem;line-height:1.5}.g-icon svg{width:1.5rem;height:auto;fill:var(--engine-body-color)}input[type=text].auto-width{width:auto}qrbtn{fill:var(--engine-body-color);background:var(--engine-card-bg);margin-left:1.5rem;padding:.6rem;height:3.11rem;width:3.11rem;cursor:pointer;-webkit-transition:.2s;-moz-transition:.2s;-ms-transition:.2s;-o-transition:.2s;transition:.2s}qrbtn:hover{fill:var(--engine-body-color-stark)}qrbtn:active svg{height:90%}qrbtn svg{height:100%;width:auto}qr img{width:auto;max-width:calc(100vw - 8rem)}#qrcode{background:#fff;padding:2.25rem;border-radius:6px;max-width:calc(100vw - 2rem)}@media only screen and (max-width:1350px){.g-info{font-size:.65rem}.g-icon svg{width:1.4rem}}@media only screen and (max-width:1250px){.g-info{font-size:.6rem}.g-icon svg{width:1.3rem}}@media only screen and (max-width:1180px){.gallery-cell{width:calc(20% - 2rem)}.g-info{font-size:.65rem}.g-icon svg{width:1.4rem}}@media only screen and (max-width:1050px){.g-info{font-size:.6rem}.g-icon svg{width:1.3rem}}@media only screen and (max-width:980px){.g-info{font-size:.55rem}.g-icon svg{width:1.2rem}}@media only screen and (max-width:900px){.gallery-cell{width:calc(25% - 2rem)}.g-info{font-size:.65rem}.g-icon svg{width:1.4rem}}@media only screen and (max-width:850px){.g-info{font-size:.6rem}.g-icon svg{width:1.3rem}}@media only screen and (max-width:810px){.g-info{font-size:.55rem}.g-icon svg{width:1.2rem}}@media only screen and (max-width:768px){span.logo half{display:none}.gallery-cell,.table-cell{width:calc(33.33% - 2rem)}.g-info{font-size:.7rem}.g-icon svg{width:1.5rem}}@media only screen and (max-width:700px){.g-info{font-size:.65rem}.g-icon svg{width:1.4rem}}@media only screen and (max-width:650px){.g-info{font-size:.6rem}.g-icon svg{width:1.3rem}}@media only screen and (max-width:600px){.g-info{font-size:.55rem}.g-icon svg{width:1.2rem}}@media only screen and (max-width:550px){html{font-size:15px}svg.logo{height:2.4rem}qrbtn,span.logo full{display:none!important}.gallery-cell,.table-cell{width:calc(50% - 2rem)}.g-info{font-size:.8rem}.g-icon svg{width:1.7rem}}@media only screen and (max-width:500px){.g-info{font-size:.75rem}.g-icon svg{width:1.6rem}}@media only screen and (max-width:450px){.g-info{font-size:.7rem}.g-icon svg{width:1.5rem}}@media only screen and (max-width:400px){.g-info{font-size:.65rem}.g-icon svg{width:1.4rem}}@media only screen and (orientation:portrait){.flex-dynamic{flex-direction:column}.margin-dynamic{margin:0 0 2rem 0}}`,
          stationJS = stationTXT + `const waitGlobal=100;let loadOnce=!1,paletteString;const colorValues=["bodybg","cardbg","bodycolor","bodystark","btncolor","btnhover","accent1","accent2","accent3","navbg","titlecolor","logo","catfilter"],colorDark=[getJSON("themeDark").bodybg,getJSON("themeDark").cardbg,getJSON("themeDark").bodycolor,getJSON("themeDark").bodystark,getJSON("themeDark").btncolor,getJSON("themeDark").btnhover,getJSON("themeDark").accent1,getJSON("themeDark").accent2,getJSON("themeDark").accent3,getJSON("themeDark").navbg,getJSON("themeDark").titlecolor,getJSON("themeDark").logo,getJSON("themeDark").catfilter],colorLight=[getJSON("themeLight").bodybg,getJSON("themeLight").cardbg,getJSON("themeLight").bodycolor,getJSON("themeLight").bodystark,getJSON("themeLight").btncolor,getJSON("themeLight").btnhover,getJSON("themeLight").accent1,getJSON("themeLight").accent2,getJSON("themeLight").accent3,getJSON("themeLight").navbg,getJSON("themeLight").titlecolor,getJSON("themeLight").logo,getJSON("themeLight").catfilter];function setJSON(key,data){"string"!=typeof data&&(data=JSON.stringify(data)),localStorage.setItem(key,data)}function getJSON(key){return JSON.parse(localStorage.getItem(key))}function toggle(key){const pageNames=["Gallery","String","Palette","Share","Config"];try{document.querySelector("button.static").classList.remove("static")}catch(err){}document.querySelectorAll("footer > button")[key].classList.add("static"),document.querySelector("span.title").innerHTML=pageNames[key];try{document.querySelector("main.flex").classList.remove("flex")}catch(err){}document.querySelectorAll("main")[key].classList.add("flex")}function notifyJSON(){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide");try{const stringJSON=document.querySelectorAll("main")[1].querySelector("form > input[type='text']").value;console.log(JSON.parse(stringJSON)),par[0].innerHTML=stringG[0],par[1].innerHTML=stringG[1],btn[0].innerHTML=stringG[2],btn[1].innerHTML=stringG[3];try{btnHID.classList.remove("hide")}catch(err){}btn[0].setAttribute("onclick",'applyTheme("themeLight","1");'),btn[1].setAttribute("onclick",'applyTheme("themeDark","1");')}catch(err){par[0].innerHTML=stringB[0],par[1].innerHTML=stringB[1],btn[1].innerHTML=stringB[2],btnHID||btn[0].classList.add("hide"),btn[1].setAttribute("onclick","hideAlert();")}document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function getPaletteString(){var mainString="{";for(let x=0;x<colorValues.length;x++){var color=document.getElementById(colorValues[x]).value,name;mainString=mainString+'"'+colorValues[x]+'":"'+color+'",'}paletteString=mainString.slice(0,-1)+"}"}function notify2JSON(){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide");try{if(!document.querySelector("dummy.hide").style.filter)throw"Category Filter is invalid!";getPaletteString();const stringJSON=paletteString;console.log(JSON.parse(stringJSON)),par[0].innerHTML=paletteG[0],par[1].innerHTML=paletteG[1],btn[0].innerHTML=paletteG[2],btn[1].innerHTML=paletteG[3];try{btnHID.classList.remove("hide")}catch(err){}btn[0].setAttribute("onclick",'applyTheme("themeLight","2");'),btn[1].setAttribute("onclick",'applyTheme("themeDark","2");')}catch(err){console.error(err),par[0].innerHTML=paletteB[0],par[1].innerHTML=paletteB[1],btn[1].innerHTML=paletteB[2],btnHID||btn[0].classList.add("hide"),btn[1].setAttribute("onclick","hideAlert();")}document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function notify3JSON(key){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide");try{const stringJSON=key;console.log(JSON.parse(decodeURIComponent(stringJSON))),par[0].innerHTML=galleryG[0],par[1].innerHTML=galleryG[1],btn[0].innerHTML=galleryG[2],btn[1].innerHTML=galleryG[3];try{btnHID.classList.remove("hide")}catch(err){}btn[0].setAttribute("onclick",'applyTheme("themeLight","3","'+key+'");'),btn[1].setAttribute("onclick",'applyTheme("themeDark","3","'+key+'");')}catch(err){par[0].innerHTML=galleryB[0],par[1].innerHTML=galleryB[1],btn[1].innerHTML=galleryB[2],btnHID||btn[0].classList.add("hide"),btn[1].setAttribute("onclick","hideAlert();")}document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function successJSON(){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide");par[0].innerHTML=successG[0],par[1].innerHTML=successG[1],btn[0].innerHTML=successG[2],btn[1].innerHTML=successG[3];try{btnHID.classList.remove("hide")}catch(err){}btn[0].setAttribute("onclick","rootHome();"),btn[1].setAttribute("onclick","engineHome();"),document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function resetAll(){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide");par[0].innerHTML=resetG[0],par[1].innerHTML=resetG[1],btn[0].innerHTML=resetG[2],btn[1].innerHTML=resetG[3];try{btnHID.classList.remove("hide")}catch(err){}btn[0].setAttribute("onclick","wipeAll();"),btn[1].setAttribute("onclick","engineHome();"),document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function advancedMenu(){function mainJS(){const par=document.querySelectorAll("inform > p"),btn=document.querySelectorAll("buttons > btn"),btnHID=document.querySelector("buttons > btn.hide"),form=document.querySelector("form.advanced");par[0].innerHTML=advancedG[0],par[1].innerHTML=advancedG[1],btn[0].innerHTML=advancedG[2],btn[1].innerHTML=advancedG[3];try{btnHID.classList.remove("hide")}catch(err){}try{form.classList.remove("hide")}catch(err){}try{document.getElementById("fontlink").value=localStorage.getItem("fontlink"),document.getElementById("fontname").value=localStorage.getItem("fontname"),document.getElementById("favstate").value=localStorage.getItem("favstate"),document.getElementById("torvisit").value=localStorage.getItem("torvisit")}catch(err){}btn[0].setAttribute("onclick","applyAdv();"),btn[1].setAttribute("onclick","engineHome();"),document.querySelector("dialogue").classList.add("flex")}setTimeout(mainJS,100)}function hideAlert(){function mainJS(){try{document.querySelector("dialogue.flex").classList.remove("flex")}catch(err){}hideAdvanced()}setTimeout(mainJS,100)}function wipeAll(){function mainJS(){localStorage.clear(),window.location.href="/"}setTimeout(mainJS,100)}function applyAdv(){function mainJS(){localStorage.setItem("fontlink",document.getElementById("fontlink").value),localStorage.setItem("fontname",document.getElementById("fontname").value),localStorage.setItem("favstate",document.getElementById("favstate").value),localStorage.setItem("torvisit",document.getElementById("torvisit").value),window.location.href="/"}setTimeout(mainJS,100)}function rootHome(){function mainJS(){window.location.href="/"}setTimeout(mainJS,100)}function engineHome(){function mainJS(){window.location.href="/theme"}setTimeout(mainJS,100)}function applyTheme(key,type,obj){function mainJS(){let data;"1"===type?data=JSON.parse(document.querySelectorAll("main")[1].querySelector('form > input[type="text"]').value):"2"===type?data=JSON.parse(paletteString):"3"===type&&(data=JSON.parse(decodeURIComponent(obj))),setJSON(key,data),hideAlert(),successJSON()}setTimeout(mainJS,100)}function cancelConfirm(key){try{document.querySelector(key+".flex").classList.remove("flex")}catch(err){}hideAdvanced(),clearQR()}function clearQR(){try{document.getElementById("qrcode").innerHTML="",document.getElementById("qrcode").removeAttribute("title")}catch(err){}}function hideAdvanced(){try{document.querySelector("form.advanced").classList.add("hide")}catch(err){}}function showQR(key){function mainJS(){document.querySelector("qr").classList.add("flex")}new QRCode(document.getElementById("qrcode"),{text:document.getElementById(key).value,width:450,height:450,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.L}),setTimeout(mainJS,100)}function toggleShine(key){let other,toggle,keyName;1===key?(keyName="sun",other=0):(keyName="moon",other=1),toggle=document.querySelectorAll(".g-right svg");try{if(!toggle[key].classList[0].match("enabled"))throw"Catch shine.";toggle[key].removeAttribute("class"),toggle[other].removeAttribute("class"),document.getElementById("show").innerHTML=""}catch(err){toggle[key].removeAttribute("class"),toggle[other].removeAttribute("class"),toggle[key].setAttribute("class","enabled"),document.getElementById("show").innerHTML="."+keyName+"{display: none;}"}}function selector(key){var source=document.getElementById(key);source.select(),navigator.clipboard.writeText(source.value).then((function(){copyNotice("Copied","var(--engine-seeders)")}),(function(){copyNotice("Failed","var(--engine-leechers)")}))}function copyNotice(key,colored){const ticker=document.querySelector("ticker"),notice=document.querySelector("notice");notice.innerHTML=key,notice.style.color=colored,ticker.classList.add("flex"),setTimeout(()=>{notice.classList.add("end")},250),setTimeout(()=>{ticker.classList.remove("flex"),notice.classList.remove("end")},500)}function quickShare(){const shareURL=window.location.protocol+"//"+window.location.hostname+window.location.pathname+"?";document.querySelector("#lightJSON").value=JSON.stringify(getJSON("themeLight")),document.querySelector("#darkJSON").value=JSON.stringify(getJSON("themeDark")),document.querySelector("#lightURL").value=shareURL+JSON.stringify(getJSON("themeLight")),document.querySelector("#darkURL").value=shareURL+JSON.stringify(getJSON("themeDark"))}function quickLoad(){let theme=localStorage.getItem("theme");!0!==loadOnce&&(clickLoad(theme),loadOnce=!0)}function clickLoad(key){let togglebtn=document.querySelector("#toggleLoad");if("light"===key){for(let x=0;x<colorValues.length;x++)document.getElementById(colorValues[x]).value=colorLight[x],document.getElementById(colorValues[x]).parentNode.style.color=colorLight[x];togglebtn.value="Load Dark",togglebtn.setAttribute("onclick",'clickLoad("dark");')}else{for(let x=0;x<colorValues.length;x++)document.getElementById(colorValues[x]).value=colorDark[x],document.getElementById(colorValues[x]).parentNode.style.color=colorDark[x];togglebtn.value="Load Light",togglebtn.setAttribute("onclick",'clickLoad("light");')}catFilter()}function catFilter(){try{var filterStyle=document.getElementById("catfilter").value;document.querySelector("style#cat").innerHTML="#catprev::after {filter: "+filterStyle+";}",document.querySelector("dummy.hide").removeAttribute("style"),document.querySelector("dummy.hide").style.filter=filterStyle}catch(err){}}function calcVH(){var vH=Math.max(document.documentElement.clientHeight,window.innerHeight||0);document.querySelector(".gallery").setAttribute("style","height: calc("+vH+"px - 16.3rem)")}catFilter(),document.querySelector("input#catfilter").addEventListener("input",catFilter),calcVH(),window.addEventListener("onorientationchange",calcVH,!0),window.addEventListener("resize",calcVH,!0),function(){try{const jsonURL=window.location.href.replace(/.*({.*}).*/i,"$1"),jsonParsed=JSON.parse(decodeURIComponent(jsonURL)),jsonString=JSON.stringify(jsonParsed);console.log(jsonParsed),document.querySelectorAll("main")[1].querySelector('form > input[type="text"]').value=jsonString,toggle(1)}catch(err){}try{if(navigator.userAgent.toLowerCase().match(/mobile/i)){var dnone="display: none !important";document.querySelector("qr").setAttribute("style",dnone),document.querySelectorAll("qrbtn")[0].setAttribute("style",dnone),document.querySelectorAll("qrbtn")[1].setAttribute("style",dnone)}}catch(err){}}(),function(){Coloris({theme:"polaroid",format:"hex",alpha:!1,clearButton:{show:!0,label:"Cancel"}});let theme=localStorage.getItem("theme");theme||(theme="dark"),"light"===theme?Coloris({themeMode:"light"}):Coloris({themeMode:"dark"})}();`;

    // Information and favicon.
    const titleES = 'TorrentBD Theme Engine',
          describeES = 'Control Center for TorrentBD Theme Engine.',
          icon32 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAApdQTFRFAAAA32GN3VmQ3ViQ3VqS3mue33Ok33Wl33al33ak4Hmj4GaM3ViQ3VeQ3ViR33Gi33Wl4Hii3VmQ3mab4Hak3ViQ322f5ICd3ViQysDcxNXw4GKL4GiU322g4nic3l6V4nqcxdDqw9Xvw9Xv+a1d4WSJ6YaF6Ht832qd5oWU7Yh03mib4Xmg9ahq3lmRxdDpw9Xvw9Xvw9Xv/8JQ/8BR/LlW/8JQ6YB94nKU3mSZ4nOV3maa5oiW/8NS/btV/r9S/8ZW4miH33Ci54eSwcnauszswtTvw9Xvw9Xv/8JQ/8pb6YKB7pp85oaS9KJo6pKN/85h/8hZ/89j+7ZY7Y1175p5/LxX/8ZVuMnquMrrw9Xv/8JR/8JQ/8VU76CB/r5T/8ZX7IZ132mb5YKW+7tg/9Bk/8la/8VUuMrrt8jqv9Htw9Xv/8JQ/8JQ6oB63mqd8KWD/81g/8xe/8NR/85i/85h/9Bkt8jqvtDtw9Xv/8JQ/8JQ8JJu3l+V33Wl9K53/9Bk/8te/8NR/8dX/9Bk/9Bk/9BkuMnqt8jqwNLuw9Xv3ViR3meb33Wlusvst8jqu83sw9XvuMrquMnqv9Huw9XvwNLtvM7sv9Dtw9XvxNXvucrqt8jqu83sw9Xvw9Xvt8jqu8zsw9Xvw9Xvw9Xvt8jqt8jqwdPuw9Xvw9Xvw9Xvw9Xvw9Xvt8jqucrrw9Xvw9XvgrX7gbX7gbX7hrn7qcfzrsnys8/0ncb7ncb7ncb7gLT7gLT7l8L7ncb7ncb7gLT7lcL7ncb7g7X7gbT7gbT7grX7h7n7iLn7iLn7ncb7ncb7gLT7jbz7k8D7k8D7gLT7lMD7ncb7gLT7ncb7gLT7ncb7gbX7gbX7gbT7kL77nMb7ncb729zdUQAAAN10Uk5TABiw9P/////7yz4L3v////o7g//Kuv8Kv0MAv////////88uv/////////////////Myvv////////////////////+L/f/cBqf////////////////yA3//STv+/////////////4II9f+Ecv3/////////sArl/5Yqb5D8/IuBgYSBeEECG/z/dTRlKgG2/zMQRkxMbc//rQAFnPjMErD/8n4LQv//w0M2NSqW//4YF2tvb8z/92pnEsn////Avf+vDEDr////7z8K4///5uL/5ODitKEXt/3//BRR1JCXAAABoklEQVR4nGNgYGBkYmZhZWNHARycXAwwwM3Dy8fPjgEEBGEKhHh5hTHl2dlFYApEeXnFsClgF4cqkMClQFIKokAaqEBGFiEuJ8/OrgDE7IpKymAFKqq8auoaCAWaWto6unpAhr6BoRFIgbGJqZk5UIGFJTu7lTU7u42tnb2DoxO7s4urm7sHUIGnmZmXN1CBjzqrrx/QaP+AQK+g4JDQsPCISIMooILoGLNYkII4s3izhMSk5JRUIEgzM0tnyMjMygbZkZNrlpfPzl5QmFYUVGxv5gVSkFpSWsbAUF5RCXZmVXVNLXtdfQMQNDY1g6iGltY2Bob2js4uWGh19/QyoIO+/gkGEzFEJ02eMhUCpk2fYTBzFpr07Dlz3QwQYN58dP0LFiJJL1q8BF1+6bLlK1augoDVazww7GdYu279BkxRKNi4afOWrdu279ixcxd2Bbv37Nm7Dwz2Y1dwYM+egxAFh7ArOHzk6LHjJ06cOHnqNC5XnNlz9ty5c+dxupLhwp6LQAsuDXEFl8EKruBWcHXPWaCCa7gVXL9x89btQ3fQRAFfy7Ei5tz9RgAAAABJRU5ErkJggg==',
          icon16 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAUFQTFRF4GaM3ViQ3mGX33Kj33Wl33Wl33akAAAA3VmQ3VeQ32+h33Wl5IKc32CM322d33Ok4Hai33Ch4HajxdHqw9Xv/LlW8ZVr8JRx4HSg33Gi4HSh436d86Bq969o4GyZ4XqgwM7pw9Xvw9Xv/8JQ/8JQ9KRt54mS86Br+LFk4nGU65SH/85h/89i+rRe+rdducjmvc7sw9Xv/8JQ9aRj322g6I2S/81f/89i/8NU/8la/9Bk/89j/85huMnqu83sw9Xv3mKY33WluMrqvM3sw9XvwdPuvM3swdPut8jqvc/sw9Xvw9Xvw9XvuMnqw9Xvw9Xvw9Xvw9Xvw9XvgLT7i7v7o8f3osj6ncb7ncb7gLT7hrj7kb/7kr/7l8L7ncb7gLT7lMD7mMP7mMP7mcP7ncb7ncb7gLT7gLT7j737ncb7ncb77OVgfwAAAGt0Uk5TA7T8///wXQBW///zA2n//////5ELaf/////////////lwAE4/////////////9kg/TJgwP7dwMDBwMCnJAf5PSgKBCUmL6/pN+j/1y6/ph4bGAKfvvPWvDJ6+f//vSPx//9d//9d8KL/6SWVihK7AAAAsElEQVR4nGNgYGRiZoEAVjZ2dnYGDk4uFhjg5gEK8HLy8YM4AoJCgizCIuwMomLighKSUpLSMrJy8gqKSgzKKqqCauoamlraOrp6+gaGDOxGxiamZuYWllZW1ja2dvYMQIMdHNnZnZxdXFxc3dxFQAJA4OHpBQLePuxQAV8//4CAgMAgdohAcEhoWHgERAosEBkVHRMbhyTAHp+QmMSOIpCckopfIC0RTSA9IzMLKgAACqEfZSqPINQAAAAASUVORK5CYII=',
          icon180 = 'data:image/png;base64,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';

    // Navigation icons.
    const SVGlogo = '<svg class="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><style type="text/css">.logo .st0{fill:#9cc5fa}.logo .st1{fill:#80b3fa}.logo .st2{fill:#de75a4}.logo .st3{fill:#c2d4ee}.logo .st4{fill:#dc578f}.logo .st5{fill:#fecf64}.logo .st6{fill:#fec150}.logo .st7{fill:#b6c7e9}.logo .st8{fill:#fdc15b}</style><g><path class="st0" d="M158.34,278.39c0.06,9.24-6.11,17.5-15.26,20.54c-0.97,0.32-2.17,0.13-2.92,1.07c-1.56,0-3.12,0-4.69,0   c-8.95-0.69-14.45-5.93-18.07-13.67c-1.09-2.34-1.58-4.79-1.58-7.37c-0.01-21.53-0.02-43.07,0.01-64.6   c0.01-4.3,0.59-4.86,4.93-4.88c11.2-0.03,22.41-0.03,33.61,0.01c1.42,0,2.96-0.26,4.12,0.99c0.23,17.99,0.07,35.97,0.07,53.96   C158.57,269.09,158.92,273.75,158.34,278.39z"/><path class="st1" d="M158.3,210.36c-12.87,0.01-25.75,0.07-38.62-0.01c-2.24-0.01-3.02,0.52-3.01,2.92   c0.09,22.14,0.03,44.28,0.07,66.42c0.02,8.54,8.44,18.14,17.17,19.72c0.57,0.1,1.18,0.04,1.56,0.6c-7.42,0-14.84,0-22.26,0   c-2.87-1.58-6.13-2.31-8.79-4.36c-6.55-5.03-9.26-11.82-9.28-19.85c-0.04-24.18-0.08-48.37,0.01-72.55   c0.01-2.65-0.63-3.67-3.37-3.38c-5.52,0.57-10.25-0.91-13.34-5.9c-4.62-7.44-0.24-17.19,8.38-18.73c4.95-0.6,9.92-0.15,14.87-0.25   c3.79-0.07,7.58-0.04,11.45,0c-0.02,1.68-1.27,2.06-2.15,2.71c-4.38,3.21-6.19,8.21-4.73,13.15c1.36,4.58,6.09,8.05,11.39,8.09   c11.32,0.09,22.63,0.02,33.95,0.03c1.17,0,2.34-0.03,3.51,0.02c3.24,0.13,3.53,0.36,3.45,3.55   C158.52,205.14,158.94,207.77,158.3,210.36z"/><path class="st2" d="M86.83,108.85c-3.55,4.27-7.77,7.46-13.44,8.29c-9.91-4.11-13.81-11.88-13.74-22.23   c0.09-12.96,0.01-25.92,0.04-38.88c0.01-2.57-0.5-4.85-2.76-6.4c-2.93-2-4.53-1.35-5.16,2.08c-1.34,4.71-3.78,8.71-7.72,11.68   c-1.06,0.8-2.14,2.22-3.79,0.93c-0.19-0.35-0.37-0.71-0.36-1.1c0.09-11.11-1.22-22.3,0.83-33.3C43.38,15.69,52.18,6.37,65.56,1.22   c2.3-0.89,4.8-0.62,7.19-1.02c1.66-0.03,3.31-0.09,4.97-0.09c43.11,0,86.22,0.21,129.33-0.11c17.47-0.13,34.39,12.29,37.16,31.73   c0.57,4.02,0.27,8.17,0.37,12.27c0.52,0.74,0.68,1.59,0.67,2.47c-0.07,6.27,0.31,12.55-0.25,18.81c-0.02,0.32-0.08,0.64-0.15,0.95   c-1.89,6.47-5.51,11.5-11.91,14.2c-1.25,0.53-2.49,1.13-3.92,0.91c-9.07-2.95-14.6-10.46-14.68-19.95   c-0.02-2.14,0.04-4.29-0.04-6.43c-0.06-1.95-0.78-3.61-2.26-4.89c-1.22-1.06-2.62-1.87-4.26-1.49c-1.85,0.43-1,2.29-1.52,3.44   c-2.36,7.07-6.62,12.36-13.94,14.74c-0.91,0.3-1.81,0.72-2.81,0.38c-0.63-0.44-1.13-1.03-1.87-1.36   c-5.66-2.56-9.18-6.99-11.02-12.83c-0.84-2.7-2.55-4.28-5.37-4.6c-2.78-0.32-3.18,0.05-3.11,2.83c0.01,0.39-0.02,0.77-0.08,1.16   c-0.34,4.09,0.05,8.18-0.11,12.27c-0.23,4.39,0.33,8.79-0.15,13.18c-1.39,7.31-5.35,12.61-12.26,15.58   c-1.16,0.5-2.32,1.03-3.64,0.89c-9.09-2.81-14.51-10.01-14.84-19.83c-0.09-2.67-0.58-5.06-3.11-6.49   c-2.92-1.66-4.35-0.99-5.03,2.32c-1.77,5.35-4.72,9.82-9.65,12.76c-1.84,1.1-3.72,2.17-6.01,1.9c-6.92-2.06-11.55-6.49-13.81-13.36   c-0.66-2-1.53-3.75-3.65-4.59c-3.44-1.37-4.74-0.64-5,2.93c-0.41,4.31,0.05,8.62-0.15,12.92c-0.17,6.12,0.34,12.25-0.13,18.36   C89.73,103.94,89.24,106.86,86.83,108.85z"/><path class="st3" d="M244.58,66.29c-1.21-1.45-0.02-2.97-0.05-4.45c-0.12-5.94,0.01-11.89,0.06-17.84   c21.58,4.64,38.32,22.57,42.11,44.17c5.26,29.94-14.96,57.76-43.87,63.42c-2.55,0.5-5.16,0.85-7.81,0.84   c-25.07-0.04-50.14-0.03-75.22-0.01c-7.3,0.01-13,3.11-16.82,9.3c-2.42,3.91-2.97,8.38-2.81,12.94c-3.25,1.61-6.63,0.89-9.99,0.55   c-1.32-0.6-1.33-1.85-1.3-2.99c0.32-14.55,5.63-26.66,17.55-35.45c5.96-4.4,12.5-7.42,20.05-7.75c20.17-0.01,40.33-0.03,60.5-0.05   c3.69,0,7.38,0.21,11.03-0.54c9.2-0.02,18.27-0.32,26.01-6.45c7.96-6.3,12.22-14.49,12.03-24.51   c-0.25-12.66-6.22-22.08-17.73-27.74c-3.37-1.65-7.02-2.31-10.72-2.66C246.54,66.97,245.41,67.19,244.58,66.29z"/><path class="st4" d="M72.75,0.2c-5.02,1.11-9.95,2.4-14.33,5.3c-9.76,6.47-15.97,15.15-17.27,27.02   c-1.17,10.7-0.3,21.42-0.51,32.14c-0.42,1.76-1.99,2-3.34,2.35c-12.05,3.2-24.11-4.97-24.71-16.55c0.08-8.24-0.93-16.53,1.58-24.65   C19.1,9.86,34.54-0.33,49.05,0.07C56.95,0.29,64.85,0.17,72.75,0.2z"/><path class="st0" d="M129.61,174.66c3.52,0,7.04-0.01,10.55-0.01c7.6,0.03,15.21,0,22.81,0.1c5.82,0.08,10.69,1.91,13.3,7.67   c3.5,7.71-2.21,17.06-10.69,17.43c-6.7,0.29-6.69,0.29-6.7,7c-0.02,22.82-0.04,45.63-0.08,68.45c0,1.04,0.32,2.16-0.48,3.09   c-0.01-22.68-0.02-45.35-0.03-68.03c0-2.53-0.13-5.08,0.05-7.59c0.17-2.31-0.62-2.99-2.94-2.97c-12.37,0.11-24.74,0.05-37.11,0.05   c-6.38,0-11.91-3.69-13.04-9.09c-1.09-5.19,0.05-11.44,6.75-14.63c0.24-0.11,0.42-0.34,1.12-0.9c-9.11,0-17.7,0-26.29,0   c1-0.89,2.23-0.54,3.36-0.54c8.86-0.03,17.71-0.01,26.57-0.01C121.04,173.16,125.33,173.18,129.61,174.66z"/><path class="st5" d="M167.08,78.55c0.05-4.65,0.1-9.3,0.15-13.95c1.38,0.19,1.11,1.43,1.37,2.27c2.45,8.17,9.54,13.69,17.9,13.89   c7.41,0.18,14.91-5.36,17.7-13.02c0.3-0.84,0.23-2.05,1.61-2.11c0.23,0.22,0.39,0.47,0.5,0.76c0.49,3.28,0.14,6.59,0.24,9.89   c0.27,8.52,5.5,15.88,13.28,17.91c5.74,1.49,11.37,0.93,16.36-2.78c1.04-0.78,1.95-1.98,3.53-1.69   c-5.21,9.84-13.5,15.58-24.17,18.14c-1.32,0.32-2.69,0.59-4.03,0.59c-19.69,0.04-39.38,0.03-59.07,0.03   c-0.02-1.39,1.23-1.33,2.03-1.69c7.87-3.49,11.88-9.48,11.81-18.12C166.26,85.28,166.33,81.89,167.08,78.55z"/><path class="st6" d="M12.6,50.46c1.5,5.61,3.98,10.61,9.22,13.6c6.11,3.5,12.43,4.19,18.83,0.59c4.27-2.03,7.16-5.34,9.12-9.58   c0.43-0.93,0.47-2.07,1.34-2.79c1.03,0.99,0.91,2.3,0.9,3.53c-0.01,3.19,0.19,6.38-0.15,9.55c-1.19,4.97-3.52,9.28-7.58,12.49   c-1.67,1.32-1.75,2.8-1.22,4.66c1.63,5.65,4.94,10.32,8.48,14.87c0.35,4.02,2.14,7.66,3,11.54c-12.64,0.51-23.88-2.69-32.59-12.42   c-5.99-6.7-9.18-14.61-9.39-23.58C12.39,65.44,12.57,57.95,12.6,50.46z"/><path class="st6" d="M167.08,78.55c-0.23,5.11,0.7,10.28-0.51,15.32c-1.74,7.25-6.17,12.05-13.45,14.1   c-0.25,0.07-0.45,0.34-0.67,0.52c-3.12,0.59-6.24,0.55-9.36,0c-11.21-1.91-17.34-14.78-14.82-22.54   c-2.28,10.01-13.09,15.14-20.63,14.34c-9.79-1.03-17.85-8.84-17.68-17.51c0.05-4.49-0.67-9.01,0.37-13.47   c0.85,0.63,0.93,1.67,1.3,2.54c3.43,7.97,9.22,12.48,18.13,12.45c1.15,0,2.3,0.09,3.45,0.17c6.79-1.24,11.08-5.5,13.92-11.51   c0.4-0.85,0.39-1.91,1.29-2.51c0.92,0.82,0.76,1.94,0.79,2.99c0.44,12.81,7.79,20.01,20.63,20.24c0.66,0.01,1.35-0.34,1.99,0.07   c7.66-1.87,12.71-6.45,14.73-14.18C166.66,79.21,166.91,78.89,167.08,78.55z"/><path class="st7" d="M244.58,66.29c15.67-0.61,28.67,10.08,31.64,25.02c1.88,9.49-0.11,18.19-6.24,25.89   c-8.11,10.2-19.05,12.57-31.25,11.68c-0.25-0.02-0.48-0.3-0.72-0.45c13.48-2.62,23.88-12.87,25.59-26.12   c1.93-14.97-5.26-27.69-18.99-33.67c-0.83-0.71-0.48-1.53-0.23-2.35L244.58,66.29z"/><path class="st4" d="M51.08,66.31c0.01-4.67,0.02-9.35,0.03-14.02c0.01-0.19,0.02-0.39,0.02-0.58c0.05-4.36,2.01-5.47,5.85-3.17   c2.4,1.44,3.59,3.58,3.57,6.54c-0.08,13.44-0.01,26.87-0.04,40.31c-0.02,9.48,3.41,16.81,12.57,20.66c0.7,0.3,0.5,0.66,0.32,1.11   c-7.88,0.93-14.1-1.94-18.85-8.21c-2.31-3.53-3.36-7.43-3.46-11.62c-0.44-0.88-0.86-1.77-0.84-2.77c0.2-9.23-0.73-18.49,0.65-27.69   C50.91,66.67,51.01,66.49,51.08,66.31z"/><path class="st7" d="M129.61,174.66c-4.29,0-8.57,0.01-12.86,0.01c-0.57-13.24,3.46-24.71,13.14-33.96   c7.93-7.57,17.39-11.56,28.39-11.73c2.73-0.04,5.46,0.02,8.19,0.04c-5.18,1.51-10.43,2.68-15.2,5.46   c-12.19,7.1-19.05,17.6-21.17,31.47C129.65,168.87,129.75,171.75,129.61,174.66z"/><path class="st5" d="M89.95,82.77c1.25,6.45,4.55,11.52,10.43,14.56c10.6,5.48,23.07,0.41,27.09-10.87   c0.16-0.45,0.36-0.88,0.67-1.61c0.76,2.61,0.2,5.07,0.62,7.46c1.32,7.55,5.84,12.26,12.56,15.27c0.6,0.27,1.38,0.2,1.78,0.9   c-17.75,0.04-35.51,0.08-53.26,0.12c-1.76-2.2-0.11-4.43-0.07-6.64C89.82,95.56,89.89,89.16,89.95,82.77z"/><path class="st6" d="M244.37,66.29c0.08,0.78,0.15,1.56,0.23,2.35c-0.15,5.6-0.17,11.22-2.45,16.51c-0.69,1.6-1.28,3.23-2.42,4.58   c-4.56,3.97-9.61,6.23-15.91,5.94c-7.92-0.36-15.98-6.88-17.48-14.68c-0.95-4.94-0.49-9.89-0.5-14.85   c1.08,0.16,1.29,1.11,1.61,1.89c3.85,9.34,11.02,13.19,20.85,12.67c0.3-0.02,0.58,0.02,0.84,0.16c7.15-1.6,11.82-5.98,14.37-12.77   C243.75,67.47,243.7,66.7,244.37,66.29z"/><path class="st8" d="M89.76,101.95c0.02,2.21,0.04,4.43,0.07,6.64c-0.95,0.61-1.99,0.3-3,0.26   C87.81,106.55,88.78,104.25,89.76,101.95z"/><path class="st6" d="M205.8,65.7c-1.36,3.17-2.19,6.61-4.79,9.15c-5.6,5.48-12.08,8.17-19.87,5.74c-7.6-2.37-12.31-7.49-13.6-15.51   c-0.03-0.17-0.21-0.32-0.32-0.47c0.08-4.29-0.67-8.6,0.41-12.86c0.99,0.66,1.07,1.81,1.52,2.76c3.3,7.03,8.69,11.09,16.56,11.62   c1.25,0.08,2.56-0.21,3.67,0.63c7.52-1.53,12.74-5.78,15.41-13.05c0.19-0.51,0.61-0.94,0.93-1.41c1.03,0.98,1.02,2.29,0.92,3.51   C206.39,59.1,207.52,62.53,205.8,65.7z"/><path class="st4" d="M205.8,65.7c-0.03-4.47-0.05-8.94-0.08-13.41c0.01-0.19-0.02-0.39,0.03-0.58c0.3-1.34-0.83-3.3,0.82-3.93   c1.94-0.75,3.99-0.09,5.69,1.29c2.02,1.64,2.9,3.72,2.9,6.34c0,3.19-0.38,6.41,0.23,9.58c1.51,7.94,6.39,12.99,13.76,15.86   c-8.02,2.38-17.98-2.56-21.61-10.73c-0.59-1.32-1.13-2.66-1.69-3.99C205.85,65.99,205.84,65.84,205.8,65.7z"/><path class="st4" d="M151.84,93.75c-9.31,2.75-20.19-4-22.77-14.04c-0.79-3.07-0.49-6.17-0.65-9.26c0.45-1.35-1.02-3.48,1.12-4.04   c2.49-0.65,4.89,0.19,6.61,2.16c1,1.16,1.71,2.59,1.67,4.26C137.55,83.12,142.47,89.93,151.84,93.75z"/><path class="st4" d="M189.39,66.74c-11.14,0.81-19.61-5.04-21.75-15c0.18-1.37-1.74-3.09,0.42-4.08c2.73-1.24,7.37,0.58,8.58,3.24   c0.68,1.49,1.11,3.1,1.76,4.61c1.97,4.57,5.31,7.77,9.87,9.73C188.88,65.49,190,65.52,189.39,66.74z"/><path class="st4" d="M113.21,84.46c-9.62,3.06-21.71-4.95-22.89-15.16c0.64-1.11-1.62-2.69,0.46-3.51   c2.75-1.08,7.23,0.58,8.45,3.09c0.63,1.3,1.02,2.73,1.52,4.09C102.95,78.93,107.71,82.09,113.21,84.46z"/><path class="st5" d="M51.08,66.31c0,10.34,0,20.67,0,31.01c-4.85-4.52-7.55-10.25-9.22-16.53c-0.22-0.84-0.29-1.86,0.57-2.41   C46.88,75.47,49.31,71.14,51.08,66.31z"/></g></svg>',
          SVGgallery = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><path d="M27.58,159.78c-3.66-26.56-7.28-52.87-10.9-79.18c-2.09-15.17-4.02-30.36-6.32-45.5C7.51,16.43,22.26,0.13,42.67,0.06   c35.02-0.12,70.05-0.04,105.07-0.04c36.26,0,72.52-0.03,108.78,0.01c17.6,0.02,31.04,10.39,33.22,26.42   c0.77,5.65-0.37,11.6-1.14,17.36c-3.66,27.36-7.48,54.7-11.26,82.04c-1.55,11.25-3.14,22.49-4.73,33.92   C191,159.78,109.45,159.78,27.58,159.78z"/><path d="M106.98,239.95c-14.54,0-28.66,0.03-42.78-0.02c-2.68-0.01-5.4-0.1-8.03-0.52c-14.86-2.35-26.02-13.46-26.73-27.39   c-0.54-10.57-0.11-21.18-0.11-31.91c80.63,0,161.06,0,241.42,0c0.19,0.31,0.39,0.49,0.39,0.66c-0.09,10.51,0.21,21.04-0.41,31.53   c-0.9,15.28-14.78,27.34-31.33,27.59c-14.03,0.21-28.06,0.06-42.09,0.07c-1.22,0-2.44,0-4.1,0c0,6.19,0.15,12.19-0.05,18.18   c-0.12,3.72-0.34,7.52-1.25,11.13c-4.86,19.35-24.92,32.62-45.82,30.54c-22.22-2.21-38.87-19-39.08-39.44   C106.92,253.7,106.98,247.04,106.98,239.95z"/></g></svg>',
          SVGstring = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><path d="M172.28,64.13c21,21.26,41.91,42.42,63.1,63.86c-0.94,1-1.76,1.93-2.64,2.8c-40.49,40.42-80.97,80.84-121.49,121.22   c-1.81,1.8-3.77,3.66-6.01,4.78c-28.09,14.01-56.19,27.99-84.42,41.72c-8.74,4.25-18.89-0.99-20.59-10.49   c-0.56-3.12-0.1-6.97,1.28-9.81c13.62-27.98,27.52-55.82,41.42-83.67c0.97-1.95,2.39-3.79,3.94-5.34   c41.2-41.2,82.44-82.35,123.68-123.51C171.04,65.21,171.57,64.77,172.28,64.13z"/><path d="M256.99,105.72c-20.9-20.87-41.96-41.89-63.17-63.07c0.58-0.65,1.23-1.44,1.94-2.16c8.8-8.93,17.48-17.98,26.43-26.76   c12.68-12.44,27.89-16.68,44.93-11.68c17.03,4.99,27.68,16.72,31.54,34.02c3.18,14.27-0.03,27.54-9.84,38.27   C278.81,85.3,267.69,95.26,256.99,105.72z"/><path d="M217.44,299.9c-22.3,0-44.6,0.05-66.9-0.02c-9.8-0.03-16.28-6.91-15.62-16.3c0.48-6.93,6.2-12.8,13.12-13.43   c1.28-0.12,2.58-0.12,3.87-0.12c43.66-0.01,87.32-0.01,130.98,0.02c2.1,0,4.27,0.03,6.27,0.57c7.39,2.01,11.75,9.02,10.67,16.77   c-0.99,7.07-7.11,12.43-14.79,12.46c-22.53,0.1-45.07,0.03-67.6,0.03C217.44,299.9,217.44,299.9,217.44,299.9z"/></g></svg>',
          SVGpalette = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><path d="M0,148C0.56,87.87,36.81,33.85,94.53,10.83c86.02-34.32,182.42,16.05,202.06,107.56   c17.66,82.25-34.97,162.12-117.25,178.63c-30.4,6.1-59.99,2.77-88.5-9.37c-17.06-7.26-21.41-28.99-8.58-42.36   c6.11-6.36,12.44-12.51,18.63-18.79c4.77-4.83,6.98-10.63,5.81-17.38c-1.3-7.44-5.61-12.63-12.86-14.88   c-7.74-2.4-14.85-0.85-20.77,4.8c-5.89,5.63-11.58,11.47-17.37,17.2c-14.8,14.64-36.61,10.12-44.42-9.14   C3.85,188.81,0.06,169.8,0,148z M160.59,96.27c11.82,0.03,21.49-9.66,21.46-21.5c-0.03-11.71-9.57-21.29-21.25-21.37   c-11.88-0.07-21.6,9.51-21.63,21.32C139.14,86.59,148.74,96.24,160.59,96.27z M106.98,117.68c0.01-11.82-9.68-21.44-21.55-21.4   c-11.69,0.03-21.27,9.6-21.33,21.29c-0.05,11.86,9.56,21.57,21.38,21.58C97.34,139.15,106.97,129.53,106.98,117.68z M224.98,117.71   c-11.84-0.03-21.5,9.63-21.47,21.47c0.02,11.7,9.56,21.32,21.23,21.39c11.87,0.08,21.58-9.48,21.65-21.32   C246.45,127.43,236.83,117.74,224.98,117.71z M203.49,213.97c-0.06-11.79-9.83-21.34-21.72-21.23   c-11.67,0.11-21.18,9.75-21.16,21.46c0.02,11.84,9.71,21.47,21.55,21.41C193.99,235.54,203.55,225.84,203.49,213.97z"/></g></svg>',
          SVGshare = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><path d="M225,300c-2.55-0.55-5.12-1.03-7.65-1.67c-25.13-6.31-42.79-26.05-45.42-51.68c-0.66-6.39,0.77-12.98,1.12-19.49   c0.06-1.07-0.12-2.76-0.8-3.17c-13.12-8.09-26.32-16.04-39.48-23.99c-32.92,32.73-79.96,24.46-103.41-0.48   C3.4,171.9,3.53,130.61,26.35,103.88C40.05,87.84,57.57,79.2,78.74,78.46c21.05-0.74,38.88,6.92,53.92,21.53   c13.24-8.01,26.33-15.97,39.48-23.84c1.64-0.98,1.26-2.11,0.96-3.47c-3.53-16.12-0.97-31.18,7.74-45.22   c18.96-30.55,62.57-36.78,89.33-12.72c24.1,21.67,27.1,56.84,7.02,82.09c-20.26,25.46-58.86,29.44-83.82,8.5   c-2.34-1.96-3.83-2.15-6.43-0.53c-11.59,7.24-23.34,14.22-35.03,21.29c-0.82,0.5-1.62,1.04-2.56,1.64   c2.39,7.88,4.03,15.84,3.4,23.98c-0.48,6.19-1.71,12.34-2.89,18.44c-0.34,1.77-0.09,2.55,1.42,3.45   c12.32,7.36,24.6,14.77,36.84,22.26c1.6,0.98,2.56,0.94,4.02-0.29c20.34-17.14,47.7-19.41,70.26-5.3   c16.89,10.55,26.2,26.1,27.78,46.05c2.33,29.5-17.81,55.87-46.33,62.24c-2.36,0.53-4.75,0.96-7.13,1.44   C232.82,300,228.91,300,225,300z M36.43,149.08c-0.23,6.13,3.96,11.1,9.7,11.48c6.53,0.44,11.42-3.67,11.62-10.71   c0.33-11.6,9.06-22.58,23.53-23.33c6.43-0.34,10.8-5.03,10.6-10.92c-0.21-6.08-5.01-10.35-11.54-10.26   C56.46,105.67,37.36,124.7,36.43,149.08z"/></g></svg>',
          SVGconfig = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><path d="M117.11,265.6c0-3.08-0.13-6.17,0.04-9.25c0.17-3.01-1.18-4.63-3.92-5.58c-2.9-1.01-5.76-2.17-8.55-3.46   c-2.41-1.12-4.28-0.79-6.14,1.14c-4.05,4.19-8.19,8.29-12.36,12.35c-11.09,10.8-26.24,10.78-37.32-0.04   c-3.02-2.95-6.02-5.93-8.99-8.94c-11.11-11.28-11.08-26.46,0.06-37.8c3.92-3.99,7.84-7.99,11.86-11.87   c2.01-1.94,2.41-3.88,1.17-6.42c-1.45-2.97-2.71-6.03-3.85-9.13c-0.96-2.61-2.59-3.76-5.41-3.71c-5.82,0.11-11.65,0.05-17.47,0   c-13.89-0.12-24.59-9.47-25.82-23.28c-0.61-6.78-0.52-13.73,0.19-20.5c1.28-12.27,11.88-21.61,24.2-21.94   c6.28-0.17,12.56-0.15,18.84-0.01c3,0.07,4.63-1.17,5.59-3.92c1.05-3.01,2.26-5.97,3.59-8.87c1.12-2.42,0.73-4.31-1.17-6.15   c-4.08-3.99-8.08-8.07-12.08-12.14c-10.98-11.15-11-26.32-0.03-37.54c3.19-3.26,6.4-6.52,9.7-9.67   c10.48-10.02,25.57-10.05,36.06-0.03c4.38,4.18,8.63,8.49,12.84,12.84c1.95,2.01,3.91,2.37,6.45,1.14c2.87-1.39,5.83-2.6,8.82-3.71   c2.59-0.96,3.76-2.58,3.7-5.41c-0.12-5.82-0.05-11.65,0-17.47c0.12-13.88,9.48-24.58,23.29-25.82c6.78-0.61,13.73-0.51,20.5,0.2   c12.28,1.28,21.59,11.84,21.93,24.2c0.18,6.28,0.16,12.56,0.01,18.84c-0.07,3,1.17,4.63,3.92,5.59c2.9,1,5.76,2.17,8.55,3.47   c2.41,1.12,4.29,0.79,6.15-1.12c4.06-4.18,8.2-8.27,12.36-12.35C224.77,28.5,239.86,28.4,250.9,39c3.3,3.16,6.53,6.39,9.71,9.67   c10.36,10.69,10.46,25.73,0.19,36.57c-4.08,4.31-8.31,8.49-12.57,12.62c-2.01,1.94-2.43,3.86-1.18,6.41   c1.45,2.96,2.71,6.03,3.85,9.13c0.96,2.61,2.58,3.77,5.4,3.72c5.82-0.11,11.65-0.05,17.47,0c13.89,0.12,24.58,9.44,25.83,23.27   c0.61,6.78,0.51,13.73-0.19,20.5c-1.27,12.27-11.84,21.6-24.19,21.95c-6.28,0.18-12.56,0.16-18.84,0.01c-3-0.07-4.64,1.16-5.6,3.91   c-1.05,3.01-2.26,5.97-3.59,8.87c-1.12,2.42-0.74,4.31,1.15,6.16c4.09,3.99,8.1,8.05,12.1,12.13   c10.97,11.21,10.98,26.42,0.03,37.56c-3.2,3.26-6.39,6.53-9.7,9.67c-10.64,10.11-25.78,10.02-36.31-0.21   c-4.26-4.14-8.46-8.34-12.59-12.6c-1.95-2.01-3.92-2.36-6.45-1.14c-2.97,1.44-6.05,2.67-9.13,3.85c-2.32,0.89-3.41,2.39-3.38,4.92   c0.07,5.82,0.02,11.65-0.01,17.47c-0.09,14.29-9.49,25.02-23.63,26.2c-6.67,0.56-13.5,0.46-20.16-0.24   c-12.26-1.29-21.56-11.89-21.95-24.21c-0.1-3.19-0.02-6.39-0.02-9.59C117.12,265.6,117.12,265.6,117.11,265.6z M95.19,149.82   c0.01,30.41,24.45,54.93,54.82,54.98c30.24,0.05,54.81-24.58,54.82-54.98c0.01-29.89-24.63-54.6-54.48-54.64   C119.9,95.14,95.18,119.63,95.19,149.82z"/></g></svg>';

    // Function icons.
    const SVGsun = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="none" height="24" width="24"/><path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>',
          SVGmoon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect fill="none" height="24" width="24"/><path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>',
          SVGreturn = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
          SVGbug = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 .22-.03.47-.07.7l-.1.65-.37.65c-.72 1.24-2.04 2-3.46 2s-2.74-.77-3.46-2l-.37-.64-.1-.65C8.03 15.48 8 15.23 8 15v-4c0-.23.03-.48.07-.7l.1-.65.37-.65c.3-.52.72-.97 1.21-1.31l.57-.39.74-.18c.31-.08.63-.12.94-.12.32 0 .63.04.95.12l.68.16.61.42c.5.34.91.78 1.21 1.31l.38.65.1.65c.04.22.07.47.07.69v1zm-6 2h4v2h-4zm0-4h4v2h-4z"/></svg>',
          SVGsite = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>',
          SVGqr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M2.7,10.7H8c1.5,0,2.7-1.2,2.7-2.7V2.7C10.7,1.2,9.5,0,8,0H2.7C1.2,0,0,1.2,0,2.7V8C0,9.5,1.2,10.7,2.7,10.7z M2.7,2.7H8    V8H2.7V2.7z"></path><path d="M2.7,24H8c1.5,0,2.7-1.2,2.7-2.7V16c0-1.5-1.2-2.7-2.7-2.7H2.7C1.2,13.3,0,14.5,0,16v5.3C0,22.8,1.2,24,2.7,24z M2.7,16H8    v5.3H2.7V16z"></path><path d="M13.3,2.7V8c0,1.5,1.2,2.7,2.7,2.7h5.3c1.5,0,2.7-1.2,2.7-2.7V2.7C24,1.2,22.8,0,21.3,0H16C14.5,0,13.3,1.2,13.3,2.7z     M21.3,8H16V2.7h5.3V8z"></path><path d="M24,23.3V22c0-0.4-0.3-0.7-0.7-0.7H22c-0.4,0-0.7,0.3-0.7,0.7v1.3c0,0.4,0.3,0.7,0.7,0.7h1.3C23.7,24,24,23.7,24,23.3z"></path><path d="M13.3,14v1.3c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7V14c0-0.4-0.3-0.7-0.7-0.7H14C13.6,13.3,13.3,13.6,13.3,14z    "></path><path d="M18,16h-1.3c-0.4,0-0.7,0.3-0.7,0.7V18c0,0.4,0.3,0.7,0.7,0.7H18c0.4,0,0.7-0.3,0.7-0.7v-1.3C18.7,16.3,18.4,16,18,16z"></path><path d="M13.3,19.3v1.3c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7v-1.3c0-0.4-0.3-0.7-0.7-0.7H14    C13.6,18.7,13.3,19,13.3,19.3z"></path><path d="M16.7,24H18c0.4,0,0.7-0.3,0.7-0.7V22c0-0.4-0.3-0.7-0.7-0.7h-1.3c-0.4,0-0.7,0.3-0.7,0.7v1.3C16,23.7,16.3,24,16.7,24z"></path><path d="M19.3,21.3h1.3c0.4,0,0.7-0.3,0.7-0.7v-1.3c0-0.4-0.3-0.7-0.7-0.7h-1.3c-0.4,0-0.7,0.3-0.7,0.7v1.3    C18.7,21,19,21.3,19.3,21.3z"></path><path d="M20.7,13.3h-1.3c-0.4,0-0.7,0.3-0.7,0.7v1.3c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7V14    C21.3,13.6,21,13.3,20.7,13.3z"></path><path d="M22,18.7h1.3c0.4,0,0.7-0.3,0.7-0.7v-1.3c0-0.4-0.3-0.7-0.7-0.7H22c-0.4,0-0.7,0.3-0.7,0.7V18    C21.3,18.4,21.6,18.7,22,18.7z"></path></g></svg>',
          SVGpreview = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" xml:space="preserve"><g><rect y="49.1" class="st0" width="300" height="250.9"/><rect class="st1" width="300" height="50"/><rect x="10" y="64" class="st1" width="280" height="22"/><rect x="10" y="174" class="st1" width="280" height="22"/><rect x="10" y="86" class="st2" width="280" height="74"/><rect x="10" y="196" class="st2" width="280" height="90"/><rect x="10" y="15" class="st3" width="75" height="20"/><rect x="167" y="17.5" class="st4" width="35" height="15"/><rect x="211" y="17.5" class="st4" width="35" height="15"/><rect x="255" y="17.5" class="st4" width="35" height="15"/><rect x="20" y="70" class="st4" width="50.2" height="10"/><rect x="20" y="180" class="st4" width="50.2" height="10"/><rect x="79.2" y="180" class="st4" width="35.4" height="10"/><rect x="20" y="96" class="st5" width="260" height="6.7"/><rect x="20" y="108.7" class="st5" width="246.5" height="6.7"/><rect x="20" y="121.4" class="st5" width="250.5" height="6.7"/><rect x="20" y="134.1" class="st6" width="64.6" height="6.7"/><rect x="235" y="222.8" class="st7" width="40" height="15"/><rect x="235" y="244.3" class="st7" width="40" height="15"/><g><path class="st7" d="M278,218v46h-46v-46H278 M280,216h-50v50h50V216L280,216z"/></g><rect x="30" y="212" class="st5" width="40" height="8"/><rect x="100" y="212" class="st5" width="40" height="8"/><rect x="170" y="212" class="st5" width="40" height="8"/><rect x="20" y="231" class="st8" width="60" height="20"/><rect x="30" y="237" class="st9" width="40" height="8"/><rect x="90" y="231" class="st10" width="60" height="20"/><rect x="100" y="237" class="st9" width="40" height="8"/><rect x="160" y="231" class="st11" width="60" height="20"/><rect x="170" y="237" class="st9" width="40" height="8"/><rect x="20" y="256" class="st12" width="60" height="20"/><rect x="30" y="262" class="st13" width="40" height="8"/><rect x="90" y="256" class="st14" width="60" height="20"/><rect x="100" y="262" class="st13" width="40" height="8"/><rect x="160" y="256" class="st15" width="60" height="20"/><rect x="170" y="262" class="st13" width="40" height="8"/><g><path class="st8" d="M78.5,207.5v17h-57v-17H78.5 M80,206H20v20h60V206L80,206z"/></g><g><path class="st10" d="M148.5,207.5v17h-57v-17H148.5 M150,206H90v20h60V206L150,206z"/></g><g><path class="st11" d="M218.5,207.5v17h-57v-17H218.5 M220,206h-60v20h60V206L220,206z"/></g></g></svg>';

    // Themes available in the gallery.
    const gcD = ["Default","TorrentBD","moon","gcD",`${JSON.stringify(defaultDark)}`],
          gcL = ["Default","TorrentBD","sun","gcL",`${JSON.stringify(defaultLight)}`],
          gc1 = ["DuckDuckGo","NaeemBolchhi","moon","gc1",`{"bodybg":"#1e1e1e","cardbg":"#242424","bodycolor":"#eeeeee","bodystark":"#ffffff","btncolor":"#202020","btnhover":"#282828","accent1":"#868cff","accent2":"#78b1d0","accent3":"#58c197","navbg":"#181818","titlecolor":"#ffffff","logo":"#f5f5f5","catfilter":"hue-rotate(72deg) saturate(1.5)"}`],
          gc2 = ["Github","NaeemBolchhi","moon","gc2",`{"bodybg":"#010409","cardbg":"#0d1117","bodycolor":"#c9d1d9","bodystark":"#f0f6fc","btncolor":"#010409","btnhover":"#0d1117","accent1":"#0093ff","accent2":"#fa4549","accent3":"#34d058","navbg":"#161b22","titlecolor":"#f0f6fc","logo":"#f0f6fc","catfilter":"hue-rotate(60deg) saturate(5)"}`],
          gc3 = ["Github","NaeemBolchhi","sun","gc3",`{"bodybg":"#f6f8fa","cardbg":"#ffffff","bodycolor":"#242931","bodystark":"#13161a","btncolor":"#f6f8fa","btnhover":"#ffffff","accent1":"#0093ff","accent2":"#fa4549","accent3":"#34d058","navbg":"#24292f","titlecolor":"#ffffff","logo":"#ffffff","catfilter":"hue-rotate(60deg) saturate(5)"}`],
          gc4 = ["DuckDuckGo","NaeemBolchhi","sun","gc4",`{"bodybg":"#fbfbfb","cardbg":"#ffffff","bodycolor":"#444444","bodystark":"#222222","btncolor":"#fbfbfb","btnhover":"#ffffff","accent1":"#868cff","accent2":"#78b1d0","accent3":"#58c197","navbg":"#f7f7f7","titlecolor":"#222222","logo":"#222222","catfilter":"hue-rotate(72deg) saturate(1.5)"}`],
          gc5 = ["Brave Search","NaeemBolchhi","moon","gc5",`{"bodybg":"#17191e","cardbg":"#1e2028","bodycolor":"#afb3c1","bodystark":"#eceef2","btncolor":"#17191e","btnhover":"#1e2028","accent1":"#ed402b","accent2":"#d92661","accent3":"#c41895","navbg":"#1a1c23","titlecolor":"#9498a8","logo":"#eceef2","catfilter":"hue-rotate(187deg) saturate(3.3) brightness(.93)"}`],
          gc6 = ["Brave Search","NaeemBolchhi","sun","gc6",`{"bodybg":"#f2f4f7","cardbg":"#ffffff","bodycolor":"#434756","bodystark":"#242731","btncolor":"#f2f4f7","btnhover":"#ffffff","accent1":"#ed402b","accent2":"#d92661","accent3":"#c41895","navbg":"#f9fafd","titlecolor":"#636876","logo":"#5e6175","catfilter":"hue-rotate(187deg) saturate(3.3) brightness(.93)"}`],
          gc7 = ["Tailwind","NaeemBolchhi","moon","gc7",`{"bodybg":"#050d20","cardbg":"#0f172a","bodycolor":"#94a3b8","bodystark":"#e2e8f0","btncolor":"#050d20","btnhover":"#0f172a","accent1":"#38bdf8","accent2":"#8082ff","accent3":"#ed66ff","navbg":"#162033","titlecolor":"#e2e8f0","logo":"#ffffff","catfilter":"initial"}`],
          gc8 = ["Tailwind","NaeemBolchhi","sun","gc8",`{"bodybg":"#f8fafc","cardbg":"#ffffff","bodycolor":"#0f172a","bodystark":"#050d20","btncolor":"#f8fafc","btnhover":"#ffffff","accent1":"#38bdf8","accent2":"#8082ff","accent3":"#ed66ff","navbg":"#e5e6e9","titlecolor":"#0f172a","logo":"#0f172a","catfilter":"initial"}`],
          gc9 = ["Catppuccin Latte","NaeemBolchhi","moon","gc9",`{"bodybg":"#272835","cardbg":"#252533","bodycolor":"#dce0e8","bodystark":"#f8faff","btncolor":"#272835","btnhover":"#252533","accent1":"#ca9ee6","accent2":"#e5c890","accent3":"#ea999c","navbg":"#22222f","titlecolor":"#dce0e8","logo":"#eff1f5","catfilter":"initial"}`],
          gc10 = ["Catppuccin Latte","NaeemBolchhi","sun","gc10",`{"bodybg":"#eff1f5","cardbg":"#e6e9ef","bodycolor":"#4c4f69","bodystark":"#2e314b","btncolor":"#eff1f5","btnhover":"#e6e9ef","accent1":"#8839ef","accent2":"#df8e1d","accent3":"#e64553","navbg":"#dce0e8","titlecolor":"#4c4f69","logo":"#4c4f69","catfilter":"initial"}`];
          // gc11 = ["Catppuccin Frappe","NaeemBolchhi","moon","gc11",`{"bodybg":"#303446","cardbg":"#292c3c","bodycolor":"#dce0e8","bodystark":"#f8faff","btncolor":"#303446","btnhover":"#292c3c","accent1":"#dc8a78","accent2":"#7287fd","accent3":"#df8e1d","navbg":"#232634","titlecolor":"#c6d0f5","logo":"#c6d0f5","catfilter":"initial"}`],
          // gc12 = [];

    // Produce preview for themes in the gallery.
    function galleryCell(key) {
        let cellResult, cellIcon, themeColors;

        themeColors = JSON.parse(key[4]);
        if (key[2] == "sun") {cellIcon = SVGsun;} else {cellIcon = SVGmoon;}

        cellResult = `<div class="gallery-cell ${key[2]}" onclick="notify3JSON('${encodeURIComponent(key[4])}');">
            <span class="g-thumb ${key[3]}">
              <style>
                .${key[3]} .st0 {fill: ${themeColors.bodybg};}
                .${key[3]} .st1 {fill: ${themeColors.navbg};}
                .${key[3]} .st2 {fill: ${themeColors.cardbg};}
                .${key[3]} .st3 {fill: ${themeColors.logo};}
                .${key[3]} .st4 {fill: ${themeColors.titlecolor};}
                .${key[3]} .st5 {fill: ${themeColors.bodycolor};}
                .${key[3]} .st6 {fill: ${themeColors.bodystark};}
                .${key[3]} .st7 {fill: #36b0aa; filter: ${themeColors.catfilter};}
                .${key[3]} .st8 {fill: ${themeColors.accent1};}
                .${key[3]} .st9 {fill: ${themeColors.btncolor};}
                .${key[3]} .st10 {fill: ${themeColors.accent2};}
                .${key[3]} .st11 {fill: ${themeColors.accent3};}
                .${key[3]} .st12 {fill: ${applyShade(themeColors.accent1, 20)};}
                .${key[3]} .st13 {fill: ${themeColors.btnhover};}
                .${key[3]} .st14 {fill: ${applyShade(themeColors.accent2, 20)};}
                .${key[3]} .st15 {fill: ${applyShade(themeColors.accent3, 20)};}
              </style>
              ${SVGpreview}
            </span>
            <scribe class="flex flex-center flex-row flex-space-between">
              <span class="g-info"><b>${key[0]}</b><br />${key[1]}</span>
              <span class="g-icon">${cellIcon}</span>
            </scribe>
          </div>`;

        return cellResult;
    }

    // Declare containers.
    let print, themeES, themeCSS;

    // Perpetually updating container.
    function echo(key) {
        if (!print) {
            print = key;
        } else {
            print = print + key;
        }
    }

    // Get active theme.
    if (localStorage.getItem('theme') === 'light') {
        themeES = 'themeLight';
        themeCSS = lightCSS;
    } else {
        themeES = 'themeDark';
        themeCSS = darkCSS;
    }

    echo(`<!DOCTYPE html>`);
    echo(`<html>`);
    /* Head BEGIN */
    echo(`<head>`);
    echo(`<title>${titleES}</title>`);
    echo(`<meta http-equiv="content-type" content="text/html; charset=utf-8" />`);
    echo(`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`);
    echo(`<meta name="theme-color" content="${getJSON(themeES).bodybg}" />`);
    echo(`<meta name="HandheldFriendly" content="true" />`);
    echo(`<meta name="description" content="${describeES}" />`);
    echo(`<link href="https://fonts.googleapis.com/css2?family=Radio+Canada:wght@400;600" rel="stylesheet">`);
    echo(`<link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@500" rel="stylesheet">`);
    echo(`<link rel="shortcut icon" type="image/png" sizes="32x32" href="${icon32}">`);
    echo(`<link rel="shortcut icon" type="image/png" sizes="16x16" href="${icon16}">`);
    echo(`<link rel="apple-touch-icon" sizes="180x180" href="${icon180}" />`);
    echo(`<style type="text/css">${colorisCSS}</style>`);
    echo(`<style type="text/css">${themeCSS}</style>`);
    echo(`<style type="text/css">${stationCSS}</style>`);
    echo(`<style id="cat" type="text/css"></style>`);
    echo(`<style id="show" type="text/css"></style>`);
    echo(`</head>`);
    /* Head END & Body BEGIN */
    echo(`<body>`);
    echo(`<qr class="flex-center flex-content-center"><div id="qrcode" class="flex flex-center flex-content-center"></div><backdrop onclick='cancelConfirm("qr")'></backdrop></qr>`);
    echo(`<ticker class="flex-center flex-content-center"><notice></notice><backdrop></backdrop></ticker>`);
    echo(`<dialogue class="flex-center flex-content-center"><card class="flex flex-center flex-column"><inform><p class="no-margin-top"></p><p></p></inform><form onsubmit="return applyAdv(),!1" class="flex flex-center flex-column flex-content-center advanced hide"><row class="table-row"><div class="table-cell advanced"><label for="fontlink">Font Family URL</label><input required id="fontlink" type="text"></div><div class="table-cell advanced"><label for="fontname">Font Family Name</label><input required id="fontname" type="text"></div><div class="table-cell advanced"><label for="favstate">Themed Favicon</label><select id="favstate"><option value="false">Disabled</option><option value="true">Enabled</option></select></div><div class="table-cell advanced"><label for="torvisit">Mark Torrents as Visited</label><select id="torvisit"><option value="false">Disabled</option><option value="true">Enabled</option></select></div></row></form><buttons class="flex flex-row flex-self-end"><btn class="accent-2 btn-margin-right"></btn><btn class="accent-1"></btn></buttons></card><backdrop onclick='cancelConfirm("dialogue")'></backdrop></dialogue>`);
    echo(`<content class="flex flex-center flex-column">`); // Content begins.
    echo(`<header class="flex flex-center flex-row flex-space-between container"><span class="flex flex-center flex-row" onclick="engineHome()">${SVGlogo}<span class="logo font-bold"><full>T<half>orrent</half>BD </full>Theme Engine</span></span><span class="title font-bold">Gallery</span></header>`);

    /* *** MAIN SECTION START *** */

    /* 1 GALLERY */
    echo(`<main class="flex flex-center flex-column flex-content-center flex-grow container rowling">`);
    echo(`<row class="flex flex-center flex-row flex-content-center flex-grow gallery-bar">
        <div class="flex flex-center flex-row flex-space-between flex-grow g-bar">
          <span class="g-left">
            <span onclick="rootHome()">${SVGreturn}</span>
            <a href="https://naeembolchhi.github.io/torrentbd-theme-engine/" target="_blank">${SVGsite}</a>
            <a href="forums.php?action=viewtopic&topicid=37584" target="_blank">${SVGbug}</a>
          </span>
          <span class="g-right">
            <span onclick="toggleShine(0)">${SVGsun}</span>
            <span onclick="toggleShine(1)">${SVGmoon}</span>
          </span>
        </div>
      </row>`);
    echo(`<row class="gallery-row gallery">`);
    echo(galleryCell(gcD));
    echo(galleryCell(gcL));
    echo(galleryCell(gc5));
    echo(galleryCell(gc6));
    // echo(galleryCell(gc11));
    echo(galleryCell(gc9));
    echo(galleryCell(gc10));
    echo(galleryCell(gc1));
    echo(galleryCell(gc4));
    echo(galleryCell(gc2));
    echo(galleryCell(gc3));
    echo(galleryCell(gc7));
    echo(galleryCell(gc8));
    echo(`</row>`);
    echo(`</main>`);

    /* 2 STRING */
    echo(`<main class="flex-center flex-row flex-content-center flex-grow container">
        <form onsubmit="notifyJSON();return false;" class="flex flex-center flex-column flex-content-center">
          <input required type="text" class="margin-bottom" placeholder="Paste custom JSON string">
          <input class="accent-1" type="submit" value="Apply">
        </form>
      </main>`);

    /* 3 PALETTE */
    echo(`<main class="flex-center flex-row flex-content-center flex-grow container rowling">
        <form onsubmit="notify2JSON();return false;" class="flex flex-center flex-column flex-content-center">
          <row class="table-row">
            <div class="table-cell">
              <label for="bodybg">Body Background</label>
              <input required id="bodybg" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="cardbg">Card Background</label>
              <input required id="cardbg" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="bodycolor">Body Text Color</label>
              <input required id="bodycolor" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="bodystark">Body Text Stark</label>
              <input required id="bodystark" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="btncolor">Button Text Color</label>
              <input required id="btncolor" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="btnhover">Button Text Hover</label>
              <input required id="btnhover" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="accent1">Primary Accent</label>
              <input required id="accent1" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="accent2">Secondary Accent</label>
              <input required id="accent2" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="accent3">Auxiliary Accent</label>
              <input required id="accent3" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="navbg">Nav Background</label>
              <input required id="navbg" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="titlecolor">Nav Text</label>
              <input required id="titlecolor" type="text" data-coloris>
            </div>
            <div class="table-cell">
              <label for="logo">TorrentBD Logo</label>
              <input required id="logo" type="text" data-coloris>
            </div>
            <div class="table-cell catfilter">
              <label for="catfilter">Category Filter</label>
              <div class="clr-field catsrc">
                <dummy class="hide"></dummy>
                <button id="catprev" aria-labelledby="clr-open-label"></button>
                <input required id="catfilter" type="text" value="initial" autocomplete="off">
              </div>
            </div>
          </row>
          <row class="flex flex-center flex-row flex-content-center">
            <input class="accent-2 btn-margin-right" type="button" id="toggleLoad">
            <input class="accent-1" type="submit" value="Apply">
          </row>
        </form>
      </main>`);

    /* 4 SHARE */
    echo(`<main class="flex-center flex-row flex-content-center flex-grow container">
        <form onsubmit="return false;" class="flex flex-center flex-dynamic flex-content-center">
          <section class="flex flex-center flex-column flex-content-center margin-dynamic">
            <label>Light</label>
            <textarea id="lightJSON" rows="6" onclick="selector('lightJSON')" readonly></textarea>
            <row class="flex flex-center flex-row flex-content-center">
              <input class="auto-width flex-grow" type="text" id="lightURL" rows="6" onclick="selector('lightURL')" readonly>
              <qrbtn class="flex flex-center flex-content-center" onclick="showQR('lightURL')">${SVGqr}</qrbtn>
            </row>
          </section>
          <section class="flex flex-center flex-column flex-content-center">
            <label>Dark</label>
            <textarea id="darkJSON" rows="6" onclick="selector('darkJSON')" readonly></textarea>
            <row class="flex flex-center flex-row flex-content-center">
              <input class="auto-width flex-grow" type="text" id="darkURL" rows="6" onclick="selector('darkURL');" readonly>
              <qrbtn class="flex flex-center flex-content-center" onclick="showQR('darkURL');">${SVGqr}</qrbtn>
            </row>
          </section>
        </form>
      </main>`);

    /* 5 CONFIG */
    echo(`<main class="flex-center flex-column flex-content-center flex-grow container text-center">
        <profile class="flex flex-center flex-column flex-content-center">
          <img class="avatar margin-bottom" alt="NaeemBolchhi's Avatar" src="data:image/jpeg;base64,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" />
          <span class="name font-bold margin-bottom-small">NaeemBolchhi</span>
          <span class="links">
            <a href="https://t.me/NaeemBolchhi">Telegram</a> |
            <a href="https://github.com/NaeemBolchhi">Github</a> |
            <a href="/account-details.php?id=29084">TorrentBD</a>
          </span>
        </profile>
        <info class="margin-bottom-small">
          <b>TorrentBD Theme Engine</b> was developed, and is maintained by <b>NaeemBolchhi</b>.<br />
          You can find the source files of the project on <a href="https://github.com/NaeemBolchhi/torrentbd-theme-engine" target="_blank">Github</a>.
        </info>
        <info>
          This program is licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_about">GNU General Public License v3.0</a>.<br />
          By using this program, you hereby agree that you have read, understood, and accepted the terms as stated in the license.
        </info>
        <row class="flex flex-center flex-row flex-content-center">
          <btn class="reset accent-2 btn-margin-right" onclick="advancedMenu();">Advanced</btn>
          <btn class="reset accent-3" onclick="resetAll();">Reset All</btn>
        </row>
      </main>`);

    /* *** MAIN SECTION END *** */

    echo(`<footer class="flex flex-center flex-row flex-content-center container">
        <button class="static" onclick="toggle(0);">${SVGgallery}</button>
        <button onclick="toggle(1);">${SVGstring}</button>
        <button onclick="toggle(2);quickLoad();">${SVGpalette}</button>
        <button onclick="toggle(3);quickShare();">${SVGshare}</button>
        <button onclick="toggle(4);">${SVGconfig}</button>
      </footer>`);
    echo(`</content>`);
    echo(`<script type="text/javascript" src="${colorisJS}"></script>`);
    echo(`<script type="text/javascript">${qrcodeJS}</script>`);
    echo(`<script type="text/javascript">${stationJS}</script>`);
    echo(`</body>`);
    /* Body END */
    echo(`</html>`);

    document.open();
    document.write(print);
    document.close();

    updateAlert();
}