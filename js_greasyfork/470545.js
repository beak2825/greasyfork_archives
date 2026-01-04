// ==UserScript==
// @name         5CH STYLE THUMBNAILER
// @namespace    http://tampermonkey.net/
// @version      2
// @description  5CH STYLE FORMATというchrome用拡張機能の画像をポップアップ表示する機能を小さめのサムネイル表示へと書き換えるスクリプトです。
// @author       SenY
// @match        https://*.5ch.net/test/read.cgi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5ch.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470545/5CH%20STYLE%20THUMBNAILER.user.js
// @updateURL https://update.greasyfork.org/scripts/470545/5CH%20STYLE%20THUMBNAILER.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let s = document.createElement("style");
    s.innerHTML = 'a.popImage > img { \
    max-width: 25%; \
} \
a.popImage { \
    font-size: 0; \
}';
    document.head.appendChild(s);
    setInterval(function(){
        document.querySelectorAll("article a.popImage > img").forEach(img => {
            img.classList.remove("image");
        });
    }, 500);
    // Your code here...
})();