// ==UserScript==
// @name 在B站(Bilibili)网页上手动标记已看过的视频
// @version 3.2.9
// @description 在B站的网页上手动标记哪些视频是已经看过的，直观区分已看和未看的视频，减少多次打开同一视频的操作。暂时只维护首页、视频观看、历史、稍后再看、up空间、搜索结果，其他页面暂不维护（B站更新迭代不适配）。
// @author Truazusa
// @namespace BiliSearchViewed
// @match https://search.bilibili.com/*
// @match https://space.bilibili.com/*
// @match https://t.bilibili.com/*
// @match https://www.bilibili.com/*
// 20220607注：域名static.hdslb.com是B站本身的网站
// @require https://static.hdslb.com/js/jquery.min.js
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/374894/%E5%9C%A8B%E7%AB%99%28Bilibili%29%E7%BD%91%E9%A1%B5%E4%B8%8A%E6%89%8B%E5%8A%A8%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%9C%8B%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/374894/%E5%9C%A8B%E7%AB%99%28Bilibili%29%E7%BD%91%E9%A1%B5%E4%B8%8A%E6%89%8B%E5%8A%A8%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%9C%8B%E8%BF%87%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


// 透明度设置修改下面三个变量：数值越小越透明，1不透明、0完全透明
// ***********************************************************
// 全局：视频封面（已看）：透明度 设定（0.0-1.0）
var opacityIsViewCover = 0.1; // 【idue】0.65
// 全局：未看按钮：透明度 设定（0.0-1.0）
var opacitybtnView = 0.7; // 【idue】0.8
// 全局：已看按钮：透明度 设定（0.0-1.0）
var opacitybtnIsView = 0.3; // 【idue】0.8
// ***********************************************************

var GM_addStyle = GM_addStyle || function(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  document.getElementsByTagName("head")[0].appendChild(style);
};

// 增加自定义样式
let staticStyle = `
.btnView{opacity:`+opacitybtnView+`;background:#fff;color:#999!important;width:fit-content;line-height:16px;font-size:12px;text-align:center;cursor:pointer;display:inline-block;position:absolute;left:0;top:0;z-index:2;border:1px solid #999;border-radius:3px;padding:3px 5px;}
.btnIsView{opacity:`+opacitybtnIsView+`;background:#fff8;}/*【idue】background:#FF9EB5;color:#aaa;*/
.btnView:hover{opacity:1;background:#aaa;color:#fff!important;}
.btnIsView:hover{background:#fff;opacity:1;color:#999!important;}/*【idue】background:#FF7BA9;*/
.btnSetAllViewed,.btnRefresh{display:inline-block;background:#fff;font-size:14px;border:1px solid #999;border-radius:5px;color:#999;padding:3px 5px;cursor:pointer;word-break:keep-all;}
.btnSetAllViewed:hover,.btnRefresh:hover{background:#aaa;color:#fff;}`;

var searchStyle = `
/*搜索结果页*/
/*自定义的数据操作按钮：默认样式*/
.btnList{display:inline-block;background:#fff;border:1px solid #999;border-radius:5px;color:#999;padding:3px 5px;cursor:pointer;}
.btnList:hover{background:#aaa;color:#fff;}
.btnListSave{display:inline-block;display:none;background:#fff;border:1px solid #999;border-radius:5px;color:#999;padding:3px 5px;cursor:pointer;}
.btnListSave:hover{background:#aaa;color:#fff;}
.viewList{width:100%;height:120px;margin:10px 0;display:none;color:#999;padding:3px 5px;}
/*202501版本：按钮位置微调*/
.btnList{position:absolute;top:11px;right:0;}
.btnListSave{position:absolute;top:11px;right:83px;}
/*202504版本：按钮位置微调*/
.search-input .search-input-container .search-input-wrap{margin:0 10px 0 0;}
/*202501版本：番剧搜索结果*/
.media-card-content-footer-btns{height:45px!important;}
.p_relativeSpan{position:relative;padding:0 0 22px;display:inline-block;}
.p_relativeSpan .btnView{left:-1px;top:unset;bottom:0;position:absolute;border:none;}
.media-footerClone{position:absolute;}
.media-footerClone a{margin-right:8px;}
.media-footerClone .media-footer-badge{top:-14px;}
.bangumi-pgc-list .media-item{overflow-y:auto;}
.media-card>.btnView{left:8px;}
.media-card-image-follow[data-v-402c7b9e]{top:22px;}
/*202501版本：综艺搜索结果*/
.selConSpan{position:relative;}
.selConSpan .btnView{top:8px;left:4px;}
.media-footer-select-content-item{padding:0 6px 0 48px!important;}
`;

const spaceStyle = `
/*别人的空间页：space.bili*/
.btnRefresh{margin:0 0 0 16px;line-height:20px;}
.n-inner .btnRefresh{top:5px;position:relative;}
/*202503选旧版：【主页】TA的视频、合集·XXXX*/
.small-item .cover{background:none!important;}
.small-item .btnView{top:10px;left:10px;}
/*202503选旧版：【主页】TA的视频*/
#page-index .video .small-item:nth-child(4n+1) .btnView{left:0;}
/*202503选旧版：【主页】合集·XXXX*/
.channel-video .small-item:nth-child(4n+1) .btnView{left:0;}
/*202503选新版or选旧版：【动态】*/
.bili-dyn-content__orig__major{position:relative;}
/*202503选旧版：【投稿】list模式*/
#submit-video-list .list-list .btnView{top:20px;left:0;}
/*202503选旧版：【合集和列表】list模式*/
.series-item .btnView{top:10px;left:10px;}
/*202503选旧版：【合集和列表】某个合集点“更多”*/
.channel-detail .btnView{top:20px;}
/*202503选旧版：【收藏】*/
.fav-video-list .btnView{top:0;left:0;z-index:9;}
`;

const historyStyle = `
/*历史页*/
/*202501版本*/
.btnView{left:unset;right:0;}
.btnSetAllViewed,.btnRefresh{line-height:22px;margin-right:16px;}
`;

var videoStyle = `
/*视频观看页*/
/*202501版本：主视频-信息栏*/
.video-info-detail-list .pubdate-ip .btnView{position:unset;margin:0 0 0 10px;border:none;width:35px;}
/*202501版本：播放结束后出现的推荐视频*/
.bpx-player-ending-related-itemDiv{position:relative;float:left}
.bpx-player-ending-related-itemDiv .btnView{opacity:0.9;}
.bpx-player-ending-related-itemDiv .btnIsView{opacity:0.7;}
/*202501版本：主视频下方工具栏（“刷新”按钮设置）*/
.video-toolbar-right .btnRefresh{line-height:22px;}
/*202501版本：订阅合集or视频选集（分P视频列表）；带封面or纯标题*/
.normal-base-item .cover,.simple-base-item{position:relative;}
.simple-base-item .btnView{top:4px;left:4px;}
.simple-base-item.normal,.simple-base-item.head{padding:0 10px 0 48px;}
.page-list .page-item{padding:0 10px 0 65px;}
.page-list .page-item .btnView{left:20px;}
/*202501版本：视频选集（分P视频列表）grid模式：数字标题*/
.rcmd-tab .video-pod .video-pod__body .video-pod__list.multip.grid>.page{padding-bottom:25px;height:50px;}
.page{position:relative;}
.page .btnView{position:absolute;bottom:0;top:unset;left:6px;width:32px;}
`;


var festivalVideoStyle = `
/*202303活动视频播放页*/
.video-section-title{z-index:3!important;}
.video-episode-card__cover .btnView{line-height:12px;width:25px;} /*跟视频页重复的*/
.recommend-video-card{position:relative;}
.recommend-video-card .btnView{right:unset;top:6px;line-height:12px;width:25px;}
.video-toolbar-content_right .btnRefresh{position:relative;top:0;right:15px;line-height:21px;border-radius:2px;}
.video-toolbar-content_left .btnView{position:relative;line-height:16px;height:16px;top:9px;}`;

var watchlaterStyle = `
/*稍后再看-列表页*/
/*202501版本*/
.btnView{left:unset;right:0;z-index:201;}
.btnSetAllViewed,.btnRefresh{font-size:14px;line-height:22px;}
`;

var listPlayStyle = `
/*稍后再看-视频观看页*/
.tip-info .btnRefresh{font-size:12px;position:absolute;right:0;}
.player-auxiliary-playlist-item{position:relative;}
.player-auxiliary-playlist-item .btnView{position:absolute;top:6px;left:65px;}
.player-auxiliary-playlist-item:first-child .btnView{top:0;}
/*稍后再看-视频观看页at202303*/
.main .btnView{left:0;width:25px;line-height:12px;}
.multip-list-item .left-part{position:relative;padding:0 0 0 40px;}
.multip-list .multip-list-item-active[data-v-079b367a]{padding:0 10px;}
.multip-list-item .btnView{left:0;width:25px;line-height:12px;}
.video-info-detail-list .btnView{position:unset;margin:0;border:none;width:35px;}
.video-toolbar-right .btnRefresh{right:0;top:0;position:relative;}
/*202501版本*/
.video-info-detail-list .pubdate-ip .btnView{position:unset;margin:0 0 0 10px;border:none;width:35px;}
`;

