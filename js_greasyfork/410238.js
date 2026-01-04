// ==UserScript==
// @name         Vortex Personal Video Bookmarks
// @version      0.1
// @namespace    XcomeX
// @author       XcomeX
// @license      Copyleft (Ɔ) GPLv3
// @description  ...
// @match        https://*.vortex.cz/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410238/Vortex%20Personal%20Video%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/410238/Vortex%20Personal%20Video%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof YT === 'undefined') {
        console.log("No YT API");
        // Inject YouTube API script
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console.log(typeof YT)
    }

    if(window.attachEvent) {
        window.attachEvent('onload', afretPageLoadedFnc);
    } else {
        if(window.onload) {
            var curronload = window.onload;
            var newonload = function(evt) {
                curronload(evt);
                afretPageLoadedFnc(evt);
            };
            window.onload = newonload;
        } else {
            window.onload = afretPageLoadedFnc;
        }
    }

    function afretPageLoadedFnc() {
        // get all youtube IFrames
        console.log("aa");
        var ytplayers;
        try {
            ytplayers.length;
        } catch (e) {
            ytplayers = [];
        }
        function create_ytplayer(videoId) {
            var player_index = ytplayers.length;
            var player_id = "youtube-player-"+(player_index+1);
            ytplayers[player_index] = new YT.Player(
                player_id,
                {
                    videoId: videoId
                }
            );
            return ytplayers[player_index];
        }

        var IFramesEls = [];
        var ytIFrameEls = document.getElementsByTagName('iframe');
        console.log(ytIFrameEls);
        for(var i = 0; i < ytIFrameEls.length; i++) {
            var player;
            var ytIFrameEl = ytIFrameEls[i];
            if(ytIFrameEl.id) {
              player = new YT.get(ytIFrameEl.id);
              ytplayers.push(player);
            } else {
                var video_id_regex_pattern = /(?:youtube.*\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
                var video_id = ytIFrameEl.src.match(video_id_regex_pattern)[1];
                if(video_id) {
                    var newPlayerHoleder = document.createElement('div');
                    newPlayerHoleder.id = "youtube-player-"+(ytplayers.length+1);
                    ytIFrameEl.parentNode.appendChild(newPlayerHoleder);
                    ytIFrameEl.remove();
                    player = create_ytplayer(video_id);
                }
            }
            addControlPanelToPlayer(player);
        }
    };


    function addControlPanelToPlayer(xplayer) {
        // video control panel
        var controlPanelEl = document.createElement('div');
        controlPanelEl.id = "bookmark-video-control-panel";
        controlPanelEl.style = "opacity:0.2;z-index:1000;position: relative;float:right;";
        controlPanelEl.onmouseover = function(){ this.style.opacity=1; }
        controlPanelEl.onmouseout = function(){ this.style.opacity=0.2; }

        // bookmark current video position
        var bmBtn = document.createElement('input');
        bmBtn.type = "button";
        bmBtn.className = "btn";
        bmBtn.value = "bookmark";
        bmBtn.style= "float:left;";
        bmBtn.addEventListener("click", function() {
            console.log( "Bookmark video at time: "+xplayer.getCurrentTime() );
        });

        // insert control panel
        controlPanelEl.appendChild(bmBtn);
        var playerIFrameEl = xplayer.getIframe();
        console.log(playerIFrameEl)
        playerIFrameEl.parentNode.insertBefore(controlPanelEl, playerIFrameEl.nextSibling);
    }

})();