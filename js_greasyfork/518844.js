// ==UserScript==
// @name         Perplexity.ai Chat Exporter
// @namespace    https://github.com/ckep1/pplxport
// @version      2.3.1
// @description  Export Perplexity.ai conversations as markdown with configurable citation styles
// @author       Chris Kephart
// @match        https://www.perplexity.ai/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518844/Perplexityai%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/518844/Perplexityai%20Chat%20Exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================================================
  // CONFIGURATION & CONSTANTS
  // ============================================================================

  const DEBUG = false;
  const console = DEBUG ? window.console : { log() {}, warn() {}, error() {} };

  // Style options
  const CITATION_STYLES = {
    ENDNOTES: "endnotes",
    FOOTNOTES: "footnotes",
    INLINE: "inline",
    PARENTHESIZED: "parenthesized",
    NAMED: "named",
    NONE: "none",
  };

  const CITATION_STYLE_LABELS = {
    [CITATION_STYLES.ENDNOTES]: "Endnotes",
    [CITATION_STYLES.FOOTNOTES]: "Footnotes",
    [CITATION_STYLES.INLINE]: "Inline",
    [CITATION_STYLES.PARENTHESIZED]: "Parenthesized",
    [CITATION_STYLES.NAMED]: "Named",
    [CITATION_STYLES.NONE]: "No Citations",
  };

  const CITATION_STYLE_DESCRIPTIONS = {
    [CITATION_STYLES.ENDNOTES]: "[1] in text with sources listed at the end",
    [CITATION_STYLES.FOOTNOTES]: "[^1] in text with footnote definitions at the end",
    [CITATION_STYLES.INLINE]: "[1](url) - Clean inline citations",
    [CITATION_STYLES.PARENTHESIZED]: "([1](url)) - Inline citations in parentheses",
    [CITATION_STYLES.NAMED]: "[wikipedia](url) - Uses domain names",
    [CITATION_STYLES.NONE]: "Remove all citations from the text",
  };

  const FORMAT_STYLES = {
    FULL: "full", // Include User/Assistant tags and all dividers
    CONCISE: "concise", // Just content, minimal dividers
  };

  const FORMAT_STYLE_LABELS = {
    [FORMAT_STYLES.FULL]: "Full",
    [FORMAT_STYLES.CONCISE]: "Concise",
  };

  const EXPORT_METHODS = {
    DOWNLOAD: "download",
    CLIPBOARD: "clipboard",
  };

  const EXPORT_METHOD_LABELS = {
    [EXPORT_METHODS.DOWNLOAD]: "Download File",
    [EXPORT_METHODS.CLIPBOARD]: "Copy to Clipboard",
  };


  // Global citation tracking for consistent numbering across all responses
  const globalCitations = {
    urlToNumber: new Map(), // normalized URL -> citation number
    citationRefs: new Map(), // citation number -> {href, sourceName, normalizedUrl}
    nextCitationNumber: 1,

    reset() {
      this.urlToNumber.clear();
      this.citationRefs.clear();
      this.nextCitationNumber = 1;
    },

    addCitation(url, sourceName = null) {
      const normalizedUrl = normalizeUrl(url);
      if (!this.urlToNumber.has(normalizedUrl)) {
        this.urlToNumber.set(normalizedUrl, this.nextCitationNumber);
        this.citationRefs.set(this.nextCitationNumber, {
          href: url,
          sourceName,
          normalizedUrl,
        });
        this.nextCitationNumber++;
      }
      return this.urlToNumber.get(normalizedUrl);
    },

    getCitationNumber(url) {
      const normalizedUrl = normalizeUrl(url);
      return this.urlToNumber.get(normalizedUrl);
    },
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Get user preferences
  function getPreferences() {
    return {
      citationStyle: GM_getValue("citationStyle", CITATION_STYLES.PARENTHESIZED),
      formatStyle: GM_getValue("formatStyle", FORMAT_STYLES.FULL),
      addExtraNewlines: GM_getValue("addExtraNewlines", false),
      exportMethod: GM_getValue("exportMethod", EXPORT_METHODS.DOWNLOAD),
      includeFrontmatter: GM_getValue("includeFrontmatter", true),
      titleAsH1: GM_getValue("titleAsH1", false),
    };
  }

  // Extract source name from text, handling various formats
  function extractSourceName(text) {
    if (!text) return null;

    // Clean the text
    text = text.trim();

    // If it's a pattern like "rabbit+2", "reddit+1", extract the source name
    const plusMatch = text.match(/^([a-zA-Z]+)\+\d+$/);
    if (plusMatch) {
      return plusMatch[1];
    }

    // If it's just text without numbers, use it as is (but clean it up)
    const cleanName = text.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
    if (cleanName && cleanName.length > 0) {
      return cleanName;
    }

    return null;
  }

  // Normalize URL by removing fragments (#) to group same page citations
  function normalizeUrl(url) {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      // Remove the fragment (hash) portion
      urlObj.hash = "";
      return urlObj.toString();
    } catch (e) {
      // If URL parsing fails, just remove # manually
      return url.split("#")[0];
    }
  }

  // Extract domain name from URL for named citations
  function extractDomainName(url) {
    if (!url) return null;

    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname.toLowerCase();

      // Remove www. prefix
      domain = domain.replace(/^www\./, "");

      // Get the main domain part (before first dot for common cases)
      const parts = domain.split(".");
      if (parts.length >= 2) {
        // Handle special cases like co.uk, github.io, etc.
        if (parts[parts.length - 2].length <= 3 && parts.length > 2) {
          return parts[parts.length - 3];
        } else {
          return parts[parts.length - 2];
        }
      }

      return parts[0];
    } catch (e) {
      return null;
    }
  }

  // ============================================================================
  // DOM HELPER FUNCTIONS
  // ============================================================================

  function getThreadContainer() {
    return document.querySelector('.max-w-threadContentWidth, [class*="threadContentWidth"]') || document.querySelector("main") || document.body;
  }

  function getScrollRoot() {
    const thread = getThreadContainer();
    const candidates = [];
    let node = thread;
    while (node && node !== document.body) {
      candidates.push(node);
      node = node.parentElement;
    }
    const scrollingElement = document.scrollingElement || document.documentElement;
    candidates.push(scrollingElement);

    let best = null;
    for (const el of candidates) {
      try {
        const style = getComputedStyle(el);
        const overflowY = (style.overflowY || style.overflow || "").toLowerCase();
        const canScroll = el.scrollHeight - el.clientHeight > 50;
        const isScrollable = /auto|scroll|overlay/.test(overflowY) || el === scrollingElement;
        if (canScroll && isScrollable) {
          if (!best || el.scrollHeight > best.scrollHeight) {
            best = el;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return best || scrollingElement;
  }

  function isInViewport(el, margin = 8) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return rect.bottom > -margin && rect.top < vh + margin && rect.right > -margin && rect.left < vw + margin;
  }

  function isCodeCopyButton(btn) {
    const testId = btn.getAttribute("data-testid");
    const ariaLower = (btn.getAttribute("aria-label") || "").toLowerCase();
    if (testId === "copy-code-button" || testId === "copy-code" || (testId && testId.includes("copy-code"))) return true;
    if (ariaLower.includes("copy code")) return true;
    if (btn.closest("pre") || btn.closest("code")) return true;
    return false;
  }

  function findUserMessageRootFromElement(el) {
    let node = el;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      if (node.querySelector && (node.querySelector("button[data-testid='copy-query-button']") || node.querySelector("button[aria-label='Copy Query']") || node.querySelector("span[data-lexical-text='true']"))) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return el.parentElement || el;
  }

  function findUserMessageRootFrom(button) {
    let node = button;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      // A user message root should contain lexical text from the input/query
      if (node.querySelector && (node.querySelector(".whitespace-pre-line.text-pretty.break-words") || node.querySelector("span[data-lexical-text='true']"))) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return button.parentElement || button;
  }

  function findAssistantMessageRootFrom(button) {
    let node = button;
    let depth = 0;
    while (node && node !== document.body && depth < 10) {
      // An assistant message root should contain the prose answer block
      if (node.querySelector && node.querySelector(".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert'], [data-testid='answer'], [data-testid='assistant']")) {
        return node;
      }
      node = node.parentElement;
      depth++;
    }
    return button.parentElement || button;
  }

  // ============================================================================
  // SCROLL & NAVIGATION HELPERS
  // ============================================================================

  async function pageDownOnce(scroller, delayMs = 90, factor = 0.9) {
    if (!scroller) scroller = getScrollRoot();
    const delta = Math.max(200, Math.floor(scroller.clientHeight * factor));
    scroller.scrollTop = Math.min(scroller.scrollTop + delta, scroller.scrollHeight);
    await new Promise((r) => setTimeout(r, delayMs));
  }

  async function preloadPageFully() {
    try {
      const scroller = getScrollRoot();
      window.focus();
      scroller.scrollTop = 0;
      await new Promise((resolve) => setTimeout(resolve, 80));

      let lastHeight = scroller.scrollHeight;
      let stableCount = 0;
      const maxTries = 25; // shorter preload with faster intervals

      for (let i = 0; i < maxTries && stableCount < 2; i++) {
        scroller.scrollTop = scroller.scrollHeight;
        await new Promise((resolve) => setTimeout(resolve, 120));
        const newHeight = scroller.scrollHeight;
        if (newHeight > lastHeight + 10) {
          lastHeight = newHeight;
          stableCount = 0;
        } else {
          stableCount++;
        }
      }
      // Return to top so processing starts from the beginning
      scroller.scrollTop = 0;
      await new Promise((resolve) => setTimeout(resolve, 120));
    } catch (e) {
      // Non-fatal; we'll just proceed
      console.warn("Preload scroll encountered an issue:", e);
    }
  }

  function simulateHover(element) {
    try {
      const rect = element.getBoundingClientRect();
      const x = rect.left + Math.min(20, Math.max(2, rect.width / 3));
      const y = rect.top + Math.min(20, Math.max(2, rect.height / 3));
      const opts = { bubbles: true, clientX: x, clientY: y };
      element.dispatchEvent(new MouseEvent("mouseenter", opts));
      element.dispatchEvent(new MouseEvent("mouseover", opts));
      element.dispatchEvent(new MouseEvent("mousemove", opts));
    } catch (e) {
      // best effort
    }
  }

  async function waitForFocus(timeoutMs = 30000) {
    if (document.hasFocus()) return true;

    const startTime = Date.now();
    const overlay = document.getElementById('perplexity-focus-overlay');
    if (overlay) overlay.style.display = 'flex';

    while (!document.hasFocus() && (Date.now() - startTime) < timeoutMs) {
      window.focus();
      await new Promise(r => setTimeout(r, 100));
    }

    if (overlay) overlay.style.display = 'none';
    return document.hasFocus();
  }

  async function readClipboardWithRetries(maxRetries = 3, delayMs = 60) {
    let last = "";
    for (let i = 0; i < maxRetries; i++) {
      // Wait for focus before attempting clipboard read
      if (!document.hasFocus()) {
        const gotFocus = await waitForFocus(10000);
        if (!gotFocus) {
          console.warn('Lost focus during clipboard read, retrying...');
        }
      }

      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim() && text !== last) {
          return text;
        }
        last = text;
      } catch (e) {
        // keep retrying
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  }

  // Click expanders like "Show more", "Read more", etc. Best-effort
  const clickedExpanders = new WeakSet();

  function findExpanders(limit = 8) {
    const candidates = [];
    const patterns = /(show more|read more|view more|see more|expand|load more|view full|show all|continue reading)/i;
    const els = document.querySelectorAll('button, a, [role="button"]');
    for (const el of els) {
      if (candidates.length >= limit) break;
      if (clickedExpanders.has(el)) continue;
      const label = (el.getAttribute("aria-label") || "").trim();
      const text = (el.textContent || "").trim();
      if (patterns.test(label) || patterns.test(text)) {
        // avoid code-block related buttons
        if (el.closest("pre, code")) continue;
        // avoid external anchors that might navigate
        if (el.tagName && el.tagName.toLowerCase() === "a") {
          const href = (el.getAttribute("href") || "").trim();
          const target = (el.getAttribute("target") || "").trim().toLowerCase();
          const isExternal = /^https?:\/\//i.test(href);
          if (isExternal || target === "_blank") continue;
        }
        candidates.push(el);
      }
    }
    return candidates;
  }

  async function clickExpandersOnce(limit = 6) {
    const expanders = findExpanders(limit);
    if (expanders.length === 0) return false;
    for (const el of expanders) {
      try {
        clickedExpanders.add(el);
        el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        await new Promise((r) => setTimeout(r, 50));
        el.click();
        await new Promise((r) => setTimeout(r, 150));
      } catch {}
    }
    // allow expanded content to render
    await new Promise((r) => setTimeout(r, 250));
    return true;
  }

  // ============================================================================
  // BUTTON HELPER FUNCTIONS
  // ============================================================================

  function getViewportQueryButtons() {
    const buttons = Array.from(document.querySelectorAll('button[data-testid="copy-query-button"], button[aria-label="Copy Query"]'));
    return buttons.filter((btn) => isInViewport(btn) && !btn.closest("pre,code"));
  }

  function getViewportResponseButtons() {
    // Just check for any SVG element, or multiple possible SVG classes
    const buttons = Array.from(document.querySelectorAll('button[aria-label="Copy"]')).filter((btn) => {
      return btn.querySelector("svg.tabler-icon") || btn.querySelector("svg.tabler-icon-copy") || btn.querySelector("svg");
    });
    return buttons.filter((btn) => isInViewport(btn) && !btn.closest("pre,code"));
  }

  async function clickVisibleButtonAndGetClipboard(button) {
    try {
      window.focus();
      simulateHover(button);
      await new Promise((r) => setTimeout(r, 40));
      button.focus();
      button.click();
      await new Promise((r) => setTimeout(r, 60));
      return await readClipboardWithRetries(3, 60);
    } catch (e) {
      return "";
    }
  }

  async function clickButtonAndGetClipboard(button) {
    window.focus();
    button.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
    await new Promise((r) => setTimeout(r, 60));
    simulateHover(button);
    await new Promise((r) => setTimeout(r, 40));
    button.focus();
    button.click();
    await new Promise((r) => setTimeout(r, 120));
    window.focus();
    return await readClipboardWithRetries(3, 60);
  }

  function collectAnchoredMessageRootsOnce() {
    const roots = new Map(); // rootEl -> { rootEl, top, queryButton, responseButton }

    const queryButtons = Array.from(document.querySelectorAll('button[data-testid="copy-query-button"], button[aria-label="Copy Query"]'));
    for (const btn of queryButtons) {
      if (isCodeCopyButton(btn)) continue;
      const root = findUserMessageRootFrom(btn);
      const top = root.getBoundingClientRect().top + window.scrollY || btn.getBoundingClientRect().top + window.scrollY;
      const obj = roots.get(root) || { rootEl: root, top, queryButton: null, responseButton: null };
      obj.queryButton = obj.queryButton || btn;
      obj.top = Math.min(obj.top, top);
      roots.set(root, obj);
    }

    const responseButtons = Array.from(document.querySelectorAll('button[aria-label="Copy"]')).filter((btn) => {
      return btn.querySelector("svg.tabler-icon") || btn.querySelector("svg.tabler-icon-copy") || btn.querySelector("svg");
    });
    for (const btn of responseButtons) {
      if (isCodeCopyButton(btn)) continue;
      const root = findAssistantMessageRootFrom(btn);
      // Ensure the root actually holds an assistant answer, not some header copy control
      const hasAnswer = !!root.querySelector(".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert']");
      if (!hasAnswer) continue;
      const top = root.getBoundingClientRect().top + window.scrollY || btn.getBoundingClientRect().top + window.scrollY;
      const obj = roots.get(root) || { rootEl: root, top, queryButton: null, responseButton: null };
      obj.responseButton = obj.responseButton || btn;
      obj.top = Math.min(obj.top, top);
      roots.set(root, obj);
    }

    return Array.from(roots.values()).sort((a, b) => a.top - b.top);
  }

  // ============================================================================
  // EXTRACTION METHODS - ALL GROUPED TOGETHER
  // ============================================================================

  // Method 1: Page-down with button clicking (most reliable)
  async function extractByPageDownClickButtons(citationStyle) {
    const conversation = [];
    const processedContent = new Set();
    const processedQueryButtons = new WeakSet();
    const processedAnswerButtons = new WeakSet();

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 80));

    let stableBottomCount = 0;
    let scrollAttempt = 0;
    const maxScrollAttempts = 200;
    const scrollDelay = 90;

    while (scrollAttempt < maxScrollAttempts && stableBottomCount < 5) {
      scrollAttempt++;
      let processedSomething = false;

      // Collect visible query/response copy buttons and process in top-to-bottom order
      const qButtons = getViewportQueryButtons().map((btn) => ({ btn, role: "User" }));
      const rButtons = getViewportResponseButtons().map((btn) => ({ btn, role: "Assistant" }));
      const allButtons = [...qButtons, ...rButtons].sort((a, b) => {
        const at = a.btn.getBoundingClientRect().top;
        const bt = b.btn.getBoundingClientRect().top;
        return at - bt;
      });

      for (const item of allButtons) {
        const { btn, role } = item;
        if (role === "User") {
          if (processedQueryButtons.has(btn)) continue;
          processedQueryButtons.add(btn);
          const text = (await clickVisibleButtonAndGetClipboard(btn))?.trim();
          if (text) {
            const hash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length + "|U";
            if (!processedContent.has(hash)) {
              processedContent.add(hash);
              conversation.push({ role: "User", content: text });
              processedSomething = true;
            }
          }
        } else {
          if (processedAnswerButtons.has(btn)) continue;
          processedAnswerButtons.add(btn);
          const raw = (await clickVisibleButtonAndGetClipboard(btn))?.trim();
          if (raw) {
            const hash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
            if (!processedContent.has(hash)) {
              processedContent.add(hash);
              const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
              conversation.push({ role: "Assistant", content: processedMarkdown });
              processedSomething = true;
            }
          }
        }
      }

      // Expand any collapsed content every few steps if nothing was processed
      if (!processedSomething) {
        await clickExpandersOnce(6);
      }

      const beforeBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      await pageDownOnce(scroller, scrollDelay, 0.9);
      const afterBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      if (beforeBottom && afterBottom && !processedSomething) {
        stableBottomCount++;
      } else {
        stableBottomCount = 0;
      }
    }

    return conversation;
  }

  // Method 2: Single-pass DOM scan (no button clicking)
  async function extractByDomScanSinglePass(citationStyle) {
    const processedContent = new Set();
    const collected = [];

    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 80));

    let stableBottomCount = 0;
    let scrollAttempt = 0;
    const maxScrollAttempts = 200;
    const scrollDelay = 90;

    while (scrollAttempt < maxScrollAttempts && stableBottomCount < 5) {
      scrollAttempt++;
      const beforeCount = collected.length;

      // Collect in DOM order for this viewport/state
      const batch = collectDomMessagesInOrderOnce(citationStyle, processedContent);
      if (batch.length > 0) {
        for (const item of batch) {
          collected.push(item);
        }
      } else {
        // Try expanding collapsed sections and collect again
        const expanded = await clickExpandersOnce(8);
        if (expanded) {
          const batch2 = collectDomMessagesInOrderOnce(citationStyle, processedContent);
          if (batch2.length > 0) {
            for (const item of batch2) collected.push(item);
          }
        }
      }

      // Detect bottom
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      await pageDownOnce(scroller, scrollDelay, 0.9);
      const atBottomAfter = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;

      if (atBottom && atBottomAfter && collected.length === beforeCount) {
        stableBottomCount++;
      } else {
        stableBottomCount = 0;
      }
    }

    // Do not return to top; keep scroller where it ended
    return collected;
  }

  // Helper for Method 2: collect messages in DOM order within a pass
  function collectDomMessagesInOrderOnce(citationStyle, processedContent) {
    const results = [];
    const container = getThreadContainer();

    const assistantSelector = ".prose.text-pretty.dark\\:prose-invert, [class*='prose'][class*='prose-invert']";
    const userSelectors = [".whitespace-pre-line.text-pretty.break-words", ".group\\/query span[data-lexical-text='true']", "h1.group\\/query span[data-lexical-text='true']", "span[data-lexical-text='true']"];
    const combined = `${assistantSelector}, ${userSelectors.join(", ")}`;

    const nodes = container.querySelectorAll(combined);
    nodes.forEach((node) => {
      if (node.matches(assistantSelector)) {
        const cloned = node.cloneNode(true);
        const md = htmlToMarkdown(cloned.innerHTML, citationStyle).trim();
        if (!md) return;
        const hash = md.substring(0, 200) + md.substring(Math.max(0, md.length - 50)) + md.length;
        if (processedContent.has(hash)) return;
        processedContent.add(hash);
        results.push({ role: "Assistant", content: md });
      } else {
        // User
        const root = findUserMessageRootFromElement(node);
        if (root.closest && (root.closest(".prose.text-pretty.dark\\:prose-invert") || root.closest("[class*='prose'][class*='prose-invert']"))) return;
        // Aggregate query text from all lexical spans within the same root for stability
        const spans = root.querySelectorAll("span[data-lexical-text='true']");
        let text = "";
        if (spans.length > 0) {
          text = Array.from(spans)
            .map((s) => (s.textContent || "").trim())
            .join(" ")
            .trim();
        } else {
          text = (node.textContent || "").trim();
        }
        if (!text || text.length < 2) return;
        // Prefer nodes within a container that also has a copy-query button, but don't require it
        const hasCopyQueryButton = !!(root.querySelector && (root.querySelector("button[data-testid='copy-query-button']") || root.querySelector("button[aria-label='Copy Query']")));
        if (!hasCopyQueryButton && text.length < 10) return;
        const hash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length + "|U";
        if (processedContent.has(hash)) return;
        processedContent.add(hash);
        results.push({ role: "User", content: text });
      }
    });

    return results;
  }

  // Method 3: Anchored copy button approach (more complex, uses scrollIntoView)
  async function extractUsingCopyButtons(citationStyle) {
    // Reset global citation tracking for this export
    globalCitations.reset();

    try {
      // First try anchored, container-aware approach with preload + progressive scroll
      const anchored = await processAnchoredButtonsWithProgressiveScroll(citationStyle);
      if (anchored.length > 0) {
        return anchored;
      }

      // Fallback: robust scroll-and-process (legacy)
      return await scrollAndProcessButtons(citationStyle);
    } catch (e) {
      console.error("Copy button extraction failed:", e);
      return [];
    }
  }

  async function processAnchoredButtonsWithProgressiveScroll(citationStyle) {
    const conversation = [];
    const processedContent = new Set();
    const processedButtons = new WeakSet();

    await preloadPageFully();

    // Start at top and progressively page down to handle virtualized lists
    const scroller = getScrollRoot();
    scroller.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 80));

    let stableCount = 0;
    let scrollAttempt = 0;
    const maxScrollAttempts = 80;
    const scrollDelay = 120;

    while (scrollAttempt < maxScrollAttempts && stableCount < 5) {
      scrollAttempt++;

      const roots = collectAnchoredMessageRootsOnce();
      let processedSomethingThisPass = false;

      for (const item of roots) {
        const { queryButton, responseButton } = item;

        // Process query first
        if (queryButton && !processedButtons.has(queryButton)) {
          try {
            const text = (await clickButtonAndGetClipboard(queryButton))?.trim();
            if (text) {
              const contentHash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length;
              if (!processedContent.has(contentHash)) {
                processedContent.add(contentHash);
                conversation.push({ role: "User", content: text });
                processedSomethingThisPass = true;
              }
            }
          } catch (e) {
            console.warn("Query copy failed:", e);
          } finally {
            processedButtons.add(queryButton);
          }
        }

        // Then process response
        if (responseButton && !processedButtons.has(responseButton)) {
          try {
            const raw = (await clickButtonAndGetClipboard(responseButton))?.trim();
            if (raw) {
              const contentHash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
              if (!processedContent.has(contentHash)) {
                processedContent.add(contentHash);
                const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
                conversation.push({ role: "Assistant", content: processedMarkdown });
                processedSomethingThisPass = true;
              }
            }
          } catch (e) {
            console.warn("Response copy failed:", e);
          } finally {
            processedButtons.add(responseButton);
          }
        }
      }

      if (!processedSomethingThisPass) {
        stableCount++;
      } else {
        stableCount = 0;
      }

      // Page down and allow DOM to settle
      await pageDownOnce(scroller, scrollDelay, 0.9);
    }

    // Try to catch any remaining at the end with a final full scan without scrolling
    const finalRoots = collectAnchoredMessageRootsOnce();
    for (const { queryButton, responseButton } of finalRoots) {
      if (queryButton && !processedButtons.has(queryButton)) {
        try {
          const text = (await clickButtonAndGetClipboard(queryButton))?.trim();
          if (text) {
            const contentHash = text.substring(0, 200) + text.substring(Math.max(0, text.length - 50)) + text.length;
            if (!processedContent.has(contentHash)) {
              processedContent.add(contentHash);
              conversation.push({ role: "User", content: text });
            }
          }
        } catch {}
      }
      if (responseButton && !processedButtons.has(responseButton)) {
        try {
          const raw = (await clickButtonAndGetClipboard(responseButton))?.trim();
          if (raw) {
            const contentHash = raw.substring(0, 200) + raw.substring(Math.max(0, raw.length - 50)) + raw.length;
            if (!processedContent.has(contentHash)) {
              processedContent.add(contentHash);
              const processedMarkdown = processCopiedMarkdown(raw, citationStyle);
              conversation.push({ role: "Assistant", content: processedMarkdown });
            }
          }
        } catch {}
      }
    }

    // Return to top
    scroller.scrollTop = 0;
    await new Promise((r) => setTimeout(r, 300));

    return conversation;
  }

  // Robustly scroll through page and process copy buttons as we find them
  async function scrollAndProcessButtons(citationStyle) {
    console.log("Starting robust scroll and process...");

    const conversation = [];
    const processedContent = new Set();
    const processedButtons = new Set();

    // Ensure document stays focused
    window.focus();

      // Start from top
  const scroller = getScrollRoot();
  scroller.scrollTop = 0;
  await new Promise((resolve) => setTimeout(resolve, 120));

    let stableCount = 0;
    let scrollAttempt = 0;
    let lastButtonCount = 0;
    const maxScrollAttempts = 80; // faster loop
    const scrollDelay = 120; // shorter delay between page downs

    while (scrollAttempt < maxScrollAttempts && stableCount < 5) {
      scrollAttempt++;

      // Count current buttons before processing
      const currentButtonCount = document.querySelectorAll('button[data-testid="copy-query-button"], button[aria-label="Copy Query"], button[aria-label="Copy"]').length;

      console.log(`Page Down attempt ${scrollAttempt}: buttons=${currentButtonCount}`);

      // Find and process visible copy buttons at current position
      await processVisibleButtons();

      // Track button count changes
      if (currentButtonCount > lastButtonCount) {
        console.log(`Button count increased from ${lastButtonCount} to ${currentButtonCount}`);
        lastButtonCount = currentButtonCount;
        stableCount = 0; // Reset stability when new buttons found
      } else {
        stableCount++;
        console.log(`Button count stable at ${currentButtonCount} (stability: ${stableCount}/5)`);
      }

      // Page down the actual scroller
      await pageDownOnce(scroller, scrollDelay, 0.9);
    }

    console.log(`Scroll complete after ${scrollAttempt} attempts. Found ${conversation.length} conversation items`);

      // Return to top
  scroller.scrollTop = 0;
  await new Promise((resolve) => setTimeout(resolve, 120));

    return conversation;

    // Helper function to process visible buttons at current scroll position
    async function processVisibleButtons() {
      const allButtons = document.querySelectorAll("button");
      const copyButtons = [];

      allButtons.forEach((btn) => {
        if (processedButtons.has(btn)) return;

        // Exclude code block copy buttons
        const testId = btn.getAttribute("data-testid");
        const ariaLower = (btn.getAttribute("aria-label") || "").toLowerCase();
        if (testId === "copy-code-button" || testId === "copy-code" || testId?.includes("copy-code") || ariaLower.includes("copy code") || btn.closest("pre") || btn.closest("code")) {
          return;
        }

        // Only include conversation copy buttons
        const isQueryCopyButton = testId === "copy-query-button" || btn.getAttribute("aria-label") === "Copy Query";
        const isResponseCopyButton = btn.getAttribute("aria-label") === "Copy" && (btn.querySelector("svg.tabler-icon") || btn.querySelector("svg.tabler-icon-copy") || btn.querySelector("svg"));

        if (isQueryCopyButton) {
          copyButtons.push({ el: btn, role: "User" });
        } else if (isResponseCopyButton) {
          copyButtons.push({ el: btn, role: "Assistant" });
        }
      });

      // Sort by vertical position
      copyButtons.sort((a, b) => {
        const aTop = a.el.getBoundingClientRect().top + window.scrollY;
        const bTop = b.el.getBoundingClientRect().top + window.scrollY;
        return aTop - bTop;
      });

      console.log(`Found ${copyButtons.length} copy buttons in DOM`);

      // Process each copy button (don't filter by viewport visibility)
      for (const { el: button, role } of copyButtons) {
        if (processedButtons.has(button)) continue;

        try {
          processedButtons.add(button);

          // Ensure window stays focused
          window.focus();

          // Scroll button into view and center it
          button.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center",
          });
          await new Promise((resolve) => setTimeout(resolve, 80));

          // Click button
          button.focus();
          button.click();

          // Wait for clipboard
          await new Promise((resolve) => setTimeout(resolve, 120));
          window.focus();

          const clipboardText = await navigator.clipboard.readText();

          if (clipboardText && clipboardText.trim().length > 0) {
            // Check for duplicates
            const trimmedContent = clipboardText.trim();
            const contentHash = trimmedContent.substring(0, 200) + trimmedContent.substring(Math.max(0, trimmedContent.length - 50)) + trimmedContent.length;

            if (processedContent.has(contentHash)) {
              console.log(`Skipping duplicate content (${clipboardText.length} chars)`);
              continue;
            }

            processedContent.add(contentHash);

            if (role === "User") {
              conversation.push({
                role: "User",
                content: trimmedContent,
              });
            } else {
              const processedMarkdown = processCopiedMarkdown(clipboardText, citationStyle);
              conversation.push({
                role: "Assistant",
                content: processedMarkdown,
              });
            }
          }
        } catch (e) {
          console.error(`Failed to copy from button:`, e);
        }
      }
    }
  }


  // MAIN EXTRACTION ORCHESTRATOR
  async function extractConversation(citationStyle) {
    // Reset global citation tracking
    globalCitations.reset();

    // Method 1: Page-down with button clicking (most reliable)
    // Uses Perplexity's native copy buttons to extract exact content
    console.log("Trying Method 1: Page-down with button clicking...");
    const viaButtons = await extractByPageDownClickButtons(citationStyle);
    console.log(`Method 1 found ${viaButtons.length} items`);
    if (viaButtons.length >= 2) {
      // At least 1 complete turn (User + Assistant)
      console.log("✅ Using Method 1: Button clicking extraction");
      return viaButtons;
    }

    // Method 2: Single-pass DOM scan (no button clicking)
    // Directly reads DOM content while scrolling
    console.log("Trying Method 2: Single-pass DOM scan...");
    const domSingle = await extractByDomScanSinglePass(citationStyle);
    console.log(`Method 2 found ${domSingle.length} items`);
    if (domSingle.length >= 2) {
      // At least 1 complete turn (User + Assistant)
      console.log("✅ Using Method 2: DOM scan extraction");
      return domSingle;
    }

    // Method 3: Anchored copy button approach (legacy)
    // Falls back to older button-based extraction
    console.log("Trying Method 3: Anchored copy button approach...");
    const copyButtonApproach = await extractUsingCopyButtons(citationStyle);
    console.log(`Method 3 found ${copyButtonApproach.length} items`);
    if (copyButtonApproach.length >= 2) {
      // At least 1 complete turn (User + Assistant)
      console.log("✅ Using Method 3: Anchored button extraction");
      return copyButtonApproach;
    }

    console.log("❌ No content found with any method");
    return [];
  }

  // ============================================================================
  // MARKDOWN PROCESSING FUNCTIONS
  // ============================================================================

  // Process copied markdown and convert citations to desired style with global consolidation
  function processCopiedMarkdown(markdown, citationStyle) {
    // The copied format already has [N] citations and numbered URL references at bottom

    // Extract the numbered references section (at bottom of each response)
    const referenceMatches = markdown.match(/\[(\d+)\]\(([^)]+)\)/g) || [];
    const localReferences = new Map(); // local number -> URL

    // Also extract plain numbered references like "1 https://example.com"
    const plainRefs = markdown.match(/^\s*(\d+)\s+(https?:\/\/[^\s\n]+)/gm) || [];
    plainRefs.forEach((ref) => {
      const match = ref.match(/(\d+)\s+(https?:\/\/[^\s\n]+)/);
      if (match) {
        localReferences.set(match[1], match[2]);
      }
    });

    // Extract from [N](url) format citations
    referenceMatches.forEach((ref) => {
      const match = ref.match(/\[(\d+)\]\(([^)]+)\)/);
      if (match) {
        localReferences.set(match[1], match[2]);
      }
    });

    // Remove the plain numbered references section and [N](url) citation blocks from the main content
    let content = markdown
      .replace(/^\s*\d+\s+https?:\/\/[^\s\n]+$/gm, "") // Remove "1 https://example.com" lines
      .replace(/^\s*\[(\d+)\]\([^)]+\)$/gm, "") // Remove "[1](https://example.com)" lines
      .replace(/\n{3,}/g, "\n\n"); // Clean up extra newlines left behind

    // Create mapping from local citation numbers to global numbers
    const localToGlobalMap = new Map();

    // Build the mapping by processing all found references
    localReferences.forEach((url, localNum) => {
      const globalNum = globalCitations.addCitation(url);
      localToGlobalMap.set(localNum, globalNum);
    });

    // Normalize any inline [N](url) occurrences inside the content into [N] tokens, while capturing URLs
    content = content.replace(/\[(\d+)\]\(([^)]+)\)/g, (m, localNum, url) => {
      if (!localReferences.has(localNum)) {
        localReferences.set(localNum, url);
        if (!localToGlobalMap.has(localNum)) {
          const globalNum = globalCitations.addCitation(url);
          localToGlobalMap.set(localNum, globalNum);
        }
      }
      return `[${localNum}]`;
    });

    // Helper builders per style for a run of local numbers
    function buildEndnotesRun(localNums) {
      return localNums
        .map((n) => {
          const g = localToGlobalMap.get(n) || n;
          return `[${g}]`;
        })
        .join("");
    }

    function buildFootnotesRun(localNums) {
      return localNums
        .map((n) => {
          const g = localToGlobalMap.get(n) || n;
          return `[^${g}]`;
        })
        .join("");
    }

    function buildInlineRun(localNums) {
      return localNums
        .map((n) => {
          const url = localReferences.get(n) || "";
          const g = localToGlobalMap.get(n) || n;
          return url ? `[${g}](${url})` : `[${g}]`;
        })
        .join("");
    }

    function buildParenthesizedRun(localNums) {
      // Render each citation in its own parentheses: ([g1](u1)) ([g2](u2)) ...
      return localNums
        .map((n) => {
          const url = localReferences.get(n) || "";
          const g = localToGlobalMap.get(n) || n;
          const core = url ? `[${g}](${url})` : `[${g}]`;
          return `(${core})`;
        })
        .join(" ");
    }

    function buildNamedRun(localNums) {
      // Render each citation in its own parentheses with domain name: ([domain1](u1)) ([domain2](u2)) ...
      return localNums
        .map((n) => {
          const url = localReferences.get(n) || "";
          const domain = extractDomainName(url) || "source";
          const core = url ? `[${domain}](${url})` : `[${domain}]`;
          return `(${core})`;
        })
        .join(" ");
    }

    // Replace runs of citation tokens like [2][4][5] or with spaces between with style-specific output
    // Don't consume trailing whitespace/newlines so we preserve layout
    content = content.replace(/(?:\s*\[\d+\])+/g, (run) => {
      const nums = Array.from(run.matchAll(/\[(\d+)\]/g)).map((m) => m[1]);
      if (nums.length === 0) return run;
      if (citationStyle === CITATION_STYLES.NONE) return ""; // Remove citations completely
      if (citationStyle === CITATION_STYLES.ENDNOTES) return buildEndnotesRun(nums);
      if (citationStyle === CITATION_STYLES.FOOTNOTES) return buildFootnotesRun(nums);
      if (citationStyle === CITATION_STYLES.INLINE) return buildInlineRun(nums);
      if (citationStyle === CITATION_STYLES.PARENTHESIZED) return buildParenthesizedRun(nums);
      if (citationStyle === CITATION_STYLES.NAMED) return buildNamedRun(nums);
      return run;
    });

    // Citations processed and remapped to global numbers

    // Clean up any excessive parentheses sequences that might have been created
    // Collapse 3+ to 2 and remove spaces before punctuation
    content = content.replace(/\){3,}/g, "))");
    content = content.replace(/\(\({2,}/g, "((");

    // Handle newline spacing based on user preference
    const prefs = getPreferences();
    if (prefs.addExtraNewlines) {
      // Keep some extra newlines (max two consecutive)
      content = content.replace(/\n{3,}/g, "\n\n");
    } else {
      // Strip ALL extra newlines by default - single newlines only everywhere
      content = content
        .replace(/\n+/g, "\n") // Replace any multiple newlines with single newline
        .replace(/\n\s*\n/g, "\n"); // Remove any newlines with just whitespace between them
    }

    // Ensure content ends with single newline and clean up extra whitespace
    content = content.trim();

    return content;
  }

  // Convert HTML content to markdown
  function htmlToMarkdown(html, citationStyle = CITATION_STYLES.PARENTHESIZED) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("code").forEach((codeElem) => {
      if (codeElem.style.whiteSpace && codeElem.style.whiteSpace.includes("pre-wrap")) {
        if (codeElem.parentElement.tagName.toLowerCase() !== "pre") {
          const pre = document.createElement("pre");
          let language = "";
          const prevDiv = codeElem.closest("div.pr-lg")?.previousElementSibling;
          if (prevDiv) {
            const langDiv = prevDiv.querySelector(".text-text-200");
            if (langDiv) {
              language = langDiv.textContent.trim().toLowerCase();
              langDiv.remove();
            }
          }
          pre.dataset.language = language;
          pre.innerHTML = "<code>" + codeElem.innerHTML + "</code>";
          codeElem.parentNode.replaceChild(pre, codeElem);
        }
      }
    });

    // Process citations - updated for new structure with proper URL-based tracking
    const citations = [
      ...tempDiv.querySelectorAll("a.citation"), // Old structure
      ...tempDiv.querySelectorAll(".citation.inline"), // New structure
    ];

    // Track unique sources by normalized URL
    const urlToNumber = new Map(); // normalized URL -> citation number
    const citationRefs = new Map(); // citation number -> {href, sourceName, normalizedUrl, multipleUrls}
    let nextCitationNumber = 1;

    // Process citations synchronously first, then handle multi-citations
    citations.forEach((citation) => {
      let href = null;
      let sourceName = null;
      let isMultiCitation = false;

      // Handle old structure (a.citation)
      if (citation.tagName === "A" && citation.classList.contains("citation")) {
        href = citation.getAttribute("href");
      }
      // Handle new structure (.citation.inline)
      else if (citation.classList.contains("citation") && citation.classList.contains("inline")) {
        // Get source name from aria-label or nested text
        const ariaLabel = citation.getAttribute("aria-label");
        if (ariaLabel) {
          sourceName = extractSourceName(ariaLabel);
        }

        // If no source name from aria-label, try to find it in nested elements
        if (!sourceName) {
          const numberSpan = citation.querySelector('.text-3xs, [class*="text-3xs"]');
          if (numberSpan) {
            const spanText = numberSpan.textContent;
            sourceName = extractSourceName(spanText);

            // Check if this is a multi-citation (has +N format)
            isMultiCitation = /\+\d+$/.test(spanText.trim());
          }
        }

        // Get href from nested anchor
        const nestedAnchor = citation.querySelector("a[href]");
        href = nestedAnchor ? nestedAnchor.getAttribute("href") : null;

        // For multi-citations, we'll process them later to avoid blocking
        if (isMultiCitation) {
          citation.setAttribute("data-is-multi-citation", "true");
        }
      }

      if (href) {
        const normalizedUrl = normalizeUrl(href);

        // Check if we've seen this URL before
        if (!urlToNumber.has(normalizedUrl)) {
          // New URL - assign next available number
          urlToNumber.set(normalizedUrl, nextCitationNumber);
          citationRefs.set(nextCitationNumber, {
            href,
            sourceName,
            normalizedUrl,
            isMultiCitation,
          });
          nextCitationNumber++;
        }
        // If we've seen this URL before, we'll reuse the existing number
      }
    });

    // Clean up citations based on style using URL-based numbering
    tempDiv.querySelectorAll(".citation").forEach((el) => {
      let href = null;
      let sourceName = null;
      let isMultiCitation = false;

      // Handle old structure (a.citation)
      if (el.tagName === "A" && el.classList.contains("citation")) {
        href = el.getAttribute("href");
      }
      // Handle new structure (.citation.inline)
      else if (el.classList.contains("citation") && el.classList.contains("inline")) {
        // Get source name from aria-label or nested text
        const ariaLabel = el.getAttribute("aria-label");
        if (ariaLabel) {
          sourceName = extractSourceName(ariaLabel);
        }

        if (!sourceName) {
          const numberSpan = el.querySelector('.text-3xs, [class*="text-3xs"]');
          if (numberSpan) {
            const spanText = numberSpan.textContent;
            sourceName = extractSourceName(spanText);
            isMultiCitation = /\+\d+$/.test(spanText.trim());
          }
        }

        // Get href from nested anchor
        const nestedAnchor = el.querySelector("a[href]");
        href = nestedAnchor ? nestedAnchor.getAttribute("href") : null;
      }

      if (href) {
        const normalizedUrl = normalizeUrl(href);
        const number = urlToNumber.get(normalizedUrl);

        if (number) {
          // For multi-citations, we'll show a note about multiple sources
          let citationText = "";
          let citationUrl = href;

          if (isMultiCitation) {
            // Extract the count from the +N format
            const numberSpan = el.querySelector('.text-3xs, [class*="text-3xs"]');
            const countMatch = numberSpan ? numberSpan.textContent.match(/\+(\d+)$/) : null;
            const count = countMatch ? parseInt(countMatch[1]) : 2;

            if (citationStyle === CITATION_STYLES.NONE) {
              citationText = ""; // Remove citation completely
            } else if (citationStyle === CITATION_STYLES.NAMED && sourceName) {
              citationText = ` [${sourceName} +${count} more](${citationUrl}) `;
            } else {
              citationText = ` [${number} +${count} more](${citationUrl}) `;
            }
          } else {
            // Single citation - use normal format
            if (citationStyle === CITATION_STYLES.NONE) {
              citationText = ""; // Remove citation completely
            } else if (citationStyle === CITATION_STYLES.INLINE) {
              citationText = ` [${number}](${citationUrl}) `;
            } else if (citationStyle === CITATION_STYLES.PARENTHESIZED) {
              citationText = ` ([${number}](${citationUrl})) `;
            } else if (citationStyle === CITATION_STYLES.NAMED && sourceName) {
              citationText = ` [${sourceName}](${citationUrl}) `;
            } else if (citationStyle === CITATION_STYLES.FOOTNOTES) {
              citationText = ` [^${number}] `;
            } else {
              citationText = ` [${number}] `;
            }
          }

          el.replaceWith(citationText);
        } else {
          // Fallback if we can't find the number
        }
      } else {
        // Fallback if we can't parse properly
      }
    });

    // Convert strong sections to headers and clean up content
    let text = tempDiv.innerHTML;

    //  Basic HTML conversion
    text = text
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "# $1")
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "## $1")
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "### $1")
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "#### $1")
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/g, "##### $1")
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/g, "###### $1")
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? `${content}\n\n` : `${content}\n`;
      })
      .replace(/<br\s*\/?>(?!\n)/g, () => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? "\n\n" : "\n";
      })
      .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
      .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
      .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? `${content}\n\n` : `${content}\n`;
      })
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, content) => {
        const prefs = getPreferences();
        return prefs.addExtraNewlines ? ` - ${content}\n\n` : ` - ${content}\n`;
      });

    // Handle tables before removing remaining HTML
    text = text.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (match) => {
      const tableDiv = document.createElement("div");
      tableDiv.innerHTML = match;
      const rows = [];

      // Process header rows
      const headerRows = tableDiv.querySelectorAll("thead tr");
      if (headerRows.length > 0) {
        headerRows.forEach((row) => {
          const cells = [...row.querySelectorAll("th, td")].map((cell) => cell.textContent.trim() || " ");
          if (cells.length > 0) {
            rows.push(`| ${cells.join(" | ")} |`);
            // Add separator row after headers
            rows.push(`| ${cells.map(() => "---").join(" | ")} |`);
          }
        });
      }

      // Process body rows
      const bodyRows = tableDiv.querySelectorAll("tbody tr");
      bodyRows.forEach((row) => {
        const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent.trim() || " ");
        if (cells.length > 0) {
          rows.push(`| ${cells.join(" | ")} |`);
        }
      });

      // Return markdown table with proper spacing
      return rows.length > 0 ? `\n\n${rows.join("\n")}\n\n` : "";
    });

    // Continue with remaining HTML conversion
    text = text
      .replace(/<pre[^>]*data-language="([^"]*)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/g, "```$1\n$2\n```")
      .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1\n```")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<[^>]+>/g, ""); // Remove any remaining HTML tags

    // Clean up whitespace
    // Convert bold text at start of line to h3 headers, but not if inside a list item
    text = text.replace(/^(\s*)\*\*([^*\n]+)\*\*(?!.*\n\s*-)/gm, "$1### $2");

    // This fixes list items where the entire text was incorrectly converted to headers
    // We need to preserve both partial bold items and fully bold items
    text = text.replace(/^(\s*-\s+)###\s+([^\n]+)/gm, function (_, listPrefix, content) {
      // Check if the content contains bold markers
      if (content.includes("**")) {
        // If it already has bold markers, just remove the ### and keep the rest intact
        return `${listPrefix}${content}`;
      } else {
        // If it doesn't have bold markers (because it was fully bold before),
        // add them back (this was incorrectly converted to a header)
        return `${listPrefix}**${content}**`;
      }
    });

    // Fix list spacing (no extra newlines between items)
    text = text.replace(/\n\s*-\s+/g, "\n- ");

    // Ensure headers have proper spacing
    text = text.replace(/([^\n])(\n#{1,3} )/g, "$1\n\n$2");

    // Fix unbalanced or misplaced bold markers in list items
    text = text.replace(/^(\s*-\s+.*?)(\s\*\*\s*)$/gm, "$1"); // Remove trailing ** with space before

    // Fix citation and bold issues - make sure citations aren't wrapped in bold
    text = text.replace(/\*\*([^*]+)(\[[0-9]+\]\([^)]+\))\s*\*\*/g, "**$1**$2");
    text = text.replace(/\*\*([^*]+)(\(\[[0-9]+\]\([^)]+\)\))\s*\*\*/g, "**$1**$2");

    // Fix cases where a line ends with an extra bold marker after a citation
    text = text.replace(/(\[[0-9]+\]\([^)]+\))\s*\*\*/g, "$1");
    text = text.replace(/(\(\[[0-9]+\]\([^)]+\)\))\s*\*\*/g, "$1");

    // Clean up whitespace
    text = text
      .replace(/^[\s\n]+|[\s\n]+$/g, "") // Trim start and end
      .replace(/^\s+/gm, "") // Remove leading spaces on each line
      .replace(/[ \t]+$/gm, "") // Remove trailing spaces
      .trim();

    // Handle newline spacing based on user preference
    const prefs = getPreferences();
    if (prefs.addExtraNewlines) {
      // Keep extra newlines (max two consecutive)
      text = text.replace(/\n{3,}/g, "\n\n");
    } else {
      // Strip ALL extra newlines by default - single newlines only everywhere
      text = text
        .replace(/\n+/g, "\n") // Replace any multiple newlines with single newline
        .replace(/\n\s*\n/g, "\n"); // Remove any newlines with just whitespace between them
    }

    if (citationStyle === CITATION_STYLES.INLINE || citationStyle === CITATION_STYLES.PARENTHESIZED) {
      // Remove extraneous space before a period, but preserve newlines
      text = text.replace(/ (?=\.)/g, "");
    }

    // Add citations at the bottom for endnotes style
    if (citationStyle === CITATION_STYLES.ENDNOTES && citationRefs.size > 0) {
      text += "\n\n### Sources\n";
      for (const [number, { href }] of citationRefs) {
        text += `[${number}] ${href}\n`;
      }
    }

    // Add footnote definitions at the bottom for footnotes style
    if (citationStyle === CITATION_STYLES.FOOTNOTES && citationRefs.size > 0) {
      text += "\n\n";
      for (const [number, { href }] of citationRefs) {
        text += `[^${number}]: ${href}\n`;
      }
    }

    return text;
  }

  // Format the complete markdown document
  function formatMarkdown(conversations) {
    const title = document.title.replace(" | Perplexity", "").trim();
    const timestamp = new Date().toISOString().split("T")[0];
    const prefs = getPreferences();

    let markdown = "";

    // Only add frontmatter if enabled
    if (prefs.includeFrontmatter) {
      markdown += "---\n";
      markdown += `title: ${title}\n`;
      markdown += `date: ${timestamp}\n`;
      markdown += `source: ${window.location.href}\n`;
      markdown += "---\n\n"; // Add newline after properties
    }

    // Add title as H1 if enabled
    if (prefs.titleAsH1) {
      markdown += `# ${title}\n\n`;
    }

    conversations.forEach((conv, index) => {
      if (conv.role === "Assistant") {
        // Ensure assistant content ends with single newline
        let cleanContent = conv.content.trim();

        // Check if content starts with a header and fix formatting
        if (cleanContent.match(/^#+ /)) {
          // Content starts with a header - ensure role is on separate line
          if (prefs.formatStyle === FORMAT_STYLES.FULL) {
            markdown += `**${conv.role}:**\n\n${cleanContent}\n\n`;
          } else {
            markdown += `${cleanContent}\n\n`;
          }
        } else {
          // Normal content formatting
          if (prefs.formatStyle === FORMAT_STYLES.FULL) {
            markdown += `**${conv.role}:** ${cleanContent}\n\n`;
          } else {
            markdown += `${cleanContent}\n\n`;
          }
        }

        // Add divider only between assistant responses, not after the last one
        const nextAssistant = conversations.slice(index + 1).find((c) => c.role === "Assistant");
        if (nextAssistant) {
          markdown += "---\n\n";
        }
      } else if (conv.role === "User" && prefs.formatStyle === FORMAT_STYLES.FULL) {
        markdown += `**${conv.role}:** ${conv.content.trim()}\n\n`;
        markdown += "---\n\n";
      }
    });

    // Add global citations at the end for endnotes style
    if (prefs.citationStyle === CITATION_STYLES.ENDNOTES && globalCitations.citationRefs.size > 0) {
      markdown += "\n\n### Sources\n";
      for (const [number, { href }] of globalCitations.citationRefs) {
        markdown += `\n[${number}] ${href}`;
      }
      markdown += "\n"; // Add final newline
    }

    // Add global footnote definitions at the end for footnotes style
    if (prefs.citationStyle === CITATION_STYLES.FOOTNOTES && globalCitations.citationRefs.size > 0) {
      markdown += "\n\n";
      for (const [number, { href }] of globalCitations.citationRefs) {
        markdown += `[^${number}]: ${href}\n`;
      }
    }

    return markdown.trim(); // Trim any trailing whitespace at the very end
  }

  // ============================================================================
  // UI FUNCTIONS
  // ============================================================================

  // Download markdown file
  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Copy to clipboard
  async function copyToClipboard(content) {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }

  // Temporarily prevent navigation (external anchors and window.open) during export
  function installNavBlocker() {
    const clickBlocker = (e) => {
      try {
        const anchor = e.target && e.target.closest && e.target.closest('a[href], area[href]');
        if (!anchor) return;
        const href = (anchor.getAttribute('href') || '').trim();
        const target = (anchor.getAttribute('target') || '').trim().toLowerCase();
        const isExternal = /^https?:\/\//i.test(href);
        if (isExternal || target === '_blank') {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } catch {}
    };
    document.addEventListener('click', clickBlocker, true);

    const originalOpen = window.open;
    window.open = function () { return null; };

    return function removeNavBlocker() {
      try { document.removeEventListener('click', clickBlocker, true); } catch {}
      try { window.open = originalOpen; } catch {}
    };
  }

  // Create and add export button
  function addExportButton() {
    const existingControls = document.getElementById("perplexity-export-controls");
    if (existingControls) {
      existingControls.remove();
    }

    const container = document.createElement("div");
    container.id = "perplexity-export-controls";
    container.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            align-items: stretch;
            z-index: 99999;
            font-family: inherit;
        `;

    const exportButton = document.createElement("button");
    exportButton.id = "perplexity-export-btn";
    exportButton.type = "button";
    exportButton.textContent = "Save as Markdown"; // Default, will be updated
    exportButton.style.cssText = `
            padding: 4px 8px;
            background-color: #30b8c6;
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background-color 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

    const optionsWrapper = document.createElement("div");
    optionsWrapper.style.cssText = `
            position: relative;
            display: flex;
        `;

    const optionsButton = document.createElement("button");
    optionsButton.id = "perplexity-export-options-btn";
    optionsButton.type = "button";
    optionsButton.setAttribute("aria-haspopup", "true");
    optionsButton.setAttribute("aria-expanded", "false");
    optionsButton.style.cssText = `
            padding: 4px 8px;
            background-color: #30b8c6;
            color: black;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background-color 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            white-space: nowrap;
        `;

    const menu = document.createElement("div");
    menu.id = "perplexity-export-options-menu";
    menu.style.cssText = `
            position: absolute;
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            display: none;
            flex-direction: column;
            gap: 10px;
            min-width: 280px;
            background: #1F2121;
            color: white;
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
        `;

    optionsWrapper.appendChild(optionsButton);

    container.appendChild(exportButton);
    container.appendChild(optionsWrapper);
    container.appendChild(menu);

    function updateOptionsButtonLabel() {
      const label = `Options`;
      optionsButton.textContent = label;
      optionsButton.setAttribute("aria-label", `Export options. ${label}`);
    }

    function updateExportButtonLabel() {
      const prefs = getPreferences();
      const label = prefs.exportMethod === EXPORT_METHODS.CLIPBOARD ? "Copy as Markdown" : "Save as Markdown";
      exportButton.textContent = label;
    }

    function createOptionButton(label, value, currentValue, onSelect, tooltip) {
      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.textContent = label;
      if (tooltip) {
        optionBtn.setAttribute("title", tooltip);
      }
      optionBtn.style.cssText = `
                padding: 6px 8px;
                border-radius: 6px;
                border: 1px solid ${value === currentValue ? "#30b8c6" : "#4a5568"};
                background-color: ${value === currentValue ? "#30b8c6" : "#2d3748"};
                color: ${value === currentValue ? "#0a0e13" : "#f7fafc"};
                font-size: 11px;
                text-align: center;
                cursor: pointer;
                transition: background-color 0.2s, border-color 0.2s, color 0.2s;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
      optionBtn.addEventListener("mouseenter", () => {
        if (value !== currentValue) {
          optionBtn.style.borderColor = "#30b8c6";
          optionBtn.style.backgroundColor = "#4a5568";
        }
      });
      optionBtn.addEventListener("mouseleave", () => {
        if (value !== currentValue) {
          optionBtn.style.borderColor = "#4a5568";
          optionBtn.style.backgroundColor = "#2d3748";
        }
      });
      optionBtn.addEventListener("click", () => {
        onSelect(value);
        renderOptionsMenu();
        updateOptionsButtonLabel();
        updateExportButtonLabel();
      });
      return optionBtn;
    }

    function appendOptionGroup(sectionEl, label, options, currentValue, onSelect, labelTooltip) {
      const group = document.createElement("div");
      group.style.display = "flex";
      group.style.flexDirection = "column";
      group.style.gap = "6px";

      if (label) {
        const groupLabel = document.createElement("div");
        groupLabel.textContent = label;
        groupLabel.style.cssText = "font-size: 12px; font-weight: 600; color: #d1d5db;";
        if (labelTooltip) {
          groupLabel.setAttribute("title", labelTooltip);
          groupLabel.style.cursor = "help";
        }
        group.appendChild(groupLabel);
      }

      const list = document.createElement("div");
      list.style.display = "grid";
      list.style.gridTemplateColumns = "1fr 1fr";
      list.style.gap = "4px";

      options.forEach((opt) => {
        list.appendChild(createOptionButton(opt.label, opt.value, currentValue, onSelect, opt.tooltip));
      });

      group.appendChild(list);
      sectionEl.appendChild(group);
    }

    function renderOptionsMenu() {
      const prefs = getPreferences();
      menu.innerHTML = "";

      const citationSection = document.createElement("div");
      citationSection.style.display = "flex";
      citationSection.style.flexDirection = "column";
      citationSection.style.gap = "6px";

      const citationHeading = document.createElement("div");
      citationHeading.textContent = "Citation Style";
      citationHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      citationSection.appendChild(citationHeading);

      appendOptionGroup(
        citationSection,
        "Format",
        [
          { label: "Endnotes", value: CITATION_STYLES.ENDNOTES, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.ENDNOTES] },
          { label: "Footnotes", value: CITATION_STYLES.FOOTNOTES, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.FOOTNOTES] },
          { label: "Inline", value: CITATION_STYLES.INLINE, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.INLINE] },
          { label: "Parenthesized", value: CITATION_STYLES.PARENTHESIZED, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.PARENTHESIZED] },
          { label: "Named", value: CITATION_STYLES.NAMED, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.NAMED] },
          { label: "No Citations", value: CITATION_STYLES.NONE, tooltip: CITATION_STYLE_DESCRIPTIONS[CITATION_STYLES.NONE] },
        ],
        prefs.citationStyle,
        (next) => GM_setValue("citationStyle", next)
      );

      menu.appendChild(citationSection);

      const outputSection = document.createElement("div");
      outputSection.style.display = "flex";
      outputSection.style.flexDirection = "column";
      outputSection.style.gap = "6px";

      const outputHeading = document.createElement("div");
      outputHeading.textContent = "Output Style";
      outputHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      outputSection.appendChild(outputHeading);

      appendOptionGroup(
        outputSection,
        "Layout",
        [
          { label: "Full (User & Assistant)", value: FORMAT_STYLES.FULL },
          { label: "Concise (content only)", value: FORMAT_STYLES.CONCISE },
        ],
        prefs.formatStyle,
        (next) => GM_setValue("formatStyle", next)
      );

      appendOptionGroup(
        outputSection,
        "Spacing",
        [
          { label: "Standard", value: false },
          { label: "Extra newlines", value: true },
        ],
        prefs.addExtraNewlines,
        (next) => GM_setValue("addExtraNewlines", next)
      );

      appendOptionGroup(
        outputSection,
        "Frontmatter",
        [
          { label: "Include", value: true, tooltip: "Include YAML metadata (title, date, source URL) at the top" },
          { label: "Exclude", value: false, tooltip: "Export just the conversation content without metadata" },
        ],
        prefs.includeFrontmatter,
        (next) => GM_setValue("includeFrontmatter", next),
        "YAML metadata section at the top with title, date, and source URL"
      );

      appendOptionGroup(
        outputSection,
        "Title as H1",
        [
          { label: "Include", value: true, tooltip: "Add the conversation title as a level 1 heading" },
          { label: "Exclude", value: false, tooltip: "Don't add title as heading (use frontmatter only)" },
        ],
        prefs.titleAsH1,
        (next) => GM_setValue("titleAsH1", next),
        "Add the conversation title as a # heading at the top"
      );

      menu.appendChild(outputSection);

      const exportSection = document.createElement("div");
      exportSection.style.display = "flex";
      exportSection.style.flexDirection = "column";
      exportSection.style.gap = "6px";

      const exportHeading = document.createElement("div");
      exportHeading.textContent = "Export Options";
      exportHeading.style.cssText = "font-size: 13px; font-weight: 700; color: #f9fafb;";
      exportSection.appendChild(exportHeading);

      appendOptionGroup(
        exportSection,
        "Output Method",
        [
          { label: "Download File", value: EXPORT_METHODS.DOWNLOAD },
          { label: "Copy to Clipboard", value: EXPORT_METHODS.CLIPBOARD },
        ],
        prefs.exportMethod,
        (next) => GM_setValue("exportMethod", next)
      );

      menu.appendChild(exportSection);
    }

    function openMenu() {
      renderOptionsMenu();
      menu.style.display = "flex";
      optionsButton.setAttribute("aria-expanded", "true");
      optionsButton.style.backgroundColor = "#30b8c6";
      document.addEventListener("mousedown", handleOutsideClick, true);
      document.addEventListener("keydown", handleEscapeKey, true);
    }

    function closeMenu() {
      menu.style.display = "none";
      optionsButton.setAttribute("aria-expanded", "false");
      optionsButton.style.backgroundColor = "#30b8c6";
      document.removeEventListener("mousedown", handleOutsideClick, true);
      document.removeEventListener("keydown", handleEscapeKey, true);
    }

    function toggleMenu() {
      if (menu.style.display === "none" || menu.style.display === "") {
        openMenu();
      } else {
        closeMenu();
      }
    }

    function handleOutsideClick(event) {
      if (!menu.contains(event.target) && !optionsButton.contains(event.target)) {
        closeMenu();
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    optionsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });

    optionsButton.addEventListener("mouseenter", () => {
      optionsButton.style.backgroundColor = "#30b8c6";
    });

    optionsButton.addEventListener("mouseleave", () => {
      optionsButton.style.backgroundColor = "#30b8c6";
    });

    updateOptionsButtonLabel();
    updateExportButtonLabel();

    const positionContainer = () => {
      let mainContainer = document.querySelector(".max-w-threadContentWidth") || document.querySelector('[class*="threadContentWidth"]');

      if (!mainContainer) {
        const inputArea = document.querySelector("textarea[placeholder]") || document.querySelector('[role="textbox"]') || document.querySelector("form");
        if (inputArea) {
          let parent = inputArea.parentElement;
          while (parent && parent !== document.body) {
            const width = parent.getBoundingClientRect().width;
            if (width > 400 && width < window.innerWidth * 0.8) {
              mainContainer = parent;
              break;
            }
            parent = parent.parentElement;
          }
        }
      }

      if (!mainContainer) {
        mainContainer = document.querySelector("main") || document.querySelector('[role="main"]') || document.querySelector('[class*="main-content"]');
      }

      if (mainContainer) {
        const rect = mainContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        container.style.transition = "none";
        container.style.left = `${centerX}px`;
        container.style.transform = "translateX(-50%)";
        requestAnimationFrame(() => {
          container.style.transition = "left 0.2s";
        });
        console.log("Controls positioned at:", centerX, "Container width:", rect.width, "Container left:", rect.left);
      } else {
        container.style.transition = "none";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        requestAnimationFrame(() => {
          container.style.transition = "left 0.2s";
        });
      }
    };

    positionContainer();

    window.addEventListener("resize", () => {
      console.log("Window resize detected");
      positionContainer();
    });

    window.addEventListener("orientationchange", () => {
      console.log("Orientation change detected");
      setTimeout(positionContainer, 100);
    });

    const observer = new MutationObserver((mutations) => {
      console.log("DOM mutation detected:", mutations.length, "mutations");
      positionContainer();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: false,
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: false,
    });

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver((entries) => {
        console.log("ResizeObserver triggered for", entries.length, "elements");
        positionContainer();
      });

      resizeObserver.observe(document.body);
      resizeObserver.observe(document.documentElement);

      const containers = [
        document.querySelector(".max-w-threadContentWidth"),
        document.querySelector('[class*="threadContentWidth"]'),
        document.querySelector("main"),
        document.querySelector('[role="main"]'),
      ].filter(Boolean);

      containers.forEach((candidate) => {
        console.log("Observing container:", candidate);
        resizeObserver.observe(candidate);
        if (candidate.parentElement) {
          resizeObserver.observe(candidate.parentElement);
        }
      });
    }

    setInterval(() => {
      const currentLeft = parseFloat(container.style.left) || 0;
      const rect = (document.querySelector(".max-w-threadContentWidth") || document.querySelector('[class*="threadContentWidth"]') || document.querySelector("main"))?.getBoundingClientRect();

      if (rect) {
        const expectedX = rect.left + rect.width / 2;
        if (Math.abs(currentLeft - expectedX) > 20) {
          console.log("Periodic check: repositioning controls from", currentLeft, "to", expectedX);
          positionContainer();
        }
      }
    }, 2000);

    exportButton.addEventListener("mouseenter", () => {
      exportButton.style.backgroundColor = "#30b8c6";
    });

    exportButton.addEventListener("mouseleave", () => {
      exportButton.style.backgroundColor = "#30b8c6";
    });

    exportButton.addEventListener("click", async () => {
      const originalText = exportButton.textContent;
      exportButton.textContent = "Exporting...";
      exportButton.disabled = true;

      const removeNavBlocker = installNavBlocker();
      try {
        window.focus();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const prefs = getPreferences();
        const conversation = await extractConversation(prefs.citationStyle);
        if (conversation.length === 0) {
          alert("No conversation content found to export.");
          return;
        }

        const markdown = formatMarkdown(conversation);

        if (prefs.exportMethod === EXPORT_METHODS.CLIPBOARD) {
          const success = await copyToClipboard(markdown);
          if (success) {
            exportButton.textContent = "Copied!";
            setTimeout(() => {
              exportButton.textContent = originalText;
            }, 2000);
          } else {
            alert("Failed to copy to clipboard. Please try again.");
          }
        } else {
          const title = document.title.replace(" | Perplexity", "").trim();
          const safeTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .replace(/^-+|-+$/g, "");
          const filename = `${safeTitle}.md`;
          downloadMarkdown(markdown, filename);
        }
      } catch (error) {
        console.error("Export failed:", error);
        alert("Export failed. Please try again.");
      } finally {
        try {
          removeNavBlocker();
        } catch {}
        if (exportButton.textContent !== "Copied!") {
          exportButton.textContent = originalText;
        }
        exportButton.disabled = false;
        closeMenu();
      }
    });

    document.body.appendChild(container);

    // Add focus overlay for when user clicks away during export
    const focusOverlay = document.createElement('div');
    focusOverlay.id = 'perplexity-focus-overlay';
    focusOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      cursor: pointer;
    `;
    focusOverlay.innerHTML = `
      <div style="
        background: #1F2121;
        color: white;
        padding: 24px 32px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      ">
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Click here to continue export</div>
        <div style="font-size: 14px; color: #9ca3af;">Export paused - page needs focus to read clipboard</div>
      </div>
    `;
    focusOverlay.addEventListener('click', () => {
      window.focus();
      focusOverlay.style.display = 'none';
    });
    document.body.appendChild(focusOverlay);
  }

  // Initialize the script
  function init() {
    const observer = new MutationObserver(() => {
      if ((document.querySelector(".prose.text-pretty.dark\\:prose-invert") || document.querySelector("[class*='prose'][class*='prose-invert']") || document.querySelector("span[data-lexical-text='true']")) && !document.getElementById("perplexity-export-btn")) {
        addExportButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    if (document.querySelector(".prose.text-pretty.dark\\:prose-invert") || document.querySelector("[class*='prose'][class*='prose-invert']") || document.querySelector("span[data-lexical-text='true']")) {
      addExportButton();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
