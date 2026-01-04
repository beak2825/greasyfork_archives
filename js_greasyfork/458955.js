// ==UserScript==
// @name         TweetDeck Unescape Double Quotes after Pasting
// @description  TweetDeckの投稿文にテキストを貼り付けた後、投稿文全体のダブルクォーテーションをアンエスケープする。
// @namespace    https://github.com/pingval/
// @version      0.00a
// @author       pingval
// @match        https://tweetdeck.twitter.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/458955/TweetDeck%20Unescape%20Double%20Quotes%20after%20Pasting.user.js
// @updateURL https://update.greasyfork.org/scripts/458955/TweetDeck%20Unescape%20Double%20Quotes%20after%20Pasting.meta.js
// ==/UserScript==

(function() {
    $(document).on('paste', 'textarea.js-compose-text', function(e) {
        const form = this;
        function unescape_DQ () {
            const from = form.value;
            //  改行を含まないなら何もしない
            if (!from.includes("\n")) {
                return;
            }
            // ダブルクォーテーションをアンエスケープ
            const to = from.replaceAll(/^"|"$/g, '').replaceAll(/""/g, '"');
            form.value = to;
            if (from != to) {
                console.log(from + ' => '+ to);
                alert("投稿文のダブルクォーテーションをアンエスケープしました\n" + from + "\n↓\n"+ to);
            }
        }
        setTimeout(unescape_DQ, 100);
    });
})();
