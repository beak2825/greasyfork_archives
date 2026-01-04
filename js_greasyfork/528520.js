// ==UserScript==
// @name         ErogameScape 類似検索ボタン追加
// @namespace    https://erogamescape.dyndns.org/
// @version      1.5
// @description  ErogameScapeのゲーム詳細ページから類似検索ページへタイトルを入力して検索を実行
// @match        https://erogamescape.dyndns.org/*
// @grant        none
// @author       Kdroidwin
// @license      GPL-3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528520/ErogameScape%20%E9%A1%9E%E4%BC%BC%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528520/ErogameScape%20%E9%A1%9E%E4%BC%BC%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSimilarSearchButton() {
        let table = document.getElementById('basic_information_table');
        if (!table) return;

        let titleElement = document.querySelector('span.bold');
        if (!titleElement) return;

        let title = titleElement.textContent.trim();
        let searchUrl = `https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=1734`;

        let newRow = document.createElement('tr');
        let headerCell = document.createElement('th');
        headerCell.textContent = '類似検索';
        headerCell.style.whiteSpace = 'nowrap';
        newRow.appendChild(headerCell);

        let dataCell = document.createElement('td');
        let button = document.createElement('a');
        button.href = searchUrl;
        button.target = '_blank';
        button.textContent = 'ErogameScape類似';
        button.style.marginRight = '5px';
        button.style.padding = '3px 5px';
        button.style.background = '#007bff';
        button.style.color = '#fff';
        button.style.borderRadius = '3px';
        button.style.textDecoration = 'none';
        button.style.fontSize = '10px';

        // ボタンをクリックしたときにタイトルを保存
        button.addEventListener('click', function() {
            localStorage.setItem('erogame_title', title);
        });

        dataCell.appendChild(button);
        newRow.appendChild(dataCell);

        let tbody = table.querySelector('tbody');
        if (!tbody) return;

        let rows = Array.from(tbody.querySelectorAll('tr'));
        let searchRowIndex = rows.findIndex(row => row.textContent.includes('検索'));

        if (searchRowIndex !== -1) {
            let dlRow = rows[searchRowIndex + 1];

            if (dlRow && dlRow.textContent.includes('DL')) {
                tbody.insertBefore(newRow, dlRow);
            } else {
                tbody.insertBefore(newRow, rows[searchRowIndex + 1] || null);
            }
        } else {
            tbody.appendChild(newRow);
        }
    }

    function fillSearchBoxAndSubmit() {
        let inputBox = document.getElementById('word');
        if (!inputBox) return;

        let savedTitle = localStorage.getItem('erogame_title');
        if (savedTitle) {
            inputBox.value = savedTitle;
            localStorage.removeItem('erogame_title');

            setTimeout(() => {
                let searchButton = document.querySelector('button[onclick="search()"]');
                if (searchButton) {
                    searchButton.click();
                }
            }, 500);
        }
    }

    function autoAcceptPopup() {
        let observer = new MutationObserver(() => {
            let alertButton = document.querySelector('button[onclick="ok()"]');
            if (alertButton) {
                alertButton.click();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (window.location.href.includes('usersql_exec.php?sql_id=1734')) {
        window.addEventListener('load', () => {
            fillSearchBoxAndSubmit();
            autoAcceptPopup();
        });
    } else {
        window.addEventListener('load', addSimilarSearchButton);
    }
})();