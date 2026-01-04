// ==UserScript==
// @name         Enable Ad Markers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring back ad markers on YouTube videos.
// @author       BowDown097
// @match        *://*.youtube.com/*
// @match        *://*.youtu.be/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/441964/Enable%20Ad%20Markers.user.js
// @updateURL https://update.greasyfork.org/scripts/441964/Enable%20Ad%20Markers.meta.js
// ==/UserScript==

// Big thanks to https://greasyfork.org/en/scripts/32626-disable-youtube-video-ads for the youtubei player patching logic

((window, fn) => {
    var ytiPlayer;
    JSON.parseOG = JSON.parse;
    JSON.parse = function(obj) {
        if (ytiPlayer) {
            obj = ytiPlayer;
            if (obj.forEach) {
                obj.forEach((p, a) => {
                    if (p.player?.args?.player_response) {
                        a = p.player_response_;
                        patchPlayerResponse(a);
                        p.player_response = JSON.stringify(a);
                    } else if (p.playerResponse) {
                        patchPlayerResponse(p.playerResponse);
                    }
                });
            } else patchPlayerResponse(obj);
            ytiPlayer = null;
        } else {
            obj = JSON.parseOG(obj);
            if (obj.playerResponse) patchPlayerResponse(obj.playerResponse);
        }
        return obj;
    };

    var rt = Response.prototype.text;
    Response.prototype.text = function() {
        const rtThis = this, text = rt.apply(this, arguments), thenOG = text.then;
        text.then = function(fn) {
            var fnOG = fn;
            fn = function(t) {
                if (/\/v1\/player\?/.test(rtThis.url)) ytiPlayer = JSON.parseOG(t);
                if (typeof fnOG === "function") return fnOG.apply(this, arguments);
            };
            return thenOG.apply(this, arguments);
        };
        return text;
    };

    function patchPlayerResponse(playerResponse) {
        playerResponse.adPlacements?.forEach(p => {
            p.adPlacementRenderer.config.adPlacementConfig.hideCueRangeMarker = false;
        });
    }
})();
