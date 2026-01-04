// ==UserScript==
// @name         金石堂
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  金石堂簽到
// @author       You
// @match        https://www.kingstone.com.tw/
// @icon         https://www.google.com/s2/favicons?domain=kingstone.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429239/%E9%87%91%E7%9F%B3%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/429239/%E9%87%91%E7%9F%B3%E5%A0%82.meta.js
// ==/UserScript==

//徵選簽到
fetch("https://www.kingstone.com.tw/activity/ajax_summeracg_coin/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "request-context": "appId=cid-v1:3d9311a4-9a62-44d8-b6ea-7c1c473c1677",
    "request-id": "|WaGzN.lBx2t",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?1",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.kingstone.com.tw/events/summeracg?actid=summeracg_2021",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((res) => res.json())
.then(data => console.log("已完成博覽會簽到",data));


fetch("https://www.kingstone.com.tw/activity/ajax_memberDay_coin", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Accept": "*/*",
        "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Request-Id": "|k8Uaf.DKuqz",
        "Request-Context": "appId=cid-v1:3d9311a4-9a62-44d8-b6ea-7c1c473c1677"
    },
    "referrer": "https://www.kingstone.com.tw/ksmember/info/day/",
    "body": "day=1",
    "method": "POST",
    "mode": "cors"
})
.then((res) => res.json())
.then(data => console.log("已完成大暑會員日簽到",data));


//每日簽到

fetch("https://www.kingstone.com.tw/ksmember/DailySignIn", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "request-context": "appId=cid-v1:3d9311a4-9a62-44d8-b6ea-7c1c473c1677",
    "request-id": "|7zFge.cVmvC",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.kingstone.com.tw/ksmember/home/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((res) => res.json())
.then(data => console.log("已完成每日簽到",data.SignInRec.statusmsg," ◆簽到第幾天：",data.SignInRec.hassignindays," ◆會員總金幣數：",data.SignInRec.haspoints));
