// ==UserScript==
// @name         获取更换Red图片链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.redbubble.com/*
// @icon         https://www.google.com/s2/favicons?domain=redbubble.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430091/%E8%8E%B7%E5%8F%96%E6%9B%B4%E6%8D%A2Red%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/430091/%E8%8E%B7%E5%8F%96%E6%9B%B4%E6%8D%A2Red%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let p = document.createElement("p")
    let button = document.createElement("button")
    button.innerText = "Refresh"
    let app = document.getElementById("app")
    let pNode = app.parentNode
    pNode.insertBefore(p,app)
    pNode.insertBefore(button,p)
    function res(){
        let i = document.querySelectorAll(".GalleryImage__img--12Vov")
        console.log(i)
        let urls = []
        i.forEach((u)=>{urls.push(u.src.replace(/,/g, "%2C"))})
        p.innerHTML = urls.join("<br>")
        console.log(p)
    }
    res()
    button.addEventListener("click",res)
})();