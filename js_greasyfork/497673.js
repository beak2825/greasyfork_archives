// ==UserScript==
// @name         Twitch User ID Copier and img Searcher
// @namespace    https://github.com/uzuky
// @version      1.1
// @description:ja  ユーザー名の横に🌱が出現して、クリックするとユーザーIDでスレ検索ができます
// @description:ja2 📋️をクリックするとユーザーIDのコピーができます
// @description:ja3 オフラインのチャンネルではうまく動作しないかもしれません
// @author       uzuky
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        https://img.2chan.net/b/futaba.php?mode=cat
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @description ユーザー名の横に🌱が出現して、クリックするとユーザーIDでスレ検索ができます
// @downloadURL https://update.greasyfork.org/scripts/497673/Twitch%20User%20ID%20Copier%20and%20img%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/497673/Twitch%20User%20ID%20Copier%20and%20img%20Searcher.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'TwitchID_userId';

    const createIconButton = (icon, tooltip, onClick) => {
        const button = document.createElement("span");
        button.textContent = icon;
        button.style.cursor = "pointer";
        button.style.fontSize = "larger";
        button.title = tooltip;
        button.addEventListener("click", onClick);
        return button;
    };

    const addButtonsToElement = targetElement => {
        const pathname = window.location.pathname;
        const userId = pathname.split('/')[1];

        if (!userId) {
            console.error('ユーザーIDをURLから取得できませんでした');
            return;
        }

        const copyIcon = createIconButton("📋️", "IDをコピー", () => {
            GM_setClipboard(userId);
            copyIcon.textContent = "✅";
            setTimeout(() => { copyIcon.textContent = "📋️"; }, 500);
        });

        const searchIcon = createIconButton("🌱", "imgでスレを検索 (IDはコピーされません)", () => {
            GM_setValue(STORAGE_KEY, userId);
            GM_openInTab('https://img.2chan.net/b/futaba.php?mode=cat', { active: true });
        });

        targetElement.parentNode.insertBefore(copyIcon, targetElement.nextSibling);
        targetElement.parentNode.insertBefore(searchIcon, copyIcon.nextSibling);
    };

    const addButtons = () => {
        const pathname = window.location.pathname;
        const userId = pathname.split('/')[1];

        console.log("ボタンを追加します");

        if (!userId) {
            console.error('ユーザーIDをURLから取得できませんでした');
            return;
        }

        // ユーザーのアイコンと配信情報が入ってるエリア
        let container = document.getElementById("live-channel-stream-information");
        if (!container) {
            container = document.getElementById("offline-channel-main-content");
        }

        if (!container) {
            console.error('live-channel-stream-information または offline-channel-main-content が見つかりませんでした');
            return;
        }

        // ユーザーアイコンのaタグが1番目、ユーザー名のaタグが2番目
        const targetElements = container.querySelectorAll(`a[href='/${userId}']`);
        if (targetElements.length < 2) {
            if (targetElements.length === 0) {
                console.error(`a href='/${userId}' が見つかりませんでした`);
                return;
            }
            addButtonsToElement(targetElements[0]);
        } else {
            addButtonsToElement(targetElements[1]);
        }
    };

    if (window.location.hostname === "www.twitch.tv") {
        window.addEventListener('load', () => setTimeout(addButtons, 2000)); //遅延させないとなにかに上書きされて消えちゃう
    } else if (window.location.hostname === "img.2chan.net") {
        window.addEventListener('load', async () => {
            const userId = await GM_getValue(STORAGE_KEY, "");
            if (userId) {
                const input = document.querySelector('#hml input[name="keyword"]');
                const searchButton = document.querySelector('#hml input[type="submit"]');
                if (input && searchButton) {
                    input.value = userId;
                    searchButton.click();
                    await GM_setValue(STORAGE_KEY, ""); // 検索後に値をクリアする
                } else {
                    console.error('検索ボックスが見つかりませんでした');
                }
            } else {
                console.log('Twitch IDが設定されていないため、スクリプトは実行されません');
            }
        });
    }
})();
