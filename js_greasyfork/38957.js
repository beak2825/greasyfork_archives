// ==UserScript==
// @name         斗鱼直播界面简化
// @namespace    https://greasyfork.org/zh-CN/users/141921
// @version      0.0.1
// @description  屏蔽了其他与直播无关的东西。修改自https://greasyfork.org/zh-CN/scripts/29026-%E6%96%97%E9%B1%BC%E7%86%8A%E7%8C%AB%E5%B7%A5%E5%85%B7%E7%AE%B1
// @author       Vinx
// @match        *://*.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38957/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/38957/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $(document).ready(function () {
        if (location.href.indexOf('douyu.com') > 0) {
            setTimeout(function () {
                douyu();
            }, 200);
        }
    });
    function douyu() {
        hidead();
        douyucss();

        setTimeout(function(){
            var roomid=/\d+/.exec(window.location.href);
            $("#showroomid").text("房间号："+roomid);
        },2000);

        $('.focus-box-con').css('width', '250px');
        $('#js-fans-rank').hide();
        $('#js-chat-cont').prepend('<input type="hidden" id="chatboxhg" value="0" />');
        $(".r-else").append('<li><span id="showroomid">房间号：</span></li>');
        $('.focus-box-con').append('<button type="button" id="fansbox" value="1">显示粉丝区→</button>');

        $('.live-room-normal-left').hide();
        $('.chat-right-ad').hide();
        $('.column.rec').hide();
        $('.column.announce').hide();
        $('.PlayerSub').hide();

        //$('.task-Getyw.clearfix.fl').hide();

        $('#js-room-task-trigger').hide();
        $('#gift-content').hide();
        $('.r-com-btn.getYc.fl').hide();
        $('#js-stats-and-actions').height(25);
        $('.sq-wrap').hide();
        $('.left-menu').hide();
        $('.fl.funny ').hide();
        //setTimeout(function(){
               //$('.action-list.fl').remove();

       //     },5000);

        // 过滤礼物及广告
        function hidead() {
            var shielding=setInterval(function(){
                if($(".jschartli").length>0||$(".giftbatter-item.item-1,.giftbatter-item.item-2,.giftbatter-item.item-3,.giftbatter-item.item-4").length>0){
                    if(!$("#js-shie-gift").hasClass("shie-switch-open")){
                        $("#shie-switch").click();
                        clearInterval(shielding);
                    }
                }else{
                    if($("#js-shie-gift").hasClass("shie-switch-open")){
                        $("#shie-switch").click();
                    }
                }
            },200);
            setTimeout(function(){
                if(!$("#js-shie-gift").hasClass("shie-switch-open")){
                    $("#shie-switch").click();
                }
                clearInterval(shielding);
            },8000);
            setTimeout(function () {
                var chatboxheight = $('#js-chat-cont').height();
                $('#chatboxhg').val(chatboxheight);
                $('#js-chat-cont').css({"top":"0px"});
                $('.giftbatter-noble-enter,.chat-ad,.chat-notice,.fishop-anchor-recommands-box,.pay-task,.room-ad-top,.f-sign-cont,.assort-ad,.no-login,.fishop-anchor-push-box,.action-list.fl,.pay-task').remove();
            }, 1000);
        }

        $('#fansbox').click(function() {//隐藏粉丝区
            var chatboxheight;
            chatboxheight = $('#js-chat-cont').height();
            if ($('#fansbox').val() == 1) {
                $('#fansbox').val(0);
                $('#js-chat-cont').css('min-height', chatboxheight - 217 + 'px');
                $('#js-fans-rank').show();
                $('#fansbox').html('隐藏粉丝区→');
            } else {
                $('#fansbox').val(1);
                $('#js-chat-cont').css('min-height', chatboxheight + 217 + 'px');
                $('#js-fans-rank').hide();
                $('#fansbox').html('显示粉丝区→');
            }
        });
    }
    	function douyucss(){
        GM_addStyle(`
#fansbox {
line-height: 22px;
width: 90px;
margin-left: 10px;
background-color: #FD7521;
border: 1px solid #ddd;
color: #ffffff;
}
`);
    }

}) ();