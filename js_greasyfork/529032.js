// ==UserScript==
// @name        Jupiter's Patreon Tools
// @description Patreon has too much clutter. Simplify it with this script. Hide sidebars and pinned posts, make posts wider, and make videos bigger.
// @namespace   Violentmonkey Scripts
// @license     CC BY-SA
// @match       https://www.patreon.com/*
// @grant       none
// @run-at      document-start
// @version     1.4.3
// @author      -
// @description 2025-10-08, 1:00 AM
// @downloadURL https://update.greasyfork.org/scripts/529032/Jupiter%27s%20Patreon%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/529032/Jupiter%27s%20Patreon%20Tools.meta.js
// ==/UserScript==

// Save the original console methods
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
};

// After `es()` runs, restore the original console methods
function restoreConsole() {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
}

const debug = false;

function log(...args) {
    throttle(() => {
        restoreConsole();
    }, 250); // 250ms throttle interval
    restoreConsole();
		if (!debug) {
				return;
		}
		console.log(...args);
}

// Debounce function to ensure the observer isn't triggered too often
const debounce = (func, delay) => {
		let timer;
		return (...args) => {
				clearTimeout(timer);
				timer = setTimeout(() => func(...args), delay);
		};
};

let resizeObserver;
let addenda = new Map();

// New global variables to store the search box's original position
let originalSearchBoxParent = null;
let originalSearchBoxNextSibling = null;
let searchBoxRetryTimeout = null; // For the retry mechanism

function checkBody() {
		if (!document.body) {
				log('No document body.');
				return false;
		} else {
				return true;
		}
}

// Declare global elements as constants
const styleSheet = document.createElement('style');
const staticStyles = document.createElement('style');
staticStyles.innerHTML = `
#interface-toggle-open-menu {
    position: fixed;
    margin: 16px;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 4px;
    border-radius: 8px;
    transition: opacity 500ms;
    border-width: 1px;
}

#interface-toggle-buttons {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 64px 16px;
    background: white;
    border: 1px solid black;
    padding: 12px;
    border-radius: 12px;
}

#interface-toggle-buttons button [hidden] {
    display: none;
}

#interface-toggle-buttons button .hidden-span {
    color: red;
}

#interface-toggle-open-menu,
#interface-toggle-buttons {
    border-color: #AAA;
}

#interface-toggle-buttons-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

#interface-toggle-open-menu svg {
    width: 24px;
    height: 24px;
}

#interface-toggle-open-menu:not(.menu-open) {
    opacity: 0.25;
}

#interface-toggle-open-menu:not(.menu-open):hover {
    opacity: 1;
}

.input-and-checkbox-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.input-and-checkbox-container span {

}

.input-and-checkbox-container input[type="number"] {
    width: 4em;
    text-align: center;
}

.input-and-checkbox-container input[type="number"][disabled] {
    color: gray;
}

#linktree-button {
    all: unset;
    background: #41df5d;
    height: 24px;
    width: 24px;
    border-radius: 20%;
    margin: 0 -8px -8px auto;
    cursor: pointer;
}

#linktree-button svg {
    aspect-ratio: 1;
    padding: 15%;
}
`;
document.head.appendChild(staticStyles);


// Step 1: Define a map of items, each with an ID, content, and an on/off switch
const itemMap = {
		leftSidebar: {
				id: 'leftSidebar',
				type: 'button', // Specify the type here
				buttonText: 'Left Sidebar',
				content: `
      #main-app-navigation {
        display: none;
      }

      .main-body {
        margin-left: 0;
      }
    `,
				on: false,
		},
		rightSidebar: {
				id: 'rightSidebar',
				type: 'button', // Specify the type here
				buttonText: 'Right Sidebar',
				content: `
      .right-sidebar {
        display: none;
      }

      .post-grid {
        display: unset;
      }

      .post-grid-left {

      }

      figure[title="video thumbnail"] div[data-tag="media-container"] img {
        width: 100%;
      }
    `,
				extraFunction: moveSearch,
				on: false,
		},
		pinnedPost: {
				id: 'pinnedPost',
				type: 'button', // Specify the type here
				buttonText: 'Pinned Post',
				content: `
      .pinned-post {
        display: none;
      }
    `,
				on: false,
		},
		maxWidth: {
				id: 'maxWidth',
				type: 'inputAndCheckbox', // Specify the type here
				label: 'Post Max Width',
				value: 1024,
				get content() {
						return `
        .max-width-limited,
        [data-tag="collections-view"],
        [data-tag="about-patron-view"],
        [data-tag="membership-patron-view"],
        .post-section [class*="Areas_narrowContent"],
        .post-section [class*="Areas_wideContent"],
        .post-grid-parent {
          max-width: min(${this.value}px, 100%);
        }
      `;
				},
				on: false,
		},
		wideVideo: {
				id: 'wideVideo',
				type: 'button',
				buttonText: 'Wide Video',
				hiddenText: ' [active]',
				content: `
      .hides-video-overflow {
        overflow: visible !important;
        box-shadow: none;
      }

      .subtle-has-video {
        border-top-left-radius: unset;
        border-top-right-radius: unset;
      }

      .video-holder {
        margin: 0 var(--video-negative-margin);
        max-height: 95vh;
      }
    `,
				on: false,
		},
		// Add more items here as needed
};

