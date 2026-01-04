// ==UserScript==
// @name         b站动态设置
// @namespace    https://greasyfork.org/
// @license      MIT
// @version      0.1
// @description  调整b站动态首页得展示
// @author       byhgz
// @match        *://t.bilibili.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/462234-message/code/Message.js?version=1170653
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489577/b%E7%AB%99%E5%8A%A8%E6%80%81%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/489577/b%E7%AB%99%E5%8A%A8%E6%80%81%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

const Util = {
    addGMMenu(text, func, shortcutKey = null) {
        return GM_registerMenuCommand(text, func, shortcutKey);
    },
    addStyle(cssStyleStr) {
        GM_addStyle(cssStyleStr);
    },
    setData(key, content) {
        GM_setValue(key, content);
    },
    getData(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    },
}

const Layout={
    addMenu(){
        $("body").append(`<div style="position: fixed; left: 90%;top: 10%;z-index: 2024">
        <button id="isShowMainPanel">只显示主内容</button>
</div>`);
    }
}

const LocalData = {
    isTrendsItemsTwoColumn() {
        return Util.getData("trendsItemsTwoColumn", false);
    },
    setTrendsItemsTwoColumn(is) {
        Util.setData("trendsItemsTwoColumn", is === true);
    }
}

const Trends = {
    setitemsCss() {
        Util.addStyle(`
            .bili-dyn-up-list__content{
            display:flex;
            flex-flow:row wrap;
            }`);
    },
    setStyleRichTextarea() {
        const i1 = setInterval(() => {
            const richTextArea = document.querySelector(".bili-rich-textarea");
            if (richTextArea === null) return;
            clearInterval(i1);
            try {
                $(richTextArea).css("max-height", "");
                Qmsg.success("已解锁发动态编辑框的最大可视内容！");
            } catch (e) {
                console.error("修改编辑框最大可视内容时出错！", e);
            }
        }, 1000);
    },
    topCssDisply: {
        //针对于整体布局的细调整
        body() {
            const interval = setInterval(() => {
                const leftTopUserE = document.querySelector(".left .bili-dyn-my-info");
                if (leftTopUserE === null) return;
                clearInterval(interval);
                leftTopUserE.remove();
                document.querySelector(".bili-dyn-home--member").style.justifyContent = 'space-between';
                $('aside').hide();
                document.querySelector("main").style.width = "100%";
            });
            const interval02 = setInterval(() => {
                const e = document.querySelectorAll(".bili-dyn-sidebar>*:nth-child(-n+2)");
                if (e.length === 0) return;
                clearInterval(interval02);
                e.forEach((value, key) => {
                    value.remove();
                });
                console.log("已尝试移除个别多余的悬浮按钮");
            }, 500);
        }
    },
};

function extracted() {
    const i2 = setInterval(() => {
        const tempList = document.querySelectorAll(".bili-dyn-list__items>.bili-dyn-list__item");
        if (tempList.length === 0) return;
        clearInterval(i2);
        //调整动态列表的布局方式为类似网格
        Util.addStyle(`
            .bili-dyn-list__items{
           column-count: 2;
            }
            .bili-dyn-list__items>*{
            page-break-inside: avoid;
            }
            `);
    }, 500);
}

(function () {
    'use strict';
    const url = window.location.href;
    const title = document.title;
    Util.addGMMenu("动态首页动态展示双列显示开关", () => {
        const b = confirm("是否开启动态首页动态展示双列显示？\n当前状态:" + (LocalData.isTrendsItemsTwoColumn() === true ? "开" : "关"));
        LocalData.setTrendsItemsTwoColumn(b);
        alert(`已设置状态:${b ? "开" : "关"}`);
    });
    if (!(url.startsWith("https://t.bilibili.com/") && title.startsWith("动态首页-哔哩哔哩"))) {
        return;
    }
    console.log("=========动态首页=========");
    const i1 = setInterval(() => {
        const tab = document.querySelector(".bili-dyn-up-list__content");
        if (tab === null) return;
        clearInterval(i1);
        Trends.setitemsCss();
        Qmsg.success("已修改切换动态用护栏展示");
        $(tab).children(".bili-dyn-up-list__item").click(() => {
            extracted();
        });
    }, 1000);
    Trends.setStyleRichTextarea();
    Trends.topCssDisply.body();
    if (LocalData.isTrendsItemsTwoColumn()) {
        extracted();
    }
    Layout.addMenu();
    $("#isShowMainPanel").click((e) => {
        const target = e.target;
        const aside = $('aside');
        const bodyMain = document.querySelector("main");
        if (target.textContent === "只显示主内容") {
            target.textContent = "显示左右中内容";
            aside.show();
            bodyMain.style.width = "724px";
        } else {
            target.textContent = "只显示主内容";
            aside.hide();
            bodyMain.style.width = "100%";
        }
    });

})();