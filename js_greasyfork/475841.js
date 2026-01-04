// ==UserScript==
// @name         oreilly style wider reading
// @namespace    https://learning.oreilly.com/
// @version      0.1
// @description  make the h2, h3 and a visible as they have weird color scheme
// @author       Sagar Yadav
// @match        https://learning.oreilly.com/*
// @icon         https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_0fd365ee7f3306426d937d338cc69e54/o-reilly.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475841/oreilly%20style%20wider%20reading.user.js
// @updateURL https://update.greasyfork.org/scripts/475841/oreilly%20style%20wider%20reading.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var readwidth = document.getElementsByClassName('orm-ChapterReader-readerContainer')[0];
        document.getElementsByClassName("orm-ChapterReader-readerContainer")[0].style.maxWidth = "120ch";
    }, 1000);
})();