function loadSettingsFromLocalStorage() {
		// Get the saved settings from localStorage
		const settings = JSON.parse(localStorage.getItem('itemSettings'));

		// If settings exist, apply them
		if (settings) {
				for (const itemId in settings) {
						if (settings.hasOwnProperty(itemId)) {
								// Apply the saved settings by calling toggleItem with noSave set to true
								toggleItem(itemId, settings[itemId].on, true);

								// If the item has a value, apply it
								if (settings[itemId].hasOwnProperty('value')) {
										itemMap[itemId].value = settings[itemId].value; // Set the saved value
										// updateItemValue(itemId);  // This is a function to update the input box if needed
								}
						}
				}
		}
}

// Step 2: Function to toggle the state of an item (on or off)
function toggleItem(itemId, state, noSave) {
		if (itemMap[itemId]) {
				// If state is not specified, switch the item to its opposite state
				if (state === undefined) {
						itemMap[itemId].on = !itemMap[itemId].on;
				} else {
						itemMap[itemId].on = state;
				}

				// Check if the item has an extraFunction and call it
				if (itemMap[itemId].extraFunction) {
						itemMap[itemId].extraFunction(itemMap[itemId].on); // Pass the new state to the function if needed
				}

				if (!noSave) {
						// Save the updated item settings to localStorage by passing itemId and state
						saveSettingsToLocalStorage(itemId, itemMap[itemId].on);
				}

				updateStylesheet();

				// If the item is 'wideVideo' and the state is true, set up the resize observer
				if (itemId === 'wideVideo') {
						if (state === true) {
								// Initialize the resize observer
								try {
										attachResizeObserver();
								} catch (error) {
										log('Error occurred while attaching resize observer:', error);
										// Retry after 250ms if the operation fails
										setTimeout(attachResizeObserver, 250);
								}
						} else {
								// If state is false, disconnect the observer
								if (resizeObserver) {
										resizeObserver.disconnect();
										log('Resize observer disconnected.');
								}
						}
				}
		}
}

let resizeTimeout;

function debounceResize(callback, wait) {
		return function () {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(callback, wait);
		};
}

function attachResizeObserver() {
		const bodyPresent = checkBody();
		if (!bodyPresent) {
				// throw new Error('The body isn\'t ready.');
        setTimeout(attachResizeObserver, 250); // Retry after 250ms
        return; // Exit early and do nothing further
		}
		const debouncedResize = debounceResize(() => {
				log('Window size changed!');
				videoRescale();
		}, 250); // 250ms debounce delay

		// Create the ResizeObserver
		resizeObserver = new ResizeObserver(debouncedResize);

		// Start observing the window (or document body, or any other specific element)
		resizeObserver.observe(document.body);
}

function videoRescale() {
		// Get the body width
		const bodyWidth = document.body.offsetWidth;

		// Query all .video-holder elements
		const videoHolders = document.querySelectorAll('.video-holder');

		let finalNegativeMargin = null;

		// Loop through each video-holder
		videoHolders.forEach((videoHolder) => {
				// Get the width of the video holder, including margins
				const style = window.getComputedStyle(videoHolder);
				const videoHolderWidth = videoHolder.offsetWidth;
				const marginLeft = parseInt(style.marginLeft, 10);
				const marginRight = parseInt(style.marginRight, 10);

				// Calculate the total width of the video holder including margins
				const totalWidth = videoHolderWidth + marginLeft + marginRight;

				// Calculate the difference between the body width and video holder width
				const difference = bodyWidth - totalWidth;

				// Divide the difference by 2
				const negativeMargin = difference / 2;

				log('Calculated negative margin: ' + negativeMargin);

				if (finalNegativeMargin === null || finalNegativeMargin > negativeMargin) {
						finalNegativeMargin = Math.floor(negativeMargin);
				}
		});

		const marginStyle = `
  :root {
    --video-negative-margin: ${finalNegativeMargin * -1}px;
  }
  `;

		addToAddenda('negative-margin', marginStyle);
}

function addToAddenda(id, content) {
		if (addenda.hasOwnProperty(id)) {
				// If the entry exists, modify its content
				addenda[id].content = content;
		} else {
				// If the entry doesn't exist, create it and set its content
				addenda[id] = {
						content: content
				};
		}

		updateStylesheet();
}

