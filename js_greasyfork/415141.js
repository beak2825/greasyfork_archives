// ==UserScript==
// @name 「Show more」ボタンを自動で押す
// @description Shift+[;]:自動クリックする要素を設定
// @version 0.1.22
// @match *://www.nicovideo.jp/my*
// @match *://www.nicovideo.jp/user/*
// @match *://seiga.nicovideo.jp/seiga/*
// @match *://duckduckgo.com/*
// @match *://www.pixiv.net/*
// @match *://www.youtube.com/*
// @match *://www.youtube.com/watch*
// @match *://pubmed.ncbi.nlm.nih.gov/*
// @match https://www.quora.com/*
// @match https://www.onsen.ag/
// @match *://news.yahoo.co.jp/pickup*
// @match https://news.livedoor.com/topics/detail/*
// @match https://togetter.com/*
// @match *://news.goo.ne.jp/*
// @match *://anond.hatelabo.jp/*
// @match *://detail.chiebukuro.yahoo.co.jp/qa/question_detail/*
// @match https://www.sukima.me/*
// @match *://yanmaga.jp/*
// @match *://jp.quora.com/*
// @match *://my-best.com/*
// @match *://alternativeto.net/*
// @match *://*/*
// @match *://news.yahoo.co.jp/*
// @match *://newsdig.tbs.co.jp/*
// @noframes
// @run-at document-idle
// @grant GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/415141/%E3%80%8CShow%20more%E3%80%8D%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E6%8A%BC%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/415141/%E3%80%8CShow%20more%E3%80%8D%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E6%8A%BC%E3%81%99.meta.js
// ==/UserScript==

