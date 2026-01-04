// ==UserScript==
// @name        YouTube Live Screen Comment Scroller（設定変更非公式版）
// @namespace   knoa.jp
// @description iPad向けに設定のみを変更したものです。
// @include     https://www.youtube.com/watch*
// @version     0.2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/432972/YouTube%20Live%20Screen%20Comment%20Scroller%EF%BC%88%E8%A8%AD%E5%AE%9A%E5%A4%89%E6%9B%B4%E9%9D%9E%E5%85%AC%E5%BC%8F%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/432972/YouTube%20Live%20Screen%20Comment%20Scroller%EF%BC%88%E8%A8%AD%E5%AE%9A%E5%A4%89%E6%9B%B4%E9%9D%9E%E5%85%AC%E5%BC%8F%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

/*
他のページからの遷移では起動しない
スパチャに背景色付けて流したいかも(最上段で最大2倍ゆっくり？)
*/
(function(){
  /* カスタマイズ */
  var SCRIPTNAME = 'ScreenCommentScroller';
  var COLOR = '#ffffff';/*コメント色*/
  var OCOLOR = '#000000';/*コメント縁取り色*/
  var OWIDTH = 1/10;/*コメント縁取りの太さ(比率)*/
  var OPACITY = '1';/*コメントの不透明度*/
  var MAXLINES = 10;/*コメント最大行数*/
  var LINEHEIGHT = 1.2;/*コメント行高さ*/
  var DURATION = 5;/*スクロール秒数*/
  var FPS = 60;/*秒間コマ数*/
  /* サイト定義 */
  var site = {
    getScreen:  function(){return document.querySelector('#player-container')},
    getBoard:   function(){if(document.querySelector('#chatframe')){return document.querySelector('#chatframe').contentWindow.document.querySelector('#item-offset > #items')}},
    getMessage: function(node){return node.querySelector('#message')},
    getPlay:    function(){return document.querySelector('button.ytp-play-button')},
    getVideo:   function(){return document.querySelector('video.video-stream')},
    isPlaying:  function(play){return (play.attributes['aria-label'].value.match(/停止/)!==null)},
  };
  /* 処理本体 */
  let retry = 10;
  var screen, board, play, video, canvas, context, lines = [], fontsize;
  var core = {
    /* 初期化 */
    initialize: function(){
      console.log(SCRIPTNAME, 'initialize...');
      /* 主要要素が取得できるまで読み込み待ち */
      screen = site.getScreen();
      board = site.getBoard();
      play = site.getPlay();
      video = site.getVideo();
      //console.log(SCRIPTNAME, screen, board, play, video);
      if(!screen || !board || !play || !video){
        window.setTimeout(function(){
          if(retry--) core.initialize();
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
      /**/
      window.addEventListener('popstate', function(){
        core.initialize();
      });
      document.body.addEventListener('DOMAttrModified', function(){
        if(video.src == site.getVideo().src) return;
        core.initialize();
      });
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
    /* スタイル付与 */
    addStyle: function(){
      //console.log(SCRIPTNAME, 'addStyle...');
      let head = document.getElementsByTagName('head')[0];
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
      //console.log(SCRIPTNAME, 'listenComments...', board);
      observe(board, function(records){
        records.forEach(record => {
          record.addedNodes.forEach(node => {
            let message = site.getMessage(node);
            if(message === null) return;
            core.modify();
            core.attachComment(message);
          });
        });
      });
    },
    /* コメントが追加されるたびにスクロールキューに追加 */
    attachComment: function(comment){
      //console.log(SCRIPTNAME, 'attachComment...', comment);
      let record = {};
      record.text = comment.textContent.replace(/[\r\n]/g, '');/*流れる文字列*/
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
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false, subtree: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  core.initialize();
})();