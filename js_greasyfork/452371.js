// ==UserScript==
// @name         CSV Download
// @namespace    https://github.com/Yuto-34
// @license      Yuto-34
// @version      1.0.1
// @description  Export csv file of displayed month.
// @author       Yuto
// @match        https://moneyforward.com/cf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moneyforward.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452371/CSV%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/452371/CSV%20Download.meta.js
// ==/UserScript==


function handleDownload() {
    // セルの中の改行を消す為の正規表現
    const removeN = /\n.*/g;
    const removeComma = /,/g;
    const regex = 'icon-check icon-large';

    // 文字コードをBOM付きUTF-8に指定
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

    // データが入っている要素を取得
    var table = document.getElementById('cf-detail-table');
    const yearSlash = document.getElementsByTagName("h2")[1].innerText.slice(0,5);

    // ここに文字データとして値を格納していく
    var data_csv="計算対象, 日付, 内容, 金額, 保有金融機関, 大項目, 中項目, メモ, 振替\n";


    for(var i = 1; i < table.rows.length; i++){
        var isTransfar
        // 振替チェック
        if(table.rows[i].cells[3].innerText.indexOf('\n') != -1) {
            isTransfar = true;
        } else {
            isTransfar = false;
        }
        for(var j = 0; j < table.rows[i].cells.length - 1; j++){
            // data_cell の用意
            var data_cell = table.rows[i].cells[j];

            // HTML中の表のセル値をdata_csvに格納
            if(j == 0) {
                if((data_cell.innerHTML + '').indexOf(regex) != -1) {
                    data_csv += 'TRUE';
                } else {
                    data_csv += 'FALSE';
                }
            } else if(j == 1) {
                var dataTemp = (yearSlash + data_cell.innerText.replace(removeN, "").replace(removeComma, ""));
                data_csv += dataTemp.slice(0,10);
            } else if(j == 8 && isTransfar) {
                data_csv += 'TRUE';
            } else {
                data_csv += data_cell.innerText.replace(removeN, "").replace(removeComma, "");
            }

            // 行終わりに改行コードを追加
            if(j == table.rows[i].cells.length - 2) data_csv += "\n";

            // セル値の区切り文字として,を追加
            else data_csv += ",";
        }
    }

    // ダウンロードボタンの作成
    var fileName = document.getElementsByTagName('h2')[1].innerText.slice(2,7).replace('/', '_');
    fileName += '.csv';

    var parentDiv = document.getElementsByClassName('pull-right mf-mb-medium')[0];
    if(document.getElementById('download') != null) {
        parentDiv.removeChild(download);
    }

    var childA = document.getElementsByClassName('btn cf-new-btn btn-warning')[0];
    var blob = new Blob([ bom, data_csv ], { "type" : "text/csv" });

    var newElement = document.createElement('a');
    var newContent = document.createTextNode('Download');
    newElement.appendChild(newContent);
    newElement.setAttribute('id', 'download');
    newElement.setAttribute('href', '#');
    newElement.setAttribute('style', 'padding:5px 20px; width: 100px; height: 32px; line-height: 34px; margin-right: 10px;');
    newElement.className = 'btn cf-new-btn btn-warning';
    newElement.href = window.URL.createObjectURL(blob);
    newElement.download = fileName;

    parentDiv.insertBefore(newElement, childA);

    // delete data_csv;//data_csvオブジェクトはもういらないので消去してメモリを開放
}


(function() {
    'use strict';
    // Your code here...

    handleDownload();

    var observer = new MutationObserver(function(){
        // DOMの変化が起こった時の処理
        console.log('DOMが変化しました');
        var parentDiv = document.getElementsByClassName('pull-right mf-mb-medium')[0];
        if(document.getElementById('download') != null) {
            parentDiv.removeChild(download);
        }
        // handleDownloadを実行
        console.log('reload');
        handleDownload();
        console.log('reloaded');
        if(document.getElementsByTagName('h2')[0].innerText.indexOf('Loading') != -1) {
            if(document.getElementById('download') != null) {
                parentDiv.removeChild(download);
            }
        }
    }, false);

    // 監視対象の要素オブジェクト
    const elem = document.getElementsByClassName('date_range transaction-in-out-header')[0];

    // 監視時のオプション
    const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    };

    // 要素の変化監視をスタート
    observer.observe(elem, config);
})();