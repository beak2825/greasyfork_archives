// ==UserScript==
// @name        SHOWROOM ちょこっとツール
// @namespace   knoa.jp
// @description SHOWROOM をちょこっとだけ使いやすくします。
// @include     https://www.showroom-live.com/*
// @exclude     https://www.showroom-live.com/avatar_shop*
// @exclude     https://www.showroom-live.com/event*
// @exclude     https://www.showroom-live.com/follow*
// @exclude     https://www.showroom-live.com/mypage*
// @exclude     https://www.showroom-live.com/mypage*
// @exclude     https://www.showroom-live.com/notice*
// @exclude     https://www.showroom-live.com/onlive*
// @exclude     https://www.showroom-live.com/payment*
// @exclude     https://www.showroom-live.com/ranking*
// @exclude     https://www.showroom-live.com/room/*
// @exclude     https://www.showroom-live.com/user/*
// @exclude     https://www.showroom-live.com/user_notice/*
// @exclude     https://www.showroom-live.com/inquiry/
// @exclude     https://www.showroom-live.com/opinion/new
// @exclude     https://www.showroom-live.com/organizer_registration/
// @exclude     https://www.showroom-live.com/s/*
// @version     0.4.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/393234/SHOWROOM%20%E3%81%A1%E3%82%87%E3%81%93%E3%81%A3%E3%81%A8%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/393234/SHOWROOM%20%E3%81%A1%E3%82%87%E3%81%93%E3%81%A3%E3%81%A8%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'ShowroomChocottoTool';
  const SCRIPTNAME = 'SHOWROOM ちょこっとツール';
  const DEBUG = false;/*
[update]
NGワードリストの更新。

[bug]
変則タイテのために日付付きでも指定したいかも
スリープ復帰リロード効かなかったな
星捨て時刻1分過ぎが許されなかった？

[to do]
ついったとYouTubeのリンクをアイコン化してヘッダに設置したい
  ほか、ついでにすこすこで肥大化して崩れがちなレイアウトも含めてヘッダを調整
上下で音量は文字入力してても効かせたい
すこすこのフルスクリーンがいまいちだけどやっぱり大画面で見たい
ランキングで自分をハイライトかな
イベント終了後にイベントへの導線がなくなるのはクソなので、リンクを残すような仕組み
コメントとギフトはパネルを常時表示するなら下部のボタンも表示させとくべきだな
投票モード中の document.querySelector('#room-gift-item-list > li:nth-child(-n + 5) .gift-free-num-label').textContent の扱いを確認
スクロール時に新着コメントの表示を待機させる機能とスクロールバーの慌ただしさのトレードオフ関係を解消したい
コメントログ li[data-restarted] を活用した暫定的な配信枠の区切りを恒常化させる？
  jsInitialDataあたりに配信「枠」のidとかないかな？
配信画面右上の各ボタンのクリック領域を広げる。
ほぼ自分用かもだけどマウスオーバーで発言時刻
自分が別デバイスで打ったコメントも見れるように
拡張化しないと普及はしない...

[possible]
イベントページへのリンクはイベント終了後もしばらく保持してほしいよなぁ
Googleカレンダ連携ｗ
ボリュームブーストは望まれる予感！！！
設定いる？
絵文字の警告する？公式に入力可能にしてほしいよなぁ。
ゴールド不足を事前に計算してあげる？
ユーザーごとに自分用ニックネーム付与 ←言うほどほしいか？
  配信者も呼び方をメモしたい需要はあるだろう。←配信社支援ツールの道
つや姫、ミルキークイーンなどを目立たせて把握したい
「0」コメで自動カウント開始してもよいが、それやるなら星の全投げもサポートすべきなのか
  すこすこツール前提なら不要。
自分用NGワード/ユーザーでコメントを弾きたい需要があるらしい
聞き逃し10秒戻しやる？左右キーも音量に割り当ててるから保留。

[research]
1000-1万件になるとリストのrelative要素がCPUを消費する
録画録音機能・・・？拡張ならいけるの？
配信中に再読み込みしたら自分を含むギフトが別のギフトに変わる現象を確認。
  SRサーバーが違うデータを送ってきただけ？
  ログもそのぶんだけ増えたのでこちらサイドの問題ではなさそう。

[memo]
コメントログは読み込みごとに微妙に順番が前後することがある
読み込み直後にコメントログに1件だけ一瞬現れて消えてしまうバグは報告済み
パネルの左端配置を忘れてしまうバグは報告済み => 2019/12/18解消を確認
#gift-areaの上部に邪魔な透明要素があるのは報告済み => 2020/7/14解消を確認

SHOWROOM API
https://qiita.com/takeru7584/items/f4ba4c31551204279ed2
SHOWROOM WebSocket
https://seesaawiki.jp/shokoro/d/%c4%cc%bf%ae%ca%fd%cb%a1
  */
  if(window === top && console.time) console.time(SCRIPTID);
  const MS = 1, SECOND = 1000*MS, MINUTE = 60*SECOND, HOUR = 60*MINUTE, DAY = 24*HOUR, WEEK = 7*DAY, MONTH = 30*DAY, YEAR = 365*DAY;
  const RETRY = 10;
  const LOGLIMIT = 100;/*公式のログ制限量*/
  const RECOVERYLIMIT = 1*DAY;/*保管コメントを破棄する期限*/
  const LONGPRESS = 1*SECOND;/*ギフト自動連投長押し時間*/
  const INTERVAL = 25;/*ギフト連投間隔*/
  const COMBO = 10;/*ギフト連投クリック回数*/
  const WEBSOCKET = 'wss://online.showroom-live.com/';/*WebSocket URL*/
  const AVATARPREFIX = 'https://image.showroom-cdn.com/showroom-prod/image/avatar/';/*アバターURLのPREFIX*/
  const GIFTPREFIX = 'https://image.showroom-cdn.com/showroom-prod/assets/img/gift/';/*ギフトURLのPREFIX*/
  const NGWORDS = [
    /* 卑猥, 暴力, 侮辱, 個人情報 */
    /* ニックネームとして使えるかどうかで判定しているので、コメントのNG判定と乖離している可能性もある */
    // 参考: ニコニコNGワード
    // https://dic.nicovideo.jp/a/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E7%94%9F%E6%94%BE%E9%80%81%3A%E9%81%8B%E5%96%B6ng%E3%83%AF%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7
    /*あ*/ /喘いで|あえいで/, /あなる|アナル/, /いくぅ/, /淫乱/, /うんこ|ウンコ/, /うんち/, /駅弁/, /エッチ/, /犯し/, /おしっこ/, /お尻/, /おっぱい/, /おなに|オナニー/, /汚物|オブツ/, /おめこ|オメコ/,
    /*か*/ /きちがい|キチガイ|気違い|基地外/, /きもい|きめえ/, /クソ|糞/, /クンニ/, /けばい|ケバい/, /コカイン/, /乞食/, /殺[さしすせそ]?/, /ころ[しすせ]/,
    /*さ*/ /自慰/, /しこしこ|しこって/, /支那/, /しね|死[なぬねのん]/, /射精|写生/, /処女/, /シンナー/, /整形/, /性行為/, /精子|静止/, /聖水/, /せっくす|セックス/, /創価/, /ソープ/,
    /*た*/ /谷間|たにま/, /乳首|ちくび/, /チョン/, /ちんこ|チンコ/, /ちんちん|チンチン/, /ちんぽ|チンポ/, /潰[しすせそ]/, /つまらない|つまんね/, /でぶ|デブ/, /手ブラ/, /電話番号/, /どうてい|どーてー|童貞/, /土人/,
    /*な*/ /中出し/, /(何|なに)カップ/, /肉棒/, /脱げ|脱いで|ぬいで/,
    /*は*/ /パイパン/, /バイブ/, /馬鹿/, /ばばあ/, /ぱんつ|パンツ/, /パンティ/, /ビッチ/, /ファック/, /フェラ|ふぇら/, /ぶす|ブス/, /ブタ/, /下手/, /ヘルス/, /変態/,
    /*ま*/ /まんこ|マンコ/,
    /*や*/ /やりまん|ヤリマン/,
    /*ら*/ /乱交|らんこう/, /ローター/,
    /* ニックネームではダメでもコメント欄では大文字なら許されることが多い */
    /baka/, /bba/i, /bitch/, /boring/i, /butt/, /docomo/i, /fuck/, /niga/i, /sex/i, /shine/i, /shit/i, /softbank/i, /suck/i,
  ];
  let site = {
    targets: {
      header: () => $('#room-header'),
      volume: () => $('#js-room-volume'),/*音量アイコン(ミュートボタン)*/
      videoVolume: () => $('#room-video-volume'),/*音量スライダパネル*/
      videoVolumeVal: () => $('#video-volume-val'),/*音量スライダ*/
      video: () => $('#js-video'),
      commentWrapper: () => $('#js-room-comment-wrapper'),
      inputComment: () => $('#js-chat-input-comment'),
      commentLog: () => $('#comment-log'),
      commentLogList: () => $('#room-comment-log-list'),
      giftLog: () => $('#gift-log'),
      giftLogList: () => $('#gift-log-list'),
      giftingComboCounter: () => $('#gifting-combo-counter'),/*ギフト連投カウンター*/
      roomGiftItemList: () => $('#room-gift-item-list'),/*贈るギフトリスト*/
      autoTransision: () => $('#js-onlivelist-auto-transision'),/*カウントダウン*/
      onlivelistButton: () => $('#js-onlivelist-btn'),/*オンライブつまみ*/
      iconRoomCommentlog: () => $('#icon-room-commentlog'),/*フッタボタン*/
      iconRoomGiftlog: () => $('#icon-room-giftlog'),/*フッタボタン*/
      draggables: () => $$('.ui-draggable'),/*パネル*/
      jsInitialData: () => $('#js-initial-data'),/*JSON*/
    },
    get: {
      roomId: () => {
        let match = location.pathname.match(/^\/([a-z0-9-_]+)/i);
        return match ? match[1] : undefined;
      },
      myUserName: () => {
        let data = JSON.parse(elements.jsInitialData.dataset.json);
        return (data && data.screenId) ? data.screenId : '';
      },
      commentData: (node) => {
        let avatar  = node.querySelector('.comment-log-avatar img');
        let name    = node.querySelector('.comment-log-name');
        let comment = node.querySelector('.comment-log-comment');
        return {
          avatar:  avatar  ? avatar.src.replace(AVATARPREFIX, '') : '',
          name:    name    ? name.innerHTML : '',
          comment: comment ? comment.textContent : '',
        };
      },
      giftData: (node) => {
        let avatar  = node.querySelector('.gift-avatar img');
        let name    = node.querySelector('.gift-user-name');
        let image   = node.querySelector('.gift-image img');
        let num     = node.querySelector('.gift-num .num');
        return {
          avatar: avatar ? avatar.src.replace(AVATARPREFIX, '') : '',
          name:   name   ? name.innerHTML : '',
          image:  image  ? image.src.replace(GIFTPREFIX, '') : '',
          num:    num    ? num.textContent : '',
        };
      },
      giftListItem: (img) => {
        for(let target = img.parentNode; target; target = target.parentNode){
          if(target.classList.contains('room-gift-item')) return target;
        }
        return img;/*エラー回避*/
      },
      /* すこすこツール */
      sukoCommentInput: () => $('#con_comm_input'),
    },
    is: {
      onLive: () => $('video[src]', v => v.paused === false),
      giftImage: (target) => target.classList.contains('gift-image'),
      onAutoTransition: (autoTransision) => (autoTransision.textContent !== ''),
    },
  };
  let elements = {}, timers = {}, sizes = {}, flags = {};
  let roomId, myUserName;
  let logStorage = {};/*
    'room-id': {
      lastUpdate: 1234567890,
      comments: [
        {avatar: 'src', name: 'name', comment: 'comment'},
      ],
      gifts: [
        {avatar: 'src', name: 'name', image: 'src', num: '1'},
      ],
    }
  */
  let positions = {};/* id: [(left/right), (px)], */
  const core = {
    initialize: function(){
      elements.html = document.documentElement;
      elements.html.classList.add(SCRIPTID);
      //core.listenWebSockets();
      core.ready();
      core.addStyle();
      core.tame();
    },
    ready: function(){
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready.");
        roomId = site.get.roomId();
        myUserName = site.get.myUserName();
        core.setupLogStorage();
        [
          {
            type: 'comments',
            panel: elements.commentLog,
            list: elements.commentLogList,
            extractData: site.get.commentData,
            icon: elements.iconRoomCommentlog,
            html: html.comment,
          }, {
            type: 'gifts',
            panel: elements.giftLog,
            list: elements.giftLogList,
            extractData: site.get.giftData,
            icon: elements.iconRoomGiftlog,
            html: html.gift,
          },
        ].forEach(logger => {
          core.observeLogs(logger);
          core.appendClearButton(logger);
          core.keepLogsShown(logger);
        });
        core.widenClickable();
        core.arrowToVolume();
        core.longpressToComboClicks();
        core.focusToCommentInput();
        core.notifyNgWords();
        core.stickDraggablesToEdge();
        core.observeStreamingEnd();
        core.debug.ready();
      }).catch(e => {
        console.error(`${SCRIPTID}:${e.lineNumber} ${e.name}: ${e.message}`);
      });
    },
    listenWebSockets: function(){
      /* 公式の通信内容を取得 */
      window.WebSocket = new Proxy(WebSocket, {
        construct(target, arguments){
          const ws = new target(...arguments);
          log(ws, arguments);
          if(ws.url.includes(WEBSOCKET)) ws.addEventListener('message', function(e){
            let data = e.data.split('\t'), type = data[0], json;
            switch(type){
              case('MSG'):
                json = JSON.parse(data[2]);
                switch(parseInt(json.t)){/*型が定まってない件*/
                  case(1):/*コメント*/
                    //時刻とユーザーidを付与
                    //log(json);
                    break;
                  case(2):/*ギフト*/
                    break;
                  case(5):/*部屋ポイント*/
                    break;
                  case(8):/*テロップ*/
                    break;
                  default:/*ほかにもいろいろある*/
                    log('Unknown code:', json.t, json);
                    break;
                }
                break;
              case('ACK'):
                break;
              default:
                //log('Unknown type:', type, data);
                break;
            }
          });
          return ws;
        }
      });
    },
    setupLogStorage: function(){
      let now = Date.now();
      logStorage = Storage.read('logStorage') || {};
      Object.keys(logStorage).forEach(id => {
        if(logStorage[id].lastUpdate < now - RECOVERYLIMIT) delete logStorage[id];
      });
      if(logStorage[roomId] === undefined){
        logStorage[roomId] = {
          lastUpdate: now,
          comments: [],
          gifts: [],
        };
      }
      Storage.save('logStorage', logStorage);
      window.addEventListener('unload', function(e){
        logStorage[roomId].lastUpdate = Date.now();
        Storage.save('logStorage', logStorage);
        log('Saved:', logStorage);
      });
    },
    observeLogs: function(logger){
      /* 新着とあふれ出てしまうログを扱っていく */
      /* 新着1件目, 平常新着, 101件目削除, 配信再開新着, スクロール時の新着表示 が想定シナリオ */
      /* 2件同時の時は records[0] が先に挿入されてから records[1] が次に挿入されて最上位となる。 */
      core.observeLogs.observers = {};
      core.observeLogs.observe = function(logger){
        core.observeLogs.observers[logger.type] = observe(logger.list, function(records){
          let isAddedOnTop = (records.find(r => r.addedNodes[0] === logger.list.firstElementChild) !== undefined);
          records.forEach(record => {
            record.addedNodes.forEach(node => {/*新着*/
              if(node.dataset.removed === 'true') return;/*無限ループ回避*/
              scroll(logger.list, node);/*なめらかスクロール*/
              if(isAddedOnTop === true){/*新着1件目, 平常新着*/
                //log(logger.type, logger.list.children.length);
                let data = logger.extractData(node);
                core.markMyItem(data, node);
                core.feedLogStorage(logger.type, data);
              }else{/*配信再開新着*/
                /* 開きっぱなしのページからの配信再開などでコメントが最後尾に追加されてしまったら最初に挿入し直す */
                node.dataset.restarted = 'true';
                logger.list.insertBefore(node, logger.list.firstElementChild);
              }
            });
            record.removedNodes.forEach(node => {/*消されたログ*/
              if(node.dataset.restarted === 'true') return;/*無限ループ回避*/
              node.dataset.removed = 'true';
              logger.list.insertBefore(node, logger.list.children[LOGLIMIT] || null);/*101件目削除*/
            });
          });
        }, {childList: true});
      };
      core.observeLogs.disconnect = function(logger){
        core.observeLogs.observers[logger.type].disconnect();
      };
      /* 公式バグがあるので内容が安定するのを待つ */
      setTimeout(function(){
        core.restoreLog(logger);
        core.observeLogs.observe(logger);
      }, 2500);/*けっこう不安定なので余裕を持つ*/
      /* なめらかスクロール */
      let wrapper = createElement(html.scrollWrapper());
      logger.list.parentNode.insertBefore(wrapper, logger.list);
      wrapper.appendChild(logger.list);
      const DURATION = '125ms';/*スクロール時間*/
      let scroll = function(list, node){
        let rect = node.getBoundingClientRect();
        let translateY = match(getComputedStyle(list).transform, /\-?[0-9.]+/g, m => parseFloat(m[5])) || 0;/*この瞬間の位置*/
        //log(rect.height, translateY, `translateY(${- rect.height + translateY}px)`);
        list.style.transition = `none`;
        list.style.transform = `translateY(${- rect.height + translateY}px)`;
        animate(() => {
          list.style.transition = `${DURATION} ease-out`;
          list.style.transform = `translateY(0px)`;
          list.addEventListener('transitionend', (e) => {
            list.style.transition = `none`;
          }, {once: true})
        });
      };
    },
    appendClearButton: function(logger){
      let title = logger.panel.querySelector('.title');
      let button = createElement(html.clearButton());
      button.addEventListener('click', function(e){
        if(confirm('ログをクリアしますか？')){
          core.observeLogs.disconnect(logger);
          /* 全部消すと新着の挿入アンカーを失ってしまうので、ひとつだけ残す */
          while(logger.list.children[1]) logger.list.removeChild(logger.list.children[1]);
          logger.list.children[0].style.display = 'none';
          core.observeLogs.observe(logger);
          logStorage[roomId].lastUpdate = Date.now();
          logStorage[roomId][logger.type] = [];
          Storage.save('logStorage', logStorage);
          log(logStorage[roomId]);
        }
      });
      title.appendChild(button);
    },
    restoreLog: function(logger){
      /* 読み込みごとに順番が前後することがあるので重複判定などに注意する */
      let listedItems = logger.list.children, listedCount = listedItems.length;
      let storagedData = logStorage[roomId][logger.type], lastIndex = storagedData.length - 1, limitIndex = storagedData.length - LOGLIMIT;
      storagedData.forEach(data => data.toRestore = true);
      /* 新着アイテムを古い順に確認して時系列を維持しながらストレージに保存 */
      Array.from(listedItems).reverse().forEach(node => {
        let data = logger.extractData(node);
        core.markMyItem(data, node);
        /* ストレージを新しい順に一致するか確認して新着とみなせればストレージ保存 */
        for(let i = lastIndex; storagedData[i]; i--){
          if(i < limitIndex) break;/*これ以上過去にさかのぼっても一致コメントが見つかる見込みはない*/
          if(Object.keys(data).every(key => data[key] === storagedData[i][key])) return storagedData[i].toRestore = false;/*すでに保存済み*/
        }
        core.feedLogStorage(logger.type, data);/*新着コメントとみなせるのでストレージ保存*/
        storagedData[storagedData.length - 1].toRestore = false;
      });
      /* 過去ログを回復 */
      for(let i = storagedData.length - 1; storagedData[i]; i--){
        if(storagedData[i].toRestore === false) continue;
        let li = createElement(logger.html(storagedData[i]));
        core.markMyItem(storagedData[i], li);
        logger.list.append(li);
      }
      log(logger.type, 'log restored:', listedCount, '=>', listedItems.length);
    },
    markMyItem: function(data, node){
      if(data.name === myUserName) node.dataset.me = 'true';
    },
    feedLogStorage: function(type, data){
      logStorage[roomId][type].push(data);
    },
    keepLogsShown: function(logger){
      /* 常に表示 */
      logger.panel.style.display = 'block';
      /* コメントとギフト、パネルとボタンの仕様がちぐはぐで、この組み合わせでしか機能しない */
      observe(logger.panel, function(records){
        if(logger.panel.style.display === 'block') return;/*表示は歓迎*/
        if(logger.icon.clientHeight === 0) logger.panel.style.display = 'block';/*配信終了後の非表示は許さない*/
      }, {attributes: true});
    },
    widenClickable: function(){},
    arrowToVolume: function(){
      const STEP = 10;
      let header = elements.header, volume = elements.volume, videoVolume = elements.videoVolume, videoVolumeVal = elements.videoVolumeVal;
      let inputComment = elements.inputComment, video = elements.video;
      window.addEventListener('keydown', function(e){
        //log(e);
        if(['textarea', 'input'].includes(e.target.localName)){
          if(e.target.value !== '') return;
          if(e.isComposing === true) return;
        }
        if(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        if(['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight'].includes(e.key) === false) return;
        header.style.zIndex = '101';
        videoVolume.style.display = 'block';
        clearTimeout(timers.showVolume), timers.showVolume = setTimeout(() => {
          header.style.zIndex = '';
          videoVolume.style.display = 'none';
        }, 1000*MS);
        let currentValue = parseInt(videoVolumeVal.value);
        switch(e.key){
          case('ArrowDown'):
          case('ArrowLeft'):
            /* ミュート化 */
            if(currentValue <= STEP && !video.muted) volume.click();
            /* ミュート解除 */
            else if(STEP < currentValue && video.muted) volume.click();
            videoVolumeVal.value = currentValue - STEP;
            video.volume = between(0, (currentValue - STEP)/100, 1);
            break;
          case('ArrowUp'):
          case('ArrowRight'):
            if(video.muted) volume.click();
            videoVolumeVal.value = currentValue + STEP;
            video.volume = between(0, (currentValue + STEP)/100, 1);
            break;
        }
        e.preventDefault();
      });
    },
    longpressToComboClicks: function(){
      let roomGiftItemList = elements.roomGiftItemList, giftingComboCounter = elements.giftingComboCounter;
      let timer, longpress = false;
      let clear = function(e){
        clearTimeout(timer);
        delete(site.get.giftListItem(e.target).dataset.mousedown);
      };
      let getCombo = function(target){
        let count = (giftingComboCounter.clientHeight) ? parseInt(giftingComboCounter.textContent) : 0;
        let timer = setInterval(function(e){
          if(count >= COMBO) return clearInterval(timer);
          target.click();
          count++;
        }, INTERVAL);
        longpress = true;
      };
      roomGiftItemList.addEventListener('mousedown', function(e){
        if(site.is.giftImage(e.target) !== true) return;
        if(e.buttons !== 1) return;/*プライマリボタンのみ*/
        timer = setTimeout(getCombo.bind(null, e.target), LONGPRESS);
        longpress = false;
        site.get.giftListItem(e.target).dataset.mousedown = 'true';
        roomGiftItemList.addEventListener('mouseout', clear, {once: true});
        roomGiftItemList.addEventListener('mouseup', clear, {once: true});
      });
      roomGiftItemList.addEventListener('click', function(e){
        if(e.isTrusted === false) return;/*人間クリックのみ扱う*/
        if(longpress === false) return;/*ロングプレスのみ扱う*/
        clear(e);
        e.stopPropagation();/*ロングプレス後にデフォルトのクリックを発生させない*/
      }, {capture: true});
    },
    focusToCommentInput: function(){
      let commentWrapper = elements.commentWrapper, input = elements.inputComment;
      /* デフォルトのフォーカス対象 */
      let target = input;
      input.focus();
      /* フォーカス対象の切り替え */
      input.addEventListener('focus', function(e){
        if(target !== input) target = input;
      });
      core.getTarget(site.get.sukoCommentInput).then(input => {
        input.addEventListener('focus', function(e){
          if(target !== input) target = input;
        });
      });
      /* フォーカス時の処理 */
      window.addEventListener('focus', function(e){
        if(target && target.isConnected) target.focus();
      });
      /* 配信開始のタイミングを監視する */
      observe(commentWrapper, function(records){
        if(commentWrapper.style.display === 'none') return;
        if(/display: ?none;/.test(records[0].oldValue)) target.focus();
      }, {attributes: true, attributeFilter: ['style'], attributeOldValue: true});
    },
    notifyNgWords: function(){
      let input = elements.inputComment, lastValue = '';
      /* 内容監視 */
      let setup = function(input){
        let ngWords = createElement(html.ngWords());
        input.parentNode.insertBefore(ngWords, input.nextElementSibling);
        input.addEventListener('keyup', function(e){
          if(lastValue === input.value) return;/*変化なし*/
          if(e.isComposing) return;/*変換中*/
          lastValue = input.value;
          let hits = [];
          for(let i = 0; NGWORDS[i]; i++){
            let m = input.value.replace(/ /g, '').match(NGWORDS[i]);/*空白を除いた状態で判定される*/
            if(m === null) continue;
            else hits.push(m[0]);
          }
          if(hits.length){
            hits.sort((a, b) => input.value.indexOf(a) - input.value.indexOf(b));
            ngWords.textContent = hits.join(' ');
            if(input.classList.contains('ngWords')) return;
            else input.classList.add('ngWords');
          }else{
            input.classList.remove('ngWords');
          }
        });
        /* 送信確認 */
        window.addEventListener('keydown', function(e){
          if(e.target !== input) return;/*コメント入力欄のみ*/
          if(e.key !== 'Enter') return;/*Enterキーのみ*/
          if(e.isComposing) return;/*変換確定*/
          if(input.classList.contains('ngWords')){
            if(confirm('NGワードと思われる言葉を含みますが送信しますか？')){
              /*confirmのせいでkeyupが発生しないので*/
              input.classList.remove('ngWords');
              ngWords.textContent = '';
              return;
            }
            else e.stopPropagation();
          }
        }, true);
      };
      /* 公式入力欄 */
      setup(input);
      /* すこすこツール入力欄 */
      core.getTarget(site.get.sukoCommentInput).then(input => {
        setup(input);
      });
    },
    stickDraggablesToEdge: function(){
      /* 右側に配置したパネルは左辺ではなく右辺に対する位置を記憶してほしい */
      /* 左右辺からの端までの距離だとすこすこツールの可変長コメント入力欄で崩れるので、左右辺からの左端の位置を記憶する */
      positions = Storage.read('positions') || {};
      let draggables = elements.draggables, throttles = {}, innerWidth = window.innerWidth;
      let replace = function(draggable){
        //log('Replace:', draggable.id, positions[draggable.id]);
        if(positions[draggable.id] === undefined) return;
        /* positions[draggable.id] = [(left/right), (px)] */
        switch(positions[draggable.id][0]){
          case('left'):/*左辺に近い*/
            positions[draggable.id][1] = between(0, positions[draggable.id][1], innerWidth/2);
            draggable.style.left = positions[draggable.id][1] + 'px';
            draggable.style.right = 'auto';/*デフォルト絶対値があるので上書き*/
            break;
          case('right'):/*右辺に近い*/
            positions[draggable.id][1] = between(0, positions[draggable.id][1], innerWidth);
            draggable.style.left = (innerWidth - positions[draggable.id][1]) + 'px';
            draggable.style.right = 'auto';/*デフォルト絶対値があるので上書き*/
            break;
          default:/*旧仕様*/
            if(positions[draggable.id][0] < positions[draggable.id][1]){
              positions[draggable.id][0] = between(0, positions[draggable.id][0], innerWidth/2);
              draggable.style.left = positions[draggable.id][0] + 'px';
              draggable.style.right = 'auto';/*デフォルト絶対値があるので上書き*/
            }else{
              positions[draggable.id][1] = between(0, positions[draggable.id][1], innerWidth/2);
              draggable.style.right = positions[draggable.id][1] + 'px';
              draggable.style.left = 'auto';/*デフォルト絶対値があるので上書き*/
            }
            break;
        }
      };
      Array.from(draggables).forEach(draggable => {
        /* 独自保存値を再現 */
        replace(draggable);
        /* 位置の変更を保存 */
        throttles[draggable.id] = 0;
        observe(draggable, function(records){
          if(draggable.classList.contains('ui-draggable-dragging')) return;
          if(draggable.classList.contains('ui-resizable-resizing')) return;
          clearTimeout(throttles[draggable.id]), throttles[draggable.id] = setTimeout(function(){
            let rect = draggable.getBoundingClientRect();
            if(rect.width === 0 || rect.height === 0) return;/*display:none*/
            if(rect.left < 0 || innerWidth < rect.left){/*画面外警告*/
              warn(`left: ${rect.left}, right: ${innerWidth - rect.left}`);
              if(rect.left < 0) rect.left = 0;
              if(innerWidth < rect.left) rect.left = innerWidth - rect.width;
            }
            if(rect.left < innerWidth - rect.right || innerWidth < rect.right/*右にはみ出てるときは左基準*/){
              positions[draggable.id] = ['left', rect.left];/*[画面左辺寄り, 左辺からパネル左端まの距離]*/
            }else{
              positions[draggable.id] = ['right', innerWidth - rect.left];/*[画面右辺寄り, 右辺からパネル「左」端まの距離]*/
            }
            Storage.save('positions', positions);
            //log('Saved:', draggable.id, positions[draggable.id]);
          }, 125);
        }, {attributes: true, attributeFilter: ['style']});
      });
      window.addEventListener('resize', function(e){
        clearTimeout(throttles.resize), throttles.resize = setTimeout(function(){
          innerWidth = window.innerWidth;
          Array.from(draggables).forEach(draggable => replace(draggable));
        }, 250);
      });
    },
    observeStreamingEnd: function(){
      /* 終演後の自動遷移をくい止める */
      let autoTransision = elements.autoTransision, onlivelistButton = elements.onlivelistButton;
      observe(autoTransision, function(records){
        if(site.is.onAutoTransition(autoTransision)) onlivelistButton.click();
      }, {attributes: true});
    },
    debug: {
      /*
        [DEBUG = true 専用機能]
        いずれもすこすこツールとの連携必須

        自動星満タン
          星を満タンにするまで配信部屋を開く。
          すこすこツールの「オンライブルームを開く」ボタン(雷アイコン)の右クリックで起動。
          すこすこツールの一斉タブ開きとは違い、タブをひとつずつ開くのでCPUにやさしい。
          もう一度右クリックすると、これから開く予定のタブをキャンセルできます。

        自動スケジュール
          星回収と星捨てと星投げとカウントをすべて行う全自動ツール。
          すこすこツールの「取得ログ」パネルに星捨ての時刻を登録することで起動。
          星捨ての時刻だけ登録すれば、配信中の回収と星投げとカウントは自動で行われる。
          ※星捨て時刻がない場合でも、2周を目標に自動で星を回収して投げる。
          ※星捨て時刻は、書き換えない限り毎日同じ時刻に星捨てを行う。
          ※同時に複数の部屋で有効にはできない。最後に有効にした部屋のみ。
          ※所有している星の数を確認するために1タブだけ開くことがある。

          1)スケジュール登録時
            満タンじゃなければ満タンにする
            (星捨てまでの余裕が55分を切っていればあきらめる)
          2)星捨て時
            解除予測時刻になったら1タブだけ開く
            (星捨てをあきらめていた場合はこの時点で満タンにする)
          3)配信開始時
            配信中はカウントと星投げをできる範囲で常に行い続ける
            星捨てしていれば9タブ、していなければ10タブ開いて2周目を回収
          4)配信中の3周目以降
            解除予測時刻になったら10タブ開いて3周目を回収
          5)配信終了後
            解除予測時刻になったら10タブ開いて満タンにする
            2)に戻る

        [memo]
        スクリプトでやれる唯一の方法が配信画面内のUIの自動クリック。
        解除を見越して先走ってタブを開くことでタイミングのズレを防げるようだ。
        https://note.com/yova/n/n982c1fedf18c
        すこすこツールも、所有する星の数は配信部屋を開いて確認している。
        スマホで同時視聴するときは配信開始時にスマホ側で99星からあふれさせないように注意。
      */
      OPENNUMBER: 10,/*すべて同時に開くすこすこツールよりは回収失敗は少ないはず*/
      COLLECTINTERVAL: (30+5)*SECOND,/*すこすこツールは40秒で閉じるので、5秒間は二つ開いている計算*/
      LEADTIME: 20*SECOND,/*解除を見越して先走ってタブを開いておく時間(理論上は30秒)*/
      ALLOWEDDELAY: 5*MINUTE,/*星捨てをあきらめる遅刻*/
      ICONCOLOR: '#b0b603',
      targets: {
        onliveOpen: () => $('#onlive_open'),/*オンライブルームを開くボタン(雷アイコン)*/
        onliveOpenIcon: () => $('#onlive_open img.icon'),/*雷アイコン*/
        getLogArea: () => $('#get_log_area'),/*星種取得ログ*/
      },
      get: {
        giftItemType: () => $('#ten_post img.icon[src]', img => match(img.src, /\/([a-z]+)_10\./, m => m[1])),/*star(公式) or seed(アマチュア)*/
        giftFreeNumLabels: () => $$('#room-gift-item-list > li:nth-child(-n + 5) .gift-free-num-label'),/*5はきほん不変のマジックナンバー*/
        autoCount: () => $('#auto_count:not(.end) > .icon:not(.on)', e => e.parentNode),/*50カウント*/
        throwable: () => $('#ten_post .on') || $('#rest_post .on'),/*10投げまたは端数投げの有効なボタン*/
        getTypeGet: () => $('[name="get_type"][value="1"]'),/*取得モードでルームを開く(捨て星でも問題なし)*/
        openNum: () => $('#context_box input.open_num'),/*開くルーム数*/
        open: () => $('#context_box button.open'),/*OPENボタン*/
        contextClose: () => $('#context_box .context_close'),/*閉じるボタン*/
        resetTime: () => $(`.${core.debug.get.giftItemType()} .reset_2[title]`, e => parseInt(e.title)),/*解除予測時刻*/
        gotTotal: () => $(`.${core.debug.get.giftItemType()} .total`, e => parseInt(e.textContent)),/*取得回数*/
        shortest: () => {/*いちばん少ない星の数*/
          let collection = core.debug.collection, type = core.debug.get.giftItemType();
          if(collection[type] === undefined || collection[type].length === 0 || collection[type].some(item => isNaN(item))) return null;/*所有数が不明*/
          return Math.min(...collection[type]);/*いちばん少ない色の星種*/
        },
        openNumber: (available, gotTotal, shortest, toOpenCount) => {/*開けるタブの数*/
          let OPENNUMBER = core.debug.OPENNUMBER, MAX = 99, ONCE = 10;
          let shortTabs = Math.ceil((MAX - shortest)/ONCE);/*星を満タンにするタブ数*/
          let total = available ? toOpenCount : gotTotal + toOpenCount;/*これから開くタブも含めた取得回数*/
          switch(true){
            case(!available && 0 < total && total < OPENNUMBER):/*回収の余地あり*/
            case(available):/*回収できる*/
              return Math.min(OPENNUMBER - total, shortTabs);/*通常のタブ数計算*/
            case(!available && total === OPENNUMBER):/*ちょうど回収し尽くした*/
            case(!available && total === 0):/*次の周回に向けて0にリセットされた*/
            default:
              return 0;
          }
        },
      },
      schedule: {},/* {roomId: roomId, enabled: true, queueText: '23:00', queue: [1234567890]} */
      collection: {},/* {star: [99,99,99,99,99], seed: [99,99,99,99,99]} */
      ready: function(){
        if(DEBUG === false) return;
        core.getTargets(core.debug.targets).then(() => {
          log("I'm ready for debug with すこすこツール.");
          core.debug.schedule = Storage.read('schedule') || core.debug.schedule;
          core.debug.collection = Storage.read('collection') || core.debug.collection;
          core.debug.getCollection();
          core.debug.observeComposing();
          core.debug.rightClickToOpenTabs();
          core.debug.prepareScheduleForm();
          core.addStyle('debugStyle');
          core.debug.demo();
        });
      },
      getCollection: function(){
        /* 所持数を把握する */
        if(site.is.onLive()){
          let collection = core.debug.collection, type = core.debug.get.giftItemType();
          let update = function(labels){
            collection[type] = Array.from(labels).map(label => match(label.textContent, /[0-9]+/, m => parseInt(m[0])));
            Storage.save('collection', collection);
            core.debug.collection = collection;
            log('labels[0].textContent:', labels[0].textContent, 'collection[type]:', collection[type]);
          };
          core.getTarget(core.debug.get.giftFreeNumLabels).then(labels => {
            update(labels);
            Array.from(labels).forEach(label => {
              observe(label, function(records){
                clearTimeout(timers.collectionUpdate), timers.collectionUpdate = setTimeout(() => {
                  if(site.is.onLive()) update(labels);/*配信終了直後に見た目上の星種の数が0にリセットされるので、オンライブ中を確認しないと誤検出してしまう*/
                }, 1000);
              }, {childList: true, characterData: true, subtree: true});
            });
          });
        }
        /* 他のタブでの更新を反映させる */
        window.addEventListener('storage', function(e){
          if(e.key !== Storage.key('collection')) return;
          collection = core.debug.collection = Storage.read('collection');
          log('collection:', collection);
        });
      },
      observeComposing: function(){
        /* 入力変換中をマーク(変換中はよそから邪魔されたくないので) */
        let input = elements.inputComment;
        let setup = function(input){
          input.addEventListener('compositionstart', function(e){
            input.classList.add('composing');
          });
          input.addEventListener('compositionend', function(e){
            input.classList.remove('composing');
          });
        };
        /* 公式入力欄 */
        setup(input);
        /* すこすこツール入力欄 */
        core.getTarget(site.get.sukoCommentInput).then(input => {
          setup(input);
        });
      },
      rightClickToOpenTabs: function(){
        /* 右クリックで自動星回収 */
        let onliveOpen = elements.onliveOpen;
        onliveOpen.addEventListener('contextmenu', function(e){
          if(!flags.collecting){
            core.debug.openTabs(core.debug.OPENNUMBER);
          }else{
            clearTimeout(timers.openTabs);
            elements.onliveOpenIcon.style.background = '';
            elements.openTabsCounter.textContent = '';
            flags.collecting = false;
          }
          e.preventDefault();
        });
      },
      prepareScheduleForm: function(){
        /* 自動スケジュール登録 */
        let schedule = core.debug.schedule;
        let getLogArea = elements.getLogArea;
        let scheduleForm = createElement(html.scheduleForm());
        let queueTextarea = scheduleForm.querySelector('#auto-schedule-queue');
        let enableInput = scheduleForm.querySelector('#auto-schedule-eneble'), enableLabel = enableInput.nextElementSibling;
        getLogArea.appendChild(scheduleForm);
        /* 星捨て予定時刻 */
        if(schedule.queueText) queueTextarea.value = schedule.queueText;
        let lastQueueText = queueTextarea.value;
        queueTextarea.addEventListener('keyup', function(e){
          /* 書き換えられたら必ずOFFにする */
          if(lastQueueText === queueTextarea.value) return;
          if(enableInput.checked) enableInput.click();
          lastQueueText = queueTextarea.value;
        });
        /* ON/OFF切り替え */
        enableInput.addEventListener('change', function(e){
          if(enableInput.checked){
            enableLabel.textContent = 'ON';
            let now = Date.now(), today = now - (now%DAY) - 9*HOUR/*JST*/;
            let queue = [];
            for(let i = 0, lines = queueTextarea.value.trim().split('\n'), line; line = lines[i]; i++){
              let p = line.match(/^([0-9]{1,2}):([0-9]{1,2})$/);
              if(p === null) return core.debug.notify(`書式が違います: ${line}`), setTimeout(() => enableInput.click(), 250);
              let time = today + parseInt(p[1])*HOUR + parseInt(p[2])*MINUTE;/*時刻を今日の日時にする*/
              if(time < now) time+= 1*DAY;/*過ぎてたら明日の時刻とする*/
              queue.push(time);
            }
            schedule = core.debug.schedule = {
              roomId: roomId,
              enabled: true,
              queueText: queueTextarea.value,
              queue: queue.sort((a, b) => a - b),
            };
            Storage.save('schedule', schedule);
            core.debug.notify(`自動スケジュールが有効になりました。部屋は開いたままにしてください。`);
            core.debug.automate();
          }
          else{
            enableLabel.textContent = 'OFF';
            schedule = core.debug.schedule = {
              roomId: roomId,
              enabled: false,
              queueText: queueTextarea.value,
              queue: [],
            };
            Storage.save('schedule', schedule);
            core.debug.stopAutomate();
          }
        });
        /* 一度処理を走らせる */
        if(schedule.enabled && schedule.roomId === roomId){
          enableInput.click();/* checked = true ではイベントが発生しない */
        }
        /* 他のタブでの更新を反映させる */
        window.addEventListener('storage', function(e){
          if(e.key !== Storage.key('schedule')) return;
          schedule = core.debug.schedule = Storage.read('schedule');
          log('schedule:', schedule);
          if(enableInput.checked && schedule.enabled) enableInput.click();
        });
      },
      automate: function(){
        let schedule = core.debug.schedule, lastTime = Date.now();
        if(!schedule.enabled || schedule.roomId !== roomId) return;
        clearInterval(timers.automation), timers.automation = setInterval(() => {
          let now = Date.now(), ALLOWEDDELAY = core.debug.ALLOWEDDELAY;
          /*スリープ明けなら(配信開始に反応しなくなってしまうのでリロード)*/
          if(lastTime < now - 1*MINUTE){
            setTimeout(() => location.reload(), 1*MINUTE);/*ネットワークの復帰に時間がかかる場合があるので*/
            return clearInterval(timers.automation);
          }
          else lastTime = now;
          /* 配信中は可能ならカウントと星投げ */
          let isOnLive = site.is.onLive();
          if(isOnLive){
            let autoCount = core.debug.get.autoCount(), throwable = core.debug.get.throwable();
            if(autoCount) autoCount.dispatchEvent(new MouseEvent('mouseup'));/*mouseupで起動*/
            if(throwable) throwable.click();
          }
          /* 星捨てと回収 */
          let available = core.debug.get.resetTime() - core.debug.LEADTIME <= now;/*解除予測を過ぎている*/
          let gotTotal = core.debug.get.gotTotal();/*取得回数*/
          let shortest = isOnLive ? 0 : core.debug.get.shortest();/*最小の星の数(配信中なら投げ切る前提)*/
          let toOpenCount = flags.openTabsCounter || 0;/*回収中のタブの数*/
          let openNumber = core.debug.get.openNumber(available, gotTotal, shortest, toOpenCount);/*開けるタブの数*/
          let getTimeString = (time) => (new Date(time)).toLocaleTimeString();
          /* 検証用ログ */
          flags.currentAutomateLog = ['available', available, 'gotTotal', gotTotal, 'shortest', shortest, 'toOpenCount', toOpenCount, 'openNumber', openNumber, 'collecting', flags.collecting, 'next:', getTimeString(schedule.queue[0])];
          if(JSON.stringify(flags.currentAutomateLog) !== JSON.stringify(flags.lastAutomateLog)){
            log(JSON.stringify(flags.currentAutomateLog));
            flags.lastAutomateLog = flags.currentAutomateLog;
          }
          switch(true){
            /* タブを開いてる最中なら処理を保留する */
            case(flags.collecting):
              break;
            /* 所有数が不明なら確認しに行く。 */
            /* ただし星捨て時刻まで1時間以上余裕があること(5分までの遅刻は許す)。さもなくば、星捨てまで待つ */
            case(shortest === null && now + 1*HOUR - ALLOWEDDELAY < schedule.queue[0]):
              core.debug.openTabs(1);
              core.debug.notify(`${getTimeString(now)} 星種確認(1タブ)`, true);
              break;
            /* 星捨て */
            /* 解除予測が過去で、星捨て予定時刻を過ぎたばかり(5分以上遅刻ならあきらめる) */
            /* 遅刻で回収を控えていた場合も、星捨て時刻に粛々と星捨てすることで本来のスケジュールに合流する */
            case(available && (now - ALLOWEDDELAY < schedule.queue[0] && schedule.queue[0] < now)):
              core.debug.openTabs(1);
              core.debug.notify(`${getTimeString(now)} 星種捨て(1タブ)`, true);
              schedule.queue[0] += 1*DAY;/*すぐに繰り延べされる！*/
              schedule.queue.sort((a, b) => a - b);
              core.debug.schedule = schedule;
              Storage.save('schedule', schedule);
              break;
            /* 星回収 */
            /* 1. 開けるタブの数がゼロなら、回収しない */
            case(openNumber === 0):/*もう満タン*/
              break;
            /* 3. 解除予測が未来でも、取得回数が1-10未満なら、別デバイスの分はさておき、きほん回収できるはず */
            case(!available && 0 < openNumber):
            /* 4. 解除予測が過去なら、回収できる。ただし星捨て時刻まで1時間以上余裕があること(5分までの遅刻は許す) */
            case(available && 0 < openNumber && schedule.queue[0] === undefined):/*星捨て予定なし*/
            case(available && 0 < openNumber && now + 1*HOUR - ALLOWEDDELAY < schedule.queue[0]):
              /* 配信開始直後は1度だけ投げた後に1タブ判定されて、flags.collectingが明けるころには2.に移行する */
              core.debug.openTabs(openNumber);
              core.debug.notify(`${getTimeString(now)} 星種回収(${openNumber}タブ)`, true);
              break;
            /* 繰り延べ */
            /* タイミングを逃すなどで星捨てできなかった場合にスケジュールをし直す */
            case(schedule.queue[0] < now):
              schedule.queue[0] += 1*DAY;/*すぐに繰り延べされる！*/
              schedule.queue.sort((a, b) => a - b);
              core.debug.schedule = schedule;
              Storage.save('schedule', schedule);
              break;
          }
        }, 1000);
      },
      stopAutomate: function(){
        clearInterval(timers.automation);
      },
      openTabs: function(count){
        flags.collecting = true;
        let onliveOpen = elements.onliveOpen, onliveOpenIcon = elements.onliveOpenIcon;
        let counter = elements.openTabsCounter = elements.openTabsCounter || onliveOpen.appendChild(createElement(html.counter()));
        /* 日本語変換中にフォーカス失うのを回避 */
        let input = elements.inputComment;
        if(input.classList.contains('composing')) return input.addEventListener('compositionend', function(e){
          core.debug.openTabs(count);
        }, {once: true});
        core.getTarget(site.get.sukoCommentInput).then(input => {
          if(input.classList.contains('composing')) return input.addEventListener('compositionend', function(e){
            core.debug.openTabs(count);
          }, {once: true});
        });
        /* まずオンライブを開くボタンのサブメニューを開いて */
        if(onliveOpenIcon.classList.contains('on') === false) onliveOpen.click();
        core.getTarget(core.debug.get.open).then(open => {
          core.debug.get.getTypeGet().checked = true;/*取得モード*/
          core.debug.get.openNum().value = 1;/*1タブずつ*/
          open.click();/*開く*/
          onliveOpenIcon.style.background = core.debug.ICONCOLOR;
          counter.textContent = flags.openTabsCounter = count;/*いま開いたタブも含めた数*/
          timers.openTabs = setTimeout(() => {
            flags.openTabsCounter = --count;
            if(1 <= count){
              core.debug.openTabs(count);
            }
            else{
              onliveOpenIcon.style.background = '';
              counter.textContent = '';
              setTimeout(() => flags.collecting = false, 20*SECOND);/*gotTotal反映までのタイムラグ10秒前後で不定？*/
            }
          }, core.debug.COLLECTINTERVAL);
          core.debug.get.contextClose().click();
        });
      },
      notify: function(body, sticky = false){
        log(body, sticky);
        Notification.requestPermission();
        core.debug.notify.notifications = core.debug.notify.notifications || {};
        if(core.debug.notify.notifications[body] !== undefined) core.debug.notify.notifications[body].close();
        core.debug.notify.notifications[body] = new Notification(SCRIPTNAME, {body: body});
        core.debug.notify.notifications[body].sticky = sticky;
        core.debug.notify.notifications[body].addEventListener('click', function(e){
          core.debug.notify.notifications[body].close();
        });
        window.addEventListener('unload', function(e){
          Object.values(core.debug.notify.notifications).filter(n => !n.sticky).forEach(n => n.close());
        });
      },
      demo: function(){
        /* スクリプトのデモンストレーション用 */
        window.demo = function(){
          /* ランダム投稿 */
          let list = elements.commentLogList, wrapper = elements.commentWrapper, input = elements.inputComment;
          let random = () => Math.random()*10*1000;
          let getCommentData = () => ({avatar: '1.png?v=81', name: 'てすと', comment: 'こめんとだよ'});
          let getMyCommentData = (comment) => ({avatar: '2.png?v=81', name: 'knoa (のあ)', comment: comment});
          let appendComment = function(data){
            let li = createElement(html.comment(data));
            core.markMyItem(data, li);
            list.insertBefore(li, list.firstElementChild);
          };
          let post = function(){
            appendComment(getCommentData());
            setTimeout(post, random());
          };
          post();
          /* 自分投稿 */
          wrapper.style.display = 'block';
          wrapper.addEventListener('keydown', function(e){
            if(e.key !== 'Enter') return;
            if(e.isComposing) return;
            appendComment(getMyCommentData(input.value));
            input.value = '';
            e.stopPropagation();
          }, {capture: true});
          /* 音量調整 */
          $('#js-room-volume-wrapper').style.display = 'block';
        };
      },
    },
    tame: function(){
      /* 配信中でなければ requestAnimationFrame を休む */
      let isOnLive = true;/* 仮 */
      setTimeout(() => {
        isOnLive = site.is.onLive();
      }, 1*MINUTE);/* 読み込みがあっても1分後には確定しているはず */
      const originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = function(f){
        if(isOnLive) return originalRequestAnimationFrame(f);
        else return true;
      };
    },
    getTarget: function(selector, retry = 10, interval = 1*SECOND){
      const key = selector.name;
      const get = function(resolve, reject){
        let selected = selector();
        if(selected && selected.length > 0) selected.forEach((s) => s.dataset.selector = key);/* elements */
        else if(selected instanceof HTMLElement) selected.dataset.selector = key;/* element */
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
    addStyle: function(name = 'style'){
      if(html[name] === undefined) return;
      let style = createElement(html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
  };
  const html = {
    scrollWrapper: (comment) => `<div class="${SCRIPTID}-scrollWrapper"></div>`,
    comment: (comment) => `
      <li class="commentlog-row" ${comment.name === myUserName ? 'data-me="true"' : ''}>
        <div class="comment-log-avatar"><img src="${AVATARPREFIX + comment.avatar}"></div>
        <div class="comment-log-name">${comment.name}</div>
        <div class="comment-log-comment">${comment.comment}</div>
      </li>
    `,
    gift: (gift) => `
      <li ${gift.name === myUserName ? 'data-me="true"' : ''}>
        <div class="gift-avatar"><img src="${AVATARPREFIX + gift.avatar}"></div>
        <div class="gift-user-name">${gift.name}</div>
        <div class="gift-image">
          <img src="${GIFTPREFIX + gift.image}">
          <div class="gift-num">x<span class="num">${gift.num}</span></div>
        </div>
      </li>
    `,
    clearButton: () => `<button class="${SCRIPTID}-clearButton" title="ログをクリアする">✓</button>`,
    ngWords: () => `<span class="${SCRIPTID}-ngWords"></span>`,
    counter: () => `<span style="position:absolute;left:.75em;top:.25em;color:white;"></span>`,
    scheduleForm: () => `
      <div id="${SCRIPTID}-schedule">
        <p>自動スケジュール</p>
        <label for="auto-schedule-queue">星種捨て予定時刻</label>
        <textarea id="auto-schedule-queue" title="捨てる時刻のみ書けばOK" placeholder="${`
          23:00
        `.trim().replace(/^\s+/mg, '')}"></textarea>
        <p><input type="checkbox" id="auto-schedule-eneble"><label for="auto-schedule-eneble">OFF</label></p>
      </div>
    `,
    style: () => `
      <style type="text/css" id="${SCRIPTID}-style">
        /* パネル共通 */
        .ui-draggable:hover:not(.suko_content){
          z-index: 100 !important;
        }
        .ui-draggable .title{
          padding: 0 10px;
          font-size: 12px;
        }
        /* コメント入力欄 */
        #js-room-comment-wrapper{
        }
        /* コメント入力 NGワード */
        #js-room-comment{
          position: relative;
        }
        #js-room-comment #js-chat-input-comment.ngWords,
        #con_comm_input.ngWords/*すこすこツール*/{
          background: rgba(128,128,0,0.9) !important;
        }
        #js-room-comment #js-chat-input-comment + .${SCRIPTID}-ngWords,
        #con_comm_input/*すこすこツール*/ + .${SCRIPTID}-ngWords{
          position: absolute;
          bottom: 0;
          left: 0;
          background: rgba(128,128,0,.9);
          border: 1px solid white;
          border-radius: 2px;
          color: white;
          padding: 1px 2px;
          transform: translate(0%, calc(100% - 2px));
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
        }
        #js-room-comment #js-chat-input-comment.ngWords + .${SCRIPTID}-ngWords,
        #con_comm_input.ngWords/*すこすこツール*/ + .${SCRIPTID}-ngWords{
          opacity: 1;
        }
        /* コメントログ・ギフトログ・ランキング */
        .${SCRIPTID}-clearButton{
          position: absolute;
          right: 5px;
          top: 5px;
          width: 1rem;
          height: 1rem;
          line-height: 1rem;
          padding: 0;
          background: rgba(255,255,255,.125);
          border: none;
          border-radius: 2.5px;
        }
        .${SCRIPTID}-clearButton:hover{
          background: rgba(255,255,255,.250);
        }
        #ranking #ranking-content-region{
          margin: 0;
          height: calc(100% - 25px/*.title*/ - 5px/*下部ツマミ*/) !important;
        }
        #ranking #room-ranking-list{
          margin: 0;
          height: 100% !important;
        }
        #ranking #user_live_rank_list{
          height: calc(100% - 10px) !important;
        }
        #ranking #user_live_rank_list_box{
          height: calc(100% - 32px) !important;
        }
        #comment-log li,
        #gift-log li,
        #ranking li{
          padding: 2px 5px 2px !important;
          margin: 0 !important;
          min-height: 40px !important;/*avatar高さを確保*/
        }
        #comment-log li > .comment-log-avatar{
          top: 2px;
          left: 5px;
        }
        #gift-log li > .gift-avatar{
          top: 5px;/*重心を考慮*/
          left: 5px;
        }
        #ranking li > .ranking-num{
          top: 2px;
          left: 5px;
        }
        #ranking li > .ranking-avatar{
          top: 2px;
          left: 30px;
        }
        #comment-log li > .comment-log-name,
        #comment-log li > .comment-log-comment,
        #gift-log li > .gift-user-name,
        #gift-log li > .gift-image{
          margin-left: 45px !important;
        }
        #comment-log li > .comment-log-name,
        #gift-log li > .gift-user-name,
        #ranking li > .ranking-name{
          font-size: 10px;
          line-height: 1.25;
        }
        #comment-log li > .comment-log-comment{
          font-size: 14px;
          line-height: 1.25;
        }
        #ranking li > .ranking-sub-info{
          margin-top: 0;
        }
        /* 新着コメントの表示ボタン */
        #new-comment-button{
          z-index: 1000 !important;
        }
        /* コメントログ・ギフトログの新着 */
        #comment-log #comment-log-content-region,/*公式のちぐはぐ構造に対応*/
        #gift-log .${SCRIPTID}-scrollWrapper{
          height: calc(100% - 25px/*.title*/ - 5px/*下部ツマミ*/) !important;
          overflow: auto !important;
        }
        x#comment-log #comment-log-content-region .${SCRIPTID}-scrollWrapper{
          height: 100% !important;
          overflow: scroll !important;/*下記 overflow と一心同体*/
        }
        ul#room-comment-log-list,
        ul#gift-log-list{
          height: 100% !important;
          /* これを有効にすると、スクロール時に新着ボタンを正しく表示できなくなる */
          /* 逆にこれを無効にしていると、新着のたびにスクロールバーが慌ただしくなる */
          overflow: visible !important;
        }
        #comment-log #comment-log-content-region::-webkit-scrollbar,
        #gift-log .${SCRIPTID}-scrollWrapper::-webkit-scrollbar{
          width: 4px;
        }
        #comment-log #comment-log-content-region::-webkit-scrollbar-thumb,
        #gift-log .${SCRIPTID}-scrollWrapper::-webkit-scrollbar-thumb{
          -moz-border-radius: 4px/4px;
          -webkit-border-radius: 4px 4px;
          border-radius: 4px;
          background: #fff;
        }
        ul#room-comment-log-list li,
        ul#gift-log-list li{
          animation: ${SCRIPTID}-new-highlight 5s linear forwards;
        }
        @keyframes ${SCRIPTID}-new-highlight{
            0%{background: rgba(173,228,255,.25)}
          100%{background: rgba(173,228,255,.00)}
        }
        ul#room-comment-log-list li[data-me="true"],
        ul#gift-log-list li[data-me="true"]{
          animation: ${SCRIPTID}-new-highlight-me 5s linear forwards;
        }
        @keyframes ${SCRIPTID}-new-highlight-me{
            0%{background: rgba(173,228,255,.50)}
          100%{background: rgba(173,228,255,.25)}
        }
        /* コメントログ・ギフトログにおける配信枠の区切り */
        ul#room-comment-log-list li[data-restarted],
        ul#gift-log-list li[data-restarted]{
          margin-bottom: 10px !important;
        }
        ul#room-comment-log-list li[data-restarted]:after,
        ul#gift-log-list li[data-restarted]:after{
          background: rgba(255,255,255,.75);
          width: 10px;
          height: 10px;
          content: " ";
          position: relative;
          left: 50%;
          top: 10px;
          display: block;
          border-radius: 10px;
        }
        /* ギフト */
        #gift-area #gift-area-tabs{
          background: rgba(32,42,47,.75);/*#202A2F*/
        }
        #gift-area #gift-area-tabs .tab-slider-btn{
          background: rgba(55,71,79,.75);/*#37474F*/
        }
        #gift-area #use-point-mode{
          background: rgba(93,93,93,.75);/*#5d5d5d*/
        }
        #gift-area ul#room-gift-item-list li::after{
          background: rgba(142,147,154,.6);
          border-radius: 3px;
          content: " ";
          position: absolute;
          width: 100%;
          height: 100%;
          bottom: 0;
          z-index: -1;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0ms;
        }
        #gift-area ul#room-gift-item-list li[data-mousedown="true"]::after{
          transform: scaleY(1);
          transition: transform ${LONGPRESS}ms linear;
        }
        #gift-area ul#room-gift-item-list li[data-mousedown="true"] img.gift-image{
          transform: scale(1);
        }
        #gift-area ul.gift-user-info{
          background: rgba(55,71,79,.75);/*#37474F*/
        }
        #gift-area ul.gift-user-info li.gift-user-show-gold{
          background: rgba(31,41,47,.75);/*#37474F*/
        }
        /* アバターとギフト画像の拡大 */
        #comment-log #comment-log-content-region,
        #comment-log #comment-log-content-region .${SCRIPTID}-scrollWrapper,
        #gift-log .${SCRIPTID}-scrollWrapper{
          padding: 0 0 0 25px !important;
          margin: 0 0 0 -25px !important;/*はみ出し*/
          content-visibility: auto;
        }
        #gift-area #room-gift-item-wrapper{
          padding: 5px 5px 5px 25px !important;/*padding/marginの入れ替え*/
          margin: 0 0 0 -20px !important;/*はみ出し*/
          overflow-x: hidden !important;
          content-visibility: auto;
        }
        ul#room-comment-log-list,
        ul#gift-log-list,
        ul#room-gift-item-list,
        ul#room-ranking-list{
          margin: 0 !important;
        }
        ul#room-comment-log-list li:hover,
        ul#gift-log-list li:hover,
        ul#room-gift-item-list li:hover,
        ul#room-ranking-list li:hover{
          z-index: 100;
        }
        ul#room-comment-log-list li,
        ul#room-comment-log-list li .comment-log-avatar,
        ul#gift-log-list li,
        ul#gift-log-list li .gift-avatar,
        ul#gift-log-list li .gift-image,
        ul#room-gift-item-list li,
        ul#room-gift-item-list li .gift-image,
        ul#room-ranking-list li,
        ul#room-ranking-list li .ranking-avatar{
          overflow: visible !important;
        }
        ul#gift-log li .gift-image{
          max-height: 35px;
        }
        ul#room-comment-log-list li .comment-log-avatar img,
        ul#gift-log-list li .gift-avatar img,
        ul#gift-log-list li .gift-image img,
        ul#room-gift-item-list li img.gift-image,
        ul#room-ranking-list li .ranking-avatar img{
          transition: 125ms ease-out;
        }
        ul#room-comment-log-list li .comment-log-avatar img:hover,
        ul#gift-log-list li .gift-avatar img:hover,
        ul#gift-log-list li .gift-image img:hover,
        ul#room-gift-item-list li a:hover img.gift-image,
        ul#room-ranking-list li .ranking-avatar img:hover{
          transform: scale(2);
          filter: drop-shadow(0 0 4px rgba(0,0,0,1.0));
        }
        ul#room-gift-item-list li .gift-gold{
          position: relative;
        }
        ul#room-gift-item-list li a:hover + .gift-gold{
          filter: drop-shadow(0 0 4px rgba(0,0,0,1.0));
        }
        /* イベント */
        #event-dialog *{
          font-size: 12px !important;
          text-align: left !important;
        }
        #event-dialog .title{
          line-height: 1.5;
        }
        #event-dialog .event-body{
          padding: 5px 10px;
        }
        #event-dialog .image{
          float: left;
          width: 80px;
          margin: 0 10px 5px 0;
        }
        #event-dialog .image img{
          width: 80px;
        }
        #event-dialog .current-rank{
          margin-top: 0;
        }
        #event-dialog #event-support-wrapper{
          clear: both;
        }
        #event-dialog .bx-next.showEventDetail,
        #event-dialog .quest-level-label,
        #event-dialog .support-header,
        #event-dialog .support-gauge-wrapper{
          display: none !important;
        }
        #event-dialog .support-body,
        #event-dialog .support-goal{
          padding-top: 0;
          margin-top: 0;
        }
        /* 音量調整 */
        #js-room-volume-wrapper{
          cursor: pointer;
        }
        #room-header:hover{
          z-index: 101;
        }
        #js-room-volume-wrapper{
          padding: 15px;
          margin: 0;
        }
        #js-room-volume-wrapper #room-video-volume{
          top: 50px;
        }
        #js-room-volume-wrapper:hover #room-video-volume{
          display: block !important;
        }
        /* フッタボタン群 */
        #js-room-footer{
          min-width: auto;/*透明なフッタが操作のじゃまをすると気付けない*/
          left: auto;
        }
        #js-room-footer:hover{
          z-index: 100;
        }
        #js-room-footer .footer-menu li{
          transition: filter 125ms ease-out;
        }
        #js-room-footer:hover .footer-menu li{
          filter: drop-shadow(0 0 5px rgba(38,50,56,1));
        }
        /* その他 */
        #js-room-section{
          overflow: visible;
        }
        #dialog-section .twitter-dialog,
        #dialog-section .gift-alert-dialog{
          background: rgba(255,255,255,.875);
        }
        #js-room-footer .footer-menu li{
          background: rgba(38,50,56,.75);
        }
        /* すこすこツール対応 */
        #user_live_rank_show{
          top: 2px !important;
        }
        dummy #video_con_box{
          top: calc(98px + 320px + 40px) !important;/*公式アップデートによるコントローラとの丸かぶりを暫定回避*/
          background: rgba(0,0,0,.75) !important;
        }
      </style>
    `,
    debugStyle: () => `
      <style type="text/css" id="${SCRIPTID}-debugStyle">
        /* 自動スケジュールフォーム */
        #get_log_area{
          border-radius: 5px 0 0 5px;
        }
        #${SCRIPTID}-schedule{
          position: absolute;
          top: 0;
          left: 100%;
          width: 10em;
          height: 100%;
          padding: 5px 5px 5px 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-size: 80%;
          color: white;
          background: rgba( 20, 50, 50, 0.8 );
          border-radius: 0 5px 5px 0;
        }
        #${SCRIPTID}-schedule p:first-child{
          color: white;
        }
        #${SCRIPTID}-schedule label[for="auto-schedule-queue"]{
          color: #1DE9B6;
        }
        #${SCRIPTID}-schedule textarea#auto-schedule-queue{
          flex: 1;
          background: rgba(0,0,0,.9);
        }
        #${SCRIPTID}-schedule input#auto-schedule-eneble{
          display: none;
        }
        #${SCRIPTID}-schedule input#auto-schedule-eneble + label[for="auto-schedule-eneble"]{
          display: block;
          border: none;
          border-radius: 2px;
          margin-top: 1px;
          text-align: center;
          color: #ccc;
          background: #999;
        }
        #${SCRIPTID}-schedule input#auto-schedule-eneble:checked + label[for="auto-schedule-eneble"]{
          color: #fff;
          background: #1DE9B6;
        }
      </style>
    `,
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
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
  const $ = function(s, f = undefined){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f = undefined){
    let targets = document.querySelectorAll(s);
    return f ? f(targets) : targets;
  };
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const createElement = function(html = '<div></div>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, characterData: false, subtree: false, attributes: false, attributeFilter: []}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const match = function(string, regexp, f){
    let m = string.match(regexp);
    if(m === null) return null;
    else return f(m);
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
      SCRIPTID + ':',
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
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  const warn = function(){
    if(typeof DEBUG === 'undefined') return;
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
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();