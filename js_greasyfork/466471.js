// ==UserScript==
// @name         定时刷新页面
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  每隔5分钟自动刷新当前网页！
// @author       pjw250
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466471/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466471/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let timer = null
    let timeNum = 60 * 5 * 1000
    let start = localStorage.getItem("startRefresh")
    // 在iframe中，不插入按钮
    if(window.frames.length === parent.frames.length){
        createEle()
    }
    if(start){
        document.getElementById("startRefresh").innerText = "停止"
        refreshPage()
    }else{
        document.getElementById("startRefresh").innerText = "开始"
    }
    function createEle(){
        let elem = document.createElement("div")
        let text = document.createTextNode("开始")
        elem.appendChild(text)
        const eleStyle = {
            width: "50px",
            height: "50px",
            background: "rgba(140, 244, 46, .4)",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            cursor: 'pointer',
            userSelect: "none",
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 999
        }
        let keys = Object.keys(eleStyle)
        keys.forEach((item, i)=>{
            elem.style[item] = eleStyle[item]
        })
        elem.setAttribute("id", "startRefresh")
        elem.addEventListener("click", ()=>{
            start = localStorage.getItem("startRefresh")
            if(start){
                document.getElementById("startRefresh").innerText = "开始"
                localStorage.removeItem("startRefresh")
                clearInterval(timer)
                timer = null
            }else{
                document.getElementById("startRefresh").innerText = "停止"
                refreshPage()
            }
        })
        document.body.appendChild(elem)
    }
    function refreshPage(){
        if(!start){
            localStorage.setItem("startRefresh", true)
        }
        timer = setTimeout(()=>{
            if(timeNum < 0){
                location.reload()
            }else{
                let min = Math.floor(timeNum / 1000 / 60)
                let second = Math.floor((timeNum - (min * 60 * 1000)) / 1000)

                min < 10 && (min = '0' + min)
                second < 10 && (second = '0' + second)

                document.getElementById("startRefresh").innerText = min+':'+second
                timeNum = timeNum - 1000
                refreshPage()
            }
        }, 1000)
    }
})();