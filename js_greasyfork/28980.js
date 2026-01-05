// ==UserScript==
// @name         Metro_prizeintro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/prizeintro*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28980/Metro_prizeintro.user.js
// @updateURL https://update.greasyfork.org/scripts/28980/Metro_prizeintro.meta.js
// ==/UserScript==


    (function() {
    'use strict';
setTimeout(function(){document.getElementById('ctl00_ContentPlaceHolder1_btnSubmit').click(); }, 2400);    
    
})();