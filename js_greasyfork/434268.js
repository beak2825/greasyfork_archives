// ==UserScript==
// @name         自动弹幕
// @namespace    http://pronax.tech/
// @version      0.3.0
// @description  dd专用的版本
// @author       Pronax
// @match        https://live.bilibili.com/*
// @icon         http://bilibili.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @require      https://greasyfork.org/scripts/434638-xfgryujk-s-bliveproxy/code/xfgryujk's%20bliveproxy.js?version=983438
// @downloadURL https://update.greasyfork.org/scripts/434268/%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/434268/%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 不登录用锤子呢
    if (!document.cookie.match(/bili_jct=(\w*); /)) { return; }

    const JCT = document.cookie.match(/bili_jct=(\w*); /)[1];
    const ROOM_ID = location.href.match(/\/(\d+)/)[1];
    const CHINESE_NUMBER = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    const DANMU_LENGTH_LIMIT = 20;

    // 时间类单位都是ms
    const GIFT_INTERVAL = 15000;         // 付费礼物感谢弹幕冷却
    const FREE_GIFT_INTERVAL = 60000;    // 免费礼物感谢弹幕冷却
    const WELCOME_INTERVAL = 300000;     // 入场欢迎弹幕冷却
    const BROADCAST_INTERVAL = 300000;   // 公告弹幕冷却

    const BROADCAST_CONTENT = [          //定时公告 
        "这么宝藏的主播还不关注吗♡",
        "动态里面有歌单，欢迎点歌噢",
        "喜欢主播的可以加下粉丝群♡开播有通知哦",
        "好听吗，好听就刷点(´∀｀)♡",
    ];
    const GUARD_CONTENT = [              //上舰感谢语 
        "感谢老板上船。这次！绝对不糊涂！",
        "欢迎加入大航海，阿里嘎多",
        "友谊的小船说上就上！",
    ];
    const FOLLOW_CONTENT = [             //关注感谢语 
        "你的眼光很独到@$1",
        "关注了我们就是好朋友了！",
    ];
    const ENTER_CONTENT = [             //入场弹幕
        "哇@$1来啦，欢迎！",
        "@$1来了，给大佬倒茶",
        "欢迎小可爱@$1",
        "@$1别看了出来聊天",
        "@$1，欢迎入座，看到日落",
    ];

    var count = 0;                       // 发送队列计数器
    var ts_send = 0;                     // 发送队列时间戳
    var contentPointer = 0;              // 内容指针

    unsafeWindow.__isEnabled = {
        pk: false,
        enter: false,
        guard: false,
        follow: false,
        broadcast: false,
    };

    GM_addStyle(".dd-control{ margin-left:50px;color: #fff;cursor: pointer;}.dd-control>*:first-child{border-left:0;}.dd-control>*{border-left:1px solid #666;user-select:none;padding: 3.5px 4px;vertical-align: middle;background-color:#6DACEF}");

    setTimeout(async () => {
        let index = 0;
        let funcName = ["PK", "入场", "上舰", "关注", "广播"];
        let ele = document.createElement("div");
        ele.classList.add("dd-control");
        for (let key in unsafeWindow.__isEnabled) {
            ele.innerHTML += `<b data-target="${key}">${funcName[index++]}</b>`;
        }
        ele.onclick = function (e) {
            let target = e.target.getAttribute("data-target");
            unsafeWindow.__isEnabled[target] = !unsafeWindow.__isEnabled[target];
            e.target.style.backgroundColor = unsafeWindow.__isEnabled[target] ? "#FF4F87" : "#6DACEF";
        }
        document.querySelector(".left-ctnr").append(ele);
    }, 3000);

    // var countdown = 100;
    // var interval = setInterval(() => {
    //     if (document.querySelector(".right-ctnr")) {
    //         clearInterval(interval);
    //         let div = document.createElement('div');
    //         div.innerHTML = `<div class="bili-robot-btn icon-ctnr live-skin-normal-a-text pointer" style="line-height: 16px;"><i class="v-middle icon-font icon-block-half" style="font-size: 16px;"></i><span class="action-text v-middle" style="font-size: 12px;">弹幕姬</span></div>`;
    //         document.querySelector(".right-ctnr").prepend(div);
    //     } else if (!countdown) {
    //         clearInterval(interval);
    //     }
    //     countdown++;
    // }, 100);

    // PK开始
    bliveproxy.addCommandHandler("PK_BATTLE_PRE_NEW", async (message) => {
        if (!unsafeWindow.__isEnabled.pk) return;
        // 因为胜场不会每日清零，所以弃用
        // `https://api.live.bilibili.com/av/v1/Battle/anchorBattleRank?uid=${message.data.uid}&room_id=${message.data.room_id}`
        let dailyStreakRank = await ajax(`https://api.live.bilibili.com/xlive/general-interface/v1/battle/getDailyStreakRank?room_id=${message.data.room_id}&ruid=${message.data.uid}&season_id=${message.data.season_id}&need_current_info=1&page_size=1&page=1`, "GET", null);
        let goldRank = await ajax(`//api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${message.data.uid}&roomId=${message.data.room_id}&page=1&pageSize=50`, "GET", null);
        if (dailyStreakRank.code == 0 && goldRank.code == 0) {
            let total = 0;
            for (let user of goldRank.data.OnlineRankItem) {
                if (user.userRank <= 3) {
                    total += user.score;
                }
            }
            sendDanmu(`【PK】对手连胜${dailyStreakRank.data.owner_rank.score}场，高能榜${goldRank.data.onlineNum}人`);
            if (goldRank.data.onlineNum > 0) {
                sendDanmu(`【PK】对方礼物总计${total}电池`);
            }
        }
    });

    // SC
    // bliveproxy.addCommandHandler("SUPER_CHAT_MESSAGE", message => {
    //     // sendDanmu(GUARD_CONTENT[contentPointer++ % GUARD_CONTENT.length].replace("$1", message.data.username));
    //     console.warn(message);
    // });

    // 上舰
    bliveproxy.addCommandHandler("USER_TOAST_MSG", message => {
        if (!unsafeWindow.__isEnabled.guard) return;
        sendDanmu(GUARD_CONTENT[contentPointer++ % GUARD_CONTENT.length].replace("$1", message.data.username));
    });

    var enterCount = new Map(), enterNotice = new Map(), enterCountGap = 300000;

    // 小字交互
    bliveproxy.addCommandHandler("INTERACT_WORD", message => {
        switch (message.data.msg_type) {
            case 1:  // 入场
                if (!unsafeWindow.__isEnabled.enter) return;
                // 人数太多的时候就不发了
                enterCount.set(message.data.uname, setTimeout(() => {
                    enterCount.delete(message.data.uname);
                }, enterCountGap));
                if (enterCount.size < 5 && !enterNotice.get(message.data.uname)) {
                    sendDanmu(ENTER_CONTENT[contentPointer++ % ENTER_CONTENT.length].replace("$1", message.data.uname), 0, () => {
                        enterNotice.set(message.data.uname, setTimeout(() => {
                            enterNotice.delete(message.data.uname);
                        }, enterCountGap));
                    });
                }
                break;
            case 2:  // 关注
                if (!unsafeWindow.__isEnabled.follow) return;
                sendDanmu(FOLLOW_CONTENT[contentPointer++ % FOLLOW_CONTENT.length].replace("$1", message.data.uname));
                break;
            case 3:  // 分享
            default:
                break;
        }
    });

    // 广播
    if (BROADCAST_CONTENT.length) {
        setInterval(() => {
            if (!unsafeWindow.__isEnabled.broadcast) return;
            broadcast();
        }, BROADCAST_INTERVAL);
    }

    function broadcast() {
        sendDanmu(BROADCAST_CONTENT[contentPointer++ % BROADCAST_CONTENT.length]);
    }

    function sendDanmu(msg, reTryCount = 0, callback) {
        if (msg.length > DANMU_LENGTH_LIMIT) {
            console.warn("这条弹幕超出长度限制无法发送：", msg);
            return;
        }
        if (ts_send > Date.now()) {
            setTimeout(() => { sendDanmu(msg, reTryCount, callback); }, ts_send - Date.now());
            return;
        }
        ts_send = Date.now() + 1500 * (++count + reTryCount);
        ajax("https://api.live.bilibili.com/msg/send", "POST", {
            "bubble": 0,
            "msg": msg,
            "color": 16777215,
            "mode": 1,
            "fontsize": 25,
            "rnd": Date.now(),
            "roomid": ROOM_ID,
            "csrf": JCT,
            "csrf_token": JCT
        }, function (result) {
            if (result.code || result.msg != "") {
                switch (result.msg) {
                    case "f":
                    case "fire":
                        result.msg = "含有敏感词";
                        reTryCount = 100;
                        return;
                }
                console.log(result);
                if (reTryCount >= 2) {
                    console.warn("有一条弹幕发送失败：", msg);
                    count >= 1 ? count-- : 0;
                    return;
                }
                if (ts_send > Date.now()) {
                    setTimeout(() => { sendDanmu(msg, ++reTryCount, callback); }, ts_send - Date.now());
                } else {
                    sendDanmu(msg, ++reTryCount, callback);
                }
            } else {
                callback && callback();
            }
            count >= 1 ? count-- : 0;
        });
    }

    async function ajax(url, type, data, callback) {
        return new Promise((resolve, reject) => {
            let params = new URLSearchParams();
            for (let key in data) {
                params.set(key, data[key]);
            }
            let xhr = new XMLHttpRequest();
            xhr.open(type, url, true);
            xhr.withCredentials = true;
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 304) {
                        resolve(JSON.parse(xhr.response));
                        callback && callback(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.send(params);
        });
    }

})();