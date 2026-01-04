// ==UserScript==
// @name    Autoagin Badman
// @name:ZH
// @description 自动回复反对破坏者的相关言论
// @include hcbbs.eu.org
// @license CC SA
// @version 1.0.1.01
// @namespace https://greasyfork.org/users/1185763
// @downloadURL https://update.greasyfork.org/scripts/480180/Autoagin%20Badman.user.js
// @updateURL https://update.greasyfork.org/scripts/480180/Autoagin%20Badman.meta.js
// ==/UserScript==

// getCookie函数
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
         }
     }
    return "";
} 

// 发送内容
if(!getCookie("_finish1")){
    // 发送指令
    fetch("https://hcbbs.eu.org/?post-create-657-1.htm", {
  "headers": {
    "accept": "text/plain, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\";Not A Brand\";v=\"99\", \"Chromium\";v=\"94\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://hcbbs.eu.org/?thread-657.htm",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "doctype=1&return_html=1&quotepid=5901&message=%23%23%23%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6Saiding%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%23%23%23%0D%0A%23++%E8%AF%B7%E6%8F%90%E5%87%BA%E8%AF%81%E6%8D%AE%E4%B8%8E%E4%BA%8B%E5%AE%9E%EF%BC%8C%E5%85%B6%E5%AE%9E%E5%AF%B9+%23%23%23%0D%0A%23++%E6%96%B9%E6%B2%A1%E6%9C%89%E8%BF%99%E4%B9%88%E5%81%9A%E3%80%82++++++++++++++++++%23%23%23%0D%0A%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23%23",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
    // 设置已经发送
    document.cookie = "_finish1=true";
}

// only Administrator
if(!getCookie("_finishA1")){
    // 发送指令
    fetch("https://hcbbs.eu.org/?post-create-419-1.htm", {
  "headers": {
    "accept": "text/plain, */*; q=0.01",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\";Not A Brand\";v=\"99\", \"Chromium\";v=\"94\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://hcbbs.eu.org/?thread-419.htm",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "doctype=1&return_html=1&quotepid=0&message=由Saiding插件自动回复，不作为个人依据：不应该关闭，在这里回复多好啊。",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
    // 设置已经发送
    document.cookie = "_finishA1=true";
}
