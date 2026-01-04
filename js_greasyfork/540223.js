// ==UserScript==
// @name          OneClick Save to Raindrop.io for Twitter(X) Post
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   Add a button to save tweets to Raindrop.io with a custom title, description, and tags.
// @author        Gemini assisted by @ProtoPioneer inspired by Dinomcworld - https://update.greasyfork.org/scripts/482477/One%20Click%20Copy%20Link%20Button%20for%20Twitter%28X%29.user.js
// @match         https://twitter.com/*
// @match         https://mobile.twitter.com/*
// @match         https://tweetdeck.twitter.com/*
// @match         https://x.com/*
// @icon          https://www.google.com/s2/favicons?domain=raindrop.io
// @grant         none
// @license       MIT

// @downloadURL https://update.greasyfork.org/scripts/540223/OneClick%20Save%20to%20Raindropio%20for%20Twitter%28X%29%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/540223/OneClick%20Save%20to%20Raindropio%20for%20Twitter%28X%29%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG icon for the Raindrop.io save button (floppy disk)
    const raindropSVG = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy" viewBox="0 0 24 24" stroke-width="2" stroke="#71767C" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>';
    // If you want to use the alternative, more detailed SVG, uncomment the line below and comment the one above:
    // const raindropSVG = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="400.000000pt" height="400.000000pt" viewBox="0 0 400.000000 400.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M1909 3190 c-92 -11 -223 -48 -299 -85 -90 -42 -192 -114 -184 -127 4 -7 2 -8 -5 -4 -29 19 -189 -177 -252 -309 -37 -76 -69 -181 -83 -271 l-6 -42 43 16 c31 12 78 16 177 17 113 0 146 -4 204 -23 197 -64 346 -190 430 -365 60 -127 59 -117 63 -575 l4 -423 407 3 407 4 85 27 c167 54 305 166 397 322 61 104 100 272 88 384 -28 263 -160 457 -392 576 -66 34 -73 40 -79 74 -15 96 -48 203 -83 276 -63 132 -223 327 -252 309 -7 -4 -9 -3 -5 4 8 14 -100 89 -186 129 -135 63 -343 99 -479 83z"/></g></svg>';


    /**
     * Extracts relevant data (URL, display name, username, tweet text) from a given tweet element.
     * @param {HTMLElement} tweetElement - The DOM element representing a single tweet.
     * @returns {object} An object containing the extracted tweet data.
     */
    function extractTweetData(tweetElement) {
        let originalUrl = null;
        let displayName = null;
        let username = null;
        let tweetText = null;

        // 1. Extract original tweet URL
        // Tries to find the link that points to the tweet's unique status page.
        const linkElement = tweetElement.querySelector('a[href*="/status/"]');
        if (linkElement) {
            let path = linkElement.getAttribute('href');
            // If the path is relative (e.g., /username/status/123), prepend the current origin.
            // Otherwise, it's already a full URL.
            if (path && !path.startsWith('http')) {
                originalUrl = `${window.location.origin}${path}`;
            } else if (path) {
                originalUrl = path;
            }
        }

        // 2. Extract display name and username
        // Locates the container that typically holds the user's display name and @handle.
        const userNameContainer = tweetElement.querySelector('div[data-testid="User-Name"]');
        if (userNameContainer) {
            // Display Name: Often the first `span` within a link that isn't the @handle.
            const displayNameSpan = userNameContainer.querySelector('a[role="link"] > div > div > span > span');
            if (displayNameSpan) {
                displayName = displayNameSpan.innerText;
            }

            // Username: The `span` element containing the @handle, usually with `dir="ltr"`.
            const usernameSpan = userNameContainer.querySelector('a[role="link"] > div > div > div > span[dir="ltr"]');
            if (usernameSpan) {
                username = usernameSpan.innerText; // E.g., "@username"
            }
        }

        // 3. Extract tweet text
        // Finds the `div` element that contains the main text content of the tweet.
        const tweetTextElement = tweetElement.querySelector('div[data-testid="tweetText"]');
        if (tweetTextElement) {
            tweetText = tweetTextElement.innerText;
        }

        return { originalUrl, displayName, username, tweetText };
    }

    /**
     * Constructs the Raindrop.io "add link" URL with a custom formatted title, description, and tags.
     * The title format is: "User Display Name (@username) on X/Twitter: "Tweet Text..."".
     * The entire title is truncated to a maximum of 255 characters.
     * The description indicates the Tweet Text.
     * Tags include the current host (x.com or twitter.com) and the @username, each tag is separated with comma (,).
     * @param {object} tweetData - An object containing tweet data (originalUrl, displayName, username, tweetText).
     * @returns {string|null} The constructed Raindrop.io URL, or null if essential data is missing.
     */
    function constructRaindropUrl(tweetData) {
        const { originalUrl, displayName, username, tweetText } = tweetData;

        // Ensure we have the minimum required data to construct a useful link.
        if (!originalUrl || !tweetText) {
            console.error("Missing essential tweet data for Raindrop.io URL construction.");
            return null;
        }

        const host = window.location.hostname;
        // Determine platform name ('X' or 'Twitter') based on the current hostname.
        const platformName = host.includes('x.com') ? 'X' : 'Twitter';

        // Build the prefix of the title: "User Display Name (@username) on X/Twitter:"
        let titleParts = [];
        if (displayName) {
            titleParts.push(displayName);
        }
        if (username) {
            titleParts.push(`(${username})`);
        }
        titleParts.push(`on ${platformName}:`);

        // Join parts and clean up any excessive spaces resulting from missing parts.
        let fullTitlePrefix = titleParts.join(' ').replace(/\s+/g, ' ').trim();

        // Calculate the maximum allowed length for the tweet text part.
        // The total title length cannot exceed 255 characters.
        // We subtract the prefix length, plus a small buffer for surrounding quotes and ellipsis.
        const maxTextLength = 255 - fullTitlePrefix.length - 4; // -4 accounts for " " and "..."

        let truncatedTweetText = tweetText;
        // Truncate the tweet text if it exceeds the calculated maximum length.
        // Ensure maxTextLength is positive to avoid issues with substring.
        if (tweetText.length > maxTextLength && maxTextLength > 0) {
            truncatedTweetText = tweetText.substring(0, maxTextLength).trim() + "...";
        }

        // Construct the final title string.
        const finalTitle = `${fullTitlePrefix} "${truncatedTweetText}"`;

        // The description will now contain the full tweet text
        const description = tweetText;

        // Tags will include the host and the username, comma-separated
        let tags = [host.includes('x.com') ? 'x.com' : 'twitter.com'];
        if (username) {
            // Remove the "@" symbol from the username, convert to lowercase, and replace spaces with dashes for the tag
            tags.push(username.replace(/^@/, '').toLowerCase().replace(/\s+/g, '-'));
        }
        const finalTags = tags.join(','); // Join tags with a comma

        // Base URL for adding a new link to Raindrop.io.
        const raindropBase = 'https://app.raindrop.io/add';
        // Encode URL, title, description, and tags to be safe for URL parameters.
        const encodedLink = encodeURIComponent(originalUrl);
        const encodedTitle = encodeURIComponent(finalTitle);
        const encodedDescription = encodeURIComponent(description);
        const encodedTags = encodeURIComponent(finalTags);

        // Return the complete Raindrop.io URL with new query parameters.
        return `${raindropBase}?link=${encodedLink}&title=${encodedTitle}&description=${encodedDescription}&tags=${encodedTags}`;
    }

    /**
     * Adds the Raindrop.io save button to each tweet on the page.
     */
    function addRaindropButtonToTweets() {
        // Select elements that are typically part of the action bar under a tweet.
        // On normal feeds, it's 'bookmark'. On the bookmarks page, it's 'removeBookmark'.
        const actionButtonContainers = document.querySelectorAll('button[data-testid="bookmark"], button[data-testid="removeBookmark"]');

        actionButtonContainers.forEach(actionButton => {
            // Find the immediate parent `div` that contains the action button.
            const parentDiv = actionButton.parentElement;
            // Traverse up to find the main `article` element representing the tweet.
            const tweet = parentDiv.closest('article[data-testid="tweet"]');

            // Proceed only if a tweet element is found and our button hasn't been added already.
            if (tweet && !tweet.querySelector('.raindrop-save-button')) {
                // Create a new `div` element for our custom button.
                const raindropButton = document.createElement('div');
                raindropButton.classList.add('raindrop-save-button'); // Unique class for identification.
                raindropButton.setAttribute('aria-label', 'Save to Raindrop.io');
                raindropButton.setAttribute('role', 'button');
                raindropButton.setAttribute('tabindex', '0');
                // Apply inline styles to mimic the appearance of existing Twitter action buttons.
                raindropButton.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 19px; height: 19px; border-radius: 9999px; transition-duration: 0.2s; cursor: pointer;';
                raindropButton.innerHTML = raindropSVG; // Insert the SVG icon.

                // Attach a click event listener to the new button.
                raindropButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent the click from propagating to the tweet itself.

                    const tweetData = extractTweetData(tweet);
                    // If a valid original URL is extracted, proceed to construct and open the Raindrop.io URL.
                    if (tweetData.originalUrl) {
                        const raindropUrl = constructRaindropUrl(tweetData);
                        if (raindropUrl) {
                            window.open(raindropUrl, '_blank'); // Open the URL in a new browser tab.
                            console.log('Tweet sent to Raindrop.io:', raindropUrl);
                        } else {
                            console.error('Failed to construct Raindrop.io URL.');
                        }
                    } else {
                        console.error('Could not extract tweet URL.');
                    }
                });

                // To maintain the layout and spacing consistent with other action buttons,
                // clone the parent container of the action button.
                const buttonContainerClone = parentDiv.cloneNode(true);
                buttonContainerClone.style.cssText = 'display: flex; align-items: center;';
                buttonContainerClone.innerHTML = ''; // Clear the cloned content to insert our button.
                buttonContainerClone.appendChild(raindropButton); // Add our custom button to the cloned container.

                // Insert the new button's container next to the original action buttons.
                parentDiv.parentNode.insertBefore(buttonContainerClone, parentDiv.nextSibling);
            }
        });
    }

    // Use a MutationObserver to dynamically add buttons to tweets as they appear in the DOM.
    // This is essential for single-page applications like Twitter/X where content loads asynchronously.
    const observer = new MutationObserver(addRaindropButtonToTweets);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add buttons to any tweets already present when the script first runs.
    addRaindropButtonToTweets();
})();
