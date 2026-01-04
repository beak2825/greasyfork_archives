// ==UserScript==
// @name ヤフオクで非表示とメモ
// @description q:非表示　w:アンドゥ　b:NGワード　Shift+Q:NG編集　12:メモを追加　34:自由メモ　56:定型文をメモ　Shift+!:メモを編集　Shift+":自動メモのみ全削除　Shift+#:メモを一時非表示　Shift+56:定型文を設定　.:上限価格　t:半透明モード
// @version     0.5.129
// @match *://auctions.yahoo.co.jp/search/*
// @match *://page.auctions.yahoo.co.jp/jp/auction/*
// @match *://auctions.yahoo.co.jp/seller/*
// @match *://auctions.yahoo.co.jp/category/list/*
// @match *://auctions.yahoo.co.jp/jp/auction/*
// @match *://cpu.userbenchmark.com/*
// @match *://www.cpubenchmark.net/*
// @match *://webcomics.jp/*
// @match *://www.amazon.co.jp/*
// @exclude *://www.amazon.co.jp/*/cart/*
// @exclude *://www.amazon.co.jp/*/buy/*
// @exclude *://www.amazon.co.jp/*/huc/*
// @exclude *://www.amazon.co.jp/ap/*
// @exclude *://www.amazon.co.jp/auto-deliveries*
// @match *://booklive.jp/index/no-charge*
// @match *://ebookjapan.yahoo.co.jp/free*
// @match *://ebookjapan.yahoo.co.jp/ranking/free/*
// @match *://ebookjapan.yahoo.co.jp/ranking/details/free/*
// @match *://ebookjapan.yahoo.co.jp/viewer*
// @match *://sokuyomi.jp/*
// @match *://csbs.shogakukan.co.jp/free*
// @match *://www.rtings.com/*/tools/table*
// @match *://www.rtings.com/*/reviews/ *
// @match *://www.nicovideo.jp/search/*
// @match *://www.nicovideo.jp/tag/*
// @match *://www.nicovideo.jp/user/*
// @match *://www.nicovideo.jp/series/*
// @match *://www.nicovideo.jp/my/*
// @match *://www.nicovideo.jp/ranking*
// @match *://www.nicovideo.jp/watch/*
// @match *://*.5ch.net/*
// @match *://www.ebay.com/sch/*
// @match *://www.ebay.com/itm/*
// @match *://jmty.jp/*
// @match *://greasyfork.org/*/scripts*
// @match *://*.aliexpress.com/af/*
// @match *://*.aliexpress.com/item/*
// @match *://*.aliexpress.com/wholesale*
// @match *://www.cmoa.jp/freecontents*
// @match *://piccoma.com/*
// @match *://www.mangaz.com/*
// @match *://www.sukima.me/*
// @match *://*.userbenchmark.com/*
// @match *://www.hellowork.mhlw.go.jp/kensaku/*
// @match *://kakaku.com/*
// @match *://manga.nicovideo.jp/*
// @match *://tsugimanga.jp/*
// @match *://www.yodobashi.com/*
// @match *://www.youtube.com/*
// @match *://*.iherb.com/*
// @match *://www.suruga-ya.jp/*
// @match *://twitter.com/*
// @match *://www.nicovideo.me/*
// @match *://www.nicochart.jp/*
// @match *://pubmed.ncbi.nlm.nih.gov/?term=*
// @match *://pubmed.ncbi.nlm.nih.gov/?linkname=*
// @match *://pubmed.ncbi.nlm.nih.gov/*
// @match *://a-timesale.com/*
// @match *://rrws.info/*
// @match *://commons.nicovideo.jp/*
// @match *://scholar.google.tld/*
// @match *://hibiki-radio.jp/*
// @match *://www.onsen.ag/
// @match *://www.freem.ne.jp/*
// @match *://shopping.yahoo.co.jp/search*
// @match *://360life.shinyusha.co.jp/*
// @match *://omocoro.jp/*
// @match *://minsoku.net/*
// @match https://refind2ch.org/search*
// @match *://chiebukuro.yahoo.co.jp/*
// @match *://www.msdmanuals.com/*
// @match *://ff5ch.syoboi.jp/?q=*
// @match *://todo-ran.com/*
// @match *://booth.pm/*
// @match *://sakura-checker.jp/category/*
// @match https://chrome.google.com/webstore/search/*
// @match https://chrome.google.com/webstore/detail/*
// @match *://twicomi.com/*
// @match *://twiman.net/*
// @match *://free.arinco.org/*
// @match *://workman.jp/shop/*
// @match *://www.uniqlo.com/*
// @match *://*.shitaraba.net/bbs/read.cgi/*
// @match *://*.shitaraba.net/bbs/read_archive.cgi/*
// @match *://*.ftbucket.info/*
// @match *://kuzure.but.jp/*
// @match *://*.2chan.net/*
// @match *://anige.horigiri.net/*
// @match *://futapo.futakuro.com/*
// @match *://kako.futakuro.com/futa/*
// @match https://kakaku.com/pc/note-pc/itemlist.aspx
// @match https://kakaku.com/pc/desktop-pc/itemlist.aspx
// @match *://btopc-minikan.com/*
// @match *://pcfreebook.com/*
// @match *://search.bilibili.com/*
// @match *://www.bilibili.com/video/*
// @match *://www.mcdonalds.co.jp/menu/*
// @match *://*.2chan.net/b/futaba.php*
// @match *://nitter.cz/*
// @match *://nitter.net/*
// @match *://xcancel.com/*
// @match *://www.uexpress.com/*
// @match https://find.5ch.net/search
// @match *://tsumanne.net/*/data/*
// @match *://zzzsearch.com/*
// @match *://review.kakaku.com/review/*
// @match *://www.netoff.co.jp/*
// @match *://jp.daisonet.com/*
// @match *://search3.vector.co.jp/*
// @match *://alternativeto.net/*
// @match file:///*.html
// @match *://www.google.co.jp/*
// @match *://radiko.jp/*
// @match *://mangahack.com/*
// @match *://rookie.shonenjump.com/*
// @match *://shonenjumpplus.com/series*
// @match *://shonenjumpplus.com/episode*
// @match *://kuragebunch.com/series*
// @match *://kuragebunch.com/episode*
// @match *://www.sunday-webry.com/series*
// @match *://duckduckgo.com/*
// @match *://futafuta.site/thread/*
// @match *://parupunte.net/logbox/detail.html*
// @match *://www.eiyoukeisan.com/*
// @match *://www.suruga-ya.jp/*
// @match *://www.uniqlo.com/*
// @match *://radiko.jp/*
// @match *://tonarinoyj.jp/*
// @match *://windhawk.net/*
// @match *://radiko.jp/*
// @match *://www.tiktok.com/*
// @noframes
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM.addStyle
// @grant       GM.setClipboard
// @grant       GM.openInTab
// @run-at      document-idle
// @namespace https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @require https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/386645/%E3%83%A4%E3%83%95%E3%82%AA%E3%82%AF%E3%81%A7%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%A8%E3%83%A1%E3%83%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/386645/%E3%83%A4%E3%83%95%E3%82%AA%E3%82%AF%E3%81%A7%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%A8%E3%83%A1%E3%83%A2.meta.js
// ==/UserScript==

(function() {
  const FUTABA_WEBP_LOSSY_QUALITY = 0.8; // ふたばでクリップボードの写真ぽいpng画像を非可逆webpにする場合の品質のデフォルト　vキーで変更可　通常：0.8
  const FUTAPO_CRAM_TITLE = 1; // 1:futapoでboxの横幅が狭いときでもタイトルを詰め込む　0:無効
  const FUTAPO_89_NOTIFY = "notify"; // futapoで8/9登録がヒットした時にどう通知するか　"notify"でnotification API（推奨）、"sound"で効果音。"notify sound"で両方、""で通知しない
  const FUTABA_SET_56MEMO_TO_ANCHORED = 3; // 1:ふたばで監視ワードヒットレスと自分のレスに自動的に5メモを付ける 2:1に加え5メモへのレスに6メモを付ける　3:1+2に加え遠くても5メモに連鎖するレスには6メモをつける（推奨）　4:1+2+3に加え遠くても6メモに連鎖するレスにも6メモをつける
  const FUTABA_NOTIFY_NEWRES_SOUND_MEMO_QUOTED = "5 6 m"; // ふたばで新着レスのNotification通知でメモのついたレスが引用された時に音で知らせるか　"5"で○メモに鳴らす、"6"で×メモに鳴らす、"m"で監視ワードに鳴らす、""で鳴らさない、"5 6 m"などで複数設定可能
  const FUTABA_Z_TO_COPY_TO_CLIPBOARD_AS_TEXT_TOO = "${num1} ${name1} ${name2} ${time} ${num2} ${soudane}\n${text}\n"; // ふたばでzキーかレス右上の□のクリック時についでに内容をテキストとしてクリップボードにコピーする、その書式　""：コピーしない
  const FUTABA_FLOAT_RELOAD_BUTTON = 1; // 1:ふたばでリロードボタンを浮遊させる　0:無効
  const FUTABA_HOVER_POPUP_REPLACE = 1; // 1:ふたばで>引用ポップアップを置き換える　0:無効
  const FUTABA_HOVER_POPUP_DELAY = 1; // ふたばで>引用の上に静止してn/60秒間後にポップアップを表示する　-1:瞬間＆低負荷(mousemove)　1:瞬間(interval)　2～:n/60秒(interval)　0:無効
  const FUTABA_REPLACE_RES0 = 1; // 1:ふたばでスレ本文をレス番号０のように置き換える　引用ポップアップ等が働くために必要　0:無効
  const FUTABA_QUOTE_LEAD_FOR_NUMBER_ONLY = 1; // 1:ふたばで>no.○○や>○○.jpgや>fu○○.jpgといった引用にも本文のバルーン引用を追加する（要「5chサムネイル表示他」併用）　0:無効
  const FUTABA_AUTO_RELOAD_INTERVAL = 1; // 1-10:ふたばでnキーオン時の自動リロードする最短間隔（分） ※新着がなく無操作だと自動的に10分まで伸びる
  const FUTABA_ALTZ_FILENAME_SUFFIX = "●"; // ふたばでAlt+Z時にファイル名の末尾に付ける文字
  const FUTABA_PLAY_GIF_INLINE = 1; // 1:ふたばのgifをインラインで動かす　0:無効
  const FUTABA_POPUP_PADDING_RATE = 169; // ふたばの引用ポップアップの額縁の太さ(大きいほど細い)
  const FUTABA_REMOVE_REDIRECT_PAGE = 0; // 1:ふたばでリンクからクッションページを省略
  const FUTABA_EXPERIMENTAL_REMOVE_METADATA_FROM_UPFILE = () => 1; // ()=>1:ふたばでD&DとCtrl+V時の添付ファイルからメタデータを除去する　()=>0:除去しない
  const FUTABA_YOUTUBE_PLAYALL_BUTTON = 1; // 1:ふたばでYouTubeのリンクの動画を小窓で連続再生するボタンを設置　2:1をuキーで実行　0:無効
  const FUTABA_PICK_IMG_MIN_SIZE = 60; // ふたばでピックアップの最小画像サイズ
  const FILENAME_MAXLENGTH = 94;
  const FUTABA_FORWARD_LINK = 0; // 2:ふたばで若い方向の引用も>>2のホバーで表示する 2:1+ふたばで1<<形式のフォワードリンクも付ける 0:無効
  const FUTABA_LAZY = 0; // 1:ふたばでリロードで追加されるメディアになるべく読み込み遅延を付けてメモリ消費を抑える？ 0:無効
  const YT_REFERRER = `strict-origin-when-cross-origin`;

  const FUTABA_DEBUG = 0; // 1-3:ふたばで開発用情報を表示 1:リロードボタン　2:1+最下行ログ 3:1+2+タブタイトル　0:無効
  const KEYCHANGE_DEBUG = "disable"; // 押す度にdebugを0～3に切り替えるキー "Shift+J","disable"等
  const IN5CH_REMOVE_AKABAN = 1; // 1:5chで垢版ボタンをとりあえず隠す　0:そのまま
  const dniCancel = 1; // DNIがobserve(ms)以上連続して発火しても途切れるのを待ち続ける
  const DEBUG_CATCH = 0; // 1:catchしたエラーをalert　0:無効
  const ENABLE_HELP = 1; // 1:操作ガイドを表示　0:無効
  const ENABLE_AUTOMEMO = 7; // 0:自動メモを無効 1でオン 2～7:大きくするほど一時的に表示が崩れる代わりに確実
  const REPLACE_LINK_IN_YOUTUBE = 1; // 1:YouTubeで投稿者のチャンネルのホームタブへのリンクをチャンネルの動画タブへのリンクに置き換える
  const ENABLE_EXCEPT_YAJ = 1; // 1:ヤフオク以外でも有効 0:ヤフオクでのみ動作
  var debug = 0; // 1～だとデバッグモード V&&dc(text)　1:非対応ページでその旨表示など/コンソールにverbose表示　2:verboseをポップアップ（速度測定して表示 debug&&sw("項目")）＆非表示にした原因に枠追加　3:Q/1/2等の対象要素を目立たせる
  const YOUTUBE_TITLE_ROWS = 3; // 2-4:youtubeの動画タイトルを表示する行数を増やす　0:デフォルト（2行）
  const ENABLE_MEASURE_TIME_SPENT = 0; // 1で速度測定して表示 debug&&sw("項目")
  const CUSTOMAUTOMEMORE = [].concat([/(Windows.*bit)/gmi, /((?:ＨＤＤ|HDD|ＳＳＤ|SSD|ハードディスク|ストレージ).*?(?:GB|TB|ＧＢ|ＴＢ|無し|なし|無|欠品|欠))/mi, /((?:10|テン)(?:key|キー))/mi, /(768.{1,3}576)|(800.{1,3}600)|(832.{1,3}624)|(1024.{1,3}768)|(1152.{1,3}864)|(1,?280.{1,3}960)|(1400.{1,3}1050)|(1440.{1,3}1080)|(1600.{1,3}1200)|(2048.{1,3}1536)|(2304.{1,3}1728)|(3200.{1,3}2400)|(854.{1,3}480)|(1024.{1,3}576)|(1136.{1,3}640)|(1280.{1,3}720)|(1,?36\d?.{1,3}768)|(1,?920.{1,3}1,?080)|(2048.{1,3}1152)|(2,?560.{1,3}1,?440)|(3200.{1,3}1800)|(3,?840.{1,3}2,?160)|(7680.{1,3}4320)|(640.{1,3}400)|(1280.{1,3}800)|(1,?440.{1,3}900)|(1680.{1,3}1050)|(1,?920.{1,3}1,?200)|(2560.{1,3}1600)|(2880.{1,3}1800)|(3840.{1,3}2400)|(480.{1,3}320)|(960.{1,3}640)|(176.{1,3}144)|(400.{1,3}240)|(352.{1,3}288)|(640.{1,3}350)|(720.{1,3}480)|(800.{1,3}480)|(864.{1,3}480)|(1024.{1,3}480)|(1024.{1,3}600)|(1280.{1,3}600)|(1120.{1,3}750)|(1280.{1,3}768)|(1152.{1,3}870)|(1280.{1,3}1024)|(1,?600.{1,3}900)|(1,?600.{1,3}1024)|(2048.{1,3}1080)|(4096.{1,3}2160)|(8192.{1,3}4320)/m, /(非光沢|ノングレア|ノーグレア|アンチグレア|光沢|グレア)/m, /((?:30|40)\s?(?:pin|ピン))/mi, /(LVDS.*$|eDP)/mi, /^(.*リカバリ.*)$/mi, /(仕事率[^0-9０-９\n]*[0-9,０-９，]*\s*[wW])/mi, /(\[?\s?関東[^0-9,０-９，\n]*[0-9,０-９，]*\s*円[-～]?)/m, /(\[?\s?本州[^0-9,０-９，\n]*[0-9,０-９，]*\s*円[-～]?)/m, /(HDMI.{0,10}入力.{2,3}|入力.{0,20}HDMI.{2,3})/mi, /(電源入り.{2,10})/mi, /(\d\d鍵)/m]);

  const fasttest = 1; // 1:高速モードを試用
  const FUTABA_BGC = 0 ? "#f0e0d6" : "#ffffee"

  const ISCHROME = window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1
  var futabapopupscale;
  const futabapicksizeDefault = 90
  var futabapicksizeL = futabapicksizeDefault;
  var futabapicksize = 100;
  var hovertimer = 0;
  var swb = new Date();
  var prefCache = []

  GM_addStyle("span.yhmMyMemo{all:initial; word-wrap:break-word;cursor:pointer; font-size:14px; font-weight:bold; margin:0px 1px; text-align:center; padding:0px 6px 0px 6px; border-radius:12px; color:white;font-family:sans-serif;}")
  debug && sw("reset")

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //  String.prototype.match1 = function(re) { return this?.match(re)?.slice(1)?.find(v => v) } // this./a(bc)|d(ef)/ 等の()でキャプチャした最初の１つを返す　gフラグ不可
  String.prototype.match1 = function(re) { return this?.match(re)?.slice(1)?.find(Boolean) } // this./a(bc)|d(ef)/ 等の()でキャプチャした最初の１つを返す　gフラグ不可
  //String.prototype.nfd = function() { return SITE.nfd ? this?.normalize("NFD") : String(this) } // 文字列をNFDエンコードにまとめる
  String.prototype.sanit = function() { return this.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;') }
  const waitFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  const ael = (ele, evts, cb, opt) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, cb, opt));

  function adja(place = document.body, pos, html) {
    return place ? (place.insertAdjacentHTML(pos, html), place) : null;
  }
  /*let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      const uid = [...crypto.getRandomValues(new Uint8Array(12))].map(b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" [b % 52]).join('');
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
  }*/

  var SITE = {}
  let inYOUTUBE = location.hostname.match0(/^www\.youtube\.com|^youtu\.be/);

  $.fn.animate2 = function(properties, duration, ease) {
    ease = ease || 'ease';
    var $this = this;
    var cssOrig = { transition: $this.css('transition') };
    return $this.queue(next => {
      properties['transition'] = 'all ' + duration + 'ms ' + ease;
      $this.css(properties);
      setTimeout(function() {
        $this.css(cssOrig);
        next();
      }, duration);
    });
  };

  if (window != parent) return;
  const WAIT = performance.now(); // ページ開始後のウエイト用 delayAutoWeightingをかける
  const OLD_COLOR1 = "#6080ff",
    OLD_COLOR2 = "#c03020",
    OLD_COLOR3 = "#808080",
    OLD_COLOR5 = "#6080ff",
    OLD_COLOR6 = "#c03020",
    OLD_COLORVIDEOTIME = "#204020",
    OLD_COLORCPUSCORE = "#a08000",
    COLOR1 = "#57f", //"#6080ff",
    COLOR2 = "#c32", //"#c03020",
    COLOR3 = "#888", //"#808080",
    COLOR5 = "#57f", //"#6080ff",
    COLOR6 = "#c32", //"#c03020",
    COLORVIDEOTIME = "#242", //"#204020",
    COLORCPUSCORE = "#970", //"#a08000",
    COLORCPUSCOREPM = "#d71", //"#f81",//"#f48a18",
    COLOR_ALERT_WORD = "#882", //"#a08000",
    KEYHIDE = "q",
    KEYUNDO = "w",
    KEYBW = "b",
    KEYEDIT = "Shift+Q",
    //    KEYEDIT2 = "Shift+B",
    KEYMAXP = ".",
    KEYMEMO1 = "1",
    KEYMEMO2 = "2",
    KEYMEMO1S = "3",
    KEYMEMO2S = "4",
    KEYMEMO5 = "5",
    KEYMEMO6 = "6",
    KEYMEMO5EDIT = "Shift+%",
    KEYMEMO6EDIT = "Shift+&",
    KEYTOGGLEtranslucent = "t",
    KEYRESETMEMO = "Shift+!",
    KEYRESETMEMOAUTO = "Shift+\"";
  var MEMO5WORD = "", // 5キーの定型文初期値　""なら現在年月日
    MEMO6WORD = ""; // 6キーの定型文初期値　""なら現在年月日

  var pauseAll = 0;
  let kaisuuU = 0;
  var GF = {}
  GF.yhmSortType = 0
  GF.isNico = location.host == "www.nicovideo.jp"
  var memofast = false;

  // 上が優先
  const SITEINFO = [ // @match *://www.tiktok.com/*
    {
      urlRE: '//www.tiktok.com/',
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          var sorttype = GF.yhmSortType || 0
          let menu = [{
            t: "最近",
            f: () => {
              sortdom(elegeta('div[id*="column-item-video-container-"]:not(div[class*="DivVideoListScrollBar"] *)'), v => {
                let n = eleget0('div[class*="DivTimeTag"]', v)?.textContent;
                return parseFloat(n) * (n?.match0("秒前") ? 1 : n?.match0("分前") ? 60 : n?.match0("時間前") ? 60 * 60 : n?.match0("日前") ? 60 * 60 * 24 : 60 * 60 * 24 * 31);
              })
            }
          }, ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          menu[sorttype].f()
          GF.yhmSortType = (++sorttype) % menu.length
        }
      }],
    }, {
      id: 'radiko',
      urlRE: /\/\/radiko\.jp\/\#\!\/search\//,
      funcOnlyFirst: () => {
        addstyle.add('.search-result .img-list__title, .search-result .img-list__cast { overflow: unset !important; white-space: unset !important; text-overflow: unset !important; } li.img-list__item { min-height: 37em !important; }')
      },
    }, {
      urlRE: `//radiko.jp/#!/search/`,
      funcOnlyFirst: () => Math.random() > 0.2 && addstyle.add(`
 .content .content__inner { font-family: 'Noto Sans JP', sans-serif !important; font-weight:400; font-feature-settings: "palt","kern" !important; letter-spacing:-0.01em !important; width: 91vw; }
 .img-list__item { line-height: 1.3em; height: unset !important; }
 .img-list__img { margin: 0 auto; width: 155px; height: unset !important; line-height: unset !important;}
 .img-list__genre { margin-top: 11px !important;}
 .contents-back { display: flex; flex-wrap: wrap; justify-content: center; }
 `),
    }, {
      id: 'uniqlo',
      urlRE: '//www.uniqlo.com/',
      title: 'h3[class*="fr-ec-title"].fr-ec-title--product-tile-horizontal[data-testid="CoreTitle"] , h1.fr-ec-display.fr-ec-display--color-primary-dark.fr-ec-display--display5.fr-ec-text-align-left[class*="fr-ec-text-transform-normal"]',
      box: 'div.fr-ec-product-tile-resize-wrapper , div > div.fr-ec-mt-spacing-05 > div[class*="fr-ec-layout--gutter-md"]',
      forceTranslucentFunc: e => lh("/products/"),
      //title: 'h1.fr-ec-display.fr-ec-display--color-primary-dark.fr-ec-display--display5.fr-ec-text-align-left[class*="fr-ec-text-transform-normal"]', box: 'div > div.fr-ec-mt-spacing-05 > div[class*="fr-ec-layout--gutter-md"]',
      //  `div#productMaterialDescription-content > dl.fr-ec-description-list`
      redoWhenRefocused: 1,
      memoFunc: n => ld("/products/") ? n?.parentNode?.parentNode : n,
      observe: 500,
      funcOnlyFirst: () => {
        //alert(eletext('div#productMaterialDescription-content > dl.fr-ec-description-list'))
        autoMemo2(eletext('dl.fr-ec-description-list:visible'), /(素材[\s\S]*?)(?:取扱|$)/mi, "notAppend")
      },
    }, {
      id: 'NICOSEIGA_COMIC',
      urlRE: '//manga.nicovideo.jp/ranking',
      title: 'a.mg_txt , div.mg_title_area > strong > a',
      box: 'div.mg_ranking_box , div.mg_category_ranking_box',
    }, {
      id: 'www.suruga-ya.jp',
      urlRE: '//www.suruga-ya.jp/product',
      box: 'div > div.container_suru.padB40 > div:nth-child(4 of div)',
      title: 'h1.h1_title_product',
      trim: 1,
    }, {
      id: 'www.suruga-ya.jp',
      urlRE: '//www.suruga-ya.jp/search',
      box: 'div.item',
      title: 'h3.product-name',
      wholeHelp: [() => 1, "　A：ソート"],
      observe: 500,
      observeClass: ["item"],
      func: () => {
        // アイテムを詰め込むためにrowコンテナを削除、ペジネーターを左上に移動
        pauseAll = 1
        addstyle.add(`.main-wrap-right .grid_style .item  , .autopagerize_page_info {display:inline-block;}`)
        elegeta('.item_box > div').forEach(e => e?.parentNode.insertAdjacentElement("beforebegin", e))
        elegeta('.item_box , .autopagerize_page_separator').forEach(e => e?.remove())
        elegeta('.main-wrap-right .autopagerize_page_info ').forEach(e => document.body.insertAdjacentElement("beforebegin", e)) //?.remove())
        pauseAll = 0
      },
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "安い", f: () => { sortdom(elegeta('div.item'), v => +eleget0('p.price_teika > span > strong', v)?.textContent?.replace(/,/g, "")?.match0(/\d+/) || +eleget0('div.makeplaTit > p.mgnB5 > span.text-red > strong', v)?.textContent?.replace(/,/g, "")?.match0(/\d+/) || 999999999) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          menu[sorttype].f()
          GF.yhmSortType = (++sorttype) % menu.length
        }
      }],
    }, {
      id: 'www.suruga-ya.jp',
      urlRE: 'https://www.suruga-ya.jp/cargo/detail',
      box: '.item',
      title: 'p.item_name:nth-child(1) > a:nth-of-type(1)',
      wholeHelp: [() => 1, "　A：ソート"],
      observe: 500,
      observeClass: ["item"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "安い", f: () => { sortdom(elegeta('.item'), v => +eleget0('.price', v)?.textContent?.replace(/,/g, "")?.match0(/\d+/) || 999999999) } },
            { t: "タイトル", f: () => { sortdom(elegeta('.item'), v => eleget0('p.item_name > a:nth-child(1)', v)?.textContent?.trim() || "") } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
        }
      }],



      //tr.item
    }, {
      id: 'www.eiyoukeisan.com',
      urlRE: '//www.eiyoukeisan.com/',
      //title: 'td',
      // box: 'tr',
    }, {
      id: 'duckduckgo.com',
      urlRE: '//duckduckgo.com/',
      title: 'span.tile--img__title',
      box: 'div.tile.tile--img.has-detail',
    }, {
      id: 'WCA',
      urlRE: '//www.sunday-webry.com/series',
      title: 'h4.test-series-title.series-title , p.author',
      box: 'li.webry-series-item.test-series',
    }, {
      id: 'WCA',
      urlRE: '//kuragebunch.com/series|//kuragebunch.com/episode',
      title: 'li.page-series-list-item > div > div > a.series-data-container > h4 , a.series-data-container > h5 , h1.series-header-title',
      box: 'li.page-series-list-item , div.series-header.scroll-position',
    }, {
      id: 'WCA',
      urlRE: '//shonenjumpplus.com/series|//shonenjumpplus.com/episode',
      title: 'h2.series-list-title , h1.episode-header-title , a > h3.series-list-author',
      box: 'li.series-list-item , div.episode-header-container',
      redoWhenRefocused: 1,
      memoFunc: e => e,
      forceTranslucentFunc: e => lh("/episode"),
    }, {
      id: 'rookie.shonenjump.com',
      urlRE: () => lh('//rookie.shonenjump.com/') && !eleget0('a.page-navigation-backward.js-slide-backward'),
      title: 'h1.series-title',
      box: 'section.series-contents',
    }, {
      id: 'mangahack.com',
      urlRE: '//mangahack.com/',
      title: 'div.episodeArea:nth-child(2 of div.episodeArea) > h1 , p[class*="title"] > span > a , div.comicTitle_toppage > h1',
      box: 'div.oneColumn.pb00.pl00.pr00.pt00 , div#stored.comicList_box.cf , div.mainContents',
      observe: 500,
      funcOnlyFirst: () => setInterval(() => eleget0('i.fa.fa-angle-down:visible:inscreen')?.click(), 1000),
    }, {
      id: 'radiko.jp',
      urlRE: '//radiko.jp/',
      title: 'p.img-list__title.ellipsis',
      box: 'li.img-list__item',
      observe: 2222,
    }, {
      id: 'www.google.co.jp',
      urlRE: /\/\/www\.google\.co\.jp\/.*\&tbm\=shop/,
      title: '.tAxDx , div > div.aULzUe',
      box: '.sh-dgr__grid-result',
    }, {
      id: 'alternativeto.net',
      urlRE: '//alternativeto.net/',
      title: 'h1[class*="Heading_h1___"] , h2[class*="Heading_h2___"] > a , div > a[class*="AppItemBox_appName__"]',
      box: 'main#mainContent > section , div[class*="AppItem_shared_itemBox__"] , div[class*="PageIntroWrapper_noClouds__"] > div:last-of-type',
    }, {
      id: 'vector.co.jp',
      urlRE: '//search3.vector.co.jp/',
      title: 'h2 > a.url',
      box: 'div[class*="hreview"]',
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "新しい", f: () => { sortdom(elegeta(SITE.box), v => eleget0('p.footer > span:nth-of-type(1)', v)?.textContent + eleget0('.board_title span', v)?.textContent, 1) } },
            { t: "古い", f: () => { sortdom(elegeta(SITE.box), v => eleget0('p.footer > span:nth-of-type(1)', v)?.textContent + eleget0('.board_title span', v)?.textContent) } },
            { t: "評価", f: () => { sortdom(elegeta(SITE.box), v => eleget0('span[class*="rating"]', v)?.className || 0, 1) } },
            { t: "タイトル", f: () => { sortdom(elegeta(SITE.box), v => eleget0(SITE.title, v)?.textContent) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
          //return
        }
      }],
    }, {
      id: "DAISONET",
      urlRE: '//jp.daisonet.com/',
      title: 'h1.product-meta__title.heading.h1.text--strong , a.product-item__title',
      box: 'div.product-block-list , div.product-item--vertical',
      //memoFunc: e => e?.parentNode?.parentNode,
      trim: 1,
      forceTranslucentFunc: e => lh('daisonet.com/products/'),
      redoWhenRefocused: 1,
    }, {
      id: `NETOFF`,
      urlRE: '//www.netoff.co.jp/',
      box: 'li.clearfix , ul.itemList.tglist > li',
      title: 'p > a.fw , dl.leftBox > dd > p:nth-child(1 of p) > a',
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "安い→新しい", f: () => { sortdom(elegeta('li.clearfix'), v => +eleget0('.price', v)?.textContent?.replace(/,/g, "")?.match0(/\d+/) * 1000000000 + (1000000 - +(eleget0('.subinfo', v)?.textContent?.replace(/(\d+).(\d+).*/, "$1$2")))) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
        }
      }]
    }, {
      id: 'KAKAKU',
      urlRE: 'https://review.kakaku.com/review/',
      title: 'h2[itemprop="name"]',
      box: 'div#main',
      forceTranslucentFunc: e => 1,
      memoFunc: e => e?.parentNode?.parentNode,
    }, {
      id: 'zzzsearch.com',
      urlRE: '//zzzsearch.com/',
      title: '//div[@class="gs-title"]/a[@dir="ltr"]',
      box: 'div.gsc-webResult.gsc-result',
      observe: 333,
      keyFunc: [{
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
      }],
    }, {
      id: 'uexpress',
      urlRE: /\/\/www\.uexpress\.com\//,
      keyFunc: [{
        key: 'Shift+F', // Shift+F::キーワード検索
        func: () => { searchWithHistory("uexpress", "UExpress", 'https://www.google.co.jp/search?q=***%20site:www.uexpress.com/life/miss-manners', "|") },
      }],
    }, {
      id: 'nitter',
      urlRE: /\/\/nitter\.cz\/|\/\/nitter.\.net\/|\/\/xcancel.com\//,
      title: '.username',
      box: '.timeline-item',
      observe: 500,
    }, {
      id: 'futaba_catalog',
      urlRE: /https?:\/\/[^\.]+\.2chan\.net\/[^/]+\/futaba\.php\?mode=cat/,
      title: '.tdDiv small',
      box: '#cattable tbody tr td',
      isHidePartialMatch: 1,
      titleSubstr: true,
      hideSelectedWord: 1,
      disableKeyB: 0,
      listTitleXPIgnoreNotExist: 1,
      funcOnlyFirst: () => {

        $('#cattable td').wrapInner('<div class="tdDiv"></div>')

        // レス数とvボタンを下の帯に固定
        elegeta('.pdmc').forEach(e => e.closest('td')?.appendChild(e))
        addstyle.add(`.pdmc { margin-top:auto; margin-bottom:auto;  right: 0em; bottom:0.2em; position:absolute; z-index:99; opacity:1;  padding:0.15em; background-color:#ffffee;  }`)
        GF.imgw = Math.max(eleget0('#cattable img')?.offsetWidth, eleget0('#cattable img')?.offsetHeight) || 40
        GF.boxw = eleget0('#cattable td')?.offsetWidth || 40

        setSlider(eleget0('//body/span[1]'), 0, 320, 0, "画像サイズ:***px", "futaba_catalog_imagesize", (val) => {
          eleget0('#imagesizecss')?.remove()
          $("#boxs").remove();
          GF.imgw = val
          if (val) end(document.head, `<style id="imagesizecss" data-val="${val}">#cattable img{max-width:${val}px; width:auto; height:auto; max-height:${val}px; }</style>`)
          if (val) { end(document.head, `<style id="boxs">${GF.boxw<2*GF.imgw?"#cattable img{display:block; height:auto !important; max-width:100% !important; margin-bottom:5px; margin-right:auto; margin-left:auto;}":"#cattable img{float:left; margin-bottom:5px; margin-right:5px;}"}</style>`) }

        }, 0, '')
        setSlider(eleget0('#setSliderfutaba_catalog_imagesize'), 0, 300, 0, "box高さ:***px", "futaba_catalog_boxheight", (val) => {
          eleget0('#futaba_catalog_imagesize')?.remove()
          if (val) end(document.head, `<style id="boxheightcss">#cattable td{height:calc(${val - 2}px - 0.5em); } #cattable tbody{display:grid !important;} #cattable tr,#cattable td{ display:inline-block; overflow:hidden; min-height:${val - 2}px !important; max-height:${val - 2}px !important; height:${val - 2}px !important;}</style>`) // レス数とvボタンを下の帯に固定
          if (val) addstyle.add(`#cattable img{border:black solid 1px;}`); //$("#cattable img").wrap('<div class="imgDiv"></div>')  eleget0('#futaba_catalog_imagesize')?.remove()

        }, 0, '')
        setSlider(eleget0('#setSliderfutaba_catalog_imagesize'), 0, 300, 0, "box横幅:***px", "futaba_catalog_boxwidth", (val) => {
          eleget0('#boxwidthcss')?.remove()
          $("#boxs").remove();
          $('#cattable td a+br').remove()
          GF.boxw = val - 5
          if (val) end(document.head, `<style id="boxwidthcss">.tdDiv{margin:5px;} #cattable small{line-break: anywhere; } #cattable td{vertical-align:top; word-break:break-all; width:${1+val}px !important;}</style>`)
          if (val) { end(document.head, `<style id="boxs">${GF.boxw<2*GF.imgw?"#cattable img{display:block; height:auto !important; max-width:100% !important; margin-bottom:5px; margin-right:auto; margin-left:auto;}":"#cattable img{float:left; margin-bottom:5px; margin-right:5px;}"}</style>`) }

        }, 0, '')
        setSlider(eleget0('#setSliderfutaba_catalog_imagesize'), 0, 24 * 3, 0, "文字サイズ:***/3px", "futaba_catalog_fontsize", (val) => {
          eleget0('#textsizecss')?.remove()
          if (val) end(document.head, `<style id="textsizecss">#cattable small{font-size:${val/3}px; }</style>`)
        }, 0, '')
      },
    }, {
      id: 'search.bilibili.com',
      urlRE: '//search.bilibili.com/|//www.bilibili.com/video/',
      title: '.bili-video-card__info--tit , .video-title.special-text-indent',
      box: '.video-list>div , div.video-container-v1:last-of-type > div.left-container',
      forceTranslucentFunc: e => e?.closest('div.video-container-v1:last-of-type > div.left-container'),
      delay: 999,
      redoWhenRefocused: 1,
      redoWhenReturned: 1,
      observe: 999,
      funcOnlyFirst: () => {
        addstyle.add(' .bili-video-card .bili-video-card__info--tit { height: calc(3 * var(--title-line-height)) !important;}')
        // 重複してでてきた動画を消す
        setInterval(() => {
          if (lh(/\/\/search\.bilibili\.com\//)) {
            let first = new Set(),
              dup = new Set();
            elegeta(`div.video-list-item`).forEach(e => {
              let u = eleget0('a[href*="/video/"]:visible', e)?.href
              if (u && first.has(u)) {
                let s = getComputedStyle(e);
                e.style.outline = "3px dashed red"
                e.animate([{ transformOrigin: 'top left', transform: (s.transform === 'none' ? '' : s.transform || "") || 'scale(1)', opacity: 1, height: e.offsetHeight + 'px', width: e.offsetWidth + 'px' }, { transformOrigin: 'top left', transform: (s.transform === 'none' ? '' : s.transform || "") + 'scale(0)', opacity: 0, height: '0px', width: '0px' }], { duration: 2222, easing: 'ease', fill: 'none' }).onfinish = () => e?.remove();
                dup.add(u)
              } else { first.add(u) }
            })
            if (dup.size) popup3(`重複削除(${dup.size})：\n${sani([...dup].join("\n"))}`, 1, 3000)
          }
        }, 3500)
      },
      keyFunc: [{
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: async e => (lh(/search\.bilibili\.com/)) && autoPaging(`.video-list>div`, `button.vui_button[class*="vui_pagenation--btn"]:last-of-type`, 50, 1000),
      }, {
        key: 'a', // a::
        func: () => {
          if (!lh('keyword=')) return;
          elegeta('span.bili-video-card__info--date').forEach(e => {
            if (!e?.textContent?.match(/\d{4}-/)) e.textContent = e.textContent.replace(/(\d\d-\d\d)/, `${("0000" + new Date().getFullYear()).slice(-4)}-$1`)
          })
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "タイトル", f: () => { sortdom(elegeta('div.video-list>div'), v => eleget0('h3.bili-video-card__info--tit', v)?.textContent) } },
            { t: "再生多", f: () => { sortdom(elegeta('div.video-list>div'), v => { let n = eleget0('.bili-video-card__stats--item', v)?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 1) } },
            { t: "再生少", f: () => { sortdom(elegeta('div.video-list>div'), v => { let n = eleget0('.bili-video-card__stats--item', v)?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 0) } },
            { t: "時間長", f: () => { sortdom(elegeta('div.video-list>div'), v => eleget0('.bili-video-card__stats__duration', v)?.textContent?.replace(/\D/g, ""), 1) } },
            { t: "時間短", f: () => { sortdom(elegeta('div.video-list>div'), v => eleget0('.bili-video-card__stats__duration', v)?.textContent?.replace(/\D/g, "")) } },
            { t: "古い", f: () => { sortdom(elegeta('div.video-list>div'), v => eleget0('span.bili-video-card__info--date', v)?.textContent) } },
            { t: "新しい", f: () => { sortdom(elegeta('div.video-list>div'), v => eleget0('span.bili-video-card__info--date', v)?.textContent, 1) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
          //return
        }
      }],
      func: () => (!lh('&keyword=')) && popup3("A：ソート", 5),
    }, {
      id: 'mcdonaldsmenu',
      urlRE: '//www.mcdonalds.co.jp/menu/',
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "安い順", f: () => { sortdom(elegeta('//span[@class="product-list-card-price-number text-2xl font-extrabold"]/../../..'), v => eleget0('//span[@class="product-list-card-price-number text-2xl font-extrabold"]', v)?.textContent) } },
            { t: "高い順", f: () => { sortdom(elegeta('//span[@class="product-list-card-price-number text-2xl font-extrabold"]/../../..'), v => eleget0('//span[@class="product-list-card-price-number text-2xl font-extrabold"]', v)?.textContent, 1) } },
            { t: "タイトル", f: () => { sortdom(elegeta('//span[@class="product-list-card-price-number text-2xl font-extrabold"]/../../..'), v => eleget0('.product-list-card-name', v)?.textContent) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
          return
        }
      }],
      func: () => popup3("A：ソート", 5),
    }, {
      id: 'pcfreebook.com',
      urlRE: '//pcfreebook.com/',
      listTitleXP: '//td[1]/a[@target="_blank" and @rel="noopener nofollow noreferrer"]',
      listTitleSearchXP: '//td[1]/a[@target="_blank" and @rel="noopener nofollow noreferrer"][+++]/ancestor::tr',
      listTitleMemoSearchXP: '//td[1]/a[@target="_blank" and @rel="noopener nofollow noreferrer"][+++]',
      listGen: 3,
      listTitleMemoSearchXPSameGen: 1,
      listTitleXPIgnoreNotExist: 1,
      observe: 2500,
    }, {
      id: 'btopc-minikan.com',
      urlRE: '//btopc-minikan.com/',
      titleProcessFunc: (title) => { return title.replace(/\n|\s/gmi, " ").trim() },
      listTitleXP: '//span[@class="itemname"]',
      listTitleSearchXP: '//span[@class="itemname"][++title++]/ancestor::tr',
      listTitleMemoSearchXP: '//span[@class="itemname"][++title++]',
      listTitleMemoSearchXPSameGen: 1,
      useTitle: 1,
      listGen: 4,
      func: () => {
        elegeta('//td[1]/div[@class="notranslate"]|.//td[@class="CPUgrease-GraphCell-Maker"]').forEach(e => e.insertAdjacentHTML("beforeend", `<span class="itemname" title="${e.textContent.replace(/\n|\s/gmi," ").trim()}">　</span>`))
      },
      listTitleXPIgnoreNotExist: 1,
      observe: 2500,
    }, {
      urlRE: /^https:\/\/kakaku.com\/pc\/note-pc\/itemlist\.aspx|https:\/\/kakaku\.com\/pc\/desktop-pc\/itemlist.aspx|\/\/kakaku.com\/pc\/gaming-pc\/itemlist.aspx|\/\/kakaku.com\/pc\/gaming-note\/itemlist.aspx|\/\/kakaku.com\/pc\/stick-pc\/itemlist.aspx/,
      WhateverFirstAndEveryAPFunc: () => {
        if (!elegeta('//th[@class="sub thHeader" and contains(text(),"CPUスコア")]')[0]) return;
        popup3("A：CPUスコア単価で絞り込み", 4)
        //$(".cps").remove()
        //        let arr = lh("gaming") ? elegeta('//table/tbody/tr[@class="tr-border"]/td[11]') : elegeta('//table/tbody/tr[@class="tr-border"]/td[10]')
        let arr = lh("gaming") ? elegeta('table tbody tr.tr-border td:nth-child(11):not([data-scorecost])') : elegeta('table tbody tr.tr-border td:nth-child(11):not([data-scorecost])')
        arr.forEach(e => {
          e.dataset.scorecost = 1
          //          let p = elegeta('//td[2]/ul/li[@class="pryen"]/a', e?.closest("tr"))[0]
          let p = elegeta('td:nth-child(2) ul li.pryen a', e?.closest("tr"))[0]
          let b = e.parentNode
          let cpu = parseInt(e.innerText.replace(/\D/g, ""))
          let price = parseInt(p.innerText.replace(/\D/g, ""))
          if (e.textContent.match(/\d/)) {
            e.insertAdjacentHTML("beforeend", `<div title="Aキーでこの上限で絞り込み" class="cps" style="color:#F00;" >価格/スコア<br><span class="cputanka">${((price/cpu).toFixed(2))}</span></div>`)
          } else {
            end(e, '<span class="cputanka"></span>')
          }
        })
      },
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          if (!elegeta('//th[@class="sub thHeader" and contains(text(),"CPUスコア")]')[0]) return;
          GF.base = proInput("CPUスコア単価上限を入力してください", $('#CPS').data("cps") || 10) || 0;
          autoPagerizedD("cpsAP", () => {
            $('#CPS').remove();
            $(document.body).append(`<span id="CPS" data-cps="${GF.base}" style="background-color:#"></span>`)
            $(elegeta('table tbody tr.tr-border')).show()
            if (GF.base <= 0) return
            elegeta('.cputanka').forEach(e => {
              let cps = Number(e?.innerText || 0)
              let b = e.closest("tr.tr-border")
              if (!cps || cps > GF.base) {
                $([b, b.previousSibling, b.previousSibling.previousSibling]).hide()
              }
            })
          })
        }
      }, ],
    }, {
      urlRE: /\/\/www.ftbucket.info\/scrapshot\/ftb\/index\.php|\/\/www.ftbucket.info\/scrapshot\/ftb\/?$|\/\/www.ftbucket.info\/scrapshot\/ftb\/\?favo=/,
      id: 'FUTACHAN_CATALOG',
      listTitleXP: '//div[@class="tdDiv"]/span/div',
      listTitleSearchXP: '//div[@class="tdDiv"]/span/div[***]/../..',
      listTitleMemoSearchXP: '//td/div[@class="tdDiv"]/span/div[***]',
      listGen: 5,
      listTitleXPIgnoreNotExist: 1,
      listGen: 4,
      WhateverFirstAndEveryAPFunc: () => {
        popup3("Shift+F：FTBucket検索", 8, 5000)
      },
      //      WhateverFirstAndEveryAPFunc: () => { SITEINFO[SITEINFO.findIndex(c => c.id == "FUTACHAN")].WhateverFirstAndEveryAPFunc() },
      keyFunc: [{
        key: 'Shift+F', // Shift+F::FTBucketでキーワード検索
        func: () => { searchWithHistory("FUTACHAN", "FTBucketとふたば★さーち", ['https://www.ftbucket.info/scrapshot/ftb/index.php?mode=c&favo=0&ord=1&s=***', `https://zzzsearch.com/futaba/#gsc.q=***&gsc.sort=date`], "|") },
        //https://zzzsearch.com/futaba/#gsc.q=%E8%87%AA%E7%82%8A&gsc.sort=date
        //        func: () => { SITEINFO[SITEINFO.findIndex(c => c.id == "FUTACHAN")].keyFunc[0].func() },
      }],
      //      memoStyle:'display:inline-block;',
      //listTitleMemoSearchXPSameGen: 1,
      delay: 333,
      funcOnlyFirst: () => {
        //if (!lh("mode=c")) return;

        eleget0('//html/body/table[2]')?.setAttribute("id", "cattable")
        $('#cattable td').wrapInner('<div class="tdDiv"></div>')
        begin(document.body, `<div id="slidersP" style="position:fixed;z-index:999; top:1em; right:1em;"><div id="sliders1"></div><br><div id="sliders2"></div><br><div id="sliders3"></div><br><div id="sliders4"></div><br></div>`)
        $('#cattable td>a>img').css({ "border": "black solid 1px" }).wrap('<div class="imgDiv"></div>')
        //        $('#cattable td').wrapInner('<div class="tdDiv"></div>')

        setSlider(eleget0('#sliders4'), 0, 300, 0, "box高さ:***px", "futabucket_catalog_boxheight", (val) => {
          eleget0('#boxheightcss')?.remove()
          if (val) end(document.head, `<style id="boxheightcss">#cattable tbody tr td{height:calc(${val - 2}px - 0.5em); } tbody{display:grid !important;} #cattable tbody tr { display:inline-block; overflow:hidden; margin:0 auto; min-height:${val - 2}px !important; max-height:${val - 2}px !important; height:${val - 2}px !important;}</style>`)
        }, 0, '')

        setSlider(eleget0('#sliders3'), 0, 500, 0, "box横幅:***px", "futabucket_catalog_boxwidth", (val) => {
          eleget0('#boxwidthcss')?.remove()
          $('#cattable td a+br').remove()
          if (val) end(document.head, `<style id="boxwidthcss">.tdDiv{margin:5px;} #cattable tbody tr td{line-break: anywhere; } #cattable tbody tr td img{float:left; margin-bottom:5px; margin-right:5px;} #cattable tbody tr td{vertical-align:top; word-break:break-all; width:${1+val}px !important; max-width:${1+val}px !important;}</style>`)
          if (val) elegeta('td div span[title] div').forEach(e => e.textContent = e.parentNode.title)
        }, 0, '')

        //setSlider(eleget0('#sliders'), 1, 24 * 3, 12 * 3, "文字サイズ:***/3px", "futabucket_catalog_fontsize", (val) => {
        //  eleget0('#textsizecss')?.remove()
        //  end(document.head, `<style id="textsizecss">#cattable div{font-size:${val/3}px !important; }</style>`)
        //}, 0, '')

        setSlider(eleget0('#sliders2'), 0, 320, 0, "画像サイズ:***px", "futabucket_catalog_imagesize", (val) => {
          eleget0('#imagesizecss')?.remove()
          if (val) end(document.head, `<style id="imagesizecss">#cattable img{ object-fit: cover !important; max-width:${val}px !important; width:auto !important; height:auto !important; max-height:${val}px !important; }</style>`)
        }, 0, '')

        setSlider(eleget0('#sliders1'), 0, 20, 0, "タイトル行数:***行", "futabucket_catalog_titlerow", (val) => {
          eleget0('#catalogrowscss')?.remove()
          if (val) end(document.head, `<style id="catalogrowscss">#cattable .tdDiv span div{ display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${val} !important;; overflow: hidden; }</style>`)
          if (val) elegeta('td div span[title] div').forEach(e => e.textContent = e.parentNode.title)
        }, 0, '')

        /*elegeta('//div/input[@type="search" and @id="searchword"]').forEach(e => e.style.width = "calc(100% - 4em)") // 検索フォームを大きく
        if (location.href.match0("//www.ftbucket.info/scrapshot/ftb/")) {
          setSlider(eleget0('//html/body/div[2]/a/img/..'), 4, 255, 16, "タイトル表示:***文字", "FTBTitleLength", (val) => elegeta('//td/span[@title]/div').forEach(e => e.textContent = e.parentNode.title.substr(0, val)))
          setSlider(eleget0('//html/body/div[2]/a/img/..'), 4, 30, 8, "セル幅:***em", "FTBcallWidth", (val) => elegeta('//td/span[@title]/div/../..').forEach(e => e.style.width = `${val}em`))
        }*/
      },
    }, {
      urlRE: "\/\/futapo.futakuro.com", // futapo::
      id: 'FUTACHAN_CATALOG',
      id2: "futapo-catalog",
      listTitleXP: '//div[@class="thread-text"]',
      listTitleSearchXP: '//div[@class="thread-text"][***]/../..|.//span[@class="emph"][***]/../../..',
      listTitleMemoSearchXP: '//div[@class="thread-text"][***]|.//span[@class="emph"][***]/..',
      listGen: 5,
      Bsyntax2: 1,
      memoStyle: 'word-break:break-all; font-size:10px !important; line-height:130%; padding:0px 4px 0px 4px; line-break:anywhere;',
      preventMemo: m => ["★", "◎", "○"].includes(m),
      QRule: "\n\n非表示化に関しては正規表現は使えませんが\nこのサイトではここで登録した内容で8/9メモの追加動作の抑制ができ、\nその抑制に関してだけは正規表現が使え、全角/半角、大文字/小文字も区別しません\n",
      listTitleXPIgnoreNotExist: 1,
      observe: 666,
      observeClass: ["box", "box ", "yhmMyMemo"], //2022年07月12日
      WhateverFirstAndEveryAPFunc: () => {
        popup3("Shift+F：FTBucket検索\n7：左上優先配置タイトルを設定\n8：左上優先配置(+通知)タイトルを設定\n9：左上優先配置(+開く)タイトルを設定\nShift+789：独自構文使用版789\n0：789メモ一括削除画面\nE：更新　D：下まで読み込む\nG：画像でNG　H：画像でピックアップ", 8, 5000) // ↻
      },
      listTitleMemoSearchXPSameGen: 1,
      funcOnlyFirst: () => {
        hoverHelp(e => {
          if (e.closest('a.box img.thumbnail')) return "Ｇ：この画像でNG<BR>Ｈ：この画像でピックアップ";
          if (e.closest('a.box')) return "Ｑ：非表示　Ｗ：アンドゥ"
        })
        GF.latestReload = Date.now() - 3000;
        GF.reloadAddTime = 0;
        GF.FUTAPO_AUTO_RELOAD_DEFAULT = pref("FUTAPO_AUTO_RELOAD_DEFAULT") || 0;
        GM_addStyle('.graybutton{ cursor:pointer; position: fixed; z-index:100; opacity:1; font-size:12px;  margin:0px 1px; padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; border:solid 1px #888; background-color:#fff; color:#888;}')
        GM_addStyle('.popuptext,.popuptext-back{z-index:1000000000000;}')
        GM_addStyle(".boxpri1{animation: pulse1 5s 1; } @keyframes pulse1 { 0% { outline:5px solid #0000ffff; } 40% { outline:5px solid #0000ffff; } 100% { outline:5px solid #0000ff00; } }")
        document.querySelector(`head`).insertAdjacentHTML('beforeend', `<style>.waiting{ display: inline-block; vertical-align: middle; color: #666; line-height: 1; width: 1em; height: 1em; border: 0.12em solid currentColor; border-top-color: rgba(102, 102, 102, 0.3); border-radius: 50%; box-sizing: border-box; -webkit-animation: rotate 1s linear infinite; animation: rotate 1s linear infinite; } @-webkit-keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } } @keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }</style>`)

        if (FUTAPO_CRAM_TITLE) GM_addStyle("div.thread-contents {  padding-left: 0px !important;} div.thumbnailContainer { min-width:3em; position:inherit !important; margin-left: 0px !important;}") // boxの横幅が狭いときでもタイトルを詰め込む

        // フィルタフォームでEscで削除して抜ける
        document.addEventListener("keydown", e => {
          if (document?.activeElement?.matches("input#cat_text_search") && e.key == "Escape" && !e.isComposing) {
            $("input#cat_text_search").val("").blur()
          }
        }, true)

        var lastope = Date.now()
        var cdID
        //if (eleget0('#reload') && !cdID) {
        function waitAndDo(checkFunc, func) { // checkFuncがtrueになったらfuncを実行
          if (!checkFunc()) setTimeout(waitAndDo, 500, checkFunc, func);
          else func();
        }

        function switchReload() {
          document.body.insertAdjacentHTML("beforeend", `<tt id="cdsw" class="graybutton ignoreMe" style="cursor:pointer;left:1em; bottom:2em; position:fixed;" title="左クリックで無操作時60秒毎に自動更新開始\nもう一度左クリックで停止">&#9211;無操作<br>自動更新</tt>`)

          $(document).on("mousedown", `#cdsw`, (e) => {
            if (e?.button != 0) return;
            cdon()
          })

          function cdon() {
            pref("FUTAPO_AUTO_RELOAD_DEFAULT", 1)
            $('#cdsw').fadeOut(222);
            var lastope = Date.now()
            $(document).on("mousemove mousedown keydown", () => { lastope = Date.now() })

            clearInterval(GF?.cdID);
            GF.cdID = setInterval(() => {
              if (document.visibilityState == "visible") {
                $('#cd,#cdsw').remove();
                document.body.insertAdjacentHTML("beforeend", `<tt id="cd" class="graybutton ignoreMe" style="left:1em; bottom:2em; opacity:0.9; ">${Math.max(0,~~(60.9-(Date.now()-lastope)/1000))}</tt>`) //&#9213;
              }
              if (Date.now() - lastope > 60 * 1000 && !eleget0('.blinkingOL')) { // 開き待ちのが１つでもあれば押さない
                lastope = Date.now();
                eleget0('a#reload.contents')?.click() //eleget0('//li[1]/a[@id="reload"]')?.click()
              }
            }, 1000)
          }

          $(document).on("mousedown", `#cd`, (e) => {
            if (e?.button != 0) return;
            cdoff()
          })

          function cdoff() {
            pref("FUTAPO_AUTO_RELOAD_DEFAULT", "")
            clearInterval(GF?.cdID);
            $('#cd,#cdsw').remove() //text("停止")//.hide(999);
            document.body.insertAdjacentHTML("beforeend", `<tt id="cdsw" class="graybutton ignoreMe" style="cursor:pointer;left:1em; bottom:2em; position:fixed;" title="左クリックで無操作時60秒毎に自動更新開始\nもう一度左クリックで停止\n\n9:${GF?.opened2?.size||0}\n8:${GF?.opened1?.size||0}\n7:${GF?.opened?.size||0}\n">&#9211;無操作<br>自動更新</tt>`)
          }

          if (GF.FUTAPO_AUTO_RELOAD_DEFAULT >= 1) cdon() //$("#cdsw").click()
          if (GF.FUTAPO_AUTO_RELOAD_DEFAULT >= 2) scr(0)
        }
        waitAndDo(() => eleget0('#reload'), switchReload)
        setTimeout(() => {

          function scr(i) {
            let last = eleget0('#kako-search')
            window.scroll({ left: 0, top: last ? 0 : 99999, behavior: i % 2 == 1 ? "instant" : "smooth" })
            if (!last && i < 99) setTimeout(() => { scr(++i) }, 100)
          }
          //      setTimeout(() => {
          elegeta("#reload,#logo,#cdsw").forEach(e => e.title = e?.title + "\nE：更新\nD/右クリック：更新＋下まで読み込み") // ↻
          $(document).on("contextmenu", '#reload,#logo,#cdsw,#cd', () => { // d::
            let r = eleget0('//a[@id="reload"]');
            if (r) {
              if (!GF.latestReload || new Date().getTime() - GF.latestReload > 5000) {
                r.click();
                scr(0)
                GF.latestReload = Date.now();
                GF.reloadAddTime = 0;
              } // 要5秒インターバル
            }
            return false
          })

          $('a#server.pulldown').attr("title", ($("a#server.pulldown").attr("title") || "") + "\n右クリック：may←→img") // ↻
          $('a#server.pulldown').on("contextmenu", () => {
            let url = location.href == 'https://futapo.futakuro.com/?server=img_b' ? 'https://futapo.futakuro.com/?server=may_b' : 'https://futapo.futakuro.com/?server=img_b'
            location.href = url;
            return false
          })
          $('a#mode.pulldown').on("contextmenu", () => {
            let url = lh(/\&mode=6_0/) ? location.href.replace("&mode=6_0", "&mode=4_0") : lh(/\&mode=4_0/) ? location.href.replace("&mode=4_0", "&mode=6_0") : `https://futapo.futakuro.com/?server=may_b&mode=4_0&search=&searchMode=0&kako=0`
            location.href = url;
            return false
          })
          /*          if (FUTAPO_AUTO_RELOAD_DEFAULT >= 1) $("#cdsw").click()
                    if (FUTAPO_AUTO_RELOAD_DEFAULT >= 2) scr(0)
          */
        }, 500)

        GM_addStyle("div.thread-text{display:inline;line-break: anywhere;} .thread-text{word-break:break-all;}") // html{line-height:1.2;}
        setTimeout(() => {
          setSlider(eleget0('//div[@id="boxArea"]'), 54, 300, 54, "box高さ:***", "boxheight", (val) => {
            eleget0('#boxheightcss')?.remove()
            end(document.head, `<style id="boxheightcss">div.thread-contents{height:${val - 2}px !important;} a.box{height:${15 + val}px !important;}</style>`)
          }, 0, 'style="width:7em;height:0.5em;"')
          setSlider(eleget0('//div[@id="boxArea"]'), 0, 10, 5, "タイトル行間:***", "lineheight", (val) => {
            eleget0('#boxlineheightcss')?.remove()
            end(document.head, `<style id="boxlineheightcss">html{line-height:${1+val/10} !important;}</style>`)
          }, 0, 'style="width:7em;height:0.5em;"')
        }, 999)
      },
      funcMemo: () => { SITE.funcFinally() },
      funcFinally: (disableHide, numberOfHidden) => {
        setTimeout(() => {
          let found = 0;

          // 7::8::9:: メモが付いたものを左上に優先整列
          // ここの7/8/9動作は正規表現対応や大文字小文字全角半角非区別のために標準のメモが付く動作（正規表現非対応）や非表示動作（正規表現非対応）とは一致しない点に注意
          try {
            // メモをクリックで消す＆ESC/パネル外をクリックでパネルを消す動作を登録
            if (!GF.yhmMemoDeleteButton) {
              GF.yhmMemoDeleteButton = 1
              $(document).on("keydown", e => {
                if (e.key === "Escape") $('#yhmMemoDeletePanel').hide(200).queue(function() {
                  $(this).remove();
                  run("observed");
                })
              })
              $(document).on("mousedown", e => {
                if (!e?.target?.closest("#yhmMemoDeletePanel") || e?.target?.matches("#yhmMemoDeletePanelClose")) $('#yhmMemoDeletePanel').hide(200).queue(function() {
                  $(this).remove();
                  run("observed");
                })
              })
              $(document).on("click", ".yhmMemoDeleteButton,.yhmNoSelect", e => { // クリックで削除
                let ele = e.target?.closest(".yhmMemoDeleteButton")
                if (!ele) return;
                // 非表示
                if (ele?.dataset?.qword) {
                  var str = pref(SITE.id + ' : SearchHideTitle') || [];
                  let qword = str.find(v => escape(v) === ele?.dataset?.qword)
                  if (qword) {
                    $(ele).hide(200).queue(function() { $(this).remove() }); // これは削除パネル用の動作
                    //elegeta('.yhmMyMemo').filter(e => e === escape(qword)).forEach(e => { $(e).hide(200).queue(function() { $(this).remove() }) })
                    //adja(document.body, "afterbegin", "<yhmmymemoremoved></yhmmymemoremoved>");
                    //eleget0('yhmmymemoremoved')?.remove(); // 学園祭用に消去を告知
                    GM.setClipboard(qword)
                    showByTitle(qword)
                    pref(SITE.id + ' : SearchHideTitle', (pref(SITE.id + ' : SearchHideTitle') || []).filter(n => n != qword))
                  }
                  e.preventDefault()
                  return false
                } else {
                  // メモ
                  var str = pref(SITE.id + ' : SearchMyMemo') || [];
                  let memo = str.find(v => escape(v.t + v.m + v.c) === ele.id)
                  if (memo) {
                    $(ele).hide(200).queue(function() { $(this).remove() }); // これは削除パネル用の動作
                    elegeta('.yhmMyMemo').filter(e => e.id === escape(memo.t + memo.m + memo.c)).forEach(e => { $(e).hide(200).queue(function() { $(this).remove() }) })
                    //adja(document.body, "afterbegin", "<yhmmymemoremoved></yhmmymemoremoved>");
                    //eleget0('yhmmymemoremoved')?.remove(); // 学園祭用に消去を告知
                    document.body.dispatchEvent(new Event('yhmMyMemoRemoved'))
                    GM.setClipboard(memo.t)
                    pref(SITE.id + ' : SearchMyMemo', (pref(SITE.id + ' : SearchMyMemo') || []).filter(n => JS(n) !== JS(memo)))
                  }
                  e.preventDefault()
                  return false
                }
              })
              document.addEventListener("scroll", e => {
                let my = eleget0('#yhmMemoDeletePanel')?.getBoundingClientRect()?.bottom + window.scrollY - clientHeight() + 15
                if (window.scrollY > my) window.scrollTo({ left: 0, behavior: "smooth", top: my })
              })
            }

            let memoa = pref(SITE.id + ' : SearchMyMemo') || [];
            memoa = memoa.filter(v => SITE?.preventMemo(v.m)).map(v => {
              v.than = han(v.t);
              if (isValidRE(v.t)) v.re = new RegExp(v.t, "mi");
              return v
            }) // 重いので計算を最内周でせず１回で済ます
            let hide = disableHide ? [] : pref(SITE.id + ' : SearchHideTitle') || [];
            hide = hide.map(v => { return { word: v, re: isValidRE(v) ? new RegExp(v, "mi") : null } }); // 重いので計算を最内周でせず１回で済ます

            var hit = new Set()
            for (let e of elegeta('.box:not([relocatedByMemo])')) {
              let tt = eleget0('.thread-text', e)?.textContent
              for (let v of memoa) {
                if (v.re && v.re.test(han(tt)) ||
                  tt?.indexOf(v.t) !== -1) { // u/U/jメモ登録ワードが正規表現として有効なら正規表現としてチェック、また単純文字列としてヒットしてもヒットとする
                  hit.add(e)
                  e.dataset.vip = Math.max("○◎★".indexOf(v.m), e.dataset?.vip || 0) // 9>8>7の順で強い結果を残す
                  e.title = `${e.title?e.title+" ":""}${v.m}${v.t}`
                  e.dataset.hitwords = `${e.dataset.hitwords?e.dataset.hitwords+" ":""}${v.m}${v.t}`;
                  if (v?.t?.length > 3) { if (!eleget0(`*[id="${escape(v.t+v.m+v.c)}"]`, e)) after(eleget0('.thread-text', e), `<span class="ignoreMe yhmMyMemo yhmMemoDeleteButton" id="${escape(v.t+v.m+v.c)}" title="『${sani(v.t)}』についたメモ\nクリックで削除＆クリップボードにコピー" style="${MEMOSTYLE} cursor:pointer; background-color:${v.c}; border-radius:1em; color:#fff;">${sani(v.m)}${sani(v.t)?.substr(0,25)+(v?.t?.length>25?"…":"")}</span>`) } else {
                    if (!eleget0(`*[id="${escape(v.t+v.m+v.c)}"]`, e)) after(eleget0('.thread-text', e), `<ruby class="ignoreMe yhmMyMemo yhmMemoDeleteButton" id="${escape(v.t+v.m+v.c)}" title="『${sani(v.t)}』についたメモ\nクリックで削除＆クリップボードにコピー"><span class="ignoreMe yhmMyMemo" style="${MEMOSTYLE} cursor:pointer; background-color:${v.c}; border-radius:1em; color:#fff;">${sani(v.m)}${sani(v.t)?.substr(0,25)+(v?.t?.length>25?"…":"")}</span></ruby>`)
                  }
                }
              }
              eleget0('.thumbnail', e)?.setAttribute("title", `${tt}\n${e.title}`)
            }
            GF.opened = new Set([...(GF?.opened || new Set())].slice(-999))
            GF.opened1 = new Set([...(GF?.opened1 || new Set())].slice(-999))
            GF.opened2 = new Set([...(GF?.opened2 || new Set())].slice(-999))
            while (1) {
              var b = elegeta('.box:not([relocatedByMemo])')
              var e = b.find(v => hit.has(v))
              if (!e) break;

              //GF.opened.push(e.href)

              let vip = Number(e.dataset.vip)
              e.setAttribute("relocatedByMemo", "")
              let memoEle = e
              let firstBox = elegeta('.box:not(.boxpri,.boxpri2)').filter(e => e.style.backgroundColor !== "rgb(255, 255, 0)")[0]
              if (vip == 1) {
                firstBox = elegeta('.box:not(.boxpri2,.boxpri3)').filter(e => e.style.backgroundColor !== "rgb(255, 255, 0)")[0]
                eleget0('.thread-text', memoEle).style.color = "#12e";
                memoEle.style.boxShadow = "4px 4px 4px 0px #0006";
                memoEle.style.zIndex = 2;
                memoEle.style.fontWeight = "bold"
                memoEle.classList.add("boxpri2")
              } else if (vip == 2) {
                firstBox = elegeta('.box:not(.boxpri3)').filter(e => e.style.backgroundColor !== "rgb(255, 255, 0)")[0]
                eleget0('.thread-text', memoEle).style.color = "#12e";
                memoEle.style.boxShadow = "4px 4px 4px 0px #0006";
                memoEle.style.zIndex = 3;
                memoEle.style.fontWeight = "bold"
                memoEle.classList.add("boxpri3")
              } else {
                memoEle.style.boxShadow = "4px 4px 4px #0006";
                memoEle.style.zIndex = 1;
              }
              memoEle.classList.add("boxpri")

              firstBox.parentNode.insertBefore(memoEle, firstBox)

              // Qの非表示にヒットしたものは除外、正規表現対応・全角半角非区別・大文字小文字非区別
              let tt = eleget0('.thread-text', e)?.textContent;
              let hitPreventWord = hide.find(q => {
                return q.re && q.re.test(han(tt)) || tt?.indexOf(q.word) !== -1
              }) // Q非表示登録ワードが正規表現として有効なら正規表現としてもチェック、また単純文字列としてヒットしてもヒットとする
              if (!(disableHide || !hitPreventWord)) {
                e.title += `\n\nブロックワード『${hitPreventWord?.word}』で抑制`
              } else {
                if (vip == 0 && e.offsetHeight && !GF.opened.has(e.href)) {
                  GF.opened.add(e.href);
                }

                if (vip == 1 && e.offsetHeight && !GF.opened1.has(e.href)) {
                  GF.opened1.add(e.href);
                  found = memoEle.cloneNode(true);
                  if (FUTAPO_89_NOTIFY.split(" ").includes("notify")) notifyMe(eleget0(".thread-text", found)?.innerText, e.dataset.hitwords, e => {
                    e.preventDefault(); //`${"\n\n"+eleget0('//a[@id="server"]')?.innerText||""}`
                    window.open(memoEle.href, "", "noreferrer");
                  }, eleget0('img', found)?.src)
                }
                if (vip == 2 && e.offsetHeight && !GF.opened2.has(e.href)) {
                  GF.opened2.add(e.href);
                  //                  GF.open = GF.open || []
                  found = memoEle.cloneNode(true);
                  if (FUTAPO_89_NOTIFY.split(" ").includes("notify")) notifyMe(eleget0(".thread-text", found)?.innerText, e.dataset.hitwords, e => {
                    e.preventDefault();
                    window.open(memoEle.href, "", "noreferrer");
                  }, eleget0('img', found)?.src)
                  memoEle.classList.add('blinkingOL')
                  addstyle.add('@keyframes outline { 0% { outline: 4px solid #f0f; } 100% { outline: 4px solid #c8f; } } .blinkingOL{ animation: outline 1s ease infinite alternate; }')

                  function opentab(href) {
                    if (Date.now() - (GF.latest || 0) > (ISCHROME ? 7000 : 5000)) {
                      GF.latest = Date.now()
                      if (!lh('&mode=90_0')) {
                        GM.openInTab(href, true)
                        memoEle.classList.remove('blinkingOL')
                      }
                    } else {
                      setTimeout(opentab, 333, href) //setTimeout(() => { opentab(href) }, 333)
                    }
                  }
                  opentab(memoEle.href)
                  //}
                }
              }
            }
            if (found) {
              //if (FUTAPO_SOUND_NOTIFY) sound("sine", 0.1);
              if (FUTAPO_89_NOTIFY.split(" ").includes("sound")) sound("sine", 0.1);
            }
          } catch (e) { if (DEBUG_CATCH) alert(e) }
        }, 200)
        if (numberOfHidden) window.dispatchEvent(new CustomEvent('scroll')) // 非表示をしてスレアイテム数が画面に入り切るようになるとスクロールができなくて続きがあっても読み込めなくなるのでスクロールイベントだけ起こす
      },
      keyFunc: [{
        key: /^g$|^h$/, // g::画像でNG h::画像でピックアップ
        func: (k) => {
          e = eleget0('img.thumbnail:hover')
          if (e) {
            eleget0('div.cat-menu', e?.closest(".box"))?.click()
            eleget0(k == "h" ? 'a#th_img_pickup' : 'a#th_img_ng')?.click()
            /*            waitdo(() => eleget0('select[name="img_match"]'), e => e.value = "100")
                        waitdo(() => eleget0('input#all_board'), e => e?.click())
                        waitdo(() => eleget0('input#save.submit.option-button'), e => e?.focus())
             */
            waitdo(() => eleget0('select[name="img_match"]'), e => e.value = pref("FUTAPO_IMAGE_NG_PERCENT") || "100")
            waitdo(() => eleget0('input#all_board'), e => e?.click())
            waitdo(() => eleget0('input#save.submit.option-button'), e => e?.focus())
            waitdo(() => eleget0('select[name="img_match"]'), () => {
              eleget0('select[name="img_match"]')?.addEventListener("change", e => {
                pref("FUTAPO_IMAGE_NG_PERCENT", e.target.value)
              })
            })
          }
        }
      }, {
        key: 'd', // d::
        func: (e) => {
          let r = eleget0('//a[@id="reload"]');
          if (r) {
            let scr = (i) => {
              let last = eleget0('#kako-search')
              window.scroll({ left: 0, top: last ? 0 : 99999, behavior: i % 2 == 1 ? "instant" : "smooth" })
              if (!last && i < 100) setTimeout(() => { scr(++i) }, 100) // 10秒まで
              //if (!last && i < 150) setTimeout(() => { scr(++i) }, 100) // 15秒まで
            }
            scr(0)
            //} // 要5秒インターバル
          }
        },
      }, {
        key: 'e', // e::リロード
        func: () => {
          let r = eleget0('//a[@id="reload"]');
          if (r) {
            if (!GF.latestReload || new Date().getTime() - GF.latestReload > 4000) {
              r.click();
              GF.latestReload = Date.now();
              GF.reloadAddTime = 0;
            } // 要4秒インターバル
          }
        },
      }, {
        key: 'Shift+F', // Shift+F::FTBucketでキーワード検索
        func: () => { searchWithHistory("FUTACHAN", "FTBucketとふたば★さーち", ['https://www.ftbucket.info/scrapshot/ftb/index.php?mode=c&favo=0&ord=1&s=***', `https://zzzsearch.com/futaba/#gsc.q=***&gsc.sort=date`], "|") },
      }, {
        key: /^7$|^8$|^9$|^Shift\+\'$|^Shift\+\($|^Shift\+\)$/, // 7::8::9::Shift+789
        func: (e, opt, site) => {
          let shift = e.match0("Shift+");
          var str = pref(site.id + ' : SearchMyMemo') || [];
          let memostr = (e == "9" || e == "Shift+)") ? "★" : (e == "7" || e == "Shift+'") ? "○" : "◎"
          var newstr = str.filter(e => e.m === memostr).map(e => e.t)
          GF.sorttype = ((GF.sorttype || 0) % 3 + 1)
          var [order, finstrfunc] = [
            ["登録順", a => a.reverse().join("　")],
            ["abc順", a => a.reverse().sort(new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare).join("　")],
            ["長さ→abc順", a => a.reverse().sort((a, b) => a.length === b.length ? (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a, b) : a.length > b.length ? 1 : -1).join("　")]
          ][GF.sorttype - 1]
          let tips = shift ? "独自構文Tips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR" : "複数の単語をスペースで区切って入力するとまとめて登録できます";
          var target = (window.getSelection() && window.getSelection().toString().trim()) || (prompt(`futapoで${memostr}メモを付けるキーワードを入力してください\n\nfutapoではここで設定した項目、メモが付く項目を左上に優先配置します\n（部分一致、正規表現使用可）\n\n${"7:○メモではヒットした項目を左上に優先配置します\n8:◎メモではさらに音声とNotificationで通知します\n9:★メモでは更に自動的に新しいタブで開きます"}\n\nすでに登録されている文字列を入力するとそれを削除します\n\n${tips}\n\n現在登録済み（${newstr.length}）： （${order}）\n${finstrfunc(newstr)}\n\n`) || "").trim();
          if (!target) return;
          let targets = shift ? [target.replace(/^S$/, "??").replace(/^S([\s　\|｜])/, "??$1").replace(/([\s　\|｜!！])S([\s　\|｜])/, "$1??$2").replace(/([\s　\|｜!！])S$/, "$1??").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*")] // 独自構文を正規表現に変換
            :
            target.split(/\s|　/)

          var dele = 0;
          targets.forEach(targetc => {
            targetc = targetc.trim()
            var str = pref(site.id + ' : SearchMyMemo') || [];
            var str2 = str.filter(e => { return e.t != targetc })
            if (str.length != str2.length) {
              if (confirm(`『${targetc}』（${str.find(e=>e.t==targetc)?.m}）は既に存在します\n削除しますか？`)) {
                if (debug) V && dc(`『${targetc}』をメモから削除しました`)
                pref(site.id + ' : SearchMyMemo', JSON.stringify(str2));
                dele = 1;
                elegeta('[relocatedByMemo]').forEach(v => v.removeAttribute("relocatedByMemo"))
                $(".yhmMyMemo").remove()
                run("returned")
              }
            } else {
              storeMemo(targetc.trim(), memostr, COLOR1, null, null, site)
              elegeta('[relocatedByMemo]').forEach(v => v.removeAttribute("relocatedByMemo"))
              run("returned")
            }
          })
          if (dele) run(document.body, "returned")
        },
      }, {
        key: /^0$/, // 0::メモ一覧一括削除画面
        func: (e, opt, site) => {
          var str = pref(site.id + ' : SearchMyMemo') || [];
          var newstr = str
          GF.sorttype = eleget0("#yhmMemoDeletePanel") ? ((GF.sorttype) + 1) : 1
          var [order, finstrfunc] = [
            ["登録順", a => a.reverse()],
            ["abc順→種別", a => a.sort((a, b) => a.m == b.m ? 0 : a.m < b.m ? 1 : -1).sort((a, b) => (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.t, b.t))],
            ["長さ→abc順→種別", a => a.sort((a, b) => a.m == b.m ? 0 : a.m < b.m ? 1 : -1).sort((a, b) => a.t.length === b.t.length ? (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.t, b.t) : a.t.length > b.t.length ? 1 : -1)],
            ["種別→登録順", a => a.reverse().sort((a, b) => a.m == b.m ? 0 : a.m < b.m ? 1 : -1)],
            ["種別→abc順", a => a.sort((a, b) => (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.t, b.t)).sort((a, b) => a.m == b.m ? 0 : a.m < b.m ? 1 : -1)],
            ["種別→長さ→abc順", a => a.sort((a, b) => a.t.length === b.t.length ? (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.t, b.t) : a.t.length > b.t.length ? 1 : -1).sort((a, b) => a.m == b.m ? 0 : a.m < b.m ? 1 : -1)]
          ][(GF.sorttype - 1) % 6]
          var words = finstrfunc(newstr)
          $("#yhmMemoDeletePanel").remove()
          end(document.body, `<div id="yhmMemoDeletePanel" style="width:85%; font-size:95%; position:absolute; top:1em; left: 50%; transform: translate(-50%, 0%); box-shadow:0px 0px 2em #0008; word-break:keep-all; z-index:${Number.MAX_SAFE_INTEGER}; padding:2em; margin:auto; background-color:#fff; line-height:1.8em;"><span id="yhmMemoDeletePanelClose" style="cursor:pointer;float:right;">×(Esc)</span>0:メモ＆非表示一括削除<br>メモ（${words.length}）（${order}）をクリックすると削除してクリップボードにコピーします<br><div>`)
          let dup = [] // 重複しているものは暗い色にする
          let list = ""
          words.forEach(w => {
            //            list += `<span class="yhmMemoDeleteButton" id="${escape(w.t+w.m+w.c)}" data-m="${escape(w.m)}" data-t="${escape(w.t)}" data-c="${escape(w.c)}" style="cursor:pointer; background-color:${w.c}; ${dup.includes(w.t)?"filter:saturate(0.66);":""} padding:1px 0.4em 1px 0.3em; margin:0; border-radius:1em; color:#fff;"><font class="yhmNoSelect" style="user-select:none;" ${dup.includes(w.t)?'data-gakusai="1"':''}>${sani(w.m)}</font>${sani(w.t)}</span> `
            list += `<span class="yhmMemoDeleteButton" id="${escape(w.t+w.m+w.c)}" style="cursor:pointer; background-color:${w.c}; ${dup.includes(w.t)?"filter:saturate(0.66);":""} padding:1px 0.4em 1px 0.3em; margin:0; border-radius:1em; color:#fff;"><font class="yhmNoSelect" style="user-select:none;" ${dup.includes(w.t)?'data-gakusai="1"':''}>${sani(w.m)}</font>${sani(w.t)}</span> `
            dup.push(w.t)
          })

          var [order, finstrfunc] = [
            ["登録順", a => a.reverse()],
            ["abc順", a => a.sort((a, b) => (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a, b))],
            ["長さ→abc順", a => a.sort((a, b) => a.length === b.length ? (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a, b) : a.length > b.length ? 1 : -1)],
          ][(GF.sorttype - 1) % 3]
          var words = pref(site.id + ' : SearchHideTitle') || [];
          words = finstrfunc(words)
          list += `<br><br>非表示登録（${words.length}）（${order}）をクリックすると削除してクリップボードにコピーします<br>`;
          words.forEach(w => {
            list += `<span class="yhmMemoDeleteButton" id="${escape(w)}" data-qword="${escape(w)}" style="cursor:pointer; background-color:#444;font-weight:500; ${dup.includes(w)?"filter:saturate(0.66);":""} padding:1px 0.5em 1px 0.5em; margin:0; border-radius:1em; color:#fff;">${sani(w)}</span> `;
          })

          end(eleget0("#yhmMemoDeletePanel"), list)
        },
      }, {
        key: 'a', // a::ソート
        func: () => {
          var sorttype = Number($('.yhmSortType')?.attr("id") || 0);
          $('.yhmSortType').remove(), $(document.body).append(`<span class="yhmSortType" id="${++sorttype%4}"></span>`)
          popup2("A：ソート\n" + (["レス数", "勢い", "タイトル", "元"].map((c, i) => "　" + c + (i + 1 == sorttype ? "　←\n" : "\n")).join("")), 6, "min-width:6em;")
          sorttype == 1 && sortdom(elegeta('.box:not(#kako-search)'), v => Number(eleget0('.rescnt', v)?.textContent), 1)
          sorttype == 2 && sortdom(elegeta('.box:not(#kako-search)'), v => Number(0 + eleget0('.ikioi-icon', v)?.textContent) + Number((eleget0('span.red', v)?.textContent + 0 || 0)) * 10, 1)
          sorttype == 3 && sortdom(elegeta('.box:not(#kako-search)'), v => (eleget0('.thread-text', v)?.textContent))
          sorttype == 4 && sortdom(elegeta('.box:not(#kako-search)'), v => v?.dataset?.idx)
        }
      }, ],
      wholeHelp: [() => 1, "　A：ソート"],
      hideSelectedWord: 1,
      selectedHelp: { help: [KEYHIDE + "：NGワードに追加", "7/8/9：左上に優先配置（8:+通知/9:+開く）"] }, //, multi: "複数行に渡る文字列は NG に入れられません" },
    },
    {
      id: 'FUTACHAN_CATALOG',
      urlRE: /\/\/anige\.horigiri\.net\/?$|\/\/anige\.horigiri\.net\/\?cat=|\/\/anige\.horigiri\.net\/\?paged=/,
      listTitleXP: '//div/h3[@class="entry-title"]/a',
      listTitleSearchXP: '//div/h3[@class="entry-title"]/a[+++]/../../../..',
      hideSelectedWord: 1,
      listTitleMemoSearchXP: '//div/h3[@class="entry-title"]/a[+++]',
      listGen: 5,
      delat: 500,
      listTitleMemoSearchXPSameGen: 1,
      WhateverFirstAndEveryAPFunc: () => { SITEINFO[SITEINFO.findIndex(c => c.id == "FUTACHAN_CATALOG")].WhateverFirstAndEveryAPFunc() },
      keyFunc: [{
        key: 'Shift+F', // Shift+F::FTBucketでキーワード検索
        func: () => { searchWithHistory("FUTACHAN", "FTBucketとふたば★さーち", ['https://www.ftbucket.info/scrapshot/ftb/index.php?mode=c&favo=0&ord=1&s=***', `https://zzzsearch.com/futaba/#gsc.q=***&gsc.sort=date`], "|") },
      }],
    }, {
      id: 'FUTACHAN', // futaba::
      urlRE: () => (location.protocol == "file:" && eleget0('tbody > tr > th[bgcolor="#e04000"] > font[color="#FFFFFF"]:text*=レス送信モード')) || /\/\/.*.ftbucket.info\/|\/\/kuzure\.but\.jp\/f\/b\/|\/\/[^.]+.2chan\.net\/|\/\/anige\.horigiri\.net|\/\/kako\.futakuro\.com\/futa\/|https?:\/\/tsumanne\.net\/.*\/data\/|\/\/futafuta\.site\/thread\/|\/\/parupunte\.net\/logbox\/detail\.html\?no\=\d+/.test(location.href),
      title: ':is(#pickbox , .thre) table .cno',
      box: ':is(#pickbox , .thre) table',
      funcQ: e => {
        let h = elegeta('a img', e?.closest(".rtd") || null).map(e => `IdH:${img2dhash(e)}`).forEach(v => v != "IdH:null" && addNG(v, "dispall")); // Qで画像も非表示に入れる 2025.03
        //e?.closest('.rtd')?.textContent?.match(/\.(?:jpe?g|png|webp|avif|gif|mp4|mkv)\-\(\d+\sB\)/)?.forEach(v => addNG(v, "dispall")) }, // Qで画像も非表示に入れる 2025.03
      },
      funcHidden: (e, com) => SITE.hideDhash(),
      hideDhash: e => { // 画像もdHsahで覚えて非表示（縮小ぼかし） 2025.03
        (function hideDH(evt) { //console.log("onload",evt?.target,Date.now()); after(evt?.target?.parentNode,`<mark>${(new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</mark>`);
          var qs = JP(JS(pref(SITE.id + ' : SearchHideTitle'))?.normalize("NFC")) || [];
          qs = qs.map(v => v.match0(/^IdH:(.+)$/)).filter(v => v);
          (evt ? [evt?.target] : elegeta('.rtd img')).forEach(img => {
            img?.removeEventListener("load", hideDH);
            if (img.complete) {
              if (qs.includes(img2dhash(img))) {
                img.style.filter = `blur(1em) saturate(33%)`;
                img.title = `非表示登録『IdH:${qs.find(v=>v==img2dhash(img))}』にヒット`;
                !img.closest("#pickbox") && img.animate([{}, { width: "auto", maxHeight: `5em` }], { duration: 100, easing: "ease", fill: "both" })
              } else {
                if (img?.style?.filter == `blur(1em) saturate(33%)`) img.animate([{ filter: `blur(1.1em) saturate(33%)` }, {}], { duration: 8000, easing: "ease-out" })
                img.style.filter = null;
                img.removeAttribute("title");
                !img.closest("#pickbox") && img.animate([{}, { width: "auto", maxHeight: `350px` }], { duration: 100, easing: "ease", fill: "both" })
              }
            } else img.addEventListener("load", hideDH);
          })
        })();
      },
      disableKeyB: 0,
      redoWhenRefocused: 1,
      funcMemo: () => GF.resChained = [],
      //      isMemoPartialMatch:1,
      isHidePartialMatch: 1,
      memoFunc: titleEle => eleget0('.memo', titleEle.closest('tr')),
      memoPosition: "afterbegin",
      listHelpJQS: '.thre table',
      delay: 111,
      memoStyle: 'display:table !important; margin-bottom:2px;',
      //memoStyle: 'display:block !important; width:fit-content; margin-bottom:2px;',
      detailURLRE: /$^/,
      detailTitleXP: '',
      hideSelectedWord: 1,
      selectedHelp: { help: [KEYHIDE + "：NGワードに追加", "y：YouTubeで検索", "7：futapoで左上配置", "8：futapoで通知", "9：futapoで自動で開く"], multi: "y：YouTubeで検索" },
      detailTitleSearchXP: '',
      listTitleSearchFunc: (title) => { // q::レス中キーワードNG　// todo:リロードで追加されたレスにも非表示を適用
        let resHit = [];
        if (typeof title === "string" && !/^No\.\d+$/gmi.test(title)) { // textContentでサーチする
          for (let res of elegeta('.thre table:not(.ftbpu table,#respopup_area table) , #searchResult table')) { // レス全体（ID:～も対象）
            if (res.textContent.indexOf(title) !== -1) resHit.push(res?.closest('table'));
          }
        }
        return resHit;
      },

      WhateverFirstAndEveryAPFunc: () => {
        if (!eleget0('span.ignoreMe.wcspu3bottom.pu3line7s'))
          if (!eleget0('input[value="スレッドを立てる"]')) popup3(`Shift+F：FTBucket検索\na：画像順/そうだね順/引用順でソート${!GF?.isFile && location.href.match0(/^https?:\/\/[^.]+\.2chan\.net\//)?"\ne：新着チェック\nd：新着チェック＋新着に移動\nc：ホバー下にそうだね\nn：自動リロード＆新着通知\nm：監視ワード設定":"\nz/x：動画再生位置を-+\nShift+Z/Shift+X：動画再生速度-+"}`, 7, 5000)
      },

      /*
        setTimeout(()=>{
          let tf=eleget0(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input)')?`\nCtrl+V：クリップボードの画像/動画を添付`:``;
        popup3(`Shift+F：FTBucket検索\na：画像順/そうだね順/引用順でソート${location.href.match0(/^https?:\/\/[^.]+\.2chan\.net\//)?"\ne：新着チェック\nd：新着チェック＋新着に移動\nc：ホバー下にそうだね\nn：自動リロード＆新着通知\nm：監視ワード設定"+tf:""}`, 7, 5000)
        },2100)*/

      funcD: () => { // d::
        let r = location.protocol != "file:" && eleget0("#contres>a,#fvw_loading,a#akahuku_reload_button");
        if (r) {
          if (!GF.latestReload || new Date().getTime() - GF.latestReload > 4000) {
            location.protocol != "file:" && r.click();
            GF.latestReload = Date.now();
            GF.reloadAddTime = 0;
          } // 要4秒インターバル
          setTimeout(() => { eleget0('.reloadline')?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }) }, 200);
        }
      },
      keyFunc: [{
        key: ' ', // Space::すべての画像を一定時間ぼかす
        //        func: (e,evt) => { elegeta('img').forEach(e=>e.animate([{filter:`blur(1em)`,transform:`scale(0.33)`},{}],{duration:8000}));  evt.preventDefault() + evt.stopPropagation(); return false;},//,easing:`ease-out`
        func: (e, evt) => {
          elegeta('.rtd :is(img,video)').forEach(e => e.animate([{ filter: `blur(1.1em) saturate(33%)` }, {}], { duration: 8000, easing: "ease-out" }));
          evt.preventDefault() + evt.stopPropagation();
          return false;
        }, //,easing:`ease-out`
      }, {
        key: /^Shift\+X$|^Shift\+Z$/,
        func: (key, evt) => {
          if (GF?.isFile && !eleget0('div.vsc-controller') && eleget0('img:hover , video:hover')) {
            let pl = /Shift\+X/.test(key);
            let pbs = elegeta('video').reduce((a, b) => Math.max(a, b?.playbackRate || 1), 1) + (pl ? 0.1 : -0.1);
            elegeta('video').find(e => !e.paused) && elegeta('video').forEach(e => {
              e.playbackRate = pbs;
            })
            popup3(`${pl?"Shift+X":"Shift+Z"}：動画再生速度${pl?"↑":"↓"} ×${Math.round(pbs*10)/10}`, 7)
          }
        }
      }, {
        key: /^x$|^z$/,
        func: (key, evt) => {
          let pl = /x/.test(key);
          GF?.isFile && !eleget0('div.vsc-controller') && eleget0('img:hover , video:hover') && elegeta('video').filter(e => !e.paused).forEach(e => {
            e.currentTime = e?.currentTime + (pl ? 1 : -1);
            popup3(`${pl?"x":"z"}：動画再生位置${pl?"+":"-"}1秒　(${Math.round(e?.currentTime)}/${Math.round(e?.duration)})`, 7)
          })
        }
      }, { //          key: /^7$|^8$|^9$|^Shift\+\'$|^Shift\+\($|^Shift\+\)$|^0$/, // 7::8::9::Shift+789 0::
        key: /^7$|^8$|^9$|^Shift\+\'$|^Shift\+\($|^Shift\+\)$/, // 7::8::9::Shift+789 0::
        func: (e) => {
          keyFuncDispatch(e, null, SITEINFO?.find(v => v?.id2 == "futapo-catalog"));
        }
      }, {
        key: "y", // y::
        func: e => {
          let str = window.getSelection()?.toString()?.trim()
          if (!str) return;
          //          let strs = str.split("\n").map(v => v.trim())?.slice(0, 6)
          let strs = str.split("\n").map(v => v?.trim()?.replace(/^…\s+\d+.*$/, "")?.trim())?.filter(v => v > "")?.slice(0, 6)
          let urls = strs.map(str => `https://www.youtube.com/results?search_query=${(str)}`)
          let urls2 = strs.map(str => `https://www.youtube.com/results?search_query=${encodeURI(str)}`)
          if (confirm(`${strs.join("\n")}\nをYouTube検索します（安全のため一度に最大6行にしています）\n\nまたついでに下記をクリップボードにコピーします\nよろしいですか？\n\n${urls.join("\n")}\n`)) {
            GM.setClipboard(strs.map((v, i) => `${v} - YouTube\n${urls2[i]}\n`).join(""))
            urls2.forEach((v, i) => {
              setTimeout(() => {
                GM.openInTab(v, true)
              }, i * 5000)
            })
          }
        }
      }, {
        key: /^(?:Shift\+)?(?:Alt\+)?(?:z|Z)$/, // z::ポップアップを画像として「名前を付けて保存」 Shift+で高画質、Alt+でメモを反映　Alt+だとクリップボードには○メモが付いたものだけコピーする
        id: "z",
        func: (e) => {
          elegeta('.relpost , .relpost2').forEach(e => {
            e.classList.remove("relpost");
            e.classList.remove("relpost2")
          })
          if (document.elementFromPoint(mousex, mousey)?.matches("video,img") || eleget0('.youtubePLViewer:hover')) return;
          let isZ = e.indexOf("Shift+") != -1;
          let target = eleget0('.ftbpu') ? ".ftbpu" : eleget0('#pickbox') ? "#presentPick" : ""
          let orgtarget = eleget0('.ftbpu') ? ".ftbpu" : eleget0('#pickbox') ? "#pickbox" : ""
          if (!target || !orgtarget) return;
          if (target == "#presentPick") {
            let p = end(document.body, `<div id="presentPick" class="ignoreMe" style="padding:5px; width:max-content; max-width:100%; background-color:#ffffeecc; "></div>`)
            if (GF.presentPick) GF.presentPick.forEach(v => p.append(v.cloneNode(true)))
            sortdom(elegeta('#presentPick table[data-rsc]'), v => v.getAttribute("data-rsc"))
          } else {
            let p = eleget0(target).cloneNode(true);
            p.id = "presentPick";
            p.className = "ignoreMe"
            target = "#presentPick"
            document.body.appendChild(p)
            //                end(document.body, `<div id="presentPick" class="ignoreMe" style="padding:5px; width:max-content; max-width:100%; background-color:#ffffeecc; "></div>`)
          }
          if (elegeta(`${target} img:not(.quoteSpeechBalloonImg)`).length) { // 画像が１つでもあったら
            if (1 || !eleget0("#contdisp font:text*=スレッドがありません")) {
              let imgs = ld('kuzure.but.jp') ? elegeta(`${target} a>img[src*="s."]:not([data-rep-lar])`).filter(e => e.src.match(/s\./)) :
                elegeta(`${target} a>img[src*="thumb/"]:not([data-rep-lar])`).filter(e => e.src.match(/thumb\/\d+s\./))
              imgs.forEach(img => {
                let orgHref = img?.parentNode?.href
                if (orgHref?.match(/\.(jpe?g|png|bmp|gif|webp)/)) {
                  cldt("head");
                  img.dataset.repLar = 2;
                  $.ajax({
                    url: orgHref,
                    type: 'HEAD',
                    error: (function(img) {
                      return function() {
                        img.dataset.repLar = 0;
                        cldt(`404`);
                      }
                    })(img),
                    success: (function(img) {
                      return function() {
                        img.src = orgHref;
                        img.dataset.repLar = 1
                        cldt(`replace`);
                      }
                    })(img),
                  });
                }
              })
            }
            let zwait = () => {
              cldt("compele?");
              if (!eleget0(`${target} table a>img[data-rep-lar="2"]`) && elegeta(`${target} table a>img[data-rep-lar="1"]`).every(e => e.complete)) { z(e, isZ ? 3 : 2, isZ ? 3 : 2) } else { setTimeout(zwait, 50) }
            }
            setTimeout(zwait, 100 + elegeta(`${target} img:not(.quoteSpeechBalloonImg)`)?.length * 10)
          } else { z(e, isZ ? 2 : 1.5, isZ ? 2 : 1.5) }

          if (FUTABA_Z_TO_COPY_TO_CLIPBOARD_AS_TEXT_TOO) { // 文字としてもクリップボードにコピー
            let txt = elegeta('table[data-rsc]', eleget0(orgtarget)).filter(v => e.indexOf("Alt+") == -1 || eleget0('.yhmMyMemoO', v)).map(t => FUTABA_Z_TO_COPY_TO_CLIPBOARD_AS_TEXT_TOO.replace("${num1}", eleget0('.rsc', t)?.innerText || "").replace("${name1}", eleget0('.csb', t)?.innerText || "").replace("${name2}", eleget0('.cnm', t)?.innerText || "").replace("${time}", eleget0('.cnw', t)?.innerText || "").replace("${num2}", eleget0('.cno', t)?.innerText || "").replace("${soudane}", eleget0('.sod', t)?.innerText || "").replace("${text}", eleget0('blockquote', t)?.innerText || ""))
            GM.setClipboard(txt.join("\n"))
            popup3(elegeta('table[data-rsc]', eleget0(orgtarget)).map(t => `${eleget0('.rsc',t)?.innerText}`).join(","), 0, 5000, "top")
          }
          return;

          function z(key, SCALE_MIN = 1, SCALE_MAX = 2) {
            var D_FILENAME_MAXLENGTH = 83 // ファイル名の最大長
            if (!eleget0(target)) return;
            let filenameSuffix = (key.indexOf("Alt+") != -1) ? " z2chan" + FUTABA_ALTZ_FILENAME_SUFFIX : " z2chan"

            GF?.zFunc && GF?.zFunc()

            let honbun = elegeta(`${target} blockquote`).map(e => e.innerText)?.join(" ")?.replace(/\s+|\n+/gm, " ")?.trim()
            honbun = honbun?.replace(/\s*\>+[^\s]+/gm, "")?.trim() || res
            honbun = honbun?.slice(0, 100); // ?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm,"");

            if (key.indexOf("Alt+") == -1) {
              $(`${target} .yhmMyMemo,${target} .relallArea,${target} .adddel`).remove()
              $(`${target} .sod`).css({ "font-size": "100%" }).removeClass("sodmypush") //,"float":"right" })
            }
            $(`${target} .relallArea`).remove()

            $(`${target}`).css({ "box-shadow": "none", "transform": "scale(1)" })

            if (orgtarget == "#pickbox") {
              $(`${target} table`).css({ "margin-right": "auto", "margin-left": "0" })
              $(`${target} a img`).css({ "max-height": "" }) // pickの画像縦圧縮を解放する
            }
            $(`${target} .revQuote`).after("<br>"); //css({ "display": "inline-block" })

            addstyle.add(`.yendotsaveElement .GM_FRRS_Counter,.yendotsaveElement .GM_FRRS_own_res{display:none}`)
            elegeta(`${target} .rsc`).forEach(e => e.style = "")

            var hrefName = ""
            //            var fn = `${signzen(document.title?.replace(/\s+|\n+/gm," ")?.trim()+" "+location.href).substr(0, D_FILENAME_MAXLENGTH-hrefName.length-1)} ${hrefName}`?.trim()
            var fn = `${signzen(document.title?.replace(/\s+|\n+/gm," ")?.trim()+" "+location.href).substr(0, D_FILENAME_MAXLENGTH-hrefName.length)}`?.trim()
            var res = honbun
            res = res?.replace(/^\s*\>.*\s*$/gm, "")?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm, "")?.trim() || res;
            //            if (res) fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH/2-hrefName.length-1)} ${signzen(res).substr(0, D_FILENAME_MAXLENGTH/2-1)} ${hrefName}`.trim()
            if (res) fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH/2-hrefName.length)} ${signzen(res).substr(0, D_FILENAME_MAXLENGTH/2)}`.trim()
            //if(filenameSuffix&&fn.length>D_FILENAME_MAXLENGTH)fn=fn.slice(-1,1)
            fn += filenameSuffix

            function signzen(str) { return str.replace(/^\s+/, "").replace(/\\|\/|\:|\;|\,|\+|\&|\=|\*|\?|\"|\'|\>|\<|\./g, c => { return String.fromCharCode(c.charCodeAt(0) + 0xFEE0) }) }

            let puele = eleget0(`${target}`)
            puele.classList.add('yendotsaveElement')

            let scale = Math.max(1, Math.min(SCALE_MAX, SCALE_MIN + (elegeta('img:not(.quoteSpeechBalloonImg)', puele).length * 0.5)))
            popup3(`z：ポップアップ(ピックアップ)を保存\n（Shift+で高画質、Alt+でメモを維持）\nScale = ${scale}`, 12)
            //            document.dispatchEvent(new CustomEvent('saveDOMAsImage', { detail: { element: puele, filename: fn, scale: scale, hd: (key.indexOf("Shift+") != -1) ? 1 : 0, eleToFlash: target == ".ftbpu" ? eleget0(".ftbpu") : eleget0("#pickbox") } }))
            document.dispatchEvent(new CustomEvent('saveDOMAsImage', { detail: { element: puele, filename: fn, scale: scale, hd: (key.indexOf("Shift+") != -1) ? 1 : 0, eleToFlash: orgtarget == ".ftbpu" ? eleget0(".ftbpu") : eleget0("#pickbox") } }))
            $('#presentPick').remove()
            //if (orgtarget == "#pickbox") setTimeout(() => window.dispatchEvent(new Event('resize')), 1000)
          }
        },
      }, {
        key: 'e', // e::リロード
        func: () => {
          let r = location.protocol != "file:" && eleget0("#contres>a,#fvw_loading,a#akahuku_reload_button");
          if (r) {
            if (!GF.latestReload || new Date().getTime() - GF.latestReload > 4000) {
              location.protocol != "file:" && r.click();
              GF.latestReload = Date.now();
              GF.reloadAddTime = 0;
            } // 要4秒インターバル
          }
        }
      }, {
        key: 'd', // d::
        func: (e) => {
          if (eleget0("a:hover,video:hover,img:hover")) return
          SITE.funcD()
        },
      }, {
        key: 'Shift+F', // Shift+F::FTBucketでキーワード検索
        func: () => { searchWithHistory("FUTACHAN", "FTBucketとふたば★さーち", ['https://www.ftbucket.info/scrapshot/ftb/index.php?mode=c&favo=0&ord=1&s=***', `https://zzzsearch.com/futaba/#gsc.q=***&gsc.sort=date`], "|") },
      }, {
        key: 'n', // n::Notificationで新着レスを通知on/off
        func: (key, evt, options = []) => {
          let [opt, changeto] = [options?.[0], options?.[1]] ////[opt[0],opt[1]];
          if (opt == "automation") {
            GF.reloadAndNotifyNewArrival = Number(changeto);
          } else {
            GF.reloadAndNotifyNewArrival = ((GF.reloadAndNotifyNewArrival || 0) + 1) % 5;
            pref("FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT", GF.reloadAndNotifyNewArrival)
          }
          $('#notiApiOn').remove();
          let mess = `N：自動リロードと新着通知＝${GF.reloadAndNotifyNewArrival}\n${["オフ","自動リロード","自動リロード＋新着レスをNotificationで通知（メモ付きのみ）","自動リロード＋新着レスをNotificationで通知（画像かメモ付きのみ）","自動リロード＋新着レスをNotificationで通知（全て）"][GF.reloadAndNotifyNewArrival]}\n\n推奨：Firefoxではalerts.useSystemBackend false`
          //if (opt != "automation") popup2(`${mess}`, 8);
          if (opt != "automation") popup2(`N：自動リロードと新着通知\n${["オフ","自動リロード","自動リロード＋新着レスをNotificationで通知（メモ付きのみ）","自動リロード＋新着レスをNotificationで通知（画像かメモ付きのみ）","自動リロード＋新着レスをNotificationで通知（全て）"].map((c, i) => "　" + c + (i  == GF.reloadAndNotifyNewArrival ? "　←\n" : "\n")).join("")}`, 9, "min-width:31em;")

          if (GF.reloadAndNotifyNewArrival && ld("2chan.net")) {
            $(`<span id="notiApiOn" class="ignoreMe" title="${mess}" style="all:initial; cursor:pointer; position: fixed; right:60em; bottom:0.5em; z-index:100; opacity:0.55; font-size:15px;  margin:0px 1px; text-decoration:none !important;  padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; border:solid 1px #888; background-color:${["#fff","#dfe","#dfe","#dfe"][GF.reloadAndNotifyNewArrival-1]}; color:#888; ">${["オフ","更新","メモ","画像","全て"][GF.reloadAndNotifyNewArrival]}</span>`).click(e => keyFuncDispatch("n")).appendTo('body');
          }
        },
      }, {
        key: 'a', // a::
        func: () => {
          GF.stopmoq = 1
          let isftchan = /^https?:\/\/kuzure\.but\.jp\/f\/b\//.test(location.href);
          let isanigeaki = /\/\/anige\.horigiri\.net\/\?p/.test(location.href);
          if (isanigeaki || isftchan) $(elegeta('.thre .rtd').filter(e => !e.closest("#pickbox,.ftbpu"))[0]).closest("table").before($('<div id="thre0"></div>'))
          $('.reloadline').remove();

          if (lh(/\/futaba\.php\?guid\=on/)) {
            /*          GF.sort = (GF?.sort || 0) % 4 + 1 //var sorttype = GF.sort||0//Number($('.yhmSortType')?.attr("id") || 0);
                      let sorttype = GF.sort
                        popup2("A：ソート\n" + (["fu+YouTube+ニコ動", "YouTube", "ニコ動", "fu"].map((c, i) => "　" + c + (i + 1 == sorttype ? "　←\n" : "\n")).join("")), 6, "min-width:6em;")
                        sorttype == 1 && sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(fu?\d+\.|youtube\.com\/watch|youtu\.be\/|nicovideo\.jp\/watch|\/\/nico\.ms\/)/g)?.length || 0) }, 1)
                        sorttype == 2 && sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(\/\/www\.youtube\.com\/|youtu\.be\/)/g)?.length || 0) }, 1)
                        sorttype == 3 && sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(nicovideo\.jp\/watch|\/\/nico\.ms\/)/g)?.length || 0) }, 1)
                        sorttype == 4 && sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(fu?\d+\.)/g)?.length || 0) }, 1)
              */
            var sorttype = GF.yhmSortType || 0;
            let menu = [
              { t: "fu+YouTube+ニコ動", f: () => { sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(fu?\d+\.|youtube\.com\/watch|youtu\.be\/|nicovideo\.jp\/watch|\/\/nico\.ms\/)/g)?.length || 0) }, 1) } },
              { t: "YouTube", f: () => { sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(\/\/www\.youtube\.com\/|youtu\.be\/)/g)?.length || 0) }, 1) } },
              { t: "ニコ動", f: () => { sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(nicovideo\.jp\/watch|\/\/nico\.ms\/)/g)?.length || 0) }, 1) } },
              { t: "fu", f: () => { sortdom(elegeta('div.catsr'), v => { return (v.textContent?.match(/(?<!>+[a-z0-9\/\.\-\:]+)(fu?\d+\.)/g)?.length || 0) }, 1) } },
            ];
            cyclemenu(menu);
            menu[sorttype].f()
            GF.yhmSortType = (++sorttype) % menu.length

          } else {
            /*            popup2("A：ソート\n" + (["画像", "そうだね", "引用", "古い順"].map((c, i) => "　" + c + (i + 1 == sorttype ? "　←\n" : "\n")).join("")), 6, "min-width:6em;")
                        sorttype == 1 && sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1) + (((v.textContent.match(/\.(gif|webm|mp4|mov).*\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(gif|webm|mp4|mov)/gmi) ? 1 : 0) * 1000000000) || ((v.textContent.match(/\d\d\d\sB\)|(?<!>)fu?\d+\.(jpg|jpeg|png|bmp|webp)/gmi) ? 1 : 0) * 1000000) || ((v.textContent.match(/ttps?\:\/\//gmi) ? 1 : 0) * 1000)) }, 1) // リンクも加点
                        sorttype == 2 && sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1000000000) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1000000) + (((v.textContent.match(/\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mp4|mov)/gmi) || []).length * 1000) || ((v.textContent.match(/ttps?\:\/\//gmi) || []).length * 1)) }, 1) // リンクも加点
                        sorttype == 3 && sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1000000) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1000000000) + (((v.textContent.match(/\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mp4|mov)/gmi) || []).length * 1000) || ((v.textContent.match(/ttps?\:\/\//gmi) || []).length * 1)) }, 1) // リンクも加点
                        sorttype == 4 && sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), v => v.getAttribute("rsc")) //,
            */
            var sorttype = GF.yhmSortType || 0;
            let menu = [
              { t: "画像", f: () => { sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1) + (((v.textContent.match(/\.(gif|webm|mp4|mov).*\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(gif|webm|mp4|mov)/gmi) ? 1 : 0) * 1000000000) || ((v.textContent.match(/\d\d\d\sB\)|(?<!>)fu?\d+\.(jpg|jpeg|png|bmp|webp)/gmi) ? 1 : 0) * 1000000) || ((v.textContent.match(/ttps?\:\/\//gmi) ? 1 : 0) * 1000)) }, 1) } },
              { t: "そうだね", f: () => { sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1000000000) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1000000) + (((v.textContent.match(/\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mp4|mov)/gmi) || []).length * 1000) || ((v.textContent.match(/ttps?\:\/\//gmi) || []).length * 1)) }, 1) } },
              { t: "引用", f: () => { sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), (v) => { return (((v.querySelector('table:not([data-reszero]) .sod') || v).innerText?.match0(/そうだねx(\d+)/) || 0) * 1000000) + (v.querySelectorAll("table:not([data-reszero]) .revQuote").length * 1000000000) + (((v.textContent.match(/\d\d\d\sB\)|youtube\.|youtu\.be|nicovideo|(?<!>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mp4|mov)/gmi) || []).length * 1000) || ((v.textContent.match(/ttps?\:\/\//gmi) || []).length * 1)) }, 1) } },
              { t: "古い順", f: () => { sortdom(elegeta('table:not([data-reszero]) .rtd:not(#pickbox .rtd,.ftbpu .rtd)').map(v => v?.closest('table')), v => v.getAttribute("rsc")) } },
            ];
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            menu[sorttype].f()
            GF.yhmSortType = (++sorttype) % menu.length
          }
          setTimeout(() => { GF.stopmoq = 0 }, 500)
        },
      }],

      funcOnlyFirst: () => { ///xxx:
        eleget0('textarea#ftxa')?.blur()
        GF.dhash = new WeakMap();
        hoverHelp(e => e?.closest('table[border="0"]') ? "Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ" : "")
        document.body.addEventListener("dblclick", e => elegeta('.rtd :is(img,video)').forEach(e => e.animate([{ filter: `blur(1.1em) saturate(33%)` }, {}], { duration: 8000, easing: "ease-out" })), true); // 何もない背景をダブルクリック::すべての画像を一定時間ぼかす
        GF.latestReload = Date.now() - 3000;
        GF.reloadAddTime = 0;
        GF.newarticle = 1000
        GF.latestInterval = FUTABA_AUTO_RELOAD_INTERVAL * 60 * 1000
        GF.isFile = location.protocol == "file:" && eleget0('tbody > tr > th[bgcolor="#e04000"] > font[color="#FFFFFF"]:text*=レス送信モード')
        let is2chan = /^https?:\/\/[^.]+\.2chan\.net\//.test(location.href) || GF.isFile;
        let isftb = /^https?:\/\/[^\.]+\.ftbucket\.info\/|\/\/futafuta\.site\/thread\/|\/\/parupunte\.net\/logbox\/detail\.html\?no\=\d+/.test(location.href) || GF.isFile; //    let isftb = /^https?:\/\/www\.ftbucket\.info\//.test(location.href);
        let istsumanne = ld("tsumanne.net");

        // 添付ファイル関係
        keyFuncAdd([{
          key: 'v', // v::
          func: () => {
            GF.webpQ = proInput(`v:\nWebP品質を1-10で指定してください（現在値：${GF?.webpQ||"未指定"}）\n\n推奨：5-8\nロスレス圧縮：10\n10<n：無変換\n\nQ.これは何？いつ使われる？\nA.クリップボードに画像か動画がある時にページにCtrl+Vするとそれを添付ファイルとして設定できますがその際にここで品質を指定してあると「指定した品質のWebP」「ロスレスWebP」「元ファイル」の3種類の変換を試行して最もファイルサイズが小さくなったものを採用します。未指定時は「ロスレスWebP」と「元ファイル」の2種類のみ試行します。10超を指定すると一切変換をしません\n\n`, GF.webpQ || FUTABA_WEBP_LOSSY_QUALITY * 10, 0.001, 10.1) || undefined; // 非指定時もそれが実体のファイルのない生のビットマップ画像データだった場合には\n品質8またはロスレスでWebPに変換します\n未設定時はロッシー圧縮向きの画像には8、ロスレス向きなら10が使われます
          }
        }])

        // 添付ファイル選択にD&D・クリップボードからのペーストを可能にする
        let fileSel;
        //        waitdo(() => eleget0('input[type="file"][name="upfile"] , input[type="file"][id="upup"] , input[type="file"]#up2input'), () => {
        setTimeout(async () => {
          if (!lh(/\/res\/|\/futaba\.htm$/)) return;

          document.addEventListener('paste', async (e) => {
            if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable || ((e?.target?.closest('#chat-messages,ytd-comments-header-renderer') || document?.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
            e.preventDefault();
            fileSel = eleget0(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input):hover') || eleget0('input[type="file"][name="upfile"]') || eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input')
            let file = firstFile(e?.clipboardData?.items)

            function firstFile(cbd) {
              for (let i = 0; i < cbd?.length; i++) {
                if (/^image\/|^video\//.test(cbd[i]?.getAsFile()?.type)) return cbd[i]?.getAsFile();
              }
            }
            if (file) await fileset(file, `クリップボード`, fileSel)
          });

          //          fileSel = eleget0('input[type="file"][name="upfile"]') || eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input')
          elegeta('input[type="file"][name="upfile"] , input[type="file"][id="upup"] , input[type="file"]#up2input').forEach(fileSel => {
            if (fileSel) {

              let tf = eleget0(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input)') ? `\nCtrl+v：クリップボードの画像/動画を添付` : ``;
              if (!eleget0('input[value="スレッドを立てる"]')) popup3(`Shift+F：FTBucket検索\na：画像順/そうだね順/引用順でソート${location.href.match0(/^https?:\/\/[^.]+\.2chan\.net\//)?"\ne：新着チェック\nd：新着チェック＋新着に移動\nc：ホバー下にそうだね\nn：自動リロード＆新着通知\nm：監視ワード設定"+tf:""}`, 7, 5000)

              if (fileSel?.files?.length) {
                $(fileSel).addClass("upfilein");
                $("textarea#ftxa").addClass("upfilein")
              }
              //            setTimeout(() => elegeta('input[type="file"][name="upfile"] , input[type="file"][id="upup"] , input[type="file"]#up2input').forEach(e => e.setAttribute(`title`, `ここにドラッグ＆ドロップでファイルを落とすかクリップボードに画像か動画がある時にここにホバーしてペースト（Ctrl+V）しても添付ファイルを選択できます\nファイル名はランダムな数字にし、メタデータを除去します。vキーでWebP再圧縮率の設定をします\n\nここ以外の場所（ページ内の何もない背景など）でファイルをCtrl+Vすると添付File→あぷにアップ→futaba-add-uploaderの順で探して最初に見つかったものにファイルを選択します`)), 2100)
              fileSel.setAttribute(`title`, `ここにドラッグ＆ドロップでファイルを落とすかクリップボードに画像か動画がある時にここにホバーしてペースト（Ctrl+V）しても添付ファイルを選択できます\nファイル名はランダムな数字にし、メタデータを除去します。vキーでWebP再圧縮率の設定をします\n\nここ以外の場所（ページ内の何もない背景など）でファイルをCtrl+Vすると添付File→あぷにアップ→futaba-add-uploaderの順で探して最初に見つかったものにファイルを選択します`);
              fileSel.setAttribute(`ondragover`, `event.preventDefault();event.dataTransfer.dropEffect='copy';event.target.classList.add('dragdrop-over')`)
              fileSel.setAttribute(`ondragenter`, `event.target.classList.add('dragdrop-over')`)
              fileSel.setAttribute(`ondragleave`, `event.target.classList.remove('dragdrop-over')`)
              addstyle.add(`:is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input){transition:box-shadow 0.33s;}
          .dragdrop-over { -webkit-appearance:none; position:relative; z-index:1000; outline: 5px solid #2196F3 !important; background-color: #e3f2fd !important; box-shadow:0 0 0 9999px #000000aa; transition:all 0.5s; animation:upfilein2 1s linear infinite;}
          .upfilein { -webkit-appearance:none; animation:upfilein 1s linear infinite; }
          @keyframes upfilein { 0% { outline:4px solid #1133ff; background-color: #e0e8ff; } 50% { outline:4px solid #def; background-color: #e0e8ff; } 100% { outline:4px solid #1133ff; background-color: #e0e8ff; } }
          @keyframes upfilein2 { 0% { outline:3px solid #2299ff; background-color: #fff; } 50% { outline:3px solid #eef; background-color: #bdf; } 100% { outline:3px solid #2299ff; background-color: #fff; } }
          .pvholder {animation:1s linear infinite upfilein; transform:scale( calc(23 / 300) ); bottom:0em; right:6.5em !important; transform-origin:bottom right; top:auto !important;} `)

              //            setTimeout(() => {
              //            document.querySelectorAll(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input)').forEach(input => {
              //                let gomi = after(input, `<span class="clearFileInput" title="選択ファイルを取り消す" style="cursor:pointer; margin-left:0.5em; font-size:1rem;">🗑</span>`);
              let gomi = after(fileSel, `<span class="clearFileInput" title="選択ファイルを取り消す" style="cursor:pointer; margin-left:0.5em; font-size:1rem;">🗑</span>`);
              gomi.addEventListener("click", e => {
                e.target.previousElementSibling.value = '';
                fileSelectOff();
                e.stopPropagation()
                e.preventDefault()
                return false;
              })
              //              })
              //        }, 2100) // あぷにアップよりあとにする

              fileSel.addEventListener('drop', async e => {
                if (e?.dataTransfer?.files?.[0] && /^image\/|^video\//.test(e?.dataTransfer?.files?.[0]?.type)) e.preventDefault() + e.stopPropagation() + e.stopImmediatePropagation();
                //fileSel = eleget0(':is(input[type="file"][name="upfile"] , input[type="file"][id="upup"] , input[type="file"]#up2input):hover') || eleget0('input[type="file"][name="upfile"]') || eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input')
                if (await fileset(e?.dataTransfer?.files?.[0], `ドラッグアンドドロップ`, fileSel) == 0) popup2('D&Dに対応するのは「画像か動画」かつ「１ファイルだけ」です');
              })
            }
          });

          document.addEventListener('drop', async e => {
            if (e?.dataTransfer?.files?.[0] && /^image\/|^video\//.test(e?.dataTransfer?.files?.[0]?.type)) e.preventDefault() + e.stopPropagation() + e.stopImmediatePropagation();
            fileSel = eleget0(':is(input[type="file"][name="upfile"] , input[type="file"][id="upup"] , input[type="file"]#up2input):hover') || eleget0('input[type="file"][name="upfile"]') || eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input')
            if (await fileset(e?.dataTransfer?.files?.[0], `ドラッグアンドドロップ`, fileSel) == 0) popup2('D&Dに対応するのは「画像か動画」かつ「１ファイルだけ」です');
          })
        }, 2100) // あぷにアップよりあとにする

        async function fileset(srcfile, from, fileSel) {
          if (!srcfile || !/^image\/|^video\//.test(srcfile?.type)) {
            fileSel?.classList?.remove('dragdrop-over');
            return 0;
          }
          // 添付ファイル選択にCtrl+VでOSからペースト
          addstyle.add(`.pastePreviewContainer { font-size:85%; z-index:2000000021; position: fixed;top: 1em; right: 1em; background-color: #fff; padding: 10px; border: 4px solid #29f; border-radius: 5px; box-shadow: 0 0 2em #00000040; max-width: 300px; min-width:300px; word-wrap: break-word; word-break: break-all; transition:all 0.5s; }
          .pastePreviewContainer:hover {transform:scale(1) !important; transition:all 0.2s; }
          .pastePreview-container { display: flex; flex-direction: column; align-items: center; margin-top: 10px; }
          .pastePreview-container :is(img,video) { max-width: 300px; max-height: 300px; width: 100%; height: 100%; object-fit: contain; }`)
          end(document.body, `<div class="pastePreviewContainer">添付ファイルプレビュー準備中…</div>`);

          const fileName = srcfile.name || '';
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          let file = new File([FUTABA_EXPERIMENTAL_REMOVE_METADATA_FROM_UPFILE() ? await removeMetadataFromFile(srcfile) : srcfile], `${new Array(~~(Math.random()*6)+1).fill(0).map(v=>~~(Math.random()*10)).join("")}.${fileName.split('.').pop().toLowerCase()}`, {
            type: srcfile.type,
            lastModified: currentDate.getTime(),
            webkitRelativePath: ''
          });
          let deleteMeta = srcfile.size > file.size;
          let toWebp = 0,
            colors, psnr;

          [file, toWebp, colors, psnr] = await pngToWebp(srcfile, file);
          file = new File([file], file.name, { type: file.type, lastModified: currentDate.getTime(), webkitRelativePath: '' });

          let xyreso = await getResolution(file) || "";
          $('.pastePreviewContainer').remove()

          async function getResolution(file) {
            return new Promise((resolve) => {
              try {
                const objectUrl = URL.createObjectURL(file);
                if (file.type.startsWith('image/')) {
                  const img = new Image();
                  img.onload = () => {
                    const { naturalWidth: w, naturalHeight: h } = img;
                    URL.revokeObjectURL(objectUrl);
                    img.src = '';
                    resolve(`original: ${w} x ${h}`);
                  };
                  img.onerror = () => resolve("");
                  img.src = objectUrl;
                } else if (file.type.startsWith('video/')) {
                  const video = document.createElement('video');
                  video.onloadedmetadata = () => {
                    const { videoWidth: w, videoHeight: h, duration } = video;
                    URL.revokeObjectURL(objectUrl);
                    video.src = '';
                    resolve(`original: ${w} x ${h} - ${new Date(duration * 1000).toISOString().slice(11, 19)}<br>`);
                  };
                  video.onerror = () => resolve("");
                  video.src = objectUrl;
                } else resolve("");
              } catch {
                resolve("");
              }
            });
          }

          let srcPreview = (clientHeight() > 800 || debug) ? `<div class="pastePreview-container"><${/^image\//.test(srcfile.type) ? 'img' : 'video'} id="upfilemedia" src="${URL.createObjectURL(srcfile)}" ${/^image\//.test(srcfile.type) ? '' : 'controls'}></${/^image\//.test(file.type) ? 'img' : 'video'}></div>` : "";
          let pv = end(document.body, `<div class="pastePreviewContainer">添付ファイルプレビュー<br><br>${from}:<br> name: "${sani(srcfile.name)}"<br> size: ${sani(srcfile.size.toLocaleString())} bytes<br>type: "${sani(srcfile.type)}"<br>${srcPreview}<br>→添付ファイル: ${psnr}<br> name: "${sani(file.name)}"<br>size: ${sani(file.size.toLocaleString())} bytes${deleteMeta?" (メタデータ除去)":""}${toWebp}<br> type: "${sani(file.type)}"<br>lastModified: ${sani(new Date(file.lastModified).toLocaleString())}<br><br>${xyreso}${colors}<div class="pastePreview-container"><${/^image\//.test(file.type) ? 'img' : 'video'} id="upfilemedia" src="${URL.createObjectURL(file)}" ${/^image\//.test(file.type) ? '' : 'controls'}></${/^image\//.test(file.type) ? 'img' : 'video'}></div><span id="filegomibako" title="ファイル選択を解除" style="float:right; font-size:20px; cursor:pointer;">🗑</span></div>`);
          setTimeout(pv => $(document).one("click wheel mousemove keydown", "body", () => $(pv).addClass("pvholder")), 1000, pv)

          eleget0('#filegomibako')?.addEventListener("click", e => {
            document.querySelectorAll(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"]) , input[type="file"]#up2input').forEach(e => e.value = '')
            fileSelectOff();
            return false;
          })
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileSel.files = dataTransfer.files;
          fileSel.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          clearTimeout(GF?.modal);
          GF.modal = setTimeout(() => fileSel?.classList?.remove('dragdrop-over'), 1000);
          fileSel?.classList?.add('dragdrop-over');

          eleget0('textarea#ftxa')?.click();

          if (fileSel.matches("#upup")) { // あぷにアップの処理が終わった頃ULしたにせよキャンセルしたにせよ点滅を消す
            setTimeout(fileSel => {
              fileSel?.dispatchEvent(new Event("change"))
              $(".pastePreviewContainer").remove()
              fileSel?.classList?.remove('dragdrop-over');
            }, 600, fileSel)
          } else {
            $(fileSel).addClass("upfilein")
            $("textarea#ftxa").addClass("upfilein")
          }
          return 1;
        }

        setTimeout(() => {
          elegeta('input#up2input').forEach(e => {
            new MutationObserver(e => {
              refreshUpfilein()
            }).observe(e, { attributes: true, childList: true, subtree: true });
          })
        }, 2100)

        document.addEventListener("click", e => {
          if (e?.target?.matches(`span.clearFileInput , input[type="file"] , input[type="submit"] , button#up2submit , span#filegomibako`)) refreshUpfilein();
        }, true)

        document.addEventListener("yhm2chanAllDone", refreshUpfilein)

        function refreshUpfilein() {
          setTimeout(() => {
            elegeta('input[type="file"].upfilein')?.filter(e => !e?.files?.length)?.forEach(e => e?.classList?.remove('upfilein'));
            //$(eleins)?.classList?.remove('dragdrop-over');

            if (elegeta('input[type="file"].upfilein').every(e => !e?.files?.length)) {
              $('.upfilein').removeClass("upfilein");
              //fileSel?.classList?.remove('dragdrop-over');
              //$(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input):hover').removeClass('dragdrop-over')
              $('.pastePreviewContainer').remove()
            }
          }, 34)
        }

        function fileSelectOff(com = 0) {
          //          $('.upfilein').removeClass("upfilein")
          elegeta('.upfilein')?.filter(e => e?.files?.length == 0)?.forEach(e => e?.classList?.remove('upfilein'));
          if (elegeta('.upfilein').every(e => !e?.files?.length)) $('.upfilein').removeClass("upfilein");
          //fileSel?.classList?.remove('dragdrop-over');
          $(com == "all" ? 'input[type="file"]' : fileSel)?.classList?.remove('dragdrop-over');
          //$(':is(input[type="file"][name="upfile"],input[type="file"][id="upup"] , input[type="file"]#up2input):hover').removeClass('dragdrop-over')
          $('.pastePreviewContainer').remove()
        }

        async function pngToWebp(srcFile, inputFile) {
          if (GF?.webpQ && GF?.webpQ > 10) return [inputFile, debug ? `（指定WebP品質${GF?.webpQ}>10により無変換）` : "", "", ""]
          if ((!(GF?.webpQ && inputFile.type == 'image/webp') && inputFile.type != 'image/avif' && inputFile.type != 'image/png' && inputFile.type != 'image/jpeg') || GF?.canvasNA == 1) return [inputFile, debug ? "（WebP化対象外）" : "", "", ""];
          const canvas = document.createElement('canvas');
          if (!canvas.getContext) return [inputFile, debug ? "（canvas使用不可）" : "", ""];
          const img = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = reject;
              image.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(inputFile);
          });
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);

          async function countUniqueColors(file) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.src = URL.createObjectURL(file);
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
                const colors = new Set();
                let count = 0;
                const startTime = Date.now();
                const maxDuration = 333;
                for (let i = 0; i < data.length && Date.now() - startTime < maxDuration; i += 4) {
                  if (data[i + 3] > 0) colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
                  count++;
                }
                resolve(colors.size);
              };
              img.onerror = error => {
                reject(error);
                URL.revokeObjectURL(img.src);
              };
            });
          }

          let colors = await countUniqueColors(inputFile)
          let debugcolors = (1 || debug) && ` (${colors} colors)` || ""

          let validBlobs;
          if (inputFile.type == "image/avif") { // avifならまだ対応してないので強制的にwebpに変換して確定
            validBlobs = [
              //new File([await canvasToBlob(canvas, 'image/webp', 1)], inputFile.name.replace(/\.\w+$/, `.webp`), { type: "image/webp" }),
              new File([await canvasToBlob(canvas, 'image/webp', GF?.webpQ ? (GF?.webpQ / 10) : FUTABA_WEBP_LOSSY_QUALITY)], inputFile.name.replace(/\.\w+$/, `.webp`), { type: "image/webp" })
            ];
            inputFile = new File([await canvasToBlob(canvas, 'image/webp', 1)], inputFile.name.replace(/\.\w+$/, `.webp`), { type: "image/webp" });
          } else {
            const blobPromises = (srcFile.name == "image.png" && inputFile.type == "image/png") ? [canvasToBlob(canvas, 'image/webp', GF?.webpQ ? (GF?.webpQ / 10) : colors <= 10000 ? 1 : FUTABA_WEBP_LOSSY_QUALITY), canvasToBlob(canvas, 'image/webp', 1)] :
              GF?.webpQ ? [canvasToBlob(canvas, 'image/webp', (GF?.webpQ / 10)), canvasToBlob(canvas, 'image/webp', 1)] : [canvasToBlob(canvas, 'image/webp', 1)];
            const blobs = await Promise.all(blobPromises.map(p => p.catch(() => null)));
            validBlobs = [inputFile, ...blobs.filter(blob => blob !== null)];
          }
          let bestBlob = validBlobs.reduce((prev, curr) => curr.size < prev.size ? curr : prev, inputFile);
          let psnr = `(PSNR: ${Math.floor(await getPSNR(inputFile,bestBlob))}dB)`;
          //psnr += ` / SSIM: ${Math.round(await getSSIM(inputFile,bestBlob)*1000)/1000}`

          async function getPSNR(file1, file2) {
            const [pixels1, pixels2] = await Promise.all([loadImagePixels(file1), loadImagePixels(file2)]);
            if (pixels1.width !== pixels2.width || pixels1.height !== pixels2.height) return 0;
            const pixelCount = pixels1.width * pixels1.height;
            let mse = 0;
            for (let i = 0; i < pixelCount; i++)
              for (let c = 0; c < 3; c++)
                mse += (pixels1.data[i * 4 + c] - pixels2.data[i * 4 + c]) ** 2;
            mse /= pixelCount * 3;
            return mse === 0 ? 50 : 10 * Math.log10((255 ** 2) / mse);
          }

          function loadImagePixels(file) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const { data } = ctx.getImageData(0, 0, img.width, img.height);
                resolve({ data, width: img.width, height: img.height });
              };
              img.onerror = reject;
              img.src = URL.createObjectURL(file);
            });
          }

          if (bestBlob.size < inputFile.size / 1000) { GF.canvasNA = 1; return [inputFile, "（おそらくcanvas無効）", debugcolors]; }
          return bestBlob.size < inputFile.size ? [new File([bestBlob], inputFile.name.replace(/\.\w+$/, `.${bestBlob.type.split('/').pop()}`), { type: bestBlob.type }), `（${inputFile.name.match0(/\.(\w+)$/)}→${bestBlob.type.split('/').pop()}）`, debugcolors, psnr] : [inputFile, debug ? "（元ファイルが最小）" : "", debugcolors, psnr];
        }

        function canvasToBlob(canvas, type, quality) {
          return new Promise((resolve, reject) =>
            canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('')), type, quality)
          );
        }

        async function removeMetadataFromFile(file) {
          try {
            let newfile =
              (file.type.startsWith('image/png')) ? await cleanPNG(file) :
              (file.type.startsWith('image/jpeg')) ? await cleanJPEG(file) :
              (file.type.startsWith('image/webp')) ? await cleanWEBP(file) :
              (file.type.startsWith('image/gif')) ? await cleanGIF(file) :
              file;
            return newfile
          } catch { return file; }
        }

        async function cleanGIF(file) {
          const buffer = await file.arrayBuffer(),
            view = new DataView(buffer);
          const header = String.fromCharCode(...new Uint8Array(buffer, 0, 6));
          if (header !== 'GIF87a' && header !== 'GIF89a') return file;
          const newGIF = [buffer.slice(0, 13)];
          (view.getUint8(10) & 0x80) && newGIF.push(buffer.slice(13, 13 + 3 * (1 << ((view.getUint8(10) & 0x07) + 1))));
          for (let i = newGIF.reduce((sum, arr) => sum + arr.byteLength, 0); i < buffer.byteLength;) {
            const block = view.getUint8(i);
            if (block === 0x21) {
              const extType = view.getUint8(i + 1);
              extType === 0xFE ? (i = skipBlock(view, i + 2)) : (newGIF.push(buffer.slice(i, skipBlock(view, i + 2))), i = skipBlock(view, i + 2));
            } else if (block === 0x2C) {
              const imageStart = i;
              i += 10;
              (view.getUint8(i - 1) & 0x80) && (i += 3 * (1 << ((view.getUint8(i - 1) & 0x07) + 1)));
              newGIF.push(buffer.slice(imageStart, i = skipBlock(view, i + 1)));
            } else if (block === 0x3B) {
              newGIF.push(new Uint8Array([0x3B]));
              break;
            } else i++;
          }
          return new File(newGIF, file.name, { type: 'image/gif' });
          const skipBlock = (view, start) => {
            let i = start;
            while (view.getUint8(i) !== 0) i += view.getUint8(i) + 1;
            return i + 1;
          };
        };

        async function cleanWEBP(file) { // 不十分、要修正
          const view = new DataView(await file.arrayBuffer());
          if (String.fromCharCode(...new Uint8Array(view.buffer.slice(0, 4))) !== 'RIFF') return file;
          const chunks = [];
          for (let offset = 12; offset < view.byteLength;) {
            const chunkFourCC = String.fromCharCode(...new Uint8Array(view.buffer.slice(offset, offset + 4)));
            const chunkSize = view.getUint32(offset + 4, true);
            const chunkData = view.buffer.slice(offset, offset + 8 + chunkSize);
            if (['VP8 ', 'VP8L', 'VP8X', 'ALPH', 'ANIM'].includes(chunkFourCC))
              chunks.push(chunkData);
            offset += 8 + chunkSize + (chunkSize & 1);
          }
          const totalSize = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0) + 12;
          const newWebP = new Uint8Array(totalSize);
          newWebP.set(new Uint8Array(view.buffer.slice(0, 4)), 0);
          new DataView(newWebP.buffer).setUint32(4, totalSize - 8, true);
          newWebP.set(new Uint8Array(view.buffer.slice(8, 12)), 8);
          chunks.reduce((offset, chunk) => {
            newWebP.set(new Uint8Array(chunk), offset);
            return offset + chunk.byteLength;
          }, 12);
          const newfile = new File([newWebP], file.name, { type: 'image/webp' })
          if (file.size - 1 == newfile.size || newfile.size == 44) return file;
          return newfile;
        };

        async function cleanJPEG(file) {
          const buffer = await file.arrayBuffer();
          const view = new DataView(buffer);
          if (view.getUint16(0) !== 0xFFD8) return file;
          const imageData = [buffer.slice(0, 2)];
          let offset = 2;
          while (offset < view.byteLength) {
            const marker = view.getUint16(offset);
            if ((marker & 0xFF00) !== 0xFF00) return file;
            const segmentLength = view.getUint16(offset + 2);
            const segmentType = marker & 0xFF;
            if (segmentType === 0xDA) {
              imageData.push(buffer.slice(offset));
              break;
            } else if ([0xC0, 0xC1, 0xC2, 0xC4, 0xDB, 0xDC, 0xDD].includes(segmentType)) {
              imageData.push(buffer.slice(offset, offset + 2 + segmentLength));
            }
            offset += 2 + segmentLength;
          }
          return new File(imageData, file.name, { type: 'image/jpeg' });
        }

        async function cleanPNG(file) {
          const view = new DataView(await file.arrayBuffer());
          const signature = [137, 80, 78, 71, 13, 10, 26, 10];
          if (signature.some((byte, i) => view.getUint8(i) !== byte)) return file;
          const chunks = [];
          for (let offset = 8; offset < view.byteLength;) {
            const length = view.getUint32(offset);
            const type = String.fromCharCode(...Array.from({ length: 4 }, (_, i) => view.getUint8(offset + 4 + i)));
            if (['IHDR', 'PLTE', 'IDAT', 'IEND'].includes(type))
              chunks.push(view.buffer.slice(offset, offset + 12 + length));
            offset += 12 + length;
          }
          return new File([new Uint8Array(signature), ...chunks], file.name, { type: 'image/png' });
        };

        // u::youtubeリンクを小窓で全て再生
        if (FUTABA_YOUTUBE_PLAYALL_BUTTON >= 2) keyFuncAdd([{
          key: 'u', // u::
          func: () => {
            let isON = eleget0('.youtubePLViewer')
            isON ? isON?.remove() : youtubePLV("y");
            youtubePLVsetButton();
          }
        }]);
        youtubePLVsetButton();

        function youtubePLVsetButton() {
          if (!FUTABA_YOUTUBE_PLAYALL_BUTTON) return;
          let inp = [...elegeta('a:visible').map(e => e.href.replace("//yewtu.be/watch?v=", "//www.youtube.com/watch?v=").replace("//yewtu.be/shorts/", "//www.youtube.com/shorts/").replace(/\/\/yewtu\.be\/([a-zA-Z0-9_\-,]{11})(.*)/, "//youtu.be/$1$2").replace("//yewtu.be/", "//www.youtube.com/")).filter(v => /youtube\.com|youtu\.be/.test(v)), ...document?.body?.innerText?.split(/\n|\s/)?.filter(v => /youtube\.com|youtu\.be/.test(v)), ...elegeta('iframe[src*="youtube"]').map(e => e?.src)].join(" ").split(/\s/).map(v => { return [...v?.matchAll(/^(?:h?t?tps?:\/\/)?(?:youtu\.be\/|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\S*?[\?\&]v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)]?.map(c => c.slice(1, 999)) })?.flat()?.flat()?.map(v => v?.split(","))?.flat()?.filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c))
          if (!inp?.length) return;
          //if (!elegeta('blockquote a[href*="youtu"]').some(e => /^(?:h?t?tps?:\/\/)?(?:youtu\.be\/|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi.test(e))) return;
          let isON = elegeta('.youtubePLViewer');
          $('#youtubePLVButton').remove();
          end(document.body, `<div id="youtubePLVButton" style="position:fixed; right:50em; bottom:0.5em; z-index:99999; width:1.66em; text-align:center; border-radius:0.5em; color:#fff; background-color:#888; cursor:pointer; opacity:0.4; font-size:17px;" title="クリック${FUTABA_YOUTUBE_PLAYALL_BUTTON>=2?"/u":""}：このページにあるYouTube動画を小窓で連続再生する（1回目：昇順、2回目以降：逆順）\n右クリック：シャッフルして再生\nもう一度押すと終了">${isON?.length?"×":GF?.PLVed?"◀":"▶"}</div>`)
          eleget0('#youtubePLVButton')?.addEventListener("mousedown", e => {
            if (e.button != 0 && e.button != 2) return;
            e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
            if (isON?.length) { isON.forEach(e => e.remove()) } else {
              youtubePLV(e.button == 0 ? "" : "Shift+Ctrl+Y");
              GF.PLVed = 1;
            }
            youtubePLVsetButton();
            return false;
          }, true)
          eleget0('#youtubePLVButton')?.addEventListener("contextmenu", e => {
            e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
            return false;
          }, true)
        }

        function youtubePLV(key) {
          $('.youtubePLViewer').remove();
          const IPURL = `https://www.youtube.com/watch_videos?video_ids=`;
          let option = key == "Shift+Ctrl+Y" ? "shuffle" : "";
          let inp = [...elegeta('a:visible').map(e => e.href.replace("//yewtu.be/watch?v=", "//www.youtube.com/watch?v=").replace("//yewtu.be/shorts/", "//www.youtube.com/shorts/").replace(/\/\/yewtu\.be\/([a-zA-Z0-9_\-,]{11})(.*)/, "//youtu.be/$1$2").replace("//yewtu.be/", "//www.youtube.com/")).filter(v => /youtube\.com|youtu\.be/.test(v)), ...document?.body?.innerText?.split(/\n|\s/)?.filter(v => /youtube\.com|youtu\.be/.test(v)), ...elegeta('iframe[src*="youtube"]').map(e => e?.src)].join(" ");
          if (inp || 1) {
            var urlcap = inp.split(/\s/).map(v => { return [...v?.matchAll(/^(?:h?t?tps?:\/\/)?(?:youtu\.be\/|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)]?.map(c => c.slice(1, 999)) })?.flat()?.flat()?.map(v => v?.split(","))?.flat()?.filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)) // 書式が混在していても登場順に収納する
            inp = null;
            if (urlcap?.length || 1) {
              let urla = urlcap //urlcap.join(",").split(",").filter(c => /^[a-zA-Z0-9_\-]{11}$/.test(c)); // 動画IDは11桁
              let urllen = urla.length;
              let urla2 = [...new Set(urla)]; // 重複削除
              if (GF?.PLVed) urla2 = urla2?.reverse();
              else GF.PLVed = 1;
              if (option == "shuffle") urla2 = shuffle(urla2); // シャッフル
              let urllen2 = urla2.length;
              let urla3 = [...urla2].slice(0, 50); // 50件まで
              let urlenum = urla3.join(",")
              let url = `${IPURL}${urla2.join(",")}`
              var enumUrl = []
              for (let u = 0; u < urla2.length / 50; u++) {
                enumUrl.push(`https://www.youtube.com/embed/${urla2[u*50]}?playlist=${ (urla2.slice(u*50, u*50+50).join(",") ) }`)
              }
              if (enumUrl?.length) {
                enumUrl.forEach((u, i) => {
                  let plv = end(document.body, `<div class="youtubePLViewer" style="cursor:grab; overflow:hidden; resize:both; position:fixed; left:calc(50vw - 160px); top:-16px; z-index:${99999-i}; padding:15px; border-radius:15px; border:1px solid #80808080; background-color:#ffffff80; ">` +
                    `<p class="ignoreMe pEmbedYT" style="display:inline-block; margin:0;" title="${sani(u)}"><iframe sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="${YT_REFERRER}" src="${u}${i==0?"&autoplay=1":""}" id="ytplayer" type="text/html"  height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></iframe></p>` +
                    `</div>`)
                  new MutationObserver(m => { // 小窓をリサイズしたら中のyoutube iframeも連動リサイズ
                    let ytif = eleget0('#ytplayer', plv)
                    ytif.width = plv.offsetWidth - 16 * 2;
                    ytif.height = plv.offsetHeight - 16 * 2;
                  }).observe(plv, { attributes: true, childList: true, subtree: false });
                  plv && dragElement(plv, "*", "iframe", ".youtubePLViewer")
                  plv?.addEventListener("dblclick", e => {
                    e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
                    $('.youtubePLViewer').remove();
                    youtubePLVsetButton();
                    return false
                  }, true) // e?.target?.remove())
                })
                youtubePLVsetButton()
              }
            }

            function shuffle(array) {
              return array.map(a => ({ rnd: Math.random(), val: a })).sort((a, b) => a.rnd - b.rnd).map(a => a.val);
            }
          }
        }

        // 以降スレッド内のみ futaba::
        if (!GF.isFile && (is2chan && !location.href.match0(/\.2chan\..+\/res\/|\.2chan\.net\/[^\/]*\/futaba\.php\?guid\=on$|\/\/futafuta\.site\/thread\/|\/\/parupunte\.net\/logbox\/detail\.html\?no\=\d+/))) return;
        //        if (!GF.isFile && (is2chan && !location.href.match0(/\.2chan\..+\/res\/|\.2chan\.net\/b\/futaba\.htm$|\.2chan\.net\/[^\/]*\/futaba\.php\?guid\=on$/))) return;
        let iskurokako = /\/\/kako\.futakuro\.com\/futa\//.test(location.href);
        let isftchan = /^https?:\/\/kuzure\.but\.jp\/f\/b\//.test(location.href);
        let isanigeaki = /\/\/anige\.horigiri\.net\/\?p/.test(location.href);
        let isfvw = eleget0('#fvw_menu') // futakuro
        if (isanigeaki) GM_addStyle('table, th, td{border:0;}');
        if (isftchan || isanigeaki) { document.body.innerHTML = "<div class='thre'>" + document.body.innerHTML + "</div>" }
        if (isftchan) { GM_addStyle("body{min-width:95%} .thre table{margin-right:0} #v0z{display:none;}") }
        if (is2chan || isftchan) GM_addStyle(".rtd{vertical-align:top} #pdm{z-index:2000000021}")
        GM_addStyle("#pickbox .yhmMyMemo{font-size:85%; white-space: nowrap;} .quo{vertical-align:top} a:visited{color:#800080;} .ftbpu .quo{max-width:25vw;}")
        GM_addStyle(".quoteSpeechBalloon{padding:0 0.68em; margin-left:0.68em; font-size:14px; position:relative; bottom:1px; color:#484; background-color:#ffffee;border-radius:1em; user-select:none; cursor:pointer;}") // qsb::
        GM_addStyle(".quoteSpeechBalloonImg{float:right; clear:right; max-height:2.8em !important; width:auto; padding:4px; user-select:none; background-color:#ffffee; border-radius:6px; cursor:pointer;")
        GM_addStyle(".revQuote{cursor:pointer;color:#789922; margin:0.19em; }")
        addstyle.add('.waiting{ display: inline-block; vertical-align: middle; font-size:85%; color: #666; line-height: 1; width: 1em; height: 1em; border: 0.12em solid currentColor; border-top-color: rgba(102, 102, 102, 0.3); border-radius: 50%; box-sizing: border-box; -webkit-animation: rotate 1s linear infinite; animation: rotate 1s linear infinite; } @-webkit-keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } } @keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }</style>')
        addstyle.add('.relallArea{user-select:none; text-align:center; display:inline-block; line-height:1.5em; color:#789922c0; min-width:1.5em; height:1.5em; margin:1px 0 1px 3px; margin-top:0.3em;  } .memo:empty+.backlink:empty+.relallArea{margin-top:3px; } .backlink:empty+.relallArea{margin-top:7px; } .backlink{word-break:break-word;}') //background-color:#eed;
        addstyle.add('.relallAreaon{outline:2px dotted #789922f0; cursor:pointer;}') //background-color:#eed;
        addstyle.add('.sodmypush{color:#f00;}')
        if (location.href.match0("anige.horigiri")) GM_addStyle(`blockquote{color:#800000;line-height:1.2em;font-style:normal;`)
        addstyle.add('.GM_FRRS_Counter{display:none !important;}')
        addstyle.add('#pickbox blockquote { word-wrap: anywhere; }')
        addstyle.add(`#pickbox .rts {cursor:pointer;}`)
        //addstyle.add(`.rts {cursor:pointer;}`)
        addstyle.add(`.thre table blockquote a { word-break: break-all; }`)
        addstyle.add(`#pickbox{background-color:#ffffeebb; opacity:0.9; transition:background-color 0.1s, opacity 0.1s;} #pickbox:hover{background-color:#ffffeeff; opacity:1; transition:background-color 0.1s, opacity 0.1s;}`)
        //addstyle.add(`#pickbox{background-color:#ffffeebb; filter:opacity(0.9); transition:background-color 0.1s, opacity 0.1s;} #pickbox:hover{background-color:#ffffeeff; filter:opacity(1); transition:background-color 0.1s, opacity 0.1s;}`)
        addstyle.add(`input[name="email"] {ime-mode:inactive;}`)
        debug && addstyle.add(`#pickbox , .ftbpu {cursor:grab;} :is(#pickbox , .ftbpu ) .rtd {cursor:initial;}`) // ピックアップやポップアップの上でドラッグできるカーソルを示す（うるさい）

        addstyle.add('table blockquote a:is([href*="youtube.com/"] , [href*="youtu.be/"])~div.userjs-title { display:none; }') // 2025.07 buynow?
        addstyle.add('table blockquote a:is([href*="youtube.com/"] , [href*="youtu.be/"])~div.userjs-title~br { display:block !important; }')
        //addstyle.add('table blockquote .userjs-title .userjs-imageWrap .userjs-image { max-height: 6em !important; width: auto; max-width:6em !important;}')
        addstyle.add('table blockquote .userjs-title .userjs-imageWrap .userjs-image { max-height: 9em !important; width: auto; max-width:9em !important;}')
        addstyle.add('#pickbox table blockquote .userjs-title{padding:6px;} #pickbox .userjs-imageWrap .userjs-image { max-height:4em !important; padding: 6px; line-height: 1.2 !important;}')
        //$("#pickbox div.userjs-title").remove() // buynow!重複消す


        GF.originalDocTitle = eleget0('//div[@class="thre"]/blockquote')?.textContent || document.title;
        GF.originalDocTitle0 = document.title;
        GF.anchor = new Array(1000).fill("")

        //let favi=eleget0('.thre>a>img')?.src; if(favi)end(document.head,`<link rel="icon" href="${favi}">`) // ファビコンを最初の画像にする
        if (ld("futafuta\.site"))[...document.body.getElementsByTagName('*')].forEach(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.textContent = node.textContent.replace(/\n\s{5}([\s\S]+?)\n\s{4}/g, '$1').trim()));
        //if(ld("futafuta\.site"))autoPagerized(()=>{          [...document.body.getElementsByTagName('*')].forEach(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.textContent = node.textContent.replace(/\n\s{5}([\s\S]+?)\n\s{4}/g, '$1').trim()));})

        // フォーカスが戻った時に0を表示
        document.addEventListener("focus", e => { if (!elegeta('.thre :is(video , img):not(img.quoteSpeechBalloonImg):inscreen:visible').length) leadFocus() })
        document.addEventListener("blur", e => { $(".leadFocus").remove() })

        function leadFocus(e) {
          if (window.scrollY + clientHeight() < eleget0('.thre img , .thre video:visible')?.getBoundingClientRect().top + window.scrollY) return;
          let Rimg = eleget0('//div[@class="thre"]/a/img:visible')?.cloneNode(true)
          let Rdesc = elegeta('//div[@class="thre"]/span[1]|//div[@class="thre"]/span[2]|//div[@class="thre"]/span[3]|//div[@class="thre"]/span[4]|//div[@class="thre"]/span[5]|//div[@class="thre"]/a[@class="sod"]:visible')?.map(e => e.cloneNode(true))
          let Rhonbun = eleget0('//div[@class="thre"]/blockquote')?.cloneNode(true)
          if (!Rimg || !Rhonbun) return;
          Rhonbun.style.minWidth = "800px"
          if (!lh("/res/") || eleget0('//div[@class="thre"]/a/img|//div[@class="thre"]/a[2]/img:inscreen:visible') || eleget0('//div[@class="thre"]/blockquote:inscreen:visible') || eleget0('.leadFocus , #pickbox')) return;
          let Rlead = end(document.body, `<div class="ignoreMe leadFocus" style="background-color:#ffffeef8; box-shadow:#00000070 0 0 1em ; border:solid 2px #800000b0; border-radius:1em; padding:1.2em; opacity:1; z-index:2000000020; position:fixed; top:0; right:0; transform:translate(0,-150%);"><table border="0"><tbody><tr><td class="rts">…</td><td class="rtd"></td></tr></tbody></table></div>`)
          Rdesc.forEach(e => eleget0(".rtd", Rlead)?.appendChild(e))
          eleget0(".rtd", Rlead)?.appendChild(Rimg)
          eleget0(".rtd", Rlead)?.appendChild(Rhonbun)

          $(Rlead).animate2({ "transform": "translate(0,0)" }, 333) //, (function(e) { return function() { setTimeout(() => { $(e).animate({"transform":"translate(0,-100%)"},333, () => $(e).remove()) }, 999) } })(lead))
          setTimeout(Rlead => {
            $(document).one("click wheel mousemove keydown", "body", (function(Rlead) {
              return function() {
                $(Rlead).animate2({ "transform": "translate(0,-150%)" }, 333);
                setTimeout(Rlead => Rlead.remove(), 333, Rlead);
              }
            }(Rlead)))
          }, 1333, Rlead)
        }

        // res0:: レス本文をレス0かのように加工
        if (FUTABA_REPLACE_RES0 && ld(/\.2chan\./) && !isfvw && !eleget0('[data-reszero]')) {
          let img = eleget0('div.thre a img')?.cloneNode(true)
          let imgfn = eleget0('div.thre a')?.cloneNode(true)
          let imgfn2 = eleget0('div.thre a')?.cloneNode(true)
          let desc = elegeta('div.thre>span.rsc,div.thre>span.csb,div.thre>span.cnm,div.thre>span.cnw,div.thre>span.cno')?.slice(0, 6)?.map(e => e.cloneNode(true))
          let honbun = eleget0('div.thre blockquote')?.cloneNode(true)
          if (imgfn && imgfn2 && img && honbun) {
            addstyle.add(`.thre table[data-reszero] blockquote:not(.ftbpu table blockquote,#pickbox table blockquote){min-width:800px;}`)
            let lead = before(eleget0(`table[border="0"]`), `<table border="0" data-reszero><tbody><tr><td class="rts">…</td><td class="rtd"><span class="rsc">0</span></td></tr></tbody></table>`)
            lead = !lead ? after(eleget0(`.maxres`), `<table border="0" data-reszero><tbody><tr><td class="rts">…</td><td class="rtd"><span class="rsc">0</span></td></tr></tbody></table>`) : lead
            desc.forEach(e => eleget0(".rtd", lead).appendChild(e))
            end(eleget0(".rtd", lead), `<br>　　`)
            eleget0(".rtd", lead).appendChild(imgfn)
            after(imgfn, `<br>`)
            imgfn2.innerText = ""
            eleget0(".rtd", lead).appendChild(imgfn2)
            imgfn2.appendChild(img)
            eleget0(".rtd", lead).appendChild(honbun)
            elegeta('div.thre>a>img,div.thre>blockquote').forEach(e => {
              e.dataset.hiddenzero = 1;
              e.style.display = "none"
            })
            elegeta('div.thre>span.rsc,div.thre>span.csb,div.thre>span.cnm,div.thre>span.cnw,div.thre>span.cno').forEach(e => {
              e.dataset.hiddenzero = 1;
              e.style.display = "none"
            })

            // レス0のダブルクリックでfutapoのカタログでどの9メモにヒットして開いたスレかを照会
            eleget0('.thre td.rtd')?.addEventListener("dblclick", e => {
              let memoa = pref('FUTACHAN_CATALOG : SearchMyMemo') || [];
              let r0t = honbun.innerText;
              let res0hits = memoa.filter(v => ["★"].includes(v?.m)).filter(v => {
                let re = (isValidRE(v.t)) ? new RegExp(v.t, "mi") : null;
                if ((re && re.test(r0t)) || han(v.t) == r0t) { return 1 }
              }).map(v => "★" + v.t);
              let res0hits8 = memoa.filter(v => ["◎"].includes(v?.m)).filter(v => { let re = (isValidRE(v.t)) ? new RegExp(v.t, "mi") : null; if ((re && re.test(r0t)) || han(v.t) == r0t) { return 1 } }).map(v => "◎" + v.t);
              if (res0hits?.length || res0hits8?.length) popupCenter(`ふたぽカタログの9メモにヒット：\n${res0hits.join("\n")}\n\nふたぽカタログの8メモにヒット：\n${res0hits8.join("\n")}`);
              e.preventDefault();
              return false;
            }, true)
          }
          $(document).on("keydown", e => { e.key == "c" && !e.shiftKey && !e.altKey && !e.ctrlKey && eleget0('div.thre>table[data-rsc="0"]:hover') && $(eleget0('div.thre>a.sod:not(.sodmypush)')).click().effect("highlight") })
        }

        function popupCenter(text, bgcolor = text == "解除" ? "#888" : "#35a") {
          if (!text) return
          text = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
          let e = end(document.body, `<div id="yhmpucBG" style="position:fixed; left:0;top:0; min-width:100vw; min-height:100vh;"><span class="ignoreMe yhmpuc" style="all:initial; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity:1; z-index:2147483647; font-weight:bold; margin:0px 1px; text-decoration:none !important; padding:2em 3em; border-radius:12px; background-color:${bgcolor}; color:white; " >${text}</span></div>`)
          $(e).on("click", e => {
            //      GM.setClipboard(v.target.innerText);
            //    v.target.innerText = `「${v.target.innerText}」をクリップボードにコピーしました`
            removePopup(1)
          })
          removePopup()

          function removePopup(stime = Date.now()) {
            clearTimeout(this?.TO)
            if (Date.now() > 5000 + stime && !eleget0('.yhmpuc:hover')) $("#yhmpucBG").fadeOut(155, e => $("#yhmpucBG").remove());
            else this.TO = setTimeout(removePopup, 111, stime)
          }
        }

        // 引用ポップアップを置き換える
        let replaceMainPopup = (FUTABA_HOVER_POPUP_REPLACE) || !is2chan
        if ((is2chan || ld('kako.futakuro.com')) && replaceMainPopup) { GM_addStyle("#slp{z-index:1001} .qtd{display:none !important;} .fvw_respop,#respopup_area{display:none;opacity:0}"); }
        $("#contres>a,#fvw_loading").attr("title", ($("#contres>a,#fvw_loading").attr("title") || "新着レスを読み込みます") + "\nE：リロード\nD/右クリック：リロード＋新着にスクロール").on("contextmenu", (e) => {
          SITE.funcD();
          return false;
        })


        // cd6::
        //if (ld(/2chan\.net|futafuta|ftbucket|futabaforest/))
        ael(document, "click", evt => {
          if (evt?.target?.matches(':is(:is([href*=".gif"],[href*=".png"],[href*=".jpg"],[href*=".webp"],[href*=".avif"]) > img)') && (evt?.button <= 0)) {
            evt.stopImmediatePropagation() + evt.preventDefault() + evt.stopPropagation();
            return false
          }
        }, true)
        ael(document, "mousedown", evt => {
          if (evt?.target?.matches('a:is([href*=".mp4"],[href*=".webm"],[href*=".avi"]) > img') && (evt?.button <= 0)) return;
          if (evt?.target?.matches(':is(:is([href*=".gif"],[href*=".png"],[href*=".jpg"],[href*=".webp"],[href*=".avif"]) > img)') && (evt?.button <= 0)) {
            evt.stopImmediatePropagation() + evt.preventDefault() + evt.stopPropagation();

            if (!document.fullscreenElement) {
              let p = document.documentElement.requestFullscreen();
              p.catch(() => {});
            }
            let preSrc = GF.isFile ? evt?.target?.src : evt?.target?.closest("a")?.href;
            GF.hideBar = addstyle.add('body {overflow:hidden !important;} #hoverHelpPopup,.phov{display:none !important;}')
            let panel = preSrc.match(/(webm|mp4|avi|mkv)$/) ?
              begin(document.body, `<video id="imgfullscreen" autoplay controls loop style="z-index:2000000021; position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit: contain; background-color:#0000; box-shadow:0 0 1em #0008;"><source referrerpolicy="no-referrer" src="${preSrc}" type="video/mp4"></video>`) :
              begin(document.body, `<img id="imgfullscreen" src="${preSrc}" style="z-index:2000000021; position:fixed; top:0; left:0; width:100%; height:100%; object-fit: contain; background-color:#0000; box-shadow:0 0 1em #0008;">`);

            document.addEventListener("keydown", pmaxEsc, { capture: true, once: 1 })

            function pmaxEsc(e) {
              if (e.key == "Escape") { previewEnd() }
            }
            document?.addEventListener("mousedown", e => {
              e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
              previewEnd()
            }, { capture: true, once: 1 });
            panel?.animate([{ backgroundColor: "#0000", transform: "scale(0.9)", opacity: 0 }, { backgroundColor: "#000c", transform: "scale(1)", opacity: 1 }], { duration: 100, easing: 'ease', fill: 'both' })

            function previewEnd() {
              addstyle.remove(GF.hideBar)
              let panel = eleget0("#imgfullscreen")
              panel?.animate([{ backgroundColor: "#000c", opacity: 1 }, { backgroundColor: "#0000", transform: "scale(0.9)", opacity: 0, transformOrigin: "center" }], { duration: 100, easing: 'ease', fill: 'both' })
              document.removeEventListener('mousemove', pmaxmove)
              document.removeEventListener("keydown", pmaxEsc, { capture: true, once: 1 })
              setTimeout(() => panel?.remove(), 100);
            }
            document.addEventListener('mousemove', pmaxmove)

            function pmaxmove(e) {
              let el = eleget0("#imgfullscreen")
              let s = el?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1;
              let to = `${Math.min(e.clientX,clientWidth())/clientWidth() *100}% ${Math.min(e.clientY,clientHeight())/clientHeight()*100}%`
              anima(el, { "transformOrigin": to, "transform-origin": to });
            }
            panel.addEventListener('wheel', e => {
              e.stopPropagation()
              e.preventDefault()
              if (!e.shiftKey) {
                let s = e?.target?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1;
                s = Math.min(50, Math.max(1, +s - (e.deltaY) / 1000));
                let to = `${Math.min(e.clientX,clientWidth())/clientWidth() *100}% ${Math.min(e.clientY,clientHeight())/clientHeight()*100}%`
                anima(e.target, { "transform": e.target.style.transform.replace(/initial|scale\([0-9\-\.]+\)/g, "") + `scale(${s})`, "transformOrigin": to, "transform-origin": to });
              } else {
                let r = e?.target?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
                r = (Math.round(((r - (-e.deltaY) / 10)) / 10) * 10);
                anima(e.target, { "transform": e.target.style.transform.replace(/initial|rotate\([0-9\-\.]+deg\)/g, "") + ` rotate(${r}deg)` });
              }
              return false
            }, true)


            function anima(e, css, dur = 16.67 * 4) {
              //if (!SMOOTH) { for (let c in css) e.style[c] = css[c]; return }
              GF?.anima?.finish()
              GF?.animaF?.()
              GF.anima = e.animate(css, { duration: dur, fill: "both" })
              GF.animaF = (function(e, css) { return function() { for (let c in css) e.style[c] = css[c]; } })(e, css)
              GF.anima.onfinish = GF.animaF // setTimeout(GF.animaF,dur+1)
            }
          }
        }, true)




        // m::監視ワード設定
        document.addEventListener("focus", () => GF.alertWord = pref("alertWord")?.replace(/^<string>([\s\S]*)<\/string>$/, "$1") || "")
        keyFuncAdd([{
          key: 'm',
          func: () => {
            let undoval = GF?.alertWord || "";
            let sel = window?.getSelection()?.toString()?.trim() || "";
            const tips = "Tips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR\n\n「画像か動画が添付されたレスでABCかDEFかGHIを含む」\n(?:\\d\\sB\\)|^(?!<\\>)\\d+\\.(?:jpe?g|webp|gif|mp4|webm|mov|png)).*(?:ABC|DEF|GHI)";
            let a = prompt(`m:\n監視ワードを正規表現＋独自構文で設定できます\nこれにヒットしたレスはNotificationで通知されます\n\n文字列を選択した状態でmキーを押すと選択文字列が末尾に追加されます${sel?'（今回は"'+sel+'"）':''}\n\n${tips}\n\n現在の設定値:\n${GF?.alertWord||"なし"}\n\n推奨：Firefoxではalerts.useSystemBackend false`, GF?.alertWord + `${GF?.alertWord&&sel?"｜"+sel:sel}` || "")
            if (a === null) return;
            try {
              GF.alertWordRE = new RegExp(a.replace(/^S$/, "??").replace(/^S([\s　\|｜])/, "??$1").replace(/([\s　\|｜!！])S([\s　\|｜])/, "$1??$2").replace(/([\s　\|｜!！])S$/, "$1??").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "mi"); //alert(searRE); // 独自構文を正規表現に変換
            } catch (e) {
              alert(`${a}\n\nは正規表現としてエラーが出てしまうため取り消します\n\n参考：\nhttps://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions\n`);
              a = undoval;
            }
            GF.alertWord = a;
            pref("alertWord", a ? `<string>${a}</string>` || "" : "")
          }
        }])

        if (FUTABA_FLOAT_RELOAD_BUTTON) {
          $('#contres').attr("floated", "");
          GM_addStyle(`#contres{z-index:999; position:fixed; right:18em; left:auto; bottom:3px; height:auto; padding:0.1em 0.2em; border:2px solid #dddddd; background-color:#ffffff;}`)
        }
        pick2title(1)

        GF.myRes = new Set();
        eleget0('input[value="返信する"]')?.addEventListener("click", e => {
          let ysend = window.scrollY; // 返信した時点の縦スクロール位置を記憶して更新後それを復元する
          //GF.myRes.add(eleget0("#ftxa")?.value?.replace(/\s+$/gm, "\n")?.replace(/^\s+/gm, "")?.trim()) // 自分の返信を記憶
          GF.myRes.add(eleget0("#ftxa")?.value?.replace(/^[ \t]+/gm, "")?.replace(/[ \t]+$/gm, "")?.trim()) // 自分の返信を記憶
          restoreScrollY(60000);

          function restoreScrollY(i) {
            if (Math.abs(window.scrollY - ysend) < 11 && i--) requestAnimationFrame(() => restoreScrollY(i));
            else {
              if (fileSel) fileSelectOff();
              window.scrollTo(0, ysend);
              requestAnimationFrame(() => window.scrollTo(0, ysend));
            }
          }
        }, true)

        $(document).on("click", ".relallAreaon", e => SITE?.keyFunc?.find(v => v.id === "z")?.func(e.ctrlKey ? "Shift+Z" : "z"))

        // 自動リロード::
        if (1 || FUTABA_AUTO_RELOAD_INTERVAL >= 1) {
          var musousa = {
            last: Date.now(),
            elapsed: () => { return Date.now() - this.last },
            init: () => {
              this.last = Date.now();
              $('body').on('keydown mousedown mousemove', () => this.last = Date.now());
            },
          }
          musousa.init()

          GF.reloadHis = []; //n::
          eleget0('span#contres')?.addEventListener("mousemove", e => {
            if (FUTABA_DEBUG >= 1 || debug) e.target.setAttribute("title", sani(`E：リロード\nD/右クリック：リロード＋新着にスクロール\n${GF?.reloadHis?.join("\n")||""}\n前回ロード後経過：${Math.floor((Date.now() - (GF?.latestReload||0))/1000)}秒`));
          })
          eleget0('span#contres')?.addEventListener("mouseout", e => {
            e.target.title = `E：リロード\nD/右クリック：リロード＋新着にスクロール`;
          });

          [...new Set(elegeta('input[value="返信する"] , #contres>a , #fvw_loading , a#akahuku_reload_button'))].forEach(e => {
            e?.addEventListener("click", e => {
              //            let inter = 60*1000;
              GF.reloadHis.push(`update：${gettime("hh:mm:ss")} / 新着:${GF?.newarticle} / 前回ロード後経過秒:${~~((Date.now()-GF.latestReload)/1000)} / 無操作秒:${~~(musousa.elapsed()/1000)} / 前回:${GF.latestInterval/1000}`);
              GF.reloadHis = GF.reloadHis.slice(-30)
              GF.latestReload = Date.now();
              GF.reloadAddTime = 0;
              //GF.latestInterval = inter;
              //bcc.setBusy()
            }, true)
          });


          let bcc = {
            channel: null,
            lastReload: { time: Date.now(), src: "" },
            init() {
              if (!this.channel) this.channel = new BroadcastChannel('YHM_REL');
              this.channel.onmessage = (event) => {
                if (event.data.type == 'reload') this.lastReload = { time: event.data.time, src: event.data.src };
              }
            },
            setBusy(e) {
              this.channel.postMessage({ type: 'reload', time: Date.now(), src: GF?.originalDocTitle?.slice(0, 9) || "?" });
              this.lastReload = { type: 'reload', time: Date.now(), src: GF?.originalDocTitle?.slice(0, 9) || "?" };
            },
            isBusy(interval = 2000, f = null) {
              if (Date.now() - this.lastReload.time < interval) {
                f?.(interval, this);
                return this.lastReload;
              }
            }
          }
          bcc.init()

          GF.nReloadSI = (function nreload() { //setInterval(() => {
            do {
              //if (GF?.stopThre) return;
              //            if (document.body.textContent.match("スレッドがありません|上限\d+レスに達しました") && !GF?.stopThre) {
              if (document?.body?.textContent?.match("スレッドがありません|上限\d+レスに達しました")) {
                //clearInterval(GF?.nReloadSI) //GF.stopThre = 1
                if (!GF?.isFile) threendAnten();
                if (document?.visibilityState == "hidden") {
                  document.title = `🐾${document.title}`
                }
                return;
              }
              if (!GF?.reloadAndNotifyNewArrival) break;
              //            if ((musousa.elapsed() < 30000 && document?.activeElement.tagName.match(/textarea|input/i)) || eleget0('//span[@id="thread_down"]') || GF?.stopThre) return;
              //            if ((musousa.elapsed() < 30000 && document?.activeElement.tagName.match(/textarea|input/i)) || eleget0('#thread_down') || GF?.stopThre) return;
              if ((musousa.elapsed() < 30000 && (document.visibilityState == "visible" && document?.activeElement?.tagName?.match(/textarea|input/i))) || eleget0('#thread_down')) break;
              let r = location.protocol != "file:" && eleget0('#contres>a,#fvw_loading');
              if (!r) break;
              let inter = Math.max(60 * 1000, Math.min(Math.max(600000, (FUTABA_AUTO_RELOAD_INTERVAL * 60 * 1000)), (FUTABA_AUTO_RELOAD_INTERVAL * 60 * 1000) + (musousa.elapsed() >= 59000 && GF?.newarticle == 0 && GF.latestInterval / 1))) // 1分以上無操作の時リロードして新着がないと更新間隔を広げていく、最低1分最大10分
              if (!GF.latestReload || Date.now() - (GF.latestReload + (GF?.reloadAddTime || 0)) >= inter) {
                if (bcc.isBusy(10000, (interval, bcc) => {
                    GF.reloadHis.push(`skip：${gettime("hh:mm:ss")}　※（${sani(bcc?.lastReload?.src)}）の更新（${gettime("hh:mm:ss", new Date(bcc?.lastReload?.time))}）が${~~(Date.now()/1000)- ~~(bcc.lastReload.time/1000)}秒前`);
                    //GF.reloadHis.push(`　延期：${gettime("hh:mm:ss")}　＜${gettime("hh:mm:ss", new Date(bcc?.lastReload?.time))}（${sani(bcc?.lastReload?.src)}）＋${interval/1000}秒`);
                    //                    GF.latestReload += 5000 + Math.random() * 999;
                    //                    GF.latestReload = Date.now()+ 5000 + Math.random() * 999;
                    GF.reloadAddTime = GF.reloadAddTime + 5000 + Math.random() * 999;
                  })) {
                  break;
                }
                //GF.reloadHis.push(`n)自動リロード : ${gettime("YYYY/MM/DD hh:mm:ss")} / 現在更新間隔:${~~(inter/1000)} / 新着:${GF?.newarticle} / リロード後経過秒:${~~((Date.now()-GF.latestReload)/1000)} / 無操作秒:${~~(musousa.elapsed()/1000)} / 前回:${GF.latestInterval/1000}`);
                if (FUTABA_DEBUG >= 2) end(document.body, `<div>update : ${gettime()} / 現在更新間隔:${~~(inter/1000)} / 前回新着:${GF?.newarticle} / リロード後経過秒:${~~((Date.now()-GF.latestReload)/1000)} / 無操作秒:${~~(musousa.elapsed()/1000)} / 前回:${GF.latestInterval/1000}</div>`);
                r?.click();
                //GF.latestReload = Date.now()
                GF.latestInterval = inter;
                bcc.setBusy();
              }
              if (FUTABA_DEBUG >= 3) document.title = `${~~(inter/1000)}/${GF?.newarticle}/${~~((Date.now()-GF.latestReload)/1000)}/${~~(musousa.elapsed()/1000)} 現在更新間隔:${~~(inter/1000)} / 新着:${GF?.newarticle} / リロード後経過秒:${~~((Date.now()-GF.latestReload)/1000)} / 無操作秒:${~~(musousa.elapsed()/1000)} / 前回:${GF.latestInterval/1000}`
            } while (0);
            setTimeout(nreload, 1000)
            //}, 1000)
          })();
        }

        // 画面最下段で下ホイール/下キーでリロード
        window.addEventListener('wheel', (e) => {
          if (e.deltaY > 0 && document.body.clientHeight - window.innerHeight <= window.pageYOffset && Date.now() - GF.latestReload >= 5000) {
            if (location.protocol != "file:") {
              $('#contres>a').effect("highlight");
              eleget0('#contres>a,#fvw_loading,a#akahuku_reload_button')?.click()
            }
            GF.latestReload = Date.now();
            GF.reloadAddTime = 0;
          }
        })

        document.addEventListener('keydown', e => {
          if (e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable) return;
          if (["PageDown", "End", "ArrowDown", "ArrowRight"].includes(e.key) && document.body.clientHeight - window.innerHeight <= window.pageYOffset && Date.now() - GF.latestReload >= 5000) {
            location.protocol != "file:" && $('#contres>a').click().effect("highlight");
            GF.latestReload = Date.now();
            GF.reloadAddTime = 0;
          }
        }, true)

        // c::ホバー下にそうだね
        var xTarget = []
        var cnoPushed = new Set()
        var soddone = new Set()
        var sodTarget = []
        var lastc = 0
        document.addEventListener('keydown', e => {
          if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable || ((e?.target?.closest('#chat-messages,ytd-comments-header-renderer') || document?.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
          var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
          var ele = document.elementFromPoint(mousex, mousey);
          var cno = eleget0('table:not([data-reszero]) .cno', ele?.closest('table'))?.textContent?.replace(/\D/g, "")
          //          if (cno && key == "c") $(ele?.closest('td')).effect("highlight")
          if (cno && key == "c" && cno && !cnoPushed.has(cno)) {
            $(ele?.closest('td')).effect("highlight")
            cnoPushed.add(cno)
            xTarget.push({ key: key, cno: cno });
            xTarget = (Array.from(new Set(xTarget.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
            dosou()
            //end(eleget0('.sod', ele?.closest('td')), `<span class="waiting">?</span>`) // くるくるを表示
            //elegeta(`table .cno:text*=${cno}`).forEach(e => end(eleget0(".sod", e?.closest('table')), `<span class="waiting">?</span>`)) // くるくるを表示
          }
        })

        function dosou() {
          if (Date.now() - lastc < 4000) return;
          var a = xTarget.shift()
          if (!a) return
          let [key, cno] = [a.key, a.cno]
          let t = eleget0(`table .cno:text*=${cno}`)?.closest('table')
          if (!t) return;

          if (key == "c" && !(soddone.has(t))) {
            //$('.waiting', t).remove()
            //elegeta(`table .cno:text*=${cno}`).forEach(e => eleget0(".waiting", e?.closest('table'))?.remove())
            eleget0('.sod', t)?.click()
            $('.sod', t).effect("highlight") // eleget0('//div[@class="thre"]/a[@class="sod"]')
            lastc = Date.now()
            soddone.add(t) //t.dataset.soddone = 1;
          }
          setTimeout(dosou, 4100)
        }
        dosou() //setInterval(dosou, 4100)

        // そうだねを改行しないようにする
        //document.body.addEventListener('copy', (event) => { $("#pickbox .sod:contains('x')").css({ "font-size": "125%", "float": "none" }); setTimeout(() => { $("#pickbox .sod:contains('x')").css({ "font-size": "125%", "float": "right" }) }, 1) });

        var sdset = () => { if (is2chan) elegeta('#pickbox .sod:not([onclick]),.ftbpu .sod:not([onclick])').forEach(e => { e.setAttribute("onclick", `sd(${e?.id.replace(/\D/g,"")});return(false);`) }) }
        //        $(document).on("click", "a.sod", (e) => { e.target.style.color = "#f00" }) //$(document).on("click","a.sod",(e)=>{e.target.style.textDecoration="underline"})
        $(document).on("click", "a.sod", (e) => { e.target.classList.add("sodmypush") }) //$(document).on("click","a.sod",(e)=>{e.target.style.textDecoration="underline"})

        location.protocol != "file:" && $("#contres>a,#fvw_loading").on("click", (e => {
          GF.newarticle = 0
          let latestEle = eleget0('//*[@class="thre"]/table[last()]');
          //setTimeout(() => { document.body.dispatchEvent(new Event('2chanReloaded')) }, 1500)
          document.body.dispatchEvent(new Event('2chanReloadedNodelay'))
        })); // リロード再実行


        moq(eleget0('.thre:not(#pickbox .thre)'), `table[border="0"] , div:has(table[border="0"]):not(#pickbox , .qtd)`, newArticle)

        function newArticle(v) { // ,divはfutakuro共存用
          if (!GF.stopmoq) {
            GF.newarticle = elegeta('.thre table .rsc:not([data-basec])').length || 0;
            GF.newarticle && setTimeout(() => { document.body.dispatchEvent(new Event('2chanReloaded')) }, 1)
          }
        }

        function moq(observeNode, targetCSSSelector, cb) {
          new MutationObserver((m) => {
            let eles = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().find(v => v.nodeType === 1 && v?.matches(targetCSSSelector));
            if (eles) cb(eles)
          })?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: false });
        }

        window.addEventListener("focus", () => { // firefox/chrome
          document.title = document.title.replace(/^🐾/g, "");
          if (GF?.arrival) {
            document.title = document.title.replace(/^[🐾🔴🔵⚠️■]+/g, "");
            GF.arrival = 0
          }
          //          let threEnd=eleget0("span#contres:text*=スレッドがありません|上限\d+レスに達しました");
          let threEnd = eleget0("span#contres:text*=スレッドがありません|上限\\d+レスに達しました");
          threEnd?.classList?.remove("threend")
          if (threEnd && lh(/^https:\/\/[^\.]+\.2chan\.net\//)) threendAnten()
        }, true)

        function threendAnten() {
          let threEnd = eleget0("span#contres:text*=スレッドがありません|上限\\d+レスに達しました");
          threEnd.animate([{ boxShadow: "0 0 0em 99em #00000018", outline: "6px solid #f00", offset: 0 }, { zIndex: "999999", boxShadow: "0 0 0em 99em #00000018", outline: "6px solid #f00", offset: 0.8 }, { boxShadow: "0 0 0em 99em #0000", outline: "6px solid #f000", offset: 1 }], { fill: "both", duration: 300 })
        }

        document.body.addEventListener('2chanReloadedNodelay', function() {
          const place = elegeta('.thre table:not(#pickbox table,.ftbpu table,#respopup_area table,[floated] table) , .reloadline , .reloadlinetime')?.pop()
          //after(place, `<hr class="reloadline" style="color:#aaa;">`)
          //          after(place, `<div class="reloadline">`+ (FUTABA_DEBUG>=2?`<div style="font-size:12px;">${new Date().toLocaleString("ja-JP")}</div>`:"") + `<hr style="color:#aaa;"></div>`)
          place && after(place, (FUTABA_DEBUG >= 2 ? `<div class="reloadlinetime" style="font-size:12px;">${new Date().toLocaleString("ja-JP")}</div>` : "") + `<div class="reloadline"><hr style="color:#aaa;"></div>`)

          //$(`<hr class="reloadline" style="color:#aaa;">`).fadeIn("slow", function() { $(this).hide(0).fadeIn("slow") }).insertAfter($(elegeta('.thre table:not(#pickbox table,.ftbpu table,#respopup_area table,[floated] table)').pop()))
        }, false);
        $(document).on("scroll", () => {
          if (elegeta('.reloadline:not([found])').filter(e => isinscreen(e)).length) {
            //            $('.reloadline').attr("found", 1).delay(2000).hide("slow").delay(3000, function() { $(this).remove(); })
            $('.reloadline').attr("found", 1).delay(2000).hide("slow").delay(3000, function() { $(this).remove(); })
          }
        })

        /*        $(elegeta('//table[@class="deleted"]|//tr/td[@class="rtd"]/blockquote[contains(text(),"del")]/../../../..')).attr("title", "クリックで復帰").attr("floated", "1").animate2({ "opacity": "0.3", "transform": "scale(0.8)", "transform-origin": "right", "float": "right" }, 500).one("click", function() {
                  $(elegeta('//table[@class="deleted"]|//tr/td[@class="rtd"]/blockquote[contains(text(),"del")]/../../../..')).attr("title", "").animate2({ "opacity": "0.7", "transform": "scale(1)", "transform-origin": "right", "float": "none" }, 500);
        */
        $(elegeta('//table[@class="deleted"]')).attr("title", "クリックで復帰").attr("floated", "1").animate2({ "opacity": "0.3", "transform": "scale(0.8)", "transform-origin": "right", "float": "right" }, 500).one("click", function() {
          $(elegeta('//table[@class="deleted"]')).attr("title", "").animate2({ "opacity": "0.7", "transform": "scale(1)", "transform-origin": "right", "float": "none" }, 500);
          $(this)[0].scrollIntoView({ block: "nearest", behavior: "smooth" })
        }) // 隔離を薄くして右に

        $(document.body).append(`<script type="text/javascript">function scrRsc(n){let e=[...document.querySelectorAll('.rsc')].find(c=>c.textContent==n);if(e){e.closest(".rtd").style.outline="4px solid #0f0";setTimeout(()=>e.closest(".rtd").style.outline=null,1000)}e?.closest("table")?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center'})}</script>`)

        //addstyle.add('#ftbl,#ftb2,.ftbl,.ftb2{margin:0px 0px 0px 1em !important; left:1em !important;}')
        //addstyle.add(`table.ftbl:nth-child(1 of table.ftbl) > tbody > tr > td:last-of-type > input[name="email"] {position:fixed; top:1em; left:1em;}`)
        setTimeout(() => {
          //          dragElement3(() => elegeta('form#fm > table#ftbl > tbody > tr:text*=あぷ|E-mail|コメント'), ".ftdc", "input,button,textarea", "", (ele, e) => {
          dragElement3(() => elegeta('form#fm > table#ftbl > tbody > tr'), ".ftdc", "input,button,textarea", "", (ele, e) => {
            ele.dataset.stickNearestOfViewport = 1;
            ele.style.zIndex = 999;
            ele.style.backgroundColor = "#fff";
            ele.style.boxShadow = "rgba(0, 0, 0, 0.133) 0px 0px 0px 1px";
          })
        }, 2200)

        addstyle.add(`.embedyt{margin-bottom:0; max-width:43vw; margin-top:-0.5em; min-width: unset !important; width:fit-content; display: grid; grid-template-columns: repeat(auto-fit, minmax(321px, 1fr)); gap: 0px;}`)
        //addstyle.add(`.embedyt{margin-bottom:0; max-width:43vw; margin-top:-0.5em; min-width: unset !important; width:fit-content; display: grid; grid-template-columns: repeat(auto-fit, 323px; gap: 0px;}`)

        if (GF?.isFile) { // ローカルHTMLファイルの時はYouTube・ニコ動の動画を付け直す　SAVE PAGE WEやSingleFileでは「CSPを設定する」オプションを外しておくと再生できる
          // youtubeはreferrer的にケチになったので付け直さずせめてサムネ画像が見れるようにする、ニコ動は付け直す
          /*$('blockquote :is(p:has( #ytplayer) , p:has( iframe)) , .youtubeBQP , .nicovideoBQP , div.vsc-controller , div#pickbox.ignoreFilter').remove();
          elegeta('*[yte] , *[nde] , *[data-yte] , *[ytlinked] , *[data-nde]').forEach(e => {
            e.removeAttribute("yte");
            e.removeAttribute("nde")
            delete e?.dataset?.yte;
            delete e?.dataset?.nde;
            e.removeAttribute("ytlinked")
          })*/
          $('blockquote p:has( iframe[srcdoc*="embed.nicovideo.jp/watch/"]) , .nicovideoBQP , div.vsc-controller , div#pickbox.ignoreFilter').remove();
          elegeta('*[nde] , *[data-nde]').forEach(e => {
            e.removeAttribute("yte");
            e.removeAttribute("nde")
            delete e?.dataset?.yte;
            delete e?.dataset?.nde;
            e.removeAttribute("ytlinked")
          })
        }

        // 検索結果ではリンクになっていないyoutube urlをリンク化 //https://dec.2chan.net/85/futaba.php?guid=on
        if (lh(/https:\/\/[^\.]+\.2chan\.net\/[^\/]*\/futaba\.php\?guid\=on/) || eleget0('html > body > h4:text*=の検索結果"')) elegeta('.rtd blockquote:not([ytlinked]) , div.thre > blockquote:not([ytlinked])').forEach(e => {
          e.setAttribute("ytlinked", "ytlinked");
          e.innerHTML = replaceTextnode(e.innerHTML, /(https?:\/\/(?:www\.nicovideo\.jp|nico.ms)\/[^\<\>\"$]*)/gmi, `<a href="$1">$1</a>`)
          e.innerHTML = replaceTextnode(e.innerHTML, /(https?:\/\/(?:www\.|m\.|)(?:youtube\.com|youtu\.be)\/[^\<\>\"$]*)/gmi, `<a href="$1">$1</a>`)
        })

        function replaceTextnode(html, search, replacement) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          function replaceText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
              const newContent = node.nodeValue.replace(search, replacement);
              if (newContent !== node.nodeValue) {
                const newNode = document.createElement('span');
                newNode.innerHTML = newContent;
                node.replaceWith(newNode);
              }
            } else { node.childNodes.forEach(replaceText); }
          }
          replaceText(tempDiv);
          return tempDiv.innerHTML;
        }

        // ニコ動埋め込み（PrivacyBadger等は要Disable）
        var embednv = () => {
          var elea = elegeta('a[href*="nicovideo"]:not([data-nde]),a[href*="//nico.ms/sm"]:not([data-nde])').filter(e => !e.closest('font[color="#789922"]'))
          for (let ele of elea.filter(e => eleget0('.yhmMyMemo', e.closest("table"))).concat(elea.filter(e => isinscreen(e))).concat(elea)) { // リロード回避のためpickされるものは先に読み込む
            ele.setAttribute("nde", "nde");
            if (ele.dataset.nde) continue;
            ele.dataset.nde = 1
            let url = ele.href; //innerText.replace(/^ttp/i, "http");
            var nico = url.match(/h?ttps?:\/\/(?:www\.|sp\.)?nicovideo.jp\/watch(?:_tmp)?\/(.*)/i);
            //var nico = url.match(/h?ttps?:\/\/(?:www\.|sp\.)?nicovideo.jp\/watch\/(.*)/i);
            if (!nico) var nico = url.match(/h?ttps?:\/\/nico\.ms\/(.*)/i);
            if (!nico) continue;

            let bq = ele?.closest("td,div.thre>blockquote:not([yte])")
            let vbq = eleget0('.embedyt', ele?.closest("td,div.thre>blockquote:not([yte])"))
            if (!vbq) $(bq).append('<blockquote class="embedyt"></blockquote>');
            //$(eleget0('.embedyt', bq)).append(`<p class="ignoreMe pEmbedYT nicovideoBQP" style="display:inline-block; margin:0 1em 1em 0;"><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="max-width: 100%;" height="181" frameborder="0"></iframe></p>`);
            addstyle.add(`.youtubeBQP { overflow:hidden; padding:0 11px 0 0; margin 0px; display:inline-block;} .youtubeBQP:hover{resize:both; background-color:#ffffff88; outline:1px solid #88888888;}`)
            let ytv = end(eleget0('.embedyt', bq), `<p class="ignoreMe pEmbedYT nicovideoBQP youtubeBQP" style="display:inline-block; margin:0 1em 1em 0;"><iframe id="nicoplayer" loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="max-width: 100%;" height="181" frameborder="0"></iframe></p>`);
            //                let ytv = end(eleget0('.embedyt', bq), `<p class="ignoreMe pEmbedYT youtubeBQP" title="${sani(url)}\n${sani(src)}" sytle=""><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="strict-origin" src="${src}" id="ytplayer" type="text/html"  height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></iframe></p>`);
            ytResize2(2);
            dragElement2(ytv, "*", "iframe", ".youtubeBQP");
            cbOnce(() => window.addEventListener("mousedown", e => { if (e?.target?.matches(".youtubeBQP"))[...new Set([e.target, ...(elegeta('.youtubeBQP').sort((a, b) => window.getComputedStyle(b).zIndex - window.getComputedStyle(a).zIndex))])].reverse().forEach((e, i) => e.style.zIndex = i + 1) }, true))
            /*            cbOnce(() => window.addEventListener("mousedown", e => {
                          if (e?.target?.matches(".youtubeBQP")) {
                            e.target.style.setProperty("z-index", GF.BQPZ);
                            GF.BQPZ = GF.BQPZ + 1;
                          }
                        }))
              */
            //$(ele?.closest("td,div.thre>blockquote:not([nde])")).append(`<blockquote><p class="ignoreMe" style="margin:0 0 0px;"></p></blockquote>`) // 埋め込み外部プレイヤー版
            //break; // 一度に１つずつしかやらない
          }
          if (elea.length) setTimeout(embednv, 2000 + elea.length * 10);
        }
        autoPagerized(embednv)

        // youtube埋め込み
        var embedyt = () => {
          var elea = elegeta('a[href*="youtube.com"]:not(#pickbox a,[data-yte],[yte]) , a[href*="youtu.be"]:not(#pickbox a,[data-yte],[yte])').filter(e => !e.closest('font[color="#789922"]'))
          for (let ele of elea.filter(e => eleget0('.yhmMyMemo', e.closest("table"))).concat(elea.filter(e => isinscreen(e))).concat(elea)) { // リロード回避のためpickされるものは先に読み込む
            if (ele.dataset.yte) continue;
            ele.dataset.yte = 1
            ele.setAttribute("yte", "yte");
            let url = ele.href //innerText;
            var sm = (url.match(/h?ttps?:\/\/youtu\.be\/(?:watch\?v=)?([a-zA-Z0-9_\-]{11}).*[\?\&]t=(\d*).*$/i) || url.match(/h?ttps?:\/\/(?:www\.|m\.)?youtube\.com\/(?:live\/|watch\S*?[\?\&]v=)([a-zA-Z0-9_\-]{11}).*&t=(\d*).*$/i)) || url.match(/h?ttps?:\/\/youtu\.be\/(?:watch\S*?[\?\&]v=)?([a-zA-Z0-9_\-]{11})/i) || url.match(/h?ttps?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_\-]{11})/i) || url.match(/h?ttps?:\/\/(?:www\.|m\.)?youtube\.com\/(?:live\/|watch\S*?[\?\&]v=)([a-zA-Z0-9_\-]{11})/i);
            //            var videoList = url.match0(/(?:https:\/\/www\.youtube\.com\/embed\/\?playlist=|https:\/\/www\.youtube\.com\/watch_videos\?video_ids=)([a-zA-Z0-9_\-\,]+)/)?.split(",")?.filter(v => v.match(/^[a-zA-Z0-9_\-]{11}$/));
            var videoList = url.match0(/(?:https:\/\/www\.youtube\.com\/embed\/\?playlist=|https:\/\/www\.youtube\.com\/watch_videos\?video_ids=)([a-zA-Z0-9_\-\,]+)/)?.split(",")?.filter(v => v.match(/^[a-zA-Z0-9_\-]{11}$/));
            //var videoList = url.match0(/https:\/\/www\.youtube\.com\/watch_videos\?video_ids=([a-zA-Z0-9_\-\,]+)/)?.split(",")?.filter(v => v.match(/^[a-zA-Z0-9_\-]{11}$/));
            var pl = (url.match0(/[\&\?]list=([a-zA-Z0-9_\-]+)/));
            if (!pl && !sm && !videoList) continue;
            if (1) { // ２列詰め込む
              let bq = ele?.closest("td,div.thre>blockquote:not([yte])")
              let vbq = eleget0('.embedyt', ele?.closest("td,div.thre>blockquote:not([yte])"))
              if (!vbq) $(bq).append('<blockquote class="embedyt"></blockquote>');
              let src = sm ? 'https://www.youtube.com/embed/' + sm[1] + (pl ? `?list=${pl}` : "") + (sm[2] ? `${pl?"&":"?"}start=` + sm[2] : "") :
                videoList ? `https://www.youtube.com/embed/${videoList[0]}?playlist=${videoList?.join(',')}` :
                pl ? `https://www.youtube.com/embed?listType=playlist&list=${pl}` :
                "";
              if (src) {
                addstyle.add(`.youtubeBQP { overflow:hidden; padding:0 11px 0 0; margin 0px; display:inline-block;} .youtubeBQP:hover{resize:both; background-color:#ffffff88; outline:1px solid #88888888;}`)
                let ytv = end(eleget0('.embedyt', bq), `<p class="ignoreMe pEmbedYT youtubeBQP" title="${sani(url)}\n${sani(src)}" sytle=""><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="${YT_REFERRER}" src="${src}" id="ytplayer" type="text/html"  height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></iframe></p>`);
                ytResize2(2);
                dragElement2(ytv, "*", "iframe", ".youtubeBQP");
                cbOnce(() => window.addEventListener("mousedown", e => { if (e?.target?.matches(".youtubeBQP"))[...new Set([e.target, ...(elegeta('.youtubeBQP').sort((a, b) => window.getComputedStyle(b).zIndex - window.getComputedStyle(a).zIndex))])].reverse().forEach((e, i) => e.style.zIndex = i + 1) }, true))
                /*cbOnce(() => window.addEventListener("mousedown", e => {
                  if (e?.target?.matches(".youtubeBQP")) {
                    e.target.style.setProperty("z-index", GF.BQPZ);
                    GF.BQPZ = (GF?.BQPZ || 3) + 2;
                  }
                }, true))
                */
                ele.title = `${sani(url)}\n↓\n${sani(src)}`;
              }
            } else { // １列モード
              if (sm) $(ele?.closest("td,div.thre>blockquote:not([yte])")).append(`<blockquote><p class="ignoreMe" style="margin:0 0 0px;"><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="${YT_REFERRER}" src="https://www.youtube.com/embed/` + sm[1] + (pl ? `?list=${pl}` : "") + (sm[2] ? `${pl?"&":"?"}start=` + sm[2] : "") + `" id="ytplayer" type="text/html"  height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></p></blockquote>`); //width=${pl?401:321}
            }
            //break; // 一度に１つずつしかやらない
          };
          if (elea.length) setTimeout(embedyt, 2000 + elea.length * 10);
        }
        autoPagerized(embedyt)

        // fu画像埋め込み
        addstyle.add(`.pEmbedYT{display:inline-block; margin:0 12px 1em 0;}`) //addstyle.add(`.pEmbedYT{display:inline-block; margin:0 1em 1em 0;}`)
        addstyle.add(`.embedyt:not(#pickbox .embedyt) img{max-width:250px !important; max-height:250px !important; width:auto; height:auto; }`)
        var embedimg = () => {
          if (ld("tsumanne")) {
            elegeta('table blockquote a:not([ime])').filter(v => v?.href?.match(/fu?\d+\.(jpg|jpeg|png|gif|bmp|webp)/gmi)).forEach(e => {
              e.setAttribute("ime", "ime");
              $(e?.closest("td,div.thre>blockquote")).append(`<blockquote style="margin-top:0;"><p class="ignoreMe" style="margin:0 0 0px;"><img loading="lazy" class="ignoreMe" referrerpolicy="no-referrer" style="max-width:250px;max-height:250px;" src="${e.href}"></p></blockquote>`)
            })
            elegeta('table blockquote a:not([ime])').filter(v => v?.href?.match(/fu?\d+\.(mp4|webm|mov|mp3|aac|flac|m4a)/gmi)).forEach(e => {
              e.setAttribute("ime", "ime");
              $(e?.closest("td,div.thre>blockquote")).append(`<blockquote style="margin-top:0;"><p class="ignoreMe" style="margin:0 0 0px;"><video loading="lazy" controls="" name="media" src="${e.href}" style="max-width:250px;max-height:250px;" class="ignoreMe"></video></p></blockquote>`)
            })
          } else {
            var elea = elegeta('.rtd blockquote:not([ime]) , div.thre>blockquote:not([ime])')
            for (let ele of elea) { // 画面内にあるものだけが基本だけどリロード回避のためpickされるものは優先的に読み込む
              let txt = ele.innerText;
              ele.setAttribute("ime", "ime");
              var sm = txt.match(/(?<!\>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|avif)/gm);
              if (sm?.length) {
                var bq = ele?.closest("td,div.thre>blockquote:not([yte])")
                var vbq = eleget0('.embedyt', ele?.closest("td,div.thre>blockquote:not([yte])"))
                if (!vbq) $(bq).append('<blockquote class="embedyt"></blockquote>');
                eleget0('.embedyt', bq).style.display = "flow-root"; // 縦長の画像を沢山詰め込むためにgridをやめる
                sm.forEach(v => {
                  var u = `https://${/^fu\d+\./.test(v)?"dec.2chan.net/up2/src/":"dec.2chan.net/up/src/"}${v}`;
                  $(eleget0('.embedyt', bq)).append(`
                    <p class="ignoreMe pEmbedYT">
                    <a rel="noopener nofollow noreferrer" href="${u}"><img loading="lazy" width="250px" height="250px" class="ignoreMe" referrerpolicy="no-referrer" src="${u}" onload="this.title=this.naturalWidth+' x '+this.naturalHeight+'\\n${sani(v)}';"></a>
                    </p>`)
                })
              }
              var sm = txt.match(/(?<!\>)fu?\d+\.(mp4|webm|mov|mp3|aac|flac|m4a)/gmi);
              if (sm?.length) {
                var bq = ele?.closest("td,div.thre>blockquote:not([yte])")
                var vbq = eleget0('.embedyt', ele?.closest("td,div.thre>blockquote:not([yte])"))
                if (!vbq) $(bq).append('<blockquote class="embedyt"></blockquote>');
                eleget0('.embedyt', bq).style.display = "flow-root"; // 縦長の画像を沢山詰め込むためにgridをやめる
                sm.forEach(v =>
                  $(eleget0('.embedyt', bq)).append(`
                    <p class="ignoreMe pEmbedYT">
  <a rel="noopener nofollow noreferrer" href="https://${/^fu\d+\./.test(v)?"dec.2chan.net/up2/src/":"dec.2chan.net/up/src/"}${v}" class="ignoreMe" style="margin:0 0 0px;"><video loading="lazy" controls loop name="media" src="https://${/^fu\d+\./.test(v)?"dec.2chan.net/up2/src/":"dec.2chan.net/up/src/"}${v}" style="max-width:250px;max-height:250px;" class="ignoreMe"></video></a>
                    </p>`))
              }
              var sm = txt.match(/(?<!\>)fu?\d+\.(txt|zip)/gmi);
              if (sm?.length) {
                var bq = ele?.closest("td,div.thre>blockquote:not([yte])")
                var vbq = eleget0('.embedyt', ele?.closest("td,div.thre>blockquote:not([yte])"))
                if (!vbq) $(bq).append('<blockquote class="embedyt"></blockquote>');
                eleget0('.embedyt', bq).style.display = "flow-root"; // 縦長の画像を沢山詰め込むためにgridをやめる
                sm.forEach(v =>
                  $(eleget0('.embedyt', bq)).append(`
                    <p class="ignoreMe pEmbedYT">
  <a rel="noopener nofollow noreferrer" href="https://${/^fu\d+\./.test(v)?"dec.2chan.net/up2/src/":"dec.2chan.net/up/src/"}${v}" class="ignoreMe" style="margin:0 0 0px;">${sani(sm[0])}</a>
                    </p>`))
              }
              //break; // 一度に１つずつしかやらない
            };
            //if (elea.length) setTimeout(() => embedimg(), 2000 + elea.length * 10);
          }
        }
        autoPagerized(() => { embedimg() })

        FUTABA_PLAY_GIF_INLINE && autoPagerized(() => embedGif())

        function embedGif() {
          elegeta('.thre>a>img[href*=".gif"]:not([data-gifloaded]),td.rtd>a[href*=".gif"]>img:not([data-gifloaded])').forEach(e => {
            let a = e.closest("a")
            if (a) {
              e.dataset.gifloaded = 1
              e.src = a.href;
            }
          })
        }

        var popped = []
        //$(eleget0('//td/input[@value="返信する"]')).on("click", () => { setTimeout(() => shikomi(), 999) })
        // 引用ポップアップ仕込み
        var cited = [];
        var resEnum = [];

        if (eleget0('//b[contains(text(),"このスレの書き込みはＩＰアドレスが表示されます。")]')) addstyle.add('#ftxa{background-color:#fee !important;}') // IPスレ警告
        addstyle.add('.idw{color:#f00; font-weight:800;}')

        function shikomi() {
          elegeta('.rtd blockquote a:not([rel])').forEach(v => { v.rel = "noopener nofollow noreferrer" })
          //alert(elegeta('.rtd blockquote a:not([rel])').length)
          if (FUTABA_REMOVE_REDIRECT_PAGE) elegeta('td.rtd blockquote a[href*="/bin/jump.php?"] , div.thre blockquote a[href*="/bin/jump.php?"]').forEach(e => {
            //e.rel = "noopener nofollow noreferrer"
            e.href = e.href.replace(/^.*\/bin\/\jump\.php\?/, "")
          }); // リダイレクトページを省略

          GF.alertWord = pref("alertWord")?.replace(/^<string>([\s\S]*)<\/string>$/, "$1") || ""; // m::
          let idw = elegeta('.cnw:not(.idw)')
          if (idw.every(v => /ID\:/.test(v.innerText))) {
            GF.idw = 1;
            addstyle.add('#ftxa{background-color:#fee;}') //            addstyle.add('#ftxa{background-color:#ffd;}')
          } else if (GF?.idw) addstyle.add('#ftxa{background-color:#fff;}')
          idw.filter(v => /ID\:|IP\:/.test(v.innerText)).forEach(e => e.classList.add("idw")) // IDスレ警告

          elegeta('.thre table tr:not([data-quospan])').forEach(e => {
            e.dataset.quospan = "1";
            e.insertAdjacentHTML("beforeend", `<td class="ignoreMe quo" style="position:relative;"><div class="ignoreMe memo"></div><div class="ignoreMe backlink"></div><div class="ignoreMe relallArea"> </div></td>`)
          })

          let notifyDelay = 0;
          let awNotify = 0;

          elegeta('.thre table .rtd .rsc:not([data-basec]),.thre table .res_no:not([data-basec])').forEach(e => {
            let table = e.closest('table');
            e.dataset.basec = "1"
            let resno = e?.textContent;
            table.setAttribute("rsc", resno);

            e.style.cursor = "pointer"
            e.setAttribute("onclick", `scrRsc(${Number(e.textContent)})`); //クリックで中心にスクロール

            //if (resno) eleget0(".rts", table)?.setAttribute("onclick", `scrRsc(${resno})`);

            FUTABA_LAZY && table && elegeta('img,video', table).forEach(e => e.setAttribute("loading", "lazy"));
            e.closest('.rtd').dataset.rsc = resno
            table.dataset.rsc = resno
            //          })

            //          elegeta('.thre table .rtd .rsc:not([data-basec]),.thre table .res_no:not([data-basec])').forEach(e => {
            e.dataset.basec = "1"
            //elegeta('blockquote:nth-of-type(1) a[href*="%23"]', e.closest('.rtd')).forEach(v => v.href = v.href.replace(/^.*\/bin\/\jump\.php\?/, "").replace(/\%23/g, "#")) // 間違ったエンコードである#→%23を#に戻す
            //elegeta('blockquote:nth-child(1 of blockquote) a[href*="%23"]', e.closest('.rtd')).forEach(v => v.href = v.href.replace(/^.*\/bin\/\jump\.php\?/, "").replace(/\%23/g, "#")) // 間違ったエンコードである#→%23を#に戻す

            var text = eleget0('blockquote', e.closest('table'))?.innerText?.trim()
            let isMyres = (text && GF?.myRes?.has(text))

            if (FUTABA_SET_56MEMO_TO_ANCHORED >= 1 && isMyres) { // 送信したレスに5メモを付ける
              memoElement(e, document.body, COLOR5, getDefault56memo());
              GF.myRes.delete(text) //filter(v => !GF?.myRes?.includes(text))
            }

            setTimeout(e => { // 非表示等を反映させるため遅らせる

              var tomemo = GF?.anchor[e?.closest("table")?.dataset?.rsc] || ""
              let hasAnyMemo = eleget0('.yhmMyMemo', e?.closest("table")) ? 1 : 0

              if (GF?.fromSecond) {
                //              if (FUTABA_SET_56MEMO_TO_ANCHORED >= 3 && !isMyres) { // 遠くても5メモと連鎖していれば通知する
                if (FUTABA_SET_56MEMO_TO_ANCHORED >= 3 && !isMyres && !hasAnyMemo) { // 遠くても5メモと連鎖していれば通知する
                  //var relatedMemoO = getRelatedRsca(e?.closest("table")?.dataset?.rsc)?.find(rsc => (eleget0('.yhmMyMemoO', eleget0(`table[data-rsc="${rsc}"]`))))
                  var [relatedMemoO, ] = getRelatedRsca(e?.closest("table")?.dataset?.rsc)
                  relatedMemoO = relatedMemoO?.find(rsc => (eleget0(`.yhmMyMemoO[data-yhmc="${COLOR1}"]`, eleget0(`table[data-rsc="${rsc}"]`))))
                  if (relatedMemoO && !tomemo.match("🔵")) {
                    let res = eleget0(`blockquote`, eleget0(`table[data-rsc="${relatedMemoO}"]`))?.innerText
                    var text = eleget0('blockquote', e.closest('table'))?.innerText?.trim()
                    let quoteLine = text?.split("\n")?.filter(v => v.match(/^\s*\>+.*\s*$/))?.pop() || ""; // >○○の引用行は最後の１行だけ使う
                    quoteLine = quoteLine ? `${quoteLine}\n` : ""
                    res = res?.replace(/^\s*\>.*\s*$/gm, "")?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm, "")?.trim() + quoteLine || res;
                    tomemo = tomemo || text?.match0(/^\>[^\n]*/m) || "";
                    tomemo += (tomemo ? "\n" : "");
                    tomemo = (`>🔵indirect:${res.split("\n")?.[0]}\n`) + tomemo;
                    //                    tomemo = (`>🔵indirect:${res.split("\n")?.pop()}\n`) + tomemo;
                  }
                }

                if (FUTABA_SET_56MEMO_TO_ANCHORED >= 4 && !isMyres) { // 遠くても6メモと連鎖していれば通知する
                  var [relatedMemoO, ] = getRelatedRsca(e?.closest("table")?.dataset?.rsc)
                  relatedMemoO = relatedMemoO?.find(rsc => (eleget0('.yhmMyMemoX', eleget0(`table[data-rsc="${rsc}"]`))))
                  if (relatedMemoO && !tomemo.match("🔴")) {
                    let res = eleget0(`blockquote`, eleget0(`table[data-rsc="${relatedMemoO}"]`))?.innerText
                    let quoteLine = text?.split("\n")?.filter(v => v.match(/^\s*\>+.*\s*$/))?.pop() || ""; // >○○の引用行は最後の１行だけ使う
                    quoteLine = quoteLine ? `${quoteLine}\n` : ""
                    res = res?.replace(/^\s*\>.*\s*$/gm, "")?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm, "")?.trim() + quoteLine || res;
                    tomemo = tomemo || text?.match0(/^\>[^\n]*/m) || "";
                    tomemo += (tomemo ? "\n" : "");
                    //                  tomemo = (`>🔴indirect:${res.split("\n")?.pop()}\n`) + tomemo;
                    tomemo = (`>🔴indirect:${res.split("\n")?.[0]}\n`) + tomemo;
                  }
                }
              }

              let table = e.closest('table');
              var text = table?.innerText?.replace(/\n/gm, " ");
              //var text = table?.textContent;

              // m::
              let awMatch = GF?.alertWord > "" && text?.match0(GF?.alertWord) || text?.match0(new RegExp(GF?.alertWord.replace(/^S$/, "??").replace(/^S([\s　\|｜])/, "??$1").replace(/([\s　\|｜!！])S([\s　\|｜])/, "$1??$2").replace(/([\s　\|｜!！])S$/, "$1??").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"), "i")); //alert(searRE); // 独自構文を正規表現に変換
              if (!GF.isFile && !isMyres && GF?.alertWord > "" && (e.offsetHeight && awMatch) && !eleget0('.yhmMyMemo', table)) {
                var path = eleget0('img', table)?.src
                if (FUTABA_SET_56MEMO_TO_ANCHORED) memoElement(e, document.body, COLOR_ALERT_WORD, getDefault56memo());
                if (awNotify++ < 3) notifyMe((eleget0("blockquote", table)?.innerText || eleget0("blockquote", table)?.textContent) + "\n", `⚠️${awMatch}⚠️ ${GF?.originalDocTitle||document.title}`, () => setTimeout(() => scrRsc(e?.closest('table')?.dataset?.rsc), 150), path || null, true)
                if (FUTABA_NOTIFY_NEWRES_SOUND_MEMO_QUOTED.split(" ").includes("m")) sound("sawtooth", 0.025, 440)
                document.title = "⚠️" + document.title.replace(/^[■🔴🔵⚠️]+/g, "");
              } //else

              if (GF?.fromSecond) {
                // nキーのモードと条件にマッチすれば通知する
                if (!isMyres && (((GF?.reloadAndNotifyNewArrival >= 2 && tomemo) || (GF?.reloadAndNotifyNewArrival >= 3 && (tomemo || (e.offsetHeight && eleget0("img:not(.quoteSpeechBalloonImg),blockquote a,blockquote video", e.closest('table'))))) || (GF?.reloadAndNotifyNewArrival >= 4 && e.offsetHeight)) && (document.visibilityState !== "visible" || tomemo))) {
                  var path = eleget0('img', e.closest('table'))?.src
                  notifyMe(tomemo + eleget0('blockquote', e.closest('table'))?.innerText?.replace(/^>.*$/gm, "")?.trim(), tomemo.replace(/[^🔴🔵]/gm, "") + GF.originalDocTitle, () => setTimeout(() => scrRsc(e?.closest('table')?.dataset?.rsc), 150), path || null)
                  if (tomemo.match("🔵")) {
                    if (FUTABA_NOTIFY_NEWRES_SOUND_MEMO_QUOTED.split(" ").includes("5")) sound("square", 0.025, /indirect\:/.test(tomemo) ? 660 : 880); // type:sine, square, sawtooth, triangleがある
                    //if (FUTABA_NOTIFY_NEWRES_SOUND_MEMO_QUOTED.split(" ").includes("5")) sound("square", 0.025, 880); // type:sine, square, sawtooth, triangleがある
                    if (!document.hasFocus()) {
                      GF.arrival = 1;
                      document.title = "🔵" + document.title.replace(/^[■🔴🔵]+/g, "");
                    }
                  }
                  if (tomemo.match("🔴")) {
                    if (FUTABA_NOTIFY_NEWRES_SOUND_MEMO_QUOTED.split(" ").includes("6")) sound("square", 0.025, 220); // type:sine, square, sawtooth, triangleがある
                    if (!document.title.match(/^[■🔴]*🔵/) && !document.hasFocus()) {
                      GF.arrival = 1;
                      document.title = "🔴" + document.title.replace(/^[■🔴]+/g, "");
                    }
                  }
                }

                if ((!GF?.arrival && document.visibilityState !== "visible") && (!GF?.reloadAndNotifyNewArrival || (GF?.reloadAndNotifyNewArrival && e.offsetHeight))) {
                  GF.arrival = 1;
                  document.title = `■${document.title}` //document.title = `■${GF.originalDocTitle}`
                }
              }
              /*              if (FUTABA_SET_56MEMO_TO_ANCHORED >= 3 && !isMyres&&tomemo.match("🔵")) memoElement(e, document.body, COLOR6, getDefault56memo()); // 5メモへアンカーしたレスに6メモを付ける
                            if (FUTABA_SET_56MEMO_TO_ANCHORED >= 4 && !isMyres&&tomemo.match("🔴")) memoElement(e, document.body, COLOR6, getDefault56memo()); // 6メモへアンカーしたレスに6メモを付ける
              */
              if (GF?.fromSecond) {
                if (FUTABA_SET_56MEMO_TO_ANCHORED >= 3 && !isMyres) { // 5メモへアンカーしたレスに6メモを付ける
                  if (tomemo.match("🔵")) {
                    memoElement(e, document.body, COLOR6, getDefault56memo());
                  }
                }
                if (FUTABA_SET_56MEMO_TO_ANCHORED >= 4 && !isMyres) { // 6メモへアンカーしたレスに6メモを付ける
                  if (tomemo.match("🔴")) {
                    memoElement(e, document.body, COLOR6, getDefault56memo());
                  }
                }
              }

              //            }, 1 + (notifyDelay++) * 17, e)
              //            setTimeout(()=>document.body.dispatchEvent(new CustomEvent('plzGKSI')),555)
            }, 1, e)
          })
          //          GF.fromSecond = 1; // 初回は新着ではないのでやらない

          /*          elegeta('.thre table tr:not([data-quospan])').forEach(e => {
                      e.dataset.quospan = "1";
                      e.insertAdjacentHTML("beforeend", `<td class="ignoreMe quo" style="position:relative;"><div class="ignoreMe memo"></div><div class="ignoreMe backlink"></div><div class="ignoreMe relallArea"> </div></td>`)
                    })
          */
          // 逆引用を追加
          var issorted = eleget0('#sortType2') || eleget0('#sortType1')
          resEnum = [];
          cited = [];
          GF.anchor = new Array(1000).fill("")

          var resa = elegeta('.thre table .rtd:not(#pickbox .rtd,.ftbpu .rtd,#respopup_area .rtd)').sort((a, b) => { return (Number(a.dataset.rsc) - Number(b.dataset.rsc)) })
          elegeta(".revQuote:not(#pickbox .revQuote,.ftbpu .revQuote)").forEach(e => e?.remove())

          //test: 5578ms - タイマー終了 test: 5327ms - タイマー終了
          //elegeta('.thre table .rtd blockquote font:not(#pickbox font,.ftbpu font,#respopup_area font),.thre table .rtd blockquote p font:not(#pickbox font,.ftbpu font,#respopup_area font)').forEach((h, i) => { //緑文字の引用行文字列
          resa.map(v => elegeta('blockquote :is(font,p font)', v)).flat().forEach((h, i) => { //緑文字の引用行文字列
            var eWord = h.textContent.match(/^\>+(.+)$/)?.[1]; // >***の***部分 // oこれだと>>No.*への逆引用がつくのは「>No.*」と「No.*」の両方に逆引用がつく x本当にレスしている対象より前の初出のレスだけに逆引用がついてしまう
            //var eWord = h.textContent.match(/^\>(.+)$/)?.[1]; // >***の***部分 // xこれだと>>No.*への逆引用がつくのは「>No.*」だけになり「No.*」にはつかない o本当にレスしている対象より前のものだけに逆引用がついてしまう
            if (eWord) {
              //h.style.cursor="pointer" //これをやるとちょっとうるさい
              var greenResNo = h.closest('table').dataset.rsc; //緑文字列があるレスのレス番
              resa.filter(e => e.textContent.indexOf(eWord) !== -1).forEach((c, i) => { // c=***が含まれるレス
                let n = c.dataset.rsc; // ***が含まれるレスのレス番
                if (i === 0 && !(!resEnum[n] && n === greenResNo)) { // i==0つまりスレの初出のそれにしかヒットしない
                  let r = eleget0(".relallArea", h.closest('table'))?.classList.add("relallAreaon") // >>100があったらrelallOn
                  eleget0(".relallArea", c.closest('table'))?.classList.add("relallAreaon") // >あいう の対象レスが本当に存在したらrelallOn
                  if (!resEnum[n]) resEnum[n] = [];
                  if (FUTABA_FORWARD_LINK)
                    if (!resEnum[greenResNo]) resEnum[greenResNo] = [];
                  if (!resEnum[n].includes(greenResNo)) {
                    resEnum[n].push(greenResNo)
                    if (FUTABA_FORWARD_LINK) resEnum[greenResNo].push(n)
                    if (FUTABA_FORWARD_LINK >= 2) end(eleget0(".quo .backlink", h.closest('table')), `<font class="revQuote" data-resenum="${resEnum[greenResNo]}" data-rsc="${greenResNo}" onclick="scrRsc(${n})">${n}&lt;&lt;</font>`) // 2<< のバックリンク
                    end(c.parentNode.querySelector(".backlink"), `<font class="revQuote" data-resenum="${resEnum[n]}" data-rsc="${n}" onclick="scrRsc(${greenResNo})">&gt;&gt;${greenResNo}</font>`) //クリックで中心にスクロール
                    let memo = (eleget0(`.yhmMyMemoO[data-yhmc="${COLOR1}"]`, c.closest('table'))) ? `>🔵${eWord}\n` : (eleget0('.yhmMyMemoX', c.closest('table'))) ? `>🔴${eWord}\n` : null;
                    if (memo) GF.anchor[h?.closest("table")?.dataset?.rsc] += memo
                  }
                }
              })
            }
          })

          let fivechthumbnailetc = (!lh(/\.2chan\.net\//) || eleget0('#fivechthumbnailetc')) && 1
          // >No.○に本文の引用を追加 qsb::
          //          if (FUTABA_QUOTE_LEAD_FOR_NUMBER_ONLY && fivechthumbnailetc) { //} || lh("ftbucket|kuzure")) {
          if (FUTABA_QUOTE_LEAD_FOR_NUMBER_ONLY) { //} || lh("ftbucket|kuzure")) {
            var quos = elegeta('.thre table .rtd blockquote font:not([data-quoted],#pickbox font,.ftbpu font,#respopup_area font),.thre table .rtd blockquote p font:not([data-quoted],#pickbox font,.ftbpu font,#respopup_area font)').filter(v => v.innerText.match(/>+No\.|>+\d|>+fu/))
            quos.filter(e => /^\>+No\.\d+$/m.test(e?.textContent)).forEach((e, i) => { //緑文字の引用行文字列
              e.dataset.quoted = 1
              let ecno = e?.textContent?.replace(/\D/g, "")
              var srcTable = elegeta("table .cno").find(v => v?.textContent?.replace(/\D/g, "") == ecno)?.closest("table[rsc]")
              if (srcTable && srcTable != e?.closest("table[rsc]")) {
                var origno = e?.textContent
                var lead = eleget0('blockquote', srcTable)?.innerText?.replace(/^\s*>+.*$/gm, "")?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                if (!lead) lead = eleget0('blockquote', srcTable)?.innerText?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                if (lead?.slice(33)?.length) lead = lead?.slice(0, 33)?.trim() + "…"
                lead = lead?.replace(/\n/gm, " ")
                if (lead) {
                  //                  adja(e, "afterend", `　<span class="quoteSpeechBalloon" data-quoteno="${origno}">　&gt;${lead}　</span>`)
                  fivechthumbnailetc && adja(e, "afterend", `<span class="quoteSpeechBalloon" data-quoteno="${origno}">&gt;${lead}</span>`)
                }
                var srcImg = eleget0("img", srcTable)?.cloneNode()
                if (srcImg) {
                  srcImg.removeAttribute("width")
                  srcImg.removeAttribute("height")
                  srcImg.dataset.quoteno = origno
                  srcImg.className = "quoteSpeechBalloonImg"
                  srcImg.removeAttribute("hspace")
                  srcImg.removeAttribute("align")
                  srcImg.dataset.zoomonhover = "disable"
                  srcTable && e.appendChild(srcImg)
                }
              }
            })
            // >>○.jpgに本文の引用を追加 qsb::
            quos.filter(e => /^\>+\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mov|mp4)$/m.test(e?.textContent)).forEach((e, i) => { //緑文字の引用行文字列
              e.dataset.quoted = 1
              let ertd = e?.textContent?.replace(/\>+/, "")
              var srcTable = elegeta("table .rtd").find(v => { return v?.textContent?.match(/\d+\.(jpg|jpeg|png|gif|bmp|webp|webm|mov|mp4)/)?.[0] == ertd })?.closest("table[rsc]")
              if (srcTable && srcTable != e?.closest("table[rsc]")) {
                var origno = e?.textContent
                var lead = eleget0('blockquote', srcTable)?.innerText?.replace(/^\s*>+.*$/gm, "")?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                if (!lead) lead = eleget0('blockquote', srcTable)?.innerText?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                if (lead?.slice(33)?.length) lead = lead?.slice(0, 33)?.trim() + "…"
                lead = lead?.replace(/\n/gm, " ")
                var srcImg = eleget0("img", srcTable)?.cloneNode()
                if (lead) {
                  //                  adja(e, "afterend", `　<span class="quoteSpeechBalloon" data-quoteno="${origno}">　&gt;${lead}　</span>`)
                  fivechthumbnailetc && adja(e, "afterend", `<span class="quoteSpeechBalloon" data-quoteno="${origno}">&gt;${lead}</span>`)
                }
                if (srcImg) {
                  srcImg.removeAttribute("width")
                  srcImg.removeAttribute("height")
                  srcImg.dataset.quoteno = origno
                  srcImg.className = "quoteSpeechBalloonImg"
                  srcImg.removeAttribute("hspace")
                  srcImg.removeAttribute("align")
                  srcImg.dataset.zoomonhover = "disable"
                  srcTable && e.appendChild(srcImg)
                }
              }
            })
            // >fu○.jpgに本文の引用を追加 qsb::
            quos.filter(e => /^\>+fu\d+\.(jpg|jpeg|png|gif|bmp|webp)$/m.test(e?.textContent)).forEach((e, i) => { //緑文字の引用行文字列 fu*
              e.dataset.quoted = 1
              let ertd = e?.textContent?.replace(/\>+/, "")
              var srcTable = elegeta("table .rtd").find(v => elegeta('img', v).find(w => w?.src?.indexOf(ertd) !== -1))?.closest("table[rsc]")
              if (srcTable && srcTable != e?.closest("table[rsc]")) {
                var origno = e?.textContent
                var lead = eleget0('blockquote', srcTable)?.innerText?.replace(/^\s*>*fu\S+\s*/gm, "")?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                //if (!lead) lead = eleget0('blockquote', srcTable)?.innerText?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
                if (lead?.slice(33)?.length) lead = lead?.slice(0, 33)?.trim() + "…"
                lead = lead?.replace(/\n/gm, " ")
                var srcImg = elegeta('img', srcTable).find(w => w?.src?.indexOf(e?.textContent?.replace(/\>+/, "")) !== -1)?.cloneNode()
                if (lead) {
                  //                  adja(e, "afterend", `　<span class="quoteSpeechBalloon" data-quoteno="${origno}">　&gt;${lead}　</span>`)
                  fivechthumbnailetc && adja(e, "afterend", `　<span class="quoteSpeechBalloon" data-quoteno="${origno}">&gt;${lead}</span>`)
                }
                if (srcImg) {
                  srcImg.dataset.quoteno = origno
                  srcImg.className = "quoteSpeechBalloonImg"
                  srcImg.dataset.zoomonhover = "disable";
                  !ld("futafuta") && srcTable && e.appendChild(srcImg)
                }
              }
            })
          }

          elegeta('.cnw a:not([data-popped]),.cnm a:not([data-popped])').forEach(e => {
            e.dataset.popped = 1;
            after(e, `　<span class="mailtoPopped">${sani(decodeURI(e?.href))}</span>`)
          }) // メール欄の中身を外に出す

          youtubePLVsetButton()
        }
        autoPagerized(() => shikomi())

        // .relAllAreaon枠に連鎖レス数を書き入れていく
        if (1) {
          GF.resChained = []
          if (!GF.hasmemo) GF.hasmemo = new Set();
          clearTimeout(GF?.resChainTO);
          GF.resChainTO = setTimeout(() => reschain(), 4000)
          if (lh(".2chan.")) {
            //            GF.resChainTO = document.body.addEventListener('2chanReloaded', () => setTimeout(reschain, 2000), false)
            document.addEventListener('yhm2chanAllDone', () => {
              clearTimeout(GF?.resChainTO)
              //        GF.resChainTO = setTimeout(reschain, 2000)
              //GF.resChained = [...elegeta('.thre table:has(.yhmMyMemo) .relallAreaon:not([data-filled])').map(e => { GF.hasmemo.add(e); return e }), ...elegeta('.thre .relallAreaon:not([data-filled],.ftbpu .relallAreaon,#pickbox .relallAreaon)')]; // 最初はピックアップにあるものだけ最速でやる
              reschain(1)
            }, false)
          }

          function reschain(reset = null) {
            let stime = Date.now()
            let org
            if (!GF?.resChained?.length || reset) {
              GF.resChained = [...elegeta('.thre table:has(.yhmMyMemo) .relallAreaon:not([data-filled])').map(e => { GF.hasmemo.add(e); return e }), ...elegeta('.thre .relallAreaon:not([data-filled],.ftbpu .relallAreaon,#pickbox .relallAreaon)')]; // 最初はピックアップにあるものだけ最速でやる
              //GF.resTotal = elegeta('.thre .rtd').length
            }
            do {
              stime = Date.now();
              do {
                org = GF.resChained.shift()
              } while (org && org?.dataset?.filled)
              if (org) {
                let rsc = org.closest('[data-rsc]')?.dataset?.rsc
                let [lists, overflow] = getRelatedRsca(rsc)
                lists?.forEach(v => {
                  elegeta('table[data-rsc="' + v + '"] .relallAreaon').forEach(w => {
                    w.innerText = `${lists?.length}${overflow?"+":""}`;
                    w.dataset.filled = "1"
                    if (debug) $(w).effect("highlight"); //org.areaonEle.scrollIntoView()
                  })
                })
              }
            } while (org && GF.hasmemo.has(org))
            clearTimeout(GF?.resChainTO)
            //GF.resChainTO = setTimeout(reschain, (org || dash) ? ((GF?.resTotal || 9) * 1 + 100) : 60000)
            //let next = (org) ? Math.min(999, 50 + (Date.now() - stime) * 3) : 60000;
            let next = org ? 50 + (Date.now() - stime) * 3 : 60000;
            //GF.odt=GF.odt??document.title; document.title=`${GF.odt} org:${org} reset:${reset} lap:${Date.now()-stime} next:${next}`
            GF.resChainTO = setTimeout(reschain, next)
          }
        }

        SITE?.hideDhash()
        autoPagerized(() => {
          GF.stoppick = 1;
          SITE?.hideDhash()
          memofast = 1;
          run(document.body, "observed");
          GF.stoppick = 0;
          memofast = false;
          plzGKSI()
          document.dispatchEvent(new CustomEvent('yhm2chanAllDone'));
        }, "not1st")
        //        autoPagerized(() => shikomi())
        //GF.fromSecond = 1; // 初回は新着ではないのでやらない

        function plzGKSI() {
          clearTimeout(GF?.gksiAfterMemo);
          GF.gksiAfterMemo = setTimeout(() => document.dispatchEvent(new CustomEvent('plzGKSI')), 444)
        }

        GF.FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT = +pref("FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT") || 0;
        //        setTimeout(() => { for (let i = 0; i < GF.FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT; i++) { keyFuncDispatch("n", "automation") } }, 444);
        SITE.keyFunc.find(v => v.key == "n")?.func("n", null, ["automation", GF.FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT]) //n::
        //        setTimeout(() => { GF.FUTABA_RELOAD_AND_NOTIFY_NEWRES_DEFAULT; i++) { keyFuncDispatch("n", "automation") } }, 444);

        //        autoPagerized((node) => {run()},"not1sttime")

        // onclick,html埋め込み,レス番,不安
        autoPagerized((node) => {
          //          elegeta('blockquote font,.quoteSpeechBalloon,.quoteSpeechBalloonImg', node).filter(v => !v.onclick && (v?.dataset?.quoteno || /^>+/gm.test(v.textContent))).forEach(e => {//test: 1017ms - タイマー終了
          elegeta('blockquote font:not([onclick]),.quoteSpeechBalloon:not([onclick]),.quoteSpeechBalloonImg:not([onclick])', node).filter(v => /^>./gm.test(v.textContent?.trim())).forEach(e => { //test: 832ms - タイマー終了
            let etext = e?.dataset?.quoteno?.match(/^>(.+)$/)?.[1].trim() || e.textContent.replace(/^>/gm, "").trim()
            let r = [...document.querySelectorAll(".thre table")].find(v => v.textContent.indexOf(etext) !== -1) || null
            e.setAttribute("onclick", `scrRsc(${eleget0('.rsc', r)?.textContent})`) //クリックで中心にスクロール
          })
        })

        // レス番rscに引用・非引用が連鎖するレスのレス番rscを全て配列で返す rsc => [rsc,rsc,rsc,...]
        function getRelatedRsca(rsc) {
          let stime = Date.now()
          elegeta("cacheon");
          eleget0("cacheon")
          let tableRsc = elegeta('table[data-rsc]').sort((a, b) => a.dataset.rsc === b.dataset.rsc ? 0 : Number(a.dataset.rsc) > Number(b.dataset.rsc) ? 1 : -1) // レステーブル[登場順]
          let tableRscOrder = [] // レステーブル[rsc]
          tableRsc.forEach(v => tableRscOrder[v.dataset.rsc] = v) // 速度のためにキャッシュする
          let ress = getRelCno([rsc], tableRsc, tableRscOrder)
          let abort = 0;
          for (let i = 200; i--;) { //while (1) {
            let r = getRelCno(ress, tableRsc, tableRscOrder)
            //            if (r.length >= 100 || r.length <= ress.length) { ress = r; break }
            if (r.length >= 100 || r.length <= ress.length) { ress = r; break; }
            if ((document.visibilityState == "visible" && Date.now() - stime > 2000)) {
              ress = r;
              abort = 1;
            }
            ress = r
          }
          elegeta("cacheoff");
          eleget0("cacheoff")
          if (ress?.length < 2) return [null, null];
          return [ress, abort];
        }

        function getRelCno(resa, tableRsc, tableRscOrder) {
          let a = resa || []
          resa.forEach(res => {
            if (!FUTABA_FORWARD_LINK) {
              a = a.concat(elegeta(`.quo .revQuote`, tableRscOrder[res]).map(v => v.innerText.replace(/^>>/, ""))) // test: 6137ms - タイマー終了
            } else {
              a = a.concat(elegeta(`.quo .revQuote`, tableRscOrder[res]).map(v => v.innerText.replace(/^>>|<<$/, ""))) // test: 6137ms - タイマー終了
            }
            let rscText = elegeta(`blockquote font[color="#789922"]`, tableRscOrder[res]).map(e => e?.innerText?.replace(/^>/, "")?.trim()).filter(v => v)
            rscText.forEach(v => a.push(tableRsc.find(w => w.innerText.indexOf(v) !== -1)?.dataset.rsc)) // 最初の１つめの>abcだけにヒット
          })
          return [...new Set(a?.flat())].filter(v => v !== undefined && v !== null).sort()
        }

        // 引用ホバー hover::
        GM_addStyle(".rtdAttract{background-color:#fed;}")
        if (location.href.match0(/ftbucket/) && !eleget0(`.csb`)) GM_addStyle(".rsc,.cnw,.cno{padding:0 0.5em 0 0;}")
        var latestHover;
        var latestlevel = 0
        var latestPU

        if (FUTABA_HOVER_POPUP_DELAY == -1) { document.addEventListener("mousemove", function(e) { hover() }, false); } else { hover_enter() }

        function hover_enter() {
          hover() //if (document?.visibilityState == "visible") hover();
          requestAnimationFrame(hover_enter) // setTimeout(hover_enter, 1 * 17);
        }

        function hover() {

          if (!replaceMainPopup) return;
          let ele = document.elementFromPoint(mousex, mousey);
          hovertimer++;
          if (ele !== latestHover) latestPU = 0
          if (ele && (FUTABA_HOVER_POPUP_DELAY || (ele && latestHover != ele))) {
            var quoteDesEle = ele.matches('table FONT,table .quoteSpeechBalloon,table .quoteSpeechBalloonImg,.relallArea') ? ele : null; //ホバーしている黄土色文字の要素群
            var hoverEle = quoteDesEle; //ele.tagName === "FONT" && ele.closest("table") ? [ele] : []; //ホバーしている黄土色文字の要素群

            let level = Number(ele.closest(".ftbpu")?.dataset.level || 0);
            var lists = []
            //if (debug) V&&dc("quoteDesEle：" + quoteDesEle?.tagName)
            if ((quoteDesEle && latestPU !== ele) && ((FUTABA_HOVER_POPUP_DELAY == 0 && latestHover != quoteDesEle) || (FUTABA_HOVER_POPUP_DELAY && hovertimer >= (Math.max(hoverEle?.closest('#pickbox,.ftbpu') && FUTABA_HOVER_POPUP_DELAY != -1 ? 6 : 0, FUTABA_HOVER_POPUP_DELAY))))) { // ピックアップの中では遅延を少なくとも6にする
              var eWord = quoteDesEle?.dataset?.quoteno?.match0(/^\>+(.+)$/)?.trim() || quoteDesEle?.textContent?.match0(/^\>+(.+)$/)?.trim(); // 引用文 // >の入れ子数を無視してすべて遡る
              //var eWord = quoteDesEle?.dataset?.quoteno?.match0(/^\>(.+)$/)?.trim() || quoteDesEle?.textContent?.match0(/^\>(.+)$/)?.trim(); // 引用文 // >の入れ子数を忠実に遡る
              var resa = elegeta('.rtd').filter(e => !e.closest("#pickbox,.ftbpu,#respopup_area"))
              var hit0no = (replaceMainPopup && resa.find(a => a.textContent && a.textContent.indexOf(eWord) != -1))?.dataset?.rsc; //ヒットした最初のレス番号
              if (hit0no < 0) return;
              var motoNumber = hoverEle.closest('table').getAttribute("rsc"); // ホバーしているレスのレス番号

              var hitResNo = hoverEle.dataset.rsc; // rscがある＝レスの右側に追加した>>100型逆引用である、そのレス番号
              var relAll = ele.matches(".relallArea:not(.ftbpu .relallArea)") && ele?.closest("table")?.dataset?.rsc // …：全関連レス

              if (relAll) { // relall::…：全関連レスモード
                $(".ftbpu").remove();
                [lists, ] = getRelatedRsca(relAll)
              } else

              if (hitResNo) { // >>100：逆引用モード
                var lists = []
                resa?.forEach(c => { if (c.dataset.rsc == hitResNo) lists.push(c.closest("table").dataset.rsc) })
                resEnum[hitResNo]?.forEach(e => resa.forEach(c => { if (c.dataset.rsc == e) lists.push(c.closest("table").dataset.rsc) })); // rscがある＝レスの右側に追加した逆引用である、そのレス番号
              } else {
                // レス本文内の引用
                if (motoNumber) {
                  var quoteStr = eWord; //quoteDesEle?.textContent?.match0(/^\>+(.+)$/)?.trim(); // 文字列
                  if (quoteStr) {
                    var hitEles = resa.filter(e => e.textContent.indexOf(quoteStr) !== -1)
                    if (hitEles.length) {
                      var hoverResNo = (replaceMainPopup && hoverEle.getAttribute("rsc")) //ホバーしているレス番号
                      //hits[0].classList.add("rtdAttract")
                      var lists = hitEles.map(e => e.closest("table").dataset.rsc)
                    }
                  }
                }
              }

              // 表示
              if (hitResNo || lists) {
                latestPU = ele
                lists = lists.sort((a, b) => a - b)
                var hit0no = lists[0]; //tables[0][0].getAttribute("rsc") //ヒットした最初のレス番号
                var restable = elegeta('.rtd:not(#pickbox .rtd,.ftbpu .rtd,#respopup_area .rtd)').map(e => e.closest("table"))
                var tables = lists.map(c => ($(restable.find(e => e.dataset.rsc == c)).clone(true, true))?.[0])
                var lists2 = (hit0no == motoNumber) ? lists.slice(1) : lists
                debug && dc(`list : ${lists}\nlist2 : ${lists2}`, 0)
                debug && dc("既存：" + elegeta('.ftbpu').find(e => lists == e.dataset.list || lists2 == e.dataset.list2 || lists == e.dataset.list2)?.dataset.list)
                if (
                  !(elegeta('.ftbpu').find(e => lists == e.dataset.list || lists2 == e.dataset.list2 || lists == e.dataset.list2))
                ) { // まだ重複するポップアップがなければ
                  debug && dc(`list-sorted : ${lists}`, 0)
                  let pupad = (Math.min(window.screen.availWidth, window.screen.availHeight) || 1080) / FUTABA_POPUP_PADDING_RATE;
                  var pu = $(`<span data-anchor="${hit0no}" class="ftbpu ${relAll?"relAll ":""}ignoreFilter entry-content" data-list="${lists}" data-list2="${lists2}" data-level="${1+Number(level)}" style="z-index:2000000020; padding:${pupad}px; box-shadow:2px 2px 15px #000a; border-radius:2px; background-color:${FUTABA_BGC}; margin:0 0em 0px 0px; outline:1px solid #999; position:absolute; top:${quoteDesEle.getBoundingClientRect().top + window.scrollY + quoteDesEle.getBoundingClientRect().height-1}px; left:0;" ondblclick="this.remove();"><table style="table-layout:auto;"></table></span>`); //ヒットした全部をポップアップする版

                  if (!relAll && hit0no == motoNumber) { tables.shift() } // １個目の引用が自分自身なら削除
                  if (tables.length) {
                    let frag = new DocumentFragment();
                    tables.forEach(e => { frag.append(e) });
                    [...frag.querySelectorAll('span[data-mbt]')].forEach(e => {
                      $(e).css({ "display": "inline-block", "width": "fit-content" })
                      $(e).after("<br>")
                    })
                    $(pu).append(frag)

                    $(".thre:first()").append(pu)
                    //if (!relAll) $(pu).find(".quoteSpeechBalloon").remove()
                    $(elegeta('.ftbpu table').filter(e => !gmDataList_includesPartial(e, "gmHideByyhm"))).fadeIn(300)

                    domsort(pu[0], elegeta('table', pu[0]), v => -v.getAttribute("rsc"))
                    sdset()

                    $(".ftbpu .relallArea").remove()

                    let xr = ((mousex - 18) >= (clientWidth() - $(pu).outerWidth() - 1))
                    //$(pu).css({ "left": minmax(mousex - 18, 0, clientWidth() - $(pu).outerWidth() - 1) + "px" })

                    //if(quoteDesEle?.matches(".relallArea , .revQuote")){ // [2] か >>2 形式の小さい引用スイッチである

                    var centerTop = 1 ? window.scrollY + quoteDesEle.getBoundingClientRect().top :
                      minmax(window.scrollY + clientHeight() / 2 - pu[0]?.getBoundingClientRect()?.height / 2, window.scrollY + quoteDesEle.getBoundingClientRect().top + quoteDesEle.getBoundingClientRect().height - pu[0]?.getBoundingClientRect()?.height - pupad, window.scrollY + quoteDesEle.getBoundingClientRect().top - pupad * 2);
                    centerTop = minmax(centerTop, window.scrollY + pupad + 6, window.scrollY + clientHeight() - pu[0].getBoundingClientRect().height - 14);
                    //                    $(pu).css({ "top": `${minmax(centerTop , window.scrollY +6 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -4 }px` })
                    //                      $(pu).css({ "top": `${minmax(window.scrollY+ quoteDesEle.getBoundingClientRect().top -8 , window.scrollY +8 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -6 }px` })

                    if ((quoteDesEle?.matches(".relallArea , .revQuote")) && pu[0]?.getBoundingClientRect()?.width <
                      clientWidth() - quoteDesEle?.getBoundingClientRect()?.left - quoteDesEle?.getBoundingClientRect()?.width
                    ) { // 右に収まる
                      $(pu).css({ "left": quoteDesEle.getBoundingClientRect().left + quoteDesEle.getBoundingClientRect().width + "px" })
                      //                      $(pu).css({ "top": `${minmax(window.scrollY+ quoteDesEle.getBoundingClientRect().top -8 , window.scrollY +8 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -6 }px` })
                      //                      $(pu).css({ "top": `${minmax(centerTop , window.scrollY +8 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -6 }px` })
                      $(pu).css({ "top": `${minmax(centerTop , window.scrollY +pupad +2 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height -6 ) }px` })

                    } else if ((quoteDesEle?.matches(".relallArea , .revQuote")) && quoteDesEle?.getBoundingClientRect()?.left > pu[0]?.getBoundingClientRect().width) { // 左に収まる
                      $(pu).css({ "left": quoteDesEle.getBoundingClientRect().left - pu[0]?.getBoundingClientRect()?.width + "px" })
                      //                      $(pu).css({ "top": `${minmax(window.scrollY+ quoteDesEle.getBoundingClientRect().top -8 , window.scrollY +8 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -6 }px` })
                      //                      $(pu).css({ "top": `${minmax(centerTop , window.scrollY +8 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height) -6 }px` })
                      $(pu).css({ "top": `${minmax(centerTop , window.scrollY +pupad +2 , window.scrollY + clientHeight()- pu[0].getBoundingClientRect().height -6) }px` })
                    } else {

                      // 緑色の引用文である
                      $(pu).css({ "left": minmax(mousex - 18, 0, clientWidth() - $(pu).outerWidth() - 1) + "px" })
                      let xr = ((mousex - 18) >= (clientWidth() - $(pu).outerWidth() - 1))
                      //$(pu).css({ "left": minmax(mousex - 18, 0, clientWidth() - $(pu).width() - 11) + "px" })
                      $(pu).css({ "left": minmax(mousex - 18, 0, clientWidth() - $(pu).outerWidth() - 1) + "px" })

                      // 少し縮小するか？
                      let eleBottomY = $(quoteDesEle).offset().top - $(window).scrollTop() + $(quoteDesEle).outerHeight() + 1;
                      let eleTopY = quoteDesEle.getBoundingClientRect().top // +window.scrollY;//gbcr $(quoteDesEle).offset().top - $(window).scrollTop() // + $(quoteDesEle).outerHeight() + 1;
                      let puHeight = pu[0].getBoundingClientRect().height // offsetHeight //$(pu).outerHeight()  // + 15;
                      let bottomMargin = Math.min(window.innerHeight, document.documentElement.clientHeight) - eleBottomY
                      let upMargin = (quoteDesEle.getBoundingClientRect().top)
                      let originx = window.innerWidth - mousex
                      // 画面の下のほうより上のほうが大きくあいていれば上に表示
                      if (puHeight > bottomMargin && upMargin > puHeight) {
                        $(pu).css({ "top": `${window.scrollY + eleTopY - puHeight}px` })
                      } else {
                        // 少し縮小する
                        if (bottomMargin / puHeight < 1) $(pu).css({ "transform-origin": xr ? `${$(pu).outerWidth()-(window.innerWidth-mousex)+30}px -1px` : `0px -1px` }).delay(100).animate2({ "transform": `scale(${Math.max(futabapopupscale/100,bottomMargin/(puHeight))})`, "opacity": "1" }, 100) // 右が足りなければ縮小しない　transform-originがtopleft＝JQのdraggableが不具合起こさない
                      }
                    }

                    //            let r = getRelCno(ress, tableRsc, tableRscOrder)

                    // 引用関係が直接じゃないものに灰色
                    /*
          let tableRsc = elegeta('table[data-rsc]')//.sort((a, b) => a.dataset.rsc === b.dataset.rsc ? 0 : Number(a.dataset.rsc) > Number(b.dataset.rsc) ? 1 : -1) // レステーブル[登場順]
          let ress = getRelCno([motoNumber], tableRsc,tableRsc)// tableRscOrder)

          elegeta('.relpost2').forEach(e => e.classList.remove("relpost2"))
                    ress.forEach(v=> v!=motoNumber && elegeta(`table[data-rsc="${v}"] .rts`,pu[0]).forEach(e => e.classList.add("relpost2")))
                    pu[0].addEventListener("click",e=>{ elegeta('.relpost2').forEach(e => e.classList.remove("relpost2")) })
                    addstyle.add(`.relpost2{ background-color:#88888830 !important;}`)
*/
                    elegeta('.relpost').forEach(e => e.classList.remove("relpost"))
                    elegeta(`table[data-rsc="${motoNumber}"] .rts`).forEach(e => e.classList.add("relpost"))
                    clearTimeout(GF?.relpostID);
                    GF.relpostID = setTimeout(() => elegeta('.relpost').forEach(e => e.classList.remove("relpost")), 2000)
                    //pu[0].addEventListener("click",e=>{ elegeta('.relpost').forEach(e => e.classList.remove("relpost")) })
                    addstyle.add(`.relpost{ background-color:#cfb !important;}`)
                    //addstyle.add(".relpost{animation: pulse1 1s infinite; } @keyframes pulse1 { 0% { background-color:#ffff0060; } 50% { background-color:#ffff0000; } 100% { background-color:#ffff0060; } }")

                    // z使用モード
                    GF?.zFunc && GF?.zFunc()
                    dragElement(pu[0], "*", ".rtd,.yhmMyMemo,.revQuote")
                  }
                }
              }
            } else {
              //              if (!hoverEle && eleget0('.ftbpu') && !(ele.closest(".ftbpu") || ele.closest("#slp") || ele.closest(".fvw_respop") || eleget0("#pdm"))) {
              if (!hoverEle && eleget0('.ftbpu') && !(ele.closest(".ftbpu") || ele.closest("#slp") || ele.closest(".fvw_respop") || eleget0("#pdm") || ele.closest("#hzPv,.hzP"))) {
                $(".ftbpu").remove();
                $(".rtdAttract").removeClass("rtdAttract")
                elegeta('.relpost , .relpost2').forEach(e => {
                  e.classList.remove("relpost");
                  e.classList.remove("relpost2")
                })
                //elegeta('.relpost').forEach(e => e.classList.remove("relpost"))
              }
              if (latestHover != ele && ele.closest(".ftbpu,#slp,.fvw_respop")) { // levelが低い要素に降りたら上のは消す
                elegeta(".ftbpu").forEach(e => { if (e?.dataset?.level > level) { e.remove() } })
              }
            }
          }
          latestlevel = ele?.closest(".ftbpu")?.dataset?.level || 0
          latestHover = ele; //V&&dc("latest："+latestHover?.tagName)
        }

        // pick::メモの付いたレスを右上に列挙
        var pick_overflow;
        GF.pickOFMaxH = 250;
        addstyle.add(`:root {--pickbox-img-maxheight:${GF.pickOFMaxH}px } #pickbox img { height:auto; max-width:250px; width:auto; max-height:var(--pickbox-img-maxheight); } #pickbox video { width:auto; max-height:var(--pickbox-video-maxheight); }`)

        function pick(force = 0) {
          clearTimeout(GF?.pickID);
          if (GF.stoppick) return;

          if (eleget0('.thre table:has( :is(a[href*="youtube.com"],a[href*="youtu.be"],a[href*="nicovideo"],a[href*="//nico.ms/sm"]):not(#pickbox a,[yte],[nde],font[color="#789922"] a)):has( .yhmMyMemo)')) { // まだyt埋め込みしてないytリンクがあるならpickしない
            clearTimeout(GF?.pickID);
            GF.pickID = setTimeout(pick, 999, force);
            return;
          }
          if (window.getSelection() == "" && $("#pickbox:hover").length == 0 && $('#pickbox:hidden').length == 0) {
            var res = [...new Set($.makeArray($('.thre table:has(span.yhmMyMemo):not([data-hidden="1"])')))].filter(e => !e.closest("#pickbox,.ftbpu")); // 埋め込み動画はロードが発生するので無視
            if (res.some(v => { let e = eleget0('.relallAreaon', v); return e && !e?.dataset?.filled })) {
              clearTimeout(GF.pickID);
              GF.pickID = setTimeout(pick, 999, force);
              return;
            } // まだ関連レス数が書き込まれていない.relallAreaonがあるなら待つ
            GF.presentPick = res
            let update = (GF.res !== JSON.stringify(res.map(e => e.innerText).sort()))
            if (update || force) {
              GF.res = JSON.stringify(res.map(e => e.innerText).sort())
              if (debug) popup2("更新：" + GF.res.slice(0, 200))
              if (pick_overflow) {
                addstyle.add(`.thre .rtd:not(:is(.ftbpu , .pickbox , [data-reszero]) .rtd){max-width:46vw !important;}`)
                setMaxHeight()
                $("#pickbox blockquote").css({ "margin": "5px 40px" });
              } else {
                addstyle.remove(`.thre .rtd:not(:is(.ftbpu , .pickbox , [data-reszero]) .rtd){max-width:46vw !important;}`)
              }
              $("#pickbox").remove();
              $('#fchVerticalThreadTitle').remove()
              let threR = $('#rightadfloat:visible')[0] ? document.documentElement.clientWidth - ($(".thre").offset().left + $('.thre').outerWidth()) : 3
              if (res.length) {
                if (1 || document.documentElement.clientWidth - threR > 1300) {
                  let pickbox = after(eleget0('.thre:not(#pickbox .thre , .ftbpu .thre)'), `<div id='pickbox' class='ignoreFilter${pick_overflow?" pof":""}' floated="" style='z-index:1; max-height:calc(${(100)*(100/futabapicksize)}vh - ${8*(100/futabapicksize)}em) ;  scrollbar-gutter: stable;  scrollbar-width: thin; overflow-y:auto; max-width:${55}%; outline:2px #8888 solid; position:fixed; top:6px; right:${threR+2}px;  transform:scale(${futabapicksize/100}); transform-origin:top right;'></div>`);

                  let frag = new DocumentFragment();

                  res.forEach(e => { frag.append($(e).clone(true, true).css({ "display": "revert", "margin-left": "auto", "margin-right": "0" })[0]) })

                  addstyle.add("#pickbox :is(blockquote , .pEmbedYT , .embedyt) { transition:all 0.1s; }")
                  addstyle.add("#pickbox.pof .pEmbedYT { margin-bottom:2px !important; }")
                  addstyle.add("#pickbox.pof .embedyt { margin-top:1px !important; margin-bottom:1px !important; line-height:2em !important;}")

                  pick_overflow && elegeta(".rtd>blockquote:nth-of-type(1)", frag).filter(e => /fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|avif|mp4|webm|mov|mkv|mp3|aac|flac|m4a)\n?/gmi.test(e.textContent)).forEach(e => { e.innerHTML = e.innerHTML.replace(/^fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|avif|mp4|webm|mov|mkv|mp3|aac|flac|m4a)(\<br\>)*|(?<=\<br\>)fu?\d+\.(jpg|jpeg|png|gif|bmp|webp|avif|mp4|webm|mov|mkv|mp3|aac|flac|m4a)(\<br\>)*/gi, "") })

                  pickbox.append(frag)

                  elegeta('.quoteSpeechBalloon', pickbox).forEach(e => { if (e?.textContent?.length > 16) { e.textContent = e.textContent.slice(0, 16) + "…" } })
                  $("#pickbox .sod:contains('x')").css({ "float": "right" })
                  if (pick_overflow) {
                    setMaxHeight()
                    $("#pickbox blockquote").css({ "margin": "5px 40px" })
                  }
                  elegeta("#pickbox .relallAreaon").forEach(e => e.previousElementSibling.insertAdjacentElement('beforebegin', e))
                  $("#pickbox .relallAreaon").css({ "float": "right", "margin": "4px 4px 0 0" }) //,"z-index":"-1"})
                  elegeta("#pickbox .rts").forEach(e => { let no = e?.closest("table")?.dataset?.rsc; if (no) e.setAttribute("onclick", `scrRsc(${no})`); })

                  $("#pickbox .revQuote").after("<br>"); //css({ "display": "inline-block" })
                  $("#pickbox .yhmMyMemo,.revQuote").css({ "user-select": "none" })
                  if (update) { $("#pickbox").css({ "outline": "#f00 5px solid" }).delay(100).queue(() => { $("#pickbox").css({ "outline": "2px #8888 solid" }) }) }
                  addstyle.add('div#pickbox p.pEmbedYT { cursor:auto !important; position:unset !important;left:0 !important;top:0 !important;}')
                  domsort(pickbox, elegeta('table', pickbox).filter(e => e.closest("#pickbox")), v => -v.getAttribute("rsc"))
                  sdset()
                  GF?.zFunc && GF?.zFunc()
                  dragElement(pickbox, "*", ".rts,.rtd,.yhmMyMemo,.relallArea,.revQuote")
                  ytResize2(2);
                  checkOF(1)
                  addstyle.add('#ftbl,#ftb2,.ftbl,.ftb2{margin:0px 0px 0px 1em !important; left:1em !important; }')
                }
              } else {

                end(document.body, `<div id="fchVerticalThreadTitle" style="writing-mode: vertical-rl; top:2em; bottom:3em; right:${threR+16}px; position:fixed;z-index:-111; font-size:2.5em; opacity:0.5; color:#800;">${GF.originalDocTitle?.substr(0,63)}</div>`);
              }
              pick2title(20)
            }
          }
          clearTimeout(GF?.pickID);
          GF.pickID = setTimeout(pick, 2000);
        }

        if (is2chan || isftb || isftchan || iskurokako || istsumanne) {
          clearTimeout(GF?.pickID);
          GF.pickID = setTimeout(pick, GF?.isFile ? 0 : 2000);

          checkOF();

          function setMaxHeight() {
            //          document.documentElement.style.setProperty("--pickbox-img-maxheight", `${Math.max(FUTABA_PICK_IMG_MIN_SIZE, GF.pickOFMaxH)}px`);
            //        document.documentElement.style.setProperty("--pickbox-video-maxheight", `${Math.max(150, GF.pickOFMaxH)}px`);
            $("#pickbox img").css({ "width": "auto", "max-height": Math.max(FUTABA_PICK_IMG_MIN_SIZE, GF.pickOFMaxH) + "px" });
            $("#pickbox video").css({ "width": "auto", "max-height": Math.max(150, GF.pickOFMaxH) + "px" });
          }

          function checkOF(force = 0) {
            do {
              const AFRATE = 5;
              if (Date.now() - GF?.resized < 100) break; // リサイズ直後はしない（resizeイベントが複数回起こってガクガクするため）
              if (futabapicksize == futabapicksizeL && GF.pickOFMaxH <= FUTABA_PICK_IMG_MIN_SIZE && !force) break;
              var p = eleget0('#pickbox:not(:hover)')
              if (p) {
                var lr = elegeta('.rtd')?.filter(e => isinscreen(e, 1) && !e?.closest("#pickbox,.ftbpu,#respopup_area,[floated]"))?.map(e => { let r = e.getBoundingClientRect().right; return e?.closest('table')?.querySelector('.revQuote,.relallArea')?.getBoundingClientRect()?.right + 4 || r + 2 }).reduce((a, b) => a > b ? a : b, 0) || 0 //test 175 / 1sec
                var big = p.getBoundingClientRect().left - lr
                var bigabs = Math.abs(big)
                const prevMaxH = GF.pickOFMaxH
                const prev = futabapicksize
                if (p.scrollHeight > p.offsetHeight) { // 下にはみ出てる
                  $("#pickbox blockquote").css({ "margin": "5px 40px" })
                  GF.pickOFMaxH = Math.max(FUTABA_PICK_IMG_MIN_SIZE, GF.pickOFMaxH - Math.min((35 / AFRATE), ~~(p.scrollHeight - p.offsetHeight) / (8 * AFRATE)));
                  setMaxHeight()
                  futabapicksize = Math.max(futabapicksizeL, futabapicksize - (p.scrollHeight - p.offsetHeight) / (80 * AFRATE));
                  if (!pick_overflow) { // 初めて
                    pick_overflow = 1
                    pick(1);
                  } else { // ２回目以降
                    pick_overflow = 1;
                    p.style.transform = `scale(${futabapicksize/100})`
                    p.style.maxHeight = `calc(${(100)*(100/futabapicksize)}vh - ${8*(100/futabapicksize)}em)`;
                    debug && dc("picksize:" + futabapicksize, 1)
                    if (prev != futabapicksize || prevMaxH != GF.pickOFMaxH) requestAnimationFrame(checkOF)
                  }
                } else if (big < 0) { // 左にはみ出てる
                  futabapicksize = Math.max(futabapicksizeL, futabapicksize - bigabs / (24 * AFRATE));
                  p.style.transform = `scale(${futabapicksize/100})`
                  debug && dc("picksize:" + futabapicksize, 1)
                  if (prev != futabapicksize || prevMaxH != GF.pickOFMaxH) requestAnimationFrame(checkOF)
                }
              }
            } while (0);
            !force && setTimeout(checkOF, 200)
          }
          //setInterval(checkOF, 200) //setInterval(checkOF, 52)
          //}, 60)

          window.addEventListener('resize', () => {
            GF.resized = Date.now()
            futabapicksize = 100;
            if (!eleget0('#pickbox iframe')) {
              GF.pickOFMaxH = 250;
              setMaxHeight()
              pick_overflow = 0;
              $("#pickbox").remove();
              pick(1);
              //checkOF();
              return;
            }
            var p = eleget0('#pickbox:not(:hover)')
            if (p) {
              p.style.transform = `scale(${futabapicksize/100})`
              p.style.maxHeight = `calc(${(100)*(100/futabapicksize)}vh - ${8*(100/futabapicksize)}em)`;
              GF.pickOFMaxH = 250;
              setMaxHeight()
              //checkOF();
            }
            //            pick(1)
          })

          //window.addEventListener('focus', () => { futabapicksize = 100; pick(1) }) // ややうるさい

          setTimeout(() => {
            //            let slider = eleget0('#pickbox') ? [eleget0('/HTML/BODY/HR[2]'), "style=' position:fixed; right:8em; bottom:0.5em; font-size:11px; transform:scale(0.9); display:block;'", "style=' position:fixed; right:20em; bottom:0.5em; font-size:11px; transform:scale(0.9); display:block;'"] : [eleget0(`//span[@id="hml"]/..`), "style='float:left; font-size:13px; transform:scale(0.9);'", "style='float:left; font-size:13px; transform:scale(0.9);'"]
            let slider = eleget0('#pickbox') || 1 ? [eleget0('/HTML/BODY/HR[2]'), "style=' position:fixed; right:10em; bottom:0.5em; font-size:11px; width:11em; transform:scale(0.9); display:block;'", "style=' position:fixed; right:21em; bottom:0.5em; font-size:11px; width:11em; transform:scale(0.9); display:block;'"] : [eleget0(`//span[@id="hml"]/..`), "style='float:left; font-size:13px; transform:scale(0.9);'", "style='float:left; font-size:13px; transform:scale(0.9);'"]

            addstyle.add(`input#setSliderFUTABA_popupScale.setSlider,input#setSliderFUTABA_pickupSize.setSlider{opacity:0.33;  transition:all 0.2s;}
            :is(input#setSliderFUTABA_popupScale.setSlider,input#setSliderFUTABA_pickupSize.setSlider):hover{opacity:1;  transition:all 0.2s;}`)
            setSlider(slider[0], 30, 100, futabapicksizeDefault, "ピックアップの最小スケール:***%", "FUTABA_pickupSize", (val) => {
              futabapicksizeL = val;
              futabapicksize = Math.min(100, ++futabapicksize);
              //addstyle.remove(GF?.rtdmw)
              //GF.rtdmw=addstyle.add(`.thre > table .rtd { max-width:${minmax(40+(100-futabapicksizeL),30,90)}vw; }`)
              pick(1);
            }, 0, slider[1])
            //GF.rtdmw=addstyle.add(`.thre > table .rtd { max-width:${minmax(40+(100-futabapicksizeL),30,90)}vw; }`)

            setSlider(slider[0], 50, 100, 100, "ポップアップの最小スケール:***％", "FUTABA_popupScale", (val) => {
              futabapopupscale = val;

            }, 1, slider[2]);
          }, 2100)
        }

        function pick2title(len) {
          var suff = document.title.match0(/(\s-\s.*)/) || ""
          //          let intro = [...new Set(elegeta('.thre>blockquote,table[data-reszero] blockquote,#pickbox blockquote')?.slice(0, len)?.map(e => e?.innerText))]?.map(e => e?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.replace(/\n/gm, " "))
          let intro = [...new Set(elegeta('.thre>blockquote,table[data-reszero] blockquote,#pickbox blockquote')?.slice(0, len)?.map(e => e?.innerText))]?.map(e => e?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.replace(/^\>[^\n]*$/gm, "")?.replace(/\n/gm, " "));
          intro = intro?.join(" ")?.replace(/[　\s\u200B-\u200D\uFEFF\u2028\u2029\u200eㅤ]{1,99}/g, " ")
          //          if ((isftb || isftchan || is2chan) && intro && suff) { // 0とpickのレス100文字までページタイトルにする
          if ((isftb || isftchan || is2chan) && intro) { // 0とpickのレス100文字までページタイトルにする
            let threno = location?.href?.match0(/(\d{3,})/) || ""
            if (intro && !GF?.arrival) {
              //              document.title = `${(GF.originalDocTitle0+" "+threno+" - "+intro)?.slice(0, FILENAME_MAXLENGTH)}`
              let resno = elegeta('.rsc').map(v => +v?.textContent).reduce((a, b) => Math.max(a, b), 0) || 0;
              resno = resno ? `(${resno}) ` : "";
              let suffix = `${GF.originalDocTitle0?.match0(/\s-\s[\s\S]+$/)||""} ${threno}`;
              document.title = (`${intro.slice(0,FILENAME_MAXLENGTH-suffix?.length-1-resno?.length)} ${resno}${suffix}`)?.slice(0, FILENAME_MAXLENGTH)
            }
          }
        }
      },
    },
    {
      id: 'www.uniqlo.com',
      urlRE: '//www.uniqlo.com/',
      listTitleXP: '//a/div[2]/h3',
      listTitleSearchXP: '//a/div[2]/h3[+++]/../../..',
      listTitleMemoSearchXP: '//a/div[2]/h3[+++]|//h1[@data-test="product-name"][+++]',
      listGen: 6,
      redoWhenReturned: 1,
      delay: 500,
      observe: 500,
      detailURLRE: /\/www.uniqlo.com\/jp\/ja\/products\//,
      detailTitleXP: '//h1[@data-test="product-name"]',
      detailTitleSearchXP: '//h1[@data-test="product-name"][+++]/../../..',
      urlHasChangedCommonFunc: () => {
        setTimeout(() => {
          isDetail = (SITE.detailURLRE && location.href.match(SITE.detailURLRE)) ? 1 : 0;
          run(document.body)
        }, 2000);
      },
    }, {
      id: 'workman',
      urlRE: '//workman.jp/shop/',
      title: 'div._title > a , form > div.block-goods-name > h1.h1.block-goods-name--text , a.js-enhanced-ecommerce-goods-name',
      box: 'div._item , div.pane-goods-right-side , dl.block-thumbnail-t--goods.js-enhanced-ecommerce-item',
      redoWhenReturned: 1,
      forceTranslucentFunc: e => lh("/shop/g/"),
      observe: 500,
    }, {
      id: 'free.arinco.org',
      urlRE: 'http://free.arinco.org/mail/index1.html',
      listTitleXP: '//a',
      redoWhenRefocused: 1,
      useURL: 1,
      listTitleMemoSearchXPSameGen: 1,
      listGen: 4,
      listTitleSearchXP: '//a[++url++]/..',
      listTitleMemoSearchXP: '//a[++url++]',
    },
    {
      id: 'free.arinco.org',
      urlRE: '//free.arinco.org/',
      useURL: 1,
      redoWhenRefocused: 1,
      listTitleMemoSearchXPSameGen: 1,
      listGen: 4,
      listTitleXP: '//a|//h1/span[@itemprop="name"]',
      listTitleSearchXP: '//a[**url**]/..|//h1/span[@itemprop="name"][**url**]',
      listTitleMemoSearchXP: '//a[**url**]|//h1/span[@itemprop="name"][**url**]',
      detailURLRE: /\/mail\//,
      detailTitleXP: '//h1/span[@itemprop="name"]',
      detailTitleSearchXP: '//h1/span[@itemprop="name"][**url**]',
      funcOnlyFirst: function() {
        GM_addStyle('.itemlist li{height:auto; margin:0.5em;}');
        var e = location.href.replace(/^https?:\/\/free.arinco.org\/mail\/([^/]+\/)$/, "$1");
        var t = eleget0('//h1/span[@itemprop="name"]')
        if (document.body.innerText.match(/ホーム » Free Mail » /) && e && t) t.setAttribute("href", e)
      },
      automemoURLRE: /^https?:\/\/free.arinco.org\/mail\/[^/]+\/$/, // メールサービス名にホバーしないと作られない
      automemoSearchFunc: function() { return eletext(['//article[@role="main"]/section[@id="detail"]', '//div[@id="main"]/article/section[1]']); },
      automemoFunc: function() {
        //        [/(imap)/im, /(pop3)/mi, /(Tor)/m, /(e2ee)/m, /(openpgp)|(gnupgp)|(pgp)/mi].forEach(m => autoMemo(m));
        [/(imap)/im, /(pop3)/mi, /(Tor)/m, /(e2ee)/m, /(openpgp)|(gnupgp)|(gpg)|(pgp)/mi].forEach(m => autoMemo(m));
      },
      automemoForceFunc: function() { return 1; },
      /*      autoTranslucentURLRE: /^https?:\/\/free.arinco.org\/mail\/[^/]+\/$/, // urlだけでは詳細概要画面を特定できない
            detailURLRE: /^https?:\/\/free.arinco.org\/mail\/.+/,
            detailTitleXP: '//h1/span[@itemprop="name"]',
            detailTitleSearchXP: '//h1/span[@itemprop="name"][**url**]/../../../..',
            automemoURLRE: /^https?:\/\/free.arinco.org\/mail\/[^/]+\/$/,
            automemoSearchFunc: () => { return eletext(['//article[@role="main"]/section[@id="detail"]']); },
            automemoFunc: () => {
                [/(imap)/im,/(pop3)/mi,/(openpgp)|(gnupgp)|(pgp)/mi].forEach(m => autoMemo(m));
              },
      */
    },
    {
      id: 'twiman.net',
      urlRE: '//twiman.net/',
      listTitleXP: '//div[@class="v-list-item__content"]/div[2]',
      listTitleSearchXP: '//div[@class="v-list-item__content"]/div[2][***]/../../../..',
      listTitleMemoSearchXP: '//div[@class="v-list-item__content"]/div[2][***]/../..',
      listGen: 7,
      observe: 500,
      trim: 1,
    },
    {
      id: 'twicomi.com',
      urlRE: '//twicomi.com',
      trim: 1,
      title: 'div.screen-name,div.fixed-tweet>div:nth-child(3),span.screen-name,div.tweet-text',
      box: 'div.author-profile,.fixed-area,div.manga-item',
      forceTranslucentFunc: e => e.closest('div.author-profile,.fixed-area'),
      autoTranslucentURLRE: /\/\/twicomi\.com\/manga\//,
      XP2name: 'ユーザー名　',
      listTitleXP2: 'div.screen-name,span.screen-name',
      listGen: 8,
      observe: 500,
      redoWhenReturned: 1,
      func: () => { $('.list').css({ "min-height": "0px" }) }, // AP継ぎ足し時の空白を詰める
      funcOnlyFirst: () => {
        var observeUrlHasChangedhref = location.href;
        var observeUrlHasChanged = new MutationObserver(mutations => {
          if (observeUrlHasChangedhref !== location.href) {
            pauseAll = 1;
            prefCacheClear()
            observeUrlHasChangedhref = location.href;
            elegeta('//span[contains(@class,"yhmMyMemo")]/..').forEach(e => e.remove());
            setTimeout(() => {
              pauseAll = 0;
              $(".phov2").remove();
              $('span.phov').remove();
              //              elegeta('//div[@class="fixed-area"]/div[@class="fixed-tweet"]/div[@class="text"]/..').forEach(e => e.style.opacity = "1")
              elegeta('div.author-profile,.fixed-area', ).forEach(e => e.style.opacity = "1")
              disableHide = (SITE.autoTranslucentURLRE && location.href.match(SITE.autoTranslucentURLRE)) || (pref("translucent") == "on");
              run(document.body, "returned")
            }, 100);
          }
        });
        observeUrlHasChanged.observe(document, { childList: true, subtree: true });
      },
    },
    {
      id: 'chrome.google.com/webstore/search/',
      urlRE: '//chrome.google.com/webstore/search/|//chrome.google.com/webstore/detail/',
      listTitleXP: '//div[@class="a-na-d-w" and @role="heading"]',
      listTitleSearchXP: '//div[@class="a-na-d-w" and @role="heading"][+++]/../../../../../..',
      listTitleMemoSearchXP: '//div[@class="a-na-d-w" and @role="heading"][+++]|.//div[@class="e-f-n-Va"]/div[@class="e-f-w-Va"]/h1[@class="e-f-w"][+++]',
      listGen: 7,
      delay: 2500,
      observe: 500,
      redoWhenReturned: 1,
      detailURLRE: /https:\/\/chrome.google.com\/webstore\/detail\//,
      detailTitleXP: '//div[@class="e-f-n-Va"]/div[@class="e-f-w-Va"]/h1[@class="e-f-w"]',
      detailTitleSearchXP: '//div[@class="e-f-n-Va"]/div[@class="e-f-w-Va"]/h1[@class="e-f-w"][+++]/../../../..',
      listTitleMemoSearchXPSameGen: 1,
    },
    {
      id: 'sakura-checker.jp',
      urlRE: '//sakura-checker.jp/category/',
      listTitleXP: '//div[1]/figure/a',
      listTitleSearchXP: '//div[1]/figure/a[++url++]/../../..',
      listTitleMemoSearchXP: '//div[1]/figure/a[++url++]',
      listGen: 5,
      listHelpXP: '//div[1]/figure/a/../../..',
      useURL: 1,
    },
    {
      id: 'BOOTH.PM', // 作者名でQ/1/2　出品者名でQ
      urlRE: 'https:\/\/booth\.pm\/ja\/browse/|https:\/\/booth\.pm\/ja\/items|https:\/\/booth.pm\/ja$|https:\/\/booth\.pm\/ja\/events\/|https:\/\/booth\.pm\/ja\/search\/',
      listHelpXP: '//a[@class="item-card__title-anchor nav"]/../../../..|.//a[@class="item-card__title-anchor--multiline nav"]/../../../..',
      listTitleXP: '//a[@class="item-card__title-anchor nav"]|.//a[@class="item-card__title-anchor--multiline nav"]',
      listTitleXP2: '//div[@class="item-card__shop-name"]|//div[@class="u-text-ellipsis"]|//a[@class="nav u-tpg-title2"]',
      XP2memo: 1,
      XP2name: '出品者名　',
      listTitleSearchXP: '//a[@class="item-card__title-anchor nav"][+++]/../../../..|//div[@class="item-card__shop-name"][+++]/../../../../../..|.//a[@class="item-card__title-anchor--multiline nav"][+++]/../../../..',
      listTitleMemoSearchXP: '//a[@class="item-card__title-anchor nav"][+++]|//header/h2[@class="u-text-wrap u-tpg-title1 u-mt-0 u-mb-400"][+++]|.//a[@class="item-card__title-anchor--multiline nav"][+++]|.//div[@class="item-card__shop-name"][+++]|.//div[@class="u-text-ellipsis"][+++]|//a[@class="nav u-tpg-title2"][+++]',
      listGen: 7,
      detailURLRE: /https:\/\/booth\.pm\/ja\/items\//,
      detailTitleXP: '//header/h2[@class="u-text-wrap u-tpg-title1 u-mt-0 u-mb-400"]',
      detailTitleSearchXP: '//header/h2[@class="u-text-wrap u-tpg-title1 u-mt-0 u-mb-400"][+++]/../../../../../../../..|//div[@class="u-text-ellipsis"][+++]/../../../../../../../..',
      redoWhenReturned: 1,
      hideListEvenDetail: 1,
    },
    {
      id: 'TOODORAN',
      urlRE: '//todo-ran.com/t/soukan/',
      listTitleXP: '//td/a[1]',
      listTitleSearchXP: '//td/a[1][+++]/../..',
      listTitleMemoSearchXP: '//td/a[1][+++]',
      listGen: 3,
      listTitleMemoSearchXPSameGen: 1,
    },
    {
      id: '2CHTHREADLIST',
      urlRE: /\/\/ff5ch\.syoboi\.jp\/\?q=/,
      title: 'a.thread,a.col-brd',
      titleSubstr: true,
      box: 'li.bdr-b',
      listTitleXP2: 'a.col-brd',
      XP2name: `板名　`,
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "タイトル", f: () => { sortdom(elegeta('li.bdr-b'), v => eleget0('a.thread', v)?.textContent) } },
            { t: "板名", f: () => { sortdom(elegeta('li.bdr-b'), v => eleget0('a.col-brd', v)?.textContent + eleget0('.board_title span', v)?.textContent) } },
            { t: "レス数", f: () => { sortdom(elegeta('li.bdr-b'), v => eleget0('span.fnt-small.col-sec', v)?.textContent, 1) } },
            { t: "新しい", f: () => { sortdom(elegeta('li.bdr-b'), v => eleget0('//div[@class="fnt-small col-sec m-tb-4"]/span', v)?.textContent, 1) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
          return
        }
      }, {
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
      }],
    },
    {
      id: 'MSDMANUAL', // 検索結果と詳細ページでは項目名に表記ゆれがあるので合致しない
      urlRE: '//www.msdmanuals.com/',
      listTitleXP: '//div/a[@class="search__result--title"]',
      listTitleSearchXP: '//div/a[@class="search__result--title"][+++]/../../..',
      listTitleMemoSearchXP: '//div/a[@class="search__result--title"][+++]|//h1[@class="topic__header__headermodify--title topic__header__headermodify--title--animate"][+++]',
      listGen: 3,
      delay: 2000,
      observe: 500,
      detailURLRE: /^(?!.*(SearchResults)).*/,
      detailTitleXP: '//h1[@class="topic__header__headermodify--title topic__header__headermodify--title--animate"]',
      detailTitleSearchXP: '//h1[@class="topic__header__headermodify--title topic__header__headermodify--title--animate"][+++]/../../../../../..',
    },
    {
      id: 'CHIEBUKURO',
      urlRE: '//chiebukuro.yahoo.co.jp/',
      //  urlRE: /\/\/chiebukuro.yahoo.co.jp\/|\/\/detail.chiebukuro.yahoo.co.jp\//,
      listTitleXP: '//div/a/div/div/div/div/h2/../../../../..',
      listTitleSearchXP: '//article/div/a/div/div/div/div/h2/../../../../..[++url++]/../..',
      listTitleMemoSearchXP: '//article/div/a[++url++]/div/div/div/div/h2',
      listGen: 9,
      useURL: 1,
      redoWhenReturned: 1,
    },
    {
      urlRE: 'https://refind2ch.org/search',
      id: '2CHTHREADLIST',
      title: 'p.list-group-item-heading.thread_title,p.board_title span',
      box: '#search_results a.thread_url.list-group-item.entry.board_border',
      /*      listTitleXP: '//p[contains(@class,"thread_title")]',
            listTitleXP2: '//p/span[@class="board_clr_font_shitaraba"]|.//p/span[@class="board_clr_font_2chnet"]', // おーぷん板名は重複'|//p/span[@class="board_clr_font_open2chnet"]',
            XP2name: '板　',
            listTitleSearchXP: '//p[contains(@class,"thread_title")][***]/../..|.//p/span[@class="board_clr_font_shitaraba"][***]/../../..|.//p/span[@class="board_clr_font_2chnet"][***]/../../..', //'|//p/span[@class="board_clr_font_open2chnet"][+++]/../../..',
            listTitleMemoSearchXP: '//p[contains(@class,"thread_title")][***]',
            listGen: 4,
      */
      observe: 500,
      redoWhenReturned: 1,
      XP2name: '板名　',
      listHelpXP2: '.board_title span',
      trim: 1,
      //titleProcessFunc: (title) => { return title.replace(/\s\(したらば\)/gmi, "") },
      WhateverFirstAndEveryAPFunc: () => {
        $(".side_box").css({ "height": "100vh" });
        popup3("Shift+F：re.Find2ch検索", 8, 5000)
      },
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          //var sorttype = GF.yhmSortType || 0
          let menu = [
            { t: "タイトル", f: () => { sortdom(elegeta('#search_results a.thread_url.list-group-item.entry.board_border'), v => eleget0('p.list-group-item-heading.thread_title', v)?.textContent) } },
            { t: "板名", f: () => { sortdom(elegeta('#search_results a.thread_url.list-group-item.entry.board_border'), v => eleget0('p:last-child span small', v)?.textContent + eleget0('.board_title span', v)?.textContent) } },
            { t: "新しい", f: () => { sortdom(elegeta('#search_results a.thread_url.list-group-item.entry.board_border'), v => eleget0('.date_raw,.date', v)?.textContent, 1) } },
            { t: "勢い", f: () => { sortdom(elegeta('#search_results a.thread_url.list-group-item.entry.board_border'), v => eleget0('.rate_cnt', v)?.textContent, 1) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[sorttype].f()
          //GF.yhmSortType = (++sorttype) % menu.length
          //return
        }
      }, {
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
      }],
      func: (node = document) => { // 高密度化&https化
        elegeta('//div/div[@class="container-fluid"]').forEach(e => {
          e.style.width = "95%";
          e.style.maxWidth = "100%";
        })
        elegeta('//div[@id="content_main"]').forEach(e => {
          e.style.width = "calc(95vw - 400px)";
          e.style.maxWidth = "100%";
        })
        elegeta('//div[@class="progress rate pull-right"]').forEach((e) => { e.style.width = "5%" });
        for (let element of elegeta('//div[@class="clearfix"]|//a[contains(@class,"thread_url list-group-item entry clearfix board_border board_clr_border_2chnet") and @target="_blank" and @rel="nofollow noreferrer"]/p')) {
          element.parentNode.href = element.parentNode.href.replace(/http:\/\//, "https://");
          element.style = "display:inline;float:left; margin:0px 0.0em; padding:0px 0.5em 0px 0.5em;";
        }
        for (let element of elegeta('//a[@rel="nofollow noreferrer"]')) { element.style = "padding:0px;"; }
        elegeta('//div[@id="content_main"]/div[@id="search_results"]/a', node).forEach(e => { e.setAttribute("onclick", "") })
        elegeta('div>small.pull-right', node).forEach(e => {
          e.style = "float:none !important";
          e.parentNode.parentNode.appendChild(e);
        });
      },
    },
    {
      id: 'KAKAKUBB',
      urlRE: '//kakaku.com/bb/',
      listTitleXP: '//a[@class="planName"]',
      listTitleSearchXP: '//a[@class="planName"][+++]/../../../../..',
      listTitleMemoSearchXP: '//a[@class="planName"][+++]',
      listGen: 3,
    },
    {
      id: 'MINSOKU',
      urlRE: '//minsoku.net/',
      listTitleXP: '//div/div[@class="text-bold mt-xxs"]/a|.//div/div[@class="mt-10 text-bold"]/a|.//div[@class="mt-10 mb--xxxs text-bold"]/a',
      listTitleSearchXP: '//div/div[@class="text-bold mt-xxs"]/a[+++]/../../..|.//div/div[@class="mt-10 text-bold"]/a[+++]/../../..|.//div[@class="mt-10 mb--xxxs text-bold"]/a[+++]/../../..',
      listTitleMemoSearchXP: '//div/div[@class="text-bold mt-xxs"]/a[+++]|.//div/div[@class="mt-10 text-bold"]/a[+++]|.//div[@class="mt-10 mb--xxxs text-bold"]/a[+++]',
      listGen: 4,
    },
    {
      id: 'OMOCORO',
      urlRE: '//omocoro.jp/',
      listTitleXP: '//div[@class="details"]/div[@class="title"]/a',
      listTitleSearchXP: '//div[@class="details"]/div[@class="title"]/a[+++]/../../..',
      listTitleMemoSearchXP: '//div[@class="details"]/div[@class="title"]/a[+++]',
      listGen: 4,
    },
    {
      id: '360life.shinyusha.co.jp',
      urlRE: '//360life.shinyusha.co.jp/',
      listTitleXP: '//article/div[@class="m-article-item__info"]/h3[@class="m-article-item__title"]',
      listTitleSearchXP: '//article/div[@class="m-article-item__info"]/h3[@class="m-article-item__title"][***]/../../../..',
      listTitleMemoSearchXP: '//article/div[@class="m-article-item__info"]/h3[@class="m-article-item__title"][***]|//div[@class="article-header"]/h1[@class="article-header__title"][***]',
      listGen: 4,
      detailURLRE: /\/\/360life\.shinyusha\.co\.jp\/articles\//,
      detailTitleXP: '//div[@class="article-header"]/h1[@class="article-header__title"]',
      detailTitleSearchXP: '//div[@class="article-header"]/h1[@class="article-header__title"][***]/../../../../..',
      redoWhenReturned: 1,
      trim: 1,
    },
    {
      id: 'SHOPPING_YAHOO',
      urlRE: '//shopping.yahoo.co.jp/search',
      listTitleXP: '//div[2]/p/a[@target="_blank" and @data-rapid_p="1"]/span',
      listTitleSearchXP: '//div[2]/p/a[@target="_blank" and @data-rapid_p="1"]/span[+++]/../../../../..',
      listTitleMemoSearchXP: '//li[@class="LoopList__item"]/div/div[2]/p/a[@target="_blank" and @data-rapid_p="1"]/span[+++]',
      listGen: 6,
      func: () => { // 商品名を省略しなくする
        elegeta('//div[2]/p/a[@target="_blank" and @data-rapid_p="1"]/span/..').forEach(e => {
          e.style.display = "block";
          e.style.maxHeight = "none";
        });
      },
      observe: 1000,
    },
    {
      id: 'FREEM',
      urlRE: '//www.freem.ne.jp/',
      listTitleXP: '//a/h3[@class="pc"]',
      listTitleSearchXP: '//ul[contains(@class,"game-list game-list-wrap row")]/li/a/h3[@class="pc"][+++]/../..',
      listTitleMemoSearchXP: '//ul[contains(@class,"game-list game-list-wrap row")]/li/a/h3[@class="pc"][+++]',
      listGen: 3,
    },
    {
      id: 'ONSEN',
      urlRE: '//www.onsen.ag/',
      listTitleXP: '//h4[@class="title"]',
      listTitleSearchXP: '//h4[@class="title"][+++]/../..',
      listTitleMemoSearchXP: '//h4[@class="title"][+++]',
      listGen: 4,
      observe: 500,
    },
    {
      id: 'HIBIKI',
      urlRE: '//hibiki-radio.jp',
      listTitleXP: '//div[@class="title program-title-animate ng-binding"]',
      listTitleSearchXP: '//div[@class="title program-title-animate ng-binding"][+++]/../../..',
      listTitleMemoSearchXP: '//div[@class="title program-title-animate ng-binding"][+++]',
      listGen: 3,
      observe: 500,
    },
    {
      id: 'GOOGLE_SCHOLAR',
      urlRE: '//scholar\.google\..*/',
      listTitleXP: '//h3[@class="gs_rt"]/a',
      listTitleSearchXP: '//h3[@class="gs_rt"]/a[++url++]/../../..',
      listTitleMemoSearchXP: '//h3[@class="gs_rt"]/a[++url++]',
      listGen: 3,
      useURL: 1,
      disableKeyB: 1,
    },
    {
      id: 'NICODOUGA',
      urlRE: '//commons.nicovideo.jp/',
      listTitleXP: '//a[@class="title_link"]',
      listTitleSearchXP: '//a[@class="title_link"][+++]/..',
      listTitleMemoSearchXP: '//a[@class="title_link"][+++]', // ちゃんと動かない
      listGen: 2,
      observe: 500,
    },
    {
      id: 'RRWS',
      urlRE: '//rrws.info/',
      listTitleXP: '//h2[@class="entry-card-title card-title e-card-title"]',
      listTitleSearchXP: '//h2[@class="entry-card-title card-title e-card-title"][***]/../../..',
      listTitleMemoSearchXP: '//h2[@class="entry-card-title card-title e-card-title"][***]|//h1[@class="entry-title"][***]',
      listGen: 3,
      detailURLRE: /rrws.info\/archives\//,
      detailTitleXP: '//h1[@class="entry-title"]',
      detailTitleSearchXP: '//h1[@class="entry-title"][***]/../..',
      trim: 1,
    },
    {
      id: 'A-TIMESALE',
      urlRE: '//a-timesale.com/',
      listTitleXP: '//div[3]/div[@class="border-b pb-3 mb-4"]/a[@target="_blank"]',
      listTitleSearchXP: '//div[3]/div[@class="border-b pb-3 mb-4"]/a[@target="_blank"][+++]/../../../../..',
      listTitleMemoSearchXP: '//div[3]/div[@class="border-b pb-3 mb-4"]/a[@target="_blank"][+++]',
      listGen: 6,
      observe: 500,
    },
    {
      id: 'PUBMED',
      //      urlRE: '//pubmed.ncbi.nlm.nih.gov/.term=',
      urlRE: '//pubmed.ncbi.nlm.nih.gov/.term=|//pubmed.ncbi.nlm.nih.gov/.linkname=|//pubmed.ncbi.nlm.nih.gov/',
      listTitleXP: '//span[@class="docsum-pmid" and text()]|.//span[@class="docsum-pmid"]/font[1]/font[1]',
      listHelpXP: '//span[@class="docsum-pmid" and text()]/../../../../..|.//span[@class="docsum-pmid"]/font/font/../../../../../../..',
      listTitleSearchXP: '//span[@class="docsum-pmid"][+++]/../../../../..|.//span[@class="docsum-pmid"]/font/font[+++]/../../../../../../..',
      listTitleMemoSearchXP: '//span[@class="docsum-pmid"][+++]|.//span[@class="docsum-pmid"]/font/font[+++]|//header[@id="heading"]/div[1]/ul/li/span/strong[@class="current-id"][+++]|//strong[@class="current-id"]/font/font[+++]/../..',
      observe: 500,
      listGen: 7,
      trim: 1,
      detailURLRE: /\/\/pubmed.ncbi.nlm.nih.gov\/\d*\//,
      detailTitleXP: '//header[@id="heading"]/div[1]/ul/li/span/strong[@class="current-id"][1]|//strong[@class="current-id"][1]/font[1]/font[1]',
      detailTitleSearchXP: '//header[@id="heading"]/div[1]/ul/li/span/strong[@class="current-id"][+++]/../../../../../..|//strong[@class="current-id"][1]/font[1]/font[1][+++]/../../../../../../../..',
      useText: 1,
    },
    {
      id: 'NICOCHART',
      urlRE: '//www.nicochart.jp/',
      listTitleXP: '//li[@class="title"]/a',
      listTitleSearchXP: '//li[@class="title"]/a[+++]/../../../../..',
      listTitleMemoSearchXP: '//li[@class="title"]/a[+++]',
      listGen: 5,
      redoWhenReturned: 1,
    },
    {
      id: 'NICOCHART',
      urlRE: '//www.nicovideo.me/',
      listTitleXP: '//h3[@class="fxs mtxs"]/a',
      listTitleSearchXP: '//h3[@class="fxs mtxs"]/a[+++]/../../..',
      listTitleMemoSearchXP: '//h3[@class="fxs mtxs"]/a[+++]',
      listGen: 3,
      redoWhenReturned: 1,
    },
    {
      id: 'TWITTER',
      urlRE: '//twitter.com/',
      title: 'a div[dir="ltr"] span',
      //listTitleXP: '//a/div[@dir="ltr"]/span',
      //listTitleSearchXP: '//a/div[@dir="ltr"]/span[+++]/../../../../../../../../../../../../../../..',
      box: 'div[data-testid="cellInnerDiv"]',
      //listTitleSearchXP: '//a/div[@dir="ltr"]/span[+++]/ancestor::div[@data-testid="cellInnerDiv"]',
      //listTitleMemoSearchXP: '//a/div[@dir="ltr"]/span[+++]',
      //listGen: 14,
      observe: 500,
      disableHelpForce: 1,
    },
    {
      id: 'SURUGAYA',
      urlRE: '//www.suruga-ya.jp/',
      listTitleXP: '//p[@class="title"]/a[1]',
      listTitleSearchXP: '//p[@class="title"]/a[1][+++]/../../..',
      listTitleMemoSearchXP: '//p[@class="title"]/a[1][+++]',
      listGen: 5,
      //      titleProcessFunc: (title) => { return title.replace(/ランクB\)/gmi, "").replace(/（.*$|\(.*$/g, "").replace(/全??\d+巻セット.*$|全?\d+?～?\d+巻セット.*$/gmi, "").replace(/\s\/.*$/gmi, "").trim() },
      redoWhenReturned: 1,
      funcOnlyFirst: function() {
        if (location.href == "https://www.suruga-ya.jp/pcmypage/action_nyuka_search/list") {
          setupbutton("zaiko", "品切れの項目を非表示", () => {
            setInterval(() => { elegeta('//div[last()]/input[@value="再入荷通知する"]/../../../..').forEach(e => e.style.display = "none") }, 500);
          }, "もとに戻すにはリロード", "removeWhenClicked")
        }
        /*          $(document).keypress(k=>{
                  if(k.key=="1"){ setInterval(()=>{elegeta('//div[last()]/input[@value="再入荷通知する"]/../../../..').forEach(e=>e.style.display="none") },999);}
                  if(k.key=="2"){ elegeta('//div[last()]/input[@value="再入荷通知する"]/../../../..').forEach(e=>e.style.display="block")}
                  });
        */
      },
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          if (1 || lh(/\/\/www\.youtube\.com\/playlist\?list=/)) {
            addstyle.add('div.item_box{display: flex; flex-wrap: wrap;}')
            let menu = [
              { t: "安い", f: () => { sortdom(elegeta('div.item'), v => Number((eleget0('//div[contains(@class,"item_price")]/p[3]/span[1]/strong', v) || eleget0('//p[@class="price_teika"]/span[1]/strong', v) || eleget0('//div[@class="item_price"]/p/span[1]/strong', v))?.textContent?.replace(/[^0-9]/gmi, "") || 9999), 0) } },
            ]
            var sorttype = GF.yhmSortType % menu.length || 0
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            menu[sorttype].f()
            GF.yhmSortType = (++sorttype) % menu.length
            return
          }
        },
      }],
    },
    {
      id: 'YOUTUBE', // youtube::
      //      helpOnDNI: 1,
      //listTitleMemoSearchXPSameGen: 1,
      //delayAutoWeighting: lh("www.youtube.com/playlist") ? 1 : 0,
      urlRE: /\/\/www\.youtube\.com\/(?:\?bp=.*)?$|\/\/www\.youtube\.com\/results|\/\/www\.youtube\.com\/channel\/|\/\/www\.youtube\.com\/playlist|\/\/www\.youtube\.com\/c\/|\/\/www\.youtube\.com\/user\/|\/\/www\.youtube\.com\/watch\?|\/\/www\.youtube\.com\/@|\/\/www\.youtube\.com\/(?:gaming|hashtag|feed\/trending|feed\/news_destination)/,
      disableUrlRE: /\/\/www\.youtube\.com\/watch\?/,
      redoWhenRefocused: 1,
      redoWhenReturned: 1,
      callGKSIafterMemo: 1,
      //      redoWhenReturned: 1,
      listTitleXPIgnoreNotExist: 1,
      //nfd: 1,
      trim: 1,
      //title: 'ytd-channel-name.ytd-c4-tabbed-header-renderer>.ytd-channel-name>div>yt-formatted-string,div.ytd-channel-name>yt-formatted-string#text>a,h1.title.ytd-video-primary-info-renderer>yt-formatted-string,h3.title-and-badge.ytd-video-renderer>a#video-title>yt-formatted-string.ytd-video-renderer,#items #dismissible a#video-title.yt-simple-endpoint,h4.ytd-playlist-panel-video-renderer span#video-title,h3.ytd-playlist-video-renderer a#video-title,#video-title.ytd-rich-grid-media,h1 yt-formatted-string.style-scope.ytd-watch-metadata,yt-formatted-string.style-scope.ytd-channel-name.complex-string a,span#video-title,.ytd-watch-next-secondary-results-renderer yt-formatted-string.ytd-channel-name,#byline , a > span.yt-core-attributed-string--white-space-pre-wrap', //,h1.ytd-watch-metadata yt-formatted-string.ytd-watch-metadata
      title: 'ytd-channel-name.ytd-c4-tabbed-header-renderer>.ytd-channel-name>div>yt-formatted-string,div.ytd-channel-name>yt-formatted-string#text>a,h1.title.ytd-video-primary-info-renderer>yt-formatted-string,h3.title-and-badge.ytd-video-renderer>a#video-title>yt-formatted-string.ytd-video-renderer,#items #dismissible a#video-title.yt-simple-endpoint,h4.ytd-playlist-panel-video-renderer span#video-title,h3.ytd-playlist-video-renderer a#video-title,#video-title.ytd-rich-grid-media,h1 yt-formatted-string.style-scope.ytd-watch-metadata,yt-formatted-string.style-scope.ytd-channel-name.complex-string a,span#video-title,.ytd-watch-next-secondary-results-renderer yt-formatted-string.ytd-channel-name,#byline , a > span.yt-core-attributed-string--white-space-pre-wrap , a.yt-lockup-metadata-view-model-wiz__title-link , div:nth-child(1 of div) > span.yt-core-attributed-string--white-space-pre-wrap',
      //box: 'ytd-grid-video-renderer, ytd-video-renderer, div.ytd-playlist-video-list-renderer ytd-playlist-video-renderer, ytd-rich-item-renderer, div#title.style-scope.ytd-watch-metadata, div#channel-header .ytd-channel-name yt-formatted-string, ytd-watch-flexy h1.ytd-video-primary-info-renderer yt-formatted-string, ytd-video-owner-renderer #channel-name .ytd-channel-name div yt-formatted-string a,ytd-playlist-panel-video-renderer,ytd-compact-video-renderer,ytd-reel-item-renderer,ytm-shorts-lockup-view-model.ShortsLockupViewModelHost.yt-horizontal-list-renderer , ytm-shorts-lockup-view-model-v2',
      box: 'ytd-grid-video-renderer, ytd-video-renderer, div.ytd-playlist-video-list-renderer ytd-playlist-video-renderer, ytd-rich-item-renderer, div#title.style-scope.ytd-watch-metadata, div#channel-header .ytd-channel-name yt-formatted-string, ytd-watch-flexy h1.ytd-video-primary-info-renderer yt-formatted-string, ytd-video-owner-renderer #channel-name .ytd-channel-name div yt-formatted-string a,ytd-playlist-panel-video-renderer,ytd-compact-video-renderer,ytd-reel-item-renderer,ytm-shorts-lockup-view-model.ShortsLockupViewModelHost.yt-horizontal-list-renderer , ytm-shorts-lockup-view-model-v2 , yt-lockup-view-model',
      forceTranslucentFunc: e => e.closest('#channel-container div ytd-channel-name div div yt-formatted-string.style-scope.ytd-channel-name,ytd-watch-metadata div#title.style-scope.ytd-watch-metadata,ytd-watch-metadata .ytd-channel-name a,div#channel-header .ytd-channel-name yt-formatted-string,ytd-watch-flexy h1.ytd-video-primary-info-renderer yt-formatted-string,ytd-video-owner-renderer #channel-name .ytd-channel-name div yt-formatted-string a,ytd-playlist-panel-video-renderer,#byline'),
      dniCancel: 1, // DNIがobserve(ms)以上連続して発火しても途切れるのを待ち続ける
      /*
#channel-container div ytd-channel-name div div yt-formatted-string.style-scope.ytd-channel-name
↑チャンネルホームの投稿者名
ytd-watch-metadata h1 yt-formatted-string.ytd-watch-metadata
↑新視聴画面タイトル
ytd-watch-metadata .ytd-channel-name a
↑新視聴画面投稿者名
div#channel-header .ytd-channel-name yt-formatted-string
↑旧チャンネルホーム投稿者名
ytd-watch-flexy h1.ytd-video-primary-info-renderer yt-formatted-string
↑旧視聴タイトル
ytd-video-owner-renderer #channel-name .ytd-channel-name div yt-formatted-string a
↑旧視聴投稿者名
*/
      //listHelpXP: '//div[@id="dismissible"]|//div[@class="style-scope ytd-playlist-video-renderer"]/h3[@class="style-scope ytd-playlist-video-renderer"]/a/../../../../..',
      //listTitleXP: '//a/yt-formatted-string[@class="style-scope ytd-video-renderer"]/..|.//a[@id="video-title"]|.//h3/span[@id="video-title"]|.//a[@id="video-title-link"]/yt-formatted-string[@id="video-title"]|.//yt-formatted-string[@id="video-title" and @class="style-scope ytd-rich-grid-media"]|//div[2]/ytd-video-primary-info-renderer[@has-date-text=""]/div/h1/yt-formatted-string[@force-default-style="" and contains(@class,"style-scope ytd-video-primary-info-renderer")]|//ytd-watch-metadata[@class="style-scope ytd-watch-flexy"]/div/div[@class="style-scope ytd-watch-metadata"]/h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string',
      listTitleXP: 'a yt-formatted-string.style-scope,ytd-video-renderer , a#video-title , h3 span#video-title , a#video-title-link yt-formatted-string#video-title , yt-formatted-string#video-title.style-scope,ytd-rich-grid-media , div ytd-video-primary-info-renderer[has-date-text=""] div h1 yt-formatted-string[force-default-style=""],style-scope.ytd-video-primary-info-renderer , ytd-watch-metadata.style-scope.ytd-watch-flexy div div.style-scope.ytd-watch-metadata h1.style-scope.ytd-watch-metadata yt-formatted-string',

      //listTitleSearchXP: '//ytd-grid-video-renderer[.//a[@id="video-title" and +++]]|//ytd-channel-name[@wrap-text=""]/div/div/yt-formatted-string[+++]/following::a|.//ytd-video-renderer[.//a[@id="video-title" and ++title++]]|.//ytd-video-renderer[.//a[contains(@class,"yt-simple-endpoint") and +++]]|.//ytd-rich-item-renderer[.//yt-formatted-string[@id="video-title" and +++]]|.//ytd-rich-item-renderer[.//a[contains(@class,"yt-simple-endpoint") and +++]]|.//ytd-playlist-video-renderer[.//a[@id="video-title" and ++title++]]',
      //XP2name: '投稿者名　',
      //XP2memo:1, // 投稿者にメモ可は重そう
      //listTitleXP2: '//ytd-item-section-renderer[@class="style-scope ytd-section-list-renderer" and @use-height-hack=""]/div[3]/ytd-video-renderer[@class="style-scope ytd-item-section-renderer" and @use-prominent-thumbs=""]/div[@id="dismissible" and @class="style-scope ytd-video-renderer"]/div/div/ytd-channel-name[@id="channel-name" and @class="long-byline style-scope ytd-video-renderer" and @wrap-text="true"]/div[@id="container"]/div[@id="text-container" and @class="style-scope ytd-channel-name"]/yt-formatted-string[@id="text" and @class="style-scope ytd-channel-name"]/a|.//div[@class="byline style-scope ytd-rich-grid-media"]/ytd-video-meta-block[@rich-meta="" and @mini-mode=""]/div[@class="style-scope ytd-video-meta-block"]/div[@class="style-scope ytd-video-meta-block"]/ytd-channel-name/div[@class="style-scope ytd-channel-name"]/div[@class="style-scope ytd-channel-name"]/yt-formatted-string[@id="text" and @class="style-scope ytd-channel-name complex-string"]/a[@class="yt-simple-endpoint style-scope yt-formatted-string" and @spellcheck="false" and @dir="auto"]|//div[@id="meta" and @class="style-scope ytd-c4-tabbed-header-renderer"]/ytd-channel-name/div[@class="style-scope ytd-channel-name"]/div[@id="text-container" and @class="style-scope ytd-channel-name"]/yt-formatted-string[@id="text" and @class="style-scope ytd-channel-name"]|.//ytd-channel-name[@id="channel-name" and @class="style-scope ytd-video-meta-block"]/div[@id="container"]/div[@class="style-scope ytd-channel-name"]/yt-formatted-string[@class="style-scope ytd-channel-name complex-string" and @ellipsis-truncate=""]/a[@class="yt-simple-endpoint style-scope yt-formatted-string" and @dir="auto"]|.//ytd-channel-name[@id=\"channel-name\" and @wrap-text=\"true\"]/div[@class=\"style-scope ytd-channel-name\"]/div/yt-formatted-string/a|//div[@id="container"]/div[@class="style-scope ytd-channel-name"]/yt-formatted-string/a[@class="yt-simple-endpoint style-scope yt-formatted-string"]',

      listGen: 7,
      observe: 500,
      //      ignoreDNI: e => e.nodeType !== 1 || !["YTD-PLAYLIST-VIDEO-RENDERER", "YTD-VIDEO-RENDERER", "YTD-RICH-ITEM-RENDERER", "YTD-PLAYLIST-PANEL-VIDEO-RENDERER"].includes(e.tagName), //ytd-playlist-panel-video-renderer
      ignoreDNI: e => e.nodeType !== 1 || !e?.matches(SITE.box), //!["YTD-PLAYLIST-VIDEO-RENDERER", "YTD-VIDEO-RENDERER", "YTD-RICH-ITEM-RENDERER", "YTD-PLAYLIST-PANEL-VIDEO-RENDERER"].includes(e.tagName), //ytd-playlist-panel-video-renderer
      //observeId: "dismissible",
      disableKeyB: 1,
      preventHelpFunc: () => 1,
      funcOnlyFirst: () => {
        hoverHelp(e => {
          if (e.closest('span#video-title , a#video-title , div#title.style-scope > h1.style-scope , yt-formatted-string#video-title.style-scope , span#video-title.style-scope.ytd-playlist-panel-video-renderer , a.yt-lockup-metadata-view-model-wiz__title , h3.shortsLockupViewModelHostOutsideMetadataTitle > a > span')) return "Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ<br>Ｄ：この投稿者の新しい／古い順の再生リストで再生<br>Ｓ：この動画を含む再生リストを検索"
          //if (e.closest('div.style-scope.ytd-channel-name > yt-formatted-string.complex-string > a , yt-formatted-string.ytd-channel-name > a')) return "投稿者　Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ<br>Ｓ：この投稿者の動画を入力ワードで検索"
          if (e.closest('div.style-scope.ytd-channel-name > yt-formatted-string.complex-string > a , yt-formatted-string.ytd-channel-name > a ')) return "投稿者　Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ<br>Ｓ：この投稿者の動画を入力ワードで検索"
          //if (e.closest('ytd-channel-name > div#container.ytd-channel-name')) return "投稿者　Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ"
          if (e.closest('ytd-channel-name > div#container.ytd-channel-name , span#byline.ytd-playlist-panel-video-renderer , div.yt-content-metadata-view-model-wiz__metadata-row:nth-child(1) > span.yt-core-attributed-string--link-inherit-color')) return "投稿者　Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ"
          //if (e.closest('ytd-video-renderer , ytd-reel-item-renderer , ytd-rich-item-renderer , ytm-shorts-lockup-view-model.ShortsLockupViewModelHost.yt-horizontal-list-renderer')) return "Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ"
          if (e.closest('ytd-video-renderer , ytd-reel-item-renderer , ytd-rich-item-renderer , ytm-shorts-lockup-view-model.ShortsLockupViewModelHost.yt-horizontal-list-renderer , a.yt-lockup-metadata-view-model-wiz__title-link')) return "Ｑ：非表示　Ｗ：アンドゥ　１,５：○メモ　２,６：×メモ"
          if (lh(/\&list=([0-9a-zA-Z-_]+)/) && e.closest('h3.style-scope.ytd-playlist-panel-renderer , yt-formatted-string.title.style-scope.ytd-playlist-panel-renderer > a.yt-simple-endpoint')) return "右クリック：このプレイリストの詳細を見る"
          if (e.closest('ytd-playlist-panel-renderer#playlist.style-scope.ytd-watch-flexy')) return "Ｈ：ソート";
        })

        YOUTUBE_TITLE_ROWS && addstyle.add(`ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media { max-height: ${YOUTUBE_TITLE_ROWS*2}rem; -webkit-line-clamp: ${YOUTUBE_TITLE_ROWS};}`);
        addstyle.add('#channel-name.ytd-video-meta-block {--ytd-channel-name-text-complex-display: initial !important;}') // プレイリストの投稿者名のメモをなんとか見えるようにする
        addstyle.add('div#container.style-scope.ytd-playlist-panel-renderer {resize: both !important;}') // プレイリストをサイズ可変に
        document.body.addEventListener('mousedown', e => {
          var one = document.elementFromPoint(mousex, mousey) || e?.target
          //動画視聴ページで再生リストタイトルを右クリックでプレイリスト詳細を開く
          if (e.button == 2 && lh(/\&list=([0-9a-zA-Z-_]+)/) && one == eleget0('//yt-formatted-string[@class="title style-scope ytd-playlist-panel-renderer" and @ellipsis-truncate="" and @title="Untitled List" and text()="Untitled List"]|//div[@id="container"]/div/div[@id="header-contents" and @class="style-scope ytd-playlist-panel-renderer"]/div[1]/div[1]/h3[1]/yt-formatted-string/a')) {
            let u = location.href.match0(/\&list=([0-9a-zA-Z-_]+)/)
            if (u) window.open(`https://www.youtube.com/playlist?list=${u}`, "", "noreferrer")
          }
          /*//動画視聴ページで再生中タイトルを右クリックでその動画を含む再生リストを検索する
          if (e.button == 2 && lh(/\/watch/) && one?.matches('div#title>h1>yt-formatted-string')) {
            let u = encodeURIComponent(one?.innerText?.trim())
            if (u) {
              if (confirm(`https://www.youtube.com/results?search_query="${one?.innerText?.trim()}"&sp=EgIQAw%253D%253D\n\nを開きます。よろしいですか？`)) {
                elegeta('video').forEach(v => v.pause());
                window.open(`https://www.youtube.com/results?search_query=%22${u}%22&sp=EgIQAw%253D%253D`, "", "noreferrer")
              }
            }
          }*/
        }, false);

        ael(document, "click", e => { if (e?.target?.closest(`div#chip-container.style-scope.yt-chip-cloud-chip-renderer`) && lh("/videos")) { elegeta(SITE.box).forEach(ele => { ele?.remove() }) } }); // /videosタブの人気順等のボタン押下時

        let rerun = (mutations) => {
          pauseAll = 1;
          prefCacheClear();
          observeUrlHasChangedhref = location.href;
          //            elegeta('//span[contains(@class,"yhmMyMemo")]/..').forEach(e => e.remove());
          elegeta('.yhmMyMemo').forEach(e => e?.parentNode?.remove());
          elegeta(SITE.box).forEach(e => e.style.opacity = "1");
          setTimeout(() => {
            pauseAll = 0;
            /*let watchTitle=eleget0('//div[@id="above-the-fold" and @class="style-scope ytd-watch-metadata"]/div/h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string'); if(watchTitle)watchTitle.innerText=watchTitle?.textContent?.normalize("NFC")*/
            run(document.body, "returned")
          }, 3500);
        }
        var observeUrlHasChangedhref = location.href;
        var observeUrlHasChanged = new MutationObserver(() => {
          if (observeUrlHasChangedhref !== location.href) {
            GF.yhmSortType = 0;
            kaisuuU = 0;
            rerun()
          }
        });
        observeUrlHasChanged.observe(document, { childList: true, subtree: true });

        //window.addEventListener("resize", e => lh('/videos') && setTimeout(rerun, 2222)) // 2025.08最近resizeすると動画リストを書き直すようになったので再実行

        GM_addStyle("#meta.ytd-playlist-panel-video-renderer{display:block}") // プレイリストがdisplay:flexで1行に詰め込めないので外す試用
        GM_addStyle('ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy{border-radius: 0 !important;} ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before,ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before { border-radius: 0 !important;}') // 動画の角丸を解除

        if (REPLACE_LINK_IN_YOUTUBE) { // チャンネルへのリンクを中クリックで開くと最初から動画タブ
          document.addEventListener("mousedown", evt => {
            let e = evt?.target?.closest('a')
            if (e && /\/(channel|user|c)\/[^\/]+$|youtube\.com\/@[^\/]+$/.test(e?.href) && !/\/video/.test(e?.href)) { e.href = e.href + "/videos"; }
          }, true)
        }
      },
      func: function(node = document.body) {
        /*var watchtitle = eleget0('h1>yt-formatted-string.style-scope.ytd-video-primary-info-renderer');
        if (watchtitle) watchtitle.innerText = watchtitle.innerText.normalize("NFC"); //動画視聴画面のタイトルだけNFDでマッチしないので変換*/ //これやると動画遷移時タイトルが書き換わらなくなる
        //        if (location.href.indexOf("https://www.youtube.com/playlist?list=") !== -1) { elegeta('a#video-title,span#video-title').forEach(e => { e.title = e.textContent.trim();            e.innerText = e.textContent.trim(); }); } // 再生リストだけテキストにゴミスペースがある
        //if (lh(/^https:\/\/www\.youtube\.com\/playlist\?list=|^https:\/\/www\.youtube\.com\/watch/)) { elegeta('a#video-title,span#video-title').forEach(e => { e.title = e.textContent.trim();            e.innerText = e.textContent.trim(); }); } // 再生リストだけテキストにゴミスペースがある
        /*if (REPLACE_LINK_IN_YOUTUBE) {
          elegeta('a', node).forEach(e => { if (/\/(channel|user|c)\/[^\/]+$|youtube\.com\/@[^\/]+$/.test(e?.href) && !/\/video/.test(e?.href)) { e.href = e.href + "/videos"; } })
        }*/
      },
      //      helpOnDNI:1,
      //      wholeHelp: [() => 1, `　u:重複作品を隠す　h:ソート`],
      keyFunc: [{
        key: 'u', // u::uniq プレイリスト画面//videos画面
        func: () => {
          if (!lh(/https:\/\/www\.youtube\.com\/playlist\?list=|^https:\/\/www.youtube.com\/[^\/]*\/videos/)) return;
          let undup = [],
            dup = [];
          elegeta('h3.style-scope.ytd-playlist-video-renderer , yt-formatted-string#video-title.style-scope.ytd-rich-grid-media:visible').reverse().forEach(e => {
            if (undup.includes(e.textContent?.trim())) {
              e.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
              $(e.closest("ytd-playlist-video-renderer.style-scope.ytd-playlist-video-list-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer")).hide(999, function() { $(this).remove() }); //e?.closest(".entry")?.remove()
              dup.push(e.textContent?.trim())
            } else { undup.push(e.textContent?.trim()) }
          })
          popup2(`u:重複タイトルを隠す\n${dup.join("\n")}`, 6)
        }
      }, {
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: async (e) => {
          if (lh(/\/search|\/shorts|\/streams$|\/videos$|results\?search_query\=/)) autoPaging(`#dismissible , ytm-shorts-lockup-view-model-v2`, 0, (lh("search_") ? 50 : 100));
          /*{
            let last = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let st = addstyle.add(`#dismissible{opacity:0.5 !important;}`)
            let scr = async (i) => {
              last.push(elegeta('#dismissible')?.length)
              popup3(`Shift+End : 動画の継ぎ足し操作 動画数：${last[last.length-1]}/残試行：${i}`)
              window.scroll({ left: 0, top: i % 2 == 0 ? window.scrollY - 1 : 999999, behavior: "instant" })
              await sleep(250)
              if (i > 0 && (Math.max(...last.slice(-10)) != Math.min(...last.slice(-10)))) scr(--i);
              else {
                addstyle.remove(st)
              }
            }
            await scr(lh("search_") ? 50 : 100)
          }*/
        }
      }, {
        //        keyFunc: [{
        key: "d", // d::
        func: (e, evt) => {
          let targets = (elegeta(['//div[@id="title"]/h1/yt-formatted-string/span[1]', // watchのタグついてるタイトル
            '//h3[@class="title-and-badge style-scope ytd-video-renderer"]/a[@id="video-title" and @class="yt-simple-endpoint style-scope ytd-video-renderer"]/yt-formatted-string',
            '//div[@class="style-scope ytd-playlist-video-renderer"]/h3/a[@id="video-title"]',
            '//div[@id="title" and contains(@class,"style-scope ytd-watch-metadata")]/h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string',
            '//span[@id="video-title" and @class=" style-scope ytd-compact-video-renderer style-scope ytd-compact-video-renderer"]',
            '//a[@id="video-title-link"]/yt-formatted-string[@id="video-title" and @class="style-scope ytd-rich-grid-media"]',
            '//div[@class="style-scope ytd-playlist-panel-video-renderer"]/div[3]/h4/span[@id="video-title"]',
            '//ytd-rich-grid-slim-media[@lockup="true"]/div[@class="style-scope ytd-rich-grid-slim-media"]/div[@id="details"]/h3/a/span[@id="video-title"]',
            '//span[@class="style-scope ytd-reel-item-renderer"]', 'div#meta.style-scope.ytd-grid-video-renderer > h3.style-scope > a#video-title',
            `span#video-title.style-scope.ytd-playlist-panel-video-renderer`, // 2025.03
            `a.yt-lockup-metadata-view-model-wiz__title > span`, // 2025.03
            `h3.shortsLockupViewModelHostOutsideMetadataTitle > a > span`, // 2025.06 /shorts
            `a.yt-lockup-metadata-view-model__title`, // 2025.09 watchサジェスト
          ])) //
          targets.forEach(e => debugEle(e, "test autoRemove")) // targets.forEach(e => debugEle(e, "test autoRemove force"))
          /*          var one = document.elementFromPoint(mousex, mousey)
                    if (targets.some(e => e.contains(one))) {
          */
          var one = document.elementsFromPoint(mousex, mousey)
          one = targets.find(e => one.includes(e))
          if (one) {

            let vid = (one?.closest('a[href*="watch?v="],a[href*="/shorts/"]')?.href || location.href).match(/watch\?v=([a-zA-Z0-9\-_]{11})|shorts\/([a-zA-Z0-9\-_]{11})/)?.slice(1)?.find(v => v)

            //チャンネル/videosページか視聴ページのみ 動画タイトル上でdキーでこの投稿者の「新しい順プレイリスト」でこの動画を再生するURL
            let chid = one.closest('[channel_id]')?.getAttribute("channel_id"); // 検索結果画面等のchID.youtubeフィルタを入れていると使える
            let plid = chid ? `${chid?.match0(/UC([a-zA-Z0-9\-_]+)/m)}` :
              !one.closest('div#items.style-scope.ytd-watch-next-secondary-results-renderer') ? (
                eleget0('#infocard-videos-button a[href*="/channel/UC"]')?.href?.match0(/\/channel\/UC([a-zA-Z0-9\-_]+)/m) ||
                elegeta('script').map(v => v?.innerHTML)?.join()?.match1(/"channelId":"UC([a-zA-Z0-9\-_]+)"|"externalId":"UC([a-zA-Z0-9\-_]+)"/m)
              ) : null
            if (plid && !one?.closest('ytd-playlist-panel-renderer#playlist.style-scope.ytd-watch-flexy')) {
              /*
                            let vid = (one?.closest('a[href*="watch?v="],a[href*="/shorts/"]')?.href || location.href).match(/watch\?v=([a-zA-Z0-9\-_]{11})|shorts\/([a-zA-Z0-9\-_]{11})/)?.slice(1)?.find(v => v)
                          //チャンネル/videosページか視聴ページのみ 動画タイトル上でdキーでこの投稿者の「新しい順プレイリスト」でこの動画を再生するURL
                          let chid = one.closest('[channel_id]')?.getAttribute("channel_id"); // 検索結果画面等のchID.youtubeフィルタを入れていると使える
                          let plid = chid ? `${chid?.match0(/UC([a-zA-Z0-9\-_]+)/m)}` :
                            eleget0('#infocard-videos-button a[href*="/channel/UC"]')?.href?.match0(/\/channel\/UC([a-zA-Z0-9\-_]+)/m) || elegeta('script').map(v => v?.innerHTML)?.join()?.match1(/"channelId":"UC([a-zA-Z0-9\-_]+)"|"externalId":"UC([a-zA-Z0-9\-_]+)"/m)
                          if (plid && !one?.closest('ytd-playlist-panel-renderer#playlist.style-scope.ytd-watch-flexy')) {
                */
              evt.preventDefault();
              evt.stopPropagation(); // 有効なdキーだったら本来の機能（10秒進む）をキャンセル
              if (plid && vid) {
                var url = `https://www.youtube.com/watch?v=${vid}&list=UU${plid}`
                if (confirm(`d:この投稿者の『新しい順のプレイリスト』でこの動画を再生するURL\n\n${url}\n\nを開きますか？`)) {
                  //elegeta('video').forEach(v => v.pause()); // 停止する
                  GM.openInTab(url, true)
                  return false;
                }
              }
            }

            // /videosページ、視聴ページ、検索結果、どこでも この投稿者の『古い順プレイリスト』でこの動画を再生するURL
            var url = `https://www.youtube.com/watch?v=${vid}&list=${Math.random()>0.5?"ULcxqQ59vzyTk":"UL01234567890"}`;
            if (vid && confirm(`d:この投稿者の『古い順プレイリスト』でこの動画を再生するURL\n\n${url}\n\nを開きますか？`)) {
              //elegeta('video').forEach(v => v.pause()); // 停止する
              GM.openInTab(url, true)
              return false;
            }
            return false;
          }
        }
      }, {
        key: "s", // s::
        func: (e, evt) => {
          let targets = (elegeta('//h3[@class="title-and-badge style-scope ytd-video-renderer"]/a[@id="video-title" and @class="yt-simple-endpoint style-scope ytd-video-renderer"]/yt-formatted-string|//div[@class="style-scope ytd-playlist-video-renderer"]/h3/a[@id="video-title"]|//div[@id="title" and contains(@class,"style-scope ytd-watch-metadata")]/h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string|//span[@id="video-title" and @class=" style-scope ytd-compact-video-renderer style-scope ytd-compact-video-renderer"]|//a[@id="video-title-link"]/yt-formatted-string[@id="video-title" and @class="style-scope ytd-rich-grid-media"]|//div[@class="style-scope ytd-playlist-panel-video-renderer"]/div[3]/h4/span[@id="video-title"]|//SPAN[@class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap" and @role="text"]'))
          var one = document.elementFromPoint(mousex, mousey)
          //let hover=(eleget0('yt-formatted-string:hover,a:hover'))
          one = targets.find(e => e.contains(one))
          if (targets.includes(one)) {
            //動画タイトル上でsキーでその動画を含む再生リストを検索する
            let title = one?.innerText?.trim()
            let u = encodeURIComponent(title)
            if (u) {
              evt.preventDefault();
              evt.stopPropagation(); // 有効なlキーだったら本来の機能（10秒進む）をキャンセル
              if (confirm(`s:指したタイトルを含む再生リストを検索する\n\nhttps://www.youtube.com/results?search_query="${one?.innerText?.trim()}"&sp=EgIQAw%253D%253D\n\nを開きます。よろしいですか？`)) {
                //elegeta('video').forEach(v => v.pause()); // 停止する
                GM.openInTab(`https://www.youtube.com/results?search_query=%22${u}%22&sp=EgIQAw%253D%253D`, "true")
              }
            }
            return false;
          }
          //投稿者名上でsキーでそのチャンネルの動画を入力したキーワードで検索する
          var one = document.elementFromPoint(mousex, mousey)
          if (lh(/\/watch|search_query|^https:\/\/www\.youtube\.com\/$/) && one?.matches('yt-formatted-string#text.style-scope.ytd-channel-name > a.yt-simple-endpoint[herf*="https://www.youtube.com/channel/"],div.ytd-channel-name yt-formatted-string a,yt-formatted-string#text.ytd-channel-name>a[href*="https://www.youtube.com/@"],ytd-channel-name div.ytd-channel-name div#text-container yt-formatted-string a[href*="https://www.youtube.com/@"]')) { //div#channel-header ytd-channel-name div div yt-formatted-string
            //            let u = one?.href?.match0(/(https:\/\/www\.youtube\.com\/@[^\/]+)\/videos/) || one?.href?.match0(/(https:\/\/www\.youtube\.com\/channel\/[^\/]+)/)
            let u = one?.href?.match0(/(https:\/\/www\.youtube\.com\/@[^\/]+)/) || one?.href?.match0(/(https:\/\/www\.youtube\.com\/channel\/[^\/]+)/)
            if (u) {
              evt.preventDefault();
              evt.stopPropagation(); // 有効なlキーだったら本来の機能（10秒進む）をキャンセル
              u += '/search?query='
              let qu = prompt(`s:指した投稿者の動画をキーワードで検索する\n\n${one?.textContent}\nの動画を入力した検索キーワード（***）で検索します\n\n${u}***\n\n`)?.trim()
              if (qu) {
                GM.openInTab(u + encodeURIComponent(qu), "true")
              }
            }
          }
          return false;
        },
      }, {
        key: 'Shift+F', // Shift+F::YouTubeでキーワード検索
        func: () => { searchWithHistory("YouTube", "YouTube", 'https://www.youtube.com/results?search_query=***', "+OR+") },
      }, {
        key: 'u', // u::チャプターメモ
        func: (e) => {
          if (lh(/https:\/\/www\.youtube\.com\/results\?search_query\=/)) { // u::uniq
            let undup = []
            let dup = []
            elegeta('h3.title-and-badge.style-scope.ytd-video-renderer>a>yt-formatted-string:visible').forEach(e => {
              if (undup.includes(e.textContent)) {
                e.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
                $(e.closest("ytd-grid-video-renderer, ytd-video-renderer, div.ytd-playlist-video-list-renderer ytd-playlist-video-renderer, ytd-rich-item-renderer, h1 yt-formatted-string.ytd-watch-metadata, div#channel-header .ytd-channel-name yt-formatted-string, ytd-watch-flexy h1.ytd-video-primary-info-renderer yt-formatted-string, ytd-video-owner-renderer #channel-name .ytd-channel-name div yt-formatted-string a,ytd-playlist-panel-video-renderer,ytd-compact-video-renderer,ytd-reel-item-renderer")).hide(999, function() { $(this).remove() }); //e?.closest(".entry")?.remove()
                dup.push(e.textContent)
              } else { undup.push(e.textContent) }
            })
            popup2(`u:重複タイトルを隠す\n${dup.join("\n")}`, 6)
            return
          }

          chapterMemo(/watch/, () => eleget0('//div[2]/ytd-video-primary-info-renderer[@has-date-text=""]/div/h1/yt-formatted-string[@force-default-style="" and contains(@class,"style-scope ytd-video-primary-info-renderer")]|//ytd-watch-metadata[@class="style-scope ytd-watch-flexy"]/div/div[@class="style-scope ytd-watch-metadata"]/h1[@class="style-scope ytd-watch-metadata"]/yt-formatted-string')?.textContent, `https://www.youtube.com/watch?v=${location.href.match0(/v\=([^?&]*)/)}&t=**time**`)
        },
      }, {
        key: 'Shift+U', // Shift+U::チャプターメモをクリップボードにコピー
        func: (e) => {
          // watch視聴画面
          elegeta('a[href*="&pp="]').forEach(e => e.href = e?.href?.replace(/&pp=[^&]+/, ""))
          if (lh(/watch/) && kaisuuU % 6 < 2) chapterMemo(/watch/, () => eleget0('meta[name="title"]:visible')?.getAttribute("content") || eleget0('//div[@id="title" and @class="style-scope ytd-watch-metadata"]/h1/yt-formatted-string:visible')?.textContent?.trim(), `${(kaisuuU%3%2==1?"https://www.youtube.com/watch?v=**id**&t=**time**":"https://youtu.be/**id**?t=**time**").replace("**id**",location.href.match0(/v\=([a-zA-Z0-9_\-]{11})/))}`, 1) // 1－2回目：今見てる動画のついているチャプターメモを列挙
          if (lh(/watch/) && kaisuuU % 6 == 2) { // 3回目：プレイリスト中の○メモかチャプターメモがついた動画（Qで消されていたら除外）を列挙
            let chaMemoTU = [...new Set((elegeta('div#items ytd-playlist-panel-video-renderer#playlist-items').reduce((ac, v) => {
              if (eleget0('.yhmMyMemo:not(.yhmMyMemoX)', v) && v?.style?.opacity != 0.5) {
                //ac.push(`${eleget0('#video-title', v)?.innerText?.normalize("NFC")?.trim()}\n${eleget0('a', v)?.href?.replace(/\&list=.*/, "")}\n`)
                ac.push(`${eleget0('#video-title', v)?.innerText?.normalize("NFC")?.trim()} - YouTube\n${eleget0('a', v)?.href?.replace(/\&.*/, "")}\n`)
              }
              return ac
            }, [])))]
            GM.setClipboard(chaMemoTU.join(""))
            popup2(chaMemoTU.join(""), -1, "", "top")
          }
          if (lh(/watch/) && (kaisuuU % 6 >= 3)) { // 4/5/6回目：プレイリスト中の○メモかチャプターメモがついた動画（Qで消されていたら除外）を列挙、メモを掲載
            let chaMemoTU = [...new Set((elegeta('div#items ytd-playlist-panel-video-renderer#playlist-items').reduce((ac, v) => {
              let uploader = eleget0('span#byline.style-scope.ytd-playlist-panel-video-renderer', v)?.textContent?.trim();
              let videolen = eleget0('div.style-scope.ytd-thumbnail-overlay-time-status-renderer', v)?.textContent?.trim();
              let memoot = elegeta('.yhmMyMemo:not(.yhmMyMemoX)', v).filter(v => v?.style?.opacity != 0.5).map(v => v.textContent).join(" ")
              let memoxt = elegeta('.yhmMyMemoX', v).filter(v => v?.style?.opacity != 0.5).map(v => v.textContent).join(" ")
              let chapterurl = elegeta('.yhmMyMemo:not(.yhmMyMemoX)', v).find(v => v?.style?.opacity != 0.5 && v?.dataset?.url)?.dataset.url.match0(/&t=\d*/)
              if (kaisuuU % 6 == 3 && memoot) {
                ac.push(`${eleget0('#video-title', v)?.innerText?.normalize("NFC")?.trim()} - YouTube\n${chapterurl?eleget0('a', v)?.href?.replace(/\&.*/, "")+chapterurl: eleget0('a',v)?.href?.replace(/\&.*/, "")}\n`)
              } else
              if (kaisuuU % 6 == 5 || memoot) {
                ac.push(`${eleget0('#video-title', v)?.innerText?.normalize("NFC")?.trim()} - YouTube${uploader?` - ${uploader}`:""}${videolen?` - [${videolen}]`:""}${(memoot||memoxt)?" - ":""}${memoot}${memoxt?" "+memoxt:""}\n${chapterurl?eleget0('a', v)?.href?.replace(/\&.*/, "")+chapterurl: eleget0('a',v)?.href?.replace(/\&.*/, "")}\n`)
              }
              return ac
            }, [])))]
            GM.setClipboard(chaMemoTU.join(""))
            popup2(`${["チャプター反映／メモあり","メモとチャプター反映／メモあり","メモとチャプター反映／全て"][kaisuuU%6-3]}(${chaMemoTU?.length})\n` + chaMemoTU.join(""), -1, kaisuuU % 6 >= 4 ? "background-color:#447;" : "", "top")
            //popup2(`${chaMemoTU?.length})\n` + chaMemoTU.join(""), -1, "", "top")
          }

          // 検索、プレイリスト画面等
          if (!lh(/\/watch/) && lh(/\/results\?search_query=|\/videos|\/playlist|\/shorts|\/search/)) {

            let list
            if (kaisuuU % 4 == 3) { // 4回目：○メモかチャプターメモがついた動画（Qで消されていたら除外）を列挙、メモを掲載
              list = [...new Set((elegeta('ytd-grid-video-renderer,ytd-video-renderer,ytd-playlist-video-renderer,ytd-rich-item-renderer,ytd-reel-item-renderer.style-scope.yt-horizontal-list-renderer').reduce((ac, v) => {
                let memoot = elegeta('.yhmMyMemo:not(.yhmMyMemoX)', v).filter(v => v?.style?.opacity != 0.5).map(v => v.textContent).join(" ")
                let memoxt = elegeta('.yhmMyMemoX', v).filter(v => v?.style?.opacity != 0.5).map(v => v.textContent).join(" ")
                let chapterurl = elegeta('.yhmMyMemo:not(.yhmMyMemoX)', v).find(v => v?.style?.opacity != 0.5 && v?.dataset?.url)?.dataset.url.match0(/&t=\d*/);
                let url = chapterurl ? eleget0('a', v)?.href?.replace(/\&.*/, "") + chapterurl : eleget0('a', v)?.href?.replace(/\&.*/, "")
                url = url?.replace(/^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_\-]{11}.*)$/, `https://www.youtube.com/watch?v=$1`)
                if (memoot) {
                  ac.push(`${eleget0('#video-title', v)?.innerText?.normalize("NFC")?.trim()} - YouTube ${memoot}${memoxt?" "+memoxt:""}\n${url}\n`)
                }
                return ac;
              }, [])))];
              list = [...new Set(list)];
            } else {

              // 1-3回め：
              list = elegeta('.yhmMyMemo:not(.yhmMyMemoX):visible')
                .filter(e => e?.closest("ytd-grid-video-renderer,ytd-video-renderer,ytd-playlist-video-renderer,ytd-rich-item-renderer,ytd-reel-item-renderer.style-scope.yt-horizontal-list-renderer") && ((GF?.chaptermemotype || 0) % 3 != 1 || e?.dataset?.cm))
                .map(memoEle => {
                  let vEle = eleget0("a[href*='/watch?v='],a[href*='/shorts/']", memoEle?.closest(SITE.box));
                  //                  let vID = vEle?.href?.match0(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_\-]{11})/);
                  let vID = vEle?.href?.match0(/(?:\/watch\?v=|\/shorts\/)([a-zA-Z0-9_\-]{11})/);
                  let url = `https://www.youtube.com/watch?v=${ vID}`;
                  url = url?.replace(/^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_\-]{11}.*)$/, `https://www.youtube.com/watch?v=$1`)
                  let title = eleget0(SITE.title, memoEle?.closest(SITE.box))?.textContent?.trim();
                  let stime = hms2sec(memoEle.textContent.match0(/^([\d:]+)\s/) || "");
                  let memo = !stime ? memoEle.textContent?.replace(/^\d\d\d\d\.\d\d\.\d\d(?:\s\(.\))?$/, "") : "";
                  let line = (GF?.chaptermemotype || 0) % 4 < 2 && stime ? `${title} - YouTube ▶ ${memoEle?.textContent?.trim()}\n${url}?t=${stime}\n` : `${title} - YouTube${memo?" "+memo:""}\n${url}\n`;
                  return line;
                });
              list = [...new Set(list)];
            }

            GF.chaptermemotype = (GF?.chaptermemotype || 0) + 1; // 偶数回目に押した時はチャプターメモに絞る
            GM.setClipboard(list?.join("") || "")
            popup2((list?.join("") || ""), -1, "", "top") //popup2(`(${list?.length})\n` + (list?.join("") || ""), -1, "", "top")
          }
          kaisuuU++
        },
      }, {
        key: 'h', // a:: h::キューかプレイリストありでの視聴画面　（「YouTube検索結果「全てキューに入れて再生」ボタンを追加」用）
        func: () => {
          if (/\/\/www\.youtube\.com\/watch/.test(location.href)) {
            let menu = [
              //{ t: "メモ多", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => Number(elegeta('.yhmMyMemo', v).length), 1) } },
              { t: "メモ多", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => (elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              { t: "タイトル", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => v?.querySelector('span#video-title')?.textContent?.trim()) } },
              { t: "投稿者名", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => v?.querySelector('span#byline')?.textContent?.trim()) } },
              { t: "時間長", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => Number(v?.querySelector('span.style-scope.ytd-thumbnail-overlay-time-status-renderer')?.innerText?.replace(/[^0-9]/gmi, "") || Number.MAX_SAFE_INTEGER), 1) } },
              { t: "時間短", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => Number(v?.querySelector('span.style-scope.ytd-thumbnail-overlay-time-status-renderer')?.innerText?.replace(/[^0-9]/gmi, "") || Number.MAX_SAFE_INTEGER)) } },
              { t: "元順", f: () => { sortdom(elegeta('ytd-playlist-panel-video-renderer:visible'), v => Number(v?.querySelector('span#index.style-scope.ytd-playlist-panel-video-renderer')?.innerText?.replace(/[^0-9]/gmi, "") || Number.MAX_SAFE_INTEGER)) } },
            ]
            //var sorttype = GF.yhmSortType % menu.length || 0
            cyclemenu(menu) //popup2("h：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            //menu[sorttype].f()
            //GF.yhmSortType = (++sorttype) % menu.length
          }
        }
      }, {
        key: 'a', // a::
        func: () => {
          if (lh(/\/\/www\.youtube\.com\/playlist\?list=/)) {
            let menu = [
              //{ t: "メモ多", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => elegeta('.yhmMyMemo', v).length, 1) } },
              { t: "メモ多", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => (elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              { t: "タイトル", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => eleget0('#video-title', v)?.textContent?.trim()) } },
              { t: "投稿者", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => eleget0('div.style-scope.ytd-channel-name yt-formatted-string a', v)?.textContent?.trim() || "") } },
              { t: "再生多", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => { let n = eleget0('//yt-formatted-string[@id="video-info"]/span[@dir="auto" and @class="style-scope yt-formatted-string" and contains(text(),"回視聴")]', v)?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 1) } },
              { t: "再生少", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => { let n = eleget0('//yt-formatted-string[@id="video-info"]/span[@dir="auto" and @class="style-scope yt-formatted-string" and contains(text(),"回視聴")]', v)?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 0) } },
              { t: "古い", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => { let n = eleget0('//div[@id="metadata"]/div/yt-formatted-string/span[contains(text(),"前")]', v)?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }, 1) } },
              { t: "新しい", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => { let n = eleget0('//div[@id="metadata"]/div/yt-formatted-string/span[contains(text(),"前")]', v)?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }, 0) } },
              { t: "逆順", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => eleget0('//yt-formatted-string[@id="index"]', v)?.textContent, 1) } },
              { t: "元順", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => eleget0('//yt-formatted-string[@id="index"]', v)?.textContent, 0) } },
              { t: "時間長", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => Number(v?.querySelector('span.ytd-thumbnail-overlay-time-status-renderer')?.textContent?.replace(/[^0-9]/gmi, "")), 1) } },
              { t: "時間短", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => Number(v?.querySelector('span.ytd-thumbnail-overlay-time-status-renderer')?.textContent?.replace(/[^0-9]/gmi, ""))) } },
            ]

            //            cyclemenu(menu)//popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            cyclemenu(menu)
            /*            function cyclemenu(menu){
                          var sorttype = GF.yhmSortType % menu.length || 0
              elegeta('.yhmsortmenubox').forEach(e=>e?.remove())
              let menubox=    end(document.body,`<div class="yhmsortmenubox" style="all:initial; right:1em; bottom:6em; position:fixed; line-height:1em; z-index:999999; background-color:#33c; color:#fff; font-size:16px; padding:0.1em 0.5em; border-radius:1em; text-align:left;">A：ソート<br></div>`);
             setTimeout(()=>{
              (function removemenubox(){
                if(eleget0('.yhmsortmenubox:hover'))setTimeout(removemenubox,2000);else menubox?.remove();
              })()
               },5000)
                        addstyle.add(`.yhmbuttonstyle:hover{background-color:#fff4;} .yhmbuttonstyle { all:initial; cursor:pointer; display: inline-block; background-color:#0002; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;  font-weight:normal; color:#fff; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border-radius:1em; line-height:1.2em;}`);
                        menu.forEach((c, i) =>{
                          let e=end(menubox,`　<span class="yhmbuttonstyle">${c.t}</span>${ (i == sorttype ? "　←<br>" : "<br>")}`)
                          e.previousElementSibling.addEventListener("click",c.f)
                        })
                        menu[sorttype].f()
                        GF.yhmSortType = (++sorttype) % menu.length
                        }
            */
          }
          if (lh(/\/\/www.youtube.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/(?:search)/)) { // a::
            let menu = [
              { t: "メモ多", f: () => { sortdom(elegeta('ytd-item-section-renderer.style-scope.ytd-section-list-renderer'), v => (elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋、×メモは－評価
              { t: "時間短", f: () => { sortdom(elegeta('ytd-item-section-renderer.style-scope.ytd-section-list-renderer'), v => Number(v?.querySelector('span.ytd-thumbnail-overlay-time-status-renderer')?.textContent?.replace(/[^0-9]/gmi, ""))) } },
              { t: "タイトル", f: () => { sortdom(elegeta('ytd-item-section-renderer.style-scope.ytd-section-list-renderer:visible'), v => v?.querySelector('a#video-title.style-scope > yt-formatted-string')?.textContent?.trim()) } },
              { t: "古い", f: () => { sortdom(elegeta('ytd-item-section-renderer.style-scope.ytd-section-list-renderer'), (v) => { let n = v?.querySelector('div.ytd-video-meta-block span:nth-child(4).inline-metadata-item.style-scope.ytd-video-meta-block')?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }, 1) } },
              { t: "新しい", f: () => { sortdom(elegeta('ytd-item-section-renderer.style-scope.ytd-section-list-renderer'), (v) => { let n = v?.querySelector('div.ytd-video-meta-block span:nth-child(4).inline-metadata-item.style-scope.ytd-video-meta-block')?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }) } },
            ]
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == GF.yhmSortType % menu.length ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            //menu[GF.yhmSortType % menu.length]?.f()
            //GF.yhmSortType = (GF?.yhmSortType + 1) % menu.length
          }
          if (lh(/\/\/www.youtube.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/(?:videos|shorts|streams)|\/\/www.youtube.com\/hashtag\//)) { // a::
            $('ytd-rich-grid-row .style-scope.ytd-rich-grid-row').unwrap(); // 表示が乱れるのでよくわからない４列化行要素を消す
            //            var sorttype = GF.yhmSortType || 0
            let menu = [
              { t: "現状を反転", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v, i) => { return -i }) } },
              { t: "時間長", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { return Number(v?.querySelector('span.ytd-thumbnail-overlay-time-status-renderer')?.textContent?.replace(/[^0-9]/gmi, "")) }, 1) } },
              { t: "時間短", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { return Number(v?.querySelector('span.ytd-thumbnail-overlay-time-status-renderer')?.textContent?.replace(/[^0-9]/gmi, "")) }) } },
              { t: "メモ多", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { return (elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0) }, 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              { t: "タイトル", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => v?.querySelector('#video-title , a.shortsLockupViewModelHostOutsideMetadataEndpoint > span[class*="yt-core-attributed-string"]')?.textContent?.trim()) } },
              { t: "再生多", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { let n = v?.querySelector('#metadata-line>span:nth-child(3) , div > div.shortsLockupViewModelHostOutsideMetadataSubhead > span')?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 1) } },
              { t: "再生少", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { let n = v?.querySelector('#metadata-line>span:nth-child(3) , div > div.shortsLockupViewModelHostOutsideMetadataSubhead > span')?.textContent; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }) } },
              { t: "古い", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { let n = v?.querySelector('#metadata-line>span:nth-child(4)')?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }, 1) } },
              { t: "新しい", f: () => { sortdom(elegeta('ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer'), (v) => { let n = v?.querySelector('#metadata-line>span:nth-child(4)')?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }) } },
              //            { t: "", f: () => {  } },
            ]
            menu = menu.slice(0, lh(/\/\/www\.youtube\.com\/playlist\?list=/) ? 5 : 9)
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+4),0)}em;`);
            //popup2("A：ソート\n\n※YouTubeの仕様変更により現在「時間短」しかまともに動作しないようです\n\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+4),0)}em;`);
            //menu[sorttype].f()
            //GF.yhmSortType = (++sorttype) % menu.length
            //return;
          }
          if (/\/\/www.youtube.com\/results\?search_query=/.test(location.href)) { // 検索結果 // a::
            let menu = [
              //{ t: "メモ多", f: () => { sortdom(elegeta('#contents ytd-playlist-video-renderer'), v => elegeta('.yhmMyMemo', v).length, 1) } },
              //              { t: "メモ多", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => Number(elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              { t: "メモ多", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => Number(elegeta('.yhmMyMemoO:visible', v)?.length || 0) - (elegeta('.yhmMyMemoX:visible', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価 // 投稿者名には見えない要素が１つあるのでメモが2倍ついているのでvisible指定するが本当はしたくない
              { t: "時間長", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => Number(eleget0('span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer', v)?.textContent?.replace(/[^0-9]/gmi, "")), 1); } },
              { t: "時間短", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => Number(eleget0('span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer', v)?.textContent?.replace(/[^0-9]/gmi, ""))); } },
              { t: "タイトル", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => eleget0('//yt-formatted-string[@class="style-scope ytd-video-renderer"]', v)?.textContent?.trim()); } }, // shortsを含めない
              //{ t: "タイトル", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => eleget0('//yt-formatted-string[@class="style-scope ytd-video-renderer"]', v)?.textContent?.replace(/[\s　"”\[\]「」［］「」『』【】（）\(\)\:：・\-\/／]/gmi,"")?.trim()); } }, // shortsを含めない // 空白と記号を無視する版
              { t: "投稿者", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => eleget0('//a[@class="yt-simple-endpoint style-scope yt-formatted-string"]', v)?.textContent); } },
              { t: "再生多", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => { let n = eleget0('//div[@id="metadata-line"]/span[1]', v)?.textContent || "0"; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }, 1) } },
              { t: "再生少", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => { let n = eleget0('//div[@id="metadata-line"]/span[1]', v)?.textContent || "0"; return parseFloat(n) * (n?.match0("万") ? 10000 : n?.match0("億") ? 100000000 : 1) }) } },
              { t: "古い", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => { let n = eleget0('//div[@class="style-scope ytd-video-meta-block"]/div/span[2]', v)?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }, 1) } },
              { t: "新しい", f: () => { sortdom(elegeta('ytd-video-renderer.style-scope.ytd-item-section-renderer:visible'), v => { let n = eleget0('//div[@class="style-scope ytd-video-meta-block"]/div/span[2]', v)?.textContent; return parseFloat(n) * (n?.match0("時間") ? 0.0416 : n?.match0("分") ? 0.00025 : n?.match0("週間") ? 7 : n?.match0("か月") ? 31 : n?.match0("年") ? 365 : 1) }) } },
              { t: "動画多", f: () => { sortdom(elegeta('yt-lockup-view-model , ytd-video-renderer.style-scope.ytd-item-section-renderer,ytd-playlist-renderer:visible'), v => Number.parseInt(eleget0('yt-thumbnail-badge-view-model.yt-thumbnail-overlay-badge-view-model__badge > badge-shape[class*="yt-badge-shape--thumbnail-default"].yt-badge-shape--thumbnail-badge > div.yt-badge-shape__text', v)?.textContent || 0) * 10000000 || Number(eleget0('span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer', v)?.textContent?.replace(/[^0-9]/gmi, "")), 1) } },
            ]
            //var sorttype = (GF.yhmSortType || 0) % menu.length
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            //menu[sorttype].f()
            //GF.yhmSortType = (++sorttype) % menu.length
            //return
          }
        },
      }],
      //WhateverFirstAndEveryAPFunc: () => {if((/\/\/www.youtube.com\/results\?search_query=/.test(location.href)) || (/\/\/www.youtube.com\/channel\/[^\/]+\/videos/.test(location.href) || /\/\/www.youtube.com\/user\/[^\/]+\/videos/.test(location.href))) popup3(`A：ソート`,8,5000)},
      //      wholeHelp: [() => (/\/\/www.youtube.com\/results\?search_query=/.test(location.href)) || (/\/\/www.youtube.com\/channel\/[^\/]+\/videos/.test(location.href) || /\/\/www.youtube.com\/user\/[^\/]+\/videos/.test(location.href)), "　A：ソート"],
      wholeHelp: [() => (lh(/\/\/www\.youtube\.com\/playlist\?list=/) || /\/\/www.youtube.com\/results\?search_query=/.test(location.href) || lh(/\/\/www.youtube.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/(?:videos|shorts|streams)/)), "　A：ソート"],
    },
    {
      id: 'IHERB', // iherb::
      urlRE: '//.*.iherb.com/',
      title: 'div.product-title,div div#name , h1#name',
      //      box: 'div.product-cell-container,article.ga-product.product-grouping-refresh , section.product-summary-main',
      box: 'div.product-cell-container , section.product-summary-main',
      redoWhenRefocused: 1,
      //listTitleXP: '//div[@class="absolute-link-wrapper"]/a',
      //listTitleSearchXP: '//div[@class="absolute-link-wrapper"]/a[++title++]/../../..',
      //listTitleMemoSearchXP: '//div[@class="absolute-link-wrapper"]/a[++title++]|.//div[@itemprop="name" and @id="name" and ***]|.//div/div[@id="name" and ***]|//section[3]/div[@id="product-summary-header"]/div[3][***]',
      //listGen: 3,
      //observe: 1000,
      //runWhenUrlHasChanged:1,
      /*detailURLRE: /iherb.com\/pr\//,
      detailTitleXP: '//div[@itemprop="name" and @id="name"]',
      detailTitleSearchXP: '//div[@itemprop="name" and @id="name"][***]/../../../../..',*/
      forceTranslucentFunc: () => lh(/iherb.com\/pr\//),
      trim: 1,
      titleProcessFunc: (title) => { return title.replace(/<br>/gmi, "")?.trim() },
      keyFunc: [{
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: async (e) => autoPaging(`div.product-cell-container`, `a.pagination-next`),
      }],
      func: () => {
        setInterval(() => elegeta('div.collapse-item-header:not([data-done])').forEach(e => {
          e.click();
          e.dataset.done = 1;
        }), 999);
        lh(/\/c\/|\/search\?/) && elegeta('div.rating > a.stars:not([data-starpop])').forEach(e => {
          before(e, `<span style="color:#444" data-estars="${parseFloat(e?.title.match0(/^([0-9\.]+)/)) }">${e?.title.match0(/^([0-9\.]+)/||"0")+" "||""}</span>`);
          e.dataset.starpop = 1;
        })
        elegeta('//div[@itemprop="name" and @id="name"]').forEach(e => e.textContent = e.textContent.replace(/\&/gmi, "＆").replace(/\"/gmi, "”").trim()) // &はxpath/textで見逃す
        elegeta('//div[@class="absolute-link-wrapper"]/a').forEach(e => e.title = e.title.replace(/\&/gmi, "＆").replace(/\"/gmi, "”").trim())
        GM_addStyle('.product-column .product { height: auto; min-height:395px; }');
        lh('https://jp.iherb.com/pr/') && CUSTOMAUTOMEMORE.concat([/(メチルコバラミン[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(Methylcobalamin[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(アデノシルコバラミン[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(Adenosylcobalamin[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(ヒドロキソコバラミン[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(Hydroxocobalamin[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(シアノコバラミン[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(Cyanocobalamin[^\n]*\d+\s*(?:mg|mcg|μg))/mi, /(Cyanocobalamin[^\n]*\d+\s*mg)/mi, /(ubiquinol|ubiquinon|ユビキノン|ユビキノール)/mi, /(iron[^\n]*\d+\s*mg)/im, /(鉄[^\n]*\d+\s*mg)/im]).forEach(m => autoMemo2(eletext('section.content-wrapper , div.product-collapse.container-fluid'), m));
        //lh('https://jp.iherb.com/pr/') && [/(アデノシルコバラミン|Adenosylcobalamin|メチルコバラミン|cyanocobalamin|ヒドロキソコバラミン|Hydroxocobalamin|methylcobalamin|シアノコバラミン)/mi,/(ubiquinol|ubiquinon|ユビキノン|ユビキノール)/mi,/(iron[^\n]*\d+\s*mg)/im, /(鉄[^\n]*\d+\s*mg)/im].forEach(m => autoMemo2(eletext('section.content-wrapper'), m));
      }, // 商品ブロックの縦幅固定をやめる
    }, {
      id: 'YODOBASHI',
      urlRE: '//www.yodobashi.com/',
      //title:!lh(`/product`)?'div:last-of-type > ul > li:last-of-type > a , a > div.pName.fs14 > p:last-of-type , span.mr10':' h1[class*="pName js_variHeight"] > span , td#js_makerTD.maker',
      title: 'div.srcResultItem.spt_hznList.tileTypeList.js_productList.changeTile :is(div:last-of-type > ul > li:last-of-type > a , a > div.pName.fs14 > p:last-of-type , span.mr10) , div.pdTopContainer :is( h1[class*="pName js_variHeight"] > span , td#js_makerTD.maker )',
      box: `div.srcResultItem_block.pListBlock.hznBox.js_productBox.js_smpClickable.js_latestSalesOrderProduct.productListTile , div.pdTopContainer`,
      listHelpXP2: 'div.srcResultItem.spt_hznList.tileTypeList.js_productList.changeTile :is(div:last-of-type > ul > li:last-of-type > a , a > div.pName.fs14 > p:last-of-type , span.mr10) , div.pdTopContainer :is( h1[class*="pName js_variHeight"] > span , td#js_makerTD.maker )',
      forceTranslucentFunc: e => lh("https://www.yodobashi.com/product/1"),
      /*      listTitleXP: '//div[@class="pName fs14"]/p[2]|.//div[@class="product js_productName"]',
            listTitleSearchXP: '//div[@class="pName fs14"]/p[2][+++]/../../..|.//div[@class="product js_productName" and +++]/../../..|.//div[@class="product js_productName" and +++]/../../../../..',
            listTitleMemoSearchXP: '//div[@class="pName fs14"]/p[2][+++]|.//div[3]/h1[@id="products_maintitle"]/span[1][+++]|.//div[@class="product js_productName" and +++]|.//div[@class="product js_productName"][+++]',
            listGen: 4,
            listHelpXP: '//div[@class="pName fs14"]/p[2]/../../..',
            detailURLRE: /\/www.yodobashi.com\/product\//,
            detailTitleXP: '//div[3]/h1[@id="products_maintitle"]/span[1]',
            detailTitleSearchXP: '//div[3]/h1[@id="products_maintitle"]/span[1][+++]/../../../../..',*/
      hideListEvenDetail: 1,
      observe: 500,
      automemoURLRE: /^https:\/\/www.yodobashi.com\/product\//,
      automemoSearchFunc: () => { return eletext(['//div[@id="pinfo_productSummury"]', '//div[@id="productSet1Box"]', '//div[@class="specBox"]', '//h1[@class="pName js_variHeight"]/span[1]', `div.specBox`, `div#productSet1Box.pdContainer`]); },
      keyFunc: [{
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: async (e) => autoPaging(`div.pImg`, `a.next`, 50),
      }],
      automemoFunc: () => {
        var cat = elegeta('//div[@class="txtnav clearfix"]');
        if ((cat.some(e => /ヘルス＆ビューティー/.test(e.innerText)))) {
          [/(イソプロピルメチルフェノール)/m, /(IPMP)/m, /(塩化セチルピリジニウム|塩化セシルピリジニウム|セチルピリジニウム塩化物)/m, /(CPC)/m, /(塩化ベンザルコニウム)/m, /(BKC)/m, /(ラウロイルサルコシンナトリウム|ラウロイルサルコシンNa|ラウロイルサルコシンＮａ)/m, /(LSS)/m, /(塩化ベンゼトニウム)/m, /(BTC)/m, /(クロルヘキシジン)/m, /(CHG)/m, /(グリチルリチン酸アンモニウム)/m, /(イプシロン.アミノカプロン酸)/m, /(ε.ACA)/m, /(トラネキサム酸)/m, /(TXA)/m, /(グリチルリチン酸ジカリウム|グリチルリチン酸二カリウム|グリチルリチン酸２K|グリチルリチン酸2K|GK2)/mi, /(1\,?450\s?ppm)/m, /(高?濃?度?フッ化ナトリウム|高?濃?度?フッ素)/m, /(ハイドロオ?キシアパタイト)/m, /(リン酸化オリゴ糖カルシウム)/m, /(ＰＯｓ-Ｃａ|POs-Ca)/mi, /(カゼインホスホペプチド.非結晶性リン酸カルシウム|リカルデント)/m, /(CPP-ACP)/m, /(チモール)/m, /(サリチル酸メ?チ?ル?)/m, /(1\,8-シネオール)/m, /(トリクロサン)/m, /(トリクロカルバン)/m, /(オクトピロックス|オクトロピックス|ピロクトン.?オラミン)/m, /(Znピリチオン|ジンクピリチオン)/m, /(硫黄|イオウ)/m, /(アラントイン)/m, /(グリチルリチン酸アンモニウム)/m, /(ミコナゾール硝?酸?塩?)/m, /(クロラムフェニコール)/m, /(フラジオマイシン硫?酸?塩?)/m, /(ナイスタチン)/m, /(塩化亜鉛)/m, /(ポビドン.?ヨード)/m, /(ラウリルジアミノエチルグリシンナトリウム)/m, /(カキタンニン)/m, /(チャエキス)/m, /(ローズマリー)/m, /(カンゾウ)/m, /(クマザサ)/m, /(セージ)/m, /(シソエキス)/m, /(β?-?グリチルレチン酸?)/m, /(メントール)/m, /(ポリリン酸ナトリウム|ポリリン酸Na)/m, /(ヒノキチオール)/m, /(ティーツリー油オ?イ?ル?)/m, /(ティートゥリー油オ?イ?ル?)/m, /(フルスルチアミン|ベンフォチアミン|オキソアミヂン|オクトチアミン)/m].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /浄水器/.test(e.innerText)))) {
          //          [/([0-9０-９+＋].*?物質)/m, /(除?去?物質.{0,19}[0-9０-９+＋]+)/m, /([0-9０-９+＋]+?項目)/gm,/(交換.{1,19}[0-9.]+ヶ月)|(交換.{1,19}[0-9.]+年)|(取替.{1,19}[0-9.]+ヶ月)|(取替.{1,19}[0-9.]+年)/m].forEach(m => autoMemo(m)); //,/(除去物質数[\s\S]*\d+)/gm
          [/([0-9０-９+＋].*?物質)/m, /([0-9０-９+＋]+?項目)/gm, /(交換.{1,19}[0-9.]+ヶ月)|(交換.{1,19}[0-9.]+年)|(取替.{1,19}[0-9.]+ヶ月)|(取替.{1,19}[0-9.]+年)/m].forEach(m => autoMemo(m)); //,/(除去物質数[\s\S]*\d+)/gm
        }
        if ((cat.some(e => /電池/.test(e.innerText)))) {
          [/([\d\s\,]+mAh)/m, /([\d\s\,]+mAｈ)/m, /([\d\s\,]{2,9}回)/m].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /食器・グラス・カトラリー/.test(e.innerText)))) {
          [/(?:寸法|サイズ).*[:：](.+)$/m, /容量[:：](.+$)/m, /生産国[:：](.+$)/m, /(深さ.*[:：].+$)/m, /(\dつ穴)/m].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /シュレッダー/.test(e.innerText)))) {
          [/(細断サイズ[\s\S]{0,9}[0-9.]+×?[0-9.]*m?m?)/m, /ダストボックス(容量[\s\S]{0,9}[0-9.]+L)/m].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /食品/.test(e.innerText)))) {
          [/(食物繊維\D{0,9}[0-9.]+[gｇ])/m].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /圧力鍋/.test(e.innerText)))) {
          [/(低圧\D?\d+kpa)/mi, /(高圧\D?\d+kpa)/mi, /(圧力[\:：]\d+kPa)/mi].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /ヘッドセット/.test(e.innerText)))) {
          [/(感度.{1,20}dB)/mi, /(\-\s*[0-9０-９]+\s*dB)/mi].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /プランター/.test(e.innerText)))) {
          [/(容量[\s\S]{0,8}[0-9\.\,]+(?:L|Ｌ|リットル))/mi, /(容量\((?:L|Ｌ|リットル)\):[0-9\.\,]+)/mi].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /家電/.test(e.innerText)))) {
          [/(本体丸洗い[\s\S]{0,8}(?:可|不可))/mi, /(電源方式[\s\S]{0,8}充電・交流両式|充電式)/mi].forEach(m => autoMemo(m));
        }
        if ((cat.some(e => /入浴剤/.test(e.innerText))))[/\D(\d\dg)/m].forEach(m => autoMemo(m));
        if ((cat.some(e => /洗剤/.test(e.innerText))))[/(界面活性剤.{0,3}\d+[\%％])/m].forEach(m => autoMemo(m));
        if ((cat.some(e => /漢方|風邪|ヘルス＆ビューティー/.test(e.innerText))))[/(カッコン.{0,9}?[\d\.]+g)/m].forEach(m => autoMemo(m));
      },
      redoWhenReturned: 1,
    },
    {
      id: 'TSUGIMANGA',
      urlRE: '//tsugimanga.jp/',
      listTitleXP: '//div/div[@class="work__title"]',
      listTitleSearchXP: '//div/div[@class="work__title"][+++]/../..',
      listTitleMemoSearchXP: '//div/div[@class="work__title" and +++]',
      listGen: 5,
    },
    {
      id: 'NICOSEIGA_COMIC',
      urlRE: /\/\/manga.nicovideo.jp\/(?:watch|comic|manga)\//,
      title: 'div.main_title>h1,div.description>div.title>a,div.inner_content>div>h1>span.episode_title,div.description_block>div>div>div.title>a,strong.mg_title>a',
      box: 'div.main_title,li.episode_item,li.mg_item.item,#mg_recent_inner li,div.inner.cfix div div.title h1', //'',
      forceTranslucentFunc: e => e.closest('div.main_title,div.inner.cfix div div.title h1'),
      trim: 1,
      listHelpJQS: 'div.main_title,li.episode_item,article#detail.vertical,li.mg_item.item,#mg_recent_inner li',
      redoWhenReturned: 1,
      disableHelpUrlRE: /\/watch\//,
      func: () => { if (lh('https://manga.nicovideo.jp/comic/')) GM.addStyle(`.episode_item {float:none !important; display:inline-flex !important;}`) },
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
        key: 'a', // a::
        func: () => {
          if (!lh('/comic/')) return;
          elegeta('li.episode_item:not([data-orgorder])').forEach((v, i) => v.dataset.orgorder = i)
          $(".yfokgk").remove()
          let menu = [
            //{ t: "メモ総長順", f: () => { sortdom(elegeta('.NC-MediaObject.NC-VideoMediaObject.VideoContainer-item'), v => (elegeta('.yhmMyMemoO', v)?.reduce((a, b) => b?.textContent?.length + a, 0) || 0) - (elegeta('.yhmMyMemoX', v).reduce((a, b) => b?.textContent?.length + a, 0) || 0), 1) } }, // ○メモとチャプターメモは＋文字数、×メモは－文字数評価
            { t: "再生＋コメント多", f: () => { sortdom(elegeta('li.episode_item'), v => Number(eleget0('div.counter', v)?.textContent?.match0(/再生\:(\d+)/) || 0) + Number(eleget0('div.counter', v)?.textContent?.match0(/コメント\:(\d+)/) || 0) * 100, 1) } },
            {
              t: "再生＋コメント多2",
              f: () => {
                sortdom(elegeta('li.episode_item'), (v, i) => {
                  v.dataset.giantkilling = Number(v.dataset.orgorder) - i;
                  end(v, `<span class="yfokgk" style="color:#499">${v.dataset.giantkilling>0?"+":""}${v.dataset.giantkilling}</span>`);
                  return Number(v.dataset.orgorder) - i
                }, 1)
              }
            }, // 再生数とコメント数は古い話ほど多いのが普通なのでその順からズレた順位＝相対人気順で並べる
            { t: "メモ総長順", f: () => { sortdom(elegeta('li.episode_item'), v => (elegeta('.yhmMyMemoO', v)?.reduce((a, b) => b?.textContent?.length + a, 0) || 0) - (elegeta('.yhmMyMemoX', v).reduce((a, b) => b?.textContent?.length + a, 0) || 0), 1) } }, // ○メモとチャプターメモは＋文字数、×メモは－文字数評価
            { t: "再生多", f: () => { sortdom(elegeta('li.episode_item'), v => Number(eleget0('div.counter', v)?.textContent?.match0(/再生\:(\d+)/) || 0), 1) } },
            { t: "再生少", f: () => { sortdom(elegeta('li.episode_item'), v => Number(eleget0('div.counter', v)?.textContent?.match0(/再生\:(\d+)/) || 0), 0) } },
            { t: "コメント多", f: () => { sortdom(elegeta('li.episode_item'), v => Number(eleget0('div.counter', v)?.textContent?.match0(/コメント\:(\d+)/) || 0), 1) } },
            { t: "コメント少", f: () => { sortdom(elegeta('li.episode_item'), v => Number(eleget0('div.counter', v)?.textContent?.match0(/コメント\:(\d+)/) || 0), 0) } },
            { t: "タイトル順", f: () => { sortdom(elegeta('li.episode_item'), v => (eleget0('.title', v)?.textContent), 0) } },
            { t: "url降順", f: () => { sortdom(elegeta('li.episode_item'), v => (eleget0('a', v)?.href), 1) } },
            { t: "url昇順", f: () => { sortdom(elegeta('li.episode_item'), v => (eleget0('a', v)?.href), 0) } },
          ]
          cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == GF.yhmSortType ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[GF.yhmSortType].f()
          //GF.yhmSortType = ((GF?.yhmSortType + 1) % menu.length)
        },
      }],
    },
    {
      id: 'NICOSEIGA',
      urlRE: '//manga.nicovideo.jp/illust/ranking/point/',
      listGen: 5,
      // 項目名：投稿者名
      listTitleXP: '//span[@class="rank_txt_user"]/a',
      listTitleSearchXP: '//span[@class="rank_txt_user"]/a[+++]/../../../../../..',
      listTitleMemoSearchXP: '//span[@class="rank_txt_user"]/a[+++]',
      listHelpXP: '//tr/td[contains(@class,"rank_block_right rank_no_")]',
    },
    {
      id: 'NICOSEIGA',
      urlRE: '//manga.nicovideo.jp/tag/|//manga.nicovideo.jp/seiga/|//manga.nicovideo.jp/user/illust/|//manga.nicovideo.jp/illust/|//manga.nicovideo.jp|//manga.nicovideo.jp/my/personalize',
      listGen: 5,
      detailURLRE: /\/\/manga.nicovideo.jp\/seiga\/|\/\/manga.nicovideo.jp\/user\/illust\//,
      // 項目名：投稿者名
      listTitleXP: '//li[@class="user"]|.//span[@class="rank_txt_user"]/a|.//span[@class="popular_illust_block__item__info--nickname"]|.//p[@class="info_source"]/a[@class="user_name"]',
      listTitleSearchXP: '//li[@class="user" and +++]/../../..|.//span[@class="rank_txt_user"]/a[+++]/../../../..|.//span[@class="popular_illust_block__item__info--nickname" and +++]/../../..|.//p[@class="info_source"]/a[@class="user_name" and +++]/../../..',
      hideListEvenDetail: 1,
      listTitleMemoSearchXP: '//li[@class="user" and +++]/..|//ul/li[@class="user_name"]/strong[+++]/..|.//span[@class="nickname" and +++]/..|.//span[@class="rank_txt_user"]/a[+++]|.//span[@class="popular_illust_block__item__info--nickname" and +++]|.//p[@class="info_source"]/a[@class="user_name" and +++]',
      listHelpXP: '//li[contains(@class,"list_item list_no_trim2")]/a|.//tbody/tr/td[contains(@class,"rank_list_block rank_no_")]|.//div[@class="popular_illust_block__item"]|.//ul[@class="item_list"]/li[@class="list_item  middle"]/a|.//div/ul[@class="item_list"]/li[@class="list_item middle"]/a|.//p[@class="info_source"]/a[@class="user_name"]/../../..',
      detailTitleXP: '//ul/li[@class="user_name"]/strong|//span[@class="nickname"]',
      detailTitleSearchXP: '//ul/li[@class="user_name"]/strong[+++]/../../../../../../../../../../../..|//span[@class="nickname" and +++]/../../../../../../..',
    },
    {
      id: 'KAKAKU',
      urlRE: '//kakaku.com/search_results/',
      listTitleXP: '//p[@class="p-item_name s-biggerlinkHover_underline"]',
      listTitleSearchXP: '//p[@class="p-item_name s-biggerlinkHover_underline"][+++]/../../../../..',
      listTitleMemoSearchXP: '//p[@class="p-item_name s-biggerlinkHover_underline"][+++]',
      listGen: 5,
    },
    {
      id: 'KAKAKU',
      urlRE: '//kakaku.com/specsearch|//kakaku.com/item/',
      listTitleXP: '//td[@class="textL"]/strong/a[1]',
      listTitleSearchXP: '//td[@class="textL"]/strong/a[1 and +++]/../../..',
      listTitleMemoSearchXP: '//td[@class="textL"]/strong/a[1 and +++]|//div[@class="boxL"]/h2[@itemprop="name" and +++]/..',
      listGen: 4,
      detailURLRE: /\/\/kakaku.com\/item\//,
      detailTitleXP: '//div[@class="boxL"]/h2[@itemprop="name"]',
      detailTitleSearchXP: '//div[@class="boxL"]/h2[@itemprop="name" and +++]/../../../..',
    },
    {
      id: 'HELLOWORK',
      urlRE: '//www.hellowork.mhlw.go.jp/kensaku/',
      listTitleXP: '//td[@class="fb in_width_9em" and text()="求人番号"]/following-sibling::td/div',
      listTitleSearchXP: '//td[@class="fb in_width_9em" and text()="求人番号"]/following-sibling::td/div[+++]/../../../../../../../../..|//div[@id="ID_kjNo"]',
      listTitleMemoSearchXP: '//td[@class="fb in_width_9em" and text()="求人番号"]/following-sibling::td/div[+++]/../../../..|//div[@id="ID_kjNo" and +++]/../../..',
      listHelpXP: '//td[@class="fb in_width_9em" and text()="求人番号"]/following-sibling::td/div/../../../../../../../../..',
      listGen: 8,
      detailURLRE: /Detail/i,
      detailTitleXP: '//div[@id="ID_kjNo"]',
      detailTitleSearchXP: '//div[@id="ID_kjNo" and +++]/../../../../..',
      func: () => { if (location.href.match(/detail/i)) { GM_addStyle('table.normal tr th, table.normal tr td { padding: 0.2em 1em;}') } else { GM_addStyle('table.kyujin th, table.kyujin td { padding: 0.5em 0.5em; } table.normal tr th, table.normal tr td { border-top: 1px solid #125939; padding: 0.5em 10px; text-align: left; } .mb03 { margin-bottom: 0em; }'); } },
    },
    {
      id: 'USERBENCHMARK',
      urlRE: `https:\/\/www\.cpubenchmark\.net\/cpu\.php`
    },
    {
      id: 'USERBENCHMARK',
      urlRE: '.*?.userbenchmark.com',
      listTitleXP: '//span/a[@class="nodec"]',
      listTitleSearchXP: '//span/a[@class="nodec" and +++]/../../../../..',
      listTitleMemoSearchXP: '//span/a[@class="nodec" and +++]|//h1[@class="pg-head-title"]/a[+++]',
      listGen: 5,
      observe: 1000,
      detailURLRE: /\/\/.*?.userbenchmark.com\/SpeedTest\/|\/\/.*?.userbenchmark.com\/.*?\/Rating\//i,
      detailTitleXP: '//h1[@class="pg-head-title"]/a',
      detailTitleSearchXP: '//h1[@class="pg-head-title"]/a[+++]/../../..',
      automemoURLRE: /\/\/.*?.userbenchmark.com\/SpeedTest\/|\/\/.*?.userbenchmark.com\/.*?\/Rating\//i,
      automemoSearchFunc: () => { return eletext('//h3[@class="pg-head-toption"]/span[@class="pg-head-toption-post"]') + "\n"; },
      automemoFunc: () => { autoMemo(/(.*)/); },
    },
    {
      urlRE: '//www.sukima.me/(?!bv|login)',
      id: 'SUKIMA',
      listTitleXP: '//div[@class="row ma-0 flex-nowrap align-center title-name-content"]/div',
      listTitleSearchXP: '//div[@class="row ma-0 flex-nowrap align-center title-name-content"]/div[***]/../../../..',
      listTitleMemoSearchXP: '//div[@class="row ma-0 flex-nowrap align-center title-name-content"]/div[***]',
      listHelpXP: '//div[@class="row ma-0 flex-nowrap align-center title-name-content"]/div/../../../..',
      listGen: 5,
      titleProcessFunc: title => { return title.replace(/\n\s*?\n\s*?|（?分冊版）?.*|【期間限定　無料お試し版】.*|[0-9０-９]*?巻.*/g, "").trim() },
      observe: 1500,
      func: () => {
        document.title = document.title.replace(/(^\[.*\])(.*)/, "$2$1");
      } // ページタイトルの「[全話無料]」等の接頭辞を末尾に移動
    },
    {
      urlRE: '//www.mangaz.com/',
      //      id: 'MANGAZ', // SUKIMAと登録内容を共通にしない
      id: 'SUKIMA', // SUKIMAと登録内容を共通にする
      title: 'div.listBoxDetail>h4>a,p.author,div.header h2,ul.seriesAuthor li a,span.sort-word' + `,ul.detailAuthor li span a`,
      box: '.itemList>li,div.seriesMain div.header,div.sort-inner' + `,ul.detailAuthor`,
      forceTranslucentFunc: e => e.closest('div.seriesMain div.header,div.sort-inner' + `,ul.detailAuthor`),
      observeFunc: e => e?.nodetype === 1 && e?.matches('.itemList>li,div.seriesMain div.header,div.sort-inner'),
      listHelpJPS: '.itemList>li,div.seriesMain div.header,div.sort-inner',
      listHelpXP2: 'p.author,ul.seriesAuthor li a',
      XP2name: '作者名　',
      wholeHelp: [() => 1, "　Shift+F：作品検索　A：ソート"],
      keyFunc: [{
        key: 'Shift+F', // Shift+F::キーワード検索
        func: () => { searchWithHistory("MANGAZ", "マンガ図書館Z", 'https://www.mangaz.com/title/index?category=&query=***&sort=&search=input', "") },
      }, {
        key: 'a', // a::ソート
        func: () => {
          var sorttype = GF.yhmSortType || 0;
          //          $('.yhmSortType').remove(), $(document.body).append(`<span class="yhmSortType" id="${++sorttype%2}"></span>`)
          GF.yhmSortType = ++sorttype % 2
          popup2("A：ソート\n" + (["タイトル", "著者名"].map((c, i) => "　" + c + (i + 1 == sorttype ? "　←\n" : "\n")).join("")), 6, "min-width:6em;")
          sorttype == 1 && sortdom(elegeta('.itemList>li'), v => eleget0('div.listBoxDetail>h4>a', v)?.textContent)
          sorttype == 2 && sortdom(elegeta('.itemList>li'), v => eleget0('.listBoxDetail>p', v)?.textContent)
        }
      }],
      titleProcessFunc: (title) => { return title.replace(/\s[0-9０-９]+巻?$|【.*?】|全.*?巻|第\d*話/gmi, "").trim() },
      observe: 500,
      redoWhenRefocused: 1,
      func: () => {
        document.title = document.title.replace(/(^【.*】)(.*)/, "$2$1"); // ページタイトルの「[全話無料]」等の接頭辞を末尾に移動
        // 作品一覧の著者名をクリックで検索できるようにする
        elegeta('p.author:not([data-linked])').forEach((e, i, a) => {
          let author = e.textContent.trim().replace(/,/gm, " ").replace(/\s+/gm, " ")
          let url = 'https://www.mangaz.com/title/index?category=&query=***&sort=&search=input'.replace("***", encodeURI(author))
          e.dataset.linked = url
          e.style.cursor = "pointer"
          e.title = `クリックで「${author}」で作品検索をします\n${url}`
          e.addEventListener("click", v => window.open(v.target.dataset.linked, "", "noreferrer"))
        })
      }
    },
    {
      id: 'PICCOMA',
      urlRE: '//piccoma.com/',
      listTitleXP: '//div[@class="PCM-productCoverImage_title"]/span|.//div[@class="PCM-rankingProduct_title"]/p|.//p[@class="PCM-productCoverImage_title"]/span',
      listTitleSearchXP: '//div[@class="PCM-productCoverImage_title"]/span[+++]/ancestor::li[contains(@class,"PCM-slotProducts_list")]|.//div[@class="PCM-rankingProduct_tdata"]/div/p[+++]/ancestor::li[contains(@class,"PCM-slotProducts_list")]|.//p[@class="PCM-productCoverImage_title"]/span[+++]/ancestor::li[contains(@class,"PCM-slotProducts_list")]',
      listTitleMemoSearchXP: '//div[@class="PCM-productCoverImage_title"]/span[+++]', // 実質表示されない
      listGen: 7,
      observe: 3000,
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: '//www.cmoa.jp/freecontents/',
      listTitleXP: '//p[@class="titile_name"]/a',
      listTitleSearchXP: '//p[@class="titile_name"]/a[+++]/../../../..',
      listTitleMemoSearchXP: '//p[@class="titile_name"]/a[+++]',
      listGen: 4,
      redoWhenReturned: 1,
    },
    {
      id: 'ja.aliexpress.com',
      urlRE: '//ja.aliexpress.com/',
      listTitleXP: '//h1[@class="_3eC3x"]/../../..',
      listTitleXP2: '//a[@class="ox0KZ"]',
      listHelpXP: '//h1[@class="_3eC3x"]/../../..',
      XP2name: 'セラー名　',
      XP2memo: 1,
      listTitleSearchXP: '//a[**url**]/*/*/h1[@class="_3eC3x"]/../../..|//a[@class="ox0KZ"][+++]/../../..',
      listTitleMemoSearchXP: '//a[**url**]/*/*/h1[@class="_3eC3x"]|//a[@class="ox0KZ"][+++]',
      listGen: 3,
      useURL: 1,
      func: () => { // 商品名を全行表示する
        elegeta('//div[@class="product-container"]/div[2]/a/div[2]/div[1]/h1').forEach(e => {
          e.style.whiteSpace = "";
          e.style.height = "auto";
          e.style.whiteSpace = "normal";
          e.parentNode.style.display = "block"
        });
      },
    },
    {
      id: 'GREASYFORK',
      urlRE: '//greasyfork.org/.*?/scripts',
      listTitleXP: `//a[@class="script-link"]|.//a[@class="script-link"]/font/font`, //'//article/h2/a',
      listTitleSearchXP: `//a[@class="script-link"][+++]/ancestor::li|.//a[@class="script-link"]/font/font[+++]/ancestor::li`, //'//article/h2/a[+++]/../../..|//article/h2/a/font/font[+++]/../../../../..',
      listTitleMemoSearchXP: `//a[@class="script-link"][+++]|.//a[@class="script-link"]/font/font[+++]/../..`, //'//article/h2/a[+++]|//article/h2/a/font/font[+++]/../..',
      listGen: 7,
      // func:(n)=>{elegeta('//h2/a[@class="script-link"]',n).forEach(e=>{$(e.parentNode.parentNode.parentNode).append(' <a style="float:right;margin:0 0 0 1em;" href="'+e.href+'/stats?period=all">統計</a>').append(' <a style="float:right;margin:0 0 0 1em;" href="'+e.href+'/feedback">フィードバック</a>')})  },
    },
    {
      id: 'JMTY',
      urlRE: '//jmty.jp/',
      listTitleXP: '//div[@class="p-item-title"]/a',
      listTitleSearchXP: '//div[@class="p-item-title"]/a[++url++]/../../..',
      listTitleMemoSearchXP: '//div[@class="p-item-title"]/a[++url++]',
      listGen: 5,
      useURL: 1,
    },
    {
      id: 'EBAY',
      urlRE: 'ebay.com/',
      listTitleXPIgnoreNotExist: 1,
      listTitleXP: '//div[@class="s-item__title"]/span[@role="heading"]/../..',
      listTitleSearchXP: '//div[@class="s-item__title"]/span[@role="heading"]/../..[**url**]/../../..',
      listTitleMemoSearchXP: '//div[@class="s-item__title"]/span[@role="heading"]/../..[**url**]|//h1[@class="x-item-title__mainTitle"]/span[1][**url**]/..',
      listGen: 5,
      detailTitleXP: '//h1[@class="x-item-title__mainTitle"]/span[1]',
      detailTitleSearchXP: '//h1[@class="x-item-title__mainTitle"]/span[1][**url**]/../../../../..',
      XP2memo: 1,
      XP2name: 'セラー名　',
      listGen: 6,
      useURL: 1,
      funcOnlyFirst: () => {
        var e = eleget0('//link[@rel="canonical"]');
        var t = eleget0('//h1[@class="x-item-title__mainTitle"]/span[1]|//h1[@itemprop="name" and @id="itemTitle"]')
        if (e && t) t.setAttribute("href", e.href)
      },
      detailURLRE: /www.ebay.com\/itm\//,
      listHelpJQS: 'li.s-item',
      helpInBlock: 1,
      maxpriceXP: '//div/input[@aria-label="Maximum Value"]',
    }, {
      id: '2CHTHREADLIST',
      urlRE: /\/\/.*\.5ch\.net\/[^\/]*\/(\?v=pc)?$/,
      listTitleXP: '//td/a',
      listTitleSearchXP: '//table[@id="thread-list"]/tbody/tr/td/a[+++]/../..',
      listTitleMemoSearchXP: '//tr/td/a[+++]',
      listTitleMemoSearchXPSameGen: 1,
      listGen: 6,
      delay: 1000,
      observe: 500, // 並べ替え時に必要
      redoWhenReturned: 1,
      keyFunc: [{
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
        //        func: () => { searchWithHistory("REFIND2CH", "re.Find2ch", 'https://refind2ch.org/search?q=***&sort=rate', " OR ") },
      }],
    }, {
      urlRE: 'https://find.5ch.net/search',
      id: '2CHTHREADLIST',
      title: 'div.list_line_link_title,div.list_line_info_container.list_line_info_container-board>a',
      box: 'div.list_line',
      titleProcessFunc: v => v.replace(/\(\d+\)$/, "").trim(),
      titleSubstr: 1,
      redoWhenReturned: 1,
      XP2name: '板名　',
      listHelpXP2: '//div[@class="list_line_info_container list_line_info_container-board"]/a',
      trim: 1,
      keyFunc: [{
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
      }, {
        key: 'a', // a::
        func: () => {
          let menu = [
            { t: "勢い強", f: () => sortdom(elegeta('div.list_line'), v => { return (eleget0('//div/div[3]', v)?.textContent) }, 1) },
            { t: "メモ多", f: () => { sortdom(elegeta('div.list_line'), v => Number(elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
            { t: "レス多", f: () => sortdom(elegeta('div.list_line'), v => { return (eleget0('//a/div[@class="list_line_link_title"]', v)?.textContent?.match0(/\(\d+\)$/)) }, 1) },
            { t: "タイトル", f: () => sortdom(elegeta('div.list_line'), v => { return (eleget0('//a/div[@class="list_line_link_title"]', v)?.textContent) }, 0) },
            { t: "板名", f: () => sortdom(elegeta('div.list_line'), v => { return (eleget0('div.list_line_info_container-board>a', v)?.textContent?.trim()) }, 0) },
            { t: "新しい", f: () => sortdom(elegeta('div.list_line'), v => { return (eleget0('//div[@class="list_line_info_container"]', v)?.textContent) }, 1) },
          ]
          cyclemenu(menu) //popup2("a：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == (GF?.yhmSortType % menu.length) ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[GF?.yhmSortType % menu.length].f()
          //GF.yhmSortType = (GF?.yhmSortType || 0) + 1
        }
      }],
      wholeHelp: [() => 1, "　A：ソート"], //　Shift+F：スレッド検索
    }, { // 5chスレッド内 5ch::
      id: 'new5ch',
      urlRE: () => lh('.5ch.net/test/read.cgi/') && !lh("/c/"),
      //      title: 'details.post-header,.uid',
      title: '.post-header,.uid',
      listTitleXP2: '.uid',
      //      funcQ: e => { e?.closest('article.post')?.textContent?.match(/https:\/\/i\.imgur\.com\/[\w\.]+/gi)?.forEach(v => addNG(v, "dispall")) },
      funcQ: e => { e?.closest('div.post')?.textContent?.match(/https:\/\/i\.imgur\.com\/[\w\.]+/gi)?.forEach(v => addNG(v, "dispall")) },
      //funcQ: e => e?.textContent?.match(/https:\/\/i\.imgur\.com\/[\w\.]+/gi)?.forEach(v => addNG(v)),
      XP2name: `ID　`,
      //box: 'article.post',
      box: 'div.post',
      memoStyle: "float:right;",
      memoOnRead: v => v?.concat((pref('5CH : SearchMyMemo') || [])?.map(v => { v.t = v.t.replace(/(\d\d\d\d\/\d\d\/\d\d\(.\))\s*(\d\d\:\d\d\:\d\d)/, "$1 $2").replace(/\>\>\d+/gm, ""); return v; })), // 旧5chで付けたメモも一方通行的に取り込む　それらは旧5chでしか削除できない
      //      delay: 5000+(Math.min(elegeta('article.post')?.length,1000)**2)/200,
      funcOnlyFirst: () => {
        if (eleget0('//span[@class="postid" and starts-with(text(),"0")]')) elegeta('.postid').forEach(e => e.textContent = Number(e.textContent))
        //if (IN5CH_REMOVE_AKABAN) elegeta('.post-header>summary>span:has( form)').filter(e => e?.textContent.indexOf("垢版") != -1).forEach(e => e?.remove())
        //if (IN5CH_REMOVE_AKABAN) elegeta('.post-header>summary>span>form').filter(e => e?.textContent.indexOf("垢版") != -1).forEach(e => e?.remove())
        //div.post-header > div > span:has( form)
        if (IN5CH_REMOVE_AKABAN) elegeta('.post-header>div>span:has( form)').filter(e => e?.textContent.indexOf("垢版") != -1).forEach(e => e?.remove())
        //if (IN5CH_REMOVE_AKABAN) elegeta('.post-header>summary>span').filter(e => e?.textContent == "垢版").forEach(e => e?.remove())
      }, // 0001みたいなゼロサプレスを削除
      redoWhenReturned: 1,
      redoWhenRefocused: 1,
      memoFunc: e => e?.parentNode?.querySelector(".post-content")?.previousElementSibling || e,
      hideSelectedWord: 1,
      delay: 333,
      selectedHelp: { help: [KEYHIDE + "：NGワードに追加"] }, //, multi: "複数行に渡る文字列は NG に入れられません" },
      listTitleSearchFunc: (title) => { // レス中キーワードNG
        let resHit = [];
        if (typeof title === "string" && /\D/m.test(title)) { // textContentでサーチする
          for (let res of elegeta('div.post')) { // レス本文
            if (res.textContent.indexOf(title) !== -1) resHit.push(res.closest("div.post"));
          }
          /*          for (let res of elegeta('.uid')) { // ID
                      if (res.textContent.indexOf(title) !== -1) resHit.push(res.closest("article.post"));
                    }*/
        }
        return resHit;
      },
      keyFunc: [{
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        //        func: () => { searchWithHistory("find5ch", "find5ch", ['https://find.5ch.net/search?q=***',`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`], " OR ") },
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
        //        func: () => { searchWithHistory("REFIND2CH", "re.Find2ch", 'https://refind2ch.org/search?q=***&sort=rate', " OR ") },
      }, {
        key: 'a', // a::
        func: () => {
          let menu = [
            { t: "引用", f: () => sortdom(elegeta('.post'), v => { return -(v.querySelectorAll('.allpopup').length) }) },
            { t: "リンク", f: () => sortdom(elegeta('.post'), v => { return Number(v?.textContent?.match(/ttps?:\/\//gmi)?.length) * 10000 - (v.id) || 0 }, 1) },
            { t: "元", f: () => sortdom(elegeta('.post'), v => { return (v.id) }) },
          ]
          cyclemenu(menu) //popup2("a：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == (GF?.yhmSortType % menu.length) ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[GF?.yhmSortType % menu.length].f()
          //GF.yhmSortType = (GF?.yhmSortType || 0) + 1
        }
      }],
      wholeHelp: [() => 1, "　A：ソート"], //　Shift+F：スレッド検索
    }, {
      id: `${/shitaraba\.net/.test(location.href)?"SHITARABA":"5CH"}`, //'5CH',
      urlRE: '.5ch.net/test/read.cgi/|.shitaraba.net/bbs/read.cgi/|.shitaraba.net/bbs/read_archive.cgi/',
      //      memoOnRead: v => v?.concat((pref('new5ch : SearchMyMemo') || [])?.map(v => { v.t = v.t.replace(/(\d\d\d\d\/\d\d\/\d\d\(.\))\s*(\d\d\:\d\d\:\d\d)/, "$1$2"); return v; })), // 新5chで付けたメモも一方通行的に取り込む　それらは新5chでしか削除できない
      memoOnRead: v => v?.concat((pref('new5ch : SearchMyMemo') || [])?.map(v => { v.t = v.t.replace(/\s/g, ""); return v; })), // 新5chで付けたメモも一方通行的に取り込む　それらは新5chでしか削除できない
      listTitleXP2: '//span[@class="uid"]',
      listTitleXPIgnoreNotExist: 1,
      memoStyle: 'float:right;', //' margin-bottom:1px;',
      forceRunIffunc: () => { return /\.shitaraba\.net\/bbs\/read\.cgi\//.test(location.href) || eleget0('.thread > dd:nth-child(2)') },
      hideSelectedWord: 1,
      selectedHelp: { help: [KEYHIDE + "：NGワードに追加"] }, //, multi: "複数行に渡る文字列は NG に入れられません" },
      titleProcessFunc: (title) => { return /^\d{1,4}.+\d\d\d\d\/\d\d\/\d\d\(.\)\s..\:/.test(title.replace(/\n/gm, "").trim()) ? title?.replace(/⋮/g, "").replace(/\>\>.*$|\[\d*\]$/, "").replace(/\n|　|\s|：/g, "").trim() : title?.replace(/⋮/g, "").replace(/\n/gm, "").replace(/\>\>.*$|\[\d*\]$/, "").trim() },
      XP2name: 'ID　',
      listTitleXP: '//div[@class="meta"]', // 項目名はレス番～IDまでの一連のdiv.meta
      listTitleSearchXP: '//div[@class="meta"][**alt**]/..|//span[@class="escaped"][***]/../..',
      listTitleMemoSearchXP: '//div[@class="meta"][**alt**]/span[@class="date"]',
      listHelpXP: '//div[@class="post"]',
      listGen: 6,
      searchAllowLength: 1,
      delay: 100, //delayAutoWeighting: 0.6, // 5chサムネイル表示他のhNukiURLHokan()より後でないとメモを消せなくなる
      keyFunc: [{
        key: 'Shift+F', // Shift+F::refind2chでキーワード検索
        func: () => { searchWithHistory("find5ch,掲示板横断検索,re.find2ch,ff5ch", "find5ch,掲示板横断検索,re.find2ch,ff5ch", [`https://zzzsearch.com/bbs/#gsc.q=%22***%22&gsc.sort=date`, `https://refind2ch.org/search?q=***&sort=rate`, 'https://find.5ch.net/search?q=***', `https://ff5ch.syoboi.jp/?q=***`], " OR ") },
      }, {
        key: 'a', // a::
        func: () => {
          var sorttype = Number($('.yhmSortType')?.attr("id") || 0);
          $('.yhmSortType').remove();
          $(document.body).append(`<span class="yhmSortType" id="${++sorttype}"></span>`)
          popup2("A：ソート\n" + (["引用", "リンク", "古い順"].map((c, i) => "　" + c + (i + 1 == sorttype ? "　←\n" : "\n")).join("")), 6, "min-width:6em;")
          $(".thread>br,#thread-body>br").remove()
          switch (sorttype) {
            case 1:
              domsort(eleget0('.thread,#thread-body'), elegeta('.post'), v => { return -(v.querySelectorAll('.allpopup').length) }, 1)
              break;
            case 2:
              domsort(eleget0('.thread,#thread-body'), elegeta('.post'), v => { return Number((v?.textContent?.match(/ttps?:\/\//gmi)?.length)) && -1 - Number((v.querySelectorAll('.allpopup').length)) || 0 }, 1)
              break;
            case 3:
              domsort(eleget0('.thread,#thread-body'), elegeta('.post'), v => { return (v.id) }, 1)
              $('.yhmSortType').remove();
              break;
          }
          $('.post').after("<br>")
        }
      }],
      wholeHelp: [() => 1, "　A：ソート"],
      listTitleSearchFunc: (title) => { // レス中キーワードNG
        let resHit = [];
        if (typeof title === "string" && /\D/m.test(title)) { // textContentでサーチする
          for (let res of elegeta('.message')) { // レス本文
            if (res.textContent.indexOf(title) !== -1) resHit.push(res.parentNode);
          }
          for (let res of elegeta('.uid')) { // ID
            if (res.textContent.indexOf(title) !== -1) resHit.push(res.parentNode.parentNode);
          }
        }
        return resHit;
      },
      funcQ: function() {
        setTimeout(() => {
          $('div.post:hidden').next("br").css("display", "none");
          $('div.post:visible').next("br:hidden").css("display", "block");
        }, 200);
      }, //余計な改行を詰める
      funcB: () => SITE.funcQ(),
      funcOnlyFirst: () => {
        GM_addStyle('.uid:hover{background:#ddeeffc0; border: 0px solid #ddeeffc0; color: #000000; text-shadow: 0 0 4px #ddeeffc0; box-shadow: inset 0 0 6px #ddeeffc0, 0 0 6px #ddeeffc0; }')
        // 旧表示なら対応するために加工
        if (/\.shitaraba\.net\/bbs\/read\.cgi\/|\.shitaraba\.net\/bbs\/read_archive.cgi\//.test(location.href)) $('dl.rep-comment:hidden').remove(); // したらばでは本家の>>1等のアンカーの中に見えないHTMLのコピーがありQ等がそれに反応してしまうので消す
        if (/\.5ch\.net\/test\/read\.cgi\/|\.shitaraba\.net\/bbs\/read\.cgi\/|\.shitaraba\.net\/bbs\/read_archive.cgi\//.test(location.href) && eleget0("//div/dl/dt|//body/dl/dt")) {
          if (/\.shitaraba\.net\/bbs\/read/.test(location.href) && eleget0("//div/dl/dt|//body/dl/dt")) { $('dl>br').remove() }
          elegeta('.thread dd').forEach(e => elegeta('br', e)?.pop()?.remove()) // 本文末尾の空改行をtrim
          var res1 = elegeta("//div/dl/dt|//body/dl/dt").slice(0, 1001)
          var res2 = elegeta("//div/dl/dd|//body/dl/dd").slice(0, 1001)
          if (res1.length && res1.length == res2.length) {
            GM_addStyle('div.post{border-width: 1px; display: inline-block; border-style: none solid solid none; border-color: #ddd; background-color: #efefef; margin-bottom: 8px; padding: 8px;}div.meta { margin: 0 0 0.33em; } .message { font-size: 17px; color: #333; padding: 2px 0 10px; overflow-wrap: break-word; }')
            GM_addStyle('div.post2{background-color:#efefef; display:inline-block; padding:1em; margin:0; box-shadow: 1px 1px 2px #cccccc;} div.meta{margin:0 0 0.33em;} ') // line-height:1.2em;
            var e = eleget0('//div/dl[@class="thread"]/../../../..|//div[@id="thread-body-wrapper"]/..');
            if (e) e.style.backgroundColor = "#f2f3f7";
            var e = eleget0('//body/div/span[@style="float:left;"]');
            if (e) e.style.float = "none";
            res1.forEach((e, i) => {
              var res1t = e.textContent; // innerTextは遅い
              var res2o = res2[i].outerHTML; //alert(res2o)
              while (/<br>[\s]{0,22}\<\/dd\>/.test(res2o)) res2o = res2o.replace(/<br>[\s]{0,22}\<\/dd\>/, "</dd>"); // 後ろの空改行をtrim
              e.outerHTML = `<div class="post"><div class="meta" alt="${res1t.replace(/　|\s|：/g,"").trim()}"><span class="date">${res1[i].innerHTML}</span></div><div class="message"><span class="escaped">${res2o.replace(/^<dd>/,"").replace(/<\/dd>/,"")}</span></div></div><br>`;
              res2[i].remove();
            });
          }
          elegeta('//div[@class="post"]/div[1]/span[@class="date"]').slice(0, 1001).forEach(e => { e.closest(".post").id = e.textContent.trim().match0(/^\d+/) || null; })
          adja(document.body, "beforeend", "<span id='ch5styleoldnewmodend'><span>"); //加工終了を告げる
        }
        //ct(() => { if (ld(".5ch.net")) elegeta('.number').forEach(e => e.innerText = Number(e.innerText)) }) //test 25 / 1sec
        if (ld(".5ch.net") && lh('/test/read.cgi/')) elegeta('.number').forEach(e => e.innerText = Number(e.innerText)) //test 25 / 1sec
        //ct(() => { if (ld(".5ch.net")) elegeta('.number').forEach(e => e.textContent = Number(e.innerText)) }) //test 26 / 1sec
        //ct(() => { if (ld(".5ch.net")) elegeta('.number').forEach(e => e.innerText= Number(e.textContent)) }) //test 148 / 1sec
        //ct(() => { if (ld(".5ch.net")) elegeta('.number').forEach(e => e.textContent = Number(e.textContent)) }) //test 158 / 1sec
      },

      func: () => {
        for (let e of elegeta('//div[@class="meta"][not(@alt)]').slice(0, 1001)) { // レスの特定のために1行目をまとめてtitle属性に埋める
          let id = e.innerText.replace(/>>.*/g, "").replace(/　|\s|：/g, "").trim();
          e.setAttribute("alt", id); // e.style.pointerEvents="none";
        };
        SITE.funcQ();
      },
      hideSelectedWord: 1,
    },
    /*    {
          id: 'NICODOUGA',
          urlRE: '//www.nicovideo.jp/ranking',
          title: 'h2.NC-CardTitle.NC-CardTitle_fixed3Line',
          box: 'div.NC-Card',
          redoWhenRefocused: 1,
          //listTitleXP: '//div/h2[@class="MediaObjectTitle VideoMediaObject-title MediaObjectTitle_fixed2Line"]',
          //listTitleSearchXP: '//div/h2[@class="MediaObjectTitle VideoMediaObject-title MediaObjectTitle_fixed2Line"][+++]/../../../../..',
          //listTitleMemoSearchXP: '//div/h2[@class="MediaObjectTitle VideoMediaObject-title MediaObjectTitle_fixed2Line"][+++]',
          //listGen: 6,
        },
      */
    {
      id: 'NICODOUGA', // nico::
      urlRE: '//www.nicovideo.jp/series/',
      listTitleXP: '//div[@class="VideoMediaObject-title"]/a',
      listTitleSearchXP: '//div[@class="VideoMediaObject-title"]/a[+++]/../../../..',
      listTitleMemoSearchXP: '//div[@class="VideoMediaObject-title"]/a[+++]',
      listGen: 5,
      listTitleHelpXP: '//div[@class="VideoMediaObject-title"]/a/../../../..',
      redoWhenRefocused: 1,
    }, {
      id: 'NICODOUGA', // nicosea::
      //      urlRE: '//www.nicovideo.jp/search/|//www.nicovideo.jp/tag/|//www.nicovideo.jp/watch/|//www.nicovideo.jp/ranking|//www.nicovideo.jp/user/.*/video|//www.nicovideo.jp/user/.*/series',
      //urlRE: '//www.nicovideo.jp/search/|//www.nicovideo.jp/tag/|//www.nicovideo.jp/watch/|//www.nicovideo.jp/ranking|//www.nicovideo.jp/user/',
      urlRE: '//www.nicovideo.jp/search/|//www.nicovideo.jp/tag/|//www.nicovideo.jp/watch/|//www.nicovideo.jp/ranking|//www.nicovideo.jp/user/',

      title: 'ul.videoListInner li.item p.itemTitle>a,a.nrn-contributor-link,div h1.VideoTitle,.nrn-movie-tag-link,p.itemTitle>a , h1.fs_xl.fw_bold , p.fw_bold.fs_base , p.mt_x0_5.mb_base , a.fw_bold.lc_2.mb_x0_5.fs_l , h2.NC-MediaObjectTitle_fixed2Line , a.fs_base.mt_x0_5.mb_base.fw_bold.lc_2 , h2.NC-MediaObjectTitle.NC-VideoMediaObject-title.NC-MediaObjectTitle_fixed2Line , h2.NC-MediaObjectTitle.NC-VideoMediaObject-title.NC-MediaObjectTitle_fixed2Line',
      box: 'ul.videoListInner li.item , div.WatchAppContainer-main , a.gap_x2[data-anchor-area="related_content,recommendation"] , div[class*="grid-area_[meta]"][class*="d_flex"] , div.py_x1_5.pt_base.gap_base , div.d_flex , div.NC-MediaObject.NC-VideoMediaObject.VideoContainer-item , div.Pressable.cursor_pointer.d_flex.cq-t_inline-size , div.NC-MediaObject , div.NC-MediaObject',

      //  title: 'p.fw_bold.fs_base',
      //box: 'a.gap_x2[data-anchor-area="related_content,recommendation"]',
      redoWhenRefocused: 1,
      redoWhenReturned: 1,
      observe: 1000,
      forceTranslucentFunc: () => lh('https://www.nicovideo.jp/watch/'),
      memoFunc: e => lh("/watch") ? e?.parentNode?.parentNode : lh("/ranking") ? e : e?.parentNode,
      //listGen: 7,
      preventHelpFunc: () => lh('https://www.nicovideo.jp/watch/') && document.fullscreenElement,
      /*detailURLRE: /\/watch\//,
      detailTitleXP: '//div/div[@class="HeaderContainer-topAreaLeft"]/h1[@class="VideoTitle"]',
      detailTitleSearchXP: '//div/div[@class="HeaderContainer-topAreaLeft"]/h1[@class="VideoTitle"][+++]',
      */
      func: e => {
        // サムネイルの大きさ調節スライダー 2025.09
        lh('//www.nicovideo.jp/search/') && setSlider(eleget0('div.flex-sh_1'), 0, 640, 320, "サムネイル幅:***px", "nicodouga_thumbs_width", (val) => {
          addstyle.remove(GF?.nicoThumbWidth)
          GF.nicoThumbWidth = addstyle.add(`.contain_content { width:${val}px; height:${val/16*9}px; min-width:0; min-height:0;}`)
        }, 0, ' style="margin:0 0 0 1em;" ')
      },
      wholeHelp: [() => 1, "　A：ソート"],
      keyFunc: [{
          //          key: "l", // l::
          key: "s", // s::
          func: (e, evt) => {
            let targets = (elegeta('//div/p[@class="itemTitle"]/a|//h1[contains(@class,"VideoTitle")]'))
            var one = document.elementFromPoint(mousex, mousey)
            //let hover=(eleget0('yt-formatted-string:hover,a:hover'))
            if (targets.includes(one)) {
              //動画タイトル上でsキーでその動画を含む再生リストを検索する
              let title = one?.innerText?.trim()
              let u = encodeURIComponent(title)
              if (u) {
                evt.preventDefault();
                evt.stopPropagation(); // 有効なlキーだったら本来の機能（10秒進む）をキャンセル
                let searchurl1 = `https://www.google.co.jp/search?q=${title.trim()} site:https://www.nicovideo.jp/user/*/mylist/`
                let searchurl = `https://www.google.co.jp/search?q=${u} site:https://www.nicovideo.jp/user/*/mylist/`
                if (confirm(`s：指したタイトルを含む再生リストを検索する\n\n${searchurl1}\n↓\n${searchurl}\n\nを開きます。よろしいですか？`)) {
                  elegeta('video').forEach(v => v.pause());
                  window.open(searchurl, "", "noreferrer")
                }
              }
            }
            return false;
          },
        },
        {
          key: 'a', // a::
          func: () => {
            if (lh(/\/\/www.nicovideo.jp\/user\/\d+\/mylist\//)) {
              let menu = [
                { t: "メモ総長順", f: () => { sortdom(elegeta('div.NC-MediaObject.NC-VideoMediaObject.MylistItem.MylistItemList-item.NC-VideoMediaObject_thumbnailWidth192.NC-MediaObject_withAction.NC-MediaObject_withFooter'), v => (elegeta('.yhmMyMemoO', v)?.reduce((a, b) => b?.textContent?.length + a, 0) || 0) - (elegeta('.yhmMyMemoX', v).reduce((a, b) => b?.textContent?.length + a, 0) || 0), 1) } }, // ○メモとチャプターメモは＋文字数、×メモは－文字数評価
              ]
              popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == GF.yhmSortType ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
              menu[GF.yhmSortType].f()
              GF.yhmSortType = ((GF?.yhmSortType + 1) % menu.length)
              return
            }
            if (lh(/\/user\/|\/series/)) {
              let menu = [
                { t: "メモ総長順", f: () => { sortdom(elegeta('.NC-MediaObject.NC-VideoMediaObject.VideoContainer-item'), v => (elegeta('.yhmMyMemoO', v)?.reduce((a, b) => b?.textContent?.length + a, 0) || 0) - (elegeta('.yhmMyMemoX', v).reduce((a, b) => b?.textContent?.length + a, 0) || 0), 1) } }, // ○メモとチャプターメモは＋文字数、×メモは－文字数評価
              ]
              popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == GF.yhmSortType ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
              menu[GF.yhmSortType].f()
              GF.yhmSortType = ((GF?.yhmSortType + 1) % menu.length)
              return
            }
            if (lh("/watch")) return;
            //var sorttype = GF.yhmSortType || 0;
            let menu = [
              { t: "メモ多", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => Number(elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              { t: "タイトル", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => eleget0('p.itemTitle > a , a.fw_bold.lc_2.mb_x0_5.fs_l , a.fs_base.mt_x0_5.mb_base.fw_bold.lc_2:visible', v)?.textContent) } },
              { t: "投稿者", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => eleget0('a.nrn-contributor-link , p.fs_s.fw_bold.lc_1:visible', v)?.textContent) } },
              { t: "いいね＋マイリス", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => (0 + Number(eleget0('li.count.like > span.value , p.ai_center.text-layer_lowEm:nth-child(4) > span:visible', v)?.textContent || 0) + Number(eleget0('li.mylist > span.value , p.ai_center.text-layer_lowEm:nth-child(5) > span:visible', v)?.textContent || 0)) || -1, 1) } },
              { t: "いいね＋マイリス＋コメント", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => (0 + Number(eleget0('li.count.like > span.value , p.ai_center.text-layer_lowEm:nth-child(4) > span:visible', v)?.textContent || 0) + Number(eleget0('li.mylist > span.value , p.ai_center.text-layer_lowEm:nth-child(5) > span:visible', v)?.textContent || 0) + Number(eleget0('li.count.comment > span , p.ai_center.text-layer_lowEm:nth-child(3) > span:visible', v)?.textContent || 0)) || -1, 1) } },
              { t: "いいね＋マイリス＋コメント＋再生", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => (0 + Number(eleget0('li.count.like > span.value , p.ai_center.text-layer_lowEm:nth-child(4) > span:visible', v)?.textContent || 0) + Number(eleget0('li.mylist > span.value , p.ai_center.text-layer_lowEm:nth-child(5) > span:visible', v)?.textContent || 0) + Number(eleget0('li.count.comment > span , p.ai_center.text-layer_lowEm:nth-child(3) > span:visible', v)?.textContent || 0) + Number(eleget0('li.view > span , p.ai_center.text-layer_lowEm:nth-child(2) > span:visible', v)?.textContent?.replace(/\,/gm, "") || 0) / 1000) || -1, 1) } },
              { t: "時間長", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => eleget0('span.videoLength , time > span:visible', v)?.textContent, 1) } },
              { t: "時間短", f: () => { sortdom(elegeta('ul.videoListInner li.item , div[data-decoration-video-id]:visible'), v => eleget0('span.videoLength , time > span:visible', v)?.textContent) } },
            ]
            cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
            //menu[sorttype].f()
            //GF.yhmSortType = (++sorttype) % menu.length
          }
        }, {
          key: 'u', // u::チャプターメモ
          func: (e) => {
            if (!lh("/watch")) return;
            //chapterMemo(/watch/, '//div/div[@class="HeaderContainer-topAreaLeft"]/h1[@class="VideoTitle"]', `https://www.nicovideo.jp/watch/${(location.href.match0(/\/watch\/([^/?]+)/))}?from=**time**`)
            chapterMemo(/watch/, 'h1.fs_xl', `https://www.nicovideo.jp/watch/${(location.href.match0(/\/watch\/([^/?]+)/))}?from=**time**`)
          },
        }, {
          key: 'Shift+U', // Shift+U::チャプターメモをクリップボードにコピー
          func: (e) => {
            if (!lh("/watch")) return;
            //chapterMemo(/watch/, '//div/div[@class="HeaderContainer-topAreaLeft"]/h1[@class="VideoTitle"]', `https://www.nicovideo.jp/watch/${(location.href.match0(/\/watch\/([^/?]+)/))}?from=**time**`, 1)
            chapterMemo(/watch/, 'h1.fs_xl', `https://www.nicovideo.jp/watch/${(location.href.match0(/\/watch\/([^/?]+)/))}?from=**time**`, 1)
          },
        }
      ],
      funcOnlyFirst: () => {
        document.addEventListener('fullscreenchange', (event) => { if (document.fullscreenElement && $('video')[0] && $('video')[0].paused == false) { $("#yafuokuhelp").hide(200) } else { $("#yafuokuhelp").show(300) } })
        var observeUrlHasChangedhref = location.href;
        var observeUrlHasChanged = new MutationObserver(mutations => {
          if (observeUrlHasChangedhref !== location.href) { //notifyMe(location.href)
            pauseAll = 1;
            prefCacheClear();
            observeUrlHasChangedhref = location.href;
            elegeta('//span[contains(@class,"yhmMyMemo")]/..').forEach(e => e.remove());
            setTimeout(() => {
              pauseAll = 0;
              run(document.body, "returned")
            }, 3500);
          }
        });
        observeUrlHasChanged.observe(document, { childList: true, subtree: true });
      },
    }, {
      id: 'NICODOUGA',
      urlRE: '//www.nicovideo.jp/my/mylist|www.nicovideo.jp/my/watchlater',
      listTitleXP: '//h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"]',
      listTitleSearchXP: '//h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"][+++]/../../../../../..',
      listTitleMemoSearchXP: '//h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"][+++]',
      redoWhenRefocused: 1,
      delay: 2000,
      listGen: 5,
      listTitleXPIgnoreNotExist: 1,
      //    reloadWhenUrlHasChanged:1,
      wholeHelp: [() => 1, "　A：ソート"],
      funcOnlyFirst: () => setInterval(() => eleget0('button[class*="Timeline-more"]')?.click(), 3000),
      keyFunc: [{
          //          key: "l", // l::
          key: "s", // s::
          func: (e, evt) => {
            let targets = (elegeta('//h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"]'))
            var one = document.elementFromPoint(mousex, mousey)
            //let hover=(eleget0('yt-formatted-string:hover,a:hover'))
            if (targets.includes(one)) {
              //動画タイトル上でsキーでその動画を含む再生リストを検索する
              let title = one?.innerText?.trim()
              let u = encodeURIComponent(title)
              if (u) {
                evt.preventDefault();
                evt.stopPropagation(); // 有効なlキーだったら本来の機能（10秒進む）をキャンセル
                let searchurl1 = `https://www.google.co.jp/search?q=${title.trim()} site:https://www.nicovideo.jp/user/*/mylist/`
                let searchurl = `https://www.google.co.jp/search?q=${u} site:https://www.nicovideo.jp/user/*/mylist/`
                if (confirm(`s：指したタイトルを含む再生リストを検索する\n\n${searchurl1}\n↓\n${searchurl}\n\nを開きます。よろしいですか？`)) {
                  elegeta('video').forEach(v => v.pause());
                  window.open(searchurl, "", "noreferrer")
                }
              }
            }
            return false;
          },
        },
        {
          key: 'a', // a::
          func: () => {
            if (lh("https://www.nicovideo.jp/my/watchlater|https://www.nicovideo.jp/my/mylist/")) {
              var sorttype = GF.yhmSortType || 0
              let menu = [
                { t: "メモ多", f: () => { sortdom(elegeta('//div[@class="VideoMediaObjectList"]/div'), v => (elegeta('.yhmMyMemoO', v)?.length || 0) - (elegeta('.yhmMyMemoX', v)?.length || 0), 1) } }, // ○メモとチャプターメモは＋１、×メモは－１評価
              ]
              cyclemenu(menu) //popup2("A：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == sorttype ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
              menu[sorttype].f()
              GF.yhmSortType = (++sorttype) % menu.length
              return
            }
          }
        }
      ],
    },
    {
      id: 'RTINGS',
      urlRE: 'www.rtings.com/.*?/tools/table|//www.rtings.com/.*?/reviews/',
      listTitleXP: '//div/div[@class="table_cell_product-name"]',
      listTitleSearchXP: '//div/div[@class="table_cell_product-name"][***]/../../../../..',
      listTitleMemoSearchXP: '//div/div[@class="table_cell_product-name"][***]/..|//span[@class="e-page_title-primary"][***]',
      listGen: 3,
      listTitleXPIgnoreNotExist: 1,
      delay: 3000,
      observe: 1000,
      detailURLRE: /\/\/www.rtings.com\/.*?\/reviews\//,
      detailTitleXP: '//span[@class="e-page_title-primary"]',
      detailTitleSearchXP: '//span[@class="e-page_title-primary"][***]/../../../../..',
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: 'csbs.shogakukan.co.jp',
      listTitleXP: '//div[1]/img[@class="is-item-cover loaded"]',
      listTitleSearchXP: '//div[1]/img[@class="is-item-cover loaded" and ++alt++]/../../..',
      listTitleMemoSearchXP: '//div[1]/img[@class="is-item-cover loaded" and ++alt++]',
      listGen: 3,
      listTitleXPIgnoreNotExist: 1,
      delay: 1000,
      observe: 1500,
      redoWhenReturned: 1,
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: '//sokuyomi.jp/free_',
      listTitleXP: '//p[@class="title"]/a|//h1[@class="title"]',
      listTitleSearchXP: '//p[@class="title"]/a[++title++]/../..',
      listTitleMemoSearchXP: '//p[@class="title"]/a[++title++]', // 多分表示されない
      listGen: 3,
      observe: 900,
      listHelpXP: '//div[@id="content"]/div/ul/li',
      redoWhenReturned: 1,
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: '//sokuyomi.jp/free\.',
      listTitleXP: '//img[@class="waku"]',
      listTitleSearchXP: '//img[@class="waku" and ++alt++]/../..',
      listTitleMemoSearchXP: '//img[@class="waku" and ++alt++]',
      listHelpXP: '//div[@id="content"]/div/ul/li',
      listGen: 3,
      observe: 600,
      redoWhenReturned: 1,
    },
    {
      urlRE: '//ebookjapan.yahoo.co.jp/viewer',
      func: () => {
        //$().ready(() => { setTimeout(() => { document.title = (eleget0('//div[@class="header__title"]').innerText || "") + " " + document.title; }, 2000); });
      },
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: '//ebookjapan.yahoo.co.jp/free|//ebookjapan.yahoo.co.jp/ranking/details/free/',
      listTitleXP: '//p[@class="book-item__title"]',
      listTitleSearchXP: '//p[@class="book-item__title"][***]/../..',
      listTitleMemoSearchXP: '//p[@class="book-item__title"][***]',
      listGen: 3,
      titleProcessFunc: (title) => { return title.replace(/\s[0-9０-９]+巻?$/gmi, "").replace(/[（\(][0-9０-９]+巻?[）\)]$/gmi, "").replace(/【期間限定.*?】|【フルカラー】/g, "").replace(/\s\d+冊/gmi, "").replace(/\.\.\./gmi, "").trim() },
      observe: 1000,
      redoWhenReturned: 1,
    },
    {
      id: 'TAMESHIYOMI',
      urlRE: 'booklive.jp/index/no-charge',
      listTitleXP: '//p[@class="p-no-charge-book-item__title"]/a',
      listTitleSearchXP: '//p[@class="p-no-charge-book-item__title"]/a[***]/../../..',
      listTitleMemoSearchXP: '//p[@class="p-no-charge-book-item__title"]/a[***]',
      listGen: 5,
      titleProcessFunc: (title) => { return title.replace(/\s[0-9０-９]+巻?$/gmi, "").replace(/[（\(][0-9０-９]+巻?[）\)]/gmi, "").replace(/【.*?】|（.*?）|分冊版[\s:：]*|合冊版[\s:：]*/g, "").replace(/第?[0-9０-９]+話?$/gmi, "").trim() },
      listTitleXPIgnoreNotExist: 1,
      observe: 1000,
      redoWhenReturned: 1,
    },
    {
      id: 'WCA',
      urlRE: '//tonarinoyj.jp/',
      title: 'h4.title , p.author',
      box: 'li.subpage-table-list-item',
      redoWhenReturned: 1,
    }, {
      id: 'WCA',
      urlRE: 'webcomics\.jp',
      title: '.entry-title>a:first-child,.entry-site>a:first-child,div.comic-title>h2>a:nth-child(1),.comic-site>a , a.favhistitle , .favhisaut , .favhissite',
      box: ".entry,#main-container #main , .favhisentry",
      trim: 1,
      XP2name: 'サイト名　',
      XP2memo: 1,
      listHelpJQS: 'div.entry',
      helpInBlock: 1,
      redoWhenReturned: 1,
      funcOnlyFirst: () => document.addEventListener("requestyhm", () => {
        $('.yhmMyMemo').remove();
        run()
      }),
      func: function(node) {
        // width 880-600→1180-900
        if (node === document.body && document.documentElement.clientWidth > 1200 && ($("#page").css("width")) == "880px") {
          $("#main-container").css("width", "900px");
          $("#page").css("width", "1180px");
        }
      },
      autoTranslucentURLRE: /mylist|bookmark|https:\/\/webcomics\.jp\/[^\/]+\/\d+$/,
      wholeHelp: [() => 1, `　u:重複作品を隠す　h:ソート`],
      keyFunc: [{
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: async (e) => autoPaging(`div.entry`, `div.pager-next > a`),
        /*          let last = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                  //let st = addstyle.add(`#dismissible{opacity:0.5 !important;}`)
                  let scr = async (i) => {
                    last.push(elegeta('div.entry')?.length)
                    popup3(`Shift+End : 継ぎ足し操作 数：${last[last.length-1]}/残試行：${i}`)
                    window.scroll({ left: 0, top: i % 2 == 0 ? window.scrollY - 1 : 999999, behavior: "instant" })
                    await sleep(250)
                    if (i > 0 && (Math.max(...last.slice(-10)) != Math.min(...last.slice(-10)))) scr(--i);
                  }
                  await scr(100)
                }*/
      }, {
        key: 'u', // u::uniq
        func: () => {
          let undup = [],
            dup = []
          elegeta('div.entry-title>a:first-child:visible').reverse().sort((a, b) => eleget0('.entry-site>a:first-child', a.closest(".entry")).innerText.match0(/ComicWalker|ヤンマガWeb|ガンマ/gmi) ? 1 : -1).forEach(e => {
            if (undup.includes(e.textContent?.trim())) {
              e.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
              $(e.closest(".entry")).hide(999, function() { $(this).remove() }); //e?.closest(".entry")?.remove()
              dup.push(e.textContent?.trim())
            } else { undup.push(e.textContent?.trim()) }
          })
          popup2(`u:重複タイトルを隠す\n${dup.join("\n")}`, 6)
        }
      }, {
        key: 'h', // h::
        func: () => {
          let menu = [
            { t: "メモ総長順", f: () => { sortdom(elegeta('.entry'), v => (elegeta('.yhmMyMemoO,[data-gakusai]', v)?.reduce((a, b) => b?.textContent?.length + a, 0) || 0) - (elegeta('.yhmMyMemoX', v).reduce((a, b) => b?.textContent?.length + a, 0) || 0), 1) } }, // ○メモとチャプターメモは＋文字数、×メモは－文字数評価
            { t: "名前順", f: () => domsort("", elegeta('.entry'), (v) => { return ((v.querySelector('div.entry-title>a')).innerText?.trim()) || "" }, 3) },
            { t: "作者順", f: () => domsort("", elegeta('.entry'), (v) => { return eleget0('//a[@class="autele aut autname"]', v)?.innerText?.trim() || "" }, 3) },
            { t: "サイト順", f: () => domsort("", elegeta('.entry'), (v) => { return eleget0('//div[@class="entry-site"]/a', v).innerText?.trim() || "" }, 3) },
          ]
          cyclemenu(menu) //popup2("h：ソート\n" + (menu.map((c, i) => "　" + c.t + (i == GF.yhmSortType ? "　←\n" : "\n")).join("")), 6, `min-width:${menu.reduce((p,c)=>Math.max(p,c.t.length+3),0)}em;`);
          //menu[GF.yhmSortType].f()
          //GF.yhmSortType = ((GF?.yhmSortType + 1) % menu.length)
        },
      }],
    },
    {
      id: 'YAJ2', // yafuoku::
      urlRE: '://auctions.yahoo.co.jp/search/|://page.auctions.yahoo.co.jp/jp/auction/|://auctions.yahoo.co.jp/category/list/|://auctions.yahoo.co.jp/jp/auction/',
      title: 'span > span.konYbX > a , a.Product__sellerLink , h3.Product__title>a,h1.ProductTitle__text,div.Product__sellerArea>a,div>p.Seller__name>a,div p.Seller__name>a , h1[class*="gv-u-fontWeightBold--"]',
      titleSubstr: true,
      //      box: 'li.Product,div.l-contentsBody , div[class*="gv-l-main--"] > section',
      box: 'li.Product , div[class*="gv-l-main--"] > section',
      titleFunc: e => e?.href?.match1(/\/seller\/([^\?]+)|\/user\/([^\/\?]+)/) || e?.textContent?.trim(),
      boxFunc: (titleOrEle, n = document) => elegeta(SITE.title, n).filter(e => e?.textContent?.indexOf(titleOrEle) != -1 || e?.href?.match1(/\/seller\/([^\?]+)|\/user\/([^\/\?]+)/) == titleOrEle).map(e => e.closest(SITE.box)),
      boxFuncMemo: (titleOrEle, n = document) => elegeta(SITE.title, n).filter(e => e?.textContent?.indexOf(titleOrEle) != -1 || e?.href?.match1(/\/seller\/([^\?]+)|\/user\/([^\/\?]+)/) == titleOrEle),
      draft: n => n.innerHTML,
      //      APDelay: 100, // どういうわけか遅延しないと非表示が漏れる
      APDelay: 100, // どういうわけか遅延しないと非表示が漏れる
      forceTranslucentFunc: e => e?.closest('div.l-contentsBody') && lh("/auction/"),
      trim: 1,
      //funcQ: e => { alert(eleget0('a',e)?.href) },//?.forEach(v => addNG(v, "dispall")) },
      redoWhenRefocused: 1,
      //listTitleXP2: '//div[@class="Product__sellerArea"]/a|//span[@class="Seller__name"]/a[1]|//p[@class="Seller__name"]/a',
      listTitleXP2: 'span > span.konYbX > a , a.Product__sellerLink',
      XP2name: '出品者名　',
      XP2memo: 1,
      listGen: 6,
      listHelpXP: '//li[@class="Product"]',
      //helpInBlock: 1,
      wholeHelp: [() => 1, "　" + KEYMAXP + ":価格上限\nh：ソート"],
      detailURLRE: /:\/\/page.auctions.yahoo.co.jp\/jp\/auction\/|\/\/auctions\.yahoo\.co\.jp\/jp\/auction\//, // automemoのために必要
      detailTitleXP: '//h1[@class="ProductTitle__text"]|//div[@id="itemTitle"]/div/div/h1', // automemoのために必要
      detailTitleSearchXP: '//h1[@class="ProductTitle__text" and ***]/../../../..|//span[@class="Seller__name"]/a[+++]/../../../../../../../../../../..|.//span[@class="Seller__name"]/a[1][+++]|//p[@class="Seller__name"]/a[+++]/ancestor::div[@class="l-containerInner"]|.//div[@id="itemTitle"]/div/div/h1[+++]/ancestor::div/section',
      //      func: () => { elegeta(SITE.title).forEach(e => {if(e?.innerText=="出品中の商品")e.innerText += ` (${SITE.titleFunc(e)})`})},
      func: () => {
        elegeta(`span > span.konYbX > a , a.Product__sellerLink`).forEach(e => {
          if (!e?.title) {
            e.title = SITE.titleFunc(e);
            e.innerText += `\n(${sani(SITE.titleFunc(e))})`
          }
        })
        //        alert(1)
      },
      maxpriceXP: '//input[@class="InputText__input" and @name="max"]',
      keyFunc: [{
        key: 'h', // h::
        func: () => {
          let menu = [{
              t: "残り時間短",
              f: () => {
                sortdom(elegeta('li.Product'), v => {
                  let ele = eleget0('span.Product__time', v);
                  if (ele) {
                    let t = ele?.textContent || "";
                    let n2 = (parseFloat(eleget0('div.Product__otherInfo > dd > span.u-fontSize10', v)?.textContent?.match1(/(\d+\/\d+\s*\d+\:\d+)/)?.replace(/\D/g, "") || 0) || 1) / 100000000;
                    let n = ((+t?.match1(/(\d+)日/) * 60 * 60 * 24 || 0) + (+t?.match1(/(\d+)時/) * 60 * 60 || 0) + (+t?.match1(/(\d+)分/) * 60 || 0) + (+t?.match1(/(\d+)秒/) * 1 || 0) ?? 0) + n2;
                    ele.title = n;
                    return n;
                  }
                  return 0;
                })
              }
            },
            { t: "安い", f: () => { sortdom(elegeta('li.Product'), v => (eleget0nNP('span.Product__priceValue.u-textRed', v) + eleget0nNP('p.Product__postage', v))) } },
            {
              t: "価格/CPUスコア比",
              f: () => {
                sortdom(elegeta('li.Product'), v => {
                  let ele = +(elegeta('.yhmMyMemo.yhmMyMemoX[data-yhmc="#d71"]', v).find(e => e?.textContent?.match1(/^(\d{4,5})$/))?.textContent || 0) + +(elegeta('.yhmMyMemo.yhmMyMemoX[data-yhmc="#d71"]', v).find(e => e?.textContent?.match1(/^1C\:(\d{3,5})$/))?.textContent?.match1(/^1C\:(\d{3,5})$/) || 0); // シングルスレッド性能＋マルチスレッド性能
                  let p = eleget0nNP('span.Product__priceValue.u-textRed', v) + eleget0nNP('p.Product__postage', v);
                  if (ele && p) {
                    v.title = `価格/CPUスコア：${+((+p/+ele))?.toFixed(3)}`;
                    eleget0('.cpuscore', v)?.remove();
                    end(eleget0('div.Product__image', v), `<div class="cpuscore" title="￥${p}/${ele}" style="font-size:90%; padding:0.5em;">${v.title}</div>`)
                    return +p / +ele;
                  }
                  return Number.MAX_SAFE_INTEGER;
                })
              }
            },
            /*{ t: "シングルコア性能/価格比", f: () => { sortdom(elegeta('li.Product'), v => {
                          let ele = elegeta('.yhmMyMemo.yhmMyMemoX', v).find(e=>e?.textContent?.match1(/^1C\:(\d{4,5})$/))?.textContent?.match1(/^1C\:(\d{4,5})$/) || 0;
                            let p = parseFloat(eleget0('span.Product__priceValue.u-textRed', v)?.textContent || 0);
            return +p / +ele ;
                        }) } },
              */
          ];
          cyclemenu(menu, "H")
          return
        }
      }],
      funcOnlyFirst: () => {

        /*        autoPagerizedD("seller", () => {
                  elegeta(`span > span.konYbX > a , a.Product__sellerLink`).forEach(e => {
                    if (!e?.title) {
                      e.title = SITE.titleFunc(e);
                      //if (e?.innerText == "出品中の商品") e.innerText +="\n"+ SITE.titleFunc(e)
                      //              if (e?.innerText == "出品中の商品") e.innerText += `\n(${SITE.titleFunc(e)})`
                      e.innerText += `\n(${sani(SITE.titleFunc(e))})`
                    }
                  })
                })
        */
        //        ael(document,"mousemove",e=>{    e?.target?.matches('span > span.konYbX > a , a.Product__sellerLink') &&    tooltip(e?.target,SITE.titleFunc(e?.target))})
        if (lh(/\/\/auctions\.yahoo\.co\.jp\/jp\/auction\//)) {
          eleget0('span[class*="gv-Heading__title--"]:text*=その他の情報')?.click()
          setTimeout(() => {
            CUSTOMAUTOMEMORE.concat([/(レターパック[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(クリックポスト[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(ゆうメール[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(ゆうパケット[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(ゆうパック[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(定形外[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /(メール便[^0-90-9\n]*[0-9,0-9,]*円[-~]?)/m, /送料.*(全国一律\s*[0-9,0-9,]*.*円[-~]?)/m, /送料\s*[::]?(.*[都道府県]は[0-9,0-9,]*円[-~]?)/m, /(Pentium.*?GHz)|(Celeron.*?GHz)|(Atom.*?GHz)|(Core\s?i\d.*?GHz)|(AMD.*APU)/mi, /(CPU[\s\S]{1,30}?GHz)/mi, /^(.*GHz)/gmi, /(Pentium[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Celeron[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Atom\s[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Core(?:\(TM\))?\s?i\d[\s\-]\d{4,5}[0-9A-Za-z\-_.]*)|(Ryzen\s*\d\s*(?:pro)?\s*\d{4,5}[A-Za-z\-\_\.]*)/mi, /([0-90-9]{2,4}年製)/m, /([0-90-9]{2,4}年)/m, /([0-90-9]{2,4}年製)/m, /([0-90-9]{2,4}年)/m, /発送元:(.{1,4}[都道府県])/m, /(認証制限[\s\S]{0,3}(?:なし|あり))/m]).forEach(m => autoMemo2(eletext([`div#itemTitle h1`, 'div#description', `div#itemPostage > div > dl`, `div#otherInfo > div`], 1), m)); // textContentが途中までしか取れないので動かない
          }, 50)
        }
      },
      //  automemoForceFunc: () => lh(":\/\/auctions\.yahoo\.co\.jp\/jp\/auction\/"),//"//page.auctions.yahoo.co.jp/jp/auction/"),
      //    automemoURLRE: `\/\/auctions\.yahoo\.co\.jp\/jp\/auction\/`,//"://page.auctions.yahoo.co.jp/jp/auction/",
      //automemoSearchFunc: () => { return eletext('//div[@class="ProductExplanation__commentArea"]') + "\n" + eletext('//div[@id="ProductProcedures"]') + "\n" + eletext('//h1[@class="ProductTitle__text"]') + '\n' + eletext('//ul[@class="ProductInformation__items"]/li[2]') + '\n' + eletext('//div/div[@class="ProductDetail"]') + '\n' + eletext('//ul/li[@class="ProductInformation__item"]/section[@class="Section"]'); },
      //      automemoSearchFunc: () => { return eletext('section > div.bbFyIJ > div') + "\n" + eletext('//div[@id="ProductProcedures"]') + "\n" + eletext('//h1[@class="ProductTitle__text"]') + '\n' + eletext('//ul[@class="ProductInformation__items"]/li[2]') + '\n' + eletext('//div/div[@class="ProductDetail"]') + '\n' + eletext('//ul/li[@class="ProductInformation__item"]/section[@class="Section"]'); },
      /*    automemoFunc: () => {
        for (let am of CUSTOMAUTOMEMORE) { autoMemo(am); }
        autoMemo(/(レターパック[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(クリックポスト[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(ゆうメール[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(ゆうパケット[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(ゆうパック[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(定形外[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(メール便[^0-9０-９\n]*[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/送料.*(全国一律\s*[0-9,０-９，]*.*円[-～]?)/m);
        autoMemo(/送料\s*[:：]?(.*[都道府県]は[0-9,０-９，]*円[-～]?)/m);
        autoMemo(/(Pentium.*?GHz)|(Celeron.*?GHz)|(Atom.*?GHz)|(Core\s?i\d.*?GHz)|(AMD.*APU)/mi) ? 0 :
          autoMemo(/(CPU[\s\S]{1,30}?GHz)/mi) ? 0 :
          autoMemo(/^(.*GHz)/gmi) ? 0 :
          autoMemo(/(Pentium[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Celeron[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Atom\s[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)|(Core\s?i\d.[0-9A-Za-z\-_.]*)|(Ryzen\s?\d[0-9A-Za-z\-_.]*\W*[0-9A-Za-z\-_.]*)/mi);
        autoMemo(/([0-9０-９]{2,4}年製)/m) ? 0 :
          autoMemo(/([0-9０-９]{2,4}年)/m) ? 0 :
          autoMemo(/([0-9０-９]{2,4}年製)/m) ? 0 :
          autoMemo(/([0-9０-９]{2,4}年)/m);
        autoMemo(/発送元：(.{1,4}[都道府県])/m);
        autoMemo(/(認証制限[\s\S]{1,3}あり)/m);
      },
      showFunc: () => { run(document.body, "returned") },
*/
    },
    {
      id: 'YAJ2',
      urlRE: '://auctions.yahoo.co.jp/seller/',
      title: 'a.Product__titleLink.js-rapid-override.js-browseHistory-add',
      box: 'li.Product',
      //      listTitleXP: '//a[@class="Product__titleLink"]|.//a[@class="Product__titleLink u-textBold"]|.//div[@class="a1wrp"]/h3/a',
      //    listTitleXP2: '//div/div[@class="seller__subInfo"]/span[@class="seller__yid"]',
      //    XP2name: '出品者名　',
      //    XP2memo: 1,
      //  listGen: 4,
      //    listHelpJQS: "div.a1,#list01 table tbody tr td",
      //    listTitleSearchXP: '//div[@class="a1wrp"]/h3/a[***]/../../../..|.//div[@class="a1wrp"]/h3/a/em[***]/../../../../..|//div/div[@class="seller__subInfo"]/span[@class="seller__yid"][+++]',
      //   listTitleMemoSearchXP: '//div[@class="a1wrp"]/h3/a[***]|.//div[@class="a1wrp"]/h3/a/em[***]/..|//div/div[@class="seller__subInfo"]/span[@class="seller__yid"][+++]',
      redoWhenReturned: 1,
    }, {
      id: 'YAJ2',
      urlRE: 'userbenchmark',
    }, {
      id: 'AMAZON',
      urlRE: /https:\/\/www.amazon.co.jp\/gp\/css\/order-history|https:\/\/www.amazon.co.jp\/gp\/buyagain/,
      title: 'div.yohtmlc-product-title > a , span.a-truncate-cut',
      box: 'div.a-fixed-right-grid-col > ul[class*="a-unordered-list"] > div[class*="a-row"] > li:nth-of-type(1) , div[class*="_YnV5L_gridCell_1hj4x"][data-buying-options-count="1"]',
      trim: 1,
      observe: 500,
      isHidePartialMatch: 1,
    }, {
      id: 'AMAZON',
      urlRE: 'https://www.amazon.co.jp/product-reviews/',
      title: '//a[@data-hook="product-link"]',
      box: 'div#a-page',
      forceTranslucentFunc: e => 1,
    }, {
      id: 'AMAZON', //amazon:: ama::
      listTitleXPIgnoreNotExist: 1,
      //      urlRE: /www\.amazon\.co\.jp\/s\?k\=|www\.amazon\.co\.jp.*\/dp\/.*/,
      urlRE: /www\.amazon\.co\.jp\/s\?|www\.amazon\.co\.jp.*\/(?:gp|dp)\/.*/,
      //title: 'a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal>span,div#title_feature_div.celwidget[data-feature-name="title"]>div#titleSection.a-section.a-spacing-none>h1#title>span#productTitle,h1#title span',
      //box: 'div.s-asin,div#dp-container',
      //title: 'h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-4,span#productTitle.a-size-large.product-title-word-break',
      title: `h2.a-spacing-none.a-color-base.a-text-normal > span , span#productTitle`, //'span#productTitle.a-size-large.product-title-word-break,span.a-size-base-plus.a-color-base.a-text-normal', //'h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-4,span#productTitle.a-size-large.product-title-word-break,span.a-size-base-plus.a-color-base.a-text-normal',
      //title: 'h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-4,span#productTitle.a-size-large.product-title-word-break,span.a-size-base-plus.a-color-base.a-text-normal',
      box: 'div.s-asin , div#dp-container',
      memoFunc: e => e.parentNode,
      //delay:1600,observe:1600, // 非表示の前にヨドバシ量単価を先に処理させるため1500以上にしたほうがいい
      redoWhenReturned: 1,

      //memoFunc: e => e.parentNode.parentNode,
      forceTranslucentFunc: e => e.closest('div#dp-container'),
      detailTitleSearchXP: '//span[@id="productTitle" and ***]/../../../../../..|//h1/a[@class="a-link-normal" and ***]/../../../../../../../../../../../../..|//div[@class="p13n-sc-truncate-desktop-type2  p13n-sc-truncated"][***]/../../../../..',
      listGen: 12,
      listHelpXP: '//div[@data-asin][.//span[@class="a-size-base a-color-base a-text-normal"]]|.//div[@data-asin][.//span[contains(@class,"a-size-medium a-color-base a-text-normal")]]',
      trim: true,
      func: () => {
        let hide = eleget0('div.a-section[class*="a-spacing-top-micro"] > div[class*="a-size-small"]:nth-child(1) > span[class*="a-size-small"]');
        !lh(/\/dp\/|\/gp\//) && lh(/\/s\?|\/b\//) && elegeta('[data-asin] span.a-icon-alt:not([data-starpop])').forEach(e => {
          before(e?.parentNode, `<span class="amazonstarkazu" style="${hide?"display:none":""}" data-estars="${parseFloat(e?.textContent.match0(/5つ星のうち([0-9\.]+)/)) }">${e?.textContent.match0(/5つ星のうち([0-9\.]+)/||"0")+" "||""}</span>`);
          //before(e?.parentNode, `<span class="amazonstarkazu" data-estars="${parseFloat(e?.textContent.match0(/5つ星のうち([0-9\.]+)/)) }">${e?.textContent.match0(/5つ星のうち([0-9\.]+)/||"0")+" "||""}</span>`);
          e.dataset.starpop = 1;
        })

        //elegeta('//*[@class="s-line-clamp-2"]|.//*[@class="s-line-clamp-3"]').forEach(e => e.style.maxHeight = "auto");
        //elegeta('//div[@class="a-section a-spacing-none"]/div[1]/h2/a[@class="a-link-normal a-text-normal"]/span').forEach(e => e.style.display = "inline-block") // 商品名を広く表示する
      },
      observeTagName: "DIV",
      //      listHelpJQS: 'div[data-asin]',
      detailURLRE: /\/dp\/|\/product-reviews\//,
      detailTitleXP: '//h1[@id="title"]/span[@id="productTitle"]',
      hideListEvenDetail: 1,

      automemoURLRE: /https:\/\/www.amazon.co.jp.*\/dp\//,
      //      automemoSearchFunc: () => { return eletext(['//div[@id="ppd"]/div[4]', '//div/div[@data-template-name="productDescription" and @id="productDescription_feature_div"]', '//div[@data-template-name="productDescription"]', '//div[@id="important-information"]', '//div[@id="prodDetails"]']); },
      automemoSearchFunc: () => { return eletext([`//div[contains(@class,"celwidget aplus-module module-9 aplus-standard")]`, '//div[@id="ppd"]/div[4]', '//div/div[@data-template-name="productDescription" and @id="productDescription_feature_div"]', '//div[@data-template-name="productDescription"]', '//div[@id="important-information"]', '//div[@id="prodDetails"]', '//div[@class="a-box a-last"]/div[@class="a-box-inner"]', 'div#buyBoxAccordion.a-box-group.a-accordion.a-spacing-large']); },
      automemoFunc: () => {
        if (eleget0('//div[@id="nav-subnav" and @data-category="beauty"]|//div[@id="nav-subnav" and @data-category="hpc"]|//div[@id="nav-subnav" and @class="spacious subnav-untied"]')) {
          [/(イソプロピルメチルフェノール)/m, /(IPMP)/m, /(塩化セチルピリジニウム|塩化セシルピリジニウム|セチルピリジニウム塩化物)/m, /(CPC)/m, /(塩化ベンザルコニウム)/m, /(BKC)/m, /(ラウロイルサルコシンナトリウム|ラウロイルサルコシンNa|ラウロイルサルコシンＮａ)/m, /(LSS)/m, /(塩化ベンゼトニウム)/m, /(BTC)/m, /(クロルヘキシジン)/m, /(CHG)/m, /(グリチルリチン酸アンモニウム)/m, /(イプシロン.アミノカプロン酸)/m, /(ε.ACA)/m, /(トラネキサム酸)/m, /(TXA)/m, /(グリチルリチン酸ジカリウム|グリチルリチン酸二カリウム|グリチルリチン酸２K|グリチルリチン酸2K|GK2)/mi, /(1\,?450\s?ppm)/m, /(高?濃?度?フッ化ナトリウム|高?濃?度?フッ素)/m, /(ハイドロオ?キシアパタイト)/m, /(リン酸化オリゴ糖カルシウム)/m, /(ＰＯｓ-Ｃａ|POs-Ca)/mi, /(カゼインホスホペプチド.非結晶性リン酸カルシウム|リカルデント)/m, /(CPP-ACP)/m, /(チモール)/m, /(サリチル酸メ?チ?ル?)/m, /(1\,8-シネオール)/m, /(トリクロサン)/m, /(トリクロカルバン)/m, /(オクトピロックス|オクトロピックス|ピロクトン.?オラミン)/m, /(Znピリチオン|ジンクピリチオン)/m, /(硫黄|イオウ)/m, /(アラントイン)/m, /(グリチルリチン酸アンモニウム)/m, /(ミコナゾール硝?酸?塩?)/m, /(クロラムフェニコール)/m, /(フラジオマイシン硫?酸?塩?)/m, /(ナイスタチン)/m, /(塩化亜鉛)/m, /(ポビドン.?ヨード)/m, /(ラウリルジアミノエチルグリシンナトリウム)/m, /(カキタンニン)/m, /(チャエキス)/m, /(ローズマリー)/m, /(カンゾウ)/m, /(クマザサ)/m, /(セージ)/m, /(シソエキス)/m, /(β?-?グリチルレチン酸?)/m, /(メントール)/m, /(ポリリン酸ナトリウム|ポリリン酸Na)/m, /(ヒノキチオール)/m, /(ティーツリー油オ?イ?ル?)/m, /(ティートゥリー油オ?イ?ル?)/m, /(フルスルチアミン|ベンフォチアミン|オキソアミヂン|オクトチアミン)/m].forEach(m => autoMemo(m));
        }
        if (eleget0('//div/div[@id="nav-subnav" and @data-category="electronics"]|//div/div[@data-category="musical-instruments"]/a[1]')) {
          [/([\d\s\,]+mAh)/m, /([\d\s\,]+mAｈ)/m, /([\d\s\,]{2,9}回)/m, /(感度.{0,20}\-.{0,20}dB)/mi].forEach(m => autoMemo(m));
          //          [/([\d\s\,]+mAh)/m, /([\d\s\,]+mAｈ)/m, /([\d\s\,]{2,9}回)/m].forEach(m => autoMemo(m));
        }
        if (eleget0('//div[@id="nav-subnav" and @data-category="kitchen"]|//div[@id="nav-subnav" and @data-category="home"]')) {
          [/([0-9０-９+＋]+?物質)/m, /([0-9０-９+＋]+?項目)/m, /(交換.{1,19}[0-9.]+ヶ月)|(交換.{1,19}[0-9.]+年)|(取替.{1,19}[0-9.]+ヶ月)|(取替.{1,19}[0-9.]+年)/m].forEach(m => autoMemo(m));
          [/(低圧\D?\d+kpa)/mi, /(高圧\D?\d+kpa)/mi, /(圧力[\:：]\d+kPa)/mi].forEach(m => autoMemo(m));
        }
        if (eleget0('//div[@id="nav-subnav" and @data-category="food-beverage"]')) {
          [/(食物繊維\D{0,9}[0-9.]+[gｇ])/m].forEach(m => autoMemo(m));
        }
        if (eleget0('//div/a/span/img[@alt="AMAZON FASHION"]|//span[@class="nav-a-content" and contains(text(),"産業・研究開発用品")]')) {
          [/(ハイパーV)|(Hyper.?V)|(.?先芯.{0,3})/mi].forEach(m => autoMemo(m));
        }
        if (eleget0('//div[@data-category="diy"]/a[1]/span[contains(text(),"DIY・工具・ガーデン")]')) {
          [/(容量[\s\S]{0,3}[0-9\.\, ]+(?:L|Ｌ|リットル))/mi, /(容量\((?:L|Ｌ|リットル)\):[0-9\.\, ]+)/mi].forEach(m => autoMemo(m));
        }
        if (eleget0('//span[@class="a-list-item"]/a[contains(text(),"カップ・マグ・ソーサー")]|//div[@id="wayfinding-breadcrumbs_container"]/div[@id="wayfinding-breadcrumbs_feature_div"]/ul/li/span/a[contains(text(),"ボウル")]|//a[@class="a-link-normal a-color-tertiary" and contains(text(),"食器・グラス・カトラリー")]')) {
          [/(容量[\s約\:]*[0-9\.\,]+\s*(?:ml|cc|L|Ｌ|リットル))/mi, /(容量\((?:ml|cc|L|Ｌ|リットル)\):[0-9\.\,]+)/mi].forEach(m => autoMemo(m));
        }

        let cat = elegeta('//li/span[contains(@class,"a-list-item")]/a[contains(@class,"a-link-normal a-color-tertiary")]')
        //if (cat.find(e => e.textContent.match0("食器用洗剤")))[/(界面活性剤\s*[\(（]+\s*\d+[\%％]+[^\)）]*[\)）]+)/m].forEach(m => autoMemo(m));
        if (cat.find(e => e.textContent.match0("洗剤")))[/(界面活性剤.{0,3}\d+[\%％])/m].forEach(m => autoMemo(m));

        //        [/(出荷元\s*Amazon)/mi, /(発送元\s*\:*\s*Amazon)/mi].forEach(m => autoMemo(m, t => t.replace(/\n/gm, " ")));
        //[/(出荷元\s*\w+)/mi, /(発送元\s*\:*\s*\w+)/mi].forEach(m => autoMemo(m, t => t.replace(/\n/gm, " ")));
        [/(出荷元(?: \/ 販売元)?\s*\S+)/mi, /(発送元\s*\:*\s*\S+)/mi].forEach(m => autoMemo(m, t => t.replace(/\n/gm, " ")));
      },
      funcOnlyFirst: () => {
        addstyle.add('.s-line-clamp-2 { -webkit-line-clamp: none; max-height: 9em; text-align: initial; display: inline !important; } .s-line-clamp-1, .s-line-clamp-2, .s-line-clamp-3, .s-line-clamp-4, .s-line-clamp-5 { -webkit-box-orient: initial; } ') // タイトルを…で省略させない
        //addstyle.add('a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal { display: inline !important; }') // メモが隠れないようにする
        if (ld("amazon")) addstyle.add('.s-line-clamp-4 { -webkit-line-clamp:8; } a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal { display: inline !important; }') // メモが隠れないようにする

        var observeUrlHasChangedhref = location.href;
        var observeUrlHasChanged = new MutationObserver(mutations => {
          if (observeUrlHasChangedhref !== location.href) {
            prefCacheClear();
            observeUrlHasChangedhref = location.href;
            elegeta('//span[contains(@class,"yhmMyMemo")]').forEach(e => e.parentNode.remove());
            setTimeout(() => { run(document.body, "returned") }, 2500);
          }
        });
        observeUrlHasChanged.observe(document, { childList: true, subtree: true });
      },
      keyFunc: [{
        key: "Shift+End", // Shift+End::
        help: `Shift+End:しばらく下にスクロール`,
        func: e => {
          if (lh(/s\?k=/)) autoPaging(`img.s-image`, `a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-button-accessibility.s-pagination-separator`, 50, 333);
          /*        async function autoPaging(item,pager,timeout=100){
            let last = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            await (async function scr(i){
              last.push(elegeta('img.s-image')?.length)
              popup3(`Shift+End : 継ぎ足し操作 読み込み済み：${last[last.length-1]}/残試行：${i}`)
              i % 2 == 0 ? window.scroll({ top: window.scrollY - 1}) : elegeta(pager)?.pop()?.scrollIntoView({behavior:"smooth", block: "center", inline: "center" })
              await sleep(333)
              if (i > 0 && (Math.max(...last.slice(-10)) != Math.min(...last.slice(-10)))) scr(--i);
            })(timeout)
          }
*/
        }
      }, {
        key: 'Shift+F', // Shift+F::キーワード検索
        func: () => { searchWithHistory("Amazon検索", "Amazon検索", [`https://www.amazon.co.jp/s?k=***&dc`], "|") },
      }],
    },
    /*    { // doc::
          id: '', // GM_setValueで保存するグループ名　同じグループは設定が共通になる
          urlRE: '', // 動作するサイトのURLの一部（正規表現）
          necessaryToWorkFunc: null, // この関数がありfalseなら動作を停止する　urlREだけでは非対応ページを絞り込めない時に使用
          listTitleXP: '', // 項目一覧ページの項目名を特定できる要素のXPath title＞text＞altの順にあるものから利用される
          listTitleXP2: '', // 項目一覧ページの項目名の第2候補を指すXPath　これにホバーしていればQキーでこれのinnerTextでもNG登録できる
          XP2name: '', // XP2にホバーした時のガイドに表示する文字列
          XP2memo: 0, // 1だとXP2でも1-6キーのメモを許可
          listTitleSearchXP: '', // 項目一覧ページの項目を消すブロック要素をサーチするXPath　通常listTitleXPにサーチ用マクロを付け/..をいくつかつけたもの
          listTitleSearchFunc: null, // 項目一覧ページの項目を消すブロック要素をサーチする関数　5chのレス本文キーワードNGなどで使用
          listTitleMemoSearchXP: '', // 項目一覧ページと詳細ページのメモを付ける要素をサーチするXPath（一覧と詳細の両方を|でOR記述）　通常listTitleXPやdetailTitleXPにサーチ用マクロを付け/..をいくつかつけたもの
          listTitleMemoSearchXPSameGen: 0, // 1だとメモをタイトルと同じ世代の要素として付ける　0だと１つ親世代
            // サーチ用マクロ；　***：textをcontainsで検索　+++：textを=で検索　++alt++：altを=で検索　++title++：titleを=で検索　**url**：hrefをcontainsで検索（要useURL） ++url++：hrefを=で検索（要useURL）
          listGen: 3, // Q12を押した場所の要素からいくつ上まで遡った要素までを当たり判定にするか　必要最小限にする
          listHelpJQS: '', // 項目一覧ページで操作ガイドを表示する要素のJQueryセレクタ　↓でも良い　両方を省略するとlistTitleXPの２つ親の要素で代用　当たり判定とは関係ない
          listHelpXP: '', // 項目一覧ページで操作ガイドを表示する要素のXpath　↑でも良い　両方を省略するとlistTitleXPの２つ親の要素で代用　当たり判定とは関係ない
          helpInBlock: 0, // 1だと操作ガイドを要素のブロック内に表示する
          preventHelpFunc: null, // ()=>trueを返したらヘルプを表示しない判定関数
          detailURLRE: //, // URLにmatchする正規表現、matchすると個別詳細画面だと判断する
          detailTitleXP: '', // 詳細画面で項目名を指すXPath
          detailTitleSearchXP: '', // 詳細画面で非表示化時に表示を薄くする要素をサーチするXPath
          func: null, // 処理時にそのサイトでのみ実行したい関数があれば書く
          funcQ: null, // Qキー処理時にそのサイトでのみ実行したい関数があれば書く
          funcMemo: null, // 5/6などメモ関係処理時にそのサイトでのみ実行したい関数があれば書く
          funcFinally: null, // そのサイトで非表示やメモの処理が終わった後に実行したい関数があれば書く
          funcOnlyFirst: null, // ページ開始時に１回だけ実行したい関数　通常通りのDelayが効く
          funcOnlyFirstWithoutDelay: null, // ページ開始時に１回だけ実行したい関数　Delayなしで最速で実行する
          titleProcessFunc: null, // 項目名を保存する前に加工したければ関数を書く
          autoTranslucentURLRE: //, // 強制的に半透明モードにするURLの正規表現　Web漫画アンテナのマイリスト等
          listTitleXPIgnoreNotExist: 0, // 通常listTitleXPにヒットする要素が１つもなくobserveも0なら動作を停止するがこれがtrueだと停止をしない　項目が動的に追加されるページなどで使用
          forceRunIffunc: null, // これがありtrueを返したらlistTitleXPIgnoreNotExist=1と同様に動作の停止をしない　項目が動的に追加されるページ、先に加工を要するページ（旧5ch）などで使用
          delay: 0, // ミリ秒　ページ読み込み後処理を開始するまでの遅延
          delayAutoWeighting: 0, // 0以外ならページ開始時から処理開始までの遅延の係数（省略可） delayと排他利用
          observe: 0, // ミリ秒　1以上だと要素追加ごとにこのミリ秒の遅延を置いて再処理する（とても遅い）　項目が動的に追加されるページなどで使用
          observeFunc:null, // これがあると追加された要素ごとにtrueを返した要素のみが処理対象になる判定関数　(addedElement)=>{return addedElement==～})
          observeId: "", // これがあるとobserve有効時にこのIDの要素でないものは無視する　YouTubeなどの高速化に重要
          observeClass: [], // これがあるとobserve有効時にこれに含まれるClassNameでない要素は無視する　futapoなどの高速化に重要
          observeClassNameNot:[], // これがあるとobserve有効時にこのclassNameの要素は処理しない
          observeTagName:"", // これがあるとobserve有効時にこのtagNameの要素は処理しない
          trim: 0, // 1だと項目名をtrimしてから保存 Amazonでは項目名が一覧と詳細で揺れるため1にする
          automemoURLRE: null, // 自動メモを収集するURL
          automemoSearchFunc: null, // 自動メモの対象要素のテキストを収集する関数
          automemoFunc: null, // 自動メモを実行する関数
          redoWhenReturned: 0, // これが1かdetailTitleXPが存在すれば他ウインドウや他タブから戻ってきた時に全体を再処理する　disableUrlREを見る
          redoWhenRefocused: 0, // これが1なら他タブから戻ってきた時に全体を再処理する　disableUrlREを無視
          showFunc: null, // QWで項目を再表示した時に実行したい関数があれば書く
          hideListEvenDetail: 0, // 1なら詳細画面でも一覧画面用の非表示を実行する　ニコニコ静画（イラスト）などで使用
          detailRangeFunc: null, // 詳細画面で項目対象が２つ以上ある場合に指した要素から遡る等の処理があれば書く関数
          //useURL: 0, // 1なら項目名としてAタグのhrefを取り込み、使う　ジモティ等、完全に同名の項目名が付けられやすいサイトで使用
          useURL: 0, // 1なら項目名としてAタグのhrefを取り込み、使う（?以降は無視）　ジモティ等、完全に同名の項目名が付けられやすいサイトで使用
          useText: 0, // 1なら項目名としてtextContentを取り込み、使う　Pubmed等IDではない@titleが設定されているためテキストを優先したいサイトで使用
          hideSelectedWord: 1, // 1ならQキーを押した時に文字列選択中ならその文字列を非表示リストに入れる　5chのレス本文キーワードNGなどで使用
          disableHelpForce: 0, // 1ならENABLE_HELP_CONCLUSIONを常に0にしヘルプやガイドを一切表示しない
          disableHelpUrlRE: '', // 正規表現　URLにマッチすると全体ヘルプを抑制する
          disableKeyB: 0, // 1ならBキーは効かなくする　youtubeなどで使用
          searchAllowLength: 0, // 1ならQ12キーの当たり判定をゆるくする（説明しづらい）　5chで使用
          reloadWhenUrlHasChanged:0, // 1ならURLが変わった時にリロードする　SPAサイトなどで使用
          helpOnDNI: 0, // 1ならdniでの継ぎ足し時非表示にしたレポートを逐一表示する
          disableUrlRE: "", // URLにマッチしたらキー操作を無効にする正規表現　YouTubeなどSPAサイトで動画視聴ページでキー操作の機能を無効にするために使用
          urlHasChangedCommonFunc: null, // urlが変わったら実行する関数　uniqlo等シングルページアプリケーションで一覧と詳細を行き来するサイト等で使用
          WhateverFirstAndEveryAPFunc: null, // 対象要素がなくてもurlREにマッチしたページならとにかく最初とAutoPagerize時に実行する関数
          memoStyle:"", // メモのstyle=""指定に特別に追加する文字列
          ignoreDNI:null, // これがあるとDOMNodeInsertedイベントでe.targetを受け取りtrueを返したらそのノードは無視する判定関数　ニコ動watch画面等で使用　(e)=>{if(e==無視すべきノード)return false} などと使う
          forceTranslucentFunc:null, // これがあると非表示にした要素eがtrueを返すときは半透明に消す判定関数 e=>e.closest("***") のように使う
          //isMemoPartialMatch: 0, // 全体ヘルプの表示だけメモを部分一致にする
          isHidePartialMatch: 0, // 全体ヘルプの表示だけ非表示を部分一致にする＝Bキーのガイドを出す　5ch/ふたばなどの特殊本文NGができるサイトでBキーのヘルプを出すためだけに使用
          preventMemo: null,  // (memo内容)=>return true だと通常のメモの内容表示を抑制する判定関数　futapoで使用
          // 新方式2（titleとboxで１セット、listTitle～を代替）
          title: '', // 項目名を指すXPath/CSS　これとboxだけで要素を特定する新フォーマット　title→textContentの順に優先して同一判定する　現在===判定のみ
          box: '', // titleを包含し項目全体の枠になる先祖要素（枠）を指すCSS（XPath不可）　boxの中にtitleがある
          titleSubstr: false, // これがtrueだとメモがtitleに対して部分一致でヒットするようになる ヤフオクでCPUスコアの自動メモを表示するために使用
          memoFunc: null, // メモを付ける位置は通常はtitleのafterendだがこれがあるとtitle要素から辿って変更できる　デフォルトは(titleEle)=>{return titleEle}
          memoPosition: '', // メモを付ける位置は通常はtitleのafterendだがこれがあると変更できる　afterbegin等
          nfd: 0, // 1:項目のタイトルをすべてNFDエンコードにしてから一致判定する　壮絶に遅い　タイトルのエンコードが一定でないサイトで使用　YouTubeの新仕様で必要になるかも
          Bsyntax2: 0, // 1:bキーの非表示ワード直接入力で独自構文を使えるようにする
          funcHidden: null, // (ele,com)=>項目を非表示にしたときと再表示させた時に追加で実行する処理の関数　eleが対象要素、com==hide OR show
          // 新方式3（titleとboxとtitleFuncとboxFuncとboxFuncMemoで１セット、listTitle～を代替） 2025.07
          titleFunc: box => null, // box内から非表示/メモ対象アイテム名（キー）を取り出す
          boxFunc: (titleOrEle, node = document) => null, // node内からtitleOrEle(アイテム名（キー）)にヒットする要素が入っているboxを全て返す
          boxFuncMemo: (titleOrEle, node = document) => null,  // node内からtitleOrEle(アイテム名（キー）)にヒットする要素のメモを付けたい位置の要素を全て返す
          APDelay: 0, // 1以上だとAutoPagerized時の再実行に遅延msを付ける
          draft: null, // あればfasttextを作る関数 n=>n.innerHTML など
        }, // doc::
    */
  ];

  var siteinfo = Object.assign(SITEINFO, pref("MY_SITEINFO") || []); //alert(siteinfo);return;
  // thissiteを決定
  var thissite = null;
  for (var i = 0; i < siteinfo.length; i++) {
    if (siteinfo[i].urlRE === "") break;
    if ((typeof siteinfo[i].urlRE == "function" && siteinfo[i].urlRE()) || (typeof siteinfo[i].urlRE != "function" && location.protocol != "file:" && location.href.match(siteinfo[i].urlRE))) {
      thissite = i;
      var SITE = Object.create(siteinfo[thissite]);
      if (SITE.disableKeyB === undefined && (!(/\*\*\*|\*\*title\*\*|\*\*alt\*\*/.test(SITE.detailTitleSearchXP || "") || /\*\*\*|\*\*title\*\*|\*\*alt\*\*/.test((SITE.listTitleSearchXP || "") || /\*\*\*|\*\*title\*\*|\*\*alt\*\*/.test(SITE.listlTitleMemoSearchXP || ""))))) SITE.disableKeyB = 1;
      break;
    }
  }
  if (thissite === null || (!ENABLE_EXCEPT_YAJ && SITE.id != "YAJ2")) return;

  // 実験的に全てON
  //SITE.redoWhenRefocused = 1
  //SITE.redoWhenReturned = 1

  let ENABLE_HELP_CONCLUSION = lh(SITE?.disableHelpUrlRE || /$^/) ? 0 : SITE.disableHelpForce ? 0 : ENABLE_HELP;

  const MEMOSTYLE = SITE.memoStyle ? SITE.memoStyle : "";
  //const CUSTOMAUTOMEMORE = [/$()^/]; // 無指定
  // ,/(フルHD|Full\s?HD|FHD|WXGA|FWXGA|QVGA|WXGA\+|SXGA|SXGA\+|HD\+|WXGA\+\+|WSXGA|WSXGA\+|UXGA|FHD|2K|WUXGA|FHD\+|UltraWideFHD|QXGA|WQHD|WQXGA|UltraWideQHD\+|QUXGA|QFHD|UHD4K|DCI4K|8KFUHD)/m
  const alsoClearBenchMemoWhenClearAutoMemo = 0; // 1:Shift+"で自動メモのみ削除する時CPUスコアのメモも削除する 0:CPUスコアのメモは残す

  const LogMatch = 0;

  debug && sw("start")
  var mousex = 0;
  var mousey = 0;
  //var maey = 0;

  // userbenchmark/cpubenchmarkでの動作
  if (location.href.match(/https:\/\/www\.cpubenchmark\.net\/cpu\.php/i)) { //userbenchmark
    setTimeout(() => {
      let cpuscore = $(eleget0('div.right-desc > div:nth-child(3)')).css("border", "4px dotted green").text()?.trim();
      let cpuscore1t = "1C:" + $(eleget0('div[class*="right-desc"] > div:nth-child(5 of div)')).css("border", "4px dotted blue").text()?.trim();
      //cpuscore = cpuscore.replace(/(.*\%).*/, "$1").trim();
      let ubmodel = eletext('span.cpuname') || ""
      let lasttitle = pref("lastItemName") || "";
      let modelno = (ubmodel.match1(/core\s*i\d\D*(\d{3,5}[KFTSCPRHXKUXPYBGQMXMQM]*)/i) || ubmodel.match1(/(?:Celeron|Core2 Duo)\s*(.?\d{3,5}[KFTSCPRHXKUXPYBGQMXMQM]*)/i) || ubmodel.match1(/(Ryzen\s*\d+\s*(?:pro)?\s*\d+[KFTSCPRHXKUXPYBGQMXMQM]*)/i) || "").trim();
      //     popup3(`ms : ${cpuscore}\n1s : ${cpuscore1t}\nmodel : ${ubmodel}\naltname : ${lasttitle}\nno : ${modelno}`, 0, 5000, "top");
      //notifyMe(`ms : ${cpuscore}\n1s : ${cpuscore1t}\nmodel : ${ubmodel}\naltname : ${lasttitle}\nno : ${modelno}`);
      if (modelno) {
        for (let title of (lasttitle ? lasttitle.indexOf(modelno) != -1 ? [modelno] : [lasttitle, modelno] : [modelno])) {
          //for (let memo of [
          [document?.body?.innerText?.match1(/(TDP\D{0,9}\d+\s*W)/mi),
            cpuscore, cpuscore1t,
          ].forEach((memo, i) => {
            //]) {
            var tmp = pref('YAJ2 : SearchMyMemo') || [];
            var isExist = tmp.filter(e => e.t == title && e.m == memo);
            popup3(title + "\n" + memo, i * 3);
            if (isExist.length == 0) {
              if (title && memo) {
                let tmp = pref('YAJ2 : SearchMyMemo') || [];
                tmp.push({ t: title, m: memo, c: COLORCPUSCOREPM })
                pref('YAJ2 : SearchMyMemo', tmp)
              }
            }
          })
        }
      }
      pref("lastItemName", "");
      //popup3("Task completed");
    }, 1);
    return;
  }
  if (location.href.match(/cpu.userbenchmark.com\/.*\/Rating\/|cpu.userbenchmark.com\/SpeedTest\//i)) { //userbenchmark
    setTimeout(() => {
      let cpuscore = $(eleget0('//td[@class="mcs-hl-col" and contains(text(),"64-Core")]/span')).css("border", "4px dotted blue").text();
      let cpuscore1t = "1C:" + $(eleget0('//td[@class="mcs-hl-col" and contains(text(),"1-Core")]/span')).css("border", "4px dotted blue").text();
      cpuscore = cpuscore.replace(/(.*\%).*/, "$1").trim();
      let ubmodel = eleget0('//h1[@class="pg-head-title"]/a[@class="stealthlink"]').innerText.trim();
      let lasttitle = pref("lastItemName") || "";
      let modelno = (ubmodel.replace(/^core i\d-?(\S?\s?\d{3,5}.*$)/gi, "$1").replace(/^Core2 Duo (.?\d{3,5}.*$)/gi, "$1").trim());
      if (modelno) {
        for (let title of (lasttitle ? lasttitle.indexOf(modelno) != -1 ? [modelno] : [lasttitle, modelno] : [modelno])) {
          //for (let memo of [
          [document?.body?.innerText?.match(/(TDP\s*\d+\s*W)/mi)?.[1]?.replace(/\s/gm, " ") || "",
            cpuscore, cpuscore1t,
          ].forEach((memo, i) => {
            //]) {
            var tmp = pref('YAJ2 : SearchMyMemo') || [];
            var isExist = tmp.filter(e => e.t == title && e.m == memo);
            popup3(title + "\n" + memo, i * 3);
            if (isExist.length == 0) {
              if (title && memo) {
                let tmp = pref('YAJ2 : SearchMyMemo') || [];
                tmp.push({ t: title, m: memo, c: COLORCPUSCORE })
                pref('YAJ2 : SearchMyMemo', tmp)
              }
            }
          })
        }
      }
      pref("lastItemName", "");
      //popup3("Task completed");
    }, 500);
    //return;
  }
  if (location.href.match("userbenchmark.com|www.cpubenchmark.net")) {} else {
    pref("lastItemName") ? (pref("lastItemName", ""), popup3("UBM Task has been cleared")) : 0;
  }

  if (SITE.id == "5CH") {
    var oldmemo = pref(SITE.id + ' : SearchMyMemo') || []
    var newmemo = JSON.parse(JSON.stringify(oldmemo)) || []
    newmemo.forEach(c => {
      c.t = c.t.replace(document.title, "").replace(/　|\s|：/g, "").trim()
    })
    if (JSON.stringify(oldmemo) != JSON.stringify(newmemo)) {
      pref(SITE.id + ' : SearchMyMemo', newmemo)
      alert("前バージョンからのメモの変換に成功しました") //JSON.stringify(newmemo))
    }
  }

  //ct1(()=>{
  // メモのc属性を7文字から4文字に削減 12ms
  var oldmemo = pref(SITE.id + ' : SearchMyMemo') || []
  let memoRE = new RegExp(`\"c\"\:\"${OLD_COLOR1}\"|\"c\"\:\"${OLD_COLOR2}\"|\"c\"\:\"${OLD_COLOR3}\"|\"c\"\:\"${OLD_COLORVIDEOTIME}\"|\"c\"\:\"${OLD_COLORCPUSCORE}\"`)
  if (memoRE.test(JS(oldmemo))) {
    var newmemo = JSON.parse(JSON.stringify(oldmemo)) || []
    newmemo = newmemo?.map(v => {
      if (v?.c) {
        let i = [OLD_COLOR1, OLD_COLOR2, OLD_COLOR3, OLD_COLORVIDEOTIME, OLD_COLORCPUSCORE].indexOf(v?.c)
        if (i >= 0) v.c = [COLOR1, COLOR2, COLOR3, COLORVIDEOTIME, COLORCPUSCORE][i]
      }
      return v;
    })
    if (JSON.stringify(oldmemo) != JSON.stringify(newmemo)) {
      pref(SITE.id + ' : SearchMyMemo', newmemo)
      //alert(`ヤフオクで非表示とメモ：\nメモの旧形式からの変換に成功しました\n`) //JSON.stringify(newmemo)
    }
  }
  //})
  oldmemo = null;
  newmemo = null;

  if (SITE.funcOnlyFirstWithoutDelay) SITE.funcOnlyFirstWithoutDelay();
  if (SITE.funcOnlyFirst) setTimeout(() => { SITE.funcOnlyFirst(); }, (SITE.delayAutoWeighting || 0) * WAIT || (SITE.delay || 0));
  if (SITE.WhateverFirstAndEveryAPFunc) {
    setTimeout(() => { SITE.WhateverFirstAndEveryAPFunc(); }, (SITE.delayAutoWeighting || 0) * WAIT || (SITE.delay || 0));
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { SITE.WhateverFirstAndEveryAPFunc(evt.target); }, false);
  }

  if (SITE.keyFunc) { // SITEINFOにあるkeyFunc
    document.addEventListener('keydown', e => {
      if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable || ((e?.target?.closest('#chat-messages,ytd-comments-header-renderer') || document?.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      let ele = document.elementFromPoint(mousex, mousey)
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      debug && console.log(key)
      keyFuncDispatch(key, e) //keyFuncDispatch(key, e, ele)
    }, true)

    function keyFuncDispatch(key, evt = null, opt = SITE) {
      opt.keyFunc.forEach(c => {
        if (typeof c.key === "string" ? key === c.key : key.match0(c.key)) { c.func(key, evt, opt) }
      })
    }
    /*    function keyFuncDispatch(key, opt = null) {
          SITE.keyFunc.forEach(c => {
            if (typeof c.key === "string" ? key === c.key : key.match0(c.key)) { c.func(key, opt) }
          })
        }*/
  }

  if (SITE.reloadWhenUrlHasChanged) {
    var observeUrlHasChangedhref = location.href;
    var observeUrlHasChanged = new MutationObserver(mutations => { if (observeUrlHasChangedhref !== location.href) location.reload() });
    observeUrlHasChanged.observe(document, { childList: true, subtree: true });
  }
  if (SITE.runWhenUrlHasChanged) {
    var observeUrlHasChangedhrefRun = location.href;
    var observeUrlHasChangedRun = new MutationObserver(mutations => {
      if (observeUrlHasChangedhrefRun !== location.href) {
        prefCacheClear();
        setTimeout(() => { run(document.body, "returned") }, 2500);
      }
    });
    observeUrlHasChangedRun.observe(document, { childList: true, subtree: true });
  }

  // 詳細画面？
  var isDetail = (SITE.detailURLRE && location.href.match(SITE.detailURLRE)) ? 1 : 0;
  debug && dc("isDetail : " + isDetail)

  var isHidePartialMatch = SITE.isHidePartialMatch || (SITE.listTitleSearchXP && SITE.listTitleSearchXP.indexOf("**") != -1) ? 1 : 0;
  var isMemoPartialMatch = SITE.isMemoPartialMatch || (SITE.listTitleMemoSearchXP && SITE.listTitleMemoSearchXP.indexOf("**") != -1) ? 1 : 0;

  // ヤフオク上限価格はIME offにする
  if (SITE.id == "YAJ2") $(eleget0('//input[@class="InputText__input" and @name="max"]')).css('ime-mode', 'inactive');

  // 自動的に半透明モードにするページ
  var disableHide = (SITE.autoTranslucentURLRE && location.href.match(SITE.autoTranslucentURLRE)) || (pref("translucent") == "on");

  // 非対応ページ
  if (!isDetail && ((SITE.listTitleXP && !eleget0(SITE.listTitleXP)) || (SITE.title && !elegeta(SITE.title)))) {
    if ((SITE.listTitleXPIgnoreNotExist) || (SITE.observe) || (SITE.forceRunIffunc && SITE.forceRunIffunc())) {} else {
      if (debug) popup3("対象要素がないのでこのページでは働きません");
      return;
    }
  }
  if (SITE.necessaryToWork && (document.body.innerText.match(SITE.necessaryToWork)) == null) { //prompt(document.body.innerText,document.body.innerText.match(SITE.necessaryToWork))
    if (debug) popup3("非対応ページなのでこのページでは働きません");
    return;
  }

  if (SITE.selectedHelp) {
    $('body').on('mouseup', function(e) {
      var selectedStr;
      if (window.getSelection) {
        selectedStr = window.getSelection().toString();
        if (selectedStr !== '' && selectedStr !== '\n') {
          if (selectedStr.indexOf("\n") !== -1) SITE.selectedHelp.multi ? popup3(SITE.selectedHelp.multi, 11, 5000) : 0;
          else SITE.selectedHelp.help ? popup3(`『${sani(selectedStr)}』を\n` + SITE.selectedHelp.help.join("\n"), 11, 5000) : 0;
        }
      }
    });
  }

  String.prototype.replaceTitle = function(title) {
    if (title && SITE.titleProcessFunc) title = SITE.titleProcessFunc(title);
    if (!title) title = "空の文字列";
    return this.replace(/\*\*\*/g, "contains(text(),\"" + title + "\")").replace(/\+\+\+/g, "text()=\"" + title + "\"").replace(/\+\+alt\+\+/g, "@alt=\"" + title + "\"").replace(/\*\*alt\*\*/g, "contains(@alt,\"" + title + "\")").replace(/\*\*title\*\*/g, "contains(@title,\"" + title + "\")").replace(/\+\+title\+\+/g, "@title=\"" + title + "\"").replace(/\+\+url\+\+/g, "@href=\"" + title + "\"").replace(/\*\*url\*\*/g, "contains(@href,\"" + title + "\")");
  };

  var keyListen = async function(e) {
    if (SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE))) {
      var one = document.elementFromPoint(mousex, mousey);
      //      if (!SITE.listTitleXP || !elegeta(SITE.listTitleXP).concat(elegeta(SITE.listTitleXP2)).concat(elegeta(SITE.title)).find(v => v == one)) { return; }
      if (!SITE.listTitleXP || ![...elegeta(SITE.listTitleXP), ...elegeta(SITE.listTitleXP2), ...elegeta(SITE.title)].some(e => e.contains(one))) { return; }
    } //youtube視聴画面では反応する項目にホバーしているとき以外はキーを無効にする

    if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable || ((e?.target?.closest('#chat-messages,ytd-comments-header-renderer') || document?.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    if (key === KEYCHANGE_DEBUG) { // D::change debug mode
      debug = (debug + 1) % 4;
      popup3("debug mode : " + debug)
    }
    if (key === KEYHIDE) { // Q::hide
      e.preventDefault();
      if (SITE.hideSelectedWord) { // 選択された文字列をNG / 5ch等
        let sel = String(window.getSelection());
        if (sel) {
          if (sel.indexOf("\n") !== -1) { popup2("複数行の選択は NG に入れられません", 1); } else { addNG(sel); }
          if (SITE.funcB) SITE.funcB();
          return false;
        }
      }
      if (SITE.title) { // 直接ホバーしている要素が非表示対象ならそれで非表示登録（１つのbox内に複数の対象（作品名に対する作者名など）がある時にどちらで登録するかを選べるための処理）
        var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.title)?.find(e => e.contains(ele))
        if (ele) { //        if (elegeta(SITE.title)?.some(e=>e.contains(ele) )) {
          debug && dc(`Direct element Q : 『${ele?.textContent?.trim()||ele?.title?.trim() }』\nbox : ${e2sel(ele)}`)
          addNG(SITE.titleFunc ? SITE.titleFunc(ele) : ele?.textContent?.trim() || ele?.title?.trim())
          if (SITE.funcQ) SITE.funcQ(ele);
          return false;
        }
      }
      if (SITE.listTitleXP2) { // 2つ目の項目名がありそこにホバーしていればそれで非表示登録
        var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.title)?.find(e => e.contains(ele))
        if (ele) { //        if (elegeta(SITE.listTitleXP2).indexOf(ele) != -1) {
          blockElement(ele); //hideByTitle(ele.innerText);
          if (SITE.funcQ) SITE.funcQ(ele);
          return false;
        }
      }
      var ele = (SITE.detailTitleXP && isDetail) ? (eleget0(SITE.detailTitleXP, (SITE.detailRangeFunc ? SITE.detailRangeFunc(document.elementFromPoint(mousex, mousey)) : document.elementFromPoint(mousex, mousey))) || eleget0(SITE.detailTitleXP)) : document.elementFromPoint(mousex, mousey);
      debug && dc("Q start element : " + ele.tagName);
      if (SITE.funcQ) SITE.funcQ(ele);
      blockElement(ele);
      return false;
    }
    if (key == KEYUNDO) { // W::undo
      e.preventDefault();
      let resist = pref(SITE.id + ' : SearchHideTitle') || [];
      let title = resist.pop();
      let title2 = resist.slice(-1)[0] || "";
      title2 = title2 ? ("。次のアンドゥ対象は\n『" + title2 + "』") : ""
      pref(SITE.id + ' : SearchHideTitle', resist) || [];
      showByTitle(title);
      if (SITE.funcHidden) SITE.funcHidden(null, "show")
      if (isDetail && SITE.showFunc) SITE.showFunc();
      if (title) popup2("『" + title + "』\nを非表示登録から削除しました" + title2, 1, " background-color:#446; ");
      else popup2("登録された非表示項目はありません", 1);
      //        }
      if (SITE.funcQ) SITE.funcQ();
      return false;
    }
    if (key == KEYBW && !SITE.disableKeyB) { // B::NGword
      e.preventDefault();
      addNGWord();
      if (SITE.funcB) SITE.funcB();
      return false;
    }
    if (key == KEYTOGGLEtranslucent) { // T:: 半透明
      e.preventDefault();
      if (pref("translucent") == "on") restoreHidden();
      pref("translucent", pref("translucent") == "on" ? "off" : "on");;
      popup2(KEYTOGGLEtranslucent + ": 半透明モードを" + pref("translucent") + "にします");
      disableHide = (SITE.autoTranslucentURLRE && location.href.match(SITE.autoTranslucentURLRE)) || (pref("translucent") == "on");
      if (pref("translucent") == "on") {
        restoreTranslucent();
        run(document.body, "returned");
      }
      return false;
    }

    if (key === KEYEDIT) { // shift+Q:: edit NGs
      e.preventDefault();
      prefRestrict(SITE.id + ' : SearchHideTitle', "array");
      let sht = (JSON.stringify(pref(SITE.id + ' : SearchHideTitle') || ""));
      if (sht === '""') sht = "";
      let tmp = prompt(`${SITE.id}\n\n${ KEYEDIT }:\n非表示にするタイトル（現在${ (pref(SITE.id + ' : SearchHideTitle') || []).length }）をJSON形式で編集してください${SITE.QRule||"\n正規表現ではありません"}\n空欄を入力すれば全削除できます\n先頭の[の前に+を付けると現在のデータに追加（マージ）します\n\n${ sht}`, sht);
      if (tmp !== null) { // ESCで抜けたのでなければ
        try {
          if (tmp.match(/^\+|^＋/)) {
            tmp = tmp.replace(/^\+|^＋/, "")
            var tmp2 = pref(SITE.id + ' : SearchHideTitle') || []
            tmp = JSON.parse(tmp || "") || []
            var tmp3 = tmp.concat(tmp2)
            tmp = JSON.stringify(tmp3)
          }
          tmp = tmp ? JSON.parse(tmp) : [];
          if (ld("2chan.net") && confirm("このサイトではついでに非表示登録の種類別\n（自由ワード＞画像dHash＞No.）\n順にソートすることもできますがそうしますか？\n\nOKをしなければ元の順序が維持されます")) {
            tmp.sort((a, b) => (a.match(/^No\.\d/) && !b.match(/^No\.\d/)) ? 1 : 0) // レスNo.の方を後ろに持ってくる
            tmp.sort((a, b) => (a.match(/^No\.\d|^IdH\:/) && !b.match(/^No\.\d|^IdH\:/)) ? 1 : 0); // レスNo.でもIdHでもなければ前に持ってくる
          }
          pref(SITE.id + ' : SearchHideTitle', tmp);
          prefRestrict(SITE.id + ' : SearchHideTitle', "array");
          var a = pref(SITE.id + ' : SearchHideTitle')
          var b = [...new Set(a)]; // uniq
          pref(SITE.id + ' : SearchHideTitle', b || []);
          //    document.body.remove();
          location.reload();
        } catch (e) {
          alert(e + "\n入力された文字列がうまくparseできなかったので設定を変更しません\n正しいJSON書式になっているか確認してください");
          return false
        }
        return false
      }
    }
    if (key == KEYMEMO5EDIT || key == KEYMEMO6EDIT) { // Shift+5::5memo設定 Shift+6::6memo設定
      e.preventDefault();
      //var date = new Date();
      var memo = window.getSelection().toString().trim() || prompt((key == KEYMEMO5EDIT ? KEYMEMO5 : KEYMEMO6) + "キーのメモ内容を設定してください", (key == KEYMEMO5EDIT ? MEMO5WORD : MEMO6WORD) || getDefault56memo())
      if (key == KEYMEMO5EDIT) {
        MEMO5WORD = memo;
        key = KEYMEMO5
      } else {
        MEMO6WORD = memo;
        key = KEYMEMO6
      }
      if (SITE.funcMemo) SITE.funcMemo();
      if (memo == false) return false;
    }
    if (key == KEYMEMO5 || key == KEYMEMO6) { // 5::5memo 6::6memo
      e.preventDefault();
      if (SITE.title) { // 直接ホバーしている要素が対象ならそれで登録（１つのbox内に複数の対象（作品名と作者名など）がある時にどちらで登録するかを選べるための処理）
        var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.title)?.find(e => e.contains(ele))
        if (ele) { //        if (elegeta(SITE.title)?.some(e=>e.contains(ele) )) {//if (elegeta(SITE.title).find(e => e == ele)) {
          //var date = new Date();
          var dateStr = (key == KEYMEMO5 ? MEMO5WORD : MEMO6WORD) || getDefault56memo();
          //          memoElement(ele.innerText, document, key == KEYMEMO5 ? COLOR5 : COLOR6, window.getSelection().toString().trim() || dateStr);
          memoElement(
            SITE.titleFunc ? SITE.titleFunc(ele) :
            ele.textContent?.trim(), document, key == KEYMEMO5 ? COLOR5 : COLOR6, window.getSelection().toString().trim() || dateStr);
          if (SITE.funcMemo) SITE.funcMemo();
          return false;
        }
      }

      if (SITE.listTitleXP2 && SITE.XP2memo) { // 2つ目の項目名がありそこにホバーしていればそれで56
        var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.listTitleXP2)?.find(e => e.contains(ele))
        if (ele) { //if (elegeta(SITE.listTitleXP2).indexOf(ele) != -1) {
          //var date = new Date();
          var dateStr = (key == KEYMEMO5 ? MEMO5WORD : MEMO6WORD) || getDefault56memo();
          memoElement(
            SITE.titleFunc ? SITE.titleFunc(ele) :
            ele.innerText, document, key == KEYMEMO5 ? COLOR5 : COLOR6, window.getSelection().toString().trim() || dateStr);
          if (SITE.funcMemo) SITE.funcMemo();
          return false;
        }
      }

      var ele = (SITE.detailTitleXP && isDetail) ? (eleget0(SITE.detailTitleXP, (SITE.detailRangeFunc ? SITE.detailRangeFunc(document.elementFromPoint(mousex, mousey)) :
          document.elementFromPoint(mousex, mousey))) || eleget0(SITE.detailTitleXP)) :
        document.elementFromPoint(mousex, mousey);
      //var date = new Date();
      var dateStr = (key == KEYMEMO5 ? MEMO5WORD : MEMO6WORD) || getDefault56memo();
      memoElement(
        //        SITE.titleFunc ? SITE.titleFunc(ele) :
        ele, document, key == KEYMEMO5 ? COLOR5 : COLOR6, window.getSelection().toString().trim() || dateStr);
      if (SITE.funcMemo) SITE.funcMemo();
      return false;
    }
    if (key == KEYMEMO1 || key == KEYMEMO2) { // 1::1memo 2::2memo
      e.preventDefault();
      var ele = document.elementFromPoint(mousex, mousey);
      if (SITE.listTitleXP2 && SITE.XP2memo) { // 2つ目の項目名がありそこにホバーしていればそれで12
        //      var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.listTitleXP2)?.find(e => e.contains(ele))
        if (ele) { //        if (elegeta(SITE.listTitleXP2).indexOf(ele) != -1) {
          //memoElement(ele.innerText, document, key == KEYMEMO2 ? COLOR2 : COLOR1);
          memoElement(
            SITE.titleFunc ? SITE.titleFunc(ele) :
            ele?.textContent, document, key == KEYMEMO2 ? COLOR2 : COLOR1); // ここはtextContentじゃないと連続半角スペースの省略で違う項目名と判定されてしまう
          if (SITE.funcMemo) SITE.funcMemo();
          return false;
        }
      }
      if (SITE.title) { // 直接ホバーしている要素が対象ならそれで登録（１つのbox内に複数の対象（作品名と作者名など）がある時にどちらで登録するかを選べるための処理）
        //        var ele = document.elementFromPoint(mousex, mousey);
        ele = elegeta(SITE.title)?.find(e => e.contains(ele))
        if (ele) { //        if (elegeta(SITE.title).find(e => e == ele)) {
          //memoElement(ele.innerText?.trim(), document, key == KEYMEMO2 ? COLOR2 : COLOR1) //, window.getSelection().toString().trim() || dateStr);
          memoElement(ele?.textContent?.trim(), document, key == KEYMEMO2 ? COLOR2 : COLOR1) //, window.getSelection().toString().trim() || dateStr);// ここはtextContentじゃないと連続半角スペースの省略で違う項目名と判定されてしまう
          if (SITE.funcMemo) SITE.funcMemo();
          return false;
        }
      }
      //        var ele = eleget0(SITE.detailTitleXP) ? eleget0(SITE.detailTitleXP) : document.elementFromPoint(mousex, mousey);
      var ele = (SITE.detailTitleXP && isDetail) ? (eleget0(SITE.detailTitleXP, (SITE.detailRangeFunc ? SITE.detailRangeFunc(document.elementFromPoint(mousex, mousey)) : document.elementFromPoint(mousex, mousey))) || eleget0(SITE.detailTitleXP)) : document.elementFromPoint(mousex, mousey);
      memoElement(ele, document, key == KEYMEMO2 ? COLOR2 : COLOR1);
      if (SITE.funcMemo) SITE.funcMemo();
      return false;
    }
    if ((key == KEYMEMO1S || key == KEYMEMO2S)) { // 3:: 4:: free memo
      e.preventDefault();
      var target = (prompt(`メモを付けたい項目のタイトルが含むキーワードを入力してください\nこのページでは${SITE?.listTitleMemoSearchXP?.indexOf("**")!=-1?"部分一致です":"全体一致です"}\n\n`) || "")?.trim();
      if (!target) return;
      var memo = (prompt("『" + target + "』\nに付けるメモを書いてください") || "").trim();
      if (!memo) return;
      storeMemo(target.trim(), memo, key == KEYMEMO1S ? COLOR1 : COLOR2)
      if (SITE.funcMemo) SITE.funcMemo();
      return false;
    }
    if (key == KEYRESETMEMO) { // Shift+1::!::reset memo
      e.preventDefault();
      prefRestrict(SITE.id + 'SearchMyMemo', "array");
      let smm = JSON.stringify(pref(SITE.id + ' : SearchMyMemo') || []);
      if (smm === '[]') smm = "";
      var tmp = prompt(SITE.id + "\n\n" + KEYRESETMEMO + ":\nメモ（現在" + (pref(SITE.id + ' : SearchMyMemo') || []).length + "）をJSON形式で編集してください\n重複は自動的に削除されます\n空欄を入力すれば全削除されます\n先頭の[の前に+を付けると現在のデータに追加（マージ）します\n\n" + smm, smm);

      if (tmp === smm) return false;
      if (tmp !== null) { // ESCで抜けたのでなければ
        //pref(SITE.id + ' : SearchMyMemo', tmp.trim() || []);
        try {
          var mergemode = tmp?.trim()?.match(/^\+|^＋/)
          if (mergemode) {
            tmp = tmp?.trim()?.replace(/^\+|^＋/, "")?.trim()
            tmp = JSON.stringify((pref(SITE.id + ' : SearchMyMemo') || []).concat(JSON.parse(tmp || "") || []))
          }
          tmp = tmp ? JSON.parse(tmp) : []
          tmp = (Array.from(new Set(tmp.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
          tmp = tmp.map(v => { if (v?.m) { v.m = v.m.replace(/^(\d\d\d\d).(\d\d).(\d\d).\s?\(?.?\)?$/, "$1.$2.$3") } return v; }) // 1234年12月34日(月)→1234.12.34
          tmp = (Array.from(new Set(tmp.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
          pref(SITE.id + ' : SearchMyMemo', tmp);
          prefRestrict(SITE.id + 'SearchMyMemo', "array");
          var a = pref(SITE.id + ' : SearchMyMemo') || []
          var b = (Array.from(new Set(a.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq
          var found = 0; // 同一タイトルに5/6キーの日時メモが日時違いで重複していたら削除
          var dups = [];
          var c = [...b];
          if (mergemode) {
            b = b.reverse()
            c = c.reverse()
            let starti = 0;
            var stime = Date.now(),
              stime2 = Date.now()
            do {
              found = 0;
              for (let i = starti; i < b.length; i++) {
                let v = b[i];
                if (/^\d\d\d\d\.\d\d\.\d\d(?:\s\(.\))?$/.test(v?.m)) {
                  var e2 = b.slice(i + 1).find(v2 => v2 != v && nfd(v?.t) == nfd(v2?.t) && v?.c == v2?.c && /^\d\d\d\d\.\d\d\.\d\d(?:\s\(.\))?$/.test(v2?.m))
                  if (Date.now() - stime2 > 250) {
                    stime2 = Date.now();
                    begin(document.body, `<span id="checkmodal" style="all:initial; box-shadow:0 0 0 9999px #00000088; position: fixed; top: 77%; left: 50%; transform: translate(-50%, -50%); opacity:1; z-index:2147483647; font-weight:bold; margin:0px 1px; text-decoration:none !important; padding:2em 3em; border-radius:12px; background-color:#55f; color:white; ">重複チェック中：${i}/${b.length}　経過時間：${~~((Date.now()-stime)/1000)}秒　残り時間：${~~(((Date.now()-stime) /i * (b.length - i))/1000)}/${~~(((Date.now()-stime) /i * (b.length ))/1000)}秒　検出：${dups.length}</span>`);
                    await waitFrame()
                    eleget0('#checkmodal')?.remove()
                  }
                  if (e2) {
                    var ea = [v, e2].sort((a, b) => a?.m > b?.m ? 1 : -1)
                    var dup = b.find(v3 => JS(v3) === JS(ea[1]))
                    dups.push(dup);
                    b = b.filter(f => f != dup)
                    found = 1;
                    starti = i;
                    break;
                  }
                }
              }
            } while (found)
            b = b.reverse()
            c = c.reverse()
            dups = dups.reverse()
          }
          if (mergemode && dups.length && confirm(`同一のタイトルに5/6キーの日時メモが複数付いているものが${dups.length}個ありました\nこれを重複とみなし最も古い日時のメモ以外を削除することもできますが\nそうしますか？\n\n削除する項目：\n${JS(dups).replace(/\},{\"t\"\:/g,'},\n{"t":')}`)) c = b;
          pref(SITE.id + ' : SearchMyMemo', c || []);
          //document.body.remove();
          setTimeout(() => location.reload(), 1000)
          return false
        } catch (e) {
          alert(e + "\n入力された文字列がうまくparseできなかったので設定を変更しません\n正しいJSON書式になっているか確認してください");
          return false
        }
      }
    }
    if (key == KEYRESETMEMOAUTO) { // Shift+2::reset automemo
      e.preventDefault();
      var str = pref(SITE.id + ' : SearchMyMemo') || [];
      if (alsoClearBenchMemoWhenClearAutoMemo) {
        var newstr = str.filter(e => !(e.c == COLOR3 || e.c == COLORCPUSCORE || e.c == COLORCPUSCOREPM)); // CPUスコアもリセット
        var newstr2 = str.filter(e => (e.c == COLOR3 || e.c == COLORCPUSCORE || e.c == COLORCPUSCOREPM)); // CPUスコアもリセット
      } else {
        var newstr = str.filter(e => !([COLOR3, COLOR_ALERT_WORD].includes(e.c)));
        var newstr2 = str.filter(e => !(newstr.includes(e)));
      }
      if (confirm(SITE.id + "\n\n" + KEYRESETMEMOAUTO + ":\n自動メモ（" + newstr2.length + "）のみ全て削除します。良いですか？\n\n消すもの：\n" + JSON.stringify(newstr2))) {
        pref(SITE.id + ' : SearchMyMemo', JSON.stringify(newstr));
        popup2("自動メモをクリアしました", 1);
        document.body.remove();
        location.reload();
      }
      return false;
    }
    if (key == "Shift+#") { // Shift+3::#::hide/show memo
      e.preventDefault();
      GF.numbersign = ((GF.numbersign || 0) + 1) % 4
      if (GF.numbersign == 1) $(elegeta('#pickbox,.setSlider,[floated],.relallArea,span#notiApiOn.ignoreMe,table#ftbl input[name="upfile"]:visible')).attr("data-numbersign", "1").hide()
      if (GF.numbersign == 2) $(elegeta(`*[data-mbt],.yhmMyMemo:visible`)).attr("data-numbersign", "1").hide()
      if (GF.numbersign == 3) {
        //if(ld("amazon")) //$('.s-line-clamp-4').css({ '-webkit-line-clamp': '4' }); // 商品名の最大行数を拡大
        if (ld("amazon")) addstyle.remove('.s-line-clamp-4 { -webkit-line-clamp:8; } a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal { display: inline !important; }') // メモが隠れないようにする

        $(elegeta(`.gglniaddedsortbutton , .yodotankastatus , td.ignoreMe.quo,span.adddel,span.allpopupbox,.ignoreMe.shibo,#shiboButton,#fchVerticalThreadTitle,.setSlider,#ftxa,span.quoteSpeechBalloon,.quoteSpeechBalloonImg , span.ignoreMe.ppr , span.ppr2 , span.kangengo , .amazonstarkazu , a.amamanga.ignoreMe , .xcanceldate8 , div#filterExpanded , span#playAllButton , span#instantPlaylistButton , div.udm-delivery-block > div.a-color-base > div.a-column.a-span12 , .shukkaamazon , div.tile--img__dimensions , .eiyoukeisanlink:visible`).concat(elegeta('ul.js_addLatestSalesOrder > li:text*=にお届け')).concat(elegeta(`div.a-size-base.a-color-secondary > div.a-row.s-align-children-center:nth-child(1 of div.a-row.s-align-children-center):text*=にお届け`))).attr("data-numbersign", "1").hide()
      }
      if (GF.numbersign == 0) {
        //if(ld("amazon")) //$('.s-line-clamp-4').css({ '-webkit-line-clamp': '8' }); // 商品名の最大行数を拡大
        if (ld("amazon")) addstyle.add('.s-line-clamp-4 { -webkit-line-clamp:8; } a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal { display: inline !important; }') // メモが隠れないようにする

        ;
        $(`*[data-numbersign="1"]:hidden`).attr("data-numbersign", "0").show()
      }
      if (SITE.funcMemo) SITE.funcMemo();
      return false;
    }
    if (SITE.maxpriceXP && !isDetail) {
      if (key == KEYMAXP) { // maxpriceXP
        e.preventDefault();
        let ele = eleget0(SITE.maxpriceXP);
        if (ele) {
          ele.focus();
          ele.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
          ele.select();
          popup2("上限価格にフォーカス", 1);
        }
      }
      return false;
      //}
    }
  }
  //  document.addEventListener('keydown', keyListen, false)
  document.addEventListener('keydown', keyListen, true) // youtube/watchで先取りするためにtrue

  document.addEventListener("mousemove", e => ((mousex = e.clientX), (mousey = e.clientY), (hovertimer = 0), undefined), false)
  //document.addEventListener("mousemove", function(e) { mousex = e.clientX; mousey = e.clientY; hovertimer = 0; }, false);
  document.addEventListener("fullscreenchange", e => elegeta('.ignoreMe#yafuokuhelp , .ignoreMe.phov , .ignoreMe#hoverHelpPopup')?.forEach(e => e?.remove()))

  // AP継ぎ足しを監視
  setTimeout(() => { run() }, (SITE.delayAutoWeighting || 0) * WAIT || (SITE.delay || 0));
  document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { setTimeout(() => { evt?.target?.nodeType == 1 && run(evt.target, "APed"); }, SITE?.APDelay || 0) }, false);

  function dni(node, callback) {
    const observerDni = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') mutation?.addedNodes?.forEach(e => callback(e))
      });
    });
    observerDni.observe(document, { childList: true, subtree: true });
    return () => observerDni.disconnect();
  }

  // DOM追加を監視
  var DNIDelay = null;
  //  if (!isDetail && SITE.observe) {
  if (SITE.observe) {
    debug && dc("observe DNI");
    GF.dniRemove = dni(document.body, dnifunc)
    //document.body.addEventListener('DOMNodeInserted', dnifunc, false);
    //document.body.addEventListener('transitionend', dnifunc, false); // テスト

    function dnifunc(ele) {
      //      let ele = e.target;
      //      if (DNIDelay) return;
      if (ele?.classList?.contains("ignoreMe")) return;
      if (SITE.observeId && (ele.id !== SITE.observeId)) return;
      if (SITE.observeClass && !SITE.observeClass.includes(ele.className)) return;
      if (SITE.observeTagName && SITE.observeTagName !== ele.tagName) return;
      if (SITE.ignoreDNI && SITE.ignoreDNI(ele)) return;
      if (ele.className && SITE.observeClassNameNot && SITE.observeClassNameNot.includes(ele.className)) return;
      if (DNIDelay) {
        if (dniCancel || SITE.dniCancel) { clearTimeout(DNIDelay) } else { return; }
      }

      DNIDelay = setTimeout(
        //        ((ele)=>{return ()=>{
        (function(ele) {
          return function() {
            run(document.body, "observed", ele); // ここで run(ele.parentNode.parentNode, "observed"); などとすると速くなるが～searchXPが何世代まで親を参照するか分からないので全サイトの動作確認が必要
            //            run(SITE.observeFunc?ele.parentNode:document.body, "observed", ele); // ここで run(ele.parentNode.parentNode, "observed"); などとすると速くなるが～searchXPが何世代まで親を参照するか分からないので全サイトの動作確認が必要
            DNIDelay = null;
          }
          //        })(ele), SITE.observe || 0);
        })(ele), Math.max(GF?.runElapsed || 0, SITE?.observe || 0) || SITE.observe || 0);
    }
  }

  // タブにフォーカスが戻ったら再実行
  if (SITE.redoWhenRefocused) window.addEventListener("focus", () => {
    if (prefChanged("translucent") || prefChanged(SITE.id + ' : SearchMyMemo') || prefChanged(SITE.id + ' : SearchHideTitle')) {
      restoreHidden()
    } // prefCache:キャッシュと保存されたデータが同一だったら再実行しない
  })

  // 詳細画面に対応しているサイトかredoWhenReturnedが1ならタブにフォーカスが戻ったら再実行する
  if (SITE.detailTitleXP || SITE.redoWhenReturned) {
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    function handleVisibilityChange() {
      if (SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE))) { return; }
      if (document[hidden]) {} else {

        //        if (!(JS(prefCache[SITE.id + ' : SearchMyMemo'] || []) !== JS(pref(SITE.id + ' : SearchMyMemo') || []) || JS(prefCache[SITE.id + ' : SearchHideTitle'] || []) !== JS(pref(SITE.id + ' : SearchHideTitle') || []))) { return }
        if (!prefChanged("translucent") && !prefChanged(SITE.id + ' : SearchMyMemo') && !prefChanged(SITE.id + ' : SearchHideTitle')) { return }

        let prefHide = (SITE.autoTranslucentURLRE && location.href.match(SITE.autoTranslucentURLRE)) || (pref("translucent") == "on");
        if (prefHide !== disableHide) {
          disableHide = (SITE.autoTranslucentURLRE && location.href.match(SITE.autoTranslucentURLRE)) || (pref("translucent") == "on");
          restoreTranslucent();
        }
        restoreHidden();
      }
    }
  }

  // タブにフォーカスが戻った時等用　隠していた要素のうち非表示登録から外されたものを再表示
  function restoreHidden() {
    if (isDetail) {
      //      showByTitle(eleget0(SITE.detailTitleXP).textContent.replaceTitle());
      //      var dtitle = eleget0(SITE.detailTitleXP).textContent.replaceTitle();
      var d = eleget0(SITE.detailTitleXP)
      if (d && !(/\"/.test(d.textContent?.normalize("NFC").replaceTitle()))) showByTitle(d.textContent?.normalize("NFC").replaceTitle());
    }
    if (!isDetail || SITE.hideListEvenDetail) {
      //let resist = pref(SITE.id + ' : SearchHideTitle') || [];
      let resist = JP(JS(pref(SITE.id + ' : SearchHideTitle') || [])?.normalize("NFC"))
      debug && sw("")
      for (let ele of elegeta('//*[@data-hidden="1" or @data-hidden="2"]')) {
        //let title = getTitleFromParent(ele, 1); // これだとXP2はヒットしないので再表示されない：保留
        let title = ele.dataset.yhmkey;
        if (SITE.titleProcessFunc) title = SITE.titleProcessFunc(title);
        let i = resist.indexOf(title); // ここは常に全体一致判定なのでcontains判定のサイトでは少し余計に再表示してしまう（でもまたすぐ隠す）
        if (i === -1) {
          showByTitle(title);
          //if(debug)V&&dc(title + "は再表示")
        }
      }
      debug && sw("show by returned")

    }
    setTimeout(() => { run(document.body, "returned"); }, 0);
    if (SITE.funcQ) SITE.funcQ();
  }

  // ヤフオク　キーワードの検索対象を切り替えるボタン
  if (SITE.id == "YAJ2") {
    if (location.href.indexOf("://page.auctions.yahoo.co.jp/jp/auction/") == -1) {
      for (let kw of [{ t: "タイトルからのみ検索する", s: "&f=0x2" }, { t: "タイトルと商品説明から検索する", s: "&f=0x4" }]) {
        var ele = eleget0('//div[@class="ptsOption"]/a/../../..');
        if (ele && !(location.href.match(kw.s))) {
          var ele2 = ele.parentNode.insertBefore(document.createElement("a"), ele.nextSibling);
          ele2.innerHTML = kw.t + "　";
          ele2.href = location.href.replace(/\&f\=.*(\&|$)/, "") + kw.s;
        }
      }
    }
  }

  // URL変化を監視、変化したら再実行
  if (SITE.urlHasChangedCommonFunc && !observeUrlHasChangedCommon) {
    var observeUrlHasChangedhrefCommon = location.href;
    var observeUrlHasChangedCommon = new MutationObserver(function(mutations) {
      if (observeUrlHasChangedhrefCommon !== location.href) {
        prefCacheClear();
        observeUrlHasChangedhrefCommon = location.href;
        SITE.urlHasChangedCommonFunc();
      }
    });
    observeUrlHasChangedCommon.observe(document, { childList: true, subtree: true });
  }

  async function run(node = document.body, runmode = "1st", ele = null) { // 1st observed returned
    GF.runStart = Date.now()
    if (GF?.isFile) return;
    //    if(debug)V&&dc("runmode : " + runmode + " / node tag: " + node?.tagName + " / ele.tag : " + ele?.tagName + " / ele.class : " + ele?.className + " ele.id : " + ele?.id); // beautify
    debug && dc("runmode : " + runmode + " / node tag: " + (node.tagName ? node.tagName : "-") + (ele ? (" / ele.tag : " + (ele.tagName ? ele.tagName : "-") + " | ele.class : " + (ele.className ? ele.className : "-") + " | ele.id : " + (ele.id ? ele.id : "-")) : ""));
    debug && sw("reset");
    if (pauseAll) return;
    debug && sw("run");

    //    if (debug>=3) { elegeta(SITE.listTitleXP).forEach(e => debugEle(e, "force"));elegeta(SITE.listTitleXP2).forEach(e => debugEle(e, "force")) }
    if (debug >= 3 && !(SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE)))) {
      elegeta(SITE.listTitleXP).concat(elegeta(SITE.listTitleXP2)).forEach(e => {
        debugEle(e, "force autoRemove");
        //setTimeout(()=>{debugEle(e,"remove");},2000);
      });
    }
    // サイトごとの個別処理
    if (SITE.func) { SITE.func(node); }

    elegeta("cacheon");
    eleget0("cacheon")

    // ホバー時の操作案内のポップアップを登録
    //    if (ENABLE_HELP_CONCLUSION) {
    if ((debug >= 1 || ENABLE_HELP_CONCLUSION) && !(SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE))) && (!SITE?.preventHelpFunc || !SITE?.preventHelpFunc())) {
      var lh = (!isDetail && SITE.helpInBlock) ? $("<span class='ignoreMe phov' id='yafuokuhelp' style='cursor:pointer; color:#505050; font-size:15px; background:#ffffffb0; padding:0px 4px 0px 4px; border-radius:9px;border:#505050 1px solid; position: absolute; bottom:2px; right: 20em;' title='クリックでこのガイドを一時的に消す'>Q：非表示　W：アンドゥ　1：○メモ　2：×メモ</span>") : $("<span class='ignoreMe phov' id='yafuokuhelp' style='all:initial; cursor:pointer; z-index:1000; color:#505050; font-size:15px; background:#ffffffc0; padding:3px; border-radius:9px;border:#505050 1px solid; position:fixed; bottom:1em; right: 1em;' title='クリックでこのガイドを一時的に消す'>Q：非表示　W：アンドゥ　1：○メモ　2：×メモ</span>");
      var lh2 = $(`<span class='ignoreMe phov2' id='yafuokuhelp' style='all:initial; cursor:pointer; z-index:2147483647; color:#505050; font-size:15px; background:#ddeeffc0; padding:3px; border-radius:9px;border:#304050 1px solid; position:fixed; bottom:1em; right: 1em;' title='クリックでこのガイドを一時的に消す'>${SITE.XP2name||""}Q：非表示　W：アンドゥ${ SITE.XP2memo?"　1：○メモ　2：×メモ":""}</span>`);
      // 画面全体で１つだけ＝詳細画面の方
      if (SITE.detailURLRE && location.href.match(SITE.detailURLRE)) {
        $('span.phov').remove();
        lh.appendTo(document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) });
        debug && sw("zentai help");
        //SITE.listTitleXP2 + "" → SITE.listTitleXP2 + "/../.."
        $(node).find(elegeta(SITE.listHelpXP2 || (SITE.listTitleXP2 ? SITE.listTitleXP2 + "" : undefined))).off("mouseenter mouseleave").hover(function() {
          $('span.phov').fadeTo(0, 0);
          lh2.appendTo(document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) });
        }, function() {
          $(".phov2").remove();
          $('span.phov').fadeTo(0, 1);
        }); // test
      } else {
        // 一画面に複数ある＝検索結果＆セラー画面の方
        if (runmode !== "observed") { // 初処理＋追記部分のみ＝重複しない処理
          $(elegeta(SITE?.box, node).concat(elegeta(SITE.listHelpJQS, node)).concat(elegeta(SITE.listHelpXP, node)) || (elegeta(SITE.listTitleXP ? SITE.listTitleXP + "/../.." : "", node))).off("mouseenter mouseleave").hover(function() { lh.appendTo(SITE.helpInBlock ? this : document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) }); }, function() { $(".phov").remove() });

          $(node).find(elegeta(SITE.listHelpXP2 || (SITE.listTitleXP2 ? SITE.listTitleXP2 + "" : undefined))).off("mouseenter mouseleave").hover(function() {
            $('span.phov').fadeTo(0, 0);
            lh2.appendTo(document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) });
          }, function() {
            $(".phov2").remove();
            $('span.phov').fadeTo(0, 1);
          }); // test
        } else { // 重複ありの処理
          $(elegeta(SITE?.box, node).concat(elegeta(SITE.listHelpJQS, node)).concat(elegeta(SITE.listHelpXP, node)) || (elegeta(SITE.listTitleXP ? SITE.listTitleXP + "/../.." : "", node))).off("mouseenter mouseleave").hover(function() { lh.appendTo(SITE.helpInBlock ? this : document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) }); }, function() { $(".phov").remove() });
          $(node).find(elegeta(SITE.listHelpXP2 || (SITE.listTitleXP2 ? SITE.listTitleXP2 + "" : undefined))).off("mouseenter mouseleave").hover(function() {
            $('span.phov').fadeTo(0, 0);
            lh2.appendTo(document.body).click(function() { $(this).fadeOut(100).queue(function() { $(this).remove() }) });
          }, function() {
            $(".phov2").remove();
            $('span.phov').fadeTo(100, 1);
          }); // test
        }
        debug && sw("1gyou help");
      }
    }

    // 高速化のためにtitleXP/2の要素のtextContentに含まれるメモ・NGだけの集合を作る＞documemtのtextContent＞documemtのinnerHTML　の順
    let fastmode = !fasttest ? null :
      SITE.listTitleSearchFunc ? null :
      SITE.title || (!(/\*\*alt\*\*|\+\+alt\+\+|\+\+title\+\+|\+\+url\+\+|\*\*url\*\*/.test(SITE.listTitleSearchXP + " " + SITE.detailTitleSearchXP + " " + SITE.listTitleMemoSearchXP)) && !SITE.listTitleSearchFunc);
    //    let fasttext = !fasttest ? null : fastmode ? node.textContent || "" : node.innerHTML || "";
    let fasttext = !fasttest ? null :
      SITE.draft ? SITE.draft(node) :
      fastmode ? node.textContent || "" :
      node.innerHTML + node.textContent || ""; // +node.textContentはnew5chで必要　他にバグ出るかも？
    if (fasttext > "") fasttext = fasttext.replace(/\\u0026|&amp;/gm, "&"); //prompt(fasttext,fasttext) // node.innerText中の&がunicodeエスケープされているのでもとに戻す youtubeで必要
    fasttext = fasttext?.normalize("NFC")
    var fastMatch = null; // !fasttest ? null : fastmode ? (SITE.title ? elegeta(SITE.title, node) : []).concat(SITE.listTitleXP ? elegeta(SITE.listTitleXP, node) : []).concat((SITE.listTitleXP2 ? elegeta(SITE.listTitleXP2, node) : [])).concat((SITE.detailTitleXP ? elegeta(SITE.detailTitleXP, node) : [])) : null;
    debug && sw(fastmode ? "use fast test" : "NOT fast mode")
    if (fasttest && fastmode) { debug && sw("draft by fastMatch") } else { debug && sw("draft by innerHTML") }

    // メモ貼りを実行 memo::
    if (runmode === "observed" || runmode === "returned") {
      debug && sw("reset");
      $('span[data-mbt="1"]').remove();
      debug && sw("removing memo");
    }
    var isnotChrome = (window.navigator.userAgent.toLowerCase().indexOf('chrome') == -1);

    var titles = pref(SITE.id + ' : SearchMyMemo') || []
    if (SITE?.memoOnRead) titles = SITE.memoOnRead(titles)
    if (titles) { //    if (pref(SITE.id + ' : SearchMyMemo')) {
      var i = 0;
      var hitTitle = [];
      if (fasttest) {
        if (fastMatch) {
          for (let ele of fastMatch) { hitTitle = hitTitle.concat(titles.filter(t => { return ele.textContent.indexOf(t.t?.normalize("NFC")) !== -1 })); } debug && sw("mymemo draft-test");
          debug && sw("memo/fastMatch")
        } else { // document.innerHTMLにタイトルが含まれるメモに絞り込む
          hitTitle = hitTitle.concat(titles.filter(t => fasttext.includes(t.t?.normalize("NFC")))); //453,463
          debug && sw(`memo/indexOf ${hitTitle.length}`)
        }
        hitTitle = [...new Set(hitTitle)];
        //        for (let a of hitTitle.sort(function(a, b) { return isnotChrome ? (a.c == COLORCPUSCORE && b.c !== COLORCPUSCORE ? 1 : 0) : (a.c != COLORCPUSCORE && b.c == COLORCPUSCORE ? -1 : 0); })) {
        //hitTitle.sort((a,b)=>function(a, b) { return isnotChrome ? (a.c == COLORCPUSCORE && b.c !== COLORCPUSCORE ? 1 : 0) : (a.c != COLORCPUSCORE && b.c == COLORCPUSCORE ? -1 : 0); })
        hitTitle = hitTitle.map(v => ({ v, cpu: [COLORCPUSCORE, COLORCPUSCOREPM].includes(v.c) ? 1 : 0 })).sort((a, b) => a.cpu - b.cpu).map(v => v.v)
        /*test 140675回実行 / 1sec , 0.007108583614714768ミリ秒/１実行 ()=>{       hitTitle=hitTitle.map(v=>({v,cpu:[COLORCPUS
          test 31415回実行 / 1sec , 0.031831927423205474ミリ秒/１実行 ()=>{ hitTitle.sort((a,b)=>function(a, b) { return isno
          test 31292回実行 / 1sec , 0.03195704972516937ミリ秒/１実行 ()=>{ hitTitle.sort((a,b)=>function(a, b) { return isno
          test 145781回実行 / 1sec , 0.00685960447520596ミリ秒/１実行 ()=>{       hitTitle=hitTitle.map(v=>({v,cpu:[COLORCPUS
*/
        for (let a of hitTitle) {
          memoByTitle(a.t, a.m, node, a.c || COLOR1, a.u);
          //await waitDraw(1000)
        }
        debug && sw("memo/fastTest")
      } else {
        //        for (let a of pref(SITE.id + ' : SearchMyMemo').sort(function(a, b) { return isnotChrome ? (a.c == COLORCPUSCORE && b.c !== COLORCPUSCORE ? 1 : 0) : (a.c != COLORCPUSCORE && b.c == COLORCPUSCORE ? -1 : 0); })) {
        hitTitle = hitTitle.map(v => ({ v, cpu: [COLORCPUSCORE, COLORCPUSCOREPM].includes(v.c) ? 1 : 0 })).sort((a, b) => a.cpu - b.cpu).map(v => v.v)
        //        hitTitle.sort(function(a, b) { return isnotChrome ? (a.c == COLORCPUSCORE && b.c !== COLORCPUSCORE ? 1 : 0) : (a.c != COLORCPUSCORE && b.c == COLORCPUSCORE ? -1 : 0); })
        for (let a of hitTitle) {
          memoByTitle(a.t, a.m, node, a.c || COLOR1, a.u);
        }
        debug && sw("memo/slow")
      }
    }
    debug && sw("mymemo ( draft-matched : " + ((hitTitle || []).length) + " )"); //JSON.stringify(hitTitle)

    // 非表示を実行 hide::
    let keyfunchelp = SITE?.keyFunc?.map(v => v?.help ? `　${v?.help}` : "")?.join("") || ""
    var help = (KEYHIDE + ":非表示　" + KEYUNDO + ":アンドゥ　" + (isHidePartialMatch ? (SITE.disableKeyB ? "" : KEYBW + ":NGワード　") : "") + KEYEDIT + ":NG編集　" + KEYMEMO1 + KEYMEMO2 + ":メモを追加　" + KEYMEMO1S + KEYMEMO2S + ":自由メモ　" + KEYMEMO5 + KEYMEMO6 + ":定型メモ　" + KEYRESETMEMO + ":メモを編集　" + (SITE.automemoURLRE ? KEYRESETMEMOAUTO + ":自動メモのみ全削除　" : "") + KEYTOGGLEtranslucent + ":半透明") + ((SITE.wholeHelp && SITE.wholeHelp[0]() && SITE.wholeHelp[1]) || "") + keyfunchelp;
    if (pref(SITE.id + ' : SearchHideTitle')) {
      var i = 0;
      var hitTitle = [];
      //      var titles = pref(SITE.id + ' : SearchHideTitle') //.map(q=>q?.nfd())
      var titles = JP(JS(pref(SITE.id + ' : SearchHideTitle'))?.normalize("NFC")) //.map(q=>q?.nfd())
      if (fasttest) {
        if (fastMatch) {
          for (let ele of fastMatch) {
            var a = titles.filter(t => ele.textContent.indexOf(t) !== -1);
            if (a) hitTitle = hitTitle.concat(a);
          }
        } else { // document.innerHTMLにタイトルが含まれるメモに絞り込む
          hitTitle = titles.filter(t => { return fasttext.indexOf(t) !== -1 });
        }

        hitTitle = [...new Set(hitTitle)];
        debug && sw("block draft-test");
        for (let title of hitTitle || []) { i += hideByTitle(title, node); }
        debug && sw("block ( actually : " + i + " / draft-matched : " + ((hitTitle || []).length) + (fastMatch ? " / target : " + fastMatch.length : "") + " )");
      } else {
        for (let title of pref(SITE.id + ' : SearchHideTitle') || []) { i += hideByTitle(title, node); }
        debug && sw("block ( actually : " + i + "  )");
      }
      if (i) { help = i + "個を非表示にしました\n" + help + (debug && fasttest ? " \n\nドラフトでマッチ：" + (JSON.stringify(hitTitle.slice(0, 9))) : ""); }
    }
    // 全体ヘルプを表示
    //    if (debug || (ENABLE_HELP_CONCLUSION && (SITE.helpOnDNI || (runmode === "1st" && SITE.listTitleXP)) && !(SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE))))) popup2(help, 1);
    if (debug || (ENABLE_HELP_CONCLUSION && (SITE.helpOnDNI || (runmode === "1st" && (SITE.title || SITE.listTitleXP))) && !(SITE.disableUrlRE && (location.href.match(SITE.disableUrlRE))))) popup2(help, 1.5);

    elegeta("cacheoff");
    eleget0("cacheoff")

    // 自動メモを探索＆製作
    function mekeautomemo() {
      if (ENABLE_AUTOMEMO && SITE?.automemoFunc &&
        (SITE?.automemoURLRE && location?.href?.match(SITE.automemoURLRE) || isDetail || (SITE?.automemoForceFunc && SITE?.automemoForceFunc()))
      ) { SITE?.automemoFunc(); }
    }
    mekeautomemo()
    for (let t = 0; t < ENABLE_AUTOMEMO; t++) {
      setTimeout(() => {
        mekeautomemo()
      }, (t + 1) * 2000)
    }
    debug && sw("automemo")
    //debug&&t>0?popup3( t * t / 2 * 1000,2,1):0; }
    //}

    if (SITE.funcFinally) SITE.funcFinally(disableHide, i); // Qが有効、非表示にした個数
    GF.runElapsed = Date.now() - GF.runStart
    debug && sw(`run total : ${GF.runElapsed}`)
    return;
  }

  function restoreTranslucent() {
    if (pref(SITE.id + ' : SearchHideTitle')) {
      let fastmode = !fasttest ? null : SITE.listTitleSearchFunc ? null : SITE.title || (!(/\*\*alt\*\*|\+\+alt\+\+|\+\+title\+\+|\+\+url\+\+|\*\*url\*\*/.test(SITE.listTitleSearchXP + " " + SITE.detailTitleSearchXP + " " + SITE.listTitleMemoSearchXP)) && !SITE.listTitleSearchFunc);
      //      var fasttext = !fasttest ? null : fastmode ? document.body.textContent?.nfd() || "" : document.body.innerHTML?.nfd() || "";
      var fasttext = !fasttest ? null : fastmode ? document.body.textContent || "" : document.body.innerHTML || "";
      fasttext = fasttext?.normalize("NFC")

      var fastMatch = null //!fasttest ? null : fastmode ? (SITE.title ? elegeta(SITE.title) : []).concat(SITE.listTitleXP ? elegeta(SITE.listTitleXP) : []).concat((SITE.listTitleXP2 ? elegeta(SITE.listTitleXP2) : [])).concat((SITE.detailTitleXP ? elegeta(SITE.detailTitleXP) : [])) : null;

      debug && dc(fastmode ? "restoreTranslucent : use fastmode" : "restoreTranslucent : not use fastmode")
      debug && sw("reset")
      var i = 0;
      var hitTitle = [];
      //var titles = pref(SITE.id + ' : SearchHideTitle').map(e => e = e)
      var titles = JP(JS(pref(SITE.id + ' : SearchHideTitle'))?.normalize("NFC"))
      if (fasttest) {
        if (fastMatch) {
          for (let ele of fastMatch) {
            //var a = titles.filter(t => ele.textContent.indexOf(t) !== -1);
            var a = titles.filter(t => ele.textContent?.normalize("NFC")?.indexOf(t) !== -1);
            if (a) hitTitle = hitTitle.concat(a);
          }
        } else {
          hitTitle = titles.filter(t => { return fasttext.indexOf(t) !== -1 });
        }
        hitTitle = [...new Set(hitTitle)];
      } else {
        hitTitle = pref(SITE.id + ' : SearchHideTitle') || []
      }
      for (let title of hitTitle) showByTitle(title, 0);
      debug && sw("restoreTranslucent")
    }
    if (SITE.funcOnTOn) SITE.funcOnTOn();
  }

  function eletext(xpa, useTextContent = false) {
    if (typeof xpa == "string") { // string
      let e = eleget0(xpa);
      if (e) debugEle(e);
      return e ? useTextContent ? e.textContent : e.innerText : "";
    } else { // array
      let text = "";
      xpa.forEach(xp => {
        elegeta(xp).forEach(e => {
          e = e.cloneNode(true, true) // 繰り替えさないようにメモは除外
          elegeta('.yhmMyMemo', e).forEach(v => v.remove())
          debugEle(e);
          text = text + ((useTextContent ? e.textContent : e.innerText) + "\n");
        })
      })
      return text;
    }
  }

  function autoMemo2(automemotarget, re, com = null) {
    if (document.visibilityState != "visible") {
      setTimeout(autoMemo2, 1000, automemotarget, re, com)
    } else {
      let node = document.body;
      let sou = automemotarget?.match(re);
      if (sou && sou.length) {
        sou.shift();
        var memo = Array.from(new Set(sou)).join(" ").replace(/[Ａ-Ｚａ-ｚ０-９．，]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)).replace(/\s{2,99}|　/gm, " ").trim();
        var title = getDetailTitle()
        if (!title) return;
        prefCacheClear()
        var tmp = pref(SITE.id + ' : SearchMyMemo') || [];
        var isExist = tmp.filter(e => e.t == title && e.m == memo);
        if (isExist.length == 0) {
          if (debug) popup3(memo, 2, 5000);
          storeMemo(title, memo, COLOR3, node);
          com == "notAppend" && document.getElementById(escape(title + memo + COLOR3))?.remove()
        }
        return true;
      }
      return false;
    }
  }

  function autoMemo(re, func) {
    let automemotarget = SITE.automemoSearchFunc();
    if (func) automemotarget = func(automemotarget)
    let node = document.body;
    let sou = automemotarget.match(re);
    if (sou && sou.length) {
      sou.shift();
      var memo = Array.from(new Set(sou)).join(" ").replace(/[Ａ-Ｚａ-ｚ０-９．，]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)).replace(/\s{2,99}|　/gm, " ").trim();
      // node.innerHTML=node.innerHTML.replace(re,"<mark>$1</mark>");
      var title = getDetailTitle()
      if (!title) return;
      var tmp = pref(SITE.id + ' : SearchMyMemo') || [];
      var isExist = tmp.filter(e => e.t == title && e.m == memo);
      if (isExist.length == 0) {
        if (debug) popup3(memo, 2, 5000);
        storeMemo(title, memo, COLOR3, node);
      }
      return true;
    }
    return false;
  }

  function getDetailTitle(x, y) {
    var ele = ((SITE.detailTitleXP && isDetail) && eleget0(SITE.detailTitleXP)) || (eleget0(SITE?.title)) || document.elementFromPoint(mousex, mousey);
    if (!ele) return;
    var title = getTitleFromParent(ele);
    if (!title) return;
    return title;
  }

  function getTitleFromParent(ele, nodisplay = 0) { // ele要素の親の出品物タイトルを返す
    if (!nodisplay)
      debug && dc("start at : " + ele.innerText);
    if (SITE.title) {
      let box = ele?.closest(SITE.box)
      if (box) {
        let title = eleget0(SITE.title, box)?.textContent?.trim()
        if (title) { return title }
        return
      }
    }
    //    if (isDetail) return tri((SITE.useText ? ele.textContent.replace(/\|/g, '\|') : ele.title || ele.textContent.replace(/\|/g, '\|') || ele.alt));
    if (isDetail) return tri((SITE.titleFunc ? SITE.titleFunc(ele) : SITE.useText ? ele.textContent.replace(/\|/g, '\|') : SITE.useURL ? ele.getAttribute("href").replace(/\?.*$/, "") : ele.title || ele.textContent.replace(/\|/g, '\|') || ele.alt));
    for (let i = 0; i < (SITE.listGen); i++) {
      if (!nodisplay)
        debug && dc("go up (" + i + ") : " + ele.innerText)
      var ele2 = elegeta(SITE.listTitleXP, ele);
      if (!nodisplay)
        debug && dc("length:" + ele2.length)
      if (ele2.length === 1 || (SITE.searchAllowLength && ele2.length)) {
        if (!nodisplay)
          debug && dc("href : " + ele2[0].getAttribute("href") + "\ntitle : " + tri((ele2[0].title + " \ntextContent : " + ele2[0].textContent.replace(/\|/g, '\|') + " \nalt : " + ele2[0].alt)));
        return SITE.titleFunc ? SITE.titleFunc(ele) : SITE.useURL ? ele2[0].getAttribute("href").replace(/\?.*$/, "") : SITE.useText ? tri(ele2[0].textContent.replace(/\|/g, '\|')) : tri((ele2[0].title || ele2[0].textContent.replace(/\|/g, '\|') || ele2[0].alt));
      }
      if (ele === document) return;
      ele = ele.parentNode;
    }
    return;
  }

  function tri(str) {
    if (!str) return "";
    if (str.match(/\"/)) { popup3("項目名に \" を含むので多分うまく処理できません"); return ""; }
    return (SITE.trim) ? str.trim() : str;
  }

  function memoElement(ele, node, color = COLOR1, memoword = "") { //12 memo
    if (!ele) return;
    var title = typeof ele === "string" ? ele : getTitleFromParent(ele);
    if (!title) return;
    if (SITE.titleProcessFunc) title = SITE.titleProcessFunc(title);
    if (!title) return;
    var memo = memoword || (prompt("『" + title + "』\nのメモを書いてください") || "").trim();
    //        storeMemo(title, sani(memo), color, node);
    storeMemo(title, memo, color, node);
    return true;
  }

  function storeMemo(title, memo, color = COLOR1, node = document, jumpUrl = null, site = SITE) {
    if (title && memo) {
      memo = sani(memo)
      let tmp = pref(site.id + ' : SearchMyMemo') || [];

      var isExist = tmp.filter(e => e.t === title && e.c === color && e.m === memo); // 重複してなければ
      if (isExist.length == 0) {

        jumpUrl ? tmp.push({ t: title, m: memo, c: color, u: jumpUrl }) : tmp.push({ t: title, m: memo, c: color })
        pref(site.id + ' : SearchMyMemo', tmp)
        memoByTitle(title, memo, node, color, jumpUrl);
      }
    }
  }

  function memoByTitle(title, memo, node, color, jumpUrl = null) {
    let titleNfc = title?.normalize("NFC")

    if ((SITE.preventMemo && SITE.preventMemo(memo)) || (title.indexOf('"') !== -1 && SITE.listTitleSearchXP)) return; // todo:タイトルに"があると正しく検索できないので処理しない
    //if ((SITE.preventMemo && SITE.preventMemo(memo)) || (title.indexOf('"') !== -1 && !SITE.box)) return; // todo:タイトルに"があると正しく検索できないので処理しない
    var xp = SITE?.listTitleMemoSearchXP?.replaceTitle(title);
    let isChapterMemo = color === COLORVIDEOTIME; // && memo.match0(/^([\d:]+)\s/)
    let memoPosition = SITE.memoPosition || "afterend"
    for (let titleEle of
        SITE.boxFuncMemo ? SITE.boxFuncMemo(title, node) :
        SITE.title ?
        SITE.titleSubstr ? elegeta(SITE.title, node).filter(e => e?.textContent?.normalize("NFC").indexOf(titleNfc) !== -1) :
        elegeta(SITE.title, node).filter(e => e?.textContent?.normalize("NFC") === titleNfc || e?.title?.normalize("NFC") === titleNfc || SITE.trim && e?.textContent?.normalize("NFC")?.trim() === titleNfc) :
        elegeta(xp, node)) {
      if (titleEle) {
        var ele1 = SITE.memoFunc ? SITE.memoFunc(titleEle) : // titleノードから位置をずらす関数
          SITE.listTitleMemoSearchXPSameGen ? titleEle :
          titleEle.parentNode;
        if (!ele1) return;
        let isCPU = memo.match(/Pentium|Celeron|Core(?:\(TM\))?\s?i\d|Ryzen|GHz|AMD.*APU/i);

        if (isChapterMemo && GF?.isNico && titleEle?.href) jumpUrl = `${titleEle?.href?.replace(/\?.*$/,"")}?from=${hms2sec(memo.match0(/^([\d:]+)\s/))}`;

        let cpubench = isCPU && `https://duckduckgo.com/?q=!ducky+${memo}+https://www.cpubenchmark.net/cpu\nhttps://duckduckgo.com/?q=!ducky+${memo}+site:https://cpu.userbenchmark.com/SpeedTest/`;

        ele1.insertAdjacentHTML(memoPosition, `<span data-mbt="1" class="ignoreMe"><span class="ignoreMe yhmMyMemo yhmMyMemo${COLOR1==color||COLORVIDEOTIME==color ? "O" : "X"}" data-yhmc="${color}" id="${escape(title + memo + color)}" title="『${ title.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")}』についたメモ（クリックで削除）${(isCPU ? "\n\n右クリックでPASSMARK検索、Alt+右でuserbenchmark検索\n"+sani(cpubench) : "") + (isChapterMemo ? "\n右クリックでこの位置から再生\n" + (jumpUrl ? jumpUrl + "\n" : "") + "Shift+Uで再生位置の列挙をコピー" : "")}" style="${ MEMOSTYLE + (isCPU ? " cursor:help; " : "") } background-color:${color};">${ memo }</span>`)
        var ele = memoPosition !== "afterend" ? ele1.firstElementChild : ele1.nextElementSibling.firstElementChild
        $(ele).hide().fadeIn(SITE.observe || memofast ? 0 : 150);

        if (SITE?.callGKSIafterMemo) {
          clearTimeout(GF?.gksiAfterMemo)
          GF.gksiAfterMemo = setTimeout(() => document.dispatchEvent(new CustomEvent('plzGKSI')), 999)
        }

        // CPUモデルナンバーを右クリックでuserbenchmark検索
        if (isCPU) {
          ele.addEventListener('contextmenu', e => {
            if (pref("lastItemName") == undefined) { // 前回の処理が終わってないとだめ
              pref("lastItemName", title);
              popup3(title);
              memo = memo.replace(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf\s]+/g, "+");
              let cpubench = e?.altKey ? `https://duckduckgo.com/?q=!ducky+${memo}+site:https://cpu.userbenchmark.com/SpeedTest/` : `https://duckduckgo.com/?q=!ducky+${memo}+https://www.cpubenchmark.net/cpu`;
              window.open(cpubench, "", "noreferrer");
              setTimeout(() => {
                if (pref("lastItemName")) {
                  popup3("Investigating " + memo + " timed out");
                  pref("lastItemName", "");
                }
              }, 30000); // 30秒以内に見ないとだめ
            }
            e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
            return false;
          }, true)
        }
        // チャプターメモメモを右クリックでその場所に移動 u::
        if (isChapterMemo) {
          ele.dataset.cm = "1"
          if (jumpUrl) ele.dataset.url = jumpUrl
          //if (/\/watch/.test(location.href) && (ele.closest("#title,.ytd-video-primary-info-renderer") || ele1?.classList?.contains("HeaderContainer-topAreaLeft"))) {
          ele.addEventListener('contextmenu', e => {
            if (/\/watch/.test(location.href) && (e?.target?.closest('#title,.ytd-video-primary-info-renderer , div[class*="grid-area_[meta]"].d_flex[class*="gap_x2"] , div[class*="grid-area_[bottom]"]') || e?.target?.closest(".HeaderContainer-topAreaLeft"))) {
              var videoEle = eleget0('video');
              if (!videoEle) return;
              videoEle.currentTime = hms2sec(memo.match0(/^([\d:]+)\s/)) || videoEle.currentTime
              //videoEle.scrollIntoView({ block: "center", behavior: "smooth" })
              e.preventDefault()
              return false;
            } else {
              var p = ele.closest('.ytd-playlist-panel-video-renderer')?.style?.display;
              p = "block !important"
              //              if (jumpUrl) ele.dataset.url = jumpUrl
              //ele.addEventListener('contextmenu', e => {
              var jumpUrl = e.target.dataset.url || null
              if (jumpUrl) {
                if (/youtu\.be/.test(jumpUrl)) jumpUrl += `&list=UL01234567890`;
                (eleget0('video') && !eleget0('video')?.paused) || e.ctrlKey ? (eleget0('video')?.pause(), window.open(jumpUrl, "", "noreferrer")) : location.href = jumpUrl;
                e.preventDefault()
                return false;
              }
              //})
            }
          }, true)
        }
        setRemoveMemo(ele, title, memo, color)
      }
    }
  }

  function setRemoveMemo(ele, title, memo, color) { // メモをクリックで消す処理
    $(ele).on("click", e => { // 遅いかも？
      e.preventDefault();
      e.stopPropagation();
      //pref(SITE.id + ' : SearchMyMemo', (pref(SITE.id + ' : SearchMyMemo') || []).filter(n => !(n.t == title && n.m == memo && n.c == color)))
      pref(SITE.id + ' : SearchMyMemo', (pref(SITE.id + ' : SearchMyMemo') || []).filter(n => !(n.t?.normalize("NFC") == title?.normalize("NFC") && n.m == memo && n.c == color)))
      for (let e of elegeta('//span[contains(@class,"yhmMyMemo") and @id="' + escape(title + memo + color) + '"]')) $(e).hide(200).queue(function() { $(this.parentNode).remove() }); //e.remove(); //ele.remove();
      document.body.dispatchEvent(new Event('yhmMyMemoRemoved'))
      //adja(document.body, "afterbegin", "<yhmmymemoremoved></yhmmymemoremoved>");
      //eleget0('yhmmymemoremoved')?.remove(); // 学園祭用に消去を告知
    })
  }

  function blockElement(ele) { //Q:: toggle
    if (!ele) return;
    var title = getTitleFromParent(ele);
    debug && dc(`got (${SITE?.box}→${SITE?.title}): 『${ title}』`)
    addNG(title);
  }

  function hideByTitle(titleOrEle, node, targetXP = SITE.listTitleSearchXP) {
    if (typeof titleOrEle === "object") { titleOrEle = titleOrEle.textContent }
    var titleNfcH = titleOrEle.normalize("NFC")
    let i = 0;
    if (!isDetail || SITE.hideListEvenDetail) {
      let resHit = [];
      if (SITE.listTitleSearchFunc) resHit = SITE.listTitleSearchFunc(titleOrEle); // 主に5ch用、レス中キーワードNG
      // １項目ずつ
      for (let ele of (typeof titleOrEle === "object" ? [titleOrEle] :
          SITE.boxFunc ? SITE.boxFunc(titleOrEle, node) :
          SITE.title ? elegeta(SITE.title, node).filter(v => (SITE.titleProcessFunc ? SITE.titleProcessFunc(v.textContent?.normalize("NFC")?.trim()) : v.textContent?.normalize("NFC")?.trim()) === titleNfcH).map(v => v.closest(SITE.box)).concat(resHit) : elegeta(targetXP.replaceTitle(titleOrEle), node)).concat(resHit)) { // titleがテキストなら項目タイトルにヒットする要素、DOM要素なら直接それを隠す

        if (!ele) continue;
        i++;
        gmDataList_add(ele, "gmHideByyhm");
        if (!disableHide && (!SITE.forceTranslucentFunc || !SITE.forceTranslucentFunc(ele))) {
          $(ele).fadeOut(17);
          ele.dataset.hidden = "1";
          ele.dataset.yhmkey = titleNfcH
          if (SITE.funcHidden) SITE.funcHidden(ele, "hide")
        } else {
          ele.style.opacity = "0.75";
          setTimeout(function() { ele.style.opacity = "0.50" }, 17 * 2);
          ele.dataset.hidden = "2"; // 必要？
          ele.dataset.yhmkey = titleNfcH
          //elegeta('//*[text()="' + titleOrEle + '"]').forEach(e => { debugEle(e, "autoRemove") });
          if (!ele.title) ele.title = `非表示登録『${titleOrEle}』にヒット`
          ele.dataset.whyitishidden = `非表示登録『${titleOrEle}』にヒット`
          if (SITE.funcHidden) SITE.funcHidden(ele, "hide")
        }
      }
    }
    if (isDetail) {
      // 詳細：画面全体
      if (isDetail && SITE.detailTitleXP && SITE.detailTitleSearchXP) {
        var xp = SITE.detailTitleSearchXP.replaceTitle(titleOrEle) // isearでハイライトされていると×
        for (let ele of
            SITE.boxFunc ? SITE.boxFunc(titleOrEle, node) :
            elegeta(xp, node)) {
          if (!ele) continue;
          gmDataList_add(ele, "gmHideByyhm");
          debug && dc(xp, ele, ele.textContent);
          i++;
          ele.style.opacity = "0.5";
          if (!ele.title) ele.title = `非表示登録『${titleOrEle}』にヒット`
          ele.dataset.whyitishidden = `非表示登録『${titleOrEle}』にヒット`
        }
      }
    }
    return i;
  }

  function showByTitle(titleOrEle, time = 34, xpath = SITE.listTitleSearchXP) {
    if (typeof titleOrEle === "object") { titleOrEle = titleOrEle.textContent }
    if (typeof titleOrEle === "string") { var titleNfcH = titleOrEle.normalize("NFC") }

    //    if (!xpath) return
    if (!isDetail || SITE.hideListEvenDetail) {
      let resHit = [];
      if (SITE.listTitleSearchFunc) resHit = SITE.listTitleSearchFunc(titleOrEle);
      // １項目ずつ
      for (let ele of (typeof titleOrEle === "object" ? [titleOrEle] :
          SITE.boxFunc ? SITE.boxFunc(titleOrEle, document) :
          SITE.title ? elegeta(SITE.title).filter(v => (SITE.titleProcessFunc ? SITE.titleProcessFunc(v.textContent?.normalize("NFC")?.trim()) : v.textContent?.normalize("NFC")?.trim()) === titleNfcH).map(e => e?.closest(SITE.box)).concat(resHit) : elegeta(xpath.replaceTitle(titleNfcH))).concat(resHit)) {

        if (!ele) continue;

        gmDataList_remove(ele, "gmHideByyhm");
        if (!gmDataList_includesPartial(ele, 'gmHideBy')) {

          if (ele) ele.style.opacity = "1";
          $(ele).fadeIn(time);
          //        delete ele.dataset.hidden;
          if (ele) ele.dataset.hidden = null; //ele.dataset.yhmkey=null;
          //setTimeout(function() { ele.style.opacity = "1" }, 17 * 2);
          if (SITE.funcHidden) SITE.funcHidden(ele, "show")
        }
      }
    }
    if (isDetail) {
      // 詳細：画面全体
      if (isDetail && SITE.detailTitleXP && SITE.detailTitleSearchXP) {
        var xp = SITE.detailTitleSearchXP.replaceTitle(titleOrEle) // isearでハイライトされていると×
        for (let ele of
            SITE.boxFunc ? SITE.boxFunc(titleOrEle, document) :
            elegeta(xp)) {
          if (!ele) continue;
          gmDataList_remove(ele, "gmHideByyhm");
          if (!gmDataList_includesPartial(ele, 'gmHideBy')) {
            ele.style.opacity = "1";
          }
        }
      }
    }
  }

  function addNGWord() {
    let tips = SITE?.Bsyntax2 ? "独自構文Tips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR\n\n" : "";
    var newWord = (prompt(`非表示にしたい項目が含むNGワードを入力してください${SITE.QRule||""}\nすでに登録されている文字列を入力するとそれを削除します\n\n${tips}現在の全体\n${JSON.stringify(pref(SITE.id + ' : SearchHideTitle') || []) }\n\n`) || "").trim();
    newWord = SITE?.Bsyntax2 ? newWord.replace(/^S$/, "??").replace(/^S([\s　\|｜])/, "??$1").replace(/([\s　\|｜!！])S([\s　\|｜])/, "$1??$2").replace(/([\s　\|｜!！])S$/, "$1??").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*") : newWord // 独自構文を正規表現に変換
    if (newWord && (pref(SITE.id + ' : SearchHideTitle') || []).includes(newWord) && confirm(`${newWord}\nはすでに存在します\n削除しますか？\n\n`) == false) return;
    addNG(newWord);
  }
  /*  function addNGWord() {
      var newWord = (prompt(`非表示にしたい項目が含むNGワードを入力してください${SITE.QRule||""}\nすでに登録されている文字列を入力するとそれを削除します\n\n現在の全体\n${JSON.stringify(pref(SITE.id + ' : SearchHideTitle') || []) }\n\n`) || "").trim();
      if (newWord && (pref(SITE.id + ' : SearchHideTitle') || []).includes(newWord) && confirm(`${newWord}\nはすでに存在します\n削除しますか？\n\n`) == false) return;
      addNG(newWord);
    }
  */

  function addNG(title, opt = "dispall") {
    if (!title) return;
    if (SITE.titleProcessFunc) title = SITE.titleProcessFunc(title);
    if (!title) return;
    let resist = pref(SITE.id + ' : SearchHideTitle') || [];
    let i = resist.indexOf(title);
    if (i !== -1) {
      resist.splice(i, 1);
      pref(SITE.id + ' : SearchHideTitle', resist);;
      popup2("『" + title + "』\nを非表示登録から削除しました", 1, " background-color:#446; ", "bottom", opt);
      showByTitle(title);
      if (isDetail && SITE.showFunc) SITE.showFunc();
    } else {
      resist.push(title);
      pref(SITE.id + ' : SearchHideTitle', resist);
      popup2("『" + title + "』\nを非表示登録しました（" + KEYUNDO + ":取り消し　" + KEYEDIT + ":編集）", 1, "", "bottom", opt);
      hideByTitle(title);
    }
  }

  // キャッシュ付き
  var elegetaCacheXP = "";
  var elegetaCacheLastTime = new Date();
  var elegetaCacheResult = [];
  var elegetaCacheNode = "";
  var ehit = 0;
  var emiss = 0;

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    if (xpath == "cacheon") {
      elegeta.cache = [];
      elegeta.cacheon = true;
      return
    } else if (xpath == "cacheoff") {
      elegeta.cache = [];
      elegeta.cacheon = false;
      return
    }
    if (elegeta.cacheon) {
      let cache = elegeta.cache.find(v => v.xpath == xpath && v.node == node)
      if (cache) {
        return cache.array;
      }
    }
    //if (typeof xpath === "function") return xpath() // !!!
    if (Array.isArray(xpath)) {
      let array = xpath.map(v => elegeta(v, node)).filter(v => v.length).flat();
      elegeta.cacheon && elegeta.cache.push({ xpath, node, array });
      return array;
    }
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=.*/g, "")
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        //        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      //if (/:invscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.top <= document.documentElement.clientHeight) }) // 画面縦内に1ピクセルでも入っている
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      //    if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
      //      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=(.*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent) || new RegExp(text).test(e?.innerText) ) }
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=(.*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return []; }
    //} catch (e) { return []; }
    elegeta.cacheon && elegeta.cache.push({ xpath, node, array });
    return array;
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (xpath == "cacheon") {
      eleget0.cache = [];
      eleget0.cacheon = true;
      return
    } else if (xpath == "cacheoff") {
      eleget0.cache = [];
      eleget0.cacheon = false;
      return
    }
    if (eleget0.cacheon) {
      let cache = eleget0.cache.find(v => v.xpath == xpath && v.node == node)
      if (cache) {
        debug && debugEle(cache.array, "random autoRemove")
        return cache.array;
      }
    }
    //if (typeof xpath === "function") return xpath() // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) {
      let ele = elegeta(xpath, node)?.shift();
      debug && debugEle(ele, "random autoRemove")
      return ele
    }
    if (!/^\.?\//.test(xpath)) {
      let array = node.querySelector(xpath);
      eleget0.cacheon && eleget0.cache.push({ xpath, node, array });
      debug && debugEle(array, "random autoRemove")
      return array
    }
    try {
      //      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      var ele = document.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let array = ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
      eleget0.cacheon && eleget0.cache.push({ xpath, node, array });
      debug && debugEle(array, "random autoRemove")
      return array;
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return null; }
    //} catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function eleget0nNP(xpath, node) { // %の前の数字は無視版
    let r = parseFloat(eleget0(xpath, node)?.textContent?.replace(/\,|(\d+[％\%])/gm, "")?.match0(/\-?[0-9\.\.]+/) || 0);
    return r
  }

  function dc(str, force = 0) {
    if (debug >= 1 || force) popup3(str, 0, 31000, "top");
    return str;
  }

  function popup3(text, i = 0, timer = 5000, alignY = "bottom") {
    if (!ENABLE_HELP_CONCLUSION) return;
    if (text === undefined || text === null) text = "<null>"
    if (typeof text == "string") text = text.slice(0, text?.match0(/\n/) ? 999 : 200);
    //    if (typeof text == "number") text = String(text);
    if (typeof text == "number") text = String(text);
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let id = Math.random().toString(36).substring(2);
    let maey = alignY == "bottom" ? 0 : elegeta(".wcspu3top").map(e => e.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b), 0) + 2;
    if (i > 0) $(`.pu3line${i}s`).remove()
    var ele = $(`<span id="wcspu3${id}" class="ignoreMe wcspu3${alignY} pu3line${i}s" style="all:initial; max-width:33%; max-height:100vh; overflow-y:auto; scrollbar-width:thin; font-family:sans-serif; position: fixed; right:0em; ${ alignY }:${((maey) + i * 18)}px; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important;  padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:#6080ff; color:white; ">${ text }</span>`).appendTo('body');
    let ey = ele[0]?.getBoundingClientRect()?.height
    //    if (ele[0].getBoundingClientRect().bottom >= (window.innerHeight)) {
    if (ele[0].getBoundingClientRect().bottom >= (window.innerHeight)) {
      elegeta('.wcspu3top').forEach(e => { e.style.top = parseFloat(e?.style?.top) - (ey) - 2 + "px" })
    }
    if (typeof text == "string") { maey += (text.match(/<br>/gmi) || []).length || 0; }
    setTimeout(() => {
      let hov = eleget0(`span#wcspu3${id}:hover`)
      if (hov) hov.addEventListener("mouseout", e => hov?.remove());
      else eleget0(`span#wcspu3${id}`)?.remove();
      //eleget0('//span[@id="wcspu3' + id + '"]')?.remove();
    }, timer);
  }
  var maet;

  function popup2(text, i = 0, style = "", position = "bottom", opt = "") {
    if (!ENABLE_HELP_CONCLUSION) return;
    text = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var mae = eleget0('span#yhmbox2');
    if (opt != "dispall") $(elegeta("#yhmbox2")).remove();
    let bgcol = (pref("translucent") != "on") ? "#6080ff" : "#909090";
    var ele = end(document.body, `<span id="yhmbox2" class="ignoreMe" style="all:initial;  max-height:100vh; overflow-y:auto; scrollbar-width:thin; font-family:sans-serif; cursor:pointer; position: fixed; right:0em; ${position}:${(i * 2 + 2) }em; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important; padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:${bgcol}; color:white; ${style}">${text}</span>`);
    //$(ele).attr("title", "クリックでこのガイドを一時的に消す").click(() => $(this).fadeOut(200).queue(() => $(this).remove()));

    (function removef(ele, timeout) {
      GF.mllID = setTimeout(ele => {
        if (!eleget0('#yhmbox2:hover')) ele?.remove();
        else removef(ele, 1000);
      }, timeout, ele)
    })(ele, 5000);
    ele.onclick = () => { var e = document.getElementById("yhmbox2"); if (e) { e.remove(); } clearTimeout(GF?.mllID); }

    //setTimeout(e => e?.remove(), 5000, ele);
    opt == "dispall" && scrollHzbox()

    function scrollHzbox() {
      elegeta('#yhmbox2').forEach((e, i, a) => {
        const isHit = (ele1, ele2, xSize = 0, ySize = 0) => ele1.getBoundingClientRect().left <= ele2.getBoundingClientRect().right + xSize && ele1.getBoundingClientRect().right >= ele2.getBoundingClientRect().left - xSize && ele1.getBoundingClientRect().top <= ele2.getBoundingClientRect().bottom + ySize && ele1.getBoundingClientRect().bottom >= ele2.getBoundingClientRect().top - ySize;
        if (a[i + 1] && isHit(e, a[i + 1], 0, 1)) {
          e.style.top = `${e.getBoundingClientRect().top-4}px`;
          e.style.bottom = "";
          requestAnimationFrame(scrollHzbox)
        }
      })
    }


  }

  function prefChanged(id) { // prefのkeyをキャッシュと見比べて変化したか？他タブで変更されていることを想定している
    let cache = prefCache[id] || null
    let present = GM_getValue(id) || null //let present = pref(id) || null
    //if (typeof cache === "object") cache = JS(cache)
    //if (typeof present === "object") present = JS(present)
    return cache !== present
    //return JS(prefCache[key] || []) !== JS(pref(key) || [])
  }

  function prefCacheEqual(id) {
    return JS(prefCache[id] || []) === JS(pref(id) || [])
  }

  function prefCacheClear() { prefCache = [] }

  function pref(name, store = null) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    if (store === null) { // 読み出し
      let data = GM_getValue(name) || GM_getValue(name);
      if (data == undefined) return null; // 値がない
      if (data.substring(0, 1) === "[" && data.substring(data.length - 1) === "]") { // 配列なのでJSONで返す
        //        try { return JSON.parse(data || '[]'); } catch (e) {
        try {
          let a = JSON.parse(data || '[]');
          prefCache[name] = data;
          return a
        } catch (e) {
          if (confirm("データベースがバグっています。クリアしますか？\n" + e)) {
            pref(name, []);
            prefCache[name] = null
          }
          return null;
        }
        //      } else return data;
      } else {
        prefCache[name] = data;
        return data;
      }
    }
    if (store === "" || (Array.isArray(store) && store?.length == 0)) { // 書き込み、削除
      GM_deleteValue(name);
      prefCache[name] = null;
      return;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(name, store);
      prefCache[name] = store
      return store;
    } else { // 書き込み、配列
      //      try { GM_setValue(name, JSON.stringify(store)); } catch (e) {
      try {
        let a = JSON.stringify(store);
        GM_setValue(name, a);
        prefCache[name] = store
      } catch (e) {
        if (confirm("データベースがバグっています。クリアしますか？\n" + e)) {
          pref(name, "");
          return null;
        }
      }
      return store;
    }
  }

  function prefRestrict(name, type) {
    let data = pref(name);
    if (!data) return data;
    if (type === "array") {
      if (typeof data === "object") {
        //            alert("correct");
        return data;
      } else {
        alert("データベースの形式に誤りがある（配列／オブジェクトでない）ためクリアします\n");
        pref(name, "");
        return [];
      }
    }
    return data;
  }

  function prefl(name, store = undefined, logLen = 50) { // prefl(name,data,len)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）・"name+Log"にlen個の履歴保存、prefl(name)で読み出し
    if (store === undefined) { // 読み出し
      return pref(name);
    } else { // 書き込み、削除
      if (store) {
        var a = pref(name + "Log") || [];
        a.unshift(store);
        a = [...new Set(a)];
        pref(name + "Log", a.slice(0, logLen));
      }
      return pref(name, store);
    }
  }

  function debugEle(ele, command = "") {
    if (!ele) return;
    command = new Set(command.split(" "))
    if (command.has("remove")) {
      ele.style.outline = "";
      ele.style.boxShadow = "";
      return;
    }
    if (ENABLE_HELP_CONCLUSION && (debug || command.has("force"))) {
      var col = getColorFromText(ele.innerText);
      if (command.has("random")) col = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      ele.style.outline = "3px dotted " + col;
      ele.style.boxShadow = " 0px 0px 4px 4px " + col + "30, inset 0 0 100px " + col + "20";
      //      ele.title='\n@class="'+ele.className+'"\n@id="'+ele.id+'"';
      if (command.has("autoRemove")) {
        setTimeout(() => {
          ele.style.outline = "";
          ele.style.boxShadow = "";
        }, 2000)
      }
    }
  }

  function getColorFromText(str) {
    if (!str) return "#808080"
    var col = 0;
    for (letter of str) { col = (col + str.charCodeAt(letter) ** 3); }
    return '#' + (0x1000000 + col % 0xffffff).toString(16).substr(1, 6);
  }

  function advertiseEle(ele, force = "") {
    if (debug || force == "force") {
      if (ele) ele.style.outline = "4px dotted red";
    }
  }

  function sw(job, mode = "dc") {
    //    if (ENABLE_MEASURE_TIME_SPENT == 0) return;
    if (debug < 2 && !ENABLE_MEASURE_TIME_SPENT) return;
    if (job !== "reset") {
      if (mode === "dc")
        debug && dc(job + " : " + ((new Date().getTime()) - (swb.getTime())) + " ms");
      if (mode === "notify") notifyMe(job + " : " + ((new Date().getTime()) - (swb.getTime())) + " ms");
    }
    if (job !== "reset")
      swb = new Date();
  }

  function isSeller() {
    return location.href.match(/\/seller\//);
  }

  function proInput(prom, defaultval, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    let r = window.prompt(prom, defaultval)
    if (r === null) return null
    return Math.min(Math.max(
      Number(r.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  //  function notifyMe(body, title = "", clickfunc = null, img = null,requireInteraction=false) {

  function notifyMe(body, title = "", clickfunc = null, img = null, command = false) {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") {
      var notify = img ? new Notification(title, { body: body, icon: img, requireInteraction: command }) : new Notification(title, { body: body, requireInteraction: command });
      if (clickfunc) {
        notify.onclick = clickfunc
      }
    } else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  function setupbutton(id, title, func, tips, command) {
    $(`<span id='${id}' class='ignoreMe' title='${tips}' style='cursor:pointer; color:#505050; font-size:15px; background:#ffffffc0; padding:3px; border-radius:9px;border:#505050 1px solid; position:fixed; bottom:3em; right: 1em;'>${title}</span>`).appendTo(document.body).click(function() { func(); if (/removeWhenClicked/.test(command)) { $(this).remove(); } });
  }

  // eleはスクロール画面内に入ってる？
  function isinscreen(ele, evencorner = 0, borderHeight = 0) {
    if (!ele) return;
    var eler = ele.getBoundingClientRect();
    if (evencorner) return (eler.top > 0 - eler.height - borderHeight && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < Math.min(window.innerHeight, document.documentElement.clientHeight) + borderHeight);
    else return (eler.top > 0 - 0 && eler.left > 0 && eler.left + eler.width < document.documentElement.clientWidth && eler.top + eler.height < Math.min(window.innerHeight, document.documentElement.clientHeight) + 0);
  }

  function autoPagerized(callback, command) { // 複数回呼んではいけない
    if (command !== "not1st") callback(document.body)
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { callback(evt.target); }, false);
    //    document.body.addEventListener('2chanReloaded', function() { setTimeout(() => { callback() }, 1) }, false);
    if (lh(".2chan.")) document.body.addEventListener('2chanReloaded', function() {
      setTimeout(() => {
        GF.fromSecond = 1;
        callback()
      }, 1)
    }, false);
  }

  function autoPagerizedD(id, callback, command) { // 複数回呼んで良い、連続で呼んだ時は収まるまで遅延する
    if (command !== "not1st") callback(document.body)
    if (!GF?.[id]) {
      document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) {
        clearTimeout(GF?.apdTO)
        GF.apdTO = setTimeout(callback, 500)
      }, false);
      GF[id] = 1;
    }
  }

  function searchWithHistory(id, sitename, url, orSeparator = "|") {
    var selection = null;
    url = [url].flat()
    let prev = pref(id + " : searchWithHistory")
    if (orSeparator) {
      let query = prompt(`${sitename}で全体検索します\n｜でOR\n\n履歴（${id}）：\n${ (pref(id + " : searchWithHistoryLog") || []).slice(0, 50).join("\n") }\n\n` + url.map(v => v.replace(/\*\*\*/, "${キーワード}")).join("\n") + `\nを開きます\n\n「deleteall」で${sitename}の履歴を全削除します`, selection || (prev ? prev + "｜" : ""))
      if (query == "deleteall") {
        pref(id + " : searchWithHistory", "");
        pref(id + " : searchWithHistoryLog", "");
        return false
      }
      if (query) {
        query = Array.from(new Set(query.replace(/\|/g, "｜").replace(/｜+/gmi, "｜").split("｜"))).join("｜").replace(/^[｜\|]+|[｜\|]+$/gmi, "").trim() // 重複自動削除
        if (!selection) prefl(id + " : searchWithHistory", query.replace(/\|/g, "｜"))
        url.forEach((v, i) => {
          setTimeout(() => { GM.openInTab(`${v.replace(/\*\*\*/,encodeURI(query.replace(/｜/g,orSeparator)))}`); }, i * 333)
        })
      }
    } else {
      let query = prompt(`${sitename}で全体検索します\n\n履歴（${id}）：\n${ (pref(id + " : searchWithHistoryLog") || []).slice(0, 50).join("\n") }\n\n` + url.map(v => v.replace(/\*\*\*/, "${キーワード}")).join("\n") + `\nを開きます\n\n「deleteall」で${sitename}の履歴を全削除します`, selection || prev || "")
      if (query == "deleteall") {
        pref(id + " : searchWithHistory", "");
        pref(id + " : searchWithHistoryLog", "");
        return false
      }
      if (query) {
        if (!selection) prefl(id + " : searchWithHistory", query?.trim())
        url.forEach((v, i) => {
          setTimeout(() => { GM.openInTab(`${v.replace(/\*\*\*/,encodeURI(query?.trim()))}`); }, i * 333)
        })
      }
    }
    return false;
  }

  function sec2hms(s) {
    return new Date(s * 1000).toISOString().substr(11, 8).replace(/^00\:0|^00\:/, "");
  }

  function hms2sec(s) {
    return ((s.match0(/^(\d+):\d+:\d+$/) || 0) * 60 * 60) + ((s.match0(/^\d+:(\d+):\d+$/) || 0) * 60) + ((s.match0(/^(\d+):\d+$/) || 0) * 60) + ((s.match0(/^\d+:\d+:(\d+)$/) || 0) * 1) + ((s.match0(/^\d+:(\d+)$/) || 0) * 1);
  }

  //  function chapterMemo(requireUrlRE, videoTitleXP, newUrl, copy = 0) {
  function chapterMemo(requireUrlRE, videoTitleXP, newUrl, copy = 0) {
    if (!location.href.match0(requireUrlRE)) return
    var videoEle = eleget0('//video');
    if (!videoEle) { return; } else { var currentTime = sec2hms(Math.floor(videoEle.currentTime)); }
    if (typeof videoTitleXP == "string") {
      var videoTitleEle = eleget0(videoTitleXP);
      if (!videoTitleEle) return;
      var videoTitle = videoTitleEle.textContent;
    } else { var videoTitle = videoTitleXP(); if (!videoTitle) return false; } //eleget0(videoTitleXP);

    var curMemos = pref(SITE.id + ' : SearchMyMemo') || [];
    var chaMemos = curMemos.filter(e => (e.t == videoTitle && e.c == COLORVIDEOTIME)).sort((a, b) => hms2sec(a.m.match0(/^([\d:]+)\s/)) > hms2sec(b.m.match0(/^([\d:]+)\s/)) ? 1 : -1);
    var chaMemoTU = "";
    //chaMemos.forEach(c => { chaMemoTU += `${videoTitle} ${c.m}\n${newUrl.replace(/\*\*time\*\*/,hms2sec(c.m.match0(/^([\d:]+)\s/)))}\n` })
    chaMemos.forEach(c => { chaMemoTU += `${videoTitle} - YouTube ▶ ${c.m}\n${newUrl.replace(/\*\*time\*\*/,hms2sec(c.m.match0(/^([\d:]+)\s/)))}\n` })
    if (!copy) {
      var jumpUrl = location.href.match0(/https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_\-]{11})/);
      if (jumpUrl) jumpUrl = `https://youtu.be/${jumpUrl}&t=${Math.floor(videoEle.currentTime)}`;

      var word = window.getSelection().toString().trim() || (prompt(`『${videoTitle}』\n${currentTime=="0:00"?"に付ける":"の "+currentTime+" に付けるチャプター"}メモを入力してください\n${chaMemoTU?"\n\n列挙(Shift+Uでコピー)：\n"+chaMemoTU:""}\n`) || "").trim();
      if (!word) return;
      storeMemo(videoTitle, (currentTime != "0:00" ? currentTime + " " : "") + word.trim(), currentTime == "0:00" ? COLOR1 : COLORVIDEOTIME, document, jumpUrl || "")
    } else {
      GM.setClipboard(chaMemoTU)
      popup2(chaMemoTU, -1, "", "top")
      //var newstr = (pref(SITE.id + ' : SearchMyMemo') || []).filter(e => (e.c === COLORVIDEOTIME));
      //prompt(`チャプターメモから再生するURLの列挙をコピーしました\n\n入力フォームよりチャプターメモのエクスポートとマージが行えます\nコピーしてテキストファイル等に保存すればエクスポートとなり、他環境からエクスポートしたものを入力すればマージになります\n変更せずにEnterかEscを押せば何もしません\n\n${JSON.stringify(newstr)}`, JSON.stringify(newstr))
    }
  }

  // intervalが1以上かつ設定値がdefValueと違っていればintervalミリ秒事に再処理、そうでなければ割り込みはせず、初回の実行もしない
  function setSlider(placeEle, min = 0, max = 100, defValue = 0, title = "", key = "SliderValue", onchangecallback, interval = 0, addProperty = "") { // interval:1なら初回一度だけcallbackも実行、2～ならそのms間隔で定期実行
    if (placeEle && !eleget0(`//input[@id="setSlider${key}"]`)) {
      let val = pref(key) || defValue;
      placeEle.insertAdjacentHTML("afterend", `<input type="range" class="setSlider" id="setSlider${key}" min="${min}" max="${max}" value="${val}" ${addProperty} title="${title.replace("***",val)}\n右クリック：デフォルトに戻す" oninput="this.title='${title}\\n右クリック：デフォルトに戻す'.replace('***',this.value);" oncontextmenu="this.value='${defValue}'; this.dispatchEvent(new Event('input')); return false;">`)

      let adjustFunc = function(key, interval = 0, defValue = 0, onchange = 0) {
        //popup2(`${interval} ${onchange}`)
        let sliderEle = eleget0(`#setSlider${key}`)
        let sliderEleNum = Number(sliderEle.value)
        onchangecallback(sliderEleNum)
        if (onchange) pref(key, sliderEleNum)
        if (interval && sliderEleNum != defValue) setTimeout(() => { adjustFunc(key, interval, defValue) }, interval)
        //        if (interval>0 && sliderEleNum != defValue) setTimeout(() => { adjustFunc(key, interval, defValue) }, interval)
      }
      let sliderEle = eleget0(`#setSlider${key}`)
      if (sliderEle) {
        sliderEle.addEventListener('input', () => adjustFunc(key, interval, defValue, 1));
        if (Number(sliderEle.value) != defValue) adjustFunc(key, interval, defValue)
      }
      //if (interval == 1) adjustFunc(key, 0, defValue)
      if (interval == 1) onchangecallback(Number(eleget0(`#setSlider${key}`)?.value || defValue))
    }
  }

  function domsort(container, doms, func, prepend = 0) { // container:domsの入っている大枠、省略時はdomsの１つ親　doms:並べ替える要素たち　prepend:0:containerの最後に付ける　1:最初に付ける（逆順） 2:最後につける（逆順）(0or2)　3:最初に付ける（昇順）　// 1と3のほうが継ぎ足し位置マーカーが上に来ないので多分良い
    if (container === "") container = doms[0]?.parentNode
    if (!container || !doms.length) return
    if (Array.isArray(container)) container = container.shift()
    let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
    if (prepend == 2 || prepend == 3) doms.map(function(v, i) { return { dom: v, value: func(v, i) } }).sort(function(b, a) { return (!isNaN(b.value) && !isNaN(a.value) ? b.value == a.value ? 0 : (b.value - a.value) : b.value == a.value ? 0 : (col.compare(a.value, b.value))) }).forEach(function(v) { prepend == 3 ? container?.prepend(v.dom) : container?.appendChild(v.dom) })
    if (prepend == 1 || prepend == 0) doms.map(function(v, i) { return { dom: v, value: func(v, i) } }).sort(function(a, b) { return (!isNaN(b.value) && !isNaN(a.value) ? b.value == a.value ? 0 : (b.value - a.value) : b.value == a.value ? 0 : (col.compare(a.value, b.value))) }).forEach(function(v) { prepend ? container?.prepend(v.dom) : container?.appendChild(v.dom) })
  }

  function sortdom(doms, func, prepend = 0) { // doms:並べ替える要素たち　prepend:0:昇順　1:降順
    let position = doms[0]?.previousElementSibling
    let container = doms[0]?.parentNode
    if (!container || !doms.length) return
    let col = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
    let fragment = new DocumentFragment();
    doms.map((v, i) => { return { dom: v, value: func(v, i) } }).sort((a, b) => (prepend == 0 ?
      (!isNaN(b.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (a.value - b.value) : a.value == b.value ? 0 : (col.compare(a.value, b.value))) :
      (!isNaN(a.value) && !isNaN(b.value) ? a.value == b.value ? 0 : (b.value - a.value) : a.value == b.value ? 0 : (col.compare(b.value, a.value)))
    )).forEach(v => fragment?.append(v.dom))
    position ? position.parentNode.insertBefore(fragment, position.nextSibling) : container.prepend(fragment)
  }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function ct1(callback, name = "test", time = 10) {
    console.time(name);
    callback();
    console.timeEnd(name)
  } // 速度測定（1回だけ）
  function ctLong(callback, name = "test", time = 10) { console.time(name); for (let i = time; i--;) { callback() } console.timeEnd(name) } // 速度測定（もともと長くかかるもの）
  function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i}回実行 / 1sec , ${1000/i}ミリ秒/１実行 ${callback.toString().slice(0,55)}`) } // 速度測定（一瞬で終わるもの）
  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function JS(v) { try { return JSON.stringify(v) } catch { return null } }

  function JP(v) { try { return JSON.parse(v) } catch { return null } }

  function e2sel(ele) { return `${ele.tagName?.toLowerCase()}${ele.id?"#"+ele.id:""}${ele.className?"."+ele.className.replace(/\s/g,"."):""}` }

  function han(str) { return str?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)) || "" }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function gettime(_fmt = 'YYYY/MM/DD hh:mm:ss', _dt = new Date()) { //'YYYY/MM/DD hh:mm:ss.iii'
    return [
      ['YYYY', _dt.getFullYear()],
      ['MM', _dt.getMonth() + 1],
      ['DD', _dt.getDate()],
      ['hh', _dt.getHours()],
      ['mm', _dt.getMinutes()],
      ['ss', _dt.getSeconds()],
      ['iii', _dt.getMilliseconds()],
    ].reduce((s, a) => s.replace(a[0], `${a[1]}`.padStart(a[0].length, '0')), _fmt)
  }

  function isValidRE(str) {
    try { new RegExp(str) } catch (e) { return false }
    return true
  }

  function matchGG(str, re) {
    return str?.match(new RegExp(re, "gm"))?.map(v => v?.match(new RegExp(re, "m"))?.[1])
  }

  // element.dataset.gmDataListプロパティにclassList.add/removeのような命令セット
  function gmDataList_add(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (!data.has(name)) {
      data.add(name);
      ele.dataset.gmDataList = [...data].join(" ")
    }
  }

  function gmDataList_remove(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (data.has(name)) {
      data.delete(name)
      if (data.size) ele.dataset.gmDataList = [...data].join(" ");
      else delete ele.dataset.gmDataList;
    }
  }

  function gmDataList_includesPartial(ele, name) { // *[class*="name"]のような部分一致
    let data = [...new Set(ele?.dataset?.gmDataList?.split(" ") || [])];
    return data.find(v => v.includes(name))
  }

  function gmhbShow(e, id) {
    gmDataList_remove(e, `gmHideBy${id}`)
    if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show(333)
  }

  function gmhbHide(e, id) {
    gmDataList_add(e, `gmHideBy${id}`)
    $(e).hide(333)
  }

  function sound(type, sec, freq = 440) { // type:sine, square, sawtooth, triangleがある
    let ctx = new AudioContext();
    let osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime); // 440HzはA4(4番目のラ)
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(sec);
  }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  function cldtd(title) { debug && console.log(title + " : " + (new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })) } // console.log date time
  function cldt(title) { debug && console.log(title + " : " + gettime()) } // console.log date time

  function getDefault56memo() {
    var date = new Date();
    //    return date.getFullYear() + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + ("0" + date.getDate()).slice(-2) + " (" + ["日", "月", "火", "水", "木", "金", "土"][date.getDay()] + ")"
    //return `${date.getFullYear()}.${("0" + (date.getMonth() + 1)).slice(-2)}.${("0" + date.getDate()).slice(-2)} (${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`
    return `${date.getFullYear()}.${("0" + (date.getMonth() + 1)).slice(-2)}.${("0" + date.getDate()).slice(-2)}`
  }

  function img2dhash(img) {
    let c = GF.dhash.get(img);
    if (c) return c;
    if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return null;
    try {
      var canvas = document.createElement("canvas");
      canvas.width = 8;
      canvas.height = 7;
      var context = canvas.getContext("2d", { alpha: false });
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
      var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      var gray = [...Array(pixels.width * pixels.height)].map((v, i) => pixels.data[i * 4] + pixels.data[i * 4 + 1] + pixels.data[i * 4 + 2])
      var dHash = gray.reduce((a, v, i) => ((i + 1) % canvas.width !== 0) ? (v < gray[i + 1] ? "1" : "0") + a : a, "");
      let dHash16 = parseInt(dHash, 2).toString(16);
      GF.dhash.set(img, dHash16) //img.dataset.dhash = dHash16;
      return dHash16;
    } catch (e) {
      return null;
    }
  }

  function keyFuncAdd(keyarr) {
    if (!GF?.keyFuncC) {
      GF.keyFuncC = new Map();
      document.addEventListener('keydown', e => {
        if (e?.target?.tagName === 'INPUT' || e?.target?.tagName === 'TEXTAREA' || e?.target?.isContentEditable || ((e?.target?.closest('#chat-messages,ytd-comments-header-renderer') || document?.activeElement?.closest('#chat-messages,ytd-comments-header-renderer')))) return;
        var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
        let f = GF?.keyFuncC?.get(key)
        if (f) f();
      })
    }
    keyarr.forEach(v => {
      GF.keyFuncC?.set(v.key, v.func) // GF?.keyFuncC ? GF.keyFuncC.push(v) : [v];
    })
  }

  function minmax(v, min, max) {
    return Math.max(Math.min(v, max), min) //return Math.min(Math.max(v, min), max)
  }

  function dragElement(ele, handleSel = "*", cancelSel = "", zindexcss = "") {
    let x, y;
    //    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e =>{ e.onmousedown = dragMouseDown;      e.style.cursor = "grab";                                                                 })
    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e => e.onmousedown = dragMouseDown)

    function dragMouseDown(e) {
      if (e.target.closest(cancelSel) || e.button != 0) return;
      if (e?.target?.style?.resize && mousex > ele.offsetLeft + $(ele).width() - 8 && mousey > ele.offsetTop + $(ele).height() - 8) return; // resize:bothだったら右下の角は掴めない判定にする
      e = e || window.event;
      e.preventDefault();
      if (!e?.target?.style?.resize) ele.style.minWidth = `${$(ele).width()}px`;
      [x, y] = [e.clientX, e.clientY];
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "none" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "none" })
      if (zindexcss) e.target.style.zIndex = elegeta(zindexcss).reduce((a, b) => Math.max(a, b.style.zIndex), 0) + 1
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.left = `${ele.offsetLeft}px`
        ele.style.right = ""
      }
      if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.top = `${ele.offsetTop}px`
        ele.style.bottom = ""
      }

      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
      ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;
      [x, y] = [e.clientX, e.clientY];
    }

    function closeDragElement(e) {
      document.onmouseup = null;
      document.onmousemove = null;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "auto" })
      if (getComputedStyle(ele)?.resize == "none") nearest(ele);
    }
  }

  function waitdo(checkFunc, func, timeout = 3000, start = Date.now()) { // checkFuncがtrueになったらfuncを実行
    let ret = checkFunc();
    if (ret || ret?.length > 0) { func(ret) } else if (Date.now() - start < timeout) { setTimeout(waitdo, 111, checkFunc, func, timeout, start) }
  }

  function nfd(str) { return str?.normalize("NFD") || "" }

  function hoverHelp(cb) {
    let latest, helpEle;
    SITE.preventHelpFunc = () => 1,
      document.addEventListener("mousemove", e => {
        if (!e?.target instanceof Element || e?.target === document) return;
        //if (!e?.target) return;
        if (latest != e?.target) {
          helpEle?.remove()
          let text = cb(e?.target)
          if (text) helpEle = end(document?.body, `<div class="ignoreMe" id="hoverHelpPopup" style="z-index:999999999; bottom:1em; right:1em; position:fixed; background-color:#ffffffe0; padding:1px 0.5em; border:1px solid #505050; font-size:15px; color:#505050; border-radius:0.75em;">${text}</div>`)
          latest = e?.target
          if (document.elementFromPoint(e?.clientX, e?.clientY) == helpEle && helpEle) {
            helpEle.style.bottom = "";
            helpEle.style.top = "1em";
          }
        }
      })
  }

  function moq2(observeNode, cb) {
    let mo = new MutationObserver((m) => {
      let eles = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().filter(v => v.nodeType === 1).forEach(v => cb(v));
    })?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });
    return () => {
      mo?.disconnect();
      mo = null;
    }
  }

  function waitDraw(each = 333) {
    if (!waitDraw.c) waitDraw.c = 1;
    else if (++waitDraw.c % each != --each) return Promise.resolve();
    if (!waitDraw.lt) waitDraw.lt = performance.now();
    return new Promise(resolve => {
      const currentTime = performance.now();
      if (currentTime - waitDraw.lt > 4000) {
        waitDraw.lt = currentTime;
        setTimeout(() => requestAnimationFrame(resolve), 0);
      } else resolve();
    });
  }

  function ytResize(plv, padding = 0) {
    new MutationObserver(m => { // 小窓をリサイズしたら中のyoutube iframeも連動リサイズ
      let ytif = eleget0('#ytplayer', plv);
      let plvs = window.getComputedStyle(plv)
      ytif.width = plv.offsetWidth - plvs.paddingLeft?.match0(/[0-9.]*/) - plvs.paddingRight?.match0(/[0-9.]*/);
      ytif.height = plv.offsetHeight - plvs.paddingTop?.match0(/[0-9.]*/) - plvs.paddingBottom?.match0(/[0-9.]*/);
      //plv.style.zIndex = 3;
    }).observe(plv, { attributes: true, childList: true, subtree: false });
  }

  function ytResize2(padding = 0) {
    if (!ytResize2.done) ytResize2.done = new Set();
    elegeta('.youtubeBQP').filter(e => !ytResize2.done.has(e)).forEach(plv => {
      ytResize2.done.add(plv)
      plv.style.transform = "scale(1)"
      plv.addEventListener("mouseup", e => { if (window.getComputedStyle(plv.closest(".embedyt")).display == "grid") plv.closest(".embedyt").style.display = "block" }, true)
      new MutationObserver(m => { // 小窓をリサイズしたら中のyoutube iframeも連動リサイズ
        m.forEach(m => {
          if (m?.target?.matches(`.youtubeBQP`) && m?.attributeName == "style") {
            let ytif = eleget0('#ytplayer , #nicoplayer', plv);
            let plvs = window.getComputedStyle(plv)
            ytif.width = plv.offsetWidth - plvs.paddingLeft?.match0(/[0-9.]*/) - plvs.paddingRight?.match0(/[0-9.]*/);
            ytif.height = plv.offsetHeight - plvs.paddingTop?.match0(/[0-9.]*/) - plvs.paddingBottom?.match0(/[0-9.]*/);
            //plv.style.zIndex = 3;
          }
        })
      }).observe(plv, { attributes: true, childList: true, subtree: false });

      plv.ondblclick = e => {
        plv.style = "";
        let ytif = eleget0('#ytplayer , #nicoplayer', plv);
        ytif.width = "";
        ytif.height = 181;
      }
    })
  }
  /*  function resizedrag(){
      ytResize2(2);
      dragElement3(()=>elegeta('.youtubeBQP'), "*", "iframe", ".youtubeBQP");
    }*/

  function dragElement3(elesF, handleSel = "*", cancelSel = "", zindexcss = "", downF) {
    if (!dragElement3.done) dragElement3.done = new Set();
    elesF().filter(e => !dragElement3.done.has(e)).forEach(e => {
      dragElement3.done.add(e)
      dragElement2(e, handleSel, cancelSel, zindexcss, downF)
    })
  }

  function dragElement2(ele, handleSel = "*", cancelSel = "", zindexcss = "", downF) {
    let x, y;
    let targets = (handleSel == "*" ? [ele] : elegeta(handleSel, ele));
    targets.forEach(e => {
      e.onmousedown = dragMouseDown;
      e.style.cursor = "grab";
    });

    targets.forEach(e => { e.addEventListener("dblclick", e => { dragElement2?.bu?.has(ele) && ["position", "left", "top", "right", "bottom", "cursor"].forEach((v, i) => { ele.style[v] = dragElement2.bu?.get(ele)[i] }) }) }) // ダブルクリックで元の位置に回復

    function dragMouseDown(e) {
      //if (e.target.closest(cancelSel) || e.button != 0) return;
      if ((cancelSel && e.target.closest(cancelSel)) || e.button != 0) return;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "none" })
      window.addEventListener("mouseup", e => { elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) }, { 'once': true })
      if (window.getComputedStyle(e?.target)?.resize == "both" && mousex > ele.offsetLeft + $(ele).width() - 12 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 12) return; // resize:bothだったら右下の角は掴めない判定にする
      //if (e?.target?.style?.resize && mousex > ele.getBoundingClientRect().left + $(ele).width() - 8 && mousey > ele.getBoundingClientRect().top + $(ele).height() - 8) return; // resize:bothだったら右下の角は掴めない判定にする

      dragElement2.bu = dragElement2?.bu || new Map(); //元の位置を覚えておく 2025.04
      if (!dragElement2.bu.has(ele)) dragElement2.bu.set(ele, ["position", "left", "top", "right", "bottom", "cursor"].map(v => ele?.style?.[v]));

      e = e || window.event;
      e.preventDefault();
      var w = w || ele.getBoundingClientRect().width - elePadding(ele).left - elePadding(ele).right;
      //ele.style.minWidth = `${w}px`;
      //ele.style.maxWidth = `${w}px`;
      [x, y] = [e.clientX, e.clientY];
      if (zindexcss) e.target.style.zIndex = elegeta(zindexcss).reduce((a, b) => Math.max(a, b.style.zIndex), 0) + 1
      if (downF) downF(ele, e)
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elePadding(ele) {
      const style = window.getComputedStyle(ele);
      return {
        top: parseInt(style.paddingTop, 10),
        right: parseInt(style.paddingRight, 10),
        bottom: parseInt(style.paddingBottom, 10),
        left: parseInt(style.paddingLeft, 10)
      };
    }

    function elementDrag(e) {
      if (!e.movementX && !e.movementY) return;
      e = e || window.event;
      e.preventDefault();
      if (window.getComputedStyle(ele).position != "fixed") {
        let l = `${ele.getBoundingClientRect().left}px`;
        let t = `${ele.getBoundingClientRect().top}px`;
        ele.style.position = "fixed";
        ele.style.left = l;
        ele.style.top = t;
      }
      ele.dataset.moved = 1;
      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.left = `${ele.offsetLeft}px`
        ele.style.right = ""
      }
      if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.top = `${ele.offsetTop}px`
        ele.style.bottom = ""
      }

      /*      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
            ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;
      */
      ele.style.top = `${(ele.offsetTop - (y - e.clientY))}px`;
      ele.style.left = `${(ele.offsetLeft - (x - e.clientX))}px`;

      [x, y] = [e.clientX, e.clientY];
    }

    function closeDragElement(e) {
      document.onmouseup = null;
      document.onmousemove = null;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "auto" })
      if (getComputedStyle(ele)?.resize == "none") nearest(ele);
    }
  }

  function nearest(ele) {
    if (!(ele instanceof Element) || getComputedStyle(ele).position != 'fixed') return;
    const [viewportWidth, viewportHeight] = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    const fontsize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const parentEle = ele.offsetParent || document.documentElement;
    const [parentWidth, parentHeight] = [parentEle.clientWidth, parentEle.clientHeight];
    const cStyle = getComputedStyle(ele);
    const parse = str => { if (!str || str === 'auto') return null; const hits = str.trim().match(/^(-?[\d.]+)([a-z%]*)$/i); return hits ? { val: +hits[1], unit: hits[2] || 'px' } : null; };
    const unit2px = (org, isVertical) => !org ? null : org.unit === 'px' ? org.val : org.unit === 'em' ? org.val * fontsize : org.unit === '%' ? (isVertical ? parentHeight * org.val / 100 : parentWidth * org.val / 100) : org.unit === 'vh' ? viewportHeight * org.val / 100 : org.unit === 'vw' ? viewportWidth * org.val / 100 : org.val;
    const px2unit = (px, unit, isVertical) => unit === 'px' ? px : unit === 'em' ? px / fontsize : unit === '%' ? (isVertical ? px / parentHeight * 100 : px / parentWidth * 100) : unit === 'vh' ? px / viewportHeight * 100 : unit === 'vw' ? px / viewportWidth * 100 : px;
    const [topP, bottomP, leftP, rightP] = [parse(cStyle.top), parse(cStyle.bottom), parse(cStyle.left), parse(cStyle.right)];
    const [topPx, bottomPx, leftPx, rightPx] = [unit2px(topP, true), unit2px(bottomP, true), unit2px(leftP, false), unit2px(rightP, false)];
    const rect = ele.getBoundingClientRect();
    const dist = { top: rect.top, bottom: viewportHeight - rect.bottom, left: rect.left, right: viewportWidth - rect.right };
    const useTop = topPx !== null && (bottomPx === null || dist.top <= dist.bottom);
    const useBottom = bottomPx !== null && !useTop;
    const useLeft = leftPx !== null && (rightPx === null || dist.left <= dist.right);
    const useRight = rightPx !== null && !useLeft;
    ele.style.top = (useTop) ? (topP ? px2unit(dist.top, topP.unit, true) : dist.top) + (topP ? topP.unit : 'px') : '';
    ele.style.bottom = (useBottom) ? (bottomP ? px2unit(dist.bottom, bottomP.unit, true) : dist.bottom) + (bottomP ? bottomP.unit : 'px') : '';
    ele.style.left = (useLeft) ? (leftP ? px2unit(dist.left, leftP.unit, false) : dist.left) + (leftP ? leftP.unit : 'px') : '';
    ele.style.right = (useRight) ? (rightP ? px2unit(dist.right, rightP.unit, false) : dist.right) + (rightP ? rightP.unit : 'px') : '';
  }

  class addstyle {
    static added = [];
    static add(str) {
      if (this.added.some(v => v[1] === str)) return;
      const uid = [...crypto.getRandomValues(new Uint8Array(12))].map(b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" [b % 52]).join('');
      document.head.insertAdjacentHTML("beforeend", `<style id="${uid}">${str}</style>`);
      this.added.push([uid, str]);
      return uid;
    }
    static remove(str) { // str:登録したCSSでもaddでreturnしたuidでも良い
      let uid = this.added.find(v => v[1] === str || v[0] === str)?.[0]
      if (uid) {
        eleget0(`#${uid}`)?.remove()
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }

  function cbOnce(cb) { // callbackを初回に呼ばれたときの１回だけ実行し２度め以降はしない ※要ルートブロックに設置
    const cbstr = cb.toString();
    if (cbOnce?.done?.has(cbstr)) return;
    cbOnce.done = (cbOnce.done || new Set()).add(cbstr)
    cb()
  }


  function cyclemenu(menu, sortkey = "A") {
    var sorttype = GF.yhmSortType % menu.length || 0
    elegeta('.yhmsortmenubox').forEach(e => e?.remove())
    let menubox = end(document.body, `<div class="yhmsortmenubox ignoreMe" style="all:initial; right:1em; min-width:${menu.reduce((a,b)=>b?.t?.length>a?b?.t?.length:a,0)+3.5}em; bottom:17em; position:fixed; line-height:1em; z-index:9999999999; background-color:#33c; color:#fff; font-size:16px; padding:0.1em 0.5em; border-radius:1em; text-align:left;">${sortkey}：ソート<br></div>`);
    setTimeout(() => {
      (function removemenubox() {
        if (eleget0('.yhmsortmenubox:hover')) setTimeout(removemenubox, 2000);
        else menubox?.remove();
      })()
    }, 5000)
    addstyle.add(`.yhmbuttonstyle:hover{background-color:#fff4;} .yhmbuttonstyle { all:initial; cursor:pointer; display: inline-block; background-color:#0004; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;  font-weight:normal; color:#fff; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 0.66em 1px 0.66em; border-radius:1em; line-height:1.2em;}`);
    menu.forEach((c, i) => {
      let e = end(menubox, `　<span class="yhmbuttonstyle ignoreMe">${c.t}</span>${ (i == sorttype ? "　←<br>" : "<br>")}`)
      e.previousElementSibling.addEventListener("click", c.f)
    })
    menu[sorttype].f()
    GF.yhmSortType = (++sorttype) % menu.length
  }

  function setCSS(eles, css) {
    eles = (typeof eles == "string") ? [...document.querySelectorAll(eles)] : [eles]?.flat();
    css.split(";").map(v => v.trim()).filter(v => v).map(v => v.split(":")).forEach(css => eles.forEach(ele => ele.style.setProperty(css?.[0].trim(), css?.[1].trim())))
  }

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

  async function autoPaging(item, pager = 0, timeout = 100, interval = 250) {
    GF.tsugitashi = 1 - (GF.tsugitashi || 0);
    let last = { time: Date.now(), item: elegeta(item)?.length };
    await (async function scr(i) {
      if (elegeta(item)?.length != last.item) last = { time: Date.now(), item: elegeta(item)?.length }
      popup3(`Shift+End : しばらく継ぎ足し操作　${!GF?.tsugitashi?`終了`:`読み込み済み：${last.item} / 残試行：${i}`}`, 1)
      if (i % 2 == 0) window.scroll({ top: window.scrollY - 1 });
      else !pager || i >= timeout - 1 ? window.scroll({ top: Number.MAX_SAFE_INTEGER }) : elegeta(pager)?.pop()?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }) //pagerがfalselyなら下端
      await sleep(interval)
      if (i > 0 && GF?.tsugitashi && (last.time + interval * 20 >= Date.now() || elegeta(item)?.length != last.item)) scr(--i); // 10回連続でアイテム数が増えなければ終わったと判断
      else GF.tsugitashi = 0;
    })(timeout);
  }
})();