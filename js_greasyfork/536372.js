// ==UserScript==
// @name         Google Meet Auto Starter + Link Copier (Popup Version)
// @namespace    Shawon
// @version      2.3
// @description  Adds a button to auto-start a Google Meet and smoothly copy the link, then auto-close the dialog, blocking "Unable to copy" popups
// @author       Mahmudul Hasan Shawon
// @match        https://meet.google.com/landing
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536372/Google%20Meet%20Auto%20Starter%20%2B%20Link%20Copier%20%28Popup%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536372/Google%20Meet%20Auto%20Starter%20%2B%20Link%20Copier%20%28Popup%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Block any popup containing "Unable to copy"
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.innerText && node.innerText.includes("Unable to copy")) {
            // Hide or remove the popup immediately
            node.style.display = 'none';
            console.log('[MeetBot] Blocked "Unable to copy" popup.');
          }
        }
      });
    });
  });

  // Start observing document.body for added popup nodes
  observer.observe(document.body, { childList: true, subtree: true });

  // Also override alert to block "Unable to copy" alerts if they appear as alert()
  const originalAlert = window.alert;
  window.alert = function(msg) {
    if (typeof msg === 'string' && msg.includes('Unable to copy')) {
      console.log('[MeetBot] Blocked alert:', msg);
      return; // Ignore this alert
    }
    return originalAlert(msg);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const waitForElement = (selector, timeout = 15000) =>
    new Promise((resolve, reject) => {
      const interval = 250;
      let elapsed = 0;
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        elapsed += interval;
        if (elapsed >= timeout) {
          clearInterval(timer);
          reject(new Error("Timeout waiting for: " + selector));
        }
      }, interval);
    });

  function showToast(message = '✅ Link copied!', duration = 3000) {
    const toast = document.createElement('div');
    toast.innerText = message;

    Object.assign(toast.style, {
      position: 'fixed',
      top: '3rem',
      left: '50%',
      transform: 'translateX(-50%) scale(0.95)',
      background: 'rgba(26, 115, 232, 0.9)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      zIndex: '99999',
      opacity: '0',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      backdropFilter: 'blur(6px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
      pointerEvents: 'none',
      fontFamily: 'Inter, sans-serif',
      userSelect: 'none',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) scale(1)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) scale(0.95)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  async function startMeetAndCopyLink() {
    try {
      console.log('[MeetBot] Starting...');
      const newMeetingBtn = await waitForElement('span[jsname="V67aGc"]');
      newMeetingBtn.click();
      await sleep(500);

      const instantMeetingBtn = await waitForElement('li[aria-label="Start an instant meeting"]');
      instantMeetingBtn.click();
      await sleep(3000);

      copyLinkFromMeet();
    } catch (err) {
      console.error('[MeetBot] Error:', err);
    }
  }

  async function copyLinkFromMeet() {
    try {
      const dialog = await waitForElement('div[role="dialog"]');
      await sleep(1000);

      const linkDiv = await waitForElement('.gk1DN .DwOtV');
      const meetLink = linkDiv?.textContent?.trim();

      if (meetLink && meetLink.startsWith('meet.google.com/')) {
        GM_setClipboard(meetLink);
        showToast(`📋 Copied: ${meetLink}`);
        console.log('[MeetBot] Link copied:', meetLink);

        // Click the "Copy link" button if present (optional)
        const copyBtn = document.querySelector('button[aria-label="Copy link"]');
        if (copyBtn) copyBtn.click();

        // Close the dialog after a short delay
        const closeBtn = dialog.querySelector('button[aria-label="Close"]');
        if (closeBtn) {
          await sleep(700); // nice delay before closing
          closeBtn.click();
          console.log('[MeetBot] Dialog closed.');
        } else {
          console.warn('[MeetBot] Close button not found.');
        }

      } else {
        console.warn('[MeetBot] No valid link found.');
      }
    } catch (err) {
      console.error('[MeetBot] Copy Error:', err.message);
    }
  }

  function createFloatingButton() {
    const btn = document.createElement('button');
    btn.innerText = '▶ Start Meet & Copy Link';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '8rem',
      left: '7rem',
      padding: '12px 18px',
      background: '#1a73e8',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      zIndex: '9999',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      userSelect: 'none',
      fontFamily: 'Inter, sans-serif',
    });
    btn.title = 'Click to start a Meet and auto-copy the link';
    btn.addEventListener('click', startMeetAndCopyLink);
    document.body.appendChild(btn);
  }

  window.addEventListener('load', () => {
    if (location.pathname === '/landing') {
      createFloatingButton();
    } else if (location.hostname === 'meet.google.com') {
      setTimeout(copyLinkFromMeet, 3000);
    }
  });
})();
