// ==UserScript==
// @name         Prevent highlighting on photos
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Prevent highlighting on manga sites like WeebCentral
// @author       You
// @match        https://weebcentral.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=create.t3.gg
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/545139/Prevent%20highlighting%20on%20photos.user.js
// @updateURL https://update.greasyfork.org/scripts/545139/Prevent%20highlighting%20on%20photos.meta.js
// ==/UserScript==

(() => {
  let enabled = true;

  const STYLE_ID = "tm-no-select-style";

  // CSS that blocks selection everywhere except form/editable elements
  const css = `
    html, body, * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea, select, [contenteditable=""], [contenteditable="true"] {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
  `;

  const eventsToBlock = [
    "selectstart", // text selection start
    "dragstart", // double-click + drag
    "mousedown", // some sites use this to trigger selection
    "pointerdown", // pointer-based selection
    "dblclick", // double-click selection
  ];

  // Add a style element to a (shadow) root
  function injectStyleInto(root) {
    if (!root || !root.ownerDocument) return;
    const doc = root.ownerDocument;
    // Avoid duplicates per root
    const existing = [
      ...(root.querySelectorAll ? root.querySelectorAll(`#${STYLE_ID}`) : []),
    ].length;
    if (existing) return;

    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    (root.head || root).appendChild(style);
  }

  // Attach event blockers at the root level
  function attachEventBlockers(target) {
    eventsToBlock.forEach((evt) => {
      target.addEventListener(evt, onBlocker, {
        capture: true,
        passive: false,
      });
    });
  }

  // Permit selection inside form/editable controls
  function isEditable(el) {
    if (!el) return false;
    if (el.closest("input, textarea, select")) return true;
    const ce = el.closest("[contenteditable]");
    return (
      ce &&
      (ce.getAttribute("contenteditable") === "" ||
        ce.getAttribute("contenteditable") === "true")
    );
  }

  function onBlocker(e) {
    if (!enabled) return;
    if (isEditable(e.target)) return;
    e.stopPropagation();
    e.preventDefault();
  }

  // Process the main document and any existing shadow roots
  function processDocument(doc = document) {
    injectStyleInto(doc);
    attachEventBlockers(doc);

    // Walk the tree to find shadow roots already attached
    const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.shadowRoot) {
        processShadowRoot(node.shadowRoot);
      }
    }
  }

  // Handle a shadow root
  function processShadowRoot(sr) {
    injectStyleInto(sr);
    attachEventBlockers(sr);
  }

  // Intercept future shadow roots
  const origAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const sr = origAttachShadow.call(this, init);
    // Process after creation
    queueMicrotask(() => processShadowRoot(sr));
    return sr;
  };

  // Observe added elements to catch closed-over cases where styles might be removed
  const mo = new MutationObserver((muts) => {
    if (!enabled) return;
    for (const m of muts) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => {
          // Re-inject style into document if removed
          if (n.nodeType === 1) {
            const el = /** @type {Element} */ (n);
            // If a <style> got removed elsewhere, ensure one exists
            if (!document.getElementById(STYLE_ID)) injectStyleInto(document);
            // Shadow roots on newly added custom elements (if any) get handled by attachShadow hook
          }
        });
      }
    }
  });

  function enable() {
    enabled = true;
    injectStyleInto(document);
    attachEventBlockers(document);
  }

  function disable() {
    enabled = false;
  }

  // Keyboard toggle: Ctrl + Alt + U
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey && e.altKey && (e.key === "u" || e.key === "U")) {
        enabled ? disable() : enable();
        // Optional toast
        try {
          const msg = `No-select: ${enabled ? "ON" : "OFF"}`;
          console.log(msg);
        } catch {}
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { capture: true }
  );

  // Initialize
  if (document.readyState === "loading") {
    // document-start, but DOM not ready yet
    processDocument(document);
  } else {
    processDocument(document);
  }
  mo.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
  });
})();
