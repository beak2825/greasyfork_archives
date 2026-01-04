// ==UserScript==
// @name         AMQ
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Auto Assist!
// @author       Lee
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaElEQVQ4jY2SP2gUQRSHvzcze5c977jDiBhQTGEngqIBAyIkRYKNIJggYiOCImprJXiWNnYiEaJoIXIKgiBIIImFqGCMQv7YiWIjGjS62c1lb2fGYs0ZG8kPBh7vzbz38XsDqxqZCrg7f47R6V4Ahhq6XVuNR6d7uTt/jpGpYLUk1L2CK7Dt6C4qlXe00gWa8RFO7X7OWo2+O0DHhkcEhU1E0W4+P5yBy0j7wu23NaR4g7B8jJXkO5kdwuvX+Rjbg9EPKJY2srx0H79ylpN7FnOCay9CNtXqoI7jfQWhig7AWbBZAoA2JZQG2wLPT0QicPdYWKwbOqtXqXReIPoB3iV4iXCpQxDAAODsL6z1gEIwIFupdF7ESyjcmY/RgaLVOoxTrwBoWk+HFirWAxBpaecAlNtPEDzGtaxB6RKt9CfdXyfp68tYjyYnJ/m4eQVjqgbwKBE+dIU0GgnLu8bw3rOSHOL03rzhzTeGQvgUpSCcGeBDV4hxAniD9wIIsU5RPQGFrB/vwTY7crOAxlyRNOhHBOKegDhLqToBUH+gPLXE8Kk7JUsnyLJxPreW28jzX5tk2ThZOsGn7pRakpPnrkpulCpp6uII5wZ4MjtIvS8Dcrp6X0ZpdpBwboC6OFSp/UsNIDjvCXfEAAwP2zV2+Xa0Nl94G5Ps9IAYnE0ICkXi9/005l7ypaDYYH17hauKtBBrYUvqiKWXICjisiWD97coV88T/RgjyRKqrXzXy/LPe4yDqoMEj9ElylVYXLiuOXjiGcpqUNuBAHD/PaIsyDeayQ2+L176O2ZkqoQpa9ajbMlyZl8C8BsqkQfT9fYhAwAAAABJRU5ErkJggg==
// @grant        none
// @siteName     110法律咨询
// @match        http://www.110.com/ask/browse*
// @match        https://www.110.com/ask/browse*
// @siteName     找法网
// @match        http://china.findlaw.cn/ask/a*
// @match        https://china.findlaw.cn/ask/a*
// @match        http://china.findlaw.cn/ask/browse*
// @match        https://china.findlaw.cn/ask/browse*
// @siteName     找法网IP过滤
// @match        http://ipfilter.lsurl.cn/ipfilter/*
// @match        https://ipfilter.lsurl.cn/ipfilter/*
// @downloadURL https://update.greasyfork.org/scripts/429552/AMQ.user.js
// @updateURL https://update.greasyfork.org/scripts/429552/AMQ.meta.js
// ==/UserScript==


let _110_default = {
    reloadMinute: 1,
    msgAudio: "https://img.tukuppt.com/newpreview_music/00/14/69/5e5cca585eb5b3956.mp3"
};
let _findlaw_default = {
    reloadMinute: 2,
    msgAudio: "https://img.tukuppt.com/newpreview_music/09/00/63/5c893cf044bde33914.mp3"
};

(function () {
    'use strict';
    let locationPathName = window.location.hostname;
    let matchList = [{
        path: "110",
        method: match_110,
        default: _110_default
    },
        {
            path: "findlaw",
            method: match_findlaw,
            default: _findlaw_default
        },
        {
            path: "ipfilter",
            method: match_ipfilter,
            noSet: true
        }];
    let whichSite = matchList.find(e => locationPathName.includes(e.path));
    if (whichSite) {
        whichSite.method();
        optionSetting(whichSite.default);
    }
})();

