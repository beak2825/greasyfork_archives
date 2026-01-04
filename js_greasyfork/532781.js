// ==UserScript==
// @name         Twitter Screenshot Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a screenshot button to Twitter/X post menus
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532781/Twitter%20Screenshot%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532781/Twitter%20Screenshot%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add only necessary button styles
    GM_addStyle(`
        .screenshot-button { 
            display: flex; 
            align-items: center;
            flex-direction: row;
            width: 100%;
            padding: 12px 16px;
            cursor: pointer;
            font-size: 15px;
            transition-property: background-color, box-shadow;
            transition-duration: 0.2s;
            outline-style: none;
            box-sizing: border-box;
            min-height: 0px;
            min-width: 0px;
            border: 0 solid black;
            background-color: rgba(0, 0, 0, 0);
            margin: 0px;
        }
        .screenshot-button:hover { 
            background-color: rgba(15, 20, 25, 0.1); 
        }
        .screenshot-icon { 
            margin-right: 0px; /* Keep margin 0, alignment handled by flex */
            width: 18.75px;
            height: 18.75px; 
            /* font-weight: bold; Removed as it doesn't apply well to SVG stroke */
            vertical-align: text-bottom; /* Align icon better with text */
        }
        .screenshot-notification { 
            position: fixed; 
            top: 20px; 
            left: 50%; 
            transform: translateX(-50%); 
            background-color: #1DA1F2; 
            color: white; 
            padding: 10px 20px; 
            border-radius: 20px; 
            z-index: 9999; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }
        .screenshot-notification.fade-out {
            opacity: 0;
        }
    `);

    function findTweetMainContent(menuButton) {
        const article = menuButton.closest('article[role="article"]');
        if (!article) return null;
        return article;
    }

    function takeScreenshot(menuButton) {
        const notification = document.createElement('div');
        notification.className = 'screenshot-notification';
        notification.innerHTML = 'Taking screenshot...';
        document.body.appendChild(notification);

        try {
            const tweetContainer = findTweetMainContent(menuButton);
            if (!tweetContainer) {
                throw new Error('Could not find tweet content');
            }

            // Save original styles
            const originalStyles = {
                background: tweetContainer.style.background,
                backgroundColor: tweetContainer.style.backgroundColor,
                margin: tweetContainer.style.margin,
                border: tweetContainer.style.border,
                borderRadius: tweetContainer.style.borderRadius
            };

            // Optimize clarity settings
            const scale = window.devicePixelRatio * 2;

            // --- Start Background Color Detection ---
            let bgColor = 'rgb(255, 255, 255)'; // Default to white
            try {
                const bodyStyle = window.getComputedStyle(document.body);
                bgColor = bodyStyle.backgroundColor || bgColor;
                // If body has no color (transparent), try a main container
                if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    const mainContent = document.querySelector('main') || document.querySelector('#react-root'); // Common containers
                    if (mainContent) {
                        bgColor = window.getComputedStyle(mainContent).backgroundColor || 'rgb(255, 255, 255)';
                    }
                }
                 // Final fallback if detection fails
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                   bgColor = 'rgb(255, 255, 255)';
                }
            } catch (bgError) {
                console.warn("Could not detect background color, defaulting to white.", bgError);
                bgColor = 'rgb(255, 255, 255)';
            }
            // --- End Background Color Detection ---

            const config = {
                height: tweetContainer.offsetHeight * scale,
                width: tweetContainer.offsetWidth * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${tweetContainer.offsetWidth}px`,
                    height: `${tweetContainer.offsetHeight}px`,
                    margin: 0, // Ensure no extra margin affects layout
                    border: 'none', // Remove borders for stitching
                    borderRadius: 0 // Remove border radius for stitching
                },
                quality: 1.0
            };
            // --- Add bgcolor to config ---
            config.bgcolor = bgColor;
            // --- End add bgcolor ---

            // Use dom-to-image for high-quality screenshot
            domtoimage.toBlob(tweetContainer, config)
                .then(function(blob) {
                    // Copy to clipboard
                    navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]).then(() => {
                        notification.innerHTML = `
                            <div>Screenshot copied to clipboard!</div>
                            <button class="download-btn" style="
                                background: white;
                                color: #1DA1F2;
                                border: none;
                                padding: 5px 10px;
                                border-radius: 15px;
                                margin-top: 5px;
                                cursor: pointer;
                            ">Download</button>
                        `;
                        notification.style.backgroundColor = '#17BF63';

                        // Add download button functionality
                        const downloadBtn = notification.querySelector('.download-btn');
                        downloadBtn.addEventListener('click', () => {
                            const link = document.createElement('a');
                            link.download = `twitter-post-${Date.now()}.png`;
                            link.href = URL.createObjectURL(blob);
                            link.click();
                            URL.revokeObjectURL(link.href);
                            notification.remove();
                        });

                        // 设置3秒后渐隐消失
                        setTimeout(() => {
                            notification.classList.add('fade-out');
                            setTimeout(() => notification.remove(), 500);
                        }, 1500);
                    });
                })
                .catch(function(error) {
                    console.error('Screenshot failed:', error);
                    notification.textContent = 'Screenshot failed';
                    notification.style.backgroundColor = '#E0245E';
                    setTimeout(() => notification.remove(), 2000);
                });
        } catch (error) {
            console.error('Error during screenshot:', error);
            notification.textContent = 'Screenshot failed';
            notification.style.backgroundColor = '#E0245E';
            setTimeout(() => notification.remove(), 2000);
        }
    }

    function createScreenshotIcon() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "18.75");
        svg.setAttribute("height", "18.75");
        svg.setAttribute("fill", "none"); // Use fill=none for line icons
        svg.setAttribute("stroke", "currentColor"); // Inherit color via stroke
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("screenshot-icon");

        // Feather Icons: camera
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z");
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "13");
        circle.setAttribute("r", "4");

        svg.appendChild(path);
        svg.appendChild(circle);
        return svg;
    }

    function createThreadIcon() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "18.75");
        svg.setAttribute("height", "18.75");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("screenshot-icon"); // Reuse same class for basic styling

        // Simple thread icon (line connecting dots)
        const path1 = document.createElementNS(svgNS, "path");
        path1.setAttribute("d", "M6 3v12");
        const circle1 = document.createElementNS(svgNS, "circle");
        circle1.setAttribute("cx", "6");
        circle1.setAttribute("cy", "3");
        circle1.setAttribute("r", "1");
        const circle2 = document.createElementNS(svgNS, "circle");
        circle2.setAttribute("cx", "6");
        circle2.setAttribute("cy", "9");
        circle2.setAttribute("r", "1");
         const circle3 = document.createElementNS(svgNS, "circle");
        circle3.setAttribute("cx", "6");
        circle3.setAttribute("cy", "15");
        circle3.setAttribute("r", "1");
        // Add a parallel element to suggest thread
        const path2 = document.createElementNS(svgNS, "path");
        path2.setAttribute("d", "M18 9v12");
        const circle4 = document.createElementNS(svgNS, "circle");
        circle4.setAttribute("cx", "18");
        circle4.setAttribute("cy", "9");
        circle4.setAttribute("r", "1");
        const circle5 = document.createElementNS(svgNS, "circle");
        circle5.setAttribute("cx", "18");
        circle5.setAttribute("cy", "15");
        circle5.setAttribute("r", "1");
         const circle6 = document.createElementNS(svgNS, "circle");
        circle6.setAttribute("cx", "18");
        circle6.setAttribute("cy", "21");
        circle6.setAttribute("r", "1");


        svg.appendChild(path1);
        svg.appendChild(circle1);
        svg.appendChild(circle2);
        svg.appendChild(circle3);
        svg.appendChild(path2);
        svg.appendChild(circle4);
        svg.appendChild(circle5);
        svg.appendChild(circle6);


        return svg;
    }

    async function captureThread(menuButton) {
        const notification = document.createElement('div');
        notification.className = 'screenshot-notification';
        notification.innerHTML = 'Capturing thread... Finding author and posts...';
        document.body.appendChild(notification);

        try {
            // 1. Find original tweet and author
            const originalArticle = findTweetMainContent(menuButton);
            if (!originalArticle) {
                throw new Error('Could not find the starting tweet.');
            }

            // Find author's handle (needs a robust selector, this is an example)
            // Twitter structure changes, this might need adjustment.
            const userElement = originalArticle.querySelector('[data-testid="User-Name"]'); // Try Test ID first
            let authorHandle = null;
            if (userElement) {
                 // Find the span containing the handle like '@handle'
                 const spans = userElement.querySelectorAll('span');
                 for (const span of spans) {
                     if (span.textContent.startsWith('@')) {
                         authorHandle = span.textContent;
                         break;
                     }
                 }
            }

            // Fallback if data-testid not found or handle not in spans
            if (!authorHandle) {
                const authorLink = originalArticle.querySelector('a[href*="/status/"][dir="ltr"]');
                 if (authorLink) {
                    const linkParts = authorLink.href.split('/');
                    // Usually the handle is the 3rd part like ['https:', '', 'twitter.com', 'handle', 'status', 'id']
                    if (linkParts.length > 3) {
                         authorHandle = '@' + linkParts[3];
                     }
                }
            }


            if (!authorHandle) {
                throw new Error('Could not reliably determine the author\'s handle.');
            }
            notification.innerHTML = `Capturing thread by ${authorHandle}... Expanding replies...`;
            console.log(`Author Handle: ${authorHandle}`);

            // 2. Find and click "Show more replies" repeatedly
            const conversationContainer = originalArticle.closest('div[data-testid="conversation"]'); // Find the container holding the thread
            let showMoreButton;
            const maxClicks = 15; // Limit clicks to prevent infinite loops
            let clicks = 0;
            const showMoreSelector = 'span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3'; // User provided selector

            while (clicks < maxClicks) {
                 // Find the button within the conversation context if possible
                 showMoreButton = conversationContainer
                     ? conversationContainer.querySelector(showMoreSelector)
                     : document.querySelector(showMoreSelector); // Fallback to document search

                // Check if the button text actually indicates more replies
                if (showMoreButton && showMoreButton.textContent.includes('Show') && showMoreButton.closest('div[role="button"]')) { // Check text and if it's clickable
                    console.log(`Clicking "Show more" (${clicks + 1}/${maxClicks})`);
                     notification.innerHTML = `Capturing thread by ${authorHandle}... Expanding replies (${clicks + 1})...`;
                    showMoreButton.closest('div[role="button"]').click(); // Click the clickable parent
                    clicks++;
                    // Wait for content to load - adjust delay as needed
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
                } else {
                     console.log("No more 'Show more' buttons found or button text doesn't match.");
                    break; // Exit loop if no more buttons or limit reached
                }
            }
            if (clicks === maxClicks) {
                console.warn("Reached maximum 'Show more' clicks limit.");
            }

            notification.innerHTML = `Capturing thread by ${authorHandle}... Finding all posts...`;

            // 3. Filter replies by original author
            // Select all articles *after* the initial expansion
             const allArticles = Array.from(document.querySelectorAll('article[role="article"]'));
            const authorTweets = allArticles.filter(article => {
                // Re-check author handle for each potential tweet in the thread
                const userElement = article.querySelector('[data-testid="User-Name"]');
                let currentHandle = null;
                if (userElement) {
                     const spans = userElement.querySelectorAll('span');
                     for (const span of spans) {
                         if (span.textContent.startsWith('@')) {
                             currentHandle = span.textContent;
                             break;
                         }
                     }
                }
                 // Fallback check
                 if (!currentHandle) {
                     const authorLink = article.querySelector('a[href*="/status/"][dir="ltr"]');
                     if (authorLink) {
                        const linkParts = authorLink.href.split('/');
                        if (linkParts.length > 3) {
                            currentHandle = '@' + linkParts[3];
                        }
                     }
                 }
                return currentHandle === authorHandle;
            });


            if (authorTweets.length === 0) {
                 // If filtering removed everything, at least include the original tweet
                 authorTweets.push(originalArticle);
            }
            // Ensure tweets are in order (usually they are by DOM order, but sort just in case)
            // This relies on DOM order being correct. A more robust way might involve timestamps if available.
            authorTweets.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);


            console.log(`Found ${authorTweets.length} tweets by ${authorHandle}`);
            notification.innerHTML = `Taking ${authorTweets.length} screenshots... (0%)`;

            // 4. Screenshot each tweet individually
            const blobs = [];
            const scale = window.devicePixelRatio * 1.5; // Slightly lower scale for potentially long images

            for (let i = 0; i < authorTweets.length; i++) {
                const tweet = authorTweets[i];
                 const percentage = Math.round(((i + 1) / authorTweets.length) * 100);
                 notification.innerHTML = `Taking ${authorTweets.length} screenshots... (${percentage}%)`;

                 // Ensure tweet is visible for screenshot (scrollIntoView might be needed sometimes)
                 // tweet.scrollIntoView({ block: 'nearest' });
                 // await new Promise(resolve => setTimeout(resolve, 100)); // Small delay after scroll

                try {
                    // ---> New: Check for and click internal "Show more" button within the tweet text
                    const internalShowMoreButton = tweet.querySelector('button[data-testid="tweet-text-show-more-link"]');
                    if (internalShowMoreButton) {
                        console.log(`Clicking internal "Show more" for tweet ${i + 1}`);
                        internalShowMoreButton.click();
                        // Wait a short moment for the text to expand
                        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
                    }
                    // <--- End new section

                     // --- Start Background Color Detection (for thread) ---
                     let threadBgColor = 'rgb(255, 255, 255)'; // Default to white
                     try {
                         const bodyStyle = window.getComputedStyle(document.body);
                         threadBgColor = bodyStyle.backgroundColor || threadBgColor;
                         if (!threadBgColor || threadBgColor === 'rgba(0, 0, 0, 0)' || threadBgColor === 'transparent') {
                             const mainContent = document.querySelector('main') || document.querySelector('#react-root');
                             if (mainContent) {
                                 threadBgColor = window.getComputedStyle(mainContent).backgroundColor || 'rgb(255, 255, 255)';
                             }
                         }
                         if (threadBgColor === 'rgba(0, 0, 0, 0)' || threadBgColor === 'transparent') {
                            threadBgColor = 'rgb(255, 255, 255)';
                         }
                     } catch (bgError) {
                         console.warn("Could not detect background color for thread tweet, defaulting to white.", bgError);
                         threadBgColor = 'rgb(255, 255, 255)';
                     }
                    // --- End Background Color Detection ---

                     const config = {
                         height: tweet.offsetHeight * scale,
                         width: tweet.offsetWidth * scale,
                         style: {
                             transform: `scale(${scale})`,
                             transformOrigin: 'top left',
                             width: `${tweet.offsetWidth}px`,
                             height: `${tweet.offsetHeight}px`,
                             margin: 0, // Ensure no extra margin affects layout
                             border: 'none', // Remove borders for stitching
                             borderRadius: 0 // Remove border radius for stitching
                         },
                         quality: 0.95 // Slightly lower quality for performance/size
                     };
                    // --- Add bgcolor to config (for thread) ---
                    config.bgcolor = threadBgColor;
                    // --- End add bgcolor ---

                    const blob = await domtoimage.toBlob(tweet, config);
                    blobs.push(blob);
                } catch (screenshotError) {
                    console.error(`Failed to screenshot tweet ${i + 1}:`, screenshotError);
                     // Optionally skip this tweet or stop the process
                     notification.innerHTML = `Error screenshotting tweet ${i + 1}. Skipping.`;
                     await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            if (blobs.length === 0) {
                throw new Error("No screenshots were successfully taken.");
            }

            notification.innerHTML = `Combining ${blobs.length} screenshots...`;

            // 5. Combine images using Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let totalHeight = 0;
            let maxWidth = 0;
            const images = [];

            // Convert blobs to Image objects to get dimensions
            for (const blob of blobs) {
                const img = new Image();
                 const url = URL.createObjectURL(blob);
                img.src = url;
                await new Promise(resolve => { img.onload = resolve; }); // Wait for image data to load
                images.push(img);
                totalHeight += img.height;
                maxWidth = Math.max(maxWidth, img.width);
                // URL.revokeObjectURL(url); // Revoke later after drawing
            }

            // Set canvas dimensions
            canvas.width = maxWidth;
            canvas.height = totalHeight;

            // Draw images onto canvas
            let currentY = 0;
            for (const img of images) {
                ctx.drawImage(img, 0, currentY);
                currentY += img.height;
                 URL.revokeObjectURL(img.src); // Revoke URL now
            }

            // 6. Get final blob from canvas
            canvas.toBlob(function(finalBlob) {
                // 7. Handle final blob (copy/download/notification)
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': finalBlob })
                ]).then(() => {
                    notification.innerHTML = `
                        <div>Thread screenshot copied! (${images.length} posts)</div>
                        <button class="download-btn" style="background: white; color: #1DA1F2; border: none; padding: 5px 10px; border-radius: 15px; margin-top: 5px; cursor: pointer;">Download</button>
                    `;
                    notification.style.backgroundColor = '#17BF63';

                    const downloadBtn = notification.querySelector('.download-btn');
                    downloadBtn.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.download = `twitter-thread-${authorHandle.substring(1)}-${Date.now()}.png`;
                        link.href = URL.createObjectURL(finalBlob);
                        link.click();
                        URL.revokeObjectURL(link.href);
                        // Keep notification open after download click for a bit
                         setTimeout(() => {
                             notification.classList.add('fade-out');
                             setTimeout(() => notification.remove(), 500);
                         }, 1500);
                    });

                    // Auto fade out after longer time for thread capture
                    setTimeout(() => {
                         if (!notification.classList.contains('fade-out')) { // Avoid double fade if download clicked
                            notification.classList.add('fade-out');
                            setTimeout(() => notification.remove(), 500);
                         }
                    }, 4000); // Keep notification longer
                }).catch(err => {
                     console.error('Failed to copy final image:', err);
                     notification.textContent = 'Failed to copy thread screenshot.';
                     notification.style.backgroundColor = '#E0245E';
                     setTimeout(() => notification.remove(), 3000);
                });

            }, 'image/png', 0.9); // Specify type and quality

        } catch (error) {
            console.error('Capture Thread failed:', error);
            notification.textContent = `Capture Thread failed: ${error.message}`;
            notification.style.backgroundColor = '#E0245E';
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }
    }

    function addScreenshotButtonToMenu(menuButton) {
        const menu = document.querySelector('[role="menu"]');
        // Check if buttons already exist
        if (!menu || menu.querySelector('.screenshot-button') || menu.querySelector('.capture-thread-button')) return;

        // --- Screenshot Button ---
        const screenshotButton = document.createElement('div');
        screenshotButton.className = 'screenshot-button'; // Keep original class for styling
        screenshotButton.setAttribute('role', 'menuitem');
        screenshotButton.setAttribute('tabindex', '0');

        screenshotButton.appendChild(createScreenshotIcon());

        const textScreenshot = document.createElement('span');
        textScreenshot.textContent = 'Screenshot';
        textScreenshot.style.marginLeft = '12px';
        textScreenshot.style.fontSize = '15px';
        textScreenshot.style.fontWeight = 'bold';
        screenshotButton.appendChild(textScreenshot);

        screenshotButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent menu closing immediately if something goes wrong
            takeScreenshot(menuButton);
            // Attempt to close the menu after action
             setTimeout(() => {
                const closeButton = document.querySelector('[data-testid="Dropdown"] [aria-label="Close"]'); // More specific selector
                 if (closeButton) closeButton.click();
                 // Fallback for menu itself if close button not found reliably
                 else if (menu && menu.style.display !== 'none') {
                     // Heuristic: Clicking away might close it, or find a parent dismiss layer
                     // This part is tricky due to varying menu implementations
                 }
             }, 100); // Small delay
        });

        menu.insertBefore(screenshotButton, menu.firstChild); // Insert at the top


        // --- Capture Thread Button ---
        const captureThreadButton = document.createElement('div');
        // Use screenshot-button class for base styles, add specific class if needed
        captureThreadButton.className = 'screenshot-button capture-thread-button';
        captureThreadButton.setAttribute('role', 'menuitem');
        captureThreadButton.setAttribute('tabindex', '0');

        captureThreadButton.appendChild(createThreadIcon());

        const textThread = document.createElement('span');
        textThread.textContent = 'Capture Thread';
        textThread.style.marginLeft = '12px';
        textThread.style.fontSize = '15px';
        textThread.style.fontWeight = 'bold';
        captureThreadButton.appendChild(textThread);

        captureThreadButton.addEventListener('click', (event) => {
            event.stopPropagation();
            captureThread(menuButton);
             // Attempt to close the menu after action
             setTimeout(() => {
                const closeButton = document.querySelector('[data-testid="Dropdown"] [aria-label="Close"]');
                 if (closeButton) closeButton.click();
                 else if (menu && menu.style.display !== 'none') {
                    // Fallback...
                 }
            }, 100);
        });

        // Insert Capture Thread button below the Screenshot button
        if (screenshotButton.nextSibling) {
            menu.insertBefore(captureThreadButton, screenshotButton.nextSibling);
        } else {
            menu.appendChild(captureThreadButton);
        }
    }

    function addScreenshotButtons() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        // Check if the added node itself is a menu or contains one
                        if (node.nodeType === 1) { // Check if it's an element node
                            const menu = node.matches('[role="menu"]') ? node : node.querySelector('[role="menu"]');
                            if (menu) {
                                // Find the button that triggered this menu
                                const menuButton = document.querySelector('[aria-haspopup="menu"][aria-expanded="true"]');
                                // IMPORTANT CHECK: Ensure the menu was triggered by the "More" button (three dots)
                                // within an article, typically identified by data-testid="caret".
                                if (menuButton && menuButton.closest('article[role="article"]') && menuButton.getAttribute('data-testid') === 'caret') {
                                    console.log("Detected 'More' menu, adding buttons.");
                                    addScreenshotButtonToMenu(menuButton);
                                } else {
                                     // Optional: Log why buttons weren't added
                                     // console.log("Detected menu, but not triggered by the target 'More' button or not within an article.");
                                }
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addScreenshotButtons();
})();