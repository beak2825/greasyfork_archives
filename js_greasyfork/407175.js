// ==UserScript==
// @name         Douyu斗鱼 主播开播签到
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  手动打开我的关注页面并放置在后台(https://www.douyu.com/directory/myFollow)  有主播开播时自动房间签到
// @author       HY
// @match        https://www.douyu.com/directory/myFollow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407175/Douyu%E6%96%97%E9%B1%BC%20%E4%B8%BB%E6%92%AD%E5%BC%80%E6%92%AD%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407175/Douyu%E6%96%97%E9%B1%BC%20%E4%B8%BB%E6%92%AD%E5%BC%80%E6%92%AD%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
const SCKEY = "SCU105447T86cbc85faae90dea6776ca2d3a189b335f0b3ea17d7ae"; //serverchan key
const isUsed = confirm('确定执行自动房间签到？'); // true || false
const signAll = false // 关注列表全部房间签到 true || false
const sign_id = [5574973]; //指导房间签到
let dyToken = getToken();
let followCheck_timer; // 时钟句柄

/*
GM_getValue('counter', 0);
GM_setValue('counter', i + 1);
*/

followCheck_timer = setInterval(() => {
    followCheck();
}, 5000);

function followCheck(){
    if(isUsed) {
        console.log ('Interval Check Running.');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.douyu.com/wgapi/livenc/liveweb/follow/list?sort=0&cid1=0`,
            onload: function(response) {
                if (response.status == 200) {
                    let res = JSON.parse(response.responseText)
                    if (res.error == 0) {
                        followRoom(res)
                    } else {
                        clearInterval(followCheck_timer);
                        window.location.reload();
                    }
                }
            }
        });
    }
}

function followRoom(res){
    for(let each in res.data.list){
        let status = res.data.list[each]["show_status"]
        let roomid = res.data.list[each]["room_id"]
        if (status == 1) {
            for(let id in sign_id) {
                if (signAll) {
                    signRoom(roomid, res.data.list[each])
                } else {
                    if(roomid == sign_id[id]) {
                        signRoom(roomid, res.data.list[each])
                    }
                }
            }
        }
    }
    console.log ('Follow rooms check is successful');
}

function signRoom(rid, roomData) {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://apiv2.douyucdn.cn/japi/roomuserlevel/apinc/checkIn?client_sys=android",
        data: 'rid=' + rid,
        responseType: "json",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': dyToken,
            'aid': 'android1'
        },
        onload: function(response) {
            if (response.status == 200) {
                let res = JSON.parse(response.responseText)
                let status = res.data.rank
                if (status != -1) {
                    notifyChan(res.data, roomData)
                } else {
                    //console.log(roomData["nickname"], res)
                }
            }
        }
    });
}

function notifyChan(signData, roomData) {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://sc.ftqq.com/" + SCKEY + ".send",
        data: notifyContent(signData, roomData),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            //let res = JSON.parse(response.responseText)
            //console.log(response.responseText)
            console.log("ServerChan Notifiy send ->", roomData["nickname"])
        }
    });
}

function notifyContent(signData, roomData) {
    //console.log(signData, roomData)
    let title = "【" + roomData["nickname"] + "】房间签到"
    let content = "> tip:房间签到仅开播时签到 \n\n" +
        "#" + roomData["room_name"] + "\n\n" +
        "------\n" +
        "|    房间号    | " + roomData["room_id"]+ " |\n" +
        "| -------- | :----------------: |\n" +
        "|    手速榜    |      " + signData.rank + "名       |\n" +
        "|   房间等级   |        " + signData.current + "级         |\n" +
        "------\n" +
        "![logo]("+roomData["room_src"]+")"
    return "text=" + title + "&desp=" + content
}

function getCookieValue(name){
    let arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function getToken() {
    // let cookie = document.cookie;
    // let ret = getStrMiddle(cookie, "acf_uid=", ";") + "_" + getStrMiddle(cookie, "acf_biz=", ";") + "_" + getStrMiddle(cookie, "acf_stk=", ";") + "_" + getStrMiddle(cookie, "acf_ct=", ";") + "_" + getStrMiddle(cookie, "acf_ltkid=", ";");
    let ret = getCookieValue("acf_uid") + "_" + getCookieValue("acf_biz") + "_" + getCookieValue("acf_stk") + "_" + getCookieValue("acf_ct") + "_" + getCookieValue("acf_ltkid");
    return ret;
}