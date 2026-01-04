// ==UserScript==
// @name         Apple Music Quality Detector
// @match        https://music.apple.com/*
// @run-at       document-idle
// @grant        none
// @description  a m stuff
// @namespace    greasyfork
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/428833/Apple%20Music%20Quality%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/428833/Apple%20Music%20Quality%20Detector.meta.js
// ==/UserScript==

setTimeout(async function() {
    'use strict';

    const tracks = document.querySelector('div.product-info div.songs-list');
    if (!tracks) return;
    let _e;
    const albidRegex = document.location.href.match(/https?:\/\/music\.apple\.com\/(?:\w+)\/album\/[^\/]*\/?(\d+)/);
    if (!albidRegex) return;
    let albdata = JSON.parse((_e=JSON.parse(document.getElementById("shoebox-media-api-cache-amp-music").innerText),_e[Object.keys(_e).find(a=>a.indexOf(".catalog.") > 0)])).d[0];
    tracks.querySelectorAll('button.preview-button').forEach(function(e) {
        const songElem = e.parentElement.parentElement.parentElement;
        const id = JSON.parse(e.getAttribute("data-metrics-click")).targetId;
        const meta = albdata.relationships.tracks.data.find(item => (item.id - id) === 0).attributes;
        const added = new Set();
        const addQuality = function() {
            const songLengthElement = songElem.querySelector(".songs-list-row__song-wrapper");
            //var quality_element = document.createElement('div');
            if (added.has(songLengthElement) || songLengthElement === null) return;
            added.add(songLengthElement);
            const qualitySpan = document.createElement("span");
            qualitySpan.innerText = "" + meta.audioTraits;
            if (meta.isMasteredForItunes){
                qualitySpan.innerText += ", ADM";
            }
            qualitySpan.innerHTML += ` <a href="https://aplossless.decrypt.site/${id}" target="_blank">Download</a> `;
            songLengthElement.before(qualitySpan);
        }
        addQuality();
        new MutationObserver(addQuality).observe(e, { childList: true, subtree: true });
    });

}, 2000);