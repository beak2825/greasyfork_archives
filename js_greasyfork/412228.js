// ==UserScript==
// @name Library-ycl-kpl-custom
// @description 横浜市立図書館の蔵書検索サイトを見やすく
// @match *://opac.lib.city.yokohama.lg.jp/*
// @version 0.2
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @compatible  Firefox
// @require https://code.jquery.com/jquery-3.6.1.min.js
// @require https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @run-at document-idle
// @namespace https://greasyfork.org/users/690966
// @downloadURL https://update.greasyfork.org/scripts/412228/Library-ycl-kpl-custom.user.js
// @updateURL https://update.greasyfork.org/scripts/412228/Library-ycl-kpl-custom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const days_borrow_city = 14;
    const days_borrow_pref = 21;
    const days_keep_city = 7;
    const days_keep_pref = 7;
    const ms_expire_reserved = 1000 * 60 * 60; // 予約人数キャッシュを破棄する基本ms

    var historyFix = false;
    const max_history_rows = function() { return (historyFix ? Number.MAX_SAFE_INTEGER : u("https://opac.lib.city.yokohama.lg.jp/opac/OPP1000") ? 100 : document.documentElement.clientHeight / 30 - 3 - 5) }; // 負荷制限のため利用状況画面以外では画面に入る件数まで/利用状況画面で100件まで/固定時は全件
    var focused = false;
    var userid = `U${btoa(unescape(encodeURIComponent((getElementByXPath('//div[@id="inlinelogin_form"]/p[@class="navbar-text"]')?.textContent?.match(/図書館カード番号:([0-9]{10})はログイン中です。/)?.[1]||""))))}_`.replace(/\+|\/|\=/gm, "_")

    String.prototype.LYChan = function() { return this.replace(/　+|\s+/g, " ").replace(/[！-｝]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); }) }
    String.prototype.LYCsanitize = function() { return this.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>") }
    Element.prototype.LYCafterend = function(v) { this.insertAdjacentHTML('afterend', v); return this.nextElementSibling }
    Element.prototype.LYCbeforeend = function(v) { this.insertAdjacentHTML('beforeend', v); return this.lastChild }

    var Info = {
        data: {
            reserve: [], // {[title],reserve:{reserve,available,resource,expire,desc},time}
            borrowed: [], // {[title],time,note}
            searchform: [], // [{slot:0-9,summary:[],form:[]}]
        },
        setForm: function(slot, table, summary) {
            this.data.searchform = this.data?.searchform?.filter(v => v?.slot != slot)
            this.data?.searchform?.push({ slot: slot, form: table, summary: summary })
            this.save()
            return
        },
        getForm: function(slot) {
            return this.data?.searchform?.find(v => v?.slot == slot)?.form || []
        },
        deleteForm: function(slot) {
            this.load()
            this.data.searchform = this.data?.searchform?.filter(v => v?.slot != slot)
            this.save()
        },
        getFormSummary: function(slot) {
            return this.data?.searchform?.find(v => v?.slot == slot)?.summary || []
        },
        set: function({ title, reserve = null, borrow = null, note = null, desc = null }) {
            if (reserve) {
                title = title.map(v => v.LYChan())
                this.data.reserve = this.data.reserve.filter(v => JSON.stringify(v.title) !== JSON.stringify(title))
                this.data.reserve.push({ title: title, reserve: reserve, time: Date.now() })
                this.data.reserve = (Array.from(new Set(this.data.reserve.map(v => JSON.stringify(v))))).map(v => JSON.parse(v))
            }
            if (borrow) {
                if ((this.data.borrowed.find(v => JSON.stringify(v.title) === JSON.stringify(title)))) return; // すでにあるものは上書きしない・最古の日付を残す
                this.data.borrowed = this.data.borrowed.filter(v => JSON.stringify(v.title) !== JSON.stringify(title))
                this.data.borrowed.push({ title: title, time: Date.now() })
            }
            if (note !== null) {
                let predata = this.data.borrowed.find(v => JSON.stringify(v.title) == JSON.stringify(title))
                if (!predata) { return }
                this.data.borrowed = this.data.borrowed.filter(v => JSON.stringify(v.title) !== JSON.stringify(title))
                //      if (note === "") this.data.borrowed.push({ title: title, time: time })
                this.data.borrowed.push({ title: predata?.title, time: predata?.time, note: note, desc: predata?.desc })
            }
            if (desc !== null) {
                title = title[0]?.split(/\s|　/)[0]?.trim()?.LYChan()
                let predata = this.data.borrowed.find(v => v.title[0] == title)
                if (!predata) { return }
                this.data.borrowed = this.data.borrowed.filter(v => v.title[0] !== title)
                this.data.borrowed.push({ title: predata?.title, time: predata?.time, note: predata?.note, desc: desc })
            }
            this.save()
        },
        countReserve: function() {
            return this.data.reserve.length
        },
        countBorrow: function() {
            return this.data.borrowed.length
        },
        deleteBorrow: function(title) {
            this.load()
            if (title == "all") { this.data.borrowed = [] } else { this.data.borrowed = this.data.borrowed.filter(v => v.title?.join(" ") !== title) }
            this.save()
        },
        deleteReserve: function() {
            this.load()
            this.data.reserve = []
            this.save()
        },
        getReserve: function(title) {
            let v = this.data.reserve.find(v => v.title.every(w => title.indexOf(w.LYChan()) !== -1)) || null;
            return [v?.title, v?.reserve, v?.time]
        },
        getBorrow: function(title) {
            let v = this.data.borrowed.find(v => !v?.used && v.title.every(w => title.indexOf(w.LYChan()) !== -1)) || null;
            if (v) v.used = 1
            return [v?.title, v?.time, v?.note]
        },
        getBorrowList: function() {
            return this.data.borrowed
        },
        save: function() {
            this.data.reserve = this.data.reserve.reduce((a, v) => { if (!a.some(e => (e.title.join() === v.title.join()))) { a.push(v); } return a; }, []);
            this.data.reserve.sort((a, b) => a.title.join("").length > b.title.join("").length ? -1 : 1) // 誤判定を少しでも減らすため長いタイトルのものを早く出るようにソートする
            this.data.borrowed.sort((a, b) => a.title.join("").length > b.title.join("").length ? -1 : 1) // 誤判定を少しでも減らすため長いタイトルのものを早く出るようにソートする
            GM_setValue(userid + "Info", JSON.stringify(this.data))
        },
        load: function() {
            this.data = JSON.parse(GM_getValue(userid + "Info") || '{ "reserve":[], "borrowed":[],"searchform":[] }');
            this.data.reserve = this.data.reserve.filter(v => Date.now() < (v?.reserve?.expire || 0)) // ms_expire_reserved＋借りにくさ*1日
        },
    }
    Info.load()

    // 詳細画面：予約待ち状況を記憶
    if (u(/opac.lib.city.yokohama.lg.jp\/opac\/OPP1500/i)) {
        /*    for (let i = 0; i < 7; i++) {
              setTimeout(() => {
        */
        setDesc()

        function setDesc() {
            let resource = getElementsByXPath('//tr[@class="data-list"]/td[1]')?.length || 1;
            let available = getElementsByXPath('//td[@align="LEFT" and text()="書架"]')?.length || 0
            let reserve = getElementByXPath('//div[@class="panel-body"]/div')?.innerText?.replace(/([\s\S]*)予約数\s*(\d+)\s*人([\s\S]*)/m, "$2")
            let title = [...getElementsByXPath('//dt[@class="hidden-xs" and text()="タイトル　"]/following-sibling::dd[1]|//div[1]/dl/dt[text()="著者名等　"]/following-sibling::dd[1]|//div[1]/dl/dt[@class="hidden-xs" and text()="出版　　　"]/following-sibling::dd[1]|//dl[contains(@class,"dl-horizontal")]/dt[contains(text(),"巻号名　　")]/following-sibling::dd[1]').map(v => v?.innerText?.trim()?.replace(/[ 　]+≪再検索≫/gm, "")?.replace(/．[０-９]+$/, "")?.LYChan())]
            let easiness = -Math.min(0, resource - (resource - available) - reserve / resource)
            //let expire = Date.now() + Math.max(ms_expire_reserved, easiness * 1000 * 60 * 60 * 24) // 可能なら１時間
            let expire = Date.now() + Math.max(ms_expire_reserved * ((resource - (resource - available)) || 1), easiness * 1000 * 60 * 60 * 24); // 可能冊数＊１時間
            //let explain = ['//dt[contains(@class,"hidden-xs") and contains(text(),"内容")]/following-sibling::dd[1]','//dt[contains(@class,"hidden-xs") and contains(text(),"要旨")]/following-sibling::dd[1]'].map(v => getElementByXPath(v)?.textContent?.replace(/\s+/g, " ")?.trim()?.LYChan())?.join(" ")
            let explain = !dq('div.panel-body.dtil-body0')?.innerText?.match(/雑誌コード/) ? "" : ['//dt[contains(@class,"hidden-xs") and contains(text(),"内容")]/following-sibling::dd[1]'].map(v => getElementByXPath(v)?.textContent?.replace(/\s+/g, " ")?.trim()?.LYChan())?.join(" ")
            if (title.length && /^[0-9]+$/.test(reserve)) {
                Info.load()
                Info.set({ title: title, reserve: { reserve: +reserve, available: available, resource: resource, expire: expire, explain: explain } })

                var desc = {}
                desc.author = ['//dt[contains(@class,"hidden-xs") and contains(text(),"著者名等")]/following-sibling::dd[1]'].map(v => getElementByXPath(v)?.textContent?.replace(/≪再検索≫|／著|／〔著〕|／語り/g, "")?.trim()?.LYChan())?.join(" ")
                desc.kenmei = ['//dt[contains(@class,"hidden-xs") and contains(text(),"件名")]/following-sibling::dd[1]'].map(v => getElementByXPath(v)?.textContent?.replace("≪再検索≫", "")?.trim()?.LYChan())?.join(" ")
                desc.ndc = ['//dt[contains(@class,"hidden-xs") and contains(text(),"ＮＤＣ分類")]/following-sibling::dd[1]'].map(v => getElementByXPath(v)?.textContent?.replace("≪再検索≫", "")?.trim()?.LYChan())?.join(" ")
                var maintitle = getElementByXPath('//dt[@class="hidden-xs" and text()="タイトル　"]/following-sibling::dd[1]')?.textContent?.trim()
                Info.set({ title: [maintitle], desc: desc }) //alert(desc)

            } else { setTimeout(() => setDesc, 500) }
            //      }, i * (500 + Math.random() * 1000))
        }
    }

    // クリック処理
    var statToggle = 0
    document.addEventListener("click", function(e) {
        if (e?.target?.closest(".borrowed")) {
            //      var t = decodeURI(e?.target?.dataset?.title || "")
            var t = decodeURIComponent(e?.target?.dataset?.title || "")
            if (t && confirm(`${t}\n\nを借り出し履歴から削除しますか？`)) {
                Info.deleteBorrow(t)
                searchs()
                updateHistory()
            }
        }
        // 借りやすさフィルタ
        let s = e?.target?.dataset?.stats
        if (s !== undefined) {
            if ((++statToggle) % 2) {
                $(".reserve_stats-1").closest(".row").hide(250)
                $(".borrowed").closest(".row").hide(250)
            } else {
                $(".borrowed").closest(".row").show(250)
                $(".reserve_stats-1").closest(".row").show(250)
            }
        }
    })

    GM_addStyle(":focus { box-shadow: 0px 0px 10px 10px rgba( 255, 128,0, 0.4)!important; }")

    GM_addStyle(".radio, .checkbox { position: relative; display: block; margin-top: 0px; margin-bottom: 0px;}")
    if (document.body.parentNode.innerHTML.match(/図書館カレンダー/)) {
        let element = getElementByXPath('//font[@style="font-size:130%;"]/b');
        if (element) element.style.boxShadow = " 0px 0px 5px 5px rgba( 0, 128,255, 0.3)";
    }

    // 市立県立　確認画面
    focusByXPath("//input[contains(@value,'上記について確認しました')]");
    focusByXPath('//button[@value="上記について確認しました"]')
    focusByXPath('//button[@type="SUBMIT" and @value="初期画面に戻る" and @class="btn btn-default"]')

    // ESCで簡易検索フォームにフォーカス
    document.addEventListener("keydown", function(e) {
            if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
            if (e.which == 27) focusByXPath('//input[contains(@placeholder,"キーワード")]|//input[@type="TEXT" and @name="WORD"]|//input[@type="text" and @name="WORD" and @value="キーワード"]');
        },
        false);

    if (u(/.htm/)) return;

    var col = 1 ? "class='btn btn-primary dtil-btn'" : "background-color:#ffaaaa;";

    // 県立＋市立：中ペイン広く
    var element = getElementByXPath('//article[@class="col-xs-12 col-sm-9 col-md-9 col-lg-7"]|//article[@class="col-xs-12 col-sm-7 col-md-7 col-lg-7"]');
    if (element) element.style.width = "70%";
    /*  if (element) element.style.width = "75%";
    var element = getElementByXPath('//body/aside');
      if (element) element.style.width = "20%";
    */
    // AP
    DOMNodeInserted();
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(e) {
        DOMNodeInserted(e.target);
    }, false);

    // 書籍詳細：アコーディオンを開く
    clickByXPath('//a[@id="acord"]', /検索結果詳細表示｜横浜市立図書館蔵書検索ページ/);

    // 書籍詳細：市立：現在の予約人数の字を大きく
    var num = document.body.parentNode.innerHTML.match(/現在の予約数(\d*)人/);
    if (num) {
        var str = getElementByXPath("//div[contains(text(),'現在の予約数')]").innerHTML;
        getElementByXPath("//div[contains(text(),'現在の予約数')]").innerHTML = str.replace(/現在の予約数\d*人/gmi, "現在の予約数 <B><big><big><big>" + num[1] + "</big></big></big></b> 人");
        getElementByXPath('//div[@class="panel-body dtil-body1"]/div/font/font[contains(text(),"所蔵情報")]|//font[1]/font[contains(text(),"所蔵情報")]')?.LYCafterend(`　<small>（現在の予約数 ${num[1]} 人）</small>`);
    }

    // 書籍詳細：ISBNがあればカーリルとAmazonボタン
    var isbn = getElementByXPath('//dl/dt[contains(text(),"ＩＳＢＮ")]/following-sibling::dd[1]')?.textContent?.trim()?.match(/([0-9X\-])+$/)?.[0]?.replace(/[^0-9X]/g, "")?.match(/^([0-9X]{10,13})$/)?.[1];
    isbn && getElementByXPath('//div[@class="panel-body"]/..')?.LYCbeforeend(`<span style='float:right;'><a href="https://calil.jp/local/search?csid=kanagawa&q=${isbn}" rel="noopener noreferrer nofollow" style=" margin:8px 4px; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;" ${col}><font color='#fff'>カーリルで検索</font></a></span>`)
    var asin = isbn?.match(/^978(\d{9})\d$/)?.[1]?.split("")
    if (asin) {
        var sum = asin[0] * 10 + asin[1] * 9 + asin[2] * 8 + asin[3] * 7 + asin[4] * 6 + asin[5] * 5 + asin[6] * 4 + asin[7] * 3 + asin[8] * 2;
        asin = "" + (asin.join("")) + ((11 - (sum % 11)) == 10 ? "X" : (11 - (sum % 11)) == 11 ? "0" : (11 - (sum % 11)))
    }
    (asin || isbn) > "" && addSpanHTML(getElementByXPath('//div[@class="panel-body"]/..'), `<a href="https://www.amazon.co.jp/dp/${asin||isbn}" rel="noopener noreferrer nofollow" style=" margin:8px 4px; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;" ${col}><font color='#fff'>Amazonで見る</font></a>`)

    // 簡易検索にフォーカス
    focusByXPath('//input[contains(@placeholder,"キーワード")]|//input[@type="TEXT" and @name="WORD"]|//input[@type="text" and @name="WORD" and @value="キーワード"]', /お知らせ｜横浜市立|利用状況｜横浜市立|お知らせ｜神奈川県立|利用状況表示｜神奈川県立/);

    // 新着資料照会のデフォルト
    changeValue("//select[contains(@name,'N_RANGE')]", "15", /新着資料照会｜横浜市立図書館蔵書検索ページ|新着資料照会｜神奈川県立図書館OPAC/); // 2週間
    changeValue("//select[contains(@name,'N_VIEW')]", "300", /新着資料照会｜横浜市立図書館蔵書検索ページ|新着資料照会｜神奈川県立図書館OPAC/); // x
    focusByXPath("//button[@value='表示']", /新着資料照会｜横浜市立図書館蔵書検索ページ|新着資料照会｜神奈川県立図書館OPAC/);
    changeValue("//select[@name='N_ORDER']", "D", /新着資料照会結果一覧｜横浜市立図書館蔵書検索ページ/); // 降順　※県立には年順がない
    changeValue("//select[@name='N_ITEM']", "4", /新着資料照会結果一覧｜横浜市立図書館蔵書検索ページ/); // 出版年順　※県立には年順がない
    focusByXPath('//button[@name="SEARCH" and @value="更新" and @class="btn btn-primary"]', /新着資料照会結果一覧｜横浜市立図書館蔵書検索ページ|新着資料照会結果一覧｜神奈川県立図書館OPAC/);

    // 県立市立 詳細検索入り口の項目を「全項目」にしフォームにフォーカス
    changeValue('//select[@name="TERM5"]', "INDEX-0", /詳細検索｜横浜市立図書館蔵書検索ページ/); // 『全項目」
    focusByXPath('//input[@type="TEXT" and @name="WORD5"]', /詳細検索｜横浜市立図書館蔵書検索ページ/); // フォーム
    focusByXPath('//input[@type="TEXT" and @name="WORD8"]', /詳細検索｜神奈川県立図書館OPAC/); // フォーム
    // 検索結果一覧表示を新しい順指定に
    focusByXPath("//button[@type='SUBMIT'][contains(.,'並べ替え')]", /検索結果一覧表示｜横浜市立図書館蔵書検索ページ|検索結果一覧表示｜神奈川県立図書館OPAC/);
    changeValue('//select[@title="並び順"]', "DESC", /検索結果一覧表示｜横浜市立図書館蔵書検索ページ|検索結果一覧表示｜神奈川県立図書館OPAC/); // 降順
    changeValue('//select[@title="項目順"]', "SORT4-F", /検索結果一覧表示｜横浜市立図書館蔵書検索ページ|検索結果一覧表示｜神奈川県立図書館OPAC/); // 出版年順

    // 自動ログインの設定
    var autoLogin = GM_getValue("autoLogin") || false;

    function changeAutoLogin() {
        GM_setValue("autoLogin", !(GM_getValue("autoLogin") || false));
        location.reload();
    }

    // IDとパスワードが入力済みならログインボタンを押す
    setTimeout(() => {
        if (autoLogin && $('input[name="USERID"]').val() && $('input[name="PASSWORD"').val() && $('button#loginbtn').length) {
            if (getElementByXPath('//div[@class="alert alert-danger"]')) {
                autoLogin = false;
                GM_setValue("autoLogin", false);
            } else {
                $('button#loginbtn').focus().trigger("click");
            }
        } else {
            //focusByXPath('//button[@id="loginbtn" and @type="submit" and @name="LOGIN"]');
            //focusByXPath('//input[@type="SUBMIT" and @name="LOGIN" and @value="ログイン"]');
        }
        GM_registerMenuCommand("自動ログインを" + (autoLogin ? "無効" : "有効") + "にする" + `（現在${(!autoLogin ? "無効" : "有効")}）`, changeAutoLogin);
    }, 1500);

    // 利用状況：回送中、受取可に着色
    for (let cell of getElementsByXPath('//td[contains(text(),"受取可")]')) {
        cell.style.backgroundColor = "#e0f0ff";
        cell.style.color = "#0000ff";
        cell.style.fontWeight = "900";
        notifyElement(cell, getElementByXPath(location.href.indexOf(".pref.") != -1 ? './/td[6 or 7][contains(text(),"図書館") or contains(text(),"カウンター")]' : './/td[7 or 8][contains(text(),"図書館")]', cell.parentNode));
    }
    for (let cell of getElementsByXPath('//td[contains(text(),"回送中")]')) {
        cell.style.backgroundColor = "#ffffd0";
        cell.style.color = "#404000";
        cell.style.fontWeight = "900";
    }

    // 利用状況：予約が入っている資料です。
    $('td:nth-of-type(5):contains("予約が入っている資料です。"),td:nth-of-type(6):contains("予約が入っている資料です。"),td:nth-of-type(5):contains("他の予約者がいます"),td:nth-of-type(6):contains("他の予約者がいます")').append('<BR><span class="label label-danger">最優先で読んで返しましょう</span>');
    $('td:nth-of-type(5):contains("貸出中(延長不可)"),td:nth-of-type(6):contains("貸出中(延長不可)"),td:nth-of-type(5):contains("貸出中(延長不可)"),td:nth-of-type(6):contains("貸出中(延長不可)")').css({ 'background-color': '#ff000010' });

    // 利用状況：借りている本を記憶
    var borrows = getElementsByXPath('//form[1]/table/tbody/tr[@class="middleAppArea"]/td[last()-1]/a[@class="linkcolor_v"]')
    if (borrows.length) {
        borrows.forEach(cell => {
            Info.set({ title: cell?.innerText?.LYChan()?.split("/")?.map(v => v?.trim()), borrow: 1 })
        })
        Info.save()
    }

    // 利用状況：返却期限にプログレスバー
    getElementsByXPath('//form[1]/table/tbody/tr[@class="middleAppArea"]/td[last()-2]').forEach(cell => putProgressBar(cell, cell.innerText, days_borrow_city))
    getElementsByXPath('//form[1]/table[@style="table-layout:fixed;" and @cellpadding="3" and @border="0"]/tbody/tr/td[last()-2]').forEach(cell => putProgressBar(cell, cell.innerText, days_borrow_pref))
    // 利用状況：受取期限にプログレスバー
    getElementsByXPath('//form[2]/table[@cellpadding="0"]/tbody/tr[@class="middleAppArea"]/td[last()-4]').forEach(cell => putProgressBar(cell, cell.innerText.match(/\n(\d\d\d\d\/\d\d\/\d\d)/g), days_keep_city))
    getElementsByXPath('//div[@class="panel panel-primary" and @style=";"]/div[last()]/form[2]/table/tbody/tr/td[last()-4]').forEach(cell => putProgressBar(cell, cell.innerText.match(/\n(\d\d\d\d\/\d\d\/\d\d)/g), days_keep_pref))

    // 利用状況：プログレスバー設置
    function putProgressBar(cell, cellText, limit) {
        if (cellText) {
            let cellDate = new Date(cellText);
            let nowDate = new Date();
            let remain = Math.ceil((cellDate - nowDate) / (1000 * 60 * 60 * 24));
            let imminent = Math.max(0, Math.min(1, 1 - remain / (limit + 1)));
            if (imminent > 0) {
                let col = ((imminent > 0.66) ? 'progress-bar-danger' : (imminent > 0.33) ? 'progress-bar-warning' : '');
                cell.innerHTML = cell.innerHTML + ('<br><span class="progress" style="height:0.5em;"><div class="progress-bar ' + col + ' progress-bar-striped active" role="progressbar" aria-valuenow="' + imminent * 100 + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + imminent * 100 + '%;height:0.5em;" title="残り' + remain + '日"></div></span>');
                cell.style.color = "rgb(" + imminent * 255 + ",0,0)";
            }
        }
    }

    var updateHistory = () => {}
    // ＊：借り出し履歴を表示
    if (dq('button#logoutbtn') && u("/OPP0100|/OPP0200|/OPP0700|/OPP1000|/OPP1200|/OPP1400|/OPP1500")) {
        GM_addStyle(`#historytable table{width:auto !important;font-size:14px;} #historytable td,#historytable th{ padding:0.33em 1em; white-space:nowrap; border:1px solid #aaa; } #historytable th{background-color:#dde0ff;} #historytable {all:initial; z-index:100 !important; position:fixed; right:1em; bottom:6em; overflow:auto; background-color:#fffffff0; padding:2em; border-radius:0.5em; border:2px solid #aaa; box-shadow:3px 3px 11px #0004; text-align:center; margin:auto; max-height:1em !important; max-width:1em !important; transition:all 0.33s ease-out !important;} #historytable:hover{background-color:#ffffffff; max-height:calc(100% - 12em) !important; max-width:calc(100% - 7em) !important;} #historytable .historynote{cursor:pointer;} #historytable td:first-child,#historytable th:first-child{text-align:center} .borrowedTitle,.ctc,#historytable th{cursor:pointer;} #historytable.fix {all:initial;background-color:#ffffffff; padding:3em; overflow:auto; } #historytable.fix th{background-color:#dde0ff;position: sticky; top: 0;} #historytable.fix .historynote{white-space:break-spaces;} `)

        document.addEventListener("paste", function(e) {
            if (!e.target.matches('*[contenteditable]')) return
            e.preventDefault()
            document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"))
        })
        var updateHistory = () => {
            var list = Info.getBorrowList()
            var startno = Math.max(list.length - parseInt(max_history_rows()), 0)
            var history = list.map(v => {
                var date = new Date(v?.time)
                return [v?.title?.join(" "),
                    `${v?.time}`,
                    `${date?.getFullYear()}/${((date?.getMonth()+1)?.toString()?.padStart(2,"0"))}/${date?.getDate()?.toString()?.padStart(2,"0")}`,
                    v?.note || "",
                    escape(JSON.stringify(v?.title)) || "",
                    v?.desc || {}
                ]
            })
            history.sort((a, b) => a[1] == b[1] ? 0 : a[1] > b[1] ? 1 : -1)
            history = history.slice(startno);

            var table = `<div id="historytable"><table style="text-align:initial; margin:auto; min-width:40%; max-width:80%; max-height:80%; "><tr><th data-order="1">&#x1f5d1;</th><th>資料名</th><th title="書名が短い場合、誤判定かもしれません">著者</th><th title="書名が短い場合、誤判定かもしれません">件名</th><th title="書名が短い場合、誤判定かもしれません" style="min-height:7em;">日本十進</th><th data-order="1">確認日</th><th style="min-height:4em;">覚書</th><tbody>`
            history.forEach((v, i) => table += `<tr><td class="borrowedTitle" title="履歴を削除" data-title="${escape(v[0])}">${startno+i+1}</td><td><span class="ctc">${v[0]?.LYCsanitize()}<\/span><\/td><td class="ctc">${(v[5]?.author?.LYCsanitize())||""}<\/td><td class="ctc">${(v[5]?.kenmei?.LYCsanitize())||""}<\/td><td class="ctc">${(v[5]?.ndc?.LYCsanitize())||""}<\/td><td>${v[2]?.LYCsanitize()||""}<\/td><td contenteditable class="historynote" id="editnote${v[4]}">${v[3]?.LYCsanitize()}<\/td><\/tr>`)
            table += `<\/tbody><\/table><span id="hisend"></span><\/div>`

            $("#historytable").remove()
            document.body.LYCbeforeend(table)
            dq("#hisend").scrollIntoView()

            if (Info.countBorrow()) {
                $("deleteborrow").remove()
                dq("#historytable")?.LYCbeforeend(`<span id="deleteBorrow" class='btn btn-primary btn-sm' title="借り出し履歴を全て破棄します" style="cursor:pointer; font-size:1em; margin:1em 0 0 1em; z-index:999999; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:1em;">借り出し履歴（${Info.countBorrow()}）を破棄</span>`)
                dq(`#deleteBorrow`)?.addEventListener("click", (e) => {
                    if (confirm(`借り出し履歴(${Info.countBorrow()})を全て破棄しますか？`)) Info.deleteBorrow("all")
                })
            }

            if (historyFix) $('#historytable').toggleClass('fix');
            if (u('/opac/OPP1000')) {
                $(`<span id="fixhistorytable" class='btn btn-warning btn-sm' title="借り出し履歴を固定↔浮遊表示" style="cursor:pointer; font-size:1em; margin:1em 0 0 1em; z-index:999999; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:1em;">固定↔浮遊</span>`).click(e => {
                    historyFix = !historyFix
                    updateHistory()
                    $(window).scrollTop($('#fixhistorytable').position().top);
                }).appendTo('#historytable')
            }
        }
        updateHistory()
        $(document).on("click", "#historytable table th", function(e) { // ソート
            //$('#historytablesortmark').remove();
            $(e.target).effect("highlight")
            e.target.dataset.order = 1 - (e.target.dataset.order || 0)
            let c = e?.target?.cellIndex;
            let tablebottom = dq('#historytable table tbody')
            var table = dq('#historytable table')
            let collator = new Intl.Collator("ja", { numeric: true, sensitivity: 'base' })
            var trs = Array.from(table.rows).slice(1).sort((a, b) => collator.compare(a.cells[c].textContent, b.cells[c].textContent))
            if (e.target.dataset.order == 0) trs.reverse()
            trs.forEach(tr => tablebottom.appendChild(tr))
            //e.target.LYCbeforeend(`<span id="historytablesortmark" style="float:right;pointer-events:none;">${e.target.dataset.order==1?"↑":"↓"}</span>`)
        })
        $(document).on("click", ".ctc", function(e) {
            if (!e?.target?.textContent) return
            $(e.target).effect("highlight")
            $('input[name="WORD"]').effect("highlight")
            var t = e?.target?.textContent || "";
            dq('input[name="WORD"]')?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            $('input[name="WORD"]').val(t?.trim())
        })
        $(document).on("keypress", ".historynote", function(e) { if (e?.key == "Enter") e?.target?.blur() })
        $(document).on("blur", ".historynote", function() {
            let title = JSON.parse(unescape(this?.id?.replace(/^editnote/, "")));
            let note = this?.textContent || ""
            if (note !== null) {
                Info.set({ title: title, note: note });
                searchs()
            }
        })
        $(document).on("click", ".borrowedTitle", function(e) {
            var t = unescape(e?.target?.dataset?.title || "")
            if (t && confirm(`${t}\n\nを借り出し履歴から削除しますか？`)) {
                Info.deleteBorrow(t)
                searchs()
                updateHistory()
            }
        })
    }


    // 詳細検索：フォームをAlt+０～９で記録、０～９で復元
    var alt09 = function() {
        if (u(/https:\/\/opac.lib.city.yokohama.lg.jp\/opac\/OPP0200|https:\/\/www.klnet.pref.kanagawa.jp\/opac\/OPP0200/) && getElementByXPath('//button[@id="logoutbtn" and @class="btn btn-success navbar-btn"]')) {
            Info.load()
            $('#bl1,#bl2,.altb').remove();
            $('<div id="bl1"></div>').insertAfter(getElementByXPath('//div[@class="panel-heading"]'));
            $('<div id="bl2"></div>').insertAfter(getElementByXPath('//div[@class="panel-heading"]'));
            for (let i = 10; i > 0; i--) {
                let summary = (Info.getFormSummary(i % 10)?.join(" ")?.trim())?.LYCsanitize()
                $('<span  class="btn btn-primary altb" title="' + i % 10 + ' : スロット ' + i % 10 + ' から状態を復元\n' + summary + '" style="' + (Info.getForm(i % 10)?.length ? "" : "background-color:#888;") + 'margin:4px;">読' + i % 10 + '<span>').click(function() {
                    loadTable(i);
                    alt09();
                }).insertAfter("#bl1");
                $('<span  class="btn btn-warning altb" title="Alt+' + i % 10 + ' : スロット ' + i % 10 + ' に状態を記録\n' + summary + '" style="margin:4px;">録' + i % 10 + '<span>').click(function() {
                    saveTable(i);
                    alt09()
                }).on("contextmenu", () => { if (confirm(`スロット${i%10}\n${summary}\nを削除してよろしいですか？`)) saveTable(i, "reset"); return false }).insertAfter("#bl2");
            }
        }
    }
    alt09()
    if (u(/https:\/\/opac.lib.city.yokohama.lg.jp\/opac\/OPP0200|https:\/\/www.klnet.pref.kanagawa.jp\/opac\/OPP0200/) && getElementByXPath('//button[@id="logoutbtn" and @class="btn btn-success navbar-btn"]')) {
        document.addEventListener("keydown", function(e) {
            if (e.target.matches('input,textarea') || e.target.isContentEditable) return
            if (/^[0-9]$/.test(e.key) && e.altKey === true) {
                saveTable(e.key);
                alt09()
            }
            if (/^[0-9]$/.test(e.key) && e.altKey === false) {
                loadTable(e.key);
                alt09()
            }
        }, false);
    }

    function saveTable(slot, data = null) {
        var index = Number(slot % 10);
        var form = dqa('.panel-primary select,.panel-primary input')
        var table = []
        if (data == "reset") {
            Info.deleteForm(slot % 10)
            alt09();
            return;
        }
        if (form.length != 46) return
        for (let sel of form) {
            table.push(sel.value);
            table.push(sel.checked);
        }
        Info.setForm(slot % 10, table, dqa('.panel-primary input[type="TEXT"]').map(v => v?.value))
    }

    function loadTable(slot) {
        var form = dqa('.panel-primary select,.panel-primary input')
        if (form.length != 46) return
        var index = Number(slot % 10);
        var table = Info.getForm(slot % 10)
        if (!table.length) { /*alert("スロット" + slot % 10 + "にはまだ保存していません");*/ return; }
        for (let sel of form) {
            sel.value = table.shift();
            sel.checked = table.shift();
        }
        focusByXPath('//button[1]/font[contains(text(),"検索")]/..')
    }

    window.addEventListener("focus", () => {
        searchs()
        updateHistory()
    })
    window.addEventListener("resize", () => {
        searchs()
        updateHistory()
    })
    searchs()

    // 検索結果：資料に予約人数と既読を表示
    function searchs(node = document) {
        Info.load()
        // 県立＆市立：新着検索結果にAmazon
        var align = (document.body.parentNode.innerText.match(/あなたに貸出中の資料/)) ? "float:right; font-size:90%; margin:0 2px;" : "font-size:80%; margin:0 2px;";
        $(".searchs").remove()

        var reservationAppeared = 0
        var colwidth = (dq('div.media-body')?.clientWidth || 900)

        for (let element of getElementsByXPath('//div/div[@class="media-body"]/font/a')) {
            var title = element.innerText;
            title = title.trim();

            // 既読
            var [btitle, btime, note] = Info.getBorrow(title?.LYChan())
            if (btitle) {
                element.parentNode.parentNode.LYCbeforeend(`<span class='btn btn-success btn-xs searchs borrowed' data-title="${encodeURIComponent(btitle?.join(" "))}" title="${(btitle?.join(" "))?.LYCsanitize()}\n${new Date(btime)?.getFullYear()}/${((new Date(btime)?.getMonth()+1)?.toString()?.padStart(2,"0"))}/${new Date(btime)?.getDate()?.toString()?.padStart(2,"0")} に借りました\n書名が短い場合、誤判定かもしれません" style="${align} cursor:pointer; font-size:1em; margin:0 0.5em; position:relative; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:1em;">既読${note?"（"+(note?.LYCsanitize())+"）":""}</span>`)
                let p = element?.closest(".linkcolor_v")
                if (p) {
                    p.style.maxWidth = "calc( 100% - 13em)";
                    p.style.display = "inline-block"
                }
                reservationAppeared = 1;
            }

            // 予約人数
            var [titles, reserve, time] = Info.getReserve(title?.LYChan());

            if (reserve) {
                let left = Math.sign((reserve.resource - (reserve.resource - reserve.available) - reserve.reserve))
                let rec = `color:${left>0?"#181":left==0?"#880":"#555"};`
                let sta = `${reserve.reserve}予約 ${reserve.resource-reserve.available}貸出 ${reserve.resource}所蔵`
                if (left < 0) reservationAppeared = 1
                element.parentNode.LYCafterend(`<span class='searchs stats reserve_stats${left}' title="${titles.join(" ")}\n${new Date(time).toLocaleString("ja")} 時点の予約人数/貸出数/所蔵数のキャッシュ\nあと${Math.ceil((reserve?.expire-Date.now())/1000/60)>120?Math.round((reserve?.expire-Date.now())/1000/60/60)+"時間":Math.round((reserve?.expire-Date.now())/1000/60)+"分"}保持" style="${align} font-size:1em; margin:0 0.5em; ${rec} position:relative; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;\">${sta}</span>`)
                var p = element?.closest(".linkcolor_v")
                if (p) {
                    p.style.maxWidth = "calc( 100% - 13em)";
                    p.style.display = "inline-block"
                }
            }

            // 雑誌の内容説明
            if (reserve?.explain) {
                element.parentNode.parentNode.LYCbeforeend(`<span class='searchs stats explain' style="color:#777; float:right; font-size:1em; margin:3px 0.5em;  -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;\">${(reserve?.explain?.substr(0,(colwidth-element.offsetWidth-9*13-(element?.closest('div.media-body')?.querySelector('.borrowed')?.offsetWidth || 0)-(element?.closest('div.media-body')?.querySelector('.stats')?.offsetWidth || 0))/12))?.LYCsanitize()}</span>`)
                var p = element?.closest(".linkcolor_v")
                if (p) {
                    p.style.maxWidth = "calc( 100% - 13em)";
                    p.style.display = "inline-block"
                }
            }

            element.parentNode.LYCafterend("<span class='btn btn-primary btn-xs searchs' style=\"" + align + " top:2px; position:relative; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;\"><a href=\"https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(title) + "%20site:www.amazon.co.jp\" style=\"text-decoration:none; " + col + "\"><font style='font-size:1em;' color='#fff'>Amazon</font></a>")

        }
        if (reservationAppeared) {
            var btnfilter = getElementByXPath('//ul[@class="nav nav-pills"]/li/a[contains(text(),"図書 (")]|//ul[@class="nav nav-pills"]/li/a[@class="tab-box" and contains(text(),"雑誌 (")]')
            btnfilter?.parentNode?.LYCafterend(`<span class='btn btn-primary btn-lg searchs easysw borrowed' data-stats="easysw" title="すぐに借りられない物と既読をフィルタします" style="${align} cursor:pointer; font-size:1em; margin:0 6em; position:relative; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:1em;">借りやすさフィルタ</span>`)
        }

        if (Info.countReserve()) {
            dq(".nav")?.LYCbeforeend(`<span id="deleteReserve" class='btn btn-primary btn-lg searchs' title="予約人数/貸出数/所蔵数のキャッシュを全て破棄します" style="cursor:pointer; font-size:1em; margin:1em 7em 0 0; z-index:999999; float:right; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:1em;">予約人数キャッシュ（${Info.countReserve()}）を破棄</span>`)
            dq(`#deleteReserve`)?.addEventListener("click", (e) => {
                if (confirm(`予約人数/貸出数/所蔵数のキャッシュ(${Info.countReserve()})を全て破棄しますか？`)) Info.deleteReserve()
            })
        }
    }

    return;

    function DOMNodeInserted(node = document) {
        var col = " class='btn btn-primary btn-xs' ";

        // 書籍検索や新着書籍一覧：Amazon
        for (let t of getElementsByXPath('//td[@class="nowrap meisai_naiyo"]/a|.//td[contains(text(),"予約中")]/following-sibling::td[1]|.//td[contains(text(),"予約受付済")]/following-sibling::td[1]|.//td[contains(text(),"受取可")]/following-sibling::td[1]|.//td[contains(text(),"回送中")]/following-sibling::td[1]|.//td[contains(text(),"貸出中")]/following-sibling::td[1]|.//td[@style="word-break: break-all;" and @align="LEFT" and contains(text(),"貸出中")]/preceding-sibling::td[1]|//td[@align="LEFT" and contains(text(),"貸出中")]/preceding-sibling::td[1]', node)) {
            if (t.innerText.match(/データのない資料|市外/)) continue;
            if (document.body.parentNode.innerText.match(/検索結果詳細表示/)) continue;
            t.innerHTML = t.innerHTML.replace(/<br>/g, "").trim()
            var title = (t.innerText.match(/／/)) ? t.innerText.split("／")[0] + " " + t.innerText.split("／")[1] : t.innerText;
            title = title.trim();
            var align = (document.body.parentNode.innerText.match(/あなたに貸出中の資料/)) ? "float:right; font-size:90%; margin:0 2px;" : "font-size:80%; margin:0 2px;";
            t.LYCbeforeend("<a " + col + "onclick=\"arguments[0].stopPropagation()\" style=\"" + align + "-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;\" href=\"https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(title) + "%20site:www.amazon.co.jp\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">Amazon</a>")
            t.LYCbeforeend("<a " + col + "onclick=\"arguments[0].stopPropagation()\" style=\"" + align + "-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;\" href=\"https://calil.jp/local/search?csid=kanagawa&q=" + encodeURIComponent(title) + "\" rel=\"noopener noreferrer nofollow\" target=\"_blank\" >カーリル</a>")
        }

        // 検索結果：行間を詰める
        if (u(/OPP1400|index.jsp/)) {
            sel(node, 'p').forEach(v => v.outerHTML == '<p><font class="hilight" style="background-color:#FFFF99"></font><br></p>' && v.parentNode.removeChild(v))
            sel(node, "hr").forEach(v => v.style.margin = "0em")
            sel(node, 'div>div.media-body>font>a').forEach(v => v.parentNode.outerHTML = v.parentNode.outerHTML.replace(/<br>/gm, ""))
        }

        // 新着資料：行間を詰める
        if (u(/OPP0700/)) {
            sel(node, 'p').forEach(v => $(v).css({ "display": "inline", "margin-left": "0.5em" }))
            sel(node, "hr").forEach(v => v.style.margin = "0em")
        }

        // 検索結果：項目番号を消す
        if (u(/opac.lib.city.yokohama.lg.jp\/opac\/OPP1400/)) sel(node, 'div.row>div:first-child', node).forEach(v => v.remove())

        // 県立＆市立：// 書名の全角を半角にする
        getElementsByXPath('//div/div[@class="media-body"]/font/a|.//td/a[@class="linkcolor_v"]|.//dt[@class="hidden-xs" and text()="タイトル　"]/following-sibling::dd[1]', node).forEach(v => v.innerText = v.innerText.LYChan())

        searchs(node)
        return;
    }

    function u(v) { return location.href.match(v) }

    function dt(v) { return document.body.innerText.match(v) }

    function dq(v) { return document.querySelector(v) }

    function dqa(v) { return [...document.querySelectorAll(v)].filter(v => v.offsetHeight) }

    function getElementsByXPath(xpath, node = document) {
        var element = document.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var array = [];
        for (var i = 0; i < element.snapshotLength; i++) array[i] = element.snapshotItem(i);
        return array;
    }

    function getElementByXPath(xpath, node = document) {
        var element = document.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element.snapshotLength > 0) return element.snapshotItem(0);
        return null;
    }

    function addSpanHTML(place, text, title) {
        place.LYCbeforeend(`<span style='float:right;'>${text}</span>`);
        return
    }

    function focusByXPath(xpath, urlREG = /./) {
        if (!(document.title + document.body.innerText).match(urlREG)) return;
        setTimeout(function() {
            var tofocus = getElementByXPath(xpath);
            if (tofocus) tofocus.focus();
        }, 250);
        focused = true;
    }

    function clickByXPath(xpath, urlREG = /./) {
        if (!(document.title + document.body.innerText).match(urlREG)) return;
        var tofocus = getElementByXPath(xpath);
        if (tofocus) tofocus.click();
        return
    }

    function existText(word) {
        return document.body.parentNode.innerText.match(word);
    }

    function changeValue(xpath, val, urlREG = /./) {
        if (!(document.title + document.body.innerText).match(urlREG)) return;
        var element = getElementByXPath(xpath);
        if (element) element.value = val;
        return;
    }

    function notifyElement(cell, element) {
        if (!element) return;
        let color = getColorFromText(element.innerText.trim());
        element.style.backgroundColor = color;
    }

    function getColorFromText(string) {
        var color = 20;
        for (let i = 0; i < string.length; i++) { color = color + Number(string.charCodeAt(i)); }
        return 'hsla(' + (color % 360) + ",100%,50%,15%)";
    }

    function sel(node, selector) {
        if (node?.nodeType == 1 && node?.matches(selector)) return [node]
        return node?.querySelectorAll(selector) || []
    }

})();
