// ==UserScript==
// @name         网站签到工具
// @version      2.1.3
// @description  用于各种论坛和网站自动签到 论坛签到工具、签到工具、整合吾爱破解、飘云阁、卡饭论坛、网易云音乐、天使动漫论坛等论坛和网站自动点击签到 根据论坛签到工具 二次开发 需要添加其他网站请私聊我留下网站地址
// @author       Fxy29
// @homepage     https://greasyfork.org/zh-CN/scripts/439136-%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7
// @icon         https://www.dismall.com/favicon.ico
// @match        https://www.52pojie.cn/*
// @match        https://www.chinapyg.com/*
// @match        https://music.163.com/
// @match        https://www.acfun.cn/*
// @match        https://www.wenshushu.cn/*
// @match        https://www.itsk.com/*
// @match        https://bbs.kafan.cn/*
// @match        https://bbs.wstx.com/*
// @match        https://*.hifiti.com/*
// @match        https://zhutix.com/*
// @match        https://*.tsdm39.com/*
// @match        https://*.smzdm.com/
// @match        https://*.iya.app/*
// @match        *://*.1000qm.vip/*
// @match        https://*.mydigit.cn/*
// @match        https://bbs.jqhdd.com/*
// @match        https://*.chinadsl.net/*
// @match        https://*.chenyuanqingshui.cn/*
// @match        https://*.sayhanabi.net/*
// @match        https://bbs.binmt.cc/*
// @match        https://littleskin.cn/user
// @match        https://*.4ksj.com/*
// @match        https://*.xlebbs.com/*
// @match        https://cnlang.org/*
// @match        https://zxcsol.com/
// @match        https://blog.51cto.com/
// @match        https://*.52cnp.com/*
// @match        https://forum.naixi.net/*
// @match        https://3d.jzsc.net/*
// @match        https://*.znzmo.com/*
// @match        https://*.975w.com/*
// @match        https://klpbbs.com/*
// @match        https://*.mudaiba.com/
// @match        https://*.zyrhires.com/*
// @match        https://*.tekqart.com/*
// @match        https://winmoes.com/task
// @match        *://*.ydwgames.com/*
// @match        https://bbs.108mir.com/*
// @match        https://lixianla.com/
// @match        https://70games.net/
// @match        https://gztown.org/*
// @match        https://*.bugutv.vip/*
// @match        *://*.nmandy.net/*
// @match        https://vip.lzzcc.cn/
// @match        https://*.iios.club/*
// @match        https://*.macat.vip/user
// @match        https://bbs.66ccff.cc/
// @match        *://*.openedv.com/*
// @match        https://juejin.cn/user/*
// @match        https://fishc.com.cn/*
// @match        https://home.x64bbs.cn/
// @match        *://*.ymmfa.com/*
// @match        https://*.manhuabudangbbs.com/*
// @match        https://*.55188.com/*
// @match        https://*.xianyudanji.to/*
// @match        https://bbs2.seikuu.com/*
// @match        https://bbs.yamibo.com/*
// @match        https://bingfong.com/*
// @match        https://*.jyeoo.com/*
// @match        https://duokan.club/*
// @match        https://xhzyku.com/*
// @match        https://*.xbgame.net/*
// @match        https://bbs.steamtools.net/*
// @match        https://club.excelhome.net/*
// @match        https://aistudio.baidu.com/*
// @match        https://*.luogu.com.cn/*
// @match        https://bbs.foodmate.net/*
// @match        *://apk.tw/*
// @match        https://*.fotor.com/*
// @match        https://*.mnpc.net/*
// @match        https://*.byzhihuo.com/*
// @match        https://*.caigamer.cn/*
// @match        https://*.5abbk.com/*
// @match        https://*.minebbs.com/
// @match        https://www.sglynp.com/*
// @match        https://bbs.kfpromax.com/*
// @match        https://www.acgns.org/*
// @match        https://bbs.125.la/*
// @match        https://www.kungal.com/*
// @match        https://rainkmc.com/*
// @match        https://141love.net/*
// @match        https://*.stcaimcu.com/*
// @match        https://youxiou.com/*
// @match        https://forum.zwsoft.cn/*
// @match        https://www.kuafuzys.com/*
// @match        https://www.jkju.cc/*
// @match        https://www.joinquant.com/view/user*
// @match        https://bbs.vc52.cn/*
// @match        https://*.hadsky.com/*
// @match        https://*.lhndy.cn/*
// @match        https://www.sonkwo.cn/*
// @match        https://i.zaimanhua.com/*
// @match        https://*.pc528.net/*
// @match        https://*.right.com.cn/*
// @match        https://bbs.acgrip.com/*
// @match        https://bbs.itzmx.com/*
// @include      https://*ikuuu*
// @include      *://*/plugin.php?id=*sign*
// @exclude      https://leaves.red/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @copyright 	 2025 Fxy29
// @license      Apache-2.0
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/439136/%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439136/%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {

    var APPNAME=GM_info.script.name+"-"+GM_info.script.version;
    var NOLOGIN="-----------------------------\n["+APPNAME+"]\n状态异常或未登录，登录后自动签到\n-----------------------------";
    var QIANDAO="-----------------------------\n["+APPNAME+"]\n签到完成！\n-----------------------------";
    var QIANDAOTEXT="-----------------------------\n["+APPNAME+"]\n领取完成！\n-----------------------------";

    /* globals jQuery, $, waitForKeyElements */

    //吾爱破解论坛
    if (isURL("52pojie.cn")) {
        if(isURL("search.php")||isURL("home.php")){
            return;
        }
        window.setTimeout(function(){
            if (document.body.textContent.indexOf('注册[Register]') != -1){
                return;
            }else if(document.getElementById("g_upmine")==null && document.body.textContent.indexOf('Forbidden') == -1){
                window.setTimeout(function(){
                    alert(NOLOGIN);
                },1200);
            }else{
                var qq_bind = $("#um p:eq(1) a:eq(0) img").attr('src');
                var g_upmine =document.getElementById("g_upmine");
                if (qq_bind.indexOf("qds.png") != -1) {//未签到
                    window.setTimeout(function(){$("#um p:eq(1) a:eq(0) img").click();},1000);
                    return;
                }
            }
        },2000);
        return;
    }

    //飘云阁
    else if (isURL("chinapyg.com")) {
        qd4('签到领奖!', 'kx_s');
        return;
    }

    //网易云音乐
    else if (isURL("music.163.com")) {
        window.setTimeout(function(){
            if(!window.find("登录") && !window.find("登录网易云音乐")){
                const iframe = document.querySelector('#g_iframe');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const sign_button = iframeDoc.getElementsByClassName('sign')[0];
                if (sign_button && sign_button.text.indexOf("签 到") == 0) {
                    sign_button.click();
                    return;
                }
            }else{
                alert(NOLOGIN);
            }
        },3000);
        return;
    }

    //acfun
    else if (isURL("www.acfun.cn")) {
        var acfun_main = 'https://www.acfun.cn/';
        var acfun_member = 'https://www.acfun.cn/member/';
        if (isURL(acfun_member)) {
            setTimeout(function () {
                var ischecked = function (doc) {
                    return (document.getElementsByClassName("sign-in-btn")[0].textContent.indexOf("已签到") != -1);
                };
                if (!ischecked(document)) {
                    document.getElementsByClassName("sign-in-btn")[0].click();
                    window.setTimeout(function(){
                        document.getElementById("signin-modal-show").checked = true;
                        document.getElementsByClassName("signin-web-btn")[0].click();
                        window.location.reload();
                    },1000);
                }
            }, 2000);
        }
        return;
    }

    //文叔叔
    else if (isURL("wenshushu.cn")) {
        window.setTimeout(function(){
            for (var i=0; i<5; i++)
            {
                if (typeof $(".btn-icon")[i] != 'undefined') {
                    $(".btn-icon")[i].click();
                }
            }
            document.getElementsByClassName('icon-cont_clock')[0].click();
        },5000);
        return;
    }

    //IT天空
    else if (isURL("itsk.com")) {
        const timer = setInterval(() => {
            const btn = document.querySelector('.sign-res button.el-button--success');
            if (btn) {
                btn.click();
                clearInterval(timer);
            }
        }, 1000);
        return;
    }

    //卡饭论坛 冰楓論壇
    else if (isURL("bbs.kafan.cn") || isURL("bingfong.com")) {
        window.setTimeout(function(){
            var imgs3 = document.getElementById("pper_a").getElementsByTagName("IMG");
            if (imgs3[0].src.indexOf("wb.png") == -1) {
                document.getElementById("pper_a").click();
            }
        },2000);
        return;
    }

    //鱼C论坛 数码之家 MT论坛 华印社区 奶昔论坛 苦力怕论坛 奇速网单 ExcelHome技术论坛 不移之火 茹伊映画 巨大爱好者
    else if (isURL("fishc.com.cn") || isURL("mydigit.cn") || isURL("bbs.binmt.cc") || isURL("52cnp.com") || isURL("naixi.net") || isURL("klpbbs.com") || isURL("108mir.com") || isURL("club.excelhome.net")  || isURL("byzhihuo.com") || isURL("ruyanhk")  || isURL("52gts")) {
        window.setTimeout(function(){
            if (isURL('k_misign-sign.html') || isURL('plugin.php?id=k_misign:sign') || isURL('k_misign:sign') || isURL('sign.php')) {
                if (window.find("您今天还没有签到")||window.find("您今天還沒有簽到")) {
                    $("#JD_sign").click();
                    return;
                }
            }
        },2000);
        return;
    }

    //深影论坛
    else if (isURL("sybbs.vip/plugin.php?id=gsignin:index")) {
        window.setTimeout(function(){document.getElementsByClassName('right')[0].click();},2000);
        return;
    }

    //樱花萌ACG 三国情论坛
    else if (isURL("jiuyh") || isURL("975w.com")) {
        if (isURL('yinxingfei_zzza:yinxingfei_zzza_hall') || isURL("yinxingfei_zzza-yinxingfei_zzza_hall.html")) {
            window.setTimeout(function(){document.getElementById("zzza_go").click();},2000);
        }
        return;
    }

    //HiFiTi
    else if (isURL("hifiti.com")) {
        window.setTimeout(function(){
            var imgs5 = document.getElementById("sg_sign");
            if(imgs5.textContent.indexOf("请登录") != -1) {
                alert(NOLOGIN);
                return;
            }else if(imgs5.textContent.indexOf("已签") != -1){
                return;
            }else if(imgs5.textContent.indexOf("签到") != -1){
                imgs5.click();
                return;
            }
        },2000);
        return;
    }

    //致美化
    else if (isURL("zhutix.com/task")) {
        window.setTimeout(function(){
            var task_day_list=document.getElementsByClassName("task-day-list")[0];
            var task_day_list_ul=task_day_list.childNodes.item(0);
            var task_day_list_ul_lis=task_day_list_ul.childNodes;
            var task_day_list_ul_lis_lison4=null;
            for(var i=0;i<task_day_list_ul_lis.length;i++){
                if(i==3){
                    task_day_list_ul_lis_lison4=task_day_list_ul_lis.item(i).innerHTML;
                }
            }
            var task_day_list_spanno15=document.getElementsByClassName("task-day-list")[0].getElementsByTagName('span')[15];
            if(task_day_list_spanno15.className.trim() == 'task-finish-icon-go') {
                document.getElementsByClassName("task-day-list")[0].getElementsByTagName('a')[3].click();
                alert(QIANDAO);
                return;
            }
        },1000);
        return;
    }
    else if (isURL("zhutix.com/mission/today")) {
        window.setTimeout(function(){
            var span = document.getElementsByClassName('gold-row')[0].getElementsByTagName('span')[0];
            var button = document.getElementsByClassName('gold-row')[0].getElementsByTagName('button')[0];
            if (button && span && span.innerText.includes('签到')) {
                button.click();
                alert(QIANDAO);
            }
        },6500);
        return;
    }

    //天使动漫论坛
    else if (isURL("tsdm")) {
        qd4('签到领奖!', 'kx_s');
        return;
    }

    //什么值得买
    else if (isURL("smzdm")) {
        window.setTimeout(function(){
            if(!window.find("登录") && !window.find("注册")){
                var imgs6 = document.getElementsByClassName('J_punch')[0];
                if (imgs6.text.indexOf("签到领奖") == 0) {
                    imgs6.click();
                    return;
                }
            }else{
                alert(NOLOGIN);
            }
        },2800);
        return;
    }

    //iYa.App 软件交流社区
    else if (isURL("www.iya.app")) {
        if (window.find("签到领奖!")) {
            window.location.href = "https://www.iya.app/plugin.php?id=dsu_paulsign:sign";
            return;
        }
        qd();
        return;
    }

    //阡陌居
    else if (isURL("1000qm")) {
        qd4('签到领奖!', 'kx_s');
        window.setTimeout(function(){
            toURL_once('/home.php?mod=task&do=apply&id=1')
        },2000);
        return;
    }

    //宽带技术网
    else if (isURL("chinadsl")) {
        window.setTimeout(function(){
            if (isURL('home.php?mod=task&do=view&id=1')) {
                var taskbtn = document.getElementsByClassName('taskbtn')[0].href;
                if (taskbtn.indexOf("javascript") == -1) {
                    $(".taskbtn")[0].click();
                    return;
                }
            }
        },1000);
        return;
    }

    //尘缘轻水 中望技术社区
    else if (isURL("chenyuanqingshui") || isURL("forum.zwsoft.cn")) {
        window.setTimeout(function(){
            if (window.find("点击领取今天的签到奖励")) {
                $(".user-w-qd.cur")[0].click();
                return;
            }
        },2000);
        return;
    }

    //LittleSkin
    else if (isURL("littleskin")) {
        window.setTimeout(function(){
            if(window.find("签到")){
                $(".bg-gradient-primary")[0].click();
            }
        },2000);
        return;
    }

    //4K世界 5A版本库 国芯技术交流网站 镜客居
    else if (isURL("4ksj") || isURL("5abbk") || isURL("stcaimcu") || isURL("jkju.cc/plugin.php?id=zqlj_sign")) {
        if (isURL('qiandao.php') || isURL('zqlj_sign')) {
            window.setTimeout(function(){
                var imgs7 = document.getElementsByClassName("btna")[0];
                if(imgs7.textContent.indexOf("点击打卡")==0){
                    $('.btna')[0].click();
                }
            },2000);
        }
        return;
    }

    //iKuuu VPN
    else if (isURL("ikuuu")) {
        window.setTimeout(function(){
            if (isURL('user')) {
                if (window.find("每日签到")) {
                    $(".btn-primary")[0].click();
                    return;
                }
            }
        },1000);
        return;
    }

    //国语视界 食品论坛 Anime字幕论坛 ZMX-IT技术交流论坛
    else if (isURL("cnlang.org")||isURL("foodmate.net")||isURL("acgrip.com")||isURL("bbs.itzmx.com")) {
        if (isURL('dsu_paulsign-sign.html')) {
            if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                $("#kx").click();
                $("#todaysay").val("每天签到水一发。。。");
                showWindow('qwindow', 'qiandao', 'post', '0');
            }
        }
        return;
    }

    //幻天领域
    else if (isURL("acgns")) {
        window.setTimeout(function(){
            if(window.find("签到")){
                $(".inn-nav__point-sign-daily__btn")[0].click();
            }
        },5000);
        return;
    }

    //调侃网
    else if (isURL("tiaokanwang")) {
        window.setTimeout(function(){
            if(window.find("今日签到")){
                $(".erphpdown-sc-btn")[0].click();
            }
        },2000);
        return;
    }

    //知轩藏书 梦楠分享 道言分享网
    else if (isURL("zxcsol") || isURL("mnpc.net") || isURL("lhndy.cn")) {
        window.setTimeout(function() {
            var checkinLinks = document.querySelectorAll('a.initiate-checkin');
            checkinLinks.forEach(function(link) {
                if (link.textContent.includes('今日奖励') || link.textContent.includes('每日签到')) {
                    link.click();
                    return false;
                }
            });
        }, 2000);
        return;
    }

    //51cto
    else if (isURL("blog.51cto.com")) {
        window.setTimeout(function(){
            var imgs8 = document.getElementById('sign');
            if(imgs8 && imgs8.textContent.indexOf("签到领勋章")==0){
                $('#sign').click();
            }
        },2000);
        return;
    }

    //布谷TV 马克喵 咸鱼单机 小黑资源库
    else if (isURL("bugutv.vip/user") || isURL("macat.vip/user") || isURL("xianyudanji.to/user") || isURL("xhzyku.com/user")) {
        window.setTimeout(function(){
            var button = document.querySelector('.go-user-qiandao');
            if (button && button.textContent.includes('每日签到')) {
                button.click();
            }
        },2000);
        return;
    }

    //典尚三维模型网
    else if (isURL("3d.jzsc.net")) {
        window.setTimeout(function(){
            const element = document.getElementById("setsign");
            if (element){
                if (document.getElementById("setsign").textContent.indexOf("已签到") == -1){
                    document.getElementById("setsign").click();
                }
            }
        },2000);
        return;
    }

    //知末网
    else if (isURL("znzmo.com")) {
        window.setTimeout(function(){
            if (isURL('usercenter_task.html?subaction=sign')) {
                $(".task_signIn_week_item_img.heartbeat")[0].click();
                window.setTimeout(function(){
                    $(".signIn-progress-btn")[0].click();
                },1000);
            };
        },9500);
        return;
    }

    //母带吧音乐
    else if (isURL('mudaiba.com')) {
        window.setTimeout(function(){
            var span = document.querySelector('.m_sign');
            if (span.textContent === '签到') {
                document.getElementById('m_sign').click();
            }
        },2000);
        return;
    }

    //知音人音乐网 诺曼底影视 SteamTools
    else if (isURL("zyrhires.com") || isURL("nmandy.net") || isURL("steamtools.net")) {
        window.setTimeout(function(){
            var aElement = document.getElementById('dcsignin_tips');
            var computedStyle = window.getComputedStyle(aElement);
            var backgroundImage = computedStyle.getPropertyValue('background-image');
            if (backgroundImage.includes('signin_no.png')) {
                aElement.click();
                window.setTimeout(function() {
                    var ulElement = document.querySelector('.dcsignin_list');
                    var ninthLiElement = ulElement.children[8];
                    ninthLiElement.click();
                    var submitButton = document.querySelector('button[name="signpn"]');
                    if (submitButton) {
                        submitButton.click();
                    }
                }, 2000);
            }
        },2000);
        return;
    }

    //枫の主题社
    else if (isURL('winmoes.com')) {
        window.setTimeout(function(){
            document.getElementsByClassName('link-block')[7].click();
        },2000);
        return;
    }

    //游蝶网单
    else if (isURL('ydwgames.com') || isURL('yamibo.com/plugin.php?id=zqlj_sign')) {
        window.setTimeout(function(){
            qd4('签到领奖!', 'kx_s');
            return;
        },2000);
        return;
    }

    //离线啦 海外单机游戏论坛
    else if (isURL("lixianla.com") || isURL("youxiou.com")) {
        window.setTimeout(function(){
            var span = document.querySelector('#sg_sign .btn-group button span');
            if (span.textContent.trim() === '签到') {
                span.closest('button').click();
            }
        },2800);
        return;
    }

    //70Games
    else if (isURL("70games.net")) {
        window.setTimeout(function(){
            if(window.find("已签")){
                return;
            }else{
                document.getElementById('sg_sign').click();
                return;
            }
        },2800);
        return;
    }

    //大海资源库
    else if (isURL("vip.lzzcc.cn")) {
        window.setTimeout(function(){
            var qiandao_element = document.getElementsByClassName('img-badge')[3];
            if (qiandao_element && qiandao_element.classList.contains("initiate-checkin")) {
                qiandao_element.click();
            }
        },2000);
        return;
    }

    //苹果软件站
    else if (isURL("iios.club/#/points")) {
        window.setTimeout(function() {
            const elements = document.querySelectorAll('div');
            elements.forEach(element => {
                if (element.textContent === '立即签到') {
                    element.click();
                }
            });
        }, 2000);
        return;
    }

    //V次元
    else if (isURL("66ccff.cc")) {
        window.setTimeout(function() {
            var checkinLinks = document.querySelectorAll('a.initiate-checkin');
            checkinLinks.forEach(function(link) {
                if (link.textContent.includes('签到')) {
                    link.click();
                    return false;
                }
            });
        }, 3000);
        return;
    }

    //OpenEdv
    else if (isURL("openedv.com")) {
        if ($('#dcsignin_tips').attr("style").indexOf("signin_no")!=-1){
            $("#dcsignin_tips").click();
            window.setTimeout(function(){
                $(".dcsignin_list li")[8].click();
                $('#emotid').val('8');
                $('.pnc')[0].click();
            },2000);
        }
        return;
    }

    //掘金
    else if (isURL("juejin.cn/user/center/signin") || isURL("juejin.cn/user/center/signin?avatar_menu")) {
        window.setTimeout(function() {
            const buttons = document.querySelectorAll('.signin.btn');
            buttons.forEach(button => {
                if (button.textContent.includes('立即签到')) {
                    button.click();
                }
            });
        }, 1000);
        return;
    }

    //掘金 免费自动抽奖
    else if (isURL("juejin.cn/user/center/lottery?from=sign_in_success")) {
        window.setTimeout(function() {
            const buttons = document.querySelectorAll('button');
            Array.from(buttons).find(button => button.textContent.includes('去抽奖'))?.click();
            var turntable = document.getElementById('turntable-item-0');
            if (turntable && turntable.querySelector('.text-free')) {
                turntable.click();
            }
        }, 1000);
        return;
    }

    //X64论坛
    else if (isURL("ome.x64bbs.cn")) {
        window.setTimeout(function() {
            var divUm = document.getElementById('um');
            var links = divUm.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                if (links[i].textContent.includes('打卡签到')) {
                    links[i].click();
                    return;
                }
            }
        }, 2000);
        return;
    }

    //工控人家园
    else if (isURL("ymmfa.com/read-gktid-142599.html")) {
        window.setTimeout(function() {
            const chinaTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
            const today = chinaTime.split(' ')[0];
            const time1 = GM_getValue('time1', '');
            const time2 = GM_getValue('time2', '');
            const isTime2Today = time2.split(' ')[0] === today;
            if (!isTime2Today && !time1) {
                const link1 = document.getElementById('url_1');
                if (link1) {
                    link1.click();
                    GM_setValue('time1', chinaTime);
                }
            } else {
                const time1Date = new Date(time1);
                const now = new Date(chinaTime);
                const diffInMinutes = (now - time1Date) / 60000;
                if(!isTime2Today){
                    const checkCondition = () => {
                        const currentTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
                        const currentTimeDate = new Date(currentTime);
                        const time1Date = new Date(time1);
                        const diffInMinutes = (currentTimeDate - time1Date) / 60000;

                        if (diffInMinutes > 60) {
                            const link2 = document.getElementById('url_2');
                            if (link2) {
                                link2.click();
                                GM_setValue('time2', currentTime);
                                GM_setValue('time1', '');
                                alert(QIANDAO);
                            }
                        } else {
                            setTimeout(checkCondition, 10 * 60 * 1000);
                        }
                    };
                    checkCondition();
                }
            }
        }, 1000);
        return;
    }

    //補檔冰室
    else if (isURL("manhuabudangbbs.com/u.php")) {
        window.setTimeout(function() {
            var punchElement = document.getElementById('punch');
            if (punchElement && (punchElement.textContent.includes('每日打卡') || punchElement.textContent.includes('未打卡')) ) {
                punchElement.click();
            }
        }, 2000);
        return;
    }

    //理想股票技术论坛
    else if (isURL("55188.com/plugin.php?id=sign")) {
        window.setTimeout(function(){
            if (window.find("您今天还没有签到哦")) {
                document.getElementById('addsign').click();
            }
        },1000);
        return;
    }

    //星空论坛
    else if (isURL("seikuu.com")){
        window.setTimeout(function(){
            var todaySayTextArea = document.getElementById("todaysay");
            document.getElementById("kx").click();
            if (todaySayTextArea != null) {
                todaySayTextArea.value = "今天天气真好~签到。";
            }
            unsafeWindow.showWindow('qwindow', 'qiandao', 'post', '0');
        },10000);
        return;
    }

    //菁优网
    else if (isURL("jyeoo.com/profile")){
        window.setTimeout(function(){
            if (document.getElementById('sign').textContent === '立即签到') {
                document.getElementById('sign').click();
            }
        },2000);
        return;
    }

    //多看聚影 品技 港知堂社区
    else if (isURL("duokan.club/sign.php") || isURL("tekqart.com/plugin.php?id=zqlj_sign") || isURL("gztown.org")) {
        window.setTimeout(function() {
            var btnaElement = document.getElementsByClassName('btna')[0];
            if (btnaElement && btnaElement.textContent.includes('点击打卡')) {
                btnaElement.click();
            }
        }, 1000);
        return;
    }

    //飞浆
    else if (isURL("aistudio.baidu.com")) {
        window.setTimeout(function() {
            var hoverElement = document.querySelector('.a-s-header-tool-item.header-tool-item-console');
            if (hoverElement) {
                var mouseoverEvent = new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true
                });
                hoverElement.dispatchEvent(mouseoverEvent);
                window.setTimeout(function() {
                    var titleElement = document.querySelector('.user-sign-highlight .user-sign-item-title');
                    if (titleElement && titleElement.textContent.includes('签到')) {
                        titleElement.closest('.user-sign-highlight').click();
                        console.log('已自动点击签到项');
                    }
                }, 1000);
            }
        }, 3000);
        return;
    }

    //洛谷
    else if (isURL("luogu.com.cn")){
        window.setTimeout(function(){
            var am_btn=document.getElementsByClassName('am-btn-warning')[0];
            if (am_btn&&am_btn.textContent === '点击打卡') {
                am_btn.click();
            }
        },2000);
        return;
    }

    //小白游戏网
    else if (isURL("xbgame.net/task")) {
        window.setTimeout(function(){
            document.getElementsByClassName('link-block')[3].click();
        },2000);
        return;
    }

    //apk.tw
    else if (isURL("apk.tw")) {
        window.setTimeout(function(){
            function eventFire(el, etype){
                if (el.fireEvent) {
                    el.fireEvent('on' + etype);
                } else {
                    var evObj = document.createEvent('Events');
                    evObj.initEvent(etype, true, false);
                    el.dispatchEvent(evObj);
                }
            }
            eventFire(document.getElementById('my_amupper'), 'click');
            document.cookie = 'adblock_forbit=1;expires=0';
        },1000);
        return;
    }

    //fotor
    else if (isURL("fotor.com/cn/rewards") || isURL("fotor.com/tw/rewards")) {
        window.setTimeout(function(){
            // 综合特征检测
            const candidate = Array.from(document.querySelectorAll('button')).find(btn => {
                return (btn.textContent.includes('立即领取') || btn.textContent.includes('立即領取')) &&
                    btn.querySelector('span.PointsActivityPageSection_credits__104Wy') &&
                    btn.closest('[class*="dailyCheckIn"]');
            });
            if (candidate) {
                candidate.click();
            }
        },3000);
        return;
    }

    //菜玩社区
    else if (isURL("caigamer.cn")) {
        window.setTimeout(function(){
            var sign_span = document.getElementById('sign_title');
            if(sign_span && sign_span.textContent.indexOf("立即签到")>0){
                $('#sign_title').click();
            }
        },2000);
        return;
    }

    //MineBBS我的世界中文论坛
    else if (isURL("minebbs.com")) {
        window.setTimeout(function(){
            var button_cta = document.getElementsByClassName('button--cta')[0];
            if(button_cta && button_cta.textContent.indexOf("每日签到")==0){
                button_cta.click();
            }
        },2000);
        return;
    }

    //三宫六院
    else if (isURL("sglynp")) {
        window.setTimeout(function(){
            if (window.find("已签到")) {
                return;
            }else{
                document.getElementById('k_misign_topb').querySelector('a').click();
                location.reload();
                setTimeout(() => {
                    window.location.href = 'https://www.sglynp.com/home.php?mod=space&do=notice&view=system';
                }, 1000 + Math.random() * 2000);
            }
        },2000);
        return;
    }

    //绯月ScarletMoon
    else if (isURL("kfpromax.com/kf_growup.php")) {
        window.setTimeout(function(){
            if (window.find("今天的每日奖励已经领过了")) {
                return;
            }else{
                document.querySelector('a[href*="kf_growup.php?ok=3"]').click();
            }
        },2000);
        return;
    }

    //精易论坛
    else if (isURL("bbs.125.la/plugin.php?id=dsu_paulsign:sign")) {
        window.setTimeout(function(){
            if (!window.find("您今日已经签到")) {
                window.location.href = 'https://bbs.125.la/';
                return;
            }else{
                document.getElementById('sign').click();
                setTimeout(() => {
                    document.querySelector('a.layui-layer-btn0')?.click();
                }, 1000 + Math.random() * 2000);
            }
        },2000);
        return;
    }

    //鲲Galgame
    else if (isURL("kungal")) {
        window.setTimeout(() => {
            document.querySelector('div[data-v-729e1e50] > div.cursor-pointer')?.click();
            const signInBtn = document.evaluate('//button[contains(text(),"每日签到")]', document).iterateNext()
                || document.querySelector('button.text-secondary')
                || document.querySelector('div.func button:nth-child(3)');
            if(signInBtn?.disabled === false) {
                signInBtn.click();
                location.reload();
                setTimeout(() => {
                    document.querySelector('div[data-v-729e1e50] > div.cursor-pointer')?.click();
                }, 1000 + Math.random() * 2000);
                console.log('签到成功');
            } else {
                console.log('鲲Galgame未找到每日签到按钮，可能是:\n1.已签到完成；\n2.菜单没有展开；\n3.被弹窗遮挡；\n4.文本代码没加载；\n5.网站代码更新了,给我提交反馈。');
            }
        }, 2000);
        return;
    }

    //雨中小町
    else if (isURL("rainkmc")) {
        window.setTimeout(function(){
            if (window.find("连续签到")){
                return;
            }else{
                document.querySelector('.punch_btn').click();
                setTimeout(() => {
                    location.reload();
                }, 1000 + Math.random() * 2000);
            }
        },2000);
        return;
    }

    //人人影视  登陆后自动刷新一下即可
    else if (isURL("yysub")) {
        window.setTimeout(function(){
            setTimeout(() => {
                location.reload();
            }, 1000 + Math.random() * 2000);
        },2000);
        return;
    }

    //141华人社区
    else if (isURL("141love.net/forum.php")) {
        window.setTimeout(function(){
            if (document.querySelector('img[src*="pperwb.gif"]')) {
                return;
            }else{
                document.querySelector('img[onclick="showWindow(\'pper\', \'dsu_amupper-ppering\');"]').click();
                setTimeout(() => document.querySelector('.pn.pnc').click(), 500);
                setTimeout(() => document.querySelector('#myprompt').click(), 500);
                document.querySelector('#myprompt').click();
            }
        },2000);
        return;
    }

    //夸父资源社
    else if (isURL("kuafuzys.com")) {
        window.setTimeout(function(){
            var tt_sign = document.getElementById("tt_sign");
            if(tt_sign.textContent.indexOf("登录") != -1) {
                alert(NOLOGIN);
                return;
            }else if(tt_sign.textContent.indexOf("立即签到") != -1){
                tt_sign.click();
                return;
            }
        },2000);
        return;
    }

    //JoinQuant
    else if (isURL("joinquant.com/view/user/floor")) {
        window.setTimeout(function(){
            var menu_credit_button=document.getElementsByClassName("menu-credit-button")[0];
            if(menu_credit_button.textContent.indexOf("签到领积分") != -1){
                menu_credit_button.click();
                return;
            }
        },2000);
        return;
    }

    //HadSky
    else if (isURL("hadsky.com/app-puyuetian_phptask-index.html")) {
        console.log('1111');
        window.setTimeout(function(){
            function clickAllRewardButtons() {
                const buttons = document.querySelectorAll('button.btn.get');
                let clickedCount = 0;

                buttons.forEach(button => {
                    const span = button.querySelector('span');
                    if (span) {
                        const text = span.textContent.replace(/\s+/g, '');
                        if (text.includes('领取奖励')) {
                            button.click();
                            clickedCount++;
                            return new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                });
                return clickedCount;
            }
            clickAllRewardButtons();
        },2000);
        return;
    }
    else if (isURL("hadsky.com")) {
        console.log('222');
        window.setTimeout(function(){
            const signButton = document.querySelector("img.pk-hadsky");
            if (signButton) {
                if (signButton.src.includes("NcnZla.png")) {
                    signButton.click();
                }
            }
        },2000);
        return;
    }

    //杉果游戏
    else if (isURL('sonkwo.cn')) {
        window.setTimeout(function(){
            document.getElementsByClassName('store_user_card_action_check')[0].click();
        },2000);
        return;
    }

    //再漫画
    else if (isURL('i.zaimanhua.com')) {
        window.setTimeout(function(){
            document.getElementsByClassName('ant-btn-primary')[0].click();
        },2000);
        return;
    }

    //不忘初心系统博客
    else if (isURL('pc528.net/user-center.html?pd=qiandao')) {
        window.setTimeout(function(){
            document.getElementById("qiandao_ajax").click();
        },2000);
        return;
    }

    //恩山无线论坛
    else if (isURL('right.com.cn/forum/erling_qd-sign_in.html')) {
        window.setTimeout(function(){
            document.getElementById("signin-btn").click();
        },2000);
        return;
    }

    else {
        //其他论坛
        //数据恢复基地论坛
        //火花
        //qd();
        qd2();
        qd3();
    }
})();

