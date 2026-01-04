// ==UserScript==
// @name         Auto-fullscreen image/video (Rule34.world, Rule34.xyz)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.1
// @description  title explains some stuf
// @author       You
// @match        https://rule34.world/*
// @match        https://rule34.xyz/*
// @match        https://rule34storage.b-cdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479712/Auto-fullscreen%20imagevideo%20%28Rule34world%2C%20Rule34xyz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479712/Auto-fullscreen%20imagevideo%20%28Rule34world%2C%20Rule34xyz%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var pageLoaded = setInterval(function () {
        if (document.readyState == "complete") {
            let loc = window.location.href
            if (loc.includes("/post/")) {
                let obj = document.querySelectorAll('img[_ngcontent-serverapp-c129]')[0]
                if (!obj) {
                    obj = document.querySelectorAll('source[_ngcontent-serverapp-c129]')[0]
                }
                let url = obj.src
 
                if (url.includes("rule34storage.b-cdn.net")) {
                    window.location.href = url
                } else {
                    window.location.href = url.replace(".picsmall.", ".pic.")
                }
            } else if (loc.includes("/posts/") && loc.includes("mp4")) {
                let vid = document.querySelectorAll('video')[0]
                vid.style = "width: 100%;height: 100vh;position: fixed"
                vid.loop = true
                vid.preload = true
            }
            clearInterval(pageLoaded)
        }
    }, 100);
})();