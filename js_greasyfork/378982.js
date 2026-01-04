// ==UserScript==
// @name         xccs-baiduscript
// @name:zh-CN   兴城畅搜网络描人脚本
// @namespace    http://tampermonkey.net/
// @description  Private script, no secondary release!
// @description:zh-CN 私有脚本，禁止二次发布！
// @version      0.31
// @description  try to take over the world!
// @author       You
// @match        http://test.baidu.com/*
// @match        https://test.baidu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/378982/xccs-baiduscript.user.js
// @updateURL https://update.greasyfork.org/scripts/378982/xccs-baiduscript.meta.js
// ==/UserScript==

(function() {
    var t1 = window.setInterval(refreshCount, 1000);
    var a,m,x,b;
    var aa = new Array();
    var bb = new Array();
    var cc = new Array();
    function refreshCount()
    {
        a = $(" #question_json ").val();
        if(a!="")
        {
            window.clearInterval(t1);
            $("#hotKeyLabelDiv").addClass("dn");
            $(".limit-desc-item").remove();
            aa = a.split(",");
            bb = aa[0].split("#");
            cc = bb[2].split('"');
            m = cc[0].split("\\").join("");
            x = m.split("%40");
            b = parseInt(x[2])-5;
            console.log(m);
            var txt1=document.createElement("img");
            //这里面写代码
            //txt1.innerHTML="<img src='" + x[0] + "@@" + b + "@@.jpg' style='width:auto;height:auto;max-width:100%;max-height:100%' />";
            txt1.src=x[0] + "@@" + b + "@@.jpg";
            //console.log(x[0] + "@@" + b + "@@.jpg");
            txt1.style="width:auto;height:auto;max-width:100%;max-height:100%";
            $(".mark-rect-draw-attr").prepend(txt1);
            //var txt2=document.createElement("div");
            //txt2.class="bui-btn hollow button-mark button-white";
            //txt2.style="min-width: 130px; color: rgb(128, 128, 128); user-select: none;"
            //txt2.innerHTML="点击";
            $(".control-panel").append("<div class='bui-btn hollow button-mark button-white' style='min-width: 130px; color: rgb(128, 128, 128); user-select: none;'>点击</div>");
            //&lt;div class='bui-btn hollow button-mark button-white' style='min-width: 130px; color: rgb(128, 128, 128); user-select: none;'&gt;123
            //append在结尾插入
            // $(".bui-btn.hollow.button-mark.button-white").prepend(txt1);
            //上面写代码吧
        }
    }

})();