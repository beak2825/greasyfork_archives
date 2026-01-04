// ==UserScript==
// @name         Geoguessr Random Map Button (Stable)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a visible floating button to get a random Geoguessr map
// @author       you
// @match        https://www.geoguessr.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541908/Geoguessr%20Random%20Map%20Button%20%28Stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541908/Geoguessr%20Random%20Map%20Button%20%28Stable%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectButton() {
        // Avoid duplicate buttons
        if (document.getElementById('random-map-button')) return;

        const button = document.createElement('button');
        button.id = 'random-map-button';
        button.textContent = '🎲 Random Map';
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 15px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#00AA88',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: '9999',
            opacity: '1',
            display: 'block',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        });

        button.onclick = async () => {
            try {
                const res = await fetch('https://www.geoguessr.com/api/v3/social/maps/browse/random', {
                    credentials: 'include'
                });
                const data = await res.json();
                const mapUrl = 'https://www.geoguessr.com' + data.url;
                window.open(mapUrl, '_blank');
            } catch (err) {
                alert('Error fetching map. Are you logged in?');
                console.error(err);
            }
        };

        document.body.appendChild(button);
    }

    // Retry until body is loaded
    function waitAndInject() {
        if (document.body) {
            injectButton();
        } else {
            setTimeout(waitAndInject, 500); // retry every 0.5s
        }
    }

    waitAndInject();
})();

