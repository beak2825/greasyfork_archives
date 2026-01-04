// ==UserScript==
// @name         钉钉关键字消息查询
// @namespace    http://sherry.cf/
// @version      1.0
// @description  根据关键字的查询匹配的消息并打开
// @author       Sherry
// @match        https://im.dingtalk.com/*
// @downloadURL https://update.greasyfork.org/scripts/406981/%E9%92%89%E9%92%89%E5%85%B3%E9%94%AE%E5%AD%97%E6%B6%88%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/406981/%E9%92%89%E9%92%89%E5%85%B3%E9%94%AE%E5%AD%97%E6%B6%88%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
/// jQuery
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
(function() {
    'use strict';
    var html = `
    <div style="position: absolute;top:60px;left: 400px; color:#fff;height:40px;width:220px;padding:10px;">
    <input type="text" placeholder="输入关键字" id="link-keyword"/><input type="button" value="开启" id="link-search-btn"/>
    <input type="button" value="关闭" id="link-search-close" style="display:none;float:right"/>
    </div>
    <script>
        var openNewNoticeTimer;

        $("#link-search-btn").click(function(){
            var keyword=$("#link-keyword").val();
            $("#link-search-btn").hide();
            $("#link-search-close").show();

            openNewNoticeTimer= setInterval(function(){
            $(".latest-msg").each(function(){
                if ($(this).text().indexOf(keyword) != -1 ){
                    console.log($(this).text());
                    $(this).css("border","1px solid red");
                    $(this).click();
                }
            });
            },1000);
            $("#link-search-close").click(function(){
                clearInterval(openNewNoticeTimer);
            })
        });

        $("#link-search-close").click(function(){
            $("#link-search-btn").show();
            $("#link-search-close").hide();
            $(".latest-msg").css("border","none");
            clearInterval(openNewNoticeTimer);
        });
    </script>
    `;
    $('body').append(html);
})();