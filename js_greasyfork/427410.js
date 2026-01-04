// ==UserScript==
// @name         OpenClipArt Tags Copy Help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get tags, edit and copy
// @author       qubodup
// @match        https://openclipart.org/detail/*
// @icon         https://www.google.com/s2/favicons?domain=openclipart.org
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427410/OpenClipArt%20Tags%20Copy%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/427410/OpenClipArt%20Tags%20Copy%20Help.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tags="";
    $('#content > div:nth-child(1) > div.col-md-6.clipart-detail-meta > dl > dd:nth-child(2) a').each(function() {
        if (tags==""){tags=$(this).text();} else {
            tags=tags+","+$(this).text();
        }
    });
    tags = tags + "," + $('#use > div > div > div > ul > li:nth-child(3) > b').text();
    $('#content > div:nth-child(1) > div.col-md-6.clipart-detail-meta > div:nth-child(3)').prepend("<textarea>"+tags+"</textarea>");
})();