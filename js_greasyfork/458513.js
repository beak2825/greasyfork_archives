// ==UserScript==
// @name        Twitch Screen Comment Scroller(fix)
// @namespace   page.loupe.tsscf
// @description Twitch のコメントをニコニコ風にスクロールさせます。
// @match       https://www.twitch.tv/*
// @version     0.5.3
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @author      knoa
// @author      mikan-megane
// @downloadURL https://update.greasyfork.org/scripts/458513/Twitch%20Screen%20Comment%20Scroller%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458513/Twitch%20Screen%20Comment%20Scroller%28fix%29.meta.js
// ==/UserScript==

(function () {
  /* カスタマイズ(設定画面での変更が優先されます) */
  var SCRIPTNAME = 'ScreenCommentScroller';
  var COLOR = '#ffffff';/*コメント色*/
  var OCOLOR = '#000000';/*コメント縁取り色*/
  var OWIDTH = 1 / 10;/*コメント縁取りの太さ(比率)*/
  var OPACITY = '0.25';/*コメントの不透明度*/
  var MAXLINES = 10;/*コメント最大行数*/
  var LINEHEIGHT = 1.2;/*コメント行高さ*/
  var DURATION = 5;/*スクロール秒数*/
  var FPS = 60;/*秒間コマ数*/
  var EMOJI = true;/*コメントが絵文字だけの場合絵文字を表示するか*/
  var EMOJISIZE = 1.5;/*絵文字の大きさ*/
  var EMOJILIMIT = 10;/*絵文字の最大数*/
  var SHOW = '1';/*コメントを表示するか*/

  /* サイト定義 */
  var site = {
    getScreen: () => document.querySelector('.video-player__container'),
    getBoard: () => document.querySelector('.chat-scrollable-area__message-container') || document.querySelector('.video-chat__message-list-wrapper ul'),/*live || log*/
    getComments: (node) => node?.querySelector('[data-a-target="chat-line-message-body"],.video-chat__message'),
    getVideo: () => document.querySelector('video:not([id="' + SCRIPTNAME + 'Video"])'),
  };
  /* 処理本体 */
  var screen, board, video, canvas, context, lines = [], fontsize, scrollCommentsTimer, title = document.title, configEdit = false, commentObserver, canvasVideo;
  var core = {
    /* DOMの初期化待ち&ページ変更検知 */
    waitStart() {
      window.setInterval(function () {
        var screen_ = site.getScreen();
        var board_ = site.getBoard();
        var video_ = site.getVideo();
        var title_ = document.title;
        // console.debug('wait comment list...', { screen_, board_, video_ });
        if (screen_ && board_ && video_ && (screen_ != screen || board_ != board || video_ != video || title_ != title || configEdit || canvas.width != screen.offsetWidth) && !document.pictureInPictureElement) {
          screen = screen_;
          board = board_;
          video = video_;
          title = title_;
          configEdit = false;
          core.initialize();
        }
      }, 3000);
    },
    /* 初期化 */
    initialize() {
      /* コメントをスクロールさせるCanvasの設置 */
      /* (描画処理の軽さは HTML5 Canvas, CSS Position Left, CSS Transition の順) */
      canvas?.remove();
      canvas = document.createElement('canvas');
      canvas.id = SCRIPTNAME;
      screen.appendChild(canvas);
      context = canvas.getContext('2d');
      /* メイン処理 */
      core.addStyle();
      core.modify();
      core.initPip();
      core.listenComments();
      core.scrollComments();

      var controlsTimer = window.setInterval(() => {
        var controls = document.querySelector('.player-controls__right-control-group');
        if (!controls) return;

        clearInterval(controlsTimer);
        var settingButton = controls.querySelector('button[data-a-target="player-settings-button"]');

        var chatButton = controls.querySelector('#' + SCRIPTNAME + 'ChatButton');
        if (!chatButton) {
          chatButton = settingButton.closest('.player-controls__right-control-group > div').cloneNode(true);
          chatButton.id = SCRIPTNAME + 'ChatButton';
          var svgClass = chatButton.querySelector('svg').getAttribute('class');
          chatButton.querySelector('svg').outerHTML = '<svg fill="#000000" height="100%" width="100%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve"><path d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689	c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01	c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"/></svg>';
          chatButton.querySelector('svg').setAttribute('class', svgClass);
          chatButton.querySelector('button').addEventListener('click', () => {
            SHOW = (SHOW == '1') ? '0' : '1';
            chatButton.style.opacity = (SHOW == '1') ? 1 : 0.5;
            GM_config.set('SHOW', SHOW);
            GM_config.write();
            lines = [];
            configEdit = true;
          });
          controls.insertBefore(chatButton, settingButton.closest('.player-controls__right-control-group > div'));
        }
        chatButton.style.opacity = (SHOW == '1') ? 1 : 0.5;

        settingButton.removeEventListener('click', core.showVideoSettings);
        settingButton.addEventListener('click', core.showVideoSettings);
      }, 10);

    },
    /* *スクリーンサイズに変化があればcanvasも変化させる* */
    modify() {
      canvas.width = screen.offsetWidth;
      canvas.height = screen.offsetHeight;
      fontsize = (canvas.height / MAXLINES) / LINEHEIGHT;
      context.font = 'bold ' + (fontsize) + 'px sans-serif';
      context.fillStyle = COLOR;
      context.strokeStyle = OCOLOR;
      context.lineWidth = fontsize * OWIDTH;
    },
    /* スタイル付与 */
    addStyle() {
      let head = document.querySelector('head');
      if (!head) return;
      document.querySelector('style#' + SCRIPTNAME + 'Style')?.remove();
      let style = document.createElement('style');
      style.type = 'text/css';
      style.id = SCRIPTNAME + 'Style';
      style.innerHTML = '' +
        'canvas#' + SCRIPTNAME + '{' +
        ' pointer-events: none;' +
        ' position: absolute;' +
        ' top: 0;' +
        ' left: 0;' +
        ' width: 100%;' +
        ' height: 100%;' +
        ' opacity: ' + OPACITY + ';' +
        ' z-index: 99999;' +
        '}' +
        '';
      head.appendChild(style);
    },
    /* コメントの新規追加を見守るイベント */
    listenComments() {
      if (commentObserver) {
        commentObserver.disconnect()
      }
      commentObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type == 'childList') {
            mutation.addedNodes.forEach(function (node) {
              core.attachComment(site.getComments(node));
            });
          }
        });
      })
      commentObserver.observe(board, { childList: true });
    },
    /* コメントが追加されるたびにスクロールキューに追加 */
    attachComment(comment) {
      if (!comment) return;
      let record = {};
      record.text = comment.querySelector('[data-a-target="chat-message-text"]')?.textContent?.trim();/*流れる文字列*/
      record.img = Array.from(comment.querySelectorAll('img'));/*絵文字*/
      record.img.splice(EMOJILIMIT);/*絵文字の最大数を制限*/
      record.width = record.text ? context.measureText(record.text).width : context.measureText('絵').width * EMOJISIZE * record.img.length;/*文字列の幅*/
      record.life = DURATION * FPS;/*文字列が消えるまでのコマ数*/
      record.left = canvas.width;/*左端からの距離*/
      record.delta = (canvas.width + record.width) / (record.life);/*コマあたり移動距離*/
      record.reveal = record.width / record.delta;/*文字列が右端から抜けてあらわになるまでのコマ数*/
      record.touch = canvas.width / record.delta;/*文字列が左端に触れるまでのコマ数*/
      /* 追加されたコメントをどの行に流すかを決定する */
      for (let i = 0; i < MAXLINES; i++) {
        let length = lines[i] ? lines[i].length : 0;/*同じ行に詰め込まれているコメント数*/
        switch (true) {
          /* 行が空いていれば追加 */
          case (lines[i] == undefined || !length):
            lines[i] = [];
          /* 以前のコメントより長い(速い)文字列なら、左端に到達する時間で判断する */
          case (lines[i][length - 1].reveal < 0 && lines[i][length - 1].delta > record.delta):
          /* 以前のコメントより短い(遅い)文字列なら、右端から姿を見せる時間で判断する */
          case (lines[i][length - 1].life < record.touch && lines[i][length - 1].delta < record.delta):
            /*条件に当てはまればすべてswitch文のあとの処理で行に追加*/
            break;
          default:
            /*条件に当てはまらなければ次の行に入れられるかの判定へ*/
            continue;
        }
        record.top = ((canvas.height / MAXLINES) * i) + fontsize;
        lines[i].push(record);
        break;
      }
    },
    /* FPSタイマー駆動 */
    scrollComments() {
      if (scrollCommentsTimer) {
        window.clearInterval(scrollCommentsTimer);
      }
      scrollCommentsTimer = window.setInterval(function () {
        /* 再生中じゃなければ処理しない */
        if (video.paused) return;
        /* Canvas描画 */
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1;
        if (document.pictureInPictureElement) {
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          context.globalAlpha = OPACITY;
        }
        if (!(SHOW == '1')) return;
        for (let i = 0; lines[i]; i++) {
          for (let j = 0; lines[i][j]; j++) {
            if (lines[i][j].text) {
              /*視認性を向上させるスクロール文字の縁取りは、幸いにもパフォーマンスにほぼ影響しない*/
              context.strokeText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
              context.fillText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
            } else if (lines[i][j].img && EMOJI && !document.pictureInPictureElement) {
              /* オリジンの都合上、絵文字はPIPに描画できない */
              lines[i][j].img.forEach((_, k) => {
                /* k = 何文字目 */
                context.drawImage(
                  lines[i][j].img[k],
                  lines[i][j].left + (k * fontsize * EMOJISIZE), // 1文字分ずつ位置をずらす
                  lines[i][j].top,
                  fontsize * EMOJISIZE,
                  fontsize * EMOJISIZE
                );
              });
            }
            lines[i][j].life--;
            lines[i][j].reveal--;
            lines[i][j].touch--;
            lines[i][j].left -= lines[i][j].delta;
          }
          if (lines[i][0] && lines[i][0].life == 0) {
            lines[i].shift();
          }
        }
      }, 1000 / FPS);
    },
    /* 設定画面 */
    settings() {
      if (typeof GM !== 'undefined' && GM && GM.registerMenuCommand) {
        GM.registerMenuCommand("設定", () => GM_config.open());
      } else if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("設定", () => GM_config.open());
      }
      const config_init = () => {
        COLOR = GM_config.get('COLOR') || COLOR;
        OCOLOR = GM_config.get('OCOLOR') || OCOLOR;
        OWIDTH = GM_config.get('OWIDTH') || OWIDTH;
        OPACITY = GM_config.get('OPACITY') || OPACITY;
        MAXLINES = GM_config.get('MAXLINES') || MAXLINES;
        LINEHEIGHT = GM_config.get('LINEHEIGHT') || LINEHEIGHT;
        DURATION = GM_config.get('DURATION') || DURATION;
        FPS = GM_config.get('FPS') || FPS;
        EMOJI = GM_config.get('EMOJI') || EMOJI;
        EMOJISIZE = GM_config.get('EMOJISIZE') || EMOJISIZE;
        EMOJILIMIT = GM_config.get('EMOJILIMIT') || EMOJILIMIT;
        SHOW = GM_config.get('SHOW') || SHOW;
        configEdit = true;
      }
      GM_config.init({
        'id': 'ScreenCommentScroller',
        'title': 'ScreenCommentScroller',
        'fields': {
          'COLOR': {
            'label': 'コメント色',
            'type': 'text',
            'default': COLOR
          },
          'OCOLOR': {
            'label': 'コメント縁取り色',
            'type': 'text',
            'default': OCOLOR
          },
          'OWIDTH': {
            'label': 'コメント縁取りの太さ(比率)',
            'type': 'float',
            'default': OWIDTH
          },
          'OPACITY': {
            'label': 'コメントの不透明度',
            'type': 'float',
            'default': OPACITY
          },
          'MAXLINES': {
            'label': 'コメント最大行数',
            'type': 'int',
            'default': MAXLINES
          },
          'LINEHEIGHT': {
            'label': 'コメント行高さ',
            'type': 'float',
            'default': LINEHEIGHT
          },
          'DURATION': {
            'label': 'スクロール秒数',
            'type': 'float',
            'default': DURATION
          },
          'FPS': {
            'label': '秒間コマ数',
            'type': 'int',
            'default': FPS
          },
          'EMOJI': {
            'label': 'コメントが絵文字だけの場合絵文字を表示するか',
            'type': 'checkbox',
            'default': EMOJI
          },
          'EMOJISIZE': {
            'label': '絵文字の大きさ',
            'type': 'float',
            'default': EMOJISIZE
          },
          'EMOJILIMIT': {
            'label': '絵文字の最大表示数',
            'type': 'int',
            'default': EMOJILIMIT
          },
          'SHOW': {
            'label': 'コメントを表示するか',
            'type': 'int',
            'default': SHOW
          },
        },
        'events': {
          'init': () => config_init(),
          'save': () => config_init(),
        },
      });
    },
    showVideoSettings() {
      if (!document.pictureInPictureElement) {
        core.initialize();
      }
      if (document.querySelector('#' + SCRIPTNAME + 'SettingButton')) {
        return;
      }
      var menuTimer = window.setInterval(() => {
        var menus = document.querySelector('div[data-a-target="player-settings-menu"]')
        if (menus) {
          clearInterval(menuTimer);
          if(menus.querySelector('[data-from="' + SCRIPTNAME + '"]')){
            return;
          }
          var closeButton = menus.querySelector('[role="menuitem"]');
          var separator = menus.querySelector('[role="separator"]').cloneNode(true);
          separator.setAttribute('data-from', SCRIPTNAME);
          var settingButton = menus.querySelector('[role="menuitem"]:last-of-type').cloneNode(true);
          settingButton.id = SCRIPTNAME + 'SettingButton';
          settingButton.setAttribute('data-from', SCRIPTNAME);
          settingButton.querySelector('div').textContent = 'コメントスクロール設定';
          settingButton.addEventListener('click', (e) => {
            closeButton.click();
            GM_config.open()
          });

          var pipButton = menus.querySelector('[role="menuitem"]:last-of-type').cloneNode(true);
          pipButton.setAttribute('data-from', SCRIPTNAME);
          pipButton.querySelector('div').textContent = 'コメント付きPIP';
          pipButton.addEventListener('click', () => {
            closeButton.click();
            core.startPip();
          });

          menus.appendChild(separator);
          menus.appendChild(settingButton);
          menus.appendChild(pipButton);
          menus.addEventListener('click', () => {
            menus.querySelectorAll('[data-from="' + SCRIPTNAME + '"]').forEach((menu) => menu.remove());
          })
        }
      }, 10);
    },
    initPip() {
      canvasVideo?.remove();
      canvasVideo = document.createElement('video');
      canvasVideo.id = SCRIPTNAME + 'Video';
      canvasVideo.muted = true;
      canvasVideo.style.top = 0;
      canvasVideo.style.opacity = 0;
      canvasVideo.style.pointerEvents = 'none';
      canvasVideo.addEventListener('enterpictureinpicture', () => {
        canvasVideo.play();
        canvas.style.visibility = 'hidden';
        video.style.opacity = 0.3;

        var message = document.createElement('div');
        message.id = SCRIPTNAME + 'Message';
        message.style.position = 'absolute';
        message.style.fontSize = '1.5em';
        message.style.color = 'white';
        message.textContent = 'ピクチャー イン ピクチャーで再生しています';
        video.parentNode.insertBefore(message, video);
      });
      canvasVideo.addEventListener('leavepictureinpicture', () => {
        canvasVideo.pause();
        canvas.style.visibility = 'visible';
        video.style.opacity = 1;
        document.querySelector('#' + SCRIPTNAME + 'Message')?.remove();
      });
      canvas.parentNode.insertBefore(canvasVideo, canvas);
      canvasVideo.srcObject = canvas.captureStream(FPS);
    },
    startPip() {
      if (!document.pictureInPictureEnabled) {
        alert('このブラウザではピクチャーインピクチャーが利用できません');
        return;
      }
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        canvasVideo.requestPictureInPicture();
      }
    }
  };
  core.settings();
  core.waitStart();
})();