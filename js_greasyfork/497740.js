// ==UserScript==
// @name         Roblox Fast Server Join
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Join Roblox servers faster using protocol links
// @author       Your Name
// @match        *://www.roblox.com/games/*
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/497740/Roblox%20Fast%20Server%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/497740/Roblox%20Fast%20Server%20Join.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to join a public server using the protocol URL
    function joinPublicServer(placeId, jobId) {
        const protocolUrl = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${jobId}`;
        console.log(`Joining public server with URL: ${protocolUrl}`);
        window.location.href = protocolUrl;
    }

    // Function to extract placeId from the URL
    function extractPlaceIdFromUrl(url) {
        const regex = /\/games\/(\d+)\//;
        const match = url.match(regex);
        console.log(`Extracted placeId: ${match ? match[1] : 'null'}`);
        return match ? match[1] : null;
    }

    // Function to join a random server when the "Play" button is clicked
    function joinRandomServer() {
        console.log('Play button clicked. Joining a random server...');
        // Add your logic to join a random server here
    }

    // Function to modify the behavior of public server join buttons
    function modifyPublicServerJoinButtons() {
        const placeId = extractPlaceIdFromUrl(window.location.href);

        if (!placeId) {
            console.error('Could not extract placeId from URL');
            return;
        }

        const buttons = document.querySelectorAll('button.rbx-game-server-join');
        console.log(`Found ${buttons.length} join buttons.`);

        if (buttons.length === 0) {
            console.error('No join buttons found.');
            return;
        }

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const jobId = button.getAttribute('data-btr-instance-id');
                console.log(`Button clicked, jobId: ${jobId}`);
                if (jobId) {
                    joinPublicServer(placeId, jobId);
                } else {
                    console.error('No jobId found on the join button');
                }
            });
        });
    }

    // Run the modification functions when the page is fully loaded
    window.addEventListener('load', () => {
        console.log('Roblox Fast Server Join script loaded.');
        modifyPublicServerJoinButtons();

        const playButton = document.querySelector('button[data-testid="play-button"]');
        if (playButton) {
            console.log('Play button detected.');
            playButton.addEventListener('click', joinRandomServer);
        } else {
            console.log('Play button not found.');
        }
    });
})();