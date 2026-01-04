// ==UserScript==
// @name         360问答美化&360新知美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  360问答隐藏左栏，隐藏广告，显示全部回答；360新知隐藏右栏，隐藏插屏广告；支持电脑端和手机端
// @author       AN drew
// @match        https://*.wenda.so.com/*
// @match        http://xinzhi.wenda.so.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399069/360%E9%97%AE%E7%AD%94%E7%BE%8E%E5%8C%96360%E6%96%B0%E7%9F%A5%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399069/360%E9%97%AE%E7%AD%94%E7%BE%8E%E5%8C%96360%E6%96%B0%E7%9F%A5%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {

    var url = window.location.href;
    if(url.indexOf("wenda.so.com/u")== -1)
    {
        $("#bd").attr("style","display:flex;justify-content:center;align-items:center;");
        $(".main").attr("style","width:1175px;min-height:0px;")
        setTimeout(function(){
            $(".main").attr("style","width:1175px;min-height:0px;")
        })
        $(".umeditor-wrap.js-umeditor-wrap").attr("style","width:1173px;min-height:226px;");
        $(".edui-container").attr("style","width:1173px;");
        $("#detailUmeditor").attr("style","width: 1150px; min-height: 165px; z-index: 0;");
        $(".js-detail-main").attr("style","width:1175px")
        $(".aside").hide()
    }

    setInterval(function(){
        $(".hot-list-wrap").hide()
        $("#business").hide()
        $("#info-list").hide()
        $(".js-recflow-list").hide()

        $(".enterprise-det").hide()
        $(".e_idea_list").hide()
        $("#e_idea_wenda_leftBox").hide()
        $(".enterprise_intro").hide()
        $(".js-interested").attr("style","display:none; visibility:hidden; position:absolute; top:-1000px;");
        $(".rec-left").attr("style","display:none; visibility:hidden; position:absolute; top:-1000px;");
        $(".art-flow").hide()
        $("#mediav-bot").hide()
        $("#detail-leftside-rec").hide()
        $("#js-mod-fixed-float").hide()
        $(".top-search-banner").hide()
        $(".detail-guess").hide()
        $("#detail-guess-wrap").hide()
        $("#js-mod-recommond-list").hide()
        $("#autoList").hide()
        $("#onesearch").hide()
        $("#task-left-wrap").remove()
        $("#js-fixed-rt-bot-inn").hide()
        $(".busi-article").hide()
        $("#e_xinzhi_detail_interested").hide()
        $("#js-list-item").hide()
        $("#news-card").hide()
        $("#garllery").hide()
        $("#business").hide()
        $(".card-bor").hide()
        $(".js-relate-list").hide()
        $(".js-ajax-askmore").hide()
        $(".js-interest-list").hide()
        $("#interest-list").hide()
        $(".g-scroll-loading").hide()
        $("#info-list").hide()
        $("#js-rec").hide()
        $(".mod-detail-normal").attr("style","display:none; visibility:hidden; position:absolute; top:-1000px;");
        $(".js-busi-item").attr("style","display:none; visibility:hidden; position:absolute; top:-1000px;");
        $(".mod-share").hide()
        $(".mod-wechat-qrcode-mini").hide()

        $("h2").each(function(){
            console.log($(this).get(0))
            if($(this).text().indexOf("您可能感兴趣的内容") > -1)
                $(this).hide()
            else if($(this).text().indexOf("为您推荐") > -1)
                $(this).hide()
            else if($(this).text().indexOf("今日热点") > -1)
                $(this).hide()
            else if($(this).text().indexOf("相关资讯") > -1)
                $(this).hide()
        })

        if($(".js-answer-page").length>0)
            $(".js-answer-page").get(0).click()
    },1)

    $(".username").removeClass("dsp-inline-block");

    $(".mod-see-other").click()
    $(".btn-wrap").click()
    $(".unfold-page").click()
    $(".ico-arr-down").click()

})();