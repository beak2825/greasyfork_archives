// ==UserScript==
// @name         Copy text from fanfiction.net
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allow copy from fanfiction.net
// @author       scuzz
// @match        https://www.fanfiction.net/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32401/Copy%20text%20from%20fanfictionnet.user.js
// @updateURL https://update.greasyfork.org/scripts/32401/Copy%20text%20from%20fanfictionnet.meta.js
// ==/UserScript==
(function () {
    //I dunno what event puts the user-select on, and I'm too lazy to find it.
    setTimeout(function(){
        document.getElementById('storytextp').style['user-select'] = "auto";
        console.log("probably removed copy-protect?");
    }, 500);
}) ();
