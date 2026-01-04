// ==UserScript==
// @name         MR哔哩哔哩助手-自动宽屏模式|自定义布局|智能连播|打造属于自己的B站
// @namespace    https://github.com/iMortRex
// @version      1.0.54
// @description  自动宽屏模式|自定义布局|智能连播...更多功能等你体验, 打造属于自己的B站~
// @author       Mort Rex
// @run-at       document-start
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445241/MR%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A9%E6%89%8B-%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F%7C%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B8%83%E5%B1%80%7C%E6%99%BA%E8%83%BD%E8%BF%9E%E6%92%AD%7C%E6%89%93%E9%80%A0%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445241/MR%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A9%E6%89%8B-%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F%7C%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B8%83%E5%B1%80%7C%E6%99%BA%E8%83%BD%E8%BF%9E%E6%92%AD%7C%E6%89%93%E9%80%A0%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84B%E7%AB%99.meta.js
// ==/UserScript==

// 初始化全局变量
var notificationScriptName = 'MR哔哩哔哩助手';
var notificationNotification = '通知';
var notificationCheck = '检测';
var notificationWarning = '警告';
var notificationError = '错误';

var etime = 30000; // 计时器通用超时时间
var timeoutSwitch = true; // 计时器是否会超时通用开关, true.不会超时, false.会超时
var loadReady = false; // 判断页面是否加载完毕, 等加载完毕再进行网页全屏操作
var isMRMenuMoving = false; // 判断是否拖拽MR菜单
var isMRMenuMovingX = 0;
var isMRMenuMovingY = 0;

// 播放模式
// 自动宽屏模式变量
var autoWidescreenEtime = 0; // 用来记录执行时间的变量
// btn是宽屏模式的按钮, isWidescreenClass是用来判断是否已经是宽屏模式的字符串, 如果已经是宽屏模式class name中会有相关字符串
var autoWidescreenBtn = '';
var autoWidescreenisWidescreenClass = '';
// 网页全屏变量
var fullscreenEtime = 0;
var playerWrapInnerHTML = '';

// 自定义布局
// 移动导航栏到视频下方
var moveNavigationBarEtime = 0;
// 隐藏新版反馈和回到旧版按钮
var hideFeedbackBtnEtime = 0;
// 调整下方左右边距
var downLayoutPaddingEtime = 0;
// 导航栏搜索框长度占满
var searchBarFullEtime = 0;
// 将弹幕栏整合到播放器内
var putSendingBarInPlayerEtime = 0;
// 隐藏观看人数和弹幕装填信息
var hideVideoInfoEtime = 0;
// 播放器内显示选集按钮
var displayEplistEtime = 0;
// 播放器内显示标题
var displayTitleEtime = 0;
// 隐藏播放器内关注按钮
var hideFollowBtnEtime = 0;
// 把标题和头像移到视频下方
var moveTitleAndUpinfoEtime = 0;
// 优化工具提示弹窗
var betterToolTipEtime = 0;
// 隐藏导航栏标签
var hideNavigationBarTagEtime = 0;

// 实用功能与工具
// 智能连播 (多集/分P连播, 单集不连播)
var smartNextPlayEtime = 0;
// 去除宽屏模式左右黑边
var alwaysOpenSubtitleEtime = 0;
// 总是开启字幕
var removeWidescreenBlackEtime = 0;
// 总是开启或关闭弹幕
var alwaysDisableDnmakuEtime = 0;

// 其他
// 判断页面加载完毕
var loadReadyEtime = 0;

// 判断当前页面
// 0.视频, 1.影视, 2.列表, 3.空间, 4.搜索, 5.主页, 6.信息, 7.个人中心, 8.稍后再看页面, 999.未知, 999999.不显示通知
var webStatus = 0;
var webStatusUnknowPage = 999;
var webStatusNotShow = 999999;
var webStatusLog = '';
if (window.location.href.match('bilibili.com/video/')) {
    webStatusLog = '视频';
    webStatus = 0;
} else if (window.location.href.match('bilibili.com/bangumi/')) {
    webStatusLog = '影视';
    webStatus = 1;
} else if (window.location.href.match('bilibili.com/list/')) {
    webStatusLog = '列表';
    webStatus = 2;
} else if (window.location.href.match('space.bilibili.com')) {
    webStatusLog = '空间';
    webStatus = 3;
} else if (window.location.href.match('search.bilibili.com')) {
    webStatusLog = '搜索';
    webStatus = 4;
} else if (window.location.href.match('www.bilibili.com')) {
    webStatusLog = '主页';
    webStatus = 5;
} else if (window.location.href.match('message.bilibili.com') && !window.location.href.match('message.bilibili.com/pages/nav')) {
    webStatusLog = '信息' + window.location.href;
    webStatus = 6;
} else if (window.location.href.match('account.bilibili.com')) {
    webStatusLog = '个人中心';
    webStatus = 7;
} else if (window.location.href.match('bilibili.com/watchlater')) {
    webStatusLog = '稍后再看页面';
    webStatus = 8;
} else if (window.location.href.match('t.bilibili.com')) {
    webStatusLog = '动态';
    webStatus = 9;
} else if (window.location.href.match('member.bilibili.com')) {
    webStatusLog = '创作中心, 不执行脚本';
    webStatus = 999;
} else if (window.location.href.match('message.bilibili.com/pages/nav')) {
    webStatusLog = '页面内信息';
    webStatus = 999999;
} else {
    webStatusLog = '未知页面, 不执行脚本 (' + window.location.href + ')';
    webStatus = 999;
}
if (webStatus == webStatusUnknowPage) {
    console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + webStatusLog);
} else if (webStatus != webStatusNotShow) {
    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '当前是 [' + webStatusLog + '] 页面');
}

if (GM_getValue('MRMenuSwitch') == null) {
    // 菜单是否已打开, 0.不打开, 1.打开
    GM_setValue('MRMenuSwitch', 1);
}
if (GM_getValue('MRMenuReadme') == null) {
    // 是否显示自述, 0.隐藏, 1.显示
    GM_setValue('MRMenuReadme', 1);
}

// 播放模式
if (GM_getValue('MRPlayerMode') == null) {
    // 默认打开自动宽屏模式, 0.默认模式, 1.自动宽屏模式, 2.网页全屏模式
    GM_setValue('MRPlayerMode', 2);
}

// 自定义布局
if (GM_getValue('MRMenuMoveNavigationBar') == null) {
    // 移动导航栏到视频下方, 0.不移动, 1.移动
    GM_setValue('MRMenuMoveNavigationBar', 1);
}
if (GM_getValue('MRMenuHideFeedbackBtn') == null) {
    // 隐藏新版反馈和回到旧版按钮, 0.显示, 1.隐藏
    GM_setValue('MRMenuHideFeedbackBtn', 1);
}
if (GM_getValue('MRMenuDownLayoutPadding') == null) {
    // 调整下方左右边距, 0.不调整, 1.调整
    GM_setValue('MRMenuDownLayoutPadding', 1);
}
if (GM_getValue('MRMenuDownLayoutSearchBarFull') == null) {
    // 导航栏搜索框长度占满, 0.默认, 1.占满
    GM_setValue('MRMenuDownLayoutSearchBarFull', 1);
}
if (GM_getValue('MRMenuPutSendingBarInPlayer') == null) {
    // 将弹幕栏整合到播放器内, 0.不整合, 1.整合
    GM_setValue('MRMenuPutSendingBarInPlayer', 1);
}
if (GM_getValue('MRMenuHideVideoInfo') == null) {
    // 隐藏观看人数和弹幕装填信息, 0.显示, 1.隐藏
    GM_setValue('MRMenuHideVideoInfo', 1);
}
if (GM_getValue('MRMenuDisplayEplist') == null) {
    // 播放器内显示选集按钮, 0.隐藏, 1.显示
    GM_setValue('MRMenuDisplayEplist', 1);
}
if (GM_getValue('MRMenuDisplayTitle') == null) {
    // 播放器内显示标题, 0.隐藏, 1.显示
    GM_setValue('MRMenuDisplayTitle', 1);
}
if (GM_getValue('MRMenuHideFollowBtn') == null) {
    // 隐藏播放器内关注按钮, 0.显示, 1.隐藏
    GM_setValue('MRMenuHideFollowBtn', 0);
}
if (GM_getValue('MRMenuMoveTitleAndUpinfo') == null) {
    // 把标题和头像移到视频下方, 0.不移动, 1.移动
    GM_setValue('MRMenuMoveTitleAndUpinfo', 1);
}
if (GM_getValue('MRMenuBetterToolTip') == null) {
    // 优化工具提示弹窗, 0.关闭, 1.开启
    GM_setValue('MRMenuBetterToolTip', 0);
}
if (GM_getValue('MRMenuHideProgressArea') == null) {
    // 隐藏视频底部蓝条, 0.关闭, 1.开启
    GM_setValue('MRMenuHideProgressArea', 1);
}
//// 隐藏导航栏标签
if (GM_getValue('MRMenuHideNavigationBarTag') == null) {
    // 标签顺序: 0.图标, 1.首页, 2.番剧, 3.直播, 4.游戏中心, 5.会员购, 6.漫画, 7.赛事, 8.活动广告, 9.下载客户端, 数字意义: 0.显示, 1.隐藏
    GM_setValue('MRMenuHideNavigationBarTag', '0011111111');
}

// 实用功能与工具
if (GM_getValue('MRMenuTransparent') == null) {
    // MR菜单是否半透明, 1.不透明, *.半透明
    GM_setValue('MRMenuTransparent', 1);
}
if (GM_getValue('MRMenuSmartNextPlay') == null) {
    // 智能连播, 0.关闭, 1.开启
    GM_setValue('MRMenuSmartNextPlay', 1);
}
if (GM_getValue('MRMenuMoveWindowToTop') == null) {
    // 播放器加载完毕后移动窗口到顶部, 0.不移动, 1.移动
    GM_setValue('MRMenuMoveWindowToTop', 0);
}
if (GM_getValue('MRMenuRemoveWidescreenBlack') == null) {
    // 去除宽屏模式左右黑边 (竖版视频不生效), 0.不去除, 1.去除
    GM_setValue('MRMenuRemoveWidescreenBlack', 0);
}
if (GM_getValue('MRMenuRemoveKeyword') == null) {
    // 去除评论区蓝色关键字, 0.不去除, 1.去除
    GM_setValue('MRMenuRemoveKeyword', 1);
}
if (GM_getValue('MRMenuRemoveUselessComment') == null) {
    // 去除评论区只有@人的无用评论, 0.不去除, 1.去除
    GM_setValue('MRMenuRemoveUselessComment', 1);
}
if (GM_getValue('MRMenuMoreVideoSpeed') == null) {
    // 更多倍速, 0.关闭, 1.开启
    GM_setValue('MRMenuMoreVideoSpeed', 1);
}
if (GM_getValue('MRMenuWatchLaterReplaceURL') == null) {
    // 稍后再看页面替换网址, 0.关闭, 1.开启
    GM_setValue('MRMenuWatchLaterReplaceURL', 1);
}
if (GM_getValue('MRMenuEscQuitViewImage') == null) {
    // 按ESC退出图片预览, 0.关闭, 1.开启
    GM_setValue('MRMenuEscQuitViewImage', 1);
}
if (GM_getValue('MRMenuFixPIPDelay') == null) {
    // 修复视频小窗口延迟, 0.关闭, 1.开启
    GM_setValue('MRMenuFixPIPDelay', 1);
}
if (GM_getValue('MRMenuAlwaysOpenSubtitle') == null) {
    // 总是开启字幕, 0.关闭, 1.开启
    GM_setValue('MRMenuAlwaysOpenSubtitle', 0);
}
//// 总是开启或关闭弹幕
if (GM_getValue('MRMenuAlwaysDisableDnmaku') == null) {
    // 标签顺序: 0.开启功能, 1.总是开启, 2.总是关闭, 数字意义: 0.关闭, 1.开启
    GM_setValue('MRMenuAlwaysDisableDnmaku', '001');
}

