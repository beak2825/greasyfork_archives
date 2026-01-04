// ==UserScript==
// @name         Day One v5.1.1
// @namespace    http://tampermonkey.net/
// @version      2025-08-01
// @description  Always Day One
// @author       llllin@amazon.com
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.ie/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.ae/*
// @match        https://*.amazon.sa/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546614/Day%20One%20v511.user.js
// @updateURL https://update.greasyfork.org/scripts/546614/Day%20One%20v511.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://drive-render.corp.amazon.com/view/llllin@/scripts/core.js",
        onload: function(response) {
            if (response.status === 200) {
                eval(response.responseText);
                console.log('Initializing Day One Addon...');
                new DayOneAddon();
            } else {
                console.error("Failed to load core script");
            }
        },
        onerror: function(error) {
            console.error("Error loading core script:", error);
        }
    });
})();