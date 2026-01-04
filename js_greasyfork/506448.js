// ==UserScript==
// @name         虎牙页面优化
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  虎牙精简版，移除首页直播，移除直播礼物特效等不必要元素，还你纯粹的直播体验
// @author       You
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506448/%E8%99%8E%E7%89%99%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/506448/%E8%99%8E%E7%89%99%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";
    $(document).ready(main);

    function main() {
        const style = document.createElement("style");
        style.innerHTML = `
        /* 侧边悬浮菜单栏 */
        a[href="//www.huya.com/download/"],
        a[href="https://hd.huya.com/pc/2019zhubo/pages/index.html"],
        a[href="https://hd.huya.com/web/about/index.html#contact"],
        a[href="https://wan.huya.com/"] {
        display: none !important;
        }

        .helperbar--cpOuG7OGer2wWrNst9OwG > * {
        display: none;
        }

        .helperbar--cpOuG7OGer2wWrNst9OwG > .helper-nav--1yz7uIycIDu_3rI5oz1pJr {
        display: block;
        }

        /* 顶部菜单栏 */
        .NavKaiBo--3_pcnDZbeaycODmpgNFBtt,
        .NavDownload--14eln2LYTFMgF_MZOue4Gu,
        #J_hyNavItemYouliao,
        #J_hyHdNavItemGame {
        display: none;
        }

        /* 直播特效(ad与特效弹幕) */
        #player-marquee-wrap,
        #huya-ab-fixed,
        #huya-ab {
        display: none;
        }

        /* 订阅按钮一列 */
        #J_roomHdR > div > div {
        display: none !important;
        }
        #J_roomHdR > div > .subscribe-entrance {
        display: block !important;
        }


        /* 特效弹幕 */
        /* 礼物通知 */
        /* 大家都在发 */
        /* 事件通知 */
        .player-banner-gift,
        #player-danmu-plus-one-banner,
        #player-mouse-event-wrap,
        .player-fans-banner {
        display: none !important;
        }

        /* 视频左下角广告 */
        #player-ext-wrap {
        display: none !important;
        }
        `;
        document.querySelector("body").append(style);

        const url = location.href;
        if (/^(https?:\/\/)([a-zA-Z0-9-\.]+)\/?$/.test(url)) {
            home();
        }
        if (/^(https?:\/\/)([a-zA-Z0-9-\.]+)(\/[a-zA-Z0-9-]+\/?)$/.test(url)) {
            player();
        }
    }

    function home() {
        document.querySelector("#duya-header").style.backgroundColor =
            "rgb(167 167 167)";
        const banner = document.querySelector("#banner");
        banner.innerHTML = "";
        $(banner).css({
            position: "inherit",
            height: "60px",
            "background-image": "url()",
            "background-color": "#ffffff",
        });
        // 暂停直播
        document.querySelector("#player-btn")?.click();
        // 移除直播
        document.querySelector(".mod-index-main")?.remove();
    }

    function player() {
        // 免登录
        if (VPlayer.prototype.checkLogin) VPlayer.prototype.checkLogin(true);

        $(document.querySelector("#J_mainWrap")).css({
            "padding-left": "0px",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
        });

        document.querySelector(".mod-sidebar")?.remove();
        const main = document.querySelector("#main_col");
        const videoBox = main.querySelector("#J_mainRoom");
        // 净化直播容器
        const core = videoBox.querySelector(".room-core");
        videoBox.replaceChildren(core);
        // 移除右侧弹幕
        core.replaceChildren(core.querySelector(".room-core-l"));
        // 净化主容器
        main.replaceChildren(videoBox);
        videoBox.style.margin = 0;
        // 订阅按钮一列
        const a = document.querySelector(".host-control.J_roomHdCtrl");
        a.replaceChildren(a.querySelector(".subscribe-entrance"));

        (() => {
            // 优化视频布局
            $(document.querySelector("#main_col")).css({
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
            });
            $(document.querySelector("#J_mainRoom")).css({
                padding: "0 0 0 0",
                "min-width": "0",
                width: "calc((100vmin - 20px - 60px) * 1.4)",
            });
            $(document.querySelector(".room-core .room-core-l")).css({
                "margin-right": "0",
            });
        })();

        (function () {
            const observer = new MutationObserver((mutations, observer) => {
                const list = $(".player-videotype-list li");
                if (list?.data("data")) {
                    alert("解锁成功");
                    observer.disconnect();

                    setTimeout(() => {
                        list.eq(0).click();
                    }, 16);
                    list.each((_, item) => {
                        const data = $(item)?.data("data");
                        data.sDisplayName = "假" + data.sDisplayName;
                        data.sTagText = "无需扫码";
                        item.querySelector(".bitrate-right-btn").innerHTML = data.sTagText;
                        item.querySelector("span").innerHTML = data.sDisplayName;
                        data.iEnable = 1;
                    });
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        })();

    }
})();
