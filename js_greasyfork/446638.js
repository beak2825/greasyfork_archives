// ==UserScript==
// @name        Google Ads Gone
// @description Remove Ads from Google Results
// @version 0.5
// @grant none
// @author Lucdev
// @namespace https://lucdev.net
// @license UNLICENSE - https://unlicense.org/
// @match *://*.google.com/search?*
// @match *://google.com/search?*
// @downloadURL https://update.greasyfork.org/scripts/446638/Google%20Ads%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/446638/Google%20Ads%20Gone.meta.js
// ==/UserScript==
(() => {
    const domReady = (cb) => {
        if (document.readyState === 'complete') {
            return cb();
        }
        document.addEventListener('readystatechange', domReady.bind(
            null, cb));
    };
 
    const removeHtmlElement = (el) => el.parentElement.removeChild(el);
 
    domReady(() => {
        const adsArray = Array.from(document.querySelectorAll(
            '[aria-label="Ads"], [data-text-ad]'));
        if (adsArray.length > 0) {
            adsArray.forEach((el) => removeHtmlElement(el));
            console.log(`There was ${adsArray.length} ad results`);
        }
    });
})();
