// ==UserScript==
// @name  tomatomediavn
// @name:vi         tomatomediavn
// @description  nothing
// @namespace hello
// @match *gg*
// @grant none
// @require https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @license         https://tomatotranslation.com/ve-tomato/
// @connect         tomatotranslation.com
// @run-at document-end
// @version 0.5
// @downloadURL https://update.greasyfork.org/scripts/444452/tomatomediavn.user.js
// @updateURL https://update.greasyfork.org/scripts/444452/tomatomediavn.meta.js
// ==/UserScript==
(function () {
  'use strict';
 
  const getFlacLink = (downloadLink) =>
    downloadLink
      .replace(/\/download(\d\/)/, '/stream$1')
      .replace(/\/(128|320|m4a|32)\//, '/flac/')
      .replace(/\.(mp3|m4a)$/, '.flac');
 
  const $downloadItem = document.querySelector('a.download_item');
  const $downLossLess = document.querySelector('a#download_lossless');
 
  if (!$downLossLess) return;
  if (!$downLossLess.href) $downLossLess.setAttribute('href', getFlacLink($downloadItem.href));
  $downLossLess.setAttribute('target', '_blank');
  $downLossLess.setAttribute('title', $downloadItem.title);
  $downLossLess.setAttribute('style', 'color: #6610f2;');
  $downLossLess.classList.add('music_downloaded');
})();