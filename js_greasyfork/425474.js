// ==UserScript==
// @name         二定重复X9
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  上一期位置有重复号码时下单
// //@require https://cdn.bootcdn.net/ajax/libs/tesseract.js/2.1.1/tesseract.min.js
// //@require https://cdn.bootcdn.net/ajax/libs/tesseract.js/2.1.1/worker.min.js
// @author       You
// @include     http*://ub*.ppa168.com/*
// @include     http*://f*.tt6699.xyz/*
// @include     http*://k*.aa369.xyz/*
// @include     http*://f*.aa369.xyz/*
// @include     http*://f1.tt777.xyz/*
// @grant   GM_xmlhttpRequest
// @grant   GM.getTab
// @grant   GM.saveTab
// @grant   GM.setValue
// @grant   GM.getValue
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/425474/%E4%BA%8C%E5%AE%9A%E9%87%8D%E5%A4%8DX9.user.js
// @updateURL https://update.greasyfork.org/scripts/425474/%E4%BA%8C%E5%AE%9A%E9%87%8D%E5%A4%8DX9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const LEAST_END_TIME = 5; // 最后30秒不要下单
    const SEARCH_KEY = "ttt369";
    const SEARCH_KEY2 = "jjj777";
    const BET_STYLE = ['abXXX', 'aXbXX', 'aXXbX', 'aXXXb', 'XabXX', 'XaXbX', 'XaXXb', 'XXabX', 'XXaXb', 'XXXab'];
    const LEN = BET_STYLE.length; // 10条道
    var gameData; // global var
    var gameResult; // global var
    var gameType = 3;
    var lastOpenedGameID = 0;
    var gameEndTime = 0;

    // 一排--排除乘2, 如为0则排除3
    const POOL0 = (gameResult, idx) => {
        let holder = BET_STYLE[idx];
        let pools = [];
        let aIdx = holder.indexOf('a');
        let num = gameResult[0].nums[aIdx];
        for (let i = 0; i <= 0; i++) {
            let num2 = (parseInt(num) + i) % 10;
            [...Array(10).keys()].forEach(a => {
                [...Array(10).keys()].forEach(b => {
                    if (a!= num2 && b != num2 && a != b && Math.abs(a-b) != 5) {
                        pools.push(holder.replace('a', a).replace('b', b));
                    }
                });
            });
        }
        pools = pools.sort();
        return pools;
    };
    function signalA(gameResult, idx) {
        if (!gameData || !gameData.openDateList|| !gameResult || gameResult.length < 1) {
            return false;
        }
        let holder = BET_STYLE[idx];
        let aIdx = holder.indexOf('a');
        let bIdx = holder.indexOf('b');
        if (gameResult[0].nums[aIdx] != gameResult[0].nums[bIdx]) {
            return false;
        }
        // 多于二重，只取最先的，四重取先两对
        let preCount = 0;
        for (let i = aIdx - 1; i >= 0; i--) {
            if (gameResult[0].nums[aIdx] == gameResult[0].nums[i]) {
                preCount++;
            }
        }
        if (preCount % 2 != 0) {
            return false;
        }
        // 多于二重，只取相邻
        for (let i = aIdx + 1; i < bIdx; i++) {
            if (gameResult[0].nums[aIdx] == gameResult[0].nums[i]) {
                return false;
            }
        }
        return true;
    }

    const SIGNALS = [signalA];
    const POOLS = [POOL0];
    const OPTIONS_DESC = ['二定重复'];


    var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    function isPromise(obj) {
        return !!obj && ((typeof obj === 'object' && typeof obj.then === 'function') || (typeof obj === 'function' && typeof obj().then === 'function'));
    }
    /**
     * Wait Resource.
     *
     * @param {Function} resourceFn pred function to check resource
     * @param {Object} options
     * @returns Promise
     */
    function waitResource(resourceFn, options) {
        var optionsRes = Object.assign(
            {
                interval: 2000,
                max: 10
            },
            options
        );
        var current = 0;
        return new Promise((resolve, reject) => {
            var timer = setInterval(() => {
                if (isPromise(resourceFn)) {
                    resourceFn().then(res => {
                        if(res) {
                            clearInterval(timer);
                            resolve();
                        }
                    });
                } else if (resourceFn()) {
                    clearInterval(timer);
                    resolve();
                }
                current++;
                if (current >= optionsRes.max) {
                    clearInterval(timer);
                    reject('Time out');
                }
            }, optionsRes.interval);
        });
    }


    function ajaxAsync(url, data) {
         return new Promise((resolve, reject) => {
             $.ajax({
                 type: "post",
                 url: url,
                 cache: false,
                 timeout: 1000 * 30,
                 dataType: 'json',
                 data: data,
                 success: function (msg) {
                     if (!msg || msg.error) {
                         reject(`Request ${url} => Error ${msg.error}`);
                     } else {
                         resolve(msg);
                     }
                 },
                 error: function () {
                     reject(`Fail to request ${url} with data ${data}`);
                 }
             });
         });
    }

    function resToMask(res, idx) {
        let a = BET_STYLE[idx];
        let mask = 'XXXXX'.split('');
        for(let i = 0; i < BET_STYLE.length; i++) {
            if (a[i] !== 'X') {
                mask[i] = res[i];
            }
        }
        return mask.join('');
    }

    function isPreviousOpened(gameData) {
        if (!gameData || !gameData.openDateList|| !gameResult || gameResult.length < 1) {
            return false;
        }
        return (gameResult[0].gameId + 1 ) % 10 === gameData.openDateList.number % 10;
    }
    async function requestGameData(gameType) {
        return await ajaxAsync('membergamedata', {
            __: "membergamedata",
            gameIndex: gameType,
            type: 2,
            isNumTo: 1,
            t: __sysinfo.autoTid
        });
    }

    async function requestGameResult(gameType) {
        return await ajaxAsync('Result', {
            __: "Result",
            gameIndex: gameType,
            t: __sysinfo.autoTid
        });
    }

    function parseResult(gameResult) {
        return gameResult.table.map(a => {
            let gameIdMatch = /\d+/.exec(a);
            let numRegx = /SSCNo_(\d)/mg;
            let nums = [];
            let match;
            while((match = numRegx.exec(a)) !== null) {
                nums.push(parseInt(match[1]));
            }
            return {
                gameId: parseInt(gameIdMatch[0]),
                nums: nums
            }
        });
    }

    function parseAmounts(amountStr) {
        if (!amountStr) {
            return [];
        }
        let amounts = amountStr.split('-').map(a => parseInt(a)).map(a => (a >= 0) ? a : 0);
        if (amounts.some(a => !(a >= 0))) {
            amounts = [];
        }
        return amounts;
    }
    async function bet(pools, amount, gameType, gameNumber) {
        let count = pools.length;
        pools = pools.map(a => `${getDWTypeByName(a)}:${amount}`);
        const REQ_DATA = {
            __: "DownEntry",
            gameIndex: gameType,
            betType: 5,
            number: gameNumber,
            sortAry: pools.join(','),
            t: __sysinfo.autoTid
        };
        console.log(REQ_DATA);
        // return {};
        return await ajaxAsync('DownEntry', REQ_DATA);
    }

    function addUI() {
        let divAll=document.createElement("div");
        divAll.setAttribute("style", "float:left;z-index:100000;position:absolute;background-color: #229ACB");
        let controlBtn = document.createElement("BUTTON");
        controlBtn.innerText = "隐藏";
        controlBtn.onclick = (event) => {
            if (event.target.innerText === "隐藏") {
                event.target.innerText = "打开";
                document.querySelector('#betAssitInfos').style.display = 'none';
            } else {
                event.target.innerText = "隐藏";
                document.querySelector('#betAssitInfos').style.display = 'block';
            }
        }
        divAll.appendChild(controlBtn);

        let divList=document.createElement("div");
        divList.setAttribute("id", "betAssitInfos");
        divAll.appendChild(divList);
        for(let i = 0; i < OPTIONS_DESC.length; i++) {
            let div=document.createElement("div");
            div.setAttribute("style", "width:280px");
            let btn=document.createElement("BUTTON");
            btn.setAttribute("id", `betBtn${i}`);
            btn.setAttribute("style", "width:130px");
            div.appendChild(btn);
            let select = document.createElement("INPUT");
            //select.setAttribute("id", `strategy`);
            if(OPTIONS_DESC[i].includes('hide')) {
                select.value = "";
            } else {
                select.value = OPTIONS_DESC[i];//OPTIONS_DESC.map(a => `<option value =0>${a}</option>`).join('');
            }
            select.setAttribute("type", "text");
            select.setAttribute("style", "width:60px");
            select.setAttribute('readonly','');
            div.appendChild(select);
            let amount = document.createElement("INPUT");
            amount.setAttribute("id", `betAmount${i}`);
            amount.setAttribute("style", "width:80px");
            amount.setAttribute("placeholder", "金额:1-2-4-8");
            amount.setAttribute("type", "text");
            div.appendChild(amount);
            divList.appendChild(div);
        }
        let node = document.querySelector('div');
        let parentNode = node.parentNode;
        parentNode.insertBefore(divAll, node);
    }

    async function updateUI(tabObj, idx) {
        if (!tabObj[idx]) {
            tabObj[idx] = {};
        }
        let btnId = `#betBtn${idx}`;
        if (tabObj[idx].started) {
            let lenInfo = '';
            if (tabObj[idx].betInfos) {
                let betInfoArr = []
                for (let bi = 0; bi < tabObj[idx].betInfos.length; bi++) {
                    if (tabObj[idx].betInfos[bi].length > 0) {
                        betInfoArr.push(BET_STYLE[bi] + ':' + tabObj[idx].betInfos[bi].length);
                    }
                }
                lenInfo = betInfoArr.join(',');
            }
            document.querySelector(btnId).innerText = `结束(${lenInfo})`;
            // document.querySelector("#strategy").selectedIndex = tabObj.selectedIndex;
            document.querySelector(`#betAmount${idx}`).value = tabObj[idx].amounts.join('-');
            document.querySelector(btnId).onclick = async () => {
                tabObj[idx].started = false;
                // tabObj.betInfos = null;
                await GM.saveTab(tabObj);
                document.querySelector(btnId).innerText = "...";
            }
        } else {
            document.querySelector(btnId).innerText = "开始";
            document.querySelector(btnId).onclick = async () => {
                tabObj[idx].started = true;
                // tabObj.selectedIndex = document.querySelector("#strategy").selectedIndex;
                tabObj[idx].amounts = parseAmounts(document.querySelector(`#betAmount${idx}`).value);
                tabObj[idx].betInfos = Array(LEN).fill([]);
                tabObj[idx].betPools = Array(LEN).fill([]);
                // tabObj.gameType = document.querySelector('#menuText').getAttribute('data-index'); // 澳五的gameType是3
                tabObj[idx].lastGameID = 0;
                tabObj[idx].lastOpenedGameID = 0;
                await GM.saveTab(tabObj);
                document.querySelector(btnId).innerText = "...";
            }
        }
    }

    async function work(tabObj, idx) {
        // work
        if(!tabObj[idx].started) {
            return;
        }
        for (let i = 0; i < LEN; i++) {
            let pool = POOLS[idx](tabObj.result, i);
            if (!!tabObj[idx].betInfos[i] && tabObj[idx].betInfos[i].length === 0) { // 初始下单
                if (SIGNALS[idx](tabObj.result, i) && tabObj[idx].amounts.length > 0) {
                    if (tabObj[idx].amounts[0] > 0) {
                        let res = await bet(pool, tabObj[idx].amounts[0], gameType, gameData.openDateList.number);
                        console.log(res);
                        if (res.result !== 1 && res.result !== '余额不足') {
                            throw(res);
                        }
                    }
                    tabObj[idx].betInfos[i] = [gameData.openDateList.number];
                    tabObj[idx].betPools[i] = [pool];
                    updateUI(tabObj, idx);
                    await GM.saveTab(tabObj);
                    continue;
                }
            }

            let betMaxIdx = tabObj[idx].betInfos[i].length - 1;
            if (tabObj[idx].betInfos[i][betMaxIdx] > tabObj.result[0].gameId) { // 还没有开奖
                continue;
            }
            if (!!tabObj[idx].betInfos[i] && tabObj[idx].betInfos[i].length > 0) { // 加码
                let resultedLen = tabObj.result.length;
                let resIdx = -1; // 防止跳期
                for (let gameIdx = resultedLen - 1; gameIdx >= 0; gameIdx--) {
                    if (tabObj[idx].betInfos[i][betMaxIdx] === tabObj.result[gameIdx].gameId) {
                        resIdx = gameIdx;
                        break;
                    }
                }
                let betRes = [-1, -1, -1, -1, -1];
                if (resIdx !== -1) {
                    betRes = tabObj.result[resIdx].nums;
                }
                let betMaskRes = resToMask(betRes, i);
                console.log(`方案${idx}开奖结果:`, i, betMaskRes, `resIdx:${resIdx}`);
                let poolMaxIdx = tabObj[idx].betPools[i].length - 1;
                if (tabObj[idx].betPools[i][poolMaxIdx].includes(betMaskRes)) { // 中奖
                    console.log("中奖", i, betRes);
                    tabObj[idx].betInfos[i] = [];
                    tabObj[idx].betPools[i] = [];
                    await GM.saveTab(tabObj);
                } else { // 不中奖
                    if (tabObj[idx].betInfos[i].length < tabObj[idx].amounts.length && SIGNALS[idx](tabObj.result, i)) { // 加码
                        let betInfosLen = tabObj[idx].betInfos[i].length;
                        if (tabObj[idx].amounts[betInfosLen] > 0) {
                            let res = await bet(pool, tabObj[idx].amounts[betInfosLen], gameType, gameData.openDateList.number);
                            console.log(res);
                            if (res.result !== 1 && res.result !== '余额不足') {
                                throw(res);
                            }
                        }
                        tabObj[idx].betInfos[i].push(gameData.openDateList.number);
                        tabObj[idx].betPools[i].push(pool);
                        updateUI(tabObj, idx);
                        await GM.saveTab(tabObj);
                    } else if (tabObj[idx].betInfos[i].length >= tabObj[idx].amounts.length) { // 已经加到最大 重新开始
                        tabObj[idx].betInfos[i] = [];
                        tabObj[idx].betPools[i] = [];
                        updateUI(tabObj, idx);
                        await GM.saveTab(tabObj);
                    }
                }
            }
        }
        // end work
    }
    async function main() {
        if (window !== top) {
            console.log("NOT THE TOP");
            return;
        }
        console.log("START...", new Date());
        if (window.location.pathname === "/login" || window.location.pathname === "/login/") { // login
            let user = await GM.getTab();

            console.log("DEBUG ", user);
            if (document.querySelector('#btnSearch')) {
                if (document.location.host == "f1.tt777.xyz") {
                    document.querySelector('#search').value = SEARCH_KEY2;
                } else {
                    document.querySelector('#search').value = SEARCH_KEY;
                }
                document.querySelector('#btnSearch').click();
                return;
            }
            if (!!user && !!user.name) {
                await wait(1000);
                document.querySelector('#userName').value = user.name;
                await wait(500);
                document.querySelector('#passWord').value = user.password;
                await wait(500);
                // close all
                let tabObj = await GM.getTab();
                for(let i = 0; i < OPTIONS_DESC.length; i++) {
                    if (tabObj[i]) {
                        tabObj[i].started = false;
                    }
                }
                await GM.saveTab(tabObj);
                // document.querySelector('.btn-primary').click();
            } else {
                document.querySelector('.login100-form-btn').onclick = async () => {
                    user.name = document.querySelector('#userName').value;
                    user.password = document.querySelector('#passWord').value;
                    await GM.saveTab(user);
                }
            }
            return;
        }
        if (window.location.pathname === "/loginvalidate") {
            await wait(500);
            document.querySelector('.hotBtn').click();
            return;
        }

        await waitResource(async () => {
            console.log(document.querySelector('#userName'));
            return typeof __sysinfo !== "undefined" && !!__sysinfo.data && !!__sysinfo.data.userName;
        });

        // update game Data
        setInterval(async () => {
            try {
                if (gameEndTime != 0 && gameEndTime + 1000 * 100 < new Date().getTime()) {
                    location.reload();
                }
                // don't need to update
                if (gameData && isPreviousOpened(gameData) && gameEndTime > new Date().getTime()) {
                    return;
                }
                gameData = await requestGameData(gameType);
                gameEndTime = new Date().getTime() + 1000 * gameData.openDateList.endTime;
                console.log('DEBUG:', gameData);
            } catch (err) {
                console.log(err);
                // ignore err
            }
        }, 10000);

        // update game history result
        setInterval(async () => {
            try {
                if (!!gameData && lastOpenedGameID < gameData.openNumList.newnumber) {
                    gameResult = parseResult(await requestGameResult(gameType));
                    lastOpenedGameID = gameResult[0].gameId;
                    console.log('DEBUG:', gameResult)
                }
            } catch (err) {
                console.log(err);
            }
        }, 5000);

        addUI();

        while (true) {
            if (document.querySelector('.myLayerOk') && document.querySelector('.myLayerTitle').innerText === '通知') { // clear 通知
                document.querySelector('.myLayerOk').click()
            }

            let tabObj = await GM.getTab();
            // console.log('tabObj: ', tabObj);

            for (let i = 0; i < OPTIONS_DESC.length; i++) {
                await updateUI(tabObj, i);
            }

            if (!gameData || !gameResult) {
                await wait(1000);
                continue;
            }
            if (gameData.openDateList.endTime < LEAST_END_TIME || !isPreviousOpened(gameData)) {
                await wait(1000);
                continue;
            }

            // update result
            let tabResult = tabObj.result ? tabObj.result : [];
            if (tabResult.length === 0 || tabResult[0].gameId < gameResult[0].gameId) {
                for (let i = gameResult.length - 1; i >= 0; i--) {
                    if (tabResult.length === 0 || tabResult[0].gameId < gameResult[i].gameId) {
                        tabResult.unshift(gameResult[i]);
                    }
                }
                tabObj.result = tabResult.slice(0,120);
                console.log("Results:", tabObj.result);
                await GM.saveTab(tabObj);
            }

            if (tabObj.result.length >= 11) {
                for (let i = 0; i < OPTIONS_DESC.length; i++) {
                    await work(tabObj, i);
                }
            }
            await wait(1000);
        }
    }

    main()
        .then(() => console.log("Main Done"))
        .catch((err) => {
        console.error(err, "Restart in 6 secs ...");
        setTimeout(() => location.reload(), 6 * 1000);
    });
})();