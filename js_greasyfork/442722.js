// ==UserScript==
// @name         東森吃麵
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  看影片拿好禮
// @author       user
// @match        https://www.etmall.com.tw/Activity/dl/LuckyDraw/767fd9ce6f0c12a46450b7b7857a448c
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @license myself
// @downloadURL https://update.greasyfork.org/scripts/442722/%E6%9D%B1%E6%A3%AE%E5%90%83%E9%BA%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/442722/%E6%9D%B1%E6%A3%AE%E5%90%83%E9%BA%B5.meta.js
// ==/UserScript==

fetch("https://www.etmall.com.tw/Activity/LuckyDrawEntry", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.etmall.com.tw/Activity/dl/LuckyDraw/767fd9ce6f0c12a46450b7b7857a448c?time=1668304830316",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "activeCode=767fd9ce6f0c12a46450b7b7857a448c",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("◆抽獎訊息：",data.message," ◆抽到獎項：",data.awards);
  });

