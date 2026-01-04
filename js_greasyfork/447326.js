// ==UserScript==
// @name         OptiFine Link Fixer
// @license MIT
// @version      0.1
// @description  eliminates ad servers from OptiFine download links
// @author       shaples
// @icon         https://pbs.twimg.com/profile_images/1336182241613938689/MabYhp8e_400x400.jpg
// @grant        none
// @match https://optifine.net
// @match https://www.optifine.net
// @match http://www.optifine.net
// @namespace https://greasyfork.org/users/931199
// @downloadURL https://update.greasyfork.org/scripts/447326/OptiFine%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/447326/OptiFine%20Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var els = document.getElementsByTagName("*");
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        el.innerHTML = el.innerHTML.replace(/http\:\/\/adfoc\.us\/serve\/sitelinks\/\?id\=475250&amp;url=http/gi, 'https');
    }
})();