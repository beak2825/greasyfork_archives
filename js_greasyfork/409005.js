// ==UserScript==
// @name         多吉搜索美化
// @namespace    http://nreg.com/
// @version      0.8
// @description  try to take over the world!
// @author       nreg
// @match        http://www.dogedoge.com/*
// @grant        none
// @include      https://www.dogedoge.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/409005/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/409005/%E5%A4%9A%E5%90%89%E6%90%9C%E7%B4%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取搜索关键字
    var keyword=$("#search_form_input").val();

    //字体修改 font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    document.body.style.fontFamily = "Helvetica Neue","Microsoft YaHei","Helvetica","Arial","sans-serif !important";
    $("input#search_form_input.search__input--adv.js-search-input").css("fontFamily","Helvetica Neue","Microsoft YaHei","Helvetica","Arial","sans-serif !important");
    $("a.result__a").css("font-size","18px");

    //搜索面板背景色由脏白色改为纯白色
    $("div#header_wrapper.header-wrap.b_class").css("background-color","#FFFFFF");
    $("div#header_wrapper.header-wrap.b_class").css("height","auto");

    //搜索菜单+搜索框距离底部与顶部距离
    $("div#header.header.cw").css("padding","20px 0 5px");
    $("div#header.header.cw").css("height","auto");

    //修正搜索from与logo的间距
    $("div.header__search-wrap").css("margin-left","6px");
    //搜索菜单距搜索框距离
    $("div.zcm").css("margin-top","15px");
    //搜索菜单 高度
    $("#duckbar").css("height","auto");
    //搜索菜单 最大宽度:父-子
    $("#duckbar").css("max-width","4096px");
    $("div.zcm").css("max-width","4096px");
    $("#duckbar_static").css("max-width","4096px");

    //搜索框 最大宽度 父-子
    $("#header").css("max-width","4096px");
    $("div.header__search-wrap").css("max-width","4096px");
    //$("div.header__content header__search").css("max-width","4096px");//不包含输入框
    //$("#search_form").css("max-width","4096px");//不包含输入框
    //$("#search_form_input").css("max-width","4096px");//不包含输入框
    $("#duckbar").css("max-width","4096px");
    $("div.zcm").css("max-width","4096px");
    $("#duckbar_static").css("max-width","4096px");

    //限制输入框宽度 父-子
    $("div.header__content header__search").css("width","625px");
    $("#search_form").css("width","625px");
    $("#search_form_input").css("width","625px");

    //搜索框 整体居中 父-子
    $("#header_wrapper").css("text-align","centor");
    $("#header").css("text-align","centor");
    $("#header_spaces").css("text-align","centor");
    $("div.header__search-wrap").css("text-align","centor");
    $("div.header__content header__search").css("text-align","centor");
    $("#search_form").css("text-align","centor");
    $("#duckbar").css("text-align","centor");
    $("div.zcm").css("text-align","centor");
    $("#duckbar_static").css("text-align","centor");


    //全整体居中 父-子
    //$("body").css("text-align","centor");
    //$("div.bsite-wrapper js-site-wrapper").css("text-align","centor");

    //搜索结果 距离顶部面板距离
    $("div#web_content_wrapper.content-wrap").css("padding-top","5px");

    //搜索结果的面板最大宽度：父-子
    $("#web_content_wrapper").css("max-width","4096px");
    $("#div.cw").css("max-width","4096px");
    $("#links_wrapper").css("max-width","4096px");
    $("#div.results--main").css("max-width","4096px");
    $("#div.results--sidebar js-results-sidebar").css("max-width","4096px");

    //搜索结果的内容 最大宽度： 父-子
    $("div.results--main").css("max-width","645px");
    $("#links").css("max-width","645px");
    $("div.result results_links_deep highlight_d result--url-above-snippet").css("max-width","645px");
    $("div.result__body links_main links_deep").css("max-width","645px");
    $("h2.result__title").css("max-width","645px");
    $("a.result__a").css("max-width","645px");
    $("div.result__extras js-result-extras").css("max-width","645px");
    $("div.result__extras__url").css("max-width","645px");
    $("div.result__snippet js-result-snippet").css("max-width","645px");//含图片和内容的父级（图片+内容的最大宽度）
    $("div.in_result_banner").css("max-width","160px");
    //$("div.in_result_banner>img").css("max-width","160px");//图片
    $("a.result__url js-result-extras-url").css("max-width","645px");//小url中含图标和链接的父级（图标+链接的最大宽度）
    $("span.result__url__domain").css("max-width","630px");//链接

    //搜索结果的内容 最大高度： 父-子 给的内容少和图片小 实际不会起效果
    $("div.result results_links_deep highlight_d result--url-above-snippet").css("max-height","145px")
    $("div.result__body links_main links_deep").css("max-height","145px")
    $("div.result__snippet js-result-snippet").css("max-height","100px");//含图片和内容的父级

    //搜索结果 整体居中 父-子
    $("#web_content_wrapper").css("text-align","centor");
    $("#div.cw").css("text-align","centor");
    $("#links_wrapper").css("text-align","centor");
    $("#div.results--main").css("text-align","centor");
    $("#div.results--sidebar js-results-sidebar").css("text-align","centor");

    //右下角 百度搜索 改为秘迹搜索
    $("a.feedback-btn__send.js-feedback-start").text("秘迹");
    $("a.feedback-btn__send.js-feedback-start").attr("href","https://mijisou.com/?q="+keyword);

    //上、下一页 改为脚图标
    $("#rld-2").css("padding","0px");
    $("#rld-2").css("width","60.78px");
    $("#rld-2").css("height","39.52px");
    $("#rld-2").css("margin-right","42px");
    $("div.result.result--more").css("width","30px");
    $("div.result.result--more").css("height","33.53px");

    $("a.result--more__btn.btn.btn--full").text("");
    $("a.result--more__btn.btn.btn--full").css("background-color","#FFFFFF");
    $("a.result--more__btn.btn.btn--full").append("<img src='https://s1.ax1x.com/2020/08/16/dAdzSU.png'>");
    $("a.result--more__btn.btn.btn--full img").css("width","30px");
    $("a.result--more__btn.btn.btn--full").css("width","30px");
    $("a.result--more__btn.btn.btn--full").css("height","33.53px");



    //丰富多吉未实现的功能
    var navigation = function(){
        //清空其下所有子元素
        $("#duckbar_static").innerHtml="";
        $("#duckbar_static").empty();

        $("#duckbar").css('width','auto');
        $("#duckbar_static").css('width','auto');
        $(".zcm__item a").css('width','auto');
        $("div.zcm").css('width','auto');
        $("li.zcm__item").css('width','auto');
        $("a.zcm__link.js-zci-link.js-zci-link--github-hidden").css('width','auto');
        $("a.zcm__link.js-zci-link.js-zci-link--web is-active").css('width','auto');

        //菜单项：id为duckbar_static与duckbar_new的ul元素为同级，duckbar_new可以另起一行
        //网页：将web改为网页
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='web' class='zcm__link js-zci-link js-zci-link--web is-active'  href='javascript:;'>网页</a></li>");
        $(".zcm__item a").eq(0).attr("href","javascript:void(0)");
        //第1项菜单 顶头写
        $("div.zcm").css("padding-left","0px");
        $("#duckbar_static").css("padding-left","0px");
        $(".zcm__item a").eq(0).css("padding-left","0px");

        //指南：指向 https://www.wikihow.com/wikiHowTo?search=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='guide' class='zcm__link js-zci-link js-zci-link--guidesis-hidden'  target = '_blank' href='javascript:void(0);'>指南</a></li>");
        $(".zcm__item a").eq(1).attr("href","https://www.wikihow.com/wikiHowTo?search="+keyword);

        //文档：指向淘链客 http://www.toplinks.cc/s/?keyword=
        //$("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='word' class='zcm__link js-zci-link js-zci-link--wordsis-hidden' target = '_blank' href='javascript:void(0);'>文档</a></li>");
        //$(".zcm__item a").eq(2).attr("href","http://www.toplinks.cc/s/?keyword="+keyword);

        //图书：指向  http://185.39.10.101/search.php?req=
        $("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='book' class='zcm__link js-zci-link js-zci-link--booksis-hidden' target = '_blank' href='javascript:void(0);'>图书</a></li>");
        $(".zcm__item a").eq(2).attr("href","http://185.39.10.101/search.php?req="+keyword);

        //图片：指向bing    https://cn.bing.com/images/search?q= 改用搜狗：https://pic.sogou.com/pics?query= （可以以图搜图）
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='images' class='zcm__link js-zci-link js-zci-link--imagesis-hidden' target = '_blank' href='javascript:void(0);'>图片</a></li>");
        $(".zcm__item a").eq(3).attr("href","https://pic.sogou.com/pics?query="+keyword);

        //壁纸：指向 https://bing.lylares.com/search?q=
        $("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='wall' class='zcm__link js-zci-link js-zci-link--wallsis-hidden' target = '_blank' href='javascript:void(0);'>壁纸</a></li>");
        $(".zcm__item a").eq(4).attr("href","https://bing.lylares.com/search?q="+keyword);

        //动图：指向soogif https://www.soogif.com/search/
        $("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='gif' class='zcm__link js-zci-link js-zci-link--gifsis-hidden' target = '_blank' href='javascript:void(0);'>动图</a></li>");
        $(".zcm__item a").eq(5).attr("href","https://www.soogif.com/search/"+keyword);

        //音乐：指向 https://music.163.com/#/search/m/?s=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='music' class='zcm__link js-zci-link js-zci-link--musicsis-hidden'  target = '_blank' href='javascript:void(0);'>音乐</a></li>");
        $(".zcm__item a").eq(6).attr("href","https://music.163.com/#/search/m/?s="+keyword);

        //电影：指向茶杯狐   https://www.cupfox.com/search?key=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='videos' class='zcm__link js-zci-link js-zci-link--videosis-hidden'  target = '_blank' href='javascript:void(0);'>电影</a></li>");
        $(".zcm__item a").eq(7).attr("href","https://www.cupfox.com/search?key="+keyword);

        //游戏：https://store.steampowered.com/search/?term=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='game' class='zcm__link js-zci-link js-zci-link--gamesis-hidden'  target = '_blank' href='javascript:void(0);'>游戏</a></li>");
        $(".zcm__item a").eq(8).attr("href","https://store.steampowered.com/search/?term="+keyword);

        //主题:https://zhutix.com/?s=
        //$("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='theme' class='zcm__link js-zci-link js-zci-link--themesis-hidden' target = '_blank' href='javascript:void(0);'>主题</a></li>");
        //$(".zcm__item a").eq(10).attr("href","https://zhutix.com/?s="+keyword);

        //B站:https://search.bilibili.com/all?keyword=
        $("#duckbar_static").append("<li class='zcm__item'> <a data-zci-link='bSite' class='zcm__link js-zci-link js-zci-link--bSitesis-hidden' target = '_blank' href='javascript:void(0);'>哔哩</a></li>");
        $(".zcm__item a").eq(9).attr("href","https://search.bilibili.com/all?keyword="+keyword);

        //新闻：指向今日头条 https://www.toutiao.com/search/?keyword=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='news' class='zcm__link js-zci-link js-zci-link--newsis-hidden'  target = '_blank' href='javascript:void(0);'>新闻</a></li>");
        $(".zcm__item a").eq(10).attr("href","https://www.toutiao.com/search/?keyword="+keyword);

        //翻译：百度："https://fanyi.baidu.com/#zh/en/" + keyword
        //翻译：爱词霸 "http://open.iciba.com/huaci_new/dict.php?word=" + keyword
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='translate' class='zcm__link js-zci-link js-zci-link--translate-hidden' target = '_blank' href='javascript:void(0);'>翻译</a></li>");
        $(".zcm__item a").eq(11).attr("href","https://fanyi.baidu.com/#zh/en/"+keyword);

        //github：https://github.com/search?q=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='github' class='zcm__link js-zci-link js-zci-link--github-hidden' target = '_blank' href='javascript:void(0);'>git</a></li>");
        $(".zcm__item a").eq(12).attr("href","https://github.com/search?q="+keyword);

        //mvn依赖搜索:https://mvnrepository.com/search?q=
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='mvn' class='zcm__link js-zci-link js-zci-link--mvn-hidden' target = '_blank' href='javascript:void(0);'>mvn</a></li>");
        $(".zcm__item a").eq(13).attr("href","https://mvnrepository.com/search?q="+keyword);

        //知乎搜索:
        $("#duckbar_static").append("<li class='zcm__item'><a data-zci-link='tz' class='zcm__link js-zci-link js-zci-link--tz-hidden' target = '_blank' href='javascript:void(0);'>知乎</a></li>");
        $(".zcm__item a").eq(14).attr("href","https://www.zhihu.com/search?type=content&q="+keyword);
    }
    navigation();
    $("#search_form_input").on('input', function(){
        keyword =$("#search_form_input").val();
        keyword = encodeURIComponent(keyword);
        navigation();
    });

    //工具：https://tool.lu/search/?query=
    //IBM: https://developer.ibm.com/zh/?s=
    //极客：https://s.geekbang.org/search/c=0/k=" + keyword + "/t=";
    //人工智能：https://magi.com/search?q=

})();