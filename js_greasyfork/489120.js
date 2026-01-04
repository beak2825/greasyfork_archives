// ==UserScript==
// @name         actually gives free nitro
// @version      2.3
// @description  free nitro but you might get banned
// @author       ∫(Ace)³dx
// @match        https://discord.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addElement
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/489120/actually%20gives%20free%20nitro.user.js
// @updateURL https://update.greasyfork.org/scripts/489120/actually%20gives%20free%20nitro.meta.js
// ==/UserScript==

(async window => {
  'use strict';

  const replacementsKey = 'customReplacements';

  // Initialize custom replacements
  let customReplacements = await GM.getValue(replacementsKey, []);

  // Create a function to update the UI with current replacements
  function updateUI() {
    // Clear previous UI
    const existingUI = document.getElementById('custom-replacements-ui');
    if (existingUI) {
      existingUI.remove();
    }

    // Create UI elements
    const uiContainer = document.createElement('div');
    uiContainer.id = 'custom-replacements-ui';

    const header = document.createElement('h2');
    header.textContent = 'Custom Replacements';

    const replacementsList = document.createElement('ul');
    for (let i = 0; i < customReplacements.length; i++) {
      const replacement = customReplacements[i];
      const item = document.createElement('li');
      item.innerHTML = `
        <input class="pattern-input" type="text" value="${replacement.pattern.source}" placeholder="Enter pattern..." />
        ->
        <input class="url-input" type="text" value="${replacement.url}" placeholder="Enter URL..." />
        <button class="edit-button" data-index="${i}">${replacement.pattern.source}</button>
        <button class="remove-button" data-index="${i}">Remove</button>
      `;
      replacementsList.appendChild(item);
    }

    uiContainer.appendChild(header);
    uiContainer.appendChild(replacementsList);

    // Add UI to the page
    document.body.appendChild(uiContainer);

    // Add event listeners for editing and removing
    const editButtons = document.querySelectorAll('.edit-button');
    const removeButtons = document.querySelectorAll('.remove-button');

    editButtons.forEach(button => {
      button.addEventListener('click', handleEdit);
    });

    removeButtons.forEach(button => {
      button.addEventListener('click', handleRemove);
    });
  }

  // Function to open a prompt using SweetAlert2 for adding replacements
  async function openAddPrompt() {
    const { value: pattern } = await Swal.fire({
      title: 'Enter the input string to replace (e.g. :bigsob:):',
      input: 'text',
      inputPlaceholder: 'Enter the input...',
    });

    if (pattern) {
      const { value: url } = await Swal.fire({
        title: 'Enter the replacement URL (a reload is required after this):',
        input: 'text',
        inputPlaceholder: 'Enter the URL...',
      });

      if (url) {
        customReplacements.push({ pattern: new RegExp(pattern, 'g'), url });
        GM.setValue(replacementsKey, customReplacements).then(() => {
          updateUI();
        });
      }
    }
  }

  // Function to open a prompt using SweetAlert2 for editing replacements
  async function openEditPrompt(index) {
    const { value: newPattern } = await Swal.fire({
      title: 'Enter input string to be edited:',
      input: 'text',
      inputValue: '',
    });

    if (newPattern !== undefined) {
      const { value: newUrl } = await Swal.fire({
        title: 'Edit replacement URL (if you wish to remove it, enter the input string below) (a reload is required after this):',
        input: 'text',
        inputValue: '',
      });

      if (newUrl !== undefined) {
        customReplacements[index] = { pattern: new RegExp(newPattern, 'g'), url: newUrl };
        GM.setValue(replacementsKey, customReplacements).then(() => {
          updateUI();
        });
      }
    }
  }

  // Function to handle removing replacements
  async function handleRemove(event) {
    const index = event.target.getAttribute('data-index');
    customReplacements.splice(index, 1);
    GM.setValue(replacementsKey, customReplacements).then(() => {
      updateUI();
    });
  }

  // Create a menu command to open the prompt for adding replacements
  GM.registerMenuCommand('Add Custom Replacement', openAddPrompt);

  // Register a menu command for each edit button
  customReplacements.forEach((replacement, index) => {
    GM.registerMenuCommand(`Edit Existing Prompts`, () => {
      openEditPrompt(index);
    });
  });

  // Intercept XMLHttpRequest and apply replacements
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(method, url) {
    if ((method.toUpperCase() === 'POST' || method.toUpperCase() === 'PATCH') && /https:\/\/discord\.com\/api\/v9\/channels\/[^\/]+\/messages.*?/.test(url)) {
      const originalSend = this.send;
      this.send = function(data) {
        try {
          let newData = data;
          for (const replacement of customReplacements) {
            newData = newData.replace(/"content":"(.*?)"/g, (match, content) => {
              let modifiedContent = content.replace(replacement.pattern, replacement.url);
              return `"content":"${modifiedContent}"`;
            });
          }

          originalSend.call(this, newData);
        } catch (error) {
          console.error('Error modifying data:', error);
          originalSend.call(this, data);
        }
      };
    }

    originalOpen.apply(this, arguments);
  };


  // Update the UI with current replacements
  updateUI();

})(window);
