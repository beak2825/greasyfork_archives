// ==UserScript==
// @name         DeepSeek Chat Exporter (Markdown & PDF & PNG - English improved version)
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  Export DeepSeek chat history to Markdown, PDF and PNG formats
// @author       HSyuf/Blueberrycongee/endolith
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/529946/DeepSeek%20Chat%20Exporter%20%28Markdown%20%20PDF%20%20PNG%20-%20English%20improved%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529946/DeepSeek%20Chat%20Exporter%20%28Markdown%20%20PDF%20%20PNG%20-%20English%20improved%20version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =====================
  // Configuration
  // =====================
  const config = {
      chatContainerSelector: '.dad65929', // Chat container
      userMessageSelector: '._9663006 .fbb737a4',  // Direct selector for user message content
      aiClassPrefix: '_4f9bf79',           // AI message related class prefix
      aiReplyContainer: '_43c05b5',        // Main container for AI replies
      searchHintSelector: '._5255ff8._4d41763', // Search/thinking time
      thinkingChainSelector: '.e1675d8b',  // Thinking chain
      finalAnswerSelector: 'div.ds-markdown', // Final answer
      titleSelector: '.afa34042.e37a04e4.e0a1edb7', // Chat title
      // Fiber navigation paths discovered via __scanReact($0, prop)
      // Update these when the site changes; they allow deterministic extraction
      answerMarkdownPath: '$0.return.return.return', // memoizedProps.markdown
      thinkingContentPath: '$0.child.child.child.return.return.return.return.return.return.return', // memoizedProps.content
      exportFileName: 'DeepSeek',          // Changed from DeepSeek_Chat_Export
      // Header strings used in exports
      userHeader: 'User',
      assistantHeader: 'Assistant',
      thoughtsHeader: 'Thought Process',
  };

  // For future maintainers: see BREAK_FIX_GUIDE.md for step-by-step recovery
  // when DOM classes or React fiber structure change.

  // User preferences with defaults
  const preferences = {
      convertLatexDelimiters: GM_getValue('convertLatexDelimiters', true),
  };

  // Register menu command for toggling LaTeX delimiter conversion
  GM_registerMenuCommand('Toggle LaTeX Delimiter Conversion', () => {
      preferences.convertLatexDelimiters = !preferences.convertLatexDelimiters;
      GM_setValue('convertLatexDelimiters', preferences.convertLatexDelimiters);
      alert(`LaTeX delimiter conversion is now ${preferences.convertLatexDelimiters ? 'enabled' : 'disabled'}`);
  });

  let __exportPNGLock = false;  // Global lock to prevent duplicate clicks

  // =====================
  // Tool functions
  // =====================
  /**
   * Gets the message content if the node contains a user message, null otherwise
   * @param {HTMLElement} node - The DOM node to check
   * @returns {string|null} The user message content if found, null otherwise
   */
  function getUserMessage(node) {
      const messageDiv = node.querySelector(config.userMessageSelector);
      return messageDiv ? messageDiv.firstChild.textContent.trim() : null;
  }

  /**
   * Checks if a DOM node represents an AI message
   * @param {HTMLElement} node - The DOM node to check
   * @returns {boolean} True if the node is an AI message
   */
  function isAIMessage(node) {
      return node.classList.contains(config.aiClassPrefix);
  }

  /**
   * Extracts search or thinking time information from a node
   * @param {HTMLElement} node - The DOM node to extract from
   * @returns {string|null} Markdown formatted search/thinking info or null if not found
   */
  function extractSearchOrThinking(node) {
      const hintNode = node.querySelector(config.searchHintSelector);
      return hintNode ? `**${hintNode.textContent.trim()}**` : null;
  }


  /**
   * Navigate a React fiber from a DOM element using a path string
   * Path format mirrors React DevTools output from __scanReact, e.g. "$0.return.child.sibling"
   * Returns the fiber located at the end of the path, or null.
   */
  function navigateFiberPathFromElement(element, pathString) {
      if (!element || !pathString) return null;
      const fiberKey = Object.keys(element).find(k => k.startsWith('__reactFiber$'));
      if (!fiberKey) return null;
      let fiber = element[fiberKey];
      // Normalize path: drop leading "$0." or "$0"
      const cleaned = pathString.replace(/^\$0\.*/, '');
      if (!cleaned) return fiber;
      const steps = cleaned.split('.');
      for (const step of steps) {
          if (!step) continue;
          fiber = fiber ? fiber[step] : null;
          if (!fiber) return null;
      }
      return fiber;
  }


  /**
   * Extracts and formats the AI's thinking chain as blockquotes
   * @param {HTMLElement} node - The DOM node containing the thinking chain
   * @returns {string|null} Markdown formatted thinking chain with header or null if not found
   *
   * CRITICAL: This function MUST extract the raw markdown from React's internal state.
   * Converting HTML to markdown is fundamentally broken and loses formatting, LaTeX,
   * code blocks, and other essential content. The entire purpose of this script is
   * to get the original markdown before it's rendered to HTML.
   */
  function extractThinkingChain(node) {
      // Prefer the inner ds-markdown within the thinking container as the base
      const markdownEl = node.querySelector('div.ds-markdown');
      const baseEl = markdownEl || node;

      const navFiber = navigateFiberPathFromElement(baseEl, config.thinkingContentPath);
      if (!navFiber || !navFiber.memoizedProps || !navFiber.memoizedProps.content) {
          console.error('THINKING CHAIN BROKEN: Could not find memoizedProps.content at configured path');
          console.error('Please update config.thinkingContentPath using the BREAK_FIX_GUIDE.md');
          alert('DeepSeek Exporter Error: Thinking chain extraction broken!\nDeepSeek may have updated their website. Check console for details.');
          return null;
      }

      const content = navFiber.memoizedProps.content;
      return `### ${config.thoughtsHeader}\n\n> ${content.split('\n').join('\n> ')}`;
  }

  /**
   * Extracts the final answer content from React fiber's memoizedProps
   * @param {HTMLElement} node - The DOM node containing the answer
   * @returns {string|null} Raw markdown content or null if not found
   *
   * CRITICAL: This function MUST extract the raw markdown from React's internal state.
   * Converting HTML to markdown is fundamentally broken and loses formatting, LaTeX,
   * code blocks, and other essential content. The entire purpose of this script is
   * to get the original markdown before it's rendered to HTML.
   */
  function extractFinalAnswer(node) {
      // Choose ds-markdown that is NOT inside the thinking container
      let answerNode = null;
      const candidates = node.querySelectorAll('div.ds-markdown');
      for (const el of candidates) {
          if (!el.closest(config.thinkingChainSelector)) { answerNode = el; break; }
      }
      if (!answerNode) {
          // Fallback to first ds-markdown
          answerNode = node.querySelector(config.finalAnswerSelector);
      }
      if (!answerNode) {
          console.debug('No answer node found');
          return null;
      }

      const navFiber = navigateFiberPathFromElement(answerNode, config.answerMarkdownPath);
      if (!navFiber || !navFiber.memoizedProps || !navFiber.memoizedProps.markdown) {
          console.error('FINAL ANSWER BROKEN: Could not find memoizedProps.markdown at configured path');
          console.error('Please update config.answerMarkdownPath using the BREAK_FIX_GUIDE.md');
          alert('DeepSeek Exporter Error: Final answer extraction broken!\nDeepSeek may have updated their website. Check console for details.');
          return null;
      }

      return navFiber.memoizedProps.markdown;
  }

  /**
   * Collects and formats all messages in the chat in chronological order
   * @returns {string[]} Array of markdown formatted messages
   */
  function getOrderedMessages() {
      const messages = [];
      const chatContainer = document.querySelector(config.chatContainerSelector);
      if (!chatContainer) {
          console.error('Chat container not found');
          return messages;
      }

      for (const node of chatContainer.children) {
          const userMessage = getUserMessage(node);
          if (userMessage) {
              messages.push(`## ${config.userHeader}\n\n${userMessage}`);
          } else if (isAIMessage(node)) {
              let output = '';
              const searchHint = extractSearchOrThinking(node);
              if (searchHint) output += `${searchHint}\n\n`;

              const thinkingChainNode = node.querySelector(config.thinkingChainSelector);
              if (thinkingChainNode) {
                  const thinkingChain = extractThinkingChain(thinkingChainNode);
                  if (thinkingChain) output += `${thinkingChain}\n\n`;
              }

              const finalAnswer = extractFinalAnswer(node);
              if (finalAnswer) output += `${finalAnswer}\n\n`;
              if (output.trim()) {
                  messages.push(`## ${config.assistantHeader}\n\n${output.trim()}`);
              }
          }
      }
      return messages;
  }

  /**
   * Extracts the chat title from the page
   * @returns {string|null} The chat title if found, null otherwise
   */
  function getChatTitle() {
      const titleElement = document.querySelector(config.titleSelector);
      return titleElement ? titleElement.textContent.trim() : null;
  }

  /**
   * Generates the complete markdown content from all messages
   * @returns {string} Complete markdown formatted chat history
   */
  function generateMdContent() {
      const messages = getOrderedMessages();
      const title = getChatTitle();
      let content = title ? `# ${title}\n\n` : '';
      content += messages.length ? messages.join('\n\n---\n\n') : '';

      // Convert LaTeX formats only if enabled
      if (preferences.convertLatexDelimiters) {
          // Use replacement functions to properly handle newlines and whitespace
          content = content
              // Inline math: \( ... \) → $ ... $
              .replace(/\\\(\s*(.*?)\s*\\\)/g, (match, group) => `$${group}$`)

              // Display math: \[ ... \] → $$ ... $$
              .replace(/\\\[([\s\S]*?)\\\]/g, (match, group) => `$$${group}$$`);
      }

      return content;
  }

  /**
   * Creates a filename-safe version of a string
   * @param {string} str - The string to make filename-safe
   * @param {number} maxLength - Maximum length of the resulting string
   * @returns {string} A filename-safe version of the input string
   */
  function makeFilenameSafe(str, maxLength = 50) {
      if (!str) return '';
      return str
          .replace(/[^a-zA-Z0-9-_\s]/g, '') // Remove special characters
          .replace(/\s+/g, '_')             // Replace spaces with underscores
          .slice(0, maxLength)              // Truncate to maxLength
          .replace(/_+$/, '')               // Remove trailing underscores
          .trim();
  }

  /**
   * Generates a filename-safe ISO 8601 timestamp
   * @returns {string} Formatted timestamp YYYY-MM-DD_HH_MM_SS
   */
  function getFormattedTimestamp() {
      const now = new Date();
      return now.toISOString()
          .replace(/[T:]/g, '_')  // Replace T and : with _
          .replace(/\..+/, '');   // Remove milliseconds and timezone
  }

  // =====================
  // Export functions
  // =====================
  /**
   * Exports the chat history as a markdown file
   * Handles math expressions and creates a downloadable .md file
   */
  function exportMarkdown() {
      const mdContent = generateMdContent();
      if (!mdContent) {
          alert("No chat history found!");
          return;
      }

      const title = getChatTitle();
      const safeTitle = makeFilenameSafe(title, 30);
      const titlePart = safeTitle ? `_${safeTitle}` : '';

      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.exportFileName}${titlePart}_${getFormattedTimestamp()}.md`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /**
   * Exports the chat history as a PDF
   * Creates a styled HTML version and opens the browser's print dialog
   */
  function exportPDF() {
      const mdContent = generateMdContent();
      if (!mdContent) return;

      const printContent = `
          <html>
              <head>
                  <title>DeepSeek Chat Export</title>
                  <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
                      h2 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
                      h3 { color: #555; margin-top: 15px; }
                      .ai-answer { color: #1a7f37; margin: 15px 0; }
                      .ai-chain { color: #666; font-style: italic; margin: 10px 0; padding-left: 15px; border-left: 3px solid #ddd; }
                      hr { border: 0; border-top: 1px solid #eee; margin: 25px 0; }
                      blockquote { border-left: 3px solid #ddd; margin: 0 0 20px; padding-left: 15px; color: #666; font-style: italic; }
                  </style>
              </head>
              <body>
                  ${mdContent.replace(new RegExp(`## ${config.userHeader}\\n\\n`, 'g'), `<h2>${config.userHeader}</h2><div class="user-question">`)
                      .replace(new RegExp(`## ${config.assistantHeader}\\n\\n`, 'g'), `<h2>${config.assistantHeader}</h2><div class="ai-answer">`)
                      .replace(new RegExp(`### ${config.thoughtsHeader}\\n`, 'g'), `<h3>${config.thoughtsHeader}</h3><blockquote class="ai-chain">`)
                      .replace(/>\s/g, '') // Remove the blockquote markers for HTML
                      .replace(/\n/g, '<br>')
                      .replace(/---/g, '</blockquote></div><hr>')}
              </body>
          </html>
      `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }

  /**
   * Exports the chat history as a PNG image
   * Creates a high-resolution screenshot of the chat content
   */
  function exportPNG() {
      if (__exportPNGLock) return;  // Skip if currently exporting
      __exportPNGLock = true;

      const chatContainer = document.querySelector(config.chatContainerSelector);
      if (!chatContainer) {
          alert("Chat container not found!");
          __exportPNGLock = false;
          return;
      }

      // Create sandbox container
      const sandbox = document.createElement('iframe');
      sandbox.style.cssText = `
          position: fixed;
          left: -9999px;
          top: 0;
          width: 800px;
          height: ${window.innerHeight}px;
          border: 0;
          visibility: hidden;
      `;
      document.body.appendChild(sandbox);

      // Deep clone and style processing
      const cloneNode = chatContainer.cloneNode(true);
      cloneNode.style.cssText = `
          width: 800px !important;
          transform: none !important;
          overflow: visible !important;
          position: static !important;
          background: white !important;
          max-height: none !important;
          padding: 20px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
      `;

      // Clean up interfering elements, exclude icons
      ['button', 'input', '.ds-message-feedback-container', '.eb23581b.dfa60d66'].forEach(selector => {
          cloneNode.querySelectorAll(selector).forEach(el => el.remove());
      });

      // Math formula fix
      cloneNode.querySelectorAll('.katex-display').forEach(mathEl => {
          mathEl.style.transform = 'none !important';
          mathEl.style.position = 'relative !important';
      });

      // Inject sandbox
      sandbox.contentDocument.body.appendChild(cloneNode);
      sandbox.contentDocument.body.style.background = 'white';

      // Wait for resources to load
      const waitReady = () => Promise.all([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 300))]);

      waitReady().then(() => {
          return html2canvas(cloneNode, {
              scale: 2,
              useCORS: true,
              logging: true,
              backgroundColor: "#FFFFFF"
          });
      }).then(canvas => {
          canvas.toBlob(blob => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${config.exportFileName}_${getFormattedTimestamp()}.png`;
              a.click();
              setTimeout(() => {
                  URL.revokeObjectURL(url);
                  sandbox.remove();
              }, 1000);
          }, 'image/png');
      }).catch(err => {
          console.error('Screenshot failed:', err);
          alert(`Export failed: ${err.message}`);
      }).finally(() => {
          __exportPNGLock = false;
      });
  }

  // =====================
  // Create Export Menu
  // =====================
  /**
   * Creates and attaches the export menu buttons to the page
   */
  function createExportMenu() {
      // Create main menu
      const menu = document.createElement("div");
      menu.className = "ds-exporter-menu";
      menu.innerHTML = `
          <button class="export-btn" id="md-btn" title="Export as Markdown">➡️📝</button>
          <button class="export-btn" id="pdf-btn" title="Print to PDF">➡️🖨️</button>
          <button class="export-btn" id="png-btn" title="Export as Image">➡️🖼️</button>
          <button class="settings-btn" id="settings-btn" title="Settings">⚙️</button>
      `;

      // Create settings panel
      const settingsPanel = document.createElement("div");
      settingsPanel.className = "ds-settings-panel";
      settingsPanel.innerHTML = `
          <div class="ds-settings-row">
              <label class="switch">
                  <input type="checkbox" id="latex-toggle" ${preferences.convertLatexDelimiters ? 'checked' : ''}>
                  <span class="slider"></span>
              </label>
              <span>Convert to $ LaTeX Delimiters</span>
          </div>
      `;

      // Add event listeners
      menu.querySelector("#md-btn").addEventListener("click", exportMarkdown);
      menu.querySelector("#pdf-btn").addEventListener("click", exportPDF);
      menu.querySelector("#png-btn").addEventListener("click", exportPNG);

      // Settings button toggle
      menu.querySelector("#settings-btn").addEventListener("click", () => {
          settingsPanel.classList.toggle("visible");
      });

      // LaTeX toggle switch
      settingsPanel.querySelector("#latex-toggle").addEventListener("change", (e) => {
          preferences.convertLatexDelimiters = e.target.checked;
          GM_setValue('convertLatexDelimiters', e.target.checked);
      });

      // Close settings when clicking outside
      document.addEventListener("click", (e) => {
          if (!settingsPanel.contains(e.target) &&
              !menu.querySelector("#settings-btn").contains(e.target)) {
              settingsPanel.classList.remove("visible");
          }
      });

      document.body.appendChild(menu);
      document.body.appendChild(settingsPanel);
  }

  // =====================
  // Styles
  // =====================
  GM_addStyle(`
  .ds-exporter-menu {
      position: fixed;
      top: 10px;
      right: 25px;
      z-index: 999999;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
  }

  .export-btn {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 4px 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      min-width: 45px;
  }

  .export-btn:hover {
      background: #e9ecef;
  }

  .export-btn:active {
      background: #dee2e6;
  }

  /* Settings panel styles */
  .ds-settings-panel {
      position: fixed;
      top: 10px;
      right: 95px;
      z-index: 999998;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 12px;
      display: none;
      color: #333;
      min-width: 200px;
  }

  .ds-settings-panel.visible {
      display: block;
  }

  .ds-settings-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 4px 0;
      color: #333;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      white-space: nowrap;
  }

  /* Toggle switch styles */
  .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
  }

  .switch input {
      opacity: 0;
      width: 0;
      height: 0;
  }

  .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 20px;
  }

  .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
  }

  input:checked + .slider {
      background-color: #2196F3;
  }

  input:checked + .slider:before {
      transform: translateX(20px);
  }

  .settings-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      font-size: 16px;
      color: #666;
  }

  .settings-btn:hover {
      color: #333;
  }
`);

  // =====================
  // Initialize
  // =====================
  /**
   * Initializes the exporter by waiting for the chat container to be ready
   * and then creating the export menu
   */
  function init() {
      const checkInterval = setInterval(() => {
          if (document.querySelector(config.chatContainerSelector)) {
              clearInterval(checkInterval);
              createExportMenu();
          }
      }, 500);
  }

  init();
})();
