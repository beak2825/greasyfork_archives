// ==UserScript==
// @name         5chサムネイル表示他
// @description  r（文字列非選択時）:ホバー中のレスへのアンカーを記入(R:追記）　r（文字列選択時）:選択文字列を引用（R:追記）　m:ホバー中のレスの10番前からを表示　,:ホバー中のレス以降を表示　.:ホバー中のレス以前を表示　d:書き込み欄にスクロール　y:ホバー中の画像をyandexで画像検索　l:ホバー中のレスへのリンクをコピー　8/9:サムネイルぼかし-/+
// @version      0.2.8
// @run-at       document-idle
// @inject-into content
// @match        *://*.5ch.net/test/read.cgi/*
// @match        *://*.5ch.net/*/
// @match        *://*.5ch.net/*/SETTING.TXT
// @match        *://*.shitaraba.net/bbs/read.cgi/*
// @match        *://*.shitaraba.net/bbs/read_archive.cgi/*
// @match        *://*.2chan.net/*
// @match        *://www.google.tld/*
// @match        *://refind2ch.org/search*
// @match        *://itest.5ch.net/*
// @match file:///*.html
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM.setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @noframes
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/416843/5ch%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA%E4%BB%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416843/5ch%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA%E4%BB%96.meta.js
// ==/UserScript==

