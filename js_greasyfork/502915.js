// ==UserScript==
// @name Youtube Commenters Info display
// @namespace http://tampermonkey.net/
// @version 0.10
// @description Displays the number of subscribers, joined date, video count, view count, and country next to each comment under every video.
// @author You
// @match https://www.youtube.com/watch?*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/502915/Youtube%20Commenters%20Info%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/502915/Youtube%20Commenters%20Info%20display.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Function to fetch channel information
    const getChannelInfo = async (channelUrl) => {
        try {
            const response = await fetch(channelUrl + '/about');
            if (!response.ok) {
                console.error(`Failed to fetch channel info for ${channelUrl}: ${response.status} ${response.statusText}`);
                return { subs: null, joined: null, country: null, videoCount: null, viewCount: null };
            }
            const text = await response.text();

            const subRegex = /"subscriberCountText":\s*(?:"([^"]+)"|{\s*"simpleText":\s*"([^"]+)"\s*})/;
            const joinedRegex = /"joinedDateText":\s*{\s*"content":\s*"([^"]+)"/;
            const countryRegex = /"country":\s*"([^"]+)"/;
            const videoCountRegex = /"videoCountText":\s*"([^"]+)"/;
            const viewCountRegex = /"viewCountText":\s*"([^"]+)"/;

            const subMatch = text.match(subRegex);
            const joinedMatch = text.match(joinedRegex);
            const countryMatch = text.match(countryRegex);
            const videoCountMatch = text.match(videoCountRegex);
            const viewCountMatch = text.match(viewCountRegex);

            let subs = null;
            let joined = null;
            let country = null;
            let videoCount = null;
            let viewCount = null;

            // Subscriber count
            if (subMatch) {
                const countText = subMatch[1] || subMatch[2];
                if (countText === "No subscribers" || countText === "0 subscribers") {
                    subs = "0 subs";
                } else if (countText === "Subscriber count is hidden") {
                    subs = "Private";
                } else {
                    let numberOfSubs = countText.replace(/[^0-9.,KM]/g, '');
                    let suffix = countText.replace(/[\d.,\s]/g, '').toUpperCase();

                    if (suffix === 'K') {
                        numberOfSubs = (parseFloat(numberOfSubs.replace(',', '.')) * 1e3).toLocaleString('en-US');
                    } else if (suffix === 'M') {
                        numberOfSubs = (parseFloat(numberOfSubs.replace(',', '.')) * 1e6).toLocaleString('en-US');
                    }
                    subs = `${numberOfSubs} sub${numberOfSubs === '1' ? '' : 's'}`;
                }
            }

            // Joined date
            if (joinedMatch) {
                const joinedDate = new Date(joinedMatch[1].replace(/^Joined\s+/, ''));
                const month = joinedDate.getMonth() + 1;
                const day = joinedDate.getDate();
                const year = joinedDate.getFullYear().toString().slice(2);
                joined = `${month}/${day}/${year}`;
            }

            // Country
            if (countryMatch) {
                country = countryMatch[1];
            }

            // Video count
            if (videoCountMatch) {
                videoCount = videoCountMatch[1];
            }

            // View count
            if (viewCountMatch) {
                viewCount = viewCountMatch[1];
            }

            return { subs, joined, country, videoCount, viewCount };
        } catch (error) {
            console.error('Error fetching channel info:', error);
            return { subs: null, joined: null, country: null, videoCount: null, viewCount: null };
        }
    };

    // Function to determine color based on joined date
    const getColorForDate = (dateString, colorizeForwards = true) => {
        const joinDate = new Date(dateString);
        const now = new Date();
        const oldestDate = new Date('2005-02-14'); // YouTube's founding date

        const totalDays = (now - oldestDate) / (1000 * 60 * 60 * 24);
        const daysSinceJoin = (now - joinDate) / (1000 * 60 * 60 * 24);

        const ratio = colorizeForwards ?
            Math.pow(1 - (daysSinceJoin / totalDays), 3) :
            Math.pow(daysSinceJoin / totalDays, 3);

        const red = Math.round(51 + (153 * ratio));

        return `rgb(${red}, 51, 51)`;
    };

    // Function to create info bubbles
    const createInfoBubble = (text, customBackground = null, link = null) => {
        const bubble = document.createElement('a');
        bubble.className = 'channel-info-bubble';
        bubble.textContent = text;
        bubble.style.fontSize = '1.1rem';
        bubble.style.lineHeight = 'normal';
        bubble.style.color = '#ddd';
        bubble.style.backgroundColor = customBackground || '#333';
        bubble.style.marginLeft = '4px';
        bubble.style.padding = '1px 3px 1px 3px';
        bubble.style.borderRadius = '3px';
        bubble.style.textDecoration = 'none';
        if (link) {
            bubble.href = link;
            bubble.target = '_blank';
        }
        return bubble;
    };

    // Main function to add channel info to a comment element
    const addCommentChannelInfo = async (commentElement, colorizeForwards = true, enableColorizing = true) => {
        // Prefer looking for the main author link first, which typically has the @handle or /channel/ ID
        const channelLinkElement = commentElement.querySelector('div#header-author a#author-text, div#author-thumbnail > a');

        if (!channelLinkElement) {
            // This might happen if the comment structure is different or not fully loaded
            // console.warn("Could not find channel link element for comment:", commentElement);
            return;
        }

        const commentHeaderElement = commentElement.querySelector('div#header-author');
        if (!commentHeaderElement) {
            // console.warn("Could not find comment header element for comment:", commentElement);
            return;
        }

        // Remove any existing info bubbles to prevent duplicates on updates
        commentHeaderElement.querySelectorAll('.channel-info-bubble').forEach(el => {
            el.remove();
        });

        let originalChannelHref = channelLinkElement.href;
        let channelUrl;

        // Determine if it's an @handle or a /channel/ ID
        if (originalChannelHref.includes('/@')) {
            const channelHandle = originalChannelHref.split('/').pop();
            channelUrl = `https://www.youtube.com/${channelHandle}`;
        } else if (originalChannelHref.includes('/channel/')) {
            channelUrl = originalChannelHref;
        } else {
            // Fallback for older or less common URL structures. YouTube typically redirects these.
            // If this is common, further logic might be needed to resolve these to canonical URLs.
            // For now, we'll use the original href and hope YouTube's server handles the redirect.
            console.warn("Unrecognized channel URL format, attempting to use original href:", originalChannelHref);
            channelUrl = originalChannelHref;
        }

        const { subs, joined, country, videoCount, viewCount } = await getChannelInfo(channelUrl);

        const infoContainer = document.createElement('span');
        infoContainer.className = 'channel-info-container';
        infoContainer.style.display = 'inline-flex';
        infoContainer.style.alignItems = 'center';
        infoContainer.style.marginLeft = '4px';

        if (joined) {
            const joinColor = enableColorizing ? getColorForDate(joined, colorizeForwards) : null;
            infoContainer.appendChild(createInfoBubble(joined, joinColor, `${channelUrl}/about`));
        }
        if (subs) infoContainer.appendChild(createInfoBubble(subs, null, `${channelUrl}/about`));
        if (videoCount) infoContainer.appendChild(createInfoBubble(videoCount, null, `${channelUrl}/videos`));
        if (viewCount) infoContainer.appendChild(createInfoBubble(viewCount, null, `${channelUrl}/about`));
        if (country) infoContainer.appendChild(createInfoBubble(country, null, `${channelUrl}/about`));

        if (infoContainer.children.length > 0) {
            commentHeaderElement.appendChild(infoContainer);
        }

        // Set up a MutationObserver to react if the channel link's href changes (e.g., dynamic updates)
        const observer = new MutationObserver(async mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    // Hide current info while fetching new
                    infoContainer.style.visibility = 'hidden';

                    let updatedOriginalChannelHref = channelLinkElement?.href;
                    if (!updatedOriginalChannelHref) {
                        console.warn("Could not find channel link on update for comment element, hiding info:", commentElement);
                        infoContainer.style.visibility = 'hidden'; // Ensure it stays hidden if link is gone
                        return;
                    }

                    let updatedChannelUrl;
                    if (updatedOriginalChannelHref.includes('/@')) {
                        const channelHandle = updatedOriginalChannelHref.split('/').pop();
                        updatedChannelUrl = `https://www.youtube.com/${channelHandle}`;
                    } else if (updatedOriginalChannelHref.includes('/channel/')) {
                        updatedChannelUrl = updatedOriginalChannelHref;
                    } else {
                        console.warn("Unrecognized channel URL format on update, attempting to use original href:", updatedOriginalChannelHref);
                        updatedChannelUrl = updatedOriginalChannelHref;
                    }

                    const { subs: updatedSubs, joined: updatedJoined, country: updatedCountry, videoCount: updatedVideoCount, viewCount: updatedViewCount } = await getChannelInfo(updatedChannelUrl);

                    infoContainer.innerHTML = ''; // Clear previous bubbles

                    if (updatedJoined) {
                        const joinColor = enableColorizing ? getColorForDate(updatedJoined, colorizeForwards) : null;
                        infoContainer.appendChild(createInfoBubble(updatedJoined, joinColor, `${updatedChannelUrl}/about`));
                    }
                    if (updatedSubs) infoContainer.appendChild(createInfoBubble(updatedSubs, null, `${updatedChannelUrl}/about`));
                    if (updatedVideoCount) infoContainer.appendChild(createInfoBubble(updatedVideoCount, null, `${updatedChannelUrl}/videos`));
                    if (updatedViewCount) infoContainer.appendChild(createInfoBubble(updatedViewCount, null, `${updatedChannelUrl}/about`));
                    if (updatedCountry) infoContainer.appendChild(createInfoBubble(updatedCountry, null, `${updatedChannelUrl}/about`));

                    infoContainer.style.visibility = infoContainer.children.length > 0 ? 'visible' : 'hidden';
                }
            }
        });

        // Ensure the channelLinkElement exists before observing it
        if (channelLinkElement) {
            observer.observe(channelLinkElement, {
                attributes: true, // Watch for attribute changes
                attributeFilter: ['href'] // Only care about the 'href' attribute
            });
        }
    };

    // Main observer to detect when new YTD-COMMENT-VIEW-MODEL elements are added to the DOM
    const mainObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                // nodeType 1 is an element
                if (addedNode.nodeType === 1 && addedNode.tagName === 'YTD-COMMENT-VIEW-MODEL') {
                    addCommentChannelInfo(addedNode, true, true); // Add info to the new comment
                }
            });
        });
    });

    // Start observing the 'ytd-app' element (the main YouTube application) for changes
    // This is generally the root element that all dynamic content changes happen within.
    const ytdApp = document.querySelector('ytd-app');
    if (ytdApp) {
        mainObserver.observe(ytdApp, {
            childList: true, // Observe direct children additions/removals
            subtree: true    // Observe changes in the entire subtree
        });
    } else {
        console.error("Could not find 'ytd-app' element. The script might not be initialized correctly.");
    }

})();