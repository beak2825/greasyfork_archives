// ==UserScript==
// @name         YouTube 1080p
// @namespace    http://www.youtube.com/
// @version      1.4.4
// @description  change default YouTube video quality to 1080p or highest available below 1080p. can be used for other video qualities by changing preferred Quality in the code below.
// @match        http://youtube.com/*
// @match        https://youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32507/YouTube%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/32507/YouTube%201080p.meta.js
// ==/UserScript==


youtubeOverride = function (unsafeWindow) {
    
    // qualities = ['auto', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
    // set the quality desired here:
    preferredQuality = 'hd1080';
    // overrideMaxAttempts = 30;
    overrideTryDelay = 1000;
    
    console.log('override script starting');
    if (location.pathname.indexOf("/embed/") === 0) {
        var player = unsafeWindow.yt.player.getPlayerByElement(unsafeWindow.document.getElementById("player"));
        if (player != null) {
            overridePlayer(player);
        } else {
            console.log('cannot get player api');
        }
    } else {
        tryToOverride();
        
        var target = document.getElementById('player');
        var MutationObserver = window.MutationObserver;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target.id === 'player-unavailable')  {
                    console.log('player mutation detected');
                    var player = unsafeWindow.document.getElementById('movie_player');
                    if (player != null) {
                        overridePlayer(player);
                    } else {
                        console.log('cannot get player api2');
                    }
                }
            });
        });
        observer.observe(target, { childList: true, subtree: true });
    }
    
    function getPlayerApi() {
        if (location.pathname.indexOf("/embed/") === 0) {
            var player = unsafeWindow.yt.player.getPlayerByElement(unsafeWindow.document.getElementById("player"));
            return player;
        } else {
        	return unsafeWindow.document.getElementById('movie_player');
        }
    }
        
    function tryToOverride(player) {
        console.log('quality override starting');

        player = player != null ? player : getPlayerApi();

        if (player == null || !('setPlaybackQuality' in player)) {
            console.log('error: setPlaybackQuality not available');
            return false;
        }

        var qualityLevels = player.getAvailableQualityLevels();
        var qualityToSet = null;
        for (var i = 0; i < qualityLevels.length; i++) {
            if (qualityLevels[i].trim().toLowerCase() === preferredQuality) {
                qualityToSet = qualityLevels[i];
                break;
            }
        }
        if (qualityToSet == null) {
            qualityToSet = qualityLevels[0];
        }
        if (qualityToSet == null) {
            console.log('error: no quality levels available');
            return false;
        }
        player.setPlaybackQuality(qualityToSet);
        console.log('set quality to ' + qualityToSet);
        return qualityToSet == player.getPlaybackQuality();
    }
    
    function overridePlayer(player) {
        if (overridePlayer.running) {
            return;
        }
        overridePlayer.running = true;
        
        overrideTimeoutFunc.attempts = 0;
        overrideTimeoutFunc();
        
        function overrideTimeoutFunc() {
            overrideTimeoutFunc.attempts++;
            var success = tryToOverride(player);
            if (!success /*&& overrideTimeoutFunc.attempts < overrideMaxAttempts*/) {
                setTimeout(overrideTimeoutFunc, overrideTryDelay)
            } else {
                overridePlayer.running = false;
            }
        }
    }
};

(function () {
    // inject script into page
    if (this.unsafeWindow != null) {
        youtubeOverride(unsafeWindow);
    } else {
        var scriptElem = document.createElement('script');
        scriptElem.setAttribute('type', 'text/javascript');
        scriptElem.text = '(' + youtubeOverride.toString() + ')(window);';
        
        document.documentElement.appendChild(scriptElem);
        document.documentElement.removeChild(scriptElem);
    }
})();
