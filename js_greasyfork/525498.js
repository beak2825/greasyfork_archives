// ==UserScript==
// @name         Auto-Merge Dependabot PRs
// @namespace    typpi.online
// @version      6.7
// @description  Merges Dependabot PRs in any of your repositories - pulls the PRs into a table and lets you select which ones to merge.
// @author       Nick2bad4u
// @match        https://github.com/notifications
// @match        https://github.com/*/*/pull/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.github.com
// @license      UnLicense
// @tag          github
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues

// @downloadURL https://update.greasyfork.org/scripts/525498/Auto-Merge%20Dependabot%20PRs.user.js
// @updateURL https://update.greasyfork.org/scripts/525498/Auto-Merge%20Dependabot%20PRs.meta.js
// ==/UserScript==
/* global GM_getValue, GM_setValue, GM_addStyle, GM_xmlhttpRequest */
// @var          number merge_delay "Delay between merge requests in milliseconds" 2000

// Utility wrappers for GM_* APIs with graceful fallback to localStorage
function safeGM_getValue(key, defaultValue) {
	if (typeof GM_getValue === 'function') {
		try {
			return GM_getValue(key, defaultValue);
		} catch (e) {
			console.warn('[Auto-Merge Dependabot PRs] GM_getValue failed, falling back to localStorage:', e);
		}
	}
	try {
		const val = localStorage.getItem(key);
		return val !== null ? JSON.parse(val) : defaultValue;
	} catch (e) {
		console.error('[Auto-Merge Dependabot PRs] localStorage getItem failed:', e);
		return defaultValue;
	}
}

function safeGM_setValue(key, value) {
	if (typeof GM_setValue === 'function') {
		try {
			return GM_setValue(key, value);
		} catch (e) {
			console.warn('[Auto-Merge Dependabot PRs] GM_setValue failed, falling back to localStorage:', e);
		}
	}
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('[Auto-Merge Dependabot PRs] localStorage setItem failed:', e);
	}
}

function safeGM_addStyle(css) {
	if (typeof GM_addStyle === 'function') {
		try {
			GM_addStyle(css);
			return;
		} catch (e) {
			console.warn('[Auto-Merge Dependabot PRs] GM_addStyle failed, falling back to <style>:', e);
		}
	}
	try {
		const fallbackStyle = document.createElement('style');
		fallbackStyle.textContent = css;
		document.head.appendChild(fallbackStyle);
	} catch (e) {
		console.error('[Auto-Merge Dependabot PRs] Fallback <style> injection failed:', e);
	}
}

