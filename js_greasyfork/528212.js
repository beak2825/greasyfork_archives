// ==UserScript==
// @name         ErogameScape 検索ボタン追加
// @namespace    https://kdroidwin.hatenablog.com
// @version      2.1
// @description  ゲームタイトルをコピーし、Searx.beで攻略検索ボタンを追加
// @match        https://erogamescape.dyndns.org/*
// @grant        none
// @license GPL-3.0 license
// @author       Kdroidwin
// @downloadURL https://update.greasyfork.org/scripts/528212/ErogameScape%20%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528212/ErogameScape%20%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButtons() {
        let table = document.getElementById('basic_information_table');
        if (!table) return;

        let titleElement = document.querySelector('span.bold');
        if (!titleElement) return;

        let title = titleElement.textContent.trim(); // ゲームタイトルを取得

        let searchUrls = [
            { url: `https://searx.be/search?q=${encodeURIComponent(title)}+攻略`, label: '攻略' },
            { url: `https://searx.be/search?q=${encodeURIComponent(title)}+おすすめ攻略順`, label: '攻略順' },
            { url: `https://searx.be/search?q=${encodeURIComponent(title)}+聖地`, label: '聖地' },
            { url: `https://vndb.org/v?sq=${encodeURIComponent(title)}`, label: 'vndb' }
        ];

        function createRow(title, links) {
            let newRow = document.createElement('tr');
            let headerCell = document.createElement('th');
            headerCell.textContent = title;
            headerCell.style.whiteSpace = 'nowrap';
            newRow.appendChild(headerCell);

            let dataCell = document.createElement('td');
            links.forEach(({ url, label }) => {
                let button = document.createElement('a');
                button.href = url;
                button.target = '_blank';
                button.textContent = label;
                button.style.marginRight = '5px';
                button.style.padding = '3px 5px';
                button.style.background = '#007bff';
                button.style.color = '#fff';
                button.style.borderRadius = '3px';
                button.style.textDecoration = 'none';
                button.style.fontSize = '10px';
                dataCell.appendChild(button);
            });
            newRow.appendChild(dataCell);
            table.querySelector('tbody').appendChild(newRow);
        }

        createRow('検索', searchUrls);
    }

    function fillSearchBoxAndSubmit() {
        let inputBox = document.getElementById('word');
        if (!inputBox) return;

        let title = document.querySelector('span.bold') ? document.querySelector('span.bold').textContent.trim() : '';
        if (title) {
            inputBox.value = title; // ゲームタイトルを入力
            setTimeout(() => {
                let searchButton = document.querySelector('button[onclick="search()"]');
                if (searchButton) {
                    searchButton.click(); // 自動で検索ボタンをクリック
                }
            }, 500);
        }
    }

    function autoAcceptPopup() {
        let observer = new MutationObserver(() => {
            let alertButton = document.querySelector('button[onclick="ok()"]');
            if (alertButton) {
                alertButton.click(); // ポップアップのOKを自動クリック
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function autoConfirmDialog() {
        window.confirm = () => true; // 「OK」を自動選択
        window.onbeforeunload = null; // 離脱確認を無効化
    }

    if (window.location.href.includes('usersql_exec.php?sql_id=1734')) {
        window.addEventListener('load', () => {
            autoConfirmDialog(); // 自動でOKを押す
            fillSearchBoxAndSubmit();
            autoAcceptPopup();
        });
    } else {
        window.addEventListener('load', addSearchButtons);
    }
})();
