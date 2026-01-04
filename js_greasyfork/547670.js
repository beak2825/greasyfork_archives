// ==UserScript==
// @name         BBDF (Bring Back Developer Frameworks)
// @namespace    https://spin.rip/
// @match        https://replit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=replit.com
// @grant        none
// @version      1.4
// @author       Spinfal
// @description  Adds a button on the Replit side bar that lets you open the Developer Frameworks page, instead of being restricted to the Agent input
// @license      GPL-3.0-or-later
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547670/BBDF%20%28Bring%20Back%20Developer%20Frameworks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547670/BBDF%20%28Bring%20Back%20Developer%20Frameworks%29.meta.js
// ==/UserScript==

(function () {
  const BTN_ID = 'bbdf-developer-frameworks-btn';

  function addButtonIfMissing() {
    const templateBtn = document.querySelector('[data-cy="sidebar-new-repl-btn"]');
    if (!templateBtn) return;

    const container = templateBtn.parentElement || templateBtn.closest('div');
    if (!container || container.querySelector('#' + BTN_ID)) return;

    const el = document.createElement(templateBtn.tagName.toLowerCase());
    el.id = BTN_ID;
    el.setAttribute('data-cy', 'bbdf-developer-frameworks-btn');
    el.className = templateBtn.className;

    const role = templateBtn.getAttribute('role');
    if (role) el.setAttribute('role', role);

    for (const { name, value } of Array.from(templateBtn.attributes)) {
      if (name.startsWith('aria-') && name !== 'aria-label') el.setAttribute(name, value);
    }
    el.setAttribute('aria-label', 'Developer Frameworks');

    // custom svg preserved
    el.innerHTML = `
      <div class="${templateBtn.querySelector('div')?.className || ''}" style="--useView--gap:8px;--useView--justify:center;--useView--align:center;--useView--grow:1;--useView--shrink:1;">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="width:16px;height:16px;">
          <rect x="2" y="2" width="20" height="20" rx="4" ry="4" fill="currentColor" opacity="0.12"></rect>
          <text x="12" y="16" text-anchor="middle" font-size="11" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="700" fill="currentColor">&lt;3</text>
        </svg>
        <span class="${templateBtn.querySelector('span')?.className || ''}" style="--Text--font-size:var(--font-size-default);--Text--font-family:inherit;">
          <span class="${templateBtn.querySelector('span span')?.className || ''}" style="--Text--font-family:inherit;--Text--font-size:var(--font-size-default);--Text--line-height:var(--line-height-default);">Developer Frameworks</span>
        </span>
      </div>
    `;

    const targetUrl = new URL('/developer-frameworks', location.origin).toString();
    if (el.tagName.toLowerCase() === 'a') {
      el.setAttribute('href', targetUrl);
    } else {
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        safeNavigate(targetUrl);
      });
    }

    container.appendChild(el);
  }

  function safeNavigate(url) {
    try {
      history.pushState({}, '', url);
      window.dispatchEvent(new Event('bbdf:navigation'));
    } catch {
      location.href = url;
    }
  }

  function hookHistory() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    if (!history._bbdfHooked) {
      history.pushState = function () {
        const ret = origPush.apply(this, arguments);
        window.dispatchEvent(new Event('bbdf:navigation'));
        return ret;
      };
      history.replaceState = function () {
        const ret = origReplace.apply(this, arguments);
        window.dispatchEvent(new Event('bbdf:navigation'));
        return ret;
      };
      history._bbdfHooked = true;
    }
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('bbdf:navigation')));
  }

  function startObserver() {
    const obs = new MutationObserver(addButtonIfMissing);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.__BBDF_OBSERVER__ = obs;
  }

  function init() {
    hookHistory();
    startObserver();
    addButtonIfMissing();
    window.addEventListener('bbdf:navigation', addButtonIfMissing);
    let tries = 0;
    const iv = setInterval(() => {
      addButtonIfMissing();
      if (++tries > 20) clearInterval(iv);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();