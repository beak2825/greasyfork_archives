// ==UserScript==
// @name         DouBan+
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  豆瓣自定义辅助功能
// @author       silviode
// @include      https://*.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477990/DouBan%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/477990/DouBan%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.matchMedia('(prefers-color-scheme:dark)').matches){
        showDark()
    }
    
    showPlace(".pubtime")
    showPlace(".comment-location")
    showPlace(".title")
    showPlace("span")

    // 查找我的回复内容
    if (false){
      let b = document.body.innerText.matchAll(/silviode/g)
      let c = [...b]
      if (c.length < 2){
          document.getElementsByClassName("next")[0].children[1].click()
      }
    }

})();

function showPlace(item,name="上海"){
    let placeTags = document.querySelectorAll(item)
    placeTags.forEach(e=>{
        if(e.innerText.includes(name)){
            e.style.backgroundColor = "gold"
        }
    })
}


function showDark(){
    // let bgcolor = "#38393D"
    let bgcolor = "#404245"
    let fontColor = "#999"

    document.bgColor = bgcolor
    let ColorList = ["div","p","h1","input"]
    ColorList.forEach(e=>{
        setColor(e,fontColor)
    })
    let bgColorList = ["html",".author","textarea", "input",".nav",".popular-hd",".nav-wrap",".inp",
                       ".meta-header",".subject-item",".short-note",".bg-img-green","h4",".block",".highlighter"]
    bgColorList.forEach(e=>{
        setBackgroundColor(e,bgcolor)
    })


}

function setBackgroundColor(item,color){
    document.querySelectorAll(item).forEach(function(value){
        value.style.backgroundColor = color
        value.style.borderBottom = "none"
        value.style.backgroundImage = "none"
        value.style.background = "none"
    })
}

function setColor(item,color){
    document.querySelectorAll(item).forEach(function(value){
        value.style.color = color
    })
}


