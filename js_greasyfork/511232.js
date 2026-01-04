// ==UserScript==
// @name         Wazeブックマーク管理とバックアップ
// @namespace    https://greasyfork.org/ja/users/735907-cauliflower-carrot
// @version      2.2
// @description  Wazeエディタ画面にブックマーク管理UIを表示し、キャッシュクリア、ブックマークのエクスポート・インポート機能を追加します。
// @author       aoi
// @match        https://www.waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511232/Waze%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E7%AE%A1%E7%90%86%E3%81%A8%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/511232/Waze%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E7%AE%A1%E7%90%86%E3%81%A8%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultFontSize = '16px'; // デフォルトのフォントサイズを設定
    let allowedUrls = JSON.parse(localStorage.getItem('allowedUrls')) || []; // 保存されたブックマークを読み込む

    window.addEventListener('load', function() {
        // ブックマーク管理ボタンを作成して追加
        const button = document.createElement("button");
        button.innerHTML = "ブックマーク";
        button.style.position = "fixed";
        button.style.zIndex = "10000";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.padding = "5px 10px";
        button.style.width = "150px";
        button.style.height = "30px";
        button.style.right = '310px';
        button.style.top = '1px';

        // ブックマーク管理用のUI要素を作成
        const bookmarkManagementDiv = document.createElement("div");
        bookmarkManagementDiv.innerHTML = `
            <h3 style="text-align: left; margin: 0 0 10px 0;">ブックマーク管理</h3>
            <input type="text" id="urlInput" placeholder="URLを入力" style="width: 100%; padding: 5px; box-sizing: border-box;">
            <input type="text" id="nameInput" placeholder="ブックマーク名を入力" style="width: 100%; padding: 5px; box-sizing: border-box; margin-top: 5px;">
            <button id="addUrlButton" style="width: 100%; margin-top: 5px; padding: 5px; background-color: blue; color: white; border: none; border-radius: 5px;">ブックマーク追加</button>
            <ul id="urlList" style="list-style: none; padding: 0; margin: 10px 0 0 0; max-height: 150px; overflow-y: auto;"></ul>
            <button id="clearCacheButton" style="width: 100%; margin-top: 15px; padding: 5px; background-color: blue; color: white; border: none; border-radius: 5px;">キャッシュクリア</button>
        `;
        bookmarkManagementDiv.style.position = "fixed";
        bookmarkManagementDiv.style.right = "10px";
        bookmarkManagementDiv.style.top = "60px";
        bookmarkManagementDiv.style.zIndex = "10000";
        bookmarkManagementDiv.style.backgroundColor = "#f9f9f9";
        bookmarkManagementDiv.style.padding = "15px";
        bookmarkManagementDiv.style.border = "1px solid #ccc";
        bookmarkManagementDiv.style.borderRadius = "5px";
        bookmarkManagementDiv.style.width = "350px";
        bookmarkManagementDiv.style.display = "none"; // 初期は非表示

        // ブックマークリストを表示する関数
        function updateUrlList() {
            const urlList = document.getElementById('urlList');
            urlList.innerHTML = '';
            allowedUrls.forEach((item) => {
                const li = document.createElement('li');
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.alignItems = "center";
                li.innerHTML = `<span style="flex: 1; font-size: ${defaultFontSize};"><a href="${item.url}" style="color: blue;" class="clearCacheLink" data-url="${item.url}">${item.name || item.url}</a></span>`;
                const removeButton = document.createElement('button');
                removeButton.textContent = '削除';
                removeButton.style.marginLeft = "10px";
                removeButton.addEventListener('click', function() {
                    allowedUrls = allowedUrls.filter(i => i.url !== item.url);
                    localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                    updateUrlList();
                });
                li.appendChild(removeButton);
                urlList.appendChild(li);
            });
        }

        // キャッシュをクリアして指定されたURLに移動する関数
        function clearCacheAndNavigate(url) {
            caches.keys().then(names => {
                const cacheClearPromises = names.map(name => caches.delete(name));
                return Promise.all(cacheClearPromises);
            }).then(() => {
                window.location.href = url; // キャッシュクリア後に指定されたURLに移動
            });
        }

        // ブックマーク追加イベント
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'addUrlButton') {
                const urlInput = document.getElementById('urlInput');
                const nameInput = document.getElementById('nameInput');
                const newUrl = urlInput.value.trim();
                const newName = nameInput.value.trim();

                if (newUrl && !allowedUrls.some(item => item.url === newUrl)) {
                    allowedUrls.push({ url: newUrl, name: newName });
                    localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                    urlInput.value = '';
                    nameInput.value = '';
                    updateUrlList();
                } else if (allowedUrls.some(item => item.url === newUrl)) {
                    alert('このブックマークは既にリストに存在します。');
                } else {
                    alert('URLを入力してください。');
                }
            }
        });

        // キャッシュクリアとリロードイベント
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'clearCacheButton') {
                clearCacheAndNavigate(); // キャッシュクリアしてページをリロード
            }
        });

        // キャッシュクリアとリンクに移動するイベント
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('clearCacheLink')) {
                e.preventDefault();
                const targetUrl = e.target.getAttribute('data-url');
                clearCacheAndNavigate(targetUrl); // キャッシュクリアして指定されたリンクに移動
            }
        });

        // ブックマークをJSONファイルとしてエクスポートする関数
        function exportBookmarks() {
            const dataStr = JSON.stringify(allowedUrls);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'bookmarks.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }

        // JSONファイルからブックマークをインポートする関数
        function importBookmarks(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const importedData = JSON.parse(e.target.result);
                allowedUrls = importedData;
                localStorage.setItem('allowedUrls', JSON.stringify(allowedUrls));
                updateUrlList();
            };
            reader.readAsText(file);
        }

        // エクスポートボタンの作成
        const exportButton = document.createElement("button");
        exportButton.textContent = "ブックマークエクスポート";
        exportButton.style.width = "100%";
        exportButton.style.marginTop = "10px";
        exportButton.addEventListener('click', exportBookmarks);
        bookmarkManagementDiv.appendChild(exportButton);

        // インポート用の入力フィールドを作成
        const importButton = document.createElement("input");
        importButton.type = "file";
        importButton.style.width = "100%";
        importButton.style.marginTop = "10px";
        importButton.addEventListener('change', importBookmarks);
        bookmarkManagementDiv.appendChild(importButton);

        // ブックマーク管理ボタンがクリックされたときにUIを表示/非表示にする
        button.addEventListener('click', function() {
            bookmarkManagementDiv.style.display = bookmarkManagementDiv.style.display === "none" ? "block" : "none";
        });

        // ボタンとUIをページに追加
        document.body.appendChild(button);
        document.body.appendChild(bookmarkManagementDiv);

        // 初回読み込み時にブックマークリストを更新
        updateUrlList();
    });
})();
