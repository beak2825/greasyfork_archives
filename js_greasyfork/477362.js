// ==UserScript==
// @name         reaction-button (^_^)/~
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description ハートを消すよ
// @license MIT
// @author       You
// @match        https://www.youtube.com/live_chat?is_popout*
// @match       https://studio.youtube.com/live_chat?is_popout*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-typing.ne.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477362/reaction-button%20%28%5E_%5E%29~.user.js
// @updateURL https://update.greasyfork.org/scripts/477362/reaction-button%20%28%5E_%5E%29~.meta.js
// ==/UserScript==

(function() {
    document.body.insertAdjacentHTML("beforeend", `<style>
    #reaction-control-panel{
    display: none;
    }
    </style>`)
})();