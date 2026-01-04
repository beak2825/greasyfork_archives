// ==UserScript==
// @name         1212ACDACDACASD
// @namespace    -
// @version      4.3.0.7
// @description  12122ADCADCDACAD


// @include      https://mykirito.com/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification

// @noframes

// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415177/1212ACDACDACASD.user.js
// @updateURL https://update.greasyfork.org/scripts/415177/1212ACDACDACASD.meta.js
// ==/UserScript==

// Credit LianSheng

const cf偽裝機制 = "/reports";
const cf偽裝機制2 = "reports";

const doactionSel = localStorage.getItem("us_asText");
const challengeSel = localStorage.getItem("us_asText2");
const doactionCDSel = localStorage.getItem("us_asText3");
const challengeCDSel = localStorage.getItem("us_asText4");
const fdoactionCDSel = localStorage.getItem("us_asText5");
const fchallengeCDSel = localStorage.getItem("us_asText6");
const randomcountmin = localStorage.getItem("us_asText7");
const randomcountmax = localStorage.getItem("us_asText8");
const ffloorCDSel = localStorage.getItem("us_asText9");

//切磋: 2=友好切磋, 3=認真對決, 4=決一死戰, 5=我要超渡你
//行動: 1=狩獵兔肉, 2=自主訓練, 3=外出野餐, 4=汁妹, 5=做善事, 6=坐下休息, 7=釣魚, 8=修行1小時, 9=修行2小時, 10=修行4小時, 11=修行8小時
let type = GM_getValue("actionType");
var 汽水超胖 = type;
let type2 = GM_getValue("challengeType");
var 汽水胖 = type2;

//這個參數是偵測用不是自動領樓層獎勵
let type5 = GM_getValue("floorType");
if (type5 === "true") {
	var 汽水真的很胖 = true;
} else {
	汽水真的很胖 = false;
}
//true=有樓層獎勵 false=沒有樓層獎勵

//改CD用下面這個 單位是毫秒 也就是(秒*1000)
var 行動CD基礎 = doactionCDSel * 1000;
var 打人CD基礎 = challengeCDSel * 1000;


//設定為True時 偵測到驗證就會停止
let type6 = GM_getValue("autostopType");
if (type6 === "true") {
	var 有驗證停止動作 = true;
} else {
	有驗證停止動作 = false;
}
//樓上這個預計還會更新 目前是"有驗證那次還會動作後才停止" 之後預計會更新成"有驗證直接停止"


//設定為True時 將會停止自動"行動"  變成自動"領樓層獎勵"
let type3 = GM_getValue("aswitchType");
if (type3 === "true") {
	var 老子只想領樓層 = true;
} else {
	老子只想領樓層 = false;
}
var 樓層CD = ffloorCDSel * 1000;
//初次執行後(第一次CD 1秒) CD將會變更為1805秒(半小時一按)
//想設定幾秒嘗試按一次請去改683行的變數

var 該停囉行動 = doactionSel;
var 該停囉打架 = challengeSel;

//下面這行設定為true在驗證自動停止時會發送windows通知 true=開啟 false=關閉
let type7 = GM_getValue("notiswType");
if (type7 === "true") {
	var 汽水實力與體重成正比 = true;
} else {
	汽水實力與體重成正比 = false;
}
//下面這行設定為true通知就會自動消失 true=開啟 false=關閉
let type4 = GM_getValue("bswitchType");
if (type4 === "true") {
	var 汽水怎麼可以這麼胖 = true;
} else {
	汽水怎麼可以這麼胖 = false;
}

// 依據樓層獎勵是否已啟用定位行動所在Div
var 汽水肥 = 3;
if (汽水真的很胖) {
	汽水肥 = 4;
}

var 沒人需要的再按一次關閉功能 = 0;
var 停動作用 = false;
let URL = window.location.href;

let Running;
let CONTAINER_CLASSNAME = "sc-fzoyTs jZUSDr";
// 樓上是戰鬥報告的class name
// 樓下是行動記錄的class name
let CONTAINER_CLASSNAME2 = "sc-fznKkj fQkkzS";
var ConsoleCheck = 0;

