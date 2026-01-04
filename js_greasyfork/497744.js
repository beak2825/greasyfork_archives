// ==UserScript==
// @name         Roblox Smart Server Join
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Join Roblox servers intelligently based on server size, including private servers with debugging logs
// @author       Kanako
// @match        *://www.roblox.com/*
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/497744/Roblox%20Smart%20Server%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/497744/Roblox%20Smart%20Server%20Join.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to join a public server using the protocol URL
    function joinPublicServer(placeId, jobId) {
        const protocolUrl = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${jobId}`;
        console.log(`Joining public server with URL: ${protocolUrl}`);
        window.location.href = protocolUrl;
    }

    // Function to join a private server using the protocol URL
    function joinPrivateServer(placeId, linkCode) {
        const protocolUrl = `roblox://placeid=${placeId}&linkcode=${linkCode}`;
        console.log(`Joining private server with URL: ${protocolUrl}`);
        window.location.href = protocolUrl;
    }

    // Extract the placeId and linkCode from the URL
    function extractParamsFromUrl(url) {
        const regex = /\/games\/(\d+)\/[^?]+\?privateServerLinkCode=(\d+)/;
        const match = url.match(regex);
        if (match && match.length === 3) {
            console.log(`Extracted placeId: ${match[1]}, linkCode: ${match[2]}`);
            return { placeId: match[1], linkCode: match[2] };
        } else {
            console.error('Could not extract placeId and linkCode from URL');
            return null;
        }
    }

    // Disable default join behavior for private servers
    function disableDefaultJoin() {
        window.addEventListener('click', function(event) {
            const element = event.target;
            if (element.tagName === 'A' && element.href && element.href.startsWith('https://www.roblox.com/games/') &&
                element.href.includes('privateServerLinkCode')) {
                event.preventDefault();
            }
        });
    }

    // Replace current page with a blank page
    function replaceWithBlankPage() {
        const blankPageUrl = 'about:blank';
        console.log('Replacing page with a blank page...');
        window.location.replace(blankPageUrl);
    }

    // Run the setup functions and replace with a blank page immediately
    disableDefaultJoin();
    const params = extractParamsFromUrl(window.location.href);
    if (params) {
        const { placeId, linkCode } = params;
        console.log('Detected private server link.');
        joinPrivateServer(placeId, linkCode);
    } else {
        const playButton = document.querySelector('button[data-testid="play-button"]');
        if (playButton) {
            console.log('Play button detected.');
            playButton.addEventListener('click', async function(e) {
                e.preventDefault();
                console.log('Play button clicked');
                // Add your logic to join a public server here
            });
        }

        // Add logic to handle joining public servers here
        console.log('Searching for public server join button.');
    }
    replaceWithBlankPage(); // Replace with a blank page after setup
})();
