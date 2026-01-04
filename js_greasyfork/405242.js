// ==UserScript==
// @name         Mykirito Auto Click
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://mykirito.com/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/405242/Mykirito%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/405242/Mykirito%20Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

// ===========================
    let action_index = 4
    // 2:狩獵兔肉 3:自主訓練 4:外出野餐 5:汁妹 6:做善事 7:坐下休息 8:釣魚

    let boss = true // 是否打贏Boss
    let token = "Your Token Here" // 填入開發人員工具 Application 中的 token

    let select_delay = 1 // 起始延遲（為了規避樓層獎勵的按鈕選擇錯誤
// ===========================

let counter = 1
let button_index = action_index
let target = ""
const action = ['hunt2', 'train2', 'eat2', 'girl2', 'good2', 'sit2', 'fish2',]

if (boss){
    button_index += 1
}

// 延遲半秒等待
setTimeout(()=>{
    target = document.querySelectorAll('button')[button_index]
    console.log('選擇的行動為:', target.innerText)

    target.click()
    console.log('起始點擊')
    autoclick()
}, select_delay * 1000)

function autoclick() {
    let action_delay = Math.floor(Math.random() * 10 + 81);
    setTimeout(() => {
        if (document.querySelector('iframe')){
            CaptchaAction()
        }

        console.log(`此次頁面已經行動 ${counter++} 次，下次延遲時間為 ${action_delay} 秒`)
        target.click()
        autoclick()
    }, action_delay * 1000)
}

function sendrequest(action_index, hCaptchaToken) {
    let data = {
        action: action[action_index - 2],
        hCaptchaToken: hCaptchaToken
    }
    fetch(`https://mykirito.com/api/my-kirito/doaction?u=${token.split('.')[0]}`, {
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "token": token
        },
        "body": JSON.stringify(data),
        "method": "POST",
    })
    .then(res=>{
        if (res.status == 200){
            window.location = window.location
        }
    })
}

function GetCaptchaToken() {
    return new Promise(function (resolve, reject) {
        fetch("https://mykirito.yaminoma.moe/")
            .then(res => { return res.text() })
            .then(result => {
                console.log(result)
                resolve(result)
            })
    })
}

async function CaptchaAction() {
    let hCaptchaToken = await GetCaptchaToken()
    sendrequest(button_index, hCaptchaToken)
}
})();