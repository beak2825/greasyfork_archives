// ==UserScript==
// @name         Fix twitter "@tweet" notification
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Fix browser notifications directing user to "@tweet" account
// @author       SL1900
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445503/Fix%20twitter%20%22%40tweet%22%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/445503/Fix%20twitter%20%22%40tweet%22%20notification.meta.js
// ==/UserScript==

(function() {
    'use strict'

    let interval_id = setInterval(()=>{
        let tweet_id = window.location.href.match(/(?<=id=)\d*/igm);
        let is_tweet_account = window.location.href.match(/\.com\/tweet/igm);

        console.log("[CHECKING @tweet]");

        if(!is_tweet_account) {
            clearInterval(interval_id);
            return;
        }

        window.location.href = `https://twitter.com/doesntmatter/status/${tweet_id}`;
        console.log("[REDIRECTING FROM @tweet]");
    },1000);

})();