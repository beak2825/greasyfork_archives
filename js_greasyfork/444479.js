// ==UserScript==
// @name         隐藏B站首页推荐视频 只留一个搜索栏
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一寸光阴一寸金
// @author       You
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444479/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%20%E5%8F%AA%E7%95%99%E4%B8%80%E4%B8%AA%E6%90%9C%E7%B4%A2%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444479/%E9%9A%90%E8%97%8FB%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%20%E5%8F%AA%E7%95%99%E4%B8%80%E4%B8%AA%E6%90%9C%E7%B4%A2%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const InputBoxPlaceHolder = "bilibili 在此处搜索"

    //window.addEventListener('load', ()=>{
        const newStyle = document.createElement("style")
        newStyle.innerHTML = `

        body {
            overflow: hidden;
        }

        .left-entry , .right-entry, .trending{
            display: none !important;
        }

        .center-search-container{

            position: fixed;
            width: 700px;
            top: 20vh;
            left: 50vw;
            transform: translate(-50%, -50%);
            z-index: 99999;
        }
        

        `
        document.head.appendChild(newStyle)

        const coverDiv = document.createElement("div")
        coverDiv.id = "content-cover"
        coverDiv.style.position = "fixed";
        coverDiv.style.backgroundColor = "white";
        coverDiv.style.left = "0px";
        coverDiv.style.top = "0px";
        coverDiv.style.width = "100%";
        coverDiv.style.height = "100%";
        coverDiv.style.zIndex = "999";
        document.body.appendChild(coverDiv)



    //})

     window.addEventListener('load', ()=>{
        var intv = setInterval(()=>{
            var inputBox = document.querySelector(".nav-search-input")
            if(inputBox != void 0){
                clearInterval(intv)
                setInterval(()=>{
                    if(inputBox.placeholder != InputBoxPlaceHolder){
                        inputBox.placeholder = InputBoxPlaceHolder
                    }
                }, 30)
            }
        }, 10)
    })

    // Your code here...
})();