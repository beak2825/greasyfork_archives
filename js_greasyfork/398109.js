// ==UserScript==
// @name         Google Favicons
// @namespace    GoogleFavicons
// @version      1.1
// @description  Adds favicons into google search page
// @author       AskseL
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398109/Google%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/398109/Google%20Favicons.meta.js
// ==/UserScript==

const FAVICON_SIZE = 16;
const FAVICON_PADDING_RIGHT = 8;
const FAVICON_PADDING_TOP = 28;

/**
 * Get favicon url
 * @param {HTMLNode} div The search result div
 * @returns {string} The favicon url
 */
const getFaviconURL = (div) => {
  const href = div.querySelector('a').getAttribute('href');
  const { hostname } = new URL(href);
  return `https://www.google.com/s2/favicons?domain=${hostname}`;
};

/**
 * Create favicon img element
 * @param {string} src The favicon url
 * @returns {HTMLNode}
 */
const createFavicon = (src) => {
  const id = Math.random().toString();

  fetch(src)
  .then(response => response.blob())
  .then(image => {
      // Then create a local URL for that image and print it
      const url = URL.createObjectURL(image);
      document.getElementById(id).src = url;
  });

  const img = document.createElement('img');
  img.id = id;

  const imgContainer = document.createElement('div');

  imgContainer.style.width = '16px';
  imgContainer.style.height = '16px';
  imgContainer.style.paddingRight = `${FAVICON_PADDING_RIGHT}px`;
  imgContainer.style.paddingTop = `${FAVICON_PADDING_TOP}px`;

  imgContainer.appendChild(img);
  return imgContainer;
};

/**
* Check if Google has rolled out native favicons
*  for the user's favicons
*/
const hasNativeFavicons = (el) => {
  const link = el.querySelector('a');
  const target = link.querySelector('img');
  return !!target;
}

/**
 * Add favicons to Google search results
 */
const addFavicons = () => {
  document.querySelectorAll('div .rc').forEach(row => {
    const test = hasNativeFavicons(row);
    if (test) return;

    const faviconURL = getFaviconURL(row);
    const faviconIMG = createFavicon(faviconURL);

    const parent = row.parentElement;
    const container = document.createElement('div');
    container.class = 'results-row-container';
    container.appendChild(faviconIMG);
    container.appendChild(row);
    container.style.display = 'flex';

    parent.innerHTML = '';
    parent.appendChild(container);
    row.querySelector('div .r').style.width = '75vw';
  });
};

window.onload = addFavicons;