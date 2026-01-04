// ==UserScript==
// @name         e等公務園+學習平台 小幫手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       周詳
// @match        https://elearn.hrd.gov.tw/*
// @match        https://*.elearn.hrd.gov.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elearn.hrd.gov.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477750/e%E7%AD%89%E5%85%AC%E5%8B%99%E5%9C%92%2B%E5%AD%B8%E7%BF%92%E5%B9%B3%E5%8F%B0%20%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477750/e%E7%AD%89%E5%85%AC%E5%8B%99%E5%9C%92%2B%E5%AD%B8%E7%BF%92%E5%B9%B3%E5%8F%B0%20%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    var url = new URL(window.location.href)
    if (url.pathname == "/learn/path/pathtree.php") {
       document.body.innerHTML += '<a href="javascript:window.parent.parent.location.href=\'/mooc/index.php?ticket=\' + pTicket + \'&cid=\' + cid" style="position: fixed; background: black; color: white; top:0px; left: 0px; width: 100px; height: 50px">跳過課程</a>'

    } else if (url.pathname == "/mooc/index.php") {
       const queryString = window.location.search;
       const urlParams = new URLSearchParams(queryString);
       const ticket = urlParams.get('ticket');
       const cid = urlParams.get('cid');
       if (ticket != null & cid != null) {
            document.body.innerHTML = "上課中，請勿關閉本分頁";
           window.setInterval( () => {
         fetch("/mooc/controllers/course_record.php?actype=end", {
             "headers": {
                 "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
             },
             "body": "action=setReading&type=end&ticket=" + ticket + "&enCid=" + cid,
             "method": "POST",
         });0
               console.log("打卡");
           }, 5000);
       }

    }
})();