// ==UserScript==
// @name         location pixiv 403 image to pixiv original permalink.
// @namespace    http://hisaruki.ml/p
// @version      1
// @description  i.pximg.netの画像を直接開いて403になった時に自動でartworksの元ページへと遷移する
// @author       hisaruki
// @match        https://i.pximg.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435549/location%20pixiv%20403%20image%20to%20pixiv%20original%20permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/435549/location%20pixiv%20403%20image%20to%20pixiv%20original%20permalink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.title == "403 Forbidden"){
        let u = new URL(document.URL);
        let path = u.pathname.split("/");
        let pid = path[path.length-1].match(/[0-9]*/)[0];
        location.href = "https://pixiv.net/artworks/" + pid;
        //location.href = document.URL;
    }
})();