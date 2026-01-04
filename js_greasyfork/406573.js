// ==UserScript==
// @name         MyKirito Helper Unofficial version for 08
// @version      0.3.5.6
// @description  可以看到 MyKirito 額外資訊
// @author       EWAVE#7445 & ganmaRRRRR
// @namespace
// @match        https://mykirito.com/*
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @resource     online_data https://pastebin.com/raw/ENjQzrAs
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/591565
// @downloadURL https://update.greasyfork.org/scripts/406573/MyKirito%20Helper%20Unofficial%20version%20for%2008.user.js
// @updateURL https://update.greasyfork.org/scripts/406573/MyKirito%20Helper%20Unofficial%20version%20for%2008.meta.js
// ==/UserScript==

let pkWinBase = [40, 55, 100, 120];
let pkWinMul = [3.334, 4.5, 8.5, 10];
let pkLoseBase = [25, 35, 70, 70];
let actTable = ["15~19", "15", "13~19", "18", "18", "15", "15", "500", "1000", "2000", "4000"];
let expTable = [0, 30, 60, 100, 150, 200, 250, 300, 370, 450, 500, 650, 800, 950, 1200, 1450, 1700, 1950, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4400, 4800, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9100, 9700, 10300, 11000, 11800, 12600, 13500, 14400, 15300, 16200, 17100, 18000, 19000, 20000, 21000, 23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 44000, 47000, 50000, 53000, 56000, 59000, 62000, 65000, 68000, 71000, 0];
const rattrCSS = ".fYZyZu {color: #00b5b5;}";
const buttonAniCSS = ".tippy-box[data-animation=shift-away-subtle][data-state=hidden]{opacity:0}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=top]{transform:translateY(5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=bottom]{transform:translateY(-5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=left]{transform:translateX(5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=right]{transform:translateX(-5px)}";

//config
var helperConfig = GM_getValue('MyKiritoHelper', { 'yuukiMod': false, 'lisbethMod': false, 'deadMod': false, 'backgroundMOD': false, 'scrolllistMOD':true, 'delay': 300, });
var inited = false;
var myK;
var otherK;

var floorBtn = [];
var actBtns = [];
var actToLvUp = [];
var pkBtns = [];
var nextTimetip = [];

//TEST

var 友記縮圖 = "https://i.imgur.com/VJyzROs.png"
//以下是通緝能調整的東西
var 發送名稱 = "通緝發送"
var 通緝頭貼 = "https://i.imgur.com/8QowXWD.jpg"

var 友記全身圖 = "https://i.imgur.com/VWNyCjk.png"

var 死亡圖片 = "https://i.imgur.com/9GBle3E.png"

var 背景圖片網址 = "https://i.imgur.com/SgHg5SJ.jpg";

var 背景圖片上面的漸層顏色 = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

var 擴充CSS = ``;


function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
	if (typeof waitOnce === "undefined") {
		waitOnce = true;
	}
	if (typeof interval === "undefined") {
		interval = 300;
	}
	if (typeof maxIntervals === "undefined") {
		maxIntervals = -1;
	}
	var targetNodes = (typeof selectorOrFunction === "function")
			? selectorOrFunction()
			: document.querySelectorAll(selectorOrFunction);

	var targetsFound = targetNodes && targetNodes.length > 0;
	if (targetsFound) {
		targetNodes.forEach(function(targetNode) {
			var attrAlreadyFound = "data-userscript-alreadyFound";
			var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
			if (!alreadyFound) {
				var cancelFound = callback(targetNode);
				if (cancelFound) {
					targetsFound = false;
				}
				else {
					targetNode.setAttribute(attrAlreadyFound, true);
				}
			}
		});
	}

	if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
		maxIntervals -= 1;
		setTimeout(function() {
			waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
		}, interval);
	}
}

//TEST