function saveSettingsToLocalStorage(itemId, state) {
		const settings = JSON.parse(localStorage.getItem('itemSettings')) || {};

		// Update the specific item's state
		settings[itemId] = {
				id: itemId,
				on: state,
				// Check if the item has a value property, and if it does, include it in the saved state
				...(itemMap[itemId]?.value !== undefined ? {
						value: itemMap[itemId].value
				} : {})
		};

		// Save the updated settings to localStorage as a JSON string
		localStorage.setItem('itemSettings', JSON.stringify(settings));
}

function moveSearch(state) {
    log('moveSearch called with state:', state);

    // Clear any previous retry timeout to avoid multiple calls
    if (searchBoxRetryTimeout) {
        clearTimeout(searchBoxRetryTimeout);
        searchBoxRetryTimeout = null;
    }

    const searchBox = document.querySelector('.post-grid-left-search');

    if (!searchBox) {
        log('post-grid-left-search not found yet. Retrying in 250ms...');
        searchBoxRetryTimeout = setTimeout(() => moveSearch(state), 250);
        return;
    }

    // Save original position only once, when the searchBox is first found
    if (!originalSearchBoxParent) {
        originalSearchBoxParent = searchBox.parentNode;
        originalSearchBoxNextSibling = searchBox.nextSibling;
        log('Original search box position saved.');
    }

    const targetAncestor = document.querySelector('.post-grid-header');

    if (!targetAncestor) {
        log('post-grid-header not found yet. Move operation deferred.');
        // Re-schedule moveSearch if the target ancestor isn't found,
        // it likely means the new criterion hasn't run yet.
        searchBoxRetryTimeout = setTimeout(() => moveSearch(state), 250);
        return; // Exit and wait for the next retry
    }

    if (state) { // If right sidebar is hidden (move search box)
        log('Right sidebar is hidden. Moving search box.');
        // Ensure the search box is moved *after* the target ancestor
        targetAncestor.after(searchBox);
        addToAddenda('search-box-margin', `.post-grid-left-search { margin-top: .75em; }`);
    } else { // If right sidebar is visible (put search box back)
        log('Right sidebar is visible. Restoring search box original position.');
        if (originalSearchBoxParent && searchBox.parentNode !== originalSearchBoxParent) {
            if (originalSearchBoxNextSibling) {
                originalSearchBoxParent.insertBefore(searchBox, originalSearchBoxNextSibling);
            } else {
                originalSearchBoxParent.appendChild(searchBox);
            }
        }
        // Remove the margin style when sidebar is visible
        addToAddenda('search-box-margin', '');
    }

    updateStylesheet(); // Update the stylesheet to apply/remove margin
}


// Step 3: Function to build the stylesheet based on the state of the items
function buildStylesheet() {
		let styleSheetContent = '';

		// Loop through each item and only include it if it's "on"
		for (const key in itemMap) {
				const item = itemMap[key];
				// log(item.id, item.on);
				if (item.on) {
						styleSheetContent += item.content + '\n'; // Add the content of the item if it's "on"
				}
		}

		styleSheetContent += '\n';

		// Add the addenda items

		for (const key in addenda) {
				const addendum = addenda[key];
				styleSheetContent += addendum.content + '\n'; // Add each item from the addenda
		}


		return styleSheetContent;
}

// Step 4: Function to insert the stylesheet into the document
function updateStylesheet() {
		styleSheet.id = 'dynamic-stylesheet';
		styleSheet.type = 'text/css';
		styleSheet.innerHTML = buildStylesheet();
		document.head.appendChild(styleSheet);
}

// Initial stylesheet insertion
updateStylesheet();

// Example of how to toggle items on/off
// toggleItem('leftSidebar', true);  // Turns the left sidebar rule on

function toggleHiddenSpan(button, item, state) {
		const hiddenSpan = button.querySelector('.hidden-span');

		if (!hiddenSpan) {
				log('Hidden span not found on button ' + item.id + '.');
				return;
		}

		if (state === true) {
				log(item.id + 'is active.');
				hiddenSpan.removeAttribute('hidden');
		} else {
				log(item.id + 'is inactive.');
				hiddenSpan.setAttribute('hidden', '');
		}
}


