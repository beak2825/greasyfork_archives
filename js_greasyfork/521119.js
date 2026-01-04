// ==UserScript==
// @name         Auto Delete Retweet - Twitter/X
// @name:zh-TW   自動化刪除Retweets - Twitter/X
// @namespace    github.com/regu-miabyss
// @version      1
// @description  Delete All of Your Retweets.
// @description:zh-TW  自動地刪除你的轉推。
// @author       Regu_Miabyss
// @run-at       document-end
// @match        https://twitter.com/*
// @match        https://X.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521119/Auto%20Delete%20Retweet%20-%20TwitterX.user.js
// @updateURL https://update.greasyfork.org/scripts/521119/Auto%20Delete%20Retweet%20-%20TwitterX.meta.js
// ==/UserScript==

setInterval(
    function() {
        document.querySelector('[data-testid="unretweet"]').click()
        document.querySelector('[data-testid="unretweetConfirm"]').click()
    },
    15
)