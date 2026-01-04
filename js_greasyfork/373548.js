// ==UserScript==
// @name        Niconico My Theater
// @namespace   knoa.jp
// @description 自分のPC内の動画ファイルと差し替えてニコニコできます。
// @include     https://www.nicovideo.jp/watch/*
// @version     1.1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373548/Niconico%20My%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/373548/Niconico%20My%20Theater.meta.js
// ==/UserScript==

(function(){
  const SCRIPTNAME = 'NiconicoMyTheater';
  const DEBUG = false;/*
[update] 1.1.1.1
動作確認。

*

機能:
ニコニコに投稿された動画を、自分のPC内の動画ファイルに差し替えてニコニコできます。
<kbd>[Shift+左右]</kbd> で1秒送りなど、快適なコメント投稿のためのショートカットキーを追加します。※
フルスクリーン時は、コメント欄にフォーカスしていても、しばらく操作がなければコントローラを消します。※
※いずれも、動画ファイルを差し替えなくても有効です。

動画の差し替え方:
ブラウザで再生できる動画ファイル(.mp4, .m4v など)をご用意ください。
動画プレイヤーの設定ボタン(歯車)の左隣に、ファイルと差し替えるボタンが現れます。
再生時刻が元の動画とズレている場合は、秒単位でプラスマイナス調整できます。

追加のショートカットキー:
<kbd>[Enter]</kbd>: 再生停止(フォーカスはコメント欄へ)
<kbd>[左右]</kbd>: 10秒移動(空欄ならコメント欄でも機能します)
<kbd>[Shift+左右]</kbd>: 1秒移動(空欄ならコメント欄でも機能します)
<kbd>[再生時刻クリック]</kbd>: 指定時刻にジャンプ
# <a href="https://qa.nicovideo.jp/faq/show/287">ニコニコ標準のショートカットキー</a>

おすすめの楽しみ方:
1. 再生したままコメントするスタイル: コメ欄フォーカスのまま視聴中、フルスクリーン時はしばらくするとコメ欄は邪魔にならないように消えるが、入力開始すると自動でコメ欄が表示され、<kbd>[Enter]</kbd> で送信、またしばらくするとコメ欄は消える。
2. 毎回停止してコメントするスタイル: 視聴中に <kbd>Enter</kbd> で停止してコメ欄フォーカス、 <kbd>[左右]</kbd> や <kbd>[Shift+左右]</kbd> で時刻を微調整でき、コメ入力して <kbd>[Enter]</kbd> で送信すると、再生が再開される。
3. 自分の感想をまとめてから一括して投稿するスタイル: <a href="https://gist.github.com/knoajp/18bfcb34076910bbec9a359614c89ad8">ニコニコ動画のコメントをまとめて投稿するブックマークレット</a> をご活用ください。
# <a href="https://dic.nicovideo.jp/a/szbh%E6%96%B9%E5%BC%8F">SZBH方式とは (エスゼットビーエイチホウシキとは) [単語記事] - ニコニコ大百科</a>

動作確認:
Windows/MacのChromeで確認しています。
一部のブラウザでは動作が重い場合があるようです。

*

[possible to do]
ZenzaWatch対応。
ローディング表示
置き換え完了時に何かリアクションを。
元の動画に戻すボタンで確認してから戻せるように。
ニコニコの時刻表示に時間単位追加
コメント投稿時の自動再生再開はオンオフ可能に。

[bug]
Firefoxのblob処理が重いのかどうか？
*/
  if(window === top && console.time) console.time(SCRIPTNAME);
  const SHORTSHIFT = 1;// Shift + 左右キーで移動する(秒)
  const CONTROLLER_HIDE = 4000;// コントローラを自動で隠すまでの時間
  let site = {
    get: {
      originalVideo: () => $('#VideoPlayer video[src]'),//元の動画
      controllerBoxContainer: () => $('.ControllerBoxContainer'),//コントローラー
      playerPlayButton: () => $('.PlayerPlayButton'),//再生
      playerPauseButton: () => $('.PlayerPauseButton'),//停止
      seekToHeadButton: () => $('.SeekToHeadButton'),//動画の先頭へ戻る
      playerSeekBackwardButton: () => $('.PlayerSeekBackwardButton'),//10秒戻る
      playerPlayTime: () => $('.PlayerPlayTime'),//時刻表示
      playtime: () => $('.PlayerPlayTime-playtime'),//現在時刻
      playerSeekForwardButton: () => $('.PlayerSeekForwardButton'),//10秒進む
      playerOptionButton: () => $('button[data-title="設定"]'),//設定
      commentInputTextarea: () => $('.CommentInput-textarea'),//コメント入力欄
      commentPostButton: () => $('.CommentPostButton'),//コメントする
      fixedFullscreen : () => $('#fixedFullscreen'),//コントローラーを常に表示する
      footerContainerLinks: () => $('.FooterContainer-links'),//動画ファイルアイコン提供元へのリンクを挿入するフッタ箇所
    },
  };
  let originalVideo, replacedVideo, controller, ajustmentTime = 0, startTimer, hiddenTimer;
  let core = {
    initialize: function(){
      core.addFileButton();
      core.getOriginalVideo();
      core.listenEvents();
      core.addJumpButton();
      core.addFooter();
      core.addStyle();
    },
    addFileButton: function(){
      let playerOptionButton = site.get.playerOptionButton();
      if(!playerOptionButton) return setTimeout(core.addFileButton, 1000);
      let fileButton = createElement(core.html.fileButton());
      let input = fileButton.querySelector('input[type="file"]');
      fileButton.addEventListener('click', function(e){
        input.click();
      });
      // ファイルを差し替えたときの処理
      input.addEventListener('change', function(e){
        log('changed!');
        core.linkVideos(URL.createObjectURL(input.files[0]));
        core.addAjustmentInput();
      });
      playerOptionButton.parentNode.insertBefore(fileButton, playerOptionButton);
    },
    addAjustmentInput: function(){
      if($(`#${SCRIPTNAME}-ajustment`)) return;
      let playerPlayTime = site.get.playerPlayTime();
      if(!playerPlayTime) return setTimeout(core.addAjustmentInput, 1000);
      let ajustment = createElement(core.html.ajustment());
      let input = ajustment.querySelector('input');
      // 調整値を変えたときの処理
      input.addEventListener('change', function(e){
        ajustmentTime = parseInt(input.value);
        core.syncVideos();
      });
      playerPlayTime.appendChild(ajustment);
    },
    getOriginalVideo: function(){
      originalVideo = site.get.originalVideo();
      if(!originalVideo) return setTimeout(core.getOriginalVideo, 1000);
      core.observeOriginalVideo();
    },
    observeOriginalVideo: function(){
      let observer = observe(originalVideo, function(records){
        if(!replacedVideo) return;
        if(!records.some((r) => r.attributeName === 'src')) return;
        replacedVideo.parentNode.removeChild(replacedVideo);
        replacedVideo.classList.remove('loaded');
        replacedVideo.src = '';
      }, {attributes: true});
    },
    linkVideos: function(object){
      // リプレイスビデオ要素の準備
      replacedVideo = replacedVideo || createElement(core.html.replacedVideo());
      replacedVideo.src = object;
      replacedVideo.classList.add('loaded');
      originalVideo.parentNode.insertBefore(replacedVideo, originalVideo);
      // 連動
      originalVideo.addEventListener('play', function(e){
        log('originalVideo: play!');
        core.syncVideos();
      });
      originalVideo.addEventListener('pause', function(e){
        log('originalVideo: pause!');
        core.syncVideos();
      });
      originalVideo.addEventListener('seeking', function(e){
        log('originalVideo: seeking!');
        core.syncVideos();
      });
      originalVideo.addEventListener('canplay', function(e){
        log('originalVideo: canplay!');
        core.syncVideos();
      });
      originalVideo.addEventListener('volumechange', function(e){
        replacedVideo.volume = originalVideo.volume;
      });
      // 連動(?)
      replacedVideo.addEventListener('seeking', function(e){
        log('replacedVideo: seeking!');
      });
      replacedVideo.addEventListener('canplay', function(e){
        log('replacedVideo: canplay!');
      });
      // オリジナルビデオの状態をコピー
      replacedVideo.currentTime = originalVideo.currentTime - ajustmentTime;
      replacedVideo.playbackRate = originalVideo.playbackRate;
      replacedVideo.volume = originalVideo.volume;
      // オリジナルビデオは影の存在となる
      originalVideo.style.visibility = 'hidden';//displayは上書きされる
      originalVideo.muted = true;
    },
    syncVideos: function(){
      let currentTime = originalVideo.currentTime - ajustmentTime;
      clearTimeout(startTimer);
      if(currentTime < 0){
        replacedVideo.pause();
        startTimer = setTimeout(function(){replacedVideo.play()}, - currentTime * 1000);
      }else{
        originalVideo.paused ? replacedVideo.pause() : replacedVideo.play();
      }
      replacedVideo.playbackRate = originalVideo.playbackRate;
      replacedVideo.currentTime = currentTime;
    },
    listenEvents: function(){
      // コントローラの初期状態は表示
      controller = site.get.controllerBoxContainer();
      controller.dataset.hidden = 'false';
      let throttling;
      window.addEventListener('mousemove', function(e){
        if(throttling) return;
        throttling = setTimeout(function(){throttling = 0}, 100);
        core.showController();
      }, true);
      window.addEventListener('keydown', function(e){
        core.showController();
        let activeElement = document.activeElement, textExists = core.textExists();
        switch(true){
          // Shift以外の修飾キーが押されていれば無視する
          case(e.altKey || e.ctrlKey || e.metaKey): return;
          // 日本語入力変換中なら無視する
          case(e.isComposing): return;
          // 文字入力中ならデフォルトのカーソル移動を邪魔しない
          case(e.key === 'ArrowLeft' && textExists): return;
          case(e.key === 'ArrowRight' && textExists): return;
          // コマンドとコメント以外の入力欄では無視する
          case(['input', 'textarea'].includes(activeElement.localName)
            && !['CommentCommandInput', 'CommentInput-textarea'].some((c) => activeElement.classList.contains(c))): return;
          // Enter: 再生停止(フォーカスはコメント欄へ)
          case(e.key === 'Enter'):
            let textarea = site.get.commentInputTextarea();
            // コメント投稿
            if(activeElement === textarea && textExists){
              site.get.commentPostButton().click();
              if(originalVideo.paused) site.get.playerPlayButton().click();//停止中なら再生
            }
            // コメント投稿でなければ停止もする
            else{
              if(originalVideo.paused) site.get.playerPlayButton().click();//停止中なら再生
              else site.get.playerPauseButton().click();//再生中なら停止
            }
            textarea.focus();
            break;
          // Shift+←: 1秒戻る
          case(e.key === 'ArrowLeft' && e.shiftKey):
            // 単純に減らすだけだとプレイヤの時刻が連動しない仕様のようなので、標準の10秒戻るを併用する。
            let playtime = site.get.playtime();
            site.get.playerSeekBackwardButton().click();
            requestAnimationFrame(function(){
              originalVideo.currentTime-= SHORTSHIFT;
              originalVideo.currentTime+= 10;
            });
            activeElement.focus();//フォーカスを戻す
            break;
          // Shift+→: 1秒進む
          case(e.key === 'ArrowRight' && e.shiftKey):
            // 増加はふつうに連動してくれる。
            originalVideo.currentTime+= SHORTSHIFT;
            break;
          // ←: 10秒戻る
          case(e.key === 'ArrowLeft'):
            site.get.playerSeekBackwardButton().click();
            activeElement.focus();//フォーカスを戻す
            break;
          // →: 10秒進む
          case(e.key === 'ArrowRight'):
            site.get.playerSeekForwardButton().click();
            activeElement.focus();//フォーカスを戻す
            break;
          default:
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        core.syncVideos();
      }, true);
    },
    addJumpButton: function(){
      let playtime = site.get.playtime();
      if(!playtime) return setTimeout(core.addJumpButton, 1000);
      playtime.dataset.title = '指定時刻にジャンプ';
      playtime.addEventListener('click', function(e){
        let time = prompt('指定時刻にジャンプ:', playtime.textContent);
        if(time && time.match(/^[0-9:.]+$/)){
          site.get.seekToHeadButton().click();
          requestAnimationFrame(function(){
            let t = time.split(':'), s = 1, m = 60*s, h = 60*m;
            switch(t.length){
              case(3): return core.jumpTo(t[0]*h + t[1]*m + t[2]*s);
              case(2): return core.jumpTo(t[0]*m + t[1]*s);
              case(1): return core.jumpTo(t[0]*s);
            }
          });
        }
      }, true);
    },
    jumpTo: function(time){
      originalVideo.currentTime = time;
    },
    showController: function(){
      clearTimeout(hiddenTimer);
      let fixedFullscreen = site.get.fixedFullscreen();
      if(fixedFullscreen && fixedFullscreen.checked === true) return;
      controller.dataset.hidden = 'false';
      hiddenTimer = setTimeout(function(){
        if(core.textExists()) return;//文字入力中なら消さない
        controller.dataset.hidden = 'true';
      }, CONTROLLER_HIDE);
    },
    textExists: function(){
      return document.activeElement.value && document.activeElement.value.length > 0;
    },
    addFooter: function(){
      let footerContainerLinks = site.get.footerContainerLinks();
      if(!footerContainerLinks) return setTimeout(core.addFooter, 1000);
      footerContainerLinks.appendChild(createElement(core.html.footer()));
    },
    addStyle: function(){
      let style = createElement(core.html.style());
      document.head.appendChild(style);
    },
    html: {
      fileButton: () => `
        <button class="ActionButton ControllerButton FileButton" type="button" data-title="ファイルに差し替える">
          <div class="ControllerButton-inner">
            <!-- https://www.onlinewebfonts.com/icon/112309 -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" enable-background="new 0 0 1000 1000" viewBox="0 0 1000 1000" xml:space="preserve">
              <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
              <g><path d="M581.7,10H132.5v980h735V295.8L581.7,10z M785.8,908.3H214.2V91.7h374.5l197.1,197.1V908.3z"></path><path d="M540.8,10v326.7h326.7L540.8,10z"></path><path d="M377.5,418.3V745l285.8-163.3L377.5,418.3z"></path></g>
            </svg>
          </div>
          <input type="file" id="${SCRIPTNAME}-file">
        </button>
      `,
      ajustment: () => `
        <span data-title="差し替えファイルの再生時刻を調整する">+<input type="number" id="${SCRIPTNAME}-ajustment" value="0"></span>
      `,
      replacedVideo: () => `
        <video preload="auto" id="${SCRIPTNAME}-replaced" ${DEBUG ? 'controls' : ''}>
      `,
      footer: () => `
        <li><a href="http://www.onlinewebfonts.com">oNline Web Fonts</a></li>
      `,
      style: () => `
        <style type="text/css">
          /* 中身を改変するので */
          .PlayerPlayTime{
            width: auto;
            pointer-events: auto;
          }
          /* 追加UI */
          input#${SCRIPTNAME}-file{
            display: none;
          }
          input#${SCRIPTNAME}-ajustment{
            width: 3em;
            height: 1.5em;
          }
          /* 差し替え動画 */
          video#${SCRIPTNAME}-replaced{
            transition: opacity .5s;
            opacity: 0;
            z-index: 100;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            display: block;
          }
          video#${SCRIPTNAME}-replaced.loaded{
            opacity: 1;
          }
          /* 指定時刻にジャンプ */
          .PlayerPlayTime-playtime{
            transition: color 250ms;
            cursor: pointer;
          }
          .PlayerPlayTime-playtime:hover{
            color: #007cff;
          }
          /* コントローラはしばらく経つと消えるように */
          .ControllerBoxContainer.is-fullscreen:not(.is-fixedFullscreenController){
            transition: opacity 500ms ease !important;
            opacity: 1;
          }
          .ControllerBoxContainer.is-fullscreen[data-hidden="true"]:not(.is-fixedFullscreenController){
            opacity: 0;
          }
        </style>
      `,
    },
  };
  let $ = function(s){return document.querySelector(s)};
  let $$ = function(s){return document.querySelectorAll(s)};
  let observe = function(element, callback, options = {childList: true, attributes: false, characterData: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  let createElement = function(html){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  let log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let stack = new Error().stack, callers = stack.match(/^([^/<]+(?=<?@))/gm) || stack.match(/[^. ]+(?= \(<anonymous)/gm) || [];
    console.log(
      SCRIPTNAME + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + stack.match(/:[0-9]+:[0-9]+/g)[1].split(':')[1],/*LINE*/
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '')  + '()',
      ...arguments
    );
  };
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();