// Step 3: Function to generate buttons for each item and return them as an array
function generateButtons() {
		const buttons = [];

		// Loop through each item in the itemMap
		for (const key in itemMap) {
				const item = itemMap[key];

				if (item.type === 'button') {
						// Create a new button element
						const button = document.createElement('button');
						button.textContent = item.buttonText;
						const hiddenSpan = document.createElement('span');
						hiddenSpan.classList.add('hidden-span');
						if (!item.hiddenText) {
								hiddenSpan.textContent = ' [hidden]';
						} else {
								hiddenSpan.textContent = item.hiddenText;
						}

						button.appendChild(hiddenSpan);

						toggleHiddenSpan(button, item, item.on);

						// Attach a click event to toggle the item's state when the button is clicked
						button.addEventListener('click', () => {
								event.stopPropagation(); // Stop the click event from bubbling up
								toggleItem(item.id); // Toggle the item by its ID
								initialDOMCheck();
								toggleHiddenSpan(button, item, item.on);
						});

						// Push the created button to the buttons array
						buttons.push(button);
				}

				if (item.type === 'inputAndCheckbox') {
						// Create a div container for input and checkbox
						const container = document.createElement('div');
						container.classList.add('input-and-checkbox-container');

						// Create the label span
						const labelSpan = document.createElement('span');
						labelSpan.textContent = item.label;

						// Create the input box (grayed out initially)
						const inputBox = document.createElement('input');
						inputBox.type = 'number';
						inputBox.value = item.value;
						inputBox.disabled = !item.on; // Initially grayed out

						// Create the checkbox
						const checkbox = document.createElement('input');
						checkbox.type = 'checkbox';
						checkbox.checked = item.on;

						// Add a listener to the checkbox to toggle the input box's editable state
						checkbox.addEventListener('change', () => {
								inputBox.disabled = !checkbox.checked; // Enable/Disable input box based on checkbox
								if (!checkbox.checked) {
										// When unchecked, reset the input value to the original one
										inputBox.value = item.value;
								}
								toggleItem(item.id, checkbox.checked);
						});

						// Add a listener to the input box to update the item value and toggle it
						let debounceTimer;
						inputBox.addEventListener('input', () => {
								clearTimeout(debounceTimer);
								debounceTimer = setTimeout(() => {
										item.value = parseInt(inputBox.value, 10);
										toggleItem(item.id, false); // Pass second argument as false
										toggleItem(item.id, true); // Pass second argument as true
								}, 250); // Debounced for 250ms
						});

						// Append the label, input box, and checkbox to the container
						container.appendChild(labelSpan);
						container.appendChild(inputBox);
						container.appendChild(checkbox);

						// Push the container to the buttons array
						buttons.push(container);
				}
		}

		// Return the array of buttons and input-and-checkbox containers
		return buttons;
}

// Step 4: Function to append the buttons to a specific container
function appendButtons() {
		const container = document.createElement('div');
		container.id = 'interface-toggle-buttons';
		const subContainer = document.createElement('div');
		subContainer.id = 'interface-toggle-buttons-inner';

		// Set the container's initial visibility to hidden
		container.style.display = 'none';

		// Generate the buttons
		const buttons = generateButtons();

		// Clear the container and append the buttons
		buttons.forEach(button => {
				subContainer.appendChild(button);
		});

		const linktreeButton = document.createElement('button');
		linktreeButton.id = 'linktree-button';
		linktreeButton.innerHTML = `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 80 97.7" style="enable-background:new 0 0 80 97.7;" xml:space="preserve">
 <path d="M0.2,33.1h24.2L7.1,16.7l9.5-9.6L33,23.8V0h14.2v23.8L63.6,7.1l9.5,9.6L55.8,33H80v13.5H55.7l17.3,16.7l-9.5,9.4L40,49.1
		L16.5,72.7L7,63.2l17.3-16.7H0V33.1H0.2z M33.1,65.8h14.2v32H33.1V65.8z">
 </path>
</svg>
  `;

		linktreeButton.addEventListener('click', () => {
				window.open('https://linktr.ee/jupiterliar', '_blank');
		});

		subContainer.appendChild(linktreeButton);

		container.appendChild(subContainer);

		// Create the wrench icon button
		const wrenchButton = document.createElement('button');
		wrenchButton.id = 'interface-toggle-open-menu';
		wrenchButton.innerHTML = `
    <svg fill="#000000" viewBox="0 0 512.00 512.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00512" transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"></path>
  </g>
  </svg>
  `;

		// Attach a click event to toggle the visibility of the button container
		wrenchButton.addEventListener('click', () => {
				event.stopPropagation(); // Stop the click event from bubbling up
				if (container.style.display === 'none') {
						container.style.display = 'block';
						wrenchButton.classList.add('menu-open');
						log('Displaying config buttons...');
				} else {
						log('Hiding config buttons at point 1...');
						container.style.display = 'none';
						wrenchButton.classList.remove('menu-open');
				}
		});

    function appendButtonPair() {
        if (document.body) {
            // Add the wrench button before the container
            document.body.appendChild(wrenchButton);

            // Add the button container to the body
            document.body.appendChild(container);
        } else {
            log('Body not available yet, retrying...');
            setTimeout(appendButtonPair, 250); // Retry after 250ms if the body is not available
        }
    }

		try {
				appendButtonPair();
		} catch (error) {
				log('Error occurred while appending buttons:', error);
				// Retry after 250ms if the operation fails
				setTimeout(appendButtonPair, 250);
		}



		// Click outside the button container to hide it
		document.addEventListener('click', (event) => {
				if (!container.contains(event.target) && event.target !== wrenchButton) {
						log('Hiding config buttons at point 2...');
						container.style.display = 'none';
						wrenchButton.classList.remove('menu-open');
				}
		});
}

