// ==UserScript==
// @name        SankakuDLNamer
// @namespace   SankakuDLNamer
// @description Help with DL naming
// @author      SlimeySlither, sanchan, Dramorian
// @match       http*://chan.sankakucomplex.com/*posts/*
// @match       https://chan.sankakucomplex.com/en/?tags=*
// @match       http*://idol.sankakucomplex.com/*posts/*
// @match       http*://beta.sankakucomplex.com/*posts/*
// @run-at      document-end
// @version     1.4.4
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/422679/SankakuDLNamer.user.js
// @updateURL https://update.greasyfork.org/scripts/422679/SankakuDLNamer.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Configuration
	const CONFIG = {
		usePostId: false,           // Replace hash with post ID if true
		prefixPostId: false,        // Put post ID in front if true
		maxTagEntries: 4,           // Max tags per category before truncation
		showCopyButton: false,      // Show "Copy Filename" button
		debug: false,               // Enable debug logging
		tagDelimiter: ', ',         // Delimiter between tags in filename
	};

	const SELECTORS = {
		tagSidebar: '#tag-sidebar',
		imageLink: '#highres',
	};

	const TAG_TYPES = {
		character: 'tag-type-character',
		copyright: 'tag-type-copyright',
		artist: 'tag-type-artist',
		general: 'tag-type-general',
	};

	// ==================== Main Entry Point ====================

	/**
	 * Main initialization function
	 */
	function init() {
		try {
			const postId = extractPostId();
			const tags = extractSidebarTags();
			const imageData = extractImageData();
			const filename = generateFilename(tags, imageData, postId);

			log('Post ID:', postId);
			log('Tags:', tags);
			log('Image Data:', imageData);
			log('Generated Filename:', filename);

			renderUI(imageData, filename);
		} catch (error) {
			console.error('[SankakuDLNamer] Initialization failed:', error);
		}
	}

	// ==================== Data Extraction ====================

	/**
	 * Extract post ID from URL pathname
	 * @returns {string} Post ID
	 */
	function extractPostId() {
		const pathname = window.location.pathname.replace(/\/$/, '');
		return pathname.substring(pathname.lastIndexOf('/') + 1);
	}

	/**
	 * Extract and categorize tags from sidebar
	 * @returns {Object<string, string[]>} Tags grouped by category
	 */
	function extractSidebarTags() {
		const sidebar = document.querySelector(SELECTORS.tagSidebar);
		if (!sidebar) {
			throw new Error('Tag sidebar not found');
		}

		const categorizedTags = {};

		for (const listItem of sidebar.querySelectorAll('ul > li')) {
			const tag = extractTagFromListItem(listItem);
			if (!tag) continue;

			const category = cleanText(listItem.className);
			categorizedTags[category] = categorizedTags[category] || [];
			categorizedTags[category].push(tag);
		}

		return categorizedTags;
	}

	/**
	 * Extract tag text from a list item
	 * @param {HTMLElement} listItem
	 * @returns {string|null} Tag text or null
	 */
	function extractTagFromListItem(listItem) {
		const links = listItem.querySelectorAll('a[id]');
		return links.length > 0 ? cleanText(links[0].innerText) : null;
	}

	/**
	 * Extract image URL, hash, and extension
	 * @returns {Object} Image data with url, hash, and extension
	 */
	function extractImageData() {
		const imageLink = document.querySelector(SELECTORS.imageLink);
		if (!imageLink) {
			throw new Error('High-res image link not found');
		}

		const url = new URL(imageLink.getAttribute('href'), document.baseURI);
		const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
		const dotIndex = filename.lastIndexOf('.');
		
		return {
			url,
			hash: filename.substring(0, dotIndex),
			extension: filename.substring(dotIndex),
		};
	}

	// ==================== Filename Generation ====================

	/**
	 * Generate filename from tags and image data
	 * @param {Object} tags - Categorized tags
	 * @param {Object} imageData - Image hash and extension
	 * @param {string} postId - Post ID
	 * @returns {string} Generated filename
	 */
	function generateFilename(tags, imageData, postId) {
		const characters = processCharacterTags(tags[TAG_TYPES.character]);
		const copyrights = tags[TAG_TYPES.copyright];
		const artists = tags[TAG_TYPES.artist];

		truncateTagLists(characters, copyrights, artists);

		const tokens = buildFilenameTokens(characters, copyrights, artists, imageData, postId);
		
		return tokens.join(' ') + imageData.extension;
	}

	/**
	 * Process character tags by removing parenthetical text and deduplicating
	 * @param {string[]} characters - Raw character tags
	 * @returns {string[]} Processed character tags
	 */
	function processCharacterTags(characters) {
		if (!characters || characters.length === 0) return null;

		const processed = characters.map(tag => {
			const parenIndex = tag.indexOf('(');
			if (parenIndex <= 0) return tag;

			// Remove trailing space/underscore before parenthesis
			const trimIndex = [' ', '_'].includes(tag[parenIndex - 1]) 
				? parenIndex - 1 
				: parenIndex;
			return tag.substring(0, trimIndex);
		});

		return [...new Set(processed)]; // Deduplicate
	}

	/**
	 * Sort and truncate tag lists
	 * @param {...string[]|null} tagLists - Variable number of tag arrays
	 */
	function truncateTagLists(...tagLists) {
		for (const tags of tagLists) {
			if (!tags) continue;

			tags.sort();
			if (tags.length > CONFIG.maxTagEntries) {
				tags.splice(CONFIG.maxTagEntries);
				tags.push('...');
			}
		}
	}

	/**
	 * Build filename token array
	 * @param {string[]|null} characters
	 * @param {string[]|null} copyrights
	 * @param {string[]|null} artists
	 * @param {Object} imageData
	 * @param {string} postId
	 * @returns {string[]} Filename tokens
	 */
	function buildFilenameTokens(characters, copyrights, artists, imageData, postId) {
		const tokens = [];

		// Prefix with post ID if configured
		if (CONFIG.usePostId && CONFIG.prefixPostId) {
			tokens.push(postId, '-');
		}

		// Add character tags
		if (characters) {
			tokens.push(characters.join(CONFIG.tagDelimiter));
		}

		// Add copyright tags in parentheses
		if (copyrights) {
			tokens.push(`(${copyrights.join(CONFIG.tagDelimiter)})`);
		}

		// Add artist tags with "drawn by" prefix
		if (artists) {
			tokens.push('drawn by', artists.join(CONFIG.tagDelimiter));
		}

		// Add hash or post ID as identifier
		if (!CONFIG.usePostId) {
			tokens.push(imageData.hash);
		} else if (!CONFIG.prefixPostId) {
			tokens.push(postId);
		}

		// Clean up trailing dash
		if (tokens[tokens.length - 1] === '-') {
			tokens.pop();
		}

		return tokens;
	}

	// ==================== UI Rendering ====================

	/**
	 * Render download and copy buttons
	 * @param {Object} imageData - Image data
	 * @param {string} filename - Generated filename
	 */
	function renderUI(imageData, filename) {
		const downloadButton = createDownloadButton(imageData.url.href, filename);
		insertButtonUnderDetails(downloadButton);

		if (CONFIG.showCopyButton) {
			const copyButton = createCopyFilenameButton(filename);
			insertButtonUnderDetails(copyButton);
		}
	}

	/**
	 * Create download button element
	 * @param {string} url - Image URL
	 * @param {string} filename - Download filename
	 * @returns {HTMLElement} Download button
	 */
	function createDownloadButton(url, filename) {
		const button = document.createElement('a');
		button.href = '#';
		button.innerText = 'Download';
		button.onclick = (e) => {
			e.preventDefault();
			initiateDownload(url, filename);
		};
		return button;
	}

	/**
	 * Create copy filename button element
	 * @param {string} filename - Filename to copy
	 * @returns {HTMLElement} Copy button
	 */
	function createCopyFilenameButton(filename) {
		const button = document.createElement('a');
		button.href = '#';
		button.innerText = 'Copy Filename';
		button.onclick = (e) => {
			e.preventDefault();
			navigator.clipboard.writeText(filename)
				.then(() => console.log('[SankakuDLNamer] Filename copied'))
				.catch(err => console.error('[SankakuDLNamer] Copy failed:', err));
		};
		return button;
	}

	/**
	 * Insert button as list item under image details
	 * @param {HTMLElement} button - Button element to insert
	 */
	function insertButtonUnderDetails(button) {
		const imageLink = document.querySelector(SELECTORS.imageLink);
		if (!imageLink) {
			throw new Error('Image link not found for button insertion');
		}

		const listItem = document.createElement('li');
		listItem.appendChild(button);
		imageLink.parentNode.insertAdjacentElement('afterend', listItem);
	}

	// ==================== Download Logic ====================

	/**
	 * Initiate file download using GM_download
	 * @param {string} url - Download URL
	 * @param {string} filename - Save filename
	 */
	function initiateDownload(url, filename) {
		console.log('[SankakuDLNamer] Starting download:', filename);

		GM_download({
			url,
			name: filename,
			saveAs: true,
			onload: () => console.log('[SankakuDLNamer] Download complete'),
			ontimeout: () => console.error('[SankakuDLNamer] Download timeout'),
			onerror: (error, details) => {
				console.error('[SankakuDLNamer] Download failed:', error, details);
				alert(`Download failed: ${error}`);
			},
			onprogress: () => log('Download progress...'),
		});
	}

	// ==================== Utilities ====================

	/**
	 * Clean text by removing illegal filename characters
	 * @param {string} text - Input text
	 * @returns {string} Cleaned text
	 */
	function cleanText(text) {
		return text.replaceAll(/[/\\?%*:|"<>]/g, '-');
	}

	/**
	 * Debug logging helper
	 * @param {...any} args - Arguments to log
	 */
	function log(...args) {
		if (CONFIG.debug) {
			console.debug('[SankakuDLNamer]', ...args);
		}
	}

	// ==================== Initialization ====================

	if (document.readyState === 'complete' || 
	    document.readyState === 'loaded' || 
	    document.readyState === 'interactive') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init, false);
	}

})();