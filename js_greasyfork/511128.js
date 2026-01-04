// ==UserScript==
// @name         スマレジ取引履歴 自動で1年遡る（オフ機能付き）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  "transactionDateTo"が変更されたら、"transactionDateFrom"を自動で1年（364日）遡って設定。チェックボックスで機能のオン/オフを切り替え、スタイルと連動を実装。状態はローカルストレージに保存。
// @match        https://www1.smaregi.jp/control/transaction/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511128/%E3%82%B9%E3%83%9E%E3%83%AC%E3%82%B8%E5%8F%96%E5%BC%95%E5%B1%A5%E6%AD%B4%20%E8%87%AA%E5%8B%95%E3%81%A71%E5%B9%B4%E9%81%A1%E3%82%8B%EF%BC%88%E3%82%AA%E3%83%95%E6%A9%9F%E8%83%BD%E4%BB%98%E3%81%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/511128/%E3%82%B9%E3%83%9E%E3%83%AC%E3%82%B8%E5%8F%96%E5%BC%95%E5%B1%A5%E6%AD%B4%20%E8%87%AA%E5%8B%95%E3%81%A71%E5%B9%B4%E9%81%A1%E3%82%8B%EF%BC%88%E3%82%AA%E3%83%95%E6%A9%9F%E8%83%BD%E4%BB%98%E3%81%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // デフォルトでチェックをオンにするかオフにするか設定
    const defaultChecked = true;  // trueならデフォルトでオン、falseならデフォルトでオフ
    const storageKey = 'autoBackOnCheckbox'; // ローカルストレージのキー
    const storageExpiryKey = 'autoBackOnExpiry'; // 有効期限キー

    // 日付をYYYY/MM/DD形式にフォーマットする関数
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月を2桁にする
        const day = ('0' + date.getDate()).slice(-2); // 日を2桁にする
        return `${year}/${month}/${day}`;
    };

    // 指定された日付から364日前の日付を返す関数
    const getDateOneYearAgo = (date) => {
        const fromDate = new Date(date);
        fromDate.setDate(fromDate.getDate() - 364);
        return fromDate;
    };

    // ローカルストレージに保存
    const saveToStorage = (value) => {
        localStorage.setItem(storageKey, JSON.stringify(value));

        // 期限は1日間
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        localStorage.setItem(storageExpiryKey, expiryDate.getTime());
    };

    // ローカルストレージから取得
    const loadFromStorage = () => {
        const expiry = localStorage.getItem(storageExpiryKey);
        const now = new Date().getTime();

        // 有効期限が切れている場合、ストレージをクリア
        if (expiry && now > expiry) {
            localStorage.removeItem(storageKey);
            localStorage.removeItem(storageExpiryKey);
            return null;
        }

        const storedValue = localStorage.getItem(storageKey);
        return storedValue ? JSON.parse(storedValue) : null;
    };

    // チェックボックスの追加
    const addCheckbox = () => {
        const formGroup = document.querySelector('div.form-group');
        if (formGroup) {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'input-group';

            // チェックボックス作成
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'autoBackOn';

            // ローカルストレージの値を確認して設定
            const savedState = loadFromStorage();
            if (savedState !== null) {
                checkbox.checked = savedState;
            } else {
                checkbox.checked = defaultChecked;  // デフォルトのチェック状態を設定
            }

            // スタイル適用: scale(1.3), margin-left, position: relative, top
            checkbox.style.transform = 'scale(1.3)';
            checkbox.style.marginLeft = '15px';  // 左に余白を設定
            checkbox.style.position = 'relative'; // relative positioning
            checkbox.style.top = '2px';           // 上下位置を調整
            checkbox.style.marginRight = '5px';  // チェックボックスとテキストの間に余白を設定

            // ラベル作成
            const label = document.createElement('label');
            label.htmlFor = 'autoBackOn'; // チェックボックスと連動
            label.innerHTML = '自動で1年遡る'; // ラベルのテキスト

            // チェックボックスとラベルを一緒に追加
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);

            // チェックボックスの変更時にローカルストレージに保存
            checkbox.addEventListener('change', () => {
                saveToStorage(checkbox.checked);
            });

            // formGroup内に挿入
            formGroup.appendChild(checkboxDiv);
        }
    };

    // 初期化時にチェックボックスを追加
    addCheckbox();

    // 前回の"transactionDateTo"フィールドの値を保存する変数
    let previousDateToValue = null;

    // ページのURLに応じて監視対象のフィールドを決定
    const getDateFields = () => {
        let dateToInput, dateFromInput;
        const url = window.location.href;

        if (url.includes("/transaction/layaway")) {
            // Layawayページ用のフィールド
            dateToInput = document.getElementById('id_searchTransactionDateTo');
            dateFromInput = document.getElementById('id_searchTransactionDateFrom');
        } else if (url.includes("/transaction")) {
            // 通常の取引ページ用のフィールド
            dateToInput = document.getElementById('id_transactionDateTo');
            dateFromInput = document.getElementById('id_transactionDateFrom');
        }

        return { dateToInput, dateFromInput };
    };

    // 1秒ごとに"transactionDateTo"フィールドを監視して、変更があったら"transactionDateFrom"を更新
    setInterval(() => {
        const { dateToInput, dateFromInput } = getDateFields();
        const checkbox = document.getElementById('autoBackOn');

        if (dateToInput && dateFromInput && checkbox) {
            const currentDateToValue = dateToInput.value;

            // チェックボックスがチェックされている場合のみ機能を実行
            if (checkbox.checked && currentDateToValue !== previousDateToValue) {
                previousDateToValue = currentDateToValue;

                // 日付が有効であれば"transactionDateFrom"フィールドを更新
                const toDate = new Date(currentDateToValue);
                if (!isNaN(toDate.getTime())) {
                    const oneYearAgo = getDateOneYearAgo(toDate);
                    dateFromInput.value = formatDate(oneYearAgo);
                }
            }
        }
    }, 500);  // 0.5秒ごとに監視

})();