// Helper function to get all ancestors of an element
function getAncestors(el) {
		let ancestors = [];
		let currentElement = el;

		while (currentElement.parentElement) {
				ancestors.push(currentElement.parentElement);
				currentElement = currentElement.parentElement;
		}

		return ancestors;
}

// List of criteria to find elements
const criteriaList = [
		{
				// Traversing the DOM and applying the existing criteria
				selector: 'body', // Starting point: body element
				handler: (el) => {
						const allElements = el.getElementsByTagName('*'); // Select all elements under body
						const viewportWidth = window.innerWidth;
						const existingMainBody = document.body.querySelector('.main-body');

						if (!existingMainBody) {


								// Step 1: Find elements matching the criteria
								const matchingElements = [];

								for (let child of allElements) {
										// Skip if the element is a <script> tag
										if (child.tagName.toLowerCase() === 'script') {
												continue;
										}

										const style = window.getComputedStyle(child);

										// Skip if the element is not visible (display: none or visibility: hidden)
										if (style.display === 'none' || style.visibility === 'hidden') {
												continue;
										}

										const rect = child.getBoundingClientRect();

										// Skip if the element is too small (width < 50% of viewport)
										if (rect.width < Math.floor(viewportWidth * 0.5)) {
												continue;
										}

										// If the element's left margin is greater than 20px
										const leftMargin = parseInt(style.marginLeft, 10);
										if (isNaN(leftMargin) || leftMargin <= 20) {
												continue; // Skip if the left margin is not greater than 20px
										}

										// Step 2: Collect matching elements
										matchingElements.push(child);
								}

								// Step 3: Evaluate the array of matching elements
								if (matchingElements.length === 1) {
										// Only one element matches, apply the class
										matchingElements[0].classList.add('main-body');
								} else if (matchingElements.length > 1) {
										// Multiple matching elements, find the ancestor
										let ancestor = null;

										// Check if one element is an ancestor of the others
										for (let i = 0; i < matchingElements.length; i++) {
												const currentElement = matchingElements[i];
												let isAncestor = true;

												// Check if this element is an ancestor of the others
												for (let j = 0; j < matchingElements.length; j++) {
														if (i === j) continue; // Skip itself

														const otherElement = matchingElements[j];
														if (!currentElement.contains(otherElement)) {
																isAncestor = false;
																break;
														}
												}

												if (isAncestor) {
														ancestor = currentElement;
														break;
												}
										}

										// If an ancestor is found, apply the class to it
										if (ancestor) {
												ancestor.classList.add('main-body');
										}
								}
						}
				},
  },

		{
				// Traversing the DOM and applying the criteria
				selector: '#main-app-navigation', // Look for the element with this ID
				handler: (el) => {
						//log('Found #main-app-navigation');
						el.classList.add('left-sidebar'); // Add the "left-sidebar" class
				},
  },

		{
				selector: 'body', // Starting point: body element
				handler: (el) => {
						const children = el.querySelectorAll('*'); // Find all descendants
						const viewportWidth = window.innerWidth;

            const areaSpanTwo = el.querySelector('[class*="areaSpanTwo"]');

            if (areaSpanTwo) {
                log('areaSpanTwo is present.');
            }

						// Traverse all descendants of the body
						children.forEach(child => {
								const rect = child.getBoundingClientRect();

                if (Array.from(child.classList).some(className => className.includes('areaSpanTwo'))) {
                    log('Class includes "areaSpanTwo". Width:', parseFloat(rect.width));
                }

								// If the element's width is less than 50% of the viewport, skip it
								if (rect.width < Math.floor(viewportWidth * 0.5)) {
										return;
								}

								// Check if it has a grid display style
								const style = window.getComputedStyle(child);
								const display = style.getPropertyValue('display');
								const gridTemplateColumns = style.getPropertyValue('grid-template-columns').trim();

								if (display === 'grid') {
										// log('Investigating element:', child);
								}

								// If it's a grid and has exactly three columns (just check for 3 values)
								if (display === 'grid' && gridTemplateColumns.split(' ').length === 3) {
										// Assign the "post-grid" class to the element
										child.classList.add('post-grid');

                    // Assign the class "post-grid-parent" to the parent
                    child.parentElement.classList.add('post-grid-parent');

										// If the element has children, assign the required IDs to the first two
										if (child.children.length > 1) {
												child.children[0].classList.add('post-grid-left'); // First child
												child.children[1].classList.add('right-sidebar'); // Second child
										}

                    log('Found those pesky elements.');
                    log(child);

										// Stop once the element is found and processed
										return;
								}
						});
				},
  },

		{
				selector: 'body', // Start from the body element
				handler: (el) => {
						// log('Looking for postcards...');
						const postCards = Array.from(el.querySelectorAll('[data-tag="post-card"]'));

						if (postCards.length === 0) return; // No post cards, so no further action

						// Map to store ancestors for each post-card
						const ancestorsMap = new Map();

						// Step 1: Collect ancestors for each post-card element
						postCards.forEach(postCard => {
								let currentAncestor = postCard;
								const ancestors = [];

								// Traverse upwards and store ancestors
								while (currentAncestor) {
										ancestors.push(currentAncestor);
										currentAncestor = currentAncestor.parentElement;
								}

								// Add the ancestors to the map
								ancestorsMap.set(postCard, ancestors);
						});

						// Step 2: Find the common ancestor
						let commonAncestor = null;

						// Initialize commonAncestor as the root element (or body)
						let possibleAncestors = ancestorsMap.get(postCards[0]);

						// For each ancestor in the first post-card, check if it's common in all other post-cards
						for (let ancestor of possibleAncestors) {
								let isCommon = true;

								// Check if this ancestor is present in all post-cards' ancestors
								for (let [postCard, ancestors] of ancestorsMap) {
										if (!ancestors.includes(ancestor)) {
												isCommon = false;
												break;
										}
								}

								// If it's common, update commonAncestor
								if (isCommon) {
										commonAncestor = ancestor;
										break;
								}
						}

						// Step 3: Assign the ID to the common ancestor
						if (commonAncestor) {
								commonAncestor.classList.add('post-card-container');
						}
				}
  },

		{
				selector: '[data-tag="IconPushpin"]', // Starting point: find the element with this selector
				handler: (el) => {
						const postCard = document.querySelector('[data-tag="post-card"]');
						if (postCard) {
								// Get the ancestors of both elements
								const iconPushpinAncestors = getAncestors(el);
								const postCardAncestors = getAncestors(postCard);

								// Find the common ancestor
								let commonAncestor = null;
								for (let ancestor of iconPushpinAncestors) {
										if (postCardAncestors.includes(ancestor)) {
												commonAncestor = ancestor;
												break;
										}
								}

								// If a common ancestor is found, assign the ID
								if (commonAncestor) {
										commonAncestor.classList.add('pinned-post');
										return true; // Successfully found and assigned the ID
								}
						}

						return false; // If no common ancestor was found
				},
  },

		{
				selector: 'header',
				handler: (el) => {
						let nextSibling = el.nextElementSibling;
						const siblings = [];

						// Loop through the siblings until there are no more
						while (nextSibling) {
								siblings.push(nextSibling);
								nextSibling = nextSibling.nextElementSibling;
						}

						// If we have at least 3 siblings, assign them IDs
						if (siblings.length >= 3) {
								siblings[0].classList.add('top-with-avatar');
								siblings[1].classList.add('categories-bar');
								siblings[2].classList.add('post-section');
						} else if (siblings.length >= 1) {
								// Apply 'post-section' class to the last sibling, regardless of the number of siblings
								siblings[siblings.length - 1].classList.add('post-section');
						}
				},
  },

		{
				selector: '[data-tag="post-iframe-wrapper"]',
				handler: (el) => {
						// Step 1: Find all ancestors
						let ancestor = el.parentElement;
						let currentVideoHolder = null;
						let shvFlag = false;
						let hvoFlag = false;
						let vhFlag = false;

						if ((el.classList.contains('shv')) && (el.classList.contains('hvo')) && (el.classList.contains('vh'))) {
								// log('This video has been accounted for.');
								return;
						}

						while (ancestor) {
								// Step 2: Check for the [elevation="subtle"] attribute and add "subtle-has-video" class
								if (!el.classList.contains('shv')) {
										if (ancestor.hasAttribute('elevation') && ancestor.getAttribute('elevation') === 'subtle') {
												ancestor.classList.add('subtle-has-video');
												shvFlag = true;
										}
								}

								// Step 3: Check if the ancestor hides overflow (based on computed style) and add "hides-video-overflow" class
								if (!el.classList.contains('hvo')) {
										const computedStyle = getComputedStyle(ancestor);
										if (computedStyle.overflow === 'hidden' || computedStyle.overflowX === 'hidden' || computedStyle.overflowY === 'hidden') {
												ancestor.classList.add('hides-video-overflow');
												hvoFlag = true;
										}
								}

								// Step 4: Check if the ancestor's height is close to the height of el (within 16px tolerance)
								if (!el.classList.contains('vh')) {
										const ancestorHeight = ancestor.getBoundingClientRect().height;
										if ((Math.abs(ancestorHeight - el.getBoundingClientRect().height) <= 16) && (!ancestor.classList.contains('vh-checked'))) {
												ancestor.classList.add('video-holder');
												ancestor.classList.add('vh-checked');
												vhFlag = true;

												// If a previous ancestor was marked as 'video-holder', remove it
												if (currentVideoHolder && currentVideoHolder !== ancestor) {
														currentVideoHolder.classList.remove('video-holder');

												}

												// Update the current video holder to this ancestor
												currentVideoHolder = ancestor;
										}
								}

								// Step 5: If the ancestor matches [data-tag="post-card"], stop (this is the final ancestor)
								if (ancestor.matches('[data-tag="post-card"]')) {
										if (shvFlag = true) {
												el.classList.add('shv');
										}
										if (hvoFlag = true) {
												el.classList.add('hvo');
										}
										if (vhFlag = true) {
												el.classList.add('vh');
										}
										break;
								}

								// Move to the next ancestor
								ancestor = ancestor.parentElement;
						}
				},
  },

		{
				selector: '.post-section', // Target the post-section
				handler: (el) => {
						const postSectionHeight = parseFloat(window.getComputedStyle(el).height); // Get the computed height of .post-section

						if (postSectionHeight >= 400) {
								log('Finding width-limited descendents based on a post-section height of: ' + postSectionHeight);

								const validDescendants = []; // Array to store valid descendants

								// Traverse through all descendants
								const allDescendants = el.getElementsByTagName('*');
								for (let child of allDescendants) {
										const childHeight = parseFloat(window.getComputedStyle(child).height);

										// Skip checking the children if the current child is too short
										if (childHeight < postSectionHeight * 0.5) {
												continue;
										}

										// If the child's height is at least 50% of the post-section's height, add it to the array
										if (childHeight >= postSectionHeight * 0.5) {
												validDescendants.push(child);
										}
								}

								// From the valid descendants, find those with a computed max-width
								validDescendants.forEach((descendant) => {
										const computedStyle = window.getComputedStyle(descendant);
										const maxWidth = computedStyle.maxWidth;

										// If max-width is set (not "none"), add the class
										if (maxWidth !== 'none') {
												descendant.classList.add('max-width-limited');
										}
								});
						}
				},
  },

    {
				selector: 'body',
				handler: (el) => {
						// NEW CHECK: If post-grid-header already exists, we're done.
						if (document.querySelector('.post-grid-header')) {
								return;
						}

						// Find the search input box using its original selector
						const searchInputBox = el.querySelector('.post-grid-left [data-tag="search-input-box"]');

						if (!searchInputBox) {
								return;
						}

						let currentAncestor = searchInputBox.parentElement;
						let foundHeader = false;

						while (currentAncestor && !foundHeader) {
								const hasH1 = currentAncestor.querySelector('h1');
								const buttons = currentAncestor.querySelectorAll('button');
								const hasMultipleButtons = buttons.length > 1;

								if (hasH1 && hasMultipleButtons) {
										currentAncestor.classList.add('post-grid-header');
										log('Assigned "post-grid-header" class to:', currentAncestor);
										foundHeader = true;
										break;
								}

								if (currentAncestor.classList.contains('main-body') || currentAncestor.classList.contains('post-grid-left')) {
										break;
								}
								currentAncestor = currentAncestor.parentElement;
						}
				},
		},

    {
				selector: '.post-grid-left', // Target elements with the 'post-grid-left' class
				handler: (el) => {
						// Find the first instance of [data-tag="search-input-box"] within this element
						const searchInputBox = el.querySelector('[data-tag="search-input-box"]');
						if (searchInputBox) {
								searchInputBox.classList.add('post-grid-left-search'); // Add the new class
								log('Assigned "post-grid-left-search" class to:', searchInputBox);
						}
				},
		},

  // Add more criteria as needed
];

