// ==UserScript==
// @name        ShogiPremium Screen Comment Scroller
// @namespace   knoa.jp
// @description 将棋プレミアムのコメントをニコニコ風にスクロールさせます。
// @include     http://www.igoshogi.net/shogipremium/live/*
// @version     0.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31996/ShogiPremium%20Screen%20Comment%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/31996/ShogiPremium%20Screen%20Comment%20Scroller.meta.js
// ==/UserScript==

(function(){
  /* カスタマイズ */
  var SCRIPTNAME = 'ScreenCommentScroller';
  var COLOR = '#ffffff';/*コメント色*/
  var OCOLOR = '#000000';/*コメント縁取り色*/
  var OWIDTH = 1/20;/*コメント縁取りの太さ(比率)*/
  var OPACITY = '0.5';/*コメントの不透明度*/
  var MAXLINES = 10;/*コメント最大行数*/
  var LINEHEIGHT = 1.2;/*コメント行高さ*/
  var DURATION = 5;/*スクロール秒数*/
  var FPS = 60;/*秒間コマ数*/
  /* サイト定義 */
  var site = {
    getScreen:   function(){return document.querySelector('div.video_container')},
    getBoard:    function(){return document.querySelector('#auto_scroll')},
    getComments: function(node){return node.querySelectorAll('span.text')},
    getPlay:     function(){return true},
    isPlaying:   function(play){return true},
  };
  /* 処理本体 */
  var screen, board, play, video, canvas, context, lines = [], fontsize;
  var core = {
    /* 初期化 */
    initialize: function(){
      console.log(SCRIPTNAME, 'initialize...');
      /* 主要要素が取得できるまで読み込み待ち */
      screen = site.getScreen();
      board = site.getBoard();
      play = site.getPlay();
      if(!screen || !board || !play){
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
      core.listenComments();
      core.scrollComments();
    },
    /* *スクリーンサイズに変化があればcanvasも変化させる* */
    modify: function(){
      if(canvas.width == screen.offsetWidth) return;
      //console.log(SCRIPTNAME, 'modify...');
      canvas.width = screen.offsetWidth;
      canvas.height = screen.offsetHeight;
      fontsize = (canvas.height / MAXLINES) / LINEHEIGHT;
      context.font = 'bold ' + (fontsize) + 'px sans-serif';
      context.fillStyle = COLOR;
      context.strokeStyle = OCOLOR;
      context.lineWidth = fontsize * OWIDTH;
    },
    /* コメントの新規追加を見守る */
    listenComments: function(){
      //console.log(SCRIPTNAME, 'listenComments...');
      board.addEventListener('DOMNodeInserted', function(e){
        let comments = site.getComments(e.target);
        if(!comments || !comments.length) return;
        core.modify();
        for(let i=0; comments[i]; i++){
          core.attachComment(comments[i]);
        }
      });
    },
    /* コメントが追加されるたびにスクロールキューに追加 */
    attachComment: function(comment){
      //console.log(SCRIPTNAME, 'attachComment...');
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
          case(lines[i][length - 1].reveal < 0 && lines[i][length - 1].delta > record.delta):
          /* 以前のコメントより短い(遅い)文字列なら、右端から姿を見せる時間で判断する */
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
      //console.log(SCRIPTNAME, 'scrollComment...');
      var interval = window.setInterval(function(){
        /* 再生中じゃなければ処理しない */
        if(!site.isPlaying(play)) return;
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
  (function(css){
    let style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    document.head.appendChild(style);
  })(`
    canvas#${SCRIPTNAME}{
      pointer-events: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: ${OPACITY};
      z-index: 99999;
    }
    .video_container,
    #StrobeMediaPlayback{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    }
    div.smp_head{
      display: none;
    }
  `);
  core.initialize();
})();