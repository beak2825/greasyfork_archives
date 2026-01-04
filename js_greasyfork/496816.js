// ==UserScript==
// @name        RTP subs Downloader
// @namespace   Violentmonkey Scripts
// @match       https://www.rtp.pt/play*
// @grant       none
// @version     1.0
// @author      -
// @description 6/1/2024, 9:49:46 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496816/RTP%20subs%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496816/RTP%20subs%20Downloader.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Get the website's source code
    const sourceCode = document.documentElement.outerHTML;

    const urlPattern = /cdn-ondemand\.rtp\.pt\/nas2\.share\/legendas[\/\w]+/;
    const match = sourceCode.match(urlPattern);

    if (match) {
        var div = document.getElementsByClassName('text-muted vod-data')[0];

        var a = document.createElement('a');
        a.setAttribute('href','https://' + match[0] + '.vtt');
        a.setAttribute('download','sub');
        a.appendChild(document.createTextNode('DL PT'));
        div.appendChild(a);

        var a_en = document.createElement('a');
        a_en.setAttribute('href','https://' + match[0] + '_en.vtt');
        a_en.setAttribute('download','sub_en.vtt');
        a_en.appendChild(document.createTextNode(' DL EN'));
        div.appendChild(a_en);
    } else {
        console.log('URL not found in the website\'s content.');
    }
})();