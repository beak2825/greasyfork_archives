// ==UserScript==
// @name        Xoul AI Background Manager
// @author      LuxTallis
// @namespace   xoul.ai Background Manager
// @match       https://xoul.ai/*
// @grant       none
// @license     MIT
// @version     1.0
// @description Customize the chat interface on xoul.ai
// @icon        https://i.imgur.com/REqi6Iw.png
// @downloadURL https://update.greasyfork.org/scripts/521039/Xoul%20AI%20Background%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/521039/Xoul%20AI%20Background%20Manager.meta.js
// ==/UserScript==

(function () {
  'use strict';

    let currentChatId = null; // To track the active chat ID

function observeChatNavigation(callback) {
  let lastPathname = window.location.pathname;

  // Check for URL changes periodically
  setInterval(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      callback(); // Trigger the callback on URL change
    }
  }, 500); // Check every 500ms
}


  // Function to get the current chat ID from the URL
  function getChatId() {
    const match = window.location.pathname.match(/\/chats\/([a-f0-9\-]+)/);
    return match ? match[1] : null;
  }

// Store a background for the current chat
function saveBackgroundImageForChat(chatId, url) {
  if (!chatId) return;
  let data = localStorage.getItem('background_images');
  data = data ? JSON.parse(data) : {};
  data[chatId] = url; // Save the background for this chat
  localStorage.setItem('background_images', JSON.stringify(data));
}


// Retrieve the background for the current chat
function getBackgroundImageForChat(chatId) {
  if (!chatId) return null;
  let data = localStorage.getItem('background_images');
  data = data ? JSON.parse(data) : {};
  return data[chatId] || null; // Return the saved background, or null if none
}

    // Reapply the background for the current chat on page load
