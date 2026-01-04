// ==UserScript==
// @name         SHODAN - Twonky URLs extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twonky URLs extractor
// @author       You
// @match        https://beta.shodan.io/search?query=*twonkymedia*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shodan.io
// @grant        GM.setClipboard
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487464/SHODAN%20-%20Twonky%20URLs%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/487464/SHODAN%20-%20Twonky%20URLs%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urls = unsafeWindow.urls = jQuery('a.text-danger').toArray().map(x => x.href + '#photo').join('\n');
    var next = jQuery('.pagination a.button:contains("Next")').attr('href');

    unsafeWindow.copyAndGo = function(){
        GM.setClipboard(urls);
        if (next) {
            window.location.href = next;
        }
    };

    jQuery('.summary').prepend('<h6>Twonky URLs</h6><button onclick="copyAndGo()">copy & go</button><pre>'+ urls +'</pre>');
})();