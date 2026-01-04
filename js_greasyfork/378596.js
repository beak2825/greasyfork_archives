// ==UserScript==
// @name               精简百度、搜狗、360搜索页面
// @namespace          http://tampermonkey.net
// @version            2.3
// @description        喜欢简洁的人必备脚本。精简百度、搜狗、360主页面，删除左上角、右上角和下方的东西，只留下logo和搜索框。
// @author             超逗的二哈少爷
// @match              https://www.baidu.com/*
// @match              https://www.sogou.com/*
// @match              https://www.so.com/*
// @grant              none
// @note               2019.03.13-V2.3针对某些浏览器精简百度首页右上角。
// @note               2019.03.03-V2.2重新精简百度主页。
// @note               2019.03.03-V2.1精简百度搜索页面右上角“登录”按钮；重新精简百度主页。
// @note               2019.03.03-V2.0精简百度搜索页面顶部和底部信息；精简搜狗搜索页面顶部和底部信息；精简360搜索页面顶部、右侧和底部信息；精简“AC-baidu优化”脚本右上角的“自定义”按钮；修改脚本简介。
// @note               2019.03.02-V1.1脚本注释更精确；将脚本名称“精简百度、搜狗、360主页”修改为“精简百度、搜狗、360搜索页面”；修改脚本简介。
// @downloadURL https://update.greasyfork.org/scripts/378596/%E7%B2%BE%E7%AE%80%E7%99%BE%E5%BA%A6%E3%80%81%E6%90%9C%E7%8B%97%E3%80%81360%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378596/%E7%B2%BE%E7%AE%80%E7%99%BE%E5%BA%A6%E3%80%81%E6%90%9C%E7%8B%97%E3%80%81360%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';


//精简首页


    //精简百度首页左上角按钮
    $('#s_upfunc_menus,.s-upfunc-menus ').hide();
    //精简百度右上角按钮
    $(' #u_sp,.s-isindex-wrap.s-sp-menu,#u1 ').hide();
    //精简百度首页上方横线
    $(' #s_top_wrap ').hide();
    //精简百度首页下方热点新闻
    $(' #s_wrap ').hide();
    //精简百度下方二维码
    $(' .qrcode-img ').hide();
    //精简百度下方二维码文字
    $(' .qrcode-text ').hide();
    //精简百度首页下方关于字样
    $(' .ftCon-Wrapper ').hide();


    //精简搜狗首页左上角按钮
    $(' .top-nav ').hide();
    //精简搜狗首页右上角按钮
    $(' .user-box ').hide();
    //精简搜狗首页底部二维码
    $(' .ewm ').hide();
    //精简搜狗首页底部二维码右侧文字
    $(' .erwx ').hide();
    //精简搜狗首页底部右侧关于信息
    $(' .ft-info ').hide();


    //精简360首页左上角按钮
    $(' .skin-text.skin-text-tab ').hide();
    //精简360首页右上角按钮
    $(' .bar.skin-text.skin-text-top,.setting,.changeskin,.remind,#user-login,.login ').hide();
    //精简360首页底部
    $(' #footer,.skin-text.skin-text-foot ').hide();


//精简搜索页面

    //精简百度搜索页面“百度为您找到相关结果”字样
    $(' .nums_text ').hide();
    //精简百度搜索页面“您可以仅查看：英文结果”字样
    $(' .c-gray ').hide();
    //精简百度搜索页面“搜索工具”按钮
    $(' .search_tool ').hide();
    //精简百度搜索页面右上角“首页”字样
    $(' .toindex ').hide();
    //精简百度搜索页面右上角“消息”字样
    $(' #imsg ').hide();
    //精简百度搜索页面右上角“设置”按钮
    $(' .pf ').hide();
    //精简百度搜索页面右上角“登录”按钮
    $(' .lb ').hide();
    //精简百度搜索页面右上角“用户名”按钮
    $(' #user,.username ').hide();
    //精简百度搜索页面底部的“相关搜索”信息
    $(' #rs ').hide();
    //精简百度搜索页面底部
    $(' #foot ').hide();



    //精简搜狗搜索页面“网页、新闻、微信”等按钮
    $(' .searchnav ').hide();
    //精简搜狗搜索页面“全部时间”按钮
    $(' .all-time ').hide();
    //精简搜狗搜索页面“搜狗已为您找到条相关结果”字样，这个也会将“全部时间”按钮去除，无法单独去除
    $(' .num-tips ').hide();
    //精简搜狗搜索页面“您是不是要搜索英文结果”字样
    $(' .bing-snb.overline ').hide();
    //精简搜狗搜索页面“相关推荐”按钮
    $(' #sogou_vr_21167301_recommand_0,.r-sech ').hide();
    //精简搜狗搜索页面“设置”按钮
    $(' #settings,.sogou-set ').hide();
    //精简搜狗搜索页面“登录”按钮
    $(' #loginBtn,.res-logn-ico ').hide();
    //精简搜狗搜索页面底部的“相关搜索”信息
    $(' #hint_container,.hint ').hide();
    //精简搜狗搜索页面底部
    $(' #s_footer,.cr ').hide();


    //精简360搜索页面“网页、资讯、问答”等按钮
    $(' #g-hd-tabs ').hide();
    //精简360搜索页面“时间”按钮
    $(' .adv-search-btn.pngfix.adv-search-btn-short ').hide();
    //精简360搜索页面“为您推荐”信息
    $(' #so-pdr-guide,.so-pdr ').hide();
    //精简360搜索页面右上角所有按钮
    $(' .title ').hide();
    //精简360搜索页面底部的“相关搜索”信息
    $(' #rs ').hide();
    //精简360搜索页面底部“找到相关结果”字样
    $(' .nums ').hide();
    //精简360搜索页面右侧“360搜索安全保障”字样
    $(' #soSafe ').hide();
    //精简360搜索页面右侧图片
    $('#mohe-know_side_nlp-imagelist ').hide();
    //精简360搜索页面右侧新闻
    $(' .mh-wrap.js-mh-wrap.mh-active ').hide();
    //精简360搜索页面右侧“查看更多”按钮
    $(' #side,.wlarge ').hide();

    
     //精简“AC-baidu优化”脚本右上角的“自定义”按钮
     $(' .myuserconfig ').hide();

})();