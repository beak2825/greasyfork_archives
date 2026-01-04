// ==UserScript==
// @name        c.ai Background Image Library (Improved)
// @author      LuxTallis
// @namespace   c.ai Background Image Library Improved
// @match       https://character.ai/*
// @grant       none
// @license     MIT
// @version     1.1
// @description Customize the chat interface with an improved image library for backgrounds, with multiple rows of thumbnails and click-outside popup closure.
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/518794/cai%20Background%20Image%20Library%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518794/cai%20Background%20Image%20Library%20%28Improved%29.meta.js
// ==/UserScript==

(function () {
  function saveLibrary(library) {
    localStorage.setItem('background_image_library', JSON.stringify(library));
  }

  function getLibrary() {
    return JSON.parse(localStorage.getItem('background_image_library') || '[]');
  }

  function addToLibrary(url) {
    const library = getLibrary();
    if (!url || library.includes(url)) return;
    library.push(url);
    saveLibrary(library);
  }

  function removeFromLibrary(url) {
    const library = getLibrary().filter((image) => image !== url);
    saveLibrary(library);
  }

  // Function to get the current chat ID
  function getChatID() {
    const path = window.location.pathname;
    const match = path.match(/\/chat\/([^/]+)/);  // Matches chat ID in URL
    return match ? match[1] : null;  // Return the chat ID if found
  }

  // Apply background image for the specific chat
  function applyBackgroundImage(url) {
    const chatID = getChatID();
    if (!chatID) return; // If no chat ID found, return

    const chatKey = `background_image_${chatID}`;
    localStorage.setItem(chatKey, url);  // Save the background URL for this chat

    const css = `
      body {
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

  function createCustomizationPanel() {
    const panel = document.createElement('div');
    panel.id = 'customizationPanel';
    panel.style.position = 'fixed';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    panel.style.backgroundColor = '#1e1e1e';
    panel.style.color = 'white';
    panel.style.borderRadius = '5px';
    panel.style.padding = '20px';
    panel.style.zIndex = '9999';
    panel.style.fontFamily = 'Montserrat, sans-serif';
    panel.style.maxWidth = '1250px'; // 2.5x wider
    panel.style.minWidth = '875px';  // 2.5x wider
    panel.style.width = 'auto'; // Ensure auto width based on content

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

    const libraryContainer = document.createElement('div');
    libraryContainer.id = 'libraryContainer';
    libraryContainer.style.marginTop = '10px';
    libraryContainer.style.overflowX = 'auto';
    libraryContainer.style.display = 'flex';
    libraryContainer.style.flexWrap = 'wrap'; // Allow wrapping into multiple lines
    libraryContainer.style.gap = '15px'; // Increased gap between thumbnails
    libraryContainer.style.paddingBottom = '10px';
    libraryContainer.style.borderTop = '1px solid #555';
    libraryContainer.style.paddingTop = '10px';
    libraryContainer.style.whiteSpace = 'nowrap'; // Prevent wrapping of thumbnails
    libraryContainer.style.maxHeight = '380px';  // Ensure 3 rows of thumbnails
    libraryContainer.style.height = 'auto';

    function renderLibrary() {
      libraryContainer.innerHTML = '';
      const library = getLibrary();
      library.forEach((url) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.flex = '0 0 auto'; // Ensures the thumbnail stays at its natural width

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Preview';
        img.style.width = '99px';  // Half the size
        img.style.height = '64px'; // Half the size
        img.style.objectFit = 'cover';
        img.style.border = '1px solid #fff';
        img.style.borderRadius = '3px';
        img.style.cursor = 'pointer';
        img.title = url;

        img.addEventListener('click', () => {
          applyBackgroundImage(url);
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
    panel.appendChild(libraryContainer);
    document.body.appendChild(panel);

    renderLibrary();

    // Close the panel when clicking outside of it
    document.addEventListener('click', function closeOnOutsideClick(event) {
      if (!panel.contains(event.target) && !mainButton.contains(event.target)) {
        panel.remove();
        document.removeEventListener('click', closeOnOutsideClick); // Remove the event listener
      }
    });
  }

  function createButton(symbol, onClick) {
    const button = document.createElement('button');
    button.innerHTML = symbol;
    button.style.position = 'fixed';
    button.style.top = '82px';
    button.style.right = '5px';
    button.style.width = '22px';
    button.style.height = '22px';
    button.style.backgroundColor = '#444';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Montserrat, sans-serif';
    button.addEventListener('click', onClick);
    return button;
  }

  const mainButton = createButton('🖼️', () => {
    const panelExists = document.getElementById('customizationPanel');
    if (!panelExists) {
      createCustomizationPanel();
    }
  });

  document.body.appendChild(mainButton);

  // Function to update background when URL changes
  function updateBackgroundForCurrentChat() {
    const chatID = getChatID();
    const currentImageUrl = chatID ? localStorage.getItem(`background_image_${chatID}`) : '';
    applyBackgroundImage(currentImageUrl || '');
  }

  // Initial background update
  updateBackgroundForCurrentChat();

  // Update background whenever the URL changes
  window.addEventListener('popstate', updateBackgroundForCurrentChat);
  window.addEventListener('pushstate', updateBackgroundForCurrentChat);
  window.addEventListener('replacestate', updateBackgroundForCurrentChat);
})();
