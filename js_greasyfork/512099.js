// ==UserScript==
// @name         YouTube Shorts Blaster
// @description  A userscript to automatically detect and remove YouTube page elements containing shorts outside of the "/shorts" page itself.
// @namespace    drez3000
// @author       drez3000
// @copyright    2024, drez3000 (https://github.com/drez3000)
// @license      MIT
// @match        *://*.youtube.com/*
// @exclude      *://accounts.youtube.com/*
// @grant        none
// @version      0.2.0
// @downloadURL https://update.greasyfork.org/scripts/512099/YouTube%20Shorts%20Blaster.user.js
// @updateURL https://update.greasyfork.org/scripts/512099/YouTube%20Shorts%20Blaster.meta.js
// ==/UserScript==

;(() => {
	'use strict'

	const MAX_DOM_LOOKUP_DEPTH = 22
	const MAX_CHECK_FREQUENCY_MS = 350

	function oncePageLoaded(callback) {
		return new Promise((res) => {
			const resolve = () => res(callback())
			if (document.readyState !== 'loading') {
				// Document is already ready, call the callback immediately
				resolve()
			} else {
				// Document is not ready yet, wait for the DOMContentLoaded event
				document.addEventListener('DOMContentLoaded', resolve)
			}
		})
	}

	function flatNodesOf(
		node,
		{ minDepth = 0, maxDepth = Number.POSITIVE_INFINITY, includeShadowRoot = true } = {},
	) {
		const nodes = []
		const stack = [{ node, depth: 0 }]
		while (stack.length > 0) {
			const { node: currentNode, depth } = stack.pop()

			if (depth >= minDepth && depth <= maxDepth) {
				nodes.push({ node: currentNode, depth })
			}

			// Add children to the stack with increased depth
			for (let i = currentNode.childNodes.length - 1; i >= 0; i--) {
				stack.push({ node: currentNode.childNodes[i], depth: depth + 1 })
			}
			if (includeShadowRoot && currentNode.shadowRoot) {
				stack.push({ node: currentNode.shadowRoot, depth: depth + 1 })
			}
		}
		return nodes.sort((a, b) => a.depth - b.depth).map((item) => item.node)
	}

	function isMain(node) {
		const tagName = node?.tagName || ''
		return tagName.match(/^(html|main|body|content|article)$/i)
	}

	function isShortsElement(node) {
		const tagName = node?.tagName || ''
		const headers = [...node.querySelectorAll('h1,h2,h3,h4,h5,h6')]
		return (
			tagName.match(/reel/i) ||
			(node?.attributes && node.attributes['is-shorts'] !== undefined) ||
			(headers.length === 1 && headers.at(0).innerText.match(/^shorts$/i))
		)
	}

	function selectYoutubeShortsThumbnails() {
		return [...document.querySelectorAll('#contents > ytd-video-renderer')].filter(
			(node) =>
				[...node.querySelectorAll('a')].filter((a) => a?.href?.match('/shorts')).length > 0,
		)
	}

	function selectYoutubeShortsSections() {
		return flatNodesOf(document, { maxDepth: MAX_DOM_LOOKUP_DEPTH }).filter(
			(node) =>
				typeof node?.querySelectorAll === 'function' &&
				node?.attributes !== undefined &&
				!isMain(node) &&
				isShortsElement(node),
		)
	}

	function removeYoutubeShorts() {
		return [...selectYoutubeShortsThumbnails(), ...selectYoutubeShortsSections()].map(
			(node) => {
				node?.remove && node.remove()
				return node
			},
		)
	}

	function check() {
		if (
			document.location.href.match(/youtube\..*\/shorts/i) ||
			document.location.href.match(/youtube\..*\/history/i) ||
			document.location.href.match(/youtube\..*\/playlist/i) ||
			document.location.href.match(/youtube\..*\/account/i)
		) {
			return
		}
		const removed = removeYoutubeShorts()
		if (removed.length) {
			console.info(`[YOUTUBE SHORTS BLASTER] Removed ${removed.length} elements:`, removed)
		}
	}

	function main() {
		oncePageLoaded(check).then(() => setInterval(check, MAX_CHECK_FREQUENCY_MS))
	}

	main()
})()
