// ==UserScript==
// @name            quick summon refersh
// @name:zh         快速召唤自动刷新
// @namespace       http://tampermonkey.net/
// @version         0.2
// @description     Automatically refresh the page after clicking the quick call button
// @description:zh  点击快速召唤后自动刷新页面
// @author          NatsuMatsu
// @match           https://game.granbluefantasy.jp/
// @icon            https://www.google.com/s2/favicons?sz=64&domain=granbluefantasy.jp
// @license         GPL
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/457952/quick%20summon%20refersh.user.js
// @updateURL https://update.greasyfork.org/scripts/457952/quick%20summon%20refersh.meta.js
// ==/UserScript==

(function() {
    var qsum_btn = null
    var used = 0
    setInterval(() => {
         if(used == 1)
         {
             location.reload()
         }
         qsum_btn = document.getElementById('js-btn-quick-summon')
         if (qsum_btn)
         {
             if (qsum_btn.className === "btn-quick-summon qs-ready")
             {
                 used = -1
             }
             else if (used == -1 && (qsum_btn.className === "btn-quick-summon qs-used" || qsum_btn.className === "btn-quick-summon qs-recast"))
             {
                 used = 1
             }
         }
     }, 100)


    // Your code here...
})();