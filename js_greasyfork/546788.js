// ==UserScript==
// @name          MyAnimeList - Add Trakt link
// @version       1.2.2
// @description   Add trakt link to MyAnimeList anime pages
// @author        Journey Over
// @license       MIT
// @match         *://myanimelist.net/anime/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@644b86d55bf5816a4fa2a165bdb011ef7c22dfe1/libs/metadata/animeapi/animeapi.min.js
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_deleteValue
// @run-at        document-end
// @inject-into   content
// @icon          https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/546788/MyAnimeList%20-%20Add%20Trakt%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/546788/MyAnimeList%20-%20Add%20Trakt%20link.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const logger = Logger('MAL - Add Trakt link', { debug: false });

  const animeapi = new AnimeAPI();

  // clear expired cache entries
  function clearExpiredCache() {
    try {
      const values = GM_listValues();
      for (const value of values) {
        const cache = GM_getValue(value);
        if (cache?.timestamp && (Date.now() - cache.timestamp) > 24 * 60 * 60 * 1000) {
          GM_deleteValue(value);
        }
      }
    } catch (error) {
      logger.debug(`Failed to clear expired cache: ${error.message}`);
    }
  }

  clearExpiredCache();

  const myAnimeListId = window.location.pathname.split('/')[2];
  if (!myAnimeListId) {
    logger.warn('No MAL ID found in URL');
    return;
  }

  const navigationList = document.querySelector('#horiznav_nav ul');
  if (!navigationList) {
    logger.error('Could not find navigation list');
    return;
  }

  // Prevent duplicate links if already added
  if (navigationList.querySelector('a[href*="trakt.tv"]')) {
    logger.debug('Trakt link already exists');
    return;
  }

  // Check cache first (24-hour validity)
  const cachedEntry = GM_getValue(myAnimeListId);
  if (cachedEntry) {
    try {
      if (Date.now() - cachedEntry.timestamp < 24 * 60 * 60 * 1000) {
        logger.debug(`Using cached data for MAL ID ${myAnimeListId}`);
        addTraktLink(cachedEntry.data.trakt, cachedEntry.data.trakt_type);
        return;
      } else {
        logger.debug(`Cache expired for MAL ID ${myAnimeListId}`);
      }
    } catch (error) {
      logger.error(`Error parsing cached data: ${error.message}`);
    }
  }

  logger(`Fetching Trakt data for MAL ID ${myAnimeListId}`);
  animeapi.fetch('myanimelist', myAnimeListId).then(apiData => {
    if (!apiData.trakt || !apiData.trakt_type) {
      logger.warn('No Trakt data found in API response');
      return;
    }

    // Cache successful response with timestamp
    GM_setValue(myAnimeListId, {
      data: apiData,
      timestamp: Date.now()
    });

    addTraktLink(apiData.trakt, apiData.trakt_type);
  }).catch(error => {
    logger.error(`Failed to fetch from AnimeAPI: ${error.message}`);
  });

  function addTraktLink(traktIdentifier, traktContentType) {
    const traktUrl = `https://trakt.tv/${traktContentType}/${traktIdentifier}`;

    const listItemElement = document.createElement('li');
    const linkElement = document.createElement('a');

    linkElement.href = traktUrl;
    linkElement.textContent = 'Trakt';
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    linkElement.className = 'horiznav_link';
    linkElement.style.cssText = `
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
      `;

    // Match MAL's blue hover color
    linkElement.addEventListener('mouseover', () => {
      linkElement.style.color = '#2e51a2';
      linkElement.style.textDecoration = 'none';
    });
    linkElement.addEventListener('mouseout', () => {
      linkElement.style.color = 'inherit';
    });

    navigationList.appendChild(listItemElement);
    listItemElement.appendChild(linkElement);

    logger(`Added Trakt link: ${traktUrl}`);
  }
})();
