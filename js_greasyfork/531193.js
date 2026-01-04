// ==UserScript==
// @name         Instagram, Instant zoom
// @name:ja      Instagram, ズーム
// @namespace    http://tampermonkey.net/
// @version      2025-03-29.2
// @description  x2/x4 zoom for images/videos on timeline
// @description:ja タイムラインで画像をx2/x4ズームできます
// @author       You
// @match        https://*.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531193/Instagram%2C%20Instant%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/531193/Instagram%2C%20Instant%20zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM.addStyle(`
    ._aagv img, video {
        transition: transform 0.06s linear;
    }
    `);

    var zoomMultipoly = 2;

    document.body.addEventListener("mousemove", e => e.target.classList.contains("_aagw") && zoom(e));
    document.body.addEventListener("mouseout", e => e.target.classList.contains("_aagw") && cancelZoom(e));
    document.body.addEventListener("mousedown", e => e.target.classList.contains("_aagw") && moreZoom(e));
    document.body.addEventListener("mouseup", e => e.target.classList.contains("_aagw") && moreZoomOut(e));

    document.body.addEventListener("mousemove", e => e.target.role == "presentation" && zoomVideo(e));
    document.body.addEventListener("mouseout", e => e.target.role == "presentation" && cancelZoomVideo(e));

    function zoom(e) {
        const cover = e.target;
        var image = cover.previousSibling.firstChild;
        if (image.tagName != "IMG") return;

        const x = - (e.offsetX / cover.offsetWidth - 0.5) * (1 - 1 / zoomMultipoly) * 100;
        const y = - (e.offsetY / cover.offsetHeight - 0.5) * (1 - 1 / zoomMultipoly) * 100;
        image.style.transform = `scale(${zoomMultipoly}) translate(${x}%,${y}%)`;
    }

    function cancelZoom(e) {
        const image = e.target.previousSibling.firstChild;
        if (image.tagName != "IMG") return;

        image.style.transform = "";
        zoomMultipoly = 2;
    }

    function moreZoom(e) {
        zoomMultipoly = 4;
        zoom(e);
    }

    function moreZoomOut(e) {
        zoomMultipoly = 2;
        zoom(e);
    }

    function zoomVideo(e) {
        const cover = e.target;
        var video = e.target.parentNode.parentNode.parentNode.firstChild;
        if (video.tagName != "VIDEO") return;

        const x = - (e.offsetX / cover.offsetWidth - 0.5) * (1 - 1 / zoomMultipoly) * 100;
        const y = - (e.offsetY / cover.offsetHeight - 0.5) * (1 - 1 / zoomMultipoly) * 100;
        video.style.transform = `scale(${zoomMultipoly}) translate(${x}%,${y}%)`;
    }

    function cancelZoomVideo(e) {
        var video = e.target.parentNode.parentNode.parentNode.firstChild;
        if (video.tagName != "VIDEO") return;

        video.style.transform = "";
        zoomMultipoly = 2;
    }

})();