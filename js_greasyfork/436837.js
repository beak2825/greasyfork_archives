// ==UserScript==
// @name       imageBaiduSlide
// @namespace  http://hank.com/
// @version    0.8
// @description  image Baidu Slide
// @match        https://image.baidu.com/search/detail?*
// @match        https://photo.baidu.com/*
// @include        https://image.baidu.com/search/detail?*
// @copyright  20181129+, Hank
// @run-at document-end
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/436837/imageBaiduSlide.user.js
// @updateURL https://update.greasyfork.org/scripts/436837/imageBaiduSlide.meta.js
// ==/UserScript==
(function ($){
    var opacity = .4;
    var playInterval = getlocalKey("playInterval")?getlocalKey("playInterval"):10;
    var playInt = null;
    var openUrl = $("<div style='display:block;position:fixed;top:10px;left:10px;opacity:" + opacity +
                    ";z-index:999;' class='openUrl'><button style='width:40px;height:40px;font:20px bold;line-height:0px;border-radius:20px;' type='button'>&gt;</button>"+
                    "<button class='oBut' style='width:30px;height:30px;font:20px bold;line-height:0px;border-radius:30px' type='button'>O</button>"+
                    "<input type='number' style='width:35px' step='0.25' value="+ playInterval +"></div>");
    $("body").append(openUrl);
    if(window.location.host == "photo.baidu.com"){
        openUrl.find(".oBut").remove();
        openUrl.find("button,input").css({"border":"#000 solid","background-color":"rgb(255 255 255)" });
    }
    //移入移出
    openUrl.mouseover(() => {
        openUrl.css("opacity", 0.9);
    }).mouseleave(() => {
        openUrl.css("opacity", opacity);
    });
    //play按钮
    openUrl.find("button:eq(0)").click(() => {
        const switchEl = $("#sider,#header,.album-pnl,.img-next,.img-prev,.preview-operate,.leftBtn,.rightBtn,.yk-preview__closeBtn");
        if(playInt){
            // 暂停
            switchEl.show();
            $(".yk-preview__container").css("height", "calc(100% - 60px)")
            window.dispatchEvent(new Event('resize'));
            openUrl.find(".oBut").length > 0 && openUrl.find(".oBut").show();
            openUrl.find("input").show();
            window.clearInterval(playInt);
            playInt = null;
            openUrl.find("button:eq(0)").text(">");
            opacity = .4;
        }else{
            // 播放
            switchEl.hide();
            $("#main").css("margin-top", "20px");
            $(".yk-preview__container").css("height", "calc(100% - 0px)")
            window.dispatchEvent(new Event('resize'));
            openUrl.find(".oBut").length > 0 && openUrl.find(".oBut").hide();
            openUrl.find("input").hide();
            playInterval = openUrl.find("input").val();
            setlocalKey(playInterval, "playInterval");
            playInt = window.setInterval(()=>{
                switchEl.hide();
                //let newEl = $(".img-next:visible").length>0?$(".img-next:visible"):$(".right-arrow-wrap");
                $(".img-next, .rightBtn").trigger("click");
                $(".right-arrow-wrap:visible").length>0 && $(".right-arrow-wrap:visible").trigger("click");
                setlocalKey(window.location.href);
            }, playInterval*1000);
            openUrl.find("button:eq(0)").text("||");
            opacity = .1;
        }
    })
    //O按钮
    openUrl.find(".oBut").length > 0 && openUrl.find(".oBut").click(()=>{
        window.location.href = getlocalKey();
    });
    function getlocalKey(type='nowHref'){
        return window.localStorage["https://image.baidu.com/search/detail?word="+getWord()+type];
    }
    function setlocalKey(val, type='nowHref'){
        return window.localStorage["https://image.baidu.com/search/detail?word="+getWord()+type] = val;
    }
    function getWord(){
        return window.location.href.replace(/^http.*?(\&|\?)word=(.*?)\&.*$/, "$2") || window.location.href.replace(/^http.*?(\&|\?)title=(.*?)\&.*$/, "$2");
    }
})(jQuery);