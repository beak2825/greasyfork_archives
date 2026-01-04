// ==UserScript==
// @name         BlibliTest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.blibli.com/checkout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387842/BlibliTest.user.js
// @updateURL https://update.greasyfork.org/scripts/387842/BlibliTest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
    document.getElementById('gdn-promo-id').value = "kejutan5";
    },2000);
    setTimeout(function() {
    document.getElementById('gdn-use-promo-id').click();
    },3000);
})();