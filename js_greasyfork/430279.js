// ==UserScript==
// @name         merchbar
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  1
// @author       You
// @match        https://www.merchbar.com/*
// @icon         https://www.google.com/s2/favicons?domain=merchbar.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430279/merchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/430279/merchbar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.createElement("div")
    var btn = document.createElement("button")
    var n = document.getElementById("__next")
    n.parentNode.insertBefore(div, n)
    n.parentNode.insertBefore(btn, n)
    function getUrls(){
        var a = document.querySelectorAll(".SearchInterface_productsContainer__3sreJ .MerchTile_imageContainer__v21uF img")
        var urls=[];a.forEach((i)=>{
            urls.push(i.alt+","+i.src.replace(/\?w.*/g,""))
        })
        //div写入链接
        var res = urls.join("<br>")
        div.innerHTML = res
    }
    var flag = 1
    function show(){
        getUrls()
        if(flag%2){div.style.display = "block"}
        else {div.style.display = "none"}
        flag += 1
    }
    //btn绑定点击事件
    btn.onclick = ()=>(show())

    //修改样式
    div.style.display = "none"
    div.style.position = "absolute"
    div.style.background = "white"
    div.style.paddingTop = "40px"
    div.style.zIndex = 99999
    btn.innerText = "Toggle"
    btn.style.zIndex = 999999
    btn.style.position = "absolute"
})();