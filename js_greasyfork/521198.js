// ==UserScript==
// @name         happyfe的测试脚本
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @description  happyfe的测试脚本，啦
// @author       happyfe
// @match        https://www.happyfe.com/js/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=happyfe.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521198/happyfe%E7%9A%84%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521198/happyfe%E7%9A%84%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
   GM_xmlhttpRequest({
  method: "GET",
  url: "https://passport.bilibili.com/qrcode/getLoginUrl",
  onload: function(response) {
      if (response.status === 200) {
          var respJson=JSON.parse(response.responseText)
          console.log("Response:", respJson.data.url);
         let timer= setInterval(function(){
            GM_xmlhttpRequest({
              method: "POST",
              url: "https://passport.bilibili.com/qrcode/getLoginInfo",
              headers: {
                  "Content-Type": "application/json"
              },
              data: JSON.stringify({ 'oauthKey': respJson.data.oauthKey, 'gourl': 'https://www.bilibili.com/' }),
              onload: function(response) {
                  if (response.status === 200) {
                      console.log("Response:", response.responseText);
                      //clearInterval(timer)
                  } else {
                      console.error("Error:", response.statusText);
                  }
              },
              onerror: function(response) {
                  console.error("Request failed:", response.statusText);
              }
          });
          },1000)

      } else {
          console.error("Error:", response.statusText);
      }
  },
  onerror: function(response) {
      console.error("Request failed:", response.statusText);
  }
});
})();