// ==UserScript==
// @name         youtube playlist style changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change 30/08/17 playlist style to older version (dark)
// @author       bitrate16
// @match        http://www.youtube.com/watch?*
// @match        https://www.youtube.com/watch?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32754/youtube%20playlist%20style%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/32754/youtube%20playlist%20style%20changer.meta.js
// ==/UserScript==

function waitForElementToDisplay(selector, time, handler) {
    if (document.querySelector(selector) != null) {
        handler();
        return;
    } else {
        setTimeout(function () {
            waitForElementToDisplay(selector, time, handler);
        }, time);
    }
}


(function() {
    'use strict';
    waitForElementToDisplay("ytd-playlist-panel-video-renderer", 200, function() {

        var list = document.getElementsByClassName('ytd-playlist-panel-renderer');

        for(var i = 0; i < list.length; i++)
            if(list[i].hasAttribute('selected'))
                list[i].style.background = '#DDD';
    });
})();