// ==UserScript==
// @name         Hentai in New Tabs by One Click
// @namespace    https://github.com/CinnamonJui
// @version      0.2.3
// @description  Make Lewding Easier
// @author       CinnamonJui
// @match        https://exhentai.org/g/*
// @match        https://e-hentai.org/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452049/Hentai%20in%20New%20Tabs%20by%20One%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/452049/Hentai%20in%20New%20Tabs%20by%20One%20Click.meta.js
// ==/UserScript==

/* jshint esversion:6 */

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function getImagePageLinks() {
    const gallery = document.getElementById('gdt');
    const imgs = Array(...gallery.children).filter( e => e.className === 'gdtl');
    const links = imgs.map(e => e.children[0].href);
    return links;
}



function openLinkInNewTab(l) {
    window.open(l, '_blank')
}

(function() {
    'use strict';
    addGlobalStyle('#gdo2 { width: 350px !important; }');

    const newTabBtn = document.createElement('div');
    newTabBtn.textContent = 'New Tab';
    newTabBtn.className = 'tha nosel';
    let isLewding = false;
    let NUM_LINK_PROCESSED = 0;
    let NUM_TOTAL_LINK = 0;
    function fetchImageLinkInImagePage(l) {
        const ret = fetch(l)
            .then(res => res.arrayBuffer())
            .then(u8arr => new TextDecoder().decode(u8arr))
            .then(body => new DOMParser().parseFromString(body, 'text/html'))
            .then(dom => dom.getElementById('img').src)
            .finally(_ => {
                NUM_LINK_PROCESSED += 1;
                newTabBtn.textContent = `${NUM_LINK_PROCESSED}/${NUM_TOTAL_LINK}`;
            });
        return ret;
    }
    newTabBtn.onclick = e => {
        e.preventDefault();
        if (isLewding) {
            console.log('Already opening image sources. Patience makes you a better person at lewding. 🍆');
            return;
        }
        isLewding = true;
        const pageLinks = getImagePageLinks();
        NUM_TOTAL_LINK = pageLinks.length;
        NUM_LINK_PROCESSED = 0;
        const imageLinks = pageLinks.map(fetchImageLinkInImagePage);
        Promise.all(imageLinks)
            .then(links => links.map(openLinkInNewTab))
            .finally(_ => {
                isLewding = false;
                newTabBtn.textContent = 'New Tab';
             });
    };

    const rowNumSec = document.getElementById('gd5');
    rowNumSec.append(newTabBtn);
})();