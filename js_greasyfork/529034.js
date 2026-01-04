// ==UserScript==
// @name        Zupimages Cleaner
// @namespace   Violentmonkey Scripts
// @match       https://www.zupimages.net/viewer.php?*
// @version     1.0.0
// @author      IsilinBN
// @description 15/02/2025 15:12:00
// @license     http://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529034/Zupimages%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/529034/Zupimages%20Cleaner.meta.js
// ==/UserScript==

$(() => {
  const loadStyle = () => {
    const style = `
      #imagesplus_modal,
      #imagesplus_overlay {
        display: none !important;
      }
    `;

    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(style);
    } else {
      let $styleNode = document.createElement('style');
      $styleNode.appendChild(document.createTextNode(style));
      (document.querySelector('head') || document.documentElement).appendChild(
        $styleNode,
      );
    }
  };

  $(document).ready(function () {
    loadStyle();
  });
});
