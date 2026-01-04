// ==UserScript==
// @name        Enjin white theme
// @namespace   http://
// @include     /^https?://(.*enjin\.com|www.wrarp.org)/.*$/
// @description Script for forcing and enjin page to use white theme
// @version     3
// @grant       none

var cssLinks = document.getElementsByTagName("link");

for (var i = 0; i < cssLinks.length; ++i) {
    if (cssLinks[i].href.search("themes/core/css/theme.php") != -1) {
        cssLinks[i].href = "https://www.enjin.com/assets/20140609664/themes/core/css/theme.php?theme=263430&cache=20140609664-1399798657";
        break;
    } 
}

// @downloadURL https://update.greasyfork.org/scripts/35178/Enjin%20white%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/35178/Enjin%20white%20theme.meta.js
// ==/UserScript==