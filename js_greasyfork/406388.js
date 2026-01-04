// ==UserScript==
// @name         Hide blocked user in Youtube Live
// @namespace    https://twitter.com/rin_jugatla
// @version      0.2.1
// @description  Dynamically hiding blocked users' chats in Youtube live. Youtubeのライブでブロック済みのユーザのチャットを動的に非表示に変更
// @author       rin_jugatla
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406388/Hide%20blocked%20user%20in%20Youtube%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/406388/Hide%20blocked%20user%20in%20Youtube%20Live.meta.js
// ==/UserScript==

// ブロックしたユーザの確認
// https://myaccount.google.com/blocklist

// 【Javascript】XPathを使う（document.evaluate）
// https://www.softel.co.jp/blogs/tech/archives/2067
document.getElementsByXPath = function (expression, parentElement) {
    var r = []
    var x = document.evaluate(expression, parentElement || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    for (var i = 0, l = x.snapshotLength; i < l; i++) {
        r.push(x.snapshotItem(i))
    }
    return r
}

// ページの読み込み完了後処理
window.addEventListener('load', function () {

    function hideAny()
    {
        hideBlockedUser();
        hideCard();
    }

    function hideBlockedUser() {
        // 非表示でないブロック済みのメッセージのみ取得するXPath
        var targetsXPath = '//yt-live-chat-text-message-renderer[@class="style-scope yt-live-chat-item-list-renderer" and not(@style="display: none;")]/div[@id="content"]/span[@id="deleted-state" and not(text() = "")]';
        var targets = document.getElementsByXPath(targetsXPath);
        for(var i = 0; i < targets.length; i++)
        {
            targets[i].parentElement.parentElement.style = "display: none;";
        }
    }

    function hideCard(){
        // 非表示でないチャットガイドラインカードを取得するXPath
        // 「チャットへようこそ！ご自身のプライバシーを守るとともに、YouTube のコミュニティ ガイドラインを遵守することを忘れないでください。」
        var targetsXPath = '//yt-live-chat-viewer-engagement-message-renderer[@class="style-scope yt-live-chat-item-list-renderer" and not(@style="display: none;")]';
        var targets = document.getElementsByXPath(targetsXPath);
        for(var i = 0; i < targets.length; i++)
        {
            targets[i].style = "display: none;";
        }
    }

    // フック
    var mo = new MutationObserver(hideAny);
    var watchTree = document.getElementsByXPath('//div[@id="items" and @class="style-scope yt-live-chat-item-list-renderer"]')[0]
    mo.observe(watchTree, { childList: true });
}, false);
