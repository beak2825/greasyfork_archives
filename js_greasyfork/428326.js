// ==UserScript==
// @name         有閑每日簽到抽獎
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  有閑簽到/抽獎
// @author       You
// @match        https://www.jollybuy.com/index.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428326/%E6%9C%89%E9%96%91%E6%AF%8F%E6%97%A5%E7%B0%BD%E5%88%B0%E6%8A%BD%E7%8D%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/428326/%E6%9C%89%E9%96%91%E6%AF%8F%E6%97%A5%E7%B0%BD%E5%88%B0%E6%8A%BD%E7%8D%8E.meta.js
// ==/UserScript==

//每日簽到

var Today=new Date();
var id=Today.getDate()+535


fetch("https://www.jollybuy.com/Member/UserSignInDay/", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.jollybuy.com/Member?isSignBook=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"signBookDayId\":"+id+"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成每日簽到",data);
  });

//3日簽到
fetch("https://www.jollybuy.com/Member/UserSignInReward/", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.jollybuy.com/Member",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"signBookRewardId\":54}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成3日連續簽到領5元",data);
  });

//7日簽到

fetch("https://www.jollybuy.com/Member/UserSignInReward/", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.jollybuy.com/Member",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"signBookRewardId\":55}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成7日連續簽到領10元",data);
  });

//14日簽到
fetch("https://www.jollybuy.com/Member/UserSignInReward/", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.jollybuy.com/Member",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"signBookRewardId\":56}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成14日連續簽到領20元",data);
  });


//抽獎
fetch("https://www.jollybuy.com/coupon/playground", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.jollybuy.com/act/playground/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成有閑抽獎",data);
  });
