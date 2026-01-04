// ==UserScript==
// @name        Show Last Modified Timestamp for Non-HTML Documents
// @namespace   https://greasyfork.org/users/1310758
// @description Display the Last-Modified timestamp for non-HTML documents
// @match       *://*/*
// @license     MIT License
// @author      pachimonta
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @noframes
// @version     2025.05.03.001
// @downloadURL https://update.greasyfork.org/scripts/534020/Show%20Last%20Modified%20Timestamp%20for%20Non-HTML%20Documents.user.js
// @updateURL https://update.greasyfork.org/scripts/534020/Show%20Last%20Modified%20Timestamp%20for%20Non-HTML%20Documents.meta.js
// ==/UserScript==
(function () {
  // Only proceed for non-HTML documents with required properties
  if (
    !document ||
    !document.lastModified ||
    !document.contentType ||
    /^text\/html(?:$|;)/.test(document.contentType) ||
    !document.head ||
    !document.body
  ) return;

  // Information note shown on overlay focus
  const NOTE = String.raw`Content last modified time.

Note: The 'lastModified' value may differ from the
server's 'Last-Modified' header. If not available,
the 'Date' header is used, showing when the server
sent the response. Timestamp formats may also vary
by environment, which can cause display errors.

📋: Copy, 📌: Drag overlay, ✅: Toggle display.
Press CTRL+C to copy the last modified time.
Press CTRL+V to toggle display.
When unchecked, it hides on blur.`;

  const DEFAULT_OVERLAY_VISIBLE = true;

  // Parse lastModified string into Date
  const lastModifiedDate = new Date(document.lastModified);

  // Format date (YYYY-MM-DD)
  const dateFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formattedDate = new Intl.DateTimeFormat(
    'sv-SE',
    dateFormatOptions
  ).format(lastModifiedDate);

  // Format time with timezone
  const timeFormatOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  const formattedTime = new Intl.DateTimeFormat(
    'sv-SE',
    timeFormatOptions
  ).format(lastModifiedDate);

  // Get short weekday name (Mon, Tue, ...)
  const weekdayOptions = {
    weekday: 'short',
  };
  const dayOfWeek = new Intl.DateTimeFormat('en-US', weekdayOptions).format(
    lastModifiedDate
  );

  // Final display string
  const lastModifiedText = `${formattedDate} (${dayOfWeek}) ${formattedTime}`;

  // Get overlay visibility state from user settings
  const isOverlayVisible = GM_getValue(
    'lastModifiedOverlayVisible',
    DEFAULT_OVERLAY_VISIBLE
  );

  // Create overlay root element
  const overlay = document.createElement('span');
  overlay.classList.add('last-modified-overlay');
  if (!isOverlayVisible) overlay.classList.add('opacity-zero');
  overlay.setAttribute('tabindex', '0');
  overlay.dataset.content = NOTE;

  // Last-modified info button
  const infoButton = document.createElement('button');
  infoButton.textContent = lastModifiedText;
  infoButton.classList.add('overlay-info-button');
  infoButton.setAttribute('tabindex', '-1');
  overlay.append(infoButton);

  // When info button receives focus, move focus to overlay for accessibility/tooltips
  infoButton.addEventListener(
    'focus',
    function () {
      overlay.focus();
    },
    true
  );

  // Copy button
  const copyButton = document.createElement('button');
  copyButton.classList.add('copy-button');
  copyButton.textContent = '📋';
  copyButton.dataset.tooltip = 'Copy';
  overlay.append(copyButton);

  // Copy to clipboard with double confirmation
  let copyTooltipTimeout;
  copyButton.addEventListener('click', () => {
    if (copyButton.dataset.tooltip === 'Copied!') return;
    function resetTooltip() {
      copyButton.dataset.tooltip = 'Copy';
      copyButton.blur();
    }
    if (copyTooltipTimeout) clearTimeout(copyTooltipTimeout);

    if (copyButton.dataset.tooltip === 'Copy') {
      copyButton.dataset.tooltip = 'Copy?';
      copyTooltipTimeout = setTimeout(resetTooltip, 3000);
      return;
    }
    GM_setClipboard(lastModifiedText, 'text');
    copyButton.dataset.tooltip = 'Copied!';
    copyTooltipTimeout = setTimeout(resetTooltip, 1000);
  });

  // Toggle label & checkbox for overlay visibility
  const toggleLabel = document.createElement('label');
  toggleLabel.setAttribute('tabindex', '0');
  toggleLabel.classList.add('toggle-label');
  toggleLabel.dataset.tooltip = 'Toggle display';

  const toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.classList.add('toggle-checkbox');
  toggleCheckbox.checked = isOverlayVisible;
  toggleCheckbox.addEventListener(
    'change',
    function () {
      const checked = toggleCheckbox.checked;
      const prevValue = GM_getValue(
        'lastModifiedOverlayVisible',
        DEFAULT_OVERLAY_VISIBLE
      );
      if (prevValue !== checked) {
        GM.setValue('lastModifiedOverlayVisible', checked);
      }
      overlay.classList.toggle('opacity-zero', !checked);
    },
    true
  );
  toggleLabel.append(toggleCheckbox);
  overlay.prepend(toggleLabel);

  // Drag button
  const dragButton = document.createElement('button');
  dragButton.classList.add('drag-button');
  dragButton.textContent = '📌';
  dragButton.dataset.tooltip = 'Drag overlay';
  overlay.prepend(dragButton);

  // Reset overlay position on double click of drag button
  dragButton.addEventListener('dblclick', function() {
    overlay.style.top = defaultTop;
    overlay.style.right = defaultRight;
    overlay.style.bottom = 'auto';
    overlay.style.left = 'auto';
  });

  // Keyboard shortcuts: Ctrl+C to copy, Ctrl+V to toggle
  overlay.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'c') {
      GM_setClipboard(lastModifiedText, 'text');
    }
    if (event.ctrlKey && event.key === 'v') {
      toggleCheckbox.click();
    }
  });

  // Sync overlay state when window/tab gets focus (cross-tab)
  window.addEventListener(
    'focus',
    function () {
      const currentVisible = GM_getValue(
        'lastModifiedOverlayVisible',
        DEFAULT_OVERLAY_VISIBLE
      );
      toggleCheckbox.checked = currentVisible;
      overlay.classList.toggle('opacity-zero', !currentVisible);
    },
    true
  );

  // Overlay styles
  const style = document.createElement('style');
  style.textContent = String.raw`
  .last-modified-overlay {
    display: inline-block;
    position: fixed;
    top: 8px;
    right: 32px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    z-index: 10;
    font-size: 13px;
    padding: 8px;
    font-family: sans-serif;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 6px;
  }
  .last-modified-overlay:focus::after {
    content: attr(data-content);
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #ffe;
    color: #000;
    padding: 4px 8px;
    margin-top: 4px;
    border: 1px solid #000;
    border-radius: 6px;
    z-index: 10;
    white-space: break-spaces;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.19);
    opacity: 0.9;
  }
  .last-modified-overlay:focus,
  .last-modified-overlay:hover {
    opacity: 1;
  }
  .overlay-info-button {
    appearance: none;
    color: white;
    margin: 0 6px;
    background-color: transparent;
    border: 2px solid transparent;
    cursor: pointer;
  }
  .drag-button {
    cursor: move;
  }
  .copy-button {
    cursor: copy;
  }
  [data-tooltip] {
    font-family: inherit;
    position: relative;
    opacity: 0.6;
    z-index: 100;
  }
  [data-tooltip]:hover::after,
  [data-tooltip]:focus::after {
    content: attr(data-tooltip);
    display: inline-block;
    position: absolute;
    top: 100%;
    left: -26px;
    background-color: #ffe;
    color: #000;
    padding: 4px 8px;
    margin-top: 4px;
    border: 1px solid #000;
    border-radius: 6px;
    white-space: break-spaces;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.19);
  }
  [data-tooltip]:hover,
  [data-tooltip]:focus {
    opacity: 0.9;
  }
  .opacity-zero {
    opacity: 0;
    transition: opacity 0.25s;
  }
  `;
  document.head.append(style);

  // Insert overlay after <body> for layout consistency
  document.body.after(overlay);

  // ------- Drag and Drop Functionality -------
  // Utility: Get clientX and clientY from mouse or touch event
  function getEventClientXY(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      return { x: e.clientX, y: e.clientY };
    }
    return null;
  }

  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  // Store default position for reset
  const defaultTop = overlay.style.top;
  const defaultRight = overlay.style.right;

  function dragStart(e) {
    // Only allow dragging from the drag button
    if (e.target !== dragButton) return;
    isDragging = true;
    const pos = getEventClientXY(e);
    if (!pos) return;
    const rect = overlay.getBoundingClientRect();
    dragOffsetX = pos.x - rect.left;
    dragOffsetY = pos.y - rect.top;
    e.preventDefault();
  }

  function dragMove(e) {
    if (!isDragging) return;
    const pos = getEventClientXY(e);
    if (!pos) return;
    let newLeft = pos.x - dragOffsetX;
    let newTop = pos.y - dragOffsetY;
    // Keep overlay within viewport
    newLeft = Math.max(0, Math.min(window.innerWidth - overlay.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - overlay.offsetHeight, newTop));
    overlay.style.left = newLeft + 'px';
    overlay.style.top = newTop + 'px';
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
    e.preventDefault();
  }

  function dragEnd() {
    isDragging = false;
  }

  // Register drag event listeners for mouse and touch
  overlay.addEventListener('mousedown', dragStart);
  overlay.addEventListener('touchstart', dragStart, { passive: false });

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('touchmove', dragMove, { passive: false });

  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);

})();