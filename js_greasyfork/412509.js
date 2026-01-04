// ==UserScript==
// @name         Mangadex Read Complete description on search page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple script to show all the describtion in mangadex.org search page!
// @author       ETHYT
// @match        https://mangadex.org/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412509/Mangadex%20Read%20Complete%20description%20on%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/412509/Mangadex%20Read%20Complete%20description%20on%20search%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#content > .mx-0.mt-1.row > div.my-1.pl-0.border-bottom.col-lg-6.manga-entry > div').css({
    overflow: 'auto',
});
})();