// ==UserScript==
// @name         Mastodon & Twitter投稿ボタン3,3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  指定のサイトにMastodonとTwitterの投稿ボタンを追加
// @author       AoiRabitto
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @connect      mstdn.jp
// @downloadURL https://update.greasyfork.org/scripts/524095/Mastodon%20%20Twitter%E6%8A%95%E7%A8%BF%E3%83%9C%E3%82%BF%E3%83%B33%2C3.user.js
// @updateURL https://update.greasyfork.org/scripts/524095/Mastodon%20%20Twitter%E6%8A%95%E7%A8%BF%E3%83%9C%E3%82%BF%E3%83%B33%2C3.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Mastodon設定
    const mastodonAccessToken = "　"; // Mastodonアクセストークン
    const mastodonInstanceUrl = "　"; // MastodonインスタンスURL

    // ボタンを作成してページに追加
    function createButton() {
        const button = document.createElement("button");
        button.textContent = "投稿する";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#007bff";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.zIndex = "9999";

        // ボタンクリック時の動作
        button.addEventListener("click", () => {
            const title = document.title;
            const url = window.location.href;
            const postContent = `${title}\n${url}`;

            postToMastodon(postContent);
            openTwitterPostWindow(postContent);
        });

        document.body.appendChild(button);
    }

    // Mastodonに投稿
    function postToMastodon(content) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${mastodonInstanceUrl}/api/v1/statuses`,
            headers: {
                Authorization: `Bearer ${mastodonAccessToken}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ status: content }),
            onload: function (response) {
                if (response.status === 200) {
                    showTemporaryMessage("Mastodonに投稿が完了しました！");
                } else {
                    console.error("Mastodon投稿エラー:", response.responseText);
                    showTemporaryMessage("Mastodonへの投稿に失敗しました。", true);
                }
            },
            onerror: function (error) {
                console.error("Mastodon通信エラー:", error);
                showTemporaryMessage("Mastodonへの接続に失敗しました。", true);
            },
        });
    }

    // Twitter投稿ウィンドウを開く
    function openTwitterPostWindow(content) {
        const encodedContent = encodeURIComponent(content);
        const twitterUrl = `https://x.com/intent/tweet?text=${encodedContent}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
    }

    // 一時的なメッセージを表示する関数
    function showTemporaryMessage(message, isError = false) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.position = "fixed";
        messageDiv.style.bottom = "20px";
        messageDiv.style.right = "20px";
        messageDiv.style.backgroundColor = isError ? "#ff4d4d" : "#007bff"; // エラーの場合は赤、成功時は青
        messageDiv.style.color = "white";
        messageDiv.style.padding = "10px 20px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        messageDiv.style.zIndex = "9999";

        document.body.appendChild(messageDiv);

        // 2秒後に自動的に削除
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    // 対象サイトのみボタンを追加
    const targetSites = [
      　"https://www.msn.com/ja-jp",
      　"https://www.amazon.co.jp/",
        "https://www.youtube.com/",
        "https://www.yahoo.co.jp/",
        "https://news.yahoo.co.jp/",
        "https://www.gigafree.net/",
    ];
    if (targetSites.some((site) => window.location.href.startsWith(site))) {
        createButton();
    }
})();
