// ==UserScript==
// @name         YT Thumbnails
// @namespace    http://thegeeex.free.fr/
// @version      1.4.1
// @description  Hover over a thumbnail to see images from the video
// @author       Geeex
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/18975/YT%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/18975/YT%20Thumbnails.meta.js
// ==/UserScript==

var prev, to,
    path = 'https://i.ytimg.com/vi/',
    ext = 'jpg';

document.body.addEventListener('mousemove', function(e) {
    var img = e.target, id;
    if (img.src && (match = img.src.match(/^https:\/\/i\.ytimg\.com\/\w+\/([\w-]+)\/\w+.+$/)) && !img.dataset.ytThumb) {
        img.dataset.ytThumb = id = match[1];
        img.style.backgroundColor = '#000';
        img.style.backgroundImage = 'url(' + path + id + '/1.' + ext + ')';
        img.style.backgroundSize = '100% 134%';
        img.style.backgroundPosition = '0 50%';
        preload(path + id + '/2.' + ext,
                path + id + '/3.' + ext);
    }
    if (img == prev) return;
    if (prev) {
        prev.src = path + prev.dataset.ytThumb + '/mqdefault.' + ext;
        prev = false;
    }
    if (img.tagName == 'IMG' && img.dataset.ytThumb) {
        var loop = function() {
            if (prev != img) return;
            img.style.backgroundImage = img.style.backgroundImage.replace(/\/[123]\./, '/' + i + '.');
            i = [1,2,3,1][i];
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(loop, 1000);
        }, i = 1;
        prev = img;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1px*1px transparent
        loop();
        return;
    }
}, true);

// Preload an array of images
function preload(imgs) {
    if (typeof imgs == 'string') imgs = [].slice.call(arguments);
    var img = new Image();
    img.onload = img.onerror = function() {
        if (imgs.length) img.src = imgs.shift();
    };
    img.src = imgs.shift();
}
