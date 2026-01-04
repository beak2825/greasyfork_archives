// ==UserScript==
// @name         漏れチェッカー用 名前変換表データ抽出
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  漏れチェッカー用の名前変換表データを抽出しクリップボードに取得
// @author       vrav
// @license      public domain
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=756401
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=756418
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704513
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704160
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704450
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757568
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757569
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757570
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/500158/%E6%BC%8F%E3%82%8C%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E7%94%A8%20%E5%90%8D%E5%89%8D%E5%A4%89%E6%8F%9B%E8%A1%A8%E3%83%87%E3%83%BC%E3%82%BF%E6%8A%BD%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/500158/%E6%BC%8F%E3%82%8C%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E7%94%A8%20%E5%90%8D%E5%89%8D%E5%A4%89%E6%8F%9B%E8%A1%A8%E3%83%87%E3%83%BC%E3%82%BF%E6%8A%BD%E5%87%BA.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　　　　　<<　使い方　>>
//  「漏れチェック」スクリプトの名前変換表を更新するために定期的に実行する必要があります。
//  女優ページ一覧の編集画面　https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556　を開き5秒ほど待つと
//  「COPY」のメッセージが中央に表示されデータがクリップボードにコピーされます。
//  「漏れチェック」スクリプトを開き、conversionTable行の左の行番号の右をクリックして1行に折り畳んでから
//  その行にカーソルを置き、上部メニューから 選択 → 行を選択 → ペーストします。
//  コードのレイアウトを整える場合は、上部メニューから 開発用 → すべて自動インデント を実行します。
//  最後に上部メニューから ファイル → 保存 を実行します。
//
//　Tampermonkeyをchromeにピン止めし、使う時だけON・OFFして下さい。
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function () {
    'use strict';
    // あ行～ら行を取得
    const urls = [
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=756401',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=756418',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704513',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704160',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704450',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=757568',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=757569',
        'https://seesaawiki.jp/w/sougouwiki/e/edit?id=757570'
    ];
    let allData = [];
    let loadedCount = 0;
    urls.forEach(function (url, index) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status !== 200) {
                    console.log(`ロードできませんでした ${url}`);
                } else {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    let sdata = doc.getElementById("content").value;
                    // データを行に分割
                    let lines = sdata.split("\n");
                    allData[index] = lines;
                    loadedCount++;
                    if (loadedCount === urls.length) {
                        // 変換テーブルを初期化
                        let conversionTable = {};
                        // 各行をループ
                        for (let i = 0; i < allData.length; i++) {
                            let lines = allData[i];
                            for (let j = 0; j < lines.length; j++) {
                                let line = lines[j];
                                //  :Posting: 削除
                                while (line.includes(':Posting:')) {
                                    const postingIndex = line.indexOf(':Posting:');
                                    const startIndex = line.lastIndexOf('[[', postingIndex);
                                    const endIndex = line.indexOf(']]', postingIndex);
                                    if (startIndex !== -1 && endIndex !== -1) {
                                        line = line.slice(0, startIndex) + line.slice(endIndex + 2);
                                    } else {
                                        break;
                                    }
                                }
                                let after;
                                // 行が ''} を含むかどうかを確認
                                if (line.includes("''}")) {
                                    let index = line.indexOf("''}");
                                    let substring = line.substring(index + 3);
                                    let match = substring.match(/\[\[(.+?)\]\]/);
                                    if (match) {
                                        after = match[1];
                                        let matches = line.match(/\[\[(.+?)\]\]/g);
                                        for (let k = 0; k < matches.length; k++) {
                                            let before = matches[k].substring(2, matches[k].length - 2);
                                            if (before !== after) {
                                                conversionTable[before] = after;
                                            }
                                        }
                                    }
                                } else {
                                    let matches = line.match(/(＝|／|-)\[\[(.+?)\]\]/g);
                                    if (matches && matches.length > 0) {
                                        after = matches[0].substring(3, matches[0].length - 2);
                                        for (let k = 1; k < matches.length; k++) {
                                            let before = matches[k].substring(3, matches[k].length - 2);
                                            if (before !== after) {
                                                conversionTable[before] = after;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // 変換テーブルを文字列に変換してクリップボードにコピーする関数
                        function copyConversionTableToClipboard(conversionTable) {
                            let result = "const conversionTable = {\n";
                            for (let key in conversionTable) {
                                let line = `'${key}': '${conversionTable[key]}',\n`;
                                if (!line.includes('>')) {
                                    result += line;
                                }
                            }
                            result += "};";
                            GM_setClipboard(result);
                        }
                        copyConversionTableToClipboard(conversionTable);
                        // 取得完了をポップアップ表示
                        const popup = document.createElement("div");
                        popup.style.position = "fixed";
                        popup.style.top = "50%";
                        popup.style.left = "50%";
                        popup.style.transform = "translate(-50%, -50%)";
                        popup.style.border = "none";
                        popup.style.padding = "20px";
                        popup.style.backgroundColor = "#fff";
                        popup.style.fontSize = "24px";
                        popup.style.zIndex = 9999;
                        popup.innerHTML = "COPY";
                        document.body.appendChild(popup);
                        setTimeout(function () {
                            document.body.removeChild(popup);
                        }, 2000);
                        console.log(`名簿データを取得しました`);
                    }
                }
            },
            onerror: function (response) {
                console.log(`ロードできませんでした ${url}`);
            }
        });
    });
})();