var popularStyle = `
/*综合热门、每周必看、入站必刷*/
.popular-video-container .btnView{width:40px}
.weekly-list .weekly-header .panel{z-index:2;}
/*排行榜*/
.popular-container .rank-container .rank-list .rank-item .btnView{font-size:14px;width:45px;height:24px;}
/*全站音乐榜*/
._card_1kuml_6 .btnView{top:unset;left:12px;bottom:72px;border:1px solid #999;font-size:12px;}
/*短剧榜*/
.drama-board-listClone{justify-content:space-between;flex-wrap:wrap;display:flex;height:0;}
.board-item-wrapDiv{margin-bottom:30px;position:relative;float:left;}
.board-item-wrapDiv .btnView{right:unset;top:16px;left:182px;}`;

var indexStyle = `
/*主站首页*/
/*202501版本*/
`;

var channelStyle = `
/*频道*/
.card-list .btnView{left:unset;top:0;right:0;width:40px;}`;

var bangumiStyle = `
/*bangumi视频观看页*/
.toolbar_toolbar__NJCNy .btnRefresh{right:0;cursor:pointer;}
/*202403版本*/
.toolbar .btnRefresh{right:0;top:14px;cursor:pointer;}

/*主视频*/
.toolbar_toolbar__NJCNy .btnView{right:unset;width:36px;top:20px;border:none;}
/*202403版本*/
.toolbar .btnView{right:60px;width:36px;top:19px;border:none;}

/*右侧上 正片列表 list模式*/
.longListItem_wrap__9OsZi .btnView{right:unset;position:relative;width:36px;margin:0 7px 0 0;}
/*右侧上 正片列表 cube模式*/
.numberListItem_number_list_item__wszA4 a{height:18px;}
.numberListItem_number_list_item__wszA4 .btnView{width:32px;padding:0;border-radius:1px;right:unset;left:0;border:none;}
/*右侧中 PV&其他*/
.epitem_ep_item__CPdZy .btnView{width:36px;height:24px;position:relative;float:left;margin:3px 5px 0 0;text-align:center;color:#aaa;}
.epitem_ep_item__CPdZy .btnView:hover{color:#fff;background:#aaa;}
/*右侧下 系列*/
.seasonlist_ss_info__Yc7YV{width:130px;}
.seasonlist_ss_item__czhHy .btnView{height:24px;width:40px;position:relative;right:280px;}
/*右侧下 相关推荐*/
.RecommendItem_wrap__pJmXL{position:relative;}
.RecommendItem_wrap__pJmXL .btnView{height:22px;width:40px;position:absolute;right:unset;}
.RecommendItem_wrap__pJmXL .RecommendItem_cover__Rc3y2{background:none;}`;

var cheeseStyle = `
/*课堂分区首页*/
.block-list-item{position:relative;}
.rank dd{position:relative;}
.rank dd .btnView{right:unset;left:28px;line-height:12px;width:25px;}
.common-lazy-img{background:none;}
/*课程分类查找页*/
.big-card .btnView{right:unset;left:0;}`;

var cheesePlayStyle =`
/*课程视频观看页*/
.section-item .btnView{line-height:12px;width:25px;left:2px;bottom:7px;top:unset;border:none;}
.layout-r .btnRefresh{position:relative;top:0;right:0;cursor:pointer;line-height:24px;margin:0 0 0 10px;}
.layout-l .btnView{position:relative;border:none;}
/*右侧下 相关推荐*/
.season-recommend-card{position:relative;}
.season-recommend-card .btnView{right:unset;line-height:12px;width:25px;}`

var areaStyle = `
/*各分区首页or首页右侧的排行榜*/
.bili-rank-list-video__item--wrap{position:relative;}
.bili-rank-list-video__item--wrap .btnView{right:-8px;color:#aaa;border:1px solid #aaa;}
.bili-rank-list-cheese__item--wrap .btnView{color:#aaa;border:1px solid #aaa;}
.bili-rank-list-ogv__item--wrap .btnView{color:#aaa;border:1px solid #aaa;}`;

var varietyStyle = `
/*综艺分区首页*/
.side-item{position:relative;}
.side-item .btnView{width:25px;line-height:12px;}
.hot-item{position:relative;}
.column-itemDiv{-webkit-box-flex:1;flex:1;margin:0 16px 0 0;border-radius:8px;overflow:hidden;position:relative;}
.column-itemDiv .btnView{right:unset;left:0;}
.hover-item .btnView{right:unset;z-index:3;}
.web_rank_v2 .hover-item .btnView{right:0;}
/*综艺索引*/
.bangumi-item{position:relative;}
.bangumi-item .btnView{right:unset;left:0;}`;

var guochangStyle = `
/*国创*/
.progress-bar-content .btnView{top:4px;right:4px;border-radius:7px;}
.timeline-weekday-hover-item .btnView{z-index:10;right:unset;}
.ranking-ratio-item-container .btnView{z-index:10;right:unset;}
/*国创：二级分区*/
.spread-module .lazy-img{background:none;}
.spread-module .btnView{width:25px;line-height:12px;}
.sec-rank .rank-item .btnView{width:25px;line-height:12px;right:unset;}
.rank-list .rank-item.show-detail .ri-detail{padding:0 0 0 40px;}
.rank-list .rank-item.show-detail.highlight .ri-detail{padding:0;}
.rank-list .rank-item.show-detail a:hover .ri-detail{padding:0;}
/*国创：索引*/
.bangumi-item{position:relative;}
.bangumi-item .btnView{right:unset;}
.bangumi-item .common-lazy-img{background:none;}
.rank-item .lazy-img{background:none;}`; 

