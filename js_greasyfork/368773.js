// ==UserScript==
// @name        Google検索結果に時期指定、再生時間指定、画像サイズ指定、日本語のみボタンを設置する
// @description 画面解像度が高い人向き　ニコ動・ヤフオク・ヨドバシ検索結果にも並べ替えボタンを設置 （実験的：Google検索結果にGoogle NewsやTwitter検索へのRSSリンクを追加）
// @include     *://www.google.tld/search?*
// @include     *://www.nicovideo.jp/search/*
// @include     *://www.nicovideo.jp/tag/*
// @include     *://www.nicovideo.jp/mylist_search/*
// @include     *://www.nicovideo.jp/mylist/*
// @match       https://www.nicovideo.jp/user/*/video*
// @include     *://auctions.yahoo.co.jp/search/*
// @include     *://auctions.yahoo.co.jp/category/list/*
// @match       *://www.ebay.com/sch/*
// @match       *://www.yodobashi.com/*
// @match       https://duckduckgo.com/?*q=*
// @match       https://togetter.com/search?t=q&q=*
// @match https://www.eiyoukeisan.com/calorie/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant GM_addStyle
// @version     0.7.38
// @grant       none
// @run-at document-idle
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/368773/Google%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AB%E6%99%82%E6%9C%9F%E6%8C%87%E5%AE%9A%E3%80%81%E5%86%8D%E7%94%9F%E6%99%82%E9%96%93%E6%8C%87%E5%AE%9A%E3%80%81%E7%94%BB%E5%83%8F%E3%82%B5%E3%82%A4%E3%82%BA%E6%8C%87%E5%AE%9A%E3%80%81%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E3%81%BF%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%A8%AD%E7%BD%AE%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/368773/Google%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AB%E6%99%82%E6%9C%9F%E6%8C%87%E5%AE%9A%E3%80%81%E5%86%8D%E7%94%9F%E6%99%82%E9%96%93%E6%8C%87%E5%AE%9A%E3%80%81%E7%94%BB%E5%83%8F%E3%82%B5%E3%82%A4%E3%82%BA%E6%8C%87%E5%AE%9A%E3%80%81%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E3%81%BF%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%A8%AD%E7%BD%AE%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
  const HIDE_NICONIKOUKOKU = 0; // ニコニ広告を割り込ませない 2025.09
  const CUSTOM_SITES = [
/*
    { name: "AlternativeTo", site: "alternativeto.net", separator: "<br>" },
    { name: "Slant", site: "www.slant.co" },
    { name: "ナゾロジー", site: "nazology.net", separator: "　" },
    { name: "カラパイア", site: "karapaia.com" },
    { name: "Gigazine", site: "gigazine.net -site:gigazine.net/news/*-headline/" },
    { name: "DIME", site: "dime.jp" },
    { name: "lifehacker", site: "www.lifehacker.jp" },
    { name: "保健指導", site: "tokuteikenshin-hokensidou.jp" },
    { name: "らばQ", site: "labaq.com", separator: "　" },
    { name: "BuzzFeed", site: "www.buzzfeed.com" },
    { name: "360", site: "360life.shinyusha.co.jp", separator: "　" },
    { name: "FCG", site: "archive.fcg-r.co.jp", separator: "　" },
    { name: "ラジオライフ", site: "radiolife.com" },
    { name: "Cochrane", site: "www.cochrane.org", place: "#paper" },
    { name: "健康・栄養研究所", site: "www.nibiohn.go.jp/eiken/linkdediet", place: "#paper" },
    { name: "NCC", site: "epi.ncc.go.jp", place: "#paper" },
    { name: "栄養計算", site: "www.eiyoukeisan.com", separator: "　" },
    { name: "", site: "" },
    { name: "", site: "" },
*/
  ]; // name:リンクの表示名　site:絞り込むサイトのURL（,で区切って複数記述可）　separator:前項目との仕切り文字（省略時は｜）　place:リンクを付ける場所(#paper,#vox)（省略時は末尾）　language:"notJP"なら日本語文字使用時は出さない

  var customSites = location.href.match(/google\.|duckduckgo\./) ? setCustomSites(CUSTOM_SITES) : []

  function setCustomSites(sites, mes) {
    var pa = pref("customSites") || [];
    var a = []
    sites.forEach(e => { if (e.name && e.site) { a.push(e) } })
    pa.forEach(e => { if (e.name && e.site) { a.push(e) } })
    var customSitesTemp = a.reduce((a, v) => { if (!a.some((e) => (e.name === v.name || e.site === v.site))) { a.push(v); } return a; }, []); // uniq
    if (customSitesTemp.length && JSON.stringify(pa) !== JSON.stringify(customSitesTemp)) {
      pref("customSites", customSitesTemp);
      alert("カスタムsite:リンクをGM_setValue領域に登録しました\nconst CUSTOM_SITES = […] の中身を削除しても構いません\n\n" + jsb(customSitesTemp) + (mes || ""));
    }
    return customSitesTemp;
  }

  // 使うnitterのインスタンス https://github.com/zedeus/nitter/wiki/Instances
  const NITTER_INSTANCES = ["xcancel.com"]
  const NITTER_INSTANCE = NITTER_INSTANCES[Math.floor(Math.random() * (NITTER_INSTANCES.length))];
  let debug = 0;

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = Array.from(Array(12)).map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
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

  // googleの余計なパラメータ削除
  if (/^https?:\/\/www\.google\.co\.jp\/search\?|^https?:\/\/www\.google\.com\/search\?/.test(location.href)) { // google検索結果のパラメータ除去
    history.pushState(null, "", deleteParam(["ei=", "oq=", "gs_l=", "hl=", "source=", "sa=", "ved=", "biw=", "bih=", "dpr=", "ie=", "oe=", "client=", "aqs=", "sourceid=", "btgG=", "gs_lcp=", "sclient=", "uact=", "iflsig=", "ictx=", "fir=", "vet=", "usg=", "imgrc=", "sca_esv=", "gs_lp=", "sca_upv="], location.href));
  }

  function deleteParam(cutREs, txt1) { //余計なパラメータを除去
    var para = txt1.split(/[&?#]/);
    var txt2 = para[0] + "?";
    var j = 0;
    for (var i = 1; i < para.length; i++) {
      for (let reptxt of cutREs) para[i] = para[i].replace(new RegExp("^" + reptxt + ".*"), "");
      if (para[i] !== "") txt2 += (j++ > 0 ? "&" : "") + para[i];
    }
    return txt2.replace(/\?$/, ""); //行末が?なら削除
  }

  //if (lh('https://www.google.co.jp/search')) { // PDFを青く
  if (lh(/https:\/\/www\.google\.[a-z\.]+\/search/)) { // PDFを青く
    GM_addStyle('.MUFPAc{margin-left:1em !important;}') //
    GM_addStyle('.aNq8jd{margin-left:0em !important;}') //
    //    GM_addStyle('.srp { --center-width: 368px;}') // 真ん中の「すべてのフィルタ ツール」を左に寄せる
    GM_addStyle('.UqcIvb { margin: 0 8px; }') // 丸いボタンをちょっと幅狭く
    waitAndDo(e => eleget0('div.IUOThf') && eleget0('div#uddia_1.sKb6pb'), () => eleget0('div.IUOThf')?.insertAdjacentElement("beforeend", eleget0('div#uddia_1.sKb6pb'))) //真ん中の「すべてのフィルタ ツール」を左の箱に入れる
    function waitAndDo(checkFunc, func) { // checkFuncがtrueになったらfuncを実行
      let ret = checkFunc();
      if (!ret) { setTimeout(waitAndDo, 333, checkFunc, func) } else { func(ret) }
    }
    //GM_addStyle('.TrmO7{flex:initial !important;}') //角丸の真ん中のあき
    GM_addStyle('[role="navigation"]{padding-left:1em !important; margin-left:0em !important;}') //
    GM_addStyle('.eTnfyc{text-align:initial !important;}') //角丸のツールが右すぎる
    GM_addStyle(`.pdffile{margin-left:0.5em !important; border: 1px solid #dadce0; border-radius: 2px; padding: 0px 4px; display: inline-block; height: 14px; line-height: 16px; color: #4d5156; font-size: 10px; letter-spacing: 0.75px; vertical-align: middle; outline:1px solid #99f; background-color:#f0f8ff; margin: 0 2px 3px 2px;font-family: arial,sans-serif;font-weight: 400;}`)
    GM_addStyle(`div.NDnoQ.P3mIxe{max-width: 40vw;}`) // 2025.01 長すぎる検索フォームを縮める
    GM_addStyle(`*[data-st-cnt="mode"]{flex:none !important;}`) // 2025.01 「ツール」だけ右に出るのでその親のflexを解除
    GM_addStyle(`.rQTE8b{display:inline-flex !important;}`) // 2025.01 「ツール」だけ右に出るのでその親のflexを解除
    GM_addStyle(`.NDnoQ { justify-content: flex-start !important;}`) // 2025.01 「画像」「動画」の親のflexを変えてログインボタン等が右に出るのを防ぐ
    GM_addStyle(`.tsf { flex-grow: 0; max-width: 30vw !important;}`) // 2025.01 「画像」「動画」で長すぎる検索フォームを縮める
    GM_addStyle(`.qogDvd { justify-content: flex-start; padding-left: 0 !important;}`) // 2025.01 「画像」でタブ行全体を左寄せ
    //GM_addStyle(`.A8SBwf { width:20vw !important;}`) // 2025.01 長すぎる検索フォームを縮める
    GM_addStyle(`[role="navigation"] { transform: translate(-5em,0); }`) // 2025.08 タブ行全体を左寄せ

    //mof(n => {
    //document.addEventListener("AutoPagerize_DOMNodeInserted",e=>{
    autoPagerized(e => {
      eaFirst('cite span:text*=› _pdf').forEach(e => e.insertAdjacentHTML("afterend", `　<span class="pdffile">PDF</span>`))
      eaFirst('//div/div[last()]/span[text()="PDF"]').forEach(e => e.classList.add('pdffile'))
    })
  }

  function eaFirst(css, node = document) { // ２回目以降の重複は無視する
    if (!eaFirst?.done) eaFirst.done = new Map()
    let es = elegeta(css, node)
    let late = eaFirst?.done?.get(css) ?? new Set()
    es = es.filter(e => !late.has(e))
    eaFirst?.done.set(css, new Set([...es, ...late]))
    return es;
  }
  /*
    function mof(cb, node = document.body) {
      cb(document.body)
      const observe = new MutationObserver(m => {
        m.forEach(({ addedNodes }) => addedNodes.length && cb(Array.from(addedNodes).filter(e => e.nodeType === Node.ELEMENT_NODE)));
      });
      observe.observe(node, { childList: true, subtree: true });
      return () => observe.disconnect();
    }
  */
  if (location.href.indexOf('https://togetter.com/search?t=q&q=') !== -1) {
    addLink("togetter", '//div[@class="search_input_box"]', "none", "　", "関連度高", "", /\&sort=.*/, "&sort=relation");
    addLink("togetter", '//div[@class="search_input_box"]', "none", "　", "ビュー多", "", /\&sort=.*/, "&sort=view_count");
    addLink("togetter", '//div[@class="search_input_box"]', "none", "｜", "ビュー少", "", /\&sort=.*/, "&sort=view_count_asc");
    addLink("togetter", '//div[@class="search_input_box"]', "none", "　", "新しい", "", /\&sort=.*/, "&sort=created_at");
    addLink("togetter", '//div[@class="search_input_box"]', "none", "｜", "古い", "", /\&sort=.*/, "&sort=created_at_asc");
    return;
  }

  var p = eleget0('//button[@aria-label="Google 検索"]|//input[@name="q" and @aria-label="Search"]|//button[@aria-label=\"検索\" and @type=\"submit\"]');
  if (p) {
    var e = document.createElement("div");
    e.id = "gkbPanel";
    e.style = "position:absolute; top:0.2em; left:860px; margin:0 9em 0 0; z-index:999330; line-height:1.3em; display:none;";
    addstyle.add(`#gkbPanel:not([data-moved]){transition:all 0.2s ease; } #gkbPanel[data-moved]{ background-color:#ffff !important; border-radius:8px; padding:15px; transform: translate(-15px,-15px); box-shadow:0 0 1em #0008;}`)
    //addstyle.add(`#gkbPanel[data-moved]{background-color:#ffff !important; border-radius:8px; padding:15px; transform: translate(-15px,-15px); box-shadow:0 0 1em #0008;}`)
    document.body.appendChild(e);
    dragElement(e, "*", "a")
    e?.addEventListener("dblclick", e => e.target.animate([{ opacity: 0, transform: window.getComputedStyle(e.target).transform?.replace(/^none$/, "") + " scale(0.66)" }], { duration: 333, easing: "ease" }).onfinish = function(e) { this?.effect?.target?.remove() })

    setInterval(() => resizeWindow(), 999)
    window.addEventListener('resize', resizeWindow);

    function resizeWindow() {
      let e = eleget0('#gkbPanel')
      if (!e || e?.dataset?.moved) return;
      let eright = clientWidth() //eleRightX([`div.gbZSUe,g-dropdown-button.fFI3rb.NkCsjc,div.c58wS,div.gb_vd.gb_9a.gb_kd:visible`])
      let eleft = eleLeftX([ //`.GKS7s`, // サジェストみたいなやつ 右端まで並んだりするからないほうがいいかも
        `[aria-controls="hdtbMenus"][role="button"]`, `form[role="search"]>div>div,div.BaegVc.ePSouf,div#_M4MKZcKTH97l2roPrJip4AQ_25.aNq8jd:visible`, //角丸
        `form[role="search"]>div>div,div.RNNXgb,form#sf.wQnou,div#hdtb-msb.IC1Ck:visible` //無地＋アイコン //div.IUOThf,
        , `div.gb_y , div.gb_C , div.c58wS:visible`, // 2025.01 歯車、ログインボタン , `div.Q3DXx.Efnghe:visible`, // 2025.01 歯車、ログインボタン
        `div.Q3DXx.Efnghe`, // 2025.02 ログインボタン等
      ]) || 900;

      function eleLeftX(xpath) {
        return xpath.reduce((r, v) => Math.max(r, (elegeta(v)?.reduce((r, v) => Math.max(r, v?.getBoundingClientRect()?.right), 0) || 0)), 0) || 0;
      }

      function eleRightX(xpath) {
        return xpath.reduce((r, v) => Math.min(r, (elegeta(v)?.reduce((r, v) => Math.min(r, v?.getBoundingClientRect()?.left), clientWidth()) || clientWidth())), clientWidth()) || clientWidth();
      }

      e = document.getElementById("gkbPanel")
      e.style.left = eleft + 8 + "px"
      //document.title=`${eright} ${eleft}`
      e.style.minWidth = eright - eleft - 24 + "px"; //e.style.maxWidth = eright - eleft - 8 - 8 + "px"
      e.style.display = "block"
    }
    addLink("google", "//div[@id='gkbPanel']", "none", "", "全て", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*|.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|&lr=lang_en|&lr=lang_ja/, "");
    addLink("google", "//div[@id='gkbPanel']", "", "", "1時間以内", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:h1");
    addLink("google", "//div[@id='gkbPanel']", "", "", "24時間以内", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:d1");
    addLink("google", "//div[@id='gkbPanel']", "", "", "1週間以内", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:w1");
    addLink("google", "//div[@id='gkbPanel']", "", "", "1ヶ月以内", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:m1");
    //    addLink("google", "//div[@id='gkbPanel']", "", "", "1年以内", "<DIV></DIV>", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y1");
    addLink("google", "//div[@id='gkbPanel']", "", "", "1年以内", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y1");
    addLink("google", "//div[@id='gkbPanel']", "", "", "2年", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y2");
    addLink("google", "//div[@id='gkbPanel']", "", "", "3年", "<DIV></DIV>", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y3");
    //addLink("google", "//div[@id='gkbPanel']", "", "", "4年", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y4");
    //addLink("google", "//div[@id='gkbPanel']", "", "", "5年", "<DIV></DIV>", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "&tbs=qdr:y5");

    addLink("google", "//div[@id='gkbPanel']", "&tbm=vid", "", "動画", "｜", /&tbs=qdr(%3A|:)[hdwmy]\d*/, "");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=vid", "", "4分未満", "｜", /&tbs=dur:[sml]/, "&tbs=dur:s");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=vid", "", "4～20分", "｜", /&tbs=dur:[sml]/, "&tbs=dur:m");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=vid", "", "20分以上", "　<span id='gkbPanelVideo'><span>", /&tbs=dur:[sml]/, "&tbs=dur:l");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "YouTube", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.youtube.com/results?search_query=***");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "ニコニコ動画", "　<DIV></DIV>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.nicovideo.jp/search/***?sort=f&order=d");

    addLink("google", "//div[@id='gkbPanel']", "&tbm=isch", "", "画像", "｜", /&tbs=isz:[iml]/, "");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=isch", "", "アイコンサイズ", "｜", /&tbs=isz:[iml]/, "&tbs=isz:i");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=isch", "", "中", "｜", /&tbs=isz:[iml]/, "&tbs=isz:m");
    addLink("google", "//div[@id='gkbPanel']", "&tbm=isch", "", "大", "｜", /&tbs=isz:[iml]/, "&tbs=isz:l");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Pinterest", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.pinterest.jp/search/pins/?q=***&rs=typed");
    //addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "twitter", "　<span id='gkbPanelImage'><span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://twitter.com/search?q=***%20(filter:images OR filter:videos)&src=typd&f=live&vertical=default");
    //addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Nitter", "　<span id='gkbPanelImage'><span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://nitter.cz/search?f=tweets&q=***%20(filter:images OR filter:videos)&since=&until=&near=");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "twitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://search.yahoo.co.jp/realtime/search?p=***&ei=UTF-8&mtype=image");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Nitter", "　<span id='gkbPanelImage'><span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://xcancel.com/search?f=tweets&q=***%20(filter:images OR filter:videos)&since=&until=&near=");
    addLink("google", "//div[@id='gkbPanel']", "", "", "日本語のみ", "｜", /&lr=lang_en/, "&lr=lang_ja");
    addLink("google", "//div[@id='gkbPanel']", "", "", "英語のみ", "<div></div>", /&lr=lang_ja/, "&lr=lang_en");


    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "<span id='gkbPanelLast' style='position:absolute'></span>", "reddit", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.google.co.jp/search?q=*** site:reddit.com", "notJP");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Quora", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.google.co.jp/search?q=*** site:quora.com", "notJP");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Trends", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://trends.google.co.jp/trends/explore?date=all&q=***");
    addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", "", "twitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://search.yahoo.co.jp/realtime/search?p=***&ei=UTF-8");
    addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", "", "Nitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://xcancel.com/search?f=tweets&q=***&since=&until=&near=");
    addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", "", "Bluesky", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://bsky.app/search?q=***");
    addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", "", "togetter", "<span id='vox'></span>　<span id='gkbPanelSite'></span><span id='gkbPanelRSS'></span><div></div>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://www.google.co.jp/search?q=*** site:togetter.com");
    //addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", "", "はてな", "　<span id='gkbPanelSite'></span><span id='gkbPanelRSS'></span><span id='gkbPanelSiteLF'></span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://www.google.co.jp/search?q=*** site:anond.hatelabo.jp");

    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "PubMed", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.google.co.jp/search?q=*** site:pubmed.ncbi.nlm.nih.gov", "notJP");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Scholar", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://scholar.google.co.jp/scholar?q=***");
    addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "Edu/Gov", "<span id='paper'></span><span id='gkbPanelSiteLF'></span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.google.co.jp/search?q=*** site:ac.jp OR site:go.jp OR site:.gov OR site:.edu", "");
    //addLink2(/www\.google\./, "//div[@id='gkbPanel']", "", "", "LINKdeDIET", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.google.co.jp/search?q=*** site:www.nibiohn.go.jp");

    customSites.forEach((e, i) => {
      addLink2(/^https?:\/\/www\.google\./, e.place || "#gkbPanelSiteLF", "", (e.separator || "｜"), e.name, "", /\ssite:.*/, "https://www.google.co.jp/search?q=*** site:" + e.site.replace(/\,/g, " OR site:"), e.language || null);
    });
    addCSbutton(/^https?:\/\/www\.google\./, "//span[@id='gkbPanelSiteLF']");
  }

  var p = eleget0('input#search_form_input');
  if (p) {
    var e = document.createElement("div");
    e.id = "ddgPanel";
    e.style = "position:absolute;top:0.7em; left:880px; z-index:330; line-height:1.3em;";
    addstyle.add(`#ddgPanel[data-moved]{background-color:#ffff !important; border-radius:8px; padding:15px; transform: translate(-15px,-15px); box-shadow:0 0 1em #0008;}`)
    document.body.appendChild(e);
    dragElement(e, "*", "a")
    e?.addEventListener("dblclick", e => e.target.animate([{ opacity: 0, transform: window.getComputedStyle(e.target).transform?.replace(/^none$/, "") + " scale(0.66)" }], { duration: 333, easing: "ease" }).onfinish = function(e) { this?.effect?.target?.remove() })

    addLink("duckduckgo", "//div[@id='ddgPanel']", "none", "", "全て", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])|.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|\(?site.*/g, "");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "24時間以内", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&df=d");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "1週間以内", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&df=w");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "1ヶ月以内", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&df=m");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "1年以内", "<DIV></DIV>", /(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&df=y");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "動画", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iar=videos&iax=videos&ia=videos");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "短い", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iar=videos&iax=videos&ia=videos&iaf=videoDuration%3Ashort");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "中", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iar=videos&iax=videos&ia=videos&iaf=videoDuration%3Amedium");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "長い", "　<span id='ddgPanelVideo'><span>", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iar=videos&iax=videos&ia=videos&iaf=videoDuration%3Along");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "YouTube", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.youtube.com/results?search_query=***");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "ニコニコ動画", "<DIV></DIV>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.nicovideo.jp/search/***?sort=f&order=d");

    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "画像", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iax=images&ia=images");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "小", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iax=images&ia=images&iaf=size%3ASmall");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "中", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iax=images&ia=images&iaf=size%3AMedium");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "大", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iax=images&ia=images&iaf=size%3ALarge");
    addLink("duckduckgo", "//div[@id='ddgPanel']", "", "", "壁紙", "｜", /(&iaf=.*)|(&iax=.*)|(&iar=.*)|(&ia=.*)|(&df=[hdwmy])/g, "&iax=images&ia=images&iaf=size%3AWallpaper");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Pinterest", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://www.pinterest.jp/search/pins/?q=***&rs=typed");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "twitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://search.yahoo.co.jp/realtime/search?p=***&ei=UTF-8&mtype=image");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Nitter", "　<span id='ddgPanelImage'><span><div></div>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://xcancel.com/search?f=tweets&q=***%20(filter:images OR filter:videos)&since=&until=&near=");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "reddit", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://duckduckgo.com/?q=*** site:reddit.com", "notJP");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Quora", "　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://duckduckgo.com/?q=*** site:quora.com", "notJP");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "PubMed", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://duckduckgo.com/?q=*** site:pubmed.ncbi.nlm.nih.gov", "notJP");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Scholar", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://scholar.google.co.jp/scholar?hl=ja&as_sdt=0%2C5&q=***&btnG=");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Edu/Gov", "<span id='paper'></span>　", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://duckduckgo.com/?q=*** (site:ac.jp OR site:go.jp OR site:.gov)", "");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "twitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://search.yahoo.co.jp/realtime/search?p=***");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Nitter", "｜", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://xcancel.com/search?f=tweets&q=***&since=&until=&near=");
    //    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Bluesky", "　<span id='ddgPanelImage'><span><div></div>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://bsky.app/search?q=***");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "Bluesky", "　<span id='ddgPanelImage'><span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:pubmed\.ncbi\.nlm\.nih\.gov|.site:togetter\.com|.site:.*/, "https://bsky.app/search?q=***");
    addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//div[@id='ddgPanel']", "", "", "togetter", "<span id='vox'></span>　<span id='ddgPanelSite'></span><span id='ddgPanelRSS'><span id='gkbPanelSiteLF'></span>", /.site:reddit\.com|.site:quora\.com|.site:https:\/\/www\.ted\.com\/.*|.site:.*/, "https://duckduckgo.com/?q=*** site:togetter.com");

    customSites.forEach((e, i) => {
      addLink2(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, e.place || "//span[@id='gkbPanelSiteLF']", "", (e.separator || "｜"), e.name, "", /\ssite:.*/, "https://duckduckgo.com/?q=*** site:" + e.site.replace(/\,/g, " OR site:"), e.language || null);
    });
    addCSbutton(/^https:\/\/duckduckgo.com\/.*[\?\&]q=/, "//span[@id='gkbPanelSiteLF']")
  }

  if (lh("https://www.eiyoukeisan.com/calorie/nut_list/"))
    elegeta('tbody>tr:nth-child(n+2)>td:nth-child(1),td.food_name').filter(e => !e.innerText.match(/食品名/) && !e.matches('.under_box')).forEach(e => {
      let text = e.textContent?.trim()
      end(e, `<a class="eiyoukeisanlink" style="float:right;opacity:50%;font-size:90%;margin:1px;text-decoration: none; user-select:none; " title='「${sani(text)}」を www.eiyoukeisan.com/calorie/ 下で検索' href='https://www.google.co.jp/search?btnI=I%27m+Feeling+Lucky&q=${encodeURIComponent(text)} site:https://www.eiyoukeisan.com/calorie/'}'>🔗</a>`)
    })
  if (lh("https://www.eiyoukeisan.com/calorie/gramphoto/"))
    elegeta('//table[@cellspacing="1" and @cellpadding="2"]/tbody/tr/td[@align="left"]').filter(e => !e.innerText.match(/食品名|栄養素/) && !e.matches('.under_box')).forEach(e => {
      let text = e.textContent?.trim()
      end(e, `<a class="eiyoukeisanlink" style="float:right;opacity:50%;font-size:90%;margin:1px;text-decoration: none;user-select:none; " title='「${sani(text)}」を www.eiyoukeisan.com/calorie/ 下で検索' href='https://www.google.co.jp/search?btnI=I%27m+Feeling+Lucky&q=${encodeURIComponent(text)} site:https://www.eiyoukeisan.com/calorie/'}'>🔗</a>`)
    })

  function addCSbutton(url, place) {
    if (url.test(location.href) && customSites.length) {
      let ele = eleget0(place)
      if (ele) { ele.insertAdjacentHTML("afterend", "　<span style='cursor:pointer;' title='左クリックで新しいカスタムsite:リンク項目を追加\n右クリックで自由編集' id='addcsbutton'>[+]</span>"); }
      var e = eleget0("//span[@id='addcsbutton']");
      if (e) e.addEventListener("click", (e) => {
        var site = prompt("カスタムsite:リンクを追加します\n\n→1.site: 絞り込むURL（ドメイン名等）\n　2.name: リンクの表示名\n　3.separator: 前項目との仕切り文字（スペース、｜、<br>等）\n\nを入力してください")
        if (!site) return;
        var name = prompt("カスタムsite:リンクを追加します\n\n　1.site: 絞り込むURL（ドメイン名等）\n→2.name: リンクの表示名\n　3.separator: 前項目との仕切り文字（スペース、｜、<br>等）\n\nを入力してください", site)
        if (!name) return;
        var sepa = prompt("カスタムsite:リンクを追加します\n\n　1.site: 絞り込むURL（ドメイン名等）\n　2.name: リンクの表示名\n→3.separator: 前項目との仕切り文字（スペース、｜、<br>等）\n\nを入力してください", "　")
        if (!sepa) return;
        customSites = setCustomSites([{ name: name, site: site, separator: sepa }], "\n反映させるにはリロードしてください")
      });
      if (e) {
        e.addEventListener("contextmenu", (t) => {
          var p = prompt("カスタムsite:リンクを編集\n反映させるにはリロードしてください\n" + jsb(pref("customSites") || []), JSON.stringify(pref("customSites") || []));
          if (p !== null) pref("customSites", p);
          t.stopPropagation();
          t.preventDefault();
        })
      }
    }
  }
  setTimeout(() => {
    if (HIDE_NICONIKOUKOKU) addstyle.add('li.nicoadVideoItemWrapper,.contentBody .nicoadVideoItem , a.d_flex.gap_x2{ display:none; }')
    var nicoPlace = after(eleget0('div.d_flex.jc_space-between , div.message > p'), `<div></div>`);
    //var nicodeleteOpt = /[\?&]f_range=.|[\?&]l_range=.|[\?&]opt_md=.*|[\?&]start=.*|[\?&]end=.*|[\?&]ref=[^&]*|[\?&]sort=[^\&\?]+|[\?&]order=.|[\?&]page=\d*|[\?&]track=[^&]*/g;
    //    var nicodeleteOpt=u=>deleteParam2(u,["f_range","l_range","opt_md","start","end","ref","sort","order","page","track"]);
    var nicodeleteOpt = u => deleteParam2(u, ["opt_md", "start", "end", "ref", "sort", "order", "page", "track"]);
    addLink("nico", nicoPlace, "", "", "人気高", "｜", nicodeleteOpt, "?sort=h&order=d");
    addLink("nico", nicoPlace, "", "", "お勧め", "　", nicodeleteOpt, "?sort=p&order=d");
    addLink("nico", nicoPlace, "", "", "投稿新", "｜", nicodeleteOpt, "?sort=f&order=d");
    addLink("nico", nicoPlace, "", "", "投稿古", "　", nicodeleteOpt, "?sort=f&order=a");
    addLink("nico", nicoPlace, "", "", "コメ新", "｜", nicodeleteOpt, "?sort=n&order=d");
    addLink("nico", nicoPlace, "", "", "コメ古", "　", nicodeleteOpt, "?sort=n&order=a");
    addLink("nico", nicoPlace, "", "", "コメ多", "｜", nicodeleteOpt, "?sort=r&order=d");
    addLink("nico", nicoPlace, "", "", "コメ少", "　", nicodeleteOpt, "?sort=r&order=a");
    addLink("nico", nicoPlace, "", "", "再生多", "｜", nicodeleteOpt, "?sort=v&order=d");
    addLink("nico", nicoPlace, "", "", "再生少", "　", nicodeleteOpt, "?sort=v&order=a");
    addLink("nico", nicoPlace, "", "", "いいね多", "｜", nicodeleteOpt, "?sort=likeCount&order=d");
    addLink("nico", nicoPlace, "", "", "いいね少", "　", nicodeleteOpt, "?sort=likeCount&order=a");
    addLink("nico", nicoPlace, "", "", "マイリス多", "｜", nicodeleteOpt, "?sort=m&order=d");
    addLink("nico", nicoPlace, "", "", "マイリス少", "　", nicodeleteOpt, "?sort=m&order=a");
    addLink("nico", nicoPlace, "", "", "時間長", "｜", nicodeleteOpt, "?sort=l&order=d");
    addLink("nico", nicoPlace, "", "", "時間短", "　", nicodeleteOpt, "?sort=l&order=a");

    var nicodeleteOpt = /[\?&]f_range=.|[\?&]l_range=.|[\?&]opt_md=.*|[\?&]start=.*|[\?&]end=.*|[\?&]ref=[^&]*|[\?&\+]sort=.|[\?&]order=.|[\?&]page=\d*|[\?&]track=[^&]*/g;
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "　<BR>", "人気", "　", nicodeleteOpt, "?sort=p&order=d");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "動画多", "｜", nicodeleteOpt, "?sort=n&order=d");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "動画少", "　", nicodeleteOpt, "?sort=n&order=a");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "更新新", "　", nicodeleteOpt, "?sort=u&order=d");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "適合高", "　", nicodeleteOpt, "?sort=r&order=d");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "作成新", "｜", nicodeleteOpt, "?sort=c&order=d");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "作成古", "　", nicodeleteOpt, "?sort=c&order=a");
    addLink("nicovideo.jp/mylist_search/", '//table[@id="b_message"]/tbody/tr/td[2]', "", "", "フォロー多", "　", nicodeleteOpt, "?sort=f&order=d");

    var nicodeleteOpt = /[\?&]f_range=.|[\?&]l_range=.|[\?&]opt_md=.*|[\?&]start=.*|[\?&]end=.*|[\?&]ref=[^&]*|\#\+sort=\d*|[\?&]order=.|[\?&]page=\d*|[\?&]track=[^&]*/g;
    var nicoPlace = '//div[@id="SYS_box_mylist_header"]/div/h1/..';
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "登録新", "｜", nicodeleteOpt, "#+sort=1");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "登録古", "　", nicodeleteOpt, "#+sort=0");
    //  addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "タイトル↓", "｜", nicodeleteOpt, "#+sort=4");
    //  addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "タイトル↑", "　", nicodeleteOpt, "#+sort=5");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "投稿新", "｜", nicodeleteOpt, "#+sort=6");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "投稿古", "　", nicodeleteOpt, "#+sort=7");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "コメ新", "　", nicodeleteOpt, "#+sort=10");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "コメ多", "　", nicodeleteOpt, "#+sort=12");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "再生多", "　", nicodeleteOpt, "#+sort=8");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "マイリス多", "　", nicodeleteOpt, "#+sort=14");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "時間長", "｜", nicodeleteOpt, "#+sort=16");
    addLink("nicovideo.jp/mylist/", nicoPlace, "", "", "時間短", "　", nicodeleteOpt, "#+sort=17");
  }, 3100);

  setTimeout(() => {
    var nicodeleteOpt = /[\?&].+/g; //sortKey=.+/g;
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "投稿新", "｜", nicodeleteOpt, "?sortKey=registeredAt&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "投稿古", "　", nicodeleteOpt, "?sortKey=registeredAt&sortOrder=asc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "再生多", "｜", nicodeleteOpt, "?sortKey=viewCount&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "再生少", "　", nicodeleteOpt, "?sortKey=viewCount&sortOrder=asc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "コメ新", "　", nicodeleteOpt, "?sortKey=lastCommentTime&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "コメ多", "｜", nicodeleteOpt, "?sortKey=commentCount&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "コメ少", "　", nicodeleteOpt, "?sortKey=commentCount&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "マイリス多", "｜", nicodeleteOpt, "?sortKey=mylistCount&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "マイリス少", "　", nicodeleteOpt, "?sortKey=mylistCount&sortOrder=asc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "いいね多", "｜", nicodeleteOpt, "?sortKey=likeCount&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "いいね少", "　", nicodeleteOpt, "?sortKey=likeCount&sortOrder=asc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "時間長", "｜", nicodeleteOpt, "?sortKey=duration&sortOrder=desc");
    addLink(/\/\/www\.nicovideo\.jp\/user\/\d+\/video.*/, '//button[@class="Selectbox-button"]/../..', "", "", "時間短", "　", nicodeleteOpt, "?sortKey=duration&sortOrder=desc");
  }, performance.now() * 3);

  if (location.href.indexOf("auctions.yahoo.co.jp/") !== -1) {
    var yadeleteOpt = /[\?&]s1=.*&o1=.*(?=&)|[\?&]s1=.*&o1=.*(?=$)/g;
    var pta = '//a[@class="Info__closedLink"]|//div[@class="Option"]/..';
    var ele = eleget0(pta);
    if (ele) ele.style.display = "inline";
    addLink("auctions.yahoo.co.jp/", pta, "", "　", "おすすめ", "　", yadeleteOpt, "[&?]s1=score2&o1=d");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "現価安", "｜", yadeleteOpt, "[&?]s1=cbids&o1=a");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "現価高", "　", yadeleteOpt, "[&?]s1=cbids&o1=d");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "残時短", "｜", yadeleteOpt, "[&?]s1=end&o1=a");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "残時長", "　", yadeleteOpt, "[&?]s1=end&o1=d");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "入札少", "｜", yadeleteOpt, "[&?]s1=bids&o1=d");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "入札多", "　", yadeleteOpt, "[&?]s1=bids&o1=a");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "即決安", "｜", yadeleteOpt, "[&?]s1=bidorbuy&o1=a");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "即決高", "　", yadeleteOpt, "[&?]s1=bidorbuy&o1=d");
    addLink("auctions.yahoo.co.jp/", pta, "", "", "新しい", "", yadeleteOpt, "[&?]s1=new&o1=d");
  }

  if (location.href.match(/yodobashi\.com\/.*\?.*?=/)) {
    addLink("yodobashi", '//div[@class="srcResultBoxNew"]/div/div', "", "　　　", "人気", "　", /&sorttyp=\w*/, "&sorttyp=COINCIDENCE_RANKING");
    addLink("yodobashi", '//div[@class="srcResultBoxNew"]/div/div', "", "", "新着", "　", /&sorttyp=\w*/, "&sorttyp=NEW_ARRIVAL_RANKING");
    addLink("yodobashi", '//div[@class="srcResultBoxNew"]/div/div', "", "", "安い", "｜", /&sorttyp=\w*/, "&sorttyp=SELL_PRICE_ASC");
    addLink("yodobashi", '//div[@class="srcResultBoxNew"]/div/div', "", "", "高い", "　", /&sorttyp=\w*/, "&sorttyp=SELL_PRICE_DESC");
    addLink("yodobashi", '//div[@class="srcResultBoxNew"]/div/div', "", "", "新発売", "　", /&sorttyp=\w*/, "&sorttyp=RELEASE_DATE_DESC");
  }
  //addLink("","" , "", "", "", "　", , "?");
  //  setTimeout(() => addAutoDiscovery(), 100);
  addAutoDiscovery();

  return;

  function addAutoDiscovery() { // Google検索結果に同じ検索ワードでGoogle NewsかTwitter検索へのRSSリンクとRSS Autodiscoveryを埋め込む
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@#])/, "$1", "*** | Google ニュース", "https://news.google.com/news/rss/search/section/q/***?ned=jp&hl=ja&gl=JP")
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@#])/, "$1", "*** | Google News (En)", "https://news.google.com/news/rss/search/section/q/***?ned=us&hl=en&gl=US")
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@#])/, "$1", "*** | Reddit (En)", "https://www.reddit.com/search.rss?q=***&sort=new")
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@#])/, "$1", "*** | 5chスレタイ検索", "https://ff5ch.syoboi.jp/?q=***&alt=rss")
    //    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | Queryfeed Twitterキーワード", "https://queryfeed.net/tw?q=***")
    //    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** (filter:images OR filter:videos) | Queryfeed Twitterキーワード 画像か動画", "https://queryfeed.net/tw?q=***%20 (filter:images OR filter:videos)")
    //    embedAutoDiscovery('google',"//span[@id='gkbPanelRSS']",'//textarea[@type="search"]', /^([^@])/, "$1", "*** (filter:videos) | Queryfeed Twitterキーワード 動画", "https://queryfeed.net/tw?q=***%20 (filter:videos)")
    if (NITTER_INSTANCES?.length) {
      embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | Nitter (" + NITTER_INSTANCE + ") Twitterキーワード", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***")
      embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | Nitter (" + NITTER_INSTANCE + ") Twitterキーワード 画像か動画", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+(filter:images OR filter:videos)")
      embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | Nitter (" + NITTER_INSTANCE + ") Twitterキーワード 日本語ツイートのみ", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+lang:ja")
      embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | Nitter (" + NITTER_INSTANCE + ") Twitterキーワード 日本語ツイートのみ 画像か動画", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+lang:ja+(filter:images OR filter:videos)")
    }
    //    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "\#$1", "#*** | Queryfeed Instagram ハッシュタグ", "https://queryfeed.net/instagram?q=***");
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | DeviantArt (En) キーワード", "https://backend.deviantart.com/rss.xml?q=***");
    embedAutoDiscovery('google', "//span[@id='gkbPanelRSS']", 'textarea#APjFqb.gLFyf', /^([^@])/, "$1", "*** | CiNii 論文検索 キーワード", "https://ci.nii.ac.jp/opensearch/search?q=***&range=2&sortorder=1&start=1&count=20&format=rss");

    embedAutoDiscovery('ebay', '//div[@id="gh-ac-box2"]/input/..', '//div[@id="gh-ac-box2"]/input', /^([^@])/, "$1", "*** | eBay キーワード", "https://www.ebay.com/sch/i.html?_nkw=***&_rss=1");
    return;
  }

  function embedAutoDiscovery(site, place, wordXP, wordtermRE, replaceStr, itemName, url) {
    if (site.constructor == RegExp) {
      if (!(location.href.match(site))) return;
    } else {
      if (location.href.indexOf(site) == -1) return
    }
    var ele = eleget0(wordXP);
    if (!ele || !(ele.value.match(wordtermRE))) return;
    var word = ele.value;
    if (itemName.match(/\(En\)|ユーザー名|ユーザーネーム|DeviantArt/) && !(word.match(/^[\x20-\x7e]*$/))) return; // google news en や、ユーザー検索なら半角英数以外を含んだらやらない
    if (itemName.match("日本語ツイートのみ") && !(word.match(/^[\x20-\x7e]*$/))) return;
    var link = document.body.parentNode.insertBefore(document.createElement("link"), document.body);
    link.title = itemName.replaceAll("***", word);
    link.rel = "alternate"
    link.type = "application/rss+xml"
    link.href = url.replaceAll("***", encodeURIComponent(word.replace(wordtermRE, replaceStr)));

    var place = eleget0(place);

    if (!place) return;
    var url = link.href;
    let rssICON = '<img style="vertical-align: bottom;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVQ4ja3TL2iWURTH8c+VJwwxjjeMBQUxGRdkGESHBothw3CDwfTaFiwDm1MQViyiQRG8iviCYBAGKg60GEwm/2AZQ8bixIXxXsNzH717dSLiKYdzOHzv+Z17TsjJcdzEOBrs0VrnOxtWfhsb6IecfMBB/2Yfm/IyPMXbAjuKyb8A9JrSNqyE6BrkBKZxEWf+AGhCTr5iL+7hDt6FaL2ryMkM7mLiN4CtkJNvGKuSQ7zBEgYhkpNJPMehUUA96VuYw3XsxyMs52Q8RKs4gbXRFmrApxANQjSPA7iMGaxUkHOjgFrCSzzEkxDbl3Iyiwd4gVNFzmM/B7tDwjHcwOecLOREiAa4gpOYLXVLu0kYYoBnWMRCyV/FF8yX+BVWa0C3ordDNBei09qlupSTiRBt4T6O5KQX4g/IL4DNqpvNMpdO6+tSe7jE77uuG+1hwIWygWOV3rM52af9FTifkylMlXj7vxxTXzv9np3nvJt157yO/nf0A3GlIF+BggAAAABJRU5ErkJggg==">';

    place.insertAdjacentHTML("beforeend", `<span style="font-weight:normal;"><a href="${link.href}" rel="noopener noreferrer nofollow" title='${ link.title }'> ${rssICON}</a></span>`)

    return;
  }

  function addLink(site, placexpath, terms, beforetitle, title, append, deleteoption, option) {
    if (site.constructor == RegExp) {
      if (!(location.href.match(site))) { return; }
    } else {
      if (location.href.indexOf(site) == -1) return
    }
    var place = placexpath instanceof Element ? placexpath : eleget0(placexpath);
    if (!place) return;

    var url = window.location.href;
    if (terms !== "") url = url.replace(/&tbm=.*/, "");
    if (terms !== "none") url = url + terms;
    url = url.replace(/.\(site%3A.*/gmi, "").replace(/\sOR\ssite[^&]*/, "")
    if (typeof deleteoption == "function") url = deleteoption(url);
    else url = url.replace(deleteoption, '');

    option = option.replace("[&?]", (url.indexOf("?") == -1) ? "?" : "&");
    url += option;
    url = deleteParam2(url)

    place.insertAdjacentHTML(`beforeend`, `<span class="gglniaddedsortbutton" style="font-weight:normal;">${beforetitle}<a referrerpolicy='no-referrer' style='display: inline-block; white-space: nowrap;' rel='nofollow noopener noreferrer' href='${url?.trim().replace(/\%20$|\+$/g,"")}'>${title} </a>${ append}</span>`)
    return;
  }

  function addLink2(site, placexpath, terms, beforetitle, title, append, deleteoption, option, language = "all") {
    if (site.test(location.href) === false) return;
    var place = eleget0(placexpath);
    if (!place) return;

    let searchWord = eleget0('input#search_form_input.search__input--adv.js-search-input , textarea#APjFqb[aria-controls="Alh6id"] , input#search_form_input')?.value || ""; // textarea[autocorrect="off"][name="q"] , input#search_form_input')?.value || "";
    if (!searchWord) return;
    if (language == "notJP" && !(searchWord.match(/^[\x20-\x7e]*$/))) return; // 半角英数以外を含んだらやらない
    searchWord = searchWord.replace(/.\(site\:.*/gmi, "").replace(/\sOR\ssite[^&]*/, "")
    searchWord = searchWord.replace(deleteoption, '');

    place.insertAdjacentHTML("beforeend", `${beforetitle}<span class="gglniaddedsortbutton"><a referrerpolicy='no-referrer' style='display: inline-block; white-space: nowrap;' rel='nofollow noopener noreferrer' href=\"${option.replaceAll('***', encodeURIComponent(searchWord?.trim().replace(/\%20$|\+$/g,"")).replace(deleteoption, ""))}">${title}</a></span>${append}`)
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
    if (typeof xpath === "function") return xpath() // !!!
    if (Array.isArray(xpath)) {
      let array = xpath.map(v => elegeta(v, node)).filter(v => v.length).flat();
      return array;
    }
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=.*/g, "")
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        //        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        var snap = node.evaluate("." + xpath2, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
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
    return array;
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (typeof xpath === "function") return xpath() // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) {
      let ele = elegeta(xpath, node)?.shift();
      debug && debugEle(ele, "random autoRemove")
      return ele
    }
    if (!/^\.?\//.test(xpath)) {
      let array = node.querySelector(xpath);
      debug && debugEle(array, "random autoRemove")
      return array
    }
    try {
      //      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      var ele = node.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let array = ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
      debug && debugEle(array, "random autoRemove")
      return array;
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return null; }
    //} catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }


  function xa(xpath, node = document) {
    if (!xpath) return [];
    if (xpath.match(/^\/\//)) {
      try {
        var array = [];
        var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
        return array;
      } catch (e) { return []; }
    } else {
      return $(xpath);
    }
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

  function jsb(a) {
    return JSON.stringify(a).replace(/\{/g, "\n  {").replace(/\]/gm, "\n]\n");
  }

  function autoPagerized(callback) {
    callback(document.body)
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { callback(evt.target); }, false);
  }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  function deleteParam2(nexturl, paras = []) {
    paras.forEach(v => { nexturl = nexturl.replace(new RegExp(`[\\?\\&]${v}=[^\\?\\&]*`), "") })
    return nexturl.replace(/\?/g, "\&").replace(/^([^\?]+?)\&(.*)$/, "$1?$2"); // ?より前に&が出てきたらそれは?にする
  }

  function dragElement(ele, handleSel = "*", cancelSel = "") {
    let x, y;
    (handleSel == "*" ? [ele] : elegeta(handleSel, ele)).forEach(e => e.onmousedown = dragMouseDown)

    function dragMouseDown(e) {
      if (e.target.closest(cancelSel) || e.button != 0) return;
      e = e || window.event;
      e.preventDefault();
      var w = w || ele.getBoundingClientRect().width - elePadding(ele).left - elePadding(ele).right;
      ele.style.minWidth = `${w}px`;
      ele.style.maxWidth = `${w}px`;
      [x, y] = [e.clientX, e.clientY];
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
      e = e || window.event;
      e.preventDefault();
      ele.style.position = "fixed"
      ele.dataset.moved = 1;

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

})();