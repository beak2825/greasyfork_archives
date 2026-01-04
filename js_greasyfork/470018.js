// ==UserScript==
// @name         网页里面简单的提醒能力
// @namespace    https://leochan.me
// @version      1.0.1
// @description  网页一个简单的提醒
// @author       Leo
// @license      GPLv2
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @grant        none
// ==/UserScript==
 
function webPageShowMessage(msg, duration){
    duration = duration || 5000;
    let e = document.createElement('div');
    e.style.cssText = "position:fixed;top:10%;background:rgba(0,0,0,0.7);color:#fff;padding:10px 0;width:200px;left:50%;margin-left:-50px;text-align:center;border-radius:5px;z-index:9999999;";
    e.textContent = "" + msg;
    document.body.appendChild(e);
    setTimeout(function(){
        document.body.removeChild(e);
    }, duration);
}