// ==UserScript==
// @name          GitHub - Latest
// @version       1.9.1
// @description   Always keep an eye on the latest activity of your favorite projects
// @author        Journey Over
// @license       MIT
// @match         *://github.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         none
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

  // Find Issues tab first (preferred template), fallback to any tab with anchor
  const findTemplateTab = (navigationBody) => {
    const issuesAnchor = navigationBody.querySelector('a[href*="/issues"]');
    if (issuesAnchor) {
      logger.debug('Issues tab found as template');
      return issuesAnchor.closest(':scope > *') || issuesAnchor;
    }

    const fallback = [...navigationBody.children].find(child => child.querySelector && child.querySelector('a'));
    if (fallback) logger.debug('Fallback tab found as template');
    return fallback || null;
  };

  // Clone template tab and transform it into "Latest issues" with custom icon and query
  const createLatestIssuesTab = (templateTab) => {
    const clonedTab = templateTab.cloneNode(true);
    const anchorElement = clonedTab.querySelector('a') || clonedTab;

    if (!anchorElement) {
      logger.warn('Template tab has no anchor');
      return clonedTab;
    }

    anchorElement.id = BUTTON_ID;

    // Preserve base path while replacing query string for latest issues
    try {
      const urlObject = new URL(anchorElement.href, location.origin);
      anchorElement.href = `${urlObject.pathname}?${QUERY_STRING}`;
    } catch {
      anchorElement.href = `${(anchorElement.href || '#').split('?')[0]}?${QUERY_STRING}`;
      logger.warn('Fallback href applied for Latest issues tab');
    }

    // Position at the far right of the nav bar
    anchorElement.style.float = 'right';
    if (clonedTab.style) clonedTab.style.marginLeft = 'auto';

    // Replace existing icon with flame SVG for "latest" indicator
    const svgElement = clonedTab.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('viewBox', '0 0 16 16');
      svgElement.style.margin = '0 4px';
      svgElement.innerHTML = `<path fill-rule="evenodd" d="M5.05 0.31c0.81 2.17 0.41 3.38-0.52 4.31-0.98 1.05-2.55 1.83-3.63 3.36
      -1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-0.3-6.61-0.61 2.03 0.53 3.33 1.94 2.86
      1.39-0.47 2.3 0.53 2.27 1.67-0.02 0.78-0.31 1.44-1.13 1.81 3.42-0.59 4.78-3.42
      4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52 0.13-2.03 1.13-1.89 2.75 0.09 1.08-1.02
      1.8-1.86 1.33-0.67-0.41-0.66-1.19-0.06-1.78 1.25-1.23 1.75-4.09-1.88-6.22l-0.02-0.02z"/>`;
    }

    const spanElement = clonedTab.querySelector('span');
    if (spanElement) spanElement.textContent = 'Latest issues';

    // Remove counter since we're showing all recent activity, not a specific count
    const counterElement = clonedTab.querySelector('.Counter, .counter');
    if (counterElement) counterElement.remove();

    return clonedTab;
  };

  const addLatestIssuesButton = async () => {
    const NAVIGATION_SELECTOR = 'nav.js-repo-nav > .UnderlineNav-body';

    try {
      const tryAddButton = (navigationBody) => {
        if (!navigationBody) return false;

        if (navigationBody.querySelector(`#${BUTTON_ID}`)) {
          logger.debug('Latest issues button already exists');
          return true;
        }

        const templateTab = findTemplateTab(navigationBody);
        if (!templateTab) {
          logger.warn('No suitable template tab found');
          return false;
        }

        navigationBody.appendChild(createLatestIssuesTab(templateTab));
        logger('Latest issues button added');
        return true;
      };

      const navigationBody = document.querySelector(NAVIGATION_SELECTOR);
      if (tryAddButton(navigationBody)) return;

      // Observe for SPA navigation - GitHub uses dynamic content loading
      const observer = new MutationObserver((_, observerInstance) => {
        const navigationBody = document.querySelector(NAVIGATION_SELECTOR);
        if (tryAddButton(navigationBody)) {
          observerInstance.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      logger.error('Failed to add Latest issues button:', error);
    }
  };

  const debouncedAddButton = debounce(addLatestIssuesButton, 200);

  const initialize = () => {
    debouncedAddButton();
    // Listen for GitHub's Turbo Drive events (SPA navigation)
    document.addEventListener('turbo:render', () => {
      logger.debug('turbo:render detected, updating Latest issues tab');
      debouncedAddButton();
    });
  };

  initialize();
})();
