// ==UserScript==
// @name         Reddit Default Sort
// @version      1.3.0
// @description  Automatically sets Reddit's default sorting order for home and subreddits.
// @author       yodaluca23
// @license      MIT
// @match        *://*.reddit.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/526487/Reddit%20Default%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/526487/Reddit%20Default%20Sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default values
    const defaultHomePageSort = "new";
    const defaultSubredditSort = "new";
    const defaultCommentSort = "new";
    const defaultUserSort = "new";

    // This allows you to use the Reddit filters temporariliy, without it redirecting you to the default
    // This is a domain it should never actually be so it sorts to the default the first time, but doesn't fail being passed to URL()
    let lastUrl = "https://www.example.com";

    // Function to get the stored sort option, or the default if none is stored.
    function getSortOption(key, defaultValue) {
        let value = GM_getValue(key);
        return value === undefined ? defaultValue : value;
    }

    // Get the stored sort options
    let homePageSort = getSortOption("homePageSort", defaultHomePageSort);
    let subredditSort = getSortOption("subredditSort", defaultSubredditSort);
    let commentSort = getSortOption("commentSort", defaultCommentSort);
    let userSort = getSortOption("userSort", defaultUserSort);

    // Function to redirect if necessary
    function redirectIfNeeded() {
        const currentUrl = window.location.href;

        // Comment page sorting
        const commentPattern = /^https?:\/\/www\.reddit\.com\/r\/[^/]+\/comments\/[^/]+\/[^/]+\/?/;
        if (commentPattern.test(currentUrl) && !currentUrl.includes(`?sort=${commentSort}`)) {
            const urlObj = new URL(currentUrl);
            const justRoot = urlObj.origin + urlObj.pathname;
            const urlObjLast = new URL(lastUrl);
            const justRootLast = urlObjLast.origin + urlObjLast.pathname;
            if (justRootLast == justRoot) {
              return;
            } else {
              const newUrl = `${justRoot}?sort=${commentSort}`;
              window.location.replace(newUrl);
            }
        }

        // Check for home page URLs
        const homeUrls = [
            "https://www.reddit.com/",
            "https://www.reddit.com/?feed=home",
            "https://www.reddit.com/best/?feed=home",
            "https://www.reddit.com/hot/?feed=home",
            "https://www.reddit.com/top/?feed=home",
            "https://www.reddit.com/new/?feed=home",
            "https://www.reddit.com/rising/?feed=home"
        ];

        const homeTargetUrl = `https://www.reddit.com/${homePageSort}/?feed=home`;

        if (homeUrls.includes(currentUrl) && currentUrl !== homeTargetUrl && !homeUrls.includes(lastUrl)) {
            window.location.replace(homeTargetUrl);
            return;
        }

        // Check for subreddit URLs
        const subredditPattern = /^https?:\/\/www\.reddit\.com\/r\/([^/]+)(\/(hot|new|top|best|rising))?(\/)?(\?.*)?$/;

        if (subredditPattern.test(currentUrl)) {
            const match = currentUrl.match(subredditPattern);
            const subredditName = match[1];

            // Check if were still on the same sub indicates the user only changed their sort we should not set it back
            if (subredditPattern.test(lastUrl)) {
              const matchLast = lastUrl.match(subredditPattern);
              if (subredditName == matchLast[1]) {
                return;
              }
            }

            const targetUrl = `https://www.reddit.com/r/${subredditName}/${subredditSort}`;
            const altTargetUrl = `https://www.reddit.com/r/${subredditName}/${subredditSort}/`;

            if (currentUrl !== targetUrl && currentUrl !== altTargetUrl) {
                window.location.replace(targetUrl);
            }
        }

        // Check for user URLs
        const userPattern = /^https?:\/\/www\.reddit\.com\/user\/([^\/?]+)\/?(?:\?sort=(?:top|hot|new))?$/;

        if (userPattern.test(currentUrl)) {
          const match = currentUrl.match(userPattern);
          const userName = match[1];

          // Check if were still on the same user indicates our user only changed their sort we should not set it back
          if (userPattern.test(lastUrl)) {
            const matchLast = lastUrl.match(userPattern);
            if (userName == matchLast[1]) {
              return;
            }
          }

          const targetUrl = `https://www.reddit.com/user/${userName}/?sort=${userSort}`;

          if (currentUrl !== targetUrl) {
              window.location.replace(targetUrl);
          }

        }
    }

    // Function to create the settings UI
    function createSettingsUI() {
      // Create the settings container
      const settingsContainer = document.createElement('div');
      settingsContainer.id = 'default-sort-settings-container';

      settingsContainer.style.position = 'fixed';
      settingsContainer.style.top = '50%';
      settingsContainer.style.left = '50%';
      settingsContainer.style.transform = 'translate(-50%, -50%)';
      settingsContainer.style.padding = '20px';
      settingsContainer.style.borderRadius = '12px';
      settingsContainer.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.1)';
      settingsContainer.style.zIndex = '1000';
      settingsContainer.style.minWidth = '280px';
      settingsContainer.style.textAlign = 'center';
      settingsContainer.style.fontFamily = '"Arial", sans-serif';

      // Dark/Light Mode detection based on system preference
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
          settingsContainer.style.backgroundColor = '#111111'; // AMOLED dark mode
          settingsContainer.style.color = '#fff';
          settingsContainer.style.border = '1px solid #444'; // Softer border for dark mode
      } else {
          settingsContainer.style.backgroundColor = '#f9f9f9';
          settingsContainer.style.color = '#000';
          settingsContainer.style.border = '1px solid #ccc'; // Softer border for light mode
      }

      // Title
      const title = document.createElement('h2');
      title.textContent = 'Settings';
      title.style.marginBottom = '20px';
      settingsContainer.appendChild(title);

      // Home page sort select
      const homePageLabel = document.createElement('label');
      homePageLabel.textContent = 'Home Page Sort:';
      homePageLabel.style.display = 'block';
      homePageLabel.style.marginBottom = '10px';

      const homePageSelect = document.createElement('select');
      homePageSelect.id = 'homePageSortSelect';
      homePageSelect.style.width = '100%';
      homePageSelect.style.padding = '8px';
      homePageSelect.style.borderRadius = '5px';
      homePageSelect.style.backgroundColor = isDarkMode ? '#333' : '#fff'; // Darker dropdown in dark mode
      homePageSelect.style.color = isDarkMode ? '#fff' : '#000'; // Ensure text contrast is high
      homePageSelect.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc'; // Softer borders

      ['best', 'hot', 'new', 'top', 'rising'].forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
          homePageSelect.appendChild(opt);
      });
      homePageSelect.value = homePageSort;

      settingsContainer.appendChild(homePageLabel);
      settingsContainer.appendChild(homePageSelect);

      // Subreddit sort select
      const subredditLabel = document.createElement('label');
      subredditLabel.textContent = 'Subreddit Sort:';
      subredditLabel.style.display = 'block';
      subredditLabel.style.marginBottom = '10px';

      const subredditSelect = document.createElement('select');
      subredditSelect.id = 'subredditSortSelect';
      subredditSelect.style.width = '100%';
      subredditSelect.style.padding = '8px';
      subredditSelect.style.borderRadius = '5px';
      subredditSelect.style.backgroundColor = isDarkMode ? '#333' : '#fff'; // Darker dropdown in dark mode
      subredditSelect.style.color = isDarkMode ? '#fff' : '#000'; // Ensure text contrast is high
      subredditSelect.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc'; // Softer borders

      ['best', 'hot', 'new', 'top', 'rising'].forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
          subredditSelect.appendChild(opt);
      });
      subredditSelect.value = subredditSort;

      settingsContainer.appendChild(subredditLabel);
      settingsContainer.appendChild(subredditSelect);

      // Comments sort select
      const commentsLabel = document.createElement('label');
      commentsLabel.textContent = 'Comments Sort:';
      commentsLabel.style.display = 'block';
      commentsLabel.style.marginBottom = '10px';

      const commentSelect = document.createElement('select');
      commentSelect.id = 'commentSortSelect';
      commentSelect.style.width = '100%';
      commentSelect.style.padding = '8px';
      commentSelect.style.borderRadius = '5px';
      commentSelect.style.backgroundColor = isDarkMode ? '#333' : '#fff'; // Darker dropdown in dark mode
      commentSelect.style.color = isDarkMode ? '#fff' : '#000'; // Ensure text contrast is high
      commentSelect.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc'; // Softer borders

      const optionMapping = {
        best: 'confidence',
        top: 'top',
        new: 'new',
        controversial: 'controversial',
        old: 'old',
        'Q&A': 'qa'
      };

      Object.entries(optionMapping).forEach(([key, value]) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        commentSelect.appendChild(opt);
      });

      commentSelect.value = commentSort;

      settingsContainer.appendChild(commentsLabel);
      settingsContainer.appendChild(commentSelect);

      // User sort select
      const userLabel = document.createElement('label');
      userLabel.textContent = 'User Sort:';
      userLabel.style.display = 'block';
      userLabel.style.marginBottom = '10px';

      const userSelect = document.createElement('select');
      userSelect.id = 'userSortSelect';
      userSelect.style.width = '100%';
      userSelect.style.padding = '8px';
      userSelect.style.borderRadius = '5px';
      userSelect.style.backgroundColor = isDarkMode ? '#333' : '#fff'; // Darker dropdown in dark mode
      userSelect.style.color = isDarkMode ? '#fff' : '#000'; // Ensure text contrast is high
      userSelect.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc'; // Softer borders

      ['hot', 'new', 'top'].forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option.charAt(0).toUpperCase() + option.slice(1);
          userSelect.appendChild(opt);
      });
      userSelect.value = userSort;

      settingsContainer.appendChild(userLabel);
      settingsContainer.appendChild(userSelect);

      // Buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.marginTop = '20px';
      buttonsContainer.style.display = 'flex';
      buttonsContainer.style.justifyContent = 'space-between';

      // Save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save Settings';
      saveButton.style.padding = '10px 20px';
      saveButton.style.borderRadius = '5px';
      saveButton.style.backgroundColor = '#4CAF50';
      saveButton.style.color = 'white';
      saveButton.style.border = 'none';
      saveButton.style.cursor = 'pointer';
      saveButton.style.transition = 'background-color 0.3s ease';
      saveButton.style.textAlign = 'center'; // Center text
      saveButton.style.display = 'flex';
      saveButton.style.alignItems = 'center';
      saveButton.style.justifyContent = 'center'; // Ensure text is centered
      saveButton.addEventListener('click', () => {
          homePageSort = document.getElementById('homePageSortSelect').value;
          subredditSort = document.getElementById('subredditSortSelect').value;
          commentSort = document.getElementById('commentSortSelect').value;
          userSort = document.getElementById('userSortSelect').value;

          GM_setValue("homePageSort", homePageSort);
          GM_setValue("subredditSort", subredditSort);
          GM_setValue("commentSort", commentSort);
          GM_setValue("userSort", userSort);

          if (confirm('Settings Saved!\nWant to refresh now?')) {
            // User clicked "Yes" / "Ok"
            location.reload();
          }

          settingsContainer.remove(); // Remove the settings UI after saving
      });
      saveButton.addEventListener('mouseover', () => {
          saveButton.style.backgroundColor = '#45a049'; // Darker green on hover
      });
      saveButton.addEventListener('mouseout', () => {
          saveButton.style.backgroundColor = '#4CAF50'; // Reset to original green
      });

      // Close button
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.padding = '10px 20px';
      closeButton.style.borderRadius = '5px';
      closeButton.style.backgroundColor = '#f44336';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.cursor = 'pointer';
      closeButton.style.transition = 'background-color 0.3s ease';
      closeButton.style.textAlign = 'center'; // Center text
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center'; // Ensure text is centered
      closeButton.addEventListener('click', () => {
          settingsContainer.remove();
      });
      closeButton.addEventListener('mouseover', () => {
          closeButton.style.backgroundColor = '#e53935'; // Darker red on hover
      });
      closeButton.addEventListener('mouseout', () => {
          closeButton.style.backgroundColor = '#f44336'; // Reset to original red
      });

      // Append buttons
      buttonsContainer.appendChild(saveButton);
      buttonsContainer.appendChild(closeButton);
      settingsContainer.appendChild(buttonsContainer);

      // Append the settings container to the body
      document.body.appendChild(settingsContainer);
    }

    // Add a button to the page to open the settings
    function addSettingsButton() {
      const container = document.querySelector('.pl-lg.gap-xs.flex.items-center.justify-end');

      if (!container) {
        console.warn("Sort Settings button: Target container not found.");
        return; // Exit if container is missing
      }

      // Create the button element
      const settingsButton = document.createElement('button');
      settingsButton.className = 'btn btn-primary flex items-center'; // Flex to align icon and text

      // Add SVG icon as content
      const iconSpan = document.createElement('span');
      iconSpan.className = 'flex shrink-0 items-center justify-center h-xl w-xl text-20 leading-4';
      iconSpan.innerHTML = `
        <svg rpl="" fill="currentColor" height="20" icon-name="settings-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20c-.401 0-.802-.027-1.2-.079a1.145 1.145 0 0 1-.992-1.137v-1.073a.97.97 0 0 0-.627-.878A.98.98 0 0 0 6.1 17l-.755.753a1.149 1.149 0 0 1-1.521.1 10.16 10.16 0 0 1-1.671-1.671 1.149 1.149 0 0 1 .1-1.523L3 13.906a.97.97 0 0 0 .176-1.069.98.98 0 0 0-.887-.649H1.216A1.145 1.145 0 0 1 .079 11.2a9.1 9.1 0 0 1 0-2.393 1.145 1.145 0 0 1 1.137-.992h1.073a.97.97 0 0 0 .878-.627A.979.979 0 0 0 3 6.1l-.754-.754a1.15 1.15 0 0 1-.1-1.522 10.16 10.16 0 0 1 1.673-1.676 1.155 1.155 0 0 1 1.522.1L6.1 3a.966.966 0 0 0 1.068.176.98.98 0 0 0 .649-.887V1.216A1.145 1.145 0 0 1 8.8.079a9.129 9.129 0 0 1 2.393 0 1.144 1.144 0 0 1 .991 1.137v1.073a.972.972 0 0 0 .628.878A.977.977 0 0 0 13.905 3l.754-.754a1.152 1.152 0 0 1 1.522-.1c.62.49 1.18 1.05 1.671 1.671a1.15 1.15 0 0 1-.1 1.522L17 6.1a.967.967 0 0 0-.176 1.068.98.98 0 0 0 .887.649h1.073a1.145 1.145 0 0 1 1.137.991 9.096 9.096 0 0 1 0 2.392 1.145 1.145 0 0 1-1.137.992h-1.073A1.041 1.041 0 0 0 17 13.905l.753.755a1.149 1.149 0 0 1 .1 1.521c-.49.62-1.05 1.18-1.671 1.671a1.149 1.149 0 0 1-1.522-.1L13.906 17a.97.97 0 0 0-1.069-.176.981.981 0 0 0-.65.887v1.073a1.144 1.144 0 0 1-.99 1.137A9.431 9.431 0 0 1 10 20Zm-.938-1.307a7.638 7.638 0 0 0 1.875 0v-.982a2.292 2.292 0 0 1 3.853-1.6l.693.694a8.796 8.796 0 0 0 1.326-1.326l-.694-.694a2.29 2.29 0 0 1 1.6-3.851h.982a7.746 7.746 0 0 0 0-1.876h-.982a2.213 2.213 0 0 1-2.034-1.4 2.223 2.223 0 0 1 .438-2.451l.694-.693a8.76 8.76 0 0 0-1.327-1.326l-.692.694a2.22 2.22 0 0 1-2.434.445 2.221 2.221 0 0 1-1.419-2.041v-.979a7.638 7.638 0 0 0-1.875 0v.982a2.213 2.213 0 0 1-1.4 2.034 2.23 2.23 0 0 1-2.456-.438l-.693-.694a8.757 8.757 0 0 0-1.326 1.327l.694.692a2.216 2.216 0 0 1 .445 2.434 2.22 2.22 0 0 1-2.041 1.418h-.982a7.746 7.746 0 0 0 0 1.876h.982a2.213 2.213 0 0 1 2.034 1.4 2.223 2.223 0 0 1-.438 2.451l-.694.693c.394.488.838.933 1.326 1.326l.694-.694a2.218 2.218 0 0 1 2.433-.445 2.22 2.22 0 0 1 1.418 2.041v.983ZM10 13.229a3.23 3.23 0 1 1 0-6.458 3.23 3.23 0 0 1 0 6.458Zm0-5.208a1.979 1.979 0 1 0 0 3.958 1.979 1.979 0 0 0 0-3.958Z"></path>
        </svg>
      `;

      // Add text content to the button
      settingsButton.textContent = 'Sort';
      settingsButton.style.marginLeft = '2px';
      settingsButton.style.paddingLeft = '10px';
      settingsButton.style.paddingRight = '4px';
      settingsButton.style.backgroundColor = 'transparent';
      settingsButton.style.color = 'rgb(221, 228, 232)';
      settingsButton.classList.add('rounded-lg', 'transition-colors', 'duration-200'); // Rounded corners and smooth transition

      // Hover effect for the button
      settingsButton.addEventListener('mouseover', () => {
        settingsButton.style.backgroundColor = 'rgb(53, 61, 65)';
        settingsButton.style.color = '#ffffff'; // Text color changes on hover
      });

      settingsButton.addEventListener('mouseout', () => {
        settingsButton.style.backgroundColor = 'transparent';
        settingsButton.style.color = 'rgb(221, 228, 232)';
      });

      settingsButton.addEventListener('mousedown', () => {
        settingsButton.style.backgroundColor = 'rgb(83, 90, 94)';
        settingsButton.style.color = '#ffffff';
      });

      settingsButton.addEventListener('mouseup', () => {
        settingsButton.style.backgroundColor = 'rgb(53, 61, 65)';
        let settingsContainerUn = document.getElementById('default-sort-settings-container');
        if (settingsContainerUn) {
          settingsContainerUn.remove()
        } else {
          createSettingsUI();
        }
      });

      settingsButton.addEventListener('mouseleave', () => {
        if (settingsButton.style.backgroundColor !== 'rgb(83, 90, 94)') {
          settingsButton.style.backgroundColor = 'transparent';
          settingsButton.style.color = 'rgb(221, 228, 232)';
        }
      });

      // Append icon and button content to the container
      settingsButton.append(iconSpan); // Add the icon before the text

      // Append the button to the container
      container.appendChild(settingsButton);
    }

    // Initialize
    addSettingsButton();
    redirectIfNeeded();

      // Function to monitor URL changes in single-page app
    function observeUrlChanges(callback) {
        lastUrl = location.href;

        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                callback();
            }
        }).observe(document, { subtree: true, childList: true });

        // Also intercept history changes
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function() {
            pushState.apply(this, arguments);
            callback();
        };
        history.replaceState = function() {
            replaceState.apply(this, arguments);
            callback();
        };
    }

    // Run `redirectIfNeeded` whenever Reddit changes the page
    observeUrlChanges(redirectIfNeeded);

})();