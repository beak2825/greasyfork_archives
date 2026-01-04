// ==UserScript==
// @name Speed up media layout
// @namespace flamekiller#2822
// @version  1.1.5
// @grant    none
// @license MIT
// @author flamekiller
// @description Switch up the images shown in media loader on wordpress with thumbnails for better load time.
// @match *://www.asurascans.com/wp-admin/*
// @match *://asurascanstr.com/wp-admin/*
// @connect www.asurascans.com
// @connect asurascanstr.com
// @downloadURL https://update.greasyfork.org/scripts/441363/Speed%20up%20media%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/441363/Speed%20up%20media%20layout.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(() => {
    const thumbinter = setInterval(() => {
        const allImages = document.querySelectorAll('.media-frame-content .attachments-wrapper img');
        if (allImages.length > 0) {
            console.log('Running thumbify')
            allImages.forEach(img => {
                if (!img.src.includes('https://thumbor.gigafyde.dev/unsafe/fit-in/0x300/')) {
                    img.src = `https://thumbor.gigafyde.dev/unsafe/fit-in/0x300/${img.src}`
                }
            });
        }
    }, 1000);
})();