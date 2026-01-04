// ==UserScript==
// @name         Bing Image Thumb Full Rezifier
// @namespace    https://heptal.com
// @version      0.1
// @description  Replace low-rez result <img> src attributes w/ full resolution src - now right-click open/save
// @author       heptal
// @match        *.bing.com/images/search*
// @match        bing.com/images/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388462/Bing%20Image%20Thumb%20Full%20Rezifier.user.js
// @updateURL https://update.greasyfork.org/scripts/388462/Bing%20Image%20Thumb%20Full%20Rezifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.iusc').forEach(a => { a.querySelector('img').src=JSON.parse(a.getAttribute('m')).murl} )
})();