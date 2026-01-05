// ==UserScript==
// @name        goodfon
// @namespace   selim@fastmail.fm
// @description remove ads
// @include     https://www.goodfon.ru/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19127/goodfon.user.js
// @updateURL https://update.greasyfork.org/scripts/19127/goodfon.meta.js
// ==/UserScript==

let bigBanner = document.querySelector(`div[style*='baner_f']`);
if(bigBanner) {
    bigBanner.parentElement.parentElement.removeChild(bigBanner.parentElement);
}

let bannerObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if(mutation.addedNodes.length > 0) {
            if(mutation.target.id.includes('google_ad')) {
                let banner = mutation.target.parentElement;
                banner.parentElement.removeChild(banner);
            } else if(mutation.target.id.includes('rb_ad')) {
                let banner = mutation.target.parentElement.parentElement.parentElement;
                banner.parentElement.removeChild(banner);
            }
        }
    });
});
bannerObserver.observe(document.body, { childList: true, subtree: true });  

let paragraphs = Array.from(document.querySelectorAll('div.container > p'));
if(paragraphs.length > 0) {
    paragraphs.forEach(p => p.parentElement.removeChild(p));
}

let footer = document.getElementById('footer');
if(footer) {
    footer.parentElement.removeChild(footer);
}

let widgetLine = document.querySelector('.menu_l > noindex');
if(widgetLine) {
    widgetLine.parentElement.removeChild(widgetLine);
}