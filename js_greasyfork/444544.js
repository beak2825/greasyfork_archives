// ==UserScript==
// @name         定时重连
// @namespace    authysu
// @version      0.0.3
// @description  自动断线重连校园网
// @author       任zc
// @match        *://auth.ysu.edu.cn/*
// @match        *://10.11.0.1/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444544/%E5%AE%9A%E6%97%B6%E9%87%8D%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/444544/%E5%AE%9A%E6%97%B6%E9%87%8D%E8%BF%9E.meta.js
// ==/UserScript==

//刷新页面，似乎没必要
//location.reload();

//劫持confirm
unsafeWindow.confirm = function(){return 1};
window.confirm = function(){return 1};
Window.prototype.confirm = function(){return 1};
function redir(){
    window.location.href="http://10.11.0.1"
}

function logout(){
    if(!document.querySelector("#toLogOut")){
        //没有找到注销,不再执行后续代码
        return;
    }
    document.querySelector("#toLogOut").click();
}
function relogin(){
    if(!document.querySelector("#offlineDiv")){
        //没找到重登
        //setTimeout(redir, 60000) //假如一分钟都没连上，重定向
        return;
    }
    document.querySelector("#offlineDiv").click();
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString()
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

//设置重连的时间
var uh = 4
var um = 0
var us = 0

var myDate = new Date();

function calctimespan(myDate){
    var hnow = myDate.getHours();
    var mnow = myDate.getMinutes();
    var snow = myDate.getSeconds();
    var hspan = (uh - hnow + 24) % 24
    var mspan = um - mnow
    var sspan = us - snow
    var timespan = (60*60*hspan + 60*mspan + sspan)*1000
    if(4 == hnow && 0 == mnow){
        timespan = 60*60*24*1000
    }
    return timespan
}

var timespan = calctimespan(myDate)
window.onload = function (){

}
setTimeout(logout, timespan);
//注销5秒后重连
setTimeout(relogin, 5000)


window.onload = function(){

    if(!document.querySelector("#toLogOut") && !document.querySelector("#offlineDiv") && !document.querySelector("#SLoginBtn_1")){
        setTimeout(redir, 60000) //两者皆非就隔段时间重连
    }else if(document.querySelector("#toLogOut")){
        var hello=1
    }else{
        setTimeout(function(){
            if(document.querySelector("#SLoginBtn_1")){
                redir()
            }
        }, 60000)
    }
    setTimeout(function(){
        var myname = document.getElementById('userName');
        myname.innerHTML = "无量天高智勇道德圣玉真上贤明大帝"
    }, 3000)
    var date = new Date();
    var welmsg = document.getElementById('userMessage');
    welmsg.innerHTML = "上次刷新时间：" + dateFormat("YYYY-mm-dd HH:MM", date);

}

//if(!document.querySelector("#toLogOut")){
//    setTimeout(redir, 60000) //假如一分钟都没连上，重定向
//}