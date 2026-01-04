// ==UserScript==
// @name         v1挂机 分通道
// @namespace    http://tampermonkey.net/
// @version      2024-02-05
// @description  v1挂机 分游戏影视剧通道 
// @author       You
// @match        https://live-monitor.wemomo.com/spam/hangup/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wemomo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487149/v1%E6%8C%82%E6%9C%BA%20%E5%88%86%E9%80%9A%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/487149/v1%E6%8C%82%E6%9C%BA%20%E5%88%86%E9%80%9A%E9%81%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
//window.onload=
    function fenlan(){
    var myframe = document.createElement("iframe");
document.querySelector("form").prepend(myframe)
// var mmid = document.querySelector("tr.ban-table-tr").cells[0].textContent
// myframe.src = 'https://live-monitor.wemomo.com/monitor/nickmonitor/index?keyword=&momoid=' + mmid
myframe.src = 'https://live-monitor.wemomo.com/spam/hangup/index?momoid=&roomid=&starttime=&endtime=&auditType=0&label=1-40'
        myframe.id='v1hangupf1'
myframe.onload = function() {
    myframe.width = '49%'
    myframe.contentWindow.document.querySelector('nav').remove()
    myframe.contentWindow.document.getElementById('live_time_form').remove()
    myframe.height = '500px'
}

var myfram2 = document.createElement("iframe");
document.querySelector("form").prepend(myfram2 )
// var mmid = document.querySelector("tr.ban-table-tr").cells[0].textContent
// myfram2 .src = 'https://live-monitor.wemomo.com/monitor/nickmonitor/index?keyword=&momoid=' + mmid
    myfram2.id='v1hangupf2'
myfram2 .src = 'https://live-monitor.wemomo.com/spam/hangup/index?momoid=&roomid=&starttime=&endtime=&auditType=0&label=12-1'
myfram2 .onload = function() {
    myfram2 .width = '49%'
    myfram2 .contentWindow.document.querySelector('nav').remove()
    myfram2 .contentWindow.document.getElementById('live_time_form').remove()
    myfram2 .height = '500px'
}

}
    if ( !(self.frameElement && self.frameElement.tagName == "IFRAME")) {
　　//alert('在iframe中');
         fenlan()
}

     function fangda(){

        document.querySelector('#v1hangupf2').style.height='500px'
    document.querySelector('#v1hangupf1').style.height='500px'
}
setInterval(fangda,2000)
    // Your code here...
})();