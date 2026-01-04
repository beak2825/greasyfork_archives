// ==UserScript==
// @name         Merge Dependabot PRs Automatically on GitHub with UI and Selection Options
// @namespace    typpi.online
// @version      2.3
// @description  Automatically clicks the merge button on Dependabot PRs and "Done" button on the notification bar
// @author       Nick2bad4u
// @match        https://github.com/*/*/pull/*
// @grant        none
// @license      UnLicense
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @downloadURL https://update.greasyfork.org/scripts/513949/Merge%20Dependabot%20PRs%20Automatically%20on%20GitHub%20with%20UI%20and%20Selection%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/513949/Merge%20Dependabot%20PRs%20Automatically%20on%20GitHub%20with%20UI%20and%20Selection%20Options.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const CHECK_INTERVAL = 1000; // Interval between checks in milliseconds
	let lastCheck = 0;
	let observer;
	let token = getTokenFromCookies() || promptForToken();
	if (!token) {
		while (!token) {
			token = prompt('Please enter your GitHub token:');
			if (token) {
				document.cookie = `github_token=${token}; path=/; max-age=${60 * 60 * 24 * 365}`;
			} else {
				alert('GitHub token is required.');
			}
		}
	}

	if (!token) {
		alert('GitHub token is required for this script to work.');
		return;
	}

	function getTokenFromCookies() {
		const match = document.cookie.match(/(^| )\s*github_token\s*=\s*([^;]+)/);
		return match ? match[2] : null;
	}

	function promptForToken() {
		let token = prompt('Please enter your GitHub token. You can generate a token at https://github.com/settings/tokens');
		if (token) {
			document.cookie = `github_token=${token}; path=/; max-age=${60 * 60 * 24 * 365}`;
		}
		return token;
	}

	const debounce = (func, delay) => {
		let debounceTimer;
		return function () {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
		};
	};

	const debouncedCheckAndMerge = debounce(checkAndMerge, 300);

	async function checkAndMerge() {
		const now = Date.now();
		if (now - lastCheck < CHECK_INTERVAL) return;
		lastCheck = now;

		console.log('checkAndMerge function called');

		try {
			const authorElement = document.querySelector('.author');
			if (authorElement && /^(dependabot\[bot\]|Nick2bad4u)$/.test(authorElement.textContent.trim())) {
				const prNumber = window.location.pathname.split('/').pop();
				const repoPath = window.location.pathname.split('/').slice(1, 3).join('/');

				console.log('PR is created by dependabot or specified user, attempting to merge via API');

				const mergeSuccess = await mergePR(repoPath, prNumber);
				if (mergeSuccess) {
					console.log('PR merged successfully');
					markAsDone();
				} else {
					console.log('Failed to merge PR');
				}
			} else {
				console.log('PR is not created by dependabot or specified user');
			}
		} catch (error) {
			console.error('Error in checkAndMerge:', error);
		}
	}

	async function mergePR(repoPath, prNumber) {
		try {
			const response = await fetch(`https://api.github.com/repos/${repoPath}/pulls/${prNumber}/merge`, {
				method: 'PUT',
				headers: {
					Authorization: `token ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					commit_title: `Merge PR #${prNumber}`,
					merge_method: 'merge',
				}),
			});

			if (response.ok) {
				return true;
			} else {
				const errorData = await response.json();
				console.error('Failed to merge PR:', errorData);
				return false;
			}
		} catch (error) {
			console.error('Error in mergePR:', error);
			return false;
		}
	}

	async function markAsDone() {
		try {
			const notificationBar = document.querySelector('.js-flash-container');
			if (!notificationBar) {
				console.log('Notification bar not found');
				return;
			}

			let doneButton = document.querySelector('button[aria-label="Done"].btn.btn-sm');
			if (!doneButton) {
				doneButton = Array.from(document.querySelectorAll('button.btn.btn-sm')).find(button => button.textContent.trim() === 'Done');
			}
			if (doneButton) {
				console.log('Done button found, clicking it');
				doneButton.click();
			} else {
				console.log('Done button not found, attempting to mark as done via API');

				const notificationId = getNotificationId();
				if (notificationId) {
					const response = await fetch(`https://api.github.com/notifications/threads/${notificationId}`, {
						method: 'PATCH',
						headers: {
							Authorization: `token ${token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							state: 'done',
						}),
					});

					if (response.ok) {
						console.log('Notification marked as done via API');
					} else {
						const errorData = await response.json();
						console.error('Failed to mark notification as done via API:', errorData);
					}
				} else {
					console.log('Notification ID not found');
				}
			}
		} catch (error) {
			console.error('Error in markAsDone:', error);
		}
	}

	/**
	 * Retrieves the notification ID from the URL parameters.
	 */
	function getNotificationId() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('notification_id');
	}

	globalThis.addEventListener(
		'load',
		function () {
			console.log('Page loaded');

			const targetNode = document.querySelector('.gh-header-meta');
			if (!targetNode) {
				console.log('Target node for observation not found');
				return;
			}

			observer = new MutationObserver(() => {
				console.log('Relevant DOM mutation detected');
				debouncedCheckAndMerge();
			});

			observer.observe(targetNode, {
				childList: true,
				subtree: true,
			});
			checkAndMerge();
		},
		false,
	);
})();
