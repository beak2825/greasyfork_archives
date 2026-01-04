// ==UserScript==
// @name         Twitter and Tweetdeck #OldTwitter Avatar
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Bring the old square Avatar back to Twitter and TweetDeck!
// @author       @leonelsr
// @match        https://tweetdeck.twitter.com/
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36030/Twitter%20and%20Tweetdeck%20OldTwitter%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/36030/Twitter%20and%20Tweetdeck%20OldTwitter%20Avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NSE = document.createElement('style');
    document.head.append(NSE);
    NSE.sheet.insertRule('.avatar, .ProfileAvatar, .ProfileAvatar-image { border-radius: 5% !important; }', 0);

    var bd = document.querySelector('.edge-design');
    if (bd) {
        bd.classList.remove('edge-design');
    }

    //window.NSE = NSE;
    var btn = document.createElement('button');
    btn.innerHTML = '◙';//
    btn.style = 'position: fixed; top: 30px; right: 10px; border: 1px solid #000; opacity: .05';
    document.body.append(btn);
    btn.onclick = function () { NSE.disabled = !NSE.disabled };
    btn.onmouseenter = function () { this.style.opacity = 1 };
    btn.onmouseleave = function () { this.style.opacity = 0.05 };

})();