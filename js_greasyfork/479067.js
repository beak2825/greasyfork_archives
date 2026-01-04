// ==UserScript==
// @name         BiliOnlineHook
// @description  弹幕HOOK框架，B站直播间同接数显示，显示进房速率、弹幕速率
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @author       jeffz615
// @match        *://live.bilibili.com/*
// @match        *://live.bilibili.com/blanc/*
// @icon         https://live.bilibili.com/favicon.ico
// @run-at       document-end
// @sandbox      raw
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479067/BiliOnlineHook.user.js
// @updateURL https://update.greasyfork.org/scripts/479067/BiliOnlineHook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hook_wrapper() {
        const SECOND_TIME = 1000;
        const MINUTE_TIME = 60 * SECOND_TIME;
        const RECORD_THRES_TIME = 5 * MINUTE_TIME;
        let g_rank_count = 0; // 统计同接
        let g_online_count = 0; // 统计同接
        let g_enter_record_5min = new Map(); // 统计5min内进房速率
        let g_danmu_record_5min = [];
        let g_record_start_time = new Date().getTime();

        let g_interval_num_10s = setInterval(() => {
            const now_ts = new Date().getTime();
            let record_time = 5; // 5分钟
            if (now_ts - g_record_start_time < RECORD_THRES_TIME) {
                record_time = (now_ts - g_record_start_time) / MINUTE_TIME;
                if (record_time === 0) {
                    return;
                }
            }
            let valid_enter_count = 0;
            for (let [uid, ts] of g_enter_record_5min) {
                if (now_ts - ts > RECORD_THRES_TIME) {
                    g_enter_record_5min.delete(uid);
                } else {
                    valid_enter_count++;
                }
            }
            let valid_danmu_count = g_danmu_record_5min.length;
            while (typeof g_danmu_record_5min[0] !== 'undefined' && now_ts - g_danmu_record_5min[0] > RECORD_THRES_TIME) {
                g_danmu_record_5min.shift();
                valid_danmu_count--;
            }
            const enter_rate = valid_enter_count / record_time; // 以分钟为单位的进房速率
            const danmu_rate = valid_danmu_count / record_time; // 以分钟为单位的弹幕速率
            const rate_text = '| 进房：' + enter_rate.toFixed(2) + '人/min | 弹幕：' + danmu_rate.toFixed(2) + '条/min |';
            console.debug('[BiliOnlineHook]', rate_text);
            let rate_text_span = document.getElementById('ext-rate-text');
            if (rate_text_span === null) {
                const right_ctnr = document.querySelectorAll('#head-info-vm > div > div > div.upper-row > div.right-ctnr');
                if (right_ctnr.length > 0) {
                    const div = document.createElement('div');
                    div.setAttribute('class', 'icon-ctnr live-skin-normal-a-text not-hover');
                    const span = document.createElement('span');
                    span.setAttribute('id', 'ext-rate-text');
                    span.setAttribute('class', 'action-text v-middle ext-rate-text');
                    span.innerText = rate_text;
                    div.appendChild(span);
                    right_ctnr[0].insertBefore(div, right_ctnr[0].firstChild);
                }
            } else {
                rate_text_span.innerText = rate_text;
            }
        }, 10 * SECOND_TIME); // 每10秒统计一次

        function on_online_rank_count(obj) {
            const rank_count = obj.data.count;
            const online_count = obj.data.online_count;
            console.debug('[BiliOnlineHook] ONLINE_RANK_COUNT', rank_count, online_count);
            let flag = false;
            if (rank_count && rank_count !== g_rank_count) {
                g_rank_count = rank_count;
                flag = true;
            }
            if (online_count && online_count !== g_online_count) {
                g_online_count = online_count;
                flag = true;
            }
            if (flag) {
                const showers = document.querySelectorAll("#rank-list-ctnr-box > div.tabs > ul > li.item");
                if (showers.length > 0) {
                    const origin_text = showers[0].innerText.split('(')[0];
                    showers[0].innerText = origin_text + '(' + g_rank_count + '/' + g_online_count + ')';
                    showers[0].setAttribute('title', '除号左边是贡献值非0人数，右边是所有人数。' + (g_online_count === 0 ? '' : ('计算结果：' + (g_rank_count / g_online_count * 100).toFixed(2) + '%')));
                }
            }
        }

        function on_send_gift(obj) {
            function calc_total_price(obj) {
                return obj.data.coin_type === 'gold' ? (obj.data.total_coin / 1000).toFixed(2) : '0.00';
            }

            console.debug('[BiliOnlineHook] SEND_GIFT', obj.data.uid, obj.data.uname, obj.data.action, obj.data.giftName, 'x', obj.data.num,
                calc_total_price(obj));
        }

        function on_danmu_msg(obj) {
            if (obj.info.length === 0 || obj.info[0].length <= 16 || obj.info[0][16].activity_identity !== '') {
                return;
            }
            /* uid, uname, msg */
            console.debug('[BiliOnlineHook] DANMU_MSG', obj.info[2][0], obj.info[2][1], obj.info[1]);
            g_danmu_record_5min.push(obj.info[0][4]);
        }

        function on_guard_buy(obj) {
            /* uid, username, num, price, gift_name */
            console.debug('[BiliOnlineHook] GUARD_BUY', obj.data.uid, obj.data.username, obj.data.num, obj.data.price, obj.data.gift_name);
        }

        function on_super_chat_message(obj) {
            /* uid, uname, message, price, rmb */
            console.debug('[BiliOnlineHook] SUPER_CHAT_MESSAGE', obj.data.uid, obj.data.uname, obj.data.message, obj.data.price, obj.data.rmb);
        }

        function on_interact_word(obj) {
            /* uid, uname */
            console.debug('[BiliOnlineHook] INTERACT_WORD', obj.data.uid, obj.data.uname);
            g_enter_record_5min.set(obj.data.uid, obj.data.trigger_time / (SECOND_TIME * 1000));
        }

        function on_entry_effect(obj) {
            /* uid, uinfo */
            console.debug('[BiliOnlineHook] ENTRY_EFFECT', obj.data.uid, obj.data.uinfo.base.name);
            g_enter_record_5min.set(obj.data.uid, obj.data.trigger_time / (SECOND_TIME * 1000));
        }

        function on_raw(obj) {
            console.debug('[BiliOnlineHook]', obj);
        }

        const cb_map = {
            "ONLINE_RANK_COUNT": on_online_rank_count,
            "SEND_GIFT": on_send_gift,
            "DANMU_MSG": on_danmu_msg,
            "GUARD_BUY": on_guard_buy,
            "SUPER_CHAT_MESSAGE": on_super_chat_message,
            "ENTRY_EFFECT": on_entry_effect,
            "INTERACT_WORD": on_interact_word,
        };

        function check_stack() {
            const callstack = new Error().stack.split("\n");
            if (callstack.length < 4) {
                return false;
            }
            for (let call_func of callstack.slice(3)) {
                if (call_func.includes(".convertToObject ")) {
                    continue;
                } else if (call_func.includes(".onMessage ")) {
                    return true;
                }
                break;
            }
            return false;
        }

        const origin_parse = JSON.parse;
        JSON.parse = function (...args) {
            let result = origin_parse.apply(this, args);
            if (result && result.cmd && check_stack()) {
                const cb_func = cb_map[result.cmd];
                try {
                    if (cb_func) cb_func(result);
                } catch (err) {
                }
            }
            return result;
        }
    }
    if (/^https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/.test(document.URL)) {
        hook_wrapper();
    }
})();
