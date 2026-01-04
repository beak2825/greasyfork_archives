// ==UserScript==
// @name         BTN Button on IMDb, TMDb, Trakt
// @version      2.1.0
// @description  Adds a button to IMDb (TV shows only), TMDb (TV shows only), Trakt.tv (TV shows only) to redirect to broadcasthe.net
// @author       RaeLynn
// @match        *://www.imdb.com/title/tt*/
// @match        *://www.themoviedb.org/*
// @match        *://trakt.tv/shows/*
// @grant        none
// @icon         https://broadcasthe.net/favicon.ico
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/1454417
// @downloadURL https://update.greasyfork.org/scripts/533763/BTN%20Button%20on%20IMDb%2C%20TMDb%2C%20Trakt.user.js
// @updateURL https://update.greasyfork.org/scripts/533763/BTN%20Button%20on%20IMDb%2C%20TMDb%2C%20Trakt.meta.js
// ==/UserScript==

  (function () {
  'use strict';

  const BTN_LOGO = 'https://ptpimg.me/hf11fs.png';

  function createBTNButton(href, title = 'Search on BTN') {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.title = title;

    const img = document.createElement('img');
    img.src = BTN_LOGO;
    img.alt = 'BTN';

    link.appendChild(img);
    return link;
  }

  function addButtonToIMDb() {
    const imdbMatch = window.location.pathname.match(/\/title\/(tt\d+)/);
    if (!imdbMatch) return;

    const imdbID = imdbMatch[1];
    const btnHref = `https://broadcasthe.net/torrents.php?imdb=${imdbID}`;

    const seriesType = Array.from(document.querySelectorAll('li.ipc-inline-list__item'))
        .map(item => item.textContent.trim())
        .some(text => text === "TV Mini Series" || text === "TV Series");

    if (!seriesType) return;

    const observer = new MutationObserver(() => {
        const titleEl = document.querySelector('.hero__primary-text');
        if (titleEl && !document.querySelector('.btn-custom-button')) {
            // Add custom styles
            const style = document.createElement('style');
            style.textContent = `
                .btn-custom-button {
                    position: relative;
                    display: inline-block;
                    width: 38px;
                    height: 38px;
                    background: #1c1c1c;
                    border-radius: 50px;
                    overflow: hidden;
                    box-shadow: 0 0 16px #00eeff80, 0 2px 10px #0008;
                    transition: box-shadow 0.3s, transform 0.2s;
                    vertical-align: middle;
                    z-index: 10;
                    margin-left: 12px;
                    border: 2px solid #00eeff;
                    cursor: pointer;
                }
                .btn-custom-button:hover {
                    box-shadow: 0 0 32px #00eeffcc, 0 4px 20px #000a;
                    transform: scale(1.08) rotate(-2deg);
                    border-color: #00eeff;
                }
                .btn-custom-button img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    margin: 0;
                    padding: 0;
                    border-radius: 8px;
                    background: transparent;
                    box-shadow: none;
                    transition: filter 0.3s;
                }
                .btn-custom-button:hover img {
                    filter: brightness(1.1) saturate(1.3);
                }
            `;
            document.head.appendChild(style);

            // Create button element
            const button = document.createElement('a');
            button.href = btnHref;
            button.target = '_blank';
            button.className = 'btn-custom-button';
            button.title = 'Search on BTN';

            // Create icon
            const img = document.createElement('img');
            img.src = 'https://ptpimg.me/hf11fs.png';
            img.alt = 'BTN Logo';

            // Assemble elements
            button.appendChild(img);
            titleEl.insertAdjacentElement('afterend', button);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


   function addButtonToTMDb() {
    // Only run on /tv/ pages
    if (!window.location.pathname.startsWith('/tv/')) return;

    // Find the container for social links
    const container = document.querySelector('.social_links');
    // Exit if container not found or button already exists
    if (!container || container.querySelector('.btn-custom-button')) return;

    // Get the TV show title from the page
    const title = document.querySelector('h2 a')?.textContent?.trim();
    if (!title) return;

   const href = `https://broadcasthe.net/torrents.php?artistname=${encodeURIComponent(title)}&action=advanced&foreign=0`;

    // Inject custom styles for the button and image
    const style = document.createElement('style');
    style.textContent = `
        .btn-custom-button {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 34px;
            background: #1c1c1c;
            border-radius: 50px;
            overflow: hidden;
            box-shadow: 0 0 16px #00eeff80, 0 2px 10px #0008;
            transition: box-shadow 0.3s, transform 0.2s;
            vertical-align: middle;
            z-index: 10;
            margin-left: 12px;
            border: 2px solid #00eeff;
            cursor: pointer;
        }
        .btn-custom-button:hover {
            box-shadow: 0 0 32px #00eeffcc, 0 4px 20px #000a;
            transform: scale(1.08) rotate(-2deg);
            border-color: #00eeff;
        }
        .btn-custom-button img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            margin: 0;
            padding: 0;
            border-radius: 8px;
            background: transparent;
            box-shadow: none;
            filter: grayscale(1); /* Black & white by default */
            transition: filter 0.3s;
        }
        .btn-custom-button:hover img {
            filter: none; /* Color on hover */
        }
    `;
    document.head.appendChild(style);

    // Create the button and append it to the container
    const button = createBTNButton(href);
    button.className = 'btn-custom-button';
    container.appendChild(button);
}

     function AddBTNLinkToTrakt() {
    const observer = new MutationObserver((mutations, obs) => {
      const tmdbButton = document.querySelector('li.tmdb');
      if (tmdbButton && !document.querySelector('li.btn-link')) {
        const showTitle = document.querySelector('meta[property="og:title"]')?.content?.trim();
        if (!showTitle) return;

        const btnItem = document.createElement('li');
        btnItem.className = 'btn-link';
        btnItem.setAttribute('data-toggle', 'tooltip');
        btnItem.setAttribute('data-original-title', 'Broadcasthe.net');

        const searchUrl = `https://broadcasthe.net/torrents.php?searchstr=${encodeURIComponent(showTitle)}`;

        btnItem.innerHTML = `
          <a target="_blank" href="${searchUrl}">
            <img src="https://ptpimg.me/hf11fs.png" style="height: 30px; width: auto;">
            <div class="number external-rating">
              <div class="rating">BTN</div>
              <div class="votes">Search</div>
            </div>
          </a>`;

        tmdbButton.parentNode.insertBefore(btnItem, tmdbButton.nextSibling);
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Execution based on hostname
  const hostname = window.location.hostname;

  if (hostname.includes('imdb.com')) {
    addButtonToIMDb();
  } else if (hostname.includes('themoviedb.org')) {
    addButtonToTMDb();
  } else if (hostname.includes('trakt.tv')) {
    AddBTNLinkToTrakt();
  }
})();