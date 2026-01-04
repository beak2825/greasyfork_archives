// ==UserScript==
// @name         自用论坛辅助签到
// @namespace    bbsdk
// @version      0.0.3
// @description  常用论坛辅助签到工具，包括52破解、卡饭
// @author       shyper
// @include      http*://*.52pojie.cn/*
// @include      http*://*.kafan.cn/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/396856/%E8%87%AA%E7%94%A8%E8%AE%BA%E5%9D%9B%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396856/%E8%87%AA%E7%94%A8%E8%AE%BA%E5%9D%9B%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
//52破解
    if(matchURL("52pojie.cn")){
        var qdimg = $("img[src$='qds.png']");
        if(qdimg) {
            $.ajax({
                url:'home.php?mod=task&do=apply&id=2',
                dataType:'html',
                success:function(result){
                    if(result.indexOf('任务已完成') != -1){
                        console.log("签到成功!");
                        qdimg.attr('src','https://www.52pojie.cn/static/image/common/wbs.png');
                    }
                }
            })
        }
    }

//卡饭
    if(matchURL("bbs.kafan.cn")){
        var dklink = $("img[src$='dk.png']");
        if(dklink) {
           $.ajax({
               url:'plugin.php?id=dsu_amupper&ppersubmit=true&formhash=e28ae346',
               dataType:'html',
               success:function(result){
                    if(result.indexOf('签到完毕') != -1){
                        console.log("签到成功!");
                        dklink.attr('src','https://a.kafan.cn/plugin/dsu_amupper/images/wb.png');
                    }
               }
               })
        }
    }
    function matchURL(x){
        return window.location.href.indexOf(x) != -1;
    }
})();