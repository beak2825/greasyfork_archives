// ==UserScript==
// @name         小三美日簽到
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  小三美日
// @author       You
// @match        https://www.s3.com.tw/TC/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @license myself
// @downloadURL https://update.greasyfork.org/scripts/455751/%E5%B0%8F%E4%B8%89%E7%BE%8E%E6%97%A5%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455751/%E5%B0%8F%E4%B8%89%E7%BE%8E%E6%97%A5%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetch("https://www.s3.com.tw/TC/everyday.aspx", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.s3.com.tw/TC/everyday.aspx?Id=120",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "Action=register&GrantDate=&Id=120",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成4月每日簽到",data);
  });

sleep(500)

fetch("https://www.s3.com.tw/TC/everyday.aspx", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
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
  "referrer": "https://www.s3.com.tw/TC/everyday.aspx?Id=102&Out_ad2=34427",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "Action=register&Id=117",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成3月加碼簽到",data);
  });

