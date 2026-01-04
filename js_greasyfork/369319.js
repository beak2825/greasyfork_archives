// ==UserScript==
// @name        Ctrl+CでタイトルとURLをコピー
// @description Shift+C:除去文字列設定　 Shift+T:後回しタイトル設定　(YouTube)Alt+c/Ctrl+x:列挙
// @match       *://*/*
// @version     0.7.17
// @run-at document-idle
// @grant       GM.setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369319/Ctrl%2BC%E3%81%A7%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%A8URL%E3%82%92%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/369319/Ctrl%2BC%E3%81%A7%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%A8URL%E3%82%92%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function() {
  const cleanUrlFirst = 0; // 1:ページ読み込み時にURLのゴミを除去Lv1　2:同Lv2（さらに除去）
  const DISPLAY_TITLE_URL = 0; // 1:Alt+c時にタイトルとURLの詳細をポップアップで表示（推奨）
  const DISPLAY_ENUM = 0; // 1:Alt+c時にタイトルとURLの列挙の詳細をポップアップで表示（推奨）
  const ALTC_VARIATIONS = 2; // Alt+cを複数回押した時ソート条件を何番目まで使うか　1:並べ替えない　2:名前順　3:URL昇順　4:URL降順
  const YOUTUBE_WATCH_CTRLC_URL_VARIATIONS = 3; // YouTube動画視聴画面でCtrl+Cの機能を何番目まで使うか　1:パラメータ除去（推奨）　2:再生リストを残す　3:再生リストを残す＋投稿者名
  const YOUTUBE_GENERATE_PLAYLIST = 0; // 1:YouTube検索結果のAlt+cの最後で画面中の動画を連続再生するURLをコピー （「YouTube検索結果「全てキューに入れて再生」ボタンを追加」の注意事項を熟読）
  let originaltitle = document?.title || "";
  const EXPERIMENTAL_USE_ENGINE3 = 1; // 0;
  const YT_REFERRER = `no-referrer`; // strict-origin

  const ALTC_URLMAX = 50;
  var YOUTUBE_SEARCH_ALTC_USE_PLAYLIST_URL = lh(/:\/\/(www\.)?(youtube|youtu\.be)\.com/) && YOUTUBE_GENERATE_PLAYLIST
  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  if (window != parent) return;
  var mllID;
  var sakujoRE = pref("ctrlcsakujoRE") || "";
  var kaisuu = 0,
    kaisuu3 = 0;
  var sakujoTitleRE = pref("ctrlcsakujoTitleRE") || "";
  var ret = (navigator.platform.indexOf("Win") != -1) ? "\r\n" : "\n";

  const VARIATIONS = ALTC_VARIATIONS + YOUTUBE_SEARCH_ALTC_USE_PLAYLIST_URL
  const ALTC_SITES = [/seiga\.nicovideo\.jp\/my\/manga\/favorite/,
    /webcomics\.jp\/mylist/,
    /webcomics\.jp\/$/,
    /webcomics.jp\/total$/,
    /webcomics\.jp\/bookmark/,
    /webcomics\.jp\/ranking/,
    /www.nicovideo.jp\/my\/watchlater/,
    /www\.nicovideo\.jp\/my\/mylist/,
    /seiga\.nicovideo\.jp\/my\/clip/,
    /www\.nicovideo\.jp\/my\/fav\//,
    /www\.nicovideo\.jp\/my\/channel/,
    /www\.nicovideo\.jp\/my\/community/,
    /www\.nicovideo\.jp\/my\/top\/all/,
    /https:\/\/www\.nicovideo\.jp\/my/,
    /\/\/www\.nicovideo\.jp\/my\/\?ref=pc_mypage_menu/,
    /\/\/www\.nicovideo\.jp\/my\/$/,
    /https:\/\/www\.nicovideo\.jp\/my\/nicorepo\//,
    /https:\/\/www\.nicovideo\.jp\/user\//,
    /\/\/.*\.5ch\.net\/\w*\/$/,
    /twicomi\.com\/author\//,
    /youtube\.com\/$/,
    /youtube\.com\/(?:channel\/|c\/|user\/|@)[^/]+\/(?:videos|shorts|playlist|streams)/,
    /youtube\.com\/playlist/,
    ///^https:\/\/www\.youtube\.com\/@[^\/]+\/search\?query=/,
    /www\.youtube\.com\/results/,
    ///\/\/www.youtube.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/search\?query=/,
    /\/\/www.youtube.com\/(?:channel\/|c\/|user\/|@)[^\/]+\/search/,
    /https:\/\/www\.nicovideo\.jp\/search\//,
    /\/\/www.nicovideo.jp\/user\/[^/]+\/video/,
    /\/\/www.nicovideo.jp\/my\/watchlater/,
    /\/\/www.nicovideo.jp\/my\/mylist/,
    /\/\/www.nicovideo.jp\/user\/\d+\/mylist\/\d+/,
    /\/\/webcomics\.jp/,
    /search\.bilibili\.com/,
    /\/\/free\.arinco\.org\/mail\//,
    /\/\/www\.suruga-ya\.jp\/cargo\/detail/
  ];

  // e3:: 2025.09
  if (EXPERIMENTAL_USE_ENGINE3) {
    var altc2 = [{
      // Alt+c::ニコ動視聴でhtml 2025.09
      is: () => lh(/https:\/\/www.nicovideo.jp\/(?:my|user)/),
      f: () => {
        let as = elegeta('a:has(div.NC-MediaObject-bodyTitle):visible').map(e => ({ t: eleget0('div.NC-MediaObject-bodyTitle', e)?.textContent, u: e?.href }))
        as = as.map(v => {
          let vid = v.u.match1(/https:\/\/www\.nicovideo\.jp\/watch\/([^?^&]+)/)
          if (vid) {
            v.u = `<div title="${v.t}&#13;&#10;https://www.nicovideo.jp/watch/${vid}"><iframe id="nicoplayer" loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${vid}?persistence=1&oldScript=1&allowProgrammaticFullScreen=1" style="max-width: 100%;" height="181" frameborder="0"></iframe></div>`;
          }
          return v;
        })
        let title = document.title + "\n";
        let text = as.map(v => `${v.u}\n`).join("")
        popup(title + text, "#822")
        copy2cb(text);
        return 1
      },
    }, ];
    document.addEventListener("keydown", async function(e) { //キー入力
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if (/^Alt\+c$|^Ctrl\+x$/.test(key) && (kaisuu3++) % 3 == 2)
        if (altc2.find(v => v.is())?.f()) {
          e.stopImmediatePropagation() + e.preventDefault() + e.stopPropagation();
          return false;
        }
    }, true)
    //if (kaisuu%3==2&&altc2.find(v => v.is())) return
  }

  // e2::
  var altc = [
    /*
      },{
        is: () => lh(``),
        getfunc: n => elegeta('').map(box => { return { title: `${box.textContent}`, url: box?.href, aele: box, } })
      },{
        is: () => lh(``),
        getfunc: n => elegeta('').map(box => { return { title: `${box.textContent}`, url: box?.href, aele: box, } })
      },{
        is: () => lh(``),
        getfunc: n => elegeta('').map(box => { return { title: `${eleget0('',box)?.textContent} - ${eleget0('',box)?.textContent} - ${eleget0('',box)?.textContent}`, url: eleget0('')?.href, aele: box, } })
      },{
        is: () => lh(``),
        getfunc: n => elegeta('').map(box => { return { title: `${eleget0('',box)?.textContent} - ${eleget0('',box)?.textContent} - ${eleget0('',box)?.textContent}`, url: eleget0('')?.href, aele: box, } })
      },{
      */
    {
      is: () => lh(`//www.google.co.jp/search`),
      getfunc: n => elegeta('a:has(h3)').map(box => { return { title: `${eleget0('h3',box)?.textContent}`, url: box?.href, aele: box, } })
    }, {
      is: () => lh(`//xcancel.com/`),
      getfunc: n => elegeta('span.xcanceldate8 > a:visible').map(box => { return { title: `${(box?.innerText||"")?.replace(/\s+/gm," ")?.trim()}`, url: box?.href, aele: box, } }),
    }, {
      is: () => lh(`https://kuragebunch.com/series/`),
      getfunc: n => elegeta('li.page-series-list-item:visible').map(box => { return { title: `${elegeta('h4 , .author:visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()}`, url: eleget0('a', box)?.href, aele: box, } })
    }, {
      is: () => lh(`https://www.sunday-webry.com/series/oneshot`),
      getfunc: n => elegeta('a.webry-series-item-link:visible').map(box => { return { title: `${elegeta('h4.test-series-title.series-title,p.author:visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()}`, url: box?.href, aele: box, } })
    }, {
      is: () => lh(`https://shonenjumpplus.com/series/oneshot`),
      getfunc: n => elegeta('li.series-list-item > a:visible').map(box => { return { title: `${elegeta('h2.series-list-title,h3.series-list-author:visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()}`, url: eleget0('a:visible', box)?.href?.replace(/\?.*|ref=.*/g, ""), aele: box, } })
    }, {
      is: () => lh(`https://www.amazon.co.jp/gp/your-account/order-details`),
      getfunc: n => elegeta('div.a-fixed-left-grid:visible').map(box => { return { title: `${elegeta('div[data-component="itemTitle"] > div.a-row > a , span.a-text-price > span:nth-child(2):visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()}`, url: eleget0('a:visible', box)?.href?.replace(/\?.*|ref=.*/g, "") + "?psc=1", aele: box, } })
    }, {
      is: () => lh(`https://www.amazon.co.jp/gp/css/order-history`),
      getfunc: n => elegeta('ul.a-unordered-list.a-nostyle > div.a-row.a-spacing-top-base > li:visible').map(box => { return { title: `${elegeta('div.yohtmlc-product-title > a:visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()}`, url: eleget0('div.yohtmlc-product-title > a:visible', box)?.href?.replace(/\?.*|ref=.*/g, "") + "?psc=1", aele: box, } })
    }, {
      is: () => lh(`https://www.amazon.co.jp/(?:gp/)?cart`),
      getfunc: n => elegeta('div#sc-active-cart div.a-row.sc-list-item:visible').map(box => { return { title: `${eleget0('span.a-truncate-cut:visible',box)?.innerText||""} ${elegeta('li.sc-product-variation:visible',box)?.map(e=>e?.innerText||"")?.join(" ")?.replace(/\s+/gm," ")?.trim()} ${(eleget0('span > span.a-price[data-a-size="medium_plus"] > span[aria-hidden="true"] , div.sc-badge-price-to-pay:visible',box)?.innerText||"")?.replace(/\s+/gm," ")?.trim()}`, url: eleget0('a.a-link-normal.sc-product-link.sc-product-title.aok-block:visible', box)?.href?.replace(/\?.*|ref=.*/g, "") + "?psc=1", aele: box, } })
    }, {
      is: () => ld(`webcomics\.jp`) && eleget0('div#favpanel'),
      getfunc: n => elegeta('tr.favhisentry:visible').map(box => { const [aut, site] = [eleget0('a.favhisaut', box)?.textContent || "", eleget0('span.favhissite', box)?.textContent || ""]; return { title: `${eleget0('.favhistitle',box)?.textContent||""}${aut?` - ${aut}`:""}${~~((kaisuu%4)/2)?site?` - ${site}`:"":""}`, url: eleget0('a.favhishref', box)?.href || "", aele: box, } })
    }, {
      is: () => lh(`https://www.suruga-ya.jp/cargo/detail`),
      getfunc: n => {
        return elegeta('tr.item').map(box => {
          return {
            title: `${box?.innerText?.replace(/\s+|　+/gm, " ")}`?.trim(),
            url: eleget0('p.item_name > a:nth-of-type(1)', box)?.href,
            aele: eleget0('p.item_name > a:nth-of-type(1)', box),
          }
        })
      }
    }, {
      is: () => lh(`https://www.nicovideo.jp/tag/`),
      getfunc: n => elegeta('p.itemTitle > a').map(box => { return { title: `${box.textContent}`, url: box?.href, aele: box, } })
    }, {
      is: () => lh(`https://www.nicovideo.jp/watch/`),
      getfunc: n => elegeta('a.p_base[data-anchor-area="playlist"]').map(box => ({ title: `${eleget0('p[class*="fw_bold"].mb_x0_5[class*="fs_s"]',box)?.textContent}`, url: box.href?.replace(/^([^\?]+).*$/, "$1"), aele: box, })),
    }, {
      is: () => lh(`https://www.netoff.co.jp/`),
      getfunc: n => {
        return elegeta('li.clearfix').map(box => {
          return {
            title: `${et('p[class*="mat"]',box)} ${et('.subinfo',box)} ${et('.price',box)}`?.replace(/\s+|　+/gm, " "),
            url: eleget0('p[class*="mat"] > a', box)?.href,
            aele: eleget0('p[class*="mat"] > a', box),
          }
        })
      }
    }, {
      is: () => lh(`https://www.tiktok.com/`),
      getfunc: n => elegeta('a').filter(e => e?.href?.match(/^https:\/\/www\.tiktok\.com\/[^\/]+\/video\/\d+$/)).map(box => {
        return {
          title: `${box.href?.match0(/https:\/\/www\.tiktok\.com\/([^\/]+\/video\/\d+)/)}`,
          url: box?.href,
          aele: box,
        }
      })
    }, {
      is: () => lh(`https://shonenjumpplus.com/series/oneshot`),
      getfunc: n => elegeta('h2.series-list-title').map(box => { return { title: `${box.textContent}｜${elegetSPt('h3.series-list-author',box)}`, url: box?.href, aele: box, } })
    }, {
      is: () => lh(`https://kuragebunch.com/series/oneshot`),
      getfunc: n => elegeta('div.item-box > div > a.series-data-container > h4').map(box => { return { title: `${box.textContent}｜${elegetSPt('h5',box)}`, url: box?.href, aele: box, } })
      /*  }, {
        is: () => lh(``),
        getfunc: n => elegeta('a').map(box => {
          return {
            title: `${box.textContent?.trim()}`,
            url: box?.href,
            aele: box,
          }
        })*/
    }
  ];

  function elegetSPt(sel, node = document) {
    return elegetSP(sel, node)?.innerText?.replace(/\n/gmi, " ")?.trim() || "";
  }

  function elegetSP(sel, node = document) {
    if (!node) return null;
    do {
      let e = eleget0(sel, node)
      if (e) return e;
      node = node.parentNode;
    } while (node != document.body)
    return null
  }

  String.prototype.tr = function(errorOrigin = "Shift+C") {
    let str = this;
    if (sakujoRE) {
      try {
        str = this.replace(RegExp(sakujoRE, "gm"), "")?.trim()?.replace(/(\s+)$/gm, "")
      } catch (e) { alert(errorOrigin + ":\n文法エラーのようです\n\n設定値:\n" + sakujoRE); }
    }
    return str;
  }
  //  String.prototype.tr = function(errorOrigin = "Shift+C") { return tryReplace(this, sakujoRE, errorOrigin) }

  if (cleanUrlFirst) {
    var cuf = () => { let newurl = modUrl(cleanUrlFirst); if (newurl != location.href) window.history.pushState(null, null, newurl); }
    cuf();
    setTimeout(cuf, 2000)
  }

  // Shift+T ページタイトル部分後回し
  sakujotitle(sakujoTitleRE);

  function sakujotitle(sakujoTitleRE) {
    if (sakujoTitleRE) {
      try {
        var hit = document.title.match(RegExp(sakujoTitleRE, "g"));
        if (hit) document.title = document.title.replace(RegExp(sakujoTitleRE, "g"), "") + " " + hit;
      } catch (e) { alert("Shift+T:\n文法エラーのようです\n\n設定値:\n" + sakujoTitleRE); }
    }
  }
  // 検索ワードをページタイトルの最初に付ける
  addtitle(/^https?:\/\/calil.jp\/local\/search/, "", '//form[@class="search"]/div/input|//input[@id="query"]'); // calil検索
  addtitle(/^https?:\/\/tv\.yahoo\.co\.jp\/search\/\?q=/, "", '//input[@class="generic_inputText floatl"]'); //　yahooテレビ検索
  addtitle(/^https?:\/\/www\.nicovideo\.jp\/mylist_search\//, "", '//input[@id="search_united"]', "", "", " - マイリスト検索 "); //　ニコ動マイリスト検索
  addtitle(/^https?:\/\/www\.jstage\.jst\.go\.jp\/result/, "", '//span[@class="search-parameter"]'); // J-STAGE詳細検索結果
  setTimeout(() => { addtitle(/^https?:\/\/www\.pinterest\.jp\/search\/pins\/.*q=/, "", '//input[@role="combobox"]') }, 2500); // Pinterest詳細検索結果

  if (document.title.indexOf("|") === -1) addtitle(/^https?:\/\/www\.suruga-ya\.jp\/search\?/, "", '//input[@id="searchText"]', '//div[@id="topicPath"]', /駿河屋TOP.≫.|駿河屋TOP/gi); //　駿河屋検索

  document.addEventListener("keydown", async function(e) { //キー入力
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      if (e.shiftKey && !e.altKey && !e.ctrlKey && e.which == 84) { // shift+T ページタイトル部分後回し文字列設定
        var sample = "ありません";
        if (location.href.indexOf("://www.nicovideo.jp") !== -1) sample = "キーワードで動画検索 |キーワードで|」動画|人気の「";
        if (location.href.indexOf("://www.amazon.co.jp") !== -1) sample = "^Amazon(?:\\.co\\.jp)*[\\s\\:：\\|｜-]{0,4}|^カスタマーレビュー(?:\\.co\\.jp)*[\\s\\:：\\|｜-]{0,4}"; //"Amazon.co.jp\s?: |Amazon.co.jp： |Amazon \|\s|Amazon｜|Amazon.co.jp：カスタマーレビュー: |Amazon - |Amazon.co.jp - ";
        if (location.href.indexOf("auctions.yahoo.co.jp") !== -1) sample = "ヤフオク! -";
        if (location.href.indexOf("kakaku.com/") !== -1) sample = "価格.com - ";
        if (location.href.indexOf("//www.yodobashi.com/") !== -1) sample = "ヨドバシ.com - ";
        if (location.href.indexOf("//www.sukima.me/book/title/") !== -1) sample = "^\\[.*\\]";
        var str = prompt("shift+T:\r\n\"" + document.domain + "\" でページタイトルの中で後ろに移動したい文字列を正規表現で入力してください\r\n\r\nこのサイトでのお薦め設定例：\r\n" + sample + "\r\n\r\n現在値：" + (sakujoTitleRE || "なし") + "\n\n", sakujoTitleRE || "");
        sakujoTitleRE = str === null ? sakujoTitleRE : str;
        if (sakujoTitleRE != "") {
          pref("ctrlcsakujoTitleRE", sakujoTitleRE);
          sakujotitle(sakujoTitleRE);
        } else {
          pref("ctrlcsakujoTitleRE", "");
        }
        return;
      }
      if (key == "Shift+C") { //if (e.shiftKey && !e.altKey && !e.ctrlKey && e.which == 67) { // shift+C 除去文字列設定
        var str = prompt("shift+C:\r\n\"" + document.domain + "\" で Ctrl+C 押下時タイトルやURLや選択文字列から除去したい文字列を正規表現で入力してください\r\n\r\n現在値：" + sakujoRE + "\r\n", sakujoRE);
        sakujoRE = str === null ? sakujoRE : str;
        if (sakujoRE != "") {
          pref("ctrlcsakujoRE", sakujoRE);
        } else {
          pref("ctrlcsakujoRE", "");
        }
        return;
      }
      if (key === "Ctrl+c" || (/^Alt\+c$|^Ctrl\+x$/.test(key) && (ALTC_SITES.some(v => v.test(location.href)) || (altc.find(v => v.is()))))) { // ctrl+c::
        if (window.getSelection() != "") {
          // 選択文字列がある
          var selection = window.getSelection().toString();
          if (sakujoRE) { // 除去文字列があれば除去してコピーも自前（なければブラウザにさせる）
            selection = tryReplace(selection, sakujoRE, "Shift+C");
            if (window.getSelection().toString() !== selection) {
              copy2cb(selection);
              e.preventDefault();
            }
          }
        } else {

          // 選択文字列がない

          var doc = location.href;
          var txt1 = doc;
          var txt2 = txt1;
          var opt = "";
          var idEnum = [];
          var urlmax
          var bgcolor = undefined

          var txt2 = modUrl(2, kaisuu);

          if (/www\.youtube\.com\/embed\//.test(txt1)) txt2 = txt1.replace(/\?.*/, "").replace(/embed\//, "watch?v="); // youtube埋め込みを正規のページに

          var ret = (navigator.platform.indexOf("Win") != -1) ? "\r\n" : "\n";
          //          var title = document.title.replace(/ https?:.*/, "");
          var title = document.title.replace(/ https?:\S*/g, "");

          const notify = (message) => Notification.permission === "granted" ? new Notification(message?.outerHTML || message) : Notification.permission !== "denied" && Notification.requestPermission().then(permission => (permission === "granted" && new Notification(message?.outerHTML || message))) // notify(new Date().toLocaleString("ja-JP")

          // 複数回押した時の追加
          //          let pprele = [...elegeta('.pprcccopy'), eleget0(' span.kangengo') || eleget0('span.a-price.reinventPricePriceToPayMargin > span > span:nth-child(2) , span[class*="a-price"].a-text-price.apexPriceToPay > span[aria-hidden="true"] :visible')].filter(v => v).slice(0, 3); //notify(pprele)
          let pprele = [...elegeta('.pprcccopy'), eleget0(' span.kangengo') || eleget0('span.a-price.reinventPricePriceToPayMargin > span  ,  span[class*="a-price"].a-text-price.apexPriceToPay > span[aria-hidden="true"] :visible')].filter(v => v).slice(0, 3); //notify(pprele)
          //let pprele = elegeta('.pprcccopy').slice(0, 2)
          //          let memos = lh(/\/product\/|\/dp\/|\/gp\/|\/pr\//) ? elegeta('.yhmMyMemo').map(e => " " + e?.textContent?.replace(/\n/gm, " ")).filter(v => !v.match(/^\d\d\d\d\.\d\d\.\d\d$/) && !v.match(/^出荷元/)) : [];
          let memos = lh(/\/product\/|\/dp\/|\/gp\/|\/pr\//) ? elegeta('.yhmMyMemo').map(e => " " + e?.textContent?.replace(/\n/gm, " ")).filter(v => !v.match(/^出荷元/)) : []; // !v.match(/^\s\d\d\d\d\.\d\d\.\d\d$/) &&
          if (kaisuu % 2 && pprele.length) {
            //            title = title.trim() + pprele.map(e => " " + e.innerText?.replace(/（還元後：([\\￥\d,\.]+)）/, "$1")).concat(memos).join(" ")
            title = title.trim() + memos.join("") + (pprele.map(e => " " + e.innerText?.replace(/（還元後：([\\￥\d,\.]+)）/, "$1"))).join(" ")
            bgcolor = "#6080b0"
          }
          if (kaisuu % 2 && lh('https://pubmed.ncbi.nlm.nih.gov/')) {
            title = title.trim() + eleget0('div.article-source > span.cit')?.textContent?.replace(/[\s。]*$/, "")
            bgcolor = "#6080b0"
          }

          if (lh('https://chromewebstore.google.com/detail/') && kaisuu % 2 == 1) {
            bgcolor = "#6080b0";
            title += " - " + elegeta('div.j3zrsd , ul > li.ZbWJPd > div , li.MqICNe:visible').map(v => v.innerText?.replace(/\n/gm, " ") || "").filter(v => !"懸念を報告する 懸念事項を報告".split(" ").includes(v)).slice(0, 11).join(" ")
          }
          if (lh('https://addons.mozilla.org/ja/firefox/addon/') && kaisuu % 2 == 1) {
            bgcolor = "#6080b0";
            title += " - " + elegeta('.MetadataCard,AddonMeta-overallRating,.AddonTitle-author dd.Definition-dd.AddonMoreInfo-version,dd.Definition-dd.AddonMoreInfo-last-updated').map(v => v.innerText?.replace(/\n/gm, " ") || "").filter(v => v != "懸念を報告する").slice(0, 9).join(" ")
          }
          if (lh("2chan.net")) { if (kaisuu % 2 == 1) { bgcolor = "#6080b0"; } else { title = originaltitle; } }
          title = title.tr()
          if (kaisuu % 1 == 0) {
            var txt = title + ret + txt2 + ret;
            var bal = title + "\n" + txt2;
          }
          var sort = "";

          // YouTube動画視聴画面なら
          elegeta("#link4bm").forEach(e => e.remove())
          if (location.href.match(/^https?:\/\/www\.youtube\.com\/watch\?v\=/)) {
            let translatedTitle = eleget0('//h1[@class="style-scope ytd-watch-metadata"]|//h1[@class=\"title style-scope ytd-video-primary-info-renderer\"]/yt-formatted-string/font/font|//div[@id=\"title\" and contains(@class,\"style-scope ytd-watch-metadata\")]/h1/yt-formatted-string/font/font')?.innerText || document?.title
            if (!translatedTitle.match(/ - YouTube$/)) translatedTitle += " - YouTube"
            kaisuu = (kaisuu % YOUTUBE_WATCH_CTRLC_URL_VARIATIONS) + 1;
            if (kaisuu == 2) {
              let cb = (translatedTitle || document.title)?.tr() + ret + deleteParam(["start_radio=", "index="], location.href)
              popup(DISPLAY_TITLE_URL ? cb : "タイトルとURL（パラメータを残す）")
              GM.setClipboard(cb + ret);
              e.preventDefault();
            } else if (kaisuu == 3) {
              eleget0('div#description-inner > ytd-text-inline-expander.style-scope > tp-yt-paper-button#expand.style-scope[role="button"]')?.click();
              await wait();
              let uploader = eleget0('yt-formatted-string#text.style-scope.ytd-channel-name a.yt-simple-endpoint.style-scope.yt-formatted-string:visible')?.textContent || ""
              if (uploader) uploader = ` - ${uploader}`
              let playlist = lh(/\&list=PL|\&list=UULP|\&list=UL01234567890|\&list=ULcxqQ59vzyTk/) && eleget0('yt-formatted-string.title.style-scope.ytd-playlist-panel-renderer.complex-string a.yt-simple-endpoint.style-scope.yt-formatted-string:visible')?.textContent || "";
              if (playlist) playlist = ` - ${playlist}`
              let desc = sani((eleget0('ytd-text-inline-expander#description-inline-expander.style-scope.ytd-watch-metadata')?.innerText || "")?.replace(/\n+|\s+/gm, " ")?.slice(0, 60)?.trim())
              if (desc) desc = ` - ${desc}`
              let cb = (translatedTitle || document.title)?.tr() + `${uploader}${playlist}` + ret + deleteParam(["start_radio=", "index="], location.href);
              popup(DISPLAY_TITLE_URL ? cb : "タイトルと投稿者名とプレイリスト名とURL（パラメータを残す）", "#44a")
              if (kaisuu != 2) $(`<div style="margin-left:4em;font-size:14px;" id="link4bm" title="ブラウザからブックマークを検索する時に便利なようにタイトルに投稿者、プレイリスト名、概要欄の情報を増やしただけのリンクです">ブックマーク用リンク<br><a href="${deleteParam(["start_radio=", "index="], location.href)}">${title}${uploader}${playlist}${desc}</a></div>`).hide(0).insertAfter($('#logo')).show(150).delay(9999).hide(250, function() { $(this).remove() })
              GM.setClipboard(cb + ret);
              e.preventDefault();
            } else {
              let cb = (translatedTitle || document.title)?.tr() + ret + deleteParam(["list=", "t=", "index=", "start_radio="], location.href)
              popup(DISPLAY_TITLE_URL ? cb : "タイトルとURL（パラメータ削除）")
              GM.setClipboard(cb + ret);
              e.preventDefault();
            }
            return false;
          }

          // Alt+c::ニコ動視聴でhtml 2025.09
          if (/^Alt\+c$|^Ctrl\+x$/.test(key) && lh('https://www.nicovideo.jp/watch/')) {
            let vid = location.href.match1(/https:\/\/www\.nicovideo\.jp\/watch\/([^?^&]+)/)
            if (vid) {
              txt = `<a rel="noopener noreferrer" href="https://www.nicovideo.jp/watch/${vid}">${document.title}</a><br><div title="${document.title}&#13;&#10;https://www.nicovideo.jp/watch/${vid}"><iframe id="nicoplayer" loading="lazy" sandbox="allow-scripts allow-same-origin" class="ignoreMe" referrerpolicy="no-referrer" rel="nofollow external noopener noreferrer" allowfullscreen="allowfullscreen" allow="autoplay" src="https://embed.nicovideo.jp/watch/${vid}?persistence=1&amp;oldScript=1&amp;allowProgrammaticFullScreen=1" style="max-width: 100%;" height="181" frameborder="0"></iframe></div>`;
              popup(`${(txt)}`, "#822");
            }
          } else
            // 列挙するタイプのサイトなら
            if (/^Alt\+c$|^Ctrl\+x$/.test(key) && (ALTC_SITES.some(v => v.test(location.href)) || (altc.find(v => v.is())))) { // Alt+c::
              // e1::
              var rekkyo = [
                '//span[@class="VideoMediaObject-bodyTitle"]/../..',
                '//div[@class="title"]/a',
                `div.entry-title>a:first-child`, //'//div[@class="entry-title"]/a[1]',
                '//div[@class="mylistVideo"]/h5/a',
                '//div[@class="illust_box_li cfix"]/div/div[@class="text_ttl"]/a',
                '//div[@class="outer"]/div/h5/a', '//div[@class="outer"]/h5/a',
                '//div[@class="log-target-info"]/a',
                '//div[@class="mylistVideo MylistItem-videoDetail"]/h5/a|//div[@id="mainWrap"]/div[@id="main"]/ul[contains(@class,"itemList")]/li[@class="clearfix"]/dl/dd/p/a',
                '//div[@id="thread-list-box"]/table[@id="thread-list"]/tbody/tr/td/a',

                '//span[@class="NicorepoItem-contentDetailTitle"]', // ニコレポ
                'a#video-title , a.shortsLockupViewModelHostOutsideMetadataEndpoint', // youtube search ,  youtube shorts
                '//a[@id="video-title-link"]', // youtube top
                'h3 > a.yt-simple-endpoint.focus-on-expand.ytd-rich-grid-slim-media > span.style-scope.ytd-rich-grid-slim-media , a.ShortsLockupViewModelHostEndpoint.ShortsLockupViewModelHostOutsideMetadataEndpoint', //'//span[@id="video-title"]', // '//div[@id="details"]/a/h3/span[@id="video-title"]', // youtube channel/shorts
                //'a.shortsLockupViewModelHostOutsideMetadataEndpoint', //
                '//a[@class="manga-image"]', // twicomi
                'p.itemTitle > a[target="_blank"]', // ニコ動検索
                '//h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"]', // ニコ動user,あとでみる動画
                '//h3[@class="bili-video-card__info--tit"]', // bilibili search
                '//ul[@class="itemlist clear stage m0"]/li/a', // arinco
                '//p[@class="item_name"]/a[1]', // 駿河屋カート
                `div.TimelineItem-contentTitle`, // ニコ動フォロー新着
                `a.fw_bold.lc_2[class*="mb_x0_5"][class*="groupHover:text-layer_accentAzure"].fs_l:nth-child(1)`, // ニコ動タグ検索時　2025.09
              ];
              txt = "";
              txt2 = "";
              var num = 0;
              var youtubeContPlay = YOUTUBE_SEARCH_ALTC_USE_PLAYLIST_URL && (kaisuu % (VARIATIONS)) == VARIATIONS - 1 && lh(/youtube\.com/)

              let rekkyo2 = altc?.find(v => v.is())?.getfunc() || [];
              rekkyo2 = rekkyo2?.filter(v => v?.aele?.offsetHeight)?.map(v => {
                let cEle = v?.aele?.cloneNode(true)
                cEle.innerTextZ2 = v.title;
                cEle.href = v.url;
                return cEle;
              });

              //            var ele = [...rekkyo2.map(v => v?.aele), ...[...new Set(rekkyo.reduce((a, b) => a.concat(elegeta(b + ":visible")), []).flat())]];
              var ele = [...rekkyo2];
              if (!ele?.length) ele = [...new Set(rekkyo.reduce((a, b) => a.concat(elegeta(b + ":visible")), []).flat())];

              if (lh("youtube.com/playlist")) ele = ele.filter(e => !eleget0('//div/h2/span[@class="style-scope ytd-shelf-renderer" and contains(text(),"おすすめのプレイリスト")]', e.closest(`ytd-item-section-renderer`))) // プレイリスト画面の下に出るおすすめプレイリストを除外

              ele.forEach((a, i) => {
                if (!a.href) { // ニコ動マイリストだけの取り込み方（名前順ソート不可
                  a.innerTextZ = a.innerTextZ2 || a.innerText.replace(/\n/gm, " ")
                  a.href = a.closest("a").href;
                } else if (location.href.match(/\/\/twicomi\.com/)) { // twicomiだけの取り込み方
                  let titleEle = eleget0('.//div[@class="tweet-text"]|.//div[@class="tweet-data"]', a.parentNode.parentNode.parentNode)
                  if (titleEle && titleEle.textContent) a.innerTextZ = titleEle.textContent.replace(/\n/gm, " ")?.trim() || "";
                } else {
                  a.innerTextZ = a.innerTextZ2 || a.innerText?.trim();
                }
              })

              ele = ele.reduce((a, v) => { if (!a.some((e) => (e.href === v.href && e.innerTextZ === v.innerTextZ))) { a.push(v); } return a; }, []); // uniq

              if (!youtubeContPlay) {
                if (kaisuu % VARIATIONS == 1) {
                  sort = " 名前↓"; // ヤフオクのAキーと結果が違うのは向こうはソートにショート動画を含めず（画面が崩れるので）、こちらは含めるから
                  ele.sort(function(a, b) { return new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare(a.innerTextZ, b.innerTextZ) });
                }
                if (kaisuu % VARIATIONS == 2) {
                  sort = " URL↓";
                  ele.sort(function(a, b) { return (a.href.split(/\/\//g)[1]) > (b.href.split(/\/\//g)[1]) ? 1 : -1; });
                }
                if (kaisuu % VARIATIONS == 3) {
                  sort = " URL↑";
                  ele.sort(function(a, b) { return (a.href.split(/\/\//g)[1]) < (b.href.split(/\/\//g)[1]) ? 1 : -1; });
                }
              }
              for (let a of ele) {
                if (1 || a.offsetHeight) { // 非表示じゃないやつだけ
                  var cleanurl = a.href.replace(/\?track=.*|\?_topic=.*|\?ref=.*|\&list=.*|\&.+/g, "")
                  if (location.href.match(/\/\/www.nicovideo.jp\/my\//)) { // ニコ動マイリストだけの取り込み方
                    cleanurl = a.href.replace(/\?.*/g, "")
                  }

                  cleanurl = cleanurl.replace(/^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_\-]{11}).*$/, `https://www.youtube.com/watch?v=$1`)
                  var ytID = cleanurl.match0(/^https?\:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_\-]{11})/) || cleanurl?.match0(/^https?\:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_\-]{11})/)
                  if (ytID) {
                    idEnum.push(ytID);
                    a.innerTextZ += ` - YouTube`
                  }

                  if (DISPLAY_ENUM) {
                    txt2 += a.innerTextZ.tr() + ret + cleanurl + ret;
                  }
                  txt += a.innerTextZ.replace(/\n/gm, " ").tr() + ret + cleanurl + ret;
                  num++;
                }
              }
              idEnum = [...new Set(idEnum)]

              // YouTube連続再生URL
              if (youtubeContPlay && location.href.match0("youtube.com")) {
                urlmax = 50;
                var enumText = ``
                for (let u = 0; u < idEnum.length / urlmax; u++) {
                  enumText += `▶ ${u*urlmax+1}/${idEnum.length} ${document.title}\nhttps://www.youtube.com/watch_videos?video_ids=${ (idEnum.slice(u*urlmax, u*urlmax+urlmax).join(",") ) }${ret}`
                }
                num = idEnum.length; //urlmax
              }

              title += " " + num + "件" + sort;
              txt = title + ret + txt;

              rekkyo2.forEach(e => e?.remove())

              // YouTube連続再生URL
              if (youtubeContPlay) {
                sort = ""
                txt = (enumText ? document.title + ret + enumText + ret : "");
                txt2 = (youtubePopupContPlay(idEnum.slice(0, Math.min(idEnum.length, num, urlmax))), enumText)
                txt = txt2
              }

              /*if (ADD_OPEN_MULTIPLE_URL_GUIDE) {
                txt += "\nOpen Multiple URLs - Google 検索\nhttps://www.google.co.jp/search?q=Open%20Multiple%20URLs&lr=lang_ja\n";
                txt2 += `\nOpen Multiple URLs - Google 検索\nhttps://www.google.co.jp/search?q=Open%20Multiple%20URLs&lr=lang_ja\n`;
              }*/
              var bal = `${title}\n${txt2}`
              var mintitle = youtubeContPlay ? `連続再生URL` : "項目の列挙"; //var mintitle = youtubeContPlay ? `連続再生URL(上限${urlmax})` : "項目の列挙"
              if (DISPLAY_TITLE_URL && DISPLAY_ENUM) popup(mintitle + "\n" + bal, bgcolor);
              if (DISPLAY_TITLE_URL && !DISPLAY_ENUM) popup(mintitle + "\n" + title + "\n", bgcolor);
              if (!DISPLAY_TITLE_URL) popup(mintitle + " " + num + "件" + "" + sort + "\n", bgcolor);
            } else {
              if (DISPLAY_TITLE_URL) {
                popup(bal + opt, bgcolor);
              } else {
                popup("タイトルとURL\n" + opt, bgcolor);
              }
            }

          // クリップボードにコピー
          copy2cb(txt);
          e.preventDefault();
        }
        kaisuu++;
        return;
      }
    },
    false);
  return;

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    let flag
    if (!/^\.?\//.test(xpath)) return /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight) : [...node.querySelectorAll(xpath)]
    try {
      var array = [];
      var ele = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      let l = ele.snapshotLength;
      for (var i = 0; i < l; i++) array[i] = ele.snapshotItem(i);
      return /:visible$/.test(xpath) ? array.filter(e => e.offsetHeight) : array;
    } catch (e) { alert(e + ret + xpath + ret + JSON.stringify(node), 1); return []; }
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (!/^\.?\//.test(xpath)) return /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight)[0] ?? null : node.querySelector(xpath.replace(/:visible$/, ""));
    try {
      var ele = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + ret + xpath + ret + JSON.stringify(node)); return null; }
  }

  function et(xpath, node = document) {
    return eleget0(xpath, node)?.innerText?.replace(/\n/gm, " ")?.trim();
  }
  // タイトルに足す
  function addtitle(url, txt1, xpath, optionxpath = "", optionReplaceRE = /$^/, separator = " - ") {
    if (!url.test(location.href)) return;
    var ele = eleget0(xpath);
    if (!ele) return;
    ele = ele.value || ele.innerText;
    var ret = ele.trim() > "" ? ele.trim() + separator : "";
    if (optionxpath && eleget0(optionxpath)) {
      ret += "" + (eleget0(optionxpath).innerText.trim().replace(optionReplaceRE, "")) + " ";
    }
    document.title = ret + document.title;
    return;
  }

  // クリップボードにコピー
  function copy2cb(txt) {
    GM.setClipboard(txt);
  }

  function deleteParam(cutREs, txt1) { //余計なパラメータを除去
    var para = txt1.split(/[&?#]/);
    var txt2 = para[0] + "?";
    var j = 0;
    for (var i = 1; i < para.length; i++) {
      for (let reptxt of cutREs) {
        para[i] = para[i].replace(new RegExp("^" + reptxt + ".*"), "");
      }
      if (para[i] !== "") {
        txt2 += (j++ > 0 ? "&" : "") + para[i];
      }
    }
    return txt2.replace(/\?$/, ""); //行末が?なら削除
  }

  function deleteParam2(nexturl, paras) {
    paras.forEach(v => { nexturl = nexturl.replace(new RegExp(`[\\?\\&]${v}=[^\\?\\&]+`), "") })
    return nexturl.replace(/\?/g, "\&").replace(/^([^\?]+?)\&(.*)$/, "$1?$2"); // ?より前に&が出てきたらそれは?にする
  }


  function modUrl(forceLevel = 2, kaisuu = 0) {
    var txt1 = location.href;
    var txt2 = txt1;

    if (/www\.amazon\.co\.jp|www\.amazon\.com\//.test(txt1)) {
      let psc = txt1.match0(/[\?\&](psc=\d+)/) // 商品サイズ等の選択　これがないとAmazonおすすめのサイズに戻っちゃう
      let smid = txt1.match0(/[\?\&](smid=[A-Z0-9]+)/) // セラーIDの選択　これがないとAmazonおすすめのセラーに戻っちゃう
      let asin = txt1.match0(/\/dp\/product\/([A-Z0-9]{10})/) ||
        txt1.match0(/\/dp\/([A-Z0-9]{10})/) ||
        txt1.match0(/\/ASIN\/([A-Z0-9]{10})/) ||
        txt1.match0(/\/gp\/product\/([A-Z0-9]{10})/) ||
        txt1.match0(/\/gp\/([A-Z0-9]{10})/)
      if (asin) txt2 = `https://${document.domain}/dp/${asin}${smid?`?${smid}`:""}${psc?`?${psc}`:""}`.replace(/\?/g, "\&").replace(/^([^\?]+?)\&(.*)$/, "$1?$2"); // ?より前に&が出てきたらそれは?にする;
    }
    if (/https:\/\/www\.amazon\.co\.jp\/s\?k=/.test(txt1)) {
      txt2 = deleteParam2(txt1, ["__mk_ja_JP", "crid", "sprefix", "ref"])
    }

    //    if (/^https?:\/\/www\.amazon\.co\.jp\/|^https?:\/\/www\.amazon\.com\//.test(txt1) && (txt1.match(/\/dp\/|\/gp\//) )) // Amazonのパラメータ除去
    //        txt2 = deleteParam(["th=", "psc=","__mk_ja_JP=","crid=","dib=","dib_tag=","qid=","sprefix=","sr=","keywords="], txt1).replace(/\/ref=.*/, "");

    /*
        if (/^https?:\/\/www\.amazon\.co\.jp\/|^https?:\/\/www\.amazon\.com\//.test(txt1) && (txt1.indexOf("/dp/product/") != -1)) // Amazonのパラメータ除去
          txt2 = "https://" + document.domain + "/dp/" + txt1.substr(txt1.indexOf("/dp/product/") + 12, 10);
        else if (/^https?:\/\/www\.amazon\.co\.jp\/|^https?:\/\/www\.amazon\.com\//.test(txt1) && (txt1.indexOf("/dp/") != -1)) // Amazonのパラメータ除去
          txt2 = "https://" + document.domain + "/dp/" + txt1.substr(txt1.indexOf("/dp/") + 4, 10);
        if (/^https?:\/\/www\.amazon\.co\.jp\/|^https?:\/\/www\.amazon\.com\//.test(txt1) && (txt1.indexOf("/ASIN/") != -1)) // Amazonのパラメータ除去
          txt2 = "https://www.amazon.co.jp/dp/" + txt1.substr(txt1.indexOf("/ASIN/") + 6, 10);
        if (/^https?:\/\/www\.amazon\.co\.jp\/|^https?:\/\/www\.amazon\.com\//.test(txt1) && (txt1.indexOf("/gp/product/") != -1)) // Amazonのパラメータ除去
          txt2 = "https://www.amazon.co.jp/dp/" + txt1.substr(txt1.indexOf("/gp/product/") + 12, 10);
     */
    if (/^https?:\/\/www\.amazon\.co\.jp\/gp\/customer-reviews\//.test(txt1)) // Amazonのカスタマーレビューのパラメータ除去
      txt2 = deleteParam(["ref=", "ie=", "ASIN="], txt1).replace(/\/ref=.*/, "");
    txt1 = txt1.replace(/(^https?:\/\/www\.amazon\.co\.jp\/)(.*)(product-reviews\/)/, "$1$3");
    if (txt1.match(/^https?:\/\/www\.amazon\.co\.jp\/.*product-reviews\//)) // Amazonのカスタマーレビューのパラメータ除去
      txt2 = deleteParam(["ref=", "ie=", "ASIN="], txt1).replace(/\/ref=.*/, "");

    if (/^https?:\/\/www\.google\.co\.jp\/search\?|^https?:\/\/www\.google\.com\/search\?/.test(txt1)) // google検索結果のパラメータ除去
      txt2 = deleteParam(["ei=", "oq=", "gs_l=", "hl=", "source=", "sa=", "ved=", "biw=", "bih=", "dpr=", "ie=", "oe=", "client=", "aqs=", "sourceid=", "btgG=", "gs_lcp=", "sclient=", "uact=", "iflsig=", "ictx=", "fir=", "vet=", "usg=", "imgrc=", "sca_esv=", "gs_lp=", "sca_upv="], txt1);

    if (/^https?:\/\/books\.google\.co\.jp\/books\?/.test(txt1)) // Googleブックス検索のパラメータ除去
      txt2 = deleteParam(["souce=", "ots=", "sig=", "hl=", "sa=", "ved=", "f=", "lpg=", "dq=", "source=", "f=", "v=", kaisuu % 2 == 0 ? "$^" : "q="], txt1); // q=を残すと検索ワードは残る

    if (/^https?:\/\/www\.ted\.com\/talks/.test(txt1)) // TEDのパラメータ除去
      txt2 = deleteParam(["awesm=", "utm_medium=", "share=", "utm_source=", "utm_campaign=", "utm_content=", "source=", "embed=", "t-", "frm_id=", "device_id=", "fb_action_ids=", "action_type_map=", "action_object_map=", "fb_source=", "fb_action_types", "action_ref_map=", "ref=", "refid=", "_ft_=", "guid="], txt1);

    if (/^https?:\/\/translate\.google\.com\/translate|^https?:\/\/translate\.googleusercontent\.com\/translate_c/.test(txt2)) { // google翻訳のパラメータ除去
      txt2 = (txt2.match(/^https?:\/\/translate\.google\.com\/translate|^https?:\/\/translate\.googleusercontent\.com\/translate_c/)[0] + txt2.match(/[\?&]u=[^&]*/)).replace(/&/, "?");
    }

    if (/^https?:\/\/www\.nicovideo\.jp\//.test(txt1)) {
      txt2 = deleteParam2(txt2, ["ref", "ss_id", "cmnhd_ref", "via", "at", "state"], txt2); // ニコ動のパラメータ除去
      if (forceLevel >= 2) txt2 = deleteParam(["playlist="], txt2); // ニコ動のパラメータ除去
      if (kaisuu % 2 == 0) txt2 = deleteParam(["ss_pos=", "continuous=", "sort=", "order="], txt2); // ニコ動のパラメータ除去
    }

    if (/^https?:\/\/seiga\.nicovideo\.jp\//.test(txt1)) txt2 = deleteParam(["ref=", "cmnhd_ref=", "track="], txt2); // ニコ動のパラメータ除去

    if (/^https?:\/\/www\.ebay\.com\/itm\/.*\?hash=/.test(txt1)) txt2 = txt1.replace(/\?hash=.*$/, ""); // eBayのパラメータ除去
    if (/^https?:\/\/ja.aliexpress.com\/item\/.*?.html\?spm=/.test(txt1)) txt2 = txt1.replace(/\?spm=.*$/, ""); // AliExpressのパラメータ除去
    if (/^https?:\/\/www.mercari.com\/jp\/items\/m51992587701\/\?_s=/.test(txt1)) txt2 = txt1.replace(/\/\?_s=.*$/, ""); // メルカリのパラメータ除去
    if (/^https?:\/\/www.reddit.com\/r\/.*\?sort=confidence/.test(txt1)) txt2 = txt1.replace(/\?sort=confidence/, ""); // redditのパラメータ除去
    if (/^https?:\/\/www.pinterest.jp\/search\/pins\/\?q=/.test(txt1)) txt2 = txt1.replace(/\&rs=typed.*$/, ""); // pinterestのパラメータ除去

    if (/^https:\/\/www\.ebay\.com\/itm\//.test(txt1)) txt2 = txt1.replace(/\?.*$/, ""); // eBayのパラメータ除去
    if (/^https:\/\/onlinelibrary\.wiley\.com\/doi\/full\//.test(txt1)) txt2 = txt1.replace(/\?casa_token=.*$/, ""); // ollのパラメータ除去
    if (/^https:\/\/www\.tiktok\.com\//.test(txt1)) txt2 = txt1.replace(/\?referer_url=.*$/, ""); // tiktokのパラメータ除去
    //if (/^https:\/\/www.uniqlo.com\/jp\/ja\/products\//.test(txt1)) txt2 = txt1.replace(/\?.*$/, ""); // ユニクロオンラインストアのパラメータ除去
    if (/^https?:\/\/www\.youtube\.com\//.test(txt1)) txt2 = deleteParam(["pp=", "bp="], txt2)
    if (/^https?:\/\/sundrug-online\.com\//.test(txt1)) txt2 = deleteParam(["_pos=", "_sid=", "_ss=", "variant="], txt2)
    if (/^https:\/\/www\.yodobashi\.com\//.test(txt1)) txt2 = deleteParam(["utm_medium=", "kad1=", "utm_source=", "utm_term=", "xfr="], txt2)
    if (/^https:\/\/comic-walker\.com\/detail\//.test(txt1)) txt2 = deleteParam(["episodeType="], txt2)
    if (/^https:\/\/manga\.nicovideo\.jp\/comic\//.test(txt1)) txt2 = deleteParam(["track="], txt2)
    if (/^https:\/\/manga\.nicovideo\.jp\/watch\//.test(txt1)) txt2 = deleteParam(["track="], txt2)
    if (/^https:\/\/addons\.mozilla\.org\/\w*?\/firefox\/addon\//.test(txt1)) txt2 = deleteParam(["utm_source=", "utm_content", "utm_medium="], txt2)

    return txt2;
  }

  function tryReplace(str, re, title) {
    if (re) {
      try {
        str = str.replace(RegExp(re, "gm"), "")?.trim()?.replace(/(\s+)$/gm, "")
      } catch (e) { alert(title + ":\n文法エラーのようです\n\n設定値:\n" + re); }
    }
    return str;
  }

  function pref(name, store = undefined) { // pref(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、pref(name)で読み出し
    var domain = (location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] || location.href);
    if (store === undefined) { // 読み出し
      let data = GM_getValue(domain + " ::: " + name)
      if (data == undefined) return store; // 値がないなら終わり
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
      return store;
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

  function popup(text, bgcolor = "#6080ff") {
    eleget0('#cccbox')?.remove();
    //var e = document.getElementById("cccbox");
    //if (e) { e.remove(); }
    mllID && clearTimeout(mllID); //if (mllID) { clearTimeout(mllID); }
    //var ele = document.body.appendChild(document.createElement("span"));
    //ele.className = "ignoreMe"
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    if (/www\.translatetheweb\.com|\.translate\.goog\/|translate\.google\.com|\/embed\//gmi.test(location.href + " " + text)) bgcolor = "#d06050"
    let ele = begin(document.body, `<span id="cccbox" class="ignoreMe" title="クリックでこれを再度コピー" style="all:initial; max-height:100vh; overflow-y:auto; scrollbar-width:thin;  ${text.match(/<br>/gmi)&&text.match(/<br>/gmi).length>5?"max-width:50%;":""} word-break:break-all; position: fixed; right:0em; top:0em; z-index:2147483647; opacity:1; font-size:15px; max-width:50%; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:none; padding:1px 6px 1px 6px; border-radius:12px; background-color:${bgcolor }; color:white; ">${text}</span>`);

    //    addstyle.add(`#cccbox.ignoreMe {all:initial; max-height:100vh; overflow-y:auto; scrollbar-width:thin;  ${text.match(/<br>/gmi)&&text.match(/<br>/gmi).length>5?"max-width:50%;":""} word-break:break-all; position: fixed; right:0em; top:0em; z-index:2147483647; opacity:1; font-size:15px; max-width:50%; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:none; padding:1px 6px 1px 6px; border-radius:12px; background-color:${bgcolor }; color:white; }`)
    //let ele=end( document.body, `<span id="cccbox" class="ignoreMe" title="クリックでこれを再度コピー" >${text}</span>`);
    //mllID = setTimeout(function() { var ele = document.getElementById("cccbox"); if (ele) ele.remove(); }, 5000);
    mllID = setTimeout(ele => ele?.remove(), 5000, ele);
    ele.onclick = () => { var e = document.getElementById("cccbox"); if (e) { e.remove(); } if (mllID) { clearTimeout(mllID); } }
  }

  function youtubePopupContPlay(eles2, indexNo = 0) {
    if (eles2.length == 0) return "";
    let kaisuu = 1
    let indexUrlQP = indexNo > 0 ? `&index=${indexNo}` : "";
    elegeta("#link4bm").forEach(e => e.remove())
    var cb = kaisuu == 2 ? `<iframe referrerpolicy="${YT_REFERRER}" src="https://www.youtube.com/embed/${eles2[0]}?playlist=${ eles2.join(",")}" id="ytplayer" type="text/html" allowfullscreen="" allow="picture-in-picture" width="320" height="180" frameborder="0"></p></iframe>` : "https://www.youtube.com/watch_videos?video_ids=" + eles2.join(",") + indexUrlQP;
    var embedHTML = `<iframe referrerpolicy="${YT_REFERRER}" src="${cb}" id="ytplayer" type="text/html" width=320 height=180 frameborder=0 allowfullscreen>`
    var cb2 = cb
    var cbEsc = (cb2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    var title = `▶ ${indexNo+1}/${eles2.length} ${document.title}`
    popup(kaisuu == 2 ? cb : document.title + ret + cb, "", "right:0em; top:0em;max-width:40%;")
    GM.setClipboard(kaisuu == 2 ? cb : `${document.title}\n${cb2}\n`);
    if (kaisuu != 2) $(`<div style="margin-left:4em;font-size:14px;" id="link4bm">${kaisuu==2?"埋め込み":"ブックマーク"}用リンク（${eles2.length}）<br><a href=${cb}>${title}</a></div>`).hide(0).insertAfter($('#logo')).show(150).delay(9999).hide(250, function() { $(this).remove() })
    return `${title}\n`
  }

  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function wait() {
    async function waitFrame() {
      return new Promise(resolve => requestAnimationFrame(() => { resolve() }));
    }
  }

})();