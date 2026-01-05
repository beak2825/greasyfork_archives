// ==UserScript==
// @name         OneDrive VideoPlayer fix
// @namespace    http://github.com/segabito/
// @version      0.3.0
// @description  OneDriveの動画プレイヤーのフルスクリーン再生を復活&細かい調整
// @author       segabito
// @match        https://onedrive.live.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10993/OneDrive%20VideoPlayer%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/10993/OneDrive%20VideoPlayer%20fix.meta.js
// ==/UserScript==

(function() {
  var monkey = function() {
    var playerFrame = window, video;
    var ItemVideoPlayerRes;

    // https://onedrive.live.com/handlers/clientstring.mvc?mkt=ja-JP&group=Files&v=19.8.1712.2000&useRequiresJs=False
//    var videoLoadErrorMessage = (function() {
//
//      var XIEO = window.live = window.live || {};
//      var smgP = XIEO.shared = XIEO.shared || {};
//      var idJb = smgP.skydrive = smgP.skydrive || {};
//      var OLSZ = idJb.monaco = idJb.monaco || {};
////    qQjl["loaderror"] = "問題が発生したため、動画を再生できません。";
////    qQjl["loaderrordecode"] = "この動画には問題があります。動画をダウンロードして、ビデオ アプリによる再生を試してください。";
////    qQjl["loaderrornetwork"] = "動画の再生中に問題が発生しました。インターネット接続を確認し、もう一度やり直してください。";
// 
//      var message =
//          qQjl["loaderror"] ||
//          jHBx["loaderror"] ||
//          "問題が発生したため、動画を再生できません。";
//      return message;
//    })();


    var config = (function() {
      var prefix = 'OV_';
      var conf = {
        slideshow: false,
        fitMode: '',
      };
      return {
        get: function(key) {
          try {
            if (window.sessionStorage.hasOwnProperty(prefix + key)) {
              return JSON.parse(window.sessionStorage.getItem(prefix + key));
            }
            return conf[key];
          } catch (e) {
            return conf[key];
          }
        },
        set: function(key, value) {
          window.sessionStorage.setItem(prefix + key, JSON.stringify(value));
        }
      };
    })();

    var __css__ = (function() {/*

        .fit16-9 .od-VideoCanvas-video {
          top: -16.666666% !important;
          height: 133.333333%  !important;
        }

        #ovPanel {
          display: none;
          position: fixed;
          z-index: 10000;
          top:32px;
          right: 0px;
          min-width: 100px;
          {*transition: opacity 0.5s ease;*}
          background-color: #888;
          border: 1px solid #000;
          box-shadow: 4px 4px 0 black;
          opacity: 0;
        }

        .videoPlayer #ovPanel {
          display: block;
        }

        #ovPanel:hover {
          opacity: 1;
        }

        #ovPanel button {
          cursor: pointer;
          opacity: 1;
        }

        .fit16-9 #ovPanel .fitMode {
          color: red;
        }

        .slideshow #ovPanel .slideshow {
          color: red;
        }

        {*
        .c-VideoPlayer.isPlaybackPanelVisible .c-PlaybackPanel {
          opacity: 0;
        }
        .c-VideoPlayer.isPlaybackPanelVisible .c-PlaybackPanel:hover {
          opacity: 1;
        }
        *}

        .fullscreen .OneUp-commandBar, .fullscreen .OneUp-flipper {
          visibility: visible;
        }
        .fullscreen .OneUp-commandBar, .fullscreen .OneUp-flipper:hover {
          opacity: 0.85;
        }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var __panel__ = (function() {/*
      <div id="ovPanel">
        <button class="fitMode">fitMode</button>
        <button class="slideshow">slideshow</button>
      </div>

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');


    var addStyle = function(styles, targetWindow) {
      if (!targetWindow) { targetWindow = self; }
      var elm = targetWindow.document.createElement('style');
      elm.type = 'text/css';

      var text = styles.toString();
      text = targetWindow.document.createTextNode(text);
      elm.appendChild(text);
      var head = targetWindow.document.getElementsByTagName('head');
      head = head[0];
      head.appendChild(elm);
      return elm;
    };

    var FullScreen = {
      now: function() {
        if (top.document.fullScreenElement || top.document.mozFullScreen || top.document.webkitIsFullScreen) {
          return true;
        }
        return false;
      },
      request: function(target) {
        var elm = typeof target === 'string' ? top.document.getElementById(target) : target;
        if (!elm) { return; }
        if (elm.requestFullScreen) {
          elm.requestFullScreen();
        } else if (elm.webkitRequestFullScreen) {
          elm.webkitRequestFullScreen();
        } else if (elm.mozRequestFullScreen) {
          elm.mozRequestFullScreen();
        }
      },
      cancel: function() {
        if (!this.now()) { return; }

        if (top.document.cancelFullScreen) {
          top.document.cancelFullScreen();
        } else if (top.document.webkitCancelFullScreen) {
          top.document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          top.document.mozCancelFullScreen();
        }
      }
    };

    var toggleMonitorFull = function(v) {
      console.log('toggleMonitorFull!');
      var now = FullScreen.now();
      if (now || v === false) {
        console.log('fullscreen cancel');
        FullScreen.cancel();
      } else if (!now || v === true) {
        console.log('fullscreen request!');
        FullScreen.request(top.document.body);
      }
    };

    var isVideoFinished = function() {
      var vpos = $('.od-PlaybackPanel--hasDuration .od-PlaybackPanel-timePlayed').text();
      var duration = $('.od-PlaybackPanel--hasDuration .od-PlaybackPanel-totalTime').text();
      if (!vpos || !duration) { return false; }
      //console.log('isVideoFinished', vpos, duration, vpos === duration);
      return vpos === duration;
      //console.log('"%s","%s"', playerFrame.$('.duration').text(), playerFrame.$('.currentTime').text());
      //console.log(playerFrame.$('.duration').text() === playerFrame.$('.currentTime').text());
      //return playerFrame.$('.duration').text() === playerFrame.$('.currentTime').text();
    };

    var isVideoPlayingError = function() {
      var vp = ItemVideoPlayerRes.strings;
      var message = $('.od-ItemVideoPlayer-statusText').text();
      if (!message) { return false; }
        console.log('statusText', message);

      var isError =
        (message === vp.errorLoading) ||
        (message === vp.errorNetwork) ||
        false;

      if (isError) {
        console.log('%cVideoPlayingError: %s', 'background: red;', message);
      }
      return isError;
//      return $('.errorMessage').text() === videoLoadErrorMessage ; // "問題が発生したため、動画を再生できません。";
    };

    var togglePlay = function() {
      $('.od-PlaybackPanel .ms-Icon--play, .od-PlaybackPanel .ms-Icon--pause').click(); //$('.canvasOverlay').click();
    };

    var playNext = function() {
      try {
          var $nextButton = $('.OneUp-flipper--next .OneUp-button');  //top.window.jQuery('.OneUp-button[data-automationid=nextButton]');
          window.$nextButton = $nextButton.click();
      } catch (e) {
        console.log('%cException: ', 'background: red;', e, $nextButton);
      }
      //window.parent.$('.OneUp-flipper--next').click();
    };

    var toggleFitMode = function(v) {
      $('body').toggleClass('fit16-9', v);
      config.set('fitMode', $('body').hasClass('fit16-9') ? 'fit16-9' : '');
    };

    var toggleSlideshow = function(v) {
      $('body').toggleClass('slideshow', v);
      config.set('slideshow', $('body').hasClass('slideshow'));
    };

    var onFullscreenStatusChange = function() {
      var td = top.window.document;
      if (
        (td.webkitFullscreenElement && td.webkitFullscreenElement !== null) ||
        (td.mozFullscreenElement    && td.mozFullscreenElement !== null) ||
        (td.msFullscreenElement     && td.msFullscreenElement !== null) ||
        (td.fullscreenElement       && td.fullscreenElement !== null)
      ) {
        top.$('body').addClass('fullscreen');
      } else {
        top.$('body').removeClass('fullscreen');
      }
    };





    var video = null;
    var isVideoPlayerMode = false;
    var onVideoWatchTimer = function() {
      var $video = $('video');
        if ($video.length < 1) {
            if (isVideoPlayerMode) {
                onVideoPlayerClose();
            }
            isVideoPlayerMode = false;
        } else {
            if (!isVideoPlayerMode) {
                onVideoPlayerOpen($video);
            }
            isVideoPlayerMode = true;
            _onVideoWatchTimer();
        }
    };

    var timer = null, count = 0;
    var _onVideoWatchTimer = function() {
      if (isVideoPlayingError()) {
        console.log('%cVideo Playing Error. count:%s', 'background: lightgreen;', count++);
        togglePlay();
        return;
      }

      if (config.get('slideshow') && isVideoFinished()) {
        console.log('%cVideoFinish', 'background: lightgreen;');
        playNext();
        //window.clearInterval(timer);
        return;
      }
    };
    
    var onVideoPlayerOpen = function($video) {
      console.log('%cVideoPlayer Open', 'background: lightgreen;');
      video = $video[0];
      // for debug
      window.video = video;
      ItemVideoPlayerRes = require('local/controls/video/item/ItemVideoPlayer.resx');
      $('body').addClass('videoPlayer');
    };
    
    var onVideoPlayerClose = function() {
      console.log('%cVideoPlayer Close', 'background: lightgreen;');
      video = null;
      count = 0;
      $('body').removeClass('videoPlayer');
    };
    
    var videoWatchTimer = null;

    var initializeEvents = function() {
      videoWatchTimer = window.setInterval(onVideoWatchTimer, 1000);
      var td = top.window.document;
      td.addEventListener('webkitfullscreenchange', onFullscreenStatusChange);
      td.addEventListener('mozfullscreenchange',    onFullscreenStatusChange);
      td.addEventListener('msFullscreenChange',     onFullscreenStatusChange);
      td.addEventListener('fullscreenchange',       onFullscreenStatusChange);
      window.onbeforeunload = function() {
        td.removeEventListener('webkitfullscreenchange', onFullscreenStatusChange);
        td.removeEventListener('mozfullscreenchange',    onFullscreenStatusChange);
        td.removeEventListener('msFullscreenChange',     onFullscreenStatusChange);
        td.removeEventListener('fullscreenchange',       onFullscreenStatusChange);
      };
    };

    var initializePanel = function() {
      var $panel = $(__panel__);

      $panel.find('.fitMode')  .on('click', toggleFitMode);
      $panel.find('.slideshow').on('click', toggleSlideshow);

      $('body').toggleClass('fit16-9', config.get('fitMode') === 'fit16-9');
      $('body').toggleClass('slideshow', config.get('slideshow'));

      $('body').append($panel);

    };
    var initialize = function() {
      console.log('%cinitialize start', 'background: lightgreen;');

      addStyle(__css__);

      initializeEvents();
        
      initializePanel();

      console.log('%cinitialize end', 'background: lightgreen;');
    };


      console.log('%cOneDrive VideoPlayer-fix', 'background: lightgreen;');

      var initTimer = window.setInterval(function() {
        if (window.$) {
          window.clearInterval(initTimer);
          window.setTimeout(initialize, 5000);
        }
      }, 1000);
  };

  var script = document.createElement("script");
  script.id = "OneDriveVideoPlayerFix";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("charset", "UTF-8");
  script.appendChild(document.createTextNode('(' + monkey + ')();'));
  document.body.appendChild(script);
})();

