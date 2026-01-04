// ==UserScript==
// @name         "Someone followed SomeoneYouFollow" hider [neocities.org]
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes "Someone followed SomeoneYouFollow" from feed
// @author       https://neocities.org/site/dimden
// @match        https://neocities.org/
// @match        https://neocities.org/?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neocities.org
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450180/%22Someone%20followed%20SomeoneYouFollow%22%20hider%20%5Bneocitiesorg%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/450180/%22Someone%20followed%20SomeoneYouFollow%22%20hider%20%5Bneocitiesorg%5D.meta.js
// ==/UserScript==

(function() {
    let followings = Array.from(document.getElementsByClassName('following-list')[0].children).filter(e => e.tagName === "A").map(e => e.href.slice(6));
    let followNews = Array.from(document.getElementsByClassName('follow'));
    for(let i in followNews) {
        let f = followNews[i];
        if(f.innerText.includes('You followed')) continue;
        if(f.innerText.includes('followed you')) continue;
        let titles = Array.from(f.getElementsByClassName('text')[0].children).filter(e => e.tagName === "A");
        if(titles.length === 2) {
            if(!followings.includes(titles[0].href.slice(6))) {
                f.remove();
            }
        }
    }
})();