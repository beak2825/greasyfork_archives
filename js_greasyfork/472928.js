// ==UserScript==
// @name         【广告去除】游戏网站
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  去除一些游戏攻略、资讯网站的广告
// @author       You
// @match        *://*.17173.com/*
// @match        *://*.gamersky.com/*
// @match        *://*.ali213.net/*
// @match        *://*.fhyx.hk/*
// @match        *://*.fhyx.com/*
// @match        *://*.3dmgame.com/*
// @match        *://*.9game.cn/*
// @match        *://*.178.com/*
// @match        *://18183.com/*
// @match        *://*.18183.com/*
// @match        *://*.18183.cn/*
// @match        *://games.sina.com.cn/*
// @match        *://*.97973.com/*
// @match        *://*.163.com/game/*
// @match        *://ds.163.com/*
// @match        *://play.163.com/*
// @match        *://*.nbegame.com/*
// @match        *://*.a9vg.com/*
// @match        *://*.yzz.cn/*
// @match        *://*.gamedog.cn/*
// @match        *://*.52pk.com/*
// @match        *://*.4399.cn/*
// @match        *://*.4399.com/*
// @match        *://*.zhibo8.com/*
// @match        *://*.duotegame.com/*
// @match        *://*.duote.com/*
// @match        *://*.doyo.cn/*
// @match        *://*.yxdown.com/*
// @match        *://*.diyiyou.com/*
// @match        *://*.9k9k.com/*
// @match        *://*.3h3.com/*
// @match        *://*.ucg.cn/*
// @match        *://*.tgbus.com/*
// @match        *://*.uuu9.com/*
// @match        *://game.xiaomi.com/*
// @match        *://*.97973.com/*
// @match        *://*.anqu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=17173.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472928/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E6%B8%B8%E6%88%8F%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/472928/%E3%80%90%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E3%80%91%E6%B8%B8%E6%88%8F%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==


/* 2.2更新内容
增加3DM、游侠网、17173、游民星空匹配规则
修改了运行逻辑

2.3更新内容
修改了背景替换次数限制
新增逗游网、游迅网、第一手游网、9K9K、当游网、UCG适配
增加游侠网、17173、18183、游民星空匹配规则

2.4更新内容
新增178、电玩巴士、游久网、凤凰游戏适配
增加17173、游侠网匹配规则

2.5更新内容
新增小米游戏中心适配
增加游侠网、游久网匹配规则
*/

