// ==UserScript==
// @name         Safari Embedded WebM Support
// @namespace    safari-embedded-webm-support
// @version      1.2
// @description  Lets Safari play embedded WebM videos on supported imageboards: 4chan, 8chan, Gelbooru and Danbooru.
// @author       Calumks
// @grant        none
// @run-at       document-end
// @match        *://boards.4chan.org/*
// @match        *://8ch.net/*
// @match        *://gelbooru.com/index.php?page=post&*
// @match        *://danbooru.donmai.us/posts/*
// @downloadURL https://update.greasyfork.org/scripts/372076/Safari%20Embedded%20WebM%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/372076/Safari%20Embedded%20WebM%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the VLC video player
    function createVLC(video) {
        let vlc = document.createElement('embed');
        vlc.setAttribute('autoplay', true);
        vlc.setAttribute('loop', true);
        vlc.setAttribute('class', video.getAttribute('class'));
        vlc.setAttribute('type', 'application/x-vlc-plugin');
        vlc.setAttribute('pluginspage', 'http://www.videolan.org');
        vlc.setAttribute('width', 855);
        vlc.setAttribute('height', 481);
        vlc.setAttribute(
            'target', video.src || video.querySelector('source').src
        );
        video.after(vlc);
        video.setAttribute(
            'style', 'opacity: 0; height: 0; width: 0; display: none'
        );
        if (document.querySelector('a[title^="4chan X"]')) {
            let thumbnail = video.parentNode.querySelector('img');
            thumbnail.setAttribute('style', 'display: none');
            video.removeAttribute('src');
        }
        return vlc;
    }

    // Destroy the VLC player
    function destroyVLC(video, embed) {
        if (document.querySelector('a[title^="4chan X"]')) {
            let thumbnail = embed.parentNode.querySelector('img');
            thumbnail.removeAttribute('style');
            video.src = embed.target;
        }
        embed.remove();
    }

    // Filter observer nodes to video elements.
    function filterNodes(nodes) {
        nodes = Array.from(nodes);
        let n1 = nodes.filter(n => n instanceof HTMLVideoElement);
        let n2 = nodes
            .filter(n => n instanceof HTMLElement)
            .map(n => n.querySelector('video'))
            .filter(n => n);
        return n1.concat(n2);
    }

    // Dynamic videos
    new MutationObserver(mutations => {
        for(let mutation of mutations) {
            filterNodes(mutation.addedNodes).map(n => createVLC(n));
            filterNodes(mutation.removedNodes).map(n =>
                destroyVLC(n, mutation.target.querySelector('embed')));
        }
    }).observe(document, {attributes: false, childList: true, subtree: true});

    // On page load
    let video = document.querySelector('video');
    ! video || createVLC(video);
})();