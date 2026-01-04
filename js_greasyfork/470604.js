// ==UserScript==
// @name        ASOBISTAGE Screen Comment Scroller
// @namespace   asobi.csc.phakstar
// @description ASOBISTAGE のコメントをニコニコ風にスクロールさせます。
// @match       https://asobistage.asobistore.jp/event/*
// @version     0.2.3
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @author      phakstar
// @downloadURL https://update.greasyfork.org/scripts/470604/ASOBISTAGE%20Screen%20Comment%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/470604/ASOBISTAGE%20Screen%20Comment%20Scroller.meta.js
// ==/UserScript==

// 動作確認日
// 生放送LIVE : 2024/08/10
// アーカイブ : 2024/01/08

(function () {
  /* カスタマイズ(設定画面での変更が優先されます) */
  var SCRIPTNAME = 'ScreenCommentScroller';
  var COLOR = '#ffffff';/*コメント色*/
  var OCOLOR = '#000000';/*コメント縁取り色*/
  var OWIDTH = 1 / 10;/*コメント縁取りの太さ(比率)*/
  var OPACITY = '0.5';/*コメントの不透明度*/
  var MAXLINES = 10;/*コメント最大行数*/
  var LINEHEIGHT = 1.5;/*コメント行高さ*/
  var DURATION = 5;/*スクロール秒数*/
  var FPS = 60;/*秒間コマ数*/
  var EMOJI = true;/*絵文字コメントを表示する*/
  var EMOJISIZE = 1.5;/*絵文字の大きさ*/

  /* サイト定義 */
  /* TODO: 動かなくなったときの修正候補 */
  var site = {
     /*liveとarchiveで要素が違う*/
//    getScreen: () => document.querySelector('[class^=style_overlayControls_clickArea__]') || document.querySelector('[class^=overlayControls_overlayControls_clickArea__]'), /*live || archive*/
//    getBoard: () => document.querySelector('[data-test-id="virtuoso-item-list"]') || document.querySelector("div[class^='commentViewer_commentList__'] > div:nth-child(2) > div > div"), /*live || archive*/
//    getCommentIndex: (node) => node.getAttribute("data-index") || getComputedStyle(node).top.slice(0,-2), /*live || archive*/
//    getComment: (node) => node.querySelector('[class^=style_item_comment__]') || node.querySelector('[class^=commentViewer_item_comment__]'), /*live || archive*/
//    getCommentText: (comment) => comment.querySelector('span')?.textContent.trim(),
//    getCommentImgs: (comment) => comment.querySelectorAll('img'),
//    getVideo: () => document.querySelector('video'),

    getScreen: () => document.querySelector('[id="vjs_video_3"]') || document.querySelector('[class^=overlayControls_overlayControls_clickArea__]'), /*live || archive*/
    getBoard: () => document.querySelector('[class^=CommentViewer_commentList__] > div:nth-child(1) > div > div') || document.querySelector("div[class^='style_commentList__'] > div:nth-child(1) > div > div"), /*live || archive*/
    getCommentIndex: (node) => node.getAttribute("data-index") || getComputedStyle(node).top.slice(0,-2), /*archive || live*/
    getComment: (node) => node.querySelector('[class^=CommentViewer_item_comment__]') || node.querySelector('[class^=style_item_comment__]'), /*live || archive*/
    getCommentText: (comment) => comment.querySelector('span')?.textContent.trim(),
    getCommentImgs: (comment) => comment.querySelectorAll('img'),
    getVideo: () => document.querySelector('video'),
  };
  /* getScreen: 描写エリア(全画面時には下位要素で上書きされるケースに注意)
   * getBoard : コメントエリア、各コメントノードの親(childrenでコメントのノード一覧が取れること)
   * getCommentIndex: コメントが一意に識別できる昇順値
   *   liveの時はdata-index属性
   *   archiveの時は、style top px値 (index属性がないため苦肉の策)
   * getComment: コメントのノード(名前を除いた、テキストまたはスタンプが含まれる親)
   * getCommentText: テキスト
   * getCommentImgs: スタンプ(複数)
   */
  /* 処理本体 */
  var screen, board, video, canvas, context, lines = [], fontsize, scrollCommentsTimer, title = document.title,configEdit = false,commentObserver;
  var viewedIndex = -1; /* 描写済みコメントの記憶用 */
  var core = {
    /* DOMの初期化待ち&ページ変更検知 */
    waitStart() {
      window.setInterval(function () {
        var screen_ = site.getScreen();
        var board_ = site.getBoard();
        var video_ = site.getVideo();
        var title_ = document.title;
        // console.debug('wait comment list...', { screen_, board_, video_ });
        if (screen_ && board_ && video_ && (screen_ != screen || board_ != board || video_ != video || title_ != title || configEdit || canvas.width != screen.offsetWidth)) {
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
      document.querySelector('canvas#' + SCRIPTNAME)?.remove();
      canvas = document.createElement('canvas');
      canvas.id = SCRIPTNAME;
      screen.appendChild(canvas);
      context = canvas.getContext('2d');
      /* メイン処理 */
      core.addStyle();
      core.modify();
      core.listenComments();
      core.scrollComments();
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
              // 全コメントノードが再作成されているので手動で弾く
              const currentIndex = Number(site.getCommentIndex(node));
              if (currentIndex > viewedIndex) {
                // 新しいコメントのみ描写
                core.attachComment(site.getComment(node));
                if (currentIndex == 999 && viewedIndex == -1) {
                  // 1つ目のコメントはdata-indexが999になっていることがある
                  // その時は手動で 0 にする（1つ目が絵文字コメントのときかも）
                  viewedIndex = 0;
                } else {
                  viewedIndex = currentIndex;
                }
              }
            });
          }
        });
      })
      commentObserver.observe(board, { childList: true });
    },
    /* コメントが追加されるたびにスクロールキューに追加 */
    attachComment(comment) {
      let record = {};
      record.text = site.getCommentText(comment);/*流れる文字列*/
      record.img = site.getCommentImgs(comment);/*絵文字*/
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
        for (let i = 0; lines[i]; i++) {
          for (let j = 0; lines[i][j]; j++) {
            if(lines[i][j].text){
              /*視認性を向上させるスクロール文字の縁取りは、幸いにもパフォーマンスにほぼ影響しない*/
              context.strokeText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
              context.fillText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
            } else if (lines[i][j].img && EMOJI) {
              lines[i][j].img.forEach((_, k) => {
                /* k = 何文字目 */
                context.drawImage(
                    lines[i][j].img[k],
                    lines[i][j].left + (k * fontsize * EMOJISIZE), // 1文字分ずつ位置をずらす
                    lines[i][j].top,
                    fontsize * EMOJISIZE,
                    fontsize * EMOJISIZE);
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
      GM_registerMenuCommand("設定", () => GM_config.open());
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
            'label': '絵文字コメントを表示する',
            'type': 'checkbox',
            'default': EMOJI
          },
          'EMOJISIZE': {
            'label': '絵文字の大きさ',
            'type': 'float',
            'default': EMOJISIZE
          },
        },
        'events': {
          'init': () => config_init(),
          'save': () => config_init(),
        },
      });
    }
  };
  core.settings();
  core.waitStart();
})();
