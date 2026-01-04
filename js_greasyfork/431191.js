// ==UserScript==
// @name         Hide News Feed
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hides Facebook news feed
// @author       https://github.com/bumbeishvili
// @match        https://www.facebook.com/
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431191/Hide%20News%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/431191/Hide%20News%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(d=>{
       document.querySelectorAll('div[role="feed"]')[0].style.display="none"
    },500)
    
})();