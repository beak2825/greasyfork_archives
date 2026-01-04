// ==UserScript==
// @name         Solario Dots
// @name:zh-CN   Solario 點
// @namespace    duck stuff
// @match        https://solario.ws/*
// @version      2.0
// @author       duckduckckckckck
// @grant        GM_addStyle
// @description  adds many adjustments to the Solario website
// @description:zh-cn 为党争光! Glory to the CCP!
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498066/Solario%20Dots.user.js
// @updateURL https://update.greasyfork.org/scripts/498066/Solario%20Dots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ClickIgnoreAndProceedPles() {
        const buttons = document.querySelectorAll('button.cf-btn.cf-btn-danger');
        if (buttons.length > 0) {
            buttons[0].click();
        }
    }

    GM_addStyle(`
        html, body {
            background: radial-gradient(circle, rgb(30, 30, 30) 10%, transparent 11%) repeat,
                        radial-gradient(circle at bottom left, rgb(30, 30, 30) 5%, transparent 6%) repeat,
                        radial-gradient(circle at bottom right, rgb(30, 30, 30) 5%, transparent 6%) repeat,
                        radial-gradient(circle at top left, rgb(30, 30, 30) 5%, transparent 6%) repeat,
                        radial-gradient(circle at top right, rgb(30, 30, 30) 5%, transparent 6%) repeat !important;
            background-size: 3em 3em !important;
            background-color: rgb(20, 20, 20) !important;
            color: #ffffff !important;
        }
        .border.rounded.overflow-hidden.position-relative {
            background-color: rgb(30, 30, 30) !important;
            z-index: 1 !important;
        }
        .position-absolute.m-0.fw-bold.text-limited {
            padding-left: 4px !important;
        }
    `);

    const elementsLimitedU = document.getElementsByClassName('text-limitedu');
    for (let elem of elementsLimitedU) {
        elem.style.setProperty('color', 'rgb(111, 111, 40)', 'important');
    }

    const elementsPositionAbsolute = document.getElementsByClassName('position-absolute m-0 fw-bold text-limited');
    for (let elem of elementsPositionAbsolute) {
        elem.style.setProperty('color', 'rgb(200, 240, 200)', 'important');
    }

    const para = document.querySelector('p.text-secondary.m-0.mb-1.ms-1');
    let startingPlaceId = null;
    if (para && para.textContent.includes("Starting Place ID:")) {
        startingPlaceId = para.textContent.match(/Starting Place ID: (\d+)/)[1];
    }

    if (startingPlaceId) {
        document.querySelectorAll('h1.m-0').forEach(element => {
            let newLink = document.createElement('a');
            newLink.className = 'text-white text-decoration-none';
            newLink.href = `/games/${startingPlaceId}/--`;

            let header = document.createElement('h1');
            header.className = 'mb-1';
            header.textContent = element.textContent;
            header.style.cssText = element.style.cssText;
            header.style.fontSize = window.getComputedStyle(element).fontSize;

            newLink.appendChild(header);
            element.parentNode.replaceChild(newLink, element);
        });
    }

    window.addEventListener('load', function() {
        ClickIgnoreAndProceedPles();
    });


})();
