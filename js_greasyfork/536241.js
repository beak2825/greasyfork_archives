// ==UserScript==
// @name         Axiom Pro Ultra v5
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds Pro Features to Axiom (Enhanced Search, Pump/LaunchLab Highlighting for Pulse page)
// @author       nocommas
// @match        https://axiom.trade/*
// @match        https://backup.axiom.trade/*
// @grant        GM_xmlhttpRequest
// @connect      graphql-mainnet.boop.works
// @downloadURL https://update.greasyfork.org/scripts/536241/Axiom%20Pro%20Ultra%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/536241/Axiom%20Pro%20Ultra%20v5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const linkConditions = {
        twitterStatus: {
            check: url => (url.includes('x.com/') && url.includes('/status/')) ||
                          (url.includes('twitter.com/') && url.includes('/status/')),
            border: '2px solid lime'
        },
        twitterCommunity: {
            check: url => url.includes('x.com') && url.includes('/i/communities'),
            border: '2px solid gold'
        },
        twitterProfile: {
            check: url => (url.includes('x.com/') || url.includes('twitter.com/')) &&
                          !url.includes('/home') &&
                          !url.includes('/i/') &&
                          !url.includes('/search') &&
                          url !== 'https://www.x.com/' &&
                          url !== 'https://x.com/',
            border: '2px solid white'
        },
        reddit: {
            check: url => url.includes('reddit.com'),
            border: '2px solid #FF4500'
        },
        tiktok: {
            check: url => url.includes('vm.tiktok.com') || url.includes('tiktok.com'),
            border: '2px solid cyan'
        },
        youtube: {
            check: url => url.includes('youtube.com') || url.includes('youtu.be'),
            border: '2px solid red'
        },
        streaming: {
            check: url => url.includes('kick.tv') || url.includes('twitch.tv'),
            border: '2px solid purple'
        },
        instagram: {
            check: url => url.includes('instagram.com'),
            border: '2px solid #E1306C'
        },
        truthsocial: {
            check: url => url.includes('truthsocial.com'),
            border: '2px solid #5448EE'
        }
    };

    // CSS for Pump and LaunchLab card backgrounds
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .card-pump {
            background: linear-gradient(135deg, rgba(147, 197, 253, 0.10), rgba(147, 197, 253, 0.05)) !important;
        }
        .card-pump:hover {
            background: linear-gradient(135deg, rgba(147, 197, 253, 0.20), rgba(147, 197, 253, 0.10)) !important;
        }
        .card-launchlab {
            background: linear-gradient(135deg, rgba(214, 45, 235, 0.10), rgba(214, 45, 235, 0.05)) !important;
        }
        .card-launchlab:hover {
            background: linear-gradient(135deg, rgba(214, 45, 235, 0.20), rgba(214, 45, 235, 0.10)) !important;
        }
        .card-meteora {
            background: linear-gradient(135deg, rgba(255, 70, 98, 0.10), rgba(255, 70, 98, 0.05)) !important;
        }
        .card-meteora:hover {
            background: linear-gradient(135deg, rgba(255, 70, 98, 0.20), rgba(255, 70, 98, 0.10)) !important;
        }
        .card-bonk {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.10)) !important;
        }
        .card-bonk:hover {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 193, 7, 0.15)) !important;
        }
        .card-boop {
            background: linear-gradient(135deg, rgba(12, 174, 228, 0.15), rgba(12, 174, 228, 0.10)) !important;
        }
        .card-boop:hover {
            background: linear-gradient(135deg, rgba(12, 174, 228, 0.25), rgba(12, 174, 228, 0.15)) !important;
        }
        .card-believe {
            background: linear-gradient(135deg, rgba(0, 216, 69, 0.15), rgba(0, 216, 69, 0.10)) !important;
        }
        .card-believe:hover {
            background: linear-gradient(135deg, rgba(0, 216, 69, 0.25), rgba(0, 216, 69, 0.15)) !important;
        }
        .twitter-creator-link {
            color: #6B7280;
            font-size: 14px;
            font-weight: 500;
            transition: color 125ms;
        }
        .twitter-creator-link:hover,
        .featured-twitter-creator-link:hover {
            color: #1DA1F2;
            text-decoration: underline;
        }
        .featured-twitter-creator-link {
            color: #2cff05;
            font-size: 14px;
            font-weight: 500;
            transition: color 125ms;
        }
        button.hover\\:bg-secondaryStroke.bg-primaryStroke.text-textSecondary.flex.flex-row.gap-\\[4px\\].justify-center.items-center.rounded-\\[999px\\].h-\\[60px\\].whitespace-nowrap:hover {
            background-color: #4CAF50 !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Enlarge quick buy button
    function enlargeQuickBuyPadding() {
        if (!window.location.pathname.includes('/pulse')) return;

        const buttons = document.querySelectorAll(
            'button.hover\\:bg-secondaryStroke.bg-primaryStroke.text-textSecondary.flex.flex-row.gap-\\[4px\\].justify-center.items-center.rounded-\\[999px\\].h-\\[60px\\].whitespace-nowrap'
        );

        buttons.forEach(button => {
            button.style.paddingLeft = '5rem';
            button.style.paddingRight = '5rem';
            button.style.paddingTop = '5rem';
            button.style.paddingBottom = '2.5rem';
            button.style.borderRadius = '0';
            button.style.backgroundColor = '#ffffff0f';
        });

        document.querySelectorAll('div.absolute.right-\\[12px\\].bottom-\\[10px\\], div.absolute.right-\\[12px\\].bottom-\\[16px\\]')
            .forEach(div => {
                div.style.right = '0px';
                div.style.bottom = '0px';
        });
    }

    function fetchCreatorInfo(address, callback) {
        const query = `
            query GetToken($address: String!) {
                token(address: $address) {
                    address
                    sourceTweetId
                    twitterUrl
                    websiteUrl
                    creator {
                        twitterName
                        twitterUsername
                        twitterProfileImageUrl
                    }
                }
            }`;
        const variables = { address };
        const payload = JSON.stringify({ query, variables, operationName: "GetToken" });

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://graphql-mainnet.boop.works/graphql",
            headers: {
                "accept": "application/graphql-response+json, application/json",
                "content-type": "application/json",
                "origin": "https://boop.fun",
                "referer": "https://boop.fun/",
                "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36"
            },
            data: payload,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const token = data?.data?.token;

                        const creator = token?.creator || {};
                        const result = {
                            sourceTweetId: token?.sourceTweetId || null,
                            twitterUrl: token?.twitterUrl || null,
                            websiteUrl: token?.websiteUrl || null,
                            twitterName: creator.twitterName || null,
                            twitterUsername: creator.twitterUsername || null,
                            twitterProfileImageUrl: creator.twitterProfileImageUrl || null
                        };
                        callback(result);
                    } catch (e) {
                        console.error("Error parsing API response:", e);
                        callback({
                            sourceTweetId: null,
                            twitterUrl: null,
                            websiteUrl: null,
                            twitterName: null,
                            twitterUsername: null,
                            twitterProfileImageUrl: null
                        });
                    }
                } else {
                    console.error(`API request failed. Status: ${response.status}`);
                    callback({
                        sourceTweetId: null,
                        twitterUrl: null,
                        websiteUrl: null,
                        twitterName: null,
                        twitterUsername: null,
                        twitterProfileImageUrl: null
                    });
                }
            },
            onerror: function() {
                console.error(`Network error during API request.`);
                callback({
                    sourceTweetId: null,
                    twitterUrl: null,
                    websiteUrl: null,
                    twitterName: null,
                    twitterUsername: null,
                    twitterProfileImageUrl: null
                });
            }
        });
    }


    // Add Twitter username, profile image, and extra icons next to search icon
    function addTwitterLink() {
        if (!window.location.pathname.includes('/meme')) return;

        const tokenLinks = document.querySelectorAll('a[href*="boop.fun/tokens/"]:not([data-boop-processed])');
        if (tokenLinks.length === 0) return;

        tokenLinks.forEach(link => {
            link.setAttribute('data-boop-processed', 'true');
            const href = link.getAttribute('href');
            const match = href.match(/boop\.fun\/tokens\/([^/?#]+)/);
            if (!match) return;
            const address = match[1];

            // Boop API link (added first)
            const apiLink = document.createElement('a');
            apiLink.href = `https://public-api.boop.fun/v1/currency/${address}`;
            apiLink.target = '_blank';
            apiLink.rel = 'noopener noreferrer';
            apiLink.className = 'boop-api-link';
            apiLink.textContent = '🔗';
            link.parentElement.appendChild(apiLink);

            fetchCreatorInfo(address, (details) => {
                const { twitterUsername, twitterProfileImageUrl, twitterUrl, websiteUrl, sourceTweetId } = details;

                // === Twitter Profile Link ===
                if (twitterUsername != null && !link.parentElement.querySelector('.twitter-creator-link')) {
                    const twitterContainer = document.createElement('span');
                    twitterContainer.className = 'twitter-creator-link';
                    twitterContainer.style.display = 'inline-flex';
                    twitterContainer.style.alignItems = 'center';
                    twitterContainer.style.marginLeft = '8px';

                    if (twitterProfileImageUrl != null) {
                        const img = document.createElement('img');
                        img.src = twitterProfileImageUrl;
                        img.alt = twitterUsername;
                        img.style.width = '16px';
                        img.style.height = '16px';
                        img.style.borderRadius = '50%';
                        img.style.marginRight = '4px';
                        twitterContainer.appendChild(img);
                    }

                    const twitterLink = document.createElement('a');
                    twitterLink.href = `https://x.com/${twitterUsername}`;
                    twitterLink.target = '_blank';
                    twitterLink.rel = 'noopener noreferrer';
                    twitterLink.textContent = `@${twitterUsername}`;
                    twitterLink.style.textDecoration = 'none';
                    twitterLink.style.color = '#1DA1F2';
                    twitterContainer.appendChild(twitterLink);

                    link.parentElement.appendChild(twitterContainer);
                }

                // === Twitter URL Icon ===
                if (twitterUrl != null && !link.parentElement.querySelector('.token-twitter-url')) {
                    const twitterIconLink = document.createElement('a');
                    twitterIconLink.href = twitterUrl;
                    twitterIconLink.target = '_blank';
                    twitterIconLink.rel = 'noopener noreferrer';
                    twitterIconLink.className = 'token-twitter-url';
                    twitterIconLink.style.marginLeft = '6px';
                    twitterIconLink.innerHTML = `<i class="ri-twitter-x-line text-[16px]"></i>`;
                    link.parentElement.appendChild(twitterIconLink);
                }

                // === Website URL Icon ===
                if (websiteUrl != null && !link.parentElement.querySelector('.token-website-url')) {
                    const websiteIconLink = document.createElement('a');
                    websiteIconLink.href = websiteUrl;
                    websiteIconLink.target = '_blank';
                    websiteIconLink.rel = 'noopener noreferrer';
                    websiteIconLink.className = 'token-website-url';
                    websiteIconLink.style.marginLeft = '6px';
                    websiteIconLink.innerHTML = `<i class="text-textSecondary ri-global-line text-[16px] hover:text-primaryBlueHover transition-colors duration-[125ms]"></i>`;
                    link.parentElement.appendChild(websiteIconLink);
                }

                // === Source Tweet Icon ===
                if (sourceTweetId != null && !link.parentElement.querySelector('.token-source-tweet')) {
                    const tweetIconLink = document.createElement('a');
                    tweetIconLink.href = `https://x.com/i/web/status/${sourceTweetId}`;
                    tweetIconLink.target = '_blank';
                    tweetIconLink.rel = 'noopener noreferrer';
                    tweetIconLink.className = 'token-source-tweet';
                    tweetIconLink.style.marginLeft = '6px';
                    tweetIconLink.innerHTML = `<i class="ri-quill-pen-line text-[#5DBCFF] hover:text-[#70c4ff] transition-colors duration-[125ms] ease-in-out"></i>`;
                    link.parentElement.appendChild(tweetIconLink);
                }
            });
        });
    }

    // Simulate React input event
    function simulateInputEvent(input, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const inputEvent = new Event('input', { bubbles: true });

        // Set value and dispatch input event
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(inputEvent);
    }

    // Apply search term to all column search bars instantly
    function applySearchToAllColumns(searchTerm, sourceInput) {
        const searchInputs = document.querySelectorAll(
            '.whitespace-nowrap.border-primaryStroke input[type="text"][placeholder="Search by ticker or name"]'
        );
        searchInputs.forEach(input => {
            if (input !== sourceInput && input.value !== searchTerm) {
                simulateInputEvent(input, searchTerm);
            }
        });
    }

    // Initialize search bar listeners
    function initializeSearchBars() {
        if (!window.location.pathname.includes('/pulse')) return;
        const searchInputs = document.querySelectorAll(
            '.whitespace-nowrap.border-primaryStroke input[type="text"][placeholder="Search by ticker or name"]'
        );
        searchInputs.forEach(input => {
            if (!input.dataset.listenerAdded) {
                input.dataset.listenerAdded = 'true';
                input.addEventListener('input', () => {
                    const searchTerm = input.value.trim();
                    applySearchToAllColumns(searchTerm, input);
                });
                // Handle clear button
                const clearButton = input.parentElement.querySelector('button .ri-close-line');
                if (clearButton) {
                    clearButton.parentElement.addEventListener('click', () => {
                        applySearchToAllColumns('', input);
                    });
                }
            }
        });
    }

    // Style card backgrounds based on protocol
    function styleCardBackground(card) {
        const pumpImg = card.querySelector('img[src*="pump.svg"], img[src*="pump-grad-amm-temp.svg"]');
        const launchlabImg = card.querySelector('img[src*="launchlab.svg"], img[src*="ray.svg"], img[src*="ray-cpmm.svg"]');
        const meteoraImg = card.querySelector('img[src*="virtual-curve-grad.svg"], img[src*="virtual-curve.svg"]');
        const believeImg = card.querySelector('img[src*="launch-a-coin-grad.svg"], img[src*="launch-a-coin.svg"]');
        const bonkImg = card.querySelector('img[src*="bonk-grad.svg"], img[src*="bonk.svg"]');
        const boopImg = card.querySelector('img[src*="boop.svg"], img[src*="boop-grad.svg"]');
        card.classList.remove('card-pump', 'card-launchlab', 'card-meteora', 'card-bonk', 'card-boop');
        if (pumpImg) {
            card.classList.add('card-pump');
        } else if (launchlabImg) {
            card.classList.add('card-launchlab');
        } else if (meteoraImg) {
            card.classList.add('card-meteora');
        } else if (bonkImg) {
            card.classList.add('card-bonk');
        } else if (boopImg) {
            card.classList.add('card-boop');
        } else if (believeImg) {
            card.classList.add('card-believe');
        }
    }

    // Style CA button based on ending
    function styleCA(card) {
        const caButton = card.querySelector('button.text-textTertiary.text-\\[12px\\].font-medium.text-center.max-w-\\[74px\\]');
        if (!caButton) return;
        const textElement = caButton.querySelector('span');
        if (!textElement) return;
        const text = textElement.textContent.toLowerCase();
        const colorMap = {
            'pump': '#00FF00',
            'bonk': '#00FF00',
            'dao': '#00FF00',
            'ray': '#00FF00',
            'boop': '#00FF00',
            'pkin': '#00FF00',
            'bags': '#FF0000'
        };
        for (const [ending, color] of Object.entries(colorMap)) {
            if (text.endsWith(ending)) {
                caButton.style.color = color;
                const button = caButton.querySelector('button');
                if (button) {
                    button.style.color = color;
                }
                break;
            }
        }
    }

    // Style links in cards
    function styleLinksInCards() {
        if (!window.location.pathname.includes('/pulse')) return;
        const cards = document.querySelectorAll('.bg-backgroundSecondary.border-primaryStroke\\/50.border-b-\\[1px\\]');
        cards.forEach(card => {
            const linkDiv = card.querySelector('.flex.flex-row.flex-shrink-0.gap-\\[8px\\].justify-start.items-center');
            if (!linkDiv) return;
            styleCardBackground(card);
            styleCA(card);

            function applyStylesToLinks() {
                const links = linkDiv.querySelectorAll('a');
                links.forEach(link => {
                    const url = link.href;
                    for (const [type, condition] of Object.entries(linkConditions)) {
                        if (condition.check(url)) {
                            const icons = link.querySelectorAll('i, img');
                            icons.forEach(icon => {
                                icon.style.border = condition.border;
                                icon.style.boxSizing = 'border-box';
                                icon.style.width = '32px';
                                icon.style.display = 'flex';
                                icon.style.alignItems = 'center';
                                icon.style.justifyContent = 'center';
                            });
                            break;
                        }
                    }
                });
                linkDiv.dataset.styled = 'true';
                styleCardBackground(card);
                styleCA(card);
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        applyStylesToLinks();
                    }
                });
            });

            if (!linkDiv.dataset.styled) {
                applyStylesToLinks();
            }
            observer.observe(linkDiv, { childList: true, subtree: true });
        });
    }

    function addXUsernameToCard() {
        if (!window.location.pathname.includes('/pulse')) return;
        const cards = document.querySelectorAll('.bg-backgroundSecondary.border-primaryStroke\\/50.border-b-\\[1px\\]');

        const twitterUsernameRegex = /(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/(?!search|i\/|home)([a-zA-Z0-9_]+)(?:\/status\/[0-9]+)?(?:\/)?(?:\?.*)?(?:#.*)?$/i;

        cards.forEach(card => {
            // if (!card.classList.contains('card-believe')) return;

            const linkDiv = card.querySelector('.flex.flex-row.flex-shrink-0.gap-\\[8px\\].justify-start.items-center');
            if (!linkDiv) return;

            function addUsernameToCard() {
                // Remove any existing username links to prevent duplicates
                const existingUsernames = linkDiv.querySelectorAll('a.twitter-creator-link');
                existingUsernames.forEach(usernameElement => usernameElement.remove());

                // Query all links that might contain x.com or twitter.com
                const links = linkDiv.querySelectorAll('a[href*="x.com"], a[href*="twitter.com"]');
                let xLinkFound = false;
                let username = null;

                // Prioritize links based on icon classes: ri-quill-pen-line > ri-twitter-x-line > ri-global-line
                const priorityIcons = [
                    { icon: 'ri-quill-pen-line', links: [] },
                    { icon: 'ri-twitter-x-line', links: [] },
                    { icon: 'ri-global-line', links: [] }
                ];

                // Categorize links by their icon class
                links.forEach(link => {
                    const icon = link.querySelector('i');
                    if (!icon) return;

                    if (icon.classList.contains('ri-quill-pen-line')) {
                        priorityIcons[0].links.push(link);
                    } else if (icon.classList.contains('ri-twitter-x-line')) {
                        priorityIcons[1].links.push(link);
                    } else if (icon.classList.contains('ri-global-line')) {
                        priorityIcons[2].links.push(link);
                    }
                });

                // Process links in priority order
                for (const priority of priorityIcons) {
                    for (const link of priority.links) {
                        const url = link.href;
                        const match = url.match(twitterUsernameRegex);
                        if (match && match[1]) {
                            username = match[1];
                            xLinkFound = true;
                            break; // Stop after finding the first valid username
                        }
                    }
                    if (xLinkFound) break; // Exit the priority loop once a username is found
                }

                // If a username was found, add the link
                if (xLinkFound && username) {
                    const usernameElement = document.createElement('a');
                    usernameElement.textContent = `@${username}`;
                    usernameElement.href = `https://x.com/${username}`;
                    usernameElement.className = 'twitter-creator-link';
                    usernameElement.target = '_blank';
                    usernameElement.rel = 'noopener noreferrer';
                    usernameElement.style.pointerEvents = 'auto';

                    // Make it green if username is 'hjevelynha'
                    if (username.toLowerCase() === 'hjevelynha') {
                        usernameElement.className = 'featured-twitter-creator-link';
                    }

                    usernameElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                    linkDiv.appendChild(usernameElement);
                }

                linkDiv.dataset.usernameProcessed = 'true';
                return xLinkFound;
            }

            const observer = new MutationObserver((mutations) => {
                let xLinkFound = false;
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        xLinkFound = addUsernameToCard();
                    }
                });
                if (xLinkFound) {
                    observer.disconnect();
                }
            });

            if (!linkDiv.dataset.usernameProcessed) {
                const xLinkFound = addUsernameToCard();
                if (!xLinkFound) {
                    observer.observe(linkDiv, { childList: true, subtree: true });
                }
            }
        });
    }

    // Watch for new cards
    function watchForNewCards() {
        if (!window.location.pathname.includes('/pulse')) return;
        const columns = document.querySelectorAll('.flex.flex-1.flex-col.h-full.justify-start.items-center.overflow-hidden');
        columns.forEach(column => {
            const cardContainer = column.querySelector('.bg-backgroundSecondary.border-primaryStroke\\/50.border-b-\\[1px\\]')?.parentElement;
            if (!cardContainer || cardContainer.dataset.observed) return;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        initializeSearchBars();
                        styleLinksInCards();
                        addXUsernameToCard();
                    }
                });
            });
            observer.observe(cardContainer, { childList: true, subtree: true });
            cardContainer.dataset.observed = 'true';
        });
    }

    // Wait for DOM to load
    function waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') resolve();
            else document.addEventListener('DOMContentLoaded', resolve);
        });
    }

    waitForDOM().then(() => {
        initializeSearchBars();
        styleLinksInCards();
        watchForNewCards();
        enlargeQuickBuyPadding();
        addTwitterLink();
        addXUsernameToCard();

        const columnObserver = new MutationObserver(() => {
            initializeSearchBars();
            styleLinksInCards();
            watchForNewCards();
            enlargeQuickBuyPadding();
            addTwitterLink();
            addXUsernameToCard();
        });
        columnObserver.observe(document.body, { childList: true, subtree: true });

        // Keypress listener for search and Esc
        document.addEventListener('keydown', (event) => {
            // Handle Esc key to clear all search terms
            if (event.key === 'Escape') {
                event.preventDefault();
                applySearchToAllColumns('');
                // Blur the active input to ensure consistent state
                const activeInput = document.activeElement;
                if (activeInput && activeInput.tagName === 'INPUT') {
                    activeInput.blur();
                }
                return;
            }

            // Handle alphanumeric keys for search
            if (
                !event.ctrlKey &&
                !event.metaKey &&
                document.activeElement.tagName !== 'INPUT' &&
                document.activeElement.tagName !== 'TEXTAREA' &&
                /^[a-zA-Z0-9]$/.test(event.key)
            ) {
                const searchInput = document.querySelector(
                    '.whitespace-nowrap.border-primaryStroke input[type="text"][placeholder="Search by ticker or name"]'
                );
                if (searchInput) {
                    event.preventDefault();
                    searchInput.focus();
                    const newValue = searchInput.value + event.key;
                    simulateInputEvent(searchInput, newValue);
                    applySearchToAllColumns(newValue, searchInput);
                }
            }
        });
    });
})();