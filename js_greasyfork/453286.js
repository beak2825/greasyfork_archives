// ==UserScript==
// @name         B站直播间自动切换粉丝牌
// @namespace    http://shenhaisu.cc/
// @version      1.1
// @description  在进入B站直播间的时候自动切换到正确的粉丝勋章(减少尴尬之类的)
// @author       ShenHaiSu
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453286/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%B2%89%E4%B8%9D%E7%89%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/453286/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%B2%89%E4%B8%9D%E7%89%8C.meta.js
// ==/UserScript==

(async function () {
    let pluginConfig = {
        // 进入没有粉丝牌的直播间是否取消佩戴粉丝勋章
        // false 不拥有本直播间的粉丝牌,但是也不会摘下已经装备的粉丝牌
        // true  会摘下当前粉丝牌
        autoTakeOff: true,
        // 粉丝牌检测延迟 默认3000ms(毫秒) = 3s(秒)
        // 在进入直播间之后等待指定的延迟,再开始检测是否需要自动更换粉丝牌
        startDelay: 3000,
        // DEBUG模式,出现错误会使用弹窗强行提示,非使用者不要打开
        debug: false,
    };
    console.log("B站直播间进入自动切换粉丝勋章开始运行");
    setTimeout(function () {
        mainFunc(pluginConfig);
    }, pluginConfig.startDelay);
})();

function mainFunc(pluginConfig) {
    let APIList = {
        nowWeared: "https://api.live.bilibili.com/live_user/v1/UserInfo/get_weared_medal", // POST source uid target_id csrf_token csrf visit_id:""
        getMedal: "https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?", // GET page=1 page_size=20 target_id
        takeOff: "https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/take_off", // POST csrf_token csrf visit_id:""
        wearMedal: "https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear", // POST medal_id csrf_token csrf visit_id:""
    };
    let userID = getUserUID();
    let targetID = getSteamerUID();
    let userCSRF = getSCRF();
    let streamerName = getStreamerName();
    let targetMedal = null;
    let nowWearedFlag = false;
    function getUserUID() {
        let userid = getCookie()['DedeUserID'] || undefined;
        return userid;
    }
    function getSteamerUID() {
        return document.getElementsByTagName("iframe")[0].src.match(/ruid=\d+/)[0].split("=")[1];
    }
    function getCookie() {
        let documentCookie = document.cookie.split("; ");
        let output = {};
        documentCookie.forEach(item => {
            let tempObj = item.split("=");
            output[tempObj[0]] = tempObj[1];
        });
        return output;
    }
    function getStreamerName() {
        return document.getElementsByClassName("room-owner-username")[0].innerText;
    }
    function getSpecialMedalOwner(payload) {
        return payload['anchor_info']['nick_name'] || undefined;
    }
    function getMedalID(payload) {
        return payload['medal']['medal_id'] || undefined;
    }
    function getSCRF() {
        let cookieObj = getCookie();
        return cookieObj['bili_jct'] || undefined;
    }
    function sendTakeOff() {
        fetch(APIList.takeOff, {
            method: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `csrf_token=${userCSRF}&csrf=${userCSRF}&visit_id=`,
            credentials: "include"
        }).then(async response => {
            let respData = response.json();
            updateDisplay();
            if (respData.code !== 0) return Promise.reject();
        }).catch(() => {
            if (pluginConfig.debug) alert("脱下粉丝牌失败.");
        });
    }
    function sendWearMedal() {
        fetch(APIList.wearMedal, {
            method: "post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `medal_id=${getMedalID(targetMedal)}&csrf_token=${userCSRF}&csrf=${userCSRF}&visit_id=`,
            credentials: "include"
        }).then(async response => {
            let respData = await response.json();
            updateDisplay();
            if (respData.code !== 0) return Promise.reject();
        }).catch(() => {
            if (pluginConfig.autoTakeOff) alert("切换佩戴粉丝牌失败.");
        });
    }
    function updateDisplay() {
        document.querySelector("div.medal-section").children[0].click();
        setTimeout(() => {
            document.querySelector("div.medal-section").children[0].click();
        }, 500);
    }
    if (!userID || !userCSRF) return;
    if (pluginConfig.debug) {
        console.log("=".repeat(10) + "DEBUG模式显示" + "=".repeat(10));
        console.log(`用户UID ${userID}`);
        console.log(`主播UID ${targetID}`);
        console.log(`用户SCRF ${userCSRF}`);
        console.log(`主播用户名 ${streamerName}`);
        console.log("=".repeat(10) + "DEBUG模式显示" + "=".repeat(10));
    }
    fetch(APIList.nowWeared, {
        method: "post",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `source=1&uid=${userID}&target_id=${targetID}&csrf_token=${userCSRF}&csrf=${userCSRF}&visit_id=`,
        credentials: "include"
    }).then(async response => {
        let respData = await response.json();
        nowWearedFlag = !!respData.length || !!respData.data['medal_name'];
        return await fetch(`${APIList.getMedal}page=1&page_size=20&target_id=${targetID}`, {
            method: "get",
            credentials: "include"
        });
    }).then(async response => {
        let respData = await response.json();
        let special_list = respData['data']['special_list']
        let specialLength = special_list.length;
        if (pluginConfig.debug) {
            console.log(respData);
            console.log(special_list);
            console.log(specialLength);
        }
        if (!nowWearedFlag && specialLength === 0) {
            return;
        } else if (!nowWearedFlag && specialLength === 1) {
            targetMedal = special_list[0];
            sendWearMedal();
        } else if (nowWearedFlag && specialLength === 1) {
            let wearedMedalOwnerName = getSpecialMedalOwner(special_list[0]);
            if (wearedMedalOwnerName === streamerName) {
                return;
            } else if (pluginConfig.autoTakeOff) {
                sendTakeOff();
            } else return;
        } else if (nowWearedFlag && specialLength === 2) {
            targetMedal = special_list[1];
            sendWearMedal();
        }
    })
}