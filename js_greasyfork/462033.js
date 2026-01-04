// ==UserScript==
// @name         A兵
// @namespace    https://greasyfork.org/users/1001518
// @version      0.5.20
// @description  ~
// @author       DianaBlessU
// @match        https://www.bilibili.com/v/topic/detail*
// @match        https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png?*
// @icon         https://s1.ax1x.com/2022/10/09/xJCaYF.png
// @run-at       document-end
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      bilibili.com
// @connect      biliapi.net
// @connect      47.106.129.20
// @connect      43.139.57.209
// @connect      154.9.228.4
// @connect      a.rainplay.cn
// @connect      gitee.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462033/A%E5%85%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/462033/A%E5%85%B5.meta.js
// ==/UserScript==


(function () {

    if (location.href.startsWith('https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png?')) {
        //用于获取授权
        window.stop();
        let result = location.href.match(/mid=(\d+)/);
        let mid = result ? result[1] : ""
        if (mid) {
            let result = location.href.match(/access_key=([0-9a-z]{32})/);
            let key = result ? result[1] : "";
            let users = GM_getValue("users", {});
            if (users[mid] === ""){
                users[mid] = key;
                GM_setValue("users", users);
            }
        }
        return
    }

    const VERSION = "0.5.20";

    const remoteConfigURL = "http://154.9.228.4:8090/json/uid.json";

    // Build a worker from an anonymous function body
    const blobURL = URL.createObjectURL(
        new Blob(
            [
                "(",

                function () {
                    const intervalIds = {};

                    // 监听message 开始执行定时器或者销毁
                    self.onmessage = function onMsgFunc(e) {
                        switch (e.data.command) {
                            case "interval:start": // 开启定时器
                                var intervalId = setInterval(function () {
                                    postMessage({
                                        message: "interval:tick",
                                        id: e.data.id,
                                    });
                                }, e.data.interval);

                                postMessage({
                                    message: "interval:started",
                                    id: e.data.id,
                                });

                                intervalIds[e.data.id] = intervalId;
                                break;
                            case "interval:clear": // 销毁
                                clearInterval(intervalIds[e.data.id]);

                                postMessage({
                                    message: "interval:cleared",
                                    id: e.data.id,
                                });

                                delete intervalIds[e.data.id];
                                break;
                        }
                    };
                }.toString(),

                ")()",
            ],
            { type: "application/javascript" }
        )
    );

    const worker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    const workerTimer = {
        id: 0,
        callbacks: {},
        setInterval: function (cb, interval, context) {
            this.id++;
            const id = this.id;
            this.callbacks[id] = { fn: cb, context: context };
            worker.postMessage({
                command: "interval:start",
                interval: interval,
                id: id,
            });
            return id;
        },
        setTimeout: function (cb, timeout, context) {
            this.id++;
            const id = this.id;
            this.callbacks[id] = { fn: cb, context: context };
            worker.postMessage({ command: "timeout:start", timeout: timeout, id: id });
            return id;
        },

        // 监听worker 里面的定时器发送的message 然后执行回调函数
        onMessage: function (e) {
            switch (e.data.message) {
                case "interval:tick":
                case "timeout:tick": {
                    const callbackItem = this.callbacks[e.data.id];
                    if (callbackItem && callbackItem.fn) callbackItem.fn.apply(callbackItem.context);
                    break;
                }

                case "interval:cleared":
                case "timeout:cleared":
                    delete this.callbacks[e.data.id];
                    break;
            }
        },
        // 往worker里面发送销毁指令
        clearInterval: function (id) {
            worker.postMessage({ command: "interval:clear", id: id });
        },
        clearTimeout: function (id) {
            worker.postMessage({ command: "timeout:clear", id: id });
        },
    };

    worker.onmessage = workerTimer.onMessage.bind(workerTimer);

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    const cssText = `
        .link-toast {
            pointer-events: none
        }
        .link-toast {
            position: absolute;
            padding: 12px 24px;
            font-size: 14px;
            border-radius: 8px;
            white-space: nowrap;
            color: #fff;
            -webkit-animation: link-msg-move-in-top cubic-bezier(.22,.58,.12,.98) .4s;
            animation: link-msg-move-in-top cubic-bezier(.22,.58,.12,.98) .4s;
            z-index: 10000;
        }

        .link-toast.fixed {
            position: fixed;
            text-align: left;
        }

        .link-toast.success {
            background-color: #47d279;
            box-shadow: 0 .2em .1em .1em rgba(71,210,121,.2)
        }

        .link-toast.caution {
            background-color: #ffb243;
            box-shadow: 0 .2em .1em .1em rgba(255,190,68,.2)
        }

        .link-toast.error {
            background-color: #ff6464;
            box-shadow: 0 .2em 1em .1em rgba(255,100,100,.2)
        }

        .link-toast.info {
            background-color: #48bbf8;
            box-shadow: 0 .2em .1em .1em rgba(72,187,248,.2)
        }

        .link-toast.out {
            -webkit-animation: link-msg-fade-out cubic-bezier(.22,.58,.12,.98) .4s;
            animation: link-msg-fade-out cubic-bezier(.22,.58,.12,.98) .4s
        }

        .toast-text a {
            display: inline-block;
            color: #fff
        }

    `;

    function addCss(css) {
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else {
            const node = document.createElement("style");
            node.appendChild(document.createTextNode(css));
            const heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
    }

    function secTotime(s) {
        var t = "";
        if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            if (hour < 10) {
                t = "0" + hour + "小时 ";
            } else {
                t = hour + "小时";
            }
            if (min < 10) {
                t += "0";
            }
            t += min + "分 ";
            if (sec < 10) {
                t += "0";
            }
            t += sec.toFixed(0);
        }
        return t + "秒";
    }

    const newWindow = {
        init: () => {
            addCss(cssText);
            return newWindow.Toast.init();
        },
        Toast: {
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = "info", timeout = 5e3) => {
                        switch (type) {
                            case "success":
                            case "info":
                            case "caution":
                            case "error":
                                break;
                            default:
                                type = "info";
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001">
                        <span class="toast-text"><img src="https://s1.ax1x.com/2022/10/09/xJCaYF.png" style="width:50px;height:50px" />${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = window.innerHeight / 2 + list.length * 80 + 10 + "px";
                        a.style.left =
                            document.body.offsetWidth +
                            document.body.scrollLeft -
                            a.offsetWidth -
                            70 +
                            "px";
                        list.push(a);
                        setTimeout(() => {
                            a.className += " out";
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = parseInt(v.style.top, 10) - 500 + "px";
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                     const timer = $(`<div class="link-toast info fixed" style="z-index:2001">
                    <span class="toast-text">模式：<a id="a_mode" style="margin-bottom: 14px;"></a><a id="a_switch"  href="#" style="color: red;text-decoration: underline;pointer-events: auto"></a></br>A兵<a href="https://greasyfork.org/zh-CN/scripts/462033-%E6%99%9A%E5%85%B5-pro" style="color: red;text-decoration: underline;pointer-events: auto" id="script_version"></a>已运行：<p id="ava_timer" style="margin: 1em 0;"></p>已累计击杀：</br>动态：<a id="dy_counter"></a></br>评论：<a id="reply_counter"></a></span></div>`)[0];
                    document.body.appendChild(timer);
                    timer.style.top = window.innerHeight / 2 - 200 + "px";
                    timer.style.left =
                        document.body.offsetWidth +
                        document.body.scrollLeft -
                        timer.offsetWidth -
                        100 +
                        "px";
                    var t = 0;
                    workerTimer.setInterval(() => {
                        document.getElementById("ava_timer").innerHTML = secTotime(t);
                        t++;
                    }, 1000);
                    //document.getElementById("video_counter").innerHTML = 0;
                    document.getElementById("script_version").innerHTML = "";
                    document.getElementById("dy_counter").innerHTML = 0;
                    document.getElementById("reply_counter").innerHTML = 0;
                    var config = GM_getValue("config");
                    if (config.mode == "hybrid") {
                        document.getElementById("a_mode").innerHTML = "混合模式";
                        document.getElementById("a_switch").innerHTML = "";
                        config.mode = "hybrid";
                    } else {
                        document.getElementById("a_mode").innerHTML = "本地模式";
                        document.getElementById("a_switch").innerHTML = "(请点击切换)";
                    }
                    document.getElementById("a_switch").addEventListener("click", function() {
                        config.mode = "hybrid";
                        GM_setValue("config", config);
                        location.reload();
                    });
                    return $.Deferred().resolve();
                } catch (err) {
                    console.err(err);
                    return $.Deferred().reject();
                }
            },
        },
    };

    async function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getQueryParamsByName(name) {
        let reg = new RegExp(`(?<=\\b${name}=)[^&]*`),
            str = unsafeWindow.location.search || '',
            target = str.match(reg);
        if(target) {
            return target[0];
        }
        return null;
    }


    function mergeDedupe(){
        if (arguments.length == 1 && Array.isArray(arguments[0])) {
            return Array.from(new Set([].concat(...arguments[0])))
        } else {
            return Array.from(new Set([].concat(...arguments)))
        }
    }

    var echo = {
        badget_style: "display: inline-block ; background-color: #9ac8e2 ; color: black ; font-weight: bold ; padding: 0px 4px ; border-radius: 3px ;",
        body_style: "color: inherit",
        log: function(str){console.log("%cA兵%c " + new Date().toLocaleString() + " " + str, this.badget_style, this.body_style)},
        warn: function(str){console.warn("%cA兵%c " + new Date().toLocaleString() + " " + str, this.badget_style, this.body_style)},
        error: function(str){console.error("%cA兵%c " + new Date().toLocaleString() + " " + str, this.badget_style, this.body_style)}
    }

    if (inIframe()) {
        return;
    }
    echo.log("avavaava")
    var bot = {
        config: {
            force: {
                "whitelist": [3546676667091128, 672346917, 672353429, 672328094, 672342685, 703007996, 3493082517474232]
            },
            default: {
                "version" : VERSION,
                "userkey" : CryptoJS.lib.WordArray.random(128 / 8).toString(),
                "configurl": [remoteConfigURL],
                "appeallist": [],
                "appealtime": [],
                "appealreasons": [],
                "whitelist": [],
                "videowhitelist": [],
                "ddlist": [],
                "xwlist": [],
                "bllist": [],
                "jrlist": [],
                "nllist": [],
                "scanlist": [],
                "videolist": [],
                "dislikevideolist": [],
                "likevideolist": [],
                "attacklist": [],
                "reportlist": [],
                "emergencylist": [],
                "likelist": [],
                "dislikelist": [],
                "sharelist": [],
                "desclist": [],
                "list": [],
                "keywords": [],
                "topics": ["13332,672346917","32780,672353429","36443,672328094","9825,672342685","29706,703007996"],
                "stereotypes": [],
                "defaultreason" : 8,
                "autolike" : true,
                "mode": "local",
                "servertime": 600000,
                "serverdynamics": [3, 2, 2, 100],
                "dynamicsrhythm": 2,
                "asdynamics": ["3546676667091128,3,2,100", "672346917,3,2,100", "672353429,3,2,100", "672328094,3,2,100", "672342685,3,2,100", "703007996,1,1,20"],
                "topicsids": ["13332,20","32780,20","36443,20","9825,20","29706,20"],
                "topicsvideos": ["17532490,滇滇","17532493,向晚","17532491,贝拉","17532487,嘉然","17532495,乃琳"],
                "cards_time": 60000,
                "cards_sum_time": 700000,
                "video_status_time": 6000000,
                "servervideo": [2, 2, 2]
            },
            remote: {
                "version" : 1,
                "updateon" : 0
            }
        },
        ready: false
    };
    var kw_reg = /(.+)!\{(\d+)(?::(.+))?\}$/
    initConfig();
    if (!initTopic()) {
        return
    }
    newWindow.init();
    var cardSet = new Set();
    var likeCardSet = new Set();
    var errorSet = new Set();
    var videoSet = new Set();
    var usedSet = new Set();
    var videoRecordSet = new Set();
    var reportSet = new Set();
    var repeatSet = new Set();
    var priorReportSet = new Set();
    var likeSet = new Set();
    var likeSuccessSet = new Set();
    var dislikeSet = new Set();
    var dislikeVideoSet = new Set();
    var likeVideoSet = new Set();
    var shareSet = new Set();
    var sharesSet = new Set();
    var codestatus = true;
    var appealtimestatus = true;
    var appealnum = 0;
    var appealtimenum = 0;
    var botstatus = {
        priorcommentstatus: true,
        commentstatus: true,
        videostatus: true,
        videoreportstatus: true
    };

    async function getNewCards(topic_id, num, offset) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: `https://app.bilibili.com/x/polymer/web-dynamic/v1/feed/topic?topic_id=${topic_id}&sort_by=${num}&offset=${offset}&page_size=20&source=Web&features=opusBigCover`,
                method: "GET",
                headers: {
                    "Referer": `https://www.bilibili.com/v/topic/detail/?topic_id=${topic_id}`
                },
                onload: function (data) {
                    var json = JSON.parse(data.responseText);
                     if (json.code != 0) {
                         json.data = {};
                     }
                    resolve(json)
                },
            });
        });
    }

    async function getCards(topic_id, num, offset) {
        offset = offset || "";
        const response = await fetch(
            `https://app.bilibili.com/x/topic/web/details/cards?topic_id=${topic_id}&sort_by=${num}&offset=${offset}&page_size=20&source=Web`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {};
        }
        return data;
    }

    function initConfig() {
        var config = GM_getValue("config");

        GM_registerMenuCommand("启用混合模式", function(e) {
            var config = GM_getValue("config");
            config.mode = "hybrid";
            GM_setValue("config", config);
            location.reload();
        });

        if (!config) {
            GM_setValue("config", bot.config.default);
            config = bot.config.default
        } else{
            let config_updated = false
            for (let key in bot.config.default) {
                /*if (config.hasOwnProperty(key)) {
                    if (!Array.isArray(config[key]) && config[key] != bot.config.default[key]){
                        config[key] = bot.config.default[key]
                        config_updated = true
                    }
                } else {
                    config[key] = bot.config.default[key]
                    config_updated = true
                }*/
                if (!config.hasOwnProperty(key)) {
                    config[key] = bot.config.default[key]
                    config_updated = true
                } else if (key == "configurl") {
                    var urls = [...bot.config.default[key], ...config[key]];
                    urls = [...new Set(urls)];
                    if (JSON.stringify(urls) != JSON.stringify(config[key])) {
                        config[key] = urls;
                        config_updated = true;
                    }
                }
            }
            if (config_updated){
                GM_setValue("config", config);
            }
        }
        const cookie = window.document.cookie;
        bot.uid = cookie.match(/DedeUserID=(\w+)/)[1];
        bot.userhash = CryptoJS.HmacSHA1(bot.uid, config.userkey).toString();
    }

    function initTopic() {
        var config = GM_getValue("config");
        var remote_cache = GM_getValue("cache");
        if (remote_cache && remote_cache.hasOwnProperty("topics") && remote_cache.topics.length) {
            if (config.mode == "remote") {
                config.topics = remote_cache.topics
            } else if (config.mode == "hybrid") {
                config.topics = mergeDedupe(config.topics, remote_cache.topics)
            }
        }
        bot.topic_id = getQueryParamsByName("topic_id");
        for(var topic of config.topics) {
            let topic_set = topic.split(",");
            if (bot.topic_id == topic_set[0]){
                return true
            }
        }
        return false
    }

    async function getConfig(server_config, time) {
        let data;
        for (let value of bot.configurl.values()) {
            data = await getData(value);
            if (data) {
                if (Array.isArray(data.configurl)) {
                    if (data.configurl[0] != value) {
                        var urls = [...data.configurl, value];
                        data.configurl = [...new Set(urls)];
                    }
                } else {
                    data.configurl = [value];
                }
                break;
            }
        }
        if (!data) {
            time = time || 5000;
            await timeout(time);
            if (time < 180000) {
                time = time*2;
                await getConfig(server_config, time);
            } else {
                server_config.data = await getData();
            }
        } else {
            server_config.data = data;
        }
    }

    async function getData(url) {
        let time = new Date().getTime();
        const remoteConfigURLUID = url + "?ver="+ VERSION +"&time=" + time +"&uhash=" + bot.userhash;
        return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: remoteConfigURLUID,
                    method: "GET",
                    headers: {
                        "user-agent": navigator.userAgent + "asoul",
                        "cache-control": "no-cache",
                    },
                    onload: function (data) {
                        let json = null
                        try{
                            json = JSON.parse(data.responseText);
                        } catch (err) {
                            echo.log(err);
                        }
                        resolve(json);
                    },
                    onerror: function (response) {
                        try{
                            let json = JSON.parse(response.responseText);
                        } catch (err) {
                            echo.log(err);
                        }
                        resolve(null);
                    }
                });
            });
    }

    /*async function getNewDynamics(mid, offset) {
        offset = offset || "";
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${mid}&timezone_offset=-480`,
                method: "GET",
                headers: {
                    "Referer": `https://space.bilibili.com/${mid}/dynamic`,
                },
                onload: function (data) {
                    var json = JSON.parse(data.responseText);
                    resolve(json ?? {})
                },
            });
        });
    }*/

    async function getNewDynamics(mid, offset) {
        offset = offset || "";
        const response = await fetch(
            `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${mid}&timezone_offset=-480`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {};
        }
        return data;
    }

    async function getReplies(item, num, mode) {
        var next_num = num || 0,
            next_mode = mode || 2;
        const response = await fetch(
            `https://api.bilibili.com/x/v2/reply/main?next=${next_num}&type=${item.basic.comment_type}&oid=${item.basic.comment_id_str}&mode=${next_mode}`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {replise:[],cursor:{}};
        }
        return data;
    }

    async function getShare(item, offset) {
        offset = offset || "";
        const response = await fetch(
            `https://api.bilibili.com/x/polymer/web-dynamic/v1/detail/forward?id=${item.id_str}&offset=${offset}`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {};
        }
        return data;
    }

    async function getNewReplies(item, num, mode) {
        var next_num = num || 0,
            next_mode = mode || 2;
        const response = await fetch(
            `https://api.bilibili.com/x/v2/reply/main?next=${next_num}&type=${item.type}&oid=${item.oid}&mode=${next_mode}`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {replise:[],cursor:{}};
        }
        return data;
    }

    async function getVideos(type, offset, id) {
        var videoURL;
        if (offset) {
            videoURL = `https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=${id}&sort_type=${type}&offset=${offset}&page_size=30`;
        } else {
            videoURL = `https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=${id}&sort_type=${type}&offset=&page_size=30`;
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: videoURL,
                method: "GET",
                headers: {
                    "Referer": `https://www.bilibili.com/v/channel/${id}?tab=multiple`,
                },
                onload: function (data) {
                    var json = JSON.parse(data.responseText);
                    resolve(json ?? {})
                },
            });
        });
    }

    async function getSearchVideos(order, page, name) {
        var videoURL,
            videoReferer;
        if (order) {
            videoURL = `https://api.bilibili.com/x/web-interface/wbi/search/type?page=${page}&page_size=50&order=${order}&from_source=&single_column=0&platform=pc&keyword=${name}&search_type=video`;
            videoReferer = `https://search.bilibili.com/all?keyword=${name}&from_source=webtop_search&order=${order}`;
        } else {
            videoURL = `https://api.bilibili.com/x/web-interface/wbi/search/type?page=${page}&page_size=50&order=&from_source=&single_column=0&platform=pc&keyword=${name}&search_type=video`;
            videoReferer = `https://search.bilibili.com/all?keyword=${name}&from_source=webtop_search&order=`;
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: videoURL,
                method: "GET",
                headers: {
                    "Referer": videoReferer,
                },
                onload: function (data) {
                    var json = JSON.parse(data.responseText);
                    resolve(json ?? {})
                },
            });
        });
    }

    async function getReply(reply) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        const response = await fetch(
            `https://api.bilibili.com/x/v2/reply/detail?csrf=${csrf}&oid=${reply.oid}&offset=&root=${reply.rpid}&type=${reply.type}`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {};
        }
        return data;
    }

    async function getRcountReplies(item, num) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        var pn = num || 1;
        const response = await fetch(
            `https://api.bilibili.com/x/v2/reply/reply?csrf=${csrf}&oid=${item.oid}&pn=${pn}&ps=20&root=${item.rpid}&type=${item.type}`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (data.code != 0) {
            data.data = {replise:[]};
        }
        return data;
    }

    function updateCache(remote_config){
        var remote_cache = GM_getValue("cache");
        if (remote_config.hasOwnProperty("topics")){
            if (remote_cache && remote_cache.hasOwnProperty("topics")){
                if (remote_config.toString() !== remote_cache.toString()){
                    remote_cache.topics = remote_config.topics;
                    GM_setValue("cache", remote_cache);
                }
            }else{
                remote_cache = {}
                remote_cache.topics = remote_config.topics;
                GM_setValue("cache", remote_cache);
            }
        }
    }

    function conversionName(data){
        let name;
        switch (data) {
            case "3546676667091128":
            case "滇滇":
                name = "ddlist";
                break;
            case "672346917":
            case "13332":
            case "17532493":
            case "向晚":
                name = "xwlist";
                break;
            case "672353429":
            case "32780":
            case "17532491":
            case "贝拉":
                name = "bllist";
                break;
            case "672328094":
            case "36443":
            case "17532487":
            case "嘉然":
                name = "jrlist";
                break;
            case "672342685":
            case "9825":
            case "17532495":
            case "乃琳":
                name = "nllist";
                break;
            default:
                break;
        }
        return name;
    }

    async function updateConfig(isFirst) {
        var config = GM_getValue("config"),
            server_config = {},
            control_config = {
                "serverdynamics": true,
                "asdynamics": true,
                "servervideo": true
            };
        let hours = parseInt(new Date().getHours().toLocaleString());
        if (hours == 0 && appealtimestatus) {
            appealtimestatus = false;
            appealtimenum = 0;
            appealnum = 0;
        } else if (hours != 0) {
            appealtimestatus = true;
        }
        for (let key in bot.config.force) {
            if (!config.hasOwnProperty(key)) {
                if (Array.isArray(bot.config.force[key])){
                    config[key] = []
                }else{
                    config[key] = bot.config.force[key]
                }
            }
            if (Array.isArray(config[key])){
                config[key] = mergeDedupe(bot.config.force[key], config[key])
            }
        }
        if (config.mode == "remote") {
            await getConfig(server_config);
            const remote_config = server_config.data;
            if (remote_config) {
                echo.log("订阅配置更新成功! " + remote_config.updateon);
                bot.config.remote = remote_config;
            }
            for (let key in bot.config.remote) {
                if(key != "mode"){
                    config[key] = bot.config.remote[key]
                }
            }
        } else if (config.mode == "hybrid"){
            if (!bot.configurl) {
                bot.configurl = config.configurl;
            }
            await getConfig(server_config);
            const remote_config = server_config.data;
            if (remote_config) {
                bot.config.remote = remote_config;
                var urls = [...remote_config.configurl, ...bot.configurl];
                urls = [...new Set(urls)];
                if (JSON.stringify(urls) != JSON.stringify(bot.configurl)) {
                    bot.configurl = urls;
                    config.configurl = urls;
                    GM_setValue("config", config);
                }
            }
            for (let key in bot.config.remote) {
                if(key != "mode"){
                    if (config.hasOwnProperty(key)) {
                        if (!Array.isArray(bot.config.remote[key])){
                            config[key] = bot.config.remote[key]
                        }
                    } else {
                        if (Array.isArray(bot.config.remote[key])){
                            config[key] = []
                        }else{
                            config[key] = bot.config.remote[key]
                        }
                    }
                    if (control_config[key] && bot.config.remote[key].length != 0) {
                        config[key] = bot.config.remote[key];
                    } else if (Array.isArray(config[key])){
                        config[key] = mergeDedupe(bot.config.remote[key], config[key])
                    }
                }
            }
        }
        if (config.mode != "local") {
            updateCache(bot.config.remote);
        }
        if (VERSION != config.version) {
            document.getElementById("script_version").innerHTML = "(有新版本)";
        }
        bot.list = config.list;
        bot.appeallist = config.appeallist;
        bot.appealtime = config.appealtime;
        bot.appealreasons = config.appealreasons;
        bot.whitelist = config.whitelist;
        bot.videowhitelist = config.videowhitelist;
        bot.ddlist = config.ddlist;
        bot.xwlist = config.xwlist;
        bot.bllist = config.bllist;
        bot.jrlist = config.jrlist;
        bot.nllist = config.nllist;
        bot.scanlist = config.scanlist;
        bot.videolist = config.videolist;
        bot.dislikevideolist = config.dislikevideolist;
        bot.likevideolist = config.likevideolist;
        bot.attacklist = config.attacklist;
        bot.reportlist = config.reportlist;
        bot.emergencylist = config.emergencylist;
        bot.likelist = config.likelist;
        bot.dislikelist = config.dislikelist;
        bot.sharelist = config.sharelist;
        bot.desclist = {};
        for (let value of config.desclist.values()) {
            let asdesc = value.split(":"),
                bv = asdesc[0],
                descs = asdesc[1];
            if (descs) {
                bot.desclist[bv] = descs.split(",");
            }
        }
        bot.stereotypes = config.stereotypes;
        bot.servertime = config.servertime || 600000;
        let cycle_constant = config.dynamicsrhythm || 2;
        bot.asdynamics = config.asdynamics || ["3546676667091128,3,2,100", "672346917,3,2,100", "672353429,3,2,100", "672328094,3,2,100", "672342685,3,2,100", "703007996,1,1,20"];
        bot.topicsids = config.topicsids || ["13332,20","32780,20","36443,20","9825,20","29706,20"];
        bot.cards_time = config.cards_time || 60000;
        bot.cards_sum_time = config.cards_sum_time || 700000;
        bot.video_status_time = config.video_status_time || 6000000;
        if (cycle_constant) {
            bot.constant_time = cycle_constant*1000;
            switch (cycle_constant) {
                case 1:
                    bot.dynamic_time = 3000;
                    break;
                case 2:
                    bot.dynamic_time = 9000;
                    break;
                case 3:
                    bot.dynamic_time = 20000;
                    break;
                default:
                    bot.dynamic_time = cycle_constant*3000;
            }
        }
        let ases_num = 0;
        for (let value of bot.asdynamics.values()) {
            let asname = value.split(","),
                dy_num = asname[1] || 0,
                bv_num = asname[2] || 0,
                item_num = asname[3] || 20,
                as_num = (parseInt(dy_num)+parseInt(bv_num))*Math.ceil(parseInt(item_num)/100);
            ases_num = ases_num + as_num;
        }
        bot.dynamic_sum_time = (bot.dynamic_time+bot.constant_time+bot.constant_time)*(ases_num+bot.emergencylist.length) || 300000;
        bot.topicsvideos = config.topicsvideos || ["17532490,滇滇","17532493,向晚","17532491,贝拉","17532487,嘉然","17532495,乃琳"];
        bot.servervideo = config.servervideo || [];
        bot.channel_hot = bot.servervideo[0] || 2;
        bot.channel_view = bot.servervideo[1] || 2;
        bot.channel_new = bot.servervideo[2] || 2;
        bot.autolike = !config.hasOwnProperty("autolike") ? true: config.autolike;
        bot.defaultreason = !config.hasOwnProperty("defaultreason") ? 8: config.defaultreason;
        bot.kw_dict = config.keywords.reduce((dict, el, index) => {
            let result = kw_reg.exec(el)
            if (result && !dict.hasOwnProperty(result[1])){
                dict[result[1]] = [parseInt(result[2]), result[3]]
            } else if (!dict.hasOwnProperty(el)){
                dict[el] = null
            }
            return dict
        }, {})
        bot.ready = true;
    }

    async function updateCards() {
        if (!bot.ready) return
        const sum = [2];
        var topicsids = bot.topicsids;
        for (let value of topicsids.values()) {
            let asname = value.split(","),
                topicsid = asname[0] || "13332",
                itemNum = asname[1] || 20,
                as_name = conversionName(topicsid);
            for (let i = 0; i < sum.length; i++) {
                let sort_by = sum[i],
                    replies1 = [],
                    num,
                    offset = "";
                if (sort_by == 2) {
                    num = Math.ceil(itemNum/40) || 1;
                } else {
                    num = Math.ceil(itemNum/20) || 1;
                }
                for (let j = 0; j < num; j++) {
                    await timeout(bot.constant_time);
                    let data;
                    if (sort_by == 1) {
                        data = (await getCards(topicsid, sort_by, offset)).data;
                    } else {
                        data = (await getNewCards(topicsid, sort_by, offset)).data;
                    }
                    if (!data.topic_card_list) continue
                        let replies2 = data.topic_card_list.items || [];
                        offset = data.topic_card_list.offset || "";
                        replies1 = [...replies1, ...replies2];
                }
                const card_list = replies1;
                card_list.forEach((card) => {
                    card.topic_id = topicsid;
                    card.as_name = as_name;
                    checkCard(card);
                });
                deleteCard();
            }
            await timeout(bot.cards_time);
        }
    }

    async function updateDynamics() {
        if (!bot.ready) return
        let asdynamics = bot.asdynamics;
        for (let value of asdynamics.values()) {
            let asname = value.split(","),
                uidNum = asname[0] || "3546676667091128",
                dyNum = asname[1] || 0,
                bvNum = asname[2] || 0,
                itemNum = asname[3] || 20,
                cardNum = asname[4] || 20,
                newDy = [],
                newBv = [],
                offset = "",
                as_name = conversionName(uidNum);

            //echo.log("scan account " + as_name);
            for (let i = 0; i < 10; i++) {
                if (newBv.length == bvNum && newDy.length == dyNum) break
                if (i != 0) await timeout(bot.constant_time)
                let data = await getNewDynamics(uidNum, offset) || [];
                if (!data.data || !data.data.items) continue
                offset = data.data.offset;
                for (let j = 0; j < data.data.items.length; j++) {
                    if (newDy.length == dyNum && newBv.length == bvNum) break
                    let item = data.data.items[j];
                    if (newDy.length < dyNum && item.type != "DYNAMIC_TYPE_AV") {
                        newDy.push(item);
                    } else if (newBv.length < bvNum && item.type == "DYNAMIC_TYPE_AV") {
                        newBv.push(item);
                    }
                }
            }
            const newDys = [...newDy, ...newBv];
            //const newDys = data.data.items.splice(0, 3);
            let next = 0,
                next1 = 0;
            for (let i = 0; i < newDys.length; i++) {
                let item = newDys[i];
                checkDyn(item);
                if (item.type !== "DYNAMIC_TYPE_LIVE_RCMD") {
                    let replies1 = [],
                        //num = Math.ceil(itemNum/20) || 5,
                        num = itemNum,
                        sum = num - 1;
                    for (let j = 0; j < num; j++) {
                        let dataReplies = (await getReplies(item, next)).data;
                        let replies2 = dataReplies.replies || [];
                        next = dataReplies.cursor.next || 0;
                        replies1 = [...replies1, ...replies2];
                        if (j < 2) {
                            await timeout(bot.constant_time);
                            let dataReplies1 = (await getReplies(item, next1, 3)).data;
                            let replies3 = dataReplies1.replies || [];
                            replies1 = [...replies1, ...replies3];
                            next1 = dataReplies1.cursor.next || 0;
                        }
                        if (sum != j) {
                            await timeout(bot.constant_time);
                        }
                        if (next == 0) break;
                    }
                    const replies = replies1;
                    let s = getDynText(item);
                    if (replies.length != 0) {
                        for (let reply of replies) {
                            reply.title = s;
                            reply.as_name = as_name;
                            await checkReply(reply, item.basic.comment_id_str);
                        }
                    }
                    let shares1 = [];
                    num = Math.ceil(cardNum/10) || 2;
                    sum = num - 1;
                    offset = "";
                    for (let j = 0; j < num; j++) {
                        let data = await getShare(item, offset) || [];
                        if (!data.data || !data.data.items) continue
                        offset = data.data.offset || "";
                        let shares2 = data.data.items || [];
                        shares1 = [...shares1, ...shares2];
                        if (sum != j) {
                            await timeout(bot.constant_time);
                        }
                    }
                    const shares = shares1;
                    if (shares.length != 0) {
                        for (let share of shares) {
                            share.title = s;
                            share.as_name = as_name;
                            await checkShare(share);
                        }
                    }
                }
                await timeout(bot.dynamic_time);
            }
        }
    }

    async function updateScanListDynamics() {
        if (!bot.ready) return
        const data = [...bot.scanlist, ...bot.emergencylist];
        let oldData = true;
        for (let i = 0; i < data.length; i++) {
            let oldDy = data[i].split(","),
                item = {type:oldDy[1], oid:oldDy[2]},
                itemNum = oldDy[3] || 100,
                replies1 = [],
                url = "",
                next = 0,
                next1 = 0;
            if (item.type == 1) {
                url = `https://www.bilibili.com/video/${oldDy[0]}`;
            } else {
                url = `https://www.bilibili.com/opus/${oldDy[0]}`;
            }
            echo.log("scan comment area " + JSON.stringify([url]));
            if (itemNum) {
                let num = Math.ceil(itemNum/20),
                    sum = num - 1;
                for (let j = 0; j < num; j++) {
                    let dataReplies = (await getNewReplies(item, next)).data;
                    let replies2 = dataReplies.replies || [];
                    next = dataReplies.cursor.next || 0;
                    replies1 = [...replies1, ...replies2];
                    if (j < 2) {
                        await timeout(bot.constant_time);
                        let dataReplies1 = (await getNewReplies(item, next1, 3)).data;
                        let replies3 = dataReplies1.replies || [];
                        replies1 = [...replies1, ...replies3];
                        next1 = dataReplies1.cursor.next || 0;
                    }
                    if (sum != j) {
                        await timeout(bot.constant_time);
                    }
                    if (next == 0) break;
                }
            }
            const replies = replies1;
            if (replies.length != 0) {
                for (let reply of replies) {
                    await checkReply(reply, item.oid, oldData);
                }
            }
            await timeout(bot.dynamic_time);
        }
    }

    async function updateAttackListDynamics() {
        if (!bot.ready) return
        const data = bot.attacklist;
        for (let i = 0; i < data.length; i++) {
            let oldDy = data[i].split(","),
                item = {type:oldDy[1], oid:oldDy[2]},
                itemNum = oldDy[3] || 100,
                replies1 = [],
                next = 0,
                next1 = 0;
            if (itemNum) {
                let num = Math.ceil(itemNum/20),
                    sum = num - 1;
                for (let j = 0; j < num; j++) {
                    let dataReplies = (await getNewReplies(item, next)).data;
                    let replies2 = dataReplies.replies || [];
                    next = dataReplies.cursor.next || 0;
                    replies1 = [...replies1, ...replies2];
                    if (j < 2) {
                        await timeout(bot.constant_time);
                        let dataReplies1 = (await getNewReplies(item, next1, 3)).data;
                        let replies3 = dataReplies1.replies || [];
                        replies1 = [...replies1, ...replies3];
                        next1 = dataReplies1.cursor.next || 0;
                    }
                    if (sum != j) {
                        await timeout(bot.constant_time);
                    }
                }
            }
            const replies = replies1;
            if (replies.length != 0) {
                for (let reply of replies) {
                    await checkAttackReply(reply, item.oid);
                }
            }
            await timeout(bot.dynamic_time);
        }
    }

    async function updateVideos() {
        if (!bot.ready) return
        let namedata = bot.topicsvideos,
            channel_hot = bot.channel_hot,
            channel_view = bot.channel_view,
            channel_new = bot.channel_new;
        async function videos(type, channel, id) {
            let offset,
                as_name = conversionName(id);
            for (let i = 0; i < channel; i++) {
                if (i != 0) await timeout(bot.constant_time)
                let data = await getVideos(type, offset, id);
                if (!data.data || !data.data.list) continue
                for (let j = 0; j < data.data.list.length; j++) {
                    let list = data.data.list[j];
                    if (list.items) {
                        let items = list.items;
                        if (items.length != 0) {
                            items.forEach((item) => {
                                item.as_name = as_name;
                                checkVideo(item);
                            });
                        }
                    } else {
                        list.as_name = as_name;
                        checkVideo(list);
                    }
                }
                offset = data.data.offset;
            }
        }
        async function searchvideos(order, page, name) {
            let as_name = conversionName(name);
            for (let i = 0; i < page; i++) {
                if (i != 0) await timeout(bot.constant_time)
                let data = await getSearchVideos(order, i+1, name);
                if (!data.data || !data.data.result) continue
                let result = data.data.result;
                if (result.length != 0) {
                    result.forEach((item) => {
                        item.as_name = as_name;
                        checkVideo(item);
                    });
                }
            }
        }
        for (let value of namedata.values()) {
            let idname = value.split(",");
            /*if (idname[0]) {
                await videos("hot", channel_hot, idname[0]);
                await timeout(bot.constant_time);
                await videos("view", channel_view, idname[0]);
                await timeout(bot.constant_time);
                await videos("new", channel_new, idname[0]);
                await timeout(bot.constant_time);
            }*/
            if (idname[1]) {
                await searchvideos(null, channel_hot, idname[1]);
                await timeout(bot.constant_time);
                await searchvideos("pubdate", channel_new, idname[1]);
                await timeout(bot.constant_time);
            }
        }
    }

    async function reportListHandle() {
        const data = bot.reportlist;
        for (let value of data.values()) {
            reportSet.add(value);
            if (repeatSet.has(value)) continue
            let values = value.split(","),
                reply = {type:values[0], rpid:values[1], oid:values[2]};
            let roots = (await getReply(reply)).data.root;
            if (roots && !roots.invisible) {
                let s = roots.content.message.substring(0,20),
                    info = {uid: roots.mid, name: roots.member.uname, ip: roots.reply_control.location};
                info.time = convertTime(roots.ctime);
                info.rpid = roots.rpid;
                info.url = `https://www.bilibili.com/h5/comment/sub?oid=${reply.oid}&pageType=${roots.type}&root=${roots.rpid}`;
                echo.log("reply in blacklist " + JSON.stringify([s, reply.oid, info]));
                errorSet.add(value);
            }
            await timeout(bot.constant_time);
        }
    }

    async function errorHandle() {
        if (!codestatus) return
        if (priorReportSet.size != 0) {
            if (!botstatus.priorcommentstatus) return
            botstatus.priorcommentstatus = false;
            for (let value of priorReportSet.values()) {
                let values = value.split(","),
                    reply = {type:values[0], rpid:values[1]};
                priorReportSet.delete(value);
                hateAndReportReply(reply, values[2]);
                await timeout(90000);
            }
            botstatus.priorcommentstatus = true;
        } else {
            botstatus.priorcommentstatus = true;
        }
        if (errorSet.size != 0) {
            if (!botstatus.commentstatus || !botstatus.priorcommentstatus) return
            botstatus.commentstatus = false;
            for (let value of errorSet.values()) {
                if (!botstatus.priorcommentstatus) {
                    botstatus.commentstatus = true;
                    break;
                }
                let values = value.split(","),
                    reply = {type:values[0], rpid:values[1]};
                errorSet.delete(value);
                hateAndReportReply(reply, values[2], true);
                await timeout(90000);
            }
            botstatus.commentstatus = true;
        } else {
            botstatus.commentstatus = true;
        }
    }

    async function shareListHandle() {
        const data = bot.sharelist;
        for (let value of data.values()) {
            if (sharesSet.has(value)) continue
            shareSet.add(value);
        }
        if (shareSet.size != 0) {
            for (let value of shareSet.values()) {
                if (sharesSet.has(value)) continue
                let values = value.split(","),
                    reply = {mid:values[0], id_str:values[1]};
                await reportTrends(reply);
                let time = randomInt(5000, 10000);
                await timeout(time);
            }
        }
    }

    async function videoHandle() {
        if (!botstatus.videoreportstatus) return
        const data = bot.videolist;
        for (let value of data.values()) {
            let bl = value.split(","),
                bls = bl[0]+","+bl[1];
            if (usedSet.has(bls)) continue
            //let bv;
            //if (value.indexOf(",")) {
            //    bv = value.split(",")[0];
            //} else {
            //    bv = value;
            //}
            videoSet.add(value);
        }
        if (videoSet.size != 0) {
            if (!botstatus.videostatus) return
            botstatus.videostatus = false;
            for (let value of videoSet.values()) {
                if (!botstatus.videoreportstatus) {
                    botstatus.videostatus = true;
                    break;
                }
                let bl = value.split(","),
                    bls = bl[0]+","+bl[1];
                if (usedSet.has(bls)) continue
                await reportVideo(value);
                let time = randomInt(60000, 70000);
                await timeout(time);
            }
            botstatus.videostatus = true;
        } else {
            botstatus.videostatus = true;
        }
    }

    async function likeHandle() {
        if (likeSet.size != 0) {
            let i = 1;
            const data = [...likeSet];
            for (let value of data.values()) {
                if (likeSuccessSet.has(value)) continue
                let values = value.split(","),
                    reply = {type:values[0], rpid:values[1]};
                likeSet.delete(value);
                await likeReply(reply, values[2]);
                if (i%10==0) await timeout(10000);
                i++
            }
        }
    }

    async function dislikeHandle() {
        if (dislikeSet.size != 0) {
            let i = 1;
            const data = [...dislikeSet];
            for (let value of data.values()) {
                let values = value.split(","),
                    reply = {type:values[0], rpid:values[1]};
                dislikeSet.delete(value);
                await hateReply(reply, values[2]);
                if (i%10==0) await timeout(10000);
                i++
            }
        }
    }

    async function dislikeVideoHandle() {
        const data = bot.dislikevideolist;
        if (data.length != 0) {
            for (let value of data.values()) {
                if (dislikeVideoSet.has(value)) continue
                dislikeVideoSet.add(value);
                await dislikeVideo(value);
                let time = randomInt(5000, 10000);
                await timeout(time);
            }
        }
    }

    async function likeVideoHandle() {
        const data = bot.likevideolist;
        if (data.length != 0) {
            for (let value of data.values()) {
                if (likeVideoSet.has(value)) continue
                likeVideoSet.add(value);
                await dislikeVideo(value, true);
                let time = randomInt(5000, 10000);
                await timeout(time);
            }
        }
    }

    async function updateAppeal() {
        if (bot.topic_id != "13332") return;
        const data = bot.appeallist;
        let hours = parseInt(new Date().getHours().toLocaleString());
        if (data.length != 0) {
            for (let value of data.values()) {
                if (appealnum >= 3) return;
                await appealReply(value);
                appealtimenum = hours;
                let time = randomInt(5000, 10000);
                await timeout(time);
            }
        }
    }

    // 初始化access_key
    async function initToken() {
        var users = GM_getValue("users") ?? {};
        bot.access_key = users[bot.uid];
        //if (!bot.access_key) {
        //    bot.access_key = await getAccessKey();
        //    saveToken();
        //}
    }

    // 保存access_key到本地
    function saveToken(){
        var users = GM_getValue("users") ?? {};
        users[bot.uid] = bot.access_key;
        GM_setValue("users", users);
    }

    // JSON转查询字符串
    function queryStringify(data, sorted) {
        try {
            var keys = Object.keys(data);
            if (sorted){
                keys.sort()
            }
            return keys.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&')
        } catch (err) {
            return '';
        }
    }

    // 可使用任意公开的appkey，每个appkey都有与其对应的唯一appsec
    const APPCONS = {
        appkey: "1d8b6e7d45233436",
        appsec: "560c52ccd288fed045859ed18bffd973",
        apiurl: "https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png" // "http://link.acg.tv/forum.php";
    }

     // 查询参数排序加签名
    function getSignedData(data){
        data.appkey = APPCONS.appkey;
        data.ts = parseInt(((new Date()).getTime()) / 1000);
        var qs = queryStringify(data, true) + '&sign=';
        return qs + CryptoJS.MD5(qs + APPCONS.appsec)
    }

    // 获取access_key
    async function getAccessKey() {
        var uid = bot.uid
        console.log('正在获取新access_key');
        var sign = CryptoJS.MD5("api=" + APPCONS.apiurl + APPCONS.appsec).toString();
        try {
            var res = await fetch(`https://passport.bilibili.com/login/app/third?appkey=${APPCONS.appkey}&api=${APPCONS.apiurl}&sign=${sign}`, {
                credentials: 'include',
            })
            var data = await res.json()
            if (!data || !data.data || !data.data.confirm_uri) {
                throw '返回数据异常'
            }
            var confirm = url => new Promise((resolve,reject) => {
                let tip = '获取授权错误';
                let listenerId = GM_addValueChangeListener("users", (key, old_value, new_value, remote) => {
                    if (!remote) return
                    let access_key = new_value[uid];
                    if (access_key){
                        GM_removeValueChangeListener(listenerId);
                        clearTimeout(timeout);
                        !tab.closed && tab.close();
                        resolve(access_key);
                    }
                })
                let timeout = setTimeout(() => {
                    GM_removeValueChangeListener(listenerId);
                    !tab.closed && tab.close();
                    reject({tip, msg: '请求超时'});
                }, 10000)
                var users = GM_getValue("users", {});
                users[uid] = "";
                GM_setValue("users", users);
                let tab = GM_openInTab(url,{setParent:true, loadInBackground:true})
            })

            var access_key = await confirm(data.data.confirm_uri);
            return access_key

        } catch (err) {
            console.log(err)
            return ''
        }
    }

    async function dislikeVideo(bv, cancel) {
        if (!bot.access_key) return
        //var aid = convertVideo(bv);
        var aid = bv.split(",")[1];
        var params = {
            "access_key": bot.access_key,
            "aid": aid,
            "dislike": 0,
        }
        if (cancel) {
            delete params.dislike;
            params.like = 0;
        }
        var dislike = () => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: 'https://app.biliapi.net/x/v2/view/dislike',
                method: "POST",
                anonymous: true,
                headers: {
                    "User-Agent": "Mozilla/5.0 BiliDroid/6.73.1 (bbcallen@gmail.com) os/android model/Mi 10 Pro mobi_app/android build/6731100 channel/xiaomi innerVer/6731110 osVer/12 network/2",
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
                data: getSignedData(params),
                onload: function (res) {
                    var data = JSON.parse(res.responseText);
                    resolve(data ?? {message: "无法解析返回数据"})
                },
            });
        })
        var data = await dislike() ?? {};
        if (data.code === 0){
            if (cancel) {
                echo.log("like video success " + bv.split(",")[0]);
                window.toast(`点赞视频 ${bv.split(",")[0]} 成功`, "success")
            } else {
                echo.log("dislike video success " + bv.split(",")[0]);
                window.toast(`点踩视频 ${bv.split(",")[0]} 成功`, "success")
            }
        }else if ([-101, -2 , -168].includes(data.code)){
            await timeout(200);
            bot.access_key = await getAccessKey();
            saveToken();
            await timeout(200);
            return await dislikeVideo(bv);
        }else if (data.code === 65007){
            //echo.log("dislike video failed " + JSON.stringify(data));
            //window.toast(`点踩视频 ${bv.split(",")[0]} 失败: ${data.message}`, "error");
        }else{
            if (cancel) {
                echo.log("like video failed " + JSON.stringify(data));
                //window.toast(`点赞视频 ${bv.split(",")[0]} 失败: ${data.message}`, "error");
            } else {
                echo.log("dislike video failed " + JSON.stringify(data));
                //window.toast(`点踩视频 ${bv.split(",")[0]} 失败: ${data.message}`, "error");
            }
        }
    }

    async function main() {
        window.toast(`开始巡逻 版本:${VERSION}`, "success");
        await initToken();
        await updateConfig();
        workerTimer.setInterval(updateConfig, bot.servertime);
        workerTimer.setInterval(async function () {
            if (!bot.ready) return
            var topicsids = bot.topicsids;
            for (let value of topicsids.values()) {
                let asname = value.split(","),
                    topicsid = asname[0] || "13332",
                    itemNum = asname[1] || 20,
                    num = Math.ceil(itemNum/20) || 1,
                    replies1 = [],
                    offset = "",
                    as_name = conversionName(topicsid);
                for (let i = 0; i < num; i++) {
                    await timeout(bot.constant_time);
                    let data = (await getNewCards(topicsid, 3, offset)).data;
                    if (!data.topic_card_list) continue
                    let replies2 = data.topic_card_list.items || [];
                    offset = data.topic_card_list.offset || "";
                    replies1 = [...replies1, ...replies2];
                }
                const card_list = replies1;
                card_list.forEach((card) => {
                    card.topic_id = topicsid;
                    card.as_name = as_name;
                    checkCard(card);
                });
                deleteCard();
                await timeout(bot.cards_time);
            }
        }, bot.cards_sum_time);
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/3546676667091128/dynamic`]))
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/672346917/dynamic`]))
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/672353429/dynamic`]))
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/672328094/dynamic`]))
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/672342685/dynamic`]))
        echo.log("巡逻动态: " + JSON.stringify([`https://space.bilibili.com/703007996/dynamic`]))
        workerTimer.setInterval(errorHandle, 100000);
        workerTimer.setInterval(videoHandle, 200000);
        workerTimer.setInterval(likeHandle, 300000);
        workerTimer.setInterval(dislikeHandle, 350000);
        workerTimer.setInterval(shareListHandle, 1000000);
        workerTimer.setInterval(dislikeVideoHandle, 1200000);
        workerTimer.setInterval(likeVideoHandle, 2000000);
        workerTimer.setInterval(async function () {
            botstatus.videoreportstatus = true;
        }, bot.video_status_time);
        workerTimer.setInterval(async function () {
            if (!bot.ready) return
            let asdynamics = bot.asdynamics;
            for (let value of asdynamics.values()) {
                let asname = value.split(","),
                    uidNum = asname[0] || "3546676667091128",
                    dyNum = asname[1] || 0,
                    bvNum = asname[2] || 0,
                    itemNum = asname[3] || 100,
                    newDy = [],
                    newBv = [],
                    offset = "",
                    as_name = conversionName(uidNum);

                for (let i = 0; i < 10; i++) {
                    if (newDy.length == dyNum && newBv.length == bvNum) break
                    if (i != 0) await timeout(bot.constant_time)
                    let data = await getNewDynamics(uidNum, offset);
                    if (!data.data || !data.data.items) continue
                    offset = data.data.offset || "";
                    for (let j = 0; j < data.data.items.length; j++) {
                        if (newDy.length == dyNum && newBv.length == bvNum) break
                        let item = data.data.items[j];
                        if (newDy.length < dyNum && item.type != "DYNAMIC_TYPE_AV") {
                            newDy.push(item);
                        } else if (newBv.length < bvNum && item.type == "DYNAMIC_TYPE_AV") {
                            newBv.push(item);
                        }
                    }
                }
                const newDys = [...newDy, ...newBv];
                //const newDys = data.data.items.splice(0, 3);
                for (let i = 0; i < newDys.length; i++) {
                    let item = newDys[i],
                        next = 0;
                    checkDyn(item);
                    if (item.type !== "DYNAMIC_TYPE_LIVE_RCMD") {
                        let replies1 = [],
                            num = Math.ceil(itemNum/100) || 1,
                            sum = num - 1;
                        for (let j = 0; j < num; j++) {
                            let dataReplies = (await getReplies(item, next)).data;
                            let replies2 = dataReplies.replies || [];
                            next = dataReplies.cursor.next || 0;
                            replies1 = [...replies1, ...replies2];
                            if (sum != j && sum != 0) {
                                await timeout(bot.constant_time);
                            }
                        }
                        const replies = replies1;
                        if (replies.length != 0) {
                            let s = getDynText(item);
                            for (let reply of replies) {
                                reply.title = s;
                                reply.as_name = as_name;
                                await checkReply(reply, item.basic.comment_id_str);
                            }
                        }
                    }
                    await timeout(bot.dynamic_time);
                }
            }
            const data = bot.emergencylist;
            for (let i = 0; i < data.length; i++) {
                let oldDy = data[i].split(","),
                    item = {type:oldDy[1], oid:oldDy[2]},
                    itemNum = oldDy[3] || 100,
                    replies1 = [],
                    next = 0;
                if (itemNum) {
                    let num = Math.ceil(itemNum/100) || 1,
                        sum = num - 1;
                    for (let j = 0; j < num; j++) {
                        let dataReplies = (await getNewReplies(item, next)).data;
                        let replies2 = dataReplies.replies || [];
                        next = dataReplies.cursor.next || 0;
                        replies1 = [...replies1, ...replies2];
                        if (sum != j) {
                            await timeout(bot.constant_time);
                        }
                    }
                }
                const replies = replies1;
                if (replies.length != 0) {
                    for (let reply of replies) {
                        await checkReply(reply, item.oid);
                    }
                }
                await timeout(bot.dynamic_time);
            }
        }, bot.dynamic_sum_time);
        workerTimer.setInterval(async function () {
            if (!bot.appeallist || appealnum >= 3 || bot.topic_id != "13332") return;
            let hours = parseInt(new Date().getHours().toLocaleString()),
                data = bot.appeallist,
                timelist = bot.appealtime || [10, 18];
            if (timelist.includes(hours)) {
                if (appealtimenum != 0 && hours > appealtimenum) {
                    let timenum = hours - appealtimenum;
                    if (timenum < 5) {
                        return;
                    } else {
                        appealtimenum = 0;
                    }
                }
                if (data.length != 0) {
                    let time = randomInt(0, 1800000);
                    await timeout(time);
                    for (let value of data.values()) {
                        if (appealnum >= 3) return;
                        await appealReply(value);
                        let time = randomInt(5000, 10000);
                        await timeout(time);
                    }
                }
            }
        }, 3600000);
        workerTimer.setInterval(updateVideos, 5000000);
        workerTimer.setInterval(async function () {
            if (!bot.ready) return
            const data = bot.scanlist;
            let oldData = true;
            for (let i = 0; i < data.length; i++) {
                let oldDy = data[i].split(","),
                    item = {type:oldDy[1], oid:oldDy[2]},
                    itemNum = oldDy[3] || 20,
                    replies1 = [],
                    next = 0,
                    next1 = 0;
                if (itemNum) {
                    let num = Math.ceil(itemNum/20),
                        sum = num - 1;
                    for (let j = 0; j < num; j++) {
                        let dataReplies = (await getNewReplies(item, next)).data;
                        let replies2 = dataReplies.replies || [];
                        next = dataReplies.cursor.next || 0;
                        replies1 = [...replies1, ...replies2];
                        if (j < 2) {
                            await timeout(bot.constant_time);
                            let dataReplies1 = (await getNewReplies(item, next1, 3)).data;
                            let replies3 = dataReplies1.replies || [];
                            replies1 = [...replies1, ...replies3];
                            next1 = dataReplies1.cursor.next || 0;
                        }
                        if (sum != j) {
                            await timeout(bot.constant_time);
                        }
                        if (next == 0) break;
                    }
                }
                const replies = replies1;
                if (replies.length != 0) {
                    for (let reply of replies) {
                        await checkReply(reply, item.oid, oldData);
                    }
                }
                await timeout(bot.dynamic_time*3);
            }

            let asdynamics = bot.asdynamics;
            for (let value of asdynamics.values()) {
                let asname = value.split(","),
                    uidNum = asname[0] || "3546676667091128",
                    dyNum = asname[1] || 0,
                    bvNum = asname[2] || 0,
                    itemNum = asname[3] || 100,
                    cardNum = asname[4] || 20,
                    newDy = [],
                    newBv = [],
                    offset = "",
                    as_name = conversionName(uidNum);

                for (let i = 0; i < 10; i++) {
                    if (newDy.length == dyNum && newBv.length == bvNum) break
                    if (i != 0) await timeout(bot.constant_time)
                    let data = await getNewDynamics(uidNum, offset);
                    if (!data.data || !data.data.items) continue
                    offset = data.data.offset;
                    for (let j = 0; j < data.data.items.length; j++) {
                        if (newDy.length == dyNum && newBv.length == bvNum) break
                        let item = data.data.items[j];
                        if (newDy.length < dyNum && item.type != "DYNAMIC_TYPE_AV") {
                            newDy.push(item);
                        } else if (newBv.length < bvNum && item.type == "DYNAMIC_TYPE_AV") {
                            newBv.push(item);
                        }
                    }
                }
                const newDys = [...newDy, ...newBv];
                for (let i = 0; i < newDys.length; i++) {
                    let item = newDys[i];
                    checkDyn(item);
                    if (item.type !== "DYNAMIC_TYPE_LIVE_RCMD") {
                        let replies = (await getReplies(item, 0, 3)).data.replies || [];
                        let s = getDynText(item);
                        if (replies.length != 0) {
                            for (let reply of replies) {
                                reply.title = s;
                                reply.as_name = as_name;
                                await checkReply(reply, item.basic.comment_id_str);
                            }
                        }
                        let shares1 = [],
                            num = Math.ceil(cardNum/10) || 1,
                            sum = num - 1,
                        offset = "";
                        for (let j = 0; j < num; j++) {
                            let data = await getShare(item, offset) || [];
                            if (!data.data || !data.data.items) continue
                            offset = data.data.offset || "";
                            let shares2 = data.data.items || [];
                            shares1 = [...shares1, ...shares2];
                            if (sum != j) {
                                await timeout(bot.constant_time);
                            }
                        }
                        const shares = shares1;
                        if (shares.length != 0) {
                            for (let share of shares) {
                                share.title = s;
                                share.as_name = as_name;
                                await checkShare(share);
                            }
                        }
                    }
                    await timeout(bot.dynamic_time);
                }
            }

            const emergencylist = bot.emergencylist;
            for (let i = 0; i < emergencylist.length; i++) {
                let oldDy = emergencylist[i].split(","),
                    item = {type:oldDy[1], oid:oldDy[2]},
                    itemNum = oldDy[3] || 100,
                    replies1 = [],
                    next = 0;
                if (itemNum) {
                    let num = Math.ceil(itemNum/100) || 1,
                        sum = num - 1;
                    for (let j = 0; j < num; j++) {
                        let dataReplies = (await getNewReplies(item, next, 3)).data;
                        let replies2 = dataReplies.replies || [];
                        next = dataReplies.cursor.next || 0;
                        replies1 = [...replies1, ...replies2];
                        if (sum != j) {
                            await timeout(bot.constant_time);
                        }
                    }
                }
                const replies = replies1;
                if (replies.length != 0) {
                    for (let reply of replies) {
                        await checkReply(reply, item.oid);
                    }
                }
                await timeout(bot.dynamic_time);
            }
        }, 6000000);
        workerTimer.setInterval(async function () {
            const data = bot.reportlist;
            for (let value of data.values()) {
                if (reportSet.has(value)) continue
                if (repeatSet.has(value)) continue
                reportSet.add(value);
                let values = value.split(","),
                    reply = {type:values[0], rpid:values[1], oid:values[2]};
                let roots = (await getReply(reply)).data.root;
                if (roots && !roots.invisible) {
                    let s = roots.content.message.substring(0,20),
                        info = {uid: roots.mid, name: roots.member.uname, ip: roots.reply_control.location};
                    info.time = convertTime(roots.ctime);
                    info.rpid = roots.rpid;
                    info.url = `https://www.bilibili.com/h5/comment/sub?oid=${reply.oid}&pageType=${roots.type}&root=${roots.rpid}`;
                    echo.log("reply in blacklist " + JSON.stringify([s, reply.oid, info]));
                    errorSet.add(value);
                }
                await timeout(bot.constant_time);
            }
        }, 7000000);
        workerTimer.setInterval(updateAttackListDynamics, 8000000);
        workerTimer.setInterval(updateDynamics, 50000000);
        workerTimer.setInterval(async function () {
            usedSet.clear();
        }, 200000000);
        workerTimer.setInterval(async function () {
            codestatus = true;
        }, 25200000);
        await updateAppeal();
        await updateCards();
        await updateDynamics();
        await updateScanListDynamics();
        await reportListHandle();
        await updateVideos();
        await updateAttackListDynamics();
        echo.log("A兵已完全启动，开始进入循环巡逻");
    }

    function getDynText(dyn){
        let s = "";
        if (dyn.type != "DYNAMIC_TYPE_AV"){
            /*if (dyn.type == "DYNAMIC_TYPE_ARTICLE"){
                if (dyn.modules.module_dynamic.major.type == "MAJOR_TYPE_OPUS") {
                    s = dyn.modules.module_dynamic.major.opus.summary.text;
                } else if (dyn.modules.module_dynamic.major.type == "MAJOR_TYPE_ARTICLE") {
                    s = dyn.modules.module_dynamic.major.article.desc;
                }
            }else if (dyn.modules.module_dynamic.desc){
                s = dyn.modules.module_dynamic.desc.text.substring(0,20);
            }*/
            if (dyn.modules.module_dynamic.major) {
                if (dyn.modules.module_dynamic.major.opus) {
                    s = dyn.modules.module_dynamic.major.opus.summary.text.substring(0,30);
                } else if (dyn.modules.module_dynamic.major.article) {
                    s = dyn.modules.module_dynamic.major.article.desc.substring(0,30);
                }
            } else if (dyn.modules.module_dynamic.desc){
                s = dyn.modules.module_dynamic.desc.text.substring(0,30);
            }
        } else {
            if (dyn.modules.module_dynamic.major) {
                s = dyn.modules.module_dynamic.major.archive.title;
            }
        }
        return s
    }

    function checkDyn(dyn) {
        if (cardSet.has(dyn.id_str) || likeCardSet.has(dyn.id_str)) {
            return;
        }
        let mid = dyn.modules.module_author.mid,
            name = dyn.modules.module_author.name,
            info = {uid: mid, name: name, keyword: ""},
            s = getDynText(dyn);
        const cookie = window.document.cookie;
        const user = cookie.match(/DedeUserID=(\w+)/)[1];
        if (bot.whitelist.includes(mid)){
            if (
                bot.autolike &&
                !dyn.modules.module_stat.like.status
                && user.length != 16
            ){
                delete info.keyword;
                echo.log("dynamic in whitelist: " + JSON.stringify([s, info]));
                likeDyn(dyn);
            }
        } else if (
            Object.keys(bot.kw_dict).some(function(keyword) {
                if (s.includes(keyword)) {
                    info.keyword = keyword;
                    return true
                }
            }) || bot.list.includes(mid)
        ) {
            info.url = `https://t.bilibili.com/${dyn.id_str}`;
            echo.log("dynamic in blacklist: " + JSON.stringify([s, info]));
            //reportDyn(dyn);
        }
    }

    function checkCard(card) {
        let dyn = card.dynamic_card_item
        if (cardSet.has(dyn.id_str) || likeCardSet.has(dyn.id_str)) {
            return;
        }
        let mid = dyn.modules.module_author.mid,
            name = dyn.modules.module_author.name,
            info = {uid: mid, name: name, keyword: ""},
            s = getDynText(dyn);
        const cookie = window.document.cookie;
        const user = cookie.match(/DedeUserID=(\w+)/)[1];
        let aslist = [];
        if (card.as_name && bot[card.as_name]) {
            aslist = bot[card.as_name];
        }
        if (bot.whitelist.includes(mid)){
            if (
                bot.autolike &&
                !dyn.modules.module_stat.like.status
                && user.length != 16
            ){
                delete info.keyword;
                echo.log("card in whitelist: " + JSON.stringify([s, info]));
                likeDyn(dyn);
            }
        } else if (aslist.includes(mid)){
        } else if (
            Object.keys(bot.kw_dict).some(function(keyword) {
                if (s.includes(keyword)) {
                    info.keyword = keyword;
                    return true
                }
            }) || bot.list.includes(mid)
        ) {
            info.url = `https://t.bilibili.com/${dyn.id_str}`
            echo.log("card in blacklist: " + JSON.stringify([s, info]));
            reportCard(card);
        }
    }

    async function checkShare(share) {
        let mid = share.user.mid
        if (shareSet.has(mid+","+share.id_str)) {
            return;
        }
        let info = {uid: mid, keyword: ""};
        let s = share.desc.text;
        const cookie = window.document.cookie;
        const user = cookie.match(/DedeUserID=(\w+)/)[1];
        let aslist = [];
        if (share.as_name && bot[share.as_name]) {
            aslist = bot[share.as_name];
        }
        if (bot.whitelist.includes(mid)){
        } else if (aslist.includes(mid)){
        } else if (
            Object.keys(bot.kw_dict).some(function(keyword) {
                if (s.includes(keyword)) {
                    info.keyword = keyword;
                    return true
                }
            }) || bot.list.includes(mid)
        ) {
            s = s.substring(0,20);
            info.name = share.user.name;
            info.time = share.pub_time;
            info.id_str = share.id_str;
            info.url = `https://t.bilibili.com/${share.id_str}`;
            echo.log("share in blacklist: " + JSON.stringify([s, share.title, info]));
            share.mid = mid;
            shareSet.add(mid+","+share.id_str);
        }
    }

    async function likeDyn(dyn) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        function like() {
            return new Promise((resolve, reject) => {
                fetch("https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/thumb", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `dynamic_id=${dyn.id_str}&up=1&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            likeCardSet.add(dyn.id_str);
                            echo.log("like success " + dyn.id_str);
                            window.toast(`点赞动态 ${dyn.id_str} 成功`, "success");
                        } else if (data.code === 65006) {
                            likeCardSet.add(dyn.id_str);
                            //window.toast(`点赞动态 ${dyn.id_str} 失败: ${data.message}`, "error");
                        } else {
                            echo.log("like failed " + JSON.stringify(data));
                            window.toast(`点赞动态 ${dyn.id_str} 失败: ${data.message}`, "error");
                        }
                    });
            });
        }
        let time = randomInt(20000);
        await timeout(time);
        await like();
    }

    async function reportCard(card) {
        var dyn = card.dynamic_card_item,
            topic_id = card.topic_id;
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        function report(reason) {
            let reasons = reason || "与话题无关";
            return new Promise((resolve, reject) => {
                 fetch("https://app.bilibili.com/x/topic/resource/report", {
                     method: "POST",
                     headers: {
                         "Content-Type": "application/x-www-form-urlencoded",
                     },
                     body: `topic_id=${topic_id}&res_type=0&res_id_str=${dyn.id_str}&reason=${reasons}&csrf=${csrf}`,
                     credentials: "include",
                 })
                  .then((response) => {
                     let json = response.json();
                     resolve(json);
                     return json;
                 })
                  .then((data) => {
                     if (data.code === 0) {
                         echo.log("report card success " + dyn.id_str);
                         window.toast(`举报动态 ${dyn.id_str} 成功`, "success");
                         if (reason) {
                             document.getElementById("dy_counter").innerHTML++;
                             cardSet.add(dyn.id_str);
                         }
                     } else {
                         echo.log("report card failed " + JSON.stringify(data));
                         window.toast(
                             `举报动态 ${dyn.id_str} 失败: ${data.message}`,
                             "error"
                         );
                     }
                 });
             });
        }
        let reasons = ["引战", "垃圾广告", "虚假不实信息"];
        let reason = reasons[Math.floor(Math.random() * reasons.length)];

        await report();
        let time = randomInt(1000, 5000);
        await timeout(time);
        await report(reason);
        await timeout(5000);
        dyn.mid = dyn.modules.module_author.mid;
        await reportTrends(dyn, true);
    }

    async function reportTrends(dyn, card) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let accused_uid = dyn.mid;
        function reportTrend(reason, reason_desc) {
            reason = reason || 7;
            reason_desc = reason_desc || null;
            return new Promise((resolve, reject) => {
                 fetch(`https://api.bilibili.com/x/dynamic/feed/dynamic_report/add?csrf=${csrf}`, {
                     method: "POST",
                     headers: {
                         "Content-Type": "application/json;charset=UTF-8",
                     },
                     body: `{"accused_uid":${accused_uid},"dynamic_id":"${dyn.id_str}","reason_type":${reason},"reason_desc":${reason_desc}}`,
                     credentials: "include",
                 })
                  .then((response) => {
                     let json = response.json();
                     resolve(json);
                     return json;
                 })
                  .then((data) => {
                     if (data.code === 0) {
                         echo.log("report success " + dyn.id_str);
                         sharesSet.add(accused_uid+","+dyn.id_str);
                         window.toast(`举报动态 ${dyn.id_str} 成功`, "success");
                         if (!card) {
                             document.getElementById("dy_counter").innerHTML++;
                         }
                     } else if (data.code === 4126133) {
                         sharesSet.add(accused_uid+","+dyn.id_str);
                     } else {
                         echo.log("report failed " + JSON.stringify(data));
                         window.toast(
                             `举报动态 ${dyn.id_str} 失败: ${data.message}`,
                             "error"
                         );
                     }
                 });
             });
        }

        let reasonsTrend = [4, 5, 7, 8, 12];
        let reasonTrend = reasonsTrend[Math.floor(Math.random() * reasonsTrend.length)];
        await reportTrend(reasonTrend);
    }

    async function reportVideo(bv) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        //var aid = convertVideo(bv),
        let bl = bv.split(","),
            bls = bl[0]+","+bl[1],
            aid = bl[1],
            tid = bl[2],
            desc,
            attach = "",
            tids = [],
            descs = [];
        if (tid) {
            tids = tid.split("_");
            tid = tids[Math.floor(Math.random() * tids.length)];
            descs = bot.desclist[bl[0]];
            desc = descs[Math.floor(Math.random() * descs.length)];
        } else {
            tids = [1, 2, 7, 9, 10013, 10017];
            tid = tids[Math.floor(Math.random() * tids.length)];
            if (tid == 1) {
                desc = "此视频恶意p图剪辑对他人进行人身攻击和引战，请删除视频并封禁此账号";
            } else if (tid == 2) {
                desc = "此视频涉及违法黑产信息，并用这些虚假信息造谣对他人进行人身攻击和引战，请删除视频并封禁此账号";
            } else if (tid == 7) {
                desc = "此视频涉及恶意p图剪辑，并用这些虚假信息造谣对他人进行人身攻击，请删除视频并封禁此账号";
            } else if (tid == 9) {
                desc = "此视频涉及恶意p图剪辑，并用这些虚假信息造谣进行引战，请删除视频并封禁此账号";
            } else if (tid == 10013) {
                desc = "标题与视频毫无关联，请删除视频并封禁此账号";
            } else if (tid == 10017) {
                desc = "此视频涉及恶意p图剪辑，并用这些虚假信息造谣传播，请删除视频并封禁此账号";
            } else {
                desc = "此视频涉及恶意p图剪辑，并用这些虚假信息造谣对他人进行人身攻击和引战，请删除视频并封禁此账号";
            }
        }
        function report() {
            return new Promise((resolve, reject) => {
                 fetch(`https://api.bilibili.com/x/web-interface/appeal/v2/submit`, {
                     method: "POST",
                     headers: {
                         "Content-Type": "application/x-www-form-urlencoded",
                     },
                     body: `aid=${aid}&tid=${tid}&csrf=${csrf}&desc=${desc}&attach=${attach}`,
                     credentials: "include",
                 })
                  .then((response) => {
                     let json = response.json();
                     resolve(json);
                     return json;
                 })
                  .then((data) => {
                     if (data.code === 0) {
                         if (!videoRecordSet.has(bls)) {
                             echo.log("report video success " + bl[0]);
                             videoRecordSet.add(bls);
                         }
                         //echo.log("report video success " + bv.split(",")[0]);
                         //window.toast(`举报视频 ${bv} 成功`, "success");
                         //document.getElementById("video_counter").innerHTML++;
                         usedSet.add(bls);
                     } else if (data.code == -412) {
                         usedSet.add(bls);
                         botstatus.videoreportstatus = false;
                         echo.log("report video failed " + bl[0] + JSON.stringify(data));
                     } else if (data.code === 62009) {
                         usedSet.add(bls);
                     } else {
                         echo.log("report video failed " + bl[0] + JSON.stringify(data));
                         //window.toast(`举报视频 ${bv} 失败: ${data.message}`, "error");
                     }
                 });
             });
        }
        await report();
        let time = randomInt(1000);
        await timeout(time);
        await dislikeVideo(bv);
    }

    function convertVideo(bv, type) {
        var table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
        var tr = {};
        for (let i = 0; i < 58; i++) {
            tr[table[i]] = i;
        }
        var s = [11, 10, 3, 8, 4, 6];
        var xor = 177451812,
            add = 8728348608;

        function dec(x) {
            var r = 0;
            for (let i = 0; i < 6; i++) {
                r += tr[x[s[i]]] * Math.pow(58, i);
            }
            return (r - add) ^ xor;
        }

        function enc(x) {
            x = (x ^ xor) + add;
            var r = "BV1  4 1 7  ".split("");
            for (let i = 0; i < 6; i++) {
                r[s[i]] = table[Math.floor(x / Math.pow(58, i)) % 58];
            }
            return r.join("");
        }
        if (type && type == 'bid') {
            return enc(bv);
        } else {
            return dec(bv);
        }
    }

    function convertTime (timestamp) {
		let time = new Date(timestamp*1000)
		let year = time.getFullYear()
		let month = time.getMonth() + 1
		let date = time.getDate()
		let hours = time.getHours()
		let minute = time.getMinutes()
		let second = time.getSeconds()

		if (month < 10) { month = '0' + month }
		if (date < 10) { date = '0' + date }
		if (hours < 10) { hours = '0' + hours }
		if (minute < 10) { minute = '0' + minute }
		if (second < 10) { second = '0' + second }
		return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
	}

    function randomInt(min, max){
        if (max === undefined) {
            if (Array.isArray(min) && min.length == 2) {
                [min, max] = min
            } else {
                [min, max] = [0, min]
            }
        }
        return Math.floor(Math.random()*(max-min)+min)
    }

    async function checkReply(reply, oid, oldData) {
        try {
            // reply.replies = undefined;
            if (reply.invisible) return;
            if (reply.rcount != 0) {
                var isrcount = false;
                if (reply.replies) {
                    for (let r of reply.replies) {
                        r.title = reply.title;
                        if (reply.as_name) {
                            r.as_name = reply.as_name;
                        }
                        await checkReply(r, oid, oldData);
                    }
                    if (reply.replies.length != reply.rcount) {
                        isrcount = true;
                    }
                } else {
                    isrcount = true;
                }
                if (isrcount) {
                    await timeout(bot.constant_time);
                    reply.oid = oid;
                    let replies = (await getRcountReplies(reply)).data.replies || [];
                    if (reply.rcount > 20) {
                        await timeout(bot.constant_time);
                        var num = Math.ceil(reply.rcount / 20);
                        let replies1 = (await getRcountReplies(reply, num)).data.replies || [];
                        replies = [...replies, ...replies1];
                    }
                    for (let r of replies) {
                        r.title = reply.title;
                        if (reply.as_name) {
                            r.as_name = reply.as_name;
                        }
                        await checkReply(r, oid, oldData);
                    }
                }
            }
            if (reportSet.has(reply.type+","+reply.rpid+","+oid)) return;
            if (likeSuccessSet.has(reply.type+","+reply.rpid+","+oid)) return;
            let s = reply.content.message;
            let info = {uid: reply.mid, keyword: "", stereotype: ""};
            if (reply.action === 2) {
                if (oldData) {
                    errorSet.add(reply.type+","+reply.rpid+","+oid);
                } else {
                    priorReportSet.add(reply.type+","+reply.rpid+","+oid);
                }
                reportSet.add(reply.type+","+reply.rpid+","+oid);
                return;
            }
            let aslist = [];
            if (reply.as_name && bot[reply.as_name]) {
                aslist = bot[reply.as_name];
            }
            if (bot.whitelist.includes(reply.mid)){
                if(
                    bot.autolike &&
                    reply.action !== 1
                ){
                    s = s.substring(0,20);
                    info.name = reply.member.uname;
                    info.ip = reply.reply_control.location;
                    info.time = convertTime(reply.ctime);
                    info.rpid = reply.rpid;
                    info.url = `https://www.bilibili.com/h5/comment/sub?oid=${oid}&pageType=${reply.type}&root=${reply.rpid}`;
                    if (reply.title) {
                        let title = "《"+reply.title+"》";
                        echo.log("reply in whitelist " + JSON.stringify([s, title, info]));
                    } else {
                        echo.log("reply in whitelist " + JSON.stringify([s, oid, info]));
                    }
                    await likeReply(reply, oid);
                }
            } else if (aslist.includes(reply.mid)){
            } else if (
                Object.keys(bot.kw_dict).some(function(keyword) {
                    if (s.includes(keyword)) {
                        info.keyword = keyword;
                        if (bot.kw_dict[keyword]) {
                            info.reason = bot.kw_dict[keyword][0];
                            info.stereotype = bot.kw_dict[keyword][1]
                        }
                        return true
                    }
                }) || bot.list.includes(reply.mid)
            ) {
                s = s.substring(0,20);
                info.name = reply.member.uname;
                info.ip = reply.reply_control.location;
                info.time = convertTime(reply.ctime);
                info.rpid = reply.rpid;
                info.url = `https://www.bilibili.com/h5/comment/sub?oid=${oid}&pageType=${reply.type}&root=${reply.rpid}`;
                if (reply.title) {
                    let title = "《"+reply.title+"》";
                    echo.log("reply in blacklist " + JSON.stringify([s, title, info]));
                } else {
                    echo.log("reply in blacklist " + JSON.stringify([s, oid, info]));
                }
                reportSet.add(reply.type+","+reply.rpid+","+oid);
                if (reply.mid == 16) {
                    await useReport(reply, reply.mid);
                }
                if (oldData) {
                    errorSet.add(reply.type+","+reply.rpid+","+oid);
                } else {
                    await hateAndReportReply(reply, oid);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function checkAttackReply(reply, oid) {
        try {
            // reply.replies = undefined;
            let s = reply.content.message;
            if (bot.whitelist.includes(reply.mid)){
                if(
                    bot.autolike &&
                    reply.action !== 1
                ){
                    echo.log("reply in whitelist");
                    await likeReply(reply, oid);
                }
            }else if (
                Object.keys(bot.kw_dict).some(function(keyword) {
                    if (s.includes(keyword)) {
                        return true
                    }
                }) || bot.list.includes(reply.mid)
            ) {
                await hateReply(reply, oid);
            }
        } catch (err) {
            console.log(err);
        }
    }

    function checkVideo(item) {
        try {
            let s = item.name || item.title;
            let tag = item.tag || "";
            let uid = item.author_id || item.mid;
            let bv = item.bvid;
            let aid = item.aid || item.id;
            let pubdate = item.pubdate || 1680278400;
            let info = {uid: uid};
            if (!aid) {
                aid = convertVideo(bv)
            }
            let aslist = [];
            if (item.as_name && bot[item.as_name]) {
                aslist = bot[item.as_name];
            }
            if (bot.whitelist.includes(uid)){
            } else if (bot.videowhitelist.includes(uid) || aslist.includes(uid)){
            } else if (
                Object.keys(bot.kw_dict).some(function(keyword) {
                    if (s.includes(keyword) || tag.includes(keyword)) {
                        info.keyword = keyword;
                        return true
                    }
                }) || (bot.list.includes(uid) && pubdate > 1671724800)
            ) {
                if (!videoSet.has(bv+","+aid)) {
                    info.url = `https://www.bilibili.com/video/${bv}`;
                    echo.log("video in blacklist " + JSON.stringify([s, info]));
                    videoSet.add(bv+","+aid);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function likeReply(reply, oid) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let ordering = "time";
        function like() {
            return new Promise((resolve, reject) => {
                fetch("https://api.bilibili.com/x/v2/reply/action", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `oid=${oid}&type=${reply.type}&rpid=${reply.rpid}&action=1&ordering=${ordering}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            echo.log("like success " + reply.rpid);
                            likeSuccessSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`点赞回复 ${reply.rpid} 成功`, "success");
                        } else if (data.code === 12035) {
                            likeSuccessSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`点赞回复 ${reply.rpid} 失败: ${data.message}`, "error");
                        } else {
                            echo.log("like failed" + JSON.stringify(data));
                            likeSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`点赞回复 ${reply.rpid} 失败: ${data.message}`, "error");
                        }
                    });
            });
        }
        let time = randomInt(1000);
        await timeout(time);
        like();
    }

    async function hateAndReportReply(reply, oid, oldData) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let reasons = [4, 7];
        let reason = reasons[Math.floor(Math.random() * reasons.length)];
        let ordering = "time";
        let add_blacklist = "false";
        function hate() {
            return new Promise((resolve, reject) => {
                fetch("https://api.bilibili.com/x/v2/reply/hate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `oid=${oid}&type=${reply.type}&rpid=${reply.rpid}&action=1&ordering=${ordering}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            //echo.log("hate success " + reply.rpid);
                            window.toast(`点踩回复 ${reply.rpid} 成功`, "success");
                        } else {
                            //echo.log("hate failed " + JSON.stringify(data));
                            dislikeSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`点踩回复 ${reply.rpid} 失败: ${data.message}`, "error");
                        }
                    });
            });
        }
        function report() {
            return new Promise((resolve, reject) => {
                fetch("https://api.bilibili.com/x/v2/reply/report", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `oid=${oid}&type=${reply.type}&rpid=${reply.rpid}&reason=${reason}&content=&add_blacklist=${add_blacklist}&ordering=${ordering}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            echo.log("report success " + reply.rpid);
                            repeatSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`举报回复 ${reply.rpid} 成功`, "success");
                            document.getElementById("reply_counter").innerHTML++;
                        } else {
                            window.toast(`举报回复 ${reply.rpid} 失败: ${data.message}`, "info");
                            // 已举报判断
                            if (data.code == -352) {
                                echo.log("report failed " + reply.rpid + JSON.stringify(data));
                                if (oldData) {
                                     errorSet.add(reply.type+","+reply.rpid+","+oid);
                                } else {
                                    priorReportSet.add(reply.type+","+reply.rpid+","+oid);
                                }
                                codestatus = false;
                            } else if (data.code === 12008) {
                                errorSet.delete(reply.type+","+reply.rpid+","+oid);
                                priorReportSet.delete(reply.type+","+reply.rpid+","+oid);
                                repeatSet.add(reply.type+","+reply.rpid+","+oid);
                            } else if (data.code === 12019) {
                                //echo.log("report failed " + reply.rpid + JSON.stringify(data));
                                 if (oldData) {
                                     errorSet.add(reply.type+","+reply.rpid+","+oid);
                                 } else {
                                     priorReportSet.add(reply.type+","+reply.rpid+","+oid);
                                 }
                            } else {
                                echo.log("report failed " + reply.rpid + JSON.stringify(data));
                                if (oldData) {
                                     errorSet.add(reply.type+","+reply.rpid+","+oid);
                                } else {
                                    priorReportSet.add(reply.type+","+reply.rpid+","+oid);
                                }
                            }
                        }
                    });
            });
        }
        let time = randomInt(1000);
        await timeout(time);
        await hate();
        if (codestatus) {
            await report();
        } else {
            if (oldData) {
                errorSet.add(reply.type+","+reply.rpid+","+oid);
            } else {
                priorReportSet.add(reply.type+","+reply.rpid+","+oid);
            }
        }
        //Promise.all([hate(), report()]);
    }

    async function useReport(reply, mid) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let reasons_v2 = [1, 2, 3, 4];
        let reason_v2 = reasons_v2[Math.floor(Math.random() * reasons_v2.length)];
        function usereport(mid) {
            return new Promise((resolve, reject) => {
                fetch("https://space.bilibili.com/ajax/report/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `mid=${mid}&reason="1,2,3"&reason_v2=${reason_v2}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            echo.log("report user success " + reply.rpid);
                            window.toast(`举报用户UID：${mid} 成功`, "success");
                            document.getElementById("reply_counter").innerHTML++;
                        } else {
                            echo.log("report user failed " + JSON.stringify(data));
                            window.toast(`举报用户UID：${mid} 失败: ${data.message}`, "info");
                        }
                    });
            });
        }
        if (mid) {
            let time = randomInt(5000, 10000);
            await timeout(time);
            await usereport(mid);
        }
    }

    async function hateReply(reply, oid) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let ordering = "time";
        function hate() {
            return new Promise((resolve, reject) => {
                fetch("https://api.bilibili.com/x/v2/reply/hate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `oid=${oid}&type=${reply.type}&rpid=${reply.rpid}&action=1&ordering=${ordering}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            //echo.log("hate success " + reply.rpid);
                            window.toast(`点踩回复 ${reply.rpid} 成功`, "success");
                        } else {
                            //echo.log("hate failed " + JSON.stringify(data));
                            dislikeSet.add(reply.type+","+reply.rpid+","+oid);
                            window.toast(`点踩回复 ${reply.rpid} 失败: ${data.message}`, "error");
                        }
                    });
            });
        }
        let time = randomInt(1000);
        await timeout(time);
        await hate();
    }

    async function appealReply(bv) {
        const cookie = window.document.cookie;
        const csrf = cookie.match(/bili_jct=(\w+)/)[1];
        let bl = bv.split(","),
            oid = bl[0],
            type = bl[1],
            reasons = bot.appealreasons || ["无违规，被脚本恶意举报，希望能恢复"],
            reason = reasons[Math.floor(Math.random() * reasons.length)];
        function appeal() {
            return new Promise((resolve, reject) => {
                fetch("https://api.bilibili.com/x/v2/reply/appeal/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `type=${type}&oid=${oid}&reason=${reason}&csrf=${csrf}`,
                    credentials: "include",
                })
                    .then((response) => {
                        let json = response.json();
                        resolve(json);
                        return json;
                    })
                    .then((data) => {
                        if (data.code === 0) {
                            appealnum++;
                            echo.log("appeal success " + oid);
                            window.toast(`申诉评论 ${oid} 成功`, "success");
                        } else {
                            appealnum = 3;
                            echo.log("appeal failed " + JSON.stringify(data));
                            window.toast(`申诉评论 ${oid} 失败: ${data.message}`, "error");
                        }
                    });
            });
        }
        await appeal();
    }

    function deleteCard() {
        [...document.getElementsByClassName("list__topic-card")].forEach((el) => {
            [...cardSet].some((id) => {
                if (el.innerHTML.includes(id)) {
                    el.remove();
                    return true;
                }
            });
        });
    }
    main();
})();