(async function() {
    'use strict';

    // 抓Ajax Event
    function ajaxEventTrigger(event) {
        let ajaxEvent = new CustomEvent(event, { detail: this });
        unsafeWindow.dispatchEvent(ajaxEvent);
    }
    let oldXHR = unsafeWindow.XMLHttpRequest;
    function newXHR() {
        let realXHR = new oldXHR();
        // this指向window
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }
    unsafeWindow.XMLHttpRequest = newXHR;
    unsafeWindow.addEventListener('ajaxReadyStateChange', function (e) {
        // 處理成功的request
        if (e.detail.readyState === oldXHR.DONE && e.detail.status === 200) {
            ajaxEventHandler(new URL(e.detail.responseURL), e.detail.response);
        }
    });

    // 抓fetch event
    let nativeFetch = unsafeWindow.fetch; // must be on the global scope
    unsafeWindow.fetch = function(...args) {
        let promise = nativeFetch(...args);
        promise.then((r) => {
            // 處理成功的request
            return (r.url.match('report') && r.ok) ? r.clone().json() : false; })
            .then((j) => {
            if (j) { reportThree(j); } });
        return promise;
    }

    waitForKeyElements("div#root > nav", init);
})();

function ajaxEventHandler(url, response) {
    if (url.pathname.split("/")[1] === 'cdn-cgi') { return; }
    let page = location.pathname.split("/")[1];
    if (url.href === "https://mykirito.com/api/my-kirito") {
        myK = JSON.parse(response);
    }
    switch (page) {
        case "":// 我的桐人
            myKirito(url, JSON.parse(response));
            break;
        case "profile": // 別的桐人
            otherKirito(url, JSON.parse(response));
            break;
    }
}

function init() {
    // Navbar置頂 (from https://greasyfork.org/zh-TW/scripts/404006-kirito-tools)
    let root = document.querySelector("div#root");
    let navbar = document.querySelector("div#root > nav");
    let navbarHeight = navbar.offsetHeight;
    root.style.paddingTop = `calc(${navbarHeight}px + 18px)`; // height + margin bottom
    navbar.style.position = "fixed";
    navbar.style.top = "0";

    // 加上選單按鈕
    let bosss = document.createElement("LINK");
    bosss.className = "sc-fzqAui eoGDzK";
    bosss.innerText = "攻略網";
    navbar.insertBefore(bosss, navbar.lastChild);
    bosss.addEventListener("click", function() {
        var redirectWindow = window.open('https://mykirito.nctu.me/', '_blank');
        redirectWindow.location;
    })
    let button = document.createElement("a");
    button.className = "sc-fzqAui eoGDzK";
    button.innerHTML = '<svg style="filter: invert(1);" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126"/></svg>';
    button.id = "mykirito_helper";
    navbar.insertBefore(button, navbar.lastChild);
    tippy(button, {
        content: `<div style="text-align: center;">MOD選單</div>`+
        `<p><label><input type="checkbox" id="yuuki_mod" ${(helperConfig.yuukiMod)?"checked":""}> 友記切換</label></p>`+
        `<p><label><input type="checkbox" id="lisbeth_mod" ${(helperConfig.lisbethMod)?"checked":""}> 抓到你囉經驗包</label></p>`+
        `<p><label><input type="checkbox" id="dead_mod" ${(helperConfig.deadMod)?"checked":""}> 鯊魚上香</label></p>`+
        `<p><label><input type="checkbox" id="background_mod" ${(helperConfig.backgroundMOD)?"checked":""}> 背景圖片(跟其他MOD一起開會卡)</label></p>`+
        `<p><label><input type="checkbox" id="scrolllist_mod" ${(helperConfig.scrolllistMOD)?"checked":""}> 玩家選單滑動(測試)</label></p>`+
        `<input type="range" id="delay" min="100" max="5000" step="100" value=${helperConfig.delay}><p id="show_delay" style="display: inline;"> ${helperConfig.delay}</p>`+
        `ms Delay<p>有問題請嘗試調大此值</p><p style="text-align: right;"><a href="https://greasyfork.org/zh-TW/scripts/405599-mykirito-helper/feedback" target="_blank" style="color: aqua;">回報問題</a></p>`,
        allowHTML: true,
        interactive: true,
        arrow: false,
        trigger: 'mouseenter focus click',
        placement: 'bottom',
        onShown() {
            if (!inited){
                document.getElementById("show_delay").innerHTML = ` ${document.getElementById("delay").value}`;
                document.getElementById("yuuki_mod").addEventListener('input', () => { (document.getElementById("yuuki_mod").checked) ? helperConfig.yuukiMod = true : helperConfig.yuukiMod = false; });
                document.getElementById("lisbeth_mod").addEventListener('input', () => { (document.getElementById("lisbeth_mod").checked) ? helperConfig.lisbethMod = true : helperConfig.lisbethMod = false; });
                document.getElementById("dead_mod").addEventListener('input', () => { (document.getElementById("dead_mod").checked) ? helperConfig.deadMod = true : helperConfig.deadMod = false; });
                document.getElementById("background_mod").addEventListener('input', () => { (document.getElementById("background_mod").checked) ? helperConfig.backgroundMOD = true : helperConfig.backgroundMOD = false; });
                document.getElementById("scrolllist_mod").addEventListener('input', () => { (document.getElementById("scrolllist_mod").checked) ? helperConfig.scrolllistMOD = true : helperConfig.scrolllistMOD = false; });
                document.getElementById("delay").addEventListener('input', () => {
                    helperConfig.delay = document.getElementById("delay").value;
                    document.getElementById("show_delay").innerHTML = ` ${helperConfig.delay}`;
                });
                inited = true;
            }
        },
        onHidden() { GM_setValue('MyKiritoHelper', helperConfig); },
    });

    // 更新各種經驗表
    let onlineData = GM_getResourceText("online_data");
    if (onlineData !== null) {
        onlineData = JSON.parse(onlineData);
        pkWinBase = onlineData.pkWinBase;
        pkWinMul = onlineData.pkWinMul;
        pkLoseBase = onlineData.pkLoseBase;
        actTable = onlineData.actTable;
        expTable = onlineData.expTable;
    }

    injectCSS(rattrCSS);
    injectCSS(buttonAniCSS);
    loadmod();
}

