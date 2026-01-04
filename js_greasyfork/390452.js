// ==UserScript==
// @name        白piao斗鱼
// @author      Sam
// @license     MIT
// @namespace   https://greasyfork.org/zh-CN/scripts/390452
// @version     2024.10
// @description douyu整合优化斗鱼功能脚本（斗鱼精简、斗鱼默认最高画质）
// @match       *://*.douyu.com/g_*
// @match       *://*.douyu.com/0*
// @match       *://*.douyu.com/1*
// @match       *://*.douyu.com/2*
// @match       *://*.douyu.com/3*
// @match       *://*.douyu.com/4*
// @match       *://*.douyu.com/5*
// @match       *://*.douyu.com/6*
// @match       *://*.douyu.com/7*
// @match       *://*.douyu.com/8*
// @match       *://*.douyu.com/9*
// @match       *://*.douyu.com/directory/myFollow
// @match       *://*.douyu.com/topic/*
// @icon        https://www.douyu.com/favicon.ico
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @run-at      document-end
// @note        斗鱼精简 https://greasyfork.org/zh-CN/scripts/386642


/*
主要功能：
    1.精简douyu.com页面元素
    2.直播页面自动页面全屏，自动切换最高清晰度
    3.我的关注页面精简，显示开播时间
*/
// @downloadURL https://update.greasyfork.org/scripts/390452/%E7%99%BDpiao%E6%96%97%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/390452/%E7%99%BDpiao%E6%96%97%E9%B1%BC.meta.js
// ==/UserScript==

(function () {

    'use strict';

    var current_url = window.location.href;
    print_log('url --> ' + current_url);

    window.onload = function () {
        loadStyle();//精简界面
        // removeDom();
    }

    auto_switch_quality();//切换最高画质
    auto_full_screen();//窗口化全屏
    mod_follow_page();//我的关注页面优化
    hide_danmu();//自动关闭弹幕
    hide_ad();//关闭广告1
    hide_ad2();//关闭广告2

})();

function removeDom() {
    let elem_selectors = [
        '.wm-general'
    ]

    elem_selectors.forEach((item, index, array) => {
        print_log(item)
        document.querySelector(item).remove()
        //执行代码
    })
};

function loadStyle() {

    var css = '{display:none !important;height:0 !important}';
    css += '.layout-Player-rank{display:none !important}';
    css += '.layout-Player-barrage{top:0px !important;}';
    css += '.layout-Player-video{bottom:0px !important}';
    css += '.layout-Player-toolbar{visibility:hidden !important;}';
    css += '.layout-Bottom{display:none !important;}';
    css += '.guessGameContainer.is-normalRoom{display:none !important;}';
    css += '.DropPane-ad{display:none !important}';
    css += '.SignBaseComponent-sign-ad{display:none !important}';
    //css += '.AnchorAnnounce{display:none !important;}';  //斗鱼真实人数显示
    //css += '.FansMedalPanel-enter{display:none !important;}'; //牌子
    css += '.layout-Aside{display:none !important;}';
    css += '.Header-download-wrap{display:none !important;}';
    css += '.Header-broadcast-wrap{display:none !important;}';
    css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(5){display:none !important;}';
    css += '.ChatNobleBarrage{display:none !important;}';
    css += '.ChatFansBarrage{display:none !important;}';
    css += '.Horn4Category{display:none !important;}';
    css += '.FirePower{display:none !important;}';
    css += '.TreasureDetail{display:none !important;}';
    css += '.SignChatAd-chat-ad-cls{display:none !important;}';
    css += '.Promotion-nobleRights{display:none !important;}';
    css += '.Task{display:none !important;}';
    css += '.UPlayerLotteryEnter.is-active{display:none !important;}';
    css += '.LotteryContainer{display:none !important;}';
    css += '.layout-Module-head.FollowList-head.is-fixed{display:none !important;}';
    css += '.layout-Banner-item{display:none !important;}';
    css += '.layout-Module-extra{display:none !important;}';
    css += '.Title-anchorPic{display:none !important;}';
    css += '.Title-roomOtherBottom{display:none !important;}';
    css += '.Act129684Bar-view1{display:none !important;}';
    css += '.Act129684Bar-content{display:none !important;}';
    css += '.Act129684-logo{display:none !important;}';
    css += '.ActBase-switch{display:none !important;}';
    css += '.HeaderNav{display:none !important;}';
    css += '.HeaderGif-left{display:none !important;}';
    css += '.HeaderGif-right{display:none !important;}';
    css += '.Prompt-container{display:none !important;}';
    css += '.SysSign-Ad{display:none !important;}';
    css += '.ActDayPay-toast{display:none !important;}';
    css += '.code_box-5cdf5a{display:none !important;}';
    css += '.normalDiv-8b686d{display:none !important;}';
    css += '.closeBg-998534{display:none !important;}';
    css += '.bg-d4758b{display:none !important;}';
    css += '.fireOpenRanking react-draggable react-draggable-dragged{display:none !important;}';
    css += '.vsFestival1908{display:none !important;}';
    css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-normalBody{display:none !important;}';
    css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-miniBody{display:none !important;}';
    css += '.ActSuperFansGroup-component.ActSuperFansGroupBar-plusBody{display:none !important;}';
    css += '.ActSuperFansGroup-logo{display:none !important;}';
    css += '.ActSuperFansGroup-switch{display:none !important;}';
    css += '.TitleSuperFansIcon{display:none !important;}';
    css += '.Act156581Bar{display:none !important;}';
    css += '.Act159742Bar-main--pre{display:none !important;}';
    css += '.Act159742-logo{display:none !important;}';
    css += '.Act159742Bar-wrap{display:none !important;}';
    css += '.Title-columnTag{display:none !important;}';
    css += '.Title-impress.clearFix{display:none !important;}';
    css += '#js-room-activity{display:none !important;}'; //活动 年度决赛 巅峰排行
    css += '.TBarrage-hiIcon{display:none !important;}';
    css += 'span.UserLevel{display:none !important;}';
    css += '.FansMedal{display:none !important;}';
    css += 'span.Motor{display:none !important;}';
    css += 'span.Barrage-hiIcon{display:none !important;}';
    css += 'span.RoomLevel{display:none !important;}';
    css += 'span.Barrage-icon{display:none !important;}';
    css += 'a.ChatAchievement{display:none !important;}';
    css += 'section.layout-Customize{display:none !important;}';
    css += '.GuessGameMiniPanelB-wrapper{display:none !important;}';//视频底部竞猜横幅
    css += '.InteractPlayWithPendant{display:none !important;}';//左下角“我要上车”
    css += '.LiveRoomLoopVideo-thumb {display:none !important;}';
    css += '.PostReward-videoPendant {display:none !important;}'; //左下角 “悬赏挑战”





    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
    print_log('已加载CSS');
};

