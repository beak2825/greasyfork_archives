// ==UserScript==
// @name        Replace stat names with icons
// @match       https://archiveofourown.org/*
// @grant       none
// @author      genusslicht
// @description Replaces stat titles and user navigation with icons from https://boxicons.com
// @license     MIT
// @namespace   ao3-boxicons
// @version     1.1
// @icon        https://archiveofourown.org/favicon.ico
// @require https://update.greasyfork.org/scripts/497064/1489249/AO3Boxicons.js
// @supportURL  https://gist.github.com/genusslicht/2ba4be62a30f936e7cc9d8f2c33409f5
// @downloadURL https://update.greasyfork.org/scripts/490214/Replace%20stat%20names%20with%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/490214/Replace%20stat%20names%20with%20icons.meta.js
// ==/UserScript==

(function () {
  IconifyAO3({
    iconifyStats: true,
    iconifyUserNav: true,
  });
})();