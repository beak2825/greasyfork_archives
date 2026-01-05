// ==UserScript==
// @name         Metro_Success2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/qnasuccess2*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28982/Metro_Success2.user.js
// @updateURL https://update.greasyfork.org/scripts/28982/Metro_Success2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
setTimeout(function(){
    window.location.href = "qna3.aspx#top";
    }, 2000);
    
})();