function message(msg) {

    let block = `
        <div id="us_messageBlock" data-id="${1999}">
            <div style="position: fixed; top: 2rem; right: 2rem; background-color: #cdfaef; border-radius: 0.5rem; font-size: 1.2rem;">
                <span>${msg}</span>
            </div>
        </div>
    `;

    document.querySelector("div#us_customSpace").innerHTML += block;
}

// 測試中
function loadmod() {
    waitForKeyElements('source', (pic) => {
        if (helperConfig.lisbethMod) {
            if (pic.srcset.match('lisbeth')) {
                document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);
                let msg = `<h5>抓到你囉</h5>`;
                message(msg);
                setTimeout(function() {
                    document.querySelector(`div#us_messageBlock[data-id="${1999}"]`).remove();
                }, 2000);
            }
        }
        if (helperConfig.yuukiMod) {
            if (pic.srcset.match('yuuki.s')) {
                pic.srcset = 友記縮圖;
            }
            if (pic.srcset.match('yuuki')) {
                pic.srcset = 友記全身圖;
            }
        }
        if (helperConfig.deadMod) {
            if (/此玩家目前是死亡狀態/i.test (document.body.innerHTML) )
            {
                if (pic.srcset.match('')) {
                    pic.srcset = 死亡圖片;
                }
            }
        }
    }, false, helperConfig.delay);
}

