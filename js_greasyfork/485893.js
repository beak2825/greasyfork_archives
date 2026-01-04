// ==UserScript==
// @name            Twitter User Blocker
// @name:ja         Twitter ユーザーをミュートするやつ
// @namespace       http://tampermonkey.net/
// @version         1.0.3
// @description     Hide tweets from multiple users on Twitter
// @description:ja  IDを入力することですぐミュートできる。表示したり非表示にしたりの切り替えも可能
// @author          Nogaccho
// @match           https://twitter.com/*
// @match           https://x.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/485893/Twitter%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/485893/Twitter%20%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%82%92%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isBlockingEnabled = false;// ブロッキングが有効かどうかのフラグ
    let initialLoad = true;// 初回読み込みかどうかのフラグ
    let ids = [];// ブロックするユーザーIDのリスト

    function saveUserIds(userIds) {
        localStorage.setItem("blockedUserIds", JSON.stringify(userIds));// 非表示するユーザーIDをlocalStorageに保存
    }

    function loadUserIds() {
        return JSON.parse(localStorage.getItem("blockedUserIds") || "[]");// ローカルストレージから非表示するユーザーIDを読み込み
    }

    function hideTweets() {
        if (!isBlockingEnabled) return;// ブロッキングが無効なら処理を中断
        let blockedUserIds = loadUserIds();// ブロックするユーザーIDを取得
        let tweets = document.querySelectorAll(`[data-testid="tweet"]`); // ツイートの要素を取得
        let count = 0;
        tweets.forEach(tweet => {
            if (initialLoad && count >= 50) return; // 初回読み込み時は50ツイートのみ処理
            let authorLink = blockedUserIds.some(id => tweet.querySelector(`a[href*="/${id}"]`));
            if (authorLink) {
                tweet.style.display = 'none';
                count++;
            }
        });
        initialLoad = false;
    }

    function handleScroll() {
        // スクロールイベントの処理。新しいツイートが表示されるたびにhideTweetsを呼び出す
        let lastTweet = document.querySelectorAll(`[data-testid="tweet"]`).item(document.querySelectorAll(`[data-testid="tweet"]`).length - 1);
        let observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hideTweets();
                    observer.unobserve(lastTweet);
                }
            });
        }, { threshold: 1.0 });
        observer.observe(lastTweet);
    }

    function toggleBlocking() {
        // 非表示のON/OFFを切り替える
        isBlockingEnabled = !isBlockingEnabled;
        if (isBlockingEnabled) {
            hideTweets();
        } else {
            document.querySelectorAll(`[data-testid="tweet"]`).forEach(tweet => {
                tweet.style.display = '';
            });
        }
    }

    function editBlockList() {
        // 非表示リストの編集画面
        let ids = loadUserIds();
        let editContainer = document.createElement("div");
        editContainer.style.position = "fixed";
        editContainer.style.top = "100px";
        editContainer.style.right = "10px";
        editContainer.style.backgroundColor = "#273340";
        editContainer.style.padding = "10px";
        editContainer.style.border = "0.5px solid gray";
        editContainer.style.zIndex = "1000";
        editContainer.style.color = "white";
        editContainer.style.borderRadius = "10px";
        editContainer.style.display = "flex";
        editContainer.style.flexDirection = "column";

        let idListContainer = document.createElement("div");
        idListContainer.style.maxHeight = "260px";
        idListContainer.style.overflowY = "auto";
        idListContainer.style.marginBottom = "10px";

        let idList = document.createElement("ul");
        ids.forEach(id => {
            let listItem = document.createElement("li");
            listItem.style.display = "flex";
            listItem.style.justifyContent = "space-between";
            listItem.style.alignItems = "center";

            let idText = document.createElement("span");
            idText.textContent = id;
            listItem.appendChild(idText);

            let removeButton = document.createElement("button");
            removeButton.textContent = "削除";
            removeButton.style.marginLeft = "10px";
            styleButton(removeButton);
            removeButton.onclick = function () {
                ids = ids.filter(userId => userId !== id);
                saveUserIds(ids);
                listItem.remove()
            };

            listItem.appendChild(removeButton);
            idList.appendChild(listItem);
        });

        idListContainer.appendChild(idList);
        editContainer.appendChild(idListContainer);

        let closeButton = document.createElement("button");
        closeButton.textContent = "閉じる";
        closeButton.style.alignSelf = "flex-start";
        styleButton(closeButton);
        closeButton.onclick = function () {
            document.body.removeChild(editContainer);
        };
        editContainer.appendChild(closeButton);
        document.body.appendChild(editContainer);
    }

    // Create interface for blocking user IDs
    let inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = '  IDを入力';
    inputBox.style.backgroundColor = "#273340";
    inputBox.style.color = "#757575";
    inputBox.style.border = "none";
    inputBox.style.borderRadius = "2px";

    let saveButton = document.createElement("button");
    saveButton.textContent = "追加";
    styleButton(saveButton);
    saveButton.onclick = function () {
        let newUserIds = inputBox.value.split(',').map(id => id.trim().replace(/"/g, '')).filter(id => id !== "");
        if (newUserIds.length > 0) {
            let currentIds = loadUserIds();
            let updatedIds = currentIds.concat(newUserIds.filter(id => !currentIds.includes(id)));
            saveUserIds(updatedIds);
            hideTweets();
        }
        inputBox.value = "";
    };

    let toggleCheckbox = document.createElement("input");
    toggleCheckbox.type = "checkbox";
    toggleCheckbox.checked = isBlockingEnabled;
    toggleCheckbox.onchange = toggleBlocking;
    let toggleLabel = document.createElement("label");
    toggleLabel.style.marginLeft = "5px";
    toggleLabel.insertBefore(toggleCheckbox, toggleLabel.firstChild);

    let editButton = document.createElement("button");
    editButton.textContent = "IDリスト";
    editButton.style.marginLeft = "10px";
    styleButton(editButton);
    editButton.onclick = function () {
        ids = loadUserIds();
        editBlockList();
    };

    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "55px";
    container.style.right = "10px";
    container.appendChild(inputBox);
    container.appendChild(saveButton);
    container.appendChild(editButton);
    container.appendChild(toggleLabel);
    document.body.appendChild(container);

    function styleButton(button) {
        button.style.backgroundColor = "#1A8CD8";
        button.style.color = "#FFFFFF";
        button.style.borderRadius = "10px";
        button.style.border = "none";

        button.onmouseover = function () {
            button.style.backgroundColor = "#1576b6";
        };

        button.onmousedown = function () {
            button.style.backgroundColor = "#0f5a94";
        };
        button.onmouseup = function () {
            button.style.backgroundColor = "#1A8CD8";
        };
        button.onmouseleave = function () {
            button.style.backgroundColor = "#1A8CD8";
        };
    }

    window.addEventListener('scroll', handleScroll);// スクロールイベントリスナーを追加
    let observer = new MutationObserver(hideTweets);// DOMの変更を監視するオブザーバーを追加
    observer.observe(document.body, { childList: true, subtree: true });
})();