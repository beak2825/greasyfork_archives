
// ==UserScript==
// @name	淘宝自动帐号登陆
// @description	自动勾选帐号登陆
// @namespace    erwrwewrfsfs
// @include     https://login.taobao.com/member/login.jhtml*
// @author			lee2099
// @version     2016.12.17
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25773/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%B8%90%E5%8F%B7%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/25773/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%B8%90%E5%8F%B7%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==




var thefunid=setInterval(function (){
    if (document.body.innerHTML.indexOf("匿名购买")) {
        if ( document.getElementById("J_LoginBox").getElementsByClassName("javascript:goldlog.record('/member.13.1','','','H46777383')")[0].checked === false ){
            document.getElementById("J_LoginBox").getElementsByClassName("javascript:goldlog.record('/member.13.1','','','H46777383')")[0].click();
        }
        clearInterval(thefunid);
    }
},1000);