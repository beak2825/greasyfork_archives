// ==UserScript==
// @name         [DEV] Koolside V2
// @namespace    https://github.com/sokcuri
// @version      0.2
// @description  Koolside Developer Version
// @author       sokcuri
// @match        https://*.dcinside.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418767/%5BDEV%5D%20Koolside%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/418767/%5BDEV%5D%20Koolside%20V2.meta.js
// ==/UserScript==

(function() {
    if (window.top !== window.self) return;
    import('https://koolside.neko.kr/js/app.js?' + Date.now());
})();