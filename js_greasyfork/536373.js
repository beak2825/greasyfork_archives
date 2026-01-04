// ==UserScript==
// @name         YouTube Vertical Toggle Videos/Comments
// @namespace    YoutubeVerticalToggle
// @version      1.2
// @description  Toggle between "Videos" and "comments" sections on YouTube when screen width less than 1000px, is useful when on a Vertical Screen
// @author       Nate2898
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/en/users/1083698
// @downloadURL https://update.greasyfork.org/scripts/536373/YouTube%20Vertical%20Toggle%20VideosComments.user.js
// @updateURL https://update.greasyfork.org/scripts/536373/YouTube%20Vertical%20Toggle%20VideosComments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS shell; actual show/hide is managed via JS to react to resizes
    const style = document.createElement('style');
    document.head.appendChild(style);

    // Keys for saving default preference
    const STATE_KEY = 'ytToggleState'; // stores last-used when user toggles main switch (optional)
    const DEFAULT_KEY = 'ytDefaultSection'; // stores user's chosen default: 'videos' or 'comments'

    // Initialize default if missing
    try {
        if (!localStorage.getItem(DEFAULT_KEY)) localStorage.setItem(DEFAULT_KEY, 'videos');
    } catch {}

    // Save the toggle state (videos or comments) when the main slider is used
    function saveState(isComments) {
        try {
            localStorage.setItem(STATE_KEY, isComments ? 'comments' : 'videos');
        } catch {}
    }

    // Load the previously saved toggle state
    function loadState() {
        try {
            return localStorage.getItem(STATE_KEY);
        } catch {
            return null;
        }
    }

    // Get/set default preferred section
    function getDefault() {
        try { return localStorage.getItem(DEFAULT_KEY) || 'videos'; } catch { return 'videos'; }
    }
    function setDefault(val) {
        try { localStorage.setItem(DEFAULT_KEY, val); } catch {}
    }

    // Show both videos and comments sections
    function showBoth() {
        ['#related', '#comments'].forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = '';
        });
    }

    // Apply the saved toggle state to show either comments or videos
    function applyState() {
        // Use the user's chosen default as the authoritative initial state.
        const state = getDefault();
        const videos = document.querySelector('#related');
        const comments = document.querySelector('#comments');
        const toggle = document.querySelector('#toggle-videos-comments-container input[type=checkbox].main-toggle');
        if (!videos || !comments || !toggle) return;
        const showComments = (state === 'comments');
        videos.style.display = showComments ? 'none' : '';
        comments.style.display = showComments ? '' : 'none';
        toggle.checked = showComments;
        toggle.dispatchEvent(new Event('change'));
    }

    // Track viewport to show/hide the toggle and sections when crossing 1000px
    const viewportQuery = window.matchMedia('(max-width: 1000px)');

    // Create the toggle button UI and checkbox
    function createToggleButton() {
        if (document.querySelector('#toggle-videos-comments-container')) return;

        const container = document.createElement('div');
        container.id = 'toggle-videos-comments-container';
        Object.assign(container.style, {
            flexDirection: 'row',
            alignItems: 'center',
            margin: '5px 0',
            justifyContent: 'center',
            gap: '10px'
        });

        // Add "Default" button to set preferred main section
        const defaultButton = document.createElement('button');
        defaultButton.type = 'button';
        defaultButton.title = 'Set default section to be displayed on page load and reload';
        Object.assign(defaultButton.style, {
            padding: '6px 10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#333',
            color: '#fff',
            fontSize: '13px'
        });
        // initialize label and visual state
        function updateDefaultButtonLabel() {
            const def = getDefault();
            defaultButton.textContent = 'Default: ' + (def === 'comments' ? 'Comments' : 'Videos');
            // visually indicate which default is active
            if (def === 'comments') {
                defaultButton.style.background = '#2196F3';
            } else {
                defaultButton.style.background = '#fc0703';
            }
        }
        defaultButton.addEventListener('click', () => {
            // toggle default (persist only). Do NOT immediately apply — user requested it apply on reload/new load only.
            const newDef = getDefault() === 'comments' ? 'videos' : 'comments';
            setDefault(newDef);
            updateDefaultButtonLabel();
        });

        // Add label text next to the toggle
        const label = document.createElement('div');
        label.textContent = 'Videos/Comments';
        Object.assign(label.style, {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FFF'
        });

        // Create the toggle switch
        const sliderLabel = document.createElement('label');
        Object.assign(sliderLabel.style, {
            position: 'relative',
            display: 'inline-block',
            width: '60px',
            height: '20px'
        });

        const input = document.createElement('input');
        input.classList.add('main-toggle');
        input.type = 'checkbox';
        input.style.opacity = '0';
        input.style.width = '0';
        input.style.height = '0';
        input.addEventListener('change', () => {
            const videos = document.querySelector('#related');
            const comments = document.querySelector('#comments');
            if (!videos || !comments) return;
            if (input.checked) {
                videos.style.display = 'none';
                comments.style.display = '';
                saveState(true);
            } else {
                videos.style.display = '';
                comments.style.display = 'none';
                saveState(false);
            }
        });

        // Style the toggle track and thumb
        const track = document.createElement('span');
        Object.assign(track.style, {
            position: 'absolute',
            cursor: 'pointer',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: '#fc0703', //Video slider color
            transition: '0.4s',
            borderRadius: '20px'
        });

        const thumb = document.createElement('span');
        Object.assign(thumb.style, {
            position: 'absolute',
            height: '15px',
            width: '15px',
            left: '4px',
            bottom: '3px',
            backgroundColor: '#FFF', // Slider dot color
            transition: '0.4s',
            borderRadius: '50%'
        });

        // Update appearance when toggle changes
        input.addEventListener('change', () => {
            if (input.checked) {
                track.style.backgroundColor = '#2196F3';  //Comments slider color
                thumb.style.transform = 'translateX(36px)';
            } else {
                track.style.backgroundColor = '#fc0703';  //Video slider color
                thumb.style.transform = 'translateX(0)';
            }
        });

        track.appendChild(thumb);
        sliderLabel.appendChild(input);
        sliderLabel.appendChild(track);

    // Append all elements to the container
    updateDefaultButtonLabel();
    container.appendChild(defaultButton);
    container.appendChild(label);
    container.appendChild(sliderLabel);

        // Insert the toggle below the main video content
        const above = document.querySelector('#above-the-fold');
        if (above) above.insertAdjacentElement('afterend', container);

        // Immediately align visibility with current viewport on creation
        updateVisibilityForViewport();
    }

    function updateVisibilityForViewport() {
        const container = document.querySelector('#toggle-videos-comments-container');
        const isSmall = viewportQuery.matches;
        if (!container) return;

        if (isSmall) {
            container.style.display = 'flex';
            applyState();
        } else {
            container.style.display = 'none';
            showBoth();
        }
    }

    // Observe for page changes and create toggle accordingly
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            handleUrlChange();
        }
        createToggleButton();
    });

    // Clean up and reset when navigating
    function handleUrlChange() {
        const old = document.querySelector('#toggle-videos-comments-container');
        if (old) old.remove();
        showBoth();
        createToggleButton();
    }

    observer.observe(document.body, { childList: true, subtree: true });

    // Re-apply state and toggle visibility on resize across the 1000px boundary
    // React to live resizes: show/hide toggle and re-apply appropriate section visibility
    viewportQuery.addEventListener('change', () => updateVisibilityForViewport());
})();
