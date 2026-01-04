// ==UserScript==
// @name        SteamCleanerStore
// @name:zh-CN  Steam更简洁的主页
// @description Hides specified blocks on steam store
// @description:zh-cn 隐藏Steam商店页面的各种模块
// @namespace   https://greasyfork.org/users/255836-icue
// @version     1.9
// @match       *://store.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/397689/SteamCleanerStore.user.js
// @updateURL https://update.greasyfork.org/scripts/397689/SteamCleanerStore.meta.js
// ==/UserScript==

var hidden_classes = [
    // 如需显示该模块，将该行注释
    'home_page_gutter', //首页的侧边栏
    // 'special_offers',   //首页的特别优惠
    // 'big_buttons',  //首页的“浏览Steam”相关四个大按钮
    // 'recently_updated_block',   //首页的最近更新
    'steam_curators_ctn', 'apps_recommended_by_curators_ctn',   //首页的鉴赏家
    'steam_curators_block', //游戏页内的鉴赏家点评
    'recommended_creators_ctn', //首页的“来自您了解的开发商发行商”
    'community_recommendations_by_steam_labs_ctn', //首页的社区推荐
    'discovery_queue_ctn',  //首页的探索队列
    'home_cluster_ctn', //首页顶部的精选和推荐
    'live_streams_ctn', //首页的直播
    'friends_recently_purchased',   //首页的好友中热门
    'specials_under10', //首页的低于￥40
    'marketingmessage_area', 'marketingmessage_container',   //首页底部的更新与优惠
    'top_new_releases'
];
var hidden_ids = [
    'content_callout',  //首页底部的“继续向下滚动”
    'content_more', 'content_loading', //首页“继续向下滚动”下方的推荐内容
    'footer'    //首页的页脚
];

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.hide { display: none !important; }';
document.getElementsByTagName('head')[0].appendChild(style);

hidden_classes.forEach(function (name) {
    let elements = document.getElementsByClassName(name);
    if (elements != null) {
        [].forEach.call(elements, function (el) {
            el.className = 'hide';
        });
    }
});
hidden_ids.forEach(function (name) {
    let element = document.getElementById(name);
    if (element != null) {
        element.className = 'hide';
    }
});