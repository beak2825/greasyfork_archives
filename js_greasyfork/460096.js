// ==UserScript==
// @name         RemoveGoogleSearchItemsIcon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Google Search Items Icon
// @author       yangke
// @match        *://www.google.com/search*
// @match        *://www.google.com.*/search*
// @match        *://www.google.com/
// @match        *://www.google.com.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460096/RemoveGoogleSearchItemsIcon.user.js
// @updateURL https://update.greasyfork.org/scripts/460096/RemoveGoogleSearchItemsIcon.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf("/search")>-1){
        document.querySelectorAll("div#search  a span div > img").forEach(iconElement => {
            let parentDivElement = iconElement.parentElement;
            let parentSpanElement = parentDivElement.parentElement;
            let parentItemElement = parentSpanElement.parentElement;
            parentItemElement.removeChild(parentSpanElement);
        });
    }
})();