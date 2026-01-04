// ==UserScript==
// @name         Roblox Connections to Friends
// @namespace    Replace "Connections" with "Friends" on Roblox July 2025!
// @match        https://www.roblox.com/*
// @license      MIT
// @grant        none
// @version      1.14
// @author       mysticatten
// @icon         https://static.wikia.nocookie.net/logopedia/images/4/43/Roblox_Player_%282025%2C_Icon%29.svg/revision/latest/scale-to-width-down/200?cb=20250426203759
// @description  Changes the Goofy aah Connections 🤓 to Friends 😎
// @downloadURL https://update.greasyfork.org/scripts/544431/Roblox%20Connections%20to%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/544431/Roblox%20Connections%20to%20Friends.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Fancy Roblox-style GUI donation prompt ===
  if (!localStorage.getItem('hideDonationPrompt')) {
    const popup = document.createElement('div');
    popup.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #1c1c1c;
      color: white;
      border-radius: 16px;
      box-shadow: 0 0 10px rgba(0,0,0,0.7);
      padding: 24px;
      z-index: 10000;
      width: 360px;
      font-family: 'Gotham SSm', 'Arial', sans-serif;
      text-align: center;
      opacity: 0;
      transition: opacity 0.6s ease;
      pointer-events: none;
    `;

    popup.innerHTML = `
      <h2 style="margin-bottom: 16px;">Support Script Creator</h2>
      <p style="margin-bottom: 24px;">Would you like to donate to the creator of this script?</p>
      <div style="display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px;">
        <button id="donate-yes" style="flex: 1; background-color: #00b06b; color: white; border: none; border-radius: 12px; padding: 10px; cursor: pointer;">Yes</button>
        <button id="donate-no" style="flex: 1; background-color: #444; color: white; border: none; border-radius: 12px; padding: 10px; cursor: pointer;">No</button>
      </div>
      <div style="margin-bottom: 20px;">
        <button id="donate-later" style="background-color: #2f2f2f; color: white; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer;">Maybe Later</button>
      </div>
      <label style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px;">
        <input type="checkbox" id="donate-hide" style="accent-color: #00b06b; width: 16px; height: 16px; cursor: pointer;">
        <span>Don't show this again</span>
      </label>
    `;

    document.body.appendChild(popup);

    // Fade in after 3 seconds
    setTimeout(() => {
      popup.style.opacity = '1';
      popup.style.pointerEvents = 'auto';
    }, 3500);

    // Button logic
    document.getElementById('donate-yes').onclick = () => {
      window.open('https://roblox-connections-to-friends.vercel.app/', '_blank');
      if (document.getElementById('donate-hide').checked) {
        localStorage.setItem('hideDonationPrompt', 'true');
      }
      popup.remove();
    };

    document.getElementById('donate-no').onclick = () => {
      if (document.getElementById('donate-hide').checked) {
        localStorage.setItem('hideDonationPrompt', 'true');
      }
      popup.remove();
    };

    document.getElementById('donate-later').onclick = () => {
      popup.remove();
    };
  }

  const replacements = [
    { from: /\bAdd Connection\b/g, to: 'Add Friend' },
    { from: /\bRemove Connection\b/g, to: 'Remove Friend' },
    { from: /\bMy Connections\b/g, to: 'My Friends' },
    { from: /\bConnections\b/g, to: 'Friends' },
    { from: /\bConnection\b/g, to: 'Friend' },
    { from: /\bAdd Friend\b/g, to: 'Add Friend' },
    { from: /\bconnect\b/g, to: 'friend' },
    { from: /\bSearch for Connections\b/g, to: 'Search for Friends' },
    { from: /\bconnections\b/g, to: 'friends' }
  ];

  function replaceTextInNode(node) {
    let newText = node.textContent;
    replacements.forEach(({ from, to }) => {
      newText = newText.replace(from, to);
    });
    if (newText !== node.textContent) {
      node.textContent = newText;
    }
  }

  function replaceTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      replaceTextInNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const aria = node.getAttribute && node.getAttribute('aria-label');
      if (aria) {
        let updated = aria;
        replacements.forEach(({ from, to }) => {
          updated = updated.replace(from, to);
        });
        if (updated !== aria) {
          node.setAttribute('aria-label', updated);
        }
      }
      node.childNodes.forEach(replaceTextNodes);
    }
  }

  function fixButtons() {
    // Fix #nav-friends > span text (navigation bar top)
    const navFriendsSpan = document.querySelector('#nav-friends > span');
    if (navFriendsSpan) {
      const walker = document.createTreeWalker(navFriendsSpan, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = walker.nextNode())) {
        replaceTextInNode(textNode);
      }
    }

    // Change text under icon from "Connect" to "Add Friends"
    const friendTileLabelSpan = document.querySelector(
      '#friend-tile-button > a > div.friends-carousel-tile-labels > div > div > span'
    );
    if (friendTileLabelSpan) {
      const walker2 = document.createTreeWalker(friendTileLabelSpan, NodeFilter.SHOW_TEXT);
      let tn;
      while ((tn = walker2.nextNode())) {
        tn.textContent = tn.textContent.replace(/\bConnect\b/g, 'Add Friends');
      }
    }

        // Change text under icon from "Connect" to "Add Friends"
    const friendBarLabelSpan = document.querySelector(
      '#nav-friends > span'
    );
    if (friendBarLabelSpan) {
      const walker2 = document.createTreeWalker(friendBarLabelSpan, NodeFilter.SHOW_TEXT);
      let tn;
      while ((tn = walker2.nextNode())) {
        tn.textContent = tn.textContent.replace(/\bConnect\b/g, 'Friends');
      }
    }

    // Fix profile header on friends page like "username's Connections" to "username's Friends"
    const profileHeader = document.querySelector('#friends-web-app > div > div.page-header.section > div > h1');
    if (profileHeader && profileHeader.textContent.includes('Connection')) {
      profileHeader.textContent = profileHeader.textContent.replace(/\bConnections\b/g, 'Friends');
    }

    // Replace text nodes inside other buttons/links except nav-friends button itself
    const allButtons = [...document.querySelectorAll('button, a')];
    allButtons.forEach(btn => {
      if (btn === navFriendsSpan?.parentElement) return; // skip nav-friends button itself
      btn.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          replaceTextInNode(child);
        }
      });
    });
  }

  function scanPage() {
    replaceTextNodes(document.body);
    fixButtons();
  }

  scanPage();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          replaceTextNodes(node);
        }
      });
    });
    fixButtons();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
