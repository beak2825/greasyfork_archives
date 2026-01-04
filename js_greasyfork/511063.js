// ==UserScript==
// @name         Discord Server Search
// @namespace    Made by @hakav
// @version      3.1
// @description  Search and navigate to a Discord server by name with real-time suggestions
// @match        https://discord.com/*
// @grant        none
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWjmWEq2JeU0yKb2ArlyAAJA4QQLkhbuihw&s
// @license      Copyright @hakav
// @downloadURL https://update.greasyfork.org/scripts/511063/Discord%20Server%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/511063/Discord%20Server%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const recentSearches = [];
    let highlightedIndex = -1;

    // Softer color palette
    let primaryColor = '#1e1e2f'; // Light Blue
    let secondaryColor = '#6a0dad'; // Darker Blue
    let clearColor = '#4B0082'; // Dark Purple
    let clearHoverColor = '#6A0DAD'; // Lighter Purple

    const createSearchIcon = () => {
        const searchIcon = document.createElement('div');
        searchIcon.innerText = 'Search';
        searchIcon.style.position = 'fixed';
        searchIcon.style.bottom = '20px';
        searchIcon.style.right = '20px';
        searchIcon.style.background = `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`;
        searchIcon.style.color = 'white';
        searchIcon.style.borderRadius = '25px';
        searchIcon.style.padding = '10px 15px';
        searchIcon.style.cursor = 'pointer';
        searchIcon.style.zIndex = '1000';
        searchIcon.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        searchIcon.style.transition = 'transform 0.3s, box-shadow 0.3s';
        document.body.appendChild(searchIcon);

        searchIcon.onmouseenter = () => {
            searchIcon.style.background = `rgba(169, 169, 169, 1)`; // Darker gray on hover
            searchIcon.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
            searchIcon.style.transform = 'scale(1.1) rotate(15deg)';
        };

        searchIcon.onmouseleave = () => {
            searchIcon.style.background = `rgba(100, 100, 100, 0.8)`; // Reset to gray background
            searchIcon.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            searchIcon.style.transform = 'scale(1) rotate(0deg)';
        };

        const searchPopup = document.createElement('div');
        searchPopup.style.position = 'fixed';
        searchPopup.style.bottom = '80px';
        searchPopup.style.right = '-110px';
        searchPopup.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`; // Gradient background
        searchPopup.style.padding = '15px';
        searchPopup.style.borderRadius = '10px';
        searchPopup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        searchPopup.style.zIndex = '1001';
        searchPopup.style.display = 'none';
        searchPopup.style.opacity = '0';
        searchPopup.style.transition = 'opacity 0.3s ease, right 0.5s ease, transform 0.5s ease';
        searchPopup.style.transform = 'translateY(20px)';
        document.body.appendChild(searchPopup);

        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Search servers...';
        searchInput.style.width = '100%';
        searchInput.style.border = 'none';
        searchInput.style.borderRadius = '8px';
        searchInput.style.padding = '8px';
        searchInput.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Light transparent background
        searchInput.style.color = 'white';
        searchInput.style.fontSize = '14px';
        searchInput.style.outline = 'none';
        searchPopup.appendChild(searchInput);

        const typingAnimation = document.createElement('div');
        typingAnimation.style.position = 'absolute';
        typingAnimation.style.top = '50%';
        typingAnimation.style.left = '10px';
        typingAnimation.style.transform = 'translateY(-50%)';
        typingAnimation.style.color = secondaryColor;
        typingAnimation.style.fontSize = '14px';
        typingAnimation.style.opacity = '0';
        typingAnimation.style.zIndex = '1002';
        typingAnimation.innerText = '|';
        searchInput.appendChild(typingAnimation);

        const searchButton = document.createElement('button');
        searchButton.innerText = 'Search';
        searchButton.style.marginLeft = '5px';
        searchButton.style.borderRadius = '10px';
        searchButton.style.padding = '8px 12px';
        searchButton.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.cursor = 'pointer';
        searchButton.style.fontSize = '14px';
        searchButton.style.transition = 'background 0.3s ease, transform 0.2s ease';
        searchButton.onclick = () => {
            searchButton.style.transform = 'scale(1.05)';
            setTimeout(() => searchButton.style.transform = 'scale(1)', 200);
        };
        searchPopup.appendChild(searchButton);

        const clearButton = document.createElement('button');
        clearButton.innerText = 'Clear';
        clearButton.style.marginLeft = '5px';
        clearButton.style.borderRadius = '10px';
        clearButton.style.padding = '8px 12px';
        clearButton.style.background = `linear-gradient(135deg, ${clearColor}, ${clearHoverColor})`;
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.cursor = 'pointer';
        clearButton.style.fontSize = '14px';
        clearButton.style.transition = 'background 0.3s ease, transform 0.2s ease';
        clearButton.onclick = () => {
            clearButton.style.transform = 'scale(1.05)';
            setTimeout(() => clearButton.style.transform = 'scale(1)', 200);
        };
        searchPopup.appendChild(clearButton);

        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.display = 'none';
        loadingIndicator.innerText = 'Loading...';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.fontSize = '12px';
        searchPopup.appendChild(loadingIndicator);

        const suggestionBox = document.createElement('div');
        suggestionBox.style.position = 'absolute';
        suggestionBox.style.top = '50px';
        suggestionBox.style.left = '0';
        suggestionBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        suggestionBox.style.border = `1px solid ${secondaryColor}`;
        suggestionBox.style.width = '100%';
        suggestionBox.style.zIndex = '1003';
        suggestionBox.style.display = 'none';
        suggestionBox.style.maxHeight = '150px';
        suggestionBox.style.overflowY = 'auto';
        suggestionBox.style.borderRadius = '8px';
        suggestionBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        searchPopup.appendChild(suggestionBox);

        const showPopup = () => {
            searchPopup.style.display = 'block';
            setTimeout(() => {
                searchPopup.style.opacity = '1';
                searchPopup.style.right = '20px';
                searchPopup.style.transform = 'translateY(0)';
            }, 10);
        };

        const hidePopup = () => {
            searchPopup.style.opacity = '0';
            searchPopup.style.right = '-110px';
            searchPopup.style.transform = 'translateY(20px)';
            setTimeout(() => {
                searchPopup.style.display = 'none';
                suggestionBox.style.display = 'none';
            }, 300);
        };

        searchIcon.onclick = () => {
            if (searchPopup.style.display === 'none' || searchPopup.style.opacity === '0') {
                showPopup();
                searchInput.focus();
            } else {
                hidePopup();
            }
        };

        window.onclick = (event) => {
            if (!searchIcon.contains(event.target) && !searchPopup.contains(event.target)) {
                hidePopup();
            }
        };

        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        };

        const searchServers = debounce(() => {
            const query = searchInput.value.trim().toLowerCase();
            suggestionBox.innerHTML = '';

            if (query) {
                loadingIndicator.style.display = 'block';
                const servers = Array.from(document.querySelectorAll('[data-list-id="guildsnav"] [aria-label]'));
                const matchedServers = servers.filter(server =>
                    server.getAttribute('aria-label').toLowerCase().includes(query)
                );

                if (matchedServers.length > 0) {
                    matchedServers.forEach(server => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = server.getAttribute('aria-label');
                        suggestionItem.style.padding = '10px';
                        suggestionItem.style.cursor = 'pointer';
                        suggestionItem.style.color = 'white';
                        suggestionItem.style.fontSize = '14px';
                        suggestionItem.onclick = () => {
                            searchInput.value = server.getAttribute('aria-label');
                            suggestionBox.style.display = 'none';
                            server.click();
                        };
                        suggestionItem.onmouseenter = () => {
                            suggestionItem.style.backgroundColor = 'rgba(138, 43, 226, 0.3)';
                            suggestionItem.style.transition = 'background-color 0.2s ease';
                        };
                        suggestionItem.onmouseleave = () => suggestionItem.style.backgroundColor = 'transparent';
                        suggestionBox.appendChild(suggestionItem);
                    });
                    suggestionBox.style.display = 'block';
                } else {
                    suggestionBox.innerHTML = '<div style="color: white; padding: 8px;">No servers found.</div>';
                    suggestionBox.style.display = 'block';
                }
                loadingIndicator.style.display = 'none';
            } else {
                suggestionBox.style.display = 'none';
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            searchServers();
            typingAnimation.style.opacity = '1';
            setTimeout(() => {
                typingAnimation.style.opacity = '0';
            }, 500);
        });

        searchInput.addEventListener('focus', () => {
            typingAnimation.style.display = 'block';
        });

        searchInput.addEventListener('blur', () => {
            typingAnimation.style.display = 'none';
        });

        searchButton.onclick = () => {
            const serverName = searchInput.value.trim();
            if (serverName) {
                recentSearches.push(serverName);
                const servers = Array.from(document.querySelectorAll('[data-list-id="guildsnav"] [aria-label]'));
                const matchedServer = servers.find(server =>
                    server.getAttribute('aria-label').toLowerCase() === serverName.toLowerCase()
                );

                if (matchedServer) {
                    matchedServer.click();
                } else {
                    console.log('Server not found!');
                }
            }
        };

        clearButton.onclick = () => {
            searchInput.value = '';
            suggestionBox.style.display = 'none';
        };

        searchInput.addEventListener('keydown', (e) => {
            const suggestionItems = Array.from(suggestionBox.children);
            if (e.key === 'ArrowDown') {
                highlightedIndex = Math.min(highlightedIndex + 1, suggestionItems.length - 1);
            } else if (e.key === 'ArrowUp') {
                highlightedIndex = Math.max(highlightedIndex - 1, 0);
            }

            suggestionItems.forEach((item, index) => {
                item.style.backgroundColor = index === highlightedIndex ? 'rgba(138, 43, 226, 0.3)' : 'transparent';
                item.style.transition = 'background-color 0.2s ease';
            });

            if (e.key === 'Enter' && highlightedIndex >= 0) {
                suggestionItems[highlightedIndex].click();
            }
        });
    };

    // Wait for the window to fully load before creating the icon
    window.onload = createSearchIcon;

})();