// ==UserScript==
// @name        redact deez
// @namespace   userscript1
// @match       https://www.deezer.com/*
// @grant       none
// @version     0.1.2
// @author      -
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479681/redact%20deez.user.js
// @updateURL https://update.greasyfork.org/scripts/479681/redact%20deez.meta.js
// ==/UserScript==

(function() {
  'use strict';

   window.setInterval(() =>{
      document.querySelector('.chakra-stack svg , a[aria-label="Deezer"]').style.background='black';
    }, 2000);

})();