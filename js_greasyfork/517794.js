// ==UserScript==
// @name         Imgur Upload Posts Grid Layout
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Arrange Imgur upload posts in a grid layout.
// @author       Byakuran
// @match        https://imgur.com/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517794/Imgur%20Upload%20Posts%20Grid%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/517794/Imgur%20Upload%20Posts%20Grid%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Toggle button styles */
        #gridLayoutToggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background: #1bb76e;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        #gridLayoutToggle:hover {
            background: #159157;
        }

        /* Grid layout styles */
        .has-min-posts .UploadPost {
            width: auto !important;
            margin-left: 20px !important;
        }
        .has-min-posts .Upload-container > :nth-child(2):not(.UploadPost) {
            margin-right: 40px !important;
        }
        .has-min-posts .UploadPost-files > .PostContent.UploadPost-file {
            flex: 0 0 auto;
            width: calc(33.33% - 10px);
            min-width: 200px;
            margin: 0 !important;
        }
        .has-min-posts .UploadPost-files {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
        }
        .has-min-posts .UploadPost-files > :first-child:not(.PostContent.UploadPost-file),
        .has-min-posts .UploadPost-files > :last-child:not(.PostContent.UploadPost-file) {
            width: 100% !important;
            flex: none !important;
        }
        .ImageDescription {
            max-height: 2.4em;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: max-height 0.3s ease-out;
            padding-right: 25px;
        }
        .ImageDescription.expanded {
            max-height: 1000px;
        }
        .ImageDescription::after {
            content: "▼";
            position: absolute;
            bottom: 0;
            right: 0;
            background: linear-gradient(90deg, transparent, #1a3c6e 20%);
            padding: 0 5px;
            color: white;
        }
        .ImageDescription.expanded::after {
            content: "▲";
            background: linear-gradient(90deg, transparent, #1a3c6e 20%);
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'gridLayoutToggle';
    toggleButton.textContent = 'Disable Grid Layout';
    document.body.appendChild(toggleButton);

    // Get layout preference from localStorage
    let isGridEnabled = localStorage.getItem('imgurGridLayout') !== 'disabled';

    // Function to reset grid application state
    function resetGridState() {
        const containers = document.querySelectorAll('.UploadPost-files');
        containers.forEach(container => {
            container.removeAttribute('data-grid-applied');
        });
    }

    // Update button text and layout based on current state
    function updateLayoutState() {
        toggleButton.textContent = isGridEnabled ? 'Disable Grid Layout' : 'Enable Grid Layout';
        document.body.classList.remove('has-min-posts');
        resetGridState();
        if (isGridEnabled) {
            applyChanges();
        }
    }

    // Toggle button click handler
    toggleButton.addEventListener('click', () => {
        isGridEnabled = !isGridEnabled;
        localStorage.setItem('imgurGridLayout', isGridEnabled ? 'enabled' : 'disabled');
        updateLayoutState();
    });

    function makeDescriptionsExpandable() {
        const descriptions = document.querySelectorAll('.ImageDescription:not([data-expandable])');
        descriptions.forEach(desc => {
            desc.setAttribute('data-expandable', 'true');
            desc.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        });
    }

    // Function to apply layout and make descriptions expandable
    function applyChanges() {
        if (!isGridEnabled) return;

        const containers = document.querySelectorAll('.UploadPost-files');
        containers.forEach(container => {
            if (!container.dataset.gridApplied) {
                const posts = container.querySelectorAll(':scope > .PostContent.UploadPost-file');
                if (posts.length >= 3) {
                    container.dataset.gridApplied = 'true';
                    document.body.classList.add('has-min-posts');
                }
            }
        });
        makeDescriptionsExpandable();
    }

    // Initial application
    updateLayoutState();

    // Monitor for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyChanges();
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();