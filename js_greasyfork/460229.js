// ==UserScript==
// @name             Full SI Swimsuit images
// @match            https://swimsuit.si.com/*
// @grant            none
// @version          1.1
// @author           https://github.com/matts0613
// @description      Auto opens the original/full size image on swimsuit.si.com.
// @namespace        https://swimsuit.si.com/*
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/460229/Full%20SI%20Swimsuit%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/460229/Full%20SI%20Swimsuit%20images.meta.js
// ==/UserScript==

if (window.location.href.includes('c_limit')) {
  window.location.href = window.location.href.replace('c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/', '');
}