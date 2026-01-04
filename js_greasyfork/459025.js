// ==UserScript==
// @name         Scroll to item in RYM list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Scrolls down to an item in RYM list
// @author       jermrellum
// @match        https://rateyourmusic.com/lists/new_item_a*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459025/Scroll%20to%20item%20in%20RYM%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/459025/Scroll%20to%20item%20in%20RYM%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(scrollTo, 10)

    function scrollTo()
    {
        var albumsList = document.getElementsByClassName("mbgen")[0];
        var infobox = document.getElementsByClassName("mbgen")[1];
        var albumId = infobox.querySelector('.album').title;

        var n = -1;

        for(var i=1; i<albumsList.rows.length; i+=2)
        {
            if(albumsList.rows[i].cells[0].children[2] != undefined && albumsList.rows[i].cells[0].children[2].title == albumId)
            {
                n = i;
                break;
            }
        }

        if(n > 0)
        {
            var ot = albumsList.rows[n].offsetTop;
            document.getElementsByClassName("bubble_content")[0].children[3].scrollBy(0, Math.max(0, (ot - 250)));
        }
    }
})();