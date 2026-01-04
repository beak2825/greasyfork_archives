// ==UserScript==
// @name            B站直播自动抢红包
// @version         0.2.13
// @description     进房间自动抢红包，抢完自动取关（需满足条件）
// @author          Pronax
// @include         /https:\/\/live\.bilibili\.com\/(blanc\/)?\d+/
// @icon            http://bilibili.com/favicon.ico
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @connect         api.live.bilibili.com
// @run-at          document-end
// @noframes
// @require         https://greasyfork.org/scripts/434638-xfgryujk-s-bliveproxy/code/xfgryujk's%20bliveproxy.js?version=983438
// @require         https://greasyfork.org/scripts/430098-alihesari-s-notice-js-0-4-0/code/alihesari's%20noticejs%20040.js?version=985170
// @require         https://greasyfork.org/scripts/439903-blive-room-info-api/code/blive_room_info_api.js?version=1037039
// @namespace https://greasyfork.org/users/412840
// @downloadURL https://update.greasyfork.org/scripts/439169/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%BA%A2%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/439169/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%BA%A2%E5%8C%85.meta.js
// ==/UserScript==

// todo 关闭得奖提示后，下次发送的得奖提示会继续使用之前的获奖数量（得奖提示关闭后应该清空计数）
// todo 活动直播间红包第二次不会重新抽取

