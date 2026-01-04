// ==UserScript==
// @name         Stack Overflow / Stack Exchange Helper
// @namespace    SanHuo
// @version      0.1
// @description  A Stack Overflow / Stack Exchange Helper
// @author       cschengshen@gmail.com
// @include        https://*.stackexchange.com/*
// @include        https://*.stackoverflow.com/*
// @include        https://stackexchange.com/*
// @include        https://stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429978/Stack%20Overflow%20%20Stack%20Exchange%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/429978/Stack%20Overflow%20%20Stack%20Exchange%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let container = document.querySelector(".container");
    container.style.maxWidth = "100%";
    let content = document.querySelector("#content");
    content.style.maxWidth = "100%";
})();