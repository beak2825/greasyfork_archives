// ==UserScript==
// @name         虎牙超精简
// @namespace    http://tampermonkey.net/
// @Icon         https://www.huya.com/favicon.ico
// @version      1.3
// @description  虎牙超精简-给与自己纯粹的直播观看体验
// @author       BigHum
// @match        https://www.huya.com/*
// @grant        none
// @license      GPL-3.0-only
// @require      http://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/442166/%E8%99%8E%E7%89%99%E8%B6%85%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/442166/%E8%99%8E%E7%89%99%E8%B6%85%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...();
    $(function () {
         var html = //'<div style=" width: 100%; height: 1080px; position: fixed; background: black; opacity: 0.6; z-index: 9998;">'+
//             '</div>'+
//             '<div style="width: 107px; height: 256px; background: white; position: fixed; top: 10%; left: 50px; border-radius: 5px; z-index: 10001;"></div>'+
//             '<span style="position: fixed; background: white; top: 20%; left: 30%; padding: 10px; z-index: 10001;">下一步</span>'+
            //设置弹窗

            '<div id="tanchuang" style="user-select: none; background: #dcdde1; position: absolute; top: 10%; left: 50px; z-index: 9999; border: 1px solid #84817a; border-radius: 5px;">'+
            '<a class="shou" href="javascript:void(0)" style=" position: absolute; top: -1px; right: -53px; display: block; width: 48px; height: 50px; line-height: 50px; background: #dcdde1; text-align: center; border: 1px solid #84817a; border-radius: 5px;">'+
            '<em class="iconfont">&larr;</em>'+
            '</a>'+
            '<ul>'+

            '<li style=" border-bottom: 1px solid #84817a;">'+
            '<label style="display: inline-block;padding: 16px 5px;" for="rightdanmu"><span style="padding: 0 5px;">右侧弹幕开启</span><input id="rightdanmu" style="vertical-align: middle;" type="checkbox" name="name" value="" /></label>'+
            '</li>'+

            '<li style=" border-bottom: 1px solid #84817a;">'+
            '<label style="display: inline-block;padding: 16px 5px;" for="bottomliwu"><span style="padding: 0 5px;">下方礼物开启</span><input id="bottomliwu" style="vertical-align: middle;" type="checkbox" name="name" value="" /></label>'+
            '</li>'+

            '<li style=" border-bottom: 1px solid #84817a;">'+
            '<label style="display: inline-block;padding: 16px 5px;" for="centerdanmu"><span style="padding: 0 5px;">中间弹幕开启</span><input id="centerdanmu" style="vertical-align: middle;" type="checkbox" name="name" value="" /></label>'+
            '</li>'+

            '<li style=" border-bottom: 1px solid #84817a;">'+
            '<label style="display: inline-block;padding: 16px 5px;" for="centertexiao"><span style="padding: 0 5px;">中间特效开启</span><input id="centertexiao" style="vertical-align: middle;" type="checkbox" name="name" value="" /></label>'+
            '</li>'+

            '<li>'+
            '<label style="display: inline-block;padding: 16px 5px;" for="tophuazhi"><span style="padding: 0 5px;">最高画质开启</span><input id="tophuazhi" style="vertical-align: middle;" type="checkbox" name="name" value="" /></label>'+
            '</li>'+

            '</ul>'+
            '</div>'
        $("body").prepend(html)

        var widths = $("#tanchuang").innerWidth() + 2 ;

        //设置收起开始
        $(".shou").click(function () {
            if ($(this).parent().css("left") == "50px") {
                $(this).parent().animate({
                    left: "-" + widths + "px"
                });
                $(this).html('<em class="iconfont">&rarr;</em>');
                $.cookie('shou', 'full',{ expires : 99999});
                console.log($.cookie('shou'))
            } else {
                $(this).parent().animate({
                    left: "50px"
                });
                $(this).html('<em class="iconfont">&larr;</em>');
                $.cookie('shou', 'empty',{ expires : 99999});
                console.log($.cookie('shou'))
            }
        })


        if($.cookie('shou') == null){

        }else{
            if($.cookie('shou') == "empty"){
                console.log($.cookie('shou'))
                $("#tanchuang").animate({
                    left: "50px"
                });
                $(".shou").html('<em class="iconfont">&larr;</em>');
            }else{
                console.log($.cookie('shou'))
                $("#tanchuang").animate({
                    left: "-" + widths + "px"
                });
                $(".shou").html('<em class="iconfont">&rarr;</em>');
            }
        }
        //设置收起结束

        //右侧弹幕栏
        if($.cookie("rightdanmu") !== null){
            if($.cookie("rightdanmu") == "true"){
                $("#rightdanmu").attr("checked",true)
            }else{
                $("#rightdanmu").attr("checked",false)
                $("#J_roomWeeklyRankListRoot").css("overflow","auto");
            }
        }


        $("#rightdanmu").click(function () {
            if ($(this).prop('checked')) {
                $.cookie("rightdanmu","true",{ expires : 99999})
            } else {
                $.cookie("rightdanmu","false",{ expires : 99999})
            }
        })

        //下方礼物栏
        if($.cookie("bottomliwu") !== null){
            if($.cookie("bottomliwu") == "true"){
                $("#bottomliwu").attr("checked",true)
            }else{
                $("#bottomliwu").attr("checked",false)
                $("#J_roomWeeklyRankListRoot").css("overflow","auto");
            }
        }


        $("#bottomliwu").click(function () {
            if ($(this).prop('checked')) {
                $.cookie("bottomliwu","true",{ expires : 99999})
            } else {
                $.cookie("bottomliwu","false",{ expires : 99999})
            }
        })

        var liwu = ""


        //中间弹幕
        if($.cookie("centerdanmu") !== null){
            if($.cookie("centerdanmu") == "true"){
                $("#centerdanmu").attr("checked",true)
            }else{
                $("#centerdanmu").attr("checked",false)
            }
        }


        $("#centerdanmu").click(function () {
            if ($(this).prop('checked')) {
                $.cookie("centerdanmu","true",{ expires : 99999})
            } else {
                $.cookie("centerdanmu","false",{ expires : 99999})
            }
        })
        var hasclassdanmu


        //中间特效
        if($.cookie("centertexiao") !== null){
            if($.cookie("centertexiao") == "true"){
                $("#centertexiao").attr("checked",true)
            }else{
                $("#centertexiao").attr("checked",false)
            }
        }


        $("#centertexiao").click(function () {
            if ($(this).prop('checked')) {
                $.cookie("centertexiao","true",{ expires : 99999})
            } else {
                $.cookie("centertexiao","false",{ expires : 99999})
            }
        })
        var hasclasstexiao

        //最高画质
        if($.cookie("tophuazhi") !== null){
            if($.cookie("tophuazhi") == "true"){
                $("#tophuazhi").attr("checked",true)
            }else{
                $("#tophuazhi").attr("checked",false)
            }
        }


        $("#tophuazhi").click(function () {
            if ($(this).prop('checked')) {
                $.cookie("tophuazhi","true",{ expires : 99999})
            } else {
                $.cookie("tophuazhi","false",{ expires : 99999})
            }
        })

        setInterval(function () {
            //删除静态加载元素
            $("#J_spbg").remove();//移除网页头部Banner图
            //$("#J_roomHeader").remove();//移除直播间头部
            $(".room-gg-top").remove();//移除页面头部广告
            $("#J_roomHdR").remove();//移除直播间头部右侧订阅
            $(".room-core").css("width","70%");//直播间宽度
            $(".room-core").css("margin","0 auto");//直播间居中
            $(".sidebar-hide").remove();//移除左侧侧边栏
            $("#J_mainWrap").css("padding-left","0px");
            $("#match-cms-content").remove();//移除背景及底部内容
            $(".game--3vukE-yU-mjmYLSnLDfHYm").remove();//移除直播间头部广告
            $("huya-ab-fixed").remove();//移除直播间内广告
            $("#huya-ab").remove();//移除直播间内广告
            $(".room-gg-chat").remove();//移除右侧弹幕栏广告
            $(".diy-comps-wrap").remove();

            //右侧弹幕栏开始
            if($.cookie("rightdanmu") == "true"){
                $(".room-core-l").css("margin-right","350px");//添加直播间右边距
                $(".room-core-r").css("display","block");//显示右侧聊天栏
            }else{
                $(".room-core-l").css("margin","0px");//去除直播间右边距
                $(".room-core-r").css("display","none");//隐藏右侧聊天栏
            }
            //右侧弹幕栏结束

            $(".room-footer-l").remove();//移除底部主播动态
            $(".room-footer-r").remove();//移除签约公会
            $("#UDBSdkLgn").remove();//移除登录弹出页

            //删除动态加载元素
            $("#hy-watermark").remove();//移除直播号
            $("#player-subscribe-wap").remove();//移除直播间底部主播信息栏

            //下方礼物栏开始
            if($.cookie("bottomliwu") == "true"){
                $(".player-gift-wrap").children().css("display","block");//添加直播间底部礼物栏
            }else{
                $(".player-gift-wrap").children().css("display","none");//移除直播间底部礼物栏
            }
            //下方礼物栏结束

            $(".player-gift-wrap").css("background","#f7f7f7");//更改直播间底部礼物栏背景色
            $("#player-resource-wrap").remove();//移除直播间内广告
            $(".gift-info-wrap").remove();//移除直播间右侧礼物栏
            $(".duya-header-ad").remove();//移除标题中间广告
            $(".subscribe").remove();

            //中间弹幕开始
            if($.cookie("centerdanmu") == "true"){
                hasclassdanmu = $("#player-danmu-btn").hasClass("player-ctrl-switch-hide");
                if(!hasclassdanmu){

                }else{
                    $("#player-danmu-btn").click();
                    $(".player-danmu-pane").css("display","none")
                }
            }else{
                hasclassdanmu = $("#player-danmu-btn").hasClass("player-ctrl-switch-hide");
                if(!hasclassdanmu){
                    $("#player-danmu-btn").click();
                }else{

                }
            }
            //中间弹幕结束


            //中间特效开始
            if($.cookie("centertexiao") == "true"){
                hasclasstexiao = $("#shielding-effect").hasClass("shielding-effect-select")
                if(!hasclasstexiao){

                }else{
                    $(".shielding-effect-btn").click();
                }
            }else{
                hasclasstexiao = $("#shielding-effect").hasClass("shielding-effect-select")
                if(!hasclasstexiao){
                    $(".shielding-effect-btn").click();
                }else{

                }
            }
            //中间特效结束


            //最高画质开始
            if($.cookie("tophuazhi") == "true"){
                $(".player-videotype-list").find("li:first").click();//最高画质
            }else{

            }
            //最高画质结束

            //$("#danmudiv").remove();//移除弹幕
            //localStorage.loginTipsCount = -1e+35;
            //$('#player-login-tip-wrap').remove();
            //VPlayer.prototype.checkLogin(true);
            //$(".player-fullscreen-btn").click();//全屏播放
        },10)
    });
})();