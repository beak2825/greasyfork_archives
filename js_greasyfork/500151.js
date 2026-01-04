// ==UserScript==
// @name         差分チェック
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  sougouwiki.comの差分チェック補助
// @author       vrav
// @license      public domain
// @match        http://sougouwiki.com/diff/*
// @downloadURL https://update.greasyfork.org/scripts/500151/%E5%B7%AE%E5%88%86%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/500151/%E5%B7%AE%E5%88%86%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

//  　　　　　　　　　　　　　　　<<　使い方　>>
//  sougouwikiの差分ページを開くと変更部分のみを別途ポップアップ画面で表示し、
//  オリジナルページでは最初の変更部分にジャンプします。
//  Enterを押すたびに最初の変更部分、次の変更部分へとジャンプします。
//  Shiftを押しながらEnterで逆に戻ります。
//  ポップアップ画面はESCキーを押すたびに非表示⇔表示を繰り返します。
//  ページ内検索を使用する場合は、ポップアップも検索対象となるので一旦非表示にして下さい。
//  変更部分の先頭から18文字と同一の部分が他にある場合は、ジャンプが不正確になる場合があります。
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function () {
    'use strict';
    // クラス「diff-box」のコンテナ要素を検索
    const container = document.querySelector('.diff-box');
    if (container) {
        // コンテナ内のすべての <span class="line-add"> 要素と <span class="line-delete"> 要素を検索
        const elementsToShow = container.querySelectorAll('.line-add, .line-delete');
        // すべての要素のinnerHTMLを含む文字列を作成
        let popupContent = '';
        elementsToShow.forEach(element => {
            // 要素の前が <br> 要素であるかどうかを確認
            if (element.previousElementSibling && element.previousElementSibling.tagName === 'BR') {
                popupContent += element.previousElementSibling.outerHTML;
            }
            popupContent += element.outerHTML;
        });
        // ポップアップウインドウ作成
        const popup = document.createElement('div');
        popup.innerHTML = popupContent;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #000';
        popup.style.zIndex = '9999';
        popup.style.maxHeight = '80vh';
        popup.style.overflowY = 'auto';
        popup.style.backgroundColor = 'rgba(245, 245, 245, 0.8)'
        // 閉じるボタン作成
        const closeButton1 = document.createElement('span');
        closeButton1.innerHTML = '×';
        closeButton1.style.position = 'absolute';
        closeButton1.style.top = '5px';
        closeButton1.style.right = '10px';
        closeButton1.style.cursor = 'pointer';
        const closeButton2 = document.createElement('span');
        closeButton2.innerHTML = '×';
        closeButton2.style.position = 'absolute';
        closeButton2.style.bottom = '5px';
        closeButton2.style.right = '10px';
        closeButton2.style.cursor = 'pointer';
        // ポップアップに閉じるボタンを追加
        [closeButton1, closeButton2].forEach(button => {
            popup.appendChild(button);
            button.addEventListener('click', () => {
                document.body.removeChild(popup);
            });
        });
        // ボタンの位置を更新
        popup.addEventListener('scroll', function () {
            closeButton1.style.top = (5 + popup.scrollTop) + 'px';
        });
        popup.addEventListener('scroll', function () {
            closeButton2.style.bottom = (5 - popup.scrollTop) + 'px';
        });
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
        // ポップアップ内の <span class="line-add"> 要素と <span class="line-delete"> 要素の色を変更
        const lineAddElements = popup.querySelectorAll('.line-add');
        lineAddElements.forEach(element => {
            element.style.color = 'blue';
        });
        const lineDeleteElements = popup.querySelectorAll('.line-delete');
        lineDeleteElements.forEach(element => {
            element.style.color = 'red';
        });
        // ポップアップに反映
        document.body.appendChild(popup);
        // ページを開いた時に最初の要素にスクロール
        window.onload = () => {
            setTimeout(() => {
                elementsToShow[currentIndex].scrollIntoView({block: "center"});
            }, 100);
        }

        // ポップアップスクロールの挙動
        popup.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const height = this.getBoundingClientRect().height;

            console.log('Scroll Top:', scrollTop);
            console.log('Scroll Height:', scrollHeight);
            console.log('Popup Height:', height);

            // 下限の処理
            if (scrollTop + height >= scrollHeight - 1) {
                this.scrollTop = scrollHeight - height - 1;
            }
            // 上限の処理
            else if (scrollTop <= 0) {
                this.scrollTop = 1;
            }
        });

        let currentIndex = 0;
        let prevClassName = "";
        document.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                // Shift + Enterで戻る
                if (e.shiftKey) {
                    currentIndex--;
                    while (currentIndex >= 0 && elementsToShow[currentIndex].className === prevClassName && elementsToShow[currentIndex].innerHTML.trim() !== "") {
                        currentIndex--;
                    }
                    if (currentIndex < 0) {
                        currentIndex = elementsToShow.length - 1;
                    }
                    // Enterで進む
                } else {
                    currentIndex++;
                    // 空文字列をスキップするロジックを追加
                    while (currentIndex < elementsToShow.length &&
                           (elementsToShow[currentIndex].innerHTML.trim() === "" ||
                            elementsToShow[currentIndex].className === prevClassName) &&
                           (elementsToShow[currentIndex - 1].innerHTML.trim() !== "" &&
                            elementsToShow[currentIndex - 1].className === prevClassName)) {
                        currentIndex++;
                    }
                    if (currentIndex >= elementsToShow.length) {
                        currentIndex = 0;
                    }
                }
                prevClassName = elementsToShow[currentIndex].className;
                elementsToShow[currentIndex].scrollIntoView({block: "center"});
            }
        });
    };
})();