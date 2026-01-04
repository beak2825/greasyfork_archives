// ==UserScript==
// @name         Reddit Comment Auto-Expander (Smooth)
// @namespace    _pc
// @author       verydelight
// @version      1.08
// @license      MIT
// @compatible   Firefox Tampermonkey
// @description  Automatically and smoothly expands all collapsed comments on Reddit [except for permalink ones...] with enhanced performance
// @match        *://*.reddit.com/r/*/comments/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546618/Reddit%20Comment%20Auto-Expander%20%28Smooth%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546618/Reddit%20Comment%20Auto-Expander%20%28Smooth%29.meta.js
// ==/UserScript==
(function() {
	'use strict';
	const pre_load = 1200;
	const batch_size = 12;
    const DELAY_INTERVAL = 15; // Extracted for clarity

    // Global flags for pausing
    let isEditActive = false; // Pauses Observer and Expansion Checks
    let isClickingBatch = false; // NEW: Pauses all SafeClicks during batch execution

    // Inject CSS style to lock the editor from script clicks
    const style = document.createElement('style');
    style.id = 'reddit-editor-lock';
    style.textContent = `
      .userscript-editor-lock * {
        pointer-events: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

	function safeClick(el) {
        // CRITICAL CHECK: Block clicks if a batch is currently executing (the timing issue)
        if (isClickingBatch) return;

        // Block clicks if the editor lock is on (the detection issue)
        if (isEditActive) return;

		if (!el || el.disabled || el.offsetParent === null) return;
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		el.dispatchEvent(event);
	}

	function isInViewport(el) {
		const rect = el.getBoundingClientRect();
		return rect.top < window.innerHeight + pre_load && rect.bottom > -pre_load;
	}

	function expandVisible() {
        // AGGRESSIVE EDITOR DETECTION BLOCK
        const activeComposer = document.querySelector('shreddit-comment-composer, shreddit-post-composer, faceplate-modal');

        // PAUSE LOGIC: If an editor/modal is found, pause everything.
        if (activeComposer) {
            (activeComposer.closest('body') || activeComposer).classList.add('userscript-editor-lock');
            isEditActive = true;
            return;
        }

        // RESUME LOGIC: If no editor is found, resume.
        const lockedComposer = document.querySelector('.userscript-editor-lock');
        if (lockedComposer) {
            lockedComposer.classList.remove('userscript-editor-lock');
        }
        isEditActive = false;

        // ** EXACT ORIGINAL EXPANSION LOGIC **
		const batch = [];
		const editor = document.querySelector('[data-test-id="post-content"], [data-testid="comment"]');

		document.querySelectorAll('shreddit-comment button[aria-controls][aria-expanded="false"], shreddit-comment button[rpl]:not([aria-expanded="true"])')
		.forEach(btn => {
			if (btn.closest('aside')) return;
			if (editor && editor.contains(btn)) return;
			if (isInViewport(btn) && !btn.closest('shreddit-comment-action-row')) batch.push(btn);
		});

		document.querySelectorAll('faceplate-partial button')
		.forEach(btn => {
			if (btn.closest('aside')) return;
			if (editor && editor.contains(btn)) return;
			if (isInViewport(btn) && !btn.closest('shreddit-comment-action-row') && btn.offsetParent !== null) batch.push(btn);
		});

		document.querySelectorAll('shreddit-comment[collapsed]')
		.forEach(comment => {
			if (comment.closest('aside')) return;
			if (editor && editor.contains(comment)) return;
			if (!isInViewport(comment)) return;
			const btn = comment.querySelector('button[aria-controls]');
			if (btn && btn.getAttribute('aria-expanded') === 'false') batch.push(btn);
			else if (!btn) batch.push(comment);
		});

        // Only run if there's work to do
        if (batch.length === 0) return;

        // Set the global click lock on while batches are scheduled
        isClickingBatch = true;

		for (let i = 0; i < batch.length; i += batch_size) {
            // Calculate when the last timeout will execute
            const lastTimeoutTime = (batch.length - 1) * DELAY_INTERVAL;

			setTimeout(() => {
				batch.slice(i, i + batch_size).forEach(el => {
					safeClick(el);
					if (el.matches('shreddit-comment[collapsed]') && !el.querySelector('button[aria-controls]')) {
						el.removeAttribute('collapsed');
						el.querySelectorAll('[slot^="children"], [slot="next-reply"]').forEach(child => {
							child.hidden = false;
							child.style.display = '';
						});
					}
				});

                // Check if this is the very last batch to execute
                if (i + batch_size >= batch.length) {
                    // Schedule the unlock to happen after a small buffer
                    setTimeout(() => {
                        isClickingBatch = false;
                    }, DELAY_INTERVAL + 1); // Add a small buffer delay
                }

			}, i * DELAY_INTERVAL);
		}
	}

    // MUTATION OBSERVER PAUSE
	const observer = new MutationObserver(mutations => {
        if (isEditActive) return;

		mutations.forEach(m => {
			if (m.type === 'childList' && m.addedNodes.length > 0) {
				expandVisible();
			}
		});
	});

	function initObserver() {
		const container = document.querySelector('shreddit-comments') ||
		document.querySelector('[data-test-id="comments-page"], [data-testid="comments-page"]') ||
		document.querySelector('shreddit-comment')?.closest('main, #SHORTCUT_FOCUSABLE_DIV, body');
		if (!container) {
			setTimeout(initObserver, 250);
			return;
		}
		observer.observe(container, { childList: true, subtree: true });
		expandVisible();
	}

	initObserver();
	window.addEventListener('scroll', () => expandVisible());
    window.addEventListener('mousedown', expandVisible);
})();