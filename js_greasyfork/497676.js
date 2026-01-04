// ==UserScript==
// @name         YouTube Channel ID Copier and img Searcher
// @namespace    https://github.com/uzuky
// @version      1.0
// @description:ja  ユーザー名の横に🌱が出現して、クリックするとユーザーIDでスレ検索ができます。watch?v=xxxx 形式ではなく、ユーザーIDでスレを立てている必要があります
// @description:ja2 📋️をクリックするとユーザーIDのコピーができます
// @description:ja3 全チャンネルに表示されるのは仕様です
// @author       uzuky
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://img.2chan.net/b/futaba.php?mode=cat
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @description ユーザー名の横に🌱が出現して、クリックするとユーザーIDでスレ検索ができます。watch?v=xxxx 形式ではなく、ユーザーIDでスレを立てている必要があります
// @downloadURL https://update.greasyfork.org/scripts/497676/YouTube%20Channel%20ID%20Copier%20and%20img%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/497676/YouTube%20Channel%20ID%20Copier%20and%20img%20Searcher.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'YouTubeChannelID';

    const createIconButton = (icon, tooltip, onClick) => {
        const button = document.createElement("span");
        button.textContent = icon;
        button.style.cursor = "pointer";
        button.style.fontSize = "larger";
        button.title = tooltip;
        button.addEventListener("click", onClick);
        return button;
    };

    const getChannelId = element => {
        const link = element.querySelector('a[href^="/@"]');
        if (link) {
            const match = link.href.match(/\/(@[A-Za-z0-9_-]+)/);
            return match ? match[1] : null;
        }
        return null;
    };

    const insertIcons = () => {
        const uploadInfos = document.querySelectorAll('#upload-info'); //チャンネル名のとこ
        if (uploadInfos.length === 0) {
            console.error('#upload-infoの要素が見つかりませんでした');
        }

        uploadInfos.forEach(uploadInfo => {
            const channelId = getChannelId(uploadInfo);
            if (channelId) {
                const formattedLink = uploadInfo.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string'); //ここ変更に弱い
                if (formattedLink) {
                    const copyIcon = createIconButton("📋️", "IDをコピー", () => {
                        GM_setClipboard(channelId);
                        GM_setValue(STORAGE_KEY, channelId);
                        copyIcon.textContent = "✅";
                        setTimeout(() => { copyIcon.textContent = "📋️"; }, 500);
                    });
                    formattedLink.parentNode.insertBefore(copyIcon, formattedLink);
                } else {
                    console.error('a.yt-simple-endpoint.style-scope.yt-formatted-stringの要素が見つかりませんでした');
                }
            }
        });

        const ownerSubCount = document.querySelectorAll('#owner-sub-count'); //チャンネル登録者数のとこ
        if (ownerSubCount.length === 0) {
            console.error('#owner-sub-countの要素が見つかりませんでした');
        }

        ownerSubCount.forEach(element => {
            const leafIcon = createIconButton("🌱", "imgでスレを検索 (IDはコピーされません)", async () => {
                const channelId = await GM_getValue(STORAGE_KEY, "");
                if (channelId) {
                    GM_openInTab('https://img.2chan.net/b/futaba.php?mode=cat', { active: true });
                }
            });
            element.insertBefore(leafIcon, element.firstChild);
        });
    };

    if (window.location.hostname === "www.youtube.com") {
        window.addEventListener('load', () => setTimeout(insertIcons, 1000)); //念の為の1秒後
    } else if (window.location.hostname === "img.2chan.net") {
        window.addEventListener('load', async () => {
            const channelId = await GM_getValue(STORAGE_KEY, "");
            if (channelId) {
                const input = document.querySelector('#hml input[name="keyword"]');
                const searchButton = document.querySelector('#hml input[type="submit"]');
                if (input && searchButton) {
                    input.value = channelId;
                    searchButton.click();
                    await GM_setValue(STORAGE_KEY, ""); // 検索後に値をクリアする
                } else {
                    console.error('検索ボックスが見つかりませんでした');
                }
            } else {
                console.log('YouTube IDが設定されていないため、スクリプトは実行されません');
            }
        });
    }
})();
