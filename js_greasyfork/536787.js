// ==UserScript==
// @name         Ad Skipper for Spotify Web Player
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Automatically skip ads on Spotify.
// @author       Tomoyuki Kawao
// @match        https://open.spotify.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536787/Ad%20Skipper%20for%20Spotify%20Web%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/536787/Ad%20Skipper%20for%20Spotify%20Web%20Player.meta.js
// ==/UserScript==

document.createElement = function(originalCreateElement) {
    return function() {
        var element = originalCreateElement.apply(this, arguments);
        if (element instanceof HTMLMediaElement) {
            element.addEventListener("play", (event) => {
                if (!event.currentTarget.src.startsWith("blob:https://open.spotify.com/") && event.currentTarget.duration < 40.0) {
                    let target = event.currentTarget;
                    setTimeout(() => {
                        target.currentTime = target.duration;
                    }, 1);
                }
            });
        }
        return element;
    };
}(document.createElement);
