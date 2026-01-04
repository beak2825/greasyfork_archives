// ==UserScript==
// @name         星海论坛(bbs.dippstar.com)签名档图片一键隐藏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  一个简单的单一功能脚本，可以将星海论坛(bbs.dippstar.com)签名档图片一键隐藏。
// @author       dogcraft
// @match        https://bbs.dippstar.com/thread*
// @include      *://bbs.dippstar.com/forum.php?mod=viewthread*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/399706/%E6%98%9F%E6%B5%B7%E8%AE%BA%E5%9D%9B%28bbsdippstarcom%29%E7%AD%BE%E5%90%8D%E6%A1%A3%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/399706/%E6%98%9F%E6%B5%B7%E8%AE%BA%E5%9D%9B%28bbsdippstarcom%29%E7%AD%BE%E5%90%8D%E6%A1%A3%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

function getDog() {
    var dog1=document.getElementsByClassName("sign");
    var dogList=[]
    for (let index = 0; index < dog1.length; index++) {
        const element = dog1[index];
        var dog2 = element.getElementsByTagName("img");
        // dogList.push(dog2)
        for (let icat = 0; icat < dog2.length; icat++) {
            const element2 = dog2[icat];
            dogList.push(element2)
        }
    }
    return dogList;
}

// cat1[0].style.display="none"

function hideDog(qingdan) {
    for (let incat = 0; incat < qingdan.length; incat++) {
        const du = qingdan[incat];
        du.style.display="none"
    }
}

function showDog(qingdan) {
    for (let incat = 0; incat < qingdan.length; incat++) {
        const du = qingdan[incat];
        du.style.display=""
    }
}

function crDog() {
    var fff=document.createElement("span");
    var aaa=document.getElementById("scrolltop");
    fff.innerHTML="<a hidefocus=\"true\" id=\"btdoge\"  class=\"returnlist\"  onclick=\"window.cgDog()\" style=\"background-color: #f26c4f;\" title=\"切换状态\"><b>切换状态</b></a>";
    aaa.appendChild(fff);
}
// onclick
function cgDog(params) {
    var flagdog=getCookie("sigpicdog");
    var sso=document.getElementById("btdoge");
    if (flagdog=="dog") {
        setCookie("sigpicdog","cat",180);
        hideDog(getDog());
        sso.style.backgroundColor="rgb(0,180,0)";
    } else {
        setCookie("sigpicdog","dog",180);
        showDog(getDog());
        //var sso=document.getElementById("btdoge");
        sso.style.backgroundColor="rgb(180,0,0)";
    }

}
function setCookie(cname,cvalue,exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
crDog();


(function() {
    'use strict';
    unsafeWindow.ccat=777;
    unsafeWindow.getDog=getDog;
    unsafeWindow.hideDog=hideDog;
    unsafeWindow.showDog=showDog;
    unsafeWindow.getCookie=getCookie;
    unsafeWindow.setCookie=setCookie;
    unsafeWindow.cgDog=cgDog;
    var xxdog=getCookie("sigpicdog")
    if (xxdog=="cat") {
        hideDog(getDog());
        var llodog = document.getElementById("btdoge");
        llodog.style.backgroundColor="rgb(0,180,0)";
    }
    console.log("欢迎使用签名档图片一键隐藏脚本 -- dogcraft(https://dogcraft.top)");
    // Your code here...
})();