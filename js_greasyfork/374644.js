// ==UserScript==
// @name         t7meel.xyz Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.112
// @description  autoclick
// @author       
// @match        https://www.t7meel.xyz/file/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374644/t7meelxyz%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/374644/t7meelxyz%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
      var href = document.querySelector('.dl-link a').href;
      window.location.href = href
})();