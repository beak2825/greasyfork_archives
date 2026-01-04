// ==UserScript==
// @name         保理商学院-视频自动继续学习
// @namespace    https://polycn.zhixueyun.com
// @version      0.1
// @description  自动点击视频观看中出现的继续学习按钮
// @author       星星课
// @match        https://polycn.zhixueyun.com*
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432208/%E4%BF%9D%E7%90%86%E5%95%86%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/432208/%E4%BF%9D%E7%90%86%E5%95%86%E5%AD%A6%E9%99%A2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        var play_tags = $("span:contains('播放')");
        for (var i = 0; i < play_tags.length; i += 1) {
            if (play_tags.eq(i).text() == "播放") {
                play_tags.eq(i).click();
            }
        }
        if ($("div.alert-shadow").find(".btn-ok").length > 0) {
            $("div.alert-shadow").find(".btn-ok").click();
        }
    }, 5000);


})();