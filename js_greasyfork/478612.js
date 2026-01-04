// ==UserScript==
// @name               Greasefork auto redirect Sleazyfork discussions
// @name:zh-TW         Greasefork 自動跳轉成人回饋
// @name:zh-CN         Greasefork 自动跳转成人反馈
// @name:ja            Greasefork 自動ジャンプ成人向のフィードバック
// @namespace          https://greasyfork.org/
// @version            1.0
// @description        Redirect to Sleazyfork when discussions is adult.
// @description:zh-TW  Greasefork 自動跳轉成人回饋到 Sleazyfork。
// @description:zh-CN  Greasefork 自动跳转成人反馈到 Sleazyfork。
// @description:ja     Greasefork から Sleazyfork の成人向けフィードバックに自動的にジャンプします。
// @license            MIT
// @author             HrJasn
// @match              http*://greasyfork.org/*/scripts/*/discussions/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/478612/Greasefork%20auto%20redirect%20Sleazyfork%20discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/478612/Greasefork%20auto%20redirect%20Sleazyfork%20discussions.meta.js
// ==/UserScript==

(() => {
    'use strict';

    fetch(window.location.href).then( (r) => {if(r.status !== 200){window.location.href = window.location.href.replace(/(:\/\/greasyfork\.org\/)/,"://sleazyfork.org/")}});
})();