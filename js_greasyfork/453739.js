// ==UserScript==
// @name         校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  萍乡学院校园网自动登录
// @author       五等分的商鞅
// @match        http://40.11.3.2/a70.htm
// @match        http://40.11.3.2/1.htm
// @icon         https://cas.pxc.jx.cn/lyuapServer/favicon.ico
// @grant        none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/453739/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453739/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
/*
     请在下方依次填入账号（account），密码（password），运营商（operator）
     运营商代号：中国电信（1），中国移动（2），中国联通（3），校园网（'').
 */
var data=[
    {account:'xxx',password:'xxx',operator:'',},//这个就是校园网的例子
    {account:'xxx',password:'xxx',operator:'',},//这个是第二个账号，支持多个账号，上不封顶
];
var num=1;//把这个变量设置为你想要的账号的序号
window.onkeyup=function(e){
    e.keyCode===67&&close()
}
var mm=document.querySelectorAll(".edit_lobo_cell");
    mm[1].value=data[num-1].account;
    mm[2].value=data[num-1].password;
    mm[3].value=data[num-1].operator;
    mm[0].click();
})();