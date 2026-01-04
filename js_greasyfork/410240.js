// ==UserScript==
// @name        Youtube Default SpeedUp Playback Rate iFrame
// @version     0.6
// @namespace   XcomeX
// @author      XcomeX
// @license     Copyleft (Ɔ) GPLv3
// @description Set default playback rate for IFrame embedded Youtube video to 2x.
// @source      https://webapps.stackexchange.com/a/136744
// @match       *://*indian-tv.cz/*
// @match       *://*nerdfix.cz/*
// @match       *://*vortex.cz/*
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/410240/Youtube%20Default%20SpeedUp%20Playback%20Rate%20iFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/410240/Youtube%20Default%20SpeedUp%20Playback%20Rate%20iFrame.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    var defaultPlaybackSpeed = 2.0;
  
  
    if (typeof YT === 'undefined') {
        // Inject YouTube API script
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

  
    if(window.attachEvent) {
        window.attachEvent('onload', afretPageLoadedFnc);
    } else {
        if(window.onload) {
            var curronload = window.onload;
            var newonload = function(evt) {
                curronload(evt);
                afretPageLoadedFnc();
            };
            window.onload = newonload;
        } else {
            window.onload = afretPageLoadedFnc;
        }
    }
  
  afretPageLoadedFnc();
    function afretPageLoadedFnc(createClickListener=true) {
      var ytIFrameEls = document.getElementsByTagName('iframe');
      if (ytIFrameEls.length > 0 && ytIFrameEls.length > ytplayersCreated) {
        createCustomeYTPlayers(ytIFrameEls);
      }
      else if (createClickListener) {
        window.addEventListener('click', function waitOnVideoClick(event) {
          afretPageLoadedFnc(false);
        });
      }
    }
  
    
  
  /***********************************************************/    
    var ytplayersCreated  = 0;    
    var ytplayers  = [];  
    
    function createCustomeYTPlayers(ytIFrameEls) {
      for(var i = 0; i < ytIFrameEls.length; i++) {
        var player;
          var ytIFrameEl = ytIFrameEls[i];
          if(ytIFrameEl.id) {
            player = new YT.get(ytIFrameEl.id);
            player.setPlaybackRate(defaultPlaybackSpeed);
            ytplayers.push(player);
            ytplayersCreated += 1;
          } else {
              var video_id_regex_pattern = /(?:youtube.*\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
              var video_id_regex_match = ytIFrameEl.src.match(video_id_regex_pattern);  

              if (video_id_regex_match) {                
                var video_id = video_id_regex_match[1];
                if(video_id) {
                    var newPlayerHoleder = document.createElement('div');
                    newPlayerHoleder.id = "youtube-player-"+(ytplayers.length+1);
                    ytIFrameEl.parentNode.appendChild(newPlayerHoleder);
                    ytIFrameEl.remove();
                    player = create_ytplayer(ytplayers, video_id);
                }
              }
          }
      }
    }
  
    function create_ytplayer(ytplayers, videoId) {
      var player_index = ytplayers.length;
      var player_id = "youtube-player-"+(player_index+1);
      ytplayers[player_index] = new YT.Player(
          player_id,
          {
              videoId: videoId,
              events: {
                'onReady': function(e){
                  e.target.setPlaybackRate(defaultPlaybackSpeed);
                },
              }
          }
      );
      ytplayersCreated += 1;
      return ytplayers[player_index];
    }


})();