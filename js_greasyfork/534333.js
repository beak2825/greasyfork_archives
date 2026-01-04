// ==UserScript==
// @name         DeepWiki Button Enhanced
// @namespace    https://github.com/zhsama/deepwiki.git
// @version      1.0
// @description  Adds a DeepWiki button to GitHub repository pages, linking to deepwiki.com/{user}/{repo}. Combines features and optimizes previous scripts.
// @author       zhsama
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// @icon         https://deepwiki.com/icon.png?66aaf51e0e68c818
// @supportURL   https://github.com/zhsama/deepwiki
// @homepageURL  https://github.com/zhsama/deepwiki
// @downloadURL https://update.greasyfork.org/scripts/534333/DeepWiki%20Button%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/534333/DeepWiki%20Button%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = 'deepwiki-button-enhanced';
  let lastUrl = location.href; // Track URL for SPA navigation changes

  // --- Logging ---
  const log = (...args) => console.log('[DeepWiki Button]', ...args);
  const errorLog = (...args) => console.error('[DeepWiki Button]', ...args);

  // --- Page Detection ---
  /**
   * Checks if the current page is a GitHub repository page (not settings, issues list, etc.)
   * @returns {boolean} True if it's a repository page, false otherwise.
   */
  function isRepoPage() {
    try {
      // Basic check: path must have at least user/repo
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) return false;

      // Exclude common non-repo pages that match the basic path structure
      const nonRepoPaths = [
        '/settings', '/issues', '/pulls', '/projects', '/actions',
        '/security', '/pulse', '/graphs', '/search', '/marketplace',
        '/explore', '/topics', '/trending', '/sponsors', '/new',
        '/organizations/', '/codespaces'
      ];
      if (nonRepoPaths.some(p => window.location.pathname.includes(p))) {
        // Allow issues/pulls detail pages
        if ((window.location.pathname.includes('/issues/') || window.location.pathname.includes('/pull/')) && pathParts.length > 3) {
          // It's an issue/PR detail page, potentially show button? For now, let's keep it strict to repo main/code view
          // return true; // Uncomment if you want the button on issue/PR details
          return false; // Keep button only on repo views for now
        }
        return false;
      }

      // Check for main repo container elements (more reliable)
      const mainContentSelectors = [
        'main#js-repo-pjax-container',                     // Older structure
        'div[data-pjax="#repo-content-pjax-container"]', // Newer structure
        '.repohead',                                       // Repo header element
        '.repository-content'                              // Main content area
      ];
      if (mainContentSelectors.some(sel => document.querySelector(sel))) {
        return true;
      }


      // Fallback: If path has user/repo and not excluded, assume it's a repo page.
      // Be cautious with this fallback.
      // log("Falling back to path check for repo page detection.");
      // return true;

      return false; // Stricter check - rely on selectors


    } catch (e) {
      errorLog('Error checking if it is a repo page:', e);
      return false;
    }
  }

  /**
   * Extracts username and repository name from the current URL.
   * @returns {{user: string, repo: string} | null} Object with user/repo or null if not found.
   */
  function getUserAndRepo() {
    try {
      const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
      if (pathParts.length >= 2) {
        // Handle cases like /user/repo/tree/branch or /user/repo/blob/branch/file
        return {
          user: pathParts[0],
          repo: pathParts[1]
        };
      }
    } catch (e) {
      errorLog('Error getting user and repo info:', e);
    }
    return null;
  }

  // --- Button Creation ---
  /**
   * Creates the SVG icon element for the DeepWiki button.
   * @returns {SVGSVGElement} The SVG element.
   */
  function createSVGIconElement() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    // Using a simpler, cleaner icon representation if possible, or the provided one.
    // Let's use the provided complex one for now.
    svg.setAttribute('class', 'octicon'); // Use GitHub's icon class if possible
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '110 110 460 500'); // As provided in script 2
    svg.setAttribute('style', 'margin-right: 4px; vertical-align: text-bottom; color: var(--color-accent-fg);'); // Use CSS variable for color
    // Paths from Script 2 (ensure they are valid and display correctly)
    svg.innerHTML = `<path style="fill:#21c19a" d="M418.73,332.37c9.84-5.68,22.07-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.58,1.06.19.06.37.11.55.16.87.21,1.76.34,2.65.35.04,0,.08.02.13.02.1,0,.19-.03.29-.04.83-.02,1.64-.13,2.45-.32.14-.03.28-.05.42-.09.87-.24,1.7-.59,2.5-1.03.08-.04.17-.06.25-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.06,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.57-1.06-.19-.06-.37-.11-.56-.16-.88-.21-1.76-.34-2.65-.34-.13,0-.26.02-.4.02-.84.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65-2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.24.1.8.44,1.64.79,2.5,1.03.14.04.28.06.42.09.81.19,1.62.3,2.45.32.1,0,.19.04.29.04.04,0,.08-.02.13-.02.89,0,1.77-.13,2.65-.35.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.58-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-.08-.04-.16-.06-.24-.1-.8-.44-1.64-.8-2.51-1.04-.13-.04-.26-.05-.39-.09-.82-.2-1.65-.31-2.49-.33-.13,0-.25-.02-.38-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.75.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.07,5.68-31.9,0-9.84-5.68-15.95-16.27-15.95-27.63s6.11-21.95,15.95-27.63Z"></path><path style="fill:#3969ca" d="M141.09,317.65l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c.08-.04.13-.11.2-.16.78-.48,1.51-1.02,2.15-1.66.1-.1.18-.21.28-.31.57-.6,1.08-1.26,1.51-1.97.07-.12.15-.22.22-.34.44-.77.77-1.6,1.03-2.47.05-.19.1-.37.14-.56.22-.89.37-1.81.37-2.76v-29.43c0-11.36,6.11-21.95,15.96-27.63s22.06-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.57,1.06.19.06.37.11.56.16.87.21,1.76.34,2.64.35.04,0,.09.02.13.02.1,0,.19-.04.29-.04.83-.02,1.65-.13,2.45-.32.14-.03.28-.05.41-.09.87-.24,1.71-.6,2.51-1.04.08-.04.16-.06.24-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.07,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.58-1.06-.19-.06-.37-.11-.55-.16-.88-.21-1.76-.34-2.65-.35-.13,0-.26.02-.4.02-.83.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65-2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22Z"></path><path style="fill:#0294de" d="M396.88,484.35l-50.97-29.43c-.08-.04-.17-.06-.24-.1-.8-.44-1.64-.79-2.51-1.03-.14-.04-.27-.06-.41-.09-.81-.19-1.64-.3-2.47-.32-.13,0-.26-.02-.39-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.76.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.06,5.68-31.9,0-9.84-5.68-15.96-16.27-15.96-27.63v-29.43c0-.95-.15-1.87-.37-2.76-.05-.19-.09-.37-.14-.56-.25-.86-.59-1.69-1.03-2.47-.07-.12-.15.22-.22.34-.43-.71-.94-1.37-1.51-1.97-.1-.1-.18-.21-.28-.31-.65-.63-1.37-1.18-2.15-1.66-.07-.04-.13-.11-.2-.16l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.25.1.8.44,1.63.79,2.5,1.03.14.04.29.06.43.09.8.19,1.61.3,2.43.32.1,0,.2.04.3.04.04,0,.09-.02.13-.02.88,0,1.77-.13,2.64-.34.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.57-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22Z"></path>`;
    return svg;
  }

  /**
   * Creates the DeepWiki button element.
   * @param {string} user - GitHub username.
   * @param {string} repo - GitHub repository name.
   * @returns {HTMLAnchorElement | null} The button element or null on error.
   */
  function createDeepWikiButton(user, repo) {
    try {
      const deepwikiUrl = `https://deepwiki.com/${user}/${repo}`;

      // Find a template button to mimic style (prefer action buttons)
      const selectors = [
        '.BtnGroup button',              // Button group (e.g., Watch/Fork/Star)
        '.BtnGroup a',                   // Sometimes links are used in groups
        'a.btn',                         // General buttons
        'button.btn',
        '[data-hotkey="w"]',             // Watch button hotkey
        '[data-hotkey="s"]',             // Star button hotkey
        '[data-ga-click*="Fork"]'        // Fork button analytics attrib
      ];
      let templateButton = null;
      for (const selector of selectors) {
        // Find a visible button that isn't the deepwiki one itself
        templateButton = Array.from(document.querySelectorAll(selector)).find(btn =>
          btn.offsetParent !== null && !btn.id.startsWith('deepwiki-button') && !btn.closest(`#${BUTTON_ID}`)
        );
        if (templateButton) break;
      }


      // Create button element
      const button = document.createElement('a');
      button.href = deepwikiUrl;
      button.id = BUTTON_ID;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.title = `View Wiki for ${user}/${repo} on DeepWiki`;
      button.setAttribute('data-user', user);
      button.setAttribute('data-repo', repo);
      button.setAttribute('aria-label', `View Wiki for ${user}/${repo} on DeepWiki`);
      button.style.textDecoration = 'none'; // Ensure no underline

      // Apply styles
      if (templateButton) {
        // Mimic classes, filtering out state-specific ones
        const classNames = Array.from(templateButton.classList).filter(cls =>
          !['selected', 'disabled', 'tooltipped', 'js-selected-navigation-item'].includes(cls) &&
          !cls.startsWith('BtnGroup') // Avoid BtnGroup item specific styles if adding outside a group
        );
        // Ensure basic button classes are present if missed
        if (!classNames.some(cls => cls.startsWith('btn') || cls.startsWith('Btn'))) {
          classNames.push('btn'); // Add basic button class
        }
        // Add size class if template had one (e.g., btn-sm)
        if (Array.from(templateButton.classList).some(cls => cls.includes('-sm'))) {
          if (!classNames.includes('btn-sm')) classNames.push('btn-sm');
        } else if (Array.from(templateButton.classList).some(cls => cls.includes('-large'))) {
          if (!classNames.includes('btn-large')) classNames.push('btn-large');
        }


        button.className = classNames.join(' ');
        log('Mimicking styles from:', templateButton, 'Resulting classes:', button.className);


      } else {
        // Fallback basic styling if no template found
        log('No template button found, applying fallback styles.');
        button.className = 'btn btn-sm'; // Default to small button
        // Optional: Add minimal inline styles if needed, but prefer classes
        // button.style.backgroundColor = '#f6f8fa';
        // button.style.border = '1px solid rgba(27,31,36,0.15)';
        // button.style.borderRadius = '6px';
        // button.style.color = '#24292f';
        // button.style.padding = '3px 12px';
        // button.style.fontSize = '12px';
        // button.style.fontWeight = '500';
        // button.style.lineHeight = '20px';
      }


      // Add SVG icon (inside the button)
      const svgIcon = createSVGIconElement();
      button.appendChild(svgIcon);

      // Add text (inside the button)
      const text = document.createTextNode(' DeepWiki'); // Add space for clarity
      button.appendChild(text);


      // Add click tracking/logging
      button.addEventListener('click', function (e) {
        log(`DeepWiki button clicked for: ${user}/${repo}`);
        // Optional: Add analytics tracking here if desired
      });

      return button;
    } catch (e) {
      errorLog('Error creating DeepWiki button:', e);
      return null;
    }
  }

  // --- Button Insertion ---
  /**
   * Finds the best location and inserts the DeepWiki button.
   */
  function addDeepWikiButton() {
    // 1. Pre-checks
    if (!isRepoPage()) {
      // log('Not a repository page, skipping button add.');
      return;
    }
    if (document.getElementById(BUTTON_ID)) {
      // log('DeepWiki button already exists.');
      return;
    }

    const userAndRepo = getUserAndRepo();
    if (!userAndRepo) {
      errorLog('Could not extract user/repo info, cannot add button.');
      return;
    }

    // 2. Create the button
    const deepWikiButton = createDeepWikiButton(userAndRepo.user, userAndRepo.repo);
    if (!deepWikiButton) {
      errorLog('Button creation failed.');
      return;
    }

    // 3. Find insertion point (try multiple locations)
    // Prioritize the specific target: repository-details-container div's ul
    const targetSelectors = [
      // --- Primary Target (Specific container requested) ---
      '#repository-details-container ul',     // Specific container requested
      // --- Secondary Targets (UL elements for list items) ---
      '.pagehead-actions ul',                 // Older structure action list
      '.AppHeader-context-full nav > ul',      // Newest header nav
      'nav[aria-label="Repository"] ul',      // Repo navigation tabs
      // --- Fallback Targets (Other areas) ---
      '.gh-header-actions',                   // Newer structure action area
      '.repository-content .Box-header .d-flex .BtnGroup',
      '#repository-container-header .BtnGroup',
      '.file-navigation',                     // File browser header
      '.Layout-sidebar'                       // Right sidebar
    ];

    let targetElement = null;
    let insertionMethod = 'appendChild'; // Default: add to the end

    for (const selector of targetSelectors) {
      targetElement = document.querySelector(selector);
      if (targetElement) {
        log(`Found target element using selector: ${selector}, tagName: ${targetElement.tagName}`);
        // If we found the specific target we're looking for, break immediately
        if (selector === '#repository-details-container ul') {
          log('Found the specific target container requested');
        }
        break; // Stop searching once a target is found
      }
    }


    // 4. Insert the button
    if (targetElement) {
      try {
        let elementToInsert;

        // If target is a UL, always add as a list item
        if (targetElement.tagName === 'UL') {
          log('Target is a UL element, creating list item for DeepWiki button');
          const li = document.createElement('li');
          // Try to copy classes from sibling LIs for better alignment/styling in lists
          const siblingLi = targetElement.querySelector('li:last-child');
          if (siblingLi) {
            li.className = siblingLi.className;
            log(`Copied classes from sibling LI: ${siblingLi.className}`);
          }
          li.style.marginLeft = '8px'; // Ensure some space if classes don't provide it
          li.appendChild(deepWikiButton);
          elementToInsert = li;
        } else if (targetElement.classList.contains('BtnGroup')) {
          // If inserting into a button group, don't wrap, just append
          elementToInsert = deepWikiButton;
        } else {
          // For any other target, add directly
          elementToInsert = deepWikiButton;
        }

        // Insert the element
        targetElement.appendChild(elementToInsert);

        log(`Successfully added DeepWiki button for ${userAndRepo.user}/${userAndRepo.repo}`);
        if (targetElement.closest('#repository-details-container')) {
          log('DeepWiki button was added to the repository-details-container as requested');
        }
      } catch (e) {
        errorLog('Error inserting button into target element:', e, targetElement);
      }
    } else {
      log('Could not find a suitable location to add the DeepWiki button.');
    }
  }

  // --- Dynamic Loading Handling ---
  let observer = null;
  let mutationDebounceTimeout = null;

  /**
   * Sets up a MutationObserver to watch for DOM changes and URL changes (via DOM).
   */
  function setupObserver() {
    if (observer) {
      // log("Observer already running.");
      return; // Don't set up multiple observers
    }

    try {
      observer = new MutationObserver((mutations) => {
        // Check if URL changed significantly (indicating SPA navigation)
        if (location.href !== lastUrl) {
          log(`URL changed from ${lastUrl} to ${location.href}`);
          lastUrl = location.href;
          // Clear any existing button immediately on URL change before adding new one
          const existingButton = document.getElementById(BUTTON_ID);
          if (existingButton) {
            existingButton.remove();
            log('Removed old button due to URL change.');
          }

          // Re-run add button logic after a short delay for the page to settle
          clearTimeout(mutationDebounceTimeout); // Clear previous debounce timer
          mutationDebounceTimeout = setTimeout(addDeepWikiButton, 300); // Debounce checks
        } else {
          // URL didn't change, but DOM did. Check if button *should* be there but isn't.
          // This handles cases where parts of the header re-render without full navigation.
          if (isRepoPage() && !document.getElementById(BUTTON_ID)) {
            clearTimeout(mutationDebounceTimeout); // Clear previous debounce timer
            mutationDebounceTimeout = setTimeout(addDeepWikiButton, 500); // Longer debounce for general mutations
          }
        }

        // Optimization: Disconnect observer if we are definitely not on a repo page?
        // Could add: if (!isRepoPage() && observer) { observer.disconnect(); observer = null; log('Disconnected observer, not repo page'); }
        // But re-connecting might be tricky, so let's keep it simple for now.
      });

      observer.observe(document.body, {
        childList: true, // Watch for adding/removing nodes
        subtree: true    // Watch descendants too
      });
      log('MutationObserver set up successfully.');
    } catch (e) {
      errorLog('Failed to set up MutationObserver:', e);
    }
  }

  // --- Initialization ---
  /**
   * Initializes the script: adds the button and sets up the observer.
   */
  function init() {
    log('Initializing DeepWiki Button script...');

    // Initial attempt to add the button
    addDeepWikiButton();

    // Retry mechanism for initial load race conditions
    // Use increasing delays
    setTimeout(addDeepWikiButton, 500);
    setTimeout(addDeepWikiButton, 1500); // Longer delay
    setTimeout(addDeepWikiButton, 3000); // Even longer


    // Set up the observer to handle SPA navigation and dynamic content
    setupObserver();

    // Optional: Listen to popstate for back/forward navigation (though observer often catches this too)
    window.addEventListener('popstate', () => {
      log('popstate event detected');
      // Give observer a chance first, but force check after a delay
      setTimeout(addDeepWikiButton, 200);
    });

  }

  // --- Run ---
  // Use DOMContentLoaded for initial run, but also check readyState for already loaded pages.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // The document is already loaded ('interactive' or 'complete')
    init();
  }

})();
