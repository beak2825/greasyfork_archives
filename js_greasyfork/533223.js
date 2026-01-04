// ==UserScript==
// @name         Holotower Custom Fixes
// @namespace    http://holotower.org/
// @version      1.4
// @author       /hlgg/
// @license      MIT
// @description  Persistent “You” highlight dropdown, and Q‑key Quick‑Reply for holotower.org.
// @icon         https://boards.holotower.org/favicon.gif
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533223/Holotower%20Custom%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/533223/Holotower%20Custom%20Fixes.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Detect whether “Holotower Thread Status Updater” is active
  const isThreadUpdaterRunning = !!document.getElementById('htsu-style');

  // --------------------------------------------------------------------------
  // 1) Hide the site's built-in hover previews
  //    We only want our custom iq-preview-* popups to show.
  // --------------------------------------------------------------------------
  // GM_addStyle(`
    /* Any .qp element that does NOT have an id starting with "iq-preview-" will be hidden */
    /* div.qp:not([id^="iq-preview-"]) {
      display: none !important;
    }
  `);*/

  // --------------------------------------------------------------------------
  // 2) Prepare a <style> tag to hold our dynamic "You" highlighting rules
  //    We'll update its contents when the user picks a new border style.
  // --------------------------------------------------------------------------
  const youStyleEl = document.createElement('style');
  youStyleEl.id = 'you-custom-style';
  document.head.appendChild(youStyleEl);

  // Key under which we store the user's chosen border style in localStorage
  const STORAGE_KEY = 'youBorderStyle';
  const DEFAULT_STYLE = 'dashed';

  /**
   * Writes CSS into our <style> tag to highlight posts:
   *  - Blue left-border for your own replies (.you)
   *  - Red left-border for replies quoting you (.quoting-you)
   * @param {string} style - the CSS border-style (e.g., solid, dashed)
   */
  function updateYouBorder(style) {
    // always keep the border rules...
    let css = `
      /* Own posts: add blue border */
      div.post.reply.you:has(span.own_post) {
        border-left: 5px ${style} #00b8e6 !important;
      }

      /* Replies quoting you: add red border */
      div.post.reply.quoting-you {
        border-left: 5px ${style} #ff3d3d !important;
      }
    `;
    // only insert the “(You)” + hide-original-small rules if Thread Updater is NOT running
    if (!isThreadUpdaterRunning) {
      css += `
        /* Re-add "(You)" text after the quote link */
        div.post.reply.quoting-you a:has(+ small)::after {
          content: " (You)" !important;
        }

        /* Hide the original small "(You)" text, but not embeds */
        div.post.reply div.body a + small {
          display: none !important;
        }
      `;
    }

    youStyleEl.textContent = css;

    // Save the user's choice so it persists across reload
    try {
      localStorage.setItem(STORAGE_KEY, style);
    } catch (e) {
      // localStorage may not be available; ignore errors
    }
  }

  // --------------------------------------------------------------------------
  // 3) Create and insert a dropdown UI for the user to select their border style
  // --------------------------------------------------------------------------
  const container = document.createElement('div');
  container.style.cssText = 'float:right; margin-bottom:10px';
  container.innerHTML = `
    Border style:
    <select id="youBorderSelector">
      <option value="solid">solid</option>
      <option value="dashed">dashed</option>
      <option value="dotted">dotted</option>
      <option value="double">double</option>
      <option value="groove">groove</option>
      <option value="ridge">ridge</option>
    </select>
  `;

  // Insert our dropdown before the existing #style-select element (site's theme selector)
  const styleSelect = document.getElementById('style-select');
  if (styleSelect && styleSelect.parentNode) {
    styleSelect.parentNode.insertBefore(container, styleSelect);
  }

  // Initialize dropdown value from localStorage (or default)
  const dropdown = document.getElementById('youBorderSelector');
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved && dropdown.querySelector(`option[value="${saved}"]`) ? saved : DEFAULT_STYLE;
  dropdown.value = initial;
  updateYouBorder(initial);

  // Update the border style whenever the user picks a new option
  dropdown.addEventListener('change', e => updateYouBorder(e.target.value));

  // --------------------------------------------------------------------------
  // 4) JavaScript marking of posts with "you" and "quoting-you" classes
  //    .you           => posts authored by you
  //    .quoting-you   => replies that quote "(You)"
  // --------------------------------------------------------------------------
  /**
   * Scans the given root (default: whole document) and adds classes:
   *  - "you" to posts containing <span class="own_post">
   *  - "quoting-you" to posts containing a <small> with text "(You)"
   */
  function markYou(root = document.body) {
    // Mark own posts
    root.querySelectorAll('div.post.reply span.own_post')
      .forEach(el => el.closest('div.post.reply')?.classList.add('you'));

    // Mark replies quoting you
    root.querySelectorAll('div.post.reply .body small')
      .forEach(sm => {
        if (sm.textContent.trim() === '(You)') {
          sm.closest('div.post.reply')?.classList.add('quoting-you');
        }
      });
  }

  // Initial pass on page load
  markYou();
  // Observe for new or inlined replies to apply marking
  new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) markYou(n);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  // --------------------------------------------------------------------------
  // 5) Q-key Quick‑Reply toggle and auto-focus on citeReply links
  // --------------------------------------------------------------------------
  /**
   * Toggles the Quick‑Reply panel when the user presses 'q' (unless typing in a form).
   */
  function onKey(e) {
    if (e.key.toLowerCase() !== 'q' || e.ctrlKey || e.altKey || e.metaKey) return;

    // If the user is typing into an input or textarea, do nothing
    const active = document.activeElement;
    const nm = active?.getAttribute('name');
    if (active?.tagName === 'TEXTAREA' || (active?.tagName === 'INPUT' && ['name','email','subject','embed'].includes(nm))) {
      return;
    }

    const form = document.getElementById('quick-reply');
    if (form && form.style.display !== 'none') {
      // Close Quick‑Reply if it's open
      form.querySelector('.close-btn')?.click();
    } else {
      // Otherwise open it and focus the textarea
      document.querySelector('.quick-reply-btn')?.click();
      setTimeout(() => {
        document.querySelector('#quick-reply textarea[name="body"]')?.focus();
      }, 50);
    }
    e.preventDefault();
  }
  // Capture keydown at the documentElement level to override site handlers
  document.documentElement.addEventListener('keydown', onKey, true);

  // When clicking on a post_no link (citeReply), auto-focus the textarea
  document.body.addEventListener('click', e => {
    const link = e.target.closest('a.post_no');
    if (link && /^citeReply\(\d+\)$/.test(link.getAttribute('onclick') || '')) {
      setTimeout(() => {
        const ta = document.querySelector('#quick-reply textarea[name="body"]');
        if (ta) {
          ta.focus();
          ta.setSelectionRange(ta.value.length, ta.value.length);
        }
      }, 50);
    }
  });

})();