// ==UserScript==
// @name         Lemmy Post Keyword Filter
// @namespace    https://zetaphor.com/
// @homepageURL	 https://github.com/Zetaphor/lemmy-keyword-filter
// @supportURL	 https://github.com/Zetaphor/lemmy-keyword-filter/issues
// @version      1.1
// @license	     WTFPL
// @description  Automatically hide posts that match keywords from Lemmy sites.
// @author       Zetaphor
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/471718/Lemmy%20Post%20Keyword%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471718/Lemmy%20Post%20Keyword%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Check if the main Lemmy selector is present
  const lemmySelectorPresent = document.querySelector('#app.lemmy-site');
  if (!lemmySelectorPresent) {
    console.log('Not a Lemmy site. Script will not run.');
    return;
  }

  // Function to hide the post element and the preceding <hr> tag
  function hidePost(postElement) {
    postElement.style.display = 'none';
    const precedingHR = postElement.previousElementSibling;
    if (precedingHR && precedingHR.tagName === 'HR') {
      precedingHR.style.display = 'none';
    }
  }

  // Function to check if the post title contains any of the keywords
  function checkKeywords(postElement, keywords) {
    const postTitle = postElement.querySelector('.post-title span');
    if (!postTitle) return;

    const titleText = postTitle.innerText.toLowerCase();
    for (const keyword of keywords) {
      if (titleText.includes(keyword.toLowerCase())) {
        hidePost(postElement);
        break;
      }
    }
  }

  // Main function to apply the keyword filtering
  function filterPostsByKeywords(keywords) {
    // Do nothing if the keyword list is empty
    if (keywords.length === 0) return;

    const postListings = document.querySelectorAll('.post-listing');
    postListings.forEach((postElement) => {
      checkKeywords(postElement, keywords);
    });
  }

  // Settings page to edit the list of keywords
  function createSettingsPage() {
    const settingsHTML = `
      <div>
        <h2 style="color: white;">Lemmy Keyword Filter Settings</h2>
        <label for="keyword-list" style="color: white;">Enter keywords (comma-separated):</label>
        <br>
        <input type="text" id="keyword-list" style="width: 300px;" value="">
        <br><br>
        <button id="save-button">Save</button>
      </div>
    `;

    const popupDiv = document.createElement('div');
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '20%';
    popupDiv.style.left = '20%';
    popupDiv.style.width = '60%';
    popupDiv.style.backgroundColor = 'grey';
    popupDiv.style.color = 'white';
    popupDiv.style.padding = '20px';
    popupDiv.innerHTML = settingsHTML;
    document.body.appendChild(popupDiv);

    const saveButton = document.getElementById('save-button');
    const keywordListInput = document.getElementById('keyword-list');

    // Load the saved keywords and display them in the input field
    const savedKeywords = GM_getValue('lemmyKeywords', []);
    keywordListInput.value = savedKeywords.join(', ');

    // Save the keywords when the Save button is clicked
    saveButton.addEventListener('click', () => {
      let keywords = keywordListInput.value.split(',').map((keyword) => keyword.trim());
      keywords = keywords.filter(keyword => keyword.length > 0); // filter out empty strings
      GM_setValue('lemmyKeywords', keywords);
      filterPostsByKeywords(keywords);
      popupDiv.remove(); // Close the settings page after saving
    });
  }

  // Function to open the settings page
  function openSettingsPage() {
    createSettingsPage();
  }

  // Add the settings page option to the Tampermonkey menu
  GM_registerMenuCommand('Lemmy Keyword Filter Settings', openSettingsPage);

  // Get the saved keywords and apply the filtering
  const savedKeywords = GM_getValue('lemmyKeywords', []);
  filterPostsByKeywords(savedKeywords);
})();
