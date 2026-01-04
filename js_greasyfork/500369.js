// ==UserScript==
// @name         レーベルページツール
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  sougouwikiレーベルページで各データ取得、最終データにジャンプ
// @author       vrav
// @license      public domain
// @match        https://seesaawiki.jp/vrav/d/*
// @match        http://sougouwiki.com/d/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      dmm.co.jp
// @connect      mgstage.com
// @connect      seesaawiki.jp
// @connect      sougouwiki.com
// @require      https://unpkg.com/encoding-japanese@1/encoding.min.js
// @downloadURL https://update.greasyfork.org/scripts/500369/%E3%83%AC%E3%83%BC%E3%83%99%E3%83%AB%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500369/%E3%83%AC%E3%83%BC%E3%83%99%E3%83%AB%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　　　　　　　　　<<　使い方　>>
//
//                        <　Shift+右クリックでレーベルページ用のデータを取得　>
//  レーベルページで品番をShift+右クリックするとレーベルページ用のデータをクリップボードに取得します。
//  Shift+Ctrl+右クリックでは次の品番のデータを取得します。(品番+1、新規欄が作成されていない時のために)
//  DMMとMGS(配信専用のみ)に対応しています。
//  MGSで出演者を載せる場合はコード下部の「MGS出演者表示レーベル表」に登録して下さい。
//  シリーズ一覧に関してはオリジナルのシリーズ名で検索するので、WIKIに違う名称でページ作成している場合は、
//  コード下部の「シリーズ名変換表」に登録して下さい。
//  　　　　　　　　　　　　　　　　　　　　　　<　注意　>
//  取得したデータを手動でペーストする場合は、シリーズページにもシリーズ一覧が入ったままとなってしまいますが、
//  「レーベル編集ページツール」スクリプト↓を使用すると自動で該当項目が削除されます。
//  https://greasyfork.org/ja/scripts/500368-%E3%83%AC%E3%83%BC%E3%83%99%E3%83%AB%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%84%E3%83%BC%E3%83%AB
//
//
//// 　　　　　　　　　　　　<　Ctrl+右クリックで女優ページ用のデータをコピー　>
//  レーベルページで品番をCtrl+右クリックすると女優ページ用のデータをクリップボードにコピーします。
//  レーベルページの当wikiデータをそのまま抽出しますが、(メーカー名)はレーベルページに存在しないのでDMMかMGSから取得します。
//  レーベルページがなくシリーズページのみの場合はコード下部の「シリーズオンリー表」にワードを登録して下さい。
//  　　　　　　　　　　　　　　<　ソース元ページが削除されている場合　>
//  レーベルページのページ名を一旦取得し、スクリプト最下部の「メーカー名変換表」で変換します。
//  変換表はご自身で追加していって下さい。
//  また、シリーズページでは(メーカー名)を変換できない ＝ 登録していない ので注意して下さい。
//  しかし、一度コピーを試してメーカー名が違っていれば「メーカー名変換表」へ違っていた文字列を
//  '変換前'に、正しいメーカー名を'変換後'にご自身で手動で登録することができます。
//  AV OPENなどのメーカー混合ページは対応できません。
//
//
//                    　　　 <　Shift+Endキーで最終データ地点へジャンプ　>
//  ブラウザ標準のCtrl+Endキーではページ最下部へジャンプですが、Shiftキーを押しながらEndキーを押すと
//  作品タイトルが記載されている最終データ地点へジャンプします。
//  見出しが分かれている場合はShiftキーを押しながらEndキーを押すごとに見出しごとの最終地点にジャンプします。
//
//  当スクリプトの使用に関しては全て自己責任でお願いします。


//////////////////////////////////////////////　　最終地点へジャンプ　　//////////////////////////////////////////////////

(function() {
    'use strict';
    let scrollIndex = -1;
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'End') {
            const tables = document.querySelectorAll('table');
            const scrollPositions = [];
            for (let i = 0; i < tables.length; i++) {
                const table = tables[i];
                const headerRow = table.querySelector('tr');
                const headers = headerRow.querySelectorAll('th');
                let columnIndex;
                for (let j = 0; j < headers.length; j++) {
                    const header = headers[j];
                    if (header.textContent === 'TITLE' || header.textContent === 'SUBTITLE') {
                        columnIndex = j + 1;
                        break;
                    }
                }
                if (columnIndex) {
                    const rows = table.querySelectorAll('tr');
                    let lastRowWithText;
                    for (let j = 0; j < rows.length; j++) {
                        const row = rows[j];
                        const cell = row.querySelector(`td:nth-child(${columnIndex})`);
                        if (cell && cell.textContent.trim()) {
                            lastRowWithText = row;
                        }
                    }
                    if (lastRowWithText) {
                        scrollPositions.push(lastRowWithText);
                    }
                }
            }
            if (scrollPositions.length > 0) {
                scrollIndex = (scrollIndex + 1) % scrollPositions.length;
                scrollPositions[scrollIndex].scrollIntoView();
            }
        }
    });
})();

//////////////////////////////////////////////　　ポップアップ要素　　//////////////////////////////////////////////////

