// ==UserScript==
// @name         置換ツール
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  リダイレクトページ変更に伴う各ページ女優名変更のための置換ツール
// @author       vrav
// @license      public domain
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=*
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=756401
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=756418
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704513
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704160
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704450
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757568
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757569
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757570
// @downloadURL https://update.greasyfork.org/scripts/500163/%E7%BD%AE%E6%8F%9B%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500163/%E7%BD%AE%E6%8F%9B%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　<<　使い方　>>
//　リダイレクトページ変更に伴い大量のページで女優名を変更する作業を
//  簡単に行うためのスクリプトです。
//  編集エリア上部の左欄に置換前、右欄に置換後の文字列を入力し、置換ボタン
//  またはEnterキーを押すと実行され、置換数が表示されます。
//  Ctrl+Enterキーを押すと保存ボタンが押せます。
//　ページを移っても入力データは保持されます。
//　[[　]]は考慮せずに入力できます。
//
//　　　　　　　　　　　　　　　　　　　　　　　　　<<　操作のコツ　>>
//  一度データを決定してしまえば、次に開くページでも前のデータが記憶されているので、別途の「編集ページを直接開く」スクリプト↓
//  https://greasyfork.org/ja/scripts/500152-%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E7%9B%B4%E6%8E%A5%E9%96%8B%E3%81%8F
//  で一気にタブを開き、Ctrl+Tubでタブの移動→Enterで置き換え→Ctrl+Enterで保存、と連続して素早く編集することができます。
//
//　Tampermonkeyをchromeにピン止めし、使う時だけON・OFFして下さい。
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function () {
    //　テキストエリアに追加の要素を設置
    let oldText = localStorage.getItem('oldText') || '';
    let newText = localStorage.getItem('newText') || '';
    const container = document.createElement('div');
    const oldLabel = document.createElement('label');
    oldLabel.textContent = '置換文字を入力　';
    container.appendChild(oldLabel);
    const redStart1 = document.createElement('span');
    redStart1.textContent = '[[';
    redStart1.style.color = 'red';
    container.appendChild(redStart1);
    const oldInput = document.createElement('input');
    oldInput.type = 'text';
    oldInput.value = oldText;
    oldInput.style.width = "200px";
    oldInput.style.color = 'blue';
    container.appendChild(oldInput);
    const redStart2 = document.createElement('label');
    redStart2.textContent = ']]';
    redStart2.style.color = 'red';
    container.appendChild(redStart2);
    const oldLabel2 = document.createElement('label');
    oldLabel2.textContent = '　→　';
    container.appendChild(oldLabel2);
    const newStart = document.createElement('span');
    newStart.textContent = '[[';
    newStart.style.color = 'red';
    container.appendChild(newStart);
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.value = newText;
    newInput.style.width = "200px";
    newInput.style.color = 'blue';
    container.appendChild(newInput);
    const lastLabel = document.createElement('label');
    lastLabel.textContent = ']]　';
    lastLabel.style.color = 'red';
    container.appendChild(lastLabel);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '置換';
    container.appendChild(button);
    let countLabel = document.createElement('label');
    container.appendChild(countLabel);
    //　Enterキーでも実行
    oldInput.addEventListener('keydown', function (event) {
         // Ctrlキーが押されている場合は動作しない
        if ((event.keyCode === 13 || event.keyCode === 108) && !event.ctrlKey ) {
            event.preventDefault();
            button.click();
        }
    });
    newInput.addEventListener('keydown', function (event) {
         // Ctrlキーが押されている場合は動作しない
        if ((event.keyCode === 13 || event.keyCode === 108) && !event.ctrlKey ) {
            event.preventDefault();
            button.click();
        }
    });
    //　ボタンがクリックされたときの処理
    button.addEventListener('click', function (event) {
        event.preventDefault();
        //　置換前の文字列を正規表現で設定
        oldText = '\\[\\[' + oldInput.value.replace(/([()])/g, '\\$1') + '\\]\\]';
        //　置換後の文字列を設定
        newText = '[[' + newInput.value + ']]';
        //　置換前後の文字列をローカルストレージに保存
        localStorage.setItem('oldText', oldInput.value);
        localStorage.setItem('newText', newInput.value);
        //　置換される文字列の数を取得
        let text = textarea.value;
        let count = (text.match(new RegExp(oldText, 'g')) || []).length;
        //　文字列を置換
        text = text.replace(new RegExp(oldText, 'g'), newText);
        textarea.value = text;
        //　置換された数を表示
        countLabel.textContent = ('　置換された箇所: ' + count);
    });
    //　テキストエリアを取得
    const textarea = document.getElementById('content');
    //　コンテナをテキストエリアの前に挿入
    textarea.parentNode.insertBefore(container, textarea);
    //  入力欄にフォーカス
    oldInput.focus();
    // Ctrl+Enterで保存ボタンを押す
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.keyCode === 13 || event.keyCode === 108) {
            event.preventDefault();
            document.getElementsByClassName('save-btn')[0].click();
        }
    });
})();