// Handle elements that fit our criteria
const handleElement = (element) => {
		// log('Handling element: ' + element);
		// log('Handling element...');
		criteriaList.forEach((criterion) => {
				if (element.matches(criterion.selector)) {
						criterion.handler(element);
				}
		});
};

// Global variable to track idle state
let isIdle = false;
let idleInterval = null; // Interval that checks if idle time has passed

let mutationTimeout;

// Throttled function to handle mutations
const throttledHandleMutations = throttle((mutationsList) => {
		mutationsList.forEach((mutation) => {
        // log('Mutation detected:', mutation);
        log('Mutation detected.');
				// Reset the idleInterval whenever mutations occur
				isIdle = false;
				resetIdleInterval();
				mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1) { // Only process element nodes
                setTimeout(() => {
                    handleElement(node);
                    // Optionally, handle child nodes or deep inspection here
                    node.querySelectorAll('*').forEach(handleElement); // Check children as well
                }, 0);
						}
				});
		});
}, 250); // 250ms throttle interval

// Function to reset idleInterval and prevent going idle prematurely
function resetIdleInterval() {

		// Clear any existing idleInterval
		clearTimeout(idleInterval);

		// Set a new idleInterval to mark system as idle after 500ms of inactivity
		idleInterval = setTimeout(() => {
				isIdle = true; // Mark system as idle after 500ms of inactivity
				log('System is now idle');
		}, 2500); // 500ms idle period
}

