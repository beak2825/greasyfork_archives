// ==UserScript==
// @name         飞机场签到
// @namespace    https://greasyfork.org/zh-CN/users/27033-qshy-sun
// @version      20190421
// @description  自用SSPANEL签到
// @author       QQ422343003
// @grant        none
// @include      *//zcssr.me/*

// @downloadURL https://update.greasyfork.org/scripts/382086/%E9%A3%9E%E6%9C%BA%E5%9C%BA%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382086/%E9%A3%9E%E6%9C%BA%E5%9C%BA%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

var wait = 1500;

if(isURL("zcssr.me")){
    var url = location.href;
    if(url.indexOf("/user/") > 0) {
        //zcssr.me
        setTimeout(function(){
            document.getElementById('checkin').click();
        },wait);
    }
}

function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
        return true;
    }else{
        return false;
    }
}