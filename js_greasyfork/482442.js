// ==UserScript==
// @name         Copy Magnet Links to Clipboard
// @namespace    yyyzzz999
// @author       yyyzzz999
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @version      0.3
// @description  Copy all links on the current page that start with magnet to the clipboard.
// @author       Bing AI, me
// @icon         https://tpb.party/static/img/tpblogo_sm_ny.gif
// @match        https://tpb.party/search/coast%20to%20coast%20am/*
// @match        https://tpb.party/search/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482442/Copy%20Magnet%20Links%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/482442/Copy%20Magnet%20Links%20to%20Clipboard.meta.js
// ==/UserScript==

// old icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

(function() {
    'use strict';

    var links = document.getElementsByTagName('a');
    var magnetLinks = [];
    var magnetCount =0;
    //console.log(links);
    var limit = 31; // Set to >= 31 to get all the links per page
    if (links.length < limit) limit = links.length;
    console.log("limit: ",limit);
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.startsWith('magnet') && (magnetCount < limit) ) {
            magnetLinks.push(links[i].href);
            magnetCount +=1
        }
    }
    console.log("magnetCount: ",magnetCount);
    GM_setClipboard(magnetLinks.join('\n'));
    console.log(magnetLinks);
})();
