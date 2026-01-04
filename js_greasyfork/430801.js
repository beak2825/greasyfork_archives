    // ==UserScript==
    // @name        Automatically redeem steam keys
    // @namespace   UnmetPlayer
    // @description Automatically redeems steam keys
    // @match       https://store.steampowered.com/account/registerkey?key=*
    // @version     1.0
    // @author      UnmetPlayer
    // @grant       none
// @downloadURL https://update.greasyfork.org/scripts/430801/Automatically%20redeem%20steam%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/430801/Automatically%20redeem%20steam%20keys.meta.js
    // ==/UserScript==
     
    (function() {
        document.querySelector("#accept_ssa").click()
        document.querySelector("#register_btn > span").click()
    })();