let setMethod = null;
let timer = null;
let viewVideoList = null;
const btnRefresh = $("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新</a>");
let btnSetAllViewed = null;
// 增加全局样式设置
GM_addStyle(staticStyle);
// 页面加载后分类处理
$(document).ready(function(){
  var oldList = GM_getValue("BiliViewed",null);
  if(oldList != null){
    // 对原已看数据列表进行分组
    groupGMVideoList(oldList);
  }
  // 获取页面高度：用于滚动条监听
  pageHeight = $(window).height() * 0.66;
  var domain = location.href;
  var askIndex = domain.indexOf("?");
  if(askIndex > -1){
    domain = domain.substring(0,askIndex);
  }
  domain = domain.toLowerCase();
  if(domain.indexOf("search.") > -1){
    // 搜索页
    GM_addStyle(searchStyle);
    setMethod = setSearchPage;
    // 202509新增：滚动条下拉响应
    setPageScrollMethod();
  }else if(domain.indexOf("space.") > -1){
    // up主页空间
    GM_addStyle(spaceStyle);
    setMethod = setSpacePage;
  }else if(domain.indexOf("t.") > -1){
    // 登录后的动态
    GM_addStyle(spaceStyle);
    setMethod = setSpacePage;
    // 滚动条下拉响应
    setPageScrollMethod();
    // up主头像点击响应
    if($(".bili-dyn-up-list__item").length == 0){
      // 头像未加载出来，等2秒后重新绑定
      setTimeout(function(){
        $(".bili-dyn-up-list__item").unbind("click").click(function(){
          prePageScrollTop = 0;
          setTimeout(setPageRefreshMethod,2000);
        })
      },2000);
    }
  }else if(domain.indexOf("www.") > -1){
    // 主站
    var href = location.href;
    href = href.toLowerCase();
    if(href.indexOf("/bangumi/play/") > -1){
      // 节目-视频观看页
      GM_addStyle(bangumiStyle);
      setMethod = setBangumiPage;
    }else if(href.indexOf("/cheese/play/") > -1){
      // 课程-视频观看页 
      GM_addStyle(cheesePlayStyle);
      setMethod = setCheesePlayPage;
    }else if(href.indexOf("/cheese/") > -1){
      // 课程-分区首页
      GM_addStyle(cheeseStyle);
      setMethod = setCheesePage;
    }else if(href.indexOf("/guochuang") > -1 || href.indexOf("/anime") > -1){
      // 番剧、国创-分区
      GM_addStyle(guochangStyle);
      setMethod = setGuochuangPage;
      // 滚动条下拉监听
      setPageScrollMethod();
    }else if(href.indexOf("/v/musicplus") > -1){
      // 新歌热榜-分区
      GM_addStyle(indexStyle);
      setMethod = setMusicplusPage;
    }else if(href.indexOf("/play/watchlater") > -1){
      // 稍后再看-视频观看页 (202303注：貌似已经自动跳转到/list/watchlater了）
      return;
    }else if(href.indexOf("/list/") > -1){
      // 列表-视频观看页 (202303增加）
      // 稍后再看-播放全部 按钮点击进入 /list/watchlater
      // 个人收藏-播放全部 按钮点击进入 /list/mlxxxxx
      GM_addStyle(listPlayStyle);
      setMethod = setListPlayPage;
      // 右侧 稍后再看 滚动条下拉监听（局部）
      $("#playlist-video-action-list").scroll(function(){
        var curScrollTop = $("#playlist-video-action-list").scrollTop();
        if(Math.abs(curScrollTop - preScrollTop) > 300){
          preScrollTop = curScrollTop;
          setTimeout(function(){setMethod();},1000)
        }
      })
      // 右侧下 推荐视频 滚动条下拉监听
      setPageScrollMethod();
      // 右侧下 推荐视频 展开按钮点击响应
      $(".rec-footer").click(function(){
        setTimeout(function(){setMethod();},1000)
      });
    }else if(href.indexOf("/watchlater") > -1){
      // 稍后再看(列表页) ：顶部收藏-稍后再看-查看全部
      GM_addStyle(watchlaterStyle);
      // 设置一键已看相关功能
      setAllViewedMethod();
      // 设置页面
      setMethod = setWatchlaterPage;
      // 滚动条下拉监听
      setPageScrollMethod();
    }else if(href.indexOf("/video/") > -1){
      // 视频观看页
      GM_addStyle(videoStyle);
      setMethod = setVideoPage;
      // 右侧下 推荐视频 滚动条下拉监听
      setPageScrollMethod();
    }else if(href.indexOf("/festival/") > -1){
      // 活动视频观看页
      GM_addStyle(festivalVideoStyle);
      setMethod = setFestivalVideoPage;
      // 右侧下 推荐视频 滚动条下拉监听
      setPageScrollMethod();
    }else if(href.indexOf("/popular/") > -1){
      // 2023新增：综合热门、每周必看、入站必刷、排行榜、全站音乐榜
      GM_addStyle(popularStyle);
      setMethod = setPopularPage;
      // tab点击监听
      $(".nav-tabs__item").click(function(e){
        setTimeout(function(){setMethod();},3000)
      })
      // 滚动条下拉监听（主要用于：综合热门）
      setPageScrollMethod();
    }else if(href.indexOf("/history") > -1 ){
      // 历史页
      GM_addStyle(historyStyle);
      // 设置一键已看相关功能
      setAllViewedMethod();
      // 设置页面
      setMethod = setHistoryPage;
      // 滚动条下拉监听
      setPageScrollMethod();
      // 设置一键已看
    }else if(href.indexOf("/v/channel/") > -1 ){
      // 频道页
      GM_addStyle(channelStyle);
      setMethod = setChannelPage;
      setTimeout(function(e){
        // 左侧 发现频道 按钮点击响应
        $(".discovery-panel__title").click(function(e){
          setTimeout(setMethod,2000);
        })
        // 左侧 分类 点击响应
        $(".content-item").click(function(e){
          setTimeout(setMethod,4000);
        })
        // 左侧 我的订阅 Item点击响应
        $(".subscribe-item").click(function(e){
          setTimeout(setMethod,4000);
        })
      },2000);
    }else if(href.indexOf("/variety/") > -1 || href.indexOf("/movie/") > -1 || href.indexOf("/tv/") > -1 || href.indexOf("/documentary/") > -1){
      // 2023新增：分区：综艺、电影、电视剧、纪录片
      GM_addStyle(varietyStyle);
      setMethod = setVarietyPage;
      // 滚动条下拉监听
      setPageScrollMethod();
    }else if(href.endsWith(".com/") || href.indexOf(".com/?") > -1 || href.indexOf(".com/index.html") > -1){
      // 主站首页
      GM_addStyle(indexStyle);
      setMethod = setIndexPage;
      // 滚动条下拉监听
      setPageScrollMethod();
      setTimeout(function(){
        // 202501版本：（左上）白色“换一换”按钮 点击响应
        $(".feed-roll-btn").click(function(e){
          setTimeout(setMethod,2000);
        })
        // 202501版本：（左下）蓝色“刷新内容”按钮 点击响应
        $(".flexible-roll-btn").unbind("click").click(function(){
          setTimeout(setMethod,2000);
        })
      },2000);
    }else{
      // 主站其他页面，如分区主页：鬼畜、舞蹈、娱乐、科技、美食、游戏、音乐、影视、知识、资讯、更多
      GM_addStyle(areaStyle);
      setMethod = setAreaPage;
      // 滚动条下拉监听
      setPageScrollMethod();
      // 子分区按钮点击响应
      $(".channel-nav-sub-item").click(function(e){
        setTimeout(function(){setMethod();},1000)
      })
    }
  }
  // 刷新按钮 点击响应
  btnRefresh.click(function(){
    setPageRefreshMethod();
  })
  // 检查执行结果（每3秒执行检查一次，最多执行5次）
  if(setMethod != null){
    timer = setInterval(checkBtnViewLoad,3000);
  }
});

// 局部模块滚动条响应
var preScrollTop = 0;// 上一次局部模块滚动条到达的高度
// 设置页面滚动条响应
var pageHeight = 600; // 设置页面高度的三分二自动刷新一次
var curPageScrollTop = 0; // 当前页面滚动条的高度
var prePageScrollTop = 0; // 上一次页面滚动条到达的高度
var setPageScrollMethod = function(){
  $(window).scroll(function(){
    var curPageScrollTop = $(document).scrollTop();
    if(Math.abs(curPageScrollTop - prePageScrollTop) > pageHeight){
      prePageScrollTop = curPageScrollTop;
      setTimeout(setMethod,1000);
    }
  })
}

// 设置刷新功能
var setPageRefreshMethod = function(){
  $(".btnView").remove();
  viewVideoJson = {};
  setMethod();
  setTimeout(function(e){
    setMethod();
  },3000);
}

// 设置一键已看相关功能
const setAllViewedMethod = function(){
  btnSetAllViewed = $("<a class='btnSetAllViewed' title='一键设置未看视频为已看。只针对当前页面已加载出来的视频（带未看按钮的）。可以拉到页面底部加载出更多的视频再点这个。执行该操作后不可进行撤销，可根据个人情况进行使用。'>一键已看</a>")
  // 一键已看 点击响应
  btnSetAllViewed.click(function(){
    if(!confirm($(this).attr("title"))){
        return;
    }
    $(".btnNotView").each(function(idx){
        saveGMVideoList($(this).data("av"),true);
    });
    setPageRefreshMethod();
  })
}

