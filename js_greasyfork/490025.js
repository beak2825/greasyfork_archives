// ==UserScript==
// @name        Remove file name from Apkadmin URLs
// @namespace   https://github.com/AbdurazaaqMohammed
// @author      Abdurazaaq Mohammed
// @version     1.0
// @description Removes unnecessary file name from Apkadmin URLs. This should be applicable to other websites too.
// @match       https://apkadmin.com/*
// @grant       none
// @run-at      document-start
// @homepage    https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL  https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/490025/Remove%20file%20name%20from%20Apkadmin%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/490025/Remove%20file%20name%20from%20Apkadmin%20URLs.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const url = window.location.href;
  const lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex > url.indexOf('//') + 1 && url.split('/').length > 4) {
    window.location.href = url.substring(0, lastSlashIndex);
  }

})();
