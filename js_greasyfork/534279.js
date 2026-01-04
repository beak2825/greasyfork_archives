// ==UserScript==
// @name         GitHub to DeepWiki Link
// @name_zh      GitHub 到 DeepWiki 链接
// @namespace    https://github.com/worryzyy/fast2deepwiki
// @version      0.1
// @description  一个快速在github仓库页面跳转到DeepWiki的脚本；A script to quickly jump to DeepWiki from the GitHub repository page
// @author       weilei
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534279/GitHub%20to%20DeepWiki%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/534279/GitHub%20to%20DeepWiki%20Link.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	// Generate a unique page instance ID to ensure each page's script runs independently
	const PAGE_INSTANCE_ID =
		'deepwiki_' + Math.random().toString(36).substring(2, 15)

	// Add page ID to debug logs to distinguish between multiple pages
	function debugLog(message, obj = null) {
		const debug = false; // Set to true to enable debugging
		if (debug) {
			console.log(`[DeepWiki Debug ${PAGE_INSTANCE_ID}] ${message}`, obj || '')
		}
	}

	// Add page ID prefix to ensure DOM element IDs are unique across pages
	const BUTTON_ID = `deepwiki-button-${PAGE_INSTANCE_ID}`
	const STYLES_ID = `deepwiki-styles-${PAGE_INSTANCE_ID}`

	// Main function - add DeepWiki link to the page
	function addDeepWikiLink() {
		// First check if we're on a GitHub repository page
		const repoInfo = getRepositoryInfo()
		if (!repoInfo) {
			debugLog('Not a valid repository page')
			return
		}

		debugLog('Repository info detected', repoInfo)

		// Create DeepWiki link URL
		const deepWikiUrl = `https://deepwiki.com/${repoInfo.owner}/${repoInfo.repo}`

		// Add custom CSS styles to the page
		addCustomCSS()

		// Check if button already exists (avoid duplicate buttons)
		if (document.getElementById(BUTTON_ID)) {
			debugLog('Button already exists, skipping')
			return
		}

		// Create DeepWiki button
		const deepWikiButton = createDeepWikiButton(deepWikiUrl)

		// Find README link as insertion point
		const readmeLink = document.querySelector('a[href*="readme-ov-file"]')
		if (readmeLink) {
			debugLog('README link found')
			// Insert button after README link
			deepWikiButton.style.marginLeft = '10px'
			readmeLink.insertAdjacentElement('afterend', deepWikiButton)
		}
		debugLog('No suitable insertion point found')
	}

	// Create DeepWiki button element
	function createDeepWikiButton(url) {
		// Create button link directly
		const link = document.createElement('a')
		link.id = BUTTON_ID
		link.href = url
		link.target = '_blank'
		link.className = 'btn btn-sm'
		link.style.display = 'inline-flex'
		link.style.alignItems = 'center'
		link.style.justifyContent = 'center'
		link.style.position = 'relative'
		link.style.overflow = 'hidden'
		link.style.background = 'linear-gradient(90deg, #2188ff 0%, #43e97b 100%)'
		link.style.border = 'none'
		link.style.transition = 'all 0.2s cubic-bezier(.4,0,.2,1)'
		link.style.marginLeft = '8px'
		link.style.borderRadius = '6px'
		link.style.padding = '4px 14px'
		link.style.color = '#fff'
		link.style.fontWeight = '500'
		link.style.boxShadow = '0 1px 2px rgba(33,136,255,0.08)'

		// Add hover and click effects to the button
		link.addEventListener('mouseover', () => {
			link.style.background = 'linear-gradient(90deg, #0366d6 0%, #3bce6f 100%)'
			link.style.boxShadow = '0 4px 12px rgba(33,136,255,0.18)'
			link.style.transform = 'translateY(-1px)'
		})

		link.addEventListener('mouseout', () => {
			link.style.background = 'linear-gradient(90deg, #2188ff 0%, #43e97b 100%)'
			link.style.boxShadow = '0 1px 2px rgba(33,136,255,0.08)'
			link.style.transform = 'translateY(0)'
		})

		link.addEventListener('mousedown', () => {
			link.style.transform = 'scale(0.98) translateY(0)'
			link.style.boxShadow = '0 1px 3px rgba(33,136,255,0.12)'
		})

		link.addEventListener('mouseup', () => {
			link.style.transform = 'scale(1) translateY(-1px)'
			link.style.boxShadow = '0 4px 12px rgba(33,136,255,0.18)'
		})

		// Set button content
		link.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 8px;" class="deepwiki-icon">
                <path fill="currentColor" d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-3 5v2h3.586L7.293 14.293l1.414 1.414L14 10.414V14h2V7H9z"/>
            </svg>
            <span>DeepWiki</span>
        `
		return link
	}

	// Get repository information from current page
	function getRepositoryInfo() {
		// Extract repository info from URL
		const path = window.location.pathname.substring(1).split('/')

		// Check if there are enough path segments to represent a repository
		if (path.length < 2) return null

		// Check path parts are not GitHub special pages
		const nonRepoPathParts = [
			'settings',
			'trending',
			'new',
			'organizations',
			'marketplace',
			'explore',
			'topics'
		]
		if (
			nonRepoPathParts.includes(path[0]) ||
			nonRepoPathParts.includes(path[1])
		) {
			return null
		}

		return {
			owner: path[0],
			repo: path[1]
		}
	}

	// Add custom CSS to the page
	function addCustomCSS() {
		if (document.getElementById(STYLES_ID)) return

		const styleElement = document.createElement('style')
		styleElement.id = STYLES_ID
		styleElement.textContent = `
            #${BUTTON_ID}::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
                transform: translateX(-100%);
                transition: transform 0.6s ease;
            }
            
            #${BUTTON_ID}:hover::after {
                transform: translateX(100%);
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .deepwiki-icon {
                animation: pulse 2s infinite;
                filter: drop-shadow(0 0 1px rgba(255,255,255,0.5));
            }
        `

		document.head.appendChild(styleElement)
	}

	// Enhanced page observation
	function observePageChanges() {
		// Monitor URL changes - for SPA page navigation
		let lastUrl = location.href
		const urlChecker = setInterval(() => {
			if (location.href !== lastUrl) {
				lastUrl = location.href
				debugLog('URL changed, attempting to add button')
				setTimeout(addDeepWikiLink, 500) // Delay execution to wait for DOM updates
			}
		}, 1000)

		// Monitor DOM changes - for asynchronously loaded content
		const domObserver = new MutationObserver((mutations) => {
			if (!document.getElementById(BUTTON_ID)) {
				// Determine if changes are significant enough to retry adding the button
				const significantChanges = mutations.some((mutation) => {
					// Only retry when new nodes are added
					return mutation.addedNodes.length > 0
				})

				if (significantChanges) {
					debugLog('DOM changes detected, attempting to add button')
					addDeepWikiLink()
				}
			}
		})

		domObserver.observe(document.body, {
			childList: true,
			subtree: true
		})

		// Initial execution
		addDeepWikiLink()

		// Delayed retry in case DOM is not fully ready on initial load
		setTimeout(addDeepWikiLink, 1000)
	}

	// Start monitoring when page is loaded
	window.addEventListener('load', observePageChanges)

	// Also execute once when DOM is loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', addDeepWikiLink)
	} else {
		addDeepWikiLink()
	}
})()
