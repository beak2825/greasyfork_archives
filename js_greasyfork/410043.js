// ==UserScript==
// @name         E-Hentai Infinite Scroll
// @namespace    http://e-hentai.org/
// @version      0.1
// @description  Auto load next image. Free your hand from keyboard/mouse.
// @author       Bill.code
// @match        https://e-hentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410043/E-Hentai%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/410043/E-Hentai%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const displayArea = document.querySelector('#i3');
    let page = document;
    let lock = false;
    document.addEventListener('scroll', checkAndLoad, {passive: true});
    checkAndLoad();

    async function checkAndLoad() {
        if (document.body.clientHeight - window.scrollY < window.innerHeight * 4 && !lock) {
            lock = true;
            page = await loadPage(page);
            lock = false;
            console.log(page);
        }
    }
    function loadPage(dom) /* Promise<HTMLDocument>: the document of next page */ {
        const nextPageA = dom.querySelector('#next');
        if (!nextPageA) return;

        return fetch(nextPageA.href)
        .then(e => e.text())
        .then(rawHtml => {
            const parser = new DOMParser();
            const newDom = parser.parseFromString(rawHtml, 'text/html');
            displayArea.appendChild(newDom.querySelector('#i3 img'));
            return newDom;
        });
    }
})();