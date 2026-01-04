// ==UserScript==
// @name         OpenGuessr Location Button
// @namespace    https://openguessr.com/
// @version      1.0
// @description  This Script Adds A Green Button: 🔍 Show Location At The Top Of Your Screen On The Right Side.
// @author       Sev
// @match        https://openguessr.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534813/OpenGuessr%20Location%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534813/OpenGuessr%20Location%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createLocationButton() {
        const existing = document.querySelector('#openGuessrLocationButton');
        if (existing) return; 

        const btn = document.createElement('button');
        btn.textContent = '🔍 Show Location';
        btn.id = 'openGuessrLocationButton';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#2c7';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

        btn.onclick = () => {
            const iframe = document.querySelector('#PanoramaIframe');
            if (!iframe) {
                alert('Panorama iframe not found. Make sure a round is active.');
                return;
            }

            const src = iframe.getAttribute('src');
            if (!src) {
                alert('Iframe has no source URL.');
                return;
            }

            try {
                const url = new URL(src);
                const location = url.searchParams.get('location');
                if (location) {
                    const mapsUrl = `https://www.google.com/maps?q=${location}`;
                    window.open(mapsUrl, '_blank');
                } else {
                    alert('No location found in iframe URL.');
                }
            } catch (err) {
                alert('Error parsing iframe URL.');
                console.error(err);
            }
        };

        document.body.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        const iframe = document.querySelector('#PanoramaIframe');
        if (iframe) {
            createLocationButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            const iframe = document.querySelector('#PanoramaIframe');
            if (iframe) createLocationButton();
        }, 1000);
    });
})();
