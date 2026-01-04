// ==UserScript==
// @name         officialband
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  1
// @author       You
// @match        https://www.officialbandshirts.com/*
// @icon         https://www.google.com/s2/favicons?domain=officialbandshirts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431321/officialband.user.js
// @updateURL https://update.greasyfork.org/scripts/431321/officialband.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.querySelectorAll(".product-item-image img")
    var b = []
    a.forEach((i)=>{
        //960w, 1280w...
        //b.push(i.alt + "," + i.src.replace("160w","960w"))})
        b.push(i.src.replace("160w","960w"))})
    var div = document.createElement("div")
    var btn = document.createElement("button")
    let main = document.querySelector(".main-content")
    main.parentNode.insertBefore(div, main)
    main.parentNode.insertBefore(btn, main)
    //div写入链接
    var res = b.join("<br>")
    div.innerHTML = res
    var flag = 1
    function show(){
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
    div.style.zIndex = 999
    btn.innerText = "Toggle"
    btn.style.zIndex = 999999
    btn.style.position = "absolute"
})();