function reapplyBackgroundForCurrentChat() {
  const chatId = getChatId();
  if (!chatId) return; // Exit if chatId is not valid
  const savedBackground = getBackgroundImageForChat(chatId);
  if (savedBackground) {
    applyBackgroundImage(savedBackground);
  }
}

    function handleDynamicChatSwitch() {
  const newChatId = getChatId();
  if (newChatId && newChatId !== currentChatId) {
    currentChatId = newChatId; // Update the tracked chat ID
    const savedBackground = getBackgroundImageForChat(newChatId);

    if (savedBackground) {
      applyBackgroundImage(savedBackground); // Apply the new background
    } else {
      removeBackgroundImage(); // Reset to default if no background is set
    }
  }
}


  // Get all background images for all chats from localStorage
  function getAllBackgroundImages() {
    return JSON.parse(localStorage.getItem('background_images') || '{}');
  }

  // Save the image library to localStorage
  function saveLibrary(library) {
    localStorage.setItem('background_image_library', JSON.stringify(library));
  }

  // Get the image library from localStorage
  function getLibrary() {
    return JSON.parse(localStorage.getItem('background_image_library') || '[]');
  }

  // Add an image URL to the library
  function addToLibrary(url) {
    const library = getLibrary();
    if (!url || library.includes(url)) return;
    library.push(url);
    saveLibrary(library);
  }

  // Remove an image URL from the library
  function removeFromLibrary(url) {
    const library = getLibrary().filter((image) => image !== url);
    saveLibrary(library);
  }

  // Apply background image for the specific chat
  function applyBackgroundImage(url) {
    const css = `
      .ChatUI_container_chatui__m5apj {
        background-image: url('${url}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    `;
    let styleElement = document.getElementById('customBackgroundStyle');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'customBackgroundStyle';
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = css;
  }

  // Remove the background for the current chat (revert to default)
  function removeBackgroundImage() {
    const styleElement = document.getElementById('customBackgroundStyle');
    if (styleElement) {
      styleElement.remove();
    }
  }

  function createCustomizationPanel() {
    const chatId = getChatId(); // Get the current chat ID
    const panel = document.createElement('div');
    panel.id = 'customizationPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.backgroundColor = '#0a0a0a';
    panel.style.color = 'white';
    panel.style.borderRadius = '5px';
    panel.style.padding = '20px';
    panel.style.zIndex = '9999';
    panel.style.fontFamily = 'Montserrat, sans-serif';
    panel.style.maxWidth = '1250px';
    panel.style.minWidth = '375px';
    panel.style.width = 'auto';

    const label = document.createElement('label');
    label.textContent = 'Add Image URL to Library:';
    label.style.display = 'block';
    label.style.marginBottom = '5px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter image URL';
    input.style.width = '100%';
    input.style.marginBottom = '10px';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.style.marginTop = '10px';
    addButton.style.padding = '5px 10px';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '3px';
    addButton.style.backgroundColor = '#444';
    addButton.style.color = 'white';
    addButton.style.fontFamily = 'Montserrat, sans-serif';
    addButton.addEventListener('click', () => {
      const url = input.value.trim();
      if (url) {
        addToLibrary(url);
        input.value = '';
        renderLibrary();
      }
    });

    const removeBackgroundButton = document.createElement('button');
    removeBackgroundButton.textContent = 'Remove Background';
    removeBackgroundButton.style.marginTop = '10px';
    removeBackgroundButton.style.padding = '5px 10px';
    removeBackgroundButton.style.border = 'none';
    removeBackgroundButton.style.borderRadius = '3px';
    removeBackgroundButton.style.backgroundColor = '#d9534f';
    removeBackgroundButton.style.color = 'white';
    removeBackgroundButton.style.fontFamily = 'Montserrat, sans-serif';
    removeBackgroundButton.addEventListener('click', () => {
      removeBackgroundImage();
      saveBackgroundImageForChat(chatId, null); // Remove background for current chat
    });

    const libraryContainer = document.createElement('div');
    libraryContainer.id = 'libraryContainer';
    libraryContainer.style.marginTop = '10px';
    libraryContainer.style.overflowX = 'auto';
    libraryContainer.style.display = 'flex';
    libraryContainer.style.flexWrap = 'wrap';
    libraryContainer.style.gap = '15px';
    libraryContainer.style.paddingBottom = '10px';
    libraryContainer.style.borderTop = '1px solid #555';
    libraryContainer.style.paddingTop = '10px';
    libraryContainer.style.whiteSpace = 'nowrap';
    libraryContainer.style.maxHeight = '380px';
    libraryContainer.style.height = 'auto';

    function renderLibrary() {
      libraryContainer.innerHTML = '';
      const library = getLibrary();
      library.forEach((url) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.flex = '0 0 auto';

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';
        img.style.width = '99px';
        img.style.height = '64px';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #fff';
        img.style.borderRadius = '3px';
        img.style.cursor = 'pointer';
        img.title = url;

        img.addEventListener('click', () => {
          applyBackgroundImage(url);
          saveBackgroundImageForChat(chatId, url); // Save background for current chat
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.style.position = 'absolute';
        removeButton.style.top = '5px';
        removeButton.style.right = '5px';
        removeButton.style.backgroundColor = 'red';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '50%';
        removeButton.style.cursor = 'pointer';
        removeButton.style.width = '20px';
        removeButton.style.height = '20px';
        removeButton.style.textAlign = 'center';
        removeButton.style.fontSize = '12px';
        removeButton.addEventListener('click', (e) => {
          e.stopPropagation();
          removeFromLibrary(url);
          renderLibrary();
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
        libraryContainer.appendChild(imgContainer);
      });
    }

    panel.appendChild(label);
    panel.appendChild(input);
    panel.appendChild(addButton);
    panel.appendChild(removeBackgroundButton);
    panel.appendChild(libraryContainer);
    document.body.appendChild(panel);

    renderLibrary();

    // Handle panel close when clicking outside
    const closePanel = (event) => {
      const button1 = document.getElementById('customButton'); // Ensure we reference the button here
      if (!panel.contains(event.target) && !button1.contains(event.target)) {
        panel.remove();
        document.removeEventListener('click', closePanel);
      }
    };

    document.addEventListener('click', closePanel);
  }

function ensureButtonUnderTarget() {
  const sidebarNav = document.querySelector('.Sidebar_nav__a5780');
  const existingButton = sidebarNav ? sidebarNav.querySelector('button:nth-child(7)') : null; // Check if the 7th button exists

  if (existingButton) {
    // If the 7th button exists, insert the custom button below it
    if (!document.querySelector('#customButton')) {
      const button = document.createElement('button');
      button.id = 'customButton';
      button.textContent = '♥';
      button.style.cssText = 'margin: 10px 0; padding: 5px 10px; background-color: #007BFF00; color: white; border: none; border-radius: 5px; cursor: pointer; display: block;';

      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from closing the panel immediately
        createCustomizationPanel();
      });

      existingButton.insertAdjacentElement('afterend', button); // Insert the button below the 7th button
    }
  } else {
    // If the 7th button doesn't exist, add the new button below the target link
    const targetElement = document.querySelector('a.Sidebar_link__0EvG_:nth-child(6)');
    if (targetElement && !document.querySelector('#customButton')) {
      const button = document.createElement('button');
      button.id = 'customButton';
      button.textContent = '♥';
      button.style.cssText = 'margin: 10px 0; padding: 5px 10px; background-color: #007BFF00; color: white; border: none; border-radius: 5px; cursor: pointer; display: block;';

      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from closing the panel immediately
        createCustomizationPanel();
      });

      targetElement.insertAdjacentElement('afterend', button); // Insert the button below the target element
    }
  }
}


  const observer = new MutationObserver(() => {
    ensureButtonUnderTarget();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  ensureButtonUnderTarget();

    // Observe navigation and dynamically update the background
observeChatNavigation(handleDynamicChatSwitch);


  // Call this after page load
reapplyBackgroundForCurrentChat();

})();
