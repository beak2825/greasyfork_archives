// ==UserScript==
// @name         Reddit to Teddit Redirect
// @namespace    https://kbin.social/u/LollerCorleone
// @version      1.2
// @description  Redirects Reddit links to random teddit.net instances automatically and provides an option to reload in a different instance.
// @author       LollerCorleone
// @license      GNU GPLv3
// @match        *://www.reddit.com/*
// @match        *://old.reddit.com/*
// @match        *://teddit.net/*
// @match        *://teddit.pussthecat.org/*
// @match        *://teddit.sethforprivacy.com/*
// @match        *://teddit.bus-hit.me/*
// @match        *://teddit.adminforge.de/*
// @match        *://teddit.totaldarkness.net/*
// @match        *://teddit.zaggy.nl/*
// @match        *://teddit.froth.zone/*
// @match        *://teddit.projectsegfau.lt/*
// @match        *://rdt.trom.tf/*
// @match        *://i.opnxng.com/*
// @match        *://teddit.garudalinux.org/*
// @match        *://teddit.no-logs.com/*
// @match        *://teddit.hostux.net/*
// @match        *://teddit.artemislena.eu/*
// @match        *://teddit.rawbit.ninja/*
// @match        *://teddit.privacytools.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469588/Reddit%20to%20Teddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/469588/Reddit%20to%20Teddit%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of teddit instances
    var tedditInstances = [
        'https://teddit.net',
        'https://teddit.pussthecat.org',
        'https://teddit.sethforprivacy.com',
        'https://teddit.bus-hit.me',
        'https://teddit.adminforge.de',
        'https://teddit.totaldarkness.net',
        'https://teddit.zaggy.nl',
        'https://teddit.froth.zone',
        'https://teddit.projectsegfau.lt',
        'https://rdt.trom.tf',
        'https://i.opnxng.com',
        'https://teddit.garudalinux.org',
        'https://teddit.no-logs.com',
        'https://teddit.hostux.net',
        'https://teddit.artemislena.eu',
        'https://teddit.rawbit.ninja',
        'https://teddit.privacytools.io'
    ];

    // Get the current URL
    var currentUrl = window.location.href;

    // Check if the URL matches the Reddit homepage
    if (currentUrl === 'https://www.reddit.com/' || currentUrl === 'https://old.reddit.com/') {
        // Redirect to a random teddit instance's homepage
        var randomInstance = tedditInstances[Math.floor(Math.random() * tedditInstances.length)];
        var tedditUrl = randomInstance + '/r/all';
        window.location.replace(tedditUrl);
        return; // Stop further script execution
    } else if (currentUrl.match(/https?:\/\/(?:www|old|teddit)\.reddit\.com\/r\/\w+\//)) {
        // Construct the teddit.net subreddit URL
        var randomInstance = tedditInstances[Math.floor(Math.random() * tedditInstances.length)];
        var tedditUrl = currentUrl.replace(/https?:\/\/(?:www|old|teddit)\.reddit\.com/, randomInstance);

        // Redirect to the random teddit instance's subreddit URL
        window.location.replace(tedditUrl);
        return; // Stop further script execution
    } else if (currentUrl.match(/https?:\/\/(?:www|old|teddit)\.reddit\.com\/r\/\w+\/comments\/\w+\//)) {
        // Construct the teddit.net post URL
        var randomInstance = tedditInstances[Math.floor(Math.random() * tedditInstances.length)];
        var tedditUrl = currentUrl.replace(/https?:\/\/(?:www|old|teddit)\.reddit\.com/, randomInstance);

        // Redirect to the random teddit instance's post URL
        window.location.replace(tedditUrl);
        return; // Stop further script execution
    }

    // Add a reload button to the teddit page
    function addReloadButton() {
        var button = document.createElement('button');
        button.innerText = 'Reload in Another Instance';
        button.style.position = 'fixed';
        button.style.bottom = '2vh';
        button.style.right = '2vh';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';

        button.addEventListener('click', function() {
            // Redirect to a different random teddit instance when clicked
            var randomInstance = tedditInstances[Math.floor(Math.random() * tedditInstances.length)];
            window.location.href = randomInstance + window.location.pathname;
        });

        document.body.appendChild(button);
    }

    // Add the reload button when the teddit page is loaded
    window.addEventListener('load', addReloadButton);
})();