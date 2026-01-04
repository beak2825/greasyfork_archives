// ==UserScript==
// @name         Add Reactions to Civitai Posts
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Add reaction buttons to posts on civitai.com
// @author       You
// @match        https://civitai.com/posts*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544502/Add%20Reactions%20to%20Civitai%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/544502/Add%20Reactions%20to%20Civitai%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Reaction types with correct emojis
    const reactions = {
        'Like': {
            emoji: '👍',
            key: 'likeCount'
        },
        'Heart': {
            emoji: '❤️',
            key: 'heartCount'
        },
        'Laugh': {
            emoji: '😂',
            key: 'laughCount'
        },
        'Cry': {
            emoji: '😢',
            key: 'cryCount'
        }
    };

    // Function to send reaction API request
    async function sendReaction(imageId, reactionType) {
        try {
            const response = await fetch('https://civitai.com/api/trpc/reaction.toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    json: {
                        entityId: imageId,
                        entityType: "image",
                        reaction: reactionType,
                        authed: true
                    }
                })
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Reaction failed:', error);
            return null;
        }
    }

    // Function to create reaction buttons
    function createReactionButtons(postElement, imageId, stats = {}) {
        // Check if buttons already exist
        if (postElement.querySelector('.custom-reactions')) {
            return;
        }

        const reactionsContainer = document.createElement('div');
        reactionsContainer.className = 'custom-reactions';
        reactionsContainer.style.cssText = `
            position: absolute;
            bottom: 8px;
            right: 8px;
            display: flex;
            gap: 4px;
            z-index: 20;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 20px;
            padding: 4px 8px;
            backdrop-filter: blur(4px);
        `;

        Object.entries(reactions).forEach(([reactionType, config]) => {
            const currentCount = stats[config.key] || 0;

            const button = document.createElement('button');
            button.className = 'reaction-btn';
            button.style.cssText = `
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                opacity: 0.8;
                color: white;
                font-size: 16px;
                gap: 2px;
                min-width: 35px;
            `;

            const countSpan = document.createElement('span');
            countSpan.className = 'reaction-count';
            countSpan.style.cssText = 'font-size: 12px; font-weight: bold;';
            countSpan.textContent = currentCount;

            button.textContent = config.emoji;
            if (currentCount > 0) {
                button.appendChild(document.createTextNode(' '));
                button.appendChild(countSpan);
            }

            // Hover effects
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
                button.style.transform = 'scale(1.1)';
                button.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.opacity = '0.8';
                button.style.transform = 'scale(1)';
                button.style.background = 'transparent';
            });

            // Click handler
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Disable button during request
                button.style.opacity = '0.5';
                button.style.pointerEvents = 'none';

                const result = await sendReaction(imageId, reactionType);

                if (result) {
                    // Update count optimistically
                    const newCount = currentCount + 1;
                    countSpan.textContent = newCount;

                    if (currentCount === 0) {
                        // Add count display if it wasn't there before
                        button.appendChild(document.createTextNode(' '));
                        button.appendChild(countSpan);
                    }

                    // Success feedback
                    button.style.background = 'rgba(0, 255, 0, 0.3)';
                    setTimeout(() => {
                        button.style.background = 'transparent';
                    }, 1000);
                } else {
                    // Error feedback
                    button.style.background = 'rgba(255, 0, 0, 0.3)';
                    setTimeout(() => {
                        button.style.background = 'transparent';
                    }, 1000);
                }

                // Restore button
                button.style.opacity = '0.8';
                button.style.pointerEvents = 'auto';
            });

            reactionsContainer.appendChild(button);
        });

        // Add the reactions container to the post
        postElement.style.position = 'relative';
        postElement.appendChild(reactionsContainer);
    }

    // Function to intercept and parse API responses to get image IDs and stats
    const originalFetch = window.fetch;
    const imageIdMap = new Map();
    const postStatsMap = new Map();

    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);

        // Check if this is a posts API call
        if (args[0] && args[0].includes('/api/trpc/post.getInfinite')) {
            try {
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();

                if (data.result?.data?.json?.items) {
                    console.log('Processing', data.result.data.json.items.length, 'posts from API');

                    data.result.data.json.items.forEach(post => {
                        if (post.images && post.images.length > 0) {
                            const firstImage = post.images[0];
                            // Map the image URL hash to the actual image ID and stats
                            imageIdMap.set(firstImage.url, {
                                id: firstImage.id,
                                stats: post.stats || {}
                            });
                            console.log('Mapped image:', firstImage.url, 'to ID:', firstImage.id);
                        }
                    });

                    // Process posts after API response
                    setTimeout(processPostCards, 1000);
                }
            } catch (error) {
                console.error('Error parsing posts data:', error);
            }
        }

        return response;
    };

    // Function to process posts and add reaction buttons
    function processPostCards() {
        console.log('Processing post cards...');
        const postCards = document.querySelectorAll('div[id]:not(.reactions-processed)');
        console.log('Found', postCards.length, 'unprocessed post cards');

        let processed = 0;
        postCards.forEach(postCard => {
            const imgElement = postCard.querySelector('img.EdgeImage_image__iH4_q');
            if (imgElement && imgElement.src) {
                // Extract the image hash from the URL
                const urlParts = imgElement.src.split('/');
                const hashPart = urlParts.find(part => part.length > 30 && part.includes('-'));

                if (hashPart && imageIdMap.has(hashPart)) {
                    const imageData = imageIdMap.get(hashPart);
                    console.log('Creating reactions for image:', imageData.id);
                    createReactionButtons(postCard, imageData.id, imageData.stats);
                    postCard.classList.add('reactions-processed');
                    processed++;
                } else if (hashPart) {
                    console.log('No image data found for hash:', hashPart);
                } else {
                    console.log('Could not extract hash from image URL:', imgElement.src);
                }
            }
        });

        console.log('Successfully processed', processed, 'posts');
        console.log('Current imageIdMap size:', imageIdMap.size);
    }

    // Observer to watch for new posts being loaded
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.matches('div[id]') || node.querySelector('div[id]'))) {
                    shouldProcess = true;
                }
            });
        });

        if (shouldProcess) {
            // Small delay to ensure all content is loaded
            setTimeout(processPostCards, 500);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Process initial posts with multiple attempts for slow loading
    setTimeout(processPostCards, 2000);
    setTimeout(processPostCards, 5000);
    setTimeout(processPostCards, 10000);
    setTimeout(processPostCards, 15000); // Additional attempt for very slow loading

    // Also process when scrolling stops (for infinite scroll) - more aggressive
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            console.log('Scroll stopped, processing posts...');
            processPostCards();
        }, 500); // Reduced delay for faster response
    });

    // Also process periodically to catch any missed posts
    setInterval(() => {
        const unprocessedPosts = document.querySelectorAll('div[id]:not(.reactions-processed)').length;
        if (unprocessedPosts > 0) {
            console.log('Periodic check: found', unprocessedPosts, 'unprocessed posts');
            processPostCards();
        }
    }, 3000); // Check every 3 seconds

    console.log('Civitai Posts Reactions script v0.10 loaded');
})();