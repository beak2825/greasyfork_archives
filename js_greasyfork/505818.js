// ==UserScript==
// @name         Remove GIF Images
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Menghapus semua gambar GIF dari halaman web
// @author       OgiDarmaTena
// @match        *://*/*
// @grant        none
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/gao2rrpotdq1jixsq8rsgazliqt5
// @downloadURL https://update.greasyfork.org/scripts/505818/Remove%20GIF%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/505818/Remove%20GIF%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var images = document.querySelectorAll('img');
    for (let img of images) {
        if (img.src.endsWith('.gif')) {
            console.log("Removing img with GIF:", img);
            img.remove();
        }
    }
})();
