// ==UserScript==
// @name         fuck_geek-share.com
// @namespace    https://github.com/geekyouth/
// @version      1.0
// @description  fuck_geek-share.com，移除页面推广信息
// @author       GeekYouth
// @match        https://www.geek-share.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397903/fuck_geek-sharecom.user.js
// @updateURL https://update.greasyfork.org/scripts/397903/fuck_geek-sharecom.meta.js
// ==/UserScript==


(function() {


var f1 = function loop() {
    var xxoo1 = document.querySelector("body > div.ThinkBox-wrapper.ThinkBox-default");
    var xxoo2 = document.querySelector("body > div.ThinkBox-modal-blackout.ThinkBox-modal-blackout-default");
    if (xxoo1) {
        console.log("检测到 xxoo1，开始删除=====================");
        xxoo1.remove();
    } else {
        console.log("xxoo1 不存在 ===========================");
    }
    if (xxoo2) {
        console.log("检测到 xxoo2，开始删除=====================");
        xxoo2.remove();
    } else {
        console.log("xxoo2 不存在 ===========================");
    }

    xxoo1 = document.querySelector("body > div.ThinkBox-wrapper.ThinkBox-default");
    xxoo2 = document.querySelector("body > div.ThinkBox-modal-blackout.ThinkBox-modal-blackout-default");
    if (!xxoo1 || !xxoo2) {
        console.log("xxoo 都不在 ===============================");
    } else {
        console.log("删除失败了 ================== 等一秒递归 ");
        setTimeout(f1, 1000);
    }

}

//如果网页加载很慢，这里的延时可以适当调大
setTimeout(f1, 2000);

})();