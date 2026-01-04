// ==UserScript==
// @name         樂天查點數
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  f12F框設1330X
// @author       You
// @match        https://www.rakuten.com.tw/lottery/play/?m-id=RADLottery-Play
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435519/%E6%A8%82%E5%A4%A9%E6%9F%A5%E9%BB%9E%E6%95%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/435519/%E6%A8%82%E5%A4%A9%E6%9F%A5%E9%BB%9E%E6%95%B8.meta.js
// ==/UserScript==

fetch("https://www.rakuten.com.tw/api/common_header?ajax=true&wlcount=true", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.rakuten.com.tw/lottery/play/?m-id=RADLottery-Play",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("目前點數■",data.point.total_points);
  });