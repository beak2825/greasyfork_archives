// ==UserScript==
// @name         Sort youtube videos
// @namespace    http://tampermonkey.net/
// @version      1.01
// @license MIT
// @description  Bring back the sort videos feature for Music Youtube channels
// @author       WitherOfMc
// @match        https://www.youtube.com/*/*/video*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447643/Sort%20youtube%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/447643/Sort%20youtube%20videos.meta.js
// ==/UserScript==

// discussion: https://www.reddit.com/r/youtube/comments/k4s1cm/did_youtube_remove_the_feature_to_sort_videos_by/

(function () {
  'use strict';
  const sortMenu = document.querySelector('#sort-menu');
  sortMenu.style.background = 'white';
  sortMenu.style.padding = '8px';
  sortMenu.style.borderRadius = '2px';
  sortMenu.style.boxShadow = 'var(--shadow-elevation-2dp_-_box-shadow)';
  sortMenu.style.fontSize = '1.2em';
  sortMenu.innerHTML = `
  <label for="sort-select">Sort by:</label>
  <select name="sort-select" id="sort-select" onchange="location = this.value;">
    <option disabled selected value> -- select an option -- </option>
    <option value="?view=0&sort=p&flow=grid">Most popular</option>
    <option value="?view=0&sort=da&flow=grid">Date added (oldest)</option>
    <option value="?view=0&sort=dd&flow=grid">Date added (newest)</option>
  </select>
    `;
})();