// ==UserScript==
// @name         steam自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://steamcommunity.com/openid/login?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31690/steam%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/31690/steam%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var y = document.getElementById("imageLogin");
    if(y){
        y.click();
    }
})();