// ==UserScript==
// @name         Metro_Success1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/qnasuccess.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28976/Metro_Success1.user.js
// @updateURL https://update.greasyfork.org/scripts/28976/Metro_Success1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
setTimeout(function(){
    window.location.href = "qna2.aspx#top";
    }, 2000);
    
})();