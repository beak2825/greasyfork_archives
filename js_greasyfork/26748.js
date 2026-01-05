// ==UserScript==
// @name         自用精简淘宝首页
// @version      0.1
// @description  精简淘宝首页广告，反正我直接搜索，也不看底下
// @author       FeiLong
// @match        https://www.taobao.com/
// @grant	GM_addStyle
// @namespace https://greasyfork.org/users/28687
// @downloadURL https://update.greasyfork.org/scripts/26748/%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80%E6%B7%98%E5%AE%9D%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/26748/%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80%E6%B7%98%E5%AE%9D%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==


//这个函数抄自：
//https://greasyfork.org/scripts/16678-%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80b%E7%AB%99/code/%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80B%E7%AB%99.user.js
function css_hide(condition) {
	GM_addStyle(condition + ' { display: none !important; }');
}

/*********淘宝首页***************/
//搜索提示
css_hide(".J_TbSearchContent");

//左边
css_hide(".main");

//特色中国哪一行
css_hide(".nav");

//淘宝二维码
css_hide(".tbh-qr");

//搜索推荐
css_hide(".search-ft");

//中间滚动广告
css_hide(".J_Core");

//右侧公告
css_hide(".tbh-notice");

//充话费的
//css_hide(".tbh-conve");

//app
css_hide(".tbh-app");

//中间的
css_hide(".seat");

//下边的
css_hide(".bottom");

//飘着的
css_hide(".hander");

//竟然还留了点
css_hide(".tbh-belt");


//这还藏一个
css_hide(".service-ft");

//最下边
css_hide(".footer");

//淘金币什么的
css_hide(".member-tjb");
