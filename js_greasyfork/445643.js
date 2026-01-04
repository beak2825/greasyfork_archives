// ==UserScript==
// @name         youtube most replay remove
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove the annoying thing
// @author       wuw2135
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @include      https://www.youtube.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445643/youtube%20most%20replay%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/445643/youtube%20most%20replay%20remove.meta.js
// ==/UserScript==

function deletenode(){
    const els = document.getElementsByClassName('ytp-heat-map-container');
    Array.prototype.forEach.call(els, function(el){
        el.remove();
    });
}

setInterval(deletenode ,500);