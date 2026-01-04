// ==UserScript==
// @name         GitHub Ingest Button
// @namespace    http://github.com/
// @version      1.3
// @description  Add an "Ingest" button to GitHub repo pages with improved visual alignment.
// @author       Nighthawk
// @match        https://github.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524064/GitHub%20Ingest%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524064/GitHub%20Ingest%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addIngestButton() {
    console.log('Attempting to add Ingest button...');

    // Locate the container for header actions (Watch, Fork, Star, etc.)
    const actionList = document.querySelector('.pagehead-actions');
    if (!actionList) {
      console.log('Action list not found. Retrying in 500ms.');
      return setTimeout(addIngestButton, 500); // Retry if not yet loaded
    }

    // Prevent duplicate insertion by checking for our marker class.
    if (document.querySelector('.ingest-button')) {
      console.log('Ingest button already exists.');
      return;
    }

    // Create a new list item using GitHub’s own flex-based styling.
    const listItem = document.createElement('li');
    listItem.className = 'd-flex';

    // Create the button element
    const button = document.createElement('button');
    button.className = 'btn btn-sm btn-secondary ingest-button'; // Added btn-secondary for GitHub styling
    button.type = 'button'; // Specify button type

    // Add a click handler
    button.addEventListener('click', () => {
      const currentUrl = window.location.href;
      const repoRegex = /^https:\/\/github\.com\/([^\/]+\/[^\/?#]+)/i;
      const match = currentUrl.match(repoRegex);
      if (match && match[1]) {
        const repoPath = match[1];
        const ingestUrl = 'https://gitingest.com/' + repoPath;
        window.open(ingestUrl, '_blank');
      } else {
        alert('Unable to parse repository path from the URL.');
      }
    });

    // Create the SVG icon element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "currentColor");
    svg.style.marginRight = "4px";
    svg.innerHTML = `
      <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" stroke-width="1"/>
      <path d="M5 8a1 1 0 0 1 2 0v1H5V8zm4 0a1 1 0 0 1 2 0v1H9V8zm-1.5 1.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z" fill="currentColor"/>
    `;

    // Append the SVG icon and text to the button
    button.appendChild(svg);
    button.appendChild(document.createTextNode('Ingest'));

    // Insert the button inside our list item
    listItem.appendChild(button);

    // Insert the new list item into the action list.
    const firstItem = actionList.firstElementChild;
    if (firstItem) {
      actionList.insertBefore(listItem, firstItem);
    } else {
      actionList.appendChild(listItem);
    }
    console.log('Ingest button added successfully.');
  }

  // Run when the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addIngestButton);
  } else {
    addIngestButton();
  }

  // Re-run the function if GitHub’s PJAX (or similar) replaces parts of the page.
  const observer = new MutationObserver(() => {
    if (!document.querySelector('.ingest-button')) {
      console.log('Ingest button not found. Re-adding...');
      addIngestButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();