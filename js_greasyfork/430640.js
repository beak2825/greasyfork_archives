// ==UserScript==
// @name         屏蔽斗鱼主播
// @version      0.0.4
// @description  屏蔽斗鱼主播,尤其是伞兵主播
// @author       CK
// @include      *://www.douyu.com/*
// @include      https://www.douyu.com/*
// @include      https://www.douyu.com/g_LOL
// @namespace    0000
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/430640/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E4%B8%BB%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/430640/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E4%B8%BB%E6%92%AD.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // Your code here...
    await setTimeout(()=>{
        removeADvertise();
        fuckUp();
    },500);
    await setTimeout(()=>{
        $(".liveos-workspace").remove();
    },5000);

    function removeADvertise(){
        console.clear();
        console.log("%c%s","color: red; background: yellow; font-size: 48px;",'清空广告');
        $(".Barrage").hide();
        $(".DanmuEffectDom").hide();
        $(".BarrageSuspendedBallAd").hide();
        $(".Barrage-topFloater").hide();
        $("#js-player-barrage").hide();
        $(".Barrage").hide();
        $(".DanmuEffectDom").hide();
        $(".Barrage").remove();
        $(".DanmuEffectDom").remove();
        $(".BarrageSuspendedBallAd").remove();
        $(".Barrage-topFloater").remove();
        $("#js-player-barrage").remove();
        $(".Barrage").remove();
        $(".DanmuEffectDom").remove();
        $("#douyu_room_normal_player_danmuDom").remove();
        $("#js-player-asideMain").hide();
        $("#js-player-asideMain").remove();
        $(".liveosTag_1Z4iZj adPicRoot_4kxGCX").hide();
        $(".liveosTag_1Z4iZj adPicRoot_4kxGCX").remove();
        $(".liveos-workspace").hide();
        $(".liveos-workspace").remove();
    }


    function fuckUp(){
        /**
        * 屏蔽礼物
        */
        var blackList = ['1237105','5225084']; // 在斗鱼的主播黑名单房间号 例如: ['11111','22222']
        var tempall = $(".layout-Cover-item");
        if(blackList.length > 0){
            blackList.map(black=>{
                if(window.location.href.search(black)> -1){
                    alert('贱不贱呐，还看？');
                    window.location.href = "https://www.douyu.com/";
                }
                tempall.map((index,item)=>{
                    if($(item).html().search(black)>-1){
                        console.log($(item));
                        $(item).hide();
                        $(item).remove();
                        console.log("%c%s","color: red; background: yellow; font-size: 48px;",'屏蔽斗鱼主播房间号'+ black);
                    }
                })
            })
        }
    }

})();