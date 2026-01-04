// ==UserScript==
// @name         ChatGPT Visual Enhancements with message Navigation
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Enhances the ChatGPT interface by visually highlighting the active chat link, styling message boxes, and adding top-centered navigation buttons to traverse messages.
// @author       noushadBug
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524109/ChatGPT%20Visual%20Enhancements%20with%20message%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/524109/ChatGPT%20Visual%20Enhancements%20with%20message%20Navigation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Initialize variables for navigation
    let messageElements = [];
    let currentIndex = -1;

    // Create and style navigation buttons
    function createNavigationButtons() {
        const navContainer = document.createElement('div');
        navContainer.id = 'custom-nav-container';
        navContainer.style.position = 'absolute';
        navContainer.style.top = '10px';
        navContainer.style.left = '50%';
        navContainer.style.transform = 'translateX(-50%)';
        navContainer.style.display = 'flex';
        navContainer.style.gap = '10px';
        navContainer.style.zIndex = '1000';

        const prevButton = document.createElement('button');
        prevButton.id = 'custom-prev-button';
        prevButton.innerHTML = '‹';
        styleNavButton(prevButton, 'Previous Message');

        const nextButton = document.createElement('button');
        nextButton.id = 'custom-next-button';
        nextButton.innerHTML = '›';
        styleNavButton(nextButton, 'Next Message');

        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);
        document.body.appendChild(navContainer);

        // Add event listeners
        prevButton.addEventListener('click', () => navigateMessages(-1));
        nextButton.addEventListener('click', () => navigateMessages(1));
    }

    // Style individual navigation buttons
    function styleNavButton(button, ariaLabel) {
        // Apply the new styles as per your specifications
        button.style.padding = '4px 19px';
        button.style.fontSize = '20px';
        button.style.border = 'none';
        button.style.borderRadius = '50px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'rgb(65, 76, 59)';
        button.style.color = 'rgb(255, 255, 255)';
        button.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 2px 5px';
        button.style.transition = 'background-color 0.3s, transform 0.2s';
        button.style.transform = 'scale(1)';

        // Accessibility
        button.setAttribute('aria-label', ariaLabel);

        // Hover effects
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#5a6e57';
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'rgb(65, 76, 59)';
            button.style.transform = 'scale(1)';
        });
    }

    // Function to update the list of message elements
    function updateMessageElements() {
        // Select all message containers; adjust the selector if necessary
        messageElements = Array.from(document.querySelectorAll('[data-message-author-role]'));
    }

    // Function to navigate through messages
    function navigateMessages(direction) {
        if (messageElements.length === 0) return;

        // Remove highlight from the current message
        if (currentIndex >= 0 && currentIndex < messageElements.length) {
            const currentMessage = messageElements[currentIndex];
            currentMessage.style.border = '';
            currentMessage.style.boxShadow = '';
        }

        // Update the current index
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = messageElements.length - 1; // Wrap to last
        } else if (currentIndex >= messageElements.length) {
            currentIndex = 0; // Wrap to first
        }

        const targetMessage = messageElements[currentIndex];

        // Ensure the targetMessage exists
        if (targetMessage) {
            // Scroll to the message container, aligning it to the top
            targetMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Highlight the target message
            targetMessage.style.border = '2px solid #2f2f2f';
            targetMessage.style.boxShadow = 'rgb(123 166 175) 0px 0px 10px';

            // Focus on the message for better accessibility
            targetMessage.setAttribute('tabindex', '-1'); // Make it focusable
            targetMessage.focus({ preventScroll: true });
        }
    }

    // Function to update the active <li> state
    function updateActiveState() {
        const listItems = document.querySelectorAll('li.relative');
        const currentPath = window.location.pathname;

        listItems.forEach(li => {
            const anchor = li.querySelector('a'); // Find the <a> inside <li>
            if (anchor && anchor.getAttribute('href') === currentPath) {
                // If href matches the current path, style it as active
                li.classList.add('active');
                li.style.background = 'black';
                li.style.borderRadius = '20px';
            } else {
                // Remove active styles from other <li> elements
                li.classList.remove('active');
                li.style.background = '';
                li.style.borderRadius = '';
            }
        });
    }

    // Function to style assistant messages
    function styleAssistantMessages() {
        const messages = document.querySelectorAll('[data-message-author-role="assistant"]');

        messages.forEach(message => {
            if (!message.classList.contains('custom-assistant-message-container')) {
                // Add custom class and apply styles
                message.classList.add('custom-assistant-message-container');
                message.style.background = '#414c3b';
                message.style.padding = '1em';
                message.style.borderRadius = '10px';
                message.style.color = '#ffffff'; // Ensure text is readable
                message.setAttribute('tabindex', '-1'); // Make it focusable
            }
        });
    }

    // Function to highlight user messages (optional enhancement)
    function styleUserMessages() {
        const userMessages = document.querySelectorAll('[data-message-author-role="user"]');

        userMessages.forEach(message => {
            if (!message.classList.contains('custom-user-message-container')) {
                // Add custom class and apply styles
                message.classList.add('custom-user-message-container');
                message.style.background = '#2a2a2a';
                message.style.padding = '1em';
                message.style.borderRadius = '10px';
                message.style.color = '#ffffff'; // Ensure text is readable
                message.setAttribute('tabindex', '-1'); // Make it focusable
            }
        });
    }

    // Debounce function to limit the rate of function execution
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Observe URL and DOM changes with debounced callback
    const observer = new MutationObserver(debounce(() => {
        updateActiveState();
        styleAssistantMessages();
        styleUserMessages();
        updateMessageElements();
    }, 300));

    // Start observing changes to the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    updateActiveState();
    styleAssistantMessages();
    styleUserMessages();
    updateMessageElements();
    createNavigationButtons();


    // Clean up when the script is removed
    window.addEventListener('unload', () => observer.disconnect());

    // Additional CSS Styling
    const otherCSS = `.h-header-height{background-color: var(--sidebar-surface-primary);}`;
    const styleTag = document.createElement('style');
    styleTag.textContent = otherCSS;
    document.head.appendChild(styleTag);
})();
