// ==UserScript==
// @name         bilibili三连按钮demo
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2
// @description  给bilibili增加一个真三连按钮
// @author       wfma
// @license      GPL License
// @match        https://www.bilibili.com/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/475393/bilibili%E4%B8%89%E8%BF%9E%E6%8C%89%E9%92%AEdemo.user.js
// @updateURL https://update.greasyfork.org/scripts/475393/bilibili%E4%B8%89%E8%BF%9E%E6%8C%89%E9%92%AEdemo.meta.js
// ==/UserScript==

let tail="\n----臭水沟捞的奔腾机";


let hookXhrSend=XMLHttpRequest.prototype.send
XMLHttpRequest.prototype.send=function(body){
    console.log(body);
    if(/&message=(.*?)&/.test(body)){
        //替换body内容
        body=body.replace(/&message=(.*?)&/,"&message=$1"+encodeURIComponent(tail)+"&");
    }
    hookXhrSend.apply(this,[body]);
}




