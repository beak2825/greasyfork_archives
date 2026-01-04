// ==UserScript==
// @name    49lottery页简化
// @namespace   https://greasyfork.org/users/1284284
// @match   https://huodong.4399.cn/game///api/huodong/daily/yxhGameSubscribe.html?scookie=*
// @grant    none
// @version  1.0
// @description  lottery页简化只剩人和奖
// @downloadURL https://update.greasyfork.org/scripts/491720/49lottery%E9%A1%B5%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491720/49lottery%E9%A1%B5%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    var bodyText = document.body.innerHTML;
    var keyword = "taskList";
    var startIndex = bodyText.indexOf(keyword);

    if (startIndex !== -1) {
        document.body.innerHTML = bodyText.substring(0, startIndex + keyword.length);
    }
})();

(function() {
    var bodyText = document.body.innerHTML;
    var keyword = "carouselList";
    var startIndex = bodyText.indexOf(keyword);

    if (startIndex !== -1) {
        document.body.innerHTML = bodyText.substring(startIndex + keyword.length);
    }
})();