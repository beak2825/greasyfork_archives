// ==UserScript==
// @name        REDEEM STEAM KEY AUTO ACCEPT TERMS
// @name:zh-CN  在 Steam 激活密钥自动同意协议
// @namespace   XHXIAIEIN
// @match       https://store.steampowered.com/account/registerkey?key=*
// @grant       none
// @version     1.1
// @author      XHXIAIEIN
// @description From HumbleBundle Redeem the Steam Key. Automatically agree to the terms.
// @description:zh-CN 在 HumbleBundle 激活 STEAM KEY 时，自动同意协议并点击继续，然后关闭页面。
// @downloadURL https://update.greasyfork.org/scripts/425225/REDEEM%20STEAM%20KEY%20AUTO%20ACCEPT%20TERMS.user.js
// @updateURL https://update.greasyfork.org/scripts/425225/REDEEM%20STEAM%20KEY%20AUTO%20ACCEPT%20TERMS.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#accept_ssa").click();
    document.querySelector("#register_btn > span").click();
    setTimeout(() => {
      if (document.querySelector("#error_display").style['display'] == 'none') {
         window.close()
      };
    }, 1000);
})();