// 202303新增：课程视频播放页
var setCheesePlayPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    $(".layout-r").append("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新↗</a>");
    $(".btnRefresh").click(function(){
      setPageRefreshMethod();
    })
  }
  var indexJson = document.getElementById("app")._vnode.appContext.config.globalProperties.$pinia.state._rawValue.index;
  if(indexJson == null){
    return;
  }
  // 主视频
  setVideoIsViewed($(".archive-tool-box"),".layout-l",0,"ep"+indexJson.currentEp.id,true);
  // 右侧上 课程目录Item
  var epoArr = indexJson.epList;
  $(".section-item").each(function(idx){
    setVideoIsViewed($(this),".season-info",0,"ep"+epoArr[idx].id,true,true);
  })
  // 右侧下 相关推荐Item
  var rEpoArr = indexJson.viewInfo.recommend_seasons;
  $(".season-recommend-card").each(function(idx){
    setVideoIsViewed($(this),coverItemClass,0,"ss"+rEpoArr[idx].id);
  })
  // 点击视频自动刷新
  $(".section-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,5000);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：课堂 分区首页
var setCheesePage = function(){
  // 普通Item
  $(".block-list-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 排行榜Item
  $(".rank dd").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 分类查找Item：大卡模式
  $(".big-card").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 分类查找Item：小卡模式
  $(".small-card").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 各筛选按钮点击
  $(".radio-button-box .item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 大小卡点击响应
  $(".mode-trigger span").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 分页按钮点击响应
  $(".page-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 分页跳转到、搜索框回车响应
  // 回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,2000);
    }
  });
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：国创 分区
var setGuochuangPage = function(){
  // 滚动推荐Item
  $(".progress-bar-content").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 横向封面Item
  $(".horizontal-ratio-item-inner").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 新番时间表Item
  $(".timeline-weekday-hover-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 国创热播榜单Item
  $(".ranking-ratio-item-container").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 新热推荐Item
  $(".item-wrap").each(function(idx){
    var epid = $(this).children("a")[0].__vue__.$parent.item.episode_id;
    setVideoIsViewed($(this),coverItemClass,0,"ep"+epid,false,false);
  });
  // 二级分区：最新动态Item、普通Item
  $(".spread-module").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 二级分区：热门Item
  $(".rank-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // tab点击响应
  $(".tabs-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 最近更新、周一、周二...周日 按钮点击响应
  $(".week-day-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 下一页按钮点击响应
  $(".next-page").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 上一页按钮点击响应
  $(".prev-page").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 索引查找Item
  $(".bangumi-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 索引查找 排序方式按钮点击响应
  $(".sort-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 索引查找 筛选按钮点击响应
  $(".filter-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 二级分区：热门标签 按钮点击响应
  $(".tag-item").unbind("click").click(function(e){
    setTimeout(setMethod,1000);
  })
  // 二级分区：换一换 按钮点击响应
  $(".read-push").unbind("click").click(function(e){
    setTimeout(setMethod,1000);
  })
  // 二级分区：投稿时间排序、视频热度排序、全部、原创、查看模式 点击响应
  $(".tab-list li").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 二级分区：播放数 下拉菜单 点击响应
  $(".dropdown-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 二级分区：分页按钮点击响应
  $(".page-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 索引查找、二级分区：分页跳转到 回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,1000);
    }
  });
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：新歌热榜 分区
var setMusicplusPage = function(){
  // 头部1+6个Item
  $(".video-card-reco").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 热门推荐Item
  $(".card-pic").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // tabs 按钮点击响应
  $(".tabs a").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 更多 按钮点击响应
  $(".more").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 筛选 各按钮点击响应
  $(".type-group li").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 搜索结果页 上面的 音乐首页 点击响应
  $(".main-menu a").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 分页按钮点击响应
  $(".pager a").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,1000);
  })
  // 搜索框回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,1000);
    }
  });
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：番剧视频播放页
var setBangumiPage = function(){
  // 主视频
  var linkArr = $("link");
  var linkRel = "";
  var linkHref = "";
  for(var i = 0 ; i < linkArr.length ;i++){
    linkRel = $(linkArr[i]).attr("rel");
    if(linkRel != "canonical"){
      continue;
    }
    linkHref = $(linkArr[i]).attr("href");
    if($(".toolbar").length > 0){
      // 202403版本
      setVideoIsViewed($(".player-left-components"),".toolbar",2,linkHref,true);
    }else{
      setVideoIsViewed($(".player-left-components"),".toolbar_toolbar__NJCNy",2,linkHref,true);
    }
    break;
  }
  // 刷新按钮
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    if($(".toolbar").length > 0){
      // 202403版本
      $(".toolbar").append("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新→</a>");
    }else{
      $(".toolbar_toolbar__NJCNy").append("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新→</a>");
    }
    
    $(".btnRefresh").click(function(){
      setPageRefreshMethod();
    })
  }
  if($(".toolbar").length > 0){
    // 202403版本
    // 下次更新。。
  }else{
    // 右侧上 正片（list模式）Item
    $(".longListItem_wrap__9OsZi").each(function(){
      var pArr = Object.getOwnPropertyNames(this);
      if(pArr.length == 0){
        return;
      }
      var epId = eval("this."+pArr[0]+".return.key");
      setVideoIsViewed($(this),".longListItem_title__Xziqq",0,"ep"+epId,true,true);
      // 点击响应
      $(this).children("a:eq(1)").unbind("click").click(function(e){
        setTimeout(setPageRefreshMethod,2000);
      })
    })
    // 右侧上 正片（cube模式）Item
    $(".numberListItem_number_list_item__wszA4").each(function(){
      setVideoIsViewed($(this),"a",0,null,true,true);
      // 点击响应
      $(this).children("a:eq(1)").unbind("click").click(function(e){
        setTimeout(setPageRefreshMethod,2000);
      })
    })
    // 右侧上 正片查看模式切换点击响应
    $(".modeChangeBtn_wrap__NOGS3").unbind("click").click(function(e){
      setTimeout(setPageRefreshMethod,1000);
    })
    // 右侧中 系列Item
    $(".seasonlist_ss_item__czhHy").each(function(){
      setVideoIsViewed($(this),coverItemClass);
    })
    // 展开 按钮点击响应
    $(".seasonlist_expand_more__VcTha").unbind("click").click(function(e){
      setTimeout(setPageRefreshMethod,2000);
    })
    // 右侧中 PV&其他Item
    $(".epitem_ep_item__CPdZy").each(function(){
      setVideoIsViewed($(this),"a",0,null,true,true);
      // 点击响应
      $(this).children("a:eq(1)").unbind("click").click(function(e){
        setTimeout(setPageRefreshMethod,2000);
      })
    })
    // 右侧下 相关推荐Item
    $(".RecommendItem_wrap__pJmXL").each(function(){
      setVideoIsViewed($(this),coverItemClass);
      // 点击响应
      $(this).children("a:first").unbind("click").click(function(e){
        setTimeout(setPageRefreshMethod,3000);
      })
      // 视频播放结束后没有出现推荐视频
    })
  }
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：频道页
var setChannelPage = function(){
  // 普通Item
  $(".video-card__content").each(function(){
    setVideoIsViewed($(this),coverItemClass,0,null,false,false,false,true); // 注意排行1、2、3数字的图片
  });
  // 右侧“进入频道”按钮点击响应
  $(".go-channel-btn").unbind("click").click(function(e){
    setTimeout(setMethod,2000);
  })
  // 滚动条下拉监听（右侧局部）
  $("#container").unbind("scroll").scroll(function(){
    var curScrollTop = $("#container").scrollTop();
    if(Math.abs(curScrollTop - preScrollTop) > pageHeight){
      preScrollTop = curScrollTop;
      setTimeout(setMethod,2000);
    }
  })
  // 精选、综合 按钮点击响应
  $(".van-tabs-tab").unbind("click").click(function(e){
    setTimeout(setMethod,2000);
  })
  // 年份 按钮点击响应
  $(".year-selector__item").unbind("click").click(function(e){
    setTimeout(setMethod,2000);
  })
  // 近期热门、播放最多、最新投稿 按钮点击响应
  $(".play-selector__item").unbind("click").click(function(e){
    setTimeout(setMethod,2000);
  })
  // 相关tag 点击响应
  $(".relative-tags div a").unbind("click").click(function(e){
    setTimeout(setMethod,2000);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：分区：综艺、电影、电视剧、纪录片
var setVarietyPage = function(){
  // 头部滚动
  $(".side-item").each(function(){
    setVideoIsViewed($(this),".title",0,null,false,false);
  });
  // 综艺Item：封面是横的
  $(".hot-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 综艺Item：封面是竖的
  $(".hover-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 综艺Item：封面是方的（打一层包装）
  var itemDivArr = $(".column-itemDiv");
  if(itemDivArr.length == 0){
    var itemArr = $(".column-item");
    for(var i = 0 ; i < itemArr.length ;i++){
      var divObj = $("<div class='column-itemDiv'></div>");
      divObj.append(itemArr[i]);
      $(".module-column").append(divObj);
    }
  }
  // 综艺Item：封面是方的（.column-item → .column-itemDiv）
  $(".column-itemDiv").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 索引查找Item
  $(".bangumi-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 索引查找 排序方式按钮点击响应
  $(".sort-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 索引查找 筛选按钮点击响应
  $(".filter-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：分区：其他
var setAreaPage = function(){
  // 普通Item
  $(".bili-video-card__wrap").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 热门Item
  $(".bili-rank-list-video__item--wrap").each(function(){
    setVideoIsViewed($(this),".rank-video-card");
  });
  // 换一换按钮点击响应
  $(".roll-btn").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 换一换旁边的查看更多进入：
  // tag按钮点击响应
  $(".tags-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 排序下拉菜单按钮点击响应
  $(".channel-select-content-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 202303新增：设置热门页的视频
var setPopularPage = function(){
  // 综合热门Item
  $(".video-card__content").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 排行榜Item
  $(".img").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 全站音乐榜Item
  $("._card_1kuml_6").each(function(){
    setVideoIsViewed($(this),coverItemClass,0,null,false,false,true,true);
  });
  // 短剧榜Item（打一层包装）
  var itemListArr = $(".drama-board-listClone");
  if(itemListArr.length == 0){
    $(".drama-board-list").each(function(idx){
      var objOffset = $(this).offset();
      var cloneObj = $(this).clone();
      $(cloneObj).addClass("drama-board-listClone");
      $(cloneObj).addClass("drama-board-listClone_"+idx);
      $(cloneObj).removeClass("drama-board-list");
      $(this).parent().append(cloneObj);
      // 对克隆体里面的元素进行外层包装
      var itemArr = $(".drama-board-listClone_"+idx+" .board-item-wrap");
      for(var i = 0; i < itemArr.length;i++){
        var divObj = $("<div class='board-item-wrapDiv'></div>");
        divObj.append(itemArr[i]);
        $(".drama-board-listClone_"+idx).append(divObj);
      }
      // 对齐被克隆的对象
      $(cloneObj).offset(objOffset);
      $(this).attr("style","opacity:0;");
    })
  }
  $(".board-item-wrapDiv").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  })
  // 每周必看：切换第N期监听
  $(".panel .select-item").click(function(e){
    setTimeout(setPageRefreshMethod,5000);
  })
  // 排行榜：分类 点击监听
  $(".rank-tab li").click(function(e){
    $(".btnView").remove();
    setTimeout(setMethod,3000);
  })
  // 全站音乐版：切换第N期 点击响应
  // 修正原网页“看MV”按钮连接不正确的问题
  $(".periodShow").unbind("click").click(function(e){
    setTimeout(function(){
      $(".periodList .periodItem").unbind("click").click(function(e){
        $(".btnView").remove();
        setTimeout(setMethod,3000);
        
      })
    },500)
  })
  // 短剧榜：切换第N期 点击响应
  $(".dropdown-item").unbind("click").click(function(e){
    $(".drama-board-listClone").remove();
    $(".drama-board-list").removeAttr("style");
    setTimeout(setMethod,2000);
  })
  // 短剧榜：热榜榜单、编辑精选 点击响应
  $(".switch-tabs .tab").unbind("click").click(function(e){
    var tabIndex = $(this).index();
    var objOffset = $(".drama-board-list:eq("+tabIndex+")").offset();
    $(".drama-board-listClone_"+tabIndex).offset(objOffset);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 设置主站首页
var setIndexPage = function(){
  // 202501版本：推荐视频Item
  $(".bili-video-card").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 已看/未看按钮响应
  setBtnView();
  // 按钮点击响应设置在上层方法调用
}

// 设置视频观看页
var setVideoPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202501版本：在记笔记按钮右边的三点的右边 添加刷新按钮
    $(".video-toolbar-right").append(btnRefresh);
    btnRefresh.text("刷新↗");
  }
  var initState = unsafeWindow.__INITIAL_STATE__;
  if(!initState){
    return;
  }
  // 主视频bv：如果是分P则显示为分P已看状态
  var bvid = initState.bvid;
  var videos = initState.videoData.videos; // 总分P数
  if(videos > 1){
    bvid = bvid + "-"+initState.p;
  }
  // 202501版本：主视频已看/未看设置
  setVideoIsViewed($(".video-info-meta"),".pubdate-ip",0,bvid,true);
  // 下箭头悬浮框（如果有）
  setVideoIsViewed($(".overflow-panel"),".pubdate-ip",0,bvid,true);
  
  // 202501版本：右侧上 订阅合集Item
  $(".pod-item").each(function(){
      var targetObj = $(this).find(".cover:first");
      var bvNum = $(this).data("key");
      if(targetObj.length > 0){
        // 有视频封面
        setVideoIsViewed(targetObj,coverItemClass,0,bvNum);
      }else{
        // 没视频封面
        setVideoIsViewed($(this),".title",0,bvNum,true,true);
      }
      // 有分P列表
      var multiPObj = $(this).children(".multi-p");
      if(multiPObj.length > 0){
        multiPObj.children(".page-list").children(".page-item").each(function(idx){
          setVideoIsViewed($(this),".title",0,bvNum+"-"+(idx+1),true,true);
        });
      }
  })
  // 202501版本：右侧上 视频选集（分P视频）Item
  $(".multip .video-pod__item").each(function(idx){
      // 没视频封面
      setVideoIsViewed($(this),".title",0,initState.bvid+"-"+(idx+1),true,true);
  })
  // 202501版本：右侧上 视频选集（分P视频）grid模式Item
  $(".multip.grid .page").each(function(idx){
      // 没视频封面
      if($(this).children("span").length == 0){
        $(this).append("<span></span>");
      }
      setVideoIsViewed($(this),"span",0,initState.bvid+"-"+(idx+1),true,true);
  })
  // 202501版本：右侧下 后台推荐视频or通用推荐视频Item
  $(".card-box .pic").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  })
  var relatedArr = initState.related;
  if(relatedArr && relatedArr.length > 0){
    // 202501版本：视频窗口播放视频结束后出现的推荐视频Item
    $(".bpx-player-ending-related-itemDiv").each(function(idx){
      setVideoIsViewed($(this),".bpx-player-ending-related-item",0,relatedArr[idx].bvid,true,true); // 封面是div
      // 点击视频自动刷新
      $(".bpx-player-ending-related-item").unbind("click").click(function(e){
        setTimeout(setPageRefreshMethod,3000);
      })
    });
    // 202501版本：视频窗口播放视频结束后出现的推荐视频Item
    $(".bpx-player-video-wrap video").unbind("ended").bind("ended",function(e){
      setTimeout(function(){
        var itemDivArr = $(".bpx-player-ending-related-itemDiv");
        if(itemDivArr.length == 0){
          var itemArr = $(".bpx-player-ending-related-item");
          for(var i = 0 ; i < itemArr.length ;i++){
            var divObj = $("<div class='bpx-player-ending-related-itemDiv'></div>");
            divObj.append(itemArr[i]);
            $(".bpx-player-ending-related").append(divObj);
          }
        }
        $(".bpx-player-ending-related-itemDiv").each(function(idx){
          setVideoIsViewed($(this),".bpx-player-ending-related-item",0,relatedArr[idx].bvid,true,true); // 封面是div
          // 点击视频自动刷新
          $(".bpx-player-ending-related-item").unbind("click").click(function(e){
            setTimeout(setPageRefreshMethod,3000);
          })
        });
      },2000);
    })
  }
  // 已看/未看按钮响应
  setBtnView();
  // 202510版本：（右上）合集视频or视频选集（分P视频）Item 点击响应
  $(".video-pod__item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 202510版本：（右上）合集视频-分类（横向+下拉列表） Item 点击响应
  $(".slide-item").unbind("click").click(function(e){
    setTimeout(setPageRefreshMethod,3000);
  })
  // 202510版本：（右上）视频选集（分P视频） list、grid模式切换 点击响应
  $(".view-mode").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（右下）后台推荐视频or通用推荐视频 点击响应
  $(".card-box").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（右下）按钮点击响应
  $(".rec-footer").unbind("click").click(function(){
    setTimeout(setMethod,2000);
  })
}

// 设置活动视频观看页
var setFestivalVideoPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202303：在记笔记按钮右边的三点的右边 添加刷新按钮
    $(".video-toolbar-content_right").append("<a class='btnRefresh' title='如果列表没出现已看/未看标识，请手动点击这个按钮进行刷新'>刷新↗</a>");
    $(".btnRefresh").click(function(){
      setPageRefreshMethod();
    })
  }
  var initState = unsafeWindow.__INITIAL_STATE__;
  if(!initState){
    return;
  }
  // 主视频
  var videoInfo = initState.videoInfo;
  if(videoInfo){
    var bvid = initState.videoInfo.bvid;
    setVideoIsViewed($(".video-toolbar-content"),".video-toolbar-content_left",0,bvid,true);
  }
  
  // 202303：右侧上 合集Item
  var sectionArr = initState.videoSections;
  if(sectionArr && sectionArr.length > 0){
    var epoArr = sectionArr[0].episodes;
    for(var i = 1 ; i < sectionArr.length;i++){
      epoArr = epoArr.concat(sectionArr[i].episodes);
    }
    $(".video-episode-card").each(function(idx){
      var targetObj = $(this).find(".video-episode-card__cover:first");
      if(targetObj.length > 0){
        // 有视频封面
        setVideoIsViewed(targetObj,".activity-image-card__image",0,epoArr[idx].bvid);// 封面图片用div
      }else{
        // 没视频封面
        setVideoIsViewed($(this),".video-episode-card__info-title",0,epoArr[idx].bvid,true,true);
      }
    })
    // 点击视频自动刷新
    $(".video-episode-card").unbind("click").click(function(e){
      setTimeout(setPageRefreshMethod,3000);
    })
  }
  // 202303：右侧下 推荐视频Item
  var recommendArr = initState.recommendList.relate_video;
  if(recommendArr){
    $(".recommend-video-card").each(function(idx){
      setVideoIsViewed($(this),".activity-image-card__image",0,recommendArr[idx].bvid); // 封面图片用div
    });
    // 视频播放结束后没有出现推荐视频
  }
  // 已看/未看按钮响应
  setBtnView();
}

// 设置历史页
var setHistoryPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202504版本
    $(".breadcrumbs__top .right").prepend(btnRefresh);
    $(".breadcrumbs__top .right").prepend(btnSetAllViewed);
  }
  // 202501版本：视频Item
  $(".bili-video-card__cover").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 已看/未看按钮响应
  setBtnView();
  // 202501版本：搜索框 回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,2000);
    }
  });
  // 202501版本：导航按钮 点击响应（全部、视频、直播、专栏）
  $(".radio-filter__item").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（右上）切换grid/list按钮 点击响应
  $(".lists-view-mode").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：搜索图标按钮 点击响应
  $(".search-btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：退出管理按钮 点击响应
  $(".batch-manage-btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
}

// 稍后再看-视频观看页
var setListPlayPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202501版本：在记笔记按钮右边的三点的右边 添加刷新按钮
    $(".video-toolbar-right").append(btnRefresh);
    btnRefresh.text("刷新↗");
  }
  var initState = unsafeWindow.__INITIAL_STATE__;
  if(!initState){
    return;
  }
  // 主视频bv：如果是分P则显示为分P已看状态
  var bvid = initState.bvid;
  var videos = initState.videoData.videos; // 总分P数
  if(videos > 1){
    bvid = bvid + "-"+initState.p;
  }
  // 202504版本：主视频已看/未看设置
  setVideoIsViewed($(".video-info-meta"),".pubdate-ip",0,bvid,true);
  // 下箭头悬浮框（如果有）
  setVideoIsViewed($(".overflow-panel"),".pubdate-ip",0,bvid,true);
  
  // 右侧上 稍后再看列表Item
  var epoArr = initState.resourceList;
  let eachBvid = null; 
  let listClass = ".actionlist-item-inner" ; // 202507前用这个（不知其他人更新没有，暂保留，日后删）
  if($(listClass).length == 0){
    listClass = ".action-list-item-wrap"; // 202507开始用这个
  }
  $(listClass+" .main").each(function(idx){
    if(typeof epoArr[idx].bv_id == "undefined"){
      // 202503版本用bvid
      eachBvid = epoArr[idx].bvid;
    }else{
      // 202503前用bv_id（不知其他人更新到新版没有，暂保留，日后删）
      eachBvid = epoArr[idx].bv_id;
    }
    setVideoIsViewed($(this),coverItemClass,0,eachBvid);
    var multipObj = $(this).parent().children(".multip-list:first");
    if(multipObj.length > 0){
      // 有分P视频列表
      $(multipObj[0]).children(".multip-list-item").each(function(idx2){
        if(epoArr[idx].pages[idx2].p){
          // 202504版本分P用.p
          setVideoIsViewed($(this),".left-part",0,eachBvid+"-"+epoArr[idx].pages[idx2].p,true);
        }else{
          // 202504前的版本分P用.page（日后可删）
          setVideoIsViewed($(this),".left-part",0,eachBvid+"-"+epoArr[idx].pages[idx2].page,true);
        }
        // 视频点击响应
        $(this).unbind("click").click(function(){
          setTimeout(setPageRefreshMethod,2000);
        })
      })
    }
    // 视频点击响应
    $(this).unbind("click").click(function(){
      setTimeout(setPageRefreshMethod,2000);
    })
  })
  // 右侧下 推荐视频Item
  $(".pic-box").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 右侧 稍后再看 删除按钮点击响应
  $(".del-btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 已看/未看按钮响应
  setBtnView();
}

// 设置稍后再看页（列表页）
const setWatchlaterPage = function(){
  let refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202501版本
    $(".list-header-options").prepend(btnRefresh);
    $(".list-header-options").prepend(btnSetAllViewed);
  }
  // 202501版本：视频Item
  $(".bili-video-card__cover").each(function(){
    setVideoIsViewed($(this),coverItemClass,3);
  });
  // 已看/未看按钮响应
  setBtnView();
  // 202501版本：搜索框 回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,2000);
    }
  });
  // 202501版本：导航按钮 点击响应（全部进度、未看完）
  $(".list-header-filter__btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（右上）切换grid/list按钮 点击响应
  $(".watchlater-list-title-sort").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：搜索图标按钮 点击响应
  $(".search-btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：最近添加/最早添加按钮 点击响应
  $(".menu-popover__panel-item").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：退出管理按钮 点击响应
  $(".action-btn").unbind("click").click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
}

// 设置空间页：https://space.bilibili.com/xxxx
const setSpacePage = function(){
  let refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202503选新版
    $(".nav-bar__main-left").append(btnRefresh);
    // 202503选旧版
    $(".n-inner").append(btnRefresh);
  }
  // 202503选旧版：置顶视频Item
  $(".i-pin-part .i-pin-has-content").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  
  // 【首页】代表作（3个）、置顶视频（1个）、TA的视频、最近投币的视频、合集·XXXX、最近点赞的视频
  // 【投稿】TA的视频
  // 202503选旧版：普通Item（cube模式）
  $(".small-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 202503选新版
  $(".bili-video-card__cover").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  
  // 202503选新版or旧版：【动态】
  // 用户登录后的动态：https://t.bilibili.com/?spm_id_from=
  // up空间的动态：https://space.bilibili.com/xxxx/dynamic
  $(".bili-dyn-content__orig__major").each(function(){
    var coverObj = $(this).find(".bili-awesome-img:first");// 202303选新版、页面用的<div/>
    if(coverObj.length > 0){
      setVideoIsViewed($(this),".bili-awesome-img");
    }else{
      setVideoIsViewed($(this),coverItemClass);// 202303选旧版、t.bili
    }
  });
  // 普通Item（list模式）：.small-item切换为list模式
  $(".list-item").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 202503选旧版：【合集和列表】点击“查看更多”后的Item
  $(".video-card").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 已看/未看按钮响应
  setBtnView();
  // 点击up主头像响应
  $(".bili-dyn-up-list__item").unbind("click").click(function(){
    prePageScrollTop = 0;
    setTimeout(setPageRefreshMethod,2000);
  })
  // 分页按钮响应
  $(".be-pager li").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 搜索视频按钮响应
  $(".search-btn").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 回车响应
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,2000);
    }
  });
  // 导航栏响应
  $(".n-tab-links a").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 侧栏按钮响应
  $(".contribution-item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 排序按钮响应
  $(".be-tab-item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // Tag点击响应
  $("#submit-video-type-filter a").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 收藏列表响应
  $(".fav-item a").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // up空间主页：点击“更多”按钮 响应
  $(".more").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 合集和列表：点击“更多”按钮 响应
  $(".more-btn").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 合集和列表：查看模式 点击响应
  $(".list-style span").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：导航链接 点击响应（主页、动态、投稿、合集）
  $(".nav-tab__item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（多栏目公用）排序方式 点击响应（最新发布、最多播放、最多收藏、更多筛选下面的按钮）
  $(".radio-filter__item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：（多栏目公用）查看更多 点击响应
  $(".vui_button").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：投稿（TA的视频）左侧栏 点击响应
  $(".side-nav__item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：投稿（TA的视频）查看模式（cube或list） 点击响应
  $(".lists-view-mode").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：合集列表 查看更多 左上角返回“<” 点击响应
  $(".back").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：合集列表 查看更多 右上角排序 点击响应（最早添加、最新添加）
  $(".menu-popover__panel-item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：收藏夹 左侧自定义分类 点击响应
  $(".fav-sidebar-item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
}

// 设置已看/未看按钮响应
var coverItemClass = "img";
var setBtnView = function(){
  $(".btnView").unbind("click").click(function(e){
    var avId = $(this).data("av");
    var view = $(this).data("view");
    // 先读再存（跨页操作）
    // not:类.block-list-item-info-player--img为课堂分区封面上面的播放小图标
    // not:类.cover为热门-全站排行榜的唱片封面
    var coverObjs = $(this).parent().find(coverItemClass+":not(.block-list-item-info-player--img):not(.cover):first");
    var setIsViewed = false;
    if(view == 0){
      // 未看 -> 已看
      setIsViewed = true;
      $(this).text("已看");
      $(this).removeClass("btnNotView");
      $(this).addClass("btnIsView");
      $(this).data("view","1");
      coverObjs.css("opacity",opacityIsViewCover);
    }else{
      // 已看 -> 未看
      $(this).text("未看");
      $(this).removeClass("btnIsView");
      $(this).addClass("btnNotView");
      $(this).data("view","0");
      coverObjs.css("opacity","1");
    }
    // 删除所有按钮
    $(".btnView").remove();
    // 即时存储
    saveGMVideoList(avId,setIsViewed);
    // 重新读取
    setMethod();
    return false;
  });
}


// （多域名共用）检测按钮是否已加载，8次内有效
var isCheck = true;
var btnCount = 0;
var checkCount = 0;
var checkBtnViewLoad = function(){
  if(!isCheck){
    clearInterval(timer);
    timer = null;
    return;
  }
  btnCount = $(".btnView").size();
  if(btnCount > 0 || checkCount > 5){
    clearInterval(timer);
    timer = null;
  }else{
    setMethod();
  }
  checkCount++;
}

// 设置搜索页面
var isView = 0;

var videoArr = null;
var isTextAreaHidden = true;
var setSearchPage = function(){
  var refreshObj = $(".btnRefresh");
  if(refreshObj.size() == 0){
    // 202501版本
    $(".vui_tabs--navbar").append("<a class='btnList' title='显示/隐藏已看ID的数据列表，建议定期复制到其他地方进行保存，避免因事故造成丢失'>显示/隐藏</a>");
    $(".vui_tabs--navbar").append("<a class='btnListSave' title='如果文本框内容有修改，请点击这个按钮进行保存。'>保存列表</a>");
    $(".vui_tabs--navbar").append("<textarea class='viewList'></textarea>");
    $(".search-input-container .flex_center").append(btnRefresh);
    // 显示列表按钮 点击响应
    $(".btnList").click(function(){
      if(isTextAreaHidden){
        var keyList = GM_listValues();
        var key = "";
        var str = "";
        for(var i = 0 ; i < keyList.length;i++){
          key = keyList[i];
          if(key.indexOf("BiliViewed_") == 0){
            str += GM_getValue(key,"")+",";
          }
        }
        $(".viewList").val(str);
      }
      isTextAreaHidden = !isTextAreaHidden;
      $(".viewList").toggle();
      $(".btnListSave").toggle();
    })
    // 刷新按钮 点击响应
    $(".btnRefresh").click(function(){
      setPageRefreshMethod();
    })
    // 保存列表 点击响应
    $(".btnListSave").click(function(){
      viewVideoList = $(".viewList").val();
      saveTextAreaVideoList(viewVideoList);
      isTextAreaHidden = !isTextAreaHidden;
      $(".viewList").toggle();
      $(".btnListSave").toggle();
    })
  }
  // 202501版本：番剧搜索结果
  // 番剧封面视频
  $(".media-card").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 番剧集数列表
  var itemSpanArr = $(".media-footerClone .p_relativeSpan");
  if(itemSpanArr.length == 0){
    // 克隆一个.media-footer
    $(".media-card-content-footer").each(function(idx){
      var mFooter = $(this).find(".media-footer:first");
      if(mFooter.length == 0){
        return;
      }
      var objOffset = mFooter.offset();
      var cloneObj = $(mFooter).clone();
      $(cloneObj).addClass("media-footerClone");
      $(cloneObj).addClass("media-footerClone_"+idx);
      $(cloneObj).removeClass("media-footer");
      $(this).append(cloneObj);
      // 对克隆体里面的元素进行外层包装
      var itemArr = $(".media-footerClone_"+idx+" .p_relative");
      for(var i = 0 ; i < itemArr.length ;i++){
        var spanObj = $("<span class='p_relativeSpan'></span>");
        spanObj.append(itemArr[i]);
        $(".media-footerClone_"+idx).append(spanObj);
      }
      // 克隆层对齐被克隆层
      $(".media-footerClone_"+idx).offset(objOffset);
    })
    $(".media-footer").attr("style","opacity:0");//原来那层变透明
    // 窗口大小改变时进行监听：自动删除克隆层
    $(window).unbind("resize").resize(function(){
      $(".media-footer").removeAttr("style");
      $(".media-footerClone").remove();
      setTimeout(setMethod,2000);
    })
  }
  $(".p_relativeSpan").each(function(){
    setVideoIsViewed($(this),".vui_button");
  });
  // 202501版本：综艺节目搜索结果
  // 综艺集数列表
  $(".seleced-ep").unbind("mouseenter").bind("mouseenter",function(){
    setTimeout(setMethod,500);
  })
  var itemArr = $(".media-footer-select-content-item");
  itemSpanArr = $(".selConSpan");
  var newLength = itemArr.length - itemSpanArr.length;
  if(itemSpanArr.length == 0 || newLength > 0){
    for(var i = itemSpanArr.length ; i < itemArr.length ;i++){
      var spanObj = $("<div class='selConSpan'></div>");
      spanObj.append(itemArr[i]);
      $(".media-footer-select-content").append(spanObj);
    }
  }
  $(".selConSpan").each(function(){
    setVideoIsViewed($(this),".media-footer-select-content-item",0,null,true,true);
  });
  // 查看更多 按钮调回到列表最后面
  $(".media-footer-select-content-more").each(function(){
    $(this).appendTo($(this).parent());
  })
  // 202501版本：up主的视频Item、普通搜索结果Item
  $(".bili-video-card__wrap").each(function(){
    setVideoIsViewed($(this),coverItemClass);
  });
  // 已看/未看按钮响应
  setBtnView();
  // 回车响应（搜索框）
  $(document).unbind('keyup').keyup(function(event){
    if(event.keyCode ==13){
      setTimeout(setPageRefreshMethod,2000);
    }
  });
  // 202501版本：分类菜单点击响应
  $(".vui_tabs--nav-item").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
  // 202501版本：页面上的按钮 点击响应（搜索、分页、排序、筛选 等按钮）
  $(".vui_button").unbind('click').click(function(){
    setTimeout(setPageRefreshMethod,2000);
  })
}

// 获取视频链接上的bv号（不含开头bv）
// 设置每个视频是否已看/未看
// targetAppend：获取视频链接的目标对象（子元素有<a/>），追加已看/未看按钮的那个对象
// coverClass：视频封面的对象（用来设置透明度）
// playType：播放类型（链接处理不同） 0普通视频/节目视频（版权视频）、1稍后观看视频、2节目视频（视频链接作为videoid传入）、3稍后再看视频202412（/list/watchlater?bvid=BVxxxxx&oid=xxxxx）
// videoid：直接传入视频号（如果传入这个，则跳过对targetAppend的视频链接提取处理）
// noAppendTarget：传入true时，则不追加按钮到targetAppend对象下，而是追加到coverClass对象下面，也不会设置封面透明度（主要用于对视频观看页的特殊处理）
// isBefore：传入true时，按钮插入到指定对象（同层）的前面，否则追加指定对象（内部）的最后
// findALast：传入true时，查找targetAppend的最后一个a标签，否则查找第一个a标签
// findCoverClassLast：传入true时，查找coverClass对应的的最后一个对象元素，否则查找对应的第一个对象元素
// 返回：去掉开头bv两个字符的视频号，如果中途处理失败，则返回null
var bvid = null;
var setVideoIsViewed = function(targetAppend,coverClass,playType,videoid,noAppendTarget,isBefore,findALast,findCoverClassLast){
  // 获取封面
  var coverObj = null;
  if(findCoverClassLast){
    coverObj = targetAppend.find(coverClass+":last");
  }else{
    coverObj = targetAppend.find(coverClass+":first");
  }
  if(coverObj.length == 0){
    return null;
  }
  // 判断是否已设置按钮和封面
  var btnView = null;
  if(noAppendTarget){
    if(isBefore){
      btnView = coverObj.parent().children(".btnView:first");
    }else{
      btnView = coverObj.children(".btnView:first");
    }
  }else{
    btnView = targetAppend.children(".btnView:first");
  }
  if(btnView.length > 0){
    return null;
  }
  if(videoid != null && playType != 2){
    bvid = videoid;
  }else{
    // 获取视频链接和封面
    if(playType == 2){
      // videoid作为链接处理
      bvid = videoid;
      // 然后作为普通视频处理
      playType = 0;
    }else{
      var aObj = null;
      if(findALast){
        aObj = targetAppend.find("a:last");
      }else{
        aObj = targetAppend.find("a:first");
      }
      if(aObj.length == 0){
        return null;
      }
      bvid = aObj.attr("href");
    }
    if(bvid == null){
      return null;
    }
    // 提取视频链接上面的bv号
    if(playType == 1){
      // 稍后观看视频
      bvid = bvid.replace("//www.bilibili.com/medialist/play/watchlater/","");
    }else if(playType == 3){
      // 202412稍后再看列表的视频：https://www.bilibili.com/list/watchlater?bvid=BVxxxxxxx&oid=xxxxxxx
      bvid = getBvidFromUrl(bvid);
      if(!bvid){
        return;
      }
    }else{
      // 短地址
      bvid = bvid.replace("//b23.tv/","");
      // 课程手机视频（首页的课堂Item用的）
      bvid = bvid.replace("//m.bilibili.com/cheese/play/","");
      // 普通视频
      bvid = bvid.replace("//www.bilibili.com/video/","").replace("/video/","");
      // 节目视频
      bvid = bvid.replace("//www.bilibili.com/bangumi/play/","").replace("/bangumi/play/","");
      // 课程视频
      bvid = bvid.replace("//www.bilibili.com/cheese/play/","").replace("/cheese/play/","");
    }
    bvid = bvid.replace("https:","");
    var slashIndex = bvid.indexOf("/");
    if(slashIndex > -1){
      bvid = bvid.substring(0,slashIndex);
    }
    if(bvid.length == 0){
      return null;
    }
    slashIndex = bvid.indexOf("?");
    if(slashIndex > -1){
      bvid = bvid.substring(0,slashIndex);
    }
    bvid = bvid.replace("/","");
  }
  if(bvid.startsWith("av")){
    // av号转bv号
    bvid = bvid.substr(2);
    bvid = avToBv.encode(bvid);
    bvid = bvid.substr(2);
  }else if(bvid.startsWith("BV") || bvid.startsWith("bv")){
    //bvid = bvid.replace("BV","").replace("bv","");
    bvid = bvid.substr(2);
  }else if(bvid.startsWith("ep") || bvid.startsWith("ss")){
    // 节目视频原样保留
  }else{
    return null;
  }
  if(noAppendTarget){
    targetAppend = coverObj;
  }
  // 添加已看/未看按钮、设置封面透明度
  if(getBvIsViewed(bvid)){
    // 已看
    if(isBefore){
      targetAppend.before("<a class='btnView btnIsView' data-view='1' data-av='"+bvid+"'>已看</a>");
    }else{
      targetAppend.append("<a class='btnView btnIsView' data-view='1' data-av='"+bvid+"'>已看</a>");
    }
    if(!noAppendTarget){
      coverObj.css("opacity",opacityIsViewCover);
    }
  }else{
    // 未看
    if(isBefore){
      targetAppend.before("<a class='btnView btnNotView' data-view='0' data-av='"+bvid+"'>未看</a>");
    }else{
      targetAppend.append("<a class='btnView btnNotView' data-view='0' data-av='"+bvid+"'>未看</a>");
    }
    if(!noAppendTarget){
      coverObj.css("opacity","1");
    }
  }
  return bvid;
}

var getBvidFromUrl = function(url) {
    // 使用正则表达式匹配 bvid 的值
    const regex = /bvid=([^&]+)/;
    const match = url.match(regex);
    // 如果匹配成功，返回 bvid 的值，否则返回 null
    return match ? match[1] : null;
}

// 判断视频是否已看
var viewVideoJson = {};
var viewGroupArr = null;
var getBvIsViewed = function(bvid){
  bvid = bvid + "";
  if(bvid.length < 5){ // 暂时发现最短是ss100
    return false;
  }
  var groupId = "";
  if(bvid.startsWith("ep")){
    // 节目视频（ep数字）：ep+最后一个数字作为分组名称
    groupId = "ep"+bvid.substr(bvid.length-1,1);
  }else if(bvid.startsWith("ss")){
    // 节目合集（ss数字）：ss+最后一个数字作为分组名称
    groupId = "ss"+bvid.substr(bvid.length-1,1);
  }else if(bvid.length == 10){
    // 普通视频bv号：取第二个字符作为分组
    groupId = bvid.substr(1,1);
  }else if(bvid.length > 10 && bvid.indexOf("-") == 10){
    // 分P存储bv-N，N为第N P：取第二个字符作为分组
    groupId = bvid.substr(1,1);
  }else{
    return false;
  }
  viewGroupArr = viewVideoJson[groupId];
  if(!viewGroupArr){
    viewGroupArr = GM_getValue("BiliViewed_"+groupId,null);
    if(viewGroupArr == null){
      // 该分组未建立
      return false;
    }
    viewVideoJson[groupId] = viewGroupArr;
  }
  for(var i = 0 ; i < viewGroupArr.length;i++){
    if(bvid == viewGroupArr[i]){
      return true;
    }
  }
  return false;
}

// 更新和保存GM本地存储的列表
var saveGMVideoList = function(bvid,isViewed){
  bvid = bvid + "";
  if(bvid.length < 5){
    return false;
  }
  var groupId = "";
  if(bvid.startsWith("ep")){
    // 节目视频（ep数字）：ep+最后一个数字作为分组名称
    groupId = "ep"+bvid.substr(bvid.length-1,1);
  }else if(bvid.startsWith("ss")){
    // 节目合集（ss数字）：ss+最后一个数字作为分组名称
    groupId = "ss"+bvid.substr(bvid.length-1,1);
  }else if(bvid.length == 10){
    // 普通视频bv号：取第二个字符作为分组
    groupId = bvid.substr(1,1);
  }else if(bvid.length > 10 && bvid.indexOf("-") == 10){
    // 分P存储bv-N，N为第N P：取第二个字符作为分组
    groupId = bvid.substr(1,1);
  }else{
    return false;
  }
  viewGroupArr = viewVideoJson[groupId];
  if(!viewGroupArr){
    viewGroupArr = GM_getValue("BiliViewed_"+groupId,null);
    if(viewGroupArr == null){
      // 该分组未建立
      if(!isViewed){
        return;
      }
      viewVideoJson[groupId] = [];
    }
  }
  if(isViewed){
    // 防止没刷新重复插入
    for(var i = 0 ; i < viewVideoJson[groupId].length && i < 10;i++){
      if(viewVideoJson[groupId][i] == bvid){
        return;
      }
    }
    viewVideoJson[groupId].unshift(bvid); // 添加新的bv号到数组中
  }else{
    for(var i = 0 ; i < viewVideoJson[groupId].length;i++){
      if(viewVideoJson[groupId][i] == bvid){
        viewVideoJson[groupId].splice(i,1); // 删除数组上指定位置的数据
      }
    }
  }
  // 存储到GM
  GM_setValue("BiliViewed_"+groupId,viewVideoJson[groupId]);
}

// 对原已看视频数据列表进行分组（按第二个字母）
var groupGMVideoList = function(viewVideoList){
  if(viewVideoList.length == 0){
    GM_deleteValue("BiliViewed");
    return;
  }
  var videoArr = viewVideoList.split("\n");
  var gid = "";
  var groupJson = {};
  for(var i = 0 ; i < videoArr.length;i++){
    if(videoArr[i].length < 6){
      continue;
    }
    if(videoArr[i].startsWith("ep")){
      // 节目视频（ep数字）：ep+最后一个数字作为分组名称
      gid = "ep"+videoArr[i].substr(videoArr[i].length-1,1);
    }else if(videoArr[i].startsWith("ss")){
      // 节目合集（ss数字）：ss+最后一个数字作为分组名称
      gid = "ss"+videoArr[i].substr(videoArr[i].length-1,1);
    }else if(videoArr[i].length == 10){
      // 普通视频bv号：取第二个字符作为分组
      gid = videoArr[i].substr(1,1);
    }else if(videoArr[i].length > 10 && videoArr[i].indexOf("-") == 10){
      // 分P存储bv-N，N为第N P：取第二个字符作为分组
      gid = videoArr[i].substr(1,1);
    }else{
      continue;
    }
    if(!groupJson[gid]){
      groupJson[gid] = [];
    }
    groupJson[gid].unshift(videoArr[i]);
  }
  // 存储各分表
  for(var key in groupJson){
    GM_setValue("BiliViewed_"+key,groupJson[key]);
  }
  // 删除原列表
  GM_deleteValue("BiliViewed");
}

// 对文本框的视频数据列表进行分组（按第二个字母）
var saveTextAreaVideoList = function(viewVideoList){
  viewVideoList = viewVideoList.replaceAll("\n",",");
  var videoArr = viewVideoList.split(",");
  var gid = "";
  var groupJson = {};
  for(var i = 0 ; i < videoArr.length;i++){
    if(videoArr[i].length < 6){
      continue;
    }
    if(videoArr[i].startsWith("ep")){
      // 节目视频（ep数字）：ep+最后一个数字作为分组名称
      gid = "ep"+videoArr[i].substr(videoArr[i].length-1,1);
    }else if(videoArr[i].startsWith("ss")){
      // 节目合集（ss数字）：ss+最后一个数字作为分组名称
      gid = "ss"+videoArr[i].substr(videoArr[i].length-1,1);
    }else if(videoArr[i].length == 10){
      // 普通视频bv号：取第二个字符作为分组
      gid = videoArr[i].substr(1,1);
    }else if(videoArr[i].length > 10 && videoArr[i].indexOf("-") == 10){
      // 分P存储bv-N，N为第N P：取第二个字符作为分组
      gid = videoArr[i].substr(1,1);
    }else{
      continue;
    }
    if(!groupJson[gid]){
      groupJson[gid] = [];
    }
    groupJson[gid].unshift(videoArr[i]);
  }
  // 清空原来GM存储的所有数据
  var keyList = GM_listValues();
  var key = "";
  for(var i = 0 ; i < keyList.length;i++){
    key = keyList[i];
    if(key.indexOf("BiliViewed_") == 0){
      GM_deleteValue(key);
    }
  }
  // 存储各分表
  for(var key in groupJson){
    GM_setValue("BiliViewed_"+key,groupJson[key]);
  }
}

// av转bv，参考来源：https://github.com/Coxxs/bvid/blob/master/bvid.js
var avToBv = (function () {
  var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
  var tr = {}
  for (var i = 0; i < 58; i++) {
    tr[table[i]] = i
  }
  var s = [11, 10, 3, 8, 4, 6]
  var r = ['B', 'V', '1', '', '', '4', '', '1', '', '7', '', '']
  var xor = 177451812
  var add = 8728348608

 function encode(x) {
    if (x <= 0 || x >= 1e9) {
      return null
    }
    x = (x ^ xor) + add
    var result = r.slice()
    for (var i = 0; i < 6; i++) {
      result[s[i]] = table[Math.floor(x / 58 ** i) % 58]
    }
    return result.join('')
  }
  return { encode }
})()