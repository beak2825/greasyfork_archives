// ==UserScript==
// @name         Metro_Success3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/qnasuccess3*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28981/Metro_Success3.user.js
// @updateURL https://update.greasyfork.org/scripts/28981/Metro_Success3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
setTimeout(function(){
    window.location.href = "qna4.aspx#top";
    }, 2000);
    
})();