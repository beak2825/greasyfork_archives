// ==UserScript==
// @name         Login Fanatics TMS
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.2.3
// @description  add's login info to the login screen
// @match        https://fanatics.mercurygate.net/MercuryGate/login/mgLogin.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16121/Login%20Fanatics%20TMS.user.js
// @updateURL https://update.greasyfork.org/scripts/16121/Login%20Fanatics%20TMS.meta.js
// ==/UserScript==

a = document.createElement("div");
a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;";
// onclick='(function(){UserId.value="OST"; Password.value="123456";document.querySelector("[name=submitbutton]").click();})()'
a.innerHTML = (function(){/*
<center>OST<br>123456<br/>
<button id='easybutton' style='color:#aaa;background-color:#fff;border:0px;'>easy</button>
</center>*/}).toString().slice(14,-3);
document.body.appendChild(a);
easybutton.onclick=function(){
    UserId.value="OST";
    Password.value="123456";
    document.querySelector("[name=submitbutton]").click();
};
a.style.left = window.screen.width - a.offsetWidth - 20 + "px";
