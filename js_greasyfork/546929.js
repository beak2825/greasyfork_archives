// ==UserScript==
// @name         FoolFuuka Video Player + External Sounds
// @namespace    kwlNjR37xBCMkr76P5eKA88apmOClCfZ
// @version      0015
// @description  sounds player script for 4chan archive websites
// @author       soundboy_1459944
// @website      https://greasyfork.org/en/scripts/546929
// @match        *://b4k.co/*
// @match        *://b4k.dev/*
// @match        *://arch.b4k.co/*
// @match        *://arch.b4k.dev/*
// @match        *://desuarchive.org/*
// @match        *://archive.palanq.win/*
// @match        *://archive.4plebs.org/*
// @connect      4chan.org
// @connect      4channel.org
// @connect      a.4cdn.org
// @connect      8chan.moe
// @connect      8chan.se
// @connect      desu-usergeneratedcontent.xyz
// @connect      arch-img.b4k.co
// @connect      archive-media-0.nyafuu.org
// @connect      4cdn.org
// @connect      a.pomf.cat
// @connect      pomf.cat
// @connect      litter.catbox.moe
// @connect      files.catbox.moe
// @connect      catbox.moe
// @connect      share.dmca.gripe
// @connect      z.zz.ht
// @connect      z.zz.fo
// @connect      zz.ht
// @connect      too.lewd.se
// @connect      lewd.se
// @connect      b4k.co
// @connect      b4k.dev
// @connect      arch.b4k.co
// @connect      arch.b4k.dev
// @connect      desuarchive.org
// @connect      *
// @license      CC0 1.0
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjMGExZTFlOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6IG5vbmU7CiAgICAgICAgc3Ryb2tlOiAjZmZmOwogICAgICAgIHN0cm9rZS1taXRlcmxpbWl0OiAxMDsKICAgICAgICBzdHJva2Utd2lkdGg6IDNweDsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI4LjcuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDEuMi4wIEJ1aWxkIDE0MikgIC0tPgogIDxnPgogICAgPGcgaWQ9IkxheWVyXzEiPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMC40LDBIMy42QzEuNiwwLDAsMS42LDAsMy42djE2LjhjMCwyLDEuNiwzLjYsMy42LDMuNmgxNi44YzIsMCwzLjYtMS42LDMuNi0zLjZWMy42YzAtMi0xLjYtMy42LTMuNi0zLjZaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTUsNHYxNmMwLC41NTIuNDQ3LDEsMSwxLC4xODUsMCwuMzY3LS4wNTEuNTI0LS4xNDhsMTMtOGMuNDcxLS4yODkuNjE4LS45MDUuMzI4LTEuMzc2LS4wODItLjEzNC0uMTk1LS4yNDYtLjMyOC0uMzI4TDYuNTI0LDMuMTQ4Yy0uNDctLjI4OS0xLjA4Ni0uMTQzLTEuMzc2LjMyOC0uMDk3LjE1OC0uMTQ4LjMzOS0uMTQ4LjUyNFoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/546929/FoolFuuka%20Video%20Player%20%2B%20External%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/546929/FoolFuuka%20Video%20Player%20%2B%20External%20Sounds.meta.js
// ==/UserScript==

const isFoolFuuka = document.querySelector('meta[name="generator"][content*="FoolFuuka"]');
let counter = 0;
const MEDIA_INITIAL_WIDTH = 350;
const MEDIA_INITIAL_HEIGHT = 350;
const DURATION_MATCH_TOLERANCE = 2; // seconds
const SUPPORTED_VIDEO_EXTS = ['.webm', '.mp4'];
const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif'];
const SUPPORTED_EXTS = SUPPORTED_VIDEO_EXTS.concat(SUPPORTED_IMAGE_EXTS);
//const allSelectors = SUPPORTED_EXTS.map(ext =>`.post_file_filename[href$="${ext}"]`).join(', ');
const postFileFilenameSelectors = SUPPORTED_EXTS.map(ext =>`.post_file_filename[href$="${ext}"]`).join(', ');
const threadImageLinkSelectors = SUPPORTED_EXTS.map(ext =>`.thread_image_link[href$="${ext}"]`).join(', ');
const videoFileExtRE = /\.(webm|mp4|m4v|ogv|avi|mpeg|mpg|mpe|m1v|m2v|mov|wmv)$/i;
const audioFileExtRE = /\.(mp3|m4a|m4b|flac|ogg|oga|opus|mp2|mpega|wav|aac)$/i;
const loadingStates = new Map();
const mediaErrors = new Map();

