// ==UserScript==
// @name        Web漫画アンテナお気に入り管理
// @description d:作者名を読み込む　a:作者をお気に入りに追加/削除　e:検索ワード入力　Shift+E:全編集
// @match       *://webcomics.jp/*
// @version     0.1.9
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.openInTab
// @grant       GM_deleteValue
// @namespace   https://greasyfork.org/users/181558
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/448712/Web%E6%BC%AB%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/448712/Web%E6%BC%AB%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
  var keyFunc = [];
  var INTERVAL = () => 7500;
  const isBusy = function() { return Number(pref("busy") || 0) > Date.now() }
  const setBusy = function(delay = INTERVAL()) { if (Date.now() + delay > Number(pref("busy") || 0)) pref("busy", Date.now() + delay) }

  var scrollForGet = 0;
  const V = 0; // 1-3:verbose

  let addstyle = {
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
  }

  var db = {};
  db.manga = pref("db.manga") || [];
  db.favo = pref('db.favo') || [];
  db.favhis = pref('db.favhis') || [];
  var latestget = Date.now() - INTERVAL()
  var busy = 0;
  var GF = {}
  document.querySelector(`head`).insertAdjacentHTML('beforeend', `<style>.waiting{ display: inline-block; vertical-align: middle; color: #666; line-height: 1; width: 1em; height: 1em; border: 0.12em solid currentColor; border-top-color: rgba(102, 102, 102, 0.3); border-radius: 50%; box-sizing: border-box; -webkit-animation: rotate 1s linear infinite; animation: rotate 1s linear infinite; } @-webkit-keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } } @keyframes rotate { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }</style>`)

  String.prototype.autrep = function() { return this.replace(/\([^)]*\)|（[^）]*）|原作|作画|漫画|キャラクター|キャタクターデザイン|ネーム|原案|著者|作者|シナリオ|[作|画][\:：]|\:|：|・|\,|、|，|\/|／|\+|＋|\&|＆/gmi, " ").replace(/　+|\s+/gmi, " ").trim() } // gフラグ不可
  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  String.prototype.sanit = function() { return this.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;') }
  String.prototype.esc = function() { return this.replace(/[&<>"'`]/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' } [match])) }


  function adja(place = document.body, pos, html) {
    return place ? (place.insertAdjacentHTML(pos, html), place) : null;
  }
  var JS = (v) => { return JSON.stringify(v) }
  var JP = (v) => { return JSON.parse(v) }

  var mousex = 0;
  var mousey = 0;
  var hovertimer
  document.addEventListener("mousemove", e => ((mousex = e.clientX), (mousey = e.clientY), (hovertimer = 0), undefined), false)

  let bcc = { // 2025.04
    channel: null,
    lastReload: { time: Date.now(), src: "" },
    init() {
      if (!this.channel) this.channel = new BroadcastChannel('WCAFM_SKIP');
      this.channel.onmessage = (event) => {
        if (event.data.type == 'sleep') this.lastReload = { time: event.data.time, src: event.data.src };
      }
    },
    setBusy(length = INTERVAL()) {
      if (this.lastReload.time < Date.now() + length) {
        this.channel.postMessage({ type: 'sleep', time: Date.now() + length, src: document?.title?.slice(0, 22) || "?" });
        this.lastReload = { type: 'sleep', time: Date.now() + length, src: document?.title?.slice(0, 22) || "?" };
      }
    },
    isBusy() {
      if (Date.now() < this.lastReload.time) return true;
    }
  }
  bcc.init();

  var keyListen = function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true') return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    var ele = document.elementFromPoint(mousex, mousey);
    var sel = (window.getSelection) ? window.getSelection().toString().trim() : ""
    if (pushkey(key, ele, sel)) { e.preventDefault(); return false }
  }
  document.addEventListener('keydown', keyListen, false)

  document.addEventListener("mousedown", function(e) { // クリック
    var ele = document.elementFromPoint(mousex, mousey);
    if (e.button == 0 && ele?.dataset?.key) {
      if (pushkey(ele?.dataset?.key, ele)) return false
    }
  })
  document.addEventListener("contextmenu", function(e) { // クリック
    var ele = document.elementFromPoint(mousex, mousey);
    if (ele.dataset.keyr) {
      if (pushkey(ele.dataset.keyr, ele)) { e.preventDefault(); return false }
    }
  })

  function storemanga(tit, aut, ele) {
    db.manga = pref("db.manga") || []
    db.manga = db.manga.filter(v => v.t != tit)
    db.manga.push({ t: tit, a: aut })
    db.manga = (Array.from(new Set(db.manga.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
    pref("db.manga", db.manga)
    V >= 3 && console.table(db.manga)
    run(ele)
  }

  function addaut(aut, ele = document) {
    if (!aut || aut == "-") return
    aut = aut.autrep() // 加工後の作者名で記憶する
    db.favo = pref("db.favo") || []
    if (!db.favo.includes(aut)) { db.favo.push(aut) } else { db.favo = db.favo.filter(v => v !== aut) }
    db.favo = (Array.from(new Set(db.favo.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
    pref("db.favo", db.favo)
    V >= 3 && console.table(db.favo)
    run(ele)
  }

  var queue = {
    q: [], //{ele,key}
    add: function(ele, key) {
      this.q.push({ ele: ele?.closest(".entry"), key: key })
    },
    do: function() {
      V >= 2 && this.q.length && console.table(this.q)
      this.q.forEach(v => {
        var box = v.ele
        var key = v.key
        if (!box) { v.stop = 1; return 0 }
        var tit = eleget0('div.entry-title>a:first-child', box)?.textContent?.trim()
        var desc = eleget0('//span[@class="entry-detail"]/a[1]|.//a[contains(@class,"entry-detail")]', box)
        var aut = eleget0('.aut', box)?.dataset?.author;

        if (aut == "-") { v.stop = 1; return 0 }
        if (aut) aut = decodeURI(aut)
        var descurl = desc?.href
        if (aut) {
          storemanga(tit, aut, box.parentNode)
          key == "a" && addaut(aut, box.parentNode)
          autsearch()
          v.stop = 1;
          return 0
        }

        var q = eleget0('.autq:not(.waiting)', box);
        if (q) { q.classList.add("waiting"); }
        box.dataset.queue = 1


        //        if (descurl && !aut && !box.dataset.wait && Date.now() - latestget > INTERVAL() && !busy && !isBusy()) {
        if (descurl && !aut && !box.dataset.wait && Date.now() - latestget > INTERVAL() && !busy && !isBusy() && !bcc.isBusy()) {
          busy = 1;
          bcc.setBusy(INTERVAL() + Math.random() * 999);
          setBusy();
          box.dataset.wait = 1
          v.stop = 1

          var queuee = eleget0('.autq', box)
          queuee.style.color = "#f0f"

          V >= 1 && notify(`${"get:" + tit}\n${(Date.now() - latestget)/1000} sec.\n${new Date().toLocaleString("ja-JP")}`, document.title)
          latestget = Date.now()

          if (scrollForGet) box.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
          $.get(descurl).done(got => {
            setBusy(INTERVAL() / 2)
            busy = 0
            //latestget = Date.now()-INTERVAL()/2
            delete box.dataset.queue;
            aut = $('div.comic-info-right div.comic-author', got)?.text()?.replace("作者: ", "").trim() || "-"
            V > 1 && notify(`${"done:" + tit}\n${aut}`, document.title)

            if (aut) {
              storemanga(tit, aut, box.parentNode)
              if (key == "a") addaut(aut, box.parentNode);
              document.dispatchEvent(new CustomEvent('plzGKSI'))
            }
          }).fail(err => {
            alert(`通信エラー\n${descurl}`)
            this.q = []
            delete box.dataset.queue;
            location.reload();
          })
          autsearch()
        }
      })
      this.q = this.q.filter(v => !v.stop)
    },
  }
  setInterval(() => { queue.do() }, 1000)

  function pushkey(key, ele = null, sel = "") {
    keyFunc.forEach(v => { if (v.key === key) { v.func(ele) } })
    if (/^open:/.test(key)) {
      window.open(key.replace(/^open:/, ""))
      return 1
    }
    if (key === "e") { // e::
      db.manga = pref("db.manga") || []
      db.favo = pref('db.favo') || [];
      db.favhis = pref('db.favhis') || [];
      var favo = [...db.favo]

      GF.sorttype = ((GF.sorttype || 0) % 3 + 1)
      var [order, finstrfunc] = [
        ["登録順", a => a.join("　")],
        ["abc順", a => a.sort(new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare).join("　")],
        ["長さ→abc順", a => a.sort((a, b) => a.length == b.length ? (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a, b) : a.length > b.length ? 1 : -1).join("　")]
      ][GF.sorttype - 1]
      var target = (window.getSelection() && window.getSelection().toString().trim()) || (prompt(`お気に入りに登録するキーワードを入力してください\nすでに登録されている文字列を入力するとそれを削除します\n\n現在登録済み（${favo.length}）： （${["登録順","abc順","長さ→abc順"][GF.sorttype-1]}）\n${finstrfunc([...favo])}\n\n`) || "")?.trim();
      target = target?.trim()
      if (!target) return;
      if (db.favo.includes(target)) {
        if (confirm(`『${target}』は既に存在します\n削除しますか？\n`)) {
          V && alert(`『${target}』をメモから削除しました`)
          db.favo = db.favo.filter(v => v != target)
        }
      } else {
        db.favo.push(target)
      }
      pref("db.favo", db.favo)
      pref("db.manga", db.manga)
      pref("db.favhis", db.favhis);
      run()
    }
    if (key === "d" || key == "a") { // d:: a::
      let descele = eleget0(".comic-info .aut", ele?.closest("#main")) || ele;
      if (key == "a" && descele.dataset.author) { //alert("!");
        var aut = decodeURI(descele.dataset.author)
        addaut(aut)
        autsearch()
        return 1
      }
      queue.add(ele, key);
      queue.do()
      return 1
    }
    if (key === "Shift+E") { // Shift+E::
      var tmp = prompt(`作品情報(${db.manga.length}) / お気に入り作者(${db.favo.length})\n全設定値をJSON形式で編集してください\n空欄を入力すれば全削除できます\n先頭の{の前に+を付けると現在のデータに追加（マージ）します\n\n` + JS(db), JS(db))
      if (tmp !== null) { // ESCで抜けたのでなければ
        try {
          if (tmp?.trim()?.match(/^\+|^＋/)) {
            tmp = tmp?.trim()?.replace(/^\+|^＋/, "")?.trim()
            db.manga = (pref("db.manga") || []).concat(JSON.parse(tmp || "").manga)
            db.favo = (pref('db.favo') || []).concat(JSON.parse(tmp || "").favo)
            db.favhis = (pref('db.favhis') || []).concat(JSON.parse(tmp || "").favhis)
            tmp = JSON.stringify(db)
          }
          var dbtmp = JP(tmp || '{"favo":[],"manga":[],"favhis":[]}')
          dbtmp.manga = (Array.from(new Set(dbtmp.manga.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
          dbtmp.favo = [...new Set(dbtmp.favo)]; // uniq
          dbtmp.favhis = (Array.from(new Set(dbtmp.favhis.map(v => JSON.stringify(v))))).map(v => JSON.parse(v)) // uniq:オブジェクトの配列→JSON文字列配列→uniq→オブジェクトの配列
          db = dbtmp
          pref("db.favo", db.favo || [])
          pref("db.manga", db.manga || [])
          pref("db.favhis", db.favhis || []);
          $("#favpanel").remove()
          run();
        } catch (e) {
          alert(e + "\n入力された文字列がうまくparseできなかったので設定を変更しません\n正しいJSON書式になっているか確認してください");
          return false
        }
      }
      return 1
    }

    //
    if (key == "0") { // 0::メモ一覧一括削除画面
      (async () => {
        db.favhis = pref('db.favhis') || [];
        let coll = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
        //var newstr = db.favhis.sort((a, b) => coll.compare(a[1].t, b[1].t)).sort((a, b) => coll.compare(a[1].a, b[1].a)).sort((a, b) => b[1].p - a[1].p) // タイトル昇順→作者名昇順→メモ長降順
        // test 120回実行 / 1sec , 8.333333333333334ミリ秒/１実行 ()=>{var newstr = db.favhis.sort((a, b) => coll.compare(a[1].t, b[1].t)).sort((a, b) =>
        var newstr = db.favhis.sort((a, b) => coll.compare(a[1].t, b[1].t)).sort((a, b) => coll.compare(a[1].a, b[1].a)).sort((a, b) => coll.compare(gettime("YYYY/MM/DD", (new Date(b[1].o))), gettime("YYYY/MM/DD", (new Date(a[1].o))))).sort((a, b) => b[1].p - a[1].p) // タイトル昇順→作者名昇順→記帳降順→メモ長降順
        // test 24回実行 / 1sec , 41.666666666666664ミリ秒/１実行 ()=>{var newstr = db.favhis.sort((a, b) => coll.compare(a[1].t, b[1].t)).sort((a, b) =>
        var words = newstr
        $("#favpanel").remove()
        end(document.body, `<div id="favpanel" style="width:90%; max-width:95% !important; position:absolute; top:1em; left: 50%; border-radius:1em; transform: translate(-50%, 0%); box-shadow:0px 0px 0 999em #000c; word-break:break-all; z-index:111; padding:2em; margin:auto; background-color:#fff; line-height:1.8em;"><span id="favpanelclose" style="cursor:pointer;float:right;">×(Esc)</span>0:○メモを付けた作品履歴（${words.length}）<span id="favpanelwait">　準備中…</span><br><br><div><table id="favtable" border="0" style=" border-collapse: collapse;"><tbody id="favtablebody"><tr><th>削除</th><th>No.</th><th class="sortableColumn">メモ長</th><th></th><th>著者</th><th>作品名</th><th>url</th><th>サイト</th><th title="検索用">詳細</th><th>記帳</th></tr></tbody></table>`)
        addstyle.add(`#favtable{margin:0 auto; width:100%;}
        #favpanel a{ text-decoration:none; padding-right:0.5em;}
        #favpanel td{padding:0 0.5em; max-width:14vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        #favpanel,td,th {  border-collapse: collapse; border-bottom:2px solid #fff;border-left:2px solid #fff;}
        #favpanel tr:nth-child(even){background-color:#f0f0f8;}
        #favpanel th{background-color:#dde; padding:0.5em 0.5em;}
        #favpanel img{max-width:100%;}
        #favpanel span.yhmMyMemo{user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none;}
        #favpanel .yhmMyMemo{font-size:90%;}
        #favpanel .favfiltericon{color: #aa7; font-size:99%; cursor:pointer; float: right; user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none;}
        #favpanel .favhissum{ max-width:2vw !important; }
        #favtable tr:not(:has(th)) { line-height:1.4em; }
        `)
        if (words.length > 100) {
          await waitFrame()
          await waitFrame()
        }
        let list = []
        words.forEach((w, i) => {
          list.push(`<tr class="favhisentry" title="${(w[1]?.sum||"")?.esc()}"><td data-delfav="${escape(w[0])}" style="cursor:pointer; text-align:center;" title="削除">🗑</td>
          <td style="text-align:center;">${i+1}</td>
          <td style="text-align:center;">${w[1].p}</td>
          <td style="width:3em;"><a href="${w[1].h}"><img class="favhisimg" loading="lazy" src="${w[1].i}"></a></td>
          <td><span class="favfiltericon" title="Solo" data-favfilter="${escape(w[1].a)}">▼</span><span><a href="https://webcomics.jp/search?q=${encodeURI(w[1].a)}" class="favhisaut">${w[1].a.esc()}</a></span></td>
          <td style="max-width:21vw;" class="favhistitletd"><span><a href="https://webcomics.jp/search?q=${encodeURI(w[1].t)}" class="favhistitle">${w[1].t.esc()}</a></span></td>
          <td><br style="display:block;"><a href="${w[1].h}" class="favhishref">${w[1].h}</a></td>
          <td><span class="favfiltericon" title="Solo" data-favfilter="${escape(w[1].s)}">▼</span><span><span class="favhissite">${w[1].s.esc()}</span></span></td>
          <td class="favhissum"><br style="display:block;">${w[1]?.sum?.esc()||""}<span class="favhisdetail" data-favhisdetail="${w[1]?.d}"></span></td>
          <td>${gettime("YYYY/MM/DD",(new Date(w[1].o)))}</td>
          </tr>`);
        });
        list = list.join("");
        end(eleget0("#favtablebody"), list)

        setDragCol()
        sortableTH("#favpanel th")

        eleget0('#favpanel')?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        $('#favpanelclose').one("click", e => $('#favpanel').remove())

        GF.filteron = 0;
        cbOnce(() => document.addEventListener("click", e => {
          if (eleget0('#favpanel') && !e?.target?.closest(`#favpanel`)) {
            $('#favpanel').remove()
            e.stopPropagation()
            e.preventDefault()
            return false;
          }
          let filter = e.target?.dataset?.favfilter; // soloフィルタ
          if (filter) {
            e.stopPropagation()
            e.preventDefault()
            GF.filteron = GF.filteron == filter ? 0 : filter
            elegeta('.favhisentry').forEach(e => {
              gmDataList_remove(e, "gmHideByWCAkanri")
              if (!gmDataList_includesPartial(e, 'gmHideBy')) e.style.display = "revert";
              if (GF.filteron && e.textContent.indexOf(unescape(filter)) == -1) {
                gmDataList_add(e, "gmHideByWCAkanri")
                $(e).fadeOut(222);
                setTimeout(() => { e.style.display = "none"; }, 222);
              }
            })
            setTimeout(() => {
              e?.target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }, GF.filteron ? 223 : 1)
            addstyle.add(`.attra{outline:4px solid #0f0;}`)
            e.target.closest("tr")?.classList.add("attra");
            setTimeout(() => $('.attra').removeClass("attra"), 1500)
            return false;
          }
          let f = e.target?.dataset?.delfav; // 削除
          if (!f) return;
          db.favhis = db.favhis.filter(v => v[0] != unescape(f))
          pref("db.favhis", db.favhis);
          e.target?.closest('tr')?.remove()
        }))
        cbOnce(() => document.addEventListener("keydown", e => {
          if (e.key == "Escape") $('#favpanel').remove()
        }))
        document.dispatchEvent(new CustomEvent("requestyhm")) //setTimeout(() => requestAnimationFrame(() => document.dispatchEvent(new CustomEvent("requestyhm"))), 0)
        eleget0('#favpanelwait')?.remove()
      })();
    }
  }

  run()
  document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { run(eleget0('.list.top', evt.target) || evt.target?.closest(".list.top") || document); }, false);

  // タブにフォーカスが戻ったら再実行
  window.addEventListener("focus", () => {
    db.manga = pref("db.manga") || []
    db.favo = pref('db.favo') || [];
    db.favhis = pref('db.favhis') || [];
    run()
  })

  // 詳細画面
  var aut = $('div.comic-info-right div.comic-author')?.text()?.replace("作者: ", "")?.trim() || "-"
  var tit = eleget0('//div/div/div/div[@class="comic-title"]/h2/a[1]')?.textContent?.trim()

  if (aut && tit) {
    storemanga(tit, aut, document)
  }


  // 好き履歴保存 0::
  moq3(ele => {
    if (ele.matches(`.yhmMyMemoO`) || ele.querySelector(`.yhmMyMemoO`)) {
      clearTimeout(GF?.favST)
      GF.favST = setTimeout(() => {
        db.favhis = pref('db.favhis') || [];
        const favhis = new Map(db.favhis)
        const lastfav = JSON.stringify([...db.favhis].sort())
        elegeta('div.entry , .favhisentry').map(v => { return { box: v, score: elegeta(':is(.favhistitletd , .entry) .yhmMyMemoO', v).reduce((a, b) => a + b?.textContent?.length, 0) } }).filter(v => v.score).forEach(n => {
          let t = eleget0('div.entry-title > a:nth-of-type(1) , a.favhistitle', n.box);
          let title = t?.textContent?.trim() || "";
          let href = (eleget0('div.entry-title > a:nth-of-type(1)', n.box) || eleget0('a.favhishref', n.box))?.href || "";
          let author = eleget0('a.autele.aut.autname , .favhisaut', n.box)?.textContent || "";
          let site = eleget0('div.entry-site > a , span.favhissite', n.box)?.textContent?.trim() || "";
          let oldest = Math.min(favhis.get(title + author)?.o || Number.MAX_SAFE_INTEGER, (new Date().setHours(0, 0, 0, 0))); // 古い記帳日を優先
          let i = eleget0('div.entry-thumb > a > img , .favhisimg', n.box)?.src || ""
          let detail = eleget0('.favhisdetail', n.box)?.dataset?.favhisdetail || eleget0('span.entry-detail > a', n.box)?.href || "";
          let summary = eleget0('.entry-summary', n.box)?.textContent?.trim() || eleget0('.favhissum', n.box)?.textContent?.trim() || favhis.get(title + author)?.sum || "";
          if (favhis.get(title)?.d == detail) favhis.delete(title) //タイトル同じで作者名未取得でdetailが同じものは削除＝実質上書き
          favhis.set(title + author, { t: title, h: href, a: author, s: site, i: i, p: n.score, o: oldest, d: detail, sum: summary })
        })
        if (lastfav != JSON.stringify([...favhis].sort())) {
          db.favhis = [...favhis];
          pref("db.favhis", [...favhis]);
        }
      }, 555)
    }
  })

  function moq3(cb, observeNode = document.body) {
    let mo = new MutationObserver((m) => {
      //      let eles = [...m.filter(v => v.addedNodes || v.removedNodes).map(v => [...v.addedNodes].concat([...v.removedNodes])).filter(v => v.length)].flat().filter(v => v.nodeType === 1).forEach(v => cb(v));
      let eles = [...m].map(v => ([...v.addedNodes, ...v.removedNodes])).filter(v => v.length).flat().filter(v => v?.nodeType === 1).forEach(v => cb(v));
    })?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true });
    return () => {
      mo?.disconnect();
      mo = null;
    }
  }

  return;

  function autsearch() {
    elegeta(".autsearchele").forEach(e => e.remove());
    let tmp = pref('db.favo') || [];
    if (tmp.length) {
      var aut = tmp[0]
      var u = `https://webcomics.jp/search?q=${encodeURI(aut.autrep())}`
      var u2 = `https://webcomics.jp/search?q=${(aut.autrep())}`
      var l = aut != "-" ? `data-keyr="open:${u}"` : ""
      var e = adja(eleget0('//div[@id="side"]'), "afterbegin", `<div class="autsearchele ignoreMe" style="font-size:150%; padding: 0.5em; border: outset #aaa 2px; border-radius: 5px;"><a id="auta" href="${u}" title='左クリック：このキーワードを検索\n右クリック：開かずにキーワードを変更' >${aut.autrep().sanit()}</a> を検索 <span title="左クリック/e：お気に入りワードを追加\n右クリック/Shift+E：全設定値を編集" style="cursor:pointer;" data-key="e" data-keyr="Shift+E">&#128458;</span></div>`)?.childNodes[0]
      elegeta('#auta,#changeaut').forEach(e => {
        e.addEventListener("click", v => {
          db.favo = pref('db.favo') || [];
          if (!db.favo.length) return
          db.favo.push(db.favo.shift())
          pref('db.favo', db.favo)
          autsearch()
        })
        e.addEventListener("mouseup", v => {
          if (v.button == 0) return
          setTimeout(() => {
            db.favo = pref('db.favo') || [];
            if (!db.favo.length) return
            db.favo.push(db.favo.shift())
            pref('db.favo', db.favo)
            autsearch()
          }, 17)
          if (v.button != 1) { v.preventDefault(); return false; }
        })
        e.addEventListener("contextmenu", v => { v.preventDefault(); return false })
      })
    } else {
      var e = adja(eleget0('//div[@id="side"]'), "afterbegin", `<div class="autsearchele ignoreMe"><span title="左クリック/e：お気に入りワードを新規作成\n右クリック/Shift+E：全設定値を編集" style="cursor:pointer;" data-key="e" data-keyr="Shift+E">&#128458;</span></div>`)?.childNodes[0]
    }
  }

  function run(node = document) { // run::
    autsearch()
    elegeta('.autele', node).forEach(v => v.remove())

    // 一覧画面
    elegeta('.entry', node).forEach(v => {
      var title = eleget0('.entry-title>a:first-child', v)?.textContent?.trim()
      var aut = db.manga.find(v => v.t === title)?.a
      if (aut == "-") {
        adja(eleget0('.entry-date', v), "beforeend", `<span data-author="${encodeURI(aut)}" class="autele aut" style="cursor:pointer;font-size:12px; margin:0 0 0 1em; color:#444;">${aut.sanit()}</span>`)
      } else if (aut) {
        var memo = db.favo.includes(aut.autrep()) // 加工後の作者名で記憶する
        var u = `https://webcomics.jp/search?q=${encodeURI(aut.autrep())}`
        var l = aut != "-" ? `data-keyr="open:${u}"` : ""
        adja(eleget0('.entry-date', v), "beforeend", `<span data-author="${encodeURI(aut)}" ${memo?'data-gakusai="1"':''} class="autele aut${memo?' fav':''}" title='${aut}\nクリック/a：作者をお気に入りに追加/解除' data-key="a" style=" cursor:pointer; ${memo?"color:#00f;":"color:#444;"}font-size:12px; margin:0 0 0 1em;">${memo?"●":"○"}</span><a href="${u}" data-author="${encodeURI(aut)}" class="autele aut autname" title='${aut.sanit()}\n左クリック：作者を検索\na：作者をお気に入りに追加/解除' style=" ${memo?"color:#00f;font-weight:bold;":"color:#444;"}font-size:12px; margin:0 0 0 0.25em;">${aut.autrep().sanit()}</a>`)
      } else {
        adja(eleget0('.entry-date', v), "beforeend", `<span data-key="d" title="d：作者を取得\na：作者をお気に入りに追加" class="autele autq${v.dataset.queue?" waiting":""}" style="cursor:pointer;font-size:12px; margin:0 0 0 1em; ${memo?"color:#00f;font-weight:bold;":"color:#444;"}">？</span>`)
      }
    })

    // 詳細画面
    var aut = $('div.comic-info-right div.comic-author')?.text()?.replace("作者: ", "")?.trim() || "-"
    var tit = eleget0('//div/div/div/div[@class="comic-title"]/h2/a[1]')?.textContent?.trim()
    if (aut && tit) {
      if (aut == "-") {
        adja(eleget0('.comic-info'), "afterbegin", `<span data-author="${encodeURI(aut)}" class="autele aut" style="float:right; font-size:12px; margin:0 0 0 1em; color:#444;">${aut.sanit()}</span>`)
      } else if (aut) {
        var memo = db.favo.includes(aut.autrep()) // 加工後の作者名で記憶する
        var u = `https://webcomics.jp/search?q=${encodeURI(aut.autrep())}`
        var l = aut != "-" ? `data-keyr="open:${u}"` : ""
        V && notify(aut, memo)
        adja(eleget0('.comic-info'), "afterbegin", `<span class="autele" style="float:right; "><span data-author="${encodeURI(aut)}" class="aut" title='${aut}\nクリック/a：作者をお気に入りに追加/解除' data-key="a" style=" cursor:pointer; ${memo?"color:#00f;":"color:#444;"}font-size:12px; margin:0 0 0 1em;">${memo?"●":"○"}</span><a href="${u}" data-author="${encodeURI(aut)}" class="autele aut autname" title='${aut}\n左クリック：作者を検索\na：作者をお気に入りに追加/解除' style=" ${memo?"color:#00f;font-weight:bold;":"color:#444;"}font-size:12px; margin:0 0 0 0.25em;">${aut.autrep().sanit()}</a></span>`)
      }
    }

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
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return []; }
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (!/^\.?\//.test(xpath)) return /:inscreen$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:inscreen$/, ""))].filter(e => { var eler = e.getBoundingClientRect(); return (eler.top > 0 && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < document.documentElement.clientHeight) })[0] ?? null : /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight)[0] ?? null : node.querySelector(xpath.replace(/:visible$/, ""));
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

  function notify(body, title = "") {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") new Notification(title, { body: body });
    else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function gettime(_fmt = 'YYYY/MM/DD hh:mm:ss.iii', _dt = new Date()) {
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

  function sortableTH(selector = "th", cb = () => {}) { // 重複して何度呼んでも大丈夫
    elegeta(selector).filter(e => !sortableTH?.titled?.has(e)).forEach(e => {
      e.title = `${e?.title?e.title+"\n":""}並べ替え：左クリックで昇順、右クリックで降順`;
      e.addEventListener("contextmenu", e => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }, true)
      sortableTH.titled = (sortableTH.titled || new Set()).add(e) // 1度やったのを記憶
    })
    if (!sortableTH?.added?.has(selector + cb?.toString())) { // 呼ばれたのは初めて
      document.addEventListener("mousedown", e => { // ソート
        if (!e?.target?.matches(selector)) return;
        let c = e?.target?.cellIndex;
        let tablebottom = e.target.closest('tbody')
        var table = e.target.closest('table')
        let collator = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
        var trs = Array.from(table.rows).slice(1).sort((a, b) => collator.compare(a.cells[c].textContent, b.cells[c].textContent) * (e.button ? -1 : 1))
        trs.forEach(tr => tablebottom.appendChild(tr))
        cb();
      })
    }
    if (!sortableTH?.added?.has(selector + cb?.toString())) document.head.insertAdjacentHTML("beforeend", `<style>${selector} {cursor:pointer;}</style>`); // この引数は初めて
    sortableTH.added = (sortableTH.added || new Set()).add(selector + cb?.toString()) // 1度やったのを記憶
  }

  // Tableの縦罫線をドラッグで動かす
  function setDragCol(dragTarget = "td,th", GRABBABLE_WIDTH_PX = 8) {
    if (setDragCol?.done) return;
    else setDragCol.done = 1; // 1度しかやらない
    document.addEventListener('mousedown', startResize, true);
    document.addEventListener('mousemove', function f(e) {
      let pare = e?.target?.nodeType == 1 && e?.target?.closest(dragTarget)
      if (pare && (e.clientX - pare.getBoundingClientRect().right > -GRABBABLE_WIDTH_PX)) {
        if (document.body.style.cursor != 'col-resize') document.body.style.cursor = 'col-resize';
      } else {
        if (!setDragCol.ingrab && document.body.style.cursor != 'default') document.body.style.cursor = 'default'
      }
    });

    function startResize(e) {
      let pare = e?.target?.nodeType == 1 && e?.target?.closest(dragTarget)
      if (!pare) return;
      if (pare?.getBoundingClientRect()?.right - e?.clientX > GRABBABLE_WIDTH_PX) return;

      e.preventDefault();
      e.stopPropagation();
      let startX = e.clientX;
      let startWidth = parseFloat(getComputedStyle(pare).getPropertyValue('width'))
      setDragCol.ingrab = 1;
      document.addEventListener('mousemove', dragColumn);
      document.addEventListener('mouseup', endDrag);
      return false;

      function dragColumn(em) {
        if (["TD", "TH"].includes(pare.tagName)) {
          [...pare.closest("table").querySelectorAll(`:is(td,th):nth-child(${pare.cellIndex + 1})`)].forEach(cell => {
            cell.style.width = `${startWidth + em.clientX - startX}px`;
            cell.style.overflowWrap = "anywhere";
            //cell.style.whiteSpace = "break-spaces";
            cell.style.whiteSpace = "initial";
            cell.style.wordWrap = "break-word";
            cell.style.minWidth = `0px`;
            cell.style.maxWidth = `${Number.MAX_SAFE_INTEGER}px`;
          })
        } else {
          pare.style.resize = "both";
          pare.style.overflow = "auto"
          pare.style.width = `${startWidth + em.clientX - startX}px`;
          pare.style.minWidth = `0px`;
          pare.style.maxWidth = `${Number.MAX_SAFE_INTEGER}px`;
        }
      }

      function endDrag() {
        document.removeEventListener('mousemove', dragColumn);
        document.removeEventListener('mouseup', endDrag);
        setDragCol.ingrab = 0;
      };
    }
  }

  function cbOnce(cb) { // callbackを初回に呼ばれたときの１回だけ実行し２度め以降はしない ※要ルートブロックに設置
    let cbstr = cb.toString();
    if (cbOnce?.done?.has(cbstr)) return;
    cbOnce.done = (cbOnce.done || new Set()).add(cbstr)
    cb()
  }

  function waitFrame() { return new Promise(resolve => requestAnimationFrame(resolve)) }
  // element.dataset.gmDataListプロパティにclassList.add/removeのような命令セット
  function gmDataList_add(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    if (!data.includes(name)) {
      data.push(name);
      ele.dataset.gmDataList = data.join(" ")
    }
  }

  function gmDataList_remove(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    if (data.includes(name)) {
      data = data.filter(v => v !== name)
      if (data.length) ele.dataset.gmDataList = data.join(" ");
      else delete ele.dataset.gmDataList;
    }
  }

  function gmDataList_includesPartial(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    return data.find(v => v.includes(name))
  }

  function ct(callback, name = "test", time = 10) { let i = 0; let st = Date.now(); while (Date.now() - st < 1000) { i++, callback() } console.log(`${name} ${i}回実行 / 1sec , ${1000/i}ミリ秒/１実行 ${callback.toString().slice(0,88)}`) } // 速度測定（一瞬で終わるもの）

})()