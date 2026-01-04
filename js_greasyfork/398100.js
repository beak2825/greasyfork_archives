// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://feeds.qq.com/newtab/?adtag=homepage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398100/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/398100/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href = window.location.href
    if((href.indexOf("sojson=1") != -1) ){
        alert("123"); 
    }
})();