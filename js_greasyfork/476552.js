// ==UserScript==
// @name        derpibooru- Choose thumbnail size
// @namespace   Violentmonkey Scripts
// @match       https://derpibooru.org/*
// @grant       none
// @version     1.4.3
// @license     MIT
// @author      Saphkey
// @description 10/07/2025 Adds a selector for thumbnail sizes. Forces thumbnail size by replacing srcset property and changing src.
// @downloadURL https://update.greasyfork.org/scripts/476552/derpibooru-%20Choose%20thumbnail%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/476552/derpibooru-%20Choose%20thumbnail%20size.meta.js
// ==/UserScript==

(function () {
  const THUMBNAIL_KEY = 'derpibooru_thumbnail_size';
  const DEFAULT_SIZE = 'thumb'; // or 'large'

  function getUserSize() {
    return localStorage.getItem(THUMBNAIL_KEY) || DEFAULT_SIZE;
  }

  function setUserSize(size) {
    localStorage.setItem(THUMBNAIL_KEY, size);
    location.reload();
  }
function createSizeSelector() {
  const select = document.createElement('select');
  select.id = 'thumbnail-size-selector';
  select.name = 'thumbnail-size-selector';
  select.className = 'input header__input';
  select.autocomplete = 'off';

  const sizes = { thumb: "small", medium: 'Medium', large: 'Large', full:"full" };

  // Create optgroup and label it
  const optgroup = document.createElement('optgroup');
  optgroup.label = "Thumbnail Sizes";

  for (const [val, label] of Object.entries(sizes)) {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    if (val === getUserSize()) opt.selected = true;
    optgroup.appendChild(opt);
  }

  // Append optgroup to select
  select.appendChild(optgroup);

  select.addEventListener('change', () => {
    setUserSize(select.value);
  });

  const filterMenu = document.getElementById('filter-quick-menu');
  if (filterMenu && filterMenu.parentNode) {
    filterMenu.parentNode.insertBefore(select, filterMenu.parentNode.firstChild);
  }
}

  function updateThumbImages() {
  console.log("ForceThumbnailSize started.");

  const size = localStorage.getItem('derpibooru_thumbnail_size') || 'thumb';
  const imgEls = document.getElementsByTagName('img');

  for (let i = 0; i < imgEls.length; i++) {
    try {
      let imgEl = imgEls[i];

      if (imgEl.src && /\/(thumb|small|medium|large)(?=\.\w{3,4}(\?.*)?$)/.test(imgEl.src)) {
        const originalSrc = imgEl.src;

        // Construct the new src with desired size
        const newSrc = imgEl.src.replace(/\/(thumb|small|medium|large)(?=\.\w{3,4}(\?.*)?$)/, `/${size}`);

        if (newSrc === originalSrc) {
          continue;
        }

        // Set fallback handler before changing src
        imgEl.onerror = function() {
          // If newSrc fails, fallback to full once
          if (imgEl.src !== originalSrc) {
            imgEl.src = originalSrc.replace(/\/(thumb|small|medium|large)(?=\.\w{3,4}(\?.*)?$)/, '/full');
          }
          // Remove the error handler to prevent infinite loops
          imgEl.onerror = null;
        };

        imgEl.src = newSrc;
      }
    } catch (e) {
      console.error("Error in updateThumbImages:", e);
    }
  }
}

  createSizeSelector();
  window.onload = function() {
  	updateThumbImages();
	};
})();