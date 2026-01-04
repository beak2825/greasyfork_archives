// ==UserScript==
// @name                Instagram 降低影片音量
// @version             1.0.0
// @description         降低影片音量
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @match               https://www.instagram.com/*
// @icon                https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/461683/Instagram%20%E9%99%8D%E4%BD%8E%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/461683/Instagram%20%E9%99%8D%E4%BD%8E%E5%BD%B1%E7%89%87%E9%9F%B3%E9%87%8F.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict'

    const VOLUME = 0.1

    function main() {
        for(let i = 0; i < 10; i++) {
            setTimeout(lowVolume, 500 * i)
        }
    }

    function lowVolume() {
        document.querySelectorAll("video").forEach(video => {
            if (video.className.includes("lowVolume")) return
            video.classList.add("lowVolume")
            video.volume = VOLUME
        })
    }

    window.addEventListener("scroll", lowVolume)

    main()

})();
