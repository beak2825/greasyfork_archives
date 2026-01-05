// ==UserScript==
// @name         威锋不发烫
// @namespace    http://your.homepage/
// @version      0.7
// @description  ~~Mac浏览威锋不发烫~~
// @author       Haiifenng
// @match        http://bbs.feng.com/
// @match        http://bbs.feng.com/thread*
// @match        http://bbs.feng.com/forum*
// @match        http://bbs.feng.com/read*
// @match        http://bbs.feng.com/home*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/24765/%E5%A8%81%E9%94%8B%E4%B8%8D%E5%8F%91%E7%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/24765/%E5%A8%81%E9%94%8B%E4%B8%8D%E5%8F%91%E7%83%AB.meta.js
// ==/UserScript==

//使用abp添加如下自定义规则效果最佳
/*
//新规则，2017.03.11
bbs.feng.com###top_news_section
bbs.feng.com##.section.news_section.focus_section
bbs.feng.com##div#bbs_top_news
bbs.feng.com##div#header
bbs.feng.com##div#scbar_hot_1
bbs.feng.com##div.bml
bbs.feng.com##div.fl_row
bbs.feng.com##div.our_image
bbs.feng.com##div.our_services
bbs.feng.com##div.store_products_wrap
bbs.feng.com##div.wea_d_panel_980
bbs.feng.com##div[style*="display: block;background:#fff;box-shadow: 0 1px 3px #BCBCBC;margin: 0 auto 10px;padding: 10px 0 5px;overflow: hidden;text-align: center;"]


//旧版本adb规则，暂时弃用
bbs.feng.com###top_news_section
bbs.feng.com##.section.news_section.focus_section
bbs.feng.com##div#bbs_top_news
bbs.feng.com##div#header
bbs.feng.com##div#navigator
bbs.feng.com##div#scbar_hot_1
bbs.feng.com##div.bml
bbs.feng.com##div.fl_row
bbs.feng.com##div.our_image
bbs.feng.com##div.our_services
bbs.feng.com##div.store_products_wrap
bbs.feng.com##div.wea_d_panel_980
bbs.feng.com##div[style*="display: block;background:#fff;box-shadow: 0 1px 3px #BCBCBC;margin: 0 auto 10px;padding: 10px 0 5px;overflow: hidden;text-align: center;"]
bbs.feng.com##.header_wrap
*/

//$(".header_wrap").height("200px");
var headerWrap = $(".header_wrap");
var css = "/bbs_v4/images/header.png";
var topbarWrap = headerWrap.find(".topbar_wrap");
topbarWrap.css({"background-color":"rgb(68, 97, 127)","margin-bottom":"5px"});
var logo = topbarWrap.find("#global_topbar").find("ul.services").find("a");
logo.css({"background":"url(/bbs_v4/images/header.png) no-repeat -170px -320px","width":"60px","height":"32px"});
/*$("div[class='wrap quick_services']").before(topbarWrap);


$("#top_news_section").hide();
$("#bbs_top_news").hide();
$("#bbs_top_news").next().hide();
$("#header").hide();
$("div[id=navigator]").hide();
$("div[id=scbar_hot_1]").hide();
$("div[class*=bml]").hide();
$("div[class*=fl_row]").hide();
$("div[class*=our_image]").hide();
$("div[class*=our_services]").hide();
$("div[class*=store_products_wrap]").hide();
$("div[class*=wea_d_panel_980]").hide();

$("div.bml").hide();
$("div.fl_row").hide();
$("div.our_image").hide();
$("div.our_services").hide();
$("div.store_products_wrap").hide();
$("div.wea_d_panel_980").hide();
//$(".header_wrap").hide();
*/