(function() {
  const EXPERIMENTAL_SELECT_PC_VIEWER_2024 = 0; // 1～:5chで2024/?以降の新UIページならこの秒数経過後にPC版表示に移動しようとする（実験的）　0:無効
  const EXPERIMENTAL_CLASSIC_MODIFY_FORM = 1; // 1:5chのクラシック版やkakoサーバーで全体が白く簡素になる現象が出ている時に最低限の行間等を調整する
  const DEFAULT_MAIL_ADDRESS = ""; // メールアドレス初期値　""、"sage"、その他に変更可
  const inlineImageThumbnailHeight = 1080 / 11; // 画像サムネイルの縦サイズ(px)
  const inlineVideoThumbnailHeight = 1080 / 7; // 動画サムネイルの縦サイズ(px)
  const WAIT = performance.now() * 0.5; // ページ開始後のウエイト　不安定なときは大きくする
  const WAIT_IMAGE_EMBED_INTERVAL = 500; // 画像埋め込みの頻度(ミリ秒）
  const WAIT_VIDEO_EMBED_INTERVAL = 2000; // 動画埋め込みの頻度(ミリ秒） *廃止
  const NUMBER_IMAGE_EMBED_AT_ONCE = 10; // 画像埋め込みの速度（枚数） *廃止
  const NUMBER_VIDEO_EMBED_AT_ONCE = 2; // 画像埋め込みの速度（枚数） *廃止
  const INLINE_IMAGE_THUMBNAIL_PRELOAD_RADIUS = 0.1; // 画面外の下何画面分までを先読み処理するか（0～999）
  const CH5_QUOTE_POPUP_SCALING_LOWER_LIMIT = 0.98; // 引用ポップアップが画面下に収まらない時縮小する倍率の下限 0.5～1ぐらい
  const QUOTE_STYLE = "color:#008080;"; // 引用文のスタイル　"";なら無効
  const EXPERIMENTAL_FLOAT_KAKIKOMI_FIRST = 0; // 1:5chでスレッド内を開いたら最初に書き込み欄を浮かせる（機能６）
  const EXPERIMENTAL_REMOVE_RES_SCOPE_GOOGLE = 2; // 1-2:Google検索結果で5chのスレのレス番指定を除去する　0:無効
  const LEAD_LENGTH = ~~(clientWidth() / (3.5) / parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'))); // 1-99:>>100等のアンカーに本文の冒頭を引用する文字数 0:無効
  const RELATED_SIZE = 1.5; // 1.5-3.5:関連レスの□の大きさ(em)
  const EXCLUDE_QUOTE_ON_COPY = 0; // 1:>>100に付く本文冒頭引用をCtrl+Cから除外する（変な空行あく）
  const INLINE_THUMBNAIL_STYLE = 2; // 画像や動画のインラインサムネイルのスタイル　0:urlの下 1:本文の左下 2:本文の右上　3:ランダム
  const YT_REFERRER = `strict-origin-when-cross-origin`; //  const YT_REFERRER = `no-referrer`; // strict-origin

  const EXTEST = 1; // 0-1:インライン表示方式のテスト
  const debug = 0; // 1:verbose
  const DEBUG_TIMER = 0; // 1ならかかった時間を計測

  const POPUP_STYLE = 1; // 引用ポップアップの見た目 0:シンプル 1:原型維持　※ほぼ廃止
  const ALTERNATIVE_THUMBNAIL = 0; // 1:別方式のサムネイル　※ほぼ廃止
  const enableHoverZoom = 0; // 1:画像サムネイルのホバーズームを有効

  const ISFILE = location.protocol == "file:";
  const ISFILE5CH = ISFILE && eleget0('div.row.noflex > div#thread > h1#threadtitle , div.row > div#thread.column > span#bottomDocTitle , div#maincontent > div.row > div.thread > span#bottomDocTitle');
  if (ISFILE && !ISFILE5CH) return;
  const NEW5CH = lh("5ch\.net\/test\/read\.cgi\/") && !lh("/c/")
  const OLD5CH = lh("5ch\.net\/test\/read\.cgi\/") && lh("/c/")
  const isShitaraba = lh("shitaraba.")
  var IIS = INLINE_THUMBNAIL_STYLE >= 3 ? minmax(~~(Math.random() * 5), 0, 2) : INLINE_THUMBNAIL_STYLE // 旧5chでは0-1
  IIS = Math.min(IIS, OLD5CH ? 1 : 2)
  const marginH = 200; // 元絵と拡大画像の横の余白px
  const POPUP_Z_INDEX = 10000; // ポップアップ画像がどれくらい手前に来るか
  const FORCE_USE_HALF_WIDTH = 0; // 1:ホバーズームで必ず画面の横半分のサイズ
  const marginPe = 8;
  const isfvw = eleget0('#fvw_menu')
  const MINIMUM_ROWS = 3; //(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) ? 2 : 3;

  const ael = (ele, evts, cb, opt) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, cb, opt));
  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] }
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

  let addstyle = {
    added: [],
    add: function(str, addstylename = "") { // addstylenameが同じものは上書きすると前のを自動的に消す
      if (this.added.some(v => v[1] === str)) return;
      const uid = [...crypto.getRandomValues(new Uint8Array(12))].map(b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" [b % 52]).join('');
      if (addstylename) this.remove(addstylename)
      end(document.head, `<style id="${uid}" data-addstylename="${addstylename||uid}">${str}</style>`);
      this.added.push([uid, str, addstylename || uid]);
      return uid;
    },
    remove: function(str) { // str:登録したのと同じCSSでもaddでreturnされたuidでもaddstylenameでもどれも良い
      let uid = this.added.find(v => v.includes(str))?.[0]; // v[1] === str || v[0] === str || v[2]===str)?.[0]
      if (uid) {
        eleget0(`#${uid}`)?.remove()
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }
  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  var GF = {},
    GFS = new Set();
  GF.videoEmbed = 0;
  var waitTimerA = []
  var maey = 0;
  var poppedUrl = "";
  var yandexUrl = "";
  var mousex = 0;
  var mousey = 0;
  var lastEle = "";
  var resFloat = false;
  var resListen = false;
  var maet = 0;
  if (ISFILE5CH) {
    addstyle.add(".ch5pu:not(.ch5puz){max-width:90%;}")
    addstyle.add(`.ch5pu {z-index:999999; padding:1em ${RELATED_SIZE+3}em 1em 3em; background-color:#f2f3f7; margin:0 1em 3px 0em; box-shadow: 2px 2px 15px gray; border:1px solid #bbb; border-radius:5px; outline-offset: -1px;} .ch5pu .post{background-color:#fcfdfe}`);
    popuponquote(1, 1) + bokashi();
    return
  } //NEW5CH,isFILE // 2025.05 FILEでも動作

  addstyle.add(`.fchformlineover{background-color:#fff0f0 !important;} .fchformsizeover{background-color:#fffff0 !important;} `)

  function moq(targetCSSSelector, func, observeNode = document, ID = targetCSSSelector + func.toString()) { // IDか「targetCSSSelector＋ func」が同じものなら前回のMOは解除する
    if (!moq.undup) moq.undup = new Map();
    if (moq.undup.has(ID)) moq.undup.get(ID)();
    func([...observeNode.querySelectorAll(targetCSSSelector)])
    let mo = new MutationObserver((m) => {
      let eles = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().filter(v => v.nodeType === 1)
      let hits = eles.filter(v => v?.matches(targetCSSSelector)).concat(eles?.map(v => [...v?.querySelectorAll(targetCSSSelector)])?.flat())
      if (hits.length) func(hits)
    })
    mo?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });
    moq.undup.set(ID, () => {
      mo?.disconnect();
      mo = null;
    })
    return moq.undup.get(ID);
  }

  // Google検索結果の5chのスレはレス番指定を除去
  if (lh(/^https:\/\/www\.google\.co\.jp\/search\?q=|^https:\/\/www\.google\.com\/search\?q=/)) {
    if (EXPERIMENTAL_REMOVE_RES_SCOPE_GOOGLE) {
      moq(`span>a>h3`, () => {
        elegeta('//span/a/h3/..').filter(e => !e?.dataset?.setcla && /\.5ch\.net\//.test(e.href)).forEach(e => {
          e.dataset.setcla = 1
          var mod = 0
          if (e?.href?.match(/\.5ch\.net\/.*\/\?v=.*$/)) {
            mod = 1;
            e.href = e?.href?.replace(/\/\?v=.*$/, "")
          }
          if (e?.href?.match(/\.5ch\.net\/.*test\/read\.cgi.*\/\d+\/(\d+$|-\d+$|\d+-\d+$|l50$|\d+-n$)/)) {
            mod = 1;
            e.href = e.href.replace(/^(.+\.5ch\.net\/.+\/\d+\/)(\d+$|-\d+$|\d+-\d+$|l50$|\d+-n$)/, "$1")
          }
          if (mod && EXPERIMENTAL_REMOVE_RES_SCOPE_GOOGLE >= 2) before(e.parentNode, `<br><span> <mark>${e.href}</mark></span>`)
        })
      })
    }
    return;
  }

  // 2024-のスマホ版？UIだったらPC表示の選択を試みる
  if (lh(/^https\:\/\/itest\.5ch\.net\/[^\/]+\/test\/read\.cgi\/[^\/]+\/\d+/)) {
    if (EXPERIMENTAL_SELECT_PC_VIEWER_2024) {
      setTimeout(() => {
        waitClick(() => eleget0('a.header_cell-side_link.header_cell-side_link-help.nolink[role="button"] > i.fa-solid.fa-ellipsis-vertical'), e => e,
          () => waitClick(() => eleget0('a#view_pc.js-pcurl > div > i.fa.fa-desktop'), e => e)
        )

        function waitClick(ele, func, cb = () => {}, int = 333, delay = 0, start = Date.now()) {
          setTimeout(() => {
            let e = ele()
            if (e && e?.length !== 0) {
              setTimeout(() => {
                func(e)?.click();
                cb();
              }, delay);
              return;
            }
            if (document.visibilityState != "visible") start = Date.now();
            if (debug) document.title = `remain:${Date.now()-start} interval:${int}`;
            if (Date.now() - start < 10000) waitClick(ele, func, cb, Math.min(int + 100, 1000), delay, start); // 10秒たったらやめるelse alert(int);
            //else alert(`timeout:${ele.toString()}`)
          }, int)
        }
      }, EXPERIMENTAL_SELECT_PC_VIEWER_2024 * 1000)
    }
    return;
  }

  // 0001みたいなゼロサプレスを削除
  if (NEW5CH) {
    addstyle.add(`.post-header > span , .post-header > div, .post-header > summary{display:inline-block !important; width:unset !important;} .post-header{font-size:0.9em !important;} .post{border-bottom: 1px solid #ccc;} #thread{ background-color:#fff; border: 1px solid #ccc !important;} .uid{margin-left:1em; margin-right:0.9em;} .AA{line-height:initial} .postid { width: 30px; display: inline-block; } .postusername { padding-left: 0em; } .post-content { margin-left:30px; line-height: 1.2em; padding: 0.2em 0 0.3em;} .post{ padding: 0.4em 0.5em;} #fchVerticalThreadTitle{z-index: -1; margin-bottom:0em; font-size:40px !important;}  div#overright{background-color:#fff;}`)
    addstyle.add("#fchVerticalThreadTitle{z-index: -1; max-width: 6em; overflow-x: clip; margin-bottom:0em; font-size:40px !important;} ")
    if (eleget0('div#overright:visible')) addstyle.add("#fchVerticalThreadTitle{opacity:0 !important;} ")
    addstyle.add('.post-header { display: inline-block; } span.uid{float:unset; margin-right:0.9em;}')
    if (eleget0('//span[@class="postid" and starts-with(text(),"0")]')) elegeta('.postid').forEach(e => e.textContent = Number(e.textContent))
    addstyle.add('.AAbig { font-size:1em; transition:all 60ms ease-in-out;} .AA {transition:all 60ms ease-in-out;} ')
    $(document).on("dblclick", ".AA", e => {
      document.getSelection().removeAllRanges();
      $(".AA").toggleClass("AAbig");
      e.target.closest(".post").style.outline = "4px solid #0f0";
      setTimeout(() => e.target.closest(".post").style.outline = null, 1000)
      setTimeout(() => { e?.target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); }, 100); // e?.target?.scrollIntoView()
    })
    let fs = 16.25;
    debug && end(document.body, `${fs}px`)
    addstyle.add(`#thread { width: 50%; max-width: unset; } body{letter-spacing: 0em; font-size: ${fs}px; }`)
    elegeta('.post-content a:not(.reply_link)').filter(v => v.innerText.match(/^>>[0-9\-]+$/)).forEach(e => e.classList.add("reply_link"))
    addstyle.add(`.uidpick { background-color:#ecf;transition:all 111ms ease-in-out;}`)
    $(document).on("click", "span.uid", e => {
      $(elegeta(`span.uid`).filter(v => v.textContent == e.target.textContent)).toggleClass("uidpick")
    })
    if (window.navigator.userAgent.match(/Firefox/i)) elegeta(".post").forEach(e => end(e, '<br class="whbr">')) // .post同士の間に改行がないとコピーした時くっついて見づらいので見えない改行を入れる //test: 5ms - タイマー終了 // jQ:test: 10ms - タイマー終了
    addstyle.add(`.whbr{line-height:0; display:block;}`)
    addstyle.add('a:visited{	color:#407 !important;}')
    addstyle.add('.inlined{color:#609; transition:all; duration:200ms; }')

    // 追従ヘッダをホバーしないと隠す
    addstyle.add(`@media (any-hover: hover) {
div#followheader.hidden.maxwidth100.height2p5.stickymenu.container{opacity:0;transition:all 0.1s;}
div#followheader.hidden.maxwidth100.height2p5.stickymenu.container:hover{opacity:1;  transition:all 0.1s;}
}`)
  }

  if (EXPERIMENTAL_CLASSIC_MODIFY_FORM && lh("/kako\.")) { //&& !elegeta('style').find(e => e.innerText.match(".post"))) {
    //    GM_addStyle(`div#thread{max-width: 70% !important; margin: 0 15% !important;}`)
    GM_addStyle(`div#thread{max-width: 70% !important; margin: 0 15% 0 1% !important;}`)
  }
  if (OLD5CH && EXPERIMENTAL_CLASSIC_MODIFY_FORM && !elegeta('style').find(e => e.innerText.match(".post"))) {
    GM_addStyle(` body { background-color: #f2f3f7; } .post { border: 1px solid #ddd; display: inline-block; background-color: #efefef; margin: 0 0 8px 0; padding: 8px; } .message { font-size: 16px; color: #333; padding: 10px 0; overflow-wrap: break-word; } .number, .name, .date, .uid, .be { margin-right: 5px; } .name { color: green; font-size: 15px; } `)
  }

  /*const EXPERIMENTAL_REDIRECT_CLASSIC_VERSION = 1; //Math.random() > 0.1 ? 2 : ~~(Math.random() * 3); // 0; // 1～10:5chで2023/6-2024/?の新版ページならこの数値秒後にクラシック版に移動する（実験的）　0:無効
    if (EXPERIMENTAL_REDIRECT_CLASSIC_VERSION && !lh("/c/")) {
    let cla = eleget0('//a/div[contains(text(),"クラシック版")]/..');
    if (cla) { setTimeout(cla => { cla?.click(); return; }, EXPERIMENTAL_REDIRECT_CLASSIC_VERSION * 1000, cla); return; }
  }*/
  if (ld(".5ch.net") && (eleget0('img[alt="5chan logo"]') && !eleget0('//a[@class="menuitem" and text()="全部"]'))) return;
  if (lh("https://refind2ch.org/")) return;
  if (document.domain.match(/\.2chan\.net$/)) end(document.body, `<span id="fivechthumbnailetc"></span>`) // 使用メッセージを付ける

  if (EXPERIMENTAL_FLOAT_KAKIKOMI_FIRST) { // スレッド内を開いたら最初に書き込み欄を浮かせる（実験的）
    if (lh(".5ch.net") && lh("/read.cgi/")) {
      floatKakikomi2({ string: null, addMode: 0, command: "resetHeight", focus: -1 });
      document.body.focus();
    }
  }

  if (lh(".5ch.net") || lh("shitaraba")) {
    // .relAllAreaon枠に連鎖レス数を書き入れていく
    if (1 || EXPERIMENTAL_DISPLAY_CHAINED) {
      GF.resChained = []
      setTimeout(() => reschain(), 4000 || 9000) // 全部最速でも余裕
      function reschain(dash = null) {
        let stime = Date.now()
        let org
        if (!GF.resChained || !GF.resChained?.length) {
          GF.resChained = elegeta(dash ? dash : '.relallAreaon:not([data-filled])')
          GF.resTotal = elegeta('.post').length
        }
        do {
          do {
            org = GF.resChained.shift()
          } while (org && org?.dataset?.filled)
          if (org) {
            let rsc = +org.closest('.post')?.id
            let lists = getRelatedRsca(rsc)
            //after(org,`${lists.length}`)
            elegeta('.relallAreaon', elegeta('.post').find(e => e.id == rsc)).forEach(w => {
              w.innerText = "-";
              w.dataset.filled = "1"
            })
            lists.forEach(v => {
              elegeta('.relallAreaon', elegeta('.post').find(e => e.id == v)).forEach(w => {
                w.innerText = lists?.length //+` (${lists})`
                w.dataset.filled = "1"
                if (debug) $(w).effect("highlight"); //org.areaonEle.scrollIntoView()
              })
            })
          }
        } while (dash && org)
        setTimeout(reschain, (org || dash) ? 50 + (Date.now() - stime) * 3 : 6000)
        //document.title=(org || dash) ? 50+(Date.now()-stime)*3 : 6000
      }
    }
  }
  if (lh(".5ch.net") || lh("shitaraba")) {

    // 最初に最新レスにスクロールする
    document.visibilityState == "hidden" && window.addEventListener("visibilityChange", () => {
      if (!GF?.done1) return;
      GF.done1 = 1
      scrollKakikomi(0, 0, 1)
    })

    addstyle.add(`.quoteSpeechBalloonImg{float:right; clear:right; max-height:2.8em !important; padding:4px; user-select:none; background-color:#ffffee; border-radius:6px; cursor:pointer;}`)
    addstyle.add(`.relallAreaon{display:inline-block; outline:2px dotted #789922d0; margin:1px; cursor:pointer; min-width:${RELATED_SIZE}em; min-height:${RELATED_SIZE}em; }`)
    addstyle.add(`.postid:hover{display:inline-block; outline:2px dotted #789922d0; color:#789922d0;}`)
    addstyle.add(".allpopup { color: #00f; cursor: pointer; font-size: 1em; margin-left: 0.4em; word-break: break-all;}")
    addstyle.add(".ch5pu:not(.ch5puz){max-width:90%;} .ch5pu .imgbox{max-width:66%;} .ch5pu .imgbox div { position:static !important;}")
    addstyle.add(".post_hover{visibility:hidden;}"); //元からあるポップアップを隠す
    addstyle.add(".quoteSpeechBalloon{padding-left:0.66em; padding-right:0.66em; font-size:95%; position:relative; bottom:0px; color:#484; background-color:#ffffee;border-radius:1em; cursor:pointer; display:inline-block; }") // qsb:: //white-space : nowrap ;
    if (NEW5CH) {
      addstyle.add('textarea.formelem{ background-color:#ffffff;} .ch5pu .post{ padding:0.5em 1em !important;} span.allpopup{margin-left:0em; margin-right:0.4em;  font-size:initial;} ')
      if (EXCLUDE_QUOTE_ON_COPY) addstyle.add(".quoteSpeechBalloon{ user-select:none; }") // qsbを選択コピーから外す：改行が課題
      addstyle.add(`span.yhmMyMemo,.allpopup,.relallArea{user-select:none !important;} .quoteSpeechBalloon{display:inline;}`)
    } else {
      addstyle.add(".quoteSpeechBalloon{display:ruby; }") // qsb::
      if (EXCLUDE_QUOTE_ON_COPY) addstyle.add(".quoteSpeechBalloon{ user-select:none; }") // qsbを選択コピーから外す：改行が課題
      addstyle.add(`span.yhmMyMemo,.allpopup,.relallArea{user-select:none !important;}`)
    }
    if (POPUP_STYLE) {
      if (NEW5CH) {
        addstyle.add(`.relallArea{ bottom:0; text-align:center; line-height:${RELATED_SIZE}em; color:#789922a0; float:right; margin-left:0.66em !important;} `);
        addstyle.add(`.relallAreaon{display:inline-block; outline:2px dotted #789922e0; margin:1px; cursor:pointer; min-width:${RELATED_SIZE}em; min-height:${RELATED_SIZE}em; }`)
        addstyle.add(`.ch5pu {z-index:999999; padding:1em ${RELATED_SIZE+3}em 1em 3em; background-color:#f2f3f7; margin:0 1em 3px 0em; box-shadow: 2px 2px 15px gray; border:1px solid #bbb; border-radius:5px; outline-offset: -1px;} .ch5pu .post{background-color:#fcfdfe}`);
      } else {
        addstyle.add(`.relallArea{ bottom:0; text-align:center; line-height:${RELATED_SIZE}em; color:#78992290; float:right; transform:translate(${RELATED_SIZE+1.5}em);} .ch5pu .relallArea{transform:translate(${RELATED_SIZE+1.5}em);}`);
        addstyle.add(`.ch5pu {z-index:999999; padding:1em ${RELATED_SIZE+3}em 1em 3em; background-color:#f2f3f7; margin:0 1em 3px 0em; box-shadow: 2px 2px 15px gray; border:1px solid #bbb; border-radius:5px; outline-offset: -1px;}`);
      }

      addstyle.add(`.ch5pu:not(.ch5puz) .post{box-shadow:1px 1px 1px #4442; border:1px solid #ddd; padding:0.5em;}`) // padding:0.5em 1.5em;
    } else {
      addstyle.add(`.relallArea { bottom:0; text-align:center; line-height:${RELATED_SIZE}em; color:#78992290; float:right; transform:translate(${RELATED_SIZE+1.5}em);} .ch5pu .relallArea{transform:translate(${1.5}em);}`)
      addstyle.add(`.ch5pu {z-index:999999; background-color:#efefef; margin:0 1em 3px 0em; box-shadow: 2px 2px 15px gray; border-bottom:0; outline-offset: -1px; }`);
    }

    $(document).on("click", ".relallAreaon", e => zf(e.ctrlKey ? "Shift+Z" : "z"))

    function zf(e) { // z::
      let isZ = e == "Shift+Z"
      elegeta('.ch5pu').forEach(v => v?.classList?.add("ch5puz"))
      let target = ".ch5puz" //eleget0('.ch5pu')
      z(isZ ? 2 : 1, isZ ? 2 : 1)

      function z(SCALE_MIN = 1, SCALE_MAX = 2) {
        var D_FILENAME_MAXLENGTH = 100 // ファイル名の最大長
        if (!eleget0(target)) return

        let honbun = elegeta(`${target} .message`).map(e => e.innerText)?.join(" ")
        honbun = honbun?.replace(/\s*\>+[^\s]+/gm, "")?.trim() || res
        honbun = honbun?.slice(0, 100); // ?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm,"")

        $(`${target} .ignoreMe,${target} .relallArea,${target} .adddel`).remove()
        $(`${target},${target} div`).css({ "box-shadow": "none", "transform": "scale(1)" })
        POPUP_STYLE && $(`${target}`).css({ "border": "none", "padding": "1em" });
        !NEW5CH && POPUP_STYLE && $(`${target} .post`).css({ "border-width": "1px;", "display": "inline-block;", "border-style": "none solid solid none;", "border-color": "#ddd;", "background-color": "#efefef;", "margin-bottom": "8px;", "padding": "8px;" })
        if (NEW5CH) {
          addstyle.add(`${target} .post-content,${target} .AA { all:initial; white-space: pre-wrap !important; line-height:1.3em !important;} `);
          $(`${target} .post-content`).before("<br>")
        }

        var hrefName = ""
        var fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH-hrefName.length-1)} ${hrefName}`?.trim()
        var res = honbun
        res = res?.replace(/^\s*\>.*\s*$/gm, "")?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm, "")?.trim() || res;
        if (res) fn = `${signzen(document.title+" "+location.href).substr(0, D_FILENAME_MAXLENGTH/2-hrefName.length-1)} ${signzen(res).substr(0, D_FILENAME_MAXLENGTH/2-1)} ${hrefName}`.trim()

        function signzen(str) { return str.replace(/^\s+/, "").replace(/\\|\/|\:|\;|\,|\+|\&|\=|\*|\?|\"|\'|\>|\<|\./g, c => { return String.fromCharCode(c.charCodeAt(0) + 0xFEE0) }) }

        let puele = eleget0(`${target}`)
        let scale = Math.max(1, Math.min(SCALE_MAX, SCALE_MIN + (elegeta('img:not(.quoteSpeechBalloonImg)', puele).length * 0.5)))
        popup3(`左クリック：ポップアップを保存\n左クリック+Ctrl：ポップアップを保存（高画質）\nScale = ${scale}`)
        document.dispatchEvent(new CustomEvent('saveDOMAsImage', { detail: JS({ element: target, filename: fn, scale: scale }) }))
      }
    }
  }

  if (lh('https://.*.2chan.net/b/futaba.htm') && eleget0('input[value="スレッドを立てる"]')) {
    let ele = elegeta(`textarea#ftxa:not([elastictextarea])`)
    elasticTextarea(ele);

    function elasticTextarea(ele) {
      ele.forEach(ele => { //ele.style.width="50%";
        if (ele.rows) { ele.style.height = ""; }
        ele.setAttribute("elastictextarea", "1");
        ele.setAttribute("wrap", "on");
        ele.addEventListener("input", () => stretch(ele));
        ele.addEventListener("focus", () => stretch(ele));
        ele.addEventListener("focus", e => !GFS.has(e.target) ? (GFS.add(e.target), $(e.target).animate({ "width": `50vw` }, 111)) : 0)
        window.addEventListener("resize", () => stretch(ele, "resize"))
      });
      return;
    }

    function stretch(ele, opt = "") {
      let clientHeight = Math.min(document.documentElement.clientHeight, window.innerHeight) - 165;
      /*ele.style.height = `${clientHeight}px`;*/
      if (ele?.value == "") {
        ele.style.height = `5em`;
      }
      if (ele?.offsetHeight > clientHeight) { ele.style.height = `${clientHeight}px`; }
      let height = ele.scrollHeight;
      let lineHeight = Number((ele?.offsetHeight || 0));
      //for (let i = 0; i < 200 && (height >= ele.offsetHeight) && ele.offsetHeight < clientHeight; i++) {
      for (let i = 0; i < 200 && (height > ele.offsetHeight) && ele.offsetHeight < clientHeight; i++) {
        lineHeight += 10;
        if (lineHeight >= clientHeight) { ele.style.height = `${clientHeight}px`; break; }
        ele.style.height = lineHeight + "px";
      }
      if (opt != "resize" || document.activeElement == ele) ele.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  if (/\.2chan\.net/.test(new URL(location.href).hostname) && lh('/res/')) { // ふたば
    popup2(`r：ホバーしているレス/No./画像を引用\nR：ホバーしているレス/No./画像を引用（追記）`, 10)
    $('#ftxa').css({ "opacity": "0.5", "padding": "0.5em", "font-size": "14px", "line-height": "1.2", "font-family": "sans-serif" }) //14pxで1.2emか15pxで1.1emか
    addstyle.add('small:has(a[href="http://www.2chan.net/"][target="_top"]) { min-height: 8em; display: inline-block; }')
    addstyle.add(`#ftxa:hover,#ftxa:focus{opacity:1 !important;}`)
    setFloatKakikomi2({ textareaXP: '#ftxa', submitbuttonXP: 'input[type="submit"][value="返信する"]', wid: '55%', minwid: 700 })
    $('#ftxa').on("change click", () => { floatKakikomi2({ doFocus: 0, textareaXP: 'textarea#ftxa', submitbuttonXP: 'input[type="submit"][value="返信する"]', wid: '55%', minwid: 700 }) })
    $(eleget0('//input[@type="submit" and @value="返信する"]')).on("click", () => { setTimeout(() => { $('#ftxa').attr("rows", MINIMUM_ROWS) }, 500) })
    // レスにホバーしてキー入力
    $(document).on("keypress", e => {
      if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      var selectedStr = window.getSelection().toString() ? ">" + window.getSelection().toString().replace(/^\r\n/, "").replace(/\r?\n/g, "\r\n>").replace(/^\r?\n|\r?\n$/, "\r\n").replace(/([^\n])$/, "$1\n") : null;
      if ($('#ftxa').length) {
        if ((selectedStr && (key === "r" || key === "Shift+R"))) { // r::（文字列選択中）選択中の文字列を引用（R::追記）
          $('div.slp1').hide()
          $('#ftxa').attr("rows", MINIMUM_ROWS)
          $('#ftxa').val((key === "Shift+R" ? $('#ftxa').val() + ($('#ftxa').val()?.slice(-1) != "\n" ? "\n" : "") : "") + selectedStr)
          floatKakikomi2({ textareaXP: 'textarea#ftxa', submitbuttonXP: 'input[type="submit"][value="返信する"]', wid: '55%', minwid: 700 })
          return false;
        }
        if ((!selectedStr && (key === "r" || key === "Shift+R"))) { // r::（文字列不選択）ホバー中のレスNo.を引用（R::追記）　レス番にホバーならレス番＞本文がキターならレス番＞本文ホバーなら本文を引用の順に優先
          $('div.slp1').hide()
          let cno = eleget0('span.cno:hover') // レスNo.にホバーしていればそれ
          let hoveraimg = eleget0('a img:hover , a video:hover')
          let hovera = [hoveraimg?.parentNode?.previousElementSibling?.previousElementSibling, hoveraimg?.parentNode?.previousElementSibling?.previousElementSibling?.previousElementSibling, ...elegeta('div.thre>a:first-child:hover,.rtd a+br+a:hover')].find(e => e?.href?.match(/\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm|mkv)$/gmi) && e?.textContent > "") // 画像ファイル名にホバーしていればそれ

          let honbunclone = eleget0('table:hover blockquote') //?.cloneNode(true)
          //$('.quoteSpeechBalloon').css({"opacity":"0"})
          elegeta('.quoteSpeechBalloon,.quoteSpeechBalloonImg', honbunclone).forEach(e => e.style.display = "none")
          let honbun = hovera || !cno && honbunclone

          if (honbun?.innerText == "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!" || honbun?.innerText == "ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!!") honbun = null
          if (!cno && !honbun) cno = eleget0('table:hover span.cno')
          if (honbun) { $(honbun).effect("highlight", 500) } else { if (cno) $(cno).effect("highlight", 500); }
          $('#ftxa').attr("rows", MINIMUM_ROWS)
          if (cno || honbun) $('#ftxa').val((key === "Shift+R" ? $('#ftxa').val() + ($('#ftxa').val()?.slice(-1) != "\n" ? "\n" : "") : "") + (honbun ? ">" + honbun?.innerText?.replace(/^\r\n/, "").replace(/\r?\n/g, "\r\n>").replace(/^\r?\n|\r?\n$/, "\r\n").replace(/([^\n])$/, "$1\n") : cno ? ">" + cno.textContent + "\n" : ""))
          floatKakikomi2({ textareaXP: 'textarea#ftxa', submitbuttonXP: 'input[type="submit"][value="返信する"]', wid: '55%', minwid: 700 })
          elegeta('.quoteSpeechBalloon,.quoteSpeechBalloonImg', honbunclone).forEach(e => e.style.display = "inline")
          return false;
        }
      }
    });
    $('body').on('mouseup', function(e) {
      if (window.getSelection) {
        var selectedStr = window.getSelection().toString();
        if (selectedStr != '' && selectedStr != '\n') {
          popup2(`r：引用\nR：引用（追記）`, 10); //popup2(`『${selectedStr}』を\nr：引用\nR：引用（追記）`, 5);
        }
      }
    });
  }

  if (/shitaraba/.test(location.href)) { // したらば
    setTimeout(() => {
      IIS = Math.min(IIS, eleget0('.post') ? 1 : 0) // 旧5chでは0-1
      quote();
      hNukiURLHokan()
      videoUmekomi() //setInterval(videoUmekomi, WAIT_VIDEO_EMBED_INTERVAL);
      setInterval(imageUmekomi, WAIT_IMAGE_EMBED_INTERVAL);
      if (enableHoverZoom) setInterval(onmove, 16.667);
      bokashi()
      //      setFloatKakikomi2({ textareaXP: 'textarea[name="MESSAGE"]', submitbuttonXP: 'div#form_write>form[method="POST"]>input[value="書き込む"]' })
      setFloatKakikomi2({ textareaXP: '//textarea[@name="MESSAGE"]', submitbuttonXP: '//div[@id="form_write"]/form[@method="POST"]/input[@value="書き込む"]' })
    }, 999)
    return;
  }

  // したらばはここまで

  if (location.href.match(/SETTING.TXT$/)) { // SETTING
    var e = document.body.innerText.match(/BBS_LINE_NUMBER=(\d*)/);
    if (e) { pref(getIta() + " : line_number", e[1]); }
    var e = document.body.innerText.match(/BBS_MESSAGE_COUNT=(\d*)/);
    if (e) { pref(getIta() + " : message_count", e[1]); }
    return;
  }

  function getIta() {
    let name = location.href.match(/^https?:\/\/.+\.5ch\.net\/test\/read.cgi\/([^\/]+)/) || location.href.match(/^https?:\/\/.+\.5ch\.net\/([^\/]+)/);
    if (name) name = name[1]
    return name;
  }
  var line_number = pref(getIta() + " : line_number") || null;
  var message_count = pref(getIta() + " : message_count") || null;

  if (location.href.match(/^https?:\/\/.+\.5ch\.net\/[^/]+\/$/) && eleget0('//div[last()]/form[@method="POST"]/p/input[@value="新規スレッド作成"]')) { // 板トップ
    elegeta('//div[@class="NEW_THREAD"]/form[@method="POST"]/p/textarea').forEach(mes => {
      mes.setAttribute("stretchabletextarea", "1");
      mes.setAttribute("wrap", "on");
      mes.style.width = "90%";
      mes.addEventListener("input", () => kakikomiStretch(mes));
      mes.addEventListener("focus", () => kakikomiStretch(mes));
    });
    elegeta('//textarea[not(@stretchabletextarea)]').forEach(mes => {
      mes.setAttribute("stretchabletextarea", "1");
      mes.setAttribute("wrap", "on");
      mes.style.width = "90%";
      mes.addEventListener("input", () => kakikomiStretch(mes, "nearest"));
      mes.addEventListener("focus", () => kakikomiStretch(mes, "nearest"));
    });
    return;

    function kakikomiStretch(target, scrollBlock = "center") {
      if (target.value == "") target.style.height = "100px";
      let lineHeight = target.style.height.match("px") ? Number((target.style.height || "0px").replace("px", "")) : 0; //getAttribute("rows"));
      let height = target.scrollHeight; //+12;
      let clientHeight = Math.min(document.documentElement.clientHeight, window.innerHeight) - 165;
      for (let i = 0; i < 200 && (height >= target.offsetHeight) && target.offsetHeight < clientHeight; i++) {
        lineHeight += 10;
        target.style.height = lineHeight + "px";
      }
      requestAnimationFrame(() => { target.scrollIntoView({ behavior: "smooth", block: scrollBlock, inline: "center" }); })
      displayLineLimit(target);
    }
  }

  //if (/^https?:\/\/.+\.5ch\.net\/test\/read\.cgi\/.+/.test(location.href) == false) { return; }
  if (/^https?:\/\/.+\.5ch\.net\/test\/read\.cgi\/.+|https:\/\/kako\.5ch\.net\/test\/read\.cgi\/[^\/]+\/\d+\//.test(location.href) == false) { return; }
  // ここ以降は5chのみ

  // cd6::
  const DURACD6 = 100;
  addstyle.add('.imgbox>img{cursor: zoom-in;}')
  ael(document, "click", evt => {
    if (evt?.target?.matches(':is(:is([href*=".gif"],[href*=".png"],[href*=".jpg"],[href*=".jpeg"],[href*=".webp"],[href*=".avif"]) > img)') && (evt?.button <= 0)) {
      evt.stopImmediatePropagation() + evt.preventDefault() + evt.stopPropagation();
      return false
    }
  }, true)
  ael(document, "mousedown", evt => {
    if (evt?.target?.matches('.imgbox > img') && (evt?.button <= 0)) {
      evt.stopImmediatePropagation() + evt.preventDefault() + evt.stopPropagation();

      if (!document.fullscreenElement) {
        let p = document.documentElement.requestFullscreen();
        p.catch(() => {});
      }
      GF.hideBar = addstyle.add('body {overflow:hidden !important;} #hoverHelpPopup,.phov{display:none !important;}')
      let preSrc = evt?.target?.src
      eleget0('.ignoreMe.hzP')?.animate([{}, { opacity: 0 }], { duration: 100, fill: `both` })
      let panel = preSrc.match(/(webm|mp4|avi|mkv)$/) ?
        begin(document.body, `<video id="imgfullscreen" class="ignoreMe" autoplay controls loop style="z-index:${Number.MAX_SAFE_INTEGER}; position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit: contain; background-color:#0000; box-shadow:0 0 1em #0008;"><source referrerpolicy="no-referrer" src="${preSrc}" type="video/mp4"></video>`) :
        begin(document.body, `<img id="imgfullscreen" class="ignoreMe" src="${preSrc}" style="z-index:${Number.MAX_SAFE_INTEGER}; position:fixed; top:0; left:0; width:100%; height:100%; object-fit: contain; background-color:#0000; box-shadow:0 0 1em #0008;">`);

      const pmaxEsc = e => (e.key == "Escape") && previewEnd();
      document.addEventListener("keydown", pmaxEsc, { capture: true, once: 1 })
      document?.addEventListener("mousedown", e => {
        e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
        previewEnd()
      }, { capture: true, once: 1 });
      panel?.animate([{ backgroundColor: "#0000", transform: "scale(0.9)", opacity: 0 }, { backgroundColor: "#0008", transform: "scale(1)", opacity: 1 }], { duration: 100, easing: 'ease', fill: 'both' })

      function previewEnd() {
        addstyle.remove(GF.hideBar)
        let panel = eleget0("#imgfullscreen")
        let s = +(panel?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1);
        let r = panel?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
        document.removeEventListener('mousemove', pmaxmove)
        document.removeEventListener("keydown", pmaxEsc, { capture: true, once: 1 })
        if (s <= 1 && r % 360 == 0) panel.animate({ transformOrigin: "50% 50%" }, { duration: 0, easing: 'ease', fill: 'both' });
        let ae = panel?.animate([(s <= 1 && r % 360 == 0) ? { transformOrigin: "50% 50%" } : {}, { backgroundColor: "#0000", transform: `scale(${s-0.1})`, opacity: 0 }], { duration: DURACD6, easing: 'ease', fill: 'both' })
        ae.onfinish = () => panel?.remove()
      }
      document.addEventListener('mousemove', pmaxmove)

      function pmaxmove(e) {
        let panel = eleget0("#imgfullscreen")
        let s = +(panel?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1);
        let r = panel?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
        let to = `${minmax(Math.min(e.clientX,clientWidth())/clientWidth() *100,0,100)}% ${minmax(Math.min(e.clientY,clientHeight())/clientHeight()*100,0,100)}%`
        //console.log(s,r,e.clientX,clientWidth(),to)
        anima(panel, { "transformOrigin": to, "transform-origin": to });
      }
      panel.addEventListener('wheel', e => {
        let panel = eleget0("#imgfullscreen")
        e.stopPropagation()
        e.preventDefault()
        if (!e.shiftKey) {
          let s = +(panel?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1);
          let r = panel?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
          s = Math.min(50, Math.max(1, +s - (e.deltaY) / 1000));
          let to = `${minmax(Math.min(e.clientX,clientWidth())/clientWidth() *100,0,100)}% ${minmax(Math.min(e.clientY,clientHeight())/clientHeight()*100,0,100)}%`
          anima(panel, { "transform": panel.style.transform.replace(/initial|scale\([0-9\-\.]+\)/g, "") + `scale(${s})`, "transformOrigin": to, "transform-origin": to });
        } else {
          let s = +(panel?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1);
          let r = panel?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
          r = (Math.round(((r - (-e.deltaY) / 10)) / 10) * 10);
          let to = `${minmax(Math.min(e.clientX,clientWidth())/clientWidth() *100,0,100)}% ${minmax(Math.min(e.clientY,clientHeight())/clientHeight()*100,0,100)}%`
          anima(panel, { "transform": panel.style.transform.replace(/initial|rotate\([0-9\-\.]+deg\)/g, "") + ` rotate(${r}deg)`, "transformOrigin": to, "transform-origin": to });
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



  addstyle.add(`.post a{word-break:break-all;}`)

  // videoui::
  addstyle.add(`
  .ytvhandle:has(:is(iframe[src*="nicovideo"], script[src*="embed.nicovideo.jp/watch/"])) {    display: inline-block;  }
  .ytvhandle:has(:is(iframe[src*="youtube"], iframe[src*="nicovideo"], script[src*="embed.nicovideo.jp/watch/"])) {
  overflow: hidden; resize: both; cursor: grab; padding: 0 0.8rem 0 0; border: 1px solid #888; background-color: #fff; width: ${inlineVideoThumbnailHeight *16/9}px; height: ${inlineVideoThumbnailHeight}px; margin: 0.2em 0.5em 0 0; text-align:center; align-content:center; transition:background-color 0.2s;
}
`)
  //  overflow: hidden; resize: both; cursor: grab; padding: 0 0.8rem 0 0; border: 1px solid #888; background-color: #fff; width: ${inlineVideoThumbnailHeight *16/9}px; height: ${inlineVideoThumbnailHeight}px; margin: 0.5em 0.5em 0em 0em; text-align:center; align-content:center; transition:background-color 0.2s;

  new MutationObserver(m => {
    if (m.find(e => e?.target?.matches('.ytvhandle:has(:is(iframe[src*="youtube"] , iframe[src*="nicovideo"] , script[src*="embed.nicovideo.jp/watch/"]))'))) {
      [...document.querySelectorAll(':is(iframe[src*="youtube"] , iframe[src*="nicovideo"] , script[src*="embed.nicovideo.jp/watch/"])')].forEach(f => {
        let d = f?.closest("div");
        if (d) {
          let com = window.getComputedStyle(d);
          f.width = d.offsetWidth - parseFloat(com.paddingLeft) - parseFloat(com.borderLeft) - parseFloat(com.paddingRight) - parseFloat(com.borderRight);
          f.height = d.offsetHeight - parseFloat(com.paddingTop) - parseFloat(com.borderTop) - parseFloat(com.paddingBottom) - parseFloat(com.borderBottom);
          let w = Math.max(...elegeta('div,img,video', f.closest('.imgbox')).map(e => e.offsetWidth || 0));
          f.closest('.imgbox').style.setProperty("max-width", `min(80% , max(66% , ${w + 10}px ) )`)
        }
      })
    }
  }).observe(document, { attributes: true, childList: true, subtree: true });

  function qs(q, n = document) { return document.querySelector(q, n) }

  function qsa(q, n = document) { return [...document.querySelectorAll(q, n)] }

  let G = {},
    VD = `.ytvhandle:has(:is(iframe[src*="youtube"] , iframe[src*="nicovideo"] , script[src*="embed.nicovideo.jp/watch/"]))`;
  document.addEventListener("mousedown", e => {
    if (e?.target?.matches(VD) && e.button == 0) {
      qsa('iframe').forEach(e => { e.style.setProperty("pointer-events", "none") })
      e.target.dataset.sbu = e.target.dataset?.sbu || JSON.stringify(["position", "left", "top", "right", "bottom", "cursor", "box-shadow", "width", "height"].map(v => e?.target?.style?.[v]));
      [...new Set([e.target, ...(elegeta(VD).sort((a, b) => window.getComputedStyle(b).zIndex - window.getComputedStyle(a).zIndex))])].reverse().forEach((e, i) => e.style.zIndex = i + 1)
      if (window.getComputedStyle(e?.target)?.resize == "both" && e.clientX > e?.target.offsetLeft + e?.target.getBoundingClientRect().width - 15 && e.clientY > e?.target.getBoundingClientRect().top + e?.target.getBoundingClientRect().height - 15) return;
      e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
      G.indrag = e?.target;

      return false;
    }
  }, true);
  document.addEventListener("mouseup", e => {
    qsa('iframe').forEach(e => { e.style.setProperty("pointer-events", "auto") })
    if (!G?.indrag) return;
    G.indrag = null;
  }, true);

  document.addEventListener("dblclick", e => {
    JSON.parse(e?.target?.dataset?.sbu).forEach((v, i) => { e.target.style.setProperty(["position", "left", "top", "right", "bottom", "cursor", "box-shadow", "width", "height"][i], v) })
  }, true);

  document.addEventListener("mousemove", e => {
    if (!G?.indrag || !(e.movementX || e.movementY)) return;
    if (window.getComputedStyle(G.indrag).position != "fixed")[G.indrag.style.position, G.indrag.style.left, G.indrag.style.top] = ["fixed", `${G.indrag.getBoundingClientRect().left}px`, `${G.indrag.getBoundingClientRect().top}px`];
    G.indrag.style.left = `${(G.indrag.getBoundingClientRect().left + e.movementX)}px`;
    G.indrag.style.top = `${(parseFloat(window.getComputedStyle(G.indrag).top) + e.movementY)}px`;
  }, true);


  // httpならhttpsに
  if (location.href.indexOf("http://") != -1) {
    location.href = location.href.replace(/^http:\/\//, "https://");
    return;
  }
  if (location.href.indexOf("subback.html") != -1) { return; }
  if (location.href.match(/\/\/.*\.5ch\.net\/\w*\/$/)) { return; }

  $(".mascot").attr("style", "");
  let serverColor = colorFromText(new URL(location.href).hostname, 50, 30);

  if (document?.body?.scrollWidth <= document?.body?.clientWidth) {
    $(document.body).append(`<span id="fchVerticalThreadTitle" style="writing-mode: vertical-rl; top:2em; ${NEW5CH?"right:2em; padding-bottom:2em;":"right:0.3em;"} position:fixed;z-index:-111; font-size:3em; opacity:0.5; color:${serverColor};">${document.title}</span>`);
    //  if (NEW5CH) $(document.body).append(`<span id="fchVerticalThreadTitle" style="writing-mode: vertical-rl; top:2em; ${NEW5CH?"left:2em; padding-bottom:2em;":"right:0.3em;"} position:fixed;z-index:-111; font-size:3em; opacity:0.5; color:${serverColor};">${document.title}</span>`);
    if (NEW5CH) $(document.body).append(`<span id="fchVerticalThreadTitle" style="writing-mode: vertical-rl; top:2em; ${NEW5CH?"left:2em; padding-bottom:2em;":"right:0.3em;"} position:fixed;z-index:-111; font-size:3em; opacity:0.5; color:${serverColor};">${document.title}</span>`);
    $(eleget0('//ul/li[@class="menubottomnav"]/a[@class="menuitem" and text()="全部"]/../../..')).before(`<span id="bottomDocTitle" style=" margin:0 0 0 0.2em;font-size:1.5em; opacity:0.9; color:${serverColor};">${document.title}</span>`);
  } else {
    //let center=eleget0('div#threadcontent.column.thread')
    //window.scrollTo(center?.offsetLeft+center?.scrollIntoView({block:"center",inline:"start"})
    eleget0('div#threadcontent.column.thread')?.scrollIntoView({ inline: "center", block: "start" })
  }

  function colorFromText(txt, s, l) {
    return !txt ? "hsl(0,50%,50%)" : `hsl(${Array.from(txt).map(ch => ch.charCodeAt(0)).reduce((a, b) => a+b)**3%360}, ${s}%, ${l}%)`;
  }

  bokashi()
  mof(e => { if (e?.querySelector("img")) setBokashi() }, document.body)

  function mof(func, observeNode = false) {
    new MutationObserver((m) => {
      let eles = m.map(v => [...v?.addedNodes]).flat().filter(v => v?.nodeType === 1);
      eles?.forEach(e => func(e))
    })?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });
  }

  function setBokashi() {
    GF.inlineImageThumbnailBokashi = pref("inlineImageThumbnailBokashi") || 0;
    addstyle.add(`:is(.post img , .post video):not([src*="//img.5ch.net/ico/"]) { filter: blur(${GF.inlineImageThumbnailBokashi*(inlineImageThumbnailHeight/65)}px) !important;}`, "imgbokashi");
    elegeta(':is(.post img , .post video):not([src*="//img.5ch.net/ico/"])').forEach(e => e.style.filter = `blur(${e.getBoundingClientRect().height * GF.inlineImageThumbnailBokashi / 65 }px !important;)`)
  }

  function bokashi() {
    setBokashi(); // タブに戻ったらぼかしの最新を読み込んで再設定
    document.addEventListener("visibilitychange", e => {
      if (document.visibilityState == "visible") {
        setBokashi()
        //popup2(`8:インラインサムネイルのぼかしを－\n9:インラインサムネイルのぼかしを＋\n現在値＝${GF.inlineImageThumbnailBokashi}/10`, 4, `hsl(220,${GF.inlineImageThumbnailBokashi*5}%,50%)`) //inlineImageThumbnailBokashi > 0 ? undefined : "#888")
      }
    })

    $(document).on("keypress", e => {
      if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if (key === "8" || key === "9") { // 8::9:: ぼかしを増減
        GF.inlineImageThumbnailBokashi = (+GF.inlineImageThumbnailBokashi + (key === "8" ? 10 : 1)) % 11;
        pref("inlineImageThumbnailBokashi", GF.inlineImageThumbnailBokashi)
        setBokashi();
        popup2(`8:インラインサムネイルのぼかしを－\n9:インラインサムネイルのぼかしを＋\n現在値＝${GF.inlineImageThumbnailBokashi}/10`, 4, `hsl(220,${GF.inlineImageThumbnailBokashi*5}%,50%)`) //inlineImageThumbnailBokashi > 0 ? undefined : "#888")
      }
    })
    popup2(`8:インラインサムネイルのぼかしを－\n9:インラインサムネイルのぼかしを＋\n現在値＝${GF.inlineImageThumbnailBokashi}/10`, 4, `hsl(220,${GF.inlineImageThumbnailBokashi*5}%,50%)`) //inlineImageThumbnailBokashi > 0 ? undefined : "#888")
  }

  // レスにホバーしてキー入力
  $(document).on("keypress", e => {
    if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    var selectedStr = window.getSelection().toString() ? ">" + window.getSelection().toString().replace(/^\r\n/, "").replace(/\r\n/g, "\r\n>").replace(/^\r\n|\r\n$/, "\r\n") : null;
    let num = getNearest('.post');
    let current = location.href + ((location.href.match(/^https?:\/\/.+\.5ch\.net\/test\/read\.cgi\/\w+\/\d+$/)) ? "/" : ""); // /18246213874 で終わるとバグる
    if ($('form>p>textarea').length) {
      if ((selectedStr && (key === "r" || key === "Shift+R"))) { // r::（文字列選択中）ホバー中のレスを引用（R::追記）
        let res = getNearest('div.message');
        if (num && (num?.id >= 2 || (num?.id == 1 && $(window).scrollTop() < 500))) {
          $(getNearest(NEW5CH ? ".post" : 'div.post')).effect("highlight", 500);
          floatKakikomi2({
            string: ">>" + num?.id + "\r\n" +
              (selectedStr ? selectedStr : (res.innerText.replace(/^(.+)$/gm, ">$1"))) + "\r\n",
            addMode: (e.key == "R" || e.key == "C"),
            command: e.key == "r" ? "resetHeight" : null
          });
        }
        return false;
      }
      if (key == "r" || key == "Shift+R") { // r::ホバー中のレスにアンカー　R::レスにアンカー（追記）
        if (num?.id >= 2 || (num?.id == 1 && $(window).scrollTop() < 500)) {
          $(getNearest(NEW5CH ? ".post" : 'div.post')).effect("highlight", 500);
          floatKakikomi2({ string: ">>" + num?.id + "\n", addMode: e.key == "R", command: e.key == "r" ? "resetHeight" : null });
        } else {
          floatKakikomi2({ string: "", addMode: e.key == "R", command: e.key == "r" ? "resetHeight" : null });
        }
        return false;
      }
    }

    if (key === "m" || key === "," || key === "Shift+M" || key === "Shift+<") { // ,::そのレス以降を表示 m::そのレスの10個前以降を表示　（Shiftを押しながらだと新しいタブで開く）
      if (OLD5CH) { popup2("m/,/.:この機能は現在新5chでは使えません"); return; }
      let num = getNearest('.post');
      if (num) {
        let num2 = (num.id) - (/m/i.test(key) ? 10 : 0);
        $(getNearest('div.post')).effect("highlight");
        let last = current.replace("?v=pc", "").replace(/\/l\d+$/, "/").replace(/^.*\/([0-9]{0,4})?-?([0-9n]{0,4}?$)/gm, "$2");
        let url = current.replace("?v=pc", "").replace(/\/l\d+$/, "/").replace(/\/[0-9\-]{0,4}-?[0-9n]{0,4}?$/gm, "/").replace(/(\d)$/, "$1/") + Math.max(1, num2) + "-" + last;
        if (!confirm(url)) return;
        if (/Shift\+/i.test(key)) { window.open(url) } else { location.href = url; }
      }
      return false;
    }
    if (key === "." || key === "Shift+>") { // .::そのレス以前を表示　（Shiftを押しながらだと新しいタブで開く）
      if (OLD5CH) { popup2("m/,/.:この機能は現在新5chでは使えません"); return; }
      let num = getNearest('.post');
      if (num) {
        let num2 = (num.id) - (e.key === "m" ? 10 : 0);
        $(getNearest('div.post')).effect("highlight");
        if (num2 > 1) {
          let url = current.replace("?v=pc", "").replace(/\/l\d+$/, "/").replace(/(\/[0-9]{0,4})-?[0-9n]{0,4}?$/gm, "$1") + "-" + Math.max(1, num2);
          if (!confirm(url)) return;
          if (/Shift\+/i.test(key)) { window.open(url) } else { location.href = url; }
        }
      }
      return false;
    }
    if (key === "l") { // l::ホバー中のレスへのリンクをコピー
      if (num) {
        $(getNearest('div.post')).effect("highlight", 500);
        GM.setClipboard(document.title + "\r\n" + location.href.replace(/\/l\d+$/, "").replace(/\/[0-9\-]{0,4}-?[0-9n]{0,4}?$/gm, "/").replace(/\?v=pc/, "").replace(/(\d)$/, "$1/") + num.id + "\r\n");
      }
      return false;
    }
    if (key === "y" && yandexUrl) { // y::ホバー中の画像をyandex画像検索で検索
      if (window.confirm(yandexUrl + "\n\nを開きます。よろしいですか？")) window.open(yandexUrl);
      return false;
    }
  });

  $(document).on("keydown", e => {
    if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    if (key === "d" && !eleget0('img:hover,video:hover')) { // d::書き込み欄にスクロール
      scrollKakikomi(0, 0, 1);
    }
  });

  if (enableHoverZoom) setInterval(onmove, 16.667);

  function onmove() {
    let ele = document.elementFromPoint(mousex, mousey);
    if (lastEle !== ele) {
      $('img.hzP').remove();
      poppedUrl = "";
    }
    if (ele)
      if (ele.tagName === "IMG" && lastEle !== ele) {
        poppedUrl = pe(ele);
        yandexUrl = poppedUrl.match(/\;base64\,/i) ? null : "https://yandex.com/images/search?rpt=imageview&url=" + poppedUrl;
      }
    lastEle = ele;
  }

  function pe(a) {
    var panel = document.createElement("img")
    if (!a) return;
    var src = ""
    if (a.parentNode && a.parentNode.tagName == "A" && a.parentNode.href.match(/\.png|\.jpg|\.jpeg|\.gif|\.bmp/i)) {
      src = decodeURIComponent(a.parentNode.href.replace(/https?:\/\/jump\.5ch\.net\/\?|https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=/, ""));
    } else if (a.parentNode && a.parentNode.parentNode && a.parentNode.parentNode.tagName == "A" && a.parentNode.parentNode.href.match(/\.png|\.jpg|\.jpeg|\.gif|\.bmp/i)) {
      src = decodeURIComponent(a.parentNode.parentNode.href.replace(/https?:\/\/jump\.5ch\.net\/\?|https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=/, ""));
    }
    panel.className = "hzP"; //notifyMe(panel.src)
    panel.src = src;
    setSize(a, panel, a);
    document.body.appendChild(panel);
    panel.addEventListener('load', e => {
      setSize(e.target, e.target, a);
    });
    return panel.src;
  }

  function setSize(a, b, s) {
    var panel = b;
    let imgAspect = a.naturalWidth / a.naturalHeight; // svg等だとNaN 要.onload
    let clientAspect = window.innerWidth / 2 / window.innerHeight;

    let peStyle = 'margin:2px; border-radius:3px; color:#ffffff;  box-shadow:3px 3px 8px #0008; border:2px solid #fff;';
    let boxPos = (mousey < (window.innerHeight / 2) ? "bottom:0px;" : "top:0px;") + ((mousex < document.documentElement.clientWidth / 2) ? "right:0px; " : "left:0px;");
    panel.className = "ignoreMe hzP";
    let amariWidth = (mousex < document.documentElement.clientWidth / 2) ? (document.documentElement.clientWidth - (s.getBoundingClientRect()).right) : (s.getBoundingClientRect().left);

    if (imgAspect && ((window.innerHeight * imgAspect - marginPe) < amariWidth - marginH)) {
      panel.setAttribute("style", `all:initial;float:none; width:${(window.innerHeight)*imgAspect-marginPe}px; height:${((window.innerHeight))-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 縦目いっぱい
      if (debug) popup(`余り左右:${amariWidth} naturalWidth:${a.naturalWidth} naturalHeight:${a.naturalHeight} a:${Math.round(imgAspect*100)/100} 縦目いっぱい`)
    } else if (imgAspect && (((amariWidth - marginH) / imgAspect) <= window.innerHeight)) { //&& (amariWidth - marginH - marginPe) > a.width * 2.5)) {
      panel.setAttribute("style", `all:initial;float:none; width:${amariWidth-marginH-marginPe}px; height:${(amariWidth-marginH)/imgAspect-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 元絵の左右にくっつき最大
      if (debug) popup(`余り左右:${amariWidth} naturalWidth:${a.naturalWidth} naturalHeight:${a.naturalHeight} a:${Math.round(imgAspect*100)/100} くっつき`)
    } else if (!imgAspect || window.innerWidth * 0.48 / imgAspect - marginPe <= window.innerHeight) {
      panel.setAttribute("style", `all:initial;float:none; width:${window.innerWidth*0.48-marginPe}px; height:${window.innerWidth*0.48/imgAspect-marginPe}px; ${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 横48％
      if (debug) popup(`余り左右:${amariWidth} naturalWidth:${a.naturalWidth} naturalHeight:${a.naturalHeight} a:${Math.round(imgAspect*100)/100} width:${window.innerWidth*0.48-marginPe}px; height:${window.innerWidth*0.48/imgAspect-marginPe}px; 48%`)
    } else {
      panel.setAttribute("style", `all:initial;float:none; width:${(window.innerHeight)*imgAspect-marginPe}px; height:${((window.innerHeight))-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 縦目いっぱい
      if (debug) popup(`余り左右:${amariWidth} naturalWidth:${a.naturalWidth} naturalHeight:${a.naturalHeight} a:${Math.round(imgAspect*100)/100} 縦目いっぱい２`)
    }
  }

  function getNearest(xpath) {
    let e = document.elementFromPoint(mousex, mousey);
    return e.closest(xpath)
  }

  // 書き込み欄までスクロール
  function scrollKakikomi(loop = 0, tolatestres = 0, onkey = 0) { //d::
    var ele = elegeta('.thread .post')?.filter(e => e.offsetHeight)?.slice(-1)?.find(e => e)
    if (ele && (eleget0('//form/p/textarea[@name="MESSAGE"]') || onkey)) {
      //elegeta('div.navmenu')?.pop()?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
      eleget0('div.newposts')?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
      //window.scroll({ top: ele?.getBoundingClientRect()?.bottom + window.pageYOffset - window.innerHeight + 200, left: 0, behavior: "instant" })
    } else if (loop) setTimeout(() => { scrollKakikomi(loop - 1, tolatestres) }, 500);
  }

  function waitElement(xpath, cb, interval = 333, anywaydo = NEW5CH ? 222 : Math.min(9999, WAIT * 4), start = Date.now()) { //Number.MAX_SAFE_INTEGER, start = Date.now()) {
    let ea = elegeta(xpath) //.filter(e => e.offsetHeight)
    if (ea.length || (Date.now() - start >= anywaydo)) { cb(ea) } else { setTimeout(() => waitElement(xpath, cb, Math.min(interval + 100, anywaydo), anywaydo, start), interval) }
  }
  //document.body.addEventListener('DOMNodeInserted', e=>console.log(e.target), false); // 追加されたDOMを全て見る

  waitElement('form p textarea[name="MESSAGE"]', () => {
    setTimeout(() => scrollKakikomi(10, 1), 999)

    let ma = $(xa('//input[@placeholder="メールアドレス(省略可)"]'));
    ma.dblclick(() => {
      ma.val(ma.val() == "sage" ? "" : "sage");
      floatKakikomi2();
    });

    // 細かい調整
    $("div.formbox").css("margin", "0");
    $('input[placeholder="メールアドレス(省略可)"]').val(DEFAULT_MAIL_ADDRESS);
    $("form>p>textarea").click(() => {
      floatKakikomi2();
    });
  })

  //waitElement('#optionView,.flex-container.wrap,.searchform_input-close.hidden,#ch5styleoldnewmodend', (e) => {
  setTimeout(() => {
    setTimeout(hNukiURLHokan, 0);
    //videoUmekomi() //setInterval(videoUmekomi, WAIT_VIDEO_EMBED_INTERVAL);
    setInterval(imageUmekomi, WAIT_IMAGE_EMBED_INTERVAL);
    quote();
  }, 999)

  return;

  function quote() {
    // >>文字列に本文冒頭の引用を追加 qsb::
    setTimeout(() => {
      var quos = elegeta('a.reply_link').filter(v => v.innerText.match(/^>>[0-9\-]+$/))
      let table = elegeta(`.post`)
      quos.filter(e => /^\>+\d+/m.test(e?.textContent)).forEach((e, i) => { //緑文字の引用行文字列
        e.dataset.quoted = 1
        let origno = e?.textContent?.match0(/>+(\d+)/)

        let srcTable = table.find(v => v?.id == origno) //after(e,` ${saki}`)/*
        if (srcTable && (isShitaraba || e?.nextSibling?.nodeValue == " ")) {
          var lead = eleget0(NEW5CH ? '.message,.post-content' : '.message', srcTable)?.innerText?.replace(/^\s*>+.*$/gm, "")?.replaceAll("ｷﾀ━━━(ﾟ∀ﾟ)━━━!!", "")?.trim()
          lead = lead?.trim()?.replace(/\n/gm, " ")?.trim()
          if (lead) {
            if (LEAD_LENGTH) {
              if (lead?.length > LEAD_LENGTH) lead = lead?.slice(0, LEAD_LENGTH)?.trim() + "…"
              after(e, ` <span class="quoteSpeechBalloon" data-quoteno="${origno}">&gt;${lead}</span>`)
            }
            eleget0('.relallArea', e?.closest(".post"))?.classList?.add("relallAreaon")
          }
        }
      })
    }, lh("5ch.net") ? 2000 : 5000)

    if (QUOTE_STYLE != "") {
      elegeta('div.message,dd,.post-content').forEach(e => {
        //elegeta('//div[@class="message"]|//dd').forEach(e => {
        if (/〉|》|＞|>[^>\d]+/m.test(e.textContent)) {
          e.outerHTML = e.outerHTML.replace(/(<div class="post-content">)\s*(((〉|》|＞|&gt;)[^>]+))(?!([^<]+)?>)/gmi, `$1<span class="t5quote" style="vertical-align:middle; cursor:pointer;${QUOTE_STYLE}">$2</span>`).replace(/<span class="escaped">\s*(((〉|》|＞|&gt;)[^>]+))(?!([^<]+)?>)/gmi, `<span class="t5quote" style="cursor:pointer;${QUOTE_STYLE}">$1</span>`).replace(/<dd>\s*(((〉|》|＞|&gt;)[^>]+))(?!([^<]+)?>)/gmi, `<dd> <span class="t5quote" style="${QUOTE_STYLE}">$1</span>`).replace(/<br>\s*(((〉|》|＞|&gt;)[^>]+))(?!([^<]+)?>)/gmi, `<br> <span class="t5quote" style="cursor:pointer;${QUOTE_STYLE}">$1</span>`)
        }
      }); // 引用に着色,タグの外側だけ置き換え // これをやるとシステムのサムネ添付が終わる
      setTimeout(() => { popuponquote(NEW5CH, 0) }, location.href.match0(/shitaraba/) ? 2000 : 0)
    }
    setTimeout(() => { elegeta('//a[@class="reply_link"]').forEach(e => e.setAttribute("onclick", "return false;")) }, location.href.match0(/shitaraba/) ? 2000 : 0)

    document.addEventListener("click", c => {
      let word
      if (c?.target?.matches(".quoteSpeechBalloon")) { word = c?.target?.dataset?.quoteno } else {
        let e = c.target.closest(".t5quote,.allpopup,.reply_link");
        if (e) {
          word = e.textContent.replace(/^〉+|^》+|^＞+|^>+/gm, "").trim()
        }
      }
      if (word) {
        let t = (word.match0(/^[0-9-]+$/) && eleget0(NEW5CH ? `.post[id="${word?.match0(/^\d+/)?.replace(/post/,"")}"]` : `//div[@id="${word?.match0(/^\d+/)?.replace(/post/,"")}"]`)) || elegeta('.message,.post-content').filter(f => !f.closest(".ch5pu")).find(c => c.textContent.indexOf(word) !== -1);
        if ($(t).is(":hidden")) $(t.closest(".post")).show(0).css({ "display": "table" }) // 学園祭で消していたら出す
        t?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        $(t.closest(".post")).effect("highlight", 750);
      }
    })
  }

  // h抜きのURLをリンクにする
  function hNukiURLHokan() {
    if (IIS == 2) {
      $(".post-content,.message").prepend('<div class="imgbox"></div>');
      //      const ibw = () => addstyle.add(`.imgbox{ margin:0 0 0 1rem; text-align:right; float:right; clear:both; max-width:calc(( 338px + ( 0.8rem * 2 ) ) * ${eleget0('.post-content')?.offsetWidth > 1000 ? 2 : 1 } ); vertical-align:bottom;} .post-content,.message{overflow-y:auto; clear:both; } `, "imgboxWidth")
      const ibw = () => addstyle.add(`.imgbox{ margin:0 0 0 1rem; text-align:right; float:right; clear:both; max-width:66%; vertical-align:bottom;} .post-content,.message{overflow-y:auto; clear:both; } `, "imgboxWidth")
      ibw();
      window.addEventListener("resize", ibw);
      document.addEventListener("resize", ibw)
    }
    if (IIS == 1) {
      $(".post-content,.message").append('<div class="imgbox"></div>')
    }
    elegeta('.post .post-content img:not([src*="//img.5ch.net/ico/"])').forEach(e => e.dataset.gakusai = "1");
    [...document.querySelectorAll(".post .message .escaped:not([data-urlcomplemented]),dd:not([data-urlcomplemented]),.post .post-content:not([data-urlcomplemented])")].forEach(function(ele) {
      [...ele.childNodes].filter(e => e.nodeType == 3).forEach(obj => {
        let html = obj.textContent?.trim()
        let url2 = html.match0(/^(t?tps?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/)
        if (url2) {
          let url = html.replace(/^t?(tps?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/, `ht$1`);
          if (/\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm|mkv)$/i.test(url)) ele.dataset.gakusai = "1";
          let dom = document.createElement("a")
          obj.replaceWith(dom)
          dom.outerHTML = `<a class="ignoreMe" referrerpolicy='no-referrer' rel='nofollow external noopener noreferrer' href='${url}'>${sani(url2)}</a>`;
        }
      })
    })
  }

  function setFloatKakikomi2({ textareaXP = 'form>p>textarea[name="MESSAGE"]', submitbuttonXP = 'input.submitbtn.btn', wid = "70%", minwid = 900 } = {}) {
    var mes = eleget0(textareaXP);
    if (mes) {
      mes.addEventListener("input", () => floatKakikomi2({ textareaXP: textareaXP, submitbuttonXP: submitbuttonXP, wid: wid, minwid: minwid }));
      mes.addEventListener("focus", () => floatKakikomi2({ textareaXP: textareaXP, submitbuttonXP: submitbuttonXP, wid: wid, minwid: minwid }));
      resListen = 1;
    }
  }

  // 書き込み欄調整、クリックでフロート化
  function floatKakikomi2({ string = null, addMode = 0, command = "", textareaXP = 'form>p>textarea[name="MESSAGE"]', submitbuttonXP = 'input.submitbtn.btn', wid = '70%', minwid = 900, doFocus = 1 } = {}) {
    var textarea = eleget0(textareaXP);
    if (!textarea) return
    var submitbutton = eleget0(submitbuttonXP)
    if (!resFloat) {
      $(window).resize(() => {
        $(textarea).css({ "width": wid, "min-width": Math.min(minwid, (window.innerWidth - 100)) + "px", "max-width": (window.innerWidth - 100) + "px" }).attr("wrap", "on").attr("tabIndex", "3");
        kakikomiStretch2(textareaXP, "resetHeight")
      });
    }
    resListen || setFloatKakikomi2()

    resFloat = true;
    let curRes = $(textarea).val();
    $('table.ftbl > tbody > tr > td > input[type="text"][name="email"]').attr("tabIndex", "2")
    $(document.body).attr("tabIndex", "5")
    $(textarea).css({ "overflow-x": "hidden", "z-index": "10", "position": "fixed", "right": "1em", "bottom": "3em", "height": "auto" }).attr("tabIndex", "3");
    $(textarea).css({ "width": wid, "min-width": Math.min(minwid, (window.innerWidth - 100)) + "px", "max-width": (window.innerWidth - 100) + "px" }).attr("wrap", "on").attr("tabIndex", "3").attr("floated", "");
    $(submitbutton).css({ "z-index": "10", "position": "fixed", "right": "1em", "bottom": "0em" }).attr("tabIndex", "4").attr("floated", "");
    //$(`input[type="file"][name="upfile"]`).css({ "z-index": "1000", "position": "fixed", "right": "48em", "left": "auto", "bottom": "3px", "height": "auto", "padding": "0.1em 0.2em", "border": "2px solid #dddddd", "background-color": "#ffffff" })
    $(eleget0('input[type="file"][name="upfile"]') || eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input')).css({ "z-index": "1000", "position": "fixed", "right": "48em", "left": "auto", "bottom": "3px", "height": "auto", "padding": "0.1em 0.2em", "border": "2px solid #dddddd", "background-color": "#ffffff" }) // 添付File→あぷにアップ→futaba-add-uploaderの順に最初に見つかったものを右下に移動させる
    //$(eleget0('input[type="file"][id="upup"]') || eleget0('input[type="file"]#up2input') || eleget0('input[type="file"][name="upfile"]')).css({ "z-index": "1000", "position": "fixed", "right": "48em", "left": "auto", "bottom": "3px", "height": "auto", "padding": "0.1em 0.2em", "border": "2px solid #dddddd", "background-color": "#ffffff" }) // あぷにアップ→futaba-add-uploader→添付Fileの順に最初に見つかったものを右下に移動させる
    //addstyle.add('#ftbl,#ftb2,.ftbl,.ftb2{margin:0px 0px 0px 1em !important; left:1em !important;}')

    if (string > "") $(textarea).val((addMode ? curRes + ((curRes == "" || curRes.slice(-1) == "\n") ? "" : "\n") : "") + string);
    $(textarea).attr("stretchabletextarea", "1")
    if (doFocus == 1) $(textarea).focus()
    if (doFocus == -1) textarea.blur(); // .idw：IDスレかIPスレ警告があればしない
    if ((textarea).value == "" || command === "resetHeight") textarea.rows = MINIMUM_ROWS;
    kakikomiStretch2(textareaXP);
  }

  function kakikomiStretch2(xp, command = "") {
    if ($(elegeta(xp)).is(":hidden")) return
    let target = eleget0(xp);
    var targetvalue = target ? target.value : ""
    if (command === "resetHeight" || targetvalue?.length < 100 || targetvalue?.match(/\n/gm)?.length < 5) target.rows = MINIMUM_ROWS;
    let lineHeight = Number(target.getAttribute("rows"));
    let height = target.scrollHeight; //+12;
    let clientHeight = Math.min(document.documentElement.clientHeight, window.innerHeight) - 165;
    for (let i = 0; i < 90 && (height >= target.offsetHeight) && target.offsetHeight < clientHeight; i++) {
      lineHeight++;
      target.setAttribute("rows", lineHeight);
    }
    displayLineLimit(target);
    return target;
  }


  function displayLineLimit(target) {
    let line = target.value.split(/\r\n|\r|\n/).length;
    if (ld(".2chan.net")) {
      if (line > 15) {
        target.classList.remove("fchformsizeover");
        target.classList.add("fchformlineover");
      } else if (target.value.split("\n").reduce((a, b) => Math.max(getWidth(b), a), 0) >= 801) target.classList.add("fchformsizeover");
      else {
        target.classList.remove("fchformlineover");
        target.classList.remove("fchformsizeover");
      }
    } else {
      if (line_number && message_count) {
        if (line > line_number * 2) {
          target.classList.remove("fchformsizeover");
          target.classList.add("fchformlineover");
        } else if ((new Blob([target.value]).size) > message_count) target.classList.add("fchformsizeover");
        else {
          target.classList.remove("fchformlineover");
          target.classList.remove("fchformsizeover");
        }
      }
    }
  }

  function getWidth(str) {
    var canvas = document.createElement('canvas')
    let width = canvas.getContext('2d').measureText(str).width * 16 / 10;
    canvas.remove()
    return width;
  }

  function sortDescendMiddle(array) {
    return array;
    /*return array.sort((a, b) => {
      return Math.abs(a.getBoundingClientRect().top - document.documentElement.clientHeight / 2) > Math.abs(b.getBoundingClientRect().top - document.documentElement.clientHeight / 2) ? 1 : -1
    });*/
  }

  // 画像と動画をインライン埋め込み
  function imageUmekomi() {
    if (eleget0('.ch5pu')) return;
    var i = 0;
    //    let IIScss = (IIS >= 2 ? "margin:0.3em 0.5em 0 0;" : "margin:0.4em 0.5em 0 0;")
    let IIScss = (IIS >= 2 ? "padding:0 0.5em 0 0.5em;" : "margin:0.4em 0.5em 0 0;")
    //let IIScss = "padding:0 0.5em 0 0;" //margin:0.3em 0.5em 0 0;" : "margin:0.4em 0.5em 0 0;")
    GF.headerbottom = eleget0('.stickymenu')?.getBoundingClientRect()?.bottom || 0;

    sw1("removeSysThumbs");
    for (let a of sortDescendMiddle(elegeta('a[imge="af"]>div[div="thumb5ch"]'))) { if (isinscreen(a)) setTimeout((function(a) { return function() { { a.remove(); } } })(a), WAIT_IMAGE_EMBED_INTERVAL * 3 / NUMBER_IMAGE_EMBED_AT_ONCE) }
    sw2("removeSysThumbs");

    // 画像埋め込み
    sw1("umegazo")
    for (let ele of sortDescendMiddle(elegeta('a:not([imge]),a[href*=".nicovideo.jp"]:not([nde]),a[href*="//nico.ms/sm"]:not([nde]),a[href*="youtube.com"]:not([yte]),a[href*="youtu.be"]:not([yte]),a[href*="ttps://video.twimg.com/ext_tw_video/"]:not([yte]),a[href*="ttps://i.imgur.com/"][href*=".mp4"]:not([yte])'))) {

      if (ele.matches('a:not([imge])')) {
        let isImg = 0;
        var url = ele.href || ($(ele).text());
        url = url.replace(/^t?(tps?:\/\/)/m, "ht$1");
        try {
          var urlImg = decodeURIComponent(url.replace(/https?:\/\/jump\.5ch\.net\/\?|https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=/, "")) //.replace(/https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=/,"");
        } catch (e) {
          var urlImg = url.replace(/https?:\/\/jump\.5ch\.net\/\?|https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=/, "")
        }
        if ($(ele).text().match(/\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp/)) { isImg = 1; } else { isImg = 0; }
        if (!isImg) ele.setAttribute("imge", "!i");
        if ((!isinscreen(ele))) continue; // 画面内に無い
        if (isImg) { //notifyMe(url)//notifyMe(decodeURIComponent(urlImg))
          let next = ele.children ? ele.children[0] : null;
          if (next && next.tagName === "DIV") { // システムのサムネイルあり
            if (ALTERNATIVE_THUMBNAIL) next.outerHTML = '<br><a class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" href=' + url + ' target="_blank"><img referrerpolicy="no-referrer" src=' + urlImg + ' height="' + inlineImageThumbnailHeight + '" ' + '/></a>';
            ele.setAttribute("imge", "rp");
          } else {
            // if ( /^ttp/.test(ele.textContent)){ // システムのサムネ添付はhtmlに変更があると諦めて中断される
            ele.classList.add("inlined"); //style.color="#70a";
            if (IIS >= 1) {
              EXTEST == 0 && $(`<a class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" href="${url}" target="_blank"><img title="${sani(urlImg)}" class="ignoreMe" referrerpolicy="no-referrer" src="${urlImg}" style="${IIScss}" height="${inlineImageThumbnailHeight*(IIS==2?1:0.8)}"></a>`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).show(222);
              EXTEST == 1 && $(`<img  title="${sani(urlImg)}" class="ignoreMe" referrerpolicy="no-referrer" src="${urlImg}" style="${IIScss}" height="${inlineImageThumbnailHeight*(IIS==2?1:0.8)}">`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).on("load", e => requestAnimationFrame(() => $(e.target).show(222)));
            } else {
              $('<br><a class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" href=' + url + ' target="_blank"><img class="ignoreMe" referrerpolicy="no-referrer" src=' + urlImg + ' height="' + inlineImageThumbnailHeight * 0.66 + '" ' + '/></a>').hide().insertAfter(ele).show(222);
            }
            ele.setAttribute("imge", "af");
          }
          //if (++i >= NUMBER_IMAGE_EMBED_AT_ONCE) break; // 一度に設定枚数ずつしかやらない
        }
      }
      sw2("umegazo")

      if (eleget0('.ch5pu')) return;
      sw1("umedouga")
      var i = 0;
      // ニコ動埋め込み（PrivacyBadger等は要Disable）
      if (ele.matches('a[href*="www.nicovideo.jp/watch"]:not([nde]),a[href*="sp.nicovideo.jp/watch"]:not([nde]),a[href*="//nico.ms/sm"]:not([nde])')) {
        //if ((!isinscreen(ele))) continue; // 画面内に無い
        //if (!isinscreen(ele) && Date.now() - (GF?.lateVideo || 0) < 5000) continue; else GF.lateVideo = Date.now() // 画面内にない＆5秒未満
        let url = ele.href;
        ele.setAttribute("nde", "nde");
        var nico = url.match(/h?t?tps?:\/\/(?:www\.|sp\.)?nicovideo.jp\/watch\/(.*)/i);
        //var nico = url.match(/h?t?tps?:\/\/(?:www\.)?nicovideo.jp\/watch\/(.*)/i);
        if (!nico) var nico = url.match(/h?t?tps:\/\/nico\.ms\/(.*)/i);
        if (!nico) continue;
        //$(`<br><iframe sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="max-width: 100%;" width="312" height="176" frameborder="0"></iframe>`).hide().insertAfter(ele).show(222) // 埋め込み外部プレイヤー版

        ele.classList.add("inlined"); //style.color="#70a";
        if (IIS >= 1) {
          //          $(`<iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="${IIScss} display:inline-block; max-width: 100%;" width="312" height="176" frameborder="0"></iframe>`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).show(222) // 埋め込み外部プレイヤー版
          $(`<div class="ignoreMe ytvhandle" style="${IIScss} display:inline-block;"><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="max-width: 100%;" width="321" height="181" frameborder="0"></iframe></div>`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).show(222) // 埋め込み外部プレイヤー版
        } else {
          $(`<br><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${nico[1]}${nico[1].match0(/\?/)?"&":"?"}persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="margin:0.3em 1em 0 0px; display:inline-block; max-width: 100%;" width="312" height="176" frameborder="0"></iframe>`).hide().appendTo(ele).show(222); // 埋め込み外部プレイヤー版
        }
        //if (++i >= (NUMBER_VIDEO_EMBED_AT_ONCE)) break; // 一度に設定枚数ずつしかやらない
        //      break; // 一度に１つずつしかやらない
      }
      sw2("umedouga")

      sw1("umeYT")
      // youtube埋め込み
      if (ele.matches('a[href*="youtube.com"]:not([yte]),a[href*="youtu.be"]:not([yte])')) {
        //if ((!isinscreen(ele))) continue; // 画面内に無い

        let url = ele.href?.replace(/(?:https?\:\/\/)?jump.5ch.net\/\?/, "");
        ele.setAttribute("yte", "yte");
        var sm = url.split(/\s/).map(v => { return [...v?.matchAll(/^(?:h?t?tps?:\/\/)?(?:youtu\.be\/|(?:m\.|www\.|)?youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/))([a-zA-Z0-9_\-]{11})(?![a-zA-Z0-9_\-]{1})|^(?:h?t?tps?:\/\/)?www\.youtube\.com\/(?:watch_videos\?video_ids=|embed\/\?playlist=)([a-zA-Z0-9_\-,]{11,600})/gmi)]?.map(c => c.slice(1, 999)) })?.flat()?.flat()?.filter(w => w)?.map(v => v?.split(","))?.flat() // 書式が混在していても登場順に収納する
        if (!sm.length) continue;
        var pl = url.match0(/[\&\?]list=([a-zA-Z0-9_\-]+)/);
        pl = pl ? `?list=${pl}` : "";
        var stime = url.match0(/[\&\?]t=(\d+)/);
        stime = stime ? `${pl?"&":"?"}start=${stime}` : "";
        var url2 = sm.length == 1 ?
          `https://www.youtube.com/embed/${sm[0]}${pl}${stime}` :
          `https://www.youtube.com/embed/?playlist=${sm.join(",")}`;
        if (IIS >= 1) {
          ele.classList.add("inlined"); //style.color="#70a";
          $(`<div class="ignoreMe ytvhandle" style="${IIScss} display:inline-block;"><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="${YT_REFERRER}" src="${url2}" id="ytplayer" type="text/html" width=321 height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></iframe></div>`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).show(222);
        } else {
          $(`<br><p class="ignoreMe ytvhandle" style="margin:0.3em 1em 0 0px; display:inline-block;"><iframe loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="${YT_REFERRER}" src="${url2}" id="ytplayer" type="text/html" width=321 height=181 frameborder=0 allowfullscreen allow="picture-in-picture; encrypted-media;"></iframe></p>`).hide().appendTo(ele).show(222);
        }
        //if (++i >= (NUMBER_VIDEO_EMBED_AT_ONCE)) break; // 一度に設定枚数ずつしかやらない
      };
      sw2("umeYT")

      // video.twimg埋め込み
      if (ele.matches('a[href*="ttps://video.twimg.com/ext_tw_video/"]:not([yte]),a[href*="ttps://i.imgur.com/"][href*=".mp4"]:not([yte])')) {
        //if ((!isinscreen(ele))) continue; // 画面内に無い
        let url = ele.innerText;
        url = url.replace(/^ttp/i, "http");
        ele.setAttribute("yte", "yte");
        var poster = url.match0('https://i.imgur.com/') ? ` poster="${url.replace(/\.mp4/,".jpg")}" ` : "";
        ele.classList.add("inlined"); //style.color="#70a";
        if (IIS >= 1) { //alert(url)
          $(`<span class="ignoreMe" style="${IIScss} display:inline-block;" ><video loading="lazy" class="ignoreMe" referrerpolicy="no-referrer" ${poster} rel="nofollow external noopener noreferrer" width="312" height="176" allowfullscreen="allowfullscreen"  preload="none" src="${ url }" controls="" loop="" > <source src="${url}" type="video/mp4"> </video></span>`).hide().appendTo(eleget0('.imgbox', ele.closest(`.post,article`))).show(222)
        } else {
          $(`<br><p class="ignoreMe" style="margin:0.3em 1em 0 0px; display:inline-block;" ><video loading="lazy" class="ignoreMe" referrerpolicy="no-referrer" ${poster} rel="nofollow external noopener noreferrer" width="312" height="176" allowfullscreen="allowfullscreen"  preload="none" src="${ url }" controls="" loop="" > <source src="${url}" type="video/mp4"> </video></p>`).hide().appendTo(ele).show(222)
        }
        //if (++i >= NUMBER_VIDEO_EMBED_AT_ONCE) break; // 一度に設定枚数ずつしかやらない
        //      break; // 一度に１つずつしかやらない
      };
      sw2("umeVideoTwimg")
    }
  }

  function videoUmekomi() {};

  // eleはスクロール画面内に入ってる？
  function isinscreen(ele) {
    if (!ele) return;
    if (IIS == 0) {
      var eler = ele.getBoundingClientRect();
      return (eler.top > GF?.headerbottom && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < clientHeight() + (INLINE_IMAGE_THUMBNAIL_PRELOAD_RADIUS * clientHeight())); // 先読みは画面より下側だけ（上に追加するとスクロールがずれるので）
    }
    if (IIS >= 1) {
      var eler = (ele?.closest(".post") || ele).getBoundingClientRect();
      return (eler.bottom - 7 > GF?.headerbottom && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < clientHeight() + (INLINE_IMAGE_THUMBNAIL_PRELOAD_RADIUS * clientHeight())); // 先読みは画面より下側だけ（上に追加するとスクロールがずれるので）
    }

  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      else if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return []; }
    //    } catch (e) { return []; }
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
    //  } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function xa(xpath, node = document) {
    if (!xpath) return [];
    if (xpath.match(/^\//)) {
      try {
        var array = [];
        var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        let l = ele.snapshotLength;
        for (var i = 0; i < l; i++) array[i] = ele.snapshotItem(i);
        return array;
      } catch (e) { return []; }
    } else {
      return $(xpath);
    }
  }

  function sw1(s) {
    if (DEBUG_TIMER) console.time(s);
  }

  function sw2(s) {
    if (DEBUG_TIMER) console.timeEnd(s);
  }

  function pref(name, store = null) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    if (store === null) { // 読み出し
      let data = GM_getValue(name) || GM_getValue(name);
      if (data == undefined) return null; // 値がない
      if (data.substring(0, 1) === "[" && data.substring(data.length - 1) === "]") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          alert("データベースがバグってるのでクリアします\n" + e);
          pref(name, []);
          return;
        }
      } else return data;
    }
    if (store === "" || store === []) { // 書き込み、削除
      GM_deleteValue(name);
      return;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(name, store);
      return store;
    } else { // 書き込み、配列
      try { GM_setValue(name, JSON.stringify(store)); } catch (e) {
        alert("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function popup(text, color = "#6080ff") {
    text = String(text);
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var e = document.getElementById("hzbox");
    if (e) { e.remove(); }
    var e = document.body.appendChild(document.createElement("span"));
    e.innerHTML = '<span id="hzbox" style="all:initial; position: fixed; right:1em; top: 1em; z-index:1000000; opacity:1; font-size:15px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:left; padding:1px 6px 1px 6px; border-radius:12px; background-color:' + color + '; color:white; white-space: nowrap;" onclick=\'var a = document.createElement(\"textarea\"); a.value = \"' + text.replace(/<br>/gm, "\\n") + '\"; document.body.appendChild(a); a.select(); document.execCommand(\"copy\"); a.parentElement.removeChild(a);\'">' + text + '</span>';
    setTimeout((function(e) { return function() { e.remove(); } })(e), 5000);
  }

  function popup2(text, i = 0, color = "#6080ff") {
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var mae = eleget0('//span[@id="yhmbox"]');
    if (maet && mae) {
      mae.remove();
      clearTimeout(maet);
    }
    let bgcol = color
    var ele = $('<span id="yhmbox" class="ignoreMe" style="all:initial; font-family:sans-serif; cursor:pointer; position: fixed; right:0em; bottom: ' + (i * 2 + 2) + 'em; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important; padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:' + bgcol + '; color:white; ">' + text + '</span>').appendTo('body');
    maet = setTimeout(function() {
      var mae = eleget0('//span[@id="yhmbox"]');
      if (mae) { mae.remove(); }
    }, 5000);
    $(ele).attr("title", "クリックでこのガイドを一時的に消す").click(function() {
      $(this).fadeOut(200).queue(function() {
        $(this).remove();
        clearTimeout(maet);
      })
    });
  }

  function notifyMe(body, title = "") {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") new Notification(title, { body: body });
    else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  // >～にポップアップ
  function popuponquote(NEW5CH = 0, ISFILE5CH = 0) {
    // 引用ホバー
    if (/\.shitaraba\.net\/bbs\/read_archive.cgi\//.test(location.href) && eleget0('//HTML/BODY/DL[1]')) { eleget0('//HTML/BODY/DL[1]').id = "thread-body" }
    if (eleget0('//div[@class="post" and not(@id)]')) elegeta('.date').forEach(e => { e.closest('.post').id = e.textContent.trim().match0(/^(\d+)\s：/) || ""; })

    var latestHover;
    //var mesEleA = elegeta(NEW5CH ? 'article.post .post-content' : '.thread .message,#thread-body .message').slice(0, 1000); // したらばで1000以上のスレは重すぎて実質固まるので1000までしか処理しない
    //var mesEleA = elegeta(NEW5CH ? '.post .post-content' : '.thread .message,#thread-body .message').slice(0, 1000); // したらばで1000以上のスレは重すぎて実質固まるので1000までしか処理しない
    var mesEleA = elegeta(NEW5CH ? '.post .post-content' : '.thread .message,#thread-body .message').slice(0, 1000); // したらばで1000以上のスレは重すぎて実質固まるので1000までしか処理しない
    var greenEleA = elegeta(".t5quote").slice(0, 1000)

    if (NEW5CH)
      if (eleget0('//span[@class="postid" and text()="0001"]')) elegeta('.postid').forEach(e => e.textContent = Number(e.textContent))

    // 旧5chに引用ポップアップの仕込み
    elegeta('//div[@class="message"]/span/a[contains(text(),">>")]|//div[@class="message"]/span/span/a[contains(text(),">>")]').slice(0, 3000).forEach(e => { if (e.innerText.match(/\>\>\d+/)) e.classList.add("reply_link") })

    // 右肩のバックリンクを付ける
    //elegeta(NEW5CH ? 'details' : '//div[@class="meta"]').slice(0, 1000).forEach(e => {
    elegeta(NEW5CH ? '.post-header' : '//div[@class="meta"]').slice(0, 1000).forEach(e => {
      let ep = e?.closest(".post");
      if (ep) {
        let eID = ep.id
        let quoted = gatherRes(new RegExp(`>>${eID}[^0-9]`), ep, 2)
        if (quoted.length) {
          $('.back-links>a', ep).remove();
          if (!NEW5CH) {
            quoted.forEach(c => {
              !ISFILE5CH && $(e).append(`<span class="allpopup" id="post${c}">\>\>${c}</span>`)
            })
          } else {
            !ISFILE5CH && after(e, `<span class="allpopupbox">${quoted.map(c => `<span class="allpopup" id="post${c}">\>\>${c}</span>`).join("") }</span>`)
            //quoted.forEach(c => { after(e, `<span class="allpopup" id="post${c}">\>\>${c}</span>`) }) }
          }
          e.dataset.quospan = "1";
          if (NEW5CH) {
            !ISFILE5CH && after(eleget0('.post-header', ep), `<span style="display:none"> [</span><span class="ignoreMe relallArea relallAreaon" data-resno="${ep.id}"></span><span style="display:none">]</span>`) // 見えない「>>」以降はGMヤフオクで項目のキーから外される
          } else {
            !ISFILE5CH && end(e, `<span style="display:none"> [</span><span class="ignoreMe relallArea relallAreaon" data-resno="${ep.id}"></span><span style="display:none">]</span>`) // 見えない「>>」以降はGMヤフオクで項目のキーから外される
          }
        } else {
          if (NEW5CH) {
            //after(eleget0('details', ep), `<span style="display:none"> [</span><span class="ignoreMe relallArea" data-resno="${ep.id}"></span><span style="display:none">]</span>`) // 見えない「>>」以降はGMヤフオクで項目のキーから外される
            !ISFILE5CH && after(eleget0('.post-header', ep), `<span style="display:none"> [</span><span class="ignoreMe relallArea" data-resno="${ep.id}"></span><span style="display:none">]</span>`) // 見えない「>>」以降はGMヤフオクで項目のキーから外される
          } else {
            !ISFILE5CH && end(e, `<span style="display:none"> [</span><span class="ignoreMe relallArea" data-resno="${ep.id}"></span><span style="display:none">]</span>`) // 見えない「>>」以降はGMヤフオクで項目のキーから外される
          }
        }
      }
    })
    greenEleA.forEach(e => eleget0('.relallArea', e?.closest(".post"))?.classList?.add("relallAreaon"))

    setTimeout(() => $('.back-links>a').remove(), 2000) // 回線が遅くてまれに本家ポップアップがダブリで付く現象の防止？

    function gatherRes(eWord = "", ele = null, find = 0) {
      if (find == 2) { // find=2なので高速版。>>nn形式のリストだけ作ってreturn
        let findEle = (typeof eWord === "string") ?
          //          (mesEleA || []).filter(e => e.textContent.indexOf(eWord) !== -1 && Number(e?.closest(".post").id) > Number(ele?.closest(".post").id)) // ">>nn" 元のレスより前のレスは引用しない
          (mesEleA || []).filter(e => e.textContent.indexOf(eWord) !== -1) // ">>nn" 元のレスより前のレスも引用する
          :
          //          (mesEleA || []).filter(e => e.textContent.match(eWord) && Number(e?.closest(".post").id) > Number(ele?.closest(".post").id)) // ">>nn" 元のレスより前のレスは引用しない
          (mesEleA || []).filter(e => e.textContent.match(eWord)) // ">>nn" 元のレスより前のレスも引用する

        if (!ele) return false;
        findEle.forEach(e => {
          eleget0('.relallArea', e?.closest(".post"))?.classList?.add("relallAreaon")
        })
        let mesA = mesEleA
        var list = (findEle.concat(greenEleA.filter(e => {
          var eWord = (e.textContent.match0(/^[>＞]+(.+)$/m) || "").trim();
          if (eWord) {
            var ep = e?.closest(".post")
            if (ep && ep != ele && ele?.textContent?.indexOf(eWord) !== -1 && Number(ep?.id) >= Number(ele?.id)) {
              eleget0('.relallArea', ep)?.classList?.add("relallAreaon")
              return true;
            } else { return null; } // >>ALLの場合元のレスより前のレスは引用しない
          }
        }))).map(c => c?.closest(".post")?.id) || []
        return [...new Set(list)].sort((a, b) => a - b);
      }
      dc("order:" + eWord)
      var gathered = []; // 引用するレス要素（オリジナル）を入れていく配列
      let mesA = mesEleA

      if (ele) { // eleが指定されているなら右肩の逆引用なので(eleレスにある文字列が引用されているレス|>>"eleのレス番"があるもの)も列挙して連結
        gathered = gathered.concat([ele?.closest(".post")]).concat(greenEleA.filter(e => {
          var eWord = (e.textContent.match0(/^[>＞]+(.+)$/m) || "").trim()
          if (eWord) {
            var ep = e?.closest(".post")
            if (ep != ele && ele.textContent.indexOf(eWord) !== -1 && Number(ep.id) >= Number(ele.id)) { return e?.closest(".post"); } else { return null; } // >>ALLの場合元のレスより前のレスは引用しない
            //            if (ep != ele && ele.textContent.indexOf(eWord) !== -1 ) { return e; } else { return null; } // >>ALLの場合元のレスより前のレスでも引用する
          }
        }))
        dc("<<逆引用：" + gathered.map(e => e?.closest(".post")?.id));
      }

      if (String(eWord).match0(/^>>\d+$/)) { // eWordが>>100のように「>>半角数字」だけの時は()>>レス番のレス|同じアンカーがあるレス)を連結
        var ankNo = (String(eWord).match0(/^[>＞]+(.+)$/m) || "").trim()
        dc(`本文>>数字（${String(eWord)}）:${ ankNo}`)
        mesEleA.filter(e => (e?.closest(".post")?.id == ankNo) || (e.textContent.match0(new RegExp(">>" + ankNo + "[^0-9]")))).forEach(e => {
          var b = e?.closest(".post")
          //a.classList.add("rtdAttract"); //集めた元レスを目立たせる
          gathered.push(b);
        })
      } else {
        gathered = gathered.concat((typeof eWord === "string") ?
          (mesEleA.filter(e => eWord ? e.textContent.indexOf(eWord) !== -1 : false) || false) :
          (mesEleA.filter(e => eWord ? e.textContent.match(eWord) : false) || false)
        )
        dc("本文>>文字列：" + gathered.map(e => e?.closest(".post")?.id))
      }

      //  dc(gathered)
      let resNumA = gathered.map(e => e?.closest(".post")).map(e => e && e.id).filter(e => e).sort((a, b) => a - b) // 一旦レス番号に変換して若い順にソート＆重複削除
      resNumA = [...new Set(resNumA)];
      dc(resNumA)

      let gathered2 = []; // 引用するレス要素（クローン）を入れていく配列
      // >>文字列を含む列を列挙して連結
      resNumA.forEach(e => {
        var b = $(eleget0(NEW5CH ? `.post[id="${e}"]` : `//div[@id="${e}"]`)).clone(true, true);
        //a.classList.add("rtdAttract"); //集めた元レスを目立たせる
        gathered2.push(b);
      })

      if (POPUP_STYLE) gathered2.forEach(b => $(b).css({ "display": "inline-block" }))
      else gathered2.forEach(b => $(b).css({ "display": "block", "padding": "1em 3em 0.3em 3em", "border-bottom": "1px solid gray", "margin": "0" }))

      var quoteDesEle0 = gathered2.length ? gathered2[0] : null;
      return [gathered2, quoteDesEle0, gathered2.map(c => Number(c[0].id))];
    }

    document.addEventListener("mousemove", function(e) { // hover::
      var hoverEle = (document.elementFromPoint(mousex, mousey))
      if (!hoverEle) return;
      if (latestHover != hoverEle) {
        let hoverPost = hoverEle?.closest(".post")
        let level = hoverEle.closest(".ch5pu")?.dataset.level + 0 || 0;
        //mesEleA = elegeta(NEW5CH ? '.post-content' : '.thread .message,#thread-body .message').slice(0, 1000) // したらばで1000以上のスレは重すぎて実質固まるので1000までしか処理しない

        if (hoverEle.className === "allpopup") { // >>ALL
          if (!hoverPost) return;
          var [gathered, quoteDesEle0, list] = gatherRes(new RegExp(`>>${hoverEle?.closest(".post")?.id}[^0-9]`), hoverEle?.closest(".post"))
        } else if (hoverEle.matches(".t5quote,.quoteSpeechBalloon")) { // 青緑色の引用文
          //var eWord = (hoverEle.textContent.match0(/^[>＞]+(.+)$/m) || "").trim() || hoverEle.dataset.quoteno
          var eWord = hoverEle.dataset.quoteno || (hoverEle.textContent.match0(/^[>＞]+(.+)$/m) || "").trim()
          if (!eWord) return;
          if (/^\d+$/.test(eWord)) {
            var [gathered, quoteDesEle0, list] = gatherRes(">>" + eWord);
            if (gathered.length < 1) return;
          } else {
            var [gathered, quoteDesEle0, list] = gatherRes(eWord)
            if (gathered.length <= 1) return;
          }
        } else if (hoverEle.className === "reply_link") { // 元からある逆引用の>>100のポップアップ
          var eWord = (hoverEle.textContent.match0(/^(>>\d+)/)).trim(); //alert(eWord)
          if (!eWord) return;
          var [gathered, quoteDesEle0, list] = gatherRes(eWord);
          if (gathered.length < 1) return;
        } else if (hoverEle.parentNode.className === "back-links") { // 元からある逆引用の>>100のポップアップ
          var eWord = (hoverEle.textContent.match0(/(>>\d+)/)).trim(); //alert(eWord)
          if (!eWord) return;
          var [gathered, quoteDesEle0, list] = gatherRes(eWord);
          if (gathered.length < 1) return;
          //} else if (hoverEle.matches(".relallAreaon")) {
          //  let p3 = getRelatedRsca(hoverEle.dataset.resno)
        } else if (hoverEle.matches(".relallAreaon,.postid")) {
          let p3 = getRelatedRsca(hoverEle.dataset.resno || +hoverEle?.textContent)
          let p1 = p3.map(v => $(elegeta('.post').find(e => e.id == v)).clone(true, true))
          let p2 = p1[0]
          if (POPUP_STYLE) p1.forEach(b => $(b).css({ "display": "inline-block" }))
          else p1.forEach(b => $(b).css({ "display": "block", "padding": "1em 3em 0.3em 3em", "border-bottom": "1px solid #aaa", "margin": "0" }))
          //if ($(p1).is(":hidden")) $(p1.closest(".post")).show(0).css({ "display": "table" }) // 学園祭で消していたら出す
          var [gathered, quoteDesEle0, list] = [p1, p2?.[0], p3]
        }

        if ((quoteDesEle0 && gathered.length && !eleget0(`.ch5pu[data-list="${list.join(",")}"]`)) // 新しく黄土色文字か>>ALLの上に入った
          &&
          (!eleget0(`.ch5pu[data-list="${list.slice(1).join(",")}"]`))) { // 新しく黄土色文字か>>ALLの上に入った
          let xr = mousex > window.innerWidth * 2 / 3
          let x = ``
          var pos = `position:absolute;`

          var hitpostsEle = `<span class="ch5pu ignoreFilter ignoreMe" id="ch5pu" data-level="${level+1}" data-list="${list.join(",")}" style="${pos}" ondblclick="this.remove();"></span>`;
          let origLen = gathered.length
          //if (!hoverEle.matches(".relallAreaon") && gathered[0][0].id == hoverPost.id) { gathered.shift(); } // 先頭レスが引用元レスと同じ時だけは削除
          if (!hoverEle.matches(".relallAreaon,.postid") && gathered[0][0].id == hoverPost.id) { gathered.shift(); } // 先頭レスが引用元レスと同じ時だけは削除
          addstyle.add(` .ch5pu .post-content{ max-width:${eleget0('.post-content:visible')?.offsetWidth||clientWidth()/2||1000}px;}`, "ch5puPostMaxW")
          let ch5pu = end(document.body, hitpostsEle)

          if (gathered.length) {
            let frag = new DocumentFragment();
            gathered.forEach(e => {
              frag.append(e[0])
              if (POPUP_STYLE) $(frag).append("<br>")
            })
            $(ch5pu).append(frag)

            if (gathered?.length > 1 && eleget0(`.post[id="${hoverPost?.id}"]`, ch5pu)) {
              elegeta(`.post[id="${hoverPost?.id}"]`).forEach(e => e.classList.add("relpost"))
              clearTimeout(GF?.relpostID);
              GF.relpostID = setTimeout(() => elegeta('.relpost').forEach(e => e.classList.remove("relpost")), 2000)
              addstyle.add(`.relpost{ box-shadow:-2px 0px 0px 0px #68f !important;}`)
            }

            if (NEW5CH) $(elegeta('.ch5pu .relallArea', ch5pu)).remove()

            let puY = (window.scrollY + hoverEle.getBoundingClientRect()?.top + (hoverEle.getBoundingClientRect()?.height)) - (ch5pu.getBoundingClientRect()?.height / 2) + 2

            let fitR = gbcr(hoverEle).right + gbcr(ch5pu).width <= clientWidth() - 10 // 右に入り切る
            let fitD = gbcr(ch5pu).height <= (clientHeight() - gbcr(hoverEle).bottom) - 10 // 下に入り切る
            let fitU = gbcr(ch5pu).height <= (gbcr(hoverEle).top) - 10 // 上に入り切る
            let fitH = gbcr(ch5pu).height <= (clientHeight()) - 10 // 縦に入り切る
            let puWidth = gbcr(ch5pu).width

            //console.log(mousex-16,clientWidth(),gbcr(hoverEle).width)
            if (fitD) { // ホバーの下縁
              ch5pu.style.top = `${(window.scrollY + hoverEle.getBoundingClientRect()?.bottom-1)}px`
              ch5pu.style.left = `${window.scrollX + Math.min(mousex-16,clientWidth()-puWidth-20)}px`
              dc(`popup-type:${1}`)
              /*} else if (!fitD && fitR && fitH) { // ホバーの右
                ch5pu.style.left = `${hoverEle.getBoundingClientRect().right-1}px`
                let puY = (window.scrollY + hoverEle.getBoundingClientRect()?.top)
                puY = Math.min(window.scrollY + window.innerHeight - gbcr(ch5pu).height - 10, puY)
                puY = Math.max(window.scrollY + 5, puY)
                ch5pu.style.top = `${puY}px`
                dc(`popup-type:${2}`)*/
            } else if (!fitD && fitU) { // ホバーの上
              ch5pu.style.top = `${(window.scrollY + gbcr(hoverEle).top - gbcr(ch5pu).height )}px`
              ch5pu.style.left = `${window.scrollX + Math.min(mousex-16,clientWidth()-puWidth-20)}px`
              //              ch5pu.style.right = `0px`
              dc(`popup-type:${3}`)
              /*} else if (!fitD && !fitU && fitR && !fitH) { // ホバーの右（上から）
                ch5pu.style.left = `${hoverEle.getBoundingClientRect().right-1}px`
                let puY = (window.scrollY + hoverEle.getBoundingClientRect()?.top)
                ch5pu.style.top = `${window.scrollY +15}px`
                dc(`popup-type:${2}`)*/
            } else { // ホバーの下縁
              ch5pu.style.top = `${(window.scrollY + hoverEle.getBoundingClientRect()?.bottom)}px`
              ch5pu.style.left = `${window.scrollX + Math.min(mousex-16,clientWidth()-puWidth-20)}px`
              //ch5pu.style.right = `0px`
              dc(`popup-type:${4}`)
            }


            let eley = $(hoverEle).offset().top - $(window).scrollTop() + $(hoverEle).outerHeight() + 3;
            let marginheight = Math.min(window.innerHeight, document.documentElement.clientHeight) - eley
            let eleheight = $(hitpostsEle).height()
            if (marginheight / eleheight < 1) $(hitpostsEle).css({ "transform-origin": xr ? "top right" : "top left" }).delay(100).animate2({ "transform": `scale(${Math.max(CH5_QUOTE_POPUP_SCALING_LOWER_LIMIT,marginheight/eleheight)})`, "opacity": "1" }, 100)
            //$(".ch5pu").draggable({ cancel: "img,video,section,blockquote,a,span:not(.ch5pu),.yhmMyMemo,.allpopup",scroll:false });
            //$(".ch5pu").draggable({ cancel: ".post,.yhmMyMemo,.allpopup,.relallArea", scroll: false });
            dragElement(ch5pu, "*", ".post,.yhmMyMemo,.allpopup,.relallArea")
          }
        } else {
          if (latestHover != hoverEle && !hoverEle.closest(".ftbpu,.ch5pu,.post_hover") && !quoteDesEle0) { //&& !eWord) { // すべてのpuから降りた
            elegeta('.relpost').forEach(e => e.classList.remove("relpost"))
            $(".ch5pu").remove();
            //$(".rtdAttract").removeClass("rtdAttract")
          }
          if (latestHover != hoverEle && !hoverEle.closest(".allpopup,.reply_link") && hoverEle.closest(".ftbpu,.ch5pu,.post_hover")) { // levelが低い要素に降りたら上のは消す
            elegeta(".ch5pu").forEach(e => { if (e.dataset?.level > level) { e.remove() } })
          }
        }
      }
      latestHover = hoverEle
    }, true);
  }

  // レス番rscに引用・非引用が連鎖するレスのレス番rscを全て配列で返す rsc => [rsc,rsc,rsc,...]
  function getRelatedRsca(rsc) {
    let tableRsc = elegeta('.post').sort((a, b) => a.id === b.id ? 0 : Number(a.id) > Number(b.id) ? 1 : -1) // レステーブル[登場順]
    let tableRscOrder = [] // レステーブル[rsc]
    tableRsc.forEach(v => tableRscOrder[v.id] = v) // 速度のためにキャッシュする
    let ress = getRelCno([+rsc], tableRsc, tableRscOrder)
    while (1) {
      let r = getRelCno(ress, tableRsc, tableRscOrder)
      if (r.length <= ress.length || r.length > 100) { ress = r; break }
      ress = r
    }
    if (ress?.length < 2) return [] //null
    return ress.sort(new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)
  }

  function getRelCno(resa, tableRsc, tableRscOrder) {
    let a = resa || []
    resa.forEach(res => {
      a = a.concat(elegeta(`.allpopup`, tableRscOrder[res]).map(v => +v.innerText.replace(/^>>/, ""))) // 右肩の>>100のバックリンク

      let rscText = elegeta(`.reply_link`, tableRscOrder[res]).map(e => +e?.innerText?.replace(/^>+/, "")?.trim()) // 本文中の>>100の引用
      rscText.forEach(v => {
        let hitno = tableRsc.find(w => w.id == v)
        if (hitno) a.push(+v)
      })
      //      let rscText2 = elegeta(`.t5quote`, tableRscOrder[res]).map(e => +e?.innerText?.replace(/^>+/, "")?.trim()) // 本文中の>○○の引用
      let rscText2 = elegeta(`.t5quote`, tableRscOrder[res]).map(e => e?.innerText?.replace(/^>+|^＞+/, "")?.trim()) // 本文中の>○○の引用
      rscText2.forEach(v => {
        if (v.length > 3) { // ４文字以上でなければ無視

          let hitno2 = tableRsc.filter(w => eleget0('.message,.post-content', w).innerText.indexOf(v) !== -1).map(e => +e?.id)
          if (hitno2.length) a = a.concat(hitno2)
        }
      })
    })
    let ret = [...new Set(a?.flat())].filter(v => v !== undefined && v !== null).sort()
    return ret
  }

  function dc(str, force = 0) {
    if (debug || force) popup3(str, 0, 1, 5000, "top");
    return str;
  }

  function popup3(text, i = 0, lf = 1, timer = 15000, alignY = "bottom") {
    if (text == undefined) text = "null"
    if (typeof text == "string") text = text.slice(0, 200);
    if (typeof text != "number") text = String(text);
    text = String(text)
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let id = Math.random().toString(36).substring(2);
    var ele = $('<span id="yhmbox' + id + '" class="ignoreMe yhmpu3" style="all:initial;font-family:sans-serif; position: fixed; right:0em; ' + alignY + ':' + ((maey) + i * 18) + 'px; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important; max-width:33%; padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:#6080ff; color:white; ">' + text + '</span>').appendTo('body');

    let ey = ele[0].getBoundingClientRect().height;
    if (ele[0].getBoundingClientRect().bottom >= (window.innerHeight)) {
      elegeta('.yhmpu3').forEach(e => { e.style.top = parseFloat(e?.style?.top) - (ey) - 2 + "px" })
    } else {
      maey = (maey + (ele[0]?.getBoundingClientRect()?.height + 2))
    }

    if (typeof text == "string") { maey += (text.match(/<br>/gmi) || []).length || 0; } //console.log((text.match(/<br>/gmi) || [] ).length) }
    setTimeout(() => {
      eleget0('//span[@id="yhmbox' + id + '"]').remove();
      if (!eleget0('.yhmpu3')) maey = 0;
    }, timer);
  }

  function before(e, html) { e.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function gbcr(e) { return e?.getBoundingClientRect() }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  function ct(callback, name = "test", time = 1) { console.time(name); for (let i = time; i--;) { callback() } console.timeEnd(name) } // 速度測定
  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function autoPagerized(callback, command) {
    if (command !== "not1st") callback(document.body)
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { callback(evt.target); }, false);
  }

  function dragElement(ele, handleSel = "*", cancelSel = "") {
    let x, y;
    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e => e.onmousedown = dragMouseDown)

    function dragMouseDown(e) {
      if (e.target.closest(cancelSel) || e.button != 0) return;
      e = e || window.event;
      e.preventDefault();
      ele.style.minWidth = `${!NEW5CH?$(ele).width():$(ele).outerWidth()}px`;
      /*      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
              ele.style.left = `${ele.offsetLeft}px`
              ele.style.right = ""
            }
            if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
              ele.style.top = `${ele.offsetTop}px`
              ele.style.bottom = ""
            }
      */
      [x, y] = [e.clientX, e.clientY];
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

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function minmax(v, min, max) {
    return Math.min(Math.max(v, min), max)
  }

  function JS(v) { try { return JSON.stringify(v) } catch { return null } }

  function JP(v) { try { return JSON.parse(v) } catch { return null } }

})();