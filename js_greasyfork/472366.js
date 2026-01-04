// ==UserScript==
// @name Twitter Adkiller
// @author Rop Gonggrijp (ropg)
// @version 0.1
// @description Removes X/Twitter Ads. 
// @match https://mobile.twitter.com/*
// @match https://twitter.com/*
// @match https://x.com/*
// @license MIT
// @grant none
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/1143231
// @downloadURL https://update.greasyfork.org/scripts/472366/Twitter%20Adkiller.user.js
// @updateURL https://update.greasyfork.org/scripts/472366/Twitter%20Adkiller.meta.js
// ==/UserScript==

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
if (MutationObserver) console.log('No Ads is enabled.');
let observer = new MutationObserver(e => {
    let ads = $("article div[dir='rtl'] > span:contains('Ad')");
    if (ads) {
        ads.remove();
        console.log('Ads have been removed.');
    }
});
observer.observe(document.body, {childList: true, subtree: true});