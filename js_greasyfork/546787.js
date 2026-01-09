// ==UserScript==
// @name          GitHub - Latest
// @version       1.9.3
// @description   Always keep an eye on the latest activity of your favorite projects
// @author        Journey Over
// @license       MIT
// @match         *://github.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         none
// @run-at        document-end
// @icon          https://www.google.com/s2/favicons?sz=64&domain=github.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/546787/GitHub%20-%20Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/546787/GitHub%20-%20Latest.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const logger = Logger('GH - Latest', { debug: false });
  const BUTTON_ID = 'latest-issues-button';
  const QUERY_STRING = 'q=sort%3Aupdated-desc';
  const NAVIGATION_SELECTOR = 'nav[aria-label="Repository"] > ul';

  // Find Issues tab first
  const findTemplateTab = (navigationBody) => {
    const issuesAnchor = navigationBody.querySelector('a[href*="/issues"]');
    if (issuesAnchor) {
      const listItem = issuesAnchor.closest('li');
      if (listItem) return listItem;
      return issuesAnchor.closest(':scope > *') || issuesAnchor;
    }
    return null;
  };

  // Clone template tab and transform it into "Latest issues" with custom icon and query
  const createLatestIssuesTab = (templateTab) => {
    const clonedTab = templateTab.cloneNode(true);
    const anchorElement = clonedTab.querySelector('a') || clonedTab;

    if (!anchorElement) return clonedTab;

    anchorElement.id = BUTTON_ID;

    // Preserve base path while replacing query string for latest issues
    try {
      const urlObject = new URL(anchorElement.href, location.origin);
      anchorElement.href = `${urlObject.pathname}?${QUERY_STRING}`;
    } catch {
      anchorElement.href = `${(anchorElement.href || '#').split('?')[0]}?${QUERY_STRING}`;
    }

    // Remove aria-current to prevent underline styling for latest issues tab
    anchorElement.removeAttribute('aria-current');

    anchorElement.style.float = 'none';
    if (clonedTab.style) clonedTab.style.marginLeft = 'auto';

    // Replace existing icon with flame SVG for "latest" indicator
    const svgElement = clonedTab.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('viewBox', '0 0 16 16');
      svgElement.innerHTML = `<path fill-rule="evenodd" d="M5.05 0.31c0.81 2.17 0.41 3.38-0.52 4.31-0.98 1.05-2.55 1.83-3.63 3.36
      -1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-0.3-6.61-0.61 2.03 0.53 3.33 1.94 2.86
      1.39-0.47 2.3 0.53 2.27 1.67-0.02 0.78-0.31 1.44-1.13 1.81 3.42-0.59 4.78-3.42
      4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52 0.13-2.03 1.13-1.89 2.75 0.09 1.08-1.02
      1.8-1.86 1.33-0.67-0.41-0.66-1.19-0.06-1.78 1.25-1.23 1.75-4.09-1.88-6.22l-0.02-0.02z"/>`;
    }

    const textSpan = clonedTab.querySelector('[data-component="text"]');
    if (textSpan) {
      textSpan.textContent = 'Latest issues';
      textSpan.setAttribute('data-content', 'Latest issues');
    } else {
      const simpleSpan = clonedTab.querySelector('span');
      if (simpleSpan) simpleSpan.textContent = 'Latest issues';
    }

    const counterElement = clonedTab.querySelector('[data-component="counter"], .Counter, .counter');
    if (counterElement) counterElement.remove();

    return clonedTab;
  };

  const addLatestIssuesButton = () => {
    // If the button already exists in the DOM, do nothing
    if (document.getElementById(BUTTON_ID)) return;

    const navigationBody = document.querySelector(NAVIGATION_SELECTOR);
    if (!navigationBody) {
      logger.debug('Navigation selector not found');
      return;
    }

    const templateTab = findTemplateTab(navigationBody);
    if (!templateTab) {
      logger.debug('Template tab not found');
      return;
    }

    logger.debug('Adding latest issues button');
    navigationBody.appendChild(createLatestIssuesTab(templateTab));
  };

  const initialize = () => {
    logger('Initializing GitHub Latest Issues script');

    // 1. Initial attempt
    addLatestIssuesButton();

    // 2. Persistent Observer: This watches for GitHub wiping the nav bar
    // We do NOT disconnect this observer. It stays alive to fight React re-renders.
    const observer = new MutationObserver(() => {
      addLatestIssuesButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 3. Handle specific Turbo events (SPA navigation)
    document.addEventListener('turbo:render', () => {
      logger.debug('Turbo render event, re-adding latest issues button');
      addLatestIssuesButton();
    });
  };

  initialize();
})();