(function () {
	'use strict';

	// Store all media items for the list
	const mediaItems = [];

	function createElement(html, parent, events = {}) {
		const container = document.createElement('div');
		container.innerHTML = html;
		const el = container.children[0];
		parent && parent.appendChild(el);
		for (let event in events) {
			el.addEventListener(event, events[event]);
		}
		return el;
	};

	const div = createElement(`<div class="post_wrapper"></div>`, document.body);
	const style_post_wrapper = document.defaultView.getComputedStyle(div);

	const div2 = createElement(`<div id="footer"></div>`, document.body);
	const style_footer = document.defaultView.getComputedStyle(div2);

	// CSS Styles
	const styles = `
	.draggable-window {
		position: fixed;
		z-index: 1;
		width: 400px;
		min-width: 230px;
		min-height: 150px;
		color: ${style_post_wrapper.color};
		background-color: ${style_post_wrapper.backgroundColor};
		border: 1px solid gray;
		border-radius: 5px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		resize: both;
		display: flex;
		flex-direction: column;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
	}

	.draggable-window.draggable-window-list {
		height: 400px;
	}

	.draggable-window-titlebar {
		padding: 6px 4px 5px 8px;
		background-color: ${style_footer.backgroundColor};
		color: ${style_footer.color};
		cursor: move;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}

	.draggable-window-footer {
		padding: 8px;
		background-color: ${style_footer.backgroundColor};
		/*background: linear-gradient(135deg, ${style_footer.backgroundColor} 0%, ${style_footer.backgroundColor} 94%, ${style_footer.color} 95%);*/
		color: ${style_footer.color};
		cursor: move;
		display: flex;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		font-size: 5px;
	}

	.draggable-window-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 10px;
		font-weight: bold;
	}
	.draggable-window-title:not(.draggable-window-title:hover) {
		color: ${style_footer.color} !important;
	}

	.draggable-window-close {
		background: none;
		border: none;
		color: ${style_footer.color};
		cursor: pointer;
		font-size: 16px;
		padding: 0 5px;
		margin-left: 25px;
	}

	.draggable-window-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}

	.draggable-window-list .draggable-window-content {
		flex: 1;
		overflow-y: scroll;
	}

	.media-container {
		text-align: center;
		justify-items: center;
		justify-content: center;
		position: relative;
		align-items: center;
		object-fit: contain;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}

	.media-container-inline {
		text-align: center;
		justify-content: center;
		position: relative;
		align-items: center;
		margin-top: 5px;
		resize: both;
		object-fit: contain;
		width: ${MEDIA_INITIAL_WIDTH}px;
		min-width: 240px;
		min-height: 180px;
		scrollbar-color: ${style_footer.backgroundColor} ${style_post_wrapper.backgroundColor};
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.media-player {
		align-items: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.media-player img, .media-player video {
		display: flex;
		flex: 1 1 auto; /* Grow and shrink as needed */
		width: 100%;
		height: 100%;
		object-fit: contain;
		min-height: 0; /* Important for flex item shrinking */
	}

	.draggable-window-content .media-player img, .media-player video {
		object-fit: contain !important;
	}

	.media-player audio {
		display: flex;
		width: 100%;
		max-height: 40px;
		flex: 0 0 auto; /* Don't grow or shrink */
		margin-top: auto;
		color-scheme: dark;
	}

	.play-button {
		padding: 0px 3px 1px;
		border: 1px solid;
		cursor: pointer;
		font-size: 10px;
		font-weight: bold;
	}

	.play-button:hover {
		border: 1px solid /*white*/;
	}

	.play-button-draggable {
		padding: 0px 3px 1px;
		border: 1px solid;
		cursor: pointer;
		font-size: 10px;
		font-weight: bold;
	}

	.play-button-draggable:hover {
		border: 1px solid;
	}

	/* Media List Styles */
	.media-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.media-list-item:first-child {
		border-top: 1px solid gray;
		margin: 1px 0 0 0;
	}
	.media-list-item:last-child {
		margin: 0 0 10px 0;
	}

	.media-list-item {
		padding: 8px 12px;
		border-bottom: 1px solid gray;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
	}

	.media-list-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.media-list-item-icon {
		width: 34px;
		/*height: 16px;*/
		flex-shrink: 0;
		text-align: center;
	}

	.media-list-item-text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 10px;
	}

	.media-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 2px solid gray;
		background-color: ${style_footer.backgroundColor};
	}

	.media-list-count {
		font-size: 11px;
		opacity: 0.8;
	}

	#media-list-toggle-btn {
		position: fixed !important;
		right: 8px;
		bottom: 8px;
		left: auto;
		top: auto;
		z-index: 3;
		padding: 6px 8px 7px 7px;
	}

	.media-list-item.selected {
		background-color: rgba(255, 255, 0, 0.2) !important;
	}

	.media-player .error-message {
		width: 100%;
		text-align: center;
		padding: 11px;
		color: #f00;
		background-color: ${style_footer.backgroundColor};
	}

	.media-player .loading-indicator {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		padding: 11px;
		color: ${style_footer.color};
		background-color: ${style_footer.backgroundColor};
	}

	.play-button.loading-state {
		opacity: 0.7;
		cursor: wait !important;
	}

	.play-button.error {
		color: #f00 !important;
	}

	.expander {
		position: absolute;
		bottom: 0px;
		right: 0px;
		height: 1.45rem;
		width: 1.45rem;
		background: linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 63%, ${style_footer.color} 67%, ${style_footer.color} 100%),
					linear-gradient(to bottom right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 62%, ${style_footer.backgroundColor} 66%, ${style_footer.backgroundColor} 100%);
	}

	.media-list-thumb {
		position: fixed;
		margin-left: 10px;
		z-index: 1000;
		background: ${style_post_wrapper.backgroundColor};
		border: 1px solid gray;
		border-radius: 3px;
		padding: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		display: none;
		max-width: 125px;
		max-height: 125px;
	}
	`;

	// Add styles to the document
	const styleElement = document.createElement('style');
	styleElement.textContent = styles;
	document.head.appendChild(styleElement);

	document.body.removeChild(div);
	document.body.removeChild(div2);

	function extractSoundUrl(title) {
		const match = title.match(/\[sound=([^\]]+)\]/);
		if (!match) return null;

		let soundUrl = match[1];

		// Fix for Firefox filenames
		if (soundUrl.includes('_') && !soundUrl.includes('%')) {
			const hex_pattern = /_(23|24|26|2B|2C|2F|3A|3B|3D|3F|40)/g;
			soundUrl = soundUrl.replace(hex_pattern, '%$1');
		}

		// If there are still underscores after decoding, it's likely invalid
		if (soundUrl.includes('_')) return null;

		try {
			// Decode any percent-encoded characters
			soundUrl = decodeURIComponent(soundUrl);
			// Ensure URL has a protocol
			if (!/^https?:\/\//.test(soundUrl)) {
				// Remove leading slashes if present to avoid double slashes
				soundUrl = soundUrl.replace(/^\/\//, '');
				soundUrl = location.protocol + '//' + soundUrl;
			}
			return soundUrl;
		} catch (error) {
			console.warn('Failed to decode Sound URL:', title, error);
			return null;
		}
	}

	function extractPostIdFromLink(linkElement) {
		if (!linkElement || !linkElement.href) return 0;

		// Extract the post ID from the URL hash (e.g., #536595752)
		const hashMatch = linkElement.href.match(/#(\d+)$/);
		if (hashMatch && hashMatch[1]) {
			return parseInt(hashMatch[1], 10);
		}

		// Fallback: try to extract from data attributes or other parts of the URL
		const urlMatch = linkElement.href.match(/\/(\d+)\/?$/);
		if (urlMatch && urlMatch[1]) {
			return parseInt(urlMatch[1], 10);
		}

		return 0;
	}

	function createDraggableWindow(windowTitle, content, linkToThisPost, title, isMediaList = false) {
		const windowId = 'media-window-' + counter++;
		const windowElement = document.createElement('div');
		windowElement.id = windowId;
		windowElement.className = isMediaList ? 'draggable-window draggable-window-list' : 'draggable-window';

		// Title bar
		const titleBar = document.createElement('div');
		titleBar.className = 'draggable-window-titlebar';

		const titleText = document.createElement(isMediaList ? 'div' : 'a');
		titleText.className = 'draggable-window-title';
		titleText.textContent = title;

		if (!isMediaList) {
			titleText.title = "Jump to the post for the current sound";
			titleText.href = linkToThisPost;
		}

		const closeButton = document.createElement('button');
		closeButton.className = 'draggable-window-close icon-remove';
		//closeButton.className = 'draggable-window-close';
		//closeButton.innerHTML = '×';
		//closeButton.style = 'font-size: 22px; font-weight: bold; cursor: pointer; line-height: 1;'

		titleBar.appendChild(titleText);
		titleBar.appendChild(closeButton);

		// Content area
		const contentArea = document.createElement('div');
		contentArea.className = 'draggable-window-content';
		contentArea.appendChild(content);

		windowElement.appendChild(titleBar);
		windowElement.appendChild(contentArea);

		// Store references to cleanup functions
		windowElement._cleanupFunctions = [];

		if (isMediaList) {
			const footer = document.createElement('div');
			footer.className = 'draggable-window-footer';
			footer.innerHtml = ' ';
			windowElement.appendChild(footer);

			const footerMouseDownHandler = (e) => {
				if (e.target === closeButton) return;

				isDragging = true;
				offsetX = e.clientX - windowElement.getBoundingClientRect().left;
				offsetY = e.clientY - windowElement.getBoundingClientRect().top;

				windowElement.style.cursor = 'grabbing';
				e.preventDefault();
			};

			footer.addEventListener('mousedown', footerMouseDownHandler);
			windowElement._cleanupFunctions.push(() => {
				footer.removeEventListener('mousedown', footerMouseDownHandler);
			});

			const expander = document.createElement('div');
			expander.className = 'expander';
			footer.appendChild(expander);
		} else {
			const expander = document.createElement('div');
			expander.className = 'expander';
			windowElement.appendChild(expander);
		}

		// Position the window initially
		const windowCount = document.querySelectorAll('[id^="media-window-"]').length;
		windowElement.style.left = (20 + (windowCount * 20)) + 'px';
		windowElement.style.top = (20 + (windowCount * 20)) + 'px';

		document.body.appendChild(windowElement);

		const thumbnailContainer = document.querySelector('img.media-list-thumb');
		if (!thumbnailContainer && isMediaList) {
			const thumb = document.createElement('img');
			thumb.className = 'media-list-thumb';
			thumb.style = 'display: none; left: 0px; top: 0px;'
			windowElement.after(thumb);
		}

		// Make draggable
		let isDragging = false;
		let offsetX, offsetY;

		const titleBarMouseDownHandler = (e) => {
			if (e.target === closeButton) return;

			isDragging = true;
			offsetX = e.clientX - windowElement.getBoundingClientRect().left;
			offsetY = e.clientY - windowElement.getBoundingClientRect().top;

			windowElement.style.cursor = 'grabbing';
			e.preventDefault();
		};

		titleBar.addEventListener('mousedown', titleBarMouseDownHandler);
		windowElement._cleanupFunctions.push(() => {
			titleBar.removeEventListener('mousedown', titleBarMouseDownHandler);
		});

		const mouseMoveHandler = (e) => {
			if (!isDragging) return;

			windowElement.style.left = (e.clientX - offsetX) + 'px';
			windowElement.style.top = (e.clientY - offsetY) + 'px';
		};

		const mouseUpHandler = () => {
			isDragging = false;
			windowElement.style.cursor = '';
			ensureOnScreen(windowElement);
		};

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);

		windowElement._cleanupFunctions.push(() => {
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		});

		// Close button
		const closeButtonHandler = () => {
			cleanupWindow(windowElement);
			document.body.removeChild(windowElement);
		};

		closeButton.addEventListener('click', closeButtonHandler);
		windowElement._cleanupFunctions.push(() => {
			closeButton.removeEventListener('click', closeButtonHandler);
		});

		// Bring to front on click - Wait for mouseup to reorder DOM
		const windowMouseDownHandler = (event) => {
			// Find the parent media window of the clicked element
			let targetElement = event.target;
			let windowElement = null;

			while (targetElement && targetElement !== document.body) {
				if (targetElement.id && targetElement.id.startsWith('media-window-')) {
					windowElement = targetElement;
					break;
				}
				targetElement = targetElement.parentElement;
			}

			if (!windowElement) return;

			// Also check if the target element is a resize handle
			/*if (event.target.classList.contains('resize-handle') ||
				event.target.closest('.resize-handle')) {
				return;
			}*/

			// Set z-index immediately for visual feedback
			const allWindows = document.querySelectorAll('[id^="media-window-"]');
			allWindows.forEach(win => {
				win.style.zIndex = '1';
			});
			windowElement.style.zIndex = '2';

			// Store references for the mouseup handler
			const parentContainer = windowElement.parentElement;

			// Wait for mouseup to reorder DOM elements
			const handleMouseUp = () => {
				if (!parentContainer) return;

				// Check if window height exceeds document height and resize if needed
				const windowRect = windowElement.getBoundingClientRect();
				const documentHeight = document.documentElement.clientHeight;

				if (windowRect.height > documentHeight) {
					// Calculate new height (80% of document height for some padding)
					const newHeight = Math.floor(documentHeight * 0.95);

					// Apply new height to the window element
					windowElement.style.height = `${newHeight}px`;

					// Also adjust top position if window is off-screen
					if (windowRect.top < 0) {
						windowElement.style.top = '0px';
					} else if (windowRect.bottom > documentHeight) {
						// Position from bottom with some padding
						windowElement.style.top = `${documentHeight - newHeight - 10}px`;
					}
				}

				// Re-append all windows in new order
				allWindows.forEach(win => {
					parentContainer.appendChild(win);
				});
				parentContainer.appendChild(windowElement);
			};

			document.addEventListener('mouseup', handleMouseUp, { once: true });
		};

		// Single event listener on document body using event delegation
		document.body.addEventListener('mousedown', windowMouseDownHandler);

		// Cleanup for all windows
		const mediaWindows = document.querySelectorAll('[id^="media-window-"]');
		mediaWindows.forEach(windowElement => {
			if (!windowElement._cleanupFunctions) {
				windowElement._cleanupFunctions = [];
			}

			windowElement._cleanupFunctions.push(() => {
				document.body.removeEventListener('mousedown', windowMouseDownHandler);
			});
		});

		// resize observer for the window itself to keep it on screen
		const windowResizeObserver = new ResizeObserver(() => {
			ensureOnScreen(windowElement);
		});
		windowResizeObserver.observe(windowElement);
		windowElement._cleanupFunctions.push(() => {
			windowResizeObserver.disconnect();
		});

		return windowElement;
	}

	function cleanupWindow(windowElement) {
		// Clean up media elements
		const mediaElements = windowElement.querySelectorAll('video, audio');
		mediaElements.forEach(media => {
			media.pause();
			media.src = '';
			media.load();
		});

		// Execute all cleanup functions
		if (windowElement._cleanupFunctions) {
			windowElement._cleanupFunctions.forEach(cleanupFn => cleanupFn());
			windowElement._cleanupFunctions = [];
		}
	}

	function createMediaListWindow() {
		if (mediaItems.length === 0) return;

		const listContainer = document.createElement('div');
		let lastSelectedItem = null;

		// Header with count
		/*const header = document.createElement('div');
		header.className = 'media-list-header';
		header.innerHTML = `
			<strong>Media List</strong>
			<span class="media-list-count">${mediaItems.length} items</span>
		`;
		listContainer.appendChild(header);*/

		// Sort media items by post ID from lowest to highest
		const sortedMediaItems = [...mediaItems].sort((a, b) => {
			const aId = extractPostIdFromLink(a.linkToThisPost);
			const bId = extractPostIdFromLink(b.linkToThisPost);
			return aId - bId;
		});

		// List of media items
		const list = document.createElement('ul');
		list.className = 'media-list';

		sortedMediaItems.forEach((item, index) => {
			const listItem = document.createElement('li');
			listItem.className = 'media-list-item';
			listItem.dataset.index = index;

			// Icon based on media type
			const icon = document.createElement('span');
			icon.className = 'media-list-item-icon';
			icon.innerHTML = item.isVideo ? '🎬' : '🖼️';
			icon.innerHTML += (item.soundUrl) ? '🔊' : '';

			const text = document.createElement('span');
			text.className = 'media-list-item-text';

			// Show post ID in the text if available
			const postId = extractPostIdFromLink(item.linkToThisPost);
			const displayText = postId ? `${postId} ▪ ${item.title}` : item.title;
			text.textContent = displayText;
			text.title = item.title;

			listItem.appendChild(icon);
			listItem.appendChild(text);

			const showThumbnail = (e) => {
				const thumbnailContainer = document.querySelector('img.media-list-thumb');
				if(!thumbnailContainer) return;

				thumbnailContainer.src = item.thumbSrc;
				thumbnailContainer.style.display = 'block';

				positionThumbnail(e);
			};

			const hideThumbnail = () => {
				const thumbnailContainer = document.querySelector('img.media-list-thumb');
				if(!thumbnailContainer) return;

				thumbnailContainer.style.display = 'none';
			};

			// Position the thumbnail near the cursor
			const positionThumbnail = (e) => {
				const thumbnailContainer = document.querySelector('img.media-list-thumb');
				if(!thumbnailContainer) return;

				const {
					width,
					height
				} = thumbnailContainer.getBoundingClientRect();

				const maxX = document.documentElement.clientWidth - width - 25;
				thumbnailContainer.style.left = (Math.min(e.clientX, maxX) + 5) + 'px';
				thumbnailContainer.style.top = (e.clientY - height - 10) + 'px';
			};

			if(item.thumbSrc !== null) {
				listItem.addEventListener('mouseenter', (e) => { showThumbnail(e); });

				listItem.addEventListener('mouseleave', hideThumbnail);
				listItem.addEventListener('click', hideThumbnail);

				listItem.addEventListener('mousemove', (e) => {
					const thumbnailContainer = document.querySelector('img.media-list-thumb');
					if (thumbnailContainer.style.display === 'block') {
						positionThumbnail(e);
					}
				});
			}

			listItem.addEventListener('click', () => {
				// Remove selected class from previously selected item
				if (lastSelectedItem) {
					lastSelectedItem.classList.remove('selected');
				}

				// Add selected class to current item
				listItem.classList.add('selected');
				lastSelectedItem = listItem;

				// Scroll to the post
				if (item.linkToThisPost) {
					item.linkToThisPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
					// Highlight the post briefly
					const postWrapper = item.linkToThisPost.closest('.post_wrapper');
					if (postWrapper) {
						const originalBackground = postWrapper.style.backgroundColor;
						postWrapper.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
						setTimeout(() => {
							postWrapper.style.backgroundColor = originalBackground;
						}, 2000);
					}
				}
			});

			list.appendChild(listItem);
		});

		listContainer.appendChild(list);

		// Create the draggable window
		createDraggableWindow('Media List', listContainer, null, `Media List - ${mediaItems.length} items`, true);
	}

	function addMediaListItem(mediaUrl, soundUrl, linkToThisPost, title, thumbSrc = null) {
		const isVideo = SUPPORTED_VIDEO_EXTS.some(ext => mediaUrl.toLowerCase().endsWith(ext));
		mediaItems.push({
			mediaUrl,
			soundUrl,
			linkToThisPost,
			title,
			thumbSrc,
			isVideo,
			timestamp: Date.now()
		});
	}

	function ensureOnScreen(windowElement) {
		const containerRect = windowElement.getBoundingClientRect();
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;

		// Check if window is completely offscreen
		const isOffscreen =
			containerRect.right < 0 ||
			containerRect.bottom < 0 ||
			containerRect.left > viewportWidth ||
			containerRect.top > viewportHeight;

		if (isOffscreen) {
			// Move to default position if completely offscreen
			windowElement.style.left = '20px';
			windowElement.style.top = '20px';
		} else {
			// Adjust position if partially offscreen
			let newLeft = parseFloat(windowElement.style.left) || 0;
			let newTop = parseFloat(windowElement.style.top) || 0;

			if (containerRect.left < 0) {
				newLeft = 0;
			} else if (containerRect.right > viewportWidth) {
				newLeft = viewportWidth - containerRect.width;
			}

			if (containerRect.top < 0) {
				newTop = 0;
			} else if (containerRect.bottom > viewportHeight) {
				newTop = viewportHeight - containerRect.height;
			}

			if (newLeft !== (parseFloat(windowElement.style.left) || 0) ||
				newTop !== (parseFloat(windowElement.style.top) || 0)) {
				windowElement.style.left = newLeft + 'px';
				windowElement.style.top = newTop + 'px';
			}
		}
	}

	function createMediaPlayer(mediaUrl, soundUrl, isDraggableWindow = false) {
		const extension = mediaUrl.split('.').pop().toLowerCase();
		const isImage = SUPPORTED_IMAGE_EXTS.some(ext => mediaUrl.toLowerCase().endsWith(ext));
		const externalSourceIsVideo = (soundUrl && videoFileExtRE.test(soundUrl)) ? true : false;

		const wrapper = document.createElement('div');
		wrapper.className = 'media-player';

		// Create loading indicator
		const loadingIndicator = document.createElement('div');
		loadingIndicator.className = 'loading-indicator';
		loadingIndicator.textContent = 'Loading...';
		wrapper.appendChild(loadingIndicator);

		// Set loading state
		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;
		loadingStates.set(mediaKey, true);
		mediaErrors.delete(mediaKey);

		if (externalSourceIsVideo) {
			const video = document.createElement('video');
			video.style.display = 'none';
			video.src = soundUrl;
			video.controls = true;
			video.autoplay = false;
			video.loop = true;
			video.volume = 0.2;
			video.preload = 'auto';
			wrapper.appendChild(video);

			video.addEventListener('error', () => {
				loadingStates.set(mediaKey, false);
				mediaErrors.set(mediaKey, 'Failed to load video');
				showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
			});

			video.addEventListener('canplaythrough', () => {
				video.play().catch(error => {
					console.error('Video play failed:', error);
					mediaErrors.set(mediaKey, 'Failed to play video: ' + error.message);
					showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
				});
				loadingStates.set(mediaKey, false);
				loadingIndicator.style.display = 'none';
				video.style.removeProperty("display");
				initialMediaSize(video);
			}, { once: true });
		} else if (isImage) {
			const img = document.createElement('img');
			img.style.display = 'none';
			img.src = mediaUrl;
			wrapper.appendChild(img);

			img.addEventListener('load', () => {
				loadingStates.set(mediaKey, false);
				loadingIndicator.style.display = 'none';
				img.style.removeProperty("display");
				initialMediaSize(img);
			});

			img.addEventListener('error', () => {
				loadingStates.set(mediaKey, false);
				mediaErrors.set(mediaKey, 'Failed to load image');
				showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
			});

			if (soundUrl) {
				const audio = createAudioElement(soundUrl, true, isDraggableWindow, wrapper, mediaKey);
				wrapper.appendChild(audio);

				img.style.cursor = 'pointer';
				img.addEventListener('click', () => {
					if (audio.paused) {
						audio.play().catch(error => {
							console.error('Audio play failed:', error);
							mediaErrors.set(mediaKey, 'Failed to play audio: ' + error.message);
							showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
						});
					} else {
						audio.pause();
					}
				});
				audio.addEventListener('canplay', () => {
					audio.style.removeProperty("display");
					audio.play().catch(error => {
						console.error('Audio play failed:', error);
						mediaErrors.set(mediaKey, 'Failed to play audio: ' + error.message);
						showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
					});
				}, { once: true });
			}
		} else {
			const video = document.createElement('video');
			video.style.display = 'none';
			video.src = mediaUrl;
			video.controls = true;
			video.autoplay = false;
			video.loop = true;
			video.volume = 0.2;
			video.preload = 'auto';
			wrapper.appendChild(video);

			video.addEventListener('error', () => {
				loadingStates.set(mediaKey, false);
				mediaErrors.set(mediaKey, 'Failed to load video');
				showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
			});

			if (soundUrl) {
				video.addEventListener('canplaythrough', () => {
					loadingStates.set(mediaKey, false);
					loadingIndicator.style.display = 'none';
					video.style.removeProperty("display");
					initialMediaSize(video);
				}, { once: true });
				const audio = createAudioElement(soundUrl, false, isDraggableWindow, wrapper, mediaKey);
				syncMediaElements(video, audio, mediaKey);
				wrapper.appendChild(audio);
			} else {
				video.addEventListener('canplaythrough', () => {
					video.play().catch(error => {
						console.error('Video play failed:', error);
						mediaErrors.set(mediaKey, 'Failed to play video: ' + error.message);
						showMediaError(wrapper, mediaUrl, soundUrl, isDraggableWindow);
					});
					loadingStates.set(mediaKey, false);
					loadingIndicator.style.display = 'none';
					video.style.removeProperty("display");
					initialMediaSize(video);
				}, { once: true });
			}
		}

		const container = document.createElement('div');
		container.className = isDraggableWindow ? 'media-container' : 'media-container-inline';
		container.appendChild(wrapper);

		if(!isDraggableWindow) {
			const expander = document.createElement('div');
			expander.className = 'expander';
			container.appendChild(expander);
		}

		return container;
	}

	function initialMediaSize(element) {
		const elementHeight = parseFloat(getComputedStyle(element).height);
		if(elementHeight && elementHeight > MEDIA_INITIAL_HEIGHT) element.style.height = MEDIA_INITIAL_HEIGHT + 'px';
	}

	function showMediaError(container, mediaUrl, soundUrl, isDraggableWindow) {
		const loadingIndicator = container.querySelector('.loading-indicator');
		if (loadingIndicator) {
			loadingIndicator.style.display = 'none';
		}

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;
		const errorMessage = mediaErrors.get(mediaKey) || 'Failed to load';

		// Remove any existing error message
		const existingError = container.querySelector('.error-message');
		if (existingError) {
			container.removeChild(existingError);
		}

		const errorDiv = document.createElement('div');
		errorDiv.className = 'error-message';
		errorDiv.innerHTML = `
			${errorMessage}
		`;

		container.appendChild(errorDiv);
	}

	function createAudioElement(soundUrl, autoplay, isDraggableWindow = false, container, mediaKey) {
		const audio = document.createElement('audio');
		audio.style.display = 'none';
		audio.src = soundUrl;
		audio.loop = true;
		audio.volume = 0.2;
		audio.autoplay = autoplay;
		audio.preload = 'auto';
		audio.controls = true;

		// Show audio controls when container is hovered
		if (container) {
			audio.style.position = 'absolute';
			audio.style.top = '0';
			audio.style.left = '0';
			audio.style.right = '0';
			audio.style.opacity = '0';
			audio.style.transition = 'opacity 0.3s ease';
			audio.style.pointerEvents = 'none'; // Prevent interaction when hidden

			container.addEventListener('mouseenter', () => {
				audio.style.opacity = '1';
				audio.style.pointerEvents = 'auto';
			});

			container.addEventListener('mouseleave', () => {
				audio.style.opacity = '0';
				audio.style.pointerEvents = 'none';
			});
		}

		audio.addEventListener('canplay', () => {
			audio.style.removeProperty("display");
		}, { once: true });

		audio.addEventListener('error', () => {
			loadingStates.set(mediaKey, false);
			mediaErrors.set(mediaKey, 'Failed to load audio');
			if (container) {
				showMediaError(container, '', soundUrl, isDraggableWindow);
			}
		});

		return audio;
	}

	function syncMediaElements(video, audio, mediaKey) {
		let durationsMatch = false;
		let adequateDuration = false;
		let videoReady = false;
		let audioReady = false;
		let isSeeking = false;

		const checkDurations = () => {
			if (isFinite(video.duration) && isFinite(audio.duration)) {
				durationsMatch = Math.abs(video.duration - audio.duration) <= DURATION_MATCH_TOLERANCE;
				if (!durationsMatch) {
					console.log(`Not syncing audio: duration mismatch (video: ${video.duration.toFixed(2)}s, audio: ${audio.duration.toFixed(2)}s)`);
				}
				return true;
			}
			return false;
		};

		const checkReady = () => {
			if (videoReady && audioReady) {
				const checkInterval = setInterval(() => {
					if (checkDurations()) {
						clearInterval(checkInterval);
						video.play().catch(error => {
							console.error('Video play failed:', error);
							mediaErrors.set(mediaKey, 'Failed to play video: ' + error.message);
						});
						audio.play().catch(error => {
							console.error('Audio play failed:', error);
							mediaErrors.set(mediaKey, 'Failed to play audio: ' + error.message);
						});
						adequateDuration = (video.duration <= 3) ? false : true;
					}
				}, 100);
			}
		};

		video.addEventListener('loadedmetadata', () => {
			videoReady = true;
			checkReady();
		});

		audio.addEventListener('loadedmetadata', () => {
			audioReady = true;
			checkReady();
		});

		// Sync play/pause
		const syncPlayPause = (source, target) => {
			//if (durationsMatch) {
				if (source.paused) target.pause();
				else target.play().catch(console.error);
			//}
		};

		video.addEventListener('play', () => syncPlayPause(video, audio));
		video.addEventListener('pause', () => syncPlayPause(video, audio));
		video.addEventListener('ended', () => durationsMatch && !video.loop && audio.pause());

		audio.addEventListener('play', () => syncPlayPause(audio, video));
		audio.addEventListener('pause', () => syncPlayPause(audio, video));
		audio.addEventListener('ended', () => durationsMatch && !audio.loop && video.pause());

		// Sync volume/mute
		const syncVolume = (source, target) => {
			target.muted = source.muted;
			target.volume = source.volume;
		};

		video.addEventListener('volumechange', () => syncVolume(video, audio));
		audio.addEventListener('volumechange', () => syncVolume(audio, video));

		// Sync seeking
		const syncSeek = (source, target) => {
			if (durationsMatch && !isSeeking) {
				isSeeking = true;
				target.currentTime = source.currentTime;
				setTimeout(() => { isSeeking = false }, 100);
			}
		};

		video.addEventListener('seeked', () => syncSeek(video, audio));
		audio.addEventListener('seeked', () => syncSeek(audio, video));

		// Sync time updates
		const syncTimeUpdate = (source, target) => {
			if (durationsMatch && adequateDuration && !isSeeking && Math.abs(source.currentTime - target.currentTime) > 0.1) {
				target.currentTime = source.currentTime;
			}
		};

		video.addEventListener('timeupdate', () => syncTimeUpdate(video, audio));
		audio.addEventListener('timeupdate', () => syncTimeUpdate(audio, video));

		// Sync playback rate
		const syncRate = (source, target) => {
			if (durationsMatch) target.playbackRate = source.playbackRate;
		};

		video.addEventListener('ratechange', () => syncRate(video, audio));
		audio.addEventListener('ratechange', () => syncRate(audio, video));

		// Sync loop
		const syncLoop = (source, target) => {
			if (durationsMatch) target.loop = source.loop;
		};

		video.addEventListener('change', (e) => e.target === video && e.target.hasAttribute('loop') && syncLoop(video, audio));
		audio.addEventListener('change', (e) => e.target === audio && e.target.hasAttribute('loop') && syncLoop(audio, video));

		// Initial sync
		syncVolume(video, audio);
		syncRate(video, audio);
	}

	function createToggleButton(mediaUrl, soundUrl, mediaTarget, linkToThisPost, title, isDraggableButton = false) {
		const btn = document.createElement('button');
		btn.title = soundUrl ? (isDraggableButton ? 'Play with sound in a draggable window' : 'Play with sound') : (isDraggableButton ? 'Play in a draggable window' : 'Play');
		btn.className = isDraggableButton ? 'btnr parent play-file play-button-draggable icon-film' : 'btnr parent play-file play-button icon-play';
		btn.dataset.playButton = 'true';

		const mediaKey = `${mediaUrl}-${soundUrl || 'nosound'}`;

		// Check if this media has previously failed to load
		if (mediaErrors.has(mediaKey)) {
			btn.classList.add('error');
			btn.title = 'Media failed to load - Click to retry';
		}

		if (isDraggableButton) {
			btn.addEventListener('click', async (e) => {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				// If previously errored, remove error state
				if (btn.classList.contains('error')) {
					btn.classList.remove('error');
					mediaErrors.delete(mediaKey);
				}

				btn.classList.add('loading-state');
				btn.title = 'Loading...';

				try {
					const mediaPlayer = createMediaPlayer(mediaUrl, soundUrl, true);
					const windowTitle = mediaUrl.split('/').pop() || (soundUrl ? 'Media with Sound' : 'Media Player');
					createDraggableWindow(windowTitle, mediaPlayer, linkToThisPost, title);

					// Reset button state after a delay to allow media to load
					setTimeout(() => {
						btn.classList.remove('loading-state');
						btn.title = soundUrl ? 'Play with sound in a draggable window' : 'Play in a draggable window';
					}, 1000);
				} catch (error) {
					console.error('Failed to create media player:', error);
					btn.classList.remove('loading-state');
					btn.classList.add('error');
					btn.title = 'Failed to load - Click to retry';
					mediaErrors.set(mediaKey, error.message);
				}
			});
		} else {
			let mediaInserted = false;
			let mediaPlayer = null;
			const threadImageLink = mediaTarget.querySelector('.thread_image_link');
			let mediaWrapper;

			btn.addEventListener('click', async (e) => {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				// If previously errored, remove error state
				if (btn.classList.contains('error')) {
					btn.classList.remove('error');
					mediaErrors.delete(mediaKey);
				}

				if (!mediaInserted) {
					btn.classList.add('loading-state');
					btn.title = 'Loading...';

					try {
						mediaPlayer = createMediaPlayer(mediaUrl, soundUrl);
						threadImageLink.after(mediaPlayer);
						threadImageLink.style.display = 'none';
						btn.classList.remove("icon-play");
						btn.classList.remove("icon-remove");
						btn.classList.add("icon-remove");
						btn.title = 'Hide';
						mediaInserted = true;

						// Reset loading state after a delay
						setTimeout(() => {
							btn.classList.remove('loading-state');
						}, 1000);
					} catch (error) {
						console.error('Failed to create media player:', error);
						btn.classList.remove('loading-state');
						btn.classList.add('error');
						btn.title = 'Failed to load - Click to retry';
						mediaErrors.set(mediaKey, error.message);
					}
				} else {
					// Proper cleanup when hiding media
					if (mediaPlayer) {
						const video = mediaPlayer.querySelector('video');
						const audio = mediaPlayer.querySelector('audio');
						if (video) {
							video.pause();
							video.src = '';
							video.load();
						}
						if (audio) {
							audio.pause();
							audio.src = '';
							audio.load();
						}

						// Remove the media player from DOM
						if (mediaPlayer.parentNode) {
							mediaPlayer.parentNode.removeChild(mediaPlayer);
						}
					}
					threadImageLink.style.display = "unset";
					btn.classList.remove("icon-play");
					btn.classList.remove("icon-remove");
					btn.classList.add("icon-play");
					btn.title = soundUrl ? 'Play with Sound' : 'Play';
					mediaInserted = false;
					mediaPlayer = null;
				}
			});
		}

		return btn;
	}

	function injectMediaButtons() {
		// Process both video and image files with a single function
		processMediaFiles();
		// Add media list button if we have media items
		addFloatingMediaListButton();
		addMediaListButtonToNavbar();
	}

	function addFloatingMediaListButton() {
		if (mediaItems.length > 0 && !document.querySelector('#media-list-toggle-btn')) {
			const listBtn = document.createElement('button');
			listBtn.id = 'media-list-toggle-btn';
			listBtn.innerHTML = '🎬';
			listBtn.title = `Show Media List`;
			listBtn.style.marginLeft = '10px';

			listBtn.addEventListener('click', createMediaListWindow);

			document.body.appendChild(listBtn);
		}
	}

	function addMediaListButtonToNavbar() {
		if (mediaItems.length > 0 && !document.querySelector('#media-list-toggle-btn-navbar')) {
			const nav = document.querySelector('.navbar-inner .nav:nth-child(2)');
			if(nav) {
				const li = document.createElement('li');
				li.id = 'media-list-toggle-btn-navbar';
				li.innerHTML = '<a>Media List</a>';
				li.title = `Show Media List`;
				li.style.cursor = 'pointer';
				li.style.userSelect = 'none';
				li.children[0].addEventListener('click', createMediaListWindow);
				nav.appendChild(li);
			}
		}
	}


	function processMediaFiles() {
		const articles = document.querySelectorAll(`article.has_image`);

		for (const article of articles) {
			let postWrapper = article.querySelector(".post_wrapper");
			if (article.classList.contains('post_is_op')) postWrapper = article;
			if (!postWrapper) continue;

			const fileControls = postWrapper.querySelector(".post_file_controls");
			if (!fileControls || fileControls.dataset.hasMediaButtons) continue;

			// Find any supported media file
			const link = article.querySelector(threadImageLinkSelectors) || article.querySelector(postFileFilenameSelectors);
			if (!link || !link.href) continue;
			const filename = article.querySelector(".post_file_filename");
			if (!filename) continue;

			// Check if it requires sound (true for images, false for videos)
			const requireSound = SUPPORTED_IMAGE_EXTS.some(ext => link.href.toLowerCase().endsWith(ext));

			const soundUrl = extractSoundUrl(filename.getAttribute("title") || filename.innerHTML || '');

			// Skip images without sound if required
			if (requireSound && !soundUrl) continue;

			const mediaUrl = link.href;
			const linkToThisPost = postWrapper.querySelector('a[data-function="highlight"]');
			const title = filename.getAttribute("title") || filename.innerHTML;
			const thumbBox = postWrapper.querySelector(".thread_image_box");
			const thumbImg = thumbBox && thumbBox.querySelector('img');
			const thumbSrc = thumbImg && (thumbImg.src || thumbImg.getAttribute('data-src'));

			if (!thumbBox) continue;

			// Add to media items list
			addMediaListItem(mediaUrl, soundUrl, linkToThisPost, title, thumbSrc);

			// Create and insert buttons
			const draggableButton = createToggleButton(mediaUrl, soundUrl, thumbBox, linkToThisPost, title, true);
			const inlineButton = createToggleButton(mediaUrl, soundUrl, thumbBox, linkToThisPost, title);

			fileControls.insertAdjacentElement('afterend', draggableButton);
			fileControls.insertAdjacentElement('afterend', inlineButton);

			fileControls.dataset.hasMediaButtons = 'true';
		}

		//console.log(mediaItems);
	}

	// kudos to NecRaul's "Redirect on Archived.moe" script (https://greasyfork.org/en/scripts/539350)
		/* it doesn't work very well, might revisit later */
	/*async function handleRedirectsOnArchivedMoe() {
		const domains = {
			// archive.4plebs.org
			adv: ["archive.4plebs.org", false],
			hr: ["archive.4plebs.org", false],
			o: ["archive.4plebs.org", false],
			pol: ["archive.4plebs.org", false],
			s4s: ["archive.4plebs.org", false],
			sp: ["archive.4plebs.org", false],
			tg: ["archive.4plebs.org", false],
			trv: ["archive.4plebs.org", false],
			tv: ["archive.4plebs.org", false],
			x: ["archive.4plebs.org", false],

			// archiveofsins.com
			h: ["archiveofsins.com", false],
			hc: ["archiveofsins.com", false],
			hm: ["archiveofsins.com", false],
			i: ["archiveofsins.com", false],
			lgbt: ["archiveofsins.com", false],
			r: ["archiveofsins.com", false],
			s: ["archiveofsins.com", false],
			soc: ["archiveofsins.com", false],
			t: ["archiveofsins.com", false],
			u: ["archiveofsins.com", false],

			// boards.fireden.net
			cm: ["boards.fireden.net", false],
			y: ["boards.fireden.net", false],

			// thebarchive.com
			b: ["thebarchive.com", false],
			bant: ["thebarchive.com", false],

			// warosu.org
			3: ["warosu.org", false],
			biz: ["warosu.org", false],
			ck: ["warosu.org", false],
			diy: ["warosu.org", false],
			fa: ["warosu.org", false],
			ic: ["warosu.org", false],
			jp: ["warosu.org", false],
			lit: ["warosu.org", false],
			sci: ["warosu.org", false],

			// arch.b4k.dev
			v: ["arch.b4k.dev", true],
			vg: ["arch.b4k.dev", true],
			vm: ["arch.b4k.dev", true],
			vmg: ["arch.b4k.dev", true],
			vp: ["arch.b4k.dev", true],
			vrpg: ["arch.b4k.dev", true],
			vst: ["arch.b4k.dev", true],

			// archive.palanq.win
			c: ["archive.palanq.win", true],
			e: ["archive.palanq.win", true],
			n: ["archive.palanq.win", true],
			news: ["archive.palanq.win", true],
			out: ["archive.palanq.win", true],
			p: ["archive.palanq.win", true],
			pw: ["archive.palanq.win", true],
			toy: ["archive.palanq.win", true],
			vt: ["archive.palanq.win", true],
			w: ["archive.palanq.win", true],
			wg: ["archive.palanq.win", true],
			wsr: ["archive.palanq.win", true],

			// desuarchive.org
			a: ["desuarchive.org", true],
			aco: ["desuarchive.org", true],
			an: ["desuarchive.org", true],
			cgl: ["desuarchive.org", true],
			co: ["desuarchive.org", true],
			d: ["desuarchive.org", true],
			fit: ["desuarchive.org", true],
			g: ["desuarchive.org", true],
			his: ["desuarchive.org", true],
			int: ["desuarchive.org", true],
			k: ["desuarchive.org", true],
			m: ["desuarchive.org", true],
			mlp: ["desuarchive.org", true],
			mu: ["desuarchive.org", true],
			qa: ["desuarchive.org", true],
			r9k: ["desuarchive.org", true],
			trash: ["desuarchive.org", true],
			vr: ["desuarchive.org", true],
			wsg: ["desuarchive.org", true],
		};

		const board = window.location.pathname.split("/")[1];

		const config = domains[board];

		if (!config) return;

		const [domain, slice] = config;

		const links = document.querySelectorAll(`.thread_image_link, .post_file_filename`);

		for (const link of links) {
			const match = link.href.match(/\/redirect\/(\d+)(\.\w+)$/);
			if (!match) return;

			let filename = match[1];
			const extension = match[2];

			if (slice) filename = filename.slice(0, 13);

			link.href = `https://${domain}/${board}/full_image/${filename}${extension}`;
		}
	}*/

	async function init() {
		if(isFoolFuuka) {
			/*if (window.location.hostname === 'archived.moe') {
				await handleRedirectsOnArchivedMoe();
			}*/

			// Initial injection
			setTimeout(() => {injectMediaButtons()}, 2500);

			// Observer for new content
			const observer = new MutationObserver(injectMediaButtons);
			observer.observe(document.body, { childList: true, subtree: true });
		}
	}

	// Run when DOM is ready
	if (document.readyState === 'loading') {
		console.log('DOM not ready, adding DOMContentLoaded listener');
		document.addEventListener('DOMContentLoaded', function() {
			console.log('DOMContentLoaded fired');
			init();
		});
	} else {
		console.log('DOM already ready, executing immediately');
		init();
	}
})();