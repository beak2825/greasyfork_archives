// ==UserScript==
// @name         MZITU Infinite Scroll
// @namespace    http://www.mzitu.com/
// @version      0.1
// @description  Free your hand from mouse/keyboard
// @author       You
// @match        https://www.mzitu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410116/MZITU%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/410116/MZITU%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const displayArea = document.querySelector('.main-image p');
    let page = document;
    let lock = false;
    let lastPage = null;
    document.addEventListener('scroll', checkAndLoad, {passive: true});
    checkAndLoad();

    async function checkAndLoad() {
        if (document.body.clientHeight - window.scrollY < window.innerHeight * 4 && !lock) {
            lock = true;
            page = await loadPage(page);
            lock = false;
        }
    }
    function loadPage(dom) /* Promise<HTMLDocument>: the document of next page */ {
        const nextPageA = dom.querySelector('.pagenavi a:last-child');
        if (nextPageA.innerText !== '下一页»' || lastPage === nextPageA.href) return;

        lastPage = nextPageA.href;
        return fetch(nextPageA.href)
        .then(e => e.text())
        .then(rawHtml => {
            const parser = new DOMParser();
            const newDom = parser.parseFromString(rawHtml, 'text/html');
            displayArea.appendChild(newDom.querySelector('.main-image img'));
            return newDom;
        });
    }
})();