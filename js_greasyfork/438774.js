// ==UserScript==
// @name         Remove sponsored ads from Facebook
// @namespace    https://www.facebook.com/
// @version      0.1
// @description  remove sponsored ads from Facebook
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438774/Remove%20sponsored%20ads%20from%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/438774/Remove%20sponsored%20ads%20from%20Facebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("scroll", findAndRemoveAds);
    let sponsoredString = "S\no\nc\nd\nd\nr\nf\nt\np\nS\ni\np\no\ni\no\nn\ns\ng\nn\no\nr\nn\nt\ne\nsor\nd\ned\n";

    function findAndRemoveAds() {
        let ads = [...document.querySelectorAll('.fbpnormal')];
        ads.forEach(ad => {
            if (ad.innerText.includes(sponsoredString)) {
                ad.remove();
                console.log("ad deleted", ad);
            }
        });
    }


})();