// ==UserScript==
// @name         贴吧页面精简
// @namespace    https://greasyfork.org/zh-CN/scripts/23687
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      2.8.0
// @description  【可能是你遇到的最好用的贴吧精简脚本】，去除各种广告及扰眼模块，全面支持各种贴吧页面，免登录看帖，【倒序看帖】
// @author       BackRunner
// @include      *://tieba.baidu.com/*
// @include      *://dq.tieba.com/*
// @include      *://jump2.bdimg.com/*
// @include      *://jump.bdimg.com/*
// @exclude      *://tieba.baidu.com/f/fdir*
// @run-at       document-body
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/23687/%E8%B4%B4%E5%90%A7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/23687/%E8%B4%B4%E5%90%A7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

// ====  Tips =====
// 使用TamperMonkey的用户可以将脚本的加载位置设置为document-start获得更好效果，若出现不生效等错误请还原设置
// 请根据您的需要根据下面代码的注释选择需要隐藏的模块，有不想隐藏的模块可以注释掉那一行代码
// 请根据您的需要与注释调整变量定义内的内容
// 您自行修改的代码会在更新的时候被覆盖，建议您备份您修改的内容
// 遇到问题请立即反馈
// ==== Donate ====
// 如果您觉得本脚本好用可以赞助我一点零花
// donate@backrunner.top (支付宝)
// === 更新日志 ===
// 2020.01.16 - 2.8.0
// 修复问题
// 2018.12.26 - 2.7.15
// 修复Chrome新版本上的兼容问题。
// 2018.10.21 - 2.7.14
// 添加一个域名重定向规则
// 2018.10.13 - 2.7.13
// 更换jQuery的CDN，脚本加载提速
// 修复了一些问题
// ================


