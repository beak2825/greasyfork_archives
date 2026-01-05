// ==UserScript==
// @name            Youtube: Add to Playlist Icons
// @namespace       http://xshade.ca
// @version         6
// @description     Adds icons to the video toolbar which adds to specific playlists with 1 click.
// @icon            https://youtube.com/favicon.ico
// @author          Chris H (Zren / Shade)
// @include         http*://*.youtube.com/*
// @include         http*://youtube.com/*
// @include         http*://*.youtu.be/*
// @include         http*://youtu.be/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21703/Youtube%3A%20Add%20to%20Playlist%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/21703/Youtube%3A%20Add%20to%20Playlist%20Icons.meta.js
// ==/UserScript==


(function (window) {
    //--- Settings
    // name is case sensitive
    var addToPlaylistButtons = [
        { name: "Saved", label: "♥" },
        { name: "Music", label: "♫" },
        { name: "Watch Later", label: "⏱" },
    ];

    //---
    var el = function(html) {
        var e = document.createElement('div');
        e.innerHTML = html;
        return e.removeChild(e.firstChild);
    }

    var isWatchUrl = function(url) {
        if (!url)
            url = document.location.href;
        return url.match(/https?:\/\/(www\.)?youtube.com\/watch\?/)
            || url.match(/https?:\/\/(www\.)?youtube.com\/(c|channel)\/[^\/]+\/live/);
    }

    function waitFor(selector, callback) {
        var tick = function(){
            var e = document.querySelector(selector);
            if (e) {
                callback(e);
            } else {
                setTimeout(tick, 100);
            }
        };
        tick();
    }
    window.waitFor = waitFor

    //--- History
    var HistoryEvent = function() {}
    HistoryEvent.listeners = []

    HistoryEvent.dispatch = function(state, title, url) {
      var stack = this.listeners
      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, state, title, url)
      }
    }
    HistoryEvent.onPushState = function(state, title, url) {
        HistoryEvent.dispatch(state, title, url)
        return HistoryEvent.origPushState.apply(window.history, arguments)
    }
    HistoryEvent.onReplaceState = function(state, title, url) {
        HistoryEvent.dispatch(state, title, url)
        return HistoryEvent.origReplaceState.apply(window.history, arguments)
    }
    HistoryEvent.inject = function() {
        if (!HistoryEvent.injected) {
            HistoryEvent.origPushState = window.history.pushState
            HistoryEvent.origReplaceState = window.history.replaceState

            window.history.pushState = HistoryEvent.onPushState
            window.history.replaceState = HistoryEvent.onReplaceState
            HistoryEvent.injected = true
        }
    }

    HistoryEvent.timerId = 0
    HistoryEvent.onTick = function() {
        var currentPage = window.location.pathname + window.location.search
        if (HistoryEvent.lastPage != currentPage) {
            HistoryEvent.dispatch({}, document.title, window.location.href)
            HistoryEvent.lastPage = currentPage
        }
    }
    HistoryEvent.startTimer = function() {
        HistoryEvent.lastPage = window.location.pathname + window.location.search
        HistoryEvent.timerId = setInterval(HistoryEvent.onTick, 500)
    }
    HistoryEvent.stopTimer = function() {
        clearInterval(HistoryEvent.timerId)
    }


    //---
    var YoutubeScript = function(name) {
        this.name = name;
    }
    YoutubeScript.prototype.registerMaterialListeners = function() {
        this._materialPageTransition = this.materialPageTransition.bind(this)
        HistoryEvent.listeners.push(this._materialPageTransition);
        HistoryEvent.startTimer();
    }
    YoutubeScript.prototype.materialPageTransition = function() {
        console.log('checkIfWatchPage');
        if (isWatchUrl())
            this.onWatchPage();
    }
    YoutubeScript.prototype.checkIfWatchPage = function() {
        console.log('checkIfWatchPage');
        if (isWatchUrl())
            this.onWatchPage();
    }
    YoutubeScript.prototype.onWatchPage = function() {}


    //---
    var ytScript = new YoutubeScript('ytplaylisticons');
    ytScript.onWatchPage = function() {
        this.injectUI();
    }

    ytScript.injectUI = function() {
        console.log('[playlisticons] injectUI')
        var resizeButton = document.querySelector('.ytp-size-button.ytp-button');
        console.log('[playlisticons] resizeButton', resizeButton)

        waitFor('.ytp-size-button.ytp-button', function(resizeButton){
            console.log('[playlisticons] waitFor')
            console.log('[playlisticons] waitFor.resizeButton', resizeButton)
            if (resizeButton) {
                for (var i = 0; i < addToPlaylistButtons.length; i++) {
                    var playlistData = addToPlaylistButtons[i];
                    var button = document.querySelector('.yt-playlist-enqueue-button[data-playlist-name="' + playlistData.name + '"].ytp-button');
                    if (!button) {
                        button = el('<button class="yt-playlist-enqueue-button ytp-button" data-playlist-name="' + playlistData.name + '" title="Add to ' + playlistData.name + ' Playlist" style="vertical-align: top; text-align: center;">');
                        button.appendChild(el('<span style="font-size: 24px; font-weight: bold;">' + playlistData.label + '</span>'));
                        button.addEventListener('click', ytScript.addToPlaylist(playlistData.name));
                        resizeButton.parentNode.insertBefore(button, resizeButton);
                        //console.log('addToPlaylistButton', playlistData, button);
                    }
                }
            }
        });

        
    }

    ytScript.showPopupTimer = 0
    ytScript.hidePopup = function() {
        clearTimeout(ytScript.showPopupTimer)
        document.body.classList.add('hide-add-to-playlist-popup')
    }
    ytScript.unhidePopup = function() {
        clearTimeout(ytScript.showPopupTimer)
        ytScript.showPopupTimer = setTimeout(function(){
            document.body.classList.remove('hide-add-to-playlist-popup')
        }, 500)
    }

    ytScript.addToPlaylist = function(playlistName) {
        return function() {
            ytScript.hidePopup();

            // button yt-icon svg g path
            var iconPath = document.querySelector('path.yt-icon[d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"]');
            var button = iconPath.closest('button');
            button.click();

            // ytd-playlist-add-to-option-renderer
            //   paper-checkbox
            //     #checkboxLabel
            //       #checkbox-container
            //         #checkbox-label
            //           yt-formatted-string#label
            //             "Watch Later"
            waitFor('ytd-playlist-add-to-option-renderer', function(e) {
                for (var e2 of document.querySelectorAll('ytd-playlist-add-to-option-renderer')) {
                    var label = e2.querySelector('#checkbox-label yt-formatted-string')
                    console.log(label.textContent, label, e2)
                    if (label.textContent == playlistName) {
                        e2.querySelector('paper-checkbox').click();
                        document.querySelector('#player').click(); // dismiss popup and focus on player
                        ytScript.unhidePopup();
                        break;
                    }
                }
            });
        };
    }

    ytScript.main = function() {
        this.registerMaterialListeners();
        this.checkIfWatchPage();
    };
    ytScript.main();

    var style = ".ytwp-viewing-video #appbar-main-guide-notification-container { top: -110px; left: calc(100vw - 30px - 200px - 30px); width: 200px; text-align: right; }";
    style += '.hide-add-to-playlist-popup ytd-add-to-playlist-renderer { display: none; }';
    style += '.yt-playlist-enqueue-button:active { transform: scale(1.25); }';
    GM_addStyle(style);

})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
