// ==UserScript==
// @name            B站直播抽奖姬
// @version         1.2.2
// @description     给主播用来的抽奖的
// @author          Pronax
// @include         /https:\/\/live\.bilibili\.com\/(blanc\/)?\d+/
// @icon            http://bilibili.com/favicon.ico
// @grant           GM_addStyle
// @run-at          document-start
// @noframes
// @require         https://greasyfork.org/scripts/434638-xfgryujk-s-bliveproxy/code/xfgryujk's%20bliveproxy.js?version=983438
// @namespace https://greasyfork.org/users/412840
// @downloadURL https://update.greasyfork.org/scripts/433582/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%8A%BD%E5%A5%96%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433582/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%8A%BD%E5%A5%96%E5%A7%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 粉丝牌API
    // https://api.live.bilibili.com/xlive/general-interface/v1/rank/getHeartRank?ruid=350024041&page=1&page_size=30
    // 无实际意义，数量众多时不能获取完整列表，但七天内送过小心心的肯定可以拿到
    // unsafeWindow.fansList = new Map();
    // var curPage = 1;
	// while(await getFans(curPage));
	// async function getFans(page = 1){
	// 	return new Promise((resolve,reject)=>{
	// 		fetch(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getHeartRank?ruid=${userid}&page=${page}&page_size=30`)
	// 			.then(res => res.json())
	// 			.then(json =>{
	// 			if(json.code!=0){
	// 				reject();
	// 			}
	// 			console.log(json);
	// 			if(json.data.item.length==0){
	// 				resolve(false);
	// 				return;
	// 			}
	// 			for(let i of json.data.item){
	// 				unsafeWindow.fansList.set(i.uid,i.level);
	// 			}
	// 			curPage++;
	// 			resolve(true);
	// 		});
	// 	});
	// }

    // 按钮
    GM_addStyle(".side-bar-gamble-cntr{width:47px;height:60px!important;position:fixed;right:0;bottom:13.5%;padding:0 4px 12px;background-color:#fff;z-index:11;border-radius:0 0 0 12px;box-shadow:0 5px 8px 0 rgb(0 85 255 / 5%);border:1px solid #e9eaec;border-top:0;transform:translate3d(0,0,0)}.side-bar-gamble-btn{height:56px;box-sizing:border-box;margin:4px 0;cursor:pointer;text-align:center;padding:5px 4px;position:relative}.side-bar-gamble-icon{font-size:26px !important;margin:0 auto;width:26px;height:26px}.side-bar-btn-cntr:hover .side-bar-gamble-icon{-webkit-animation:link-live-sidebar-jumping-data-v-7cd63ad2 cubic-bezier(.22,.58,.12,.98) 1.5s infinite;animation:link-live-sidebar-jumping-data-v-7cd63ad2 cubic-bezier(.22,.58,.12,.98) 1.5s infinite}.size-bar-gamble-text{margin:4px 0 0 0;font-size:12px;line-height:16px;color:#006cb5}");
    // 面板
    GM_addStyle(".gamble-panel{width:500px;height:466px;padding:20px;border-radius:5px;background-color:#fff;box-shadow:0 0 10px 3px rgb(0 0 0 / 20%);word-wrap:break-word;word-break:break-word;z-index:1000;top:calc(50% - 220px);left:calc(50% - 260px)}.gamble-progress-bar{border:1px solid #eee;height:0;width:100%;margin:10px 0;transition:border ease-out .5s,width 1s}.gamble-progress-bar.loading{border:1px solid #23ade5;height:2px;width:0;margin:9px 0;background-color:#23ade5}.player-list-body{height:260px;overflow:hidden scroll;scrollbar-width:thin}.result::-webkit-scrollbar,.gamble-history::-webkit-scrollbar,.player-list-body::-webkit-scrollbar{width:8px}.result::-webkit-scrollbar-thumb,.gamble-history::-webkit-scrollbar-thumb,.player-list-body::-webkit-scrollbar-thumb{background-color:#aaa}.result::-webkit-scrollbar-track,.gamble-history::-webkit-scrollbar-track,.player-list-body::-webkit-scrollbar-track{background-color:#eee}.player-list>.list{width:100%;border-collapse:collapse}.player-list>.list .list-row{color:#999;height:26px;opacity:1;animation:gamble-fade-in cubic-bezier(0,0,0.2,1) .5s}.player-list>.list tr.list-row:hover{background-color:#eef7fd}.player-list>.list .list-row:nth-child(odd){background-color:#f9f9f9}.player-list>.list thead,.player-list>.list tr{display:table;width:492px;table-layout:fixed}.player-list>.list .list-head th{font-size:12px;color:#555;font-weight:400;line-height:20px}.player-list>.list .list-row td{font-size:12px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;text-align:center}.player-list>.list .list-row td:first-child{text-align:left;text-indent:5px}.player-list>.list .list-row td:last-child{text-align:left;text-indent:10px;border-right:0}.gamble-timer{text-align:center}.gamble-panel .tip{margin:-2px 3px 4px;color:#999;width:33%}.gamble-panel .tip:last-child{text-align:right}.gamble-panel .player-list{position:relative;height:210px}.gamble-panel .icon{background-image:url(//static.hdslb.com/images/base/icons.png)}.gamble-panel .btn-del{cursor:pointer;width:17px;height:16px;vertical-align:top;background-position:-342px -1047px;position:absolute;right:5px;display:none}.gamble-panel .list-row:hover .btn-del{display:inline-block}.tv-skip-btn{color:#888;border:1px solid #ccc;background-color:#fbfbfb;position:absolute;left:25px;top:210px;padding:10px 30px;border-radius:4px}.tv-close-btn{color:#888;border:1px solid #ccc;background-color:#fbfbfb;position:absolute;left:25px;top:210px;padding:10px 30px;border-radius:4px}.tv-skip-btn:hover,.tv-close-btn:hover{background-color:#efefef}.gamble-panel #biliTvLogo{background-color:#fff;width:100%;height:290px;position:absolute;top:15px;z-index:10}.gamble-panel .status-image{background-image:url(https://i0.hdslb.com/bfs/live/041e66bf2c4246d6d7d2216383bdc8f823a21e9a.png);animation:1.62s steps(24) infinite gamble-gift-flower;background-size:2400% 100%;background-repeat:no-repeat;width:115px;height:115px;display:inline-block;margin:40px 0 0 15px;transition:background-image .5s;transform:rotateY(180deg)}.gamble-panel .result{width:73%;top:10px;display:block;font-size:16px;text-align:center;color:#f77b00;float:right;height:275px;overflow:hidden scroll;scrollbar-width:thin;position:relative}.gamble-panel .result>*{animation:.3s linear backwards gamble-fade-in;margin-top:10px}.gamble-panel .result>*:first-child{margin-top:0}.gamble-panel .result .winner>div{width:60%;text-indent:5px;display:inline-block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align:bottom}.gamble-panel .result .winner>div:first-child{width:9%;color:#999;float:left;text-align:right;text-indent:0}.gamble-panel .result .winner>div:last-child{width:30%;border-left:1px solid #bbb;text-align:center;float:right}.gamble-history{scrollbar-width:thin;position:absolute;right:-310px;background-color:#fdfdfd;height:100%;top:0;width:300px;border-radius:5px;overflow:hidden scroll;box-shadow:0 0 10px 3px rgb(0 0 0 / 20%)}.gamble-history summary{display:list-item;font-size:17px;padding:5px;margin-bottom:0;background-color:#5c968e;color:#fff}.gamble-history .result{width:100%;top:0;height:unset;overflow:unset;float:unset}.gamble-history .result>*{margin:5px 0!important}.gamble-panel .popup-title{margin:0;color:#23ade5;font-weight:400;font-size:18px}.gamble-panel .room-manager-ctnr{margin-top:0;height:400px}.gamble-panel .input-lable{color:#999}.gamble-panel .input-wrap{padding-top:10px;user-select:none;display:flex;justify-content:space-between}.gamble-panel .link-input::placeholder{color:#bbb}.gamble-panel .link-input{height:26px;padding:2px 8px;line-height:25px;border:1px solid #aaa;border-radius:4px;background-color:#fff;outline:0}.gamble-panel input#gamble-keyword{width:100px}.gamble-panel input#gamble-player-limit{width:75px}.gamble-panel input#gamble-bouns-count{width:40px}.gamble-panel input#gamble-count_down{width:90px}.gamble-panel input#gamble-medal-level-limit{width:90px}.gamble-panel input#gamble-medal-limit{width:135px}.gamble-general-setting .check-icon{font-size:16px;margin-right:5px}.gamble-panel .bl-button-size{min-width:104px;height:32px;font-size:14px}.gamble-panel .bl-button-primary{background-color:#23ade5;color:#fff;border-radius:4px}.gamble-panel .bl-button-primary:hover{background-color:#39b5e7}.gamble-panel .bl-button-error{background-color:#fb7299;color:#fff;border-radius:4px}.gamble-panel .bl-button-error:hover{background-color:#f981a3}.gamble-panel .bl-button{position:relative;box-sizing:border-box;line-height:1;margin:0;padding:6px 12px;border:0;cursor:pointer;outline:0;overflow:hidden;float:right}.gamble-panel .bl-button:disabled{background-color:#e9eaec!important;color:#b4b4b4!important;cursor:not-allowed!important}.gamble-btn{width:190px}.gamble-panel .gamble-btn-small{min-width:70px;float:left}#gamble-draw-btn{background-color:#f7b500}.gamble-panel .close-btn{width:20px;height:20px;right:12px;top:12px;color:#999;line-height:20px;transition:all cubic-bezier(.22,.58,.12,.98) .3s}.gamble-panel .close-btn:hover{transform:rotate(180deg) scale(1.1)}.drag-bar{position:absolute;width:200px;top:0;margin:0 150px;cursor:move;opacity:0;transition:opacity .7s}.drag-bar>.bar{width:100%;height:6px;margin:7px 0;background-color:#ddd;border-radius:25px;transition:background-color cubic-bezier(0.45,0.45,1,1) .2s}.drag-bar:hover>.bar{background-color:#bbb}.gamble-panel:hover .drag-bar{opacity:1}@keyframes gamble-fade-in{from{opacity:0}to{opacity:1}}@keyframes gamble-fade-out{from{opacity:1}to{opacity:0}}@keyframes gamble-gift-flower{0%{background-position-x:0}100%{background-position-x:-2760px}}");

    var switchBtnPosition = true;

    var player = new Map(), resultSet = new Array();
    var panelOffsetX, panelOffsetY, dragging = false;
    var keyWord = null, playerLimit = Infinity, userLevelLimit = 0, medalLevelLimit = 0, medalLimit = null;
    var skipFrame = false;

    var timeout, intervalCount = 0, interval = setInterval(() => {
        let sideBar = document.querySelector(".side-bar-cntr");
        // let sideBar = document.querySelector(".chat-items");
        if (sideBar) {
            clearInterval(interval);
            let divElement = document.createElement("div");
            // 抽奖姬按钮
            divElement.innerHTML = `<div class="side-bar-gamble-cntr side-bar-cntr"><div class="side-bar-gamble-btn"><div class="side-bar-btn-cntr"><span class="side-bar-gamble-icon dp-i-block svg-icon menu-img-hover"></span><p class="size-bar-gamble-text">抽奖姬</p></div></div></div>`;
            sideBar.style.width = "47px";       // 可能有新图标的加入，且文字长度大于3，我的标志就对不上了QAQ
            sideBar.after(divElement.firstElementChild);
            // 抽奖姬面板
            divElement.innerHTML = `<div class="gamble-panel m-auto dp-none p-fixed a-forwards"><div class="drag-bar"><div class="bar"></div></div><div class="title-ctnr p-relative"><h2 class="popup-title">天选之人</h2></div><div class="popup-content-ctnr"><div class="room-manager-ctnr"><div class="gamble-general-setting"><div class="input-wrap"><div><label class="input-lable" for="gamble-keyword">弹幕关键字:</label><input id="gamble-keyword" type="text" placeholder="支持正则表达式" class="link-input"></div><div><label class="input-lable" for="gamble-player-limit">人数限制:</label><input id="gamble-player-limit" type="number" placeholder="0为无上限" min="0" class="link-input"></div><div><label class="input-lable" for="gamble-bouns-count">奖品数:</label><input id="gamble-bouns-count" type="number" placeholder="1" min="0" class="link-input"></div></div><div class="input-wrap"><div><label class="input-lable" for="gamble-medal-limit">粉丝牌限制:</label><input id="gamble-medal-limit" type="text" placeholder="区分大小写,戴着发才算" class="link-input"></div><div><label class="input-lable" for="gamble-medal-level-limit">粉丝牌等级限制:</label><input id="gamble-medal-level-limit" type="number" placeholder="大于等于" min="0" max="40" class="link-input"></div></div><div class="input-wrap"><div><label class="input-lable" for="gamble-count_down">倒计时(分):</label><input id="gamble-count_down" type="number" placeholder="0为手动停止" min="0" class="link-input"></div><div style="margin-top: 8px;"><input id="gamble-repeatable" type="checkbox" style="display: none;"><span id="gamble-repeatable-icon" class="check-icon pointer svg-icon v-middle checkbox-default"></span><label class="v-middle" for="gamble-repeatable" style="color:#666">可重复获奖</label></div><div class="gamble-btn"><button id="gamble-start-btn" class="bl-button bl-button-primary bl-button-size"><span class="txt">开始</span></button><button id="gamble-stop-btn" class="dp-none bl-button bl-button-error bl-button-size"><span class="txt">停止</span></button><button id="gamble-draw-btn" disabled class="gamble-btn-small bl-button bl-button-primary bl-button-size"><span class="txt">抽选</span></button></div></div><div><hr class="gamble-progress-bar"></div><div class="player-list"><div id="biliTvLogo" class="dp-none link-progress-tv"><button class="tv-close-btn pointer dp-none">关闭</button><button class="tv-skip-btn pointer">跳过</button><div class="status-image gift-frame"></div><div class="result"></div></div><div class="dp-flex" style="justify-content: space-between;"><div class="tip">当前参与人数：<span class="player-count">0</span></div><div class="gamble-timer tip"></div><div class="tip"><div class="dp-none pointer history-btn">抽奖历史（<span class="history-count">0</span>） </div></div></div><table class="list"><thead><tr class="list-head"><th width="20%">用户名</th><th width="20%">UID</th><th width="15%">时间</th><th width="40%">弹幕内容</th></tr></thead><tbody class="player-list-body p-relative dp-block"></tbody></table></div></div></div></div><div id="gamble-panel-close-btn" title="关闭面板" class="close-btn p-absolute bg-center bg-no-repeat pointer t-center"><i class="icon-font icon-close"></i></div><div class="gamble-history dp-none"></div></div>`;
            document.body.append(divElement.firstElementChild);

            initCloseBtn();
            initDragFunc();
            initDelBtn();
            initResultCloseBtn();
            initSkipBtn();
            initHistoryBtn();
            initRepeatableBtn();
            document.querySelector("#gamble-start-btn").onclick = startBtnFunc;
            document.querySelector("#gamble-stop-btn").onclick = stopBtnFunc;
            document.querySelector("#gamble-draw-btn").onclick = drawBtnFunc;
            initOpenBtn();

        } else if (++intervalCount > 50) {
            clearInterval(interval);
        }
    }, 100);

    function logPlayer(message) {
        let ts = message.info[0][4];
        let uid = message.info[2][0];
        let uname = message.info[2][1];
        let content = message.info[1];
        let userLevel = message.info[4][0];         // 用户等级（非主站等级）
        let medalLevel = message.info[3][0];
        let medalName = message.info[3][1];
        if (userLevel < userLevelLimit || (medalLimit && medalName != medalLimit) || medalLevel < medalLevelLimit || playerLimit <= player.size || player.has(uid) || (keyWord && content.search(keyWord) < 0)) {
            return;
        }
        player.set(uid, uname);
        if (playerLimit <= player.size) {
            stopBtnFunc();
        }
        document.querySelector(".player-count").innerText = playerLimit == Infinity ? player.size : player.size + "/" + playerLimit;
        let tbody = document.querySelector(".player-list-body");
        let temp = document.createElement("tr");
        temp.className = "list-row";
        temp.innerHTML = `<td width="20%">${uname}</td><td width="20%">${uid}</td><td width="15%">${new Date(ts).toLocaleTimeString('chinese', { hour12: false })}</td><td width="40%">${content}<i class="btn-del icon" data-uid="${uid}"></i></td>`;
        tbody.append(temp);
        tbody.scrollTop += 26;
    }

    async function showResult(winnerList) {
        return new Promise(async (resolve, reject) => {
            let resultElement = document.querySelector("#biliTvLogo>.result");
            if (winnerList.length) {
                for (let i in winnerList) {
                    let tempElement = document.createElement("div");
                    tempElement.classList.add("winner");
                    tempElement.innerHTML = `<div>${+i + 1}.</div><div>${player.get(winnerList[i])}</div><div>${winnerList[i]}</div>`;
                    resultElement.append(tempElement);
                    resultElement.scrollTop += 28;
                    (!skipFrame) && await sleep(200);
                }
                resultSet.push({
                    timestamp: Date.now(),
                    num: winnerList.length,
                    data: winnerList,
                    keyWord: keyWord,
                    medalLimit: medalLimit,
                    playerLimit: playerLimit,
                    userLevelLimit: userLevelLimit,
                    medalLevelLimit: medalLevelLimit,
                });
                logResult();
            } else {
                let tempElement = document.createElement("div");
                tempElement.style.animation = "gamble-fade-in .5s";
                tempElement.innerText = "无人中奖";
                resultElement.append(tempElement);
            }
            resolve();
        });
    }

    // 随机挑选固定数量
    function randomPick(num, allowRepeat) {
        if (isNaN(num) || num <= 0) { return []; }
        let uidList = [];
        for (let key of player.keys()) {
            uidList.push(key);
        }
        if (num < player.size) {
            let resultList = [];
            let multiple = 1000 > player.size ? 1000 : player.size;
            while (num--) {
                let index = Math.round(Math.random() * multiple) % uidList.length;
                resultList.push(uidList[index]);
                if (!allowRepeat) {
                    uidList[index] = uidList[uidList.length - 1];
                    uidList.pop();
                }
            }
            return resultList;
        }
        return shuffle(uidList);

        function shuffle(list) {
            for (let i = list.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [list[i - 1], list[j]] = [list[j], list[i - 1]];
            }
            return list;
        }
    }

    function initDragFunc() {
        let dragBar = document.querySelector(".drag-bar");
        dragBar.onmousedown = (e) => {
            let panel = document.querySelector(".gamble-panel");
            panelOffsetX = e.pageX - panel.offsetLeft;
            panelOffsetY = e.pageY - panel.offsetTop;
            document.body.style.userSelect = "none";
            dragging = true;
        }
        dragBar.onmouseup = () => {
            document.body.style.userSelect = "";
            dragging = false;
        }
        document.onmousemove = (e) => {
            if (dragging) {
                let panel = document.querySelector(".gamble-panel");
                panel.style.left = e.pageX - panelOffsetX + "px";
                panel.style.top = e.pageY - panelOffsetY + "px";
            }
        }
    }

    function initOpenBtn() {
        let panelBtn = document.querySelector(".side-bar-gamble-btn");
        panelBtn.onclick = () => {
            let panel = document.querySelector(".gamble-panel");
            if (panel.classList.contains("dp-none")) {
                panel.style.left = "";
                panel.style.top = "";
                panel.classList.remove("dp-none");
                panel.classList.add("a-move-in-top");
            } else {
                panel.classList.remove("a-move-in-top");
                panel.classList.add("a-move-out-bottom");
                setTimeout(() => {
                    panel.classList.remove("a-move-out-bottom");
                    panel.classList.add("dp-none");
                }, 300);
            }
        }
    }

    function initDelBtn() {
        document.querySelector(".player-list-body").onclick = (e) => {
            if (e.target.className == "btn-del icon") {
                player.delete(Number.parseInt(e.target.getAttribute("data-uid"))) && e.target.parentNode.parentNode.remove();
                document.querySelector(".player-count").innerText = playerLimit == Infinity ? player.size : player.size + "/" + playerLimit;
            }
        };
    }

    function initCloseBtn() {
        let panelCloseBtn = document.querySelector("#gamble-panel-close-btn");
        panelCloseBtn.onclick = () => {
            let panel = document.querySelector(".gamble-panel");
            panel.classList.remove("a-move-in-top");
            panel.classList.add("a-move-out-bottom");
            setTimeout(() => {
                panel.classList.remove("a-move-out-bottom");
                panel.classList.add("dp-none");
            }, 300);
        }
    }

    function initResultCloseBtn() {
        let tvCloseBtn = document.querySelector(".tv-close-btn");
        tvCloseBtn.onclick = () => {
            tvCloseBtn.parentNode.style.animation = "gamble-fade-out .7s";
            setTimeout(() => {
                tvCloseBtn.parentNode.style.animation = "";
                tvCloseBtn.parentNode.classList.add("dp-none");
            }, 500);
        }
    }

    function initSkipBtn() {
        let skipBtn = document.querySelector(".tv-skip-btn");
        skipBtn.onclick = () => {
            skipFrame = true;
        }
    }

    function initHistoryBtn() {
        let historyBtn = document.querySelector(".history-btn");
        historyBtn.onclick = () => {
            document.querySelector(".gamble-history").classList.toggle("dp-none");
            updateHistoryTimestamp();
        }
    }

    function initRepeatableBtn() {
        document.querySelector("#gamble-repeatable").onchange = function () {
            let repeatableIcon = document.querySelector("#gamble-repeatable-icon");
            if (this.checked) {
                repeatableIcon.classList.add("checkbox-selected");
                repeatableIcon.classList.remove("checkbox-default");
            } else {
                repeatableIcon.classList.remove("checkbox-selected");
                repeatableIcon.classList.add("checkbox-default");
            }
        }
        document.querySelector("#gamble-repeatable-icon").onclick = function () {
            let repeatableBtn = document.querySelector("#gamble-repeatable");
            repeatableBtn.checked = !repeatableBtn.checked;
            if (repeatableBtn.checked) {
                this.classList.add("checkbox-selected");
                this.classList.remove("checkbox-default");
            } else {
                this.classList.remove("checkbox-selected");
                this.classList.add("checkbox-default");
            }
        }
    }

    function startBtnFunc() {
        let tbody = document.querySelector(".player-list-body");
        let progressGif = document.querySelector("#biliTvLogo");
        let drawBtn = document.querySelector("#gamble-draw-btn");
        let stopBtn = document.querySelector("#gamble-stop-btn");
        let startBtn = document.querySelector("#gamble-start-btn");
        let countDownTime = document.querySelector("#gamble-count_down").value;
        countDownTime = countDownTime.length && countDownTime > 0 ? countDownTime : null;
        let peopleLimit = document.querySelector("#gamble-player-limit").value;
        playerLimit = peopleLimit.length && peopleLimit > 0 ? peopleLimit : Infinity;
        let inputWord = document.querySelector("#gamble-keyword").value;
        keyWord = inputWord && inputWord.length > 2 && inputWord.match(/\/.*\//) ? eval(inputWord) : inputWord;
        let inputMedalLevel = document.querySelector("#gamble-medal-level-limit").value;
        medalLevelLimit = inputMedalLevel.length && inputMedalLevel >= 0 && inputMedalLevel <= 40 ? inputMedalLevel : inputMedalLevel > 0 ? 40 : 0;
        medalLimit = document.querySelector("#gamble-medal-limit").value;
        this.disabled = true;
        drawBtn.disabled = true;
        player.clear();
        tbody.innerHTML = "";
        this.classList.add("dp-none");
        stopBtn.classList.remove("dp-none");
        progressGif.classList.add("dp-none");
        if (switchBtnPosition) {
            drawBtn.classList.add("gamble-btn-small");       // 交换位置用
            startBtn.classList.remove("gamble-btn-small");   // 交换位置用
        }
        document.querySelector(".player-count").innerText = 0;
        bliveproxy.addCommandHandler("DANMU_MSG", logPlayer);
        if (countDownTime) {
            timeout = setTimeout(stopBtnFunc, countDownTime * 60000);
            let timerElement = document.querySelector(".gamble-timer");
            let progressBar = document.querySelector(".gamble-progress-bar");
            progressBar.classList.add("loading");
            progressBar.style.transition = `border ease-out .4s,width linear ${countDownTime * 60}s`;
            let end = Date.now() + countDownTime * 60000;
            interval = setInterval(() => {
                if (end - Date.now() > 0) {
                    timerElement.innerText = ((end - Date.now()) / 1000).toFixed(1);
                } else {
                    clearInterval(interval);
                }
            }, 100);
        }
    }

    function stopBtnFunc() {
        bliveproxy.removeCommandHandler("DANMU_MSG", logPlayer);
        clearTimeout(timeout); clearInterval(interval);
        let drawBtn = document.querySelector("#gamble-draw-btn");
        let stopBtn = document.querySelector("#gamble-stop-btn");
        let startBtn = document.querySelector("#gamble-start-btn");
        let progressBar = document.querySelector(".gamble-progress-bar");
        let timerElement = document.querySelector(".gamble-timer");
        timerElement.innerText = "";
        progressBar.style.transition = "";
        progressBar.classList.remove("loading");
        if (player.size > 0) {
            drawBtn.disabled = false;
            if (switchBtnPosition) {
                startBtn.classList.add("gamble-btn-small");      // 交换位置用
                drawBtn.classList.remove("gamble-btn-small");    // 交换位置用
            }
        }
        startBtn.disabled = false;
        startBtn.classList.remove("dp-none");
        startBtn.firstElementChild.innerText = "重来";
        stopBtn.classList.add("dp-none");
    }

    async function drawBtnFunc() {
        let skipBtn = document.querySelector(".tv-skip-btn");
        let closeBtn = document.querySelector(".tv-close-btn");
        let historyBtn = document.querySelector(".history-btn");
        let progressGif = document.querySelector("#biliTvLogo");
        let drawBtn = document.querySelector("#gamble-draw-btn");
        let startBtn = document.querySelector("#gamble-start-btn");
        let historyCount = document.querySelector(".history-count");
        let bounsNumber = document.querySelector("#gamble-bouns-count").value;
        bounsNumber = bounsNumber.length && bounsNumber >= 0 ? bounsNumber : 1;
        let resultElement = document.querySelector("#biliTvLogo>.result");
        let repeatableClaim = document.querySelector("#gamble-repeatable").checked;
        skipFrame = false;
        drawBtn.disabled = true;
        startBtn.disabled = true;
        resultElement.innerHTML = "";
        closeBtn.classList.add("dp-none");
        skipBtn.classList.remove("dp-none");
        progressGif.classList.remove("dp-none");
        if (switchBtnPosition) {
            // drawBtn.classList.add("gamble-btn-small");       // 交换位置用
            // startBtn.classList.remove("gamble-btn-small");   // 交换位置用
        }
        let result = randomPick(bounsNumber, repeatableClaim);
        await showResult(result);
        drawBtn.disabled = false;
        startBtn.disabled = false;
        skipBtn.classList.add("dp-none");
        closeBtn.classList.remove("dp-none");
        historyBtn.classList.remove("dp-none");
        historyCount.innerText = resultSet.length;
    }

    function logResult() {
        let historyElement = document.querySelector(".gamble-history");
        let result = resultSet[resultSet.length - 1];
        let htmlText = "";
        let tempElement = document.createElement("details");
        tempElement.classList.add("history-result");
        htmlText = `<summary><span>${new Date(result.timestamp).toLocaleTimeString('chinese', { hour12: false })}</span><span class="f-right" data-ts="${result.timestamp}">${formatDate(Math.round(result.timestamp / 1000))}</span></summary><div class="result">`;
        for (let i in result.data) {
            htmlText += `<div class="winner"><div>${+i + 1}.</div><div>${player.get(result.data[i])}</div><div>${result.data[i]}</div></div>`;
        }
        htmlText += "</div>";
        tempElement.innerHTML += htmlText;
        historyElement.append(tempElement);
        updateHistoryTimestamp();
    }

    function updateHistoryTimestamp() {
        let historyList = document.querySelectorAll(".history-result>summary>.f-right");
        for (let history of historyList) {
            history.innerText = formatDate(Math.round(history.getAttribute("data-ts") / 1000));
        }
    }

    function formatDate(sec) {
        sec = Math.round(Date.now() / 1000) - sec;
        const TIME_UNIT = ["秒前", "分", "小时", "天"];
        //  0   1   2   3
        // sec min hour day
        let timeArray = [0, 0, 0, 0];
        for (timeArray[0] = sec % 60, sec -= timeArray[0]; sec > 0 && sec < 2592001; sec -= 60) {
            timeArray[1]++;
            if (timeArray[1] == 60) {
                timeArray[1] = 0;
                timeArray[2]++;
                if (timeArray[2] == 24) {
                    timeArray[2] = 0;
                    timeArray[3]++;
                }
            }
        }
        let str = "";
        for (let index = timeArray.length - 1; index >= 0; index--) {
            if (str.length || timeArray[index] > 0) {
                str += timeArray[index] + TIME_UNIT[index];
            }
        }
        return str ? str : "刚刚";
    }

    async function sleep(millisecond) {
        return new Promise((resolve, reject) => {
            let sleepInterval = setInterval(() => {
                millisecond -= 50;
                if (millisecond <= 0 || skipFrame) {
                    clearInterval(sleepInterval);
                    resolve();
                }
            }, 50);
        });
    }

})();