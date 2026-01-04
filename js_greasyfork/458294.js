// ==UserScript==
// @name         tastedive yohoho injector
// @description  inject yohoho iframe replace youtube iframe in tastedive site
// @match        https://tastedive.com/*
// @grant        GM_getResourceText
// @license MIT
// @version 0.3
// @namespace https://greasyfork.org/users/739921
// @downloadURL https://update.greasyfork.org/scripts/458294/tastedive%20yohoho%20injector.user.js
// @updateURL https://update.greasyfork.org/scripts/458294/tastedive%20yohoho%20injector.meta.js
// ==/UserScript==

let search = true;
let observer = new MutationObserver(mutationRecords => {
    if (search) {
        const ifr = document.querySelector('div > iframe[class^="JustWatchWidget"]');
        if (ifr && !document.querySelector('div[id="yohoho"][data-title]')) {
            search = false;
            const script = document.createElement('script');
            script.src = "https://yohoho.cc/yo.js";
            document.body.appendChild(script);
            const title = document.querySelector(`meta[itemprop="name"][content]`).getAttribute("content");
            const year = document.querySelector(`meta[itemprop="url"][content]`).getAttribute("content").split("-").slice(-1)[0];
            const yohoho = document.createElement('div');
            yohoho.id = "yohoho";
            yohoho.setAttribute("data-title", `${title} (${year})`);
            ifr.parentNode.replaceChild(yohoho, ifr);
            console.log(`mounted: <div id="yohoho" data-title="${title} (${year})"></div>`);
            search = true;
        }
    }
});

observer.observe(document, {
    childList: true,
    subtree: true,
    characterDataOldValue: true
});
