// ==UserScript==
// @name         B站直播通知
// @version      0.2.2
// @description  需要有至少一个b站页面开在后台，通常提醒延迟不超过3分钟
// @author       Pronax
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_addValueChangeListener 
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/432740/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/432740/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

// todo 更新时统一销毁通知

(function () {
    'use strict';

    const TAB_DETAIL = {
        name: giveMeAName(),
        type: undefined,
        data: null
    };
    // 单位都是ms
    const TITLE_ICON = "✔ ";
    const NOTIFACTION_TIMEOUT = 15000;      // 并不一定会使用
    const CONSUMER_LOOP_TERM = 60000;
    const RETRY_LOOP_TERM = CONSUMER_LOOP_TERM * 0.75;
    const LIST_EXPIRE_TIME = CONSUMER_LOOP_TERM * 10.0;
    const CONSUMER_EXPIRE_TIME = CONSUMER_LOOP_TERM * 1.5;

    var notificationList = [];
    var master = GM_getValue("master");
    // list存的都是uid
    var onlineList = getList("onlineList");
    var blockList = getList("blockList");

    var temp_variable = {
        timeout: null,
        interval: null
    };

    GM_addValueChangeListener("bordercast",
        function (name, last, msg, remote) {
            msg.remote = remote;
            eval(`${msg.type}`)(msg);
        });

    window.addEventListener('beforeunload', (event) => {
        // 注销
        if (master.name == TAB_DETAIL.name) {
            GM_deleteValue("master");
        }
    });

    // 分类页面
    if (TAB_DETAIL.type = location.href.match(/live.bilibili.com\/(\d+)/)) {
        fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${TAB_DETAIL.type[1]}`)
            .then(r => r.json())
            .then(json => {
                TAB_DETAIL.type = "live";
                TAB_DETAIL.data = json.data;
                bordercast({
                    type: "modify",
                    target: null,
                    variable: "blockList",
                    action: "add",
                    value: TAB_DETAIL.data.uid
                });
            });
    }

    observer();
    temp_variable.interval = setInterval(() => {
        observer();
    }, RETRY_LOOP_TERM);

    async function observer() {
        if (master == undefined || Date.now() - master.lastHeartbeat > CONSUMER_EXPIRE_TIME) {
            let diff = master ? Date.now() - master.lastHeartbeat : 0;   // 防止被后续的选举行为刷新
            electSelf();
            await sleep(1000);
            if (master.name == TAB_DETAIL.name) {
                // 根据时间判断是否初始化列表，小于1500用于防止反复开关页面的防抖
                if (diff > LIST_EXPIRE_TIME || diff < 1500) {
                    leader(true);
                } else {
                    leader();
                }
                clearCountdown(temp_variable.interval);
                temp_variable.interval = setInterval(() => {
                    leader();
                }, CONSUMER_LOOP_TERM);
                return;
            }
        }
        changeTabTitle();
    }

    async function leader(isInit) {
        changeTabTitle();
        if (master.name == TAB_DETAIL.name) {
            heartbeat();
            await checkLiveList(isInit);
            GM_setValue("sync", TAB_DETAIL.name);
        } else {
            clearCountdown(temp_variable.interval);
            temp_variable.interval = setTimeout(() => {
                observer();
            }, RETRY_LOOP_TERM);
        }
    }

    async function checkLiveList(isInit) {
        return new Promise((r, j) => {
            fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/w_live_users?size=100`, {
                credentials: 'include'
            })
                .then(r => r.json())
                .then(result => {
                    if (result.code == result.message) {
                        if (!result.data.items) { return; }
                        let newList = new Set();
                        // let count = 0;
                        for (let item of result.data.items) {
                            if (!(isInit || onlineList.has(item.uid) || blockList.has(item.uid))) {
                                console.log("发送" + item.uname + "的开播通知");
                                // setTimeout(() => {
                                notify(item.uid, item.uname, item.title, item.face, item.link);
                                // }, NOTIFACTION_TIMEOUT * Math.floor(count++ / 3));
                            }
                            newList.add(item.uid);
                        }
                        onlineList = newList;
                        blockList.clear();
                        saveList();
                        bordercast({
                            type: "sync",
                            target: null,
                            variable: null,
                            action: null,
                            value: null
                        });
                        r(true);
                    } else {
                        j(result);
                        alert("在线列表获取失败：" + result.message);
                    }
                });
        });
    }

    function bordercast(msg) {
        GM_setValue("bordercast", msg);
    }

    function electSelf(timestamp = Date.now()) {
        bordercast({
            type: "election",
            target: null,
            variable: "master",
            action: "assign",
            value: {
                name: TAB_DETAIL.name,
                lastHeartbeat: timestamp
            }
        });
    }

    function sync(msg) {
        clearCountdown(temp_variable.timeout);
        if (!msg.remote) {
            loadList();
        }
        if (TAB_DETAIL.type == "live") {
            bordercast({
                type: "modify",
                target: null,
                variable: "blockList",
                action: "add",
                value: TAB_DETAIL.data.uid
            });
        }
        if (master.name == TAB_DETAIL.name) {
            temp_variable.timeout = setTimeout(() => {
                saveList();
                bordercast({
                    type: "loadList",
                    target: null,
                    variable: null,
                    action: null,
                    value: null
                });
            }, 1000);
        }
    }

    // 方法通过eval调用
    function election(msg) {
        master = msg.value;
    }

    // 方法通过eval调用
    function modify(msg) {
        eval(`${msg.variable}.${msg.action}(${msg.value})`);
    }

    async function sleep(ms) {
        return new Promise(r => {
            setTimeout(() => {
                r(true);
            }, ms);
        });
    }

    function notify(roomid, nickname, roomname, avatar, link) {
        // 因为Notification需要主动授权，所以在未授权时会使用GM发送提醒
        if (Notification.permission != "granted") {
            console.log("油猴");
            Notification.requestPermission();
            /** 
             * 2022年4月6日 在本人电脑上测试
             * 环境：TamperMonkey 4.14 + Chrome 100.0.4896.75
             * GM_notification在chrome上会表现为一个和alert很相似的弹框
             * 和Notification构造出的提示相差甚远，无法作为提示使用
             * 故依旧使用原生Notification进行提示
             * 2022年7月15日 tampermonkey产生的通知在timeout以后会自动清除
             * 通知中心不会留下记录
             */
            GM_notification({
                text: nickname + "正在直播",
                title: roomname,
                image: avatar,
                timeout: NOTIFACTION_TIMEOUT,
                onclick: () => {
                    console.log(link);
                    GM_openInTab(link, false);
                },
            });
        } else {
            console.log("原生");
            let obj = new Notification(roomname, {
                dir: "ltr",
                lang: "zh-CN",
                body: nickname + "正在直播",
                tag: roomid,
                icon: avatar,
                silent: false,
            });
            obj.onclick = (e) => {
                e.preventDefault(); // prevent the browser from focusing the Notification's tab
                window.open(link, '_blank');
                setTimeout(obj.close.bind(obj), 1000);
            }
            // 集中通知中心记录，下一次更新时统一清空
            // notificationList.push(obj);
        }
    }

    function heartbeat(timestamp = Date.now()) {
        if (master.name == TAB_DETAIL.name) {
            GM_setValue("master", {
                "name": TAB_DETAIL.name,
                "lastHeartbeat": timestamp
            });
            electSelf(timestamp);
            return true;
        }
        return false;
    }

    function giveMeAName() {
        let name = Date.now().toString(16) + "-" + btoa(location.host);
        return name;
    }

    function loadList(msg) {
        onlineList = getList("onlineList");
        blockList = getList("blockList");
    }

    function getList(name) {
        let list = GM_getValue(name);
        list = list ? list.split(",").map(Number) : [];
        return new Set(list);
    }

    function saveList() {
        GM_setValue("onlineList", Array.from(onlineList).toString());
        GM_setValue("blockList", Array.from(blockList).toString());
    }

    function clearCountdown(timeout) {
        clearInterval(timeout);
        clearTimeout(timeout);
    }

    function changeTabTitle() {
        document.title = (master.name == TAB_DETAIL.name ? TITLE_ICON : "") + document.title.replace(TITLE_ICON, "");
    }

})();