// ==UserScript==
// @name         taro's baraag unspoiler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove spoiler from media tabs
// @author       You
// @match        https://baraag.net/*/media
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baraag.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464699/taro%27s%20baraag%20unspoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/464699/taro%27s%20baraag%20unspoiler.meta.js
// ==/UserScript==

let shouldCheck = false;
let previousScroll = 0;


function removeSpoilers(){ // unfortunately i am too lazy to not use jquery for this
    $(".account-gallery__item__icons").each(function(i, obj) { //obj = DOM element
            $(obj).click();
    }
)}

function waitForElm(selector) { //.on('appears') doesn't run if the object doesn't exist yet...
    return new Promise(resolve => {

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm('.account-gallery__item').then(()=>{ removeSpoilers(); });

window.onscroll = function(ev) {

    if (previousScroll < window.innerHeight + window.pageYOffset && shouldCheck) {shouldCheck = false; removeSpoilers(); } //very ugly but i dont want it running every scroll... might as well have it only when going down

    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        previousScroll = window.innerHeight + window.pageYOffset;
        shouldCheck = true;

        console.log("Reached bottom of the page. Next scroll will clean...");
        $(".load-more").click();
    }
};