// ==UserScript==
// @name         Remove NSFW blur on GameBanana
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes... NSFW blur...
// @author       HACKER3000
// @license      MIT
// @match        https://gamebanana.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406462/Remove%20NSFW%20blur%20on%20GameBanana.user.js
// @updateURL https://update.greasyfork.org/scripts/406462/Remove%20NSFW%20blur%20on%20GameBanana.meta.js
// ==/UserScript==

function gb_remove_nsfw_blur() {
    Array.prototype.forEach.call(document.getElementsByClassName('NsfwPreview'), e => { //for each element with the NsfwPreview class
        var blur_idx = Array.prototype.indexOf.call(e.classList, 'NsfwPreview'); //get position in class array of NsfwPreview
        if (blur_idx > -1) {
            var e_cl = Array.from(e.classList); //make copy of classlist
            e_cl.splice(blur_idx, 1); //remove NsfwPreview from copy
            e.classList = e_cl; //write copy back
        }
    });
};

//im too stupid to trigger this properly so i just trigger on scroll and pointermove
window.addEventListener('scroll', gb_remove_nsfw_blur);
window.addEventListener('pointermove', gb_remove_nsfw_blur);
setTimeout(gb_remove_nsfw_blur, 5000);
