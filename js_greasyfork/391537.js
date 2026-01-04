// ==UserScript==
// @name         Steam 自动兑换
// @namespace    https://store.steampowered.com
// @version      0.1
// @description  从 Humble Bundle 兑换 Steam CD-Key 时，直接点击 Redeem 跳转到 Steam 后，可以自动兑换，不需要再手动点击。
// @author       Faninx
// @match        https://store.steampowered.com/account/registerkey?key=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391537/Steam%20%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/391537/Steam%20%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("accept_ssa").checked = true;
    RegisterProductKey();
})();