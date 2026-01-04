// ==UserScript==
// @name         Twitter Search Tweet Conversation
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Extract tweet ID from clipboard or current page and uses search algorithm to sort tweets (both quotes and replies)
// @author       colleidoscope
// @match        https://x.com/*
// @match        https://www.x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525362/Twitter%20Search%20Tweet%20Conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/525362/Twitter%20Search%20Tweet%20Conversation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let uiContainer = null;
    let debounceTimeout = null;

    function extractTweetID(url) {
        const regex = /^https?:\/\/x\.com\/[^\/]+\/status\/(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function buildSearchQuery(tweetID, option) {
        let query = `filter:has_engagement (-filter:safe OR filter:safe)`;

        switch (option) {
            case 'min_faves_50':
                query = `min_faves:50 ${query} (quoted_tweet_id:${tweetID} OR conversation_id:${tweetID})`;
                break;
            case 'min_faves_5':
                query = `min_faves:5 ${query} (quoted_tweet_id:${tweetID} OR conversation_id:${tweetID})`;
                break;
            case 'no_min_faves':
                query = `${query} (quoted_tweet_id:${tweetID} OR conversation_id:${tweetID})`;
                break;
            case 'no_min_faves_no_conversation':
                query = `${query} quoted_tweet_id:${tweetID}`;
                break;
        }

        return query;
    }

    async function handleSearch(option, source) {
        try {
            let url;
            if (source === 'clipboard') {
                const text = await navigator.clipboard.readText();
                url = text.trim();
            } else if (source === 'current') {
                url = window.location.href;
            }

            const tweetID = extractTweetID(url);

            if (tweetID) {
                const query = buildSearchQuery(tweetID, option);
                const encodedQuery = encodeURIComponent(query);
                const searchURL = `https://x.com/search?q=${encodedQuery}`;
                window.open(searchURL, '_blank');
            } else {
                alert("The selected source does not contain a valid X post URL.");
            }
        } catch (err) {
            console.error('Error accessing source:', err);
            alert("Failed to read from the selected source. Please ensure permissions are granted.");
        }
    }

    function removeUI() {
        if (uiContainer && document.body.contains(uiContainer)) {
            document.body.removeChild(uiContainer);
            uiContainer = null;
        }
    }

    function addUI() {
        if (uiContainer) return; // Don't add if already exists

        // Create the container
        uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.bottom = '60px';
        uiContainer.style.right = '80px'
        uiContainer.style.zIndex = '1000';
        uiContainer.style.display = 'flex';
        uiContainer.style.alignItems = 'center';
        uiContainer.style.backgroundColor = '#2f3336';
        uiContainer.style.padding = '10px 15px';
        uiContainer.style.borderRadius = '30px';
        uiContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        uiContainer.style.transition = 'all 0.3s ease-in-out';

        // Create the dropdown for search options
        const dropdown = document.createElement('select');
        dropdown.style.marginRight = '15px';
        dropdown.style.padding = '8px 12px';
        dropdown.style.borderRadius = '20px';
        dropdown.style.border = 'none';
        dropdown.style.backgroundColor = '#1c1c1e';
        dropdown.style.color = '#fff';
        dropdown.style.fontSize = '14px';
        dropdown.style.fontWeight = '500';
        dropdown.style.cursor = 'pointer';
        dropdown.style.outline = 'none';

        // Add options to the dropdown
        const options = [
            { value: 'min_faves_50', text: 'Min Faves: 50' },
            { value: 'min_faves_5', text: 'Min Faves: 5' },
            { value: 'no_min_faves', text: 'No Min Faves' },
            { value: 'no_min_faves_no_conversation', text: 'Just Quotes' }
        ];

        options.forEach(opt => {
            const optionElement = document.createElement('option');
            optionElement.value = opt.value;
            optionElement.innerText = opt.text;
            dropdown.appendChild(optionElement);
        });

        // Create the toggle switch for source selection
        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.marginRight = '15px';

        const toggleLabel = document.createElement('span');
        toggleLabel.innerText = 'Clipboard:';
        toggleLabel.style.color = '#fff';
        toggleLabel.style.marginRight = '8px';
        toggleLabel.style.fontSize = '14px';
        toggleLabel.style.fontWeight = '500';

        const toggleSwitch = document.createElement('label');
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.display = 'inline-block';
        toggleSwitch.style.width = '50px';
        toggleSwitch.style.height = '24px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.opacity = '0';
        checkbox.style.width = '0';
        checkbox.style.height = '0';

        const slider = document.createElement('span');
        slider.style.position = 'absolute';
        slider.style.cursor = 'pointer';
        slider.style.top = '0';
        slider.style.left = '0';
        slider.style.right = '0';
        slider.style.bottom = '0';
        slider.style.backgroundColor = '#ccc';
        slider.style.transition = '.4s';
        slider.style.borderRadius = '24px';

        // Create the slider's circle
        const sliderBefore = document.createElement('span');
        sliderBefore.style.position = 'absolute';
        sliderBefore.style.height = '18px';
        sliderBefore.style.width = '18px';
        sliderBefore.style.left = '3px';
        sliderBefore.style.bottom = '3px';
        sliderBefore.style.backgroundColor = 'white';
        sliderBefore.style.transition = '.4s';
        sliderBefore.style.borderRadius = '50%';

        slider.appendChild(sliderBefore);
        toggleSwitch.appendChild(checkbox);
        toggleSwitch.appendChild(slider);

        // Initialize toggle state from localStorage
        const savedSource = localStorage.getItem('searchSource') || 'clipboard';
        if (savedSource === 'clipboard') {
            checkbox.checked = true;
        }

        // Update slider color based on state
        function updateSlider() {
            if (checkbox.checked) {
                slider.style.backgroundColor = '#4caf50';
                sliderBefore.style.transform = 'translateX(26px)';
            } else {
                slider.style.backgroundColor = '#ccc';
                sliderBefore.style.transform = 'translateX(0)';
            }
        }

        updateSlider();

        // Add event listener to toggle switch
        checkbox.addEventListener('change', () => {
            const source = checkbox.checked ? 'clipboard' : 'current';
            localStorage.setItem('searchSource', source);
            updateSlider();
        });

        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleSwitch);

        // Create the search button
        const button = document.createElement('button');
        button.innerHTML = '🔍';
        button.style.padding = '8px 16px';
        button.style.border = 'none';
        button.style.borderRadius = '20px';
        button.style.backgroundColor = '#1da1f2';
        button.style.color = '#fff';
        button.style.fontSize = '14px';
        button.style.fontWeight = '600';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        button.onmouseover = () => {
            button.style.backgroundColor = '#0d8ddb';
            button.style.transform = 'scale(1.05)';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#1da1f2';
            button.style.transform = 'scale(1)';
        };

        button.addEventListener('click', () => {
            const selectedOption = dropdown.value;
            const source = checkbox.checked ? 'clipboard' : 'current';
            handleSearch(selectedOption, source);
        });

        // Append all elements to the container
        uiContainer.appendChild(dropdown);
        uiContainer.appendChild(toggleContainer);
        uiContainer.appendChild(button);

        // Append the container to the body
        if (!document.body.contains(uiContainer)) {
            document.body.appendChild(uiContainer);
        }
    }

    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(debounceTimeout);
                func(...args);
            };
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(later, wait);
        };
    }

    const debouncedInitialize = debounce(() => {
        if (document.body && !uiContainer) {
            addUI();
        }
    }, 1000);

    // Initialize on page load
    if (document.readyState === 'loading') {
        window.addEventListener('load', debouncedInitialize);
    } else {
        debouncedInitialize();
    }

    // Monitor URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            debouncedInitialize();
        }
    }).observe(document, {subtree: true, childList: true});

    // Clean up when navigating away
    window.addEventListener('beforeunload', () => {
        removeUI();
        clearTimeout(debounceTimeout);
    });
})();