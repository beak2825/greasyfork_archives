// ==UserScript==
// @name        BoxSizeMatters
// @namespace   Empornium
// @include     /^https://www\.empornium\.(me|sx|is)\/*/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @version     1.0.2
// @author      vandenium
// @description Saves the tag search box sizes of all pages with tag textbox
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499309/BoxSizeMatters.user.js
// @updateURL https://update.greasyfork.org/scripts/499309/BoxSizeMatters.meta.js
// ==/UserScript==
// Changelog:
// Version 1.0.2
// - Bug fixes:
//   - Fix issue of the torrent detail page overwriting the
//     torrent list page
// Version 1.0.1
// - Bug fixes:
//   - Fixes issue of not preserving correct size.
// Version 1.0.0
// - Initial Release!
// - Features:
//  - Saves the tag search box sizes of all pages

let resizeTimeout;
const storageKey = "box-size-matters";

const getDimensionsFromStorage = () => {
  const res = GM_getValue(storageKey);
  return res ? JSON.parse(GM_getValue(storageKey)) : undefined;
};

const saveDimensions = (el) => {
  console.log("Saving dimensions");
  const computedStyle = getComputedStyle(el);
  const dimensions = getDimensionsFromStorage() || {};

  dimensions[document.location.pathname] = {
    width: computedStyle.width,
    height: computedStyle.height,
  };

  GM_setValue(storageKey, JSON.stringify(dimensions));
};

const createResizeObserver = (el, cb) => {
  const ro = new ResizeObserver((entries) => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(() => {
      for (let entry of entries) {
        cb(el);
      }
    }, 250);
  });
  ro.observe(el);
};

function main() {
  const tagsInputEl = document.querySelector("#taginput[name=taglist]");
  if (!tagsInputEl) return;
  const dimensions = getDimensionsFromStorage();
  if (dimensions && dimensions[document.location.pathname]) {
    tagsInputEl.style.width = dimensions[document.location.pathname].width;
    tagsInputEl.style.height = dimensions[document.location.pathname].height;
  }
  createResizeObserver(tagsInputEl, saveDimensions);
}

main();
