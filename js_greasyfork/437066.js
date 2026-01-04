// ==UserScript==
// @name         云诊室时延监控
// @namespace    guahao.com
// @version      1.0
// @description  监听所有xhr请求,并计算平均时延.
// @author       aoqh
// @match        *://consult.guahao.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437066/%E4%BA%91%E8%AF%8A%E5%AE%A4%E6%97%B6%E5%BB%B6%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/437066/%E4%BA%91%E8%AF%8A%E5%AE%A4%E6%97%B6%E5%BB%B6%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==
var startup = function() {
    var XMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    var timeArr = [];
    var div;
    var changeDelay = function(delay){
        if(document.getElementsByClassName("right-box").length==0 ||document.getElementsByClassName("co-hospital")[0].length==0){
            return;
        }
        if(div==null){
            div = document.createElement('div');
            div.setAttribute('style', 'display:inline-block;font-size:14px;margin-right:16px;cursor:pointer;color:green;font-weight: bolder;');
            document.getElementsByClassName("right-box")[0].insertBefore(div,document.getElementsByClassName("co-hospital")[0]);
        }
        div.innerText=delay+"ms";
        if(delay<=300){
            div.style.color="green";
        };
        if(delay>300 && delay<=1000){
            div.style.color="#FFB74D";
        };
        if(delay>1000){
            div.style.color="red";
        };
    };
    setInterval(()=>{
        const timeArrlength = timeArr.length;
        if(timeArrlength==0){
            return;
        };
        var total = 0;
        var item;
        while(item = timeArr.pop()){
            total +=item;
        };
        changeDelay(Math.floor(total/timeArrlength));
    },5000);
    XMLHttpRequest.prototype.open = function() {
        const timeStart = Date.now();
        var timeDiffEvent = function(){
            timeArr.push(Date.now()-timeStart);
        };
        this.addEventListener("load", timeDiffEvent);
        this.addEventListener("error", timeDiffEvent);
        this.addEventListener("abort", timeDiffEvent);
        this.addEventListener("timeout", timeDiffEvent);

        XMLHttpRequestOpen.apply(this, arguments);
    };
};
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.innerText = '(' + String(startup) + '())';
document.body.appendChild(script);