function throttle(func, wait) {
		let timeout = null;
		let lastExec = 0;

		return function (...args) {
				const now = Date.now();
				if (now - lastExec >= wait) {
						func.apply(this, args);
						lastExec = now;
				} else {
						clearTimeout(timeout);
						timeout = setTimeout(() => {
								func.apply(this, args);
								lastExec = now;
						}, wait - (now - lastExec));
				}
		};
}

let idcInProgress = false;
let queuedIDC = false;

// Function to perform an initial check of the DOM
function initialDOMCheck(timeDelay) {
    const defaultDelay = 500;

		// if (isIdle) {
		// 		return;
		// }

    if (!timeDelay) {
        timeDelay = defaultDelay;
        // log('No time delay specified. Defaulting to ' + timeDelay);
    }

    if (idcInProgress) {
        queuedIDC = true;
        return;
    }

    log('Initial DOM check...');

    idcInProgress = true;

    setTimeout(() =>{
        idcInProgress = false;
        tryQueuedDelay();
    }, timeDelay);

		try {
				// return;
				// log('Performing initial dom check...');
				// Start from the body element
				const body = document.body;
				// Traverse and process all children of the body element as well
				body.querySelectorAll('*').forEach(handleElement); // Process all descendants of the body
				handleElement(body); // Process the body itself
		} catch (error) {
				log('Error occurred while appending buttons:', error);
				// Retry after 250ms if the operation fails
				setTimeout(initialDOMCheck, timeDelay);
		}

    function tryQueuedDelay() {
        if (queuedIDC) {
            queuedIDC = false;
            initialDOMCheck(timeDelay);
        }
    }
}

