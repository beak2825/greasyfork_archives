// ==UserScript==
// @name         Chosic Copy Button
// @namespace    https://greasyfork.org/users/1470715
// @author       cattishly6060
// @version      1.4
// @description  Add copy button on chosic genre finder page
// @match        https://www.chosic.com/music-genre-finder/*
// @match        https://www.chosic.com/artist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chosic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541399/Chosic%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/541399/Chosic%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /**
   * Main function
   */

  /**
   * @param {string} textToCopy
   * @param {string} btnText
   * @returns {HTMLAnchorElement}
   */
  function createCopyBtn(textToCopy = "", btnText = "Copy") {
    // Create the button/link element
    const copyButton = document.createElement('a');
    copyButton.textContent = btnText;
    copyButton.href = '#'; // Makes it look like a link
    copyButton.style.cssText = `
      display: inline-block;
      margin: 5px;
      padding: 2px 5px;
      background: #0078d7;
      color: white;
      border-radius: 2px;
      text-decoration: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;

    // Add click event handler
    copyButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Copy text to clipboard
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Visual feedback
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });

    return copyButton;
  }

  /**
   * @param {string} uri
   * @param {string} btnText
   * @returns {HTMLAnchorElement}
   */
  function createOpenBtn(uri = "", btnText = "Open") {
    // Create the button/link element
    const openButton = document.createElement('a');
    openButton.textContent = btnText;
    openButton.href = uri;
    openButton.target = '_blank';
    openButton.style.cssText = `
      display: inline-block;
      margin: 5px;
      padding: 2px 5px;
      background: #0078d7;
      color: white;
      border-radius: 2px;
      text-decoration: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;
    return openButton;
  }

  /**
   * @param {string} textToCopy
   * @param {string} uri
   * @param {string} btnText
   * @returns {HTMLDivElement}
   */
  function createGroupBtn(textToCopy = "", uri = "", btnText = "Open") {
    const div = document.createElement('div');
    div.style.display = 'inline-block';

    // Create the button/link element
    const openButton = document.createElement('a');
    openButton.textContent = btnText;
    openButton.href = uri;
    openButton.target = '_blank';
    openButton.style.cssText = `
      display: inline-block;
      margin: 5px 0 5px 5px;
      padding: 2px 5px;
      background: #0078d7;
      color: white;
      border-radius: 2px 0 0 2px;
      text-decoration: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;

    // Create copy button
    const copyButton = document.createElement('a');
    copyButton.href = '#';
    copyButton.style.cssText = `
      display: inline-block;
      margin: 5px 5px 5px 0;
      padding: 2px 10px;
      color: white;
      border-radius: 0 2px 2px 0;
      text-decoration: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    `;
    copyButton.style.background = '#005ca3';

    // SVG style change:
    copyButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/></svg>`;

    // Add click event handler
    copyButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior

      // Copy text to clipboard
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Visual feedback - change both icon and text
          const originalHTML = copyButton.innerHTML;
          copyButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;
          setTimeout(() => {
            copyButton.innerHTML = originalHTML;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });

    div.append(openButton, copyButton);
    return div;
  }

  /**
   * Variables
   */

  /** @type {HTMLElement[]} */
  let toRemoveElement = [];

  /**
   * Main Handler (Listener/Observer)
   */
  function main() {

    if (toRemoveElement?.length) {
      for (const e of toRemoveElement) {
        e?.remove();
      }
      toRemoveElement = [];
    }

    /** @type {?MutationObserver} */
    const observerSp = waitForElement('#spotify-tags .pl-tags > a', (_) => {

      /** @type {HTMLElement[]} */
      const spGenreList = [...document.querySelectorAll("#spotify-tags .pl-tags > a")];

      /** @type {string[]} */
      const spotifyGenres = spGenreList.map(e => e.innerText.trim().toLowerCase());

      /** @type {{uri: string, genre: string}[]} */
      const spotifyTags = spGenreList.map(e => ({uri: e.href, genre: e.innerText.trim().toLowerCase()}));

      // remove native genre tags
      spGenreList.forEach(e => e.remove())
      console.log({spotifyGenres, spotifyTags}); // todo log

      if (spotifyGenres?.length) {
        const copyBtn = createCopyBtn(spotifyGenres.join(', '), "Copy");
        document.querySelector("#spotify-tags .section-header")?.appendChild(copyBtn);
      }

      if (spotifyTags?.length) {
        const div = document.createElement('div');
        div.style.cssText = `text-align: center;`;
        for (const spTag of spotifyTags) {
          const groupBtn = createGroupBtn(spTag.genre, spTag.uri, spTag.genre);
          div.appendChild(groupBtn);
        }
        const isRelatedGenre = Boolean(document.querySelector("#spotify-tags span.related-artists-genres-extra"));
        if (isRelatedGenre) {
          document.querySelector("#spotify-tags div.pl-tags")
            ?.insertAdjacentElement('afterend', div);
        } else {
          document.querySelector("#spotify-tags .section-header")
            ?.insertAdjacentElement('afterend', div);
        }
      }
    }, {timeoutDelay: 5_000});

    /** @type {?MutationObserver} */
    const observerWk = waitForElement('#wiki-genres.pl-tags > a', (_) => {

      /** @type {HTMLElement[]} */
      const wikiGenreList = [...document.querySelectorAll("#wiki-genres.pl-tags > a")];

      /** @type {string[]} */
      const wikiGenres = wikiGenreList.map(e => e.innerText.trim().toLowerCase());

      /** @type {{uri: string, genre: string}[]} */
      const wikiTags = wikiGenreList.map(e => ({uri: e.href, genre: e.innerText.trim().toLowerCase()}));

      // remove native wiki genre list
      wikiGenreList.forEach(e => e.remove());
      console.log({wikiGenres, wikiTags}); // todo log

      if (wikiGenres?.length) {
        const copyBtn = createCopyBtn(wikiGenres.join(', '), "Copy");
        toRemoveElement.push(copyBtn);
        document.querySelector("#wiki-genres.pl-tags")
          ?.parentNode
          ?.querySelector(".section-header")
          ?.appendChild(copyBtn);
      }

      if (wikiTags?.length) {
        const div = document.createElement('div');
        div.style.cssText = `text-align: center;`;
        for (const spTag of wikiTags) {
          const groupBtn = createGroupBtn(spTag.genre, spTag.uri, spTag.genre);
          div.appendChild(groupBtn);
        }
        toRemoveElement.push(div);
        document.querySelector("#wiki-genres.pl-tags")
          ?.parentNode
          ?.querySelector(".section-header")
          ?.insertAdjacentElement('afterend', div);
      }
    }, {timeoutDelay: 5_000});

    // player copy button
    const observerTrackItem = waitForElement("#song-player div.track-list-item", (_) => {
      const trackItem = document.querySelector("#song-player div.track-list-item");
      if (trackItem) {
        const titleAnchor = trackItem.querySelector(".track-list-item-info-text a");
        const authorAnchor = trackItem.querySelector(".track-list-item-info-genres a");

        if (titleAnchor && authorAnchor) {
          /** @type {?string} */
          const title = titleAnchor.innerText;
          /** @type {?string} */
          const author = authorAnchor.innerText;

          /** @type {?string} */
          const cArtistUri = authorAnchor.getAttribute("data-link");
          /** @type {?string} */
          const cListGeneUri = titleAnchor.getAttribute("data-link");
          /** @type {?string} */
          const spArtistId = cArtistUri?.split('/')?.[5];
          /** @type {?string} */
          const spTrackId = cListGeneUri?.split('track=')?.[1];

          /** @type {string} */
          const spArtistUri = `https://open.spotify.com/artist/${spArtistId}`;
          /** @type {string} */
          const spTrackUri = `https://open.spotify.com/track/${spTrackId}`;

          const div = document.createElement("div");
          div.style.cssText = "position: relative; width: 100%;";
          trackItem.insertBefore(div, trackItem.firstChild);

          /** @type {HTMLDivElement[]} */
          const divs = [];

          if (title && author) {
            const _div = document.createElement("div");
            _div.style.cssText = "position: absolute; right: 0; top: 0;";
            const copyTitle = createCopyBtn(title, "Copy Title");
            const copyAuthor = createCopyBtn(author, "Copy Author");
            const copyAuthorTitle = createCopyBtn(`${title} - ${author}`, "Copy Title + Author");
            _div.append(copyTitle, copyAuthor, copyAuthorTitle);
            divs.push(_div);
          }

          if (spTrackId && spArtistId) {
            const _div = document.createElement("div");
            _div.style.cssText = "position: absolute; right: 0; top: 40px;";
            const copyTrackId = createCopyBtn(spTrackId, "Copy Track ID");
            const copyArtistId = createCopyBtn(spArtistId, "Copy Artist ID");
            _div.append(copyArtistId, copyTrackId);
            divs.push(_div);

            const __div = document.createElement("div");
            __div.style.cssText = "position: absolute; right: 0; top: 80px;";
            const groupArtist = createGroupBtn(spArtistUri, spArtistUri, "Open Artist");
            const groupTrack = createGroupBtn(spTrackUri, spTrackUri, "Open Track");
            __div.append(groupArtist, groupTrack);
            divs.push(__div);
          }

          div.append(...divs);

          console.log({
            title,
            author,
            cArtistUri,
            cListGeneUri,
            spArtistId,
            spTrackId,
            spArtistUri,
            spTrackUri,
          }, {depth: null, colors: true}); // todo log
        }
      }
    }, {timeoutDelay: 5_000});

    if (window.location.pathname.startsWith('/artist/')) {

      /** @type {HTMLAnchorElement[]} */
      const genreElements = [...(document.querySelectorAll("#artist-genres a") || [])];

      /** @type {string[]} */
      const genres = genreElements
        .map(e => e.innerText.trim().toLowerCase());

      genreElements.forEach(e => e.remove());

      if (genres?.length) {
        const div = document.createElement('div');
        for (const g of genres) {
          const genreUri = `https://www.chosic.com/genre-chart/${toSlug(g)}`;
          const groupBtn = createGroupBtn(g, genreUri, g);
          div.appendChild(groupBtn);
        }
        document.querySelector("#artist-genres")
          ?.insertAdjacentElement('afterend', div);

        const copyBtn = createCopyBtn(genres.join(', '), "Copy Genres");
        document.querySelector("#artist-genres")
          ?.appendChild(copyBtn);
      }
    }
  }

  // initiate listener for first page load
  main();

  // listen on data changed
  const loading = document.querySelector("#primary .loading-result");
  if (loading) {
    const styleObserver = observeInlineStyleChanges(loading, (oldStyle, newStyle) => {
      console.log('|| Inline styles changed:');
      console.log('|| Old style:', oldStyle);
      console.log('|| New style:', newStyle);
      if (newStyle?.includes("display: none;")) {
        console.log('|| Starting main..');
        main();
      }
    });
  }

  /**
   * **********************
   * Utility
   * **********************
   */

  /**
   * @param {string} selector
   * @param {function(HTMLElement): void} callback
   * @param {{rootElement: ?HTMLElement, timeoutDelay: ?number}} [options={}]
   * @returns {?MutationObserver}
   */
  function waitForElement(selector, callback, options = {}) {
    // Default to document.body if no root element is specified
    const rootElement = options.rootElement || document.body;
    delete options.rootElement; // Remove our custom option before passing to MutationObserver
    /** @type {?number} */
    const timeoutDelay = options?.timeoutDelay;
    delete options?.timeoutDelay;

    // First try immediately (element might already exist)
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }

    /** @type {?Timeout} */
    let removeObserverTimeout;

    const observer = new MutationObserver((mutations, obs) => {
      // Only query when nodes are added
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const el = document.querySelector(selector);
          if (el) {
            clearTimeout(removeObserverTimeout);
            obs.disconnect();
            callback(el);
            return;
          }
        }
      }
    });

    if (timeoutDelay) {
      removeObserverTimeout = setTimeout(() => {
        observer.disconnect();
      }, timeoutDelay);
    }

    observer.observe(rootElement, {
      childList: true,
      subtree: true,
      ...options
    });

    // Return the observer so caller can disconnect if needed
    return observer;
  }

  /**
   * Observes inline style changes on a specific DOM element
   * @param {HTMLElement} targetElement - The element to observe
   * @param {Function} callback - Function to call when inline styles change
   * @returns {?MutationObserver} The observer instance
   */
  function observeInlineStyleChanges(targetElement, callback) {
    if (!targetElement) {
      return;
    }
    // Options for the observer (what to observe)
    const config = {
      attributes: true, // Watch for attribute changes
      attributeFilter: ['style'], // Only watch the style attribute
      attributeOldValue: true, // Record the old value before mutation
    };

    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Get the old and new style values
          const oldValue = mutation.oldValue;
          const newValue = targetElement.getAttribute('style');

          // Execute callback with both values
          callback(oldValue, newValue);
        }
      });
    });

    // Start observing the target element
    observer.observe(targetElement, config);
    return observer;
  }

  /**
   * @param {string} str
   * @returns {string}
   */
  function toSlug(str) {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

})();
