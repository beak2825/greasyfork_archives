// ==UserScript==
// @name         Metro_grandprize_result
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/grandprize_result.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28978/Metro_grandprize_result.user.js
// @updateURL https://update.greasyfork.org/scripts/28978/Metro_grandprize_result.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){document.getElementById('ctl00_ContentPlaceHolder1_btnQna').click(); }, 1000);    
    
})();