(function() {

  const USER_AUTOCLICK_DELAY = 0; // 1～：Shift+[;]で設定した自動クリックをするまでの遅延ミリ秒　例：1500; →1.5秒遅延
  const MAX_TRIAL_MS = 3000; // Shift+;キーでXPathの自動生成にかける最大の時間（ｍｓ）
  const moreButtonIntervalDefault = 1500;
  const SCREEN_HEIGHT_CORRECTION_DEFAULT = window.innerHeight * 0; // 画面外も画面内と判定する縦の画面数　0～2ぐらい
  const DEBUG = 0; // 1:自動で押す要素を可視化

  var clickedalready = new Set();
  var rest = 0;
  let GF = {};
  if (window != parent) return;

  const siteinfo = [{
      url: '//newsdig.tbs.co.jp/',
      moreButton: 'div.article-footer > a.c-button-read',
    }, {
      url: '//news.yahoo.co.jp/',
      moreButton: 'div > a[data-ual-gotocontent="true"][data-cl_cl_index]:visible:text*=記事全文を読む',
      //  func:()=>{let more=eleget0('div > a[data-ual-gotocontent="true"]:visible:text*=記事全文を読む')?.href;if(more)location.href=more; return;},
    }, {
      url: '//alternativeto.net/',
      moreButton: '//button[text()="Show more alternatives"]',
      moreButtonSame: true,
      //    moreButtonInterval: 3000,
    }, {
      url: '//my-best.com/',
      moreButton: '//div[@class="l-margin-12"]/a|//a[contains(text(),"ランキングを全部見る")]',
    }, {
      url: '//jp.quora.com/',
      moreButton: '//div/div[@class="q-text qu-ellipsis qu-whiteSpace--nowrap" and text()="続きを読む"]',
    }, {
      url: '//yanmaga.jp/',
      moreButton: '//div/div/button[@class="mod-episode-more-button"]/span[text()="もっと見る"]',
    }, {
      url: 'https://www.sukima.me/',
      moreButton: '//span[@class="get-more" and text()="もっとみる"]',
      moreButtonInterval: 2500,
      moreButtonSame: 1,
    }, {
      url: '//detail.chiebukuro.yahoo.co.jp/qa/question_detail/',
      moreButton: '//div[text()="その他の回答をもっと見る"]|//button[text()="…続きを読む"]|//div/button[@data-ylk="rsec:ans_re;slk:more"]/divz',
      moreButtonInterval: 500,
    }, {
      url: '//anond.hatelabo.jp/',
      moreButton: '//img[@class="icon" and @src="/images/common/open.gif"]/..',
      moreButtonInterval: 400,
      //GM_addStyle("div.section p{line-height:1}")
    }, {
      url: '//news.goo.ne.jp/',
      moreButton: '//a[@id="topics_1_more"]|//div[last()]/a[text()="続きを読む"]',
    }, {
      url: '//togetter.com/',
      moreButton: 'button.rnd_btn.more_tweets_btn',
    }, {
      url: '//news.livedoor.com/topics/detail/',
      moreButton: '//a[(text()="記事を読む")]',
    }, { //
      url: '//news.yahoo.co.jp/pickup',
      moreButton: '//div/p/a[text()="続きを読む"]',
    }, { //
      url: '//www.onsen.ag',
      moreButton: '//a[@class="load-more-btn"]',
      moreButtonSame: true,
      moreButtonInterval: 1000,
    }, { //
      url: '//pubmed.ncbi',
      moreButton: '//button[@class="load-button next-page"]',
      moreButtonSame: true,
      moreButtonInterval: 1000,
      screenHeightCorrection: 0,
      /*
  }, { // reddit 常にBest順にしない版
    url: '//www.reddit.com/r/',
    moreButton: '//font[contains(text(),"ディスカッション全体を表示")]|.//font[contains(text(),"ディスカッション全体を見る")]|.//button[contains(text(),"View entire discussion")]|.//button[contains(text(),"View Entire Discussion")]',
    moreButtonSame: false,
    moreButtonInterval: 500,
    */
      /*    }, { // reddit 常にBest順にする版
            url: '//www.reddit.com/r/',
            moreButton: '//font[contains(text(),"ディスカッション全体を表示")]|.//font[contains(text(),"ディスカッション全体を見る")]|.//button[contains(text(),"View entire discussion")]|.//button[contains(text(),"View Entire Discussion")]|.//font[text()="ベスト"]|.//span[text()="best"]',
            moreButtonSame: false,
            moreButtonInterval: 500,
      */
      /*
         }, { // サイトがダウン？
          url: '//www.ytplaylist.com',
          moreButton: '//li[@id="search-more-results"]/a',
          moreButtonInterval: 500,
          focusID: 'player'
        }, { // サイトがダウン？
          url: '//musictonic.com/music/',
          moreButton: '',
          focusID: 'player_container',
          optionFunc: 'musictonic'
      */
    }, { //
      url: '//www.nicovideo.jp/my/top|//www.nicovideo.jp/user/|//www.nicovideo.jp/my',
      moreButton: '//div[@class="next-page"]/a|//a[@class="next-page-link timeline-next-link"]|//button[@class="NicorepoTimeline-more"]|//button[@class="ShowMoreList-more"]|//div[@class="NicorepoTimeline"]/button[contains(text(),"さらに表示する")]',
      moreButtonInterval: 1500,
      moreButtonSame: true,
    }, { //
      url: '//seiga.nicovideo.jp/seiga/',
      moreButton: '//a[@id="gif_play_button" and contains(text()," gifアニメを再生")]/span',
      moreButtonInterval: 500,
    }, { //
      url: '//duckduckgo.com/',
      moreButton: '//a[@class="result--more__btn btn btn--full"]',
      moreButtonInterval: 500,
    }, { //
      url: '//www.pixiv.net/',
      moreButton: '//div[text()="すべて見る"]/..',
      //moreButton: '//section/div[last()]/a/div[contains(text(),"すべて見る")]/..',
      moreButtonInterval: 2000,
    }, { //
      url: '//www.quora.com/',
      moreButton: '//div[text()="Continue Reading"]|//font[text()="読み続けてください"]|//font[text()="読み続けて"]|//div[contains(text(),"さらにコメントを見る")]|//div[contains(text(),"View more comments")]',
      moreButtonInterval: 300,
    }, { //
      url: '//www.youtube.com', // youtube::
      abortEach: () => !lh(/\/\/www\.youtube\.com\/watch\?/),
      //requireUrl: /\/\/www\.youtube\.com\/watch\?|\/\/www\.youtube\.com\/results\?/,
      moreButton: () => {
        return !lh(/\/\/www\.youtube\.com\/watch\?|\/\/www\.youtube\.com\/results\?/) ? [] : elegeta(
          'tp-yt-paper-button#expand.ytd-text-inline-expander' + // 概要欄の「…もっと見る」
          ' , tp-yt-paper-button.ytd-expander#more' + // 続きを読む
          ' , button[aria-label*="件の返信"]' +
          ' , button[aria-label*="他の返信を表示"]' +
          ':visible'

          /*'ytd-button-renderer#more-replies button' + // nn件の返信
          ',ytd-continuation-item-renderer.ytd-comment-replies-renderer button' + // 他の返信を表示
          ',tp-yt-paper-button.ytd-expander#more' + // 続きを読む
          ',tp-yt-paper-button#expand.ytd-text-inline-expander' + // 概要欄の「…もっと見る」
          ':visible:inscreen'*/
        );
      }, // コメント全てと概要欄も展開
      moreButtonInterval: 888,
      funcUrlChanged: () => {
        rest = 1;
        clickedalready = new Set();
        setTimeout(() => {
          rest = 0;
          //elegeta('//paper-button[@id="button" and contains(aria-label,"を非表示")]|//yt-formatted-string[@class="style-scope yt-next-continuation" and contains(text(),"を非表示")]|//yt-formatted-string[@class="style-scope ytd-button-renderer" and contains(text(),"を非表示")]|//yt-formatted-string[contains(@class,"style-scope ytd-button-renderer") and contains(text(),"を非表示")]|//yt-formatted-string[@class="style-scope ytd-button-renderer"]/span[contains(text(),"を非表示")]').forEach(e => { e.click(); });
          elegeta('tp-yt-paper-button#expand.ytd-text-inline-expander , tp-yt-paper-button.ytd-expander#more , button[aria-label*="を非表示"]:visible').forEach(e => { e.click(); });
        }, 3000);
      },
      funcNeedToPause: () => { return eleget0('div[class*="ytp-right-controls"]>button[aria-haspopup="true"][aria-expanded="true"] , button.ytp-button.ytp-settings-button[data-tooltip-target-id="ytp-settings-button"][aria-expanded="true"]') }, // true:動画の設定を開いた状態
      //funcNeedToPause: () => { return eleget0('//div[contains(@class,"ytp-right-controls")]/button[@aria-haspopup="true" and @aria-expanded="true"]|//button[@class="ytp-button ytp-settings-button" and @data-tooltip-target-id="ytp-settings-button" and @aria-expanded="true"]') }, // true:動画の設定を開いた状態
    }, { //
      url: '',
      moreButton: '',
      moreButtonInterval: '',
      focusID: '',
      focusInterval: ''

    }, { //
      url: '',
      moreButton: '',
      moreButtonInterval: '',
      focusID: '',
      focusInterval: ''
    }
    /*  }, { //
        url: '', // 対応させるページのURLの正規表現 matchすると有効
        moreButton: '', // クリックさせる要素のXPath
        moreButtonSame: false, // trueなら同じボタンを何度でも押す falseなら1回のみ
        moreButtonInterval: '', // クリックする間隔(ms) 省略時はデフォルト（1500）
        focusID: 0, // trueならmoreButtonをfocusIntervalごとにfocusする
        focusInterval: '', // （focusIDが1のときのみ）moreButtonをfocusする間隔(ms)
        funcUrlChanged: null, // urlが変化した時に実行する関数　SPAで使う
        requireUrl: '', // urlにmatchしないと動作を飛ばす正規表現　youtubeのようなSPAで特定url以外では確実に動作を止めたいサイトでintervalごとに常時チェックしている
        funcNeedToPause: null, // この関数がtrueを返している間はクリックを休む　youtubeで設定操作中に邪魔しないためなどで使用
        screenHeightCorrection: 0, // (px)画面内と判定する縦ピクセル数の補正量　デフォルトより優先使用
        abortEach: null, // intervalごとに実行、trueを返したら動作しない
        delay: 0, // 1-:最初のクリックをするまでの遅延ミリ秒
    */
  ];

  //  var thissite = 0;
  let SITE = siteinfo.find(v => v.url && location.href.match(v.url)) || {}
  /*
    var thissite = null;
    for (var i = 0; i < siteinfo.length; i++) {
      if (siteinfo[i].url == "") continue;
      if (location.href.match(siteinfo[i].url)) {
        thissite = i;
      }
    }

    var SITE = thissite ? siteinfo[thissite] : {};*/

  if (pref("autoClickXP")) {
    SITE.url = (new URL(location.href).hostname)
    if (SITE.moreButton) {
      SITE.usermoreButton = pref("autoClickXP");
      SITE.delay = USER_AUTOCLICK_DELAY;
    } else {
      SITE.moreButton = (pref("autoClickXP"));
      SITE.delay = USER_AUTOCLICK_DELAY;
    }
  }
  if (SITE === {}) return;

  if (SITE.funcUrlChanged) { // URL変化時に実行する関数があれば登録
    var observeUrlHasChangedhref = location.href;
    var observeUrlHasChanged = new MutationObserver(mutations => {
      if (observeUrlHasChangedhref !== location.href) {
        observeUrlHasChangedhref = location.href;
        SITE.funcUrlChanged();
      }
    });
    observeUrlHasChanged.observe(document, { childList: true, subtree: true });
  }

  function updateMoreButton(interval) {
    morebutton = (SITE.usermoreButton ? elegeta(SITE.usermoreButton) : []).concat(typeof SITE.moreButton === "function" ? SITE.moreButton() : elegeta(SITE.moreButton))
    setTimeout(() => { updateMoreButton(interval) }, interval)
  }

  if (SITE.func) SITE.func();
  if (SITE.moreButton) setTimeout(() => { kurikku(SITE.moreButtonInterval ? SITE.moreButtonInterval : moreButtonIntervalDefault) }, SITE.delay ? SITE.delay : 1);
  if (SITE.focusID) setInterval(focusid, SITE.focusInterval ? SITE.focusInterval : moreButtonIntervalDefault);

  function kurikku(interval) {
    clearTimeout(GF?.kurikku)
    if (interval) GF.kurikku = setTimeout(kurikku, interval, interval)
    /*  function kurikku(interval) {
      if (interval) setTimeout(() => { kurikku(interval) }, interval)*/
    if (rest || (SITE?.abortEach && SITE?.abortEach()) || !(location.href.match(SITE.requireUrl))) return;
    if (SITE.funcNeedToPause && SITE.funcNeedToPause()) return;
    morebutton = (SITE.usermoreButton ? elegeta(SITE.usermoreButton) : []).concat(typeof SITE.moreButton === "function" ? SITE.moreButton() : elegeta(SITE.moreButton))
    DEBUG && morebutton.forEach(e => e.style.outline = "3px dotted red")
    if (document?.activeElement?.isContentEditable == true || document?.activeElement?.closest("input")) return;

    for (let ele of morebutton) {
      if (!(clickedalready.has(ele)) && isinscreen(ele)) {
        ele.click();
        if (SITE.moreButtonSame) {} else {
          clickedalready.add(ele); // 一度押した
          break;
        }
        break; // １度に一個しか押さない
      }
    }
  }

  function focusid() {
    if (document.activeElement != document.body && document.activeElement != null && /input|textarea/i.test(document.activeElement.tagName)) return; //入力フォームなら戻る
    if (window.getSelection() != "") return; //選択文字列があるなら戻る
    if (/BODY|A/i.test(document.activeElement.tagName)) {
      var ele = document.getElementById(SITE.focusID);
      if (ele) {
        ele.tabIndex = 0;
        ele.focus();
      }
    }
  }

  function isinscreen(ele) {
    if (!ele) return;
    var eler = ele.getBoundingClientRect();
    return (eler.top > (0 - (SITE.screenHeightCorrection || SCREEN_HEIGHT_CORRECTION_DEFAULT)) && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < (Math.min(window.innerHeight, document.documentElement.clientHeight)) + SCREEN_HEIGHT_CORRECTION_DEFAULT);
  }

  // ---

  const maxLines = 5; // 一度に提案する最大数調整　大きいほど少ない（maxLines/縦解像度）
  const TryMulti = 15; // 一度に生成する試行回数調整　増やすと沢山試す＝遅い代わりに結果が増える
  var excludeRE = "@data|@href=|width|height|@title=|@alt=|@src="; //"@href=|text\\(\\)|@title=|@alt=|@src="; // o,pキーではこれを含むXPath式は除外する 例：/href|text\(\)/ or /\0/
  var requireRE = "";
  var requireHits = 1;
  const CancelStyle = /box-shadow: none;|\@style=\"\"|(\sand\s)\sand\s|\[\]|\sand\s(\])/gmi;
  const cancelrep = "$1$2";

  var mousex = 0;
  var mousey = 0;

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    //if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA' && e.target.getAttribute('contenteditable') != 'true') {
    var ele = document.elementFromPoint(mousex, mousey);
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && e.getModifierState("Shift") && (e.key == "+")) { // Shift+[+]
      e.preventDefault();
      ele.focus()
      var xp = mark("start", ele);
      e.preventDefault();
      return false;
    }
    //  }
  }, false);

  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  // ---

  return;

  function mark(mode, ele = document.elementFromPoint(mousex, mousey)) {
    var ls = pref("autoClickXP") || "";
    var xp0 = getElementXPath0(ele);

    var tmp = eleget0(xp0);

    if (ls.indexOf(xp0) > -1) var teianxp = ls;
    else var teianxp = (ls == "" ? xp0 : (ls + "|." + xp0));
    var xp = promptHE(ls, "『" + (new URL(location.href).hostname || location.href) + "』でオートクリックする場所をXPathで指定してください\n|で区切って記述すると複数をOR指定できます\n\n現在の設定値：\n" + (pref("autoClickXP") || "") + "\n\n今指した要素：\n" + xp0 + "\n\n※空欄にすると削除します", teianxp);
    if (xp === null) return;
    if (xp === "") {
      pref("autoClickXP", null);
      return;
    }
    var ele = eleget0(xp);
    if (ele) {
      ele.click();
      pref("autoClickXP", xp);
    } else {
      alert(xp + "\n" + "要素が見つかりませんでした\n設定は変更しません\n");
      return;
    }

    function str2numMinMax(str, min, max) {
      var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }).replace(/[^-^0-9^\.]/g, ""));
      if (ans > max) ans = max;
      if (ans < min) ans = min;
      return ans;
    }

    function getElementXPath0(ele) {
      //    var path = "";
      var paths = makecontent(0, ele);
      var path = paths[0];
      for (let p of paths) {
        if (p.match(/@class|@id=/)) { path = p; break; }
      }
      //      path = "/" + ele.tagName + (!ele.tagName.match(/html|body/gi) ? "[" + idx + "]" : "") + path;
      return path;
    }

    function makecontent(mode, ele) {
      var retStr = [];
      var maxline = 3000; //window.innerHeight / maxLines;
      var maxtrial = 3000; //maxline * TryMulti * (mode != 9 ? 32 : 3) * (requireRE > "\0" ? 3 : 1) * ((mode == 0 && requireHits == 1) ? 3 : 1);
      var retStrl = 0;
      var sTime = new Date()
      hajime();
      for (var i = 0; new Date() - sTime < MAX_TRIAL_MS && i < maxtrial && retStrl < maxline; i++) {
        var xp = getElementXPath(mode, ele);
        if (xp && !(mode !== 9 && RegExp(excludeRE, "i").test(xp))) {
          retStr.push(xp);
          var retStr = retStr.sort().reduce(function(previous, current) { if (previous[previous.length - 1] !== current) { previous.push(current); } return previous; }, []).sort(function(a, b) { return a.length - b.length < 0 ? -1 : 1; }); // 重複を削除＆ソート
          retStrl = retStr.length;
          if (xp.length < 60 && xp.match(/@class|@id=/)) {
            //console.log(xp);
            i += 600
          }
        }
      }
      owari();
      //console.log("trymax:" + maxtrial + "\nmakemax:" + maxline + "\ntried:" + i + "\nmake:" + retStr.length);
      // 1つは全属性を記述しただけのもの
      if (getAttrOfEle(mode, ele, true)) {
        var path = "//" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + "";
        retStr.push(path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
      }
      // 1つはフルパスを辿っただけのもの
      retStr.push(getElementXPathFullPath(ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));
      // 1つはフルパス全属性を辿っただけのもの
      retStr.push(getElementXPathFullpathAndFullproperty(mode, ele).replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep));

      return retStr;
    }

    function getElementXPath(mode, ele) {
      var path = "";
      var origele = ele;
      for (let i = 0; i == 0 || (ele && ele.nodeType == 1 && Math.random() > 0.5); ele = ele.parentNode, i++) {

        //兄弟番号を調べる
        var ps = getPrevSib(ele);
        var ns = getNextSib(ele);

        var idx = 0;
        var arg = "";
        if (!ns && ps && Math.random() > 0.2) {
          var arg = "[last()]";
        } else
        if (!ps && ns && Math.random() > 0.2) {
          var arg = "[1]";
        } else {
          for (var idx = 1, sib = getPrevSib(ele); sib; sib = getPrevSib(sib)) { idx++; }
        }
        //属性を調べる
        var att = getAttrOfEle(mode, ele);
        if (att) att = "[" + att;
        //背番号かfirst/lastか属性か何も付けないかを32,32,32,4％ずつ
        var rnd = Math.random();
        if ((rnd > 0.68) && arg) var opt = arg;
        else if ((rnd > 0.36) && idx > 1) var opt = "[" + idx + "]";
        else if ((rnd > 0.04) && att) var opt = att;
        else var opt = "";
        path = "/" + ele.tagName.toLowerCase() + (opt) + path;
      }
      if (!path) return "";

      path = "/" + path;
      path = path.replace(CancelStyle, cancelrep).replace(CancelStyle, cancelrep);
      if (requireRE > "" && !(RegExp(requireRE, "i").test(path))) return "";

      let hits = elegeta(path).length; // 検算
      if (hits == 0 || (mode == 8 && hits < 2) || (mode == 0 && requireHits != hits)) return false;
      return path;
    }

    function getAttrOfEle(mode, ele, allFlag = false) {
      if (ele.tagName.match(/html|body/gmi)) return "";
      let attrs = ele.attributes;
      let xp = "";
      let att2 = [];
      for (let att of attrs) {
        if (att.value.length < 100) {
          if (att.name == "class" && Math.random() > 0.9 && !allFlag) {
            att2.push({ name: "contains(@class,", value: "\"" + att.value + "\")" })
          } else {
            att2.push({ name: "@" + att.name + "=", value: "\"" + att.value + "\"" })
          }
        }
      }

      //text
      if (!allFlag) {
        if (Math.random() > (0.7)) {
          if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "text()=", value: "\"" + ele.innerText + "\"" }) }
        } else {
          if (ele.innerText && !ele.innerText.match(/[\r\n]/)) { att2.push({ name: "contains(text(),", value: "\"" + ele.innerText + "\")" }) }
        }
      }

      for (let j = 0; j < att2.length; j++) {
        if ((Math.random() > (allFlag ? 0 : att2[j].name.match(/href/) ? 0.7 : 0.5))) {
          xp += att2[j].name + att2[j].value + " and ";
        }
      }
      xp = xp.replace(/ and $/, "]").replace(/^(.*)\[$/, "$1");
      return xp;
    }

    function getElementXPathFullPath(ele) {
      var path = "";
      for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
        for (var idx = 1, sib = ele.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.nodeType == 1 && sib.tagName == ele.tagName) idx++
        }
        path = "/" + ele.tagName + (!ele.tagName.match(/html|body/gi) ? "[" + idx + "]" : "") + path;
      }
      return path;
    }

    function getElementXPathFullpathAndFullproperty(mode, ele) {
      var path = "";
      for (; ele && ele.nodeType == 1; ele = ele.parentNode) {
        if (getAttrOfEle(mode, ele, true)) { path = "/" + ele.tagName + "[" + getAttrOfEle(mode, ele, true) + path; } else { path = "/" + ele.tagName + path; }
      }
      path = "/" + path;
      return path;
    }

    function str2numMinMax(str, min, max) {
      var ans = Number(str.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }).replace(/[^-^0-9^\.]/g, ""));
      if (ans > max) ans = max;
      if (ans < min) ans = min;
      return ans;
    }

    function eleget1(xpath) {
      if (!xpath) return "Err";
      try { var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null) } catch (err) { return "Err"; }
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : ele;
    }

    function getNextSib(ele) { // 同じタグの弟ノードを走査
      if (!ele.nextElementSibling) return null;
      let orgtag = ele.tagName;
      do {
        ele = ele.nextElementSibling;
        if (!ele) return null;
        if (ele.tagName == orgtag) return ele;
      } while (1)
      return null;
    }

    function getPrevSib(ele) { // 同じタグの兄ノードを走査
      if (!ele.previousElementSibling) return null;
      let orgtag = ele.tagName;
      do {
        ele = ele.previousElementSibling;
        if (!ele) return null;
        if (ele.tagName == orgtag) return ele;
      } while (1)
      return null;
    }

    function proInput(prom, defaultval, min, max = Number.MAX_SAFE_INTEGER) {
      return Math.min(Math.max(
        Number(window.prompt(prom, defaultval).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 65248);
        }).replace(/[^-^0-9^\.]/g, "")), min), max);
    }

    var start_ms;

    function hajime() { start_ms = new Date().getTime(); }

    function owari() {
      var elapsed_ms = new Date().getTime() - start_ms;
      //console.log('処理時間:' + elapsed_ms / 1000 + "秒");
    }

    function promptHE(present, text, shoki) { // prompt with handling esc
      let str = prompt(text, shoki);
      //console.log(str)
      if (str === null) return present;
      else return str;
    }
  }

  function pref(name, store = undefined) { // prefs(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、prefs(name)で読み出し
    //var domain = (location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] || location.href);
    var domain = (new URL(location.href).hostname || location.href);
    if (store === undefined) { // 読み出し
      let data = GM_getValue(domain + " ::: " + name)
      if (data == undefined) return; // 値がないなら終わり
      if (data.substr(0, 1) === "[") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          console.log("データベースがバグってるのでクリアします\n" + e);
          pref(name, []);
          return;
        }
      } else return data;
    }
    if (store === "" || store === [] || store === null) { // 書き込み、削除
      GM_deleteValue(domain + " ::: " + name);
      return;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(domain + " ::: " + name, store);
      return store;
    } else { // 書き込み、配列
      try { GM_setValue(domain + " ::: " + name, JSON.stringify(store)); } catch (e) {
        console.log("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
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
    //if (typeof xpath === "function") return xpath() // !!!
    if (Array.isArray(xpath)) return xpath.map(v => elegeta(v, node)).filter(v => v.length).flat();
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
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    //if (typeof xpath === "function") return xpath() // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

})();