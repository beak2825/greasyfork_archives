// ==UserScript==
// @name         优课视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优质课教学视频在线看
// @author       二当家
// @match        *.sp910.com/*
// @icon         https://www.sp910.com/favicon.ico
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428225/%E4%BC%98%E8%AF%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/428225/%E4%BC%98%E8%AF%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var videoTool = {
        //获取文件名
        getSpid: function (url, rule_start, rule_end) {
                var start = url.lastIndexOf(rule_start) + 1;
                var end = url.lastIndexOf(rule_end);
                return url.substring(start, end);
            },
            //弹出下载框
            download: function (videoUrl, name) {
                var content = "file content!";
                var data = new Blob([content], {
                    type: "text/plain;charset=UTF-8"
                });
                var downloadUrl = window.URL.createObjectURL(data);
                var anchor = document.createElement("a");
                anchor.href = videoUrl;
                anchor.download = name;
                anchor.click();
                window.URL.revokeObjectURL(data);
            }
    };

     $(function () {
       var htmlAll = window.document;
       var furl = window.location.href;
       var spid = videoTool.getSpid(furl,'/','.html');
       console.log($.isNumeric(spid));
         if($.isNumeric(spid)){
         $.get("https://www.tas01.com/curl.php", {
             url: furl
         },function(checkmail) {
             console.log("checkemail: " + checkmail);
             if (checkmail != null) {
                 /* do something */
                 if(checkmail.indexOf("youkuplayer") >= 0){
                     $("#playframe").attr('src','/Movie/play_sk.asp?id='+spid);
                 }else{
                     $("#movieplay").html(checkmail);
                 }
             }
         }
              );
         }
    });
})();


