// ==UserScript==
// @name         BotBirdの枠拡張
// @namespace    twitter.com/to_ku_me
// @version      0.1.1
// @description  小さすぎて打てなぁぁぁい！！！！
// @author       to_ku_me
// @match        https://botbird.net/admin/bot_random.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=botbird.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446944/BotBird%E3%81%AE%E6%9E%A0%E6%8B%A1%E5%BC%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/446944/BotBird%E3%81%AE%E6%9E%A0%E6%8B%A1%E5%BC%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let i = document.querySelector("#message_new");
    i.style.height = "400px";
    for (let k of document.querySelectorAll("div:nth-child(2) > div:nth-child(1) > div.bb_textarea > textarea")){
        k.style.height = "400px";
    }
})();