// ==UserScript==
// @name         ConfluenceAutoTools4EMB
// @namespace    http://www.akuvox.com/
// @version      1.4
// @description  take on the world!
// @author       andy.wang
// @match        http://192.168.12.4:8069/pages*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/435919/ConfluenceAutoTools4EMB.user.js
// @updateURL https://update.greasyfork.org/scripts/435919/ConfluenceAutoTools4EMB.meta.js
// ==/UserScript==

(function() {
    //主函数开始
    //创建button
    console.log("ConfluenceAutoTools4EMB")

    //自己的方法
    function autoCloseNotice(){
        var obj_conf = document.getElementById("com-atlassian-confluence");
        if(!obj_conf)
        {
            return;
        }

        var obj = document.getElementById("aui-flag-container");
        console.log(obj)
        obj.remove();

        //var notice_board = document.getElementsByClassName("aui-flag");
        //console.log("ConfluenceAutoTools4EMB 2")
        //console.log(notice_board)

        //notice_board.getAttributeNode("aria-hidden").value = "true";
        //console.log("ConfluenceAutoTools4EMB 3")

        //var notice_board2 = document.getElementsByClassName("aui-flag");
        //notice_board2[0].getAttributeNode("aria-hidden").value = "true";

    }

     if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        autoCloseNotice();
    } else {
           window.onload = autoCloseNotice;

    }
})();