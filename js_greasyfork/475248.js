// ==UserScript==
// @name         momo直播次數查詢
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  momo
// @author       You
// @match        https://www.momoshop.com.tw/edm/cmmedm.jsp?*
// @grant        none
// @license      mine
// @downloadURL https://update.greasyfork.org/scripts/475248/momo%E7%9B%B4%E6%92%AD%E6%AC%A1%E6%95%B8%E6%9F%A5%E8%A9%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475248/momo%E7%9B%B4%E6%92%AD%E6%AC%A1%E6%95%B8%E6%9F%A5%E8%A9%A2.meta.js
// ==/UserScript==


fetch("https://event.momoshop.com.tw/promoMechQry.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },
  "body": "{\"m_promo_no\":\"M23091800009\",\"dt_promo_no\":\"D23091800001\",\"qry_type\":\"1003\"}",
  "method": "POST",
  "mode": "cors",  
  "credentials": "include"

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("■ 這週0918-0924達成天數：",data.redeem_gift.length);
  });
