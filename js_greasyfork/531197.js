// ==UserScript==
// @name        Comment Scroller Revised Version
// @namespace   kene
// @description OPENREC.tv KICK のコメントをニコニコ風にスクロールさせます。
// @match     https://www.openrec.tv/live/*
// @match     https://kick.com/*
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/531197/Comment%20Scroller%20Revised%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/531197/Comment%20Scroller%20Revised%20Version.meta.js
// ==/UserScript==

(function(){
  /* カスタマイズ */
  var SCRIPTNAME = 'ScreenCommentScrollerRevisedVersion';
  var COLOR = '#ffffff';/*コメント色*/
  var OCOLOR = '#000000';/*コメント縁取り色*/
  var OWIDTH = 1/10;/*コメント縁取りの太さ(比率)*/
  var OPACITY = '0.50';/*コメントの不透明度*/
  var MAXLINES = 15;/*コメント最大行数*/
  var LINEHEIGHT = 1.4;/*コメント行高さ*/
  var DURATION = 5;/*スクロール秒数*/
  var FPS = 60;/*秒間コマ数*/

  /* サイト定義 */
  var url = window.location.href;
  var screen_query = '';
  var board_query = "";
  var chat_query = "";
  if ( url.match(new RegExp(/www.openrec.tv/)) != null ) {
    /* OPENREC */
    screen_query = '.video-player-wrapper';
    board_query = '.chat-list-content';
    chat_query = '.chat-content';
  } else if ( url.match(new RegExp(/kick.com/)) != null ) {
    /* KICK */
    screen_query = '#injected-embedded-channel-player-video';
    board_query = '#chatroom-messages div:first-child';
    chat_query = 'span:last-child';
  } else {
    /* 未対応サイト */
    return;
  }

  /* 処理本体 */
  var screen, board, canvas, context, lines = [], fontsize, mo;
  var core = {
    /* 初期化 */
    initialize: function(){
      console.log(SCRIPTNAME, 'initialize...');
      /* 主要要素が取得できるまで読み込み待ち */
      screen = document.querySelector(screen_query)
      board = document.querySelector(board_query);
      if(!screen || !board){
        window.setTimeout(function(){
          core.initialize();
        }, 1000);
        return;
      }
      /* コメントをスクロールさせるCanvasの設置 */
      /* (描画処理の軽さは HTML5 Canvas, CSS Position Left, CSS Transition の順) */
      canvas = document.createElement('canvas');
      canvas.id = SCRIPTNAME;
      screen.appendChild(canvas);
      context = canvas.getContext('2d');
      /* メイン処理 */
      core.addStyle();
      core.listenComments();
      core.scrollComments();
    },
    /* *スクリーンサイズに変化があればcanvasも変化させる* */
    modify: function(){
      if(canvas.width == screen.offsetWidth) return;
      canvas.width = screen.offsetWidth;
      canvas.height = screen.offsetHeight;
      fontsize = (canvas.height / MAXLINES) / LINEHEIGHT;
      context.font = 'bold ' + (fontsize) + 'px sans-serif';
      context.fillStyle = COLOR;
      context.strokeStyle = OCOLOR;
      context.lineWidth = fontsize * OWIDTH;
    },
    /* スタイル付与 */
    addStyle: function(){
      let head = document.getElementsByTagName('head') [0];
      if (!head) return;
      let style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = ''+
        'canvas#'+SCRIPTNAME+'{' +
        ' pointer-events: none;' +
        ' position: absolute;' +
        ' top: 0;' +
        ' left: 0;' +
        ' width: 100%;' +
        ' height: 100%;' +
        ' opacity: '+OPACITY+';' +
        ' z-index: 99999;' +
        '}'+
        '';
      head.appendChild(style);
    },
    /* コメントの新規追加を見守る */
    listenComments: function(){
      mo = new MutationObserver(function(mutationRecords){
        core.modify();
        mutationRecords.forEach((mutation) => {
          if ( mutation.type != "childList" ) {
              return;
          }
          mutation.addedNodes.forEach( el => {
            var parser = new DOMParser();
            var dom = parser.parseFromString(el.innerHTML, "text/html");
            core.attachComment(dom.querySelector(chat_query));
          });
        });
      });
      mo.observe(board,{childList: true});
    },
    /* コメントが追加されるたびにスクロールキューに追加 */
    attachComment: function(comment){
      if(comment==null) {
         return;
      }
      let record = {};
      record.text = comment.textContent;/*流れる文字列*/
      record.width = context.measureText(record.text).width;/*文字列の幅*/
      record.life = DURATION * FPS;/*文字列が消えるまでのコマ数*/
      record.left = canvas.width;/*左端からの距離*/
      record.delta = (canvas.width + record.width) / (record.life);/*コマあたり移動距離*/
      record.reveal = record.width / record.delta;/*文字列が右端から抜けてあらわになるまでのコマ数*/
      record.touch = canvas.width / record.delta;/*文字列が左端に触れるまでのコマ数*/
      /* 追加されたコメントをどの行に流すかを決定する */
      for(let i=0; i<MAXLINES; i++){
        let length = lines[i] ? lines[i].length : 0;/*同じ行に詰め込まれているコメント数*/
        switch(true){
          /* 行が空いていれば追加 */
          case(lines[i] == undefined || !length):
            lines[i] = [];
          /* 以前のコメントより長い(速い)文字列なら、左端に到達する時間で判断する */
          /* fallthrough */
          case(lines[i][length - 1].reveal < 0 && lines[i][length - 1].delta > record.delta):
          /* 以前のコメントより短い(遅い)文字列なら、右端から姿を見せる時間で判断する */
          /* fallthrough */
          case(lines[i][length - 1].life < record.touch && lines[i][length - 1].delta < record.delta):
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
    scrollComments: function(){
      window.setInterval(function(){
        /* boardが消失してしまう問題への対処 */
        if(document.contains(board) == false) {
            console.log("board is missing");
            board = document.querySelector(board_query);
            if(board) {
                console.log("board is found");
                mo.observe(board,{childList: true});
            }
        }
        /* Canvas描画 */
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(let i=0; lines[i]; i++){
          for(let j=0; lines[i][j]; j++){
            /*視認性を向上させるスクロール文字の縁取りは、幸いにもパフォーマンスにほぼ影響しない*/
            context.strokeText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
            context.fillText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
            lines[i][j].life--;
            lines[i][j].reveal--;
            lines[i][j].touch--;
            lines[i][j].left -= lines[i][j].delta;
          }
          if(lines[i][0] && lines[i][0].life == 0){
            lines[i].shift();
          }
        }
      }, 1000/FPS);
    },
  };
  core.initialize();
})();