// ==UserScript==
// @name        Higher quality covers
// @description Improved quality on product covers.
// @namespace   prpl.wtf
// @author      prpl.wtf
// @match       *://*builtbybit.com/*
// @grant       none
// @run-at      document-end
// @version     1.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486154/Higher%20quality%20covers.user.js
// @updateURL https://update.greasyfork.org/scripts/486154/Higher%20quality%20covers.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeVariantFromSrc(url) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete('variant');
    return urlObj.href;
  }

  document.querySelectorAll('img').forEach(img => {
    img.src = removeVariantFromSrc(img.src);
  });
})();