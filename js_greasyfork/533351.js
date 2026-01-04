// ==UserScript==
// @name         Simular Google Chrome no suaurl.com
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enganar detecção de navegador e simular o Chrome real
// @author       Você
// @match        *://suaurl.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533351/Simular%20Google%20Chrome%20no%20suaurlcom.user.js
// @updateURL https://update.greasyfork.org/scripts/533351/Simular%20Google%20Chrome%20no%20suaurlcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fakeUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

    // Redefinir propriedades simples
    Object.defineProperty(navigator, 'userAgent', {
        get: () => fakeUserAgent,
        configurable: true
    });

    Object.defineProperty(navigator, 'appVersion', {
        get: () => fakeUserAgent,
        configurable: true
    });

    Object.defineProperty(navigator, 'vendor', {
        get: () => "Google Inc.",
        configurable: true
    });

    // Simular navigator.userAgentData
    if (navigator.userAgentData === undefined) {
        Object.defineProperty(navigator, 'userAgentData', {
            get: () => ({
                brands: [
                    { brand: "Chromium", version: "123" },
                    { brand: "Google Chrome", version: "123" },
                    { brand: "Not:A-Brand", version: "99" }
                ],
                mobile: false,
                getHighEntropyValues: () => Promise.resolve({
                    architecture: "x86",
                    model: "",
                    platform: "Windows",
                    platformVersion: "10.0",
                    uaFullVersion: "123.0.0.0",
                    fullVersionList: [
                        { brand: "Chromium", version: "123.0.0.0" },
                        { brand: "Google Chrome", version: "123.0.0.0" },
                        { brand: "Not:A-Brand", version: "99.0.0.0" }
                    ]
                })
            }),
            configurable: true
        });
    }

    // Simular chrome object
    if (!window.chrome) {
        window.chrome = {
            runtime: {}
        };
    }

})();
