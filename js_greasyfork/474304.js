// ==UserScript==
// @name         Instagram removed sponsored posts
// @namespace    ig-removed-sponsored-posts
// @homepage     ig-removed-sponsored-posts
// @license MIT
// @version      0.1
// @description  Removed sponsored posts from IG
// @author       AZ
// @match        *://*.instagram.com/*
// @match        *.instagram.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474304/Instagram%20removed%20sponsored%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/474304/Instagram%20removed%20sponsored%20posts.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const targetNode = document.querySelector('body');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                hideSponsoredPost()
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

})();


function hideSponsoredPost() {
    document.querySelectorAll('article:not([data-verify="complete"])').forEach((el) => {
        if (el.innerText.includes("Sponsored")) {
            el.classList.add("hide")
            // el.querySelector("video")?.remove();
            console.log(`sponsored post detected`);
        }
        el.dataset.verify = "complete";
    })
}

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

addStyle(`
  .hide {
    visibility: hidden;
		height: 0;
  }
`);

addStyle(`
  .hide div {
   display: none !important;
  }
`);

addStyle(`
  .hide div[role="presentation"] {
    display: none !important;
  }
`);