// Run the initial check to process existing elements
initialDOMCheck();

// Initialize MutationObserver
let observer = new MutationObserver(throttledHandleMutations);

loadSettingsFromLocalStorage();

try {
		appendButtons();
} catch (error) {
		log('Error occurred while appending buttons:', error);
		// Retry after 250ms if the operation fails
		setTimeout(appendButtons, 250);
}

let preload = true;

// Define the function
function repeatPreloadCheck(recheckTime) {
    const defaultDelay = 500;

    if (!recheckTime) {
        recheckTime = defaultDelay;
        // log('No time delay specified. Defaulting to ' + timeDelay);
    }

        initialDOMCheck(recheckTime);

    // Repeat the check again after 1 second if preload is true
    if (preload) {
        setTimeout(() => repeatPreloadCheck(500), 500);
    }
}

// Set the initial timeout to start the check
setTimeout(() => repeatPreloadCheck(500), 500); // Call repeatPreloadCheck after 1 second and pass 1000

window.addEventListener("load", function () {
		preload = false;
		log('DOM has loaded.');

		// Initial DOM check
		initialDOMCheck();
		loadSettingsFromLocalStorage();

		setTimeout(function () {
				loadSettingsFromLocalStorage();
		}, 1000);

    // loopAttachObservers();

		let loadCount = 0;
		// Set a timeout to do the check again after a specified delay (e.g., 1000ms = 1 second)
		setTimeout(function repeatCheck() {
				initialDOMCheck();
				loadCount++;

				// Repeat the check again after 1 second if count is less than 10
				if (loadCount < 10) {
						setTimeout(repeatCheck, 1000);
				}
		}, 1000); // 1000ms = 1 second delay (you can adjust this delay as needed)
});

// Configuration for the observer
const config = {
		childList: true, // Watch for added/removed nodes
		subtree: true, // Watch the entire body and subtrees
    // attributes: true, // Watch for attribute changes
};

// Start observing the document body
function attachBodyObserver() {
		const bodyPresent = checkBody();
		if (!bodyPresent) {
				// throw new Error('The body isn\'t ready.');
        setTimeout(attachBodyObserver, 250); // Retry after 250ms
        return; // Exit early and do nothing further
		}

    observer.observe(document.body, config);
    log('Mutation observer is set up');
}

attachBodyObserver();

// Save original functions
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

// Override pushState
history.pushState = function (state, title, url) {
    log('pushState called:', { state, title, url });
    preload = true;
    isIdle = false;
    repeatPreloadCheck(500);
    setTimeout(() => {
        preload = false;
        isIdle = true;
    }, 8000);
    // return originalPushState.apply(history, arguments);
};

// // Override replaceState
// history.replaceState = function (state, title, url) {
//     log('replaceState called:', { state, title, url });
//     // return originalReplaceState.apply(history, arguments);
// };
