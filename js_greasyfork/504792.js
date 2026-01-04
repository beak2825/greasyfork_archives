// ==UserScript==
// @name         All X(Twitter) Images
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download all original images on X media time-line
// @author       Jimmy Chen
// @match        https://x.com/*/media*
// @match        https://twitter.com/*/media*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_download
// @run-at       document-idle
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/504792/All%20X%28Twitter%29%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/504792/All%20X%28Twitter%29%20Images.meta.js
// ==/UserScript==

let user = '';
let lastHeight = 0;
let observer = new MutationObserver(resetTimer);
let timer = setTimeout(action, 2000, observer);
clearTimeout(timer);
let images = {};

function addButton(text, onclick, cssObj, id) {
    const defaultCSS = {position: 'fixed', top: '7%', left:'50%', 'z-index': 3,
                        "background-color": "#57cff7", "color": "white",
                        "padding": "10px", "border": "0px",
                        "font-size": "1rem","font-weight": "bold" }
    cssObj = Object.assign(defaultCSS, cssObj || {} )
    let button = document.createElement('button'), btnStyle = button.style;
    document.body.appendChild(button)
    button.innerHTML = text;
    button.onclick = onclick
    btnStyle.position = 'fixed';
    button.id = id;
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
    return button;
}

function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 2000, observer);
}

function scrollToBottom() {
    window.scrollBy(0, window.innerHeight);
    //console.log("scroll to " + window.scrollY);
    //console.log("document height: " + document.body.scrollHeight);
}

function action(observer) {
    getImageUrl();
    scrollToBottom();
    let currentHeight = window.scrollY + window.innerHeight;
    //console.log("current: " + currentHeight);
    if (currentHeight >= document.body.scrollHeight) {
        observer.disconnect();
        downloadAllImgs();
        return;
    }
    lastHeight = window.scrollHeight;
}

function getImageUrl() {
    document.querySelectorAll('li[role="listitem"] img').forEach(image => {
        let url = URL.parse(image.src);
        let path = url.pathname.split('/').pop();
        let ext = url.searchParams.get('format');
        let name = user + '-' + path + '.' + ext;
        url.searchParams.set('name', 'large');
        images[name] = url.href;
    });
}

function downloadAllImgs() {
    console.log("total images: " + Object.keys(images).length);
    Object.keys(images).forEach(key => {
        GM_download(images[key], key);
    });
}

function begin() {
    observer.observe(document, {childList: true, subtree: true});
    scrollToBottom();
}

(function() {
    'use strict';

    addButton("download all images", begin, {top: '7%'}, "a-begin-button");


    let fields = window.location.pathname.split('/');
    user = fields[1];
})();
