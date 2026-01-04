// ==UserScript==
// @name         CJK部首/康熙部首文字置き換え表示スクリプト
// @namespace    http://tampermonkey.net/
// @version      0.36
// @description  Replace Kangxi radicals with normal characters based on data from Google Sheets
// @author       You
// @match        *://*/*
// @exclude      /^[^:/#?]*:\/\/([^#?/]*\.)?greasyfork\.org(:[0-9]{1,5})?\/.*$/
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488795/CJK%E9%83%A8%E9%A6%96%E5%BA%B7%E7%86%99%E9%83%A8%E9%A6%96%E6%96%87%E5%AD%97%E7%BD%AE%E3%81%8D%E6%8F%9B%E3%81%88%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/488795/CJK%E9%83%A8%E9%A6%96%E5%BA%B7%E7%86%99%E9%83%A8%E9%A6%96%E6%96%87%E5%AD%97%E7%BD%AE%E3%81%8D%E6%8F%9B%E3%81%88%E8%A1%A8%E7%A4%BA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // グローバル変数としてデータを保持
    var kangxiRadicals = {};

    // Google Sheets の公開URL
    var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1rKTSCyWkeMEJ-tp9Fr95UjH-NL-xliVX-gu69-WnX3c';

    // Google Sheets からデータを取得して処理する関数
    function processDataFromGoogleSheets() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: spreadsheetUrl + '/export?format=csv',
            onload: function(response) {
                try {
                    // データの処理を行う
                    var lines = response.responseText.split('\n');
                    var headerFound = false;
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        if (!headerFound && line.startsWith("CID")) {
                            headerFound = true;
                            continue; // CID行をスキップ
                        }
                        if (headerFound) {
                            var parts = line.split(',');
                            if (parts.length >= 5) {
                                kangxiRadicals[parts[3]] = parts[4];
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error processing data from Google Sheets:', error);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data from Google Sheets:', error);
            }
        });
    }

    // ページ内のテキストを置き換える関数
    function replaceText(node) {
       if (node.nodeType === Node.TEXT_NODE && /[\u2F00-\u2FDF\u2E80-\u2EFF]/u.test(node.nodeValue)) {
            var text = node.nodeValue;
            for (var radical in kangxiRadicals) {
                var regex = new RegExp(radical, 'g');
                text = text.replace(regex, kangxiRadicals[radical]);
            }
            node.nodeValue = text;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'TEXTAREA' && node.tagName !== 'INPUT') {
            for (var i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    // ページ内の全てのテキストを置き換える
    function replaceAllText() {
        replaceText(document.body);
    }

    var typingTimer;
    var doneTypingInterval = 2000; // 15秒後に文字置換を再開
    var isInputting = false; // ユーザーが入力中かどうかのフラグ
    var isFirstMutation = false; // 初めての変更かどうかのフラグ
    var isPageLoaded = false; // ページロード完了フラグ
    var isMouseOver = false; // マウスオーバーイベントフラグ

    // 文字入力中のイベントハンドラ
    function handleInput() {
        isInputting = true;
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function() {
            isInputting = false;
            isFirstMutation = true;
        }, doneTypingInterval);
    }

    // ページのDOMが変更されたらテキストを再度置き換える
    var observer = new MutationObserver(function(mutationsList) {
        if (!isPageLoaded || isInputting ) {
            return;
        }
        if (isFirstMutation) { // ユーザーが入力後初めての変更の場合はスキップしてフラグを解除
            isFirstMutation = false;
            return;
        }
        if (isMouseOver) { // マウスオーバーイベント後初めての変更の場合はスキップしてフラグを解除
            isMouseOver = false;
            return;
        }
        replaceAllText();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ユーザーの文字入力を監視する
    document.addEventListener('input', handleInput);

    // マウスオーバーイベントのハンドラ
    document.addEventListener('mouseover', function() {
        isMouseOver = true;
    });


    // ページ読み込みload完了時にデータ処理とテキスト置き換えを実行
    window.addEventListener('load',function() {
        isPageLoaded = true; // ページ読み込み完了フラグをtrueに設定
        processDataFromGoogleSheets();
        replaceAllText();
    });

})();
