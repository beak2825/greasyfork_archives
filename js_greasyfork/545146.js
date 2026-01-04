// ==UserScript==
  // @name         DeepSeek AI Avatar Uploader
  // @namespace    http://tampermonkey.net/
  // @version      1.0
  // @description  Dynamically adds/removes a custom floating AI avatar image on DeepSeek chat subpages with optimized performance
  // @author       LuxTallis and Grok
  // @match        https://chat.deepseek.com/*
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545146/DeepSeek%20AI%20Avatar%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/545146/DeepSeek%20AI%20Avatar%20Uploader.meta.js
  // ==/UserScript==

  (function() {
      'use strict';

      let uploadButton = null;
      let observer = null;
      let lastUpdate = 0;
      const DEBOUNCE_DELAY = 500; // Milliseconds
      let cachedContainer = null;

      // Check if the current page is a chat subpage
      function isChatSubpage() {
          return window.location.pathname.startsWith('/a/chat/');
      }

      // Function to create the upload button
      function createUploadButton() {
          if (uploadButton) return;
          uploadButton = document.createElement('button');
          uploadButton.textContent = 'Upload AI Avatar';
          uploadButton.style.position = 'fixed';
          uploadButton.style.top = '10px';
          uploadButton.style.right = '10px';
          uploadButton.style.zIndex = '1000';
          uploadButton.style.padding = '8px 12px';
          uploadButton.style.backgroundColor = '#4CAF50';
          uploadButton.style.color = 'white';
          uploadButton.style.border = 'none';
          uploadButton.style.borderRadius = '4px';
          uploadButton.style.cursor = 'pointer';
          uploadButton.style.fontSize = '14px';
          uploadButton.addEventListener('click', openFileInput);
          document.body.appendChild(uploadButton);
      }

      // Function to remove the upload button
      function removeUploadButton() {
          if (uploadButton) {
              uploadButton.remove();
              uploadButton = null;
          }
      }

      // Function to create a hidden file input
      function openFileInput() {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.style.display = 'none';
          input.addEventListener('change', handleFileSelect);
          document.body.appendChild(input);
          input.click();
      }

      // Function to handle file selection and store the image
      function handleFileSelect(event) {
          const file = event.target.files[0];
          if (file && file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  const imageData = e.target.result;
                  GM_setValue('customAIAvatar', imageData);
                  applyAvatar(imageData);
              };
              reader.readAsDataURL(file);
          }
      }

      // Function to check if an element is scrollable
      function isScrollable(element) {
          const style = window.getComputedStyle(element);
          return style.overflow === 'auto' || style.overflowY === 'auto' ||
                 style.overflow === 'scroll' || style.overflowY === 'scroll';
      }

      // Function to find the chat window container
      function findChatContainer() {
          if (cachedContainer) {
              if (document.contains(cachedContainer.container)) {
                  return cachedContainer;
              } else {
                  cachedContainer = null; // Clear cache if container is gone
              }
          }

          const selectors = [
              'div._3919b83',
              'div.dad65929',
              'div.ds-theme div[class*="chat"]',
              'div.ds-theme div[class*="scrollable"]',
              'div.ds-theme',
              'div#root'
          ];

          for (const selector of selectors) {
              const container = document.querySelector(selector);
              if (container) {
                  const scrollable = isScrollable(container);
                  const isSidebar = container.className.includes('sidebar') ||
                                   container.parentElement?.className.includes('sidebar') ||
                                   container.querySelector('nav') !== null;
                  if (!isSidebar && (scrollable || selector === 'div._3919b83' || selector === 'div.dad65929' || selector.includes('chat'))) {
                      cachedContainer = { container, selector };
                      return cachedContainer;
                  }
              }
          }

          for (const selector of selectors) {
              const container = document.querySelector(selector);
              if (container) {
                  const isSidebar = container.className.includes('sidebar') ||
                                   container.parentElement?.className.includes('sidebar') ||
                                   container.querySelector('nav') !== null;
                  if (!isSidebar) {
                      cachedContainer = { container, selector };
                      return cachedContainer;
                  }
              }
          }

          console.error('No suitable chat container found. Tried selectors:', selectors);
          return null;
      }

      // Function to apply the custom avatar
      function applyAvatar(imageData) {
          const existingAvatar = document.getElementById('custom-ai-avatar');
          if (existingAvatar) {
              existingAvatar.remove();
          }

          const result = findChatContainer();
          if (!result) {
              console.error('Cannot apply avatar: No valid chat container found.');
              return;
          }

          const { container, selector } = result;
          console.log(`Applying avatar to container: ${selector}`);

          const avatarImg = document.createElement('img');
          avatarImg.id = 'custom-ai-avatar';
          avatarImg.src = imageData;
          avatarImg.style.position = isScrollable(container) ? 'sticky' : 'absolute';
          avatarImg.style.top = '180px';
          avatarImg.style.left = '80px';
          avatarImg.style.width = '400px';
          avatarImg.style.height = '400px';
          avatarImg.style.borderRadius = '20%';
          avatarImg.style.objectFit = 'cover';
          avatarImg.style.zIndex = '100';
          avatarImg.style.marginRight = '10px';

          container.style.position = 'relative';
          container.prepend(avatarImg);
      }

      // Function to remove the custom avatar
      function removeAvatar() {
          const existingAvatar = document.getElementById('custom-ai-avatar');
          if (existingAvatar) {
              existingAvatar.remove();
          }
      }

      // Function to load and apply the stored avatar
      function loadStoredAvatar() {
          const storedAvatar = GM_getValue('customAIAvatar', null);
          if (storedAvatar) {
              applyAvatar(storedAvatar);
          }
      }

      // Function to observe DOM changes in chat container
      function observeDOM() {
          if (observer) {
              observer.disconnect();
          }

          const result = findChatContainer();
          if (!result) return;

          const { container } = result;
          observer = new MutationObserver(() => {
              const now = Date.now();
              if (now - lastUpdate < DEBOUNCE_DELAY) return;
              lastUpdate = now;

              if (isChatSubpage()) {
                  const storedAvatar = GM_getValue('customAIAvatar', null);
                  if (storedAvatar && !document.getElementById('custom-ai-avatar')) {
                      console.log('DOM changed, reapplying avatar');
                      applyAvatar(storedAvatar);
                  }
              }
          });
          observer.observe(container, { childList: true, subtree: true });
      }

      // Debounce function to limit update frequency
      function debounce(func, delay) {
          let timeout;
          return function(...args) {
              clearTimeout(timeout);
              timeout = setTimeout(() => func.apply(this, args), delay);
          };
      }

      // Function to update script state based on URL
      const updateScriptState = debounce(() => {
          if (isChatSubpage()) {
              console.log('On chat subpage, activating script');
              createUploadButton();
              loadStoredAvatar();
              observeDOM();
          } else {
              console.log('Not on chat subpage, deactivating script');
              removeUploadButton();
              removeAvatar();
              if (observer) {
                  observer.disconnect();
                  observer = null;
              }
              cachedContainer = null; // Clear cached container
          }
      }, DEBOUNCE_DELAY);

      // Initial check
      updateScriptState();

      // Override pushState to detect SPA navigation
      const originalPushState = history.pushState;
      history.pushState = function() {
          originalPushState.apply(this, arguments);
          updateScriptState();
      };
  })();