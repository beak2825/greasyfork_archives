// ==UserScript==
// @name         ZJUT 学评教快速打分
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于 ZJUT 教务系统学评教快速打分
// @author       qww
// @match        http://www.gdjw.zjut.edu.cn/jwglxt/xspjgl/kcgcpj_cxKcgcpjxxIndex.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zjut.edu.cn
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/516012/ZJUT%20%E5%AD%A6%E8%AF%84%E6%95%99%E5%BF%AB%E9%80%9F%E6%89%93%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/516012/ZJUT%20%E5%AD%A6%E8%AF%84%E6%95%99%E5%BF%AB%E9%80%9F%E6%89%93%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("script")
    const control = document.createElement("div")
    control.id = "control-div"
    document.body.appendChild(control)
    control.style = ""
    const button = document.createElement("button")
    control.appendChild(button)
    button.innerText = "next"
    const score = [60, 75, 90, 100]
    let choosed_score = 100
    score.forEach(item=>{
        const label = document.createElement("label")
        const radio = document.createElement("input")
        if(item === choosed_score) {
            radio.checked = true
        }
        label.innerText = item + "分"
        label.appendChild(radio)
        label.value = item
        radio.type = "radio"
        radio.name = "score"
        radio.value = item
        control.appendChild(label)
        label.addEventListener("click", ()=>{
            choosed_score = item
        })
    })
    button.addEventListener("click", ()=>{
        const teacher = document.querySelector("ul.mui-table-view#wpjkc>li>div.item.mui-clearfix")
        teacher.click()
        console.log(teacher)
        const timeout = window.setInterval(()=>{
            const choose = document.querySelectorAll("div.cs[data-dyf=\"" + choosed_score + "\"]")
            console.log(choose)
            if(choose.length > 0) {
                choose.forEach(item=>{
                    item.click()
                })
                clearInterval(timeout)
            }
        }, 1000)
        const submit_check = window.setInterval(()=>{
            const submit = document.querySelector("button.mui-btn-block.mui-btn-blue[type=\"submit\"]#submit")
            if(submit){
                submit.click()
                clearInterval(submit_check)
            }
        }, 1000)
        const enter_check = window.setInterval(()=>{
            const enter=document.querySelector("button#btn_ok")
            if(enter){
                enter.click()
                clearInterval(enter_check)
            }
        }, 1000)
    })
    // Your code here...
})();