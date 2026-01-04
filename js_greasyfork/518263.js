// ==UserScript==
// @name         AniList Shortcuts
// @version      1.0
// @description  Add multiples shortcuts + custom ones
// @author       Mio.
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @license      GPL-3.0
// @match        *://*.anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518263/AniList%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/518263/AniList%20Shortcuts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to inject Font Awesome CSS
    function injectFontAwesome() {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        faLink.integrity = 'sha512-pap5K1fL5c4sLcXmpopbPWha8z36H1EJGgUK6YyE1Wfo2jydN12wPuABanVbBv8d5kZdO8+8PpJ1f8kz0gJ0Mg==';
        faLink.crossOrigin = 'anonymous';
        faLink.referrerPolicy = 'no-referrer';
        document.head.appendChild(faLink);
    }

    injectFontAwesome();

    // Utility function to wait for an element to appear in the DOM
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let timeElapsed = 0;

            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
                timeElapsed += intervalTime;
                if (timeElapsed >= timeout) {
                    clearInterval(interval);
                    reject(`Element ${selector} not found within ${timeout}ms`);
                }
            }, intervalTime);
        });
    }

    // Function to add a link with Font Awesome icon
    function addLinkWithIcon(element, url, linkText, iconName) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.marginLeft = '10px';

        const icon = document.createElement('i');
        icon.className = `fa fa-${iconName}`;
        icon.style.marginRight = '5px';

        link.appendChild(icon);
        link.appendChild(document.createTextNode(linkText));
        element.appendChild(link);
    }

    // Function to create a sticky box on forum comments
    function createStickyBoxLink() {
        // Prevent multiple sticky boxes
        if (document.querySelector('.sticky-box')) return;

        const stickyBox = document.createElement('div');
        stickyBox.classList.add('sticky-box');
        stickyBox.style.position = 'fixed';
        stickyBox.style.right = '10px';
        stickyBox.style.top = '200px';
        stickyBox.style.width = '200px';
        stickyBox.style.padding = '10px';
        stickyBox.style.backgroundColor = 'rgb(var(--color-foreground))';
        stickyBox.style.borderRadius = '4px';
        stickyBox.style.transition = 'height 0.5s, opacity 0.5s';
        stickyBox.style.overflow = 'hidden';
        stickyBox.style.zIndex = '1000';

        const header = document.createElement('h3');
        header.innerText = 'Shortcuts';
        header.style.fontSize = 'medium';
        header.style.marginTop = '5';
        stickyBox.appendChild(header);

        const linksContainer = document.createElement('div');
        stickyBox.appendChild(linksContainer);

        const addIcon = document.createElement('span');
        addIcon.innerText = '+';
        addIcon.style.position = 'absolute';
        addIcon.style.top = '5px';
        addIcon.style.right = '5px';
        addIcon.style.cursor = 'pointer';
        addIcon.style.fontWeight = 'bold';
        addIcon.onclick = function () {
            const isHidden = userInput.style.display === 'none';
            userInput.style.display = isHidden ? 'block' : 'none';
            shortcutNameInput.style.display = isHidden ? 'block' : 'none';
            validateButton.style.display = isHidden ? 'block' : 'none';
        };
        stickyBox.appendChild(addIcon);

        const toggleVisibilityIcon = document.createElement('i');
        toggleVisibilityIcon.className = 'fa fa-eye';
        toggleVisibilityIcon.style.cursor = 'pointer';
        toggleVisibilityIcon.style.position = 'absolute';
        toggleVisibilityIcon.style.top = '5px';
        toggleVisibilityIcon.style.left = '5px';
        toggleVisibilityIcon.style.fontSize = '14px';
        toggleVisibilityIcon.onclick = function () {
            if (stickyBox.style.height !== '25px') {
                stickyBox.style.width = '25px';
                stickyBox.style.height = '25px';
                linksContainer.style.display = 'none';
                header.style.display = 'none';
                addIcon.style.display = 'none';
                toggleVisibilityIcon.className = 'fa fa-eye-slash';
            } else {
                stickyBox.style.width = '200px';
                stickyBox.style.height = 'auto';
                linksContainer.style.display = 'block';
                header.style.display = 'block';
                addIcon.style.display = 'block';
                toggleVisibilityIcon.className = 'fa fa-eye';
            }
        };
        stickyBox.appendChild(toggleVisibilityIcon);

        function appendLinkToContainer(linkName, linkURL) {
            const linkElement = document.createElement('a');
            linkElement.href = linkURL;
            linkElement.innerText = linkName;
            linkElement.style.fontSize = 'smaller';
            linkElement.target = '_blank';
            linkElement.style.display = 'flex';
            linkElement.style.alignItems = 'center';
            linkElement.style.marginBottom = '5px';
            linkElement.style.color = 'var(--color-blue)';
            linkElement.style.textDecoration = 'none';

            linkElement.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(linkURL, '_blank');
            });

            const favicon = document.createElement('img');
            try {
                const urlObj = new URL(linkURL);
                favicon.src = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`;
            } catch {
                favicon.src = '';
            }
            favicon.style.marginRight = '5px';
            favicon.style.width = '16px';
            favicon.style.height = '16px';
            linkElement.prepend(favicon);

            const deleteIcon = document.createElement('span');
            deleteIcon.innerText = ' ×';
            deleteIcon.style.color = 'rgb(var(--color-blue))';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.marginLeft = 'auto';
            deleteIcon.onclick = function (event) {
                event.stopPropagation();
                linksContainer.removeChild(linkElement);
                const savedLinks = JSON.parse(localStorage.getItem('MioAniListShortcuts') || '[]');
                const updatedLinks = savedLinks.filter(l => l.url !== linkURL);
                localStorage.setItem('MioAniListShortcuts', JSON.stringify(updatedLinks));
            };
            linkElement.appendChild(deleteIcon);

            linksContainer.appendChild(linkElement);
        }

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = 'Enter your link';
        userInput.style.display = 'none';
        userInput.style.backgroundColor = 'rgb(var(--color-background))';
        userInput.style.color = 'rgb(var(--color-blue))';
        userInput.style.border = '1px solid var(--color-border)';
        userInput.style.borderRadius = '3px';
        userInput.style.padding = '5px';
        userInput.style.fontSize = 'smaller';
        userInput.style.marginTop = '5px';
        stickyBox.appendChild(userInput);

        const shortcutNameInput = document.createElement('input');
        shortcutNameInput.type = 'text';
        shortcutNameInput.placeholder = 'Name of the shortcut';
        shortcutNameInput.style.display = 'none';
        shortcutNameInput.style.backgroundColor = 'rgb(var(--color-background))';
        shortcutNameInput.style.color = 'rgb(var(--color-blue))';
        shortcutNameInput.style.border = '1px solid var(--color-border)';
        shortcutNameInput.style.borderRadius = '3px';
        shortcutNameInput.style.padding = '5px';
        shortcutNameInput.style.fontSize = 'smaller';
        shortcutNameInput.style.marginTop = '5px';
        stickyBox.appendChild(shortcutNameInput);

        const validateButton = document.createElement('button');
        validateButton.innerText = 'Add';
        validateButton.style.display = 'none';
        validateButton.style.backgroundColor = 'var(--color-button)';
        validateButton.style.color = 'var(--color-button-text)';
        validateButton.style.border = 'none';
        validateButton.style.borderRadius = '3px';
        validateButton.style.padding = '5px 10px';
        validateButton.style.fontSize = 'smaller';
        validateButton.style.marginTop = '5px';
        validateButton.style.cursor = 'pointer';
        validateButton.onclick = function () {
            const link = userInput.value.trim();
            const name = shortcutNameInput.value.trim();
            if (link && name) {
                const savedLinks = JSON.parse(localStorage.getItem('MioAniListShortcuts') || '[]');
                // Avoid duplicates
                if (!savedLinks.some(l => l.url === link)) {
                    savedLinks.push({ name, url: link });
                    localStorage.setItem('MioAniListShortcuts', JSON.stringify(savedLinks));

                    appendLinkToContainer(name, link);

                    userInput.value = '';
                    shortcutNameInput.value = '';
                    userInput.style.display = 'none';
                    shortcutNameInput.style.display = 'none';
                    validateButton.style.display = 'none';
                } else {
                    alert('This link already exists in your shortcuts.');
                }
            } else {
                alert('Please enter both name and URL.');
            }
        };
        stickyBox.appendChild(validateButton);

        // Load saved links
        const savedLinks = JSON.parse(localStorage.getItem('MioAniListShortcuts') || '[]');
        for (const linkObj of savedLinks) {
            appendLinkToContainer(linkObj.name, linkObj.url);
        }

        document.body.appendChild(stickyBox);
    }

    // Function to add AniCalendar by KangieDanie link in Activity History 
    // https://anilist.co/forum/thread/63096
    function addAniCalendarLink() {
        // Prevent adding multiple links
        if (document.querySelector('.ani-calendar-link')) return;

        let attempts = 0;
        const maxAttempts = 10; // 20 seconds max
        const interval = setInterval(() => {
            const headers = document.querySelectorAll('h2.section-header');
            let activityHistoryHeader = null;

            headers.forEach(header => {
                if (header.textContent.trim() === 'Activity History') {
                    activityHistoryHeader = header;
                }
            });

            if (activityHistoryHeader) {
                // Prevent adding multiple links
                if (activityHistoryHeader.querySelector('.ani-calendar-link')) {
                    clearInterval(interval);
                    return;
                }

                const aniCalendarContainer = document.createElement('span');
                aniCalendarContainer.classList.add('ani-calendar-link');
                aniCalendarContainer.style.float = 'right';
                aniCalendarContainer.style.display = 'flex';
                aniCalendarContainer.style.alignItems = 'center';

                const aniCalendarLink = document.createElement('a');
                aniCalendarLink.href = 'https://ani-calendar.vercel.app/';
                aniCalendarLink.target = '_blank';
                aniCalendarLink.rel = 'noopener noreferrer';
                aniCalendarLink.textContent = 'AniCalendar';
                aniCalendarLink.style.fontSize = 'smaller';
                aniCalendarLink.style.marginLeft = '10px';
                aniCalendarLink.style.color = 'var(--color-blue)';
                aniCalendarLink.style.display = 'flex';
                aniCalendarLink.style.alignItems = 'center';
                aniCalendarLink.style.textDecoration = 'none';

                const calendarIcon = document.createElement('i');
                calendarIcon.className = 'fa fa-calendar';
                calendarIcon.style.marginRight = '5px';

                aniCalendarLink.prepend(calendarIcon);

                aniCalendarContainer.appendChild(aniCalendarLink);
                activityHistoryHeader.appendChild(aniCalendarContainer);

                clearInterval(interval);
                console.log('AniCalendar link added to Activity History.');
            } else {
                attempts++;
                console.log(`Activity History section header not found. Attempt ${attempts}/${maxAttempts}. Retrying in 2 seconds...`);
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.warn('Failed to find Activity History section header after multiple attempts.');
                }
            }
        }, 2000);
    }

    // Function to add AniTools link in Social tab
    function addAniToolsLink() {
        const socialFilterGroup = document.querySelector('div.filter-group');
        if (socialFilterGroup) {
            // Prevent adding multiple links
            if (socialFilterGroup.querySelector('.ani-tools-link')) return;

            const aniToolsLink = document.createElement('a');
            aniToolsLink.href = 'https://anitools.koopz.rocks/';
            aniToolsLink.target = '_blank';
            aniToolsLink.rel = 'noopener noreferrer';
            aniToolsLink.textContent = 'AniTools';
            aniToolsLink.style.color = 'var(--color-blue)';
            aniToolsLink.style.display = 'flex';
            aniToolsLink.style.alignItems = 'center';
            aniToolsLink.style.textDecoration = 'none';

            const wrenchIcon = document.createElement('i');
            wrenchIcon.className = 'fa fa-tools';
            wrenchIcon.style.marginRight = '5px';

            aniToolsLink.prepend(wrenchIcon);

            const aniToolsContainer = document.createElement('span');
            aniToolsContainer.classList.add('ani-tools-link');
            aniToolsContainer.appendChild(aniToolsLink);
            socialFilterGroup.appendChild(aniToolsContainer);
        } else {
            console.log('Social filter group not found.');
        }
    }

    // Function to initialize features based on current URL
    function initializeFeatures() {
        const url = window.location.href;

        // Check if the page is an AniList user profile
        if (url.includes('/user/') && !url.includes('/social')) {
            addAniCalendarLink();
        }

        // Check if the page is the social tab of an AniList user profile
        if (url.includes('/user/') && url.includes('/social')) {
            addAniToolsLink();
        }

        // Check if the page is an AniList forum thread comment
        if (url.includes('/forum/thread/') && url.includes('/comment/')) {
            createStickyBoxLink();
        } else {
            const existingStickyBox = document.querySelector('.sticky-box');
            if (existingStickyBox) {
                existingStickyBox.remove();
            }
        }
    }

    // Function to handle URL changes
    function onUrlChange(callback) {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback();
            }
        });

        observer.observe(document, { subtree: true, childList: true });

        window.addEventListener('popstate', () => {
            callback();
        });

        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function () {
            pushState.apply(history, arguments);
            callback();
        };

        history.replaceState = function () {
            replaceState.apply(history, arguments);
            callback();
        };
    }

    // Initialize features on initial load
    window.addEventListener('load', () => {
        setTimeout(() => {
            initializeFeatures();
        }, 1000);
    });

    // Initialize features on URL changes
    onUrlChange(() => {
        setTimeout(() => {
            initializeFeatures();
        }, 1000);
    });

})();
