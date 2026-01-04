// ==UserScript==
// @name         レーベル編集ページツール
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  レーベル編集ページでワンタッチペースト、行追加機能、ダブルブラケット付加
// @author       vrav
// @license      public domain
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=*
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=394028
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=756401
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=756418
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704513
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704160
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704450
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757568
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757569
// @exclude      https://seesaawiki.jp/w/sougouwiki/e/edit?id=757570
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/500368/%E3%83%AC%E3%83%BC%E3%83%99%E3%83%AB%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500368/%E3%83%AC%E3%83%BC%E3%83%99%E3%83%AB%E7%B7%A8%E9%9B%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　　 　　　<<　はじめに　>>
//  ブラウザの設定でseesaawiki.jpのクリップボードの設定を「許可する」にして下さい。
//  (編集画面でChromeのアドレスバーの鍵マークをクリックして設定)
//  ※念のため、パスワードなど個人情報はクリップボードに取得しないで下さい。
//  当wikiのルール欄を非表示にしますのでルール内容を理解していない方はスクリプト有効化前に
//  ルールをよく読んでください。
//
//　　　　　　　　　　　　　　　<<　ワンタッチでペースト機能　>>
//  編集画面を開くとクリップボードに既定のデータがある場合は編集エリアの上に内容が表示されます。
//  通常の貼り付け操作以外にペースト内容の表示欄をクリック、もしくは単にEnterキー、
//  を押すだけでも貼り付けることができます。
//  (誤発動防止のため編集エリアにカーソルがある状態ではEnterキーでのペーストは発動しません)
//  　　　　　　　　　　　　　　　　　 　　<　注意　>
//  ヘッダー行は解析対象外です。ペースト位置がヘッダー行の直前行、直後行の場合は最適な位置に
//  ペースト出来ない場合があるので手動で調整して下さい。
//  (ペーストした直後はペーストデータが選択中なので、そのままDeleteキーかCtrl+Xで削除出来ます)
//  日付順のページでは適切な位置にペースト出来ないので、スクリプト最下部の「日付順ページ一覧」
//  にページ名のワードを登録すると常に最新欄にペーストされるようになります。
//  処理的にはテキストエリアを行に分けて解析してから最適な番号を見つけて貼り付けるので
//  行数の多いページでは、ある程度のCPUを使用します。
//
//  　　　　　　　　　　　　　 　　　　 <<　行追加機能　>>
//　レーベルページのテーブル行の編集画面を開き、テキストエリアをShift+右クリックすると
//　メッセージボックスが表示され数値を入れるとその数値だけ行を追加します。
//　必ず最後のテーブル行の編集をクリックして編集画面を開いて下さい。
//  メインの編集画面では動作しません。
//  DMMとMGSの形式のみ対応します。
//  　　　　　　　　　　　　　　　　　　　　<　注意　>
//　稀なケースとして商品URLの品番号の手前にも数値が存在し、その数値が品番号の値と同一の場合は
//  正確な行を追加できません。
//  (例)　|[[AOZ-308Z>https://www.dmm.co.jp/mono/dvd/-/detail/=/cid=h_308aoz308z/]]
//                ↑                                                   ↑    ↑
//
//  　　　　　　　　　 　　　 <<　出演者欄にダブルブラケット付加　>>
//　テキストエリア以外の何もない箇所をAlt+右クリックすると出演者欄で女優名がダブルブラケットに囲まれていない場合
//　ダブルブラケットを付加します。入力ミスで ] や [[[ などブラケットが少ない、または多い場合も正しく
//  2つに修正します。
//  　　　　　　　　　　　　　　　　　　　　<　注意　>
//  4列目をターゲットとしています。4列目が女優名ではないページでは使用しないでください。
//  名・姓で表記されている外国人女優は、区切りの・との区別が困難なのでスクリプト下部に一部の女優を個別登録
//  して対応していますが、これ以外の外国人女優は名と姓が分かれてしまうので外国人女優が含まれるページを編集
//  する際は十分注意して下さい。
//
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function() {
    'use strict';

    //////////////////////////////////////////////　　初期動作　　//////////////////////////////////////////////////

    const textArea = document.getElementById("content");
    const lines = textArea.value.split('\n');
    let h2Text;
    let open = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[+]')) {
            open++;
        } else if (lines[i] === '[END]') {
            open--;
        }
        if (open < 0) {
            alert('折り畳みが不正です。\n[+] を [END] で閉じていません。');
            break;
        }
    }
    if (open > 0) {
        alert('折り畳みが不正です。\n[+] を [END] で閉じていません。');
    }


    //////////////////////////////////////////////　　行追加・ダブルブラケット付加　　//////////////////////////////////////////////////

    let resultText;
    let removedCharacters;
    let numberX;
    let exceeds;
    let numberXLength;

    // テキストエリア以外の箇所を右クリックで実行
    document.body.addEventListener('contextmenu', event => {
        // イベント発生源がテキストエリアかどうかを確認
        if (event.target === textArea) {
            event.preventDefault();

            // 入力欄のテキストを取得
            const textAreaD = document.getElementById("content");
            let linesD = textAreaD.value.split('\n');

            // Shift+右クリックで行の追加
            if (event.shiftKey && !event.altKey && !event.ctrlKey) {
                // テーブル行のみで動作
                if (lines.length > 1) {
                    alert("テキストが2行以上です。\n行の追加はテーブル1行ずつの編集から行って下さい。");
                    return;
                }
                // 行最初の>の前が数値以外の文字列である場合はその文字列を一旦削除
                const firstLine = textArea.value.split("\n")[0];
                const regex = /(?<=\d)[A-Za-z](?=>)/g;
                if (regex.test(firstLine)) {
                    removedCharacters = [];
                    resultText = firstLine.replace(regex, (match) => {
                        removedCharacters.push(match);
                        return "";
                    });
                } else {
                    // >の前が数値の場合
                    resultText = textArea.value;
                }

                // 行の追加の準備
                const linesT = resultText.split("\n");
                let hasValidLine = false;
                for (let h = 0; h < linesT.length; h++) {
                    if (linesT[h].trim().startsWith("|[[")) {
                        hasValidLine = true;
                        break;
                    }
                }

                // 女優ページは不可
                if (!hasValidLine) {
                    console.log("|[[ で始まる行が存在しません。\nレーベル編集ページ_ADDは無効です");
                    return;
                }

                // ポップアップを表示
                let numLines = prompt("何行作成しますか？");
                // 指定の数値で行を作成し値を加算
                if (numLines !== null) {
                    numLines = parseInt(numLines);
                    // 入力が数値であり、199以下であるか確認
                    if (!isNaN(numLines)) {
                        // 入力値上限を199に設定
                        numLines = Math.min(numLines, 199);
                        let input = resultText;
                        let output = "";
                        for (let i = 1; i <= numLines; i++) {
                            let line = copyFormat(input, i);
                            // 最初に文字列を削除している場合は元に戻す
                            if (removedCharacters !== undefined) {
                                line = line.replace(/>/, removedCharacters.join("") + ">");
                            }
                            output += line + "\n";
                        }
                        textArea.value += "\n" + output.slice(0, -1);
                    } else {
                        // 数値以外を入力
                        alert("数値を入力してください。");
                    }
                }

            // Alt+右クリックでダブルブラケット付加
            } else if (event.altKey && !event.shiftKey && !event.ctrlKey) {
                // テーブル行のみで動作
                if (lines.length > 1) {
                    alert("テキストが2行以上です。\nダブルブラケット付加はテーブル1行ずつの編集から行って下さい。");
                    return;
                }
                // resultTextを更新
                resultText = textArea.value;
                linesD = resultText.split('\n');
                // 4列目のデータにのみダブルブラケットを適用
                let updatedLines = linesD.map(line => {
                    if (line.startsWith('|')) {
                        let parts = line.split('|');
                        // ダブルブラケット付加
                        let updatedText = parts[4].replace(/:(?!\/\/)/g, '：'); // 半角:に//が続かない場合→全角：
                        updatedText = updatedText.replace(/・/g, ']]・[[').replace(/／/g, ']]／[[').replace(/\(/g, ']](').replace(/~~/g, ']]~~').replace(/：/g, '：[');
                        updatedText = updatedText.replace(/\[(?!\[)/g, '[[').replace(/\](?!\])/g, ']]');
                        // イコールが存在する場合は最後の]]を付加しない
                        if (parts[4].includes('＝') || parts[4].includes('=')) {
                            updatedText = '[[' + updatedText;
                        } else {
                            updatedText = '[[' + updatedText + ']]';
                        }
                        updatedText = updatedText.replace(/\[{3,}/g, '[[').replace(/\]{3,}/g, ']]');// ブラケットが多い場合2つに修正
                        updatedText = updatedText.replace(/\)\]\]/g, ')').replace(/\(\]\]/g, '(');//　([[、)]]→]]削除
                        updatedText = updatedText.replace(/\[\[\]\]\(/g, '(');//　[[]](→／(
                        updatedText = updatedText.replace(/(演順|画順|紙順|ら順)\]\]/g, '$1');//　順]]→順
                        updatedText = updatedText.replace(/(\d+)(名|人目)\]\]/g, '$1$2'); //　'数字'名]]、'数字'人目]]→]]削除
                        updatedText = updatedText.replace(/(／|・)\[\[(\d+)/g, '$1$2');// ／[['数字'→／'数字' または ・[['数字'→・'数字'
                        updatedText = updatedText.replace(/(\d+)\]\](／|・)/g, '$1$2');// '数字]]／'→'数字／' または '数字]]・'→'数字・'
                        updatedText = updatedText.replace(/\(([^)]*)\[\[([^)]*)\]\]([^)]*)\)/g, '($1$2$3)');
                        updatedText = updatedText.replace(/\(([^)]*)\]\]([^)]*)\[\[([^)]*)\)/g, '($1$2$3)');
                        parts[4] = updatedText;
                        return parts.join('|');
                    } else {
                        return line;
                    }
                });
                // 最終校正ブロック（カッコ、注釈、太字などに対応）
                const updatedLinesN = updatedLines.map(line => {
                    if (line.startsWith('|') && !line.startsWith('|~NO|') && !(/^\|~\d+/.test(line)) && !line.startsWith('|}')) {
                        line = line.replace(/(ほか|名|順|人目|有り)\]\]\|/g, '$1|');
                        line = line.replace(/\[\[----\]\]\|/g, '----|');
                        line = line.replace(/\|\[\[計(\d+)/g, '|計$1');　　　 　　　　//　|計'数字'→|計'数字'
                        line = line.replace(/\|\[\[((?:(?!\]\]).)+)：/g, '|$1：');　　//　|[[文字列：→|文字列：
                        // 太字用
                        const regex = /''(?=[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z])/g;
                        line = line.replace(regex, "''[[");
                        line = line.replace(/\'\'\]\]/g, '\'\'');
                        line = line.replace(/\[\[\'\'/g, '\'\'');
                        line = line.replace(/\'\'\[\[太字\'\'\[\[/g, '\'\'\太字\'\'');
                        // 修正する文字列一覧に従って変換
                        for (let key in keyT) {
                            if (line.includes(key)) {
                                line = line.replace(key, keyT[key]);
                            }
                        }
                    }
                    return line;
                });
                // テキストエリアに反映
                textAreaD.value = updatedLinesN.join('\n');
                // 個別テーブル編集ページの動作
            } else {
                // 日付データの前まで
                let dateLine = linesD.filter(line => /\d{4}-\d{2}-\d{2}/.test(line));
                let extractedTexts = dateLine.map(line => {
                    const parts = line.split('|');
                    const dateIndex = parts.findIndex(part => /\d{4}-\d{2}-\d{2}/.test(part));
                    return parts[dateIndex - 1];
                });
                let newTexts = extractedTexts.map(text => {
                    //イコールが存在する場合は最後の]]を付加しない
                    if (text.includes('＝') || text.includes('=')) {
                        text = '[[' + text;
                    } else {
                        text = '[[' + text + ']]';
                    }
                    text = text.replace(/（/g, '(').replace(/）/g, ')');
                    text = text.replace(/:(?!\/\/)/g, '：'); 　　　　　　　　　　　　　　　 // 半角:に//が続かない場合→全角：
                    text = text.replace(/・/g, ']]・[[').replace(/／/g, ']]／[[').replace(/\(/g, ']](').replace(/~~/g, ']]~~').replace(/：/g, '：[[');
                    text = text.replace(/\[(?!\[)/g, '[[').replace(/\](?!\])/g, ']]');
                    text = text.replace(/\[{3,}/g, '[[').replace(/\]{3,}/g, ']]');// ブラケットが多い場合2つに修正
                    text = text.replace(/\)\]\]/g, ')').replace(/\(\]\]/g, '(');//　([[、)]]→]]削除
                    text = text.replace(/\[\[\]\]\(/g, '(');//　[[]](→／(
                    text = text.replace(/(演順|画順|紙順|ら順)\]\]/g, '$1');//　順]]→順
                    text = text.replace(/(\d+)(名|人目)\]\]/g, '$1$2');//　'数字'名]]、'数字'人目]]→]]削除
                    text = text.replace(/(／|・)\[\[(\d+)/g, '$1$2');// ／[['数字'→／'数字' または ・[['数字'→・'数字'
                    text = text.replace(/(\d+)\]\](／|・)/g, '$1$2');// '数字]]／'→'数字／' または '数字]]・'→'数字・'
                    text = text.replace(/\(([^)]*)\[\[([^)]*)\]\]([^)]*)\)/g, '($1$2$3)');
                    text = text.replace(/\(([^)]*)\]\]([^)]*)\[\[([^)]*)\)/g, '($1$2$3)');
                    return text;
                });
                let newLines = linesD.map(line => {
                    if (/\d{4}-\d{2}-\d{2}/.test(line)) {
                        const parts = line.split('|');
                        const dateIndex = parts.findIndex(part => /\d{4}-\d{2}-\d{2}/.test(part));
                        parts[dateIndex - 1] = newTexts.shift();
                        return parts.join('|');
                    } else {
                        return line;
                    }
                });
                const newDateLine = newLines.map(line => {
                    line = line.replace(/\[{3,}/g, '[[').replace(/\]{3,}/g, ']]');
                    line = line.replace(/(ほか|名|順|人目|有り)\]\]\|/g, '$1|');
                    line = line.replace(/\[\[----\]\]\|/g, '----|');
                    line = line.replace(/\|\[\[計(\d+)/g, '|計$1');//　|計'数字'→|計'数字'
                    line = line.replace(/\|\[\[((?:(?!\]\]).)+)：/g, '|$1：');//　|[[文字列：→|文字列：
                    // 太字用
                    const regex = /''(?=[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFa-zA-Z])/g;
                    line = line.replace(regex, "''[[");
                    line = line.replace(/\'\'\]\]/g, '\'\'');
                    line = line.replace(/\[\[\'\'/g, '\'\'');
                    line = line.replace(/\'\'\[\[太字\'\'\[\[/g, '\'\'\太字\'\'');
                    // 修正する文字列一覧に従って変換
                    for (let key in keyT) {
                        if (line.includes(key)) {
                            line = line.replace(key, keyT[key]);
                        }
                    }
                    return line;
                });
                textAreaD.value = newDateLine.join('\n');
            }
        }
    });

    // match, offset, string, increment を引数として受け取るコード
    function replaceNumber(match, offset, string, increment) {
        // matchを整数に変換
        let num = parseInt(match);
        // numberXが未定義で、exceedsがfalseで、matchの直後に>がある場合
        if (numberX === undefined && !exceeds && string.indexOf(">") === offset + match.length) {
            numberX = num;
            numberXLength = match.length;
            // numにincrementを加算して、matchの長さに合わせて0を埋める
            return (num + increment).toString().padStart(match.length, '0');
            // numがnumberXと等しく、matchの長さがnumberXLength以上の場合
        } else if (num === numberX && match.length >= numberXLength) {
            // numにincrementを加算して、matchの長さに合わせて0埋める
            return (num + increment).toString().padStart(match.length, '0');
        } else {
            return match;
        }
    }

    // 入力文字列と増分値を引数として受け取るコード
    function copyFormat(input, increment) {
        let output = "";
        // 入力文字列を "|" で分割
        let cells = input.split("|");
        exceeds = false;
        // 各セルを処理
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            // セルが日付形式の場合
            if (cell.match(/^\d{4}-\d{2}-\d{2}$/)) {
                output += cell.substring(0, 4) + "--|";
                // セルが://を含まない場合
            } else if (!cell.includes("://")) {
                // 且つ[[]]で囲まれている場合
                if (cell.startsWith('[[') && cell.endsWith(']]')) {
                    output += "[[]]|";
                    // [[]]で囲まれていない場合
                } else if (!cell.includes("://")) {
                    output += "|";
                }
                // セルが数字を含む場合
            } else if (cell.match(/\d+/)) {
                // 数字をreplaceNumber関数で置き換えて出力文字列に追加
                output += cell.replace(/\d+/g, function(match, offset, string) {
                    return replaceNumber(match, offset, string, increment);
                }) + "|";
                // セルが ">" を含む場合
            } else if (cell.includes(">")) {
                // exceeds変数をtrueに設定し、セル全体を出力文字列に追加
                exceeds = true;
                output += cell + "|";
            } else {
                // それ以外の場合セル全体を出力文字列に追加
                output += cell + "|";
            }
        }
        // 出力文字列の末尾の "|" を削除
        return output.slice(0, -1);
    }

    //////////////////////////////////////////////　　ペースト機能　　//////////////////////////////////////////////////

    // テキストエリアの書式をチェック
    if ((textArea.value.includes('|~NO|')) || (textArea.value.split('\n').length === 1 && textArea.value.startsWith('|[[') && textArea.value.endsWith('|'))) {
        const h2Elements = document.getElementsByTagName("h2");
        for (let i = 0; i < h2Elements.length; i++) {
            const aElement = h2Elements[i].getElementsByTagName("a")[0];
            h2Text = aElement.textContent;
        }
        // テキストエリアを広げる（フルHDに最適化しているので各自の環境に合わせて style.height を調整して下さい）
        const maincontainer = document.getElementById("content");
        maincontainer.style.height = "460px";
        // 上部の要素を削除
        const login = document.querySelector('#page-header-inner');
        login.parentNode.removeChild(login);
        const description = document.querySelector('#wiki-description');
        description.parentNode.removeChild(description);
        const header = document.querySelector('#wiki-header');
        header.parentNode.removeChild(header);
        const ruleArea = document.querySelector('#rule-area');
        const message = document.createElement('div');
        message.textContent = '＜　Enterキーで貼り付け　＞';
        // ペースト実行フラグ
        let pasted = false;
        // 通常のペースト動作
        textArea.addEventListener('paste', function(event) {
            message.textContent = '＜　データを手動で貼り付けました　＞';
            pasted = true;
        });
        // クリップボードのデータを追加するコード
        function keydownListener(event) {
            // textAreaにカーソルがある場合は処理を中断
            if (event.target === textArea) {
                return;
            }
            // Enter、クリップボード内容欄クリックで発動（ペーストフラグがTrueの場合は発動しない）
            if ((event.keyCode === 13 || event.keyCode === 108 || event.target === ruleArea) && !pasted) {
                event.preventDefault();
                navigator.clipboard.readText().then(function(clipboardText) {
                    if (!clipboardText.startsWith("|[[")) {
                        alert('クリップボードの内容が指定の書式ではありません');
                        return;
                    }
                    // クリップボードの文字列を抽出
                    let clipboardLines = clipboardText.split('\n');
                    for (let i = 0; i < clipboardLines.length; i++) {
                        let index = clipboardLines[i].indexOf('>');
                        if (index !== -1) {
                            clipboardLines[i] = clipboardLines[i].substring(0, index);
                        }
                    }
                    let currentText = textArea.value;
                    // クリップボードのテキストから "-" までの文字列を抽出
                    const startIndex = clipboardText.indexOf("-");
                    const extractedText = clipboardText.substring(0, startIndex) + "-";
                    // 抽出した文字列が currentText にない場合は、処理を終了
                    if (currentText.indexOf(extractedText) === -1) {
                        alert('クリップボードの内容とページの内容が合っていません');
                        return;
                    }
                    // テキストエリアの内容と比較
                    let newText = currentText.split('\n');
                    for (let i = 0; i < newText.length; i++) {
                        for (let j = 0; j < clipboardLines.length; j++) {
                            if (newText[i].startsWith(clipboardLines[j])) {
                                if (clipboardText.length > newText[i].length) {
                                    newText[i] = clipboardText;
                                    pasted = true;
                                } else {
                                    alert('データが同じであるか\nクリップボードの文字数の方が少ないため上書きできません');
                                    return;
                                }
                                break;
                            }
                        }
                    }
                    // 抽出した文字列がnewTextに含まれているすべての行の>までを解析しvaluesとする
                    let values = [];
                    for (let i = 0; i < newText.length; i++) {
                        if (newText[i].startsWith(extractedText)) {
                            let index = newText[i].indexOf(">");
                            if (index !== -1) {
                                let value = newText[i].substring(0, index);
                                values.push({index: i, value: value});
                            }
                        }
                    }
                    // 日付順のページ
                    if (noSort.some(text => h2Text.includes(text))) {
                        newText.splice(values[values.length - 1].index + 1, 0, clipboardText);
                        pasted = true;
                    } else if (!pasted) {
                        // 値をソート順に並べ替え
                        values.sort(function(a, b) {
                            return a.value.localeCompare(b.value);
                        });
                        // 適切な位置にペースト
                        for (let i = 0; i < values.length; i++) {
                            if (clipboardText.localeCompare(values[i].value) < 0) {
                                newText.splice(values[i].index, 0, clipboardText);
                                pasted = true;
                                break;
                            }
                        }
                    }
                    if (!pasted && values.length > 0) {
                        newText.splice(values[values.length - 1].index + 1, 0, clipboardText);
                        pasted = true;
                    }
                    // ペースト実行
                    textArea.value = newText.join('\n');
                    message.textContent = '＜　データを貼り付けました　＞';
                    // 追加した場所へ移動
                    const textAreaJ = document.querySelector('#content')
                    let modifiedText = clipboardText;
                    modifiedText = modifiedText.replace(/\r\n/g, '\n');
                    const indexJ = textAreaJ.value.indexOf(modifiedText);
                    if (indexJ !== -1) {
                        textAreaJ.selectionEnd = indexJ + modifiedText.length;
                        textAreaJ.focus();
                        textAreaJ.selectionStart = indexJ;
                        textAreaJ.selectionEnd = indexJ + modifiedText.length;
                    }
                    // 完了のポップアップ
                    const popup = document.createElement("div");
                    popup.style.position = "fixed";
                    popup.style.top = "40%";
                    popup.style.left = "50%";
                    popup.style.transform = "translate(-50%, -50%)";
                    popup.style.border = "none";
                    popup.style.padding = "20px";
                    popup.style.backgroundColor = "#fff";
                    popup.style.fontSize = "24px";
                    popup.style.zIndex = 9999;
                    popup.innerHTML = "ADD";
                    document.body.appendChild(popup);
                    setTimeout(function() {
                        document.body.removeChild(popup);
                    }, 1200);
                });
            }
        }
        // フォーカスもしくはリロードで実行
        function onFocusOrLoad() {
            // メッセージの追加
            const ruleArea = document.querySelector('#rule-area');
            message.style.textAlign = 'center';
            message.style.fontWeight = "bold";
            const insertAfterElement = ruleArea.nextSibling;
            insertAfterElement.parentNode.insertBefore(message, insertAfterElement.nextSibling);
            // クリップボードのデータを表示
            navigator.clipboard.readText().then(function(clipboardText) {
                let clipboardLines = clipboardText.split('\n');
                if (clipboardText.startsWith("|[[")) {
                    // シリーズ一覧> が含まれている場合
                    if (clipboardText.includes('シリーズ一覧>')) {
                        // シリーズ一覧> 以降の文字列に h2Text と同一のテキストが存在する場合
                        let seriesListText = clipboardText.split('シリーズ一覧>')[1];
                        // 最後の空白スペース以降を除外して比較
                        seriesListText = seriesListText.substring(0, seriesListText.lastIndexOf(' '));
                        let compareH2Text = h2Text.substring(0, h2Text.lastIndexOf(' '));
                        // 最後が数字の場合は数字部分を除外して比較
                        if (/\d$/.test(seriesListText)) {
                            seriesListText = seriesListText.replace(/\d+$/, '');
                        }
                        if (/\d$/.test(compareH2Text)) {
                            compareH2Text = compareH2Text.replace(/\d+$/, '');
                        }
                        if (seriesListText.includes(compareH2Text)) {
                            // シリーズ一覧> から直後の ]] までの文字列を削除
                            clipboardText = clipboardText.replace(/\[\[シリーズ一覧>[^\]]*\]\]/, '');
                        }
                    }
                    // 手動ペーストのためにクリップボードを更新
                    GM_setClipboard(clipboardText);
                    // ルールエリア書き換え
                    ruleArea.innerHTML = clipboardText.replace(/\n/g, '<br>');
                    ruleArea.style.textAlign = 'left';
                } else {
                    ruleArea.textContent = 'クリップボードの内容が指定の書式ではありません';
                    ruleArea.style.textAlign = 'center';
                    message.textContent = '＜　貼り付け不可　＞';
                    // イベントリスナーを削除
                    document.removeEventListener('keydown', keydownListener);
                    window.removeEventListener('focus', onFocusOrLoad);
                }
            });
        }
        window.addEventListener('focus', onFocusOrLoad);
        window.addEventListener('load', onFocusOrLoad);
        document.addEventListener('keydown', keydownListener);
        ruleArea.addEventListener('click', keydownListener);
    } else {
        console.log("|[[ で始まる行が存在しません。\nレーベル編集ページ_ADDは無効です");
        return;
    }

    // ダブルブラケット付加後に修正する文字列一覧
    const keyT = {
        "]](2000)": "(2000)]]",
        "]](2001)": "(2001)]]",
        "]](2002)": "(2002)]]",
        "]](2003)": "(2003)]]",
        "]](2004)": "(2004)]]",
        "]](2005)": "(2005)]]",
        "]](2006)": "(2006)]]",
        "]](2007)": "(2007)]]",
        "]](2008)": "(2008)]]",
        "]](2009)": "(2009)]]",
        "]](2010)": "(2010)]]",
        "]](2011)": "(2011)]]",
        "]](2012)": "(2012)]]",
        "]](2013)": "(2013)]]",
        "]](2014)": "(2014)]]",
        "]](2015)": "(2015)]]",
        "]](2016)": "(2016)]]",
        "]](2017)": "(2017)]]",
        "]](2018)": "(2018)]]",
        "]](2019)": "(2019)]]",
        "]](2020)": "(2020)]]",
        "]](2021)": "(2021)]]",
        "]](2022)": "(2022)]]",
        "]](2023)": "(2023)]]",
        "]](2024)": "(2024)]]",
        "]](2025)": "(2025)]]",
        "]](BoinBB)": "(BoinBB)]]",
        "]](GAS)": "(GAS)]]",
        "]](G-AREA)": "(G-AREA)]]",
        "]](kawaii*)": "(kawaii*)]]",
        "]](KUKI)": "(KUKI)]]",
        "]](Himemix)": "(Himemix)]]",
        "]](KAYA)": "(KAYA)]]",
        "]](MAX-A)": "(MAX-A)]]",
        "]](REC)": "(REC)]]",
        "]](S-Cute)": "(S-Cute)]]",
        "]](V&R)": "(V&R)]]",
        "]](アスリート)": "(アスリート)]]",
        "]](アロマ企画)": "(アロマ企画)]]",
        "]](宇宙少女)": "(宇宙少女)]]",
        "]](奥山真弓)": "(奥山真弓)]]",
        "]](仮)": "(仮)]]",
        "]](カリビアンコム)": "(カリビアンコム)]]",
        "]](ギャルナン)": "(ギャルナン)]]",
        "]](クリスタル)": "(クリスタル)]]",
        "]](小悪魔age嬢)": "(小悪魔age嬢)]]",
        "]](コスかの)": "(コスかの)]]",
        "]](熟女)": "(熟女)]]",
        "]](処女喪失)": "(処女喪失)]]",
        "]](素人生ドル)": "(素人生ドル)]]",
        "]](チーム川崎)": "(チーム川崎)]]",
        "]](人間考察)": "(人間考察)]]",
        "]](配信系)": "(配信系)]]",
        "]](隼)": "(隼)]]",
        "]](春菜まみ)": "(春菜まみ)]]",
        "]](人妻)": "(人妻)]]",
        "]](舞ワイフ)": "(舞ワイフ)]]",
        "]](無垢)": "(無垢)]]",
        // 外国人女優
        "[[アメリア]]・[[イヤハート]]": "[[アメリア・イヤハート]]",
        "[[アリス]]・[[エルナンデス]]": "[[アリス・エルナンデス]]",
        "[[アリス]]・[[クリスティーン]]・[[岡村]]": "[[アリス・クリスティーン・岡村]]",
        "[[アリョーナ]]・[[ツリシチェワ]]": "[[アリョーナ・ツリシチェワ]]",
        "[[ウー]]・[[ウォンリン]]": "[[ウー・ウォンリン]]",
        "[[エヴァ]]・[[クリステル]]": "[[エヴァ・クリステル]]",
        "[[エマ]]・[[ローレンス]]": "[[エマ・ローレンス]]",
        "[[キアラ]]・[[沙耶香]]・[[キンスキー]]": "[[キアラ・沙耶香・キンスキー]]",
        "[[ココ]]・[[サンチェス]]": "[[ココ・サンチェス]]",
        "[[サントス]]・[[A]]・[[ビアーナ]]": "[[サントス・A・ビアーナ]]",
        "[[シゲモリ]]・[[アヤ]]": "[[シゲモリ・アヤ]]",
        "[[ジャジー]]・[[ジャミソン]]": "[[ジャジー・ジャミソン]]",
        "[[ジューン]]・[[ラブジョイ]]": "[[ジューン・ラブジョイ]]",
        "[[ツァン]]・[[リー]]": "[[ツァン・リー]]",
        "[[ティファニー]]・[[ひばり]]・[[フォックス]]": "[[ティファニー・ひばり・フォックス]]",
        "[[ベティ]]・[[リン]]": "[[ベティ・リン]]",
        "[[マリア]]・[[エリヨリ]]": "[[マリア・エリヨリ]]",
        "[[マリア]]・[[螢子]]・[[エマニエル]]": "[[マリア・螢子・エマニエル]]",
        "[[ミア]]・[[楓]]・[[キャメロン]]": "[[ミア・楓・キャメロン]]",
        "[[ミランダ]]・[[みゆ]]": "[[ミランダ・みゆ]]",
        "[[メロディー]]・[[雛]]・[[マークス]]": "[[メロディー・雛・マークス]]",
        "[[メロディー]]・[[マークス]]": "[[メロディー・マークス]]",
        "[[ラン]]・[[レイ]]": "[[ラン・レイ]]",
        "[[リナ]]・[[ディソン]]": "[[リナ・ディソン]]",
        "[[リリー]]・[[ハート]]": "[[リリー・ハート]]",
        "[[ルロア]]・[[クララ]]": "[[ルロア・クララ]]",
    };
    // 日付順ページ一覧  (部分一致)
    const noSort = [
        "体験撮影",
        "初AV撮影",
        "百戦錬磨",
        "マジ軟派",
        "ラグジュTV",
    ];
})();