// ==UserScript==
// @name         chh后台刷新
// @namespace    https://gist.github.com/popu125/c3fb0f5ee2272b78aa36b999fc72994c
// @version      0.2
// @description  把chh丢在后台，自动刷新签到
// @author       bobo liu
// @include      https://www.chiphell.com/portal.php?r
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369438/chh%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/369438/chh%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    if (/discuz_uid = '([0-9]*)'/.exec(document.getElementsByTagName("script")[4].innerHTML)[1] != 0) {
        console.log("task added: "+setTimeout(function() {
            document.location = "https://www.chiphell.com/portal.php?r";
        }, 180000));
    } else {
        alert("CHH未登录");
    }
})();