var 行動CD = fdoactionCDSel * 1000;
var 打人CD = fchallengeCDSel * 1000;

var CaptchaVarChange = false;
var CaptchaVarChange1 = false;
var GotyouCaptcha;
var GotyouCaptcha2;

//產生min到max之間的亂數
function getRandom(min, max) {
	return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
}

let expireMsg = {};

let action = {
	1: "狩獵兔肉",
	2: "自主訓練",
	3: "外出野餐",
	4: "汁妹",
	5: "做善事",
	6: "坐下休息",
	7: "釣魚"
};
let challenge = {
	2: "友好切磋",
	3: "認真對決",
	4: "決一死戰",
	5: "我要超渡你",
};
let aswitch = {
	true: "開啟",
	false: "關閉"
};

// 訊息框，
function message(msg, expire = 5000) {
	let randomID = Math.random().toString(36).substr(2, 6);

	let block = `
        <div id="us_messageBlock" data-id="${randomID}">
            <div style="position: fixed; top: 4rem; right: 2rem; background-color: #FFFFFF; border-radius: 0.5rem; font-size: 1.2rem;border: 5px solid rgba(35,39,42,0.86); border-radius: 40px 40px 40px 40px;">
                <span>${msg}</span>
            </div>
        </div>
    `;

	document.querySelector("div#us_customSpace").innerHTML += block;
	expireMsg[randomID] = Date.now() + expire;
}



// format = "文字 {} 文字"
function countDown(format, times, period) {
	for (let i = times; i > 0; i--) {
		let msg = format.replace(/{}/g, times - i);
		message(msg, i * period);
	}
}

//儲存localstrong
function processFormData() {
	const us_asTextElement = document.getElementById("us_asText");
	const us_asText = us_asTextElement.value;
	const us_asText2Element = document.getElementById("us_asText2");
	const us_asText2 = us_asText2Element.value;
	const us_asText3Element = document.getElementById("us_asText3");
	const us_asText3 = us_asText3Element.value;
	const us_asText4Element = document.getElementById("us_asText4");
	const us_asText4 = us_asText4Element.value;
	const us_asText5Element = document.getElementById("us_asText5");
	const us_asText5 = us_asText5Element.value;
	const us_asText6Element = document.getElementById("us_asText6");
	const us_asText6 = us_asText6Element.value;
	const us_asText7Element = document.getElementById("us_asText7");
	const us_asText7 = us_asText7Element.value;
	const us_asText8Element = document.getElementById("us_asText8");
	const us_asText8 = us_asText8Element.value;
	const us_asText9Element = document.getElementById("us_asText9");
	const us_asText9 = us_asText9Element.value;
	localStorage.setItem("us_asText", us_asText);
	localStorage.setItem("us_asText2", us_asText2);
	localStorage.setItem("us_asText3", us_asText3);
	localStorage.setItem("us_asText4", us_asText4);
	localStorage.setItem("us_asText5", us_asText5);
	localStorage.setItem("us_asText6", us_asText6);
	localStorage.setItem("us_asText7", us_asText7);
	localStorage.setItem("us_asText8", us_asText8);
	localStorage.setItem("us_asText9", us_asText9);
	alert("行動" + localStorage.getItem("us_asText") + "次後自動停止" +
		"\n切磋" + localStorage.getItem("us_asText2") + "次後自動停止" +
		"\n目前行動CD基礎為" + localStorage.getItem("us_asText3") + "秒" +
		"\n目前打人CD基礎為" + localStorage.getItem("us_asText4") + "秒" +
		"\n第一次行動CD為" + localStorage.getItem("us_asText5") + "秒" +
		"\n第一次切磋CD為" + localStorage.getItem("us_asText6") + "秒" +
		"\n執行間隔最小隨機值" + localStorage.getItem("us_asText7") + "秒" +
		"\n執行間隔最大隨機值" + localStorage.getItem("us_asText8") + "秒" +
		"\n第一次自動領樓層CD為" + localStorage.getItem("us_asText9") + "秒"
	);
}

