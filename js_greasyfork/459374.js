// ==UserScript==
// @name         AntAutoPost
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto post ant articles
// @author       snaillonely
// @match        *://s.alipay.com/life/web/fortune/publishNew*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459374/AntAutoPost.user.js
// @updateURL https://update.greasyfork.org/scripts/459374/AntAutoPost.meta.js
// ==/UserScript==
function toIsoString(date) {
    var pad = function(num) {
        return (num < 10 ? '0' : '') + num;
    }

    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
}
var countDown

(function() {
    'use strict';

    let btn1 = document.createElement('input')
    btn1.type = 'datetime-local'
    btn1.step = '30'
    btn1.style.margin = "8px"
    let btn2 = document.createElement('input')
    btn2.type = 'radio'
    btn2.id = 'auto_post_checkbox'
    btn2.name = 'auto_post'
    btn2.style.margin = "8px"
    let label2 = document.createElement('label')
    label2.textContent = '定时发送'
    label2.setAttribute('for', 'auto_post_checkbox')
    label2.style.margin = "8px"
    let btn3 = document.createElement('input')
    btn3.type = 'radio'
    btn3.id = 'auto_vip_post_checkbox'
    btn3.name = 'auto_post'
    btn3.style.margin = "8px"
    let label3 = document.createElement('label')
    label3.textContent = '定时推送'
    label3.setAttribute('for', 'auto_vip_post_checkbox')
    label3.style.margin = "8px"
    let btn4 = document.createElement('input')
    btn4.type = 'radio'
    btn4.id = 'no_post_checkbox'
    btn4.name = 'auto_post'
    btn4.style.margin = "8px"
    let label4 = document.createElement('label')
    label4.textContent = '让我休息会儿'
    label4.setAttribute('for', 'no_post_checkbox')
    label4.style.margin = "8px"

    let divBtn = document.createElement('div')
    divBtn.appendChild(btn1)
    divBtn.appendChild(btn2)
    divBtn.appendChild(label2)
    divBtn.appendChild(btn3)
    divBtn.appendChild(label3)
    divBtn.appendChild(btn4)
    divBtn.appendChild(label4)
    divBtn.setAttribute('class', 'buttonContainer___g_Ssy')
    // divBtn.addEventListener('click', () => { btn2.click() })

    function clickEvent () {
        if (btn2.checked || btn3.checked) {
            if (btn3.checked) {
                var vipPostBtn = document.querySelector("#react-root > div > div.main-content > div:nth-child(8) > span > button")
                if (vipPostBtn == null || vipPostBtn.disabled) {
                    btn2.click()

                    alert("今天的推送机会已用完")
                    return
                } else {
                    GM_log("start auto vip post...")
                }
            }

            if (btn2.clicked) {
                GM_log("start auto post...")
            }

            if (countDown == null) {
                countDown = setInterval(() => {
                    let myDate = new Date();
                    let current = toIsoString(new Date())
                    GM_log("current time is: " + current + " and post time is: " + btn1.value)
                    var btn
                    if (btn1.value != "" && btn1.value <= current) {
                        if (btn2.checked) {
                            btn = document.querySelector("#react-root > div > div.main-content > div.buttonContainer___g_Ssy > button.ant-btn.ant-btn-primary")
                        }
                        if (btn3.checked) {
                            btn = document.querySelector("#react-root > div > div.main-content > div:nth-child(8) > span > button")
                        }
                        btn4.click()

                        btn.click()
                        GM_log("auto post")
                    }
                    // 每 10 分钟调用一次保存，防止页面过期自动退出
                    if (current.split(":")[1].endsWith("0")) {
                        GM_log("auto save...")
                        document.querySelector("#react-root > div > div.main-content > div.buttonContainer___g_Ssy > button:nth-child(2)").click()
                    }
                }, 60000)
            }
        } else {
            clearInterval(countDown)
            GM_log("stop auto post countDown...")
            countDown = null
        }
    }

    btn2.addEventListener('click', clickEvent)
    btn3.addEventListener('click', clickEvent)
    btn4.addEventListener('click', clickEvent)

    var searchTime = 0
    let searchMainContent = setInterval(() => {
        let temp = document.querySelector("#react-root > div > div.main-content")
        if (temp == null) {
            GM_log('can not find the button')
            searchTime++
            if (searchTime == 10) {
                alert('版本过低，请联系开发人员升级')
                clearInterval(searchMainContent)
            }
        } else {
            temp.appendChild(divBtn)
            btn4.click()
            clearInterval(searchMainContent)
        }
    }, 1000)
})();