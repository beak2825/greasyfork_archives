// ==UserScript==
// @name         CLOSERS JWT複製工具
// @namespace    https://home.gamer.com.tw/profile/index.php?&owner=wutim111
// @version      0.1
// @description  複製CLOSERS所需的JWT
// @author       wutim111
// @match        https://www.closers.com.tw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=closers.com.tw
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480378/CLOSERS%20JWT%E8%A4%87%E8%A3%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480378/CLOSERS%20JWT%E8%A4%87%E8%A3%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

//回傳存放於Cookie內的Token
function getId_Token(){
return getCookieByName('id_token');
}

//右下角按鈕窗
let tool_div=document.createElement("div");
tool_div.style.cssText ="position:fixed; bottom:20px; right:0; ";
tool_div.innerHTML="<a href='#' id='tool_btn' style='width:50px; height:50px; display:block; text-align:center; color:white; background-color:rgba(0,0,0,0.75);'>Get<br>Token</a>";

 $(document).ready(function () {
    console.log(getId_Token());
    $('body').append(tool_div);
    const tool_btn=document.querySelector('#tool_btn');
    tool_btn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(getCookieByName('id_token')== undefined ){
        alert('請先登入');
    }
    else{
        navigator.clipboard.writeText('naddiclaunchertwn:'+getCookieByName('id_token'));
        alert('token已複製,貼到網址即可開啟遊戲');
    }
});
});
//下面是讀取Cookie
function parseCookie() {
var cookieObj = {};
var cookieAry = document.cookie.split(';');
var cookie;

for (var i=0, l=cookieAry.length; i<l; ++i) {
    cookie = jQuery.trim(cookieAry[i]);
    cookie = cookie.split('=');
    cookieObj[cookie[0]] = cookie[1];
}
return cookieObj;
}
function getCookieByName(name) {
    var value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }

    return value;
}
})();
