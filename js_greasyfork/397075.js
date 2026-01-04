// ==UserScript==
// @name         今日头条、Mydrivers驱动之家、IT之家新闻站净化阅读，宽度适配，特定关键词的新闻标红加高亮、并把包含不感兴趣关键词的新闻屏蔽掉
// @description  对包含感兴趣的关键词的新闻高亮显示，并屏蔽掉不感兴趣的关键词的新闻
// @icon         http://www.drivergenius.com//favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/397075
// @version      1.9.2
// @author       ddrwin
// @match        *://www.toutiao.com/*
// @match        *://*.ithome.com/*
// @include      http*://*.mydrivers.com/*
// @exclude      *://www.toutiao.com/video/*
// @grant        GM_addStyle
// @note         2020.2.28 V1.0 对包含感兴趣的关键词的新闻高亮显示；
// @note         2020.2.29 V1.1 增加屏蔽包含不感兴趣的关键词的新闻；
// @note         2020.3.1  V1.2 增加文章页高亮关键词，优化文章页阅读宽度；
// @note         2021.2.23  V1.3 优化首页高亮关键词，调整文章页阅读宽度；
// @note         2022.2.2  V1.4 优化首页高亮关键词，调整文章页阅读宽度；
// @note         2022.2.4  V1.4.1 首页列表页居左；
// @note         2022.3.3  V1.5 优化首页高亮关键词，屏蔽文章页向前、向后按钮；
// @note         2023.5.20  V1.7 优化首页及文章页高亮关键词；
// @note         2025.4.7  V1.8 添加今日头条首页及文章页宽度适配，去掉侧边栏；
// @note         2025.4.8  V1.8.1 删除今日头条首页及文章页工具边栏；
// @note         2025.4.12  V1.9 增加IT之家首页及文章页优化，关键词屏蔽及高亮；
// @note         2025.11.23  V1.9.2 增加驱动之家文章页优化，去除AI摘要及广告；
// @downloadURL https://update.greasyfork.org/scripts/397075/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E3%80%81Mydrivers%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E3%80%81IT%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E7%AB%99%E5%87%80%E5%8C%96%E9%98%85%E8%AF%BB%EF%BC%8C%E5%AE%BD%E5%BA%A6%E9%80%82%E9%85%8D%EF%BC%8C%E7%89%B9%E5%AE%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E6%96%B0%E9%97%BB%E6%A0%87%E7%BA%A2%E5%8A%A0%E9%AB%98%E4%BA%AE%E3%80%81%E5%B9%B6%E6%8A%8A%E5%8C%85%E5%90%AB%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E6%96%B0%E9%97%BB%E5%B1%8F%E8%94%BD%E6%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/397075/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E3%80%81Mydrivers%E9%A9%B1%E5%8A%A8%E4%B9%8B%E5%AE%B6%E3%80%81IT%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E7%AB%99%E5%87%80%E5%8C%96%E9%98%85%E8%AF%BB%EF%BC%8C%E5%AE%BD%E5%BA%A6%E9%80%82%E9%85%8D%EF%BC%8C%E7%89%B9%E5%AE%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E6%96%B0%E9%97%BB%E6%A0%87%E7%BA%A2%E5%8A%A0%E9%AB%98%E4%BA%AE%E3%80%81%E5%B9%B6%E6%8A%8A%E5%8C%85%E5%90%AB%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E6%96%B0%E9%97%BB%E5%B1%8F%E8%94%BD%E6%8E%89.meta.js
// ==/UserScript==

