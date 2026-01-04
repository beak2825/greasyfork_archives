// ==UserScript==
// @name        Chrome Cache Cleaner
// @namespace   tampermonkey
// @version     1.1
// @description Clears Chrome's cache
// @author      [Your Name]
// @match       *://*/*
// @icon   　　　https://w7.pngwing.com/pngs/968/191/png-transparent-google-chrome-web-browser-chrome-web-store-chrome-os-chromebook-google-logo-sphere-window-thumbnail.png
// @downloadURL https://update.greasyfork.org/scripts/495637/Chrome%20Cache%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/495637/Chrome%20Cache%20Cleaner.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // キャッシュクリアを実行
  chrome.browsingData.fetchDataStorageCache([
    {
      origin: 'https://' + window.location.hostname,
      storageType: 'cache'
    }
  ], function(bytes) {
    console.log('Cleared ' + bytes + ' bytes of cache.');
  });
})();
