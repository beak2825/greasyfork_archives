// ==UserScript==
// @name        NicoNico Tsuu
// @namespace   knoa.jp
// @description ニコニコライフを快適に。
// @include     https://www.nicovideo.jp/watch/*
// @include     https://live2.nicovideo.jp/watch/*
// @run-at      document-start
// @version     0.13.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382231/NicoNico%20Tsuu.user.js
// @updateURL https://update.greasyfork.org/scripts/382231/NicoNico%20Tsuu.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'NicoNicoTsuu';
  const SCRIPTNAME = 'NicoNico Tsuu';
  const DEBUG = false;/*
[update]
CPU負荷を軽減しました。ほか、微修正。

[bug]
トップからリンクをたどって生放送に行くと音量調節できない又はインジケータが表示されない？
アンケート通知が機能しないことがある？
URLリンク効いてないことがある？
プレミアムでリアルタイムの生放送が0:00から始まる問題があるらしい！
  @0ne2_______

[to do]
ニコニコ公式のCPU使用率なんとかしたい;特にChrome
英語と中国語をいちおう追加してみる？

全画面シアタースタイルの不要部分を削減
  なめらかスクロール => done

上下で音量
  端数スタートでも10区切りに調整
  10以下の時は1単位に
# 共通
  設定/Help
    流れるコメント
      縁取り太さ？
      マウスオーバー時の透過率比率
      フォント指定
    コメント一覧
      幅
      文字サイズ
      NGスコア表示
  当該ユーザーの発言一覧
  連投規制されそうなとき、投稿ボタンにびっくりマーク
  ログインボタン目立たないとか勝手にログアウトするとか
  sm/lv単位で既視聴管理(設定でサムネopacityとリンク色？)
# 生放送
  番組内容にタイムスケジュールがあればリンク化
  タイムシフト視聴するだのなんだのUI
  リアルタイム視聴でだんだんリアルタイムから遅れていく現象
    video.currentTime を監視してplaybackRateの調整で追いつきたい。
    低遅延なら自動で追いつく？一瞬で追いつくので途中切れるが。
  [←]によるバッファ移動時にコメ一覧のハイライトくらい機能させたいが
# 動画
  100%レイアウト([自動]時のみでよい)
    右に[動画説明文/コメント一覧]しかないのか？
  倍速再生にアクセスしやすく
  先頭と次の動画のボタンいらない気が
  NiconicoMyTheater継承のコメント・ショートカットキーUX
  ヒートマップ
  映像中央の再生マークに白い影
  コメ投稿アンドゥ
  ランキング改変
    スタイル
    集計期間の記憶
    新着ハイライト
ログインクッキー有効期限延長機能？
  アクセスのたびに30日延長とかなら許されるんじゃないの？
  2019/8/03現在
  2029/7/12期限 nicosid
  2029/8/31期限 user_session

[to research]
音声読み上げちゃんとの「動画」での連携？
  https://greasyfork.org/ja/scripts/382231-niconico-tsuu/discussions/62587
スクロールバーと100vw問題(全画面シアター側の課題か) => スクロールバー非表示で解決したけど
コメントの色は動画背景に対する明度加算なんてことはできないのかな？
同一コメ判定に「ひとつ前のコメのtextContent」が使えないか？偶然2連続する可能性は低いだろう。
TSでシークバーにフォーカス時、一度だけ[↑][↓]のpreventDefaultが間に合わない
  シークバーのマウスアップでデフォーカスすれば回避できるかも
一覧コメントマウスオーバー時のたまにスクロール止まらない件
一覧コメント右クリックでテキスト選択中は配慮してあげたい
TSで1.5倍速とかDLが追いつかない
NGスコアの可視化
生放送TSヒートマップ
横型番組表

[memo]
再生速度の変更アップデート！1.5以上はプレミアムのみ！
コメントJSONの例
  chat: {
    thread : 1649308673,
    vpos : 4256100,
    date : 1556109561,
    date_usec : 880193,
    mail : "184",
    content : "/hb ifseetno 686",
    premium : 3,
    user_id : "SaMpLe",
    anonymity : 1,
    yourpost : 1,
    locale : "ja-jp",
  }
公式ショートカットキー
  動画   https://qa.nicovideo.jp/faq/show/287?site_domain=default
  生放送 https://qa.nicovideo.jp/faq/show/14851?site_domain=default
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const API = {
    LIVEMSG: /^wss:\/\/msgd\.live2\.nicovideo\.jp\/websocket/,
  };
  const PREMIUM = {
    USER:       1,/*プレミアム会員*/
    USERAD:     2,/*広告*/
    OPERATOR:   3,/*運営・システム*/
    GUEST:      7,/*公式ゲストコメント(?)*/
    CHANNEL8:   8,/*チャンネル会員(?)*/
    CHANNEL9:   9,/*チャンネル会員(?)*/
    CHANNEL24: 24,/*未入会(?)*/
    CHANNEL25: 25,/*未入会(?)*/
  };
  const STROKEALPHA = '1.0';/*流れるコメントの縁取りのアルファ値(公式: 0.4)*/
  const EASING = 'cubic-bezier(0,.75,.5,1)';/*主にナビゲーションのアニメーション用*/
  let sites = {
    video: {
      targets: {
        videoTitle: () => $('.HeaderContainer-videoTitle'),
        searchBox: () => $('.HeaderContainer-searchBox'),
        videoDescription: () => $('.VideoDescription'),
        videoDescriptionExpanderSwitch: () => $('.VideoDescriptionExpander-switch'),
        commentRenderer: () => $('#CommentRenderer'),
      },
      get: {
        videoDescriptionHtml: (videoDescription) => $('.VideoDescription-html'),
      },
    },
    live: {
      targets: {
        leoPlayer: () => $('[class*="_leo-player_"]'),/*出没するplayer-statusの親*/
        playerDisplayHeader: () => $('[class*="_player-display-header_"]'),/*運営コメント*/
        playerDisplayScreen: () => $('[class*="_player-display-screen_"]'),
        interactionLayerContent: () => $('[class*="_interaction-layer_"] > [data-content-visibility]'),/*アンケート*/
        commentLayer: () => $('[class*="_comment-layer_"]'),
        telopLayer: () => $('[class*="_telop-layer_"]'),
        seekInformation: () => $('[class*="_seek-information_"]'),
        //playButton: () => $('[class*="_play-button_"]'),/*現在不使用;プレミアムにしか出現しない; site.get 内と要調整*/
        muteButton: () => $('[class*="_mute-button_"]'),
        timeStatusArea: () => $('[class*="_time-status-area_"]'),
        elapsedTime: () => $('span[class*="_elapsed-time_"] > span:first-child'),
        commentVisibilityButton: () => $('[class*="_comment-button_"]'),
        fullscreenButton: () => $('[class*="_fullscreen-button_"]'),
        reloadButton: () => $('[class*="_reload-button_"]'),
        commentTextBox: () => $('[class*="_comment-text-box_"]'),
        commentsTable: () => $('[class*="_comment-panel_"] [class*="_table_"]'),
        embeddedData: () => $('#embedded-data'),
      },
      get: {
        playButton: () => $('[class*="_play-button_"]'),/*ブラウザが自動再生をくい止めた場合に出現*/
        video: () => $('[class*="_video-layer_"] video[src]'),
        liveButton: () => $('[class*="_live-button_"]'),
        announcement: (playerDisplayHeader) => playerDisplayHeader.querySelector('[class*="_announcement-renderer_"]'),
        seekInformationTime: (seekInformation) => seekInformation.querySelector('span'),
        content: (comment) => comment.querySelector('[class*="_comment-text_"]'),
        time: (comment) => comment.querySelector('[class*="_comment-time_"]'),
        props: (embeddedData) => JSON.parse(embeddedData.dataset.props),
      },
      addedNodes: {
        comment: (node) => (node.dataset.commentType) ? node : null,
      },
      is: {
        realtime:  () => {let b = sites.live.get.liveButton(); return (b && b.dataset.liveStatus === 'live')  ? true : false},
        chasing:   () => {let b = sites.live.get.liveButton(); return (b && b.dataset.liveStatus === 'chase') ? true : false},
        timeshift: () => sites.live.get.liveButton() ? false : true,
      },
    },
  };
  let elements = {}, storages = {}, timers = {}, configs = {}, site;
  let props, chats = [], users = {}/*id検索用テーブル*/;
  let core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      switch(true){
        case(location.href.match(/^https:\/\/www\.nicovideo\.jp\/watch\/[a-z]{2}[0-9]+/) !== null):
          site = sites.video;
          core.readyForVideo();
          core.addStyle('styleVideo');
          break;
        case(location.href.match(/^https:\/\/live[0-9]?\.nicovideo\.jp\/watch\/lv[0-9]+/) !== null):
          site = sites.live;
          core.listenWebSockets();
          core.readyForLive();
          core.addStyle('styleLive');
          core.addStyle('styleLiveFullscreen');
          break;
        default:
          log('Bye.');
          break;
      }
      //core.panel.createPanels();
    },
    readyForVideo: function(){
      core.getTargets(site.targets).then(() => {
        log("I'm ready for video.");
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    readyForLive: function(){
      /* ビデオの自動再生が許可されていない場合に対応(ただしユーザーアクションによるクリックじゃないので弾かれることが多い;厳密な条件は未調査) */
      core.getTarget(site.get.playButton).then((playButton) => {
        playButton.click();
      });
      /* 60秒以内にユーザーに押してほしい */
      core.getTargets(site.targets, 60).then(() => {
        log("I'm ready for live.");
        core.getProps();
        core.listenUserActions();
        core.listenCanvas();
        core.listenEnquete();
        core.observePlayerDisplayHeader();
        core.appendLocalTime();
        core.observeCommentTable();
        core.appendIndicator();
        core.indicateCommentOpacity(elements.commentLayer.dataset.opacity = Storage.read('opacity') || '1');
        core.appendCommentOpacitySelector();
        /* スタイルを適用した状態でレイアウトを合わせる */
        elements.fullscreenButton.click();
        elements.fullscreenButton.click();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    getProps: function(){
      props = site.get.props(elements.embeddedData);
      log(props);
    },
    appendIndicator: function(e){
      elements.indicator = createElement(html.indicator());
      elements.playerDisplayScreen.appendChild(elements.indicator);
    },
    indicate: function(indication, duration = 1000){
      let indicator = elements.indicator;
      if(typeof indication !== 'object') indication = document.createTextNode(indication);
      while(indicator.firstChild) indicator.removeChild(indicator.firstChild);
      indicator.appendChild(indication);
      indicator.classList.add('active');
      clearTimeout(timers.indicator);
      timers.indicator = setTimeout(function(){
        indicator.classList.remove('active');
      }, duration);
    },
    setCommentOpacity: function(key){
      elements.commentLayer.dataset.opacity = key;
      Storage.save('opacity', key);
      core.indicate(key);
      core.indicateCommentOpacity(key);
    },
    indicateCommentOpacity: function(key){
log();
      let button = elements.commentVisibilityButton, indicator = elements.commentOpacityIndicator || createElement(html.commentOpacityIndicator(key));
      if(indicator.isConnected) button.replaceChild(elements.commentOpacityIndicator = createElement(html.commentOpacityIndicator(key)), indicator);
      else button.appendChild(elements.commentOpacityIndicator = indicator);
log(button.isConnected, indicator, indicator.isConnected);
log(button.innerHTML);
    },
    appendCommentOpacitySelector: function(){
      let button = elements.commentVisibilityButton, selector = createElement(html.commentOpacitySelector());
      button.after(selector);
      selector.addEventListener('mouseover', function(e){
        if(e.target.dataset.opacity === undefined) return;
        /*マウスを動かすだけでプレビューさせる*/
        elements.commentLayer.dataset.opacity = e.target.dataset.opacity;
        core.indicate(e.target.dataset.opacity);
      });
      selector.addEventListener('click', function(e){
        if(e.target.dataset.opacity === undefined) return;
        core.setCommentOpacity(e.target.dataset.opacity);/*クリックしたら上書き保存*/
        elements.indicator.animate([ 
          {opacity: 1, transform: 'scale(1)'},
          {opacity: 0, transform: 'scale(2)'},
        ], {duration: 1250, easing: EASING});
      });
      selector.addEventListener('mouseout', function(e){
        core.setCommentOpacity(Storage.read('opacity'));/*クリックされていなければ初期値に戻る*/
      });
    },
    listenUserActions: function(){
      /* プレイヤーをアクティブに */
      const activatePlayer = function(){
        document.activeElement.blur();
        elements.playerDisplayScreen.click();
      };
      /* キーボード */
      window.addEventListener('keydown', function(e){
        let activeElement = document.activeElement;
        /* テキスト入力中は反応しない */
        if(['input', 'textarea'].includes(activeElement.localName) && activeElement.type !== 'range'){
          if(e.key === 'Escape'){/*Escapeは必ずアンフォーカス*/
            activeElement.blur();
            e.stopPropagation();
            return;
          }
          if(activeElement.value !== '') return;/*テキスト入力中*/
          else if([/*テキスト空欄なら以下のキーは有効*/
            'ArrowLeft',
            'ArrowUp',
            'ArrowDown',
            ' ',
          ].includes(e.key) === false) return;
        }
        switch(true){
          case(e.key === 'ArrowLeft'  && !e.altKey && e.shiftKey === true && !e.ctrlKey && !e.metaKey):
          case(e.key === 'ArrowRight' && !e.altKey && e.shiftKey === true && !e.ctrlKey && !e.metaKey):
            if(site.is.realtime()) return;
            else{
              let video = site.get.video();
              video.currentTime += (e.key === 'ArrowLeft') ? -10 : +10;
              e.stopPropagation();
              e.preventDefault();/*ブラウザによるテキスト選択を回避*/
            }
            return;
          /* 以下Alt/Shift/Ctrl/Metaキーが押されていたら反応しない */
          case(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey):
            return;
          case(e.key === ' '):
            if(site.is.realtime()){
              elements.commentTextBox.focus();
              e.preventDefault();/*コメント欄にフォーカスさせるだけ*/
            }else activatePlayer();
            return;
          case(e.key === 'ArrowLeft'):
            if(site.is.chasing() || site.is.timeshift()){
              /* バッファ範囲内なら公式の重たい処理を回避する */
              let video = site.get.video();
              if(video.currentTime - video.buffered.start(0) >= 30){
                video.currentTime -= 30;
                e.stopPropagation();
              }else activatePlayer();/*プレイヤーにフォーカスさせて公式の30秒巻き戻しを実行させる*/
            }else{
              const REWIND = 10, CATCHUP = 1.5;
              let video = site.get.video(), rewinded = false, duration = 1000;
              if(!video.paused && !video.rewinded && video.currentTime > REWIND/*少しだけ戻すこともできるが通信が安定しなくなるので*/){
                duration = (REWIND / (CATCHUP - 1))*1000;
                video.rewinded = rewinded = true;
                video.currentTime = video.currentTime - REWIND;
                video.playbackRate = CATCHUP;
                elements.playerDisplayScreen.dataset.rewinded = 'true';
                setTimeout(function(){
                  video.rewinded = false;
                  video.playbackRate = 1;
                  delete elements.playerDisplayScreen.dataset.rewinded;
                }, duration);
              }
              core.indicate(createElement(html.rewind(rewinded)), duration);
              e.stopPropagation();
            }
            return;
          case(e.key === 'ArrowRight'):
            if(site.is.chasing() || site.is.timeshift()){
              /* バッファ範囲内なら公式の重たい処理を回避する */
              let video = site.get.video();
              if(video.buffered.end(0) - video.currentTime >= 30){
                video.currentTime += 30;
                e.stopPropagation();
              }else activatePlayer();/*プレイヤーにフォーカスさせて公式の30秒巻き戻しを実行させる*/
            }
            return;
          case(e.key === 'ArrowUp'):
          case(e.key === 'ArrowDown'):
            activatePlayer();/*プレイヤーにフォーカスさせて公式の音量調整を実行させる*/
            site.get.video().addEventListener('volumechange', function(e){
              core.indicate(parseInt(e.target.volume * 100));
            }, {once: true});
            e.preventDefault();
            /* 連続すると focus() がわずかに遅延を感じさせるので */
            if(activeElement === elements.commentTextBox || timers.focusBack){
              clearTimeout(timers.focusBack);
              timers.focusBack = setTimeout(() => {
                elements.commentTextBox.focus();
                delete timers.focusBack;
              }, 250);
            }
            return;
          case(e.key === '1'):
          case(e.key === '2'):
          case(e.key === '3'):
          case(e.key === '4'):
          case(e.key === '5'):
          case(e.key === '6'):
          case(e.key === '7'):
          case(e.key === '8'):
          case(e.key === '9'):
          case(e.key === '0'):
            core.setCommentOpacity(e.key);
            return;
          case(e.key === 'm'):
            elements.muteButton.click();
            site.get.video().addEventListener('volumechange', function(e){
              if(e.target.muted) core.indicate('mute');
              else core.indicate(parseInt(e.target.volume * 100));
            }, {once: true});
            return;
          case(e.key === 'f'):
            elements.fullscreenButton.click();
            return;
          case(e.key === 'r'):
            elements.reloadButton.click();
            return;
        }
      }, {capture: true});
      /* 再生・一時停止 */
      /* 勝手に再生を再開してしまうので保留 */
      //elements.playButton.addEventListener('click', function(e){
      //  /* 公式プレイヤによる再読み込みを回避して軽快に動作させる */
      //  let video = site.get.video();
      //  if(video.paused) video.play();
      //  else video.pause();
      //  e.stopPropagation();
      //}, true);
      /* 出没するplayer-statusを監視 */
      observe(elements.leoPlayer, function(records){
        let commentsTable = elements.commentsTable = site.targets.commentsTable();
        if(commentsTable === null) return;
        commentsTable.dataset.selector = 'commentsTable';
        core.observeCommentTable();/*commentsTableが復活するのでもう一度監視する*/
      }, {childList: true});
      /* フルスクリーン状態の変化 */
      observe(elements.html, function(records){
        if(elements.html.dataset.browserFullscreen) return;/*フルスクリーン化したときは何もしない*/
        animate(window.scrollTo.bind(window, 0, 0));/*スクロール位置がずれるのを即補正*/
      }, {attributes: true});
      /* ウィンドウリサイズ */
      window.addEventListener('resize', function(e){
        /* 可変ウィンドウサイズとコメントスクロール位置が強く結びついているので必要な処置 */
        clearTimeout(window.resizing), window.resizing = setTimeout(function(){
          if(document.fullscreenElement) return;/*モニタフルスクリーン時は何もしない*/
          elements.fullscreenButton.click();
          elements.fullscreenButton.click();
          window.resizing = null;
        }, 250);/*リサイズ中の連続起動を避ける*/
      });
      /* ウィンドウフォーカス */
      window.addEventListener('focus', function(e){
        elements.commentTextBox.focus();
      });
    },
    listenWebSockets: function(){
      /* 公式の通信内容を取得 */
      window.WebSocket = new Proxy(WebSocket, {
        construct(target, arguments){
          const ws = new target(...arguments);
          //log(ws, arguments);
          if(API.LIVEMSG.test(ws.url)){
            ws.addEventListener('message', function(e){
              let json = JSON.parse(e.data);
              if(json.chat === undefined) return;
              //log(json.chat);
              //if(json.chat.premium === 3) log(json.chat);/*運営コメント*/
              //if(![1,2,3,24,undefined].includes(json.chat.premium)) log(json.chat);/*ユーザーと広告と運営以外のコメントログ*/
              chats.push(json.chat);
              /* ユーザー別コメント一覧 */
              //if(users[json.chat.user_id] === undefined) users[json.chat.user_id] = [];
              //users[json.chat.user_id].push(json.chat);
            });
          }
          return ws;
        }
      });
    },
    listenCanvas: function(){
      /* 公式のキャンバスコンテキストメソッドを書き換えて縁取りを見やすく */
      let strokeText = CanvasRenderingContext2D.prototype.strokeText;
      CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth){
        //log(text, this.strokeStyle);
        this.strokeStyle = this.strokeStyle.replace(/rgba\(([0-9]+),\s?([0-9]+),\s?([0-9]+),\s?([0-9.]+)\)/, `rgba($1,$2,$3,${STROKEALPHA})`);
        return strokeText.call(this, text, x, y, maxWidth);
      };
    },
    listenEnquete: function(){
      /* アンケートの表示を捉える */
      Notification.requestPermission();
      let notification, title = props.program.title;
      observe(elements.interactionLayerContent, function(records){
        if(notification) notification.close();/*古い通知が出たままなら閉じる*/
        if(elements.interactionLayerContent.dataset.contentVisibility === 'false') return;/*閉じたときは何もしない*/
        notification = new Notification(title, {body: site.get.announcement(elements.playerDisplayHeader).textContent});
        notification.addEventListener('click', function(e){
          notification.close();
        });
      }, {attributes: true});
    },
    observePlayerDisplayHeader: function(){
      let playerDisplayHeader = elements.playerDisplayHeader, commentLayer = elements.commentLayer;
      observe(playerDisplayHeader, function(records){
        //log(records);
        if(playerDisplayHeader.children.length === 0){
          delete playerDisplayHeader.dataset.extraLayout;
          delete commentLayer.dataset.extraLayout;
        }else{
          let announcement = site.get.announcement(playerDisplayHeader);
          if(announcement) setTimeout(function(){
            playerDisplayHeader.dataset.fresh = 'true';
            observe(announcement, function(rs){
              playerDisplayHeader.dataset.fresh = announcement.dataset.fresh;/*同期させる*/
            }, {attributes: true});
          }, 250);/*フルスクリーン切り替えなどでラグが発生するので*/
          playerDisplayHeader.dataset.extraLayout = 'showOperatorComment';
          commentLayer.dataset.extraLayout = 'showOperatorComment';
        }
      });
    },
    appendLocalTime: function(){
      /* seek */
      let seekInformation = elements.seekInformation, seekInformationTime = site.get.seekInformationTime(seekInformation);
      let localTime = createElement(html.localTime()), beginTime = props.program.beginTime;
      localTime.textContent = seekInformationTime.textContent;
      seekInformationTime.before(localTime);
      observe(seekInformationTime, function(records){
        //log(records);
        localTime.textContent = (new Date((beginTime + timeToSeconds(seekInformationTime.textContent))*1000)).toLocaleTimeString();
      }, {characterData: true, subtree: true});
      /* elapsed */
      let elapsedTime = elements.elapsedTime;
      let currentLocalTime = createElement(html.localTime());
      currentLocalTime.textContent = elapsedTime.textContent;
      elapsedTime.before(currentLocalTime);
      observe(elapsedTime, function(records){
        //log(records);
        currentLocalTime.textContent = (new Date((beginTime + timeToSeconds(elapsedTime.textContent))*1000)).toLocaleTimeString();
      }, {characterData: true, subtree: true});
    },
    observeCommentTable: function(){
      let commentsTable = elements.commentsTable;
      if(commentsTable.observing) return;/*起こりえないけど重複を避ける*/
      commentsTable.observing = true;
      core.listenMouseOnCommentsTable();
      /* 初期コメントに適用しつつ、追加コメントを監視する */
      const ADVANCE = 30;
      let elapsedTime = elements.elapsedTime, lastTime = timeToSeconds(elapsedTime.textContent), cutoffTime = -Infinity;
      Array.from(commentsTable.children).forEach(c => core.modifyComment(c));
      observe(commentsTable, function(records){
        //log(records);
        let isRealtime = site.is.realtime(), isChasing = site.is.chasing(), isTimeshift = site.is.timeshift();
        let removedComments = [], newComments = [], currentTime = timeToSeconds(elapsedTime.textContent);
        /* 30秒早送りなどで一覧がクリアされたら古いニセ新着を除外する */
        if(lastTime + ADVANCE <= currentTime) cutoffTime = lastTime;
        else if(currentTime < lastTime) cutoffTime = -Infinity;
        lastTime = currentTime;
        for(let i = 0, record; record = records[i]; i++){/*あらかじめ画面外へ消えて削除される要素を収集しておく*/
          if(record.removedNodes.length) removedComments.push(record.removedNodes[0]);
        }
        for(let i = records.length - 1, record; record = records[i]; i--){/*chatとのマッチングを逆順に行うのでこちらも逆順で*/
          if(record.addedNodes.length === 0) continue;
          if(site.addedNodes.comment(record.addedNodes[0]) === null) continue;
          let comment = record.addedNodes[0];
          core.modifyComment(comment);
          if(isChasing || isTimeshift){
            /* 30秒早送りなどで一覧がクリアされたら古いニセ新着を除外する */
            if(timeToSeconds(site.get.time(comment).textContent) < cutoffTime) break;
            /* タイムシフトではユーザーコメント以外は毎回置換されるので(バグ？)、置換要素は新着コメント扱いしない */
            if(['normal', 'trialWatch'].includes(comment.dataset.commentType) === false) continue;
            if(removedComments.find(c => comment.textContent === c.textContent)) continue;
            /*偶然一致するとnewCommentsから抜けてしまう!!*/
          }
          newComments.push(comment);
        }
        if(newComments.length) core.slideUpNewComments(newComments);
      });
    },
    listenMouseOnCommentsTable: function(){
      /* マウス操作中はスクロールでフォーカスが不意に外れてしまうのを抑制する */
      /* (マウスオーバーで新着スクロールを止めて、マウスアウトで一気に復帰させる) */
      let commentsTable = elements.commentsTable, parent = commentsTable.parentNode, scroll = 0;
      commentsTable.addEventListener('mouseenter', function(e){
        scroll = atMost(Math.round(parseFloat(getComputedStyle(commentsTable.lastElementChild).height)), parent.scrollTop);/*最初に少しスクロールさせると公式も空気を読んで新着コメントが来てもスクロールしなくなる*/
        commentsTable.dataset.mouseenter = 'true';
        parent.scrollTop -= scroll;
        commentsTable.style.transform = `translateY(-${scroll}px)`;
      });
      commentsTable.addEventListener('mouseleave', function(e){
        delete commentsTable.dataset.mouseenter;
        let scrollTopMax = parent.scrollHeight - parent.clientHeight, distance = scrollTopMax - parent.scrollTop - scroll;
        parent.scrollTop = scrollTopMax;
        animate(function(){parent.scrollTop = scrollTopMax + scroll});/*スクロールによって移動した分をさらに調整*/
        commentsTable.style.transform = ``;
        parent.animate([ 
          {transform: `translateY(${distance}px)`},
          {transform: `translateY(0)`},
        ], {duration: 125, easing: EASING});
        commentsTable.lastElementChild.dataset.new = 'true';/*すでに追加されている1件分*/
      });
    },
    modifyComment: function(commentNode){
      //log(commentNode);
      const additionalVpos = (props.program.beginTime - props.program.openTime) * 100;
      let contentNode = site.get.content(commentNode), timeNode = site.get.time(commentNode);
      let commentType = commentNode.dataset.commentType, content = contentNode.textContent, vpos = additionalVpos + timeToSeconds(timeNode.textContent);
      //if(commentType !== 'normal') log(commentType, commentNode.textContent);
      /* コメントに追加情報を与える */
      for(let i = chats.length - 1, chat; chat = chats[i]; i--){
        /* 時刻の一致を検証 */
        if(chat.vpos < vpos - 60*100) break;/*60秒以上古いログは追わずにあきらめる(TSではchatsの時系列がかなりばらけている)*/
        //if(!(vpos <= chat.vpos && chat.vpos <= vpos + 100)) continue;/*timeNodeの表示時刻とvposは必ずしも一致しない*/
        /* 既存の一致を検証 */
        if(chat.commentNode && chat.commentNode.isConnected) continue;
        /* 内容の一致を検証 */
        switch(commentType){
          case('normal'):/*通常コメント*/
          case('trialWatch'):/*有料番組のお試し視聴*/
            if(chat.content !== content) continue;
            break;
          case('operator'):/*運営コメント*/
            let operator = content.split(/\s/);
            if(!operator.every(o => chat.content.includes(o))) continue;
            break;
          case('nicoad'):/*ニコニ広告*/
            let nicoad = content.match(/(?:【.+?】)?(.+)さんが([0-9]+)pt/) || content.match(/(?:提供：)?(.+)さん（([0-9]+)pt）/);
            if(nicoad === null) log('Unknown nicoad format:', content);
            else if(!chat.content.includes(nicoad[1]) || !chat.content.includes(nicoad[2])) continue;/*厳密ではないけど十分*/
            break;
          case('programExtend'):/*放送枠の延長*/
          case('ranking'):/*ランキング入り通知*/
          case('cruise'):/*クルーズのお知らせ*/
          case('quote'):/*クルーズさんのコメント*/
          case('spi'):/*ニコニコ新市場*/
          case('gift'):/*ニコニコ新市場*/
          case('transparent'):/*？*/
            if(content.includes(chat.content)) continue;
            if(chat.content.includes(content)) continue;
            break;
          default:
            log('Unknown commentType found:', commentType, chats[i]);
            continue;/*複数吐かれる時間内のログから当該chatを見つける*/
        }
        /* 晴れてペアとなるchatを見つけられたので */
        chats[i].commentNode = commentNode;
        switch(commentType){
          case('normal'):
          case('trialWatch'):
            linkify(contentNode);/*URLをリンク化*/
            commentNode.dataset.score = chat.score || 0;
            commentNode.dataset.premium = chat.premium || 0;
            commentNode.dataset.user_id = chat.user_id || '';
            timeNode.before(createElement(html.score(commentNode.dataset.score)));/*NGスコア付与*/
            //commentNode.addEventListener('click', core.showUserHistory.bind(commentNode), {capture: true});
            break;
          case('operator'):
            let link = chat.content.match(/<a href="([^"]+)"/);
            if(link === null) linkify(contentNode);/*URLをリンク化*/
            else contentNode.innerHTML = `<a href="${link[1]}">${content}</a>`;
            break;
          case('nicoad'):
            linkify(contentNode);/*URLをリンク化*/
            break;
          case('programExtend'):
          case('ranking'):
          case('cruise'):
          case('quote'):
          case('spi'):
            break;
          default:
            break;
        }
        break;
      }
    },
    slideUpNewComments: function(newComments){
      if(elements.commentsTable.dataset.mouseenter) return;/*マウスオーバー中は処理しない*/
      //連続起動しうるけど125ms以内には起こらないだろう
      const DURATION = '125ms', EASING = 'ease';
      let commentsTable = elements.commentsTable, parent = commentsTable.parentNode;
      let scrollTopMax = parent.scrollHeight - parent.clientHeight;
      let height = parseFloat(getComputedStyle(newComments[0]).height) * newComments.length;/*高さは共通のはずなので*/
      for(let i = 0, comment; comment = newComments[i]; i++){
        comment.dataset.new = 'true';
      }
      if(scrollTopMax === 0) return;/*放送開始時などコメントが少なくてスクロール不要*/
      parent.scrollTop = scrollTopMax - 2;/* 本来は1でよいが、ブラウザのズーム倍率に対する保険 */
      commentsTable.style.transform = `translateY(${height - 2}px)`;
      animate(function(){
        commentsTable.style.transition = `transform ${DURATION} ${EASING}`;
        commentsTable.style.transform = `translateY(0)`;
        commentsTable.addEventListener('transitionend', function(e){
          commentsTable.style.transition = 'none';
          animate(function(){parent.scrollTop = scrollTopMax + 1});
        }, {once: true});
      });
    },
    showUserHistory: function(e){
      let commentNode = this, user_id = commentNode.dataset.user_id;
      log(this, user_id, users[user_id]);
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected && selected instanceof selected.ownerDocument.defaultView.HTMLElement) selected.dataset.selector = key;/* element */
        else if(--retry) return log(`Not found: ${key}, retrying... (${retry})`), setTimeout(get, interval, resolve, reject);
        else return reject(new Error(`Not found: ${selector.name}, I give up.`));
        elements[key] = selected;
        resolve(selected);
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject);
      });
    },
    getTargets: function(selectors, retry = 10, interval = 1*SECOND){
      return Promise.all(Object.values(selectors).map(selector => core.getTarget(selector, retry, interval)));
    },
    addStyle: function(name = 'style', d = document){
      /* 本来cssの優先順位で解決すべきだが、headの挿入位置の影響を避けるためにbodyにしている */
      if(html[name] === undefined) return;
      if(d.body){
        let style = createElement(html[name]()), id = SCRIPTID + '-' + name, old = d.getElementById(id);
        style.id = id;
        d.body.appendChild(style);
        if(old) old.remove();
      }
      else{
        let observer = observe(d.documentElement, function(){
          if(!d.body) return;
          observer.disconnect();
          core.addStyle(name);
        });
      }
    },
  };
  const html = {
    indicator: () => `<div id="${SCRIPTID}-indicator"></div>`,
    rewind: (rewinded) => `
      <svg id="rewind" ${rewinded ? 'class ="rewinded"' : ''} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.4" class="PlayerSeekBackwardButton-icon">
        <path d="M18.3 29A38 38 0 1 1 23 76.7a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 0 5.7A50 50 0 1 0 8 22.8l-2-1.2a4 4 0 0 0-6 3.5v18.2a4 4 0 0 0 6 3.5L21.7 38a4 4 0 0 0 .2-7L18.3 29zM42 66a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V40h-2a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v32zm32 0a2 2 0 0 1-2 2H52a2 2 0 0 1-2-2V34c0-1.1.9-2 2-2h20a2 2 0 0 1 2 2v32zm-8-26h-8v20h8V40z"></path>
      </svg>
    `,
    localTime: () => `<span class="${SCRIPTID}-localTime"></span>`,
    commentOpacityIndicator: (key) => `<span id="comment-opacity-indicator" data-opacity="${key}">${key}</span>`,
    commentOpacitySelector: () => `
      <ul id="comment-opacity-selector" aria-label="コメント透明度">
        <li data-opacity="1">1</li>
        <li data-opacity="2">2</li>
        <li data-opacity="3">3</li>
        <li data-opacity="4">4</li>
        <li data-opacity="5">5</li>
        <li data-opacity="6">6</li>
        <li data-opacity="7">7</li>
        <li data-opacity="8">8</li>
        <li data-opacity="9">9</li>
        <li data-opacity="0">0</li>
      </ul>
    `,
    score: (score) => `<span class="___comment-score___${SCRIPTID}">${score}</span>`,
    styleVideo: () => `
      <style type="text/css" id="${SCRIPTID}-styleVideo">

      </style>
    `,
    styleLiveFullscreen: () => `
      <style type="text/css">
        /**** 変数 ****/
        :root{
          /*ヘッダ*/
          --header-height: 36px;
          /*左右比率*/
          --screen-width: 75vw;
          --comment-width: 25vw;
          /*一覧コメント*/
          --font-size: calc(4px + 1.2vmin);
          --line-height: 1.5;
          --negative-height: calc(var(--font-size) * -1.5);/*userstyles.orgがvar同士の計算に対応していないので*/
          --nicoad-icon: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGl0bGU+bmljb2FkLWljb248L3RpdGxlPjxwYXRoIGQ9Ik05NC4yOTIsNjguNDA2YTUuNjYzLDUuNjYzLDAsMCwwLDIuNTgtMS40MjljMy4xODctMy4xODcsMS44MzQtMTAuMjYxLTIuODg0LTE4Ljg3OWwtNS44MzQsMS4wNTNjMi4xMzQsNC40OCwyLjYyNyw3Ljk1NCwxLDkuNTc4LTMuNzc5LDMuNzgyLTE3LjU2Mi0zLjg4MS0zMC43ODUtMTcuMXMtMjAuODc5LTI3LTE3LjEtMzAuNzgzYzEuNjI0LTEuNjI0LDUuMS0xLjEzMSw5LjU3OSwxLjAwNUw1MS45LDYuMDE0QzQzLjI4NiwxLjMsMzYuMjEyLS4wNTksMzMuMDIyLDMuMTMyYTUuNjgzLDUuNjgzLDAsMCwwLTEuNDI5LDIuNTc5TDMxLjU4Nyw1LjcsMTMuOTM2LDcxLjU2MiwxLjYxMyw3NC44NjhhMi4xMzcsMi4xMzcsMCwwLDAtLjk2NS41MzZjLTIuMiwyLjIwOSwxLjM3NCw5LjM1NSw3Ljk4MywxNS45NjZzMTMuNzU4LDEwLjE4NSwxNS45NjIsNy45NzhhMi4xMjUsMi4xMjUsMCwwLDAsLjUzNi0uOTY3bDMuMy0xMi4zMjRMOTQuMyw2OC40MTZaIiBmaWxsPSIjNDA0MDQwIi8+PHJlY3QgeD0iNjAuMTIiIHk9IjIwLjY5IiB3aWR0aD0iMzEuNjAzIiBoZWlnaHQ9IjYuNzczIiByeD0iMy4wNTEiIHJ5PSIzLjA1MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4yMTMgNjAuNzM3KSByb3RhdGUoLTQ1KSIgZmlsbD0iIzQwNDA0MCIvPjxyZWN0IHg9IjQ3LjM4MyIgeT0iMTAuNDMzIiB3aWR0aD0iMjguMjE3IiBoZWlnaHQ9IjYuNzczIiByeD0iMy4wNTEiIHJ5PSIzLjA1MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIuMjI4IDY5LjYzOSkgcm90YXRlKC03NSkiIGZpbGw9IiM0MDQwNDAiLz48cmVjdCB4PSI3Mi4wNzIiIHk9IjM1LjEyMiIgd2lkdGg9IjI4LjIxNyIgaGVpZ2h0PSI2Ljc3MyIgcng9IjMuMDUxIiByeT0iMy4wNTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03LjAzIDIzLjYxNykgcm90YXRlKC0xNSkiIGZpbGw9IiM0MDQwNDAiLz48L3N2Zz4=");
          /*スクロールコメント*/
          --opacity: .75;
        }
        /**** display:none ****/
        [class*="page-header-area"]/*サイトロゴ+検索+広告*/,
        [class*="billboard-ad"]/*バナー広告*/,
        [class*="billboard-banner"]/*バナー広告*/,
        [class*="operator-area"]/*empty*/,
        [class*="player-foot-area"]/*empty*/,
        dummy{
          display: none !important;
        }
        /**** 全画面レイアウト(htmlからすべて指定しないと100%にできない) ****/
        ::-webkit-scrollbar{
          display: none;
        }
        body{
          scrollbar-width: none;
        }
        html,
        body,
        #root,
        [class*="_watch-page_"],
        [class*="_player-area_"],
        [class*="_player-body-area_"],
        [class*="_player-section_"],
        [class*="_leo-player_"],
        [class*="_player-display_"],
        [class*="_player-display-screen_"],
        [class*="_player-status_"],
        dummy{
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        @media screen and (max-width: 640px){
          #page-top,
          #siteHeader{
            display: none !important;
          }
        }
        [class*="_player-area_"]{
          display: flex;
          flex-direction: column;
        }
        [class*="_player-area_"] [class*="_player-head-area_"] [class*="_nicoad-bar_"]/*ニコニ広告*/{
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        @media screen and (max-width: 960px){
          [class*="_player-area_"] [class*="_player-head-area_"] [class*="_nicoad-bar_"]/*ニコニ広告*/{
            display: none !important;
          }
        }
        [class*="_player-area_"]{
          height: auto !important;/*上書き*/
        }
        @media screen and (max-width: 640px){
          [class*="_player-area_"]{
            height: calc(100%) !important;
          }
        }
        [class*="_player-area_"][data-browser-fullscreen]{
          height: 100% !important;
        }
        [class*="_player-section_"]:not([data-browser-fullscreen]){
          height: calc(100vh - var(--header-height)) !important;
        }
        [class*="_watch-page_"],
        [class*="_player-body-area_"],
        [class*="_player-section_"],
        [class*="_player-display-screen_"],
        dummy{
          width: 100% !important;
          max-width: none !important;
          min-width: auto !important;
          max-height: none !important;
          min-height: auto !important;
        }
        [class*="_player-body-area_"]{
          overflow: hidden;/*ニコニ広告ヘッダ付きなど画面の縦幅が狭いときにも高さ100%に収めるため*/
        }
        [data-browser-fullscreen] [class*="_player-display_"]/*メイン*/,
        [data-browser-fullscreen] [class*="_player-display_"]/*メイン*/ > *{
          width: 100%;
        }
        [class*="_player-display_"]/*メイン*/{
          width: var(--screen-width);
          min-width: var(--screen-width) !important;
        }
        [class*="_player-display_"]/*メイン*/ > *{
          width: 100%;
          min-width: 100% !important;
        }
        [class*="_player-setting-view_"]/*詳細設定*/,
        [class*="_rich-view-status_"]/*ギフト*/,
        [class*="_player-status_"]/*一覧コメント*/{
          width: var(--comment-width);
          min-width: var(--comment-width) !important;
        }
        [class*="_player-setting-view_"]/*詳細設定*/ > *,
        [class*="_rich-view-status_"]/*ギフト*/ > *,
        [class*="_player-status_"]/*一覧コメント*/ > *{
          width: 100%;
        }
        body{
          overflow-x: hidden;
        }
        /**** 配信者ツール ****/
        [class*="_broadcaster-tool_"]{
          max-width: 100% !important;
        }
        /**** 運営コメント ****/
        [class*="_player-display-header_"]{
          position: relative !important;/*運営コメントを映像に重ねない*/
          height: 8vmin;/*運営コメントをより大きく*/
          min-height: 8vmin;
        }
        [data-browser-fullscreen] [class*="_player-display-header_"]{
          position: absolute !important;/*フルスクリーン時は公式仕様どおり映像に重ねる*/
        }
        [class*="_player-display-header_"] [class*="_announcement-renderer_"]{
          padding: .5vmin 0 .5vmin;/*運営コメントをより大きく*/
          box-sizing: border-box;
        }
        [data-browser-fullscreen] [class*="_player-display-header_"] [class*="_announcement-renderer_"]{
          padding: .5vmin 0 3.5vmin;/*運営コメントをより大きく*/
          box-sizing: content-box;
          background: linear-gradient(
            rgba(0,0,0,.500)  4vmin,
            rgba(0,0,0,.481)  5vmin,
            rgba(0,0,0,.427)  6vmin,
            rgba(0,0,0,.346)  7vmin,
            rgba(0,0,0,.154)  9vmin,
            rgba(0,0,0,.073) 10vmin,
            rgba(0,0,0,.019) 11vmin,
            transparent
          ) !important;/*背景にサインカーブの影*/
          text-shadow:
            rgba(0,0,0,.50)  1px  1px 2px,
            rgba(0,0,0,.50) -1px  1px 2px,
            rgba(0,0,0,.50)  1px -1px 2px,
            rgba(0,0,0,.50) -1px -1px 2px,
            rgba(0,0,0,.75)  0    1px 1px
          ;/*公式の指定より影を濃くして目立たせる*/
        }
        [class*="_player-display-header_"] [class*="_announcement-renderer_"] [class*="_fitting-area_"]{
          line-height: 1.25 !important;/*2行にわたる運営コメントをより大きく(リンク下線の余裕はどうしても必要)*/
          font-size: calc(4vmin/1.25);/*運営コメントをより大きく*/
          overflow: visible;/*ピッタリすぎてリンク下線の分だけはみ出てカットされるのを防ぐ*/
          white-space: nowrap;/*美しくない強制改行をできるだけ防ぐ*/
        }
        html:not([data-browser-fullscreen]) [class*="_player-display-header_"] [class*="_announcement-renderer_"][data-fresh="false"],
        [data-browser-fullscreen] [class*="_player-display_"]:hover [class*="_player-display-header_"] [class*="_announcement-renderer_"][data-fresh="false"]{
          opacity: .75 !important;/*固定運営コメントが15秒で消えてしまうバグを回避*/
          pointer-events: auto !important;
        }
        /**** スクロールコメント ****/
        [class*="_comment-layer_"][data-extra-layout="showOperatorComment"]{
          top: 50% !important;/*(通常画面での)運営コメント表示中の公式のレイアウト調整は不要なので上書きする*/
          transform: translate(-50%, -50%) !important;
        }
        /*公式未対応につきTsuuで対応*/
        [data-browser-fullscreen] [class*="_player-display_"][data-monitor-mode="manipulating"] [class*="_comment-layer_"][data-extra-layout="showOperatorComment"],
        [data-browser-fullscreen] [class*="_player-display-header_"][data-fresh="true"] + [class*="_player-display-screen_"] [class*="_comment-layer_"][data-extra-layout="showOperatorComment"],
        [data-browser-fullscreen] [class*="_player-display_"]:hover [class*="_comment-layer_"][data-extra-layout="showOperatorComment"]{
          top: 50% !important;
          transform: translate(-50%, calc(-50% + 8vmin)) !important;/*フルスクリーン時は逆に運営コメント表示中のレイアウト調整が欠けているので補う*/
          transition: opacity 125ms, transform 500ms 0ms;
        }
        [class*="_player-display-screen_"] [class*="_comment-layer_"],
        [class*="_player-display-screen_"] [class*="_telop-layer_"]{
          opacity: var(--opacity);/*通常時の透明度*/
          transition: opacity 125ms, transform 1000ms 1000ms;
        }
        /**** プレイヤフッタ ****/
        [class*="_player-display-footer_"]::before{
          opacity: 0;/*::before要素で影を表現するのはやめる*/
        }
        [class*="_broadcast-participation-area_"]{
          background: black;/*背景を黒く*/
        }
        [data-browser-fullscreen] [class*="_player-display-footer_"]{
          background: linear-gradient(-180deg,
            transparent,
            rgba(0,0,0,.019) 12px,
            rgba(0,0,0,.073) 24px,
            rgba(0,0,0,.154) 36px,
            rgba(0,0,0,.346) 60px,
            rgba(0,0,0,.427) 72px,
            rgba(0,0,0,.481) 84px,
            rgba(0,0,0,.500) 96px
          ) !important;/*背景にサインカーブの影*/
          padding-top: 24px;/*グラデーションの余裕(要素の高さは公式生放送で36+40pxなので計100px)*/
        }
        [data-browser-fullscreen] [class*="_controller-display-button_"][data-toggle-state="false"]{
          transform: translateY(-24px);/*グラデーションの余裕でズレた分*/
        }
        [class*="_player-controller_"] button[aria-label]::before/*ボタンツールチップ*/,
        [class*="_player-controller_"] [class*="_volume-size-control_"]::before,
        [class*="_player-controller_"] [class*="_seek-information_"],
        [class*="_player-controller_"] [class*="_setting-panel_"]/*設定パネル*/{
          background: rgba(0,0,0,.75);/*半透明化*/
        }
        [data-browser-fullscreen] [class*="_player-controller_"] button > *|svg,
        [data-browser-fullscreen] [class*="_player-controller_"] [class*="_slider-track_"]/*音量*/,
        [data-browser-fullscreen] [class*="_player-controller_"] [class*="_program-statistics_"]/*番組統計情報*/,
        [data-browser-fullscreen] [class*="_player-controller_"] span[class*="_elapsed-time_"]/*経過時間*/,
        [data-browser-fullscreen] #comment-opacity-selector > li,
        dummy{
          filter:
            drop-shadow(0 0 2px rgba(0,0,0,1.00))
            drop-shadow(0 0 8px rgba(0,0,0,0.75))
          ;/*少しだけ見やすく*/
        }
        [data-browser-fullscreen] [class*="_player-controller_"] [class*="_slider_"]/*時刻音量スライダ*/{
          box-shadow: none;/*へんな影が追加される公式のミス(?)を回避*/
        }
        [data-browser-fullscreen] [class*="_program-statistics_"]/*番組統計情報; 2020/8現在要素がなくなった*/{
          display: block !important;
          color: white;
          margin-left: 1em;
        }
        [data-browser-fullscreen] [class*="_program-statistics_"] ul{
          height: 100%;
        }
        [data-browser-fullscreen] [class*="_program-statistics_"] li > *|*{
          position: absolute;
          transform: translate(0,-50%);
          top: 50%;
          margin: 0 4px;
        }
        [class*="_time-status-area_"] span[class*="_elapsed-time_"] > span:first-child/*現在時刻*/,
        [class*="_time-status-area_"] [class*="_time-text-box_"]/*時刻指定*/{
          font-size: 16px;/*少し大きく(公式12px)*/
          line-height: 24px;
        }
        [data-browser-fullscreen] [class*="_time-status-area_"] span[class*="_elapsed-time_"] > span:first-child/*現在時刻*/,
        [data-browser-fullscreen] [class*="_time-status-area_"] [class*="_time-text-box_"]/*時刻指定*/{
          font-size: 18px;/*少し大きく(公式12px)*/
        }
        [class*="_time-status-area_"] span[class*="_elapsed-time_"] > span:nth-child(2)/*時刻の区切り*/{
          margin: 0 .5em;/*少し間隔を広げて見やすく*/
        }
        /**** ニコニコ市場 ****/
        [class*="_ichiba-counter_"]{
          position: absolute;
          bottom: 40px;
          pointer-events: none;
          x-filter:/* 負荷があるようなので暫定回避 */
            drop-shadow(0 0 2px rgba(0,0,0,0.25))
            drop-shadow(0 0 8px rgba(0,0,0,0.25))
          ;/*少しだけ見やすく*/
        }
        [class*="_ichiba-counter-section_"],
        [class*="_broadcast-participation-area-disabled-message-area_"]{
          opacity: 0;/*ふだんは邪魔なので*/
          pointer-events: none;
        }
        [class*="_broadcast-participation-area_"]:hover [class*="_ichiba-counter_"][data-frozen="false"] [class*="_ichiba-counter-section_"]{
          animation: NiconicoTsu-fade 2500ms 1 forwards;
        }
        @keyframes NiconicoTsu-fade{
            0%/*   0ms*/{opacity: 0; pointer-events: none;}
           10%/* 250ms*/{opacity: 0; pointer-events: auto;}
           20%/* 500ms*/{opacity: 1; pointer-events: auto;}
           60%/*1500ms*/{opacity: 1; pointer-events: auto;}
          100%/*2500ms*/{opacity: 0; pointer-events: none;}
        }
        [class*="_broadcast-participation-area_"] [class*="_ichiba-counter_"][data-frozen="false"] [class*="_ichiba-counter-section_"]:hover{
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        [class*="_ichiba-counter-section_"] [class*="_queue-item-area_"] [class*="_item-placeholder_"]/*空欄アイテム枠*/,
        [class*="_ichiba-counter-section_"] [class*="_queue-item-area_"] button/*アイテム枠*/{
          background: rgba(0,0,0,.5);
          border-radius: 4px;
        }
        /**** コメントフォーム ****/
        [class*="_comment-post-panel_"]{
          padding: 0 !important;/*paddingとmarginの入れ替え*/
        }
        [class*="_comment-post-form_"]{
          margin: 0 8px 8px !important;/*paddingとmarginの入れ替え*/
        }
        [data-browser-fullscreen] [class*="_comment-post-panel_"]{
          max-width: 60em !important;/*ピクセル値ではなく可変に*/
        }
        [data-browser-fullscreen] [class*="_comment-post-form_"]{
          filter:
            drop-shadow(0 0 2px rgba(0,0,0,0.25))
            drop-shadow(0 0 8px rgba(0,0,0,0.25))
          ;/*少しだけ見やすく*/
        }
        [class*="_comment-post-form_"][aria-disabled="true"]/*タイムシフトでコメントができない状態*/{
          display: none;/*白く目立つ上に特に意味はないので*/
        }
        [class*="_comment-post-form_"] button[type="submit"]{
          transition: none !important;/*フルスクリーン時にtransitionかかるのを回避*/
        }
        input[name="command"]:not(:focus) + input[name="comment"]:not(:focus) + button[type="submit"]:not(:focus){
          color: #808080;/*コメント欄にフォーカスしていないならボタンは暗く*/
          background: #404040;
        }
        /**** ステータス/一覧コメント 共通 ****/
        [class*="_promotion-balloon_"]/*福引きの案内*/{
          display: none;
        }
        [class*="_player-status_"] *|svg > *|*{
          fill: #c0c0c0 !important;/*黒背景にしたぶんsvgの色も対応させる*/
        }
        [class*="_player-status_"] *|svg > *|*[fill="none"]{
          fill: none !important;/*黒背景にしたぶんsvgの色も対応させる*/
        }
        [class*="_program-statistics-menu_"],
        [class*="_tab-area_"]{
          background: black;
          border-color: gray;
          border-width: 1px;
        }
        [class*="_ng-setting-controller_"]::after{
          display: none;
        }
        [class*="_player-status_"],
        [class*="_tab-list_"] button/*コメント/おすすめ生放送*/{
          color: white;
          background: black;
          border: none;
        }
        [class*="_tab-list_"] button[aria-selected="true"]::after{
          background: white;
          height: 2px;
          bottom: 0px;
        }
        [class*="_tab-list_"] button:not([aria-selected="true"]){
          color: gray;
        }
        [class*="_tab-list_"] button:not([aria-selected="true"]):hover::after{
          background: gray;
          bottom: 0px;
        }
        /**** ステータス ****/
        [class*="_program-panel_"] [aria-label="部屋情報"] *,
        [class*="_program-panel_"] [class*="_comment-data-grid_"] header *{
          color: white;
          background: black;
          height: auto;
        }
        [class*="_program-panel_"]{
          width: 100%;
          height: calc(var(--font-size) * 4);
          display: block;
        }
        [class*="_program-panel_"] > *{
          padding: 0 0 0 1em;
        }
        [class*="_program-panel_"] *{
          font-size: var(--font-size) !important;
          line-height: 1.25 !important;
        }
        [class*="_program-panel_"] [class*="_header-area_"]{
          overflow: hidden;
          justify-content: flex-start;
        }
        [class*="_program-panel_"] [class*="_header-area_"] [aria-label="部屋情報"]{
          height: auto;
          white-space: nowrap;
        }
        [class*="_program-panel_"] [class*="_header-area_"] [aria-label="部屋情報"] + aside/*ギフトPR*/{
          margin: 0 .5em 0 .5em;
          height: auto;
          color: #c0c0c0;
        }
        [class*="_program-panel_"] [class*="_header-area_"] [aria-label="部屋情報"] + aside *{
          font-size: 87.5% !important;
        }
        [class*="_program-panel_"] [class*="_program-statistics_"] [data-value]{
          color: white;
        }
        [class*="_program-panel_"] [class*="_program-statistics_"] *|svg,
        [class*="_ng-panel-controller_"] [class*="_ng-button_"] *|svg{
          width: var(--font-size) !important;
          height: var(--font-size) !important;
        }
        /**** 一覧コメント ****/
        [class*="_comment-panel_"] [class*="_body_"]{
          -webkit-mask-image: linear-gradient(rgba(0,0,0,.5), black 1em);
          mask-image: linear-gradient(rgba(0,0,0,.5), black 1em);/*ヘッダとの境界をわかりやすくする影*/
        }
        [class*="_comment-panel_"] header{
          display: none;/*意味のある要素ではないので*/
        }
        [class*="_comment-panel_"] [class*="_header-table_"],
        [class*="_comment-panel_"] [class*="_table_"]{
          width: 100% !important;
        }
        [class*="_comment-panel_"] [class*="_table-row_"]:hover,
        [class*="_comment-panel_"] [class*="_table-row_"][aria-selected="true"]{
          background: #404040;
        }
        [class*="_comment-panel_"] [class*="_table-row_"] [class*="_table-cell_"]/*セル内スクロール対応*/{
          width: auto !important;
          overflow: visible !important;
          transition: transform 1000ms;
          flex: 1;
        }
        [class*="_comment-panel_"] [class*="_table-row_"]:hover [class*="_table-cell_"]{
          transform: translateX(calc(var(--comment-width) - 100%));/*セル内スクロール*/
        }
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="nicoad"] *|*::before/*広告アイコンを黄色に*/{
          -webkit-mask-image: var(--nicoad-icon);
          mask-image: var(--nicoad-icon);
          background: rgba(255,244,0,.75) !important;
          width: var(--font-size) !important;
          height: var(--font-size) !important;
          margin: 0 1em .2em 0;/*公式アイコンの重心調整*/
        }
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="nicoad"] */*広告文字を黄色に*/{
          color: rgba(255,244,0,.75) !important;
        }
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="trialWatch"] */*チャンネル無課金*/,
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="programExtend"] */*枠延長*/,
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="ranking"] */*ランキング入り通知*/,
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="cruise"] */*クルーズのお知らせ*/,
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="quote"] */*クルーズさんのコメント*/,
        [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="spi"] */*ニコニコ新市場*/,
        dummy{
          color: #a0a0a0 !important;/*黒背景に合わせて少し明るく*/
        }
        [class*="_comment-panel_"] [class*="_header-cell_"],
        [class*="_comment-panel_"] [class*="_table-cell_"]{
          font-size: var(--font-size);
          line-height: var(--line-height);
          padding: .2em 0 .2em 1em;
        }
        [class*="_comment-panel_"] [class*="_table-cell_"] > span{
          font-size: var(--font-size);
          width: auto !important;/*セル内スクロール対応*/
          overflow: visible !important;
        }
        [class*="_comment-panel_"] [class*="_table-cell_"] [class*="_comment-number_"]/*一部放送で表示されるコメント通し番号*/{
          display: none;
        }
        [class*="_comment-panel_"] [class*="_tooltip_"]{
          display: none;
          font-size: var(--font-size);
          color: white;
          background: rgba(32,32,32,.875);
          border-color: #404040;
        }
        /**** NGパネル ****/
        [class*="_ng-panel-controller_"] [class*="_ng-button_"][aria-expanded="false"]{
          width: var(--font-size) !important;
          height: var(--font-size) !important;
          /*少しだけ見やすく*/
          background: rgba(0,0,0,.75);
          border-radius: var(--font-size);
          padding: calc(var(--font-size) * .5);
          box-sizing: content-box;
          filter: drop-shadow(0 0 4px rgba(0,0,0,1.0));
        }
        [class*="_ng-panel_"] [class*="_ng-item-type-select-box_"],
        [class*="_ng-panel_"] [class*="_ng-register-button_"]{
          margin: 8px 0 0 8px;
        }
        [class*="_ng-panel_"] [class*="_ng-register-button_"]{
          flex: 1;
        }
        /**** おすすめ生放送 ****/
        [class*="_program-card-list_"] li{
          border-color: #333;
        }
        [class*="_program-title_"]{
          color: white;
        }
        [class*="_program-card_"]:hover{
          color: white;
          background: #333;
          border: none;
        }
        /**** その他 ****/
        [class*="_promote-menu_"]/*チケット購入者限定で放送中*/{
          background: rgba(255,255,255,.75);
          opacity: .25;
          transition: opacity 250ms;
        }
        [class*="_promote-menu_"]:hover{
          opacity: 1;
        }
        [class*="_banner-panel_"]{
          border: none;/*黒背景に合わせて広告の白ボーダーをなくす*/
          background: black;
        }
        [class*="_banner-panel_"] [class*="_close-button_"]{
          background: black;/*黒背景にしたぶん広告閉じるボタンの色も対応させる*/
        }
        [class*="_broadcast-participation-area_"]{
          border: none;/*タイムシフト時のコメント投稿欄の削除に合わせて(このままでは生放送中は不格好になるのでプレイヤ全体に下線を付与してある)*/
        }
        [class*="_player-area_"]{
          border-bottom: 1px solid #e5e5e5;/*コメント欄の下ボーダーをここで表現して区切りとする*/
        }
        [class*="_comment-post-form_"] [class*="_submit-button_"]{
          height: 100% !important;/*ボーダー1pxぶん調整*/
        }
        [class*="_snack-bar-area_"]{
          display: none;/*[タイムシフト視聴ではゲームやアンケートなどの操作はできません。]が邪魔*/
        }
        [class*="_program-information-area_"]{
          z-index: -1;/*後続のbox-shadowがプレイヤにかぶってくるので*/
        }
        [class*="_player-status_"] a,
        [class*="_program-statistics_"] button{
          color: inherit;
          background: transparent;
        }
        /**** 放送開始前 ****/
        [class*="_watch-rejected-information-overlay-area_"]{
          height: 100%;
        }
        [class*="_watch-rejected-information-overlay-area_"] [class*="_player-display-screen_"]{
          position: absolute;
          top: 0;
        }
        [class*="_watch-rejected-information-overlay-area_"] [class*="_player-display-screen_"] + [class*="_player-controller_"]{
          display: none;
        }
      </style>
    `,
    styleLive: () => `
      <style type="text/css">
        /* nicoHighlightColor: ${configs.nicoHighlightColor     = 'rgba(0,128,255,1)'} */
        /* panel_zIndex:       ${configs.panel_zIndex           = 101} */
        /* 流れるコメント透明度 */
        [data-selector="commentLayer"],
        [data-selector="telopLayer"]{
          transition: opacity 125ms;
        }
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="1"]{opacity: ${9/36 + ((9*(9+1))/2)/60}}/*比例25:75三角数(max:45)の重みがベスト*/
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="2"]{opacity: ${8/36 + ((8*(8+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="3"]{opacity: ${7/36 + ((7*(7+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="4"]{opacity: ${6/36 + ((6*(6+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="5"]{opacity: ${5/36 + ((5*(5+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="6"]{opacity: ${4/36 + ((4*(4+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="7"]{opacity: ${3/36 + ((3*(3+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="8"]{opacity: ${2/36 + ((2*(2+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="9"]{opacity: ${1/36 + ((1*(1+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="0"]{opacity: ${0/36 + ((0*(0+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="1"] ~ [data-selector="telopLayer"]{opacity: ${9/36 + ((9*(9+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="2"] ~ [data-selector="telopLayer"]{opacity: ${8/36 + ((8*(8+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="3"] ~ [data-selector="telopLayer"]{opacity: ${7/36 + ((7*(7+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="4"] ~ [data-selector="telopLayer"]{opacity: ${6/36 + ((6*(6+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="5"] ~ [data-selector="telopLayer"]{opacity: ${5/36 + ((5*(5+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="6"] ~ [data-selector="telopLayer"]{opacity: ${4/36 + ((4*(4+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="7"] ~ [data-selector="telopLayer"]{opacity: ${3/36 + ((3*(3+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="8"] ~ [data-selector="telopLayer"]{opacity: ${2/36 + ((2*(2+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="9"] ~ [data-selector="telopLayer"]{opacity: ${1/36 + ((1*(1+1))/2)/60}}
        [data-selector="playerDisplayScreen"] [data-selector="commentLayer"][data-opacity="0"] ~ [data-selector="telopLayer"]{opacity: ${0/36 + ((0*(0+1))/2)/60}}
        /* 10秒戻り中の流れるコメント非表示 */
        [data-selector="playerDisplayScreen"] #comment-layer-container{
          transition: opacity 1000ms;
          opacity: 1;
        }
        [data-selector="playerDisplayScreen"][data-rewinded="true"] #comment-layer-container{
          opacity: 0;
        }
        /* インジケータ */
        #${SCRIPTID}-indicator{
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 1vh 1vw;
          font-size: 25vh;
          color: ${configs.nicoHighlightColor};
          filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));
          opacity: 0;
          z-index: ${configs.panel_zIndex};
          pointer-events: none;
          transition: opacity 250ms;
        }
        #${SCRIPTID}-indicator.active{
          opacity: .75;
        }
        #${SCRIPTID}-indicator #rewind{
          fill: rgba(195,195,195,.5);
          width: 25vh;
          height: 25vh;
        }
        #${SCRIPTID}-indicator #rewind.rewinded{
          fill: ${configs.nicoHighlightColor};
        }
        #${SCRIPTID}-indicator.active #rewind{
          animation: ${SCRIPTID}-blink 2s step-end infinite;
        }
        @keyframes ${SCRIPTID}-blink{
          50%{opacity: 0}
        }
        /* コメント透明度インジケータ・セレクタ */
        #comment-opacity-indicator{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          line-height: 32px;/*職人的調整*/
          font-size: 12px;
          font-weight: bold;
          color: black;
          z-index: 1;
        }
        #comment-opacity-indicator[data-opacity="1"], #comment-opacity-selector [data-opacity="1"]{opacity: ${9/9}}/*視認性を重視*/
        #comment-opacity-indicator[data-opacity="2"], #comment-opacity-selector [data-opacity="2"]{opacity: ${8/9}}
        #comment-opacity-indicator[data-opacity="3"], #comment-opacity-selector [data-opacity="3"]{opacity: ${7/9}}
        #comment-opacity-indicator[data-opacity="4"], #comment-opacity-selector [data-opacity="4"]{opacity: ${6/9}}
        #comment-opacity-indicator[data-opacity="5"], #comment-opacity-selector [data-opacity="5"]{opacity: ${5/9}}
        #comment-opacity-indicator[data-opacity="6"], #comment-opacity-selector [data-opacity="6"]{opacity: ${4/9}}
        #comment-opacity-indicator[data-opacity="7"], #comment-opacity-selector [data-opacity="7"]{opacity: ${3/9}}
        #comment-opacity-indicator[data-opacity="8"], #comment-opacity-selector [data-opacity="8"]{opacity: ${2/9}}
        #comment-opacity-indicator[data-opacity="9"], #comment-opacity-selector [data-opacity="9"]{opacity: ${1/9}}
        #comment-opacity-indicator[data-opacity="0"], #comment-opacity-selector [data-opacity="0"]{opacity: ${0/9}}
        [data-selector="commentVisibilityButton"][data-toggle-state="false"] #comment-opacity-indicator{visibility: hidden}
        [data-selector="commentVisibilityButton"]{
          z-index: 1;/*後のセレクタより上に*/
        }
        #comment-opacity-selector{
          color: white;
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          position: absolute;
          height: 100%;
          line-height: 32px;
          font-size: 12px;
          opacity: 0;
          pointer-events: none;
          transform: translate(calc(-100% + 32px), 0);
          transition: 250ms;
        }
        #comment-opacity-selector::before/*公式がクラス指定じゃないのでやむなくコピペ*/{
          content: attr(aria-label);
          display: block;
          position: absolute;
          bottom: 100%;
          left: 50%;
          padding: 6px 8px;
          letter-spacing: normal;
          box-sizing: border-box;
          text-align: center;
          white-space: nowrap;
          color: #fff;
          border-radius: 2px;
          background: rgba(0,0,0,.75);/*改変*/
          font-size: 12px;
          line-height: 1;
          pointer-events: none;
          transform: translate(-50%);
          z-index: 10000;
          box-shadow: 0 0 2px 0 rgba(0,0,0,.5);
          opacity: 0;
          transition: opacity .12s ease;
        }
        #comment-opacity-selector:hover::before{
          opacity: 1;
        }
        [data-selector="commentVisibilityButton"]:hover + #comment-opacity-selector,
        [data-selector="commentVisibilityButton"] + #comment-opacity-selector:hover{
          pointer-events: auto;
          opacity: 1;
          transform: translate(calc(-100% + 0px), 0);
        }
        #comment-opacity-selector li{
          padding: 0 .25em;
          cursor: pointer;
          transition: .12s ease;/*公式に合わせる*/
        }
        #comment-opacity-selector li:first-child{
          padding: 0 .25em 0 1.25em;
        }
        #comment-opacity-selector li:hover{
          opacity: 1;
          color: ${configs.nicoHighlightColor};
        }
        /* 当日時刻の追加 */
        [data-selector="seekInformation"]{
          display: flex;
          flex-direction: column;
        }
        [data-selector="seekInformation"] .${SCRIPTID}-localTime{
          color: #808080;
          font-size: 12px;
          margin-bottom: .25em;
        }
        [data-selector="timeStatusArea"] button[data-live-status="live"] ~ div .${SCRIPTID}-localTime{
          display: none;
        }
        [data-selector="timeStatusArea"] .${SCRIPTID}-localTime{
          color: #808080;
          font-size: 12px !important;
          margin: 0 .5em;
        }
        [data-browser-fullscreen] [data-selector="timeStatusArea"] .${SCRIPTID}-localTime{
          color: #c0c0c0;
        }
        [data-selector="timeStatusArea"] .${SCRIPTID}-localTime + span{
          font-size: 16px;/*少し大きく(公式12px)*/
          line-height: 24px;
        }
        [data-browser-fullscreen] [data-selector="timeStatusArea"] .${SCRIPTID}-localTime + span{
          font-size: 18px;/*少し大きく(公式12px)*/
        }
        [data-selector="timeStatusArea"] .${SCRIPTID}-localTime + span + span/*時刻の区切り*/{
          margin: 0 .5em;/*少し間隔を広げて見やすく*/
        }
        /* 新着コメント停止状態 */
        [class*="_comment-panel_"]:hover::after{
          content: " ";
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 4px;
          animation: ${SCRIPTID}-stop 1s linear infinite alternate;
        }
        @keyframes ${SCRIPTID}-stop{
          0%{
            background: ${configs.nicoHighlightColor};
          }
          100%{
            background: transparent;
          }
        }
        /* ユーザー発言一覧 */
        dummy [class*="_comment-panel_"] [class*="_table-row_"][data-comment-type="normal"]{
          cursor: pointer;
        }
        /* 新着コメントのハイライト */
        [class*="_comment-panel_"] [class*="_table-row_"][data-new="true"]::after{
          animation: ${SCRIPTID}-new 6s linear 1 forwards;
          content: " ";
          width: 100%;
          height: 32px;
          background: rgba(255,255,255,.250);
          position: absolute;
          pointer-events: none;
        }
        @keyframes ${SCRIPTID}-new{
          0%{
            opacity: 1;
          }
          100%{
            opacity: 0;
          }
        }
        /* 新着コメントの公式スクロールインジケータ */
        [class*="_comment-panel_"] button[class*="_indicator_"]{
          opacity: 0 !important;
        }
        [class*="_comment-panel_"]:hover button[class*="_indicator_"]{
          opacity: 1 !important;
        }
        /* NGスコア */
        [class*="_comment-panel_"] [class*="_table-row_"] [class="___comment-score___${SCRIPTID}"]{
          visibility: hidden;
          margin: 0 .25em;
        }
        [class*="_comment-panel_"] [class*="_table-row_"]:hover [class="___comment-score___${SCRIPTID}"]{
          visibility: visible;
          color: #808080;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window), requestIdleCallback = window.requestIdleCallback.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  if(!('fullscreenElement' in document)) Object.defineProperty(document, 'fullscreenElement', {get: function(){return document.mozFullScreenElement}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
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
      if(data.value === undefined) return undefined;
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
  const wait = function(ms){return new Promise((resolve) => setTimeout(resolve, ms))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false, subtree: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const linkify = function(node){
    split(node);
    function split(n){
      if(['style', 'script', 'a'].includes(n.localName)) return;
      if(n.nodeType === Node.TEXT_NODE){
        let pos = n.data.search(linkify.RE);
        if(0 <= pos){
          let target = n.splitText(pos);/*pos直前までのnとpos以降のtargetに分割*/
          let rest = target.splitText(RegExp.lastMatch.length);/*targetと続くrestに分割*/
          /* この時点でn(処理済み),target(リンクテキスト),rest(次に処理)の3つに分割されている */
          let a = document.createElement('a');
          let match = target.data.match(linkify.RE);
          switch(true){
            case(match[1] !== undefined): a.href = (match[1][0] == 'h') ? match[1] : 'h' + match[1]; break;
            case(match[2] !== undefined): a.href = 'http://' + match[2]; break;
            case(match[3] !== undefined): a.href = 'mailto:' + match[4] + '@' + match[5]; break;
          }
          a.appendChild(target);/*textContent*/
          rest.before(a);
        }
      }else{
        for(let i = 0; n.childNodes[i]; i++) split(n.childNodes[i]);/*回しながらchildNodesは増えていく*/
      }
    }
  };
  linkify.RE = new RegExp([
    '(h?ttps?://[-\\w_./~*%$@:;,!?&=+#]+[-\\w_/~*%$@:;&=+#])',/*通常のURL*/
    '((?:\\w+\\.)+\\w+/[-\\w_./~*%$@:;,!?&=+#]*)',/*http://の省略形*/
    '((\\w[-\\w_.]+)(?:@|＠)(\\w[-\\w_.]+\\w))',/*メールアドレス*/
  ].join('|'));
  const secondsToTime = function(seconds){
    let floor = Math.floor, zero = (s) => s.toString().padStart(2, '0');
    let h = floor(seconds/3600), m = floor(seconds/60)%60, s = floor(seconds%60);
    if(h) return h + '時間' + zero(m) + '分' + zero(s) + '秒';
    if(m) return m + '分' + zero(s) + '秒';
    if(s) return s + '秒';
  };
  const timeToSeconds = function(time){
    let sign = (time[0] === '-') ? -1 : +1, parts = time.replace(/^-/, '').split(':').map(p => parseFloat(p)), s = 1, m = 60*s, h = 60*m;
    switch(parts.length){
      case(1): return sign * (parts[0]*s);
      case(2): return sign * (parts[0]*m + parts[1]*s);
      case(3): return sign * (parts[0]*h + parts[1]*m + parts[2]*s);
      default: return 0;
    }
  };
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
    if(typeof DEBUG === 'undefined') return;
    console.log(...log.build(new Error(), ...arguments));
  };
  log.build = function(error, ...args){
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    return [SCRIPTID + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...args
    ];
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
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 2,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 1,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
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
    //console.log('////', f.name, 'wants', 0/*the exact line number here*/, '\n' + new Error().stack);
    return true;
  });
  const warn = function(){
    if(!DEBUG) return;
    let body = Array.from(arguments).join(' ');
    if(warn.notifications[body]) return;
    Notification.requestPermission();
    warn.notifications[body] = new Notification(SCRIPTNAME, {body: body});
    warn.notifications[body].addEventListener('click', function(e){
      Object.values(warn.notifications).forEach(n => n.close());
      warn.notifications = {};
    });
    log(body);
  };
  warn.notifications = {};
  const time = function(label){
    if(!DEBUG) return;
    const BAR = '|', TOTAL = 100;
    switch(true){
      case(label === undefined):/* time() to output total */
        let total = 0;
        log('Total:');
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
      case(!time.records[label]):/* time('label') to create and start the record */
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
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();