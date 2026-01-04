// ==UserScript==
// @name        新赚吧自动回复
// @namespace   新赚吧自动回复
// @match       https://v1.xianbao.net/forum.php?mod=viewthread&tid=55190*
// @match       https://v1.xianbao.net/thread-55190*
// @match       https://v1.xianbao.net/app.php?p=threadrush&action=awardlis*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/11/21 下午8:52:03
// @downloadURL https://update.greasyfork.org/scripts/447939/%E6%96%B0%E8%B5%9A%E5%90%A7%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/447939/%E6%96%B0%E8%B5%9A%E5%90%A7%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function () {

    var L_url = window.location.href;
    var a_url = "app.php?p=threadrush&action=awardlist";

    if (L_url.indexOf(a_url) != -1) {
        console.log("BBBB");
        auto_get();
        return;
    }
    //console.log("AAAAAAA");
    const inter_base = 6000;
    var i = 1;
    var inter = inter_base;
    const messages = "新赚吧越来越好";
    fastpostmessage = document.querySelector("#fastpostmessage");
    function auto_post() {
        document.title = String(i);
        console.log("post");
        fastpostmessage.value = messages;
        console.log(inter);
        document.querySelector("#fastpostsubmit").click();
        inter = Math.round(Math.random() * 8 + 7);
        i = i + 1;
        if (i >= 15) {
            location.reload();
        }
    }

    function auto_get() {

        var x = document.getElementsByClassName("xi2");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].click();
        }

    }
    if (fastpostmessage) {
        setInterval(auto_post, inter);
      console.log("fast 有效");

    } else {
        console.log("fast 无效");
        setTimeout(function(){location.reload();},10000);

    }

})();
