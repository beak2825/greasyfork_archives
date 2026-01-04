// ==UserScript==
// @name            Instagram Video Volume Controller
// @name:ja         Instagramの動画の音量を下げる
// @namespace       https://greasyfork.org/users/1324207
// @match           https://www.instagram.com/*
// @version         1.2
// @author          Lark8037
// @description     Sets the volume of Instagram videos to 10%.
// @description:ja  Instagramの動画の音量を10%にします。
// @license         MIT
// @icon            https://www.instagram.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/499139/Instagram%20Video%20Volume%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/499139/Instagram%20Video%20Volume%20Controller.meta.js
// ==/UserScript==

(() => {
    const v = () => document.querySelectorAll('video').forEach(e => {
        if (e.volume !== 0.1) e.volume = 0.1;
    });
    addEventListener('load', v);
    addEventListener('DOMContentLoaded', v);
    new MutationObserver(v).observe(document, {subtree:1,childList:1});
    v();
})();