function myKirito(url, response) {
    let act = url.pathname.split("/");
    if (act[2] === "my-kirito") {
        switch (act[3]) {
            case undefined: // 自己的資料
                cleanObjs();
                updateExpReq();
                updateTeam();
                addTooltip();
                addTimetip();
                break;
            case "teammate": // 隊伍資料
                updateTeam();
                break;
            case "doaction": // 行動
                response = response.myKirito;
                updateExpReq();
                updateTooltip();
                addTimetip();
                break;
        }
    }

    async function updateExpReq() {
        await sleep(helperConfig.delay);
        let expReq = document.getElementById("exp_require");
        let prReq = document.getElementById("pr_require");
        if (!isExist(expReq)) {
            let table = document.querySelector("div#root table > tbody");
            let tr = table.lastChild.cloneNode(true);
            tr.childNodes[0].innerHTML = "保護狀態";
            tr.childNodes[1].id = "pr_require";
            tr.childNodes[2].innerHTML = "距離升級";
            tr.childNodes[3].id = "exp_require";
            let tr2 = table.lastChild.cloneNode(true);
            tr2.childNodes[0].innerHTML = "玻璃值";
            tr2.childNodes[1].innerHTML = response.murder;
            tr2.childNodes[2].innerHTML = "BOTLV";
            tr2.childNodes[3].innerHTML = response.botlv;
            table.appendChild(tr2);
            table.appendChild(tr);
            expReq = document.getElementById("exp_require");
            prReq = document.getElementById("pr_require");
        }
        expReq.innerHTML = expTable[response.lv] - response.exp;
        var prnumber = [response.murder*5+2] - response.defDeath;
        if (prnumber<0)
        {var prText = "快樂的一天 死了進保護"}
        else
        {prText = "你還需要死" + prnumber + "次"}
        prReq.innerHTML = prText;
    }

    async function updateTeam() {
        await sleep(helperConfig.delay);
        let teamRef = document.getElementById("team_ref");
        if (!isExist(teamRef)) {
            let team = document.querySelector("div#root div > h3 ~ div ~ div ~ div");
            let a = document.createElement("a");
            a.id = "team_ref";
            team.appendChild(a);
            teamRef = document.getElementById("team_ref");
        }
        let teammateUID = response.teammateUID;
        let teammateName = response.teammate;
        if (!isExist(teammateName)) {
            teammateName = document.querySelector("div ~ div > input").value;
        }
        if (teammateUID) {
            teamRef.href = `/profile/${teammateUID}`;
            teamRef.innerHTML = teammateName;
        }
        else {
            teamRef.href = "";
            teamRef.innerHTML = "";
        }
    }

    // 幫行動按鈕加上提示
    async function addTooltip() {
        await sleep(helperConfig.delay);
        let buttons = document.querySelectorAll("button");
        floorBtn = buttons[buttons.length-12];
        try{
            buttons = [].slice.call(buttons, buttons.length-11);
            actBtns = [];
            actToLvUp = [];
            let config = {
                delay: [200, 100],
                moveTransition: 'transform 0.2s ease-out',
                animation: 'shift-away-subtle',
            };
            actBtns = actBtns.concat(createTipGroup(buttons.slice(0, 7), config));
            actBtns = actBtns.concat(createTipGroup(buttons.slice(7), config));
            config.delay = [1000, 100]; config.placement = 'bottom';
            actToLvUp = actToLvUp.concat(createTipGroup(buttons.slice(0, 7), config, false));
            actToLvUp = actToLvUp.concat(createTipGroup(buttons.slice(7), config, false));

            for (let i = 0; i < actBtns.length; i++) {
                actBtns[i].setContent(`${actTable[i]} 經驗值`);
            }
            updateTooltip();
            if (myK.floor > 0) {
                floorBtn = [].push(tippy(floorBtn, {
                    delay: [200, 100],
                    content: `${myK.floor * 100} 經驗值`,
                    animation: 'shift-away-subtle',}));
            }
        }
        catch(e) {}
    }

    // 計算幾次行動後升級
    async function updateTooltip() {
        await sleep(helperConfig.delay);
        let expReq = expTable[response.lv] - response.exp;
        for (let i = 0; i < 11; i++) {
            if (i === 0 || i === 2) { actToLvUp[i].setContent(`約 ${Math.ceil(expReq / ((Number(actTable[i].slice(3)) + Number(actTable[i].slice(0, 2))) / 2))} 次此行動後升級` ); }
            else { actToLvUp[i].setContent(`${Math.ceil(expReq / (Number(actTable[i])))} 次此行動後升級`); }
        }
    }

    // 修行跟樓層獎勵加上時間提示
    async function addTimetip() {
        await sleep(helperConfig.delay);
        let now = new Date();
        let config = {
            delay: [200, 100],
            trigger: 'mouseenter focus click',
            placement: 'right',
            animation: 'shift-away-subtle',
        };
        try {
            cleanTips(nextTimetip);
        }
        catch(e) {
            nextTimetip = [];
        }

        // 有樓層獎勵
        if (myK.floor > 0) {
            let nextFB = new Date(response.lastFloorBonus + 8*3600*1000);
            if (nextFB.getTime() > now.getTime() + 100*1000) {
                let divFB = document.querySelector("div#root > div > div > div:nth-child(3)");
                divFB.firstChild.style.display = "inline-block";
                config.content = "下次可領取時間：" + nextFB.toLocaleTimeString();
                let nextFBTip = createTipGroup(divFB.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextFBTip);
                clearAtTime(nextFBTip[0], nextFB.getTime());
            }
            if (response.lastAction > now.getTime() + 100*1000) {
                let nextAct = new Date(response.lastAction + 80*1000);
                let divAct = document.querySelector("div#root > div > div > div:nth-child(4)");
                divAct.firstChild.style.display = "inline-block";
                config.content = "下次可行動時間：" + nextAct.toLocaleTimeString();
                let nextActTip = createTipGroup(divAct.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextActTip);
                clearAtTime(nextActTip[0], nextAct.getTime());
            }
        }
        else {
            if (response.lastAction > now.getTime() + 100*1000) {
                let nextAct = new Date(response.lastAction + 80*1000);
                let divAct = document.querySelector("div#root > div > div > div:nth-child(3)");
                divAct.firstChild.style.display = "inline-block";
                config.content = "下次可行動時間：" + nextAct.toLocaleTimeString();
                let nextActTip = createTipGroup(divAct.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextActTip);
                clearAtTime(nextActTip[0], nextAct.getTime());
            }
        }

        function clearAtTime(tip, timetoclear) {
            setTimeout(() => { tip.destroy(); }, timetoclear - now.getTime() - 100*1000);
        }
    }
}

