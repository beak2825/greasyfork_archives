// ==UserScript==
// @name         YouTube 隱藏進度條(滑鼠移入才會顯示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTube 隱藏進度條
// @author       You
// @license MIT
// @match        https://www.youtube.com/*
// @match        https://v.anime1.me/watch*
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/437994/YouTube%20%E9%9A%B1%E8%97%8F%E9%80%B2%E5%BA%A6%E6%A2%9D%28%E6%BB%91%E9%BC%A0%E7%A7%BB%E5%85%A5%E6%89%8D%E6%9C%83%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437994/YouTube%20%E9%9A%B1%E8%97%8F%E9%80%B2%E5%BA%A6%E6%A2%9D%28%E6%BB%91%E9%BC%A0%E7%A7%BB%E5%85%A5%E6%89%8D%E6%9C%83%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var css = '';


    if (location.href.indexOf('https://www.youtube.com/') === 0) {
        css = `
        .ytp-chrome-bottom {
            opacity: 0;
        }
        .ytp-chrome-bottom:hover {
            opacity: 1;
        }
        `
    }

    if (location.href.indexOf('https://v.anime1.me/watch') === 0) {
        css = `
        .jw-controlbar {
            opacity: 0;
        }
        .jw-controlbar:hover {
            opacity: 1;
        }
        `
    }



    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {

        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("html");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }

    }



})();