(function() {
    'use strict';

    //*************************************************************************************
    //----------------------------------------广告匹配规则
    //*************************************************************************************
    var url = window.location.href;
    var domain = document.domain;
    var pathSegment = window.location.pathname.split('/')[1]

    var names = [];

    //******************
    //---------17173
    //******************
    if (domain.includes('17173.com')) {
        console.log('[广告去除] 17173');
        //'anything'
        names = [
            ['style','position:absolute;z-index:2;top:41px;left:-99px;width:180px;height:470px;overflow:hidden;'],//左上悬浮广告拥有的StyleText
            ['id','finalTuijian'],//新版页面左侧夹杂广告拥有的Id

            ['class','fullmedia-video-wrap'],//悬浮广告拥有的Class
            ['class','righttop-window-recycle'],//悬浮广告拥有的Class
            ['class','righttop-window-video-wrap'],//悬浮广告拥有的Class
            ['class','fullmedia-recycle'],//左上悬浮广告拥有的Class
            ['class','video-box'],//多媒体视窗广告拥有的Class
            ['class','mod-17173app-qrcode'],//右侧APP广告拥有的Class
            ['class',/\bpn\b.*\bpn-tg-avatar\b.*\bad17173carouse[l]{0,1}[0-9]{0,2}\b/],//图片轮播广告拥有的Class
            ['class','pn1 pn-tg pn-tg-bevel'],//一行两列推广广告拥有的Class
            ['class','pn pn-tg ad17173Corner1 classNameTrackModule'],//一行两列推广广告拥有的Class
            ['class','pn pn-tg adnewgameindexbanner2'],//分隔栏广告拥有的Class
            ['class','pn pn-tg ad17173indexbanner3 classNameTrackModule'],//分隔栏广告拥有的Class
            ['class','pn pn-tg ad17173indexBottomBanner1 classNameTrackModule'],//分隔栏广告拥有的Class
            ['class','Classpn pn-rss Ad17173Banner2'],//分隔栏广告拥有的Class
            ['class','pn pn-rss Ad17173Banner2'],//分隔栏广告拥有的Class
            ['class','forsetLink9'],//右侧页游广告拥有的Class
            ['class','gb-final-comm-case gb-final-pn-star-col'],//右侧页游广告拥有的Class
            ['class',/\bmod-tg\b.*\bad-v-daka-7\b.*\bad17173WenziTuijian[0-9]{0,1}\b.*\bclassNameTrackModule\b/],//底部游戏下载中的广告拥有的Class
            ['class','adnewsfinalbanner1'],//新版切旧版顶部通栏广告拥有的Class
            ['class','gb-hao gb-hao-float-widget gb-hao-float-widget-official'],//新版切旧版右侧悬浮下载广告拥有的Class
            ['class','tg-right-btn'],//新版切旧版右侧图片广告拥有的Class
            ['class','gb-final-comm-case gb-final-pn-wan forsetLink13'],//新版切旧版右侧网游广告拥有的Class
            ['class','gb-final-comm-case classNameTrackModule'],//新版切旧版底部小姐姐视频广告拥有的Class
            ['class','gb-final-comm-case1 gb-final-mod-recomm forsetLink21 xwtj'],//新版切旧版底部新闻推荐/新网游广告拥有的Class

            ['class','adnewsfinaltopbanner'],//新版页面顶部横幅广告拥有的Class
            ['class','gb-final-news-item-ad'],//新版页面左侧夹杂广告拥有的Class
            ['class','fix-app'],//右上悬浮APP广告拥有的Class
            ['class','remm-box adhaotoprightbanner'],//右上顶部APP广告拥有的Class

            //https://newgame.17173.com/viewpic.htm?url=//i.17173cdn.com/2fhnvk/YWxqaGBf/cms3/uumwKrbrhzkqyCs.jpg
            ['class','tj'],//图片底部广告

            ['class','mod-final-app-tg'],//文章底部APP广告

            ['class',/\bad-[0-9]{2,3}-[0-9]{2,3} adnewgamefinalbutton\b/],//右侧游戏
            ['class','mod-hj'],//右侧游戏
            ['data-oms-cid','anything'],//右侧广告
            ['data-oms-mid','anything'],//右侧广告

            ['class','gb-follow gb-follow-popup-wrap'],//右下“关注该游戏”
            ['id','gbFollowPopupWrap_rl'],//右下“关注该游戏”
        ];
    }


    //******************
    //---------游民星空
    //******************
    else if (domain.includes('gamersky.com')) {
        console.log('[广告去除] 游民星空');
        names = [
            ['id','ADcover'],//顶层悬浮倒计时广告拥有的Id
            ['class','alik app'],//右上APP
            //adscontainer_background_back_index1100_all
            //['id',/\bgsBackgroundId[0-9]{12,13}\b/],//文章背景广告Id，例：gsBackgroundId511953469937
            //new_top_allsite_970_2
            ['id',/\bnew_top_allsite_[0-9]{3,4}_[0-9]{1}\b/],//文章标题下广告Id
            ['id',/\btop_pd_[0-9]{3,4}_[0-9]{1}\b/],//文章标题下广告Id
            ['id',/\badscontainer_block_[0-9]{3}_[0-9]{1}\b/],//右侧底部图片广告拥有的Id
            //adscontainer_block_300_4
            ['id','new_page_allsite_620'],//文章底部广告Id

            ['id',/\badscontainer_banner_new_top_index_[0-9_]{6}\b/],//通栏广告，例：adscontainer_banner_new_top_index_1060_2
            ['id',/\badscontainer_banner_new_second_index_[0-9]{4}\b/],//通栏广告，例：adscontainer_banner_new_second_index_1060
            ['id',/\badscontainer_background_back_index[0-9]{4}_all\b/],//背景广告


            //['class','bgAdWrap'],//背景图片广告拥有的Class
            ['class','gsBackgroundLeft'],//背景图片广告左
            ['class','gsBackgroundRight'],//背景图片广告右
            //['class','adscontainer_background_back_index1100_all'],//背景图片广告拥有的Class
            ['class','advert'],//顶部右侧活动广告拥有的Class
            ['class','box-shadow'],//标题下方广告拥有的Class
            ['class','ad_r'],//右侧动图广告拥有的Class
            ['class','fixedCode'],//右侧APP广告拥有的Class
            ['class','Midtit yyggtit lxyygg'],//右侧游戏广告拥有的Class
            ['class','yyimg'],//右侧游戏广告拥有的Class

            ['class','gs_ccs_appdown'],//文章底部APP广告拥有的Class

            ['id','common_down_news'],//“折扣下载”广告
        ];
    }


    //******************
    //---------游侠网
    //******************
    else if (domain.includes('ali213.net')) {
        console.log('[广告去除] 游侠网');
        names = [
            //游侠图库（pic.ali213.net）
            ['style','width:980px;height:auto;overflow:hidden;margin:0px auto 10px auto;'],//底部多图广告StyleText

            //游侠攻略（例：https://gl.ali213.net/html/2023-8/1114539_2.html）
            ['style','width:100%;margin-bottom:20px;background:#fff;box-sizing: border-box;border-radius:10px;box-shadow:0px 2px 9px 0px rgba(211, 211, 211, 0.6);'],//右侧广告StyleText
            ['style','position:relative;display:block;'],//右侧广告StyleText
            ['class','t1c_app'],//APP广告

            ['id',/\bali-ad-js-[0-9]{1,2}\b/],//图片广告Id

            //游侠攻略（例：https://gl.ali213.net/html/2023-8/1114539_2.html）
            ['id','ali_gl_detail_top_ad'],//顶部横幅广告Id

            ['class','alertbox'],//顶层悬浮广告Class
            ['class','ali-index-bg'],//背景图片广告Class
            ['class','s-bg'],//标题下方广告拥有的Class
            ['class','box-shadow'],//标题下方广告拥有的Class
            ['class','ag300 box-shadow-right'],//右侧图片广告Class
            ['class','s1-r-img'],//右侧图片广告Class
            ['class',/\bag300\b.*\bmt[0-9]{1,2}\b.*\bbox-shadow-right\b/],//右侧图片广告Class
            ['class','fengxiang box-shadow'],//底部分享、APP广告Class
            ['class','go-lb'],//底部滚动文字广告Class
            ['class','share-container'],//底部分享、APP广告Class

            //游侠图库（pic.ali213.net）
            ['class','daohang'],//顶部导航栏广告Class

            //游侠攻略（例：https://gl.ali213.net/html/2023-8/1114539_2.html）
            ['class','gltopg'],//顶部横幅广告Class
            ['class','share-container fengxiang'],//底部分享、APP广告Class

            //游侠攻略（例：https://gl.ali213.net/z/8446/）
            ['class','glzj_infob_ltt'],//左侧菜单栏底部APP二维码广告Class

            //（例：https://m.ali213.net/news/gl/）
            ['class','glzjll_r_libao'],//右侧“热门游戏礼包”广告Class

            //（例：https://m.ali213.net/news/）
            ['class','newslist_body_info_right_b'],//右侧“热门软件”广告Class

            //（例：https://gl.ali213.net/html/2023-8/1114425.html）
            ['class','ali-kx'],//页面底部悬浮“快讯”广告Class

            //游侠下载（例：https://down.ali213.net/pcgame/baldurgate3.html）
            ['class','nyfmt'],//页面右下角悬浮广告
            ['class','detail_game_r box202'],//右侧图片广告
            ['class','common_down_r box339'],//资源地址右侧图片广告
            ['class','detail_game_l_r_down_r2 box510'],//右侧“正版下载”广告

            ['id','ali_comment_desc'],//“注册登录游侠会员评论可获得现金红包奖励，还可获得等级积分领取限定头像框！”
            ['class','ali-comment-no'],//“还没有评论内容，快来抢沙发吧！”
            ['id','ali_comment_if_content'],//“还没有评论内容，快来抢沙发吧！”

            //游侠论坛（例：https://game.ali213.net/thread-6899402-1-1.html）
            ['id','hd_ad'],//头图广告
            ['href',/\bhttps?:\/\/click.ali213.net\/ALiClick-[0-9]{1,3}.html\b/],//顶部广告.http://click.ali213.net/ALiClick-118.html
            ['class','plc plm'],//夹杂广告

            ['id','tmp_ggao'],//“评论得红包”
            ['class','news_app'],//底部APP
            ['id',/\bnews_show[0-9]{1}\b/],//底部推荐夹杂
            ['class',/\bnews_list[0-9]{1}\b/],//底部推荐夹杂
            ['class','go-index'],//“更多精彩内容”

            //https://m.ali213.net/sgyxsy/
            ['class','xiawanbox'],//左侧APP

        ];
    }


    //******************
    //---------凤凰游戏
    //******************.match(/(news|finance).sina.com.cn/)
    else if (domain.match(/fhyx.(hk|com)/)) {
        console.log('[广告去除] 凤凰游戏');
        names = [
            ['class','adviste_body'],//全站弹窗

            ['class','products_top_t_r'],//顶部抽奖

            ['class','fhyxIndexMenuLi downAPP'],//右侧APP
            ['class','fhyxIndexMenuLi hoverEwm'],//右侧群
            ['class','fhyxIndexMenuLi indexCreditSign'],//右侧签到
            //href="/zt/app/?appdown=details"
            ['href','/zt/app/?appdown=details'],//右侧APP，href="/zt/app/?appdown=details"
            ['class','appdown_detail_alert'],//右侧APP弹窗
            ['class','products_right_menu_li hoverEwm'],//右侧群

            ['class','detail_tg'],//底部通栏
        ];
    }

    //******************
    //---------3DM
    //******************
    else if (domain.includes('3dmgame.com')) {
        console.log('[广告去除] 3DM');
        names = [

            ['style','z-index:2147483648;'],//右下角弹窗图片广告StyleText
            ['style','display: block; padding: 0px; margin: 0px; z-index:2147483648; position: fixed; right: 0px; bottom: auto; left: auto; bottom: 0px; width: 320px; height: 270px;'],//
            ['title','动力广告'],//
            ['class','warp_gou mg_bt30'],//
            ['style','display: block; padding: 0px; margin: 0px; z-index:2147483648; position: fixed; right: 0px; bottom: auto; left: auto; bottom:1px; width: 320px; height: 270px;'],//右下角弹窗图片广告StyleText
            ['style','width: 100%;display: block;margin-top: 20px;'],//下方APP广告StyleText
            ['style','width: 1160px;overflow: hidden; margin-top: 20px;position: relative;'],//下方横幅广告StyleText
            ['style','width: 785px;overflow: hidden;position: relative;'],//下方横幅广告StyleText

            //3DM下载（例：https://dl.3dmgame.com/patch/172845.html）
            ['id','jz'],//全屏悬浮
            ['class',/\b[a-z]{6,9} tab sss\b/],//假下载，dglwtv tab sss
            ['style','width:274px;height:368px; overflow: hidden;float:right;position: relative;'],//下方资源下载右侧图片广告StyleText
            //['class',/\b[a-z]{6,9}2\b/],//下载下方通栏,dglwtv2

            //['id','index_bg_box'],//背景图片广告Id
            ['id','note'],//右下角弹窗图片广告Id

            ['class','close_btn'],//背景图片广告关闭按钮
            //['class','index_bg_box'],//背景图片广告Class
            //href="http://www.baidu.com/cb.php?c=IgF_pyfqnHmzn1b4njb0IZ0qnfK9ujY1Pj0YPH6L0Aw-5HnsnWbvPWR0TAq15HR3PWm3PHb0T1YkmyN-PhD1uhD3uH04PWT10AwY5HDvrHczPW6sPH00IgF_5y9YIZK1rBtEXg68nvwVuv7Vui4WUvYEXgbETM9hTzq9u0KzujYkn0KBUHYk0ZKz5H00Iy-b5HczPWf4P1T0Uv-b5HbYnHfd0APGujYYrHcsnfKEIv3qn0KsXHY1nj60mLFW5HDdn1n"
            ['href',/\bhttps?:\/\/www.baidu.com\/cb.php\?c=[^ ]*\b/],//背景图片广告
            ['class','Indexadd-100'],//主页横幅图片广告Class
            ['class','addapp'],//顶部APP广告Class
            ['class','Tonglan_785'],//标题下方横幅图片广告Class
            ['class','R_qingtianzhu'],//右侧顶部广告Class
            ['class','R_fangkuai'],//右侧底部广告Class
            ['class','dj_warp_e mg_bt30'],//右侧自营游戏广告Class
            ['style','display: block; padding: 0px; margin: 0px; z-index:2147483648; position: fixed; right: 0px; bottom: auto; left: auto; bottom: 1px; width: 320px; height: 270px;'],//右下角弹窗图片广告StyleText
            ['name',/\biframe[0-9]{7}_[0-9]{1}\b/],//顶部通栏广告

            //3DM下载（例：https://dl.3dmgame.com/patch/172845.html）
            ['class','patchshow'],//“推荐下载”广告Class

            //3DM下载（例：https://www.3dmgame.com/games/bg3/）
            //href="https://app.chuangmengsy.xyz/api/3dm/get_game_url.php?page_id=135829&m=25&s=1"
            ['href',/\bhttps?:\/\/[^ ]*api\/3dm\/get_game_url.php\b/],//购买广告
            //href="https://www.3dmgame.hk/game/1005.html"
            ['href',/\bhttps?:\/\/www.3dmgame[^ ]*\/game\/[^ ]*html\b/],//购买广告
        ];
    }


    //******************
    //---------九游
    //******************
    else if (domain.includes('9game.cn')) {
        console.log('[广告去除] 九游');
        names = [
            ['data-portal-explore','anything'],//文章中加速器广告Style
            ['id',/\barticleLittleBox[0-9]{1}\b/],//文章中夹杂

            ['class','ntop-banner'],//文章上方APP广告Class
            ['class','guide-app-fix'],//下方APP广告Class
            ['class','nbot-banner'],//文章下方APP广告Class
            ['class','box-con hot-game'],//文章下方热门游戏广告Class
            ['class','box-con other-games'],//文章下方其他游戏广告Class
            ['class','box-con gift-con'],//文章右侧游戏礼包广告Class

            ['class','ngame-book'],//文章标题右侧APP二维码广告Class
            ['class','ngame-qrcode'],//文章右侧APP二维码广告Class
            ['class','ngame-btns'],//文章右侧APP加速器下载广告Class
            ['class','box-con right-like'],//文章右侧猜你喜欢广告Class
            ['class','banner-adv'],//顶部通栏广告
        ];
    }

    //******************
    //---------178
    //******************
    else if (domain.includes('178.com')) {
        console.log('[广告去除] 178');
        names = [
            ['class','ui-adv'],//通栏广告
            ['id','ad-banner'],//通栏广告
            ['ad-id','anything'],//通栏广告

        ];
    }


    //******************
    //---------18183
    //******************
    else if (domain.includes('18183.com') || domain.includes('18183.cn')) {
        console.log('[广告去除] 18183');
        names = [
            ['class',/\bad[0-9]{1,2}\b/],//右侧广告Class
            ['class','ad_right'],//文章右侧广告Class
            ['class','ad_side'],//右下悬浮广告
            ['class','slider_ad'],//边栏广告
            ['class','side-scroBox-v3'],//文章扫码广告Class
            ['class',/\bdownload-block-[0-9]{6}\b/],//web顶部广告Class
            ['class','cntop_frame'],//顶部通栏广告

            ['src',/\b.*img.18183.com.*uploads.*allimg[0-9A-Za-z-/]{26}.png\b/],//底部二维码，src="//img.18183.com/uploads/allimg/220628/237-22062Q00352439.png"

        ];
    }


    //******************
    //---------新浪游戏
    //******************
    else if (domain.includes('games.sina') || domain.includes('97973.com')) {
        console.log('[广告去除] 新浪游戏');
        names = [
            ['data-ad-pdps','anything'],//部分广告Style

            ['style','padding-bottom:45px;'],//右侧图片广告StyleText

            ['id','rightad'],//左下弹窗广告Id
            ['id','leftFlashDiv'],//左下活动弹窗广告Id

            ['class','headad'],//头部广告Class
            ['class','apppop'],//左下公众号扫码广告Class
            ['class','Pop-ups'],//左下弹窗广告Class
            ['class','downPart'],//底部APP广告Class
        ];
    }


    //******************
    //---------网易游戏频道（163.com/game）
    //******************
    else if (domain.includes('163.com') && pathSegment === 'game') {
        console.log('[广告去除] 网易游戏频道（163.com/game）');
        names = [
            ['ad-location','anything'],//文章夹杂广告Style
            ['ad-position','anything'],//文章夹杂广告Style
            ['ad-category','anything'],//文章夹杂广告Style
            ['adtype','anything'],//文章夹杂广告Style

            ['id','fixed_ad'],//首页右侧广告Id

            ['class','js_N_navSelect ntes-nav-select c-fl'],//底部网易新闻APP广告Class
            ['class','ad_module'],//右侧广告Class
            ['class','newsapp-qrcode'],//右侧APP广告Class
            ['class','post_columnad_mid'],//文章底部广告Class
            ['class','at_item post_recommend_new post_recommend_ad'],//文章底部推荐文章中伪装文章广告Class
            ['class','at_item info_ad_item clearfix mod_js_ad news_article'],//首页文章底部伪装文章广告Class
            ['class','post_area post_columnad_btm'],//文章最底部多图广告Class
            ['class','rg_ad mb20 mod_js_ad'],//首页右侧广告Class
            ['class',/\barea\b.*\bbottomad\b.*\bchannel_relative_20[0-9]{2}\b/],//首页底部广告Class
            ['class','sidebar_qrcode'],//首页右下角回顶上方网易新闻广告Class
        ];
    }


    //******************
    //---------网易游戏频道（play.163.com）
    //******************
    else if (domain.includes('play.163.com')) {
        console.log('[广告去除] 网易游戏频道（play.163.com）');
        console.log('[广告去除] 笑死，转了一圈没发现一个广告');
        names = [

        ];
    }


    //******************
    //---------网易大神
    //******************
    else if (domain.includes('ds.163.com')) {
        console.log('[广告去除] 网易大神');
        names = [
            ['class','c-login-popup enter'],//右下角登录提示Class
            ['class','c-frame c-frame--part c-frame-banner'],//底部APP横幅广告Class
            //['class','mb-12 c-download-wrap'],//右下角APP广告Class
        ];
    }


    //******************
    //---------nbegame.com
    //******************
    else if (domain.includes('nbegame.com')) {
        console.log('[广告去除] NBE攻略');
        names = [
            ['class','widget widget-tie zanzhu2'],//右侧APP广告Class

        ];
    }


    //******************
    //---------A9VG电玩部落
    //******************
    else if (domain.includes('a9vg.com')) {
        console.log('[广告去除] A9VG电玩部落');
        names = [
            ['id','guide-download'],//底部横幅广告Id

            //A9VG论坛（例：https://bbs.a9vg.com/thread-8930434-1-1.html）
            ['id','qrcode'],//右下APP二维码广告Id
            ['id','layer'],//右下APP二维码广告Id

            //A9VG论坛（例：https://bbs.a9vg.com/forum-278-1.html）
            ['id',/\bSG_GG_CONTAINER_[0-9]{6}\b/],//帖子间横幅广告Id，例：SG_GG_CONTAINER_200822

            ['class','vd-flexbox a9a-ad'],//右侧图片广告Class
            ['class','a9-guide-download'],//底部横幅广告Class
            ['class','vd-flexbox vdp-flex_1'],//底部APP二维码广告Class

            //A9VG论坛（例：https://bbs.a9vg.com/thread-8930434-1-1.html）
            ['class','a_mu'],//顶部通栏横幅广告Class
            ['class','qrcode'],//右下APP二维码广告Class
            ['class','layer'],//右下APP二维码广告Class
        ];
    }


    //******************
    //---------叶子猪
    //******************
    else if (domain.includes('yzz.cn')) {
        console.log('[广告去除] 叶子猪');
        names = [
            ['id','wrap_terminal'],//右下悬浮窗广告
            ['class','ad-s2'],//顶部通栏广告
            ['id','ad_t_banner1_b'],//顶部通栏广告
            ['id','ad_t_bl_b'],//顶部小通栏左广告
            ['id','ad_t_br_b'],//顶部小通栏右广告
        ];
    }


    //******************
    //---------游戏狗
    //******************
    else if (domain.includes('gamedog.cn')) {
        console.log('[广告去除] 游戏狗');
        names = [
            ['class','ads_c1'],//顶部"大家都在玩"广告
            ['id','index_bg_box'],//背景图片广告
            ['class','index_bg_box'],//背景图片广告
            ['class','guanggao1'],//右侧图片广告
            ['class',/\blianyun[0-9]{0,1}\b/],//文章底部图片广告
        ];
    }


    //******************
    //---------52PK
    //******************
    else if (domain.includes('52pk.com')) {
        console.log('[广告去除] 52PK');
        names = [
            ['class',/\bIframeId[0-9]{6}\b/],//Iframe图片广告
            ['frameborder','0'],//两侧lowB悬浮图片广告
        ];
    }


    //******************
    //---------4399
    //******************
    else if (domain.includes('4399')) {
        console.log('[广告去除] 4399');
        names = [
            //['class','f-section'],//背景图片广告左
            ['class','f-propleft'],//背景图片广告左
            ['class','f-propright'],//背景图片广告右
            ['href','http://app.4399.cn/'],//顶部右侧APP广告
            ['class','hdbanner'],//顶部广告
            ['id',/\bshouyou_banner_[0-9]{2}\b/],//顶部广告
            ['class','proarea'],//右侧APP广告
            ['frameborder','0'],//两侧lowB悬浮图片广告
            ['class','amouban aleftban'],//左侧悬浮图片广告
            ['class','amouban arightban'],//左侧悬浮图片广告
            ['class','ban1'],//右侧APP广告
            ['class','ad_home'],//右下角悬浮图片广告
            ['id','j-ad_home'],//右下角悬浮图片广告
            ['class','bglink'],//背景图片链接

            ['id','bottom_bd'],//底部
        ];
    }


    //******************
    //---------直播吧
    //******************
    else if (domain.includes('zhibo8.com')) {
        console.log('[广告去除] 直播吧');
        names = [
            ['id','siderbar'],//右侧推广位
            ['class','advertframe'],//底部推广位，推广位名称:内页底部横幅 类型：固定 尺寸：700x90
            ['id',/\biframeu[0-9]{7}_[0-9]{1}\b/],//夹杂推广位
        ];
    }


    //******************
    //---------多特游戏
    //******************
    else if (domain.includes('duotegame.com') || domain.includes('duote.com')) {
        console.log('[广告去除] 多特游戏');
        names = [
            ['class','shopGoBtn'],//顶部推广位
            ['class','pic-bannerA clearfix'],//顶部推广位
            ['href',/\bhttps?:\/\/[^ ]*\?comefrm=dtsybj\b/],//背景链接，例：href="http://gm.wy213.com/yscq_alilt.html?comefrm=dtsybj"

            ['class','duote_bottom_fix_img_box'],//右下悬浮
        ];
    }


    //******************
    //---------逗游
    //******************
    else if (domain.includes('doyo.cn')) {
        console.log('[广告去除] 逗游');
        names = [
            ['frameborder','anything'],//一切嵌入内容
            ['class',/\bIframeId[0-9]{6}\b/],//嵌入内容
        ];
    }


    //******************
    //---------游迅网
    //******************
    else if (domain.includes('yxdown.com')) {
        console.log('[广告去除] 游迅网');
        names = [
            ['class','news_tl'],//顶部
            ['class','r_b_fmt'],//右下悬浮
        ];
    }


    //******************
    //---------第一手游网
    //******************
    else if (domain.includes('diyiyou.com')) {
        console.log('[广告去除] 第一手游网');
        names = [
            ['class',/\bIframeId[0-9]{6}\b/],//嵌入内容
        ];
    }


    //******************
    //---------9K9K
    //******************
    else if (domain.includes('9k9k.com')) {
        console.log('[广告去除] 9K9K');
        names = [
            ['style','width:468px;height:60px;position:absolute;left:436px;top:20px;'],//顶部
            ['class','ad'],//右侧
            ['class',/\bIframeId[0-9]{6}\b/],//嵌入内容
        ];
    }


    //******************
    //---------当游网
    //******************
    else if (domain.includes('3h3.com')) {
        console.log('[广告去除] 当游网');
        names = [
            //iframeu6769741_0
            ['name',/\biframe[a-z]{1}[0-9]{7}_[0-9]{1}\b/],//嵌入内容
            ['class',/\biframe[a-z]{1}[0-9]{7}_[0-9]{1}\b/],//嵌入内容
            ['class','m-highspeed'],//下载广告
        ];
    }


    //******************
    //---------UCG
    //******************
    else if (domain.includes('ucg.cn')) {
        console.log('[广告去除] UCG');
        names = [
            ['ctype','area'],//右侧二维码
            ['id','smv_tem_14_46'],//右侧二维码下文字
        ];
    }


    //******************
    //---------电玩巴士
    //******************
    else if (domain.includes('tgbus.com')) {
        console.log('[广告去除] 电玩巴士');
        names = [
            ['id','guide-download'],//底部悬浮
            ['class','guide-download'],//底部悬浮
            ['id',/\bad_column-[0-9]{4}\b/],//右侧广告
            ['class','ad__column'],//右侧广告
        ];
    }


    //******************
    //---------游久网
    //******************
    else if (domain.includes('uuu9.com')) {
        console.log('[广告去除] 游久网');
        names = [
            ['id','top'],//底部通栏
            ['class',/\bmt[0-9]{2} clearfix\b/],//文中通栏
            ['id','mainboxad'],//中央悬浮
            ['class','footer'],//右下关闭
            ['id',/\bUUU9_CREATIVESHOWDIVTYPE_[0-9]{2,3}\b/],//顶部、右侧，UUU9_CREATIVESHOWDIVTYPE_106

        ];
    }


    //******************
    //---------小米游戏中心
    //******************
    //https://game.xiaomi.com/viewpoint/1127866428_1606524121472_16
    else if (domain.includes('game.xiaomi.com')) {
        console.log('[广告去除] 小米游戏中心');
        names = [
            ['class','banner banner-desktop'],//底部通栏
            ['class','monitor-panel'],//右侧


        ];
    }

    //******************
    //---------97973手游网
    //******************
    else if (domain.includes('97973.com')) {
        console.log('[广告去除] 97973手游网');
        names = [
            ['id','botmsilder'],//顶部、底部通栏


        ];
    }

    //******************
    //---------安趣网
    //******************
    else if (domain.includes('anqu.com')) {
        console.log('[广告去除] 安趣网');
        names = [
            ['class','top-gg'],//文章页全站通栏
            ['class','anqu-ewm'],//文章底部二维码


        ];
    }


















    //*************************************************************************************
    //----------------------------------------广告去除函数
    //*************************************************************************************
    function delAd(names) {
        if (names.length) {
            var flag = false;

            for (var name of names) {

                var tagType = name[0];
                var value = name[1];

                var elements = [];

                //属性内容正则
                if (value instanceof RegExp) {
                    var elementsZero = document.querySelectorAll(`[${tagType}]`);
                    elements = Array.from(elementsZero).filter(element => value.test(element.getAttribute(tagType)));
                }
                //只要存在属性
                else if (value === 'anything'){
                    elements = document.querySelectorAll(`[${tagType}]`);
                }
                //其他正常情况
                else{
                    elements = document.querySelectorAll(`[${tagType}="${value}"]`);
                }

                if (elements && elements.length) {
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
                    console.log(`[广告去除] ${name} 元素移除成功！`);
                    flag = true;
                } else {
                    //console.log(`[广告去除] 未发现 ${name} 元素！`);
                }
            }

            if (!flag) {
                //console.log("[广告去除] 未发现要移除的元素！");
            }
        } else {
            //console.log("[广告去除] 暂不支持此站点。");
        }
    }



    //*************************************************************************************
    //----------------------------------------广告去除
    //*************************************************************************************
    // 定义要运行的函数
    function runDelAd() {
        delAd(names);
    }

    var counter = 0; // 计数器变量
    var interval = setInterval(function() {
        runDelAd();
        counter++; // 每次执行时计数器加一
        if (counter === 100) { // 在达到指定次数后停止执行
            clearInterval(interval);
        }
    }, 50);

    // 每隔一秒运行一次函数
    setInterval(runDelAd, 1000);


    //*************************************************************************************
    //----------------------------------------更换背景图
    //*************************************************************************************
    function runUpdateBackground() {
        var imgUrl = "https://upload-bbs.miyoushe.com/upload/2023/06/30/73565430/31f7c81a56c66d7aee3e9cd8edab1470_2376050996435043692.png"
        let styleElementTag = "";
        let imgElementTag = "";
        let styleElement = "";
        let styleContent = "";
        let runCount = 0; // 运行次数计数器


        function updateBackgroundFunction() {
            if (styleContent !== ""){
                var modifiedStyleContent = styleContent.replace(/url\(.*?\)/, `url(${imgUrl})`);
                styleElement.innerHTML = modifiedStyleContent;
                styleElementTag = "true";
            }
            else if (styleElement) {
                if (!styleElement.style) {
                    styleElement.setAttribute('style', `background: url(${imgUrl})`);
                    styleElementTag = "true";
                } else {
                    styleElement.style.backgroundImage = `url(${imgUrl})`;
                    styleElementTag = "true";
                }
            }
            else if (imgElementTag !== "") {
                imgElementTag.src = `${imgUrl}`;
                styleElementTag = "true";
            }
            else {
                styleElementTag = "flase";
            }
        }

        function updateBackground() {

            if (domain.includes('3dmgame')) {
                styleElement = document.querySelector("#index_bg_box");
                updateBackgroundFunction();

                console.log('[背景更换] 3dmgame');
            }
            else if (domain.includes('gamersky.com')) {
                styleElement = document.querySelector(".onlyOneBgtgs");
                updateBackgroundFunction();

                console.log('[背景更换] 游民星空');
            }
            else if (domain.includes('4399')) {
                styleElement = document.querySelector('style');
                styleContent = styleElement.innerHTML;
                updateBackgroundFunction();

                console.log('[背景更换] 4399');
            }
            else if (domain.includes('18183')) {
                imgElementTag = document.querySelector("#bgad_wrap > div > a > img")
                updateBackgroundFunction();

                console.log('[背景更换] 18183');
            }
            else if (domain.includes('duotegame')) {
                styleElement = document.querySelector("body > div.ali-index-bg");
                updateBackgroundFunction();

                console.log('[背景更换] 多特游戏');
            }


        }

        function checkStyleElementTag() {
            if (styleElementTag !== "true") {
                updateBackground();
                runCount++; // 每次运行递增计数器

                if (runCount === 20) {
                    clearInterval(intervalId); // 达到20次后清除定时器
                }
            } else {
                clearInterval(intervalId);
            }
        }

        let intervalId = setInterval(checkStyleElementTag, 1000);
    }
    runUpdateBackground()



})();