(async function () {
	'use strict';

	// Delay between each merge request in milliseconds, configurable via the 'merge_delay' variable stored in safeGM_getValue (default is 2000ms)
	let delay = safeGM_getValue('merge_delay', 2000);
	if (delay <= 0) {
		delay = 2000; // default value if invalid
	} else {
		delay = Number(delay);
	}

	/**
	 * Shows a modal dialog for secure GitHub token input.
	 * @returns {Promise<string>} The entered token.
	 */
	async function showSecureTokenInputModal() {
		return new Promise((resolve) => {
			let modal = document.getElementById('merge-dependabot-token-modal');
			if (!modal) {
				modal = document.createElement('div');
				modal.id = 'merge-dependabot-token-modal';
				modal.setAttribute('role', 'dialog');
				modal.setAttribute('aria-modal', 'true');
				modal.setAttribute('aria-labelledby', 'merge-dependabot-token-modal-title');
				modal.setAttribute('aria-describedby', 'merge-dependabot-token-modal-desc');
				modal.tabIndex = -1;
				modal.className = 'merge-dependabot-modal';
				modal.style = `
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: white;
					border: 1px solid #ccc;
					padding: 20px;
					z-index: 1000;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
				`;

				modal.innerHTML = `
					<h3 id="merge-dependabot-token-modal-title">Enter GitHub Token</h3>
					<p id="merge-dependabot-token-modal-desc">Please enter your GitHub token securely:</p>
					<input type="password" id="merge-dependabot-token-input" style="width: 100%; padding: 8px; margin-bottom: 10px;" aria-label="GitHub token" class="merge-dependabot-token-input" />
					<button id="merge-dependabot-submit-token" style="padding: 8px 16px;" class="merge-dependabot-btn">Submit</button>
					<button id="merge-dependabot-close-token-modal" aria-label="Close token modal" style="margin-left:10px;" class="merge-dependabot-btn">Close</button>
				`;

				document.body.appendChild(modal);

				const input = document.getElementById('merge-dependabot-token-input');
				const submitBtn = document.getElementById('merge-dependabot-submit-token');
				const closeBtn = document.getElementById('merge-dependabot-close-token-modal');

				// Focus management
				setTimeout(() => input.focus(), 0);
				const focusableEls = [input, submitBtn, closeBtn];
				let lastFocused = document.activeElement;

				function trapFocus(e) {
					if (e.key === 'Tab') {
						const idx = focusableEls.indexOf(document.activeElement);
						if (e.shiftKey) {
							if (idx === 0) {
								e.preventDefault();
								focusableEls[focusableEls.length - 1].focus();
							}
						} else {
							if (idx === focusableEls.length - 1) {
								e.preventDefault();
								focusableEls[0].focus();
							}
						}
					}
				}
				modal.addEventListener('keydown', trapFocus);

				submitBtn.addEventListener('click', () => {
					const tokenInput = input.value;
					console.log('[Auto-Merge Dependabot PRs] Token entered via modal.');
					modal.remove();
					if (lastFocused) lastFocused.focus();
					resolve(tokenInput);
				});
				closeBtn.addEventListener('click', () => {
					modal.remove();
					if (lastFocused) lastFocused.focus();
					resolve('');
				});
			}
		});
	}

	/**
	 * Initializes the script by ensuring a valid token and username are set.
	 */
	async function initialize() {
		let token;
		try {
			// Attempt to retrieve and decrypt the token
			token = await retrieveAndDecryptToken();
			console.log('[Auto-Merge Dependabot PRs] Token retrieved and decrypted.');
		} catch (error) {
			console.error('[Auto-Merge Dependabot PRs] Failed to retrieve and decrypt token:', error);
			alert('Failed to retrieve and decrypt token. Please check the console for more details.');
			throw error; // Stop further execution
		}

		if (!token) {
			while (!token) {
				token = await showSecureTokenInputModal();
				if (!token) {
					alert('GitHub token is required. Please enter a valid token.');
					token = null;
				} else {
					try {
						await validateGitHubToken(token);
						console.log('[Auto-Merge Dependabot PRs] GitHub token validated.');
					} catch (e) {
						console.error('[Auto-Merge Dependabot PRs] Invalid GitHub token:', e);
						alert('Invalid GitHub token. Please enter a valid token.');
						token = null;
					}
				}
			}
			try {
				await encryptAndStoreToken(token);
				console.log('[Auto-Merge Dependabot PRs] Token encrypted and stored.');
			} catch (error) {
				console.error('[Auto-Merge Dependabot PRs] Failed to encrypt and store token:', error);
				alert('Failed to encrypt and store token. Please check the console for more details.');
				throw error; // Stop further execution
			}
		}

		let username = safeGM_getValue('github_username') || '';
		if (typeof username !== 'string' || username.trim() === '' || /[^a-zA-Z0-9-_]/.test(username)) {
			username = ''; // Reset to empty if invalid
		}
		while (!username || username.trim() === '') {
			username = prompt('Please enter your GitHub username:');
			if (username && username.trim() !== '') {
				try {
					await validateGitHubUsername(username, token);
					safeGM_setValue('github_username', username);
					console.log('[Auto-Merge Dependabot PRs] GitHub username validated and saved.');
				} catch (e) {
					console.error('[Auto-Merge Dependabot PRs] Invalid GitHub username:', e);
					alert('Invalid GitHub username. Please enter a valid username.');
					username = '';
				}
			} else {
				alert('GitHub username is required.');
			}
		}
	}

	/**
	 * Validates the GitHub token by making an authenticated request.
	 * @param {string} token
	 */
	async function validateGitHubToken(token) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://api.github.com/user',
				headers: {
					Authorization: `token ${token}`,
				},
				onload: function (response) {
					if (response.status === 200) {
						resolve();
					} else {
						console.warn('[Auto-Merge Dependabot PRs] Token validation failed:', response.responseText);
						reject(new Error(`Token validation failed: ${response.responseText}`));
					}
				},
				onerror: function (error) {
					console.error('[Auto-Merge Dependabot PRs] Token validation error:', error);
					reject(error);
				},
			});
		});
	}

	/**
	 * Validates the GitHub username by making an authenticated request.
	 * @param {string} username
	 * @param {string} token
	 */
	async function validateGitHubUsername(username, token) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: `https://api.github.com/users/${username}`,
				headers: {
					Authorization: `token ${token}`,
				},
				onload: function (response) {
					if (response.status === 200) {
						resolve();
					} else {
						console.warn('[Auto-Merge Dependabot PRs] Username validation failed:', response.responseText);
						reject(new Error(`GitHub username validation failed: ${response.responseText}`));
					}
				},
				onerror: function (error) {
					console.error('[Auto-Merge Dependabot PRs] Username validation error:', error);
					reject(error);
				},
			});
		});
	}

	await initialize();

	async function encryptAndStoreToken(token) {
		try {
			const textEncoder = new TextEncoder();
			const encodedToken = textEncoder.encode(token);

			let key;
			const storedKey = safeGM_getValue('encryption_key', null);
			if (storedKey) {
				try {
					key = await crypto.subtle.importKey('jwk', JSON.parse(storedKey), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
				} catch (error) {
					console.error('Failed to parse or import encryption key:', error);
					alert('The stored encryption key is invalid or corrupted. Please reset your token and encryption key.');
					throw error; // Stop further execution
				}
			} else {
				key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
				safeGM_setValue('encryption_key', JSON.stringify(await crypto.subtle.exportKey('jwk', key)));
			}

			const iv = crypto.getRandomValues(new Uint8Array(12));
			const encryptedToken = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encodedToken);

			safeGM_setValue(
				'github_token',
				JSON.stringify({
					iv: Array.from(iv),
					token: Array.from(new Uint8Array(encryptedToken)),
				}),
			);
		} catch (error) {
			console.error('Failed to encrypt and store token:', error);
			alert('An error occurred while encrypting and storing the token. Please check the console for details.');
			throw error; // Stop further execution
		}
	}

	async function retrieveAndDecryptToken() {
		try {
			const storedData = safeGM_getValue('github_token', null);
			if (!storedData) return '';

			let iv, token;
			try {
				({ iv, token } = JSON.parse(storedData));
			} catch (error) {
				console.error('Stored token is corrupted or invalid:', error);
				alert('The stored token is corrupted or invalid. Please reset your token.');
				return ''; // Return an empty string to indicate failure
			}
			const key = safeGM_getValue('encryption_key', null);

			if (!key) {
				throw new Error('Encryption key is missing.');
			}

			const importedKey = await crypto.subtle.importKey('jwk', JSON.parse(key), { name: 'AES-GCM' }, true, ['decrypt']);

			const decryptedToken = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, importedKey, new Uint8Array(token));

			const textDecoder = new TextDecoder();
			return textDecoder.decode(decryptedToken);
		} catch (error) {
			console.error('Failed to retrieve and decrypt token:', error);
			alert('An error occurred while retrieving and decrypting the token. Please check the console for details.');
			return ''; // Return an empty string to indicate failure
		}
	}

	async function fetchAllRepositories(username, token, orgs = []) {
		async function fetchPaginatedRepos(url, token) {
			let repos = [];
			let page = 1;
			while (true) {
				const response = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: 'GET',
						url: `${url}&page=${page}`,
						headers: {
							Authorization: `token ${token}`,
						},
						onload: function (response) {
							handleRateLimit(response);
							if (response.status === 200) {
								resolve(response);
							} else {
								reject(new Error(`Failed to fetch repositories: ${response.responseText}`));
							}
						},
						onerror: function (error) {
							reject(error);
						},
					});
				});
				const pageRepos = JSON.parse(response.responseText);
				if (pageRepos.length === 0) break;
				repos = repos.concat(pageRepos);
				page++;
			}
			return repos;
		}

		const [userRepos, orgRepos] = await Promise.all([
			fetchPaginatedRepos(`https://api.github.com/users/${username}/repos?per_page=100`, token),
			Promise.all(orgs.filter(Boolean).map((org) => fetchPaginatedRepos(`https://api.github.com/orgs/${org}/repos?per_page=100`, token))),
		]);
		return [...userRepos, ...orgRepos.flat()];
	}

	const botUsernames = safeGM_getValue('dependabot_usernames', ['dependabot[bot]', 'dependabot-preview[bot]', 'github-actions[bot]'])
		.map((username) => username.trim())
		.filter(Boolean);

	async function fetchDependabotPRs(owner, repo, token) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: `https://api.github.com/repos/${owner}/${repo}/pulls?per_page=100&state=open`,
				headers: {
					Authorization: `token ${token}`,
				},
				onload: function (response) {
					handleRateLimit(response);
					if (response.status === 200) {
						const pulls = JSON.parse(response.responseText);
						// Only keep PRs authored by the configured bot usernames
						const filtered = pulls.filter((pr) => pr.user && botUsernames.includes(pr.user.login));
						resolve(filtered);
					} else {
						console.error(`Failed to fetch PRs for repo ${repo}:`, response.responseText);
						reject(new Error(`Failed to fetch PRs for repo ${repo}: ${response.responseText}`));
					}
				},
				onerror: function (error) {
					console.error(`Error fetching PRs for repo ${repo}:`, error);
					reject(error);
				},
			});
		});
	}

	async function mergeDependabotPRs(prs, username, repo, token) {
		let statusContainer = document.getElementById('merge-status');
		if (!statusContainer) {
			statusContainer = document.createElement('div');
			statusContainer.id = 'merge-status';
			statusContainer.classList.add('merge-status');
			document.body.appendChild(statusContainer);
		}
		let index = 0;

		async function processNextPR() {
			if (index < prs.length) {
				const pr = prs[index];
				try {
					await mergePR(pr, username, repo, token);
					const messageElement = document.createElement('div');
					messageElement.innerHTML = `PR #${pr.number} merged successfully!<br>`;
					messageElement.id = `merge-status-${pr.number}`;
					statusContainer.appendChild(messageElement);
					setTimeout(() => messageElement.remove(), 7000);
				} catch (error) {
					console.error(`Error merging PR #${pr.number}:`, error);
					const messageElement = document.createElement('div');
					messageElement.innerHTML = `Failed to merge PR #${pr.number}: ${error.message || 'Unknown error'}<br>`;
					messageElement.id = `merge-status-${pr.number}`;
					statusContainer.appendChild(messageElement);
					setTimeout(() => messageElement.remove(), 7000);
				}
				index++;
				setTimeout(processNextPR, delay);
			} else {
				setTimeout(() => {
					statusContainer.remove();
					removeAllPRSelectionContainers();
				}, 10000);
			}
		}

		try {
			processNextPR();
		} catch (error) {
			console.error(`Error processing PRs for repo ${repo}:`, error);
			const messageElement = document.createElement('div');
			messageElement.innerHTML = `Failed to process PRs for repo ${repo}: ${error.message || 'Unknown error'}<br>`;
			statusContainer.appendChild(messageElement);
			setTimeout(() => messageElement.remove(), 7000);
			removeAllPRSelectionContainers();
		}
	}

	function mergePR(pr, username, repo, token, retries = 3) {
		if (retries === 0) retries = 1; // Ensure at least one retry attempt
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'PUT',
				url: `https://api.github.com/repos/${username}/${repo}/pulls/${pr.number}/merge`,
				headers: {
					Authorization: `token ${token}`,
					'Content-Type': 'application/json',
				},
				data: JSON.stringify({
					commit_title: `Merge PR #${pr.number}`,
					merge_method: 'merge',
				}),
				onload: function (response) {
					if (response.status === 200) {
						resolve();
					} else {
						const responseBody = JSON.parse(response.responseText || '{}');
						if (response.status === 409 || (responseBody.message && responseBody.message.includes('merge conflict'))) {
							// Permanent error: merge conflict
							reject(new Error(`Merge conflict for PR #${pr.number}: ${responseBody.message || 'Unknown conflict'}`));
						} else if (response.status === 403 && response.headers['x-ratelimit-remaining'] === '0') {
							// Rate limit exceeded
							const resetTimeHeader = response.headers['x-ratelimit-reset'];
							const resetTime = resetTimeHeader ? new Date(resetTimeHeader * 1000) : null;
							reject(new Error(`Rate limit exceeded. Retry after ${resetTime ? resetTime.toLocaleTimeString() : 'some time'}.`));
						} else if (retries > 0) {
							// Transient error: retry
							console.warn(`Retrying merge for PR #${pr.number}. Retries left: ${retries}`);
							setTimeout(() => {
								mergePR(pr, username, repo, token, retries - 1)
									.then(resolve)
									.catch(reject);
							}, 2000); // Retry after 2 seconds
						} else {
							reject(new Error(`Failed to merge PR #${pr.number}: ${response.responseText}`));
						}
					}
				},
				onerror: function (error) {
					if (retries > 0) {
						console.warn(`Retrying merge for PR #${pr.number} due to error. Retries left: ${retries}`);
						setTimeout(() => {
							mergePR(pr, username, repo, token, retries - 1)
								.then(resolve)
								.catch(reject);
						}, 2000); // Retry after 2 seconds
					} else {
						reject(error);
					}
				},
			});
		});
	}

	function addButton() {
		try {
			const mergeButton = document.createElement('button');
			mergeButton.textContent = 'Merge Dependabot PRs';
			mergeButton.classList.add('merge-dependabot-merge-button', 'merge-button');
			mergeButton.id = 'merge-dependabot-merge-button';
			mergeButton.addEventListener('click', async () => {
				try {
					let token = await retrieveAndDecryptToken();
					if (!token) {
						alert('Invalid or missing GitHub token. Please check your settings.');
						return;
					}
					const username = safeGM_getValue('github_username');
					const orgs = (safeGM_getValue('github_orgs', '') || '')
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					const statusElement = getStatusElement();
					updateStatusElement(statusElement, 'Fetching repositories...');

					let repos;
					try {
						repos = await fetchAllRepositories(username, token, orgs);
					} catch (error) {
						console.error('Error fetching repositories:', error);
						updateStatusElement(statusElement, 'Failed to fetch repositories. Please check the console for details.');
						return; // Stop further execution
					}

					let allPRs = [];
					for (const repo of repos) {
						if (repo.archived) {
							updateStatusElement(statusElement, `Skipping archived repo: ${repo.name}`);
							continue;
						}
						updateStatusElement(statusElement, `Fetching PRs for repo: ${repo.name}`);
						try {
							const prs = await fetchDependabotPRs(username, repo.name, token);
							allPRs = allPRs.concat(prs.map((pr) => ({ ...pr, repo: repo.name })));
						} catch (error) {
							console.error(`Error fetching PRs for repo ${repo.name}:`, error);
							updateStatusElement(statusElement, `Failed to fetch PRs for repo: ${repo.name}.`);
						}
					}

					if (allPRs.length > 0) {
						updateStatusElement(statusElement, 'Displaying PR selection...');
						displayPRSelection(allPRs, username, token);
					} else {
						updateStatusElement(statusElement, 'No Dependabot PRs found to merge.');
						displayNoPRsMessage();
					}
					setTimeout(() => {
						statusElement.innerHTML = '';
						statusElement.remove();
					}, 10000);
				} catch (error) {
					console.error('Error during merge operation:', error);
					alert('An unexpected error occurred. Please check the console for details.');
				}
			});
			const container = document.getElementById('merge-dependabot-merge-button-container') || createMergeButtonContainer();
			container.appendChild(mergeButton);

			function createMergeButtonContainer() {
				const container = document.createElement('div');
				container.id = 'merge-dependabot-merge-button-container';
				container.className = 'merge-dependabot-merge-button-container';
				container.style.position = 'fixed';
				container.style.bottom = '10px';
				container.style.right = '10px';
				container.style.zIndex = '1000';
				document.body.appendChild(container);
				return container;
			}

			// Add the cog icon to the merge button
			addCogToMergeButton();
		} catch (error) {
			console.error('Failed to add merge button:', error);
			alert('An error occurred while adding the merge button. Please check the console for details.');
		}
	}

	function getStatusElement() {
		let statusElement = document.getElementById('merge-status');
		if (!statusElement) {
			statusElement = document.createElement('div');
			statusElement.id = 'merge-status';
			statusElement.classList.add('merge-status');
			document.body.appendChild(statusElement);
		}
		return statusElement;
	}

	function updateStatusElement(element, message) {
		element.innerHTML = message;
	}

	// Utility: Remove all lingering PR selection containers
	function removeAllPRSelectionContainers() {
		const containers = document.querySelectorAll('.merge-dependabot-pr-selection-container');
		containers.forEach((el) => el.remove());
	}

	function displayPRSelection(prs, username, token) {
		try {
			removeAllPRSelectionContainers(); // Clean up any old containers first
			const container = document.createElement('div');
			container.classList.add('merge-dependabot-pr-selection-container');
			container.setAttribute('role', 'dialog');
			container.setAttribute('aria-modal', 'true');
			container.setAttribute('aria-labelledby', 'merge-dependabot-pr-selection-title');
			container.tabIndex = -1;
			container.id = 'merge-dependabot-pr-selection-container';
			container.style.position = 'fixed';
			container.style.bottom = '50px';
			container.style.right = '10px';
			container.style.zIndex = '1000';
			container.style.backgroundColor = '#79e4f2';
			container.style.color = '#000000';
			container.style.padding = '10px';
			container.style.border = '1px solid #ccc';
			container.style.maxHeight = '300px';
			container.style.overflowY = 'auto';
			container.style.minWidth = '350px';
			container.style.boxSizing = 'border-box';
			container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

			// Add close (X) button
			const closeBtn = document.createElement('button');
			closeBtn.textContent = '×';
			closeBtn.className = 'merge-dependabot-pr-selection-close';
			closeBtn.title = 'Close';
			closeBtn.setAttribute('aria-label', 'Close PR selection dialog');
			closeBtn.id = 'merge-dependabot-pr-selection-close';
			closeBtn.onclick = () => {
				container.remove();
				const status = document.getElementById('merge-status');
				if (status) status.remove();
				removeAllPRSelectionContainers(); // Ensure all are removed
				if (container.lastFocused) container.lastFocused.focus();
			};
			container.appendChild(closeBtn);

			const title = document.createElement('h3');
			title.id = 'merge-dependabot-pr-selection-title';
			title.textContent = 'Select Dependabot PRs to Merge';
			container.appendChild(title);

			// Add Select All button
			const selectAllBtn = document.createElement('button');
			selectAllBtn.textContent = 'Select All';
			selectAllBtn.className = 'merge-dependabot-btn';
			selectAllBtn.style.marginBottom = '8px';
			selectAllBtn.style.marginRight = '8px';
			let allSelected = false;
			selectAllBtn.addEventListener('click', () => {
				const checkboxes = Array.from(prList.querySelectorAll('input[type="checkbox"]'));
				allSelected = !allSelected;
				checkboxes.forEach(cb => { cb.checked = allSelected; });
				selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
			});
			container.appendChild(selectAllBtn);

			const prList = document.createElement('div');
			prList.className = 'merge-dependabot-pr-list';
			prList.id = 'merge-dependabot-pr-list';
			let lastChecked = null; // Track the last clicked checkbox

			prs.forEach((pr) => {
				const prItem = document.createElement('div');
				prItem.className = 'merge-dependabot-pr-item';
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.value = pr.number;
				checkbox.id = `merge-dependabot-pr-checkbox-${pr.repo}-${pr.number}`;
				checkbox.className = 'merge-dependabot-pr-checkbox';

				const label = document.createElement('label');
				label.textContent = `Repo: ${pr.repo} - PR #${pr.number}: ${pr.title}`;
				label.style = 'margin-left: 5px;';
				label.setAttribute('for', checkbox.id);
				label.className = 'merge-dependabot-pr-label';

				// Add event listener for shift-click selection
				checkbox.addEventListener('click', (event) => {
					if (event.shiftKey && lastChecked) {
						const checkboxes = Array.from(prList.querySelectorAll('input[type="checkbox"]'));
						const start = Math.min(checkboxes.indexOf(lastChecked), checkboxes.indexOf(checkbox));
						const end = Math.max(checkboxes.indexOf(lastChecked), checkboxes.indexOf(checkbox));
						for (let i = start; i <= end; i++) {
							checkboxes[i].checked = lastChecked.checked;
						}
					}
					lastChecked = checkbox; // Update the last clicked checkbox
				});

				prItem.appendChild(checkbox);
				prItem.appendChild(label);
				prList.appendChild(prItem);
			});

			const mergeSelectedButton = document.createElement('button');
			mergeSelectedButton.textContent = 'Merge Selected PRs';
			mergeSelectedButton.setAttribute('aria-label', 'Merge selected pull requests');
			mergeSelectedButton.className = 'merge-dependabot-btn';
			mergeSelectedButton.id = 'merge-dependabot-merge-selected-btn';
			mergeSelectedButton.addEventListener('click', async () => {
				// Get all selected checkboxes
				const selectedCheckboxes = Array.from(prList.querySelectorAll('input[type="checkbox"]:checked'));

				// Map selected checkboxes to their corresponding PRs
				const selectedPRs = selectedCheckboxes.map((checkbox) => prs.find((pr) => pr.number == checkbox.value));

				if (selectedPRs.length > 0) {
					// Remove the PR selection container before merging to avoid blue rectangle
					container.remove();
					removeAllPRSelectionContainers();
					// Show status only
					let status = document.getElementById('merge-status');
					if (!status) {
						status = document.createElement('div');
						status.id = 'merge-status';
						status.classList.add('merge-status');
						document.body.appendChild(status);
					}
					status.innerHTML = 'Merging PRs...<br>';
					// Remove the container after merging is done (with a delay to show status)
					const groupedPRs = selectedPRs.reduce((acc, pr) => {
						if (!acc[pr.repo]) {
							acc[pr.repo] = [];
						}
						acc[pr.repo].push(pr);
						return acc;
					}, {});

					// Merge PRs grouped by repository
					for (const [repo, prs] of Object.entries(groupedPRs)) {
						try {
							await mergeDependabotPRs(prs, username, repo, token);
						} catch (error) {
							console.error(`Error merging PRs for repo ${repo}:`, error);
							const status = document.getElementById('merge-status');
							if (status) status.remove();
							removeAllPRSelectionContainers();
							alert(`Failed to merge PRs for repo ${repo}. Please check the console for details.`);
							return;
						}
						setTimeout(() => {
							const status = document.getElementById('merge-status');
							if (status) status.remove();
							removeAllPRSelectionContainers();
						}, 11000); // Wait for status to finish
					}
				} else {
					container.innerHTML = 'No PRs selected for merging.';
					setTimeout(() => {
						container.remove();
						removeAllPRSelectionContainers();
					}, 2000);
				}
			});

			container.appendChild(prList);
			container.appendChild(mergeSelectedButton);
			document.body.appendChild(container);

			// Focus management for modal
			const focusableEls = [closeBtn, selectAllBtn, mergeSelectedButton, ...Array.from(prList.querySelectorAll('input[type="checkbox"]'))];
			container.lastFocused = document.activeElement;
			setTimeout(() => mergeSelectedButton.focus(), 0);
			container.addEventListener('keydown', function (e) {
				if (e.key === 'Tab') {
					const idx = focusableEls.indexOf(document.activeElement);
					if (e.shiftKey) {
						if (idx === 0) {
							e.preventDefault();
							focusableEls[focusableEls.length - 1].focus();
						}
					} else {
						if (idx === focusableEls.length - 1) {
							e.preventDefault();
							focusableEls[0].focus();
						}
					}
				}
			});
		} catch (error) {
			console.error('Failed to display PR selection:', error);
			removeAllPRSelectionContainers(); // Clean up on error
			const status = document.getElementById('merge-status');
			if (status) status.remove();
			alert('An error occurred while displaying the PR selection. Please check the console for details.');
		}
	}

	function displayNoPRsMessage() {
		removeAllPRSelectionContainers(); // Clean up any old containers first
		const container = document.createElement('div');
		container.classList.add('pr-container');
		container.textContent = 'No Dependabot PRs found to merge.';
		document.body.appendChild(container);

		// Automatically hide the message after 5 seconds (5000 milliseconds)
		setTimeout(() => {
			container.remove();
			// Also remove the merge-status container
			const statusContainer = document.getElementById('merge-status');
			if (statusContainer) {
				statusContainer.remove();
			}
		}, 5000);
	}

	const mainCSS = `
			.merge-button, mergebutton, body > div.pr-selection-container > button {
				position: fixed;
				bottom: 10px;
				right: 10px;
				z-index: 1000;
				background-color: #2ea44f;
				color: #ffffff;
				border: none;
				padding: 10px;
				border-radius: 5px;
				cursor: pointer;
			}
			.merge-button:hover, mergebutton:hover {
				background-color: #79e4f2;
				color: #ffffff;
				border: none;
				padding: 10px;
				border-radius: 5px;
				cursor: pointer;
			}
			#merge-status, .merge-status {
				position: fixed;
				bottom: 90px;
				right: 10px;
				z-index: 1000;
				background-color: #79e4f2;
				padding: 10px;
				border: 1px solid #ccc;
				margin-top: 10px;
				font-size: 0.9em;
				color: #333;
				max-width: 300px;
				overflow-wrap: break-word;
			}
			#merge-status > div {
				margin-bottom: 5px;
			}
			.pr-container {
				background-color: #ff0000;
				color: #ffffff;
				position: fixed;
				bottom: 130px;
				right: 10px;
				z-index: 1000;
				padding: 10px;
				border: 1px solid #cccccc;
				}
			.merge-button {
				transition: background-color 0.3s ease;
				}
			.pr-selection-container {
				position: fixed;
				bottom: 50px;
				right: 10px;
				z-index: 1000;
				background-color: #79e4f2;
				color: #000000;
				padding: 10px;
				border: 1px solid #ccc;
				max-height: 300px;
				overflow-y: auto;
				min-width: 350px;
				box-sizing: border-box;
				box-shadow: 0 2px 8px rgba(0,0,0,0.15);
			}
			.pr-selection-close {
				display: inline-block;
				width: 32px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				position: absolute;
				top: 2px;
				right: 6px;
				cursor: pointer;
				font-weight: bold;
				color: #333;
				background: none;
				border: none;
				font-size: 1.2em;
				padding: 0;
			}
	`;
	safeGM_addStyle(mainCSS);

	window.addEventListener('load', addButton);

	function showConfigPanel() {
		const configPanel = document.createElement('div');
		configPanel.setAttribute('role', 'dialog');
		configPanel.setAttribute('aria-modal', 'true');
		configPanel.setAttribute('aria-labelledby', 'merge-dependabot-config-panel-title');
		configPanel.tabIndex = -1;
		configPanel.id = 'merge-dependabot-config-panel';
		configPanel.className = 'merge-dependabot-modal';
		configPanel.style = `
			position: fixed;
			top: 10%;
			left: 50%;
			transform: translate(-50%, -10%);
			background-color: white;
			border: 1px solid #ccc;
			padding: 20px;
			z-index: 1000;
		`;
		configPanel.innerHTML = `
			<h3 id="merge-dependabot-config-panel-title">Configuration</h3>
			<label>GitHub Username: <input id="merge-dependabot-config-username" type="text" value="${safeGM_getValue('github_username', '')}" class="merge-dependabot-config-input" /></label><br>
			<label>Organizations (comma separated): <input id="merge-dependabot-config-orgs" type="text" value="${safeGM_getValue('github_orgs', '')}" class="merge-dependabot-config-input" /></label><br>
			<label>Merge Delay (ms): <input id="merge-dependabot-config-merge-delay" type="number" value="${safeGM_getValue('merge_delay', 2000)}" class="merge-dependabot-config-input" /></label><br>
			<label>Bot Usernames (comma separated): <input id="merge-dependabot-config-bot-usernames" type="text" value="${safeGM_getValue('dependabot_usernames', ['dependabot[bot]', 'dependabot-preview[bot]']).join(', ')}" class="merge-dependabot-config-input" /></label><br>
			<button id="merge-dependabot-save-config" class="merge-dependabot-btn">Save</button>
			<button id="merge-dependabot-reset-token" class="merge-dependabot-btn">Reset Token</button>
			<button id="merge-dependabot-close-config" aria-label="Close configuration panel" class="merge-dependabot-btn">Close</button>
		`;
		document.body.appendChild(configPanel);

		const saveBtn = document.getElementById('merge-dependabot-save-config');
		const resetBtn = document.getElementById('merge-dependabot-reset-token');
		const closeBtn = document.getElementById('merge-dependabot-close-config');
		const focusableEls = [saveBtn, resetBtn, closeBtn];
		let lastFocused = document.activeElement;
		setTimeout(() => saveBtn.focus(), 0);
		configPanel.addEventListener('keydown', function (e) {
			if (e.key === 'Tab') {
				const idx = focusableEls.indexOf(document.activeElement);
				if (e.shiftKey) {
					if (idx === 0) {
						e.preventDefault();
						focusableEls[focusableEls.length - 1].focus();
					}
				} else {
					if (idx === focusableEls.length - 1) {
						e.preventDefault();
						focusableEls[0].focus();
					}
				}
			}
		});

		document.getElementById('merge-dependabot-save-config').addEventListener('click', () => {
			const username = document.getElementById('merge-dependabot-config-username').value;
			const orgs = document.getElementById('merge-dependabot-config-orgs').value;
			const mergeDelay = parseInt(document.getElementById('merge-dependabot-config-merge-delay').value, 10);
			safeGM_setValue('github_username', username);
			safeGM_setValue('github_orgs', orgs);
			safeGM_setValue('merge_delay', isNaN(mergeDelay) || mergeDelay <= 0 ? 2000 : mergeDelay);
			const botUsernamesInput = document.getElementById('merge-dependabot-config-bot-usernames').value;
			const botUsernames = botUsernamesInput
				.split(',')
				.map((username) => username.trim())
				.filter(Boolean);
			safeGM_setValue('dependabot_usernames', botUsernames);
			alert('Configuration saved!');
			configPanel.remove();
			if (lastFocused) lastFocused.focus();
		});

		document.getElementById('merge-dependabot-reset-token').addEventListener('click', () => {
			safeGM_setValue('github_token', null);
			safeGM_setValue('encryption_key', null);
			alert('Token and encryption key have been reset. Please reload and re-enter your token.');
			configPanel.remove();
			if (lastFocused) lastFocused.focus();
		});

		document.getElementById('merge-dependabot-close-config').addEventListener('click', () => {
			configPanel.remove();
			if (lastFocused) lastFocused.focus();
		});
	}

	function addCogToMergeButton() {
		const mergeButton = document.querySelector('.merge-dependabot-merge-button');
		if (mergeButton) {
			// Create the cog icon
			const cogIcon = document.createElement('span');
			cogIcon.textContent = '⚙️';
			cogIcon.style = `
				margin-left: 10px;
				cursor: pointer;
				font-size: 1.2em;
			`;
			cogIcon.title = 'Settings';

			// Attach the click event to open the configuration panel
			cogIcon.addEventListener('click', (event) => {
				event.stopPropagation(); // Prevent triggering the merge button click
				showConfigPanel();
			});

			// Append the cog icon to the merge button
			mergeButton.appendChild(cogIcon);
		}
	}

	function handleRateLimit(response) {
		if (response.status === 403 && response.headers['x-ratelimit-remaining'] === '0') {
			const resetTimeHeader = response.headers['x-ratelimit-reset'];
			if (resetTimeHeader) {
				const resetTime = new Date(resetTimeHeader * 1000);
				alert(`Rate limit exceeded. Please wait until ${resetTime.toLocaleTimeString()} to retry.`);
			} else {
				const fallbackWaitTime = 60; // Default fallback wait time in seconds
				const currentTime = new Date();
				const fallbackResetTime = new Date(currentTime.getTime() + fallbackWaitTime * 1000);
				alert(`Rate limit exceeded. Please wait until approximately ${fallbackResetTime.toLocaleTimeString()} to retry.`);
			}
			throw new Error('Rate limit exceeded');
		}
	}
})();
