// ==UserScript==
// @name         Text Explainer
// @namespace    http://tampermonkey.net/
// @version      0.2.14
// @description  Explain selected text using LLM
// @author       RoCry
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAxOTIgMTkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiPjxjaXJjbGUgY3g9IjExNiIgY3k9Ijc2IiByPSI1NCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEyIi8+PHBhdGggc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMTIiIGQ9Ik04Ni41IDEyMS41IDQxIDE2N2MtNC40MTggNC40MTgtMTEuNTgyIDQuNDE4LTE2IDB2MGMtNC40MTgtNC40MTgtNC40MTgtMTEuNTgyIDAtMTZsNDQuNS00NC41TTkyIDYybDEyIDMyIDEyLTMyIDEyIDMyIDEyLTMyIi8+PC9zdmc+
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-end
// @inject-into  content
// @require      https://update.greasyfork.org/scripts/528704/1549030/SmolLLM.js
// @require      https://update.greasyfork.org/scripts/528703/1546610/SimpleBalancer.js
// @require      https://update.greasyfork.org/scripts/528763/1549028/Text%20Explainer%20Settings.js
// @require      https://update.greasyfork.org/scripts/528822/1547803/Selection%20Context.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.user.js
// @updateURL https://update.greasyfork.org/scripts/528810/Text%20Explainer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Initialize settings manager with extended default config
  const settingsManager = new TextExplainerSettings({
    model: "gemini-2.0-flash",
    apiKey: null,
    baseUrl: "https://generativelanguage.googleapis.com",
    provider: "gemini",
    language: "Chinese", // Default language
    shortcut: {
      key: "d",
      ctrlKey: false,
      altKey: true,
      shiftKey: false,
      metaKey: false
    },
    floatingButton: {
      enabled: true,
      size: "medium",
      position: "bottom-right"
    },
  });

  // Get current configuration
  let config = settingsManager.getAll();

  // Initialize SmolLLM
  let llm;
  try {
    llm = new SmolLLM();
  } catch (error) {
    console.error('Failed to initialize SmolLLM:', error);
    llm = null;
  }

  // Check if device is touch-enabled
  const isTouchDevice = () => {
    return ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);
  };

  // Create and manage floating button
  let floatingButton = null;
  let isProcessingText = false;

  function createFloatingButton() {
    if (floatingButton) return;

    floatingButton = document.createElement('div');
    floatingButton.id = 'explainer-floating-button';

    // Determine size based on settings
    let buttonSize;
    switch (config.floatingButton.size) {
      case 'small': buttonSize = '40px'; break;
      case 'large': buttonSize = '60px'; break;
      default: buttonSize = '50px'; // medium
    }

    floatingButton.style.cssText = `
      width: ${buttonSize};
      height: ${buttonSize};
      border-radius: 50%;
      background-color: rgba(33, 150, 243, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      font-weight: bold;
      font-size: ${parseInt(buttonSize) * 0.4}px;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.2s ease;
      pointer-events: none;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    `;

    // Add icon or text
    floatingButton.innerHTML = '💬';

    // Add to DOM
    document.body.appendChild(floatingButton);

    // Handle button click/tap
    function handleButtonAction(e) {
      e.preventDefault();
      e.stopPropagation();

      // Prevent multiple clicks while processing
      if (isProcessingText) return;

      // Get selection context before clearing selection
      const selectionContext = GetSelectionContext();

      if (!selectionContext.selectedText) {
        console.log('No valid selection to process');
        return;
      }

      // Set processing flag
      isProcessingText = true;

      // Hide the floating button
      hideFloatingButton();

      // Blur selection to dismiss iOS menu
      window.getSelection().removeAllRanges();

      // Now trigger the explainer with the stored selection
      // Create popup
      createPopup();
      const contentDiv = document.getElementById('explainer-content');
      const loadingDiv = document.getElementById('explainer-loading');
      const errorDiv = document.getElementById('explainer-error');

      // Reset display
      errorDiv.style.display = 'none';
      loadingDiv.style.display = 'block';

      // Assemble prompt with language preference
      const { prompt, systemPrompt } = getPrompt(
        selectionContext.selectedText,
        selectionContext.paragraphText,
        selectionContext.textBefore,
        selectionContext.textAfter
      );

      // Variable to store ongoing response text
      let responseText = '';

      // Call LLM with progress callback
      callLLM(prompt, systemPrompt, (textChunk, currentFullText) => {
        // Update response text with new chunk
        responseText = currentFullText || (responseText + textChunk);

        // Hide loading message if this is the first chunk
        if (loadingDiv.style.display !== 'none') {
          loadingDiv.style.display = 'none';
        }

        // Update content with either HTML or markdown
        updateContentDisplay(contentDiv, responseText);
      })
        .catch(error => {
          console.error('Error in LLM call:', error);
          errorDiv.textContent = error.message || 'Error processing request';
          errorDiv.style.display = 'block';
          loadingDiv.style.display = 'none';
        })
        .finally(() => {
          // Reset processing flag
          setTimeout(() => {
            isProcessingText = false;
          }, 1000);
        });
    }

    // Add click event
    floatingButton.addEventListener('click', handleButtonAction);

    // Add touch events
    floatingButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      floatingButton.style.transform = 'scale(0.95)';
    }, { passive: false });

    floatingButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      floatingButton.style.transform = 'scale(1)';
      handleButtonAction(e);
    }, { passive: false });

    // Prevent text selection on button
    floatingButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  function showFloatingButton() {
    if (!floatingButton || !config.floatingButton.enabled || isProcessingText) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      hideFloatingButton();
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Calculate position near the selection
    const buttonSize = parseInt(floatingButton.style.width);
    const margin = 10; // Distance from selection

    // Calculate position in viewport coordinates
    let top = rect.bottom + margin;
    let left = rect.left + (rect.width / 2) - (buttonSize / 2);

    // If button would go off screen, try positioning above
    if (top + buttonSize > window.innerHeight) {
      top = rect.top - buttonSize - margin;
    }

    // Ensure button stays within viewport horizontally
    left = Math.max(10, Math.min(left, window.innerWidth - buttonSize - 10));

    // Apply position (using viewport coordinates for fixed positioning)
    floatingButton.style.top = `${top}px`;
    floatingButton.style.left = `${left}px`;

    // Make visible and enable pointer events
    floatingButton.style.opacity = '1';
    floatingButton.style.pointerEvents = 'auto';
  }

  function hideFloatingButton() {
    if (!floatingButton) return;
    floatingButton.style.opacity = '0';
    floatingButton.style.pointerEvents = 'none';
  }

  // Add minimal styles for UI components
  GM_addStyle(`
    /* Base popup styles */
    #explainer-popup {
        position: absolute;
        width: 450px;
        max-width: 90vw;
        max-height: 80vh;
        padding: 20px;
        z-index: 2147483647;
        overflow: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        
        /* Visual styles */
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 0, 0, 0.15);
        
        /* Text styles */
        color: #111;
        text-shadow: 0 0 1px rgba(255, 255, 255, 0.3);
        
        /* Animations */
        transition: all 0.3s ease;
    }
    
    /* Dark theme */
    #explainer-popup.dark-theme {
        background: rgba(45, 45, 50, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: #e0e0e0;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    }
    
    /* iOS-specific overrides */
    @supports (-webkit-touch-callout: none) {
        #explainer-popup {
            background: rgba(255, 255, 255, 0.98);
            /* Disable backdrop-filter on iOS for better performance */
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
        }
        
        #explainer-popup.dark-theme {
            background: rgba(35, 35, 40, 0.98);
        }
    }

    @keyframes slideInFromTop {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideInFromBottom {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideInFromLeft {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInFromRight {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    #explainer-loading {
        text-align: center;
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #explainer-loading:after {
        content: "";
        width: 24px;
        height: 24px;
        border: 3px solid #ddd;
        border-top: 3px solid #2196F3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    #explainer-error {
        color: #d32f2f;
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 14px;
        display: none;
    }
    /* iOS-specific styles */
    @supports (-webkit-touch-callout: none) {
        #explainer-popup {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        /* Dark mode for iOS */
        @media (prefers-color-scheme: dark) {
            #explainer-popup {
                background: rgba(35, 35, 40, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
    }
    /* Dark mode support - minimal */
    @media (prefers-color-scheme: dark) {
        #explainer-popup {
            background: rgba(35, 35, 40, 0.85);
            color: #e0e0e0;
        }
        #explainer-error {
            background-color: rgba(100, 25, 25, 0.4);
            color: #ff8a8a;
        }
        #explainer-floating-button {
            background-color: rgba(33, 150, 243, 0.9);
        }
    }
    /* Add touch-specific styles */
    @media (hover: none) and (pointer: coarse) {
        #explainer-popup {
            width: 95vw;
            max-height: 90vh;
            padding: 15px;
            font-size: 16px;
        }
        #explainer-popup p, 
        #explainer-popup li {
            line-height: 1.6;
            margin-bottom: 12px;
        }
        #explainer-popup a {
            padding: 8px 0;
        }
    }
  `);

  // Function to detect if the page has a dark background
  function isPageDarkMode() {
    // Try to get the background color of the body or html element
    const bodyEl = document.body;
    const htmlEl = document.documentElement;

    // Get computed style
    const bodyStyle = window.getComputedStyle(bodyEl);
    const htmlStyle = window.getComputedStyle(htmlEl);

    // Extract background color
    const bodyBg = bodyStyle.backgroundColor;
    const htmlBg = htmlStyle.backgroundColor;

    // Parse RGB values
    function getRGBValues(color) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (!match) return null;

      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);

      return { r, g, b };
    }

    // Calculate luminance (brightness) - higher values are brighter
    function getLuminance(color) {
      const rgb = getRGBValues(color);
      if (!rgb) return 128; // Default to middle gray if can't parse

      // Perceived brightness formula
      return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    }

    const bodyLuminance = getLuminance(bodyBg);
    const htmlLuminance = getLuminance(htmlBg);

    // If either background is dark, consider the page dark
    const threshold = 128; // Middle of 0-255 range

    // Check system preference as a fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Page is dark if:
    // 1. Body background is dark, or
    // 2. HTML background is dark and body has no background set, or
    // 3. Both have no background set but system prefers dark
    if (bodyLuminance < threshold) {
      return true;
    } else if (bodyBg === 'rgba(0, 0, 0, 0)' && htmlLuminance < threshold) {
      return true;
    } else if (bodyBg === 'rgba(0, 0, 0, 0)' && htmlBg === 'rgba(0, 0, 0, 0)') {
      return prefersDark;
    }

    return false;
  }

  // Function to close the popup
  function closePopup() {
    const popup = document.getElementById('explainer-popup');
    if (popup) {
      popup.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        popup.remove();
        const overlay = document.getElementById('explainer-overlay');
        if (overlay) {
          overlay.remove();
        }
      }, 300);
    }

    // Always clean up the global variables from previous implementation
    if (window.explainerTouchTracker) {
      window.explainerTouchTracker = null;
    }
  }

  // Calculate optimal popup position based on selection
  function calculatePopupPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    // Get selection position
    const range = selection.getRangeAt(0);
    const selectionRect = range.getBoundingClientRect();

    // Get scroll position to convert viewport coordinates to absolute
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Get document dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate popup dimensions (will be adjusted once created)
    const popupWidth = 450;
    const popupHeight = Math.min(500, viewportHeight * 0.8);

    // Calculate optimal position
    let position = {};

    // Default margin from selection
    const margin = 20;

    // Try to position below the selection
    if (selectionRect.bottom + margin + popupHeight <= viewportHeight) {
      position.top = selectionRect.bottom + scrollTop + margin;
      position.left = Math.min(
        Math.max(10 + scrollLeft, selectionRect.left + scrollLeft + (selectionRect.width / 2) - (popupWidth / 2)),
        viewportWidth + scrollLeft - popupWidth - 10
      );
      position.placement = 'below';
    }
    // Try to position above the selection
    else if (selectionRect.top - margin - popupHeight >= 0) {
      position.top = selectionRect.top + scrollTop - margin - popupHeight;
      position.left = Math.min(
        Math.max(10 + scrollLeft, selectionRect.left + scrollLeft + (selectionRect.width / 2) - (popupWidth / 2)),
        viewportWidth + scrollLeft - popupWidth - 10
      );
      position.placement = 'above';
    }
    // Try to position to the right
    else if (selectionRect.right + margin + popupWidth <= viewportWidth) {
      position.top = Math.max(10 + scrollTop, Math.min(
        selectionRect.top + scrollTop,
        viewportHeight + scrollTop - popupHeight - 10
      ));
      position.left = selectionRect.right + scrollLeft + margin;
      position.placement = 'right';
    }
    // Try to position to the left
    else if (selectionRect.left - margin - popupWidth >= 0) {
      position.top = Math.max(10 + scrollTop, Math.min(
        selectionRect.top + scrollTop,
        viewportHeight + scrollTop - popupHeight - 10
      ));
      position.left = selectionRect.left + scrollLeft - margin - popupWidth;
      position.placement = 'left';
    }
    // Fallback to centered position if no good placement found
    else {
      position.top = Math.max(10 + scrollTop, Math.min(
        selectionRect.top + selectionRect.height + scrollTop + margin,
        viewportHeight / 2 + scrollTop - popupHeight / 2
      ));
      position.left = Math.max(10 + scrollLeft, Math.min(
        selectionRect.left + selectionRect.width / 2 + scrollLeft - popupWidth / 2,
        viewportWidth + scrollLeft - popupWidth - 10
      ));
      position.placement = 'center';
    }

    return position;
  }

  // Create popup
  function createPopup() {
    // Remove existing popup if any
    closePopup();

    const popup = document.createElement('div');
    popup.id = 'explainer-popup';

    // Add dark-theme class if the page has a dark background
    if (isPageDarkMode()) {
      popup.classList.add('dark-theme');
    }

    popup.innerHTML = `
      <div id="explainer-error"></div>
      <div id="explainer-loading"></div>
      <div id="explainer-content"></div>
    `;

    document.body.appendChild(popup);

    // For touch devices, use fixed positioning with transform
    if (isTouchDevice()) {
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.width = '90vw';
      popup.style.maxHeight = '85vh';
    } else {
      // Desktop positioning logic
      const position = calculatePopupPosition();
      if (position) {
        popup.style.transform = 'none';
        if (position.top !== undefined) popup.style.top = `${position.top}px`;
        if (position.bottom !== undefined) popup.style.bottom = `${position.bottom}px`;
        if (position.left !== undefined) popup.style.left = `${position.left}px`;
        if (position.right !== undefined) popup.style.right = `${position.right}px`;
      } else {
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
      }
    }

    // Add animation
    popup.style.animation = 'fadeIn 0.3s ease';

    // Add event listeners
    document.addEventListener('keydown', handleEscKey);

    // Use a simpler approach for touch devices - attach a click/touch handler directly
    if (isTouchDevice()) {
      // Create an overlay for capturing outside touches
      const overlay = document.createElement('div');
      overlay.id = 'explainer-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: ${parseInt(popup.style.zIndex || 2147483647) - 1};
        background: transparent;
      `;
      document.body.appendChild(overlay);

      // Handle iPad-specific touch behavior
      let touchStarted = false;
      let startX = 0;
      let startY = 0;

      // Higher threshold for iPad - more forgiving for slight movements
      const moveThreshold = 30; // pixels

      overlay.addEventListener('touchstart', (e) => {
        touchStarted = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });

      overlay.addEventListener('touchmove', () => {
        // Just having a touchmove listener prevents default behavior on iOS
      }, { passive: true });

      overlay.addEventListener('touchend', (e) => {
        if (!touchStarted) return;

        const touch = e.changedTouches[0];
        const moveX = Math.abs(touch.clientX - startX);
        const moveY = Math.abs(touch.clientY - startY);

        // If user didn't move much, consider it a tap to dismiss
        if (moveX < moveThreshold && moveY < moveThreshold) {
          closePopup();
          removeAllPopupListeners();
        }

        touchStarted = false;
      }, { passive: true });

      // Prevent popup from capturing overlay events
      popup.addEventListener('touchstart', (e) => {
        e.stopPropagation();
      }, { passive: false });

    } else {
      document.addEventListener('click', handleOutsideClick);
    }

    return popup;
  }

  // Handle Escape key to close popup
  function handleEscKey(e) {
    if (e.key === 'Escape') {
      closePopup();
      removeAllPopupListeners();
    }
  }

  // For desktop - more straightforward approach
  function handleOutsideClick(e) {
    const popup = document.getElementById('explainer-popup');
    if (!popup || popup.contains(e.target)) return;

    closePopup();
    removeAllPopupListeners();
  }

  // Clean up all event listeners
  function removeAllPopupListeners() {
    document.removeEventListener('keydown', handleEscKey);

    // Only remove click listener if we're not on a touch device
    if (!isTouchDevice()) {
      document.removeEventListener('click', handleOutsideClick);
    }

    const overlay = document.getElementById('explainer-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  // Function to show an error in the popup
  function showError(message) {
    const errorDiv = document.getElementById('explainer-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      document.getElementById('explainer-loading').style.display = 'none';
    }
  }

  // Function to call the LLM using SmolLLM
  async function callLLM(prompt, systemPrompt, progressCallback) {
    if (!config.apiKey) {
      throw new Error("Please set up your API key in the settings.");
    }

    if (!llm) {
      throw new Error("SmolLLM library not initialized. Please check console for errors.");
    }

    console.log(`prompt: ${prompt}`);
    console.log(`systemPrompt: ${systemPrompt}`);
    try {
      return await llm.askLLM({
        prompt: prompt,
        systemPrompt: systemPrompt,
        model: config.model,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        providerName: config.provider,
        handler: progressCallback,
        timeout: 60000
      });
    } catch (error) {
      console.error('LLM API error:', error);
      throw error;
    }
  }

  function getPrompt(selectedText, paragraphText, textBefore, textAfter) {
    const wordsCount = selectedText.split(' ').length;
    const systemPrompt = `Respond in ${config.language} with HTML tags to improve readability.
- Prioritize clarity and conciseness
- Use bullet points when appropriate`;

    if (wordsCount >= 500) {
      return {
        prompt: `Create a structured summary in ${config.language}:
- Identify key themes and concepts
- Extract 3-5 main points
- Use nested <ul> lists for hierarchy
- Keep bullets concise

for the following selected text:
\n\n${selectedText}
`,
        systemPrompt
      };
    }

    // For short text that looks like a sentence, offer translation
    if (wordsCount >= 5) {
      return {
        prompt: `Translate exactly to ${config.language} without commentary:
- Preserve technical terms and names
- Maintain original punctuation
- Match formal/informal tone of source

for the following selected text:
\n\n${selectedText}
`,
        systemPrompt
      };
    }

    const pinYinExtraPrompt = config.language === "Chinese" ? ' DO NOT add Pinyin for it.' : '';
    const ipaExtraPrompt = config.language === "Chinese" ? '(with IPA if necessary)' : '';
    const asciiChars = selectedText.replace(/[\s\.,\-_'"!?()]/g, '')
      .split('')
      .filter(char => char.charCodeAt(0) <= 127).length;
    const sampleSentenceLanguage = selectedText.length === asciiChars ? "English" : config.language;

    // If we have context before/after, include it in the prompt
    const contextPrompt = textBefore || textAfter ?
      `# Context:
## Before selected text:
${textBefore || 'None'}
## Selected text:
${selectedText}
## After selected text:
${textAfter || 'None'}` : paragraphText;


    // Explain words prompt
    return {
      prompt: `Provide an explanation for the word: "${selectedText}${ipaExtraPrompt}" in ${config.language} without commentary.${pinYinExtraPrompt}

Use the context from the surrounding paragraph to inform your explanation when relevant:

${contextPrompt}

# Consider these scenarios:

## Names
If "${selectedText}" is a person's name, company name, or organization name, provide a brief description (e.g., who they are or what they do).
e.g.
Alan Turing was a British mathematician and computer scientist. He is widely considered to be the father of theoretical computer science and artificial intelligence.
His work was crucial to:
	•	Formalizing the concepts of algorithm and computation with the Turing machine.
	•	Breaking the German Enigma code during World War II, significantly contributing to the Allied victory.
	•	Developing the Turing test, a benchmark for artificial intelligence.


## Technical Terms
If "${selectedText}" is a technical term or jargon
- give a concise definition and explain.
- Some best practice of using it
- Explain how it works. 
- No need example sentence for the technical term.
e.g. GAN → 生成对抗网络
生成对抗网络(Generative Adversarial Network)，是一种深度学习框架，由Ian Goodfellow在2014年提出。GAN包含两个神经网络：生成器(Generator)和判别器(Discriminator)，它们相互对抗训练。生成器尝试创建看起来真实的数据，而判别器则尝试区分真实数据和生成的假数据。通过这种"博弈"过程，生成器逐渐学会创建越来越逼真的数据。

## Normal Words
- For any other word, explain its meaning and provide 1-2 example sentences with the word in ${sampleSentenceLanguage}.
e.g. jargon \\ˈdʒɑrɡən\\ → 行话，专业术语，特定领域内使用的专业词汇。在计算机科学和编程领域，指那些对外行人难以理解的专业术语和缩写。
例句: "When explaining code to beginners, try to avoid using too much technical jargon that might confuse them."（向初学者解释代码时，尽量避免使用太多可能让他们困惑的技术行话。）

# Format

- Output the words first, then the explanation, and then the example sentences in ${sampleSentenceLanguage} if necessary.
- No extra explanation
- Remember to using proper html format like <p> <b> <i> <a> <li> <ol> <ul> to improve readability.
`,
      systemPrompt
    };
  }

  // Main function to process selected text
  async function processSelectedText() {
    // Use the utility function instead of the local getSelectedText
    const { selectedText, textBefore, textAfter, paragraphText } = GetSelectionContext();

    if (!selectedText) {
      showError('No text selected');
      return;
    }

    console.log(`Selected text: '${selectedText}', Paragraph text:\n${paragraphText}`);
    // Create popup
    createPopup();
    const contentDiv = document.getElementById('explainer-content');
    const loadingDiv = document.getElementById('explainer-loading');
    const errorDiv = document.getElementById('explainer-error');

    // Reset display
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'block';

    // Assemble prompt with language preference
    const { prompt, systemPrompt } = getPrompt(selectedText, paragraphText, textBefore, textAfter);

    // Variable to store ongoing response text
    let responseText = '';

    try {
      // Call LLM with progress callback and await the full response
      const fullResponse = await callLLM(prompt, systemPrompt, (textChunk, currentFullText) => {
        // Update response text with new chunk
        responseText = currentFullText || (responseText + textChunk);

        // Hide loading message if this is the first chunk
        if (loadingDiv.style.display !== 'none') {
          loadingDiv.style.display = 'none';
        }

        // Update content with either HTML or markdown
        updateContentDisplay(contentDiv, responseText);
      });

      console.log('fullResponse\n', fullResponse);

      // If we got a response
      if (fullResponse && fullResponse.length > 0) {
        responseText = fullResponse;
        loadingDiv.style.display = 'none';
        updateContentDisplay(contentDiv, fullResponse);
      }
      // If no response was received at all
      else if (!fullResponse || fullResponse.length === 0) {
        // If we've received chunks but the final response is empty, use the accumulated text
        if (responseText && responseText.length > 0) {
          updateContentDisplay(contentDiv, responseText);
        } else {
          showError("No response received from the model. Please try again.");
        }
      }

      // Hide loading indicator if it's still visible
      if (loadingDiv.style.display !== 'none') {
        loadingDiv.style.display = 'none';
      }
    } catch (error) {
      console.error('Error:', error);
      // Display error in popup
      showError(`Error: ${error.message}`);
    }
  }

  // Main function to handle keyboard shortcuts
  function handleKeyPress(e) {
    // Get shortcut configuration from settings
    const shortcut = config.shortcut || { key: 'd', ctrlKey: false, altKey: true, shiftKey: false, metaKey: false };

    // More robust shortcut detection using both key and code properties
    if (isShortcutMatch(e, shortcut)) {
      e.preventDefault();
      processSelectedText();
    }
  }

  // Helper function for more robust shortcut detection
  function isShortcutMatch(event, shortcutConfig) {
    // Check all modifier keys first
    if (event.ctrlKey !== !!shortcutConfig.ctrlKey ||
      event.altKey !== !!shortcutConfig.altKey ||
      event.shiftKey !== !!shortcutConfig.shiftKey ||
      event.metaKey !== !!shortcutConfig.metaKey) {
      return false;
    }

    const key = shortcutConfig.key.toLowerCase();

    // Method 1: Direct key match (works for most standard keys)
    if (event.key.toLowerCase() === key) {
      return true;
    }

    // Method 2: Key code match (more reliable for letter keys)
    // This handles the physical key position regardless of keyboard layout
    if (key.length === 1 && /^[a-z]$/.test(key) &&
      event.code === `Key${key.toUpperCase()}`) {
      return true;
    }

    // Method 3: Handle known special characters from Option/Alt key combinations
    // These are the most common mappings on macOS when using Option+key
    const macOptionKeyMap = {
      'a': 'å', 'b': '∫', 'c': 'ç', 'd': '∂', 'e': '´', 'f': 'ƒ',
      'g': '©', 'h': '˙', 'i': 'ˆ', 'j': '∆', 'k': '˚', 'l': '¬',
      'm': 'µ', 'n': '˜', 'o': 'ø', 'p': 'π', 'q': 'œ', 'r': '®',
      's': 'ß', 't': '†', 'u': '¨', 'v': '√', 'w': '∑', 'x': '≈',
      'y': '¥', 'z': 'Ω'
    };

    if (shortcutConfig.altKey && macOptionKeyMap[key] === event.key) {
      return true;
    }

    return false;
  }

  // Helper function to update content display
  function updateContentDisplay(contentDiv, text) {
    if (!text) return;

    text = text.trim();
    if (text.length === 0) {
      return;
    }

    try {
      // drop first line if it's a code block
      if (text.startsWith('```')) {
        if (text.endsWith('```')) {
          text = text.split('\n').slice(1, -1).join('\n');
        } else {
          text = text.split('\n').slice(1).join('\n');
        }
      }
      if (!text.startsWith('<')) {
        // fallback
        console.log(`Seems like the response is not HTML: ${text}`);
        text = `<p>${text.replace(/\n/g, '<br>')}</p>`;
      }
      contentDiv.innerHTML = text;
    } catch (e) {
      // Fallback if parsing fails
      console.error(`Error parsing content: ${e.message}`);
      contentDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    }
  }

  // Monitor selection changes for floating button
  function handleSelectionChange() {
    // Don't update button visibility if we're processing text
    if (isProcessingText) return;

    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().trim() !== '';

    if (hasSelection && isTouchDevice() && config.floatingButton.enabled) {
      // Small delay to ensure selection is fully updated
      setTimeout(showFloatingButton, 100);
    } else {
      hideFloatingButton();
    }
  }

  // Settings update callback
  function onSettingsChanged(updatedConfig) {
    config = updatedConfig;
    console.log('Settings updated:', config);

    // Recreate floating button if settings changed
    if (floatingButton) {
      floatingButton.remove();
      floatingButton = null;

      if (isTouchDevice() && config.floatingButton.enabled) {
        createFloatingButton();
        handleSelectionChange(); // Check if there's already a selection
      }
    }
  }

  // Initialize the script
  function init() {
    // Register settings menu in Tampermonkey
    GM_registerMenuCommand("Text Explainer Settings", () => {
      settingsManager.openDialog(onSettingsChanged);
    });

    // Add keyboard shortcut listener
    document.addEventListener('keydown', handleKeyPress);

    // For touch devices, create floating button
    if (isTouchDevice() && config.floatingButton.enabled) {
      createFloatingButton();

      // Monitor text selection
      document.addEventListener('selectionchange', handleSelectionChange);

      // Add touchend handler to show button after selection
      document.addEventListener('touchend', () => {
        // Small delay to ensure selection is updated
        setTimeout(handleSelectionChange, 100);
      });
    }

    console.log('Text Explainer script initialized with language: ' + config.language);
    console.log('Touch device detected: ' + isTouchDevice());
  }

  // Run initialization
  init();
})();
