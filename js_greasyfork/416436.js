// ==UserScript==
// @name         去除标题中的(消息提示)
// @version      1.1
// @description  知乎，CSDN等网站打开时，浏览器的标题栏会显示消息提示，例如「(10条消息)首页 - 知乎」，「(5条消息)某CSDN博客」。本脚本可以去除标题中括号里的消息这一段文字，简化标签。
// @author       Zhou Yucheng
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/416436/%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E4%B8%AD%E7%9A%84%28%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416436/%E5%8E%BB%E9%99%A4%E6%A0%87%E9%A2%98%E4%B8%AD%E7%9A%84%28%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%29.meta.js
// ==/UserScript==

function removeNotification () {
    let t=document.querySelector("head > title")
    let s=t.innerHTML
    console.log('title', s)

    let i=s.indexOf('(')
    let k=s.indexOf('消息')
    let j=s.indexOf(')')
    if (i==0 && i<k && k<j){ 
        t.innerHTML = s.substring(j+1).trim()
        document.title = t.innerHTML
    }

    i=s.indexOf('（')
    j=s.indexOf('）')
    if (i==0 && i<k && k<j){
        t.innerHTML=s.substring(j+1).trim()
        document.title = t.innerHTML
    }
}


(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', () => setInterval(removeNotification, 500));   
    window.addEventListener('load', () => setInterval(removeNotification, 500));
})();
