// ==UserScript==
// @name         消えろX
// @namespace    https://twitter.com/hiyokunohane
// @version      0.334
// @description  Convert "X" in tweets to "Twitter"
// @author       hiyokunohane
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495255/%E6%B6%88%E3%81%88%E3%82%8DX.user.js
// @updateURL https://update.greasyfork.org/scripts/495255/%E6%B6%88%E3%81%88%E3%82%8DX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration list: [enabled, searchValue, replaceValue, replaceIfSurroundedByLetters]
    const replacements = [
        [true, 'x', 'twitter', true],
        [true, 'X', 'Twitter', true],
        [false, 'X', 'TWITTER', true],
        [true, 'ｘ', 'ｔｗｉｔｔｅｒ', true],
        [true, 'Ｘ', 'Ｔｗｉｔｔｅｒ', true],
        [true, 'エックス', 'ツイッター', true],
        [true, 'えっくす', 'ついったー', true],
        [true, 'ｴｯｸｽ', 'ﾂｲｯﾀｰ', true],
        [true, 'エッカス', 'ツイッカス', true],
        [true, 'ポスト', 'ツイート', false],
        [true, 'ぽすと', 'ついーと', true],
        [false, 'いいね', 'ふぁぼ', true],
        [true, 'ｲｲﾈ', 'ﾌｧﾎﾞ', true],
        [true, 'post', 'tweet', true],
        [true, 'Post', 'Tweet', true],
        [true, 'POST', 'TWEET', true],
        [false, 'like', 'fav', true],
        [true, 'RP', 'RT', true]
    ];

    // Function to replace text in a node
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let textContent = node.textContent;
            replacements.forEach(replacement => {
                if (replacement[0]) {
                    const searchValue = replacement[1];
                    const replaceValue = replacement[2];
                    const replaceIfSurroundedByLetters = replacement[3];

                    if (replaceIfSurroundedByLetters) {
                        // Replace only if the search value is not surrounded by letters
                        const regex = new RegExp(`(?<![a-wyzA-WYZ])${escapeRegExp(searchValue)}(?![a-wyzA-WYZ])`, 'g');
                        textContent = textContent.replace(regex, replaceValue);
                    } else {
                        // Replace normally
                        const regex = new RegExp(escapeRegExp(searchValue), 'g');
                        textContent = textContent.replace(regex, replaceValue);
                    }
                }
            });
            node.textContent = textContent;
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceText(node.childNodes[i]);
            }
        }
    }

    // Function to escape special characters for regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to replace text in tweets only
    function replaceTextInTweets() {
        const tweetSelectors = [
            'article div[lang]', // Twitter's tweet text container
            'div.css-901oao', // Possible alternative for tweet text container
            'div[data-testid="tweetText"]' // Test id used in some Twitter text containers
        ];

        tweetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(tweetNode => {
                replaceText(tweetNode);
            });
        });
    }

    // Initial replacement
    replaceTextInTweets();

    // Update every second
    setInterval(replaceTextInTweets, 1000);
})();
