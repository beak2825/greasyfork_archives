// ==UserScript==
// @name         Old Reddit Auto-Expand Gallery & Show Thumbnails
// @description  Auto-expand the gallery and keep displaying the thumbnail grid to switch pictures.
// @author       C89sd
// @version      1.6
// @match        https://old.reddit.com/r/*/comments/*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536554/Old%20Reddit%20Auto-Expand%20Gallery%20%20Show%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/536554/Old%20Reddit%20Auto-Expand%20Gallery%20%20Show%20Thumbnails.meta.js
// ==/UserScript==
'use strict';

const SORT_BY_ASPECT = false;

GM_addStyle(`
.gallery-tiles {
  display: flex !important;
  flex-wrap: wrap !important;
  padding: 0 0 0px 0 !important;
  margin:  0 0 3px 0 !important;
/*   box-shadow: inset 0 -1px 0 0 #8888; */
  border-bottom: 2px solid rgb(197, 193, 173);
}
.gallery-tiles > * {
  display: block !important;
  padding: 0px !important;
  margin: 0 3px 0px 0 !important;
}
.gallery-tiles > * > * {
}
.gallery-tiles > * > * > img.preview {
  border-radius: 3px !important;
  height: auto !important;
  max-width: 100% !important;

  max-height: 100px !important;
  max-width:  100px !important;

  min-height: 40px !important;
  min-width:  40px !important;
}

.gallery-nav-bar { display: none  !important; } /* hide Back to Grid View and Previous Next buttons */
.gallery-preview { max-height: 400px !important; }
`);

const __THUMBNAIL     = '.expando .gallery-navigation[data-action="preview"]'; // clickable thumbnail
const __PREVIEW       = '.expando .gallery-preview';

// https://old.reddit.com/r/pics/comments/1kqlqe8/            .expando, single, auto expands + auto focus
// https://old.reddit.com/r/pics/comments/1kqd4i4/            .expando, many, expand and focus
// https://old.reddit.com/r/oddlyterrifying/comments/1d55cch/ .expando-uninitialized, single, load button expand and focus
// https://old.reddit.com/r/oddlyterrifying/comments/1k9kzdy/ .expando-uninitialized, many, load button expand and focus
const expando = document.querySelector('.expando');
if (expando) {
  if (expando.classList.contains('expando-uninitialized')) {
    // Wait for load
    const observer = new MutationObserver((mutations, obs) => {
        obs.disconnect();
        {
          hideAllPreviewsOnThumbnailClick();
          focusFirstPreview();
          sortByAspectRatio();
        }
    });
    observer.observe(expando, {childList: true});

    // Click load button (in document scope is fine for your case)
    const button = document.querySelector('.expando-button');
    if (button) button.click();
  } else
  {
    hideAllPreviewsOnThumbnailClick();
    focusFirstPreview();
    sortByAspectRatio();
  }
}

function sortByAspectRatio() {
  if (!SORT_BY_ASPECT) return;

  const outer = document.querySelector('.gallery-tiles');
  if (!outer) return;

  const list  = [];

  for (const inner of outer.children) {
    const img = inner.querySelector('img.preview');
    if (!img) continue;
    list.push({ inner, ratio: img.naturalHeight / img.naturalWidth });
  }

  list.sort((a, b) => b.ratio - a.ratio);
  for (const item of list) outer.appendChild(item.inner);
}

function focusFirstPreview() {
  const prev = document.querySelector(__PREVIEW);
  if (prev) prev.style.display = 'block';
}

function hideAllPreviewsOnThumbnailClick() {
  const thumbnails = document.querySelectorAll(__THUMBNAIL);
  const previews = document.querySelectorAll(__PREVIEW);

  for (let [i, thumbnail] of thumbnails.entries()) {
    thumbnail.addEventListener('click', () => {
      for (let [j, preview] of previews.entries()) {
        if (i !== j) preview.style.display = 'none';
      }
    });
  }
}

