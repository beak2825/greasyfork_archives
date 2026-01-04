// ==UserScript==
// @name        tweetdeck paku tweet
// @namespace   https://tweetdeck.twitter.com/
// @description Let's paku tui!
// @version     0.9
// @grant       none
// @match     https://twitter.com/i/tweetdeck*
// @downloadURL https://update.greasyfork.org/scripts/429573/tweetdeck%20paku%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/429573/tweetdeck%20paku%20tweet.meta.js
// ==/UserScript==

(function() {
    let FLAG = true;
    function pakuTweet(e) {
        // if (!confirm("パクツイしますか？")) return; // この行の先頭の//を消せばパクツイ前に確認する
        let parent = e.target.closest(".js-tweet");
        // parent.querySelector(".js-icon-favorite").click(); // この行の先頭の//を消せばふぁぼする
        let tweet = parent.querySelectorAll(".tweet-text")[0].innerHTML;
        tweet = tweet
            .replace(/<img class="emoji" draggable="false" alt="([^"]*)" src="([^"]*)">/g, "$1")
            .replace(/<a href="([^"]*)" target="_blank" class="url-ext"[^>]*>[^<]*<\/a>/g, "$1")
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
        console.log(e.ctrlKey);
        if (e.ctrlKey) {
            let s = tweet.match(/\d+$/);
            if (s !== null) {
              tweet = tweet.replace(/\d+$/, parseInt(s)+1);
            } else {
              tweet = tweet + "2";
            }
        }
        let textarea = document.querySelector(".js-compose-text");
        if (textarea === null) {
            document.querySelector(".tweet-button").click();
            textarea = document.querySelector(".js-compose-text");
        }
        textarea.value = tweet;
        let event = document.createEvent("HTMLEvents");
        event.initEvent("change", false, false);
        textarea.dispatchEvent(event);
        if (!e.shiftKey) document.querySelector(".js-send-button").click();
    }

    function appendButton(node) {
        let target = node.querySelectorAll(".js-tweet-actions .tweet-action-item")[3];
        if (target === null || undefined) return;
        let src= document.createElement("li");
        src.className = "tweet-action-item pull-left margin-r--13 margin-l--1";
        let src_a = document.createElement("a");
        src_a.className = "tweet-action position-rel";
        src_a.href = "#";
        src_a.textContent = "(´･_･`)";
        src.appendChild(src_a);
        let item = target.parentNode.insertBefore(src, target);
        item.querySelector("a").addEventListener("click", pakuTweet);
    }

    while (FLAG) {
        if (document.querySelector(".application") !== null) {
            setTimeout(() => {}, 300);
            let observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType == node.ELEMENT_NODE && node.classList.contains('js-stream-item')) {
                            appendButton(node);
                        }
                    });
                });
            });
            observer.observe(document.body, {childList: true, subtree: true});
            FLAG = false;
        }
    }
})();