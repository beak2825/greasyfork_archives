// ==UserScript==
// @name         BossWorkHelper
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      15
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
// @siteName     找法网律师个人主页
// @match        https://user.findlaw.cn/consultMe*
// @siteName     找法网IP过滤
// @match        http://ipfilter.lsurl.cn/ipfilter/*
// @match        https://ipfilter.lsurl.cn/ipfilter/*
// @downloadURL https://update.greasyfork.org/scripts/442257/BossWorkHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/442257/BossWorkHelper.meta.js
// ==/UserScript==
// noinspection JSAnnotator


let _110_default = {
	reloadMinute: 1,
	msgAudio: "https://img.tukuppt.com/newpreview_music/00/14/69/5e5cca585eb5b3956.mp3"
};
let _findlaw_default = {
	reloadMinute: 2,
	msgAudio: "https://img.tukuppt.com/newpreview_music/09/00/63/5c893cf044bde33914.mp3"
};
let _lawyer_default = {
    reloadMinute: 5,
    msgAudio: "https://img.tukuppt.com/newpreview_music/09/00/63/5c893cf044bde33914.mp3"
};
let secondToReloadTimer;
let secondToReload;
let secondToReloadDiv;

(function () {
	'use strict';
	let locationPathName = window.location.hostname;
	let matchList = [{
		path: "110",
		method: match_110,
		default: _110_default
	},
    {
        path: "china.findlaw.cn",
        method: match_findlaw,
        default: _findlaw_default
    },
    {
        path: "ipfilter",
        method: match_ipfilter,
        noSet: true
    },
    {
        path: "user.findlaw.cn",
        method: match_lawyer,
        default: _lawyer_default
    }];
	let whichSite = matchList.find(e => locationPathName.includes(e.path));
	if (whichSite) {
		whichSite.method();
        whichSite.default && optionSetting(whichSite.default);
	}
})();

