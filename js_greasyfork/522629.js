// ==UserScript==
// @name         Safety first :thumbs_up:
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Protects u from loggers
// @author       Blisma
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @icon         https://media.discordapp.net/attachments/1143878199256825866/1324438159513227274/protection-cyber-security-network-safety-260nw-2489345097.png?ex=677826a8&is=6776d528&hm=07e6e4135885b8d1f146cf49c149b393bb72141f944312838ad01814ea69a798&=&format=webp&quality=lossless
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522629/Safety%20first%20%3Athumbs_up%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/522629/Safety%20first%20%3Athumbs_up%3A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const websites = ['sandbox.moomoo.io', 'moomoo.io'];

    const fetchOriginal = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === 'string' && input.includes('webhook')) {
            return Promise.reject();
        }
        return fetchOriginal.apply(this, arguments);
    };

    const xhrOriginal = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.includes('webhook')) {
            return;
        }
        return xhrOriginal.apply(this, arguments);
    };

    Object.defineProperty(window, 'location', {
        set(value) {
            if (!websites.some(site => value.includes(site))) {
                return;
            }
            window.location.href = value;
        },
        get() {
            return window.location.href;
        }
    });

    const observer = new MutationObserver(() => {
        document.querySelectorAll('script').forEach(script => {
            if (script.src && ['track', 'analytics', 'pixel'].some(word => script.src.includes(word))) {
                script.remove();
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
