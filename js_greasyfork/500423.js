// ==UserScript==
// @name         女優ページ編集ツール
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  女優ページにクリップボードのデータをペースト・右クリックでソート
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
// @downloadURL https://update.greasyfork.org/scripts/500423/%E5%A5%B3%E5%84%AA%E3%83%9A%E3%83%BC%E3%82%B8%E7%B7%A8%E9%9B%86%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500423/%E5%A5%B3%E5%84%AA%E3%83%9A%E3%83%BC%E3%82%B8%E7%B7%A8%E9%9B%86%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　　　　 <<　はじめに　>>
//  ブラウザの設定でseesaawiki.jpのクリップボードの設定を「許可する」にして下さい。
//  (編集画面でChromeのアドレスバーの鍵マークをクリックして設定)
//  ※念のため、パスワードなど個人情報はクリップボードに取得しないで下さい。
//  当wikiのルール欄を非表示にしますのでルール内容を理解していない方はスクリプト有効化前に
//  ルールをよく読んでください。
//  　　　　　　　　　　　　　　　　　<<　使い方　>>
//  編集画面を開くとクリップボードに既定のデータがある場合は編集エリアの上に内容が表示されます。
//  通常の貼り付け操作以外にペースト内容の表示欄をクリック、もしくは単にEnterキーを
//  押すだけでも貼り付けることができます。
//  (誤発動防止のため編集エリアにカーソルがある状態ではEnterキーでのペーストは発動しません)
//　クリップボード内容表示欄を右クリックすると品番がない項目に品番を自動付加した後に
//  日付順でソート、同日付の場合はさらに品番順にソートされます。
//
//　DVD作品を貼り付ける場合は、メインの鉛筆ボタンor大見出しの鉛筆ボタンをクリック、
//　それ以外は該当の中見出し鉛筆ボタンをクリックして編集画面を開いて下さい。
//　（クリップボードのデータがイメージかVRか配信作品かを判別する機能はありません）
//　メイン編集ボタンから実行の場合は、----以降はそのまま保持する仕様です。
//  日付と品番が有る場合に限り、重複チェックを行い既存データの更新に対応します。
//  品番自動付加については、DMMとMGSに対応しています。
//  (VR総研9課など正しく付加できない品番があります)
//
//                                      <注意>
//  同日付の場合はさらに品番順にソートされます。
//  ペーストするデータ以外にも既存のデータが更新される可能性があるので「差分チェック」スクリプト↓
//  https://greasyfork.org/ja/scripts/500151-%E5%B7%AE%E5%88%86%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF
//  で更新データを確認して下さい。
//  テキストエリアを行ごと、1作品ごと、日付、品番、のように細かくデータチェックするので
//  データ量の多いページは、ある程度のCPUを使用します。
//
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function() {
    'use strict';
    // テキストエリア取得
    const textArea = document.getElementById("content");
    const textAreaX = document.querySelector('#content').value //最終比較用
    const lines = textArea.value.split('\n');
    let open = 0;
    let currentSection = [];
    let sections = [];
    let firstLength = 0;
    let beforeLength = 0;
    let afterLength = 0;
    // テキストエリアを取得
    let content = document.querySelector('#content').value;
    // タイトル、ソートエリアを取得
    let titleAndContent = content.split(/\n----/)[0];
    let titleMatch = titleAndContent.match(/(.*?)(\/\/\d{4}\.\d{2}\.\d{2}.*)/s);
    let title = titleMatch ? titleMatch[1].trim() : titleAndContent;
    // ソートするエリアを設定し2行以上の空白行は1行に縮める
    let dateArea = titleMatch ? titleMatch[2].trim().replace(/\n\s*\n/g, '\n\n') : '';
    // ----以降を取得
    let endArea = content.split('\n').slice(content.split('\n').findIndex(line => line.startsWith('----')) - 1).join('\n');
    // 全角スペースを半角スペースに変換
    let dateAreaN = dateArea.replace(/^(\/\/\d{4}\.\d{2}\.\d{2})　/gm, '$1 ');
    // 日付の後が半角スペースのみの場合はその半角スペースを除去
    dateAreaN = dateAreaN.replace(/\/\/\d{4}\.\d{2}\.\d{2} (?=\n|$)/gm, (match) => match.trimEnd());

    // 日付とそれに続く文字列でソート
    let linesA = dateAreaN.split('\n');
    for (let line of linesA) {
        if (line.match(/^\/\/\d{4}\.\d{2}\.\d{2}/)) {
            if (currentSection.length > 0) {
                sections.push(currentSection.filter(line => line !== '')); // 空白行を削除
            }
            currentSection = [line];
        } else {
            currentSection.push(line);
        }
    }

    if (currentSection.length > 0) {
        sections.push(currentSection.filter(line => line !== '')); // 空白行を削除
        sections.sort((a, b) => {
            let dateMatchA = a[0].match(/^\/\/(\d{4}\.\d{2}\.\d{2})/);
            let dateMatchB = b[0].match(/^\/\/(\d{4}\.\d{2}\.\d{2})/);
            if (!dateMatchA || !dateMatchB) {
                return 0;
            }
            let dateA = dateMatchA[1];
            let dateB = dateMatchB[1];
            let stringMatchA = a[0].match(/^\/\/\d{4}\.\d{2}\.\d{2} (.*)/);
            let stringMatchB = b[0].match(/^\/\/\d{4}\.\d{2}\.\d{2} (.*)/);
            if (!stringMatchA || !stringMatchB) {
                return 0;
            }
            let stringA = stringMatchA[1];
            let stringB = stringMatchB[1];
            if (dateA < dateB) {
                return -1;
            } else if (dateA > dateB) {
                return 1;
            } else {
                if (stringA > stringB) {
                    return -1;
                } else if (stringA < stringB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }
    // ペースト後の項目数を記録
    firstLength = sections.length;


    // 不正なページフォーマットを検索
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[+]')) {
            open++;
        } else if (lines[i] === '[END]') {
            open--;
        }
        if (open < 0) {
            alert('スタイルプロパティが不正です。\n[+] を [END] で閉じていません。');
            break;
        }
    }
    if (open > 0) {
        alert('スタイルプロパティが不正です。\n[+] を [END] で閉じていないか、中見出しを跨いでいます。');
    }
    const initialLength = document.getElementById("content").value.length;
    // テキストエリアの書式をチェック
    if (!/\/\/\d{4}\.\d{2}\.\d{2}/.test(textArea.value)) {
        console.log('テキストエリアが指定の書式ではありません\n女優編集ページ_ADDは無効です');
        return;
    } else {
        // テキストエリアを広げる（フルHDに最適化しているので各自の環境に合わせて style.height を調整して下さい）
        const maincontainer = document.getElementById("content");
        maincontainer.style.height = "440px";
        // 上部の要素を削除
        const login = document.querySelector('#page-header-inner');
        login.parentNode.removeChild(login);
        const description = document.querySelector('#wiki-description');
        description.parentNode.removeChild(description);
        const header = document.querySelector('#wiki-header');
        header.parentNode.removeChild(header);
        const ruleArea = document.querySelector('#rule-area');
        // メッセージの要素を追加
        const message = document.createElement('div');
        message.textContent = '＜　Enterキーで貼り付け　＞';
        // ペースト実行フラグ
        let pasted = false;
        // 通常のペースト動作
        textArea.addEventListener('paste', function(event) {
            message.textContent = '＜　データを手動で貼り付けました　＞';
            pasted = true;
        });

        // Enterキーで貼り付け
        function keydownListener(event) {
            // textAreaにカーソルがある場合は処理を中断
            if (event.target === textArea) {
                return;
            }
            // Enter、クリップボード内容欄クリックで発動（ペーストフラグがTrueの場合は発動しない）
            if ((event.keyCode === 13 || event.keyCode === 108 || event.target === ruleArea) && !pasted) {
                event.preventDefault();
                navigator.clipboard.readText().then(function(clipboardText) {
                    let clipboardLines = clipboardText.split('\n');
                    // 異なる形式のペーストを回避
                    if (clipboardLines.length < 1 || !/^\/\/\d{4}\.\d{2}\.\d{2}/.test(clipboardLines[0])) {
                        console.log('クリップボードの内容が指定の書式ではありません');
                        return;
                    }
                    // ペーストする位置
                    let currentText = textArea.value;
                    let newText = currentText.split('\n');
                    let index = newText.findIndex(function(line) {
                        return line.startsWith('//');
                    });
                    if (index > 0 && newText[index - 1].startsWith('----')) {
                        index--;
                    } else {
                        let index2 = currentText.split('\n').findIndex(line => line.startsWith('//') || line.startsWith('----'));
                        if (index2 === -1) {
                            index2 = currentText.split('\n').length;
                        }
                        index = index2;
                    }
                    // クリップボードの最後が空白行の場合は一旦削除する
                    if (clipboardText.endsWith("\n")) {
                        clipboardText = clipboardText.slice(0, -1);
                    }
                    newText.splice(index, 0, clipboardText);
                    newText.splice(index + 1, 0, "");
                    // 上の行が空白行であれば削除
                    if (index > 0 && newText[index - 1] === "") {
                        newText.splice(index - 1, 1);
                        index--;
                    }
                    // ペースト実行
                    textArea.value = newText.join('\n');
                    message.textContent = '＜　データを追加しました　・　右クリックでソートします　＞';
                    pasted = true;
                });
            }
        };
        // フォーカスもしくはリロードで実行
        function onFocusOrLoad() {
            // メッセージの追加
            const login = document.querySelector('.login');
            const ruleArea = document.querySelector('#rule-area');
            message.style.textAlign = 'center';
            message.style.fontWeight = "bold";
            const insertAfterElement = ruleArea.nextSibling;
            insertAfterElement.parentNode.insertBefore(message, insertAfterElement.nextSibling);
            // クリップボードのデータを表示
            navigator.clipboard.readText().then(function(clipboardText) {
                let clipboardLines = clipboardText.split('\n');
                if (clipboardLines.length > 0 && /^\/\/\d{4}\.\d{2}\.\d{2}/.test(clipboardLines[0])) {
                    ruleArea.innerHTML = clipboardText.replace(/\n/g, '<br>');
                    ruleArea.style.textAlign = 'left';
                } else {
                    ruleArea.textContent = 'クリップボードの内容が指定の書式ではありません';
                    ruleArea.style.textAlign = 'center';
                    message.textContent = '＜　貼り付け不可　＞';
                    // イベントリスナーを削除
                    document.removeEventListener('keydown', keydownListener);
                    window.removeEventListener('focus', onFocusOrLoad);
                    return;
                }
            });
        }

        window.addEventListener('focus', onFocusOrLoad);
        window.addEventListener('load', onFocusOrLoad);
        document.addEventListener('keydown', keydownListener);
        ruleArea.addEventListener('click', keydownListener);
        // カスタムポップアップを作成する関数
        function aPopup(message) {
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '24%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
            popup.style.border = '1px solid #ccc';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            popup.style.zIndex = '1000';
            popup.style.maxWidth = '80%';
            popup.style.maxHeight = '80%';
            popup.style.overflowY = 'auto';
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.fontSize = '20px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => document.body.removeChild(popup);
            const content = document.createElement('pre');
            content.textContent = message;
            content.style.margin = '0';
            content.style.userSelect = 'text';
            content.style.whiteSpace = 'pre-wrap';
            content.style.wordWrap = 'break-word';
            content.style.fontFamily = 'inherit';
            // ESC キーを押すたびに表示・非表示を切り替える
            let isPopupOpen = true;
            document.addEventListener('keyup', event => {
                if (event.key === 'Escape') {
                    if (isPopupOpen) {
                        popup.style.display = 'none';
                    } else {
                        popup.style.display = 'block';
                    }
                    isPopupOpen = !isPopupOpen;
                }
            });
            popup.appendChild(closeButton);
            popup.appendChild(content);
            document.body.appendChild(popup);
        }

        function note(func) {
            if (note.isRunning) return;
            note.isRunning = true;
            setTimeout(() => {
                func();
                note.isRunning = false;
            }, 0);
        }

        // 右クリックでソート
        document.querySelector('#rule-area').addEventListener('contextmenu', event => {
            event.preventDefault();
            navigator.clipboard.readText().then(function(clipboardText) {
                // テキストエリアを取得
                const content = document.querySelector('#content').value;
                // タイトル、ソートエリアを取得
                const titleAndContent = content.split(/\n----/)[0];
                const titleMatch = titleAndContent.match(/(.*?)(\/\/\d{4}\.\d{2}\.\d{2}.*)/s);
                const title = titleMatch ? titleMatch[1].trim() : titleAndContent;
                // ソートするエリアを設定し2行以上の空白行は1行に縮める
                const dateArea = titleMatch ? titleMatch[2].trim().replace(/\n\s*\n/g, '\n\n') : '';
                // 項目が正しい書式でなければポップアップ表示
                const lines = dateArea.split('\n');
                const contentLines = content.split('\n');
                const lineOffset = contentLines.indexOf(lines[0]);
                let modifiedText;

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].match(/^\/\/\d{4}\.\d{2}\.\d{2}/) && i > 0 && lines[i - 1].trim() !== '') {
                        const contentK = document.querySelector('#content');
                        modifiedText = lines[i - 1] + "\n" + lines[i]
                        const indexK = contentK.value.indexOf(modifiedText);
                        if (indexK !== -1) {
                            contentK.selectionStart = indexK;
                            if (!document.activeElement || document.activeElement !== contentK) {
                                contentK.focus();
                            }
                            contentK.selectionStart = indexK;
                            contentK.selectionEnd = indexK + modifiedText.length;
                        }
                        note(() => {
                            aPopup(`//日付行の上が空行ではないのでソートできません\n\n${i + 1 + lineOffset} 行目\n${lines[i - 1]}\n${lines[i]}`);
                        });
                        return;
                    }
                    if (i > 1 && lines[i - 1].trim() === '' && !lines[i - 2].match(/^\/\/\d{4}\.\d{2}\.\d{2}/) && !lines[i - 2].includes('----') && !lines[i].match(/^\/\/\d{4}\.\d{2}\.\d{2}/)) {
                        const contentK = document.querySelector('#content');
                        modifiedText = (lines[i]);
                        const indexK = contentK.value.indexOf(modifiedText);
                        if (indexK !== -1) {
                            contentK.selectionStart = indexK;
                            if (!document.activeElement || document.activeElement !== contentK) {
                                contentK.focus();
                            }
                            contentK.selectionStart = indexK;
                            contentK.selectionEnd = indexK + modifiedText.length;
                        }
                        note(() => {
                            aPopup(`異なる書式で始まっている行があります\n\n${i + 1 + lineOffset} 行目\n${lines[i]} `);
                        });
                        return;
                    }
                }
                if (dateArea.trim().length === 0) {
                    return;
                }
                // ----以降を取得
                const endArea = content.split('\n').slice(content.split('\n').findIndex(line => line.startsWith('----')) - 1).join('\n');
                // ソート準備
                message.textContent = '';
                // 全角スペースを半角スペースに変換
                let dateAreaN = dateArea.replace(/^(\/\/\d{4}\.\d{2}\.\d{2})　/gm, '$1 ');
                // 日付の後が半角スペースのみの場合はその半角スペースを除去
                dateAreaN = dateAreaN.replace(/\/\/\d{4}\.\d{2}\.\d{2} (?=\n|$)/gm, (match) => match.trimEnd());
                // 品番付与のため行に分ける
                let lines3 = dateAreaN.split('\n');
                // 品番を付与しない除外ワード（商品ページアドレスが/で終わっている場合は念のため登録）
                let excludeKeywords = [
                    '.amazon.co.',
                    '.contents.fc2.',
                    '.duga.jp',
                    'G-AREA',
                    '.s-cute.',
                ];
                // //部分を検出
                for (let i = 0; i < lines3.length; i++) {
                    if (lines3[i].startsWith('//') && (!lines3[i + 1] || !lines3[i + 1].startsWith('//'))) {
                        if (lines3[i + 1] && !excludeKeywords.some(keyword => lines3[i + 1].includes(keyword))) {
                            // 英字部分を/]]を元に取得
                            let partMatch = lines3[i + 1].match(/([a-zA-Z]+)[a-zA-Z\d]*\/\]\]/);
                            if (partMatch) {
                                let part = partMatch[1].toUpperCase();
                                // 数字部分を/]]を元に取得
                                let numberMatch = lines3[i + 1].match(/[a-zA-Z]+(\d+)[a-zA-Z\d]*\/\]\]/);
                                if (numberMatch) {
                                    let number = numberMatch[1];
                                    // 例外を設定
                                    if (lines3[i].match(/^\/\/\d{4}\.\d{2}\.\d{2}$/)) {
                                        // 特定の品番を例外処理
                                        if (lines3[i + 1].includes('cid=55')) {
                                            const cidMatch = lines3[i + 1].match(/cid=55(\d+)/);
                                            if (cidMatch) {
                                                let cidNumber = cidMatch[1];
                                                part = cidNumber + part;
                                            }
                                        }
                                        if (lines3[i + 1].includes('d1clymax')) {
                                            const d1clymaxMatch = lines3[i + 1].match(/d1clymax(\d+)/);
                                            if (d1clymaxMatch) {
                                                let numberD = d1clymaxMatch[1];
                                                if (numberD.length === 5) {
                                                    numberD = numberD.slice(-3);
                                                }
                                                part = 'D1CLYMAX-' + numberD;
                                            }
                                            lines3[i] += ' ' + part;
                                        } else if (part === 'R' && number.startsWith('18')) {
                                            lines3[i] += ' ' + part + number.slice(0, 2) + '-' + number.slice(2);
                                        } else if (part === 'T' && number.startsWith('28')) {
                                            lines3[i] += ' ' + part + number.slice(0, 2) + '-' + number.slice(2);
                                        } else if (part === 'AEDVD' && number.length === 4) {
                                            lines3[i] += ' ' + part + '-' + number + 'R';
                                        } else if (part === 'AOZ') {
                                            if (parseInt(number) >= 150) {
                                                lines3[i] += ' ' + part + '-' + number + 'Z';
                                            } else {
                                                lines3[i] += ' ' + part + '-' + number;
                                            }
                                        } else if (part === 'ARM' && number.length === 4) {
                                            lines3[i] += ' ' + part + '-' + number.slice(1);
                                        } else if (part === 'ARMS' && number.length === 4) {
                                            lines3[i] += ' ' + part + '-' + number.slice(-3);
                                        } else if (part === 'DSVR' && number.length >= 5) {
                                            lines3[i] += ' 3' + part + '-' + number.slice(-4);
                                        } else if (part === 'EOSD' && number.length === 3) {
                                            lines3[i] += ' ' + part + '-' + number + 'SR';
                                        } else if (part === 'HHPDR' && number.length >= 3) {
                                            lines3[i] += ' HHP-DR' + number.slice(-3);
                                        } else if (part === 'HINT' && number.length >= 4) {
                                            lines3[i] += ' ' + part + '-' + number.slice(-3);
                                        } else if (part === 'HRDV' && number.length >= 5) {
                                            lines3[i] += ' HRDV-' + number;
                                        } else if (part === 'IBW') {
                                            if (parseInt(number) >= 387) {
                                                lines3[i] += ' ' + part + '-' + number + 'Z';
                                            } else {
                                                lines3[i] += ' ' + part + '-' + number;
                                            }
                                        } else if (part === 'ID' && number.length === 5) {
                                            lines3[i] += ' ' + number.slice(0, 2) + part + '-' + number.slice(2);
                                        } else if (part === 'MMV' && number.length === 2) {
                                            lines3[i] += ' ' + part + '-' + number + 'd';
                                        } else if (part === 'MOBDT' && number.length === 4) {
                                            lines3[i] += ' ' + part + '-' + number.slice(0, 3) + number.slice(4);
                                        } else if (part === 'UD') {
                                            lines3[i] += ' ' + part + '-' + number + 'R';
                                        } else if (part === 'VRKM') {
                                            if (number.length >= 5 && number[0] === '0' && number[1] === '0') {
                                                lines3[i] += ' ' + part + '-' + number.slice(-3);
                                            } else {
                                                lines3[i] += ' ' + part + '-' + number.slice(-4);
                                            }
                                        } else {
                                            // FANZA配信動画、VR動画の5桁を3桁に
                                            if (number.length >= 5 && number.slice(1, 3).split('').every(digit => digit === '0')) {
                                                number = number.slice(3);
                                                if (number.length === 2) {
                                                    number = '0' + number;
                                                }
                                                // 通常の品番
                                            } else if (number.length === 5 && number.startsWith('00')) {
                                                number = number.slice(2);
                                            }
                                            // 品番付加
                                            lines3[i] += ' ' + part + '-' + number;
                                        }
                                        message.textContent = '＜　品番を付加しました　＞';
                                    }
                                }
                            }
                        }
                    }
                    // MGS
                    if (lines3[i].match(/^\/\/\d{4}\.\d{2}\.\d{2}$/)) {
                        if (lines3[i + 1].includes('.mgstage.')) {
                            const lastSlashIndex = lines3[i + 1].lastIndexOf('/');
                            const secondLastSlashIndex = lines3[i + 1].lastIndexOf('/', lastSlashIndex - 1);
                            const textToAdd = lines3[i + 1].slice(secondLastSlashIndex + 1, lastSlashIndex);
                            lines3[i] += ' ' + textToAdd;
                            message.textContent = '＜　品番を付加しました　＞';
                        }
                    }
                }
                dateAreaN = lines3.join('\n');
                //一旦セクションを初期化
                sections = [];
                currentSection = [];
                // 日付とそれに続く文字列でソート
                for (let line of dateAreaN.split('\n')) {
                    if (line.match(/^\/\/\d{4}\.\d{2}\.\d{2}/)) {
                        if (currentSection.length > 0) {
                            sections.push(currentSection.filter(line => line !== '')); // 空白行を削除
                        }
                        currentSection = [line];
                    } else {
                        currentSection.push(line);
                    }
                }
                if (currentSection.length > 0) {
                    sections.push(currentSection.filter(line => line !== '')); // 空白行を削除
                    sections.sort((a, b) => {
                        const dateMatchA = a[0].match(/^\/\/(\d{4}\.\d{2}\.\d{2})/);
                        const dateMatchB = b[0].match(/^\/\/(\d{4}\.\d{2}\.\d{2})/);
                        if (!dateMatchA || !dateMatchB) {
                            return 0;
                        }
                        const dateA = dateMatchA[1];
                        const dateB = dateMatchB[1];
                        const stringMatchA = a[0].match(/^\/\/\d{4}\.\d{2}\.\d{2} (.*)/);
                        const stringMatchB = b[0].match(/^\/\/\d{4}\.\d{2}\.\d{2} (.*)/);
                        if (!stringMatchA || !stringMatchB) {
                            return 0;
                        }
                        const stringA = stringMatchA[1];
                        const stringB = stringMatchB[1];
                        if (dateA < dateB) {
                            return -1;
                        } else if (dateA > dateB) {
                            return 1;
                        } else {
                            if (stringA > stringB) {
                                return -1;
                            } else if (stringA < stringB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                }
                // ペースト後の項目数を記録
                beforeLength = sections.length;
                // 重複する項目を削除する準備
                sections = sections.filter((section, index) => {
                    // 日付の後に品番がない場合は重複対象から除外
                    if (section[0].match(/^\/\/\d{4}\.\d{2}\.\d{2}\s([^ ]+)/)) {
                        return index === sections.findIndex(s => s[0] === section[0]);
                    } else {
                        return true;
                    }
                });
                // 重複する項目を削除
                sections.sort((a, b) => {
                    const dateA = a[0].match(/\/\/(\d{4}\.\d{2}\.\d{2})/)[1];
                    const dateB = b[0].match(/\/\/(\d{4}\.\d{2}\.\d{2})/)[1];
                    return dateB.localeCompare(dateA);
                });
                let dateAreaS = '';
                for (let i = 0; i < sections.length; i++) {
                    dateAreaS += sections[i].join('\n');
                    if (i < sections.length - 1) {
                        dateAreaS += '\n\n'; // 空白行を追加
                    }
                }
                // 処理後のデータをテキストエリアに貼り付け
                let endAreaTrimmed = endArea.replace(/^\n+/, '');
                document.querySelector('#content').value = `${title}\n${dateAreaS}\n\n${endAreaTrimmed}`;
                // 実行後の文字数を取得
                const lastLength = document.querySelector('#content').value.length;
                // 文字数が減っている場合にアラートを表示
                if (lastLength < initialLength) {
                    alert('\n編集前より文字数が減っています。\n\n編集前の文字数： ' + initialLength + '\n編集後の文字数： ' + lastLength + '\n\n先に復元ポイントを設定してから再度実行して下さい。');
                }
                const textAreaY = document.querySelector('#content').value
                //最初とのデータ比較
                const hasChanged = textAreaX !== textAreaY;
                // 更新後項目数を記録
                afterLength = sections.length;
                //更新データを比較
                if (afterLength > firstLength && hasChanged === true) {
                    if (message.textContent !== '') {
                        message.textContent += '　';
                    }
                    message.textContent += '＜　追加データがソートされました　＞';
                }
                if (afterLength === firstLength && firstLength < beforeLength && hasChanged === true) {
                    if (message.textContent !== '') {
                        message.textContent += '　';
                    }
                    message.textContent += '＜　既存データが更新されました　＞';
                }
                if (hasChanged === false) {
                    if (message.textContent !== '') {
                        message.textContent += '　';
                    }
                    message.textContent = '＜　データの更新はありません　＞';
                }
                // 追加した場所へ移動
                const textAreaJ = document.querySelector('#content')
                modifiedText = clipboardText;
                modifiedText = modifiedText.replace(/\r\n/g, '\n');
                const indexJ = textAreaJ.value.indexOf(modifiedText);
                if (indexJ !== -1) {
                    textAreaJ.selectionEnd = indexJ + modifiedText.length;
                    textAreaJ.focus();
                    textAreaJ.selectionStart = indexJ;
                    textAreaJ.selectionEnd = indexJ + modifiedText.length;
                }
            });
        });
    }
})();