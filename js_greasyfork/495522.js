// ==UserScript==
// @name         ChatGPT Conversation Seeker Newer Version
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Search past conversations with auto-load and keyboard enter support
// @author       Emree.el on Instagram :)
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495522/ChatGPT%20Conversation%20Seeker%20Newer%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/495522/ChatGPT%20Conversation%20Seeker%20Newer%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the search bar and button
    const searchBarContainer = document.createElement('div');
    searchBarContainer.style.position = 'fixed';
    searchBarContainer.style.top = '0';
    searchBarContainer.style.left = 'calc(50% + 280px)';
    searchBarContainer.style.transform = 'translateX(-50%)';
    searchBarContainer.style.zIndex = '9999';
    searchBarContainer.style.background = '#171717';
    searchBarContainer.style.padding = '5px';
    searchBarContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    searchBarContainer.style.display = 'flex';
    searchBarContainer.style.alignItems = 'center';

    // Create the search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Enter text to search';
    searchInput.style.marginRight = '5px';
    searchInput.style.padding = '5px';
    searchInput.style.fontSize = '14px';
    searchInput.style.backgroundColor = 'black';

    // Create the search button
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Enter';
    searchButton.style.padding = '5px';
    searchButton.style.fontSize = '14px';

    // Append the input and button to the container
    searchBarContainer.appendChild(searchInput);
    searchBarContainer.appendChild(searchButton);

    // Append the container to the body
    document.body.appendChild(searchBarContainer);

    // Function to continuously scroll down and up an element
    function scrollElement(element, resolve) {
        let lastScrollTop = element.scrollTop;
        const scrollDownInterval = setInterval(() => {
            element.scrollTop += 100;
            if (element.scrollTop === lastScrollTop) {
                clearInterval(scrollDownInterval);
                scrollUp(element, resolve);
            }
            lastScrollTop = element.scrollTop;
        }, 50); // Adjust speed if necessary
    }

    // Function to scroll up an element
    function scrollUp(element, callback) {
        const scrollUpInterval = setInterval(() => {
            element.scrollTop -= 100;
            if (element.scrollTop === 0) {
                clearInterval(scrollUpInterval);
                callback();
            }
        }, 50); // Adjust speed if necessary
    }

    // Function to perform search
    function performSearch() {
        const searchText = searchInput.value.trim().toLowerCase();
        const elements = document.querySelectorAll('a.flex.items-center.gap-2.p-2');

        elements.forEach(element => {
            const text = element.textContent.trim().toLowerCase();
            if (text.includes(searchText)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    // Function to handle scrolling for up to three scrollable elements
    function handleScrollForElements(elements) {
        if (elements.length === 0) {
            performSearch();
            return;
        }

        let index = 0;
        function scrollNext() {
            if (index < elements.length && index < 3) {
                scrollElement(elements[index], () => {
                    index++;
                    scrollNext();
                });
            } else {
                performSearch();
            }
        }

        scrollNext();
    }

    // Add event listener to the button
    searchButton.addEventListener('click', function() {
        const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => el.scrollHeight > el.clientHeight);
        handleScrollForElements(scrollableElements);
    });

    // Add event listener for Enter key press in the search input
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => el.scrollHeight > el.clientHeight);
            handleScrollForElements(scrollableElements);
        }
    });

    // Automatically trigger loading on page load
    window.addEventListener('load', function() {
        const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => el.scrollHeight > el.clientHeight);
        handleScrollForElements(scrollableElements);
    });

})();
