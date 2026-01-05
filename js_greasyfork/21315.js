// ==UserScript==
// @name         清理百度贴吧插入广告
// @icon         http://www.gzqiyi.cn/fximg/delicious.gif
// @namespace    moekai.moe.cleartiebaad
// @version      1.3.3
// @description  清理掉贴吧列表和贴子中插入的广告
// @author       YIU
// @match        *://tieba.baidu.com/f*
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/home/*
// @match        *://*.tieba.baidu.com/f*
// @match        *://*.tieba.baidu.com/p/*
// @match        *://*.tieba.baidu.com/home/*
// @match        *://jump.bdimg.com/f*
// @match        *://jump.bdimg.com/p/*
// @match        *://jump.bdimg.com/home/*
// @match        *://fexclick.baidu.com/f/*
// @match        *://fexclick.baidu.com/p/*
// @match        *://fexclick.baidu.com/home/*
// @run-at       document-start
// @require      https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @supportURL   https://github.com/usaginya/mkAppUpInfo/tree/master/monkeyjs
// @homepageURL  https://github.com/usaginya/mkAppUpInfo/tree/master/monkeyjs
// @downloadURL https://update.greasyfork.org/scripts/21315/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%8F%92%E5%85%A5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/21315/%E6%B8%85%E7%90%86%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%8F%92%E5%85%A5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

//======== 你可以修改这下面的开关数值 (0不清理 1清理) ========
//清理楼层右下角成就图标
var delams = 1;



//======== 清理样式构建,不要修改 =========//
var kamikakushi = '<style id="kamikakushi">';


//----------- 神隐 ---------------------------------------//

//-- 贴子列表, 贴子夹层AD
kamikakushi += '#thread_list>:not(.thread_top_list_folder):not([data-field*=author_]):not([data-tid]),'
kamikakushi += '#j_p_postlist>.l_post:not([data-field*=content\\"\\:]):not([data-tid]),';
kamikakushi += '[ad-dom-img], .fengchao-wrap-feed, [class*=-ad-], .tbui_aside_float_bar + div,';

//-- 贴子列表选项卡：我的游戏
kamikakushi += '.nav_list .more-config-navtab,';

//-- 贴子列表顶部相关活动信息
kamikakushi += '.bus-top-activity-wrap,';

//-- 贴子楼层成就图标
if(delams > 0){
	kamikakushi += '.achievement_medal_section,';
}

//-- 贴吧背景左右链接, 右边栏推荐应用
kamikakushi += 'body>.j_couplet, .aside_region.my_app,';

//-- 贴子顶部banner, 右边栏图片
kamikakushi += '#banner_pb_customize, #branding_ads, div[id*=aside-ad], #fc-wrap,';
kamikakushi += '.lu-search-box,';

//-- 贴吧底部关注提示
kamikakushi += '.xiu8_follow_warn,';

//-- 贴吧主页边栏AD
kamikakushi += '#lu-user-right[class*=_],';

//-- 贴吧404下的AD
kamikakushi += '#error_404_iframe,';
kamikakushi += '[class$=-ad],[id*=_ad_]'

//------! 神隐 !------
kamikakushi += '{display:none!important}';




//------- 秘匿 ---------------------------------------------//

//-- 贴吧顶部信息推荐背景
kamikakushi += '#plat_recom_carousel';

//------! 秘匿 !------
kamikakushi += '{visibility:hidden!important}';




//---- 再构筑 (显示改造) ----------------------------------//

//-- 贴吧顶部信息推荐背景
kamikakushi += '#plat_recom_carousel {height:180px!important}';



kamikakushi += '</style>';

//======== 清理样式构建结束 =========//




//======== 执行区,不要修改 =======
(function(){

	$('head').append(kamikakushi);

	//等待到页面载入后再检查注入、没有注入则重新注入
	$(document).ready(function(){
		if ($('#kamikakushi').length > 0) return;
		$('head').append(kamikakushi);
	});

})();