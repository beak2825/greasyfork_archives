// ==UserScript==
// @name YouTubeで自動翻訳字幕（日本語）を常にオン
// @description B:再度試みる　N,Enter:次の動画　P,]:前の動画　A:今の位置から再生するURLをコピー（Shift+A:タブのURLにも反映＋プレイリストパラメータを維持）　[:全画面化
// @version      0.5.35
// @run-at document-idle
// @match *://www.youtube.com/*
// @match *://www.nicovideo.jp/watch/*
// @match *://live.nicovideo.jp/watch/*
// @grant GM.setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/391647/YouTube%E3%81%A7%E8%87%AA%E5%8B%95%E7%BF%BB%E8%A8%B3%E5%AD%97%E5%B9%95%EF%BC%88%E6%97%A5%E6%9C%AC%E8%AA%9E%EF%BC%89%E3%82%92%E5%B8%B8%E3%81%AB%E3%82%AA%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/391647/YouTube%E3%81%A7%E8%87%AA%E5%8B%95%E7%BF%BB%E8%A8%B3%E5%AD%97%E5%B9%95%EF%BC%88%E6%97%A5%E6%9C%AC%E8%AA%9E%EF%BC%89%E3%82%92%E5%B8%B8%E3%81%AB%E3%82%AA%E3%83%B3.meta.js
// ==/UserScript==

