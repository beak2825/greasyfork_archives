// ==UserScript==
// @name        Claude Project Delete Button
// @namespace   Violentmonkey Scripts
// @match       https://claude.ai/project/*
// @grant       none
// @version     1.0
// @author      Elias Benbourenane
// @description Add a delete button to Claude projects
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539259/Claude%20Project%20Delete%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539259/Claude%20Project%20Delete%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getProjectId() {
        const path = window.location.pathname;
        const match = path.match(/\/project\/([^\/]+)/);
        return match ? match[1] : null;
    }

    function getOrgId() {
        return window.intercomSettings?.lastActiveOrgUUID;
    }

    function createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.className = `inline-flex
            items-center
            justify-center
            relative
            shrink-0
            can-focus
            select-none
            disabled:pointer-events-none
            disabled:opacity-50
            disabled:shadow-none
            disabled:drop-shadow-none
            text-text-300
            border-transparent
            transition
            font-styrene
            duration-300
            ease-[cubic-bezier(0.165,0.85,0.45,1)]
            hover:bg-bg-400
            aria-pressed:bg-bg-400
            aria-checked:bg-bg-400
            aria-expanded:bg-bg-300
            hover:text-text-100
            aria-pressed:text-text-100
            aria-checked:text-text-100
            aria-expanded:text-text-100
            h-8 w-8 rounded-md active:scale-95`.replace(/\s+/g, ' ');

        deleteButton.type = 'button';
        deleteButton.title = 'Delete Project';

        // Trash icon SVG
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" class="-translate-y-[0.5px]">
                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
            </svg>
        `;

        deleteButton.addEventListener('click', handleDeleteClick);

        return deleteButton;
    }

    async function handleDeleteClick(event) {
        event.preventDefault();

        const projectId = getProjectId();
        const orgId = getOrgId();

        if (!projectId || !orgId) {
            alert('Unable to determine project or organization ID');
            return;
        }

        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`https://claude.ai/api/organizations/${orgId}/projects/${projectId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Project deleted successfully');
                window.location.href = 'https://claude.ai/';
            } else {
                throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    }

    function addDeleteButton() {
        // Look for the container with the star and menu buttons
        const buttonContainer = document.querySelector('.flex.items-center.gap-1.ml-auto');

        if (buttonContainer && !buttonContainer.querySelector('[title="Delete Project"]')) {
            const deleteButton = createDeleteButton();

            // Insert the delete button before the menu button (last button)
            const menuButton = buttonContainer.lastElementChild;
            buttonContainer.insertBefore(deleteButton, menuButton);
        }
    }

    let currentUrl = window.location.href;

    function isProjectPage() {
        return window.location.pathname.startsWith('/project/');
    }

    function handleUrlChange() {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
            currentUrl = newUrl;

            if (isProjectPage()) {
                // Delay to allow page content to load
                setTimeout(addDeleteButton, 500);
                setTimeout(addDeleteButton, 1500);
                setTimeout(addDeleteButton, 3000);
            }
        }
    }

    // Override history methods to detect programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(handleUrlChange, 0);
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(handleUrlChange, 0);
    };

    function init() {
        if (isProjectPage()) {
            // Try to add the button immediately
            addDeleteButton();

            // Also try after delays in case the page is still loading
            setTimeout(addDeleteButton, 500);
            setTimeout(addDeleteButton, 1500);
            setTimeout(addDeleteButton, 3000);
        }

        // Set up a mutation observer to handle dynamic content loading
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Only try to add button if we're on a project page
                    if (isProjectPage()) {
                        addDeleteButton();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Listen for browser back/forward navigation
        window.addEventListener('popstate', handleUrlChange);

        // Periodic check to ensure button is present (fallback)
        setInterval(() => {
            if (isProjectPage()) {
                addDeleteButton();
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();