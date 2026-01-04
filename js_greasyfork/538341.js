// ==UserScript==
// @name         Econea Utils
// @namespace    https://econea.cz/
// @version      1.4.0
// @description  Replaces specified Shopify metafield editors with Suneditor WYSIWYG editor etc.
// @author       Stepan
// @match        https://*.myshopify.com/admin/*
// @match        https://admin.shopify.com/store/*
// @require      https://cdn.jsdelivr.net/npm/suneditor@2.47.7/dist/suneditor.min.js
// @require      https://cdn.jsdelivr.net/npm/suneditor@2.47.7/src/lang/cs.js
// @resource     SuneditorCSS https://cdn.jsdelivr.net/npm/suneditor@2.47.7/dist/css/suneditor.min.css
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538341/Econea%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/538341/Econea%20Utils.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    targetMetafields: {
      ids: [
        '256299762003',
        '171702452563',
      ],
    },

    // Enable debug logging
    debug: true,

    editorConfig: {
      strictMode: true,
      addTagsWhitelist: ".+",
      pasteTagsWhitelist: ".+",
      tagsBlacklist: "script",
      pasteTagsBlacklist: "script",
      attributesWhitelist: {
        all: ".+",
      },
      attributesBlacklist: {
        // Suneditor automatically wraps inline copy/pasted content in a `span` component with a `style` attribute.
        // By blacklisting the `style` attribute on `span` components, it adds a "blank" span which it automatically discards afterwards. Problem solved.
        span: "style",
      },
      minHeight: '300px',
      maxHeight: '600px',
      height: '300px',
      placeholder: '',
      buttonList: [
        ['formatBlock'],
        ['bold', 'italic', 'underline', 'fontColor'],
        ['align'],
        ['link', 'image', 'video', 'table'],
        ['list', 'outdent', 'indent'],
        ['removeFormat'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview', 'print'],
      ],
      formats: [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
      ],
      font: null,
      fullScreenOffset: "60",
      popupDisplay: "local",
      historyStackDelayTime: 0,
    },
  };

  let processedElements = new Set();
  let observer;
  let suneditorInstances = new Map();
  let suneditorReady = false;
  let initAttempts = 0;
  const MAX_INIT_ATTEMPTS = 20;

  function log(...args) {
    if (CONFIG.debug) {
      console.log('[Shopify WYSIWYG]', ...args);
    }
  }

  function logError(...args) {
    if (CONFIG.debug) {
      console.error('[Shopify WYSIWYG]', ...args);
    }
  }

  function checkSuneditorAvailability() {
    return new Promise((resolve) => {
      const checkSuneditor = () => {
        // Check if Suneditor is available
        let editorReady = false;
        let editorLangReady = false;
        if (typeof window.SUNEDITOR !== 'undefined' && window.SUNEDITOR) {
          log('Suneditor detected and ready');
          editorReady = true;
        }

        if (typeof window.SUNEDITOR_LANG !== 'undefined' && window.SUNEDITOR_LANG) {
          log('Suneditor lang detected and ready');
          editorLangReady = true;
        }

        if (editorReady && editorLangReady) {
          resolve(true);
          return;
        }

        initAttempts++;
        if (initAttempts < MAX_INIT_ATTEMPTS) {
          log(`Suneditor check attempt ${initAttempts}/${MAX_INIT_ATTEMPTS}...`);
          setTimeout(checkSuneditor, 500);
        } else {
          log('Max attempts reached, Suneditor not available');
          resolve(false);
        }
      };

      checkSuneditor();
    });
  }

  function isProductPage() {
    const url = window.location.href;
    return url.includes('/products/') &&
      (url.includes('myshopify.com/admin') || url.includes('admin.shopify.com'));
  }

  // Enhanced metafield detection using the exact DOM structure
  function findMetafieldElements() {
    const elements = [];

    // Look for the specific structure from your DOM
    const metafieldRows = document.querySelectorAll('div._RowWrapper_xxurb_22');

    metafieldRows.forEach(row => {
      try {
        // Find the metafield link to get ID and name
        const link = row.querySelector('a[href*="/metafields/"]');
        if (!link) return;

        const href = link.getAttribute('href');
        const metafieldId = href.match(/metafields\/(\d+)/)?.[1];
        const metafieldName = link.textContent.trim();

        // Find the textarea in this row
        const textarea = row.querySelector('textarea.Polaris-TextField__Input[aria-multiline="true"]');
        if (!textarea || processedElements.has(textarea)) return;

        // Check if this metafield should be targeted
        const shouldTarget = shouldTargetMetafield(metafieldId, metafieldName);

        if (shouldTarget) {
          elements.push({
            textarea: textarea,
            metafieldId: metafieldId,
            metafieldName: metafieldName,
            row: row
          });
          log('Found target metafield:', metafieldName, 'ID:', metafieldId);
        }
      } catch (error) {
        logError('Error processing metafield row:', error);
      }
    });

    return elements;
  }

  function shouldTargetMetafield(id, name) {
    const {
      ids,
    } = CONFIG.targetMetafields;

    // If targeting specific IDs
    if (ids.length > 0 && ids.includes(id)) {
      return true;
    }

    return false;
  }

  function createWYSIWYGEditor(metafieldData) {
    try {
      const {
        textarea,
        metafieldId,
        metafieldName,
        row
      } = metafieldData;

      log('Creating WYSIWYG for:', metafieldName, 'ID:', metafieldId);

      // Find the TextField container
      const textFieldContainer = textarea.closest('.Polaris-TextField');
      if (!textFieldContainer) {
        log('Could not find TextField container');
        return null;
      }

      // Create wrapper with Shadow DOM
      const editorWrapper = document.createElement('div');
      editorWrapper.className = 'wysiwyg-editor-wrapper';
      editorWrapper.style.position = 'relative';

      const keyHandler = (e) => {
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowUp":
          case "ArrowRight":
          case "ArrowDown":
            break;
          default:
            // Prevent Shopify keyboard shortcuts from triggering when interacting with the WYSIWYG editor.
            e.stopPropagation();
            break;
        }
      };

      editorWrapper.addEventListener("keydown", (e) => {
        keyHandler(e);
      }, true);
      editorWrapper.addEventListener("keyup", (e) => {
        keyHandler(e);
      }, true);

      // Create Shadow DOM for style isolation
      const shadowRoot = editorWrapper.attachShadow({ mode: 'open' });

      // Add custom styles to Shadow DOM
      const customStyles = document.createElement('style');
      customStyles.textContent = `
        .sun-editor {
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          background: white !important;
        }
        .se-toolbar {
          border-bottom: 1px solid #d1d5db !important;
          background: #f9fafb !important;
          padding: 8px 12px !important;
        }

        /* Match Shopify Admin UI font */
        .sun-editor-editable {
          font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif !important;
          line-height: 1.4 !important;
          font-size: 0.875rem !important;
        }
      `;
      // place at the top of the shadow root
      shadowRoot.insertBefore(customStyles, shadowRoot.firstChild);

      const styleEl = document.createElement('style');
      styleEl.textContent = GM_getResourceText('SuneditorCSS');
      // place at the top of the shadow root
      shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);

      // Create editor div inside shadow DOM
      const editorId = 'wysiwyg-' + metafieldId + '-' + Date.now();
      const editorDiv = document.createElement('div');
      editorDiv.id = editorId;

      shadowRoot.appendChild(editorDiv);

      // Replace the TextField but keep the original hidden
      textFieldContainer.parentNode.insertBefore(editorWrapper, textFieldContainer);
      textFieldContainer.style.display = 'none';

      // Store references
      editorWrapper.originalElement = textarea;
      editorWrapper.originalContainer = textFieldContainer;
      processedElements.add(textarea);

      // Get initial content
      const initialContent = textarea.value || '';
      let hasInitialContent = false;

      if (initialContent && initialContent.trim()) {
        hasInitialContent = true;
      }

      // Initialize Suneditor
      let editor;
      try {
        // Clone the config and set up callbacks for this instance
        const instanceConfig = Object.assign({}, CONFIG.editorConfig);

        const syncContent = (triggerReactOnChange) => {
          try {
            const content = editor.getContents();

            // Check if content is just empty paragraph(s) - don't sync these
            const isEmpty = !content ||
              content.trim() === '<p><br></p>' ||
              content.trim() === '<p></p>' ||
              content.trim() === '' ||
              editor.util.onlyZeroWidthSpace(content);

            // Update the original textarea
            const oldValue = textarea.value;
            const newValue = isEmpty ? '' : content;

            // Only trigger events if content actually changed AND it's not just empty formatting
            if ((oldValue !== newValue || triggerReactOnChange) && (hasInitialContent || !isEmpty)) {
              textarea.value = newValue;

              if (triggerReactOnChange) {
                // Also try to trigger Shopify React change detection
                const reactProps = Object.keys(textarea).find(key => key.startsWith('__react'));
                if (reactProps) {
                  const reactInternalInstance = textarea[reactProps];
                  if (reactInternalInstance && reactInternalInstance.memoizedProps && reactInternalInstance.memoizedProps.onChange) {
                    try {
                      reactInternalInstance.memoizedProps.onChange({
                        target: textarea,
                        currentTarget: textarea
                      });
                    } catch (e) {
                      logError('React onChange trigger failed:', e);
                    }
                  }
                }
              }

              console.dir({
                before: oldValue,
                after: newValue,
              }, {depth:3});

              log('Content synced for:', metafieldName, 'Length:', newValue.length);
            }
          } catch (error) {
            logError('Error syncing content:', error);
          }
        };

        // Initialize Suneditor
        instanceConfig.lang = SUNEDITOR_LANG.cs;
        editor = SUNEDITOR.create(editorDiv, instanceConfig);

        editor.onChange = (contents, core) => {
          log("onChange");
          syncContent(true);
        };

        editor.onBlur = (e, core) => {
          log("onBlur");
          syncContent(true);
        };

        // Set initial content after initialization
        if (hasInitialContent) {
          try {
            editor.setContents(initialContent);
          } catch (e) {
            logError('Error setting initial content:', e);
          }
        }

        // Focus editor
        requestAnimationFrame(() => {
          editor.core.focus();
        });

      } catch (error) {
        logError('Failed to create Suneditor instance:', error);
        // Restore original element
        textFieldContainer.style.display = '';
        editorWrapper.remove();
        processedElements.delete(textarea);
        return null;
      }

      suneditorInstances.set(editorId, {
        editor: editor,
        originalTextarea: textarea,
        metafieldName: metafieldName
      });

      log('WYSIWYG editor created successfully for:', metafieldName);
      return editorWrapper;

    } catch (error) {
      logError('Failed to create WYSIWYG editor:', error);
      if (metafieldData.textarea) {
        processedElements.delete(metafieldData.textarea);
      }
      return null;
    }
  }

  async function processMetafields() {
    try {
      if (!isProductPage()) {
        log('Not on product page, skipping...');
        return;
      }

      if (!suneditorReady) {
        log('Suneditor not ready yet, checking availability...');
        suneditorReady = await checkSuneditorAvailability();
        if (!suneditorReady) {
          log('Suneditor failed to load properly');
          return;
        }
      }

      log('Processing metafields...');
      const metafieldElements = findMetafieldElements();
      let processedCount = 0;

      for (const metafieldData of metafieldElements) {
        try {
          const result = createWYSIWYGEditor(metafieldData);
          if (result) {
            processedCount++;
          }
        } catch (error) {
          logError('Failed to create editor for metafield:', error);
        }
      }

      log(`Successfully processed ${processedCount} metafield(s)`);
    } catch (error) {
      logError('Error in processMetafields:', error);
    }
  }

  let processTimeout;
  function debouncedProcess() {
    clearTimeout(processTimeout);
    processTimeout = setTimeout(processMetafields, 50);
  }

  // Setup observer for dynamic content
  function setupObserver() {
    try {
      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
          // Only check childList mutations for efficiency
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if this node or its descendants contain metafield elements
                if (node.matches && (
                    node.matches('div._RowWrapper_xxurb_22') ||
                    node.matches('a[href*="/metafields/"]') ||
                    node.matches('textarea[aria-multiline="true"]')
                  )) {
                  shouldProcess = true;
                  break;
                } else if (node.querySelector && (
                    node.querySelector('div._RowWrapper_xxurb_22') ||
                    node.querySelector('a[href*="/metafields/"]') ||
                    node.querySelector('textarea[aria-multiline="true"]')
                  )) {
                  shouldProcess = true;
                  break;
                }
              }
            }
            if (shouldProcess) break;
          }
        }

        if (shouldProcess) {
          log('DOM changes detected, reprocessing...');
          debouncedProcess();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        // Only observe what we need
        attributes: false,
        attributeOldValue: false,
        characterData: false,
        characterDataOldValue: false
      });

      log('Observer set up successfully');
    } catch (error) {
      logError('Error setting up observer:', error);
    }
  }

  // Initialize the script
  async function initialize() {
    try {
      if (!isProductPage()) return;

      log('Initializing Shopify Metafield WYSIWYG Editor...');
      log('Target config:', CONFIG.targetMetafields);

      // Wait for Suneditor to be ready
      suneditorReady = await checkSuneditorAvailability();

      if (suneditorReady) {
        log('Suneditor is ready, processing metafields...');
        setTimeout(processMetafields, 30);
        setTimeout(processMetafields, 350); // Backup processing
        setupObserver();
      } else {
        log('Failed to initialize: Suneditor not available');
      }
    } catch (error) {
      logError('Error in initialize:', error);
    }
  }

  // Handle page navigation
  let currentUrl = window.location.href;

  function handleUrlChange() {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      log('URL changed, reinitializing...');

      // Clean up
      processedElements.clear();
      if (observer) observer.disconnect();
      suneditorInstances.forEach((instance, id) => {
        try {
          instance.editor.destroy();
        } catch (e) {
          logError(e);
        }
      });
      suneditorInstances.clear();
      suneditorReady = false;
      initAttempts = 0;

      // Reinitialize
      setTimeout(initialize, 1000);
    }
  }

  setInterval(handleUrlChange, 1000);

  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    setTimeout(initialize, 1000);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    try {
      if (observer) observer.disconnect();
      suneditorInstances.forEach((instance) => {
        try {
          instance.editor.destroy();
        } catch (e) {
          logError(e);
        }
      });
      suneditorInstances.clear();
    } catch (error) {
      logError('Error during cleanup:', error);
    }
  });

  log('Shopify Metafield WYSIWYG Editor script loaded successfully');
})();
