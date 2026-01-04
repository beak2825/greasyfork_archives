// ==UserScript==
// @name         Bluesky embed
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  Embed bluesky posts on the blue websight
// @author       Milan
// @match        https://*.websight.blue/thread/*
// @license      MIT
// @icon         https://lore.capital/static/blueshi.png
// @connect      embed.bsky.app
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/518081/Bluesky%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/518081/Bluesky%20embed.meta.js
// ==/UserScript==


const EMBED_URL = 'https://embed.bsky.app';

function scan(node) {
    if (node === void 0) { node = document; }
    const embeds = node.querySelectorAll('[data-bluesky-uri]');
    for (let i = 0; i < embeds.length; i++) {
        const id = String(Math.random()).slice(2);
        const embed = embeds[i];
        const aturi = embed.getAttribute('data-bluesky-uri');
        if (!aturi) {
            continue;
        }
        const ref_url = location.origin + location.pathname;
        const searchParams = new URLSearchParams();
        searchParams.set('id', id);
        if (ref_url.startsWith('http')) {
            searchParams.set('ref_url', encodeURIComponent(ref_url));
        }
        const iframe = document.createElement('iframe');
        iframe.setAttribute('data-bluesky-id', id);
        iframe.src = "".concat(EMBED_URL, "/embed/").concat(aturi.slice('at://'.length), "?").concat(searchParams.toString());
        iframe.width = '100%';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.flexGrow = '1';
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        const container = document.createElement('div');
        container.style.maxWidth = '600px';
        container.style.width = '100%';
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.className = 'bluesky-embed';
        container.appendChild(iframe);
        embed.replaceWith(container);
    }
}

(function() {
    'use strict';

    window.bluesky = window.bluesky || {
        scan: scan,
    };

    window.addEventListener('message', function (event) {
        if (event.origin !== EMBED_URL) {
            return;
        }
        var id = event.data.id;
        if (!id) {
            return;
        }
        var embed = document.querySelector("[data-bluesky-id=\"".concat(id, "\"]"));
        if (!embed) {
            return;
        }
        var height = event.data.height;
        if (height) {
            embed.style.height = "".concat(height, "px");
        }
    });

    const node_list = document.querySelectorAll(".message a[href^='https:\/\/bsky']");
    Array.from(node_list).forEach(link => {
        const oembed_url = "https://embed.bsky.app/oembed?mode=dark&url=";
        GM_xmlhttpRequest({
            method: "GET",
            url: oembed_url + link.href,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                const embed = JSON.parse(response.responseText).html;
                link.parentElement.innerHTML += embed;
                scan();
            }
        });
    });

})();