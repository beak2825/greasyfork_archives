// ==UserScript==
// @name         LINE購物APP簽到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LINE購物APP簽到gogo
// @author       fase
// @match        https://buy.line.me/account
// @match        https://buy.line.me/account
// @exclude      https://buy.line.me/account
// @exclude      https://buy.line.me/account
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idv.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464649/LINE%E8%B3%BC%E7%89%A9APP%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464649/LINE%E8%B3%BC%E7%89%A9APP%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==
 
fetch(`https://buy.line.me/api/graphql`, {
  method: "POST",
  headers: {
    "Accept":"application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type":"application/json",
    "Origin": "https://buy.line.me",
    "Accept-Language":"zh-TW,zh-Hant;q=0.9",
    "Referer": "https://buy.line.me/account",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Mobile LINE/TW_Shopping_App_iOS"
  },
  body: JSON.stringify({
  "query" : "mutation {\n  completeSignInEvent {\n    success\n    errorCode\n    __typename\n  }\n}\n",
  "variables" : {

  },
  "operationName" : null
})
})
.then(response => response.json())
.then(b => {
  console.log(b);
  document.querySelector("body").innerHTML="執行完成";
})
.catch(error => {
  console.error(error);
});
 