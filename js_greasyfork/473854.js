// ==UserScript==
// @name         B站直播免费人气票助手
// @namespace    https://greasyfork.org/users/1001518
// @version      0.1
// @description  B站直播间自动投免费人气票
// @author       DianaBlessU
// @match        https://live.bilibili.com/*
// @icon         https://bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/473817-gmx-menu/code/GMX_menu.js?version=1240400
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473854/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%8D%E8%B4%B9%E4%BA%BA%E6%B0%94%E7%A5%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473854/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%8D%E8%B4%B9%E4%BA%BA%E6%B0%94%E7%A5%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!location.pathname.match(/^\/(\d+)/)) return

    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function retry(fn, options){
        let defaults = {tries: 3, interval: 500, this: null, onerror: null}
        options = Object.assign(defaults, options ?? {})
        return async function(...args) {
            let count = 0
            while (true){
                try {
                    return await fn.apply(options.this ?? this, args);
                }
                catch (err){
                    count += 1
                    if (count == options.tries){
                        throw err
                    }
                    options.onerror && options.onerror(err, count, options);
                    if (options.interval){
                        await sleep(options.interval);
                    }
                }
            }
        }
    }

    class BiliError extends Error {
        constructor(code = code, ...params) {
            // Pass remaining arguments (including vendor specific ones) to parent constructor
            super(...params);
            // Maintains proper stack trace for where our error was thrown (only available on V8)
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, BiliError);
            }
            this.name = "BiliError";
            // Custom debugging information
            this.code = code
        }
    }

    class BiliApi {

        _retriables = ["getRoomInitInfo", "getPopularAnchorRank", "getUserPopularTicketsNum", "popularRankFreeScoreIncr", "sendMsg", "likeInteract"]

        constructor() {
            for (let method of this._retriables){
                this[method] = this._retry(this[method])
            }
        }

        _retry(fn, options){
            let mods = {onerror: function(err, count, options){
                console.log(`${fn.name} 执行失败, 将进行第${count}次重试`)
            }}
            options = Object.assign(mods, options ?? {})
            return retry(fn, options);
        }

        async getRoomInitInfo(room_id){
            let response = await fetch(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${room_id}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data.data;
            }else{
                throw new BiliError(data.code, 'getRoomInitInfo error: ' + JSON.stringify(data));
            }
        }

        async getPopularAnchorRank (ruid){
            const cookie = window.document.cookie;
            const uid = cookie.match(/DedeUserID=(\w+)/)[1];
            let response = await fetch(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getPopularAnchorRank?uid=${uid}&ruid=${ruid}&clientType=2`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data.data;
            }else{
                throw new BiliError(data.code, 'getPopularAnchorRank() error: ' + JSON.stringify(data));
            }
        }

        async getUserPopularTicketsNum(ruid){
            const cookie = window.document.cookie;
            const uid = cookie.match(/DedeUserID=(\w+)/)[1];
            let response = await fetch(`https://api.live.bilibili.com/xlive/general-interface/v1/rank/getUserPopularTicketsNum?ruid=${ruid}&source=0`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data.data;
            }else{
                throw new BiliError(data.code, 'getUserPopularTicketsNum() error: ' + JSON.stringify(data));
            }
        }

        async popularRankFreeScoreIncr(ruid){
            const cookie = window.document.cookie;
            const csrf = cookie.match(/bili_jct=(\w+)/)[1];
            let response = await fetch("https://api.live.bilibili.com/xlive/general-interface/v1/rank/popularRankFreeScoreIncr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `ruid=${ruid}&csrf_token=${csrf}&csrf=${csrf}&visit_id=`,
                credentials: "include",
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data.data?.num;
            }else{
                throw new BiliError(data.code, 'popularRankFreeScoreIncr() error: ' + JSON.stringify(data))
            }
        }

        async sendMsg(roomid, msg){
            const cookie = window.document.cookie;
            const csrf = cookie.match(/bili_jct=(\w+)/)[1];
            let danmakus = [
                "(⌒▽⌒).",
                "（￣▽￣）.",
                "(=・ω・=).",
                "(｀・ω・´).",
                "(〜￣△￣)〜.",
                "(･∀･).",
                "(°∀°)ﾉ.",
                "(￣3￣).",
                "╮(￣▽￣)╭.",
                "_(:3」∠)_.",
                "(^・ω・^ ).",
                "(●￣(ｴ)￣●).",
                "ε=ε=(ノ≧∇≦)ノ.",
                "⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄.",
                "←◡←.",
            ]
            let formData = new FormData();
            formData.set("bubble", 0);
            formData.set("color", 16777215);
            formData.set("mode", 1);
            formData.set("fontsize", 25);
            formData.set("csrf", csrf);
            formData.set("csrf_token", csrf);
            formData.set("msg", msg ?? danmakus[(Math.random() * 100 >> 0) % danmakus.length]);
            formData.set("roomid", roomid);
            formData.set("rnd", Math.floor(new Date() / 1000));
            let response = await fetch("//api.live.bilibili.com/msg/send", {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data
            }else{
                throw new BiliError(data.code, 'sendMsg() error: ' + JSON.stringify(data));
            }
        }

        async likeInteract(roomid){
            const cookie = window.document.cookie;
            const csrf = cookie.match(/bili_jct=(\w+)/)[1];
            let response = await fetch("https://api.live.bilibili.com/xlive/web-ucenter/v1/interact/likeInteract", {
                "method": "POST",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "Mozilla/5.0 BiliDroid/6.73.1 (bbcallen@gmail.com) os/android model/Mi 10 Pro mobi_app/android build/6731100 channel/xiaomi innerVer/6731110 osVer/12 network/2",
                },
                "body": `roomid=${roomid}&csrf_token=${csrf}&csrf=${csrf}&visit_id=`,
                "mode": "cors",
                "credentials": "include"
            })
            let data = await response.json() ?? {};
            if (data.code == 0){
                return data
            }else{
                throw new BiliError(data.code, 'likeInteract() error: ' + JSON.stringify(data));
            }
        }
    }

    class Echo {
        speaker = "Echo";
        badget_style = "display: inline-block ; background-color: #fc966e ; color: black ; font-weight: bold ; padding: 0px 4px ; border-radius: 3px ;";
        body_style = "color: inherit";
        constructor(speaker) {
            this.speaker = speaker
        }
        format (str){return `%c${this.speaker}%c ${new Date().toLocaleString()} ${str}`};
        log (str){console.log(this.format(str), this.badget_style, this.body_style)};
        info (str){console.info(this.format(str), this.badget_style, this.body_style)};
        warn (str){console.warn(this.format(str), this.badget_style, this.body_style)};
        error (str){console.error(this.format(str), this.badget_style, this.body_style)};
        debug (str){console.debug(this.format(str), this.badget_style, this.body_style)};
    }

    function getPromiseState(p){
        const t = {};
        return Promise.race([p, t]).then(v => v === t ? "pending" : "fulfilled", () => "rejected")
    }

    function getDeadline(ts){
        return ts - ts % 3600 + 3600
    }

    function getTimestamp(dt){
        return parseInt((dt ? new Date(dt) : new Date()) / 1000)
    }

    const api = new BiliApi()

    class TicketBot {

        interval = 300000

        constructor(options) {
            this.running = false;
            this.paused = false;
            this.busywith = null;
            this.curr_iid = 0;
            this.live_time = -62170012800;
            this.logger = options?.logger ?? console
        }

        async _process(forced) {
            try{
                var room_id = location.pathname.match(/^\/(\d+)/)[1];
                let init_info = await api.getRoomInitInfo(room_id);
                room_id = init_info.room_id;
                if (init_info.live_status !== 1) {
                    this.logger.log("直播间未开播");
                    if(!forced) return
                }
                let live_time = init_info.live_time;
                if (this.live_time != live_time) {
                    this.live_time = live_time
                    if(init_info.live_status === 1){
                        this.logger.log(`本场开播时间：${new Date(live_time*1000).toLocaleString()}`)
                    }
                }
                await sleep(500);
                let anchor_info = await api.getPopularAnchorRank(init_info.uid);
                if (!anchor_info.user_medal.level){
                    this.logger.log("未加入粉丝团，无法获取免费人气票");
                    return
                }
                //await api.likeInteract(room_id);
                if (!anchor_info.user_medal.is_light) {
                    this.logger.log("粉丝牌未点亮，尝试发弹幕点亮牌子");
                    await sleep(500);
                    await api.sendMsg(room_id);
                    return
                }
                if (!forced) {
                    let ddl0_time = getDeadline(live_time); // 开播后第一轮投票截止时间
                    // 处于开播后第一轮投票周期内，且开播不到15分钟就截止投票的情况
                    if (getTimestamp() < ddl0_time + 10 && ddl0_time - live_time < 900) {
                        this.logger.log("开播时间临近结算时间，待下一个整点后再投票");
                        return
                    }
                }
                await sleep(500);
                let ticket_info = await api.getUserPopularTicketsNum(init_info.uid);
                if (ticket_info.free_ticket.num > 0) {
                    this.logger.log(`剩余${ticket_info.free_ticket.num}张免费人气票，即将投出`);
                    await sleep(500);
                    let num = await api.popularRankFreeScoreIncr(init_info.uid);
                    this.logger.log(`成功投出免费人气票${num}张`);
                }else{
                    this.logger.log(`没有余票`);
                };
            }catch(err){
                this.logger.error(err)
            }
        }

        async process(forced) {
            this.busywith = this._process(forced);
            await this.busywith;
        }

        async pause() {
            if (!this.paused){
                this.paused = true;
                clearInterval(this.curr_iid);
                await this.busywith;
                this.running = false;
                this.logger.log("已暂停");
            }
        }

        async start() {
            if (this.paused){
                this.paused = false;
                if (await getPromiseState(this.busywith)=="pending") {
                    this.logger.debug("正在恢复...");
                    await this.busywith;
                    await sleep(500);
                }
                this.loop_forever(true);
                this.logger.log("已从暂停状态恢复");
            } else {
                this.loop_forever();
            }
        }

        loop_forever(overridden){
            if (this.running && !overridden) return
            this.running = true;
            this.curr_iid = setInterval(()=>{
                this.process();
            }, this.interval)
            this.process(); // 设好定时器后立即执行
            this.logger.log("主循环已启动");
        }
    }

    const echo = new Echo("TicketBot");
    const bot = new TicketBot({logger:echo});

    const activity = {
        skd_tid : 0,
        // for cmd_start
        start: function(){
            activity.skd_tid && clearTimeout(activity.skd_tid)
            bot.start()
        },
        // for cmd_pause
        pause: function(){
            activity.skd_tid && clearTimeout(activity.skd_tid)
            bot.pause()
        },
        // for cmd_schedule
        schedule:async function(){
            let ts = getTimestamp();
            let ddl = getDeadline(ts)
            await bot.pause();
            echo.log(`已创建计划，将在${new Date(ddl*1000).toLocaleString()}启动`);
            activity.skd_tid = setTimeout(()=>{
                activity.skd_tid = 0;
                GMX_menu.isChecked("cmd_schedule") && GMX_menu.triggerSelect("cmd_start")
            },(ddl - ts)*1000)
        }
    }

    const gmx_menu_items = [
        {name: "cmd_start", text: "启动自动投票", checked: true, group: "activity", callback: activity.start},
        {name: "cmd_pause", text: "暂停自动投票", checked: false, group: "activity", callback: activity.pause},
        {name: "cmd_schedule", text: "暂停直到整点启动", checked: false, group: "activity", callback: activity.schedule},
        {name: "sep_1", separator: true},
        {name: "cmd_shoot", text: "⚡️ 立即投票", callback: ()=>bot.process(true)},
    ]

    async function main(){
        await sleep(5000);
        GMX_menu.install({items: gmx_menu_items})
        bot.start();
    }

    main();

})();