function timeoutReload(defaultOption) {
    clearInterval(secondToReloadTimer);
    const minute = window.localStorage.getItem("reloadMinute") || defaultOption.reloadMinute;
    const originSecond = (isNaN(minute) ? 1 : minute) * 60;
    let secondToReload = originSecond;
    secondToReloadTimer = setInterval(() => {
        secondToReloadDiv.innerText = secondToReload--;
        if (secondToReload <= 0) {
            autoReload();
        }
    }, 1000);
    const timeoutOnMove = function() {
        secondToReload = originSecond;
    }
    document.removeEventListener("mousemove", timeoutOnMove);
    document.addEventListener("mousemove", timeoutOnMove);
}

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
        color: #409eff;
    }
    .AMQSetting {
        position: fixed;
        z-index: 60;
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
        width: 600px;
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
        width: 600px;
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
    .secondToReload {
        position: fixed;
        bottom: 10px;
        left: 50px;
        font-size: 12px;
        color: rgba(200, 200, 200, 0.6);
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
        <div class="AMQSettings"><span id="showReportList">匹配回复列表：</span><input type="text" id="AMQSettingsInput_matchReportKey" class="AMQSettingsForm AMQSettingsInput" placeholder="多个用@隔开 例如 吃饭@喝水" style="width: 185px;" />
            <input type="text" id="AMQSettingsInput_matchReportValue" class="AMQSettingsForm AMQSettingsInput" placeholder="回复内容" style="margin-left: 6px;width: 400px;" />
        </div>
        <div class="matchReportBox"></div>
        <div class="AMQSettings">自动刷新分钟：<input type="text" id="AMQSettingsInput_reloadMinute" class="AMQSettingsForm AMQSettingsInput" placeholder="默认：${defaultOption.reloadMinute} 分钟" /></div>
        <div class="AMQSettings">新消息通知音：<input type="text" id="AMQSettingsInput_msgAudio" class="AMQSettingsForm AMQSettingsInput" placeholder="默认：${defaultOption.msgAudio}" /></div>
        <div class="AMQSettings">只显示新消息：<input type="checkbox" id="AMQSettingsInput_onlyNewMsg" class="AMQSettingsForm AMQSettingsCheck" /></div>
        <div type="button" class="saveSetting">保　存</div>
    `;
    // 时间提示
    secondToReloadDiv = document.createElement("div");
    secondToReloadDiv.setAttribute("class", "secondToReload");
    document.getElementsByTagName("body")[0].appendChild(secondToReloadDiv);
    
	let matchFields = document.createElement("div");
	matchFields.classList.add("matchFields");
	matchFields.addEventListener("click", e => {
		if (e.target.className === "matchField") {
			if (window.confirm("删除 - " + e.target.innerText)) {
				e.target.parentNode.removeChild(e.target);
			}
		}
	});
	setting.querySelector(".matchFieldsBox").appendChild(matchFields);

	let matchReports = document.createElement("div");
	matchReports.classList.add("matchFields");
	matchReports.addEventListener("click", e => {
		if (e.target.className === "matchField") {
			if (window.confirm("删除 - " + e.target.innerText)) {
				e.target.parentNode.removeChild(e.target);
			}
		}
	});
	setting.querySelector("#showReportList").addEventListener("click", e => {
		let matchReportStr = "";
		Array.from(matchReports.querySelectorAll(".matchField")).forEach(e => {
			matchReportStr += e.innerText + "\n" + e.getAttribute("title") + "\n\n";
		});
		alert(matchReportStr);
	});
	setting.querySelector(".matchReportBox").appendChild(matchReports);

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

	let matchReportStrList = [];
	let matchReportList = localStorage.getItem("matchReportList");
	if (matchReportList) {
		matchReportStrList = matchReportList.split("&&&");
	}
	let matchReportsHTML = "";
	matchReportStrList.forEach(e => {
		if (e) {
			const report = e.split("###");
			matchReportsHTML += `<div class="matchField" title="${report[1]}">${report[0]}</div>`;
		}
	});
	matchReports.innerHTML = matchReportsHTML;
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
	let reportKey = setting.querySelector("#AMQSettingsInput_matchReportKey");
	let reportValue = setting.querySelector("#AMQSettingsInput_matchReportValue");
	const reportFun = function(e) {
		if (e.keyCode === 13) {
			let k = reportKey.value.replace(/\s/g, "");
			let v = reportValue.value.replace(/\s/g, "");
			if (k && v) {
				reportKey.value = "";
				reportValue.value = "";
				let newField = document.createElement("div");
				newField.classList.add("matchField");
				newField.innerText = k;
				newField.setAttribute("title", v);
				matchReports.appendChild(newField);
			}
		}
	}
	reportKey.addEventListener("keyup", reportFun);
	reportValue.addEventListener("keyup", reportFun);

	let saveSetting = setting.querySelector(".saveSetting");
	saveSetting.addEventListener("click", e => {
		let matchListStr = "";
		Array.from(matchFields.querySelectorAll(".matchField")).forEach(e => {
			matchListStr += e.innerText + "&";
		});
		window.localStorage.setItem("matchList", matchListStr);
		let matchReportStr = "";
		Array.from(matchReports.querySelectorAll(".matchField")).forEach(e => {
			matchReportStr += e.innerText + "###" + e.getAttribute("title") + "&&&";
		});
		window.localStorage.setItem("matchReportList", matchReportStr);
		let AMQSettingsInput_reloadMinute_V = AMQSettingsInput_reloadMinute.value;
		let AMQSettingsInput_msgAudio_V = AMQSettingsInput_msgAudio.value;
		if (AMQSettingsInput_reloadMinute_V) {
			window.localStorage.setItem("reloadMinute", Math.max(parseFloat(AMQSettingsInput_reloadMinute_V), 0.1));
		} else {
            window.localStorage.removeItem("reloadMinute");
        }
		if (AMQSettingsInput_msgAudio_V) {
			window.localStorage.setItem("msgAudio", AMQSettingsInput_msgAudio_V);
        } else {
            window.localStorage.removeItem("msgAudio");
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
    timeoutReload(defaultOption);
	document.body.appendChild(settingIcon);
	document.body.appendChild(setting);
}

// @siteName     找法网个人主页
function match_lawyer() {
    console.log("AMQ matched 找法网个人主页");
}

// @siteName     110法律咨询
function match_110() {
	console.log("AMQ matched 110法律咨询");
	let matchStrList = [];
	let matchList = localStorage.getItem("matchList");
	if (matchList) {
		matchStrList = matchList.split("&");
	}
	let matchReportStrList = [];
	let matchReportList = localStorage.getItem("matchReportList");
	if (matchReportList) {
		matchReportStrList = matchReportList.split("&&&").map(e => {
			const f = e.split("###");
			return {
				keys: f[0].split("@"),
				value: f[1]
			}
		});
		matchReportStrList = matchReportStrList.sort((a, b) => b.keys.length - a.keys.length);
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
            font-size: 17px !important;
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
            padding-bottom: 5px;
            width: 25%;
        }
        .t_phone td {
            padding-bottom: 15px;
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
            background-color: #5f9bd9;
            border-color: #5f9bd9;
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
            opacity: 0.6;
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
        .queIframe {
            position: fixed;
            top: -300px;
            left: -300px;
            height: 200px;
            width: 200px;
        }
        .iconF {
            padding-right: 8px;
        }
        .phoneImg img {
            height: 36px;
            margin-top: 5px;
        }
        #showReportList {
            cursor: pointer;
            user-select: none;
        }
        .quequeToggle {
            position: fixed;
            z-index: 50;
            left: 50px;
            bottom: 150px;
            height: 70px;
            width: 70px;
            font-size: 60px;
            line-height: 100px;
            text-align: center;
            cursor: pointer;
            color: #ccc;
            transition: color 200ms;
        }
        .quequeToggle:hover {
            color: #409eff;
        }
        html body {
            background-color: #333333;
        }
        .headermenu,
        .headershoepath,
        .header_nav,
        .showpath {
            display: none;
        }
        .leftbox01, .main .right {
            display: none;
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

	let queue = [];
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
							tbodyClass += " readed";
						}
						let reply = question.querySelector(".lan").innerText;
						let title = link.innerText.slice(0, 32);
						queue.push({
							id: id,
							href: link.getAttribute('href')
						});
						messageConHTML +=
							`<tbody class="${tbodyClass}" data-href="${link.getAttribute('href')}"><tr class="t_title">
                            <td colspan="4">
                                <a _href="${link.getAttribute('href')}" target="_blank"><span class="iconF">❔</span>${title}</a>
                            </td>
                            <td style="width: 0;opacity: 1;">
                                <div class="detailTitle">${link.innerText}</div>
                            </td>
                        </tr>
                        <tr class="t_info">
                            <td><span class="iconF">🎄️</span>${question.querySelector(".hui").innerText}</td>
                            <td><span class="iconF">🎙️</span>${question.querySelector(".g03").innerText} 人回复</td>
                            <td><span class="iconF">💬</span>${reply === "回复咨询" ? "" : reply}</td>
                            <td><span class="iconF">⏰</span>${question.querySelector(".g05s").innerText}</td>
                            <td style="width: 0;"></td>
                        </tr>
                        <tr class="t_phone">
                            <td colspan="5" id="Phone_${id}" class="phoneImg">
                                <span class="iconF">📞️</span><span>正在获取中</span>
                            </td>
                        </tr>
                        </tbody>`;
					}
				}
			}
		})
		if (messageConHTML === "") {
			messageCon.style.pointerEvents = "none";
			messageCon.querySelector(".matchTable").innerHTML = "<div class='noMsg'>☕<span>饮杯茶先</span></div>";
		} else {
			messageCon.querySelector(".matchTable").innerHTML = messageConHTML;
			messageCon.addEventListener("click", clickLink);
			if (messageCon.querySelectorAll("tbody").length !== messageCon.querySelectorAll(".readed").length) {
				matchReady = true;
				if (audioReady) {
					audio.play();
				}
			}
		}
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
	// queque toggle
	const autoQueque = localStorage.getItem("autoQueque");
	const quequeToggle = document.createElement("div");
	quequeToggle.classList.add("quequeToggle");
	quequeToggle.setAttribute("title", `自动回复开关 当前：${autoQueque === "on" ? "打开" : "关闭"}`);
	if (autoQueque === "on") {
		quequeToggle.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs">' +
			'<polyline points="9 11 12 14 22 4"></polyline>' +
			'<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>' +
			'</svg>';
	} else {
		quequeToggle.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="arcs">' +
			'<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>'
	}
	quequeToggle.onclick = function() {
		localStorage.setItem("autoQueque", autoQueque === "on" ? "off" : "on");
		autoReload();
	}
	document.body.appendChild(quequeToggle);

	// queue
	// let curMission;
	// const iframe = document.createElement("iframe");
	// let waitGetPhone = null;
	// let waitGetPhoneMax = null;
	// iframe.classList.add("queIframe");
	// iframe.onload = function() {
	// 	let phoneLink = iframe.contentWindow.document.getElementById("checkm");
	// 	const title = iframe.contentWindow.document.getElementsByClassName("wenz")[0].innerText;
	// 	const title2 = iframe.contentWindow.document.getElementsByClassName("xwz")[0].innerText;
	// 	if (phoneLink) {
	// 		phoneLink.click();
	// 		waitGetPhoneMax = setTimeout(() => {
	// 			document.getElementById("Phone_" + curMission.id).innerHTML = "<span class='iconF'>📞️</span><span style='color: red;'>获取超时请手动获取</span>";
	// 			clearInterval(waitGetPhone);
	// 			startQueue();
	// 		}, 5000);
	// 		waitGetPhone = setInterval(function() {
	// 			let img = phoneLink.querySelector("img");
	// 			if (img) {
	// 				let phonelist = localStorage.getItem("phonelist") || "";
	// 				const imgData = img.getAttribute("src");
	// 				localStorage.setItem("phonelist", phonelist + curMission.id + "@@@" + imgData + "&&&");
	// 				const phoneImg = document.createElement("img");
	// 				phoneImg.setAttribute("src", imgData);
	// 				document.getElementById("Phone_" + curMission.id).innerHTML = "";
	// 				document.getElementById("Phone_" + curMission.id).appendChild(phoneImg);
	// 				clearTimeout(waitGetPhoneMax);
	// 				clearInterval(waitGetPhone);
	// 				startQueue();
	// 			}
	// 		}, 500);
	// 	} else if (title2.includes("此问题为微信咨询")) {
	// 		document.getElementById("Phone_" + curMission.id).innerHTML = "<span class='iconF'>📞️</span><span style='color: blue;'>微信咨询</span>";
	// 		startQueue();
	// 	} else {
	// 		let answer = null;
	// 		for (let i = 0;i < matchReportStrList.length;i++) {
	// 			if (matchReportStrList[i].keys.every(e => title.includes(e))) {
	// 				answer = matchReportStrList[i].value;
	// 				break;
	// 			}
	// 		}
	// 		if (answer) {
	// 			setTimeout(() => {
	// 				autoReload();
	// 			}, 5000);
	// 			iframe.contentWindow.document.getElementsByClassName("bdys")[0].value = answer;
	// 			iframe.contentWindow.document.getElementsByClassName("tjda")[0].getElementsByTagName("input")[0].click();
	// 		} else {
	// 			document.getElementById("Phone_" + curMission.id).innerHTML = "<span class='iconF'>📞️</span><span style='color: blue;'>没有匹配的回复语句</span>";
	// 			startQueue();
	// 		}
	// 	}
	// }
	let phonelistTemp = {};
	let phoneTempList = (localStorage.getItem("phonelist") || "").split("&&&");
	phoneTempList.forEach(e => {
		const item = e.split("@@@");
		phonelistTemp["Phone_" + item[0]] = item[1];
	});
	if (phoneTempList.length > 50) {
		phoneTempList.splice(0, 40);
		localStorage.setItem("phonelist", phoneTempList.join("&&&"));
	}
	// function startQueue() {
	// 	if (autoQueque === "on" && !document.querySelector(".headerloginbtn") && queue.length > 0) {
	// 		curMission = queue.splice(0, 1)[0];
	// 		const imgData = phonelistTemp["Phone_" + curMission.id]
	// 		if (imgData) {
	// 			let img = document.createElement("img");
	// 			img.src = imgData;
	// 			document.getElementById("Phone_" + curMission.id).innerHTML = "";
	// 			document.getElementById("Phone_" + curMission.id).appendChild(img);
	// 			startQueue();
	// 		} else {
	// 			iframe.src = window.origin + curMission.href;
	// 		}
	// 	} else {
	// 		iframe.remove();
	// 	}
	// }
	// startQueue();
	// document.body.append(iframe);
    
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
        body {
            background: #f1f1f1;
        }
        .container .matchedQuestion a {
            font-weight: 600;
            background-color: #ffe2e2;
            border-radius: 6px;
            padding: 3px 8px;
        }
        .messageDialog {
            position: fixed;
            right: 30px;
            bottom: 30px;
            padding: 15px;
            background: #fff;
            box-shadow: 0 0 12px #ccc;
            border-radius: 10px;
            z-index: 50;
            overflow: auto;
            max-height: calc(100vh - 60px);
            transition: width 300ms;
            width: 300px;
            box-sizing: border-box;
            min-height: 70px;
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
            padding: 10px;
            border-bottom: #eee 1px solid;
            cursor: pointer;
        }
        .messageDialog .item:last-child {
            border-bottom: none;
        }
        .messageDialog .nor {
            margin-left: 10px;
        }
        div.messageDialog .answered {
            /* color: blue; */
        }
        .messageDialog .matchedQuestion {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
        }
        .messageDialog .matchedQuestion:hover {
            background-color: #f1f1f1;
        }
        .messageDialog .item {
            position: relative;
            z-index: 5;
            background-color: #fff;
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
        body div.messageDialog .newMsg {
            display: block;
        }
        body .messageDialog .newMsg a {
            position: relative;
            padding-left: 1.5em;
        }
        body .messageDialog .newMsg a:before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0.25em;
            width: 0.7em;
            height: 0.7em;
            border-radius: 0.35em;
            background-color: #00cc0d;
            transform: translateY(-50%);
        }
        #wlcommonbot, .askCrad, .lyCard, .area_rec, .footer-main, #backToTop {
            display: none;
        }
        ul.consult-list .item {
            padding: 15px 0;
            border-bottom: 1px solid #eee !important;
        }
        ul.consult-list .item .tag-list {
            margin-top: 5px;
        }
        .messageDialog .tag-list {
            pointer-events: none;
        }
        .messageDialog .tag-msg {
            /* color: red; */
        }
        .messageDialog .tag-list .tag {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            margin-right: 10px;
            padding-left: 24px;
            position: relative;
        }
        .messageDialog .tag-list .tag:before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            left: 0;
            top: 0;
        }
        .messageDialog .tag-list .tag_time:before {
            background-image: url(https://pic1.findlawimg.com/images/v3/pc/common/list-sprite.png);
            background-position: 0 -22.5px;
            background-size: 61px;
            width: 20px;
            height: 20px;
        }
        .messageDialog .tag-list .tag-eye:before {
            background-image: url(https://pic1.findlawimg.com/images/v3/pc/common/list-sprite.png);
            background-position: 0 0;
            background-size: 61px;
            width: 20px;
            height: 20px;
        }
        .messageDialog .tag-list .tag-msg:before {
            background-image: url(https://pic1.findlawimg.com/images/v3/pc/common/list-sprite.png);
            background-position: -22.5px 0;
            background-size: 61px;
            width: 20px;
            height: 20px;
        }
        div.side-menu-main {
            right: auto;
            left: 60px;
            margin-right: 0;
        }
        div.side-screen-box::after {
            display: none;
        }
        div.side-menu-screen {
            right: auto;
            left: 65px;
        }
        #consultSwiper {
            height: auto !important;
        }
        #consultSwiper .swiper-wrapper {
            width: auto !important;
        }
        #consultSwiper + .consult-pagination {
            display: none;
        }
        .subject-main, body {
            background: #333333 !important;
        }
        .subject-right, .navigation-main {
            display: none;
        }
        .logo-bar {
            opacity: 0;
            pointer-events: none;
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
		const con = document.getElementById("consultSwiper");
		if (!con) {
			return setTimeout(matchQuestion, 50);
		}
		let messageDialog = document.createElement("div");
		messageDialog.className = localStorage.getItem("onlyNewMsg") ? "messageDialog onlyNewMsg" : "messageDialog";
		let questions = con.querySelectorAll(".item");
		let maxWidth = 300;
		let hasNew = false;
		Array.from(questions).forEach(question => {
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
					question.classList.add("newMsg");
					question.classList.add("m" + id);
					link.addEventListener("click", clickLink);
				}
				let cN = question.cloneNode(true);
				let answer = cN.getElementsByClassName("tag-msg")[0];
				let answerNum = answer.innerText.replace(/\D/g, "") - 0;
				if (answerNum > 0) {
					answer.classList.add("answered");
				}
				messageDialog.appendChild(cN);
			}
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
		messageDialog.addEventListener("mouseleave", () => {
			messageDialog.removeAttribute("style");
		});
		messageDialog.style.width = `${maxWidth + 60}px`;
		document.getElementById("AMQStyle").innerHTML += `.messageDialog:hover { width: ${maxWidth + 60}px; opacity: 1; }`;
		document.getElementsByTagName("body")[0].appendChild(messageDialog);
	}

	let clickLink = function (ev) {
		let link = ev.target;
		if (link.classList.contains("matchedQuestion")) {
			const a = link.querySelector("a");
			a.click();
			clickLink({
				target: a
			});
		}
		if (link.tagName.toUpperCase() === "A") {
			let id = ev.target.href.match(/_(\d+)\./)[1];
			let str = localStorage.getItem("clickedHref") || "";
			localStorage.setItem("clickedHref", str + id + "&");
			document.querySelector(".messageDialog").querySelector(".m" + link.getAttribute("mid")).classList.remove("newMsg");
		}
	}

	matchQuestion();
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
