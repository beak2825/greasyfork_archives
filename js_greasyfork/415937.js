// ==UserScript==
// @name         好看视频增加取消自动播放按钮
// @namespace    http://91wc.net/no-autoplay.htm
// @version      0.1.6
// @description  在播放结束后，即将跳转到下一个视频的进度条下方增加取消自动播放下一个按钮。这个取消是临时取消，不会影响下一个视频，全屏也能正常使用。
// @author       Wilson
// @icon         https://hk.bdstatic.com/app/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        *://haokan.baidu.com/v*
// @downloadURL https://update.greasyfork.org/scripts/415937/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E5%A2%9E%E5%8A%A0%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/415937/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E5%A2%9E%E5%8A%A0%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var player_cancel_inserted = false;
    var hkplayer = $(".player.hkplayer");
    if(hkplayer.attr("data-listened")) return;
    hkplayer.attr("data-listened", 1);
    hkplayer[0].addEventListener('DOMNodeInserted', function(e){
        if(e.target.nodeType !== 1) return;
        if(e.target.id && e.target.id == "playend"){
            if($("#player_cancel_next").length>0 && !$("#playend").is(":hidden")) $("#player_cancel_next").show();
            if(player_cancel_inserted) return;
            player_cancel_inserted = 1;
            $(this).append('<div class="player-end" style="z-index:160;top:50%;left:50%;margin-left:-22px;margin-top:14px;width:48px;height:26px;"><button id="player_cancel_next" style="padding: 1px 8px;background-color: #3a3939;border-radius: 4px;color: #fff;font-size: 14px;font-weight:500;border: 1px solid transparent;border-color: #716d6d;">取消</button></div>');
            if($("#playend").is(":hidden")) $("#player_cancel_next").hide();
            $("#player_cancel_next").click(function(){
                $(".next-switch").click();
                $(this).hide();
                localStorage.setItem("autoplay", true);
            });
            $(".next-switch").click(function(){
                if($(".hkplayer-time-current").text()!=$(".hkplayer-time-current").next().text()) return;
                if($("#playend").length===0 && !$(".next-switch").hasClass("ant-switch-checked")){
                    $("#player_cancel_next").show();
                }else{
                    $("#player_cancel_next").hide();
                }
            });
            $(".hkplayer-replay-svg").click(function(){
                if(!$(".next-switch").hasClass("ant-switch-checked")) $(".next-switch").click();
                $("#player_cancel_next").hide();
            });
            $(this).on("click", ".player-replay-icon", function(){
                $("#player_cancel_next").hide();
            });
            $(window).on("scroll", function(){
                if($("#playend").length > 0){
                    if($("#playend").is(":hidden")){
                        $("#player_cancel_next").hide();
                    } else {
                        $("#player_cancel_next").show();
                    }
                }
            });
        }
    }, false);

})();