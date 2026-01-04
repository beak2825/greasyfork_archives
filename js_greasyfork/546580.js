// ==UserScript==
// @name         Anilist Progress Addon
// @description  Display your current chapter/episode progress on the cover image
// @version      0.0.1
// @author       0x96EA
// @namespace    https://github.com/0x96EA/userscripts/website-redirects
// @homepageURL https://github.com/0x96EA/userscripts
// @license MIT
// @match        https://anilist.co/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/546580/Anilist%20Progress%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/546580/Anilist%20Progress%20Addon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const logPrefix = '[Progress Addon]';
  const logger = {
    // NOTE: debug logging is opt in
    info: localStorage.getItem('userscript-addon-logging')
      ? console.info.bind(console, logPrefix)
      : () => {},
    error: console.error.bind(console, logPrefix),
    log: console.log.bind(console, logPrefix),
  };

  const GRAPHQL_ENDPOINT = 'https://anilist.co/graphql';
  const MEDIA_QUERY = `query ($mediaId: Int) {
      Media(id: $mediaId) {
        id
        title {
          userPreferred
        }
        coverImage {
          large
        }
        bannerImage
        type
        status(version: 2)
        episodes
        chapters
        volumes
        isFavourite
        mediaListEntry {
          id
          mediaId
          status
          score
          advancedScores
          progress
          progressVolumes
          repeat
          priority
          private
          hiddenFromStatusLists
          customLists
          notes
          updatedAt
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          user {
            id
            name
          }
        }
      }
    }`;

  /**
   * Make GraphQL request
   * @param {string} query - The GraphQL query string
   * @param {Object} variables - Optional variables for the query
   * @returns {Promise<Response>} - The fetch response
   */
  async function makeGraphQLRequest(query, variables = {}) {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Prepare the request body
    const requestBody = {
      query: query,
      variables: variables,
    };

    try {
      logger.info('Making GraphQL request...');
      logger.info('Endpoint:', GRAPHQL_ENDPOINT);
      logger.info('Query:', query);
      logger.info('Variables:', variables);

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        credentials: 'include', // Includes cookies in the request
      });

      logger.info('GraphQL request completed');
      logger.info('Response status:', response.status);
      logger.info('Response OK:', response.ok);

      // Return the response for handling in the next step
      return response;
    } catch (error) {
      logger.error('GraphQL request failed:', error);
      throw error;
    }
  }

  /**
   * Extract mediaId from the current URL
   * @returns {number|null} - The mediaId or null if not found
   */
  function getMediaIdFromUrl() {
    const url = window.location.href;
    logger.info('Current URL:', url);

    // Match patterns like:
    // https://anilist.co/anime/156822/...
    // https://anilist.co/manga/12345/...
    const match = url.match(/anilist\.co\/(anime|manga)\/(\d+)/);

    if (match) {
      const mediaId = parseInt(match[2], 10);
      logger.info(`Found mediaId: ${mediaId} (type: ${match[1]})`);
      return mediaId;
    }

    logger.info('No mediaId found in URL');
    return null;
  }

  const addonClass = 'anilist-progress-addon';
  const addonFallbackID = 'anilist-progress-addon-fallback';
  const addonStyleID = 'anilist-progress-addon-style';

  /**
   * Display progress information on the webpage
   * @param {Object} mediaData - The media response data
   */
  function displayProgress(mediaData) {
    clearProgressUI();

    // Extract the values from the response
    const media = mediaData.data?.Media;
    if (!media) {
      logger.error('No media data found in response');
      return;
    }

    const episodes = media.episodes;
    const progress = media.mediaListEntry?.progress;
    const title = media.title?.userPreferred;

    logger.info('Extracted values:', { episodes, progress, title });

    // Find the cover image container and img element
    const coverWrap = document.querySelector('.cover-wrap-inner');
    const coverImg = coverWrap?.querySelector('img');

    // Format the progress text
    let progressText = '';
    if (progress !== undefined && episodes !== undefined) {
      progressText = `${progress}/${episodes || '?'}`;
    } else if (progress !== undefined) {
      progressText = `${progress}/?`;
    } else {
      progressText = 'Unknown';
    }

    if (!coverWrap) {
      logger.error('Could not find .cover-wrap-inner element');
      // Fallback to the old floating display if cover not found
      displayProgressFallback(progressText);
      return;
    }

    // Add a unique class to the cover wrap for targeting
    coverWrap.classList.add(addonClass);
    logger.info('Text:', progressText);

    // Get image dimensions for positioning
    let imageHeight = 0;
    let imageWidth = 0;

    if (coverImg) {
      // Use height or offsetHeight (rendered dimensions)
      imageHeight = coverImg.height || coverImg.offsetHeight;
      imageWidth = coverImg.width || coverImg.offsetWidth;
      logger.info('Cover image:', {
        height: coverImg.height,
        offsetHeight: coverImg.offsetHeight,
        calculatedHeight: imageHeight,
        width: coverImg.width,
        offsetWidth: coverImg.offsetWidth,
        calculatedWidth: imageWidth,
      });
    }

    // Calculate top position (26px from bottom of image)
    const topPosition = imageHeight - 26; // 26px buffer for text height
    logger.info(`UI top position: ${topPosition} px`);
    logger.info(`UI width: ${imageWidth} px`);

    // Create CSS for the pseudo-element on the container
    const cssContent = `
            .cover-wrap-inner.${addonClass} {
                position: relative;
            }
        
            .cover-wrap-inner.${addonClass}::after {
                content: "${progressText}";
                box-sizing: border-box;
                pointer-events: none;
                position: absolute;
                top: ${topPosition}px;
                left: 0px;
                width: ${imageWidth}px;
                font-size: 2.2rem;
                text-align: center;
                background: rgba(var(--color-overlay),.65);
                backdrop-filter: blur(0.5px);
                color: rgb(var(--color-blue));
                padding: 8px;
                z-index: 10;
            }
        `;

    injectProgressUI(cssContent);
    logger.info(
      `UI injected style id is "${addonStyleID}" and class is "${addonClass}"`,
    );

    // Make sure the cover container has relative positioning
    const coverStyle = window.getComputedStyle(coverWrap);
    if (coverStyle.position !== 'relative') {
      coverWrap.style.position = 'relative';
    }

    logger.log(`Loaded with progress: ${progressText}`);
  }

  /**
   * Inject CSS for progress display
   * @param {string} cssContent - The CSS content to inject
   */
  function injectProgressUI(cssContent) {
    // Remove existing progress CSS
    const existingStyle = document.getElementById(addonStyleID);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = addonStyleID;
    style.textContent = cssContent;
    document.head.appendChild(style);
  }

  /**
   * Remove existing progress displays
   */
  function clearProgressUI() {
    // Remove existing CSS
    const existingStyle = document.getElementById(addonStyleID);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Remove class from cover wrap elements
    const progressWraps = document.querySelectorAll(`.${addonClass}`);
    progressWraps.forEach((wrap) => {
      wrap.classList.remove(addonClass);
    });

    // Remove class from img elements (legacy cleanup)
    const progressImgs = document.querySelectorAll('.anilist-progress-img');
    progressImgs.forEach((img) => {
      img.classList.remove('anilist-progress-img');
    });

    // Remove fallback element
    const existingFallback = document.getElementById(addonFallbackID);
    if (existingFallback) {
      existingFallback.remove();
    }
  }

  /**
   * Fallback display function for when cover image is not found
   */
  function displayProgressFallback(progressText) {
    logger.info(
      `UI fallback id is "${addonStyleID}" and class is "${addonClass}"`,
    );
    // Create fallback display element
    const progressFallbackUI = document.createElement('div');
    progressFallbackUI.id = addonFallbackID;
    progressFallbackUI.style.cssText = `
            box-sizing: border-box;
            pointer-events: none;
            position: fixed;
            bottom: 90px;
            right: 10px;
            min-width: 120px;
            padding: 8px 12px;
            font-size: 2.2rem;
            text-align: center;
            background: rgba(var(--color-overlay),.65);
            backdrop-filter: blur(0.5px);
            color: rgb(var(--color-blue));
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 9999;
        `;

    progressFallbackUI.innerHTML = `
            <div>
                ${progressText}
            </div>
            <div style="font-size: 9px; margin-top: 2px;">
                (Cover not found)
            </div>
        `;

    // Add click to remove functionality
    progressFallbackUI.addEventListener('click', () => {
      progressFallbackUI.remove();
    });

    document.body.appendChild(progressFallbackUI);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (progressFallbackUI.parentNode) {
        progressFallbackUI.remove();
      }
    }, 10000);
  }

  /**
   * Display chapter/episode progress for the current page if it's an anime/manga page
   */
  async function loadAddon() {
    const mediaId = getMediaIdFromUrl();

    if (mediaId) {
      logger.info(`Display progress for mediaId: ${mediaId}`);
      try {
        const mediaResponse = await makeGraphQLRequest(MEDIA_QUERY, {
          mediaId: mediaId,
        });

        if (mediaResponse?.ok) {
          const mediaData = await mediaResponse.json();
          displayProgress(mediaData);
        }
      } catch (error) {
        logger.error('Error displaying progress:', error);
      }
    }
  }

  /**
   * Initialize the script
   */
  function init() {
    logger.log('Starting...');

    // Auto-show progress on page load (with slight delay)
    setTimeout(() => {
      loadAddon();
    }, 1000);

    /**
     * Single Page Application support
     */

    let currentUrl = window.location.href;

    // watch for page content changes
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        logger.info('Location changed, reloading...');
        clearProgressUI();
        setTimeout(() => {
          loadAddon();
        }, 1500);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // watch for page forward and back navigation
    window.addEventListener('popstate', () => {
      logger.info('Page navigation change, reloading...');
      clearProgressUI();
      setTimeout(() => {
        loadAddon();
      }, 1500);
    });
  }

  // Wait for the page to load before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
