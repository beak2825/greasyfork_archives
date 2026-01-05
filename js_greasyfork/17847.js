// ==UserScript==
// @name            Youtube: VLC Link
// @namespace       http://xshade.ca
// @version         2
// @description     try to take over the world!
// @icon            https://youtube.com/favicon.ico
// @author          Chris H (Zren / Shade)
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @downloadURL https://update.greasyfork.org/scripts/17847/Youtube%3A%20VLC%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/17847/Youtube%3A%20VLC%20Link.meta.js
// ==/UserScript==


(function (window) {
    var isWatchUrl = function (url) {
        if (!url)
            url = document.location.href;
        return url.match(/https?:\/\/(www\.)?youtube.com\/watch\?/);
    }
    
    var YoutubeScript = function(name) {
        this.name = name;
        this.pubsubListeners = {};
        this.pubsubListeners['init-watch'] = this.checkIfWatchPage.bind(this);
        this.pubsubListeners['appbar-guide-delay-load'] = this.checkIfWatchPage.bind(this);
        
    }
    YoutubeScript.prototype.registerYoutubePubSubListeners = function() {
        for (var eventName in this.pubsubListeners) {
            var eventListener = this.pubsubListeners[eventName];
            window.yt.pubsub.instance_.subscribe(eventName, eventListener);
        }
    }
    YoutubeScript.prototype.checkIfWatchPage = function() {
        console.log('checkIfWatchPage');
        if (isWatchUrl())
            this.onWatchPage();
    }
    YoutubeScript.prototype.onWatchPage = function() {}

    var ytScript = new YoutubeScript('yt-vlc');
    ytScript.onWatchPage = function() {
        console.log('watchPage');
    }
    ytScript.pubsubListeners['player-resize'] = (function() {
        console.log('player-resize', document.location.search);
        document.location.assign('vlc-' + document.location.href);
        var pauseButton = document.querySelector('.ytp-play-button[aria-label="Pause"]');
        if (pauseButton)
            pauseButton.click();
    }).bind(ytScript);
    
    ytScript.main = function() {
        try {
            this.registerYoutubePubSubListeners();
        } catch(e) {
            console.error("Could not hook yt.pubsub", e);
            setTimeout(ytScript.main, 1000);
        }
        this.checkIfWatchPage();
    };
    ytScript.main();
    
    //yt.pubsub.instance_.publish = function() {console.log.apply(console, arguments); pub.apply(this, arguments); }
    
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);