// ==UserScript==
// @name         short2video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  che scifo gli short
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471787/short2video.user.js
// @updateURL https://update.greasyfork.org/scripts/471787/short2video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href
    const urlRegex = /https?:\/\/www\.youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/gm
    const res = urlRegex.exec(url)

    if (res) {
       const id = res[1]
       window.location.href = `https://www.youtube.com/watch?v=${id}`
    }
})();