// ==UserScript==
// @name         微信获取图片链接
// @namespace    mscststs
// @version      0.3
// @description  微信文章图片链接获取
// @author       mscststs
// @include      /https?:\/\/mp\.weixin\.qq\.com\/s\/.*?/
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js
// @grant        unsafewindow
// @downloadURL https://update.greasyfork.org/scripts/35235/%E5%BE%AE%E4%BF%A1%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/35235/%E5%BE%AE%E4%BF%A1%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var img_list = [];
    $().ready(function(){
        $(".qr_code_pc").css("display","none");
            $(".rich_media_content img").each(function(){
                var src = $(this).attr("src");
                if(src.indexOf("base64")>1){
                    src = $(this).attr("data-src");
                }
                src = "http://img04.sogoucdn.com/net/a/04/link?appid=100520033&url="+src;
                img_list.push(src);

            });
        //console.log(img_list);
        $("body").prepend("<div id='helper_img_get' style='width:100%;height:23px;background-color:rgba(60, 166, 28,0.4);text-align:center;cursor:pointer'>点击查看图片链接列表</div>");
        $("#helper_img_get").click(function(){
            var text = "";
            for(var i=0;i<img_list.length;i++){
                text+=img_list[i]+"\n";
            }
            $("body").prepend("<textarea id='helper_img_list' style='width:100%;'>");
            $("#helper_img_list").val(text);
        });
    });
    // Your code here...
})();