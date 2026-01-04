// ==UserScript==
// @name         Medium to Freedium on New Tab + Full-Screen Overlay
// @namespace    https://greasyfork.org/users/1470715
// @icon         https://icons.duckduckgo.com/ip3/medium.com.ico
// @version      1.4
// @description  Add a button that opens freedium page in a new tab + full-screen overlay iframe with close button
// @author       cattishly6060
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538271/Medium%20to%20Freedium%20on%20New%20Tab%20%2B%20Full-Screen%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/538271/Medium%20to%20Freedium%20on%20New%20Tab%20%2B%20Full-Screen%20Overlay.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Guard flag to prevent multiple executions
  if (window.hasMediumEnhancerRun) return;
  window.hasMediumEnhancerRun = true;

  // Use requestIdleCallback for better performance
  function init() {
    const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.content;
    if (ogSiteName !== 'Medium') return;

    // Add custom styles
    GM_addStyle(`
    .floatingButtonContainer {
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    } 
    
    .btn {
      transform: translateY(-50%);
      background: #0942a3;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .btn:hover {
      background: #3367d6;
      transform: translateY(-50%) scale(1.1);
    }

    #iframeOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      display: none;
    }

    #iframeContainer {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #closeIframe {
      position: absolute;
      top: 15px;
      right: 25px; /* Increased from 10px to avoid scrollbar */
      z-index: 10000;
      background: #a20001;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px; /* Increased from 30px */
      height: 40px; /* Increased from 30px */
      font-size: 22px; /* Increased from 16px */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    #closeIframe:hover {
      background: #cc0000;
      transform: scale(1.1);
    }

    #iframeContent {
      width: 100%;
      height: 100%;
      border: none;
    }
  `);

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('floatingButtonContainer');
    buttonGroup.style.cssText = '';

    // Create overlay button
    const overlayButton = document.createElement('button');
    overlayButton.className = 'btn';
    overlayButton.textContent = '🔓';
    overlayButton.title = 'Open freedium page in overlay';
    buttonGroup.appendChild(overlayButton);

    // Create open new tab button
    const newTabButton = document.createElement('button');
    newTabButton.className = 'btn';
    newTabButton.textContent = '↗️';
    newTabButton.title = 'Open freedium page in new tab';
    buttonGroup.appendChild(newTabButton);
    document.body.appendChild(buttonGroup);

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'iframeOverlay';

    const container = document.createElement('div');
    container.id = 'iframeContainer';

    const closeButton = document.createElement('button');
    closeButton.id = 'closeIframe';
    closeButton.innerHTML = '&times;';
    closeButton.title = 'Close overlay';

    const iframe = document.createElement('iframe');
    iframe.id = 'iframeContent';

    container.appendChild(closeButton);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Function to replace host in URL
    function replaceHost(url, newHost) {
      try {
        const urlObj = new URL(url);
        urlObj.host = newHost;
        return urlObj.toString();
      } catch (e) {
        console.error("Error processing URL:", e);
        return url;
      }
    }

    // Button click handler
    overlayButton.addEventListener('click', function () {
      const url = replaceHost(window.location.href, 'freedium.cfd');
      if (url) {
        iframe.src = url;
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling on main page
      }
    });

    newTabButton.addEventListener('click', function () {
      const url = replaceHost(window.location.href, 'freedium.cfd');
      GM_openInTab(url, {active: true});
    });

    // Close button handler
    closeButton.addEventListener('click', function () {
      overlay.style.display = 'none';
      iframe.src = '';
      document.body.style.overflow = ''; // Restore scrolling
    });

    // Close when clicking outside iframe (optional)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = '';
      }
    });
  }

  // More efficient than load event for most cases
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    // If already loaded, run immediately but yield to browser
    requestIdleCallback(init);
  }
})();
