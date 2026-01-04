// ==UserScript==
// @name         哔哩哔哩直播回放链接提取工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       撒哈拉来的企鹅
// @match        https://live.bilibili.com/record/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/397772/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/397772/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
        "<div id='getaddress' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>获取下载地址</div>" +
        "</div>";
    $("body").append(topBox);
    $("body").on("click", "#getaddress", function () {
        var window_url = window.location.href;
        console.log(window_url.split("/")[4].split("?")[0]);
        GM_xmlhttpRequest({
            url: "https://api.live.bilibili.com/xlive/web-room/v1/record/getLiveRecordUrl?rid=" + window_url.split("/")[4].split("?")[0] + "&platform=html5",
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (response) {
                var data = eval('(' + response.responseText + ')');
                var list = data.data.list;
                var text = "";
                for (var i = 0; i < list.length; i++) {
                    console.log(list[i].url)
                    text += ("<p>"+list[i].url +"</p>");
                }
                var myWindow=window.open('','','left=200,top=100,width=1000,height=500');
                myWindow.document.write(text);
                myWindow.focus();
            }
        });
    });
    
})();