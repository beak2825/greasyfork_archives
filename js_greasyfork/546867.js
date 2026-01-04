// ==UserScript==
// @name         Drawaria Show Likers
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Adds a button in your Drawaria gallery drawings to show the list of players who liked them.
// @author       Rad
// @match        https://drawaria.online/gallery/*
// @icon         https://drawaria.online/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546867/Drawaria%20Show%20Likers.user.js
// @updateURL https://update.greasyfork.org/scripts/546867/Drawaria%20Show%20Likers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run when page loads
    window.addEventListener('load', () => {
        const galleryHeader = document.querySelector('.gallery-header'); // adjust if needed
        if (!galleryHeader) return;

        // Add our button
        const btn = document.createElement('button');
        btn.textContent = '👥 Show Likers';
        btn.style.marginLeft = '10px';
        btn.style.padding = '6px 10px';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.background = '#333';
        btn.style.color = '#fff';

        btn.addEventListener('click', () => {
            const likeApiUrl = getLikesApiUrl();
            if (!likeApiUrl) return alert('Could not find drawing ID.');

            GM_xmlhttpRequest({
                method: 'GET',
                url: likeApiUrl,
                onload: response => {
                    if (response.status !== 200) {
                        return alert('Error fetching likers.');
                    }
                    let users;
                    try {
                        // Adjust this based on Drawaria's actual API response
                        users = JSON.parse(response.responseText).likers || [];
                    } catch (e) {
                        return alert('Unexpected response format.');
                    }
                    showLikersOverlay(users);
                },
                onerror: () => alert('Network error fetching likers.')
            });
        });

        galleryHeader.appendChild(btn);
    });

    // Build the endpoint dynamically (adjust if Drawaria uses different structure)
    function getLikesApiUrl() {
        const params = new URLSearchParams(window.location.search);
        const drawingId = params.get('drawingId');
        if (!drawingId) return null;

        // ⚠️ You need to confirm the real API endpoint in DevTools → Network
        return `/api/gallery/likers?drawingId=${drawingId}`;
    }

    // Display overlay
    function showLikersOverlay(users) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            border: '2px solid #444',
            padding: '20px',
            zIndex: 9999,
            maxHeight: '60%',
            overflowY: 'auto'
        });

        const title = document.createElement('h3');
        title.textContent = 'Users who liked this drawing:';
        overlay.appendChild(title);

        const ul = document.createElement('ul');
        users.forEach(u => {
            const li = document.createElement('li');
            li.textContent = u.username || u; // adjust if API returns differently
            ul.appendChild(li);
        });
        overlay.appendChild(ul);

        const close = document.createElement('button');
        close.textContent = 'Close';
        close.style.marginTop = '10px';
        close.addEventListener('click', () => document.body.removeChild(overlay));
        overlay.appendChild(close);

        document.body.appendChild(overlay);
    }
})();
