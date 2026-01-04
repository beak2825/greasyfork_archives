// ==UserScript==
// @name         Low Fuel Mobile Improvements
// @namespace    http://tampermonkey.net/
// @version      2025-06-04
// @description  This is to optimise mobile view of https://lowfuelmotorsport.com/ lowfuelmotorsport AKA LFM. This helps get rid of lots of clutter.
// @author       You
// @match        https://lowfuelmotorsport.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lowfuelmotorsport.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538288/Low%20Fuel%20Mobile%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/538288/Low%20Fuel%20Mobile%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function update() {
        console.log('TAMPER UPDATE');
        removeAllStuff();
        shrinkWrapper();
        raceOverlay();
        fontSizes();
        removeCodeOfConduct();

    }

    // Run when DOM is fully loaded
    window.addEventListener('load', update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });


    injectStyle();


    function removeAllStuff() {
        const elements = [
            ...document.querySelectorAll('.dashboard-upper-wrapper'),
            ...document.querySelectorAll('.adwrappertopbanner'),
            ...document.querySelectorAll('.global-statistics-wrapper'),
            ...document.querySelectorAll('.search-bar'),
            ...document.querySelectorAll('elastic-dashboard-live'),
            ...document.querySelectorAll('.choose'),
            ...document.querySelectorAll('.dlc'),
         //   ...document.querySelectorAll('.toolbar-button'),
            ...document.querySelectorAll('.fa-heart'),
            ...document.querySelectorAll('.quickpanel-button'),
            ...document.querySelectorAll('.livestreambox'),

        ].forEach(el => el.remove());
    }

    function fontSizes() {
        document.querySelectorAll('h1').forEach(h => {
            h.style.fontSize = 'small';
        });
        document.querySelectorAll('h2').forEach(h => {
            h.style.fontSize = 'x-small';
        });
        document.querySelectorAll('.mat-list-item').forEach(h => {
            h.style.height = '20px';
        });

        document.querySelectorAll('.dashboard-series').forEach(h => {
            h.style.minHeight = '80px';
            h.style.lineHeight = '1';
        });
        document.querySelectorAll('.darkModeGameSelect').forEach(h => {
            h.style.height = '46px';
        });
        document.querySelectorAll('.ng-star-inserted').forEach(h => {
            h.style.marginBottom = 0;
        });
        document.querySelectorAll('.mat-dialog-container').forEach(h => {
            h.style.width = '100vw';
        });




        document.querySelectorAll('.series-content').forEach(el => {
            const parent = el.parentElement.parentElement;
            parent.style.margin = 0;
            parent.style.marginBottom = 0;
            parent.style.marginTop = 0;
        });
        document.querySelectorAll('.series-description').forEach(el => {
            const parent = el.parentElement.parentElement;
            parent.style.margin = 0;
            parent.style.marginBottom = 0;
            parent.style.marginTop = 0;
        });
        document.querySelectorAll('elastic-lfmlicense').forEach(el => {
            const parent = el.parentElement.parentElement;
            parent.style.margin = 0;
            parent.style.marginBottom = 0;
            parent.style.marginTop = 0;
        });



    }


    function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
        .h1 {
            font-size: small;
        }
        .h2 {
            font-size: small;
        }
        body {
            font-size: small;
        }
        .cdk-overlay-pane {
            max-width:999px !important;
            height: 100%;
        }
        .driverlink {
            font-size: small !important;
        }
    `;
        document.head.appendChild(style);
    }


    function shrinkWrapper() {
        const elements = document.querySelectorAll('.wrapper');
        elements.forEach(el => el.style.padding = '0');
    }

    function chatShrink() {
        const elements = document.querySelectorAll('.chat-respond');
        elements.forEach(el => el.style.minHeight = '0');


        const elements1 = document.querySelectorAll('.darkMode');
        elements1.forEach(el => el.style.opacity = 0.7);
    }

    function raceOverlay() {
        const elements1 = document.querySelectorAll('.cdk-overlay-pane');
        elements1.forEach(el => el.style.maxWidth = '999px');
    }

    function removeCodeOfConduct() {
        const elements = [
            ...Array.from(document.querySelectorAll('body *')).filter(el => el.textContent.includes('Verhaltensregeln - Deutsch')),
            ...Array.from(document.querySelectorAll('body *')).filter(el => el.textContent.includes('Code Of Conduct - English'))
        ];

        elements.forEach(el => {
            const wrapper = el.closest('.mat-button-wrapper');
            if (wrapper) wrapper.remove();
        });
    }









})();