// ==UserScript==
// @name	自用精简B站
// @version	0.8
// @description 去除各种推广分享内容以及不想看的分区,删除广告请用ABP
// @match	*://www.bilibili.com/*
// @include	*://www.bilibili.com/*
// @author	Anonymous_temp_user
// @grant	GM_addStyle
// @namespace	Fuck Bilibili promotion
// @downloadURL https://update.greasyfork.org/scripts/16678/%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/16678/%E8%87%AA%E7%94%A8%E7%B2%BE%E7%AE%80B%E7%AB%99.meta.js
// ==/UserScript==

function css_hide(condition) {
	GM_addStyle(condition + ' { display: none !important; }');
}

// /*
//  * 首页屏蔽
//  */
// 什么狗日的游戏中心之类的导航全删掉
css_hide('.z_top_nav')
css_hide('.header-layer')
css_hide('.header-link')

// 又来狗日的浮动推广
css_hide('.bili_live_pmt')

// 隐藏整个头部推广包括logo,季节图片等等
css_hide('.h-center')
//修正header的偏移
GM_addStyle('.header { margin: 0px auto 0px !important; }');

// 头部推广被隐藏后,同时屏蔽广场/直播,为搜索提供空间
// 并且修改CSS让搜索位置出现在nav-menu中
css_hide('.m-i.m-i-square')
css_hide('.m-i.m-i-live')
css_hide('.menu-r')
GM_addStyle('.header .num .search { top: 10px !important; }');

//干死狗日的飘柔推广和首页
css_hide('#b_promote')
css_hide('.container-top-wrapper')
css_hide('[data-ad-type="banner"]')

//去掉卵用没有的导航栏,反正之后会手动屏蔽掉不需要的分区
css_hide('#index_nav')

//排名都快成了推广了
css_hide('.b-r')

//可屏蔽分区列表
//然而除了游戏区外几乎没有卵用
//默认屏蔽可能出现撕逼与洗脑的科技
//以及狗日的三次元的电视电影时尚娱乐鬼畜舞蹈
//同时不爱直播,一样屏蔽
//$('#b_bangumi')
//$('#b_game')
//$('#b_douga')
css_hide('#b_douga')
css_hide('#b_live')
css_hide('#b_tag_promote')
css_hide('#b_teleplay')
css_hide('#b_music')
css_hide('#b_kichiku')
css_hide('#b_technology')
css_hide('#b_ent')
css_hide('#b_movie')
css_hide('#b_fashion')
css_hide('#b_dance')
css_hide('#b_recommend')
css_hide('#b_ad')
css_hide('#b_life')

//屏蔽底端无意义的许可证
css_hide('.footer')

//不要忘记每个分区标题内的推广内容
css_hide('.pmt-list.pmt-inline')

// /*
//  * 视频播放页面屏蔽
//  */
//去掉这些卵用没有的视频页面里的射交/推广玩意
css_hide('.elec-charging')
css_hide('.v_small')
css_hide('.recommend-area')

//阉割的好看不?不会自己去喵种子啊?
css_hide('.bangumi-buybuybuy')
css_hide('#bpoints_win')

//评论就是撕逼,怎么就是不明白
css_hide('.common')

//硬币那些统计有卵意义?
css_hide('.v-title-info')

//分享你不会用URL?
css_hide('.arc-toolbar')
