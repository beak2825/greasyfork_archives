// ==UserScript==
// @name YouTube検索結果「全てキューに入れて再生」ボタンを追加
// @description musictonicの代わり　右クリックだとシャッフル再生　e:カーソル下の動画をキューに入れる　y:再生開始　Alt+c/Ctrl+x:視聴中のキューリストをURLにしてコピー
// @version      0.2.11
// @run-at document-idle
// @match *://www.youtube.com/*
// @match *://www.youtube.com/
// @match file:///*
// @grant GM.setClipboard
// @grant       GM.openInTab
// @grant GM.addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @noframes
// @namespace https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @require https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/411269/YouTube%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%80%8C%E5%85%A8%E3%81%A6%E3%82%AD%E3%83%A5%E3%83%BC%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%A6%E5%86%8D%E7%94%9F%E3%80%8D%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/411269/YouTube%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%80%8C%E5%85%A8%E3%81%A6%E3%82%AD%E3%83%A5%E3%83%BC%E3%81%AB%E5%85%A5%E3%82%8C%E3%81%A6%E5%86%8D%E7%94%9F%E3%80%8D%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==
// @match *://*/*

(async function() {
  const USE_INSTANT_PLAYLIST = 0; // 0:機能6-8を無効にする　1:有効にし使用時に確認を表示する　2:有効にし確認しない
  const YOUTUBE_WATCH_ALTC_VARIATIONS = 3; // Alt+cの機能を何番目まで使うか　1:連続再生URL　2:単独再生URLの列挙　3:iframe埋め込み用HTML
  const HIDE_DUPLICATED_VIDEO_IN_SEARCH_RESULTS = 1; // 1:検索結果に重複して出てきた動画を消す（実験的）　2:1＋高速に消す　0:無効
  const HIDE_BASED_ON_TEXT = ""; // 検索結果から動画枠の全てのテキスト（タイトル、投稿者、概要欄等）のどこかが正規表現にヒットする動画を消す　0やnullや""で無効
  const CLOSE_MINI_PLAYER_ALWAYS = 1; // 1:Escでミニプレイヤーを常に閉じる
  const AGREE_TO_CONTINUE_ALWAYS = 1; // 1:無操作一時停止を常に解除
  const HIDE_SUGGEST = 1; // 1:検索結果に割り込む「あなたへのおすすめ」「他の人はこちらも視聴しています」「家にいながら学ぶ」等を隠す　0:無効
  const PRESERVE_INDEX = 0; // 1:機能6-8で最初に再生するトラックを保持
  const INCLUDE_REEL_SHORTS = 1; // 1:機能6-8でリール棚のShorts動画を含める
  const USE_PLAYALL = 1; // 1:PlayAllボタンを有効　0:無効
  const YOUTUBE_WATCH_ALTC_EMBED_PLAYER_SIZE = `width="498" height="280"`; // ALT+C3回目の埋め込みプレイヤーのサイズ指定　322x181~
  const SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH = "12.5"; // 検索結果の動画のサムネイルのサイズ　"":無効
  const SEARCH_RESULTS_THUMBNAIL_SHORTS_HEIGHT = "17"; // 検索結果のshortsのサムネイルのサイズ　"":無効
  const HOME_THUMBNAIL_VIDEOS_SIZE = "width:35em; max-width:15vw; min-width:20em;"; // YouTubeトップ画面の動画のサムネイルのサイズ　："":無変更
  const HOME_THUMBNAIL_SHORTS_SIZE = "max-width:20em;"; // YouTubeトップ画面のShort動画のサムネイルのサイズ　："":無変更
  const CHANNEL_THUMBNAIL_VIDEO_SIZE = "width: 240px;"; // チャンネルの/videos画面の動画のサムネイルのサイズ　："":無変更
  const WAIT_LOADING = 0; // 1:PLAY ALL押下時にボタン設置を待つ 0:待たない
  const EXPERIMENTAL_ALTERNATIVE_URL_FOR_INSTANT_PLAYLIST = 1; // 2:Instant Playlist用のURLを不具合回避のembed版にして遷移するようにする 1:embed版を開いた時通常の視聴ページに遷移する機能だけオン
  const DISPLAY_TOTAL_TIME_OF_PLAYLIST = 1; // 1:プレイリストの合計時間を表示する　2:1+ Alt+C時にできるだけ取得する　0:無効
  const EXPERIMENTAL_REMOVE_AUTOMATICALLY_ADDED_MIXLIST202506 = 1; // 1:2025.06-の通常動画に自動的に付与されるミックスリストを除去（実験的）　2:1+1の処理を視覚的に報告　3:notifyでverbose　0:無効
  const DEBUG = 0; // 1:wait値を表示
  const YT_REFERRER = `no-referrer`; // strict-origin
  Math.random() > 0.5 && GM.addStyle('html{--ytd-grid-6-columns-width: 100%; --ytd-grid-max-width: 100%;}') // /videos画面でサムネイルが横にいくらでも並ぶようにする 2025.04

  const IPURL = EXPERIMENTAL_ALTERNATIVE_URL_FOR_INSTANT_PLAYLIST >= 2 ? `https://www.youtube.com/embed/?playlist=` : `https://www.youtube.com/watch_videos?video_ids=`;
  const IPBOX = `:is( ytd-playlist-video-renderer , ytd-playlist-panel-video-renderer , ytd-playlist-panel-video-renderer#playlist-items.style-scope.ytd-playlist-panel-renderer , :is( :is( ytd-video-renderer , ytd-rich-item-renderer , ytd-grid-video-renderer , ytd-playlist-video-renderer , ytd-reel-item-renderer.style-scope.yt-horizontal-list-renderer , ytd-compact-video-renderer , yt-lockup-view-model.ytd-watch-next-secondary-results-renderer.lockup):not(:has( ytm-shorts-lockup-view-model-v2)) , ytm-shorts-lockup-view-model-v2):not(:has( a[href*="&list=RD"]:not([href*="&pp="]) , a[href*="list=OLAK"] , a[href*="list=PL"])))`; // IPに入れられる動画の枠 shorts含む
  const QBOX = `:is( ytd-playlist-video-renderer , :is( :is( ytd-video-renderer , ytd-rich-item-renderer , ytd-grid-video-renderer , ytd-playlist-video-renderer , ytd-reel-item-renderer.style-scope.yt-horizontal-list-renderer , ytd-compact-video-renderer , yt-lockup-view-model.ytd-watch-next-secondary-results-renderer.lockup):not(:has( ytm-shorts-lockup-view-model-v2)) , ytm-shorts-lockup-view-model-v2):not(:has( a[href*="&list=RD"]:not([href*="&pp="]) , a[href*="list=OLAK"] , a[href*="list=PL"])))`; //キューを入れられる動画の枠 shorts含む

  const MENUBUTTON = `:is(button[aria-label="操作メニュー"] , button[aria-label="その他の操作"] , button[aria-label="Action menu"] , button[aria-label="More actions"])`;
  const itemIPL = (n) => elegeta(`:is(#dismissible a#video-title , #dismissible a#video-title-link , .style-scope.ytd-playlist-video-list-renderer a#video-title , #dismissible a.ytd-compact-video-renderer , #playlist-items a , #dismissible a#video-title , a.yt-lockup-metadata-view-model-wiz__title-link  , a.yt-lockup-metadata-view-model__title ):is([href*="/watch?v="] , [href*="/shorts/"] , [href*="/live/"] ) , a.ShortsLockupViewModelHostEndpoint.ShortsLockupViewModelHostOutsideMetadataEndpoint , a.yt-lockup-metadata-view-model-wiz__title , ytd-rich-grid-slim-media[mini-mode][is-short] div div a ${SHORTS} :visible`, n).filter(e => e?.closest('ytd-playlist-panel-video-renderer')?.style?.opacity != 0.5 && !e?.closest(".miniplayer")).filter(e => e?.closest(IPBOX)); // for IPL
  const QB = e => elegeta('yt-formatted-string.style-scope.ytd-menu-service-item-renderer , .yt-core-attributed-string.yt-list-item-view-model-wiz__title , span.yt-core-attributed-string.yt-list-item-view-model__title:visible')?.find(v => ["キューに追加", "Add to queue"].includes(v.textContent))
  const QBOXlen = () => uniqVideo(elegeta(`${QBOX}:visible`)).length; // 画面に出ている動画の総数
  const MENUBUTTONlen = () => uniqVideo(elegeta(`${QBOX}:visible`).filter(e => /svg/.test(e.innerHTML))).length; // …ボタン設置も完了した動画の総数 2025.03

  var SHORTS = INCLUDE_REEL_SHORTS ? ` , a.shortsLockupViewModelHostEndpoint[href*="/shorts/"]` : ``;
  const EXPERIMENTAL_FASTMODE = 1; // 1:実験的な高速モードを使用　0:旧モード
  const COE = 1; // chrome以外のウエイト係数 取りこぼす時は大きく
  const COE_CHROME = 1; // chromeのウエイト係数 取りこぼす時は大きく

  const CHROME = (window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
  const WAIT_FIRST = CHROME ? 700 : 200; // 取りこぼす時は大きく
  const WAIT_MIN = CHROME ? 190 : 160; // 取りこぼす時は大きく 50-
  const WAIT_MAX = 300; // 取りこぼす時は大きく 250-
  const waitLast = performance.now() * 1; // 現在の負荷
  const wait = EXPERIMENTAL_FASTMODE ? (CHROME ? 40 : 40) : Math.round((Math.min(WAIT_MAX, Math.max(WAIT_MIN, waitLast / 10))) * (CHROME ? COE_CHROME : COE));

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function adja(place = document.body, pos, html) {
    return place ? (place.insertAdjacentHTML(pos, html), place) : null;
  }
  let inYOUTUBE = location.hostname.match0(/^www\.youtube\.com|^youtu\.be/);

  let GF = {}
  var videoDisplayedLast = 0;
  var mllID = 0;
  var kaisuu = 0;
  var equeueIP = [];
  var equeue = [];
  let vid = new WeakMap();

  var playAllCount, playAllCount2;
  var myqueue = [];
  GF.sousa = Date.now()
  //const ael = (ele, evts, cb, opt) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, cb, opt));
  const notify = (message) => Notification.permission === "granted" ? new Notification(message) : Notification.permission !== "denied" && Notification.requestPermission().then(permission => (permission === "granted" && new Notification(message))) // notify(new Date().toLocaleString("ja-JP")
  const ael = (ele, evts, cb, opt = false, interval = 0) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, e => !ael?.to ? ael.to = setTimeout(e => (cb(e), ael.to = 0), interval, e) : 0, opt));
  ael(document, "scroll visibilitychange yt-navigate-finish yt-playlist-data-updated", () => { GF.sousa = Date.now() });

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = [...Array(12)].map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      //var uid = Array.from(Array(12)).map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      document.head.insertAdjacentHTML("beforeend", `<style id="${uid}">${str}</style>`);
      this.added.push([uid, str]);
      return uid;
    },
    remove: function(str) { // str:登録したCSSでもaddでreturnしたuidでも良い
      let uid = this.added.find(v => v[1] === str || v[0] === str)?.[0]
      if (uid) {
        eleget0(`#${uid}`)?.remove()
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }

  if ((window.parent == window) && EXPERIMENTAL_ALTERNATIVE_URL_FOR_INSTANT_PLAYLIST >= 1 && lh(/https:\/\/www.youtube.com\/embed\/\?playlist\=/)) { // 匿名プレイリストの埋め込み用ページだったら正規視聴ページに遷移
    GF.avoidID = setInterval(() => {
      let err = eleget0('//div[contains(@class,"ytp-error-content-wrap")]/div/span[text()="動画を再生できません"]|//div[@class="ytp-error-content-wrap-reason"]/span[text()="Video unavailable"]') // 多分外部サイトでの埋め込み再生を禁止している動画
      if (err) {
        clearInterval(GF.avoidID)
        if (Math.random() > 0.33) { // 2/3の確率で順番を変えてみる（１つめを埋め込み禁止動画じゃなくせるかも）
          var sm = location.href.split(/\s/).map(v => { return [...v?.matchAll(/^(?:h?t?tps?:\/\/)?(?:youtu\.be\/|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)]?.map(c => c.slice(1, 999)) })?.flat()?.flat()?.map(v => v?.split(","))?.flat()?.filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)) // 書式が混在していても登場順に収納する
          sm = sm.map(a => ({ rnd: Math.random(), val: a })).sort((a, b) => a.rnd - b.rnd).map(a => a.val);
          location.href = `https://www.youtube.com/embed/?playlist=${sm.join(",")}`;
        } else {
          location.href = location.href?.replace(/https:\/\/www.youtube.com\/embed\/\?playlist\=/, "https://www.youtube.com/watch_videos?video_ids=");
        }
        return;
      }
      let err2 = eleget0('//div[contains(@class,"ytp-error-content-wrap-reason")]/span[text()="この動画は再生できません"]|//div[contains(@class,"ytp-error-content-wrap-reason")]/span[contains(text(),"This video is unavailable")]') // 多分TLGGが間に合ってない
      if (err2) {
        clearInterval(GF.avoidID)
        if (pref("lastURL") != location.href) {
          pref("lastURL", location.href);
          begin(document.body, `<h2>Wait a few seconds...</h2>`)
          setTimeout(() => location.reload(), 2000);
          return
        }
        alert("数秒待ってリロードしてみると良いかもしれません")
        return;
      }
      let t = eleget0('a.ytp-title-link.yt-uix-sessionlink')?.href?.match0(/^https:\/\/www\.youtube\.com\/watch\?list=.*$/)
      if (t) {
        clearInterval(GF.avoidID)
        location.href = t;
        return;
      }
    }, 333)
  } else pref("lastURL", "");

  if (USE_INSTANT_PLAYLIST) {
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if (key === "Shift+Ctrl+Y" || key === "Shift+Y") { // Shift+Y::
        let option = key == "Shift+Ctrl+Y" ? "shuffle" : ""
        let inp = [...elegeta('a:visible').map(e => e.href.replace("//yewtu.be/watch?v=", "//www.youtube.com/watch?v=").replace("//yewtu.be/shorts/", "//www.youtube.com/shorts/").replace(/\/\/yewtu\.be\/([a-zA-Z0-9_\-,]{11})(.*)/, "//youtu.be/$1$2").replace(/\/\/youtube\.com\/([a-zA-Z0-9_\-,]{11})(.*)/, "//youtu.be/$1$2").replace("//yewtu.be/", "//www.youtube.com/")).filter(v => /youtube\.com|youtu\.be/.test(v)), ...document?.body?.innerText?.split(/\n|\s/)?.filter(v => /youtube\.com|youtu\.be/.test(v)), ...elegeta('iframe[src*="youtube"]').map(e => e?.src)].join(" ");
        if (inp || 1) {
          var urlcap = inp.split(/\s/).map(v => { return [...v?.matchAll(/(?:h?t?tps?:\/\/)?(?:youtu\.be\/(?:watch\?v=)?|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)]?.map(c => c.slice(1, 999)) })?.flat()?.flat()?.map(v => v?.split(","))?.flat()?.filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)) // 書式が混在していても登場順に収納する
          inp = null;
          if (urlcap?.length || 1) {
            let urla = urlcap //urlcap.join(",").split(",").filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)); // 動画IDは11桁
            let urllen = urla.length;
            let urla2 = [...new Set(urla)]; // 重複削除
            if (option == "shuffle") urla2 = shuffle(urla2); // シャッフル
            let urllen2 = urla2.length;
            let urla3 = [...urla2].slice(0, 50); // 50件まで
            let urlenum = urla3.join(",")
            let url = `${IPURL}${urla2.join(",")}`
            var enumUrl = []
            for (let u = 0; u < urla2.length / 50; u++) {
              enumUrl.push(`${IPURL}${ (urla2.slice(u*50, u*50+50).join(",") ) }`)
            }
            let [url0, urls, videos] = urlExtractAndConcat(option, urllen2 ? enumUrl.join(" \n\n") : "", urla2?.length);
            if (urls?.length) {
              setTimeout(() => {
                confirm(`${videos}個の動画を${urls?.length}つのタブで開きますか？\n\n${urls?.join("\n\n")}`) && //GM.openInTab(enumUrl[0], true);
                  openUrls(escape(JS(urls)))
                return;
              }, 222)
            }
          }
        }
      }
    })
  }
  if (!ld("youtube.com")) return; // youtube以外はここまで

  GM.addStyle('ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy { border-radius: 0 !important; }') // 動画の角丸を解除 2025.05
  GM.addStyle('.ytThumbnailViewModelLarge { border-radius: 0 !important; }') // 動画の角丸を解除 2025.09
  GM.addStyle('.ytThumbnailViewModelMedium { border-radius: 0 !important; }') // 動画の角丸を解除 2025.09
  // トップ普通動画
  HOME_THUMBNAIL_VIDEOS_SIZE && GM.addStyle(`ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid.grid-disabled  ytd-rich-item-renderer[rendered-from-rich-grid]{${HOME_THUMBNAIL_VIDEOS_SIZE}}`) // 2025.04.23
  // トップshort
  //HOME_THUMBNAIL_SHORTS_SIZE && GM.addStyle(`div.shortsLockupViewModelHostThumbnailContainer{max-width:18em;}  `)
  HOME_THUMBNAIL_SHORTS_SIZE && GM.addStyle(`div.style-scope.ytd-rich-shelf-renderer:nth-child(2 of div.style-scope.ytd-rich-shelf-renderer) > div.style-scope > ytd-rich-item-renderer.style-scope[class*="ytd-rich-shelf-renderer"]{${HOME_THUMBNAIL_SHORTS_SIZE}`)
  /*SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH && GM.addStyle(`.yt-lockup-view-model-wiz__content-image {max-width: ${SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH*1.9}em !important;}
            ytd-search ytd-video-renderer ytd-thumbnail.ytd-video-renderer,ytd-search ytd-playlist-thumbnail,div#avatar-section.style-scope.ytd-channel-renderer{max-width: ${SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH}em !important;}`);
  */

  SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH && GM.addStyle(`.yt-lockup-view-model-wiz__content-image , yt-collection-thumbnail-view-model , a.yt-lockup-view-model__content-image {max-width: ${SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH*1.9}em !important;}
          ytd-search ytd-video-renderer ytd-thumbnail.ytd-video-renderer,ytd-search ytd-playlist-thumbnail,div#avatar-section.style-scope.ytd-channel-renderer {max-width: ${SEARCH_RESULTS_THUMBNAIL_VIDEOS_WIDTH}em !important;}`);


  SEARCH_RESULTS_THUMBNAIL_SHORTS_HEIGHT && GM.addStyle(`.yt-lockup-view-model-wiz__content-image , ytd-search .yt-horizontal-list-renderer .yt-core-image--content-mode-scale-aspect-fill { object-fit: contain; }
         .yt-lockup-view-model-wiz__content-image , ytd-search .yt-horizontal-list-renderer ytd-thumbnail.ytd-reel-item-renderer{max-height:${SEARCH_RESULTS_THUMBNAIL_SHORTS_HEIGHT}em !important;}`);
  CHANNEL_THUMBNAIL_VIDEO_SIZE && GM.addStyle(`ytd-rich-item-renderer[rendered-from-rich-grid] { ${CHANNEL_THUMBNAIL_VIDEO_SIZE} }`)

  // 2025.06-の自動的に追加されるミックスリストをURLから除去（実験的）　2:1+1の処理を視覚的に報告　3:notifyでverbose　0:無効
  const removeAutoPlaylist = () => {
    elegeta('a[href*="&list=RD"]:not(:is(#container.style-scope.ytd-playlist-panel-renderer , .yt-lockup-view-model-wiz--collection-stack-2) a[href*="&list=RD"])').forEach(e => {
      e.href = e.href.replace(/(\&list=RD[^&]+)/, "").replace(/(\&start_radio=\d+)/, "");
      EXPERIMENTAL_REMOVE_AUTOMATICALLY_ADDED_MIXLIST202506 >= 2 && e?.animate([{ outline: `6px dashed #888`, boxShadow: `0 0 0px 9px #aaa8` }, { outline: `2px dotted #fff`, boxShadow: `0 0 0em 12px #fff0` }], 1555);
    })
  }
  EXPERIMENTAL_REMOVE_AUTOMATICALLY_ADDED_MIXLIST202506 && document.addEventListener("mousedown", e => {
    removeAutoPlaylist();
    EXPERIMENTAL_REMOVE_AUTOMATICALLY_ADDED_MIXLIST202506 >= 3 && notify(new Date().toLocaleString("ja-JP"));
  }, true);

  async function makeDrawTarget(container, target) {
    container.scrollTop = Math.max(0, target.offsetTop + target.offsetHeight / 2 - container.clientHeight / 2);
    await sleep(17)
  }

  // プレイリストの動画の合計時間を算出、全部読み込みが終わっていないとしない
  function gettotal(max = 99999, force = 0) {
    let playlistItem = elegeta('ytd-playlist-panel-video-renderer#playlist-items.style-scope.ytd-playlist-panel-renderer:visible').slice(0, max)
    let playlistItemLen = playlistItem.length
    if (playlistItemLen) {

      let palylistTime = elegeta('ytd-playlist-panel-video-renderer#playlist-items.style-scope.ytd-playlist-panel-renderer div.ytd-thumbnail-overlay-time-status-renderer:visible').slice(0, max)
      if (palylistTime?.length == playlistItemLen) {
        let sum = palylistTime.reduce((p, e) => {
          let t = e?.innerText?.trim()
          let h = t?.match0(/(\d+)\:\d+\:\d+$/) || 0
          let m = t?.match0(/(\d+)\:\d+$/) || 0
          let s = t?.match0(/(\d+)$/) || 0
          p += h * 60 * 60 + m * 60 + s * 1
          return p
        }, 0)
        let total = `${zeropad(2,sum/60/60|0)}:${zeropad(2,sum/60%60|0)}:${zeropad(2,sum%60)}`
        return total;
      }

      DISPLAY_TOTAL_TIME_OF_PLAYLIST == 2 && force && (async () => {
        let container = eleget0('div#items.playlist-items.style-scope.ytd-playlist-panel-renderer:visible')
        const scrollPos = container.scrollTop;
        for (e of elegeta('ytd-playlist-panel-video-renderer#playlist-items.style-scope.ytd-playlist-panel-renderer')) {
          await makeDrawTarget(eleget0('div#items.playlist-items.style-scope.ytd-playlist-panel-renderer:visible'), e)
        }
        container.scrollTop = scrollPos;
      })()
    }
    return "";
  }
  if (DISPLAY_TOTAL_TIME_OF_PLAYLIST) {
    setInterval(() => {
      if (document.visibilityState != "visible") return;
      if (!GF.time && lh(/^https:\/\/www\.youtube\.com\/watch\?v=.*\&list\=/)) { //&& document?.getElementById('playlist')) {
        let total = gettotal()
        if (total) {
          eleget0('div#publisher-container.style-scope.ytd-playlist-panel-renderer:visible').insertAdjacentHTML("beforeend", `<div id="playlisttotaltime" style='margin: auto auto auto 1em; font-size: 1.3rem; font-weight: 400; color: var(--yt-spec-text-secondary); font-family: "Roboto","Arial",sans-serif;'>${total}</div>`);
          GF.time = 1;
        }
      }
    }, 6000);
  }

  ael(window, "yt-navigate-finish yt-playlist-data-updated", e => {
    GF.time = 0;
    $('#playlisttotaltime').remove()
  })

  function zeropad(pad, num) {
    return String(num)?.padStart(pad, "0")
  }

  // Enhancer for YouTubeのミニプレイヤーをカーソルを避けるようにする
  GF.avoidminiplayer = 0
  let css = '#efyt-progress,body.efyt-mini-player._top-right #movie_player:not(.ytp-fullscreen),body.efyt-mini-player._bottom-right #movie_player:not(.ytp-fullscreen){left:1em !important; right:auto !important;}'
  document.addEventListener("mousemove", e => {
    if (!e?.target instanceof Element || e?.target === document) return;
    //    if (GF.avoidminiplayer && !e?.target?.closest('ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy')) {
    if (GF.avoidminiplayer && mousex < clientWidth() / 1.5) { //!e?.target?.closest('ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy')) {
      GF.avoidminiplayer = 0
      addstyle.remove(css)
      return;
    } else if (!GF.avoidminiplayer && mousex >= clientWidth() / 1.5) { //&& e?.target?.closest('ytd-watch-next-secondary-results-renderer.style-scope.ytd-watch-flexy')) { // .closestの方が:hoverより40倍ぐらい速い
      addstyle.add(css)
      GF.avoidminiplayer = 1
    }
  })

  //URLの変化を監視
  var href = location.href;
  var observer = new MutationObserver(function(mutations) {
    if (href !== location.href) {
      href = location.href;
      $('#playAllButton , #instantPlaylistButton').remove();
      //elegeta('#playAllButton , #instantPlaylistButton').forEach(e => e?.remove());
      elegeta('.yzqAttract , .yzqAttract2').forEach(e => e.classList.remove("yzqAttract"))
      clearInterval(GF?.hideShort);
      clearInterval(GF?.playAllCount)
      GF.wari = 0
      GF.sousa = Date.now()
      vid = new WeakMap();
      setTimeout(() => {
        GF.lastinner = "";
        run()
      }, 1500);
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  setTimeout(() => { run(); }, 1009);

  if (HIDE_DUPLICATED_VIDEO_IN_SEARCH_RESULTS) {
    setInterval(() => {
      if (lh(/^https:\/\/www\.youtube\.com\/results\?search_query=|^https:\/\/www\.youtube\.com\/feed\/trending|^https:\/\/www\.youtube\.com\/$/)) {
        let videos = elegeta(`${IPBOX}:visible`)
        //        let removesForTitle= HIDE_BASED_ON_TEXT? videos.filter(e=>e?.textContent?.match(HIDE_BASED_ON_TEXT)) : [];
        //        duplicatedVideo(videos)?.[1]?.concat(removesForTitle)?.forEach(e => {
        duplicatedVideo(videos)?.[1]?.forEach(e => {
          if (HIDE_DUPLICATED_VIDEO_IN_SEARCH_RESULTS == 2) e?.remove();
          else {
            let s = getComputedStyle(e);
            e.animate([{ transformOrigin: 'top left', transform: (s.transform === 'none' ? '' : s.transform || "") || 'scale(1)', opacity: 1, height: e.offsetHeight + 'px', width: e.offsetWidth + 'px' }, { transformOrigin: 'top left', transform: (s.transform === 'none' ? '' : s.transform || "") + 'scale(0)', opacity: 0, height: '0px', width: '0px' }], { duration: 999, easing: 'ease', fill: 'none' }).onfinish = () => e?.remove(); //e.style.display = 'none';
          }
        })
      }
    }, 3500)
  }

  //  HIDE_SUGGEST && GM.addStyle(`ytd-search ytd-shelf-renderer,ytd-search ytd-horizontal-card-list-renderer{display:none !important;}`)
  //  HIDE_SUGGEST && GM.addStyle(`ytd-search ytd-shelf-renderer,ytd-search ytd-horizontal-card-list-renderer , div#contents.style-scope.ytd-item-section-renderer.style-scope.ytd-item-section-renderer:has( ytd-ad-slot-renderer.style-scope){display:none !important;}`)
  HIDE_SUGGEST && GM.addStyle(`ytd-search ytd-shelf-renderer,ytd-search ytd-horizontal-card-list-renderer , div#fulfilled-layout.style-scope.ytd-ad-slot-renderer {display:none !important;}`)

  if (AGREE_TO_CONTINUE_ALWAYS) {
    setInterval(() => {
      if (!lh(/youtube\.com\/watch\?v=/)) return;
      if (eleget0('YTD-APP YTD-POPUP-CONTAINER TP-YT-PAPER-DIALOG YT-CONFIRM-DIALOG-RENDERER DIV TP-YT-PAPER-DIALOG-SCROLLABLE DIV YT-FORMATTED-STRING:visible:text*=動画が一時停止されました。続きを視聴しますか|Video paused. Continue watching')) {
        eleget0('//ytd-app/ytd-popup-container/tp-yt-paper-dialog[@style-target="host"]/yt-confirm-dialog-renderer/div[last()]/div[contains(@class,"buttons style-scope yt-confirm-dialog-renderer")]/yt-button-renderer[3]/yt-button-shape/button[@aria-label="Yes" or @aria-label="はい"]/yt-touch-feedback-shape/div[contains(@class,"yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response")]/div[last()]:visible')?.click()
      }
    }, 3001)
  }

  var mousex = 0;
  var mousey = 0;
  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  /*
    if (location.href.match0(/nicovideo/)) {
      // ニコ動
      document.addEventListener('keydown', e => {
        if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA' && e.target.getAttribute('contenteditable') != 'true') {
          var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
          if (key === "e" && location.href.match0(/nicovideo/)) { // e::enqueue
            e.preventDefault();
            var ele = document.elementFromPoint(mousex, mousey);
            var ancestorEle = getTitleFromParent(ele, 0, '//div[3]/ul[@class="list" and @data-video-list=""]/li[@data-nicoad-video=""]');
            if (!ancestorEle) return false
            let titleEle = eleget0('.//p[@class="itemTitle"]/a', ancestorEle);
            if (!titleEle) return false
            myqueue.push({ id: titleEle.href.replace(/^.+\/watch\/|\?.+/gmi, ""), title: titleEle.innerText.trim() })
            myqueue = Array.from(new Set(myqueue.map(a => JSON.stringify(a)))).map(a => JSON.parse(a));
            popup(`e:『${titleEle.textContent}』をキューに入れました（y：再生）\n${myqueue.map((c,i)=>`${1+i}) ${c.title} <span style="float:right">(${c.id})</span>`).join("\n")}`)
            return false;
          }
          if (key === "y" && !/\/watch/.test(location.href)) { // y::start playing
            e.preventDefault();
            var url = `${myqueue.map(c=>c.id).join(",")}を連続再生するURLがありません`
            alert(url)
            return false;
          }
        }
      }, false)
      return
    }
  */

  // youtube検索結果画面で「ショート」や「他の人はこちらも視聴しています」類の見出しをクリックでその動画を隠したり出したり
  GM.addStyle('h2.style-scope.ytd-reel-shelf-renderer,h2.style-scope.ytd-shelf-renderer,div#title-text.style-scope.ytd-rich-list-header-renderer , h2.style-scope.ytd-rich-shelf-renderer , h2.yt-shelf-header-layout__title {cursor:pointer;}')
  setTimeout(() => elegeta('h2.style-scope.ytd-reel-shelf-renderer,h2.style-scope.ytd-shelf-renderer,div#title-text.style-scope.ytd-rich-list-header-renderer , h2.style-scope.ytd-rich-shelf-renderer , h2.yt-shelf-header-layout__title').forEach(e => e.setAttribute("title", `左クリックでこの棚だけ隠す\nCtrl+左クリックでこの種の棚をすべて隠す`)), 3000)
  GM.addStyle('.hiddenInstance {text-decoration:underline overline line-through;}')
  GM.addStyle('.zenqhidevideo {display:none !important; transition:all 0.5s;}')
  let hiddenTitle = new Set()
  document.addEventListener("mousedown", e => {
    //    if (e.button === 0 && lh(/^https:\/\/www\.youtube\.com\/results\?search_query|^https:\/\/www\.youtube\.com\/$/) && (e?.target?.matches('h2.style-scope.ytd-rich-shelf-renderer , h2.style-scope.ytd-reel-shelf-renderer') || e?.target?.closest('h2.style-scope.ytd-reel-shelf-renderer,h2.style-scope.ytd-shelf-renderer,div#title-text.style-scope.ytd-rich-list-header-renderer , yt-section-header-view-model'))) {alert(2)
    if (e.button === 0 && lh(/^https:\/\/www\.youtube\.com\/results\?search_query|^https:\/\/www\.youtube\.com\/$/) && (e?.target?.closest('h2.style-scope.ytd-rich-shelf-renderer , h2.style-scope.ytd-reel-shelf-renderer') || e?.target?.closest('h2.style-scope.ytd-reel-shelf-renderer,h2.style-scope.ytd-shelf-renderer,div#title-text.style-scope.ytd-rich-list-header-renderer , yt-section-header-view-model'))) {
      e.preventDefault();
      e.stopPropagation();
      if (e?.ctrlKey) { // Ctrl+左クリック：棚とショートをすべて消す
        GF.wari = 1 - (GF?.wari || 0);
        popupCenter(`Shorts棚を${GF.wari?"すべて隠します":"表示します"}`, !GF.wari ? "#888" : "#35a")
        //let css = `:is(ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer , grid-shelf-view-model , div#scroll-outer-container.style-scope.yt-horizontal-list-renderer)   :is(div#contents.style-scope.ytd-reel-shelf-renderer , ytd-vertical-list-renderer.style-scope.ytd-shelf-renderer , div#items.style-scope.ytd-horizontal-card-list-renderer , div.ytGridShelfViewModelGridShelfItem) {display:none !important; }
        let css = `:is(ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer , grid-shelf-view-model , div#scroll-outer-container.style-scope.yt-horizontal-list-renderer , ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer)
                  :is(div#contents.style-scope.ytd-reel-shelf-renderer , ytd-vertical-list-renderer.style-scope.ytd-shelf-renderer , div#items.style-scope.ytd-horizontal-card-list-renderer , div.ytGridShelfViewModelGridShelfItem , ytd-rich-item-renderer.style-scope.ytd-rich-shelf-renderer)
                  {display:none !important; }
                    h2.style-scope.ytd-reel-shelf-renderer , h2.style-scope.ytd-shelf-renderer , div#title-text.style-scope.ytd-rich-list-header-renderer , yt-section-header-view-model , ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer , h2.yt-shelf-header-layout__title {opacity:0.5;}`
        GF.wari ? addstyle.add(css) : addstyle.remove(css);
      } else { // 左クリック：その棚だけ隠したり出したり
        let reelinner = e?.target?.closest('ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer,ytd-shelf-renderer.style-scope.ytd-item-section-renderer,ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer , grid-shelf-view-model , ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer')?.querySelector('div#contents.style-scope.ytd-reel-shelf-renderer,ytd-vertical-list-renderer.style-scope.ytd-shelf-renderer,div#items.style-scope.ytd-horizontal-card-list-renderer,div#scroll-outer-container.style-scope.yt-horizontal-list-renderer , grid-shelf-view-model.ytGridShelfViewModelHost[class*="ytd-item-section-renderer"] > div , div#contents-container.style-scope.ytd-rich-shelf-renderer')
        if (!hiddenTitle.has(e.target)) { //.dataset.hide=((e.target?.dataset?.hide||0)+1)%2;alert(e.target.dataset.hide);
          hiddenTitle.add(e.target);
          $(reelinner).hide(111)
        } else {
          hiddenTitle.delete(e.target);
          $(reelinner).show(111) //toggleClass("hiddenInnerInstance").toggle(111)
        }
        $(e?.target?.closest('span#title , yt-formatted-string#title.style-scope.ytd-rich-list-header-renderer , h2.shelf-header-layout-wiz__titl , h2.yt-shelf-header-layout__titlee , h2.yt-shelf-header-layout__title')).toggleClass("hiddenInstance")
      }
      return false;
    }
  })
  document.addEventListener("dblclick", e => {
    if (e.button === 0 && lh(/^https:\/\/www\.youtube\.com\//) && !lh(/^https:\/\/www\.youtube\.com\/watch/) && e?.target?.matches('div#container.style-scope.ytd-search , div#container.style-scope.ytd-masthead , div#contentContainer.style-scope.tp-yt-app-drawer , div#guide-content.style-scope.ytd-app , ytd-two-column-search-results-renderer.style-scope.ytd-search')) {
      e.preventDefault();
      e.stopPropagation();
      hideShelfShort()
      return false;
    }
  })

  function hideShelfShort() {
    GF.wari = 1 - (GF?.wari || 0);
    popupCenter(`Shorts動画とShorts棚を${GF.wari?"すべて隠します":"表示します"}`, !GF.wari ? "#888" : "#35a")
    let css = `:is(ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-shelf-renderer.style-scope.ytd-item-section-renderer , ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer , grid-shelf-view-model , div#scroll-outer-container.style-scope.yt-horizontal-list-renderer)   :is(div#contents.style-scope.ytd-reel-shelf-renderer , ytd-vertical-list-renderer.style-scope.ytd-shelf-renderer , div#items.style-scope.ytd-horizontal-card-list-renderer , div.ytGridShelfViewModelGridShelfItem) {display:none !important; }
                    h2.style-scope.ytd-reel-shelf-renderer , h2.style-scope.ytd-shelf-renderer , div#title-text.style-scope.ytd-rich-list-header-renderer , yt-section-header-view-model {opacity:0.5;}`
    GF.wari ? addstyle.add(css) : addstyle.remove(css);

    if (GF.wari) {
      clearInterval(GF.hideShort);
      GF.hideShort = setInterval(() => {
        if (document.visibilityState != "visible" || lh("/watch")) return;
        elegeta(':is(ytd-video-renderer.style-scope.ytd-item-section-renderer , ytd-rich-item-renderer):not(.zenqhidevideo)').filter(e => eleget0('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]', e))
          .concat(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-shelf-renderer'))
          .forEach(e => {
            (GF.wari) ? e.classList.add('zenqhidevideo'): e.classList.remove('zenqhidevideo');
          });
      }, 999);
    } else {
      clearInterval(GF.hideShort);
      elegeta(':is(ytd-video-renderer.style-scope.ytd-item-section-renderer , ytd-rich-item-renderer)').filter(e => eleget0('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]', e))
        .concat(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-shelf-renderer'))
        .forEach(e => {
          (GF.wari) ? e.classList.add('zenqhidevideo'): e.classList.remove('zenqhidevideo');
        });
    }

  }
  hoverHelp(e => e?.matches('h2.style-scope.ytd-reel-shelf-renderer') || e?.closest('h2.style-scope.ytd-reel-shelf-renderer,h2.style-scope.ytd-shelf-renderer,div#title-text.style-scope.ytd-rich-list-header-renderer') ? "クリック：隠す／再表示<br>Ctrl+クリック：この類の棚をすべて隠す／再表示" : "")

  function hoverHelp(cb) {
    let latest, helpEle;
    document.addEventListener("mousemove", e => {
      if (!e?.target || !e?.target instanceof Element) return;
      if (latest != e?.target) {
        helpEle?.remove()
        const text = cb(e.target)
        if (text) helpEle = end(document.body, `<div id="hoverHelpPopup" style="z-index:999999999; bottom:1em; right:1em; position:fixed; background-color:#ffffffe0; padding:1px 0.5em; border:1px solid #505050; font-size:15px; color:#505050; border-radius:0.75em;">${text}</div>`)
        latest = e.target
        if (document.elementFromPoint(e.clientX, e.clientY) == helpEle && helpEle) {
          helpEle.style.bottom = "";
          helpEle.style.top = "1em";
        }
      }
    })
  }

  GM.addStyle('.boxatt{ background-color:#efe !important; animation: pulse 1s 1; } @keyframes pulse { 0% { box-shadow: 0 0 0 0 #00ff88f0; } 100% { box-shadow: 0 0 10px 35px #ffffff00; } } .yenClickHighlight {outline: rgba(0, 255,128,0.7) solid 4px !important; }')

  function boxatt(e) {
    [e].flat().forEach(v => {
      v.classList.add("boxatt")
      setTimeout(() => v.classList.remove("boxatt"), 1000)
    })
  }

  document.addEventListener('keydown', async e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;

    if (key === "Escape" && CLOSE_MINI_PLAYER_ALWAYS) { // esc::ミニプレイヤーを常に閉じる
      for (let i = 0; i < 20; i++) {
        setTimeout(() => { elegeta('tp-yt-paper-dialog .yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap:visible').filter(e => /プレーヤーを閉じる/.test(e.textContent)).forEach(e => e?.click()) }, i * 200)
        equeue = []
      }
    }

    if (key === "e") { // e::enqueue
      e.preventDefault();
      // まずIPに入れる
      var ele = document.elementFromPoint(mousex, mousey);
      var box = eleget0(`${IPBOX}:hover`)

      if (box && USE_INSTANT_PLAYLIST) { //IP先頭用に独自キューを覚えておく
        var href = eleget0(':is(a[href*="/watch"],a[href*="/shorts/"])', box)?.href;
        var vID = href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/);
        if (vID) {
          equeueIP.push(vID)
          equeueIP = [...new Set(equeueIP)]
          equeue.push(vID)
          equeue = [...new Set(equeue)]
          eleget0('#instantPlaylistButton').innerHTML = `Instant<BR>Playlist (${equeueIP.length}+)`;
          if (USE_INSTANT_PLAYLIST) boxatt([box, eleget0('#instantPlaylistButton')])
          //[box, eleget0('#instantPlaylistButton')].forEach(e => e?.animate([{ backgroundColor: "#0022ff22", boxShadow: " 0 0 0 0 #0022ff88" }, { backgroundColor: "#0022ff00", boxShadow: "0 0 10px 35px #0022ff00" }], 999))
        }
      }

      // PAに入れる
      var ancestorEle = eleget0(`${QBOX}:hover`)
      if (!ancestorEle) return false
      let menuButton = eleget0(MENUBUTTON, ancestorEle) // …ボタン
      if (menuButton && USE_PLAYALL) {
        menuButton?.click() //setTimeout(() => { menuButton?.click() }, 0);

        await clickQB(() => QB(ancestorEle), () => QB(ancestorEle)?.click(), 3000);
        //setTimeout(() => alert(QB(ancestorEle))+QB(ancestorEle)?.click(), 400) // 2025.03なんかこれあると二重に入るようになったので消す
        if (!USE_INSTANT_PLAYLIST) boxatt([ancestorEle])
        //[!USE_INSTANT_PLAYLIST ? ancestorEle : menuButton, eleget0('span#playAllButton')].forEach(e => e.animate([{ backgroundColor: "#8800ff22", boxShadow: " 0 0 0 0 #8800ff88" }, { backgroundColor: "#8800ff00", boxShadow: "0 0 10px 35px #8800ff00" }], 999))
      }
      return false;
    }

    if (key === "y" && !/\/watch/.test(location.href)) { // y::start playing
      e.preventDefault();
      cli('//div[contains(@class,"ytp-miniplayer-play-button-container")]/button|//button[contains(@class,"ytp-play-button-playlist")]')
      if (!(location.href.match(/\/watch\?v=/))) cli('//div/button[contains(@class,"ytp-miniplayer-expand-watch-page-button")]:visible', 111, "infinity");
      setTimeout(() => { let e = eleget0('//video'); if (e) { e.play(); } }, 222);
      return false;
    }
    if (/^Alt\+c$|^Ctrl\+x$/.test(key) && /\/watch/.test(location.href) && USE_INSTANT_PLAYLIST) { // Alt+c:: Ctrl+x:: 視聴中の再生リストをURLにしてコピー
      e.preventDefault();
      makeUrlFromQueuelist(1, kaisuu)
      kaisuu = ++kaisuu % YOUTUBE_WATCH_ALTC_VARIATIONS;
    }
  }, false);


  //タイムスタンプをAlt+左クリック（または右クリック）で上にスクロールせずに再生位置を移動
  ael(document, "click contextmenu", function(e) {
    let ele = eleget0('div#time', e?.target?.closest('a#endpoint')) || (e?.target?.matches('a.yt-core-attributed-string__link.yt-core-attributed-string__link--call-to-action-color') && e?.target);
    if (!((e?.type == "contextmenu" || e?.altKey) && /^[0-9\:]+$/.test(ele?.textContent?.trim()))) return;
    let sec = ele?.textContent?.trim()?.split(':')?.reverse()?.reduce((a, b, i) => a + (b * ([1, 60, 3600, 86400][i])), 0);
    let ve = eleget0(`video`);
    if (sec && ve) {
      ve.currentTime = sec;
      ve?.play();
      ele?.animate([{ outline: "4px solid #065fd4" }, { outline: "4px solid #065fd400" }], 666)
      //e.preventDefault() + e.stopPropagation() + e.stopImmediatePropagation();return false;
    }
  }, true);

  return;

  function makeUrlFromQueuelist(disp = 1, kaisuu) { // disp:1:表示する 0:urlを作って返すだけ
    if (/\/watch/.test(location.href) && USE_INSTANT_PLAYLIST) { // Alt+c::視聴中の再生リストをURLにしてコピー
      let eles = elegeta('//ytd-playlist-panel-video-renderer[@id="playlist-items"]/a:visible').filter(e => e?.closest('ytd-playlist-panel-video-renderer')?.style?.opacity != 0.5);
      let videoIDa = [...new Set(eles.map(c => c.href.match0(/\?v=([a-zA-Z0-9_\-]{11})/)))].slice(0, 50); // 重複削除
      let videoIDaAll = [...new Set(eles.map(c => c.href.match0(/\?v=([a-zA-Z0-9_\-]{11})/)))]; // 重複削除
      if (eles.length) {
        let indexEle = eleget0('//yt-formatted-string[@class="index-message style-scope ytd-playlist-panel-renderer"]/span[1]|//div/div[@id="secondary-inner" and @class="style-scope ytd-watch-flexy"]/ytd-playlist-panel-renderer[@id="playlist" and @class="style-scope ytd-watch-flexy" and @js-panel-height="" and @collapsible="" and @playlist-type="TLPQ"]/div/div[1]/div[@id="header-contents"]/div[@id="header-top-row" and contains(@class,"style-scope ytd-playlist-panel-renderer")]/div[@id="header-description"]/div/div/span:visible');
        let indexNo = indexEle && indexEle.textContent ? indexEle.textContent.match0(/(\d+)/mi) - 1 : 0;
        let indexUrlQP = (PRESERVE_INDEX && indexNo > 0 && indexNo < 50) ? `&index=${indexNo}` : "";
        elegeta("#link4bm").forEach(e => e.remove())
        if (kaisuu == 0 || kaisuu == 2 || disp == 0) {
          // プレイリストの動画の合計時間を算出、全部読み込みが終わっていないとしない
          let playtimesum = gettotal(50, 1)
          playtimesum = playtimesum ? " " + playtimesum : ""
          let pl = location.href.match0(/\&list=((?:PL|UU)[a-zA-Z0-9_\-]+)/); //let pl = location.href.match0(/\&list=((?:PL|UU|UL)[a-zA-Z0-9_\-]+)/);
          var cb = kaisuu == 2 ? `<div>\n<a rel="noopener noreferrer" href="${IPURL}${ (videoIDaAll?.slice(0,50)?.join(","))}">${sani(eleget0('span#video-title.style-scope.ytd-playlist-panel-video-renderer')?.textContent?.replace(/\n/gm," ")?.trim())} - YouTube (${videoIDa?.length})${playtimesum?playtimesum:""} / ${sani(eleget0('span#byline.style-scope.ytd-playlist-panel-video-renderer')?.textContent)}</a><br>\n<iframe referrerpolicy="${YT_REFERRER}" src="https://www.youtube.com/embed/${videoIDa[0]}?playlist=${ videoIDa.join(",")}" id="ytplayer" type="text/html" allowfullscreen allow="picture-in-picture" ${YOUTUBE_WATCH_ALTC_EMBED_PLAYER_SIZE} frameborder="0"></iframe>\n</div>\n\n` +
            (pl ? `<div>\n<a rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${location?.href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/)||""}&list=${pl}">${sani(eleget0('yt-formatted-string.title.style-scope.ytd-playlist-panel-renderer.complex-string')?.textContent?.replace(/\s+|\n/gm," ")?.trim()||"")}</a><br>\n<iframe referrerpolicy="${YT_REFERRER}" src="https://www.youtube.com/embed/${location?.href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/)||""}?listType=playlist&list=${pl}" id="ytplayer" type="text/html" allowfullscreen allow="picture-in-picture" ${YOUTUBE_WATCH_ALTC_EMBED_PLAYER_SIZE} frameborder="0"></iframe>\n</div>` : "") :
            `${IPURL}${videoIDa.join(",") + indexUrlQP}`; // h181px~:hd thumbnail　+ "&cc_load_policy=1&cc_lang_pref=jpn"
          var cb2 = cb
          var cbEsc = (cb2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

          var enumText = ``; // 50件ごとに分割（使わない）
          for (let u = 0; u < videoIDaAll.length / 50; u++) {
            enumText += `▶ ${u*50+1}/${videoIDaAll.length} ${videoIDaAll.slice(u*50,u*50+3).join(",")+(videoIDaAll.slice(u*50,u*50+50).length>3?",…":"")}\n${IPURL}${ (videoIDaAll.slice(u*50, u*50+50).join(",") ) }\n`
          }

          let transratedTitle = (eleget0('//h1[@class=\"title style-scope ytd-video-primary-info-renderer\"]/yt-formatted-string/font/font|//div[@id=\"title\" and contains(@class,\"style-scope ytd-watch-metadata\")]/h1/yt-formatted-string/font/font')?.innerText?.replace(/(?!= - YouTube)$/, " - YouTube")) || document.title
          var uploader = eleget0('div.ytd-channel-name > yt-formatted-string.ytd-channel-name.complex-string[dir="auto"] > a.yt-formatted-string')?.textContent?.trim() || ""
          if (!PRESERVE_INDEX) {
            let firstVideo = eleget0('ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer:nth-child(1) > a.yt-simple-endpoint > div#container.ytd-playlist-panel-video-renderer > div.editable:last-child > h4 > span.style-scope')?.textContent?.trim()
            transratedTitle = firstVideo ? firstVideo + " - YouTube" : transratedTitle;
            var uploader = eleget0('//div[@id="items" and @class="playlist-items style-scope ytd-playlist-panel-renderer"]/ytd-playlist-panel-video-renderer[1]/a[contains(@class,"yt-simple-endpoint style-scope ytd-playlist-panel-video-renderer")]/div[@id="container"]/div[@id="meta"]/div[@id="byline-container"]/span')?.textContent?.trim() || ""
          }
          let desc = indexNo !== 0 ? "" : sani((eleget0('ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata')?.innerText || "")?.replace(/\n+|\s+/gm, " ")?.slice(0, 60)?.trim())
          if (desc) desc = ` - ${desc}`
          let plTitles = elegeta('span#video-title.style-scope.ytd-playlist-panel-video-renderer').map(e => e?.textContent?.replace(/　+|\s+/g, " ")?.trim() || "")
          //          var title = `▶ ${PRESERVE_INDEX?indexNo+1:1}/${videoIDa.length} ${transratedTitle} - ${uploader}${desc}`;
          //          var title = `▶ ${PRESERVE_INDEX?indexNo+1:1}/${videoIDa.length} ${PRESERVE_INDEX?transratedTitle : plTitles[0]} - ${uploader} / ${plTitles.slice(1).join(" / ")}`.slice(0,9999);
          var title = `▶ ${PRESERVE_INDEX?indexNo+1:1}/${videoIDa.length} ${PRESERVE_INDEX?transratedTitle : plTitles[0]} - ${uploader}` // / ${plTitles.slice(1).join(" / ")}`.slice(0,9999);
          if (disp) {
            if (videoIDaAll.length <= 50) {
              popup(kaisuu == 2 ? cb : transratedTitle + "\n" + cb, kaisuu == 2 ? "#822" : undefined, "right:0em; top:0em;max-width:40%;")
              GM.setClipboard(kaisuu == 2 ? cb : transratedTitle + "\n" + cb2 + "\n");
            } else {
              popup(kaisuu == 2 ? cb : transratedTitle + "\n" + enumText, kaisuu == 2 ? "#822" : undefined, "right:0em; top:0em;max-width:40%;")
              GM.setClipboard(kaisuu == 2 ? cb : transratedTitle + "\n" + enumText + "\n");
            }
            if (kaisuu != 2) $(`<div style="margin-left:4em; font-size:14px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;" id="link4bm">${kaisuu==2?"埋め込み":"ブックマーク"}用リンク（${videoIDa.length}）${playtimesum}<br><a href=${cb}>${title}</a></div>`).hide(0).insertAfter($('#logo')).on("click", () => pauseVideo()).show(150).delay(9999).hide(250, function() { $(this).remove() })
          }
        } else if (kaisuu == 1) { // ただの列挙
          list = [...new Set(elegeta('//h4[@class=\"style-scope ytd-playlist-panel-video-renderer\"]/span[@id=\"video-title\"]:visible').filter(e => e?.closest('ytd-playlist-panel-video-renderer')?.style?.opacity != 0.5).map(e => { return e.textContent.trim() + " - YouTube\n" + e.closest('a').href.trim().replace(/&.*/, "") + "\n" }).map(a => JSON.stringify(a)))].map(a => JSON.parse(a)) //.join("")
          if (disp) {
            popup(list.join(""), "#303060") //popup(`(${list?.length})\n`+list.join(""), "#303060")
            GM.setClipboard(list.join("") + "");
          }
          return list
        }

      }
      return cb
    } else { //キューやプレイリスト再生状態ではない
      return;
    }
  }

  function urlExtractAndConcat(option = "", ini = "", inilen = 0) { // url Extract & Concat
    let cb = ini || makeUrlFromQueuelist(0)
    var inp = prompt(`${option=="shuffle"?"<シャッフル>\n\n":""}url Extract & Concat:\n複数のYouTubeの動画URLから連続再生URLを作ってクリップボードにコピーします\nYouTubeの動画URLを何行でも貼り付けてください\nYouTubeのURLになっていない行や文字列は全て読み飛ばされ、重複した動画は削除されます\n${ini?`\n${inilen} 個の今のページにあるYouTube動画URLが初期値として入力済みです\nこれを利用して前後に追加することも、削除して新しく入力することもできます\n\n${cb}\n`:cb?`\n今視聴中のキュー／プレイリストの動画が初期値として入力済みです\nこれを利用して前後に追加することも、削除して新しく入力することもできます\n\n${cb}\n`:""}\n対応書式：\nhttps://www.youtube.com/watch?v=動画ID\nhttps://www.youtube.com/shorts/動画ID\nhttps://youtu.be/動画ID\nhttps://www.youtube.com/watch_videos?video_ids=動画ID,動画ID,…\n\n`, cb ? ` ${cb} ` : "")
    if (inp) {
      var urlcap = [];
      inp.split(/\s/).forEach(v => { urlcap = urlcap.concat(...[...v?.matchAll(/^(?:h?t?tps?:\/\/)?(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/)([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?youtu\.be\/([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)].map(c => c.slice(1, 999))).filter(w => w) }) // 書式が混在していても登場順に収納する
      inp = null;
      if (urlcap?.length) {
        let urla = urlcap.join(",").split(",").filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)); // 動画IDは11桁
        let urllen = urla.length;
        let urla2 = [...new Set(urla)]; // 重複削除
        if (option == "shuffle") urla2 = shuffle(urla2); // シャッフル
        let urllen2 = urla2.length;
        let urla3 = [...urla2].slice(0, 50); // 50件まで
        let urlenum = urla3.join(",")
        let url = `${IPURL}${urlenum}`
        if (urla3 && urla3.length) {
          var title = `▶ (${urla3.length}) ${urla3.slice(0,3).join(",")+(urla3.length>3?",…":"")}\n`
          var enumText = ``
          var enumUrl = []
          for (let u = 0; u < urla2.length / 50; u++) {
            enumText += `▶ ${u*50+1}/${urla2.length} ${urla2.slice(u*50,u*50+3).join(",")+(urla2.slice(u*50,u*50+50).length>3?",…":"")}\n${IPURL}${ (urla2.slice(u*50, u*50+50).join(",") ) }\n`
            enumUrl.push(`${IPURL}${ (urla2.slice(u*50, u*50+50).join(",") ) }`)
          }
          let con = USE_INSTANT_PLAYLIST == 1 ? confirm(`${urllen}件の動画IDを抽出しました\n${urllen-urllen2}件の重複を削除しました\n\n下記（${urla2.length}件）をクリップボードにコピーしますか？\n\n${enumText}`) : 1;
          if (con) {
            if (ld("youtube.com") && eleget0("#logo")) $(`<div style="margin-left:4em;font-size:14px;" id="link4bm">${kaisuu==2?"埋め込み":"ブックマーク"}用リンク（${urla3.length}）<br><a title="Shift+左クリック：以下をすべて開く(${urllen2})\n\n${enumUrl.join("\n\n")}" data-urls="${escape(JS(enumUrl))}" href=${url}>${title}</a></div>`).hide(0).insertAfter($('#logo')).show(150).delay(9999).hide(250, function() { $(this).remove() })
            $('#link4bm').on("click", e => {
              if (e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                openUrls(e.target.dataset.urls)
                return [url, enumUrl, urllen2];
              }
            })
            GM.setClipboard(enumText)
            popup(enumText, undefined, "right:0em; top:0em;max-width:40%;")
            return [url, enumUrl, urllen2];
          }
        }
      }
    } else return ["", [], 0];
  }

  function openUrls(urls) {
    pauseVideo()
    var enumURLsa = JP(unescape(urls))
    enumURLsa.forEach((v, i) => { setTimeout(() => i == 0 ? GM.openInTab(v) : GM.openInTab(v, true), i * 5000) }) // Shift+左クリック

  }

  function hideSuggest() {
    if (HIDE_SUGGEST && location.href.indexOf('www.youtube.com/results?') !== -1) {
      [
        '#contents>ytd-horizontal-card-list-renderer' // 縦１列「他の人はこちらも検索」
        , 'ytd-shelf-renderer' // 縦１列「他の人はこちらも視聴しています」「あなたへのおすすめ」「～の最新の動画をお見逃しなく」「関連する検索から」
        , //`//span[text()="他の人はこちらのショート動画も視聴しています"]/ancestor::ytd-reel-shelf-renderer` // 「他の人はこちらのショート動画も視聴しています」
        , `ytd-reel-shelf-renderer:text*=他の人はこちらのショート動画も視聴しています` // 「他の人はこちらのショート動画も視聴しています」
      ].forEach(xp => {
        $(elegeta(xp)).css({ "outline": "6px dashed #f00" }).hide(HIDE_SUGGEST, function() { $(this).remove() }); // 検索結果に割り込むサジェストを隠す
      });
    }
  }

  function run(node = document) {
    if (lh(/\/\/www\.youtube\.com\/(?:\?bp=.*)?$/) ||
      location.href.match(/https:\/\/www\.youtube\.com\/results\?.*(q=|search_query=)/) ||
      location.href.match(/https:\/\/www\.youtube\.com\/results\?.*(q=|search_query=)/) ||
      location.href.match(/\/\/www\.youtube\.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/search/) ||
      (location.href.match(/\/\/www\.youtube\.com\/(?:channel\/|c\/|user\/|@)[^\/]+/) && !(location.href.match("/community|/channels|/about|/playlists"))) ||
      location.href.match("//www.youtube.com/playlist") ||
      location.href.match("//www.youtube.com/hashtag/") ||
      location.href.match("//www.youtube.com/watch") ||
      location.href.match("//www.youtube.com/gaming") ||
      location.href.match("//www.youtube.com/feed/news_destination") ||
      location.href.match("//www.youtube.com/feed/trending") ||
      location.href.match("//www.youtube.com/live/")) {
      var place = eleget0('//div[@id="center" and @class="style-scope ytd-masthead"]');
      if (!place) { setTimeout(run, 2222); return }
    } else return;

    if (location.href.match("//www.youtube.com/hashtag/")) document.title = `${et('h1.dynamic-text-view-model-wiz__h1 > span')} ${et('yt-content-metadata-view-model.page-header-view-model-wiz__page-header-content-metadata')} - YouTube`;

    if (place) {
      addstyle.add(`
        .yzqAttract {
        outline:4px solid #80f8;
        background:#80f2 !important;
        }
        .yzqAttract2 {
        outline:4px solid #02f8;
        background:#02f2 !important;
        }
        .yzqAttract3 {
        opacity:0.5 !important;
        }
        `) // box-shadow:0px 0px 4px 4px #92f, inset 0 0 100px #fe2;

      // instant Playlist Button ipl::
      if (USE_INSTANT_PLAYLIST) {
        $('#instantPlaylistButton , #extractAndConcatButton').remove();
        //$('ytd-topbar-logo-renderer#logo:not([data-rcli])').on("contextmenu", () => { return false; }); // ytアイコン右クリック
        elegeta('ytd-topbar-logo-renderer#logo:not([data-rcli])').forEach(e => e?.addEventListener("contextmenu", e => {
          e?.stopPropagation();
          e?.preventDefault();
          return false;
        }, true)); // ytアイコン右クリック
        var e = eleget0('ytd-topbar-logo-renderer#logo:not([data-rcli])')
        if (e) {
          e.dataset.rcli = 1;
          e?.addEventListener("mouseup", e => {
            if (e.button != 2) return;
            if (e.ctrlKey || Date.now() - GF?.logocli > 400) { // ytロゴ右長押しかCtrl+ytロゴ右クリック
              urlExtractAndConcat("shuffle")
            } else {
              urlExtractAndConcat();
            }
            return false;
          })
          e?.addEventListener("mousedown", e => {
            if (e.button != 2) return;
            GF.logocli = Date.now()
          })
        }

        var instantPlaylistButton = after(place, `<span class="ignoreMe" style="cursor:pointer;color:var(--yt-spec-icon-active-other); text-align:center; font-size:15px;" id="instantPlaylistButton">Instant<br>Playlist${equeueIP.length?" ("+equeueIP.length+"+)":""}</span>`);
        instantPlaylistButton?.addEventListener("contextmenu", e => {
          e?.stopPropagation();
          e?.preventDefault();
          return false;
        }, true)
        instantPlaylistButton?.addEventListener("mousedown", e => {
          if (e.button == 0) openInstantPlaylist(e);
          if (e.button == 2) openInstantPlaylist(e, "shuffle");
          return false;
        });
        instantPlaylistButton?.addEventListener("mouseenter", e => {
          let vs = duplicatedVideo(elegeta(`${IPBOX}:visible`));
          vs[0].filter(e => itemIPL(e)).forEach(e => e?.classList?.add("yzqAttract2"))
          vs[1].filter(e => itemIPL(e)).forEach(e => e?.classList?.add("yzqAttract3"))
        })
        instantPlaylistButton?.addEventListener("mouseleave", e => $('.yzqAttract , .yzqAttract2 , .yzqAttract3').removeClass("yzqAttract yzqAttract2 yzqAttract3"))
        instantPlaylistButton?.addEventListener("mousemove", e => {
          var [url, len, lenmax, enumURLsa] = getUrla();
          instantPlaylistButton.title = `クリックで画面に出ている動画を限定公開プレイリストにして再生 (${len}/${lenmax})\n（右クリックだとシャッフル、Ctrl+で新しいタブで開く、Shift+で51件以上も分割して開く）\nGenerate playlist from all displayed videos and open instantly (right-click to shuffle)\n\n${enumURLsa?.join("\n\n")}`;
          //return false;
        });
      }

      // play all button pa::
      if (USE_PLAYALL) {
        $('#playAllButton').remove();
        var playAllButton = after(place, '<span class="ignoreMe" style="cursor:pointer;color:var(--yt-spec-icon-active-other); text-align:center; font-size:15px; " title="クリックで画面に出ている動画を全てキューに入れて再生（右クリックだとシャッフル）\nEnqueue all displayed videos and start playing (right-click to shuffle)\nCtrl+だと再生を始めない" id="playAllButton">Play All</span>')
        clearInterval(GF?.playAllCount)
        GF.playAllCount = setInterval(() => {
          if (Date.now() - GF?.sousa > 15000) return; // 15秒以上スクロールしてなければしない

          let qb = QBOXlen() //elegeta(`${QBOX}:visible`)
          let mb = MENUBUTTONlen() //qb.filter(e=>eleget0(`${MENUBUTTON} svg`, e)).length
          //DEBUG && $(item()).css({ "outline": "3px dotted #80f" })
          //DEBUG && $(itemWhole()).css({ "outline": "3px dotted #f0f" })
          let size = qb == mb ? mb : `${mb}/${qb}`;
          //          console.log(qb,mb,size,GF.inner, GF.lastinner, playAllButton)
          GF.inner = `Play All<br>(${size})${GF?.PAadd||""}${DEBUG ? "<br>wait:" + wait : ""}`
          if (GF.lastinner != GF.inner) {
            $('#playAllButton').remove();
            var playAllButton = after(place, `<span class="ignoreMe" style="cursor:pointer;color:var(--yt-spec-icon-active-other); text-align:center; font-size:15px; " title="クリックで画面に出ている動画を全てキューに入れて再生（右クリックだとシャッフル）\nEnqueue all displayed videos and start playing (right-click to shuffle)\nCtrl+だと再生を始めない" id="playAllButton">${GF.inner}</span>`)
            playAllButton?.addEventListener("mouseenter", e => {
              let vs = duplicatedVideo(elegeta(`${QBOX}:visible`));
              vs[0].filter(e => itemIPL(e)).forEach(e => e?.classList?.add("yzqAttract"))
              vs[1].filter(e => itemIPL(e)).forEach(e => e?.classList?.add("yzqAttract3"))
            })
            playAllButton?.addEventListener("mouseleave", e => $('.yzqAttract , .yzqAttract2 , .yzqAttract3').removeClass("yzqAttract yzqAttract2 yzqAttract3"))
            playAllButton?.addEventListener("contextmenu", e => {
              e?.stopPropagation();
              e?.preventDefault();
              return false;
            }, true)
            playAllButton.addEventListener("mousedown", e => {
              e.stopPropagation();
              e.preventDefault();
              setTimeout(() => playAll(e?.button != 0 ? "shuffle" : "", e), 20);
              return false;
            });
          }
          GF.lastinner = GF.inner;
        }, 1000);
      }

    }
  }

  function openInstantPlaylist(e, option = false) {
    requestAnimationFrame(pauseVideo);
    var [url, len, lenmax, enumURLsa] = getUrla(option)
    if (len > 0)
      if (USE_INSTANT_PLAYLIST == 2 || (USE_INSTANT_PLAYLIST == 1 && confirm(`下記を開きます。よろしいですか？` + (e.shiftKey ? `(${lenmax})\n\n${enumURLsa.join("\n\n")}` : `(${len})\n\n${url}`)))) {
        if (e.shiftKey) {
          enumURLsa.forEach((v, i) => { setTimeout(() => i == 0 ? GM.openInTab(v) : GM.openInTab(v, true), i * 5000) }) // Shift+左クリック
        } else
        if (e.ctrlKey) { GM.openInTab(url) } else { location.href = url }
      }
  }

  function debugEle(ele, col = "random", additionalInfo = "") {
    if (ele && (DEBUG || col.indexOf("forced") !== -1)) {
      if (col.indexOf("random") !== -1) col = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      //      if (col.indexOf("random") !== -1) col = '#' + ("000".map(c=>"89abcdef"[Math.random()*8]));
      //ele.style.outline = "3px dotted " + col;
      ele.style.boxShadow = " 0px 0px 4px 4px " + col + "30, inset 0 0 100px " + col + "20";
      ele.dataset.yododebugele = ""
      //ele.outerHTML+=additionalInfo;
    }
  }

  function getUrla(option) {
    let videoEle = itemIPL()
    if (videoEle.length) {
      DEBUG && videoEle.forEach(e => debugEle(e, "#8000ff")) //$(videoEle).css({"outline":"3px dotted #84f"})
      if (lh("youtube.com/playlist")) videoEle = videoEle.filter(e => !eleget0('//div/h2/span[@class="style-scope ytd-shelf-renderer" and contains(text(),"おすすめのプレイリスト")]', e.closest(`ytd-item-section-renderer`))) // プレイリスト画面の下に出るおすすめプレイリストを除外
      var videoIDa = [...new Set(videoEle.map(v => v.href.match0(/\/watch\?v=([a-zA-Z0-9_\-]{11})/) || v.href.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/) || v.href.match0(/\/live\/([a-zA-Z0-9_\-]{11})/)).filter(v => v))]
      var videoIDaMax = [...new Set([...equeueIP, ...((option === "shuffle") ? shuffle(videoIDa) : videoIDa)])]
      if (videoIDa.length) {
        videoIDa = ((option === "shuffle") ? shuffle(videoIDa) : videoIDa)
        var videoIDa = [...new Set([...equeueIP, ...videoIDa])].slice(0, 50)
        let url = `${IPURL}${videoIDa.join(",")}`

        var enumURLsa = []
        for (let u = 0; u < videoIDaMax.length / 50; u++) {
          enumURLsa.push(`${IPURL}${ (videoIDaMax.slice(u*50, u*50+50).join(",") ) }`)
        }

        return [url, videoIDa.length, videoIDaMax.length, enumURLsa]
      }
    } else return ["", 0, 0];
  }

  function pauseVideo() {
    let e = eleget0('video');
    //    if (e) { e.pause(); } else { setTimeout(pauseVideo, 17) }
    if (e) { e.pause(); } else { requestAnimationFrame(pauseVideo) }
  }

  async function playAll(option = false, ev) {
    if (WAIT_LOADING) {
      if (QBOXlen() > MENUBUTTONlen()) GF.PAadd = "<br>Wait..." //⏳
      await waitTrue(() => QBOXlen() == MENUBUTTONlen(), 20000)
      GF.PAadd = ""
    }

    pauseVideo();

    /*
    // eでQを入れた要素を重複回避のため消す
    var box = elegeta(`${QBOX}:visible`).filter(v => {
      var href = eleget0('a', v)?.href;
      var vID = href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/);
      return equeue.includes(vID)
    }).forEach(v => v.remove()); //マウスが乗っている動画の枠
*/

    let d = 0;
    let videoEle = elegeta(`${QBOX}:visible`);
    videoEle = videoEle.filter(v => elegeta(`a`, v).every(v => !equeue.includes(v?.href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || v?.href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/)))) // eでQを入れた要素を重複回避のため消す
    videoEle = uniqVideo(videoEle);
    let videoLength = videoEle.length
    let i = 0;
    let videos = (option == "shuffle" ? shuffle(videoEle) : videoEle);
    //    videos.map(e=>eleget0('a', e)?.href).map(href=>href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/)).filter(Boolean).forEach(vID=>        equeueIP = [...new Set([...equeueIP,vID])]    )
    equeueIP = [...new Set([...equeueIP, ...videos.map(e => eleget0('a', e)?.href).map(href => href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/)).filter(Boolean)])];
    $('#instantPlaylistButton').html(`Instant<BR>Playlist (${equeueIP.length}+)`)
    for (let e of videos) { //console.log(wait,videoLength)
      e?.classList?.remove("yzqAttract")
      eleget0(`${MENUBUTTON}`, e)?.click();
      await sleep(wait / 2)
      await clickQB(() => QB(e), () => QB(e)?.click(), 3000);
      await sleep(wait + (videoLength / 20))

      if (ev.ctrlKey) { //IP先頭用に独自キューを覚えておく
        var href = eleget0('a', e)?.href
        var vID = href?.match0(/\?v=([a-zA-Z0-9_\-]{11})/) || href?.match0(/\/shorts\/([a-zA-Z0-9_\-]{11})/);
        if (vID) {
          //equeueIP.push(vID)
          //equeueIP = [...new Set(equeueIP)]
          equeue.push(vID)
          equeue = [...new Set(equeue)]
          //$('#instantPlaylistButton').html(`Instant<BR>Playlist (${equeueIP.length}+)`)
        }
      }

      if ((i++) >= 199) break; // キューは200件までしか入らないので時間節約
    }
    await sleep(200 + wait) //d += 100 + wait * Math.min(7000, Math.max(2000, waitLast)) / 1000 + videoLength / 3;
    if (!(location.href.match(/\/watch\?v=/))) {
      if (!ev.ctrlKey) {
        await waitcli('//div[contains(@class,"ytp-miniplayer-play-button-container")]/button|//button[contains(@class,"ytp-play-button-playlist")]');
        await waitcli('//div/button[contains(@class,"ytp-miniplayer-expand-watch-page-button")]:visible')
        equeueIP = []
        equeue = []
      }
    } else {
      await sleep(100 + wait); //d += 100 + wait;
      eleget0('video')?.play(); //let e = eleget0('//video'); if (e) { e.play(); } //setTimeout(() => { let e = eleget0('//video'); if (e) { e.play(); } }, d);
    }
  }

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

  async function waitcli(sel) {
    await waitTrue(() => eleget0(sel))
    eleget0(sel)?.click()
  }

  function waitTrue(testfunc, timeout = 5000) {
    let interval;
    return Promise.race([new Promise(resolve => setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, timeout)), new Promise(resolve => {
      interval = setInterval(() => {
        if (testfunc()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    })]);
  }

  function duplicatedVideo(videoBoxes) {
    let uniqByVideoID = uniqVideo(videoBoxes)
    if (HIDE_BASED_ON_TEXT) uniqByVideoID = uniqByVideoID.filter(e => !e?.textContent?.match(HIDE_BASED_ON_TEXT));
    const videoBoxesDup = videoBoxes.filter(e => !uniqByVideoID.includes(e)) //.concat(removesForTitle);
    return [videoBoxes, videoBoxesDup];
  }

  function uniqVideo(videoBoxes) {
    return videoBoxes.reduce((a, b) => a.every(v => videoIDInBox2(v) != videoIDInBox2(b)) ? (a.push(b), a) : a, []);
    //test     85回実行 / 1sec ,11.764705882352942ミリ秒/１実行 ()=>{ videoBoxes.reduce((a, b) => a.every(v => vid
    //test   1590回実行 / 1sec , 0.628930817610062ミリ秒/１実行 ()=>{ videoBoxes.forEach(e=>e.dataset.vid=videoID
    //test  14989回実行 / 1sec , 0.066715591433718ミリ秒/１実行 ()=>{ videoBoxes.forEach(e => vid.set(e,videoIDInBo
    //test 676149回実行 / 1sec , 0.001478963956169ミリ秒/１実行 ()=>{ videoBoxes.filter(e=>!vid.has(e)).forEach(e =
    //test   5582回実行 / 1sec , 0.179147259046937ミリ秒/１実行 ()=>{videoBoxes.filter(e => !vid.has(e)).forEach(e => vid.set(e, videoIDInBox(e)))
    //test   4942回実行 / 1sec , 0.202342784297854ミリ秒/１実行 ()=>{videoBoxes.filter(e => !vid.has(e)).forEach(e => vid.set(e, videoIDInBox(e)));
    //test   4496回実行 / 1sec , 0.241992882562278ミリ秒/１実行 ()=>videoBoxes.reduce((a, b) => a.every(v => videoIDInBox(v)!=videoIDInBox(b)) ? (a.push
    //test   4765回実行 / 1sec , 0.209863588673662ミリ秒/１実行 ()=>videoBoxes.reduce((a, b) => a.every(v => videoIDInBox(v)!=videoIDInBox(b)) ? (a.push
    //test  21327回実行 / 1sec , 0.046880148168985ミリ秒/１実行 ()=>{const uniq = videoBoxes.reduce((a, b) => a.every(v => videoIDInBox2(v) != videoIDIn
    //test  23444回実行 / 1sec , 0.042653705852244ミリ秒/１実行 ()=>{const uniq = videoBoxes.reduce((a, b) => a.every(v => videoIDInBox2(v) != vi
  }

  function videoIDInBox2(ele) {
    let id = vid.get(ele)
    if (id) return id;
    id = elegeta(`a`, ele).reduce((a, b) => a + " " + b.href, "").match0(/(?:\/shorts\/|\?v=|\/live\/)([a-zA-Z0-9_\-]{11})/)
    vid.set(ele, id)
    return id
  }

  /*function videoIDInBox(ele) {
    return elegeta(`a`, ele).reduce((a, b) => a + " " + b.href, "").match0(/(?:\/shorts\/|\?v=)([a-zA-Z0-9_\-]{11})/)
  }*/

  function shuffle(array) {
    return array.map(a => ({ rnd: Math.random(), val: a })).sort((a, b) => a.rnd - b.rnd).map(a => a.val);
  }

  function cli(xpath, wait, mode = "", cb = null) { // mode: infinity:押せるまで監視し続ける
    setTimeout(() => {
      let ele = eleget0(xpath);
      if (ele) { ele.click(); if (cb) cb(); } else if (mode === "infinity") { cli(xpath, 17, mode) }
    }, wait);
    if (eleget0(xpath)) { return true } else { return false }
  }

  function et(x) {
    return eleget0(x)?.textContent?.trim() || "";
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = node.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return []; }
    //} catch (e) { alert(e); return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return null; }
    //    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function notifyMe(body, title = "") {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") new Notification(title, { body: body });
    else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  function getTitleFromParent(ele, nodisplay = 0, ancestorXP) { // ele要素の親の出品物タイトルを返す
    if (elegeta(ancestorXP).includes(ele)) return ele;
    for (let i = 0; i < (9); i++) {
      var ele2 = elegeta(ancestorXP, ele);
      if (ele2.length === 1) {
        return ele2[0];
      }
      if (ele === document) return;
      ele = ele.parentNode;
      if (elegeta(ancestorXP).includes(ele)) return ele
    }
    return;
  }

  function popup(text, bgcolor = "#6080ff", additionalStyle = "right:0em; top:0em;") {
    text = "" + text
    var e = document.getElementById("cccboxaq");
    var cID = rndID(11);
    if (e) { e.remove(); }
    if (mllID) { clearTimeout(mllID); }
    if (!(text > "")) return;
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    //alert(bgcolor)//bgcolor = bgcolor || (/www\.translatetheweb\.com|\.translate\.goog\/|translate\.google\.com|\/embed\//gmi.test(location.href + " " + text) ? "#822" : "#6080ff");
    document.body.insertAdjacentHTML("beforeend", `<span id="cccboxaq" class="${cID}" style="all:initial;  max-height:100vh; overflow-y:auto; scrollbar-width:thin; position: fixed;  z-index:2147483647; opacity:1; word-break:break-all; font-size:${Math.max(11,15-(text.length/300)-((text.match(/<br>/gm)||[]).length/50))}px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:none; padding:1px 6px 1px 6px; border-radius:12px; background-color:${bgcolor}; color:white; ${additionalStyle}">${ text }</span>`)
    var ele = document.body.lastChild
    mllID = setTimeout(() => elegeta(`.${cID}`).forEach(e => e?.remove()), 4000, cID);
    ele.onclick = () => { elegeta(`.${cID}`).forEach(e => e?.remove()); if (mllID) { clearTimeout(mllID); } }
  }

  function rndID(n = 11) {
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    return Array.from(Array(n)).map(() => S[Math.floor(Math.random() * S.length)]).join('')
  }

  function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i}回実行 / 1sec , ${1000/i}ミリ秒/１実行 ${callback.toString().slice(0,88)}`) } // 速度測定（一瞬で終わるもの）
  function JS(v) { return JSON.stringify(v) }

  function JP(v) { return JSON.parse(v) }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function pref(name, store = null) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    if (store === null) { // 読み出し
      let data = GM_getValue(name) || GM_getValue(name);
      if (data == undefined) return null; // 値がない
      if (data.substring(0, 1) === "[" && data.substring(data.length - 1) === "]") { // 配列なのでJSONで返す
        //        try { return JSON.parse(data || '[]'); } catch (e) {
        try {
          let a = JSON.parse(data || '[]');
          return a
        } catch (e) {
          alert("データベースがバグってるのでクリアします\n" + e);
          pref(name, []);
          return;
        }
      } else {
        return data;
      }
    }
    if (store === "" || (Array.isArray(store) && store?.length == 0)) { // 書き込み、削除
      GM_deleteValue(name);
      return;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(name, store);
      return store;
    } else { // 書き込み、配列
      //      try { GM_setValue(name, JSON.stringify(store)); } catch (e) {
      try {
        let a = JSON.stringify(store);
        GM_setValue(name, a);
      } catch (e) {
        alert("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function popupCenter(text, bgcolor = text == "解除" ? "#888" : "#35a") {
    if (!text) return
    text = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let e = end(document.body, `<span class="gkscbox" style="all:initial; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity:1; z-index:2147483647; font-weight:bold; margin:0px 1px; text-decoration:none !important; padding:2em 3em; border-radius:12px; background-color:${bgcolor}; color:white; " >${text}</span>`)
    /*e.onclick = v => {
      GM.setClipboard(v.target.innerText);
      v.target.innerText = `「${v.target.innerText}」をクリップボードにコピーしました`
    }*/
    $(e).hide(0).fadeIn(155, (function(e) { return function() { setTimeout(() => { $(e).fadeOut(155, () => $(e).remove()) }, 222) } })(e))
  }

  async function clickQB(till, job, timeout) {
    return new Promise((resolve, reject) => {
      (function loop(etime) {
        if (till()) {
          job();
          resolve();
        } else if (Date.now() < etime) { requestAnimationFrame(() => loop(etime)); } else resolve();
      })(Date.now() + timeout)
    })
  }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

})()