// ==UserScript==
// @name         imagefruit ad blocker
// @namespace    https://www.imagefruit.com/
// @version      0.3
// @description  try to remove ads on imagefruit.com pages.
// @author       sftec
// @match        https://www.imagefruit.com/*
// @match        https://www.imgshots.com/*
// @match        https://www.imgshots.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406017/imagefruit%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/406017/imagefruit%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.getElementById("layer").remove();
    document.getElementById("introOverlayBg").remove();
})();