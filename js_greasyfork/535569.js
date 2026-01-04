// ==UserScript==
// @name         Baraag Unspoiler NSFW Images
// @version      1.3
// @description  Remove sensitive content spoilers from baraag images
// @match        https://baraag.net/*
// @license      public domain
// @grant        none
// @namespace https://sleazyfork.org/users/1468364
// @downloadURL https://update.greasyfork.org/scripts/535569/Baraag%20Unspoiler%20NSFW%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/535569/Baraag%20Unspoiler%20NSFW%20Images.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const config = {
		maxVideoAttempts: 3,
		attemptDelay: 400
	};

	function hideHideButton() {
		const observer = new MutationObserver((mutations) => {
			document.querySelectorAll('.media-gallery__actions').forEach((el) => {
				if (el.style.display !== 'none') {
					el.style.display = 'none';
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Check if we're on a user profile page (including with_replies)
	function isUserProfilePage() {
		return /^\/@[^\/]+(\/with_replies)?$/.test(window.location.pathname);
	}

	// Process videos with retries
	function processVideoPlayer(videoPlayer, attempt = 0) {
		if (attempt >= config.maxVideoAttempts || videoPlayer.dataset.unspoilerComplete) {
			return;
		}

		// Mark as processed
		videoPlayer.dataset.unspoilerAttempts = attempt + 1;

		// 1. Click spoiler button if exists
		const spoilerButton = videoPlayer.querySelector('.spoiler-button button');
		if (spoilerButton && !spoilerButton.dataset.unspoilerClicked) {
			spoilerButton.dataset.unspoilerClicked = 'true';
			spoilerButton.click();
		}

		// 2. Remove inactive class
		videoPlayer.classList.remove('inactive');

		// 3. Hide canvas preview
		const canvas = videoPlayer.querySelector('.media-gallery__preview');
		if (canvas) {
			canvas.classList.add('media-gallery__preview--hidden');
		}

		// 4. Set preload="metadata" and remove poster attribute
		const video = videoPlayer.querySelector('video');
		if (video) {
			video.setAttribute('preload', 'metadata');
			video.removeAttribute('poster'); // Remove poster image
			videoPlayer.dataset.unspoilerComplete = 'true';
		} else {
			setTimeout(() => {
				processVideoPlayer(videoPlayer, attempt + 1);
			}, config.attemptDelay);
		}
	}

	// Process status card thumbnail images for offsite links
	function processStatusCards() {
		document.querySelectorAll('.status-card__image-image').forEach(img => {
			if (img.style.visibility !== 'visible') {
				// Make the image visible
				img.style.visibility = 'visible';

				// Move the image to be before its parent div
				const parentDiv = img.closest('.status-card__image');
				if (parentDiv) {
					parentDiv.parentNode.insertBefore(img, parentDiv);
				}
			}
		});
	}

	// Process all content types
	function processAllContent() {
		document.querySelectorAll('.video-player.inactive').forEach(videoPlayer => {
			if (!videoPlayer.dataset.unspoilerAttempts ||
				videoPlayer.dataset.unspoilerAttempts < config.maxVideoAttempts) {
				processVideoPlayer(videoPlayer);
			}
		});

		if (!window.location.pathname.includes('/media')) {
			document.querySelectorAll('.spoiler-button:not(.unspoiler-processed)').forEach(spoiler => {
				spoiler.classList.add('unspoiler-processed');
				const button = spoiler.querySelector('button');
				if (button && !button.dataset.unspoilerClicked) {
					button.dataset.unspoilerClicked = 'true';
					button.click();
				}
			});
		}

		if (window.location.pathname.includes('/media')) {
			document.querySelectorAll('.media-gallery__item').forEach(item => {
				// Only process if there's no img and the item has a spoiler overlay
				const hasSpoilerOverlay = item.querySelector('.media-gallery__item__overlay .icon-eye-slash');
				if (!item.querySelector('img') && hasSpoilerOverlay) {
					const thumbnail = item.querySelector('.media-gallery__item-thumbnail');
					if (thumbnail && !thumbnail.dataset.unspoilerProcessed) {
						thumbnail.dataset.unspoilerProcessed = 'true';
						thumbnail.click();
					}
				}
			});
		}

		processStatusCards();
	}

	// Observe dynamically loaded posts & videos in the main feed
	function initObserver() {
		const observer = new MutationObserver(mutations => {
			let needsProcessing = false;
			let hasNewVideos = false;

			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					if (node.nodeType === 1) {
						if (node.matches('.video-player')) {
							hasNewVideos = true;
						} else if (node.querySelector('.video-player')) {
							hasNewVideos = true;
						}
					}
				});

				if (mutation.addedNodes.length) {
					needsProcessing = true;
				}
			});

			if (needsProcessing) {
				if (hasNewVideos && isUserProfilePage()) {
					// Delay by 1 second if new videos are detected on user profile pages
					setTimeout(processAllContent, 1000);
				} else {
					// Use shorter delay for all other cases
					debouncedProcess();
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	const debouncedProcess = debounce(processAllContent, 1);

	function debounce(func, wait) {
		let timeout;
		return function() {
			clearTimeout(timeout);
			timeout = setTimeout(func, wait);
		};
	}

	// Initialize
	function init() {
		hideHideButton();
		processAllContent();
		initObserver();

		window.addEventListener('scroll', debounce(function() {
			const scrollThreshold = window.innerHeight * 2;
			if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight < scrollThreshold) {
				var loadMoreButton = document.querySelector('.load-more');
				if (loadMoreButton) {
					loadMoreButton.click();
				}
			}
		}, 500));
	}

	if (document.readyState !== 'loading') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}
})();