// ==UserScript==
// @name          粉笔网 - 增强版视频隐藏+答案一键展开
// @license       MIT
// @namespace     http://tampermonkey.net/
// @version       2.7 // Version increased for two independent buttons
// @description   默认隐藏视频模块。提供独立按钮控制视频模块的显示/隐藏，以及答案的展开/收拢。
// @author        哈吉米
// @match         *.fenbi.com/*
// @grant         GM_addStyle
// @icon          https://nodestatic.fbstatic.cn/weblts_spa_online/page/assets/fenbi32.ico
// @downloadURL https://update.greasyfork.org/scripts/540298/%E7%B2%89%E7%AC%94%E7%BD%91%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88%E8%A7%86%E9%A2%91%E9%9A%90%E8%97%8F%2B%E7%AD%94%E6%A1%88%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/540298/%E7%B2%89%E7%AC%94%E7%BD%91%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88%E8%A7%86%E9%A2%91%E9%9A%90%E8%97%8F%2B%E7%AD%94%E6%A1%88%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Video Display Control ---
    const VIDEO_STYLE_ID = 'fenbi-video-display-style';
    let isVideoHidden = true; // Default state: videos are hidden

    function applyVideoHideStyles() {
        let styleTag = document.getElementById(VIDEO_STYLE_ID);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = VIDEO_STYLE_ID;
            styleTag.type = 'text/css';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = `
            /* --- Hide "analysis video" section by ID prefix --- */
            section[id^="section-video"] {
                display: none !important;
            }

            /* --- Hide video items in the analysis list --- */
            .solu-list-item.video-item,

            /* Hide "expand to watch video analysis" button */
            .bg-color-gray-light2.border-gray-light3.font-color-gray-mid.expend-btn,

            /* Hide other potential video-related promotional elements */
            fb-ng-solution-detail-item[videotip],
            .video-analysis-wrapper,
            app-solution-video {
                display: none !important;
            }
        `;
        isVideoHidden = true;
    }

    function removeVideoHideStyles() {
        const styleTag = document.getElementById(VIDEO_STYLE_ID);
        if (styleTag) {
            styleTag.remove();
        }
        isVideoHidden = false;
    }

    // Apply video hiding styles immediately on load as default
    applyVideoHideStyles();

    // --- DIV Toggle (Expand/Collapse) Control ---
    // This state variable now indicates if the DIVs are *currently expanded* by our script
    // So, if true, the next click should *collapse* them ("隐藏答案").
    // If false, the next click should *expand* them ("显示答案").
    let areDivsExpanded = false; // Initial state: Assume DIVs are collapsed or need expanding

    let divClickObserver = null; // Mutation Observer instance

    function toggleDivsClick(expandDivs) { // Renamed parameter to be clearer
        // Disconnect any active observer to prevent re-triggering during our clicks
        if (divClickObserver) {
            divClickObserver.disconnect();
            divClickObserver = null; // Reset observer reference
        }

        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const processButtons = (buttons) => {
            buttons.forEach(button => {
                const isActive = button.classList.contains('toggle-btn-active'); // 'toggle-btn-active' typically means expanded

                if (expandDivs) { // If we want to *expand* them (button text: "显示答案")
                    if (!isActive) { // If it's currently NOT active (collapsed), click to expand
                        console.log('Clicking to expand DIV:', button);
                        button.click();
                    }
                } else { // If we want to *collapse* them (button text: "隐藏答案")
                    if (isActive) { // If it's currently active (expanded), click to collapse
                        console.log('Clicking to collapse DIV:', button);
                        button.click();
                    }
                }
            });
        };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches('div.toggle-btn:has(svg)')) {
                            processButtons([node]);
                        } else if (node.nodeType === 1) {
                             const nestedButtons = node.querySelectorAll('div.toggle-btn:has(svg)');
                             if (nestedButtons.length > 0) {
                                 processButtons(Array.from(nestedButtons));
                             }
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'class' &&
                           mutation.target.matches('div.toggle-btn:has(svg)')) {
                    processButtons([mutation.target]);
                }
            }
        };

        // Initialize and start the observer
        divClickObserver = new MutationObserver(callback);
        divClickObserver.observe(targetNode, config);

        // Process any buttons already present on the page immediately
        const initialButtons = document.querySelectorAll('div.toggle-btn:has(svg)');
        if (initialButtons.length > 0) {
            console.log('Processing initial toggle DIVs:', initialButtons);
            processButtons(Array.from(initialButtons));
        }
    }

    // --- Create and append the trigger buttons ---
    function createButtons() {
        // 1. Create DIV Toggle Button (for "答案" / Answer)
        const divToggleButton = document.createElement('button');
        divToggleButton.id = 'fenbi-div-toggle-btn';
        // Initial text: Since `areDivsExpanded` is false, the first click will *expand* them.
        divToggleButton.textContent = '显示答案'; // Button will show answers on click
        divToggleButton.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            z-index: 9999;
            padding: 8px 15px;
            background-color: #007bff; /* Blue - for "show answer" */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        `;

        divToggleButton.onmouseover = () => { divToggleButton.style.opacity = '1'; };
        divToggleButton.onmouseout = () => { divToggleButton.style.opacity = '0.8'; };

        divToggleButton.onclick = () => {
            if (!areDivsExpanded) { // If divs are currently collapsed (or default), click to EXPAND them
                toggleDivsClick(true); // Argument `true` means we want to expand them
                divToggleButton.textContent = '隐藏答案'; // Next click will hide them
                divToggleButton.style.backgroundColor = '#dc3545'; // Red for "hide answer"
                areDivsExpanded = true;
            } else { // If divs are currently expanded, click to COLLAPSE them
                toggleDivsClick(false); // Argument `false` means we want to collapse them
                divToggleButton.textContent = '显示答案'; // Next click will show them
                divToggleButton.style.backgroundColor = '#007bff'; // Blue for "show answer"
                areDivsExpanded = false;
            }
        };
        document.body.appendChild(divToggleButton);

        // 2. Create Video Display Toggle Button
        const videoToggleButton = document.createElement('button');
        videoToggleButton.id = 'fenbi-video-toggle-btn';
        videoToggleButton.textContent = '显示视频'; // Initial text, since videos are hidden by default
        videoToggleButton.style.cssText = `
            position: fixed;
            top: 110px; /* Position below the first button */
            right: 10px;
            z-index: 9999;
            padding: 8px 15px;
            background-color: #28a745; /* Green for "show" */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        `;

        videoToggleButton.onmouseover = () => { videoToggleButton.style.opacity = '1'; };
        videoToggleButton.onmouseout = () => { videoToggleButton.style.opacity = '0.8'; };

        videoToggleButton.onclick = () => {
            if (isVideoHidden) {
                removeVideoHideStyles(); // Show videos
                videoToggleButton.textContent = '隐藏视频';
                videoToggleButton.style.backgroundColor = '#6c757d'; // Gray for "hide"
            } else {
                applyVideoHideStyles(); // Hide videos
                videoToggleButton.textContent = '显示视频';
                videoToggleButton.style.backgroundColor = '#28a745'; // Green for "show"
            }
        };
        document.body.appendChild(videoToggleButton);
    }

    // Ensure buttons are created once the page content is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButtons);
    } else {
        createButtons();
    }

})();