async function otherKirito(url, response) {
    switch (url.pathname.split("/")[2]) {
        case "profile": // 別人的資料
            otherK = response.profile;
            if (isExist(otherK) && isExist(myK)) {
                cleanObjs();
                reportbutton();
                showRattr();
                addTooltip();
            }
            break;
        case 'my-kirito':
            myK = response;
            if (isExist(otherK) && isExist(myK)) {
                cleanObjs();
                reportbutton();
                showRattr();
                addTooltip();
            }
            break;
    }
    async function reportbutton() {
    await sleep(helperConfig.delay);
        let reportbu = document.getElementById("reportobj");
        if (!isExist(reportbu)) {
            let rr = document.createElement("rr");
            rr.id = "reportobj";
            let navbar = document.querySelector("div#root > nav");
            rr.className = "sc-fzqAui eoGDzK";
            rr.innerText = "通緝發送";
            navbar.insertBefore(rr, navbar.lastChild);
            rr.addEventListener("click", function() {
            fetch("https://discordapp.com/api/webhooks/723577685980217395/3iRqNHFbBwln_ibwHMl-JZEn27AVEmi9ew-gzol50eJ87jbj-UBD8JdnSfClXVGstt9O", {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                },
                "body": JSON.stringify(bodydata),
                "method": "POST"
            })
    })
        }
        reportbu = document.getElementById("reportobj");
        var bodydata ={
        	"username": 發送名稱,
        	"avatar_url": 通緝頭貼,
        	"embeds": [{
                "description": myK.nickname + "對" + otherK.nickname + "發起了通緝" + "\n" + "[通緝目標連結]" + "(https://mykirito.com/profile/"+otherK._id+")",
                "author": {name: "通緝令發起人: " + myK.nickname, url: "https://mykirito.com/profile/"+myK._id},
                "fields": [
                    {name: "職業:", value: otherK.character, inline: true},
                    {name: "稱號:", value: otherK.title, inline: true},
                    {name: "目標顏色:", value: otherK.color, inline: true},
                    {name: "血量:", value: otherK.hp, inline: true},
                    {name: "攻擊:", value: otherK.atk, inline: true},
                    {name: "防禦:", value: otherK.def, inline: true},
                    {name: "體力:", value: otherK.stm, inline: true},
                    {name: "敏捷:", value: otherK.agi, inline: true},
                    {name: "反應速度:", value: otherK.spd, inline: true},
                    {name: "技巧:", value: otherK.tec, inline: true},
                    {name: "智力:", value: otherK.int, inline: true},
                    {name: "幸運:", value: otherK.lck, inline: true},
                    {name: "目標狀態:", value: otherK.status},
                ],
        		 "color": 16411130
        	}]
        }
    }
    async function showRattr() {
        await sleep(helperConfig.delay);
        let btnDetail = document.querySelectorAll("button")[0];
        let btnCompare = document.querySelectorAll("button")[1];
        if (!isExist(btnDetail) || !isExist(btnCompare)) {
            waitForKeyElements('button ~ button', () => {
                btnDetail = document.querySelectorAll("button")[0];
                btnCompare = document.querySelectorAll("button")[1];
            });
        }
        btnSwitch();
        btnDetail.addEventListener('click', btnSwitch);
        btnCompare.addEventListener('click', btnSwitch);

        async function btnSwitch() {
            await sleep(helperConfig.delay);
            // 詳細資料
            if (btnDetail.disabled) {
                let table = document.querySelector("div#root tbody");
                rattrAppend(document.querySelector("div#root table > tbody"), otherK.rattrs, 4);

                // 一些有的沒的
                let tr = table.lastChild.cloneNode(true);
                tr.id = 'addi_info';
                tr.childNodes[0].innerHTML = "目前層數";
                tr.childNodes[1].innerHTML = otherK.floor;
                tr.childNodes[2].innerHTML = "成就點數";
                tr.childNodes[3].innerHTML = otherK.achievementPoints;
                let tr2 = table.lastChild.cloneNode(true);
                tr2.id = 'addi_info2';
                tr2.childNodes[0].innerHTML = "玻璃值";
                tr2.childNodes[1].innerHTML = otherK.murder;
                tr2.childNodes[2].innerHTML = "BOTLV";
                tr2.childNodes[3].innerHTML = otherK.botlv;
                table.appendChild(tr);
                table.appendChild(tr2);
            }
            // 能力比對
            else {
                rattrAppend(document.querySelector("div#root table > tbody"), myK.rattrs, 6);
                rattrAppend(document.querySelector("div#root table ~ table > tbody"), otherK.rattrs, 6);
            }

            function rattrAppend(table, rattrs, count=0) {
                for (let k in rattrs) {
                    if (rattrs[k] !== 0) {
                        let r = document.createElement('span');
                        r.className = 'sc-fzoLsD fYZyZu show_rattr';
                        r.innerHTML = ` (+${rattrs[k]})`;
                        if (k === 'hp') { r.innerHTML = ` (+${rattrs[k] * 10})`; }
                        table.childNodes[count].childNodes[1].appendChild(r);
                    }
                    count++;
                }
            }
        }
    }

    async function addTooltip() {
        await sleep(helperConfig.delay);
        let lvDiff = otherK.lv - myK.lv;
        let buttons = [].slice.call(document.querySelectorAll("button"), 2, 6);
        try{
            pkBtns = createTipGroup(buttons, {
                delay: [200, 100],
                moveTransition: 'transform 0.2s ease-out',
                placement: 'left',
                animation: 'shift-away-subtle',
            });
            for (let i = 0; i < 4; i++) {
                let text;
                if (lvDiff >= 0) { text = `${pkWinBase[i] + Math.floor(pkWinMul[i] * lvDiff)} / ${pkLoseBase[i]}`; }
                else { text = `<${pkWinBase[i]} / ${pkLoseBase[i]}`; }
                pkBtns[i].setContent(`${text} 經驗值`);
            }
        }
        catch(e) {}
    }
}

