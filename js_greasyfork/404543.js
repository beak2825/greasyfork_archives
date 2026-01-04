// ==UserScript==
// @name         屏蔽广告 网站（百度、csdn、凤凰网、百度文库、凤凰网等）
// @namespace    http://tampermonkey.net/
// @version      v0.307
// @description  广告去除脚本
// @author       Skity666
// @match        https://*.baidu.com/*
// @match        http://*.baidu.com/*
// @match        https://*csdn.net*
// @match        https://www.zhihu.com/*
// @match        https://www.ifeng.com/*
// @include        https://*.baidu.com/*
// @include        https://*csdn.net*
// @include      https://www.zhihu.com/*
// @grant        none
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404543/%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%20%E7%BD%91%E7%AB%99%EF%BC%88%E7%99%BE%E5%BA%A6%E3%80%81csdn%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/404543/%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%20%E7%BD%91%E7%AB%99%EF%BC%88%E7%99%BE%E5%BA%A6%E3%80%81csdn%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E3%80%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E5%87%A4%E5%87%B0%E7%BD%91%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==
//百度首页广告去除，csdn博客广告去除,csdn论坛广告去除、凤凰网广告去除 ,知乎登录页面自动关闭
//
jQuery.noConflict();
(function($) {
    '屏蔽百度广告,csdn全网广告';

    setInterval(function(){
            filter()
        }, 1000);
    $(document).ready(function() {
        if(location.href.indexOf('www.zhihu.com')>0){
            closeZhiHu();
        }
    });

    function filter(){
        //csdn首页
        if(location.href.indexOf('blog.csdn.net')>0){
            //推荐位第一广告
            $("[data-type='ad']")
            //左下角的广告
            $("#footerRightAds").remove();
            //博客评论上方的广告
            $("#dmp_ad_58").remove()
            //博客评论下方的广告
            $("#recommend-item-box-tow").remove();
            $(".adsbygoogle").remove();
        }
        //csdn论坛
        if(location.href.indexOf('bbs.csdn.net')>0){
            //本周牛人上方的广告
            $(".ad_top.bbs_left_box").remove()
            //右下方的广告
            $(".ad_1.bbs_left_box").remove();

            //中部的广告
            $(".bbs_left_box .ad_1").remove();
        }
        //百度
        if(location.href.indexOf('www.baidu.com')>0){
            //右边栏的广告
            $("#zsyx_im0").remove()
            $("#m3423525928_canvas").remove()
            $("#m3424514202_canvas").remove()

            $("div").each(function(){
                if($(this).attr("id")!='undefined'& $(this).attr("id")>3000){
                    $(this).remove()
                }
            })

            //百度右边栏
            if(localStorage.getItem("right-setting")!=null){
                //console.log(localStorage.getItem("right-setting"))
                $("#content_right").remove()
            }

            //$("#content_right").remove()


            //第一层广告去除掉后出现的广告
            setTimeout(function(){
                $("div.result.c-container").each(function(){
                    //console.log($("span:contains('广告')",this).length)
                    if($("span:contains('广告')",this).length>0||$("a:contains('广告')",this).length>0){
                        $(this).remove()
                    }

                })
                //$("div.result.c-container>.f13").parent().remove()
            }, 2000);

            //百度首页
            $("span:contains('广告')").parent().parent().parent().remove()


        }
        //百度文库
        if(location.href.indexOf('wenku.baidu.com')>0){
            //中间内容栏的广告
            $(".hx-warp").remove()
        }

        //凤凰网
        if(location.href.indexOf('www.ifeng.com')>0){
            $("#couplet3_left").remove()
            $("[c]").remove()

        }
    }
    function closeZhiHu(){
        setTimeout(function(){
                    //知乎登录页面
        $(".Button.Modal-closeButton.Button--plain").click();
        },100);
    }

    // Your code here...
})(jQuery);