// @options 参数配置
function optionSetting(defaultOption) {
    let style = document.createElement("style");
    let css = `
    .settingIcon {
        position: fixed;
        z-index: 50;
        left: 50px;
        bottom: 50px;
        height: 70px;
        width: 70px;
        font-size: 60px;
        line-height: 100px;
        text-align: center;
        cursor: pointer;
        color: #ccc;
        transition: color 200ms;
    }
    .settingIcon:hover {
        color: #888;
    }
    .AMQSetting {
        position: fixed;
        bottom: 130px;
        left: 50px;
        background-color: #fff;
        border-radius: 8px;
        padding: 15px 20px 20px;
        box-shadow: 0 3px 5px #888;
        display: none;
    }
    .AMQSetting * {
        font-family: 微软雅黑 Light;
        font-size: 13px !important;
        font-weight: 600;
        color: #333;
    }
    .AMQSettings {
        height: 50px;
        line-height: 50px;
    }
    .AMQSettingsInput {
        border: #ccc 1px solid;
        border-radius: 4px;
        height: 35px;
        font-size: 13px;
        text-indent: 5px;
        width: 400px;
        outline: none;
    }
    .AMQSettingsCheck {
        -webkit-appearance: checkbox;
        position: relative;
        top: -1px;
        vertical-align: middle;
    }
    .saveSetting {
        background-color: #409eff;
        color: #fff;
        text-align: center;
        line-height: 40px;
        opacity: 0.7;
        margin: 20px auto 0;
        width: 200px;
        transition: opacity 200ms;
        border-radius: 4px;
    }
    .saveSetting:hover {
        cursor: pointer;
        opacity: 1;
    }
    .matchFields {
        overflow: hidden;
        margin: 0 0 20px 80px;
        width: 400px;
    }
    .matchField {
        background: #000;
        border-radius: 3px;
        float: left;
        white-space: nowrap;
        cursor: pointer;
        margin: 12px 0 0 12px;
        color: #fff;
        padding: 5px 8px;
    }
    .matchField:nth-child(n) {
        background: #ff4d4f;
    }
    .matchField:nth-child(2n) {
        background: #389e0d;
    }
    .matchField:nth-child(3n) {
        background: #faad14;
    }
    .matchField:nth-child(4n) {
        background: #40a9ff;
    }
    .matchField:nth-child(5n) {
        background: #f759ab;
    }
    .matchField:nth-child(6n) {
        background: #9254de;
    }
    .matchField:nth-child(7n) {
        background: #36cfc9;
    }
    `;
    style.setAttribute("id", "AMQSettingStyle");
    style.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(style);
    let settingIcon = document.createElement("div");
    settingIcon.classList.add("settingIcon");
    settingIcon.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
            <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
        </svg>`;

    let setting = document.createElement("div");
    setting.classList.add("AMQSetting");
    setting.innerHTML = `
        <div class="AMQSettings">匹配字符列表：<input type="text" id="AMQSettingsInput_matchList" class="AMQSettingsForm AMQSettingsInput" placeholder="回车新增 点击标签删除" /></div>
        <div class="matchFieldsBox"></div>
        <div class="AMQSettings">自动刷新分钟：<input type="text" id="AMQSettingsInput_reloadMinute" class="AMQSettingsForm AMQSettingsInput" placeholder="默认：${defaultOption.reloadMinute} 分钟" /></div>
        <div class="AMQSettings">新消息通知音：<input type="text" id="AMQSettingsInput_msgAudio" class="AMQSettingsForm AMQSettingsInput" placeholder="默认：${defaultOption.msgAudio}" /></div>
        <div class="AMQSettings">只显示新消息：<input type="checkbox" id="AMQSettingsInput_onlyNewMsg" class="AMQSettingsForm AMQSettingsCheck" /></div>
        <div type="button" class="saveSetting">保　存</div>
    `;
    let matchFields = document.createElement("div");
    matchFields.classList.add("matchFields");
    matchFields.addEventListener("click", e => {
        console.log(e);
        if (e.target.className === "matchField") {
            if (window.confirm("删除 - " + e.target.innerText)) {
                e.target.parentNode.removeChild(e.target);
            }
        }
    });
    setting.querySelector(".matchFieldsBox").appendChild(matchFields);

    // setDefault
    let matchStrList = [];
    let matchList = localStorage.getItem("matchList");
    if (matchList) {
        matchStrList = matchList.split("&");
    }
    let matchFieldsHTML = "";
    matchStrList.forEach(e => {
        if (e) {
            matchFieldsHTML += `<div class="matchField">${e}</div>`;
        }
    });
    matchFields.innerHTML = matchFieldsHTML;
    let AMQSettingsInput_reloadMinute = setting.querySelector("#AMQSettingsInput_reloadMinute");
    let AMQSettingsInput_msgAudio = setting.querySelector("#AMQSettingsInput_msgAudio");
    AMQSettingsInput_reloadMinute.value = window.localStorage.getItem("reloadMinute") || "";
    AMQSettingsInput_msgAudio.value = window.localStorage.getItem("msgAudio") || "";
    setting.querySelector("#AMQSettingsInput_onlyNewMsg").checked = Boolean(window.localStorage.getItem("onlyNewMsg"));

    let matchFieldInput = setting.querySelector("#AMQSettingsInput_matchList");
    matchFieldInput.addEventListener("keyup", e => {
        if (e.keyCode === 13) {
            let v = matchFieldInput.value.replace(/\s/g, "");
            if (v) {
                matchFieldInput.value = "";
                let newField = document.createElement("div");
                newField.classList.add("matchField");
                newField.innerText = v;
                matchFields.appendChild(newField);
            }
        }
    });

    let saveSetting = setting.querySelector(".saveSetting");
    saveSetting.addEventListener("click", e => {
        let matchListStr = "";
        Array.from(matchFields.querySelectorAll(".matchField")).forEach(e => {
            matchListStr += e.innerText + "&";
        });
        let AMQSettingsInput_reloadMinute_V = AMQSettingsInput_reloadMinute.value;
        let AMQSettingsInput_msgAudio_V = AMQSettingsInput_msgAudio.value;
        window.localStorage.setItem("matchList", matchListStr);
        if (AMQSettingsInput_reloadMinute_V) {
            window.localStorage.setItem("reloadMinute", Math.max(parseFloat(AMQSettingsInput_reloadMinute_V), 0.1));
        }
        if (AMQSettingsInput_msgAudio_V) {
            window.localStorage.setItem("msgAudio", AMQSettingsInput_msgAudio_V);
        }
        window.localStorage.setItem("onlyNewMsg", document.getElementById("AMQSettingsInput_onlyNewMsg").checked ? "true" : "");
        saveSetting.innerText = "保存成功";
        saveSetting.style.backgroundColor = "#67C23A";
        setTimeout(autoReload, 1500);
    });

    settingIcon.addEventListener("click", () => {
        if (setting.style.display === "block") {
            setting.style.display = "none";
        } else {
            setting.style.display = "block";
        }
    });

    document.body.appendChild(settingIcon);
    document.body.appendChild(setting);
}

// @siteName     110法律咨询
function match_110() {
    console.log("AMQ matched 110法律咨询");
    let matchStrList = [];
    let matchList = localStorage.getItem("matchList");
    if (matchList) {
        matchStrList = matchList.split("&");
    }
    let reloadMinute = parseFloat(localStorage.getItem("reloadMinute") || _110_default.reloadMinute); // 自动刷新分钟数
    reloadMinute = isNaN(reloadMinute) ? parseFloat(_110_default.reloadMinute) : reloadMinute;
    let audioSrc = localStorage.getItem("msgAudio") || _110_default.msgAudio; // 新消息提示音
    let audio = new Audio(audioSrc);

    let audioReady, matchReady;
    let clickedHref = localStorage.getItem("clickedHref");
    if (clickedHref) {
        clickedHref = clickedHref.split("&");
    } else {
        clickedHref = [];
    }
    if (clickedHref.length > 1000) {
        clickedHref = clickedHref.slice(500);
        localStorage.setItem("clickedHref", clickedHref.join("&"));
    }
    let style = document.createElement("style");
    let css = `
        html body {
            background-color: #f1f1f1;
        }
        .leftbox01,
        .leftbox02,
        .rightbox03,
        .rightbox02,
        .ztbox {
            background-color: #fff;
        }
        .rightbox02 {
            margin-top: 7px;
        }
        .headerad, .ztbox, .foot, #weixin_ewm {
            display: none !important;
        }
        .messageCon {
            border: #ddd 1px solid;
            margin-top: 5px;
            margin-bottom: -5px;
        }
        .messageCon * {
            font-family: 微软雅黑 Light;
            font-size: 13px !important;
            font-weight: 600;
            color: #333;
            box-sizing: border-box;
            transition: all 200ms;
        }
        .messageCon a {
            text-decoration: none;
        }
        .t_title td {
            padding-top: 15px;
            border-top: dashed #ddd 1px;
            padding-bottom: 5px;
            text-indent: 1px;
        }
        .t_title:first-child td {
            border-top: none;
        }
        .t_info td {
            padding-bottom: 15px;
            width: 25%;
        }
        .matchTable {
            width: 100%;
            border-collapse: collapse;
        }
        .matchTable tbody {
            padding: 0 20px;
            background-color: #fff;
            border-left: #fff 20px solid;
            border-right: #fff 20px solid;
            position: relative;
        }
        .matchTable tbody:nth-child(even) {
            background-color: #f6f6f6;
            border-left: #f6f6f6 20px solid;
            border-right: #f6f6f6 20px solid;
            border-bottom: #f2f2f2 1px solid;
        }
        .messageCon .matchTable tbody:hover {
            background-color: #444;
            border-color: #444;
            cursor: pointer;
        }
        .messageCon .matchTable tbody:hover * {
            color: #fff;
        }
        .messageCon .matchTable tbody:hover .detailTitle {
            opacity: 1;
        }
        .left, .messageCon {
            overflow: visible;
        }
        .detailTitle {
            font-size: 28px !important;
            color: #333 !important;
            font-family: 微软雅黑 !important;
            font-weight: 400 !important;
            text-indent: 30px;
            letter-spacing: 3px;
            line-height: 40px;
            padding: 10px 15px;
            background: #fff;
            position: absolute;
            box-shadow: 0 0 10px #888;
            left: 100%;
            width: 350px;
            border-radius: 8px;
            z-index: 50;
            pointer-events: none;
            opacity: 0;
            top: 50%;
            transform: translateY(-50%);
            margin-left: -20px;
        }
        .matchedQuestion * {
            display: none !important;
            opacity: 0;
        }
        .readed td {
            opacity: 0.5;
        }
        .headertopbar {
            margin-top: 5px;
        }
        .main {
            margin-bottom: 80px;
        }
        .noMsg {
            font-size: 100px !important;
            text-align: center;
            background-color: #fff;
            line-height: 200px;
        }
        .noMsg span {
            font-size: 0.75em !important;
            vertical-align: bottom;
        }
    `;
    style.setAttribute("id", "AMQStyle");
    style.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(style);
    document.documentElement.click();
    audio.click();
    audio.addEventListener("canplaythrough", () => {
        if (matchReady) {
            audio.play();
        } else {
            audioReady = true;
        }
    });

    let matchQuestion = function () {
        let leftbox02 = document.querySelector(".leftbox02");
        if (!leftbox02) {
            setTimeout(matchQuestion, 50);
            return;
        }
        document.getElementsByClassName("rightbox02")[2].nextElementSibling.remove();
        leftbox02.insertBefore(
            document.querySelector(".pages").cloneNode(true),
            leftbox02.querySelector(".tit05")
        );
        let messageCon = document.createElement("div");
        messageCon.className = localStorage.getItem("onlyNewMsg") ? "messageCon onlyNewMsg" : "messageCon";
        messageCon.innerHTML =
            `<table class="matchTable"></table>`;
        let messageConHTML = "";
        let maxWidth = 300;
        let hasNew = true;
        let questions = leftbox02.getElementsByClassName("tit07");
        Array.from(questions).forEach(question => {
            let text = question.innerText;
            if (matchStrList.findIndex(e => {
                return text.indexOf(e) >= 0 && e !== "";
            }) >= 0) {
                if (question.querySelector("img").getAttribute("alt") !== "已解决") {
                    question.classList.add("matchedQuestion");
                    let link = Array.from(question.querySelectorAll("a")).find(e => e.getAttribute("href").includes("question"));
                    if (link) {
                        let id = link.href.match(/-(\d+)\./)[1];
                        let tbodyClass = "m" + id;
                        if (clickedHref.includes(id)) {
                            hasNew = false;
                            tbodyClass += " readed";
                        }
                        let reply = question.querySelector(".lan").innerText;
                        let title = link.innerText.slice(0, 45);
                        messageConHTML +=
                            `<tbody class="${tbodyClass}" data-href="${link.getAttribute('href')}"><tr class="t_title">
                            <td colspan="4">
                                <a _href="${link.getAttribute('href')}" target="_blank"> ❔ ${title}</a>
                            </td>
                            <td style="width: 0;opacity: 1;">
                                <div class="detailTitle">${title}</div>
                            </td>
                        </tr>
                        <tr class="t_info">
                            <td> 🎄️ ${question.querySelector(".hui").innerText}</td>
                            <td> 🎙️️ ${question.querySelector(".g03").innerText} 人回复</td>
                            <td> 💬 ${reply === "回复咨询" ? "" : reply}</td>
                            <td> ⏰ ${question.querySelector(".g05s").innerText}</td>
                            <td style="width: 0;"></td>
                        </tr>
                        </tbody>`;
                    }
                }
            }
        })
        if (messageConHTML === "") {
            messageCon.style.pointerEvents = "none";
            messageConHTML = "<div class='noMsg'>☕<span>饮杯茶先</span></div>"
        } else if (hasNew) {
            matchReady = true;
            if (audioReady) {
                audio.play();
            }
        }
        messageCon.querySelector(".matchTable").innerHTML = messageConHTML;
        messageCon.addEventListener("click", clickLink);
        document.querySelector(".left").insertBefore(messageCon, leftbox02);
    }

    let clickLink = function (ev) {
        let tbody = ev.target;
        if (tbody.tagName.toUpperCase() === "TABLE") {
            return;
        }
        while(tbody && tbody.tagName.toUpperCase() !== "TBODY") {
            tbody = tbody.parentElement;
        }
        if (tbody) {
            let href = tbody.getAttribute("data-href");
            let id = href.match(/-(\d+)\./)[1];
            let str = localStorage.getItem("clickedHref") || "";
            localStorage.setItem("clickedHref", str + id + "&");
            document.querySelector(".messageCon").querySelector(".m" + id).classList.add("readed");
            window.open(href, "_blank");
        }
    }

    matchQuestion();

    let autoReloadTimer = setTimeout(autoReload, 1000 * 60 * reloadMinute);
    document.addEventListener("mousemove", () => {
        clearTimeout(autoReloadTimer);
        autoReloadTimer = setTimeout(autoReload, 1000 * 60 * reloadMinute);
    });
    document.addEventListener("keyup", key => {
        if (key.code === "ArrowLeft") {
            let prev = Array.from(document.querySelector(".pages").querySelectorAll("a")).find(e => e.innerText === "上一页");
            prev && prev.click();
        } else if (key.code === "ArrowRight") {
            let next = Array.from(document.querySelector(".pages").querySelectorAll("a")).find(e => e.innerText === "下一页");
            next && next.click();
        }
    });
}

// @siteName     找法网
function match_findlaw() {
    console.log("AMQ matched 找法网");
    let matchStrList = [];
    let matchList = localStorage.getItem("matchList");
    if (matchList) {
        matchStrList = matchList.split("&");
    }
    let reloadMinute = parseFloat(localStorage.getItem("reloadMinute") || _findlaw_default.reloadMinute); // 自动刷新分钟数
    reloadMinute = isNaN(reloadMinute) ? parseFloat(_findlaw_default.reloadMinute) : reloadMinute;
    let audioSrc = localStorage.getItem("msgAudio") || _findlaw_default.msgAudio; // 新消息提示音
    let audio = new Audio(audioSrc);

    let audioReady, matchReady;
    let clickedHref = localStorage.getItem("clickedHref");
    if (clickedHref) {
        clickedHref = clickedHref.split("&");
    } else {
        clickedHref = [];
    }
    if (clickedHref.length > 1000) {
        clickedHref = clickedHref.slice(500);
        localStorage.setItem("clickedHref", clickedHref.join("&"));
    }
    let style = document.createElement("style");
    let css = `
        .area_rec {
            display: none;
        }
        body {
            background: #f1f1f1;
        }
        .container .matchedQuestion a {
            font-weight: 600;
            background-color: #fcc3c3;
            border-radius: 6px;
            padding: 5px 8px;
        }
        .messageDialog {
            position: fixed;
            right: 30px;
            bottom: 30px;
            padding: 20px 20px 0 35px;
            background: #fff;
            box-shadow: 0 0 12px #ccc;
            border-radius: 10px;
            z-index: 50;
            overflow: auto;
            max-height: calc(100vh - 60px);
            transition: width 600ms, opacity 400ms;
            width: 300px;
            box-sizing: border-box;
            min-height: 70px;
            /* opacity: 0.5; */
        }
        .messageDialog a {
            color: #000;
            font-size: 16px;
            padding: 3px 0;
        }
        .messageDialog * {
            font-family: "微软雅黑 Light";
            color: #aaa;
            font-size: 12px
        }
        .messageDialog .item {
            padding-bottom: 8px;
            border-bottom: #eee 1px solid;
            margin-bottom: 8px;
        }
        .messageDialog .item:last-child {
            border-bottom: none;
        }
        .messageDialog .nor {
            margin-left: 10px;
        }
        .messageDialog .answered {
            color: blue;
        }
        .messageDialog .matchedQuestion {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
        }
        .messageDialog .item {
            position: relative;
            z-index: 5;
            background-color: #fff;
        }
        .messageDialog .item:before {
            content: "";
            position: absolute;
            left: -14px;
            top: 8px;
            height: 8px;
            width: 8px;
            border-radius: 4px;
            background-color: #ddd;
        }
        .messageDialog:after {
            content: "没有匹配";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            text-align: center;
            font-size: 26px;
            line-height: 70px;
        }
        .onlyNewMsg .item {
            display: none;
        }
        body .messageDialog .newMsg {
            display: block;
        }
        body .messageDialog .newMsg:before {
            background-color: red;
        }
    `;
    style.setAttribute("id", "AMQStyle");
    style.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(style);
    document.documentElement.click();
    audio.click();
    audio.addEventListener("canplaythrough", () => {
        if (matchReady) {
            audio.play();
        } else {
            audioReady = true;
        }
    });

    let matchQuestion = function () {
        if (document.getElementsByClassName("wl_aside").length === 0) {
            setTimeout(matchQuestion, 50);
            return;
        }
        let messageDialog = document.createElement("div");
        messageDialog.className = localStorage.getItem("onlyNewMsg") ? "messageDialog onlyNewMsg" : "messageDialog";
        let questions = document.getElementsByClassName("wl_aside")[0].getElementsByClassName("c_nor_list");
        let maxWidth = 300;
        let hasNew = false;
        Array.from(questions).forEach(list => {
            Array.from(list.getElementsByClassName("tl")).forEach(question => {
                let text = question.innerText;
                if (matchStrList.findIndex(e => {
                    return text.indexOf(e) >= 0 && e !== "";
                }) >= 0) {
                    let link = question.querySelector("a");
                    maxWidth = Math.max(link.offsetWidth, maxWidth);
                    question.classList.add("matchedQuestion");
                    let id = question.querySelector("a").href.match(/_(\d+)\./)[1];
                    if (!clickedHref.includes(id)) {
                        hasNew = true;
                        link.setAttribute("mid", id);
                        question.parentNode.classList.add("newMsg");
                        question.parentNode.classList.add("m" + id);
                        link.addEventListener("click", clickLink);
                    }
                    let cN = question.parentNode.cloneNode(true);
                    let answer = cN.getElementsByClassName("label")[0];
                    let answerNum = answer.innerText.replace(/\D/g, "") - 0;
                    if (answerNum > 0) {
                        answer.classList.add("answered");
                    }
                    messageDialog.appendChild(cN);
                }
            });
        })
        if (messageDialog.childNodes.length === 0) {
            messageDialog.style.pointerEvents = "none";
        } else if (hasNew) {
            matchReady = true;
            if (audioReady) {
                audio.play();
            }
        }
        messageDialog.addEventListener("click", clickLink);
        document.getElementById("AMQStyle").innerHTML += `.messageDialog:hover { width: ${maxWidth + 60}px; opacity: 1; }`;
        document.getElementsByTagName("body")[0].appendChild(messageDialog);
    }

    let clickLink = function (ev) {
        let link = ev.target;
        if (link.tagName.toUpperCase() === "A") {
            let id = ev.target.href.match(/_(\d+)\./)[1];
            let str = localStorage.getItem("clickedHref") || "";
            localStorage.setItem("clickedHref", str + id + "&");
            document.querySelector(".messageDialog").querySelector(".m" + link.getAttribute("mid")).classList.remove("newMsg");
        }
    }

    matchQuestion();

    let autoReloadTimer = setTimeout(autoReload, 1000 * 60 * reloadMinute);
    document.addEventListener("mousemove", () => {
        clearTimeout(autoReloadTimer);
        autoReloadTimer = setTimeout(autoReload, 1000 * 60 * reloadMinute);
    });
}

// @siteName     找法网IP过滤：HTTP
function match_ipfilter() {
    console.log("AMQ matched 找法网IP过滤");
    let filterAudioSrc = localStorage.getItem("filterAudio") || "https://img.tukuppt.com/newpreview_music/09/00/60/5c89396f017e881994.mp3"; // 验证码提示音
    let filterAudio = new Audio(filterAudioSrc);
    filterAudio.click();
    document.getElementsByClassName("reg-input-W")[0].value = "8888";
    setTimeout(() => {
        document.getElementsByTagName("form")[0].submit();
    }, 3000);
    setTimeout(() => {
        filterAudio.click();
        filterAudio.play();
    }, 13000);
}

function autoReload() {
    window.location.reload();
}