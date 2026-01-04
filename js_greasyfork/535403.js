// ==UserScript==
// @name         縦横軸コード管理のコード自動置換
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  SKU追加時に項目名の入力からコードに自動置換
// @license      MIT
// @match        *://starlight.plusnao.co.jp/goods/axisCode*
// @grant        GM_xmlhttpRequest
// @connect      plus-nao.com
// @downloadURL https://update.greasyfork.org/scripts/535403/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%81%AE%E3%82%B3%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E7%BD%AE%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/535403/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%81%AE%E3%82%B3%E3%83%BC%E3%83%89%E8%87%AA%E5%8B%95%E7%BD%AE%E6%8F%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let tableData = [];
    let warningMessage = '置換データを読み込んでいます...';
    let warningColor = 'black';
    let isLoaded = false;

    const updateWarnings = () => {
        document.querySelectorAll('.replace-warning-message').forEach(span => {
            span.innerHTML = warningMessage;
            span.style.color = warningColor;
        });
    };

    const loadReplacementData = () => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://plus-nao.com/forests/TbStockReplaceWord',
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const rows = doc.querySelectorAll('.listdot100par tr');

                tableData = [];
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 1) {
                        tableData.push({
                            key: cells[0].textContent.trim(),
                            value: cells[1].textContent.trim()
                        });
                    }
                });

                tableData.sort((a, b) => b.key.length - a.key.length);

                if (tableData.length > 0) {
                    warningMessage = '';
                    warningColor = 'black';
                    isLoaded = true;
                } else {
                    warningMessage = '置換データの読み込みに失敗しました<br>(plus-nao.comにログインが必要な場合があります)';
                    warningColor = 'red';
                }

                updateWarnings();
            },
            onerror: function () {
                warningMessage = '置換データの取得中にエラーが発生しました';
                warningColor = 'red';
                updateWarnings();
            },
            ontimeout: function () {
                warningMessage = '置換データの取得がタイムアウトしました';
                warningColor = 'red';
                updateWarnings();
            }
        });
    };

    const modalObserver = new MutationObserver(() => {
        document.querySelectorAll('div.modal-content').forEach(modal => {
            const inputs = modal.querySelectorAll('input.form-control');
            if (inputs.length > 1) {
                const codeInput = inputs[0];
                const axisInput = inputs[1];

                if (!axisInput.dataset.listenerAdded) {
                    axisInput.dataset.listenerAdded = 'true';

                    let messageSpan = document.createElement('span');
                    messageSpan.className = 'replace-warning-message';
                    messageSpan.textContent = warningMessage;
                    messageSpan.style.marginLeft = '10px';
                    messageSpan.style.color = warningColor;
                    messageSpan.style.fontSize = '12px';
                    messageSpan.style.display = 'inline-block';
                    messageSpan.style.maxWidth = '250px';
                    messageSpan.style.verticalAlign = 'middle';
                    axisInput.parentElement.appendChild(messageSpan);

                    axisInput.addEventListener('input', () => {
                        const original = axisInput.value.trim();

                        if (!original) {
                            codeInput.value = '';
                        } else {
                            const exclusionPattern = /【[^【】]*】/g;
                            const filteredText = original.replace(exclusionPattern, '');

                            let replaced = filteredText;
                            for (const { key, value } of tableData) {
                                replaced = replaced.replaceAll(key, value);
                            }

                            replaced = replaced.replaceAll('×', 'x');

                            replaced = replaced.replace(/[^a-zA-Z0-9\-]/g, '');

                            codeInput.value = replaced;
                        }

                        const inputEvent = new Event('input', {
                            bubbles: true,
                            cancelable: true
                        });
                        codeInput.dispatchEvent(inputEvent);
                    });

                    updateWarnings();
                }
            }
        });
    });

    modalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    loadReplacementData();
})();
