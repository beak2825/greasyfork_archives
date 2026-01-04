// ==UserScript==
// @name Block Amazon Xray
// @name:de Block Amazon Xray
// @namespace https://github.com/xnivaxhzne/hide-prime-xray/
// @author xnivaxhzne
// @description Hide the Amazon Xray elements when playing Prime video.
// @description:de Versteckt Amazon Xray Element bei Prime Video während der Pause.
// @include https://*.amazon.tld/*
// @license MIT
// @version 0.31
// @downloadURL https://update.greasyfork.org/scripts/499890/Block%20Amazon%20Xray.user.js
// @updateURL https://update.greasyfork.org/scripts/499890/Block%20Amazon%20Xray.meta.js
// ==/UserScript==

let hideXrayQuickViewExecuted = false;

function hideXrayQuickView() {
    if (!hideXrayQuickViewExecuted) {
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        document.head.appendChild(styleElement);

        const styleSheet = styleElement.sheet;
        const rule = ".xrayQuickView { visibility: hidden !important; }";

        styleSheet.insertRule(rule, styleSheet.cssRules.length);

        hideXrayQuickViewExecuted = true;
    }
}

function observeDOM() {
    const targetNode = document.body;

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                const xrayQuickViewEl = document.querySelector(".xrayQuickView");
                if (xrayQuickViewEl) {
                    hideXrayQuickView();
                    observer.disconnect();
                }
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", afterLoaded);
} else {
    afterLoaded();
}

function afterLoaded() {
    observeDOM();
}