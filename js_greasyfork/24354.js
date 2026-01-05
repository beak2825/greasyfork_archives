// ==UserScript==
// @name         斗鱼双开直播（两个直播同屏）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  同时观看两个直播，观赏电竞更爽快！Watch TWO douyu live in ONE Screen，HAVE FUN ! RUA RUA RUA!
// @author       Chuck
// @match        https://www.douyu.com/*
// @match        http://www.douyu.com/*
// @icon         http://www.douyu.com/favicon.ico
// @grant        none
// @copyright    2016+, @Chuck
// @downloadURL https://update.greasyfork.org/scripts/24354/%E6%96%97%E9%B1%BC%E5%8F%8C%E5%BC%80%E7%9B%B4%E6%92%AD%EF%BC%88%E4%B8%A4%E4%B8%AA%E7%9B%B4%E6%92%AD%E5%90%8C%E5%B1%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/24354/%E6%96%97%E9%B1%BC%E5%8F%8C%E5%BC%80%E7%9B%B4%E6%92%AD%EF%BC%88%E4%B8%A4%E4%B8%AA%E7%9B%B4%E6%92%AD%E5%90%8C%E5%B1%8F%EF%BC%89.meta.js
// ==/UserScript==

if (window.frames.length == parent.frames.length) {    
    var  setSecondPlayer = function(url){   
        $("<style scoped id='left-style' type='text/css'>#left,.announce,#js-stats-and-actions,#anchor-info,#js-live-room-normal-equal-right,#js-live-room-normal-equal-left,#js-fans-rank{display:none !important;}#mainbody{padding:0 !important; margin:0 !important;     width: auto !important;}#js-live-room-normal-right{position:fixed; left:-335px;top:90px; border-right:10px #ccc solid;}.chat-cont-wrap{max-height:710px;}#js-live-room-normal-left{position:fixed;top:80px; width:49% !important;margin:0 !important; margin-left:10px!important;}#js-live-room-normal-right:hover{left:0px;}#js-room-video{height: 550px!important; }</style>")
            .prependTo('#mainbody');  
        thisIfram = $("<iframe width = 938px  height= 850px id='right-player'  style='position: fixed;  padding-left:10px;  right: 0px;'  iframename='right-player' frameborder='no' marginheight='0' marginwidth='0' allowTransparency='true'></iframe>");
        thisIfram.prependTo('.live-room');  
        $("#right-player").attr("src", url);  
        var abc = function(){
            $("<style scoped id='right-style' type='text/css'>#header, #left, .announce, #js-stats-and-actions, #anchor-info, #js-live-room-normal-equal-right, #js-live-room-normal-equal-left, #js-fans-rank { display: none !important; }#mainbody { padding: 0 !important; margin: 0 !important; width: auto !important; }#js-live-room-normal-right { position: fixed; right: -335px; top:90px; border-left: 10px #ccc solid; }#js-live-room-normal-right:hover { right: 0px; }.chat-cont-wrap { max-height: 710px; }#js-live-room-normal-left { position: fixed;top:80px; right: 10px; width: 100% !important; margin: 0 !important; }#js-room-video{height: 550px!important; }</style>")
                .prependTo(thisIfram.contents().find("body"));
            thisIfram.contents().find("#left-style").html("");
        };
        setTimeout(abc,5000);
    };

    var closeSecondPlayer = function(){
        $("#left-style").remove();
        $("#right-player").remove();
    }; 

    var ChangeSecondPlayer = function(url){
        $("#right-player").attr("src", url);  
        var abc = function(){
            $("<style scoped id='right-style' type='text/css'>#header, #left, .announce, #js-stats-and-actions, #anchor-info, #js-live-room-normal-equal-right, #js-live-room-normal-equal-left, #js-fans-rank { display: none !important; }#mainbody { padding: 0 !important; margin: 0 !important; width: auto !important; }#js-live-room-normal-right { position: fixed; right: -335px; border-left: 10px #ccc solid; }#js-live-room-normal-right:hover { right: 0px; }.chat-cont-wrap { max-height: 710px; }#js-live-room-normal-left { position: fixed;top:60px; right: 10px; width: 100% !important; margin: 0 !important; }#js-room-video{height: 550px!important; }</style>")
                .prependTo(thisIfram.contents().find("body"));
            thisIfram.contents().find("#left-style").html("");
        };
        setTimeout(abc,5000);  
    }; 
    $("<div class='o-close-second-player fl' style='margin: 13px 25px 0 0; height: 22px;width: 85px;border: 1px solid #aaa;border-radius: 5px; display:none;'><span  style='    vertical-align: top;    line-height: 20px;    color: #868686; cursor: pointer;'>关闭第二播放器</span></div>").prependTo('.head-oth'); 
    $("<div class='o-second-player fl' style='margin: 13px 5px 0 0; height: 22px;width: 148px;border: 1px solid #aaa;border-radius: 5px;'> <input class='s-ipt fl'type='text' autocomplete='off' placeholder='输入完整房间地址' value='' id='suggest-search' style='    display: block;    font-size: 12px; background: 0 0;    border: none;    outline: 0;    width: 116px;    height: 22px;    line-height: 22px;    padding: 0 5px;'><a class='double-btn' title='加载第二个房间同屏播放' style='    display: block;    width: 22px;    height: 22px;    line-height: 22px;    float: right;' href='#'><i style='    display: inline-block;    width: 18px;    height: 22px;    background: url(https://shark.douyucdn.cn/app/douyu/res/com/head-icos.png) -500px -500px no-repeat;    background-position: 0 -50px; transform: rotate(90deg);'></i></a></div>").prependTo('.head-oth'); 
    var addFollowBtn = function(){ 
        $.each($(".f-list>li"),function(){
            $(this).css('position',"relative");
            if($(this).children('.second-player-btn').length===0)
            $("<a class='second-player-btn' href='#'style='line-height: 22px;    position: absolute;    right: -5px;    width: 30px;   height: 50px;    top: 12px;     color: #a0a0a0;'><i style='    display: inline-block;    width: 18px;    height: 22px;    background: url(https://shark.douyucdn.cn/app/douyu/res/com/head-icos.png) -500px -500px no-repeat;    background-position: 0 -50px; transform: rotate(90deg);'></i><span style='    position: absolute;    top: 18px;    right: 6px;'>双开</span></a>")
                .prependTo($(this));
        });
    };
     $(".f-list").on("click",'.second-player-btn',function(){
         closeSecondPlayer();
         var url =          "https://www.douyu.com"+ $(this).next("p").children("a").attr("href");
         setSecondPlayer(url);
          $(".o-close-second-player").show();

    });
    $(".head-oth").on("mouseover",'.o-follow',function(){
            var timer=setTimeout(addFollowBtn,1000);
    });

    $(".double-btn").click(function(){
        setSecondPlayer($(".o-second-player input").val());
        $(".o-close-second-player").show();
    });
    $(".o-close-second-player").click(function(){
        closeSecondPlayer();
        $(".o-close-second-player").hide();
    });
}
