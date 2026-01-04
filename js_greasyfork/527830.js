// ==UserScript==
// @name        Hide Spoiler/NSFW Titles on Reddit
// @namespace   https://greasyfork.org/en/users/1438773-thezealot
// @version     2.0.2
// @description Hides titles of posts marked as spoilers and/or NSFW on Reddit. Includes a toggle button to show/hide titles, and settings to 1). choose between blur and censor bar styles and 2). hide spoiler and/or NSFW titles. Settings are persistent across sessions. Script mostly made using AI.
// @author      TheZealot
// @license     MIT
// @icon        https://cdn-icons-png.flaticon.com/512/11695/11695651.png
// @supportURL  https://greasyfork.org/en/users/1438773-thezealot
// @include     https://www.reddit.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/527830/Hide%20SpoilerNSFW%20Titles%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/527830/Hide%20SpoilerNSFW%20Titles%20on%20Reddit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    
    // Cached DOM selectors for better performance
    const SELECTORS = {
        POST: 'shreddit-post[spoiler], shreddit-post[nsfw]',
        POST_TITLE: '[id^="post-title-t3_"]',
        SEARCH_POST: 'div[data-testid="search-post-unit"]',
        SEARCH_TITLE: 'a[data-testid="post-title-text"]',
        SPOILER_MARKER: '.text-category-spoiler',
        NSFW_MARKER: '.text-category-nsfw',
        RELATED_POSTS: 'ul.list-none.p-0.m-0 li',
        RELATED_TITLE: '.i18n-list-item-post-title',
        HEADER: [
            '.items-center.flex.h-header-large',
            'header',
            'div[data-testid="header-container"]'
        ]
    };

    // Icons for the toggle button
    const ICONS = {
        ON: 'https://cdn-icons-png.flaticon.com/512/11860/11860394.png',
        OFF: 'https://cdn-icons-png.flaticon.com/512/11860/11860256.png'
    };

    // Classes for styling
    const CLASSES = {
        BLUR: 'btr-blurred',
        CENSOR: 'btr-censor-bar',
        BUTTON: 'btr-toggle-btn',
        MODAL: 'btr-settings-modal',
        NO_TRANSITION: 'btr-no-transition',
        BACKDROP: 'btr-modal-backdrop' // Added class for modal backdrop
    };

    // ==================== STATE MANAGEMENT ====================
    
    // Retrieve last saved settings from GM_getValue (persistent across page loads)
    let state = {
        coverEnabled: GM_getValue('coverEnabled', true),
        useBlurMode: GM_getValue('useBlurMode', true),
        hideSpoilers: GM_getValue('hideSpoilers', true),
        hideNsfw: GM_getValue('hideNsfw', false),
        isStyleTransitionDisabled: false,
        blurIntensity: GM_getValue('blurIntensity', 4), // Added setting for blur intensity
		lastSettingsUpdate: Date.now() // Track when settings were last changed
    };
	
	function updateFilterSettings(newSpoilerSetting, newNsfwSetting) {
		const previousSpoilerSetting = state.hideSpoilers;
		const previousNsfwSetting = state.hideNsfw;
		
		state.hideSpoilers = newSpoilerSetting;
		state.hideNsfw = newNsfwSetting;
		state.lastSettingsUpdate = Date.now();
		GM_setValue('hideSpoilers', state.hideSpoilers);
		GM_setValue('hideNsfw', state.hideNsfw);
		
		// Force removal of concealment if either setting was turned off
		if (previousSpoilerSetting && !newSpoilerSetting) {
			removeSpoilerConcealment();
		}
		
		if (previousNsfwSetting && !newNsfwSetting) {
			removeNsfwConcealment();
		}
		
		// If both settings are now disabled, do an additional cleanup
		if (!newSpoilerSetting && !newNsfwSetting) {
			// Extra thorough removal of all concealment classes from any element
			document.querySelectorAll(`.${CLASSES.BLUR}, .${CLASSES.CENSOR}`).forEach(el => {
				el.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
			});
		}
		
		// Update UI
		updateToggleButton();
		updateSpoilerTitles();
	}

    // Cache for DOM elements
    let cache = {
        button: null,
        modal: null,
        styleElement: null,
        postFeed: null,
        sidebar: null,
        searchResults: null,
        modalBackdrop: null // Added cache for modal backdrop
    };

    // ==================== UI SETUP ====================
    
    /**
     * Injects all CSS styles at once for better performance
     */
	function setupStyles() {
		const style = document.createElement('style');
		style.textContent = `
			:root {
				--btr-censor-bar-color: black; /* Default color for censor bar in light mode */
				--btr-primary-color: #ff4500; /* Reddit's primary orange color */
				--btr-primary-hover: #ff6a33; /* Lighter shade for hover state */
				--btr-primary-active: #cc3700; /* Darker shade for active state */
				--btr-blur-intensity: ${state.blurIntensity}px; /* Configurable blur intensity */
			}

			/* Apply effects only to spoiler and NSFW titles */
			shreddit-post[spoiler] [id^="post-title-t3_"],
			shreddit-post[nsfw] [id^="post-title-t3_"],
			.text-category-spoiler + h3,
			.text-category-spoiler + a,
			.text-category-nsfw + h3,
			.text-category-nsfw + a,
			div[data-testid="search-post-unit"] a[data-testid="post-title-text"] {
				transition: filter 0.3s ease, opacity 0.3s ease;
				position: relative;
				white-space: normal !important;
				overflow-wrap: anywhere !important;
				display: inline !important;
				will-change: filter, opacity; /* GPU optimization hint */
			}

			/* Disable transitions when switching styles in settings */
			.${CLASSES.NO_TRANSITION} {
				transition: none !important;
			}

			/* Blur effect for spoiler and NSFW titles */
			.${CLASSES.BLUR} {
				filter: blur(var(--btr-blur-intensity)) !important;
				white-space: normal !important;
				overflow-wrap: anywhere !important;
			}

			/* Blur hover effect - apply only to the element being hovered */
			.${CLASSES.BLUR}:hover {
				filter: none !important;
				transition: filter 0.3s ease !important;
			}

			/* Censor bar effect for spoiler and NSFW titles */
			.${CLASSES.CENSOR} {
				display: inline !important;
				width: 100% !important;
				position: relative;
				white-space: normal !important;
				overflow-wrap: anywhere !important;
				background-color: var(--btr-censor-bar-color) !important;
				color: transparent !important;
				transition: background-color 0.3s ease, color 0.3s ease !important;
			}

			/* Censor bar hover effect */
			.${CLASSES.CENSOR}:hover {
				background-color: transparent !important;
				color: inherit !important;
			}

			/* Censor bar hover effect removal */
			.${CLASSES.CENSOR}::after {
				display: none;
			}

			/* Fix for search results - remove parent hover detection, only apply to direct hover */
			div[data-testid="search-post-unit"] a[data-testid="post-title-text"].${CLASSES.BLUR}:hover,
			div[data-testid="search-post-unit"] a[data-testid="post-title-text"].${CLASSES.CENSOR}:hover::after {
				pointer-events: auto !important;
			}
			
			/* Remove the parent hover triggering - only direct hover should work */
			div[data-testid="search-post-unit"]:hover a[data-testid="post-title-text"].${CLASSES.BLUR}:not(:hover) {
				filter: blur(var(--btr-blur-intensity)) !important;
			}
			
			div[data-testid="search-post-unit"]:hover a[data-testid="post-title-text"].${CLASSES.CENSOR}:not(:hover)::after {
				opacity: 1 !important;
			}

			/* Toggle button styles with enhanced hover and active states */
			.${CLASSES.BUTTON} {
				position: relative;
				cursor: pointer;
				margin-left: 8px;
				z-index: 1000;
				width: 36px;
				height: 36px;
				display: flex;
				justify-content: center;
				align-items: center;
				background-size: 75%;
				background-repeat: no-repeat;
				background-position: center;
				border: none;
				border-radius: 50%;
				background-color: var(--btr-primary-color);
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: all 0.2s ease;
				will-change: transform, background-color, box-shadow;
			}
			
			/* Enhanced hover state */
			.${CLASSES.BUTTON}:not(:disabled):hover {
				background-color: var(--btr-primary-hover);
				transform: translateY(-2px);
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
			}
			
			/* Enhanced active/pressed state */
			.${CLASSES.BUTTON}:not(:disabled):active {
				background-color: var(--btr-primary-active);
				transform: translateY(1px) scale(0.95);
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
			}
			
			/* Disabled state */
			.${CLASSES.BUTTON}:disabled {
				background-color: #3D494E;
				opacity: 0.7;
				cursor: not-allowed;
			}

			/* Modal backdrop */
			.${CLASSES.BACKDROP} {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				z-index: 1999;
				opacity: 0;
				transition: opacity 0.3s ease;
				backdrop-filter: blur(2px);
				display: none;
				pointer-events: none;
			}
			
			.${CLASSES.BACKDROP}.active {
				opacity: 1;
				display: block;
				pointer-events: auto;
			}

			/* Settings modal styles with improved animation */
			.${CLASSES.MODAL} {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%) scale(0.9);
				background: white;
				padding: 20px;
				border-radius: 12px;
				box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
				z-index: 2000;
				display: none;
				min-width: 340px;
				text-align: center;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
				opacity: 0;
				transition: transform 0.3s ease, opacity 0.3s ease;
			}
			
			.${CLASSES.MODAL}.active {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}

			/* Dark mode support for modal */
			:root.theme-dark .${CLASSES.MODAL} {
				background: #1a1a1b;
				color: #d7dadc;
				border: 1px solid #343536;
			}

			.${CLASSES.MODAL} h3 {
				font-size: 20px;
				font-weight: bold;
				color: var(--btr-primary-color);
				margin-bottom: 10px;
			}

			.btr-settings-container {
				display: flex;
				justify-content: space-between;
				column-gap: 12px;
				margin: 0 auto;
				max-width: 300px;
			}

			.btr-settings-column {
				display: flex;
				flex-direction: column;
				gap: 10px;
				text-align: left;
			}

			.btr-settings-column h4 {
				font-size: 16px;
				font-weight: bold;
				color: #444;
				text-decoration: underline;
				margin-bottom: 6px;
			}

			:root.theme-dark .btr-settings-column h4 {
				color: #d7dadc;
			}

			.${CLASSES.MODAL} label {
				font-size: 14px;
				display: flex;
				align-items: center;
				gap: 8px;
				color: #666;
				margin: 4px 0;
			}

			:root.theme-dark .${CLASSES.MODAL} label {
				color: #c5c6c7;
			}
			
			/* Improved slider styles */
			.btr-range-slider {
				width: 100%;
				margin: 8px 0;
				display: flex;
				flex-direction: column;
			}
			
			.btr-range-slider label {
				margin-bottom: 5px;
			}
			
			.btr-range-slider-value {
				margin-top: 5px;
				text-align: center;
				font-weight: bold;
				color: var(--btr-primary-color);
			}
			
			/* Firefox-specific fix for settings modal UI */
			@-moz-document url-prefix() {
				/* Make the columns perfectly equal and aligned */
				.btr-settings-container {
					display: flex;
					justify-content: space-between;
					width: 100%;
					max-width: 300px;
					margin: 0 auto;
				}
				
				/* Ensure consistent column widths */
				.btr-settings-column {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					padding: 0 5px;
					min-height: 160px;
				}
				
				/* Center the column headings */
				.btr-settings-column h4 {
					text-align: left;
					width: 100%;
					margin: 0 0 10px 0;
				}
				
				/* Align radio buttons and checkboxes */
				.btr-option {
					display: flex;
					align-items: center;
					width: 100%;
					margin: 4px 0;
				}
				
				/* Create a consistent container for inputs */
				.btr-input-wrapper {
					display: inline-block;
					width: 16px;
					height: 16px;
					flex-shrink: 0;
					position: relative;
					margin-right: 8px;
				}
				
				/* Position the actual input elements */
				.btr-input-wrapper input[type="radio"],
				.btr-input-wrapper input[type="checkbox"] {
					position: absolute;
					left: 0;
					top: 0;
					margin: 0;
					padding: 0;
				}
				
				/* Ensure label text is aligned */
				.btr-label-text {
					display: inline-block;
					vertical-align: middle;
					line-height: 16px;
				}
				
				/* Consistent slider spacing */
				.btr-range-slider {
					width: 100%;
					margin: 15px 0;
				}
				
				/* Maintain consistent spacing when blur intensity is hidden */
				.btr-range-slider[style*="display: none"] {
					display: block !important;
					visibility: hidden;
					pointer-events: none;
					height: 0;
					margin: 0;
					padding: 0;
				}
				
				/* Fix specific slider elements */
				#btr-blur-intensity {
					width: 100%;
					margin: 8px 0;
				}
			}
			
			/* Improved buttons */
			.btr-button {
				background-color: var(--btr-primary-color);
				color: white;
				border: none;
				padding: 8px 16px;
				cursor: pointer;
				border-radius: 5px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				font-weight: bold;
				transition: background-color 0.2s ease, transform 0.2s ease;
			}

			.btr-button:hover {
				background-color: var(--btr-primary-hover);
				transform: translateY(-1px);
			}

			.btr-button:active {
				background-color: var(--btr-primary-active);
				transform: translateY(1px);
			}
			
			.btr-buttons-container {
				margin-top: 20px;
				display: flex;
				justify-content: center;
				gap: 10px;
			}
			
			/* Reset button style */
			.btr-reset-btn {
				background-color: #666;
			}
			
			.btr-reset-btn:hover {
				background-color: #777;
			}
			
			.btr-reset-btn:active {
				background-color: #555;
			}
		`;
		document.head.appendChild(style);
		cache.styleElement = style;
	}

    /**
     * Updates the censor bar color to match Reddit's theme (light/dark mode)
     */
    function updateCensorBarColor() {
        const isDarkMode = document.documentElement.classList.contains('theme-dark');
        const censorbarColor = isDarkMode ? 'white' : 'black';
        document.documentElement.style.setProperty('--btr-censor-bar-color', censorbarColor);
    }

    /**
     * Creates or updates the toggle button in Reddit's header
     */
	function setupToggleButton() {
		// Check if button already exists in DOM
		const existingButton = document.querySelector(`.${CLASSES.BUTTON}`);
		if (existingButton) {
			cache.button = existingButton;
			updateToggleButton();
			return;
		}

		// Create new button
		cache.button = document.createElement('button');
		cache.button.classList.add(CLASSES.BUTTON);
		cache.button.setAttribute('aria-label', 'Toggle Spoiler/NSFW Title Hiding');
		cache.button.style.backgroundImage = `url('${state.coverEnabled ? ICONS.ON : ICONS.OFF}')`;
		
		// Add click event listener
		cache.button.addEventListener('click', function() {
			// Only toggle if at least one filter is enabled
			const atLeastOneFilterEnabled = state.hideSpoilers || state.hideNsfw;
			if (atLeastOneFilterEnabled) {
				state.coverEnabled = !state.coverEnabled;
				GM_setValue('coverEnabled', state.coverEnabled);
				
				// Add a subtle animation effect when toggling
				this.style.transform = 'scale(0.8)';
				setTimeout(() => {
					this.style.transform = '';
					updateToggleButton();
					updateSpoilerTitles();
				}, 150);
			} else {
				// Provide visual feedback that click does nothing when filters are disabled
				this.style.transform = 'scale(0.95)';
				setTimeout(() => {
					this.style.transform = '';
				}, 100);
			}
		});
		
		// Add right-click event listener for settings
		cache.button.addEventListener('contextmenu', function(e) {
			e.preventDefault(); // Prevent context menu
			showModal();
			return false;
		});

		// Try to insert button in header
		let headerFound = false;
		for (const selector of SELECTORS.HEADER) {
			const headerContainer = document.querySelector(selector);
			if (headerContainer) {
				headerContainer.appendChild(cache.button);
				headerFound = true;
				break;
			}
		}

		// Fallback if header not found
		if (!headerFound) {
			console.warn('Header container not found. Creating floating button.');
			cache.button.style.position = 'fixed';
			cache.button.style.bottom = '20px';
			cache.button.style.right = '20px';
			cache.button.style.zIndex = '9999';
			document.body.appendChild(cache.button);
		}

		updateToggleButton();
	}

    /**
     * Updates the toggle button's appearance and tooltip based on current settings
     */
    /**
	 * Updates the toggle button's appearance and tooltip based on current settings
	 */
	function updateToggleButton() {
		if (!cache.button) return;

		// Check if at least one filter is enabled
		const atLeastOneFilterEnabled = state.hideSpoilers || state.hideNsfw;

		// Update button's appearance and functionality
		if (atLeastOneFilterEnabled) {
			cache.button.disabled = false;
			cache.button.style.backgroundColor = 'var(--btr-primary-color)';
			cache.button.style.opacity = '1';
			
			// Update tooltip based on the state of the checkboxes
			if (state.hideSpoilers && !state.hideNsfw) {
				cache.button.title = state.coverEnabled ? 'Show Spoilers' : 'Hide Spoilers';
			} else if (!state.hideSpoilers && state.hideNsfw) {
				cache.button.title = state.coverEnabled ? 'Show NSFW' : 'Hide NSFW';
			} else if (state.hideSpoilers && state.hideNsfw) {
				cache.button.title = state.coverEnabled ? 'Show Spoilers/NSFW' : 'Hide Spoilers/NSFW';
			}
		} else {
			// Instead of disabling the button, we'll just make left-click do nothing
			cache.button.disabled = false; // Keep it enabled for right-click
			cache.button.style.backgroundColor = '#666'; // A more interactive gray color
			cache.button.title = 'No filters selected (Right-click for settings)';
			cache.button.style.opacity = '0.8'; // Slightly more visible than before
		}

		// Update button icon
		cache.button.style.backgroundImage = `url('${state.coverEnabled ? ICONS.ON : ICONS.OFF}')`;
	}

    /**
     * Creates settings modal with improved UI and functionality
     */
    function createSettingsModal() {
        if (document.querySelector(`.${CLASSES.MODAL}`)) return;

        // Create modal backdrop (initially hidden)
        const backdrop = document.createElement('div');
        backdrop.classList.add(CLASSES.BACKDROP);
        backdrop.addEventListener('click', hideModal);
        backdrop.style.display = 'none'; // Initially hidden
        document.body.appendChild(backdrop);
        cache.modalBackdrop = backdrop;

        // Create modal
        const modal = document.createElement('div');
        modal.classList.add(CLASSES.MODAL);
        modal.innerHTML = `
            <h3>Reddit Spoiler/NSFW Title Settings</h3>
            <div class="btr-settings-container">
                <div class="btr-settings-column">
                    <h4>Style</h4>
                    <label><input type="radio" name="btr-mode" value="blur"> Blurred Titles</label>
                    <label><input type="radio" name="btr-mode" value="censor-bar"> Censor Bar</label>
                    
                    <div class="btr-range-slider">
                        <label for="btr-blur-intensity">Blur Intensity</label>
                        <input type="range" id="btr-blur-intensity" min="1" max="10" value="${state.blurIntensity}">
                        <div class="btr-range-slider-value" id="btr-blur-value">${state.blurIntensity}px</div>
                    </div>
                </div>
                <div class="btr-settings-column">
                    <h4>Filters</h4>
                    <label><input type="checkbox" id="btr-hide-spoilers"> Hide Spoilers</label>
                    <label><input type="checkbox" id="btr-hide-nsfw"> Hide NSFW</label>
                </div>
            </div>
            <div class="btr-buttons-container">
                <button id="btr-reset-settings" class="btr-button btr-reset-btn">Reset</button>
                <button id="btr-close-settings" class="btr-button">Save & Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        cache.modal = modal;

        // Set initial values
        const blurOption = modal.querySelector('input[value="blur"]');
        const censorOption = modal.querySelector('input[value="censor-bar"]');
        const spoilersOption = modal.querySelector('#btr-hide-spoilers');
        const nsfwOption = modal.querySelector('#btr-hide-nsfw');
        const blurIntensitySlider = modal.querySelector('#btr-blur-intensity');
        const blurValueDisplay = modal.querySelector('#btr-blur-value');

        if (blurOption && censorOption) {
            blurOption.checked = state.useBlurMode;
            censorOption.checked = !state.useBlurMode;

            modal.querySelectorAll('input[name="btr-mode"]').forEach(input => {
                input.addEventListener('change', (e) => {
                    // Check if we're switching from censor bar to blur
                    const switchingFromCensorToBlur = !state.useBlurMode && e.target.value === 'blur';
                    
                    // Update state
                    state.useBlurMode = e.target.value === 'blur';
                    GM_setValue('useBlurMode', state.useBlurMode);
                    
                    // Toggle blur intensity control visibility
                    document.querySelector('.btr-range-slider').style.display = 
                        state.useBlurMode ? 'flex' : 'none';
                    
                    // Disable transitions when switching from censor to blur
                    if (switchingFromCensorToBlur) {
                        disableTransitions();
                    }
                    
                    // Update the titles with the new style
                    updateSpoilerTitles();
                    
                    // If we disabled transitions, re-enable them after a short delay
                    if (switchingFromCensorToBlur) {
                        setTimeout(enableTransitions, 50);
                    }
                });
            });
            
            // Set initial display of blur intensity control
            document.querySelector('.btr-range-slider').style.display = 
                state.useBlurMode ? 'flex' : 'none';
        }

        if (spoilersOption) {
            spoilersOption.checked = state.hideSpoilers;
            spoilersOption.addEventListener('change', (e) => {
				const wasEnabled = state.hideSpoilers;
				state.hideSpoilers = e.target.checked;
				GM_setValue('hideSpoilers', state.hideSpoilers);
				
				if (wasEnabled && !state.hideSpoilers) {
					// Do an aggressive removal of all blurred/censored elements
					removeSpoilerConcealment();
					document.querySelectorAll(`.${CLASSES.BLUR}, .${CLASSES.CENSOR}`).forEach(el => {
						el.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
					});
				}
				
				updateSpoilerTitles();
				updateToggleButton();
			});
        }

        if (nsfwOption) {
            nsfwOption.checked = state.hideNsfw;
            nsfwOption.addEventListener('change', (e) => {
				const wasEnabled = state.hideNsfw;
				state.hideNsfw = e.target.checked;
				GM_setValue('hideNsfw', state.hideNsfw);
				
				if (wasEnabled && !state.hideNsfw) {
					// Do an aggressive removal of all blurred/censored elements
					removeNsfwConcealment();
					document.querySelectorAll(`.${CLASSES.BLUR}, .${CLASSES.CENSOR}`).forEach(el => {
						el.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
					});
				}
				
				updateSpoilerTitles();
				updateToggleButton();
			});
        }
        
        // Blur intensity slider
        if (blurIntensitySlider && blurValueDisplay) {
            blurIntensitySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                state.blurIntensity = value;
                blurValueDisplay.textContent = `${value}px`;
                document.documentElement.style.setProperty('--btr-blur-intensity', `${value}px`);
                
                // Debounce saving to avoid excessive writes
                clearTimeout(blurIntensitySlider.saveTimeout);
                blurIntensitySlider.saveTimeout = setTimeout(() => {
                    GM_setValue('blurIntensity', value);
                    updateSpoilerTitles();
                }, 300);
            });
        }

        // Close button event listener
        const closeButton = document.getElementById('btr-close-settings');
        if (closeButton) {
            closeButton.addEventListener('click', hideModal);
        }
        
        // Reset button event listener
        const resetButton = document.getElementById('btr-reset-settings');
        if (resetButton) {
            resetButton.addEventListener('click', resetSettings);
        }
        
        // Right click on toggle button opens settings
		cache.button.addEventListener('contextmenu', function(e) {
			e.preventDefault(); // Prevent context menu
			showModal();
			return false;
		});
        
        // Add keyboard event listener to close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                hideModal();
            }
        });
    }
    
    /**
     * Shows the settings modal with animation
     */
    function showModal() {
        if (!cache.modal || !cache.modalBackdrop) return;
        
        // First make elements visible but not active
        cache.modal.style.display = 'block';
        cache.modalBackdrop.style.display = 'block';
        
        // Trigger reflow to enable animation
        void cache.modal.offsetWidth;
        
        // Then add active class for animation
        cache.modal.classList.add('active');
        cache.modalBackdrop.classList.add('active');
    }
    
    /**
     * Hides the settings modal with animation
     */
    function hideModal() {
        if (!cache.modal || !cache.modalBackdrop) return;
        
        // Remove active classes first (starts animation)
        cache.modal.classList.remove('active');
        cache.modalBackdrop.classList.remove('active');
        
        // Wait for animation to complete before hiding completely
        setTimeout(() => {
            cache.modal.style.display = 'none';
            cache.modalBackdrop.style.display = 'none';
        }, 300);
    }
    
    /**
     * Resets all settings to defaults
     */
    function resetSettings() {
        // Default values
        const defaults = {
            coverEnabled: true,
            useBlurMode: true,
            hideSpoilers: true,
            hideNsfw: false,
            blurIntensity: 4
        };
        
        // Update state with defaults
        Object.assign(state, defaults);
        
        // Save to storage
        GM_setValue('coverEnabled', defaults.coverEnabled);
        GM_setValue('useBlurMode', defaults.useBlurMode);
        GM_setValue('hideSpoilers', defaults.hideSpoilers);
        GM_setValue('hideNsfw', defaults.hideNsfw);
        GM_setValue('blurIntensity', defaults.blurIntensity);
        
        // Update UI elements
        const modal = cache.modal;
        if (modal) {
            modal.querySelector('input[value="blur"]').checked = defaults.useBlurMode;
            modal.querySelector('input[value="censor-bar"]').checked = !defaults.useBlurMode;
            modal.querySelector('#btr-hide-spoilers').checked = defaults.hideSpoilers;
            modal.querySelector('#btr-hide-nsfw').checked = defaults.hideNsfw;
            
            const blurSlider = modal.querySelector('#btr-blur-intensity');
            const blurValue = modal.querySelector('#btr-blur-value');
            if (blurSlider && blurValue) {
                blurSlider.value = defaults.blurIntensity;
                blurValue.textContent = `${defaults.blurIntensity}px`;
            }
            
            document.querySelector('.btr-range-slider').style.display = 'flex';
        }
        
        // Update CSS variable
        document.documentElement.style.setProperty('--btr-blur-intensity', `${defaults.blurIntensity}px`);
        
        // Update page content
        updateToggleButton();
        updateSpoilerTitles();
        
        // Feedback animation
        const resetBtn = document.getElementById('btr-reset-settings');
        if (resetBtn) {
            resetBtn.textContent = 'Done!';
            setTimeout(() => {
                resetBtn.textContent = 'Reset';
            }, 1000);
        }
    }

    /**
     * Temporarily disables transitions for all title elements
     */
    function disableTransitions() {
        // Get all elements that might have transitions
        const elements = document.querySelectorAll(
            `${SELECTORS.POST_TITLE}, ${SELECTORS.SEARCH_TITLE}, ${SELECTORS.RELATED_TITLE}`
        );
        
        // Add no-transition class to all elements
        elements.forEach(el => {
            el.classList.add(CLASSES.NO_TRANSITION);
        });
        
        state.isStyleTransitionDisabled = true;
    }

    /**
     * Re-enables transitions for all title elements
     */
    function enableTransitions() {
        // Get all elements with no-transition class
        const elements = document.querySelectorAll(`.${CLASSES.NO_TRANSITION}`);
        
        // Remove no-transition class from all elements
        elements.forEach(el => {
            el.classList.remove(CLASSES.NO_TRANSITION);
        });
        
        state.isStyleTransitionDisabled = false;
    }

    // ==================== CONTENT PROCESSING ====================
    
	function updateSpoilerTitles() {
		// Skip processing if no filter is active
		if (!state.hideSpoilers && !state.hideNsfw) {
			// Make sure to remove any existing effects when both filters are disabled
			removeSpoilerConcealment();
			removeNsfwConcealment();
			return;
		}
		
		// Process standard posts (spoilers and NSFW)
		document.querySelectorAll(SELECTORS.POST).forEach(post => {
			const title = post.querySelector(SELECTORS.POST_TITLE);
			if (!title) return;
			
			// Determine if title should be hidden
			const isSpoiler = post.hasAttribute('spoiler') && state.hideSpoilers;
			const isNsfw = post.hasAttribute('nsfw') && state.hideNsfw;
			const shouldHide = state.coverEnabled && (isSpoiler || isNsfw);
			
			// Skip processing if hovering - prevents flickering
			if (title.matches(':hover')) return;
			
			// Update classes efficiently by removing both first
			title.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
			
			// Apply appropriate effect if needed
			if (shouldHide) {
				title.classList.add(state.useBlurMode ? CLASSES.BLUR : CLASSES.CENSOR);
			}
		});

		// Process search results (spoilers and NSFW)
		document.querySelectorAll(SELECTORS.SEARCH_POST).forEach(postContainer => {
			const spoilerMarker = postContainer.querySelector(SELECTORS.SPOILER_MARKER);
			const nsfwMarker = postContainer.querySelector(SELECTORS.NSFW_MARKER);
			const titleLink = postContainer.querySelector(SELECTORS.SEARCH_TITLE);
			
			if (!titleLink) return;
			
			// Skip processing ONLY if directly hovering over the title - fixes hover issue
			if (titleLink.matches(':hover')) return;
			
			// Determine if title should be hidden
			const isSpoiler = spoilerMarker && state.hideSpoilers;
			const isNsfw = nsfwMarker && state.hideNsfw;
			const shouldHide = state.coverEnabled && (isSpoiler || isNsfw);
			
			// Update classes efficiently
			titleLink.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
			
			if (shouldHide) {
				titleLink.classList.add(state.useBlurMode ? CLASSES.BLUR : CLASSES.CENSOR);
			}
		});

		// Process related posts in sidebar (spoilers and NSFW)
		document.querySelectorAll(SELECTORS.RELATED_POSTS).forEach(post => {
			const spoilerMarker = post.querySelector(SELECTORS.SPOILER_MARKER);
			const nsfwMarker = post.querySelector(SELECTORS.NSFW_MARKER);
			const title = post.querySelector(SELECTORS.RELATED_TITLE);
			
			if (!title) return;
			
			// Skip processing if hovering - prevents flickering
			if (title.matches(':hover')) return;
			
			// Determine if title should be hidden
			const isSpoiler = spoilerMarker && state.hideSpoilers;
			const isNsfw = nsfwMarker && state.hideNsfw;
			const shouldHide = state.coverEnabled && (isSpoiler || isNsfw);
			
			// Update classes efficiently
			title.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
			
			if (shouldHide) {
				title.classList.add(state.useBlurMode ? CLASSES.BLUR : CLASSES.CENSOR);
			}
		});
	}

	/**
	 * Explicitly removes concealment effects from all spoiler titles
	 * when the hideSpoilers setting is toggled off
	 */
	function removeSpoilerConcealment() {
		// Bundle all selector operations for better performance
		// Add a more generic selector to catch all elements with concealment classes
		const selectors = [
			`shreddit-post[spoiler] ${SELECTORS.POST_TITLE}`,
			`${SELECTORS.SEARCH_POST} ${SELECTORS.SPOILER_MARKER} ~ ${SELECTORS.SEARCH_TITLE}`,
			`${SELECTORS.RELATED_POSTS} ${SELECTORS.SPOILER_MARKER} ~ ${SELECTORS.RELATED_TITLE}`,
			// More direct selectors for any element with the classes
			`.${CLASSES.BLUR}, .${CLASSES.CENSOR}`
		];
		
		// Process all matching elements
		document.querySelectorAll(selectors.join(', ')).forEach(element => {
			element.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
		});
	}

	/**
	 * Explicitly removes concealment effects from all NSFW titles
	 * when the hideNsfw setting is toggled off
	 */
	function removeNsfwConcealment() {
		// Bundle all selector operations for better performance
		// Add a more generic selector to catch all elements with concealment classes
		const selectors = [
			`shreddit-post[nsfw] ${SELECTORS.POST_TITLE}`,
			`${SELECTORS.SEARCH_POST} ${SELECTORS.SPOILER_MARKER} ~ ${SELECTORS.SEARCH_TITLE}`,
			`${SELECTORS.RELATED_POSTS} ${SELECTORS.SPOILER_MARKER} ~ ${SELECTORS.RELATED_TITLE}`,
			// More direct selectors for any element with the classes
			`.${CLASSES.BLUR}, .${CLASSES.CENSOR}`
		];
		
			// Process all matching elements
		document.querySelectorAll(selectors.join(', ')).forEach(element => {
			element.classList.remove(CLASSES.BLUR, CLASSES.CENSOR);
		});
	}


    // ==================== OBSERVERS ====================
    
    /**
     * Optimized function to handle all observation setup for better performance
     */
    function setupObservers() {
        // 1. Theme changes observer (light/dark mode)
        const themeObserver = new MutationObserver(() => {
            updateCensorBarColor();
            updateSpoilerTitles();
        });
        themeObserver.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // 2. Header changes observer (for button persistence)
        const headerObserver = new MutationObserver(throttle(() => {
            if (!document.contains(cache.button)) {
                setupToggleButton();
            }
        }, 500));
        headerObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        // 3. Content changes observer (for updating spoiler/NSFW titles)
        // Find the main content container
        cache.postFeed = document.querySelector('[data-scroller-first]') || 
                         document.querySelector('div[data-testid="post-container"]') || 
                         document.body;
                         
        cache.sidebar = document.querySelector('ul.list-none.p-0.m-0'); 
        cache.searchResults = document.querySelector('div[data-testid="search-results-container"]');
        
        // Create a single content observer for all relevant areas
        const contentObserver = new MutationObserver(throttle(() => {
            updateSpoilerTitles();
        }, 300));
        
        // Observe the main content area
        contentObserver.observe(cache.postFeed, { 
            childList: true, 
            subtree: true 
        });
        
        // Observe sidebar if present
        if (cache.sidebar) {
            contentObserver.observe(cache.sidebar, { 
                childList: true, 
                subtree: true 
            });
        }
        
        // Observe search results if present
        if (cache.searchResults) {
            contentObserver.observe(cache.searchResults, { 
                childList: true, 
                subtree: true 
            });
        }
        
        // 4. Dynamic content observer (for sidebar and search results that appear later)
        const dynamicContentObserver = new MutationObserver(throttle((mutations) => {
            // Check for new sidebar or search results
            const newSidebar = !cache.sidebar && document.querySelector('ul.list-none.p-0.m-0');
            const newSearchResults = !cache.searchResults && document.querySelector('div[data-testid="search-results-container"]');
            
            if (newSidebar) {
                cache.sidebar = newSidebar;
                contentObserver.observe(cache.sidebar, { 
                    childList: true, 
                    subtree: true 
                });
            }
            
            if (newSearchResults) {
                cache.searchResults = newSearchResults;
                contentObserver.observe(cache.searchResults, { 
                    childList: true, 
                    subtree: true 
                });
            }
            
            // Run update after detecting new content areas
            if (newSidebar || newSearchResults) {
                updateSpoilerTitles();
            }
        }, 500));
        
        dynamicContentObserver.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }

    /**
     * Improved throttle function with leading and trailing options
     */
    function throttle(func, wait, options = {}) {
        let context, args, result;
        let timeout = null;
        let previous = 0;
        
        const later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        
        return function() {
            const now = Date.now();
            if (!previous && options.leading === false) previous = now;
            const remaining = wait - (now - previous);
            context = this;
            args = arguments;
            
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    /**
	 * Handles navigation events (page changes within Reddit SPA)
	 */
	function setupNavigationHandlers() {
		// Handle pushState and replaceState
		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;
		
		history.pushState = function() {
			originalPushState.apply(this, arguments);
			handleNavigation();
		};
		
		history.replaceState = function() {
			originalReplaceState.apply(this, arguments);
			handleNavigation();
		};
		
		// Handle popstate event (back/forward browser navigation)
		window.addEventListener('popstate', handleNavigation);
		
		// Store last URL to detect actual navigation
		let lastUrl = location.href;
		
		function handleNavigation() {
			// Check if URL actually changed (avoid unnecessary processing)
			if (lastUrl === location.href) return;
			lastUrl = location.href;
			
			// Slight delay to allow Reddit to update the DOM
			setTimeout(() => {
				// Re-check sidebar and search results
				cache.sidebar = document.querySelector('ul.list-none.p-0.m-0');
				cache.searchResults = document.querySelector('div[data-testid="search-results-container"]');
				
				// Ensure button is present after navigation
				setupToggleButton();
				
				// Force clean all spoiler/NSFW concealment
				removeSpoilerConcealment();
				removeNsfwConcealment();
				
				// Determine if we need a full reset based on settings changes
				const pageLoadTime = Date.parse(performance.getEntriesByType("navigation")[0]?.startTime || Date.now());
				const settingsChangedSincePageLoad = state.lastSettingsUpdate > pageLoadTime;
				
				if (settingsChangedSincePageLoad) {
					// Force clean and reapply
					removeSpoilerConcealment();
					removeNsfwConcealment();
				}
		
				// Always update for consistency
				updateSpoilerTitles();
			}, 300);
		}
	}

    // ==================== INITIALIZATION ====================
    
    function init() {
        // Setup UI components
        setupStyles();
        updateCensorBarColor();
        setupToggleButton();
        createSettingsModal();
        
        // Register menu command
        GM_registerMenuCommand('Reddit Spoiler/NSFW Settings', showModal);
        
        // Setup observers and event handlers
        setupObservers();
        setupNavigationHandlers();
        
        // Initial update
        updateSpoilerTitles();
        
        console.log('Reddit Spoiler/NSFW Hider initialized');
    }
    
    // Start the script after a slight delay to ensure Reddit is fully loaded
    setTimeout(init, 100);
})();