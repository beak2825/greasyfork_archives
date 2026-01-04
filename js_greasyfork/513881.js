// ==UserScript==
// @name         B站（bilibili）夜晚模式
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  点击插件配置打开配置页面开启/关闭夜晚模式
// @author       Ginyang
// @match        https://*.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/archive/c8fd97a40bf79f03e7b76cbc87236f612caef7b2.png
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513881/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E5%A4%9C%E6%99%9A%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/513881/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E5%A4%9C%E6%99%9A%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


/********************************各类广告*******************************/
if (window.top === window) {

    (function () {
        'use strict';
        window.onload = function () {
            // console.clear();
            console.log('【darkbili】darkbili loaded. ---By Ginyang.');

            // 全局变量-夜晚模式
            const db_dark_mode = `
            :root{--bg1:#111 !important;--bg2:#333 !important;--bg3:#555 !important;--bg1_float:#181818 !important;--bg2_float:#333 !important;--text_white:#ddd !important;--text1:#eee !important;--text2:#ccc !important;--text3:#aaa !important;--text4:#888 !important;--line_light:#333 !important;--line_regular:#333 !important;--line_bold:#444 !important;--Ga1:#333 !important;--graph_weak:#333 !important;--graph_white:#333 !important;--graph_bg_thin:#333 !important;--graph_bg_regular:#333 !important;--graph_bg_thick:#666 !important;--shadow:#aaa !important;--graph_bg_regular_float:#555 !important;--bili_theme:#00a1d6 !important}.bili-header .slide-down .center-search-container .center-search__bar #nav-searchform{background-color:var(--bg2) !important}.bili-header .slide-down .center-search-container .center-search__bar #nav-searchform:hover,.bili-header .center-search-container .center-search__bar #nav-searchform:hover{background-color:var(--bg3) !important}.header-channel{box-shadow:0 2px 4px rgb(255 255 255 / 10%) !important}input.b-head-search_input,.g-search input,#page-fav .fav-main .search-input input{background-color:inherit !important;color:inherit !important}.history-wrap .b-head .b-head-t{color:inherit}.history-list,.history-list .history-record{padding:10px 0}.history-list .r-info{background-color:var(--bg2);border-radius:5px}.history-list .cover-contain{margin:0px 20px 0px 10px}.history-list .r-info .r-txt{border:none}.history-list .r-info .history-delete{right:10px}.history-list .r-info .history-mark{right:44px}.history-list .r-info .title{color:var(--text1)}.history-wrap .go-top-m .go-top{background-color:var(--bg2);border-color:var(--bg2)}.history-wrap .go-top-m .go-top:hover{background-color:#00a1d6;border-color:#00a1d6}.watch-later-list .list-box .av-item .av-about .t,.watch-later-list .list-box .av-item .key{color:inherit}.watch-later-list header .s-btn{background:inherit}.watch-later-list .list-box .av-item .key{top:50px !important;left:-20px !important}.watch-later-list .list-box .av-item{background-color:var(--bg2);padding:10px 10px 10px 50px !important;border-radius:5px}.watch-later-list .list-box .av-item .av-about{border:none !important}body{color:var(--text1) !important}html{background-color:var(--bg1) !important}.n .n-inner{background-color:var(--bg1_float) !important;border:1px solid var(--bg2) !important;box-shadow:none !important;border-radius:0 0 4px 4px !important}.col-full{box-shadow:none !important}.n .n-data .n-data-v{color:var(--text4)}#page-index .col-1,#page-index .col-2 .section,.col-full{background-color:var(--bg1_float) !important;border:1px solid var(--bg2) !important}.section-title,.large-item .title,.contribution-sidenav .contribution-item{color:var(--text1)}.user-info .user-info-title .info-title{color:var(--text4)}#page-follows .follow-sidenav .nav-title .text,#page-follows .follow-sidenav .follow-list-container .follow-item,#page-index .col-2 .section .user-auth.no-auth .no-auth-title .goto-auth,#page-follows .follow-tabs,#page-follows .follow-search-result,#page-follows .follow-main .follow-action-top .back-to-info,.user-info .user-info-title .info-title{color:var(--text1) !important}.search-component-input input{color:inherit !important;background-color:inherit !important}#page-index #i-ann-content textarea{background-color:var(--bg3) !important;color:var(--text1) !important}#page-follows .follow-main .follow-action-bottom li,#page-index .col-2 .section .user-auth .auth-description,#page-index .channel.guest .channel-item .channel-title .channel-name,#page-video .page-head__left .video-title,.i-live .i-live-text{color:inherit !important}#page-follows .follow-main .follow-action-bottom .follow-action-fixtop,.list-create{background-color:inherit !important}#id-card{background-color:var(--bg1_float)}#page-follows .follow-sidenav .follow-list-container .follow-item:not(.cur):hover,#page-video #submit-video-type-filter,.contribution-sidenav .contribution-item:not(.cur):hover{background-color:var(--bg2) !important}#page-follows .follow-main{border-color:var(--bg2) !important}.be-dropdown-item:hover,#page-follows .follow-main .follow-action-top .back-to-info:hover,.i-live .i-live-text:hover{color:var(--bili_theme) !important}.list-item,.section,.user-info .user-info-title,#page-index .col-2 .section-title,#page-follows .follow-main .follow-header.follow-header-info,#page-follows .follow-sidenav .nav-container.follow-container,#page-follows .follow-sidenav{border-bottom-color:var(--bg2) !important}#page-fav .fav-main .small-item{border:none !important}#page-fav .fav-main .filter-item,#page-fav .fav-sidenav,#page-fav .fav-sidenav .nav-title .text,.favInfo-box .favInfo-details .fav-name,.be-dropdown-item,#page-fav .fav-main .filter-item .filter-type .be-dropdown-item span,#page-fav .fav-main .fav-action-bottom li{color:inherit !important}#page-fav .fav-main .fav-action-bottom li:hover{color:var(--bili_theme) !important}#page-fav .fav-main .fav-action-top .back-to-info{color:inherit}.be-dropdown-menu{background-color:var(--bg1_float);border-color:var(--bg2) !important}.be-dropdown-item:hover,#page-fav .fav-sidenav .fav-item:not(.cur):hover,#page-fav .fav-main .fav-video-list.is-batch .small-item.selected,#page-fav .fav-main .fav-video-list.is-batch .small-item:hover{background-color:var(--bg2) !important}#page-fav .fav-sidenav .icon-cursor{background-color:var(--bg2) !important}.be-dropdown-item.be-dropdown-item-delimiter,#page-fav .fav-sidenav,#page-fav .fav-sidenav .nav-container,#page-fav .fav-sidenav .playlist-group,#page-fav .fav-sidenav .watch-later,#page-fav .fav-main,#page-fav .fav-main .favList-info{border-color:var(--bg2) !important}#page-fav .fav-main .fav-action-bottom .fav-action-fixtop,#page-fav .fav-main .filter-item .filter-type .be-dropdown-item:hover{background-color:inherit !important}.opus-list .opus-item-title{color:inherit !important}#page-setting .setting-privacy-item .setting-privacy-name{color:inherit !important}.breadcrumb .item.cur,#page-collection-detail .channel-detail .content .breadcrumb .item,#page-series-index .channel-item .channel-name,#page-series-detail .channel-detail .content .breadcrumb .item{color:inherit !important}.series-item .split-line{background-color:var(--bg2) !important}.channel-option.no-channel{background-color:inherit !important}.bili-dyn-item,#page-dynamic .col-2 .section{background-color:var(--bg1_float) !important;border-color:var(--bg2) !important}#page-article .row .breadcrumb .item{color:inherit !important}.pgc-space-follow-item .pgc-item-info .pgc-item-title,.pgc-space-follow-item .pgc-item-info .pgc-item-desc{color:inherit}.search-page{background-color:var(--bg1_float) !important}.search-nav{color:inherit !important}.search-nav-item:not(.search-nav-actived):hover{background-color:var(--bg2) !important}#chat-control-panel-vm .chat-input{color:inherit !important}
            `;
            let db_dark_stylesheet = document.createElement("style");
            db_dark_stylesheet.innerHTML = db_dark_mode;

            function dbStyleInit() {
                let db_style_css = `
                /* 启用AdGuard之后bilibili顶部会给出提示，请求加入白名单，给爷爬~ */
                .adblock-tips {
                    display: none !important;
                }
                #tipWraplr{
                    display: none !important;
                }
                /* 去除首页轮播图 */
                .recommended-swipe.grid-anchor {
                    display: none !important;
                }
                /* 遮罩层、dialog CSS样式 */
                #db_overlay {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    z-index: 9999;
                    justify-content: center;
                    align-items: center;
                    user-select: none;

                    text-align: center;
                    font-family: 'fontello';
                }
                /*关闭图标*/
                #db_btn_close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    margin: 3px;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    box-sizing: border-box;
                }
                #db_btn_close:hover::before,
                #db_btn_close:hover::after {
                    background: red;
                }
                #db_btn_close:before {
                    position: absolute;
                    content: '';
                    width: 1px;
                    height: 34px;
                    background: #eee;
                    transform: rotate(45deg);
                    top: -3px;
                    left: 12px;
                }
                #db_btn_close:after {
                    content: '';
                    position: absolute;
                    width: 1px;
                    height: 34px;
                    background: #eee;
                    transform: rotate(-45deg);
                    top: -3px;
                    left: 12px;
                }
                .db_btn_o.active {
                    color: #00d0b0;
                    text-shadow: 0px 0px 7px #37ffb1;
                    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #e3e3e3), color-stop(100%, #f4f4f4));
                    background-image: -moz-gradient(linear, left top, left bottom, color-stop(0%, #e3e3e3), color-stop(100%, #f4f4f4));
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15), 10px 10px 15px rgba(255, 255, 255, 0.4), -10px 10px 15px rgba(255, 255, 255, 0.4), -10px -10px 15px #e3e3e3, 10px -10px 15px #e3e3e3, inset 0px -3px 0px rgba(255, 255, 255, 0.4), inset 0px 3px 3px rgba(0, 0, 0, 0.04);
                }
                /*开关按钮*/
                .db_btn_o {
                    display: inline-block;
                    vertical-align: middle;
                    -webkit-transform: scale(1.25);
                    margin: 110px 30px;
                    width: 60px;
                    height: 60px;
                    line-height: 2.6;
                    font-size: 24px;
                    color: #e1dada;
                    text-shadow: 0px -1px 1px rgba(0, 0, 0, 0.2);
                    border-radius: 100px;
                    text-decoration: none;
                    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f4f4f4), color-stop(100%, #e3e3e3));
                    background-image: -moz-gradient(linear, left top, left bottom, color-stop(0%, #f4f4f4), color-stop(100%, #e3e3e3));
                    /* box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25), 10px 10px 15px #e3e3e3, -10px 10px 15px #e3e3e3, -15px -15px 15px rgba(255, 255, 255, 0.4), 15px -15px 15px rgba(255, 255, 255, 0.4), inset 0px 2px 0px white; */
                    -webkit-transition: box-shadow 0.3s ease-in-out, background-image 0.3s ease-in-out, text-shadow 0.5s linear, color 0.5s linear;
                    -moz-transition: box-shadow 0.3s ease-in-out, background-image 0.3s ease-in-out, text-shadow 0.5s linear, color 0.5s linear;
                    cursor: pointer;
                }
                @keyframes shadow-animation {
                    0% {
                        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15),
                            2px 2px 3px rgba(255, 255, 255, 0.4),
                            -2px 2px 3px rgba(255, 255, 255, 0.4),
                            -2px -2px 3px #e3e3e3,
                            2px -2px 3px #e3e3e3,
                            inset 0px -3px 0px rgba(255, 255, 255, 0.4),
                            inset 0px 3px 3px rgba(0, 0, 0, 0.04);
                    }

                    50% {
                        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15),
                            10px 10px 15px rgba(255, 255, 255, 0.4),
                            -10px 10px 15px rgba(255, 255, 255, 0.4),
                            -10px -10px 15px #e3e3e3,
                            10px -10px 15px #e3e3e3,
                            inset 0px -3px 0px rgba(255, 255, 255, 0.4),
                            inset 0px 3px 3px rgba(0, 0, 0, 0.04);
                    }

                    100% {
                        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15),
                            2px 2px 3px rgba(255, 255, 255, 0.4),
                            -2px 2px 3px rgba(255, 255, 255, 0.4),
                            -2px -2px 3px #e3e3e3,
                            2px -2px 3px #e3e3e3,
                            inset 0px -3px 0px rgba(255, 255, 255, 0.4),
                            inset 0px 3px 3px rgba(0, 0, 0, 0.04);
                    }
                }
                .db_btn_o.active {
                    animation: shadow-animation 3s ease-in-out;
                    animation-iteration-count: infinite;
                }
                `;
                let db_style_sheet = document.createElement("style");
                db_style_sheet.innerHTML = db_style_css;
                document.body.appendChild(db_style_sheet);
            }

            // 配置对话框
            let isconfiged = false;
            function configuration() {
                if (isconfiged) {
                    return; // 如果按钮已被点击，则忽略后续点击事件
                }
                isconfiged = true;
                // 创建遮罩层及内部
                const db_overlay_html = `
                    <div id="db_btn_close"></div>
                    <a id="db_btn_darked" class="db_btn_o">O</a>
                    <a id="db_btn_clearads" class="db_btn_o" style="display:none;">O</a>
                `;
                let db_overlay = document.createElement("div");
                db_overlay.id = "db_overlay";
                db_overlay.innerHTML = db_overlay_html;
                document.body.appendChild(db_overlay);


                /*********************获取控件********************/
                let db_btn_darked = document.getElementById("db_btn_darked");
                let db_btn_closeads = document.getElementById("db_btn_clearads");
                let db_btn_close = document.getElementById("db_btn_close");

                /*******************添加点击事件******************/
                // close
                db_btn_close.addEventListener("click", () => {
                    db_overlay.remove();
                    isconfiged = false;
                });

                // change GM_value
                db_btn_darked.addEventListener("click", () => {
                    db_btn_darked.classList.toggle("active");
                    if (db_btn_darked.classList.contains("active")) {
                        document.head.appendChild(db_dark_stylesheet);
                        GM_setValue("dbis_darked", true);
                    } else {
                        db_dark_stylesheet.remove();
                        GM_setValue("dbis_darked", false);
                    }
                });

                // 配置页面加载后判断是否是已开启
                if (GM_getValue("dbis_darked")) {
                    db_btn_darked.classList.add("active");
                }
            }; // 配置configuration

            function judgeIfDarked() {
                if (GM_getValue("dbis_darked")) {
                    document.head.appendChild(db_dark_stylesheet);
                }
            }

            // 键盘事件
            function keydownEventHandle() {

                // b站主页触发
                document.addEventListener('keydown', function (event) {
                    let btn_flush = document.querySelector("button.primary-btn.roll-btn");
                    let array_video = document.querySelectorAll(".bili-video-card__wrap.__scale-wrap");
                    console.log(array_video);
                    var target = event.target || event.srcElement;
                    if (target.tagName.toLowerCase() !== 'input') {
                        if (event.key === ' ') {
                            // 空格刷新主页推荐
                            event.preventDefault();
                            btn_flush.click();
                        }
                        for (let i = 1; i < 10; i++) {
                            // 1~9快捷键对应第1到6的推荐视频（Adguard只是让人看不见，但广告实际还在原位置，快捷键还是可能会选到对应位置的广告）
                            if (event.key === i.toString()) {
                                event.preventDefault();
                                array_video[i].querySelector('a').click();
                            }
                        }
                        if (event.key === '0') {
                            event.preventDefault();
                            array_video[10].querySelector('a').click();
                        }
                    }
                });

            }

            function db_main() {
                // 1、判断夜晚是否开启，来加载夜晚css
                judgeIfDarked();

                // 2、加载配置页面的css
                dbStyleInit();

                // 3、加载配置
                GM_registerMenuCommand("开关", configuration);

                // 加载键盘事件
                if (window.location.href == 'https://www.bilibili.com/') {
                    keydownEventHandle();
                }
            }
            db_main();


        } // onload -- function
    })(); // 主function -- function
}; // 最外层判断当前页面是否是主页面