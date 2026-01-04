// ==UserScript==
// @name         CRK FIX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces now.gg/crkfix with the old CRK
// @author       Felix
// @match        https://now.gg/crkfix*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488576/CRK%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/488576/CRK%20FIX.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var replacementHTML = `
        <html>
        <head>
            <title>Fixed CRK.</title>
        </head>
        <body>
<iframe loading="lazy" class="video-iframe" src="https://now.gg/iframe/snippet?app_pkg=com.devsisters.ck&amp;partner=nowgg" width="100%" height="650" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
        </body>
        </html>
    `;

    document.documentElement.innerHTML = replacementHTML;
})();
