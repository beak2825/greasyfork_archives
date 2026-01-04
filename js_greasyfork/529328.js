// ==UserScript==
// @name         Neopets Quick User hovercard (Mobile Compatible)
// @author       CleverClaw Studios
// @namespace    Originally based on work by diceroll123
// @version      3.0.1
// @description  Adds hover/tap cards to Neopets usernames and pets with quick access to profiles, shops, galleries, and more. Mobile compatible!
// @include      *://*.neopets.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529328/Neopets%20Quick%20User%20hovercard%20%28Mobile%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529328/Neopets%20Quick%20User%20hovercard%20%28Mobile%20Compatible%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Detect if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Set icon size based on device type
    const iconSize = isMobile ? 32 : 24;

    // Icon Definitions
    const userIcons = {
        profile: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`,
            url: 'http://www.neopets.com/userlookup.phtml?user=',
            tag: 'Profile'
        },
        neomail: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>`,
            url: 'http://www.neopets.com/neomessages.phtml?type=send&recipient=',
            tag: 'Neomail'
        },
        shop: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>`,
            url: 'http://www.neopets.com/browseshop.phtml?owner=',
            tag: 'Shop'
        },
        gallery: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
            url: 'http://www.neopets.com/gallery/index.phtml?gu=',
            tag: 'Gallery'
        },
        trade: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 0h24v24H0V0z" id="a"/></defs><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><path clip-path="url(#b)" d="M9.01 14H2v2H7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/></svg>`,
            url: 'http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string=',
            tag: 'Trades'
        },
        auction: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 0h24v24H0V0z" id="a"/></defs><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><path clip-path="url(#b)" d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.83 2.83-5.654-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z"/></svg>`,
            url: 'http://www.neopets.com/genie.phtml?type=find_user&auction_username=',
            tag: 'Auctions'
        },
        neofriend: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
            url: 'http://www.neopets.com/neofriend_requests.phtml?neofriend_add=',
            tag: 'Add Neofriend'
        },
        stamp: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>`,
            url: 'http://www.neopets.com/stamps.phtml?owner=',
            tag: 'Stamp Album'
        }
    };

    const petIcons = {
        petpage: {
            svg: `<svg fill="#000000" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" xmlns="http://www.w3.org/2000/svg"><path d="M-74 29h48v48h-48V29zM0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"/></svg>`,
            url: 'http://www.neopets.com/~',
            tag: 'Petpage'
        }
    };

    function getParameterByName(url, name) {
        const regex = new RegExp(`[?&]${name}=([^&#]*)`);
        const results = regex.exec(url);
        return results ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
    }

    function createLink(icon, identifier) {
        return `<a title='${icon.tag}' href='${icon.url}${identifier}' target='_blank'>${icon.svg}</a>`;
    }

    // Add global styles
    const style = document.createElement('style');
    style.textContent = `
        .hover-card {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999 !important; /* Ensure it's above navigation */
        }

        .copy-confirmation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #4CAF50;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            z-index: 10000;
            animation: fadeOut 1.5s forwards;
            text-align: center;
        }

        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;

    // Add mobile-specific styles if on mobile
    if (isMobile) {
        style.textContent += `
            .hover-card {
                padding: 15px;
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: calc(100% - 40px);
                max-width: 400px;
                text-align: center;
            }

            .hover-card p {
                margin: 0 0 15px 0;
                font-size: 16px;
                font-weight: bold;
            }

            .username-display {
                font-weight: normal;
                margin-left: 5px;
            }

            .icon-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                max-width: 240px;
                margin: 0 auto;
            }

            .icon-container a {
                flex: 0 0 25%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 8px 4px;
                box-sizing: border-box;
            }

            .copy-icon {
                cursor: pointer;
                margin-left: 10px;
                padding: 5px;
            }

            .modal-backdrop {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 9998;
            }
        `;
    }

    document.head.appendChild(style);

    function showCopyConfirmation(text) {
        navigator.clipboard.writeText(text).then(() => {
            const confirmation = document.createElement('div');
            confirmation.className = 'copy-confirmation';
            confirmation.textContent = 'Copied to clipboard!';
            document.body.appendChild(confirmation);

            setTimeout(() => {
                confirmation.remove();
            }, 1500);
        });
    }

    // ===== DESKTOP IMPLEMENTATION (ORIGINAL CODE) =====
    if (!isMobile) {
        function addHoverCard(link, type) {
            const identifier = type === 'user' ? link.getAttribute('username') : link.getAttribute('petname');
            let hoverTimeout;

            link.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);

                let card = document.querySelector('.hover-card');
                if (!card) {
                    card = document.createElement('div');
                    card.className = 'hover-card';
                    card.style.width = type === 'user' ? '240px' : '180px';
                    card.style.position = 'absolute';
                    card.style.padding = '10px';
                    card.style.top = `${link.getBoundingClientRect().bottom + window.scrollY}px`;
                    card.style.left = `${link.getBoundingClientRect().left + window.scrollX}px`;

                    card.innerHTML = `
                        <p><b>${type === 'user' ? 'Username' : 'Pet Name'}:</b>
                        <span class="username-display">${identifier}</span>
                        <span style="cursor: pointer; margin-left: 10px;" title="Copy to clipboard">📋</span>
                        </p>
                        <div class="icon-container">
                            ${Object.values(type === 'user' ? userIcons : petIcons).map(icon => createLink(icon, identifier)).join('')}
                        </div>`;

                    card.style.textAlign = 'center';

                    const iconContainer = card.querySelector('.icon-container');
                    iconContainer.style.display = 'flex';
                    iconContainer.style.flexWrap = 'wrap';
                    iconContainer.style.justifyContent = 'center';
                    iconContainer.style.maxWidth = '240px';
                    iconContainer.style.margin = '0 auto';

                    const iconLinks = iconContainer.querySelectorAll('a');
                    iconLinks.forEach(link => {
                        link.style.flex = '0 0 25%';
                        link.style.display = 'flex';
                        link.style.justifyContent = 'center';
                        link.style.alignItems = 'center';
                        link.style.padding = '8px 4px';
                        link.style.boxSizing = 'border-box';
                    });

                    const clipboardIcon = card.querySelector('span[title="Copy to clipboard"]');
                    clipboardIcon.addEventListener('click', () => {
                        showCopyConfirmation(identifier);
                    });

                    card.addEventListener('mouseenter', () => {
                        clearTimeout(hoverTimeout);
                    });

                    card.addEventListener('mouseleave', () => {
                        hoverTimeout = setTimeout(() => {
                            card.remove();
                        }, 200);
                    });

                    // Append to body to ensure it's not constrained by parent elements
                    document.body.appendChild(card);
                }
            });

            link.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    const card = document.querySelector('.hover-card');
                    if (card) {
                        card.remove();
                    }
                }, 200);
            });
        }

        // Process initial links for desktop
        document.querySelectorAll("a[href*='userlookup.phtml?user='], a[href*='randomfriend.phtml?user=']").forEach(link => {
            const user = getParameterByName(link.href, 'user') || getParameterByName(link.href, 'randomfriend');
            link.setAttribute('username', user);
            addHoverCard(link, 'user');
        });

        document.querySelectorAll("a[href*='petlookup.phtml?pet=']").forEach(link => {
            const pet = getParameterByName(link.href, 'pet');
            link.setAttribute('petname', pet);
            addHoverCard(link, 'pet');
        });
    }
    // ===== MOBILE IMPLEMENTATION =====
    else {
        function showMobileCard(link, type) {
            // Clean up any existing cards
            document.querySelectorAll('.hover-card').forEach(el => el.remove());
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

            const identifier = type === 'user' ? link.getAttribute('username') : link.getAttribute('petname');

            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            document.body.appendChild(backdrop);

            // Create card
            const card = document.createElement('div');
            card.className = 'hover-card';

            // Create card content
            card.innerHTML = `
                <p>
                    ${type === 'user' ? 'Username' : 'Pet Name'}:
                    <span class="username-display">${identifier}</span>
                    <span class="copy-icon" title="Copy to clipboard">📋</span>
                </p>
                <div class="icon-container">
                    ${Object.values(type === 'user' ? userIcons : petIcons).map(icon => createLink(icon, identifier)).join('')}
                </div>`;

            // Add copy functionality
            const clipboardIcon = card.querySelector('.copy-icon');
            clipboardIcon.addEventListener('click', () => {
                showCopyConfirmation(identifier);
            });

            // Close modal when backdrop is clicked
            backdrop.addEventListener('click', () => {
                card.remove();
                backdrop.remove();
            });

            document.body.appendChild(card);
        }

        // Process initial links for mobile
        document.querySelectorAll("a[href*='userlookup.phtml?user='], a[href*='randomfriend.phtml?user=']").forEach(link => {
            const user = getParameterByName(link.href, 'user') || getParameterByName(link.href, 'randomfriend');
            link.setAttribute('username', user);

            link.addEventListener('click', (e) => {
                // Only intercept if it's a username link
                if (link.href.includes('userlookup.phtml?user=') || link.href.includes('randomfriend.phtml?user=')) {
                    e.preventDefault();
                    showMobileCard(link, 'user');
                }
            });
        });

        document.querySelectorAll("a[href*='petlookup.phtml?pet=']").forEach(link => {
            const pet = getParameterByName(link.href, 'pet');
            link.setAttribute('petname', pet);

            link.addEventListener('click', (e) => {
                // Only intercept if it's a pet link
                if (link.href.includes('petlookup.phtml?pet=')) {
                    e.preventDefault();
                    showMobileCard(link, 'pet');
                }
            });
        });
    }

    // Observer for dynamically added content - works for both desktop and mobile
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches("a[href*='userlookup.phtml?user='], a[href*='randomfriend.phtml?user=']")) {
                        const user = getParameterByName(node.href, 'user') || getParameterByName(node.href, 'randomfriend');
                        node.setAttribute('username', user);

                        if (isMobile) {
                            node.addEventListener('click', (e) => {
                                if (node.href.includes('userlookup.phtml?user=') || node.href.includes('randomfriend.phtml?user=')) {
                                    e.preventDefault();
                                    showMobileCard(node, 'user');
                                }
                            });
                        } else {
                            addHoverCard(node, 'user');
                        }
                    }
                    if (node.matches("a[href*='petlookup.phtml?pet=']")) {
                        const pet = getParameterByName(node.href, 'pet');
                        node.setAttribute('petname', pet);

                        if (isMobile) {
                            node.addEventListener('click', (e) => {
                                if (node.href.includes('petlookup.phtml?pet=')) {
                                    e.preventDefault();
                                    showMobileCard(node, 'pet');
                                }
                            });
                        } else {
                            addHoverCard(node, 'pet');
                        }
                    }

                    // Also check for links within the added node
                    if (node.querySelectorAll) {
                        node.querySelectorAll("a[href*='userlookup.phtml?user='], a[href*='randomfriend.phtml?user=']").forEach(link => {
                            const user = getParameterByName(link.href, 'user') || getParameterByName(link.href, 'randomfriend');
                            link.setAttribute('username', user);

                            if (isMobile) {
                                link.addEventListener('click', (e) => {
                                    if (link.href.includes('userlookup.phtml?user=') || link.href.includes('randomfriend.phtml?user=')) {
                                        e.preventDefault();
                                        showMobileCard(link, 'user');
                                    }
                                });
                            } else {
                                addHoverCard(link, 'user');
                            }
                        });

                        node.querySelectorAll("a[href*='petlookup.phtml?pet=']").forEach(link => {
                            const pet = getParameterByName(link.href, 'pet');
                            link.setAttribute('petname', pet);

                            if (isMobile) {
                                link.addEventListener('click', (e) => {
                                    if (link.href.includes('petlookup.phtml?pet=')) {
                                        e.preventDefault();
                                        showMobileCard(link, 'pet');
                                    }
                                });
                            } else {
                                addHoverCard(link, 'pet');
                            }
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();