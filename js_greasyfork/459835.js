// ==UserScript==
// @name         Mort个人网页小优化
// @namespace    https://github.com/iMortRex
// @version      0.0.23
// @description  用着不爽咱就改
// @author       Mort Rex
// @run-at       document-start
// @icon         https://cdn.nilmap.com/user_avatar/nilmap.com/mortrex/240/4084_2.png
// @match        *://*/*
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459835/Mort%E4%B8%AA%E4%BA%BA%E7%BD%91%E9%A1%B5%E5%B0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459835/Mort%E4%B8%AA%E4%BA%BA%E7%BD%91%E9%A1%B5%E5%B0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Mort小优化');

    // 变量
    var theme = 0;
    var browser = 0;
    var loopTimeout = 0;
    var loopSwitch = 0;

    // 判断深色模式
    (function isDarkMode() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 深色模式
            theme = 0;
        } else {
            // 浅色模式
            theme = 1;
        }
        setTimeout(isDarkMode, 10);
    })();

    // 判断浏览器
    (function whatBrowser() {
        if (navigator.appVersion.match('23013RK75C')) {
            // 狐猴浏览器
            browser = 0;
        } else {
            // Kiwi浏览器
            browser = 1;
        }
    })();

    // 菜单按钮
    // 沉浸式翻译-开关悬浮球
    if (GM_getValue('immersiveTranslateDisplayPopup') == null) {
        GM_setValue('immersiveTranslateDisplayPopup', 0);
    }
    (function immersiveTranslateDisplayPopupLoop() {
        if (document.getElementById('immersive-translate-popup')) {
            if (GM_getValue('immersiveTranslateDisplayPopup') == 0) {
                document.getElementById('immersive-translate-popup').style.display = 'none';
            } else {
                document.getElementById('immersive-translate-popup').style.display = 'block';
            }
        } else {
            setTimeout(immersiveTranslateDisplayPopupLoop, 20);
        }
    })();
    //
    var immersiveTranslateDisplayPopup = GM_registerMenuCommand('沉浸式翻译-开关悬浮球', function () {
        if (GM_getValue('immersiveTranslateDisplayPopup') == 0) {
            document.getElementById('immersive-translate-popup').style.display = 'block';
            GM_setValue('immersiveTranslateDisplayPopup', 1);
            console.log('沉浸式翻译-开启悬浮球');
        } else {
            document.getElementById('immersive-translate-popup').style.display = 'none';
            GM_setValue('immersiveTranslateDisplayPopup', 0);
            console.log('沉浸式翻译-关闭悬浮球');
        }
    });

    // 通用颜色
    // 浏览器颜色
    if (browser == 0) {
        GM.addStyle('@media (prefers-color-scheme: dark) {:root {--mr-bg: rgba(31, 31, 31, 1);}}');
        GM.addStyle('@media (prefers-color-scheme: light) {:root {--mr-bg: rgba(255, 255, 255, 1);}}');
    } else {
        let mainColor = 0;
        if (mainColor == 0) {
            GM.addStyle('@media (prefers-color-scheme: dark) {:root {--mr-bg: rgba(27, 27, 31, 1); --mr-title: #fff;}}');
            GM.addStyle('@media (prefers-color-scheme: light) {:root {--mr-bg: rgba(253, 251, 254, 1); --mr-title: #000;}}');
        } else {
            GM.addStyle('@media (prefers-color-scheme: dark) {:root {--mr-bg: rgba(27, 28, 30, 1); --mr-title: #fff;}}');
            GM.addStyle('@media (prefers-color-scheme: light) {:root {--mr-bg: rgba(253, 253, 255, 1); --mr-title: #000;}}');
        }
    }

    // 深色模式图片亮度
    GM.addStyle('@media (prefers-color-scheme: dark) {:root {--imgBright: 85%}}');
    GM.addStyle('@media (prefers-color-scheme: light) {:root {--imgBright: 100%}}');
    // GM.addStyle('img {filter: brightness(var(--imgBright)) !important;}');
    // GM.addStyle('a {filter: brightness(var(--imgBright)) !important;}');
    // window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color']

    /*if (theme == 0) {
        imgBrightLoop();
        function imgBrightLoop() {
            // img标签
            for (let i = 0; i < document.getElementsByTagName('img').length; i++) {
                if (!window.getComputedStyle(document.getElementsByTagName('img')[i], null)['filter'].match('brightness')) {
                    document.getElementsByTagName('img')[i].style.cssText += 'filter: ' + window.getComputedStyle(document.getElementsByTagName('img')[i], null)['filter'].replace('none', '') + ' brightness(var(--imgBright)) !important;';
                }
                /*if (window.getComputedStyle(document.getElementsByTagName('img')[i], null)['background-blend-mode'] == 'normal') {
                    document.getElementsByTagName('img')[i].style.cssText += 'background-blend-mode: multiply !important;';
                }
            }
            // a标签
            for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
                if (!document.getElementsByTagName('a')[i].firstChild || document.getElementsByTagName('a')[i].firstChild && !document.getElementsByTagName('a')[i].firstChild.nodeValue) {
                    if (!window.getComputedStyle(document.getElementsByTagName('a')[i], null)['filter'].match('brightness') && window.getComputedStyle(document.getElementsByTagName('a')[i], null)['background-image'] != 'none') {
                        document.getElementsByTagName('a')[i].style.cssText += 'filter: ' + window.getComputedStyle(document.getElementsByTagName('a')[i], null)['filter'].replace('none', '') + ' brightness(var(--imgBright)) !important;';
                    }
                    /*if (window.getComputedStyle(document.getElementsByTagName('a')[i], null)['background-blend-mode'] == 'normal') {
                        document.getElementsByTagName('a')[i].style.cssText += 'background-blend-mode: multiply !important;';
                    }
                }
            }
            setTimeout(imgBrightLoop, 200);
        }
    }*/

    // 通用函数
    // 隐藏元素
    function hideElement(e) {
        GM.addStyle(e + ' {display: none !important;}');
    }

    if (window.location.href.match('libvio')) {
        // LIBVIO
        console.log('LIBVIO');

        // 顶栏颜色
        for (let i = 0; i < document.getElementsByTagName('meta').length; i++) {
            if (document.getElementsByTagName('meta')[i].name == 'theme-color') {
                document.getElementsByTagName('meta')[i].remove();
            }
        }
        let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(32, 41, 58)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(32, 41, 58)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);

        // 自动关闭弹窗
        hideElement('.popup');
    } else if (window.location.href.match('snapdrop')) {
        // Snapdrop
        console.log('Snapdrop');

        // 顶栏颜色
        for (let i = 0; i < document.getElementsByTagName('meta').length; i++) {
            if (document.getElementsByTagName('meta')[i].name == 'theme-color') {
                document.getElementsByTagName('meta')[i].remove();
            }
        }
        let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(17, 17, 17)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(255, 255, 255)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);
    } else if (window.location.href.match('555yy')) {
        // 555电影
        console.log('555电影');

        // 去广告
        hideElement('#popup');
        hideElement('.is_pc');
        hideElement('.is_mb');
        hideElement('.is_pc_flex');
    } else if (window.location.href.match('mitang')) {
        // 蜜糖
        console.log('蜜糖');

        // 自动关闭弹窗
        hideElement('#popup');
    } else if (window.location.href.match('voflix')) {
        // Voflix
        console.log('Voflix');

        // 自动关闭弹窗
        hideElement('#popup');
        // 去广告
        let loopTimeout = 0;
        voflixLoop();
        function voflixLoop() {
            if (document.getElementsByClassName('homepage')[0]) {
                for (let i = 0; i < document.getElementsByClassName('homepage')[0].children.length; i++) {
                    if (document.getElementsByClassName('homepage')[0].children[i].getAttribute('id') != null) {
                        document.getElementsByClassName('homepage')[0].children[i].remove();
                    }
                }
            }
            if (loopTimeout < 2000) {
                loopTimeout += 200;
                setTimeout(voflixLoop, 200);
            }
        }
    } else if (window.location.href.match('dandanzan')) {
        // 蛋蛋赞
        console.log('蛋蛋赞');

        // 去广告
        let loopTimeout = 0;
        let ads = 'DIV, HEADER, FOOTER, SCRIPT';
        dandanzanLoop();
        function dandanzanLoop() {
            if (document.getElementsByTagName('body')[0]) {
                for (let i = 0; i < document.getElementsByTagName('body')[0].children.length; i++) {
                    if (!ads.match(document.getElementsByTagName('body')[0].children[i].tagName) && !document.getElementsByTagName('body')[0].children[i].className.match('darkreader') || document.getElementsByTagName('body')[0].children[i].getAttribute('id') != null) {
                        document.getElementsByTagName('body')[0].children[i].style.cssText += 'display: none !important';
                    }
                }
            }
            if (loopTimeout < 2000 || true) {
                loopTimeout += 200;
                setTimeout(dandanzanLoop, 200);
            }
        }
    } else if (window.location.href.match('speedtest.cn')) {
        // 测速网
        console.log('测速网');

        // 自动关闭弹窗&切换单位
        (function speedTestLoop() {
            if (document.getElementsByClassName('d_btn')[0]) {
                document.getElementsByClassName('d_btn')[0].click();
            }
            if (document.getElementsByClassName('tabs')[0] && document.getElementsByClassName('tabs')[0].children[0].textContent.match('Mbps')) {
                document.getElementsByClassName('tabs')[0].children[0].click();
            }
            if (document.getElementsByClassName('tabs')[1] && document.getElementsByClassName('tabs')[1].children[3].textContent.match('1000')) {
                document.getElementsByClassName('tabs')[1].children[3].click();
            }
            if (loopTimeout < 5000) {
                loopTimeout += 20;
                setTimeout(speedTestLoop, 20);
            }
        })();
    } else if (window.location.href.match('gelbooru.com')) {
        // Gelbooru
        console.log('Gelbooru');

        // 去除工具栏
        hideElement('.mobileActions');
        // 去除搜索搜藏按钮
        hideElement('.searchArea div form a:nth-child(1)');
        //// 修正搜索框长度
        GM.addStyle('#tags-search {width: calc(100% - 134px) !important; margin-left: 5px !important;}');
        // 去除广告
        (function gelbooruRemoveAds() {
            if (document.getElementsByTagName('video')[0]) {
                if (document.getElementsByTagName('video')[0].children[0].src.match('extras/aiAd')) {
                    document.getElementsByTagName('video')[0].parentElement.style.cssText += 'display: none';
                }
            } else if (loopTimeout < 3000) {
                loopTimeout += 20;
                setTimeout(gelbooruRemoveAds, 20);
            }
        })();
    } else if (window.location.href.match('gamer520')) {
        // Switch520
        console.log('Switch520');

        // 自动关闭弹窗
        (function switch520Loop() {
            if (document.getElementsByClassName('swal2-close')[0]) {
                document.getElementsByClassName('swal2-close')[0].click();
            } else {
                setTimeout(switch520Loop, 200);
            }
        })();
    } else if (window.location.href.match('https://www.reddit.com')) {
        // Reddit
        console.log('Reddit');

        // 跳转到Libreddit
        let libreddit = 'libreddit.kavin.rocks';
        // window.location.replace('https://' + libreddit + window.location.pathname + window.location.search);
    } else if (window.location.href.match('nba.baidu') || window.location.href.match('tieba.baidu')) {
        // 百度贴吧手机版
        console.log('百度贴吧手机版');

        // 跳转到贴吧小程序
        /* let tieba = 'byokpg.smartapps.baidu.com/pages/pb/pb?tid=';
        if (window.location.href.match('index')) {
            tieba = 'byokpg.smartapps.baidu.com/';
        } */

        // 去除App弹窗广告
        /*(function tiebaLoop() {
            if (document.getElementsByClassName('tb-share__btn--')[0]) {
                document.getElementsByClassName('tb-share__btn--')[0].click();
            } else if (loopTimeout < 5000) {
                loopTimeout += 20;
                setTimeout(tiebaLoop, 20);
            }
        })();
        window.location.replace('https://' + tieba + window.location.pathname.replace(/[^0-9]/ig, '')); */
    } else if (window.location.href.match('smartapps.baidu')) {
        // 百度贴吧小程序
        console.log('百度贴吧小程序');

        // 顶栏颜色
        /* let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(40, 40, 40, 1)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(255, 255, 255, 1)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);
        // 隐藏回复栏&隐藏广告
        hideElement('swan-silent-wake-up');
        let url = window.location.href;
        tiebaXCXInputHrefCheck();
        function tiebaXCXInputHrefCheck() {
            if (url != window.location.href) {
                url = window.location.href;
                tiebaXCXInputLoop();
            }
            setTimeout(tiebaXCXInputHrefCheck, 20);
        }
        let tiebaXCXInputLoopTimeout = 0;
        tiebaXCXInputLoop();
        function tiebaXCXInputLoop() {
            // 回复栏
            if (document.getElementsByClassName('swan-web-iframe')[0] && document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('swan-input-main')[0]) {
                document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('swan-input-main')[0].parentNode.parentNode.parentNode.parentNode.parentNode.style.cssText += 'display: none;';
            }
            // 楼中楼回复栏
            if (document.getElementsByClassName('swan-web-iframe')[0] && document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('lzl-reply-wrap')[0]) {
                document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('lzl-reply-wrap')[0].style.cssText += 'display: none;';
            }
            // 看高清大图APP广告
            if (document.getElementsByClassName('swan-web-iframe')[0] && document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('img-wakeup')[0]) {
                document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('img-wakeup')[0].style.cssText += 'display: none;';
            }
            // 楼层广告
            for (let i = 0; i < 100; i++) {
                if (document.getElementsByClassName('swan-web-iframe')[0] && document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('sw-' + i + '__bdad-wrap')[0] && document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('sw-' + i + '__bdad-wrap')[0].parentNode) {
                    document.getElementsByClassName('swan-web-iframe')[0].contentWindow.document.getElementsByClassName('sw-' + i + '__bdad-wrap')[0].parentNode.remove();
                }
            }
            // 循环
            if (tiebaXCXInputLoopTimeout < 3000) {
                tiebaXCXInputLoopTimeout += 200;
                setTimeout(tiebaXCXInputLoop, 200);
            } else {
                tiebaXCXInputLoopTimeout = 0;
            }
        } */
    } else if (window.location.href.match('taptap')) {
        // TapTap
        console.log('TapTap');

        // 去除广告
        let homePageAds = '';
        let discoverAds = '';
        taptapLoop();
        function taptapLoop() {
            if (document.getElementsByClassName('home-app-card__tag')[0]) {
                homePageAds = document.getElementsByClassName('home-app-card__tag');
            }
            if (document.getElementsByClassName('category-title__ad')[0]) {
                discoverAds = document.getElementsByClassName('category-title__ad');
            }
            if (homePageAds[0]) {
                homePageAds[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
            if (discoverAds[0]) {
                discoverAds[0].parentNode.parentNode.parentNode.remove();
            }
            // 去除添加到桌面弹窗
            if (document.getElementsByClassName('close')[0]) {
                document.getElementsByClassName('close')[0].click();
            }
            setTimeout(taptapLoop, 200);
        }
        GM.addStyle('.van-sticky--fixed {top: 0px !important;}');
        // APP页转回标准网页端
        if (window.location.href.match('m.taptap.cn/app')) {
            let appNumber = window.location.href.substring(window.location.href.lastIndexOf('-') + 1, window.location.href.length);
            window.location.href = 'https://www.taptap.cn/app/' + appNumber + '/review';
        }
    } else if (window.location.href.match('speedtest.net')) {
        // SpeedTest
        console.log('SpeedTest');

        // 顶栏颜色
        let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(20, 21, 38, 1)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(20, 21, 38, 1)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);
        // 网络地址上移
        GM.addStyle('.result-area-connection>.pure-g {margin: -170px 0px 0px 0px !important;}');
    } else if (window.location.href.match('notion.so')) {
        // Notion
        console.log('Notion');

        // 顶栏颜色
        let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(25, 25, 25, 1)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(255, 255, 255, 1)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);
    } else if (window.location.href.match('bing.com')) {
        // 必应
        console.log('必应');

        // 超级搜索
        // 谷歌
        // let searchText = window.location.href.substring(window.location.href.lastIndexOf('q=') + 2, window.location.href.length);
        let searchText = 0;
        (function bingLoop() {
            if (document.getElementsByClassName('b_searchbox')[0]) {
                searchText = document.getElementsByClassName('b_searchbox')[0].value;
                if (searchText.substring(searchText.length - 2) == ' g') {
                    let searchNewText = searchText.substring(0, searchText.length - 2)
                    window.location.href = 'https://www.google.com/search?q=' + searchNewText;
                }
            } else {
                setTimeout(bingLoop, 20);
            }
        })();
        // 改变背景颜色
        GM.addStyle('body {--htmlbk: var(--mr-bg) !important; --darkreader-bg--htmlbk: var(--mr-bg) !important;}');
        // 自动切换深色模式
        // GM.addStyle('#HBMenu {opacity: 0 !important;}');
        /* (function bingLoop() {
            if (document.getElementById('mHamburger')) {
                if (theme == 0 && !document.body.className.match('b_drk')) {
                    document.getElementById('mHamburger').click();
                    document.getElementById('hbradiobtn').children[1].children[0].children[1].children[1].click();
                    // document.getElementById('HBFlyoutClose').click();
                } else if (theme == 1 && document.body.className.match('b_drk')) {
                    document.getElementById('mHamburger').click();
                    document.getElementById('hbradiobtn').children[0].children[0].children[1].children[1].click();
                    // document.getElementById('HBFlyoutClose').click();
                }
            }
            setTimeout(bingLoop, 20);
        })(); */
    } else if (window.location.href.match('sogou.com')) {
        // 搜狗
        console.log('搜狗');

        // 关键字颜色
        GM.addStyle("a em, em {color: #F03232 !important;}");
        // 修复DarkReader页面Bug
        document.documentElement.style.cssText += 'background-color: transparent !important;';
    } else if (window.location.href.match('google.cn')) {
        // 谷歌
        console.log('谷歌');

        // cn转com
        var newHost = window.location.host.replace(/\.cn$/, ".com");
        var newURL = window.location.protocol + "//" + newHost + window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(newURL);
    } else if (window.location.href.match('wolai')) {
        // 我来
        console.log('我来');

        // 修复Wolai我来iOS端Safari顶部工具栏消失
        var wolaiIsFocus = false;
        var wolaiIsContenteditable = false;
        // iOS端顶栏颜色
        if (document.getElementsByTagName('meta')) {
            for (let i = 0; i < document.getElementsByTagName('meta').length; i++) {
                if (document.getElementsByTagName('meta')[i].name == 'theme-color') {
                    document.getElementsByTagName('meta')[i].content = getComputedStyle(document.getElementsByTagName('html')[0]).getPropertyValue('--wolai-bg');
                }
            }
        }

        // 如果不是标准文本输入则通过监听页面是否失焦来判断iOS软键盘是否弹出
        window.addEventListener('focusout', () => {
            if (!document.getElementsByClassName('mobileContent')[0]) {
                // 页面失焦
                wolaiIsFocus = false;
            }
        });
        window.addEventListener('focusin', () => {
            if (!document.getElementsByClassName('mobileContent')[0]) {
                // 页面处于焦点
                wolaiIsFocus = true;
            }
        });

        wolaiLoop();
        function wolaiLoop() {
            if (document.getElementById('tour-editor-wrapper')) {
                // 改变页面为跟随浏览器
                document.getElementsByTagName('html')[0].style.cssText = 'position: fixed ! important;height: 100% ! important;width: 100% ! important;';
                document.getElementById('tour-editor-wrapper').style.cssText = 'height: 100% ! important;';
                return;
            }

            // 循环判断
            setTimeout(wolaiLoop, 20);
        }

        wolaiCloseBtnCheckLoop();
        function wolaiCloseBtnCheckLoop() {
            // 失焦判断
            if (document.getElementsByClassName('mobileContent')[0]) {
                if (document.getElementsByClassName('mobileContent')[0].getAttribute('contenteditable') == 'true') {
                    wolaiIsContenteditable = true;
                } else {
                    wolaiIsContenteditable = false;
                }
                if (!wolaiIsContenteditable && !document.getElementsByClassName('MuiPaper-root')[0]) {
                    // 失焦则关闭按钮
                    wolaiCloseMenu();
                }
            } else if (!wolaiIsFocus) {
                // 失焦则关闭按钮
                wolaiCloseMenu();
            }
            // 循环判断
            setTimeout(wolaiCloseBtnCheckLoop, 100);
        }

        function wolaiCloseMenu() {
            // 判断是否展开二级菜单
            if (document.getElementsByClassName('menu-for-mobile')[0]) {
                document.getElementsByClassName('menu-for-mobile')[0].children[0].children[1].click();
            }
        }
    } else if (window.location.href.match('inftab')) {
        // Inftab
        console.log('Inftab');

        // 图标布局
        GM.addStyle('body {--main-top-space: 0px !important; --icon-height: 116px !important; --main-x-space: 28px !important; height: 100% !important; max-height: auto !important; min-height: auto !important;');
        GM.addStyle('.van-swipe__indicators {display: none !important;');
        GM.addStyle('.home-icon-item {margin: 0px var(--icon-margin) 30px var(--icon-margin) !important;');
        (function inftabLayoutLoop() {
            // 图标布局
            if (document.getElementsByClassName('van-swipe-item')[1] && document.getElementsByClassName('van-swipe-item')[1].children[0].children[0].children[0]) {
                for (let i = 0; i < document.getElementsByClassName('van-swipe-item').length; i++) {
                    document.getElementsByClassName('van-swipe-item')[i].children[0].style.cssText += 'height: auto !important; padding: 25px calc(var(--main-x-space) - var(--icon-margin)) 0';
                }
                document.getElementsByClassName('home-main-content')[0].children[1].style.cssText += 'display: none !important;';
            } else {
                setTimeout(inftabLayoutLoop, 10);
            }
        })();

        // 背景和标签名称自动深色模式和图标外框
        // 图标阴影样式
        GM.addStyle('@media (prefers-color-scheme: dark) {.icon-img {box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2) !important;}}');
        GM.addStyle('@media (prefers-color-scheme: light) {.icon-img {box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2) !important;}}');
        // 图标标题颜色
        GM.addStyle('.icon-name {color: var(--mr-title) !important;}');
        // 背景色
        GM.addStyle('.home-main-content {background-color: var(--mr-bg) !important;}');
        GM.addStyle('body {background-color: var(--mr-bg) !important;}');
        // 文件夹打开后背景色
        GM.addStyle('.i-mask {background-color: var(--mr-bg) !important;}');
        // 文件夹更多图标颜色
        GM.addStyle('@media (prefers-color-scheme: dark) {.folder-more-icon {background-color: rgba(200, 200, 200, 1) !important;}}');
        GM.addStyle('@media (prefers-color-scheme: light) {.folder-more-icon {background-color: rgba(200, 200, 200, 1) !important;}}');
        // 颜色修复，针对DarkReader
        if (true) {
            (function inftabColorFixLoop() {
                for (let i = 0; document.getElementsByClassName('icon-img').length > i; i++) {
                    if (document.getElementsByClassName('icon-img')[i]) {
                        document.getElementsByClassName('icon-img')[i].style.cssText += 'box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2) !important;';
                        document.getElementsByClassName('icon-name')[i].style.cssText += 'color: var(--mr-title) !important;';
                    }
                }
                if (document.getElementsByClassName('home-main-content')[0]) {
                    document.getElementsByClassName('home-main-content')[0].style.cssText += 'background: var(--mr-bg) !important;';
                    document.body.style.cssText += 'background: var(--mr-bg) !important;';
                }
                if (loopTimeout < 2000) {
                    loopTimeout += 20;
                    setTimeout(inftabColorFixLoop, 20);
                }
            })();
        }
    } else if (window.location.href.match('spicychat.ai')) {
        // SpicyChat
        console.log('SpicyChat');

        // 顶栏颜色
        for (let i = 0; i < document.getElementsByTagName('meta').length; i++) {
            if (document.getElementsByTagName('meta')[i].name == 'theme-color') {
                document.getElementsByTagName('meta')[i].remove();
            }
        }
        let metaDark = document.createElement('meta');
        metaDark.name = 'theme-color';
        metaDark.content = 'rgba(0, 0, 0)';
        metaDark.media = '(prefers-color-scheme: dark)';
        let metaLight = document.createElement('meta');
        metaLight.name = 'theme-color';
        metaLight.content = 'rgba(0, 0, 0)';
        metaLight.media = '(prefers-color-scheme: light)';
        document.getElementsByTagName('head')[0].appendChild(metaDark);
        document.getElementsByTagName('head')[0].appendChild(metaLight);
        // Chat输入框不跟随
        /* (function spicyChatTypeLoop() {
            if (window.location.href.match('spicychat.ai/chat')) {
                if (document.getElementById('root') && document.getElementById('root').children[1] && document.getElementById('root').children[1].children[0] && document.getElementById('root').children[1].children[0].children[1] && document.getElementById('root').children[1].children[0].children[1].children[0] && document.getElementById('root').children[1].children[0].children[1].children[0].children[1] && document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children[document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children.length - 1]) {
                    if (document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children[document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children.length - 1].style.position != 'unset') {
                        document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children[document.getElementById('root').children[1].children[0].children[1].children[0].children[1].children.length - 1].style.cssText += 'position: unset; margin-bottom: -40px;';
                        console.log('SpicyChat输入框不跟随');
                        
                    }
                }
            }
            setTimeout(spicyChatTypeLoop, 200);
        })(); */
        // Chat隐藏输入框上方排队面板
        /* (function spicyChatHideLineUpLoop() {
            if (window.location.href.match('spicychat.ai/chat')) {
                if (document.getElementById('root') && document.getElementById('root').children[1] && document.getElementById('root').children[1].children[0] && document.getElementById('root').children[1].children[0].children[1] && document.getElementById('root').children[1].children[0].children[1].children[1] && document.getElementById('root').children[1].children[0].children[1].children[1].style.display != 'none') {
                    document.getElementById('root').children[1].children[0].children[1].children[1].style.cssText += 'display: none;';
                    console.log('SpicyChat隐藏输入框上方排队面板');
                }
            }
            setTimeout(spicyChatHideLineUpLoop, 200);
        })(); */
    } else if (window.location.href.match('cosplaytele')) {
        // Cosplaytele
        console.log('Cosplaytele');

        // 改布局
        GM.addStyle('.row.align-center {max-width: 100% !important;}'); // 页面占满
        GM.addStyle('#gallery-1 {display: flex !important; flex-flow: column wrap !important; margin-left: 0 !important; margin-right: 0 !important; position: relative !important; align-content: space-between !important;}'); // 详情页父元素样式
        GM.addStyle('#gallery-1::before, #gallery-1::after {content: ""; flex-basis: 100%; width: 0; order: 2;}'); // 详情页父元素样式
        GM.addStyle('.gallery-item {position: relative !important; width: 50% !important; flex-basis: auto !important; padding: 0 4px 8px !important;}'); // 详情页图片样式
        // GM.addStyle('.gallery-item:nth-child(2n+1) {order: 1;}'); // 详情页图片样式
        // GM.addStyle('.gallery-item:nth-child(2n) {order: 2;}'); // 详情页图片样式;
        var picHeight = new Array();
        for (let i = 0; i < 2; i++) {
            picHeight[i] = 0;
        }
        // 判断变量最小值最大值
        // 最小值
        Array.prototype.min = function () {
            let min = this[0];
            let len = this.length;
            for (let i = 1; i < len; i++) {
                if (this[i] < min) min = this[i]
            }
            return min
        };
        // 最大值
        Array.prototype.max = function () {
            let max = this[0];
            let len = this.length;
            for (let i = 1; i < len; i++) {
                if (this[i] > max) max = this[i]
            }
            return max
        };
        function loop() {
            if (document.getElementsByClassName('gallery-item')[0]) {
                // 初始化变量
                for (let i = 0; i < 2; i++) {
                    picHeight[i] = 0;
                }
                //
                for (let i = 0; i < document.getElementsByClassName('gallery-item').length; i++) {
                    let minNum = picHeight.min();
                    let minLocation = picHeight.findIndex(picHeight => picHeight == minNum);
                    document.getElementsByClassName('gallery-item')[i].setAttribute('mr_group', (minLocation + 1));
                    document.getElementsByClassName('gallery-item')[i].style.cssText += 'order: ' + (minLocation + 1) + ';';
                    picHeight[minLocation] += document.getElementsByClassName('gallery-item')[i].offsetHeight;
                }
                let maxNum = picHeight.max();
                document.getElementById('gallery-1').style.cssText += 'height: ' + (maxNum + 100) + 'px !important;';
                console.log(picHeight);
            }
        }
        window.addEventListener('DOMContentLoaded', loop);
        window.addEventListener('resize', loop);
    }
})();