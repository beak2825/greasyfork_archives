// ==UserScript==
// @name         KO4BB
// @namespace    http://tampermonkey.net/
// @version      2025-02-16
// @description  Correct problems in accessing KO4BB web site
// @author       eliocor
// @match        https://www.ko4bb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ko4bb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527081/KO4BB.user.js
// @updateURL https://update.greasyfork.org/scripts/527081/KO4BB.meta.js
// ==/UserScript==

(function patch_ko4bb() {
    'use strict';
    // Your code here...
    var i;
    var allLinks = document.links;
    //console.log('my script started..')
    if (allLinks != null)
    {
        for (i = 0; i <allLinks.length; ++i)
        {
            if (allLinks [i].href.indexOf ("www.ko4bb.com/index.php") > 0)
            {
                allLinks [i].href = allLinks [i].href.replace (
                    "www.ko4bb.com/index.php", 
                    "www.ko4bb.com/getsimple/index.php");
            }
        }
    }
})();

