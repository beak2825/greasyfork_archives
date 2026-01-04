// ==UserScript==
// @name         Krnl Key Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A key system bypasser of Krnl
// @author       Keshiki
// @match        https://krnl.tech/getkey*
// @icon         null
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471861/Krnl%20Key%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/471861/Krnl%20Key%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let content = '@author [Keshiki]\n\nStarting key bypass...';
    document.body.innerText = content;

    let count = 0;
    let max_count = 5;
    function bypass() {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://krnl.tech/getkey", true);

            // Send the proper header information along with the request
            xhr.addEventListener('load', function(req) {
                if (max_count !== (count++)) {
                    document.body.innerText = `${content += `\nc${count} bypassed`}`
                    return bypass();
                }

                document.body.innerText = `${content += '\nKrnl Key System has been bypassed, have fun exploiting!'}`;
            })
            xhr.addEventListener('abort', bypass)
            xhr.addEventListener('error', bypass)
            xhr.send(null)
        } catch { }
    }
    bypass()
})();