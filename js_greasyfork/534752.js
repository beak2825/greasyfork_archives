// ==UserScript==
// @name         Twitter Summary
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  仅适用于 Twitter/X 官网。提供页面总结功能，使用左下角蓝色✦按钮作为触发器，将总结结果嵌入主推文下方。每次点击都会请求新总结，支持多级API fallback。切换推文时移除旧结果框。移除了顶部触发条、弹窗和TTS功能。
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      free.v36.cm
// @connect      api.sambanova.ai
// @connect      api.chatanywhere.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534752/Twitter%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/534752/Twitter%20Summary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---

    // Summary API Configuration (Primary)
    const summarySambaNovaApiUrl = 'https://api.sambanova.ai/v1/chat/completions';
    const summarySambaNovaApiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6'; // <<< WARNING: Hardcoded API Key
    const summarySambaNovaModel = 'Meta-Llama-3.1-405B-Instruct';
    const summarySambaNovaSourceName = 'SambaNova (Llama-3.1)'; // Source name for display

    // Summary Fallback API 1 Configuration
    const summaryFallbackApiUrl1 = 'https://free.v36.cm/v1/chat/completions';
    const summaryFallbackApiKey1 = 'sk-7NEyEPLHDfmprWdPEb3036Ec568b40Ab9b444eD37fAeE436'; // <<< WARNING: Hardcoded API Key
    const summaryFallbackModel1 = 'gpt-3.5-turbo';
    const summaryFallbackSourceName1 = '备用AI一 (GPT-3.5-turbo)'; // Source name for display

    // Summary Fallback API 2 Configuration (Added)
    const summaryFallbackApiUrl2 = 'https://api.chatanywhere.org/v1/chat/completions'; // Corrected URL based on common API endpoints
    const summaryFallbackApiKey2 = 'sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh'; // <<< WARNING: Hardcoded API Key
    const summaryFallbackModel2 = 'gpt-3.5-turbo'; // Assuming model based on key usage
    const summaryFallbackSourceName2 = '备用AI二 (GPT-3.5-turbo)'; // Source name for display


    // --- Global State Variables ---

    let lastSummaryClickTime = 0; // Cooldown remains
    const summaryCooldownTime = 10000; // 10 seconds cooldown remains

    // State for detecting tweet changes in SPA (Needed for UI cleanup)
    let lastTweetId = null;


    // --- CSS Styles ---
    GM_addStyle(`
        /* --- Floating Action Button Style --- */
        #summarizeFloatingButton {
            position: fixed;
            bottom: 170px; /* Positioned from bottom (70 + 100) */
            left: 11px; /* Positioned from left (14 - 3) */
            width: 44px;
            height: 44px;
            background: transparent; /* No background */
            color: #1d9bf0; /* Blue color */
            border: none;
            border-radius: 50%;
            font-size: 28px;
            font-weight: bold;
            box-shadow: none; /* No shadow */
            opacity: 0.85;
            z-index: 9999;
            cursor: pointer;
            transition: opacity 0.2s ease-in-out; /* Smooth transition for opacity */
        }
        #summarizeFloatingButton:hover {
            opacity: 1;
        }
         #summarizeFloatingButton:disabled {
             opacity: 0.5; /* Reduce opacity more when disabled */
             cursor: not-allowed;
         }


        /* --- HUD (Heads-Up Display) Style --- */
         .gm-summary-hud { /* Use a specific class to avoid conflicts */
             position: fixed;
             bottom: 20px;
             left: 50%;
             transform: translateX(-50%);
             background: rgba(0,0,0,0.75);
             color: #fff;
             padding: 6px 12px;
             font-size: 14px;
             border-radius: 8px;
             z-index: 10000; /* Ensure HUD is above button */
             pointer-events: none; /* Allow clicks to pass through HUD */
             opacity: 1;
             transition: opacity 0.3s ease-in-out;
         }
          .gm-summary-hud.hidden {
              opacity: 0;
          }

        /* --- Embedded Summary Result Box Style --- */
        .gm-summary-result-box { /* Use a specific class */
            margin-top: 15px; /* Space above the box */
            margin-bottom: 15px; /* Space below the box */
            font-size: 0.9em;
            background: #f0f8f0; /* Light green background, similar to old popup */
            border-left: 4px solid #4CAF50; /* Green border */
            padding: 12px 15px;
            color: #222;
            white-space: pre-wrap; /* Maintain line breaks from summary */
            border-radius: 6px;
            max-width: 800px; /* Limit width for readability */
            margin-left: auto; /* Center the block */
            margin-right: auto; /* Center the block */
            overflow-x: auto; /* Add scroll if summary is too wide */
            word-break: break-word; /* Prevent long words from overflowing */
        }

         .gm-summary-result-box p { /* Style paragraphs inside the box */
            margin-top: 0.5em;
            margin-bottom: 0.5em;
         }

         .gm-summary-result-box strong { /* Style source text */
             display: block; /* Make source appear on a new line */
             margin-top: 10px;
             font-size: 0.9em;
             color: #555;
             text-align: right;
             border-top: 1px solid #d3e4d3;
             padding-top: 5px;
         }

         /* Hide the old button ID just in case */
         #summarizeButton { display: none !important; }
         /* Hide old overlay/container IDs just in case */
         .unified-overlay, #summary-container { display: none !important; }

    `);

     // --- Helper Functions ---

     // Creates and displays a simple HUD message
    function createHUD(msg) {
        let box = document.querySelector('.gm-summary-hud');
         if (!box) {
             box = document.createElement("div");
             box.className = 'gm-summary-hud';
             document.body.appendChild(box);
         }
         box.textContent = msg;
         box.classList.remove('hidden'); // Ensure it's visible
         // Auto-hide after 4 seconds
         setTimeout(() => {
             // Check if the message is still the same before hiding
             // This helps prevent a new message from being hidden prematurely
             if (box.textContent === msg) {
                box.classList.add('hidden');
             }
         }, 4000);
    }


    // Inserts the summary result box into the page
     function insertResultBox(summary, source) {
        // Remove any existing result box first
        const existingResultBox = document.querySelector('.gm-summary-result-box');
        if (existingResultBox) {
            existingResultBox.remove();
        }

        const resultBox = document.createElement("div");
        resultBox.className = 'gm-summary-result-box';

         // Use innerHTML to include the source text formatting
        resultBox.innerHTML = `${summary.replace(/\n/g, '<br>')}<br><strong>来源: ${source}</strong>`; // Basic line breaks and source formatting

        let targetElement = null;

         // --- Site-Specific Insertion Logic (for Twitter/X) ---
         // Find the main tweet text element
         const mainTweetTextElement = document.querySelector('article div[data-testid="tweetText"]');
         if (mainTweetTextElement) {
              // Find the parent element to insert the result box after
              targetElement = mainTweetTextElement.parentElement;
         }

        // --- General Insertion Logic (fallback if Twitter target not found) ---
        // This part will only be used on Twitter/X if the specific tweet text element wasn't found
         if (!targetElement) {
             // Attempt to find a suitable insertion point (e.g., below main article)
             const mainContent = document.querySelector('article, main, body > div:last-child'); // Prioritize article on Twitter
             targetElement = mainContent || document.body; // Fallback to body
         }

        // --- Perform the insertion ---
         // If we found the specific tweet text parent, insert AFTER it
         // Otherwise, append to the target element (article, main, or body)
         if (targetElement && targetElement !== document.body) { // Ensure a specific element was found
             targetElement.parentNode.insertBefore(resultBox, targetElement.nextSibling);
             console.log("Summary inserted below main tweet.");
         } else {
              // Append to the target element (main article, general container, or body)
              targetElement.appendChild(resultBox);
              console.log("Summary appended to general target or body.");
               // Add extra styling for when it's appended to body for better appearance
               if (targetElement === document.body) {
                    resultBox.style.cssText += 'margin: 20px auto; padding: 15px; max-width: 800px;';
               }
         }

         // Scroll the result into view if it's appended far down
         // Use a slight delay to allow DOM to settle
         setTimeout(() => {
             resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         }, 100); // Small delay
     }


    // Function to handle API requests with fallback logic
    function fetchSummary(content, onSuccess, onError) {
        // Try Primary API (SambaNova)
        requestSummary(summarySambaNovaApiUrl, summarySambaNovaApiKey, summarySambaNovaModel, content,
            // Primary Success
            onSuccess,
            // Primary Error - Try Fallback 1
            (errorMsgPrimary) => {
                 console.warn(errorMsgPrimary, `尝试使用 ${summaryFallbackSourceName1} 进行总结...`);
                 createHUD(`${summarySambaNovaSourceName}失败，尝试${summaryFallbackSourceName1}...`); // Update HUD

                // Try Fallback API 1
                requestSummary(summaryFallbackApiUrl1, summaryFallbackApiKey1, summaryFallbackModel1, content,
                    // Fallback 1 Success
                    onSuccess,
                    // Fallback 1 Error - Try Fallback 2
                    (errorMsgFallback1) => {
                         console.warn(errorMsgFallback1, `尝试使用 ${summaryFallbackSourceName2} 进行总结...`);
                         createHUD(`${summaryFallbackSourceName1}失败，尝试${summaryFallbackSourceName2}...`); // Update HUD

                        // Try Fallback API 2 (Added)
                        requestSummary(summaryFallbackApiUrl2, summaryFallbackApiKey2, summaryFallbackModel2, content,
                            // Fallback 2 Success
                            onSuccess,
                            // Fallback 2 Error - All APIs failed
                            (errorMsgFallback2) => {
                                 console.error(errorMsgFallback2, '所有总结 API 都失败了');
                                const finalErrorMsg = `总结失败。\n${summarySambaNovaSourceName}: ${errorMsgPrimary}\n${summaryFallbackSourceName1}: ${errorMsgFallback1}\n${summaryFallbackSourceName2}: ${errorMsgFallback2}`;
                                 onError(finalErrorMsg); // Report final error after all attempts
                            },
                             summaryFallbackSourceName2 // Source name for Fallback 2
                        );
                    },
                     summaryFallbackSourceName1 // Source name for Fallback 1
                );
            },
            summarySambaNovaSourceName // Source name for Primary
        );
    }


    // Generic function to make a single API request
    function requestSummary(url, apiKey, model, content, onSuccess, onError, sourceName) {
         console.log(`尝试使用 ${sourceName} API (${url}) 进行总结...`);
         GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: model,
                messages: [
                    // Use the simple system prompt
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    try {
                         const result = JSON.parse(response.responseText);
                         if (result && result.choices && result.choices[0] && result.choices[0].message) {
                             console.log(`${sourceName} API 总结请求成功`);
                             const summary = result.choices[0].message.content.trim();
                             onSuccess(summary, sourceName); // Pass summary and source to success handler
                        } else {
                            console.error(`${sourceName} API 总结响应格式错误:`, response.responseText);
                             onError(`从 ${sourceName} API 获取总结失败，响应格式错误。`);
                        }
                    } catch(e) {
                         console.error(`${sourceName} API 总结响应解析失败:`, e);
                         onError(`从 ${sourceName} API 获取总结失败，响应解析错误。`);
                    }
                } else {
                    console.error(`${sourceName} API 总结请求失败，状态码: ${response.status}`, response.responseText);
                    onError(`从 ${sourceName} API 获取总结失败，状态码: ${response.status} - ${response.responseText.substring(0, 200)}...`); // Include part of response text
                }
            },
            onerror: (error) => {
                 console.error(`${sourceName} API 总结网络错误:`, error);
                 onError(`${sourceName} API 总结网络错误，请检查网络连接或API状态。`);
            }
        });
    }

    // --- SPA Navigation / UI Cleanup ---

    // Observe changes in the main content area to detect tweet changes and clean up old results
    function observeTweetChanges() {
        // Find a persistent container element that holds the main tweet
        const container = document.querySelector('main[role="main"], div[data-testid="primaryColumn"]');
        if (!container) {
             console.warn("MutationObserver container not found. Automatic result cleanup on navigation may not work.");
             // Retry finding the container after a short delay if not found initially
             setTimeout(observeTweetChanges, 2000);
             return;
        }
         console.log("MutationObserver container found:", container);


        const observer = new MutationObserver(() => {
            // Find the currently visible main tweet article element
            const currentTweetArticle = document.querySelector('article[data-tweet-id]');
            const currentTweetId = currentTweetArticle ? currentTweetArticle.dataset.tweetId : null;

            // Check if the tweet ID has changed or if the tweet element is no longer present
            if (currentTweetId !== lastTweetId) {
                 console.log(`Tweet change detected from ${lastTweetId} to ${currentTweetId}. Cleaning up old summary box.`);

                // *** Primary role now: Remove any previously inserted summary boxes ***
                const existingResultBoxes = document.querySelectorAll('.gm-summary-result-box');
                existingResultBoxes.forEach(box => box.remove());

                // Update the last known tweet ID
                lastTweetId = currentTweetId;

                 // Optional: Clear HUD if it's displaying a previous state (e.g. "总结完成")
                 const hud = document.querySelector('.gm-summary-hud');
                 if(hud && !hud.classList.contains('hidden') && !hud.textContent.includes('总结中')) {
                     hud.classList.add('hidden');
                 }
            }
        });

        // Start observing the container for changes in its children and subtree
        observer.observe(container, { childList: true, subtree: true });
         console.log("Started MutationObserver on main content container for UI cleanup.");

        // Initial check when the observer is set up
         const initialTweetArticle = document.querySelector('article[data-tweet-id]');
         lastTweetId = initialTweetArticle ? initialTweetArticle.dataset.tweetId : null;
         console.log("Initial tweet ID on load:", lastTweetId);
    }


    // --- Trigger Creation ---

    // Create and append the floating button
    function createFloatingButton() {
        const btn = document.createElement("button");
        btn.id = 'summarizeFloatingButton'; // Use a distinct ID
        btn.innerHTML = "✦";
        btn.title = "总结当前页面内容"; // Appropriate title

        document.body.appendChild(btn);

        // Add click listener for summarization
        btn.addEventListener('click', () => {
            // Check if the button is disabled (e.g., during a request)
            if (btn.disabled) {
                 console.log('总结按钮当前处于禁用状态 (可能是总结中或冷却中)');
                 return;
            }

            // Respect cooldown to prevent rapid clicks on the same page
            const now = Date.now();
            if (now - lastSummaryClickTime < summaryCooldownTime) {
              console.log('总结冷却中，请等待10秒');
                const remaining = Math.ceil((summaryCooldownTime - (now - lastSummaryClickTime)) / 1000);
                 createHUD(`总结冷却中，请等待 ${remaining} 秒`); // Show cooldown message in HUD
                return; // If within cooldown, do not proceed with new request
            }

            lastSummaryClickTime = now; // Reset cooldown timer after check

            const content = document.body.innerText;

             // Add a minimum length check for the page content
             if (!content || content.trim().length < 200) { // Require at least 200 characters
                  createHUD("网页内容过少，无法总结。");
                  console.log("Page content too short to summarize.");
                  return; // Stop if content is too short
             }


            btn.disabled = true; // Disable the button during loading
            createHUD('正在抓取页面全文并进行总结，请稍候...'); // Show loading state in HUD

            // Start the API request sequence with fallback
            fetchSummary(content,
                // Overall Success
                (summary, source) => {
                    insertResultBox(summary, source); // Insert result into the page
                    createHUD("总结完成"); // Show success in HUD
                    btn.disabled = false; // Enable the button
                },
                // Overall Error
                (finalErrorMsg) => {
                    insertResultBox(finalErrorMsg, '无 (API错误)'); // Insert error message
                    createHUD("总结失败"); // Show failure in HUD
                    btn.disabled = false; // Enable the button
                }
            );
        });
    }


    // --- Initialization ---

    // Create the floating button when the document is ready
    createFloatingButton();

    // Start observing for tweet changes to clear old results
    // Add a slight delay to ensure the main container is available
     setTimeout(observeTweetChanges, 500); // Check for container after 500ms

})();