(function() {

  const WAIT_PAGEOPEN_OFFSET = 0; // ミリ秒 不安定なら大きくする
  const ENABLE_EVENJAPANESE = 1; // 1なら日本語タイトルの動画でも実行
  const ENABLE_EVENEMBED = 1; // 1なら埋め込み動画でも実行
  const DISABLE_AUTO_GENERATED_JAPANESE = 1; // 1なら日本語字幕しかない時は字幕をオフ
  const ENABLE_WHEN_MUTED = 1; // 1なら音声がミュートされている時は字幕をオン
  const DO_NOT_SELECT_LANGUAGE = 0; // 1なら日本語を選択しない（字幕をオンにするだけ）
  const WORDS_TO_FORCE_ENABLE = /$^/; // 動画タイトルに含むと字幕をオンにする正規表現　対象なしは/$^/
  const WORDS_TO_FORCE_DISABLE = /$^/; // 動画タイトルに含むと字幕をオフにする正規表現　対象なしは/$^/
  const KEY_A_VARIATIONS = 2; // 1-2:aキーで作るurlの種類　1:標準のみ　2:短縮形url
  const NICOLIVE_EXPAND_COMMENT_LIST = 1; // 1:ニコ生でコメント欄の横幅を広げるスライダーを設置
  const BUGGY_EXPRIMENTAL_FORCE_ENGLISH_WITH_DUALMARK = 0; // 1:デュアル字幕併用時に第1字幕に英語を選択（メニューがバグる）

  const WAIT_EACHACTION = 310; // ミリ秒 不安定なら大きくする
  const verbose = 0; // 開発用
  const VERBOSE_NOTIFY = 0; // 開発用　1:vn()
  const CHECK_ROAJ = 0; // 開発用　1:日本語にしなかった理由をalert
  const isDualsub = () => eleget0('//div[text()="デフォルトの字幕"]|//style[@id="dualMarkStyle"]|//button[contains(@class,"lln-youtube-")]') // Dual字幕/Language Reactorがあれば字幕を選択しない

  var checkROAJAlready = 0;
  var ds = 0

  var mllID;
  var kaisuuA = 0;
  var per = (performance.now()) / 3;
  verb("performance.now:" + performance.now(), "wait_base:" + per + "ms");
  var wait_pageOpen = (per > 1500 ? 1500 : per < 400 ? 400 : per) + WAIT_PAGEOPEN_OFFSET;
  vn("wait_pageOpen : " + Math.floor(wait_pageOpen) + " ms");

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] }
  String.prototype.match1 = function(re) { return this?.match(re)?.slice(1)?.find(Boolean) } // this./a(bc)|d(ef)/ 等の()でキャプチャした最初の１つを返す　gフラグ不可

  let inYOUTUBE = location.hostname.match0(/^www\.youtube\.com|^youtu\.be/);

  //  if (location.href.indexOf("//www.nicovideo.jp/watch/") != -1) { aToCopyUrl(); return; }
  if (location.href.indexOf("//www.nicovideo.jp/") != -1) { aToCopyUrl(); return; }
  if (location.href.indexOf("//live.nicovideo.jp/watch/") != -1) { nicolive(); return; }

  window.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || (inYOUTUBE && (e.target.closest('#chat-messages,ytd-comments-header-renderer,.ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer,.ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;

    if (e.key === "[") { // [ 全画面化
      toggleFullScreen();
      return false;

      function toggleFullScreen() {
        if (!document.fullscreenElement) {
          let p = document.documentElement.requestFullscreen();
          p.catch(() => {});
        } else {
          if (document.exitFullscreen) {
            let p = document.exitFullscreen();
            p.catch(() => {});
          }
        }
      }
    }
    if (key === "b") {
      toJP("forced");
      e.preventDefault();
      return false;
    }
    if (key === "n" || key === "Enter") {
      elecli("forced", 'a.ytp-next-button.ytp-button,.ytp-next-button'); //elecli("forced", '//a[@class="ytp-next-button ytp-button"]');
      e.preventDefault();
      //return false;
    }
    if (key === "p" || key === "]") {
      elecli("forced", 'a.ytp-prev-button.ytp-button,.ytp-prev-button'); //elecli("forced", '//a[@class="ytp-prev-button ytp-button"]');
      e.preventDefault();
      return false;
    }
    let purl = location?.href?.match1(/(https:\/\/www\.youtube\.com(?:\/watch\?.*v=|\/live\/)[a-zA-Z0-9_\-]{11})/)
    //    if ((key === "a" || key === "Shift+A") && location.href.match(/\/\/www\.youtube\.com\/watch\?.*v\=([a-zA-Z0-9_\-]{11})/)) { // a::
    if ((key === "a" || key === "Shift+A") && purl) { // a::
      e.preventDefault();
      e.stopPropagation()
      e.returnValue = false
      var ctimeEle = eleget0('//video');
      if (ctimeEle) {
        var ctime = Math.floor(ctimeEle.currentTime);
        var ret = (navigator.platform.indexOf("Win") != -1) ? "\r\n" : "\n";

        //        let newurl = key === "a" ? "https://www.youtube.com/watch?v=" + location.href.match0(/v\=([a-zA-Z0-9_\-]{11})/) + (ctime > 0 ? ("&t=" + ctime) : "") : location.href.replace(/&t=\d*s?/, "").replace(/[\?|\&]index=\d+/, "") + (ctime > 0 ? ("&t=" + ctime) : "");
        let newurl = key === "a" ? purl + (ctime > 0 ? ("?t=" + ctime) : "") :
          location.href.replace(/[\&\?]t=\d*s?/, "").replace(/[\?\&]index=\d+/, "") + (ctime > 0 ? ("?t=" + ctime) : "");

        let transratedTitle = (eleget0('//h1[@class=\"title style-scope ytd-video-primary-info-renderer\"]/yt-formatted-string/font/font|//div[@id=\"title\" and contains(@class,\"style-scope ytd-watch-metadata\")]/h1/yt-formatted-string/font/font|//div[@id="title"]/h1/yt-formatted-string/font|//div[@id="above-the-fold"]/div/h1/yt-formatted-string[@class="style-scope ytd-watch-metadata"]')?.innerText?.replace(/(?!= - YouTube)$/, " - YouTube"))
        //let transratedTitle = (eleget0('//h1[@class=\"title style-scope ytd-video-primary-info-renderer\"]/yt-formatted-string/font/font|//div[@id=\"title\" and contains(@class,\"style-scope ytd-watch-metadata\")]/h1/yt-formatted-string/font/font')?.innerText?.replace(/(?!= - YouTube)$/, " - YouTube"))
        if (kaisuuA == 1 && key != "Shift+A") {
          newurl = newurl.replace(/https:\/\/www\.youtube\.com\/(?:live\/|watch\?v=)/, 'https://youtu.be/')
        } else {
          newurl = newurl.replace('https://youtu.be/', 'https://www.youtube.com/watch?v=')
        }
        newurl = restrictUrlParamSplitter(newurl)
        if (key === "Shift+A") history.pushState(null, null, newurl);
        var cb = ((transratedTitle || document.title) + ret + newurl + ret);
        GM.setClipboard(cb);
        popup(cb)
        kaisuuA = ++kaisuuA % KEY_A_VARIATIONS;
      }
      e.preventDefault();
      return false;
    }
  }, true);

  var latestVideo = elegeta('video').map(e => e.src).toString();

  setInterval(() => {
    if (elegeta('video').map(e => e.src).toString() != latestVideo) { // video要素の.srcたちの変化を監視
      latestVideo = elegeta('video').map(e => e.src).toString();
      checkROAJAlready = 0;
      if (VERBOSE_NOTIFY) vn(latestVideo, "//video変化 : " + elegeta('video').length + "要素 ");
      //      run(wait_pageOpen * 3);
      if (latestVideo.length > 3) run(wait_pageOpen * 3); // src属性の中身があるvideo要素が1つ以上あれば
    }
  }, 1000);

  if (window === parent && location.href.match(/^https:\/\/www\.youtube\.com\/watch/)) run(wait_pageOpen * 2);

  for (let ele of elegeta('//div[@id="player"]/div/div/button[@aria-label="再生"]|//div[@id="player"]/div/div/button[@aria-label="Play"]')) {
    ele.addEventListener('click', () => { setTimeout(run, wait_pageOpen * 2) });
  }

  return;

  function run(delay = 500) {
    if (document?.activeElement?.matches("input") || document?.activeElement?.isContentEditable) { setTimeout(delay => run(delay), delay, delay); return; }
    //verb(elegeta('//video[@class="video-stream html5-main-video"]'))
    verb(elegeta('video.video-stream.html5-main-video'))
    //elegeta('//video').forEach(e => { if (!(e.src)) e.remove() })
    elegeta('video').forEach(e => { if (!(e.src)) e.remove() })
    //let video = elegeta('//video[@class="video-stream html5-main-video"]').slice(-1)[0]; // video要素が複数ある場合があるので最後の１つを取得
    let video = elegeta('video.video-stream.html5-main-video').slice(-1)[0]; // video要素が複数ある場合があるので最後の１つを取得
    if (!video) { verb("まだビデオ要素がありません"); return; }
    if (!video.src) {
      verb("まだビデオ再生が始まっていません");
      setTimeout(() => run(delay), 200);
      return;
    }
    if (!eleget0('div#title > h1 , div[class*="ytp-show-cards-title"] div div a.ytp-title-link.yt-uix-sessionlink')?.innerText) {
      verb("まだタイトルが表示されていません");
      setTimeout(() => run(delay), 200);
      return;
    }
    setTimeout(function() {
      //elegeta('//video').forEach(e => { if (!(e.src)) e.remove() })
      elegeta('video').forEach(e => { if (!(e.src)) e.remove() })
      verb("run");
      var title = eleget0('div#title > h1 , div[class*="ytp-show-cards-title"] div div a.ytp-title-link.yt-uix-sessionlink'); //var title = eleget0('//h1/yt-formatted-string');
      //if (!(location.href.match(/\/embed/)) && (!title || !eleget0('//div[contains(@class,"ytp-right-controls")]/button[@aria-haspopup="true"]|//button[@class="ytp-button ytp-settings-button" and @data-tooltip-target-id="ytp-settings-button"]'))) {
      if (!(location.href.match(/\/embed/)) && (!title || !eleget0('button.ytp-button.ytp-settings-button'))) {
        setTimeout(run, 200);
        verb("title does not exist");
        return;
      }
      if (!ENABLE_EVENJAPANESE && title && ((title?.innerText) || "").match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/)) { verb("タイトルに日本語を含むのでやめます"); return; } // タイトルに日本語あるならやめる
      setTimeout(() => { toJP(), wait_pageOpen });
    }, delay + ((window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1) ? 200 : 0));

  }

  function toJP(f = null) {
    if (document?.activeElement?.matches("input") || document?.activeElement?.isContentEditable) { setTimeout(() => toJP(f), 500, f); return; }
    if (!f && !(location.href.match(ENABLE_EVENEMBED ? /:\/\/www\.youtube\.com\/watch\?|:\/\/www\.youtube\.com\/embed/ : /:\/\/www\.youtube\.com\/watch\?/))) return;
    if (eleget0('//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="true"]|//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="false"]')) { // 押されている字幕ボタンがある？
      elecli(f, '//button[@class="ytp-subtitles-button ytp-button" and @aria-label="字幕（c）" and @aria-pressed="false"]|//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="false"]', 1); // 押されていない字幕ボタンがあるなら押す
      if (eleget0('#dualMarkStyle') && BUGGY_EXPRIMENTAL_FORCE_ENGLISH_WITH_DUALMARK) {
        //elecli(f, '//div[@class="ytp-right-controls"]/button[@aria-label="設定"]|//button[@class="ytp-button ytp-settings-button"]', 2, "close")
        elecli(f, 'div.ytp-right-controls>button[aria-label="設定"] , button.ytp-button.ytp-settings-button', 2, "close")
        elecli(f, '//div[contains(@class,"ytp-menuitem-label")]/div/span[text()="字幕"]', 3, "close")
        elecli(f, '//div[contains(@class,"ytp-menuitem-label") and contains(text(),"英語")]', 4, "close")
        //elecli(f, '//div[contains(@class,"ytp-right-controls")]/button[@aria-haspopup="true" and @aria-expanded="true"]|//button[@class="ytp-button ytp-settings-button" and @data-tooltip-target-id="ytp-settings-button" and @aria-expanded="true"]', 6, "blur");
        elecli(f, 'button.ytp-button.ytp-settings-button[aria-expanded="true"]', 6, "blur");
      } else if (!DO_NOT_SELECT_LANGUAGE) { // && !eleget0('#dualMarkStyle')) {
        verb("字幕を選択します")
        //        elecli(f, '//div[@class="ytp-right-controls"]/button[@aria-label="設定"]|//button[@class="ytp-button ytp-settings-button"]|//div[@class="ytp-right-controls"]/button[@aria-haspopup="true" and @data-tooltip-target-id="ytp-settings-button"]', 2); // 設定ボタン
        elecli(f, 'div.ytp-right-controls>button[aria-label="設定"] , button.ytp-button.ytp-settings-button', 2, "close")
        elecli(f, '//div[@class="ytp-menuitem-label"]/div/span[text()="字幕"]|//div[@class="ytp-menuitem-label"]/div/span[contains(text(),"Subtitles/CC")]|//font[@style="vertical-align: inherit;" and text()="字幕"]|//div[@class="ytp-menuitem"]/div[2]/div/span[text()="Subtitles/CC"]', 3, "close", "smooth");
        elecli(f, '//div[@class="ytp-menuitem-label" and text()="自動翻訳"]|//div[2]/div/div[@class="ytp-menuitem-label" and contains(text(),"Auto-translate")]', 4, "close", "instant");
        elecli(f, '//div[@class="ytp-menuitem-label" and text()="日本語"]|//div[@class="ytp-menuitem-label" and text()="Japanese"]', 5, "close abortDS");
        //elecli(f, '//div[contains(@class,"ytp-right-controls")]/button[@aria-haspopup="true" and @aria-expanded="true"]|//button[@class="ytp-button ytp-settings-button" and @data-tooltip-target-id="ytp-settings-button" and @aria-expanded="true"]', 7, "blur");
        elecli(f, 'button.ytp-button.ytp-settings-button[aria-expanded="true"]', 7, "blur");
      } else { verb(`字幕を選択しません`) }
    }
  }

  function elecli(f, xpath, delay = 0, command = "", beha = null) {
    if (document?.activeElement?.matches("input") || document?.activeElement?.isContentEditable) return;
    ds = ds || isDualsub()
    setTimeout(() => {
      ds = ds || isDualsub()
      verb(`#${delay} : `)
      var title = eleget0('div#title > h1 , div[class*="ytp-show-cards-title"] div div a.ytp-title-link.yt-uix-sessionlink'); //var title = eleget0('//h1/yt-formatted-string');
      //if (!f && (((title?.innerText) || "").match(WORDS_TO_FORCE_DISABLE))) { elecli(1, '//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="true"]'); return }
      verb(`強制オフタイトルにヒット:${WORDS_TO_FORCE_DISABLE} in "${title?.innerText||""}":${!f && WORDS_TO_FORCE_DISABLE.test(title?.innerText || "")}`)
      if (!f && WORDS_TO_FORCE_DISABLE.test(title?.innerText || "")) { elecli(1, '//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="true"]'); return }
      let muted = eleget0('//button[@class="ytp-mute-button ytp-button" and @title="ミュート解除（m）"]');
      verb(`対象:${xpath}\n`, `強制クリックモード:${f}\n`, `ENABLE_WHEN_MUTED=${ENABLE_WHEN_MUTED} , ミュートされている:${muted}\n`, `DISABLE_AUTO_GENERATED_JAPANESE:${DISABLE_AUTO_GENERATED_JAPANESE}\n`, `強制オンタイトルにヒット:${WORDS_TO_FORCE_ENABLE} in "${title?.innerText}":${(WORDS_TO_FORCE_ENABLE.test(title?.innerText || ""))}\n`)
      if (!f && !(ENABLE_WHEN_MUTED && muted) && DISABLE_AUTO_GENERATED_JAPANESE && !WORDS_TO_FORCE_ENABLE.test(title?.innerText || "")) { // 自動翻訳の日本語しかなければ字幕をオフにして終わる
        var str = "";
        for (let am of elegeta('div.ytp-menuitem-label')) { str += am.innerText };
        verbose && delay == 4 && console.log(`■■■div.ytp-menuitem-label : ${str||"NA"}`);
        if ([
            'オフ日本語 (自動生成)自動翻訳',
            `オフ日本語日本語 (自動生成)自動翻訳`,
            `OffJapanese (auto-generated)Auto-translate`,
            `オフ日本語 - Default Track自動翻訳`,
            `オフ日本語自動翻訳`,
            `オフ英語日本語 (自動生成)自動翻訳`,
          ].find(v => str.indexOf(v) != -1)) { // || eleget0('//div[@class="ytp-menuitem-content" and contains(text(),"日本語 (自動生成) >> 英語"):visible')) ) {
          elecli(1, '//button[@class="ytp-subtitles-button ytp-button" and @aria-pressed="true"]');
          verb(`%c言語の選択肢が[${str}]なので字幕をオフにして終わります`, `color:#f00;`);
          return;
        } else {
          if (command.split(" ").includes("abortDS") && ds) { // デュアル字幕
            verb(`%cデュアル字幕があるようなので字幕を選択せず終わります`, `color:#f00;`);
            return;
          }
        }
      }
      var ele = eleget0(xpath);
      verb(`${xpath} ... found : ${(elegeta(xpath).length)}`);
      if (ele) {
        for (let ele of elegeta(xpath)) {
          if (command.split(" ").includes("focus")) {
            ele.focus({ preventScroll: true });
            verb("...focused")
          } else {
            ele.click();
            verb("...clicked")
            if (window != parent && beha) {
              //let foc = eleget0('//div[@id="movie_player"]|//div[@id="player"]');
              //if (foc) foc.scrollIntoView({ behavior: beha, block: "center", inline: "center" });
            }
          }
        }
      } else {
        if (command.split(" ").includes("close")) { // `button.ytp-button.ytp-settings-button[aria-expanded="true"]` //2025.11
          //elecli(f, '//div[contains(@class,"ytp-right-controls")]/button[@aria-haspopup="true" and @aria-expanded="true"]|//button[@class="ytp-button ytp-settings-button" and @data-tooltip-target-id="ytp-settings-button" and @aria-expanded="true"]'); // 歯車がオープンの状態の歯車
          elecli(f, 'button.ytp-button.ytp-settings-button[aria-expanded="true"]'); // 歯車がオープンの状態の歯車
          verb("なかったので中断します");
        }
      }
      if (command.split(" ").includes("blur")) elecli(f, '//div[@id="movie_player"]|//div[@id="player"]/div/div/video', 0, "focus");
    }, delay * WAIT_EACHACTION * (ds ? 2 : 1));
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
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
      //if (/:invscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.top <= document.documentElement.clientHeight) }) // 画面縦内に1ピクセルでも入っている
      else if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function verb() {
    if (verbose) console.log(...arguments);
  }

  function roaj(str) {
    if (CHECK_ROAJ && !checkROAJAlready) {
      alert(str);
      checkROAJAlready = 1;
    }
  }

  function vn(body, title = "") { // verbose notify
    if (VERBOSE_NOTIFY) notify(body, title);
  }

  function notify(body, title = "") {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") new Notification(title, { body: body });
    else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  function popup(text) {
    var e = document.getElementById("cccbox");
    if (e) { e.remove(); }
    if (mllID) { clearTimeout(mllID); }
    if (!text > "") return
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    var ele = document.body.appendChild(document.createElement("span"));
    let bgcolor = /www\.translatetheweb\.com|\.translate\.goog\/|translate\.google\.com/gmi.test(location.href) ? "#d06050" : "#333";
    ele.innerHTML = '<span id="cccbox" style="all:initial; position: fixed; right:0em; top:0em; z-index:2147483647; opacity:1; word-break:break-all; font-size:15px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:none; padding:1px 6px 1px 6px; border-radius:12px; background-color:' + bgcolor + '; color:white; ">' + text + '</span>';
    mllID = setTimeout(function() { var ele = document.getElementById("cccbox"); if (ele) ele.remove(); }, 4000);
  }

  function aToCopyUrl() {
    var kaisuu = 0
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || (inYOUTUBE && (e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;

      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if ((key === "a" || key === "Shift+A") && location.href.indexOf("//www.nicovideo.jp/watch/") != -1) {
        var ctimeEle = eleget0('video');
        if (ctimeEle) {
          var ctime = Math.floor(ctimeEle.currentTime);
          var ret = (navigator.platform.indexOf("Win") != -1) ? "\r\n" : "\n";
          let newurl = ((kaisuu == 0 || key === "Shift+A") ? "https://www.nicovideo.jp/watch/" : "https://nico.ms/") + location.href.match0(/\/watch\/([^/?]+)/) + (ctime > 0 ? ("?from=" + ctime) : "");
          if (key === "Shift+A") history.pushState(null, null, newurl);
          var cb = document.title + ret + newurl + ret;
          GM.setClipboard(cb);
          popup(cb)
          kaisuu = ++kaisuu % KEY_A_VARIATIONS
        }
        e.preventDefault();
        return false;
      }
    }, true);
  }

  function nicolive() {
    if (NICOLIVE_EXPAND_COMMENT_LIST) {
      setSlider(eleget0('body'), 384, 1700, 384, "コメント欄の幅を調整:***px", "CommentListWidth", (rangee) => {
        let main = eleget0('//div[contains(@class,"___player-section___")]')
        let fullsc = eleget0('//button[@aria-label="フルスクリーン解除"]') ? null : "95%";
        if (main) {
          main.style.width = fullsc
          main.style.maxWidth = fullsc
        }
        var commentWidth = rangee; //.value; //1200; //yohakuX-videoWidth
        elegeta('div[class*=___player-status-panel___]').forEach(e => e.style.width = `${commentWidth}px`)
        elegeta('div[class*=___table___]').forEach(e => e.style.width = `${commentWidth}px`);
        elegeta('span[class*=___table-cell___]').forEach(e => e.style.width = `${commentWidth}px`);
      }, 2000, `style="z-index:1; position:fixed; right:1em; top:3em;" `)
    }
  }

  // intervalが1以上かつ設定値がdefValueと違っていればintervalミリ秒事に再処理、そうでなければ割り込みはせず、初回の実行もしない
  function setSlider(placeEle, min = 0, max = 100, defValue = 0, title = "", key = "SliderValue", onchangecallback, interval = 0, addProperty = "") {
    if (placeEle) {
      let val = pref(key) || defValue;
      placeEle.insertAdjacentHTML("afterend", `<input type="range" id="setSlider${key}" min="${min}" max="${max}" value="${val}" ${addProperty} title="${title.replace("***",val)}\n右クリック：デフォルトに戻す" oninput="this.title='${title}'.replace('***',this.value);" oncontextmenu="this.value='${defValue}'; this.dispatchEvent(new Event('input')); return false;">`)

      let adjustFunc = function(key, interval = 0, defValue = 0, onchange = 0) {
        let sliderEle = eleget0(`#setSlider${key}`)
        let sliderEleNum = Number(sliderEle.value)
        onchangecallback(sliderEleNum)
        if (onchange) pref(key, sliderEleNum)
        if (interval && sliderEleNum != defValue) setTimeout(() => { adjustFunc(key, interval, defValue) }, interval)
      }

      let sliderEle = eleget0(`#setSlider${key}`)
      if (sliderEle) {
        sliderEle.addEventListener('input', () => adjustFunc(key, interval, defValue, 1));
        if (Number(sliderEle.value) != defValue) adjustFunc(key, interval, defValue)
      }
    }
  }

  function pref(name, store = null) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    if (store === null) { // 読み出し
      let data = GM_getValue(name);
      if (data == undefined) return null; // 値がない
      if (data.substring(0, 1) === "[" && data.substring(data.length - 1) === "]") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          console.log("データベースがバグってるのでクリアします\n" + e);
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
        console.log("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function restrictUrlParamSplitter(url) {
    return url.replace(/\?/g, "\&").replace(/^([^\?]+?)\&(.*)$/, "$1?$2"); // ?より前に&が出てきたらそれは?にする
  }

})();