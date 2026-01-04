// ==UserScript==
// @name        AbemaTV Shortcut Key Controller
// @namespace   knoa.jp
// @description AbemaTV でショートカットキーによる操作を可能にします。キー割り当てはYouTube準拠。
// @include     https://abema.tv/*
// @version     2.7.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32141/AbemaTV%20Shortcut%20Key%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/32141/AbemaTV%20Shortcut%20Key%20Controller.meta.js
// ==/UserScript==

// console.log('AbemaTV? => hireMe()');
(function(){
  const SCRIPTNAME = 'ShortcutKeyController';
  const DEBUG = false;/*
[update] 2.7.4
コリコリ型のマウスホイールによる音量調整を、端数スタートの場合もきっかり5単位に。

[bug]

[to do]
コメント空欄なら[←]の10秒戻りを有効に

[possible]
Keyboardで音量[U][D]、スクロール文字の透明度[D]?
[Shift+←→]または[,][.]で再生速度?
統合したらインジケータの位置をコメント一覧の幅分ずらすなど
設定(状況に応じたスクリプトの設定)へショートカット...[,][(P)references][(S)ettings]どれもいまひとつ？

[requests]

[not to do]
Edge: ホイール音量調整できない。(MouseEvent未サポート)
ビデオの[F]で全画面は3モードのトグルにしたいが、フルスクリーンからの復帰が1ボタンなので往復にしかできない。
ビデオで[←]による高速巻き戻しは現状Safariでしか効かない上に各ブラウザも対応に消極的。
ビデオで[,][.]でコマ送りはJSからFPSを取得するすべなし(Firefoxのみvideo.seekToNextFrameを実験中)
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const DUMMY = document.createElement('span');
  const LONGPRESS = 1000;/*長押し判定*/
  const FASTPLAYBACKRATE = 16;/*超速再生速度*/
  const EASING = 'cubic-bezier(0,.75,.5,1)';/*主にナビゲーションのアニメーション用*/
  let site = {
    elements: {
      /* 共通 */
      fullscreenButton: function(){let node = $('use[*|href*="mini_screen.svg"]') || $('use[*|href*="_screen.svg"]')/*ビデオのbuttonにaria-labelがないので*/; return node ? node.parentNode.parentNode : DUMMY;},
      volumeSlider: function(){let node = $('button[aria-label^="音声"]'); return node ? node.previousSibling.firstElementChild.firstElementChild.firstElementChild : DUMMY;},
      muteButton: function(){let node = $('button[aria-label^="音声"]'); return node ? node : DUMMY;},
      /* リアルタイム */
      channelButton: function(){let node = $('button[aria-label="放送中の裏番組"]'); return node ? node : DUMMY;},
      timetableButton: function(){let node = $('button[data-selector="TimetableViewerButton"]'); return node ? node : DUMMY;},
      commentButton: function(){let node = $('use[*|href^="/images/icons/comment.svg"]'); return node ? node.parentNode.parentNode : DUMMY;},
      programButton: function(){let node = $('.com-tv-TVFooter__footer-left'); return node ? node : DUMMY;},
      commentTextarea: function(){let node = $('textarea[placeholder="コメントを入力"]'); return node ? node : DUMMY;},
      header: function(){let node = $('body > div > div > header'); return (node) ? node : DUMMY;},
      footer: function (){let tvFooter = $('.com-tv-TVFooter'); return (tvFooter) ? tvFooter.parentNode : DUMMY;},
      closer: function(){
        /* チャンネル切り替えごとに変わる */
        let videoContainer = $('.com-a-Video__container');
        if(!videoContainer) return log(`Not found: videoContainer`);
        let button = videoContainer.parentNode.firstElementChild;/*インスペクタのクリック判定を奪う要素;アベマの構造にすごく依存する*/
        return button ? button : log(`Not found: closer`);
      },
      timetableHeaders: function(){let nodes = $$('#TimetableViewer-timetable-panel .channels > li > header'); return nodes ? nodes : DUMMY;},
      /* 見逃し・ビデオ */
      video: function(){let node = $('video[src]'); return node ? node : DUMMY;},
      timeshiftContainer: function(){let node = $('.c-tv-SlotPlayerContainer'); return node ? node : DUMMY;},
      timeshiftCommentPane: function(){let node = $('.c-tv-SlotPlayerContainer__comment-wrapper'); return node ? node : DUMMY;},
      videoWrapper: function(){let node = $('.c-vod-PlayerContainer-wrapper'); return node ? node : DUMMY;},
      adCover: function(){let node = $('#videoAdContainer iframe'); return node ? node : DUMMY;},
      playButton: function(){let node = $('.com-vod-VideoControlBar__play-handle'); return node ? node : DUMMY;},
      rewindButton: function(){let node = $('.com-vod-VideoControlBar__rewind-10'); return node ? node : DUMMY;},
      advancesButton: function(){let node = $('.com-vod-VideoControlBar__advances-30'); return node ? node : DUMMY;},
      miniScreenInBrowserButton: function(){let node = $('.com-vod-VideoControlBar use[*|href^="/images/icons/mini_screen_in_browser.svg"]'); return node ? node.parentNode.parentNode : DUMMY;},
      nextCloseButton: function(){let node = $('.com-vod-VODScreen-next-program-close-button'); return node ? node : DUMMY;},
      nextEpisode: function(){let node = $('.com-video-NextProgramBlock'); return node ? node : DUMMY;},
    },
    isCommentPaneHidden: function(){
      let form = $('form:not([role="search"])');
      return (form) ? (form.parentNode.parentNode.getAttribute('aria-hidden') === 'true') : false;
    },
    isMuted: function(){
      return (site.elements.muteButton().querySelector('use[*|href^="/images/icons/volume_on.svg"]')) ? false : true;
    },
    wheel: function(e){
      let volume = site.getCurrentVolume(), d = -e.deltaY;
      switch(e.deltaMode){
        case(WheelEvent.DOM_DELTA_PIXEL):/*ヌルヌル*/
          switch(true){
            case(            d < -20): volume += (volume <  10) ? d/40 : d/20; break;/*大幅調整*/
            case(-20 <= d && d <  -5): volume += (volume <  10) ? -.20 : -.40; break;/*微調整*/
            case( -5 <= d && d <  -1): volume += (volume <  10) ? -.10 : -.20; break;/*微調整*/
            case( -1 <= d && d <   0): volume += 0; break;/*微量なら0(そうしないともたつく)*/
            case(  0 <= d && d <  +1): volume += 0; break;/*微量なら0(そうしないともたつく)*/
            case( +1 <= d && d <  +5): volume += (volume <= 10) ? +.10 : +.20; break;/*微調整*/
            case( +5 <= d && d < +20): volume += (volume <= 10) ? +.20 : +.40; break;/*微調整*/
            case(+20 <= d           ): volume += (volume <= 10) ? d/40 : d/20; break;/*大幅調整*/
          }
          break;
        case(WheelEvent.DOM_DELTA_LINE):/*カクカク*/
        default:
          switch(true){
            case(d < 0    ): volume += (volume <= 10) ? -1 : (   - volume%5 || -5); break;
            case(    0 < d): volume += (volume <  10) ? +1 : (+5 - volume%5 || +5); break;
          }
          break;
      }
      site.modifyVolume(volume);
    },
    getCurrentVolume: function(){
      let slider = site.elements.volumeSlider(), rect = slider.getBoundingClientRect();
      if(slider.dataset.volume === undefined){
        return 100 * parseInt(slider.firstElementChild.style.height) / rect.height;
      }else{
        return parseFloat(slider.dataset.volume);
      }
    },
    modifyVolume: function(volume){
      /* 0-100の音量調整に対応する */
      let slider = site.elements.volumeSlider(), rect = slider.getBoundingClientRect();
      volume = between(0, volume, 100);/*0-100に収める*/
      let options = {
        clientX: rect.x + (rect.width/2),
        clientY: rect.y + (rect.height * (1 - volume/100)) + 1/*ゼロの時は確実にゼロにする*/,
        bubbles: true,
      };
      slider.dispatchEvent(new MouseEvent('mousedown'/*clickだと効かない*/, options));
      slider.dispatchEvent(new MouseEvent('mouseup', options));
      slider.dataset.volume = volume;
      core.indicate(document.createTextNode(Math.round(volume)));
    },
    assign: function(e){
      switch(true){
        case(location.href.startsWith('https://abema.tv/now-on-air/')):
          return core.realtime(e);
        case(location.href.startsWith('https://abema.tv/channels/')):
        case(location.href.startsWith('https://abema.tv/video/watch/')):
        case(location.href.startsWith('https://abema.tv/video/episode/')):
          return core.video(e);
      }
    },
  };
  let html, elements = {}, timers = {}, configs = {}, keyPressing;
  let core = {
    initialize: function(){
      html = document.documentElement;
      html.classList.add(SCRIPTNAME);
      window.addEventListener('wheel', site.assign, {capture: true, passive: false});
      window.addEventListener('keydown', site.assign, {capture: true});
      document.addEventListener('fullscreenchange', site.assign, {capture: true});
      core.appendIndicator();
      core.panel.createPanels();
      core.addStyle();
    },
    appendIndicator: function(e){
      elements.indicator = createElement(core.html.indicator());
      document.body.appendChild(elements.indicator);
    },
    indicate: function(node, duration = 1000){
      let indicator = elements.indicator;
      while(indicator.firstChild) indicator.removeChild(indicator.firstChild);
      indicator.appendChild(node);
      indicator.classList.add('active');
      clearTimeout(timers.indicator);
      timers.indicator = setTimeout(function(){
        indicator.classList.remove('active');
      }, duration);
    },
    realtime: function(e){
      switch(true){
        /* 音量 */
        case(e.type === 'wheel' && Math.abs(e.deltaX) <= Math.abs(e.deltaY)/*縦ホイールのみ*/):
          /* あらゆる場所でのイベントを拾ってwindow.addEventListenerで一括処理する代償をここで支払う */
          let parents = [site.elements.closer(), site.elements.header(), site.elements.footer(), ...site.elements.timetableHeaders()];
          for(let target = e.target; target; target = target.parentNode){
            if(parents.includes(target)){
              site.wheel(e);
              return e.preventDefault();
            }
          }
          return;
        /* コメント入力欄フォーカスを外す */
        case(e.key === 'Escape'):
          if(document.activeElement === site.elements.commentTextarea()){
            document.activeElement.blur();
            return e.preventDefault();
          }
          /* Screen Comment Scroller でペインを開いていれば閉じてあげる */
          if(document.documentElement.classList.contains('channel')) document.documentElement.classList.remove('channel');
          if(document.documentElement.classList.contains('program')) document.documentElement.classList.remove('program');
          return;
        /* 以下、テキスト入力中は反応しない */
        case(['input', 'textarea'].includes(document.activeElement.localName)):
          return;
        /* Alt/Shift/Ctrl/Metaキーが押されていたら反応しない */
        case(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey):
          return;
        /* コメント入力欄フォーカス */
        case(e.key === 'k'):
        case(e.key === ' '):
        case(e.key === 'Enter'):
          /* コメント欄が表示されていなければあらかじめ表示しておく */
          if(site.isCommentPaneHidden()) site.elements.commentButton().click();
          site.elements.commentTextarea().focus();
          return e.preventDefault();
        /* コメント */
        case(e.key === 'c'):
          if(site.isCommentPaneHidden()) site.elements.commentButton().click();
          else site.elements.closer().click();
          return e.preventDefault();
        /* 裏番組一覧 */
        case(e.key === 'n'):
          site.elements.channelButton().click();
          return e.preventDefault();
        /* 番組表 */
        case(e.key === 't'):
          site.elements.timetableButton().click();
          return e.preventDefault();
        /* 番組情報 */
        case(e.key === 'i'):
          site.elements.programButton().click();
          return e.preventDefault();
        /* 10秒戻る(20秒かけて追いつく) */
        case(e.key === 'j'):
        case(e.key === 'ArrowLeft'):
          const REWIND = 10, CATCHUP = 1.5;
          let videos = document.querySelectorAll('video[src]'), rewinded = false, duration = 0;
          for(let i = 0, video; video = videos[i]; i++){
            if(video.paused || video.rewinded) continue;
            if(video.currentTime > 1e9) continue;/*currentTimeがunixtimeならmpeg-dashで巻き戻し不可*/
            let rewind = atMost(video.currentTime, REWIND)
            duration = (rewind / (CATCHUP - 1))*1000;
            video.rewinded = rewinded = true;
            video.currentTime = video.currentTime - rewind;
            video.playbackRate = CATCHUP;
            setTimeout(function(){
              video.rewinded = false;
              video.playbackRate = 1;
            }, duration);
          }
          core.indicate(createElement(core.html.rewind(rewinded)), rewinded ? duration : 1000);
          return e.preventDefault();
        /* フルスクリーン */
        case(e.key === 'f'):
          site.elements.fullscreenButton().click();
          return e.preventDefault();
        /* ミュート */
        case(e.key === 'm'):
          site.elements.muteButton().click();
          if(site.isMuted()) core.indicate(document.createTextNode('mute'));
          else site.modifyVolume(site.getCurrentVolume());
          return e.preventDefault();
        /* ヘルプ */
        case(e.key === 'h'):
        case(e.key === '/'):
          core.help.toggle('realtime');
          return e.preventDefault();
      }
    },
    video: function(e){
      switch(true){
        /* 音量 */
        case(e.type === 'wheel' && Math.abs(e.deltaX) <= Math.abs(e.deltaY)/*縦ホイールのみ*/):
          /* あらゆる場所でのイベントを拾ってwindow.addEventListenerで一括処理する代償をここで支払う */
          let parents = [site.elements.timeshiftContainer(), site.elements.videoWrapper(), site.elements.adCover()], timeshiftCommentPane = site.elements.timeshiftCommentPane();
          for(let target = e.target; target; target = target.parentNode){
            if(target === timeshiftCommentPane){
              return;
            }else if(parents.includes(target)){
              site.wheel(e);
              return e.preventDefault();
            }
          }
          return;
        /* 以下、テキスト入力中は反応しない */
        case(['input', 'textarea'].includes(document.activeElement.localName)):
          return;
        /* Alt/Shift/Ctrl/Metaキーが押されていたら反応しない */
        case(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey):
          return;
        /* 再生・停止トグル */
        case(e.key === 'k'):
        case(e.key === ' '):
        case(e.key === 'Enter'):
          site.elements.playButton().click();
          return e.preventDefault();
        /* 10秒戻る */
        case(e.key === 'j'):
        case(e.key === 'ArrowLeft'):
          site.elements.rewindButton().click();
          return e.preventDefault();
        /* 30秒進む(長押しで{FASTPLAYBACKRATE}倍速早送り) */
        case(e.key === 'l'):
        case(e.key === 'ArrowRight'):
          if(keyPressing) return;
          keyPressing = true;
          let longPressing = false;
          let advancesTimer = setTimeout(function(){
            longPressing = true;
            let video = site.elements.video();
            let listener = function(e2){
              if(e2.key !== e.key) return;
              video.playbackRate = 1;
              video.currentTime = video.currentTime;/*これで音声との同期ズレを回避*/
              window.removeEventListener('keyup', listener);
            };
            video.playbackRate = FASTPLAYBACKRATE;
            window.addEventListener('keyup', listener, true);
          }, LONGPRESS);
          let advancesListener = function(e){
            window.removeEventListener('keyup', advancesListener, true);
            clearTimeout(advancesTimer);
            keyPressing = false;
            if(longPressing) longPressing = false;
            else site.elements.advancesButton().click();
          };
          window.addEventListener('keyup', advancesListener, true);
          return e.preventDefault();
        /* 次のエピソードへの移動ボタンを閉じる */
        case(e.key === 'Escape'):
        case(e.key === 'x'):
          let nextCloseButton = site.elements.nextCloseButton();
          if(nextCloseButton.isConnected){
            nextCloseButton.click();
            e.stopPropagation();
          }else if(e.key === 'Escape'){/*移動ボタンがないときのみ、ブラウザ全画面を解除*/
            site.elements.miniScreenInBrowserButton().click();
          }
          return e.preventDefault();
        /* 次のエピソードに移動する */
        case(e.key === 'n'):
          site.elements.nextEpisode().click();
          return e.preventDefault();
        /* フルスクリーン */
        case(e.key === 'f'):
          site.elements.fullscreenButton().click();
          return e.preventDefault();
        /* ミュート */
        case(e.key === 'm'):
          site.elements.muteButton().click();
          if(site.isMuted()) core.indicate(document.createTextNode('mute'));
          else site.modifyVolume(site.getCurrentVolume());
          return e.preventDefault();
        /* ヘルプ */
        case(e.key === 'h'):
        case(e.key === '/'):
          core.help.toggle('video');
          return e.preventDefault();
        /* フルスクリーン要素対応 */
        case(e.type === 'fullscreenchange'):
          if(document.fullscreenElement){/*フルスクリーンなら*/
            document.fullscreenElement.appendChild(elements.indicator);
            document.fullscreenElement.appendChild(elements.panels);
          }else{
            document.body.appendChild(elements.indicator);
            document.body.appendChild(elements.panels);
          }
          return;
      }
    },
    help: {
      open: function(type){
        core.panel.open(elements.helpPanel || core.help.createPanel(type));
      },
      close: function(){
        core.panel.close(elements.helpPanel);
      },
      toggle: function(type){
        core.panel.toggle(elements.helpPanel || core.help.createPanel(type), core.help.open.bind(null, type), core.help.close);
      },
      createPanel: function(type){
        let helpPanel = elements.helpPanel = createElement(core.html.helpPanel(type));
        helpPanel.querySelector('button.ok').addEventListener('click', core.help.close);
        helpPanel.keyAssigns = {
          'Escape': core.help.close,
        };
        return helpPanel;
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
      indicator: () => `
        <div id="${SCRIPTNAME}-indicator"></div>
      `,
      rewind: (rewinded) => `
        <svg id="rewind" ${rewinded ? 'class ="rewinded"' : ''} height="25" width="25"><use xlink:href="/images/icons/rewind_10.svg?v=v18.1219.0#svg-body"></use></svg>
      `,
      helpPanel: (type) => `
        <div class="${SCRIPTNAME} panel" id="${SCRIPTNAME}-helpPanel" data-name="helpPanel" data-order="1">
          <h1>${SCRIPTNAME} ヘルプ</h1>
          <h2>共通:</h2>
          <dl>
            <dt><kbd>[H]</kbd><kbd>[/]</kbd></dt><dd>ヘルプ表示 ([H]elp)</dd>
            <dt><kbd>[F]</kbd></dt><dd>フルスクリーン ([F]ullscreen)</dd>
            <dt><kbd>[M]</kbd></dt><dd>ミュート ([M]ute)</dd>
            <dt><kbd>マウスホイール</kbd></dt><dd>音量調整</dd>
          </dl>
          <h2${(type === 'realtime') ? '' : ' class="disabled"'}>リアルタイム放送中:</h2>
          <dl>
            <dt><kbd>[K]</kbd><kbd>[ ]</kbd><kbd>[⏎]</kbd></dt><dd>コメント入力欄フォーカス</dd>
            <dt><kbd>[Esc]</kbd></dt><dd>コメント入力欄フォーカスを外す</dd>
            <dt><kbd>[C]</kbd></dt><dd>コメント表示 ([C]omment)</dd>
            <dt><kbd>[N]</kbd></dt><dd>裏番組一覧 ([N]ow on air)</dd>
            <dt${(html.classList.contains('TimetableViewer')) ? '' : ' class="disabled"'}><kbd>[T]</kbd></dt><dd>番組表 ([T]imetable)</dd>
            <dt><kbd>[I]</kbd></dt><dd>番組情報 ([I]nformation)</dd>
            <dt><kbd>[J]</kbd><kbd>[←]</kbd></dt><dd>10秒戻る(20秒かけて追いつく)<sup>※</sup></dd>
            <dd class="note">※現在のところ、SPECIAL, GOLD, ドラマ, アニメ, みんなのアニメ の各系列チャンネルでは効きません。</dd>
          </dl>
          <h2${(type === 'video') ? '' : ' class="disabled"'}>ビデオ再生中:</h2>
          <dl>
            <dt><kbd>[K]</kbd><kbd>[ ]</kbd><kbd>[⏎]</kbd></dt><dd>再生・停止</dd>
            <dt><kbd>[J]</kbd><kbd>[←]</kbd></dt><dd>10秒戻る</dd>
            <dt><kbd>[L]</kbd><kbd>[→]</kbd></dt><dd>30秒進む(長押しで高速早送り)</dd>
            <dt><kbd>[Esc]</kbd><kbd>[X]</kbd></dt><dd>「次のエピソード」ボタンを閉じる<sup>※</sup></dd>
            <dd class="note">※[Esc]はフルスクリーン解除が優先されます。</dd>
            <dt><kbd>[N]</kbd></dt><dd>次のエピソードに移動する ([N]ext)</dd>
          </dl>
          <p class="buttons"><button class="ok primary">OK</button></p>
        </div>
      `,
      panels: () => `
        <div class="panels" id="${SCRIPTNAME}-panels"></div>
      `,
      style: () => `
        <style type="text/css">
          /* panel_zIndex:           ${configs.panel_zIndex           = 101} */
          /* nav_transition:         ${configs.nav_transition         = `250ms ${EASING}`} */
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
          #${SCRIPTNAME}-panels ul,
          #${SCRIPTNAME}-panels ol,
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
          /* ヘルプパネル */
          #${SCRIPTNAME}-helpPanel{
            width: 400px;
          }
          #${SCRIPTNAME}-helpPanel dl{
            display: flex;
            flex-wrap: wrap;
          }
          #${SCRIPTNAME}-helpPanel dl dt{
            width: 120px;
            margin: 2px 0;
            background: rgba(0,0,0,.5);
            border-radius: 5px;
          }
          #${SCRIPTNAME}-helpPanel dl dt kbd{
            margin-left: 5px;
          }
          #${SCRIPTNAME}-helpPanel dl dd{
            width: 250px;
            margin: 2px 0 2px 10px;
          }
          #${SCRIPTNAME}-helpPanel dl dd.note{
            color: gray;
            font-size: 75%;
            width: 100%;
          }
          #${SCRIPTNAME}-helpPanel dt.disabled,
          #${SCRIPTNAME}-helpPanel dt.disabled + dd,
          #${SCRIPTNAME}-helpPanel dt.disabled + dd + dd,
          #${SCRIPTNAME}-helpPanel h2.disabled,
          #${SCRIPTNAME}-helpPanel h2.disabled + dl{
            opacity: .5;
          }
          #${SCRIPTNAME}-helpPanel dt.hidden{
            display: none;
          }
          /* インジケータ */
          #${SCRIPTNAME}-indicator{
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 25vh;
            color: rgba( 81,195, 0,1);
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));
            opacity: 0;
            z-index: ${configs.panel_zIndex};
            pointer-events: none;
            transition: opacity 250ms;
          }
          #${SCRIPTNAME}-indicator.active{
            opacity: .75;
          }
          #${SCRIPTNAME}-indicator #rewind{
            fill: rgba(195,195,195,.5);
            width: 25vh;
            height: 25vh;
          }
          #${SCRIPTNAME}-indicator #rewind.rewinded{
            fill: rgba( 81,195, 0,1);
          }
          #${SCRIPTNAME}-indicator.active #rewind{
            animation: ${SCRIPTNAME}-blink 2s step-end infinite;
          }
          @keyframes ${SCRIPTNAME}-blink{
            50%{opacity: 0}
          }
          /* ビデオCM */
          #videoAdContainer iframe{
            pointer-events: none;
          }
          #videoAdContainer iframe *{
            pointer-events: auto;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, requestAnimationFrame = window.requestAnimationFrame;
  const getComputedStyle = window.getComputedStyle, fetch = window.fetch;
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  const $ = function(s){return document.querySelector(s)};
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
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
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();
