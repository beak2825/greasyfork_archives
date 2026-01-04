// ==UserScript==
// @name          linuxdo生日图标
// @namespace    https://yby6.com
// @version     1.2
// @description   linuxdo 生日图标
// @author       杨不易呀
// @match        https://linux.do/*
// @match     *://*.linux.do
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @antifeature referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488656/linuxdo%E7%94%9F%E6%97%A5%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/488656/linuxdo%E7%94%9F%E6%97%A5%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
       (function () {

                setTimeout(() => {
let preloadedData = document.querySelector('#data-preloaded').getAttribute('data-preloaded');
preloadedData = JSON.parse(preloadedData);
let preloadedCurrentUserData = JSON.parse(preloadedData.currentUser);
                    console.log("preloadedCurrentUserData",preloadedCurrentUserData)
let username = preloadedCurrentUserData.username;
let today = new Date();
let todayFormated = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
fetch(`https://linux.do/u/${username}.json`, {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "discourse-logged-in": "true",
    "discourse-present": "true",
    "pragma": "no-cache",
    "x-csrf-token": csrfToken,
    "x-requested-with": "XMLHttpRequest"
  },
  "body": `date_of_birth=${todayFormated}`,
  "method": "PUT",
  "mode": "cors",
  "credentials": "include"
});

                      },3000)

})();

})();