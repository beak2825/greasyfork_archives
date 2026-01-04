// ==UserScript==
// @name         RSS Feed Finder
// @namespace    http://tampermonkey.net/
// @author       iamnobody
// @version      1.3
// @description  Find and display RSS feed links on webpages.
// @match        *://*/*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/489780/RSS%20Feed%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/489780/RSS%20Feed%20Finder.meta.js
// ==/UserScript==
// ==UserScript==
// @name         RSS Feed Finder
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Find and display RSS feed links on webpages.
// @author       iamnobody
// @license      MIT
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the floating button
    const rssButton = document.createElement('button');
    rssButton.innerHTML = '<img id="rss-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Feed-icon.svg/20px-Feed-icon.svg.png">';
    rssButton.style.position = 'fixed';
    rssButton.style.top = 'calc(20px + 2cm)';
    rssButton.style.right = '20px';
    rssButton.style.backgroundColor = 'transparent';
    rssButton.style.border = 'none';
    rssButton.style.cursor = 'pointer';
    rssButton.style.zIndex = '9999';
    document.body.appendChild(rssButton);

    // Function to find and display RSS feed links
    function findAndDisplayRSSFeeds() {
        const feedLinks = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"], a[href$=".xml"]');
        if (feedLinks.length > 0) {
            const feedList = document.createElement('ul');
            feedList.style.listStyleType = 'none';
            feedList.style.backgroundColor = '#ffffff';
            feedList.style.padding = '10px';
            feedList.style.border = '1px solid #007bff';
            feedList.style.borderRadius = '5px';
            feedList.style.position = 'fixed';
            feedList.style.top = '50px';
            feedList.style.right = '20px';
            feedList.style.zIndex = '9999';
            feedLinks.forEach(link => {
                const listItem = document.createElement('li');
                listItem.textContent = link.href;
                feedList.appendChild(listItem);
            });
            document.body.appendChild(feedList);
            rssButton.style.display = 'block';
        } else {
            rssButton.style.display = 'none';
            alert('No RSS feeds found on this page.');
        }
    }

    // Add click event listener to the RSS button
    rssButton.addEventListener('click', function() {
        findAndDisplayRSSFeeds();
        let feedLinkFound = false;
        const feedLinks = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"], a[href$=".xml"]');
        feedLinks.forEach(link => {
            GM_setClipboard(link.href);
            feedLinkFound = true;
        });
        if (feedLinkFound) {
            alert('Link copied!');
        }
    });

    // Check if there are any RSS feed links on page load
    window.addEventListener('load', function() {
        const feedLinks = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"], a[href$=".xml"]');
        if (feedLinks.length > 0) {
            const rssNotification = document.createElement('div');
            rssNotification.id = 'rss-notification';
            rssNotification.style.width = '10px';
            rssNotification.style.height = '10px';
            rssNotification.style.backgroundColor = 'red';
            rssNotification.style.borderRadius = '50%';
            rssNotification.style.position = 'absolute';
            rssNotification.style.top = '0';
            rssNotification.style.right = '0';
            rssButton.appendChild(rssNotification);
        }
    });
})();

(function() {
    'use strict';

    // Create and style the floating button
    const rssButton = document.createElement('button');
    rssButton.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Feed-icon.svg/20px-Feed-icon.svg.png">';
    rssButton.style.position = 'fixed';
    rssButton.style.top = '20px';
    rssButton.style.right = '20px';
    rssButton.style.backgroundColor = 'transparent';
    rssButton.style.border = 'none';
    rssButton.style.cursor = 'pointer';
    rssButton.style.zIndex = '9999';
    document.body.appendChild(rssButton);

    // Function to find and display RSS feed links
    function findAndDisplayRSSFeeds() {
        const feedLinks = document.querySelectorAll('link[type="application/rss+xml"], link[type="application/atom+xml"], a[href$=".xml"]');
        if (feedLinks.length > 0) {
            const feedList = document.createElement('ul');
            feedList.style.listStyleType = 'none';
            feedList.style.backgroundColor = '#ffffff';
            feedList.style.padding = '10px';
            feedList.style.border = '1px solid #007bff';
            feedList.style.borderRadius = '5px';
            feedList.style.position = 'fixed';
            feedList.style.top = '50px';
            feedList.style.right = '20px';
            feedList.style.zIndex = '9999';
            feedLinks.forEach(link => {
                const listItem = document.createElement('li');
                listItem.textContent = link.href;
                feedList.appendChild(listItem);
            });
            document.body.appendChild(feedList);
        } else {
            alert('No RSS feeds found on this page.');
        }
    }

    // Add click event listener to the RSS button
    rssButton.addEventListener('click', function() {
        findAndDisplayRSSFeeds();
        GM_setClipboard(window.location.href);
        alert('Link copied!');
    });
})();
