// ==UserScript==
// @name         Auto reload stake
// @namespace    http://tampermonkey.net/
// @version      1.3
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
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @grant GM_deleteValue
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/487184/Auto%20reload%20stake.user.js
// @updateURL https://update.greasyfork.org/scripts/487184/Auto%20reload%20stake.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $(function(){
        var version = '1.2';
        var currency = 'usdt'; // 这个币种自己修改一下
        var Reload_log_text = `Reload_log_text_${currency}`;
        var Reload_count_no_settle = `Reload_count_no_settle_${currency}`;
        var Reload_count = `Reload_count_${currency}`;
        var refreshTime = 5*60*1000;
        var clickSubmitTime = 15000;
        // 获取网站域名
        var websiteOrigin = window.location.origin;
        var href = `${websiteOrigin}/?tab=reload&modal=vip&currency=${currency}`;
        setInterval(function() {
            window.location.replace(href);
        }, refreshTime);

        setInterval(function() {
            if (href.indexOf('tab=reload') > -1) {
                document.querySelectorAll("button[type='submit']")[0].click();
            }
        }, clickSubmitTime);

        /**
         * 添加插件UI到页面的方法
         */
        function controlAction() {
            var html = `<div id="drop-status" style="position:fixed;right: 0;top:300px;width:42px;height:30px;text-align:center;line-height:30px;background:#1475E1;color:#fff;font-size:12px;cursor:pointer;z-index:1000001;border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;">日志</div>
                        <div id="autoDropwrap" style="position:fixed;top:192px;left:60px;z-index:1000000;background:rgba(0,0,0,.5);border-radius:5px;">
                            <div style="padding:10px;background:#213743;margin:0 auto;border-radius:5px;border:1px solid #000;">
                                 <div style="display:flex;align-items:center;justify-content: space-between;">
                                     <div style="font-size:14px;font-weight:bold;color:#fff">Auto claim reload <span class="version"></span></div>
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
                       </div>
            `
            $('body').append(html);
            $('#drop-status').click(function(){
                $('#autoDropwrap').toggle();
            })
            $('#autoDropwrap .version').text('v' + version);
            logger('init');
            countReload(0);
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
        controlAction();
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
            if (text == 'init') {
                let gm_text = GM_getValue(Reload_log_text);
                if (gm_text) {
                    GM_setValue(Reload_log_text,gm_text);
                    $('#autoDropwrap .log').val(gm_text);
                    $('#autoDropwrap .log').scrollTop(100000);
                }
            } else {
                let gm_text = GM_getValue(Reload_log_text);
                if (gm_text) {
                    gm_text+= `${mark}${text}\n`;
                } else {
                    gm_text = `${mark}${text}\n`;
                }
                GM_setValue(Reload_log_text,gm_text);
                $('#autoDropwrap .log').val(gm_text);
                $('#autoDropwrap .log').scrollTop(100000);
            }
        }
        function countReload(amount) {
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
        }
        /**
         reload": {
                        "id": "b10e4aa9-dcfb-4214-82ab-ffed1879ec9a",
                        "amount": 0.16028000275361046,
                        "active": true,
                        "claimInterval": 600000,
                        "lastClaim": "Sun, 11 Feb 2024 13:53:56 GMT",
                        "expireAt": "Tue, 13 Feb 2024 06:15:00 GMT",
                        "createdAt": "Tue, 06 Feb 2024 06:15:47 GMT",
                        "updatedAt": "Tue, 06 Feb 2024 06:15:47 GMT",
                        "__typename": "Faucet"
                    },
	     */
        let originFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (url, option) {
            const response = await originFetch(url, option);
            try {
                if (url.indexOf('_api/graphql') > -1 && option.body) {
                    let requestBody = JSON.parse(option.body);
                    if ( requestBody.query && requestBody.query.indexOf('ClaimFaucet') > -1){
                        let currency = requestBody.variables.currency
                        await response.clone().json().then(res => {
                            if (res.data) {
                                let reload = res.data.claimReload.reload.user.reload
                                let amount = reload.amount.toFixed(8)
                                logger(`Claimed ${amount} ${currency}`)
                                countReload(amount)
                            }
                        }).catch(e=> {
                            console.log('Handle data error：', e.message, e);
                        });
                    }
                }
            }catch(error){
                console.log(error.message);
            }
            return response;
        }
    })
    // Your code here...
})();