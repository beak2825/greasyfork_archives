// ==UserScript==
// @name         T3 Chat Zoomed-Out Scrollbar
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Adds a zoomed-out preview scrollbar to T3 Chat, showing only the chat log.
// @author       Dimava, T3 Chat, Gemini 2.0 Flash
// @match        https://t3.chat/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526130/T3%20Chat%20Zoomed-Out%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/526130/T3%20Chat%20Zoomed-Out%20Scrollbar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PREVIEW_SCROLLBAR_ID = "t3-chat-preview-scrollbar";
  const PREVIEW_CONTENT_ID = "t3-chat-preview-content";
  const PREVIEW_THUMB_ID = "t3-chat-preview-thumb";
  const PREVIEW_SCALE = 0.1; // Scale factor for the preview
  const THUMB_HEIGHT_VH = 10; // Thumb height in viewport height units
  const SCROLLBAR_OFFSET_PX = 20; // Offset from the right edge
  const THROTTLE_DELAY_MS = 3000; // Throttle updates to every 3 seconds

  let lastContentUpdate = 0; // Timestamp of the last content update
  let scrollParent;
  let previewContent;
  let contentObserver;
  let thumb;
  let logDiv;
  let scrollbar;

  // Cleanup function
  function cleanup() {
    if (scrollbar) scrollbar.remove();
    window.removeEventListener("resize", updatePreviewContent);
    if (scrollParent)
      scrollParent.removeEventListener("scroll", updateThumbPosition);
    stopHeightPolling();
    if (contentObserver) contentObserver.disconnect();
  }

  // Call cleanup if it exists on the window
  if (window.t3ChatPreviewScrollbarCleanup) {
    window.t3ChatPreviewScrollbarCleanup();
  }

  // Function to update the preview content (throttled)
  function updatePreviewContent() {
    if (!logDiv || !previewContent) return;
    const now = Date.now();
    if (now - lastContentUpdate >= THROTTLE_DELAY_MS) {
      // Clone the logDiv content
      const clonedLogDiv = logDiv.cloneNode(true);

      // Apply styles to remove interactive elements
      const allElements = clonedLogDiv.querySelectorAll("*");
      allElements.forEach((el) => {
        el.style.pointerEvents = "none";
        el.style.userSelect = "none";
      });

      // Clear existing content and append the cloned content
      while (previewContent.firstChild) {
        previewContent.removeChild(previewContent.firstChild);
      }
      previewContent.appendChild(clonedLogDiv);

      // Set preview content width
      const logWidth = logDiv.getBoundingClientRect().width;
      previewContent.style.width = `${logWidth}px`;

      lastContentUpdate = now;
    }
  }

  // Function to update the thumb position
  function updateThumbPosition() {
    if (!logDiv || !scrollParent || !thumb || !scrollbar || !previewContent)
      return;

    const scrollHeight = scrollParent.scrollHeight;
    const clientHeight = scrollParent.clientHeight;
    const scrollTop = scrollParent.scrollTop;

    const scrollbarHeight = scrollbar.offsetHeight;
    const thumbHeightPx = (THUMB_HEIGHT_VH / 100) * window.innerHeight; // Constant thumb height

    let thumbPosition =
      (scrollbarHeight - thumbHeightPx) * (scrollTop / scrollHeight); // Proportional thumb position

    // Correct thumb position to allow scrolling to the very bottom
    thumbPosition = Math.min(
      thumbPosition,
      scrollbarHeight - thumbHeightPx
    );

    thumb.style.height = `${thumbHeightPx}px`;
    thumb.style.top = `${thumbPosition}px`;

    // Move the preview content up to align with the thumb
    const thumbCenter = thumbPosition + thumbHeightPx / 2;
    previewContent.style.top = `-${scrollTop * PREVIEW_SCALE - thumbCenter}px`;
  }

  // Function to handle thumb dragging
  function handleThumbDrag(event) {
    if (!logDiv || !scrollParent || !thumb || !scrollbar || !previewContent)
      return;

    const scrollHeight = scrollParent.scrollHeight;
    const clientHeight = scrollParent.clientHeight;
    const scrollbarHeight = scrollbar.offsetHeight;

    let startY = event.clientY;
    let startTop = thumb.offsetTop;

    function drag(e) {
      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;
      const h = (THUMB_HEIGHT_VH / 100) * window.innerHeight;

      // Keep thumb within scrollbar bounds
      newTop = Math.max(0, Math.min(newTop, scrollbarHeight - thumb.offsetHeight));

      thumb.style.top = `${newTop}px`;

      // Calculate scroll position based on thumb position
      let scrollPosition = (newTop / (scrollbarHeight - h)) * scrollHeight;

      // Correct scroll position to allow scrolling to the very bottom
      scrollPosition = Math.min(
        scrollPosition,
        scrollHeight - clientHeight
      );

      scrollParent.scrollTop = scrollPosition;

      // Move the preview content up to align with the thumb
      const thumbCenter = newTop + (THUMB_HEIGHT_VH / 100) * window.innerHeight / 2;
      previewContent.style.top = `-${scrollPosition * PREVIEW_SCALE - thumbCenter}px`;
    }

    function stopDrag() {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    event.preventDefault(); // Prevent text selection during drag
  }

  // Function to create the preview scrollbar
  function createPreviewScrollbar() {
    scrollbar = document.createElement("div");
    scrollbar.id = PREVIEW_SCROLLBAR_ID;
    scrollbar.style.cssText = `
            position: fixed;
            top: 0;
            right: ${SCROLLBAR_OFFSET_PX}px; /* Offset from the right edge */
            width: 50px; /* Initial width, will be updated */
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.1);
            overflow: hidden;
            z-index: 1000;
        `;

    previewContent = document.createElement("div");
    previewContent.id = PREVIEW_CONTENT_ID;
    previewContent.style.cssText = `
            position: relative;
            width: 100%; /* Initial width, will be updated */
            height: auto;
            transform: scale(${PREVIEW_SCALE});
            transform-origin: top left;
            overflow: hidden;
            pointer-events: none;
            top: 0; /* Initial top position */
        `;
    scrollbar.appendChild(previewContent);

    thumb = document.createElement("div");
    thumb.id = PREVIEW_THUMB_ID;
    thumb.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: ${THUMB_HEIGHT_VH}vh; /* Constant thumb height */
            background-color: rgba(66, 135, 245, 0.5);
            cursor: grab;
        `;
    scrollbar.appendChild(thumb);

    document.body.appendChild(scrollbar);

    // Event listener for thumb dragging
    thumb.addEventListener("mousedown", handleThumbDrag);

    // Event listener for scrollbar mousedown
    scrollbar.addEventListener("mousedown", handleScrollbarMousedown);
  }

  // Function to handle scrollbar click
  function handleScrollbarMousedown(event) {
    if (event.target === thumb) return; // Ignore clicks on the thumb
    if (!logDiv || !scrollParent || !thumb || !scrollbar) return;

    const scrollbarHeight = scrollbar.offsetHeight;
    const clickY = event.clientY - scrollbar.getBoundingClientRect().top;

    const thumbHeightPx = (THUMB_HEIGHT_VH / 100) * window.innerHeight;
    const thumbPosition = thumb.offsetTop;
    const thumbCenter = thumbPosition + thumbHeightPx / 2;

    // Calculate the difference between the click position and the thumb center
    const deltaY = clickY - thumbCenter;

    // Adjust the scroll position by the scaled difference
    scrollParent.scrollTop += deltaY / PREVIEW_SCALE;

    // Ensure scroll position stays within bounds
    scrollParent.scrollTop = Math.max(
      0,
      Math.min(scrollParent.scrollTop, scrollParent.scrollHeight - scrollParent.clientHeight)
    );

    // Update thumb position immediately
    updateThumbPosition();
  }

  let heightPollingInterval;

  function pollElementHeight() {
    if (!logDiv || !scrollbar || !previewContent) return;
    const logWidth = logDiv.getBoundingClientRect().width;
    const scrollbarWidth = logWidth / 10;
    scrollbar.style.width = `${scrollbarWidth}px`;
    previewContent.style.width = `${logWidth}px`;
    requestAnimationFrame(pollElementHeight);
  }

  function startHeightPolling() {
    heightPollingInterval = requestAnimationFrame(pollElementHeight);
  }

  function stopHeightPolling() {
    cancelAnimationFrame(heightPollingInterval);
  }

  function initialize() {
    // Initialize
    createPreviewScrollbar();

    // Get elements
    logDiv = document.querySelector('[role="log"]');
    if (!logDiv) return;

    scrollParent = logDiv.parentNode;

    // Initial update
    updatePreviewContent();
    updateThumbPosition();

    // Event listeners
    contentObserver = new MutationObserver(() => {
      updatePreviewContent();
    });

    contentObserver.observe(logDiv, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    window.addEventListener("resize", updatePreviewContent);

    if (!scrollParent) return;

    scrollParent.addEventListener("scroll", updateThumbPosition);

    // Start polling for height changes
    startHeightPolling();
  }

  function waitForLogDiv() {
    logDiv = document.querySelector('[role="log"]');
    if (logDiv) {
      initialize();
    } else {
      setTimeout(waitForLogDiv, 200); // Check every 200ms
    }
  }

  // Attach cleanup function to window
  window.t3ChatPreviewScrollbarCleanup = () => {
    cleanup();
    delete window.t3ChatPreviewScrollbarCleanup;
  };

  // Start waiting for the log div
  waitForLogDiv();

  // Public functions
  window.updatePreview = updatePreviewContent;
  window.updateThumb = updateThumbPosition;
})();
