// ==UserScript==
// @name         跟单
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @include        http*://q1.88666333.com/*
// @grant   GM_xmlhttpRequest
// @grant   GM.getTab
// @grant   GM.saveTab
// @grant   GM.setValue
// @grant   GM.getValue
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/408169/%E8%B7%9F%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/408169/%E8%B7%9F%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const THREAD_SIZE = 10;
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
                interval: 1000,
                max: 6
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


    function requestAsync(data) {
        // console.log(data);
        return new Promise((resolve, reject) => {
            var reportAJAX_Error = (rspObj) => {
                console.error (`Request error: ${data}`);
                reject(`Request => Error ${data}  RES ${rspObj.status}!  ${rspObj.statusText}`);
            }

            var processJSON_Response = (rspObj) => {
                if (rspObj.status != 200 && rspObj.status != 304) {
                    reportAJAX_Error (rspObj);
                } else {
                    let resJSON = {};
                    try{
                        resJSON = JSON.parse(rspObj.responseText);
                    } catch(err) {
                        // ignore
                        console.log(err);
                    }
                    resolve(resJSON);
                }
            };
            GM_xmlhttpRequest ( {
                method:         "POST",
                url:            document.location.origin + "/!/MemberBet",
                headers: {
                    "Referer": document.location.href,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data:           data,
                // responseType:   "json",
                onload:         processJSON_Response,
                onabort:        reportAJAX_Error,
                onerror:        reportAJAX_Error,
                ontimeout:      reportAJAX_Error
            });
        });
    }

    function getOrdersAsync(account, gameType, gameCode, pageIndex) {
        return new Promise((resolve, reject) => {
            $.get(`${document.location.origin}/!/UserBets?Account=${account}&GameType=${gameType}&GameCode=${gameCode}&PageSize=100&PageIndex=${pageIndex}`).done(function(result) {
                resolve(result);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                reject(`Request => Error ${errorThrown}  status ${textStatus}`);
            });
        });
    }
    function resToMask(res) {
        let placeHolders = ['abcXX', 'abXcX', 'abXXc', 'aXbcX', 'aXbXc', 'aXXbc', 'XabcX', 'XabXc', 'XaXbc', 'XXabc'];
        return placeHolders.map(a => {
            let mask = 'XXXXX'.split('');
            for(let i = 0; i < 5; i++) {
                if (a[i] !== 'X') {
                    mask[i] = res[i];
                }
            }
            return mask.join('');
        });
    }

    function signalA(pool) {
        return false;
    }

    async function bet(pools) {
        let count = pools.length;
        // %3D
        //const REQ_DATA = `SourceType=quick-comb&SourceData=%7B%22bet-type%22%3A%22d3%22%2C%22bet-count%22%3A${count}%2C%22dingwei-include%22%3A1%2C%22dingwei-1%22%3A%2212%22%2C%22dingwei-2%22%3A%221%22%2C%22dingwei-3%22%3A%221%22%2C%22hefeng-include%22%3A1%2C%22dan-include%22%3A1%2C%22shuang-include%22%3A1%7D&Game=${GameType}&Pools=${pools.join('%2C')}&Amount=${amount}`;
        const REQ_DATA = `SourceType=txt-import&SourceData=${count}+%E4%B8%AA%E5%8F%B7%E7%A0%81%EF%BC%88%E5%B8%A6%E9%87%91%E9%A2%9D%EF%BC%89&Game=${GameType}&Pools=${pools.join('%2C')}&Amount=`;
        console.log(REQ_DATA);
        return await requestAsync(REQ_DATA);
    }

    function addUI() {
        let div=document.createElement("div");
        div.setAttribute("style", "width:360px");
        let btn=document.createElement("BUTTON");
        btn.setAttribute("id", "betBtn");
        div.appendChild(btn);
        let amount = document.createElement("INPUT");
        amount.setAttribute("id", "sigAccount");
        amount.setAttribute("placeholder", "跟单信号源");
        amount.setAttribute("type", "text");
        div.appendChild(amount);
        let node = document.querySelector('#branch-info');
        let parentNode = node.parentNode;
        parentNode.insertBefore(div, node);
    }

    async function main() {
        if (window !== top) {
            console.log(window.location.href);
            //  let summaryUsersGame = document.querySelector("a[href='summary-users-game.html']");
            if (window.location.pathname.includes("summary-users.html")) {
                while (true) {
                    let summaryUsersGame = document.querySelector("a[href='summary-users-game.html']");
                    if (summaryUsersGame && summaryUsersGame.classList[0] !== 'active') {
                        summaryUsersGame.click();
                    }
                    await wait(3000);
                }
            } else {
                return;
            }
        }

        console.log("START...", new Date());
        if (window.location.pathname === "/") { // login
            let user = await GM.getTab();
            console.log("DEBUG ", user);
            if (!!user && !!user.name) {
                await wait(1000);
                document.querySelector('#login-id').value = user.name;
                await wait(500);
                document.querySelector('#password').value = user.password;
                await wait(500);
                document.querySelector('.btn-primary').click();
            } else {
                document.querySelector('.btn-primary').onclick = async () => {
                    user.name = document.querySelector('#login-id').value;
                    user.password = document.querySelector('#password').value;
                    await GM.saveTab(user);
                }
            }
            return;
        }
        if (window.location.pathname === "/agreement.html") {
            await wait(500);
            document.querySelector('#lnk-agree').click();
            return;
        }
        await waitResource(async () => {
            console.log(document.querySelector('#account'));
            return typeof ENV === "object" && ENV !== null && !!ENV[GameType] && !!ENV[GameType].Resulted;
        });
        if (!!document.querySelector('#branch-info')) // member
        {
            addUI();
            while (true) {
                await GM.setValue("currentGameCode", ENV[GameType].Current.Code);
                let tabObj = await GM.getTab();
                // console.log('tabObj: ', tabObj);
                if (tabObj.started) {
                    if (tabObj.gameType !== GameType) {
                        document.querySelector(`#game-type-${tabObj.gameType}`).click();
                    }
                    document.querySelector('#betBtn').innerText = `结束`;
                    document.querySelector("#sigAccount").value = await GM.getValue('sigAccount');
                    document.querySelector('#betBtn').onclick = async () => {
                        tabObj.started = false;
                        await GM.saveTab(tabObj);
                        await GM.setValue('sigGameType', null);
                        await GM.setValue('sigAccount', null);
                        document.querySelector('#betBtn').innerText = "...";
                    }
                } else {
                    document.querySelector('#betBtn').innerText = "开始";
                    document.querySelector('#betBtn').onclick = async () => {
                        tabObj.started = true;
                        tabObj.gameType = GameType;
                        tabObj.betInfo = {
                            gameCode: ENV[GameType].Current.Code,
                            betIdMap: {}
                        };
                        await GM.saveTab(tabObj);
                        await GM.setValue('sigGameType', GameType);
                        await GM.setValue('sigAccount', document.querySelector("#sigAccount").value);
                        document.querySelector('#betBtn').innerText = "...";
                    }
                }

                if (!tabObj.started || new Date().getTime() / 1000 > ENV[GameType].Current.Close) {
                    await wait(1000);
                    continue;
                }
                let sigOrders = await GM.getValue("sigOrders", {});
                if (sigOrders.gameCode !== ENV[GameType].Current.Code) {
                    console.log("Game code not current");
                    await wait(1000);
                    continue;
                }
                if (tabObj.betInfo.gameCode !== ENV[GameType].Current.Code) {
                    tabObj.betInfo.gameCode = ENV[GameType].Current.Code;
                    tabObj.betInfo.betIdMap = {};
                }
                // work
                let betId = 0;
                Object.keys(sigOrders.pools).forEach((key) => {
                    if (betId === 0 && !tabObj.betInfo.betIdMap[key]) {
                        betId = parseInt(key);
                    }
                });
                //
                if (betId > 0) {
                    // if (true) {
                    let res = await bet(sigOrders.pools[betId]);
                    if (res.Error && res.Error !== '额度不足' && res.Error !== '账号已停用下注') {
                        throw(res);
                    }
                    console.log(res);
                    console.log("betId", betId, tabObj.betInfo);
                    tabObj.betInfo.betIdMap[betId] = true;
                    await GM.saveTab(tabObj);
                    continue;
                }
                // end work
                await wait(1000);
            }
        } else if (!!document.querySelector('#user-link')) { // signal
            while (true) {
                // 打开报表
                if (document.querySelector('a[href="/a/summary-users.html').classList[1] !== 'selected') {
                    document.querySelector('a[href="/a/summary-users.html').click();
                    await wait(5000);
                    continue;
                }
                let sigAccount = await GM.getValue("sigAccount");
                let sigGameType = await GM.getValue("sigGameType");
                console.log(sigAccount, sigGameType);
                if (!sigAccount || !sigGameType) {
                    await wait(1000);
                    continue;
                }
                let sigOrders = await GM.getValue("sigOrders", {});
                console.log("DEBUG sigOrder init", sigOrders);
                if (sigOrders.gameType !== sigGameType || sigOrders.gameCode !== ENV[sigGameType].Current.Code) {
                    sigOrders.gameType = sigGameType;
                    sigOrders.gameCode = ENV[sigGameType].Current.Code;
                    sigOrders.pools = {};
                    sigOrders.total = 0;
                }
                let res = null;
                try {
                    res = await getOrdersAsync(sigAccount,sigGameType, sigOrders.gameCode, 0);
                    await wait(1000);
                } catch (err) {
                    console.log('ignore error:', err);
                    continue;
                }
                let remainPages = Math.ceil((res.Total - sigOrders.total) / 100);
                console.log("remain pages", remainPages, res.Total, sigOrders.total);
                let idx = 0;
                let rows = [];
                let baseIdx = 0;
                while (remainPages > 0) {
                    let jobSize = remainPages <= THREAD_SIZE ? remainPages : THREAD_SIZE;
                    let jobReses = await Promise.all([...Array(jobSize).keys()].map((a) => getOrdersAsync(sigAccount,sigGameType, sigOrders.gameCode, a + baseIdx)));
                    console.log("jobs result", jobReses);
                    jobReses.forEach((res) => {
                        for (let i = 0; i < res.List.length && (rows.length < res.Total - sigOrders.total); i++) {
                            rows.push({
                                betId: res.List[i].BetID,
                                pool: res.List[i].Pool,
                                amount: res.List[i].Amounts[0] / 1000
                            });
                        }
                    });
                    await wait(1000);
                    remainPages -= jobSize;
                    baseIdx += jobSize;
                }

                for (let i = rows.length - 1; i >= 0; i--) {
                    let id = rows[i].betId;
                    if (!Array.isArray(sigOrders.pools[id])) { // new a bet
                        sigOrders.pools[id] = [];
                    }
                    sigOrders.pools[id].push(`${rows[i].pool}%3D${rows[i].amount}`);
                    sigOrders.total++;
                }
                // console.log(sigOrders);
                await GM.setValue("sigOrders", sigOrders);
                await wait(2000);
            }
        }
    }
    main()
        .then(() => console.log("Main Done"))
        .catch((err) => {
        console.error(err, "Restart in 6 secs ...");
        setTimeout(() => location.reload(), 6 * 1000);
    });
})();