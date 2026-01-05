// ==UserScript==
// @name        Nicorenizer
// @namespace   https://github.com/segabito/
// @description 動画クリックで一時停止/再開 ダブルクリックでフルスクリーン切換え
// @include     http://www.nicovideo.jp/watch/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/435/Nicorenizer.user.js
// @updateURL https://update.greasyfork.org/scripts/435/Nicorenizer.meta.js
// ==/UserScript==

// TODO:
// ダブルクリック時にフルスクリーンにする設定を無効・ブラウザ全体・モニター全体から選べるようにする

// ver 0.1.2
// - Watch It Laterと併用時、動画選択画面でのダブルクリックでフルスクリーンにならないのを修正

// ver 0.1.0 最初のバージョン

(function() {
  var monkey = (function(){
    'use strict';


    if (!window.WatchApp || !window.WatchJsApi) {
      return;
    }

    var FullScreen = {
      now: function() {
        if (document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen) {
          return true;
        }
        return false;
      },
      request: function(target) {
        var elm = typeof target === 'string' ? document.getElementById(target) : target;
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

        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
      }
    };


    window.Nicorenizer = {};

    window.WatchApp.mixin(window.Nicorenizer, {
      initialize: function() {
        this._watchInfoModel      = require('watchapp/model/WatchInfoModel').getInstance();//window.WatchApp.ns.init.CommonModelInitializer.watchInfoModel;
        var PlayerInitializer = require('watchapp/init/PlayerInitializer');
        this._playerAreaConnector = PlayerInitializer.playerAreaConnector;
        this._nicoPlayerConnector = PlayerInitializer.nicoPlayerConnector;
        this._playerScreenMode    = PlayerInitializer.playerScreenMode;
        this._playlist            = require('watchapp/init/PlaylistInitializer').playlist;
        this._videoExplorer       = require('watchapp/init/VideoExplorerInitializer').videoExplorer;
        this._watchInfoModel = require('watchapp/model/WatchInfoModel').getInstance();

        this._vastStatus = this._nicoPlayerConnector.vastStatus;

        this.initializeUserConfig();
        this.initializeSettingPanel();
        this.initializeShield();
        this.initializePlayerEvent();

        this.initializePlayerApp();

        this.initializeCss();
      },
      addStyle: function(styles, id) {
        var elm = document.createElement('style');
        elm.type = 'text/css';
        if (id) { elm.id = id; }

        var text = styles.toString();
        text = document.createTextNode(text);
        elm.appendChild(text);
        var head = document.getElementsByTagName('head');
        head = head[0];
        head.appendChild(elm);
        return elm;
      },
      initializeCss: function() {
        var __css__ = (function() {/*

          #nicorenaiShield {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 85px;
            z-index: 9950;
            cursor: none;
          }

          #nicorenaiShield.disable, #nicorenaiShield.vast, #nicorenaiShield.disableTemp {
            display: none !important;
          }

          #nicorenaiShield.debug {
            background: red; opacity: 0.5;
          }

          #nicorenaiShield.initialized {
            display: block;
          }

          #nicorenaiShield.showCursor {
            cursor: crosshair; {* 現在有効である事をわかりやすくするためにcrosshair。本当はオリジナルのカーソルを用意したいところ *}
          }

          body.setting_panel #nicorenaiShield, body.videoErrorOccurred #nicorenaiShield,
          body.setting_panel #nicorenaiShield, body.videoErrorOccurred #nicorenaiShieldToggle {
            display: none;
          }

          body.videoExplorer #content:not(.w_adjusted) #nicorenaiShield {
            {* 動画選択画面ではクリックで解除させるために邪魔なので消す *}
            {* ただしWatch It Lterの検索モードでは有効にする *}
            display: none;
          }

          #nicorenaiShieldToggle {
            position: absolute;
            z-index: 9951;
            top:  10px;
            left: 10px;
            border-color: blue;
            opacity: 0;
            cursor: pointer;
            transition: opacity 0.5s ease;
            padding: 4px 8px;
          }

          #nicorenaiShieldToggle.disable, #nicorenaiShieldToggle.disableTemp  {
            border-color: black;
          }

          #nicorenaiShieldToggle.debug {
            opacity: 1 !important;
          }

          #nicorenaiShieldToggle.initialized:hover, #nicorenaiShieldToggle.show, #nicorenaiShieldToggle.disableTemp  {
            opacity: 1;
            transition: none;
          }

          #nicorenaiShieldToggle:after {
            content: ':ON';
          }
          #nicorenaiShieldToggle.disable:after, #nicorenaiShieldToggle.disableTemp:after {
            content: ':OFF';
          }

          #nicorenizerSettingPanel {
            position: fixed;
            bottom: 2000px; right: 8px;
            z-index: -1;
            width: 500px;
            background: #f0f0f0; border: 1px solid black;
            padding: 8px;
            transition: bottom 0.4s ease-out;
          }
          #nicorenizerSettingPanel.open {
            display: block;
            bottom: 8px;
            box-shadow: 0 0 8px black;
            z-index: 10000;
          }
          #nicorenizerSettingPanel .close {
            position: absolute;
            cursor: pointer;
            right: 8px; top: 8px;
          }
          #nicorenizerSettingPanel .panelInner {
            background: #fff;
            border: 1px inset;
            padding: 8px;
            min-height: 300px;
            overflow-y: scroll;
            max-height: 500px;
          }
          #nicorenizerSettingPanel .panelInner .item {
            border-bottom: 1px dotted #888;
            margin-bottom: 8px;
            padding-bottom: 8px;
          }
          #nicorenizerSettingPanel .panelInner .item:hover {
            background: #eef;
          }
          #nicorenizerSettingPanel .windowTitle {
            font-size: 150%;
          }
          #nicorenizerSettingPanel .itemTitle {
          }
          #nicorenizerSettingPanel label {

          }
          #nicorenizerSettingPanel small {
            color: #666;
          }
          #nicorenizerSettingPanel .expert {
            margin: 32px 0 16px;
            font-size: 150%;
            background: #ccc;
          }

          {* Chromeの不具合対策 *}
          body.full_with_browser {
            width: 100%;
          }

          #nicorenaiShield .previous,
          #nicorenaiShield .next {
            position: absolute;
            display: none;
            top: 0;
            width: 48px;
            height: 100%;
            opacity: 0.8;
          }

          #nicorenaiShield.hasPrevious .previous,
          #nicorenaiShield.hasNext     .next     {
            display: block;
          }


          #nicorenaiShield .previous .button,
          #nicorenaiShield .next .button{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 64px;
            margin: auto;
            box-sizing: border-box;
            font-size: 28px;
            cursor: pointer;
            background-color: #333;
            color: #fff;
            border: 2px solid #ccc;
            opacity: 0;
            transition: opacity 0.4s linear;
            user-select: none;
          }

          #nicorenaiShield .previous:hover .button,
          #nicorenaiShield .next:hover .button {
            opacity: 1;
          }

          #nicorenaiShield .previous .button:active,
          #nicorenaiShield .next .button:active {
            background: #888;
          }


          #nicorenaiShield .previous {
            left: 0;
          }
          #nicorenaiShield .next     {
            right: 0;
          }

          #nicorenaiShield .previous .button {
          }
          #nicorenaiShield .next     .button {
            right: 0;
            left: auto;
          }


          body.full_with_browser #nicoplayerContainer #nicoplayerContainerInner {
            margin-top: 0 !important;
            margin-bottom: -76px !important;
          }
          body.full_with_browser.showControl #nicoplayerContainer #nicoplayerContainerInner {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }



        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

        this.addStyle(__css__, 'NicorenizerCss');
      },
      initializeUserConfig: function() {
        var prefix = 'Nicorenizer_';
        var conf = {
          fullScreenType: 'browser', // none, browser, monitor
          togglePlay: true
        };
        this.config = {
          get: function(key) {
            try {
              if (window.localStorage.hasOwnProperty(prefix + key)) {
                return JSON.parse(window.localStorage.getItem(prefix + key));
              }
              return conf[key];
            } catch (e) {
              return conf[key];
            }
          },
          set: function(key, value) {
            window.localStorage.setItem(prefix + key, JSON.stringify(value));
          }
        };
      },
      initializeSettingPanel: function() {
        var $menu   = $('<li class="nicorenizerSettingMenu"><a href="javascript:;" title="Nicorenizerの設定変更">Nicorenizer設定</a></li>');
        var $panel  = $('<div id="nicorenizerSettingPanel" />');//.addClass('open');
        var $button = $('<button class="toggleSetting playerBottomButton">設定</botton>');

        $button.on('click', function(e) {
          e.stopPropagation(); e.preventDefault();
          $panel.toggleClass('open');
        });

        var config = this.config;
        $menu.find('a').on('click', function() { $panel.toggleClass('open'); });

        var __tpl__ = (function() {/*
          <div class="panelHeader">
          <h1 class="windowTitle">Nicorenizerの設定</h1>
          <button class="close" title="閉じる">×</button>
          </div>
          <div class="panelInner">
            <div class="item" data-setting-name="togglePlay" data-menu-type="radio">
              <h3 class="itemTitle">画面クリックで一時停止/再生</h3>
              <label><input type="radio" value="true" >する</label>
              <label><input type="radio" value="false">しない</label>
            </div>

            <div class="item" data-setting-name="fullScreenType" data-menu-type="radio">
              <h3 class="itemTitle">ダブルクリック時のフルスクリーン</h3>
              <label><input type="radio" value="&quot;browser&quot;" >ブラウザ全体</label>
              <label><input type="radio" value="&quot;monitor&quot;">モニター全体</label>
              <label><input type="radio" value="&quot;none&quot;">切り換えない</label>
            </div>
          </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
        $panel.html(__tpl__);
        $panel.find('.item').on('click', function(/* e */) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = JSON.parse($this.find('input:checked').val());
          console.log('seting-name', settingName, 'value', value);
          config.set(settingName, value);
        }).each(function(/* e */) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = config.get(settingName);
          $this.addClass(settingName);
          $this.find('input').attr('name', settingName).val([JSON.stringify(value)]);
        });
        $panel.find('.close').click(function() {
          $panel.removeClass('open');
        });


        $('#playerAlignmentArea').append($button);
        $('#siteHeaderRightMenuFix').after($menu);
        $('body').append($panel);


      },
      _initializeDom: function() {
        var $prev = $('<div class="previous"><button class="button" data-click-command="previous" title="前の動画">&lt;</button></div>');
        var $next = $('<div class="next"><button class="button" data-click-command="next" title="次の動画">&gt;</button></div>');
        this._$shield = $('<div id="nicorenaiShield" class="hasPrevious hasNext"></div>');
        this._$toggle = $('<button id="nicorenaiShieldToggle" title="クリックで無効化ON/OFF">シールド</botton>');
        this._$shield.append($prev).append($next);

        $('#external_nicoplayer').after(this._$shield).after(this._$toggle);
        return this._$shield;
      },
      initializeShield: function() {
        var videoExplorer       = this._videoExplorer;
        var nicoPlayer          = $("#external_nicoplayer")[0];
        var toggleMonitorFull   = $.proxy(this.toggleMonitorFull, this);
        var toggleDisable       = $.proxy(this.toggleDisable, this);
        var execCommand         = $.proxy(this.execCommand, this);
        var config = this.config;

        this._initializeDom();
        var $shield = this._$shield;
        var $toggle = this._$toggle;

        var click = function(e) {
          // TODO: YouTubeみたいに中央に停止/再生マーク出す？
          if (e.button !== 0) { return; }
          if (!config.get('togglePlay')) { return; }
          var $target = $(e.target);
          var cmd = $target.attr('data-click-command');
          if (cmd) {
            e.preventDefault();
            e.stopPropagation();
            execCommand(cmd);
            return;
          }
          var status = nicoPlayer.ext_getStatus();
          if (status === 'playing') {
            execCommand('stop');
          } else {
            execCommand('play');
          }
        };

        var dblclick = function(e) {
          if (e.button !== 0) return;
          e.preventDefault(); e.stopPropagation();
          var fullScreenType = config.get('fullScreenType');
          if (fullScreenType === 'none') { return; }

          if (videoExplorer.isOpen()) {
            videoExplorer.changeState(false);
            if (fullScreenType === 'monitor') {
              window.WatchJsApi.player.changePlayerScreenMode('browserFull');
              toggleMonitorFull(true);
            } else {
              window.WatchJsApi.player.changePlayerScreenMode('browserFull');
            }
          } else
          if ($('body').hasClass('full_with_browser')) {
            window.WatchJsApi.player.changePlayerScreenMode('notFull');
            toggleMonitorFull(false);
          } else {
            if (fullScreenType === 'monitor') {
              window.WatchJsApi.player.changePlayerScreenMode('browserFull');
              toggleMonitorFull(true);
            } else {
              window.WatchJsApi.player.changePlayerScreenMode('browserFull');
            }
          }
        };

        var cursorHideTimer = null;
        var mousemove = function() {
          $shield.addClass('showCursor');
          if (cursorHideTimer) {
            window.clearTimeout(cursorHideTimer);
            cursorHideTimer = null;
          }
          cursorHideTimer = window.setTimeout(function() {
            $shield.off('mousemove', mousemove);
            $shield.removeClass('showCursor');
            window.setTimeout(function() { $shield.on('mousemove', mousemove); }, 500);
          }, 1500);
        };

        var mousedown = function(e) {
          if (e.button === 0) return;
          // 左ボタン以外でクリックされたら5秒間だけシールドを解除するよ
          e.preventDefault(); e.stopPropagation();

          $shield.addClass('disableTemp');
          $toggle.addClass('disableTemp');

          $toggle
            .css('opacity', 1)
            .animate({'opacity': 0.3}, 5000, function() { $toggle.css('opacity', ''); });
          window.setTimeout(function() {
            $toggle.removeClass('disableTemp');
            $shield.removeClass('disableTemp');
            $toggle.css('opacity', '');
          }, 5000);
        };

        $shield
          .on('click'   ,  click)
          .on('dblclick',  dblclick)
          .on('mousedown', mousedown)
          .on('mousemove', mousemove);

        $toggle
          .on('click', toggleDisable);

      },
      _initializeScreenMode: function() {
        var playerScreenMode    = this._playerScreenMode;
        var lastScreenMode = '';
        var $nicoplayerContainer = $('#nicoplayerContainer');
        var toggleMonitorFull = $.proxy(this.toggleMonitorFull, this);

        var onPlayerContainerMouseMove = _.debounce(function(e) {
          var bottom = $nicoplayerContainer.innerHeight() - e.clientY;
          $('body').toggleClass('showControl', bottom < 100);
        }, 100);

        var onScreenModeChange = function(sc) {
          var mode = sc.mode;
          if (lastScreenMode === 'browserFull' && mode !== 'browserFull') {
            toggleMonitorFull(false);
          }
          lastScreenMode = mode;

          if (mode === 'browserFull') {
            $nicoplayerContainer.on('mousemove', onPlayerContainerMouseMove);
          } else {
            $nicoplayerContainer.off('mousemove', onPlayerContainerMouseMove);
          }
        };

        playerScreenMode.addEventListener('change', onScreenModeChange);
      },
      initializePlayerEvent: function() {
        var playerAreaConnector = this._playerAreaConnector;
        var watchInfoModel    = this._watchInfoModel;
        var playlist          = this._playlist;
        var $shield           = this._$shield;
        var $toggle           = this._$toggle;
        var toggleDisable     = $.proxy(this.toggleDisable, this);

        this._initializeScreenMode();

        // 最初に再生開始されるまでは表示しない。 ローカルストレージ～が出たときにクリックできるようにするため。
        // でも自動再生にしてると詰む。
        playerAreaConnector.addEventListener(
          'onVideoStarted', function() {
            $shield.addClass('initialized');
            $toggle.addClass('initialized');
            toggleDisable(false);
          }
        );

        // 再生後メニューがクリックできないのも困るので無効化する
        playerAreaConnector.addEventListener(
          'onVideoEnded', function() {
            toggleDisable(true, true);
          }
        );

        playerAreaConnector.addEventListener(
          'onVideoSeeked', function(vpos/*, b, c*/) {
            // もう一度再生する場合など
            if (parseInt(vpos, 10) === 0) toggleDisable(false);
          }
        );

        var hasPreviousVideo = function() {
          console.log('%chasPreviousVideo', 'background: cyan;', playlist.getPlayingIndex(), 0);
          return playlist.getPlayingIndex() > 0;
        };

        var hasNextVideo = function() {
          console.log('%chasNextVideo', 'background: cyan;', playlist.getPlayingIndex(), playlist.getItems().length);
          return playlist.getPlayingIndex() < playlist.getItems().length - 1;
        };

        var onWatchInfoModelReset = function() {
          $shield
            .toggleClass('hasPrevious', hasPreviousVideo())
            .toggleClass('hasNext',     hasNextVideo());
        };
        watchInfoModel.addEventListener('reset', onWatchInfoModelReset);
        if (watchInfoModel.initialized) {
          window.setTimeout(function() { onWatchInfoModelReset(); }, 0);
        }

        // 動画広告まわり
        var vastStatus = this._vastStatus;
        vastStatus.addEventListener('linearStart', function() {
          $shield.addClass('vast');
        });
        vastStatus.addEventListener('linearEnd', function() {
          $shield.removeClass('vast');
        });

      },
      initializePlayerApp: function() {
        // 実装が漏れててエラーが出てるっぽいのを修正
        // フルスクリーン時に動画プレイヤー以外にフォーカスがある時に出る
        var np = window.PlayerApp.ns.player.Nicoplayer.getInstance();
        var ep = $('#external_nicoplayer')[0];
        if (!np.ext_getVolume) {
          np.ext_getVolume = function()  { return ep.ext_getVolume(); };
        }
        if (!np.ext_setVolume) {
          np.ext_setVolume = function(v) { ep.ext_setVolume(v); };
        }
        if (!np.ext_getStatus) {
          np.ext_getStatus = function()  { return ep.ext_getStatus(); };
        }
      },
      toggleMonitorFull: function(v) {
        var now = FullScreen.now();
        if (now || v === false) {
          FullScreen.cancel();
        } else if (!now || v === true) {
          FullScreen.request(document.body);
        }
      },
      toggleDisable: function(f, showButtonTemporary) {
        var $shield = this._$shield;
        var $toggle = this._$toggle;

        var isDisable = $toggle.toggleClass('disable', f).hasClass('disable');
        $shield.toggleClass('disable', isDisable);

        if (showButtonTemporary) { // 状態が変わった事を通知するために一時的に表示する
          $toggle.addClass('show');
          window.setTimeout(function() { $toggle.removeClass('show'); }, 2000);
        }
      },
      execCommand: function(cmd) {
        var nicoPlayerConnector = this._nicoPlayerConnector;
        console.log('%cexec command: %s', 'background: cyan;', cmd);
        switch (cmd) {
          case 'previous':
            nicoPlayerConnector.playPreviousVideo();
            break;
          case 'next':
            nicoPlayerConnector.playNextVideo();
            break;
          case 'stop':
            nicoPlayerConnector.stopVideo();
            break;
          case 'play':
            nicoPlayerConnector.playVideo();
            break;
          default:
            break;
        }
      }
    });

    if (window.PlayerApp) {
      (function() {
        var watchInfoModel = require('watchapp/model/WatchInfoModel').getInstance();
        if (watchInfoModel.initialized) {
          window.Nicorenizer.initialize();
        } else {
          var onReset = function() {
            watchInfoModel.removeEventListener('reset', onReset);
            window.setTimeout(function() {
              watchInfoModel.removeEventListener('reset', onReset);
              window.Nicorenizer.initialize();
            }, 0);
          };
          watchInfoModel.addEventListener('reset', onReset);
        }
      })();
    }


  });

  var script = document.createElement("script");
  script.id = "NicorenizerLoader";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("charset", "UTF-8");
  script.appendChild(document.createTextNode("(" + monkey + ")()"));
  document.body.appendChild(script);

})();
