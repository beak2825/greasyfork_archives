// ==UserScript==
// @name         Github Code Font: Victor Mono
// @namespace    https://github.com/holyspiritomb
// @author       spiritomb
// @version      1.5.6a
// @description  Makes Github's code font Victor Mono. Targets mobile Chrome-based browsers via Adguard for Android & mobile Iceraven (Firefox) via Violentmonkey.
// @license      MIT
// @match        https://github.com/*
// @match        https://*.github.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @homepageURL  https://github.com/holyspiritomb/userscripts
// @homepage     https://github.com/holyspiritomb/userscripts
// @resource     victorR https://cdn.jsdelivr.net/npm/victormono@1.5.6/dist/woff/VictorMono-Regular.woff
// @resource     victorRW https://cdn.jsdelivr.net/npm/victormono@1.5.6/dist/woff2/VictorMono-Regular.woff2
// @resource     victorI https://cdn.jsdelivr.net/npm/victormono@1.5.6/dist/woff/VictorMono-Italic.woff
// @resource     victorIW https://cdn.jsdelivr.net/npm/victormono@1.5.6/dist/woff2/VictorMono-Italic.woff2
// @downloadURL https://update.greasyfork.org/scripts/519207/Github%20Code%20Font%3A%20Victor%20Mono.user.js
// @updateURL https://update.greasyfork.org/scripts/519207/Github%20Code%20Font%3A%20Victor%20Mono.meta.js
// ==/UserScript==

(function() {
    // this is hacky but it works?
    let victorRegular = GM_getResourceURL("victorR", false);
    let victorRegular2 = GM_getResourceURL("victorRW", false);
    let victorItalic = GM_getResourceURL("victorI", false);
    let victorItalic2 = GM_getResourceURL("victorIW", false);
    var css = "";
    css += `
            :root {
                --fontStack-monospace: "Victor Mono", ui-monospace, Menlo, Consolas, Liberation Mono, monospace;
            }

            @font-face {
                font-family: "Victor Mono";
                src: url(${victorRegular2}) format("woff2"),
                    url(${victorRegular}) format("woff");
                font-weight: 400;
                font-style: normal;
                font-display: swap;
            }
            
            @font-face {
                font-family: "Victor Mono";
                src: url(${victorItalic2}) format("woff2"),
                    url(${victorItalic}) format("woff");
                font-weight: 400;
                font-style: italic;
                font-display: swap;
            }
            
            .CheckStep-line,
            .blob-code-inner,
            .commit-ref,
            .highlight pre,
            .markdown-body code,
            .markdown-body pre,
            .markdown-body tt,
            .pl-c,
            .pl-c span,
            .react-blob-print-hide,
            .react-file-line,
            .text-mono,
            code .link-gray,
            code,
            kbd,
            pre,
            textarea#read-only-cursor-text-area,
            tt,
            [class^='pl-'] {
                font-family: "Victor Mono" !important;
            }
            .pl-c,
            .pl-c span {
                font-style: italic !important;
            }

    `;
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();
