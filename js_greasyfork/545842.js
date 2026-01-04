// ==UserScript==
// @name         Block buyee/worldshopping popups everywhere
// @namespace    https://dakidex.com
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @description  Block buyee and worldshopping popups on all websites
// @version      1.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545842/Block%20buyeeworldshopping%20popups%20everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/545842/Block%20buyeeworldshopping%20popups%20everywhere.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const BLOCK_HOSTS = [
		'connect.buyee.jp',
		'worldshopping.jp',
		'shop-js.worldshopping.jp',
		'checkout-js.worldshopping.jp',
		'checkout-api.worldshopping.jp'
	];
	function isBlockedUrl(u) {
		if (!u) return false;
		try {
			const urlStr = String(u);
			return BLOCK_HOSTS.some(host => urlStr.indexOf(host) !== -1);
		} catch (e) { return false; }
	}

	// Remove any existing matching elements
	function removeExisting() {
		try {
			document.querySelectorAll('iframe,script').forEach(el => {
				const src = el.src || (el.getAttribute && el.getAttribute('src')) || '';
				if (isBlockedUrl(src)) el.remove();
			});
		} catch (e) { /* ignore */ }
	}

	// Patch Document.createElement to neutralize src assignment for iframe/script
	const origCreateElement = Document.prototype.createElement;
	Document.prototype.createElement = function (tagName, options) {
		const el = origCreateElement.call(this, tagName, options);
		const tag = String(tagName).toLowerCase();
		if (tag === 'iframe' || tag === 'script') {
			// intercept setAttribute for src/data attributes
			try {
				const origSetAttr = el.setAttribute.bind(el);
				el.setAttribute = function (name, value) {
					if ((name === 'src' || name === 'data') && isBlockedUrl(value)) return;
					return origSetAttr(name, value);
				};
			} catch (e) { /* ignore */ }

			// override property setter for .src if prototype exposes it
			try {
				const proto = Object.getPrototypeOf(el);
				const desc = Object.getOwnPropertyDescriptor(proto, 'src');
				if (desc && typeof desc.set === 'function') {
					Object.defineProperty(el, 'src', {
						configurable: true,
						enumerable: true,
						get: function () { return desc.get.call(this); },
						set: function (v) { if (isBlockedUrl(v)) return; return desc.set.call(this, v); }
					});
				}
			} catch (e) { /* ignore */ }
		}
		return el;
	};

	// Intercept DOM insertion methods to block direct appends/insertions of blocked nodes
	['appendChild', 'insertBefore', 'replaceChild'].forEach(fn => {
		const orig = Node.prototype[fn];
		if (!orig) return;
		Node.prototype[fn] = function (node, ...args) {
			try {
				if (!node) return orig.call(this, node, ...args);
				// If the node itself is a blocked iframe/script, drop it
				if (node.nodeType === 1) {
					const tag = (node.tagName || '').toLowerCase();
					if (tag === 'iframe' || tag === 'script') {
						const src = node.src || (node.getAttribute && node.getAttribute('src')) || '';
						if (isBlockedUrl(src)) return node;
					}
					// Remove nested blocked elements before insertion
					try {
						const nested = node.querySelectorAll && node.querySelectorAll('iframe,script');
						if (nested && nested.length) {
							nested.forEach(n => {
								const s = n.src || (n.getAttribute && n.getAttribute('src')) || '';
								if (isBlockedUrl(s)) n.remove();
							});
						}
					} catch (e) { /* ignore */ }
				}
			} catch (e) { /* ignore */ }
			return orig.call(this, node, ...args);
		};
	});

	// Observe DOM mutations and remove any newly added blocked frames/scripts
	const observer = new MutationObserver(mutations => {
		for (const m of mutations) {
			for (const n of m.addedNodes) {
				try {
					if (n.nodeType !== 1) continue;
					const tag = (n.tagName || '').toLowerCase();
					if (tag === 'iframe' || tag === 'script') {
						const src = n.src || (n.getAttribute && n.getAttribute('src')) || '';
						if (isBlockedUrl(src)) { n.remove(); continue; }
					}
					// remove blocked nested nodes
					const nested = n.querySelectorAll && n.querySelectorAll('iframe,script');
					if (nested && nested.length) {
						nested.forEach(el => {
							const s = el.src || (el.getAttribute && el.getAttribute('src')) || '';
							if (isBlockedUrl(s)) el.remove();
						});
					}
				} catch (e) { /* ignore */ }
			}
		}
	});
	try {
		observer.observe(document.documentElement || document, { childList: true, subtree: true });
	} catch (e) { /* ignore */ }

	// Patch existing elements' src setter defensively
	function patchExistingProps() {
		try {
			document.querySelectorAll('iframe,script').forEach(el => {
				try {
					const proto = Object.getPrototypeOf(el);
					const desc = Object.getOwnPropertyDescriptor(proto, 'src');
					if (desc && typeof desc.set === 'function') {
						Object.defineProperty(el, 'src', {
							configurable: true,
							enumerable: true,
							get: function () { return desc.get.call(this); },
							set: function (v) { if (isBlockedUrl(v)) return; return desc.set.call(this, v); }
						});
					}
				} catch (e) { /* ignore */ }
			});
		} catch (e) { /* ignore */ }
	}

	// initial cleanup (run as early as possible)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => { removeExisting(); patchExistingProps(); }, { once: true });
	} else {
		removeExisting();
		patchExistingProps();
	}
})();

