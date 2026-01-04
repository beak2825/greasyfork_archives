// ==UserScript==
//  @name           矿大校园网自动登录
//  @description    clicks login for me in school's page, and closes the useless tabs. 矿大校园网网页登录自动点击，并且关闭随后的弹窗
//  @match          http://202.112.208.3/a70.htm
//  @match          https://www.msn.com/*
//  @match          http://dns.weixin.qq.com/cgi-bin/micromsg-bin/*
//  @author         Messi
//  @version        1.6.2
// @namespace https://greasyfork.org/users/162524
// @downloadURL https://update.greasyfork.org/scripts/368266/%E7%9F%BF%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/368266/%E7%9F%BF%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var loginBtn = document.getElementsByClassName("edit_lobo_cell");
var flag = false;  //这里设为全局变量了
var msnRedirect = "www.msn.com";
var vxdnsRedirect = "dns.weixin.qq.com";
var hostname = window.location.hostname;

if (hostname == msnRedirect || hostname == vxdnsRedirect) {
    window.setTimeout('console.log(\'2 seconds\')', 2000);
    window.close();
} else if (loginBtn) {
    loginBtn[0].click();
    flag = true;
}

console.log("flag =", flag);
setTimeout(tabClose, 3000);

function tabClose() {
    var xywTab = window.self;
    if (flag) {
        xywTab.close();
    } else {
        console.log("Failed");
    }
}