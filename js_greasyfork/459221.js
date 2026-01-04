// ==UserScript==
// @name        Strip ?language= filter from TMDB
// @namespace   https://www.themoviedb.org/
// @description Removes the ?language= filter from TMDB.
// @include     https://www.themoviedb.org/*
// @version     2.0
// @author      NoahBK
// @license     MIT
// @grant       none
// @icon        https://i.imgur.com/lBxe0Df.png
// @downloadURL https://update.greasyfork.org/scripts/459221/Strip%20language%3D%20filter%20from%20TMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/459221/Strip%20language%3D%20filter%20from%20TMDB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const url = window.location.href;
  const newUrl = url.split("?")[0];
  window.history.replaceState({}, document.title, newUrl);
})();