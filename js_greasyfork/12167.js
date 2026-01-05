// ==UserScript==
// @name        Picarto.tv Video.js replacer
// @namespace   picarto.tv.video.js.stuff.dasprids.de
// @description Replaces the player on picarto.tv with one which works with Firefox on Linux
// @include     https://picarto.tv/*
// @version     3
// @grant       none
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/video.js/4.12.15/video.js
// @downloadURL https://update.greasyfork.org/scripts/12167/Picartotv%20Videojs%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/12167/Picartotv%20Videojs%20replacer.meta.js
// ==/UserScript==

var changed = false;

window.addEventListener('beforescriptexecute', function(e){
	src = e.target.src;

	if (src.search(/jwplayer\.js/) != -1) {
    changed = true;
		e.preventDefault();
		e.stopPropagation();
		mockJwPlayer();
	};

  if (changed) {
    window.removeEventListener(e.type, arguments.callee, true);
  }
}, true);

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode)
  elementStyle.innerHTML = style;
  return elementStyle;
}

addStyleSheet('@import "https://vjs.zencdn.net/4.12/video-js.css";'); 

function mockJwPlayer()
{
  videojs.options.techOrder = ['flash'];
  
  unsafeWindow.jwplayer = function(id){
    var container = $('#' + id);
    
    var player = {};
    
    if (container.data('player')) {
      player = container.data('player');
    } else {
      container.data('player', player);
    }
    
    player.setMute = function(){
      return player;
    };

    player.setup = function(options){
      if (!player.videojs) {
        container.html('<video id="videojs' + id + '" class="video-js vjs-default-skin" controls preload="none" data-setup="{}"><source src="' + options.file + '" type="rtmp/mp4"></video>');
        player.videojs = videojs('videojs' + id);
      }
      
      if (options.width) {
        player.videojs.width(options.width);
      }
      
      if (options.height) {
        player.videojs.height(options.height);
      }
      
      if (options.mute) {
        player.videojs.muted(true);
      } else {
        player.videojs.muted(false);
      }
      
      if (options.autostart) {
        player.videojs.play();
      }
      
      if (options.aspectratio) {
        var ratioParts  = options.aspectratio.split(':');
        var aspectRatio = ratioParts[1] / ratioParts[0];

        function resizeVideoJs(){
          var width = document.getElementById(player.videojs.id()).parentElement.offsetWidth;
          player.videojs.height(width * aspectRatio);
        }

        resizeVideoJs();
        window.addEventListener('resize', resizeVideoJs);
      }

      return player;
    };
    
    player.onPause = function(callback){
      this.videojs.on('pause', callback);
      return player;
    };
    
    player.onError = function(callback){
      this.videojs.on('error', callback);
      return player;
    };
    
    player.onComplete = function(callback){
      this.videojs.on('ended', callback);
      return player;
    };

    player.onBuffer = function(callback){
      this.videojs.on('waiting', callback);
      return player;
    };
    
    player.onPlay = function(callback){
      this.videojs.on('play', callback);
      return player;
    };
    
    player.onDisplayClick = function(callback){
      // No equivalent
      return player;
    };
    
    player.getMute = function(){
      return this.videojs.muted();
    };
    
    return player;
  };
}
