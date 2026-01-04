// ==UserScript==
// @name         移除 新浪博客 "我们的产品需要安装flashplayer..."
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Sina blog anoyying 'Flash needed' alert! 移除 "我们的产品需要安装flashplayer 10或更高版本，请 点击此处 免费下载"
// @author       blurhy
// @match        *://blog.sina.com.cn/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373976/%E7%A7%BB%E9%99%A4%20%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%20%22%E6%88%91%E4%BB%AC%E7%9A%84%E4%BA%A7%E5%93%81%E9%9C%80%E8%A6%81%E5%AE%89%E8%A3%85flashplayer%22.user.js
// @updateURL https://update.greasyfork.org/scripts/373976/%E7%A7%BB%E9%99%A4%20%E6%96%B0%E6%B5%AA%E5%8D%9A%E5%AE%A2%20%22%E6%88%91%E4%BB%AC%E7%9A%84%E4%BA%A7%E5%93%81%E9%9C%80%E8%A6%81%E5%AE%89%E8%A3%85flashplayer%22.meta.js
// ==/UserScript==
document.body._appendChild=document.body.appendChild
document.body.appendChild=function process(stuff){
    if(stuff.innerText!== "提示标题关闭 " && stuff.id!=="ramdomVisitDiv"){
        document.body._appendChild(stuff);
    }
    else{
        console.log(stuff)
    }
}