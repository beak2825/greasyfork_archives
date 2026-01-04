// ==UserScript==
// @name         Apple Music Quality + DL Links
// @match        https://music.apple.com/*
// @run-at       document-idle
// @grant        none
// @author       denlekke
// @version      1.1
// @description  add quality description and dl link to apple music page
// @namespace https://greasyfork.org/users/133827
// @downloadURL https://update.greasyfork.org/scripts/428990/Apple%20Music%20Quality%20%2B%20DL%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/428990/Apple%20Music%20Quality%20%2B%20DL%20Links.meta.js
// ==/UserScript==

setTimeout(async function() {
    'use strict';

    const tracks = document.querySelector('div.product-info div.songs-list');
    if (!tracks) return;
    let _e;
    const albidRegex = document.location.href.match(/https?:\/\/music\.apple\.com\/(?:\w+)\/album\/[^\/]*\/?(\d+)/);
    if (!albidRegex) return;
    var track_ids = [];
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
            qualitySpan.id = 'newarea';
            qualitySpan.innerText = "" + meta.audioTraits;
            if (meta.isMasteredForItunes){
                qualitySpan.innerText += ", ADM";
            }
            qualitySpan.innerHTML += ` <a href="https://aplossless.decrypt.site/${id}" target="_blank">Download</a> `;
            track_ids.push(`https://aplossless.decrypt.site/${id}`);
            songLengthElement.before(qualitySpan);
            var downloadAll = document.createElement("div");
            downloadAll.id= "downloadAll";
            downloadAll.innerHTML += `<a id="downLinks" href="#">Copy all&nbsp;</a>`;
            downloadAll.addEventListener('click', function() {
                navigator.clipboard.writeText(track_ids.join("\n")).then(function() {
                    alert('content copied');
                }, function() {
                    alert('copy failed');
                });
            });
            qualitySpan.appendChild(downloadAll);
        }
        new MutationObserver(addQuality).observe(e, { childList: true, subtree: true });
    });


    document.querySelector('downLinks')
}, 2000);