function mod_follow_page() {
    var current_url = window.location.pathname;
    if (current_url == "/directory/myFollow") {

        //移除‘我的关注’页面推广主播
        let dom_selector = "div.AthenaBoothPanel-wrapper";
        wait_element_loading(dom_selector, function () {

			var cover_list = document.querySelectorAll("li.layout-Cover-item");
            var cover_cards = document.querySelectorAll('.layout-Cover-card');
            for(let i=0;i<cover_cards.length;i++){
                if(cover_cards[i].querySelector('.AthenaBoothPanel-wrapper')){
                    cover_list[i].remove();
                    print_log('移除‘我的关注’页面推广主播');
                }
            }

            //调整收藏页面，增加开播时间显示
            let css_stream = ".DyLiveCover-user {display: block;padding-right: 5px;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;white-space: nowrap;color: #888;font-size: 8px;line-height: 24px;margin: 0;font-weight: 500}"
            loadStyle(css_stream);
            cover_list.forEach(each => {
                let cover_card = each.querySelector("div.DyLiveCover")
                if (cover_card) {
                    let stream_start_time = timeStampTurnTime(cover_card.getAttribute("showtime")),
                        stream_title = cover_card.querySelector("h2.DyLiveCover-user")
                    if (stream_start_time) {
                        stream_title.innerText = stream_start_time
                        //stream_title.style.fontSize = 10;
                    }
                }
            });
        });
    };
};


function auto_full_screen() {
    let dom_selector = "div.wfs-2a8e83"
    wait_element_loading(dom_selector, function () {
        document.querySelector(dom_selector).click();
        print_log('已自动全屏');
        remove_avatar();//调整页面布局
    });
};


function remove_avatar() {
    let dom_selector = "div.Barrage";
    wait_element_loading(dom_selector, function () {
        document.querySelector(dom_selector).style.top = "38px";//调整弹幕区域高度
        document.querySelector('.VideoEntry').remove(); //移除主播视频入口
        document.querySelector('.FullPageFollowGuide').remove(); //移除全屏状态下主播小头像

        print_log('已清理播放器区域');
    });

    let selector_wonderful = '.wonderful-85a057'; //移除控制区域"主播精彩时刻"
    wait_element_loading(selector_wonderful, function () {
        document.querySelector(selector_wonderful).remove();
    });
};


function auto_switch_quality() {
    wait_element_loading('.rate-5c068c', function () {
        document.querySelector('div.tip-e3420a > div.tipItem-898596 > ul > li').click();
        print_log('已切换最高画质');
    })
};

function hide_danmu() {
    wait_element_loading('.rate-5c068c', function () {
        document.querySelector('div.showdanmu-42b0ac').click();
        print_log('已关闭弹幕');
    })
};

function hide_ad() {
wait_element_loading('.IconCardAdCardCont', function () {
document.querySelector('div.IconCardAdCard-close').click();
print_log('已关闭广告1');
})
};
function hide_ad2() {
wait_element_loading('.IconCardAdCardCont', function () {
document.querySelector('div.IconCardAd-close').click();
print_log('已关闭广告2');
})
};

/*
    功能:等待dom加载后执行函数
    dom_selector :选择器参数  待加载的dom = document.querySelector(dom_selector)
    func:待执行函数体，用匿名函数传参
*/
//方式1：
/*
function wait_element_loading(dom_selector, func) {
    let is_DomExist = false;
    for (var i = 0; i < 100; i++) {
        (function (i) {
            setTimeout(function () {
                if (document.querySelector(dom_selector)) {
                    if (!is_DomExist) {
                        func()
                        is_DomExist = true
                    }
                }
            }, (i + 1) * 200);
        })(i)
    }
};
*/
//方式2：无限次数检测dom，防止后台打开页面未及时加载
function wait_element_loading(dom_selector, func) {
    let is_DomExist = false;
    let interval = 100;//时间间隔
    var int_checkDom = setInterval(() => {
        if (document.querySelector(dom_selector)) {
            is_DomExist = true;
            func();
        };
        if (is_DomExist) {
            clearInterval(int_checkDom);
        }
    }, interval);
};


function timeStampTurnTime(timeStamp) {
    if (timeStamp > 0) {
        let date = new Date();
        date.setTime(timeStamp * 1000);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        //return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        return  y + '/' + m + '/' + d + ' ' + h + ':' + minute;
    } else {
        return "";
    }

};

function print_log(msg) {
    const scriptName = '[ Simple Douyu ]';
    console.log(scriptName + '  ' + msg);
};