(function() {
    //=========================
    //        变量定义
    //=========================
    var sleepTime;
    var sleepTimeWhenPageTurn;
    var reverseSleepTime;
    var postprocess;
    var homePageProcess;
    var groupPageProcess;
    var noLoginProcess;
    var reverse;
    var homeProcess;
    var isHeadimg;
    var checkrate;
    var delayScriptRunTimes;
    var isRedirect;
    var displayLive;
    var displaySign;
    var autoCloseGuide;
    //脚本固定开关
    var isCtrlPanelOn;
    //底部信息div
    var foot;
    var homePageMatch = RegExp("(http|https):\/\/tieba.baidu.com\/(#*$)|(http|https):\/\/tieba.baidu.com\/(index\.html#*$)");
    //=====================
    //以上内容可以修改，请勿修改以下内容
    //=====================
    var startTime = new Date().getTime();
    var finishTime = -1;
    //=========================
    //        主执行区
    //=========================
    //控制台信息
    console.warn('贴吧页面精简: 初始化');
    //初始化
    initialize();
    console.warn('贴吧页面精简: 启动');
    //重定向
    if (isRedirect){
        redirect();
    }
    //css修改
    appendCSS();
    //更新信息
    updateAlert();
    //免登录
    if (noLoginProcess){
        noLogin();
    }
    if (postprocess){
        //惰性脚本执行
        $(document).ready(function(){
            //加载计时
            finishTime = new Date().getTime() - startTime;
            console.log('贴吧页面精简: 页面加载用时: ' + finishTime);
            console.warn('贴吧页面精简: 开始执行惰性脚本');
            //控制面板
            try{
                console.warn('贴吧页面精简: 正在创建控制面板');
                if(isCtrlPanelOn){
                    createControlPanel();
                }
            } catch(e){
                console.error(e);
            }
            //底部信息
            try{
                createFooterLayer();
                addFinishTimeToFooter();
            } catch(e){
                console.error(e);
            }
            //导航栏翻页监听
            addListenerToNav();
            //列表翻页监听
            if (window.location.search.indexOf("kw=")!= -1 && window.location.href.indexOf("search")==-1){
                addListenerToList();
                adinListClean();
                disableForumCard();
                //自动收起指引 *20180509
                closeGuide();
                //弹框关闭 *20181013
                removePopupModal();
                //关注按钮修复 *20200116
                fixFocusButton();
            } else {
                if (window.location.href.indexOf("tieba.baidu.com/p/") != -1){
                    addListenerToPage();
                    tpointADClean();
                    adinPageClean();
                    reverseorder();
                } else {
                    if (window.location.href.indexOf("tieba.baidu.com/group") != -1){
                        console.warn('贴吧页面精简: 当前位于群组页面，不执行群组页面惰性脚本');
                    } else {
                        if (homePageMatch.test(window.location.href)){
                            bindCleanIndexADEvent();
                        } else {
                            console.warn('贴吧页面精简: 页面未适配延迟脚本');
                        }
                    }
                }
            }
        });
        //延迟执行
        setTimeout(function(){
            var interval = setInterval(check,sleepTime * checkrate);
            var n=0;
            function check(){
                var times = n+1;
                console.warn('贴吧页面精简: 延迟脚本正在执行第 ' + times + ' 次');
                //控制面板
                try{
                    console.warn('贴吧页面精简: 正在创建控制面板');
                    if(isCtrlPanelOn){
                        createControlPanel();
                    }
                } catch(e){
                    console.error(e);
                }
                //底部信息
                try{
                    createFooterLayer();
                } catch(e){
                    console.error(e);
                }
                //导航栏翻页监听
                addListenerToNav();
                //列表翻页监听
                if (window.location.search.indexOf("kw=")!= -1 && window.location.href.indexOf("search")==-1){
                    addListenerToList();
                    adinListClean();
                    disableForumCard();
                    //自动收起指引 *20180509
                    closeGuide();
                    //弹框关闭 *20181013
                    removePopupModal();
                    //修复关注按钮 *20200116
                    fixFocusButton();
                } else {
                    if (window.location.href.indexOf("tieba.baidu.com/p/") != -1){
                        addListenerToPage();
                        tpointADClean();
                        adinPageClean();
                        reverseorder();
                    } else {
                        if (homePageMatch.test(window.location.href)){
                            bindCleanIndexADEvent();
                            cleanADinIndex();
                        }
                    }
                }
                reStart();
                function reStart(){
                    n++;
                    if (n>delayScriptRunTimes-1){
                        clearInterval(interval);
                    }
                }
            }
        },sleepTime);
    } else {
        setTimeout(function(){
            var interval = setInterval(check,sleepTime * checkrate);
            var n = 0;
            function check(){
                //控制面板
                try{
                    console.warn('贴吧页面精简: 正在创建控制面板');
                    if(isCtrlPanelOn){
                        createControlPanel();
                    }
                } catch(e){
                    console.error(e);
                }
                //底部信息
                try{
                    createFooterLayer();
                } catch(e){
                    console.error(e);
                }
                n++;
                if (n>delayScriptRunTimes -1){
                    clearInterval(interval);
                }
            }
        });

        $(document).ready(function(){
            //加载计时
            finishTime = new Date().getTime() - startTime;
            console.log('贴吧页面精简: 页面加载用时: ' + finishTime);
            //控制面板
            try{
                console.warn('贴吧页面精简: 正在创建控制面板');
                if(isCtrlPanelOn){
                    createControlPanel();
                }
            } catch(e){
                console.error(e);
            }
            //底部信息
            try{
                createFooterLayer();
                addFinishTimeToFooter();
            } catch(e){
                console.error(e);
            }
        });
        console.warn('贴吧页面精简: 后处理脚本已跳过');
    }
    //=========================

    //=========================
    //功能区 请勿修改下面的内容
    //=========================
    //初始化
    function initialize(){
        sleepTime = initialize_var("sleepTime",300);
        sleepTimeWhenPageTurn = initialize_var("sleepTimeWhenPageTurn",800);
        reverseSleepTime = initialize_var("reverseSleepTime",200);
        postprocess = initialize_var("postprocess",true);
        isRedirect = initialize_var("isRedirect",true);
        homePageProcess = initialize_var("homePageProcess",true);
        groupPageProcess = initialize_var("groupPageProcess",true);
        noLoginProcess = initialize_var("noLoginProcess",true);
        reverse = initialize_var("reverse",false);
        homeProcess = initialize_var("homeProcess",true);
        isHeadimg = initialize_var("isHeadimg",false);
        checkrate = initialize_var("checkrate",1);
        delayScriptRunTimes = initialize_var("delayScriptRunTimes",6);
        displayLive = initialize_var("displayLive",false);
        displaySign = initialize_var("displaySign",false);
        autoCloseGuide = initialize_var("autoCloseGuide",true);
        //固定开关 *20180510
        isCtrlPanelOn = initialize_var("isCtrlPanelOn",true);
    }
    function initialize_var(name,defaultSet){
        var obj = GM_getValue(name,defaultSet);
        if (obj === undefined){
            obj = defaultSet;
        }
        return obj;
    }
    //css修改
    function appendCSS(){
        var cssText = "";
        //顶部直播栏
        cssText += '#video_frs_head {display: none !important;}';
        //右侧会员模块
        cssText += '.celebrity {display: none !important;}';
        //右侧我的应用模块
        cssText += '.my_app {display: none !important;}';
        //热议榜
        cssText += '.topic_list_box {display: none !important;}';
        //广告灰色label
        cssText += '.label_text {display: none !important;}';
        //右边一排图标
        cssText += '.j_icon_slot {display: none !important;}';
        //会员图标（会造成用户名左移，一定程度上影响整体美观）
        //cssText += '.icon_tbworld {display: none !important;}';
        //您可能感兴趣的吧
        cssText += '.forum_recommend {display: none !important;}';
        //右上角应用中心
        cssText += '.u_menu_wrap.u_appcenterEntrance_wrap {display: none !important;}';
        //右上角会员官网
        cssText += '.u_joinvip_wrap.vip_red.j_btn_getmember {display: none !important;}';
        cssText += '.u_joinvip {display: none !important;}';
        //内页顶部banner
        cssText += '.l_banner {display: none !important;}';
        //内页成就section
        cssText += '.achievement_medal_section {display: none !important;}';
        //顶部游戏信息
        cssText += '.game-head-game-info-wrapper {display: none !important;}';
        //内页送礼物按钮
        cssText += '.post-foot-send-gift-btn {display: none !important;}';
        //会员挽尊按钮
        cssText += '.save_face_bg {display: none !important;}';
        cssText += '.save_face_bg_2 {display: none !important;}';
        //底部游戏开测
        cssText += '#duoku_servers_list {display: none !important;}';
        //右侧热门卡包
        cssText += '.u9_aside {display: none !important;}';
        //右侧小说人气榜
        cssText += '.novel-ranking-frs-body {display: none !important;}';
        //头像下面的一排图标
        cssText += '.icon_wrap {display: none !important;}';
        //贴吧触点推广图片（在延迟处理前预处理）
        cssText += '.tpoint-imgs {display: none !important;}';
        //右下角炮筒
        cssText += '.j-firework-sender {display: none !important;}';
        //访谈直播
        if (!displayLive){
            cssText += '.interview {display: none !important;}';
        }
        //贴内相关推荐
        cssText += '.thread_recommend {display: none !important;}';
        //贴内广告
        cssText += '.iframe_wrapper {display: none !important;}';
        //右侧贴吧作者认证
        cssText += '.author-manager {display: none !important;}';
        //输入框placeholder
        cssText += '.tb_poster_placeholder {display: none !important;}';
        //图片签名档
        if (!displaySign){
            cssText += '.j_user_sign {display: none !important;}';
            cssText += '.d_sign_split {display: none !important;}';
        }
        //会员名牌
        cssText += '.pb_nameplate {display: none !important;}';
        //右侧菜单栏精简
        cssText += '.tbui_fbar_props {display: none !important;}';
        cssText += '.tbui_fbar_tsukkomi {display: none !important;}';
        //吧主专版
        cssText += '.tbui_fbar_bazhu {display: none !important;}';
        //右侧可点击广告
        if (window.location.href !== "http://tieba.baidu.com/" && window.location.href !== "https://tieba.baidu.com/"){
            cssText += '.j_click_stats {display: none !important;}';
        }
        //右侧视频推荐
        cssText += '#video_aside {display: none !important;}';
        //一楼电影广告
        cssText += '.tpoint-skin {display: none !important;}';
        //直播页面底部弹出栏
        cssText += '.attention_tip_wrap {display: none !important;}';
        //底部注册/登录横条
        cssText += '.guidance_fc {display: none !important;}';
        //content-ad span
        cssText += '.content-ad {display: none !important;}';
        //head ad span
        cssText += '.head_ad_tag {display: none !important;}';
        cssText += '.head_ad_pop {display: none !important;}';
        //会员置顶bubble
        cssText += '#tb_message_tip_d {display: none !important;}';
        //应用中心nav
        cssText += '.app_forum_top_nav {display: none !important;}';
        cssText += '#j_core_title_wrap {top:0px !important;}';
        //顶栏会员
        cssText += '.u_member {display: none !important;}';
        //导航栏游戏
        cssText += '#j_navtab_game {display: none !important;}';
        //发帖框气泡
        cssText += '.ui_bubble_body {display: none !important;}';
        //礼赞
        cssText += '.gift-goin {display: none !important;}';
        //漂流瓶
        cssText += '.tbui_fbar_nobottle {display: none !important;}';
        //扫描下载APP
        cssText += '.app_download_box {display: none !important;}';
        //某个右侧浮动广告的close按钮
        cssText += '.j_click_close {display: none !important;}';
        //618 Banner
        cssText += '.showBar {display: none !important;}';
        //右上角气泡
        cssText += '.ui_bubble_content {display: none !important}';
        //Hao123
        cssText += '.j_u_menu_extra_url_link {display: none !important}';
        //大家都在搜
        cssText += '.search_back_box {display:none !important}';
        //下载APP
        cssText += '.tbui_fbar_down {display:none !important}';
        //nani
        cssText += '.nani_app_download_box {display:none !important;}';
        //会员菜单
        cssText += '.u_menu_member {display:none !important;}';
        //菜单 *20181012
        cssText += '.u_mytbmall,.u_game,.u_blue{display:none !important;}';

        //群组页面右侧下载
        if (groupPageProcess){
            if (window.location.href.indexOf("tieba.baidu.com/group") != -1){
                cssText += '.right {display: none !important;}';
            }
        }

        //主页模块精简
        if (homePageProcess){
            if (homePageMatch.test(window.location.href)){
                //顶部
                try{
                    if (unsafeWindow.PageData.user.is_login === 1){
                        cssText += '.top-sec {display: none !important;}';
                    }
                } catch (e){
                    console.error('贴吧页面精简: 登录状态检查错误');
                    console.error(e);
                }
                //直播秀
                cssText += '.spage_liveshow_slide {display: none !important;}';
                //以下模块因为在右侧有一个下滑页面时让模块仍然保持在可视区域内的设计，单独精简一个会造成滚动页面时模块错位，所以全部精简
                //乱七八糟的滚动活动模块
                cssText += '#plat_act_wrapper {display: none !important;}';
                //豪友俱乐部
                cssText += '.member_rank {display: none !important;}';
                //媒体进驻
                cssText += '#adide_platform {display: none !important;}';
                //贴吧娱乐
                cssText += '#media_item {display: none !important;}';
                //我的游戏
                cssText += '#spage_game_tab_wrapper {display: none !important;}';
                //公告板
                cssText += '#notice_item {display: none !important;}';
                //调整位置 *20171223
                cssText += '.right-sec {margin-top:-15px !important;}';
                //贴吧精选专题 *20171223
                cssText += '.aggregate_entrance_wrap {display:none !important;}';
                //未登录时的滚动横幅 *20180504
                cssText += '#rec_left {display:none !important;} #rec_right{float:right;position:absolute;right:30px;margin-top:15px;}';
                //用户面板的一些图表等 *20181012
                cssText += '.icon_tbworld {display:none !important;} .user_score{display:none !important;}';
            }
        }

        //个人主页精简
        if (homeProcess){
            if (window.location.href.indexOf("tieba.baidu.com/home") !== -1){
                //右侧礼物面板
                cssText += ".ihome-aside-gift-center {display: none !important}";
                //求婚按钮
                cssText += ".userinfo-marry {display: none !important}";
                //我的夺宝
                cssText += ".ihome-aside-grab-treasure {display: none !important}";
                //我的T豆、蓝钻
                cssText += ".userinfo_scores {display: none !important}";
            }
        }

        //列表页头图精简
        if (window.location.href.indexOf("tieba.baidu.com/f") !== -1){
            if (isHeadimg){
                cssText += ".head_banner_img,.head_ad_pop,.head_banner {display: none !important}";
                //顶部css调整 *20171223
                cssText += '.head_content {padding-top:20px !important}';
                cssText += '.card_banner,.plat_recom_carousel {display:none !important}';
                cssText += '.card_head {width:70px !important;height:70px !important;margin-bottom:10px !important;margin-top:100px !important}';
                cssText += '.card_head_img {width:70px !important;height:70px !important;}';
                cssText += '.card_title {margin-left:-50px !important;}';
                cssText += '.card_slogan {margin-left:-50px !important;}';
            }
        }

        //设置面板css
        cssText += '#backrunnerJSSetting_root {right:0 !important;} #backrunnerJSSetting_con {right:0 !important;width:200px important;}';
        cssText += '#backrunnerJSSetting_con a {display:block !important;white-space:nowrap; !important}';
        cssText += '#backrunnerJSSetting_con li {line-height:23px !important;display:block !important;white-space:nowrap !important;}';
        cssText += '#backrunnerJSSetting_con li a {padding-top:0px !important;padding-bottom:0px !important;padding-right:1em !important;padding-left:1em !important;margin:0 !important;line-height:2.4em !important;}';
        cssText += '.search_nav {margin-right:470px !important;}';

        //reverse相关css *20171223
        cssText += '.br_reverse_li {display:inline-block !important;margin-left:15px !important;margin-top:-14px !important;}';
        cssText += '.core_title_txt {width:400px !important;}';

        //底部信息css
        cssText += '#footer {padding-bottom:0px !important;}';

        console.log('贴吧页面精简: css创建完成');

        var element = document.createElement('link');
        element.rel="stylesheet";
        element.type="text/css";
        element.href='data:text/css,'+cssText;

        document.documentElement.appendChild(element);

        var modStyle = document.querySelector('#modCSS');
        if (modStyle === null){
            modStyle = document.createElement('style');
            modStyle.id = 'modCSS';
            document.body.appendChild(modStyle);
            modStyle.innerHTML = cssText;
        }
        console.log('贴吧页面精简: css已添加');
    }
    //列表翻页监听
    function addListenerToList(){
        $('#frs_list_pager a').each(function(){
            this.addEventListener('click',listPageTurnEvent);
        });
        console.log('贴吧页面精简: 列表翻页监听添加完毕');
    }
    //帖子、精品翻页监听
    function addListenerToNav(){
        $('.nav_list li').each(function(){
            if(this.attributes['data-tab-main'] || this.attributes['data-tab-good']){
                this.getElementsByTagName('a')[0].addEventListener('click',listPageTurnEvent);
            }
        });
    }
    //列表翻页监听事件
    function listPageTurnEvent(){
        console.warn('贴吧页面精简: 列表翻页事件触发');
        setTimeout(function(){
            var interval = setInterval(check,sleepTimeWhenPageTurn * checkrate);
            function check(){
                addListenerToNav();
                addListenerToList();
                adinListClean();
            }
            setTimeout(function(){
                addListenerToNav();
                addListenerToList();
                adinListClean();
            },sleepTime);
            setTimeout(function(){
                addListenerToNav();
                addListenerToList();
                adinListClean();
                clearInterval(interval);
            },finishTime/3);
        },sleepTimeWhenPageTurn);
    }
    function addListenerToPage(){
        $('.l_pager a').each(function(){
            this.addEventListener('click',pageTurnEvent);
        });
        console.log('贴吧页面精简: 帖子翻页监听添加完毕');
    }
    function pageTurnEvent(){
        console.warn('贴吧页面精简: 帖子翻页事件触发');
        setTimeout(function(){
            var interval = setInterval(check,sleepTimeWhenPageTurn * checkrate);
            function check(){
                addListenerToNav();
                addListenerToPage();
                adinPageClean();
                tpointADClean();
                reverseorder();
            }
            setTimeout(function(){
                addListenerToNav();
                addListenerToPage();
                adinPageClean();
                tpointADClean();
                reverseorder();
            },sleepTime);
            setTimeout(function(){
                addListenerToNav();
                addListenerToPage();
                adinPageClean();
                tpointADClean();
                reverseorder();
                clearInterval(interval);
            },finishTime/3);
        },sleepTimeWhenPageTurn);
    }
    //触点推广
    function tpointADClean(){
        console.log('贴吧页面精简: 开始精简触点推广');
        var pointad = document.getElementsByClassName('tpoint-imgs');
        console.log('贴吧页面精简: 抓取到的广告元素数量: '+pointad.length);
        for(var i=0;i<pointad.length;i++){
            pointad[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(pointad[i].parentNode.parentNode.parentNode.parentNode.parentNode);
        }
        console.log('贴吧页面精简: 触点推广精简完毕');
    }

    //列表内广告
    function adinListClean(){
        console.log('贴吧页面精简: 开始精简列表内广告');
        var adinList = document.getElementsByClassName('threadlist_rep_num');
        var num = 0;
        console.log('贴吧页面精简: 列表内元素抓取量: '+adinList.length);
        for (var i=0;i<adinList.length;i++){
            if (adinList[i].title === "广告" || adinList[i].title === "热门"){
                num++;
                adinList[i].parentNode.parentNode.parentNode.parentNode.removeChild(adinList[i].parentNode.parentNode.parentNode);
            }
        }
        console.log('贴吧页面精简: 列表内广告精简完毕，共精简 '+ num + ' 个');
        //新增根据class过滤
        var list = document.getElementById('thread_list').children;
        for (i=0;i<list.length;i++){
            var className=list[i].getAttribute('class');
            if (className != null){
                if (list[i].getAttribute('class').indexOf('thread_top_list_folder')==-1 && list[i].getAttribute('class').indexOf('j_thread_list')==-1){
                    list[i].parentNode.removeChild(list[i]);
                }
            }
        }
        console.log('贴吧页面精简: 扫描列表精简其他广告');
        //清理无用tab *20181012
        var tabs = document.getElementsByClassName("j_tbnav_tab_a");
        for (i=0;i<tabs.length;i++){
            if (tabs[i].innerHTML.indexOf("直播") != -1){
                tabs[i].parentNode.removeChild(tabs[i]);
            }
            if (tabs[i].innerHTML.indexOf("应用") != -1){
                tabs[i].parentNode.removeChild(tabs[i]);
            }
        }
    }

    //贴内广告
    function adinPageClean(){
        console.log('贴吧页面精简: 开始精简贴内广告');
        var ad = document.getElementsByClassName('iframe_wrapper');
        console.log('贴吧页面精简: 抓取到的广告元素数量: '+ad.length);
        for(var i=0;i<ad.length;i++){
            ad[i].parentNode.parentNode.removeChild(ad[i].parentNode);
        }
        console.log('贴吧页面精简: 贴内广告精简完毕');
        //贴内插入广告
        var plus = document.getElementsByClassName('d_name');
        for (i=0;i<plus.length;i++){
            var dat = plus[i].getAttribute('data-field');
            if(!dat || !dat.replace(/\s/g,'')){
                plus[i].parentNode.parentNode.parentNode.parentNode.removeChild(plus[i].parentNode.parentNode.parentNode);
            }
        }
    }

    //免登录看帖
    function noLogin(){
        try{
            var login = document.createElement('script');
            login.innerHTML="PageData.user.is_login = true";
            document.head.appendChild(login);
        } catch(e){
            console.error('贴吧页面精简: 免登录看帖加载错误');
            console.error(e);
        }
    }

    //更新提醒
    function updateAlert(){
        var s_update = "贴吧页面精简：\n检测到脚本版本更改\n\n";
        var version = GM_getValue("version");
        if (version !== GM_info.script.version){
            console.warn("贴吧页面精简：检测到脚本版本更改：" + version + " → " + GM_info.script.version);
            if (version === undefined){
                version = "未知";
            }
            switch (version){
                default:
                    //版本更新时删除废弃变量
                    deleteTrashValue();
                    s_update += "版本已从 " + version + " 更新为 " + GM_info.script.version + "\n\n" + GM_info.script.version + "版本的更新内容为：\n修复对新版Chrome的兼容性问题。\n\n如果遇到Bug请及时提交反馈，感谢。\n\n【重要提醒！必看！】\n如果您没有安装Adblock，请安装Adblock以获得最佳体验\n\n由于这个脚本已经比较稳定，后续只修复Bug和根据贴吧的变化添补新功能\n";
                    break;
                case "未知":
                    s_update += "欢迎使用贴吧页面精简脚本\n您当前的脚本版本为： " + version + "\n\n【关于设置】\n您可以通过右上角的设置面板设置相关功能以获得最佳体验\n\n【重要提醒！必看！】\n如果您没有安装Adblock，请安装Adblock以获得最佳体验\n\n由于这个脚本已经比较稳定，后续只修复Bug和根据贴吧的变化添补新功能\n";
                    break;
                case "2.8.0":
                    s_update += "版本已从 " + version + " 降级为 " + GM_info.script.version + "\n\n" + "建议使用最新版本的脚本以获得最佳体验\n降级会造成您的设置丢失，请检查您的设置\n";
                    break;
            }
            s_update += "\n遇到任何问题请立刻到GreasyFork反馈\n或者发送邮件至dev@backrunner.top\n如果您觉得本脚本好用可使用支付宝扫描GreasyFork中的二维码或底部赞助链接中的二维码向我捐赠\n收到您的捐赠后我会将您的id加入到感谢名单\n感谢名单显示在这里和脚本描述内";
            alert(s_update);
            GM_setValue("version",GM_info.script.version);
        } else {
            console.warn("贴吧页面精简：未检测到脚本版本更改");
        }
    }
    //创建顶栏控制面板
    function createControlPanel(){
        if (document.querySelector('#backrunnerJSSetting_root') === null){
            try{
                //userbar获取与主层创建
                var userbar = $('#com_userbar').children('ul')[0];
                var li = document.createElement('li');
                var div = document.createElement('div');
                var a = document.createElement('a');

                //主层设置
                a.innerHTML = "脚本设置";

                //主层事件
                div.addEventListener('mouseenter',cpOnMouseEnter);
                div.addEventListener('mouseleave',cpOnMouseLeave);

                //菜单层创建
                var menuroot = document.createElement('div');
                var menucon = document.createElement('div');
                var menudiv = document.createElement('div');
                menuroot.setAttribute('class','u_ddl');
                menuroot.setAttribute('id','backrunnerJSSetting_root');
                menucon.setAttribute('class','u_ddl_con');
                menucon.setAttribute('id','backrunnerJSSetting_con');
                menudiv.setAttribute('class','u_ddl_con_top');
                menudiv.setAttribute('id','backrunnerJSSetting_main');
                menucon.appendChild(menudiv);
                menuroot.appendChild(menucon);

                //菜单层事件
                menuroot.addEventListener('mouseenter',cpOnMouseEnter);
                menuroot.addEventListener('mouseleave',cpOnMouseLeave);

                //菜单列表创建
                var menu = document.createElement('ui');
                //0:文本框 1:复选框 2:按钮
                createMenuItem(menu,1,"postprocess","后处理脚本","");
                createMenuItem(menu,1,"isRedirect","重定向","");
                createMenuItem(menu,1,"homepageprocess","主页精简","");
                createMenuItem(menu,1,"isHeadimg","精简列表页头图","");
                createMenuItem(menu,1,"displayLive","是否显示直播帖","");
                createMenuItem(menu,1,"displaySign","是否显示用户签名档","");
                createMenuItem(menu,1,"autoCloseGuide","自动收起指引","");
                createMenuItem(menu,1,"homeProcess","个人主页精简","");
                createMenuItem(menu,1,"groupprocess","群组页面精简","");
                createMenuItem(menu,1,"nologin","免登录看帖","");
                createMenuItem(menu,1,"reverse","倒序看帖（实验性）","");
                createMenuItem(menu,0,"sleepTime","主脚本延迟时间");
                createMenuItem(menu,0,"delayScriptRunTimes","延迟脚本执行次数","");
                createMenuItem(menu,0,"sleepTimePage","翻页脚本延迟时间","");
                createMenuItem(menu,0,"reverseSleepTime","倒序查看脚本延迟时间","");
                createMenuItem(menu,0,"checkrate","脚本延迟时间倍率","");
                createMenuItem(menu,2,"refresh","刷新页面","刷新");
                createMenuItem(menu,2,"submit","提交设置","提交");
                createMenuItem(menu,2,"reset","重置设置","重置");
                menudiv.appendChild(menu);

                //菜单入口
                div.appendChild(a);
                div.setAttribute('class','u_menu_item');
                div.setAttribute('id','backrunnerJSSetting_item');
                li.appendChild(div);
                li.appendChild(menuroot);
                userbar.appendChild(li);

                //菜单内容初始化
                menuInitialize();

                //菜单内事件创建
                createMenuEvent();
            } catch(e){
                console.error(e);
            }
        } else {
            console.warn('贴吧页面精简: 控制面板已存在');
        }
    }
    //菜单项创建
    function createMenuItem(menu,type,id,labelContent,innerContent){
        //层创建
        var li = document.createElement('li');
        var div = document.createElement('div');
        var d_a = document.createElement('div');
        var d_i = document.createElement('div');
        //层设置
        d_a.setAttribute('style','float:left;width:150px');
        switch(type){
            case 0:
                d_i.setAttribute('style','padding-top:7px;padding-left:150px;padding-right:10px;');
                break;
            case 1:
                d_i.setAttribute('style','padding-top:8px;padding-left:192px;padding-right:10px;');
                break;
            case 2:
                d_i.setAttribute('style','padding-top:6px;padding-left:150px;padding-right:10px;');
                break;
        }
        //元素创建
        var a = document.createElement('a');
        var i = document.createElement('input');
        //元素设置
        a.innerHTML = labelContent;
        switch(type){
            case 0:
                i.setAttribute('style','width:50px;text-align:right');
                i.setAttribute('id','backrunner_i_'+id);
                break;
            case 1:
                //复选框
                i.setAttribute('type','checkbox');
                i.setAttribute('id','backrunner_i_'+id);
                break;
            case 2:
                //按钮
                i = document.createElement('button');
                i.innerHTML = innerContent;
                i.setAttribute('style','width:52px');
                i.setAttribute('id','backrunner_btn_'+id);
                break;
        }

        //元素添加到层
        d_a.appendChild(a);
        d_i.appendChild(i);
        //元素层添加到主层
        div.appendChild(d_a);
        div.appendChild(d_i);
        //主层添加到li
        li.appendChild(div);
        //li添加到menu
        menu.appendChild(li);
    }
    //菜单初始化
    function menuInitialize(){
        menuInitialize_checkbox('postprocess',postprocess);
        menuInitialize_checkbox('isRedirect',isRedirect);
        menuInitialize_checkbox('homepageprocess',homePageProcess);
        menuInitialize_checkbox('homeProcess',homeProcess);
        menuInitialize_checkbox('isHeadimg',isHeadimg);
        menuInitialize_checkbox('groupprocess',groupPageProcess);
        menuInitialize_checkbox('nologin',noLoginProcess);
        menuInitialize_checkbox('reverse',reverse);
        menuInitialize_checkbox('displayLive',displayLive);
        menuInitialize_checkbox('displaySign',displaySign);
        menuInitialize_checkbox('autoCloseGuide',autoCloseGuide);
        menuInitialize_input('sleepTime',sleepTime);
        menuInitialize_input('delayScriptRunTimes',delayScriptRunTimes);
        menuInitialize_input('sleepTimePage',sleepTimeWhenPageTurn);
        menuInitialize_input('reverseSleepTime',reverseSleepTime);
        menuInitialize_input('checkrate',checkrate);
    }
    //菜单checkbox初始化
    function menuInitialize_checkbox(id,variable){
        var i = document.getElementById('backrunner_i_'+id);
        if (i !== null){
            if (variable){
                i.checked = true;
            } else {
                i.checked = false;
            }
        }
    }
    //菜单input初始化
    function menuInitialize_input(id,variable){
        var i = document.getElementById('backrunner_i_'+id);
        if (i !== null){
            i.value = variable;
        }
    }

    //菜单内事件创建
    function createMenuEvent(){
        try{
            //刷新
            var btn_refresh = document.getElementById('backrunner_btn_refresh');
            if (btn_refresh !== null){
                btn_refresh.addEventListener('click',btn_refresh_click);
            }
            //提交
            var btn_submit = document.getElementById('backrunner_btn_submit');
            if (btn_submit !== null){
                btn_submit.addEventListener('click',btn_submit_click);
            }
            //重置
            var btn_reset = document.getElementById('backrunner_btn_reset');
            if (btn_reset !== null){
                btn_reset.addEventListener('click',btn_reset_click);
            }
        }catch(e){
            console.error(e);
        }
    }
    //刷新按钮事件
    function btn_refresh_click(){
        window.location.reload(true);
    }
    //提交按钮事件
    function btn_submit_click(){
        postprocess = convertBoolValue('postprocess');
        isRedirect = convertBoolValue('isRedirect');
        homePageProcess = convertBoolValue('homepageprocess');
        homeProcess = convertBoolValue('homeProcess');
        isHeadimg = convertBoolValue('isHeadimg');
        displayLive = convertBoolValue('displayLive');
        displaySign = convertBoolValue('displaySign');
        autoCloseGuide = convertBoolValue('autoCloseGuide');
        groupPageProcess = convertBoolValue('groupprocess');
        noLoginProcess = convertBoolValue('nologin');
        reverse = convertBoolValue('reverse');
        sleepTime = convertNumValue('sleepTime');
        delayScriptRunTimes = convertNumValue('delayScriptRunTimes');
        sleepTimeWhenPageTurn = convertNumValue('sleepTimePage');
        reverseSleepTime = convertNumValue('reverseSleepTime');
        checkrate = convertNumValue('checkrate');

        if (postprocess){
            if (window.confirm('确认要更改设置？')){
                replaceStoredSettings();
                menuInitialize();
                window.location.reload(true);
            } else {
                menuInitialize();
            }
        } else {
            if (window.confirm('【重要】\n您禁用了后处理脚本，本脚本绝大部分功能将无法使用\n\n确认要更改设置？')){
                replaceStoredSettings();
                menuInitialize();
                window.location.reload(true);
            } else {
                menuInitialize();
            }
        }
    }
    function btn_reset_click(){
        if (window.confirm('确认要重置设置？')){
            GM_deleteValue("postprocess");
            GM_deleteValue("isRedirect");
            GM_deleteValue("sleepTime");
            GM_deleteValue("delayScriptRunTimes");
            GM_deleteValue("displayLive");
            GM_deleteValue("displaySign");
            GM_deleteValue("autoCloseGuide");
            GM_deleteValue("sleepTimeWhenPageTurn");
            GM_deleteValue("reverseSleepTime");
            GM_deleteValue("homePageProcess");
            GM_deleteValue("homeProcess");
            GM_deleteValue("isHeadimg");
            GM_deleteValue("groupPageProcess");
            GM_deleteValue("noLoginProcess");
            GM_deleteValue("reverse");
            GM_deleteValue("checkrate");
            window.location.reload(true);
        }
    }
    //将菜单中的bool值赋给变量
    function convertBoolValue(id){
        var i = document.getElementById('backrunner_i_'+id);
        if (i !== null){
            if (i.checked){
                return true;
            } else {
                return false;
            }
        }
    }
    //将菜单中的数值赋给变量
    function convertNumValue(id){
        var i = document.getElementById('backrunner_i_'+id);
        if (i !== null){
            return(parseFloat(i.value));
        }
    }
    //控制面板鼠标事件
    function cpOnMouseEnter(){
        try{
            var cp = document.getElementById('backrunnerJSSetting_root');
            cp.setAttribute('style','display:block;right:0;');
        } catch(e){
            console.error(e);
        }
    }
    function cpOnMouseLeave(){
        try{
            var cp = document.getElementById('backrunnerJSSetting_root');
            cp.setAttribute('style','display:none;right:0');
        } catch(e){
            console.error(e);
        }
    }

    //替换储存的设置
    function replaceStoredSettings(){
        GM_setValue("postprocess",postprocess);
        GM_setValue("isRedirect",isRedirect);
        GM_setValue("sleepTime",sleepTime);
        GM_setValue("delayScriptRunTimes",delayScriptRunTimes);
        GM_setValue("displayLive",displayLive);
        GM_setValue("displaySign",displaySign);
        GM_setValue("autoCloseGuide",autoCloseGuide);
        GM_setValue("sleepTimeWhenPageTurn",sleepTimeWhenPageTurn);
        GM_setValue("reverseSleepTime",reverseSleepTime);
        GM_setValue("homePageProcess",homePageProcess);
        GM_setValue("homeProcess",homeProcess);
        GM_setValue("isHeadimg",isHeadimg);
        GM_setValue("groupPageProcess",groupPageProcess);
        GM_setValue("noLoginProcess",noLoginProcess);
        GM_setValue("reverse",reverse);
        GM_setValue("checkrate",checkrate);
    }

    //底部信息输出
    function createFooterLayer(){
        var footDiv;
        var id;
        if (document.querySelector('#backrunnerJSFooter')===null){
            if (window.location.href.indexOf("tieba.baidu.com/f?") !== -1){
                try{
                    footDiv = document.getElementsByClassName('frs_content_footer_pagelet')[0];
                    foot = document.createElement('div');
                    id = document.createElement('div');
                    foot.setAttribute('class','footer');
                    foot.setAttribute('id','footer');
                    foot.setAttribute('style','padding-top:0px !important;');
                    id.setAttribute('id','backrunnerJSFooter');
                    createFooterElement(foot,"已应用由BackRunner制作的贴吧精简脚本 ("+ GM_info.script.version+")","https://greasyfork.org/zh-CN/scripts/23687",false);
                    createFooterElement(foot,"捐赠作者(支付宝二维码)","https://smallfile.backrunner.top/images/alipay.jpg",true);
                    footDiv.appendChild(foot);
                    footDiv.appendChild(id);
                    console.warn('贴吧页面精简: 底部信息添加完成');
                } catch(e){
                    console.error(e);
                }
            } else {
                if (window.location.href.indexOf("tieba.baidu.com/p/") !== -1){
                    try{
                        footDiv = document.getElementsByClassName('pb_footer')[0];
                        foot = document.createElement('div');
                        id = document.createElement('div');
                        foot.setAttribute('class','footer');
                        foot.setAttribute('id','footer');
                        foot.setAttribute('style','padding-top:0px !important;');
                        id.setAttribute('id','backrunnerJSFooter');
                        createFooterElement(foot,"已应用由BackRunner制作的贴吧精简脚本 ("+ GM_info.script.version+")","https://greasyfork.org/zh-CN/scripts/23687",false);
                        createFooterElement(foot,"向作者捐款(支付宝二维码)","https://smallfile.backrunner.top/images/alipay.jpg",true);
                        footDiv.appendChild(foot);
                        footDiv.appendChild(id);
                        console.warn('贴吧页面精简: 底部信息添加完成');
                    } catch(e){
                        console.error(e);
                    }
                }
            }
        } else {
            console.warn('贴吧页面精简: 底部信息已存在');
        }
    }
    function addFinishTimeToFooter(){
        if (finishTime !== -1){
            addSplitLineToFooter(foot);
            createFooterElement(foot,"页面加载时间：" + finishTime+"ms","javascript:;",true);
        }
    }
    function addSplitLineToFooter(footer){
        try{
            var splitLine=document.createElement('span');
            splitLine.innerHTML="|";
            footer.appendChild(splitLine);
        }catch(e){
            console.error(e);
        }
    }
    function createFooterElement(footer,text,href,isLast){
        var splitLine=document.createElement('span');
        splitLine.innerHTML="|";
        var content = document.createElement('a');
        content.innerHTML=text;
        content.setAttribute('href',href);
        content.setAttribute('target',"_blank");
        content.setAttribute('pv_code',"0");
        footer.appendChild(content);
        if (!isLast){
            footer.appendChild(splitLine);
        }
    }
    //头图禁用
    function disableForumCard(){
        if (isHeadimg){
            try{
                var forumcard = document.getElementById('forum-card-banner');
                console.warn('贴吧页面精简: 正在精简头图');
                if (forumcard !== null){
                    if (forumcard.getAttribute("src")!==""){
                        forumcard.setAttribute("src","");
                        forumcard.setAttribute("style","height:180px !important;background-color:white !important;");
                    }
                }
            } catch(e){
                console.error(e);
            }
        }
    }
    //重定向
    function redirect(){
        var url = window.location.href;
        //?red_tag重定向
        var elements = window.location.search.toString().split('&');
        for (var i = 0;i<elements.length;i++){
            if (elements[i].indexOf('red_tag') !== -1){
                url = url.replace('&'+elements[i],'');
                url = url.replace(elements[i],'');
            }
        }
        //奇怪域名重定向
        if (url.indexOf('dq.tieba.com')!=-1){
            url = url.replace('dq.tieba.com','tieba.baidu.com');
        }
        if (url.indexOf('jump.bdimg.com')!=-1){
            url = url.replace('jump2.bdimg.com','tieba.baidu.com');
        }
        if (url.indexOf('jump2.bdimg.com')!=-1){
            url = url.replace('jump2.bdimg.com','tieba.baidu.com');
        }
        if (url.indexOf('?traceid=')!=-1){
            url = url.replace('?traceid=','');
        }
        if (url !== window.location.href){
            window.location = url;
        }
    }
    //倒序看帖按钮添加
    function reverseorder(){
        if (reverse){
            //判定当前状态
            var status = initialize_var('reverse_status',false);
            if (document.querySelector('#br_reverse') === null){
                var rightbtn = document.getElementsByClassName('core_title_btns')[0];
                var btnli = document.createElement('li');
                var btn = document.createElement('a');
                console.warn('贴吧页面精简: 正在创建倒序查看按钮');
                //判定是否为另一个帖子
                var lastpage = initialize_var('reverse_lastpage','');
                var currenthref = window.location.href;
                var currentsearch = window.location.search;
                var currentpage = currenthref.replace(currentsearch,'').replace('https://tieba.baidu.com/p/','').replace('http://tieba.baidu.com/p/','');
                if (currentpage!=lastpage){
                    status = false;
                }
                GM_setValue('reverse_lastpage',currentpage);
                GM_setValue('reverse_status',status);
                if (status){
                    btn.innerHTML = '正序查看';
                }else {
                    btn.innerHTML='倒序查看';
                }
                btn.setAttribute('id','br_reverse');
                btn.setAttribute('class','btn-sub btn-small');
                btnli.setAttribute('class','br_reverse_li quick_reply');
                btnli.appendChild(btn);
                rightbtn.appendChild(btnli);
                rightbtn.addEventListener('click',reverse_click);
                currenthref = window.location.href;
                reverse_contents();
            }
        }
    }
    //倒序看帖点击事件
    function reverse_click(){
        var status = initialize_var('reverse_status',false);
        if(status){
            console.log('click');
            //恢复正序
            GM_setValue('reverse_status',false);
            var btns = document.getElementsByClassName('pb_list_pager')[0].children;
            if (btns.length === 0){
                window.location.reload(true);
            }else {
                for (var i = 0;i < btns.length;i++){
                    if (btns[i].innerHTML == '1'){
                        //向首页跳转
                        window.location.href = btns[i].href;
                    }
                }
            }
        } else {
            //倒序
            GM_setValue('reverse_status',true);
            btns = document.getElementsByClassName('pb_list_pager')[0].children;
            if (btns.length === 0){
                window.location.reload(true);
            }else {
                for (var j = 0;j<btns.length;j++){
                    if (btns[j].innerHTML == '尾页'){
                        //向尾页跳转
                        window.location.href = btns[j].href;
                    }
                }
            }
        }
    }
    //翻转当前页内容
    function reverse_contents(){
        setTimeout(function(){
            var status = initialize_var('reverse_status',false);
            if (status){
                console.warn('贴吧页面精简: 正在翻转当前页内容');

                //获取当前的pn
                var search = window.location.search;
                var searchs = search.split('&');
                var pn;
                for (var child = 0;child<searchs.length;child++){
                    if (searchs[child].indexOf('pn=') !== -1){
                        pn = searchs[child].replace('?','').replace('pn=','');
                    }
                }
                var list = document.getElementById('j_p_postlist');
                var contents = list.children;
                console.warn(contents);
                if (contents.length == 1 && contents[0].id == "j_p_postlist"){
                    list = document.getElementsByClassName('p_postlist')[1];
                    contents = list.children;
                }
                console.warn(contents);
                //倒序
                for(var i = contents.length - 1; i >= 0; i--) {
                    list.appendChild(contents[i]);
                }
            }
        },reverseSleepTime);
    }
    //自动收起指引
    var isAutoCloseGuideSet = false;
    function closeGuide(){
        if (autoCloseGuide && !isAutoCloseGuideSet){
            var topContent = document.getElementsByClassName("top_content");
            var topContentMain = document.getElementsByClassName("top_cont_main");
            if (topContent.length>0 && topContentMain.length>0){
                topContent[0].setAttribute("class","top_content top_content_closed");
                topContentMain[0].setAttribute("style","display:none;");
                isAutoCloseGuideSet = true;
            }
        }
    }
    //版本更新删除废弃变量
    function deleteTrashValue(){
        var trashList = {};
        for (var i = 0;i<trashList.length;i++){
            GM_deleteValue("trashList[i]");
        }
        console.warn('贴吧页面精简: 版本更新，已删除废弃变量');
    }
    //打折卡等弹框屏蔽
    function removePopupModal(){
        var dialog = document.getElementsByClassName('dialogJ');
        var dialogmodal = document.getElementsByClassName('dialogJmodal');
        for (var i = 0;i<dialog.length;i++){
            dialog[i].parentNode.removeChild(dialog[i]);
            if (dialog[i].innerHTML.indexOf('确定不再关注' != -1)){
                continue;
            }
        }
        for (i = 0;i<dialogmodal.length;i++){
            dialogmodal[i].parentNode.removeChild(dialogmodal[i]);
        }
        setTimeout(function(){
            var dialog = document.getElementsByClassName('dialogJ');
            var dialogmodal = document.getElementsByClassName('dialogJmodal');
            for (var i = 0;i<dialog.length;i++){
                dialog[i].parentNode.removeChild(dialog[i]);
            }
            for (i = 0;i<dialogmodal.length;i++){
                dialogmodal[i].parentNode.removeChild(dialogmodal[i]);
            }
        },5000);
    }
    //清理首页动态内的广告 *20181022
    var indexADEvent_a = false;
    var indexADEvent_scroll = false;
    var indexADEvent_tag_hot = false;
    var indexADEvent_tag_personal = false;
    var windowTempScrollTop = 0;
    function bindCleanIndexADEvent(){
        var btn = document.getElementById('btn_more');
        var a = btn.children[0];
        if (!indexADEvent_a){
            console.log("贴吧页面精简: 已绑定首页动态广告清理的按钮点击事件");
            a.addEventListener('click',function(){
                setTimeout(function(){
                    cleanADinIndex();
                },sleepTime);
            });
            indexADEvent_a = true;
        }
        if (!indexADEvent_scroll){
            console.log("贴吧页面精简: 已绑定首页动态广告清理的滚动事件");
            document.onscroll = function(){
                if (document.documentElement.scrollTop - windowTempScrollTop > 300){
                    console.log("贴吧页面精简: 滚动触发，正在清理动态内的广告");
                    cleanADinIndex();
                    windowTempScrollTop = document.documentElement.scrollTop;
                }
            }
            indexADEvent_scroll = true;
        }
        if (!indexADEvent_tag_hot){
            var tag_hot = document.getElementById('j_remen_nav');
            tag_hot.addEventListener('click',function(){
                clearScrollTopTemp();
            });
            indexADEvent_tag_hot = true;
        }
        if (!indexADEvent_tag_personal){
            var tag_personal = document.getElementById('nav-personal');
            tag_personal.addEventListener('click',function(){
                clearScrollTopTemp();
            });
            indexADEvent_tag_hot = true;
        }
    }
    function clearScrollTopTemp(){
        console.log("贴吧页面精简: 清理滚动高度缓存");
        windowTempScrollTop = 0;
    }
    function cleanADinIndex(){
        var ads = document.getElementsByClassName('home-place-item');
        var count = 0;
        for (var i = 0;i<ads.length;i++){
            var extinfo = ads[i].getAttribute('data-ext_info');
            if (typeof extinfo != 'undefined'){
                ads[i].parentNode.removeChild(ads[i]);
                count++;
            };
        }
        console.log("贴吧页面精简: 清理了"+count+"条动态内的广告");
    }
    // 修复关注按钮
    function fixFocusButton(){
        $(document).on('mousedown', '.islike_focus' ,function(){
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            setTimeout(function(){
                window.location.reload();
            }, 100);
        });
    }
})();