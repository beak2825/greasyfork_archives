// ==UserScript==
// @name         激战2一键签到
// @namespace    https://greasyfork.org/zh-CN/users/1252914-lygamer
// @version      1.0.2
// @description  激战2一键签到不用一天一天的点啦！
// @author       LYGamer
// @include      https://act.kongzhong.com/gw2/monthlysign/
// @icon         https://act.kongzhong.com/gw2/common/images/icon_gw.ico
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/485629/%E6%BF%80%E6%88%982%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/485629/%E6%BF%80%E6%88%982%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==


function parseCookie(cookies) {
    var result = {};
    cookies.split(';').forEach(function (cookie) {
        var parts = cookie.trim().split('=');
        if (parts[0]) {
            result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
    });
    return result;
}


//获取待领取列表prizeId
function getPrizeIdList(){
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://gw2api.kongzhong.com/gw2-newsign-in-activity/signItemConfig',
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "token": parseCookie(document.cookie).token,
                "cookie": document.cookie,
                "Referer": "https://act.kongzhong.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            onload: function (res) {
                //console.log(JSON.parse(res.responseText).data);
                let prizeIdList = [];
                let data = JSON.parse(res.responseText).data;
                let itemSignConfig = data.itemSignConfig.concat(data.itemSignConfigDragon).concat(data.itemSignConfigFlame).concat(data.itemSignConfigHeaven).concat(data.itemSignConfigPay);
                for(let i = 0; i < itemSignConfig.length; i++) {
                    let item = itemSignConfig[i];
                    if (item.exchangeStatus == 1){
                        prizeIdList.push(item.prizeId);
                    }
                }
                // console.log(prizeIdList);
                resolve(prizeIdList);
            },
            onerror:function(error){
                reject(error);
            }
        });
    });
}
//领取接口
function getReceiveItem(prizeId){
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://gw2api.kongzhong.com/gw2-newsign-in-activity/receiveItem?prizeId=' + prizeId,
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "token": parseCookie(document.cookie).token,
            "cookie": document.cookie,
            "Referer": "https://act.kongzhong.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        onload: function (res) {
             console.log(res);
        },
        onerror:function(res){
            console.log(res);
        }
    });
}
function isLogin(){
    let loginDiv = document.querySelector('#app > div.main > div.header > div > div.login_box > div > a');
    if (loginDiv.text == "【登录】"){
        return false;
    }else{
        return true;
    }
}

//一键签到方法
async function foo(){
    if (!document.cookie){
        alert("请先登陆");
        return;
    }
    let prizeIdList = await getPrizeIdList();
    console.log(prizeIdList);
    for(let i = 0; i < prizeIdList.length; i++) {
        let prizeId = prizeIdList[i];
        console.log(prizeId);
        getReceiveItem(prizeId);
    }
    alert("签到完成");
    location.reload();
}
//添加一键签到按钮
function addBtn(){
    let btn = document.createElement('button');
    btn.textContent = '一键签到';
    btn.addEventListener('click',foo);
    let singDiv = document.querySelector('#app > div.main > div.center > div.steps1 > div.calendar_box.jump_con > div.calendar_top > div.calendar_top_right > div.calendar_addSign');
    singDiv.appendChild(btn);
}

(function() {
    'use strict';
    addBtn()
})();