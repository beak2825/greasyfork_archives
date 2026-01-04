// ==UserScript==
// @name         百度知道美化 & 作业帮问答美化
// @namespace    http://tampermonkey.net/
// @version      0.6.2.2
// @description  展开所有回答并居中显示
// @author       AN drew
// @match        *://zhidao.baidu.com/*
// @match        *://*.zybang.com/*
// @match        *://*.zuoyebang.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/403101/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E7%BE%8E%E5%8C%96%20%20%E4%BD%9C%E4%B8%9A%E5%B8%AE%E9%97%AE%E7%AD%94%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403101/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E7%BE%8E%E5%8C%96%20%20%E4%BD%9C%E4%B8%9A%E5%B8%AE%E9%97%AE%E7%AD%94%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

/*
function execCopy(text) {
    const input = document.createElement('textarea');
    input.style.opacity  = 0;
    input.style.position = 'absolute';
    input.style.left = '-100000px';
    document.body.appendChild(input);

    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
}
*/

(function() {

    //作业帮
    GM_addStyle(`.bottomBanner_1NuiX{display:none!important}
    .aside_2NzA4{display:none!important}
    .answerAnalyzeAd_-hW0z{display:none!important}
    .questionQRCodeWrap_3brtn{display:none!important}
    .analysisLink_2KjQs{display:none!important}
    .download_2d_iC{display:none!important}
    .Dialog_3O1fy{display:none!important}
    .main_3TpCz{width:100%!important}
    `);
    $("#bottomBannerLink").hide();
    $("#aside").hide();
    $("#QRinside").hide();
    $(".main-con").attr("style","margin:0 auto; padding:0 auto;");
    $(".qb_wgt-question").width($(".questionWarp").width()-60);
    $(".bottomTextFlow").hide();
    $(".show-more").click();
    var more_timer = setInterval(function(){
        if($('.more_1tiC4 span span').text().indexOf('更多') > -1)
        {
            $('.more_1tiC4 span span').get(0).click();
        }
        clearInterval(more_timer);
    },100)


    //百度知道
    var $copy_button = $('<div class="copy-button">复制</div>');
    $copy_button.attr("style","display: none;"+
                      "right: 4px !important;"+
                      "top: 4px !important;"+
                      "width: 25px !important;"+
                      "height: 14px !important;"+
                      "font-size: 12px !important;"+
                      "vertical-align: center !important;"+
                      "color: #4d4d4d !important;"+
                      "background-color: white !important;"+
                      "padding: 2px 8px !important;"+
                      "margin: 8px !important;"+
                      "border-radius: 4px !important;"+
                      "cursor: pointer !important;"+
                      "user-select: none;"+
                      "box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1) !important;");

    setTimeout(function(){
        $(".syntaxhighlighter .code").after($copy_button);
        $(".syntaxhighlighter").hover(function(){
            var code="";
            var code_children = $(this).find(".container").children();

            for(let i=0; i<code_children.length; i++)
            {
                code+=code_children.eq(i).text()+"\n";
            }

            //&nbsp;转正常空格
            code = encodeURI(code)
            code = code.replace(/%C2%A0/g,'%20');
            code = decodeURI(code);

            $(this).find(".copy-button").css("display","block");
            $(this).find(".copy-button").click(function(){
                for(let k=0 ; k<code.length; k++)
                    console.log(code[k]+" "+code[k].charCodeAt(0).toString(16))
                GM_setClipboard(code);
                $(this).text("复制成功");
                $(this).attr("style","display: block;"+
                             "right: 4px !important;"+
                             "top: 4px !important;"+
                             "width: 48px !important;"+
                             "height: 14px !important;"+
                             "font-size: 12px !important;"+
                             "vertical-align: center !important;"+
                             "color: #4d4d4d !important;"+
                             "background-color: white !important;"+
                             "padding: 2px 8px !important;"+
                             "margin: 8px !important;"+
                             "border-radius: 4px !important;"+
                             "cursor: pointer !important;"+
                             "user-select: none;"+
                             "box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1) !important;");
            })
        },function(){
            $(this).find(".copy-button").text("复制");
            $(this).find(".copy-button").attr("style","display: none;"+
                                              "right: 4px !important;"+
                                              "top: 4px !important;"+
                                              "width: 25px !important;"+
                                              "height: 14px !important;"+
                                              "font-size: 12px !important;"+
                                              "vertical-align: center !important;"+
                                              "color: #4d4d4d !important;"+
                                              "background-color: white !important;"+
                                              "padding: 2px 8px !important;"+
                                              "margin: 8px !important;"+
                                              "border-radius: 4px !important;"+
                                              "cursor: pointer !important;"+
                                              "user-select: none;"+
                                              "box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1) !important;");
        })
    },1500);

    setInterval(function(){
        if($(".wgt-best-mask").css("display")=="block")
            $(".wgt-best-showbtn").click()

        $(".wgt-answers-mask").each(function(){
            if($(this).css("display")=="block")
                $(this).find(".wgt-answers-showbtn").click()
        })

        $('.wgt-target-showbtn').click();

        $(".jump-goto-star").attr("style","display:none; visibility:hidden; position:absolute; top:-1000px;");
    },1000)


    var bad_timer = setInterval(function(){
        $(".evaluate-bad").each(function(){
            if($(this).find(".evaluate-num").text()=="")
            {
                $(this).find(".evaluate-num").text($(this).attr("data-evaluate"))
            }
        })
        clearInterval(bad_timer);
    },1000)

    var baidu_words=['2113','5261','4102','1653',"bai","du","zhi","dao"];
    var baidu_timer = setInterval(function(){
        $("span").each(function(){
            if(baidu_words.includes($(this).text()))
            {
                $(this).remove();
            }
        })
        clearInterval(baidu_timer);
    });


    setTimeout(function(){
        $(".show-hide-dispute").click()
        $(".replyask-extandup-btn").click()
        $("a.f-green").parent().parent().parent().removeAttr("style")
        if($(".expend").get(0)!=null && $(".expend").hasClass("expend_hide")==false)
            $(".expend").get(0).click()
        var $wenku = $("a.f-green").parent().parent()
        var $wenkuclone = $wenku.clone(true)
        $wenku.remove()
        $wenkuclone.find(".wgt-best-open-wenku").css({"text-align": "center",
                                                      "padding-top": "15px",
                                                      "font-size": "16px",
                                                      "line-height": "26px"
                                                     })
        $(".quality-content-view-more").before($wenkuclone)
        $("#show-answer-hide").click()
    },1000)

    $(".leftup").hide()
    $(".new-icon").hide()
    $(".bannerdown").hide()
    $("#qb-side").hide()
    $(".wgt-ads").hide()
    $(".task-list-button").hide()
    $(".exp-topwld-tip").hide()
    $(".question-number-text-chain").hide()
    $("#answer-bar.exp-answerbtn-yh").append("<style>#answer-bar.exp-answerbtn-yh::after{background:none}</style>");
    $(".wgt-bottom-union").hide()
    $(".line.qb-section").attr("style","display:flex;justify-content:center;align-items:center;");
    $(".aside.fixheight").hide()
    $(".wgt-bottom-ask").remove()
    $("#wgt-ecom-banner").hide()
    $(".grid.qb-side").hide()
    $("#wgt-ecom-related").hide()
    $(".wgt-push-bottom.mod-shadow.last").hide()
    $("#knowledge-answer").hide()

    $('.wgt-ask .ask-info #v-times').text($('meta[itemprop="datePublished"]').attr('content'));
    GM_addStyle(`.wgt-ask .ask-info #v-times{display:block!important}
                 #wgt-lvlin-form{display:none!important}
                 #wgt-ad-sou{display:none!important}`);

    setInterval((function(){
        $("#footer").attr("style","margin:0px 0px 20px 0px; padding:0px")
    }),1)

})();