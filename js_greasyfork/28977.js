// ==UserScript==
// @name         Metro_prize_member
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/prize_member.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28977/Metro_prize_member.user.js
// @updateURL https://update.greasyfork.org/scripts/28977/Metro_prize_member.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){document.getElementById('ctl00_ContentPlaceHolder1_btnBuy').click(); }, 1000);    
})();
