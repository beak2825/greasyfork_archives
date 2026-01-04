// ==UserScript==
// @name         b站稍后再看链接替换 (已失效)
// @version      0.70
// @description  稍后再看链接替换
// @author       dyxlike
// @match        https://www.bilibili.com/watchlater/
// @grant        none
// @namespace https://github.com/dyxcloud
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/375936/b%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375936/b%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%20%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


//v0.7 更精确的链接替换范围
//v0.6 更新正则表达式, 适配b站新的BV号, 去掉了原来AV号的后发断言

const reWatch = /watchlater\/#/
const reP = /\/p(?=\d+)/
/**
 * @description 转换url
 * www.bilibili.com/watchlater/#/av75216330/p2 
 * to 
 * www.bilibili.com/video/av75216330?p=2
 * 
 * www.bilibili.com/watchlater/#/BV1mE411F7tV/p1
 * to
 * www.bilibili.com/video/BV1mE411F7tV?p=1
 */
function transUrl(str){
    str = str.replace(reWatch, "video");
    str = str.replace(reP, "?p=");
    return str;
}

function getTargets(){
    let result =document.querySelectorAll('a.av-pic,.av-about>a');
    console.log(result.length);
    return result;
}

function trans() {
    let elements = getTargets();
    for (let e of elements) {
        let str = e.getAttribute("href");
        if (str != null && str.indexOf("/watchlater/#") != -1) {
            console.log("geted!!" + str);
            e.setAttribute('href', transUrl(str));
            e.setAttribute('target', "_blank");
        }
    }
}

let timesRun = 0;
let timer = setInterval(function(){
    if(timesRun >= 6){    
        clearInterval(timer);    
    }
    timesRun++;
    trans();
},500);



})();