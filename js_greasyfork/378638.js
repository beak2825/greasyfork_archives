// ==UserScript==
// @name         TA汉化版-BETA
// @namespace    暂无
// @version      BETA-0.8.6
// @description  来享受更好的TrueAchievements吧！
// @author       吊打小逗比
// @include      *://www.trueachievements.com/*
// @include      *://www.trueachievements.com/*/*
// @include      *://www.trueachievements.com/*/*/*
// @include      *://www.trueachievements.com/*/*/*/*
// @icon         https://www.trueachievements.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        GM.info
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/378638/TA%E6%B1%89%E5%8C%96%E7%89%88-BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/378638/TA%E6%B1%89%E5%8C%96%E7%89%88-BETA.meta.js
// ==/UserScript==
//==================================================汉化==================================================
(function() {
    'use strict';
    var title = document.getElementsByTagName("title")[0];
    title.innerHTML = 'TA汉化版'+GM.info.script.version+'-Xbox成就追踪器';
})();
//==================================================Logo汉化==================================================

(function(){

    'use s triot'
    var lnkTrueAchievements=$('#lnkTrueAchievements');
    if (lnkTrueAchievements.length==1){
        $(lnkTrueAchievements).html('<img src="https://greasyfork.org/system/screenshots/screenshots/000/014/880/original/logo.png?1554718624"/>')
    }
})();
//==================================================本体汉化==================================================
var htmlstr=document.getElementsByTagName('body')[0].innerHTML;
var test=[{
    //=================↓版头↓=================
    reg:/All News tagged with/g,
    value :"下列新闻带有标签："
},{
    reg:/All Game reviews/g,
    value :"全部游戏测评"
},{
    reg:/All Xbox and TrueAchievements News/g,
    value :"全部Xbox和TrueAchievements网站新闻"
},{
    reg:/All Contestss/g,
    value :"全部比赛"
},{
    reg:/All Best ofs/g,
    value :"全部最好的游戏"
},{
    reg:/All Op-Eds/g,
    value :"全部专栏文章"
},{
    reg:/All Community News/g,
    value :"全部社区新闻"
},{
    reg:/All New Releases/g,
    value :"所有新版本"
},{
    reg:/All Site news/g,
    value :"全部网站新闻"
},{
    reg:/All Free with premiums/g,
    value :"全部金会员折扣"
},{



    //=============↑为All预留↑=============


    //=================↓导航栏↓=================
    reg:/Main Menu/g,
    value :"主菜单"
},{
    //===========↓新闻↓===========
    reg:/Xbox News/g,
    value :"Xbox新闻"
},{
    reg:/Site News/g,
    value :"网站新闻"
},{
    reg:/Community News/g,
    value :"社区新闻"
},{
    reg:/Site Updates/g,
    value :"网站更新"
},{
    reg:/TrueAchievements Podcast/g,
    value :"TA Podcast"
},{
    reg:/Suggest News/g,
    value :"提交新闻"
},{
    reg:/News/g,
    value :"新闻"
},{
    //===========↓Xbox Live状态↓===========
    reg:/Xbox Live Status/g,
    value :"Xbox Live状态"
},{
    reg:/Is Xbox Live Down/g,
    value :"Xbox Live挂了吗"
},{
    reg:/We're actively tracking the current status of the Xbox Live service to see if there are any issues./g,
    value :"这是Xbox live目前的状态，看看有没有问题"
},{
    reg:/There are currently issues on Xbox Live/g,
    value :"Xbox Live 服务中断"
},{
    reg:/You are currently viewing the status info for the United States. You can go /g,
    value :"您当前正在查看美服Xbox Live状态信息。你可以点击"
},{
    reg:/here/g,
    value :"这里。"
},{
    reg:/ for more information./g,
    value :"以查看更多信息"
},{
    reg:/Current Xbox Live/g,
    value :"当前Xbox Live"
},{
    reg:/Xbox Live Core Services/g,
    value :"Xbox Live 核心服务"
},{
    reg:/Purchase and Content Usage/g,
    value :"购买和内容使用"
},{
    reg:/Social and Gaming/g,
    value :"社交和游戏"
},{
    reg:/TV, Music and Video/g,
    value :"电视、音乐和视频"
},{
    reg:/Last checked/g,
    value :"更新于"
},{
    reg:/Resolved/g,
    value :"已修复"
},{
    reg:/Ongoing/g,
    value :"修复中"
},{
    reg:/Impacted devices/g,
    value :"受影响平台"
},{
    reg:/Buying downloadable items/g,
    value :"购买下载的项目"
},{
    reg:/Using prepaid cards or codes for downloadable items or Xbox Live subscriptions/g,
    value :"购买物品，兑换代码或下载购买物品"
},{
    reg:/Purchasing backwards compatible content/g,
    value :"购买向下兼容"
},{
    reg:/Issue description:/g,
    value :"受影响的服务:"
},{
    reg:/Started:/g,
    value :"开始于:"
},{
    reg:/China Standard Time/g,
    value :"中国标准时间"
},{
    reg:/Impacts:/g,
    value :"受影响平台"
},{

    reg:/Xbox LIVE is an online service originally created by Microsoft for its Xbox gaming console in 2002./g,
    value :"Xbox LIVE是微软于2002年推出的Xbox专用在线服务。"
},{
    reg:/The service was discontinued for the original Xbox in 2010, but continues to operate on its Xbox 360 and Xbox One consoles, as well as other platforms including Windows and Windows Phone./g,
    value :"该服务于2010年停止支持初代Xbox，目前支持Xbox 360、Xbox One、Windows、Windows Phone等平台。"
},{
    reg:/While the service initially focused primarily on multiplayer gaming, it has now branched out to host other services including media content delivery./g,
    value :"该服务最初主要用于多人游戏，但它现在已经扩展了其他服务，包括媒体项目托管。"
},{
    reg:/ day ago/g,
    value :"天前。"
},{
    reg:/ days ago/g,
    value :"天前。"
},{
    //===========↓游戏↓===========
    reg:/Xbox Games/g,
    value :"Xbox游戏"
},{
    reg:/Xbox Game Series/g,
    value :"Xbox游戏系列"
},{
    reg:/Xbox Achievements/g,
    value :"Xbox成就"
},{
    reg:/Popular Achievements/g,
    value :"热门成就"
},{
    reg:/Guideless Achievements/g,
    value :"缺少攻略的成就"
},{
    reg:/Xbox Challenges/g,
    value :"Xbox限时挑战成就"
},{
    reg:/Xbox Walkthroughs/g,
    value :"Xbox攻略合集"
},{
    reg:/Site Game Reviews/g,
    value :"TA点评"
},{
    reg:/User Game Reviews/g,
    value :"玩家评论"
},{
    reg:/Achievement Solutions/g,
    value :"成就攻略"
},{
    reg:/Gaming/g,
    value :"游戏"
},{

    //===========↓折扣&发售↓===========
    reg:/Upcoming Releases/g,
    value :"即将发布"
},{
    reg:/Xbox Game Prices/g,
    value :"Xbox游戏价格"
},{
    reg:/Xbox Sales/g,
    value :"Xbox折扣"
},{
    reg:/Xbox Hardware Prices/g,
    value :"Xbox硬件"
},{
    reg:/Xbox Game Pass Games/g,
    value :"Xbox游戏通票游戏池"
},{
    reg:/New Releases, Sales and Subscriptions/g,
    value :"新游戏、折扣&会员资格"
},{
    //=================↓排行榜↓=================
    reg:/ Site Leaderboards/g,
    value :"年网站排行榜"
},{
    reg:/Custom Leaderboards/g,
    value :"自定义排行榜"
},{
    reg:/Site Leaderboards/g,
    value :"网站排行榜"
},{
    reg:/Leaderboards/g,
    value :"排行榜"
},{
    //=================↓支持&帮助↓=================
    reg:/Getting Started/g,
    value :"入门指南"
},{
    reg:/Help Articles/g,
    value :"网站帮助"
},{
    reg:/Pro Account/g,
    value :"会员账户"
},{
    reg:/Staff List/g,
    value :"工作人员"
},{
    reg:/Invite Friends/g,
    value :"邀请朋友"
},{
    reg:/Contact Us/g,
    value :"联系我们"
},{
    reg:/Search Site/g,
    value :"站内搜索"
},{
    reg:/Solution Guidelines/g,
    value :"攻略编写指南"
},{
    reg:/Cheater Policy/g,
    value :"作弊者定义"
},{
    reg:/Genre Info/g,
    value :"游戏类型定义"
},{
    reg:/Badge Info/g,
    value :"勋章信息"
},{
    reg:/Genre Votes/g,
    value :"游戏类型投票"
},{
    reg:/Achievement Flags/g,
    value :"成就标识定义"
},{
    reg:/FAQ/g,
    value :"问与答"
},{
    reg:/Scanner Info/g,
    value :"数据同步记录"
},{
    reg:/Report Bug/g,
    value :"报告BUG"
},{
    reg:/About TrueAchievements/g,
    value :"关注TA"
},{
    reg:/Site Rules/g,
    value :"网站规则"
},{
    reg:/Help /g,
    value :"帮助"
},{
    reg:/ Support/g,
    value :"支持"
},{
    //=================↓搜索↓=================
    reg:/Search for/g,
    value :"关键词"
},{
    reg:/Search title only/g,
    value :"主题包含"
},{
    reg:/Include auto-posts/g,
    value :"包括照片和视频"
},{
    reg:/GamerTag/g,
    value :"发布者"
},{
    reg:/Board category/g,
    value :"主题类型"
},{
    reg:/游戏 Discussion/g,
    value :"游戏讨论"
},{
    reg:/LeaderBoards/g,
    value :"游戏排行榜"
},{
     reg:/Off Topic/g,
    value :"水帖"
},{
    reg:/Staff/g,
    value :"管理组"
},{
    reg:/Please provide a Gamer or Messageboard to search for/g,
    value :"请输入玩家和板块信息"
},{
    //=================↓社区↓=================
    reg:/Community/g,
    value :"社区"
},{
    //=================↓论坛↓=================
    reg:/My Threads/g,
    value :"我的主题帖"
},{
    reg:/My Forums/g,
    value :"我的论坛"
},{
    reg:/New Threads/g,
    value :"新的主题"
},{
    reg:/Forum Index/g,
    value :"论坛首页"
},{
    reg:/Search Forum Posts/g,
    value :"搜索帖子"
},{
    reg:/Forums/g,
    value :"论坛"
},{
    //=================↓游戏清单↓=================
    reg:/TA Playlist Hub/g,
    value :"TA游戏清单中心"
},{
    reg:/TA Playlist/g,
    value :"TA游戏清单"
},{
    //=================↓博客↓=================
    reg:/Blog Leaderboard/g,
    value :"博客排行榜"
},{
    reg:/Blogs/g,
    value :"博客"
},{
    //=================↓聊天↓=================
    reg:/Chat Rules/g,
    value :"聊天室规则"
},{
    reg:/Chat Room/g,
    value :"聊天室"
},{
    reg:/Chat/g,
    value :"在线聊天"
},{
    //=================↓游戏派对↓=================
    reg:/My 游戏 Sessions/g,
    value :"我的游戏派对"
},{
    reg:/Create 游戏 Session/g,
    value :"创建游戏派对"
},{
    reg:/Session Feedback/g,
    value :"派对反馈"
},{
    reg:/Feedback Given/g,
    value :"反馈记录"
},{
    reg:/游戏 Sessions/g,
    value :"游戏派对"
},{
    //=================↓比赛↓=================
    reg:/ Individual/g,
    value :"个人赛"
},{
    reg:/ Team/g,
    value :"团队赛"
},{
    reg:/Contests/g,
    value :"比赛"
},{
    //=================↓视频↓=================
    reg:/Our Latest Videos/g,
    value :"我们最新的视频"
},{
    reg:/Game Clip Hub/g,
    value :"游戏剪辑中心"
},{
    reg:/Friends Game Clips/g,
    value :"朋友最新的剪辑"
},{
    reg:/Streaming Hub/g,
    value :"直播中心"
},{
    reg:/Videos/g,
    value :"视频"
},{
    reg:/Video/g,
    value :"视频"
},{

    //=================↓商店↓=================
    reg:/Merchandise/g,
    value :"商店"
},{
    //=================↓个人信息↓=================
    reg:/Private Messages/g,
    value :"个人信息"
},{
    reg:/Archived Sent Items/g,
    value :"归档已发送"
},{
    reg:/Sent Items/g,
    value :"已发送"
},{
    reg:/Deleted Items/g,
    value :"已删除"
},{
    reg:/Archived Inbox/g,
    value :"归档邮件"
},{
    reg:/Deleted Items/g,
    value :"已删除"
},{
    reg:/Inbox/g,
    value :"收信箱"
},{
    //=================↓信息↓=================
    reg:/Messages/g,
    value :"信息"
},{
    //=================↓个人中心↓=================
    reg:/My Homepage/g,
    value :"个人主页"
},{
    reg:/Request Update/g,
    value :"同步数据"
},{
    reg:/My Games/g,
    value :"我的游戏"
},{
    reg:/My Game Collection/g,
    value :"我的游戏合集"
},{
    reg:/My DLC/g,
    value :"我的DLC"
},{
    reg:/My Achievements/g,
    value :"我的成就"
},{
    reg:/My Series/g,
    value :"我的游戏系列"
},{
    reg:/My Challenges/g,
    value :"我的限时挑战"
},{
    reg:/Completion Times/g,
    value :"完成时间"
},{
    reg:/To-Do List/g,
    value :"目标清单"
},{
    reg:/Trophy Case/g,
    value :"展示成就"
},{
    reg:/Wish List/g,
    value :"愿望清单"
},{
    reg:/Easy Achievements/g,
    value :"易获得的成就"
},{
    reg:/Hub/g,
    value :"中心"
},{
    reg:/Achievements/g,
    value :"成就"
},{
    reg:/ 成就/g,
    value :"的成就"
},{
    reg:/True成就/g,
    value :"TrueAchievements"//<修复
},{
    reg:/Clips/g,
    value :"剪辑"
},{
    reg:/Reviews/g,
    value :"评论"
},{
    reg:/Scores/g,
    value :"和朋友比较"
},{
    reg:/Price/g,
    value :"购买"
},{
    //=================↓同步↓=================
    reg:/You have already been scanned within the past minute, try again shortly./g,
    value :"您距上次同步数据少于一分钟，请稍后重试。"
},{
    reg:/You have been added to the scan queue /g,
    value :"正在排队等待同步数据"
},{
    reg:/ there is no-one in front of you/g,
    value :"你排在第一位"
},{
    reg:/Sorry, you have reached the scan limit for the last 24 hours. You can have unlimited scans if you get a /g,
    value :"对不起，24小时内你的同步数据次数已达上限，如果需要无限次的同步数据，请"
},{
    reg:/TrueAchievements Pro Subscription/g,
    value :"购买TA Pro会员"
},{
    //=================↓统计数据↓=================
    reg:/My Stats/g,
    value :"我的统计"
},{
    reg:/Period Summaries/g,
    value :"当期总结"
},{
    reg:/My 排行榜/g,
    value :"我的排行榜"
},{
    reg:/My Goals/g,
    value :"我的目标"
},{
    reg:/My Milestones/g,
    value :"我的里程碑"
},{
    reg:/My Achievement Streaks/g,
    value :"我的成就轨迹"
},{
    reg:/Statistics/g,
    value :"统计数据"
},{
    reg:/Goals/g,
    value :"目标"
},{
    reg:/Stats/g,
    value :"统计"
},{
    //=================↓社交&已发布内容↓=================
    reg:/My Friends/g,
    value :"我的好友"
},{
    reg:/My Blog/g,
    value :"我的博客"
},{
    reg:/My Solutions/g,
    value :"我的成就攻略"
},{
    reg:/My Reviews/g,
    value :"我的评论"
},{
    reg:/My Subscriptions/g,
    value :"我的订阅"
},{
    reg:/My GamerCard/g,
    value :"我的名片"
},{
    reg:/Social /g,
    value :"社交"
},{
    reg:/ Content/g,
    value :"已发布内容"
},{
    reg:/Blog/g,
    value :"博客"
},{
    //=================↓账户↓=================
    reg:/Account Settings/g,
    value :"账户设置"
},{
    reg:/Site Settings/g,
    value :"网站设置"
},{
    reg:/Customize 个人主页/g,
    value :"自定义个人主页"
},{
    reg:/社交Settings/g,
    value :"社交设置"
},{
    reg:/My Biography/g,
    value :"个人简介"
},{
    reg:/Log Out/g,
    value :"登出"
},{
    reg:/Social /g,
    value :"社交"
},{
    reg:/Link Other Accounts/g,
    value :"链接第三方账户"
},{
    reg:/My Account/g,
    value :"我的账户"
},{
    //=================↓最近游戏↓=================
    reg:/My Recent Games/g,
    value :"近期玩过"
},{
    //=================↓游戏剪辑↓=================
    reg:/My Game Captures/g,
    value :"我的游戏剪辑"
},{
    reg:/My Favourite Captures/g,
    value :"我最爱的游戏剪辑"
},{
    reg:/Game Captures/g,
    value :"游戏剪辑"
},{
    reg:/Captures/g,
    value :"剪辑"
},{
    //=================↓登录&注册↓=================
    reg:/Log in/g,
    value :"登陆"
},{
    reg:/Register Free/g,
    value :"免费注册"
},{
    reg:/Register now for free/g,
    value :"立刻免费注册"
},{
    reg:/EA Access Games/g,
    value :"EA会员游戏游戏池"
},{
    //=================↓边栏↓=================
    reg:/Follow Us On.../g,
    value :"关注我们"
},{
    reg:/Games with Gold/g,
    value :"金会员折扣"
},{
    reg:/What Is Xbox Live/g,
    value :"什么是Xbox Live"
},{
    reg:/Upcoming Live Streams/g,
    value :"即将开始的直播"
},{
    reg:/Available now/g,
    value :"本月免费"
},{
    reg:/Today's Top Story/g,
    value :"今日头条"
},{
    reg:/Category News Subscriptions/g,
    value :"订阅新闻类别"
},{
    reg:/Site Leaderboard/g,
    value :"网站排行"
},{
    reg:/Highest Scoring Games/g,
    value :"高分游戏"
},{
    reg:/Hot Threads/g,
    value :"热门帖子"
},{
    reg:/Latest Achievement Lists/g,
    value :"最新成就列表"
},{
    reg:/Official Service Status/g,
    value :"Xbox Live状态"
},{
    reg:/Site Calculation Job Status/g,
    value :"TA站工作状态"
},{
    reg:/Latest Poll/g,
    value :"新调查"
},{
    reg:/Currently Tracking/g,
    value :"目前追踪"
},{
    reg:/Latest Reviews/g,
    value :"最新回复"
},{
    reg:/Latest Walkthroughs/g,
    value :"最新攻略合集"
},{
    reg:/Latest Site Blog Posts/g,
    value :"最新博客"
},{
    reg:/Game Information/g,
    value :"游戏信息"
},{
    reg:/Purchase Options/g,
    value :"购买渠道"
},{
    reg:/Share Achievement list/g,
    value :"分享成就列表"
},{
    reg:/Latest Videos/g,
    value :"最新视频"
},{
    reg:/Latest 新闻/g,
    value :"最新新闻"
},{
    reg:/Series for this game/g,
    value :"系列游戏"
},{
    reg:/Achievement Distribution/g,
    value :"成就获得分布"
},{
    //=================↓TA状态↓==============
    reg:/We are currently recalculating the TrueAchievements statistics./g,
    value :"正在重新统计TA的数据"
},{
    reg:/The current status is/g,
    value :"目前状态"
},{
    reg:/Building Site leaderboard /g,
    value :"建立网站排行榜"
},{
    //=================↓按钮↓==============
    reg:/Add series to my homepage/g,
    value :"将此系列加入我的主页"
},{
    reg:/All achievements/g,
    value :"全部成就"
},{
    reg:/All Xbox walkthroughs/g,
    value :"全部攻略合集"
},{
    reg:/Blog leaderboard/g,
    value :"博客排行榜"
},{
    reg:/Subscribe to news updates/g,
    value :"订阅最新消息"
},{
    reg:/Download/g,
    value :"下载"
},{
    reg:/Full leaderboard/g,
    value :"完整排行榜"
},{
    reg:/More lists/g,
    value :"更多成就列表"
},{
    reg:/More news/g,
    value :"更多新闻"
},{
    reg:/More filter options/g,
    value :"过滤设置"
},{
    reg:/Read more user reviews/g,
    value :"更多回复"
},{
    reg:/Random blog/g,
    value :"随机推荐博客"
},{
    reg:/View past streams/g,
    value :"之前的直播"
},{
    reg:/View Mixer channel/g,
    value :"在Mixer上观看直播"
},{
    reg:/View all forum posts/g,
    value :"查看所有帖子"
},{
    reg:/View poll discussion/g,
    value :"观点讨论"
},{
    reg:/View more games/g,
    value :"更多游戏"
},{
    reg:/Walkthrough/g,
    value :"攻略"
},{
    reg:/Xbox折扣 Hub/g,
    value :"正在打折的游戏"
},{
    reg:/Forum/g,
    value :"论坛"
},{
    //=================↓隐藏成就描述↓=================
    reg:/Secret Achievement/g,
    value :"隐藏成就"
},{
    reg:/Continue playing to unlock this secret achievement./g,
    value :"深入游玩来解锁此隐藏成就"
},{

    //=================↓游戏页面↓=================
    reg:/Publisher/g,
    value :"发行商"
},{
    reg:/Developer/g,
    value :"开发商"
},{
    reg:/Platform/g,
    value :"平台"
},{
    reg:/Genre/g,
    value :"类型"
},{
    reg:/类型s/g,
    value :"类型"
},{
    reg:/Features/g,
    value :"特征"
},{
    reg:/Notes/g,
    value :"标注"
},{
    reg:/Medium/g,
    value :"媒介"
},{
    reg:/Size/g,
    value :"容量"
},{
    reg:/Completion est/g,
    value :"预计完成时间"
},{
    reg:/excludes DLC packs/g,
    value :"包括DLC内容"
},{
    reg:/Physical and Digital/g,
    value :"实体版和数字版"
},{
    reg:/Digital only/g,
    value :"仅数字版"
},{
    reg:/Physical only/g,
    value :"仅实体版"
},{

    reg:/This is the overall win distribution of the/g,
    value :"这是此游戏的成就获得分布"
},{
    reg:/Completion Estimates/g,
    value :"完成时间统计"
},{
    reg:/Region & Platform Variations/g,
    value :"其他地区及平台版本"
},{
    reg:/Links/g,
    value :"外部链接"
},{
    //=================↓过滤器↓=================
    reg:/Hide achievements I have/g,
    value :"隐藏我解锁的成就"
},{
    reg:/Show all games/g,
    value :"显示所有游戏"
},{
    reg:/Only show games I have/g,
    value :"只显示我拥有的游戏"
},{
    reg:/Posted/g,
    value :"发布于"
},{
    reg:/All time/g,
    value :"任何时间"
},{
    reg:/Today/g,
    value :"今天"
},{
    reg:/Last 2 days/g,
    value :"两天前"
},{
    reg:/Last 7 days/g,
    value :"七天前"
},{
    reg:/Last month/g,
    value :"一个月前"
},{
    reg:/Last 3 month/g,
    value :"三个月前"
},{
    //=================↓统计↓==============
    reg:/ACHIEVEMENTS/g,
    value :"新增成就数"
},{
    reg:/GAMERSCORE/g,
    value :"新增成就点数"
},{
    reg:/RATIO/g,
    value :"成就点/TA点比"
},{
    reg:/TRUEACHIEVEMENT/g,
    value :"新增TA点数"
},{
    reg:/GAMES STARTED/g,
    value :"期间开始玩的游戏"
},{
    reg:/GAMES PLAYED/g,
    value :"期间玩过的游戏"
},{
    reg:/GAMES COMPLETED/g,
    value :"期间全成就游戏"
},{
    reg:/January/g,
    value :"1月-"
},{
    reg:/February/g,
    value :"2月-"
},{
    reg:/March/g,
    value :"3月-"
},{
    reg:/April/g,
    value :"4月-"
},{
    reg:/Mayy/g,
    value :"5月-"
},{
    reg:/June/g,
    value :"6月-"
},{
    reg:/July/g,
    value :"7月-"
},{
    reg:/August/g,
    value :"8月-"
},{
    reg:/September/g,
    value :"9月-"
},{
    reg:/October/g,
    value :"10月-"
},{
    reg:/November/g,
    value :"11月-"
},{
    reg:/December/g,
    value :"12月-"
},{
    reg:/Total TrueAchievement Score/g,
    value :"总TA点"
},{
    reg:/Years/g,
    value :"按年查看"
},{
    reg:/Months/g,
    value :"按月查看"
},{
    reg:/All of/g,
    value :"全年-"
},{
    //=================↓官网版权↓==============
    reg:/Small Print/g,
    value :"附属细则"
},{
    reg:/Copyright © 2019 True游戏 Network/g,
    value :"版权所属 © 2019 TrueGaming"
},{
    reg:/Ltd, All Rights Reserved/g,
    value :"网络有限公司,保留所有权利"
},{
    reg:/Concept, Design, Programming and Server Stuff by/g,
    value :"概念、设计、编程以及服务器资料BY—"
},{
    reg:/aka/g,
    value :"又名："
},{
    reg:/Site version:/g,
    value :"网站版本："
},{
    //=================↓友情链接↓==============
    reg:/Shortcuts/g,
    value :"友情链接："
},{
    reg:/Check out the leading /g,
    value :"推荐"
},{
    reg:/ site/g,
    value :"网站"
},{
    //=================↓标签↓==============
    reg:/tagged/g,
    value :"标签"
},{
    reg:/Chart/g,
    value :"表格"
},{
    reg:/Demo/g,
    value :"演示"
},{
    reg:/Hardware/g,
    value :"硬件"
},{
    reg:/Game Pass/g,
    value :"游戏通行证"
},{
    reg:/Article/g,
    value :"文章"
},{
    reg:/Achievement List/g,
    value :"成就列表"
},{
    reg:/List/g,
    value :"成就列表"
},{
    reg:/Backwards Compatibles/g,
    value :"向下兼容"
},{
    reg:/Backwards Compatible/g,
    value :"向下兼容"
},{
    reg:/Back Compat/g,
    value :"向下兼容"
},{
    reg:/Rumour/g,
    value :"传言"
},{
    reg:/Industry News/g,
    value :"业内新闻"
},{
    reg:/Industry/g,
    value :"业内新闻"
},{
    reg:/Upcoming Release/g,
    value :"即将发布"
},{
    reg:/Upcoming/g,
    value :"即将发布"
},{
    reg:/Game Patch/g,
    value :"游戏补丁"
},{
    reg:/Patch/g,
    value :"游戏补丁"
},{
    reg:/Xbox One X Enhanced/g,
    value :"XboxOneX增强"
},{
    reg:/Enhanced/g,
    value :"XboxOneX增强"
},{
    reg:/Game review/g,
    value :"游戏测评"
},{
    reg:/Hot Game/g,
    value :"热门游戏"
},{
    reg:/Event/g,
    value :"社区活动"
},{
    reg:/Sale/g,
    value :"折扣"
},{
    reg:/Giveaway in stream/g,
    value :"直播奖品"
},{
    reg:/Stream/g,
    value :"直播"
},{
    reg:/Sponsored/g,
    value :"赞助"
},{
    reg:/days remaining/g,
    value :"天后结束"
},{
    reg:/TrueAchievements Podcast/g,
    value :"TA Podcast"
},{
    reg:/Contest/g,
    value :"比赛"
},{
    reg:/Best of/g,
    value :"最好的游戏"
},{
    reg:/Announcement/g,
    value :"公告"
},{
    reg:/Op-Ed/g,
    value :"专栏文章"
},{
    reg:/Site news/g,
    value :"网站新闻"
},{
    reg:/Site Help/g,
    value :"网站帮助"
},{
    reg:/Site help/g,
    value :"网站帮助"
},{
    reg:/Free with premium/g,
    value :"金会员折扣"
},{
    reg:/Release Date/g,
    value :"发布日期"
},{
    reg:/Release/g,
    value :"新发布"
},{
    reg:/Game Preview/g,
    value :"游戏预览"
},{
    reg:/Preview Program/g,
    value :"预览计划"
},{
    reg:/New releases/g,
    value :"新版本"
},{
    reg:/Achievement spotlights/g,
    value :"成就焦点"
},{
    reg:/Achievement spotlight/g,
    value :"成就焦点"
},{
    reg:/Spotlight/g,
    value :"焦点"
},{
    reg:/GWG/g,
    value :"金会员折扣"
},{

    //==========系统提示
    reg:/is celebrating their/g,
    value :"来到TA已经"
},{
    reg:/-year anniversary of joining TrueAchievements.com/g,
    value :"年了"
},{
    //==========操蛋的游戏
    reg:/Games/g,
    value :"游戏"
},{
    //==========我的
    reg:/My /g,
    value :"我的"
},{
    //==========版本
    reg:/CN/g,
    value :"国行版"
},{
    reg:/JP/g,
    value :"日版"
},{
    reg:/iOS/g,
    value :"IOS版"
},{
    reg:/Win 8/g,
    value :"W8版"
},{
    reg:/PC/g,
    value :"PC版"
},{
    reg:/WP/g,
    value :"WP版"
},{
    reg:/Win 10/g,
    value :"W10版"
},{
    reg:/Unreleased/g,
    value :"未发售"
},{
    //==========操蛋的搜索
    reg:/Search网站/g,
    value :"站内搜索"
}
         ]
test.forEach(item=>{
    htmlstr=htmlstr. replace (item. reg, item. value);
})
document.getElementsByTagName('body')[0].innerHTML=htmlstr;
//==================================================汉化版权==================================================
(function(){
    'use s triot'
    var footer_people=$('#footer_people');
    if (footer_people.length==1){
        $($('p','#footer_people')[1]).before("<p>TA汉化版由Xbox-Help制作</p>")
        $($('p','#footer_people')[2]).after("<p>汉化版本：" +GM.info.script.version+"</p> ")
        $('head').append('<style>#footer_people p {margin-bottom: 0} </style>')
    }
})();
//==================================================强制新标签==================================================
document.body.addEventListener('mousedown', function (e) {
    e.target.target = '_blank';
    e.target.parentNode.target='_blank';
    e.target.parentNode.parentNode.target='_blank';
    e.target.parentNode.parentNode.parentNode.target='_blank';
    e.target.parentNode.parentNode.parentNode.parentNode.target='_blank';
})