(async function() {
	document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);

	let navbar = document.querySelector("div#root > nav");
	let root = document.querySelector('div#root');
	let navbarHeight = navbar.offsetHeight;
	root.style.paddingTop = `calc(${navbarHeight}px + 18px)`; // height + margin bottom
	navbar.style.position = "fixed";
	navbar.style.top = "0";
	navbar.style.zIndex = '9999';
	let newtable = navbar.firstElementChild.cloneNode(true);
	newtable.removeAttribute("href");
	newtable.removeAttribute("aria-current");
	newtable.classList.remove("active");
	newtable.style.userSelect = "none";
	newtable.style.cursor = "pointer";
	newtable.innerText = "自動行動";
	//	navbar.insertBefore(newtable, navbar.lastChild);
	newtable.addEventListener("click", function() {
		if (沒人需要的再按一次關閉功能 == 0) {
			newtable.innerText = "你幹嘛阿阿阿阿";
			沒人需要的再按一次關閉功能++;
			console.log("已開始");
			RunIt();
		} else {
			clearInterval(Running);
			newtable.innerText = "自動行動";
			沒人需要的再按一次關閉功能 = 0;
			console.log("已自行停止");
			行動CD = 1000;
			打人CD = 1000;
			樓層CD = 1000;
		}
	});
	//	navbar.appendChild(navAction, newtable);
	navbar.appendChild(newtable);

	let url = "";
	setInterval(function() {
		url = location.href;



		if (url.includes(cf偽裝機制2)) {
			// 在自定義功能：行動設定
			if (document.querySelectorAll("div#us_actionSetting").length == 0) {
				let tableMore = "";
				let actionType = "";
				let challengeType = "";
				let aswitchType = "";
				let bswitchType = "";
				let cswitchType = "";
				let dswitchType = "";
				let floorType = "";
				let autostopType = "";
				let notiswType = "";
				let eswitchType = "";
				let fswitchType = "";
				let gswitchType = "";
				let hswitchType = "";
				let jswitchType = "";
				let kswitchType = "";
				let iswitchType = "";
				for (let [cmd, name] of Object.entries(action)) {
					let checked = "";
					if (GM_getValue("actionType") != undefined) {
						if (GM_getValue("actionType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					actionType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType" data-type="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(challenge)) {
					let checked = "";
					if (GM_getValue("challengeType") != undefined) {
						if (GM_getValue("challengeType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					challengeType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType2" data-type2="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(aswitch)) {
					let checked = "";
					if (GM_getValue("aswitchType") != undefined) {
						if (GM_getValue("aswitchType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					aswitchType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType3" data-type3="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(aswitch)) {
					let checked = "";
					if (GM_getValue("bswitchType") != undefined) {
						if (GM_getValue("bswitchType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					bswitchType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType4" data-type4="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(aswitch)) {
					let checked = "";
					if (GM_getValue("floorType") != undefined) {
						if (GM_getValue("floorType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					floorType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType5" data-type5="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(aswitch)) {
					let checked = "";
					if (GM_getValue("autostopType") != undefined) {
						if (GM_getValue("autostopType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					autostopType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType6" data-type6="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				for (let [cmd, name] of Object.entries(aswitch)) {
					let checked = "";
					if (GM_getValue("notiswType") != undefined) {
						if (GM_getValue("notiswType") == cmd) {
							checked = `checked="checked"`;
						}
					}
					notiswType += `
                            <label class="container">${name}
                                <input type="radio" ${checked} name="us_asType7" data-type7="${cmd}">
                                <span class="checkmark"></span>
                            </label>
                        `;
				}
				cswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText" id="us_asText" value=${doactionSel} placeholder="不知道怎麼填就填9999">
                            </label>
                        `;
				dswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText2" id="us_asText2" value=${challengeSel} placeholder="不知道怎麼填就填9999">
                            </label>
                        `;
				eswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText3" id="us_asText3" value=${doactionCDSel} placeholder="不知道怎麼填就填66">
                            </label>
                        `;
				fswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText4" id="us_asText4" value=${challengeCDSel} placeholder="不知道怎麼填就填173">
                            </label>
                        `;
				gswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText5" id="us_asText5" value=${fdoactionCDSel} placeholder="不知道怎麼填就填1">
                            </label>
                        `;
				hswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText6" id="us_asText6" value=${fchallengeCDSel} placeholder="不知道怎麼填就填1">
                            </label>
                        `;
				jswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText7" id="us_asText7" value=${randomcountmin} placeholder="不知道怎麼填就填3">
                            </label>
                        `;
				kswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText8" id="us_asText8" value=${randomcountmax} placeholder="不知道怎麼填就填10">
                            </label>
                        `;
				iswitchType += `
                            <label class="textcontainer"></label>
                               <input type="text" name="us_asText9" id="us_asText9" value=${ffloorCDSel} placeholder="不知道怎麼填就填1">
                               <input type='button' button id='submit' name='submit' value='儲存'>
                            </label>
                        `;
				tableMore = `
                        <tr>
                            <td>行動類型</td>
                            <td>${actionType}</td>
                        <tr>
                            <td>切磋類型</td>
                            <td>${challengeType}</td>
                        <tr>
                            <td>自動樓層(只領樓層)</td>
                            <td>${aswitchType}</td>
                        <tr>
                            <td>通知自動消失</td>
                            <td>${bswitchType}</td>
                        <tr>
                            <td>偵測按鈕位置(1f後請開啟)</td>
                            <td>${floorType}</td>
                        <tr>
                            <td>有驗證停止動作(建議開啟)</td>
                            <td>${autostopType}</td>
                        <tr>
                            <td>停止時通知</td>
                            <td>${notiswType}</td>
                        <tr>
                            <td>行動幾次後自動停止(建議9999)</td>
                            <td>${cswitchType}</td>
                        <tr>
                            <td>切磋幾次後自動停止(建議9999)</td>
                            <td>${dswitchType}</td>
                        <tr>
                            <td>行動CD基礎(建議66)</td>
                            <td>${eswitchType}</td>
                        <tr>
                            <td>打人CD基礎(建議173)</td>
                            <td>${fswitchType}</td>
                        <tr>
                            <td>第一次行動CD(建議1)</td>
                            <td>${gswitchType}</td>
                        <tr>
                            <td>第一次切磋CD(建議1)</td>
                            <td>${hswitchType}</td>
                        <tr>
                            <td>執行間隔最小隨機值(建議3)</td>
                            <td>${jswitchType}</td>
                        <tr>
                            <td>執行間隔最大隨機值(建議10)</td>
                            <td>${kswitchType}</td>
                        <tr>
                            <td>第一次自動領樓層CD(建議1)</td>
                            <td>${iswitchType}</td>
                        </tr>

                    `;
				let customRadio = `
                    /* The container */.container {  display: inline-block;  position: relative;  padding-left: 35px;  margin-bottom: 12px;  cursor: pointer;  font-size: 1rem;  -webkit-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none; width: 33%}/* Hide the browser's default radio button */.container input {  position: absolute;  opacity: 0;  cursor: pointer;}/* Create a custom radio button */.checkmark {  position: absolute;  top: 0;  left: 0;  height: 25px;  width: 25px;  background-color: #eee;  border-radius: 50%;}/* On mouse-over, add a grey background color */.container:hover input ~ .checkmark {  background-color: #ccc;}/* When the radio button is checked, add a blue background */.container input:checked ~ .checkmark {  background-color: #2196F3;}/* Create the indicator (the dot/circle - hidden when not checked) */.checkmark:after {  content: "";  position: absolute;  display: none;}/* Show the indicator (dot/circle) when checked */.container input:checked ~ .checkmark:after {  display: block;}/* Style the indicator (dot/circle) */.container .checkmark:after { 	top: 9px;	left: 9px;	width: 8px;	height: 8px;	border-radius: 50%;	background: white;}
                `;
				let setting = `
                    <div id="us_actionSetting" style="max-width: 760px; min-width: 400px; width: 92%; margin: 12px auto; padding-top: 3rem;">
                        <h3>行動設定</h3>
                        <p>第一次使用須將以下選項設定完之後請F5重整畫面才能使用 F12可以看到詳細運行流程。</p>
                        <hr>
                        <table style="width: 100%;">
                            <thead>
                                <th style="width: 40%;"></th>
                                <th style="width: 60%;"></th>
                            </thead>
                            <tbody>
                                ${tableMore}
                            </tbody>
                        </table>
                    </div>
                `;
				navbar.insertAdjacentHTML("afterend", setting);
				addStyle(customRadio, "div#us_actionSetting", "us_customRadio");
				document.getElementById("submit").addEventListener("click", function() {
					processFormData()
				});
				let actionRadio = document.querySelectorAll(`input[name="us_asType"]`);
				actionRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type = each.getAttribute("data-type");
						GM_setValue("actionType", type);
						message(`已將行動類型設定成【${action[each.getAttribute("data-type")]}】。`);
					});
				});
				let challengeRadio = document.querySelectorAll(`input[name="us_asType2"]`);
				challengeRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type2 = each.getAttribute("data-type2");
						GM_setValue("challengeType", type2);
						message(`已將切磋類型設定成【${challenge[each.getAttribute("data-type2")]}】。`);
					});
				});
				let aswitchRadio = document.querySelectorAll(`input[name="us_asType3"]`);
				aswitchRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type3 = each.getAttribute("data-type3");
						GM_setValue("aswitchType", type3);
						message(`已將自動領樓層設定成【${aswitch[each.getAttribute("data-type3")]}】。`);
					});
				});
				let bswitchRadio = document.querySelectorAll(`input[name="us_asType4"]`);
				bswitchRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type4 = each.getAttribute("data-type4");
						GM_setValue("bswitchType", type4);
						message(`已將通知自動消失設定為【${aswitch[each.getAttribute("data-type4")]}】。`);
					});
				});
				let floorRadio = document.querySelectorAll(`input[name="us_asType5"]`);
				floorRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type5 = each.getAttribute("data-type5");
						GM_setValue("floorType", type5);
						message(`已將偵測按鈕位置設定為【${aswitch[each.getAttribute("data-type5")]}】。`);
					});
				});
				let autostopRadio = document.querySelectorAll(`input[name="us_asType6"]`);
				autostopRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type6 = each.getAttribute("data-type6");
						GM_setValue("autostopType", type6);
						message(`已將有驗證停止動作設定為【${aswitch[each.getAttribute("data-type6")]}】。`);
					});
				});
				let notiswRadio = document.querySelectorAll(`input[name="us_asType7"]`);
				notiswRadio.forEach(function(each) {
					each.addEventListener("click", function() {
						let type7 = each.getAttribute("data-type7");
						GM_setValue("notiswType", type7);
						message(`已將停止時通知設定為【${aswitch[each.getAttribute("data-type7")]}】。`);
					});
				});
			}
		} else {
			if (document.querySelectorAll("div#us_actionSetting").length != 0) {
				document.querySelector("div#us_actionSetting").remove();
			}
		}
		// 訊息框自動刪除（詳見 message()）
		for (let [key, value] of Object.entries(expireMsg)) {
			if (Date.now() > value) {
				document.querySelector(`div#us_messageBlock[data-id="${key}"]`).remove();
				delete expireMsg[key];
			}
		}
	}, 100);

	function RunIt() {
		if (!停動作用) {
			if (URL == "https://mykirito.com/") {
				if (!老子只想領樓層) {
					console.log("此次行動CD : " + 行動CD / 1000 + "秒 目前已執行幾次：" + ConsoleCheck);
					clearInterval(Running);
					Running = setInterval(() => {
						urlCheck()
					}, 行動CD);
				} else {
					console.log("此次行動CD : " + 樓層CD / 1000 + "秒");
					clearInterval(Running);
					Running = setInterval(() => {
						urlCheck3()
					}, 樓層CD);
				}
			}

			// 用 Interval 是為了讓他就算吃到error還是會跑下一圈保持迴圈
			// 如果用timeout 或只跑function 正好按鈕不能按的時候(大部分時間都這樣)就會導致吃error停下來


			if (URL.indexOf("https://mykirito.com/profile/") >= 0) {
				console.log("此次打人CD : " + 打人CD / 1000 + "秒 目前已執行幾次：" + ConsoleCheck);
				clearInterval(Running);
				Running = setInterval(() => {
					urlCheck2()
				}, 打人CD);
			}
		} else {
			console.log("出現驗證問題 已停止");
			let msg = `<h5>出現驗證問題 已停止</h5>`;
			message(msg);
			if (汽水實力與體重成正比) {
				if (汽水怎麼可以這麼胖) {
					GM_notification({
						title: 'mykirito',
						text: '出現驗證問題 已停止',
						timeout: 5000
					});
				} else {
					GM_notification({
						title: 'mykirito',
						text: '出現驗證問題 已停止',
					});
				}
			}
			clearInterval(Running);
			newtable.innerText = "自動行動";
			沒人需要的再按一次關閉功能 = 0;
			行動CD = 1000;
			打人CD = 1000;
			樓層CD = 1000;
			停動作用 = false;
			ConsoleCheck--;
		}
	}

	function CheckText() {
		let ResultText = document.getElementsByClassName(CONTAINER_CLASSNAME)[0].childNodes[2];
		if ((ResultText.textContent.indexOf("轉生") >= 0) || (ResultText.textContent.indexOf("死亡") >= 0) || (ResultText.textContent.indexOf("驗證") >= 0)) {
			clearInterval(Running);
			newtable.innerText = "自動行動";
			console.log("偵測到已轉生或死亡或驗證出問題已停止");
			let msg = `<h5>偵測到已轉生或死亡或驗證出問題已停止</h5>`;
			message(msg);
			if (汽水實力與體重成正比) {
				if (汽水怎麼可以這麼胖) {
					GM_notification({
						title: 'mykirito',
						text: '偵測到已轉生或死亡或驗證出問題已停止',
						timeout: 5000
					});
				} else {
					GM_notification({
						title: 'mykirito',
						text: '偵測到已轉生或死亡或驗證出問題已停止',
					});
				}
			}
			沒人需要的再按一次關閉功能 = 0;
			行動CD = 1000;
			打人CD = 1000;
			樓層CD = 1000;
		}
	}

	function CheckText2() {
		let ResultText2 = document.getElementsByClassName(CONTAINER_CLASSNAME2)[0].childNodes[0];
		if ((ResultText2.textContent.indexOf("提升") >= 0)) {
			console.log("已升級 次數重計");
			ConsoleCheck = 0;
		}
		if ((ResultText2.textContent.indexOf("死亡") >= 0)) {
			console.log("你已經死啦 轉生去吧你");
			ConsoleCheck = 0;
			let msg = `<h5>你已經死了 已停止 請重新整理</h5>`;
			message(msg);
			if (汽水實力與體重成正比) {
				if (汽水怎麼可以這麼胖) {
					GM_notification({
						title: 'mykirito',
						text: '你已經死了 已停止 請重新整理',
						timeout: 5000
					});
				} else {
					GM_notification({
						title: 'mykirito',
						text: '你已經死了 已停止 請重新整理',
					});
				}
			}
			clearInterval(Running);
			newtable.innerText = "自動行動";
			沒人需要的再按一次關閉功能 = 0;
			行動CD = 1000;
			打人CD = 1000;
			樓層CD = 1000;
		}
		if ((ResultText2.textContent.indexOf("驗證") >= 0)) {
			console.log("出現驗證問題 已停止 請重新整理");
			let msg = `<h5>出現驗證問題 已停止 請重新整理</h5>`;
			message(msg);
			if (汽水實力與體重成正比) {
				if (汽水怎麼可以這麼胖) {
					GM_notification({
						title: 'mykirito',
						text: '出現驗證問題 已停止 請重新整理',
						timeout: 5000
					});
				} else {
					GM_notification({
						title: 'mykirito',
						text: '出現驗證問題 已停止 請重新整理',
					});
				}
			}
			clearInterval(Running);
			newtable.innerText = "自動行動";
			沒人需要的再按一次關閉功能 = 0;
			行動CD = 1000;
			打人CD = 1000;
			樓層CD = 1000;
		}
	}

	//行動用的驗證+5秒CD
	function CheckCaptcha() {
		GotyouCaptcha = document.querySelectorAll("body > div");
		if (GotyouCaptcha.length == 5) {
			行動CD = 行動CD + 5000;
		}
		if ((GotyouCaptcha.length < 5) && (CaptchaVarChange1 == true)) {
			CaptchaVarChange1 = false;
		}
		if ((GotyouCaptcha.length == 5) && (CaptchaVarChange1 == false)) {
			CaptchaVarChange1 = true;
			if (有驗證停止動作) {
				停動作用 = true;
			}
		}
	}

	//打架用的驗證檢測
	function CheckCaptcha2() {
		GotyouCaptcha2 = document.querySelectorAll("body > div");
		if ((GotyouCaptcha2.length < 5) && (CaptchaVarChange == true)) {
			汽水胖--;
			CaptchaVarChange = false;
			console.log("驗證的下一動 汽水胖已自動-1");
		}
		if ((GotyouCaptcha2.length == 5) && (CaptchaVarChange == false)) {
			console.log("有驗證 汽水胖已自動+1");
			汽水胖++;
			CaptchaVarChange = true;
			if (有驗證停止動作) {
				停動作用 = true;
			}
		}
		if ((GotyouCaptcha2.length == 5)) //只要有驗證就+5秒CD
		{
			打人CD = 打人CD + 5000; //+5秒的CD時間
		}
	}

	function urlCheck() {
		行動CD = 行動CD基礎 + getRandomInt(randomcountmin, randomcountmax);
		//行動CD = 行動CD基礎;
		CheckCaptcha();
		//                   console.log(ConsoleCheck);
		let msg = `<h5>執行網頁確認(行動)</h5>`;
		message(msg);
		var 汽水行動 = document.evaluate('//*[@id="root"]/div[1]/div[2]/div[' + 汽水肥 + ']/button[' + 汽水超胖 + ']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		汽水行動.singleNodeValue.click();
		if (汽水真的很胖) {
			汽水行動 = document.evaluate('//*[@id="root"]/div[1]/div[2]/div[' + 汽水肥 + ']/button[' + 汽水超胖 + ']', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			汽水行動.singleNodeValue.click();
		}
		ConsoleCheck++;
		if (ConsoleCheck == 該停囉行動) {
			停動作用 = true;
			console.log("目前已執行幾次：" + ConsoleCheck);
		}
		setTimeout(() => {
			CheckText2()
		}, 5000); //5秒後自動是否升等 重新計算行動次數
		RunIt();
	}
	function urlCheck2() {
		打人CD = 打人CD基礎 + getRandomInt(randomcountmin, randomcountmax);
		//打人CD = 打人CD基礎
		CheckCaptcha2();
		let msg = `<h5>執行網頁確認(切磋)</h5>`;
		var 汽水切磋 = document.evaluate('//*[@id="root"]/div/div[2]/div[2]/div/div['+汽水胖+']/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		//var 汽水切磋 = document.evaluate('//*[@id="root"]/div[1]/div[2]/div[2]/div[2]/div[' + 汽水胖 + ']/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		汽水切磋.singleNodeValue.click();
		ConsoleCheck++;
		if (ConsoleCheck == 該停囉打架) {
			停動作用 = true;
			console.log("目前已執行幾次：" + ConsoleCheck);
		}
		setTimeout(() => {
			CheckText()
		}, 5000); //5秒後自動確認戰鬥報告是否已死亡或轉生
		RunIt();
	}

	function urlCheck3() {
		let msg = `<h5>執行網頁確認(領取樓層)</h5>`;
		樓層CD = 1805000;
		var 汽水行動 = document.evaluate('//*[@id="root"]/div[1]/div[2]/div[3]/button[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		汽水行動.singleNodeValue.click();
		RunIt();
	}
})();