// ==UserScript==
// @name         Reddit Search on Google
// @version      1.0.0
// @description  Adds a 'Reddit' button to Google Search for instant Reddit-only results
// @author       Adolanium
// @namespace    https://github.com/adolanium
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507328/Reddit%20Search%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/507328/Reddit%20Search%20on%20Google.meta.js
// ==/UserScript==

(() => {
  const REDDIT_DOMAIN = 'reddit.com';
  const BUTTON_TEXT = 'Reddit';
  const RETRY_DELAY = 500;
  const MAX_RETRIES = 10;

  const createButton = () => {
    const container = document.createElement('div');
    container.className = 'T7Ko6';

    const button = document.createElement('div');
    button.className = 'BaegVc YmvwI';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.textContent = BUTTON_TEXT;

    button.addEventListener('click', handleButtonClick);

    container.appendChild(button);
    return container;
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    let query = searchParams.get('q') || '';
    query = query.replace(new RegExp(`\\+site:${REDDIT_DOMAIN}|site:${REDDIT_DOMAIN}`), '');
    query += ` site:${REDDIT_DOMAIN}`;

    searchParams.set('q', query.trim());
    url.search = searchParams.toString();

    window.location.href = url.toString();
  };

  const insertButton = (retryCount = 0) => {
    const toolsButton = document.querySelector('.T7Ko6');
    if (toolsButton) {
      toolsButton.parentElement.insertBefore(createButton(), toolsButton.nextSibling);
      return;
    }

    if (retryCount < MAX_RETRIES) {
      setTimeout(() => insertButton(retryCount + 1), RETRY_DELAY);
    }
  };

  insertButton();
})();