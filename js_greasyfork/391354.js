// ==UserScript==
// @name         fuck adfly
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.pro/*site=adfly*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391354/fuck%20adfly.user.js
// @updateURL https://update.greasyfork.org/scripts/391354/fuck%20adfly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    let desc = getQueryVariable("dest");
    if(desc && desc.startsWith("http"))
        location.href = decodeURIComponent(desc);

    // Your code here...
})();