// ==UserScript==
// @name         crazily play
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       shifan
// @match        http://mooc1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400627/crazily%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/400627/crazily%20play.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function () {
        var iframe1 = document.getElementsByTagName('iframe')[0]
        var iframe2 = iframe1.contentDocument.getElementsByTagName('iframe')[0]
        var video = iframe2.contentDocument.getElementsByTagName('video')[0]
        video.play()
        video.playbackRate = 16
    }, 100)
})();