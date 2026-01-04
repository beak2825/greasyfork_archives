// ==UserScript==
// @name         Tenor GIF Link Converter FiveM CnRV
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Gif converter to CnRV FiveM Chat
// @match        https://tenor.com/*
// @grant        none
// @author       Quantico - DC: quanticojs
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506657/Tenor%20GIF%20Link%20Converter%20FiveM%20CnRV.user.js
// @updateURL https://update.greasyfork.org/scripts/506657/Tenor%20GIF%20Link%20Converter%20FiveM%20CnRV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let linkDisplay;
    let lastConvertedUrl = '';
    let initAttempts = 0;
    const maxInitAttempts = 10;
    const initDelay = 500;

    function createLinkDisplay() {
        if (!linkDisplay) {
            linkDisplay = document.createElement('div');
            linkDisplay.style.position = 'fixed';
            linkDisplay.style.top = '10px';
            linkDisplay.style.left = '10px';
            linkDisplay.style.padding = '10px';
            linkDisplay.style.background = 'rgba(255, 255, 255, 0.8)';
            linkDisplay.style.border = '1px solid black';
            linkDisplay.style.zIndex = '9999';
            linkDisplay.style.maxWidth = '300px';
            linkDisplay.style.wordBreak = 'break-all';
            document.body.appendChild(linkDisplay);
        }
    }

    function findRelevantGif() {
        return document.querySelector('img[alt*="Mein Upload"], img[alt*="My Upload"], .GifViewer img, .gif source[type="image/gif"], img[src*="tenor.com"]');
    }

    function updateLink() {
        const gifElement = findRelevantGif();
        if (gifElement) {
            let gifUrl = gifElement.src || (gifElement.tagName === 'SOURCE' ? gifElement.src : null);
            if (gifUrl && gifUrl !== lastConvertedUrl) {
                const match = gifUrl.match(/\/([^/]+)\/([^/]+(?:\.gif)?)$/);
                if (match) {
                    const convertedLink = `{t=${match[1]}/${match[2]}}`;
                    linkDisplay.textContent = convertedLink;
                    lastConvertedUrl = gifUrl;
                    return true;
                } else {
                    linkDisplay.textContent = 'Couldn\'t get the Image link';
                }
            }
        }
        return false;
    }

    function attemptInitialization() {
        createLinkDisplay();
        if (updateLink()) {
            setInterval(updateLink, 2000);
            document.body.addEventListener('DOMNodeInserted', function(event) {
                if (event.target.matches('.GifViewer, .gif')) {
                    setTimeout(updateLink, 500);
                }
            });
        } else if (initAttempts < maxInitAttempts) {
            initAttempts++;
            setTimeout(attemptInitialization, initDelay);
        } else {
            linkDisplay.textContent = 'Failed to initialize. Please refresh the page.';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(attemptInitialization, 1000);
        });
    } else {
        setTimeout(attemptInitialization, 1000);
    }
})();