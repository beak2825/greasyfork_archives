// ==UserScript==
// @name         TikTok Bio Social Links
// @namespace    http://your.namespace
// @version      1.2
// @description  Converts tiktok bio socials into links, insta: test > instagram.com/test
// @match        *://*.tiktok.com/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/494961/TikTok%20Bio%20Social%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/494961/TikTok%20Bio%20Social%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add social media links to the user bio
    function addSocialMediaLinks() {
        try {
            // Get the element with data-e2e attribute of user-bio
            const userBioElement = document.querySelector('[data-e2e="user-bio"]');
            if (!userBioElement) return;

            // Get the inner text of the element
            const userBioText = userBioElement.innerText;

            // Define an object to map social media names to their URLs
            const socialMediaUrls = {
                "insta": {
                    url: "https://instagram.com/{username}",
                    filter: (username) => username.replaceAll(),
                    removeAtSymbol: true
                },
                "ig": {
                    url: "https://instagram.com/{username}",
                    filter: (username) => username.replaceAll(),
                    removeAtSymbol: true
                },
                "instagram": {
                    url: "https://instagram.com/{username}",
                    filter: (username) => username.replaceAll(),
                    removeAtSymbol: true
                },
                "twitch": {
                    url: "https://twitch.com/{username}",
                    filter: (username) => username.replaceAll(),
                    removeAtSymbol: true
                },
                "twitter": {
                    url: "https://twitter.com/{username}",
                    filter: (username) => username.replaceAll(),
                    removeAtSymbol: true
                },
                // Add more social media names and URLs here
                "exampleSocial": {
                    url: "https://testsocial.com/{username}",
                    filter: (username) => username.replaceAll('-', ''),
                    removeAtSymbol: false
                }
            };

            // Create a regex pattern based on the social media names
            const regexPattern = Object.keys(socialMediaUrls).join('|');
            const regex = new RegExp(`(?:${regexPattern})(?::)?\\s*([\\w\\d@_-]+)`, 'gi');

            // Replace the matched strings with links
            const bioWithLinks = userBioText.replace(regex, (match, p1, p2) => {
                const socialMediaName = match.split(/:| /)[0].trim();
                const username = p1;
                const {
                    url,
                    filter,
                    removeAtSymbol
                } = socialMediaUrls[socialMediaName.toLowerCase()];
                if (url) {
                    let processedUsername = filter ? filter(username) : username;
                    if (removeAtSymbol && processedUsername.startsWith('@')) {
                        processedUsername = processedUsername.slice(1);
                    }
                    const finalUrl = url.replace('{username}', processedUsername);
                    return `<a href="${finalUrl}" target="_blank">${socialMediaName}: ${username}</a>`;
                } else {
                    return match; // Return the original string if social media URL is not found
                }
            });

            // Set the inner HTML of the element with the modified bio
            userBioElement.innerHTML = bioWithLinks;
        } catch (error) {
            console.error('Error adding social media links:', error);
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        setTimeout(addSocialMediaLinks, 200);
    });

    // Create a MutationObserver to detect URL changes
    const observer = new MutationObserver(() => {
        if (window.location.href !== observer.lastHref) {
            observer.lastHref = window.location.href;
            setTimeout(addSocialMediaLinks, 200);
        }
    });

    // Start observing for changes
    observer.lastHref = window.location.href;
    observer.observe(document.body, { childList: true, subtree: true });

})();
