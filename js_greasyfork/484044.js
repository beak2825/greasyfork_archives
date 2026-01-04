// ==UserScript==
// @name         zkillboard-allGreen
// @namespace    http://zkillboard.com/
// @version      1.1
// @description  Changes highlighting of red entries (losses) on zkb to green to help the zkill warriors feel better
// @author       Rick
// @match        https://zkillboard.com/character/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zkillboard.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484044/zkillboard-allGreen.user.js
// @updateURL https://update.greasyfork.org/scripts/484044/zkillboard-allGreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelectorAll('.killListRow.error').forEach(elem => {
   elem.classList.remove('error');
   elem.classList.add('winwin');
});
})();