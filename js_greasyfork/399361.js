// ==UserScript==
// @name         RemoveBanners
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       andres
// @include      *appen.com*
// @include      *view.appen.io/*
// @include      *account.appen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399361/RemoveBanners.user.js
// @updateURL https://update.greasyfork.org/scripts/399361/RemoveBanners.meta.js
// ==/UserScript==

(function() {
    'use strict';

   document.querySelector("#global_banner").remove();document.querySelector(".assignments").style.paddingTop="1%";
})();
