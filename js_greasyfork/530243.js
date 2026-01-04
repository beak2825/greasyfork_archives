// ==UserScript==
// @name         YouTube Mobile コメント検索ボックス
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  モバイル版YouTubeのコメント表示時に、コメント件数と✕ボタンの間に検索ボックスを追加し、キーワードでコメントフィルターを実現します。
// @author       
// @match        https://m.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530243/YouTube%20Mobile%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/530243/YouTube%20Mobile%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 検索ボックスを作成してヘッダーに挿入する関数
    function insertSearchBox() {
        // すでに挿入済みなら何もしない
        if (document.getElementById('yt-mobile-search-box')) return;

        // コメントヘッダーを取得
        // ※ここでは「ytm-comments-header」や「ytd-comments-header」またはクラス名に"comments-header"を含む要素を対象としています
        var header = document.querySelector('ytm-comments-header, ytd-comments-header, [class*="comments-header"]');
        if (!header) return;

        // 検索ボックスのコンテナ作成
        var box = document.createElement('div');
        box.id = 'yt-mobile-search-box';
        box.style.display = 'inline-flex';
        box.style.alignItems = 'center';
        box.style.margin = '0 10px';

        // 入力欄
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'キーワード';
        input.style.fontSize = '14px';
        input.style.padding = '2px 4px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '3px';
        box.appendChild(input);

        // 検索ボタン
        var btnSearch = document.createElement('button');
        btnSearch.textContent = '検索';
        btnSearch.style.fontSize = '14px';
        btnSearch.style.marginLeft = '5px';
        btnSearch.style.padding = '2px 4px';
        box.appendChild(btnSearch);

        // 内部の閉じるボタン（☒）：押すと検索ボックス自体を非表示にします
        var btnClose = document.createElement('button');
        btnClose.textContent = '☒';
        btnClose.style.fontSize = '14px';
        btnClose.style.marginLeft = '5px';
        btnClose.style.padding = '2px 4px';
        box.appendChild(btnClose);

        // 検索ボタン押下時の処理
        btnSearch.addEventListener('click', function(){
            var keyword = input.value.trim();
            if(!keyword){
                alert('キーワードを入力してください');
                return;
            }
            // モバイル版YouTubeのコメント要素
            var comments = document.querySelectorAll('ytm-comment-thread-renderer, ytd-comment-thread-renderer');
            if(comments.length === 0){
                alert('コメントが見つかりません');
                return;
            }
            var found = false;
            comments.forEach(function(comment){
                // キーワード（大文字小文字を無視）を含むコメントだけを表示、それ以外は非表示にする
                if(comment.innerText.toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    comment.style.display = '';
                    if(!found){
                        // 最初に一致したコメントへスムーズスクロール
                        comment.scrollIntoView({behavior:'smooth', block:'start'});
                        found = true;
                    }
                } else {
                    comment.style.display = 'none';
                }
            });
            if(!found){
                alert('キーワードに一致するコメントは見つかりませんでした');
            }
        });

        // 内部の閉じるボタン押下時の処理：検索ボックスを非表示にする
        btnClose.addEventListener('click', function(){
            box.style.display = 'none';
        });

        // ヘッダー内のコメント件数と✕ボタンの間に挿入する
        // 通常、ヘッダーの最初の要素がコメント件数、最後の要素が✕ボタンであることを想定
        header.insertBefore(box, header.lastElementChild);
    }

    // コメントヘッダーの生成を監視するためのMutationObserver
    function setupObserver() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 追加されたノードがコメントヘッダーそのものまたはその子孫に含まれているかチェック
                        if(node.matches && node.matches('ytm-comments-header, ytd-comments-header, [class*="comments-header"]')) {
                            insertSearchBox();
                        } else {
                            var header = node.querySelector('ytm-comments-header, ytd-comments-header, [class*="comments-header"]');
                            if(header) {
                                insertSearchBox();
                            }
                        }
                    }
                });
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    // 初期化
    setupObserver();
    // 既にヘッダーが存在する場合に備え、遅延実行
    setTimeout(insertSearchBox, 3000);
})();