(function() {
    'use strict';
    // ポップアップを作成
    let titleText = "";
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.border = "none";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "#fff";
    popup.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
    popup.style.fontSize = "24px";
    popup.innerHTML = "取得中";
    const popupCOPY = document.createElement("div");
    popupCOPY.style.position = "fixed";
    popupCOPY.style.top = "50%";
    popupCOPY.style.left = "50%";
    popupCOPY.style.transform = "translate(-50%, -50%)";
    popupCOPY.style.border = "none";
    popupCOPY.style.padding = "20px";
    popupCOPY.style.backgroundColor = "#fff";
    popupCOPY.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
    popupCOPY.style.fontSize = "24px";
    popupCOPY.innerHTML = "COPY";
    const popupGET = document.createElement("div");
    popupGET.style.position = "fixed";
    popupGET.style.top = "50%";
    popupGET.style.left = "50%";
    popupGET.style.transform = "translate(-50%, -50%)";
    popupGET.style.border = "none";
    popupGET.style.padding = "20px";
    popupGET.style.backgroundColor = "#fff";
    popupGET.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
    popupGET.style.fontSize = "24px";
    popupGET.innerHTML = "GET";
    function closePopup() {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    }

    //////////////////////////////////////////////　　女優ページ用データ　　//////////////////////////////////////////////////

    // 格納する変数
    let doc = "";
    let docW = "";
    let maker2 = "";
    let label2 = "";
    let series2 = "";
    let ml = "";
    let linkAddress2 = "";
    let textA = "";
    let textB = "";
    let aText = "";
    let bText = "";
    let cText = "";

    // Ctrlキー+右クリックで発動
    document.addEventListener('contextmenu', function(event) {
        if (event.ctrlKey && !event.shiftKey && !event.altKey && event.target.tagName === 'A') {
            event.preventDefault();
            // クリックされた要素がリンクであるかチェック
            if (event.target.tagName === "A") {
                // リンクのアドレスを取得
                linkAddress2 = event.target.href;
            }
            // クリックされたリンクの文字列を取得
            const linkText = event.target.textContent;
            // 編集アドレスを取得
            const url = document.querySelector('h2 > a[rel="nofollow"]').href;
            // HTTPリクエスト1　各サイトからメーカー名とレーベル名を取得
            const promise1 = new Promise((resolve, reject) => {
                document.body.appendChild(popup);
                // DMMからメーカーとレーベルを取得
                if (linkAddress2.startsWith('https://www.dmm.co.jp/') || linkAddress2.startsWith('http://www.dmm.co.jp/')) {
                    const promiseC = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: linkAddress2,
                            onload: function(response) {
                                if (response.status !== 200) {
                                    doc = null;
                                    resolve(doc);
                                }
                                if (response.status === 200) {
                                    const parser = new DOMParser();
                                    doc = parser.parseFromString(response.responseText, "text/html");
                                    // 2回目以降のアクセス
                                    if (sessionStorage.getItem('firstVisit')) {
                                        resolve(doc);
                                    } else {
                                        // 初回アクセス時にログイン完了・年齢認証ページをGETした場合
                                        sessionStorage.setItem('firstVisit', 'true');
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: linkAddress2,
                                            onload: function(response) {
                                                if (response.status !== 200) {
                                                    closePopup();
                                                    setTimeout(function() {
                                                        alert("ページを読み取れません");
                                                    }, 0);
                                                }
                                                if (response.status === 200) {
                                                    const parser = new DOMParser();
                                                    doc = parser.parseFromString(response.responseText, "text/html");
                                                    resolve(doc);
                                                }
                                            },
                                            onerror: function(error) {
                                                reject(error);
                                            }
                                        });
                                    }
                                }
                            },
                            onerror: function(error) {
                                reject(new Error("GM_xmlhttpRequest failed"));
                            }
                        });
                    });
                    promiseC.then(doc => {

                        // FANZA素人は取得不要
                        if (doc === null) {
                            ml = null;
                            resolve(ml);
                        } else {
                            const amateur = doc.querySelector('title').textContent;
                            if (amateur.includes('素人エロ動画・')) {
                                ml = null;
                                resolve(ml);
                            } else {
                                maker2 = doc.querySelector('td.nw + td a[href*="maker="]');
                                label2 = doc.querySelector('td.nw + td a[href*="label="]');
                                textA = maker2 ? maker2.textContent : "";
                                textB = label2 ? label2.textContent : "";
                                // メーカーとレーベルが重複
                                if (textA.includes(textB)) {
                                    ml = textA;
                                    resolve(ml);
                                    // メーカー名のみ
                                } else if (textA && !textB) {
                                    ml = textA;
                                    resolve(ml);
                                    // 異なる両方が存在
                                } else if (textA && textB) {
                                    ml = textA + "／" + textB;
                                    resolve(ml);
                                    // レーベル名に「missingLabel」が含まれていれば除外
                                    if (missingLabel.some(label2 => label2 === textB)) {
                                        ml = textA;
                                        resolve(ml);
                                    }
                                }
                            }
                        }
                    });
                }
                // MGSからメーカーとレーベルを取得
                else if (linkAddress2.startsWith('https://www.mgstage.com/product/product_detail/') || linkAddress2.startsWith('http://www.mgstage.com/product/product_detail/')) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: linkAddress2,
                        onload: function(response) {
                            // HTTPステータス200以外は除外
                            if (response.status !== 200) {
                                ml = null;
                                resolve(ml);
                            }
                            // HTTPステータス200で開始
                            if (response.status === 200) {
                                // TOPページにリダイレクトされる場合
                                if (response.finalUrl === "https://www.mgstage.com/") {
                                    ml = null;
                                    resolve(ml);
                                } else {
                                    // データを取得
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, "text/html");
                                    let ths = doc.querySelectorAll('th');
                                    for (let th of ths) {
                                        if (th.textContent.includes('メーカー：')) {
                                            const td = th.nextElementSibling;
                                            maker2 = td.textContent.trim();
                                        } else if (th.textContent.includes('レーベル：')) {
                                            const td = th.nextElementSibling;
                                            label2 = td.textContent.trim();
                                        } else if (th.textContent.includes('シリーズ：')) {
                                            const td = th.nextElementSibling;
                                            series2 = td.textContent.trim();
                                        }
                                    }
                                    let textA = maker2 ? maker2 : "";
                                    let textB = label2 ? label2 : "";
                                    textA = textA.replace(/(\(.*?\))|（.*?）/g, '');
                                    textB = textB.replace(/(\(.*?\))|（.*?）/g, '');
                                    // メーカーとレーベルが重複
                                    if (textA.includes(textB)) {
                                        ml = textA;
                                        resolve(ml);
                                        // メーカー名のみ
                                    } else if (textA && !textB) {
                                        ml = textA;
                                        resolve(ml);
                                        // 異なる両方が存在
                                    } else if (textA && textB) {
                                        ml = textA + "／" + textB;
                                        // レーベル名に「missingLabel」が含まれていれば除外
                                        if (missingLabel.some(label2 => label2 === textB)) {
                                            ml = textA;
                                            resolve(ml);
                                        }
                                        resolve(ml);
                                    }
                                }
                            }
                        },
                        onerror: function(error) {
                            reject(new Error("GM_xmlhttpRequest failed"));
                        }
                    });
                } else {
                    // DMMとMGS以外の場合
                    ml = null;
                    resolve(ml);
                }
            }).then((result) => {
            }).catch((error) => {
                ml = null;
            });
            // HTTPリクエスト2　WIKIのテキストを取得
            const promise2 = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status !== 200) {
                            closePopup();
                            setTimeout(function() {
                                alert("ページを読み取れません");
                            }, 0);
                            return;
                        }
                        if (response.status === 200) {
                            const parser = new DOMParser();
                            docW = parser.parseFromString(response.responseText, "text/html");
                            // 2回目以降のアクセス
                            if (sessionStorage.getItem('firstWiki')) {
                                resolve(docW);
                            } else {
                                // 初回アクセス時にログイン処理ページをGETした場合
                                sessionStorage.setItem('firstWiki', 'true');
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: url,
                                    onload: function(response) {
                                        if (response.status !== 200) {
                                            closePopup();
                                            setTimeout(function() {
                                                alert("ページを読み取れません");
                                            }, 0);
                                        }
                                        if (response.status === 200) {
                                            const parser = new DOMParser();
                                            docW = parser.parseFromString(response.responseText, "text/html");
                                            resolve(docW);
                                        }
                                    },
                                    onerror: function(error) {
                                        reject(error);
                                    }
                                });
                            }

                        }
                    },
                    onerror: function(error) {
                        reject(new Error("GM_xmlhttpRequest failed"));
                    }
                });
            }).then((result) => {
            }).catch((error2) => {
                document.body.removeChild(popup);
                setTimeout(function() {
                    alert('しばらく時間をおいてやり直してください。');
                }, 0);
                return;
            });
            // 2つのHTTPリクエストで取得したデータを整形
            Promise.all([promise1, promise2]).then(() => {
                const content = docW.querySelector("#content").textContent;
                const lines = content.split('\n');
                // タイトル名を取得
                titleText = docW.querySelector('h2 > a').textContent;
                // レーベル一覧用
                const titleTextL = docW.querySelector('h2 > a').textContent;
                // 列のインデックスを作成
                const indexMap = {
                    aText: 1,
                    bText: 1,
                    cText: 2,
                    dText: 3,
                    eText: 4,
                    fText: 6,
                    dateText: 5
                };
                // 指定の書式で始まっているかチェック
                let found = false;
                let i;
                for (i = 0; i < lines.length; i++) {
                    if (lines[i].includes("|[[" + linkText)) {
                        found = true;
                        break;
                    }
                }
                // 指定の書式で始まる行がない場合
                if (!found) {
                    document.body.removeChild(popup);
                    setTimeout(function() {
                        alert("|[[　で始まっていません。正しい書式に直してください。");
                    }, 0);
                    return;
                }
                // 直前の'|~NO'行を探す
                let noFound = false;
                if (found) {
                    //alert(ml);
                    for (let j = i - 1; j >= 0; j--) {
                        //  if (lines[j].startsWith('|~NO')) {
                        if (lines[j].startsWith('|~NO') || /^\|~\d+/.test(lines[j])) {
                            noFound = true;
                            // SUBTITLEとVOLは不可
                            if (lines[j].includes('|SUBTITLE|') || lines[j].includes('|VOL|')) {
                                alert('|TITLE| ではありません。コピーしたデータを正しいタイトルに直してください。');
                            }
                            // 対応する列にテキストを定義
                            const headerParts = lines[j].split('|');
                            for (let k = 1; k < headerParts.length; k++) {
                                //  if (headerParts[k] === 'NO') {
                                if (headerParts[k] === 'NO' || /^\d+$/.test(headerParts[k])) {
                                    indexMap.aText = k;
                                    indexMap.bText = k;
                                } else if (headerParts[k] === 'PHOTO') {
                                    indexMap.cText = k;
                                } else if (headerParts[k] === 'TITLE' || headerParts[k] === 'SUBTITLE') {
                                    indexMap.dText = k;
                                } else if (headerParts[k] === 'ACTRESS') {
                                    indexMap.eText = k;
                                } else if (headerParts[k] === 'NOTE') {
                                    indexMap.fText = k;
                                    //} else if (headerParts[k] === 'RELEASE') {
                                } else if (headerParts[k] === 'RELEASE' || headerParts[k] === 'DATE') {
                                    indexMap.dateText = k;
                                }
                            }
                            break;
                        }
                    }
                    if (!noFound) {
                        document.body.removeChild(popup);
                        setTimeout(function() {
                            alert("ヘッダーが既定の書式ではありません。");
                        }, 0);
                        return;
                    }
                    // 列ごとにデータを振り分け
                    const parts = lines[i].split('|');
                    const aTextMatch = parts[indexMap.aText].match(/\[\[(.+?)\>/);
                    if (aTextMatch) {
                        aText = aTextMatch[1];
                    } else {
                        document.body.removeChild(popup);
                        setTimeout(function() {
                            alert("品番が不正な値です。");
                        }, 0);
                        return;
                    }
                    const bTextMatch = parts[indexMap.bText].match(/\>(.+?)\]\]/);
                    if (bTextMatch) {
                        bText = bTextMatch[1];
                    } else {
                        document.body.removeChild(popup);
                        setTimeout(function() {
                            alert("作品リンクが不正な値です。");
                        }, 0);
                        return;
                    }
                    const cTextMatch = parts[indexMap.cText].match(/\[\[(.+?)\]\]|(&ref\(.+?\))/);
                    if (cTextMatch) {
                        cText = cTextMatch[1] || cTextMatch[2];
                        // FANZA素人例外
                        if (cText.includes("/amateur/")) {
                            cText = cText.replace("js.jpg>", "jp.jpg,147)>");
                            cText = "&ref(" + cText;
                        }
                    } else {
                        document.body.removeChild(popup);
                        setTimeout(function() {
                            alert("PHOTOリンクが不正な値です。");
                        }, 0);
                        return;
                    }
                    let dText = parts[indexMap.dText];
                    // ~~をスペースに変換
                    dText = dText.replace(/~~/g, " ");
                    let eText = parts[indexMap.eText];
                    // ~~をスペースに変換
                    eText = eText.replace(/~~/g, "　");
                    let fText = parts[indexMap.fText];
                    // 日付の-を.に変換
                    let dateText = parts[indexMap.dateText].replace(/-/g, '.');
                    // 品番が数字のみ、S-CUTEは追加しない
                    let extractedText = "";
                    // タイトル名の文字列を削除しない例外（未実装）
                    const keywords = ["AV OPEN "];
                    if (keywords.some(keyword => titleText.includes(keyword))) {
                        // メーカー名変換表に従ってタイトル名を変換
                        if (conversionTable[titleText]) {
                            titleText = conversionTable[titleText];
                        }
                        // ページ名の例外処理
                    } else {
                        // タイトル名に「その他」が含まれている場合は削除
                        if (titleText.includes("その他")) {
                            titleText = titleText.slice(0, titleText.indexOf("その他"));
                        }
                        // 最後の文字が数字1桁か2桁で終わっている場合は、その数字を削除
                        if (titleText.match(/\d{1,2}$/)) {
                            titleText = titleText.replace(/\d{1,2}$/, '');
                        }
                        // ホットエンターテイメント用
                        if (titleText.includes("発売作品")) {
                            titleText = titleText.replace(/[\s　]+.*$/, '');
                        }
                        // 最後が半角スペースもしくは全角スペースの場合はそのスペースを削除
                        titleText = titleText.replace(/[\s　]$/, '');
                        // 括弧内を削除するパターン （titleText）
                        for (let h = 0; h < keywordsS.length; h++) {
                            if (titleText.includes(keywordsS[h])) {
                                titleText = titleText.replace(/[(（].*$/, '');
                                break;
                            }
                        }
                    }
                    // 括弧内を削除するパターン（ml）
                    if (ml) {
                        for (let g = 0; g < keywordsS.length; g++) {
                            if (ml.includes(keywordsS[g])) {
                                ml = ml.replace(/[(（].*$/, '');
                                break;
                            }
                        }
                    }
                    // メーカー名変換表に従ってタイトル名を変換
                    titleText = conversionTable[titleText] || titleText;
                    ml = conversionTable[ml] || ml;
                    if (/^\d+$/.test(aText) || lines[i].includes(".s-cute.")) {
                        extractedText += "//" + dateText + "\n";
                    } else {
                        extractedText += "//" + dateText + " " + aText + "\n";
                    }
                    // FANZA素人例外　ページ名をタイトルに付加
                    if (/\/amateur\//.test(lines[i])) {
                        dText = titleText + " " + dText;
                    }
                    // MGS例外 「MGS」をタイトルに付加
                    if (/^\|\[\[\d{3}[A-Z]{3}/.test(lines[i])
                        || lines[i].startsWith("|[[MAAN-")
                        || lines[i].startsWith("|[[FCP-")
                        || lines[i].startsWith("|[[SIRO-")) {
                        dText = "MGS " + dText;
                    }
                    // FC2例外 「FC2」をタイトルに付加
                    if (bText.includes('.fc2.')) {
                        dText = "FC2 " + dText;
                    }
                    // Perfect-G例外 「G-AREA Perfect-G」をタイトルに付加
                    if (/.g-area./.test(lines[i])) {
                        dText = "G-AREA Perfect-G " + dText;
                    }
                    // Pcolle例外 「Pcolle」をタイトルに付加
                    if (/.pcolle./.test(lines[i])) {
                        dText = "Pcolle " + dText;
                    }
                    // S-Cute例外 「S-Cute」をタイトルに付加
                    if (/.s-cute./.test(lines[i])) {
                        dText = "S-Cute " + dText;
                    }
                    // 人妻パラダイス例外 「人妻パラダイス」をタイトルに付加
                    if (bText.includes('.h-paradise.')) {
                        dText = "人妻パラダイス No." + linkText + " " + dText;
                    }
                    // 舞ワイフ例外 「舞ワイフ」と番号をタイトルに付加
                    if (bText.includes('mywife.cc')) {
                        dText = "舞ワイフ No." + linkText + " " + dText;
                    }
                    // 例外処理　メーカー名を削除
                    if (lines[i].startsWith("|[[SIRO-") ||
                        lines[i].startsWith("|[[200GANA-") ||
                        lines[i].startsWith("|[[259LUXU-") ||
                        lines[i].startsWith("|[[300MAAN-") ||
                        lines[i].startsWith("|[[300MIUM-") ||
                        lines[i].startsWith("|[[300NTK-") ||
                        /.g-area./.test(lines[i]) ||
                        /.h-paradise./.test(lines[i]) ||
                        /mywife.cc/.test(lines[i]) ||
                        /.s-cute./.test(lines[i]) ||
                        /(\/amateur\/)/.test(lines[i])) {
                        if (seriesOnly.some((series) => titleTextL.includes(series))) {
                            extractedText += "[[" + dText + ">" + bText + "]]　[[(シリーズ一覧)>" + titleTextL + "]]";
                        } else {
                            extractedText += "[[" + dText + ">" + bText + "]]　[[(レーベル一覧)>" + titleTextL + "]]";
                        }
                    }
                    // mlの取得可否によって分岐
                    else if (ml) {
                        popupCOPY.innerHTML = (ml);
                        if (seriesOnly.some((series) => titleTextL.includes(series))) {
                            extractedText += "[[" + dText + "（" + ml + "）>" + bText + "]]　[[(シリーズ一覧)>" + titleTextL + "]]";
                        } else {
                            extractedText += "[[" + dText + "（" + ml + "）>" + bText + "]]　[[(レーベル一覧)>" + titleTextL + "]]";
                        }
                    } else if (!ml) {
                        popupCOPY.innerHTML = (titleText);
                        if (seriesOnly.some((series) => titleTextL.includes(series))) {
                            extractedText += "[[" + dText + "（" + titleText + "）>" + bText + "]]　[[(シリーズ一覧)>" + titleTextL + "]]";
                        } else {
                            extractedText += "[[" + dText + "（" + titleText + "）>" + bText + "]]　[[(レーベル一覧)>" + titleTextL + "]]";
                        }
                    }
                    // 通常の処理
                    if (fText && fText.includes("[[シリーズ一覧>")) {
                        fText = fText.match(/\[\[シリーズ一覧>.+?\]\]/)[0];
                        fText = fText.replace("シリーズ一覧", "(シリーズ一覧)");
                        extractedText += "　" + fText;
                    }
                    extractedText += "\n";
                    if (cText.startsWith('&ref(') && cText.endsWith(')')) {
                        extractedText += cText;
                    } else {
                        extractedText += "[[" + cText + "]]";
                    }
                    if ((eText.match(/\[\[/g) || []).length >= 2) {
                        extractedText += ("\n出演者：" + eText);
                    }
                    // 日付データの形式が異なる場合アラートを表示
                    if (!/^\/\/\d{4}\.\d{2}\.\d{2}/.test(extractedText)) {
                        document.body.removeChild(popup);
                        setTimeout(function() {
                            alert("正しい日付を設定してください。");
                        }, 0);
                    } else {
                        // クリップボードにコピー
                        GM_setClipboard(extractedText);
                        // ポップアップを表示
                        document.body.removeChild(popup);
                        document.body.appendChild(popupCOPY);
                        // ポップアップを閉じる
                        setTimeout(function() {
                            popupCOPY.remove();
                        }, 1200);
                    }
                } else {
                    // 書式が違う場合アラート
                    console.log("lines[" + i + "] 書式が違います。 '|[[" + linkText + "': " + lines[i]);
                    document.body.removeChild(popup);
                    setTimeout(function() {
                        alert("書式が違います。");
                    }, 0);
                    return;
                }
            });
        }
    });

    //////////////////////////////////////////////　　レーベルページ用データ　　//////////////////////////////////////////////////

    // 格納する変数
    let date = "";
    let dateA = "";
    let dateM = "";
    let dateV = "";
    let genre = "";
    let genreTexts = "";
    let genreV = "";
    let imageJp = "";
    let imageM = "";
    let imagePl = "";
    let imagePs = "";
    let labelM = "";
    let linkAddress;
    let linkPerformers;
    let linkText = "";
    let maker = "";
    let nameA = "";
    let nameM = "";
    let partnumber = "";
    let path;
    let performer = "";
    let series = "";
    let sizeA = "";
    let title = "";
    let titleA = "";
    let titleM = "";
    let titleV = "";
    let urlPerformers;
    let wiki;
    let wikiV;
    let wikilink;
    let wikilinkPromise;
    // Shift+右クリックで発動
    document.addEventListener('contextmenu', function(event) {
        let urlGet = false;
        if (event.shiftKey && !event.ctrlKey && !event.altKey && event.target.tagName === 'A') {
            event.preventDefault();
            // クリックされた要素がリンクであるかチェック
            if (event.target.tagName === "A") {
                // リンクのアドレスを取得
                linkAddress = event.target.href;
            }
            // クリックされたリンクの文字列を取得
            linkText = event.target.textContent;
            urlGet = true;
        }
        // Shift+Ctrl+右クリックで発動
        else if (event.shiftKey && event.ctrlKey && !event.altKey && event.target.tagName === 'A') {
            event.preventDefault();
            // クリックされた要素がリンクであるかチェック
            if (event.target.tagName === "A") {
                linkAddress = event.target.href;
                linkAddress = linkAddress.replace(/(\d+)([^\d\/]*\/?)$/, function(match, p1, p2) {
                    // 数値を+1する
                    let newNum = (parseInt(p1) + 1).toString();
                    // 元の数値が0で始まる場合、新しい数値も0で埋める
                    while (newNum.length < p1.length) {
                        newNum = '0' + newNum;
                    }
                    return newNum + p2;
                });
                urlGet = true;
            }
            // クリックされたリンクの文字列を取得
            linkText = event.target.textContent;
            linkText = linkText.replace(/-(\d+)/, function(match, p1) {
                // 数値を+1する
                let newNum = (parseInt(p1) + 1).toString();
                // 元の数値が0で始まる場合、新しい数値も0で埋める
                while (newNum.length < p1.length) {
                    newNum = '0' + newNum;
                }
                return '-' + newNum;
            });
        }
        if (urlGet) {
            const promise3 = new Promise((resolve, reject) => {
                // 取得状況をポップアップ表示
                document.body.appendChild(popup);
                // DMM
                if (linkAddress.startsWith('https://www.dmm.co.jp/mono/') || linkAddress.startsWith('http://www.dmm.co.jp/mono/')) {
                    const promiseD = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: linkAddress,
                            onload: function(response) {
                                if (response.status !== 200) {
                                    closePopup();
                                    setTimeout(function() {
                                        alert("ページを読み取れません");
                                    }, 0);
                                    return;
                                }
                                if (response.status === 200) {
                                    const parser = new DOMParser();
                                    doc = parser.parseFromString(response.responseText, "text/html");
                                    // 2回目以降のアクセス
                                    if (sessionStorage.getItem('firstVisit')) {
                                        resolve(doc);
                                    } else {
                                        // 初回アクセス時にログイン完了・年齢認証ページをGETした場合
                                        sessionStorage.setItem('firstVisit', 'true');
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: linkAddress,
                                            onload: function(response) {
                                                if (response.status !== 200) {
                                                    closePopup();
                                                    setTimeout(function() {
                                                        alert("ページを読み取れません");
                                                    }, 0);
                                                }
                                                if (response.status === 200) {
                                                    const parser = new DOMParser();
                                                    doc = parser.parseFromString(response.responseText, "text/html");
                                                    resolve(doc);
                                                }
                                            },
                                            onerror: function(error) {
                                                reject(error);
                                            }
                                        });
                                    }
                                }
                            },
                            onerror: function(error) {
                                reject(new Error("GM_xmlhttpRequest failed"));
                            }
                        });
                    });
                    promiseD.then(doc => {
                        const div = doc.querySelector('.layout-sampleImage__Block');
                        const link = div.querySelector('img');
                        const img = link.src;
                        const imagePl = doc.querySelector('#fn-sampleImage-imagebox img').src;
                        const title = link.alt;
                        const imagePs = link.dataset.lazy;
                        const tds = doc.querySelectorAll("td");

                        date = Array.from(tds).find(td => td.textContent.trim() === '発売日：') ?.nextElementSibling.textContent || '';
                        series = Array.from(tds).find(td => td.textContent.trim() === 'シリーズ：') ?.nextElementSibling.querySelector("a") ?.textContent || '';
                        maker = Array.from(tds).find(td => td.textContent.trim() === 'メーカー：') ?.nextElementSibling.querySelector("a") ?.textContent || '';
                        genre = Array.from(tds).find(td => td.textContent.trim() === 'ジャンル：') ?.nextElementSibling.querySelectorAll("a");
                        genreTexts = Array.from(genre).map(a => a.textContent);
                        linkPerformers = doc.querySelectorAll("#performer a");
                        performer = linkPerformers.length > 0 ? Array.from(linkPerformers).map(linkPerformer => linkPerformer.textContent) : "";

                        // 出演者多数の場合
                        if (performer.includes('▼すべて表示する')) {
                            const urlFirst = linkAddress.substr(0, linkAddress.indexOf("=/"));
                            const urlSecond = linkAddress.substr(linkAddress.indexOf("/=/"));
                            urlPerformers = urlFirst + "performer" + urlSecond;
                            const promiseP = new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: urlPerformers,
                                    onload: function(response) {
                                        const parserP = new DOMParser();
                                        const docP = parserP.parseFromString(response.responseText, "text/html");
                                        linkPerformers = docP.querySelectorAll("a");
                                        performer = Array.from(linkPerformers).map(linkPerformer => linkPerformer.textContent);
                                        resolve(performer);
                                    },
                                    onerror: function(error) {
                                        reject(error);
                                    }
                                });
                            });
                            promiseP.then(performer => {
                                // ▼すべて表示する があった場合
                                resolve({
                                    title: title,
                                    imagePl: imagePl,
                                    imagePs: imagePs,
                                    performer: performer,
                                    date: date,
                                    series: series,
                                    genreTexts: genreTexts
                                });
                            });
                        } else {
                            // 通常の処理で取得した場合
                            resolve({
                                title: title,
                                imagePl: imagePl,
                                imagePs: imagePs,
                                performer: performer,
                                date: date,
                                series: series,
                                genreTexts: genreTexts
                            });
                        }
                    });
                }
                // FANZA動画
                else if (linkAddress.startsWith('https://www.dmm.co.jp/digital/videoa/') || linkAddress.startsWith('http://www.dmm.co.jp/digital/videoa/')) {
                    const promiseF = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: linkAddress,
                            onload: function(response) {
                                if (response.status !== 200) {
                                    closePopup();
                                    setTimeout(function() {
                                        alert("ページを読み取れません");
                                    }, 0);
                                    return;
                                }
                                if (response.status === 200) {
                                    const parser = new DOMParser();
                                    doc = parser.parseFromString(response.responseText, "text/html");
                                    // 2回目以降のアクセス
                                    if (sessionStorage.getItem('firstVisit')) {
                                        resolve(doc);
                                    } else {
                                        // 初回アクセス時にログイン完了・年齢認証ページをGETした場合
                                        sessionStorage.setItem('firstVisit', 'true');
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: linkAddress,
                                            onload: function(response) {
                                                if (response.status !== 200) {
                                                    closePopup();
                                                    setTimeout(function() {
                                                        alert("ページを読み取れません");
                                                    }, 0);
                                                }
                                                if (response.status === 200) {
                                                    const parser = new DOMParser();
                                                    doc = parser.parseFromString(response.responseText, "text/html");
                                                    resolve(doc);
                                                }
                                            },
                                            onerror: function(error) {
                                                reject(error);
                                            }
                                        });
                                    }
                                }
                            },
                            onerror: function(error) {
                                reject(new Error("GM_xmlhttpRequest failed"));
                            }
                        });
                    });
                    promiseF.then(doc => {
                        const video = doc.querySelector('title').textContent;
                        const divV = doc.querySelector('#sample-video');
                        const imgV = divV.querySelector('img');
                        titleV = imgV.alt;
                        const linkV = divV.querySelector('a');
                        imagePl = linkV.href;
                        imagePs = imgV.src;
                        const tdsV = doc.querySelectorAll("td");
                        genreV = Array.from(tdsV).find(td => td.textContent.trim() === 'ジャンル：') ?.nextElementSibling.querySelectorAll("a");
                        genreTexts = Array.from(genreV).map(a => a.textContent);
                        for (let h = 0; h < tdsV.length; h++) {
                            if (tdsV[h].textContent === '配信開始日：') {
                                dateV = tdsV[h].nextElementSibling.textContent.replace(/\n/g, '');
                                break;
                            }
                        }
                        linkPerformers = doc.querySelectorAll("#performer a");
                        performer = linkPerformers.length > 0 ? Array.from(linkPerformers).map(linkPerformer => linkPerformer.textContent) : "";
                        // 出演者多数の場合
                        if (performer.includes('▼すべて表示する')) {
                            const performersScripts = doc.getElementsByTagName("script");
                            for (let i = 0; i < performersScripts.length; i++) {
                                let path = performersScripts[i].textContent;
                                if (path.includes("/ajax-performer/")) {
                                    path = path.substring(path.indexOf("url: ") + 6, path.indexOf("',"));
                                    urlPerformers = `https://www.dmm.co.jp${path}`;
                                    break;
                                }
                            }
                            const promiseP = new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: urlPerformers,
                                    onload: function(response) {
                                        const parserP = new DOMParser();
                                        const docP = parserP.parseFromString(response.responseText, "text/html");
                                        linkPerformers = docP.querySelectorAll("a");
                                        performer = Array.from(linkPerformers).map(linkPerformer => linkPerformer.textContent);
                                        resolve(performer);
                                    },
                                    onerror: function(error) {
                                        reject(error);
                                    }
                                });
                            });
                            promiseP.then(performer => {
                                // ▼すべて表示する があった場合
                                resolve({
                                    title: titleV,
                                    imagePl: imagePl,
                                    imagePs: imagePs,
                                    performer: performer,
                                    date: dateV,
                                    series: series,
                                    genreTexts: genreTexts
                                });
                            });
                        } else {
                            // 通常の処理で取得した場合
                            resolve({
                                titleV: titleV,
                                imagePl: imagePl,
                                imagePs: imagePs,
                                performer: performer,
                                dateV: dateV,
                                series: series,
                                genreTexts: genreTexts
                            });
                        }
                    });
                }
                // FANZA素人
                else if (linkAddress.startsWith('https://www.dmm.co.jp/digital/videoc/') || linkAddress.startsWith('http://www.dmm.co.jp/digital/videoc/')) {
                    const promiseA = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: linkAddress,
                            onload: function(response) {
                                if (response.status !== 200) {
                                    closePopup();
                                    setTimeout(function() {
                                        alert("ページを読み取れません");
                                    }, 0);
                                    return;
                                }
                                if (response.status === 200) {
                                    const parser = new DOMParser();
                                    doc = parser.parseFromString(response.responseText, "text/html");
                                    // 2回目以降のアクセス
                                    if (sessionStorage.getItem('firstVisit')) {
                                        resolve(doc);
                                    } else {
                                        // 初回アクセス時にログイン完了・年齢認証ページをGETした場合
                                        sessionStorage.setItem('firstVisit', 'true');
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: linkAddress,
                                            onload: function(response) {
                                                if (response.status !== 200) {
                                                    closePopup();
                                                    setTimeout(function() {
                                                        alert("ページを読み取れません");
                                                    }, 0);
                                                }
                                                if (response.status === 200) {
                                                    const parser = new DOMParser();
                                                    doc = parser.parseFromString(response.responseText, "text/html");
                                                    resolve(doc);
                                                }
                                            },
                                            onerror: function(error) {
                                                reject(error);
                                            }
                                        });
                                    }
                                }
                            },
                            onerror: function(error) {
                                reject(new Error("GM_xmlhttpRequest failed"));
                            }
                        });
                    });
                    promiseA.then(doc => {
                        const amateur = doc.querySelector('title').textContent;
                        const div = doc.querySelector('#sample-video');
                        const img = div.querySelector('img');
                        titleA = img.alt;
                        imageJp = img.src;
                        const tds = doc.querySelectorAll("td");
                        for (let h = 0; h < tds.length; h++) {
                            if (tds[h].textContent === '配信開始日：') {
                                dateA = tds[h].nextElementSibling.textContent.replace(/\n/g, '');
                            }
                            if (tds[h].textContent === '名前：') {
                                nameA = tds[h].nextElementSibling.textContent.replace(/\n/g, '');
                            }
                            if (tds[h].textContent === 'サイズ：') {
                                sizeA = tds[h].nextElementSibling.textContent.replace(/\n/g, '');
                                break;
                            }
                        }
                        resolve({
                            titleA: titleA,
                            imageJp: imageJp,
                            dateA: dateA,
                            nameA: nameA,
                            sizeA: sizeA,
                            series: series
                        });
                    });
                }
                // MGS
                else if (linkAddress.startsWith('https://www.mgstage.com/product/product_detail/') || linkAddress.startsWith('http://www.mgstage.com/product/product_detail/')) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: linkAddress,
                        onload: function(response) {
                            if (response.status !== 200) {
                                closePopup();
                                setTimeout(function() {
                                    alert("ページを読み取れません");
                                }, 0);
                                return;
                            }
                            // HTTPステータス200で開始
                            if (response.status === 200) {
                                // TOPページにリダイレクトされる場合
                                if (response.finalUrl === "https://www.mgstage.com/") {
                                    closePopup();
                                    setTimeout(function() {
                                        alert("作品ページが存在しません");
                                    }, 0);
                                    return;
                                } else {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, "text/html");
                                    const ageVerificationElement = doc.querySelector("h2");
                                    if (ageVerificationElement && ageVerificationElement.textContent === "年齢認証") {
                                        closePopup();
                                        setTimeout(function() {
                                            alert("年齢認証が必要なので、一旦MGSを開いて認証してから実行して下さい。");
                                        }, 0);
                                        return;
                                    }
                                    const div = doc.querySelector('.common_detail_cover');
                                    const h1 = div.querySelector('h1');
                                    titleM = h1.textContent;
                                    const img = div.querySelector('h2 img');
                                    imageM = img.src;
                                    const ths = doc.querySelectorAll('th');
                                    for (let th of ths) {
                                        if (th.textContent.includes('出演：')) {
                                            const td = th.nextElementSibling;
                                            nameM = td.textContent.trim();
                                        } else if (th.textContent.includes('配信開始日：')) {
                                            const td = th.nextElementSibling;
                                            dateM = td.textContent.trim();
                                        } else if (th.textContent.includes('シリーズ：')) {
                                            const td = th.nextElementSibling;
                                            series = td.textContent.trim();
                                        } else if (th.textContent.includes('レーベル：')) {
                                            const td = th.nextElementSibling;
                                            labelM = td.textContent.trim();
                                        }
                                    }
                                    resolve({
                                        titleM: titleM,
                                        imageM: imageM,
                                        nameM: nameM,
                                        dateM: dateM,
                                        series: series
                                    });
                                }
                            }
                        },
                        onerror: function(error) {
                            reject(new Error("GM_xmlhttpRequest failed"));
                        }
                    });
                } else {
                    // DMMとMGS以外のサイトは読み取り不可
                    closePopup();
                    setTimeout(function() {
                        alert("ページを読み取れません");
                    }, 0);
                    return;
                }
            }).then((result) => {
                title = result.title || title;
                titleV = result.titleV || titleV;
                titleA = result.titleA || titleA;
                titleM = result.titleM || titleM;
                date = result.date || date;
                dateV = result.dateV || dateV;
                dateA = result.dateA || dateA;
                dateM = result.dateM || dateM;
                imagePl = result.imagePl || imagePl;
                imagePs = result.imagePs || imagePs;
                imageM = result.imageM || imageM;
                imageJp = result.imageJp || imageJp;
                nameA = result.nameA || nameA;
                nameM = result.nameM || nameM;
                series = result.series || series;
                genreTexts = result.genreTexts || genreTexts;
                performer = result.performer || performer;
                sizeA = result.sizeA || sizeA;
            }).catch((error) => {
            });
            Promise.allSettled([promise3]).then(() => {
                // 伏字タイトルにアラート
                if (title.includes('●') || titleA.includes('●') || titleV.includes('●')) {
                    alert('タイトルに伏字 ● が含まれています。\n正しくタイトルが取得できているか確認して下さい。');
                }
                // シリーズ一覧の解析
                if (series === null) {
                    wikilinkPromise = Promise.resolve(null);
                } else {
                    // シリーズ名の伏字を解除
                    for (let [key, value] of Object.entries(omissionTable)) {
                        series = series.split(key).join(value);
                    }
                    // シリーズ名変換表で変換
                    series = seriesTable[series] || series;
                    // 文字コード変換
                    const Encoding = window.Encoding;
                    const utf8Array = Encoding.stringToCode(series);
                    const eucjpString = Encoding.convert(utf8Array, 'EUCJP', 'UNICODE');
                    const escaped = Encoding.urlEncode(eucjpString);
                    console.log(escaped);
                    // 検索用URL作成
                    const urlS = 'http://sougouwiki.com/search?search_target=page_name&keywords=' + escaped;
                    let searchResultTexts = [];
                    wikilinkPromise = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: urlS,
                            timeout: 5000,
                            ontimeout: function() {
                                closePopup();
                                setTimeout(function() {
                                    alert('しばらく時間をおいてやり直してください。');
                                }, 0);
                            },
                            // 検索ページのデータを取得
                            onload: function(response) {
                                const parser = new DOMParser();
                                const docS = parser.parseFromString(response.responseText, 'text/html');
                                const elements = docS.querySelectorAll('h3.keyword');
                                let seriesOK = false;
                                for (let j = 0; j < elements.length; j++) {
                                    searchResultTexts.push(elements[j].textContent);
                                }
                                // サーチ結果と比較
                                const missingTexts = series.slice();
                                for (let i = 0; i < searchResultTexts.length; i++) {
                                    if (missingTexts.includes(searchResultTexts[i])) {
                                        seriesOK = true;
                                        break;
                                    }
                                }
                                if (seriesOK) {
                                    // WIKIシリーズページを並び替え
                                    searchResultTexts.sort((a, b) => {
                                        const regex = /(\D+)(\d+)/;
                                        const aMatch = a.match(regex);
                                        const bMatch = b.match(regex);
                                        if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
                                            return aMatch[2] - bMatch[2];
                                        } else {
                                            return a.localeCompare(b);
                                        }
                                    });
                                    // シリーズ名をWIKI最新ページに変換
                                    series = searchResultTexts[searchResultTexts.length - 1];
                                    let wikilink = 'シリーズ一覧>' + series;
                                    resolve(wikilink);
                                } else {
                                    resolve(null);
                                }
                            },
                            onerror: function(error) {
                                reject(new Error("GM_xmlhttpRequest failed"));
                            }
                        });
                    });
                }
                // シリーズ一覧の有無を取得後の動作
                wikilinkPromise.then((wikilink) => {
                    // DMMの整形
                    if (title) {
                        // 日付の書式を修正
                        date = date && date.replace(/\//g, "-");
                        // タイトルの伏字を解除
                        for (let [key, value] of Object.entries(omissionTable)) {
                            title = title.split(key).join(value);
                        }
                        // 出演者情報を削除
                        if (anonymousTable.includes(maker)) {
                            performer = '';
                        }
                        // 配列であるかチェック
                        if (Array.isArray(performer)) {
                            performer = performer.map(p => p.replace(/（.*?）|\(.*?\)/g, '')).join(']]／[[');
                        } else {
                            performer = performer || ' ';
                        }
                        let wikilinkText = wikilink ? `[[${wikilink}]]` : '';
                        // 総集編を記載
                        if (genreTexts.some(text => text.includes('総集編'))) {
                            genreTexts = '総集編作品';
                            if (wikilinkText) {
                                wiki = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${title}|[[${performer}]]|${date}|${wikilinkText}~~${genreTexts}|`;
                            } else {
                                wiki = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${title}|[[${performer}]]|${date}|${genreTexts}|`;
                            }
                        } else {
                            wiki = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${title}|[[${performer}]]|${date}|${wikilinkText}|`;
                        }
                        GM_setClipboard(wiki);
                    }
                    // FANZA動画の整形
                    else if (titleV) {
                        // 日付の書式を修正、配信時間を削除
                        dateV = dateV && dateV.replace(/\//g, "-").replace(/\s.*/, '');
                        // タイトルの伏字を解除
                        for (let [key, value] of Object.entries(omissionTable)) {
                            titleV = titleV.split(key).join(value);
                        }
                        // 配列であるかチェック
                        if (Array.isArray(performer)) {
                            performer = performer.map(p => p.replace(/（.*?）|\(.*?\)/g, '')).join(']]／[[');
                        } else {
                            performer = performer || ' ';
                        }
                        let wikilinkText = wikilink ? `[[${wikilink}]]` : '';
                        // 総集編を記載
                        if (genreTexts.some(text => text.includes('総集編'))) {
                            genreTexts = '総集編作品';
                            if (wikilinkText) {
                                wikiV = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${titleV}|[[${performer}]]|${dateV}|${wikilinkText}~~${genreTexts}|`;
                            } else {
                                wikiV = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${titleV}|[[${performer}]]|${dateV}|${genreTexts}|`;
                            }
                        } else {
                            wikiV = `|[[${linkText}>${linkAddress}]]|[[${imagePs}>${imagePl}]]|${titleV}|[[${performer}]]|${dateV}|${wikilinkText}|`;
                        }
                        GM_setClipboard(wikiV);
                    }
                    // FANZA素人の整形
                    else if (titleA) {
                        // 日付の書式を修正
                        dateA = dateA && dateA.replace(/\//g, "-");
                        // タイトルの伏字を解除
                        for (let [key, value] of Object.entries(omissionTable)) {
                            titleA = titleA.split(key).join(value);
                        }
                        let imageJs = imageJp.replace("jp.jpg", "js.jpg");
                        let wikilinkText = wikilink ? `[[${wikilink}]]` : '';
                        let wikiA = '';
                        // サイズの記載がない場合
                        if (sizeA === 'T--- B-- W-- H--') {
                            wikiA = `|[[${linkText}>${linkAddress}]]|[[${imageJs}>${imageJp}]]|${nameA}|[[ ]]|${dateA}||`;

                        } else {
                            wikiA = `|[[${linkText}>${linkAddress}]]|[[${imageJs}>${imageJp}]]|${nameA}~~${sizeA}|[[ ]]|${dateA}||`;
                        }
                        GM_setClipboard(wikiA);
                    }
                    // MGSの整形
                    if (titleM) {
                        // 日付の書式を修正
                        dateM = dateM && dateM.replace(/\//g, "-");
                        // 前後の空白スペースを削除
                        titleM = titleM.trim();
                        // 追加の画像ファイルアドレスを作成
                        let imageMe = imageM.replace(/\/pf_o1_/g, "/pb_e_");
                        let imageMe2 = imageM.replace(/\/pb_p_/g, "/pb_e_");
                        let imageMt1 = imageM.replace(/\/pb_p_/g, "/pb_t1_");
                        if (imageM.includes("/pb_p_")) {
                            imageMt1 = imageM.replace(/\/pb_p_/g, "/pb_t1_");
                        } else {
                            imageMt1 = null; // t1を使わないフラグ
                        }
                        // nameMがundefineの場合空白文字を代入
                        nameM = nameM || ' ';
                        nameM = nameM.replace(/\n/g, '');
                        if (labelM.includes(giveNameLabel)) {
                            nameM = nameM.replace(/ {2,}/g, ']]／[[');
                        } else { nameM = nameM.replace(/ {2,}/g, '~~');
                               }
                        let wikilinkText = wikilink ? `[[${wikilink}]]` : '';
                        // 名前なし画像o1
                        if (nameM === " ") {
                            let wikiM = `|[[${linkText}>${linkAddress}]]|[[&ref(${imageM},147)>${imageMe}]]|${titleM}|[[ ]]|${dateM}|${wikilinkText}|`;
                            GM_setClipboard(wikiM);
                        } else {
                            // 名前あり画像t1
                            if (imageMt1) {
                                let wikiM = `|[[${linkText}>${linkAddress}]]|[[${imageMt1}>${imageMe2}]]|${titleM}~~${nameM}|[[ ]]|${dateM}|${wikilinkText}|`;
                                GM_setClipboard(wikiM);
                            } else {
                                // 名前あり画像o1、出演者表示あり
                                if (labelM.includes(giveNameLabel)) {
                                    nameM = nameM.replace(/ {2,}/g, ']]／[[');
                                    let wikiM = `|[[${linkText}>${linkAddress}]]|[[&ref(${imageM},147)>${imageMe}]]|${titleM}|[[${nameM}]]|${dateM}|${wikilinkText}|`;
                                    GM_setClipboard(wikiM);
                                } else {
                                    // 名前あり画像o1、出演者表示なし
                                    let wikiM = `|[[${linkText}>${linkAddress}]]|[[&ref(${imageM},147)>${imageMe}]]|${titleM}~~${nameM}|[[ ]]|${dateM}|${wikilinkText}|`;
                                    GM_setClipboard(wikiM);
                                }
                            }
                        }
                    }
                    // 取得完了をポップアップ表示
                    document.body.removeChild(popup);
                    document.body.appendChild(popupGET);
                    setTimeout(function() {
                        document.body.removeChild(popupGET);
                    }, 2000);
                });
            });
        }
    });
    // シリーズ名変換表 //　'商品ページのシリーズ名': 'WIKIのシリーズページ名',　//
    const seriesTable = {
        // DMM
        '硬くなった乳首を責めるほど息が荒くなる我慢顔を見られ続け恥らいながらも腰が動きだす清楚女': '硬くなった乳首を責めるほど息が荒くなる…',
        '我慢できれば生中出しSEX！': '我慢できれば生★中出しSEX！',
        '羞恥！': '羞恥娘',
        'マジックミラー便（MM便）': '街中ゲリラ路上ナンパ兵器 マジックミラー便',
        '満員バスで背後から制服越しにねっとり乳揉み痴漢され腰をクネらせ感じまくる巨乳女子校生': '満員バスで背後から制服越しにねっとり乳揉み痴漢され…',
        '夜行バスで声も出せずイカされた隙に生ハメされた女はスローピストンの痺れる快感に理性を失い中出しも拒めない': '夜行バスで声も出せずイカされた隙に生ハメされた女',
        '予備校に通う地味でマジメな女子校生をレ●プしながら全身を媚薬漬けにしたら': '予備校に通う地味でマジメな女子校生をレイプしながら全身を媚薬漬けにしたら',
        //MGS
    };
    // シリーズオンリー表　//　シリーズページのみでレーベルページが存在しない場合のページキーワード
    const seriesOnly = [
        // DMM
        "妻ドキュメント",
        "妻、ふたたび。 ",
        //MGS
        "体験撮影",
        "初AV撮影",
        "百戦錬磨",
        "マジ軟派",
    ];
    // MGS出演者表示レーベル表
    const giveNameLabel = [
        "ふぇちぽいんと",
    ];
    // 出演者情報削除メーカー
    const anonymousTable = [
        'MDMA',
        'ジュエル',
        '唾鬼',
        '豊彦',
        'メガハーツ',
    ];
    // 伏字変換表
    const omissionTable = {
        '犯●れ': '犯され',
        '●す': '犯す',
        '虐●': '虐待',
        '強●ア': '強制ア',
        '強●イ': '強制イ',
        '強●お': '強制お',
        '強●開': '強制開',
        '強●く': '強制く',
        '強●ク': '強制ク',
        '強●コ': '強制コ',
        '強●シ': '強制シ',
        '強●射': '強制射',
        '強●受': '強制受',
        '強●ス': '強制ス',
        '強●セ': '強制セ',
        '強●性': '強制性',
        '強●絶': '強制絶',
        '強●タ': '強制タ',
        '強●種': '強制種',
        '強●中': '強制中',
        '強●ね': '強制ね',
        '強●ノ': '強制ノ',
        '強●喉': '強制喉',
        '強●ハ': '強制ハ',
        '強●媚': '強制媚',
        '強●フ': '強制フ',
        '強●わ': '強制わ',
        '強●': '強姦',
        '昏●': '昏睡',
        '催●': '催眠',
        '折●': '折檻',
        '痴●': '痴漢',
        '泥●': '泥酔',
        '奴●': '奴隷',
        '●ませ': '飲ませ',
        '媚●': '媚薬',
        '●物': '薬物',
        '●っ払い': '酔っ払い',
        '●っぱらい': '酔っぱらい',
        '夜●い': '夜這い',
        '陵●': '陵辱',
        '凌●': '凌辱',
        '輪●': '輪姦',
        'レ●プ': 'レイプ',
    };
    // カッコ内を削除
    const keywordsS = [
        'AROMA',
        'digital ark',
        'FAプロ（',
        'FALENO（',
        'First Star',
        'FSET(',
        'GLORY QUEST',
        'MADAM MANIAC (',
        'MAX-A（',
        'Hunter（HUNBL）',
        'Nadeshiko（',
        'SODクリエイト（',
        'RUBY（',
        'U＆K',
        'アタッカーズ',
        'キチックス',
        'ゴールデンタイム',
        'セレブの友',
        'フェアエスト',
        'ドリームチケット',
        'マザー（',
    ];
    // DMMから取得したレーベル名を削除する一覧
    const missingLabel = [
        'AKNR',
        'AROMA',
        'ATHENA',
        'AVSCollector’s',
        'BALTAN Hoppin’',
        'Calen',
        'COSMOSPICTURES',
        'digitalark',
        'DEEP’S',
        'DEEP’S 2号店',
        'DEEP’S 3号店',
        'Dogma',
        'gaincorporation',
        'GAS',
        'GLORYQUEST',
        'HHHグループ',
        'HIBINO',
        'HOT',
        'K-Tribe',
        'LOTUS',
        'M’s video Group',
        'Madonna',
        'MADOOOON！！！！',
        'MAXING',
        'Nadeshiko',
        '無垢（',
        'OPERA',
        'RUBY',
        'S1NO.1STYLE',
        'WANZ',
        'エンペラー',
        'お母さん.com/ABC', //妄想族
        '企画', //妄想族
        'キチックス・プラス', //妄想族
        '巨乳', //妄想族
        '新人', //妄想族
        'ながえSTYLE',
        '美少女', //妄想族
        '人妻', //妄想族
        'ルナティックス',
        '炉利', //妄想族
    ];
    // メーカー名変換表　//　'変換前': '変換後',　 //　※行番号の矢印をクリックすると折り畳めます。
    const conversionTable = {
        '120％リアルガチ軟派': 'プレステージ／釣師',
        'ABSOLUTE': 'プレステージ／ABSOLUTE',
        'ABSOLUTELY PERFECT': 'プレステージ／ABSOLUTELY PERFECT',
        'ABSOLUTELY WONDERFUL': 'プレステージ／ABSOLUTELY WONDERFUL',
        'ACHIJO（アチージョ）': 'マドンナ／ACHIJO',
        'AOZ(青空ソフト)': '青空ソフト',
        'AROMA': 'アロマ企画',
        'ATHENA': 'アテナ映像',
        'amazoness': 'バルタン／amazoness',
        'BALTAN＜バルタン＞': 'バルタン',
        'ゲッツ！！／BANG！！': 'プレステージ／BANG！！',
        'BAZOOKA': 'ケイ・エム・プロデュース／BAZOOKA',
        'beginning': 'プレステージ／beginning',
        'Boin「○○」Box': 'ABC/妄想族',
        'BORN': 'VENUS／BORN',
        'candy': 'バルタン／candy',
        'CAWD': 'kawaii',
        'COBRA（ワープ）': 'ワープエンタテインメント／COBRA',
        'Core': 'ゴーゴーズ／GoGo’s Core',
        'DASD(ダスッ！)': 'ダスッ！',
        'DASS(ダスッ！)': 'ダスッ！',
        'diamond': 'バルタン／diamond',
        'DIEGO': 'プレステージ／DIEGO',
        'digital ark ': 'デジタルアーク',
        'discover（プレステージ）': 'プレステージ／discover',
        'DOC PREMIUM': 'プレステージ／DOC PREMIUM',
        'DROP（OFFICE K’S）': 'OFFICE K’S／DROP',
        'DVDES': 'ディープス',
        'DVDMS': 'ディープス',
        'DVEH': 'ディープス',
        'DVRT': 'ディープス',
        'e-KiSSレーベル': 'クリスタル映像／e-kiss',
        'emerald': 'バルタン／emerald',
        'EQレーベル': 'ブリット',
        'FAA': 'F＆A',
        'FALENO TUBE': 'FALENO／FALENO TUBE',
        'FIVE STARS': 'プレステージ／FIVE STARS',
        'FSET': 'アキノリ',
        'FOCUS': 'ABC/妄想族',
        'GENSEKI': 'クリスタル映像／GENSEKI',
        'GLAMOROUS': 'プレミアム／GLAMOROUS',
        'GLORY QUEST': 'グローリークエスト',
        'GOS': 'ゴーゴーズ／GOS',
        'GYAN（プレステージ）': 'プレステージ／GYAN',
        'HAVD': 'ヒビノ',
        'HERO（アクアモール）': 'アクアモール/エマニエル',
        'Hoppin\'': 'バルタン',
        'IENF': 'アイエナジー／IENF',
        'IESM': 'アイエナジー／IESM',
        'IESP': 'アイエナジー／IESP',
        'JUC': 'マドンナ',
        'JUKD': 'マドンナ',
        'JUL': 'マドンナ',
        'JUQ': 'マドンナ',
        'JUY': 'マドンナ',
        'JUX': 'マドンナ',
        'KANBi': 'プレステージ／KANBi',
        'KANBi（MGS動画）': 'KANBi',
        'KAWD': 'kawaii',
        'KIRAY': 'S-Cute／KIRAY',
        'kira☆kira BLACK GAL': 'kira☆kira',
        '麗-KIREI SOD-': 'SODクリエイト／麗-KIREI SOD-',
        'KRUレーベル': 'カルマ',
        'LADY HUNTERS': '桃太郎映像出版／LADY HUNTERS',
        'MADAM MANIAC': 'クリスタル映像／MADAM MANIAC',
        'MANIAC（クリスタル）': 'クリスタル映像／MANIAC',
        'MARX Brothers co. (SMA)': 'MARX',
        'MAXING': 'マックスエー',
        'MBMH': 'MBM',
        'MBMP': 'MBM',
        'MCP': 'MARRION／MCP',
        'MDUDレーベル': 'アートモード',
        'MEGATRA': 'プレステージ／MEGATRA',
        'million mint': 'ケイ・エム・プロデュース／million mint',
        'MONROE': 'マドンナ／MONROE',
        'MOODYZ': 'ムーディーズ',
        'MOODYZ ACID': 'ムーディーズ／MOODYZ ACID',
        'MOODYZ DIVA': 'ムーディーズ／MOODYZ DIVA',
        'MOODYZ Fresh': 'ムーディーズ／MOODYZ Fresh',
        'MOODYZ Gati': 'ムーディーズ／MOODYZ Gati',
        'MOODYZ REAL': 'ムーディーズ／MOODYZ REAL',
        'MOVIE': 'グラフィティジャパン／MOVIE',
        'M’s video Group（': 'エムズビデオグループ',
        'Ms.SOD': 'SODクリエイト／Ms.SOD',
        'Nadeshiko': 'なでしこ',
        'NAMADORE本舗': 'Fitch／NAMADORE本舗',
        'NIKUYOKU': 'Fitch／NIKUYOKU',
        'NITRO': 'クリスタル映像／NITRO',
        'NHDT': 'ナチュラルハイ',
        'NHDTA': 'ナチュラルハイ',
        'NHDTB': 'ナチュラルハイ',
        'Obasan': 'マドンナ／Obasan',
        'PISTレーベル': 'pistil',
        'POST': 'レッド／卍GROUP',
        'PRESTIGE×HMJM(PXH)': 'プレステージ／PRESTIGE×HMJM',
        'REAL（XRL）': 'ケイ・エム・プロデュース／REAL',
        'REAL（XRLE）': 'ケイ・エム・プロデュース／REAL',
        'REAL（ケイ・エム・プロデュース）': 'ケイ・エム・プロデュース／REAL',
        'REAL（レアルワークス）': 'ケイ・エム・プロデュース／REAL',
        'Relaxation Room': 'プレステージ／Relaxation Room',
        'Rose（ルビー）': 'ルビー／Rose',
        'RUBY': 'ルビー',
        'RUBY SPORT': 'ルビー',
        'S1 NO.1 STYLE': 'エスワン ナンバーワンスタイル',
        'S-CRIME': 'グレイズ／S-CRIME',
        'SACE': 'SODクリエイト',
        'SDAM': 'SODクリエイト',
        'SDDE': 'SODクリエイト',
        'SDMT': 'SODクリエイト',
        'SDMU': 'SODクリエイト',
        'SDMUA': 'SODクリエイト',
        'Secret': 'ルビー/Secret',
        'SEXの逸材。': 'プレステージ／amateur',
        'SOD PREDEBUT': 'SODクリエイト',
        'STAR': 'SODクリエイト',
        'STARS': 'SODクリエイト',
        'SUKESUKE': 'プレステージ／SUKESUKE',
        'TASH': 'レッド／卍GROUP',
        'TISSUE': 'アイデアポケット／ティッシュ',
        'TOKYO BLUE': 'プレステージ／TOKYO BLUE',
        'U＆K ': 'U＆K',
        'victoria': 'バルタン／victoria',
        'Video PodCast': 'MAGIC／Video PodCast',
        'V＆R': 'V＆R PRODUCE',
        'WAレーベル': 'ロータス',
        'WANZ': 'ワンズファクトリー',
        'WATER POLE ON STREET': 'プレステージ／WATER POLE ON STREET',
        'YST': '光夜蝶',
        'ZAP': 'プレステージ／ZAP',
        'アイポケ逸材発掘プロジェクト': 'アイデアポケット／アイポケ逸材発掘プロジェクト',
        'アフターサービス': 'プレステージ／アフターサービス',
        '赤まむし': 'プレステージ／赤まむし',
        'アマチュア無銭': 'MERCURY／アマチュア無銭',
        '頂_itadaki': 'ビッグモーカル/頂 itadaki',
        '愛しのデリヘル嬢': 'プラム',
        'イルカ': 'イルカ/エマニエル',
        '淫熟（ルビー）': 'ルビー/淫熟',
        'ウタカタ': 'OFFICE K’S／ウタカタ',
        '宇宙企画': 'ケイ・エム・プロデュース／宇宙企画',
        'エクスタシズム': 'MERCURY／エクスタシズム',
        'エスカレートするドしろーと娘': 'プレステージ／だましや',
        'エレガンス': 'プレミアム／エレガンス',
        'エロマン': 'SODクリエイト／エロマン',
        'エロ黒姉さん': 'MERCURY／エロ黒姉さん',
        'エロ白姉さん': 'MERCURY／エロ白姉さん',
        '円光タダまん': 'First Star／円光タダまん',
        'エンペラー': 'エンペラー／妄想族',
        'お母さん.com/ABC': 'ABC/妄想族',
        '大人のドラマ': 'アタッカーズ',
        'おばパコ食堂': 'MERCURY／おばパコ食堂',
        'お持ち帰り': 'お持ち帰り/熟女卍',
        'かぐや姫Pt': 'かぐや姫Pt/妄想族',
        'かつお物産': 'かつお物産/妄想族',
        '完ナマSTYLE': 'First Star',
        'キチックス': 'キチックス/妄想族',
        'キチックス／妄想族': 'キチックス/妄想族',
        'キミホレ': 'SODクリエイト／キミホレ',
        '口説き術': 'プレステージ／口説き術',
        '黒船（': 'プレステージ／黒船',
        '黒百合': 'ルビー／黒百合',
        '催眠RASH': 'ヒプノシスRASH',
        '催眠研究所別館': 'ヒプノシスラボ/妄想族',
        'シャトーブリ庵': 'MERCURY／シャトーブリ庵',
        '蛇縛': 'アタッカーズ／蛇縛',
        '羞恥娘': 'サディスティックヴィレッジ／羞恥娘',
        '熟女塾': '熟女塾/エマニエル',
        '淑女の晩餐': 'バルタン／淑女の晩餐',
        '熟女プライベート/エマニエル': '熟女プライベート/熟女卍',
        '女性主権': 'バルタン／女性主権',
        '初代渋谷特別特攻本部': 'MERCURY／初代渋谷特別特攻本部',
        '女優のクセがスゴい！！': 'SODクリエイト／女優のクセがスゴい！！',
        '素人援交生中出し': 'プラム',
        '素人参加バラエティー': 'サディスティックヴィレッジ／素人参加バラエティー',
        '素人ホイホイSelection': 'MBM',
        '素人四畳半生中出し': 'プラム',
        '新宿UNDERGROUND': 'MERCURY／新宿UNDERGROUND',
        '新・素人娘、お貸しします。': 'プレステージ／貸',
        'スクープ': 'ケイ・エム・プロデュース／SCOOP',
        'スクープ(SCPX)': 'ケイ・エム・プロデュース／SCOOP',
        'すれてない': 'プラム',
        '靖云会': '豊彦／靖云会',
        '性獣少女': 'バルタン／性獣少女',
        '雪月花': 'プレステージ／雪月花',
        '絶対的美少女、お貸しします。': 'プレステージ／貸',
        '全裸家族': 'MERCURY／全裸家族',
        '綜実社': '綜実社/妄想族',
        '第一放送': 'タカラ映像／第一放送',
        '正しい人妻の愛し方': 'MERCURY／正しい人妻の愛し方',
        '旅路': 'ルビー',
        '旅ハメ': 'MERCURY／旅ハメ',
        '熟れコミ': 'マドンナ／熟れコミ',
        '乳と母': '乳と母/エマニエル',
        'チェリーズれぼ': 'チェリーズれぼ/妄想族',
        'チキチキカマー': 'チキチキカマー/妄想族',
        'ティーチャー': 'ティーチャー／妄想族',
        '帝国': 'ルビー／帝国',
        '帝都裏映像': 'グレイズ／帝都裏映像',
        '東京HAPPENSGATE': 'MERCURY／東京HAPPENSGATE',
        'ドキュメントなう。': 'プレステージ／ドキュメントなう。',
        '毒宴会': 'ケイ・エム・プロデュース／毒宴会',
        'ながえSTYLE': 'ながえスタイル',
        '七狗留': 'プラネットプラス／七狗留',
        'なめこ': 'あら、スケベ/妄想族',
        'ナンパコ': 'First Star／ナンパコ',
        'ナンパーズ': 'ピーターズ／ナンパーズ',
        '肉厚食堂': '肉厚食堂/妄想族',
        '肉漫': 'Fitch／肉漫',
        'パイオツカイデー同好会': 'MERCURY／パイオツカイデー同好会',
        'パコ撮り': 'First Star／パコ撮り',
        'パコパコ団とゆかいな仲間たち': 'パコパコ団とゆかいな仲間たち/妄想族',
        '花ざかりの妻たち': 'E-BODY／花ざかりの妻たち',
        'バビロン': 'バビロン/妄想族',
        '聖（ルビー）': 'ルビー/聖',
        'ピンクジャンキー(JKSR)': 'ビッグモーカル／ピンクジャンキー',
        'ファーストスター': 'First Star／ファーストスター ネオ',
        'フェアエスト': 'グラフィティジャパン／フェアエスト',
        'フェチプラム': 'プラム／素人オンリープラム',
        'プリモ(PYM)': 'プリモ',
        'プレミア夢': 'MERCURY／プレミア夢',
        'ブロッコリー': 'ブロッコリー/妄想族',
        '慕情': 'ルビー/慕情',
        '本中 (HNDS)': '本中',
        '山と空': '山と空/妄想族',
        '楊貴妃': 'ルビー/楊貴妃',
        'よろず本舗': 'プレステージ／よろず本舗',
        '孫の手（ルビー）': 'ルビー/孫の手',
        'マジックミラー号（SDMM）': 'SODクリエイト／マジックミラー号',
        'マジックミラー号（サディスティックヴィレッジ）': 'サディスティックヴィレッジ／マジックミラー号',
        'まんきつ': 'ムーディーズ／まんきつ',
        'みんなのキカタン': 'ムーディーズ／みんなのキカタン',
        'ムチムッチ': 'マザー／ムチムッチ',
        'もぎたて': 'SODクリエイト／もぎたて',
        'ももいろ家族': 'SODクリエイト／ももいろ家族',
        '裸婦趣向': 'プラネットプラス／裸婦趣向',
        'リコピン': 'リコピン/妄想族',
        '龍縛': 'アタッカーズ／龍縛',
        'レイプ': 'レッド／卍GROUP',
        'レッド突撃隊': 'レッド',
        'ローカルワイフ': '花と蜜／ローカルワイフ',
        '若桃レーベル': '桃太郎映像出版／若桃',
        'ワレメ': '姦乱者/妄想族',
        // VR
        'ナチュラルハイVR': 'ナチュラルハイ',
        'HHH-VR': 'Hunter',
        'KMPVR': 'ケイ・エム・プロデュース',
        'Marrion_Group_VR': 'unfinished／Marrion Group VR',
        'SODVR': 'SODクリエイト',
        'TMAVR': 'TMA',
        'WANZ VR': 'ワンズファクトリー',
        // アダルトサイト
        'MADOOOON！！！！': 'マドンナ',
        'Re:Fuck': 'Re：Fuck',
        'SUKEKIYO': 'DOC／SUKEKIYO',
        'スケザネヘイタ': 'イチャラブヘイタ',
        'ぱいぱいズリ子。': 'BOING／ぱいぱいズリ子。',
        'ヤミヤミ': 'プレステージ／ヤミヤミ',
    };
})();