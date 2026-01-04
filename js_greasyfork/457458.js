// ==UserScript==
// @name         walkerland簽到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  walkerland
// @author       You
// @match        https://www.walkerland.com.tw/coupon2#
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @license myself
// @downloadURL https://update.greasyfork.org/scripts/457458/walkerland%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457458/walkerland%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

fetch("https://www.walkerland.com.tw/reward/rewardsign", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.walkerland.com.tw/coupon2",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "type=sign_reward&YII_CSRF_TOKEN=Q3ExUHU4TE1fUmlWcHJvRHpvX3JTM0M4bU10ZEFpaDL4gBFuT1zYz5BQkhKbtp_t2KFwGgcssnDZd73r1xJFpA%3D%3D",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成簽到",data);
  });