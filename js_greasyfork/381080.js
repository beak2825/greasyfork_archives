// ==UserScript==
// @name        AbemaTV Video Assistant
// @namespace   knoa.jp
// @description AbemaTV のビデオ視聴を快適にします。
// @include     https://abema.tv/*
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/381080/AbemaTV%20Video%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/381080/AbemaTV%20Video%20Assistant.meta.js
// ==/UserScript==

// console.log('AbemaTV? => hireMe()');
(function(){
  const SCRIPTNAME = 'VideoAssistant';
  const DEBUG = false;/*
[update] 1.0.3
再生速度が「次のエピソード」への移動でリセットされてしまうバグを解消。(またしてもアベマ公式の謎仕様に起因(｡◟‸◞｡✿))

[bug]

[to do]
video以外のページならgoneでcss外すか。
時刻ズレが気持ち悪いので全体時間も上書きしよう。

[to research]
無音時に限り音量が記憶されない公式のバグ
CMで一瞬ヘッダがでるのは公式の仕様

[possible]
上部ナビゲーション番組表の隣にマイリスト昇格
ビデオ視聴ページ
  戻る進む時に画面中央にインジケータ
  コメント数ヒートマップ ?
マイリストページ
  一覧性向上や分類など
  「プレミアムなら」を明示
  期限切れをすべて削除するボタン
ビデオトップページ
  removed_genre:   {TYPE: 'object', DEFAULT: {}},*(削除したジャンル)*
  removed_heading: {TYPE: 'object', DEFAULT: {}},*(削除した見出し)*

[requests]

[not to do]
:has疑似セレクタ実装はまだまだ先になりそう
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const CONFIGS = {
    /* ビデオ再生 */
    auto_play:       {TYPE: 'bool',   DEFAULT: 1 },/*自動で再生を開始する*/
    keep_screen:     {TYPE: 'bool',   DEFAULT: 0 },/*ブラウザ全画面かどうかを記憶する*/
    keep_speed:      {TYPE: 'bool',   DEFAULT: 0 },/*再生速度を記憶する*/
    /* 次のエピソードへの移動 */
    show_next:       {TYPE: 'bool',   DEFAULT: 1 },/*次のエピソードへの移動ボタンを出す*/
    next_at_end:     {TYPE: 'bool',   DEFAULT: 0 },/*　ビデオの最後まで再生してから出す*/
    next_countdown:  {TYPE: 'bool',   DEFAULT: 1 },/*　カウントダウンして自動移動する*/
  };
  const URLS = {
    CHANNELS: 'https://abema.tv/channels/',/*見逃し番組視聴ページ(未来や期限切れも含む)*/
    VIDEO:    'https://abema.tv/video/episode/',/*ビデオ視聴ページ(期限切れも含む)*/
  };
  const EASING = 'cubic-bezier(0,.75,.5,1)';/*主にナビゲーションのアニメーション用*/
  const RETRY = 10;/*必要な要素が見つからずあきらめるまでの試行回数*/
  let site = {
    videoTargets: {
      video: () => $('.com-a-Video__container video[src]'),/*CMとは区別する*/
    },
    adVideoTargets: {
      adContainer: () => $('#videoAdContainer'),
      adVideos: () => $$('#videoAdContainer video'),/*CM*/
      adVideoController: () => $('.com-video_ad-VideoAdControlBar__controls'),
    },
    elementTargets: {
      player: () => $('.c-tv-SlotPlayerContainer') || $('.c-vod-PlayerContainer-wrapper'),/*タイムシフトまたはビデオ*/
      controlBackground: () => $('.com-vod-VideoControlBar__bg'),
      playButton: () => $('.com-vod-VideoControlBar__play-handle'),
      currentTime: () => $('.com-vod-VODTime > span > time'),
      playbackRateButton: () => $('.com-vod-VideoControlBar__playback-rate'),
      VolumeController: () => $('.com-vod-VideoControlBar__volume'),
    },
    nextButtonTargets: {/*次のエピソードへ*/
      nextButton: () => $('.com-vod-VODNextProgramInfo'),
      nextButtonAnchor: () => $('.com-vod-VODNextProgramInfo a[href]'),
      nextButtonCount: () => $('.com-video-MediaInfoCard__count'),
      nextButtonCountPie: () => $('.com-video-MediaInfoCard__thumbnail > span'),
      nextButtonCancel: () => $('.com-vod-VODNextProgramInfo__close-button'),
    },
    screenButtonTargets: {/*画面サイズボタン*/
      fullScreenInBrowserButton: () => $('.com-vod-VideoControlBar__screen-controller'),
      fullScreenButton: () => $('.com-vod-VideoControlBar__screen-controller + .com-vod-VideoControlBar__screen-controller'),
    },
    screenButtonOnAdTargets: {/*CM中の画面サイズボタン*/
      fullScreenInBrowserButtonOnAd: () => $('.com-video_ad-VideoAdControlBar__button'),
      fullScreenButtonOnAd: () => $('.com-video_ad-VideoAdControlBar__button + .com-video_ad-VideoAdControlBar__button'),
    },
    get: {
      playbackImage: () => $('.com-vod-VODScreen-playback-image'),/*再生/停止のオーバーレイインジケータ*/
      playbackIcon: (button) => button.querySelector('use[*|href^="/images/icons/playback.svg"]'),/*再生/停止ボタンの再生アイコン*/
      currentPlaybackRate: () => $('.com-a-RadioButton--checked input[name="vod-setting-playbackRate"]'),/*現在選択中の再生速度*/
      targetPlaybackRate: (value) => $(`input[name="vod-setting-playbackRate"][value="${value}"]`),/*目的の再生速度*/
      miniScreenInBrowserIcon: (button) => button.querySelector('use[*|href^="/images/icons/mini_screen_in_browser.svg"]'),
      fullScreenInBrowserIcon: (button) => button.querySelector('use[*|href^="/images/icons/full_screen_in_browser.svg"]'),
      miniScreenIcon: (button) => button.querySelector('use[*|href^="/images/icons/mini_screen.svg"]'),/*元の小画面または中画面に戻る*/
      fullScreenIcon: (button) => button.querySelector('use[*|href^="/images/icons/full_screen.svg"]'),
      nextProgramThumbnail: (button) => button.querySelector('a img[alt]'),
    },
  };
  let elements = {}, storages = {}, configs = {}, timers = {};
  let core = {
    initialize: function(){
      html = document.documentElement;
      core.config.read();
      core.addStyle();
      core.panel.createPanels();
      core.listenUserActions();
      core.checkUrl();
    },
    checkUrl: function(){
      let previousUrl = '';
      const videoPages = [URLS.CHANNELS, URLS.VIDEO];
      const isVideoPage = () => videoPages.some(url => location.href.startsWith(url));
      const wasVideoPage = () => videoPages.some(url => previousUrl.startsWith(url));
      setInterval(function(){
        switch(true){
          case(location.href === previousUrl): return;/*URLが変わってない*/
          case(isVideoPage()):/*ビデオ視聴ページ*/
            core.videoReady();/*ビデオ視聴ページに来た*/
            break;
          default:/*ビデオ視聴ページではない*/
            break;
        }
        previousUrl = location.href;
      }, 1000);
    },
    videoReady: function(){
      let previousSrc = (elements.video) ? elements.video.src : null;
      core.getTargets(site.videoTargets, RETRY).then(() => {
        if(elements.video.src === previousSrc) setTimeout(core.videoReady, 1000);/*まだDOMが差し替わってない*/
        log("I'm ready for video.");
        html.classList.add(SCRIPTNAME);
        core.setAutoPlay();
        core.adVideosReady();
        core.elementsReady();
      });
    },
    adVideosReady: function(){
      core.getTargets(site.adVideoTargets, RETRY).then(() => {
        log("I'm ready for ad videos.");
        core.keepScreen();
        core.makeAdsPausable();
        core.waitForAdEnded();
      });
    },
    elementsReady: function(){
      core.getTargets(site.elementTargets, RETRY).then(() => {
        log("I'm ready for elements.");
        core.config.createButton();
        core.replaceVideoTime();
        core.keepScreen();
        core.keepSpeed();
        core.alterNextButton();
        core.modifyPlayButton();
      });
    },
    getTargets: function(targets, retry = 0){
      const get = function(resolve, reject, retry){
        for(let i = 0, keys = Object.keys(targets), key; key = keys[i]; i++){
          let selected = targets[key]();
          if(selected){
            if(selected.length) selected.forEach((s) => s.dataset.selector = key);
            else selected.dataset.selector = key;
            elements[key] = selected;
          }else{
            if(--retry < 0) return reject(log(`Not found: ${key}, I give up.`));
            log(`Not found: ${key}, retrying... (left ${retry})`);
            return setTimeout(get, 1000, resolve, reject, retry);
          }
        }
        resolve();
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject, retry);
      });
    },
    listenUserActions: function(){
      document.addEventListener('fullscreenchange', function(e){
        if(document.fullscreenElement){/*フルスクリーンなら*/
          document.fullscreenElement.appendChild(elements.panels);
        }else{
          document.body.appendChild(elements.panels);
        }
      });
    },
    makeAdsPausable: function(){
      let adContainer = elements.adContainer, adVideoController = elements.adVideoController, cuurentAd = undefined;
      const toggle = function(e){
        if(!cuurentAd){
          cuurentAd = Array.from(elements.adVideos).find((v) => !v.paused);/*elements.にしないとlistener登録した時点の古いDOMを引きずる*/
          if(cuurentAd) cuurentAd.pause();
        }else{
          cuurentAd.play();
          cuurentAd = undefined;
        }
      };
      if(!adContainer.isListeningClick){/*要素ごとに1度だけ*/
        adContainer.isListeningClick = true;
        adContainer.addEventListener('click', function(e){
          if(adVideoController.contains(e.target)) return;
          toggle(e);
        }, {capture: true});
      }
      if(!core.makeAdsPausable.isListeningKeydown){/*スクリプトごとに1度だけ*/
        core.makeAdsPausable.isListeningKeydown = true;
        if(html.classList.contains('ShortcutKeyController')){
          window.addEventListener('keydown', function(e){
            if(['input', 'textarea'].includes(document.activeElement.localName)) return;
            if(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;
            if(['k', ' ', 'Enter'].includes(e.key)) toggle(e);
          }, {capture: true});
        }
      }
    },
    waitForAdEnded: function(){
      let adVideos = elements.adVideos;
      adVideos.forEach((v) => v.addEventListener('ended', core.elementsReady));
    },
    replaceVideoTime: function(){
      let video = elements.video, currentTime = elements.currentTime, replacedCurrentTime = currentTime.cloneNode(true);
      const secondsToTime = function(seconds){
        let floor = Math.floor, zero = (s) => s.toString().padStart(2, '0');
        let h = floor(seconds/3600), m = floor(seconds/60)%60, s = floor(seconds%60);
        if(h) return h + ':' + zero(m) + ':' + zero(s);
        else  return m + ':' + zero(s);
      };
      const tiktok = function(e){/*なおアベマ公式はdelay調整無しで1秒ごとに四捨五入*/
        let delay = ((1 - video.currentTime%1) / video.playbackRate)*1000;/*次の秒になるまでの時間(足りなくてももう一度呼ばれて問題ない)*/
        if(0.5 < delay) replacedCurrentTime.textContent = secondsToTime(video.currentTime);
        clearInterval(timers.tiktok), timers.tiktok = setTimeout(tiktok, delay);
      };
      /* 独自要素に置き換える */
      replacedCurrentTime.dataset.selector = 'replacedCurrentTime';
      currentTime.parentNode.insertBefore(replacedCurrentTime, currentTime);
      /* 再生中に独自要素を更新し続ける */
      if(!video.paused) tiktok();
      video.addEventListener('play', tiktok);
      video.addEventListener('pause', function(e){
        clearInterval(timers.tiktok);
      });
      video.addEventListener('seeked', function(e){
        replacedCurrentTime.textContent = secondsToTime(video.currentTime);
      });
    },
    setAutoPlay: function(){
      let video = elements.video, nextButton = elements.nextButton || createElement(), playbackImage = site.get.playbackImage() || createElement();
      let conditions = [[/*停止状態にしたい条件*/
        (configs.auto_play === 0),/*自動で再生を開始しない*/
        (location.href.endsWith('?next=true') === false),/*1つめのエピソードである*/
      ], [
        (configs.auto_play === 0),/*自動で再生を開始しない*/
        (nextButton.videoWasPaused === true),/*ビデオが停止中であった*/
        (nextButton.clicked === true),/*リンクをみずからクリック(カウントダウンではない)*/
      ]];
      const pause = function(e){
        video.pause();
        setTimeout(function(){playbackImage.style.visibility = ''}, 1500);/*1000で足りないこともあったので*/
        video.removeEventListener('canplay', pause);
      };
      if(conditions.some((set) => set.every((c) => (c === true)))){
        playbackImage.style.visibility = 'hidden';
        video.addEventListener('canplay', pause);/*一瞬音声が流れてしまうこともある*/
      }
      /* setAutoPlayが呼ばれる(新しい番組)ごとにリセット */
      nextButton.videoWasPaused = false;
      nextButton.clicked = false;
    },
    modifyPlayButton: function(){
      let video = elements.video, playButton = elements.playButton;
      let conditions = [/*アイコンを修正すべき条件*/
        (configs.auto_play === 0),/*自動で再生を開始しない*/
        (video.paused === true),/*停止している*/
        (site.get.playbackIcon(playButton) === null),/*にもかかわらずアイコンが停止状態を示していない!!*/
      ];
      if(conditions.every((c) => c === true)) playButton.click();/*アイコンだけ停止状態になる*/
    },
    keepScreen: function(){
      /* fullScreenInBrowserButton(小画面と中画面のトグル) + fullScreenButton(全画面:DOM再取得が必要) */
      Promise.race([
        core.getTargets(site.screenButtonTargets, RETRY),
        core.getTargets(site.screenButtonOnAdTargets, RETRY),
      ]).then(() => {
        let video = elements.video;
        let fullScreenInBrowserButton = [elements.fullScreenInBrowserButton, elements.fullScreenInBrowserButtonOnAd].find((e) => e && e.isConnected);
        let fullScreenButton = [elements.fullScreenButton, elements.fullScreenButtonOnAd].find((e) => e && e.isConnected);
        const DELAY = 1000;/*画面サイズの変更にかかる時間を確保*/
        const getCurrentScreen = function(){
          switch(true){
            case(site.get.fullScreenInBrowserIcon(fullScreenInBrowserButton) !== null):
              return 'miniScreenInBrowser';/*小画面*/
            case(site.get.miniScreenInBrowserIcon(fullScreenInBrowserButton) !== null):
              return 'fullScreenInBrowser';/*中画面*/
            case(site.get.miniScreenIcon(fullScreenButton) !== null):
              return 'fullScreen';/*全画面*/
          }
        };
        const saveScreen = function(e){
          Storage.save('screen', getCurrentScreen());
        };
        const setScreen = function(){
          switch(Storage.read('screen')){
            case('miniScreenInBrowser'):/*小画面*/
              return;
            case('fullScreenInBrowser'):/*中画面*/
              return fullScreenInBrowserButton.click(); 
            case('fullScreen'):/*全画面*/
              return fullScreenButton.click();/*ブラウザ仕様につき機能しない*/
          }
        };
        if(!fullScreenInBrowserButton.isListeningClick){/*ボタンごとに1度だけ*/
          fullScreenInBrowserButton.isListeningClick = true;
          fullScreenInBrowserButton.addEventListener('click', function(e){
            setTimeout(saveScreen, DELAY);
          });
        }
        if(!core.keepScreen.isListeningFullscreenchange){/*スクリプトごとに1度だけ*/
          core.keepScreen.isListeningFullscreenchange = true;
          document.addEventListener('fullscreenchange', function(e){
            setTimeout(saveScreen, DELAY);
            if(!document.fullscreenElement) setTimeout(core.keepScreen, DELAY);/*ボタンが差し替えられるので*/
          });
        }
        if(video.setScreen !== location.href){/*ビデオ内容ごとに1度だけ*/
          video.setScreen = location.href;
          if(configs.keep_screen) setScreen();/*初回の視聴画面サイズを再現*/
        }
      });
    },
    keepSpeed: function(){
      let video = elements.video, playbackRateButton = elements.playbackRateButton;
      const getCurrentSpeed = function(){
        return site.get.currentPlaybackRate().value || 1;
      };
      const saveSpeed = function(e){
        Storage.save('speed', getCurrentSpeed());
      };
      const setSpeed = function(){
        let speed = Storage.read('speed') || 1;
        let input = site.get.targetPlaybackRate(speed);
        if(input) input.click();/*checkだけではアベマのDOMが反応しない*/
      };
      if(!playbackRateButton.isListeningRatechange){
        playbackRateButton.isListeningRatechange = true;
        /* video要素へのratechangeイベントだと、次のエピソードに移ったときにアベマによる強制リセットで元に戻ってしまう */
        playbackRateButton.addEventListener('click', function(e){
          log(e);
          setTimeout(saveSpeed, 1000);
        });
      }
      setSpeed();
    },
    alterNextButton: function(){
      if(!location.href.startsWith(URLS.VIDEO)) return;/*次のエピソードが表示されるのはビデオのみ*/
      core.getTargets(site.nextButtonTargets, RETRY).then(() => {
        let video = elements.video, nextButton = elements.nextButton, nextButtonAnchor = elements.nextButtonAnchor;
        let nextButtonCount = elements.nextButtonCount, nextButtonCancel = elements.nextButtonCancel;
        /* ビデオ終了時の独自カウントダウン(再生アイコンのアニメーションは割愛) */
        const COUNT = 10;
        const countdown = function(){
          let node = nextButtonCount.firstChild, count = COUNT;
          node.data = String(count);
          clearInterval(timers.countdown), timers.countdown = setInterval(function(){
            node.data = String(--count);
            if(count === 0){
              clearInterval(timers.countdown);
              nextButton.dataset.shown = 'false';
              nextButtonAnchor.click();
            }
          }, 1000);
        };
        /* 番組終了間際に自動でボタンが出現する瞬間を検知する */
        observe(nextButton, function(records){
          if(nextButtonCancel.disabled) return;/*閉じた(つもり)のときは何もしない*/
          if(video.ended){
            nextButton.dataset.shown = 'true';/*閉じなくてもよい*/
            if(configs.next_countdown) countdown();/*独自カウントダウン*/
            return;
          }
          switch(true){
            case(configs.show_next === 0):/*すぐ閉じて表示もさせない*/
              nextButtonCancel.click();
              nextButton.dataset.shown = 'false';
              break;
            case(configs.next_at_end === 1):/*すぐ閉じて表示もさせない*/
              nextButtonCancel.click();
              nextButton.dataset.shown = 'false';
              break;
            case(configs.next_countdown === 0):/*すぐ閉じてカウントダウンさせない*/
              nextButtonCancel.click();
              nextButton.dataset.shown = 'true';
              break;
            default:/*閉じずにカウントダウン表示を続ける*/
              nextButton.dataset.shown = 'true';
              break;
          }
        }, {attributes: true, attributeFilter: ['class']});/*公式のclass変化のみを監視する*/
        nextButton.classList.add('observing');/*すでにボタンが出ていた場合のきっかけにする*/
        /* 次のエピソードの自動再生判定のためにボタンの実クリックを記録する */
        nextButtonAnchor.addEventListener('click', function(e){
          nextButton.videoWasPaused = video.paused;
          if(e.isTrusted){
            nextButton.clicked = true;
          }
        });
        /* ボタンの表示を独自に制御 */
        nextButtonCancel.addEventListener('click', function(e){
          if(e.isTrusted){
            nextButton.dataset.shown = 'false';/*実クリックされたらもちろん消す*/
            clearInterval(timers.countdown);/*独自カウントダウンしていたら止める*/
            return;
          }
          setTimeout(function(){nextButtonCancel.disabled = false}, 1000);/*クリックはいつでもできる(正規のクリック後に上書き)*/
        });
        if(!video.isListeningSeeking){/*ビデオごとに1度だけ*/
          video.isListeningSeeking = true;
          video.addEventListener('seeking', function(e){
            let thumbnail = site.get.nextProgramThumbnail(nextButton);
            if(!thumbnail || thumbnail.alt === '') return;/*次のエピソードなし*/
            if(nextButton.dataset.shown === 'true') nextButton.dataset.shown = 'false';
            else if(video.currentTime + 1/*許容範囲*/ > video.duration) nextButton.dataset.shown = 'true';
          });
        }
      });
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
        /* 再生速度ボタンを元に設定ボタンを追加する */
        let configButton = elements.configButton = createElement(core.html.configButton());
        configButton.className = elements.playbackRateButton.className;
        configButton.addEventListener('click', core.config.toggle);
        elements.playbackRateButton.parentNode.insertBefore(configButton, elements.playbackRateButton);/*元のDOM位置関係にできるだけ影響を与えない*/
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
        }, true);
        configPanel.querySelector('input[name="show_next"]').addEventListener('click', function(e){
          let selectors = ['next_at_end', 'next_countdown'];
          selectors.forEach(selector => {
            let sub = configPanel.querySelector(`input[name="${selector}"]`);
            sub.disabled = !sub.disabled;
            sub.parentNode.parentNode.classList.toggle('disabled');
          });
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
      configButton: () => `
        <button id="${SCRIPTNAME}-config-button" title="${SCRIPTNAME} 設定"><svg width="20" height="20" role="img"><use xlink:href="/images/icons/config.svg#svg-body"></use></svg></button>
      `,
      configPanel: () => `
        <div class="panel" id="${SCRIPTNAME}-config-panel" data-name="configPanel" data-order="1">
          <h1>${SCRIPTNAME}設定</h1>
          <fieldset>
            <legend>ビデオ再生</legend>
            <p><label>自動で再生を開始する:               <input type="checkbox" name="auto_play"   value="${configs.auto_play}"   ${configs.auto_play   ? 'checked' : ''}></label></p>
            <p><label>ブラウザ全画面かどうかを記憶する:   <input type="checkbox" name="keep_screen" value="${configs.keep_screen}" ${configs.keep_screen ? 'checked' : ''}></label></p>
            <p><label>再生速度を記憶する:                 <input type="checkbox" name="keep_speed"  value="${configs.keep_speed}"  ${configs.keep_speed  ? 'checked' : ''}></label></p>
            <legend>次のエピソードへの移動</legend>
            <p><label>次のエピソードへの移動ボタンを出す: <input type="checkbox" name="show_next"   value="${configs.show_next}"   ${configs.show_next   ? 'checked' : ''}></label></p>
            <p class="sub ${configs.show_next ? '' : 'disabled'}"><label>最後まで再生し終えたときだけ出す: <input type="checkbox" name="next_at_end"    ${configs.next_at_end    ? 'checked' : ''} ${configs.show_next ? '' : 'disabled'}></label></p>
            <p class="sub ${configs.show_next ? '' : 'disabled'}"><label>カウントダウンして自動移動する:   <input type="checkbox" name="next_countdown" ${configs.next_countdown ? 'checked' : ''} ${configs.show_next ? '' : 'disabled'}></label></p>
          </fieldset>
          <p class="buttons"><button class="cancel">キャンセル</button><button class="save primary">保存</button></p>
        </div>
      `,
      panels: () => `
        <div class="panels" id="${SCRIPTNAME}-panels"></div>
      `,
      style: () => `
        <style type="text/css">
          /* panel_zIndex:           ${configs.panel_zIndex           = 100} */
          /* nav_transition:         ${configs.nav_transition         = `250ms ${EASING}`} */
          /* ウィンドウサイズ可変対応 */
          body{
            overflow-x: hidden;/*横スクロールバーを出さないように*/
          }
          [data-selector="player"]{
            max-width: 100vw;/*小さいウィンドウにもできるだけビデオサイズを追随させる*/
          }
          /* コントローラUI */
          [data-selector="controlBackground"]{
            background: linear-gradient(transparent, rgba(0,0,0,.1), rgba(0,0,0,.3), rgba(0,0,0,.6));/*影を薄めつつ立ち上がりも優しく*/
          }
          /* 現在時刻 */
          [data-selector="currentTime"]{
            display: none;
          }
          [data-selector="replacedCurrentTime"]{
          }
          /* 設定ボタン */
          #${SCRIPTNAME}-config-button{
            fill: white;
            animation: ${SCRIPTNAME}-show 250ms 1;
          }
          @keyframes ${SCRIPTNAME}-show{
            from{
              opacity: 0;
            }
            to{
              opacity: 1;
            }
          }
          /* 再生速度ボタン */
          [data-selector="playbackRateButton"] > div > div{
            padding: 0 10px 5px;/*スライダの表示判定を広くしてあげる*/
            margin-bottom: -5px;
            box-sizing: content-box;
          }
          /* ボリュームボタン(CSS指定が異なる(!)リアルタイム放送に影響を与えないように注意) */
          [data-selector="player"] [data-selector="VolumeController"] > div{
            width: 100%;/*スライダの表示判定を広くしてあげる*/
            height: 100%;
          }
          [data-selector="player"] [data-selector="VolumeController"] > div > button{
            position: relative;
            top: 50%;
            transform: translate(0, -50%);
          }
          [data-selector="player"] [data-selector="VolumeController"] [class$="slider-container"]/*スライダ*/{
            padding: 0 10px;/*クリック判定範囲を広くしてあげる*/
            left: 50%;
            transform: translate(-50%, -100%);
          }
          [data-selector="player"] [data-selector="VolumeController"] button > svg{
            vertical-align: bottom;/*アベマのわずかなズレを修正*/
          }
          /* 次のエピソードへの自動移動ボタン */
          [data-selector="nextButton"]{
            display: ${configs.show_next ? 'block' : 'none'};
            width: 0 !important;/*アベマ公式はここの固定幅で表示制御しているが*/
          }
          [data-selector="nextButton"][data-shown="true"]{/*アベマ公式を上書きして表示させる*/
            overflow: visible;
          }
          [data-selector="nextButton"][data-shown="true"] > div{
            transform: translateX(-100%);/*固定幅に依存せずここで表示制御する*/
            opacity: 1;
          }
          [data-selector="nextButtonCount"],
          [data-selector="nextButtonCountPie"]{
            visibility: ${configs.next_countdown ? 'visible' : 'hidden'};
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