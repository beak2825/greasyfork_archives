// ==UserScript==
// @name         NoBaiduNews
// @namespace    https://github.com/WLongSAMA/NoBaiduNews
// @version      1.0.0
// @description  屏蔽百度页新闻推荐流，只保留网址导航功能。
// @author       WLong
// @license      MIT
// @match        *://www.baidu.com
// @match        *://m.baidu.com
// @match        *://cn.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @supportURL   https://github.com/WLongSAMA/NoBaiduNews
// @downloadURL https://update.greasyfork.org/scripts/458079/NoBaiduNews.user.js
// @updateURL https://update.greasyfork.org/scripts/458079/NoBaiduNews.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function IsMobile() {
        let regex = /iPhone|iPad|iPod|iOS|Android/i;
        if (regex.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        };
    }

    function Selector(selector) {
        return document.querySelector(selector);
    }

    function SelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    let n = 0;
    let interval;

    if (!IsMobile()) {
        addEventListener("load", (event) => {
            if (document.title == "百度一下，你就知道") { //百度桌面端
                interval = self.setInterval(function () {
                    if (n >= 10) window.clearInterval(interval);

                    let content = Selector("#s_content_2");
                    if (content) {
                        content.remove();
                    }
                    Selector("#s_menu_mine").click();
                    if (Selector("#s_content_100")) {
                        Selector("#s_menus_wrapper").innerHTML = '<span id="s_menu_mine" class="s-menu-item current" data-id="100"><span class="s-menu-item-underline"></span></span>';
                        window.clearInterval(interval);
                    }
                    n++;
                }, 1000);
            }
        });
    } else {
        if (document.title == "百度一下") { //百度移动端
            interval = self.setInterval(function () { //百度移动端无法触发 Load 事件
                Selector(".blank-frame").remove(); //移除新闻流
                Selector("#foot").firstChild.remove(); //移除用户反馈
                Selector("#ns-square-point").style.display = "none"; //隐藏右上角小红点
                Selector(".square-banner-bgicon").style.display = "none"; //隐藏顶部热播爆款好剧
                Selector(".callicon-wrap").style.display = "none"; //隐藏图片搜索按钮和录音按钮

                Selector("#navs").remove(); //移除列表分隔行
                Selector("#logo").style.paddingTop = "150px"; //优化LOGO和搜索框的显示位置

                window.addEventListener("resize", function () {
                    Selector("#header").style.height = document.documentElement.clientHeight - Selector("#bottom").clientHeight - 10 + "px"; //修复卡片高度
                }, false);
                window.dispatchEvent(new Event('resize'));

                window.clearInterval(interval);
            }, 1000);
        }
    }

    //必应已经可以通过菜单关闭新闻流
    /*
    addEventListener("load", (event) => {
        if (document.title == "搜索 - Microsoft 必应" || document.title == "Search - Microsoft Bing") { //必应
            let qrcode = Selector("#id_qrcode");
            if (qrcode) {
                qrcode.style.display = "none"; //隐藏必应手机版图标
            }
            let qrcode_popup = Selector("#id_qrcode_popup_positioner");
            if (qrcode_popup) {
                qrcode_popup.style.display = "none"; //隐藏必应手机版二维码
            }

            let place = Selector(".sb_form_placeholder_query");
            if (place) {
                place.style.display = "none"; //隐藏搜索框热词
            }

            Selector(".vs").style.display = "none"; //隐藏新闻流

            let feedback = Selector("#sb_feedback");
            if (feedback) {
                feedback.style.display = "none"; //隐藏反馈按钮
            }

            if (!IsMobile()) {
                interval = self.setInterval(function () {
                    Selector(".show_partial").style.top = "calc(100% - 3.25rem)"; //调整悬浮窗位置
                    Selector(".caro_div").style.display = "none"; //隐藏布局按钮
                    window.clearInterval(interval);
                }, 1000);
            } else {
                Selector("#vs_cont").style.top = "100%"; //调整悬浮窗位置

                let footer = Selector("#footer");
                if (footer) {
                    footer.style.display = "none"; //隐藏页脚
                }
            }
        }
    });
    */
})();
