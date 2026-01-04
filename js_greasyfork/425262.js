// ==UserScript==
// @name         Momo購物網(投票活動需登入)-2
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  詳細用法請看最下方說明
// @author       You
// @match        https://www.momoshop.com.tw/edm/cmmedm.jsp?lpn=O4yrGJDeQXm&n=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425262/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E6%8A%95%E7%A5%A8%E6%B4%BB%E5%8B%95%E9%9C%80%E7%99%BB%E5%85%A5%29-2.user.js
// @updateURL https://update.greasyfork.org/scripts/425262/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E6%8A%95%E7%A5%A8%E6%B4%BB%E5%8B%95%E9%9C%80%E7%99%BB%E5%85%A5%29-2.meta.js
// ==/UserScript==

//momo需配合帳號登入

//enCustNoM=3201021070540886-q100
//enCustNoM=3201921050544894-r200
//enCustNoM=3202300542293323-352
//enCustNoM=3202100572294325-771
//enCustNoM=3201320428233528-440
//enCustNoM=3201090396112889-317
//enCustNoM=3201420458520068-098
//enCustNoM=3202600532286897-953
//enCustNoM=3202501272130145-059
//enCustNoM=3202410202953066-035

//以下設定encustno
enCustNoM=

fetch("https://event.momoshop.com.tw/customizedpromo/game77.PROMO", {
  "headers": {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://www.momoshop.com.tw/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"doAction\":\"reg\",\"enCustNo\":"+enCustNoM+",\"point\":\"100\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
.then((data) => {
    console.log(enCustNoM+"已完成遊戲",data);
  });

