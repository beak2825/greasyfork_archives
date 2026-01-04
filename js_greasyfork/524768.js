// ==UserScript==
// @name         GMedia for Hummus
// @namespace    http://hummus.sys42.net/
// @version      1.2.0
// @description  Adds HTML5 media support + embeds YouTube and other media sources! (mini fix)
// @author       gn0mesort & natsu (original), upgraded by Pinkie Pie
// @license      MIT
// @match        https://hummus.sys42.net/*
// @match        https://hmus.sys42.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524768/GMedia%20for%20Hummus.user.js
// @updateURL https://update.greasyfork.org/scripts/524768/GMedia%20for%20Hummus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertMedia() {
        const targets = document.querySelectorAll('.attachment-inner a, .markup>a, .attachment-inner img');
        const scroller = document.querySelector('.scroller.messages');
        const scroll = scroller ? scroller.scrollHeight - scroller.scrollTop === scroller.clientHeight : false;
        let dataFound = false;

        targets.forEach(target => {
            const handled = target.getAttribute('handled.gnomesort.media');
            const hrefAttr = target.href || target.getAttribute('href');
            if (!handled && hrefAttr) {
                const href = hrefAttr.replace(/^(https?)/g, 'https');
                const ext = href.split('.').pop().toLowerCase();
                const fileName = href.split('/').pop();

                let data;
                if (href.includes("youtube.com/watch") || href.includes("youtu.be/")) {
                    // 🎬 YouTube Embedding
                    const videoId = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                    if (videoId && videoId[1]) {
                        data = document.createElement('iframe');
                        data.src = `https://www.youtube.com/embed/${videoId[1]}`;
                        data.width = "560";
                        data.height = "315";
                        data.frameBorder = "0";
                        data.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        data.allowFullscreen = true;
                    }
                } else if (['mp4', 'webm', 'mov', 'mkv'].includes(ext)) {
                    // 🎥 Video Embedding
                    data = document.createElement('video');
                    data.src = encodeURI(href);
                    data.type = `video/${ext}`;
                    data.controls = true;
                    data.style = "max-width: 100%; height: auto;";
                } else if (['mp3', 'mpeg', 'ogg', 'wav', 'flac', 'aac'].includes(ext)) {
                    // 🎵 Audio Embedding
                    data = document.createElement('audio');
                    data.src = encodeURI(href);
                    data.type = `audio/${ext}`;
                    data.controls = true;
                } else if (href.includes("soundcloud.com")) {
                    // 🎧 SoundCloud Embedding
                    data = document.createElement('iframe');
                    data.src = `https://w.soundcloud.com/player/?url=${encodeURI(href)}`;
                    data.width = "100%";
                    data.height = "166";
                    data.frameBorder = "0";
                    data.allow = "autoplay";
                }

                if (data) {
                    dataFound = true;
                    console.log(`Media Found! type is ${ext} & href is ${href}`);

                    // Create metadata display with filename and loop control
                    const loopControl = 'Loop: <input type="checkbox" name="loop" style="vertical-align: middle" onchange="this.closest(\'div\').querySelector(\'video, audio\').loop = this.checked">';
                    const metaDataElement = document.createElement('div');
                    metaDataElement.className = "metadata gnomesort-metadata";
                    metaDataElement.style = "font-size: 11px; color: gray";
                    metaDataElement.innerHTML = `<a href="${href}" style="font-size: 11px; display: inline" handled.gnomesort.media="true">${fileName}</a> - ${ext} - ${loopControl}`;

                    const container = document.createElement('div');
                    container.appendChild(data);
                    container.appendChild(metaDataElement);
                    target.replaceWith(container);

                    target.setAttribute('handled.gnomesort.media', true);
                }
            }
        });

        if (scroll && dataFound) {
            scroller.scrollTop = scroller.scrollHeight;
            console.log('Scrolling to most recent!');
        }
    }

    // Setup observers to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        convertMedia();
        observer.disconnect();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run for already loaded content
    convertMedia();
})();
