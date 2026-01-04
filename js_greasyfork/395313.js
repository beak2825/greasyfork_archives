// ==UserScript==
// @name         Show all OpenCart downloads
// @namespace    https://peschar.net/userscripts/show-all-opencart-downloads
// @version      0.1
// @description  Automatically paginate the OpenCart My Downloads page.
// @author       You
// @match        https://www.opencart.com/*?*route=account/download*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395313/Show%20all%20OpenCart%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/395313/Show%20all%20OpenCart%20downloads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seen = {};

    paginate();

    function paginate() {
        const nextPage = document.querySelector('#account-download nav li.active + li a[href]');
        if (!nextPage) {
            return;
        }
        const nextUrl = nextPage.href;
        if (seen[nextUrl]) {
            return;
        }
        seen[nextUrl] = true;
        console.log("GET", nextUrl);
        fetch(nextUrl)
            .then(r => r.text())
            .then(t => {
            const body = document.createElement('div');
            body.innerHTML = t;
            const nav = body.querySelector('#account-download nav');
            if (!nav) {
                return;
            }
            replaceElement(document.querySelector('#account-download nav'), nav);
            body.querySelectorAll('#downloads-list').forEach(item => nav.parentNode.insertBefore(item, nav));
            paginate();
        });
    }

    function replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
})();