// 戰報處理
async function reportThree(report) {
    await sleep(helperConfig.delay);
    // boss戰
    if (report.type === 99) {}
    // 對戰
    else {
        let atkTable = document.querySelectorAll("tbody")[0];
        let defTable = document.querySelectorAll("tbody")[1];
        if (!isExist(atkTable) || !isExist(defTable)) {
            waitForKeyElements("table ~ table", () => {
                atkTable = document.querySelectorAll("tbody")[0];
                defTable = document.querySelectorAll("tbody")[1];
            });}
        tableEnhance(report.a, report.b, atkTable);
        tableEnhance(report.b, report.a, defTable);

        function tableEnhance(data1, data2, table) {
            let AP1 = getAP(data1);
            let AP2 = getAP(data2);
            let count = 6;

            table.childNodes[3].childNodes[1].innerHTML = `<a href="/profile/${data1.uid}">${data1.nickname}</a>`
            for (let k in AP1) {
                table.childNodes[count].childNodes[1].innerHTML += pCompare(AP1[k], AP2[k]);
                table.childNodes[count].childNodes[1].style.display = "flex";
                table.childNodes[count].childNodes[1].style.justifyContent = "space-between";
                count++;
            }

            function pCompare(p1, p2) {
                if (p1 > p2) { return `<span class="fYZyZu">+${p1-p2}</span>`; }
                else { return `<span style="color: red;">-${p2-p1}</span>`; }
            }
        }
    }
}

// 拿能力值 (加上轉生點)
function getAP(data) {
    if (data.rattrs) {
        return {'hp': data.hp + data.rattrs.hp,
                'atk': data.atk + data.rattrs.atk,
                'def': data.def + data.rattrs.def,
                'stm': data.stm + data.rattrs.stm,
                'agi': data.agi + data.rattrs.agi,
                'spd': data.spd + data.rattrs.spd,
                'tec': data.tec + data.rattrs.tec,
                'int': data.int + data.rattrs.int,
                'lck': data.lck + data.rattrs.lck
               }
    }
    return {'hp': data.hp,
            'atk': data.atk,
            'def': data.def,
            'stm': data.stm,
            'agi': data.agi,
            'spd': data.spd,
            'tec': data.tec,
            'int': data.int,
            'lck': data.lck
           }
}

