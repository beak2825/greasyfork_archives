// ==UserScript==
// @name         GMX/Mail.com Outgoing URL Decoder
// @namespace    https://github.com/2zzly/GMX-Mail-deref-decoder
// @version      1
// @description  Decodes and rewrites external URLs. Stops URL tracking/analytics
// @author       1Deref
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473510/GMXMailcom%20Outgoing%20URL%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/473510/GMXMailcom%20Outgoing%20URL%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeAndRewriteUrl(url) {
        const regexMail = /https:\/\/deref-mail\.com\/mail\/client\/([a-zA-Z0-9-_]{11})\/dereferrer\/\?redirectUrl=(.+)/;
        const regexGMX = /https:\/\/deref-gmx\.net\/mail\/client\/([a-zA-Z0-9-_]{11})\/dereferrer\/\?redirectUrl=(.+)/;

        const matchMail = url.match(regexMail);
        const matchGMX = url.match(regexGMX);

        if (matchMail && matchMail[2]) {
            const strippedUrl = matchMail[2];
            const decodedUrl = decodeURIComponent(strippedUrl);
            return decodedUrl;
        }

        if (matchGMX && matchGMX[2]) {
            const strippedUrl = matchGMX[2];
            const decodedUrl = decodeURIComponent(strippedUrl);
            return decodedUrl;
        }

        return null;
    }

    function injectScript(frame) {
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const links = document.querySelectorAll('a');
                for (const link of links) {
                    const decodedUrl = decodeAndRewriteUrl(link.href);
                    if (decodedUrl) {
                        link.href = decodedUrl;
                    }
                }
            })();
        `;
        frame.contentDocument.head.appendChild(script);
    }

    function handleFrames() {
        const frames = document.querySelectorAll('iframe');
        for (const frame of frames) {
            injectScript(frame);
        }
    }

    // Handle the top-level document
    const links = document.querySelectorAll('a');
    for (const link of links) {
        const decodedUrl = decodeAndRewriteUrl(link.href);
        if (decodedUrl) {
            link.href = decodedUrl;
        }
    }

    // Handle frames
    handleFrames();
})();
