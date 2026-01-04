// ==UserScript==
// @name         GDPR Blaster
// @description  Automatically remove GDPR / Cookie Consent dialogs without accepting or denying prompts.
// @namespace    drez3000
// @author       drez3000
// @copyright    2024, drez3000 (https://github.com/drez3000)
// @license      MIT
// @tag          productivity
// @match        *://*/*
// @grant        none
// @version      0.2.0
// @downloadURL https://update.greasyfork.org/scripts/512014/GDPR%20Blaster.user.js
// @updateURL https://update.greasyfork.org/scripts/512014/GDPR%20Blaster.meta.js
// ==/UserScript==

; (() => {
	'use strict'

	const MAX_ATTEMPTS = 16
	const MAX_TRIGGERS = 7
	const MAX_DIALOG_REMOVALS = 5
	const MAX_OVERLAY_REMOVALS = 5
	const MAX_DIALOG_REMOVALS_PER_PASS = 2
	const MAX_OVERLAY_REMOVALS_PER_PASS = 2

	const MIN_CHECK_DELAY_MS = 50
	const MAX_CHECK_DELAY_MS = 300
	const MAX_SHADOW_ROOT_CRAWL_DEPTH = 24
	const MAX_OVERLAY_REMOVAL_DEPTH = 12

	let dialogsClosed = 0
	let overlaysClosed = 0
	let triggeredCount = 0

	function all(conditions, item) {
		return conditions.find((f) => !f(item)) === undefined
	}

	function any(conditions, item) {
		return conditions.find((f) => f(item)) !== undefined
	}

	function oncePageLoaded(callback) {
		if (document.readyState !== 'loading') {
			// Document is already ready, call the callback immediately
			callback()
		} else {
			// Document is not ready yet, wait for the DOMContentLoaded event
			document.addEventListener('DOMContentLoaded', callback)
		}
	}

	function flatNodesOf(node, { minDepth = 0, maxDepth = Number.POSITIVE_INFINITY, includeShadowRoot = true } = {}) {
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

	function subtreeMatching(element, conditions = []) {
		conditions = Array.isArray(conditions) ? conditions : [conditions]
		conditions = [(node) => node.constructor.name != 'HTMLDocument', ...conditions]
		return flatNodesOf(element)
			.reverse()
			.filter((node) => all(conditions, node))
	}

	function getBoundingClientRectWithShadowRoot(node) {

		const nodes = flatNodesOf(node, { maxDepth: MAX_SHADOW_ROOT_CRAWL_DEPTH })
		const parentRect = {
			top: Number.POSITIVE_INFINITY, left: Number.POSITIVE_INFINITY,
			right: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY,
			width: 0, height: 0
		}

		for (let node of nodes) {
			const childRect = node?.getBoundingClientRect && node.getBoundingClientRect()
			if (!childRect || (childRect.bottom === childRect.top && childRect.left === childRect.right)) {
				continue
			}
			if (childRect?.top < parentRect.top) { parentRect.top = childRect.top }
			if (childRect?.left < parentRect.left) { parentRect.left = childRect.left }
			if (childRect?.right > parentRect.right) { parentRect.right = childRect.right }
			if (childRect?.bottom > parentRect.bottom) { parentRect.bottom = childRect.bottom }
		}
		parentRect.width = parentRect.right - parentRect.left
		parentRect.height = parentRect.bottom - parentRect.top

		return parentRect
	}

	function methodA(node) {
		const banlist = [
			/iubenda/i,
			/cookie-banner/i,
			/cookie-popup/i,
			/cookie-consent/i,
			/gdpr/i,

			/^didomi-popup$/i,
			/^notice-cookie-block$/i,
			/^tc-privacy-wrapper$/i,
			/^cmpbox$/i,
			/^cookie-note$/i,
			/^cookie-law-info-bar$/i,
			/^cf-root$/i,
			/^cookiefirst-root$/i,
			/^CybotCookiebotDialog$/i,
			/^usercentrics-root$/i,
			/^onetrust-consent-sdk$/i,
			/^onetrust-banner-sdk$/i,
			/^ppms_cm_popup_overlay$/i,
			/^consent_blackbar$/i,
			/^truste-consent-track$/i,
			/^consent-bump$/i,
			/^sp_message_container$/i,
			/^sp_message_container_.*$/i,
			/^consentBanner$/i,
			/^cookie-banner-root$/i,
			/^gdpr-banner-container$/i,
			/^as-oil$/i,
			/^iubenda$/i,
			/^iubenda-cs-banner$/i,
			/^gdpr$/i,
			/^cookies$/i,
			/^cookie$/i,
			/^privacy-policy$/i,
			/^privacyPolicy$/i,
			/^tracking$/i,
			/^privacy$/i,
			/^consent$/i,
			/^qc-cmp[0-9]?-container$/i,
			/^qc-cmp[0-9]?-ui-container$/i,
			/^qc-cmp[0-9]?-showing$/i,
			/^wt-cli-cookie-bar-container$/i,
			/^wt-cli-cookie-bar$/i,
			/^BorlabsCookie$/i,
			/^osano-cm-window$/i,
			/^js-cookie-consent-banner$/i,
			/^hx_cookie-banner$/i,
			/^ytd-consent-bump-v2-lightbox$/i,
		]
		const classes = [...(node?.classList || [])]
		const id = node.id.toLowerCase()
		const haystack = [id].concat(classes)
		const conditions = banlist.map((ban) => (hay) => hay.match(ban))
		const matches = undefined !== haystack.find((hay) => any(conditions, hay))
		return matches
	}

	function methodB(node) {

		if (!hasPlausibleSize(node)) {
			return false
		}

		const confirmationHints = [/\ba(cc|kz)e(p)?t/i, /\bagree\b/i, /\bconsent\b/i, /\bcontinue\b/i, /\benable\b/i, /\ballow\b/i, /\bok\b/i]
		const denialHints = [
			/\breject\b/i,
			/\brifiuta\b/i,
			/\bdeny\b/i,
			/\bclose\b/i,
			/\boptions\b/i,
			/\bcookie\bpreferences\b/i,
			/\bcookie\bsettings\b/i,
			/\b(non)?(-)?essen(t|z)ial\b/i,
			/\b(ab)?lehnen?/i,
		]
		const contentHints = [/\bcookie(s)?\b/i, /(we|this site) use(s)?/i]

		const clickableElements = subtreeMatching(
			node,
			[
				(node) => (
					node?.tagName?.match(/^a$/i) ||
					node?.tagName?.match(/button/i) ||
					node?.classList?.toString().match(/(button|btn|clickable)/i) ||
					(node?.tagName?.match(/^input$/i) && node?.attributes?.type?.value?.match(/^submit$/i))
				)
			]
		)

		const controlElementRequirements = [
			(node) => typeof node?.innerText === 'string' && typeof node?.innerText?.match === 'function',
			(node) => !node?.classList?.toString().match(/(auth|login|log-in|signin|sign-in|signup|sign-up|register|registration)/i),
			(node) => node?.innerText?.length <= 32,
			(node) => !node?.innerText.match(/(auth|login|log in|signin|sign in|signup|sign up|register|registration)/i),
		]

		const controlElements = clickableElements.filter(el => all(controlElementRequirements, el))

		const acceptConditions = confirmationHints.map((h) => (t) => t.match(h))
		const has1Accept = controlElements.find((el) => any(acceptConditions, el.innerText))

		const denyConditions = denialHints.map((h) => (t) => t.match(h))
		const has1Deny = controlElements.find((el) => any(denyConditions, el.innerText))

		const contentConditions = contentHints.map((h) => (t) => t.match(h))
		const haystackText = node?.innerText || ''
		const hasMatchingContent = any(contentConditions, haystackText)

		return !!(node && clickableElements.length >= 2 && (has1Accept || has1Deny) && hasMatchingContent)
	}

	const whitelist = ['html', 'body', 'main', 'article']
	const detectionMethods = [methodA, methodB]

	function isNotMain(node) {
		const qs = whitelist.join(', ')
		const found = node.querySelector(qs)
		const tagName = node?.tagName?.toLowerCase() || ''
		return !whitelist.includes(tagName) && node.role != 'main' && !found
	}

	function isNotWhitelisted(node) {
		const tag = node?.tagName?.toLowerCase()
		return !!tag && !whitelist.includes(tag)
	}

	function hasPlausibleSize(node) {
		const va = window.innerHeight * window.innerWidth
		const nr = node?.getBoundingClientRect && getBoundingClientRectWithShadowRoot(node)
		const na = nr && nr.width * nr.height
		const rat1 = na && Math.sqrt(na) / Math.sqrt(va)
		const rat2 = nr && nr.width / nr.height
		return rat1 > 0.05 && rat1 < 1.1 && rat2 > 0.9 && nr.height < window.innerHeight
	}

	function isInViewport(node) {
		const style = node?.constructor?.name?.match(/Element$/) && window.getComputedStyle(node)
		const isFixed = !!style && style.position === 'fixed'
		const fromY = !isFixed ? window.scrollY : 0
		const toY = !isFixed ? fromY + window.innerHeight : window.innerHeight
		const bb = node?.getBoundingClientRect && getBoundingClientRectWithShadowRoot(node)
		return bb && ((bb.top >= fromY && bb.top <= toY) || (bb.bottom >= fromY && bb.bottom <= toY))
	}

	function containsClickableSomething(node) {
		return (
			typeof node?.querySelector === 'function' &&
			(node.querySelector('button, a, input[type="submit"]') ||
				subtreeMatching(node, (node) => node?.classList?.toString().match(/(button|btn|clickable)/i)).length)
		)
	}

	function doesntContainEditableInputFields(node) {
		const inputTypes = [
			'color',
			'date',
			'datetime-local',
			'email',
			'file',
			'image',
			'month',
			'number',
			'password',
			'range',
			'search',
			'tel',
			'text',
			'time',
			'url',
			'week',
		]
		const qs = inputTypes.map((t) => `input[type="${t}"]`).join(', ')
		const found = node.querySelector(qs)
		return !found
	}

	function isOverlay(node) {
		const style = window.getComputedStyle(node)
		const viewport = window.innerHeight * window.innerWidth
		const rect = node?.getBoundingClientRect && node.getBoundingClientRect(node)
		const area = node && rect.width * rect.height
		const rat = area / viewport
		return (
			rat >= 0.8 &&
			(style.height === '100%' ||
				style.height === '100vh' ||
				style.position === 'fixed' ||
				style.position === 'absolute' ||
				style.zIndex >= 1000 ||
				style.opacity < 0.99)
		)
	}

	function getGdprDialogs() {
		return subtreeMatching(document, [
			(node) => typeof node?.querySelectorAll === 'function',
			(node) => isNotMain(node),
			(node) => isNotWhitelisted(node),
			(node) => containsClickableSomething(node),
			(node) => doesntContainEditableInputFields(node),
			(node) => isInViewport(node),
			(node) => any(detectionMethods, node),
		]).sort((a, b) => {
			const ar = a.getBoundingClientRect()
			const br = b.getBoundingClientRect()
			const aa = ar.height * ar.width
			const ba = br.height * br.width
			return ba - aa
		})
	}

	function closeGdprDialogs(limit = 1) {
		return getGdprDialogs()
			.filter(node => !!node.remove)
			.slice(0, limit)
			.map((node) => {
				console.info('[GDPR BLASTER] Removing dialog:', node)
				node.remove()
				return node
			})
	}

	function restoreScroll() {

		// Many websites disable scrolling when the gdpr dialog is open
		// Since we harshly remove()'d the dialogs, we need to do our best to ensure user can scroll page content

		const elements = [
			document.body,
			document.querySelector('html'),
			document.querySelector('main') || document.querySelector('#main'),
			document.documentElement,
			document.scrollingElement,
		].filter((x) => !!x)

		const needles = [/no[-_]?scroll/i, /scroll(ing)?[-_]?disabl/i, /disabl.*scroll/i, /(modal|popup|banner|gdpr|consent)[-_]?open/i]

		for (const element of elements) {
			const classes = [...element.classList]
			for (const cls of classes) {
				for (const needle of needles) {
					if (cls.match(needle)) {
						element.classList.remove(cls)
					}
				}
			}
			element.style.overflow = 'scroll'
			element.style.position = ''
		}
	}

	function removeOverlays(limit = 1) {
		return flatNodesOf(document, { maxDepth: MAX_OVERLAY_REMOVAL_DEPTH })
			.filter((node) => {
				return (
					typeof node?.querySelector === 'function' &&
					isNotWhitelisted(node) &&
					isOverlay(node) &&
					isNotMain(node) &&
					doesntContainEditableInputFields(node)
				)
			})
			.filter(node => !!node.remove)
			.slice(0, limit)
			.map((node) => {
				console.info('[GDPR BLASTER] Removing overlay:', node)
				node.remove()
				return node
			})
	}

	function getDialogsLeftToClose() {
		return Math.max(0, MAX_DIALOG_REMOVALS - dialogsClosed)
	}

	function getOverlaysLeftToClose() {
		return Math.max(0, MAX_OVERLAY_REMOVALS - overlaysClosed)
	}

	function check() {
		const dltc = Math.min(getDialogsLeftToClose(), MAX_DIALOG_REMOVALS_PER_PASS)
		const oltc = Math.min(getOverlaysLeftToClose(), MAX_OVERLAY_REMOVALS_PER_PASS)
		let once = 1
		if (dltc > 0) {
			const closed = closeGdprDialogs(dltc)
			if (closed.length) {
				triggeredCount += once
				once = 0
			}
		}
		if (oltc > 0) {
			const closed = removeOverlays(oltc)
			overlaysClosed += closed.length
			if (closed.length) {
				triggeredCount += once
				once = 0
			}
		}
		if (once === 0) {
			document.querySelector('html').style.overflow = ''
			document.querySelector('html').classList.remove('sp-message-open')
			restoreScroll()
		}
	}

	function enqueue(i = 0, ms = 0) {
		const before = Date.now()
		setTimeout(() => {
			check()
			if (
				triggeredCount <= MAX_TRIGGERS
				&& i < MAX_ATTEMPTS
				&& (getDialogsLeftToClose() || getOverlaysLeftToClose())
			) {
				const elapsed = Date.now() - before
				const ms = Math.max(MIN_CHECK_DELAY_MS, Math.min(MAX_CHECK_DELAY_MS, MIN_CHECK_DELAY_MS + ((1.337 ** (i + 23)) / 42) - elapsed))
				enqueue(i + 1, ms)
			}
		}, ms)
	}

	oncePageLoaded(enqueue)
})()