//传递的url和当前url是否包含
function isURL(x) {
    return window.location.href.indexOf(x) != -1;
}

//取消前后空格
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

//跳转到传递的地址
function toURL(x) {
    window.location.href=x;
}

function qd() {
    if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
        var kxImg = document.getElementById("kx_s");
        var todaySayTextArea = document.getElementById("todaysay");
        if (kxImg == null) {
            return;
        }
        kxImg.setAttribute('checked', true);
        todaySayTextArea.value = "今天天气真好~签到。";
        var button = document.getElementById("qiandao");
        button.submit();
        return;
    }
}

function qd2() {
    document.getElementById("kx").click();
    var todaySayTextArea = document.getElementById("todaysay");
    if (todaySayTextArea != null) {
        todaySayTextArea.value = "今天天气真好~签到。";
    }
    unsafeWindow.showWindow('qwindow', 'qiandao', 'post', '0');
    return;
}

function qd3() {
    var elements = p.elements,i = 0;
    setTimeout(function () {
        try {
            var els;
            if (elements instanceof Array){ els = p.elements;}
            else {
                els = p.elements();
            }
            while (els[i]) {
                var obj = (p.elements instanceof Array) ? document.querySelector(els[i]) : els[i];
                if (obj == null) return;
                if (obj.tagName == "A" && obj.href.indexOf("javascript") < 0 && obj.onclick == "undefined") GM_openInTab(obj.href);
                else obj.click();
                i++;
            }
        } catch (e) {
            alert(e);
        }
    }, 400);
    setTimeout(function () {
        if (autoClose) window.close();
    }, delay + 100);
    return;
}

function qd4(checkElement, emojiImg) {
    if (isURL('dsu_paulsign:sign') || isURL('dsu_paulsign-sign.html') || isURL('hack.php?H_name=qiandao')) {
        if ((window.find("今天签到了吗") && window.find("写下今天最想说的话")) || window.find("今天未签到")) {
            $("#" + emojiImg).attr('checked', true);
            $("#todaysay").val("每天签到水一发。。。");
            $("#qiandao").submit();
        }
    } else if (window.find(checkElement)) {
        toURL("plugin.php?id=dsu_paulsign:sign");
    }
}

function qd5(checkElement, emojiImg) {
    if (isURL('dsu_paulsign-sign.html')) {
        if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
            $("#" + emojiImg).click();
            $("#todaysay").val("每天签到水一发。。。");
            $("#qiandao").submit();
        }
    } else if (window.find(checkElement)) {
        toURL("dsu_paulsign-sign.html");
    }
}

function toURL_once(url,name='time'){
    const t = new Date();
    const time = [t.getFullYear(),t.getMonth()+1,t.getDate()].join("/");
    const itemName = "qd_"+name;
    if(localStorage.getItem(itemName) != time){
        localStorage.setItem(itemName,time);
        toURL(url);
    }
}
