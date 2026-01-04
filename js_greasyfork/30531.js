// ==UserScript==
// @name        AbemaTV Screen Comment Scroller
// @namespace   knoa.jp
// @description AbemaTV のコメントをニコニコ風にスクロールさせます。
// @include     https://abema.tv/*
// @version     2.15.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30531/AbemaTV%20Screen%20Comment%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/30531/AbemaTV%20Screen%20Comment%20Scroller.meta.js
// ==/UserScript==

// console.log('AbemaTV? => hireMe()');
(function(){
  const SCRIPTNAME = 'ScreenCommentScroller';
  const DEBUG = false;/*
[update] 2.15.3
映像の背景色を黒(#000000)に。Chromeでのフルスクリーンバグを解消。

[bug]
[i]のときコメと視聴数

[to do]
windowフォーカス時にコメント欄フォーカスならハイライトしてあげる
マウスオーバー時の透過率設定
  Command+ホイールでコメント透明度はどうじゃろ？
  [1]-[0]で透明度はやるか
マウスオーバー時の透過率変化に対応する？
タイムシフトでのコメント対応(プレミアム限定？)
ビデオでもナビゲーションの透明化対応？
[i]の透明度は映像にコメ一覧を重ねない場合もっと濃くてもいい。重ねる場合もかな？
VideoAssistantとの統合？
NG設定ラベル [お試し] => [注目]

[to research]
投稿直後に出てしまう新着コメントボタンは1秒後に閉じてもいいよね
ブロックやNGでのコメント一覧スクロール位置
コメントが大量で一斉に流れてしまうときに、空白時間にもコメをばらけさせる?
まれにコメント取得できずにローディングが続くバグが(どこかでループしてる？)
気軽な「阿久津」「あっくん」のハイライトができるUXを
自分の投稿コメ+隣接1コメが一覧最上部に居残り続ける問題。
  タブ切り替えた瞬間に緑コメとして現れる。
  タブ切り替えで一瞬現れる。削除対象から漏れてずっと放置されている風。
  visibilitychangeの処理を再検証か。
  500と関係ある...？
  display:noneか何かでお茶を濁せないか

[possible]
NGワードの最終ヒット日時の記録(viaニコニコ)
ユーザーブロックアイコン(秒数と差し替わる)のアニメーション
ピクチャインピクチャはアベマが公式にやるべきだろうけど、やらないままブラウザが任意要素に対応したら実装しようか

[requests]
設定のナビゲーションに「マウスを近づけたら表示する」
設定のスクロールコメントに「画面下部の専用領域に流す」「高さ(%)」
設定の一覧コメントに「コメントをひとつずつ表示する」
一覧コメントの横幅「%」以外も指定可能に

[not to do]
Safari音量ボタンうわずってる件
4:3対応(左右黒帯の 16:9 video。videoの内容はDRM制限で取得できない番組あり。サムネイルの内容はcrossoriginで取得できない)
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const CONFIGS = {
    /* スクロールコメント */
    maxlines:        {TYPE: 'int',    DEFAULT:   10},/*最大行数(文字サイズ連動)*/
    linemargin:      {TYPE: 'float',  DEFAULT: 0.20},/*行間(比率)*/
    transparency:    {TYPE: 'float',  DEFAULT: 75.0},/*透明度(%)*/
    owidth:          {TYPE: 'float',  DEFAULT: 0.10},/*縁取りの太さ(比率)*/
    duration:        {TYPE: 'float',  DEFAULT: 5.00},/*横断にかける秒数*/
    maxcomments:     {TYPE: 'int',    DEFAULT:   50},/*最大同時表示数*/
    font:            {TYPE: 'string', DEFAULT: ''  },/*フォント指定*/
    /* 一覧コメント */
    l_hide:          {TYPE: 'bool',   DEFAULT: 0   },/*操作していない時は画面外に隠す*/
    l_overlay:       {TYPE: 'bool',   DEFAULT: 0   },/*透過して映像に重ねて配置する*/
    lc_transparency: {TYPE: 'float',  DEFAULT:  0.0},/*文字の透明度(%)*/
    lb_transparency: {TYPE: 'float',  DEFAULT: 50.0},/*背景の透明度(%)*/
    l_width:         {TYPE: 'float',  DEFAULT: 16.5},/*横幅(%)*/
    lc_maxlines:     {TYPE: 'int',    DEFAULT:   30},/*最大行数(文字サイズ連動)*/
    lc_linemargin:   {TYPE: 'float',  DEFAULT: 0.50},/*改行されたコメントの行間(比率)*/
    lc_margin:       {TYPE: 'float',  DEFAULT: 1.50},/*コメント同士の間隔(比率)*/
    l_showtime:      {TYPE: 'bool',   DEFAULT: 1   },/*投稿時刻を表示する*/
    /* アベマのナビゲーション */
    n_clickonly:     {TYPE: 'bool',   DEFAULT: 0   },/*画面クリック時のみ表示する*/
    n_delay:         {TYPE: 'float',  DEFAULT: 4.00},/*隠れるまでの時間(秒)*/
    n_transparency:  {TYPE: 'float',  DEFAULT: 50.0},/*透明度(%)*/
  };
  const AINTERVAL = 7000;/*AbemaTVのコメント取得間隔の基本値(ms)*/
  const STATSUPDATE = 60*1000;/*視聴数とコメント数を更新する間隔(ms)*/
  const FONT = 'Arial, sans-serif';/*スクロールフォント*/
  const BASELINE = 85/100;/*フォントのbaseline比率*/
  const MARGIN = 2/10;/*通常のフォントサイズを飛び出す xgÅ(永◆∬∫√￣ などの文字を確実に収めるための余裕(比率)*/
  const EASING = 'cubic-bezier(0,.75,.5,1)';/*主にナビゲーションのアニメーション用*/
  /* サイト定義 */
  let retry = 10;/*必要な要素が見つからずあきらめるまでの試行回数*/
  let site = {
    targets: [
      /* 構造 */
      function header(){let header = $('body > div > div > header'); return (header) ? site.use(header) : false;},
      function footer(){let tvFooter = $('.com-tv-TVFooter'); return (tvFooter) ? site.use(tvFooter.parentNode) : false;},
      function board(){let board = $('[class*="OnReachTop"]'); return (board) ? site.use(board) : false;},
      function parent(){let parent = $('main > div > div > div'); return (parent) ? site.use(parent) : false;},
      function screen(){let videoContainer = $('.com-a-Video__container'); return (videoContainer) ? site.use(videoContainer.parentNode.parentNode.parentNode) : false;},
      /* ペイン */
      function commentPane(){let form = $('form:not([role="search"])'); return (form) ? site.use(form.parentNode.parentNode) : false;},
      function channelPane(){let container = $('[class*="-tv-VChannelList__container"]'); return (container) ? site.use(container.parentNode) : false;},
      function programPane(){let container = $('[class*="-tv-VChannelList__container"]'); return (container) ? site.use(container.parentNode.nextElementSibling) : false;},
      /* ボタン */
      function controller(){let controller = $('.com-tv-TVController'); return (controller) ? site.use(controller) : false;},
      function channelButtons(){let button = $('button[aria-label="放送中の裏番組"]'); return (button) ? site.use(button.parentNode.parentNode) : false;},
      function channelButton(){let button = $('button[aria-label="放送中の裏番組"]'); return (button) ? site.use(button) : false;},
      function commentButton(){let svg = $('use[*|href^="/images/icons/comment.svg"]'); return (svg) ? site.use(svg.parentNode.parentNode) : false;},
      function programButton(){let programButton = $('.com-tv-TVFooter__footer-left'); return (programButton) ? site.use(programButton) : false;},
      function fullscreenButton(){let fullscreen = $('button[aria-label^="フルスクリーン"]'); return (fullscreen) ? site.use(fullscreen) : false;},
      function VolumeController(){let mute = $('button[aria-label^="音声"]'); return (mute) ? site.use(mute.parentNode.parentNode) : false;},
      /* 要素 */
      function enquete(){let container = $('[class*="-tv-VChannelList__container"]'); return (container) ? site.use(container.parentNode.nextElementSibling.nextElementSibling) : false;},
      function caution(){let header = $('header'); return (header) ? site.use(header.nextElementSibling) : false;},
      function commentForm(){let form = $('form:not([role="search"])'); return (form) ? site.use(form) : false;},
      function commentFormTextarea(){let textarea = $('form:not([role="search"]) textarea'); return (textarea) ? site.use(textarea) : false;},
      function viewCounter(){let viewCounter = $('.com-tv-TVViewCounter'); return (viewCounter) ? site.use(viewCounter) : false;},
      function programName(){let programName = $('.com-m-TextIcon--dark'); return (programName) ? site.use(programName) : false;},
      function fullscreenElement(){let videoContainer = $('.com-a-Video__container'); return (videoContainer) ? site.use(videoContainer.parentNode) : false;},
    ],
    addedNode: {
      newCommentsButton: function(node){let button = node.parentNode.querySelector('[data-selector="commentPane"] > div > button'); return (button) ? site.use(node, 'newCommentsButton') : false;},
      comment: function(node){let time = node.querySelector('time'); return (time) ? site.use(node, 'comment') : false;},
    },
    timeshiftTargets: [
      /* 構造 */
      function header(){let header = $('body > div > div > header'); return (header) ? site.use(header) : false;},
      function board(){let board = $('.c-archive-comment-ArchiveCommentContainerView__list-wrapper'); return (board) ? site.use(board) : false;},
      function parent(){let parent = $('.c-tv-TimeshiftSlotContainerView-player'); return (parent) ? site.use(parent) : false;},
      function screen(){let screen = $('.c-tv-SlotPlayerContainer-screen'); return (screen) ? site.use(screen) : false;},
      /* ペイン */
      function commentPane(){let pane = $('.c-tv-SlotPlayerContainer__comment-wrapper'); return (pane) ? site.use(pane) : false;},
      /* ボタン */
      function commentButton(){let button = $('.c-tv-SlotPlayerContainer-comment-button button'); return (button) ? site.use(button) : false;},
    ],
    timeshiftAddedNode: {
      commentContainer: function(node){let commentContainer = node.parentNode.querySelector('.com-a-OnReachTop'); return (commentContainer) ? site.use(commentContainer, 'commentContainer') : false;},
      comment: function(node){let message = node.querySelector(':scope > div > p.com-archive-comment-ArchiveCommentItem__message'); return (message) ? site.use(node, 'comment') : false;},
    },
    reactPropertyName: '',
    get: {
      reactPropertyName: function(node){return site.reactPropertyName = Object.keys(node).find((key) => key.includes('reactInternalInstance'));},
      commentIsOwner: function(comment){return comment[site.reactPropertyName].return.memoizedProps.comment._isOwner;},
      commentText: function(comment){return comment.firstElementChild.firstElementChild.textContent;},
      commentTime: function(comment){return comment.querySelector('time').dateTime;},
      commentBlock: function(comment){return comment.querySelector('button[title="ブロック"]');},
      commentBlockCancel: function(comment){return comment.nextElementSibling.querySelector('form button');},
      viewCount: function(viewCounter){return viewCounter.querySelector('[data-selector="viewCounter"] > span');},
      commentCount: function(commentButton){return commentButton.querySelector('[data-selector="commentButton"] > span');},
      closer: function(){
        /* チャンネル切り替えごとに差し替わるのでつど取得 */
        let button = $('[data-selector="screen"] > div > div > button');
        return button ? button : log(`Not found: closer`);
      },
      programId: function(){
        /* アベマの仕様に依存しまくり */
        if(!window.dataLayer) return log('No dataLayer.');
        for(let i = window.dataLayer.length - 1; window.dataLayer[i]; i--){
          if(window.dataLayer[i].programId) return window.dataLayer[i].programId;
        }
      },
      thumbImgApi: function(programId, number){
        /* アベマの仕様に依存しまくり */
        const API = 'https://hayabusa.io/abema/programs/{programId}/thumb00{number}.q95.w135.h76.jpg';
        return API.replace('{programId}', site.get.programId).replace('{number}', number);
      },
      statsApi: function(){
        /* アベマの仕様に依存しまくり */
        if(!window.dataLayer) return log('No dataLayer.');
        const API = 'https://api.abema.io/v1/broadcast/slots/{id}/stats';
        for(let i = window.dataLayer.length - 1; window.dataLayer[i]; i--){
          if(window.dataLayer[i].slotId) return API.replace('{id}', window.dataLayer[i].slotId);
        }
      },
    },
    isCmNow: function(){
      return (elements.programName && elements.programName.textContent === '');
    },
    use: function use(target = null, key = use.caller.name){
      if(target) target.dataset.selector = key;
      elements[key] = target;
      return target;
    },
  };
  /* 処理本体 */
  let html, elements = {}, ngwords = [], configs = {}, timers = {};
  let canvas, preContext, lines = [];/*アニメーション関連は極力浅いオブジェクトに*/
  let core = {
    initialize: function(){
      html = document.documentElement;
      core.config.read();
      core.ng.initialize();
      core.listenUserActions();
      core.checkUrl();
      core.addStyle('initialStyle');
    },
    checkUrl: function(){
      let previousUrl = '';
      setInterval(function(){
        if(location.href === previousUrl) return;/*URLが変わってない*/
        switch(true){
          case(location.href.startsWith('https://abema.tv/now-on-air/')):/*テレビ視聴ページ*/
            if(previousUrl.startsWith('https://abema.tv/now-on-air/')){/*チャンネルを変えただけ*/
              html.classList.remove('comment');
              html.classList.remove('ng');
              elements.closer = site.get.closer();
            }else{/*テレビ視聴ページになった*/
              core.ready();
            }
            break;
//          case(location.href.startsWith('https://abema.tv/channels/')):/*見逃し視聴ページ(の可能性)*/
//            core.readyForTimeshift();
//            break;
          default:/*視聴ページではない*/
            core.gone();
            break;
        }
        previousUrl = location.href;
      }, 1000);
    },
    ready: function(){
      /* 必要な要素が出揃うまで粘る */
      for(let i = 0, target; target = site.targets[i]; i++){
        if(target() === false){
          if(!retry) return log(`Not found: ${target.name}, I give up.`);
          log(`Not found: ${target.name}, retrying... (left ${retry})`);
          return retry-- && setTimeout(core.ready, 1000);
        }
      }
      elements.closer = site.get.closer();
      site.reactPropertyName = site.get.reactPropertyName(elements.board);
      log("I'm Ready.");
      /* すべての要素が出揃っていたので */
      html.classList.add(SCRIPTNAME);
      core.observeAspectRatio();
      core.setupFullscreenButton();
      core.createCanvas();
      core.listenUserActionsOnCommentPane();
      core.listenComments();
      core.panel.createPanels();
      core.ng.createButton();
      core.ng.listenSelection();
      core.config.createButton();
      core.addStyle();
      core.observeCommentButton();
    },
    readyForTimeshift: function(){
      /* 必要な要素が出揃うまで粘る */
      for(let i = 0, target; target = site.timeshiftTargets[i]; i++){
        if(target() === false){
          if(!retry) return log(`Not found: ${target.name}, I give up.`);
          log(`Not found: ${target.name}, retrying... (left ${retry})`);
          return retry-- && setTimeout(core.readyForTimeshift, 1000);
        }
      }
      log("I'm Ready for Timeshift.");
      /* すべての要素が出揃っていたので */
      html.classList.add(SCRIPTNAME);
      core.observeAspectRatio();
      core.createCanvas();
      core.listenCommentsOnTimeshift();
      core.panel.createPanels();
//      core.ng.createButton();
//      core.ng.listenSelection();
//      core.config.createButton();
      core.addStyle('timeshiftStyle');
//      core.observeCommentButton();
    },
    gone: function(){
      setTimeout(function(){
        if(elements.style && elements.style.isConnected) document.head.removeChild(elements.style);
        html.classList.remove(SCRIPTNAME);
        html.classList.remove('comment');
        clearInterval(timers.ratio);
      }, 1000);
    },
    setupFullscreenButton: function(){
      let full_screen = elements.fullscreenButton.querySelector('use');
      let mini_screen = createElement(core.html.mini_screen());
      full_screen.parentNode.appendChild(mini_screen);
      full_screen.parentNode.outerHTML = full_screen.parentNode.outerHTML;/*svgバグ回避*/
      elements.fullscreenButton.dataset.icon = 'full_screen';
    },
    observeCommentButton: function(){
      /* コメントを開けるようになったら自動で開く */
      let url = null;
      let observer = observe(elements.commentButton, function(records){
        if(elements.commentPane.attributes['aria-hidden'].value === 'false') return;/*既に表示中*/
        if(getComputedStyle(elements.commentButton).cursor !== 'pointer') return;/*まだクリックできない*/
        if(url !== location.href){/*チャンネル切り替え後の初回*/
          elements.commentButton.click();
          url = location.href;
        }else if(html.classList.contains('comment')){/*コメントを開いた状態で番組開始を迎えたとき*/
          core.closeOpenCommentPane();
        }
      }, {attributes: true});
    },
    closeOpenCommentPane: function(){
      /* コメントが閉じられたと認識されたら即開き直す準備 */
      let observer = observe(elements.commentPane, function(records){
        if(elements.commentPane.attributes['aria-hidden'].value === 'false') return;
        observer.disconnect();/*一度だけ*/
        elements.commentButton.click();
        elements.commentPane.classList.remove('keep');
        canvas.classList.remove('keep');
      }, {attributes: true});
      /* ユーザーには閉じたように見せない */
      canvas.classList.add('keep');
      elements.commentPane.classList.add('keep');
      elements.closer.click();
    },
    observeAspectRatio: function(){
      const INTERVAL = 1000, RATIOS = {'16:9': (16/9), '4:3': (4/3)}, DEFAULTRATIO = RATIOS['16:9'], THUMBLIMIT = 2/*サムネイルの最大確認数*/;
      const round = function(ratio){/*いちばん近いratioを見つけるだけ*/
        return RATIOS[Object.keys(RATIOS).sort((a, b) => Math.abs(RATIOS[a] - ratio) - Math.abs(RATIOS[b] - ratio))[0]];
      };
      const modify = function(ratio){
        if(ratio === configs.aspectRatio) return;
        configs.aspectRatio = ratio || RATIOS['16:9'];
        screen.dataset.estimatedAspectRatio = ratio;
        core.modify();
      };
      const getActiveVideo = function(){
        let videos = screen.querySelectorAll('video[src]');
        for(let i = 0; videos[i]; i++){
          if(videos[i].paused) continue;
          if(!videos[i].videoWidth || !videos[i].videoHeight) continue;
          return videos[i];
        }
      };
      const checkThumbRatio = function(programId, number = 1){
        let img = document.createElement('img');
        img.src = site.get.thumbImgApi(programId, number);
        img.addEventListener('load', function(e){
          let ratio = round(img.naturalWidth / img.naturalHeight);
          if(ratio !== DEFAULTRATIO) return modify(cache[programId] = ratio);
          if(number < THUMBLIMIT) checkThumbRatio(programId, ++number);
        });
      };
      let status = {}, previousStatus = {}, cache = {}, screen = elements.screen;
      configs.aspectRatio = screen.dataset.estimatedAspectRatio = parseFloat(screen.dataset.estimatedAspectRatio) || DEFAULTRATIO;
      clearInterval(timers.ratio), timers.ratio = setInterval(function(){
        /* アクティブなビデオ要素を見つける */
        let video = getActiveVideo();
        if(!video) return;
        status = {
          width: video.videoWidth,
          height: video.videoHeight,
          ratio: round(video.videoWidth / video.videoHeight),
          src: video.src,
        };
        if(status.src === previousStatus.src) return;
        /* srcが変わった = タテヨコ比が変わったかもしれない */
        let programId = site.get.programId();
        if(!programId) return;/*ページ読み込み直後はprogramIdが取得できない*/
        if(site.isCmNow()) modify(status.ratio);/*CM中ならvideo要素のタテヨコ比(status.ratio)だけが手がかり*/
        else{
          if(cache[programId]){
            modify(cache[programId]);
            screen.dataset.videoAspectRatio = cache[programId];
          }else{
            modify(cache[programId] = status.ratio);/*いったんビデオのタテヨコ比を採用しつつ*/
            screen.dataset.videoAspectRatio = status.ratio;
            //例外があるのでサムネイルを参考にするのは危険(ビデオが完全な16:9なのにサムネイルが4:3、サムネが黒メイン、などのパターンがある)
            //if(status.ratio === DEFAULTRATIO) checkThumbRatio(programId, 1);/*番組サムネイルで4:3の可能性を追確認する*/
          }
        }
        previousStatus = status;
      }, INTERVAL);
    },
    updateStats: function(){
      /* mはアベマの仕様に合わせて小文字。しかし小数第1位は0も表示する。 */
      let formatNumber = function(number){
        switch(true){
          case(number < 1e3): return (number);
          case(number < 1e6): return (number/1e3).toFixed(1) + 'k';
          default:            return (number/1e6).toFixed(1) + 'm';
        }
      };
      let api = site.get.statsApi();
      if(!api) return log('Failed: site.get.statsApi.');
      let xhr = new XMLHttpRequest();
      xhr.open('GET', api);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4 || xhr.status !== 200) return;
        if(!xhr.response.stats || !xhr.response.stats.view || !xhr.response.stats.comment) return log(`Not found: stats`);
        //log('xhr.response:', xhr.response);
        let viewCount = site.get.viewCount(elements.viewCounter), commentCount = site.get.commentCount(elements.commentButton);
        if(viewCount)    viewCount.textContent    = formatNumber(xhr.response.stats.view);
        if(commentCount) commentCount.textContent = formatNumber(xhr.response.stats.comment);
      };
      xhr.send();
    },
    listenUserActions: function(){
      let id, timer = function(e){
        clearTimeout(id), id = setTimeout(function(){
          if(['input', 'textarea'].includes(document.activeElement.loaclName)) return;/*入力中はアクティブのまま*/
          html.classList.remove('active');
          if(!configs.l_overlay && configs.l_hide) core.modify();
        }, configs.n_delay * 1000);
      };
      window.addEventListener('keydown', function(e){
        switch(e.key){
          /*テキスト入力中の上下キーによるチャンネル移動を防ぐ*/
          case('ArrowUp'):
          case('ArrowDown'):
            if(['input', 'textarea'].includes(e.target.localName)){
              e.stopPropagation();
            }
            break;
        }
      }, true);
      window.addEventListener('mousemove', function(e){
        if(configs.n_clickonly) return;
        if(!html.classList.contains('active')){
          html.classList.add('active');
          if(!configs.l_overlay && configs.l_hide) animate(core.modify);
        }
        timer();
      });
      window.addEventListener('click', function(e){/*アベマより先にwindowでキャプチャ*/
        switch(e.target){
          case(elements.channelButton):
            return html.classList.toggle('channel');
          case(elements.programButton):
            return html.classList.toggle('program');
          case(elements.commentButton):
            if(html.classList.contains('comment')){
              animate(function(){elements.closer.click()});/*すぐクリックすると競合してしまうのでanimate()*/
            }else{
              html.classList.add('comment');
              if(!configs.l_overlay) core.modify();
              /* デフォルトのボタン動作が実行される */
            }
            return;
          case(elements.newCommentsButton):
            if(e.isTrusted){/*実クリックのみで処理*/
              elements.newCommentsButton.style.height = '0';
              /* スクロールをなめらかにする */
              const DURATION = '500ms', EASING = 'ease';
              let board = elements.board, child = elements.board.firstElementChild;
              let scrollTop = board.scrollTop, scrollHeight = board.scrollHeight, clientHeight = board.clientHeight;
              if(scrollTop !== scrollHeight - clientHeight){/*最下端(最新コメント位置)じゃなければ*/
                child.style.transition = `transform ${DURATION} ${EASING}`;
                animate(function(){
                  child.style.transform = `translateY(-${scrollHeight - scrollTop - clientHeight}px)`
                  child.addEventListener('transitionend', function(e){
                    child.style.transition = 'none';
                    child.style.transform = 'translateY(0)';
                    board.scrollTop = scrollHeight - clientHeight;/*これをクリックの代わりとする*/
                  }, {once: true});
                });
              }else{
                elements.newCommentsButton.click();
              }
              e.stopPropagation();
            }else{
              /* デフォルトのボタン動作が実行される */
            }
            return;
          case(elements.fullscreenButton):
            if(elements.fullscreenElement.requestCanceled === undefined){/*公式のフルスクリーン要求をキャンセル*/
              elements.fullscreenElement.requestFullscreen = () => {};
              elements.fullscreenElement.requestCanceled = true;
            }
            if(document.fullscreenElement === null) document.body.requestFullscreen();/*bodyごとフルスクリーン化する*/
            else document.exitFullscreen();
            e.stopPropagation();
            return;
          case(elements.closer):
            if(html.classList.contains('comment')) core.ng.closeForm();/*NGフォームを開いているなら閉じる*/
            if(elements.commentPane.classList.contains('keep')) return html.classList.remove('comment');/*core.closeOpenCommentPaneですぐまた開かれる*/
            switch(true){
              case(html.classList.contains('channel')):
                html.classList.remove('channel');
                return e.stopPropagation();
              case(html.classList.contains('program')):
                html.classList.remove('program');
                return e.stopPropagation();
              default:
                if(e.isTrusted){/*実クリックではコメントは閉じない*/
                  e.stopPropagation();
                  if(elements.commentPane.classList.contains('active')) return;/*コメントフォームからフォーカスを外すだけ*/
                  html.classList.add('click');/*250msのtransition遅延をなくしてからキビキビactivate*/
                  html.classList.toggle('active');
                  elements.header.addEventListener('transitionend', function(e){
                    html.classList.remove('click');
                  }, {once: true});
                  if(configs.l_hide && !configs.l_overlay) core.modify();
                  timer();
                }else{/*elements.closer.click()でのみ閉じる*/
                  html.classList.remove('comment');
                  if(!configs.l_overlay) core.modify();
                  /* default and propagateする */
                }
                return;
            }
          default:
            return;/*デフォルトの動作に任せる*/
        }
      }, true);
      document.addEventListener('visibilitychange', function(e){
        if(document.hidden) return;
        /* 番組開始のタイミングを挟んだバックグラウンドからの復帰でコメント取得が停止する現象を防ぐ */
        if(site.isCmNow()) return;/*CM中はクリックしない*/
        if(html.classList.contains('comment')) core.closeOpenCommentPane();
      });
      document.addEventListener('fullscreenchange', function(e){
        if(document.fullscreenElement){/*フルスクリーンなら*/
          elements.fullscreenButton.dataset.icon = 'mini_screen';
        }else{
          elements.fullscreenButton.dataset.icon = 'full_screen';
        }
        setTimeout(core.modify, 500);/*初動*/
        setTimeout(core.modify, 2500);/*ダメ押し*/
      });
      let resizing, resize = function(){
        core.modify();
      };
      window.addEventListener('resize', function(e){
        if(!resizing) setTimeout(resize, 500);/*初動*/
        clearTimeout(resizing), resizing = setTimeout(function(){
          resize();/*ダメ押し*/
          resizing = null;
        }, 2500);
      });
    },
    listenUserActionsOnCommentPane: function(){
      elements.board.addEventListener('click', function(e){/*アベマ公式ブロックを「コメントクリックでトグル」に差し替える*/
        if(!e.isTrusted) return;
        let comment;
        /* コメントのクリックを判定する */
        for(let target = e.target; target; target = target.parentNode){
          switch(true){
            case(target === elements.board):
              return;
            /* コメント */
            case(target.dataset.selector === 'comment'):
              comment = target;
              break;
            /* アベマ公式ブロックフォーム */
            case(target.name && target.name.startsWith('comment-report-form')):
              comment = target.previousElementSibling;
              break;
          }
          if(comment) break;
        }
        if(!comment) return;
        /* コメントをクリックしたようなので */
        if(!comment.dataset.blockform){/*ブロックフォームはまだ開かれていない*/
          /* フォーム用のクラスは常にひとつだけ */
          let last = comment.parentNode.lastBlockFormComment;
          if(last) delete last.dataset.blockform;
          comment.parentNode.lastBlockFormComment = comment;
          let observer = observe(comment, function(records){
            if(site.get.commentBlockCancel(comment)) return;
            delete comment.dataset.blockform;
            observer.disconnect();
          });
          /* ブロックフォームを開く */
          site.get.commentBlock(comment).click();
          comment.style.transition = `background 250ms ${EASING}`;
          comment.dataset.blockform = 'true';/*classはアベマ公式に上書きされる*/
        }else{/*ブロックフォームはすでに開かれている*/
          /* ブロックフォームを閉じる */
          delete comment.dataset.blockform;
          comment.addEventListener('transitionend', function(e){
            comment.style.transition = 'none';
            site.get.commentBlockCancel(comment).click();
          }, {once: true});
        }
      });
      elements.commentForm.addEventListener('click', function(e){/*コメント欄のフォーカスを維持する*/
        elements.commentFormTextarea.focus();
      });
      elements.commentForm.addEventListener('focusin', function(e){/* コメント入力中にcssで表示を制御する */
        if(e.target.form && e.target.form.dataset.selector === 'commentForm') elements.commentPane.dataset.active = 'true';/*classはアベマ公式に上書きされる*/
      });
      elements.commentForm.addEventListener('focusout', function(e){
        setTimeout(function(){
          if(document.activeElement === elements.commentFormTextarea) return;
          if(e.target.form && e.target.form.dataset.selector === 'commentForm') delete elements.commentPane.dataset.active;
        }, 250);/*コメント欄のフォーカスを維持するなら、commentPane.dataset.activeを一瞬でも失いたくないので*/
      });
    },
    createCanvas: function(){
      if(canvas && canvas.isConnected) elements.screen.removeChild(canvas);
      /* コメントcanvasたちを格納する親 */
      canvas = createElement(core.html.canvasDiv());
      /* テキストサイズ計測に使用 */
      elements.preCanvas = createElement(core.html.preCanvas());
      preContext = elements.preCanvas.getContext('2d', {alpha: false});
      elements.screen.insertBefore(canvas, elements.screen.firstElementChild);
      core.modify();
    },
    modify: function(){
      if(!elements.screen || !canvas) return;
      /* 新着コメント受信状態を保つ */
      let newCommentsButton = elements.newCommentsButton, board = elements.board;
      if(!newCommentsButton || !newCommentsButton.isConnected) board.scrollTop = (board.scrollHeight - board.clientHeight);
      /* スクリーンサイズを適切に変化させる */
      let beFullsize = [
        (configs.l_overlay === 1),
        !html.classList.contains('comment'),
        (configs.l_hide && html.classList.contains('comment') && !html.classList.contains('active')),
      ].includes(true);
      let fonts = (configs.font === '') ? FONT : `${configs.font}, ${FONT}`;
      let width = (beFullsize) ? elements.parent.clientWidth : Math.round(elements.parent.clientWidth * (1 - configs.l_width / 100));
      let height = atMost(width / configs.aspectRatio, elements.parent.clientHeight);
      /* 余裕があるなら configs.l_width ずらす */
      if(configs.l_overlay && height * configs.aspectRatio + width * (configs.l_width / 100) < width) elements.screen.dataset.shift = 'true';
      else elements.screen.dataset.shift = 'false';
      elements.screen.style.width = canvas.style.width = width + 'px';
      elements.screen.style.height = canvas.style.height = height + 'px';
      canvas.width = width;/*独自指定*/
      canvas.height = height;/*独自指定*/
      canvas.fontsize = Math.round((canvas.height / (configs.maxlines || 1)) / (1 + configs.linemargin));/*独自指定*/
      preContext.font = `bold ${canvas.fontsize}px ${fonts}`;
      preContext.textBaseline = 'alphabetic';
      preContext.fillStyle = 'white';
      preContext.fillStyles = {isOwner: 'rgb(81,195,0)', ngTrial: 'rgb(255,224,32)'};/*独自指定*/
      preContext.strokeStyle = 'black';
      preContext.lineWidth = Math.round(canvas.fontsize * configs.owidth);
      preContext.lineJoin = 'round';
      canvas.topDelta = ((canvas.fontsize * configs.linemargin) - preContext.lineWidth - (canvas.fontsize * MARGIN)) / 2;/*canvasのtop計算に使用する*/
    },
    listenComments: function(){
      if(elements.commentPane.isListening) return;
      elements.commentPane.isListening = true;
      observe(elements.commentPane.firstElementChild, function(records){
        /* 新着コメント表示ボタン */
        if(records[0].addedNodes.length === 1 && site.addedNode.newCommentsButton(records[0].addedNodes[0]) !== false){
          let newCommentsButton = records[0].addedNodes[0];
          if(elements.board.classList.contains('mousedown')){/*テキスト選択を邪魔しないための配慮*/
            window.addEventListener('mouseup', function(){
              newCommentsButton.classList.add('shown');
            }, {once: true});
          }else{
            newCommentsButton.classList.add('shown');
          }
        }
      });
      observe(elements.board.firstElementChild, function(records){
        let newComments = [];
        for(let i = 0, record; record = records[i]; i++){
          /* 新着コメント */
          if(record.addedNodes.length === 1 && site.addedNode.comment(record.addedNodes[0]) !== false){
            newComments.push(record.addedNodes[0]);/*古い順に格納される*/
            if(site.get.commentIsOwner(record.addedNodes[0])) record.addedNodes[0].dataset.isOwner = 'true';/*自分の投稿*/
          }
        }
        if(newComments.length) core.receiveNewComments(newComments);
      });
    },
    listenCommentsOnTimeshift: function(){
      observe(elements.board, function(records){
        if(records[0].addedNodes.length === 1 && site.timeshiftAddedNode.commentContainer(records[0].addedNodes[0]) !== false){
          let ul = records[0].addedNodes[0].firstElementChild;
          Array.from(ul.children).forEach(li => site.timeshiftAddedNode.comment(li));
          observe(records[0].addedNodes[0].firstElementChild, function(records){
            let newComments = [];
            for(let i = 0, record; record = records[i]; i++){
              /* 新着コメント */
              if(record.addedNodes.length === 1 && site.timeshiftAddedNode.comment(record.addedNodes[0]) !== false){
                newComments.push(record.addedNodes[0]);/*古い順に格納される*/
              }
            }
            if(newComments.length) core.receiveNewCommentsOnTimeshift(newComments);
          });
        }
      });
    },
    receiveNewComments: function(newComments){
      /* コメント表示中に停止してしまう視聴数とコメント数をこのタイミングで更新する */
      if(!elements.commentButton.statsUpdated && !site.isCmNow()/*CM中は更新しない*/){
        elements.commentButton.statsUpdated = true;
        core.updateStats();
        setTimeout(function(){elements.commentButton.statsUpdated = false}, STATSUPDATE);
      }
      /* NGコメントをすぐ判定する */
      core.ng.expire();
      let filteredComments = newComments.filter(core.ng.filter);
      /* コメントの再取得で重複コメントが流れるのを回避する(NG判定をすませた後で) */
      let latest = parseInt(elements.board.dataset.latest);
      if(latest) filteredComments = filteredComments.filter(function(comment){
        return latest < parseInt(site.get.commentTime(comment));
      });
      latest = elements.board.dataset.latest = parseInt(site.get.commentTime(newComments[newComments.length - 1]));
      /* バックグラウンドならここで終了 */
      if(document.hidden) return;
      /* スライドアップアニメーションを上書きする */
      core.slideUpNewComments(filteredComments);
      /* コメントを流す必要がなければここで終了 */
      if(configs.maxlines === 0) return;
      if(configs.transparency === 100) return;
      if(configs.maxcomments === 0) return;
      /* 配列先頭の古いコメントから順に流す */
      let earliest = atLeast(latest - AINTERVAL, parseInt(site.get.commentTime(filteredComments[0])));
      for(let i = 0, comment; comment = filteredComments[i]; i++){
        setTimeout(function(){
          if(configs.maxcomments <= canvas.children.length) return;
          core.attachComment(site.get.commentText(comment), comment.dataset);
        }, parseInt(site.get.commentTime(comment)) - earliest);
      }
    },
    receiveNewCommentsOnTimeshift: function(newComments){
      /* NGコメントをすぐ判定する */
      core.ng.expire();
      let filteredComments = newComments.filter(core.ng.filter);
      /* バックグラウンドならここで終了 */
      if(document.hidden) return;
      /* スライドアップアニメーションを上書きする */
      core.slideUpNewComments(filteredComments);
      /* コメントを流す必要がなければここで終了 */
      if(configs.maxlines === 0) return;
      if(configs.transparency === 100) return;
      if(configs.maxcomments === 0) return;
      /* 配列先頭の古いコメントから順に流す */
      let schedule = [];/*時刻情報がないのでランダムにばらけさせる*/
      for(let i = 0, length = filteredComments.length; filteredComments[i]; i++){
        schedule[i] = i * (1 / ((length - 1) || 1)) * Math.random() * AINTERVAL;
      }
      schedule.sort((a, b) => a - b);
      for(let i = 0, comment; comment = filteredComments[i]; i++){
        setTimeout(function(){
          if(configs.maxcomments <= canvas.children.length) return;
          core.attachComment(site.get.commentText(comment), comment.dataset);
        }, schedule[i]);
      }
    },
    slideUpNewComments: function(newComments){
      const DURATION = '500ms', EASING = 'ease', HIGHLIGHT = 5000;
      let board = elements.board, child = elements.board.firstElementChild, height = 0;
      let scrollHeight = board.scrollHeight, clientHeight = board.clientHeight;/*大量コメント時にscrollHeightの負荷が高いがやむを得ない*/
      for(let i = 0, comment; comment = newComments[i]; i++){
        height += parseFloat(getComputedStyle(comment).height);/*大量コメント時に少し負荷があるがやむを得ない*/
        comment.dataset.new = 'true';
      }
//log(scrollHeight, clientHeight, height, board.scrollTop);
      board.scrollTop = (scrollHeight - clientHeight) - 2;/* 本来は1でよいが、ブラウザのズーム倍率に対する保険 */
      child.style.transform = `translateY(${height - 2}px)`;
      animate(function(){
        child.style.transition = `transform ${DURATION} ${EASING}`;
        child.style.transform = `translateY(0)`;
        child.addEventListener('transitionend', function(e){
          child.style.transition = 'none';
          animate(function(){board.scrollTop = (scrollHeight - clientHeight) + 1});
        }, {once: true});
      });
      setTimeout(function(){
        for(let i = 0, comment; comment = newComments[i]; i++){
          delete comment.dataset.new;
        }
      }, HIGHLIGHT);
    },
    attachComment: function(text, dataset){
      /* 単一スクロールコメントcanvasを用意する */
      let scrollComment, c, fonts = (configs.font === '') ? FONT : `${configs.font}, ${FONT}`;
      let width = Math.round(preContext.measureText(text).width + preContext.lineWidth);
      let height = Math.round(canvas.fontsize * (1 + MARGIN) + preContext.lineWidth);
      scrollComment = createElement(core.html.scrollComment(width, height));
      c = scrollComment.getContext('2d');
      c.font         = `bold ${canvas.fontsize}px ${fonts}`;/*preContext.fontを参照したいがSafariでbold指定が文字列として残らないバグ*/
      c.textBaseline = preContext.textBaseline;
      switch(true){
        case(dataset.isOwner === 'true'): c.fillStyle = preContext.fillStyles.isOwner; break;
        case(dataset.ngTrial === 'true'): c.fillStyle = preContext.fillStyles.ngTrial; break;
        default: c.fillStyle = preContext.fillStyle; break;
      }
      c.strokeStyle  = preContext.strokeStyle;
      c.lineWidth    = preContext.lineWidth;
      c.lineJoin     = preContext.lineJoin;
      let left = Math.round(preContext.lineWidth/2);
      let top  = Math.round((canvas.fontsize * MARGIN + preContext.lineWidth)/2 + canvas.fontsize * BASELINE);
      c.strokeText(text, left, top);
      c.fillText(text, left, top);
      /* コメント位置データをまとめる */
      let record = {};
      record.text = text;/*流れる文字列*/
      record.width = width;/*文字列の幅*/
      record.ppms = (canvas.width + record.width) / (configs.duration * 1000);/*ミリ秒あたり移動距離*/
      record.start = Date.now();/*開始時刻*/
      record.reveal = record.start + (record.width / record.ppms);/*文字列が右端から抜ける時刻*/
      record.touch = record.start + (canvas.width / record.ppms);/*文字列が左端に触れる時刻*/
      record.end = record.start + (configs.duration * 1000);/*終了時刻*/
      /* 追加されたコメントをどの行に流すかを決定する */
      for(let i = 0; i < configs.maxlines; i++){
        let length = lines[i] ? lines[i].length : 0;/*同じ行に詰め込まれているコメント数*/
        switch(true){
          /* 行がなければ行を追加して流す */
          case(length === 0):
            lines[i] = [];
          /* ひとつ先行するコメントより遅い(短い)文字列なら、現時点で先行コメントがすでに右端から抜けていれば流す */
          case(record.ppms < lines[i][length - 1].ppms && lines[i][length - 1].reveal < record.start):
          /* ひとつ先行するコメントより速い(長い)文字列なら、左端に触れる瞬間までに先行コメントが終了するなら流す */
          case(lines[i][length - 1].ppms < record.ppms && lines[i][length - 1].end < record.touch):
            record.top = Math.round(((canvas.height / configs.maxlines) * i) + canvas.topDelta);
            //if(DEBUG) scrollComment.dataset.former = JSON.stringify(lines[i][length - 1]);
            //if(DEBUG) scrollComment.dataset.self = JSON.stringify(record);
            lines[i].push(record);
            scrollComment.style.top = record.top + 'px';
            canvas.appendChild(scrollComment);
            animate(function(){
              scrollComment.style.transform = `translateX(-${canvas.width + width}px)`;
              scrollComment.addEventListener('transitionend', function(e){
                canvas.removeChild(scrollComment);
                lines[i].shift();
              }, {once: true});
            });
            return;/*行に追加したら終了*/
          default:
            continue;/*条件に当てはまらなければforループを回して次の行に入れられるかの判定へ*/
        }
      }
    },
    ng: {
      initialize: function(){
        core.ng.read();
      },
      listenSelection: function(){
        /* コメント上でmousedownした状態からのmousemove,mouseupでのみselect() */
        let select = function(e){
          let selection = window.getSelection(), selected = selection.toString();
          let comment = (selection.anchorNode.length) ? selection.anchorNode.parentNode.parentNode.parentNode.parentNode : null;
          /* テキスト選択なしなら登録フォームを閉じる */
          if(selection.isCollapsed && e.type === 'mouseup' && !e.target.dataset.ngword) return core.ng.closeForm();
          /* テキスト選択を邪魔しない場合にのみ登録フォームを表示 */
          if(!elements.ngForm || elements.ngForm.classList.contains('hidden') || e.target.offsetTop < elements.ngForm.offsetTop || e.type === 'mouseup') core.ng.openForm(comment, e);
          /* テキスト選択があれば初期値に */
          if(!selection.isCollapsed) elements.ngForm.querySelector('input[type="text"]').value = selected;
        };
        elements.board.addEventListener('mousedown', function(e){
          for(let target = e.target; target.dataset; target = target.parentNode) if(target.dataset.selector === 'comment'){
            elements.board.classList.add('mousedown');
            window.addEventListener('mousemove', select);
            window.addEventListener('mouseup', function(e){
              animate(function(){select(e)});/*ダブルクリックでのテキスト選択をanimateで確実に補足*/
              window.removeEventListener('mousemove', select);
              elements.board.classList.remove('mousedown');
            }, {once: true});
            return;
          }
        });
      },
      createButton: function(){
        if(elements.ngButton && elements.ngButton.isConnected) return;
        /* フルスクリーンボタンを元にNG一覧ボタンを追加する */
        elements.ngButton = createElement(core.html.ngButton());
        elements.ngButton.className = elements.fullscreenButton.className;
        elements.ngButton.addEventListener('click', core.ng.toggleListPanel);
        elements.fullscreenButton.parentNode.insertBefore(elements.ngButton, elements.fullscreenButton);/*元のDOM位置関係にできるだけ影響を与えない*/
      },
      createForm: function(comment){
        elements.ngForm = createElement(core.html.ngForm());
        elements.ngForm.querySelector('button.list').addEventListener('click', core.ng.toggleListPanel);
        elements.ngForm.querySelector('button.help').addEventListener('click', core.ng.toggleHelpPanel);
        elements.ngForm.querySelector('p.type').addEventListener('click', function(e){
          let word = elements.ngForm.querySelector('p.word input');
          if(word.value === '') return;
          if(e.target.localName !== 'button') return;
          core.ng.add(word, e.target);
          core.ng.closeForm();
          if(elements.ngListPanel) core.ng.buildList();
        });
      },
      openForm: function(comment, e){
        let append = function(comment, ngForm){
          comment.insertBefore(ngForm, comment.firstElementChild.nextElementSibling);/*公式ブロックフォームが最後尾にある*/
        };
        let slideUpDown = function(){
          elements.ngForm.slidingUp = true;
          animate(function(){
            elements.ngForm.classList.add('hidden');
            if(elements.ngForm.isConnected){
              elements.ngForm.addEventListener('transitionend', function(e){
                elements.ngForm.slidingUp = false;
                append(elements.ngForm.targetComment, elements.ngForm);
                slideDown();
              }, {once: true});
            }else{
              elements.ngForm.slidingUp = false;
              append(elements.ngForm.targetComment, elements.ngForm);
              slideDown();
            }
          });
        };
        let slideDown = function(){
          elements.ngForm.slidingDown = true;
          if(elements.ngForm.parentNode !== elements.ngForm.targetComment) append(elements.ngForm.targetComment, elements.ngForm);
          animate(function(){
            elements.ngForm.classList.remove('hidden');
            elements.ngForm.addEventListener('transitionend', function(e){
              elements.ngForm.slidingDown = false;
            }, {once: true});
          });
          let ngword = elements.ngForm.targetComment.dataset.ngword;
          if(ngword && e.type === 'click') elements.ngForm.querySelector('input[type="text"]').value = ngword;
          if(!html.classList.contains('ng')) html.classList.add('ng');/*チャンネル切り替えナビゲーションを隠すなど*/
        };
        if(elements.ngForm){/*表示位置の移し替え*/
          elements.ngForm.targetComment = comment;/*既にslideDown中の処理も含めてターゲットを差し替える*/
          if(elements.ngForm.classList.contains('hidden')){
            if(elements.ngForm.slidingUp){/*Up中*/
              if(elements.ngForm.parentNode === comment){
                slideDown();/*UpをやめてDownさせる*/
              }else{
                /*予定通りUp後にDownさせる*/
                elements.ngForm.addEventListener('transitionend', function(e){
                  slideDown();
                }, {once: true});
              }
            }else{/*hidden状態*/
              slideDown();
            }
          }else{
            if(elements.ngForm.slidingDown){/*Down中*/
              if(elements.ngForm.parentNode === comment){
                /*なにもしなくてもよい*/
              }else{
                slideUpDown();/*Downをやめて改めてUpDownさせる*/
              }
            }else{/*表示状態*/
              if(elements.ngForm.parentNode === comment){
                /*なにもしなくてもよい*/
              }else{
                slideUpDown();
              }
            }
          }
        }else{/*新規*/
          core.ng.createForm(comment);
          elements.ngForm.classList.add('hidden');
          elements.ngForm.targetComment = comment;
          slideDown();
        }
      },
      closeForm: function(){
        if(!elements.ngForm) return;
        if(elements.ngForm.classList.contains('hidden')) return;
        elements.ngForm.slidingUp = true;
        animate(function(){
          elements.ngForm.classList.add('hidden');
          if(elements.ngForm.isConnected){
            elements.ngForm.addEventListener('transitionend', function(e){
              elements.ngForm.slidingUp = false;
            }, {once: true});
          }else{
            elements.ngForm.slidingUp = false;
          }
        });
        html.classList.remove('ng');/*チャンネル切り替えナビゲーションを隠すなど*/
      },
      toggleForm: function(comment, e){
        if(!elements.ngForm) return core.ng.openForm(comment, e);
        if(elements.ngForm.classList.contains('hidden')) return core.ng.openForm(comment, e);
        if(elements.ngForm.parentNode !== comment) return core.ng.openForm(comment, e);
        core.ng.closeForm();
      },
      openListPanel: function(){
        core.panel.open(elements.ngListPanel || core.ng.createListPanel());
      },
      closeListPanel: function(){
        core.panel.close(elements.ngListPanel);
      },
      toggleListPanel: function(){
        core.panel.toggle(elements.ngListPanel || core.ng.createListPanel(), core.ng.openListPanel, core.ng.closeListPanel);
      },
      createListPanel: function(){
        let ngListPanel = elements.ngListPanel = createElement(core.html.ngListPanel());
        ngListPanel.querySelector('button.help').addEventListener('click', core.ng.toggleHelpPanel);
        ngListPanel.querySelector('button.cancel').addEventListener('click', core.ng.closeListPanel);
        ngListPanel.querySelector('button.save').addEventListener('click', function(e){
          core.ng.save(core.ng.getNewNgwords().filter((ngword) => (ngword.type !== 'remove')));
          core.ng.closeListPanel();
        });
        ngListPanel.querySelector('ul > li.add > p.words > textarea').addEventListener('keypress', function(e){
          animate(function(){
            let checked = ngListPanel.querySelector('ul > li.add > p.type input:checked');
            if(e.target.value === '') return checked && (checked.checked = false);
            if(!checked) ngListPanel.querySelector('ul > li.add > p.type input[value="forever"]').checked = true;
          });
        }, true);
        /* 並べ替え */
        configs.ng_sort = configs.ng_sort || {key: 'date', reverse: false};
        ngListPanel.querySelector('p.sort').addEventListener('click', function(e){
          if(e.target.localName !== 'label') return;
          let input = document.getElementById(e.target.htmlFor);
          if(input.checked) input.classList.toggle('reverse');
          configs.ng_sort = {key: input.value, reverse: input.classList.contains('reverse')};
          core.ng.buildList();
        });
        /* リスト構築 */
        core.ng.buildList();
        ngListPanel.keyAssigns = {
          'Escape': core.ng.closeListPanel,
        };
        return ngListPanel;
      },
      getNewNgwords: function(){
        let new_ngwords = Array.from(ngwords);/*clone*/
        /* input */
        let lis = elements.ngListPanel.querySelectorAll('ul > li.edit');
        for(let i = 0, li; li = lis[i]; i++){
          let word = li.querySelector('p.word input');
          let checked = li.querySelector('p.type input:checked');
          let match = word.value.match(/^\/(.+)\/([a-z]+)?$/);
          new_ngwords[i] = {};
          new_ngwords[i].original = word.value;
          new_ngwords[i].value = (match) ? word.value : normalize(word.value).toLowerCase();
          new_ngwords[i].regex = (match) ? new RegExp(match[1], match[2]) : null;
          new_ngwords[i].type = checked.value;
          new_ngwords[i].added = parseInt(li.dataset.added) || null;
          new_ngwords[i].limit = (checked.value === 'for24h') ? parseInt(li.dataset.limit) : null;
        }
        /* textarea */
        let add = elements.ngListPanel.querySelector('ul > li.add');
        let textarea = add.querySelector('p.words textarea');
        let lines = textarea.value.split('\n');
        for(let i = 0; lines[i] !== undefined; i++){
          let checked = add.querySelector('p.type input:checked');
          let match = lines[i].match(/^\/(.+)\/([a-z]+)?$/);
          let index = new_ngwords.length;
          new_ngwords[index] = {};
          new_ngwords[index].original = lines[i];
          new_ngwords[index].value = (match) ? lines[i] : normalize(lines[i]).toLowerCase();
          new_ngwords[index].regex = (match) ? new RegExp(match[1], match[2]) : null;
          new_ngwords[index].type = (checked) ? checked.value : null;
          new_ngwords[index].added = Date.now() + i;/*並べ替え用に同一時刻を避ける*/
          new_ngwords[index].limit = (checked && checked.value === 'for24h') ? new_ngwords[index].added + 1000*60*60*24 : null;
        }
        textarea.value = '';
        return new_ngwords.filter((ngword, index) => {
          if(ngword.value === '') return false;/*空欄除外*/
          for(let i = index + 1; new_ngwords[i]; i++) if(ngword.value === new_ngwords[i].value) return false;/*重複除外*/
          return true;
        });
      },
      buildList: function(){
        /* 編集中の既存のリストがあればそのまま使う */
        let new_ngwords = core.ng.getNewNgwords();
        /* 並べ替え */
        if(new_ngwords.length < 2){
          elements.ngListPanel.querySelector('p.sort').classList.add('disabled');
        }else{
          elements.ngListPanel.querySelector('p.sort').classList.remove('disabled');
          let sort = elements.ngListPanel.querySelector(`p.sort input[value="${configs.ng_sort.key}"]`);
          sort.checked = true;
          if(configs.ng_sort.reverse) sort.classList.add('reverse');
        }
        new_ngwords.sort(function(a, b){
          let types = {trial: 1, for24h: 2, forever: 3, remove: 4};
          switch(configs.ng_sort.key){
            case('date'): return (a.added < b.added);
            case('word'): return (a.original < b.original);
            case('type'): return (a.limit && b.limit) ? (a.limit < b.limit) : (types[a.type] < types[b.type]);
          }
        });
        if(configs.ng_sort.reverse) new_ngwords.reverse();
        /* リスト構築 */
        let ul = elements.ngListPanel.querySelector('ul');
        while(2 < ul.children.length) ul.removeChild(ul.children[1]);/*冒頭のテンプレートと追加登録のみ残す*/
        let template = ul.querySelector('li.template');
        let now = Date.now();
        let formatTime = function(limit){
          let left = limit - now;
          switch(true){
            case(1000*60*60 <= left): return Math.floor(left/(1000*60*60)) + '時間';
            case(0 <= left): return Math.floor(left/(1000*60)) + '分';
            case(left < 0): return '0分';
          }
        };
        for(let i = 0, new_ngword; new_ngword = new_ngwords[i]; i++){
          let li = template.cloneNode(true);
          li.className = 'edit';
          li.innerHTML = li.innerHTML.replace(/\{i\}/g, i);
          li.querySelector('p.word input').value = new_ngword.original || new_ngword.value/*移行用*/;
          if(new_ngword.type) li.querySelector(`p.type input[value="${new_ngword.type}"]`).checked = true;
          li.dataset.added = new_ngword.added || 0;
          li.dataset.limit = new_ngword.limit || 0;
          let for24h = li.querySelector('p.type label.for24h');
          for24h.textContent = (new_ngword.limit) ? formatTime(new_ngword.limit) : '24時間';
          for24h.addEventListener('click', function(e){
            animate(function(){/*checked処理の後に*/
              if(li.querySelector('p.type input[value="for24h"]').checked){
                if(for24h.classList.toggle('extended')){
                  li.dataset.limit = Date.now() + 1000*60*60*24;
                  for24h.textContent = '24時間';
                }else{
                  li.dataset.limit = new_ngword.limit;
                  for24h.textContent = formatTime(new_ngword.limit);
                }
              }
            });
          });
          ul.insertBefore(li, template.nextElementSibling);
        }
      },
      showHelpPanel: function(){
        core.panel.show(elements.ngHelpPanel || core.ng.createHelpPanel());
      },
      hideHelpPanel: function(){
        core.panel.hide(elements.ngHelpPanel);
      },
      toggleHelpPanel: function(){
        core.panel.toggle(elements.ngHelpPanel || core.ng.createHelpPanel(), core.ng.showHelpPanel, core.ng.hideHelpPanel);
      },
      createHelpPanel: function(){
        let ngHelpPanel = elements.ngHelpPanel = createElement(core.html.ngHelpPanel());
        ngHelpPanel.querySelector('button.ok').addEventListener('click', core.ng.hideHelpPanel);
        ngHelpPanel.keyAssigns = {
          'Escape': core.ng.hideHelpPanel,
        };
        return ngHelpPanel;
      },
      add: function(word, type){
        let index = ngwords.length;
        for(let i = 0; ngwords[i]; i++) if(ngwords[i].value === word.value) index = i;/*重複させない*/
        let match = word.value.match(/^\/(.+)\/([a-z]+)?$/);
        if(!ngwords[index]) ngwords[index] = {};
        ngwords[index].original = word.value;
        ngwords[index].value = (match) ? word.value : normalize(word.value).toLowerCase();
        ngwords[index].regex = (match) ? new RegExp(match[1], match[2]) : null;
        ngwords[index].type = type.classList[0];
        ngwords[index].added = ngwords[index].added || Date.now();
        switch(true){
          case(type.classList.contains('for24h') && !ngwords[index].limit):
          case(type.classList.contains('for24h') && type.classList.contains('extended')):
            ngwords[index].limit = ngwords[index].added + 1000*60*60*24;
            break;
          case(type.classList.contains('for24h')):
            ngwords[index].limit = ngwords[index].limit;
            break;
          default:
            ngwords[index].limit = null;
            break;
        }
        Storage.save('ngwords', ngwords);
      },
      read: function(){
        /* 保存済みの設定を読む */
        ngwords = Storage.read('ngwords') || [];
        /* 正規表現(word.regex)はJSONに保存されないので復活させる */
        for(let i = 0; ngwords[i]; i++){
          let match = ngwords[i].value.match(/^\/(.+)\/([a-z]+)?$/);
          ngwords[i].regex = (match) ? new RegExp(match[1], match[2]) : null;
        }
      },
      save: function(new_ngwords){
        ngwords = new_ngwords;
        Storage.save('ngwords', ngwords);
      },
      expire: function(){
        let now = Date.now();
        ngwords = ngwords.filter(function(ngword, i, ngwords){
          if(!ngword.limit || now < ngword.limit) return true;
        });
      },
      filter: function(comment){
        const match = function(comment, ngword){
          let commentText = site.get.commentText(comment);
          if(ngword.regex && ngword.regex.test(commentText)) return true;
          if(normalize(commentText).toLowerCase().includes(ngword.value)) return true;
        };
        for(let i = 0, ngword; ngword = ngwords[i]; i++){
          switch(ngword.type){
            case('forever'):
            case('for24h'):
              if(match(comment, ngword)){
                comment.dataset.ngDeleted = 'true';
                return false;
              }
              break;
            case('trial'):
              if(match(comment, ngword)){
                comment.dataset.ngTrial = 'true';
                comment.dataset.ngWord = ngword.value;
                comment.addEventListener('click', function(e){
                  if(e.target === comment && window.getSelection().isCollapsed) core.ng.toggleForm(comment, e);
                });
              }
              break;
          }
        }
        return true;
      },
    },
    config: {
      read: function(){
        /* 保存済みの設定を読む */
        configs = Storage.read('configs') || {};
        /* 未定義項目をデフォルト値で上書きしていく */
        Object.keys(CONFIGS).forEach((key) => {if(configs[key] === undefined) configs[key] = CONFIGS[key].DEFAULT});
      },
      save: function(new_config){
        configs = {};/*CONFIGSに含まれた設定値のみ保存する*/
        /* CONFIGSを元に文字列を型評価して値を格納していく */
        Object.keys(CONFIGS).forEach((key) => {
          /* 値がなければデフォルト値 */
          if(new_config[key] === "") return configs[key] = CONFIGS[key].DEFAULT;
          switch(CONFIGS[key].TYPE){
            case 'bool':
              configs[key] = (new_config[key]) ? 1 : 0;
              break;
            case 'int':
              configs[key] = parseInt(new_config[key]);
              break;
            case 'float':
              configs[key] = parseFloat(new_config[key]);
              break;
            default:
              configs[key] = new_config[key];
              break;
          }
        });
        Storage.save('configs', configs);
      },
      createButton: function(){
        if(elements.configButton && elements.configButton.isConnected) return;
        /* フルスクリーンボタンを元に設定ボタンを追加する */
        let configButton = elements.configButton = createElement(core.html.configButton());
        configButton.className = elements.fullscreenButton.className;
        configButton.addEventListener('click', core.config.toggle);
        elements.fullscreenButton.parentNode.insertBefore(configButton, elements.fullscreenButton);/*元のDOM位置関係にできるだけ影響を与えない*/
      },
      open: function(){
        core.panel.open(elements.configPanel || core.config.createPanel());
      },
      close: function(){
        core.panel.close(elements.configPanel);
      },
      toggle: function(){
        core.panel.toggle(elements.configPanel || core.config.createPanel(), core.config.open, core.config.close);
      },
      createPanel: function(){
        let configPanel = elements.configPanel = createElement(core.html.configPanel());
        configPanel.querySelector('button.cancel').addEventListener('click', core.config.close);
        configPanel.querySelector('button.save').addEventListener('click', function(e){
          let inputs = configPanel.querySelectorAll('input'), new_configs = {};
          for(let i = 0, input; input = inputs[i]; i++){
            switch(CONFIGS[input.name].TYPE){
              case('bool'):
                new_configs[input.name] = (input.checked) ? 1 : 0;
                break;
              case('object'):
                if(!new_configs[input.name]) new_configs[input.name] = {};
                new_configs[input.name][input.value] = (input.checked) ? 1 : 0;
                break;
              default:
                new_configs[input.name] = input.value;
                break;
            }
          }
          core.config.save(new_configs);
          core.config.close();
          /* 新しい設定値で再スタイリング */
          core.addStyle();
          core.observeAspectRatio();/*タテヨコ比の判定を含む*/
          core.createCanvas();/*modify含む*/
        }, true);
        configPanel.querySelector('input[name="l_overlay"]').addEventListener('click', function(e){
          let lc_transparency = configPanel.querySelector('input[name="lc_transparency"]');
          let lb_transparency = configPanel.querySelector('input[name="lb_transparency"]');
          lc_transparency.disabled = !lc_transparency.disabled;
          lb_transparency.disabled = !lb_transparency.disabled;
          lc_transparency.parentNode.parentNode.classList.toggle('disabled');
          lb_transparency.parentNode.parentNode.classList.toggle('disabled');
        }, true);
        configPanel.keyAssigns = {
          'Escape': core.config.close,
        };
        return configPanel;
      },
    },
    panel: {
      createPanels: function(){
        if(elements.panels) return;
        let panels = elements.panels = createElement(core.html.panels());
        panels.dataset.panels = 0;
        document.body.appendChild(panels);
        /* Escapeキーで閉じるなど */
        window.addEventListener('keydown', function(e){
          if(['input', 'textarea'].includes(document.activeElement.localName)) return;
          Array.from(panels.children).forEach((p) => {
            if(p.classList.contains('hidden')) return;
            /* 表示中のパネルに対するキーアサインを確認 */
            if(p.keyAssigns){
              if(p.keyAssigns[e.key]){
                e.preventDefault();
                return p.keyAssigns[e.key]();/*単一キーなら簡単に処理*/
              }
              for(let i = 0, assigns = Object.keys(p.keyAssigns); assigns[i]; i++){
                let keys = assigns[i].split('+');/*プラス区切りで指定*/
                if(!['altKey','shiftKey','ctrlKey','metaKey'].every(
                  (m) => (e[m] && keys.includes(m)) || (!e[m] && !keys.includes(m)))
                ) return;/*修飾キーの一致を確認*/
                if(keys[keys.length - 1] === e.key){
                  e.preventDefault();
                  return p.keyAssigns[assigns[i]]();/*最後が通常キー*/
                }
              }
            }
          });
        }, true);
      },
      open: function(panel){
        let panels = elements.panels;
        if(!panel.isConnected){
          panel.classList.add('hidden');
          panels.insertBefore(panel, Array.from(panels.children).find((p) => panel.dataset.order < p.dataset.order));
        }
        panels.dataset.panels = parseInt(panels.dataset.panels) + 1;
        animate(function(){panel.classList.remove('hidden')});
      },
      show: function(panel){
        core.panel.open(panel);
      },
      hide: function(panel, close = false){
        if(panel.classList.contains('hidden')) return;/*連続Escなどによる二重起動を避ける*/
        let panels = elements.panels;
        panel.classList.add('hidden');
        panel.addEventListener('transitionend', function(e){
          panels.dataset.panels = parseInt(panels.dataset.panels) - 1;
          if(close){
            panels.removeChild(panel);
            elements[panel.dataset.name] = null;
          }
        }, {once: true});
      },
      close: function(panel){
        core.panel.hide(panel, true);
      },
      toggle: function(panel, open, close){
        if(!panel.isConnected || panel.classList.contains('hidden')) open();
        else close();
      },
    },
    addStyle: function(name = 'style'){
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      mini_screen: () => `<use xlink:href="/images/icons/mini_screen.svg#svg-body"></use>`,
      canvasDiv: () => `
        <div id="${SCRIPTNAME}-canvas"></div>
      `,
      preCanvas: () => `
        <canvas width="0" height="0"></canvas>
      `,
      scrollComment: (width, height) => `
        <canvas class="comment" width="${width}" height="${height}"></canvas>
      `,
      ngButton: () => `
        <button id="${SCRIPTNAME}-ng-button" title="${SCRIPTNAME} 登録NGワード一覧"><svg width="20" height="20"><use xlink:href="/images/icons/list.svg#svg-body"></use></svg></button>
      `,
      ngForm: () => `
        <div id="${SCRIPTNAME}-ng-form">
          <h1><span>NGワード登録</span><button class="list"><svg width="14" height="16"><use xlink:href="/images/icons/list.svg#svg-body"></use></svg></button></h1>
          <p class="word"><input type="text" value=""><button class="help">?</button></p>
          <p class="type"><button class="trial">お試し</button><button class="for24h">24時間</button><button class="forever">無期限</button></p>
        </div>
      `,
      ngListPanel: () => `
        <div class="panel" id="${SCRIPTNAME}-ng-list" data-name="ngListPanel" data-order="1">
          <header>
            <h1>登録NGワード一覧</h1>
            <p class="buttons"><button class="help">?</button></p>
          </header>
          <p class="sort">
            <input type="radio" name="sort" id="ngwords-sort-date" value="date"><label for="ngwords-sort-date">登録日時順</label>
            <input type="radio" name="sort" id="ngwords-sort-word" value="word"><label for="ngwords-sort-word">NGワード順</label>
            <input type="radio" name="sort" id="ngwords-sort-type" value="type"><label for="ngwords-sort-type">期限順</label>
          </p>
          <ul>
            <li class="template">
              <p class="word"><input type="text" name="ngwords[{i}][value]" value=""></p>
              <p class="type">
                <input type="radio" name="ngwords[type][{i}]" id="ngwords-type-{i}-trial"   value="trial"  ><label class="trial"   for="ngwords-type-{i}-trial"  >お試し</label>
                <input type="radio" name="ngwords[type][{i}]" id="ngwords-type-{i}-for24h"  value="for24h" ><label class="for24h"  for="ngwords-type-{i}-for24h" >24時間</label>
                <input type="radio" name="ngwords[type][{i}]" id="ngwords-type-{i}-forever" value="forever"><label class="forever" for="ngwords-type-{i}-forever">無期限</label>
                <input type="radio" name="ngwords[type][{i}]" id="ngwords-type-{i}-remove"  value="remove" ><label class="remove"  for="ngwords-type-{i}-remove" >削除</label>
              </p>
            </li>
            <li class="add">
              <p class="words"><textarea name="ngwords[add][value]" placeholder="追加"></textarea></p>
              <p class="type">
                <input type="radio" name="ngwords[type][add]" id="ngwords-type-add-trial"   value="trial"  ><label class="trial"   for="ngwords-type-add-trial"  >お試し</label>
                <input type="radio" name="ngwords[type][add]" id="ngwords-type-add-for24h"  value="for24h" ><label class="for24h"  for="ngwords-type-add-for24h" >24時間</label>
                <input type="radio" name="ngwords[type][add]" id="ngwords-type-add-forever" value="forever"><label class="forever" for="ngwords-type-add-forever">無期限</label>
                <input type="radio" name="ngwords[type][add]" id="ngwords-type-add-remove"  value="remove" ><label class="remove"  for="ngwords-type-add-remove" >削除</label>
              </p>
            </li>
          </ul>
          <p class="buttons"><button class="cancel">キャンセル</button><button class="save primary">保存</button></p>
        </div>
      `,
      ngHelpPanel: () => `
        <div class="panel" id="${SCRIPTNAME}-ng-help" data-name="ngHelpPanel" data-order="2">
          <h1>NGワードについて</h1>
          <p>登録したワードを含むコメントを削除します。</p>
          <p>お試しの場合はハイライト表示されるので、NG対象の確認や、NGとは逆の注目したいキーワードとしても活用できます。24時間の場合は登録時からの期限付きなので、ネタバレや時事ネタなど一時的なNGとしてご活用ください。</p>
          <p>コメント一覧のテキスト選択から登録できるほか、NGワード一覧ボタンをクリックして、登録したNGワードを編集したり、複数行での一括登録もできます。</p>
          <p>英数字と記号とカタカナは、全角半角や大文字小文字を区別しません。</p>
          <p>下記のような正規表現も使えます。</p>
          <section>
            <h2>「NGです」を消す登録例:</h2>
            <dl>
              <dt><code>NG</code></dt><dd>通常のNGワード</dd>
              <dt><code>/^NG/</code></dt><dd>前方一致</dd>
              <dt><code>/です$/</code></dt><dd>後方一致</dd>
              <dt><code>/^NGです$/</code></dt><dd>完全一致</dd>
            </dl>
            <h2>そのほかの例:</h2>
            <dl>
              <dt><code>/^.$/</code></dt><dd>1文字だけのコメント</dd>
              <dt><code>/.{30}/</code></dt><dd>30文字以上のコメント</dd>
              <dt><code>/^[a-z]+$/i</code></dt><dd>アルファベットだけのコメント</dd>
              <dt><code>/[0-9]{3}/</code></dt><dd>3桁以上の数字を含むコメント</dd>
            </dl>
          </section>
          <p class="buttons"><button class="ok primary">OK</button></p>
        </div>
      `,
      configButton: () => `
        <button id="${SCRIPTNAME}-config-button" title="${SCRIPTNAME} 設定"><svg width="20" height="20" role="img"><use xlink:href="/images/icons/config.svg#svg-body"></use></svg></button>
      `,
      configPanel: () => `
        <div class="panel" id="${SCRIPTNAME}-config-panel" data-name="configPanel" data-order="3">
          <h1>${SCRIPTNAME}設定</h1>
          <fieldset>
            <legend>スクロールコメント</legend>
            <p><label>最大行数(文字サイズ連動):       <input type="number"   name="maxlines"        value="${configs.maxlines}"        min="0"  max="50"  step="1"></label></p>
            <p><label>行間(比率):                     <input type="number"   name="linemargin"      value="${configs.linemargin}"      min="0"  max="1"   step="0.05"></label></p>
            <p><label>透明度(%):                      <input type="number"   name="transparency"    value="${configs.transparency}"    min="0"  max="100" step="5"></label></p>
            <p><label>縁取りの太さ(比率):             <input type="number"   name="owidth"          value="${configs.owidth}"          min="0"  max="0.5" step="0.01"></label></p>
            <p><label>横断にかける秒数:               <input type="number"   name="duration"        value="${configs.duration}"        min="1"  max="30"  step="1"></label></p>
            <p><label>最大同時表示数:                 <input type="number"   name="maxcomments"     value="${configs.maxcomments}"     min="0"  max="100" step="1"></label></p>
            <p><label>フォント指定<sup>※</sup>:      <input type="text"     name="font"            value="${configs.font.replace(/"/g, '&quot;')}" placeholder="Arial, sans-serif" pattern="[^/*{}:;]+"></label></p>
            <p class="note">※フォントによっては、一部の文字の上下が切れてしまうことがあります。</p>
          </fieldset>
          <fieldset>
            <legend>一覧コメント</legend>
            <p><label>操作していない時は画面外に隠す: <input type="checkbox" name="l_hide"          value="${configs.l_hide}"          ${configs.l_hide      ? 'checked' : ''}></label></p>
            <p><label>透過して映像に重ねて配置する:   <input type="checkbox" name="l_overlay"       value="${configs.l_overlay}"       ${configs.l_overlay   ? 'checked' : ''}></label></p>
            <p class="sub ${configs.l_overlay ? '' : 'disabled'}"><label>文字の透明度(%): <input type="number" name="lc_transparency" value="${configs.lc_transparency}" min="0"  max="100" step="5" ${configs.l_overlay ? '' : 'disabled'}></label></p>
            <p class="sub ${configs.l_overlay ? '' : 'disabled'}"><label>背景の透明度(%): <input type="number" name="lb_transparency" value="${configs.lb_transparency}" min="0"  max="100" step="5" ${configs.l_overlay ? '' : 'disabled'}></label></p>
            <p><label>横幅(%):                        <input type="number"   name="l_width"         value="${configs.l_width}"         min="0"  max="100" step="0.5"></label></p>
            <p><label>最大行数(文字サイズ連動):       <input type="number"   name="lc_maxlines"     value="${configs.lc_maxlines}"     min="10" max="100" step="1"></label></p>
            <p><label>改行されたコメントの行間(比率): <input type="number"   name="lc_linemargin"   value="${configs.lc_linemargin}"   min="0"  max="1"   step="0.05"></label></p>
            <p><label>コメント同士の間隔(比率):       <input type="number"   name="lc_margin"       value="${configs.lc_margin}"       min="0"  max="2"   step="0.05"></label></p>
            <p><label>投稿時刻を表示する:             <input type="checkbox" name="l_showtime"      value="${configs.l_showtime}"      ${configs.l_showtime  ? 'checked' : ''}></label></p>
          </fieldset>
          <fieldset>
            <legend>アベマのナビゲーション</legend>
            <p><label>画面クリック時のみ表示する:     <input type="checkbox" name="n_clickonly"     value="${configs.n_clickonly}"     ${configs.n_clickonly ? 'checked' : ''}></label></p>
            <p><label>隠れるまでの時間(秒):           <input type="number"   name="n_delay"         value="${configs.n_delay}"         min="1"  max="60"  step="1"></label></p>
            <p><label>透明度(%):                      <input type="number"   name="n_transparency"  value="${configs.n_transparency}"  min="0"  max="100" step="5"></label></p>
          </fieldset>
          <p class="buttons"><button class="cancel">キャンセル</button><button class="save primary">保存</button></p>
        </div>
      `,
      panels: () => `
        <div class="panels" id="${SCRIPTNAME}-panels"></div>
      `,
      initialStyle: () => `
        <style type="text/css">
          /* ブラウザ警告 */
          [class*="NotificationManager"]{
            animation: ${SCRIPTNAME}-dim 1 4000ms forwards;
          }
          @keyframes ${SCRIPTNAME}-dim{
              0%/*    0ms */{opacity: .5; pointer-events: auto;}
             75%/* 3000ms */{opacity: .5; pointer-events: auto;}
            100%/* 4000ms */{opacity: .0; pointer-events: none;}
          }
          [class*="NotificationManager"] > div{
            background: rgba(0,0,0,.5);
            color: white;
          }
        </style>
      `,
      style: () => `
        <style type="text/css">
          /* 共通変数 */
          /* opacity:                ${configs.opacity    = 1 - (configs.transparency / 100)} */
          /* lc_opacity:             ${configs.lc_opacity = 1 - (configs.lc_transparency / 100)} */
          /* lb_opacity:             ${configs.lb_opacity = 1 - (configs.lb_transparency / 100)} */
          /* n_opacity:              ${configs.n_opacity  = 1 - (configs.n_transparency / 100)} */
          /* lb_opacityVivid:        ${configs.lb_opacityVivid = 1 - (configs.lb_transparency / 200)} */
          /* n_opacityVivid:         ${configs.n_opacityVivid  = 1 - (configs.n_transparency / 200)} */
          /* fontsize:               ${configs.fontsize = (100 / (configs.maxlines || 1)) / (1 + configs.linemargin)} (設定値の表現をわかりやすくする代償はここで支払う) */
          /* lc_fontsize:            ${configs.lc_fontsize = (100 / (configs.lc_maxlines + 1)) / (1 + configs.lc_margin)} (設定値の表現をわかりやすくする代償はここで支払う) */
          /* header_height:          ${configs.header_height = configs.header_height || elements.header.firstElementChild.clientHeight} */
          /* footer_height:          ${configs.footer_height = configs.footer_height || elements.footer.firstElementChild.children[1].clientHeight} */
          /* channelButtons_size:    ${configs.channelButtons_size = configs.channelButtons_size || elements.channelButtons.firstElementChild.clientWidth} */
          /* screen_zIndex:          ${configs.screen_zIndex          =   2} */
          /* canvas_zIndex:          ${configs.canvas_zIndex          =   3} */
          /* header_zIndex:          ${configs.header_zIndex          =   8} */
          /* footer_zIndex:          ${configs.footer_zIndex          =   8} */
          /* commentPane_zIndex:     ${configs.commentPane_zIndex     =   9} */
          /* headerHover_zIndex:     ${configs.headerHover_zIndex     =  10} */
          /* footerHover_zIndex:     ${configs.footerHover_zIndex     =  10} */
          /* channelButtons_zIndex1: ${configs.channelButtons_zIndex1 =  10} */
          /* channelPane_zIndex:     ${configs.channelPane_zIndex     =  11} */
          /* programPane_zIndex:     ${configs.programPane_zIndex     =  11} */
          /* channelButtons_zIndex2: ${configs.channelButtons_zIndex2 =  12} */
          /* panel_zIndex:           ${configs.panel_zIndex           = 100} */
          /* nav_transition:         ${configs.nav_transition         = `250ms ${EASING}`} */
          /* nav_transitionDelay:    ${configs.nav_transitionDelay    = `250ms ${EASING} 500ms`} */
          /* アベマ公式のバグ回避 */
          dummy.abm_6f22b5b9_a{
            opacity: 0 !important;/*真っ暗バグの回避と、チャンネル切り替え時のわずらわしいフラッシュも回避*/
          }
          [data-selector="screen"] > div > div:first-child{
            background: black;/*バグじゃないだろうけど映像が黒だとグレイが特に目立つので*/
          }
          /* アベマ公式の不要要素 */
          /* (レイアウトを崩す謎要素に、とりあえず穏便に表示位置の調整で対応する) */
          .pub_300x250,
          .pub_300x250m,
          .pub_728x90,
          .text-ad,
          .textAd,
          .text_ad,
          .text_ads,
          .text-ads,
          .text-ad-links,
          #announcer,
          dummy{
            position: absolute;
            bottom: 0;
          }
          /* スクロールコメント */
          #${SCRIPTNAME}-canvas{
            z-index: ${configs.canvas_zIndex};
            pointer-events: none;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            overflow: hidden;
            opacity: 0;/*コメント非表示なら速やかに消える*/
            transition: opacity ${configs.nav_transitionDelay}, width ${configs.nav_transition}, height ${configs.nav_transition};
          }
          html.comment #${SCRIPTNAME}-canvas,
          #${SCRIPTNAME}-canvas.keep{
            opacity: ${configs.opacity};
          }
          #${SCRIPTNAME}-canvas > canvas{
            position: absolute;
            left: 100%;
            transition: transform ${configs.duration}s linear;
            will-change: transform;
            pointer-events: none;/*継承されないので*/
          }
          /* 映像 */
          [data-selector="parent"]{
            transition: ${configs.nav_transition};
          }
          [data-selector="screen"]{
            /* widthはコメントペインに応じて可変 */
            height: 100% !important;
            transition: ${configs.nav_transition};
          }
          [data-selector="screen"] > button + div,
          [data-selector="screen"] > button + div > div{
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            right: 0 !important;
            transition: ${configs.nav_transition};
          }
          [data-selector="closer"]{
            pointer-events: auto;
          }
          [data-selector="screen"] video{
            transition: ${configs.nav_transition};
          }
          ${configs.l_hide ? 'html.active' : ''} [data-selector="screen"][data-shift="true"]/*コメント一覧幅シフト可能*/ video{
            padding-right: ${configs.l_width}vw;
          }
          /* コメントペインの表示非表示 */
          [data-selector="commentPane"]{
            width: auto;
            padding-left: ${configs.l_hide ? configs.l_width : .75}vw;/*隠れているときもマウスオーバー領域を確保する*/
            transform: translateX(100%);
            z-index: ${configs.commentPane_zIndex};
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition};
          }
          html.comment [data-selector="commentPane"],
          [data-selector="commentPane"].keep/*core.closeOpenCommentPane用*/{
            transform: translateX(${configs.l_hide ? 50 : 0}%);
          }
          html.comment [data-selector="commentPane"]:hover,
          html.comment [data-selector="commentPane"][data-active="true"],
          html.comment.active [data-selector="commentPane"]{
            transform: translateX(0);/*表示*/
            padding-left: .75vw;
          }
          html.comment [data-selector="commentPane"]:hover{
            transition: transform ${configs.nav_transitionDelay}, padding ${configs.nav_transitionDelay};
          }
          [data-selector="commentPane"] > div{
            width: ${configs.l_width}vw;
            position: relative;
          }
          [data-selector="commentPane"] [class$="comment-SnackBarTransition"]{
            left: auto;
          }
          [data-selector="commentPane"] [data-selector="board"] > div > div:not([data-selector="comment"]) > div{
            margin: auto;/*全称セレクタ(*)のせいでローディングアニメーションが左に寄ってしまうので*/
          }
          html:not(.comment) [data-selector="commentPane"] [class$="Loading"] *{
            animation: none;/*画面外のローディングアニメーションにCPUを消費するアベマの悲しい仕様を上書き*/
          }
          /* コメントペインの透過 */
          [data-selector="commentPane"] > div{
            background: rgba(0,0,0,${configs.l_overlay ? configs.lb_opacity : 1});
            mask-image: linear-gradient(black 75%, transparent 100%);/*透過していくマスクを用意しておいて...*/
            -webkit-mask-image: linear-gradient(black 75%, transparent 100%);/*まだ-webkit取れない*/
            /*Macのwebkitのみ(!)アニメーション時にmaskが無効になるバグがあるので注意*/
            mask-size: 100% 200%;/*透過しない部分だけを見せる(トリッキー!!)*/
            -webkit-mask-size: 100% 200%;/*まだ-webkit取れない*/
            transition: mask-size ${configs.nav_transition}, -webkit-mask-size ${configs.nav_transition};
          }
          [data-selector="footer"]:hover ~ div > [data-selector="commentPane"] > div/*フッタにマウスホバー中*/,
          html.active [data-selector="commentPane"] > div/*フッタを含むナビゲーション表示中*/{
            background: rgba(0,0,0,${configs.l_overlay ? configs.lb_opacity : '1'});/*透明度を指定しないと効かない*/
            mask-size: 100% 100%;/*フッタが見やすいように下側だけを透過させる*/
            -webkit-mask-size: 100% 100%;/*まだ-webkit取れない*/
          }
          [data-selector="footer"]:hover ~ div > [data-selector="commentPane"] > div/*フッタにマウスホバー中*/{
            transition: mask-size ${configs.nav_transitionDelay}, -webkit-mask-size ${configs.nav_transitionDelay};
          }
          [data-selector="commentPane"],
          [data-selector="commentPane"] *{
            color: rgba(255,255,255,${configs.l_overlay ? configs.lc_opacity : 1}) !important;
            background: transparent;
          }
          /* コメントペインの統一フォントサイズ */
          [data-selector="commentPane"] *{
            font-size: ${configs.lc_fontsize}vh;
          }
          /* コメント投稿フォーム*/
          [class*="-comment-SnackBar"]/*投稿失敗時などの案内*/{
            pointer-events: none;/*なぜか入力欄を邪魔してしまうので*/
          }
          [data-selector="commentForm"],
          [data-selector="commentForm"] */*リセット*/{
            padding: 0;
            margin: 0;
          }
          [data-selector="commentForm"]{
            width: auto;
            padding: 0 .75vw;
            z-index: 10;/*新着コメントに隠れるバグを回避(公式もおかしい)*/
          }
          [data-selector="commentForm"] [class*="textarea-wrapper"]/*textareaの親*/{
            background: rgba(32,32,32,${configs.l_overlay ? configs.lb_opacity : 1});
            border-radius: .2vw;
            padding: .5vw;
            margin: .75vw 0;
          }
          [data-selector="commentForm"] textarea,
          [data-selector="commentForm"] textarea + div/*textareaの分身*/{
            width: calc(${configs.l_width}vw - 2.5vw);/*公式の指定を上書き*/
          }
          [data-selector="commentForm"] textarea + div > span:nth-child(2)/*文字数制限を超過した文字*/{
            border-bottom: 1px solid red;
          }
          [data-selector="commentForm"] [class*="twitter-wrapper"]/*(Twitter)連携する/連携中(バルーン含む)*/{
            width: 100%;
            padding-bottom: 1vw;
          }
          [data-selector="commentForm"] [class*="twitter-wrapper"] [class*="twitter-button"]/*(Twitter)連携する/連携中ボタン*/{
            width: calc(100% - 1vw);
            border-radius: .2vw;
            padding: 0 .5vw;
            height: ${configs.lc_fontsize * 2}vh;
            line-height: ${configs.lc_fontsize * 2}vh;
            overflow: hidden;
          }
          [data-selector="commentForm"] [class*="twitter-wrapper"] [class*="twitter-button--active"]/*(Twitter)連携中ボタン*/{
            background: rgba(80,163,225,${configs.l_overlay ? configs.lb_opacityVivid : 1});
          }
          [data-selector="commentForm"] [class*="twitter-wrapper"] [class*="twitter-icon"]/*(Twitter)鳥アイコン*/{
            width: ${configs.lc_fontsize * (17/13)}vh;
            height: ${configs.lc_fontsize}vh;
            margin-right: 0.2vw;
          }
          [data-selector="commentForm"] [class*="CommentForm__etc-modules"] [class*="CommentForm__count"]/*残り文字数*/{
            padding: .5vw;
          }
          [data-selector="commentForm"] [class*="CommentForm__etc-modules"] [class*="post-button"]/*投稿する*/{
            border-radius: .2vw;
            padding: 0 .5vw;
            height: ${configs.lc_fontsize * 2}vh;
            line-height: ${configs.lc_fontsize * 2}vh;
            overflow: hidden;
            background: rgba(81,195,0,${configs.l_overlay ? configs.lb_opacityVivid : 1});
          }
          [data-selector="commentForm"] [class*="twitter-balloon"]/*(Twitterアカウントバルーン)*/{
            border: 1px solid black;
            border-radius: .2vw;
            background: rgba(0,0,0,${configs.lb_opacityVivid});
            width: calc(100% - 1.5vw);
            padding: .5em;
            top: .75vw;
            opacity: 0;/*transitionさせたいので*/
            display: block;/*transitionさせたいので*/
            pointer-events: none;/*transitionさせたいので*/
            transition: ${configs.nav_transition};
          }
          [data-selector="commentForm"] [class*="twitter-balloon--show"]/*(Twitterアカウントバルーン表示中)*/{
            opacity: 1;
            pointer-events: auto;
          }
          [data-selector="commentForm"] [class*="CommentForm__twitter-account"] > div:first-child > div/*アカウントアイコンの親*/{
            margin: .1vw;
          }
          [data-selector="commentForm"] [class*="CommentForm__twitter-account"] > div:first-child > div/*アカウントアイコンの親*/,
          [data-selector="commentForm"] [class*="CommentForm__twitter-profile-thumbnail"]/*アカウントアイコン*/{
            width: ${configs.lc_fontsize * 3}vh !important;
            height: ${configs.lc_fontsize * 3}vh !important;
            border-radius: .2vw;
          }
          [data-selector="commentForm"] [class*="CommentForm__twitter-account"] > div:last-child/*アカウント情報*/{
            line-height: ${configs.lc_fontsize * 3/2}vh;
            padding: .1vw .5vw;
            bottom: 0;
          }
          [data-selector="commentForm"] [class*="CommentForm__twitter-logout"]/*ログアウト*/{
            padding: .1vw .2vw;
            position: absolute;
            bottom: 0;
            right: 0;
          }
          /* コメント投稿フォームの表示制御 */
          [data-selector="commentPane"][data-active="true"] [data-selector="commentForm"]{
            animation: ${SCRIPTNAME}-flash 4s 1 ease;
          }
          @keyframes ${SCRIPTNAME}-flash{
              0%{background: rgba(81,195,0,${configs.n_opacity});}
             50%{background: rgba(81,195,0,${configs.n_opacity});}
            100%{background: transparent;}
          }
          [data-selector="commentPane"][data-active="true"] [data-selector="commentForm"] [class*="opened-textarea-wrapper"]{
            border-color: rgba(81,195,0,1);
          }
          [data-selector="commentPane"] [class*="CommentForm__etc-modules"]/*(Twitter)連携する/連携中・文字数・投稿するボタン*/{
            transition: height 1s ease;/*ゆっくりなめらかのほうが優れる*/
            height: 0;
            overflow: hidden;
          }
          [data-selector="commentPane"][data-active="true"] [class*="CommentForm__etc-modules"]/*(Twitter)連携する/連携中・文字数・投稿するボタン*/{
            height: calc(${configs.lc_fontsize * 1.5}vh + 1vw);
            transition: height 1s ease 1s;/*出るときは少し遅らせる*/
          }
          /* 新着コメント表示ボタン */
          [data-selector="commentPane"] > div > button/*セレクタ付与前から適用したい*/{
            height: 0;/*デフォルトで非表示*/
          }
          [data-selector="newCommentsButton"]{
            background: rgba(81,195,0,${configs.l_overlay ? configs.lb_opacityVivid : 1}) !important;
            border: none;
            width: auto;
            min-width: 60%;
            margin: 0 auto;
            padding: 0 .5em;
            line-height: 3em;
            overflow: hidden !important;
            transition: height ${configs.nav_transition};
          }
          [data-selector="newCommentsButton"].shown{
            height: 3em;
          }
          [data-selector="newCommentsButton"]:hover{
            opacity: .75;
          }
          /* 新着コメントのハイライト */
          [data-selector="board"] > div > div,/*コメントセレクタ付与直前の一瞬も許さない*/
          [data-selector="comment"]{
            transition: background 1000ms;
            animation: none !important;/*公式のハイライト処理を回避*/
          }
          [data-selector="comment"][data-new="true"]{
            background: rgba(255,255,255,${configs.l_overlay ? '.125' : '.1875'});
            transition: background 0ms;
          }
          html:not(.active) [data-selector="commentPane"]:not(:hover) [data-selector="board"] > div{
            ${configs.l_hide ? 'transition: none !important;' : ''}/*画面外に隠れてるときはCPU負荷を下げる*/
          }
          /* コメント一覧 */
          /* (セレクタがNGワード登録フォームと合致しないように気を付ける) */
          [data-selector="board"] */*リセット*/{
            padding: 0;
            margin: 0;
          }
          [data-selector="board"] > div > span/*「まだ投稿がありません」のあやうい判定*/{
            margin-left: 20%;
            display: block;
          }
          [data-selector="comment"]{
            padding: 0 .75vw;
          }
          [data-selector="comment"] > div:first-child{
            background: transparent !important;/*アベマ公式を上書き*/
            padding: 0 .75vw;/*newに対してng,ownerなど色を重ねるためのhack*/
            margin: 0 -.75vw;
          }
          [data-selector="comment"][data-is-owner="true"] > div:first-child/*自分が投稿したコメント*/{
            background: rgba(81,195,0,${configs.l_overlay ? '.1875' : '.250'}) !important;
          }
          [data-selector="board"] div:not([id]) > p/*コメント*/,
          [data-selector="board"] div:not([id]) > p + div/*経過時間・ブロックボタン*/{
            margin: ${configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh 0;
            line-height: ${1 + configs.lc_linemargin};
          }
          [data-selector="board"] div:not([id]) > p/*コメント*/{
            word-wrap: break-word;
          }
          [data-selector="board"] div:not([id]) > p + div/*経過時間・ブロックボタン*/{
            display: ${(configs.l_showtime) ? 'block' : 'none'};
            filter: opacity(${configs.l_overlay ? '75%' : '50%'});
            width: 4em;/*00秒前*/
            white-space: nowrap;
          }
          [data-selector="board"] div:not([id]) > p + div > button/*ブロックボタン*/{
            padding: ${configs.lc_margin / 2}em  ${configs.lc_margin}em;
            margin: -${configs.lc_margin / 2}em -${configs.lc_margin}em;
          }
          [data-selector="board"] div:not([id]) > p + div > button/*ブロックボタン*/ > svg{
            width: ${configs.lc_fontsize}vh;
            max-width: ${configs.lc_fontsize}vh;/*max指定しておけばword-break-allしなくてすむ*/
            height: ${configs.lc_fontsize}vh;
          }
          /* アベマ公式ブロック */
          [data-selector="comment"]{
            cursor: pointer;
          }
          [data-selector="comment"][data-blockform="true"]{
            background: rgba(255,255,255,.25);
            border-bottom: 1px solid transparent;/*マージンの相殺を回避する*/
          }
          [data-selector="comment"] + form{
            background: rgba(255,255,255,.25) !important;
            height: 0;
            padding: 0 .75vw;
            overflow: hidden;
            transition: height ${configs.nav_transition};
          }
          [data-selector="comment"][data-blockform="true"] + form{
            height: calc(${configs.lc_fontsize * 2 + configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) * 1.5}vh + .5em + .75vw);/*アニメーションのためにキッチリ計算*/
          }
          [data-selector="comment"] + form > div:first-child > *{
            white-space: nowrap;
            overflow: hidden;
            margin: 0 0 ${configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh;
          }
          [data-selector="comment"] + form > div:first-child > p/*ブロックします*/{
            flex: 1;
          }
          [data-selector="comment"] + form > div:first-child > button/*キャンセル*/{
            text-align: right;
            width: 5em;
          }
          [data-selector="comment"] + form > div:last-child{
            margin-bottom: .75vw;
          }
          [data-selector="comment"] + form > div:last-child > div/*select*/{
            height: auto;
          }
          [data-selector="comment"] + form > div:last-child > div > span/*つまみ*/{
            right: .5em;
            top: calc(${configs.lc_fontsize / 2 + configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh - .325em);
            border-width: 0.5em;
            border-top-width: .75em;
          }
          [data-selector="comment"] + form > div:last-child > div > select{
            border-radius: .2em 0 0 .2em;
            padding: .25em .125em;
            height: auto;
            border: none;
          }
          [data-selector="comment"] + form > div:last-child > div > select > option{
            padding: 0;
            margin: ${configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh 0;
          }
          [data-selector="comment"] + form > div:last-child > button/*ブロック*/{
            background: #f0163a;
            border-radius: 0 .2em .2em 0;
            padding: 0 1em;
          }
          [data-selector="comment"] + form > div:last-child > button:hover/*ブロック*/{
            background: #bb122e;
          }
          [data-selector="comment"] + form > div:last-child > button > span{
            margin: ${configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh 0;
            line-height: 1.5;
          }
          [data-selector="board"] div:not([id]) + form select,
          [data-selector="board"] div:not([id]) + form select > option{
            color: black !important;
            background: white !important;
          }
          /* コメント一覧のスクロールバー */
          [data-selector="commentPane"] > div > div{
            overflow-y: scroll;
            margin-right: -${getScrollbarWidth()}px;/*スクロールバーを隠す*/
            transition: margin-right 0ms;
          }
          /* 上下ナビゲーションの表示非表示 */
          [data-selector="header"]{
            background: transparent;/*hover用paddingを持たせたいのでbackgroundはdivに移譲*/
            min-width: auto;/*アベマの謎指定を解除*/
            height: auto;
            padding: 0 0 ${configs.header_height}px;
            transform: translateY(calc(-100% + ${configs.header_height}px)) !important;/*隠れているときもマウスオーバー領域を確保する*/
            visibility: visible !important;
            z-index: ${configs.header_zIndex};
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition}, z-index ${configs.nav_transitionDelay};
          }
          [data-selector="header"] > *:first-child{
            padding-left: 16px;
          }
          [data-selector="header"] > *:last-child{
            padding-right: 16px;
          }
          html.active [data-selector="commentPane"] > div{
            padding-top: ${configs.header_height}px;/*右コメント一覧を映像に重ねたせいで上部ナビゲーションと重なるのを避ける*/
          }
          [data-selector="footer"]{
            transform: translateY(calc(100% - ${configs.footer_height}px));/*隠れているときもマウスオーバー領域を確保する*/
            padding-top: ${configs.footer_height}px;
            z-index: ${configs.footer_zIndex};
            visibility: visible !important;
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition};
          }
          html:not(.active) [data-selector="footer"]:not(:hover) > div > *{
            bottom: 0;/*フルスクリーンボタンと音量ボタンが突然消えないようにアベマが指定すべき値*/
          }
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="header"]:hover,
          html.active [data-selector="header"]{
            padding-bottom: ${configs.header_height * (1/2)}px;
            z-index: ${configs.headerHover_zIndex};/*コメントペインに勝たなければならない*/
          }
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="header"]:hover,
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="footer"]:hover{
            transition: transform ${configs.nav_transitionDelay}, padding ${configs.nav_transitionDelay}, z-index 0s;
          }
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="footer"]:hover,
          html.active [data-selector="footer"]{
            padding-top: 0;/*コントローラ要素の高さを頼みにする*/
            z-index: ${configs.footerHover_zIndex};/*コメントペインに勝たなければならない*/
          }
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="header"]:hover,
          html.active [data-selector="header"],
          ${(configs.n_clickonly) ? '' : 'dummy'} [data-selector="footer"]:hover,
          html.active [data-selector="footer"]{
            transform: translateY(0%) !important;
          }
          html.active [data-selector="header"],
          html.active [data-selector="footer"]{
            padding-top: 0;
            padding-bottom: 0;
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition}, z-index 0s;
          }
          /* 上下ナビゲーションの透過 */
          [data-selector="header"] *{
            border-color: rgba(0,0,0,${configs.n_opacity / 2}) !important;
          }
          [data-selector="header"] > *,/*上部(hover用padding付き透明ラッパに包みたいのでdivに適用)*/
          [data-selector="header"] [id*="dropdown-menu"]/*メニュードロップダウン*/,
          [data-selector="footer"] > div > div:last-child/*下部*/{
            background: rgba(0,0,0,${configs.n_opacity}) !important;
            transition: none;/*アベマ公式を上書き*/
          }
          [data-selector="header"] [id*="dropdown-menu"]/*メニュードロップダウン*/ a{
            background: transparent !important;
          }
          [data-selector="header"] a{
            transition: none;/*アベマ公式を上書き*/
          }
          [data-selector="header"] a:hover,
          [data-selector="header"] button:hover{
            background: rgba(0,0,0,${configs.n_opacity / 2}) !important;
          }
          [data-selector="footer"] > div > div:last-child{
            border-top: none;
          }
          [data-selector="programButton"]{
            border-radius: 4px;/*ちょっとおしゃれを演出*/
            margin: 4px;
          }
          /* 通知を受け取るボタンなどの表示非表示 */
          [class$="-Video__container"] ~ div{
            transform: translateX(0);/*アベマ公式のクラス指定で位置がぶれるのを回避*/
            bottom: ${configs.footer_height * 1.5}px !important;
            left: 0;/*位置を左に変更*/
            right: auto;
          }
          [class$="-AdReservationButton"]/*デフォルト(隠れているとき)*/,
          [class$="-AdLinkButton"]{
            transition: transform ${configs.nav_transition};/*常に遅延なし*/
            transform: translate(-100%, 0);
            border-left: none;
            border-right: 1px solid #444;
            border-radius: 0 4px 4px 0;
            position: relative;/*AdLinkButtonに指定がないのはアベマ公式の漏れ？*/
          }
          [class$="-AdReservationButton"][aria-hidden="false"]/*出てきたとき*/,
          [class$="-AdLinkButton"][aria-hidden="false"]{
            transform: translate(0, 0);
          }
          html.program [data-selector="viewCounter"]{/*番組情報が表示されている場合は顔を出す*/
            transform: translate(calc(-${configs.l_width}vw + ${configs.l_overlay ? '0' : configs.l_width}vw - .75vw), .75vw) !important;
          }
          /* 通知を受け取るボタン・ローディングの透過 */
          [class$="-AdReservationButton"],
          [class$="-AdLinkButton"]{
            background: rgba(0,0,0,${configs.n_opacity}) !important;
            pointer-events: auto;
          }
          [data-selector="screen"]/*視聴数をマウスオーバーにちゃんと反応させる工夫*/{
            z-index: ${configs.screen_zIndex};
            pointer-events: none;
          }
          [data-selector="screen"] button{/*補完*/
            pointer-events: auto;
          }
          /* 番組アンケートの透過 */
          [data-selector="enquete"] > div{
            background: rgba(255,255,255,${configs.n_opacityVivid}) !important;
          }
          [data-selector="enquete"] > div button{
            background: rgba(255,255,255,${configs.n_opacityVivid}) !important;
          }
          /* 裏番組一覧の表示非表示 */
          [data-selector="channelPane"]{
            z-index: ${configs.channelPane_zIndex};
            transform: translateX(100%);
            transition: transform ${configs.nav_transition};
          }
          html.channel [data-selector="channelPane"]{
            transform: translateX(0);
          }
          html:not(.channel) [data-selector="channelPane"] [role="progressbar"] *{
            animation: none;/*画面外のローディングアニメーションにCPUを消費するアベマの悲しい仕様を上書き*/
          }
          /* 裏番組一覧の透過 */
          [data-selector="channelPane"] > div{
            background: rgba(0,0,0,${configs.n_opacityVivid});
          }
          [data-selector="channelPane"] > div > a{
            background: transparent;
          }
          [data-selector="channelPane"] > div > a:hover{
            background: rgba(34,34,34,${configs.n_opacityVivid});
          }
          [data-selector="channelPane"] *{
            color: white;
          }
          /* 番組情報の表示非表示 */
          [data-selector="programPane"]{
            z-index: ${configs.programPane_zIndex};
            transform: translateX(100%);
            transition: transform ${configs.nav_transition};
          }
          html.program [data-selector="programPane"]{
            transform: translateX(0);
          }
          /* 番組情報の透過 */
          [data-selector="programPane"]{
            color: white;
            background: rgba(0,0,0,${configs.n_opacityVivid});
          }
          [data-selector="programPane"] svg > use:not([*|href*="_rect.svg"]){/*rectは赤背景*/
            fill: white;
          }
          /* 番組情報のサイズ調整 */
          [data-selector="programPane"]{
            width: ${configs.l_width}vw;
          }
          [data-selector="programPane"] > *{
            padding: .75vw;
          }
          [data-selector="programPane"] > * > *{
            margin-bottom: 1em;
          }
          [data-selector="programPane"] *{
            font-size: ${configs.lc_fontsize}vh;
            line-height: 1.5;
          }
          [data-selector="programPane"] > div > div + ul + div > h3 + p + div/*苦難の末にたどり着くサムネイル*/{
            margin: -.75vw 0 0 -.75vw !important;
          }
          [data-selector="programPane"] > div > div + ul + div > h3 + p + div > div{
            padding: .75vw 0 0 .75vw !important;
          }
          [data-selector="programPane"] > div > div + ul + div > h3 + p + div > div > div{
            width: calc(${configs.l_width / 2}vw - 1.125vw);
            height: auto;
          }
          [data-selector="programPane"] > div > div + ul + div > h3 + p + div > div > div > img{
            width: 100%;
            height: 100%;
          }
          /* 番組リンク(一部の番組で番組情報を開いたときに出現) */
          html.program [data-selector="footer"]{
            pointer-events: none;/*フッタに邪魔されないように*/
          }
          [data-selector="screen"] > button + div > div[aria-hidden]{
            display: none !important;
          }
          html.program [data-selector="screen"] > button + div > div[aria-hidden]{
            display: block !important;
            height: auto !important;
            pointer-events: auto;
          }
          html.program [data-selector="screen"] > button + div > div[aria-hidden] a{
            pointer-events: auto;
          }
          /* ボタン共通 */
          [data-selector="channelButtons"] button *,
          [data-selector="commentButton"] *,
          [data-selector="programButton"] *,
          [data-selector="fullscreenButton"] *{
            pointer-events: none;/*クリックイベント発生箇所を親のボタン要素に統一する*/
          }
          #${SCRIPTNAME}-ng-button svg,
          #${SCRIPTNAME}-config-button svg{
            fill: white;
            vertical-align: middle;
          }
          [data-selector="controller"]{
            height: ${configs.footer_height / 2}px;
            align-items: center;
          }
          [data-selector="controller"] > button/*各ボタン*/,
          [data-selector="controller"] > [data-selector="VolumeController"]{
            padding: 15px 15px  15px  15px;/*クリック判定範囲を広くしてあげる*/
            margin: -15px 15px -15px -15px;
            box-sizing: content-box;
          }
          [data-selector="controller"] > button:hover/*各ボタン*/,
          [data-selector="controller"] > [data-selector="VolumeController"] button:hover/*ボリュームボタン*/{
            opacity: .7;/*アベマ公式がボリュームボタンにだけ指定し忘れているようなので*/
          }
          [data-selector="controller"] > button/*各ボタン*/,
          [data-selector="controller"] > [data-selector="VolumeController"]/*ボリュームボタンセット*/{
            transition: bottom ${configs.nav_transition}, opacity ${configs.nav_transition};
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));/*白い背景で見にくいアベマの悲しい仕様を回避*/
          }
          [data-selector="footer"]:hover > div > button/*各ボタン*/,
          [data-selector="footer"]:hover > div > [data-selector="VolumeController"]/*ボリュームボタンセット*/{
            transition: bottom ${configs.nav_transitionDelay}, opacity ${configs.nav_transition};
          }
          /* 裏番組一覧・チャンネル切り替えボタン */
          [data-selector="channelButtons"]{
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));/*白い背景で見にくいアベマの悲しい仕様を回避*/
            transform: translate(calc(100% - ${configs.channelButtons_size}px), -50%);
            padding: ${configs.channelButtons_size * (1/2)}px 0 ${configs.channelButtons_size * (1/2)}px ${configs.channelButtons_size}px;/*隠れているときもサイズ3/4まではマウスオーバー領域を確保する*/
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition};/*アベマの指定漏れ？*/
            z-index: ${configs.channelButtons_zIndex1};/*フッタ操作を邪魔しない*/
          }
          [data-selector="channelButtons"] button{
            background: rgba(${configs.l_overlay ? `0,0,0,${configs.n_opacity}` : `48,48,48,${configs.n_opacityVivid}`}) !important;
            transition: none;/*アベマ公式を上書き*/
          }
          [data-selector="channelButtons"] button:hover{
            background: rgba(64,64,64,${configs.l_overlay ? configs.n_opacityVivid : '1'}) !important;
          }
          [data-selector="channelButtons"]:hover{
            transition: transform ${configs.nav_transitionDelay}, padding ${configs.nav_transitionDelay};
          }
          [data-selector="channelButtons"]:hover,
          html.active [data-selector="channelButtons"]{
            padding: ${configs.channelButtons_size * (1/2)}px 0 ${configs.channelButtons_size * (1/2)}px ${configs.channelButtons_size * (1/2)}px;
            transform: translate(0%, -50%);
          }
          html.ng [data-selector="channelButtons"]/*NGワード登録中は控えて出しゃばらない*/{
            padding: 0;
            transform: translate(100%, -50%);
          }
          html.channel [data-selector="channelButtons"],
          html.program [data-selector="channelButtons"]{
            z-index: ${configs.channelButtons_zIndex2};/*フッタ操作中ではないはずなので*/
          }
          /* 登録NGワード一覧ボタン */
          /* 設定ボタン */
          button[aria-label="フルスクリーン解除"] + div/*フルスクリーン時のボリュームUIセット*/{
            pointer-events: auto;
          }
          /* フルスクリーンボタン */
          [data-selector="fullscreenButton"][data-icon="mini_screen"] use[*|href^="/images/icons/full_screen.svg"],
          [data-selector="fullscreenButton"][data-icon="full_screen"] use[*|href^="/images/icons/mini_screen.svg"]{
            display: none;
          }
          /* ボリュームボタン */
          [data-selector="controller"] > [data-selector="VolumeController"] button{
            padding: 15px;/*スライダクリック判定へのの架け橋*/
            margin: -15px;
          }
          [data-selector="VolumeController"] button > svg{
            vertical-align: bottom;/*アベマのわずかなズレを修正*/
          }
          [data-selector="VolumeController"] [class$="slider-container"]/*スライダ*/{
            padding: 0 10px;/*クリック判定範囲を広くしてあげる*/
            margin: 0 -10px;
          }
          /* コメントボタン */
          [data-selector="commentButton"]{
            transition: opacity ${configs.nav_transition}/*アベマの指定漏れ？*/, transform ${configs.nav_transition}, margin ${configs.nav_transition};
          }
          [data-selector="commentButton"] > *{
            vertical-align: middle;/*アベマ公式のミス？*/
          }
          html.program [data-selector="commentButton"]{/*番組情報が表示されている場合は顔を出す*/
            transform: translate(calc(-${configs.l_width}vw - .75vw), -${configs.footer_height}px);
            margin: 0;
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));/*白い背景で見にくいので*/
          }
          html.comment.active [data-selector="commentButton"] svg,
          html.comment.program [data-selector="commentButton"] svg,
          html.comment [data-selector="footer"]:hover [data-selector="commentButton"] svg,
          [data-selector="commentPane"].keep [data-selector="commentButton"] svg{
            animation: ${SCRIPTNAME}-spin 1s infinite alternate cubic-bezier(.45,.05,.55,.95)/*sin*/;
          }
          @keyframes ${SCRIPTNAME}-spin{/*CPU食うので注意*/
            from{
              transform: scaleX(1);
            }
            to{
              transform: scaleX(-1);
            }
          }
          /* NGワード登録フォーム */
          #${SCRIPTNAME}-ng-form{
            border-radius: .5vw;
            margin: .25vw 0;
            width: 100%;
            background: rgba(32,32,32,${configs.l_overlay ? configs.lb_opacity : 1});
            height: calc(${configs.lc_fontsize}vh + 2 * ${configs.lc_fontsize * 2}vh + 4 * .5vw);/*アニメーションのためにキッチリ計算*/
            overflow: hidden;
            transition: ${configs.nav_transition};
          }
          #${SCRIPTNAME}-ng-form.hidden{
            height: 0;
            margin-bottom: 0;
          }
          #${SCRIPTNAME}-ng-form h1,
          #${SCRIPTNAME}-ng-form p{
            color: white;
            width: auto;
            margin: .5vw;
            display: flex;
          }
          #${SCRIPTNAME}-ng-form h1{
            line-height: ${configs.lc_fontsize}vh;
          }
          #${SCRIPTNAME}-ng-form p{
            line-height: ${configs.lc_fontsize * 2}vh;
          }
          #${SCRIPTNAME}-ng-form h1 span{
            flex-grow: 1;
          }
          #${SCRIPTNAME}-ng-form h1 button.list{
            width: ${configs.lc_fontsize * 2}vh;
            padding: ${configs.lc_fontsize / 2}vh 0;
            margin: -${configs.lc_fontsize / 2}vh 0;
          }
          #${SCRIPTNAME}-ng-form h1 button.list svg{
            vertical-align: top;
            width: ${configs.lc_fontsize}vh;
            height: ${configs.lc_fontsize}vh;
            fill: white;
          }
          #${SCRIPTNAME}-ng-form button.help{
            width: ${configs.lc_fontsize * 2}vh;
            margin-left: .5vw;
            background: rgba(0,0,0,${configs.lb_opacity});
            border-radius: .25vw;
          }
          #${SCRIPTNAME}-ng-form p.word input{
            color: white;
            border: none;
            border-radius: .25vw;
            background: rgba(0,0,0,${configs.lb_opacity});
            height: ${configs.lc_fontsize * 2}vh;
            padding: 0 .5vw;
            width: 50%;
            flex-grow: 1;
          }
          #${SCRIPTNAME}-ng-form p.type{
            border-radius: .25vw;
            overflow: hidden;
            display: flex;
          }
          #${SCRIPTNAME}-ng-form p.type button{
            color: white;
            font-weight: bold;
            width: 100%;
            margin-left: 1px;
            flex-grow: 1;
            height: ${configs.lc_fontsize * 2}vh;
          }
          #${SCRIPTNAME}-ng-form p.type button.trial{
            margin-left: 0;
            background: rgba(255,224,32,${configs.l_overlay ? configs.lb_opacity : .5});
          }
          #${SCRIPTNAME}-ng-form p.type button.for24h,
          #${SCRIPTNAME}-ng-form p.type button.forever{
            background: rgba(255,32,32,${configs.l_overlay ? configs.lb_opacity : .5});
          }
          #${SCRIPTNAME}-ng-form p.type button.trial:hover,
          #${SCRIPTNAME}-ng-form p.type button.trial:focus{
            color: black;
            background: rgba(255,224,32,${configs.l_overlay ? configs.lb_opacityVivid : 1});
          }
          #${SCRIPTNAME}-ng-form p.type button.for24h:hover,
          #${SCRIPTNAME}-ng-form p.type button.for24h:focus,
          #${SCRIPTNAME}-ng-form p.type button.forever:hover,
          #${SCRIPTNAME}-ng-form p.type button.forever:focus{
            background: rgba(255,32,32,${configs.l_overlay ? configs.lb_opacityVivid : 1});
          }
          #${SCRIPTNAME}-ng-form h1 button.list:hover svg,
          #${SCRIPTNAME}-ng-form h1 button.list:focus svg,
          #${SCRIPTNAME}-ng-form p.word button.help:hover,
          #${SCRIPTNAME}-ng-form p.word button.help:focus{
            filter: brightness(.5);
          }
          /* NGワードコメント */
          [data-selector="comment"][data-ng-trial]{
            cursor: pointer;
          }
          [data-selector="comment"][data-ng-trial] > div:first-child{
            background: rgba(255,224,32,${configs.l_overlay ? configs.lb_opacity : .75}) !important;
            transition: none;
          }
          [data-selector="comment"][data-ng-trial]:hover > div:first-child{
            background: rgba(255,224,32,${configs.l_overlay ? configs.lb_opacity / 2 : .5}) !important;
          }
          [data-selector="comment"][data-ng-trial] > *:first-child/*NGワード登録フォームや公式ブロックには適用しない*/{
            pointer-events: none;/*イベントはcommentで発生させる*/
          }
          [data-selector="comment"][data-ng-deleted]{
            display: none;
          }
          /* パネル共通 */
          #${SCRIPTNAME}-panels{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            pointer-events: none;
          }
          #${SCRIPTNAME}-panels div.panel{
            position: absolute;
            max-height: 100%;/*小さなウィンドウに対応*/
            overflow: auto;
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            z-index: ${configs.panel_zIndex};
            background: rgba(0,0,0,.75);
            transition: ${configs.nav_transition};
            padding: 5px 0;
            pointer-events: auto;
          }
          #${SCRIPTNAME}-panels div.panel.hidden{
            bottom: 0;
            transform: translate(-50%, 100%) !important;
          }
          #${SCRIPTNAME}-panels div.panel.hidden *{
            animation: none !important;/*CPU負荷軽減*/
          }
          #${SCRIPTNAME}-panels h1,
          #${SCRIPTNAME}-panels h2,
          #${SCRIPTNAME}-panels h3,
          #${SCRIPTNAME}-panels h4,
          #${SCRIPTNAME}-panels legend,
          #${SCRIPTNAME}-panels li,
          #${SCRIPTNAME}-panels dl,
          #${SCRIPTNAME}-panels code,
          #${SCRIPTNAME}-panels p{
            color: rgba(255,255,255,1);
            font-size: 14px;
            padding: 2px 10px;
            line-height: 1.4;
          }
          #${SCRIPTNAME}-panels header{
            display: flex;
          }
          #${SCRIPTNAME}-panels header h1{
            flex: 1;
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons{
            text-align: right;
            padding: 5px 10px;
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button{
            width: 120px;
            padding: 5px 10px;
            margin-left: 10px;
            border-radius: 5px;
            color: rgba(255,255,255,1);
            background: rgba(64,64,64,1);
            border: 1px solid rgba(255,255,255,1);
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button.primary{
            font-weight: bold;
            background: rgba(0,0,0,1);
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button:hover,
          #${SCRIPTNAME}-panels div.panel > p.buttons button:focus{
            background: rgba(128,128,128,.875);
          }
          #${SCRIPTNAME}-panels .template{
            display: none !important;
          }
          #${SCRIPTNAME}-panels[data-panels="2"] div.panel:nth-child(1){
            transform: translate(-100%, 50%);
          }
          #${SCRIPTNAME}-panels[data-panels="2"] div.panel:nth-child(2){
            transform: translate(0%, 50%);
          }
          #${SCRIPTNAME}-panels[data-panels="3"] div.panel:nth-child(1){
            transform: translate(-150%, 50%);
          }
          #${SCRIPTNAME}-panels[data-panels="3"] div.panel:nth-child(3){
            transform: translate(50%, 50%);
          }
          /* NGワード一覧 */
          #${SCRIPTNAME}-ng-list{
            width: 360px;
          }
          #${SCRIPTNAME}-ng-list button.help{
            color: white;
            width: 20px;
            background: rgba(0,0,0,.5);
            border-radius: 5px;
          }
          #${SCRIPTNAME}-ng-list button.help:hover,
          #${SCRIPTNAME}-ng-list button.help:focus{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-ng-list p.sort{
            width: 80%;
            height: 20px;
            padding: 0;
            margin: 5px auto;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
          }
          #${SCRIPTNAME}-ng-list p.sort.disabled{
            filter: brightness(.5);
            pointer-events: none;
          }
          #${SCRIPTNAME}-ng-list p.sort input{
            display: none;
          }
          #${SCRIPTNAME}-ng-list p.sort label{
            color: white;
            background: rgba(128,128,128,.25);
            font-size: 10px;
            line-height: 20px;
            text-align: center;
            width: 100%;
            margin-left: 1px;
          }
          #${SCRIPTNAME}-ng-list p.sort label:first-of-type{
            margin-left: 0;
          }
          #${SCRIPTNAME}-ng-list p.sort input + label::after{
            font-size: 75%;
            vertical-align: top;
            content: " ▼";
          }
          #${SCRIPTNAME}-ng-list p.sort input.reverse + label::after{
            content: " ▲";
          }
          #${SCRIPTNAME}-ng-list p.sort input:checked + label,
          #${SCRIPTNAME}-ng-list p.sort label:hover,
          #${SCRIPTNAME}-ng-list p.sort label:focus{
            background: rgba(128,128,128,.75);
          }
          #${SCRIPTNAME}-ng-list ul{
            max-height: calc(${window.innerHeight}px - (5px + 24px + 30px + 42px + 5px) - 20px);
            overflow-y: auto;
          }
          #${SCRIPTNAME}-ng-list ul > li{
            padding: 2px 10px;
            display: flex;
          }
          #${SCRIPTNAME}-ng-list p.word,
          #${SCRIPTNAME}-ng-list p.words{
            padding: 0;
            flex: 1;
          }
          #${SCRIPTNAME}-ng-list p.word input,
          #${SCRIPTNAME}-ng-list p.words textarea{
            font-size: 12px;
            width: 100%;
          }
          #${SCRIPTNAME}-ng-list p.word input{
            height: 20px;
          }
          #${SCRIPTNAME}-ng-list p.words textarea{
            height: 40px;
            resize: vertical;
          }
          #${SCRIPTNAME}-ng-list p.type{
            height: 20px;
            border-radius: 5px;
            overflow: hidden;
            padding: 0;
            margin-left: 10px;
            flex: 1;
            display: flex;
          }
          #${SCRIPTNAME}-ng-list p.type input{
            display: none;
          }
          #${SCRIPTNAME}-ng-list p.type label{
            text-align: center;
            font-size: 10px;
            line-height: 20px;
            font-weight: bold;
            width: 100%;
            margin-left: 1px;
          }
          #${SCRIPTNAME}-ng-list p.type label.trial{
            margin-left: 0;
            background: rgba(255,224,32,.25);
          }
          #${SCRIPTNAME}-ng-list p.type label.for24h,
          #${SCRIPTNAME}-ng-list p.type label.forever{
            background: rgba(255,32,32,.25);
          }
          #${SCRIPTNAME}-ng-list p.type input:checked + label.trial,
          #${SCRIPTNAME}-ng-list p.type label.trial:hover,
          #${SCRIPTNAME}-ng-list p.type label.trial:focus{
            color: black;
            background: rgba(255,224,32,.75);
          }
          #${SCRIPTNAME}-ng-list p.type input:checked + label.for24h,
          #${SCRIPTNAME}-ng-list p.type label.for24h:hover,
          #${SCRIPTNAME}-ng-list p.type label.for24h:focus,
          #${SCRIPTNAME}-ng-list p.type input:checked + label.forever,
          #${SCRIPTNAME}-ng-list p.type label.forever:hover,
          #${SCRIPTNAME}-ng-list p.type label.forever:focus{
            background: rgba(255,32,32,.75);
          }
          #${SCRIPTNAME}-ng-list p.type label.remove{
            background: rgba(128,128,128,.25);
          }
          #${SCRIPTNAME}-ng-list p.type input:checked + label.remove,
          #${SCRIPTNAME}-ng-list p.type label.remove:hover,
          #${SCRIPTNAME}-ng-list p.type label.remove:focus{
            background: rgba(128,128,128,.75);
          }
          #${SCRIPTNAME}-ng-list li.add p.type label.remove{
            visibility: hidden;
          }
          #${SCRIPTNAME}-ng-list input + label{
            cursor: pointer;
          }
          /* NGヘルプパネル */
          #${SCRIPTNAME}-ng-help{
            width: 360px;
          }
          #${SCRIPTNAME}-ng-help h2{
            margin-top: 10px;
          }
          #${SCRIPTNAME}-ng-help dl{
            display: flex;
            flex-wrap: wrap;
          }
          #${SCRIPTNAME}-ng-help dl dt{
            width: 110px;
            margin: 2px 0;
            background: rgba(0,0,0,.5);
            border-radius: 5px;
          }
          #${SCRIPTNAME}-ng-help dl dt code{
            padding:0 5px;
          }
          #${SCRIPTNAME}-ng-help dl dd{
            width: 220px;
            margin: 2px 0 2px 10px;
          }
          /* 設定パネル */
          #${SCRIPTNAME}-config-panel{
            width: 360px;
          }
          #${SCRIPTNAME}-config-panel fieldset p{
            padding-left: calc(10px + 1em);
          }
          #${SCRIPTNAME}-config-panel fieldset p:not(.note):hover{
            background: rgba(255,255,255,.25);
          }
          #${SCRIPTNAME}-config-panel fieldset p.disabled{
            opacity: .5;
          }
          #${SCRIPTNAME}-config-panel fieldset .sub{
            padding-left: calc(10px + 2em);
          }
          #${SCRIPTNAME}-config-panel label{
            display: block;
          }
          #${SCRIPTNAME}-config-panel input{
            width: 80px;
            height: 20px;
            position: absolute;
            right: 10px;
          }
          #${SCRIPTNAME}-config-panel input[type="text"]{
            width: 160px;
          }
          #${SCRIPTNAME}-config-panel input[type="text"]:invalid{
            border: 1px solid rgba(255, 0, 0, 1);
            background: rgba(255, 0, 0, .5);
          }
          #${SCRIPTNAME}-config-panel p.note{
            color: gray;
            font-size: 75%;
            padding-left: calc(10px + 1.33em);/*75%ぶん割り戻す*/
          }
        </style>
      `,
      timeshiftStyle: () => `
        <style type="text/css">
          /* 共通変数 */
          /* opacity:                ${configs.opacity    = 1 - (configs.transparency / 100)} */
          /* lc_opacity:             ${configs.lc_opacity = 1 - (configs.lc_transparency / 100)} */
          /* lb_opacity:             ${configs.lb_opacity = 1 - (configs.lb_transparency / 100)} */
          /* n_opacity:              ${configs.n_opacity  = 1 - (configs.n_transparency / 100)} */
          /* lb_opacityVivid:        ${configs.lb_opacityVivid = 1 - (configs.lb_transparency / 200)} */
          /* n_opacityVivid:         ${configs.n_opacityVivid  = 1 - (configs.n_transparency / 200)} */
          /* fontsize:               ${configs.fontsize = (100 / (configs.maxlines || 1)) / (1 + configs.linemargin)} (設定値の表現をわかりやすくする代償はここで支払う) */
          /* lc_fontsize:            ${configs.lc_fontsize = (100 / (configs.lc_maxlines + 1)) / (1 + configs.lc_margin)} (設定値の表現をわかりやすくする代償はここで支払う) */
          /* screen_zIndex:          ${configs.screen_zIndex          =   2} */
          /* canvas_zIndex:          ${configs.canvas_zIndex          =   3} */
          /* header_zIndex:          ${configs.header_zIndex          =   8} */
          /* footer_zIndex:          ${configs.footer_zIndex          =   8} */
          /* commentPane_zIndex:     ${configs.commentPane_zIndex     =   9} */
          /* headerHover_zIndex:     ${configs.headerHover_zIndex     =  10} */
          /* footerHover_zIndex:     ${configs.footerHover_zIndex     =  10} */
          /* channelButtons_zIndex1: ${configs.channelButtons_zIndex1 =  10} */
          /* channelPane_zIndex:     ${configs.channelPane_zIndex     =  11} */
          /* programPane_zIndex:     ${configs.programPane_zIndex     =  11} */
          /* channelButtons_zIndex2: ${configs.channelButtons_zIndex2 =  12} */
          /* panel_zIndex:           ${configs.panel_zIndex           = 100} */
          /* nav_transition:         ${configs.nav_transition         = `250ms ${EASING}`} */
          /* nav_transitionDelay:    ${configs.nav_transitionDelay    = `250ms ${EASING} 500ms`} */
          /* スクロールコメント */
          #${SCRIPTNAME}-canvas{
            z-index: ${configs.canvas_zIndex};
            pointer-events: none;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            overflow: hidden;
            opacity: 0;/*コメント非表示なら速やかに消える*/
            transition: opacity ${configs.nav_transitionDelay}, width ${configs.nav_transition}, height ${configs.nav_transition};
          }
          html.comment #${SCRIPTNAME}-canvas,
          #${SCRIPTNAME}-canvas.keep{
            opacity: ${configs.opacity};
          }
          #${SCRIPTNAME}-canvas > canvas{
            position: absolute;
            left: 100%;
            transition: transform ${configs.duration}s linear;
            will-change: transform;
            pointer-events: none;/*継承されないので*/
          }
          /* 映像 */
          [data-selector="parent"]{
            transition: ${configs.nav_transition};
          }
          [data-selector="screen"]{
            /* widthはコメントペインに応じて可変 */
            height: 100% !important;
            transition: ${configs.nav_transition};
          }
          [data-selector="screen"] > button + div,
          [data-selector="screen"] > button + div > div{
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            right: 0 !important;
            transition: ${configs.nav_transition};
          }
          [data-selector="closer"]{
            pointer-events: auto;
          }
          [data-selector="screen"] video{
            transition: ${configs.nav_transition};
          }
          ${configs.l_hide ? 'html.active' : ''} [data-selector="screen"][data-shift="true"]/*コメント一覧幅シフト可能*/ video{
            padding-right: ${configs.l_width}vw;
          }
          /* コメントペインの表示非表示 */
          [data-selector="commentPane"]{
            width: ${configs.l_width}% !important;
            padding-left: ${configs.l_hide ? configs.l_width : .75}vw;/*隠れているときもマウスオーバー領域を確保する*/
            box-sizing: content-box;
            transform: translateX(100%);
            z-index: ${configs.commentPane_zIndex};
            transition: transform ${configs.nav_transition}, padding ${configs.nav_transition};
          }
          html.comment [data-selector="commentPane"],
          [data-selector="commentPane"].keep/*core.closeOpenCommentPane用*/{
            transform: translateX(${configs.l_hide ? 50 : 0}%);
          }
          html.comment [data-selector="commentPane"]:hover,
          html.comment [data-selector="commentPane"][data-active="true"],
          html.comment.active [data-selector="commentPane"]{
            transform: translateX(0);/*表示*/
            padding-left: 1em;
          }
          html.comment [data-selector="commentPane"]:hover{
            transition: transform ${configs.nav_transitionDelay}, padding ${configs.nav_transitionDelay};
          }
          [data-selector="commentPane"] > div{
            width: 100%;
            position: relative;
          }
          [data-selector="commentPane"] [class$="comment-SnackBarTransition"]{
            left: auto;
          }
          [data-selector="commentPane"] [data-selector="board"] > div > div:not([data-selector="comment"]) > div{
            margin: auto;/*全称セレクタ(*)のせいでローディングアニメーションが左に寄ってしまうので*/
          }
          html:not(.comment) [data-selector="commentPane"] [class$="Loading"] *{
            animation: none;/*画面外のローディングアニメーションにCPUを消費するアベマの悲しい仕様を上書き*/
          }
          /* コメントペインの透過 */
          [data-selector="commentPane"] > div{
            background: rgba(0,0,0,${configs.l_overlay ? configs.lb_opacity : 1});
            mask-image: linear-gradient(black 75%, transparent 100%);/*透過していくマスクを用意しておいて...*/
            -webkit-mask-image: linear-gradient(black 75%, transparent 100%);/*まだ-webkit取れない*/
            /*Macのwebkitのみ(!)アニメーション時にmaskが無効になるバグがあるので注意*/
            mask-size: 100% 200%;/*透過しない部分だけを見せる(トリッキー!!)*/
            -webkit-mask-size: 100% 200%;/*まだ-webkit取れない*/
            transition: mask-size ${configs.nav_transition}, -webkit-mask-size ${configs.nav_transition};
          }
          [data-selector="footer"]:hover ~ div > [data-selector="commentPane"] > div/*フッタにマウスホバー中*/,
          html.active [data-selector="commentPane"] > div/*フッタを含むナビゲーション表示中*/{
            background: rgba(0,0,0,${configs.l_overlay ? configs.lb_opacity : '1'});/*透明度を指定しないと効かない*/
            mask-size: 100% 100%;/*フッタが見やすいように下側だけを透過させる*/
            -webkit-mask-size: 100% 100%;/*まだ-webkit取れない*/
          }
          [data-selector="footer"]:hover ~ div > [data-selector="commentPane"] > div/*フッタにマウスホバー中*/{
            transition: mask-size ${configs.nav_transitionDelay}, -webkit-mask-size ${configs.nav_transitionDelay};
          }
          [data-selector="commentPane"],
          [data-selector="commentPane"] *{
            color: rgba(255,255,255,${configs.l_overlay ? configs.lc_opacity : 1}) !important;
            background: transparent;
          }
          /* コメントペインの統一フォントサイズ */
          [data-selector="commentPane"] *{
            font-size: ${configs.lc_fontsize}vh;
          }
          /* コメント一覧 */
          /* (セレクタがNGワード登録フォームと合致しないように気を付ける) */
          [data-selector="board"] */*リセット*/{
            padding: 0;
            margin: 0;
          }
          [data-selector="board"] > div > span/*「まだ投稿がありません」のあやうい判定*/{
            margin-left: 20%;
            display: block;
          }
          [data-selector="comment"]{
            padding: 0 .75em;
          }
          [data-selector="comment"] > div:first-child{
            background: transparent !important;/*アベマ公式を上書き*/
            padding: 0 1em;/*newに対してng,ownerなど色を重ねるためのhack*/
            margin: 0 -1em;
          }
          [data-selector="comment"][data-is-owner="true"] > div:first-child/*自分が投稿したコメント*/{
            background: rgba(81,195,0,${configs.l_overlay ? '.1875' : '.250'}) !important;
          }
          [data-selector="board"] div:not([id]) > p/*コメント*/,
          [data-selector="board"] div:not([id]) > p + div/*経過時間・ブロックボタン*/{
            margin: ${configs.lc_fontsize * (configs.lc_margin - configs.lc_linemargin) / 2}vh 0;
            line-height: ${1 + configs.lc_linemargin};
          }
          [data-selector="board"] div:not([id]) > p/*コメント*/{
            word-wrap: break-word;
          }
          [data-selector="board"] div:not([id]) > p + div/*経過時間・ブロックボタン*/{
            display: ${(configs.l_showtime) ? 'block' : 'none'};
            filter: opacity(${configs.l_overlay ? '75%' : '50%'});
            width: 1em;/*NGボタン*/
            white-space: nowrap;
            position: absolute;
            right: 0;
          }
          [data-selector="board"] div:not([id]) > p + div > button/*ブロックボタン*/{
            padding: ${configs.lc_margin / 2}em  ${configs.lc_margin}em;
            margin: -${configs.lc_margin / 2}em -${configs.lc_margin}em;
          }
          [data-selector="board"] div:not([id]) > p + div > button/*ブロックボタン*/ > svg{
            width: ${configs.lc_fontsize}vh;
            max-width: ${configs.lc_fontsize}vh;/*max指定しておけばword-break-allしなくてすむ*/
            height: ${configs.lc_fontsize}vh;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, requestAnimationFrame = window.requestAnimationFrame;
  const getComputedStyle = window.getComputedStyle, fetch = window.fetch;
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTNAME) ? (SCRIPTNAME + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);
      return data.value;
    }
    static delete(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  const $ = function(s){return document.querySelector(s)};
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const getScrollbarWidth = function(){
    let div = document.createElement('div');
    div.textContent = 'dummy';
    document.body.appendChild(div);
    div.style.overflowY = 'scroll';
    let clientWidth = div.clientWidth;
    div.style.overflowY = 'hidden';
    let offsetWidth = div.offsetWidth;
    document.body.removeChild(div);
    return offsetWidth - clientWidth;
  };
  const normalize = function(string){
    return string.replace(/[！-～]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(normalize.RE, function(s){
      return normalize.KANA[s];
    }).replace(/　/g, ' ').replace(/～/g, '〜');
  };
  normalize.KANA = {
    ｶﾞ:'ガ', ｷﾞ:'ギ', ｸﾞ:'グ', ｹﾞ:'ゲ', ｺﾞ: 'ゴ',
    ｻﾞ:'ザ', ｼﾞ:'ジ', ｽﾞ:'ズ', ｾﾞ:'ゼ', ｿﾞ: 'ゾ',
    ﾀﾞ:'ダ', ﾁﾞ:'ヂ', ﾂﾞ:'ヅ', ﾃﾞ:'デ', ﾄﾞ: 'ド',
    ﾊﾞ:'バ', ﾋﾞ:'ビ', ﾌﾞ:'ブ', ﾍﾞ:'ベ', ﾎﾞ: 'ボ',
    ﾊﾟ:'パ', ﾋﾟ:'ピ', ﾌﾟ:'プ', ﾍﾟ:'ペ', ﾎﾟ: 'ポ',
    ﾜﾞ:'ヷ', ｦﾞ:'ヺ', ｳﾞ:'ヴ',
    ｱ:'ア', ｲ:'イ', ｳ:'ウ', ｴ:'エ', ｵ:'オ',
    ｶ:'カ', ｷ:'キ', ｸ:'ク', ｹ:'ケ', ｺ:'コ',
    ｻ:'サ', ｼ:'シ', ｽ:'ス', ｾ:'セ', ｿ:'ソ',
    ﾀ:'タ', ﾁ:'チ', ﾂ:'ツ', ﾃ:'テ', ﾄ:'ト',
    ﾅ:'ナ', ﾆ:'ニ', ﾇ:'ヌ', ﾈ:'ネ', ﾉ:'ノ',
    ﾊ:'ハ', ﾋ:'ヒ', ﾌ:'フ', ﾍ:'ヘ', ﾎ:'ホ',
    ﾏ:'マ', ﾐ:'ミ', ﾑ:'ム', ﾒ:'メ', ﾓ:'モ',
    ﾔ:'ヤ', ﾕ:'ユ', ﾖ:'ヨ',
    ﾗ:'ラ', ﾘ:'リ', ﾙ:'ル', ﾚ:'レ', ﾛ:'ロ',
    ﾜ:'ワ', ｦ:'ヲ', ﾝ:'ン',
    ｧ:'ァ', ｨ:'ィ', ｩ:'ゥ', ｪ:'ェ', ｫ:'ォ',
    ｯ:'ッ', ｬ:'ャ', ｭ:'ュ', ｮ:'ョ',
    "｡":'。', "､":'、', "ｰ":'ー', "｢":'「', "｣":'」', "･":'・',
  };
  normalize.RE = new RegExp('(' + Object.keys(normalize.KANA).join('|') + ')', 'g');
  const atLeast = function(min, b){
    return Math.max(min, b);
  };
  const atMost = function(a, max){
    return Math.min(a, max);
  };
  const between = function(min, b, max){
    return Math.min(Math.max(min, b), max);
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTNAME + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \((userscript\.html|chrome-extension:)/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 6,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \((userscript\.html|chrome-extension:))/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
    }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 85, '\n' + new Error().stack);
    return true;
  });
  const time = function(label){
    const BAR = '|', TOTAL = 100;
    switch(true){
      case(label === undefined):/* time() to output total */
        let total = 0;
        Object.keys(time.records).forEach((label) => total += time.records[label].total);
        Object.keys(time.records).forEach((label) => {
          console.log(
            BAR.repeat((time.records[label].total / total) * TOTAL),
            label + ':',
            (time.records[label].total).toFixed(3) + 'ms',
            '(' + time.records[label].count + ')',
          );
        });
        time.records = {};
        break;
      case(!time.records[label]):/* time('label') to start the record */
        time.records[label] = {count: 0, from: performance.now(), total: 0};
        break;
      case(time.records[label].from === null):/* time('label') to re-start the lap */
        time.records[label].from = performance.now();
        break;
      case(0 < time.records[label].from):/* time('label') to add lap time to the record */
        time.records[label].total += performance.now() - time.records[label].from;
        time.records[label].from = null;
        time.records[label].count += 1;
        break;
    }
  };
  time.records = {};
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();