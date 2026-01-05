// ==UserScript==
// @name         Userscript for www.hitouba.com
// @namespace    http://www.yuexiaohome.com/hitouba
// @version      0.83
// @description  customize www.hitouba.com user account menu and top menu
// @description:zh-CN 定制Hi投吧网站的用户后台菜单、顶部菜单
// @author       Ivan Chen
// @grant        none
// @require        http://code.jquery.com/jquery-2.1.1.min.js
// @include http://www.hitouba.com/*
// @downloadURL https://update.greasyfork.org/scripts/10370/Userscript%20for%20wwwhitoubacom.user.js
// @updateURL https://update.greasyfork.org/scripts/10370/Userscript%20for%20wwwhitoubacom.meta.js
// ==/UserScript==
jQuery("div.userMenu dd").show();
jQuery(".userMenu dd a").css("line-height","30px").css("height","30px");
jQuery(".userMenu dt").hide();
jQuery(".userMenu dd a u").hide();
jQuery("dl.lastMenu dd a").eq(1).hide();
jQuery("dl.lastMenu dd a").eq(3).hide();
jQuery(".userMenu dl:eq(2)").hide();
jQuery(".userMenu dl:eq(3)").hide();
//jQuery(".dl-link").hide();
jQuery(".topRight a").removeClass("zc-link");

jQuery("div.quickLink1").after('<a href="/other/tender_list.jhtml" >发标预告</a>');
//jQuery("div.quickLink1").after('<a href="/task/queryUserTaskList.jhtml">任务大厅</a>');

//优化投资记录页面
jQuery(".mList-con td>a").each(function(){
	jQuery(this).text(jQuery(this).attr("title"));});
jQuery(".record td").css("line-height", "15px");
jQuery("td.ui-widget-content>div").css("min-height","56px");

//优化导航
jQuery("span.phone").before('<a href="http://www.hitouba.com/" >首页</a>&nbsp;&nbsp;');
jQuery("span.weixin").after('&nbsp;&nbsp;<a href="/index/dataListGraph.jhtml" >平台数据</a>');
jQuery("span.weixin").after('&nbsp;&nbsp;<a href="/aboutUs/index.jhtml" >关于我们</a>');
jQuery("span.weixin").after('&nbsp;&nbsp;<a href="/busi/i-want-invest/forward-invest-list/borrowing.jhtml">我要理财</a>');
jQuery("div.nav").hide();