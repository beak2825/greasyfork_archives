// ==UserScript==
// @name         Danbooru
// @namespace    lander_scripts
// @version      0.1
// @description  Site improvements
// @author       You
// @match        https://danbooru.donmai.us/*
// @icon         https://www.google.com/s2/favicons?domain=donmai.us
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423524/Danbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/423524/Danbooru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.image-view-original-link').click();
})();
console.info('Dabooru - Site improvements: on');