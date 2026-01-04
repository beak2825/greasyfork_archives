// ==UserScript==
// @name         Douban FM multimedia keys fix
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  fix (play/pause, next track) keys on 豆瓣FM
// @author       VinC
// @match        https://fm.douban.com/*
// @match        http://fm.douban.com/*
// @match        https://fm.douban.com
// @match        http://fm.douban.com
// @match        https://douban.fm/*
// @match        http://douban.fm/*
// @match        https://douban.fm
// @match        http://douban.fm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383209/Douban%20FM%20multimedia%20keys%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/383209/Douban%20FM%20multimedia%20keys%20fix.meta.js
// ==/UserScript==

function mimicKeyup(keycode){
    window.tagName = "";
    var evt = new KeyboardEvent('keyup', {'keyCode':keycode});
    window.dispatchEvent (evt);
}

(function() {
    'use strict';

    // mimic "space" press
    navigator.mediaSession.setActionHandler('play', function() {
        mimicKeyup(32);
    });
    // mimic "space" press
    navigator.mediaSession.setActionHandler('pause', function() {
        mimicKeyup(32);
    });
    // mimic "l" key
    navigator.mediaSession.setActionHandler('nexttrack', function() {
        mimicKeyup(76);
    });

})();