//pic trans
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

}
// bgMOD
if (helperConfig.backgroundMOD) {
    var css = "";
    var url = document.location.href;
    if (url.indexOf("https://mykirito.com") === 0) {
        css += "body{background-image:bac_img_color,url(bac_img_url)!important;background-attachment:fixed!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:cover!important;background-color:rgba(45,45,45,1)!important;overflow-y:scroll}#root{color:#fff}:root{--th-bg-color:#f0f0f000!important;--th-bg-color-alt1:#f0f0f000!important;--primary-bg-color:#f0f0f000!important;--border-color:#dddddd54!important;--btn-bg-color-disabled:#e0e0e059!important;--input-bg-color:#e0e0e059!important;--btn-bg-color:#e0e0e059}.fYZyZu {color:#FFF}";
        css += 擴充CSS;
        if (背景圖片網址 == GM_getValue("bac_img_url")) {
            背景圖片網址 = GM_getValue("bac_base64");
        } else {
            if (背景圖片網址.substr(0, 4).toLowerCase() == "http") {
                toDataURL(背景圖片網址, function (dataUrl) {
                    GM_setValue("bac_base64", dataUrl);
                    GM_setValue("bac_img_url", 背景圖片網址);
                    });
            }
        }
    }
    css += "";
    css = css.replace(/bac_img_color/g, 背景圖片上面的漸層顏色);
    css = css.replace(/bac_img_url/g, 背景圖片網址);
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("html");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
}
// SCROLLLIST
if (helperConfig.scrolllistMOD) {
    setInterval(function () {
        url = location.href;

        if (url.includes("user-list")) {
            // 在玩家列表頁
            if (document.querySelectorAll("div#root > div > div:nth-child(1) > table").length != 0) {
                // 尚未移動 list
                let listTable = document.querySelector("div#root > div > div:nth-child(1) > table");

                listTable.insertAdjacentHTML("beforebegin", `<div id="us_newButtonSpace"></div><div id="us_newListSpace"></div>`);

                let newListSpace = document.querySelector("div#us_newListSpace");

                newListSpace.appendChild(listTable);
                newListSpace.style.maxHeight = "55vh";
                newListSpace.style.overflowY = "scroll";
            }
        }
    }, 100)
}


// 好醜
function cleanObjs() {
    let expReq = document.getElementById("exp_require");
    let prReq = document.getElementById("pr_require");
    let teamRef = document.getElementById("team_ref");
    let reportbu = document.getElementById("reportobj");
    let addiInfo = document.getElementById("addi_info");
    let rattrs = document.getElementsByClassName("show_rattr");
    if (expReq) {expReq.parentNode.remove();}
    if (prReq) {prReq.parentNode.remove();}
    if (addiInfo) {addiInfo.remove();}
    if (teamRef){teamRef.remove();};
    if (reportbu){reportbu.remove();};
    if (rattrs) {
        for (let i = 0; i < rattrs.length;) {
            rattrs[i].remove();
        }};
    if (floorBtn) {
        cleanTips(floorBtn);
    }
    if (actBtns) {
        cleanTips(actBtns);
    }
    if (actToLvUp) {
        cleanTips(actToLvUp);
    }
    if (pkBtns) {
        cleanTips(pkBtns);
    }
    if (nextTimetip) {
        cleanTips(nextTimetip);
    }
    if (loadmod){
        cleanTips(loadmod);
    }
}

function cleanTips(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i].destroy();
    }
    arr = [];
}

// 建立tootip並綁定成一組
function createTipGroup(btns, config, sglt=true) {
    if (!Array.isArray(btns)) {
        btns = [btns];
    }
    let tippyBtns = [];
    for (let i = 0; i < btns.length; i++) {
        tippyBtns.push(tippy(btns[i], config));
    }
    if (sglt) { tippy.createSingleton(tippyBtns, config); }
    return tippyBtns;
}

function isExist(obj) {
    return !(obj === undefined || obj === null);
}

async function sleep(ms=0) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// from tippy.js
function injectCSS(css) {
    var style = document.createElement('style');
    style.textContent = css;
    var head = document.head;
    var firstStyleOrLinkTag = document.querySelector('head>style,head>link');

    if (firstStyleOrLinkTag) {
        head.insertBefore(style, firstStyleOrLinkTag);
    } else {
        head.appendChild(style);
    }
}