// ==UserScript==
// File: virtual-textarea.user.js
// ==UserScript==
// @name         Virtual Textarea (Virtualized)
// @namespace    https://github.com/yourname/virtual-textarea
// @version      1.2
// @description  Replace textareas with a virtualized editable view that renders only visible portions to avoid lag on very large content.
// @author       YourName
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts
// @supportURL   https://greasyfork.org/en/scripts
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/547578/Virtual%20Textarea%20%28Virtualized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547578/Virtual%20Textarea%20%28Virtualized%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configuration
  const CHUNK_CHARS = 4096; // chunk size in characters (tweakable)
  const BUFFER_CHUNKS = 1;  // number of extra chunks to render above/below visible for smoother scrolling
  const REPLACE_ATTR = 'data-virt-textarea'; // mark replaced textareas
  const MAX_MEASURE_ATTEMPTS = 3;

  // Utility: get computed CSS subset we need
  function pickStyles(style, keys) {
    const o = {};
    for (const k of keys) o[k] = style.getPropertyValue(k);
    return o;
  }

  // Utility: apply picked styles to element
  function applyStyles(el, styles) {
    for (const k in styles) {
      el.style.setProperty(k, styles[k]);
    }
  }

  // Compute caret (character) offset inside root element (text-only)
  function getCaretOffset(root) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0).cloneRange();
    const pre = document.createRange();
    pre.selectNodeContents(root);
    try {
      pre.setEnd(range.startContainer, range.startOffset);
    } catch (err) {
      // fallback
      return 0;
    }
    return pre.toString().length;
  }

  // Set caret at a char offset within root (root must contain a single text node)
  function setCaretAt(root, offset) {
    root.normalize();
    const textNode = root.firstChild;
    if (!textNode) {
      root.textContent = '';
    }
    const node = root.firstChild;
    const pos = Math.max(0, Math.min(node.length, offset));
    const range = document.createRange();
    range.setStart(node, pos);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Simple string diff: find common prefix / suffix, return section replaced
  function diffStrings(oldStr, newStr) {
    const minLen = Math.min(oldStr.length, newStr.length);
    let prefix = 0;
    while (prefix < minLen && oldStr[prefix] === newStr[prefix]) prefix++;
    let suffixOld = oldStr.length - 1;
    let suffixNew = newStr.length - 1;
    while (
      suffixOld >= prefix &&
      suffixNew >= prefix &&
      oldStr[suffixOld] === newStr[suffixNew]
    ) {
      suffixOld--;
      suffixNew--;
    }
    const commonSuffixLen = oldStr.length - 1 - suffixOld;
    const replacedOldLen = oldStr.length - prefix - commonSuffixLen;
    const newMiddle = newStr.slice(prefix, newStr.length - commonSuffixLen);
    return { prefix, replacedOldLen, newMiddle };
  }

  // Measure chunk height for given width & styles by rendering a sample chunk into a hidden element
  function measureChunkHeight(sampleText, widthPx, cssStyles) {
    const measure = document.createElement('div');
    document.body.appendChild(measure);
    measure.style.position = 'absolute';
    measure.style.left = '-99999px';
    measure.style.top = '0';
    measure.style.visibility = 'hidden';
    measure.style.whiteSpace = 'pre-wrap';
    measure.style.wordBreak = 'break-word';
    measure.style.boxSizing = 'border-box';
    measure.style.width = widthPx + 'px';
    applyStyles(measure, cssStyles);
    // pick sample
    measure.textContent = sampleText || 'M';
    const h = measure.scrollHeight || measure.clientHeight || 16;
    document.body.removeChild(measure);
    return Math.max(1, h);
  }

  // Create virtualized editor for a textarea
  function virtualize(textarea) {
    if (!textarea || textarea.getAttribute(REPLACE_ATTR) === '1') return;
    textarea.setAttribute(REPLACE_ATTR, '1');

    // Keep original styles we care about
    const computed = window.getComputedStyle(textarea);
    const styleKeys = [
      'font-family', 'font-size', 'font-weight', 'line-height',
      'letter-spacing', 'white-space', 'padding-top', 'padding-right',
      'padding-bottom', 'padding-left', 'box-sizing', 'border-top-width',
      'border-right-width', 'border-bottom-width', 'border-left-width',
      'border-style', 'border-color', 'background-color', 'color',
      'overflow', 'resize'
    ];
    const picked = pickStyles(computed, styleKeys);

    // Create container
    const container = document.createElement('div');
    container.className = 'vt-container';
    container.style.position = 'relative';
    // copy width/height from textarea
    container.style.width = textarea.offsetWidth + 'px';
    container.style.height = textarea.offsetHeight + 'px';
    container.style.overflow = 'auto';
    container.style.background = picked['background-color'] || computed.backgroundColor || '#fff';
    container.style.color = picked.color || computed.color || '#000';
    container.style.boxSizing = picked['box-sizing'] || 'border-box';
    container.style.border = `${picked['border-top-width'] || '1px'} ${picked['border-style'] || 'solid'} ${picked['border-color'] || '#ccc'}`;
    container.style.padding = '0';
    // allow the same resize behavior (if any)
    container.style.resize = picked.resize || 'none';

    // Spacer controls the scroll height (simulate full content height)
    const spacer = document.createElement('div');
    spacer.style.width = '1px';
    spacer.style.height = '1px';

    // The area we render into (single text node)
    const renderArea = document.createElement('div');
    renderArea.setAttribute('contenteditable', 'true');
    renderArea.className = 'vt-render';
    // vital styles so it closely resembles a textarea
    renderArea.style.whiteSpace = 'pre-wrap';
    renderArea.style.wordBreak = 'break-word';
    renderArea.style.position = 'absolute';
    renderArea.style.left = '0';
    renderArea.style.top = '0';
    renderArea.style.right = '0';
    renderArea.style.outline = 'none';
    renderArea.style.minHeight = '1px';
    renderArea.style.padding = computed.getPropertyValue('padding-top') + ' ' + computed.getPropertyValue('padding-right') + ' ' + computed.getPropertyValue('padding-bottom') + ' ' + computed.getPropertyValue('padding-left');
    // apply font-related styles
    applyStyles(renderArea, pickStyles(computed, ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing']));

    // Hide the original textarea but keep it for forms/submission
    textarea.style.display = 'none';
    textarea.parentNode.insertBefore(container, textarea);
    container.appendChild(spacer);
    container.appendChild(renderArea);

    // State
    let fullText = textarea.value || '';
    let chunkChars = CHUNK_CHARS;
    let chunkHeight = 20; // fallback, will measure
    let totalChunks = Math.max(1, Math.ceil(fullText.length / chunkChars));
    let prevRenderStartIndex = 0;
    let prevVisibleText = '';
    let rafScheduled = false;

    // measure chunk height (attempt to use real text sample)
    function recomputeChunkHeight(attempt = 0) {
      const widthPx = Math.max(20, container.clientWidth - 2);
      const sample = fullText.slice(0, chunkChars) || 'M'.repeat(Math.min(10, chunkChars));
      try {
        const measured = measureChunkHeight(sample, widthPx, pickStyles(computed, ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'padding-top', 'padding-bottom']));
        chunkHeight = Math.max(8, measured); // avoid zero
      } catch (err) {
        if (attempt < MAX_MEASURE_ATTEMPTS) {
          recomputeChunkHeight(attempt + 1);
        }
      }
      totalChunks = Math.max(1, Math.ceil(fullText.length / chunkChars));
      spacer.style.height = (totalChunks * chunkHeight) + 'px';
    }

    recomputeChunkHeight();

    // Render visible slice
    function scheduleRender() {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        renderVisible();
      });
    }

    function renderVisible() {
      const scrollTop = container.scrollTop;
      const visibleChunkCount = Math.max(1, Math.ceil(container.clientHeight / chunkHeight));
      const startChunk = Math.max(0, Math.floor(scrollTop / chunkHeight) - BUFFER_CHUNKS);
      const endChunk = Math.min(totalChunks, startChunk + visibleChunkCount + BUFFER_CHUNKS * 2);
      const startIndex = startChunk * chunkChars;
      const endIndex = Math.min(fullText.length, endChunk * chunkChars);
      const visible = fullText.slice(startIndex, endIndex);

      // Avoid unnecessary DOM updates
      if (visible === prevVisibleText && startIndex === prevRenderStartIndex) {
        // but make sure renderArea top is correct
        renderArea.style.top = (startChunk * chunkHeight) + 'px';
        return;
      }

      // Ensure single text node: set textContent (keeps raw text, no html)
      renderArea.textContent = visible;
      renderArea.style.top = (startChunk * chunkHeight) + 'px';
      prevVisibleText = visible;
      prevRenderStartIndex = startIndex;
    }

    // Map selection + updates
    function handleInputEvent(e) {
      // capture selection offsets inside visible text (after change)
      const selOffset = getCaretOffset(renderArea);
      const newVisible = renderArea.textContent;
      const oldVisible = prevVisibleText;

      // If identical, nothing to do
      if (newVisible === oldVisible) {
        // keep textarea in sync
        textarea.value = fullText;
        return;
      }

      // compute diff between oldVisible and newVisible
      const d = diffStrings(oldVisible, newVisible);
      const insertAt = prevRenderStartIndex + d.prefix;
      // Replace in fullText
      fullText = fullText.slice(0, insertAt) + d.newMiddle + fullText.slice(insertAt + d.replacedOldLen);

      // Update hidden textarea
      textarea.value = fullText;

      // Update measurements and spacer
      totalChunks = Math.max(1, Math.ceil(fullText.length / chunkChars));
      spacer.style.height = (totalChunks * chunkHeight) + 'px';

      // After applying change, compute absolute caret position and re-render so we can restore selection
      const absCaret = Math.max(0, Math.min(fullText.length, insertAt + d.newMiddle.length - (oldVisible.length - d.prefix - d.replacedOldLen - (newVisible.length - d.prefix - (d.newMiddle.length)) > 0 ? 0 : 0)));
      // Simpler and safe: user selection is after change, so
      const selectionAbsolute = prevRenderStartIndex + selOffset;
      // choose final absolute caret position (fall back to end if weird)
      const finalAbs = Math.max(0, Math.min(fullText.length, selectionAbsolute));

      // Ensure chunkHeight is still reasonable (container width may have changed)
      recomputeChunkHeight();

      // Decide which startIndex to render so finalAbs is visible
      let startIndexToRender = prevRenderStartIndex; // default
      const approxChunk = Math.floor(finalAbs / chunkChars);
      // center caret chunk in view if needed
      const visibleChunkCount = Math.max(1, Math.ceil(container.clientHeight / chunkHeight));
      const desiredStartChunk = Math.max(0, Math.min(totalChunks - visibleChunkCount, approxChunk - Math.floor(visibleChunkCount / 2)));
      startIndexToRender = desiredStartChunk * chunkChars;
      // set container.scrollTop to that start
      container.scrollTop = desiredStartChunk * chunkHeight;

      // render
      renderVisible();

      // restore caret relative to new render start
      const relative = finalAbs - prevRenderStartIndex;
      const clamped = Math.max(0, Math.min(prevVisibleText.length, relative));
      setCaretAt(renderArea, clamped);

      // keep textarea.value in sync (for forms)
      textarea.value = fullText;
    }

    // On paste inside the renderArea: let input handle it, but capture paste to prevent weird DOM nodes
    renderArea.addEventListener('paste', (ev) => {
      ev.stopPropagation();
      // Handle clipboard text insertion manually to ensure plain text
      ev.preventDefault();
      const clip = (ev.clipboardData || window.clipboardData).getData('text') || '';
      const selOff = getCaretOffset(renderArea);
      const oldVisible = prevVisibleText;
      // Insert clip at selOff inside visible
      const newVisible = oldVisible.slice(0, selOff) + clip + oldVisible.slice(selOff);
      renderArea.textContent = newVisible;
      // trigger input-like handler
      handleInputEvent();
      // schedule re-render
      scheduleRender();
    });

    // Input event (typing, delete)
    renderArea.addEventListener('input', (ev) => {
      handleInputEvent(ev);
    });

    // Scroll handling
    container.addEventListener('scroll', () => {
      scheduleRender();
    }, { passive: true });

    // Selection change: if caret goes outside viewport, scroll to show it
    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      // only care when selection is inside our renderArea
      if (!renderArea.contains(range.startContainer)) return;
      const rect = range.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      if (rect.top < cRect.top || rect.bottom > cRect.bottom) {
        // compute desired scroll to center caret
        const caretMid = rect.top + rect.height / 2;
        const delta = caretMid - (cRect.top + cRect.height / 2);
        container.scrollTop += delta;
        scheduleRender();
      }
    });

    // Keep original textarea value on form submit
    let parentForm = textarea.form;
    if (parentForm) {
      parentForm.addEventListener('submit', () => {
        textarea.value = fullText;
      }, true);
    }

    // ResizeObserver: recompute measurement on container resize
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        recomputeChunkHeight();
        scheduleRender();
      });
      ro.observe(container);
      // keep a reference so it isn't GC'd (closure holds it)
    }

    // Keep hidden textarea updated initially
    textarea.value = fullText;

    // Initial render: place caret at end if original had focus
    renderVisible();
    if (textarea === document.activeElement || textarea.getAttribute('autofocus') != null) {
      // focus our renderArea
      renderArea.focus();
      setCaretAt(renderArea, renderArea.textContent.length);
    }

    // Observe changes to the original textarea.value (external JS may set it)
    const mo = new MutationObserver(() => {
      // if original value changed externally, sync
      if (textarea.value !== fullText) {
        fullText = textarea.value || '';
        totalChunks = Math.max(1, Math.ceil(fullText.length / chunkChars));
        spacer.style.height = (totalChunks * chunkHeight) + 'px';
        recomputeChunkHeight();
        scheduleRender();
      }
    });
    try {
      mo.observe(textarea, { attributes: true, attributeFilter: ['value'], childList: true });
    } catch (err) {
      // ignore; attribute mutation observers sometimes problematic on some pages
    }
  }

  // Initialize: virtualize every current textarea
  function init() {
    const tds = Array.from(document.querySelectorAll('textarea'));
    for (const ta of tds) {
      try {
        virtualize(ta);
      } catch (err) {
        console.error('Virtual Textarea: failed to virtualize', err);
      }
    }
  }

  // Observe DOM for newly added textareas
  const domObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (!(n instanceof HTMLElement)) continue;
        if (n.tagName === 'TEXTAREA') virtualize(n);
        // also scan descendants
        const nested = n.querySelectorAll ? n.querySelectorAll('textarea') : [];
        nested.forEach((el) => virtualize(el));
      }
    }
  });

  // Kick off
  init();
  domObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // Expose for debugging (optional)
  try {
    window.__VirtualTextarea = { virtualize, init };
  } catch (e) {}

})();