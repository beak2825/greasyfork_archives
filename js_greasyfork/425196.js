// ==UserScript==
// @name         Bangumi/bgm.tv 每日番剧放送 (仿B站番剧时间表)
// @namespace    https://greasyfork.org/zh-CN/users/756550
// @version      1.10
// @description  Bangumi每日番剧放送页面美化，仿B站番剧时间表。使用页面：https://bgm.tv/calendar
// @author       Marsen
// @match        http*://bgm.tv/*
// @match        http*://bangumi.tv/*
// @match        http*://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425196/Bangumibgmtv%20%E6%AF%8F%E6%97%A5%E7%95%AA%E5%89%A7%E6%94%BE%E9%80%81%20%28%E4%BB%BFB%E7%AB%99%E7%95%AA%E5%89%A7%E6%97%B6%E9%97%B4%E8%A1%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425196/Bangumibgmtv%20%E6%AF%8F%E6%97%A5%E7%95%AA%E5%89%A7%E6%94%BE%E9%80%81%20%28%E4%BB%BFB%E7%AB%99%E7%95%AA%E5%89%A7%E6%97%B6%E9%97%B4%E8%A1%A8%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 是否在顶部菜单添加"放送"快捷按钮：true/false
    const isAddCalendarBtn = true;
    // 是否显示副标题：true/false
    const isShowSubTitle = true;

    // 全局变量
    const leftBtnSvg = `
            <svg t="1618724723358" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2015"
                width="100" height="200">
                <path d="M704 908.8 307.2 512 704 115.2c25.6-25.6 25.6-70.4 0-96-25.6-25.6-70.4-25.6-96 0L166.4 460.8C147.2 480 140.8 492.8 140.8 512s6.4 32 19.2 51.2l441.6 441.6c25.6 25.6 70.4 25.6 96 0C729.6 979.2 729.6 934.4 704 908.8z" p-id="2016"
                    fill="#BBB">
                </path>
            </svg>`
    const rightBtnSvg = `
        <svg t="1618724984341" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2791"
            width="100" height="200">
            <path d="M294.4 908.8 684.8 512 294.4 115.2c-25.6-25.6-25.6-70.4 0-96 25.6-25.6 70.4-25.6 96 0L832 460.8c12.8 12.8 19.2 32 19.2 51.2S844.8 544 832 563.2l-441.6 441.6c-25.6 25.6-70.4 25.6-96 0C262.4 979.2 262.4 934.4 294.4 908.8z" p-id="2792"
                fill="#BBB">
            </path>
        </svg>`

    const globalCSS = `
        /* 全局 */
        #main {
            width: 990px;
        }

        /* header统计 */
        #header small.blue {
            font-size: 16px;
        }

        /* 日历头 */
        div.BgmCalendar dl dt {
            background: none;
            height: 35px;
            width: 330px;
        }
        div.BgmCalendar h3 {
            text-indent: 0;
            font-size: 2em;
            width: inherit;
            line-height: normal;
            color: #555;
        }
        /* 关灯环境 */
        html[data-theme='dark'] div.BgmCalendar h3 {
            color: #DDD;
        }

        /* 日历主体 */
        .columns {
            width: 990px;
            overflow: hidden;
        }
        #colunmSingle {
            width: 2400px;
            /* 动画 */
            transition: all 0.5s ease;
        }

        /* 每列栏目 */
        div.BgmCalendar dl dd {
            border-left: 5px dotted #FF0F00;
            border-right: none;
        }
        div.BgmCalendar ul.large li.week {
            width: 300px;
            padding-right: 30px;
        }

        /* 海报 */
        div.BgmCalendar ul.coverList li {
            height: 80px;
            width: 80px;
            border: none;
            border-radius: 4px;
            margin: 10px 0 0 10px;
            background-size: cover !important;
            background-position-x: inherit !important;
            background-position-y: inherit !important;
            background-repeat: no-repeat !important;
        }

        /* 标题 */
        div.BgmCalendar ul.coverList li div.info_bg {
            background: none;
            -moz-opacity: initial;
            opacity: initial;

            color: #000;
            font-size: 1.2em;
            font-weight: 600;
            line-height: normal;
            overflow: initial;

            width: 200px;
            height: inherit;
            bottom: initial;
            padding: 0 0 0 90px;
        }
        div.info {
            height: inherit;
        }
        a.nav, a.nav:link, a.nav:visited, a.nav:active {
            color: #000;
        }
        div.BgmCalendar ul.coverList li:hover div.info_bg {
            height: inherit;
        }
        div.BgmCalendar ul.coverList li:hover div.info {
            position: initial;
            bottom: initial;
            line-height: normal;
        }

        /* 副标题 原标题 */
        .info_bg em {
            font-weight: 500;
            font-style: normal;
            font-size: 1em;
            color: #999;
        }

        /* 左右控制按钮 */
        #leftBtn, #rightBtn {
            position: fixed;
            bottom: calc(50% - 100px);
            cursor: pointer;
            opacity: 20%;
            -moz-opacity: 20%;
            z-index: 2;
        }
        #leftBtn {
            left: 0;
        }
        #rightBtn {
            right: 0;
        }
        #leftBtn:hover, #rightBtn:hover {
            background: rgb(245, 245, 245);
            opacity: 100%;
            -moz-opacity: 100%;
        }
        /* 关灯环境 */
        html[data-theme='dark'] #leftBtn:hover, html[data-theme='dark'] #rightBtn:hover {
            background: #5e5e5e;
            opacity: 100%;
            -moz-opacity: 100%;
        }
        `

    // 添加全局css
    // 副标题css
    if (!isShowSubTitle) {
        GM_addStyle(".info_bg em{opacity: 0;}");
    }
    // 隐藏doujin天窗联盟
    GM_addStyle(`#navNeue2 #navMenuNeue li.doujin {display: none;}`);
    // css聚焦当天番剧表
    let d = new Date();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let today = d.getDay();
    if (document.URL.endsWith("calendar")) {
        GM_addStyle(globalCSS);
        GM_addStyle("#colunmSingle {margin-left: " + (1 - today) * 330 + "px}");
    }

    // 函数列表
    // 添加日期标记
    function addHeaderDateText() {
        let dic = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let todayHeader = document.querySelector(".week ." + dic[today] + " h3");
        todayHeader.innerText += " (今天)";
        todayHeader.style.color = "orange";
        for (let i = 0; i <= 6; i++) {
            if (i != today) {
                let dayHeader = document.querySelector(".week ." + dic[i] + " h3");
                dayHeader.innerText = dayHeader.innerText + " (" + month + "-" + (date+i-today) + ")";
            }
        }
    }
    // 时间表内容补全
    function completeContent() {
        // 主标题补全(部分番剧无主标题)
        let mainTitles = document.querySelectorAll(".info p:nth-child(1)");
        mainTitles.forEach(function (t) {
            if (t.innerText == "") {
                t.firstElementChild.innerText = t.nextElementSibling.innerText;
            }
        });
        // 海报图片补全(冷门番剧无海报)
        let lostPosters = document.querySelectorAll(`.coverList li[style="background:url('//lain.bgm.tv/pic/cover/c/') 50% 20%"]`);
        lostPosters.forEach(function (t) {
            t.style.backgroundImage = "url('//lain.bgm.tv/img/no_icon_subject.png')";
        });
    }
    // 番剧链接新标签页打开
    function addLinkTarget() {
        let linkList = document.querySelectorAll('.BgmCalendar a');
        linkList.forEach(function (t) {
            t.setAttribute('target', '_blank');
        });
    }
    // 添加时间表左右控制按钮
    function addControlBtn() {
        // 新建左右按钮
        let leftBtn = document.createElement("div");
        leftBtn.id = "leftBtn";
        leftBtn.innerHTML = leftBtnSvg;
        let rightBtn = document.createElement("div");
        rightBtn.id = "rightBtn";
        rightBtn.innerHTML = rightBtnSvg;
        // 插入节点
        let colunmSingle = document.getElementById("colunmSingle");
        let parent = document.querySelector(".columns");
        parent.insertBefore(leftBtn, colunmSingle);
        parent.appendChild(rightBtn, colunmSingle);
        // 添加动作
        leftBtn.addEventListener("click", function (e) {
            let match = colunmSingle.style.transform.match(/-?\d+/);
            let move = 0;
            if (match != null) {
                move = parseInt(match[0]);
            }
            if (move - (today - 1) * 330 <= 0) {
                colunmSingle.style.transform = "translateX(" + (move + 330) + "px)";
            }
        }, false);
        rightBtn.addEventListener("click", function (e) {
            let match = colunmSingle.style.transform.match(/-?\d+/);
            let move = 0;
            if (match != null) {
                move = parseInt(match[0]);
            }
            if (move - (today - 1) * 330 >= -1320) {
                colunmSingle.style.transform = "translateX(" + (move - 330) + "px)";
            }
        }, false);
    }
    // 顶栏添加放送按钮
    function addCalendarBtn() {
        // 新建放送按钮
        let calendar = document.createElement("li");
        calendar.innerHTML = `<a href="/calendar" class="top chl"><span>放送</span></a>`;
        // 插入节点
        let parent = document.querySelector("#navMenuNeue");
        parent.insertBefore(calendar, parent.children[1]);
    }

    // 主逻辑
    // 监听DOMContentLoaded，执行主逻辑
    window.addEventListener('DOMContentLoaded', function () {
        if (document.URL.endsWith("calendar")) {
            addHeaderDateText();
            completeContent();
            addLinkTarget();
            addControlBtn();
        }
        if (isAddCalendarBtn) {
            addCalendarBtn();
        }
    });
})();