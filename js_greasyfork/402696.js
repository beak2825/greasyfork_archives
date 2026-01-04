// ==UserScript==
// @name         tokyomotion音量調整
// @namespace    https://greasyfork.org/morca
// @version      0.2
// @description  音量保持と自動再生
// @author       morca
// @match        https://www.tokyomotion.net/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402696/tokyomotion%E9%9F%B3%E9%87%8F%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/402696/tokyomotion%E9%9F%B3%E9%87%8F%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getCookie(name, dfl) {
        name += "=";
        var found = document.cookie.split("; ").find(c => c.indexOf(name) === 0);
        if (found) return decodeURIComponent(found.substr(name.length));
        return dfl;
    }
    function setCookie(name, value) {
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=5184000";
    }
    videojs('#vjsplayer', {}, function() {
        var volume = getCookie("volume", null);
        var muted = getCookie("muted", null);
        if (muted !== null) muted = muted == "true";
        if (volume !== null && volume >= 0 && volume <= 1 && volume != this.volume()) {
            this.volume(volume);
        }
        if (muted !== null && muted != this.muted()) {
            this.muted(muted);
        }
        this.on("volumechange", function() {
            var volume = getCookie("volume", null);
            var muted = getCookie("muted", null);
            if (muted !== null) muted = muted == "true";
            if (volume === null || volume != this.volume()) {
                setCookie("volume", this.volume());
            }
            if (muted === null || muted !== this.muted()) {
                setCookie("muted", this.muted());
            }
        });
    });
    aclose();
})();