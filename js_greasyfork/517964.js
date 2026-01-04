// ==UserScript==
// @name         HTML Preview Tool
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Preview HTML code blocks with enhanced security and support for CSS animations
// @author       douCi
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.11/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/517964/HTML%20Preview%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/517964/HTML%20Preview%20Tool.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Waits for DOMPurify to load and returns the DOMPurify instance.
   * @returns {Promise} Promise that resolves with the DOMPurify instance.
   */
  function waitForDOMPurify() {
    return new Promise((resolve) => {
      function check() {
        if (typeof window.DOMPurify !== "undefined") {
          resolve(window.DOMPurify);
        } else {
          setTimeout(check, 100);
        }
      }
      check();
    });
  }

  /**
   * Initializes the HTML Preview Tool.
   */
  async function initializePreviewTool() {
    try {
      // Wait for DOMPurify to load
      const purify = await waitForDOMPurify();
      console.log("[HTML Preview] DOMPurify loaded successfully");

      /**
       * Creates the preview container with sanitized HTML content.
       * @param {string} htmlContent - The HTML content to preview.
       * @returns {HTMLElement} The preview container element.
       */
      function createPreviewContainer(htmlContent) {
        try {
          // Validate HTML content
          if (!htmlContent || typeof htmlContent !== "string") {
            throw new Error("Invalid HTML content");
          }

          const container = document.createElement("div");
          container.className = "preview-container";

          // Add animation frame tracking
          const animationFrames = new Set();
          container.animationFrames = animationFrames;

          // Use Shadow DOM for style isolation
          const shadow = container.attachShadow({ mode: "open" });

          // Create styles
          const style = document.createElement("style");
          style.textContent = `
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }

                        @keyframes fadeOut {
                            from { opacity: 1; transform: translateY(0); }
                            to { opacity: 0; transform: translateY(-10px); }
                        }

                        @keyframes scaleButton {
                            0% { transform: scale(1); }
                            50% { transform: scale(0.95); }
                            100% { transform: scale(1); }
                        }

                        .wrapper {
                            width: 100%;
                            min-height: 400px;
                            border: 1px solid #e5e7eb;
                            border-radius: 0.375rem;
                            overflow: hidden;
                            padding: 1rem;
                            background-color: #f9fafb;
                            font-family: system-ui, -apple-system, sans-serif;
                            color: #111827;
                            position: relative;
                            animation: fadeIn 0.3s ease-out;
                            transition: transform 0.3s ease;
                        }

                        .wrapper.removing {
                            animation: fadeOut 0.3s ease-out;
                        }
                        .control-buttons {
                            position: absolute;
                            top: 8px;
                            left: 8px;
                            display: flex;
                            gap: 6px;  /* 增加间距 */
                            z-index: 10;
                        }

                        .control-buttons button {
                            width: 32px;     /* 增加按钮宽度 */
                            height: 32px;    /* 增加按钮高度 */
                            padding: 6px;    /* 增加内边距 */
                            border: 1px solid #e5e7eb;
                            background: white;
                            border-radius: 4px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #64748b;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                            transition: all 0.15s ease;
                        }


                        .control-buttons button:hover {
                            background-color: #f8fafc;
                            color: #475569;
                            border-color: #cbd5e1;
                        }

                        .control-buttons button:active {
                            background-color: #f1f5f9;
                            transform: translateY(1px);
                        }

                        .control-buttons svg {
                            width: 20px;     /* 增加 SVG 图标尺寸 */
                            height: 20px;    /* 增加 SVG 图标尺寸 */
                            stroke-linecap: round;
                            stroke-linejoin: round;
                        }

                        .fullscreen-transition {
                            transition: all 0.3s ease-in-out;
                        }

                        .zoom-transition {
                            transition: transform 0.3s ease-out;
                        }

                        .loading-indicator {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            color: #6b7280;
                        }

                        .spinner {
                            width: 20px;
                            height: 20px;
                            border: 2px solid #e5e7eb;
                            border-top-color: #4f46e5;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                        }

                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }

                        svg {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 0 auto;
                        }

                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }

                        .resize-handle {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            width: 20px;
                            height: 20px;
                            cursor: se-resize;
                            color: #9ca3af;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            opacity: 0.5;
                            transition: opacity 0.2s;
                        }
                        
                        .resize-handle:hover {
                            opacity: 1;
                        }
                        
                        .wrapper {
                            min-height: 200px;
                            resize: both;
                            overflow: auto;
                        }
                    `;

          const wrapper = document.createElement("div");
          wrapper.className = "wrapper";

          // Configure DOMPurify with enhanced security and functionality
          const sanitizedHTML = purify.sanitize(htmlContent, {
            RETURN_TRUSTED_TYPE: true,
            ADD_TAGS: [
              "script",
              "style",
              "svg",
              "circle",
              "rect",
              "path",
              "line",
            ],
            ADD_ATTR: [
              "cx",
              "cy",
              "r",
              "x",
              "y",
              "width",
              "height",
              "viewBox",
              "xmlns",
              "class",
              "id",
              "fill",
              "stroke",
              "stroke-width",
              "transform",
            ],
            FORCE_BODY: true,
            WHOLE_DOCUMENT: true,
            SANITIZE_DOM: true,
          });

          // Parse the sanitized HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(sanitizedHTML, "text/html");

          // Extract and process style tags
          const styleElements = Array.from(doc.querySelectorAll("style"));
          styleElements.forEach((styleEl) => {
            const newStyle = document.createElement("style");
            newStyle.textContent = styleEl.textContent;
            shadow.appendChild(newStyle);
            styleEl.remove();
          });

          // Extract and process script tags
          const scriptTags = Array.from(doc.querySelectorAll("script"));
          const scriptContents = scriptTags.map((script) => ({
            content: script.textContent,
            type: script.type || "text/javascript",
          }));
          scriptTags.forEach((script) => script.remove());

          // Set the HTML content
          wrapper.innerHTML = doc.body.innerHTML;

          // Create and append control buttons
          const controlButtons = createControlButtons(wrapper);
          wrapper.appendChild(controlButtons);

          // Append wrapper to shadow DOM
          shadow.appendChild(style);
          shadow.appendChild(wrapper);

          // Execute scripts within Shadow DOM context
          scriptContents.forEach(({ content, type }) => {
            try {
              if (
                type === "text/javascript" ||
                type === "application/javascript"
              ) {
                const scriptElement = document.createElement("script");
                scriptElement.textContent = `
                                    try {
                                        (function() {
                                            ${content}
                                        })();
                                    } catch (error) {
                                        console.error('[HTML Preview] Script execution error:', error);
                                    }
                                `;
                shadow.appendChild(scriptElement);
              }
            } catch (error) {
              console.error("[HTML Preview] Script creation error:", error);
            }
          });

          // Add resize functionality
          addResizeCapability(wrapper);

          // Add loading indicator
          const loadingIndicator = createLoadingIndicator();
          wrapper.appendChild(loadingIndicator);

          // Remove loading indicator after content is loaded
          requestAnimationFrame(() => {
            loadingIndicator.remove();
          });

          // Enhanced cleanup function
          const cleanup = createCleanupFunction(wrapper, animationFrames);
          container.cleanup = cleanup;

          return container;
        } catch (error) {
          console.error(
            "[HTML Preview] Preview container creation failed:",
            error
          );
          return createErrorElement("Failed to create preview container");
        }
      }

      /**
       * Creates control buttons for the preview container.
       * @param {HTMLElement} wrapper - The wrapper element.
       * @returns {HTMLElement} The control buttons container.
       */
      function createControlButtons(wrapper) {
        const controlButtons = document.createElement("div");
        controlButtons.className = "control-buttons";

        const buttons = [
          {
            label: "Toggle fullscreen",
            icon: `
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="1.5">
                                <path d="M4 4h4v4M4 4l5 5M20 4h-4v4M20 4l-5 5M4 20h4v-4M4 20l5-5M20 20h-4v-4M20 20l-5-5"/>
                            </svg>
                        `,
            action: () => toggleFullscreen(wrapper),
          },
          {
            label: "Zoom in",
            icon: `
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="1.5">
                                <circle cx="10.5" cy="10.5" r="5.5"/>
                                <line x1="14.5" y1="14.5" x2="19" y2="19"/>
                                <line x1="8.5" y1="10.5" x2="12.5" y2="10.5"/>
                                <line x1="10.5" y1="8.5" x2="10.5" y2="12.5"/>
                            </svg>
                        `,
            action: () => zoomContent(wrapper, 1.2),
          },
          {
            label: "Zoom out",
            icon: `
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="1.5">
                                <circle cx="10.5" cy="10.5" r="5.5"/>
                                <line x1="14.5" y1="14.5" x2="19" y2="19"/>
                                <line x1="8.5" y1="10.5" x2="12.5" y2="10.5"/>
                            </svg>
                        `,
            action: () => zoomContent(wrapper, 0.8),
          },
          {
            label: "Reset zoom",
            icon: `
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="1.5">
                                <circle cx="10.5" cy="10.5" r="5.5"/>
                                <line x1="14.5" y1="14.5" x2="19" y2="19"/>
                                <path d="M8.5 8.5l4 4m0-4l-4 4"/>
                            </svg>
                        `,
            action: () => resetZoom(wrapper),
          },
        ];

        buttons.forEach(({ label, icon, action }) => {
          const button = document.createElement("button");
          button.setAttribute("aria-label", label);
          button.innerHTML = icon;
          button.addEventListener("click", action);
          controlButtons.appendChild(button);
        });

        return controlButtons;
      }

      /**
       * Creates a cleanup function for the preview container.
       * @param {HTMLElement} wrapper - The wrapper element.
       * @param {Set} animationFrames - Set of animation frame IDs.
       * @returns {Function} The cleanup function.
       */
      function createCleanupFunction(wrapper, animationFrames) {
        const listeners = new Set();

        return () => {
          // Cancel all animation frames
          animationFrames.forEach((id) => {
            cancelAnimationFrame(id);
            animationFrames.delete(id);
          });

          // Remove all event listeners
          listeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
            listeners.delete({ element, type, handler });
          });

          // Remove fullscreen listener
          document.removeEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
              wrapper.classList.remove("fullscreen");
            }
          });

          // Clear any remaining timeouts or intervals
          const scripts = wrapper.getElementsByTagName("script");
          Array.from(scripts).forEach((script) => script.remove());
        };
      }

      /**
       * Toggles the preview visibility for a given code block.
       * @param {HTMLElement} codeBlock - The <code> element to toggle preview for.
       */
      function togglePreview(codeBlock) {
        try {
          const container = codeBlock.parentElement;
          const existingPreview = container.querySelector(".preview-container");

          if (existingPreview) {
            const wrapper =
              existingPreview.shadowRoot.querySelector(".wrapper");
            wrapper.classList.add("removing");

            if (existingPreview.cleanup) {
              existingPreview.cleanup();
            }

            wrapper.addEventListener(
              "animationend",
              () => {
                existingPreview.remove();
              },
              { once: true }
            );
          } else {
            const content = codeBlock.textContent;
            // Check if content is HTML
            if (
              content.trim().toLowerCase().startsWith("<!doctype html>") ||
              content.trim().toLowerCase().startsWith("<html")
            ) {
              console.log("[HTML Preview] Rendering HTML document");
            }

            const preview = createPreviewContainer(content);
            container.appendChild(preview);
          }
        } catch (error) {
          console.error("[HTML Preview] Toggle preview failed:", error);
        }
      }

      /**
       * Creates the preview button and appends it to the code block container.
       * @param {HTMLElement} codeBlock - The <code> element to create a preview button for.
       * @returns {HTMLElement} The created preview button.
       */
      function createPreviewButton(codeBlock) {
        const button = document.createElement("button");
        button.className = "preview-button";
        button.textContent = "Preview";
        button.style.cssText = `
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    padding: 4px 8px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    z-index: 1000;
                `;

        button.addEventListener("click", () => togglePreview(codeBlock));
        return button;
      }

      /**
       * Initializes the preview tool by adding preview buttons to all code blocks.
       */
      function initialize() {
        try {
          const codeBlocks = document.querySelectorAll("pre code");
          codeBlocks.forEach((block) => {
            const container = block.parentElement;
            if (container && !container.querySelector(".preview-button")) {
              container.style.position = "relative";
              const button = createPreviewButton(block);
              container.appendChild(button);
            }
          });
        } catch (error) {
          console.error("[HTML Preview] Initialization failed:", error);
        }
      }

      // Initialize on DOMContentLoaded or immediately if already loaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
      } else {
        initialize();
      }

      // Observe dynamic content changes to add preview buttons to newly added code blocks
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            initialize();
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error(
        "[HTML Preview] Failed to initialize HTML Preview Tool:",
        error
      );
    }
  }

  // Start the main program
  initializePreviewTool().catch((error) => {
    console.error("[HTML Preview] Critical error in HTML Preview Tool:", error);
  });

  /**
   * Toggles fullscreen mode for the preview wrapper.
   * @param {HTMLElement} element - The wrapper element to toggle fullscreen for.
   */
  function toggleFullscreen(element) {
    element.classList.add("fullscreen-transition");

    if (!document.fullscreenElement) {
      // Add fullscreen class before requesting fullscreen
      element.classList.add("fullscreen");
      element.requestFullscreen().catch((err) => {
        console.error(
          `[HTML Preview] Error attempting to enable full-screen mode: ${err.message}`
        );
        element.classList.remove("fullscreen");
      });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          element.classList.remove("fullscreen");
        })
        .catch((err) => {
          console.error(
            `[HTML Preview] Error attempting to exit full-screen mode: ${err.message}`
          );
        });
    }

    const fullscreenChangeHandler = () => {
      if (!document.fullscreenElement) {
        element.classList.remove("fullscreen");
      }
      element.classList.remove("fullscreen-transition");
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler, {
      once: true,
    });
  }

  /**
   * Zooms the preview content in or out.
   * @param {HTMLElement} element - The wrapper element to zoom.
   * @param {number} scaleFactor - The factor by which to scale the content.
   */
  function zoomContent(element, scaleFactor) {
    const currentScale = element.getAttribute("data-scale")
      ? parseFloat(element.getAttribute("data-scale"))
      : 1;
    const newScale = currentScale * scaleFactor;

    element.classList.add("zoom-transition");
    element.style.transform = `scale(${newScale})`;
    element.style.transformOrigin = "0 0";
    element.setAttribute("data-scale", newScale);

    element.addEventListener(
      "transitionend",
      () => {
        element.classList.remove("zoom-transition");
      },
      { once: true }
    );
  }

  /**
   * Handles errors by logging them and optionally displaying a message.
   * @param {Error} error - The error object.
   * @param {string} context - The context in which the error occurred.
   * @returns {string} The error message.
   */
  function handleError(error, context) {
    console.error(`[HTML Preview] ${context}:`, error);
    return `Error: ${context}. Please check console for details.`;
  }

  /**
   * Creates an error message element.
   * @param {string} message - The error message to display.
   * @returns {HTMLElement} The error message element.
   */
  function createErrorElement(message) {
    const errorContainer = document.createElement("div");
    errorContainer.style.cssText = `
            padding: 1rem;
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            border-radius: 0.375rem;
            color: #991b1b;
            animation: fadeIn 0.3s ease-out;
        `;
    errorContainer.textContent = `Error: ${message}`;
    return errorContainer;
  }

  // Add new helper function for resetting zoom
  function resetZoom(element) {
    element.classList.add("zoom-transition");
    element.style.transform = "scale(1)";
    element.setAttribute("data-scale", "1");

    element.addEventListener(
      "transitionend",
      () => {
        element.classList.remove("zoom-transition");
      },
      { once: true }
    );
  }

  /**
   * Adds resize capability to the wrapper element.
   * @param {HTMLElement} wrapper - The wrapper element to make resizable.
   */
  function addResizeCapability(wrapper) {
    // Create resize handle
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";
    resizeHandle.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22 22L12 12M22 12L12 22"/>
            </svg>
        `;

    // Add resize functionality
    let isResizing = false;
    let startHeight;
    let startWidth;
    let startX;
    let startY;

    const handleMouseDown = (e) => {
      isResizing = true;
      startHeight = wrapper.offsetHeight;
      startWidth = wrapper.offsetWidth;
      startX = e.clientX;
      startY = e.clientY;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(200, startWidth + deltaX);
      const newHeight = Math.max(200, startHeight + deltaY);

      wrapper.style.width = `${newWidth}px`;
      wrapper.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    resizeHandle.addEventListener("mousedown", handleMouseDown);
    wrapper.appendChild(resizeHandle);
  }

  /**
   * Creates a loading indicator element.
   * @returns {HTMLElement} The loading indicator element.
   */
  function createLoadingIndicator() {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";
    loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <span>Loading preview...</span>
        `;
    return loadingIndicator;
  }
})();
