// ==UserScript==
// @name             Full SI Swimsuit images
// @match            https://swimsuit.si.com/*
// @grant            none
// @version          1.2
// @author           https://github.com/matts0613
// @description      Auto opens the original/full size image on swimsuit.si.com.
// @namespace        https://swimsuit.si.com/*
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/451663/Full%20SI%20Swimsuit%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/451663/Full%20SI%20Swimsuit%20images.meta.js
// ==/UserScript==


//credit to user CertainPerformance on StackOverflow for helping with this script.

//replaces the constant string of 'c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/' from the image URL to automatically load the full size image.
if (window.location.href.includes('c_limit')) {
  window.location.href = window.location.href.replace('c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_700/', '');
}