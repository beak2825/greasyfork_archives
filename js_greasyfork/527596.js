// ==UserScript==
// @name         SMLWiki - Restored obituary.html
// @namespace    https://greasyfork.org/en/users/1434767
// @version      1.0
// @description  Restores obituary.html on nfl.smlwiki.com with an archive from my website.
// @author       BoyOHBoy
// @match        https://nfl.smlwiki.com/global/sidebar.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527596/SMLWiki%20-%20Restored%20obituaryhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/527596/SMLWiki%20-%20Restored%20obituaryhtml.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the anchor element
    var link = document.createElement('a');
    link.href = 'https://boyohboy.xyz/indux/obituary.html';
    link.target = '_parent';

    // Create the image element
    var img = document.createElement('img');
    img.src = 'https://boyohboy.xyz/indux/obituary/candles.png';
    img.style.position = 'absolute';
    img.style.top = '109px';
    img.style.marginLeft = '13px';

    // Append image to the link
    link.appendChild(img);

    // Append link to body
    document.body.appendChild(link);
})();
