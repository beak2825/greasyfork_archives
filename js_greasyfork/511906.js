// ==UserScript==
// @name         Auto Reload Stake
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Auto reload on stake!自动加载，【Telegram @fcfcface auto claim codes.自动领取stake的奖金代码】
// @author       FCFC
// @match        https://stake.com/*?tab=reload&modal=vip*
// @match        https://stake.ac/*?tab=reload&modal=vip*
// @match        https://stake.games/*?tab=reload&modal=vip*
// @match        https://stake.bet/*?tab=reload&modal=vip*
// @match        https://stake.pink/*?tab=reload&modal=vip*
// @match        https://stake.mba/*?tab=reload&modal=vip*
// @match        https://stake.jp/*?tab=reload&modal=vip*
// @match        https://stake.bz/*?tab=reload&modal=vip*
// @match        https://stake.ceo/*?tab=reload&modal=vip*
// @match        https://stake.krd/*?tab=reload&modal=vip*
// @match        https://staketr.com/*?tab=reload&modal=vip*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @grant GM_deleteValue
// @grant GM_log
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511906/Auto%20Reload%20Stake.user.js
// @updateURL https://update.greasyfork.org/scripts/511906/Auto%20Reload%20Stake.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $(function(){
        var version = GM_info.script.version;
        var botName = GM_info.script.name;
        var currency = 'usdt'; // 这个币种自己修改一下
        var Reload_log_text = `Reload_log_text_${currency}`;
        var Reload_count_no_settle = `Reload_count_no_settle_${currency}`;
        var Reload_count = `Reload_count_${currency}`;
        var reloadInfo = null;
        var turnstile_wid;
        // 获取网站域名
        var websiteOrigin = window.location.origin;
        var href = `${websiteOrigin}/?tab=reload&modal=vip&currency=${currency}`;
        var Common = null;
        var API = null;
        var logText = '';

        init();
        async function init(){
            Common = CommonModel();
            // 添加turnstile js链接
            Common.appendScript();
            // 添加UI
            UIModel();
            logger('InitInitializing...');
            try {
                let session = Common.getCookie('session');
                API = APIModel(websiteOrigin, session);
                await Common.getReloadInfo(currency);
                logger('Init Success');
                // 执行主程序
                main();
            } catch(error) {
                logger(error.message);
            }
        }
        // main
        async function main() {
            let interval = 20*1000;
            let claimInterval = reloadInfo.claimInterval;
            while(true) {
                try {
                    // 执行检查逻辑
                    await Common.checkeReload(reloadInfo);
                    await Common.claimReload(currency);
                    await Common.getReloadInfo(currency);
                    await new Promise(resolve => setTimeout(resolve, claimInterval));
                }catch(error) {
                    console.log(error.message);
                    await Common.getReloadInfo(currency);
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            }
        }

        // Common unit
        function CommonModel() {
            return {
                getReloadInfo: async(currency) => {
                    try {
                        const response = await API.getReloadMeta(currency);
                        if (!response.ok) {
                            if (response.status == 403) {
                                window.location.reload();
                            }
                            throw new Error(`GET_RELOAD_META_ERROR Status: ${response.status}`);
                        }
                        const info = await response.json();
                        if (info.data) {
                            let reload = info.data.user.reload;
                            Common.dealReload(reload);
                        } else {
                            let errType = info.errors[0].errorType;
                            let errMsg = info.errors[0].message;
                            throw new Error(`GET_RELOAD_META_ERROR ${errMsg}`);
                        }
                    } catch(error) {
                        throw error
                    }
                },
                checkeReload: async(reloadInfo) => {
                    console.log('正在检查reload');
                    if (!reloadInfo.hasOwnProperty('active') || !reloadInfo.active) {
                        throw new Error('Reload is anactive');
                    }
                    let now = Date.now();
                    let claimTime = reloadInfo.lastClaim + reloadInfo.claimInterval;
                    if (now > reloadInfo.expireAt) {
                        throw new Error('Reload is Expire');
                    }
                    let claimDaily = claimTime - now;
                    if(claimDaily > 0) {
                        console.log(`还差多少时间可以领取：${claimDaily}`);
                        await new Promise(resolve => setTimeout(resolve, claimDaily));
                    }
                    console.log('直接可以领取');
                },
                claimReload: async(currency) => {
                    console.log('认领reload');
                    try {
                        // 获取验证码
                        let token = await turnstileObj.getToken();
                        turnstileObj.reset();
                        // 领取reload
                        const response = await API.claimReload(currency, token);
                        if (!response.ok) {
                            throw new Error(`CLAIM_RELOAD_ERROR Status: ${response.status}`);
                        }
                        const resInfo = await response.json();
                        console.log('领取结果',resInfo);
                        if (resInfo.data) {
                            const reload = resInfo.data.claimReload.reload.user.reload;
                            let amount = reload.amount.toFixed(8);
                            logger(`Claimed ${amount} ${currency}`);
                            Common.countReload(amount);
                        } else {
                            let errType = resInfo.errors[0].errorType;
                            let errMsg = resInfo.errors[0].message;
                            throw new Error(`CLAIM_RELOAD_ERROR ${errMsg}`);
                        }
                    } catch(error) {
                        turnstileObj.reset();
                        throw error;
                    }
                },
                getCookie(name) {
                    let cookies = document.cookie.split("; ");
                    for(let i = 0; i < cookies.length; i++) {
                        let cookie = cookies[i].split("=");
                        if(cookie[0] == name) {
                            return cookie[1];
                        }
                    }
                    return null;
                },
                appendScript() {
                    const r = document.createElement('script');
                    r.setAttribute('id', 'turnstile-scripts');
                    r.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
                    r.type = 'application/javascript';
                    document.head.append(r);
                },
                // 处理reload信息
                dealReload(reload){
                    let expireAt = new Date(reload.expireAt).getTime();
                    let lastClaim = new Date(reload.lastClaim).getTime();
                    let updatedAt = new Date(reload.updatedAt).getTime();
                    let createdAt = new Date(reload.createdAt).getTime();
                    reloadInfo = {
                        active: reload.active,
                        amount: reload.amount,
                        claimInterval: reload.claimInterval,
                        expireAt,
                        lastClaim,
                        updatedAt,
                        createdAt
                    }
                    let newInfo = {
                        active: reload.active,
                        amount: reload.amount,
                        claimInterval: reload.claimInterval,
                        expireAt: new Date(reload.expireAt).toLocaleString(),
                        lastClaim: new Date(reload.lastClaim).toLocaleString(),
                        updatedAt: new Date(reload.updatedAt).toLocaleString(),
                        createdAt: new Date(reload.createdAt).toLocaleString()
                    }
                    console.log('Reload Info', newInfo);
                },
                // 统计reload
                countReload(amount) {
                    let gm_amount = GM_getValue(Reload_count);
                    if (gm_amount) {
                        gm_amount = Number(gm_amount) + Number(amount);
                    } else {
                        gm_amount = amount;
                    }
                    gm_amount = gm_amount.toFixed(8);
                    GM_setValue(Reload_count, gm_amount);
                    $('#autoDropwrap .totle-reload').text(gm_amount);
                    let gm_amount_no_settle = GM_getValue(Reload_count_no_settle);
                    if (gm_amount_no_settle) {
                        gm_amount_no_settle = Number(gm_amount_no_settle) + Number(amount);
                    } else {
                        gm_amount_no_settle = amount;
                    }
                    gm_amount_no_settle = gm_amount_no_settle.toFixed(8);
                    GM_setValue(Reload_count_no_settle, gm_amount_no_settle);
                    $('#autoDropwrap .nosettle-reload').text(gm_amount_no_settle);
                },
            }
        }

        // 验证码处理
        const turnstileObj = {
            getToken: async () => new Promise((d, r) => {
                try {
                    let target = $('#autoDropwrap #_turnstile')[0]
                    const option = {
                        sitekey: '0x4AAAAAAAGD4gMGOTFnvupz',
                        theme: 'dark',
                        language: 'zh',
                        callback: d,
                        'error-callback': error => {
                            console.log('验证码挑战失败',error);
                            r(error);
                        }
                    };
                    console.log(target, option);
                    turnstile_wid = unsafeWindow.turnstile.render(target, option);
                } catch (error) {
                    console.log(error);
                    r(error);
                }
            }),
            reset: () => {
                unsafeWindow.turnstile.remove(turnstile_wid);
            }
        }

        /**
         * 添加插件UI到页面的方法
         */
        function UIModel() {
            var html = `<div id="drop-status" style="position:fixed;right: 0;top:300px;width:42px;height:30px;text-align:center;line-height:30px;background:#1475E1;color:#fff;font-size:12px;cursor:pointer;z-index:1000001;border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;">Reload</div>
                        <div id="autoDropwrap" style="position:fixed;top:192px;left:60px;z-index:1000000;background:rgba(0,0,0,.5);border-radius:5px;">
                            <div style="padding:10px;background:#213743;margin:0 auto;border-radius:5px;border:1px solid #000;">
                                 <div style="display:flex;align-items:center;justify-content: space-between;">
                                     <div style="font-size:14px;font-weight:bold;color:#fff">${botName}<span class="version"> v${version}</span></div>
                                     <button class="clear-log" style="color:#fff;border-radius:2px;padding:2px 6px;border: 2px solid #2f4553;font-size:12px;">清空日志</button>
                                 </div>
                                 <textarea class="log scrollY" cols="50" rows="20" readonly value="" style="padding:5px;margin-top:10px;font-size:12px;background:#0F212E;border-radius:4px;outline: none;font-family:auto;"></textarea>
                                 <div style="margin-top:5px;display: flex;align-items: center;justify-content: space-between;font-size:12px;background:#0F212E;border:2px solid #2f4553;height:40px;">
                                     <div style="font-size:12px;padding: 0 5px;">累计领取：<span class="totle-reload" style="color:#00C500;margin-right:20px;font-size:14px">0</span></div>
                                     <button class="clear-total" style="color:#b1bad3;padding:2px 6px;border-left: 2px solid #2f4553;">重置总额</button>
                                 </div>
                                 <div style="margin-top:5px;display: flex;align-items: center;justify-content: space-between;font-size:12px;background:#0F212E;border:2px solid #2f4553;height:40px;">
                                     <div style="font-size:12px;padding: 0 5px;">本期领取：<span class="nosettle-reload" style="color:#e19a14;font-size:14px">0</span></div>
                                     <button class="clear-nosettle" style="color:#b1bad3;padding:2px 6px;border-left: 2px solid #2f4553;">重置本期</button>
                                 </div>
                             </div>
                             <div id="_turnstile" style="displsy:none"></div>
                       </div>
            `
            $('body').append(html);
            $('#drop-status').click(async function(){
                $('#autoDropwrap').toggle();
                //toClaim();
            })
            Common.countReload(0);
            // 删除数据
            $('#autoDropwrap .clear-log').click(function(){
                GM_deleteValue(Reload_log_text);
                $('#autoDropwrap .log').val('');
            })
            $('#autoDropwrap .clear-total').click(function(){
                GM_deleteValue(Reload_count);
                $('#autoDropwrap .totle-reload').text(0);
            })
            $('#autoDropwrap .clear-nosettle').click(function(){
                GM_deleteValue(Reload_count_no_settle);
                $('#autoDropwrap .nosettle-reload').text(0);
            })
        }
        /**
         * 更新日志方法
         */
        function logger(text){
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours() >=10 ? date.getHours() : `0${date.getHours()}`;
            let min = date.getMinutes() >=10 ? date.getMinutes() : `0${date.getMinutes()}`;
            let second = date.getSeconds() >=10 ? date.getSeconds() : `0${date.getSeconds()}`;
            /*
            let timeStr = date.getTime()
            let timeStr1 = new Date(`${year}-${month}-${day} ${hour}:${min}:${second}`).getTime()
            let haomiao = timeStr - timeStr1 >= 100 ? timeStr - timeStr1 : `0${timeStr - timeStr1}`
            */
            let time = `${month}-${day} ${hour}:${min}:${second}`;
            let mark = `${time} | `;
            logText += `${mark}${text}\n`;
            $('#autoDropwrap .log').val(logText);
            $('#autoDropwrap .log').scrollTop(100000);
        }

        // API Model
        function APIModel(origin, session) {
            // fetch function
            function fetchFunctin(url, data, header) {
                let head = {
                    'Content-Type': 'application/json',
                }
                if (header && header.toString() !== '{}') {
                    head = Object.assign(head, header);
                }
                return fetch(url, {
                    method: 'POST',
                    headers: head,
                    body: JSON.stringify(data)
                });
            }
            const url = `${origin}/_api/graphql`;
            const header = {
                'x-access-token': session
            }
            return {
                getReloadMeta(currency) {
                    const data = {
                        query:"query ClaimReloadMeta($currency: CurrencyEnum!) {\n  user {\n    id\n    flags {\n      flag\n    }\n    flagProgress {\n      flag\n    }\n    reload: faucet {\n      id\n      amount(currency: $currency)\n      active\n      claimInterval\n      lastClaim\n      expireAt\n      createdAt\n      updatedAt\n    }\n  }\n}\n"
                        ,variables:{ currency: currency }
                    }
                    return fetchFunctin(url, data, header);
                },
                claimReload(currency, token) {
                    const data = {
                        query: "mutation ClaimFaucet($currency: CurrencyEnum!, $turnstileToken: String!) {\n  claimReload: claimFaucet(currency: $currency, turnstileToken: $turnstileToken) {\n    reload: faucet {\n      user {\n        id\n        reload: faucet {\n          id\n          amount(currency: $currency)\n          active\n          claimInterval\n          lastClaim\n          expireAt\n          createdAt\n          updatedAt\n        }\n      }\n    }\n  }\n}\n"
                        ,variables: {
                            currency: currency,
                            turnstileToken: token
                        }
                    }
                    return fetchFunctin(url, data, header);
                },
            }
        }
    })
})();