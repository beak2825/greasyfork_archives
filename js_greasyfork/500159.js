// ==UserScript==
// @name         漏れチェッカー
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0-20240710
// @description  レーベルページで品番をAlt+右クリックすると女優ページ記載漏れをチェック
// @author       vrav
// @license      public domain
// @match        http://sougouwiki.com/d/*
// @grant        GM_xmlhttpRequest
// @connect      seesaawiki.jp
// @downloadURL https://update.greasyfork.org/scripts/500159/%E6%BC%8F%E3%82%8C%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/500159/%E6%BC%8F%E3%82%8C%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==
//  　　　　　　　　　　　　　　　　　　　　　　<<　使い方　>>
//  このスクリプトを実行する前に別途公開の「漏れチェッカー用 名前変換表データ抽出」スクリプト↓
//  https://greasyfork.org/ja/scripts/500158-%E6%BC%8F%E3%82%8C%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E7%94%A8-%E5%90%8D%E5%89%8D%E5%A4%89%E6%8F%9B%E8%A1%A8%E3%83%87%E3%83%BC%E3%82%BF%E6%8A%BD%E5%87%BA
//  で名前変換表（当スクリプトの611行目から）を手動更新して下さい。（改名女優はその名前変換表に基づいてチェックします。）
//  上部メニューから　移動 → 指定行にジャンプ → 611
//
//  レーベルページでチェックを開始したい品番をAltキーを押しながら右クリックすると数値入力画面が表示されます。
//  そこで入力した数値分を下に向かって順番にチェックします。
//  チェック中はチェックウインドウが開き、女優ページの記載漏れがある場合は該当女優名を表示します。
//  チェックウインドウはESCキーで非表示⇔表示を切り替えることが出来ます。
//  ×ボタンを押すと処理を終了します。
//
//  　　　　　　　　　　　　　<　以下の条件で間違った判定となる場合があります　>
//  *レーベルページと女優ページで異なる作品ページを記載している　(作品ページのアドレス変更でどちらか一方のみ変更した等)
//  *当スクリプトを実行する前に「漏れチェッカー用 名前変換表データ抽出」スクリプトを実行していない（最新のWIKI女優一覧データを使用して下さい）
//  *女優ページ一覧の記載が間違っている　(名前変換表は女優ページ一覧を元に作成、＝と⇒の誤りが多い)
//  *出演人数が数十名で当WIKI検索ページの3ページ目以降に表示される女優　(検索2ページ分がチェック対象）
//
//  @versionの後の日付は名前変換表の更新日付です。
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function() {
    'use strict';
    window.addEventListener('load', (event) => {
        let actTexts = [];
        let allMissingTexts = [];
        let currentLine = 0;
        let doc;
        let linkAddress;
        let linkClass;
        let linkText;
        let linkTextA;
        let linkTextB;
        let links;
        let missingTexts = [];
        let nextSibling;
        let originalTexts = [];
        let stop = false;
        let searchResultTexts = [];
        let searchW = [];
        let targetItems = [];
        let yellowContent;
        let yellowTexts = [];
        // ポップアップ
        let checkText = document.createElement('div');
        let checkNum = document.createElement('div');
        let popupM = document.createElement('div');
        // 閉じるボタンを作成
        const closeButton = document.createElement('button');
        closeButton.innerText = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px'; // 位置調整
        closeButton.style.right = '10px'; // 位置調整
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = "20px";
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.onclick = () => {
            popupM.style.display = 'none';
            isPopupOpen = false;
            stop = true; // 閉じるボタンを押したときにprocessAを停止
        };
        // ESC キーを押すたびに表示・非表示を切り替える
        let isPopupOpen = true;
        document.addEventListener('keyup', event => {
            if (event.key === 'Escape') {
                if (isPopupOpen) {
                    popupM.style.display = 'none';
                } else {
                    popupM.style.display = 'block';
                }
                isPopupOpen = !isPopupOpen;
            }
        });
        // 次の品番を取得するコード
        function incrementLastNumber(linkText) {
            const match = linkText.match(/\d+/g);
            if (match) {
                const number = match[match.length - 1];
                const incrementedNumber = String(parseInt(number) + 1).padStart(number.length, '0');
                return linkText.replace(number, incrementedNumber);
            } else {
                return linkText;
            }
        }
        // Alt+右クリックで実行
        document.addEventListener('contextmenu', function(event) {
            if (event.altKey && !event.shiftKey && !event.ctrlKey && event.target.tagName === 'A') {
                event.preventDefault();
                if (document.body.contains(popupM)) {
                    document.body.removeChild(popupM);
                }
                // 実行するたびに変数をリセット
                actTexts = [];
                allMissingTexts = [];
                currentLine = 0;
                missingTexts = [];
                originalTexts = [];
                searchResultTexts = [];
                searchW = [];
                stop = false;
                targetItems = [];
                yellowTexts = [];
                // クリックした要素を取得
                linkText = event.target.textContent;
                linkTextA = event.target.textContent;
                linkClass = event.target.className;
                nextSibling = event.target.parentNode;
                // linkTextとメッセージを表示するプロンプト
                let userInput = prompt('　' + linkText + '　この品番からスタートします。\n　何作品チェックしますか？　( 最大50 )');
                // キャンセルボタンをクリックもしくは 0 を入力
                if (userInput === null || userInput === '0') {
                    return;
                }
                // 入力が数値かどうかを確認
                if (isNaN(userInput)) {
                    alert('数値を入力してください。');
                    return;
                    // 入力を50に制限
                } else if (parseInt(userInput) > 50) {
                    userInput = 50;
                }
                const nextItem = incrementLastNumber(linkText);
                // 対象品番の配列を作成
                targetItems = [linkText];
                for (let i = 1; i < parseInt(userInput); i++) {
                    targetItems.push(incrementLastNumber(targetItems[targetItems.length - 1]));
                }
                // 最初の品番を処理
                const firstItem = targetItems[0];
                // 同じクラスとtextContentを持つ要素を検索
                const targetElements = Array.from(document.querySelectorAll(`.${linkClass}`));
                const targetElement = targetElements.filter(el => el.textContent === targetItems[currentLine])[0];
                if (targetElement) {
                    linkAddress = targetElement.href;
                }
                // ポップアップの要素
                popupM = document.createElement('div');
                popupM.style.top = '50%';
                popupM.style.left = '50%';
                popupM.style.position = 'fixed';
                popupM.style.transform = 'translate(-50%, -50%)';
                popupM.style.boxShadow = '0 2px 4px 0 rgba(0,0,0,0.2), 0 3px 10px 0 rgba(0,0,0,0.19)';
                popupM.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
                popupM.style.zIndex = 999;
                popupM.style.borderRadius = '10px';
                popupM.style.border = '1px solid #000000';
                popupM.style.minWidth = '300px';
                popupM.style.minHeight = '40px';
                popupM.style.maxWidth = '80%';
                popupM.style.maxHeight = '80%';
                popupM.style.overflow = 'auto';
                checkText.innerHTML = "チェック中";
                checkText.style.fontSize = "16px";
                checkText.style.backgroundColor = 'rgba(33, 150, 243, 0.6)';
                checkText.style.color = 'white';
                checkText.style.padding = '6px';
                checkText.style.textAlign = 'center';
                checkNum.style.textAlign = 'center';
                checkNum.style.fontSize = "12px";
                checkNum.style.padding = '6px';
                document.body.appendChild(popupM);
                popupM.appendChild(closeButton);
                popupM.appendChild(checkText);
                checkText.appendChild(closeButton);
                const drag = new Object();
                drag.obj = popupM;
                // マウスダウン
                checkText.addEventListener('mousedown', function(e) {
                    drag.top = parseInt(drag.obj.offsetTop);
                    drag.left = parseInt(drag.obj.offsetLeft);
                    drag.oldx = drag.x;
                    drag.oldy = drag.y;
                    drag.drag = true;
                });
                // マウスアップ
                window.addEventListener('mouseup', function() {
                    drag.drag = false;
                });
                // マウスムーブ
                window.addEventListener('mousemove', function(e) {
                    drag.x = e.clientX;
                    drag.y = e.clientY;
                    const diffw = drag.x - drag.oldx;
                    const diffh = drag.y - drag.oldy;
                    if (drag.drag) {
                        drag.obj.style.left = drag.left + diffw + 'px';
                        drag.obj.style.top = drag.top + diffh + 'px';
                        e.preventDefault();
                    }
                });
                siblingN();
                popupM.appendChild(checkNum);
                processA();
            }
        });
        // テーブル内の要素を解析するコード
        function siblingN() {
            // リンクの文字列後のTD要素内のテキストを抽出して取得
            while (nextSibling = nextSibling.nextSibling) {
                if (nextSibling.nodeType === 1 && nextSibling.tagName === 'TD') {
                    // 日付のデータ迄でストップ
                    const datePattern = /\d{4}-\d{2}-\d{2}/;
                    if (datePattern.test(nextSibling.textContent)) {
                        break;
                    }
                    const acts = nextSibling.querySelectorAll('a');
                    for (let i = 0; i < acts.length; i++) {
                        const actContent = acts[i].textContent.trim();
                        actTexts.push(actContent);
                        if (!linkAddress) {
                            linkAddress = acts[i].href;
                        }
                    }
                    // span要素(ページ未作成のデータ)を取得
                    links = nextSibling.querySelectorAll('span');
                    for (let i = 0; i < links.length; i++) {
                        yellowContent = links[i].textContent.trim();
                        if (yellowContent !== '' && yellowContent !== '?' && yellowContent) {
                            yellowTexts.push(yellowContent);
                        }
                    }
                }
            }
        }
        // processBを停止するための関数
        function stopProcessB() {
            stop = true;
        }
        // 次にチェックする品番を確定するコード
        function processB() {
            // 途中で止める条件
            if (stop) {
                return;
            }
            // 実行するごとに+1、後でItems.lengthと比較
            currentLine++;
            // 品番のリンクとテキストを取得
            links = document.querySelectorAll('a');
            const linkT = document.querySelectorAll("td:first-child");
            let foundLink = null;
            let foundId = null;
            for (let i = 0; i < linkT.length; i++) {
                let link = linkT[i];
                if (link.textContent === linkText) {
                    foundId = link.closest("table").id;
                    foundLink = linkT[i+1];
                    break;
                }
            }
            if (foundLink) {
                let table = document.getElementById(foundId);
                let tdElements = table.querySelectorAll("td:first-child");
                for (let i = 0; i < tdElements.length; i++) {
                    let tdElement = tdElements[i];
                    if (tdElement.textContent === linkText) {
                        if (i < tdElements.length - 1) {
                            linkText = tdElements[i+1].textContent;
                        } else {
                            // 最後の要素である場合
                            currentLine = 50;
                        }
                        break;
                    }
                }
            } else {
                // リンクが見つからない場合
                currentLine = 50;
            }
            nextSibling = [];
            actTexts = [];
            yellowTexts = [];
            searchResultTexts = [];
            for (let i = 0; i < links.length; i++) {
                if (links[i].textContent === linkText) {
                    nextSibling = links[i].parentNode;
                    linkAddress = links[i].href;
                    break;
                }
            }
            siblingN();
        }

        // processAを停止するための関数
        function stopProcessA() {
            stop = true;
        }
        // 漏れチェックコード
        function processA() {
            // 途中で止める条件
            if (stop) {
                return;
            }
            checkNum.innerHTML = "チェック範囲　" + linkTextA + "　～　" + linkText;
            // 同じクラスとtextContentを持つ要素を検索
            const targetElements = Array.from(document.querySelectorAll(`.${linkClass}`));
            const targetElement = targetElements.filter(el => el.textContent === targetItems[currentLine])[0];
            // DMMはラストパスを検索ワードに設定
            if (linkAddress.startsWith('http://www.dmm.co.jp/') || linkAddress.startsWith('https://www.dmm.co.jp/')) {
                searchW = linkAddress.match(/\/([^/]+)\/?$/)[1];
                // MGSはラスト2つのパスを検索ワードに設定
            } else if (linkAddress.startsWith('http://www.mgstage.com/') || linkAddress.startsWith('https://www.mgstage.com/')) {
                const splitLink = linkAddress.split('/');
                searchW = splitLink.slice(-3, -1).join('/') + '/';
                // それ以外はプロトコルのみ削除して検索ワードに設定
            } else {
                searchW = linkAddress.replace(/^https?:\/\//i, '');
            }
            // 女優が未記名もしくは[[]]の場合は終了
            if (actTexts.every(function(text) {
                // return /^(\s|----|別ページ|？|\?|,|編集)*$/.test(text);
                return /^(\s|別ページ|？|\?|,|編集)*$/.test(text);
            })) {
                // processBを実行前にアラートに表示する品番を確定
                linkTextB = linkText
                processB();
                if (currentLine < targetItems.length) {
                    processA();
                } else {
                    if (allMissingTexts.length > 0) {
                        if (document.body.contains(popupM)) {
                            document.body.removeChild(popupM);
                        }
                        document.body.appendChild(popupM);
                        popupM.appendChild(closeButton);
                        checkText.innerHTML = "漏れています";
                        if (popupM.style.display === 'none') {
                            // ポップアップウィンドウを中央へ
                            popupM.style.top = '50%';
                            popupM.style.left = '50%';
                            popupM.style.display = 'block';
                            // ポップアップウィンドウのサイズを固定
                            popupM.style.width = popupM.offsetWidth + 'px';
                            popupM.style.height = popupM.offsetHeight + 'px';
                        }
                    } else {
                        if (document.body.contains(popupM)) {
                            document.body.removeChild(popupM);
                        }
                        setTimeout(function() {
                            alert("全て記載されています。\nチェック範囲　" + linkTextA + "　～　" + linkTextB);
                        }, 0);
                    }
                    return;
                }
            } else {
                // 編集アドレスを取得
                const url = document.querySelector('h2 > a[rel="nofollow"]').href;
                if (document.body.contains(popupM)) {
                    document.body.removeChild(popupM);
                }
                document.body.appendChild(popupM);
                const promiseU = new Promise((resolve, reject) => {
                    // 選択項目のテキストを取得
                    const promiseW = new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            onload: function(response) {
                                if (response.status === 200) {
                                    const parser = new DOMParser();
                                    doc = parser.parseFromString(response.responseText, "text/html");
                                    // 2回目以降のアクセス
                                    if (sessionStorage.getItem('firstWiki')) {
                                        resolve(doc);
                                    } else {
                                        // 初回アクセス時にログイン処理ページをGETした場合
                                        sessionStorage.setItem('firstWiki', 'true');
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: url,
                                            onload: function(response) {
                                                if (response.status === 200) {
                                                    const parserW = new DOMParser();
                                                    doc = parserW.parseFromString(response.responseText, "text/html");
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
                    promiseW.then(doc => {
                        const contentElement = doc.querySelector("#content");
                        const content = contentElement.textContent;
                        const lines = content.split('\n');
                        // 指定の書式で始まっているかチェック
                        let found = false;
                        let i;
                        for (i = 0; i < lines.length; i++) {
                            if (lines[i].startsWith("|[[" + linkText)) {
                                found = true;
                                break;
                            }
                        }
                        // 直前の'|~NO'行を探す
                        let noFound = false;
                        if (found) {
                            for (let j = i - 1; j >= 0; j--) {
                                if (lines[j].startsWith('|~NO') || /^\|~\d+/.test(lines[j])) {
                                    noFound = true;
                                    const headerParts = lines[j].split('|');
                                    // 'ACTRESS'のある列を探す
                                    for (let k = 1; k < headerParts.length; k++) {
                                        if (headerParts[k] === 'ACTRESS' || headerParts[k].match(/w\(\d{1,3}%\):ACTRESS/)) {
                                            // 範囲を決めて文字列を抽出
                                            const parts = lines[i].split('|');
                                            const extractedText = parts[k];
                                            // [[]]ごとに行分け
                                            originalTexts = extractedText.match(/\[\[[^\]]+\]\]/g);
                                            // [[]]を削除
                                            if (!originalTexts) {
                                                return;
                                            }
                                            originalTexts = originalTexts.map(function(line) {
                                                return line.replace(/[\[\]]/g, '');
                                            });
                                            // >が有ればその文字とその左側を削除
                                            originalTexts = originalTexts.map(function(line) {
                                                const index = line.indexOf('>');
                                                if (index !== -1) {
                                                    return line.slice(index + 1);
                                                }
                                                return line;
                                            });
                                            // 重複する配列を削除　(2度記載の女優)
                                            originalTexts = [...new Set(originalTexts)];
                                        }
                                    }
                                }
                            }
                            if (!noFound) {
                                if (document.body.contains(popupM)) {
                                    document.body.removeChild(popupM);
                                }
                                setTimeout(function() {
                                    alert("ヘッダーが既定の書式ではありません。");
                                }, 0);
                                return;
                            }
                            // 書式が違う場合アラート
                        } else {
                            console.log("lines[" + i + "] 書式が違います。 '|[[" + linkText + "': " + lines[i]);
                            if (document.body.contains(popupM)) {
                                document.body.removeChild(popupM);
                            }
                            setTimeout(function() {
                                alert("書式が違います。");
                            }, 0);
                            return;
                        }
                        // テキストコンテンツの文字列を変換
                        for (let m = 0; m < originalTexts.length; m++) {
                            if (conversionTable.hasOwnProperty(originalTexts[m])) {
                                originalTexts[m] = conversionTable[originalTexts[m]];
                            }
                        }
                        if (yellowTexts.length > 0) {
                            originalTexts = originalTexts.filter(function(text) {
                                return !yellowTexts.includes(text);
                            });
                        }
                        resolve(originalTexts);
                    });
                }).then((result) => {
                }).catch((error) => {
                    if (document.body.contains(popupM)) {
                        document.body.removeChild(popupM);
                    }
                });

                Promise.all([promiseU]).then(() => {
                    // 検索アドレス
                    const url1 = 'http://sougouwiki.com/search?search_type=2&search_target=all&keywords=' + searchW;
                    const url2 = 'http://sougouwiki.com/search?search_type=2&search_target=all&keywords=' + searchW + '&p=2';
                    // 2ページ目があるかのフラグ
                    let hasPagingTop = false;
                    // データを取得
                    async function getData(url) {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: url,
                                onload: function(response) {
                                    resolve(response);
                                },
                                onerror: reject
                            });
                        }).then(function(response) {
                            const parserX = new DOMParser();
                            const docX = parserX.parseFromString(response.responseText, 'text/html');
                            const elements = docX.querySelectorAll('h3.keyword');
                            // 2ページ目があるか確認
                            const pagingTopDiv = docX.querySelector('div.paging-top');
                            for (let i = 0; i < elements.length; i++) {
                                searchResultTexts.push(elements[i].textContent);
                            }
                            if (pagingTopDiv && pagingTopDiv.querySelector('a[href]')) {
                                hasPagingTop = true;
                            }
                        }).catch(function(error) {
                            setTimeout(function() {
                                alert(error);
                            }, 0);
                            return;
                        });
                    }
                    async function main() {
                        await getData(url1);
                        // 2ページ目がある場合
                        if (hasPagingTop) {
                            await getData(url2);
                        }
                        processResults();
                    }
                    main();
                    // 検索結果と照合するコード
                    function processResults() {
                        missingTexts = originalTexts.slice();
                        for (let i = 0; i < searchResultTexts.length; i++) {
                            const index = missingTexts.indexOf(searchResultTexts[i]);
                            if (index > -1) {
                                missingTexts.splice(index, 1);
                            }
                        }
                        // 不足しているデータ
                        if (missingTexts.length > 0) {
                            console.log('漏れています\n ' + linkText + ":　" + missingTexts.join(', '));
                            let linkTextLength = linkText.length;
                            let spaceLength = linkTextLength + 1;
                            let lineLength = 8;
                            for (let i = 0; i < missingTexts.length; i += lineLength) {
                                if (i == 0) {
                                    allMissingTexts += (linkText + "：" + missingTexts.slice(i, i + lineLength).join(', ') + '<br>');
                                } else {
                                    allMissingTexts += `<span style="visibility:hidden;">${linkText}</span>　${missingTexts.slice(i, i + lineLength).join(', ')}<br>`;
                                }
                            }
                            if (allMissingTexts.length > 0) {
                                if (!document.body.contains(popupM)) {
                                    popupM.appendChild(checkText);
                                    popupM.appendChild(checkNum);
                                    document.body.appendChild(popupM);
                                }
                                popupM.innerHTML = "";
                                popupM.appendChild(checkText);
                                checkText.insertAdjacentHTML('afterend', '<div style="margin: 18px; color: red;">' + allMissingTexts + '</div>');
                                popupM.appendChild(checkNum);
                            }
                        } else {
                        }
                        // processBを実行前にアラートに表示する品番を確定
                        linkTextB = linkText
                        processB();
                        if (currentLine < targetItems.length) {
                            processA();
                        } else {
                            if (allMissingTexts.length > 0) {
                                if (document.body.contains(popupM)) {
                                    document.body.removeChild(popupM);
                                }
                                document.body.appendChild(popupM);
                                popupM.appendChild(closeButton);
                                checkText.innerHTML = "漏れています";
                                if (popupM.style.display === 'none') {
                                    // ポップアップウィンドウを中央へ
                                    popupM.style.top = '50%';
                                    popupM.style.left = '50%';
                                    popupM.style.display = 'block';
                                    // ポップアップウィンドウのサイズを固定
                                    popupM.style.width = popupM.offsetWidth + 'px';
                                    popupM.style.height = popupM.offsetHeight + 'px';
                                }
                            } else {
                                if (document.body.contains(popupM)) {
                                    document.body.removeChild(popupM);
                                }
                                setTimeout(function() {
                                    alert("全て記載されています。\nチェック範囲　" + linkTextA + "　～　" + linkTextB);
                                }, 0);
                            }
                            return;
                        }
                    }
                });
            }
        }

        // < 名前変換表 >　'変換前': '変換後',  // 行番号の矢印をクリックすると折り畳めます。
        const conversionTable = {
            '藍色なぎ': '茉宮なぎ',
            '桃香りり': '藍色りりか',
            '相内つかさ': '本真ゆり',
            '愛内ゆう': '松本みなみ(2020)',
            '愛内ゆず': '安堂エリカ',
            '藍花': '花桐まつり',
            '秋元まゆ花': '愛花沙也',
            '愛川香織': '藤咲葵',
            '青山レイ': '愛川咲樹',
            '愛川サラ': 'ヴァレンタリッチ',
            '相川志穂': '篠宮千明',
            '愛川知香': '中居ちはる',
            '中村唯': '藍川なぎさ',
            '相川葉菜': '桜井萌',
            '中野梓咲': '相川まみ',
            '相川真弓': '佐久間泉',
            '阿久津まき': '藍川美夏',
            '愛川みさ': '青山みさ',
            '相川恋(2021)': '椎名ゆきの',
            '如月にの': '逢坂千夏',
            '逢坂まいか': '大河まりあ',
            '逢坂りの': '野々宮すず',
            '中田かな': '野々宮すず',
            '青山真希': '眞ゆみ恵麻',
            '青木真希': '眞ゆみ恵麻',
            '愛咲りんか': '椿あき',
            '曖田たき': '椿あき',
            '原千尋': '愛咲れいら',
            '優月心': '藍里ゆな',
            '綾瀬さくら': '愛沢あかり',
            '愛瀬えれな': '愛澤えま',
            '相沢えみり': '早坂かな',
            '京野ななか': '早坂かな',
            '愛沢かな': '小倉みなみ',
            '相沢夏帆': '森下美怜',
            '逢沢なお': '青山れあ',
            '愛沢のあ': '成沢めい',
            '黒木琴音': '逢沢はるか',
            '中山早紀': '逢沢はるか',
            '愛沢ゆき': 'SHIN',
            '松下紗世': 'SHIN',
            '川島みなみ': 'SHIN',
            '愛澤らな': '小鳥遊あさ子',
            'はとり心咲': '逢沢りいな',
            '朱果': '逢沢りいな',
            '相澤リナ': '月本みほの',
            '林美紀': '逢沢るる',
            '愛代さやか': 'ましろあい',
            '佐藤ありす': 'ましろあい',
            '愛純彩': '桜木えり',
            '愛須もえ': '愛須みのん',
            '九条しずく': '愛須みのん',
            'ほしのしほ': '愛須みのん',
            '桃香ことね': '愛瀬美希',
            '咲野の花': '愛瀬るか',
            'あいだ飛鳥': '高嶋ゆいか',
            '愛葉なお': '藍田さとみ',
            '相田りん': '有馬すず',
            '逢月りな': '有村りか',
            'なのかひより': '愛斗ゆうき',
            '川野なみ': '藍奈みずき',
            '愛音さおり': '神崎レミ',
            '愛音ミク': '榊まり子',
            '愛音ゆり': 'SAORI',
            '愛乃': '百花エミリ',
            '松下ゆうか': '愛乃彩音',
            '日向こはる': '逢乃なのは',
            '花城ミク': '逢乃なのは',
            '春日野くるみ': '愛乃ねこ',
            '愛乃みやび': '片桐りの',
            '愛野ももな': '百瀬りこ',
            '井駒みつき': '百瀬りこ',
            '葉月桃': '百瀬りこ',
            '樺月愛華': '藍野夢',
            '凛華': '藍野夢',
            '浅見せな': '愛乃零',
            '笹本結愛': '愛乃零',
            '愛葉ありあ': '菊間亜弥',
            '愛実ありあ': '菊間亜弥',
            '愛葉こゆき': '小日向こゆき',
            '三浦レミ': '小日向こゆき',
            '鈴木麻湖': '小日向こゆき',
            '愛羽なな': '菜々葉',
            '藍原あおい': '山本蓮加',
            '湊えふ': '相原翼',
            '相原ひとみ': '瞳れい',
            '白井ユリ': '瞳れい',
            '麻美らん': '愛原みほ',
            '秋川れな': '愛原みほ',
            '愛原優乃': '葵まりあ',
            '伊井野みなみ': '葵まりあ',
            '相原佑香': '立花久美',
            '愛原ゆずな': '北川りこ',
            '花梨': '愛原れの',
            '滝沢紅葉': '相葉りか',
            '橋本美歩': 'あいみ',
            '山田リリカ': '愛心',
            '山田りりか': '愛心',
            '大原若菜': '愛宮せつな',
            'あいら': '真木ななえ',
            'airu': '中野みづほ',
            '愛流星奈': '向井ゆうき',
            '小野夕子': '葵',
            '翼あおい': '葵いぶき',
            '碧えみ': 'あかね葵',
            '大谷みれい': '蒼井さくら',
            '竹内美希': '蒼井さくら',
            '桐島アリサ': '蒼井さくら',
            '富永ユリア': '蒼井さくら',
            '篠めぐみ': '碧しの',
            '中村遙香': '碧しの',
            '宮嶋あおい': '碧しの',
            '最上りこ': '蒼井なみ',
            '葵みさき': '七海ゆあ',
            '一松愛梨': '葵百合香',
            '八田愛梨': '葵百合香',
            '葵律': '成宮はるあ',
            '陽咲希美': '成宮はるあ',
            '乃木はるか': '成宮はるあ',
            '青空ひより': '青井莉奈',
            '松下はるか': '蒼井りんご',
            '青木菜摘': '浪川梨花',
            'しいのまお': '浪川梨花',
            '平山こずえ': '青木美空',
            '朝日芹奈': '青木桃',
            '明石翼': '青木りかこ',
            '碧木凛': '黒崎さく',
            '青空みらい': '若桜りく',
            '大空美緒': '若桜りく',
            '河合優衣': '若桜りく',
            '藤島雪絵': '大嶋恵',
            '新井由紀': '大嶋恵',
            '沢井百合': '大嶋恵',
            '青田悠華': '水瀬さな',
            '青田梨乃': '青田莉乃',
            '蒼月ひかり 2': '蒼月ひかり',
            '石原あい': '葵野まりん',
            'さわきりほ': '蒼乃ミク',
            'さわき里保': '蒼乃ミク',
            '新垣ひとみ': '蒼乃ミク',
            '青葉': '青葉ゆう',
            '青葉夏': '堀沢ゆい',
            'あおば結衣': '柊木のあ',
            '夏芽ひなた': '柊木のあ',
            '竹内柚葉': '青羽勇歩',
            '青葉ゆな': '西尾れむ',
            '蒼葉ゆめ': '浅野柚奈',
            '碧棺りか': 'さくらあきな',
            '木内亜美菜': 'さくらあきな',
            '青柳ひなた': '中尾芽衣子',
            'NOA': '中尾芽衣子',
            '橋本莉奈': '青山亜美',
            '藤井あみな': '青山希愛',
            '柚木みう': '青山希愛',
            '青山さつき': '吉永なつき',
            '青山祥子': '芳野京子',
            '柳井瞳': '青山ななせ',
            '北村春花': '水川ゆうり',
            '早瀬めぐ': '水川ゆうり',
            '月原ももか': '杉本亜美',
            '月原桃香': '杉本亜美',
            '月門ゆか': '杉本亜美',
            '青山美緒': '青山みおん',
            '日向るな': '青山みな',
            '北乃麦': '青山みるか',
            '萌木こはる': '青山みるか',
            '白石ありさ': '青山悠',
            '青山ローラ': '美月リア',
            '赤井美月': '神無月れな',
            '折原ほのか': '神無月れな',
            '指原もえみ': '赤江恋実',
            '舟崎千尋': '赤木紗耶',
            '宇多田あみ': '赤城穂波',
            '赤坂アスカ': '加藤はるな',
            'うさみ鈴': '赤瀬尚子',
            '沖田いつき': '赤瀬尚子',
            'ayami': '赤西涼',
            '赤渕蓮': 'ひなみれん',
            '赤堀えみ': '白鳥美玲',
            'Roco': '明佐奈',
            'あかり美来': 'ゆうか凛',
            '令和れい': 'ゆうか凛',
            '阿川蘭': '四ツ葉あおい',
            'あき': '安倍麻沙美',
            '沙倉みなみ': '秋川みなみ',
            '松嶋さなえ': '秋園このえ',
            '中村香月': '秋月彩乃',
            '江口浩美': '秋月しずこ',
            '松本ルイ': '雨宮せつな',
            'くさかべめい': '秋月めい',
            '日野雫': '秋菜はるか',
            '秋野シフォン': '早坂愛梨',
            '秋場莉緒': '夏川えり',
            '秋元さちか': '西野たえ',
            '胡桃たえ': '西野たえ',
            '秋本詩音': '天希ユリナ',
            '平川るる': '秋元すずね',
            '卯月ちはや': '秋元千早',
            '秋本めい': '中園めいな',
            '城崎まろん': 'ひばり結羽',
            '鈴村いろは': 'ひばり結羽',
            '黒川メイサ': 'ティア',
            '星川早苗': '秋山祥子',
            '新垣奈穂': '秋山ゆう',
            '小島梨咲': '秋山ゆう',
            '藤田りかこ': '秋山ゆう',
            '前田さつき': '秋山ゆう',
            '内田つかさ': '秋山ゆう',
            '江原あけみ': '秋吉慶子',
            '曽根崎深雪': '秋吉志乃',
            '水無月ミュウ': '秋吉多恵子',
            '晶エリー': '大沢佑香',
            '新井エリー': '大沢佑香',
            '藤本カレン': 'アゲハ',
            '麻井香織': '北原樹里',
            '浅井栞': '星川まい',
            '椎名あかり': '星川まい',
            '朝井涼香': '伊東沙蘭',
            '浅川真由美': '伊東沙蘭',
            '浅井美穂': '城戸のあ',
            '朝岡すみれ': '堂島れい',
            '朝香ひな': '美咲恋',
            '朝香美穂': '岩崎麻莉子',
            '浅唐あく美': '麻生沙奈',
            '唯菜まなみ': '麻川アンナ',
            '大塚もも(2013)': '浅川サラ',
            '朝川静香': '天野弥生',
            '観月やよい': '天野弥生',
            '浅川ののか': '美丘さとみ',
            '立花優花': '美丘さとみ',
            '愛花みちる': '美丘さとみ',
            '南野あかり': '朝桐光',
            '綾乃さえ': '朝霧一花',
            '朝霧いのり': '美雲そら',
            '小町ななみ': '朝霧かすみ',
            '朝霧のあ': '矢田美紀子',
            '岸川真衣': '矢田美紀子',
            '朝比奈さき': 'ゆうきさやか',
            '三高由莉子': '麻倉汐里',
            '朝倉ちひろ': '牧瀬みのり',
            '朝倉なお': '早乙女みなき',
            '朝倉凪': '星宮みなみ',
            '朝倉なつき': '寿ありさ',
            '上村みき': '寿ありさ',
            '木下ゆな': '寿ありさ',
            '山口りえ': '寿ありさ',
            '浅倉真凛': '春凪星花',
            '星名咲良': '春凪星花',
            '麻倉みう': '京野結衣',
            '浅倉もえ': '岡島遥香',
            '高崎莉依': '麻倉ゆあ',
            '佐倉あゆ': '麻倉ゆあ',
            '楓乃々花': '朝倉夢',
            'かすみれおん': '朝田ばなな',
            '浅田博美': '和希美波',
            '浅田結梨': '深田結梨',
            '麻月マリー': '高野姫奈',
            '中谷玲奈': '浅見友紀',
            '影山さくら': '朝陽えま',
            '朝比奈京子': '朝比奈菜々子',
            '今井花菜': '朝比奈菜々子',
            'あさひ奈々': '黒木いくみ',
            '黒居ろく': '黒木いくみ',
            'ゆうひ菜那': '黒木いくみ',
            '朝比奈麻里': '望月伊織',
            '上村香澄': '望月伊織',
            '坂井優羽': '望月伊織',
            '朝比奈みくる': '椎名みずほ',
            '朝比奈美和': '朝比奈実和',
            '朝比奈めい': '坂上ゆあ',
            '二ノ宮まりん': '坂上ゆあ',
            '吉川美憂': '朝比奈ゆめの',
            '朝比奈リサ': '北村玲奈',
            '朝日奈るみな': '芽森しずく',
            '朝日りか': '横峰あい',
            '空見真実': '横峰あい',
            '天宮ゆきな': '朝海',
            'りま': '朝海',
            'あざみねね': '春日もな',
            '南円': '春日もな',
            '鈴木ワカ': '春日もな',
            '吉澤留美': '春日もな',
            '浅海まゆみ': '滝沢のぞみ',
            '麻宮えりか': '柚宮なお',
            '麻宮玲': 'みおり舞',
            '渡辺凛': '芦那しおり',
            '稲森しほり': '芦名未帆',
            '有栖花あか': '汐世',
            '日向まひる': '東杏果',
            '明美楓': '滝沢ライラ',
            '希のぞみ': '明日美かんな',
            '小泉まり': '明海こう',
            '桃菜あこ': '明海こう',
            '阿澄ちほ': '京野明日香',
            'あずみひな': 'みひな',
            '永井みひな': 'みひな',
            '安住涼子': '鮎原いつき',
            '蓮美恋': 'あずみ恋',
            '望月梨央': '伍代麗子',
            '麻生知香': '一色あみか',
            '近澤まゆみ': '麻生まどか',
            '富樫まり子': '麻生まり子',
            '安達亜美': '蓮実クレア',
            '安達みずほ': '葉月ゆめ',
            '大石美咲': '葉月ゆめ',
            '楠美める': '足立める',
            '神田瞳': '安達莉子',
            '渥美イオン': '笠原あおい',
            '安倍晶子': '百瀬ここあ',
            '阿部栞菜': '宇野栞菜',
            '阿部菜津子': '福山洋子',
            '阿部瑞希': '折笠弥生',
            '世羅いのり': 'あまいらむね',
            '天方ゆこ': '舞泉ゆこ',
            '斎藤みくる': '天上みさ',
            'ひな(2012)': '天川ひとみ',
            '天姫あいり': '姫嶋くるみ',
            '天霧真世': '華城咲',
            '三枝由梨': '華城咲',
            '高岡しずか': '華城咲',
            '如月冴子': '華城咲',
            'ジャネット藍': '華城咲',
            '新名あみん': '天国るる',
            '天咲ひめの': '夜空あみ',
            '天咲めい': '紅城まゆ',
            '栗栖みなみ': '天沢ゆきね',
            '星なこ': '天月あず',
            '天月叶菜': 'なごみ',
            '天音うさぎ': '小松愛依',
            '倉持ひろな': '小松愛依',
            '天然かのん': '天然美月',
            '北川蓮': '天音恋愛',
            '天音テラス': '佐々木愛梨',
            '神谷ゆうき': '佐々木愛梨',
            '天音めあ': '宇佐美みおん',
            '初音ろな': 'あまねめぐり',
            '倉科ほのか': 'あまねめぐり',
            '天音優莉': '那月めい',
            '天音ゆさ': '冴島エレナ',
            '天音りおん': '水樹璃子',
            '深雪海稟': '天野小雪',
            '天野みほ': '鈴森汐那',
            '久我美波': '天野るみ',
            '天野玲奈': '柚木夏波',
            '天海こころ': '深田えいみ',
            '沢平秋乃': '天海しおり',
            '八束みこと': '雨宮いぶき',
            '雨宮ゆず': '宮瀬ゆりえ',
            '雨宮凛': '雨宮凜',
            '泉なつみ': '雨宮凜',
            '円めぐみ': '雨宮凜',
            '椿ましろ': '乾りっか',
            'あみ(2013)': '穂刈みゆき',
            '松嶋りょう': '彩弓',
            '雨宮ののか': '野々原まゆ',
            '野々宮あめ': '雨宮もな',
            '彩風のん': '知花みく',
            '彩佳リリス': '藤崎クロエ',
            '黒崎ちな': '綾川ふみ',
            '綾川まどか': '菜々緒まどか',
            '日乃ふわり': '彩川ゆめ',
            '七瀬あさ美': '綾咲くるみ',
            '彩咲もも香': '桃瀬ゆり',
            '舞園ひな': '綾瀬ことり',
            'ひなちゆん': '綾瀬ことり',
            '綾瀬さと美': '寿ゆかり',
            '平原あいみ': '綾瀬じゅり',
            '彩瀬自由里': '名森さえ',
            '綾瀬つばめ': 'さくら姫',
            '黒崎セシル': '綾瀬ティアラ',
            '綾瀬ひなの': '青山朱里',
            '橘みおり': '綾瀬みおり',
            '綾瀬ミレナ': '森沢リサ',
            '綾瀬ゆい': '南瀬奈',
            '綾瀬ルナ': '南条みか',
            '根本香世子': '綾瀬留美',
            '綾瀬れん': '福咲れん',
            '大塚れん': '福咲れん',
            '松島れん': '福咲れん',
            '岸上莉子': '彩月香歩',
            '彩奈': '彩奈つばさ',
            '新田カレン': '綾波カレン',
            '綾波まこ': '春乃さくら',
            '小川みちる': '春乃さくら',
            '七原あかり': '彩奈リナ',
            'あやなれい': '岡崎エリナ',
            '佐藤あや奈': '岡崎エリナ',
            'RICA': '彩音リカ',
            '柚月ありさ': '絢音りさ',
            '一戸のぞみ': '綾乃梓',
            '大澤あや乃': 'あやの琴美',
            '叶彩乃': '綾野鈴珠',
            '彩乃ゆかり': '牧村彩香',
            '有馬かれん': '彩春凛',
            '橘れな': '彩春凛',
            '神谷充希': '亜矢みつき',
            '真矢みつき': '亜矢みつき',
            '綾見ひなの': '春川なのは',
            '綾宮京子': '緒方みずき',
            '神咲ナオミ': '緒方みずき',
            '内藤斐奈': '緒方みずき',
            '夏目レイコ': '緒方みずき',
            '西川ともか': '緒方みずき',
            'あやめ陽菜': '神谷千佳',
            'AYU': '神戸莉々',
            '佐々木りのあ': '神戸莉々',
            '鮎川つぼみ': '高坂ひまり',
            '小暮未来': '高坂ひまり',
            'あゆな虹恋': '一ノ瀬恋',
            '黒澤雪華': '鮎原いつき',
            '絢弓あん': '神宮寺ナナ',
            '早乙女もなか': '神宮寺ナナ',
            'あゆみ千紗': '有村まゆか',
            '亜弓つばさ': '花宮あみ',
            '愛弓りょう': '三浦歩美',
            '真咲南朋': '安藤なつ妃',
            '竹田香苗': '新井れな',
            '志摩ことり': '新垣ことり',
            '新垣とわ': '今井初音',
            '錦織アミ': '新垣ふみ',
            '吉本和香子': '新垣百合子',
            '鈴村みゆう': '荒川美余',
            '荒木ありさ': '神木りさ',
            '月島うさぎ': '神木りさ',
            '花澤りみ': '新木えりか',
            '小暮みなみ': '荒木まい',
            '新ありな': '橋本ありな',
            '椎葉みくる': '有岡みう',
            '桃瀬雛乃': '有尾さくら',
            '有栖七菜': '有賀ゆあ',
            '阿利希カレラ': '阿利希キリア',
            '中野ありさ': 'ありさ',
            '有坂つばさ': '葉山りん',
            '有坂未央': '鳴海せいら',
            '松浦沙耶': '有坂玲奈',
            '有咲いちか': '白咲ゆず',
            '桃華ゆりあ': '白咲ゆず',
            '有沢実紗': '滝川恵理',
            '南沙也香': '有沢りさ',
            '有末香織': '篠原友香',
            '西宮美月': '篠原友香',
            '有栖川あまね': '音あずさ',
            '神楽あまね': '音あずさ',
            '小島りりか': '有栖ももか',
            '有栖るる': 'るるちゃ。',
            '宮内雪菜': '有奈めぐみ',
            '真鍋樹里': '有奈めぐみ',
            '花咲亜弥': '有原あゆみ',
            '宮名初季': '有星あおり',
            '有馬優羽': '中山陽菜',
            '陽菜': '中山陽菜',
            '一ノ瀬レイラ': '有馬凛',
            '有宮まこと': '本間麗花',
            '七森まこ': '有森美春',
            '事原みゆ': '有森涼',
            '泡乃しずく': '成宮カナ',
            '杏紅茶々': '水嶋あい',
            '水嶋アイ': '水嶋あい',
            '安西夏海': '堀口美衣奈',
            '安西ひかり': '皆瀬杏樹',
            '斎藤ミオリ': '皆瀬杏樹',
            'RION': '安齋らら',
            '宇都宮しをん': '安齋らら',
            '安西るな': '安西瑠菜',
            '瑠菜': '安西瑠菜',
            '桜庭ハル': '飯島夏希',
            '杏樹紗奈': 'くるみひな',
            '杏樹そら': 'ひなのりく',
            '杏沙耶': '新井流花',
            '栗林杏子': '杏ちはや',
            '佐々木かすみ': '伊達美佐子',
            '川田優子': '伊達美佐子',
            '石川文子': '伊達美佐子',
            '増山恭子': '伊達美佐子',
            '安藤朋花': '八百原百花',
            '安野百香': '八百原百花',
            '瀬戸ひまり': '杏堂怜',
            '飯岡かなこ': '森沢かな',
            '加額理香': '飯島楓',
            '星川ルル': '飯島くらら',
            '飯塚けいこ': '白石すみれ',
            '柊恋': '飯野寧々',
            '飯山香織': '夏咲まりみ',
            '五十嵐かほ': '夏咲まりみ',
            '良音なずな': '成美このは',
            '矢乃かのん': '成美このは',
            '衣織': '夜空まひろ',
            '椎名千景': '夜空まひろ',
            '優保なのか': '夜空まひろ',
            '半田りえ': '伊織沙菜',
            '水咲菜々美': '伊織しずく',
            '五十嵐かな': '夏樹まりな',
            '千夏まりな': '夏樹まりな',
            '五十嵐星蘭': '蘭々',
            '海乃亜夢': '井川あいな',
            '柏木胡桃': '永井マリア',
            '井川のぞみ': '新尾きり子',
            '井川希': '穂ひまり',
            '神田朋実': '小鳥遊恋',
            '沢田珠里': '小鳥遊恋',
            '手塚みや': '小鳥遊恋',
            '煌芽木ひかる': '池内みわ',
            '池里みほ': '宗方志穂',
            '池田咲': '鶴田舞',
            '池田法香': '堂島れい',
            '池田陽子': '村崎ちづる',
            '池端真美': '池端真実',
            '笠原あおい': '渥美イオン',
            '花撫あや': '池谷佳純',
            '七瀬もな': '伊佐木リアン',
            '伊沢美春': '長尾みわ',
            '桐谷しほ': '長尾みわ',
            '伊沢むつみ': '上原みく',
            '一之瀬みき': '上原みく',
            '小島睦': '上原みく',
            '伊沢涼子': 'よしい美希',
            '井沢涼子': 'よしい美希',
            '美希': 'よしい美希',
            '吉井美希': 'よしい美希',
            '石井あづさ': '石井あずさ',
            '石井あずさ': '石井あづさ',
            '菊井綾香': '柴咲ゆうり',
            '藤森ねね': '柴咲ゆうり',
            '石川さとこ': '矢田紀子',
            '谷口佳子': '矢田紀子',
            '石原ゆかり': '矢田紀子',
            '観月しおり': '石川しずか',
            '瀬奈紀香': '石川しずか',
            '橘ミオン': '石川鈴華',
            '石川ゆい': '石川結衣',
            '桂希ゆに': '石川里菜',
            '桂木ゆに': '石川里菜',
            '黒木かえで': '石黒京香',
            '藤波さえ': '石田えりこ',
            '霧島レオナ': '石田カレン',
            '石野祥子': '後藤さなえ',
            '清川慶子': '後藤さなえ',
            '守谷多香子': '後藤さなえ',
            '石橋やよい': '森下夕子',
            '神崎清乃': '森下夕子',
            '成島明美': '森下夕子',
            '石橋ゆうこ': '石橋ゆう子',
            '石原あみ': '国見あやせ',
            '若菜まゆ': '石原のぞみ',
            '音凪りりこ': '並木つかさ',
            'しとう和歌': '並木つかさ',
            'つぼみ咲': '並木つかさ',
            'ももは': '並木つかさ',
            '石原由菜': '小湊菜々',
            '石山ひかり': '城沢雪乃',
            '石山りりな': '北原杏',
            '伊集院茜': '中西江梨子',
            '尾崎翠': '中西江梨子',
            '泉朱音': '月島さくら',
            '苺由香': '月島さくら',
            '香椎りこ': '月島さくら',
            'いとう凛': '和泉希歩',
            '春川かすみ': '和葉みれい',
            '稲本志乃': '和泉早妃',
            '金城美麗': '東条美麗',
            '和泉貴子': '並平梨世',
            '高島理恵': '和泉つかさ',
            '谷花紗耶': '伊澄知世',
            '泉美玲': '三橋ひより',
            '千晴': '三橋ひより',
            '泉ゆうめ': '藤井レイラ',
            '椿あいの': '藤井レイラ',
            '椎葉えま': '泉ゆり',
            '伊瀬谷香帆': '黒宮えりか',
            '磯山恵': '磯山恵子',
            '中野愛里': '板野カレン',
            '御園あんり': '板野カレン',
            '水嶋さやか': '市井まお',
            '一花琴音': '宝生リリー',
            '芽森しずく': '宝生リリー',
            '一ノ瀬綾乃': '市河明日菜',
            '市川彩香': '日和香澄',
            '市川まひろ': 'いちご',
            '星ヰいちご': 'いちご',
            '大沢里菜': '市川みのり',
            '竹田ゆめ': '市来まひろ',
            '市来美保': '奥菜アンナ',
            '姫野ゆうり': '奥菜アンナ',
            '花純ありす': '市來あやか',
            '市島亜美': '七瀬アリス',
            '都盛星空': '一条星空',
            '都条星空': '一条星空',
            '一ノ瀬愛育': '菅野くるみ',
            '白崎由奈': '一之瀬愛理',
            '水樹れな': '一之瀬愛理',
            '美空あやか': '一ノ瀬アメリ',
            'かなと沙奈': '一ノ瀬あやめ',
            '文月': '一ノ瀬あやめ',
            '千夏南那': '一ノ瀬夏摘',
            '波木はるか': '一ノ瀬はるか',
            '一ノ瀬もも': '百田くるみ',
            '一之瀬もも': '百田くるみ',
            '一ノ瀬ゆき': '北川ゆり',
            '高園るりあ': '一乃瀬るりあ',
            '一ノ瀬れいな': '長谷川夢',
            '一花みお': '七美せな',
            '市原さとみ': '西村江梨',
            '片岡りさ': '市原由芽',
            '近藤郁美': '近藤郁',
            '市松さゆり': '篠原奈美',
            '一宮みかり': '花守みらい',
            '三舩みすず': '花守みらい',
            '愛花あゆみ': '五日市芽依',
            '樹花凜': '七咲楓花',
            '一色さゆり': '柊紗栄子',
            '胡桃沢ももこ': '柊紗栄子',
            '一色ほなみ': '穂波さやか',
            'いとう秋穂': '美咲りん',
            '桐原あずさ': '伊藤あずさ',
            '伊東あずさ': '美里麻衣',
            '川口あんり': '美里麻衣',
            '伊東エナ': '益若エリカ',
            '夏目あきら': '伊東エリ',
            '夕月かえで': '伊藤かえで',
            '橘つばめ': '伊藤くるみ',
            '桜田知佳子': '金森なつみ',
            '矢吹紫穂': '金森なつみ',
            '伊東すみれ': '杉崎あさみ',
            '伊藤菜桜': '乙咲あいみ',
            '心音にこ': '乙咲あいみ',
            '高宮すず': '乙咲あいみ',
            '伊藤はる': '工藤ララ',
            '伊東真緒': '百合川雅',
            '伊東麻央': 'スザンナ',
            '椎名ゆうき': 'スザンナ',
            '伊東麻由': '帆月なつめ',
            '和希レナ': '伊東美姫',
            '水沢みゆ': 'いとう美憂',
            '大野藍子': 'いとう美憂',
            '伊東める': 'Nia',
            '伊藤結衣': '佐伯由美香',
            '桜木えみ香': '佐伯由美香',
            '伊藤梨紗': '南野ゆきな',
            '伊藤りな': '橘咲良',
            '伊藤ルナ': '所まりあ',
            '伊藤和香': '一ノ瀬あやめ',
            '保志美あすか': '愛乃はるか',
            '稲川なつめ': '黒川すみれ',
            '西田那津': '黒川すみれ',
            '篠原かすみ': '稲川なつめ',
            '吉倉いずみ': '伊波弥生',
            'ゆめのひめ': '伊波弥生',
            '稲村香澄': '望月りさ',
            '稲森しほ': '永井あいこ',
            '柏木りか': '稲森まほ',
            '双葉みか': '稲森まほ',
            '稲森美優': '稲森美憂',
            '稻森若菜': '水卜嬉羽',
            '南乃らん': '水卜嬉羽',
            '今井なつみ': '羽月希',
            '羽田希': '羽月希',
            '伊吹彩': '月島舞香',
            '伊吹杏奈': '観月セイラ',
            '伊吹稟': '香椎杏子',
            '今井杏樹': '青山未来',
            '今井かのん': '滝川かのん',
            '大川ナミ': '滝川かのん',
            '滝沢かのん': '滝川かのん',
            '今泉花菜': '手塚あかり',
            '今井乃愛': '矢口瞳',
            '三森れん': '今井パオラ',
            '今井ひまり': 'みながわ千遥',
            '竹田まい': '今井まい',
            '陽木かれん': '今井麻衣',
            '今井まひな': '馬瀬まひ菜',
            '今田美玲': '七咲琴乃',
            '今永さな': '松永さな',
            '今宮なな': '白石悠',
            '今村なつ': '月美弥生',
            '北沢みなみ': '月美弥生',
            '望月けい': '月美弥生',
            '鈴川莉茉': '今村日那乃',
            '桜田梨加': '今村日那乃',
            '色葉なの': '安田亜衣',
            '月宮ねね': '安田亜衣',
            'いろはみこ': '心望みこ',
            '岩崎絵美子': '美咲杏',
            '岩佐めい': '妃ひかり',
            '仲夏ゆかり': '岩佐めい',
            '彩月あかり': '岩佐めい',
            '岩戸志穂': '小倉奈々',
            'ヴィヴィアンラム': '森川アンナ',
            '瑞樹らら': '森川アンナ',
            'ウー・ウォンリン': '千乃愛佳',
            '新見悠': '高瀬沙織',
            '上杉アヴリル': '上原ソニア',
            '上杉みなこ': '高島いずみ',
            '上園ゆりか': 'YURI',
            '早見奈緒': 'YURI',
            '北川ゆず': '上田紗奈',
            '夜空奈歩': '上野菜穂',
            '上野結': '七海菜々',
            '上原海里': '橘なお',
            '菜月綾': '上原果歩',
            '水来亜矢': '上原果歩',
            '上原結衣(MAX-A)': '上原志織',
            '上原美穂': '甲斐ミハル',
            '三城薫': '甲斐ミハル',
            '柚月なつみ': '植村恵名',
            '上村和美': '岡野まり',
            '植村まさ子': '桧山えつ子',
            '宮下夏帆': '上村みなみ',
            '宇垣美奈': '南詩乃',
            '宇佐美みか': '渚ひまわり',
            '本多なつめ': '渚ひまわり',
            '宇佐美雪': '佐野ゆいな',
            '吉野里奈': '宇佐美玲奈',
            '田中まりあ': '臼井あいみ',
            '臼井みお': '渚あいな',
            '内田美奈子': '美智子小夜曲',
            '内田りさ': '北条ルルカ',
            '内海みう': '中条カノン',
            '内山まい': '河瀬リナ',
            'さくら悠': '河瀬リナ',
            '卯月和美': '倉田江里子',
            '宇野杏奈': '早野いちか',
            '宇野ゆかり': '恵沙也香',
            '宇野ゆりの': '園田ひなの',
            '森ほたる': '海埜ほたる',
            '羽海野まお': '咲楽アンナ',
            '浦野美月': '篠野まゆみ',
            '桜井咲子': '篠野まゆみ',
            '河合紗里': 'うららか麗',
            '環ニコ': '運メイ',
            '結城結乃': '運メイ',
            '佐々木ゆう': '栄川乃亜',
            '恵川乃々子': '大島未華子',
            '江川遥': '知世奏',
            'RYU': '江波りゅう',
            '絵原ゆきな': '花咲のどか',
            '海老原しのぶ': '沢村ゆうみ',
            '蛯原みなみ 2': '蛯原みなみ',
            '愛媛鏡華': '矢吹杏',
            'エマ・ローレンス': 'リリー・ハート',
            '桜庭ひかり': 'EMILY',
            '白木エレン': 'EMILY',
            'EMIRU': '水姫麗奈',
            '早希なつみ': '水姫麗奈',
            'ERIKA': 'モカ',
            'MOKA': 'モカ',
            '藤森くらら': '英里奈',
            'えりりか': '片桐えりりか',
            '遠藤さとみ': '桜咲姫莉',
            '遠藤みちる': 'さくら結衣',
            '及川貴和子': '小日向まい',
            '桜香美羽': '桜井美羽',
            '桜咲麗々': '桜井美羽',
            '逢瀬ゆみ': 'さくらはる',
            '近江なみ': '豊永映美',
            '近藤美奈': '豊永映美',
            '大石もえ 2': '大石もえ',
            '大垣柑奈': '石原ゆりな',
            '大久保伶': '大久保怜',
            '大隈恵令奈': '大隅恵令奈',
            '七星ここ': '大倉みゆ',
            '大河内真美': '大河内奈美',
            '松下美香': '大河内奈美',
            '西原すみれ': '大河内奈美',
            '桜澤芳恵': '大河内奈美',
            '美咲藤子': '大崎静子',
            '折川菜由': '大崎静子',
            'さかい由布': '大崎静子',
            '黛ユイ': '大崎美佳',
            '佐々木咲和': '大崎美佳',
            '華月ゆう': '大澤愛美',
            '大沢かえで': '西村ニーナ',
            '雪平こよみ': '西村ニーナ',
            '大沢つくし': 'しほのちさ',
            'しほの千里': 'しほのちさ',
            'つくし': 'しほのちさ',
            '南彩菜': '大沢のぞみ',
            '大沢萌音': '向井未紗',
            '佐藤奈柚': '向井未紗',
            '大沢佑香 2': '大沢佑香',
            '大沢佑香(雑誌)': '大沢佑香',
            '北嶋あん': '大島あいる',
            '鈴木あいか': '大島あいる',
            '大島ひな': '椿りか',
            '椿かなめ': '大城かえで',
            '葉月潤': '大城かえで',
            '大空七海': '目黒ひな実',
            '大高頼子': '鈴木ありさ',
            '藤木静子': '大田真希',
            '太田まみ': '小松ひな',
            '大田ゆりか': '杉本美奈代',
            '大塚のどか': '萌雨らめ',
            '芹菜ゆき': '大塚麻衣',
            '芹奈ゆき': '大塚麻衣',
            '南りほ': '大塚麻衣',
            '大塚雪乃': '川本セリカ',
            '大槻みそら': '沢口かすみ',
            '神保めぐみ': '越智綾香',
            '大野実花': '美咲真由',
            '大橋依織': '速美もな',
            '水原アキ': '速美もな',
            '葉里さやか': '速美もな',
            '大橋紗奈': 'ひなた唯',
            '大橋桃菜': '桃尻かのん',
            '松岡美緒': '大橋ゆきな',
            '小島由梨': '大橋るり',
            '大畑ひろ子': '熊谷麻美',
            '佐和彩花': '熊谷麻美',
            '米倉葵': '熊谷麻美',
            '山見ゆな': '熊谷麻美',
            '大林リエ': '大林理恵',
            '大原えりか': '小坂芽衣',
            '本田るい': '大原すず',
            '朝長ゆき': '大原すず',
            '川瀬七夏': '大原めぐ',
            '大原ゆみ': '大原友美',
            '真白蘭': '白金せりか',
            '大森一花': '海空花',
            '大森菜々美': '山口千里',
            '小宮るな': '大森玲菜',
            '岡崎みゆ': '神崎るな',
            '岡沢リナ': '星南きらり',
            '岡田優子': '悠木美雪',
            '岡部玲子': '三雲ゆり子',
            '高園ゆり子': '三雲ゆり子',
            '山田和歌子': '三雲ゆり子',
            '緒川藍子': '司杏子',
            '緒川はる': '笹倉杏',
            '小川ひなた': '古賀みなみ',
            '百合奈ひかる': '古賀みなみ',
            '月島花': '小川桃果',
            '沖田はづき': '愛葉みう',
            '沖田里緒': '真宮あや',
            '真宮あやな': '真宮あや',
            '美沢優': '奥菜えいみ',
            '奥菜つばさ': '新城あゆみ',
            '星井未来': '新城あゆみ',
            '荻野つきひ': '双葉かえで',
            '菊池由美': '沖乃麻友',
            '優姫りか': '沖乃麻友',
            '沖野るり': '夏目陽菜',
            '萩原くるみ': '荻原くるみ',
            '奥井楓': '志木あかね',
            '奥山ゆら': '羽賀ちとせ',
            '小椋あずき': '島崎結衣',
            '小倉あんず': '音羽ねいろ',
            '小倉沙織': '神崎ひかる',
            '君嶋唯': '神崎ひかる',
            '小倉みおん': '柑南るか',
            '小倉もも': '桃宮もも',
            '朋香めい': '桃宮もも',
            '桃井りか': '桃宮もも',
            '桜木トモ': 'おぐりみく',
            'やざわかりん': 'おぐりみく',
            '白雪ひなの': '小此木ひなの',
            '与田さくら': '尾崎えりか',
            '美波さくら': '小沢あいり',
            '小沢柚茶': '白鳥あすか',
            '忍足くみ': '忍足紅美',
            '尾嶋みゆき': '花澤アン',
            '尾島みゆき': '花澤アン',
            '成瀬まりか': '花澤アン',
            '小嶺心春': '花澤アン',
            '水嶋アリス': '乙アリス',
            '聖菜アリサ': '乙アリス',
            '宮澤エレン': '乙花イブ',
            '夏愛あずさ': '乙葉カレン',
            '乙葉ななせ': '葉月七瀬',
            '山下優衣': '葉月七瀬',
            '乙原あい': '星仲ここみ',
            '川美優香': '音海里奈',
            '西條りり': '音海里奈',
            '小那海あや': '佐々波綾',
            '小野こまり': '河西乃愛',
            '小野里美': '美咲菜々子',
            '沢尻マリナ': '小野寺沙希',
            '星川美沙': '小野寺のあ',
            '片瀬レイナ': '小野寺まり',
            '織笠るみ': '雫',
            'Tsubaki': '織原えみ',
            '京野梓': '折原志穂',
            '堀口奈津美': '広瀬奈々美',
            '海馬ゆう': 'you.',
            'YOKO': '楓',
            '田中レモン': '楓カレン',
            '楓なつき': '滝口りな',
            '楓まお': '本多成実',
            '鏡桜子': '黒川梨花',
            '柿本真緒': '後藤あづさ',
            '神楽里美': '真矢あかり',
            '三谷楓': '真矢あかり',
            '葉月ハルカ': '真矢あかり',
            '神楽ともみ': '小日向まい',
            '筧ジュン': '鷲尾めい',
            'かさいあみ': '来栖千夏',
            '河西あみ': '来栖千夏',
            '高樹みか': '笠原あずさ',
            '沢井ちなつ': '上條つかさ',
            '藤崎あかり': '風祭あかり',
            '北村好子': '風祭あかり',
            '風真みれい': '山口翠',
            '樋口夕希': '山口翠',
            '風間萌衣': '黒瀬萌衣',
            '風間ゆみ 2': '風間ゆみ',
            '風間ゆみ 3': '風間ゆみ',
            'きみの雫': '風間リナ',
            '風見梨央奈': '高梨風花',
            '花園るな': '香椎みすず',
            '香椎みなみ': '涼宮琴音',
            '白咲碧': '涼宮琴音',
            '樫井ゆうか': '中川理沙',
            '香椎りあ': '雅さやか',
            '橘かえで': '香椎りおん',
            'かじか凛': '桜木莉愛',
            '西垣るか': '桜木莉愛',
            '香嶋菜々子': '舞希香',
            '香嶋奈々子': '舞希香',
            '華嶋れい菜': 'きみかわ結衣',
            '柏木あづさ': '加藤あやの',
            '山城みずほ': '加藤あやの',
            '羽月結菜': '柏木あみ',
            '柏木千鶴': '片瀬みさ',
            '柏木まき': '平島千穂',
            '柏木みあ': '咲楽アンナ',
            '柏木むぅ': '佐藤さり',
            '柏木恵': '春乃さくら',
            'MOE': '柏木もえ',
            '桃井りの': '柏木ゆり菜',
            '春日なみ': '盛川あきこ',
            '松浦沙耶香': '春日もも',
            '春日優子': 'つばき凛',
            '吉美さあや': '和希さやか',
            '和希ゆい': '金内美香',
            '鈴菜愛音': '和葉みれい',
            '小西架純': '架純',
            '花純': '羽純',
            '香澄あいか': '香純あいか',
            '高山玲奈': '香澄せな',
            '麻倉ゆあ': '高崎莉依',
            '香澄レイ': '夢野怜子',
            '黒木あおい': '夢野怜子',
            '加瀬エリナ': '如月愛',
            '佐々木エリー': '如月愛',
            '花園多香子': '風かおる',
            '加瀬凛花': '島谷愛',
            '片岡さち': '巴なのこ',
            '仲丘たまき': '片岡まきな',
            '月島愛': '片岡美沙',
            '月島ななこ': '片桐えりりか',
            '片桐沙夜子': '五月峰子',
            '片桐沙代子': '五月峰子',
            '片桐栞': '片山雫',
            '片瀬さつき': '永嶋綾乃',
            '片瀬翔子': '国見りさ',
            '藤木未央': '片瀬仁美',
            '藤沢未央': '片瀬仁美',
            '山口璃果': '片瀬真妃',
            '片瀬由奈': '高橋りお',
            '千種ちな': '鈴木ちひろ',
            '大澤愛美': '華月ゆう',
            '華月瑠美': '鈴木明那',
            '樫村ゆり子': '桂木ななえ',
            '本条るな': '加藤いおり',
            '前田えま': '加藤えま',
            '氷室心音': '加藤朱里',
            '夏樹カオル': '加藤ツバキ',
            '加藤はるき': '桜井あゆ',
            '福井あや': '桜井あゆ',
            '加藤はる希': '希咲エマ',
            'HARUKI': '希咲エマ',
            '加藤ほのか': '二ノ宮リホ',
            '加藤まみ': '美川由加里',
            '夢咲りぼん': '七夕りぼん',
            '加藤美沙': '長谷川千穂',
            '加藤ももか': '佐藤ののか',
            '加藤れいな': '加藤レイナ',
            '門倉沙希': '瞳ゆら',
            '京本かえで': '瞳ゆら',
            '金苗希実': '新條希',
            '金崎ゆあ': '叶咲ゆめ',
            '奏瀬なつる': '紗也いつか',
            'くさのまり': 'かなたいおり',
            '夏向ここの': '寺田ここの',
            'かなた美緒': '舞雪',
            '奏はる': '小春',
            '夏川未来': '小春',
            '小春(ギャルナン)': '小春',
            '白石みお': 'かなで自由',
            '柊りん': '我那覇レイ',
            '要ゆうな': '百永さりな',
            '黒川さりな': '百永さりな',
            '黒川サリナ': '百永さりな',
            '桜美ゆきな': '叶芽ゆきな',
            '新山里緒奈': '要里緒菜',
            '金森美奈': '里崎あかね',
            '金島裕子': '清峰綾香',
            '金城愛菜': '柚木彩華(2013)',
            '金杉里織': '和田百美花',
            '叶綾子': '宝田さゆり',
            '霧島ゆかり': '宝田さゆり',
            '叶あん': '沢木えりか',
            '城野絵里香': '沢木えりか',
            '城野絵理香': '沢木えりか',
            '松雪杏奈': '沢木えりか',
            '本条アンナ': '沢木えりか',
            '加納栞': '白鳥寿美礼',
            '管野しずか': '神納花',
            '奏音': '美波奏音',
            '栗原葵': '花穂',
            '上川星空': '天馬ゆい',
            '神木あゆむ': '水城唯',
            '宮瀬凛': '水城唯',
            '神木まほろ': '黒川晴美',
            '神坂ひなの': '神野ひな',
            '唯川千尋': '神咲まい',
            '神嶋江梨子': '高崎紗良',
            '三浦芽依': '上条めぐ',
            '上條ゆり香': '上篠ゆり香',
            '藤田ミコル': '上篠ゆり香',
            '神代にな': '浜崎みくる',
            '河合瑠華': '神野はづき',
            '神谷さつき': '神山なな',
            '速水美桜': '神山なな',
            '河合玲': '神山杏奈',
            '坂崎まお': '神山杏奈',
            '神山実': '西野はる',
            '古瀬あいみ': '神山優希',
            '神山るい': '神山涙',
            '神谷裕子': '広瀬奏',
            '香山亜衣': '白石みき',
            '加山なつ子': '加山なつこ',
            '果山ゆら': '西条沙羅',
            '烏丸まどか': '松川薫子',
            '夢咲かのん': '水谷杏',
            '河合亜美': 'あいみ沙希',
            '可愛杏里': '河愛杏里',
            '河合杏里': '河愛杏里',
            '水咲りん': '河愛杏里',
            '最上晶': '河合千里',
            '西条恋': '河合千里',
            'ののか': '河合ののか',
            'かわいまゆ': '可愛まゆ',
            '姫野みこと': '川合まゆ',
            '川澄まい': '川合まゆ',
            '若葉ひより': '可愛りん',
            '川内董': '川内薫',
            '川上あき': 'ひなたりこ',
            '森野雫': '川上ゆう',
            '平野蒼': '河北麻衣',
            '沢北みなみ': '川北メイサ',
            '河北りおな': '早川美優',
            '宮本菜々花': '川口さくら',
            '川崎ゆい': '川越ゆい',
            '鳴海すず(2013)': '川越ゆい',
            '結城恋': '川崎紀里恵',
            '朽木乙葉': '川崎紀里恵',
            '雪平あい': '川嶋あみ',
            '川島めぐみ': '五十嵐しのぶ',
            '川嶋ゆきえ': '京野美沙',
            '芹沢あづさ': '京野美沙',
            '川瀬麻衣': '聖ひばり',
            '瀬名ありさ': '聖ひばり',
            '舞川セナ': '聖ひばり',
            '舞原聖': '聖ひばり',
            '川田みはる': '三田杏',
            '河東実里': '河南実里',
            '川奈あいり': '堀越麻央',
            '前田はるか': '川奈亜希',
            '川奈まい': '有紀かな',
            '川奈まり': '有紀かな',
            '川並舞夏': '早川伊織',
            '川原あゆみ': '摘津蜜',
            '吹雪しおり': '花岡よし乃',
            '川原まな': '篠崎ゆう',
            '河原美咲': '川原美咲',
            '黒沢那智': '川峰さくら',
            '高木礼子': '菅野美幸',
            '月元あや華': '神咲紗々',
            '仲里かすみ': '神崎モカ',
            '神崎レオナ': '七瀬かすみ',
            '神田心美': '神田心愛',
            '神田光': '伊東エリ',
            '神田ほのか': '黒瀬ノア',
            '神田美穂': '石倉えいみ',
            '柑南るか': '岬澪',
            'ななせ麻衣': '菅野紗世',
            '菅野しずか': '神納花',
            '菅野すみれ': '桜井ゆり',
            '櫻井ゆり': '桜井ゆり',
            '吉瀬菜々子': '甘乃つばき',
            '里中結衣': '菅野みいな',
            '菅野みなみ': '小牧七菜',
            '菅野ゆい': '茅ヶ崎りおん',
            '椎名茉友': '茅ヶ崎りおん',
            '神原あいる': '柚川絵美里',
            '桔梗和子': '汝鳥すみか',
            '菊川まり': '菊川麻里',
            '菊川みつ葉': 'みつ葉',
            '葉山夏菜': 'みつ葉',
            '本庄ひな': 'みつ葉',
            '菊池朱里': '白戸まい',
            '菊池ひなの': '前田のの',
            '樹咲ねむ': '辻井ゆう',
            '木崎レナ': '宮瀬ひなみ',
            '如月小雪': '宮本紗央里',
            '如月ジュリ': '桜井レイラ',
            '如月ましろ': '森川ひな',
            '岸杏南': '白川みなみ',
            '真木めぐみ': '白川みなみ',
            '岸ちよの': '桜ちなみ',
            '森絵莉香': '木島亜希',
            '木島すみれ': '瀬戸すみれ',
            '立花ゆずき': '岸本舞',
            '七瀬優希': '希志優希',
            '北井杏樹': '西園さくや',
            '南真美': '北浦真美',
            '喜多方涼': '福山美佳',
            '園田ゆりあ': '北川エリカ',
            '園田ユリア': '北川エリカ',
            '西野なみ': '北川カナ',
            '北川友里絵': '北川千尋',
            '北川舞': '牧野遥',
            '北川真帆': '深田ゆめ',
            '桜木さやな': '深田ゆめ',
            '永倉せな': '深田ゆめ',
            '高瀬遥': '北川真由香',
            '姫川礼子': '北川礼子',
            '北島クリスティーン': 'クリスティーン北島',
            '喜多嶋未来': '藤崎エリナ',
            '高崎なる美': '北園梓',
            '前田窓花': '北園梓',
            '北園由香利': '福山いろは',
            '杉山あゆみ': '福山いろは',
            '北田優歩': '立花もえ',
            '北野リカ': '南野リカ',
            '北原夏海': '北原夏美',
            '北原まどか': '未果美彩',
            '北見ゆみ': '有馬ひかり',
            '北山悠': '須崎美羽',
            '吉瀬沙耶': '水澤りの',
            '堤恵莉那': '水澤りの',
            '牧瀬れい': '吉瀬ルナ',
            '希月瞳美': '柚木楓',
            '沢田あけみ': '木戸雅江',
            '三葉優花': '木南ほのか',
            '木下キキ': '小泉キキ',
            '花沢ひまり': '木下ひまり',
            '木下メアリージュン': '月城キラ',
            '大我': '月城キラ',
            '貴船尋乃': '多田淳子',
            '君色華奈': '君色花音',
            '涼美ほのか': '君色花音',
            '橘知花': '君色花音',
            '来栖みさ': 'きみお美央',
            '君嶋真由': '百式あおい',
            '山内友紀': '百式あおい',
            'きみの歩美': 'きみと歩実',
            '夢野ひなた': '君野由奈',
            '平山みな': '木村マイ',
            '神野雅子': '木村真子',
            '柊早矢': '樹本つばさ',
            '美咲ゆりあ': '樹本つばさ',
            'キャバ夢': '砂原夢',
            '杏花みれい': '杏花レイミ',
            '京花萌': '立花めい',
            '星名リア': '経堂里穂',
            '京野ゆめ': '原千草',
            '清瀬文香': '白藤ゆりえ',
            '竹下あや': '清瀬怜',
            '清原なのは': '双葉くるみ',
            '清原りょう 2': '清原りょう',
            '清宮飛鳥': '宝生めい',
            '明望萌衣': '宝生めい',
            '裕木まゆ': '吉良いろは',
            '桐島明日香': '町村あんな',
            '霧島あんな': '佐伯実里',
            '桃井れお': '霧島かほ',
            '猫宮みけ': '霧島かほ',
            '霧島冴子': '桐島冴子',
            '朔葉あすか': '霧島さくら',
            '樋口冴子': '桐島千沙',
            '笹本みほ': '桐條紗綾',
            '森はるら': '桐條紗綾',
            '桐谷あや': '日高結愛',
            '桐谷雪菜': '悠木ユリカ',
            '桐乃みくに': '桐乃みく',
            '百田まゆか': '桐原さとみ',
            '桐山結羽': '桐香ゆうり',
            '東条美麗': '金城美麗',
            '久遠ユリ': '米田友花',
            '久遠れいら': '葉月レイラ',
            '美らかのん': '久我かのん',
            '七瀬りん': '楠セナ',
            '楠木はるか': '山川ゆな',
            '工藤紗希': '園咲杏里',
            '由紀貴子': '宮藤さやか',
            '工藤まなみ': '永野つかさ',
            '工藤ルナ': '永原ゆい',
            '宮藤レイコ': '神谷さき',
            '椚ゆあ': '桜田ゆあ',
            '深田みお': '桜田ゆあ',
            '久保田結衣': '森永久留美',
            '久保麗子': 'YANAMO',
            '相楽杏': '熊川まき',
            '岬リサ': '熊田夏樹',
            '倉木小夜': '初島静香',
            '村上美咲': '初島静香',
            '倉木ひな': '牧瀬みさ',
            '倉希マイヤ': '三浦涼花',
            '倉木ゆかり': '倉木ゆりか',
            '倉沢優': '紫月',
            '倉科もえ': '藤崎萌',
            '倉田アンナ': '椎名のあ',
            '倉野遥': '高梨りの',
            '前園ゆり': '高梨りの',
            '倉馬ちよ': '佐々木ひな',
            '藤川れいな': '倉持茜',
            '椎名いくみ': '倉持茜',
            '倉持結愛': '桃瀬友梨奈',
            'ゆいの': '桃瀬友梨奈',
            '倉持りん': '望月さくら',
            '栗生しほ': '百合華',
            '千野すみれ': '百合華',
            'リア': '栗栖リア',
            '来栖めい': '栗田めい',
            '設楽ゆうひ': '栗宮ふたば',
            '広瀬しおり': '栗山朋香',
            '久留生れむ': '桃山もえか',
            '来栖ケイト': '朝丘未久',
            '森乃このみ': '来栖ひなた',
            '心乃ひまり': '来栖まゆ',
            '栗田めい': '来栖めい',
            '来栖由衣': '日和ももか',
            '白石めい': '日和ももか',
            'sena': '来栖ゆう',
            '鷹宮ゆい': '来まえび',
            '三好りいな': '胡桃まこ',
            '胡桃まどか': '高美はるか',
            '真中いずみ': '黒岩まこと',
            '篠原ななみ': '黒江ユリ',
            '高宮まどか': '黒川珠美',
            '黒木晶': '黒木昌',
            '黒木綾乃': '黒澤愛希',
            '黒木歩': '宮村恋',
            '黒木いちか': '東条かれん',
            '黒木小夜子': '美山蘭子',
            '秀吉小夜子': '美山蘭子',
            '黒木麻衣': '花野真衣',
            '雷電マオ': '黒木澪',
            '黒木ルナ': '小坂あむ',
            '黒崎かのん': '八乙女なな',
            '黒崎潤': '四ツ葉あおい',
            '近藤すみか': '桜木かおり',
            '桜木かおり': '近藤すみか',
            '黒崎萌華': '黒田麻世',
            '若槻朱音': '黒田麻世',
            '桜井つばさ': '黒崎れいな',
            '黒沢まりあ': '七海りあ',
            '黒澤雪': '春谷美雨',
            '黒澤ルナ': '黒沢ルナ',
            '中川絢音': '黒田晶子',
            '伊原詩織': '黒谷りょうこ',
            '和田ゆり子': '黒田ユリ',
            '米倉茜': '黒宮えいみ',
            '小池千夏': '千秋夕',
            '前島絵菜': '小池奈央',
            '小池ひとみ': 'nao.',
            '小泉彩': '里美ゆりあ',
            '小泉ありさ': '石原こと',
            '小泉ウサギ': '宮下まい',
            '小泉ミツカ': '水沢杏香',
            '小泉ミツキ': '水沢杏香',
            '小泉優子': '沢木澪',
            '高坂亜由美': '百花',
            '香坂澪': '風谷音緒',
            '香坂美優': 'みずほゆき',
            '幸田ユマ': '藤波さとり',
            '香田美子': '中山穂香',
            '笠原美咲': '中山穂香',
            '矢田里奈': '光月まや',
            '小枝ゆづ希': '長谷川美裸',
            '黄金むぎ': '舞坂仁美',
            '国生亜弥': '高瀬智香',
            '咲水香苗': '国生みさき',
            '豊田潤菜': '小暮まり',
            'coco@': '夏希のあ',
            '芹那': 'COCONA',
            '小衣くるみ': '芹沢ゆい',
            '小咲みお': '檸檬.',
            '小司あん': '平子知歌',
            '越川アメリ': '星月れお',
            '小嶋亜美': '根尾あかり',
            '小嶋紗由美': '植田陽菜',
            '小嶋純菜': '小嶋ジュンナ',
            '小嶋ひより': '元山はるか',
            '小島優花': '星海レイカ',
            '小島ゆな': '星乃せり',
            '小嶋りの': '鈴森きらり',
            '本多由奈': '鈴森きらり',
            '小嶋瑠璃': '間宮つくし',
            '皆瀬ふう花': '小滝みい菜',
            '藤永風華': '小滝みい菜',
            '武居静香': '東風かえで',
            '後藤あずさ': '後藤あづさ',
            '深見らん': '琴音芽衣',
            '琴音るい': '栗衣みい',
            '花田静香': 'ことみ',
            '木ノ瀬苺莉': '三好亜矢',
            '木ノ花あみる': '篠原優',
            'このは結衣': '穂花まりえ',
            'このみあん': '杏',
            '小羽なるみ': '西山あさひ',
            '小羽莉奈': '子羽莉奈',
            '小林麻子': '畑中美雪',
            '小林佳代子': '小池絵美子',
            '小林真保': '日南まつり',
            '小林芽衣': '桜木美央',
            '真希瀬るな': '小林るな',
            'こはる': '桜こはる',
            '葉月涼子': '小日向郁美',
            '田代加奈': '小日向優',
            '小松理沙子': '日和香澄',
            '小美川まゆ': '和夜ゆら',
            '小峰ひなた': '羽生ありさ',
            '羽生アリサ': '羽生ありさ',
            '小峰みこ': '桐山凛果',
            '橘ゆめみ': '小向まき',
            '小室優奈': '若林美保',
            '若林美穂': '若林美保',
            'みくり': '小森もも',
            '小柳まりん': '西野花梨',
            '椎名くるみ': '西野花梨',
            '小谷野まゆ': '藤川菜緒',
            '黒咲みづえ': '桜木かおり',
            '近藤ユキ': '松井レナ',
            '近藤れおな': '立浪花恋',
            '今野あかり': '未来ひかり',
            '今野つばき': '佐伯春菜',
            '二宮莉央': '佐伯春菜',
            '平山加奈': '佐伯春菜',
            '柚木和奏': '紺野まこ',
            '今野由美子': '前沢小百合',
            '西園寺美緒': '森下美緒',
            '西園寺ミヅキ': '白金れい奈',
            '杉崎えま': '白金れい奈',
            '西城柊香': '東條有希',
            '西篠カレン': '西條カレン',
            '萌木れいな': '西條カレン',
            '斉藤ヒナ': '星野ひびき',
            '斉藤ひな': '星野ひびき',
            '斉藤りこ': '佐藤りこ',
            '夏海ニコ': '佐藤りこ',
            '夏川うみ': '佐藤りこ',
            '水原薫子': '佐伯かのん',
            '佐伯かれん': '冴君麻衣子',
            '吉澤ひかり': '冴君麻衣子',
            '佐伯奈々 2': '佐伯奈々',
            '佐伯舞香': '乃木ののか',
            '長谷川柚月': '乃木ののか',
            '三枝あおい': '早乙女夏菜',
            '七草ちとせ': '夕季ちとせ',
            '由來ちとせ': '夕季ちとせ',
            '冴島まゆ': '夏海花凛',
            '冴月紗奈': '麻衣音まいみ',
            '松本亜璃沙': '早乙女ありさ',
            '五月女千夏': '松島侑子',
            '美保ゆうき': '酒井杏里',
            '坂井絵里奈': '宮野ゆかな',
            '酒井京香': '七瀬ひとみ',
            '酒井京子': '七瀬ひとみ',
            '樋口佳代': '七瀬ひとみ',
            '藤里涼子': '七瀬ひとみ',
            '堺希美': '藤本ゆうり',
            'MOMOKA': '酒井ももか',
            '宮原えりな': '酒井莉乃',
            '酒井るんな': '舞咲璃',
            '満島ノエル': '舞咲璃',
            '南ナミ': '坂上友香',
            '高谷さつき': '榊なち',
            '藤川美麗': '榊美鈴',
            '坂口みほの': '坂咲みほ',
            '仲本まいか': '坂下えみ',
            '坂下ゆあ': '涼城りおな',
            '佐賀ほのか': '天宮まりる',
            '坂巻あずさ': '涼乃はる',
            '坂道みる': 'miru',
            '坂本亜美': '小嶋世奈',
            '坂本さやか': '海乃うた',
            '坂本すみほ': '坂本ほのか',
            '橘蓮': '坂本すみれ',
            '田宮もなか': '佐川はるみ',
            '紗木あいみ': '柚木めい',
            '咲田ありな': 'なつめ愛莉',
            '咲田うらら': '夢夏まなつ',
            '咲羽マリン': '咲羽まりん',
            '咲原静香': '木ノ上露乃',
            '美里このみ': '咲本はるか',
            '真白るい': '紗霧ひなた',
            '宮藤ゆみな': '紗霧ひなた',
            '春菜まき': '朔田美優',
            '掘ななか': '朔田美優',
            '山咲まなつ': '朔田美優',
            '咲乃柑菜': '蘭華',
            '由良まりの': '咲乃にいな',
            'さくらここる': '桜夜まよい',
            '名波かのん': '桜夜まよい',
            'さくら': '鈴ノ木桜',
            '土方さくら': 'さくら葵',
            '高城アミナ': '桜アン',
            '柚木みあ': '咲楽アンナ',
            '桜井麻乃': 'さくらい麻乃',
            '松本みなみ': 'さくらい麻乃',
            '桜井えむ': '星沢みのり',
            '櫻井なつき': '牧瀬愛',
            '高宮菜々子': '櫻井菜々子',
            '櫻井ののか': '七瀬かのん',
            '桜井桃華': '聖星姫花',
            '椿原みゆ': '桜井ゆみ',
            '桜内かれん': '高野しずか',
            'さくら乙葉': '若葉ひな',
            '空川みらい': '桜川かなこ',
            '真心実': '桜木えり',
            '桜木エリナ': '新川優衣',
            '桜木真音': '間宮純',
            '桜木蘭': '吉岡寧々',
            '櫻木梨乃': '真名瀬りか',
            '葉月めぐ': '真名瀬りか',
            '冬月ひかる': '真名瀬りか',
            '玲夏': '桜小雪',
            'ももかさくら': '桜咲ひな',
            '桜瀬ありな': '星崎亜耶',
            '仲本紗代': '桜瀬奈',
            '桜田みつ葉': '三田友梨那',
            '桜ちづる': '桜ちずる',
            'ちなみん': '桜ちなみ',
            '三浦直緒': 'さくらの',
            '桜のえる': '柊シエル',
            '星川ひなこ': '桜庭彩(春菜まみ)',
            '桜庭エリカ': '一条命',
            '桜花': '平花',
            '想真花': '平花',
            '白咲なるみ': '桜庭舞香',
            '紗倉ひなの': '南ゆず',
            '成瀬くるみ': '南ゆず',
            '櫻美雪': 'さくらみゆき',
            'みゆき菜々子': 'さくらみゆき',
            '藤みゆき': 'さくらみゆき',
            'さくら萠': 'さくら萌',
            'さくらもも': '葵うさぎ',
            '星あいな': 'さくら柚希',
            '佐倉由美子': '竹内れい子',
            '佐々木さいか': '佐々波りの',
            '佐々木ひなこ': '汐見唯',
            '向井恋': '佐々木恋海',
            '松田ゆめな': '佐々波エリカ',
            '笹宮えれな': '葉月シュリ',
            '結白まさき': '葉月シュリ',
            'MASAKI': '葉月シュリ',
            'さちのうた': '椎菜アリス',
            '水沢久美': '五月峰子',
            'さつき百合': '砂月ゆり',
            '花桃うさぎ': '皐月りぼん',
            '紗藤あゆ': '紗藤まゆ',
            '紗東みお': '紗藤まゆ',
            '佐藤くるみ': '新山ゆきみ',
            '成宮あいり': 'さとう純奈',
            '佐藤みき': '佐藤美紀',
            'さとうみつ': '桃井杏南',
            '田中志乃': '桃井杏南',
            '七草まつり': '桃井杏南',
            '茉莉もも': '桃井杏南',
            '水野ふうか': '桃井杏南',
            '桃井アンナ': '桃井杏南',
            '結々萌奈実': '佐藤ゆか',
            'さとうゆも': 'ひまりみお',
            '須田くるみ': '沙藤ユリ',
            '日向うみ': '沙藤ユリ',
            '里崎マリヤ': '山崎まりあ',
            '里中あきな': '持田百恵',
            '里見まゆ': '里美まゆ',
            '里谷あい': '成宮いろは',
            '辺見麻衣': '成宮いろは',
            '真田琴': '佐野ひなた',
            '優月りの': '佐野ひなた',
            '真田さな': '真田みづ稀',
            '真田美樹': '真田みづ稀',
            '真田レイラ': '三上香里菜',
            '山本エリカ': '佐野ゆま',
            'SAYA': '沙耶',
            '佐山麗子': '竹内美緒',
            '摩耶しぐれ': '竹内美緒',
            '更科莉愛': '七瀬こころ',
            '白雪るあ': '七瀬こころ',
            '初音杏果': '七瀬こころ',
            '仲村えれな': 'サリー',
            '結城ありさ': 'サリー',
            '北川千尋': '北川友里絵',
            '椿のぞみ': '沢田あいり',
            '沢渡紗織': '小池絵美子',
            '澤村真衣': '夏樹りおん',
            '高坂保奈美': '澤村レイコ',
            '三浦アイラ': 'サントス・A・ビアーナ',
            '七海光': '椎木くるみ',
            '星宮あかり': '椎木くるみ',
            '椎名綾': '若菜あゆみ(人妻)',
            '若菜綾': '若菜あゆみ(人妻)',
            '椎名いずみ': '西田琴音',
            '椎葉える': '椎菜える',
            '神美': '椎名カノン',
            '椎奈さら': '和登こころ',
            '椎奈つばめ': '鈴夏ゆらん',
            '西島えり': '椎名はる',
            '椎名ひかる': '羽川るな',
            '椎名めろ': '藤沢りん',
            '椎名優': '向井杏',
            '椎名りく 2': '椎名りく',
            '椎名りりこ': '杉原さとみ',
            '橘花音': '杉原さとみ',
            '藤原エリカ': '椎谷愛結',
            'Shelly': '藤井シェリー',
            '汐河佳奈': '葵紫穂',
            '嗣永さゆみ': '詩音乃らん',
            '夏来みあ': '重盛ひと美',
            '夏希みあ': '重盛ひと美',
            'しじみ': '持田茜',
            'しずく': '初美沙希',
            '雫月こと': '姫野あみゅ',
            '雫みあ': '水樹くるみ',
            '篠乃なつき': '春永いずみ',
            '篠崎りあ': '陽菜りお',
            '篠田れいこ': '宮川ありさ',
            '篠原飛鳥': '藤咲飛鳥',
            '三浦加奈': '篠原リョウ',
            '白川まお': '成海夏季',
            '高柳美姫': '成海夏季',
            '渚澤のあ': '四ノ宮結',
            '柴崎みく': '柴咲みく',
            '本田美沙': '柴咲ゆうり',
            '広崎彩': '柴咲りお',
            '広崎愛弥': '柴咲りお',
            'シビル松田': '百瀬乃々花',
            '御坂恵衣': '島崎星羅',
            '島崎佳恵': '滝川玲美',
            '島崎りか': '月乃ルナ',
            '美幸ありす': '月乃ルナ',
            'るな': '霜月るな',
            '周思雨': '林美玲',
            '福盛千夏': '純真かれん',
            '純奈かなえ': '永作ゆう美',
            '竹内かすみ': '庄司ゆり奈',
            '翔田千里 2': '翔田千里',
            '白石さゆり': '北条麻妃',
            '白石なお': '藤野ルミ',
            '白石みさと': '衣川音寧',
            '寺川恵': '白石蓮',
            '白川麻衣': '英しずな',
            '中村日咲': '英しずな',
            '白川由香里': '白川ゆかり',
            '竹内順子': '白河雪乃',
            '八神未来': '白咲かんな',
            '宮野えみ': '白咲ちえ',
            '高嶋加奈': '白咲奈々子',
            '羽月ミリア': '白咲奈々子',
            '白咲美羽': '白咲未羽',
            '白鳥美智子': '真下ちづる',
            '二本木百合': '真下ちづる',
            '白雪麻衣': '中村日咲',
            '白百合姫': '美月ゆり',
            '羽幌ありさ': '城石真希',
            '城石美紗': '長谷川聖那',
            '夏川さやか': '白咲花',
            '白咲まりあ': '御園さよ',
            '白村朱里': '御園さよ',
            '白咲未羽': '橋本菜々',
            '立花瑠莉': '白咲りの',
            '白瀬ななみ': '春埼めい',
            '田中まい': '城田アンナ',
            '白花めんま': '白花のん',
            '白間奈央': '白間れおな',
            '心': '遠藤瀬梨那',
            '神宮寺カレン': '鈴木みか',
            '高良ゆり': '新庄小百合',
            '仙道春奈': '新城みなみ',
            '山内舞': '進藤有沙',
            '新堂有望': '中谷有希',
            '進藤理沙': '進藤理紗',
            '藤咲サラ': '新波リア',
            '菅井はづき': '結城かずは',
            '菅谷もも': '由紀なつき',
            '須川結月': '中山尚美',
            '若菜めあり': '菅原恵麻',
            '菅原貴美依': '植草愛',
            '葉山みなみ': '杉浦美由',
            '杉咲しずか': '梨杏なつ',
            '宮田鈴子': '原みつ江',
            'ひかり(REC)': '杉咲玲奈',
            '千野美帆': '杉田わか',
            'みずはら美里': 'すぎはら美里',
            '涼花': '涼南佳奈',
            '涼風杏': '沖田里緒',
            '涼風えみ': '前乃菜々',
            '桃原茜': '涼川えいみ',
            '鈴木あいり': '松井加奈',
            '鈴木彩': '高村潤',
            '鈴木きあら': '平清香',
            '愛加あみ': '平清香',
            '美空あいり': '平清香',
            '鈴木茶緒': '鈴木茶織',
            '鈴木理沙': '三浦かなみ',
            '鈴木梨奈': '高城彩',
            '高梨美緒': '高城彩',
            '鈴木りりか': 'すずきりりか',
            '鈴木凛々': '早坂あずき',
            '鈴仲いずみ': '福原サヤカ',
            '七星なな': '涼南佳奈',
            '鈴音かな': '金子きい',
            '涼宮こなた': '沙月由奈',
            '鈴村みなみ': '柚木ひおり',
            '横井かおる': '須藤紀子',
            '熊野あゆ': '澄川鮎',
            '澄川万葉': '優希絵理奈',
            '優希エリナ': '優希絵理奈',
            '本宮杏珠': '住田みく',
            '皆町しずく': '住田みく',
            '百合野もも': 'Sumire',
            '谷口瑞穂': '都留矢セシル',
            '瀬田奏恵': '松岡香純',
            '瀬戸内ゆい': '天音れいあ',
            '瀬戸ゆう': '日比乃さとみ',
            '瀬奈明日香': '井川あいな',
            '光本小百合': '瀬名ひかり',
            '芹沢かのん': '舞希香',
            '芹沢こころ': '遠藤瀬梨那',
            '芹沢さくら': '本澤朋美',
            '芹沢りあ': '皐月ララ',
            '芹菜ひなた': '沙月由奈',
            '妃奈瀬うみ': '芹奈りく',
            '千寿まゆ': '松沢薫',
            '山岸ゆり': '松沢薫',
            '黛まゆ': '松沢薫',
            '新城みなみ': '仙道春奈',
            '小鳥遊はる': '千星はるか',
            '園崎美弥': '美原咲子',
            '園田ルル': '玉川ルル',
            '祐花凛': '玉川ルル',
            'ラン・レイ': '玉川ルル',
            '園原真央': '夏海いく',
            'みづのみう': '夏海いく',
            'そらのゆめ': '間宮ココ',
            '大門あずさ': '眞木あずさ',
            '高井あかり': '宮下結莉',
            '高岡美鈴': '原花音',
            '高岡リョウ': '翼裕香',
            '玉木ちな': '高木愛美',
            '玉森ななみ': '高木愛美',
            '新美さくら': '高木愛美',
            '高崎聖子': '高橋しょう子',
            '高崎なるみ': '北園梓',
            '湯川美智子': '高嶋杏子',
            '高嶋祥子': '高島奈津美',
            '高城紗香': '峰岸深雪',
            '高田美紗': '高田美沙',
            '高田美遊': '木下若菜',
            '高槻める': '野々宮める',
            '柚樹なな': '野々宮める',
            '峰岸まおみ': '高槻れい',
            '高梨瞳': '高梨ひとみ',
            '小鳥遊りか': '長澤ルナ',
            '高梨れいな': '星野あいか',
            '高野楓': '尾野真知子',
            '春乃いのり': '高野しずか',
            '中田くるみ': '高野しずか',
            '高橋愛那': '武藤つぐみ',
            '高橋しずく': '冨安れおな',
            '高橋美園': '徳山翔子',
            '高橋りこ': '今井絵理',
            '高平かすみ': '三ツ矢ゆかり',
            '高嶺宇海': '理々香',
            '高嶺みりあ': '牧野絵里',
            '滝川穂乃果': '滝川穗乃果',
            '滝口萌果': '星咲結花',
            '長谷川りさ': '滝沢ななお',
            '新田みのり': '滝沢ななお',
            '九十九メイ': '滝沢ななお',
            '悠月舞': '瀧澤まい',
            '滝沢悠': '結輝レイ',
            '滝沢れい': '滝澤れい',
            '藤本リーナ': '滝本エレナ',
            '村上里沙': '竹内紗里奈',
            '竹内しずか': '星奈あい',
            '水谷まこ': '竹内真琴',
            '竹内梨恵': '羽鳥澄香',
            '竹内るい': '百瀬あいり',
            '竹下なな': '松永雪子',
            '竹下ななみ': '山本蓮加',
            '武田エレナ': '夏目みらい',
            '藤白桃羽': '武田真',
            '水月りつ': '武田真',
            '藤堂明美': '保坂友利子',
            '田島綾子': '桐岡さつき',
            '橘アイリ': '早川メアリー',
            '橘亜希': 'みやび真央',
            '立花彩': '水希杏',
            '渡瀬のぞみ': '立花かすみ',
            '橘奏海': '三ツ星ひかる',
            '立花千尋': '音原恭子',
            '並木るか': '橘ひな',
            '日向あいり': '橘優花',
            '橘ゆめ': 'さくらゆめ',
            '小向まき': '橘ゆめみ',
            '細川まり': '立岡杏菜',
            '田中かりな': '春香みか',
            '牧瀬りみ': '春香みか',
            '菜菜美ねい': '田中美久',
            '田中美保': '綾瀬桃子',
            '遠山ひろ': 'たなか唯',
            '藤咲エレン': '谷あづさ',
            '谷崎鈴': '深雪つばさ',
            '玉乃愛彩': '本庄ありさ',
            '田村のぶえ': '吉永香織',
            '七瀬未悠': '丹羽すみれ',
            '茅ヶ崎ありす': '百合川さら',
            '茅ヶ崎リサ': '小桜沙樹',
            '乳咲杏': '美国沙耶',
            'ちゃんるな': 'はぴまる',
            'ツァン・リー': '杉山みさと',
            '塚本明奈': '希望光',
            'つかもと友希': '牧本千幸',
            '円夢': '月丘雅',
            '月咲心愛': '姫乃杏樹',
            '東條千咲': '月咲すずね',
            '雪美えみる': '月島えみり',
            '結夜': '月島えみり',
            '月島れん': '七星くる',
            '松島ひな': '月城ひとみ',
            '月城らん': '姫川ゆうな',
            '月野こころ': '羽月都花沙',
            '葉山こころ': '羽月都花沙',
            '次原みな': '湖南みるく',
            'みさきみさ': '月見芹菜',
            '結月せいら': '月宮こはる',
            '夏果': '月本衣織',
            '葉月るい': '桃井りん',
            'Ryo': '辻本りょう',
            '土田さやか': '七海ゆあ',
            '紬りお': '雪乃凛央',
            '聖璃とあ': '露梨あやせ',
            '富永麻衣子': '松岡里英',
            'つるのゆう': '細谷美紀',
            '手島くるみ': '手島知世',
            '寺崎悠子': '柊かえで',
            '早川なお': '柊かえで',
            '寺島志保': '大森あづさ',
            '本田綾乃': '寺田志乃',
            '桃愛ゆえ': 'のあういか',
            '東城ななせ': '永原なつき',
            '東条ゆう': '三井倉菜結',
            '東條麗美': '満嶋陽子',
            '遠野唯': '山地せな',
            '森下こずえ': '時田こずえ',
            '若菜めい': '時田あいみ',
            '真鍋千枝美': '時任明菜',
            '吉木まな美': '藤咲紫',
            '戸田さつき': '美里愛',
            '美浦あや': '富井美帆',
            '富野伊織': 'とみの伊織',
            '富野まき': '紗藤まゆ',
            '友田真希2': '友田真希',
            '友田真希3': '友田真希',
            '友田真希4': '友田真希',
            '小暮まり': '豊田潤菜',
            '彩葉みおり': '豊田愛菜',
            '鳥希はな': '鳥越はな',
            '鳥越乃亜': '乃亜',
            '内藤美咲': '美玲',
            '永井千里': '穂積すず',
            '中川純': '藤代愛理',
            '中川美鈴': '葉山瞳',
            '仲里紗羽': '本田莉子',
            '中里美穂': '三好凪',
            '中里みほ': '三好凪',
            '長澤純': '長沢純',
            '水澤まお': '永沢まおみ',
            '桃瀬かえで': '長沢真美',
            '葉月サラ': '長澤都',
            '梨々花': '長澤りか',
            '真木彩乃': '中島美和',
            '長瀬葵': '松浦亜美',
            '永瀬あき 2': '永瀬あき',
            'みなみ瀬奈': '永瀬あき',
            '本山まい': '七瀬かれん',
            '中瀬のぞみ': '千夏麗',
            '水谷彩也加': '長瀬麻美',
            '永瀬りな': '成川芽衣',
            '中谷つかさ': '中谷りさ',
            '中谷響': '米津響',
            '永田莉雨': '仲野梢',
            '間宮なつみ': '永野愛華',
            '観月 優': '中野すず',
            '中野ゆり': '可愛まゆ',
            '藤本もえ': '長濱もも',
            '夏原カレン': '仲間明日香',
            '永峰朋美': '安岡たまき',
            '中村ここね': '水沢美心',
            '中村しおん': '長谷川さや香',
            '中村シノ': '美杉あすか',
            '英しずな': '白川麻衣',
            '水城静来': '仲村茉莉恵',
            '中村梨乃': '夏木しずく',
            '中森彩': '優木しの',
            '渚ひかる': '夏目葵',
            '渚まどか': '山本千紘',
            '渚由美': '陽多まり',
            '春海れな': '菜色麻由',
            '夏川エリカ': '藤本紫媛',
            '夏川遥': '藤本紫媛',
            '夏川ゆず': '本城茜',
            '夏川莉乃': '前田ちえ',
            '夏希アンジュ': '夏川るい',
            'NATSUKI': '南なつき',
            '夏姫': '南なつき',
            '美風藍': '南なつき',
            '夏希': '夏希みなみ',
            '菜月さな': '春菜あいり',
            '夏希みな': '葛木りむ',
            'なつきめぐ': '鳥谷ことり',
            '菜月もえ': '菜月もな',
            '夏木桃香': '並木りさ',
            '真仲涼音': '奈津音秋帆',
            '夏乃向日葵': '桐乃向日葵',
            '蓮見あやか': '夏海碧',
            '夏海エリカ': '三咲エリナ',
            '原更紗': '夏目彩春',
            '七色あん': '乃々果花',
            '七咲みいろ': '百咲みいろ',
            '七瀬かれん': '本山まい',
            '丸山ももか': '七星くるみ',
            '七瀬ひな': '七海ひな',
            '諸星まりる': '七瀬ひなた',
            '村上かな': '七瀬まい(熟女)',
            '羽田未来': '七瀬ゆい',
            '若槻はるな': '七瀬ゆい',
            '七瀬リナ': '神田るみ',
            '速水るな': '七碧のあ',
            '本多ちひろ': '七海ゆあ',
            '星野彩(2021)': '七海祐希',
            '七海りこ': '水瀬姫香',
            '七海りな': '三村紗枝',
            '七海れい': '成宮優',
            '鳴海さやか': '成海さやか',
            '仁奈るあ': '成海さやか',
            '成宮梓': '前田ななみ',
            '水原乃亜': '成沢きさき',
            '成澤りつ': '森心菜',
            '成海うるみ': '麻里梨夏',
            '渡辺絵里奈': '成海華音',
            '松井美羽': '鳴海そら',
            '南波杏 2': '南波杏',
            '三上絵理香': '新崎雛子',
            '新田麻里': '花形もえ',
            '新美かりん': '日泉舞香',
            '上坂ゆりこ': '高瀬沙織',
            '新村まり子': '西浦紀香',
            '山口友里恵': '西浦紀香',
            '横井ここみ': '二階堂ゆか',
            '本郷愛': '二階堂夢',
            '藤谷友梨子': '西岡まゆり',
            '西川紗希': '綾女',
            '西木野みはる': '満島みはる',
            '西崎史乃': '吉永有里',
            '西田いずみ': '南せりな',
            '西野なな': '日泉舞香',
            '西野麻衣': '堂島れい',
            '米倉夏弥': '西真奈美',
            '雪奈真冬': '西山楓',
            '西山れな': '桃瀬さくら',
            '西谷美咲': '峰エリ',
            '峰ゆり香': '峰エリ',
            '西脇奈子': '望月雪',
            '新田亜季': '新田亜希',
            '新田あくび': '夢見あくび',
            'ちひろ': '新田ちひろ',
            '二ノ宮すずか': '二の宮すずか',
            '能美ちなつ': '二宮和香',
            'ももき希': 'NIMO',
            '妃月るい': '音琴るい',
            '猫宮さら': '横山ゆりこ',
            '三角美紀子': '根元純',
            '美波あや': '乃木ちはる',
            '野崎ありす': '守永葵',
            '野崎杏': '野々宮あん',
            '希あいり': '川嶋いろは',
            '望実れい': '村瀬玲奈',
            '野田夏実': '田嶋めぐる',
            '野津亜梨紗': '長谷川夏樹',
            '日向ありさ': '野波美伽',
            '野々下クララ': 'みやび真央',
            '星咲みゆ': '野々宮ここみ',
            '宮野瞳': '野々宮ここみ',
            '野々宮のん': '野々宮月乃',
            '野宮さとみ': '野々宮みさと',
            '野原もえ': '仲尾萌香',
            '野原桃花': 'のはらももか',
            '野村あいの': '柚葉リコ',
            '葦月あいの': '柚葉リコ',
            '野村まい': '南祥子',
            '広末みゆ': '野村みゆ',
            '望月美保': '野本京香',
            'あいみ': '橋本美歩',
            '橋本怜奈': '佐々木玲奈(2013)',
            '蓮井うみ': '蓮美なお',
            '蓮美柚香': '藤木紗英',
            '長谷川みく': '長谷川ミク',
            '長谷美玖': '望月ひなこ',
            '雪本芽衣': '葉月可恋',
            '葉月菜穂': '葉月奈穂',
            '吉木美織': '初美ゆりか',
            '桃井 りん': '初芽里奈',
            '花木心優': '花木美優',
            '真鍋まゆ': '花咲えみり',
            '宮間さつき': '花澤りの',
            '八神カレン': '花城れん',
            '牧瀬くらら': '花野マリア',
            '藤花マリ': '花野マリア',
            '星乃レイア': '花宮レイ',
            '宝生優果': '羽野理沙',
            '武藤クレア': '羽野理沙',
            '浜咲恵利': '風祭',
            '浜崎りお 2': '浜崎りお',
            '浜崎りお(雑誌)': '浜崎りお',
            '浜田理丘': '南波ありさ',
            '浜辺みさき': '向日葵',
            '浜辺ももね': '山本あいか',
            '早川さり': '早川沙梨',
            '早川瑞希': '若宮はずき',
            '美月みさと': '早川友里子',
            '本田彩芽': '早川友里子',
            '早坂すみれ': '南乃彩花',
            '早坂めぐ 2': '早坂めぐ',
            '美咲彩芽': '林杏樹',
            '早瀬めぐみ': '早乙女凛',
            '日向舞': '葉山ここみ',
            '葉山美空': '柊木なな',
            '杉浦美由': '葉山みなみ',
            'May': '葉山めい',
            '原田ゆう子': '本間夏子',
            '原羽瑠': '原波瑠',
            'HARUKA': '真田春香',
            'HARUKA(2013)': '坂田もも',
            'はるかみらい': '藤森里穂',
            '前田由美': '藤森里穂',
            '山本しゅり': '藤森里穂',
            '星乃美桜': '春川莉乃',
            '春樹レイ': '伊藤美里',
            '春さくら': '優木さくら',
            '春瀬なお': '赤坂弥生',
            '春名えみ 2': '春名えみ',
            '三木かえで': '榛名みゆき',
            'MOMO': '春野愛',
            'ほしあすか': '春乃なな',
            '星野はるあ': 'はるのるみ',
            '優木あおい': '春妃いぶき',
            '日向セリア': '春本優菜',
            '春山めい': '来栖めい',
            '柊衣織': 'RISA',
            '山梨ゆず': '東尾真子',
            'ヒカル': '宮瀬ヒカル',
            '陽向なの': '陽咲花音',
            '聖あい': '聖あいら',
            '聖まりあ': '柚木せあら',
            '日高ゆりあ 2': '日高ゆりあ',
            '日高ゆりあ 3': '日高ゆりあ',
            '日高ゆりあ 4': '日高ゆりあ',
            '瞳ひかる': '矢野ありさ',
            '若菜ちはる': '矢野ありさ',
            '仁美まどか': '星川凛々花',
            '百瀬凛花': '星川凛々花',
            '藤井すみれ': '瞳りん',
            'HINA': '前田陽菜',
            '森山茜': 'ひなた',
            '水樹香奈': 'ひなた',
            'ひなたいのり': '矢澤美々',
            '日向陽葵': '日向かえで',
            '日向こころ': '餅田ササピリカ',
            '三吉菜々': '日向菜々子',
            '南坂あすか': '日向まい',
            '東杏果': '日向まひる',
            '広瀬みつき': '日向ゆら',
            'Hinano': 'hinano',
            '雛丸': '前田陽菜',
            '森川あみ': '前田陽菜',
            '楪まりか': '雛森みこ',
            '柚木結愛': '日野みこと',
            '響鳴音': '望月なな',
            'まみや羽花': '日々樹梨花',
            'ロビン': '響レミ',
            '姫咲みいな': '姫乃えみり',
            '姫野かんな': '逢月はるな',
            '姫野京香': '嶋崎かすみ',
            '姫乃はる': '池田結愛',
            '姫野まみ': '向井もも',
            '夢咲そら': '姫乃りな',
            '姫宮あかり': '川中まゆか',
            '姫宮すみれ': '岬ひなの',
            '姫村しずく': '坂本ひかり',
            '白夜みくる': '真白みくる',
            '日向小夏': '吉井みな',
            '前嶋美樹': '平川琴菜',
            '平瀬りょう': '名城翠',
            '有季なお': '平手まな',
            '広瀬ゆな': '平山聖花',
            'ひらり': '天希ユリナ',
            '蛭間千沙': '比留間千沙',
            '広末文乃': '沖田里緒',
            '宮沢まき': '広瀬晴子',
            '吉乃桃果': '広瀬麻里',
            '吉川ゆう': '弘千花碧',
            '廣野すみれ': '米崎真理',
            '真崎美里': '吹石れな',
            '吉川みどり': '福田由貴',
            '福山香織': '真波紫乃',
            '福山夏実': '柚本紗希',
            '藤池れみ': '横山みれい',
            'シェリー': '藤井シェリー',
            '藤井らん': '桜井みちる',
            '藤井蘭々': '蜜美杏',
            '藤井リアナ': '百合咲うるみ',
            '藤浦めぐ': 'めぐり',
            '藤江良恵': '藤江由恵',
            '藤江由江': '藤江由恵',
            '美咲礼': '藤岡奈月',
            '結希玲衣': '藤岡奈月',
            '三上夕希': '藤岡奈月',
            '結城玲衣': '藤岡奈月',
            '藤木リナ': '真咲恵美',
            '藤咲あいな': '香坂りな',
            '藤崎彩花': '藤咲美玲',
            '藤咲沙耶': '藤咲美玲',
            '藤原倫子': '藤咲美玲',
            '藤咲セイラ': '万里杏樹',
            '藤咲莉雨': '藤崎莉雨',
            '藤崎りお': '水谷心音',
            '水城亜優': '藤咲リオナ',
            '桃田香織': '藤谷真帆',
            '藤森エレナ': '福原ミイナ',
            '柴咲ゆうり': '本田美沙',
            '藤原京子': '美鈴さゆき',
            '船戸祥子': '横山紗江子',
            '和久井なな': 'ふわりゆうき',
            '和久井ナナ': 'ふわりゆうき',
            '北条あみ': '由紀なつき',
            '北条アミ': '由紀なつき',
            '北条りか': '三浦わかな',
            '宝生リリー': '芽森しずく',
            '星合ひかる': '山下彩香',
            'れえな': '星井あい',
            '諸星エミリー': '星井笑',
            '若林優': '星川なつ',
            '星咲せいら': '星咲セイラ',
            '星咲ひかる': 'meru',
            '星咲マイカ': '観月奏',
            '前田優希': '星咲優菜',
            '星野飛鳥': 'ほしのあすか',
            '星野さくら': '結菜はるか',
            '星乃せあら': '南まりん',
            'ほしの☆つみき': '愛原唯',
            'ほしの菜実恵': '柳留美子',
            '星野ひとみ': '星野瞳',
            '山吹瞳': '星野瞳',
            '星野美咲': '浅見せり',
            '夢咲りお': '星乃水音',
            '星野梨愛': '梨愛',
            '星まりあ': '若月まりあ',
            '星宮にの': '百瀬とあ',
            '星優乃 2': '星優乃',
            'ほのか優': '葵うさぎ',
            '八代眞紀子': '穂村さやか',
            '堀井ミカ': '本山茉莉',
            '堀内美香': '堀内未果子',
            '松下いずみ': '堀北あさみ',
            '堀北七海': '美波瀬奈',
            '堀口奈津美 2': '広瀬奈々美',
            '堀麻美子': '松浦まいこ',
            '八神れおん': '本城さりな',
            '本多翼': '水野朝陽',
            '美作彩凪': '本多成実',
            '柚希つばさ': '本田岬',
            'MEW': 'Maika',
            '前田朋子': '三苫うみ',
            '本村うらら': '三苫うみ',
            'maki': '結まきな',
            '牧野あゆみ': '石川ひかる',
            '牧野小百合': '浅見せり',
            '南菜々': '牧村ひな',
            '真咲さら': '神田ゆりあ',
            '黛あお': '真咲華',
            '松浦楓': 'まさき真',
            '松坂華苗': '真咲凛',
            '真白希美': '真白希実',
            '真白真緒': '三浦るい',
            '真白れいな': '結城蘭',
            '増田かおり': '堂島れい',
            '松岡聖羅': '松岡セイラ',
            '松沢ゆかり': '鮎原いつき',
            '松下なほ': '真希レイラ',
            '松嶋友美': '吉岡愛乃',
            '松嶋真麻': '桃乃木かな',
            '松田千里': '三井さき',
            '松永みく': '優木リノア',
            '松中りな': 'まひろ芽唯',
            '松元れいか': '紗藤まゆ',
            '帝瀧愛': 'まなか美玖',
            '真鍋香奈': '湯本千明',
            '秋川ルイ': '愛実',
            '美雲あい梨': '眞実かなえ',
            'まゆのゆま': '吉良いろは',
            '真梨亜': 'MARIA',
            'マリア・エリヨリ': 'Ray',
            '矢口理央': '三浦あいり',
            '美音ありす': '美音ゆめ',
            '美神あや': 'あんざい沙世',
            '小沢夕希': '未果美彩',
            '三上若葉': '三上若菜',
            '山瀬美紀': '三喜本のぞみ',
            '島崎星羅': '御坂恵衣',
            '美咲あや': '朝倉ことみ',
            '若林ひかる': '三咲悠',
            '上原カエラ': '美咲マリ',
            '桃井杏樹': '美咲りおな',
            '水咲ローラ': '滝澤ローラ',
            '美里琉季': '美里流季',
            '水河愛莉': '水川愛莉',
            '美咲みなみ': '水川かずは',
            '水川潤': '由愛可奈',
            '聖うるは': '水希杏',
            '水稀みり': '水川スミレ',
            '水希悠': '南涼',
            'みずき麗花': 'みづき乃愛',
            '水沢さら': '美月アンジェリア',
            '水谷詩恵理': '水谷しえり',
            '水谷シェリー': '水谷しえり',
            '水谷真希': '杏野まひる',
            '瑞乃ありさ': '優花めぐみ',
            '水野咲希': '吉村美咲',
            '吉村みさき': '吉村美咲',
            '村上静香': '水野よしみ',
            '美山ゆず': '水原あお',
            '水原よしみ': '白川はな',
            '美田さえ': '桜咲姫莉',
            '三井カンナ': '森高かすみ',
            'ゆうき麻夢': '蜜香',
            '流川レナ': '美月(クリスタル)',
            '観月あかね': '沖田杏梨',
            '渡野夕芽': 'みづき菜奈',
            '満月ひかり': '初芽里奈',
            '雪村ななみ': '観月由奈',
            '美月恋': '美月レイア',
            '三津なつみ': '愛田奈々',
            'MIYABI': '緑川みやび',
            'たちばな小春': '水上まい',
            '最上ゆら': '皆川ゆうな',
            '水無瀬怜奈': '結城花純',
            '南ゆき': '結城花純',
            '南奏音': '美波奏音',
            '美波翔子': '由紀なつき',
            '宮下なつみ': '南野あさひ',
            '南野みるく': '福沢あや',
            '南真悠': '奥村美和',
            '芽衣奈': '南芽衣奈',
            '南ゆかり': '川上良子',
            '南れいな': '赤坂れい',
            'みなもと しずか': '朝香美羽',
            'みなもとすず': '源すず',
            'みほの': '坂咲みほ',
            '三村佳奈': 'ミムラ佳奈',
            '美森けい': '宮崎愛莉',
            '宮川みくる': '桐嶋もえ',
            'RAIKA': '宮川怜',
            '宮坂レア': '宮野ゆかな',
            '宮坂レイア': '宮野ゆかな',
            '宮咲志帆 2': '宮咲志帆',
            '宮崎まお': '宮崎茉緒',
            '宮下かな': '宮下華奈',
            '宮下真央': '宮下つばさ',
            '雅みう': '月乃ひかり',
            '宮益ことは': '茉莉ひな',
            '湯川遥華': '宮本紗央里',
            '宮本さくら': '森本みれい',
            '宮森菜月': '西山楓',
            '美優': '小林美優',
            '三雲ゆり子': '高園ゆり子',
            'めぐみ(無垢)': 'あすな',
            'メロディー・マークス': 'メロディー・雛・マークス',
            '唯川希': '最上架純',
            '望月奈子': '八代れな',
            '望月ルイ': '望月るい',
            '本宮しおり': '本宮栞',
            '桃居りん': '初芽里奈',
            '桃咲ゆり菜': '桃瀬ゆり',
            '桃咲れもん': '桃井ゆず',
            '百瀬里帆': '百瀬いつき',
            '百瀬涼': '諸星セイラ',
            '桃乃ゆめ(2021)': '山本あいか',
            '桃山凛': '山本鈴',
            '森崎みづき': '西野悠',
            '森田紅音': '森崎りか',
            '星井笑': '諸星エミリー',
            '湯浅まみ': '八重いろは',
            '本城さりな': '八神れおん',
            '矢口里紗': '矢口理紗',
            '唯川みさき': '矢沢りょう',
            '夕樹あさひ': 'やしきれな',
            '八ツ橋さい子': '八ッ橋さい子',
            '柳井ひな': '柳井める',
            '柳あきら': '柳美和子',
            '柳かれん': '武田怜香',
            '柳詩絵': '伊東菜々',
            '山下みなみ': '北川怜',
            '山田まりこ': '山田マリコ',
            '吉岡穂花': '山吹みどり',
            '山本いずみ': '日和香澄',
            '結衣美沙': '結衣',
            '結川ゆう': '長谷川まや',
            '遊木ニナ': '游木りな',
            '優希みく': '小林みちる',
            '吉川みくり': '雪白いずみ',
            '由紀なつ碧': '由紀なつき',
            '雪乃ほたる': '立花美涼',
            '川嶋あみ': '雪平あい',
            'Rio': '柚木ティナ',
            '柚原綾': '神尾舞',
            'ゆずりはえな': '杠えな',
            '弓原詩穂': '持田優',
            '夢実あくび': '夢見あくび',
            'ユリア': '海老原かおり',
            '楓': 'YOKO',
            '横内利香': '横山翔子',
            '雪白いずみ': '吉川みくり',
            '吉川みりな': '吉田優希',
            '吉峯ゆず': '吉成ゆずか',
            '吉村安奈': '吉村杏菜',
            '若槻みづな': '若月みいな',
            '脇坂エム': '脇阪エム',
            '黒田ユリ': '和田ゆり子',
        };
    })
})();