// ==UserScript==
// @name         ChatGPT Conversation Navigator
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @author       TLBSTATION
// @icon         https://i.ibb.co/jZ3HpwPk/pngwing-com.png
// @version      1.4.3
// @description  Displays a floating container on the right with every message you sent in the current conversation. Clicking a message scrolls smoothly to it.
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529875/ChatGPT%20Conversation%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/529875/ChatGPT%20Conversation%20Navigator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let chatID = ''; // To track conversation changes
    let userMsgCounter = 0;

    // Create (or retrieve) the floating container on the right
    function createContainer() {
        let container = document.getElementById('chatgpt-message-nav');
        if (!container) {
            container = document.createElement('div');
            container.id = 'chatgpt-message-nav';
            container.style.position = 'fixed';
            container.style.top = '60px';
            container.style.right = '10px';
            container.style.width = '250px';
            container.style.maxHeight = '80vh';
            container.style.overflowY = 'auto';


            container.className = "text-token-text-primary bg-token-main-surface-primary rounded-lg shadow-lg";
            container.style.zIndex = '1';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
            container.style.fontSize = '14px';
            container.style.transition = 'width 0.3s, padding 0.3s';

            // Create header with title and toggle button
            const header = document.createElement('div');
            header.id = 'chatgpt-message-nav-header';
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            header.style.padding = '10px';
            header.style.paddingTop = '15px';
            header.style.cursor = 'pointer';
            header.style.position = 'sticky';
            header.style.top = '-7px';
            header.style.background = 'inherit';
            header.style.zIndex = '1';


            const title = document.createElement('div');
            title.id = 'chatgpt-message-nav-title';
            title.innerText = 'Your Messages';
            title.style.fontWeight = 'bold';

            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'chatgpt-message-nav-toggle';
            toggleBtn.style.background = 'none';
            toggleBtn.style.border = 'none';
            toggleBtn.style.color = 'white';
            toggleBtn.style.fontSize = '16px';
            toggleBtn.style.cursor = 'pointer';
            // Default state: expanded, so show "<"
            toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md text-token-text-primary"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C11.7348 21 11.4804 20.8946 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.5196 20.8946 12.2652 21 12 21Z" fill="currentColor"></path></svg>`;
            toggleBtn.style.rotate = '-90deg';
            toggleBtn.style.transition = 'rotate 0.3s';
            header.appendChild(title);
            header.appendChild(toggleBtn);

            // Create content container for the list
            const content = document.createElement('div');
            content.id = 'chatgpt-message-nav-content';
            content.style.padding = '10px';
            content.style.paddingTop = '0px';

            container.appendChild(header);
            container.appendChild(content);

            document.body.appendChild(container);

            // Check if collapsed state is stored
            const collapsed = localStorage.getItem('chatgptMessageNavCollapsed') === 'true';
            if (collapsed) {
                content.style.display = 'none';
                container.style.width = 'min-content';
                container.style.padding = '5px';
                title.style.display = 'none';
                toggleBtn.style.rotate = '90deg';
                header.style.paddingTop = '10px';
            }

            // Toggle functionality
            toggleBtn.addEventListener('click', () => {
                if (content.style.display === 'none') {
                    // Expand
                    content.style.display = 'block';
                    container.style.width = '250px';
                    container.style.padding = '7px';
                    title.style.display = 'block';
                    toggleBtn.style.rotate = '-90deg';
                    header.style.paddingTop = '15px';
                    localStorage.setItem('chatgptMessageNavCollapsed', 'false');
                } else {
                    // Collapse
                    content.style.display = 'none';
                    container.style.width = 'min-content';
                    container.style.padding = '5px';
                    title.style.display = 'none';
                    toggleBtn.style.rotate = '90deg';
                    header.style.paddingTop = '10px';
                    localStorage.setItem('chatgptMessageNavCollapsed', 'true');
                }
            });
        }
        return container;
    }

    // Ensure each user message gets a unique ID
    function assignIdToMessage(msgElem) {
        if (!msgElem.id) {
            userMsgCounter++;
            msgElem.id = 'user-msg-' + userMsgCounter;
        }
    }

    // Update the list in the floating container with all user messages
    function updateMessageList() {
        const container = createContainer();
        const content = document.getElementById('chatgpt-message-nav-content');
        if (!content) return;

        // Clear any existing list
        content.innerHTML = '';
        const list = document.createElement('ul');
        list.style.padding = '0';
        list.style.margin = '0';
        list.style.listStyle = 'none';

        // Select user messages using data-message-author-role attribute
        const userMessages = document.querySelectorAll('div[data-message-author-role="user"]');
        userMessages.forEach(msgElem => {
            assignIdToMessage(msgElem);
            const text = msgElem.innerText.trim();

            const listItem = document.createElement('li');
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '5px 10px';
            listItem.style.marginTop = '5px';
            listItem.style.borderRadius = '10px';
            listItem.style.borderBottom = '1px solid var(--main-surface-primary-inverse)';
            listItem.style.transition = 'background 0.2s';

            listItem.addEventListener('mouseenter', () => {
                listItem.style.background = '#c5c5c54d' ;
            });
            listItem.addEventListener('mouseleave', () => {
                listItem.style.background = 'transparent';
            });

            // Force one line with ellipsis
            listItem.style.whiteSpace = 'nowrap';
            listItem.style.overflow = 'hidden';
            listItem.style.textOverflow = 'ellipsis';

            listItem.textContent = text;



            // Smooth scroll to the corresponding message when clicked
            listItem.addEventListener('click', () => {
                const target = document.getElementById(msgElem.id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            list.appendChild(listItem);
        });

        content.appendChild(list);
    }

    // Get the current conversation ID based on the URL
    function getChatID() {
        const chatURL = window.location.pathname;
        return chatURL.includes('/c/') ? chatURL.split('/c/')[1] : 'global';
    }

    // Observe the conversation container for changes
    function observeConversation() {
        const mainElem = document.querySelector('main');
        if (!mainElem) return;
        const observer = new MutationObserver(() => {
            updateMessageList();
        });
        observer.observe(mainElem, { childList: true, subtree: true });
    }

    function toggleContainerVisibility() {
        const container = document.getElementById('chatgpt-message-nav');
        const isChatPage = window.location.pathname.startsWith('/c/');

        if (container) {
            container.style.display = isChatPage ? 'block' : 'none';
        }
    }


    // Wait for the conversation area to load
    function waitForChat() {
        const interval = setInterval(() => {
            if (document.querySelector('main')) {
                clearInterval(interval);
                toggleContainerVisibility();
                chatID = getChatID();
                updateMessageList();
                observeConversation();
            }
        }, 500);
    }

    waitForChat();

    // Update when switching between conversations (for SPA navigation)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            chatID = getChatID();
            userMsgCounter = 0;
            updateMessageList();
            toggleContainerVisibility();
        }
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });
})();
