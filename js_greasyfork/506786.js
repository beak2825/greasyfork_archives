// ==UserScript==
// @name         ScrolllerDL
// @namespace    sdl
// @version      2025072201
// @description  download stuff from scrolller
// @author       Me
// @license      MIT
// @match        https://scrolller.com/*
// @match        https://images.scrolller.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scrolller.com
// @grant        GM_download
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/506786/ScrolllerDL.user.js
// @updateURL https://update.greasyfork.org/scripts/506786/ScrolllerDL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var findRelevantElement = () => {
        var images = document.querySelectorAll('img[class^=image_imageMedia__]');
        var videos = document.querySelectorAll('video[class^=VideoComponent_videoMedia__]');
        var elements = Array.from(images);
        elements = elements.concat(Array.from(videos));
        elements = elements.filter(e => e.tagName === "IMG" || e.tagName === "VIDEO");
        elements = elements.filter(e => {
            let bb = e.getBoundingClientRect();
            let keep = bb.top >= 0 && bb.top < window.innerHeight/2;
            console.log(e, bb.top, window.innerHeight, keep);
            return keep;
        });
        console.log(images, videos, elements);
        if (elements.length != 1)
            alert(`${elements.length} elements remaining`);
        else
            return elements[0];
    };

    var downloadElement = (element) => {
        if (!element || element.classList.contains('downloaded')) return;
        if (element.tagName === 'IMG' && element.src)
            GM_download(element.src, element.src.split('/').reverse()[0]);
        if (element.tagName === 'VIDEO') {
            var src = element.querySelector('source');
            if (!src) return;
            GM_download(src.src, src.src.split('/').reverse()[0].split('#')[0]);
        }
        element.classList.add('downloaded');
    }

    setInterval(() => {
        if (window.location.hash === '#autodl') {
            var element = findRelevantElement();
            downloadElement(element);
            window.close();
        } else {
            document.body.onkeydown = e => {
                if (e.key === '.') {
                    e.preventDefault();
                    var element = findRelevantElement();
                    downloadElement(element);
                }
            };
        }
    },500);

    setInterval(() => {
        var images = document.querySelectorAll('img[class^=Item_media__]');
        if (!images) return;
        Array.from(images).forEach(image => {
            if (!image || image.classList.contains('patched')) return;
            image.onmousedown = e => {
                if (e.shiftKey || e.ctrlKey || e.button) return;
                e.preventDefault();
                var a = image;
                while (a.tagName != "A") a = a.parentElement;
                window.open(a.href + "#autodl");
            };
        });
    },500);
    // Your code here...
})();