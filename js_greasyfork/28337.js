// ==UserScript==
// @name         auto login
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       P
// @include       https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28337/auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/28337/auto%20login.meta.js
// ==/UserScript==

sessionStorage.setItem("last-url", location);
var storedurl = location.href;
var strHTML = document.body.innerHTML;
var list = document.getElementsByTagName("form")[0];

/*ĐIỀN USERNAM, PASS VÀO ĐÂY*/
var username = "id",
    pass= "pass";
/*==========================*/

if(strHTML.indexOf("Hệ thống tự động thoát do bạn không kích hoạt. Vui lòng đăng nhập lại") > 0)
{
    list.getElementsByTagName("input")[0].value = username;
    list.getElementsByTagName("input")[1].value = pass;
    list.getElementsByTagName("input")[2].click();
}
if(strHTML.indexOf("Log out") < 0 & strHTML.indexOf("Username") > 0 & strHTML.indexOf("Password") > 0)
{
    var lastUrl = sessionStorage.getItem("last-url");
    list.getElementsByTagName("input")[0].value = username;
    list.getElementsByTagName("input")[1].value = pass;
    list.getElementsByTagName("input")[2].click();
    /*if((lastUrl !== "https://www3.chotot.com/controlpanel?m=adqueue&a=show_adqueues") & (lastUrl !== "https://www3.chotot.com/controlpanel"))
    {
        history.back();
        window.location.replace(lastUrl);
    }*/
}

if(strHTML.indexOf("Search for ad") > 0 & strHTML.indexOf("locked") < 0)
    {
        var list = document.getElementsByTagName("li")[0];
        list.getElementsByTagName("a")[0].click();
    }
