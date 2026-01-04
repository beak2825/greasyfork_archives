// ==UserScript==
// @name         Bangumi/bgm.tv 显示中文标题，样式优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  我看不懂日文标题啊！
// @author       Marsen
// @match        http*://bgm.tv/*
// @match        http*://bangumi.tv/*
// @match        http*://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424729/Bangumibgmtv%20%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98%EF%BC%8C%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424729/Bangumibgmtv%20%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98%EF%BC%8C%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 番剧管理器字号放大
    const TINY_MODE_FONT_SIZE = "1.2em";
    // 番剧管理器edit按钮是否启用
    const ENABLE_EDIT = false; // false, true
    const EDIT_BUTTON = "❤"; // edit或自定义

    // 全部页面：移除不常用按钮，页面优化
    GM_addStyle(`
        /* 隐藏doujin天窗联盟 */
        #navNeue2 #navMenuNeue li.doujin {
            display: none;
        }
        #navNeue2 #menuNeue {
            width: inherit;
        }
        /* 搜索框拉长 */
        #headerNeue2 #headerSearch input.textfield {
            width: initial;
        }
        /* 全局输入字体调大 */
        input[type=text], input[type=password], textarea {
            font-size: 1.2em;
        }
    `);
    let pathname = document.location.pathname;
    // 动画详情页：替换H1大标题，保留小字号原标题，话数按钮样式调节
    if (pathname.startsWith("/subject") || pathname.startsWith("/ep")) {
        // prg_list css
        GM_addStyle(`
            /* 话数按钮优化 */
            a.epBtnUnknown, a.epBtnWatched, a.epBtnAir, a.epBtnNA, a.epBtnQueue, a.epBtnToday, a.epBtnDrop {
                border: 1px solid #0000;
                border-radius: 2px;
                font-size: 1.3em !important;
            }
            ul.prg_list a, ul.prg_list a:active, ul.prg_list a:visited {
                padding: 2px;
                margin: 0 4px 6px 0;
            }
            /* hover高亮 */
            a.epBtnUnknown:hover,
            a.epBtnWatched:hover,
            a.epBtnAir:hover,
            a.epBtnNA:hover,
            a.epBtnQueue:hover,
            a.epBtnToday:hover,
            a.epBtnDrop:hover {
                background-color: orange;
                color: white !important;
                border: 1px solid #0000;
            }
            ul.prg_list a:hover {
                padding: 2px;
                -webkit-transform: scale(1.1);
            }
            /* 关灯环境 */
            html[data-theme='dark'] a.epBtnUnknown:hover,
            html[data-theme='dark'] a.epBtnWatched:hover,
            html[data-theme='dark'] a.epBtnAir:hover,
            html[data-theme='dark'] a.epBtnNA:hover,
            html[data-theme='dark'] a.epBtnQueue:hover,
            html[data-theme='dark'] a.epBtnToday:hover,
            html[data-theme='dark'] a.epBtnDrop:hover {
                background-color: orange;
                color: white;
                border: 1px solid #0000;
            }
        `);
        if (pathname.startsWith("/ep")) {
            // 章节讨论区右侧固定
            GM_addStyle(`
                #columnEpB {
                    position: -webkit-sticky;
                    position: sticky;
                    top: 10px;
                }
            `);
        }
        window.addEventListener('DOMContentLoaded', function () {
            let h1Title = document.querySelector("#headerSubject > h1 > a");
            if (h1Title.title != "") {
                let originalTitle = document.createElement("small");
                originalTitle.innerText = h1Title.text + " ";
                h1Title.parentNode.insertBefore(originalTitle, h1Title.nextElementSibling)
                h1Title.text = h1Title.title;
                let rightTitle = document.querySelector("#subject_inner_info > a");
                rightTitle.innerHTML = rightTitle.innerHTML.replace(rightTitle.title, h1Title.text);
            }
        });
    }
    // 登录后首页：替换进度管理标题，按钮样式调节
    else if (pathname == "/") {
        // tinyMode css
        GM_addStyle(`
            /* hide prgsPercentNum */
            #prgsPercentNum {
                display: none;
            }
            /* prg button */
            [id^='prg_'] {
                border: 1px solid #0000 !important;
                border-radius: 2px;
            }
            ul.prg_list {
                padding-top: 0.3em;
                line-height: 100%;
            }
            /* prg button hover */
            .tinyMode ul.prg_list a:hover {
                padding: 2px 2px;
                background-color: orange;
                color: white;
                -webkit-transform: scale(1.1);
            }
            /* 关灯环境 */
            html[data-theme='dark'] .tinyMode a.epBtnNA:hover, html[data-theme='dark'] a.sepBtnNA:hover {
                color: #FFF;
                border-top: initial
            }
        `)
        // 作品标题字号放大
        GM_addStyle(
            `[id^='subjectPanel'] > div.epGird > div > a:nth-last-of-type(1) {
                font-size: ` + TINY_MODE_FONT_SIZE +
            "}"
        );
        // 是否显示edit按钮
        if (ENABLE_EDIT) {
            GM_addStyle(`[id^='sbj_prg_'] {color: pink !important;}`);
        }
        else {
            GM_addStyle(`[id^='sbj_prg_'] {display: none}`);
        }
        // blockMode css
        GM_addStyle(`
            /* 话数按钮优化 */
            a.epBtnUnknown, a.epBtnWatched, a.epBtnAir, a.epBtnNA, a.epBtnQueue, a.epBtnToday, a.epBtnDrop {
                border: 1px solid #0000;
                border-radius: 2px;
                font-size: 1.3em !important;
            }
            ul.prg_list a {
                margin: 0 4px 6px 0;
                padding: 2px;
            }
            /* hover高亮 */
            a.epBtnUnknown:hover, a.epBtnWatched:hover, a.epBtnAir:hover, a.epBtnNA:hover, a.epBtnQueue:hover, a.epBtnToday:hover, a.epBtnDrop:hover {
                background-color: orange;
                color: white;
            }
            ul.prg_list a:hover {
                -webkit-transform: scale(1.1);
            }
        `);

        // 提速，轮询当前已加载的番剧项目，数量有变化就转换一遍
        let lastBgmCount = 0;
        let count = 0;
        const intervalId = setInterval(() => {
            let bgmList = document.querySelectorAll("#cloumnSubjectInfo .epGird .tinyHeader");
            if (bgmList && bgmList.length > lastBgmCount) {
                lastBgmCount = bgmList.length;
                convertTitle();
            }
            count++;
            if (count >= 80) {
                clearInterval(intervalId);
            }
        }, 100);
    }
    
    function convertTitle() {
        // tinyMode
        let tinyModeTitles = document.querySelectorAll("[id^='subjectPanel'] > div.epGird > div > a:nth-last-of-type(1)");
        tinyModeTitles.forEach(function (t) {
            if (t.attributes.title.value != "") {
                t.innerText = t.attributes.title.value;
                t.attributes.title.value = "";
            } else if (t.attributes["data-original-title"] && t.attributes["data-original-title"].value != "") {
                t.innerText = t.attributes["data-original-title"].value;
                t.attributes["data-original-title"].value = "";
            }
        });
        if (ENABLE_EDIT) {
            let edits = document.querySelectorAll("[id^='sbj_prg_']");
            edits.forEach(function (t) {
                t.innerText = EDIT_BUTTON;
            });
        }
        // blockMode
        let blockModeTitles = document.querySelectorAll("[id^='subjectPanel'] > div.header.clearit > div > h3 > a");
        blockModeTitles.forEach(function (t) {
            if (t.attributes.title.value != "") {
                t.innerText = t.attributes.title.value;
                t.attributes.title.value = "";
            } else if (t.attributes["data-original-title"] && t.attributes["data-original-title"].value != "") {
                t.innerText = t.attributes["data-original-title"].value;
                t.attributes["data-original-title"].value = "";
            }
        });
        let blockModeLeftTitles = document.querySelectorAll("#prgSubjectList li a.subjectItem.title.textTip");
        blockModeLeftTitles.forEach(function (t) {
            if (t.attributes.title.value != "") {
                t.querySelector("span").innerHTML = t.attributes.title.value;
                t.attributes.title.value = "";
            } else if (t.attributes["data-original-title"] && t.attributes["data-original-title"].value != "") {
                t.querySelector("span").innerHTML = t.attributes["data-original-title"].value;
                t.attributes["data-original-title"].value = "";
            }
        });
    }
})();