// ==UserScript==
// @name        IMDB Re-prioritize
// @version     1.0.2
// @namespace   http://www.agj.cl/
// @description Raises the 'Details' and 'Storyline' blocks to right below the main information block on any IMDB movie page.
// @license     Unlicense
// @include     /^https?:\/\/(www.)?imdb.com\/title\/.+$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39539/IMDB%20Re-prioritize.user.js
// @updateURL https://update.greasyfork.org/scripts/39539/IMDB%20Re-prioritize.meta.js
// ==/UserScript==

// Utils.

const onLoad = (cb) =>
  /interactive|complete/.test(document.readyState)
    ? setTimeout(cb, 0)
    : document.addEventListener("DOMContentLoaded", cb);
const sel = document.querySelector.bind(document);

// Modify stuff.

onLoad(() => {
  if (window.top !== window.self) return; // Prevent loading on iframes.

  const details = sel("#titleDetails");
  const storyline = sel("#titleStoryLine");
  const mainBottom = sel("#main_bottom");

  mainBottom.prepend(storyline);
  mainBottom.prepend(details);
});
