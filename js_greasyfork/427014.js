// ==UserScript==
// @name         ACG游戏论坛自动回帖
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  帮助自动回帖，一键查看预览图
// @author       lpq
// @match        https://*.2046acg.com/*
// @match        https://*.acgyouxi.vip/*
// @match        https://*.yuanacg.com/*
// @match        https://bbs.90acgxc.com/
// @match        https://mx1.mhyacg.com/
// @match        https://bbs.90acgxc.com/
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/427014/ACG%E6%B8%B8%E6%88%8F%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427014/ACG%E6%B8%B8%E6%88%8F%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    var $ = jQuery.noConflict();

    $("#nv_forum").append('<div class="focus plugin" id="ip_notice"><div class="bm"><div class="bm_c"><p class="ptn cl"><a href="javascript:()" id="viewImg" class="xi2 y one-pan-link-mark">新窗口查看预览图</a></p></div></div><div class="bm"><div class="bm_c"><p class="ptn cl"><input type="checkbox" id="memoryShow"><a href="javascript:()" id="showImg" class="xi2 y one-pan-link-mark">本帖显示预览图</a></p></div></div></div>');
    $(".plugin").css("width","130px");$(".plugin .bm").css("background","#f8ba31");


    $("#viewImg").click(function(){
        $("a[href]").each(function(){
            var href=$(this).attr("href");
            if(href.indexOf(".jpg")!=-1||href.indexOf(".gif")!=-1){
                window.open($(this).attr("href"))
            }
        })
        $(this).parent().parent().parent().remove();
    })

    $("#showImg").click(function(){
        showImg()
        $(this).parent().parent().parent().remove();
    })

    var memoryShow = $.cookie('memoryShow');
    if(memoryShow == "true"){
        $("#memoryShow").prop("checked","checked")
      setTimeout(function(){showImg()},1000)
    }

    $("#memoryShow").click(function(){
        if($(this).prop("checked")==true){
            $.cookie('memoryShow',true)
            showImg()
        }else{
            $.cookie('memoryShow',false)
        }
    })

    function showImg(){
        console.log( $("strong a[href]"))
        $("strong a[href]").each(function(){
            var href=$(this).attr("href");
            if(href.indexOf(".jpg")!=-1||href.indexOf(".gif")!=-1){
                $(this).html('<img onclick="zoom(this, this.src, 0, 0, 0)" class="zoom" src="'+$(this).attr("href")+'" onmouseover="img_onmouseoverfunc(this)" onload="thumbImg(this)" border="0" alt="" >')
            }
        })
    }


     //判断是否回复过
    var locked=$(".locked").text()!=""?true:false;
    //如果没有回复
    if(locked){
        //模拟回复
        $("[name=message]").val("看了LZ的帖子，我只想说一句很好很强大！");
        $("#fastpostsubmit").click();
        setTimeout(function(){ scrollTo(0,0);location.reload() }, 1500);
    }else{
        //自动跳转到第一页
        var href=location.href;
        if(href.indexOf("forum.php")!=-1){
            function GetQueryString(name)
            {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
            };
            var doMain=href.substring(0,href.indexOf("forum.php"));
            var tid=GetQueryString("tid");
            IF(tid!=null)
            location.href=doMain+"thread-"+tid+"-1-1.html";
        }else if(href.indexOf("thread")!=-1){
            var detailPage=href.substring(href.indexOf("thread")+7);
            var beforePage=href.substring(0,href.indexOf("thread"));
            var params=detailPage.split("-");
            var currentPage=params[1];
            if(currentPage!=1){
                location.href=beforePage+"thread-"+params[0]+"-1-1.html";
            }
        }
    }
})();