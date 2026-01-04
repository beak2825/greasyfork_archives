// ==UserScript==
// @name         TeacherNavi Helper
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      20240702.02
// @description  TeacherNavi Helper Javascript
// @author       Daisuke Ugajin
// @match        http://koumu.spec.ed.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spec.ed.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490956/TeacherNavi%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/490956/TeacherNavi%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //右クリック禁止を削除
    document.onmousedown=null;

    //出席簿の入力画面の自動化
    // 最終日のラジオボタンを選択する
    const elements = document.getElementsByName("registTargetDate");
    elements[elements.length - 1].checked = true;
    // 最後の日を選択状態にする
    elements[elements.length-1].checked = true ;

    //出席区分を右クリックで表示させる
    const selectElement = document.getElementById('attendkind');

    //出欠席の入力、５個おきに罫線を引く
    var rows = document.querySelectorAll("#bodyTable tr:nth-child(5n)");
    rows.forEach(function(row) {
        row.style.borderBottom = "2px solid black";
    });
    var rows2 = document.querySelectorAll("#rowTable tr:nth-child(5n)");
    rows2.forEach(function(row) {
        row.style.borderBottom = "2px solid black";
    });

    let contextMenu;
    // 右クリックメニューを表示する関数
    function showContextMenu(event) {
        event.preventDefault();

        if (contextMenu) {
            hideContextMenu(contextMenu);
        }

        // メニューを表示する位置を設定
        contextMenu = document.createElement('div');
        contextMenu.style.position = 'fixed';
        contextMenu.style.background = '#fff';
        contextMenu.style.border = '1px solid #ccc';
        contextMenu.style.padding = '5px';
        contextMenu.style.left = event.clientX+"px";
        contextMenu.style.top = event.clientY+"px";
        contextMenu.style.zIndex = '9999';

        // select要素の選択肢をメニューに追加
        for (let option of selectElement.options) {
            const menuItem = document.createElement('div');
            menuItem.textContent = option.textContent;
            menuItem.style.padding = '5px';
            menuItem.style.cursor = 'pointer';
            menuItem.addEventListener('click', () => {
                // メニューアイテムがクリックされたときの処理
                //alert("選択された項目:"+option.textContent);
                selectElement.value = option.value;
                setAttendCodeAndName();
                hideContextMenu(contextMenu);
            });
            contextMenu.appendChild(menuItem);
        }
        // 右クリックメニューを隠す関数
        function hideContextMenu(contextMenu) {
            if (contextMenu) {
                contextMenu.remove();
            }
        }
        // メニューをbody要素に追加
        document.body.appendChild(contextMenu);

        // ドキュメント全体にクリックイベントを追加して、メニューを隠す
        document.addEventListener('click', function(event) {
            // メニューが表示されている場合には非表示にする
            hideContextMenu(contextMenu);
        });
    }
    // ドキュメント全体に右クリックイベントを追加して、メニューを表示する
    document.addEventListener('contextmenu', showContextMenu);


    // 月を選択したときに自動的に遷移するようにする
    // IDを使用して<select>要素を取得します
    var selectElement_yyyymm = document.getElementById("yyyymm");

    // onchangeイベントリスナーを追加します
    selectElement_yyyymm.onchange = function() {
        checkAndSubmit('rtn', '06201002');
    };


    // アコーディオン機能を実装
    // 新しいボタンを作成
    const newButton = document.createElement('button');
    newButton.textContent = '続きを表示'; // ボタンのテキストを設定
    // ボタンのスタイルを設定
    newButton.style.top = '680px';
    newButton.style.left = '170px';
    newButton.style.width = '100px';
    newButton.style.height = '27px';
    newButton.style.position = 'absolute';
    newButton.style.zIndex = '1';

    // 自作の更新ボタン
    // ボタン要素を作成
    const postButton = document.createElement('input');
    postButton.type = 'button';
    postButton.name = 'BT2';
    postButton.className = 'bt100';
    postButton.value = '更\u3000新'; // "更　新" のスペースをUnicodeエスケープで表現
    postButton.onclick = function() { checkAndSubmit('upd', '06201003'); };

    // ボタンのスタイルを設定
    postButton.style.top = '680px';
    postButton.style.left = '50px';
    postButton.style.width = '100px';
    postButton.style.height = '27px';
    postButton.style.position = 'absolute';
    postButton.style.zIndex = '1';

    // スタイルが適用されているかどうかのフラグ
    let isStyleApplied = false;

    // ボタンがクリックされたときの処理を追加
    newButton.addEventListener('click', () => {
        // bodyとrow要素を取得
        const body = document.querySelector('#body');
        const row = document.querySelector('#row');
        if (!isStyleApplied) {
            // スタイルを適用
            body.style.height = '1200px';
            row.style.height = '1200px';
            newButton.textContent = '閉じる';
            newButton.style.top = '1500px';
            // ボタンをbodyに追加
            postButton.style.top = '1500px';
            document.body.appendChild(postButton);
            isStyleApplied = true;
        } else {
            body.style.height = '335px';
            row.style.height = '335px';
            newButton.textContent = '続きを表示';
            newButton.style.top = '680px';
            isStyleApplied = false;
            document.body.removeChild(postButton);
        }
    });

    // ボタンをドキュメントに追加
    document.body.appendChild(newButton);

})();