(function() {

  //今日头条开始
    // 删除首页右侧边栏
    var rightSidebar = document.querySelector('.right-container');
    if (rightSidebar) {
        rightSidebar.remove();
    }

      // 删除首页底部
    var rightSidebar = document.querySelector('.footer-wrapper');
    if (rightSidebar) {
        rightSidebar.remove();
    }

    // 使首页左侧内容宽屏展示
    var leftSidebar = document.querySelector('.left-container');
    if (leftSidebar) {
        leftSidebar.style.width = '100%';
    }

    // 首页可能需要调整的其他样式
    var mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.width = '55%';
        mainContent.style.marginLeft = '125px';
    }

    // 删除文章页右侧边栏
    var rightSidebar = document.querySelector('.right-sidebar');
    if (rightSidebar) {
        rightSidebar.remove();
    }

    // 删除右侧工具栏
    var rightSidebar = document.querySelector('.ttp-toolbar');
    if (rightSidebar) {
        rightSidebar.remove();
    }

    // 删除文章页底部推荐
    var rightSidebar = document.querySelector('.detail-end-feed');
    if (rightSidebar) {
        rightSidebar.remove();
    }

  // 使文章页左侧内容宽屏展示
    var leftSidebar = document.querySelector('.left-sidebar');
    if (leftSidebar) {
        leftSidebar.style.width = '100%';
    }

    // 文章页可能需要调整的其他样式
    var mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.style.width = '65%';
        mainContent.style.marginLeft = '0';
    }




    //it之家开始
    // Custom Style
    var css=`
    #news{
    padding-top: 20px;
    padding-bottom: 25px;
    }
     #nnews,#dt .content{
     width: 100%;
     }
     #nav, #nav .fr{
     height:auto
     }
     ul.nl{
     width:46%;
     padding-top:0;
     margin-top:0;
     }
     ul.nl li a{
     width:calc(100% - 60px);
     }
     #nnews .t-f{
     margin-bottom:20px;
     }
     #tt, .ra, #nav .fl, #news .fl,.hotkeyword, div.bl.bb, #fls.bb, #cp.bb,#side_func a, .fr .t-h, footer,div.mt.so,#top #music,#dt .fr, .newsgrade, .shareto, .related_post, .dajia{
     display:none !important;
     }
     .article-share-code, .page-last, .page-next{
      display:none;
     }
     .fr{
     float:initial;
     }
     .cnbeta-update-list, .cnbeta-article{
     width:auto;
     }
     .pmsg{
        margin:0 auto;
      }
    `
    GM_addStyle(css)
    var ads = document.querySelectorAll('.ad');
    Array.from(ads).map(function(ad){
        ad.parentNode.style.display = 'none';
    })
    var itList = document.querySelectorAll('.t-b.clearfix');
    Array.from(itList).map(function(item) {
        item.classList.add('sel')
        document.querySelector('#n-p').style.display='none';
    });

    $("#nmsg").click(function(){
        location.reload()
    })



  //驱动之家开始
  //首页的界面优化
    var isContentPage = window.location.href.match(/mydrivers\.com\/$/);//检查首页
    if (isContentPage) {
      $("#newlist_1.zxgx").attr("style", "margin-left:-120px !important;");   //文章list区居左
    }

    //文章页的界面优化
    var isContentPage = /.*htm$/.test(location.href) &&  /^http(s)?:\/\/news\.mydrivers\.com\/.*$/.test(location.href)
    if (isContentPage) {
      $(".baidu,.main_right,#left_tab,#right_tab,.nav_box,.last,.next").remove();    //删除无用部分
      $(".main_box").attr("style", "width:830px !important;");      //主体宽度
      $("#thread_subject").attr("style", "width:800px; margin-left:-70px;");   //文章页的标题
      $(".news_info").attr("style", "width:600px;margin-left:20px !important;");     //文章宽度
      $(".newsinfo_vedio").attr("style", "margin-left:0px !important;");   //视频播放器
      $(".main_left").attr("style", "margin-left:1000px !important;");   //视频播放器
      // 新增：屏蔽文章页广告
      $('div[style="margin: auto;width: 580px;padding: 10px 0;"]').remove();
      //$("#MyComments.pinglun").attr("style", "width:660px !important;");        //评论宽度

}

   // 删除文章页AI摘要
    var elements = document.querySelectorAll('.AiSummaryLink_Span, .AiSummaryLink_close, .AiSummaryLink_title, .AiSummaryLink_AI');
    for (var i = 0; i < elements.length; i++) {
    elements[i].remove();
    }

    //驱动之家、IT之家_首页屏蔽关键词，把相关新闻屏蔽掉
    var BanText = ["小米", "红米", "雷军", "Redmi", "好物", "OPPO", "vivo", "卢伟冰", "紫米", "MIUI", "一加","realme","Galaxy","红魔",
                   "长城","东风日产","长安","tcl","天选","上汽","零跑","广汽","蔚来","深蓝","官方", "魅族", "tcl", "苏宁", "华米", "iQOO",
                   "史低","大促","到手","发车", "仅", "元/件"]; //屏蔽的字符
    var check_Ban = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查驱动之家首页
    //Ban掉相关字符
    if (check_Ban) {
        BanText.map(function(v) {
            $('li:contains(' + v + ')').hide();
        })
    }

    //驱动之家、IT之家_首页添加关键词，高亮颜色可以自定义 --黄底绿字 --科普
    var ColorText = ["北京","阿里","百度","腾讯","奔驰","新一代","中国","美国","女性","太空","NASA","月球","火星","飞船","火箭","探测器", "宇宙","暗黑", "科学"]; //高亮的字符
    var checkHigh = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查首页
    if (checkHigh) {
        ColorText.map(function(i) {
    //     $('a:contains(' + i + ')').css({"background-color":"#FFFFCC","color":"#000000"});
            $('a:contains(' + i + ')').css("cssText","background-color:#FFFFCC;color:#000000 !important");
        })
    }

    //驱动之家、IT之家_首页添加关键词，高亮颜色可以自定义 --加粗 --硬件
    var ColorText = ["nApoleon","ITX", "RTX", "DLSS", "Arrow", "Lake", "英特尔", "新一代", "Ultra", "Intel", "137","国补","265","137","137"]; //高亮的字符
    var checkHigh = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查首页
    if (checkHigh) {
        ColorText.map(function(i) {
    //     $('a:contains(' + i + ')').css({"background-color":"#FFFFCC","color":"#000000"});
            $('a:contains(' + i + ')').css("cssText","font-weight:bold !important");
        })
    }

    //驱动之家、IT之家_首页添加关键词，高亮颜色可以自定义 --黄底蓝字加粗 --人工智能
    var ColorText = [ "NVIDIA", "大模型","OpenAI","AI","ChatGPT","GPT","人工智能","芯片","机器人","GPU","deepseek","通义千问","文心一言"]; //高亮的字符
    var checkHigh = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查首页
    if (checkHigh) {
        ColorText.map(function(i) {
    //     $('a:contains(' + i + ')').css({"background-color":"#FFFFCC","color":"#5555FF"});
            $('a:contains(' + i + ')').css("cssText","background-color:#FFFFCC;color:#5555FF;font-weight:bold !important");
        })
    }

    //驱动之家、IT之家_首页添加关键词，高亮颜色可以自定义 --蓝底蓝字加粗 --华为
    var ColorText = ["5G","华为","HMS","鸿蒙","HUAWEI","麒麟","光刻机","Mate","HarmonyOS","荣耀","海思"]; //高亮的字符
    var checkHigh = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查首页
    if (checkHigh) {
        ColorText.map(function(i) {
            $('a:contains(' + i + ')').css("cssText","background-color:#CCEEFF;color:#5555FF");
            $('a:contains(' + i + ')').css("cssText","font-weight:bold !important");
        })
    }

    //驱动之家、IT之家_首页添加关键词，高亮颜色可以自定义 --黄底绿字加粗 --苹果|微软|特斯拉
    var ColorText = ["苹果", "iPhone", "iPad", "ios", "iOS","微软","电动车","特斯拉","马斯克"]; //高亮的字符
    var checkHigh = window.location.href.match(/(mydrivers|ithome)\.com\/$/);//检查首页
    if (checkHigh) {
        ColorText.map(function(i) {
            $('a:contains(' + i + ')').css("cssText","background-color:#FFFFCC;color:#00CC00;font-weight:bold !important");
        })
    }

    //文章页高亮关键词，颜色可以自定义  --黄底黑字 --科普
	  var news_info = document.getElementsByClassName("news_info")[0].innerHTML;
	  var s = "北京|阿里|百度|腾讯|奔驰|新一代|中国|美国|太空|女性|NASA|月球|火星|飞船|火箭|探测器|宇宙|暗黑|科学";
    var reg = new RegExp("(" + s + ")", "g");
    var str = news_info;
    var newstr = str.replace(reg, "<SPAN style='background-color:#FFFFCC;color:#000000'>$1</SPAN>");
	  document.getElementsByClassName("news_info")[0].innerHTML = newstr;

    //文章页高亮关键词，颜色可以自定义  --黄底蓝字 --人工智能
	  var news_info = document.getElementsByClassName("news_info")[0].innerHTML;
	  var s = "NVIDIA|大模型|OpenAI|AI|ChatGPT|GPT|人工智能|芯片|机器人|GPU|科大讯飞|通义千问|文心一言";
    var reg = new RegExp("(" + s + ")", "g");
    var str = news_info;
    var newstr = str.replace(reg, "<SPAN style='background-color:#FFFFCC;color:#5555FF'>$1</SPAN>");
	  document.getElementsByClassName("news_info")[0].innerHTML = newstr;

    //文章页高亮关键词，颜色可以自定义  --蓝底蓝字加粗 --华为
	  var news_info = document.getElementsByClassName("news_info")[0].innerHTML;
	  var s = "5G|华为|HMS|鸿蒙|HUAWEI|麒麟|光刻机|Mate|HarmonyOS|荣耀|海思";
    var reg = new RegExp("(" + s + ")", "g");
    var str = news_info;
    var newstr = str.replace(reg, "<SPAN style='background-color:#CCEEFF;color:#5555FF;font-weight:bold !important'>$1</SPAN>");
	  document.getElementsByClassName("news_info")[0].innerHTML = newstr;

    //文章页高亮关键词，颜色可以自定义  --黄底绿字加粗 --苹果|微软|特斯拉
	  var news_info = document.getElementsByClassName("news_info")[0].innerHTML;
	  var s = "苹果|iPhone|iPad|ios|iOS|微软|特斯拉|电动车|马斯克";
    var reg = new RegExp("(" + s + ")", "g");
    var str = news_info;
    var newstr = str.replace(reg, "<SPAN style='background-color:#FFFFCC;color:#00CC00;font-weight:bold !important'>$1</SPAN>");
	  document.getElementsByClassName("news_info")[0].innerHTML = newstr;


