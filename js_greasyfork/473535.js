// ==UserScript==
// @name         自用-陌路人发消息
// @namespace    灌云-赵小倩
// @version      1.0
// @description  陌路人自动发消息
// @author       赵小倩QQ1146048024
// @match        *://chat.xueliang.org/*
// @icon
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473535/%E8%87%AA%E7%94%A8-%E9%99%8C%E8%B7%AF%E4%BA%BA%E5%8F%91%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/473535/%E8%87%AA%E7%94%A8-%E9%99%8C%E8%B7%AF%E4%BA%BA%E5%8F%91%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    setInterval(function() {
         var dd = document.getElementsByClassName("text-danger").length;
        if (document.getElementsByClassName("bg-secondary").length == 3) {
            if (document.getElementsByClassName("bg-secondary")[2].innerText == '对方已说再见，会话被终止...' || '你已与对方说再见，会话被终止...') {
                document.getElementsByTagName("BUTTON")[8].click();
            }
        }
        if (document.getElementsByClassName("bg-secondary")[1].innerText == '对方若有恶意刷屏、低俗、辱骂等行为，请直接举报，一经核实永久封禁') {

            if (dd == 4) {
                //手机版关闭侧边栏
                //document.getElementsByTagName("BUTTON")[3].click();
                a();
            } else {
                b();
            }
        }
    },
    2000);
    function a() {
      xx("聊会吗？");
    }
    function b() {
        var c = document.getElementsByClassName("text-primary").length;
        var d = document.getElementsByClassName("text-danger").length;
        if (c == 1 && d == 5) {
            xx("你对什么话题感兴趣呢？");
        }
    }

     function xx(xiaoxi) {
          setTimeout(function() {document.getElementById("kt_input_message").value = xiaoxi;},1000);
          setTimeout(function() {document.getElementsByTagName("BUTTON")[10].click();},1001);
            }

})();