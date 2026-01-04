// ==UserScript==
// @name         remove ads from smbc & clear view
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  It might not work correctly for your device, adjust value in unzoomPage function.
// @author       resursator
// @license      MIT
// @match        https://www.smbc-comics.com/comic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smbc-comics.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526901/remove%20ads%20from%20smbc%20%20clear%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/526901/remove%20ads%20from%20smbc%20%20clear%20view.meta.js
// ==/UserScript==

function cleanElements() {
    'use strict';
    const target = document.getElementById('cc-comicbody');
    let prevElement = target.previousElementSibling;

    // Check if previous element is an anchor tag containing an image
    if (prevElement && prevElement.tagName === 'A' &&
        prevElement.querySelector('img')) {
        prevElement.remove();
    }

    const comicright = document.getElementById('comicright');
    if (comicright) {
        comicright.remove();
    }

    const comicleft = document.getElementById('comicleft');
    if (comicleft) {
        comicleft.style.width = '100%';
    }

    if (target) {
        document.getElementById('cc-comic').style.width = '95%';
        target.style.width = '95%';
        target.style.marginLeft = 'auto';
        target.style.marginRight = 'auto';
    }

    const buythis = document.getElementById('buythis');
    if (buythis) {
        buythis.remove();
    }

    const jumpbar = document.getElementById('hw-jumpbar');
    if (jumpbar) {
        jumpbar.remove();
    }

    const commentspace = document.getElementById('comment-space');
    if (commentspace) {
        commentspace.remove();
    }

    const blogHeader = document.getElementById('blogheader');
    if (blogHeader) {
        blogHeader.style.marginLeft = '18%';
    }
}

function fixViewport() {
    let meta = document.querySelector("meta[name='viewport']");
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "viewport";
        document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1.0";
}

function unzoomPage() {
    // change 1.3 to whatever you need, I'm not sure if it works the same on other devices
    let scale = 1.3 / window.devicePixelRatio;
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = "0 0";
    document.body.style.width = `${100 / scale}%`;
    document.documentElement.style.width = "100vw";
}

fixViewport();
cleanElements();
unzoomPage();