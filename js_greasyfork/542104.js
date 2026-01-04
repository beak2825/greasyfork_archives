// ==UserScript==
// @name         Lenso Debug UI + Anti-Blur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unblur lenso.ai text elements + custom buttons for assisting in reverse image searching. THIS DOES NOT "UNLOCK" ANY PAID FUNCTIONS (you still see payment popups in places)
// @author       nire5
// @author       chatgpt + copilot + stackoverflow
// @match        https://lenso.ai/en/results/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542104/Lenso%20Debug%20UI%20%2B%20Anti-Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/542104/Lenso%20Debug%20UI%20%2B%20Anti-Blur.meta.js
// ==/UserScript==

//COMPILE DATE: 5/29/2025
//API version: https://lenso.ai/api

(function () {
  'use strict';

  console.log('[Lenso UI] Script initialized successfully');
  console.log('[Anti-Blur] Script initialized successfully');

  //
  // ===== Anti-Blur Section =====
  //

  function removeBlurFromStylesheets() {
    let count = 0;

    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        // Can't access cross-origin stylesheets
        console.warn("[Anti-Blur] Cannot access stylesheet (possibly cross-origin):", sheet.href || "[inline style]");
        continue;
      }

      if (!rules) continue;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.type === CSSRule.STYLE_RULE && rule.style) {
          const moz = rule.style.getPropertyValue("-moz-filter");
          const std = rule.style.getPropertyValue("filter");

          if (moz === "blur(2px)") {
            rule.style.removeProperty("-moz-filter");
            console.log(`[Anti-Blur] Removed -moz-filter from rule: ${rule.selectorText}`);
            count++;
          }
          if (std === "blur(2px)") {
            rule.style.removeProperty("filter");
            console.log(`[Anti-Blur] Removed filter from rule: ${rule.selectorText}`);
            count++;
          }
        }
      }
    }

    console.log(`[Anti-Blur] Removed ${count} blur(2px) styles from stylesheets.`);
  }

  function removeBlurFromInlineStyles() {
    const elements = document.querySelectorAll('[style*="filter"]');
    let count = 0;

    elements.forEach(el => {
      const moz = el.style.getPropertyValue("-moz-filter");
      const std = el.style.getPropertyValue("filter");

      if (moz === "blur(2px)") {
        el.style.removeProperty("-moz-filter");
        console.log("[Anti-Blur] Removed -moz-filter from element:", el);
        count++;
      }
      if (std === "blur(2px)") {
        el.style.removeProperty("filter");
        console.log("[Anti-Blur] Removed filter from element:", el);
        count++;
      }
    });

    console.log(`[Anti-Blur] Removed ${count} blur(2px) inline styles.`);
  }

  function removeBlur() {
    console.log("[Anti-Blur] Running blur removal pass...");
    removeBlurFromStylesheets();
    removeBlurFromInlineStyles();
  }

  // Initial run
  removeBlur();

  // Watch for dynamic changes
  const blurObserver = new MutationObserver((mutations) => {
    console.log("[Anti-Blur] DOM mutation detected, re-checking...");
    removeBlur();
  });

  blurObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"]
  });

  console.log("[Anti-Blur] MutationObserver initialized.");

  //
  // ===== UI Buttons + Live Info Section =====
  //

  const infoSourceSelector = 'div.result div.text-section p.title'; // ← update if needed
  let infoObserver = null;

  function createHeaderUI(header) {
    if (!header) {
      console.warn('[Lenso UI] No header element provided to createHeaderUI');
      return;
    }

    const alreadyExists = header.querySelector('#custom-button-group');
    if (alreadyExists) {
      console.log('[Lenso UI] Custom UI already exists in header, skipping creation');
      return;
    }

    console.log('[Lenso UI] Creating custom UI elements');

    const container = document.createElement('div');
    container.id = 'custom-button-group';
    container.style.display = 'flex';
    container.style.gap = '12px';
    container.style.marginLeft = '20px';
    container.style.alignItems = 'center';

    console.log('[Lenso UI] UI container element created');

    // Info display
    const infoDisplay = document.createElement('div');
    infoDisplay.id = 'custom-info-display';
    infoDisplay.style.fontSize = '14px';
    infoDisplay.style.fontWeight = 'bold';
    infoDisplay.style.color = '#333';
    infoDisplay.textContent = '[Loading info…]';
    container.appendChild(infoDisplay);

    console.log('[Lenso UI] Info display element created and appended');

    // Lookup Button
    const lookupBtn = document.createElement('button');
    lookupBtn.textContent = 'Lookup Image on Google';
    styleButton(lookupBtn);
    lookupBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Lenso UI] Lookup Image button clicked');

      const domainEl = document.querySelector('.domain-name');
      const infoEl = document.querySelector(infoSourceSelector);

      if (!domainEl || !infoEl) {
        alert('Missing info or domain element');
        console.warn('[Lenso UI] Cannot find domain or info source');
        return;
      }

      const domain = domainEl.textContent.trim();
      const searchText = infoEl.textContent.trim();
      const query = `site:${domain} ${searchText}`;

      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

      console.log('[Lenso UI] Opening Google search:', url);
      window.open(url, '_blank');
    });
    container.appendChild(lookupBtn);

    // Open Button (open image URL in new tab)
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Image in New Tab';
    styleButton(openBtn);
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const imgEl = document.querySelector('.image-wrapper img');
      if (!imgEl || !imgEl.src) {
        alert('Image not found');
        return;
      }
      console.log('[Lenso UI] Opening image in new tab:', imgEl.src);
      window.open(imgEl.src, '_blank');
    });

      const mainContent = document.querySelector('.results-page-content');
      if (mainContent) {
          mainContent.style.marginTop = '60px'; // adjust to your header height
          console.log('[Lenso UI] Applied marginTop to .results-page-content to prevent overlap');
      }
    container.appendChild(openBtn);

    // Append to header
    header.insertBefore(container, header.firstChild);
    console.log('[Lenso UI] Custom UI elements appended to header successfully');

    // Update info and begin watching it
    waitForInfoSource(infoDisplay);
  }

  function styleButton(btn) {
    btn.style.padding = '6px 12px';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid #333';
    btn.style.borderRadius = '4px';
    btn.style.background = '#e8f0fe';
    btn.style.fontSize = '14px';
  }

  function updateInfoText(displayEl, sourceEl) {
    const newText = sourceEl.textContent?.trim() || sourceEl.getAttribute('src') || '[No content]';
    displayEl.textContent = newText;
    console.log('[Lenso UI] Info text updated with new content:', newText);
  }

  function observeInfoElement(sourceEl, displayEl) {
    if (infoObserver) {
      infoObserver.disconnect();
      console.log('[Lenso UI] Disconnecting previous info observer');
    }

    infoObserver = new MutationObserver(() => {
      updateInfoText(displayEl, sourceEl);
    });

    infoObserver.observe(sourceEl, {
      characterData: true,
      childList: true,
      subtree: true
    });

    console.log('[Lenso UI] MutationObserver attached to info source element');
  }

  function waitForInfoSource(displayEl) {
    const attemptUpdate = () => {
      const el = document.querySelector(infoSourceSelector);
      if (el) {
        updateInfoText(displayEl, el);
        observeInfoElement(el, displayEl);
        return true;
      } else {
        console.log('[Lenso UI] Info source element not found, retrying');
        return false;
      }
    };

    if (!attemptUpdate()) {
      const tempObserver = new MutationObserver(() => {
        if (attemptUpdate()) {
          console.log('[Lenso UI] Info source appeared, disconnecting temp observer');
          tempObserver.disconnect();
        }
      });
      tempObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  function tryInsert() {
    console.log('[Lenso UI] Searching for header element...');
    const header = document.querySelector('div#app header.main-header');
    if (header) {
      console.log('[Lenso UI] Header found:', header);
      createHeaderUI(header);
      return true;
    } else {
      console.log('[Lenso UI] Header not found');
      return false;
    }
  }

  if (!tryInsert()) {
    console.log('[Lenso UI] Header not immediately available, setting up MutationObserver...');
    const observer = new MutationObserver(() => {
      if (tryInsert()) {
        console.log('[Lenso UI] Header loaded, disconnecting observer');
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
