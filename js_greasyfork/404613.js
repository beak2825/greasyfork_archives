// ==UserScript==
// @name         NTCU autoverygood
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://careerweb.ntcu.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404613/NTCU%20autoverygood.user.js
// @updateURL https://update.greasyfork.org/scripts/404613/NTCU%20autoverygood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // your code here
    var buttonIn = document.getElementById("bg_text3")
    let btn = document.createElement("button")
    let btnFinish = document.getElementById("btnFinish")
    let btnNext = document.getElementById("btnNext")


        btn.innerText = "開始自動寫"
        btn.setAttribute('type', 'button')
        btn.addEventListener('click', function() {
            let d = prompt("輸入數字，1上無滿意 5上滿意:)")
            let s = document.querySelectorAll('input')
            Array.prototype.forEach.call(s, function(item){
                if (item.id.endsWith('_'+d)) {
                    item.checked = true
                }
            })
            btnFinish.click()
            return false
        })
        buttonIn.appendChild(btn)
            document.querySelector('form').setAttribute("_lpchecked", "1")
            let btn_feedback = document.createElement("button")
            btn_feedback.innerText = "開始自動寫課程回饋評量"
            btn_feedback.setAttribute('type', 'button')
            btn_feedback.addEventListener('click', function() {
            let d = prompt("輸入數字，1上無好 5上好:)")
            let s = document.querySelectorAll('input')
            Array.prototype.forEach.call(s, function(item){
                item.value = d
                ValidateNumber($(item),d)

            })
            return false
            })
        buttonIn.appendChild(btn_feedback)



})();