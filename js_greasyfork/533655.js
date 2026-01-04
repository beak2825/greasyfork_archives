// ==UserScript==
// @name         Sora Moderation Helper
// @namespace    https://lugia19.com
// @version      0.12.4
// @description  Monitor image generation status from Sora, Auto-Retry, and filter only for successes
// @author       lugia19
// @license      MIT
// @match        https://sora.com/*
// @match        https://sora.chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/533655/Sora%20Moderation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/533655/Sora%20Moderation%20Helper.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const webDomain = "https://sora.chatgpt.com"
	const baseBackendURL = "https://sora.com/backend"

	let lastUrl = null;
	let currentUIRetryCount = 1;
	let mainUI = null;
	let retryTracker = null;
	let retrySubmitter = null;

	let pollingInterval = null;
	let authToken = null;
	let lastInfo = null; // Track the last known status
	const MAX_AUTO_RETRIES = 99;


	/**
	 * Base class for managing the status card UI
	 */
	class MainUI {
		constructor() {
			this.card = null;
			this.contentDiv = null;
			this.init();
		}

		init() {
			if (this.card) return this.card;

			this.card = document.createElement('div');
			this.card.id = 'generation-status-card';
			this.card.style.cssText = `
            position: fixed;
            top: 80vh;
            right: 20px;
            width: 300px;
            padding: 15px;
            background-color: black;
            color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border: 2px solid #aaa;
            border-radius: 6px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            display: none;
        `;

			const header = document.createElement('div');
			header.style.cssText = `
            margin-bottom: 10px;
            font-weight: bold;
            padding-bottom: 5px;
            border-bottom: 1px solid #444;
        `;
			header.textContent = 'Generation Status';

			this.contentDiv = document.createElement('div');
			this.contentDiv.id = 'generation-status-content';

			this.card.appendChild(header);
			this.card.appendChild(this.contentDiv);

			// Find container and append card
			let container = this.findContainer();
			container.appendChild(this.card);

			return this.card;
		}

		findContainer() {
			// Find a suitable container
			let container = document.querySelector('div[role="dialog"][data-state="open"]');
			if (!container) {
				container = document.querySelector('#__next') ||
					document.querySelector('.root') ||
					document.body;
			}
			return container;
		}

		updateStatus(taskInfo) {
			const { displayStatus, borderColor } = this.determineStatusAndColor(taskInfo);
			this.card.style.borderColor = borderColor;

			// Clear existing task status elements
			this.clearUI();

			// Add task info elements
			this.addTaskInfoElements(taskInfo, displayStatus);

			// Show the card
			this.show();

			return { displayStatus, borderColor };
		}

		clearUI() {
			// Keep UI components with specific IDs
			const children = Array.from(this.contentDiv.children);
			for (const child of children) {
				this.contentDiv.removeChild(child);
			}
		}

		addTaskInfoElements(taskInfo, displayStatus) {
			const taskIdDiv = document.createElement('div');
			taskIdDiv.innerHTML = `<strong>Task ID:</strong> ${taskInfo.id.replace('task_', '')}`;
			this.contentDiv.insertBefore(taskIdDiv, this.contentDiv.firstChild);

			const statusDiv = document.createElement('div');
			statusDiv.innerHTML = `<strong>Status:</strong> ${displayStatus}`;
			this.contentDiv.insertBefore(statusDiv, this.contentDiv.childNodes[1] || null);

			const progressDiv = document.createElement('div');
			progressDiv.innerHTML = `<strong>Progress:</strong> ${taskInfo.progress_pct !== undefined ? Math.round(taskInfo.progress_pct * 100) : 'undefined'}%`;
			this.contentDiv.insertBefore(progressDiv, this.contentDiv.childNodes[2] || null);
		}

		determineStatusAndColor(taskInfo) {
			let displayStatus = "N/A";
			let borderColor = "#aaa";

			if (taskInfo.status === "succeeded" && taskInfo.num_unsafe_generations < taskInfo.n_variants) {
				displayStatus = "Succeeded";
				borderColor = "#4CAF50"; // Green for success
			} else if (taskInfo.status === "running") {
				displayStatus = "Running";
				borderColor = "#aaa"; // Grey for running
			} else {
				// Check rejection conditions
				if (taskInfo.failure_reason === "input_moderation") {
					displayStatus = "Rejected (Input Filter)";
					borderColor = "#F44336"; // Red for rejection
				} else if (taskInfo.failure_reason === "output_moderation") {
					displayStatus = "Rejected (Output Filter)";
					borderColor = "#F44336"; // Red for rejection
				} else if (
					taskInfo.num_unsafe_generations !== undefined &&
					taskInfo.n_variants !== undefined &&
					taskInfo.num_unsafe_generations >= taskInfo.n_variants
				) {
					displayStatus = "Rejected (Unsafe Filter)";
					borderColor = "#F44336"; // Red for rejection
				} else if (taskInfo.status === "failed") {
					displayStatus = "Failed";
					borderColor = "#F44336"; // Red for failure
				}
			}

			return { displayStatus, borderColor };
		}

		show() {
			this.card.style.display = 'block';
		}

		hide() {
			this.card.style.display = 'none';
		}

		isTaskFailed(taskInfo) {
			const { displayStatus } = this.determineStatusAndColor(taskInfo);
			return taskInfo.status === 'failed' || displayStatus.includes('Rejected');
		}
	}

	/**
	 * Class for displaying retry chain progress
	 */
	class RetryTracker {
		constructor(mainUI) {
			this.mainUI = mainUI;
			this.container = null;
		}

		show(chain) {
			this.remove(); // Remove any existing tracker

			// Create container
			this.container = document.createElement('div');
			this.container.id = 'retry-tracker-container';
			this.container.style.cssText = `
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

			// Progress message
			const progressMessage = document.createElement('div');
			progressMessage.style.color = '#FFC107';
			progressMessage.innerHTML = `<strong>Auto-Retry in progress:</strong> ${chain.current}/${chain.total} attempts remaining`;

			// Stop button
			const stopButton = document.createElement('button');
			stopButton.textContent = 'Stop';
			stopButton.style.cssText = `
            background: #F44336;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        `;

			stopButton.addEventListener('mouseover', () => {
				stopButton.style.background = '#D32F2F';
			});

			stopButton.addEventListener('mouseout', () => {
				stopButton.style.background = '#F44336';
			});

			// Add click handler
			stopButton.addEventListener('click', () => {
				const currentTaskId = getCurrentTaskId();
				RetryChain.removeChainByTaskId(currentTaskId);
				console.log('Auto-retry stopped by user');
				this.remove();

				// Check if we should show the submitter
				if (lastInfo && this.mainUI.isTaskFailed(lastInfo)) {
					const submitter = new RetrySubmitter(this.mainUI);
					submitter.show();
				}
			});

			// Assemble container
			this.container.appendChild(progressMessage);
			this.container.appendChild(stopButton);

			// Add to main UI
			this.mainUI.contentDiv.appendChild(this.container);
		}

		remove() {
			if (this.container && this.container.parentNode) {
				this.container.parentNode.removeChild(this.container);
				this.container = null;
			}
		}
	}

	/**
	 * Class for the UI to submit a new retry
	 */
	class RetrySubmitter {
		constructor(mainUI) {
			this.mainUI = mainUI;
			this.container = null;
		}

		show() {
			this.remove(); // Remove any existing submitter

			// Create container
			this.container = document.createElement('div');
			this.container.id = 'retry-submitter-container';
			this.container.style.cssText = `
				margin-top: 10px;
				padding-top: 10px;
				border-top: 1px solid #444;
				display: flex;
				align-items: center;
				gap: 8px;
			`;

			// Label
			const retryLabel = document.createElement('label');
			retryLabel.textContent = 'Auto-Retry:';

			// Input
			const retryInput = document.createElement('input');
			retryInput.id = 'auto-retry-input';
			retryInput.type = 'number';
			retryInput.min = '1';
			retryInput.max = MAX_AUTO_RETRIES.toString();
			retryInput.value = currentUIRetryCount.toString();
			retryInput.style.cssText = `
				width: 50px;
				background: #333;
				color: white;
				border: 1px solid #555;
				border-radius: 4px;
				padding: 4px;
			`;

			retryInput.addEventListener('input', () => {
				let value = parseInt(retryInput.value);
				if (!isNaN(value)) {
					currentUIRetryCount = value;
				}
			});

			// Clamp input value
			retryInput.addEventListener('blur', () => {
				let value = parseInt(retryInput.value);
				if (isNaN(value) || value < 1) {
					value = 1;
				} else if (value > MAX_AUTO_RETRIES) {
					value = MAX_AUTO_RETRIES;
				}
				retryInput.value = value.toString();
				currentUIRetryCount = value;
			});

			// Button
			const retryButton = document.createElement('button');
			retryButton.textContent = 'Begin';
			retryButton.style.cssText = `
				background: #444;
				color: white;
				border: 1px solid #666;
				border-radius: 4px;
				padding: 4px 8px;
				cursor: pointer;
			`;

			retryButton.addEventListener('mouseover', () => {
				retryButton.style.background = '#555';
			});

			retryButton.addEventListener('mouseout', () => {
				retryButton.style.background = '#444';
			});

			// Click handler for the Begin button
			retryButton.addEventListener('click', async () => {
				// Use the current UI value stored in the global variable
				const count = currentUIRetryCount;
				if (count > 0 && count <= MAX_AUTO_RETRIES) {
					const currentTaskId = getCurrentTaskId();
					let newChain = null;

					try {
						// Fetch the current task's settings
						console.log(`Fetching settings for task ${currentTaskId}`);
						const response = await fetch(`https://${baseBackendURL}/video_gen/${currentTaskId}`, {
							headers: {
								'Authorization': `Bearer ${authToken}`,
								'Content-Type': 'application/json'
							}
						});

						if (response.ok) {
							const taskInfo = await response.json();

							// Create the retry chain
							newChain = RetryChain.createChain(currentTaskId, count);

							// Extract relevant settings to preserve
							const settings = {
								n_variants: taskInfo.n_variants || 2,
								prompt: taskInfo.prompt,
								height: taskInfo.height,
								width: taskInfo.width,
								operation: taskInfo.operation,
								inpaint_items: taskInfo.inpaint_items,
								remix_config: taskInfo.remix_config,
								model: taskInfo.model
							};

							// Store settings in the chain
							newChain.settings = { ...settings };
							RetryChain.updateChain(newChain);

							console.log('Stored original task settings for retry:', settings);
						} else {
							console.error('Failed to fetch task settings');
							// Fall back to basic chain
							newChain = RetryChain.createChain(currentTaskId, count);
						}
					} catch (error) {
						console.error('Error fetching task settings:', error);
						// Fall back to basic chain
						newChain = RetryChain.createChain(currentTaskId, count);
					} finally {
						if (newChain) {
							// Common UI update code
							this.remove();
							const tracker = new RetryTracker(this.mainUI);
							tracker.show(newChain);

							// Begin retry
							performAutoRetry(true);
						}
					}
				}
			});

			// Assemble container
			this.container.appendChild(retryLabel);
			this.container.appendChild(retryInput);
			this.container.appendChild(retryButton);

			// Add to main UI
			this.mainUI.contentDiv.appendChild(this.container);
		}

		remove() {
			if (this.container && this.container.parentNode) {
				this.container.parentNode.removeChild(this.container);
				this.container = null;
			}
		}
	}

	/**
	 * Class representing an auto-retry chain for Sora generations
	 */
	class RetryChain {
		/**
		 * Create a new retry chain
		 * @param {string} initialTaskId - The first task ID in the chain
		 * @param {number} totalRetries - Total number of retries for this chain
		 */
		constructor(initialTaskId, totalRetries) {
			this.taskIds = [initialTaskId];
			this.generationIds = [];
			this.total = totalRetries;
			this.current = totalRetries;
			this.settings = null;
		}

		/**
		 * Add a new task ID to this chain
		 * @param {string} taskId - The task ID to add
		 */
		addTask(taskId) {
			if (!this.taskIds.includes(taskId)) {
				this.taskIds.push(taskId);
			}
		}

		/**
		 * Add a generation ID to this chain
		 * @param {string} genId - The generation ID to add
		 */
		addGenerationId(genId) {
			if (!this.generationIds.includes(genId)) {
				this.generationIds.push(genId);
			}
		}

		/**
		 * Check if a task ID is part of this chain
		 * @param {string} taskId - Task ID to check
		 * @returns {boolean} True if task is in this chain
		 */
		containsTask(taskId) {
			return this.taskIds.includes(taskId);
		}

		/**
		 * Check if a generation ID is part of this chain
		 * @param {string} genId - Generation ID to check
		 * @returns {boolean} True if generation is in this chain
		 */
		containsGeneration(genId) {
			return this.generationIds.includes(genId);
		}

		/**
		 * Check if this chain has retries remaining
		 * @returns {boolean} True if retries remain
		 */
		hasRetriesLeft() {
			return this.current > 0;
		}

		/**
		 * Get most recent task ID in this chain
		 * @returns {string} Most recent task ID
		 */
		getLatestTaskId() {
			return this.taskIds[this.taskIds.length - 1];
		}

		// Static methods to manage chains in storage

		/**
		 * Save all chains to storage, filtering out expired chains
		 * @param {RetryChain[]} chains - Array of RetryChain objects
		 */
		static saveChains(chains) {
			// Convert the class instances to plain objects for storage
			const plainChains = chains.map(chain => ({
				taskIds: chain.taskIds,
				generationIds: chain.generationIds,
				total: chain.total,
				current: chain.current,
				settings: chain.settings
			}));

			GM_setValue('autoRetryChains', plainChains);
		}

		/**
		 * Load all chains from storage, filtering out expired chains
		 * @returns {RetryChain[]} Array of RetryChain objects
		 */
		static loadChains() {
			const plainChains = GM_getValue('autoRetryChains', []);

			// Convert the plain objects back to class instances, INCLUDING zero length ones.
			return plainChains.map(chain => {
				const newChain = new RetryChain('', 0);
				newChain.taskIds = chain.taskIds;
				newChain.generationIds = chain.generationIds || [];
				newChain.total = chain.total;
				newChain.current = chain.current;
				newChain.settings = chain.settings;
				return newChain;
			});
		}

		/**
		 * Clean up all expired chains (chains with no retries left)
		 * @returns {number} Number of chains removed
		 */
		static cleanupExpiredChains() {
			const chains = RetryChain.loadChains();
			const initialCount = chains.length;

			// Filter to keep only chains with retries left
			const activeChains = chains.filter(chain => chain.current > 0);

			if (activeChains.length !== initialCount) {
				RetryChain.saveChains(activeChains);
				console.log(`Cleaned up ${initialCount - activeChains.length} expired retry chains`);
				return initialCount - activeChains.length;
			}

			return 0;
		}

		/**
		 * Find a chain containing a specific task ID
		 * @param {string} taskId - Task ID to search for
		 * @returns {RetryChain|null} Matching chain or null if not found
		 */
		static findChainByTaskId(taskId) {
			const chains = RetryChain.loadChains();
			return chains.find(chain => chain.containsTask(taskId)) || null;
		}

		/**
		 * Find a chain containing a specific generation ID
		 * @param {string} genId - Generation ID to search for
		 * @returns {RetryChain|null} Matching chain or null if not found
		 */
		static findChainByGenerationId(genId) {
			const chains = RetryChain.loadChains();
			return chains.find(chain => chain.containsGeneration(genId)) || null;
		}

		/**
		 * Create a new chain and save it
		 * @param {string} taskId - Initial task ID for the chain
		 * @param {number} totalRetries - Total retries for this chain
		 * @returns {RetryChain} The newly created chain
		 */
		static createChain(taskId, totalRetries) {
			const chains = RetryChain.loadChains();
			const newChain = new RetryChain(taskId, totalRetries);
			chains.push(newChain);
			RetryChain.saveChains(chains);
			return newChain;
		}

		/**
		 * Remove a chain containing a specific task ID
		 * @param {string} taskId - Task ID in the chain to remove
		 * @returns {boolean} True if a chain was removed
		 */
		static removeChainByTaskId(taskId) {
			const chains = RetryChain.loadChains();
			const initialLength = chains.length;
			const filteredChains = chains.filter(chain => !chain.containsTask(taskId));

			if (filteredChains.length !== initialLength) {
				RetryChain.saveChains(filteredChains);
				return true;
			}
			return false;
		}

		/**
		 * Update an existing chain in storage
		 * @param {RetryChain} updatedChain - The chain with updated values
		 */
		static updateChain(updatedChain) {
			const chains = RetryChain.loadChains();
			const index = chains.findIndex(chain =>
				chain.taskIds.some(id => updatedChain.taskIds.includes(id))
			);

			if (index !== -1) {
				chains[index] = updatedChain;
				RetryChain.saveChains(chains);
			}
		}

		/**
		 * Check if a task ID is the latest in this chain
		 * @param {string} taskId - Task ID to check
		 * @returns {boolean} True if task is the latest in the chain
		 */
		isLatestTask(taskId) {
			if (this.taskIds.length === 0) return false;
			return this.taskIds[this.taskIds.length - 1] === taskId;
		}

		/**
		 * Static method to check if a task is the latest in its chain
		 * @param {string} taskId - Task ID to check
		 * @returns {boolean} True if task is the latest in its chain
		 */
		static isLatestTaskInChain(taskId) {
			const chain = RetryChain.findChainByTaskId(taskId);
			if (!chain) return false;
			return chain.isLatestTask(taskId);
		}
	}

	RetryChain.cleanupExpiredChains();

	function getSuccessesOnlyFilter() {
		return GM_getValue('successesOnlyFilter', false);
	}

	function setSuccessesOnlyFilter(value) {
		GM_setValue('successesOnlyFilter', value);
	}

	// Function to perform auto-retry
	async function performAutoRetry(immediate = false) {
		if (!immediate) await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds before retrying

		const currentTaskId = getCurrentTaskId();
		const chain = RetryChain.findChainByTaskId(currentTaskId);

		if (!chain) return; // No chain found for this task

		console.log(`Auto-retry initiated, attempts remaining: ${chain.current}`);

		// Decrement the retry counter IF we're switching chains.
		if (unsafeWindow.currentRetryTaskId != currentTaskId) {
			chain.current--;
			RetryChain.updateChain(chain);
		}


		if (chain.current < 0) {
			RetryChain.removeChainByTaskId(currentTaskId);
			return;
		}

		// Set a temporary flag just for the request interception to work
		unsafeWindow.currentRetryTaskId = currentTaskId;

		try {
			// Step 1: Find and click the Remix button on the main page
			await new Promise(r => setTimeout(r, 3000));
			const remixContainer = document.querySelector('.flex.w-full.items-center.justify-center.tablet\\:w-1\\/2');
			if (remixContainer) {
				const button = remixContainer.querySelector('button');
				if (button) {
					console.log('Found remix button, clicking...');
					button.click();

					// Wait for the dialog to appear
					await new Promise(resolve => setTimeout(resolve, 3000));

					// Step 2: Handle the dialog that appears
					// Case 1: Dialog with a "Remix" button
					const remixButton = Array.from(document.querySelectorAll('button')).find(btn =>
						btn.textContent.trim() === 'Remix' &&
						btn.closest('[role="dialog"]')
					);

					if (remixButton) {
						console.log('Found Remix button in dialog, clicking...');
						remixButton.click();
						// Set a flag to indicate we're in auto-retry mode
						unsafeWindow.popupRetryInProgress = true;
						return;
					}

					// Case 2: Dialog with a "Create image" button (with up arrow SVG)
					const createButtons = document.querySelectorAll('[data-state="closed"] svg');
					for (const svg of createButtons) {
						// Look for the SVG path with the up arrow path data
						const path = svg.querySelector('path[d*="11.293 5.293"]');
						if (path) {
							// Found the create image button
							const createButton = svg.closest('button');
							if (createButton) {
								console.log('Found Create image button in dialog, clicking...');
								createButton.click();
								unsafeWindow.popupRetryInProgress = true;
								return;
							}
						}
					}

					// Case 3: Left for future implementation
					console.log('No recognized dialog buttons found, may need to implement additional case');
				} else {
					console.error('Could not find button in remix container');
				}
			} else {
				console.error('Could not find remix container');
			}
		} catch (error) {
			console.error('Error during auto-retry:', error);
		}

		// If we get here, something went wrong with the retry attempt
		// We'll reload the page anyway as a fallback
		console.log('Auto-retry failed, reloading page...');
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}

	// Function to show browser notification
	function showNotification(title, message) {
		if (Notification.permission === 'granted') {
			const notification = new Notification(title, {
				body: message,
				icon: `${webDomain}/favicon.ico` // Sora favicon as icon
			});

			notification.onclick = function () {
				unsafeWindow.focus();
				notification.close();
			};

			// Auto close after 10 seconds
			setTimeout(() => notification.close(), 10000);
		}
	}

	// Create the status card once
	function initUI() {
		if (!mainUI) {
			mainUI = new MainUI();
			retryTracker = new RetryTracker(mainUI);
			retrySubmitter = new RetrySubmitter(mainUI);
		}
		return mainUI;
	}

	function getCurrentTaskId() {
		const match = location.pathname.match(/\/t\/(task_[a-zA-Z0-9]+)/);
		return match ? match[1] : null;
	}

	// Function to update the status card with taskInfo
	function updateStatusCard(taskInfo) {
		const ui = initUI();
		const { displayStatus, borderColor } = ui.updateStatus(taskInfo);

		const currentTaskId = getCurrentTaskId();
		const chain = RetryChain.findChainByTaskId(currentTaskId);
		const isFailed = ui.isTaskFailed(taskInfo);

		// Detect state transitions from running to completed for notifications
		if (lastInfo && lastInfo.status === 'running' && taskInfo.status !== 'running') {
			if (taskInfo.status === 'succeeded' && !isFailed) {
				// Always notify on success
				showNotification(
					'Sora Generation Complete',
					`Your generation is successful! ${taskInfo.id}`
				);

				// If this was part of a chain, remove it
				if (chain) {
					RetryChain.removeChainByTaskId(currentTaskId);
					retryTracker.remove();
				}

				// Reload page after success
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else if (isFailed && !chain) {
				// Only notify on failure if not part of a retry chain
				showNotification(
					'Sora Generation Failed',
					`Your generation was ${displayStatus.toLowerCase()}! ${taskInfo.id}`
				);

				// Reload page after failed state with no chain
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else if (taskInfo.status == "cancelled") {
				if (chain) {
					RetryChain.removeChainByTaskId(currentTaskId);
					retryTracker.remove();
				}
			}
		}

		// Handle retry UI and retry logic independently of state transitions
		if (chain) {
			// Show retry tracker for any task in a chain
			retryTracker.show(chain);

			// If task has failed and has retries left, initiate a retry
			// This happens regardless of previous state
			if (isFailed && chain.hasRetriesLeft() && !unsafeWindow.currentRetryTaskId) {
				console.log(`Task failed, auto-retrying (${chain.current} left)`);
				performAutoRetry();
			}
		} else if (isFailed) {
			// No chain but task failed, show retry submitter
			retrySubmitter.show();
		} else {
			// Not failed and not in chain, remove both UI elements
			retryTracker.remove();
			retrySubmitter.remove();
		}

		// Store last info
		lastInfo = { ...taskInfo };
		ui.show();
	}

	// Fetch task status directly
	async function fetchTaskStatus(taskId) {
		if (!authToken) {
			console.error('No auth token available for API request');
			return null;
		}

		try {
			const response = await fetch(`${baseBackendURL}/video_gen/${taskId}`, {
				headers: {
					'Authorization': `Bearer ${authToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const taskInfo = await response.json();
			updateStatusCard(taskInfo);
			return taskInfo;
		} catch (error) {
			console.error('Error fetching task status:', error);
			return null;
		}
	}

	// Start polling for task status
	function startTaskPolling(taskId) {
		// Clear any existing polling
		stopTaskPolling();

		// Reset last status when starting new polling
		lastInfo = null;

		// Fetch immediately, then start polling
		fetchTaskStatus(taskId);

		pollingInterval = setInterval(() => {
			fetchTaskStatus(taskId).then(taskInfo => {
				// If task is complete or failed, we can stop polling
				if (taskInfo && (taskInfo.status === 'succeeded' || taskInfo.status === 'failed')) {
					// Continue polling for a short time after completion to ensure we get final status
					setTimeout(() => {
						stopTaskPolling();
					}, 30000); // Keep polling for 30 seconds after completion
				}
			});
		}, 10000); // Poll every 10 seconds
	}

	// Stop polling for task status
	function stopTaskPolling() {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			pollingInterval = null;
		}
	}




	// Filtering changes
	function addSuccessesOnlyFilterOption() {
		// Find the filter menu
		const filterMenu = document.querySelector('[role="menu"][data-radix-menu-content]');
		console.log('Filter menu:', filterMenu);
		if (!filterMenu) return false;
		console.log('Filter menu found:', filterMenu);
		console.log("Successes only filter found yet? ", filterMenu.querySelector('#successes-only-filter'));
		// Check if our option is already added
		if (filterMenu.querySelector('#successes-only-filter')) return true;

		// Create our checkbox item based on the existing ones
		const successesOnlyItem = document.createElement('div');
		successesOnlyItem.id = 'successes-only-filter';
		successesOnlyItem.setAttribute('role', 'menuitemcheckbox');
		successesOnlyItem.setAttribute('aria-checked', getSuccessesOnlyFilter() ? 'true' : 'false');
		successesOnlyItem.setAttribute('data-state', getSuccessesOnlyFilter() ? 'checked' : 'unchecked');
		successesOnlyItem.setAttribute('tabindex', '-1');
		successesOnlyItem.setAttribute('data-orientation', 'vertical');
		successesOnlyItem.setAttribute('data-radix-collection-item', '');
		successesOnlyItem.className = 'group relative flex cursor-default select-none items-center gap-2 rounded-[10px] px-2 py-2.5 text-sm outline-none focus:bg-token-bg-light data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

		// Content
		successesOnlyItem.innerHTML = `
			<div class="flex flex-1 items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-[18px] w-[18px]">
					<path fill="currentColor" d="M21.043 3.393a2.16 2.16 0 0 1 .523 3.007l-10.25 14.564a2.158 2.158 0 0 1-3.36.21L2.56 15.24a2.158 2.158 0 0 1 3.193-2.903l3.583 3.941 8.7-12.362a2.16 2.16 0 0 1 3.006-.523"></path>
				</svg>Successes Only (SLOW!)
			</div>
			<div class="rounded-md border border-token-bg-active group-data-[state=checked]:bg-token-bg-inverse group-data-[state=checked]:border-token-bg-inverse flex h-4 w-4 items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-2.5 w-2.5 text-token-bg-primary opacity-0 group-data-[state=checked]:opacity-100">
					<path fill="currentColor" d="M21.043 3.393a2.16 2.16 0 0 1 .523 3.007l-10.25 14.564a2.158 2.158 0 0 1-3.36.21L2.56 15.24a2.158 2.158 0 0 1 3.193-2.903l3.583 3.941 8.7-12.362a2.16 2.16 0 0 1 3.006-.523"></path>
				</svg>
			</div>
		`;

		// Add click handler
		successesOnlyItem.addEventListener('click', function () {
			const isChecked = this.getAttribute('data-state') === 'checked';
			const newState = !isChecked;

			this.setAttribute('data-state', newState ? 'checked' : 'unchecked');
			this.setAttribute('aria-checked', newState ? 'true' : 'false');

			setSuccessesOnlyFilter(newState);

			// Log the change
			console.log('Successes Only filter set to:', newState);

			// Reload the page to apply the filter
			setTimeout(() => {
				window.location.reload();
			}, 100); // Small delay to ensure the setting is saved
		});

		// Add our item to the menu - after all the existing items
		filterMenu.appendChild(successesOnlyItem);

		return true;
	}

	// Function to monitor for the filter menu appearing
	function monitorForFilterMenu() {
		let attempts = 0;
		const maxAttempts = 20; // 20 * 50ms = 1 second max wait time
		let checkInterval;

		function checkForFilterMenu() {
			attempts++;

			if (addSuccessesOnlyFilterOption()) {
				// Success! Menu found and option added
				clearInterval(checkInterval);
			} else if (attempts >= maxAttempts) {
				// Give up after max attempts
				clearInterval(checkInterval);
				console.log('Filter menu not found after maximum attempts');
			}
		}

		checkInterval = setInterval(checkForFilterMenu, 50);
	}



	// Monkeypatch fetch for auto retry and filter
	const originalFetch = unsafeWindow.fetch;

	unsafeWindow.fetch = async function (input, init) {
		// Extract the auth token from outgoing requests
		if (init && init.headers) {
			const authHeader = init.headers.Authorization || init.headers.authorization;
			if (authHeader && authHeader.startsWith('Bearer ')) {
				authToken = authHeader.substring(7); // Remove 'Bearer ' prefix
			}
		}

		// Handle the GET requests to filter library results
		if (typeof input === 'string' &&
			input.includes('backend/v2/list_tasks') &&
			input.includes('limit=') &&
			init && init.method === 'GET' && location.href.includes("library")) {
			const num_tasks_match = input.match(/limit=(\d+)/);
			const num_tasks = num_tasks_match ? parseInt(num_tasks_match[1]) : 20;
			// Check if Successes Only filter is enabled
			const successesOnlyEnabled = getSuccessesOnlyFilter();

			if (successesOnlyEnabled) {
				const url = new URL(`${baseBackendURL.split("/backend")[0]}` + input);
				const limitParam = url.searchParams.get('limit');
				const beforeParam = url.searchParams.get('before');
				const afterParam = url.searchParams.get('after');
				const isPaginatingBackwards = Boolean(beforeParam);

				console.log(`Intercepting library request with Successes Only filter enabled. Direction: ${isPaginatingBackwards ? 'backwards' : 'forwards'}`);

				// Make the original request
				const response = await originalFetch(input, init);
				const originalResponseData = await response.clone().json();

				// If there are no task_responses or it's not an array, just return the original response
				if (!originalResponseData.task_responses || !Array.isArray(originalResponseData.task_responses)) {
					return response;
				}

				// Begin collecting successful tasks
				let allSuccessfulTasks = [];
				let currentPaginationId = null;
				let hasMore = originalResponseData.has_more;

				// Add successful tasks from the current response
				const successfulTasks = originalResponseData.task_responses.filter(task =>
					task.status === 'succeeded' &&
					(task.num_unsafe_generations === undefined ||
						task.n_variants === undefined ||
						task.num_unsafe_generations < task.n_variants)
				);

				allSuccessfulTasks = allSuccessfulTasks.concat(successfulTasks);

				// Set the appropriate ID for pagination based on direction
				if (isPaginatingBackwards) {
					currentPaginationId = originalResponseData.first_id;
				} else {
					currentPaginationId = originalResponseData.last_id;
				}

				// If we don't have enough successful tasks (num_tasks) and there are more available, fetch more
				while (allSuccessfulTasks.length < num_tasks && hasMore && currentPaginationId) {
					console.log(`Need more tasks, currently have ${allSuccessfulTasks.length}, fetching more ${isPaginatingBackwards ? 'backwards' : 'forwards'}...`);

					// Construct the URL for the next page based on pagination direction
					const nextPageUrl = new URL(url.origin + url.pathname);
					nextPageUrl.searchParams.set('limit', limitParam || '20');

					if (isPaginatingBackwards) {
						nextPageUrl.searchParams.set('before', currentPaginationId);
					} else {
						nextPageUrl.searchParams.set('after', currentPaginationId);
					}

					try {
						const nextPageResponse = await originalFetch(nextPageUrl.toString(), init);
						const nextPageData = await nextPageResponse.json();

						if (!nextPageData.task_responses || !Array.isArray(nextPageData.task_responses)) {
							break; // Something went wrong, stop fetching
						}

						// Filter for successful tasks
						const nextSuccessfulTasks = nextPageData.task_responses.filter(task =>
							task.status === 'succeeded' &&
							(task.num_unsafe_generations === undefined ||
								task.n_variants === undefined ||
								task.num_unsafe_generations < task.n_variants)
						);

						// Add to our collection
						allSuccessfulTasks = allSuccessfulTasks.concat(nextSuccessfulTasks);

						// Update for next iteration
						hasMore = nextPageData.has_more;

						if (isPaginatingBackwards) {
							currentPaginationId = nextPageData.first_id;
						} else {
							currentPaginationId = nextPageData.last_id;
						}

						if (!hasMore || !currentPaginationId) {
							break; // No more pages to fetch
						}
					} catch (error) {
						console.error('Error fetching additional tasks:', error);
						break;
					}
				}

				// Limit to num_tasks tasks maximum
				allSuccessfulTasks = allSuccessfulTasks.slice(0, num_tasks);

				console.log(`Returning ${allSuccessfulTasks.length} successful tasks for ${isPaginatingBackwards ? 'backwards' : 'forwards'} pagination`);

				// Create modified response with just the successful tasks
				const modifiedResponse = {
					...originalResponseData,
					task_responses: allSuccessfulTasks,
					// If we have exactly num_tasks successful tasks and hasMore was true, there might be more
					has_more: allSuccessfulTasks.length >= num_tasks && hasMore
				};

				// Set the appropriate first_id or last_id based on pagination direction
				if (isPaginatingBackwards && allSuccessfulTasks.length > 0) {
					modifiedResponse.first_id = allSuccessfulTasks[0].id;
				}
				if (!isPaginatingBackwards && allSuccessfulTasks.length > 0) {
					modifiedResponse.last_id = allSuccessfulTasks[allSuccessfulTasks.length - 1].id;
				}

				// Create a new Response object with our modified data
				return new Response(JSON.stringify(modifiedResponse), {
					status: 200,
					statusText: 'OK',
					headers: response.headers
				});
			}
		}

		const chain = (unsafeWindow.currentRetryTaskId) ? RetryChain.findChainByTaskId(unsafeWindow.currentRetryTaskId) : null;
		if (chain) {
			console.log("Found chain:")
			console.log(chain)
		}

		if (typeof input === 'string' &&
			input.includes('/g/gen_') &&
			unsafeWindow.currentRetryTaskId) {
			try {
				// Extract the generation ID from the URL
				const genIdMatch = input.match(/\/g\/(gen_[a-zA-Z0-9]+)/);
				if (genIdMatch && genIdMatch[1]) {
					const genId = genIdMatch[1];
					console.log(`Detected navigation to generation ${genId} during retry of task ${unsafeWindow.currentRetryTaskId}`);
					if (chain) {
						// Add the generation ID to the chain
						chain.addGenerationId(genId);
						RetryChain.updateChain(chain);
						console.log(`Added generation ID ${genId} to retry chain`);

						// Store this for potential URL change handler
						unsafeWindow.lastRetryGenId = genId;
					}
				}
			} catch (error) {
				console.error('Error tracking generation ID:', error);
			}
		}

		// In the fetch monkeypatch
		if (typeof input === 'string' &&
			input.includes('backend/video_gen') &&
			init && init.method === 'POST' &&
			unsafeWindow.currentRetryTaskId) {

			try {
				if (chain) {
					// Get the stored settings
					const settings = chain.settings;
					console.log("Got settings", settings)
					if (settings) {
						// Parse the original body
						const body = JSON.parse(init.body);

						console.log('Original request body:', JSON.stringify(body));

						// Apply all the stored settings from the original task by iterating over properties
						for (const [key, value] of Object.entries(settings)) {
							if (value !== undefined) {
								body[key] = value;
							}
						}
						// Update the request body
						init.body = JSON.stringify(body);

						console.log('Applied original settings to new generation request', JSON.stringify(body));
					}
				} else {
					console.log('No chain found for task ID:', unsafeWindow.currentRetryTaskId);
				}
			} catch (error) {
				console.error('Error applying stored settings to request:', error);
			}
		}

		const response = await originalFetch(input, init);
		const responseClone = response.clone();
		console.log("Current retry task ID:", unsafeWindow.currentRetryTaskId)
		// When capturing the response after a retry
		if (typeof input === 'string' &&
			input.includes('backend/video_gen') &&
			init && init.method === 'POST' &&
			unsafeWindow.currentRetryTaskId) {

			try {
				// Get the body from the response
				const body = await responseClone.json();
				if (body && body.id) {
					const newTaskId = body.id;
					if (chain) {
						// Add the new task to the chain
						chain.addTask(newTaskId);
						RetryChain.updateChain(chain);
					}
					// Clear the temporary flag
					unsafeWindow.currentRetryTaskId = null;

					// Navigate to the new task
					console.log(`Auto-retry successful, navigating to task: ${newTaskId}`);
					unsafeWindow.location.href = `${webDomain}/t/${newTaskId}`;
				}
			} catch (error) {
				console.error('Error capturing new task ID:', error);
			}
		}

		if (typeof input === 'string') {
			try {
				// Check for auth token in response headers (alternative method)
				const authHeader = response.headers.get('Authorization') || response.headers.get('authorization');
				if (authHeader && authHeader.startsWith('Bearer ')) {
					authToken = authHeader.substring(7);
					console.log('Auth token captured from response');
				}

				const currentTaskId = getCurrentTaskId();
				if (currentTaskId) {
					let taskInfo = null;

					if (input.includes('backend/notif')) {
						const response = await responseClone.json();
						if (response && Array.isArray(response.data)) {
							taskInfo = response.data.find(item =>
								item.payload && item.payload.id === currentTaskId
							)?.payload;
						}
					} else if (input.match(/\/backend\/video_gen\/task_[a-zA-Z0-9]+/)) {
						const data = await responseClone.json();
						if (data.id === currentTaskId) {
							taskInfo = data;
						}
					}

					if (taskInfo) {
						updateStatusCard(taskInfo);
					}
				}
			} catch (error) {
				console.error('Error processing response:', error);
			}
		}

		return response;
	};



	// Check URL changes for task retry and filter addon
	setInterval(() => {
		const currentUrl = location.href;
		if (currentUrl !== lastUrl) {
			lastUrl = currentUrl;


			// Reset UI if URL changes
			if (mainUI) {
				// Remove existing UI elements
				const cardElement = document.getElementById('generation-status-card');
				if (cardElement && cardElement.parentNode) {
					cardElement.parentNode.removeChild(cardElement);
				}

				// Reset UI instances
				mainUI = null;
				retryTracker = null;
				retrySubmitter = null;
			}

			// Check if we're on a generation page with remix parameter
			if (currentUrl.includes('/g/gen_')) {
				// Extract the generation ID
				const genIdMatch = currentUrl.match(/\/g\/(gen_[a-zA-Z0-9]+)/);

				if (genIdMatch && genIdMatch[1]) {
					const genId = genIdMatch[1];

					// First, check if this generation is part of any retry chain
					let chain = RetryChain.findChainByGenerationId(genId);

					// If not found but we have a last retry gen ID, use that
					if (!chain && unsafeWindow.lastRetryGenId === genId) {
						// This is a new generation page we just navigated to in a retry
						const sourceTaskId = unsafeWindow.currentRetryTaskId;
						if (sourceTaskId) {
							chain = RetryChain.findChainByTaskId(sourceTaskId);

							if (chain) {
								// Add this generation ID to the chain
								chain.addGenerationId(genId);
								RetryChain.updateChain(chain);
								console.log(`Added generation ID ${genId} to retry chain from URL change handler`);
							}
						}
					}

					// If this generation is part of a retry chain and has the remix parameter
					if (chain && currentUrl.includes('?remix=') && chain.hasRetriesLeft()) {
						console.log('Detected gen page with remix parameter, auto-retry in progress');

						// Look for the Remix button on this page and click it
						setTimeout(() => {
							const remixButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
								btn.textContent.trim() === 'Remix'
							);

							if (remixButtons.length > 0) {
								console.log('Found Remix button on gen page, clicking...');
								remixButtons[0].click();

								// Set the latest task ID for tracking in request interception
								unsafeWindow.currentRetryTaskId = chain.getLatestTaskId();
							} else {
								console.error('Could not find Remix button on gen page');

								// Reload page
								window.location.reload();
							}
						}, 1000); // Wait a second for the page to fully load
					}
				}
			} else {

			}

			// Handle library filter setup
			if (currentUrl.includes(`${webDomain}/library`)) {
				console.log('On library page, setting up filter button monitoring');

				// Find the filter button (using the existing setupFilterButtonMonitoring function)
				const setupFilterButtonMonitoring = () => {
					// Look for button with filter SVG path
					const filterButtons = document.querySelectorAll('button');
					let filterButton = null;

					for (const button of filterButtons) {
						// Check for the "Filter" text in screen reader span
						console.log("Checking button:", button)
						const srSpan = button.querySelector('.sr-only');
						if (srSpan && srSpan.textContent === 'Filter') {
							filterButton = button.closest('[aria-haspopup="menu"]');
							console.log("Found filter button:", filterButton)
							break;
						}
					}

					if (filterButton) {
						console.log("Adding listener...")
						// Add click listener to the filter button
						filterButton.addEventListener('pointerdown', function () {
							console.log('Filter button pointerdown, monitoring for menu');
							monitorForFilterMenu();
						});
					} else {
						// Button not found yet, try again after a short delay
						setTimeout(setupFilterButtonMonitoring, 500);
					}
				};

				setupFilterButtonMonitoring();
			}

			// Get current task ID
			const currentTaskId = getCurrentTaskId();

			if (currentTaskId) {
				// Start polling for this task
				startTaskPolling(currentTaskId);
				RetryChain.cleanupExpiredChains();	//Clean up expired chains
				// Initialize UI
				initUI();

				// Check if this task is part of a retry chain
				const chain = RetryChain.findChainByTaskId(currentTaskId);
				if (chain) {
					// Show retry tracker for this chain
					retryTracker.show(chain);
				}
			} else {
				// Not on a task page, stop polling and hide the card
				stopTaskPolling();
				if (mainUI) {
					mainUI.hide();
				}
			}
		}
	}, 1000);

	// Request notification permission
	function requestNotificationPermission() {
		if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
			Notification.requestPermission().then(permission => {
				console.log('Notification permission:', permission);
			});
		}
	}

	// Call this during initialization
	requestNotificationPermission();

	console.log('Sora Generation Status Monitor initialized');
})();