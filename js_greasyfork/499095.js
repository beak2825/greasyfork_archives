// ==UserScript==
// @name         飞卢下载器
// @version     1.0
// @namespace    zzz
// @description  下载飞卢小说工具
// @author       wanyuer
// @match        *://*.faloo.com/*
// @icon         https://s.faloo.com/novel/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499095/%E9%A3%9E%E5%8D%A2%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499095/%E9%A3%9E%E5%8D%A2%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toastDom = document.createElement('div');
    toastDom.innerHTML = "下载";
    toastDom.style.cssText='position:fixed;top:40%;right:0;z-index:9999;width:50px;height:30px;line-height:30px;text-align:center;color:#fff;background-color:#009966;cursor:pointer;border-radius:5px;user-select:none'
    document.body.appendChild(toastDom);

    function download(){
        let text = []
        let nodes = document.querySelectorAll(".noveContent p")
        let title ="第" + document.querySelector(".c_l_title h1").textContent.split("第")[1]
        console.log(title)
        if(nodes){
            for(let item of nodes){
                text.push(item.textContent)
            }
        }
        text.unshift(title)
        const finalText = text.join("\n")
        let a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + finalText
        a.download = title
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    toastDom.onclick = function () {
        download()
    }

})();