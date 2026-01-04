// ==UserScript==
// @name     mgz
// @namespace  https://greasyfork.org/zh-CN/users/104201
// @version    0.1
// @author     mgz
// require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @match    *://sports.qq.com/*


// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/375894/mgz.user.js
// @updateURL https://update.greasyfork.org/scripts/375894/mgz.meta.js
// ==/UserScript==


(function() {
    $(document).ready(function() {
        $("#J_arcarousel").remove();
        $("#Sports_NBA_Full").remove();
        $(".inner").remove();
        $(".ad-banner.area").remove();
    });
})();