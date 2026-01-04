// ==UserScript==
// @name         SMLWiki - Working drugs.html
// @namespace    https://greasyfork.org/en/users/1434767
// @version      1.0
// @description  Replaces the missing drugs.html on 4loz8bl.smlwiki.com with a working one from my website.
// @author       BoyOHBoy
// @match        https://4loz8bl.smlwiki.com/chumpchange.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526820/SMLWiki%20-%20Working%20drugshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/526820/SMLWiki%20-%20Working%20drugshtml.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.querySelectorAll('a[href="drugs.html"]');

    links.forEach(link => {
        link.href = "https://boyohboy.xyz/indux/drugs.html";
    });
})();