//驱动之家净化阅读 - 文章样式调整
  if ('loading' == document.readyState) {
    console.log("此脚本在文档启动时运行。");
    $("script").remove()
} else {
    console.log("此脚本与document.readyState一起运行：" + document.readyState);
    $("script").remove()
}
document.addEventListener('readystatechange', event => {
    $("script").remove()
    if (event.target.readyState === 'loading') {
        $("script").remove()
        console.log("此脚本在文档启动时运行1。");
    }
    if (event.target.readyState === 'interactive') {
        $("script").remove()
        console.log("此脚本在文档启动时运行2。");
    } else if (event.target.readyState === 'complete') {
        $("script").remove()
        console.log("此脚本在文档启动时运行3。");
    }
});

    $("script").remove()
    console.log("此脚本开始运行。");
    'use strict';

    var isContentPage = /.*htm$/.test(location.href) &&  /^http(s)?:\/\/news\.mydrivers\.com\/.*$/.test(location.href)
    var isIndexPage = /^http(s)?:\/\/www\.mydrivers\.com\/$/.test(location.href)
    var isZhiBo = $(".zhibo_box").length > 0


    if(isZhiBo) {

    } else if (isContentPage) {

        $(".main_left").attr("style", "width:1250px !important;margin:0 auto;float:none;height: auto;");
        $(".news_info1").attr("style", "background: #fff;");
        $(".main_1").removeAttr("style");
        $(".main_1").attr("style", "height:1099px;");


        $("script").remove()
        //$(".news_info>div").remove();
        $("#i_lastnext").remove();
        $(".pathway").remove();
        $(".baidu").remove();

        $(".news_n").nextAll().not("#commentsiframe").remove();

        $(".top").remove();
        $(".weixin").remove();
        $(".news_xg").remove();
        $(".main_right").remove();
        $("#right_tab").remove();
        //$("iframe").remove();
        $("body link").remove();
        $("body style").remove();


        $("#dummybodyid .news_box").attr("style", "width:1333px;");
        $("#dummybodyid .news_box .news_left").attr("style", "width:1333px;");

        $(".news_n").attr("style", "width:1230px;");
        $(".pinlun_input").attr("style", "width:1230px;");
        $(".plun_left_newplun").attr("style", "width:1230px;");
        $("#commentsiframe").attr("style", "width:92%;");
        $(".share table").attr("style", "width:85%;");
        $("#a_showhotnews_list_dia").remove();

        $("#dangbei_down").parent().remove();
        $(".news_bt1").remove();
        $(".zcdf").remove();
        $(".share").remove();
        //$("#commentsiframe").remove();
        $("#footer").remove();
        $("div.news_box  ").remove();

        var newsLeft = $(".news_left");
        var commentsiframe = $("#commentsiframe");
        newsLeft.css("width", "1333px")

        // iframe加载完毕
        commentsiframe.load(function() {
            console.log("commentsiframe iframe 加载完毕！");
            commentsiframe.contents().find(".plun_box").css("margin","0 auto").css("padding-left","45px");
            var iframeHeight = commentsiframe.contents().find("body").height();
            commentsiframe.css("height", iframeHeight);

            setTimeout('$(".news_left").css("height", "auto")', 1000);
            $(".baidu").remove();

        });


    } else {
        if (isIndexPage) {

            $(".main_left").attr("style", "width:1050px !important;margin:0 auto;float:none;height: auto;background:#fff0;");
            $(".news_info1").attr("style", "background: #fff;");
            $(".main_1").removeAttr("style");
            $(".main_1").attr("style", "height:1099px;");

            var shidianDom = $(".shidian")
            shidianDom.remove();

            $(".main_box").remove();
            var gcDom = $("#GC_box")
            gcDom.nextAll().remove();
            gcDom.remove();

            $("iframe").remove();
            $("body link").remove();
            $("body style").remove();

            $(".main_2").remove();

            $(".nav_box").remove();
            $(".main_right").remove();
            $(".main_right_title").remove();
            $(".main").attr("style", "width:1333px;");
            $("#news_content_1,#news_content_2,#news_content_3,#news_content_4,#news_content_5").after(
                '<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="80%" color=#987cb9 SIZE=1>'
            ).show()
            $("#news_content_page").remove();
        } else {
            $(".shidian").remove();
            $(".product_box").remove();
            $(".righttitle ").remove();
            $(".top_1_center ").remove();
            $(".pathway ").remove();
            $(".main_right div:not(:last-child)").remove();
            $(".link ").remove();
            $("#footer").remove();
        }
    }


    //$("iframe").not("#commentsiframe").each(function() {$(this).remove();});
    $(".footer_about").remove();


    $(".share table tbody tr td:lt(2)").remove();

    $(".yzm").css("margin-right", "30px");

})()