; (async function () {

    if (!document.cookie.match(/bili_jct=(\w*); /)) { return; }

    // 抢红包门槛，只有红包价值大于等于门槛的时候才会抢
    // 单位是电池
    const doorSill = 0;
    // 你可以在这里枚举不想抽取的红包价值，单位是电池
    // e.g. const goldBlockEnumList = [16,20,100];
    const goldBlockEnumList = [];

    const RED_PACKET_ICON = "🧧";
    const GIFT_ICON = "🎁";
    const ROOM_ID = await ROOM_INFO_API.getRid();
    const ROOM_USER_ID = await ROOM_INFO_API.getUid();
    const FOLLOWED = await getFollowStatus(ROOM_USER_ID);
    const Setting = {
        get UID() {
            return document.cookie.match(/DedeUserID=(\d*); /)[1]
        },
        get TOKEN() {
            let regex = document.cookie.match(/bili_jct=(\w*); /);
            return regex && regex[1];
        },
        get Beijing_date() {    // eg. 2022/10/15
            return new Date(Setting.Beijing_ts).toLocaleDateString("zh-CN");
        },
        get Beijing_ts() {
            let local = new Date();
            let diff = (local.getTimezoneOffset() - Setting.Beijing_timezoneOffset) * 60 * 1000;
            return local.valueOf() + diff;
        },
        get Beijing_timezoneOffset() {
            return -480;
        }
    }
    let autoUnfollow = GM_getValue("autoUnfollow", true);
    let menuId = undefined;

    autoUnfollow = !autoUnfollow;   // 里面会翻状态，所以先翻一次
    autoUnfollowMenu();

    window.addEventListener('focus', e => {
        giftCount = 0;
        setTimeout(() => {
            updateTabTitle();
        }, 1000);
    });

    // 通知css    
    GM_addStyle(".noticejs-heading{user-select:none}.noticejs-content>span{line-height:20px;font-size:14px}.noticejs-content .currency-icon{margin:-6px -4px 0 0;width:14px;height:14px;display:inline-block;vertical-align:middle;background-size:cover;background-position:center center}.noticejs-content .img{margin-left:15px;width:40px;opacity:1;float:right}.noticejs-content .coin-type{margin-left:-5px}.noticejs-link{margin-right:15px}.noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-size:14px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{width:fit-content;margin:0 0 10px;border-radius:5px;overflow:hidden}.noticejs .item .close{cursor:pointer;width:21px;height:21px;text-align:center;margin-top:-3px;margin-right:-3px;float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83b3}.noticejs .success .noticejs-heading{background-color:#3da95cb3;color:#fff;padding:5px}.noticejs .success .noticejs-body{color:#fff;padding:5px 10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible;word-break:break-all;min-width:135px}.noticejs .info{background-color:#3ea2ffb3}.noticejs .info .noticejs-heading{background-color:#067ceab3;color:#fff;padding:5px}.noticejs .info .noticejs-body{color:#fff;padding:5px 10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible;word-break:break-all}.noticejs .warning{background-color:#ff7f48b3}.noticejs .warning .noticejs-heading{background-color:#f44e06b3;color:#fff;padding:5px}.noticejs .warning .noticejs-body{color:#fff;padding:5px 10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible;word-break:break-all}.noticejs .error{background-color:#e74c3cb3}.noticejs .error .noticejs-heading{background-color:#ba2c1db3;color:#fff;padding:5px}.noticejs .error .noticejs-body{color:#fff;padding:5px 10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible;word-break:break-all}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50b3}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83b3;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95cb3}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ffb3;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067ceab3}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48b3;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06b3}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3cb3;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1db3}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}");
    // 新版红包CSS
    GM_addStyle(".join .join-main .join-envelope-sponsor .sponsor-award .award-item{width:70px!important;height:70px!important}.join .join-main .join-envelope-sponsor .sponsor-award .award-item .award-item-bg{justify-content:center!important}.join .join-main .join-envelope-sponsor .sponsor-award .award-item .award-item-num{margin-top:0!important;position:relative;top:-3px}.join .join-main .join-envelope-sponsor .sponsor-award .award-item .award-item-img{width:50px!important;height:50px!important}");
    // 领取按钮
    GM_addStyle(".draw-red-packet-btn{margin:2px 10px 0;color:#f9dc8b;padding:2px 0;background:#ed5959dd;border-radius:4px;text-align:center;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:flex;justify-content:center;align-items:center}.draw-red-packet-btn.disabled{color:#fff;background:#aaaa}");

    let notice;
    let timeout;
    let giftCount = 0;
    let unpacking = false;
    // let giftList = new Map();
    let awards = {};

    let formData = new FormData();
    formData.set("visit_id", "");
    formData.set("jump_from", "");
    formData.set("session_id", "");
    formData.set("room_id", ROOM_ID);
    formData.set("ruid", ROOM_USER_ID);
    formData.set("spm_id", "444.8.red_envelope.extract");
    formData.set("jump_from", "26000");
    formData.set("build", "6790300");
    formData.set("c_locale", "en_US");
    formData.set("channel", "360");
    formData.set("device", "android");
    formData.set("mobi_app", "android");
    formData.set("platform", "android");
    formData.set("version", "6.79.0");
    formData.set("statistics", "%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%226.79.0%22%2C%22abtest%22%3A%22%22%7D");

    bliveproxy.addCommandHandler("POPULARITY_RED_POCKET_START", async (message) => {
        let failed = await drawRedPacket(message);
        // 参数错误时重试
        if (failed) {
            setTimeout(async () => {
                message.data.current_time = message.data.current_time - 1000;
                failed = await drawRedPacket(message);
                if (failed) {
                    addDrawBtn(message);
                }
            }, 1000);
        }
    });
    bliveproxy.addCommandHandler("POPULARITY_RED_POCKET_WINNER_LIST", redPacketWinner);

    window.addEventListener('beforeunload', (event) => {
        if (timeout) {
            unfollow();
            clearTimeout(timeout);
        }
    });

    getLottery();

    function autoUnfollowMenu() {
        autoUnfollow = !autoUnfollow;
        GM_setValue("autoUnfollow", autoUnfollow);
        GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand(`自动取关功能 [${autoUnfollow ? '√' : '×'}]`, autoUnfollowMenu);
    }

    function getLottery() {
        fetch(`https://api.live.bilibili.com/xlive/lottery-interface/v1/lottery/getLotteryInfoWeb?roomid=${ROOM_ID}`)
            .then(res => res.json())
            .then(async json => {
                if (json.data.popularity_red_pocket && json.data.popularity_red_pocket[0].user_status == 2 && json.data.popularity_red_pocket[0].end_time > json.data.popularity_red_pocket[0].current_time) {
                    let message = {
                        "data": json.data.popularity_red_pocket[0]
                    };
                    let failed = await drawRedPacket(message);
                    if (failed) {
                        setTimeout(async () => {
                            message.data.current_time = message.data.current_time - 1000;
                            failed = await drawRedPacket(message);
                            if (failed) {
                                addDrawBtn(message);
                            }
                        }, 1000);
                    }
                }
            });
    }

    function addDrawBtn(message, retry = 0) {
        if (message.data.end_time <= message.data.current_time) {
            return;     // 防止给已开奖的红包添加按钮
        }
        let btn = document.querySelector(".draw-red-packet-btn");
        btn && btn.remove();
        let redEnvelope = document.querySelector(".popularity-red-envelope-entry.gift-left-part");
        if (!redEnvelope) {
            if (retry <= 5) {
                setTimeout(() => {
                    addDrawBtn(message, retry + 1);
                }, 1000);
            }
            return;
        }
        let dom = document.createElement("div");
        if (GM_getValue(`limitWarning-${Setting.UID}`) == Setting.Beijing_date) {
            dom.className = "draw-red-packet-btn disabled";
            dom.innerHTML = "<span>上限</span>";
        } else {
            dom.className = "draw-red-packet-btn";
            dom.innerHTML = "<span>抽红包</span>";
        }
        dom.onclick = function (e) {
            e.stopPropagation();
            drawRedPacket(message, true);
        }
        redEnvelope.append(dom);
    }

    function removeDrawBtn() {
        let drawBtn = document.querySelector(".draw-red-packet-btn");
        drawBtn && drawBtn.remove();
    }

    function drawRedPacket(message, force) {
        if (!force) {
            // 每日上限
            if (GM_getValue(`limitWarning-${Setting.UID}`) == Setting.Beijing_date) {
                addDrawBtn(message);
                return;
            }
            // 电池门槛
            let gold = Math.round(message.data.total_price / 100);
            if (doorSill > gold || goldBlockEnumList.includes(gold)) {
                addDrawBtn(message);
                return;
            }
        }

        clearTimeout(timeout);
        timeout = null;
        // 防止收不到开奖信息页面状态卡住
        let countdown = (message.data.end_time - message.data.current_time) * 1000;
        setTimeout(() => {
            if (unpacking) {
                let obj = {
                    "data": {
                        "winner_info": []
                    }
                };
                redPacketWinner(obj);
            }
        }, countdown + 5000);

        // if (giftList.size == 0) {
        //     initGiftList();
        // }

        formData.set("csrf", Setting.TOKEN);
        formData.set("csrf_token", formData.get("csrf"));
        formData.set("lot_id", message.data.lot_id);

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: `https://api.live.bilibili.com/xlive/lottery-interface/v1/popularityRedPocket/RedPocketDraw`,
                method: "post",
                headers: {
                    "User-Agent": "Mozilla/5.0 BiliDroid/6.79.0 (bbcallen@gmail.com) os/android model/Redmi K30 Pro mobi_app/android build/6790300 channel/360 innerVer/6790310 osVer/11 network/2"
                },
                data: formData,
                onload: function (res) {
                    let json = undefined;
                    try {
                        json = JSON.parse(res.response);
                    } catch (error) {
                        resolve(false);
                        console.warn(res);
                        throw new Error("返参错误");
                    }
                    if (json.code !== 0 || json.data.join_status !== 1) {
                        console.log("红包请求返回：", JSON.stringify(json));
                        switch (json.code) {
                            case 1009109:       // 每日上限
                                removeDrawBtn();
                                showMessage(json.message, "warning", null, false);
                                GM_setValue(`limitWarning-${Setting.UID}`, Setting.Beijing_date);
                                resolve(false);
                                addDrawBtn(message);
                                if (!FOLLOWED) {
                                    unfollow();
                                }
                                return;
                            case 1009114:       // 已抽奖
                                removeDrawBtn();
                                notice = showMessage(`
                                坐等 ${message.data.sender_name} 的红包开奖
                                <br>
                                红包ID：${message.data.lot_id}
                                <br>
                                <span>
                                    总价值：
                                    <span class="coin-type dp-i-block v-middle none-select">
                                        <i class="currency-icon" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABDBJREFUaAXVWt1rFFcU/92Z3Z3sJiHRxBhNRe0ihSLSF20fBBWDL/og2Pf+A774IKGU0gXf2jcf/RMsQkXwg4IgVKxUUBB9SJssRtGQaLr52J1sZmduz93qujt752Nn713WE8jOPeeee36/O+d+zQzwiQtThZ8/K2QwZBxAzctGtmlhDVP4h7GCF1k3okIqwh7LzDmBL+Iv1NxDsRyqVKvIrtH/b2PVD6lkhNjimxaMw+A8HvgPrXJ+jhcLox+KSX/VEPC84UQA0hhK5NfkpIZAU4O9vow1Bji/auLN822B4KpsBOCB5kDDFrbz14VNqd3LcEx9v8IYC204dBbi85e+ANzLFOAo5XhOGkinkrES9ctNDOICmywsyUIFEuALl/Jw3CfUs13nqSxwRzrGijRaDrGJwobfLziFHPdnZeANC8hM+GO3l70twFmlsL6s4nw/1tlFcvjJ7xRMQKSNKjEHgaGD8Vuz54HyLNVvSX8pnpBZiMfosviYOqqZ/RzI7vO7SPGEEPD797icy8cK2L8EWBpgA5Ek+peAgG6Y/UHAfvMrSn8ew9bynUhAnVbQfgectafYXPkD3KvCeXe3U3yR9bUS4LV1VJZvNkAY1njjWtWFVgLlpRvw3I+LkpGZVIW70Y42Altrj+Fs/N0IJC4Ma2dLWUVBCwGvtorK0u02fIa1q03XrUIDAY7K4nUatLSv8ckncQeqq4/gVIo+6LQmMRMs0+eD2HNWYC//3gZeKAxLbGXU33CFLXKUF3+j1HHkBDTMQPWOkUZLoKz++wA1+2Wgp2GJKdSDV5mjFfk2PLs9zQKdQwxh54EQt1YTdzdgvw1fZZ3SQ5QeToO7lbozM3MYPXxL5FZrYx2WFBGw6cjsNkIbBIqLv6aZSIyPZmHikGPQjrNLUULAyOzA8GffQcz/qYHdMGi2WV+4gtrmYiC8XH6GbN0PQSUEBMpUbp/4aYgnzrYBYk2cQXqb9IQY4BGs7r4LZG1zh/ZAtsxS307k9l+Q2pIotRAI6n3xDGcw/wMg8l+RaCJQksKzJs8hNXpEakuq1EOABrNfzIEpZPee96u7LveEAAND7sCPlDrR7z46ZaSHgG8GssaOIzX8VafYYtXXTsCkNSE7cToWmCSV9BBw1+pYROoM7jqrZMUNIqeFQHroS4JOTwfHT8K0poJiK9ErW4mb0WTHp5EdO0GnmOgHU81+Sa613IE6EBXgefRbWH0EknRnsw9tR+jQ0KyRXvcvAcm5WsYghABbljn0RGe/AOw5fygpnrBBfJ9aoDlQgdTK9MbleXRD4gAktiHvT20tDgwCT5uEEZihZyGnlLyd5PRtgejVxMIWMIJfZO6BKcTyhVmk8DWRuEfzYftTKllrqnWMlSn+NZjpb9hY4f/V0ReD+crSYv1jjlepHVKjLiWvcezBYtQXLf8BGOoetC6LwK8AAAAASUVORK5CYII=&quot;);"></i>
                                    </span>
                                    <span class="text">${(message.data.total_price / 100).toFixed(0)}</span>
                                </span>
                            `, "info", "啊哈哈哈哈哈哈，红包来咯", countdown);
                                unpacking = true;
                                updateTabTitle();
                                resolve(false);
                                return;
                            case 1009108:       // 抽奖已结束
                                removeDrawBtn();
                                break;
                            case 1009106:       // 参数错误 ？？？
                                resolve(true);
                                return;
                            case -352:          // 当前操作异常，请升级至最新版本后重试
                                json.message = "当前操作异常，使用手机端通过验证码后再试"
                                addDrawBtn(message);
                            default:
                        }
                        resolve(false); // false时不进行重试，也不会添加抢红包按钮
                        showMessage(json.message, "error", "抢红包失败", false);
                    } else {
                        removeDrawBtn();
                        notice = showMessage(`
                        坐等 ${message.data.sender_name} 的红包开奖
                        <br>
                        红包ID：${message.data.lot_id}
                        <br>
                        <span>
                            总价值：
                            <span class="coin-type dp-i-block v-middle none-select">
                                <i class="currency-icon" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABDBJREFUaAXVWt1rFFcU/92Z3Z3sJiHRxBhNRe0ihSLSF20fBBWDL/og2Pf+A774IKGU0gXf2jcf/RMsQkXwg4IgVKxUUBB9SJssRtGQaLr52J1sZmduz93qujt752Nn713WE8jOPeeee36/O+d+zQzwiQtThZ8/K2QwZBxAzctGtmlhDVP4h7GCF1k3okIqwh7LzDmBL+Iv1NxDsRyqVKvIrtH/b2PVD6lkhNjimxaMw+A8HvgPrXJ+jhcLox+KSX/VEPC84UQA0hhK5NfkpIZAU4O9vow1Bji/auLN822B4KpsBOCB5kDDFrbz14VNqd3LcEx9v8IYC204dBbi85e+ANzLFOAo5XhOGkinkrES9ctNDOICmywsyUIFEuALl/Jw3CfUs13nqSxwRzrGijRaDrGJwobfLziFHPdnZeANC8hM+GO3l70twFmlsL6s4nw/1tlFcvjJ7xRMQKSNKjEHgaGD8Vuz54HyLNVvSX8pnpBZiMfosviYOqqZ/RzI7vO7SPGEEPD797icy8cK2L8EWBpgA5Ek+peAgG6Y/UHAfvMrSn8ew9bynUhAnVbQfgectafYXPkD3KvCeXe3U3yR9bUS4LV1VJZvNkAY1njjWtWFVgLlpRvw3I+LkpGZVIW70Y42Altrj+Fs/N0IJC4Ma2dLWUVBCwGvtorK0u02fIa1q03XrUIDAY7K4nUatLSv8ckncQeqq4/gVIo+6LQmMRMs0+eD2HNWYC//3gZeKAxLbGXU33CFLXKUF3+j1HHkBDTMQPWOkUZLoKz++wA1+2Wgp2GJKdSDV5mjFfk2PLs9zQKdQwxh54EQt1YTdzdgvw1fZZ3SQ5QeToO7lbozM3MYPXxL5FZrYx2WFBGw6cjsNkIbBIqLv6aZSIyPZmHikGPQjrNLUULAyOzA8GffQcz/qYHdMGi2WV+4gtrmYiC8XH6GbN0PQSUEBMpUbp/4aYgnzrYBYk2cQXqb9IQY4BGs7r4LZG1zh/ZAtsxS307k9l+Q2pIotRAI6n3xDGcw/wMg8l+RaCJQksKzJs8hNXpEakuq1EOABrNfzIEpZPee96u7LveEAAND7sCPlDrR7z46ZaSHgG8GssaOIzX8VafYYtXXTsCkNSE7cToWmCSV9BBw1+pYROoM7jqrZMUNIqeFQHroS4JOTwfHT8K0poJiK9ErW4mb0WTHp5EdO0GnmOgHU81+Sa613IE6EBXgefRbWH0EknRnsw9tR+jQ0KyRXvcvAcm5WsYghABbljn0RGe/AOw5fygpnrBBfJ9aoDlQgdTK9MbleXRD4gAktiHvT20tDgwCT5uEEZihZyGnlLyd5PRtgejVxMIWMIJfZO6BKcTyhVmk8DWRuEfzYftTKllrqnWMlSn+NZjpb9hY4f/V0ReD+crSYv1jjlepHVKjLiWvcezBYtQXLf8BGOoetC6LwK8AAAAASUVORK5CYII=&quot;);"></i>
                            </span>
                            <span class="text">${(message.data.total_price / 100).toFixed(0)}</span>
                        </span>
                    `, "info", "啊哈哈哈哈哈哈，红包来咯", countdown);
                        unpacking = true;
                        updateTabTitle();
                        resolve(false);
                    }
                }
            });
        });

    }

    async function unfollow() {
        return new Promise((r, j) => {
            if (!autoUnfollow) {
                console.log("自动抢红包-自动取关已关闭，跳过取关");
                return r(false);
            }
            fetch(`https://api.bilibili.com/x/relation/tag/user?fid=${ROOM_USER_ID}&jsonp=jsonp&_=${Date.now()}`, {
                "credentials": "include"
            })
                .then(res => res.text())
                .then(result => {
                    let json = JSON.parse(result);
                    if (Object.keys(json.data).length == 0) {
                        let data = new FormData();
                        data.set("act", "2");
                        data.set("csrf", Setting.TOKEN);
                        data.set("re_src", "11");
                        data.set("jsonp", "jsonp");
                        data.set("fid", ROOM_USER_ID);
                        data.set("spmid", "333.999.0.0");
                        data.set("extend_content", `{ "entity": "user", "entity_id": ${ROOM_USER_ID} }`);
                        fetch("https://api.bilibili.com/x/relation/modify", {
                            credentials: "include",
                            method: 'POST',
                            body: data
                        })
                            .then(res => res.json())
                            .then(json => {
                                if (json.code == json.message) {
                                    let unfollow = awards["unfollow"] || {};
                                    unfollow.notice && unfollow.notice.remove();
                                    unfollow.notice = showMessage("已取消关注", "warning", "提示", false);
                                }
                                return r(json.code != json.message);
                            });
                    }
                });
        });
    }

    function redPacketWinner(message) {
        // let tempMsg = {
        //     "cmd": "POPULARITY_RED_POCKET_WINNER_LIST",
        //     "data": {
        //         "lot_id": 7561546,
        //         "total_num": 10,
        //         "winner_info": [
        //             [
        //                 383148522,
        //                 "故意de",
        //                 5407185,
        //                 31212
        //             ]
        //         ],
        //         "awards": {
        //             "31212": {
        //                 "award_type": 1,
        //                 "award_name": "打call",
        //                 "award_pic": "https://s1.hdslb.com/bfs/live/461be640f60788c1d159ec8d6c5d5cf1ef3d1830.png",
        //                 "award_big_pic": "https://i0.hdslb.com/bfs/live/9e6521c57f24c7149c054d265818d4b82059f2ef.png",
        //                 "award_price": 500
        //             }
        //         }
        //     }
        // }
        removeDrawBtn();
        let follow = unpacking;
        unpacking = false;
        notice && (notice.style.display = "none");
        for (let winner of message.data.winner_info) {
            if (Setting.UID == winner[0]) {
                // let giftDetail = giftList.get(winner[3]);
                let award = awards[winner[3]] || {};
                award.count = (award.count >> 0) + 1;
                award.notice && award.notice.remove();
                award.notice = showMessage(`
                    <div class="gift-frame img gift-${winner[3]}-40" height="40" style="width:40px;height:40px;display:inline-block;"></div>
                    <span>
                        获得：${message.data.awards[winner[3]].award_name}${award.count > 1 ? " ×" + award.count : ""}
                    </span>
                    <br>
                    <span>
                        价值：
                        <span class="coin-type dp-i-block v-middle none-select">
                            <i class="currency-icon" style="background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABDBJREFUaAXVWt1rFFcU/92Z3Z3sJiHRxBhNRe0ihSLSF20fBBWDL/og2Pf+A774IKGU0gXf2jcf/RMsQkXwg4IgVKxUUBB9SJssRtGQaLr52J1sZmduz93qujt752Nn713WE8jOPeeee36/O+d+zQzwiQtThZ8/K2QwZBxAzctGtmlhDVP4h7GCF1k3okIqwh7LzDmBL+Iv1NxDsRyqVKvIrtH/b2PVD6lkhNjimxaMw+A8HvgPrXJ+jhcLox+KSX/VEPC84UQA0hhK5NfkpIZAU4O9vow1Bji/auLN822B4KpsBOCB5kDDFrbz14VNqd3LcEx9v8IYC204dBbi85e+ANzLFOAo5XhOGkinkrES9ctNDOICmywsyUIFEuALl/Jw3CfUs13nqSxwRzrGijRaDrGJwobfLziFHPdnZeANC8hM+GO3l70twFmlsL6s4nw/1tlFcvjJ7xRMQKSNKjEHgaGD8Vuz54HyLNVvSX8pnpBZiMfosviYOqqZ/RzI7vO7SPGEEPD797icy8cK2L8EWBpgA5Ek+peAgG6Y/UHAfvMrSn8ew9bynUhAnVbQfgectafYXPkD3KvCeXe3U3yR9bUS4LV1VJZvNkAY1njjWtWFVgLlpRvw3I+LkpGZVIW70Y42Altrj+Fs/N0IJC4Ma2dLWUVBCwGvtorK0u02fIa1q03XrUIDAY7K4nUatLSv8ckncQeqq4/gVIo+6LQmMRMs0+eD2HNWYC//3gZeKAxLbGXU33CFLXKUF3+j1HHkBDTMQPWOkUZLoKz++wA1+2Wgp2GJKdSDV5mjFfk2PLs9zQKdQwxh54EQt1YTdzdgvw1fZZ3SQ5QeToO7lbozM3MYPXxL5FZrYx2WFBGw6cjsNkIbBIqLv6aZSIyPZmHikGPQjrNLUULAyOzA8GffQcz/qYHdMGi2WV+4gtrmYiC8XH6GbN0PQSUEBMpUbp/4aYgnzrYBYk2cQXqb9IQY4BGs7r4LZG1zh/ZAtsxS307k9l+Q2pIotRAI6n3xDGcw/wMg8l+RaCJQksKzJs8hNXpEakuq1EOABrNfzIEpZPee96u7LveEAAND7sCPlDrR7z46ZaSHgG8GssaOIzX8VafYYtXXTsCkNSE7cToWmCSV9BBw1+pYROoM7jqrZMUNIqeFQHroS4JOTwfHT8K0poJiK9ErW4mb0WTHp5EdO0GnmOgHU81+Sa613IE6EBXgefRbWH0EknRnsw9tR+jQ0KyRXvcvAcm5WsYghABbljn0RGe/AOw5fygpnrBBfJ9aoDlQgdTK9MbleXRD4gAktiHvT20tDgwCT5uEEZihZyGnlLyd5PRtgejVxMIWMIJfZO6BKcTyhVmk8DWRuEfzYftTKllrqnWMlSn+NZjpb9hY4f/V0ReD+crSYv1jjlepHVKjLiWvcezBYtQXLf8BGOoetC6LwK8AAAAASUVORK5CYII=&quot;);"></i>
                        </span>
                        <span class="text">${Math.round(message.data.awards[winner[3]].award_price / 100) * award.count}</span>
                    </span>
                `, "success", "中奖啦！", false, (p) => {
                    // 关闭提示框时清空礼物计数
                    // alert(`清空 ${message.data.awards[winner[3]]} 的计数`);
                    // console.log(JSON.stringify(award));
                    // award.count = 0;
                });
                if (award.count == 1) {
                    awards[winner[3]] = award;
                }
                giftCount++;
                break;
            }
        }
        updateTabTitle();
        if ((!FOLLOWED) && follow) {
            timeout = setTimeout(async () => {
                let unfollowed = await unfollow();
                if (unfollowed) {
                    unfollow();
                }
            }, 15000);
        }
    }

    function showMessage(msg, type = "info", title, time = 3000, closeCallback) {
        const TITLE = {
            "info": "提示",
            "error": "错误",
            "success": "成功",
            "warning": "警告",
        }
        // type: success[green] error[red] warning[orange] info[blue]
        // pos: topLeft, topCenter, middleLeft, middleRight, middleCenter, bottomLeft, bottomRight, bottomCenter
        // timeout: timeout * 100ms  代码内部似乎还有固定0.5s的前置/后置延迟
        return new NoticeJs({
            title: title || TITLE[type],
            text: msg,
            timeout: time ? Math.round(time / 100) : time,
            type: type,
            position: "bottomLeft",
            callbacks: {
                // beforeShow: [],
                // onShow: [],
                // afterShow: [],
                onClose: [closeCallback],
                // afterClose: [],
                // onClick: [],
                // onHover: [],
                // onTemplate: []
            }
        }).show();
    }

    function updateTabTitle() {
        let title = document.title.replace(/(🧧 🎁\*\d* )|(🧧 )|(🎁\*\d* )/, "");
        let header = "";
        if (unpacking) {
            header += RED_PACKET_ICON;
        }
        if (giftCount > 0) {
            if (header) {
                header += " ";
            }
            header += GIFT_ICON + "*" + giftCount;
        }
        if (header) {
            header += " ";
        }
        document.title = header + title;
    }

    async function getFollowStatus(uid) {
        return new Promise((r, j) => {
            /* attribute: 0-未关注 128-拉黑 2-关注 1-悄悄关注 6-互相关注  */
            fetch(`https://api.bilibili.com/x/relation?fid=${uid}`, {
                "credentials": "include"
            })
                .then(res => res.json())
                .then(json => {
                    r(json.data.attribute != 0 && json.data.attribute != 128);
                });
        });
    }

    function initGiftList() {
        fetch(`https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=${ROOM_ID}`)
            .then(res => res.json())
            .then(json => {
                if (json.code == json.message) {
                    for (const item of json.data.list) {
                        giftList.set(item.id, item);
                    }
                }
            });
    }

})();