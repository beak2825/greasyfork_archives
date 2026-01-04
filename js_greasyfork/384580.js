// ==UserScript==
// @name         ACC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.telegram.org/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/384580/ACC.user.js
// @updateURL https://update.greasyfork.org/scripts/384580/ACC.meta.js
// ==/UserScript==


async function resolve(url) {
    return await new Promise((rs, rj) => {
        GM_xmlhttpRequest({
            method: "GET",
            ignoreRedirect: true,
            url: url,
            onload: r => rs(r.finalUrl),
            onerror: r => rj(r),
        });
    });
}

function resolveUnsafe(url) {
    return url.match(/tg:\/\/unsafe_url\?url=https%3A%2F%2Famzn.to%2F/) ? decodeURIComponent(url.split('=')[1]) : url;
}

(async function() {
    'use strict';


    setInterval(function(){/*
        const newLinks = [];
        newLinks.push(jQuery('.emoji.emoji-spritesheet-2').next('a:not(".visited")'));
        newLinks.push(jQuery('a:contains("Sorpresa"):not(".visited")'));
        newLinks.forEach(function(nl) {
            nl.toArray().forEach(a => {
                var url = false;
                if (a.href.match(/unsafe/)) {
                    url = decodeURIComponent(a.href.split('=')[1]);
                } else {
                    url = a.href;
                }
                window.open(url);
            });
            nl.addClass('visited');
        });*/

        const clearLinks = jQuery('a[href^="https://amzn.to/"]:not(.visited)');
        const unsafeLinks = jQuery('a[href^="tg://unsafe_url?url=https%3A%2F%2Famzn.to%2F"]:not(.visited)');
        const urls = clearLinks.toArray().map(a => a.href);
        [].push.apply(urls,unsafeLinks.toArray().map(a => resolveUnsafe(a.href)));

        urls.forEach(async function(url){
            const res = await resolve(url);
            if(res && res.match && res.match(/\/g\//)) {
                window.open(res);
            }
        })
        clearLinks.addClass('visited');
        unsafeLinks.addClass('visited');

    }, 500);
})();