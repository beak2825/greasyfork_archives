// ==UserScript==
// @name         Suppress BetterJsPop
// @version      0.1.0
// @description  Prevent popunders on Leolist
// @author       salad: https://greasyfork.org/en/users/241444-salad 
// @include      https://www.leolist.cc/*
// @namespace https://greasyfork.org/users/241444
// @downloadURL https://update.greasyfork.org/scripts/377025/Suppress%20BetterJsPop.user.js
// @updateURL https://update.greasyfork.org/scripts/377025/Suppress%20BetterJsPop.meta.js
// ==/UserScript==

(function() {

  let BJSCookie = 'BetterJsPop0=1';

  let cookies = document.cookie.split('; ');

  let hasBJSCookie = cookies.includes(BJSCookie);

  if(!hasBJSCookie) {
    document.cookie = `${BJSCookie}; expires=2021-03-11T20:38:13.742Z`;
  }

})();
