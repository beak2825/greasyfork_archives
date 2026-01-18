// ==UserScript==
// @name 画像のホバーで拡大
// @description 　Shift+H:オンオフ切替　ホバー中の画像を（y:GoogleLensで画像検索／d:名前を付けて保存(+Shift:suffixを指定)）　a:twitterで画像をトリミングさせない
// @version      0.1.44
// @run-at document-end
// @inject-into content
// @match *://*/*
// @match file:///*.html
// @noframes
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_download
// @grant       GM.setClipboard
// @grant       GM.openInTab
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/434191/%E7%94%BB%E5%83%8F%E3%81%AE%E3%83%9B%E3%83%90%E3%83%BC%E3%81%A7%E6%8B%A1%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/434191/%E7%94%BB%E5%83%8F%E3%81%AE%E3%83%9B%E3%83%90%E3%83%BC%E3%81%A7%E6%8B%A1%E5%A4%A7.meta.js
// ==/UserScript==

(function() {

  const keyFunc2 = [];
  const USE_D_TO_SAVE = 0; // 1:dキーでホバー中の画像を「名前を付けて保存」する（推奨）　0:無効
  const USE_SAVE_AS = 0; // 1:「名前を付けて保存」画面を使う　0:ファイル名は自動的に決定（推奨）
  const hoverTimeDefault = 2; // デフォルトの動作モード　-1:オフ　1:オン（瞬間）　2～:画像に乗せてn/60秒静止したら
  const defaultDelay = 3; // Shift+H押下時に切り替わる動作モードの３つ目（3/60秒）のタイミングを指定
  const KEY_SELECT_DELAY = "Shift+H"; // 動作モード切り替えキー
  const CONFIRM_FOR_Y = 1; // 1:yキーでyandex/iqdb検索をする時URLの確認を求める
  const D_FILENAME_MAXLENGTH = 94; // 1-94:dキーで自動生成されるファイル名の最大長
  const ASPECT_RATIO_CAUSES_SCROLL = 0.35; // 縦横比がこれ以下ならスクロールする
  const REVERSE_SHIFTKEY = 0; // 1:Shiftキーの機能を逆転し押さないと押した時の動作（ズーム画像がくっつく、ズーム画像の上に乗れる）をする　0:デフォルト
  const FUTABA_REPLACE_THUMBNAIL_AFTER_HOVER = 1; // 1:ふたばでgif画像ホバー時にサムネイルを実体に置き換える 2:gif以外の画像も置き換える　3:動画も実体と置き換える　0:無効　※Shiftを押しながらホバーすると以降同タブ内ではいつでも3相当
  const USER_SUFFIX_DEFAULT = "◎"; // Shift+Dで付ける節尾句のデフォルト
  const VIDEO_FADEIN_MS = 500;
  const REDIRECT_RE = /^https?:\/\/jump\.5ch\.net\/\?|^https?:\/\/jbbs\.shitaraba\.net\/bbs\/link\.cgi\?url=|^https?:\/\/talk\.jp\/c\?|^https?:\/\/.*\.2chan\.net\/bin\/jump\.php\?/;
  const IMGURL = /^https?:\/\/(www\.|i\.)?imgur\.com\/\S*(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.webp|\.webm|\.mp4)$|^https?:\/\/pbs\.twimg\.com\/media\/\S*(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.webp|\.webm|\.mp4)$/i;
  const SMOOTH = Math.random() > 0.5 ? 1 : 0; // Shift+ホバーの拡大縮小回転の挙動
  const FRONT = 0;
  const MARGINH = 100; // 元絵と拡大画像の横の余白px
  const ZMARGIN = 1;
  const POPUP_Z_INDEX = 2147483647 - ZMARGIN; // ポップアップ画像がどくらい手前に来るか
  const FORCE_USE_HALF_WIDTH = 0; // 1:ホバーズームで必ず画面の横半分のサイズ
  const enablePanel = 1; // 1:パネル表示を有効
  const REPLACE_ORIGINAL = () => ld(/suruga-ya\.jp|yodobashi\.com|amazon\.co\.jp|iherb\.com|belc-netshop|mercari|auctions\.yahoo\.co\.jp|jp\.daisonet\.com|jmty\.jp|kakaku\.com|xcancel/);
  const debug = 0;

  const marginPe = 8;
  let verbose = 0; // 1:debug
  const is2chan = ld("2chan.net|ftbucket.info|kuzure.but.jp") ? true : false;
  const is2chanOrig = ld("2chan.net") ? true : false;
  const isFtbucket = ld("ftbucket")
  const HANDLE_LIST = ld("youtube.com") ? ["IMG"] : ["IMG", "VIDEO"];
  let replaceMode = FUTABA_REPLACE_THUMBNAIL_AFTER_HOVER;

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  const ael = (ele, evts, cb, opt) => evts.split(" ").forEach(evt => ele?.addEventListener(evt, cb, opt));
  var GF = {}
  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = Array.from(Array(12)).map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      end(document.head, `<style id="${uid}">${str}</style>`);
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


  var domain = new URL(location.href).hostname;
  var hovertime = pref(domain + " : delay") || hoverTimeDefault;
  var minWidth
  var minHeight
  const getwinmin = () => {
    minWidth = location.href.match(/twitter|\/\/x\.com/) ? 1000 : (window.innerWidth / 2)
    minHeight = location.href.match(/twitter|\/\/x\.com/) ? 1000 : (window.innerHeight / 2)
  }
  getwinmin()
  window.addEventListener("focus", getwinmin)
  window.addEventListener("resize", getwinmin)

  var mousex = 0,
    mousey = 0,
    mouseShift = 0;
  var lastEle = "";

  var hovertimer = 0;
  var poppedUrl = "";
  var yandexUrl = "";
  var userSuffix = ""

  if (lh('https://buzzweet.com/manga-tweet/')) addstyle.add('.twitter_pic1 img, .twitter_pic2 img, .twitter_pic3 img, .twitter_pic4 img { object-fit: contain;}')
  // bingのnoreferrer
  if (lh('https://www.bing.com/images/search')) setInterval(() => elegeta('a')?.forEach(e => {
    e.referrerpolicy = "no-referrer";
    e.rel = "nofollow external noopener noreferrer";
  }), 333)

  if (lh(/https:\/\/www\.google\.[^\/]*\/search\?q=/)) hoverHelp(e => e?.closest('a[href$="pdf"]') ? "ｄ：pdfファイルを保存" : "", e => `left:${e.target?.closest('a[href$="pdf"]').getBoundingClientRect().left + e.target?.closest('a[href$="pdf"]').offsetWidth}px; top:${e.target.getBoundingClientRect().top}px;`)

  function hoverHelp(cb, xy = null) {
    let latest, helpEle;
    document.addEventListener("mousemove", e => {
      if (!e?.target instanceof Element) return;
      if (latest != e?.target) {
        helpEle?.remove()
        const text = cb(e.target)
        if (text) helpEle = end(document.body, `<div id="hoverHelpPopup" style="z-index:999999999; position:fixed; ${xy?xy(e):"right:1em; bottom:1em;"} background-color:#ffffffe0; padding:1px 0.5em; border:1px solid #505050; font-size:15px; color:#505050; border-radius:0.75em;">${text}</div>`)
        latest = e.target
        if (document.elementFromPoint(e.clientX, e.clientY) == helpEle) {
          helpEle.style.bottom = "";
          helpEle.style.top = "1em";
        }
      }
    })
  }

  var keyFunc = USE_D_TO_SAVE ? keyFunc2.concat([{
    id: "d", // d::ホバー中の画像を名前を付けて保存
    key: /^d$|^Shift\+D$/,
    func: (evt, key, ele = null) => {
      var url = poppedUrl
      var ele = ele || getimg(1);
      let tagname = ele?.tagname
      var pdf = !lh(/https:\/\/www\.google\.[^\/]*\/search\?q=/) ? null : ele.closest('a[href$="pdf"]') || eleget0('span.pdffile', ele?.closest('div')) ? ele?.closest('a') : null
      var pdffn
      if (pdf) {
        url = pdf.href;
        pdffn = pdf.innerText;
        GM.setClipboard(`${ele?.textContent||""}\n${url}\n`)
      }
      //if (hovertime < 1) return
      if (!url && ele) {
        //        if (!(ele?.tagName === "IMG" || (ele?.tagName === "VIDEO" && ld('2chan.net')))) return;
        url = pe(ele, 0)
        let parentA = (!url && ele?.closest(`a[href$=".mp3"] , a[href$=".jpg"] , a[href$=".png"] , a[href$=".webp"] , a[href$=".gif"]`))
        if (parentA) {
          url = parentA?.href;
          tagname = parentA?.tagName;
        }
        if (!url) return;
      }
      //if (url.match(/^blob\:/)) return;

      if (url) {

        var caption = (ele?.alt ? ele?.alt + " " : "") + getParentHasText(ele);

        function getParentHasText(ele) {
          while (ele && ele != document.body) {
            if (ele?.innerText?.replace(/\d/gm, "")?.replace(/　|\s\s|\n/gm, " ")?.trim()?.length > 0) return ele?.innerText?.replace(/　|\s\s|\n/gm, " ")?.trim()
            ele = ele?.parentNode
          }
          return ""
        }

        userSuffix = "";
        if (key === "Shift+D") {
          let sufin = prompt("ファイル名の最後に付ける文字列を設定できます", window?.getSelection()?.toString()?.trim()?.substr(0, D_FILENAME_MAXLENGTH / 2) || GF?.userSuffixMemory || USER_SUFFIX_DEFAULT || "")
          if (sufin === null) return;
          GF.userSuffixMemory = sufin || "";
          userSuffix = sufin || "";
        }
        var fn_maxlen = D_FILENAME_MAXLENGTH - userSuffix?.length

        var hrefName = url.match(/[^\/]+\.[^\/]+$/)?.[0]?.replace(/\?.+$/, "")?.slice(-15) || ""
        var ext = ((/https:\/\/pbs\.twimg\.com\//.test(url) && /format=[a-zA-Z0-9]+/.test(url))) ? `.${url.match(/format=([a-zA-Z0-9]+)/)?.[1]}` : "";
        var forceext = ((/https:\/\/pbs\.twimg\.com\//.test(url) && /format=[a-zA-Z0-9]+/.test(url))) ? `.${url.match(/format=([a-zA-Z0-9]+)/)?.[1]}` : url?.replace(/^.*(\.[a-zA-Z0-9]{1,4})$/, "$1") || "";
        if (hrefName == "" && ext == "") ext = pdf ? ".pdf" : ".png"
        if (ext == "" && tagname == "VIDEO") ext = ".mp4"
        let fnlen = fn_maxlen - hrefName.length
        var fn = (pdffn?.substr(0, fnlen - 1) || `${signzen(document.title.slice(0,fnlen/2)+" "+caption+" "+location.href).substr(0, fnlen-1)} `) + `${hrefName}`?.trim() + `${ext}`

        if (ld(/5ch\.net$/)) {
          var res = eleget0("section,.message", ele?.closest("table,article"))?.innerText?.trim();
          res = res?.replace(/^\>.*$|^h?ttps?\:\/\/.*$/gm, "")?.trim() || res;
          res = res?.replace(/\s+|\n+/gm, " ")?.trim();
          if (res) fn = `${signzen(document.title+" "+location.href).substr(0, fn_maxlen/2-hrefName.length-1)} ${signzen(res).substr(0, fn_maxlen/2-1)} ${hrefName}`.trim() + `${ext}`
        }
        if (ld(/2chan\.net$|ftbucket\.info$/)) {
          //var res = eleget0("blockquote", ele?.closest("table"))?.innerText?.replace(/\s+|\n+/gm," ")?.trim()
          //res = res?.replace(/^\s*\>.*\s*$/gm, "")?.trim() || res; // ?.replace(/ｷﾀ━+\(ﾟ\∀ﾟ\)━+\!+/gm,"")
          var res = eleget0("blockquote", ele?.closest("table"))?.innerText?.trim();
          res = res?.replace(/^\>.*$/gm, "")?.trim() || res;
          res = res?.replace(/\s+|\n+/gm, " ")?.trim();
          if (res) fn = `${signzen(document.title+" "+location.href).substr(0, fn_maxlen/2-hrefName.length-1)} ${signzen(res).substr(0, fn_maxlen/2-1)} ${hrefName}`.trim() + `${ext}`
        }
        if (ld(/twitter\.com$|^x\.com/)) {
          hrefName = url.match(/\/media\/([^\/\?\&]+)/)?.[1] || "" // 絵IDだけど名前順≠出現順だろうか？
          var res = eleget0('[data-testid="tweetText"]', ele?.closest('[data-testid="cellInnerDiv"]'))?.innerText?.replace(/\s+|\n+/gm, " ")?.trim()
          if (res) fn = `${signzen(document.title).substr(0, fn_maxlen/2-hrefName.length-1)} ${signzen(res).substr(0, fn_maxlen/2-1)} ${hrefName}`.trim() + `${ext}`
        }
        if (lh("//nitter.cz")) {
          hrefName = url.match(/\/enc\/([a-zA-Z0-9=]+)/)?.[1] || "" // 絵IDだけど名前順≠出現順だろうか？
          var res = ele?.closest('div.quote.quote-big,div.timeline-item')?.innerText?.replace(/\s+|\n+/gm, " ")?.trim() || document.title || "";
          if (res) fn = `${signzen(res).substr(0, fn_maxlen-1-hrefName.length)} ${hrefName}`.trim() + `${ext}`
        }
        if (lh("//twiman.net/")) {
          let box = ele?.closest('div.border-gray-200.mb-3')
          if (box) {
            hrefName = url?.match(/[a-zA-Z0-9\-_]+/g)?.sort((a, b) => a?.length < b?.length ? 1 : -1)?.[0] || "";
            let id = signzen(eleget0('span.text-gray-500.font-normal.block', box)?.textContent || "")
            let name = signzen(eleget0('a.text-black.font-bold.block', box)?.textContent || "")
            let text = signzen(eleget0('p.text-black.block.text-base.leading-snug', box)?.textContent || "")
            let tid = signzen(eleget0('a[href*="/status/"]', box)?.href?.match0(/\/status\/(\d+)/) || "");
            let mediaIndex = elegeta('img.object-contain.justify-self-auto.mx-auto', box).findIndex(v => v == ele) || 0;
            var res = (box?.innerText?.replace(/\s+|\n+/gm, " ")?.trim() || document.title || "")
            if (box && id && name && tid) {
              fn = `${id} ${name} ${tid?.padStart(19,"0")}-${(""+mediaIndex)?.padStart(3,"0")} `;
              fn = `${fn}${signzen(text)?.substr(0, D_FILENAME_MAXLENGTH - userSuffix?.length - fn.length)} `.trim() + `${ext||".png"}`;
            }
          }
        }
        if (lh("//twicomi.com/")) {
          fn = `${et(`div.screen-name`)} ${et(`div.name > a`)} ${signzen(ele.closest('.tweet')?.querySelector(`.index`)?.textContent||"")} ${et(`a.create_time`)} ${et(`div.text:visible`)}`.trim()?.substr(0, D_FILENAME_MAXLENGTH - userSuffix?.length) + `${ext||".png"}`;
        }
        if (lh("//nitter.net|//xcancel.com")) {
          let box = ele?.closest('.timeline-item ')
          hrefName = url?.match(/[a-zA-Z0-9\-_]+/g)?.sort((a, b) => a?.length < b?.length ? 1 : -1)?.[0] || "" // urlの中から[a-zA-z0-9]+にマッチする一番長い部分をIDと見て拾う
          let id = signzen(eleget0('a.username', box)?.textContent || "")
          let name = signzen(eleget0('div > div.fullname-and-username > a.fullname', box)?.textContent || "")
          let text = signzen(eleget0('.quote-text , .tweet-content , .media-body', box)?.textContent || "")
          let tid = signzen(eleget0('a[href*="/status/"]', box)?.href?.match0(/\/status\/(\d+)/) || "");
          //          let date = signzen(gettime("[YYYYMMDD]", new Date(Date.parse(eleget0('span.tweet-date > a', box)?.textContent || ""))));
          let date = signzen(gettime("[YYYYMMDD-hhmm]", new Date(Date.parse(eleget0('span.tweet-date > a', box)?.title?.replace("· ", "") || ""))));
          let mediaIndex = elegeta('img:not(.avatar)', box).findIndex(v => v == ele) || 0;
          ext = url.match0(/\.[a-z0-9]+$/) || "";
          if (ext == "" && tagname == "VIDEO") ext = ".mp4"
          var res = (ele?.closest('div.quote.quote-big,div.timeline-item')?.innerText?.replace(/\s+|\n+/gm, " ")?.trim() || document.title || "").replace(id, "");
          if (res && id && name && date) {
            fn = `${id} ${tid?.padStart(19,"0")}-${mediaIndex} `;
            fn = `${fn}${signzen(name+" "+date+" "+text).substr(0, D_FILENAME_MAXLENGTH - userSuffix?.length - fn.length)} `.trim() + `${ext||".png"}`;
          }

          function gettime(_fmt = 'YYYY/MM/DD hh:mm:ss.iii', _dt = new Date()) {
            return [
              ['YYYY', _dt.getFullYear()],
              ['MM', _dt.getMonth() + 1],
              ['DD', _dt.getDate()],
              ['hh', _dt.getHours()],
              ['mm', _dt.getMinutes()],
              ['ss', _dt.getSeconds()],
              ['iii', _dt.getMilliseconds()],
            ].reduce((s, a) => s.replace(a[0], `${a[1]||0}`.padStart(a[0].length, '0')), _fmt)
          }
        }
        if (lh("youtube.com/")) {
          //          let title= `${et('yt-dynamic-text-view-model.dynamic-text-view-model-wiz > h1[class*="dynamic-text-view-model-wiz__h1"] > span.yt-core-attributed-string[class*="yt-core-attributed-string--white-space-pre-wrap"][role="text"]')?.slice(0,15)||""}  ${et('yt-content-metadata-view-model.page-header-view-model-wiz__page-header-content-metadata.yt-content-metadata-view-model-wiz.yt-content-metadata-view-model-wiz--inline.yt-content-metadata-view-model-wiz--medium-text > div > span[class*="yt-core-attributed-string"] > span.yt-core-attributed-string--link-inherit-color')?.slice(0,15)||""} ${et(`yt-formatted-string#video-title`,ele.closest(`ytd-rich-item-renderer`)||"")} ${eleget0('a',ele.closest(`ytd-rich-item-renderer`))?.href?.replace(/.*v=([a-zA-Z0-9-_]{11}).*/,"$1")||""} `.trim()
          let title = `${et(`yt-formatted-string#video-title`,ele.closest(`ytd-rich-item-renderer`)).slice(0,33)} ${eleget0('a',ele.closest(`ytd-rich-item-renderer`))?.href?.replace(/.*v=([a-zA-Z0-9-_]{11}).*/,"$1")||""} `.trim()
          fn = title ? title?.substr(0, D_FILENAME_MAXLENGTH - userSuffix?.length) + `${forceext||".png"}`.trim() : fn;
        }

        function et(v, n = document.body) {
          return `${signzen(eleget0(v,n)?.textContent || "")?.replace(/\s+/gm," ")}` || "";
        }


        function signzen(str) { return str.replace(/^\s+/, "").replace(/\\|\/|\:|\;|\,|\+|\&|\=|\*|\?|\"|\'|\>|\<|\./g, c => { return String.fromCharCode(c.charCodeAt(0) + 0xFEE0) }) }

        if (fn?.indexOf(".") == -1) fn += tagname == "VIDEO" ? ".mp4" : ".webp"; // ファイル名に拡張子がなかったらとりあえず付ける
        if (url.match(/\.twimg\./)) fn = fn.replace(/\.(jpe?g|gif|webp|avif|bmp|png)\:(?:medium|large|small|thumb|orig)$/, ".$1")
        if (userSuffix) fn = fn.replace(/^(.*)(\..*)$/, `$1${userSuffix}$2`);
        fn = (evt?.ghzFNPreFix || "") + fn

        var arg = { url: url, name: fn, saveAs: USE_SAVE_AS ? true : false, onerror: e => console.log(e), onload: null, onprogress: null, ontimeout: e => console.log(e), };
        //var arg = { url: url, name: fn, saveAs: USE_SAVE_AS?true:false, onerror: e=>alert(JSON.stringify(e)), onload: e=>alert(JSON.stringify(e)), onprogress: null, ontimeout: null, };
        if (ld(".pixiv.")) arg.headers = { referer: location.protocol + '//' + location.host, origin: location.protocol + '//' + location.host, }
        if (ld('old.reddit.com')) arg.headers = { referer: url } // , origin: url
        ele?.animate([{ outline: `9px solid #ff0`, boxShadow: `0 0 1em 1em #0003` }, { outline: `3px dotted #0ff`, boxShadow: `0 0 0px 0px #0000` }], 555)
        eleget0('img.ignoreMe.hzP')?.animate([{ outline: `9px solid #ff0`, boxShadow: `0 0 1em 1em #0003` }, { outline: `3px dotted #0ff`, boxShadow: `0 0 0px 0px #0000` }], 555)
        GM_download(arg);
        return true;
      }
    }
  }]) : [];


  if (lh("//twitter.com/|//nitter.net/|//nitter.cz|//xcancel.com/|//x.com|https://search.yahoo.co.jp/realtime/search")) {
    var zflag = pref("zflag") || 0;
    popup(`a:画像をフィット：${zflag}`, zflag == 0 ? "#888" : undefined)
    setTimeout(() => setsize(zflag), lh("https://search.yahoo.co.jp/realtime/search") ? 3 : 1999)
  }

  function setsize(z) {
    addstyle.remove(GF?.twi);
    if (z == 1 && lh("//twitter.com/|//nitter.net/|//nitter.cz|//xcancel.com/|//x.com")) GF.twi = addstyle.add(`div{ background-size:${['cover','contain'][z]} !important;}`)
    if (z == 1 && lh("https://search.yahoo.co.jp/realtime/search")) GF.twi = addstyle.add(`.Tweet_TweetContainer__gC_9g .Tweet_imageContainerWrapper__wPE0R > div:first-child:last-child {
 width: unset !important;
 margin: auto auto !important;
}

.Tweet_TweetContainer__gC_9g .Tweet_imageContainer__G8A9R img {
height: 282px !important;
}`)
    addstyle.remove(GF?.nit);
    if (z == 1) GF.nit = addstyle.add(`.still-image img:not([class*="quote"] img){ object-fit:contain !important; max-height:300px !important;}`)
  }

  document.addEventListener("keydown", e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;

    keyFunc.forEach(v => {
      if (v.key.test(key)) {
        if (v.func(e, key)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    })

    if (key === "y" && (poppedUrl || eleget0('img:hover')?.src || 0)) { // y::ホバー中の画像をiqdb/yandex画像検索で検索
      //yandexUrl = poppedUrl.match(/\;base64\,/i) ? null : `https://iqdb.org/?url=${encodeURI(poppedUrl)}`; //`https://www.bing.com/images/search?q=imgurl:${encodeURI(poppedUrl)}&view=detailv2&iss=sbi`;
      //yandexUrl = poppedUrl.match(/\;base64\,/i) ? null : `https://www.bing.com/images/search?q=imgurl:${encodeURI(poppedUrl)}&view=detailv2&iss=sbi`;
      //yandexUrl = poppedUrl.match(/\;base64\,/i) ? null : "https://yandex.com/images/search?rpt=imageview&url=" + poppedUrl;
      let hsrc = (poppedUrl || eleget0('img:hover')?.src)
      yandexUrl = hsrc?.match(/\;base64\,|image\/svg/i) ? null : "https://lens.google.com/uploadbyurl?url=" + hsrc;
      if (yandexUrl) {
        if (!CONFIRM_FOR_Y || window.confirm(yandexUrl + "\n\nを開きます。よろしいですか？")) window.open(yandexUrl);
      }
      return false;
    }
    if (key === "a" && lh("//twitter.com|//nitter.net/|//nitter.cz|//xcancel.com/|//x.com/|https://search.yahoo.co.jp/realtime/search")) { // a::twitterで画像をトリミングさせないオンオフ
      zflag = zflag ^ 1;
      setsize(zflag)
      pref("zflag", zflag)
      popup(`a:画像をフィット：${zflag}`, zflag == 0 ? "#888" : undefined)
      return false;
    }
    if (key === KEY_SELECT_DELAY) { // Shift+H::ホバーの設定
      elegeta('//img[@class="ignoreMe hzP"]').forEach(e => e.remove());
      let ret = hovertime == -1 ? 1 : hovertime == 1 ? defaultDelay : -1;
      if (ret == 1) verbose = 1 - verbose
      if (ret === "") {
        pref(domain + " : delay", "");
        hovertime = hoverTimeDefault;
      } else {
        if (ret !== null) {
          hovertime = ret || hoverTimeDefault;
          pref(domain + " : delay", hovertime);
          popup(`${domain}\n${KEY_SELECT_DELAY}：ホバーズームを${hovertime!=-1?"有効":"無効"}にしました${hovertime>0?"("+hovertime+"/60秒)":""}${hovertime!=-1&&verbose?"\n―Expert Mode":""}`, hovertime > 0 ? verbose ? "#362" : "#6080ff" : "#808080")
        }
      }
    }
  }, true);

  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
    mouseShift = e.shiftKey ^ REVERSE_SHIFTKEY ^ verbose;
    hovertimer = 0;
  }, false);

  document.addEventListener("wheel", function(e) {
    hovertimer = 0;
  }, false);

  function getimg(d = 0) {
    //if(verbose||d){document.querySelectorAll('*').forEach(el => getComputedStyle(el).pointerEvents === 'none' && (el.style.pointerEvents = 'auto', requestAnimationFrame(()=> el.style.pointerEvents = 'none')));} // pointer-eventを強制（重いのでexpertのみ
    if (verbose || d)(addstyle.add('*{pointer-events:auto !important;}'), requestAnimationFrame(() => addstyle.remove('*{pointer-events:auto !important;}'))); // pointer-eventを強制（重いのでexpertのみ
    if (verbose && debug) { let hovers = [...document?.elementsFromPoint(mousex, mousey)].filter(v => v.matches(`img`)); if (hovers.length) console.log(hovers) }
    for (let e of [...document?.elementsFromPoint(mousex, mousey)]) {
      if (e?.id === "imgfullscreen") return "f";
      if (window.getComputedStyle(e).position == "fixed" && !e?.dataset?.ghz) return; // 手前にfixedのものがあるなら止まる
      if (e?.matches("img#thumbnail.style-scope.ytd-moving-thumbnail-renderer")) continue; // 無視する要素（YouTubeのカバー等）
      if ("magnifierLens" === e?.id) { // amazonのレンズがあるものはやらない
        if (d) continue;
        else return "s";
      }
      if (e?.src?.indexOf("/mqdefault_6s.webp") == -1 // youtubeのアニメwebpじゃない
        &&
        (HANDLE_LIST.includes(e?.tagName) || e?.style?.backgroundImage?.match0(/^url\(/))) return e;
    }
    return document.elementFromPoint(mousex, mousey)
  }

  ael(document, "dragstart", e => GF.isDragging = 1, 1)
  ael(document, "dragend drop", e => GF.isDragging = 0, 1)
  hzOnInt()
  //ael(document, "scroll mousemove", hzOnInt, 1)

  function hzOnInt() {
    if (!(hovertime < 1) && (document?.visibilityState == "visible")) {
      hovertimer++;
      let ele = getimg();
      if (ele !== "f") {
        if (ele !== "s") {
          if ((lastEle !== ele || GF?.isDragging) && (!mouseShift || !ele?.classList.contains("hzP"))) {
            hovertimer = 0;
            if (poppedUrl) {
              document?.querySelectorAll('.ignoreMe.hzP')?.forEach(e => e.remove());
              poppedUrl = "";
            }
          }
          if (ele && hovertimer >= hovertime && poppedUrl == "" && (ele.clientWidth < minWidth || ele.clientHeight < minHeight)) {
            if (HANDLE_LIST.includes(ele?.tagName) ||
              (ele?.style?.backgroundImage?.match0(/^url\(/)) ||
              (ele?.matches(`a[href*="imgur.com"],a[href*="pbs.twimg.com"]`) && ele?.href?.match(/.png$|.jpg$|.jpeg$|.gif$|.bmp$|.webp$/i))) {
              if (ele?.dataset?.zoomonhover != "disable") {
                poppedUrl = pe(ele, enablePanel);
                //          yandexUrl = poppedUrl.match(/\;base64\,/i) ? null : "https://yandex.com/images/search?rpt=imageview&url=" + poppedUrl;

                //              if ((verbose || replaceMode) && (isFtbucket || is2chanOrig)) {
                if ((replaceMode) && (isFtbucket || is2chanOrig)) {
                  //                if (ele && ele.tagName === "IMG" && (verbose || (replaceMode >= 2)) ?
                  if (ele && ele.tagName === "IMG" && ((replaceMode >= 2)) ?
                    ele?.matches(':is(.thre , td.rtd)>a:is([href*=".gif"],[href*=".png"],[href*=".jpg"],[href*=".webp"])>img:not([data-gifloaded])') :
                    //ele?.matches(':is(#pickbox a:is([href*=".gif"],[href*=".png"],[href*=".jpg"],[href*=".webp"]) , :is(.thre>a,td.rtd>a)[href*=".gif"])>img:not([data-gifloaded])')) { // 2chanならgifを動かす
                    ele?.matches(':is(#pickbox a:is([href*=".gif"]) , :is(.thre>a,td.rtd>a)[href*=".gif"])>img:not([data-gifloaded])')) { // 2chanならgifを動かす
                    let a = ele?.closest("a")
                    ele.dataset.gifloaded = 1;
                    if (a && a?.href != ele?.src && (isFtbucket || eleget0('#contdisp')?.textContent?.indexOf("スレッドがありません") == -1)) {
                      checkExists(a?.href, () => {
                        elegeta(`img[src="${ele?.getAttribute("src")}"]:not(.quoteSpeechBalloonImg)`).forEach(ele => {
                          ele.dataset.gifloaded = 1;
                          ele.src = a.href;
                          ele.animate([{ boxShadow: "0 0 0 0 #30cf88f0", outline: "4px solid rgba(0, 255,128,0.7)" }, { boxShadow: "0 0 10px 35px #30cf8800", outline: "4px solid rgba(0, 255,128,0.7)" }], 666)
                        })
                      })
                    }

                    function checkExists(url, cb) {
                      if (url) return fetch(url, { method: 'HEAD', cache: 'reload' }).then(response => response.ok && cb()).catch(() => false);
                    }
                  }
                }
              }
            }
          }
          lastEle = ele;
        }
      }
    }
    requestAnimationFrame(hzOnInt) // setTimeout(hzOnInt, 17);
  }

  function pe(a, fpanel) {
    var panel;
    //if (/magnifierLens|landingImage/.test(a.id)) return ""; // amazon拡大鏡の水色のドット
    let imgAspect = a.tagName == "VIDEO" ? a.videoWidth / a.videoHeight : (a.naturalWidth ?? a?.offsetWidth) / (a.naturalHeight ?? a?.offsetHeight); // svg等だとNaN 要.onload
    let clientAspect = window.innerWidth / 2 / window.innerHeight;
    let ahref = (decodeURIComponent(a?.href)?.replace(REDIRECT_RE, ""))
    if (ahref && !(IMGURL.test(ahref))) ahref = "";
    let fixAR = false;
    if (mouseShift) replaceMode = 3;

    // 動画
    if (a.tagName === "VIDEO") {
      var src = a?.src || eleget0('source', a)?.src
      var srcOrg = src;
      if (src && !a?.paused) return src;
      if (src && fpanel) {
        var ve = document.createElement("video")
        panel = document.createElement("span");
        panel.referrerpolicy = "no-referrer"; // 無効
        panel.className = "ignoreMe hzP";
        panel.appendChild(ve)
        panel.src = src
        panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: VIDEO_FADEIN_MS, fill: 'forwards' });
        ve.outerHTML = `<video class="ignoreMe hzP" id="hzPv" controls autoplay loop referrerpolicy="no-referrer" width="100%" height="100%"><source referrerpolicy="no-referrer" src="${src}" type="video/mp4"></video>`;
        eleget0('video', panel).playbackRate = elegeta('video').reduce((a, b) => Math.max(a, b?.playbackRate), 0) || 1;
        panel.maxWidth = "18%";
        blur(a, panel);
      }
    } else if (a?.dataset?.srcvideo || (a.parentNode.tagName == "A" && a.parentNode.href.match(/.mp4(\?.+)*$|.webm(\?.+)*$/i))) { // videoタグかつ親がaタグでhrefに動画ファイルへのリンク、ふたば等
      var ext = (a?.dataset?.srcvideo || a.parentNode.href).match(/.mp4(\?.+)*$|.webm(\?.+)*$/i)[0];
      var src = a?.dataset?.srcvideo || a.parentNode.href;
      if (!src) return; // ?
      if (fpanel) {
        if (replaceMode >= 3 && !a?.parentNode?.dataset?.coverEleped && is2chan) { // ふたばでvideoに置き換える
          a.parentNode.dataset.coverEleped = 1;
          coverEle(a, `<video class="ignoreMe coverdVideo" controls loop referrerpolicy="no-referrer" style="opacity:1;" width="100%" height="100%"><source referrerpolicy="no-referrer" src="${src}" type="video/mp4"></video>`);
          return src;
        }
        var ve = document.createElement("video")
        panel = document.createElement("span");
        panel.referrerpolicy = "no-referrer"; // 無効
        panel.className = "ignoreMe hzP";
        panel.appendChild(ve)
        panel.src = src
        panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: VIDEO_FADEIN_MS, fill: 'forwards' });
        ve.outerHTML = `<video class="ignoreMe hzP" id="hzPv" controls autoplay loop referrerpolicy="no-referrer" width="100%" height="100%"><source referrerpolicy="no-referrer" src="${src}" type="video/mp4"></video>`;
        panel.maxWidth = "18%";
        blur(a, panel);
      }
    } else if (a.style.backgroundImage?.match0(/^url\(/) && !a?.src && !a?.srcset) { // background-image式の画像
      var src = (a.style.backgroundImage.match0(/url\(\"([^"]+)/))
      if (!src) return; // ?
      if (fpanel) {
        panel = document.createElement("img");
        panel.referrerpolicy = "no-referrer";
        panel.className = "ignoreMe hzP";
        panel.src = src
        blur(a, panel);
      }
    } else {
      // 画像
      var src = a?.src || ahref;
      var srcOrg = src;
      if (!/\/\/external-content\.duckduckgo\.com\//.test(src)) { // ddgではCSPにより元を求めない
        if (a.parentNode && a.parentNode.tagName == "A" && a.parentNode.href.match(/\?name=orig|\/pic\/orig\/|.png$|.jpg$|.jpeg$|.gif$|.bmp$|.webp$/i) && /\.wikipedia\./.test(location.href) == false && !/github/.test(src)) {
          src = a.parentNode.href;
        } else if (a.parentNode && a.parentNode.parentNode && a.parentNode.parentNode.tagName == "A" && a.parentNode.parentNode.href.match(/.png$|.jpg$|.jpeg$|.gif$|.bmp$|.webp$/i)) {
          src = a.parentNode.parentNode.href;
        }
      }
      if (a.srcset) {
        if (ld("wikipedia.org")) {
          var srcWiki = a.srcset.match(/\/\/\S+/g);
          if (srcWiki.length) src = srcWiki[srcWiki.length - 1].replace(/\/\d+px-.*$/i, "").replace(/\/thumb\//i, "/");
        } else {
          function getHR(img) {
            let candidates = img.srcset.split(/\,(?=\s)/).map(c => { //let candidates = img.srcset.split(',').map(c => {
              let [url, descriptor] = c.trim().split(/\s+/);
              return { url, descriptor: parseFloat(descriptor) || 1 };
            });
            return candidates.reduce((highest, current) => current.descriptor > highest.descriptor ? current : highest).url;
          }
          var src = getHR(a)?.replace(/\/thumb\//i, "/") //a.srcset.match(/\/\/\S+/g);
        }
      }

      if (ld(/5ch\.net$|shitaraba\.net$|^talk\.jp$/)) src = decodeURIComponent(src)?.replace(REDIRECT_RE, "")
      if (ld("www.yodobashi.com") && src?.match(/https:\/\/image\.yodobashi\.com\/product\/\d+\/\d+\/\d+\/\d+\/\d+\/\d+\/\d+_10205(_\d+)?(\.jpg)/)) src = src.replace(/(https:\/\/image\.yodobashi\.com\/product\/\d+\/\d+\/\d+\/\d+\/\d+\/\d+\/\d+)_10205(_\d+)?(\.jpg)/, "$1_10204$2$3")
      if (ld("amazon")) {
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._?SY[\d_]+(\.\w+)$/, "$1$2").replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+\._AC_)US\d+_(\.jpg)$/, "$1$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._AC_.+_QL\d+_(\.jpg).*$/, "$1$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._AC_.+_QL\d+_(\.jpg).*$/, "$1$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._AC_.+_QL\d+_(\.jpg).*$/, "$1$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._SS\d+_(\.jpg).*$/, "$1\._AC_SY550_$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._AC_SR\d+\,\d+_(\.jpg).*$/, "$1\._AC_SX679_$2")
        src = src.replace(/^(https:\/\/m\.media-amazon\.com\/images\/I\/[^\.]+)\._AC_AA\d+_(\.jpg).*$/, "$1\._AC_SX679_$2")
      }
      if (ld("suruga-ya") && ![`https://cdn.suruga-ya.jp/database/images/no_photo.jpg`, `https://www.suruga-ya.jp/database/images/no_photo.jpg`].includes(src)) src = src.replace(/^https:\/\/www\.suruga-ya\.jp\/database\/photo\.php\?shinaban=(\d+)\&size=[sml]$/, "https://cdn.suruga-ya.jp/database/pics_webp/game/$1.jpg.webp")

      if (ld("youtube.com")) {
        src = src.replace(/https:\/\/yt3\.ggpht\.com\/((?:ytc\/)?[^/]+)=s\d\d-([^/]+)/, "https://yt3.googleusercontent.com/$1=s176-$2")
        src = src.replace(/^(https:\/\/i\.ytimg\.com\/vi\/.*)(?:hq720|hq2)\.jpg([\&\?]sqp=[^\&]*)?([\&\?][^\&]*)/g, "$1maxresdefault.jpg")
        src = src.replace(/(https:\/\/i)\d*(\.ytimg\.com\/vi\/[a-zA-Z0-9\-\_]{11}\/)hqdefault(?:_custom_\d+)?\.jpg.*/, "$1$2maxresdefault.jpg")
      }
      if (src?.match(/(https:\/\/pbs\.twimg\.com\/profile_images\/\d+\/.*)_bigger(\.jpg)/)) src = src.replace(/(https:\/\/pbs\.twimg\.com\/profile_images\/\d+\/.*)_bigger(\.jpg)/, "$1$2")
      src = src.replace(/^(https:\/\/pbs\.twimg\.com\/profile_images\/\S+)_normal(\.png|\.jpe?g|\.avif|\.webp|\.gif)$/, "$1$2")
      if (ld("kakaku.com")) {
        src = src?.replace(/https:\/\/img\d+\.kakaku\.k-img\.com\/images\/productimage\/[lmst]+\/(\w[\d_]+\.jpg)/, `https://img1.kakaku.k-img.com/images/productimage/fullscale/$1`)
        src = src?.replace(/(https:\/\/revimg\d+\.kakaku\.k-img\.com\/images\/Review\/\d+\/\d+\/\d+\_)[st](\.jpg)/, `$1m$2`)
      }
      //if(/https:\/\/i\.pximg\.net\/[^/]+\/[^/]+\/[^/]+\/img\/.+/.test(panel.src)) {panel.src=panel.src.replace(/(https:\/\/i\.pximg\.net\/)[^/]+\/[^/]+\/([^/]+\/img\/.+)/,"$1$2").replace(/custom-thumb/,"img-master").replace(/_custom/,"_master");} // pixiv
      if (lh("old.reddit.com")) {
        let redid = a?.closest('div[data-media-id]')?.dataset.mediaId
        if (redid) {
          fixAR = 1;
          src = eleget0(`div.media-preview-content a.gallery-item-thumbnail-link[href*="${redid}"]`)?.href || src;
        } // スレ内のギャラリー
        else {
          fixAR = 16.67 * 3;
          src = eleget0('a.search-link.may-blank', a?.closest('div.search-result.search-result-link.has-thumbnail'))?.href || src;
        } // スレ一覧の見出し　AR狂うけど低画質よりまし？
      }
      if (ld("2chan.net")) fixAR = 17;

      if (/^https?:\/\/.+\.2chan\.net\/b\/cat\//.test(src)) { src = src.replace(/^(https?:\/\/.+\.2chan\.net\/b\/)cat\//, "$1thumb/"); } // futapo
      if (src.match0(/\?w=\d+\&h=\d+$/)) src = src.replace(/\?w=\d+\&h=\d+$/, "");
      if (ld('x\.com|nitter|xcancel')) src = src.replace(/(https:\/\/pbs\.twimg\.com\/.*\?format=.+\&name=).+/, "$1orig");
      src = src.replace(/^(https:\/\/pbs\.twimg\.com\/media\/[^\.]+\.jpg:)thumb$/, "$1orig");

      //if (ld("iherb.com") && /iherb\.com\//.test(src)) src = src.replace(/^(https:\/\/ugc-images\.images-iherb\.com\/.+\/)[sm]\.(jpe?g|png|avif|webp)$/, "$1l\.$2");
      if (ld("iherb.com") && /iherb\.com\//.test(src)) {
        src = src.replace(/^(https:\/\/cloudinary\.images-iherb\.com\/image\/upload\/.+\/)[ur](\/.+\.)(jpe?g|png|avif|webp)$/, "$1l$2$3");
        src = src.replace(/^(https:\/\/cloudinary\.images-iherb\.com\/image\/upload\/f_auto\,q_auto\:eco\/.*\/)[sm]\.(jpe?g|png|avif|webp)$/, `$1l.$2`)
        src = src.replace(/^(https:\/\/ugc-images\.images-iherb\.com\/ugc\/[^\/]+\/[^\/]+\/)[sm]\.(jpe?g|png|avif|webp)$/, `$1l.$2`)
        src = src.replace(/^(https:\/\/cloudinary\.images-iherb\.com\/image\/upload\/f_auto,q_auto:eco\/images\/.+\/)[sml](\/\d+\.jpe?g|png|avif|webp)$/, `$1v$2`)
      }
      if (ld("belc-netshop")) {
        src = src.replace(/(commodity\/\d+)_s(\.jpg)$/, "$1$2").replace(/(\/\d+_)thumb(\.jpg)/, "$1common$2");
      }
      if (ld("jp.mercari.com")) src = src.replace(/^https:\/\/static\.mercdn\.net\/c!\/w=\d+\/thumb\/photos(\/m[\d_]+\.jpg)/, "https://static.mercdn.net/item/detail/orig/photos/$1").replace("https://assets.mercari-shops-static.com/-/small/", "https://assets.mercari-shops-static.com/-/large/")
      if (ld("auctions.yahoo.co.jp")) src = src.replace(/\?.*\&nf_path=.*$/, "")
      if (ld("jmty.jp")) src = src.replace(/^(https:\/\/cdn\.jmty\.jp\/articles\/images\/[^\/]+\/)thumb_m_file\.jpg$/, "$1slide_file.jpg")
      if (ld("workman.jp")) src = src.replace(/(\/img\/goods\/)S(\/\d+_t\d+\.jpg)/, "$1L$2") //.replace(/(\/img\/goods\/)\d+(\/\d+_.+\.jpg)$/,"$115$2")
      if (ld("kakaku.com")) src = src.replace(/(\/\/bbsimg\d+\.kakaku\.k-img\.com\/images\/bbs\/\d+\/\d+\/\d+_)s(\.jpg)/, "$1m$2")
      if (ld("espn.com")) src = src.replace(/(https:\/\/a\.espncdn\.com\/combiner\/i\?img=\/.*\.(?:png|webp|jpe?g|gif|AVIF))(.*)$/i, "$1")

      if (src != a?.src && REPLACE_ORIGINAL() && replaceMode >= 2 && a?.matches("img")) {
        a.src = src;
        a.removeAttribute("srcset");
        a.animate([{ boxShadow: "0 0 0 0 #30cf88f0", outline: "4px solid rgba(0, 255,128,0.7)" }, { boxShadow: "0 0 10px 35px #30cf8800", outline: "4px solid rgba(0, 255,128,0.7)" }], 666)
        //a?.parentNode?.animate([{ boxShadow: "0 0 0 0 #30cf88f0", outline: "4px solid rgba(0, 255,128,0.7)" }, { boxShadow: "0 0 10px 35px #30cf8800", outline: "4px solid rgba(0, 255,128,0.7)" }], 666)
        a?.closest("picture") && eleget0('source', a?.closest("picture"))?.remove()
      }
      if (!src) return; // ?
      if (fpanel) {
        if (location.protocol == "file:" /*&& !(await fetch(src, { method: 'HEAD', cache: "force-cache" } )?.ok ) */ ) { src = a?.src || src }
        var panel = document.createElement("img");
        panel.referrerpolicy = "no-referrer";
        //panel.referrerpolicy = "origin";
        panel.className = "ignoreMe hzP";
        panel.src = src
        panel.dataset.ghz = 1;
        //if (window.getComputedStyle(a)?.filter?.match0(/blur\(([ 0-9\.]*)/) > 0) panel.animate([{ filter: `blur(6vh) saturate(33%)` }, {}], { duration: 8000, easing: "ease-out" });
        blur(a, panel)
        /*var blur=window.getComputedStyle(a)?.filter?.match0(/blur\(([ 0-9\.]*)px\)/);
                if (blur > 0) panel.animate([{ filter: `blur(${blur*3}px) saturate(33%)` }, {}], { duration: 8000, easing: "ease-out" });*/
      }
    }

    if (panel) {
      panel.className = "ignoreMe hzP";
      setSizeImg(a, panel, a, a, src, ve)

      if (a.clientWidth < document.documentElement.clientWidth * 0.48) document.body.appendChild(panel);
      if (mouseShift) {
        dragElement(panel, "*", "a")
        panel.addEventListener('wheel', e => {
          e.stopPropagation()
          e.preventDefault()
          if (!e.shiftKey) {
            let s = e?.target?.style?.transform?.match0(/scale\(([\-\d+\.]+)\)/) || 1;
            s = Math.min(50, Math.max(0.1, +s - (e.deltaY) / 1000));
            anima(e.target, { "transform": e.target.style.transform.replace(/initial|scale\([0-9\-\.]+\)/g, "") + `scale(${s})` });

          } else {
            let r = e?.target?.style?.transform?.match0(/rotate\(([\-\d+\.]+)deg\)/) || 0;
            r = (Math.round(((r - (-e.deltaY) / 10)) / 10) * 10);
            anima(e.target, { "transform": e.target.style.transform.replace(/initial|rotate\([0-9\-\.]+deg\)/g, "") + ` rotate(${r}deg)` });
          }
          return false
        }, true)
      }

      function anima(e, css, dur = 16.67 * 4) {
        if (!SMOOTH) { for (let c in css) e.style[c] = css[c]; return }
        GF?.anima?.finish()
        GF?.animaF?.()
        GF.anima = e.animate(css, dur)
        GF.animaF = (function(e, css) { return function() { for (let c in css) e.style[c] = css[c]; } })(e, css)
        GF.anima.onfinish = GF.animaF // setTimeout(GF.animaF,dur+1)
      }

      if (ahref || fixAR || src != srcOrg) {
        fixAR && panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fixAR || 17, fill: 'forwards' });
        panel.onload = e => setSizeImg(a, panel, a, panel, src, ve); // 縦横比をonload後に実物に合わせて修正する
      }
    }
    return src;
  }

  function setSizeImg(a, b, s, imgforAR, src, ve) { // a:hoverImg b:imgToFix s:imgAvoid
    if (!src) return;
    var panel = b;
    if (src?.match0("https://i.ytimg.com/vi/")) {
      if (imgforAR.naturalWidth == 120) { // youtubeで空だったら解像度を下げる
        poppedUrl = imgforAR.src.replace("sddefault.", "hqdefault.").replace("maxresdefault.", "sddefault.")
        imgforAR.src = poppedUrl;
        return
      }
    }

    let imgAspecta = (a.naturalWidth ?? a?.offsetWidth) / (a.naturalHeight ?? a?.offsetHeight); // svg等だとNaN 要.onload
    let imgAspect = (imgforAR.naturalWidth ?? imgforAR?.offsetWidth) / (imgforAR.naturalHeight ?? imgforAR?.offsetHeight); // svg等だとNaN 要.onload
    //verbose&&popup(`${Math.abs(imgAspecta-imgAspect)} ${a!=imgforAR&&Math.abs(imgAspecta-imgAspect)<0.1}`)
    //if (a?.src != imgforAR?.src && Math.abs(imgAspecta - imgAspect) < 0.005) return; // AR差が0.005未満なら修正しない

    let clientAspect = window.innerWidth / 2 / window.innerHeight;

    let amariWidth = (mousex < document.documentElement.clientWidth / 2) ? (document.documentElement.clientWidth - (s.getBoundingClientRect()).right) : (s.getBoundingClientRect().left);
    let onRight = (mousex < document.documentElement.clientWidth / 2);
    let peStyle = 'margin:2px; border-radius:3px; color:#ffffff;  box-shadow:0px 0px 8px #0008; border:2px solid #fff;';
    let boxPos = (mousey < (window.innerHeight / 2) ? "bottom:0px;" : "top:0px;") + (onRight ? "right:0px; " : "left:0px;");
    let aw = (mousex < document.documentElement.clientWidth / 2) ? (document.documentElement.clientWidth - (a.getBoundingClientRect()).right) : (a.getBoundingClientRect().left);

    let imgAspect2 = imgforAR.tagName == "VIDEO" ? imgforAR.videoHeight / imgforAR.videoWidth : (imgforAR.naturalHeight ?? imgforAR?.offsetHeight) / (imgforAR.naturalWidth ?? imgforAR?.offsetWidth); // svg等だとNaN 要.onload
    let imgAspectb2 = b.tagName == "VIDEO" ? b.videoHeight / b.videoWidth : (b?.naturalHeight ?? b?.offsetHeight) / (b.naturalWidth ?? b?.offsetWidth); // svg等だとNaN 要.onload
    //    let info1 = `${sani(a?.src)?.slice(0,159)} ${(a.naturalWidth??a?.offsetWidth)}×${(a.naturalHeight??a?.offsetHeight)} ar=1:${Math.round(imgAspect2*100)/100}`;
    let info1 = `${sani(a?.src)?.slice(0,999)} ${(a.naturalWidth??a?.offsetWidth)}×${(a.naturalHeight??a?.offsetHeight)} ar=1:${Math.round(imgAspect2*100)/100}`;
    //    if (debug && a?.src != b?.src) info1 += `\n${b?.src?.slice(0,159)} ${(b.naturalWidth??b?.offsetWidth)}×${(b.naturalHeight??b?.offsetHeight)} ar=1:${Math.round(imgAspect2*100)/100}`;
    //    if (a?.src != b?.src) info1 += `\n${b?.src?.slice(0,159)} ${(b.naturalWidth??b?.offsetWidth)}×${(b.naturalHeight??b?.offsetHeight)} ar=1:${Math.round(imgAspect2*100)/100}`;
    if (a?.src != b?.src) info1 += `\n${b?.src?.slice(0,999)} ${(b.naturalWidth??b?.offsetWidth)}×${(b.naturalHeight??b?.offsetHeight)} ar=1:${Math.round(imgAspect2*100)/100}`;
    let info2 = ` → ${Math.floor(window.innerWidth*0.48-marginPe)}×${Math.floor(window.innerWidth*0.48/imgAspect-marginPe)}`
    let info2css = ` width:${Math.floor(window.innerWidth*0.48-marginPe)}px; height:${Math.floor(window.innerWidth*0.48/imgAspect-marginPe)}px;`

    let marginH = (mouseShift) ? 0 : MARGINH;

    if (imgAspect && (((aw - marginH) / imgAspect) <= window.innerHeight && (aw - marginH - marginPe) > a.width * 2.5)) {
      panel.setAttribute("style", `all:initial;float:none; width:${aw-marginH-marginPe}px; height:${(aw-marginH)/imgAspect-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 元絵の左右にくっつき最大
      if (verbose) popup(`${info1} くっつき`)
    } else if (imgAspect && ((window.innerHeight * imgAspect - marginPe) < aw - marginH)) {
      //if (imgAspect < 0.46 && !ve) { // 48%＋スクロール
      if (imgAspect < ASPECT_RATIO_CAUSES_SCROLL && !ve && !mouseShift) { // 48%＋スクロール
        panel.setAttribute("style", `all:initial;float:none; ${info2css}  ${boxPos} top:0px; z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 48%＋スクロール
        //        if (window.innerWidth * 0.48 / imgAspect - marginPe > window.innerHeight) setTimeout(() => { panel.animate([{ top: '0px' }, { top: `-${window.innerWidth*0.48/imgAspect-marginPe-window.innerHeight+marginPe}px` }], { duration: (window.innerWidth * 0.48 / imgAspect - marginPe - window.innerHeight + marginPe) * 4, fill: 'forwards' }); }, 1000)
        setTimeout(() => { panel.animate([{ top: '0px' }, { top: `-${window.innerWidth*0.48/imgAspect-marginPe-window.innerHeight+marginPe}px` }], { duration: (window.innerWidth * 0.48 / imgAspect - marginPe - window.innerHeight + marginPe) * 4, fill: 'forwards' }); }, 1000)
        if (verbose) popup(`${info1} ${info2}  48%＋スクロール`)
      } else {
        panel.setAttribute("style", `all:initial;float:none; width:${(window.innerHeight)*imgAspect-marginPe}px; height:${((window.innerHeight))-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 縦目いっぱい
        if (verbose) popup(`${info1} 縦目いっぱい`)
      }
    } else if (!imgAspect || window.innerWidth * 0.48 / imgAspect - marginPe <= window.innerHeight) {
      panel.setAttribute("style", `all:initial;float:none; ${info2css}  ${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 横48％
      if (verbose) popup(`${info1} ${info2}  48%`)
    } else {
      panel.setAttribute("style", `all:initial;float:none; width:${(window.innerHeight)*imgAspect-marginPe}px; height:${((window.innerHeight))-marginPe}px;${boxPos} z-index:${POPUP_Z_INDEX}; position:fixed; ${peStyle}`); // 縦目いっぱい
      if (verbose) popup(`${info1} 縦目いっぱい２`)
    }
    panel.style.cursor = "grab";

    requestAnimationFrame(() => {
      if (mouseShift && onRight) panel.style.left = `${a.getBoundingClientRect()?.left + a.getBoundingClientRect()?.width  -2}px`;
      if (mouseShift && !onRight) panel.style.left = `${a.getBoundingClientRect()?.left - panel.getBoundingClientRect()?.width-2}px`;
      if (mouseShift) panel.style.top = `${Math.max(0 , Math.min( clientHeight()-panel.getBoundingClientRect().height-2 , Math.max(
     a.getBoundingClientRect()?.top + 100 - panel.getBoundingClientRect()?.height ,
     Math.min(a.getBoundingClientRect()?.bottom - 100 , panel.getBoundingClientRect().top))))}px`;
    })
  }


  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    let flag
    if (!/^\.?\//.test(xpath)) return /:inscreen$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:inscreen$/, ""))].filter(e => { var eler = e.getBoundingClientRect(); return (eler.top > 0 && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < document.documentElement.clientHeight) }) : /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight) : [...node.querySelectorAll(xpath)]
    try {
      var array = [];
      var ele = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      let l = ele.snapshotLength;
      for (var i = 0; i < l; i++) array[i] = ele.snapshotItem(i);
      return /:visible$/.test(xpath) ? array.filter(e => e.offsetHeight) : array;
    } catch (e) { popup3(e + "\n" + xpath + "\n" + JSON.stringify(node), 1); return []; }
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (!/^\.?\//.test(xpath)) return /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight)[0] ?? null : node.querySelector(xpath.replace(/:visible$/, ""));
    try {
      var ele = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
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

  function prefRestrict(name, type) {
    let data = pref(name);
    if (!data) return data;
    if (type === "array") {
      if (typeof data === "object") {
        return data;
      } else {
        alert("データベースの形式に誤りがある（配列／オブジェクトでない）ためクリアします\n");
        pref(name, "");
        return [];
      }
    }
    return data;
  }

  function proInput(prom, defaultval, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    let ret = window.prompt(prom, defaultval)
    if (ret === null) return null;
    if (ret === "") return "";
    return Math.min(Math.max(Number(ret.replace(/[Ａ-Ｚａ-ｚ０-９．－]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  function popup(text, color = "#6080ff") {
    let text2 = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var e = document.getElementById("hzbox");
    if (e) { e.remove(); }
    //var e = document.body.appendChild(document.createElement("span"));
    //    e.innerHTML = `<span id="hzbox" style="all:initial; max-width:95%; position: fixed; right:1em; top: 1em; z-index:${POPUP_Z_INDEX+ZMARGIN}; opacity:1; font-size:14px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:left; word-break: break-all; padding:1px 6px 1px 6px; border-radius:12px; background-color:${color }; color:white; " onclick=\'var a = document.createElement(\"textarea\"); a.value = \"${ text.replace(/<br>/gm, "\\n") }\"; document.body.appendChild(a); a.select(); document.execCommand(\"copy\"); a.parentElement.removeChild(a);\'">${ text }</span>`;
    e = begin(document.body, `<span id="hzbox" class="ignoreMe" style="all:initial; cursor:pointer; max-width:95%; position: fixed; right:1em; top: 1em; z-index:${POPUP_Z_INDEX+ZMARGIN}; opacity:1; font-size:14px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:left; word-break: break-all; padding:1px 6px 1px 6px; border-radius:12px; background-color:${color }; color:white; ">${ text2 }</span>`);
    e.addEventListener("click", v => GM.setClipboard(text + "\n"))
    setTimeout((function(e) { return function() { e.remove(); } })(e), 5000);
  }

  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function coverEle(e, html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const newe = tempDiv.firstChild;
    const computedStyle = window.getComputedStyle(e);
    newe.style.width = `${e.offsetWidth}px`;
    newe.style.height = `${e.offsetHeight}px`;
    newe.style.margin = "0 20px";
    newe.style.float = "left";
    e.parentNode.appendChild(newe);
    e.remove()
  }

  function dragElement(ele, handleSel = "*", cancelSel = "", zindexcss = "") { //v0.2
    let x, y;
    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e => e.onmousedown = dragMouseDown)

    function dragMouseDown(e) {
      if (e.target.closest(cancelSel) || e.button != 0) return;
      if (e?.target?.style?.resize && mousex > ele.offsetLeft + ele.offsetWidth - 8 && mousey > ele.offsetTop + ele.offsetHeight - 8) return; // resize:bothだったら右下の角は掴めない判定にする
      e = e || window.event;
      e.preventDefault();
      if (!e?.target?.style?.resize) ele.style.minWidth = `${ele.offsetWidth}px`;
      [x, y] = [e.clientX, e.clientY];
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "none" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "none" })
      if (zindexcss) e.target.style.zIndex = elegeta(zindexcss).reduce((a, b) => Math.max(a, b.style.zIndex), 0) + 1
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      let border = +window.getComputedStyle(ele)?.border?.match0(/([\d\-\.]+)px/) || 0;
      if (ele.style.right) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.left = `${ele.offsetLeft-border}px`
        ele.style.right = ""
      }
      if (ele.style.bottom) { // right:かbottom:で張り付いてるものなら剥がしてleft/topにする
        ele.style.top = `${ele.offsetTop-border}px`
        ele.style.bottom = ""
      }

      ele.style.top = `${(ele.offsetTop - (y - e.clientY)-border)}px`;
      ele.style.left = `${(ele.offsetLeft - (x - e.clientX)-border)}px`;
      [x, y] = [e.clientX, e.clientY];
    }

    function closeDragElement(e) {
      document.onmouseup = null;
      document.onmousemove = null;
      elegeta('iframe').forEach(e => { e.style.pointerEvents = "auto" }) //elegeta('iframe', e.target).forEach(e => { e.style.pointerEvents = "auto" })
    }
  }

  function blur(a, panel) {
    var blurS = window.getComputedStyle(a)?.filter?.match0(/blur\(([ 0-9\.]*)px\)/);
    if (blurS > 0) panel.animate([{ filter: `blur(${blurS*3}px) saturate(33%)` }, {}], { duration: verbose ? 500 : 8000, easing: "ease-out" });
  }

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

  function shuffle(array) {
    return array.map(a => ({ rnd: Math.random(), val: a })).sort((a, b) => a.rnd - b.rnd).map(a => a.val);
  }

})();