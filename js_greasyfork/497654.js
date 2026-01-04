// ==UserScript==
// @name         Change the copied link to twitter.com instead of x.com
// @name:ja      コピーされたリンクを x.com ではなく twitter.com に変更してください。
// @name:zh-TW   將複製的連結改為 twitter.com 而不是 x.com
// @name:zh-cn   将复制的连结改为 twitter.com 而不是 x.com
// @version      1.0
// @description  Change copied link to start with twitter.com instead of x.com
// @description:ja    x.comから始まるコピーされたリンクをtwitter.comから始まるように変更する
// @description:zh-tw 將複製的連結改為以 twitter.com 開頭而不是 x.com
// @description:zh-cn 将复制的连结改为以 twitter.com 开头而不是 x.com
// @author       movwei
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/497654/Change%20the%20copied%20link%20to%20twittercom%20instead%20of%20xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/497654/Change%20the%20copied%20link%20to%20twittercom%20instead%20of%20xcom.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function modifyLink(text) {
        if (text.startsWith('https://x.com/')) {
            const modifiedText = text.replace('https://x.com/', 'https://twitter.com/');
            navigator.clipboard.writeText(modifiedText);
        }
    }

    document.addEventListener('copy', function(event) {
        const selection = window.getSelection().toString();
        if (selection && selection.startsWith('https://x.com/')) {
            modifyLink(selection);
        }
    });
})();