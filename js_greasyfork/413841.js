// ==UserScript==
// @name         知乎/简书跳转&点击关闭登录等
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  知乎/简书跳转！
// @author       o1hy
// @match        https://*.zhihu.com/*
// @match        http://*.zhihu.com/*
// @match        https://www.jianshu.com/*
// @match        http://www.jianshu.com/*
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/413841/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E8%B7%B3%E8%BD%AC%E7%82%B9%E5%87%BB%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/413841/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E8%B7%B3%E8%BD%AC%E7%82%B9%E5%87%BB%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E7%AD%89.meta.js
// ==/UserScript==

function getTarget(step){

    let target = window.location.href.split(step)[1];
    target = unescape(target);
    return target;

}

function closeZhiHu(){
        let close_button = document.getElementsByClassName("Button Modal-closeButton Button--plain")[0];
        if (close_button){
           close_button.click()
        }
}

function waitForElementToDisplay(selector, time, callback) {
        if(document.querySelector(selector)!=null) {
            callback();
            return true;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time,callback);
            }, time);
        }
    }
function waitForElementToDisplayByCSS(className, time, callback){
   if(document.getElementsByClassName("Button Modal-closeButton Button--plain")[0]!=null){
       callback();
       return true;
   }else{
       setTimeout(function() {
                waitForElementToDisplayByCSS(className, time, callback);
            }, time);
   }
}

(function() {
    'use strict';
    var target;
    if(window.location.host == "www.jianshu.com"){
        target = getTarget("url=");
    }else if(window.location.host == "link.zhihu.com"){
        target = getTarget("target=");
    }else{
        target = "undefined";
    }
    if(target!=="undefined"){
           window.location = target;
    }
    if(window.location.href.includes("zhihu.com")){
        waitForElementToDisplayByCSS("Button Modal-closeButton Button--plain",100,closeZhiHu)
    }
})();