// ==UserScript==
// @name        colg黑名单
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to maker the world better!
// @author       李生
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://bbs.colg.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404552/colg%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/404552/colg%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
      jQuery.noConflict();
    (function ($) {
    if (/forum-/.test(location.href)) {
    console.log("恭喜forum加载jquery成功");
        var count=0;
    $("td.by a[c='1'][href]").each(function () {
        //取消所有绑定的事件
        $(this).click(function (e) {
            let temp = e.target.innerHTML;
            e.target.innerHTML = "拉黑成功";
            localStorage.setItem(temp, "black");
            temp = "";
        });

        $(this).removeAttr("href");
        $(this).removeAttr("id");
        $(this).removeAttr("c");
        var atargetInner = $(this).text();
        //自动读取本地保存的名单
        if (atargetInner.length > 0 && atargetInner !== null && localStorage.getItem(atargetInner) === "black") {
            $(this).closest("tbody[id]").hide();
            count++;
        }
    });
        console.log("干掉了 "+count+" 个帖子!");
} else if (/thread-/.test(location.href)) {
    //在贴子里
     var count=0;
    console.log("恭喜贴子里加载jquery成功");
    var xuanfuColg = $("<div style='z-index: 9999; position: fixed ! important; width:100%; top: 0px;'><table><input type='text' value='' id='myinputb' style='width:5%;color:red;'><input type='button' value='黑' id='mybutton' ></table></div>");
    $(document.body).append(xuanfuColg);
    $("input#mybutton").click(function () {
        let myinputval = $("input#myinputb").val();
        localStorage.setItem(myinputval, "black");
        alert("恭喜成功拉黑 " + myinputval);
        myinputval = "";
        $("input#myinputb").val("");

    });
    $("div.authi a[href][target][class='xw1']").each(function () {
        var atargetInner = $(this).text();
        if (atargetInner.length > 0 && atargetInner !== null && localStorage.getItem(atargetInner) === "black") {
            $(this).closest("div[id]:not([class])").hide();
            count++;
        }
    });
    console.log("帖子内干掉了 "+count+" 个回复");
}

})(jQuery);
    // Your code here...

})();