// ==UserScript==
// @name         Sexfullmovies.net - Search Grid View
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  from list layout to clean and responsive grid view.
// @license      MIT
// @author       6969RandomGuy6969
// @match        https://sexfullmovies.net/?s=*
// @match        https://sexfullmovies.net/page/*/?s=*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://sexfullmovies.net&size=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543677/Sexfullmoviesnet%20-%20Search%20Grid%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/543677/Sexfullmoviesnet%20-%20Search%20Grid%20View.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Hide container early with minimal style injection
  const hideStyle = document.createElement('style');
  hideStyle.textContent = `
    main, #main, .content, .search-results, .content-area, section {
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(hideStyle);

  function applyGridLayout() {
    const articles = Array.from(document.querySelectorAll('article'));
    if (!articles.length) return;

    const parent = articles[0].parentNode;
    if (!parent) return;

    // Create a document fragment for performance
    const fragment = document.createDocumentFragment();

    // Grid wrapper styles as a class for better performance
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-grid-wrapper';

    // Apply grid wrapper styles only once via stylesheet injection for faster painting
    const style = document.createElement('style');
    style.textContent = `
      .custom-grid-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
      }
      .custom-grid-wrapper article {
        background: #1c1c1c;
        border-radius: 0;
        overflow: hidden;
        padding: 0;
        display: block;
        box-shadow: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        position: relative;
        cursor: pointer;
        margin: 0;
      }
      .custom-grid-wrapper article:hover {
        transform: scale(1.02);
        box-shadow: 0 0 12px rgba(255,255,255,0.08);
      }
      .custom-grid-wrapper article * {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      .custom-grid-wrapper .image-wrap {
        position: relative;
        width: 100%;
        display: block;
      }
      .custom-grid-wrapper img {
        width: 100% !important;
        height: auto !important;
        object-fit: cover !important;
        border-radius: 0 !important;
        display: block !important;
      }
      .custom-grid-wrapper span.movies {
        position: absolute;
        top: 8px;
        left: 8px;
        background-color: #06ad0c;
        color: #fff;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 0;
        z-index: 10;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      }
      .custom-grid-wrapper .info-wrap {
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      .custom-grid-wrapper .title {
        font-size: 14.5px;
        font-weight: 600;
        line-height: 1.4;
        text-align: left;
      }
      .custom-grid-wrapper .title a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
      }
      .custom-grid-wrapper .meta {
        font-size: 12px;
        color: #aaa;
        text-align: left;
      }
      .custom-grid-wrapper .contenido {
        font-size: 12px;
        line-height: 1.4;
        color: #ccc;
        text-align: left;
      }
    `;
    document.head.appendChild(style);

    articles.forEach(article => {
      const img = article.querySelector('img');
      const spanMovies = article.querySelector('span.movies');
      const title = article.querySelector('.title');
      const meta = article.querySelector('.meta');
      const desc = article.querySelector('.contenido');

      // Extract link from title if available
      let linkHref = '';
      if (title) {
        const aTag = title.querySelector('a');
        if (aTag) linkHref = aTag.href;
      }

      // Clear article content once before rebuilding
      article.textContent = '';

      // Image wrapper and image with link
      const imageWrap = document.createElement('div');
      imageWrap.className = 'image-wrap';

      if (img) {
        if (linkHref) {
          const imgLink = document.createElement('a');
          imgLink.href = linkHref;
          imgLink.appendChild(img);
          imageWrap.appendChild(imgLink);
        } else {
          imageWrap.appendChild(img);
        }
      }

      if (spanMovies) {
        imageWrap.appendChild(spanMovies);
      }

      // Info wrapper
      const infoWrap = document.createElement('div');
      infoWrap.className = 'info-wrap';

      if (title) infoWrap.appendChild(title);
      if (meta) infoWrap.appendChild(meta);
      if (desc) infoWrap.appendChild(desc);

      article.appendChild(imageWrap);
      article.appendChild(infoWrap);

      // Click handler outside links
      if (linkHref) {
        article.onclick = e => {
          if (!e.target.closest('a')) {
            window.location.href = linkHref;
          }
        };
      }

      fragment.appendChild(article);
    });

    // Empty parent and append fragment wrapped by wrapper
    parent.innerHTML = '';
    wrapper.appendChild(fragment);
    parent.appendChild(wrapper);

    // Remove sidebar and scroll overlays quickly
    document.querySelector('.sidebar.right.scrolling')?.remove();
    document.querySelector('.mCustomScrollBox')?.parentElement?.remove();

    // Show content by removing hide style
    hideStyle.remove();
    parent.style.visibility = 'visible';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGridLayout);
  } else {
    applyGridLayout();
  }
})();