// 未知网页不执行
if (webStatus != webStatusUnknowPage && webStatus != webStatusNotShow) {
    // 油猴菜单
    GM_registerMenuCommand('菜单', function () {
        menuClick();
    });

    // 油猴菜单点击事件
    function menuClick() {
        if (GM_getValue('MRMenuSwitch') == 0) {
            GM_setValue('MRMenuSwitch', 1);
            MRMenuElement.style.cssText += 'pointer-events: all; opacity: ' + GM_getValue('MRMenuTransparent') + ';';
        } else {
            GM_setValue('MRMenuSwitch', 0);
            MRMenuElement.style.cssText += 'pointer-events: none; opacity: 0;';
        }
    }

    // MR菜单样式
    // 创建菜单父类容器
    var MRMenuElement = document.createElement('div');
    MRMenuElement.setAttribute('id', 'MRMenu');
    if (GM_getValue('MRMenuSwitch') == 0) {
        MRMenuElement.style.cssText += 'transition: .2s; z-index: 99999; position: fixed; opacity: 0; pointer-events: none;';
    } else {
        MRMenuElement.style.cssText += 'transition: .2s; z-index: 99999; position: fixed; opacity: ' + GM_getValue('MRMenuTransparent') + ';';
    }
    // 创建菜单背景和所有按钮
    var MRMenuBackground = document.createElement('div');
    MRMenuBackground.setAttribute('id', 'MRMenuBackground');
    MRMenuBackground.style.cssText = '\
    display: flex;\
    overflow: auto;\
    flex-wrap: wrap;\
    position: fixed;\
    box-shadow: var(--border) 0px 0px 0px 1.2px !important;\
    width: 600px;\
    height: auto;\
    background-color: var(--bg) !important;\
    z-index: 9999999;\
    border-radius: 8px;\
    left: 50%;\
    top: 50%;\
    transform:translate(-50%, -50%);\
    padding: 0px 0px 8px 0px;\
    max-height: 592px;\
    max-width: 600px;\
    box-sizing: unset;\
    scrollbar-width: none;\
    ';
    MRMenuBackground.innerHTML = '\
    <div id="MRMenuReadme" style="\
    margin: var(--defaultMargin);\
    width: 100%;\
    height: auto;\
    display: none;\
    flex-wrap: wrap;\
    ">\
        <label class="MRMenuText" id="MRMenuReadmeText" style="\
        margin: var(--defaultMargin);\
        width: 100%;\
        height: auto;\
        line-height: 30px;\
        text-align: left;\
        ">\
        MR哔哩哔哩助手首次使用指南:\
        <br>\
        0. 这段文字下次打开就会消失啦, 剩下的就靠你自己啦, 估计也没多少人想看到这东西, 就不弄个开关啦\
        <br>\
        1. 菜单可以向下滚动\
        <br>\
        2. 按住菜单任意位置可以拖拽菜单 (刷新或重新打开网页会重置位置到中心, 不用担心把菜单拖出窗口)\
        <br>\
        3. 脚本不适配旧版哔哩哔哩, 请切换到新版界面\
        </label>\
        <div class="MRMenuSplit"></div>\
    </div>\
    <label class="MRMenuText" id="MRMenuTitle" style="\
    margin: var(--defaultMargin);\
    width: 100%;\
    height: 30px;\
    line-height: 30px;\
    ">\
    MR哔哩哔哩助手菜单\
    <span id="MRMenuStatus" style="color: var(--closeBtnHoverBg) !important;">\
     (未激活, 请等待页面加载完毕)\
    </span>\
    </label>\
    <button type="button" id="MRMenuCloseBtn">\
    关闭\
    </button>\
    <div class="MRMenuOptionParent" id="MRMenuPlayerMode">\
        <label class="MRMenuTitleText" id="MRMenuPlayerModeText">\
        播放器模式</label>\
        <div class="MRMenuSplit"></div>\
        <div class="MRMenuOption" id="MRMenuNormal">\
            <label class="MRMenuText" id="MRMenuNormalText">\
            默认模式</label>\
            <label class="MRMenuSwitch" id="MRMenuNormalSwitch">\
                <input type="checkbox" id="MRMenuNormalCheckbox">\
                <div class="MRMenuSlider" id="MRMenuNormalSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuAutoWidescreen">\
            <label class="MRMenuText" id="MRMenuAutoWidescreenText">\
            自动宽屏模式</label>\
            <label class="MRMenuSwitch" id="MRMenuAutoWidescreenSwitch">\
                <input type="checkbox" id="MRMenuAutoWidescreenCheckbox">\
                <div class="MRMenuSlider" id="MRMenuAutoWidescreenSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuFullscreen">\
            <label class="MRMenuText" id="MRMenuFullscreenText">\
            网页全屏模式</label>\
            <label class="MRMenuSwitch" id="MRMenuFullscreenSwitch">\
                <input type="checkbox" id="MRMenuFullscreenCheckbox">\
                <div class="MRMenuSlider" id="MRMenuFullscreenSlider"></div>\
            </label>\
        </div>\
    </div>\
    <div class="MRMenuOptionParent" id="MRMenuCustomLayout">\
        <label class="MRMenuTitleText" id="MRMenuCustomLayoutText\">\
        自定义布局</label>\
        <div class="MRMenuSplit"></div>\
        <div class="MRMenuOption" id="MRMenuMoveNavigationBar">\
            <label class="MRMenuText" id="MRMenuMoveNavigationBarText">\
            移动导航栏到视频下方</label>\
            <label class="MRMenuSwitch" id="MRMenuMoveNavigationBarSwitch">\
                <input type="checkbox" id="MRMenuMoveNavigationBarCheckbox">\
                <div class="MRMenuSlider" id="MRMenuMoveNavigationBarSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuHideFeedbackBtn">\
            <label class="MRMenuText" id="MRMenuHideFeedbackBtnText">\
            隐藏新版反馈和回到旧版按钮</label>\
            <label class="MRMenuSwitch" id="MRMenuHideFeedbackBtnSwitch">\
                <input type="checkbox" id="MRMenuHideFeedbackBtnCheckbox">\
                <div class="MRMenuSlider" id="MRMenuHideFeedbackBtnSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuDownLayoutPadding">\
            <label class="MRMenuText" id="MRMenuDownLayoutPaddingText">\
            调整下方左右边距</label>\
            <label class="MRMenuSwitch" id="MRMenuDownLayoutPaddingSwitch">\
                <input type="checkbox" id="MRMenuDownLayoutPaddingCheckbox">\
                <div class="MRMenuSlider" id="MRMenuDownLayoutPaddingSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuSearchBarFull">\
            <label class="MRMenuText" id="MRMenuSearchBarFullText">\
            导航栏搜索框长度占满</label>\
            <label class="MRMenuSwitch" id="MRMenuSearchBarFullSwitch">\
                <input type="checkbox" id="MRMenuSearchBarFullCheckbox">\
                <div class="MRMenuSlider" id="MRMenuSearchBarFullSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuPutSendingBarInPlayer">\
            <label class="MRMenuText" id="MRMenuPutSendingBarInPlayerText">\
            将弹幕栏整合到播放器内</label>\
            <label class="MRMenuSwitch" id="MRMenuPutSendingBarInPlayerSwitch">\
                <input type="checkbox" id="MRMenuPutSendingBarInPlayerCheckbox">\
                <div class="MRMenuSlider" id="MRMenuPutSendingBarInPlayerSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuHideVideoInfo">\
            <label class="MRMenuText" id="MRMenuHideVideoInfoText">\
            隐藏观看人数和弹幕装填信息</label>\
            <label class="MRMenuSwitch" id="MRMenuHideVideoInfoSwitch">\
                <input type="checkbox" id="MRMenuHideVideoInfoCheckbox">\
                <div class="MRMenuSlider" id="MRMenuHideVideoInfoSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuDisplayEplist">\
            <label class="MRMenuText" id="MRMenuDisplayEplistText">\
            播放器内显示选集按钮</label>\
            <label class="MRMenuSwitch" id="MRMenuDisplayEplistSwitch">\
                <input type="checkbox" id="MRMenuDisplayEplistCheckbox">\
                <div class="MRMenuSlider" id="MRMenuDisplayEplistSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuDisplayTitle">\
            <label class="MRMenuText" id="MRMenuDisplayTitleText">\
            播放器内显示标题</label>\
            <label class="MRMenuSwitch" id="MRMenuDisplayTitleSwitch">\
                <input type="checkbox" id="MRMenuDisplayTitleCheckbox">\
                <div class="MRMenuSlider" id="MRMenuDisplayTitleSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuHideFollowBtn">\
            <label class="MRMenuText" id="MRMenuHideFollowBtnText">\
            隐藏播放器内关注按钮</label>\
            <label class="MRMenuSwitch" id="MRMenuHideFollowBtnSwitch">\
                <input type="checkbox" id="MRMenuHideFollowBtnCheckbox">\
                <div class="MRMenuSlider" id="MRMenuHideFollowBtnSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuMoveTitleAndUpinfo">\
            <label class="MRMenuText" id="MRMenuMoveTitleAndUpinfoText">\
            把标题和头像移到视频下方</label>\
            <label class="MRMenuSwitch" id="MRMenuMoveTitleAndUpinfoSwitch">\
                <input type="checkbox" id="MRMenuMoveTitleAndUpinfoCheckbox">\
                <div class="MRMenuSlider" id="MRMenuMoveTitleAndUpinfoSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuBetterToolTip">\
            <label class="MRMenuText" id="MRMenuBetterToolTipText">\
            优化工具提示弹窗</label>\
            <label class="MRMenuSwitch" id="MRMenuBetterToolTipSwitch">\
                <input type="checkbox" id="MRMenuBetterToolTipCheckbox">\
                <div class="MRMenuSlider" id="MRMenuBetterToolTipSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuHideProgressArea">\
            <label class="MRMenuText" id="MRMenuHideProgressAreaText">\
            隐藏视频底部蓝条</label>\
            <label class="MRMenuSwitch" id="MRMenuHideProgressAreaSwitch">\
                <input type="checkbox" id="MRMenuHideProgressAreaCheckbox">\
                <div class="MRMenuSlider" id="MRMenuHideProgressAreaSlider"></div>\
            </label>\
        </div>\
        <label class="MRMenuTitleText" id="MRMenuHideNavigationBarTagText">\
        隐藏导航栏标签</label>\
        <div class="MRMenuSplit"></div>\
        <div class="MRMultipleOptionsParent" id="MRMenuHideNavigationBarTag">\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag0">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag0Text">\
                图标</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag0Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag0Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag0Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag1">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag1Text">\
                首页</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag1Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag1Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag1Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag2">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag2Text">\
                番剧</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag2Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag2Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag2Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag3">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag3Text">\
                直播</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag3Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag3Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag3Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag4">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag4Text">\
                游戏</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag4Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag4Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag4Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag5">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag5Text">\
                会员购</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag5Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag5Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag5Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag6">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag6Text">\
                漫画</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag6Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag6Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag6Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag7">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag7Text">\
                赛事</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag7Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag7Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag7Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag8">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag8Text">\
                活动广告</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag8Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag8Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag8Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuHideNavigationBarTag9">\
                <label class="MRMenuText" id="MRMenuHideNavigationBarTag9Text">\
                下载客户端</label>\
                <label class="MRMenuSwitch" id="MRMenuHideNavigationBarTag9Switch">\
                    <input type="checkbox" id="MRMenuHideNavigationBarTag9Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuHideNavigationBarTag9Slider"></div>\
                </label>\
            </div>\
        </div>\
    </div>\
    <div class="MRMenuOptionParent" id="MRMenuFunctions">\
        <label class="MRMenuTitleText" id="MRMenuFunctionsText">\
        实用功能与工具</label>\
        <div class="MRMenuSplit"></div>\
        <div class="MRMenuOption" id="MRMenuTransparent">\
            <label class="MRMenuText" id="MRMenuTransparentText">\
            菜单半透明</label>\
            <label class="MRMenuSwitch" id="MRMenuTransparentSwitch">\
                <input type="checkbox" id="MRMenuTransparentCheckbox">\
                <div class="MRMenuSlider" id="MRMenuTransparentSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuSmartNextPlay">\
            <label class="MRMenuText" id="MRMenuSmartNextPlayText">\
            智能连播 (多集/分P连播, 单集不连播)</label>\
            <label class="MRMenuSwitch" id="MRMenuSmartNextPlaySwitch">\
                <input type="checkbox" id="MRMenuSmartNextPlayCheckbox">\
                <div class="MRMenuSlider" id="MRMenuSmartNextPlaySlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuMoveWindowToTop">\
            <label class="MRMenuText" id="MRMenuMoveWindowToTopText">\
            播放器加载完毕后移动窗口到顶部</label>\
            <label class="MRMenuSwitch" id="MRMenuMoveWindowToTopSwitch">\
                <input type="checkbox" id="MRMenuMoveWindowToTopCheckbox">\
                <div class="MRMenuSlider" id="MRMenuMoveWindowToTopSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuRemoveWidescreenBlack">\
            <label class="MRMenuText" id="MRMenuRemoveWidescreenBlackText">\
            去除宽屏模式左右黑边 (竖版视频不生效)</label>\
            <label class="MRMenuSwitch" id="MRMenuRemoveWidescreenBlackSwitch">\
                <input type="checkbox" id="MRMenuRemoveWidescreenBlackCheckbox">\
                <div class="MRMenuSlider" id="MRMenuRemoveWidescreenBlackSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuRemoveKeyword">\
            <label class="MRMenuText" id="MRMenuRemoveKeywordText">\
            去除评论区蓝色关键字</label>\
            <label class="MRMenuSwitch" id="MRMenuRemoveKeywordSwitch">\
                <input type="checkbox" id="MRMenuRemoveKeywordCheckbox">\
                <div class="MRMenuSlider" id="MRMenuRemoveKeywordSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuRemoveUselessComment">\
            <label class="MRMenuText" id="MRMenuRemoveUselessCommentText">\
            去除评论区只有@人的无用评论</label>\
            <label class="MRMenuSwitch" id="MRMenuRemoveUselessCommentSwitch">\
                <input type="checkbox" id="MRMenuRemoveUselessCommentCheckbox">\
                <div class="MRMenuSlider" id="MRMenuRemoveUselessCommentSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuMoreVideoSpeed">\
            <label class="MRMenuText" id="MRMenuMoreVideoSpeedText">\
            更多倍速</label>\
            <label class="MRMenuSwitch" id="MRMenuMoreVideoSpeedSwitch">\
                <input type="checkbox" id="MRMenuMoreVideoSpeedCheckbox">\
                <div class="MRMenuSlider" id="MRMenuMoreVideoSpeedSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuWatchLaterReplaceURL">\
            <label class="MRMenuText" id="MRMenuWatchLaterReplaceURLText">\
            稍后再看页面替换网址</label>\
            <label class="MRMenuSwitch" id="MRMenuWatchLaterReplaceURLSwitch">\
                <input type="checkbox" id="MRMenuWatchLaterReplaceURLCheckbox">\
                <div class="MRMenuSlider" id="MRMenuWatchLaterReplaceURLSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuEscQuitViewImage">\
            <label class="MRMenuText" id="MRMenuEscQuitViewImageText">\
            按ESC退出图片预览</label>\
            <label class="MRMenuSwitch" id="MRMenuEscQuitViewImageSwitch">\
                <input type="checkbox" id="MRMenuEscQuitViewImageCheckbox">\
                <div class="MRMenuSlider" id="MRMenuEscQuitViewImageSlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuFixPIPDelay">\
            <label class="MRMenuText" id="MRMenuFixPIPDelayText">\
            修复视频小窗口延迟</label>\
            <label class="MRMenuSwitch" id="MRMenuFixPIPDelaySwitch">\
                <input type="checkbox" id="MRMenuFixPIPDelayCheckbox">\
                <div class="MRMenuSlider" id="MRMenuFixPIPDelaySlider"></div>\
            </label>\
        </div>\
        <div class="MRMenuOption" id="MRMenuAlwaysOpenSubtitle">\
            <label class="MRMenuText" id="MRMenuAlwaysOpenSubtitleText">\
            总是开启字幕</label>\
            <label class="MRMenuSwitch" id="MRMenuAlwaysOpenSubtitleSwitch">\
                <input type="checkbox" id="MRMenuAlwaysOpenSubtitleCheckbox">\
                <div class="MRMenuSlider" id="MRMenuAlwaysOpenSubtitleSlider"></div>\
            </label>\
        </div>\
        <label class="MRMenuTitleText" id="MRMenuAlwaysDisableDnmakuText">\
        总是开启或关闭弹幕</label>\
        <div class="MRMenuSplit"></div>\
        <div class="MRMultipleOptionsParent" id="MRMenuAlwaysDisableDnmaku">\
            <div class="MRMenuOption" id="MRMenuAlwaysDisableDnmaku0">\
                <label class="MRMenuText" id="MRMenuAlwaysDisableDnmaku0Text">\
                开启功能</label>\
                <label class="MRMenuSwitch" id="MRMenuAlwaysDisableDnmaku0Switch">\
                    <input type="checkbox" id="MRMenuAlwaysDisableDnmaku0Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuAlwaysDisableDnmaku0Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuAlwaysDisableDnmaku1">\
                <label class="MRMenuText" id="MRMenuAlwaysDisableDnmaku1Text">\
                总是开启</label>\
                <label class="MRMenuSwitch" id="MRMenuAlwaysDisableDnmaku1Switch">\
                    <input type="checkbox" id="MRMenuAlwaysDisableDnmaku1Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuAlwaysDisableDnmaku1Slider"></div>\
                </label>\
            </div>\
            <div class="MRMenuOption" id="MRMenuAlwaysDisableDnmaku2">\
                <label class="MRMenuText" id="MRMenuAlwaysDisableDnmaku2Text">\
                总是关闭</label>\
                <label class="MRMenuSwitch" id="MRMenuAlwaysDisableDnmaku2Switch">\
                    <input type="checkbox" id="MRMenuAlwaysDisableDnmaku2Checkbox">\
                    <div class="MRMenuSlider" id="MRMenuAlwaysDisableDnmaku2Slider"></div>\
                </label>\
            </div>\
        </div>\
    </div>\
    ';

    // 创建菜单样式
    var MRMenuStyle = document.createElement('style');
    MRMenuStyle.innerHTML = '\r\n\
    /* 深色模式样式 */\r\n\
    @media(prefers-color-scheme: dark) {\r\n\
        :root {\r\n\
        --bg: rgba(30, 30, 30, 1);\r\n\
        --bg2: rgba(45, 45, 45, 1);\r\n\
        --textColor: rgba(255, 255, 255, 1);\r\n\
        --closeBtnActiveTextColor: rgba(205, 205, 205, 1);\r\n\
        --closeBtnHoverBg: rgba(230, 50, 50, 1);\r\n\
        --closeBtnActiveBg: rgba(130, 30, 30, 1);\r\n\
        --sliderBg: rgba(25, 25, 25, 1);\r\n\
        --sliderBgChecked: rgba(30, 150, 245, 1);\r\n\
        --sliderBtn: rgba(255, 255, 255, 1);\r\n\
        --border: rgba(0, 0, 0, 0.3);\r\n\
        --border2: rgba(40, 40, 40, 1);\r\n\
        --split: rgba(30, 30, 30, 1);\r\n\
        --darkreader-bg--sliderBtn: var(--sliderBtn)\r\n\
        }\r\n\
    }\r\n\
    \r\n\
    /* 浅色模式样式 */\r\n\
    @media(prefers-color-scheme: light) {\r\n\
        :root {\r\n\
            --bg: rgba(240, 240, 240, 1);\r\n\
            --bg2: rgba(250, 250, 250, 1);\r\n\
            --textColor: rgba(0, 0, 0, 1);\r\n\
            --closeBtnActiveTextColor: rgba(60, 60, 60, 1);\r\n\
            --closeBtnHoverBg: rgba(230, 50, 50, 1);\r\n\
            --closeBtnActiveBg: rgba(230, 150, 150, 1);\r\n\
            --sliderBg: rgba(205, 205, 205, 1);\r\n\
            --sliderBgChecked: rgba(30, 150, 245, 1);\r\n\
            --sliderBtn: rgba(255, 255, 255, 1);\r\n\
            --border: rgba(0, 0, 0, 0.3);\r\n\
            --border2: rgba(220, 220, 220, 1);\r\n\
            --split: rgba(230, 230, 230, 1);\r\n\
        }\r\n\
    }\r\n\
    \r\n\
    /* 全局样式 */\r\n\
    :root {\r\n\
        --defaultMargin: 10px 10px 0px 10px;\r\n\
        --defaultMargin2: 0px 0px 0px 10px;\r\n\
    }\r\n\
    \r\n\
    /* MR菜单容器父类样式 */\r\n\
    .MRMenuOptionParent {\r\n\
        margin: var(--defaultMargin);\r\n\
        justify-content: space-between;\r\n\
        background-color: var(--bg2) !important;\r\n\
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px !important;\r\n\
        border-radius: 6px;\r\n\
        width: 100%;\r\n\
        height: auto;\r\n\
        padding: 0px 10px 10px 0px;\r\n\
        pointer-events: none;\r\n\
    }\r\n\
    /* MR菜单标题文本样式 */\r\n\
    .MRMenuTitleText {\r\n\
        margin: var(--defaultMargin);\r\n\
        font-size: 16px;\r\n\
        text-align: center;\r\n\
        user-select: none;\r\n\
        width: 100%;\r\n\
        height: auto;\r\n\
        line-height: 28px;\r\n\
        color: var(--textColor) !important;\r\n\
    }\r\n\
    /* MR菜单标准文本样式 */\r\n\
    .MRMenuText {\r\n\
        margin: var(--defaultMargin2);\r\n\
        font-size: 16px;\r\n\
        text-align: center;\r\n\
        user-select: none;\r\n\
        width: auto;\r\n\
        height: auto;\r\n\
        line-height: 28px;\r\n\
        color: var(--textColor) !important;\r\n\
    }\r\n\
    /* MR菜单选项样式 */\r\n\
    .MRMenuOption {\r\n\
        margin: var(--defaultMargin);\r\n\
    }\r\n\
    /* MR菜单开关样式 */\r\n\
    .MRMenuSwitch {\r\n\
        margin: var(--defaultMargin2);\r\n\
        position: relative;\r\n\
        display: inline-block;\r\n\
        width: 50px;\r\n\
        height: 28px;\r\n\
    }\r\n\
    \r\n\
    /* MR菜单开关按钮背景样式 */\r\n\
    .MRMenuSlider {\r\n\
        border-radius: 26px;\r\n\
        position: absolute;\r\n\
        cursor: pointer;\r\n\
        top: 0;\r\n\
        left: 0;\r\n\
        right: 0;\r\n\
        bottom: 0;\r\n\
        background-color: var(--sliderBg) !important;\r\n\
        transition: .2s;\r\n\
    }\r\n\
    \r\n\
    /* MR菜单多选项功能样式 */\r\n\
    .MRMultipleOptionsParent {\r\n\
        display: flex;\r\n\
        flex-wrap: wrap;\r\n\
        justify-content: space-between;\r\n\
    }\r\n\
    \r\n\
    /* 隐藏复选框 */\r\n\
    .MRMenuSwitch input {\r\n\
        display: none;\r\n\
    }\r\n\
    \r\n\
    /* 未加载完毕父类禁止点击 */\r\n\
    .MRMenuOptionParent[mr_is_loaded=true] {\r\n\
        pointer-events: unset;\r\n\
    }\r\n\
    \r\n\
    /* 开关按钮样式 */\r\n\
    .MRMenuSlider:before {\r\n\
        border-radius: 50%;\r\n\
        position: absolute;\r\n\
        content: "";\r\n\
        height: 24px;\r\n\
        width: 24px;\r\n\
        left: 2px;\r\n\
        bottom: 2px;\r\n\
        background-color: var(--sliderBtn) !important;\r\n\
        transition: .2s;\r\n\
    }\r\n\
    \r\n\
    /* 开关不可点击时的样式 */\r\n\
    input:checked+.MRMenuSlider[mr_disable=true] {\r\n\
        background-color: var(--sliderBg) !important;\r\n\
    }\r\n\
    .MRMenuSlider[mr_disable=true]:before {\r\n\
        opacity: 0.4;\r\n\
    }\r\n\
    \r\n\
    /* 开关开启样式 */\r\n\
    input:checked+.MRMenuSlider {\r\n\
        background-color: var(--sliderBgChecked) !important;\r\n\
    }\r\n\
    \r\n\
    /* 开关开启时样式, 移动按钮到右侧 */\r\n\
    input:checked+.MRMenuSlider:before {\r\n\
        transform: translateX(22px);\r\n\
    }\r\n\
    \r\n\
    /* 分割线样式 */\r\n\
    .MRMenuSplit {\r\n\
        margin: 10px 10px 0px 20px;\r\n\
        background-color: var(--split) !important;\r\n\
        border-radius: 2px;\r\n\
        width: 100%;\r\n\
        height: 2px;\r\n\
    }\r\n\
    \r\n\
    /* 分类容器样式 */\r\n\
    .MRMenuOptionParent {\r\n\
        display: flex;\r\n\
        flex-wrap: wrap;\r\n\
        user-select: none;\r\n\
    }\r\n\
    /* 选项父类容器样式 */\r\n\
    .MRMenuOption {\r\n\
        display: flex;\r\n\
        flex-wrap: wrap;\r\n\
        user-select: none;\r\n\
    }\r\n\
    /* 菜单关闭按钮样式 */\r\n\
    #MRMenuCloseBtn {\r\n\
        width: 52px;\r\n\
        height: 30px;\r\n\
        margin: -30px 0px 0px calc(100% - 62px);\r\n\
        font-size: 16px;\r\n\
        text-align: center;\r\n\
        line-height: 30px;\r\n\
        word-spacing: 0px;\r\n\
        box-sizing: border-box;\r\n\
        border: 0;\r\n\
        border-radius: 6px;\r\n\
        background-color: var(--bg2);\r\n\
        color: var(--textColor);\r\n\
        outline: none;\r\n\
        user-select: none;\r\n\
        box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 1px !important;\r\n\
        transition: .1s;\r\n\
        padding: 0px 0px 0px 1px;\r\n\
    }\r\n\
    \r\n\
    /* 菜单关闭按钮鼠标悬浮时样式 */\r\n\
    #MRMenuCloseBtn:hover {\r\n\
        color: rgba(255, 255, 255, 1);\r\n\
        background-color: var(--closeBtnHoverBg);\r\n\
    }\r\n\
    \r\n\
    /* 菜单关闭按钮被点击时样式 */\r\n\
    #MRMenuCloseBtn:active {\r\n\
        color: rgba(255, 255, 255, 1);\r\n\
        background-color: var(--closeBtnActiveBg);\r\n\
    }\r\n\
    \r\n\
    /* 弹幕栏禁用隐藏 */\r\n\
    [mr_always_display=true] {\r\n\
        display: block !important;\r\n\
    }\r\n\
    \r\n\
    /* 弹幕栏整合到播放器时隐藏白线 */\r\n\
    .bpx-player-sending-area[mr_inside_player=true]:before {\r\n\
        display: none !important;\r\n\
    }\r\n\
    .bilibili-player-video-bottom-area[mr_inside_player=true]:before {\r\n\
        display: none !important;\r\n\
    }\r\n\
    \r\n\
    /* 弹幕栏发送提示字体颜色 */\r\n\
    [mr_inside_player=true]::-webkit-input-placeholder {\r\n\
        color: hsla(0,0%,100%,0.6) !important;\r\n\
    }\r\n\
    \r\n\
    /* 显示选集按钮样式 */\r\n\
    [mr_show_eplist=true] {\r\n\
        width: 36px;\r\n\
        visibility: visible;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方标题样式 */\r\n\
    #viewbox_report[mr_layout=true] {\r\n\
        height: 86px;\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
        padding: 16px 0px 12px 0px;\r\n\
    }\r\n\
    /* 列表 */\r\n\
    .video-info-container[mr_layout=true] {\r\n\
        height: 86px;\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
        padding: 16px 0px 12px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方头像栏样式 */\r\n\
    .up-panel-container[mr_layout=true] {\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
        padding: 16px 0px 10px 0px;\r\n\
        margin: 0px;\r\n\
    }\r\n\
    /* 列表 */\r\n\
    .up-panel-container[mr_layout=true] {\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
        padding: 16px 0px 10px 0px;\r\n\
        margin: 0px;\r\n\
    }\r\n\
    /* 把标题和头像移到视频下方头像栏高度 */\r\n\
    .up-info-container[mr_layout=true] {\r\n\
        height: 48px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方播放器样式 */\r\n\
    #playerWrap[mr_layout=true] {\r\n\
        margin: 15px 0px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方弹幕列表样式 */\r\n\
    #danmukuBox[mr_layout=true] {\r\n\
        margin: 15px 0px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方充电关注面板样式 */\r\n\
    .upinfo-btn-panel[mr_layout=true] {\r\n\
        float: right;\r\n\
        margin: -48px 10px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方旧充电按钮样式 */\r\n\
    .old-charge-btn[mr_layout=true] {\r\n\
        height: 48px !important;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方新充电按钮样式 */\r\n\
    .new-charge-btn[mr_layout=true] {\r\n\
        height: 48px !important;\r\n\
        margin: 0px 12px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方关注按钮样式 */\r\n\
    .follow-btn[mr_layout=true] {\r\n\
        height: 48px !important;\r\n\
        width: 130px !important;\r\n\
        padding: 0px 8px !important;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方未关注按钮样式 */\r\n\
    .not-follow[mr_layout=true] {\r\n\
        height: 48px !important;\r\n\
        width: 130px !important;\r\n\
        padding: 0px 8px !important;\r\n\
        margin: 0px 0px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方名称样式 */\r\n\
    .up-name[mr_layout=true] {\r\n\
        margin: 4px 0px 0px 0px;\r\n\
    }\r\n\
    /* 列表 */\r\n\
    .up-detail-top[mr_layout=true] {\r\n\
        margin: 4px 0px 0px 0px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方头像装饰样式 */\r\n\
    .has-pendant[mr_layout=true] {\r\n\
        margin: -16px 0px -10px -8px;\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方联合投稿 */\r\n\
    .mmembers-info-container[mr_layout=true] {\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
    }\r\n\
    \r\n\
    /* 把标题和头像移到视频下方下方右侧上方间隔 */\r\n\
    .playlist-container--right[mr_layout=true] {\r\n\
        margin-top: 16px;\r\n\
    }\r\n\
    .right-container[mr_layout=true] {\r\n\
        margin-top: 16px;\r\n\
    }\r\n\
    /* 列表 */\r\n\
    .members-info-container[mr_layout=true] {\r\n\
        border-bottom: 1px solid var(--line_regular);\r\n\
    }\r\n\
    \r\n\
    /* 隐藏滚动条 */\r\n\
    body *::-webkit-scrollbar {\r\n\
        width: 0px !important;\r\n\
        height: 0px !important;\r\n\
    }\r\n\
    \r\n\
    /* 影视页网页全屏播放器高度修正 */\r\n\
    #bilibili-player-wrap[mr_fullscreen=true] {\r\n\
        width: auto !important;\r\n\
        height: auto !important;\r\n\
        padding: 0 !important;\r\n\
        z-index: 50 !important;\r\n\
        position: relative !important;\r\n\
    }\r\n\
    \r\n\
    /* 影视页网页全屏下方整体修正 */\r\n\
    .main-container[mr_fullscreen=true] {\r\n\
        margin: 20px auto !important;\r\n\
        display: flex !important;\r\n\
    }\r\n\
    /* 影视页网页全屏下方整体修正 */\r\n\
    .main-container[mr_margin_fix=true] {\r\n\
        margin-left: 20px !important;\r\n\
        margin-right: 20px !important;\r\n\
        width: auto !important;\r\n\
    }\r\n\
    .player-left-components[mr_margin_fix=true] {\r\n\
        padding-right: 20px !important;\r\n\
    }\r\n\
    \r\n\
    /* 影视页网页全屏左下方修正 */\r\n\
    .plp-l[mr_fullscreen=true] {\r\n\
        padding-top: 0 !important;\r\n\
    }\r\n\
    \r\n\
    /* 影视页网页全屏右下方修正 */\r\n\
    .plp-r[mr_fullscreen=true] {\r\n\
        margin-top: 0 !important;\r\n\
        padding-top: 0 !important;\r\n\
        width: 500px !important;\r\n\
    }\r\n\
    \r\n\
    /* 影视页网页全屏观看人数和弹幕装填宽度修正 */\r\n\
    .bpx-player-video-info[mr_fullscreen=true] {\r\n\
        width: auto !important;\r\n\
    }\r\n\
    /* 隐藏视频底部蓝条样式 */\r\n\
    .bpx-player-shadow-progress-area[mr_hide_progress_area=true] {\r\n\
        display: none !important;\r\n\
    }\r\n\
    ';

    // 把菜单背景移到菜单父类容器里
    MRMenuElement.appendChild(MRMenuBackground);
    // 把菜单样式移到菜单父类容器
    MRMenuElement.appendChild(MRMenuStyle);
}

(function () {
    'use strict';

    // 未知网页不执行
    if (webStatus != webStatusUnknowPage && webStatus != webStatusNotShow) {
        // 直接执行
        //
        // 判断页面是否加载完毕
        loadReadyFunction();
        // 播放模式
        if (GM_getValue('MRPlayerMode') == 0) {
            autoWidescreen();
        } else if (GM_getValue('MRPlayerMode') == 1) {
            autoWidescreen();
        } else if (GM_getValue('MRPlayerMode') == 2) {
            fullscreen();
        }
        // 自定义布局
        // 隐藏新版反馈和回到旧版按钮
        if (GM_getValue('MRMenuHideFeedbackBtn') == 1) {
            hideFeedbackBtn();
        }
        // 隐藏观看人数和弹幕装填信息
        if (GM_getValue('MRMenuHideVideoInfo') == 1) {
            hideVideoInfo();
        }
        // 播放器内显示选集按钮
        if (GM_getValue('MRMenuDisplayEplist') == 1) {
            displayEplist();
        }
        // 隐藏播放器内关注按钮
        if (GM_getValue('MRMenuHideFollowBtn') == 1) {
            hideFollowBtn();
        }
        // 把标题和头像移到视频下方
        if (GM_getValue('MRMenuMoveTitleAndUpinfo') == 1) {
            moveTitleAndUpinfo();
        }
        // 实用功能与工具
        // 智能连播
        smartNextPlay();

        // 给宽屏模式按钮注册点击事件
        var widescreenBtnCheckEtime = 0;
        if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
            widescreenBtnCheck();
            function widescreenBtnCheck() {
                if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                    document.getElementsByClassName('bpx-player-ctrl-wide')[0].addEventListener('click', function () {
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) { // 判断"播放器加载完毕后移动窗口到顶部"是否开启
                            moveWindowToTop(); // 宽屏模式开启后移动窗口到顶部
                        }
                    });
                } else if (widescreenBtnCheckEtime < etime || timeoutSwitch) {
                    widescreenBtnCheckEtime += 200;
                    setTimeout(widescreenBtnCheck, 200);
                }
            }
        }

        // body加载完毕后运行
        console.log('[' + notificationScriptName + '-' + notificationCheck + '] ' + '正在持续检测body元素是否加载完成');
        afterBody();
        function afterBody() {
            if (document.body) {
                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + 'body元素加载完成');
                afterBodyFunction();
                btnFunction();
            } else {
                setTimeout(afterBody, 20);
            }
        }

        // body加载后执行的杂项
        function afterBodyFunction() {
            // 把菜单父类容器移到body的最上方, 这里已经运行在body加载完毕, 再判定一遍body是为了以后可能会迁移到其他位置让代码看起来更规范, 性能几乎不会有影响
            if (document.body) {
                document.body.insertBefore(MRMenuElement, document.body.children[0]);
                if (loadReady) {
                    document.getElementById('MRMenuStatus').textContent = '';
                }
                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + 'MR菜单创建完毕');
            }
            // 鼠标拖拽MR菜单事件, 鼠标抬起和拖拽动作挂载到window上是为了防止鼠标移动过快脱离MR菜单元素
            document.getElementById('MRMenuBackground').onmousedown = function (e) {
                // 这里的e是触发事件的目标, 这里也就是鼠标
                isMRMenuMovingX = e.pageX - document.getElementById('MRMenuBackground').offsetLeft;
                isMRMenuMovingY = e.pageY - document.getElementById('MRMenuBackground').offsetTop;
                isMRMenuMoving = true;
            }
            window.onmouseup = function () {
                isMRMenuMoving = false;
            }
            window.onblur = function () {
                // 失焦后阻止菜单继续跟随鼠标
                isMRMenuMoving = false;
            }
            window.onmousemove = function (e) {
                if (isMRMenuMoving) {
                    document.getElementById('MRMenuBackground').style.left = e.pageX - isMRMenuMovingX + 'px';
                    document.getElementById('MRMenuBackground').style.top = e.pageY - isMRMenuMovingY + 'px';
                }
            }
            // 自述
            if (GM_getValue('MRMenuReadme') == 1) {
                GM_setValue('MRMenuReadme', 0);
                document.getElementById('MRMenuReadme').style.display = 'flex';
            }

            // 修正按钮开关状态
            // 播放模式
            if (GM_getValue('MRPlayerMode') == 0) {
                document.getElementById('MRMenuNormalCheckbox').checked = true;

                document.getElementById('MRMenuNormalSwitch').style.pointerEvents = 'none';
                document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = '';
                document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = '';
            } else if (GM_getValue('MRPlayerMode') == 1) {
                document.getElementById('MRMenuAutoWidescreenCheckbox').checked = true;

                document.getElementById('MRMenuNormalSwitch').style.pointerEvents = '';
                document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = 'none';
                document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = '';
            } else if (GM_getValue('MRPlayerMode') == 2) {
                document.getElementById('MRMenuFullscreenCheckbox').checked = true;

                document.getElementById('MRMenuNormalSwitch').style.pointerEvents = '';
                document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = '';
                document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = 'none';
            }
            // 非网页全屏模式下禁用按钮
            if (GM_getValue('MRPlayerMode') != 2) {
                // 移动导航栏到视频下方
                disableBtn(document.getElementById('MRMenuMoveNavigationBarSwitch'));
                // 调整下方左右边距
                disableBtn(document.getElementById('MRMenuDownLayoutPaddingSwitch'));
                // 将弹幕栏整合到播放器内
                disableBtn(document.getElementById('MRMenuPutSendingBarInPlayerSwitch'));
            }

            // 自定义布局
            // 移动导航栏到视频下方
            if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                document.getElementById('MRMenuMoveNavigationBarCheckbox').checked = true;
            }
            // 隐藏新版反馈和旧版按钮
            if (GM_getValue('MRMenuHideFeedbackBtn') == 1) {
                document.getElementById('MRMenuHideFeedbackBtnCheckbox').checked = true;
            }
            // 调整下方左右边距
            if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                document.getElementById('MRMenuDownLayoutPaddingCheckbox').checked = true;
            }
            // 导航栏搜索框长度占满
            if (GM_getValue('MRMenuDownLayoutSearchBarFull') == 1) {
                document.getElementById('MRMenuSearchBarFullCheckbox').checked = true;
                searchBarFull();
            }
            // 将弹幕栏整合到播放器内
            if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                document.getElementById('MRMenuPutSendingBarInPlayerCheckbox').checked = true;
            }
            // 隐藏观看人数和弹幕装填信息
            if (GM_getValue('MRMenuHideVideoInfo') == 1) {
                document.getElementById('MRMenuHideVideoInfoCheckbox').checked = true;
            }
            // 播放器内显示选集按钮
            if (GM_getValue('MRMenuDisplayEplist') == 1) {
                document.getElementById('MRMenuDisplayEplistCheckbox').checked = true;
            }
            // 播放器内显示标题
            if (GM_getValue('MRMenuDisplayTitle') == 1) {
                document.getElementById('MRMenuDisplayTitleCheckbox').checked = true;
                displayTitle();
            }
            // 隐藏播放器内关注按钮
            if (GM_getValue('MRMenuHideFollowBtn') == 1) {
                document.getElementById('MRMenuHideFollowBtnCheckbox').checked = true;
            }
            // 把标题和头像移到视频下方
            if (GM_getValue('MRMenuMoveTitleAndUpinfo') == 1) {
                document.getElementById('MRMenuMoveTitleAndUpinfoCheckbox').checked = true;
            }
            // 优化工具提示弹窗
            if (GM_getValue('MRMenuBetterToolTip') == 1) {
                document.getElementById('MRMenuBetterToolTipCheckbox').checked = true;
                betterToolTip();
            }
            // 隐藏视频底部蓝条
            if (GM_getValue('MRMenuHideProgressArea') == 1) {
                document.getElementById('MRMenuHideProgressAreaCheckbox').checked = true;
                hideProgressArea();
            }
            // 隐藏导航栏标签
            for (let i = 0; i < GM_getValue('MRMenuHideNavigationBarTag').split('').length; i++) {
                if (GM_getValue('MRMenuHideNavigationBarTag').split('')[i] == 1) {
                    document.getElementById('MRMenuHideNavigationBarTag' + i + 'Checkbox').checked = true;
                }
            }
            hideNavigationBarTag();

            // 实用功能与工具
            // 菜单半透明
            if (GM_getValue('MRMenuTransparent') != 1) {
                document.getElementById('MRMenuTransparentCheckbox').checked = true;
            }
            // 智能连播
            if (GM_getValue('MRMenuSmartNextPlay') == 1) {
                document.getElementById('MRMenuSmartNextPlayCheckbox').checked = true;
            }
            // 播放器加载完毕后移动窗口到顶部
            if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                document.getElementById('MRMenuMoveWindowToTopCheckbox').checked = true;
                // 刷新&重载网页后会记录当前位置, 例如网页全屏模式下没加载完成前可能会处于网页中部, 先移动一次窗口到顶部提升观感, 反正最后都要移到顶部, 多移动一次也无所谓啦
                moveWindowToTop();
            }
            // 去除宽屏模式左右黑边
            if (GM_getValue('MRMenuRemoveWidescreenBlack') == 1) {
                document.getElementById('MRMenuRemoveWidescreenBlackCheckbox').checked = true;
            }
            removeWidescreenBlack();
            // 去除评论区蓝色关键字
            if (GM_getValue('MRMenuRemoveKeyword') == 1) {
                document.getElementById('MRMenuRemoveKeywordCheckbox').checked = true;
                removeKeyword();
            }
            // 去除评论区只有@人的无用评论
            if (GM_getValue('MRMenuRemoveUselessComment') == 1) {
                document.getElementById('MRMenuRemoveUselessCommentCheckbox').checked = true;
                removeUselessComment();
            }
            // 更多倍速
            if (GM_getValue('MRMenuMoreVideoSpeed') == 1) {
                document.getElementById('MRMenuMoreVideoSpeedCheckbox').checked = true;
                moreVideoSpeed();
            }
            // 稍后再看页面替换网址
            if (GM_getValue('MRMenuWatchLaterReplaceURL') == 1) {
                document.getElementById('MRMenuWatchLaterReplaceURLCheckbox').checked = true;
                watchLaterReplaceURL();
            }
            // 按ESC退出图片预览
            if (GM_getValue('MRMenuEscQuitViewImage') == 1) {
                document.getElementById('MRMenuEscQuitViewImageCheckbox').checked = true;
            }
            // 修复视频小窗口延迟
            if (GM_getValue('MRMenuFixPIPDelay') == 1) {
                document.getElementById('MRMenuFixPIPDelayCheckbox').checked = true;
                fixPIPDelay();
            }
            // 总是开启字幕
            if (GM_getValue('MRMenuAlwaysOpenSubtitle') == 1) {
                document.getElementById('MRMenuAlwaysOpenSubtitleCheckbox').checked = true;
                alwaysOpenSubtitle();
            }
            // 总是开启或关闭弹幕
            for (let i = 0; i < GM_getValue('MRMenuAlwaysDisableDnmaku').split('').length; i++) {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[i] == 1) {
                    document.getElementById('MRMenuAlwaysDisableDnmaku' + i + 'Checkbox').checked = true;
                }
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[0] == 0 && i != 0) {
                    disableBtn(document.getElementById('MRMenuAlwaysDisableDnmaku' + i + 'Switch'));
                }
            }
            alwaysDisableDnmaku();
        }

        // 注册MR菜单按钮/开关事件
        function btnFunction() {
            // 关闭按钮
            document.getElementById('MRMenuCloseBtn').addEventListener('click', function () {
                GM_setValue('MRMenuSwitch', 0);
                MRMenuElement.style.cssText += 'pointer-events: none; opacity: 0;';
                if (document.getElementById('MRMenuReadme').style.display == 'flex') {
                    document.getElementById('MRMenuReadme').style.display = 'none';
                }
            });

            // 播放器模式
            // 默认模式
            document.getElementById('MRMenuNormalSlider').addEventListener('click', function () {
                if (GM_getValue('MRPlayerMode') != 0) {
                    if (GM_getValue('MRPlayerMode') == 1) {
                        GM_setValue('MRPlayerMode', 0);
                        autoWidescreen();
                    } else if (GM_getValue('MRPlayerMode') == 2) {
                        GM_setValue('MRPlayerMode', 0);
                        fullscreen();
                        autoWidescreen();
                    }
                    //关闭其他按钮
                    document.getElementById('MRMenuAutoWidescreenCheckbox').checked = false;
                    document.getElementById('MRMenuFullscreenCheckbox').checked = false;

                    // 点击过后把当前按钮设为不可点击状态, 把其他按钮设成可点击状态
                    document.getElementById('MRMenuNormalSwitch').style.pointerEvents = 'none';
                    document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = '';
                    document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = '';

                    // 移动导航栏到视频下方
                    disableBtn(document.getElementById('MRMenuMoveNavigationBarSwitch'));
                    // 调整下方左右边距
                    disableBtn(document.getElementById('MRMenuDownLayoutPaddingSwitch'));
                    // 将弹幕栏整合到播放器内
                    disableBtn(document.getElementById('MRMenuPutSendingBarInPlayerSwitch'));
                    // 移动窗口到顶部
                    if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                        moveWindowToTop();
                    }
                    // 把标题和头像移到视频下方
                    moveTitleAndUpinfo();
                }
            });
            // 自动宽屏模式
            document.getElementById('MRMenuAutoWidescreenSlider').addEventListener('click', function () {
                if (GM_getValue('MRPlayerMode') != 1) {
                    if (GM_getValue('MRPlayerMode') == 2) {
                        GM_setValue('MRPlayerMode', 1);
                        fullscreen();
                    } else if (GM_getValue('MRPlayerMode') == 0) {
                        GM_setValue('MRPlayerMode', 1);
                    }
                    //关闭其他按钮
                    document.getElementById('MRMenuNormalCheckbox').checked = false;
                    document.getElementById('MRMenuFullscreenCheckbox').checked = false;
                    autoWidescreen();

                    // 点击过后把当前按钮设为不可点击状态, 把其他按钮设成可点击状态
                    document.getElementById('MRMenuNormalSwitch').style.pointerEvents = '';
                    document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = 'none';
                    document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = '';

                    // 移动导航栏到视频下方
                    disableBtn(document.getElementById('MRMenuMoveNavigationBarSwitch'));
                    // 调整下方左右边距
                    disableBtn(document.getElementById('MRMenuDownLayoutPaddingSwitch'));
                    // 将弹幕栏整合到播放器内
                    disableBtn(document.getElementById('MRMenuPutSendingBarInPlayerSwitch'));
                    // 把标题和头像移到视频下方
                    moveTitleAndUpinfo();
                }
            });
            // 网页全屏模式
            document.getElementById('MRMenuFullscreenSlider').addEventListener('click', function () {
                if (GM_getValue('MRPlayerMode') != 2) {
                    if (GM_getValue('MRPlayerMode') == 1) {
                        GM_setValue('MRPlayerMode', 2);
                        autoWidescreen();
                    } else if (GM_getValue('MRPlayerMode') == 0) {
                        GM_setValue('MRPlayerMode', 2);
                        autoWidescreen();
                    }
                    //关闭其他按钮
                    document.getElementById('MRMenuNormalCheckbox').checked = false;
                    document.getElementById('MRMenuAutoWidescreenCheckbox').checked = false;
                    fullscreen();

                    // 点击过后把当前按钮设为不可点击状态, 把其他按钮设成可点击状态
                    document.getElementById('MRMenuNormalSwitch').style.pointerEvents = '';
                    document.getElementById('MRMenuAutoWidescreenSwitch').style.pointerEvents = '';
                    document.getElementById('MRMenuFullscreenSwitch').style.pointerEvents = 'none';

                    // 移动导航栏到视频下方
                    enableBtn(document.getElementById('MRMenuMoveNavigationBarSwitch'));
                    // 调整下方左右边距
                    enableBtn(document.getElementById('MRMenuDownLayoutPaddingSwitch'));
                    // 将弹幕栏整合到播放器内
                    enableBtn(document.getElementById('MRMenuPutSendingBarInPlayerSwitch'));
                    // 把标题和头像移到视频下方
                    moveTitleAndUpinfo();
                }
            });

            // 自定义布局
            // 移动导航栏到视频下方
            document.getElementById('MRMenuMoveNavigationBarSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                    GM_setValue('MRMenuMoveNavigationBar', 1);
                    moveNavigationBar();
                } else {
                    GM_setValue('MRMenuMoveNavigationBar', 0);
                    moveNavigationBar();
                }
            });
            // 隐藏新版反馈和旧版按钮
            document.getElementById('MRMenuHideFeedbackBtnSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuHideFeedbackBtn') == 0) {
                    GM_setValue('MRMenuHideFeedbackBtn', 1);
                    hideFeedbackBtn();
                } else {
                    GM_setValue('MRMenuHideFeedbackBtn', 0);
                    hideFeedbackBtn();
                }
            });
            // 调整下方左右边距
            document.getElementById('MRMenuDownLayoutPaddingSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuDownLayoutPadding') == 0) {
                    GM_setValue('MRMenuDownLayoutPadding', 1);
                    downLayoutPadding();
                } else {
                    GM_setValue('MRMenuDownLayoutPadding', 0);
                    downLayoutPadding();
                }
            });
            // 导航栏搜索框长度占满
            document.getElementById('MRMenuSearchBarFullSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuDownLayoutSearchBarFull') == 0) {
                    GM_setValue('MRMenuDownLayoutSearchBarFull', 1);
                    searchBarFull();
                } else {
                    GM_setValue('MRMenuDownLayoutSearchBarFull', 0);
                    searchBarFull();
                }
            });
            // 将弹幕栏整合到播放器内
            document.getElementById('MRMenuPutSendingBarInPlayerSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuPutSendingBarInPlayer') == 0) {
                    GM_setValue('MRMenuPutSendingBarInPlayer', 1);
                    putSendingBarInPlayer();
                } else {
                    GM_setValue('MRMenuPutSendingBarInPlayer', 0);
                    putSendingBarInPlayer();
                }
            });
            // 隐藏观看人数和弹幕装填信息
            document.getElementById('MRMenuHideVideoInfoSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuHideVideoInfo') == 0) {
                    GM_setValue('MRMenuHideVideoInfo', 1);
                    hideVideoInfo();
                } else {
                    GM_setValue('MRMenuHideVideoInfo', 0);
                    hideVideoInfo();
                }
            });
            // 播放器内显示选集按钮
            document.getElementById('MRMenuDisplayEplistSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuDisplayEplist') == 0) {
                    GM_setValue('MRMenuDisplayEplist', 1);
                } else {
                    GM_setValue('MRMenuDisplayEplist', 0);
                }
            });
            // 播放器内显示标题
            document.getElementById('MRMenuDisplayTitleSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuDisplayTitle') == 0) {
                    GM_setValue('MRMenuDisplayTitle', 1);
                    displayTitle();
                } else {
                    GM_setValue('MRMenuDisplayTitle', 0);
                    displayTitle();
                }
            });
            // 隐藏播放器内关注按钮
            document.getElementById('MRMenuHideFollowBtnSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuHideFollowBtn') == 0) {
                    GM_setValue('MRMenuHideFollowBtn', 1);
                    hideFollowBtn();
                } else {
                    GM_setValue('MRMenuHideFollowBtn', 0);
                    hideFollowBtn();
                }
            });
            // 把标题和头像移到视频下方
            document.getElementById('MRMenuMoveTitleAndUpinfoSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuMoveTitleAndUpinfo') == 0) {
                    GM_setValue('MRMenuMoveTitleAndUpinfo', 1);
                    moveTitleAndUpinfo();
                } else {
                    GM_setValue('MRMenuMoveTitleAndUpinfo', 0);
                    moveTitleAndUpinfo();
                }
            });
            // 优化工具提示弹窗
            document.getElementById('MRMenuBetterToolTipSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuBetterToolTip') == 0) {
                    GM_setValue('MRMenuBetterToolTip', 1);
                    betterToolTip();
                } else {
                    GM_setValue('MRMenuBetterToolTip', 0);
                    betterToolTip();
                }
            });
            // 隐藏视频底部蓝条
            document.getElementById('MRMenuHideProgressAreaSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuHideProgressArea') == 0) {
                    GM_setValue('MRMenuHideProgressArea', 1);
                    hideProgressArea();
                } else {
                    GM_setValue('MRMenuHideProgressArea', 0);
                    hideProgressArea();
                }
            });
            // 隐藏导航栏标签
            for (let i = 0; i < GM_getValue('MRMenuHideNavigationBarTag').split('').length; i++) {
                document.getElementById('MRMenuHideNavigationBarTag' + i + 'Checkbox').addEventListener('click', function () {
                    let num = this.id.replace(/[^0-9]/ig, '');
                    if (GM_getValue('MRMenuHideNavigationBarTag').split('')[num] == 0) {
                        changeText('MRMenuHideNavigationBarTag', num, '1');
                    } else {
                        changeText('MRMenuHideNavigationBarTag', num, '0');
                    }
                    hideNavigationBarTag();
                })
            }

            // 实用功能与工具
            // 菜单半透明
            document.getElementById('MRMenuTransparentSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuTransparent') == 1) {
                    GM_setValue('MRMenuTransparent', 0.7);
                } else {
                    GM_setValue('MRMenuTransparent', 1);
                }
                MRMenuElement.style.cssText += 'opacity: ' + GM_getValue('MRMenuTransparent') + ';';
            });
            // 播放器加载完毕后移动窗口到顶部
            document.getElementById('MRMenuMoveWindowToTopSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuMoveWindowToTop') == 0) {
                    GM_setValue('MRMenuMoveWindowToTop', 1);
                    moveWindowToTop();
                } else {
                    GM_setValue('MRMenuMoveWindowToTop', 0);
                }
            });
            // 去除宽屏模式左右黑边
            document.getElementById('MRMenuRemoveWidescreenBlackSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuRemoveWidescreenBlack') == 0) {
                    GM_setValue('MRMenuRemoveWidescreenBlack', 1);
                } else {
                    GM_setValue('MRMenuRemoveWidescreenBlack', 0);
                }
            });
            // 去除评论区蓝色关键字
            document.getElementById('MRMenuRemoveKeywordSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuRemoveKeyword') == 0) {
                    GM_setValue('MRMenuRemoveKeyword', 1);
                } else {
                    GM_setValue('MRMenuRemoveKeyword', 0);
                }
                removeKeyword();
            });
            // 去除评论区只有@人的无用评论
            document.getElementById('MRMenuRemoveUselessCommentSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuRemoveUselessComment') == 0) {
                    GM_setValue('MRMenuRemoveUselessComment', 1);
                } else {
                    GM_setValue('MRMenuRemoveUselessComment', 0);
                }
                removeUselessComment();
            });
            // 智能连播
            document.getElementById('MRMenuSmartNextPlaySlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuSmartNextPlay') == 0) {
                    GM_setValue('MRMenuSmartNextPlay', 1);
                } else {
                    GM_setValue('MRMenuSmartNextPlay', 0);
                }
            });
            // 更多倍速
            document.getElementById('MRMenuMoreVideoSpeedSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuMoreVideoSpeed') == 0) {
                    GM_setValue('MRMenuMoreVideoSpeed', 1);
                } else {
                    GM_setValue('MRMenuMoreVideoSpeed', 0);
                }
                moreVideoSpeed();
            });
            // 稍后再看页面替换网址
            document.getElementById('MRMenuWatchLaterReplaceURLSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuWatchLaterReplaceURL') == 0) {
                    GM_setValue('MRMenuWatchLaterReplaceURL', 1);
                } else {
                    GM_setValue('MRMenuWatchLaterReplaceURL', 0);
                }
                watchLaterReplaceURL();
            });
            // 按ESC退出图片预览
            document.getElementById('MRMenuEscQuitViewImageSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuEscQuitViewImage') == 0) {
                    GM_setValue('MRMenuEscQuitViewImage', 1);
                } else {
                    GM_setValue('MRMenuEscQuitViewImage', 0);
                }
            });
            // 修复视频小窗口延迟
            document.getElementById('MRMenuFixPIPDelaySlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuFixPIPDelay') == 0) {
                    GM_setValue('MRMenuFixPIPDelay', 1);
                } else {
                    GM_setValue('MRMenuFixPIPDelay', 0);
                }
                fixPIPDelay();
            });
            // 总是开启字幕
            document.getElementById('MRMenuAlwaysOpenSubtitleSlider').addEventListener('click', function () {
                if (GM_getValue('MRMenuAlwaysOpenSubtitle') == 0) {
                    GM_setValue('MRMenuAlwaysOpenSubtitle', 1);
                } else {
                    GM_setValue('MRMenuAlwaysOpenSubtitle', 0);
                }
                alwaysOpenSubtitle();
            });
            // 总是开启或关闭弹幕
            document.getElementById('MRMenuAlwaysDisableDnmaku0Checkbox').addEventListener('click', function () {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[0] == 0) {
                    changeText('MRMenuAlwaysDisableDnmaku', 0, '1');

                    enableBtn(document.getElementById('MRMenuAlwaysDisableDnmaku1Switch'));
                    enableBtn(document.getElementById('MRMenuAlwaysDisableDnmaku2Switch'));
                } else {
                    changeText('MRMenuAlwaysDisableDnmaku', 0, '0');

                    disableBtn(document.getElementById('MRMenuAlwaysDisableDnmaku1Switch'));
                    disableBtn(document.getElementById('MRMenuAlwaysDisableDnmaku2Switch'));
                }
            });
            document.getElementById('MRMenuAlwaysDisableDnmaku1Checkbox').addEventListener('click', function () {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[1] == 0) {
                    changeText('MRMenuAlwaysDisableDnmaku', 1, '1');
                    changeText('MRMenuAlwaysDisableDnmaku', 2, '0');

                    document.getElementById('MRMenuAlwaysDisableDnmaku2Checkbox').checked = false;

                    document.getElementById('MRMenuAlwaysDisableDnmaku1Switch').style.pointerEvents = 'none';
                    document.getElementById('MRMenuAlwaysDisableDnmaku2Switch').style.pointerEvents = '';
                }
                alwaysDisableDnmaku();
            });
            document.getElementById('MRMenuAlwaysDisableDnmaku2Checkbox').addEventListener('click', function () {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[2] == 0) {
                    changeText('MRMenuAlwaysDisableDnmaku', 2, '1');
                    changeText('MRMenuAlwaysDisableDnmaku', 1, '0');

                    document.getElementById('MRMenuAlwaysDisableDnmaku1Checkbox').checked = false;

                    document.getElementById('MRMenuAlwaysDisableDnmaku1Switch').style.pointerEvents = '';
                    document.getElementById('MRMenuAlwaysDisableDnmaku2Switch').style.pointerEvents = 'none';
                }
                alwaysDisableDnmaku();
            });
        }

        // 功能函数
        // 播放模式
        // 自动宽屏模式函数
        function autoWidescreen() {
            autoWidescreenEtime = 0;
            if (GM_getValue('MRPlayerMode') == 1) {
                if (webStatus == 0 || webStatus == 2) {
                    // 视频/列表
                    autoWidescreenBtn = 'bpx-player-ctrl-wide';
                    autoWidescreenisWidescreenClass = 'bpx-state-entered';
                    autoWidescreenClickBtn();
                } else if (webStatus == 1) {
                    // 影视
                    autoWidescreenBtn = 'squirtle-video-widescreen';
                    autoWidescreenisWidescreenClass = 'active';
                    autoWidescreenClickBtn();
                }
                // 判断是否存在并点击宽屏模式按钮
                function autoWidescreenClickBtn() {
                    console.log('[' + notificationScriptName + '-' + notificationCheck + '] ' + '自动宽屏模式 - 正在检测宽屏模式按钮是否加载完成');
                    autoWidescreenClickBtnCheck();
                    function autoWidescreenClickBtnCheck() {
                        // 检测宽屏模式相关元素是否加载完毕
                        if (document.getElementsByClassName(autoWidescreenBtn)[0]) {
                            // 如果当前不是宽屏模式则点击宽屏模式按钮
                            if (!document.getElementsByClassName(autoWidescreenBtn)[0].className.match(autoWidescreenisWidescreenClass)) {
                                document.getElementsByClassName(autoWidescreenBtn)[0].click();
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '自动宽屏模式 - 已开启宽屏模式');
                                // 移动窗口到顶部
                                if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                                    moveWindowToTop();
                                }
                            } else {
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '自动宽屏模式 - 当前已是宽屏模式');
                            }
                        } else {
                            // 每100毫秒检测一次, 8秒后不再执行
                            autoWidescreenEtime += 200;
                            if (autoWidescreenEtime < etime || timeoutSwitch) {
                                setTimeout(autoWidescreenClickBtnCheck, 200);
                            } else {
                                console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '自动宽屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                            }
                        }
                    }
                }
            } else {
                if (webStatus == 0 || webStatus == 2) {
                    // 视频/列表
                    autoWidescreenBtn = 'bpx-player-ctrl-wide';
                    autoWidescreenisWidescreenClass = 'bpx-state-entered';
                    autoWidescreenDisableClickBtn();
                } else if (webStatus == 1) {
                    // 影视
                    autoWidescreenBtn = 'squirtle-video-widescreen';
                    autoWidescreenisWidescreenClass = 'active';
                    autoWidescreenDisableClickBtn();
                }
                // 其他模式取消宽屏模式
                // 判断是否存在并点击宽屏模式按钮
                function autoWidescreenDisableClickBtn() {
                    console.log('[' + notificationScriptName + '-' + notificationCheck + '] ' + '自动宽屏模式 - 正在检测宽屏模式按钮是否加载完成');
                    autoWidescreenDisableClickBtnCheck();
                    function autoWidescreenDisableClickBtnCheck() {
                        // 检测宽屏模式相关元素是否加载完毕
                        if (document.getElementsByClassName(autoWidescreenBtn)[0]) {
                            // 如果当前不是宽屏模式则点击宽屏模式按钮
                            if (document.getElementsByClassName(autoWidescreenBtn)[0].className.match(autoWidescreenisWidescreenClass)) {
                                document.getElementsByClassName(autoWidescreenBtn)[0].click();
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '自动宽屏模式 - 已关闭宽屏模式');
                                // 移动窗口到顶部
                                if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                                    moveWindowToTop();
                                }
                            } else {
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '自动宽屏模式 - 宽屏模式已是关闭状态');
                            }
                        } else {
                            // 每100毫秒检测一次, 8秒后不再执行
                            autoWidescreenEtime += 200;
                            if (autoWidescreenEtime < etime || timeoutSwitch) {
                                setTimeout(autoWidescreenDisableClickBtnCheck, 200);
                            } else {
                                console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '自动宽屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                            }
                        }
                    }
                }
            }
        }
        // 网页全屏模式函数
        function fullscreen() {
            fullscreenEtime = 0;
            if (GM_getValue('MRPlayerMode') == 2) {
                if (webStatus == 0) {
                    // 视频
                    fullscreenVideo();
                } else if (webStatus == 1) {
                    // 影视
                    if (window.location.href.match('theme=movie')) {
                        if (window.location.href.match('inline')) {
                            // 电影
                            fullscreenMovie();
                        } else {
                            // 电影有主题的页面
                            fullscreenMovie();
                        }
                    } else {
                        // 影视/番剧
                        fullscreenMovie();
                    }
                } else if (webStatus == 2) {
                    // 列表
                    fullscreenList();
                }
                // 视频
                function fullscreenVideo() {
                    // if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                    //     GM_addStyle('#bilibili-player {width: 100% !important; height: calc(100vh - 64px) !important;}');
                    // } else {
                    //     GM_addStyle('#bilibili-player {width: 100% !important; height: 100vh !important;}');
                    // }
                    // GM_addStyle('#playerWrap {height: auto !important; z-index: 50 !important;}');
                    // (function () {
                    //     if (document.getElementById('app') && document.getElementById('playerWrap') && document.getElementsByClassName('video-container-v1')[0]) {
                    //         document.getElementById('app').insertBefore(document.getElementById('playerWrap'), document.getElementsByClassName('video-container-v1')[0]);
                    //     } else {
                    //         setTimeout(this, 20);
                    //     }
                    // })();
                    if (document.getElementsByClassName('bpx-player-ctrl-time-duration')[0] && loadReady) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: calc(100vh - 64px) !important;';
                        } else {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: 100vh !important;';
                        }
                        document.getElementById('playerWrap').style.cssText += 'height: auto !important; z-index: 50 !important;';
                        // 移动播放器到上级
                        document.getElementById('app').insertBefore(document.getElementById('playerWrap'), document.getElementsByClassName('video-container-v1')[0]);
                        // 移动弹幕栏到播放器下方
                        document.getElementById('playerWrap').appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', 'true');
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 隐藏宽屏模式和网页全屏按钮, 避免冲突
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: none';
                            document.getElementsByClassName('bpx-player-ctrl-web')[0].style.cssText += 'display: none';
                        } else if (fullscreenEtime < etime || timeoutSwitch) {
                            fullscreenEtime += 200;
                            setTimeout(fullscreenVideo, 200);
                        } else {
                            console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].style.cssText += 'width: auto';
                        // 修复收藏界面层级过低
                        document.getElementsByClassName('left-container')[0].style.cssText += 'z-index: unset !important; position: unset !important;';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已开启网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenVideo, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 视频组件未加载, 检测超时, 停止检测');
                    }
                }
                // 影视
                function fullscreenMovie() {
                    if (document.getElementsByClassName('bpx-player-ctrl-time-duration')[0] && loadReady) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: calc(100vh - 64px) !important;';
                        } else {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: 100vh !important;';
                        }
                        document.getElementById('bilibili-player-wrap').setAttribute('mr_fullscreen', 'true');
                        document.getElementsByClassName('main-container')[0].setAttribute('mr_fullscreen', 'true');
                        document.getElementsByClassName('plp-l')[0].setAttribute('mr_fullscreen', 'true');
                        document.getElementsByClassName('plp-r')[0].setAttribute('mr_fullscreen', 'true');
                        // 移动播放器到上级
                        document.body.insertBefore(document.getElementById('bilibili-player-wrap'), document.getElementById('__next'));
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', 'true');
                        // 隐藏电影主题背景
                        if (document.getElementsByClassName('special-cover')[0]) {
                            document.getElementsByClassName('special-cover')[0].style.cssText += 'display: none';
                        }
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 隐藏宽屏模式和网页全屏按钮, 避免冲突
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: none';
                            document.getElementsByClassName('bpx-player-ctrl-wide-enter')[0].style.cssText += 'display: none';
                        } else if (fullscreenEtime < etime || timeoutSwitch) {
                            fullscreenEtime += 200;
                            setTimeout(fullscreenMovie, 200);
                        } else {
                            console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].setAttribute('mr_fullscreen', 'true');
                        //
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已开启网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenMovie, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 视频组件未加载, 检测超时, 停止检测');
                    }
                }
                // 列表
                function fullscreenList() {
                    if (document.getElementsByClassName('bpx-player-ctrl-time-duration')[0] && loadReady) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: calc(100vh - 64px) !important;';
                        } else {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: 100vh !important;';
                        }
                        document.getElementById('playerWrap').style.cssText += 'height: auto !important; z-index: 50 !important;';
                        // 移动播放器到上级
                        document.getElementById('app').insertBefore(document.getElementById('playerWrap'), document.getElementsByClassName('playlist-container')[0]);
                        // 移动弹幕栏到播放器下方
                        document.getElementById('playerWrap').appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', 'true');
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 隐藏宽屏模式和网页全屏按钮, 避免冲突
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: none';
                            document.getElementsByClassName('bpx-player-ctrl-web')[0].style.cssText += 'display: none';
                        } else if (fullscreenEtime < etime || timeoutSwitch) {
                            fullscreenEtime += 200;
                            setTimeout(fullscreenVideo, 200);
                        } else {
                            console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].style.cssText += 'width: auto';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已开启网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenList, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 视频组件未加载, 检测超时, 停止检测');
                    }
                }
            } else {
                if (webStatus == 0) {
                    // 视频
                    fullscreenDisableVideo();
                }
                if (webStatus == 1) {
                    // 影视
                    if (window.location.href.match('theme=movie')) {
                        if (window.location.href.match('inline')) {
                            // 电影
                            fullscreenDisableMovie();
                        } else {
                            // 电影有主题的页面
                            fullscreenDisableMovie();
                        }
                    } else {
                        // 影视/番剧
                        fullscreenDisableMovie();
                    }
                }
                if (webStatus == 2) {
                    // 列表
                    fullscreenDisableList();
                }
                // 视频
                function fullscreenDisableVideo() {
                    if (document.getElementsByClassName('bpx-player-sending-area')[0] && loadReady) {
                        // 其他模式下恢复改变的布局
                        document.getElementById('bilibili-player').style.width = '';
                        document.getElementById('bilibili-player').style.height = '';
                        document.getElementById('playerWrap').style.height = '';
                        document.getElementById('playerWrap').style.zIndex = '';
                        // 移动播放器到初始位置
                        // 先移动到父类的最下面, 再移动到指定层级, 否则会报错
                        document.getElementsByClassName('left-container')[0].appendChild(document.getElementById('playerWrap'));
                        document.getElementsByClassName('left-container')[0].insertBefore(document.getElementById('playerWrap'), document.getElementById('arc_toolbar_report'));
                        // 移动弹幕栏到初始位置
                        document.getElementsByClassName('bpx-player-primary-area')[0].appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', '');
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 恢复显示宽屏模式按钮
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: block';
                            document.getElementsByClassName('bpx-player-ctrl-web')[0].style.cssText += 'display: block';
                        } else {
                            setTimeout(fullscreenDisableVideo, 200);
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].style.width = '';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已关闭网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenDisableVideo, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 检测超时, 停止检测');
                    }
                }
                // 影视
                function fullscreenDisableMovie() {
                    if (document.getElementsByClassName('bpx-player-ctrl-time-duration')[0] && loadReady) {
                        // 其他模式下恢复改变的布局
                        document.getElementById('bilibili-player').style.width = '';
                        document.getElementById('bilibili-player').style.height = '';
                        document.getElementsByClassName('main-container')[0].setAttribute('mr_fullscreen', '');
                        document.getElementsByClassName('plp-l')[0].setAttribute('mr_fullscreen', '');
                        document.getElementsByClassName('plp-r')[0].setAttribute('mr_fullscreen', '');
                        // 移动播放器到上级
                        document.getElementsByClassName('plp-l')[0].insertBefore(document.getElementById('player_module'), document.getElementsByClassName('media-wrapper')[0]);
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', '');
                        // 隐藏电影主题背景
                        if (document.getElementsByClassName('special-cover')[0]) {
                            document.getElementsByClassName('special-cover')[0].style.display = '';
                        }
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 恢复显示宽屏模式按钮
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: block';
                            document.getElementsByClassName('bpx-player-ctrl-wide-enter')[0].style.cssText += 'display: block';
                        } else if (fullscreenEtime < etime || timeoutSwitch) {
                            fullscreenEtime += 200;
                            setTimeout(fullscreenDisableMovie, 200);
                        } else {
                            console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 未检测到宽屏模式按钮, 检测超时, 停止检测');
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].setAttribute('mr', '');
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已开启网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenDisableMovie, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 视频组件未加载, 检测超时, 停止检测');
                    }
                }
                // 列表
                function fullscreenDisableList() {
                    if (document.getElementsByClassName('bpx-player-sending-area')[0] && loadReady) {
                        // 其他模式下恢复改变的布局
                        document.getElementById('bilibili-player').style.width = '';
                        document.getElementById('bilibili-player').style.height = '';
                        document.getElementById('playerWrap').style.height = '';
                        document.getElementById('playerWrap').style.zIndex = '';
                        // 移动播放器到初始位置
                        // 先移动到父类的最下面, 再移动到指定层级, 否则会报错
                        document.getElementsByClassName('playlist-container--left')[0].appendChild(document.getElementById('playerWrap'));
                        document.getElementsByClassName('playlist-container--left')[0].insertBefore(document.getElementById('playerWrap'), document.getElementById('playlistToolbar'));
                        // 移动弹幕栏到初始位置
                        document.getElementsByClassName('bpx-player-primary-area')[0].appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        // 弹幕栏属性
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_always_display', '');
                        // 移动窗口到顶部
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                        // 移动导航栏到视频下方
                        if (GM_getValue('MRMenuMoveNavigationBar') == 1) {
                            moveNavigationBar();
                        }
                        // 调整下方左右边距
                        if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                            downLayoutPadding();
                        }
                        // 将弹幕栏整合到播放器内
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayer();
                        }
                        // 恢复显示宽屏模式按钮
                        if (document.getElementsByClassName('bpx-player-ctrl-wide')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-wide')[0].style.cssText += 'display: block';
                            document.getElementsByClassName('bpx-player-ctrl-web')[0].style.cssText += 'display: block';
                        } else {
                            setTimeout(fullscreenDisableList, 200);
                        }
                        // 调整弹幕栏观看人数和弹幕装填信息宽度
                        document.getElementsByClassName('bpx-player-video-info')[0].style.width = '';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '网页全屏模式 - 已关闭网页全屏模式');
                    } else if (fullscreenEtime < etime || timeoutSwitch) {
                        fullscreenEtime += 200;
                        setTimeout(fullscreenDisableList, 200);
                    } else {
                        console.log('[' + notificationScriptName + '-' + notificationWarning + '] ' + '网页全屏模式 - 检测超时, 停止检测');
                    }
                }
            }
        }

        // 自定义布局
        // 移动导航栏到视频下方
        function moveNavigationBar() {
            moveNavigationBarEtime = 0;
            if (webStatus == 0) {
                // 视频
                moveNavigationBarVideoCheck();
            } else if (webStatus == 1) {
                // 影视
                if (window.location.href.match('theme=movie')) {
                    if (window.location.href.match('inline')) {
                        // 电影
                        moveNavigationBarMovieCheck();
                    } else {
                        // 电影有主题的页面
                        moveNavigationBarMovieCheck();
                    }
                } else {
                    // 影视/番剧
                    moveNavigationBarMovieCheck();
                }
            } else if (webStatus == 2) {
                // 列表
                moveNavigationBarListCheck();
            }
            // 视频
            function moveNavigationBarVideoCheck() {
                if (document.getElementById('bilibili-player') && loadReady) {
                    if (GM_getValue('MRPlayerMode') == 2) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                            document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                            document.getElementById('app').insertBefore(document.getElementById('biliMainHeader'), document.getElementById('playerWrap'));

                            document.getElementById('bilibili-player').style.cssText += 'height: calc(100vh - 64px) !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                        } else {
                            document.getElementsByClassName('bili-header__bar')[0].style.cssText += 'position: relative !important; z-index: 10 !important;';
                            document.getElementById('app').insertBefore(document.getElementById('biliMainHeader'), document.getElementsByClassName('video-container-v1')[0]);

                            document.getElementById('bilibili-player').style.cssText += 'height: 100vh !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏移动完毕');
                        }
                    } else {
                        document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                        document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                    }
                } else if (moveNavigationBarEtime < etime || timeoutSwitch) {
                    moveNavigationBar += 200;
                    setTimeout(moveNavigationBarVideoCheck, 200);
                }
            }
            // 影视
            function moveNavigationBarMovieCheck() {
                if (document.getElementById('bilibili-player') && loadReady) {
                    if (GM_getValue('MRPlayerMode') == 2) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                            document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                            document.body.insertBefore(document.getElementById('biliMainHeader'), document.getElementById('bilibili-player-wrap'));

                            document.getElementById('bilibili-player').style.cssText += 'height: calc(100vh - 64px) !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                        } else {
                            document.getElementsByClassName('bili-header__bar')[0].style.cssText += 'position: relative !important; z-index: 10 !important;';
                            document.body.insertBefore(document.getElementById('biliMainHeader'), document.getElementById('__next'));

                            document.getElementById('bilibili-player').style.cssText += 'height: 100vh !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏移动完毕');
                        }
                    } else {
                        document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                        document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                    }
                } else if (moveNavigationBarEtime < etime || timeoutSwitch) {
                    moveNavigationBar += 200;
                    setTimeout(moveNavigationBarMovieCheck, 200);
                }
            }
            // 列表
            function moveNavigationBarListCheck() {
                if (document.getElementById('bilibili-player') && loadReady) {
                    if (GM_getValue('MRPlayerMode') == 2) {
                        if (GM_getValue('MRMenuMoveNavigationBar') == 0) {
                            document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                            document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                            document.getElementById('app').insertBefore(document.getElementById('biliMainHeader'), document.getElementById('playerWrap'));

                            document.getElementById('bilibili-player').style.cssText += 'height: calc(100vh - 64px) !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                        } else {
                            document.getElementsByClassName('bili-header__bar')[0].style.cssText += 'position: relative !important; z-index: 10 !important;';
                            document.getElementById('app').insertBefore(document.getElementById('biliMainHeader'), document.getElementsByClassName('playlist-container')[0]);

                            document.getElementById('bilibili-player').style.cssText += 'height: 100vh !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏移动完毕');
                        }
                    } else {
                        document.getElementsByClassName('bili-header__bar')[0].style.position = '';
                        document.getElementsByClassName('bili-header__bar')[0].style.zIndex = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '移动导航栏到视频下方 - 导航栏已恢复');
                    }
                } else if (moveNavigationBarEtime < etime || timeoutSwitch) {
                    moveNavigationBar += 200;
                    setTimeout(moveNavigationBarListCheck, 200);
                }
            }
        }
        // 隐藏新版反馈和回到旧版按钮
        function hideFeedbackBtn() {
            hideFeedbackBtnEtime = 0;
            let btn = '';
            if (webStatus == 1) {
                // 影视
                btn = 'plp-r';
                hideFeedbackBtnMovieCheck();
            } else if (webStatus == 4) {
                // 搜索
                btn = 'side-buttons';
                hideFeedbackBtnHomeCheck();
            } else if (webStatus == 5) {
                // 主页
                btn = 'palette-button-wrap';
                hideFeedbackBtnHomeCheck();
            }
            // 影视
            function hideFeedbackBtnMovieCheck() {
                if (document.getElementsByClassName(btn)[0] && document.getElementsByClassName(btn)[0].nextElementSibling && document.getElementsByClassName(btn)[0].nextElementSibling.children[0].children[0]) {
                    if (GM_getValue('MRMenuHideFeedbackBtn') == 1) {
                        document.getElementsByClassName(btn)[0].nextElementSibling.children[0].children[0].style.cssText += 'display: none';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏新版反馈和回到旧版按钮 - 已隐藏新版反馈和回到旧版按钮');
                    } else {
                        document.getElementsByClassName(btn)[0].nextElementSibling.children[0].children[0].style.cssText += 'display: block';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏新版反馈和回到旧版按钮 - 已显示新版反馈和回到旧版按钮');
                    }
                } else if (hideFeedbackBtnEtime < etime || timeoutSwitch) {
                    hideFeedbackBtnEtime += 200;
                    setTimeout(hideFeedbackBtnMovieCheck, 200);
                }
            }
            // 搜索和主页
            function hideFeedbackBtnHomeCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    let btnElement = document.getElementsByClassName(btn)[0];
                    for (let i = 0; i < btnElement.children.length; i++) {
                        if (i != btnElement.children.length - 1) {
                            if (GM_getValue('MRMenuHideFeedbackBtn') == 1) {
                                btnElement.children[i].style.cssText += 'display: none';
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏新版反馈和回到旧版按钮 - 已隐藏新版反馈和回到旧版按钮');
                            } else {
                                btnElement.children[i].style.cssText += 'display: block';
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏新版反馈和回到旧版按钮 - 已显示新版反馈和回到旧版按钮');
                            }
                        }
                    }
                } else if (hideFeedbackBtnEtime < etime || timeoutSwitch) {
                    hideFeedbackBtnEtime += 200;
                    setTimeout(hideFeedbackBtnHomeCheck, 200);
                }
            }
        }
        // 调整下方左右边距
        function downLayoutPadding() {
            downLayoutPaddingEtime = 0;
            if (webStatus == 0) {
                // 视频
                downLayoutPaddingVideoCheck();
            } else if (webStatus == 1) {
                // 影视
                downLayoutPaddingMovieCheck();
            } else if (webStatus == 2) {
                // 列表
                downLayoutPaddingListCheck();
            }
            // 视频
            function downLayoutPaddingVideoCheck() {
                if (document.getElementsByClassName('left-container')[0]) {
                    if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                        if (GM_getValue('MRPlayerMode') == 2) {
                            document.getElementsByClassName('video-container-v1')[0].style.cssText += 'justify-content: space-between; padding: 0px 20px 0px 20px;';
                            document.getElementsByClassName('left-container')[0].style.cssText += 'flex-grow: 1;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距调整完毕');
                        } else {
                            document.getElementsByClassName('video-container-v1')[0].style.justifyContent = '';
                            document.getElementsByClassName('video-container-v1')[0].style.padding = '';
                            document.getElementsByClassName('left-container')[0].style.flexGrow = '';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                        }
                    } else {
                        document.getElementsByClassName('video-container-v1')[0].style.justifyContent = '';
                        document.getElementsByClassName('video-container-v1')[0].style.padding = '';
                        document.getElementsByClassName('left-container')[0].style.flexGrow = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                    }
                } else if (downLayoutPaddingEtime < etime || timeoutSwitch) {
                    downLayoutPaddingEtime += 200;
                    setTimeout(downLayoutPaddingVideoCheck, 200);
                }
            }
            // 影视
            function downLayoutPaddingMovieCheck() {
                if (document.getElementsByClassName('plp-l')[0]) {
                    if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                        if (GM_getValue('MRPlayerMode') == 2) {
                            document.getElementsByClassName('main-container')[0].setAttribute('mr_margin_fix', 'true');
                            document.getElementsByClassName('player-left-components')[0].setAttribute('mr_margin_fix', 'true');
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距调整完毕');
                        } else {
                            document.getElementsByClassName('main-container')[0].setAttribute('mr_margin_fix', '');
                            document.getElementsByClassName('player-left-components')[0].setAttribute('mr_margin_fix', '');
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                        }
                    } else {
                        document.getElementsByClassName('main-container')[0].setAttribute('mr_margin_fix', '');
                        document.getElementsByClassName('player-left-components')[0].setAttribute('mr_margin_fix', '');
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                    }
                } else if (downLayoutPaddingEtime < etime || timeoutSwitch) {
                    downLayoutPaddingEtime += 200;
                    setTimeout(downLayoutPaddingMovieCheck, 200);
                }
            }
            // 列表
            function downLayoutPaddingListCheck() {
                if (document.getElementsByClassName('playlist-container--left')[0]) {
                    if (GM_getValue('MRMenuDownLayoutPadding') == 1) {
                        if (GM_getValue('MRPlayerMode') == 2) {
                            document.getElementsByClassName('playlist-container')[0].style.cssText += 'justify-content: space-between; padding: 0px 20px 0px 20px;';
                            document.getElementsByClassName('playlist-container--left')[0].style.cssText += 'flex-grow: 1;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距调整完毕');
                        } else {
                            document.getElementsByClassName('playlist-container')[0].style.justifyContent = '';
                            document.getElementsByClassName('playlist-container')[0].style.padding = '';
                            document.getElementsByClassName('playlist-container--left')[0].style.flexGrow = '';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                        }
                    } else {
                        document.getElementsByClassName('playlist-container')[0].style.justifyContent = '';
                        document.getElementsByClassName('playlist-container')[0].style.padding = '';
                        document.getElementsByClassName('playlist-container--left')[0].style.flexGrow = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '调整下方左右边距 - 下方左右边距已恢复');
                    }
                } else if (downLayoutPaddingEtime < etime || timeoutSwitch) {
                    downLayoutPaddingEtime += 200;
                    setTimeout(downLayoutPaddingVideoCheck, 200);
                }
            }
        }
        // 导航栏搜索框长度占满
        function searchBarFull() {
            searchBarFullEtime = 0;
            let btn = '';
            if (webStatus == 0 || webStatus == 1 || webStatus == 2 || webStatus == 3 || webStatus == 5 || webStatus == 9) {
                // 视频/影视/列表/空间/主页/动态
                btn = 'center-search__bar';
                searchBarFullVideoCheck();
            } else if (webStatus == 7) {
                // 个人中心
                btn = 'nav-search-box';
                searchBarFullAccountCheck();
            }
            // 视频/影视/空间/主页
            function searchBarFullVideoCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuDownLayoutSearchBarFull') == 1) {
                        document.getElementsByClassName(btn)[0].style.cssText += 'max-width: 100%';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '导航栏搜索框长度占满 - 导航栏搜索框长度调整完毕');
                    } else {
                        document.getElementsByClassName(btn)[0].style.maxWidth = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '导航栏搜索框长度占满 - 导航栏搜索框长度已恢复');
                    }
                } else if (searchBarFullEtime < etime || timeoutSwitch) {
                    searchBarFullEtime += 200;
                    setTimeout(searchBarFullVideoCheck, 200);
                }
            }
            // 个人中心
            function searchBarFullAccountCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuDownLayoutSearchBarFull') == 1) {
                        document.getElementsByClassName(btn)[0].style.cssText += 'width: 100%; display: block;';
                        document.getElementsByClassName(btn)[0].style.cssText += 'width: 100%; display: block;';
                        document.getElementsByClassName('search-icon')[0].style.cssText += 'display: none;';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '导航栏搜索框长度占满 - 导航栏搜索框长度调整完毕');
                    } else {
                        document.getElementsByClassName(btn)[0].style.width = '';
                        document.getElementsByClassName(btn)[0].style.display = '';
                        document.getElementsByClassName('search-icon')[0].style.display = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '导航栏搜索框长度占满 - 导航栏搜索框长度已恢复');
                    }
                } else if (searchBarFullEtime < etime || timeoutSwitch) {
                    searchBarFullEtime += 200;
                    setTimeout(searchBarFullAccountCheck, 200);
                }
            }
        }
        // 将弹幕栏整合到播放器内
        function putSendingBarInPlayer() {
            putSendingBarInPlayerEtime = 0;
            if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
                // 视频/影视/列表
                putSendingBarInPlayerVideoCheck();
            }
            // 视频
            function putSendingBarInPlayerVideoCheck() {
                if (document.getElementsByClassName('bpx-player-dm-wrap')[0] && document.getElementsByClassName('bpx-player-dm-hint')[0]) {
                    if (GM_getValue('MRPlayerMode') == 2) {
                        if (GM_getValue('MRMenuPutSendingBarInPlayer') == 1) {
                            putSendingBarInPlayerVideoEnable();
                            // 移动弹幕栏到播放器内
                            document.getElementsByClassName('bpx-player-control-bottom-center')[0].appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        } else {
                            putSendingBarInPlayerVideoDisable();
                            // 移动弹幕栏到初始位置
                            document.getElementById('playerWrap').appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                        }
                    } else {
                        putSendingBarInPlayerVideoDisable();
                        // 移动弹幕栏到初始位置
                        document.getElementsByClassName('bpx-player-primary-area')[0].appendChild(document.getElementsByClassName('bpx-player-sending-area')[0]);
                    }
                    function putSendingBarInPlayerVideoEnable() {
                        // 调整播放器底部空间中间宽度
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.cssText += 'width: 50%; height: 34px; line-height: 34px;';
                        // 隐藏白线
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_inside_player', 'true');
                        // 弹幕栏整体样式
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.cssText += 'background: none; height: 34px; line-height: 34px; margin: -6px auto;';
                        // 观看人数和弹幕装填信息
                        document.getElementsByClassName('bpx-player-video-info')[0].style.cssText += 'color: hsla(0,0%,100%,.8);';
                        // 弹幕开关, 适配DarkReader
                        if (document.getElementsByTagName('html')[0].getAttribute('data-darkreader-scheme') != 'dark') {
                            document.getElementsByClassName('bui-danmaku-switch')[0].style.cssText += 'fill: hsla(0,0%,100%,.9);';
                        }
                        // 弹幕设置
                        if (document.getElementsByTagName('html')[0].getAttribute('data-darkreader-scheme') != 'dark') {
                            document.getElementsByClassName('bpx-player-dm-setting')[0].style.cssText += 'fill: hsla(0,0%,100%,.9);';
                        }
                        // 弹幕发送框背景
                        document.getElementsByClassName('bpx-player-video-inputbar')[0].style.cssText += 'width: auto; background: hsla(0,0%,100%,0.6);';
                        // 弹幕样式按钮样式
                        document.getElementsByClassName('bpx-player-video-btn-dm')[0].style.cssText += 'fill: hsla(0,0%,100%,.9);';
                        // 弹幕发送框文本样式
                        document.getElementsByClassName('bpx-player-dm-input')[0].style.cssText += 'color: hsla(0,0%,100%,.6);';
                        document.getElementsByClassName('bpx-player-dm-input')[0].setAttribute('mr_inside_player', 'true');
                        // 弹幕礼仪按钮
                        document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].children[0].style.cssText += 'color: hsla(0,0%,100%,.6);';
                        document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].children[1].style.cssText += 'fill: hsla(0,0%,100%,.6);';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '将弹幕栏整合到播放器内 - 已将弹幕栏整合到播放器内');
                    }
                    function putSendingBarInPlayerVideoDisable() {
                        // 调整播放器底部空间中间宽度
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.width = '';
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.height = '';
                        document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.lineHeight = '';
                        // 隐藏白线
                        document.getElementsByClassName('bpx-player-sending-area')[0].setAttribute('mr_inside_player', '')
                        // 弹幕栏整体样式
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.background = '';
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.height = '';
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.lineHeight = '';
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.padding = '';
                        document.getElementsByClassName('bpx-player-sending-bar')[0].style.margin = '';
                        // 观看人数和弹幕装填信息
                        document.getElementsByClassName('bpx-player-video-info')[0].style.color = '';
                        // 弹幕开关
                        document.getElementsByClassName('bui-danmaku-switch')[0].style.fill = '';
                        // 弹幕设置
                        document.getElementsByClassName('bpx-player-dm-setting')[0].style.fill = '';
                        // 弹幕发送框背景
                        document.getElementsByClassName('bpx-player-video-inputbar')[0].style.width = '';
                        document.getElementsByClassName('bpx-player-video-inputbar')[0].style.background = '';
                        // 弹幕样式按钮样式
                        document.getElementsByClassName('bpx-player-video-btn-dm')[0].style.fill = '';
                        // 弹幕发送框文本样式
                        document.getElementsByClassName('bpx-player-dm-input')[0].style.color = '';
                        document.getElementsByClassName('bpx-player-dm-input')[0].setAttribute('mr_inside_player', '')
                        // 弹幕礼仪按钮
                        document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].children[0].style.color = '';
                        document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].children[1].style.fill = '';
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '将弹幕栏整合到播放器内 - 弹幕栏位置已恢复');
                    }
                } else if (putSendingBarInPlayerEtime < etime || timeoutSwitch) {
                    putSendingBarInPlayerEtime += 200;
                    setTimeout(putSendingBarInPlayerVideoCheck, 200);
                }
            }
        }
        // 隐藏观看人数和弹幕装填信息
        function hideVideoInfo() {
            hideVideoInfoEtime = 0;
            let btn = '';
            if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
                // 视频/影视/列表
                btn = 'bpx-player-video-info';
                hideVideoInfoVideoCheck();
            }
            // 视频
            function hideVideoInfoVideoCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuHideVideoInfo') == 1) {
                        document.getElementsByClassName(btn)[0].style.cssText += 'display: none';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏观看人数和弹幕装填信息 - 已隐藏观看人数和弹幕装填信息');
                    } else {
                        document.getElementsByClassName(btn)[0].style.display = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏观看人数和弹幕装填信息 - 已显示观看人数和弹幕装填信息');
                    }
                } else if (hideVideoInfoEtime < etime || timeoutSwitch) {
                    hideVideoInfoEtime += 200;
                    setTimeout(hideVideoInfoVideoCheck, 200);
                }
            }
        }
        // 播放器内显示选集按钮
        function displayEplist() {
            displayEplistEtime = 0;
            let btn = '';
            if (webStatus == 0) {
                // 视频
                btn = 'bpx-player-ctrl-eplist';
                setInterval(displayEplistVideoCheck, 200);
            } else if (webStatus == 1) {
                // 影视
                btn = 'squirtle-pagelist-wrap';
                setInterval(displayEplistMovieCheck, 200);
            }
            // 视频
            function displayEplistVideoCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuDisplayEplist') == 1) {
                        if (!document.getElementsByClassName(btn)[0].getAttribute('mr_show_eplist') || !document.getElementsByClassName(btn)[0].getAttribute('mr_show_eplist') == 'true') {
                            document.getElementsByClassName(btn)[0].setAttribute('mr_show_eplist', 'true');
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示选集按钮 - 已显示选集按钮');
                        }
                    } else if (document.getElementsByClassName(btn)[0].getAttribute('mr_show_eplist') == 'true') {
                        document.getElementsByClassName(btn)[0].setAttribute('mr_show_eplist', '');
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示选集按钮 - 已隐藏选集按钮');
                    }
                }
            }
            // 影视
            function displayEplistMovieCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuDisplayEplist') == 1) {
                        if (!document.getElementsByClassName(btn)[0].getAttribute('mr_always_display') || !document.getElementsByClassName(btn)[0].getAttribute('mr_always_display') == 'true') {
                            document.getElementsByClassName(btn)[0].setAttribute('mr_always_display', 'true');
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示选集按钮 - 已显示选集按钮');
                        }
                    } else if (document.getElementsByClassName(btn)[0].getAttribute('mr_always_display') == 'true') {
                        document.getElementsByClassName(btn)[0].setAttribute('mr_always_display', '');
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示选集按钮 - 已隐藏选集按钮');
                    }
                } else if (displayEplistEtime < etime || timeoutSwitch) {
                    displayEplistEtime += 200;
                    setTimeout(displayEplistMovieCheck, 200);
                }
            }
        }
        // 播放器内显示标题
        function displayTitle() {
            displayTitleEtime = 0;
            if (webStatus == 0) {
                // 视频
                setInterval(displayTitleVideoCheck, 200);
            }
            // 视频
            function displayTitleVideoCheck() {
                if (document.getElementsByClassName('bpx-player-top-left-title')[0] && loadReady) {
                    if (GM_getValue('MRMenuDisplayTitle') == 1) {
                        if (window.getComputedStyle(document.getElementsByClassName('bpx-player-top-left-title')[0], null)['display'] != 'block') {
                            document.getElementsByClassName('bpx-player-top-left-title')[0].style.cssText += 'display: block !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示标题 - 已显示标题');
                        }
                        if (window.getComputedStyle(document.getElementsByClassName('bpx-player-top-mask')[0], null)['display'] != 'block') {
                            document.getElementsByClassName('bpx-player-top-mask')[0].style.cssText += 'display: block !important;';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示标题 - 已显示标题背景');
                        }
                    } else {
                        if (window.getComputedStyle(document.getElementsByClassName('bpx-player-top-left-title')[0], null)['display'] != 'none') {
                            document.getElementsByClassName('bpx-player-top-left-title')[0].style.display = 'none';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示标题 - 已隐藏标题');
                        }
                        if (window.getComputedStyle(document.getElementsByClassName('bpx-player-top-mask')[0], null)['display'] != 'none') {
                            document.getElementsByClassName('bpx-player-top-mask')[0].style.display = 'none';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器内显示标题 - 已隐藏标题背景');
                        }
                    }
                }
            }
        }
        // 隐藏播放器内关注按钮
        function hideFollowBtn() {
            hideFollowBtnEtime = 0;
            let btn = '';
            if (webStatus == 0 || webStatus == 2) {
                // 视频/列表
                btn = 'bpx-player-follow';
                hideFollowBtnVideoCheck();
            }
            // 视频
            function hideFollowBtnVideoCheck() {
                if (document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuHideFollowBtn') == 1) {
                        document.getElementsByClassName(btn)[0].style.cssText += 'display: none !important;';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏播放器内关注按钮 - 已隐藏关注按钮');
                    } else {
                        document.getElementsByClassName(btn)[0].style.display = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏播放器内关注按钮 - 已显示关注按钮');
                    }
                } else if (hideFollowBtnEtime < etime || timeoutSwitch) {
                    hideFollowBtnEtime += 200;
                    setTimeout(hideFollowBtnVideoCheck, 200);
                }
            }
        }
        // 把标题和头像移到视频下方
        function moveTitleAndUpinfo() {
            moveTitleAndUpinfoEtime = 0;
            if (webStatus == 0) {
                // 视频
                moveTitleAndUpinfoVideoCheck();
            } else if (webStatus == 2) {
                // 列表
                moveTitleAndUpinfoListCheck();
            }
            // 视频
            function moveTitleAndUpinfoVideoCheck() {
                if (document.getElementById('viewbox_report') && (document.getElementsByClassName('up-panel-container')[0] || document.getElementsByClassName('members-info-container')[0]) && document.getElementById('arc_toolbar_report') && loadReady) {
                    if (GM_getValue('MRMenuMoveTitleAndUpinfo') == 1) {
                        // 移动标题到点赞栏上方
                        if (GM_getValue('MRPlayerMode') != 2) {
                            document.getElementsByClassName('left-container')[0].insertBefore(document.getElementById('viewbox_report'), document.getElementById('arc_toolbar_report'));
                        } else {
                            document.getElementsByClassName('right-container')[0].setAttribute('mr_layout', 'true');
                        }
                        // 标题样式
                        document.getElementById('viewbox_report').setAttribute('mr_layout', 'true');
                        if (!document.getElementsByClassName('members-info-container')[0]) {
                            // 移动头像到点赞栏上方
                            document.getElementsByClassName('left-container')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('arc_toolbar_report'));
                            // 头像栏样式
                            document.getElementsByClassName('up-panel-container')[0].setAttribute('mr_layout', 'true');
                            document.getElementsByClassName('up-info-container')[0].setAttribute('mr_layout', 'true');
                            // 播放器样式
                            if (GM_getValue('MRPlayerMode') != 2) {
                                document.getElementById('playerWrap').setAttribute('mr_layout', 'true');
                            } else {
                                document.getElementById('playerWrap').setAttribute('mr_layout', '');
                            }
                            // 充电面板样式
                            document.getElementsByClassName('upinfo-btn-panel')[0].setAttribute('mr_layout', 'true');
                            // 充电按钮样式
                            if (document.getElementsByClassName('old-charge-btn')[0]) {
                                document.getElementsByClassName('old-charge-btn')[0].setAttribute('mr_layout', 'true');
                            } else if (document.getElementsByClassName('new-charge-btn')[0]) {
                                document.getElementsByClassName('new-charge-btn')[0].setAttribute('mr_layout', 'true');
                            }
                            // 关注按钮样式
                            document.getElementsByClassName('follow-btn')[0].setAttribute('mr_layout', 'true');
                            // 名称样式
                            document.getElementsByClassName('up-name')[0].setAttribute('mr_layout', 'true');
                            // 简介样式
                            if (!document.getElementsByClassName('up-detail')[0].children[1]) {
                                document.getElementsByClassName('upinfo-btn-panel')[0].style.cssText += 'margin: -30px 10px 0px 0px;';
                            } else {
                                document.getElementsByClassName('up-detail-bottom')[0].style.cssText += 'width: calc(100% - 300px);';
                            }
                            // 当头像有装饰时
                            if (document.getElementsByClassName('has-pendant')[0]) {
                                document.getElementsByClassName('has-pendant')[0].setAttribute('mr_layout', 'true');
                            }
                        } else {
                            // 联合投稿
                            document.getElementsByClassName('members-info-container')[0].setAttribute('mr_layout', 'true');
                            // 移动联合投稿到点赞栏上方
                            document.getElementsByClassName('left-container')[0].insertBefore(document.getElementsByClassName('members-info-container')[0], document.getElementById('arc_toolbar_report'));
                        }
                        // 修复非网页全屏模式下“播放器加载完毕后移动窗口到顶部”
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1 && GM_getValue('MRPlayerMode') != 2) {
                            moveWindowToTop();
                        }
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '把标题和头像移到视频下方 - 已调整标题和头像样式并移动至视频下方');
                    } else {
                        // 移动标题到原位
                        if (GM_getValue('MRPlayerMode') != 2) {
                            document.getElementsByClassName('left-container')[0].insertBefore(document.getElementById('viewbox_report'), document.getElementById('playerWrap'));
                        } else {
                            document.getElementsByClassName('right-container')[0].setAttribute('mr_layout', '');
                        }
                        // 标题样式
                        document.getElementById('viewbox_report').setAttribute('mr_layout', '');
                        if (!document.getElementsByClassName('members-info-v1')[0]) {
                            // 移动头像到原位
                            document.getElementsByClassName('right-container-inner')[0].appendChild(document.getElementsByClassName('up-panel-container')[0]);
                            document.getElementsByClassName('right-container-inner')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('danmukuBox'));
                            // 头像栏样式
                            document.getElementsByClassName('up-panel-container')[0].setAttribute('mr_layout', '');
                            document.getElementsByClassName('up-info-container')[0].setAttribute('mr_layout', '');
                            // 播放器样式
                            document.getElementById('playerWrap').setAttribute('mr_layout', '');
                            // 充电面板样式
                            document.getElementsByClassName('upinfo-btn-panel')[0].setAttribute('mr_layout', '');
                            // 充电按钮样式
                            if (document.getElementsByClassName('old-charge-btn')[0]) {
                                document.getElementsByClassName('old-charge-btn')[0].setAttribute('mr_layout', '');
                            } else if (document.getElementsByClassName('new-charge-btn')[0]) {
                                document.getElementsByClassName('new-charge-btn')[0].setAttribute('mr_layout', '');
                            }
                            // 关注按钮样式
                            document.getElementsByClassName('follow-btn')[0].setAttribute('mr_layout', '');
                            // 名称样式
                            document.getElementsByClassName('up-name')[0].setAttribute('mr_layout', '');
                            // 简介样式
                            if (!document.getElementsByClassName('up-detail')[0].children[1]) {
                                document.getElementsByClassName('upinfo-btn-panel')[0].style.margin = '';
                            } else {
                                document.getElementsByClassName('up-detail-bottom')[0].style.width = '';
                            }
                            // 当头像有装饰时
                            if (document.getElementsByClassName('has-pendant')[0]) {
                                document.getElementsByClassName('has-pendant')[0].setAttribute('mr_layout', '');
                            }
                        } else {
                            // 联合投稿
                            document.getElementsByClassName('members-info-container')[0].setAttribute('mr_layout', '');
                            // 移动联合投稿到原位
                            document.getElementsByClassName('right-container-inner')[0].children[0].appendChild(document.getElementsByClassName('members-info-container')[0]);
                        }
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '把标题和头像移到视频下方 - 已恢复标题和头像位置');
                    }
                } else if (moveTitleAndUpinfoEtime < etime || timeoutSwitch) {
                    moveTitleAndUpinfoEtime += 200;
                    setTimeout(moveTitleAndUpinfoVideoCheck, 200);
                }
            }
            // 列表
            function moveTitleAndUpinfoListCheck() {
                if (document.getElementsByClassName('video-info-container')[0] && (document.getElementsByClassName('up-panel-container')[0] || document.getElementsByClassName('members-info-container')[0]) && document.getElementById('playlistToolbar') && loadReady) {
                    if (GM_getValue('MRMenuMoveTitleAndUpinfo') == 1) {
                        // 移动标题到点赞栏上方
                        if (GM_getValue('MRPlayerMode') != 2) {
                            document.getElementsByClassName('playlist-container--left')[0].insertBefore(document.getElementsByClassName('video-info-container')[0], document.getElementById('playlistToolbar'));
                        } else {
                            document.getElementsByClassName('playlist-container--right')[0].setAttribute('mr_layout', 'true');
                        }
                        // 标题样式
                        document.getElementsByClassName('video-info-container')[0].setAttribute('mr_layout', 'true');
                        if (!document.getElementsByClassName('members-info-container')[0]) {
                            // 移动头像到点赞栏上方
                            document.getElementsByClassName('playlist-container--left')[0].appendChild(document.getElementsByClassName('up-panel-container')[0]);
                            document.getElementsByClassName('playlist-container--left')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('playlistToolbar'));
                            // 头像栏样式
                            document.getElementsByClassName('up-panel-container')[0].setAttribute('mr_layout', 'true');
                            document.getElementsByClassName('up-info-container')[0].setAttribute('mr_layout', 'true');
                            // 播放器样式
                            if (GM_getValue('MRPlayerMode') != 2) {
                                document.getElementById('playerWrap').setAttribute('mr_layout', 'true');
                            } else {
                                document.getElementById('playerWrap').setAttribute('mr_layout', '');
                            }
                            // 充电面板样式
                            document.getElementsByClassName('upinfo-btn-panel')[0].setAttribute('mr_layout', 'true');
                            // 充电按钮样式
                            if (document.getElementsByClassName('old-charge-btn')[0]) {
                                document.getElementsByClassName('old-charge-btn')[0].setAttribute('mr_layout', 'true');
                            } else if (document.getElementsByClassName('new-charge-btn')[0]) {
                                document.getElementsByClassName('new-charge-btn')[0].setAttribute('mr_layout', 'true');
                            }
                            // 关注按钮样式
                            document.getElementsByClassName('follow-btn')[0].setAttribute('mr_layout', 'true');
                            // 名称样式
                            document.getElementsByClassName('up-detail-top')[0].setAttribute('mr_layout', 'true');
                            // 简介样式
                            if (document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1] && document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1].className.match('up-description')) {
                                document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1].style.cssText += 'width: calc(100% - 300px);';
                            } else {
                                document.getElementsByClassName('upinfo-btn-panel')[0].style.cssText += 'margin: -26px 10px 0px 0px;';
                            }
                            // 当头像有装饰时
                            if (document.getElementsByClassName('has-pendant')[0]) {
                                document.getElementsByClassName('has-pendant')[0].setAttribute('mr_layout', 'true');
                            }
                        } else {
                            // 联合投稿
                            document.getElementsByClassName('members-info-container')[0].setAttribute('mr_layout', 'true');
                            // 移动联合投稿到点赞栏上方
                            document.getElementsByClassName('playlist-container--left')[0].appendChild(document.getElementsByClassName('up-panel-container')[0]);
                            document.getElementsByClassName('playlist-container--left')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('playlistToolbar'));
                        }
                        // 修复非网页全屏模式下“播放器加载完毕后移动窗口到顶部”
                        if (GM_getValue('MRMenuMoveWindowToTop') == 1 && GM_getValue('MRPlayerMode') != 2) {
                            moveWindowToTop();
                        }
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '把标题和头像移到视频下方 - 已调整标题和头像样式并移动至视频下方');
                    } else {
                        // 移动标题到原位
                        if (GM_getValue('MRPlayerMode') != 2) {
                            document.getElementsByClassName('playlist-container--left')[0].insertBefore(document.getElementsByClassName('video-info-container')[0], document.getElementById('playerWrap'));
                        } else {
                            document.getElementsByClassName('playlist-container--right')[0].setAttribute('mr_layout', '');
                        }
                        // 标题样式
                        document.getElementsByClassName('video-info-container')[0].setAttribute('mr_layout', '');
                        if (!document.getElementsByClassName('members-info-container')[0]) {
                            // 移动头像到原位
                            document.getElementsByClassName('playlist-container--right')[0].appendChild(document.getElementsByClassName('up-panel-container')[0]);
                            document.getElementsByClassName('playlist-container--right')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('danmukuBox'));
                            // 头像栏样式
                            document.getElementsByClassName('up-panel-container')[0].setAttribute('mr_layout', '');
                            document.getElementsByClassName('up-info-container')[0].setAttribute('mr_layout', '');
                            // 播放器样式
                            document.getElementById('playerWrap').setAttribute('mr_layout', '');
                            // 充电面板样式
                            document.getElementsByClassName('upinfo-btn-panel')[0].setAttribute('mr_layout', '');
                            // 充电按钮样式
                            if (document.getElementsByClassName('old-charge-btn')[0]) {
                                document.getElementsByClassName('old-charge-btn')[0].setAttribute('mr_layout', '');
                            } else if (document.getElementsByClassName('new-charge-btn')[0]) {
                                document.getElementsByClassName('new-charge-btn')[0].setAttribute('mr_layout', '');
                            }
                            // 关注按钮样式
                            document.getElementsByClassName('follow-btn')[0].setAttribute('mr_layout', '');
                            // 名称样式
                            document.getElementsByClassName('up-detail-top')[0].setAttribute('mr_layout', '');
                            // 简介样式
                            if (document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1] && document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1].className.match('up-description')) {
                                document.getElementsByClassName('up-info--right')[0].children[0].children[0].children[1].style.width = '';
                            } else {
                                document.getElementsByClassName('upinfo-btn-panel')[0].style.margin = '';
                            }
                            // 当头像有装饰时
                            if (document.getElementsByClassName('has-pendant')[0]) {
                                document.getElementsByClassName('has-pendant')[0].setAttribute('mr_layout', '');
                            }
                        } else {
                            // 联合投稿
                            document.getElementsByClassName('members-info-container')[0].setAttribute('mr_layout', '');
                            // 移动联合投稿到原位
                            document.getElementsByClassName('playlist-container--right')[0].appendChild(document.getElementsByClassName('up-panel-container')[0]);
                            document.getElementsByClassName('playlist-container--right')[0].insertBefore(document.getElementsByClassName('up-panel-container')[0], document.getElementById('danmukuBox'));
                        }
                        // 通知
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '把标题和头像移到视频下方 - 已恢复标题和头像位置');
                    }
                } else if (moveTitleAndUpinfoEtime < etime || timeoutSwitch) {
                    moveTitleAndUpinfoEtime += 200;
                    setTimeout(moveTitleAndUpinfoListCheck, 200);
                }
            }
        }

        var betterToolTipVolumePopupStyle = '';
        betterToolTipVolumePopupStyle = document.createElement('style');
        MRMenuElement.appendChild(betterToolTipVolumePopupStyle);
        // 优化工具提示弹窗
        function betterToolTip() {
            let toolTipPopup = '';
            let volumePopup = '';
            if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
                // 视频/影视/列表
                volumePopup = 'bpx-player-volume-hint';
                toolTipPopup = 'bpx-player-tooltip-area';
                betterToolTipVideoCheck();
            }
            // 视频
            function betterToolTipVideoCheck() {
                if (document.getElementsByClassName(toolTipPopup)[0]) {
                    if (GM_getValue('MRMenuBetterToolTip') == 1) {
                        document.getElementsByClassName(toolTipPopup)[0].style.cssText += 'display: none !important;';
                        betterToolTipVolumePopupStyle.innerHTML = '\r\n\
                            /* 优化工具提示弹窗 */\r\n\
                            .bpx-player-volume-hint {\r\n\
                                top: 15% !important; \r\n\
                                transform: translate(-50%,-50%) scale(0.75) !important; \r\n\
                            } \r\n\
                            \r\n\
                        ';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '优化工具提示弹窗 - 已隐藏工具提示弹窗并调整音量提示弹窗样式');
                    } else {
                        document.getElementsByClassName(toolTipPopup)[0].style.display = '';
                        betterToolTipVolumePopupStyle.innerHTML = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '优化工具提示弹窗 - 取消隐藏工具提示弹窗并取消调整音量提示弹窗样式');
                    }
                } else if (betterToolTipEtime < etime || timeoutSwitch) {
                    betterToolTipEtime += 200;
                    setTimeout(betterToolTipVideoCheck, 200);
                }
            }
        }
        // 隐藏视频底部蓝条
        function hideProgressArea() {
            if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
                // 视频/影视/列表
                hideProgressAreaVideoCheck();
            }
            // 视频
            function hideProgressAreaVideoCheck() {
                if (document.getElementsByClassName('bpx-player-shadow-progress-area')[0]) {
                    if (GM_getValue('MRMenuHideProgressArea') == 1) {
                        document.getElementsByClassName('bpx-player-shadow-progress-area')[0].setAttribute('mr_hide_progress_area', 'true');
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏视频底部蓝条 - 已隐藏视频底部蓝条');
                    } else {
                        document.getElementsByClassName('bpx-player-shadow-progress-area')[0].setAttribute('mr_hide_progress_area', '');
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏视频底部蓝条 - 已取消隐藏视频底部蓝条');
                    }
                } else {
                    setTimeout(hideProgressAreaVideoCheck, 200);
                }
            }
        }
        // 隐藏导航栏标签
        function hideNavigationBarTag() {
            hideNavigationBarTagEtime = 0;
            if (webStatus == 0 || webStatus == 1 || webStatus == 2 || webStatus == 3 || webStatus == 4 || webStatus == 5 || webStatus == 6 || webStatus == 9) {
                // 视频/影视/列表/空间/搜索/主页/信息
                hideNavigationBarTagVideoCheck();
            } else if (webStatus == 2 || webStatus == 7) {
                // 个人中心
                hideNavigationBarTagAccountCheck();
            } else if (webStatus == 8) {
                // 稍后再看页面
                hideNavigationBarTagWatchLaterCheck();
            }
            // 视频
            function hideNavigationBarTagVideoCheck() {
                if (document.getElementsByClassName('left-entry')[0] && loadReady) {
                    for (let i = 0; i < GM_getValue('MRMenuHideNavigationBarTag').split('').length; i++) {
                        if (GM_getValue('MRMenuHideNavigationBarTag').split('')[i] == 1) {
                            if (i == 0) {
                                document.getElementsByClassName('left-entry')[0].children[0].children[0].children[0].style.cssText += 'display: none';
                            } else if (i == 1) {
                                document.getElementsByClassName('left-entry')[0].children[0].children[0].children[1].style.cssText += 'display: none';
                            } else if (i == 8) {
                                for (let i2 = 0; i2 < document.getElementsByClassName('left-entry')[0].children.length; i2++) {
                                    if (document.getElementsByClassName('left-entry')[0].children[i2].className.match('left-loc-entry')) {
                                        document.getElementsByClassName('left-entry')[0].children[i2].style.cssText += 'display: none';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('left-entry')[0].children[document.getElementsByClassName('left-entry')[0].children.length - 1].style.cssText += 'display: none';
                            } else {
                                document.getElementsByClassName('left-entry')[0].children[i - 1].style.cssText += 'display: none';
                            }
                        } else {
                            if (i == 0) {
                                document.getElementsByClassName('left-entry')[0].children[0].children[0].children[0].style.display = '';
                            } else if (i == 1) {
                                document.getElementsByClassName('left-entry')[0].children[0].children[0].children[1].style.display = '';
                            } else if (i == 8) {
                                for (let i2 = 0; i2 < document.getElementsByClassName('left-entry')[0].children.length; i2++) {
                                    if (document.getElementsByClassName('left-entry')[0].children[i2].className.match('left-loc-entry')) {
                                        document.getElementsByClassName('left-entry')[0].children[i2].style.display = '';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('left-entry')[0].children[document.getElementsByClassName('left-entry')[0].children.length - 1].style.display = '';
                            } else {
                                document.getElementsByClassName('left-entry')[0].children[i - 1].style.display = '';
                            }
                        }
                    }
                    // 通知
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏导航栏标签 - 已调整导航栏标签');
                } else if (hideNavigationBarTagEtime < etime || timeoutSwitch) {
                    hideNavigationBarTagEtime += 200;
                    setTimeout(hideNavigationBarTagVideoCheck, 200);
                }
            }
            // 个人中心
            function hideNavigationBarTagAccountCheck() {
                if (document.getElementsByClassName('nav-link-ul')[0] && loadReady) {
                    for (let i = 0; i < GM_getValue('MRMenuHideNavigationBarTag').split('').length; i++) {
                        if (GM_getValue('MRMenuHideNavigationBarTag').split('')[i] == 1) {
                            if (i == 0) {
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[0].style.cssText += 'display: none';
                            } else if (i == 1) {
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[1].textContent = '';
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[2].style.cssText += 'display: none';
                            } else if (i == 3) {
                                document.getElementsByClassName('nav-link-ul')[0].children[3].style.cssText += 'display: none';
                            } else if (i == 4) {
                                document.getElementsByClassName('nav-link-ul')[0].children[2].style.cssText += 'display: none';
                            } else if (i == 8) {
                                let hideNavigationBarTagListBlockList = ['主站', '番剧', '游戏中心', '直播', '会员购', '漫画', '赛事', '下载客户端'];
                                for (let i2 = 0; i2 < document.getElementsByClassName('nav-link-ul')[0].children.length; i2++) {
                                    let match = 0;
                                    for (let i3 = 0; i3 < hideNavigationBarTagListBlockList.length; i3++) {
                                        if (document.getElementsByClassName('nav-link-ul')[0].children[i2].textContent.match(hideNavigationBarTagListBlockList[i3])) {
                                            match = 1;
                                        }
                                    }
                                    if (match == 0) {
                                        document.getElementsByClassName('nav-link-ul')[0].children[i2].style.cssText += 'display: none';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('nav-link-ul')[0].children[document.getElementsByClassName('nav-link-ul')[0].children.length - 1].style.cssText += 'display: none';
                            } else {
                                document.getElementsByClassName('nav-link-ul')[0].children[i - 1].style.cssText += 'display: none';
                            }
                        } else {
                            if (i == 0) {
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[0].style.display = '';
                            } else if (i == 1) {
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[1].textContent = '主站';
                                document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[1].childNodes[2].style.display = '';
                            } else if (i == 3) {
                                document.getElementsByClassName('nav-link-ul')[0].children[3].style.display = '';
                            } else if (i == 4) {
                                document.getElementsByClassName('nav-link-ul')[0].children[2].style.display = '';
                            } else if (i == 8) {
                                let hideNavigationBarTagListBlockList = ['主站', '番剧', '游戏中心', '直播', '会员购', '漫画', '赛事', '下载客户端'];
                                for (let i2 = 0; i2 < document.getElementsByClassName('nav-link-ul')[0].children.length; i2++) {
                                    let match = 0;
                                    for (let i3 = 0; i3 < hideNavigationBarTagListBlockList.length; i3++) {
                                        if (document.getElementsByClassName('nav-link-ul')[0].children[i2].textContent.match(hideNavigationBarTagListBlockList[i3])) {
                                            match = 1;
                                        }
                                    }
                                    if (match == 0) {
                                        document.getElementsByClassName('nav-link-ul')[0].children[i2].style.display = '';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('nav-link-ul')[0].children[document.getElementsByClassName('nav-link-ul')[0].children.length - 1].style.display = '';
                            } else {
                                document.getElementsByClassName('nav-link-ul')[0].children[i - 1].style.display = '';
                            }
                        }
                    }
                    // 通知
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏导航栏标签 - 已调整导航栏标签');
                } else if (hideNavigationBarTagEtime < etime || timeoutSwitch) {
                    hideNavigationBarTagEtime += 200;
                    setTimeout(hideNavigationBarTagAccountCheck, 200);
                }
            }
            // 稍后再看页面
            function hideNavigationBarTagWatchLaterCheck() {
                if (loadReady) {
                    if (document.getElementsByClassName('nav-link-ul')[0].children[0].children[0] && document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[0]) {
                        document.getElementsByClassName('nav-link-ul')[0].appendChild(document.getElementsByClassName('nav-link-ul')[0].children[0].children[0].children[0]);
                        document.getElementsByClassName('nav-link-ul')[0].insertBefore(document.getElementsByClassName('nav-link-ul')[0].children[document.getElementsByClassName('nav-link-ul')[0].children.length - 1], document.getElementsByClassName('nav-link-ul')[0].children[0]);
                        // 展开搜索框
                        document.getElementsByClassName('user-con search-icon')[0].style.cssText += 'display: none';
                        document.getElementsByClassName('nav-search-box')[0].style.cssText += 'display: block';
                    }
                    for (let i = 0; i < GM_getValue('MRMenuHideNavigationBarTag').split('').length; i++) {
                        if (GM_getValue('MRMenuHideNavigationBarTag').split('')[i] == 1) {
                            if (i == 1) {
                                document.getElementsByClassName('nav-link-ul')[0].children[1].children[0].style.cssText += 'display: none';
                            } else if (i == 3) {
                                document.getElementsByClassName('nav-link-ul')[0].children[4].style.cssText += 'display: none';
                            } else if (i == 4) {
                                document.getElementsByClassName('nav-link-ul')[0].children[3].style.cssText += 'display: none';
                            } else if (i == 8) {
                                let hideNavigationBarTagListBlockList = ['主站', '番剧', '游戏中心', '直播', '会员购', '漫画', '赛事', '下载客户端'];
                                for (let i2 = 0; i2 < document.getElementsByClassName('nav-link-ul')[0].children.length; i2++) {
                                    let match = 0;
                                    for (let i3 = 0; i3 < hideNavigationBarTagListBlockList.length; i3++) {
                                        if (document.getElementsByClassName('nav-link-ul')[0].children[i2].textContent.match(hideNavigationBarTagListBlockList[i3])) {
                                            match = 1;
                                        }
                                    }
                                    if (match == 0 && i2 != 0) {
                                        document.getElementsByClassName('nav-link-ul')[0].children[i2].style.cssText += 'display: none';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('nav-link-ul')[0].children[document.getElementsByClassName('nav-link-ul')[0].children.length - 1].style.cssText += 'display: none';
                            } else {
                                document.getElementsByClassName('nav-link-ul')[0].children[i].style.cssText += 'display: none';
                            }
                        } else {
                            if (i == 1) {
                                document.getElementsByClassName('nav-link-ul')[0].children[1].children[0].style.display = '';
                            } else if (i == 3) {
                                document.getElementsByClassName('nav-link-ul')[0].children[4].style.display = '';
                            } else if (i == 4) {
                                document.getElementsByClassName('nav-link-ul')[0].children[3].style.display = '';
                            } else if (i == 8) {
                                let hideNavigationBarTagListBlockList = ['主站', '番剧', '游戏中心', '直播', '会员购', '漫画', '赛事', '下载客户端'];
                                for (let i2 = 0; i2 < document.getElementsByClassName('nav-link-ul')[0].children.length; i2++) {
                                    let match = 0;
                                    for (let i3 = 0; i3 < hideNavigationBarTagListBlockList.length; i3++) {
                                        if (document.getElementsByClassName('nav-link-ul')[0].children[i2].textContent.match(hideNavigationBarTagListBlockList[i3])) {
                                            match = 1;
                                        }
                                    }
                                    if (match == 0 && i2 != 0) {
                                        document.getElementsByClassName('nav-link-ul')[0].children[i2].style.display = '';
                                    }
                                }
                            } else if (i == 9) {
                                document.getElementsByClassName('nav-link-ul')[0].children[document.getElementsByClassName('nav-link-ul')[0].children.length - 1].style.display = '';
                            } else {
                                document.getElementsByClassName('nav-link-ul')[0].children[i].style.display = '';
                            }
                        }
                    }
                    // 通知
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '隐藏导航栏标签 - 已调整导航栏标签');
                } else if (hideNavigationBarTagEtime < etime || timeoutSwitch) {
                    hideNavigationBarTagEtime += 200;
                    setTimeout(hideNavigationBarTagWatchLaterCheck, 200);
                }
            }
        }

        // 实用功能与工具
        // 智能连播
        function smartNextPlay() {
            smartNextPlayEtime = 0;
            if (webStatus == 0) {
                // 视频
                smartNextPlayVideoCheck();
            } else if (webStatus == 1) {
                // 影视
                smartNextPlayMovieCheck();
            }
            else if (webStatus == 2) {
                // 列表
                smartNextPlayListCheck();
            }
            // 视频
            function smartNextPlayVideoCheck() {
                if (document.getElementsByClassName('video-pod__list')[0] && loadReady && GM_getValue('MRMenuSmartNextPlay') == 1) {
                    if (document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0] && document.getElementsByClassName('simple-base-item active')[0] && document.getElementsByClassName('simple-base-item active')[0].parentElement.parentElement == document.getElementsByClassName('simple-base-item')[0].parentElement.parentElement.parentElement.children[document.getElementsByClassName('simple-base-item')[0].parentElement.parentElement.parentElement.children.length - 1] && document.getElementsByClassName('switch-btn')[0].className == 'switch-btn on') {
                        document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[1].click();
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为多集视频的最后一集已关闭自动连播');
                    } else if (document.getElementsByClassName('simple-base-item active')[0] && document.getElementsByClassName('simple-base-item active')[0].parentElement.parentElement != document.getElementsByClassName('simple-base-item')[0].parentElement.parentElement.parentElement.children[document.getElementsByClassName('simple-base-item')[0].parentElement.parentElement.parentElement.children.length - 1] && document.getElementsByClassName('switch-btn')[0].className == 'switch-btn') {
                        document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[0].click();
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为多集视频已开启自动连播');
                    }
                } else if (document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0] && document.getElementsByClassName('switch-btn')[0] && document.getElementsByClassName('switch-btn')[0].className == 'switch-btn on') {
                    document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[1].click();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为单集视频已关闭自动连播');
                }
                setTimeout(smartNextPlayVideoCheck, 500);
            }
            // 影视
            function smartNextPlayMovieCheck() {
                if (document.getElementsByClassName('plp-r')[0] && loadReady) {
                    if (document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0] && document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0] && document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0] && document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0] && document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[0]) {
                        for (let i = 0; i < document.getElementsByClassName('plp-r')[0].children.length; i++) {
                            if (document.getElementsByClassName('plp-r')[0].children[i].className.match('eplist')) {
                                let isMultiple = 0;
                                for (let i1 = 0; i1 < document.getElementsByClassName('plp-r')[0].children[i].children.length; i1++) {
                                    if (document.getElementsByClassName('plp-r')[0].children[i].children[i1].className.match('numberList') && document.getElementsByClassName('plp-r')[0].children[i].children[i1].children.length > 1) {
                                        isMultiple = 1;
                                        break
                                    }
                                }
                                if (isMultiple) {
                                    document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[0].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为多集视频已开启自动连播');
                                } else {
                                    document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[1].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为单集视频已关闭自动连播');
                                }
                                break
                            }
                        }
                    } else {
                        smartNextPlayEtime += 20;
                        setTimeout(smartNextPlayMovieCheck, 20);
                    }
                } else if (smartNextPlayEtime < etime || timeoutSwitch) {
                    smartNextPlayEtime += 20;
                    setTimeout(smartNextPlayMovieCheck, 20);
                }
            }
            // 列表
            function smartNextPlayListCheck() {
                if (document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0] && loadReady) {
                    if (document.getElementsByClassName('action-list-inner')[0]) {
                        document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[0].click();
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为多集视频已开启自动连播');
                    } else {
                        document.getElementsByClassName('bpx-player-ctrl-setting-handoff-content')[0].children[0].children[0].children[0].children[1].click();
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '智能连播 - 检测到当前为单集视频已关闭自动连播');
                    }
                } else if (smartNextPlayEtime < etime || timeoutSwitch) {
                    smartNextPlayEtime += 20;
                    setTimeout(smartNextPlayListCheck, 20);
                }
            }
        }
        // 播放器加载完毕后移动窗口到顶部函数
        function moveWindowToTop() {
            setTimeout(function () {
                window.scrollTo(0, 0);
                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '播放器加载完毕后移动窗口到顶部函数 - 已将窗口移至顶部');
            }, 200);
        }
        // 去除宽屏模式左右黑边
        function removeWidescreenBlack() {
            removeWidescreenBlackEtime = 0;
            let btn = '';
            let btn2 = '';
            let checkVideoSize = 0;
            let isPortrait = 0;
            if (webStatus == 0 || webStatus == 1 || webStatus == 2) {
                // 视频/影视/列表
                btn = 'bpx-player-video-perch';
                btn2 = 'bpx-player-primary-area';
                removeWidescreenBlackVideoCheck();
            }
            // 视频
            function removeWidescreenBlackVideoCheck() {
                if (document.getElementsByClassName(btn)[0] && document.getElementsByClassName(btn2)[0] && loadReady) {
                    if (checkVideoSize == 0) {
                        checkVideoSize = 1;
                        document.getElementsByClassName(btn)[0].style.cssText += 'height: auto !important;';
                        document.getElementsByClassName(btn2)[0].style.cssText += 'height: auto !important;';
                        if (!((document.getElementsByClassName(btn)[0].offsetWidth / 16 * 9) - document.getElementsByClassName(btn)[0].offsetHeight > -15 && (document.getElementsByClassName(btn)[0].offsetWidth / 16 * 9) - document.getElementsByClassName(btn)[0].offsetHeight < 15)) {
                            isPortrait = 1;
                        }
                        document.getElementsByClassName(btn)[0].style.height = '';
                        document.getElementsByClassName(btn2)[0].style.height = '';
                    }
                    if (GM_getValue('MRPlayerMode') != 2) {
                        if (GM_getValue('MRMenuRemoveWidescreenBlack') == 1) {
                            if (isPortrait == 0) {
                                if (document.getElementsByClassName(btn2)[0].parentElement.getAttribute('data-screen') == 'full' && document.getElementsByClassName(btn)[0].style.height != '') {
                                    document.getElementsByClassName(btn)[0].style.height = '';
                                    document.getElementsByClassName(btn2)[0].style.height = '';
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '去除宽屏模式左右黑边 - 全屏视频禁用功能');
                                } else if (document.getElementsByClassName(btn2)[0].parentElement.getAttribute('data-screen') != 'full' && document.getElementsByClassName(btn)[0].style.height == '') {
                                    document.getElementsByClassName(btn)[0].style.cssText += 'height: auto !important;';
                                    document.getElementsByClassName(btn2)[0].style.cssText += 'height: auto !important;';
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '去除宽屏模式左右黑边 - 已去除宽屏模式左右黑边');
                                }
                            } else if (document.getElementsByClassName(btn)[0].style.height != '') {
                                document.getElementsByClassName(btn)[0].style.height = '';
                                document.getElementsByClassName(btn2)[0].style.height = '';
                                console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '去除宽屏模式左右黑边 - 视频长宽超过限制比例不做调整');
                            }
                        } else if (document.getElementsByClassName(btn)[0].style.height != '') {
                            document.getElementsByClassName(btn)[0].style.height = '';
                            document.getElementsByClassName(btn2)[0].style.height = '';
                            console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '去除宽屏模式左右黑边 - 已恢复默认');
                        }
                    } else if (document.getElementsByClassName(btn)[0].style.height != '') {
                        document.getElementsByClassName(btn)[0].style.height = '';
                        document.getElementsByClassName(btn2)[0].style.height = '';
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '去除宽屏模式左右黑边 - 网页全屏模式下已恢复默认');
                    }
                } /* else if (removeWidescreenBlackEtime < etime || timeoutSwitch) {
                    removeWidescreenBlackEtime += 20;
                    setTimeout(removeWidescreenBlackVideoCheck, 20);
                } */
                setTimeout(removeWidescreenBlackVideoCheck, 20);
            }
        }
        // 去除评论区蓝色关键字
        function removeKeyword() {
            (function removeKeywordCheck() {
                if (document.getElementsByTagName('bili-comments')[0] && document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed') && document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed').children[0].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents')) {
                    let commentsElements = document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed').children;
                    if (GM_getValue('MRMenuRemoveKeyword') == 1) {
                        for (let i = 0; i < commentsElements.length; i++) {
                            let commentsDetailsElements = commentsElements[i].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                            let fixDarkreaderElementParent = '';
                            let fixDarkreaderElement = '';
                            for (let i1 = 0; i1 < commentsDetailsElements.length; i1++) {
                                if (commentsElements[i].shadowRoot.getElementById('replies') && commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('view-more')) {
                                    fixDarkreaderElementParent = commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('view-more').children[1].shadowRoot.querySelector('button');
                                    if (fixDarkreaderElementParent.getAttribute('mr_fixDarkreader') != 'true') {
                                        fixDarkreaderElement = document.createElement('style');
                                        fixDarkreaderElement.innerHTML = '\r\n\
                                    /* DarkReader 点击查看 按钮颜色修复 */\r\n\
                                    button::before {\r\n\
                                        background-color: unset !important;\r\n\
                                    }\r\n\
                                    ';
                                        fixDarkreaderElementParent.appendChild(fixDarkreaderElement);
                                        fixDarkreaderElementParent.setAttribute('mr_fixDarkreader', 'true');
                                    }
                                }
                                if (commentsDetailsElements[i1].tagName == 'A' && !commentsDetailsElements[i1].textContent.match('@') && !commentsDetailsElements[i1].textContent.match('http') && commentsDetailsElements[i1].getAttribute('data-type') != 'seek' && commentsDetailsElements[i1].getAttribute('href').match('search.bilibili.com') && commentsDetailsElements[i1].style.pointerEvents != 'none') {
                                    commentsDetailsElements[i1].style.cssText += 'pointer-events: none !important; cursor: text !important;';
                                    if (document.getElementsByTagName('html')[0].getAttribute('data-darkreader-scheme') == 'dark') {
                                        commentsDetailsElements[i1].style.cssText += 'color: var(--darkreader-text--text1) !important;';
                                    } else {
                                        commentsDetailsElements[i1].style.cssText += 'color: var(--text1) !important;';
                                    }
                                    if (commentsDetailsElements[i1].children[0]) {
                                        commentsDetailsElements[i1].children[0].style.cssText += 'display: none !important;';
                                    }
                                }
                            }
                            if (commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.querySelector('bili-comment-reply-renderer') && commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('expander-contents')) {
                                let commentsRepliesElementsElements = commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('expander-contents').children;
                                for (let i2 = 0; i2 < commentsRepliesElementsElements.length; i2++) {
                                    if (commentsRepliesElementsElements[i2].getAttribute('id') != 'expander-footer' && commentsRepliesElementsElements[i2].shadowRoot) {
                                        let commentsRepliesElements = commentsRepliesElementsElements[i2].shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                                        for (let i1 = 0; i1 < commentsRepliesElements.length; i1++) {
                                            if (commentsRepliesElements[i1].tagName == 'A' && !commentsRepliesElements[i1].textContent.match('@') && !commentsRepliesElements[i1].textContent.match('http') && commentsRepliesElements[i1].getAttribute('data-type') != 'seek' && commentsRepliesElements[i1].getAttribute('href').match('search.bilibili.com') && commentsRepliesElements[i1].style.pointerEvents != 'none') {
                                                commentsRepliesElements[i1].style.cssText += 'pointer-events: none !important; cursor: text !important;';
                                                if (document.getElementsByTagName('html')[0].getAttribute('data-darkreader-scheme') == 'dark') {
                                                    commentsRepliesElements[i1].style.cssText += 'color: var(--darkreader-text--text1) !important;';
                                                } else {
                                                    commentsRepliesElements[i1].style.cssText += 'color: var(--text1) !important;';
                                                }
                                                if (commentsRepliesElements[i1].children[0]) {
                                                    commentsRepliesElements[i1].children[0].style.cssText += 'display: none !important;';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        setTimeout(removeKeyword, 200);
                    } else {
                        for (let i = 0; i < commentsElements.length; i++) {
                            let commentsDetailsElements = commentsElements[i].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                            for (let i1 = 0; i1 < commentsDetailsElements.length; i1++) {
                                if (commentsDetailsElements[i1].tagName == 'A' && !commentsDetailsElements[i1].textContent.match('@') && !commentsDetailsElements[i1].textContent.match('http') && commentsDetailsElements[i1].getAttribute('data-type') != 'seek' && commentsDetailsElements[i1].getAttribute('href').match('search.bilibili.com') && commentsDetailsElements[i1].style.pointerEvents == 'none') {
                                    commentsDetailsElements[i1].style.pointerEvents = '';
                                    commentsDetailsElements[i1].style.color = '';
                                    commentsDetailsElements[i1].style.cursor = '';
                                    if (commentsDetailsElements[i1].children[0]) {
                                        commentsDetailsElements[i1].children[0].style.display = '';
                                    }
                                }
                            }
                            if (commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.querySelector('bili-comment-reply-renderer') && commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('expander-contents')) {
                                let commentsRepliesElementsElements = commentsElements[i].shadowRoot.getElementById('replies').children[0].shadowRoot.getElementById('expander-contents').children;
                                for (let i2 = 0; i2 < commentsRepliesElementsElements.length; i2++) {
                                    if (commentsRepliesElementsElements[i2].getAttribute('id') != 'expander-footer' && commentsRepliesElementsElements[i2].shadowRoot) {
                                        let commentsRepliesElements = commentsRepliesElementsElements[i2].shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                                        for (let i1 = 0; i1 < commentsRepliesElements.length; i1++) {
                                            if (commentsRepliesElements[i1].tagName == 'A' && !commentsRepliesElements[i1].textContent.match('@') && !commentsRepliesElements[i1].textContent.match('http') && commentsRepliesElements[i1].getAttribute('data-type') != 'seek' && commentsRepliesElements[i1].getAttribute('href').match('search.bilibili.com') && commentsRepliesElements[i1].style.pointerEvents != 'none') {
                                                commentsRepliesElements[i1].style.pointerEvents = '';
                                                commentsRepliesElements[i1].style.color = '';
                                                commentsRepliesElements[i1].style.cursor = '';
                                                if (commentsRepliesElements[i1].children[0]) {
                                                    commentsRepliesElements[i1].children[0].style.display = '';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    setTimeout(removeKeywordCheck, 200);
                }
            })();
        }
        // 去除评论区只有@人的无用评论
        function removeUselessComment() {
            (function removeUselessCommentCheck() {
                if (document.getElementsByTagName('bili-comments')[0] && document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed') && document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed').children[0].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents')) {
                    let commentsElements = document.getElementsByTagName('bili-comments')[0].shadowRoot.getElementById('feed').children;
                    if (GM_getValue('MRMenuRemoveUselessComment') == 1) {
                        for (let i = 0; i < commentsElements.length; i++) {
                            let commentsDetailsElements = commentsElements[i].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                            let isUselessComment = 1;
                            for (let i1 = 0; i1 < commentsDetailsElements.length; i1++) {
                                if (commentsDetailsElements[i1].tagName != 'A') {
                                    isUselessComment = 0;
                                } else if (commentsDetailsElements[i1].tagName == 'A' && !commentsDetailsElements[i1].textContent.match('@')) {
                                    isUselessComment = 0;
                                }
                            }
                            if (isUselessComment == 1 && commentsElements[i].style.display != 'none') {
                                commentsElements[i].style.cssText += 'display: none !important;';
                            }
                        }
                        setTimeout(removeUselessComment, 200);
                    } else {
                        for (let i = 0; i < commentsElements.length; i++) {
                            let commentsDetailsElements = commentsElements[i].shadowRoot.getElementById('comment').shadowRoot.querySelector('bili-rich-text').shadowRoot.getElementById('contents').children;
                            let isUselessComment = 1;
                            for (let i1 = 0; i1 < commentsDetailsElements.length; i1++) {
                                if (commentsDetailsElements[i1].tagName != 'A') {
                                    isUselessComment = 0;
                                } else if (commentsDetailsElements[i1].tagName == 'A' && !commentsDetailsElements[i1].textContent.match('@')) {
                                    isUselessComment = 0;
                                }
                            }
                            if (isUselessComment == 1 && commentsElements[i].style.display == 'none') {
                                commentsElements[i].style.display = '';
                            }
                        }
                    }
                } else {
                    setTimeout(removeUselessCommentCheck, 200);
                }
            })();
        }
        // 更多倍速
        function moreVideoSpeed() {
            if (webStatus == 0 || webStatus == 2) {
                // 视频/列表
                moreVideoSpeedVideoCheck();
            } else if (webStatus == 1) {
                // 影视
                moreVideoSpeedMovieCheck();
            }
            // 视频
            function moreVideoSpeedVideoCheck() {
                if (document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[0]) {
                    if (GM_getValue('MRMenuMoreVideoSpeed') == 1) {
                        // 3倍速
                        let moreVideoSpeedElement3 = document.createElement('li');
                        moreVideoSpeedElement3.setAttribute('class', 'bpx-player-ctrl-playbackrate-menu-item');
                        moreVideoSpeedElement3.setAttribute('data-value', '3');
                        moreVideoSpeedElement3.textContent = '3.0x';
                        document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].insertBefore(moreVideoSpeedElement3, document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].children[0]);
                        // 4倍速
                        let moreVideoSpeedElement4 = document.createElement('li');
                        moreVideoSpeedElement4.setAttribute('class', 'bpx-player-ctrl-playbackrate-menu-item');
                        moreVideoSpeedElement4.setAttribute('data-value', '4');
                        moreVideoSpeedElement4.textContent = '4.0x';
                        document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].insertBefore(moreVideoSpeedElement4, document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].children[0]);
                        // 5倍速
                        let moreVideoSpeedElement5 = document.createElement('li');
                        moreVideoSpeedElement5.setAttribute('class', 'bpx-player-ctrl-playbackrate-menu-item');
                        moreVideoSpeedElement5.setAttribute('data-value', '5');
                        moreVideoSpeedElement5.textContent = '5.0x';
                        moreVideoSpeedElement5.addEventListener('click', function () {
                            for (let i = 0; i < document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item').length; i++) {
                                document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[i].setAttribute('class', 'bpx-player-ctrl-playbackrate-menu-item');
                            }
                            this.setAttribute('class', 'bpx-player-ctrl-playbackrate-menu-item bpx-state-active');
                            setTimeout(() => {
                                document.getElementsByClassName('bpx-player-ctrl-playbackrate-result')[0].textContent = '5.0x';
                            }, 20);
                            document.getElementsByClassName('bpx-player-video-wrap')[0].children[0].playbackRate = 5;
                        });
                        document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].insertBefore(moreVideoSpeedElement5, document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu')[0].children[0]);
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '更多倍速 - 已添加更多倍速按钮');
                    } else {
                        for (let i = 0; i < document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item').length; i++) {
                            if (document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[i].textContent == '3.0x' || document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[i].textContent == '4.0x' || document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[i].textContent == '5.0x') {
                                document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[i].remove();
                            }
                        }
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '更多倍速 - 已移除更多倍速按钮');
                    }
                } else {
                    setTimeout(moreVideoSpeed, 20);
                }
            }
            // 影视
            function moreVideoSpeedMovieCheck() {
                if (document.getElementsByClassName('squirtle-select-item')[0]) {
                    if (GM_getValue('MRMenuMoreVideoSpeed') == 1) {
                        let moreVideoSpeedAllreadyExist = 0;
                        for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                            if (document.getElementsByClassName('squirtle-select-item')[i].textContent == '3.0x' || document.getElementsByClassName('squirtle-select-item')[i].textContent == '4.0x') {
                                moreVideoSpeedAllreadyExist = 1;
                            }
                        }
                        if (moreVideoSpeedAllreadyExist == 0) {
                            // 先给其他倍速按钮注册点击事件
                            for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                document.getElementsByClassName('squirtle-select-item')[i].addEventListener('click', function () {
                                    function elementActive(element) {
                                        for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                            document.getElementsByClassName('squirtle-select-item')[i].setAttribute('class', 'squirtle-select-item');
                                        }
                                        element.setAttribute('class', 'squirtle-select-item active');
                                    }
                                    setTimeout(() => {
                                        elementActive(this);
                                    }, 20);
                                });
                            }
                            // 注册新的倍速按钮
                            // 3倍速
                            let moreVideoSpeedElement3 = document.createElement('li');
                            moreVideoSpeedElement3.setAttribute('class', 'squirtle-select-item');
                            moreVideoSpeedElement3.textContent = '3.0x';
                            moreVideoSpeedElement3.addEventListener('click', function () {
                                for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                    document.getElementsByClassName('squirtle-select-item')[i].setAttribute('class', 'squirtle-select-item');
                                }
                                this.setAttribute('class', 'squirtle-select-item active');
                                setTimeout(() => {
                                    document.getElementsByClassName('squirtle-speed-select-result')[0].textContent = '3.0x';
                                }, 20);
                                document.getElementsByClassName('bpx-player-video-wrap')[0].children[0].playbackRate = 3;
                            });
                            document.getElementsByClassName('squirtle-speed-select-list')[0].insertBefore(moreVideoSpeedElement3, document.getElementsByClassName('squirtle-speed-select-list')[0].children[0]);
                            // 4倍速
                            let moreVideoSpeedElement4 = document.createElement('li');
                            moreVideoSpeedElement4.setAttribute('class', 'squirtle-select-item');
                            moreVideoSpeedElement4.textContent = '4.0x';
                            moreVideoSpeedElement4.addEventListener('click', function () {
                                for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                    document.getElementsByClassName('squirtle-select-item')[i].setAttribute('class', 'squirtle-select-item');
                                }
                                this.setAttribute('class', 'squirtle-select-item active');
                                setTimeout(() => {
                                    document.getElementsByClassName('squirtle-speed-select-result')[0].textContent = '4.0x';
                                }, 20);
                                document.getElementsByClassName('bpx-player-video-wrap')[0].children[0].playbackRate = 4;
                            });
                            document.getElementsByClassName('squirtle-speed-select-list')[0].insertBefore(moreVideoSpeedElement4, document.getElementsByClassName('squirtle-speed-select-list')[0].children[0]);
                            // 5倍速
                            let moreVideoSpeedElement5 = document.createElement('li');
                            moreVideoSpeedElement5.setAttribute('class', 'squirtle-select-item');
                            moreVideoSpeedElement5.textContent = '5.0x';
                            moreVideoSpeedElement5.addEventListener('click', function () {
                                for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                    document.getElementsByClassName('squirtle-select-item')[i].setAttribute('class', 'squirtle-select-item');
                                }
                                this.setAttribute('class', 'squirtle-select-item active');
                                setTimeout(() => {
                                    document.getElementsByClassName('squirtle-speed-select-result')[0].textContent = '5.0x';
                                }, 20);
                                document.getElementsByClassName('bpx-player-video-wrap')[0].children[0].playbackRate = 5;
                            });
                            document.getElementsByClassName('squirtle-speed-select-list')[0].insertBefore(moreVideoSpeedElement5, document.getElementsByClassName('squirtle-speed-select-list')[0].children[0]);
                        } else {
                            for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                                if (document.getElementsByClassName('squirtle-select-item')[i].textContent == '3.0x' || document.getElementsByClassName('squirtle-select-item')[i].textContent == '4.0x') {
                                    document.getElementsByClassName('squirtle-select-item')[i].style.cssText += 'display: list-item;';
                                }
                            }
                        }
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '更多倍速 - 已添加更多倍速按钮');
                    } else {
                        for (let i = 0; i < document.getElementsByClassName('squirtle-select-item').length; i++) {
                            if (document.getElementsByClassName('squirtle-select-item')[i].textContent == '3.0x' || document.getElementsByClassName('squirtle-select-item')[i].textContent == '4.0x' || document.getElementsByClassName('squirtle-select-item')[i].textContent == '5.0x') {
                                document.getElementsByClassName('squirtle-select-item')[i].style.cssText += 'display: none;';
                            }
                        }
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '更多倍速 - 已移除更多倍速按钮');
                    }
                } else {
                    setTimeout(moreVideoSpeed, 20);
                }
            }
        }
        // 稍后再看页面替换网址
        function watchLaterReplaceURL() {
            if (loadReady) {
                if (document.getElementsByClassName('list-box')[0] && webStatus == 8) {
                    if (GM_getValue('MRMenuWatchLaterReplaceURL') == 1) {
                        for (let i = 0; i < document.getElementsByClassName('list-box')[0].children[0].children.length; i++) {
                            document.getElementsByClassName('list-box')[0].children[0].children[i].children[1].href = document.getElementsByClassName('list-box')[0].children[0].children[i].children[1].href.replace('medialist/play/watchlater', 'video');
                            document.getElementsByClassName('list-box')[0].children[0].children[i].children[2].children[0].href = document.getElementsByClassName('list-box')[0].children[0].children[i].children[2].children[0].href.replace('medialist/play/watchlater', 'video');
                        }
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '稍后再看页面替换网址 - 替换网址完成');
                    } else {
                        for (let i = 0; i < document.getElementsByClassName('list-box')[0].children[0].children.length; i++) {
                            document.getElementsByClassName('list-box')[0].children[0].children[i].children[1].href = document.getElementsByClassName('list-box')[0].children[0].children[i].children[1].href.replace('video', 'medialist/play/watchlater');
                            document.getElementsByClassName('list-box')[0].children[0].children[i].children[2].children[0].href = document.getElementsByClassName('list-box')[0].children[0].children[i].children[2].children[0].href.replace('video', 'medialist/play/watchlater');
                        }
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '稍后再看页面替换网址 - 已取消替换网址');
                    }
                } else {
                    setTimeout(watchLaterReplaceURL, 20);
                }
            } else {
                setTimeout(watchLaterReplaceURL, 20);
            }
        }
        // 按ESC退出图片预览
        (function escQuitViewImage() {
            if (document.body) {
                document.body.addEventListener('keydown', function (e) {
                    if (e.key == 'Escape' && GM_getValue('MRMenuEscQuitViewImage') == 1) {
                        if (document.getElementsByClassName('reply-view-image')[0]) {
                            document.getElementsByClassName('operation-btn-icon close-container')[0].click();
                        }
                    }
                });
            } else {
                setTimeout(escQuitViewImage, 20);
            }
        })();
        // 修复视频小窗口延迟
        function vidoeBtnChildren0Function() {
            if (document.getElementsByTagName('video')[0]) {
                if (document.pictureInPictureElement == null) {
                    document.getElementsByTagName('video')[0].requestPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已开启小窗口(video)');
                } else {
                    document.exitPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已关闭小窗口(video)');
                }
            } else {
                if (document.pictureInPictureElement == null) {
                    document.getElementsByTagName('bwp-video')[0].requestPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已开启小窗口(bwp-video)');
                } else {
                    document.exitPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已关闭小窗口(bwp-video)');
                }
            }
        }
        function vidoeBtnChildren1Function() {
            if (document.getElementsByTagName('video')[0]) {
                if (document.pictureInPictureElement == null) {
                    document.getElementsByTagName('video')[0].requestPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已开启小窗口(video)');
                } else {
                    document.exitPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已关闭小窗口(video)');
                }
            } else {
                if (document.pictureInPictureElement == null) {
                    document.getElementsByTagName('bwp-video')[0].requestPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已开启小窗口(bwp-video)');
                } else {
                    document.exitPictureInPicture();
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已关闭小窗口(bwp-video)');
                }
            }
        }
        function fixPIPDelay() {
            let btn = '';
            if (webStatus == 0 || webStatus == 2) {
                // 视频/列表
                btn = 'bpx-player-ctrl-pip';
                fixPIPDelayVideo();
            }
            // 视频
            function fixPIPDelayVideo() {
                if ((document.getElementsByTagName('video')[0] || document.getElementsByTagName('bwp-video')[0]) && document.getElementsByClassName(btn)[0]) {
                    if (GM_getValue('MRMenuFixPIPDelay') == 1) {
                        document.getElementsByClassName(btn)[0].children[0].addEventListener('click', vidoeBtnChildren0Function);
                        document.getElementsByClassName(btn)[0].children[1].addEventListener('click', vidoeBtnChildren1Function);
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已注入小窗口按钮动作');
                    } else {
                        document.getElementsByClassName(btn)[0].children[0].removeEventListener('click', vidoeBtnChildren0Function);
                        document.getElementsByClassName(btn)[0].children[1].removeEventListener('click', vidoeBtnChildren1Function);
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '修复视频小窗口延迟 - 已移除小窗口按钮动作');
                    }
                } else {
                    setTimeout(fixPIPDelayVideo, 20);
                }
            }
        };
        // 总是开启字幕
        function alwaysOpenSubtitle() {
            (function alwaysOpenSubtitleCheck() {
                if (GM_getValue('MRMenuAlwaysOpenSubtitle') == 1) {
                    if (document.getElementsByClassName('bpx-player-ctrl-subtitle')[0]) {
                        document.getElementsByClassName('bpx-player-ctrl-subtitle')[0].children[0].children[0].click();
                        console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '总是开启字幕 - 已开启字幕');
                    } else if (alwaysOpenSubtitleEtime < etime || timeoutSwitch) {
                        alwaysOpenSubtitleEtime += 20;
                        setTimeout(alwaysOpenSubtitleCheck, 20);
                    }
                }
            })();
        };
        // 总是开启或关闭弹幕
        function alwaysDisableDnmaku() {
            alwaysDisableDnmakuEtime = 0;
            if (webStatus == 0 || webStatus == 2) {
                // 视频/列表
                alwaysDisableDnmakuVideoCheck();
            } else if (webStatus == 1) {
                // 影视
                alwaysDisableDnmakuMovieCheck();
            }
            // 视频
            function alwaysDisableDnmakuVideoCheck() {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[0] == 1) {
                    if (document.getElementsByClassName('bui-danmaku-switch-on')[0]) {
                        for (let i = 0; i < GM_getValue('MRMenuAlwaysDisableDnmaku').split('').length; i++) {
                            if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[i] == 1) {
                                if (i == 1 && window.getComputedStyle(document.getElementsByClassName('bui-danmaku-switch-on')[0], null)['display'] == 'none') {
                                    document.getElementsByClassName('bui-danmaku-switch-input')[0].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '总是开启或关闭弹幕 - 已开启弹幕');
                                } else if (i == 2 && window.getComputedStyle(document.getElementsByClassName('bui-danmaku-switch-on')[0], null)['display'] == 'block') {
                                    document.getElementsByClassName('bui-danmaku-switch-input')[0].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '总是开启或关闭弹幕 - 已关闭弹幕');
                                }
                            }
                        }
                    } else if (alwaysDisableDnmakuEtime < etime || timeoutSwitch) {
                        alwaysDisableDnmakuEtime += 200;
                        setTimeout(alwaysDisableDnmakuVideoCheck, 200);
                    }
                }
            }
            // 影视
            function alwaysDisableDnmakuMovieCheck() {
                if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[0] == 1) {
                    if (document.getElementsByClassName('bui-danmaku-switch-input')[0]) {
                        for (let i = 0; i < GM_getValue('MRMenuAlwaysDisableDnmaku').split('').length; i++) {
                            if (GM_getValue('MRMenuAlwaysDisableDnmaku').split('')[i] == 1) {
                                if (i == 1 && document.getElementsByClassName('bui-danmaku-switch-input')[0].checked == false) {
                                    document.getElementsByClassName('bui-danmaku-switch-input')[0].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '总是开启或关闭弹幕 - 已开启弹幕');
                                } else if (i == 2 && document.getElementsByClassName('bui-danmaku-switch-input')[0].checked == true) {
                                    document.getElementsByClassName('bui-danmaku-switch-input')[0].click();
                                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '总是开启或关闭弹幕 - 已关闭弹幕');
                                }
                            }
                        }
                    } else if (alwaysDisableDnmakuEtime < etime || timeoutSwitch) {
                        alwaysDisableDnmakuEtime += 200;
                        setTimeout(alwaysDisableDnmakuMovieCheck, 200);
                    }
                }
            }
        }

        // 其他
        // 禁用按钮改变样式
        function disableBtn(elementSwitch) {
            elementSwitch.style.pointerEvents = 'none';
            elementSwitch.children[1].setAttribute('mr_disable', 'true');
        }
        // 激活按钮改变样式
        function enableBtn(elementSwitch) {
            elementSwitch.style.pointerEvents = '';
            elementSwitch.children[1].setAttribute('mr_disable', '');
        }

        // 判断页面加载完毕
        function loadReadyFunction() {
            loadReadyEtime = 0;
            if (webStatus == 0 || webStatus == 1) {
                // 视频/影视
                loadReadyVideoCheck();
            } else if (webStatus == 3 || webStatus == 5 || webStatus == 6 || webStatus == 9) {
                // 空间/主页/信息/动态
                loadReadyHomeCheck();
            } else if (webStatus == 2) {
                // 列表
                loadReadyListCheck();
            } else if (webStatus == 4) {
                // 搜索
                loadReadySearchCheck();
            } else if (webStatus == 7) {
                // 个人中心
                loadReadyAccountCheck();
            } else if (webStatus == 8) {
                // 稍后再看页面
                loadReadyWatchLaterCheck();
            }
            // 恢复菜单点击
            function resetMenuClick() {
                for (let i = 0; i < document.getElementsByClassName('MRMenuOptionParent').length; i++) {
                    document.getElementsByClassName('MRMenuOptionParent')[i].setAttribute('mr_is_loaded', 'true');
                }
            }
            // 视频/影视
            function loadReadyVideoCheck() {
                if (document.getElementsByClassName('nav-search-input')[0] && document.getElementsByClassName('nav-search-input')[0].title != '' && document.getElementsByClassName('bpx-player-video-info')[0]) {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    if (document.getElementById('MRMenuStatus')) {
                        document.getElementById('MRMenuStatus').textContent = '';
                    }
                    if (webStatus == 0 || webStatus == 1) {
                        // 默认模式, 播放器加载完毕后移动窗口到顶部
                        if (GM_getValue('MRPlayerMode') == 0 && GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                    }
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadyVideoCheck, 200);
                }

            }
            // 空间/主页/信息
            function loadReadyHomeCheck() {
                if (document.getElementsByClassName('nav-search-input')[0] && document.getElementsByClassName('nav-search-input')[0].title != '') {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    if (document.getElementById('MRMenuStatus')) {
                        document.getElementById('MRMenuStatus').textContent = '';
                    }
                    if (webStatus == 0 || webStatus == 1) {
                        // 默认模式, 播放器加载完毕后移动窗口到顶部
                        if (GM_getValue('MRPlayerMode') == 0 && GM_getValue('MRMenuMoveWindowToTop') == 1) {
                            moveWindowToTop();
                        }
                    }
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadyHomeCheck, 200);
                }

            }
            // 列表
            function loadReadyListCheck() {
                if (document.getElementsByClassName('bpx-player-dm-wrap')[0] && document.getElementsByClassName('bpx-player-dm-wrap')[0].textContent != '-') {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    document.getElementById('MRMenuStatus').textContent = '';
                    // 默认模式, 播放器加载完毕后移动窗口到顶部
                    if (GM_getValue('MRPlayerMode') == 0 && GM_getValue('MRMenuMoveWindowToTop') == 1) {
                        moveWindowToTop();
                    }
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadyListCheck, 200);
                }
            }
            // 搜索
            function loadReadySearchCheck() {
                if (document.getElementsByClassName('right-entry')[0]) {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    document.getElementById('MRMenuStatus').textContent = '';
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadySearchCheck, 200);
                }
            }
            // 个人中心
            function loadReadyAccountCheck() {
                if (document.getElementsByClassName('index-info')[0]) {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    document.getElementById('MRMenuStatus').textContent = '';
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadyAccountCheck, 200);
                }
            }
            // 稍后再看页面
            function loadReadyWatchLaterCheck() {
                if (document.getElementsByClassName('list-box')[0] || document.getElementsByClassName('load-state')[0]) {
                    console.log('[' + notificationScriptName + '-' + notificationNotification + '] ' + '页面加载完毕');
                    loadReady = true;
                    // 恢复菜单点击
                    resetMenuClick();
                    // 菜单文本
                    document.getElementById('MRMenuStatus').textContent = '';
                } else if (loadReadyEtime < etime || timeoutSwitch) {
                    loadReadyEtime += 200;
                    setTimeout(loadReadyWatchLaterCheck, 200);
                }
            }
        }

        // 改变GM字符串变量中的指定值
        function changeText(str, location, newText) {
            let strSplit = GM_getValue(str).split('');
            strSplit[location] = newText;
            GM_setValue(str, strSplit.join(''));
        }
    }
})();