// ==UserScript==
// @name         hostloc checkin
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  add button to get hostloc credit through visit others' space
// @author       harryhare
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://www.hostloc.com/**
// @match        http://www.hostloc.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40444/hostloc%20checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/40444/hostloc%20checkin.meta.js
// ==/UserScript==


var i=0;
var button;
function visit(){
    if(i>=15){
        return;
    }
    var xmlhttp=new XMLHttpRequest();
    var url="/space-uid-"+(i+28939)+".html";
    console.log('visit',url);
    i++;
    xmlhttp.open("GET",url,true); //第三个参数是同步异步,主线程只能异步
    xmlhttp.onreadystatechange=visit;
    xmlhttp.send();
}


//time delay
var interval=500;
function visit2() {
    if(i>=15){
        interval_id=window.clearInterval(interval_id);
        return;
    }
    var xmlhttp=new XMLHttpRequest();
    var url="/space-uid-"+i+".html";
    console.log('visit',url);
    i++;
    button.innerHTML=String((i*100./15).toFixed(0))+"%";
    xmlhttp.open("GET",url,true); //第三个参数是同步异步,主线程只能异步
    xmlhttp.send();
}
var interval_id;

(function() {
    'use strict';

    var target=document.getElementById("extcreditmenu");
    if(!target){
        return;
    }
    button=document.createElement('button');
    button.innerHTML='签到';
    button.onclick=(e)=>{
        //visit();
        interval_id= window.setInterval(visit2,interval);
    };
    target.parentElement.prepend(button);

})();